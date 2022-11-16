import { parse as parseArn } from "@aws-sdk/util-arn-parser";
import { createAppAuth } from "@octokit/auth-app";
import { createTokenAuth } from "@octokit/auth-token";
import { createUnauthenticatedAuth } from "@octokit/auth-unauthenticated";
import { OctokitOptions } from "@octokit/core/dist-types/types";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types"; // eslint-disable-line import/no-extraneous-dependencies
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import {
  OnEventHandler,
  OnEventRequest,
  OnEventResponse,
} from "aws-cdk-lib/custom-resources/lib/provider-framework/types"; // eslint-disable-line import/no-unresolved
import { SecretsManager, SSM } from "aws-sdk";
import { AuthenticationStrategy, Auth } from "../auth";
import { GithubApiCall } from "../github-custom-resource";
import { encrypt } from "./encrypt";

export const handler: OnEventHandler = async (event: OnEventRequest): Promise<OnEventResponse | undefined> => {
  console.log(`Request of type ${event.RequestType} received`);

  console.log("Payload: %j", event);

  const call: GithubApiCall | undefined = parse(event.ResourceProperties[event.RequestType]);

  if (!call) {
    return;
  }

  const octokitOptions: OctokitOptions = {};

  const { strategy, secret } = event.ResourceProperties.Auth as Auth;
  switch (strategy) {
    case AuthenticationStrategy.AUTH_APP:
      // https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication
      octokitOptions.authStrategy = createAppAuth;
      octokitOptions.auth = JSON.parse(await getSecretValue(secret!));
      break;

    case AuthenticationStrategy.AUTH_TOKEN:
      const parameterArn = parseArn(secret!);
      const parameterName = parameterArn.resource.replace(/^parameter/, "");
      const ssm: SSM = new SSM({ region: parameterArn.region });
      const getParameterResponse = await ssm.getParameter({ Name: parameterName, WithDecryption: true }).promise();

      // https://github.com/octokit/auth-token.js#readme
      octokitOptions.authStrategy = createTokenAuth(getParameterResponse.Parameter!.Value!);
      break;

    case AuthenticationStrategy.UNAUTHENTICATED:
    // https://github.com/octokit/auth-unauthenticated.js#createunauthenticatedauth-options
    default:
      octokitOptions.authStrategy = createUnauthenticatedAuth;
  }

  const octokit = new Octokit(octokitOptions);

  const parameters = (() => {
    // Handles the create or update of actions secrets. Retrieves and encrypts the SecretsManager Secret.
    switch (`${call.endpoint}.${call.method}`) {
      case "actions.createOrUpdateEnvironmentSecret":
        return createOrUpdateEnvironmentSecretParameter(octokit, call.parameters);
      case "actions.createOrUpdateOrgSecret":
        return createOrUpdateOrgSecretParameter(octokit, call.parameters);
      case "actions.createOrUpdateRepoSecret":
        return createOrUpdateRepoSecretParameter(octokit, call.parameters);
      default:
        return call.parameters;
    }
  })();

  try {
    // https://github.com/octokit/plugin-rest-endpoint-methods.js/#usage
    // @ts-ignore
    const response = await octokit.rest[call.endpoint][call.method](parameters);

    console.debug("Response: %j", response);

    const flattened = flatten(response.data ?? {});

    const responsePath = call.physicalResourceId?.responsePath;
    const physicalResourceId: string | undefined = responsePath ? flattened[responsePath] : call.physicalResourceId?.id;

    return {
      PhysicalResourceId: physicalResourceId,
      Data: filter(flattened, call.outputPaths),
    };
  } catch (e) {
    const err = e as RequestError;
    if (!call.ignoreErrorCodesMatching || !new RegExp(call.ignoreErrorCodesMatching).test(err.message)) {
      throw e;
    }
  }

  return;
};

/**
 * Handles the environment secret encryption.
 */
const createOrUpdateEnvironmentSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateEnvironmentSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateEnvironmentSecret"]["parameters"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getEnvironmentPublicKey({
    repository_id: parameters.repository_id,
    environment_name: parameters.environment_name,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return {
    repository_id: parameters.repository_id,
    environment_name: parameters.environment_name,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  };
};

/**
 * Handles the org secret encryption.
 */
const createOrUpdateOrgSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["parameters"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getOrgPublicKey({
    org: parameters.org,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return {
    org: parameters.org,
    visibility: parameters.visibility,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  };
};

/**
 * Handles the environment secret encryption.
 */
const createOrUpdateRepoSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["parameters"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getRepoPublicKey({
    owner: parameters.owner,
    repo: parameters.repo,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return {
    owner: parameters.owner,
    repo: parameters.repo,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  };
};

/**
 * Retrieves the Secret Value from SecretsManager by Arn. If field is given, extract json field value from secret string.
 */
const getSecretValue = async (secretId: string, field?: string): Promise<string> => {
  const secretArn = parseArn(secretId!);
  const secretsManager = new SecretsManager({ region: secretArn.region });
  const getSecretValueResponse = await secretsManager.getSecretValue({ SecretId: secretId! }).promise();
  const secretString = getSecretValueResponse.SecretString!;

  if (!field) {
    return secretString;
  }

  return JSON.parse(secretString)[field];
};

/**
 * Parse the GitHub API call passed in ResourceProperties OnCreate, OnUpdate and OnDelete
 *
 * @internal
 */
const parse = (stringified?: string): GithubApiCall | undefined => {
  return stringified ? JSON.parse(stringified) : undefined;
};

/**
 * Flattens a nested object and materializes the key paths dot separated.
 *
 * @internal
 */
export const flatten = (object: object): { [key: string]: any } => {
  const _flatten = (path: string[], child: any): { [key: string]: any } => {
    if ("object" == typeof child && null != child) {
      return Object.entries(child).reduce(
        (result, [key, value]) => Object.assign(result, _flatten(path.concat([key]), value)),
        {}
      );
    }
    return { [path.join(".")]: child };
  };

  return _flatten([], object);
};

/**
 * Filters objects keys that starts with key names provided in outputPaths.
 *
 * @internal
 */
export const filter = (object: object, outputPaths?: string[]): { [key: string]: any } => {
  if (!outputPaths) {
    return object;
  }

  const result: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(object)) {
    for (const outputPath of outputPaths) {
      if (key.startsWith(outputPath)) {
        result[key] = value;
      }
    }
  }

  return result;
};

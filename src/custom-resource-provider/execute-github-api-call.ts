import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types"; // eslint-disable-line import/no-extraneous-dependencies
import { Octokit } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import { encrypt } from "./encrypt";
import { getSecretValue } from "./get-secret-value";
import { GithubApiCall } from "../github-custom-resource";

export const executeGithubApiCall = async (
  octokit: Octokit,
  call: GithubApiCall
): Promise<OctokitResponse<{ [key: string]: unknown }>> => {
  switch (`${call.endpoint}.${call.method}`) {
    // Handles the create or update of actions secrets. Retrieves and encrypts the SecretsManager Secret.
    case "actions.createOrUpdateEnvironmentSecret":
      return createOrUpdateEnvironmentSecretParameter(octokit, call.parameters);
    case "actions.createOrUpdateOrgSecret":
      return createOrUpdateOrgSecretParameter(octokit, call.parameters);
    case "actions.createOrUpdateRepoSecret":
      return createOrUpdateRepoSecretParameter(octokit, call.parameters);
    default:
      // https://github.com/octokit/plugin-rest-endpoint-methods.js/#usage
      // @ts-ignore
      return octokit.rest[call.endpoint][call.method](parameters);
  }
};

/**
 * Executes the environment secret encryption.
 */
export const createOrUpdateEnvironmentSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateEnvironmentSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateEnvironmentSecret"]["response"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getEnvironmentPublicKey({
    repository_id: parameters.repository_id,
    environment_name: parameters.environment_name,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return octokit.rest.actions.createOrUpdateEnvironmentSecret({
    repository_id: parameters.repository_id,
    environment_name: parameters.environment_name,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  });
};
/**
 * Executes the org secret encryption.
 */
export const createOrUpdateOrgSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["response"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getOrgPublicKey({
    org: parameters.org,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return octokit.rest.actions.createOrUpdateOrgSecret({
    org: parameters.org,
    visibility: parameters.visibility,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  });
};
/**
 * Executes the environment secret encryption.
 */
export const createOrUpdateRepoSecretParameter = async (
  octokit: Octokit,
  parameters: RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["parameters"]
): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["response"]> => {
  const {
    data: { key_id, key },
  } = await octokit.rest.actions.getRepoPublicKey({
    owner: parameters.owner,
    repo: parameters.repo,
  });

  const { arn, field } = (parameters as any).value;
  const secretString = await getSecretValue(arn, field);
  const encryptedValue = await encrypt(secretString, key);

  return octokit.rest.actions.createOrUpdateRepoSecret({
    owner: parameters.owner,
    repo: parameters.repo,
    secret_name: parameters.secret_name,
    encrypted_value: encryptedValue,
    key_id: key_id,
  });
};

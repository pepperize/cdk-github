import { CustomResource, Lazy, RemovalPolicy, Stack } from "aws-cdk-lib";
import { PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { GithubCustomResourceProvider } from "./custom-resource-provider/provider";
import { Secret } from "./github-actions-secret";
import { GithubApiCall, GithubCustomResourceBase, GithubCustomResourceOptions } from "./github-custom-resource";

export interface GithubActionsSecretEnvironmentProps extends GithubCustomResourceOptions {
  /**
   * The unique identifier of the repository.
   */
  readonly repositoryId: string;
  /**
   * The GitHub Environment name. The name is not case-sensitive.
   */
  readonly environmentName: string;
  /**
   * The GitHub secret name.
   */
  readonly secretName: string;
  /**
   * The SSM Secret.
   */
  readonly source: Secret;
  /**
   * Whether to DESTROY or RETAIN the secret on resource removal.
   * @default RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}
/**
 * Manage an GitHib Actions environment secret.
 *
 * ```typescript
 * // The GitHub API authentication secret
 * const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/test");
 *
 * // The AWS SecretsManager Secret to configure as GitHub Action secret.
 * const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");
 *
 * new GithubActionsSecretEnvironment(scope, "GithubRepo", {
 *   repositoryId: "558989134",
 *   environmentName: "production",
 *   secretName: "example",
 *   source: {
 *     secret: secret,
 *     field: "some-json-field",
 *   },
 *   authOptions: AuthOptions.appAuth(auth),
 *   removalPolicy: RemovalPolicy.DESTROY,
 * });
 * ```
 */
export class GithubActionsSecretEnvironment extends GithubCustomResourceBase {
  /**
   * @internal
   */
  readonly _resource: CustomResource;
  constructor(scope: Construct, id: string, props: GithubActionsSecretEnvironmentProps) {
    super(scope, id);

    const provider = GithubCustomResourceProvider.getOrCreate(this);
    const authOptions = props.authOptions;
    authOptions._grantRead(provider);
    props.source.secret.grantRead(provider);

    const onCreate: GithubApiCall = {
      endpoint: "actions",
      method: "createOrUpdateEnvironmentSecret", // https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/docs/actions/createOrUpdateEnvironmentSecret.md
      parameters: {
        repository_id: props.repositoryId,
        environment_name: props.environmentName,
        secret_name: props.secretName,
        value: {
          arn: props.source.secret.secretArn,
          field: props.source.field,
        },
      },
      physicalResourceId: PhysicalResourceId.of(`${props.repositoryId}::${props.environmentName}::${props.secretName}`),
    };

    const onDelete: GithubApiCall | undefined =
      props.removalPolicy == RemovalPolicy.DESTROY
        ? {
            endpoint: "actions",
            method: "deleteOrgSecret", // https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/docs/actions/deleteEnvironmentSecret.md
            parameters: {
              repository_id: props.repositoryId,
              environment_name: props.environmentName,
              secret_name: props.secretName,
            },
          }
        : undefined;

    this._resource = new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      resourceType: "Custom::GithubActions::EnvironmentSecret",
      properties: {
        Create: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Update: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Delete: onDelete && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onDelete) }),
        Auth: props.authOptions._auth,
      },
    });
  }
}

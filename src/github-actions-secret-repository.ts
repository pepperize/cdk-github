import { CustomResource, Lazy, RemovalPolicy, Stack } from "aws-cdk-lib";
import { PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { GithubCustomResourceProvider } from "./custom-resource-provider/provider";
import { GithubActionsSecret } from "./github-actions-secret";
import { GithubApiCall, GithubCustomResourceBase, GithubCustomResourceOptions } from "./github-custom-resource";

export interface GithubActionsSecretRepositoryProps extends GithubCustomResourceOptions {
  /**
   The GitHub Repository owner. The name is not case-sensitive.
   */
  readonly owner: string;
  /**
   * The GitHub Repository name. The name is not case-sensitive.
   */
  readonly repositoryName: string;
  /**
   * The GitHub secret name.
   */
  readonly secretName: string;
  /**
   * The SSM Secret.
   */
  readonly source: GithubActionsSecret;
  /**
   * Whether to DESTROY or RETAIN the secret on resource removal.
   * @default RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}
/**
 * Manage an GitHib Actions Repository secret.
 *
 * ```typescript
 * // The GitHub API authentication secret
 * const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/test");
 *
 * // The AWS SecretsManager Secret to configure as GitHub Action secret.
 * const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");
 *
 * new GithubActionsSecretRepository(scope, "GithubRepo", {
 *   owner: "pepperize",
 *   repositoryName: "cdk-github",
 *   secretName: "example",
 *   source: GithubActionsSecret.fromSecretsManager(secret, "some-json-field"),
 *   authOptions: AuthOptions.appAuth(auth),
 *   removalPolicy: RemovalPolicy.DESTROY,
 * });
 * ```
 */
export class GithubActionsSecretRepository extends GithubCustomResourceBase {
  /**
   * @internal
   */
  readonly _resource: CustomResource;
  constructor(scope: Construct, id: string, props: GithubActionsSecretRepositoryProps) {
    super(scope, id);

    const provider = GithubCustomResourceProvider.getOrCreate(this);
    const authOptions = props.authOptions;
    authOptions._grantRead(provider);
    props.source._grantRead(provider);

    const onCreate: GithubApiCall = {
      endpoint: "actions",
      method: "createOrUpdateRepoSecret", // https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/docs/actions/createOrUpdateRepoSecret.md
      parameters: {
        owner: props.owner,
        repository_name: props.repositoryName,
        secret_name: props.secretName,
        value: props.source,
      },
      physicalResourceId: PhysicalResourceId.of(`${props.owner}::${props.repositoryName}::${props.secretName}`),
    };

    const onDelete: GithubApiCall | undefined =
      props.removalPolicy == RemovalPolicy.DESTROY
        ? {
            endpoint: "actions",
            method: "deleteOrgSecret", // https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/docs/actions/deleteRepoSecret.md
            parameters: {
              owner: props.owner,
              repository_name: props.repositoryName,
              secret_name: props.secretName,
            },
          }
        : undefined;

    this._resource = new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      resourceType: "Custom::GithubActions::RepositorySecret",
      properties: {
        Create: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Update: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Delete: onDelete && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onDelete) }),
        Auth: props.authOptions._auth,
      },
    });
  }
}

import { CustomResource, Lazy, RemovalPolicy, Stack } from "aws-cdk-lib";
import { PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { GithubCustomResourceProvider } from "./custom-resource-provider/provider";
import { GithubActionsSecret } from "./github-actions-secret";
import { GithubApiCall, GithubCustomResourceBase, GithubCustomResourceOptions } from "./github-custom-resource";

export enum Visibility {
  ALL = "all",
  PRIVATE = "private",
  SELECTED = "selected",
}

export interface GithubActionsSecretOrganizationProps extends GithubCustomResourceOptions {
  /**
   * The GitHub organization name. The name is not case-sensitive.
   */
  readonly organizationName: string;
  /**
   * The GitHub secret name.
   */
  readonly secretName: string;
  /**
   * The SSM Secret.
   */
  readonly source: GithubActionsSecret;
  /**
   * Which type of organization repositories have access to the organization secret.
   */
  readonly visibility?: Visibility;
  /**
   * Whether to DESTROY or RETAIN the secret on resource removal.
   * @default RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}
/**
 * Manage an GitHib Actions organization secret.
 *
 * ```typescript
 * // The GitHub API authentication secret
 * const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/test");
 *
 * // The AWS SecretsManager Secret to configure as GitHub Action secret.
 * const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");
 *
 * new GithubActionsSecretOrganization(scope, "GithubRepo", {
 *   organizationName: "pepperize",
 *   secretName: "example",
 *   source: GithubActionsSecret.fromSecretsManager(secret, "some-json-field"),
 *   visibility: Visibility.ALL,
 *   authOptions: AuthOptions.appAuth(auth),
 *   removalPolicy: RemovalPolicy.DESTROY,
 * });
 * ```
 */
export class GithubActionsSecretOrganization extends GithubCustomResourceBase {
  /**
   * @internal
   */
  readonly _resource: CustomResource;
  constructor(scope: Construct, id: string, props: GithubActionsSecretOrganizationProps) {
    super(scope, id);

    const provider = GithubCustomResourceProvider.getOrCreate(this);
    const authOptions = props.authOptions;
    authOptions._grantRead(provider);
    props.source._grantRead(provider);

    const onCreate: GithubApiCall = {
      endpoint: "actions",
      method: "createOrUpdateOrgSecret", // https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/docs/actions/createOrUpdateOrgSecret.md
      parameters: {
        org: props.organizationName,
        secret_name: props.secretName,
        value: props.source,
        visibility: props.visibility,
      },
      outputPaths: [],
      physicalResourceId: PhysicalResourceId.of(`${props.organizationName}::${props.secretName}`),
    };

    const onDelete: GithubApiCall | undefined =
      props.removalPolicy == RemovalPolicy.DESTROY
        ? {
            endpoint: "actions",
            method: "deleteOrgSecret",
            parameters: {
              org: props.organizationName,
              secret_name: props.secretName,
            },
            outputPaths: [],
          }
        : undefined;

    this._resource = new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      resourceType: "Custom::GithubActions::OrganizationSecret",
      properties: {
        Create: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Update: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onCreate) }),
        Delete: onDelete && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(onDelete) }),
        Auth: props.authOptions._auth,
      },
    });
  }
}

import { CustomResource, Lazy, Reference, Stack } from "aws-cdk-lib";
import * as custom_resources from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { IAuthOptions } from "./auth";
import { GithubCustomResourceProvider } from "./custom-resource-provider/provider";

export interface GithubApiCall {
  /**
   * The endpoint to call.
   *
   * @see https://github.com/octokit/rest.js
   */
  readonly endpoint: string;
  /**
   * The method to call.
   *
   * @see https://github.com/octokit/rest.js
   */
  readonly method: string;
  /**
   * The parameters for the service action.
   *
   * @see https://github.com/octokit/rest.js
   */
  readonly parameters?: any;
  /**
   * The physical resource id of the custom resource for this call.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
   *
   * @default undefined - for "Create" requests, defaults to the event's RequestId, for "Update" and "Delete", defaults to the current `PhysicalResourceId`.
   */
  readonly physicalResourceId?: custom_resources.PhysicalResourceId;
  /**
   * The regex pattern to use to catch API errors. The `message` property of the `RequestError` object will be tested against this pattern. If there is a match an error will not be thrown.
   */
  readonly ignoreErrorCodesMatching?: string;
  /**
   * Filter the data returned by the custom resource to specific paths in the API response.
   *
   * <b>The total size of the response body can't exceed 4096 bytes.</b>
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
   * @see https://docs.github.com/en/rest
   *
   * Example for octokit.rest.repos.createInOrg: ['id', 'full_name', 'owner.id']
   *
   * @default undefined - it's recommended to define it
   */
  readonly outputPaths?: string[];
}

export interface GithubCustomResourceOptions {
  /**
   * Currently, supports only GitHub App.
   *
   * ```typescript
   * const auth = { appId, privateKey };
   * const installationAuth = { appId, privateKey, installationId };
   * ```
   *
   * @see https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication
   */
  readonly authOptions: IAuthOptions;
}

export interface GithubCustomResourceProps extends GithubCustomResourceOptions {
  /**
   * Cloudformation Resource type.
   */
  readonly resourceType?: string;
  /**
   * The GitHub Api call to make when the resource is created.
   */
  readonly onCreate?: GithubApiCall;
  /**
   * The GitHub Api call to make when the resource is updated.
   */
  readonly onUpdate?: GithubApiCall;
  /**
   * The GitHub Api call to make when the resource is deleted.
   */
  readonly onDelete?: GithubApiCall;
}

export abstract class GithubCustomResourceBase extends Construct {
  /**
   * @internal
   */
  abstract readonly _resource: CustomResource;
  /**
   * The physical name of this custom resource.
   */
  get ref(): string {
    return this._resource.ref;
  }
  /**
   * Returns the value of an attribute of the custom resource of an arbitrary
   * type. Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getAttString` for string attributes.
   */
  getAtt(attributeName: string): Reference {
    return this._resource.getAtt(attributeName);
  }
  /**
   * Returns the value of an attribute of the custom resource of type string.
   * Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt` encoded as a string.
   */
  getAttString(attributeName: string): string {
    return this._resource.getAttString(attributeName);
  }
}

/**
 * ```typescript
 * const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/github-token");
 *
 * new GithubCustomResource(scope, "GithubRepo", {
 *   onCreate: {
 *     // https://octokit.github.io/rest.js/v19/#repos-create-in-org
 *     endpoint: "repos",
 *     method: "createInOrg",
 *     parameters: {
 *       org: "pepperize",
 *       name: "cdk-github",
 *     },
 *     outputPaths: ["id", "full_name"],
 *     physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
 *     ignoreErrorCodesMatching: "name already exists on this account",
 *   },
 *   onUpdate: {
 *     // https://octokit.github.io/rest.js/v19#repos-get
 *     endpoint: "repos",
 *     method: "get",
 *     parameters: {
 *       owner: "pepperize",
 *       repo: "cdk-github",
 *     },
 *     outputPaths: ["id", "full_name"],
 *     physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
 *   },
 *   onDelete: {
 *     // https://octokit.github.io/rest.js/v19#repos-delete
 *     endpoint: "repos",
 *     method: "delete",
 *     parameters: {
 *       owner: "pepperize",
 *       repo: "cdk-github",
 *     },
 *     outputPaths: [],
 *   },
 *   authOptions: AuthOptions.appAuth(auth),
 * });
 * ```
 */
export class GithubCustomResource extends GithubCustomResourceBase {
  /**
   * @internal
   */
  readonly _resource: CustomResource;
  constructor(scope: Construct, id: string, props: GithubCustomResourceProps) {
    super(scope, id);

    const provider = GithubCustomResourceProvider.getOrCreate(this);
    const authOptions = props.authOptions;
    authOptions._grantRead(provider);

    this._resource = new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      resourceType: props.resourceType,
      properties: {
        Create: props.onCreate && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(props.onCreate) }),
        Update: props.onUpdate && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(props.onUpdate) }),
        Delete: props.onDelete && Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(props.onDelete) }),
        Auth: props.authOptions._auth,
      },
    });
  }
}

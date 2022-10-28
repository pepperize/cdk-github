import { Duration, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as custom_resources from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { HandlerFunction } from "./handler-function";

/**
 * @internal
 */
export class GithubCustomResourceProvider extends Construct implements iam.IGrantable {
  /**
   * Retrieve GithubCustomResourceProvider as stack singleton resource.
   */
  public static getOrCreate(scope: Construct): GithubCustomResourceProvider {
    const stack = Stack.of(scope);
    const id = "cdk-github.GithubCustomResourceProvider";
    const existing = stack.node.tryFindChild(id);
    return (existing as GithubCustomResourceProvider) || new GithubCustomResourceProvider(stack, id);
  }

  public readonly serviceToken: string;

  readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEventHandler = new HandlerFunction(this, "OnEventHandler", {
      timeout: Duration.minutes(10),
    });
    this.grantPrincipal = onEventHandler.grantPrincipal;

    const provider = new custom_resources.Provider(this, "Provider", {
      onEventHandler: onEventHandler,
    });

    this.serviceToken = provider.serviceToken;
  }
}

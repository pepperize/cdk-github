import { captureStackTrace, IResolvable, IResolveContext } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

export class GithubActionsSecret implements IResolvable {
  public static fromSecretsManager(secret: secretsmanager.ISecret, field?: string): GithubActionsSecret {
    return new GithubActionsSecret(secret, field);
  }

  public readonly creationStack: string[] = captureStackTrace();

  private readonly secret: secretsmanager.ISecret;

  private readonly field?: string;

  private constructor(secret: ISecret, field?: string) {
    this.secret = secret;
    this.field = field;
  }

  public resolve(_: IResolveContext): any {
    return { arn: this.secret.secretArn, field: this.field };
  }

  /**
   * @internal
   */
  _grantRead(grantee: iam.IGrantable) {
    this.secret.grantRead(grantee);
  }
}

import { captureStackTrace, IResolvable, IResolveContext } from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

export class ActionsSecret implements IResolvable {
  public static fromSecretsManager(secret: secretsmanager.ISecret, field?: string): ActionsSecret {
    return new ActionsSecret(secret, field);
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
}

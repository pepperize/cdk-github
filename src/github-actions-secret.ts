import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export interface Secret {
  secret: secretsmanager.ISecret;
  field: string;
}

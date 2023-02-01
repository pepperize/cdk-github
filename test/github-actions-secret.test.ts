import { CfnOutput, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { GithubActionsSecret } from "../src/github-actions-secret";

describe("GithubActionsSecret", () => {
  it("Should match snapshot", () => {
    // Given
    const stack = new Stack();
    const secret = secretsmanager.Secret.fromSecretCompleteArn(
      stack,
      "Secret",
      "arn:aws:secretsmanager:us-east-1:123456789012:secret:AnySecret-Random"
    );
    const actionsSecrets = GithubActionsSecret.fromSecretsManager(secret, "any-field");

    new CfnOutput(stack, "Output", { exportName: "test", value: stack.toJsonString(actionsSecrets) });

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });
  it("Should stringify the action secret", () => {
    // Given
    const stack = new Stack();
    const secret = secretsmanager.Secret.fromSecretCompleteArn(
      stack,
      "Secret",
      "arn:aws:secretsmanager:us-east-1:123456789012:secret:AnySecret-Random"
    );
    const actionsSecrets = GithubActionsSecret.fromSecretsManager(secret, "any-field");

    // When
    const token = stack.toJsonString(actionsSecrets);
    const resolved = stack.resolve(token);

    // Then
    expect(JSON.parse(resolved)).toEqual({
      arn: "arn:aws:secretsmanager:us-east-1:123456789012:secret:AnySecret-Random",
      field: "any-field",
    });
  });
});

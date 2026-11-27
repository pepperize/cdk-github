import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { AuthOptions } from "../src";
import { GithubActionsSecret } from "../src/github-actions-secret";
import { GithubActionsSecretEnvironment } from "../src/github-actions-secret-environment";

describe("GithubActionsSecretEnvironment", () => {
  it("Should create the secret with createOrUpdateEnvironmentSecret", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretEnvironment(stack, "Secret", props(stack));

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsEnvironmentSecret", {
      Create: Match.serializedJson(
        Match.objectLike({
          endpoint: "actions",
          method: "createOrUpdateEnvironmentSecret",
          parameters: Match.objectLike({
            repository_id: "558617288",
            environment_name: "production",
            secret_name: "ANY_SECRET",
          }),
        }),
      ),
      Delete: Match.absent(),
    });
  });

  it("Should delete the secret with deleteEnvironmentSecret on removal policy destroy", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretEnvironment(stack, "Secret", { ...props(stack), removalPolicy: RemovalPolicy.DESTROY });

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsEnvironmentSecret", {
      Delete: Match.serializedJson(Match.objectLike({ endpoint: "actions", method: "deleteEnvironmentSecret" })),
    });
  });
});

const props = (stack: Stack) => ({
  repositoryId: "558617288",
  environmentName: "production",
  secretName: "ANY_SECRET",
  source: GithubActionsSecret.fromSecretsManager(
    secretsmanager.Secret.fromSecretCompleteArn(
      stack,
      "Source",
      "arn:aws:secretsmanager:us-east-1:123456789012:secret:AnySecret-Random",
    ),
  ),
  authOptions: AuthOptions.unauthenticated(),
});

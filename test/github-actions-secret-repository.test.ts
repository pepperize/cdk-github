import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { AuthOptions } from "../src";
import { GithubActionsSecret } from "../src/github-actions-secret";
import { GithubActionsSecretRepository } from "../src/github-actions-secret-repository";

describe("GithubActionsSecretRepository", () => {
  it("Should create the secret with createOrUpdateRepoSecret", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretRepository(stack, "Secret", props(stack));

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsRepositorySecret", {
      Create: Match.serializedJson(
        Match.objectLike({
          endpoint: "actions",
          method: "createOrUpdateRepoSecret",
          parameters: Match.objectLike({ owner: "pepperize", repo: "cdk-github", secret_name: "ANY_SECRET" }),
        }),
      ),
      Delete: Match.absent(),
    });
  });

  it("Should delete the secret with deleteRepoSecret on removal policy destroy", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretRepository(stack, "Secret", { ...props(stack), removalPolicy: RemovalPolicy.DESTROY });

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsRepositorySecret", {
      Delete: Match.serializedJson(Match.objectLike({ endpoint: "actions", method: "deleteRepoSecret" })),
    });
  });
});

const props = (stack: Stack) => ({
  owner: "pepperize",
  repositoryName: "cdk-github",
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

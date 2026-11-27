import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { AuthOptions } from "../src";
import { GithubActionsSecret } from "../src/github-actions-secret";
import { GithubActionsSecretOrganization } from "../src/github-actions-secret-organization";

describe("GithubActionsSecretOrganization", () => {
  it("Should create the secret with createOrUpdateOrgSecret", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretOrganization(stack, "Secret", props(stack));

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsOrganizationSecret", {
      Create: Match.serializedJson(
        Match.objectLike({
          endpoint: "actions",
          method: "createOrUpdateOrgSecret",
          parameters: Match.objectLike({ org: "pepperize", secret_name: "ANY_SECRET" }),
        }),
      ),
      Delete: Match.absent(),
    });
  });

  it("Should delete the secret with deleteOrgSecret on removal policy destroy", () => {
    // Given
    const stack = new Stack();

    // When
    new GithubActionsSecretOrganization(stack, "Secret", { ...props(stack), removalPolicy: RemovalPolicy.DESTROY });

    // Then
    Template.fromStack(stack).hasResourceProperties("Custom::GithubActionsOrganizationSecret", {
      Delete: Match.serializedJson(Match.objectLike({ endpoint: "actions", method: "deleteOrgSecret" })),
    });
  });
});

const props = (stack: Stack) => ({
  organizationName: "pepperize",
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

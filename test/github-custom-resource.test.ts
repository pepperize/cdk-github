import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { AuthOptions, GithubCustomResource } from "../src";

describe("GithubCustomResource", () => {
  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new GithubCustomResourceTestStack(app, "GithubTestStack");

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });

  it("Should contain GithubCustomResource with appAuth", () => {
    // Given
    const app = new App();
    const stack = new GithubCustomResourceTestStack(app, "GithubTestStack");

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::SecretsManager::Secret", { Description: "GithubAppAuthSecret" });
    template.hasResourceProperties("AWS::CloudFormation::CustomResource", {
      Auth: {
        secret: {
          Ref: Match.stringLikeRegexp("githubAuthSecret"),
        },
        strategy: "auth-app",
      },
    });
  });
});

class GithubCustomResourceTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const secret = new Secret(this, "githubAuthSecret", {
      description: "GithubAppAuthSecret",
    });
    new GithubCustomResource(this, "CR", {
      authOptions: AuthOptions.appAuth(secret),
    });
  }
}

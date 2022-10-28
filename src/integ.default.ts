import { App, Stack } from "aws-cdk-lib";
import * as secrets_manager from "aws-cdk-lib/aws-secretsmanager";
import * as custom_resources from "aws-cdk-lib/custom-resources";
import { AuthOptions } from "./auth";
import { GithubCustomResource } from "./github-custom-resource";

// https://github.com/octokit/authentication-strategies.js/#the-authoptionsfactory-pattern
// export REPO=
// yarn bundle:custom-resource-provider/handler.lambda
// npx cdk deploy --app 'npx ts-node -P tsconfig.json --prefer-ts-exts ./src/integ.default.ts' --require-approval never --no-rollback

const app = new App();
const stack = new Stack(app, "GithubCustomResource");

const repo = process.env.REPO ?? "cdk-github";

const secret = secrets_manager.Secret.fromSecretNameV2(stack, "Auth", "cdk-github/test");

new GithubCustomResource(stack, "GithubRepo", {
  onCreate: {
    // https://octokit.github.io/rest.js/v19/#repos-create-in-org
    endpoint: "repos",
    method: "createInOrg",
    parameters: {
      org: "pepperize",
      name: repo,
    },
    outputPaths: ["id", "full_name"],
    physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
    ignoreErrorCodesMatching: "name already exists on this account",
  },
  onUpdate: {
    // https://octokit.github.io/rest.js/v19#repos-get
    endpoint: "repos",
    method: "get",
    parameters: {
      owner: "pepperize",
      repo,
    },
    outputPaths: ["id", "full_name"],
    physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
  },
  onDelete: {
    // https://octokit.github.io/rest.js/v19#repos-delete
    endpoint: "repos",
    method: "get", // method: "delete",
    parameters: {
      owner: "pepperize",
      repo,
    },
    outputPaths: [],
  },
  authOptions: AuthOptions.appAuth(secret),
});

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub](https://img.shields.io/github/license/pepperize/cdk-github?style=flat-square)](https://github.com/pepperize/cdk-github/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@pepperize/cdk-github?style=flat-square)](https://www.npmjs.com/package/@pepperize/cdk-github)
[![PyPI](https://img.shields.io/pypi/v/pepperize.cdk-github?style=flat-square)](https://pypi.org/project/pepperize.cdk-github/)
[![Nuget](https://img.shields.io/nuget/v/Pepperize.CDK.Github?style=flat-square)](https://www.nuget.org/packages/Pepperize.CDK.Github/)
[![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.pepperize/cdk-github?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/pepperize/cdk-github/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/pepperize/cdk-github/release.yml?branch=main&label=release&style=flat-square)](https://github.com/pepperize/cdk-github/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/pepperize/cdk-github?sort=semver&style=flat-square)](https://github.com/pepperize/cdk-github/releases)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/pepperize/cdk-github)

# CDK Github

Manage GitHub resources like repositories, teams, members, integrations and workflows with the AWS CDK as Custom Resources in CloudFormation with [cdk-github](https://github.com/pepperize/cdk-github).

> You configure the endpoint, method and parameters documented by [@octokit/rest](https://octokit.github.io/rest.js/v19) and AWS CloudFormation runs them anytime you create, update (if you changed the custom resource), or delete stacks. When CloudFormation sends a lifecycle event notification, then your custom resource sends the request to the [GitHub REST API](https://docs.github.com/en/rest).

[![View on Construct Hub](https://constructs.dev/badge?package=%40pepperize%2Fcdk-github)](https://constructs.dev/packages/@pepperize/cdk-github)

## Install

<details><summary><strong>TypeScript</strong></summary>

```shell
npm install @pepperize/cdk-github
```

or

```shell
yarn add @pepperize/cdk-github
```

</details>

<details><summary><strong>Python</strong></summary>

```shell
pip install pepperize.cdk-github
```

</details>

<details><summary><strong>C#</strong></summary>

```
dotnet add package Pepperize.CDK.Github
```

</details>

<details><summary><strong>Java</strong></summary>

```xml
<dependency>
  <groupId>com.pepperize</groupId>
  <artifactId>cdk-github</artifactId>
  <version>${cdkGithub.version}</version>
</dependency>
```

</details>

## Contributing

Contributions of all kinds are welcome :rocket: Check out our [contributor's guide](https://github.com/pepperize/cdk-github/blob/main/CONTRIBUTING.md).

For a quick start, [fork and check out](https://github.com/pepperize/cdk-github/fork) a development environment:

```shell
git clone git@github.com:pepperize/cdk-github
cd cdk-github
# install dependencies
yarn
# build with projen
yarn build
```

## Getting Started

1. [Creating a GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)
2. [Installing GitHub Apps](https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps)
3. [Create an AWS Secrets Manager secret](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html)

   ```json
   {
     "appId": "123456",
     "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nExample==\n-----END RSA PRIVATE KEY-----",
     "installationId": "12345678"
   }
   ```

4. Add [@pepperize/cdk-github](https://github.com/pepperize/cdk-github) to your project dependencies

   ```shell
   yarn add @pepperize/cdk-github
   ```

5. Add your `main.ts`

   ```typescript
   const app = new App();
   const stack = new Stack(app, "GithubCustomResources");
   ```

   > Just for simplicity, it's up to you how to organize your app :wink:

6. Import your secret

   ```typescript
   const secret = secrets_manager.Secret.fromSecretNameV2(stack, "Auth", "cdk-github/github-token");
   ```

7. Configure GitHub App authenticate as an installation

   ```typescript
   const authOptions = AuthOptions.appAuth(secret);
   ```

8. Add your first GitHub Custom Resource with the AWS CDK

   ```typescript
   new GithubCustomResource(stack, "GithubRepo", {
     onCreate: {
       // 👇The endpoint of the GitHub API.
       endpoint: "repos",
       // 👇The method of the GitHub API.
       method: "createInOrg",
       // https://octokit.github.io/rest.js/v19/#repos-create-in-org
       parameters: {
         // 👇The request parameters to send.
         org: "pepperize",
         name: "cdk-github",
       },
       // 👇The object keys from the GitHub API response to return to CFN.
       outputPaths: ["id", "full_name"],
       // 👇This becomes the CFN Physical ID visible in the Console.
       physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
       // 👇Don't throw an error if message matching this regex.
       ignoreErrorCodesMatching: "name already exists on this account",
     },
     // 👇The implemented authentication strategy.
     authOptions: AuthOptions.appAuth(secret),
   });
   ```

9. Deploy your first GitHub Custom Resource

   ```shell
   npx cdk deploy
   ```

## Authentication

### GitHub App or installation authentication

Configure the AWS SecretsManager Secret with the AuthOptions that will be passed to `octokit.auth`. i.e. as an installation:

```json
{
  "appId": "123456",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nExample==\n-----END RSA PRIVATE KEY-----",
  "installationId": "12345678"
}
```

Lookup the secret in your AWS CDK app:

```typescript
// 👇Lookup your secret containing the AuthOptions
const secret = secrets_manager.Secret.fromSecretNameV2(stack, "Auth", "cdk-github/github-token");
// 👇This will send the secret arn to the custom resource handler
const authOptions = AuthOptions.appAuth(secret);
```

The custom resource handler will configure [octokit.js](https://github.com/octokit/octokit.js) with the `createAppAuth`:

```typescript
const getSecretValueResponse = await SSM.getSecretValue({ SecretId: secret }).promise();
const octokitOptions: OctokitOptions = {
  authStrategy: createAppAuth,
  auth: (auth = JSON.parse(getSecretValueResponse.SecretString)),
};
```

> Supported through [@octokit/auth-app](https://github.com/octokit/auth-app.js#readme)

### Personal Access Token authentication

Just add your PAT to an SSM StringParameter

```typescript
// 👇Lookup your parameter containing the TOKEN
const parameter = ssm.StringParameter.fromStringParameterName(stack, "Auth", "cdk-github/github-token");
// 👇This will send the parameter arn to the custom resource handler
const authOptions = AuthOptions.tokenAuth(parameter);
```

> Supported through [@octokit/auth-token](https://github.com/octokit/auth-token.js)

### Unauthenticated

```typescript
// 👇This will configure octokit without authentication
const authOptions = AuthOptions.unauthenticated();
```

## Manage a GitHub Repository - Example

[![Manage a GitHub Repository as custom CFN resource](https://raw.githubusercontent.com/pepperize/cdk-github/main/cloudformation-stack-github-custom-resource.png)](https://github.com/pepperize/cdk-github/blob/main/src/integ.default.ts)

[@octokit/plugin-rest-endpoint-methods](https://github.com/octokit/plugin-rest-endpoint-methods.js/#usage)

```typescript
const auth = secrets_manager.Secret.fromSecretNameV2(stack, "Auth", "cdk-github/github-token");

const repo = new GithubCustomResource(stack, "GithubRepo", {
  onCreate: {
    // https://octokit.github.io/rest.js/v19/#repos-create-in-org
    endpoint: "repos",
    method: "createInOrg",
    parameters: {
      org: "pepperize",
      name: "cdk-github",
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
      repo: "cdk-github",
    },
    outputPaths: ["id", "full_name"],
    physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
  },
  onDelete: {
    // https://octokit.github.io/rest.js/v19#repos-delete
    endpoint: "repos",
    method: "delete",
    parameters: {
      owner: "pepperize",
      repo: "cdk-github",
    },
    outputPaths: [],
  },
  authOptions: AuthOptions.appAuth(auth),
});

// 👇 This will return the created repository id as a CDK Token
repo.getAtt("id");
```

## Manage GitHub Actions Secrets

### Environment Secret

Manages an environment secret. Will fetch the source AWS SecretsManager secret and encrypt it to store in GitHub.

```typescript
// 👇The GitHub API authentication secret
const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/github-token");

// 👇The AWS SecretsManager Secret to configure as GitHub Action secret.
const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");

new GithubActionsSecretEnvironment(scope, "GithubRepo", {
  // 👇The repository id, which you may lookup from the page source or via a custom resource
  repositoryId: "558989134",
  environmentName: "production",
  // 👇The name of the created GitHub secret
  secretName: "example",
  // 👇The source AWS SecretsManager secret and JSON field to use
  source: GithubActionsSecret.fromSecretsManager(secret, "some-json-field"),
  authOptions: AuthOptions.appAuth(auth),
  // 👇Whether to delete or retain the GitHub secret on resource removal
  removalPolicy: RemovalPolicy.DESTROY,
});
```

> You may retrieve the `repository_id` from the GitHub Repository page source's meta tag i.e. `<meta name="octolytics-dimension-repository_id" content="558989134">` or from another `GithubCustomResource` via `getAtt()`.

See [GitHub Developer Guide](https://docs.github.com/de/rest/actions/secrets#create-or-update-an-environment-secret), [API Reference](https://github.com/pepperize/cdk-github/blob/main/API.md)

### Organization Secret

Manage an GitHib Actions organization secret. Will fetch the source AWS SecretsManager secret and encrypt it to store in GitHub.

```typescript
// 👇The GitHub API authentication secret
const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/github-token");

// 👇The AWS SecretsManager Secret to configure as GitHub Action secret.
const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");

new GithubActionsSecretOrganization(scope, "GithubRepo", {
  organizationName: "pepperize",
  // 👇The name of the created GitHub secret
  secretName: "example",
  // 👇The source AWS SecretsManager secret and JSON field to use
  source: GithubActionsSecret.fromSecretsManager(secret, "some-json-field"),
  visibility: Visibility.ALL,
  authOptions: AuthOptions.appAuth(auth),
  // 👇Whether to delete or retain the GitHub secret on resource removal
  removalPolicy: RemovalPolicy.DESTROY,
});
```

See [GitHub Developer Guide](https://docs.github.com/de/rest/actions/secrets#create-or-update-an-organization-secret), [API Reference](https://github.com/pepperize/cdk-github/blob/main/API.md)

### Repository Secret

Manage an GitHib Actions Repository secret. Will fetch the source AWS SecretsManager secret and encrypt it to store in GitHub.

```typescript
// 👇The GitHub API authentication secret
const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/github-token");

// 👇The AWS SecretsManager Secret to configure as GitHub Action secret.
const secret = secrets_manager.Secret.fromSecretNameV2(scope, "Secret", "any-secret/example");

new GithubActionsSecretRepository(scope, "GithubRepo", {
  owner: "pepperize",
  repositoryName: "cdk-github",
  // 👇The name of the created GitHub secret
  secretName: "example",
  // 👇The source AWS SecretsManager secret and JSON field to use
  source: GithubActionsSecret.fromSecretsManager(secret, "some-json-field"),
  authOptions: AuthOptions.appAuth(auth),
  // 👇Whether to delete or retain the GitHub secret on resource removal
  removalPolicy: RemovalPolicy.DESTROY,
});
```

See [GitHub Developer Guide](https://docs.github.com/de/rest/actions/secrets#create-or-update-a-repository-secret), [API Reference](https://github.com/pepperize/cdk-github/blob/main/API.md)

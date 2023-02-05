import { AwsCdkConstructLibrary } from "@pepperize/projen-awscdk-construct";
import { javascript, awscdk } from "projen";

const project = new AwsCdkConstructLibrary({
  author: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  cdkVersion: "2.48.0",
  defaultReleaseBranch: "main",
  name: "cdk-github",
  description:
    "Manage GitHub resources like repositories, teams, members, integrations and workflows with the AWS CDK as Custom Resources in CloudFormation with [cdk-github](https://github.com/pepperize/cdk-github).",
  keywords: [
    "aws",
    "cdk",
    "construct",
    "custom-resource",
    "github",
    "actions",
    "secret",
    "provider",
    "repository",
    "teams",
    "user",
    "octokit",
    "rest",
    "github app",
    "Utilities",
  ],
  repositoryUrl: "https://github.com/pepperize/cdk-github.git",

  projenrcTs: true,

  devDeps: [
    "@aws-sdk/util-arn-parser",
    "@octokit/auth-app",
    "@octokit/auth-token",
    "@octokit/auth-unauthenticated",
    "@octokit/core",
    "@octokit/rest",
    "@octokit/request-error",
    "@octokit/types",
    "@pepperize/projen-awscdk-construct@latest",
    "@types/aws-lambda",
    "@types/libsodium-wrappers",
    "aws-lambda",
    "aws-sdk",
    "libsodium",
    "libsodium-wrappers",
  ],

  versionrcOptions: {
    types: [{ type: "chore", section: "Chore", hidden: false }],
  },

  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  packageName: "@pepperize/cdk-github",
  publishToNuget: {
    dotNetNamespace: "Pepperize.CDK",
    packageId: "Pepperize.CDK.Github",
  },
  publishToPypi: {
    distName: "pepperize.cdk-github",
    module: "pepperize_cdk_github",
  },
  publishToMaven: {
    mavenEndpoint: "https://s01.oss.sonatype.org",
    mavenGroupId: "com.pepperize",
    mavenArtifactId: "cdk-github",
    javaPackage: "com.pepperize.cdk.github",
  },

  gitpod: true,

  gitignore: ["cdk.out"],

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_16_X,
  },
});

project.eslint?.allowDevDeps("src/custom-resource-provider/encrypt.ts");
project.eslint?.allowDevDeps("src/custom-resource-provider/execute-github-api-call.ts");
project.eslint?.allowDevDeps("src/custom-resource-provider/get-secret-value.ts");

project.gitpod?.addCustomTask({
  name: "setup",
  init: "yarn install && npx projen build",
  command: "npx projen watch",
});

project.gitpod?.addVscodeExtensions("dbaeumer.vscode-eslint");

project.synth();

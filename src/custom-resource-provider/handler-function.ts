// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for HandlerFunction
 */
export interface HandlerFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/custom-resource-provider/handler.
 */
export class HandlerFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: HandlerFunctionProps) {
    super(scope, id, {
      description: 'src/custom-resource-provider/handler.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs16.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/custom-resource-provider/handler.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}
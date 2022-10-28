import * as iam from "aws-cdk-lib/aws-iam";
import * as secrets_manager from "aws-cdk-lib/aws-secretsmanager";
import * as ssm from "aws-cdk-lib/aws-ssm";

/**
 * @internal
 */
export enum AuthenticationStrategy {
  /**
   * GitHub App or installation authentication
   *
   * @see https://github.com/octokit/auth-app.js/#readme
   */
  AUTH_APP = "auth-app",

  /**
   * Personal Access Token authentication
   *
   * @see https://github.com/octokit/auth-token.js#readme
   */
  AUTH_TOKEN = "auth-token",

  /**
   * unauthenticated
   *
   * @see https://github.com/octokit/auth-unauthenticated.js#readme
   */
  UNAUTHENTICATED = "unauthenticated",
}

/**
 * The auth configuration passed to the onEventHandler
 *
 * @internal
 */
export interface Auth {
  /**
   * The authentication strategy to use
   *
   * @see https://github.com/octokit/authentication-strategies.js/#authentication-strategiesjs
   */
  readonly strategy: AuthenticationStrategy;
  /**
   * Either a SecretsManager Secret Arn or an SSM ParameterStore Parameter Arn
   */
  readonly secret?: string;
}

export interface IAuthOptions {
  /**
   * @internal
   */
  readonly _auth: Auth;

  /**
   * @internal
   */
  _grantRead(grantee: iam.IGrantable): void;
}

export abstract class AuthOptions implements IAuthOptions {
  /**
   * GitHub App or installation authentication
   *
   * @see https://github.com/octokit/auth-app.js/#readme
   */
  public static appAuth(secret: secrets_manager.ISecret): AuthOptions {
    return new (class AppAuthOptions extends AuthOptions {
      readonly _auth = {
        strategy: AuthenticationStrategy.AUTH_APP,
        secret: secret.secretArn,
      };

      _grantRead(grantee: iam.IGrantable) {
        secret.grantRead(grantee);
      }
    })();
  }
  /**
   * Personal Access Token authentication
   *
   * @see https://github.com/octokit/auth-token.js#readme
   */
  public static tokenAuth(parameter: ssm.IParameter): AuthOptions {
    return new (class TokenAuthOptions extends AuthOptions {
      readonly _auth = {
        strategy: AuthenticationStrategy.AUTH_TOKEN,
        secret: parameter.parameterArn,
      };

      _grantRead(grantee: iam.IGrantable) {
        parameter.grantRead(grantee);
      }
    })();
  }
  /**
   * unauthenticated
   *
   * @see https://github.com/octokit/auth-unauthenticated.js#readme
   */
  public static unauthenticated(): AuthOptions {
    return new (class TokenAuthOptions extends AuthOptions {
      readonly _auth = {
        strategy: AuthenticationStrategy.UNAUTHENTICATED,
      };

      _grantRead(grantee: iam.IGrantable) {
        grantee;
      }
    })();
  }
  /**
   * @internal
   */
  abstract readonly _auth: Auth;
  /**
   * @internal
   */
  abstract _grantRead(grantee: iam.IGrantable): void;
}

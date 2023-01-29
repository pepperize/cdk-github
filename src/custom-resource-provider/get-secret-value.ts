import { parse as parseArn } from "@aws-sdk/util-arn-parser";
import { SecretsManager } from "aws-sdk";

/**
 * Retrieves the Secret Value from SecretsManager by Arn. If field is given, extract json field value from secret string.
 */
export const getSecretValue = async (secretId: string, field?: string): Promise<string> => {
  const secretArn = parseArn(secretId!);
  const secretsManager = new SecretsManager({ region: secretArn.region });
  const getSecretValueResponse = await secretsManager.getSecretValue({ SecretId: secretId! }).promise();
  const secretString = getSecretValueResponse.SecretString!;

  if (!field) {
    return secretString;
  }

  return JSON.parse(secretString)[field];
};

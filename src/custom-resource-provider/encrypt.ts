import * as sodium from "libsodium-wrappers";

/**
 * https://docs.github.com/en/rest/actions/secrets#create-or-update-an-organization-secret
 * https://docs.github.com/en/rest/actions/secrets#create-or-update-a-repository-secret
 * https://docs.github.com/en/rest/actions/secrets#create-or-update-an-environment-secret
 *
 * @param secret 'plain-text-secret' - replace with the secret you want to encrypt
 * @param key 'base64-encoded-public-key' - replace with the Base64 encoded public key
 */
export const encrypt = async (secret: string, key: string): Promise<string> => {
  // Check if libsodium is ready and then proceed.
  await sodium.ready;

  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const binsec = sodium.from_string(secret);

  // Encrypt the secret using LibSodium
  const encBytes = sodium.crypto_box_seal(binsec, binkey);

  // Convert encrypted Uint8Array to Base64
  return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
};

import crypto from "crypto";
import dns from "dns/promises";
import { DkimParams } from "./header";

export const verifyDkimSignature = (
  dkim: DkimParams,
  headers: string,
  publicKey: string,
): boolean => {
  const { a: algorithm, b: signature } = dkim;
  const verifier = crypto.createVerify(algorithm.toUpperCase());
  verifier.update(headers);
  return verifier.verify(publicKey, signature, "base64");
};

export const verifyBody = (body: string, dkim: DkimParams): boolean => {
  const { bh } = dkim;
  const bodyHash = hashBody(body);
  return bodyHash === bh;
};

export const getDkimPublicKey = async (dkim: DkimParams): Promise<string> => {
  const { d: domain, s: selector } = dkim;
  const dnsDomain = `${selector}._domainkey.${domain}`;
  const dnsTxt = await dns.resolveTxt(dnsDomain);
  let publicKeyData = dnsTxt[0][0].split("p=")[1];
  for (let i = 1; i < dnsTxt[0].length; i++) {
    publicKeyData += dnsTxt[0][i];
  }
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    publicKeyData +
    "\n" +
    "-----END PUBLIC KEY-----\n";
  return publicKey;
};

const hashBody = (body: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(body);
  return hash.digest("base64");
};

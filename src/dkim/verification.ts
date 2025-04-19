import crypto from "crypto";
import dns from "dns/promises";
import { DkimHeader } from "./header";

const getDkimPublicKey = async (dkim: DkimHeader): Promise<string> => {
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

export const verifyDkimSignature = async (
  dkim: DkimHeader,
  hash: string,
): Promise<boolean> => {
  const publicKey = await getDkimPublicKey(dkim);
  const { a: algorithm, b: signature } = dkim;
  const verifier = crypto.createVerify(algorithm);
  verifier.update(hash);
  return verifier.verify(publicKey, signature, "base64");
};

import dns from "dns/promises";
import { createPublicKey } from "crypto";
import { DkimParams } from "./header";

export const getDkimPublicKey = async (dkim: DkimParams): Promise<string> => {
  const { d: domain, s: selector } = dkim;
  const publicKeyData = await getTxtRecord(domain, selector);
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    publicKeyData +
    "\n" +
    "-----END PUBLIC KEY-----\n";
  return publicKey;
};

export const getDkimPublicKeyN = async (
  dkim: DkimParams,
): Promise<{ publicKey: string; n: bigint }> => {
  const publicKey = await getDkimPublicKey(dkim);
  return { publicKey, n: extractModulusN(publicKey) };
};

const extractModulusN = (publicKeyPem: string): bigint => {
  const key = createPublicKey(publicKeyPem);
  const jwk = key.export({ format: "jwk" });
  return jwkToBigInt(jwk.n ?? "");
};

const getTxtRecord = async (
  domain: string,
  selector: string,
): Promise<string> => {
  const dnsDomain = `${selector}._domainkey.${domain}`;
  const dnsTxt = await dns.resolveTxt(dnsDomain);
  let publicKeyData = dnsTxt[0][0].split("p=")[1];
  for (let i = 1; i < dnsTxt[0].length; i++) {
    publicKeyData += dnsTxt[0][i];
  }
  return publicKeyData;
};

const jwkToBigInt = (jwk: string): bigint => {
  let base64 = jwk.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const base64Buffer = Buffer.from(base64, "base64");
  const base64Hex = base64Buffer.toString("hex");
  return BigInt(`0x${base64Hex}`);
};

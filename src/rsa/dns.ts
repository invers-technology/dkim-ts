import dns from "dns/promises";
import { DkimParams } from "../header";

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

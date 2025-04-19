import dns from "dns/promises";
import { EmailHeader } from "../email";

export interface DkimHeader {
  v: string;
  a: string;
  b: string;
  bh: string;
  c?: string;
  d: string;
  h: string;
  i?: string;
  l?: string;
  q?: string;
  s: string;
  t?: string;
  x?: string;
  z?: string;
}

export const parseDkim = (headers: EmailHeader[]): DkimHeader => {
  const dkimHeader = headers.find(
    (header) => header.key.toLowerCase() === "dkim-signature",
  );
  console.log(dkimHeader, "dkimHeader");
  if (!dkimHeader) {
    throw new Error("DKIM header not found");
  }
  const dkimParams = dkimHeader.value.split(";");
  const dkim: DkimHeader = {
    v: "",
    a: "",
    b: "",
    bh: "",
    d: "",
    h: "",
    s: "",
  };
  for (let dkimParam of dkimParams) {
    dkimParam = dkimParam.trim();
    const key = dkimParam.split("=")[0];
    const value = dkimParam.slice(key.length + 1, dkimParam.length);
    dkim[key as keyof DkimHeader] = value;
  }
  return dkim;
};

export const getEmptySignatureDkim = (headers: EmailHeader[]): string => {
  const dkimHeader = headers.find(
    (header) => header.key.toLowerCase() === "dkim-signature",
  );
  if (!dkimHeader) {
    throw new Error("DKIM header not found");
  }
  const dkimParams = dkimHeader.value.split(";");
  let emptySignatureDkim = "dkim_header: ";
  for (let dkimParam of dkimParams) {
    dkimParam = dkimParam.trim();
    const key = dkimParam.split("=")[0];
    const value =
      key === "b" ? "" : dkimParam.slice(key.length + 1, dkimParam.length);
    emptySignatureDkim += `${key}=${value}; `;
  }
  return emptySignatureDkim;
};

export const getDkimPublicKey = async (dkim: DkimHeader): Promise<string> => {
  const { d: domain, s: selector } = dkim;
  const dnsDomain = `${selector}._domainkey.${domain}`;
  const dnsTxt = await dns.resolveTxt(dnsDomain);
  const publicKeyData = dnsTxt[0][0].split("p=")[1];
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    publicKeyData +
    "\n" +
    "-----END PUBLIC KEY-----\n";
  return publicKey;
};

import { createPublicKey } from "crypto";

export { getDkimPublicKey } from "./dns";

const RSA_FIELD_BITS = 121n;
const RSA_FIELD_LENGTH = 17n;

export const bigintToRsaField = (num: bigint): bigint[] => {
  let remainder = num;
  const subFieldMax = (1n << RSA_FIELD_BITS) - 1n;
  return Array.from({ length: Number(RSA_FIELD_LENGTH) }, () => {
    const field = remainder & subFieldMax;
    remainder >>= RSA_FIELD_BITS;
    return field;
  });
};

export const extractModulusN = (publicKeyPem: string): string => {
  const publicKey = createPublicKey({
    key: publicKeyPem,
    format: "pem",
  });
  const jwk = publicKey.export({ format: "jwk" });
  const modulus = jwk.n || "";
  const modulusBase64 = modulus.replace(/-/g, "+").replace(/_/g, "/");
  const modulusBuffer = Buffer.from(modulusBase64, "base64");
  const modulusHex = modulusBuffer.toString("hex");

  return modulusHex;
};

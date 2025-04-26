import crypto from "crypto";
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

const hashBody = (body: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(body);
  return hash.digest("base64");
};

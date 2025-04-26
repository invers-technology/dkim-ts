import { createPublicKey } from "crypto";

export { getDkimPublicKey } from "./dns";
export { publicKeyNToCircomInputs } from "./field";

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

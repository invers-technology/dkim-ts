import fs from "fs";
import crypto from "crypto";

const privateKey = fs.readFileSync("key/private-key.pem", "utf8");
const publicKey = fs.readFileSync("key/public-key.pem", "utf8");

console.log(publicKey, "publicKey");

export const sign = (data: string): string => {
  const signer = crypto.createSign("RSA-SHA256");
  signer.write(data);
  return signer.sign(privateKey, "base64");
};

export const verify = (data: string, signature: string): boolean => {
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(data);
  return verifier.verify(publicKey, signature, "base64");
};

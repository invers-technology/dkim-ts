import fs from "fs";
import crypto from "crypto";

const privateKey = fs.readFileSync("keys/private.pem", "utf8");

export const sign = (data: string): string => {
  const signer = crypto.createSign("RSA-SHA256");
  signer.write(data);
  return signer.sign(privateKey, "base64");
};

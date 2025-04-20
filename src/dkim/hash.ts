import crypto from "crypto";

export const hashBody = (body: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(body);
  return hash.digest("base64");
};

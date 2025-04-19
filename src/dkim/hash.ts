import crypto from "crypto";

export const hashBody = (body: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(body);
  return hash.digest("base64");
};

export const hashHeaders = (headers: string, dkimHeader: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(headers);
  hash.update(dkimHeader);
  return hash.digest("base64");
};

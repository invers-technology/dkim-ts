import crypto from "crypto";

export const hashBody = (body: string | undefined) => {
  let encodedBody = (body || "").replace(/\r\n/g, "");
  encodedBody = `${encodedBody}`;
  const hash = crypto.createHash("sha256");
  hash.update(encodedBody);
  return hash.digest("base64");
};

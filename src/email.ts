import crypto from "crypto";
import { parseHeaders } from "./parser";

export interface EmailHeader {
  key: string;
  value: string;
}

export const parseEmail = (
  rawData: string,
): { headers: EmailHeader[]; body: string } => {
  const [headers, ix] = parseHeaders(rawData);
  const body = rawData.slice(ix, rawData.length);
  return { headers, body };
};

export const hashBody = (body: string | undefined) => {
  let encodedBody = (body || "").replace(/\r\n/g, "");
  encodedBody = `${encodedBody}`;
  const hash = crypto.createHash("sha256");
  hash.update(encodedBody);
  return hash.digest("base64");
};

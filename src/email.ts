import { parseHeaders } from "./parser";
import { parseDkim, DkimParams } from "./dkim/header";

export interface EmailHeader {
  key: string;
  value: string;
}

export const parseEmail = (
  rawData: string,
): { headers: EmailHeader[]; body: string; dkim: DkimParams } => {
  const [headers, ix] = parseHeaders(rawData);
  const dkim = parseDkim(headers);
  const body = rawData.slice(ix, rawData.length);
  return { headers, dkim, body };
};

import { parseHeaders } from "./parser";
import { parseDkim, DkimHeader } from "./dkim/header";

export interface EmailHeader {
  key: string;
  value: string;
}

export const parseEmail = (
  rawData: string,
): { headers: EmailHeader[]; body: string; dkim: DkimHeader } => {
  const [headers, ix] = parseHeaders(rawData);
  const dkim = parseDkim(headers);
  const body = rawData.slice(ix, rawData.length);
  return { headers, dkim, body };
};

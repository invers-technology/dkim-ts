import { EmailHeader } from "./email";

export interface DkimHeader {
  v: string;
  a: string;
  b: string;
  bh: string;
  c?: string;
  d: string;
  h: string;
  i?: string;
  l?: string;
  q?: string;
  s: string;
  t?: string;
  x?: string;
  z?: string;
}

export const parseDkim = (headers: EmailHeader[]): DkimHeader => {
  const dkimHeader = headers.find(
    (header) => header.key.toLowerCase() === "dkim-signature",
  );
  if (!dkimHeader) {
    throw new Error("DKIM header not found");
  }
  const dkimParams = dkimHeader.value.split(";");
  const dkim: DkimHeader = {
    v: "",
    a: "",
    b: "",
    bh: "",
    d: "",
    h: "",
    s: "",
  };
  for (const dkimParam of dkimParams) {
    let [key, value] = dkimParam.split("=");
    key = key.trim();
    value = value.trim();
    dkim[key as keyof DkimHeader] = value;
  }
  return dkim;
};

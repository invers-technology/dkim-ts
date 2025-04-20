import { EmailHeader } from "./parser";
import { relaxedHeader } from "./canonicalization";

export interface DkimParams {
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

export const parseDkim = (headers: EmailHeader[]): DkimParams => {
  const dkimParams = dkimKeyAndValue(headers);
  const dkim: DkimParams = {
    v: "",
    a: "",
    b: "",
    bh: "",
    d: "",
    h: "",
    s: "",
  };
  for (const [key, value] of dkimParams) {
    dkim[key as keyof DkimParams] = value;
  }
  return dkim;
};

export const getNonSignatureDkim = (headers: EmailHeader[]): string => {
  const dkimParams = dkimKeyAndValue(headers);
  let nonSignatureDkim = "dkim-signature:";
  for (const [key, value] of dkimParams) {
    nonSignatureDkim += `${key}=${key === "b" ? "" : value}; `;
  }
  return nonSignatureDkim.slice(0, -2);
};

const dkimKeyAndValue = (headers: EmailHeader[]): [string, string][] => {
  const DkimParams = headers.find(
    (header) => header.key.toLowerCase() === "dkim-signature",
  );
  if (!DkimParams) {
    throw new Error("DKIM header not found");
  }
  const dkimParams = DkimParams.value.split(";");
  const dkimKeyAndValue: [string, string][] = [];
  for (let dkimParam of dkimParams) {
    dkimParam = relaxedHeader(dkimParam);
    const key = dkimParam.split("=")[0];
    let value = dkimParam.slice(key.length + 1, dkimParam.length);
    if (key === "b") value = value.replace(/\s/g, "");
    dkimKeyAndValue.push([key, value]);
  }
  return dkimKeyAndValue;
};

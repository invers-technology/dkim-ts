import { EmailHeader } from "../email";
import { canonicalize, newCanonicalization } from "./canonicalization";
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

export const newDkim = ({
  domain,
  selector,
  canonicalization,
}: {
  domain: string;
  selector: string;
  canonicalization?: string;
}): DkimHeader => {
  const dkim: DkimHeader = {
    v: "1",
    a: "rsa-sha256",
    b: "",
    bh: "",
    d: domain,
    h: "mime-version:references:in-reply-to:from:date:message-id:subject:to",
    s: selector,
    c: canonicalization ? canonicalization : "relaxed/relaxed",
  };
  return dkim;
};

export const signDkim = (
  dkim: DkimHeader,
  header: string,
  body: string,
): string => {
  const { c } = dkim;
  const canonicalization = newCanonicalization(c);
  const [headerCanon, bodyCanon] = canonicalize(canonicalization, header, body);
  return "";
};

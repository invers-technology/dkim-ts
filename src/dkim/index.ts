import { canonicalize, newCanonicalization } from "./canonicalization";
import { DkimHeader } from "./header";

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

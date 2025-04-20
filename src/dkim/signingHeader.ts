import { EmailHeader } from "../email";

type SigningHeader = string[];

const newSigningHeader = (header: string): SigningHeader => {
  const uniqueHeaders: SigningHeader = [];
  header.split(":").forEach((h) => {
    if (!uniqueHeaders.includes(h)) {
      uniqueHeaders.push(h);
    }
  });
  return uniqueHeaders;
};

export const selectSigningHeaders = (
  signingHeader: string,
  headers: EmailHeader[],
): EmailHeader[] => {
  const signingHeaders = newSigningHeader(signingHeader);
  return signingHeaders
    .map((h) => {
      const header = headers.find(({ key }) => key.toLowerCase() === h);
      if (header) {
        return header;
      }
      return null;
    })
    .filter((header) => header !== null);
};

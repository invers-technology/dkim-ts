import { EmailHeader } from "../email";

type SigningHeader = string[];

const newSigningHeader = (header: string): SigningHeader => {
  return header.split(":");
};

export const selectSigningHeaders = (
  signingHeader: string,
  headers: EmailHeader[],
): EmailHeader[] => {
  const signingHeaders = newSigningHeader(signingHeader);
  return headers.filter((header) =>
    signingHeaders.includes(header.key.toLowerCase()),
  );
};

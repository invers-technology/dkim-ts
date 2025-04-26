import {
  verifyBody,
  getDkimPublicKey,
  parseEmailToCanonicalized,
  verifyDkimSignature,
} from "../src";
import { emailRaw, emailRaw2 } from "./helper";

describe("Dkim", () => {
  it("should verify a dkim signature", async () => {
    const { canonicalizedHeaders, canonicalizedBody, dkim } =
      parseEmailToCanonicalized(emailRaw);
    const isBodyVerified = verifyBody(canonicalizedBody, dkim);
    const publicKey = await getDkimPublicKey(dkim);
    const isDkimVerified = verifyDkimSignature(
      dkim,
      canonicalizedHeaders,
      publicKey,
    );

    expect(isBodyVerified).toBe(true);
    expect(isDkimVerified).toBe(true);
  });

  it("should verify dkim signature", async () => {
    const { canonicalizedHeaders, canonicalizedBody, dkim } =
      parseEmailToCanonicalized(emailRaw2);
    const isBodyVerified = verifyBody(canonicalizedBody, dkim);
    const publicKey = await getDkimPublicKey(dkim);
    const isDkimVerified = verifyDkimSignature(
      dkim,
      canonicalizedHeaders,
      publicKey,
    );

    expect(isBodyVerified).toEqual(true);
    expect(isDkimVerified).toEqual(true);
  });
});

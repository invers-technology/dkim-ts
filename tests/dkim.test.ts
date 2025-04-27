import fs from "fs";
import {
  verifyBody,
  getDkimPublicKey,
  parseEmailToCanonicalized,
  verifyDkimSignature,
} from "../src";

describe("Dkim", () => {
  const emailRaw = fs.readFileSync("tests/helper/example.eml", "utf8");
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
});

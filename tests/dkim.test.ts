import fs from "fs";
import { verifyBody } from "../src";
import { getDkimPublicKey } from "../src";
import { parseRawEmail } from "../src";
import { verifyDkimSignature } from "../src";

const emailRaw = fs.readFileSync("tests/example.eml", "utf8");

describe("DKIM", () => {
  it("should verify a dkim signature", async () => {
    const { canonicalizedHeaders, canonicalizedBody, dkim } =
      parseRawEmail(emailRaw);
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

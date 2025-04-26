import {
  getDkimPublicKey,
  parseEmailToCanonicalized,
  verifyDkimSignature,
} from "../src";
import { binaryToHex, hexToBinary } from "../src/rsa/utils";
import { randomHexString, emailRaw2 } from "./helper";

describe("RSA", () => {
  it("should convert hex to binary", async () => {
    const hex = randomHexString(128);
    const binary = hexToBinary(hex);
    const hex2 = binaryToHex(binary);
    expect(hex2).toEqual(hex);
  });

  it("should convert bigint to rsa field", async () => {
    const { canonicalizedHeaders, dkim } = parseEmailToCanonicalized(emailRaw2);
    const publicKey = await getDkimPublicKey(dkim);
    const isDkimVerified = verifyDkimSignature(
      dkim,
      canonicalizedHeaders,
      publicKey,
    );

    expect(isDkimVerified).toEqual(true);
  });
});

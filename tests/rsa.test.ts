import {
  getDkimPublicKey,
  parseEmailToCanonicalized,
  extractModulusN,
  publicKeyNToCircomInputs,
} from "../src";
import { binaryToHex, hexToBinary } from "../src/rsa/utils";
import { emailRaw, randomHexString, circuitInputNToHex } from "./helper";

describe("RSA", () => {
  const { dkim } = parseEmailToCanonicalized(emailRaw);

  it("should convert hex to binary", async () => {
    const hex = randomHexString(128);
    const binary = hexToBinary(hex);
    const hex2 = binaryToHex(binary);
    expect(hex2).toEqual(hex);
  });

  it("should convert bigint to rsa field", async () => {
    const publicKey = await getDkimPublicKey(dkim);
    const modulusN = extractModulusN(publicKey);
    const circuitInputN = publicKeyNToCircomInputs(modulusN);
    const hex = circuitInputNToHex(circuitInputN);
    expect(modulusN).toEqual(hex);
  });
});

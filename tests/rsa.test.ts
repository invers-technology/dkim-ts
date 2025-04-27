import {
  getDkimPublicKeyN,
  parseEmailToCanonicalized,
  bigintToCircomInputs,
  getSignature,
} from "../src";
import { emailRaw2 } from "./helper";

describe("RSA", () => {
  it("should verify dkim signature", async () => {
    const { dkim } = parseEmailToCanonicalized(emailRaw2);
    const { n } = await getDkimPublicKeyN(dkim);
    const signature = getSignature(dkim);
    const publicKeyInputs = bigintToCircomInputs(n);
    const signatureInputs = bigintToCircomInputs(signature);

    expect(publicKeyInputs).toBeDefined();
    expect(publicKeyInputs.length).toBe(17);
    expect(signatureInputs).toBeDefined();
    expect(signatureInputs.length).toBe(17);
  });
});

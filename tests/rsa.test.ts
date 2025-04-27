import {
  getDkimPublicKeyN,
  parseEmailToCanonicalized,
  publicKeyNToCircomInputs,
} from "../src";
import { emailRaw2 } from "./helper";

describe("RSA", () => {
  it("should verify dkim signature", async () => {
    const { dkim } = parseEmailToCanonicalized(emailRaw2);
    const { n } = await getDkimPublicKeyN(dkim);
    const inputs = publicKeyNToCircomInputs(n);

    expect(inputs).toBeDefined();
    expect(inputs.length).toBe(17);
  });
});

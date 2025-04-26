import {
  getDkimPublicKeyN,
  parseEmailToCanonicalized,
  publicKeyNToCircomInputs,
} from "../src";
import { emailRaw2 } from "./helper";

describe("RSA", () => {
  it("should verify dkim signature", async () => {
    try {
      const { canonicalizedHeaders, dkim } =
        parseEmailToCanonicalized(emailRaw2);
      const { publicKey, n } = await getDkimPublicKeyN(dkim);
      const inputs = publicKeyNToCircomInputs(n.toString(16));

      expect(inputs).toBeDefined();
      expect(inputs.length).toBe(17);
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }
  });
});

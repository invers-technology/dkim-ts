import {
  getDkimPublicKey,
  parseEmailToCanonicalized,
  getSignature,
} from "../src";
import { emailRaw } from "./helper";

describe("Circuits", () => {
  it("should verify a rsa signature", async () => {
    const { canonicalizedHeaders, canonicalizedBody, dkim } =
      parseEmailToCanonicalized(emailRaw);
    const publicKey = await getDkimPublicKey(dkim);
    const signature = getSignature(dkim);
  });
});

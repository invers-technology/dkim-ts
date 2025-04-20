import fs from "fs";
import crypto from "crypto";

const privateKey = fs.readFileSync("tests/key/private-key.pem", "utf8");
const publicKey = fs.readFileSync("tests/key/public-key.pem", "utf8");

describe("RSA", () => {
  it("should sign a message", () => {
    const message = "Hello, world!";
    const signer = crypto.createSign("RSA-SHA256");
    signer.write(message);
    const signature = signer.sign(privateKey, "base64");

    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(message);
    const verified = verifier.verify(publicKey, signature, "base64");

    expect(verified).toBe(true);
  });
});

import { sign, verify } from "../src/rsa";

describe("RSA", () => {
  it("should sign a message", () => {
    const message = "Hello, world!";
    const signature = sign(message);
    const verified = verify(message, signature);
    expect(verified).toBe(true);
  });
});

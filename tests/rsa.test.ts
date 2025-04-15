import { sign } from "../src/rsa";

describe("RSA", () => {
  it("should sign a message", () => {
    const message = "Hello, world!";
    const signature = sign(message);
    expect(signature).toBeDefined();
  });
});

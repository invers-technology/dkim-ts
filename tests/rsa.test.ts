import { sign, verify } from "../src/rsa";
import crypto from "crypto";
import { privateKey, publicKey } from "./mail/keys";
import fs from "fs";
import { hashBody } from "../src/email";
import { parseHeaders } from "../src/parser";
import { relaxedBody } from "../src/dkim/canonicalization";
import { parseDkim } from "../src/dkim";

describe("RSA", () => {
  it("should sign a message", () => {
    const message = "Hello, world!";
    const signature = sign(message);
    const verified = verify(message, signature);
    expect(verified).toBe(true);
  });

  it("should verify a message", () => {
    const message = "This is a message to be signed";
    const sign = crypto.createSign("RSA-SHA256");
    sign.write(message);
    const signature = sign.sign(privateKey, "hex");
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(message);
    const verified = verify.verify(publicKey, signature, "hex");

    expect(verified).toBe(true);
  });

  it("should sign a message with a private key", () => {
    const expected =
      '--000000000000d4d95805a9492a3c\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\nTest body\r\n\r\n--000000000000d4d95805a9492a3c\r\nContent-Type: text/html; charset="UTF-8"\r\n\r\n<div dir="ltr">Test body</div>\r\n\r\n--000000000000d4d95805a9492a3c--\r\n';
    const mail = fs.readFileSync("./tests/mail/example.eml", "utf8");
    const [headers, ix] = parseHeaders(mail);
    const body = mail
      .slice(ix, mail.length)
      .split("\n")
      .map((line) => line.trim())
      .join("\r\n");
    const relaxed = relaxedBody(body);

    expect(relaxed).toEqual(expected);
  });
});

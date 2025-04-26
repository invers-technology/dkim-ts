import fs from "fs";

export const emailRaw = fs.readFileSync("tests/helper/example.eml", "utf8");

export const emailRaw2 = fs.readFileSync("tests/helper/example2.eml", "utf8");

export const randomHexString = (length: number): string => {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
};

export const hexToBinary = (hex: string): string => {
  const rawHex = hex.replace(/^0x/, "");
  return rawHex
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("");
};

export const binaryToDecimal = (binary: string): string => {
  const bigNum = BigInt(`0b${binary}`);
  return bigNum.toString(10);
};

export const jwkToBigInt = (jwk: string): bigint => {
  let base64 = jwk.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const base64Buffer = Buffer.from(base64, "base64");
  const base64Hex = base64Buffer.toString("hex");
  return BigInt(`0x${base64Hex}`);
};

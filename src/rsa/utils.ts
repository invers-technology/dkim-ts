export const jwkToBigInt = (jwk: string): bigint => {
  let base64 = jwk.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const base64Buffer = Buffer.from(base64, "base64");
  const base64Hex = base64Buffer.toString("hex");
  return BigInt(`0x${base64Hex}`);
};

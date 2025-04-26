export const binaryToHex = (binary: string): string => {
  const paddedBinary = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");

  let hex = "";
  for (let i = 0; i < paddedBinary.length; i += 4) {
    const chunk = paddedBinary.slice(i, i + 4);
    const hexDigit = parseInt(chunk, 2).toString(16);
    hex += hexDigit;
  }

  return hex.toLowerCase();
};

export const hexToBinary = (hex: string): string => {
  const rawHex = hex.replace("0x", "");
  return rawHex
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("");
};

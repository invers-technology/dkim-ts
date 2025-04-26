import fs from "fs";
import { CircuitInputN } from "../../src/rsa/field";
import { binaryToHex, hexToBinary } from "../../src/rsa/utils";

export const emailRaw = fs.readFileSync("tests/helper/example.eml", "utf8");

export const randomHexString = (length: number): string => {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
};

export const circuitInputNToHex = (circuitInputN: CircuitInputN): string => {
  let binary = "";
  for (let i = 0; i < circuitInputN.length; i++) {
    const addBinary = subFieldToBinary(circuitInputN[i]);
    binary += addBinary;
  }
  return binaryToHex(binary);
};

const subFieldToBinary = (subField: `0x${string}`): string => {
  const binary = hexToBinary(subField);
  return binary;
};

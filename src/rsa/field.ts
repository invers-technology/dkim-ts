import { FixedLengthArray } from "./array";
import { hexToBinary, binaryToHex } from "./utils";

const rsaFieldLength = 17;
export const RSA_FIELD_BITS = 121n;
export const RSA_FIELD_LENGTH = BigInt(rsaFieldLength);

export type CircuitInputN = FixedLengthArray<`0x${string}`, 17>;

const emptyCircuitInputN: CircuitInputN = Array.from(
  { length: rsaFieldLength },
  () => "0x0" as `0x${string}`,
) as CircuitInputN;

export const publicKeyNToCircomInputs = (n: string): CircuitInputN => {
  const binary = hexToBinary(n);
  let subFields: CircuitInputN = emptyCircuitInputN;
  for (let i = rsaFieldLength - 1; i >= 0; i--) {
    subFields[i] = subFieldFromBinary(binary.slice(i * 121, (i + 1) * 121));
  }
  subFields;
  return subFields;
};

export const subFieldFromBinary = (binary: string): `0x${string}` => {
  if (binary.length > 128) {
    throw new Error("Invalid binary");
  }
  return `0x${binaryToHex(binary)}`;
};

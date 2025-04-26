import { FixedLengthArray } from "./array";
import { hexToBinary, binaryToDecimal } from "./utils";

const rsaFieldLength = 17;
export const RSA_FIELD_BITS = 121n;
export const RSA_FIELD_LENGTH = BigInt(rsaFieldLength);

export type CircuitInputN = FixedLengthArray<string, 17>;

const emptyCircuitInputN: CircuitInputN = Array.from(
  { length: rsaFieldLength },
  () => "0x0" as `0x${string}`,
) as CircuitInputN;

export const publicKeyNToCircomInputs = (n: string): CircuitInputN => {
  const binary = hexToBinary(n);
  const subFields: CircuitInputN = emptyCircuitInputN;
  for (let i = 0; i < rsaFieldLength; i++) {
    subFields[i] = binaryToDecimal(binary.slice(i * 121, (i + 1) * 121));
  }
  return subFields;
};

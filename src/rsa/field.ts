import { FixedLengthArray } from "./array";

// circom rsa field expression
// 121 bits * 17 = 2057 bits operation
export const RSA_FIELD_BITS = 121;
export const RSA_FIELD_LENGTH = 17;
const BIGINT_121_MAX = 2n ** BigInt(RSA_FIELD_BITS) - 1n;

export type CircuitInputN = FixedLengthArray<bigint, 17>;

export const publicKeyNToCircomInputs = (n: bigint): CircuitInputN => {
  return Array.from({ length: Number(RSA_FIELD_LENGTH) }, (_, i) => {
    const remainder = n >> BigInt(i * RSA_FIELD_BITS);
    return remainder & BIGINT_121_MAX;
  }) as CircuitInputN;
};

const RSA_FIELD_BITS = 121n;
const RSA_FIELD_LENGTH = 17n;

export const bigintToRsaField = (num: bigint): bigint[] => {
  let remainder = num;
  const subFieldMax = (1n << RSA_FIELD_BITS) - 1n;
  return Array.from({ length: Number(RSA_FIELD_LENGTH) }, () => {
    const field = remainder & subFieldMax;
    remainder >>= RSA_FIELD_BITS;
    return field;
  });
};

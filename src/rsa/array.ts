export type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthArray<T, N, []>
  : never;

type _FixedLengthArray<
  T,
  N extends number,
  R extends unknown[],
> = R["length"] extends N ? R : _FixedLengthArray<T, N, [T, ...R]>;

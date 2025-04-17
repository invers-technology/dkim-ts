import { EmailHeader } from "./email";

enum HeaderParseState {
  Initial,
  Key,
  PreValue,
  Value,
  ValueNewline,
  Complete,
}

export const getHeaders = (
  headers: EmailHeader[],
  key: string,
): string | undefined => {
  return headers.find(
    (header) => header.key.toLowerCase() === key.toLowerCase(),
  )?.value;
};

export const parseHeaders = (rawData: string): [EmailHeader[], number] => {
  let headers: EmailHeader[] = [];
  let ix = 0;
  while (ix < rawData.length) {
    if (rawData[ix] === "\n") {
      ix++;
      break;
    } else if (rawData[ix] === "\r") {
      if (ix + 1 < rawData.length && rawData[ix + 1] === "\n") {
        ix += 2;
        break;
      } else {
        throw new Error("Invalid header");
      }
    }
    let [header, ix_next] = parseHeader(rawData.slice(ix, rawData.length));
    headers.push(header);
    ix += ix_next;
  }
  return [headers, ix];
};

const parseHeader = (rawData: string): [EmailHeader, number] => {
  let ix = 0;
  let ix_key_end = 0;
  let ix_value_start = 0;
  let ix_value_end = 0;
  const chars = [...rawData];

  let state = HeaderParseState.Initial;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    switch (state) {
      case HeaderParseState.Initial: {
        if (c === " ") {
          throw new Error("Invalid header");
        }
        state = HeaderParseState.Key;
        continue;
      }
      case HeaderParseState.Key: {
        if (c === ":") {
          ix_key_end = i;
          state = HeaderParseState.PreValue;
          continue;
        } else if (c === "\n") {
          ix_key_end = i;
          ix_value_start = i;
          ix_value_end = i;
          state = HeaderParseState.Complete;
          break;
        }
        continue;
      }
      case HeaderParseState.PreValue: {
        if (c !== " ") {
          ix_value_start = i;
          ix_value_end = i;
          state = HeaderParseState.Value;
          continue;
        }
        continue;
      }
      case HeaderParseState.Value: {
        if (c === "\n") {
          state = HeaderParseState.ValueNewline;
          continue;
        } else if (c !== "\r") {
          ix_value_end = i + 1;
          continue;
        }
        continue;
      }
      case HeaderParseState.ValueNewline: {
        if (c === " " || c === "\t") {
          state = HeaderParseState.Value;
          continue;
        } else {
          state = HeaderParseState.Complete;
          break;
        }
      }
    }
    if (state === HeaderParseState.Complete) {
      ix = i;
      break;
    }
  }

  return [
    ix_key_end !== 0
      ? {
          key: rawData.slice(0, ix_key_end),
          value: rawData.slice(ix_value_start, ix_value_end),
        }
      : {
          key: rawData.slice(0, ix),
          value: rawData.slice(ix, ix),
        },
    ix,
  ];
};

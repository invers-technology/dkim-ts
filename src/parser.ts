import { parseDkim, DkimParams } from "./header";
import { newCanonicalization, canonicalize } from "./canonicalization";

enum HeaderParseState {
  Initial,
  Key,
  PreValue,
  Value,
  ValueNewline,
  Complete,
}

export interface EmailHeader {
  key: string;
  value: string;
}

export const parseRawEmail = (
  rawData: string,
): {
  canonicalizedHeaders: string;
  canonicalizedBody: string;
  dkim: DkimParams;
} => {
  const [headers, ix] = parseHeaders(rawData);
  const dkim = parseDkim(headers);
  const body = rawData.slice(ix, rawData.length);
  const canonicalizeInstruction = newCanonicalization(dkim.c);
  const [canonicalizedHeaders, canonicalizedBody] = canonicalize(
    canonicalizeInstruction,
    dkim,
    headers,
    body,
  );
  return { canonicalizedHeaders, canonicalizedBody, dkim };
};

const parseHeaders = (rawData: string): [EmailHeader[], number] => {
  let headers: EmailHeader[] = [];
  let i = 0;
  while (i < rawData.length) {
    if (rawData[i] === "\n") {
      i++;
      break;
    } else if (rawData[i] === "\r") {
      if (i + 1 < rawData.length && rawData[i + 1] === "\n") {
        i += 2;
        break;
      } else {
        throw new Error("Invalid header");
      }
    }
    let [header, i_next] = parseHeader(rawData.slice(i, rawData.length));
    headers.push(header);
    i += i_next;
  }
  return [headers, i];
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

# DKIM Signature Verification with Typescript

[![MIT License](https://img.shields.io/github/license/inverse-technology/dkim-ts?style=flat-square)](https://github.com/inverse-technology/dkim-ts/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org) ![npm version](https://badge.fury.io/js/dkim-verifier.svg) [![CI Check](https://github.com/inverse-technology/dkim-ts/actions/workflows/index.yml/badge.svg)](https://github.com/inverse-technology/dkim-ts/actions/workflows/index.yml)

A dkim signature implementation with imap example and circom circuit.

**Use at your own risk**.

## Install

```
$ npm i dkim-verifier
```

## Usage

```ts
import { readFileSync } from "fs";
import {
  parseRawEmail,
  verifyBody,
  verifyDkimSignature,
  getDkimPublicKey,
} from "dkim-verifier";

const emailRaw = readFileSync(emailFilePath, "utf8");
const { canonicalizedHeaders, canonicalizedBody, dkim } =
  parseRawEmail(emailRaw);
const isBodyVerified = verifyBody(canonicalizedBody, dkim);
const publicKey = await getDkimPublicKey(dkim);
const isDkimVerified = verifyDkimSignature(
  dkim,
  canonicalizedHeaders,
  publicKey,
);
expect(isBodyVerified).toBe(true);
expect(isDkimVerified).toBe(true);
```

## Test

```shell
$ yarn test
```

## Example

Please set your gmail account info.

```shell
$ cp .env.example .env
$ ts-node example/imap.ts
```

---
name: Bug report
about: Something in the schema, generated types, validation, or conformance corpus doesn't work the way it should
title: "<short description of the bug>"
labels: bug
---

## What happened

A clear description of the actual behavior — e.g. a manifest/lockfile that
should validate but doesn't (or vice versa), a generated type that doesn't
match the schema, a conformance fixture that fails against the reference
validator.

## Expected behavior

What you expected instead, ideally with the specific schema clause it should
follow.

## Reproduction

A minimal `ribosome.json`/`ribosome.lock.json` snippet, or the failing
conformance fixture, plus the validator/language used (this package, or a
third-party JSON Schema validator against the hosted `$id`).

## Environment

- `@medullaflow/ribosome-schema` version (or schema version, if consuming the
  hosted JSON directly):
- Language/validator, if not this package's TypeScript binding:

## Notes

Anything else — is this specific to the TypeScript binding (`bindings/typescript/`),
or does it affect the normative schema itself (`schema/v1/`)?

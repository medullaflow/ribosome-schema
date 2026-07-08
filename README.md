# ribosome-schema

**The ribosome standard**: normative JSON Schemas for the `ribosome.json`
project manifest and the `ribosome.lock.json` output, a conformance corpus, and
a TypeScript binding.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange.svg)](#status)

This repo holds **the standard, and only the standard** — no resolver, no
runtime, no orchestration logic. That lives in
[ribosome](https://github.com/medullaflow/ribosome), which depends on this
repo instead of embedding the schema. Splitting them keeps the standard
**freely implementable by anyone** (Apache-2.0, no copyleft) independent of the
reference implementation's license (AGPL-3.0-or-later).

## What's here

```
schema/v1/          the standard — manifest.schema.json, lockfile.schema.json
vendor/              the pinned, vendored MCP server.json schema (MIT, upstream)
conformance/          valid/ + invalid/ fixtures — the executable specification
bindings/typescript/  generated types + validation + version pins (npm package)
```

## Consuming the schema

**Without npm, in any language:** JSON Schema is language-agnostic by design.
Point any JSON Schema validator (Python `jsonschema`, Go `gojsonschema`, Rust
`jsonschema-rs`, …) at the canonical `$id`:

```
https://schema.ribosome.medullaflow.org/v1/manifest.schema.json
https://schema.ribosome.medullaflow.org/v1/lockfile.schema.json
```

Live: a dedicated GitHub Pages custom domain, published on every push to
`main` by [`.github/workflows/publish-pages.yml`](.github/workflows/publish-pages.yml),
which deploys **only** the `*.schema.json` files under `schema/` plus
[`schema/CNAME`](schema/CNAME) — nothing else in this repo is ever part of that
artifact. `CNAME` isn't schema content, but is required for GitHub Pages to
attach the custom domain on each deploy; the workflow fails loudly if it's
ever missing.

**From TypeScript/JavaScript:**

```bash
npm install @medullaflow/ribosome-schema
```

```typescript
import { validateManifest, checkManifest, type RibosomeManifest } from "@medullaflow/ribosome-schema";

const manifest = validateManifest(JSON.parse(raw)); // throws SchemaValidationError, listing every failure
```

## Versioning

- `schemaVersion` in the manifest/lockfile is bumped only on breaking changes.
- The vendored MCP `server.json` schema is **pinned and vendored**
  (`vendor/`), not fetched live — see [`vendor/README.md`](vendor/README.md)
  for the drift-detection and update workflow.
- Adding a language binding (Python, Go, …) is a new sibling under `bindings/`;
  it does not touch `schema/` or other bindings.

## Development

```bash
npm install        # root tooling deps (codegen)
npm run spec:types # regenerate bindings/typescript/src/types.ts from schema/v1/
npm test           # build the TS binding + run the conformance corpus against it
npm run vendor:check   # verify the vendored server.json against its pin (local + upstream)
```

## Status

Pre-alpha. The schemas, conformance corpus, and TypeScript binding are real and
tested, and the schema is **hosted live** at its canonical `$id`
(`schema.ribosome.medullaflow.org`). Not yet published to npm — see
[the ribosome roadmap](https://github.com/medullaflow/ribosome/blob/main/ROADMAP.md)
Phase 4.

## Licensing

Apache-2.0 throughout, except the vendored MCP `server.json` schema (MIT,
upstream). Per-file detail is machine-readable via [REUSE](https://reuse.software)
(`REUSE.toml`); full texts in [`LICENSES/`](LICENSES/). See [NOTICE](NOTICE).

**You may implement this standard in any product, open or closed, without
obligation.**

## Attribution

Part of the [medullaflow](https://github.com/medullaflow) project. Primary
author: Matteo Lacchio — [@ookmash](https://github.com/ookmash).

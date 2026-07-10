# ribosome-schema

**The ribosome standard**: normative JSON Schemas for the `ribosome.json`
project manifest and the `ribosome.lock.json` output, a conformance corpus, and
a TypeScript binding.

[![CI](https://github.com/medullaflow/ribosome-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/medullaflow/ribosome-schema/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@medullaflow/ribosome-schema)](https://www.npmjs.com/package/@medullaflow/ribosome-schema)
[![schema: live](https://img.shields.io/badge/schema-live-brightgreen)](https://schema.ribosome.medullaflow.org/v1/manifest.schema.json)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange.svg)](#status)

This repo holds **the standard, and only the standard** — no resolver, no
runtime, no orchestration logic. Resolvers/tools consume it as a dependency
rather than embedding it; the [ribosome](https://github.com/medullaflow/ribosome)
resolver is the reference consumer, but the standard stands on its own. See
[Licensing](#licensing) below.

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

Four independent version numbers exist in this repo. Each has exactly **one**
hand-authored source; everything else is generated or checked against it —
never a second hand-typed copy.

| Version | Hand-authored source | Everywhere else it appears |
|---|---|---|
| **Schema format** (`schemaVersion`) | `schema/v1/*.schema.json` → `properties.schemaVersion.const` | `SCHEMA_VERSION` in generated `types.ts`; `$id` path segment; the `schema/v1/` directory name — all checked by [`test/schema-version.test.js`](test/schema-version.test.js), which runs on every `bun run test` |
| **Vendored MCP `server.json`** | `MCP_SERVER_SCHEMA_VERSION` in [`version.ts`](bindings/typescript/src/version.ts) | The vendored filename, `$ref` resolution, `mcpSchemaVersion` stamped into lockfiles — see [`vendor/README.md`](vendor/README.md) |
| **npm package** (`@medullaflow/ribosome-schema`) | `version` in [`bindings/typescript/package.json`](bindings/typescript/package.json) | Ordinary semver; independent of `schemaVersion` — a patch/minor release (bug fix, docs, non-breaking additive field) does **not** require a `schemaVersion` bump |
| **ribosome-schema repo** | git tags / GitHub Releases | Drives the npm publish (`publish-npm.yml`) |

**Manifest and lockfile are versioned together, as one schema family** — the
lockfile is defined as "the resolved output of a manifest," so they always
move as a couple. `schema/v1/manifest.schema.json` and
`schema/v1/lockfile.schema.json` must declare the identical `schemaVersion`
const; the codegen script (`scripts/gen-types.js`) refuses to run if they
diverge.

**What requires a `schemaVersion` bump:** removing/renaming a field, changing
a field's type or making an optional field required, or any other change that
would make a previously-valid document invalid. **What doesn't:** adding a new
optional field, loosening a constraint, fixing a description/typo.

**How to bump `schemaVersion`** (e.g. `1` → `2`):

1. Create `schema/v2/manifest.schema.json` and `schema/v2/lockfile.schema.json`
   — copy from `v1`, bump `schemaVersion.const` and `$id` in both.
   **`schema/v1/` is never edited or deleted** — once an `$id` URL is published
   it must keep resolving, byte-for-byte, forever; consumers pin to it. A new
   version is additive (`v2/` alongside `v1/`), never a mutation of the old one.
2. Update `CURRENT_SCHEMA_DIR` in `scripts/gen-types.js` (and in
   `test/schema-version.test.js`) to `"v2"`.
3. Run `bun run spec:types`, add conformance fixtures under
   `conformance/valid|invalid/` for whatever changed, `bun run test`.
4. Bump the npm package's major version; note the break in `CHANGELOG.md`.

Adding a language binding (Python, Go, …) is a new sibling under `bindings/`;
it does not touch `schema/` or other bindings.

## Development

```bash
bun install         # root tooling deps (codegen)
bun run spec:types  # regenerate bindings/typescript/src/types.ts from schema/v1/
bun run test        # build the TS binding + run the conformance corpus against it
bun run vendor:check # verify the vendored server.json against its pin (local + upstream)
```

Toolchain is [bun](https://bun.sh), not Node — for consistency with
[ribosome](https://github.com/medullaflow/ribosome)'s own toolchain (see its
`docs/ARCHITECTURE.md` D14). One deliberate exception: `publish-npm.yml`'s
final publish step stays on the npm CLI, since `bun publish` doesn't yet
support npm's OIDC trusted publishing.

## Status

Pre-alpha. The schemas, conformance corpus, and TypeScript binding are real and
tested; the schema is **hosted live** at its canonical `$id`
(`schema.ribosome.medullaflow.org`) and published to npm as
`@medullaflow/ribosome-schema`. What's next is in [ROADMAP.md](ROADMAP.md).

## Licensing

**Apache-2.0** — see [LICENSE](LICENSE) and [NOTICE](NOTICE) for what that
means and why. Per-file detail (the one vendored exception) is
machine-readable via [REUSE](https://reuse.software) (`REUSE.toml`); full
texts in [`LICENSES/`](LICENSES/).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — what goes where (schema vs. binding),
the version-bump procedure, DCO sign-off, and how to add yourself to
[AUTHORS](AUTHORS).

## Attribution

Principal authorship and copyright: [AUTHORS](AUTHORS); primary author
Matteo Lacchio — [@ookmash](https://github.com/ookmash). Full contributor list:
the repository's
[Contributors graph](https://github.com/medullaflow/ribosome-schema/graphs/contributors).

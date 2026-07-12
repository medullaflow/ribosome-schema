# ribosome-schema

**The manifest & lockfile standard for [ribosome](https://github.com/medullaflow/ribosome),
the MCP package manager.** Normative JSON Schemas for the `ribosome.json`
project manifest and the `ribosome.lock.json` output, a conformance corpus, and
a TypeScript binding.

[![CI](https://github.com/medullaflow/ribosome-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/medullaflow/ribosome-schema/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@medullaflow/ribosome-schema)](https://www.npmjs.com/package/@medullaflow/ribosome-schema)
[![npm downloads](https://img.shields.io/npm/dm/@medullaflow/ribosome-schema)](https://www.npmjs.com/package/@medullaflow/ribosome-schema)
[![schema: live](https://img.shields.io/badge/schema-live-brightgreen)](https://schema.ribosome.medullaflow.org/v1/manifest.schema.json)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status: alpha](https://img.shields.io/badge/status-alpha-yellow.svg)](#status)

---

## What this is

Think of the npm ecosystem: `npm` is the tool, but `package.json` and the
lockfile format are a **separate, stable standard** that anything can read and
write. This repo is that standard for MCP dependency management:

- **[ribosome](https://github.com/medullaflow/ribosome)** is the package manager
  (the tool) — **MPL-2.0**.
- **ribosome-schema (this repo)** is the format it reads — **Apache-2.0**, so
  you can implement it in any product, open or closed, with no copyleft
  obligation.

It holds **the standard, and only the standard** — no resolver, no runtime, no
orchestration logic. ribosome is the reference consumer, but the standard stands
on its own.

## What's here

```
schema/v1/            the standard — manifest.schema.json, lockfile.schema.json
vendor/               the pinned, vendored MCP server.json schema (MIT, upstream)
conformance/          valid/ + invalid/ fixtures — the executable specification
bindings/typescript/  generated types + validation + version pins (npm package)
```

## Use it

**In any language, without npm.** JSON Schema is language-agnostic by design.
Point any validator (Python `jsonschema`, Go `gojsonschema`, Rust
`jsonschema-rs`, …) at the canonical, live `$id`:

```
https://schema.ribosome.medullaflow.org/v1/manifest.schema.json
https://schema.ribosome.medullaflow.org/v1/lockfile.schema.json
```

Hosted on a GitHub Pages custom domain, published on every push to `main` by
[`publish-pages.yml`](.github/workflows/publish-pages.yml) — which deploys
**only** the `*.schema.json` files plus [`schema/CNAME`](schema/CNAME), nothing
else in this repo.

**From TypeScript/JavaScript**, with generated types and an offline `ajv`-based
validator:

```bash
npm install @medullaflow/ribosome-schema
```

```typescript
import { validateManifest, checkManifest, type RibosomeManifest } from "@medullaflow/ribosome-schema";

const manifest = validateManifest(JSON.parse(raw)); // throws SchemaValidationError, listing every failure
const { valid, errors } = checkManifest(data);      // non-throwing variant
```

## Status

**Alpha.** The schemas, conformance corpus, and TypeScript binding are real and
tested; the schema is **hosted live** at its canonical `$id`
(`schema.ribosome.medullaflow.org`) and published to npm as
`@medullaflow/ribosome-schema`; [`SPEC.md`](SPEC.md) pins down the interface's
compatibility rules and the semantics this schema deliberately leaves opaque.
What's next is in [ROADMAP.md](ROADMAP.md).

<details>
<summary><strong>What "alpha" meant</strong></summary>

This package cleared its own alpha bar — a record of what that bar was, not a
live checklist:

1. ✅ **[`SPEC.md`](SPEC.md) exists**, pinning down versioning/compatibility
   rules and the semantics of `permissions`/`extends` — alpha implies the
   interface won't change wildly without warning, which needs to be written
   down, not just true in practice.
2. ✅ **The [Guardrails & Governance](https://github.com/medullaflow/ribosome-schema/milestones)
   milestone's open items are resolved or explicitly accepted as deliberately
   deferred** (both currently open issues there are the latter: gated on a
   trigger — a new dependency, dependency-tree growth — that hasn't happened
   yet, not unstarted work).

Not gated on SchemaStore submission, conformance-corpus restructuring, or
sibling language bindings — those are real, tracked in
[ROADMAP.md](ROADMAP.md), and are beta/stable-track expansion, not an alpha
requirement.

</details>

## Versioning

Four independent version numbers exist here. Each has exactly **one**
hand-authored source; everything else is generated or checked against it — never
a second hand-typed copy.

| Version | Hand-authored source | Everywhere else it appears |
|---|---|---|
| **Schema format** (`schemaVersion`) | `schema/v1/*.schema.json` → `properties.schemaVersion.const` | `SCHEMA_VERSION` in generated `types.ts`; `$id` path segment; the `schema/v1/` directory name — all checked by [`test/schema-version.test.js`](test/schema-version.test.js) |
| **Vendored MCP `server.json`** | `MCP_SERVER_SCHEMA_VERSION` in [`version.ts`](bindings/typescript/src/version.ts) | The vendored filename, `$ref` resolution, `mcpSchemaVersion` stamped into lockfiles — see [`vendor/README.md`](vendor/README.md) |
| **npm package** | `version` in [`bindings/typescript/package.json`](bindings/typescript/package.json) | Ordinary semver; independent of `schemaVersion` |
| **repo release** | git tags / GitHub Releases | Drives the npm publish (`publish-npm.yml`) |

**Manifest and lockfile are versioned together, as one schema family** — the
lockfile is "the resolved output of a manifest," so they always move as a
couple. Both `schema/v1/*.schema.json` must declare the identical
`schemaVersion` const; `scripts/gen-types.js` refuses to run if they diverge.

**What requires a `schemaVersion` bump:** removing/renaming a field, changing a
field's type or making an optional field required — anything that would make a
previously-valid document invalid. **What doesn't:** adding an optional field,
loosening a constraint, fixing a description.

<details>
<summary><strong>How to bump <code>schemaVersion</code> (e.g. 1 → 2)</strong></summary>

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

Adding a language binding (Python, Go, …) is a new sibling under `bindings/`; it
does not touch `schema/` or other bindings.

</details>

## Development

```bash
bun install          # root tooling deps (codegen)
bun run spec:types   # regenerate bindings/typescript/src/types.ts from schema/v1/
bun run test         # build the TS binding + run the conformance corpus against it
bun run vendor:check # verify the vendored server.json against its pin (local + upstream)
```

Toolchain is [bun](https://bun.sh), not Node — for consistency with
[ribosome](https://github.com/medullaflow/ribosome)'s own toolchain (see its
`docs/ARCHITECTURE.md` D14). One deliberate exception: `publish-npm.yml`'s final
publish step stays on the npm CLI, since `bun publish` doesn't yet support npm's
OIDC trusted publishing.

## Licensing

**Apache-2.0** — see [LICENSE](LICENSE) and [NOTICE](NOTICE). Per-file detail
(the one vendored exception) is machine-readable via
[REUSE](https://reuse.software) (`REUSE.toml`); full texts in
[`LICENSES/`](LICENSES/).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — what goes where (schema vs. binding),
the version-bump procedure, DCO sign-off, and how to add yourself to
[AUTHORS](AUTHORS).

## Attribution

Principal authorship and copyright: [AUTHORS](AUTHORS); primary author Matteo
Lacchio — [@ookmash](https://github.com/ookmash). Full contributor list: the
[Contributors graph](https://github.com/medullaflow/ribosome-schema/graphs/contributors).

# Roadmap

The plan for **ribosome-schema** — the standard itself. Scoped to this repo
only: schemas, the conformance corpus, hosting, and language bindings. (The
reference resolver that consumes the standard has its own, separate roadmap.)

This file is the canonical, versioned source of truth; GitHub milestones/issues
mirror it for live status.

Status legend: ✅ done · 🚧 in progress · ⬜ not started

## Done ✅

- **The v1 schemas** — `manifest.schema.json` + `lockfile.schema.json`,
  normative, with a conformance corpus and generated TypeScript types.
- **Vendored + pinned** MCP `server.json` schema, with drift detection
  (`npm run vendor:check`) and a deliberate update flow (`npm run vendor:update`).
- **Live hosting** at the canonical `$id`,
  `https://schema.ribosome.medullaflow.org/v1/…`, published by
  `publish-pages.yml` (deploys *only* the `*.schema.json` files).
- **npm package** `@medullaflow/ribosome-schema`, published via OIDC trusted
  publishing (`publish-npm.yml`, no stored token).
- **Centralized versioning** — one hand-authored source per version number,
  enforced by `test/schema-version.test.js` (see [README → Versioning](README.md#versioning)).

## Planned ⬜

### Normative spec document
- `SPEC.md`: prose that pins down what the schemas can't express on their own —
  versioning/compatibility rules, and the **semantics of `permissions`** (the
  schema treats them as opaque strings; the spec must say what they mean).
- Specify the reserved **`extends`** field's semantics (importing external MCP
  config). The field exists in v1; its normative meaning is defined here, its
  parsing is a consumer concern.

### Editor & ecosystem reach
- Submit to **SchemaStore** so editors auto-associate `ribosome.json` /
  `ribosome.lock.json` with the schema.

### Conformance as a shared, cross-language suite
- Restructure the corpus into a **language-agnostic** format
  (`{description, input, valid, expectedErrorPointer?}`), so any implementation
  in any language runs the *same* suite rather than a TS-coupled one.
- Assert *which* rule an `invalid` fixture violates, not just a boolean — so a
  schema that rejects for the wrong reason still fails the test.

### More language bindings
- Add sibling bindings under `bindings/` (Python, Go, …) as demand appears.
  A new binding never touches `schema/` or other bindings.

## Repo hygiene
- `reuse lint` in CI for full license-compliance coverage.

## GitHub tracking
- Milestones/issues in this repo mirror the sections above; labels
  `area:schema`, `area:conformance`, `area:binding`, `area:spec`.

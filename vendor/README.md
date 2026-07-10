# Vendored external schemas

Third-party JSON Schemas are **vendored** (copied in, pinned to an exact
version) rather than referenced over the network. This is deliberate:

- **Reproducibility** — a given release always validates against the exact
  same external schema. A remote `$ref` to a "latest" URL would let the
  meaning of *our* standard change without a release of *ours*.
- **Offline validation** — no network round-trip is required to validate a
  manifest, so a missing tool fails at validation time (not mid-run).
- **Auditability** — the exact bytes we validate against are in git.

Upgrading a vendored schema is a **deliberate, released change**, never silent
drift.

## Contents

| File | Source | Version | SHA-256 |
|------|--------|---------|---------|
| `server.schema.2025-12-11.json` | [MCP Registry `server.json`](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json) | `2025-12-11` | `3fba09590c99f61735d234822279f4223fab9e300c0a81e81c91ab62a4114de0` |

The version **and its SHA-256** are the machine-checkable pin in
[`../bindings/typescript/src/version.ts`](../bindings/typescript/src/version.ts)
(`MCP_SERVER_SCHEMA_VERSION` / `MCP_SERVER_SCHEMA_SHA256`); the version is also
stamped into every `ribosome.lock.json` (`mcpSchemaVersion`). `validate.ts`
loads the vendored file by that version, so `version.ts` is the single source
of truth.

`server.schema.json` is © the Model Context Protocol authors, MIT-licensed
(declared in [`../REUSE.toml`](../REUSE.toml)). See the
[registry repository](https://github.com/modelcontextprotocol/registry).

## Drift detection (automated)

`bun run vendor:check` (CI: [`vendor-drift.yml`](../.github/workflows/vendor-drift.yml),
weekly) verifies the vendored file **and** the upstream URL still hash to the
pin. It never edits anything; on mismatch it fails and opens a tracking issue.

## Updating (deliberate, via PR)

```bash
bun run vendor:update <YYYY-MM-DD>   # downloads, vendors, updates the pin, regenerates types
```

Then, in the same PR: update the table above, add/adjust conformance fixtures
for any new fields, ensure `bun run test` passes, bump this package's version, and
add a `CHANGELOG.md` entry. Never auto-merge — a schema change can change the
meaning of the standard.

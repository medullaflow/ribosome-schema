# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/)

## [Unreleased]

## [0.1.2] - 2026-07-08

Note: 0.1.0 and 0.1.1 exist as npm/git artifacts from the initial release
process but should be treated as superseded — 0.1.2 is the first release with
a git tag that actually matches its published content.

### Added
- Extracted from [ribosome](https://github.com/medullaflow/ribosome) into a
  standalone, Apache-2.0-licensed repo: the normative manifest/lockfile JSON
  Schemas (`schema/v1/`), the vendored & pinned MCP `server.json` schema
  (`vendor/`), the conformance corpus (`conformance/`), and the TypeScript
  binding (`bindings/typescript/`, published as `@medullaflow/ribosome-schema`).
- Vendor drift detection (`npm run vendor:check`) and deliberate update flow
  (`npm run vendor:update`).
- Centralized schema versioning: `SCHEMA_VERSION` is generated from
  `schema/v1/*.schema.json`'s `schemaVersion` const (not hand-typed), with
  `test/schema-version.test.js` enforcing that the schema files, `$id`, and
  generated output all agree — enforced on every `npm test`.
- `publish-npm.yml` uses npm Trusted Publishing (OIDC) — no long-lived token
  ever stored in this repo.
- Package-local `LICENSE` (generated at build time from the repo-root
  `LICENSE`, never hand-duplicated) and a package-specific `README.md` for
  the npmjs.com listing.

### Contributors
- **Matteo Lacchio** — extraction and initial scaffolding

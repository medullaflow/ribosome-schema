# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/)

## [0.1.3] - 2026-07-09

### Changed
- **Toolchain moved to [bun](https://bun.sh)**, not Node, for consistency with
  the resolver repo ([ribosome](https://github.com/medullaflow/ribosome), see
  its `docs/ARCHITECTURE.md` D14): `bun install`/`build`/`test`, root and
  `bindings/typescript` both, `ci.yml`, `dco.yml`, `vendor-drift.yml`. No
  behavior change — verified against the exact same schema/conformance/
  version-consistency test suite (11/11), now run via `bun test`.
- **`publish-npm.yml` is the one deliberate exception**, not an oversight:
  install/build there run on bun too, but the final `npm publish` step stays
  on the npm CLI specifically, because `bun publish` does not yet support
  npm's OIDC trusted publishing ([oven-sh/bun#24855](https://github.com/oven-sh/bun/issues/24855),
  open). Switching it would have silently broken trusted publishing.
- `bun.lock` replaces `package-lock.json` (root and `bindings/typescript`).

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

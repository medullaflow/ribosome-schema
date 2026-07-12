# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/)

## [Unreleased]

## [0.1.12] - 2026-07-12

### Added
- **[`SPEC.md`](SPEC.md)** — the normative companion to the schema files,
  closing #10 and #11. Pins down: (1) a decision table for what counts as a
  breaking vs. non-breaking schema change; (2) `permissions`'s semantics —
  opaque scope strings this repo defines the shape and contract for, not a
  vocabulary; (3) `extends`'s semantics — importing `.mcp.json`-shaped
  external config as `ProcessServer` entries, path resolution rules, and a
  full local-over-imported, later-over-earlier conflict-resolution order.
  This clears this repo's own alpha bar (both criteria now met) — status
  bumped from pre-alpha to alpha.
- **READMEs restructured for adoption** — the repo README is reframed as
  "the manifest & lockfile standard for the MCP package manager" (the
  package.json-format-vs-npm-the-tool analogy), with a problem→solution→use
  flow and the dense versioning/bump reference moved into `<details>`
  blocks. The published package README (`bindings/typescript`) tagline is
  aligned to the same positioning. Removed a stale duplicate alpha section
  ("What alpha means" forward-looking text that contradicted the
  already-reached alpha status).

## [0.1.11] - 2026-07-11

### Changed
- `typescript` (a devDependency of `bindings/typescript`, build-time only --
  `tsc` compiles `dist/`, nothing from it ships in the published package)
  bumped to `^7.0.2`, the native/Go compiler. Clean bump: this repo's own
  tooling (`scripts/gen-types.js`) generates types via `json-schema-to-
  typescript`, never TypeScript's own programmatic Compiler API, so it's
  unaffected by that API's removal in 7.0 (which did require a bridge
  package, `@typescript/typescript6`, in the sibling `ribosome` repo's own
  `scripts/architecture-rules.js` -- see that repo's `docs/ARCHITECTURE.md`
  D34). No schema/behavior change; `bun run build`/`test`/`lint` all pass
  unmodified.

## [0.1.10] - 2026-07-11

### Fixed
- `pool.dir`'s own description incorrectly said it resolves relative to "this
  manifest's own directory" -- corrected to the project root (the resolver's
  `cwd`), which is what the sibling `ribosome` repo's `Materializer` actually
  anchors it to (it only ever sees the already-parsed manifest value plus
  `cwd`, never the manifest file's own path). These coincide whenever the
  manifest lives at the project root, the overwhelmingly common case; they
  can differ if a caller resolves a manifest from a non-default path. Doc-only
  correction, no schema/behavior change.

## [0.1.9] - 2026-07-11

### Added
- `RibosomeManifest` gains an optional `pool` field (`{ dir }`): the directory
  a project's runtime pool is materialized into, resolved relative to the
  manifest's own directory unless absolute. Provider-interpreted -- the
  sibling `ribosome` repo's mise-backed provider maps this to `MISE_DATA_DIR`;
  a provider with no relocatable store may ignore it. Omitted (the default)
  means the provider's own default, typically a store shared across projects
  that maximizes install reuse -- setting `dir` trades that reuse for
  isolation (hermetic CI, per-package pools in a monorepo), so it's meant as
  an escape hatch, not a default-reach-for knob. Purely additive: existing
  manifests with no `pool` field are unaffected.

## [0.1.8] - 2026-07-10

### Added
- `RegistrySource` gains an optional `auth` field: an array of
  `{ header, envVar }` pairs naming HTTP headers to send when resolving
  against that source, with each value read from the named environment
  variable at resolve time -- never a literal credential in the manifest.
  Needed for real subregistries beyond the unauthenticated official one (e.g.
  PulseMCP's public v0.1 API requires `X-API-Key` + `X-Tenant-ID`), which the
  sibling `ribosome` repo's registry adapter is starting to support. Purely
  additive: existing manifests with no `auth` field are unaffected.

## [0.1.7] - 2026-07-10

### Added
- `validateMcpServerJson`/`checkMcpServerJson`: runtime validation for a
  standalone `McpServerJson` document against the vendored schema, alongside
  the existing `validateManifest`/`validateLockfile`. Until now, `McpServerJson`
  only had a compile-time TypeScript type -- fine for data already known-valid,
  but not for a descriptor arriving from an untrusted source (e.g. a live MCP
  registry HTTP response), which needs checking at that trust boundary like
  everything else this package validates. Needed by the sibling `ribosome`
  repo's registry adapter work.

## [0.1.6] - 2026-07-10

### Fixed
- `bindings/typescript/README.md` (the file npm renders as the package page)
  linked bare `[LICENSE](LICENSE)` — a gitignored build artifact, so the link
  404s when browsing this file on GitHub and only resolved inside the
  published npm tarball. Fixed with an absolute GitHub URL.
- Stale `npm run`/`npm test` references (leftover from before the bun
  migration) in code comments and user-facing messages across
  `scripts/copy-schemas.js`, `scripts/gen-types.js`, `scripts/vendor-update.js`,
  `bindings/typescript/src/version.ts`, `test/conformance.test.js`,
  `test/schema-version.test.js`, `vendor/README.md`.
- `scripts/vendor-update.js` shelled out to `node` explicitly instead of
  `bun` — a real toolchain-coherence bug, not just a comment.

### Added
- `package.json` metadata: `homepage`, `bugs`, and `publishConfig.access:
  "public"` (defense-in-depth — `publish-npm.yml` already passes
  `--access public` explicitly, but a manual publish wouldn't).
- A Security section in README.md linking `SECURITY.md`.
- A "Linting, formatting, and license compliance" section in
  `CONTRIBUTING.md` documenting the Biome/reuse-lint tooling.

### Changed
- `ROADMAP.md` restructured as a GitHub-milestones pointer, mirroring the
  sibling `ribosome` repo. 5 new milestones created with architectural-level
  issues: Core Schema & Publishing (closed, retrospective), Normative
  Specification, Ecosystem Integration, Conformance Suite Evolution,
  Language Bindings.

## [0.1.5] - 2026-07-10

### Fixed
- **`bindings/typescript/src/mcp-server-types.ts` carried the wrong SPDX
  header** — `AGPL-3.0-or-later` / "ribosome contributors", copy-pasted from
  the sibling `ribosome` repo. Corrected to `Apache-2.0` / "ribosome-schema
  contributors", matching every other file here. This repo is Apache-2.0
  throughout; the wrong header was a metadata defect, not a behavior change,
  but a real compliance issue in the previously-published 0.1.3.
- `reuse lint` (newly enforced, see below) surfaced pre-existing REUSE.toml
  coverage gaps: `CHANGELOG.md`, `NOTICE`, `README.md`, `LICENSE`,
  `REUSE.toml` itself, both `bun.lock` files, and `vendor/README.md` (only
  `vendor/*.json` was covered, not the README alongside it) had no license
  annotation anywhere. All now covered.

### Added
- **Biome** as the linter + formatter, enforced at three points: local
  (`bun run lint`/`lint:fix`/`format`), a new pre-commit hook (`.githooks/`,
  wired via `core.hooksPath`, neither of which existed here before), and CI.
- **`reuse lint`** (via `fsfe/reuse-action`) now runs in CI — `REUSE.toml`
  existed but was never actually checked until now.
- Community health files: `CODE_OF_CONDUCT.md` (Contributor Covenant),
  `SECURITY.md`, and issue templates (bug report, feature/schema-change
  request, `config.yml` disabling blank issues).
- GitHub repo settings aligned with the sibling `ribosome` repo's governance
  baseline: secret scanning + push protection + Dependabot security updates +
  private vulnerability reporting all enabled, a branch ruleset on `main`
  requiring `lint`/`test`/`reuse-lint`/`check-dco` status checks (maintainer
  bypass preserved), repo description/topics, delete-branch-on-merge.
  GitHub Pages (serving `schema.ribosome.medullaflow.org`) deliberately left
  untouched — a legitimate, intentional use here, unlike the accidental
  deployment disabled on `ribosome`.

### Changed
- The DCO workflow's job renamed `check` → `check-dco`, for an unambiguous
  required-status-check name.

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

# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/)

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

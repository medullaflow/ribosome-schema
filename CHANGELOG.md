# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/)

## [Unreleased]

### Added
- Extracted from [ribosome](https://github.com/medullaflow/ribosome) into a
  standalone, Apache-2.0-licensed repo: the normative manifest/lockfile JSON
  Schemas (`schema/v1/`), the vendored & pinned MCP `server.json` schema
  (`vendor/`), the conformance corpus (`conformance/`), and the TypeScript
  binding (`bindings/typescript/`, published as `@medullaflow/ribosome-schema`).
- Vendor drift detection (`npm run vendor:check`) and deliberate update flow
  (`npm run vendor:update`).

### Contributors
- **Matteo Lacchio** — extraction and initial scaffolding

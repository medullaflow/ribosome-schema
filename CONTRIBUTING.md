# Contributing to ribosome-schema

This repo holds **the ribosome standard** — the manifest/lockfile JSON Schemas,
the conformance corpus, and the TypeScript binding. The reference resolver that
consumes it lives in [ribosome](https://github.com/medullaflow/ribosome).

Read [README.md](README.md) first, especially **Versioning** — schema changes
follow a specific, deliberate process.

## What goes where

- **A change to the format itself** (a field, a constraint) → edit
  `schema/v1/*.schema.json`, then `npm run spec:types` and add conformance
  fixtures under `conformance/valid|invalid/`. If it's a breaking change, follow
  the version-bump procedure in the README (a new `schema/v2/`, never editing
  `v1/`).
- **A change to the TypeScript binding** (validation, ergonomics) →
  `bindings/typescript/src/`. Do not hand-edit generated files (`types.ts`).
- **Documentation, tooling** → as appropriate; keep `npm test` green.

## License

Contributions are licensed under **Apache-2.0** (the vendored MCP schema keeps
its upstream MIT license — see [NOTICE](NOTICE)). New source files need an SPDX
header; JSON/config files are covered by [`REUSE.toml`](REUSE.toml). By
contributing you agree your contribution is licensed under Apache-2.0; you
retain copyright of your own work.

## Adding yourself to AUTHORS

Submit a PR adding yourself to [`AUTHORS`](AUTHORS):

    Your Name (<https://github.com/yourusername>) (2026-present)
    - Brief contribution description

## Sign off your commits (DCO)

Every commit must carry a `Signed-off-by` trailer matching your git
`user.email` — the [Developer Certificate of Origin](https://developercertificate.org/),
your assertion that you have the right to submit the contribution. No CLA,
nothing to sign externally — just:

    git commit -s

Enforced in CI ([`.github/workflows/dco.yml`](.github/workflows/dco.yml)) on
every PR. Fix an existing commit with `git commit --amend -s`, then force-push
the PR branch.

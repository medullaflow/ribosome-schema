# Roadmap

Live status — milestones, issues, and their descriptions — is tracked
entirely on GitHub, not in this file:

**[github.com/medullaflow/ribosome-schema/milestones](https://github.com/medullaflow/ribosome-schema/milestones)**

This file deliberately does **not** duplicate that content. A milestone
list mirrored by hand in git drifts from the live one the moment either
side changes — that drift, and the manual reconciliation it costs, is
exactly what this pointer avoids. What *does* belong in git is durable
material that doesn't change per sprint: the schemas themselves, the
conformance corpus, `CONTRIBUTING.md`. Read the GitHub milestones for
*what's currently open, done, or next*.

For a human or an agent landing in this repo with no GitHub access: the
milestones as of this writing are **Core Schema & Publishing** (closed —
the v1 schemas, vendored MCP schema, live hosting, npm package, and
centralized versioning that already ship), **Normative Specification**
(a `SPEC.md` pinning down versioning rules and the semantics of
`permissions`/`extends`), **Ecosystem Integration** (SchemaStore
submission), **Conformance Suite Evolution** (a language-agnostic,
rule-precise conformance corpus), **Language Bindings** (siblings to
`bindings/typescript`, added as real demand appears), and **Guardrails &
Governance** (closed — linting, REUSE compliance, and repo governance,
mirroring the sibling [ribosome](https://github.com/medullaflow/ribosome)
repo) — but treat that list as a snapshot, not a source of truth; the
link above always wins.

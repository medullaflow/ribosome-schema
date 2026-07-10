# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities privately — do not open a public
GitHub issue.

- Preferred: GitHub's private vulnerability reporting (this repo's
  Security tab → "Report a vulnerability").
- Alternative: email ookmash@protonmail.com.

We'll acknowledge reports and keep you updated as we investigate and
fix the issue. Please give us reasonable time to address it before any
public disclosure.

## Supported Versions

`@medullaflow/ribosome-schema` and the schemas served from
`schema.ribosome.medullaflow.org` are pre-1.0 — the current `0.1.x` line
is the only one supported. Only the latest published version receives
fixes; there is no backport policy yet.

## Scope

This repo is normative schemas, generated types, a thin validation
binding, and a conformance corpus — not a network service. Security
issues here are most likely to be validation bypasses (input that
should fail schema validation but doesn't) or a vendored/pinned external
schema (`vendor/`) drifting from its upstream source in a way that
weakens validation. Report either the same way as above.

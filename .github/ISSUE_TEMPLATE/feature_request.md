---
name: Feature / schema change request
about: Propose a change to the ribosome.json/ribosome.lock.json standard
title: "<short description of the proposal>"
labels: enhancement
---

## Problem

What's missing or awkward in the current manifest/lockfile format, and why
it matters.

## Proposed approach

What you'd like to see. Note whether this is additive (new optional field,
backward-compatible) or a breaking change to the schema — see
[Versioning](../../README.md#versioning) for what that implies for
`schemaVersion`.

## Alternatives considered

Other approaches you thought about and why this one seems better.

## Notes

Is this a change to **the standard itself** (this repo — the schemas,
generated types, conformance corpus), or to **how a resolver implements
it** (the reference resolver/orchestrator lives in the separate
[ribosome](https://github.com/medullaflow/ribosome) repo)? Behavior that
doesn't change the manifest/lockfile shape usually belongs there instead.

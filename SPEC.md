# ribosome-schema specification

This is the normative companion to `schema/v1/*.schema.json`. JSON Schema
constrains *shape* (types, required fields, formats); it can't express
compatibility rules or the meaning of fields the schema deliberately leaves
opaque. This document is where that lives. If this document and a
`schema/v1/*.schema.json` file ever disagree on shape, the schema file wins —
this document is prose about the schema, not a second source of shape truth.

## 1. Versioning & compatibility

See [README.md § Versioning](README.md#versioning) for the mechanics — which
version number lives where, and the step-by-step procedure for cutting
`schema/v2/`. This section is the normative answer to a narrower question:
**given a proposed change to `schema/v1/*.schema.json`, is it breaking?**

A change is **breaking** — and therefore requires a new `schema/vN/`
directory, never an edit to `schema/v1/` — if it would make **any
previously-valid document invalid**. Concretely:

| Change | Breaking? |
|---|---|
| Remove a property, or rename one (add+remove is still a rename) | **Yes** |
| Change a property's `type` | **Yes** |
| Make an optional property `required` | **Yes** |
| Narrow a `pattern`, `enum`, `const`, `minLength`/`maxLength`, `minimum`/`maximum`, or any other constraint | **Yes** — a document that satisfied the old, looser constraint may not satisfy the new, tighter one |
| Add a new required property | **Yes** — no existing document declares it |
| Change `additionalProperties` from `true`/unset to `false` on an object that previously allowed extra keys | **Yes** |
| Add a new optional property | No |
| Loosen a constraint (widen a `pattern`, raise a `maxLength`, add an `enum` value) | No — every document valid under the old, tighter rule stays valid |
| Change a `description`, `title`, `examples`, or any other non-validating annotation | No |
| Change a `default` value | No — defaults are applied by tooling that reads them, not enforced by the schema itself; no previously-valid document becomes invalid |
| Add a new optional sibling to an existing `oneOf`/`anyOf` branch (e.g. a fourth `McpServer` source kind) | No, **provided** existing branches are otherwise unchanged and remain mutually exclusive |

If a proposed change isn't covered by the table above, default to treating it
as breaking and open an issue to add it here — the table is the record of
every case this project has actually had to decide, not a closed set claimed
to cover every future case.

**Two schemas move together.** `manifest.schema.json` and
`lockfile.schema.json` are one family: a `schemaVersion` bump always touches
both, even if only one file's shape actually changed, because the lockfile is
defined as "the resolved output of a manifest" — they're versioned as a pair
so a consumer never has to ask "which lockfile shape goes with which manifest
shape" as a separate question. `scripts/gen-types.js` already refuses to run
if the two files' `schemaVersion` consts diverge.

**The npm package's own semver is independent.** A patch/minor npm release
(bug fix, docs, non-breaking additive field, a new binding) never requires a
`schemaVersion` bump. A `schemaVersion` bump always requires at least a major
npm version bump, since consumers pinned to the old `schemaVersion` need a
signal that the new major introduces schema-breaking behavior even though
they can still validate old documents (`schema/v1/` never goes away).

## 2. `permissions` semantics

`permissions` (on `RegistryServer`, `InlineServer`, and `ProcessServer`) is an
array of strings. **ribosome-schema defines the shape and the contract, not a
vocabulary.** Concretely:

- Each string is an **opaque permission scope**, passed through unmodified
  from the manifest to whatever orchestrator materializes the server. This
  repo does not parse, validate, canonicalize, or attach meaning to any
  scope's contents.
- **No fixed vocabulary exists or is planned at this layer.** A value like
  `"read:workspace"` (see `conformance/valid/full.json`) is a convention some
  orchestrator has chosen, not a value this schema recognizes, enumerates, or
  constrains beyond "non-empty string."
- **Ordering and duplicates are not meaningful.** Two manifests with the same
  set of scope strings in a different order, or with a duplicate scope
  string, are equivalent — this repo does not define `permissions` as an
  ordered list or a set with dedup semantics; a consumer is free to treat it
  as either, since nothing here distinguishes the two.
- **An absent `permissions` field and an empty array (`[]`) are equivalent**:
  both mean "this server declares no permission scopes." A consumer must not
  treat the two differently.
- Interpreting a scope string — what `"read:workspace"` actually grants or
  restricts, whether unrecognized scopes are an error or ignored, whether
  scopes compose or conflict — is entirely the consuming orchestrator's
  contract with itself, not something a second, independent implementation of
  this spec could derive from this document. If that ever needs to be
  standardized, it's a new, separate concern layered on top of this schema,
  not a change to it.

This is a deliberate scope boundary, not an oversight: `permissions` exists
in the shape so a manifest has *somewhere* to declare scopes without every
orchestrator inventing its own field name, while leaving what the scopes mean
entirely outside this repo's authority — the same "conform on shape, leave
semantics to the consumer" posture the schema takes toward runtime version
strings.

## 3. `extends` semantics

`extends` (top-level, `manifest.schema.json`) is an array of **paths to
pre-existing MCP client config files** — `.mcp.json`, `.vscode/mcp.json`, or
any file sharing that same, foreign (non-ribosome) shape: a top-level
`mcpServers` object mapping a local server id to `{ command, args?, env? }`.
It exists so a project already using one of those tools can adopt ribosome
without hand-copying every server entry.

### 3.1 What importing means

Each path in `extends` is read and its `mcpServers` map is imported as if
every entry had been hand-written into *this* manifest's own `mcpServers`
map with `"source": "process"` — i.e. each imported entry becomes exactly a
[`ProcessServer`](schema/v1/manifest.schema.json), field-for-field
(`command` → `command`, `args` → `args`, `env` → `env`). This is not a
coincidental resemblance: `ProcessServer` exists specifically as this
compatibility bridge (see its own schema `description`), and `extends` is
what actually invokes that bridge automatically instead of requiring
copy-paste.

**Only `mcpServers` is imported.** The foreign file formats this targets
(`.mcp.json` and siblings) have no concept of `runtimes`, `registries`, or
any other top-level ribosome manifest key, so there is nothing else in them
for `extends` to import. `extends` never affects any key but `mcpServers`.

**No recursion.** The imported files are foreign-shaped and have no
`extends` field of their own to follow — `extends` is a single-level import,
not a transitive closure over a chain of files.

### 3.2 Path resolution

Each path in `extends` is resolved **relative to the manifest file's own
directory**, not the resolver's current working directory — consistent with
how `pool.dir` is resolved. A path may also be absolute.

### 3.3 Conflict resolution

Precedence, highest to lowest:

1. **This manifest's own `mcpServers` map.** An id declared directly always
   wins over anything imported via `extends` — an explicit local declaration
   is never silently shadowed by an import.
2. **Later entries in the `extends` array**, for ids that collide between
   two or more imported files. Given `"extends": ["./a.mcp.json",
   "./b.mcp.json"]`, an id present in both files resolves to `b.mcp.json`'s
   entry — the same "later wins" rule a reader would expect skimming the
   array top to bottom.
3. **Earlier entries**, for any id that appears in exactly one imported
   file.

This is "last, most-local declaration wins" applied consistently at every
level — no partial-merge of fields within a single colliding server entry
(e.g. taking `command` from one source and `env` from another): the whole
entry from the higher-precedence source replaces the whole entry from the
lower-precedence one.

### 3.4 Validation responsibility

`ribosome-schema` validates the **shape of the `extends` array itself**
(a list of non-empty strings) — it does not, and structurally cannot, vendor
a schema for arbitrary `.mcp.json`-shaped files, since that format isn't
this project's to define. Whether a given path exists, is readable, and
contains a well-formed `mcpServers` map is a **resolver-time concern** for
whatever consumes this spec (the sibling [ribosome](https://github.com/medullaflow/ribosome)
resolver, or any other implementation) — the same division this repo already
draws elsewhere between "the standard defines the contract" and
"implementations do the resolving" (see [README.md § Versioning](README.md#versioning)).

A resolver encountering a missing or malformed extended file should fail
loudly at resolve time, the same posture ribosome's own resolver takes toward
a missing or invalid top-level manifest — silently skipping an unreadable
`extends` entry would make a project's actual server set depend on
filesystem state the manifest author can't see reflected in the manifest
itself.

## Changes to this document

This document has no version number of its own — it evolves alongside the
schema it describes, and its own changes (not schema shape changes) are
logged in [CHANGELOG.md](CHANGELOG.md) like any other repo change. A change
to section 1's compatibility table is itself never breaking (it doesn't
change any schema file), but should be treated with the same care as a
schema change: it's retroactively telling implementers what was always true,
so getting it wrong after the fact is costly even without a version bump to
signal it.

# @medullaflow/ribosome-schema

TypeScript types, validation, and version pins for the **ribosome** standard —
the manifest & lockfile format for [ribosome](https://github.com/medullaflow/ribosome),
the MCP package manager. Covers the `ribosome.json` project manifest and the
`ribosome.lock.json` output.

The normative artifact is the JSON Schema itself, hosted at:

```
https://schema.ribosome.medullaflow.org/v1/manifest.schema.json
https://schema.ribosome.medullaflow.org/v1/lockfile.schema.json
```

This package is a convenience layer on top, for TypeScript/JavaScript
consumers: generated types, an offline `ajv`-based validator (including the
vendored MCP `server.json` sub-schema), and version pins.

## Install

```bash
npm install @medullaflow/ribosome-schema
```

## Usage

```typescript
import { validateManifest, checkManifest, type RibosomeManifest } from "@medullaflow/ribosome-schema";

const manifest = validateManifest(JSON.parse(raw)); // throws SchemaValidationError, listing every failure

const { valid, errors } = checkManifest(data); // non-throwing variant
```

## Source

[github.com/medullaflow/ribosome-schema](https://github.com/medullaflow/ribosome-schema) —
full docs, the conformance corpus, and the schema sources live there. This
package is built from `schema/v1/` and `bindings/typescript/src/` in that repo.

## License

Apache-2.0. You may implement the ribosome standard in any product, open or
closed, without obligation. See
[LICENSE](https://github.com/medullaflow/ribosome-schema/blob/main/LICENSE).

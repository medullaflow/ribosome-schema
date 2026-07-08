// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// @medullaflow/ribosome-schema — the TypeScript binding for the ribosome
// standard: generated types, validation, and version pins. The normative
// artifact is the JSON Schema itself (../../schema/v1/); this package is a
// convenience layer on top, not the source of truth. Other-language bindings
// (e.g. Python) can be added as siblings under bindings/ without touching
// this package or the schemas.

export * from "./types";
export * from "./mcp-server-types";
export * from "./version";
export { validateManifest, validateLockfile, checkManifest, SchemaValidationError } from "./validate";

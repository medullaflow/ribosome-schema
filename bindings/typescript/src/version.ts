// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Pinned versions this package embeds. These constants are the single place
// that records "what a ribosome-schema vX release means": the manifest format,
// the lockfile format, and the exact external MCP server.json contract.

/** Version of the ribosome project manifest format (see schema/v1/manifest.schema.json). */
export const MANIFEST_SCHEMA_VERSION = "1" as const;

/** Version of the ribosome lockfile format (see schema/v1/lockfile.schema.json). */
export const LOCKFILE_SCHEMA_VERSION = "1" as const;

/**
 * Pinned MCP `server.json` schema version. Vendored under vendor/ and
 * referenced (not fetched) so validation is reproducible and offline.
 * Upgrading this is a deliberate, released change — see scripts/vendor-update.js.
 */
export const MCP_SERVER_SCHEMA_VERSION = "2025-12-11" as const;

/** Canonical `$id` of the vendored server.json schema (used to wire local $ref resolution). */
export const MCP_SERVER_SCHEMA_ID =
  `https://static.modelcontextprotocol.io/schemas/${MCP_SERVER_SCHEMA_VERSION}/server.schema.json` as const;

/**
 * SHA-256 of the vendored server.json schema file. This is the machine-checkable
 * provenance: `npm run vendor:check` verifies the local vendored file and the
 * upstream URL both still hash to this. Updating the pin is a deliberate change
 * (see scripts/vendor-update.js and vendor/README.md).
 */
export const MCP_SERVER_SCHEMA_SHA256 =
  "3fba09590c99f61735d234822279f4223fab9e300c0a81e81c91ab62a4114de0" as const;

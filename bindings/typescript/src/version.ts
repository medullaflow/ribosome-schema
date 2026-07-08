// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Hand-authored pins for EXTERNAL dependencies this package vendors. This is
// NOT where the ribosome schema's own version lives — that's `SCHEMA_VERSION`,
// generated into types.ts directly from schema/v1/*.schema.json's
// `schemaVersion` const (see scripts/gen-types.js), so it can never drift from
// the schema files themselves. This file only records facts we don't author
// (what upstream MCP version we've chosen to vendor).

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

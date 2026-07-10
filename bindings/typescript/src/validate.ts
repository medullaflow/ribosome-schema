// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// The ONLY module allowed to know a JSON Schema validator (ajv) exists. It
// validates untyped input against the normative schemas and narrows it to the
// generated types. Keeping ajv confined here means consumers who don't need
// runtime validation (e.g. just the TS types) never pay for it either.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv, { type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import type { McpServerJson } from "./mcp-server-types";
import type { RibosomeLockfile, RibosomeManifest } from "./types";
import { MCP_SERVER_SCHEMA_VERSION } from "./version";

// biome-ignore lint/suspicious/noExplicitAny: raw parsed JSON, genuinely untyped until ajv validates/narrows it
function loadSchema(relativePath: string): any {
  return JSON.parse(readFileSync(join(__dirname, relativePath), "utf8"));
}

// Schemas are copied into dist/ at build time (see scripts/copy-schemas.js).
// The vendored server.json filename is derived from the pinned version, so
// version.ts is the single source of truth for which schema is in force.
const serverSchema = loadSchema(`vendor/server.schema.${MCP_SERVER_SCHEMA_VERSION}.json`);
const manifestSchema = loadSchema("schema/v1/manifest.schema.json");
const lockfileSchema = loadSchema("schema/v1/lockfile.schema.json");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
// Register the vendored server.json schema so the manifest's $ref to its $id
// resolves locally (offline), not over the network.
ajv.addSchema(serverSchema);

const validateManifestFn = ajv.compile<RibosomeManifest>(manifestSchema);
const validateLockfileFn = ajv.compile<RibosomeLockfile>(lockfileSchema);

function getRegisteredServerSchemaValidator(): ValidateFunction<McpServerJson> {
  // Already registered above via addSchema (for the manifest's $ref to resolve
  // locally) -- getSchema() retrieves that same compiled validator rather than
  // compiling the identical $id a second time, which ajv rejects as a duplicate.
  const fn = ajv.getSchema<McpServerJson>(serverSchema.$id as string);
  if (!fn) {
    throw new Error(`ajv failed to register the vendored server.json schema (${serverSchema.$id})`);
  }
  return fn;
}
const validateServerJsonFn = getRegisteredServerSchemaValidator();

const SCHEMA_LABELS = {
  manifest: "ribosome manifest",
  lockfile: "ribosome lockfile",
  "mcp-server-json": "MCP server.json",
} as const;

/** Thrown when input does not conform to a ribosome schema. Lists every error. */
export class SchemaValidationError extends Error {
  constructor(
    readonly what: keyof typeof SCHEMA_LABELS,
    readonly errors: string[],
  ) {
    super(`Invalid ${SCHEMA_LABELS[what]}:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
    this.name = "SchemaValidationError";
  }
}

function formatErrors(fn: ValidateFunction): string[] {
  return (fn.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? "is invalid"}`);
}

/** Validate and narrow untyped input to a RibosomeManifest, or throw. */
export function validateManifest(data: unknown): RibosomeManifest {
  if (!validateManifestFn(data)) {
    throw new SchemaValidationError("manifest", formatErrors(validateManifestFn));
  }
  return data;
}

/** Validate and narrow untyped input to a RibosomeLockfile, or throw. */
export function validateLockfile(data: unknown): RibosomeLockfile {
  if (!validateLockfileFn(data)) {
    throw new SchemaValidationError("lockfile", formatErrors(validateLockfileFn));
  }
  return data;
}

/** Non-throwing manifest check, for tooling that wants a boolean + errors. */
export function checkManifest(data: unknown): { valid: boolean; errors: string[] } {
  const valid = validateManifestFn(data) as boolean;
  return { valid, errors: valid ? [] : formatErrors(validateManifestFn) };
}

/**
 * Validate and narrow untyped input to a McpServerJson, or throw. For
 * consumers resolving a server descriptor from an untrusted source (e.g. a
 * live registry HTTP response) -- the TypeScript type alone only helps once
 * the data is already trusted; this is the runtime check at that boundary.
 */
export function validateMcpServerJson(data: unknown): McpServerJson {
  if (!validateServerJsonFn(data)) {
    throw new SchemaValidationError("mcp-server-json", formatErrors(validateServerJsonFn));
  }
  return data;
}

/** Non-throwing McpServerJson check, for tooling that wants a boolean + errors. */
export function checkMcpServerJson(data: unknown): { valid: boolean; errors: string[] } {
  const valid = validateServerJsonFn(data) as boolean;
  return { valid, errors: valid ? [] : formatErrors(validateServerJsonFn) };
}

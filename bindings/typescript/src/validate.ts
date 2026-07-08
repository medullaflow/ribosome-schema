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
import type { RibosomeLockfile, RibosomeManifest } from "./types";
import { MCP_SERVER_SCHEMA_VERSION } from "./version";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/** Thrown when input does not conform to a ribosome schema. Lists every error. */
export class SchemaValidationError extends Error {
  constructor(
    readonly what: "manifest" | "lockfile",
    readonly errors: string[],
  ) {
    super(`Invalid ribosome ${what}:\n` + errors.map((e) => `  - ${e}`).join("\n"));
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

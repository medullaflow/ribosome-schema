// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Enforces the centralized versioning invariant (see README.md "Versioning"):
// manifest and lockfile are one schema family, one version number, declared
// exactly once per file (as each schema's own `schemaVersion` const) and
// consistent everywhere else it's implied — the $id path segment, the
// directory the file physically lives in, and the generated TS export. This
// runs on every `bun run test` (not just a scheduled job) so a version-consistency
// break fails CI on the PR that introduced it, not later.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");

function loadSchema(dir, file) {
  return JSON.parse(readFileSync(join(root, "schema", dir, file), "utf8"));
}

// Mirrors CURRENT_SCHEMA_DIR in scripts/gen-types.js — the one hand-typed
// pointer to "which version directory is current". Everything downstream of
// this single line is verified, not assumed.
const CURRENT_SCHEMA_DIR = "v1";

test("manifest and lockfile declare the same schemaVersion", () => {
  const manifest = loadSchema(CURRENT_SCHEMA_DIR, "manifest.schema.json");
  const lockfile = loadSchema(CURRENT_SCHEMA_DIR, "lockfile.schema.json");
  const manifestVersion = manifest.properties?.schemaVersion?.const;
  const lockfileVersion = lockfile.properties?.schemaVersion?.const;

  assert.ok(manifestVersion, "manifest.schema.json must declare schemaVersion.const");
  assert.equal(
    manifestVersion,
    lockfileVersion,
    "manifest and lockfile schemaVersion must match — they version together as one family",
  );
});

test("$id path segment matches the directory the schema physically lives in", () => {
  for (const file of ["manifest.schema.json", "lockfile.schema.json"]) {
    const schema = loadSchema(CURRENT_SCHEMA_DIR, file);
    assert.ok(
      schema.$id.includes(`/${CURRENT_SCHEMA_DIR}/`),
      `${file}: $id (${schema.$id}) must contain "/${CURRENT_SCHEMA_DIR}/"`,
    );
  }
});

test("CURRENT_SCHEMA_DIR points at a directory that actually exists", () => {
  assert.ok(
    existsSync(join(root, "schema", CURRENT_SCHEMA_DIR, "manifest.schema.json")),
    `schema/${CURRENT_SCHEMA_DIR}/manifest.schema.json must exist — did a version bump move the ` +
      "files without updating CURRENT_SCHEMA_DIR in this test and in scripts/gen-types.js?",
  );
});

test("generated SCHEMA_VERSION export matches the schema's own const", () => {
  const manifest = loadSchema(CURRENT_SCHEMA_DIR, "manifest.schema.json");
  const { SCHEMA_VERSION } = require("../bindings/typescript/dist/index.js");
  assert.equal(
    SCHEMA_VERSION,
    manifest.properties.schemaVersion.const,
    "generated types.ts SCHEMA_VERSION is stale — run `bun run spec:types` and rebuild",
  );
});

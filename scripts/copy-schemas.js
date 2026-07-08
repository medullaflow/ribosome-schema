// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Copies the normative JSON Schemas + vendored server.json (which tsc does not
// emit) into bindings/typescript/dist/, so the published npm package can load
// them at runtime, and validate.js can read them relative to itself. Runs
// automatically after `npm run build` (postbuild).

const { cpSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const outDir = join(root, "bindings", "typescript", "dist");

mkdirSync(join(outDir, "schema", "v1"), { recursive: true });
cpSync(join(root, "schema", "v1"), join(outDir, "schema", "v1"), { recursive: true });
cpSync(join(root, "vendor"), join(outDir, "vendor"), { recursive: true });

console.log("copied schema/ + vendor/ -> bindings/typescript/dist/");

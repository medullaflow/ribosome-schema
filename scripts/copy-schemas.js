// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Copies build-time artifacts derived from repo-root sources of truth into
// bindings/typescript/, so the published npm package is self-contained. Runs
// automatically after `bun run build` (postbuild). Nothing this script writes
// is git-tracked (see .gitignore) — it is always regenerated from the one
// real source, never hand-duplicated.
//
//   schema/, vendor/  -> bindings/typescript/dist/  (loaded at runtime by validate.js)
//   LICENSE           -> bindings/typescript/LICENSE (npm auto-includes this
//                        in the published tarball if it exists at pack time;
//                        the repo-root LICENSE is the only copy anyone edits)

const { cpSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const bindingDir = join(root, "bindings", "typescript");
const outDir = join(bindingDir, "dist");

mkdirSync(join(outDir, "schema", "v1"), { recursive: true });
cpSync(join(root, "schema", "v1"), join(outDir, "schema", "v1"), { recursive: true });
cpSync(join(root, "vendor"), join(outDir, "vendor"), { recursive: true });
cpSync(join(root, "LICENSE"), join(bindingDir, "LICENSE"));

console.log(
  "copied schema/ + vendor/ -> bindings/typescript/dist/, LICENSE -> bindings/typescript/LICENSE",
);

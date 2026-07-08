// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Bumps the pinned MCP server.json schema to a new version. Deliberate, and
// always landed as a reviewed PR — a schema change can change the meaning of the
// ribosome standard.
//
//   node scripts/vendor-update.js <YYYY-MM-DD>
//
// It downloads and vendors the new schema, updates the pin in version.ts, and
// regenerates types. It then prints the human follow-ups it will NOT do for you.

const { writeFileSync, readFileSync, rmSync } = require("node:fs");
const { createHash } = require("node:crypto");
const { join } = require("node:path");
const { execFileSync } = require("node:child_process");

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
  console.error("usage: node scripts/vendor-update.js <YYYY-MM-DD>");
  process.exit(2);
}

const root = join(__dirname, "..");
const versionFile = join(root, "bindings", "typescript", "src", "version.ts");
const url = `https://static.modelcontextprotocol.io/schemas/${date}/server.schema.json`;
const outFile = join(root, "vendor", `server.schema.${date}.json`);

(async () => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");

  let version = readFileSync(versionFile, "utf8");
  const oldVersion = /MCP_SERVER_SCHEMA_VERSION\s*=\s*"([^"]+)"/.exec(version)?.[1];

  writeFileSync(outFile, bytes);
  version = version
    .replace(/(MCP_SERVER_SCHEMA_VERSION\s*=\s*)"[^"]+"/, `$1"${date}"`)
    .replace(/(MCP_SERVER_SCHEMA_SHA256\s*=\s*\n?\s*)"[a-f0-9]{64}"/, `$1"${sha256}"`);
  writeFileSync(versionFile, version);

  if (oldVersion && oldVersion !== date) {
    rmSync(join(root, "vendor", `server.schema.${oldVersion}.json`), { force: true });
  }

  execFileSync("node", [join(__dirname, "gen-types.js")], { stdio: "inherit" });

  console.log(`\n✓ vendored server.json ${date} (sha256 ${sha256.slice(0, 12)}…), pin + types updated.`);
  console.log("\nNow, by hand, in this PR:");
  console.log("  1. Update the table in vendor/README.md (version + SHA-256).");
  console.log("  2. Add/adjust conformance fixtures for any new/changed fields.");
  console.log("  3. `npm test` must pass.");
  console.log("  4. Bump this package's version and add a CHANGELOG entry.");
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Verifies the pinned MCP server.json schema, two ways:
//   1. Integrity  — the vendored file still hashes to the pin in version.ts.
//   2. Immutability — the upstream pinned URL still serves those exact bytes.
// Exits non-zero on any mismatch. Run in CI (scheduled) so drift or tampering
// surfaces as a failed job / opened issue. Updating the pin is deliberate — see
// scripts/vendor-update.js. Never edits anything.

const { readFileSync } = require("node:fs");
const { createHash } = require("node:crypto");
const { join } = require("node:path");

const root = join(__dirname, "..");
const versionFile = join(root, "bindings", "typescript", "src", "version.ts");

function readPin() {
  const src = readFileSync(versionFile, "utf8");
  const version = /MCP_SERVER_SCHEMA_VERSION\s*=\s*"([^"]+)"/.exec(src)?.[1];
  const sha256 = /MCP_SERVER_SCHEMA_SHA256\s*=\s*\n?\s*"([a-f0-9]{64})"/.exec(src)?.[1];
  if (!version || !sha256) throw new Error("could not parse pin from version.ts");
  return {
    version,
    sha256,
    url: `https://static.modelcontextprotocol.io/schemas/${version}/server.schema.json`,
    file: join(root, "vendor", `server.schema.${version}.json`),
  };
}

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

(async () => {
  const pin = readPin();
  const problems = [];

  const localHash = sha(readFileSync(pin.file));
  if (localHash !== pin.sha256) {
    problems.push(`integrity: vendored ${pin.file} hashes to ${localHash}, pin is ${pin.sha256}`);
  }

  try {
    const res = await fetch(pin.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const upstreamHash = sha(Buffer.from(await res.arrayBuffer()));
    if (upstreamHash !== pin.sha256) {
      problems.push(
        `immutability: upstream ${pin.url} now hashes to ${upstreamHash}, pin is ${pin.sha256} ` +
          `(upstream changed a "frozen" version — investigate)`,
      );
    }
  } catch (err) {
    problems.push(`could not fetch upstream ${pin.url}: ${err.message}`);
  }

  if (problems.length) {
    console.error(`✗ vendor drift check FAILED for server.json ${pin.version}:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(
    `✓ server.json ${pin.version} verified (local + upstream match pin ${pin.sha256.slice(0, 12)}…)`,
  );
})();

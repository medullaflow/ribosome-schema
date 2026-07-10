// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Runtime validation for a standalone McpServerJson document -- distinct from
// the manifest/lockfile validators. Consumers resolving a server descriptor
// from an untrusted source (e.g. a live registry HTTP response, see the
// sibling ribosome repo's registry adapter) need to validate it against the
// vendored schema at that trust boundary, not just rely on the compile-time
// TypeScript type.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  checkMcpServerJson,
  validateMcpServerJson,
} = require("../bindings/typescript/dist/index.js");

// A real, schema-conformant inline server descriptor (mirrors
// conformance/valid/full.json's inline server entry).
const validServer = {
  name: "com.example/my-tool",
  description: "A custom local MCP server",
  version: "0.1.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/my-tool",
      version: "0.1.0",
      runtimeHint: "npx",
      transport: { type: "stdio" },
    },
  ],
};

test("validateMcpServerJson accepts a real, conformant server.json", () => {
  assert.deepEqual(validateMcpServerJson(validServer), validServer);
});

test("checkMcpServerJson: valid", () => {
  const { valid, errors } = checkMcpServerJson(validServer);
  assert.equal(valid, true, `expected valid, got errors:\n${errors.join("\n")}`);
});

test("checkMcpServerJson: rejects a descriptor missing required fields", () => {
  const { valid } = checkMcpServerJson({ name: "com.example/my-tool" });
  assert.equal(valid, false, "expected the descriptor to be rejected");
});

test("validateMcpServerJson throws SchemaValidationError on invalid input", () => {
  assert.throws(() => validateMcpServerJson({ name: "com.example/my-tool" }), {
    name: "SchemaValidationError",
  });
});

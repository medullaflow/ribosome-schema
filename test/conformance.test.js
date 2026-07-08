// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Conformance suite: every fixture under conformance/valid must pass the
// manifest schema, every fixture under conformance/invalid must fail. These
// fixtures ARE the executable specification — add one whenever the schema
// gains a rule. They are plain JSON with no test-framework coupling, so any
// other-language binding can run the same corpus against its own validator.
//
// This suite runs them against the TypeScript binding, as a concrete proof the
// corpus and the schema agree. Runs against the built output (dist/), so
// `npm test` builds first.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const { checkManifest } = require("../bindings/typescript/dist/index.js");

const conformanceDir = join(__dirname, "..", "conformance");

function load(kind) {
  const dir = join(conformanceDir, kind);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ name: f, data: JSON.parse(readFileSync(join(dir, f), "utf8")) }));
}

for (const { name, data } of load("valid")) {
  test(`valid: ${name}`, () => {
    const { valid, errors } = checkManifest(data);
    assert.equal(valid, true, `expected valid, got errors:\n${errors.join("\n")}`);
  });
}

for (const { name, data } of load("invalid")) {
  test(`invalid: ${name}`, () => {
    const { valid } = checkManifest(data);
    assert.equal(valid, false, "expected the manifest to be rejected");
  });
}

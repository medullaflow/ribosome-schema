// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// Conformance suite: every fixture under conformance/valid must pass the
// manifest schema, every fixture under conformance/invalid must fail --
// AND fail for the specific reason it names (`expectedErrorPointer`), not
// just any reason. A schema (or an independent implementation) that rejects
// invalid input for the wrong reason still passed the old boolean-only
// check; this catches that (#14).
//
// Each fixture is data, not a TS test case: `{ description, input, valid,
// expectedErrorPointer? }`. Any other-language binding can load the same
// JSON files and run its own thin harness against them (#13) -- only this
// file's *consumption* of them is TypeScript-specific.
//
// This suite runs them against the TypeScript binding, as a concrete proof the
// corpus and the schema agree. Runs against the built output (dist/), so
// `bun run test` builds first.

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
    .map((f) => ({ name: f, fixture: JSON.parse(readFileSync(join(dir, f), "utf8")) }));
}

for (const { name, fixture } of load("valid")) {
  test(`valid: ${name} -- ${fixture.description}`, () => {
    assert.equal(
      fixture.valid,
      true,
      `${name}: a conformance/valid/ fixture must declare "valid": true`,
    );
    const { valid, errors } = checkManifest(fixture.input);
    assert.equal(valid, true, `expected valid, got errors:\n${errors.join("\n")}`);
  });
}

for (const { name, fixture } of load("invalid")) {
  test(`invalid: ${name} -- ${fixture.description}`, () => {
    assert.equal(
      fixture.valid,
      false,
      `${name}: a conformance/invalid/ fixture must declare "valid": false`,
    );
    assert.ok(
      fixture.expectedErrorPointer,
      `${name}: an invalid fixture must name the specific rule it expects to violate via "expectedErrorPointer"`,
    );
    const { valid, errors } = checkManifest(fixture.input);
    assert.equal(valid, false, "expected the manifest to be rejected");
    const matchesExpectedPointer = errors.some(
      (e) => e === fixture.expectedErrorPointer || e.startsWith(`${fixture.expectedErrorPointer} `),
    );
    assert.ok(
      matchesExpectedPointer,
      `expected an error at "${fixture.expectedErrorPointer}", but got:\n${errors.join("\n")}\n` +
        "(rejected for the wrong reason -- the fixture's own point is moot if this doesn't hold)",
    );
  });
}

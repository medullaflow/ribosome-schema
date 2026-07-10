// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: © 2026 ribosome-schema contributors

// A thin, hand-maintained TypeScript view of the vendored MCP `server.json`
// schema (spec/vendor/). We deliberately do NOT generate this: the full schema
// is large, external, and ribosome only reads a handful of fields. The JSON
// Schema remains the source of truth for *validation* (see validate.ts); this
// file is just the ergonomic type surface for the fields we touch. Keep it in
// sync with the pinned server.schema when bumping MCP_SERVER_SCHEMA_VERSION.

export interface McpServerJson {
  name: string;
  description: string;
  version: string;
  title?: string;
  repository?: { url: string; source: string; subfolder?: string; id?: string };
  packages?: McpPackage[];
  remotes?: McpRemoteTransport[];
  [key: string]: unknown;
}

export interface McpPackage {
  /** "npm" | "pypi" | "oci" | "nuget" | "mcpb" | "cargo" | ... */
  registryType: string;
  identifier: string;
  version?: string;
  registryBaseUrl?: string;
  /** "npx" | "uvx" | "docker" | "dnx" | ... — hint used to derive the runtime. */
  runtimeHint?: string;
  transport: McpTransport;
  runtimeArguments?: McpArgument[];
  packageArguments?: McpArgument[];
  environmentVariables?: McpKeyValueInput[];
  fileSha256?: string;
}

export interface McpRemoteTransport {
  type: "streamable-http" | "sse";
  url: string;
  headers?: McpKeyValueInput[];
  variables?: Record<string, unknown>;
}

export type McpTransport =
  | { type: "stdio" }
  | { type: "streamable-http"; url: string; headers?: McpKeyValueInput[] }
  | { type: "sse"; url: string; headers?: McpKeyValueInput[] };

export interface McpArgument {
  type: "positional" | "named";
  name?: string;
  value?: string;
  valueHint?: string;
  [key: string]: unknown;
}

export interface McpKeyValueInput {
  name: string;
  value?: string;
  default?: string;
  isRequired?: boolean;
  isSecret?: boolean;
  [key: string]: unknown;
}

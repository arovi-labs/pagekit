#!/usr/bin/env node
/**
 * Pagekit MCP Server
 *
 * Exposes Pagekit's content API as MCP tools for AI agents.
 * Manages posts, tags, categories, authors, media, newsletters, and more.
 *
 * Usage:
 *   PAGEKIT_API_KEY=pk_xxx node dist/index.js          # stdio (default)
 *   PAGEKIT_API_KEY=pk_xxx node dist/index.js --http    # streamable HTTP
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { PagekitClient } from "./client.js";
import { registerAllTools } from "./tools/index.js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_KEY = process.env.PAGEKIT_API_KEY ?? "";
const API_BASE = process.env.PAGEKIT_API_URL ?? "http://localhost:4783/api/v1";

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "pagekit-mcp-server",
  version: "1.0.3",
});

const client = new PagekitClient(API_BASE, API_KEY);
registerAllTools(server, client);

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

async function main() {
  if (!API_KEY) {
    console.error("ERROR: PAGEKIT_API_KEY environment variable is required.");
    console.error("");
    console.error("Get your API key from your Pagekit project settings:");
    console.error("  Settings → API Keys → Create new key");
    console.error("");
    console.error("Then set it:");
    console.error("  export PAGEKIT_API_KEY='pk_live_...'");
    process.exit(1);
  }

  // Verify connectivity on startup
  try {
    await client.health();
  } catch {
    console.error(`WARNING: Could not reach Pagekit API at ${API_BASE}`);
    console.error("The server will start anyway — tools may fail until the API is reachable.");
  }

  const useHttp = process.argv.includes("--http");

  if (useHttp) {
    const { createHttpServer } = await import("./http.js");
    await createHttpServer(server, API_KEY);
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`Pagekit MCP server running (API: ${API_BASE})`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

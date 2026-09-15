/**
 * Streamable HTTP transport for the MCP server.
 * Enables remote access — useful for shared team configs.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export async function createHttpServer(server: McpServer, apiKey: string) {
  // Dynamic import for express — only needed with --http
  const express = (await import("express")).default;
  const app = express();
  app.use(express.json());

  app.post("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", async (req, res) => {
    res.json({ name: "pagekit-mcp-server", version: "1.0.0", status: "ok" });
  });

  const port = parseInt(process.env.PORT ?? "3100", 10);
  app.listen(port, "127.0.0.1", () => {
    console.error(`Pagekit MCP server running on http://127.0.0.1:${port}/mcp`);
  });
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err } from "../format.js";

export function registerProjectTools(server: McpServer, api: PagekitClient) {
  // ── Project Info ────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_project_info",
    {
      title: "Project Info",
      description: `Get information about the current project — name, slug, post counts, and API key status.
This is the "who am I" endpoint for your API key.

Example:
  pagekit_project_info()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.get<{
          project: { id: string; name: string; slug: string; createdAt: string };
          apiKeyId: string;
          posts: Record<string, number>;
        }>("/me");

        const totalPosts = Object.values(res.posts).reduce((a, b) => a + b, 0);
        const md = [
          `## Project: ${res.project.name}`,
          `- **ID:** \`${res.project.id}\``,
          `- **Slug:** \`${res.project.slug}\``,
          `- **Created:** ${res.project.createdAt}`,
          `- **API Key:** \`${res.apiKeyId}\``,
          "",
          "### Post counts",
          ...Object.entries(res.posts).map(([status, count]) => `- **${status}:** ${count}`),
          `- **Total:** ${totalPosts}`,
        ].join("\n");

        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  // ── Health Check ────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_health",
    {
      title: "Health Check",
      description: `Check if the Pagekit API is reachable and responding.

Example:
  pagekit_health()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.health();
        return ok(res, "✅ Pagekit API is healthy.");
      } catch (e) { return err(e); }
    },
  );
}

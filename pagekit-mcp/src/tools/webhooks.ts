import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

export function registerWebhookTools(server: McpServer, api: PagekitClient) {
  server.registerTool(
    "pagekit_list_webhooks",
    {
      title: "List Webhooks",
      description: `List all webhooks for this project.
Example: pagekit_list_webhooks()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.get<{ data: Array<{ id: string; url: string; events: string[]; active: boolean; failureCount: number }> }>("/webhooks");
        const md = listMarkdown(res.data, "Webhooks", (w) => {
          const web = w as { url: string; events: string[]; active: boolean; failureCount: number };
          return [
            `URL: ${web.url}`,
            `Events: ${web.events.join(", ") || "none"}`,
            `Active: ${web.active ? "yes" : "no"}`,
            `Failures: ${web.failureCount}`,
          ];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_create_webhook",
    {
      title: "Create Webhook",
      description: `Register a new webhook URL for project events.

Example:
  pagekit_create_webhook({ url: "https://example.com/webhook", events: ["post.published", "post.updated"] })`,
      inputSchema: {
        url: z.string().url().describe("Webhook endpoint URL"),
        events: z.array(z.string()).min(1).describe("Events to listen for (post.created, post.published, post.updated, post.deleted, post.unpublished)"),
        active: z.boolean().default(true).describe("Whether the webhook is active"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; url: string; events: string[]; active: boolean }>("/webhooks", p);
        return ok(data, `Created webhook \`${data.id}\` → ${data.url}`);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_delete_webhook",
    {
      title: "Delete Webhook",
      description: `Remove a webhook by ID.
Example: pagekit_delete_webhook({ id: "wh_123" })`,
      inputSchema: {
        id: z.string().describe("Webhook ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        await api.del(`/webhooks/${p.id}`);
        return ok({ deleted: true, id: p.id }, `Webhook \`${p.id}\` deleted.`);
      } catch (e) { return err(e); }
    },
  );
}

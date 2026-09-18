import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

export function registerSubscriberTools(server: McpServer, api: PagekitClient) {
  server.registerTool(
    "pagekit_list_subscribers",
    {
      title: "List Subscribers",
      description: `List newsletter subscribers for this project.
Example: pagekit_list_subscribers()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.get<{ data: Array<{ id: string; email: string; name?: string; status: string }> }>("/subscribers");
        const md = listMarkdown(res.data, "Subscribers", (s) => [
          s.email,
          s.status,
          ...(s.name ? [s.name] : []),
        ]);
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_create_subscriber",
    {
      title: "Add Subscriber",
      description: `Add a new subscriber to the newsletter.
Example: pagekit_create_subscriber({ email: "user@example.com", name: "Jane" })`,
      inputSchema: {
        email: z.string().email().describe("Subscriber email"),
        name: z.string().optional().describe("Subscriber name"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; email: string; status: string }>("/subscribers", p);
        return ok(data, `Subscribed ${data.email}`);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_delete_subscriber",
    {
      title: "Delete Subscriber",
      description: `Remove a subscriber by ID.
Example: pagekit_delete_subscriber({ id: "sub_123" })`,
      inputSchema: {
        id: z.string().describe("Subscriber ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        await api.del(`/subscribers/${p.id}`);
        return ok({ deleted: true, id: p.id }, `Subscriber \`${p.id}\` removed.`);
      } catch (e) { return err(e); }
    },
  );
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

export function registerCampaignTools(server: McpServer, api: PagekitClient) {
  server.registerTool(
    "pagekit_list_campaigns",
    {
      title: "List Campaigns",
      description: `List email campaigns for this project.
Example: pagekit_list_campaigns()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.get<{ data: Array<{ id: string; name: string; subject?: string; status: string; sentAt?: string; scheduledFor?: string }> }>("/campaigns");
        const md = listMarkdown(res.data, "Campaigns", (c) => {
          const camp = c as { subject?: string; status: string; sentAt?: string; scheduledFor?: string };
          return [
            `Status: ${camp.status}`,
            camp.subject ? `Subject: ${camp.subject}` : null,
            camp.scheduledFor ? `Scheduled: ${camp.scheduledFor}` : null,
            camp.sentAt ? `Sent: ${camp.sentAt}` : null,
          ].filter(Boolean);
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_create_campaign",
    {
      title: "Create Campaign",
      description: `Create a new email campaign draft.
Example: pagekit_create_campaign({ name: "Weekly Digest", subject: "This week in tech" })`,
      inputSchema: {
        name: z.string().min(1).describe("Campaign name"),
        subject: z.string().optional().describe("Email subject line"),
        content: z.string().optional().describe("Email body content"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; name: string; status: string }>("/campaigns", p);
        return ok(data, `Campaign "${data.name}" created (${data.status}).`);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_send_campaign",
    {
      title: "Send Campaign",
      description: `Send a draft campaign immediately.
Example: pagekit_send_campaign({ id: "camp_123" })`,
      inputSchema: {
        id: z.string().describe("Campaign ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; status: string }>(`/campaigns/${p.id}/send`);
        return ok(data, `Campaign \`${p.id}\` sent.`);
      } catch (e) { return err(e); }
    },
  );
}

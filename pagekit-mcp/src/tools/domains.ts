import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

export function registerDomainTools(server: McpServer, api: PagekitClient) {
  server.registerTool(
    "pagekit_list_domains",
    {
      title: "List Domains",
      description: `List all custom domains for this project.
Example: pagekit_list_domains()`,
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      try {
        const res = await api.get<{ data: Array<{ id: string; hostname: string; verified: boolean; dnsRecordType: string }> }>("/domains");
        const md = listMarkdown(res.data, "Domains", (d) => {
          const dom = d as { hostname: string; verified: boolean; dnsRecordType: string };
          return [
            `DNS: ${dom.dnsRecordType}`,
            `Verified: ${dom.verified ? "yes" : "no"}`,
          ];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_create_domain",
    {
      title: "Create Domain",
      description: `Add a custom domain to this project.
Example: pagekit_create_domain({ hostname: "blog.example.com" })`,
      inputSchema: {
        hostname: z.string().min(3).describe("Domain hostname (e.g. blog.example.com)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; hostname: string; dnsRecordType: string }>("/domains", p);
        return ok(data, `Domain ${data.hostname} registered. DNS record: ${data.dnsRecordType} → domains.pagekit.app`);
      } catch (e) { return err(e); }
    },
  );

  server.registerTool(
    "pagekit_verify_domain",
    {
      title: "Verify Domain",
      description: `Trigger DNS verification for a domain.
Example: pagekit_verify_domain({ id: "dom_123" })`,
      inputSchema: {
        id: z.string().describe("Domain ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const data = await api.post<{ id: string; hostname: string; verified: boolean }>(`/domains/${p.id}/verify`);
        return ok(data, `Domain ${data.hostname} verified: ${data.verified ? "yes" : "no"}`);
      } catch (e) { return err(e); }
    },
  );
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";
import { paginationParams } from "../api-params.js";

export function registerTaxonomyTools(server: McpServer, api: PagekitClient) {
  // ── Tags ────────────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_list_tags",
    {
      title: "List Tags",
      description: `List all tags with post counts.

Example:
  pagekit_list_tags() — all tags
  pagekit_list_tags({ search: "react" }) — filter by name`,
      inputSchema: {
        search: z.string().optional().describe("Filter by tag name"),
        sort: z.enum(["name", "created_at"]).optional().describe("Sort field (default: name)"),
        limit: z.number().int().min(1).max(100).default(50).describe("Max results"),
        offset: z.number().int().min(0).default(0).describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: { id: string; name: string; slug: string; _count?: { posts: number } }[] }>("/tags", {
          search: p.search ?? "",
          sort: p.sort ?? "",
          ...paginationParams(p.limit, p.offset),
        });
        const md = listMarkdown(res.data, "Tags", (t) => {
          const count = (t as { posts?: number; _count?: { posts: number } }).posts ?? (t as { _count?: { posts: number } })._count?.posts ?? 0;
          return [`${count} post${count !== 1 ? "s" : ""}`];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  // ── Categories ──────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_list_categories",
    {
      title: "List Categories",
      description: `List all categories.

Example:
  pagekit_list_categories()`,
      inputSchema: {
        sort: z.string().optional().describe("Sort field"),
        limit: z.number().int().min(1).max(100).default(50).describe("Max results"),
        offset: z.number().int().min(0).default(0).describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: { id: string; name: string; slug: string; description?: string }[] }>("/categories", {
          sort: p.sort ?? "",
          ...paginationParams(p.limit, p.offset),
        });
        const md = listMarkdown(res.data, "Categories", (c) => {
          const cat = c as { description?: string };
          return cat.description ? [cat.description] : [];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

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
        const res = await api.get<{ data: { id: string; name: string; slug: string; _count?: { posts: number } }[] }>("/api/v1/tags", {
          search: p.search ?? "",
          sort: p.sort ?? "",
          limit: String(p.limit),
          offset: String(p.offset),
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
        const res = await api.get<{ data: { id: string; name: string; slug: string; description?: string }[] }>("/api/v1/categories", {
          sort: p.sort ?? "",
          limit: String(p.limit),
          offset: String(p.offset),
        });
        const md = listMarkdown(res.data, "Categories", (c) => {
          const cat = c as { description?: string };
          return cat.description ? [cat.description] : [];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  // ── Authors ─────────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_list_authors",
    {
      title: "List Authors",
      description: `List all authors.

Example:
  pagekit_list_authors()`,
      inputSchema: {
        sort: z.string().optional().describe("Sort field"),
        limit: z.number().int().min(1).max(100).default(50).describe("Max results"),
        offset: z.number().int().min(0).default(0).describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: { id: string; name: string; email?: string }[] }>("/api/v1/authors", {
          sort: p.sort ?? "",
          limit: String(p.limit),
          offset: String(p.offset),
        });
        const md = listMarkdown(res.data, "Authors", (a) => {
          const author = a as { email?: string };
          return author.email ? [`  ${author.email}`] : [];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );
}

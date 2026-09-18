import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

type AuthorRow = {
  id: string;
  name: string;
  slug?: string | null;
  email?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  userId?: string | null;
};

function authorMarkdown(a: AuthorRow): string {
  return [
    `## ${a.name}`,
    a.slug ? `- **Slug:** \`${a.slug}\`` : "",
    a.email ? `- **Email:** ${a.email}` : "",
    a.bio ? `- **Bio:** ${a.bio}` : "",
    a.avatarUrl ? `- **Avatar:** ${a.avatarUrl}` : "",
    a.userId ? `- **Member ID:** \`${a.userId}\`` : "",
    `- **ID:** \`${a.id}\``,
  ]
    .filter(Boolean)
    .join("\n");
}

export function registerAuthorTools(server: McpServer, api: PagekitClient) {
  server.registerTool(
    "pagekit_list_authors",
    {
      title: "List Authors",
      description: `List author profiles for this project (team members with public bylines).

Example:
  pagekit_list_authors()`,
      inputSchema: {
        sort: z.string().optional().describe("Sort field, e.g. name or -created_at"),
        limit: z.number().int().min(1).max(100).default(50).describe("Max results"),
        page: z.number().int().min(1).default(1).describe("Page number"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: AuthorRow[] }>("/authors", {
          sort: p.sort ?? "",
          limit: String(p.limit),
          page: String(p.page),
        });
        const md = listMarkdown(
          res.data.map((a) => ({ ...a, slug: a.slug ?? undefined })),
          "Authors",
          (a) => {
          const author = a as AuthorRow;
          const bits = [];
          if (author.slug) bits.push(`@${author.slug}`);
          if (author.email) bits.push(author.email);
          if (author.bio) bits.push(author.bio.slice(0, 80));
          return bits;
        },
        );
        return ok(res, md);
      } catch (e) {
        return err(e);
      }
    },
  );

  server.registerTool(
    "pagekit_get_author",
    {
      title: "Get Author",
      description: `Get an author by ID or slug.

Example:
  pagekit_get_author({ id: "auth_123" })
  pagekit_get_author({ slug: "jane-doe" })`,
      inputSchema: {
        id: z.string().optional().describe("Author ID"),
        slug: z.string().optional().describe("Author slug"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      if (!p.id && !p.slug) return err(new Error("Provide id or slug."));
      try {
        const path = p.id ? `/authors/${p.id}` : `/authors/slug/${p.slug}`;
        const author = await api.get<AuthorRow>(path);
        return ok(author, authorMarkdown(author));
      } catch (e) {
        return err(e);
      }
    },
  );

  server.registerTool(
    "pagekit_create_author",
    {
      title: "Create Author",
      description: `Create an author profile. Link userId to an org member when available.

Example:
  pagekit_create_author({ name: "Jane Doe", email: "jane@example.com", bio: "Editor" })`,
      inputSchema: {
        name: z.string().min(1).describe("Display name"),
        slug: z.string().optional().describe("URL slug (auto-generated from name if omitted)"),
        email: z.string().email().optional().describe("Public email"),
        bio: z.string().max(1000).optional().describe("Short bio"),
        avatarUrl: z.string().url().optional().describe("Avatar image URL"),
        userId: z.string().optional().describe("Linked org member user ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const author = await api.post<AuthorRow>("/authors", p);
        return ok(author, `Created author.\n\n${authorMarkdown(author)}`);
      } catch (e) {
        return err(e);
      }
    },
  );

  server.registerTool(
    "pagekit_update_author",
    {
      title: "Update Author",
      description: `Update an author profile by ID.

Example:
  pagekit_update_author({ id: "auth_123", bio: "Senior editor" })`,
      inputSchema: {
        id: z.string().describe("Author ID"),
        name: z.string().optional(),
        slug: z.string().optional(),
        email: z.string().email().optional(),
        bio: z.string().max(1000).optional(),
        avatarUrl: z.string().url().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      const { id, ...body } = p;
      try {
        const author = await api.patch<AuthorRow>(`/authors/${id}`, body);
        return ok(author, `Updated author.\n\n${authorMarkdown(author)}`);
      } catch (e) {
        return err(e);
      }
    },
  );
}

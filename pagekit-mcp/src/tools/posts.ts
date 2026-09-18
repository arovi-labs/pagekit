import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, postMarkdown, listMarkdown } from "../format.js";

export function registerPostTools(server: McpServer, api: PagekitClient) {
  // ── List Posts ────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_list_posts",
    {
      title: "List Posts",
      description: `List blog posts with filters. Returns paginated results.

Examples:
  pagekit_list_posts() — list recent posts
  pagekit_list_posts({ status: "published" }) — only published
  pagekit_list_posts({ tag: "nextjs", limit: 5 }) — 5 posts tagged "nextjs"
  pagekit_list_posts({ search: "react", status: "draft" }) — draft posts about react`,
      inputSchema: {
        status: z.enum(["draft", "published", "scheduled"]).optional().describe("Filter by status"),
        author: z.string().optional().describe("Filter by author ID"),
        category: z.string().optional().describe("Filter by category slug"),
        tag: z.string().optional().describe("Filter by tag slug"),
        search: z.string().optional().describe("Search post titles (case-insensitive)"),
        sort: z.enum(["published_at", "created_at", "updated_at", "title"]).optional().describe("Sort field (default: published_at)"),
        limit: z.number().int().min(1).max(100).default(20).describe("Max results (1–100, default 20)"),
        offset: z.number().int().min(0).default(0).describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: unknown[]; pagination: unknown }>("/posts", {
          status: p.status ?? "",
          author: p.author ?? "",
          category: p.category ?? "",
          tag: p.tag ?? "",
          search: p.search ?? "",
          sort: p.sort ?? "",
          limit: String(p.limit),
          offset: String(p.offset),
        });
        const md = listMarkdown(res.data as { id: string; title: string; slug?: string; status?: string; excerpt?: string }[], "Posts", (item) => {
          const post = item as { slug?: string; status?: string; excerpt?: string };
          const fields = [`  \`${post.slug ?? "untitled"}\` · ${post.status ?? "draft"}`];
          if (post.excerpt) fields.push(`  ${post.excerpt}`);
          return fields;
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  // ── Get Post ──────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_get_post",
    {
      title: "Get Post",
      description: `Get a single post by ID or slug. Returns full post content including Markdown body.

Examples:
  pagekit_get_post({ slug: "my-first-post" })
  pagekit_get_post({ id: "clx1234..." })`,
      inputSchema: {
        id: z.string().optional().describe("Post ID"),
        slug: z.string().optional().describe("Post slug (alternative to ID)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        if (!p.id && !p.slug) throw new Error("Provide either id or slug.");
        const path = p.id ? `/posts/${p.id}` : `/posts/slug/${p.slug}`;
        const post = await api.get<Record<string, unknown>>(path);
        return ok(post, postMarkdown(post));
      } catch (e) { return err(e); }
    },
  );

  // ── Create Post ───────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_create_post",
    {
      title: "Create Post",
      description: `Create a new blog post. Tags are auto-created if they don't exist.

Examples:
  pagekit_create_post({ title: "Hello World", content: "# Hello\\n\\nThis is my first post." })
  pagekit_create_post({ title: "Draft", status: "draft", tags: ["react", "nextjs"] })
  pagekit_create_post({ title: "SEO Post", seoTitle: "Custom SEO Title", seoDescription: "Meta description" })`,
      inputSchema: {
        title: z.string().min(1).max(300).describe("Post title"),
        content: z.string().default("").describe("Post body in Markdown"),
        excerpt: z.string().optional().describe("Short excerpt (used in feeds and SEO)"),
        status: z.enum(["draft", "published", "scheduled"]).default("draft").describe("Initial status (default: draft)"),
        authorId: z.string().optional().describe("Author ID to assign"),
        categoryId: z.string().optional().describe("Category ID to assign"),
        tags: z.array(z.string()).optional().describe("Tag names (auto-created if missing)"),
        coverImage: z.string().url().optional().describe("Cover image URL"),
        seoTitle: z.string().optional().describe("Custom SEO title (overrides post title)"),
        seoDescription: z.string().optional().describe("SEO meta description"),
        canonicalUrl: z.string().url().optional().describe("Canonical URL for SEO"),
        scheduledFor: z.string().optional().describe("ISO date string for scheduled publishing"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const post = await api.post<Record<string, unknown>>("/posts", p);
        return ok(post, postMarkdown(post));
      } catch (e) { return err(e); }
    },
  );

  // ── Update Post ───────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_update_post",
    {
      title: "Update Post",
      description: `Update an existing post. Only provided fields are changed.

Examples:
  pagekit_update_post({ id: "clx1234...", title: "New Title" })
  pagekit_update_post({ id: "clx1234...", status: "published" })
  pagekit_update_post({ id: "clx1234...", tags: ["updated-tag"] })`,
      inputSchema: {
        id: z.string().describe("Post ID to update"),
        title: z.string().optional().describe("New title"),
        content: z.string().optional().describe("New body (Markdown)"),
        excerpt: z.string().optional().describe("New excerpt"),
        status: z.enum(["draft", "published", "scheduled"]).optional().describe("New status"),
        authorId: z.string().optional().describe("New author ID"),
        categoryId: z.string().optional().describe("New category ID"),
        tags: z.array(z.string()).optional().describe("Replace all tags with these names"),
        coverImage: z.string().url().optional().describe("New cover image URL"),
        seoTitle: z.string().optional().describe("New SEO title"),
        seoDescription: z.string().optional().describe("New SEO description"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const { id, ...body } = p;
        const post = await api.patch<Record<string, unknown>>(`/posts/${id}`, body);
        return ok(post, postMarkdown(post));
      } catch (e) { return err(e); }
    },
  );

  // ── Delete Post ───────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_delete_post",
    {
      title: "Delete Post",
      description: `Permanently delete a post by ID. This cannot be undone.

Example:
  pagekit_delete_post({ id: "clx1234..." })`,
      inputSchema: {
        id: z.string().describe("Post ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        await api.del(`/posts/${p.id}`);
        return ok({ deleted: true, id: p.id }, `Post \`${p.id}\` deleted.`);
      } catch (e) { return err(e); }
    },
  );
}

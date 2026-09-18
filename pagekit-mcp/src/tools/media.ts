import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PagekitClient } from "../client.js";
import { ok, err, listMarkdown } from "../format.js";

export function registerMediaTools(server: McpServer, api: PagekitClient) {
  // ── List Media ──────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_list_media",
    {
      title: "List Media",
      description: `List all media assets (images, files, videos).

Example:
  pagekit_list_media() — recent media
  pagekit_list_media({ limit: 50 }) — more results`,
      inputSchema: {
        limit: z.number().int().min(1).max(100).default(20).describe("Max results"),
        offset: z.number().int().min(0).default(0).describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        const res = await api.get<{ data: { id: string; filename: string; url: string; mimeType: string; size: number; alt?: string }[] }>("/media", {
          limit: String(p.limit),
          offset: String(p.offset),
        });
        const md = listMarkdown(res.data, "Media", (m) => {
          const asset = m as { mimeType: string; size: number; url: string };
          const sizeKb = Math.round(asset.size / 1024);
          return [`${asset.mimeType} · ${sizeKb}KB`];
        });
        return ok(res, md);
      } catch (e) { return err(e); }
    },
  );

  // ── Register Media ──────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_create_media",
    {
      title: "Register Media",
      description: `Register an existing media asset (already uploaded to storage).
This does NOT upload a file — it registers metadata for a file that already exists at a public URL.

Example:
  pagekit_create_media({
    url: "https://cdn.example.com/image.png",
    filename: "image.png",
    mimeType: "image/png",
    size: 102400,
    alt: "Hero image"
  })`,
      inputSchema: {
        url: z.string().url().describe("Public URL of the asset"),
        filename: z.string().describe("Original filename (e.g. image.png)"),
        mimeType: z.string().describe("MIME type (e.g. image/png, application/pdf)"),
        size: z.number().int().min(1).describe("File size in bytes"),
        width: z.number().int().optional().describe("Image width in pixels"),
        height: z.number().int().optional().describe("Image height in pixels"),
        alt: z.string().optional().describe("Alt text for accessibility"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (p) => {
      try {
        const asset = await api.post<Record<string, unknown>>("/media", p);
        return ok(asset, `Media registered: \`${asset.id}\``);
      } catch (e) { return err(e); }
    },
  );

  // ── Delete Media ────────────────────────────────────────────────────────

  server.registerTool(
    "pagekit_delete_media",
    {
      title: "Delete Media",
      description: `Delete a media asset by ID.

Example:
  pagekit_delete_media({ id: "clx1234..." })`,
      inputSchema: {
        id: z.string().describe("Media asset ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (p) => {
      try {
        await api.del(`/media/${p.id}`);
        return ok({ deleted: true, id: p.id }, `Media \`${p.id}\` deleted.`);
      } catch (e) { return err(e); }
    },
  );
}

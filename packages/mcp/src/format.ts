/**
 * Response formatting helpers for MCP tool outputs.
 * Returns both JSON (machine-readable) and Markdown (LLM-readable).
 */

export type McpResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

export function ok(data: unknown, markdown?: string): McpResult {
  const jsonText = JSON.stringify(data, null, 2);
  const text = markdown ? `${markdown}\n\n---\n**Raw JSON:**\n\`\`\`json\n${jsonText}\n\`\`\`` : jsonText;
  return { content: [{ type: "text", text }] };
}

export function err(error: unknown): McpResult {
  const msg = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number }).status;

  let hint = "";
  if (status === 401) hint = "\n\n→ Check that your PAGEKIT_API_KEY is valid and not revoked.";
  if (status === 404) hint = "\n\n→ The resource doesn't exist. Verify the ID or slug.";
  if (status === 403) hint = "\n\n→ Your API key doesn't have permission for this action.";
  if (status === 429) hint = "\n\n→ Rate limited. Wait a moment and try again.";
  if (status === 503) hint = "\n\n→ Database not available. Check your Pagekit deployment.";

  return {
    isError: true,
    content: [{ type: "text", text: `Error${status ? ` ${status}` : ""}: ${msg}${hint}` }],
  };
}

// ── Markdown formatters ─────────────────────────────────────────────────

export function postMarkdown(post: Record<string, unknown>): string {
  const p = post as { id: string; title: string; slug: string; status: string; excerpt?: string; publishedAt?: string; createdAt: string; tags?: (string | { name: string })[]; author?: { name: string } | string; category?: { name: string } | string };
  
  // Normalize tags to string array
  const tags = p.tags?.map(t => typeof t === "string" ? t : t.name) ?? [];
  // Normalize author
  const authorName = typeof p.author === "string" ? p.author : p.author?.name;
  // Normalize category
  const categoryName = typeof p.category === "string" ? p.category : p.category?.name;

  const lines = [
    `### ${p.title ?? "Untitled"}`,
    `- **ID:** \`${p.id}\``,
    `- **Slug:** \`${p.slug ?? "untitled"}\``,
    `- **Status:** ${p.status ?? "draft"}`,
    authorName ? `- **Author:** ${authorName}` : null,
    categoryName ? `- **Category:** ${categoryName}` : null,
    tags.length ? `- **Tags:** ${tags.join(", ")}` : null,
    p.excerpt ? `- **Excerpt:** ${p.excerpt}` : null,
    `- **Published:** ${p.publishedAt ?? "draft"}`,
    `- **Created:** ${p.createdAt}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function listMarkdown<T extends { id: string; name?: string; title?: string; slug?: string }>(
  items: T[],
  title: string,
  fields?: (item: T) => string[],
): string {
  if (!items.length) return `No ${title.toLowerCase()} found.`;
  const lines = [`## ${title} (${items.length})`, ""];
  for (const item of items) {
    const label = item.title ?? item.name ?? item.slug ?? item.id;
    lines.push(`- **${label}** \`${item.id}\``);
    if (fields) {
      for (const f of fields(item)) lines.push(`  ${f}`);
    }
  }
  return lines.join("\n");
}

/** Map MCP pagination (offset/limit) to PageKit API (page/limit). */
export function paginationParams(limit: number, offset: number): Record<string, string> {
  return {
    page: String(Math.floor(offset / limit) + 1),
    limit: String(limit),
  };
}

/** Collection engine expects uppercase enum values (DRAFT, PUBLISHED, …). */
export function normalizePostPayload(body: Record<string, unknown>): Record<string, unknown> {
  const out = { ...body };
  if (typeof out.status === "string") out.status = out.status.toUpperCase();
  return out;
}

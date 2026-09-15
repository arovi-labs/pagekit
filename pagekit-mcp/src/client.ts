/**
 * Typed HTTP client for the Pagekit content API.
 */

export interface ApiListResponse<T> {
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface ApiSingleResponse<T> {
  data: T;
}

export class PagekitClient {
  private base: string;
  private key: string;

  constructor(baseUrl: string, apiKey: string) {
    // Strip trailing slash
    this.base = baseUrl.replace(/\/+$/, "");
    this.key = apiKey;
  }

  // ── Generic request ────────────────────────────────────────────────────

  async get<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request("GET", path, undefined, params);
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request("POST", path, body);
  }

  async patch<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request("PATCH", path, body);
  }

  async del<T = unknown>(path: string): Promise<T> {
    return this.request("DELETE", path);
  }

  // ── Health ─────────────────────────────────────────────────────────────

  async health() {
    return this.get("/api/v1/health");
  }

  // ── Private ────────────────────────────────────────────────────────────

  private async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, this.base);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
      }
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = await res.json() as { error?: { message?: string } };
        detail = body?.error?.message ?? JSON.stringify(body);
      } catch {
        detail = await res.text().catch(() => "");
      }
      throw new ApiError(res.status, detail || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }
}

// ── Typed error ─────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

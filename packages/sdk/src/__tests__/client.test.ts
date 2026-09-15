import { describe, it, expect, vi, beforeEach } from "vitest";
import { Pagekit, DEFAULT_BASE_URL } from "../client";
import { PagekitError } from "../errors";

function mockFetch(response: Partial<Response> = {}) {
  const defaults: Response = {
    ok: true,
    status: 200,
    headers: new Headers(),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    clone: () => mockFetch(response) as unknown as Response,
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    redirected: false,
    type: "basic",
    url: "",
  };
  return vi.fn().mockResolvedValue({ ...defaults, ...response });
}

function jsonResponse(data: unknown, overrides: Partial<Response> = {}) {
  return mockFetch({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    ...overrides,
  });
}

describe("Pagekit", () => {
  describe("constructor", () => {
    it("throws when no API key is provided", () => {
      expect(() => new Pagekit({ apiKey: "" })).toThrow(PagekitError);
      expect(() => new Pagekit({ apiKey: "" })).toThrow("API key is required");
    });

    it("creates an instance with valid options", () => {
      const fetch = mockFetch();
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });
      expect(client.apiKey).toBe("pk_test_123");
      expect(client.baseUrl).toBe(DEFAULT_BASE_URL);
    });

    it("uses custom base URL", () => {
      const fetch = mockFetch();
      const client = new Pagekit({
        apiKey: "pk_test_123",
        baseUrl: "https://my-api.example.com/v1/",
        fetch,
      });
      expect(client.baseUrl).toBe("https://my-api.example.com/v1");
    });

    it("strips trailing slashes from base URL", () => {
      const fetch = mockFetch();
      const client = new Pagekit({
        apiKey: "pk_test_123",
        baseUrl: "https://example.com/v1///",
        fetch,
      });
      expect(client.baseUrl).toBe("https://example.com/v1");
    });

    it("exposes resource namespaces", () => {
      const fetch = mockFetch();
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });
      expect(client.posts).toBeDefined();
      expect(client.authors).toBeDefined();
      expect(client.categories).toBeDefined();
      expect(client.tags).toBeDefined();
      expect(client.media).toBeDefined();
    });
  });

  describe("request", () => {
    it("sends correct headers", async () => {
      const fetch = jsonResponse({ ok: true });
      const client = new Pagekit({
        apiKey: "pk_test_123",
        fetch,
        headers: { "X-Custom": "value" },
      });

      await client.request("/test");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.pagekit.app/v1/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer pk_test_123",
            Accept: "application/json",
            "X-Custom": "value",
          }),
        }),
      );
    });

    it("sends JSON body for POST requests", async () => {
      const fetch = jsonResponse({ id: "1" });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      await client.request("/posts", {
        method: "POST",
        body: { title: "Hello" },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ title: "Hello" }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("builds URL with query params", async () => {
      const fetch = jsonResponse({ data: [] });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      await client.request("/posts", {
        query: { status: "published", limit: 10 },
      });

      const url = fetch.mock.calls[0][0];
      expect(url).toContain("status=published");
      expect(url).toContain("limit=10");
    });

    it("skips undefined/null/empty query params", async () => {
      const fetch = jsonResponse({ data: [] });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      await client.request("/posts", {
        query: { status: "published", tag: undefined, author: null, search: "" },
      });

      const url = fetch.mock.calls[0][0];
      expect(url).toContain("status=published");
      expect(url).not.toContain("tag=");
      expect(url).not.toContain("author=");
      expect(url).not.toContain("search=");
    });

    it("returns parsed JSON", async () => {
      const data = { id: "1", title: "Test" };
      const fetch = jsonResponse(data);
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      const result = await client.request("/posts/1");
      expect(result).toEqual(data);
    });

    it("throws PagekitError on non-ok response", async () => {
      const fetch = mockFetch({
        ok: false,
        status: 404,
        text: () => Promise.resolve(JSON.stringify({ error: { message: "Not found", code: "not_found" } })),
      });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      await expect(client.request("/posts/999")).rejects.toThrow(PagekitError);
      await expect(client.request("/posts/999")).rejects.toMatchObject({
        status: 404,
        code: "not_found",
      });
    });

    it("throws on network error", async () => {
      const fetch = vi.fn().mockRejectedValue(new Error("Network fail"));
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      await expect(client.request("/test")).rejects.toThrow(PagekitError);
      await expect(client.request("/test")).rejects.toMatchObject({
        code: "network_error",
      });
    });

    it("throws on timeout", async () => {
      const fetch = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          const err = new Error("Aborted");
          err.name = "AbortError";
          setTimeout(() => reject(err), 10);
        });
      });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch, timeout: 1 });

      await expect(client.request("/test")).rejects.toThrow(PagekitError);
      await expect(client.request("/test")).rejects.toMatchObject({
        code: "timeout",
      });
    });

    it("handles 204 No Content", async () => {
      const fetch = mockFetch({ ok: true, status: 204 });
      const client = new Pagekit({ apiKey: "pk_test_123", fetch });

      const result = await client.request("/posts/1", { method: "DELETE" });
      expect(result).toBeUndefined();
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { Pagekit } from "../client";
import type { HttpClient } from "../http";

function createClient() {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  });
  return { client: new Pagekit({ apiKey: "pk_test_123", fetch }), fetch };
}

function mockJsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

describe("PostsResource", () => {
  it("list sends GET to /posts", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ data: [], pagination: {} }));

    await client.posts.list({ status: "published", limit: 5 });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      expect.objectContaining({ method: "GET" }),
    );
    const url = fetch.mock.calls[0][0];
    expect(url).toContain("status=published");
    expect(url).toContain("limit=5");
  });

  it("get sends GET to /posts/:id", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ id: "123", title: "Test" }));

    const post = await client.posts.get("123");
    expect(post).toEqual({ id: "123", title: "Test" });

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/posts/123");
  });

  it("getBySlug sends GET to /posts/slug/:slug", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ slug: "hello" }));

    await client.posts.getBySlug("hello");

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/posts/slug/hello");
  });

  it("create sends POST to /posts", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ id: "new" }));

    await client.posts.create({ title: "New Post", content: "Hello" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("update sends PATCH to /posts/:id", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ id: "123" }));

    await client.posts.update("123", { title: "Updated" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/posts/123"),
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("delete sends DELETE to /posts/:id", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue({ ok: true, status: 204 });

    await client.posts.delete("123");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/posts/123"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});

describe("AuthorsResource", () => {
  it("list sends GET to /authors", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ data: [] }));

    await client.authors.list();

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/authors");
  });

  it("get sends GET to /authors/:id", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ id: "a1" }));

    await client.authors.get("a1");

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/authors/a1");
  });
});

describe("CategoriesResource", () => {
  it("list sends GET to /categories", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ data: [] }));

    await client.categories.list();

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/categories");
  });

  it("getBySlug sends GET to /categories/:slug", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ slug: "engineering" }));

    await client.categories.getBySlug("engineering");

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/categories/engineering");
  });
});

describe("TagsResource", () => {
  it("list sends GET to /tags", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ data: [] }));

    await client.tags.list();

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/tags");
  });
});

describe("MediaResource", () => {
  it("list sends GET to /media", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ data: [] }));

    await client.media.list();

    const url = fetch.mock.calls[0][0];
    expect(url).toContain("/media");
  });

  it("create sends POST to /media", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue(mockJsonResponse({ id: "m1" }));

    await client.media.create({
      url: "https://example.com/img.png",
      filename: "img.png",
      mimeType: "image/png",
      size: 1024,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/media"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("delete sends DELETE to /media/:id", async () => {
    const { client, fetch } = createClient();
    fetch.mockResolvedValue({ ok: true, status: 204 });

    await client.media.delete("m1");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/media/m1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});

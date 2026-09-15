<p align="center">
  <img src="https://img.shields.io/badge/status-alpha-orange" alt="Status">
  <img src="https://img.shields.io/npm/l/@arovi/pagekit-core" alt="License">
  <img src="https://img.shields.io/npm/v/@arovi/pagekit-core" alt="npm version">
</p>

<h1 align="center">PageKit</h1>

<p align="center">
  <strong>The content layer for your website.</strong><br>
  Stop building CMSs. Ship content in minutes.
</p>

---

## What is PageKit?

PageKit is a developer-first content backend. It gives your website a Content API, a publishing dashboard, media management, SEO, drafts — and AI-agent access through MCP.

**You write code. PageKit handles the content.**

## Packages

| Package | Description |
|---------|-------------|
| [`@arovi/pagekit-core`](./packages/sdk) | TypeScript client for the PageKit content API |
| [`@arovi/pagekit-mcp`](./packages/mcp) | MCP server — let AI agents manage your content |

## Quick Start

```bash
npm install @arovi/pagekit-core
```

```ts
import { Pagekit } from "@arovi/pagekit-core";

const pagekit = new Pagekit({
  apiKey: process.env.PAGEKIT_API_KEY,
});

// List posts
const { data: posts } = await pagekit.posts.list();

// Get a post by slug
const post = await pagekit.posts.get("my-first-post");

// Create a post
await pagekit.posts.create({
  title: "Hello World",
  content: "# Hello\n\nThis is my first post.",
  status: "published",
});

// Update a post
await pagekit.posts.update("post-id", {
  title: "Updated Title",
});

// Delete a post
await pagekit.posts.delete("post-id");
```

## AI-Agent Access

PageKit exposes your content through [MCP](https://modelcontextprotocol.io), so AI agents like Claude, Codex, and Cursor can read and write your content directly.

```bash
npm install -g @arovi/pagekit-mcp
```

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp
```

Then in Claude or Cursor:

```
"Create a blog post about our new feature."
"Find all unpublished drafts."
"Update the title of the latest article."
"Publish this post."
```

## SDK Reference

### `posts`

```ts
pagekit.posts.list({ status: "published", sort: "-published_at" });
pagekit.posts.get("post-id");
pagekit.posts.getBySlug("my-post");
pagekit.posts.create({ title: "...", content: "..." });
pagekit.posts.update("post-id", { title: "..." });
pagekit.posts.delete("post-id");
```

### `authors`

```ts
pagekit.authors.list();
pagekit.authors.get("author-id");
```

### `categories`

```ts
pagekit.categories.list();
pagekit.categories.getBySlug("engineering");
```

### `tags`

```ts
pagekit.tags.list();
```

### `media`

```ts
pagekit.media.list();
pagekit.media.create({ url: "...", filename: "...", mimeType: "image/png", size: 1024 });
pagekit.media.delete("media-id");
```

## Architecture

```
pagekit/
├── packages/
│   ├── sdk/          # @arovi/pagekit-core — TypeScript content client
│   ├── mcp/          # @arovi/pagekit-mcp — MCP server for AI agents
│   ├── next/         # Next.js integration (coming soon)
│   └── cli/          # CLI tooling (coming soon)
├── examples/
│   └── next-blog/    # Example Next.js blog
└── docs/
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

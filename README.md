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

PageKit is a developer-first content backend. It provides a Content API, a publishing dashboard, media management, SEO tools, draft workflows, and AI-agent access through the Model Context Protocol (MCP).

**You write code. PageKit handles the content.**

---

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [`@arovi/pagekit-core`](./pagekit-typescript) | TypeScript client for the PageKit content API | `pnpm add @arovi/pagekit-core` |
| [`@arovi/pagekit-mcp`](./pagekit-mcp) | MCP server - let AI agents manage your content | `pnpm add -g @arovi/pagekit-mcp` |
| [`@arovi/pagekit-next`](./pagekit-next) | Next.js integration (server components, caching) | `pnpm add @arovi/pagekit-next` |
| [`@arovi/pagekit-cli`](./pagekit-cli) | CLI tooling for scaffolding and management | `pnpm add -g @arovi/pagekit-cli` |
| [`pagekit-core`](./pagekit-python) | Python client for the PageKit content API | `pip install pagekit-core` |

---

## Quick Start

### TypeScript / JavaScript

```bash
pnpm add @arovi/pagekit-core
```

```ts
import { Pagekit } from "@arovi/pagekit-core";

const pagekit = new Pagekit({
  apiKey: process.env.PAGEKIT_API_KEY,
});

// List posts
const { data: posts } = await pagekit.posts.list();

// Get a post by slug
const post = await pagekit.posts.getBySlug("my-first-post");

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

### Python

```bash
pip install pagekit-core
```

```python
from pagekit import Pagekit

client = Pagekit(api_key="pk_live_...")

# List posts
page = client.posts.list(status="published", limit=10)
for post in page.data:
    print(post.title)

# Create a post
post = client.posts.create(title="Hello world", content="<p>First post</p>")

# Get by slug
post = client.posts.get_by_slug("hello-world")
```

---

## AI-Agent Access with MCP

PageKit exposes your content through the [Model Context Protocol](https://modelcontextprotocol.io) (MCP), enabling AI agents like Claude, Codex, and Cursor to read and write your content directly.

### Installation

```bash
pnpm add -g @arovi/pagekit-mcp
```

### Quick Start

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp
```

### Configuration

Add to your MCP client configuration:

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "pagekit": {
      "command": "pagekit-mcp",
      "env": {
        "PAGEKIT_API_KEY": "pk_live_..."
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "pagekit": {
      "command": "pagekit-mcp",
      "env": {
        "PAGEKIT_API_KEY": "pk_live_..."
      }
    }
  }
}
```

### Available Tools

| Tool | Description |
|------|-------------|
| `pagekit_list_posts` | List posts with filters (status, author, tag, search) |
| `pagekit_get_post` | Get a post by ID or slug |
| `pagekit_create_post` | Create a new post |
| `pagekit_update_post` | Update an existing post |
| `pagekit_delete_post` | Delete a post |
| `pagekit_list_tags` | List all tags |
| `pagekit_list_categories` | List all categories |
| `pagekit_list_authors` | List all authors |
| `pagekit_list_media` | List media assets |
| `pagekit_create_media` | Register a media asset |
| `pagekit_delete_media` | Delete a media asset |
| `pagekit_project_info` | Get project info and post counts |
| `pagekit_health` | Check API health |

### Example Agent Interactions

```
"Create a blog post about our new feature."
"Find all unpublished drafts."
"Update the title of the latest article."
"Publish this post."
```

---

## SDK Reference

### Posts (`posts`)

```ts
// List with pagination and filters
pagekit.posts.list({
  status: "published",
  sort: "-published_at",
  page: 1,
  limit: 20,
});

// Get single post
pagekit.posts.get("post-id");
pagekit.posts.getBySlug("my-post");

// Create / Update / Delete
pagekit.posts.create({ title: "...", content: "...", status: "draft" });
pagekit.posts.update("post-id", { title: "Updated" });
pagekit.posts.delete("post-id");
```

### Authors (`authors`)

```ts
pagekit.authors.list();
pagekit.authors.get("author-id");
```

### Categories (`categories`)

```ts
pagekit.categories.list();
pagekit.categories.getBySlug("engineering");
```

### Tags (`tags`)

```ts
pagekit.tags.list();
```

### Media (`media`)

```ts
pagekit.media.list();
pagekit.media.create({
  url: "https://example.com/image.png",
  filename: "image.png",
  mimeType: "image/png",
  size: 1024,
});
pagekit.media.delete("media-id");
```

### Error Handling

```ts
import { PagekitError } from "@arovi/pagekit-core";

try {
  await pagekit.posts.get("invalid-id");
} catch (error) {
  if (error instanceof PagekitError) {
    console.log(error.status);        // HTTP status code
    console.log(error.code);          // Error code
    console.log(error.isAuthError);   // 401/403
    console.log(error.isRateLimited); // 429
    console.log(error.isServerError); // 5xx
  }
}
```

---

## Next.js Integration

For Next.js projects, use the dedicated integration package with server component support:

```bash
pnpm add @arovi/pagekit-next
```

```tsx
import { getPosts, getPost } from "@arovi/pagekit-next";

// Server Component
export default async function BlogPage() {
  const { data: posts } = await getPosts({ status: "published" });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// Dynamic route
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost({ slug: params.slug });
  return <article>{post.content}</article>;
}

// SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost({ slug: params.slug });
  return { title: post.title, description: post.excerpt };
}
```

See the [Next.js integration docs](./pagekit-next) for more.

---

## CLI Usage

```bash
pnpm add -g @arovi/pagekit-cli

# Initialize a new PageKit project
pagekit init
```

The CLI detects your framework, sets up the SDK, and creates your environment config.

---

## Architecture

```
pagekit/
├── pagekit-typescript/  # @arovi/pagekit-core - TypeScript content client
├── pagekit-mcp/         # @arovi/pagekit-mcp - MCP server for AI agents
├── pagekit-cli/         # @arovi/pagekit-cli - CLI tooling
├── pagekit-next/        # @arovi/pagekit-next - Next.js integration
├── pagekit-python/      # pagekit-core (PyPI) - Python content client
├── examples/
│   └── next-blog/       # Example Next.js blog
└── docs/
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

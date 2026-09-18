<p align="center">
  <img src="https://img.shields.io/npm/v/@arovi/pagekit-next" alt="npm version">
  <img src="https://img.shields.io/npm/l/@arovi/pagekit-next" alt="License">
</p>

<h1 align="center">@arovi/pagekit-next</h1>

<p align="center">
  <strong>Next.js integration for PageKit.</strong><br>
  Server components, caching, and TypeScript-first content fetching.
</p>

---

## Installation

```bash
pnpm add @arovi/pagekit-next
# or
npm install @arovi/pagekit-next
```

**Peer Dependencies:** Requires `next >= 14`.

---

## Quick Start

### 1. Configure Environment

Add your API key to `.env.local`:

```env
PAGEKIT_API_KEY=pk_live_...
PAGEKIT_API_URL=https://api.pagekit.app/v1  # optional, defaults to hosted API
```

### 2. Fetch Content in Server Components

```tsx
import { getPosts } from "@arovi/pagekit-next";

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
```

---

## API Reference

### `getPosts(params?)`

List posts with filtering and pagination.

```tsx
const { data, meta } = await getPosts({
  status: "published",      // "published" | "draft"
  sort: "-published_at",    // Sort by field, prefix with "-" for descending
  page: 1,                  // Page number
  limit: 20,                // Items per page
  author: "author-id",      // Filter by author
  tag: "engineering",       // Filter by tag
  category: "tutorials",    // Filter by category
  search: "nextjs",         // Full-text search
});
```

**Returns:** `Paginated<Post>`

---

### `getPost({ id?, slug? })`

Get a single post by ID or slug. At least one identifier is required.

```tsx
// By ID
const post = await getPost({ id: "post-id" });

// By slug
const post = await getPost({ slug: "my-first-post" });
```

**Returns:** `Post`

**Throws:** `Error` if neither `id` nor `slug` is provided.

---

### `getAuthors()`

List all authors.

```tsx
const { data: authors } = await getAuthors();
```

**Returns:** `Paginated<Author>`

---

### `getCategories()`

List all categories.

```tsx
const { data: categories } = await getCategories();
```

**Returns:** `Paginated<Category>`

---

### `getTags()`

List all tags.

```tsx
const { data: tags } = await getTags();
```

**Returns:** `Paginated<Tag>`

---

### `createPageKit(config)`

Create a custom PageKit client instance. Use this when you need to:
- Use a different API key
- Override the base URL
- Pass custom configuration

```tsx
import { createPageKit, getPosts } from "@arovi/pagekit-next";

const pagekit = createPageKit({
  apiKey: "pk_live_...",
  baseUrl: "https://api.pagekit.app/v1",
});

// Pass as second argument to any getter
const posts = await getPosts({ status: "published" }, pagekit);
const post = await getPost({ slug: "hello" }, pagekit);
const authors = await getAuthors(pagekit);
const categories = await getCategories(pagekit);
const tags = await getTags(pagekit);
```

---

## Usage Examples

### Blog Index Page

```tsx
import { getPosts } from "@arovi/pagekit-next";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string };
}) {
  const { data: posts, meta } = await getPosts({
    status: "published",
    tag: searchParams.tag,
    page: Number(searchParams.page) || 1,
    limit: 10,
  });

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <nav>
        {meta && meta.currentPage > 1 && (
          <a href={`/blog?page=${meta.currentPage - 1}`}>Previous</a>
        )}
        {meta && meta.currentPage < meta.totalPages && (
          <a href={`/blog?page=${meta.currentPage + 1}`}>Next</a>
        )}
      </nav>
    </div>
  );
}
```

### Dynamic Post Page

```tsx
import { getPost, getPosts } from "@arovi/pagekit-next";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost({ slug: params.slug });

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.author && (
        <footer>
          Written by {post.author.name}
        </footer>
      )}
    </article>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const { data: posts } = await getPosts({ status: "published" });
  return posts.map((post) => ({ slug: post.slug }));
}
```

### SEO Metadata

```tsx
import type { Metadata } from "next";
import { getPost } from "@arovi/pagekit-next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost({ slug: params.slug });

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name,
    },
  };
}
```

### Category Page

```tsx
import { getPosts } from "@arovi/pagekit-next";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: posts } = await getPosts({
    status: "published",
    category: params.slug,
  });

  return (
    <div>
      <h1>Posts in "{params.slug}"</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Tag Page

```tsx
import { getPosts } from "@arovi/pagekit-next";

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: posts } = await getPosts({
    status: "published",
    tag: params.slug,
  });

  return (
    <div>
      <h1>Posts tagged "{params.slug}"</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Draft Preview (Client Component)

For draft preview with client-side navigation:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { getPost } from "@arovi/pagekit-next";

export function DraftPreview({ draftId }: { draftId: string }) {
  const router = useRouter();

  // Fetch drafts in client component with createPageKit
  const pagekit = createPageKit({
    apiKey: process.env.NEXT_PUBLIC_PAGEKIT_API_KEY!,
  });

  // ... draft preview logic
}
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PAGEKIT_API_KEY` | Yes* | - | Your PageKit API key |
| `PAGEKIT_API_URL` | No | `https://api.pagekit.app/v1` | API base URL |

*Only optional if using `createPageKit()` explicitly.

### TypeScript Types

All Next.js functions return the same types as the core SDK:

```tsx
import type {
  Post,
  Author,
  Category,
  Tag,
  Paginated,
  PostStatus,
} from "@arovi/pagekit-next";
```

---

## Features

- **Server Component Ready** - All functions are async and designed for React Server Components
- **Caching** - Responses are cached using Next.js fetch caching
- **TypeScript First** - Full type inference and IntelliSense
- **Lightweight** - Wraps `@arovi/pagekit-core` with zero additional overhead
- **Auto-configuration** - Reads `PAGEKIT_API_KEY` from environment automatically

---

## Migration from Core SDK

If you're already using `@arovi/pagekit-core`:

```tsx
// Before (core SDK)
import { Pagekit } from "@arovi/pagekit-core";

const pagekit = new Pagekit({
  apiKey: process.env.PAGEKIT_API_KEY!,
});

export default async function BlogPage() {
  const { data: posts } = await pagekit.posts.list();
  // ...
}

// After (Next.js integration)
import { getPosts } from "@arovi/pagekit-next";

export default async function BlogPage() {
  const { data: posts } = await getPosts();
  // ...
}
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Type check
pnpm typecheck
```

---

## Related Packages

- [@arovi/pagekit-core](../pagekit-typescript) - TypeScript SDK
- [@arovi/pagekit-mcp](../pagekit-mcp) - MCP server for AI agents
- [@arovi/pagekit-cli](../pagekit-cli) - CLI tooling
- [pagekit-core (Python)](../pagekit-python) - Python client

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

<p align="center">
  <img src="https://img.shields.io/npm/v/@arovi/pagekit-core" alt="npm version">
  <img src="https://img.shields.io/npm/l/@arovi/pagekit-core" alt="License">
</p>

<h1 align="center">@arovi/pagekit-core</h1>

<p align="center">
  <strong>TypeScript client for the PageKit content API.</strong><br>
  Fully typed, ESM-first, and framework-agnostic.
</p>

---

## Installation

```bash
pnpm add @arovi/pagekit-core
# or
npm install @arovi/pagekit-core
```

---

## Quick Start

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

---

## Configuration

```ts
import { Pagekit } from "@arovi/pagekit-core";

const pagekit = new Pagekit({
  apiKey: "pk_live_...",                           // Required - your API key
  baseUrl: "https://api.pagekit.app/v1",          // Optional - defaults to hosted API
  timeout: 30000,                                  // Optional - request timeout in ms
  fetch: customFetch,                              // Optional - custom fetch implementation
  headers: { "X-Custom-Header": "value" },        // Optional - additional headers
});
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | Your PageKit API key (`pk_live_...`) |
| `baseUrl` | `string` | No | `https://api.pagekit.app/v1` | API base URL |
| `timeout` | `number` | No | `30000` | Request timeout in milliseconds |
| `fetch` | `typeof fetch` | No | `globalThis.fetch` | Custom fetch implementation (useful for tests) |
| `headers` | `Record<string, string>` | No | `{}` | Additional headers for all requests |

---

## API Reference

### Posts

#### `pagekit.posts.list(params?)`

List posts with pagination and filtering.

```ts
const { data, meta } = await pagekit.posts.list({
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

#### `pagekit.posts.get(id)`

Get a single post by ID.

```ts
const post = await pagekit.posts.get("post-id");
```

**Returns:** `Post`

---

#### `pagekit.posts.getBySlug(slug)`

Get a single post by slug.

```ts
const post = await pagekit.posts.getBySlug("my-first-post");
```

**Returns:** `Post`

---

#### `pagekit.posts.create(input)`

Create a new post.

```ts
const post = await pagekit.posts.create({
  title: "My Post",
  content: "# Title\n\nContent...",
  status: "published",
  excerpt: "A short summary",
  slug: "my-post",
  author: "author-id",
  tags: ["tag-id-1", "tag-id-2"],
  categories: ["category-id"],
  seo: {
    title: "Custom SEO Title",
    description: "Custom description",
  },
});
```

**Returns:** `Post`

---

#### `pagekit.posts.update(id, input)`

Update an existing post. Only include fields you want to change.

```ts
const post = await pagekit.posts.update("post-id", {
  title: "Updated Title",
  status: "draft",
});
```

**Returns:** `Post`

---

#### `pagekit.posts.delete(id)`

Delete a post permanently.

```ts
await pagekit.posts.delete("post-id");
```

**Returns:** `void`

---

### Authors

#### `pagekit.authors.list(params?)`

List all authors.

```ts
const { data } = await pagekit.authors.list();
```

**Returns:** `Paginated<Author>`

---

#### `pagekit.authors.get(id)`

Get a single author by ID.

```ts
const author = await pagekit.authors.get("author-id");
```

**Returns:** `Author`

---

#### `pagekit.authors.getBySlug(slug)`

Get a single author by slug.

```ts
const author = await pagekit.authors.getBySlug("jane-doe");
```

**Returns:** `Author`

---

#### `pagekit.authors.create(input)`

Create an author profile.

```ts
const author = await pagekit.authors.create({
  name: "Jane Doe",
  bio: "Editor",
  userId: "member-id", // optional - link to org member
});
```

**Returns:** `Author`

---

#### `pagekit.authors.update(id, input)`

Update an author profile.

```ts
const author = await pagekit.authors.update("author-id", { bio: "Senior editor" });
```

**Returns:** `Author`

---

### Categories

#### `pagekit.categories.list(params?)`

List all categories.

```ts
const { data } = await pagekit.categories.list();
```

**Returns:** `Paginated<Category>`

---

#### `pagekit.categories.getBySlug(slug)`

Get a single category by slug.

```ts
const category = await pagekit.categories.getBySlug("engineering");
```

**Returns:** `Category`

---

### Tags

#### `pagekit.tags.list(params?)`

List all tags.

```ts
const { data } = await pagekit.tags.list();
```

**Returns:** `Paginated<Tag>`

---

### Media

#### `pagekit.media.list(params?)`

List all media assets.

```ts
const { data } = await pagekit.media.list();
```

**Returns:** `Paginated<Media>`

---

#### `pagekit.media.create(input)`

Register a new media asset.

```ts
const media = await pagekit.media.create({
  url: "https://example.com/image.png",
  filename: "image.png",
  mimeType: "image/png",
  size: 1024,
  alt: "Descriptive alt text",
});
```

**Returns:** `Media`

---

#### `pagekit.media.delete(id)`

Delete a media asset.

```ts
await pagekit.media.delete("media-id");
```

**Returns:** `void`

---

## Types

The SDK exports full TypeScript types for all resources:

```ts
import type {
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostListParams,
  PostStatus,
  Author,
  AuthorListParams,
  Category,
  CategoryListParams,
  Tag,
  TagListParams,
  Media,
  MediaCreateInput,
  MediaListParams,
  Seo,
  Paginated,
  Pagination,
} from "@arovi/pagekit-core";
```

---

## Error Handling

```ts
import { Pagekit, PagekitError } from "@arovi/pagekit-core";

const pagekit = new Pagekit({ apiKey: "pk_live_..." });

try {
  await pagekit.posts.get("invalid-id");
} catch (error) {
  if (error instanceof PagekitError) {
    console.log(error.status);         // HTTP status code (404)
    console.log(error.code);           // Error code ("not_found")
    console.log(error.message);        // Human-readable message

    // Convenience flags
    if (error.isAuthError) console.log("Invalid API key (401/403)");
    if (error.isRateLimited) console.log("Rate limited - retry after delay (429)");
    if (error.isServerError) console.log("Server error - safe to retry (5xx)");
  }
}
```

### Error Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `number` | HTTP status code |
| `code` | `string` | Machine-readable error code |
| `message` | `string` | Human-readable error message |
| `isAuthError` | `boolean` | `true` for 401/403 errors |
| `isRateLimited` | `boolean` | `true` for 429 errors |
| `isServerError` | `boolean` | `true` for 5xx errors |

---

## Framework Integrations

### Next.js

For Next.js projects, use the dedicated integration package with server component support:

```bash
pnpm add @arovi/pagekit-next
```

```tsx
import { getPosts, getPost } from "@arovi/pagekit-next";

export default async function BlogPage() {
  const { data: posts } = await getPosts({ status: "published" });
  // ...
}
```

See [@arovi/pagekit-next](../pagekit-next) for details.

### MCP (AI Agents)

For AI agent access, use the MCP server:

```bash
pnpm add -g @arovi/pagekit-mcp
```

See [@arovi/pagekit-mcp](../pagekit-mcp) for details.

---

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

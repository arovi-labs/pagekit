# @arovi/pagekit-core

TypeScript client for the [PageKit](https://github.com/arovi-labs/pagekit) content API.

## Install

```bash
pnpm add @arovi/pagekit-core
```

## Usage

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
await pagekit.posts.update("post-id", { title: "Updated Title" });

// Delete a post
await pagekit.posts.delete("post-id");
```

## API

### `posts`

```ts
pagekit.posts.list(params?)    // Paginated list with filters
pagekit.posts.get(id)          // Get by ID
pagekit.posts.getBySlug(slug)  // Get by slug
pagekit.posts.create(input)    // Create a post
pagekit.posts.update(id, input) // Update a post
pagekit.posts.delete(id)       // Delete a post
```

### `authors`

```ts
pagekit.authors.list(params?)
pagekit.authors.get(id)
```

### `categories`

```ts
pagekit.categories.list(params?)
pagekit.categories.getBySlug(slug)
```

### `tags`

```ts
pagekit.tags.list(params?)
```

### `media`

```ts
pagekit.media.list(params?)
pagekit.media.create(input)
pagekit.media.delete(id)
```

## Error Handling

```ts
import { PagekitError } from "@arovi/pagekit-core";

try {
  await pagekit.posts.get("invalid-id");
} catch (error) {
  if (error instanceof PagekitError) {
    if (error.isAuthError) console.log("Bad API key");
    if (error.isRateLimited) console.log("Rate limited, retry later");
    if (error.isServerError) console.log("Server error, safe to retry");
  }
}
```

## Configuration

```ts
const pagekit = new Pagekit({
  apiKey: "pk_live_...",         // Required
  baseUrl: "https://api.pagekit.app/v1", // Optional, defaults to hosted API
  timeout: 30000,                // Optional, ms
  fetch: customFetch,            // Optional, for tests/non-standard runtimes
  headers: { "X-Custom": "v" },  // Optional, extra headers
});
```

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

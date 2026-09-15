# @arovi/pagekit-next

Next.js integration for [PageKit](https://github.com/arovi-labs/pagekit).

## Install

```bash
pnpm add @arovi/pagekit-next
```

## Setup

Add your API key to `.env.local`:

```
PAGEKIT_API_KEY=pk_live_...
PAGEKIT_API_URL=http://localhost:3000  # optional, defaults to hosted API
```

The `getPosts()`, `getPost()`, etc. functions read `PAGEKIT_API_KEY` automatically from the environment.

## Usage

### Server Components (App Router)

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

### Dynamic routes

```tsx
import { getPost } from "@arovi/pagekit-next";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost({ slug: params.slug });
  return <article>{post.content}</article>;
}
```

### Metadata

```tsx
import { getPost } from "@arovi/pagekit-next";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost({ slug: params.slug });
  return { title: post.title, description: post.excerpt };
}
```

### Multiple projects or custom config

```tsx
import { createPageKit, getPosts } from "@arovi/pagekit-next";

const pagekit = createPageKit({
  apiKey: "pk_live_...",
  baseUrl: "https://api.pagekit.app/v1",
});

const posts = await getPosts({}, pagekit);
```

## API

| Function | Description |
|----------|-------------|
| `getPosts(params?)` | List posts with filters |
| `getPost({ id?, slug? })` | Get a single post |
| `getAuthors()` | List authors |
| `getCategories()` | List categories |
| `getTags()` | List tags |
| `createPageKit(config)` | Create a custom client instance |

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

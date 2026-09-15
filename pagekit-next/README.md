# @arovi/pagekit-next

Next.js integration for [PageKit](https://github.com/arovi-labs/pagekit).

## Install

```bash
npm install @arovi/pagekit-next
```

## Usage

### Server Components (App Router)

```tsx
import { getPosts, getPost } from "@arovi/pagekit-next";

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

### Custom config

```tsx
import { createPageKit, getPosts } from "@arovi/pagekit-next";

const pagekit = createPageKit({
  apiKey: "pk_live_...",
  baseUrl: "https://api.pagekit.app/v1",
});

const posts = await getPosts({}, pagekit);
```

## Configuration

Set environment variables in `.env.local`:

```
PAGEKIT_API_KEY=pk_live_...
PAGEKIT_API_URL=http://localhost:3000  # optional
```

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@arovi/pagekit-next";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug });
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost({ slug });
  if (!post) notFound();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
      <Link
        href="/"
        style={{
          fontSize: 14,
          color: "#666",
          textDecoration: "none",
          marginBottom: 40,
          display: "block",
        }}
      >
        ← Back to all posts
      </Link>

      <article>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
          {post.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            fontSize: 14,
            color: "#999",
          }}
        >
          {post.author && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {post.category && <span>in {post.category.name}</span>}
        </div>

        <div style={{ fontSize: 18, lineHeight: 1.8, color: "#333" }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

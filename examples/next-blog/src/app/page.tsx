import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/pagekit";

export const metadata: Metadata = {
  title: "Blog — Powered by PageKit",
  description: "A blog powered by PageKit, the content layer for your website.",
};

export default async function Home() {
  const posts = await getPosts();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
      <header style={{ marginBottom: 64 }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>Blog</h1>
        <p style={{ fontSize: 18, color: "#666" }}>
          Powered by <strong>PageKit</strong>
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: "#999" }}>No posts yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {posts.map((post) => (
            <article key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p style={{ fontSize: 16, color: "#555", lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 12,
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
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

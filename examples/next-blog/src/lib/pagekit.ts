import { Pagekit } from "@arovi/pagekit-core";
import type { Post } from "@arovi/pagekit-core";

export function getClient() {
  return new Pagekit({
    apiKey: process.env.PAGEKIT_API_KEY!,
    baseUrl: process.env.PAGEKIT_API_URL || "http://localhost:3000",
  });
}

export async function getPosts(): Promise<Post[]> {
  try {
    const client = getClient();
    const { data } = await client.posts.list({ status: "published", sort: "-published_at" });
    return data;
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const client = getClient();
    return await client.posts.getBySlug(slug);
  } catch {
    return null;
  }
}

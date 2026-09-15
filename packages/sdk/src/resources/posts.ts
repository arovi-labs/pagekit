import type { HttpClient } from "../http";
import type {
  Paginated,
  Post,
  PostCreateInput,
  PostListParams,
  PostUpdateInput,
} from "../types";

export class PostsResource {
  constructor(private readonly http: HttpClient) {}

  /** `blog.posts.list({ status: "published", sort: "-published_at" })` */
  list(params: PostListParams = {}): Promise<Paginated<Post>> {
    return this.http.request<Paginated<Post>>("/posts", { query: { ...params } });
  }

  get(id: string): Promise<Post> {
    return this.http.request<Post>(`/posts/${encodeURIComponent(id)}`);
  }

  getBySlug(slug: string): Promise<Post> {
    return this.http.request<Post>(`/posts/slug/${encodeURIComponent(slug)}`);
  }

  create(input: PostCreateInput): Promise<Post> {
    return this.http.request<Post>("/posts", { method: "POST", body: input });
  }

  update(id: string, input: PostUpdateInput): Promise<Post> {
    return this.http.request<Post>(`/posts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/posts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }
}

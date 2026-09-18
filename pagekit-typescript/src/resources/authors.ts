import type { HttpClient } from "../http";
import type { Author, AuthorCreateInput, AuthorListParams, AuthorUpdateInput, Paginated } from "../types";

export class AuthorsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: AuthorListParams = {}): Promise<Paginated<Author>> {
    return this.http.request<Paginated<Author>>("/authors", { query: { ...params } });
  }

  get(id: string): Promise<Author> {
    return this.http.request<Author>(`/authors/${encodeURIComponent(id)}`);
  }

  getBySlug(slug: string): Promise<Author> {
    return this.http.request<Author>(`/authors/slug/${encodeURIComponent(slug)}`);
  }

  create(input: AuthorCreateInput): Promise<Author> {
    return this.http.request<Author>("/authors", { method: "POST", body: input });
  }

  update(id: string, input: AuthorUpdateInput): Promise<Author> {
    return this.http.request<Author>(`/authors/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    });
  }
}

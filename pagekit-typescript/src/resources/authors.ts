import type { HttpClient } from "../http";
import type { Author, AuthorListParams, Paginated } from "../types";

export class AuthorsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: AuthorListParams = {}): Promise<Paginated<Author>> {
    return this.http.request<Paginated<Author>>("/authors", { query: { ...params } });
  }

  get(id: string): Promise<Author> {
    return this.http.request<Author>(`/authors/${encodeURIComponent(id)}`);
  }
}

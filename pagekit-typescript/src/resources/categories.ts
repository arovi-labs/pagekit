import type { HttpClient } from "../http";
import type { Category, CategoryListParams, Paginated } from "../types";

export class CategoriesResource {
  constructor(private readonly http: HttpClient) {}

  list(params: CategoryListParams = {}): Promise<Paginated<Category>> {
    return this.http.request<Paginated<Category>>("/categories", { query: { ...params } });
  }

  getBySlug(slug: string): Promise<Category> {
    return this.http.request<Category>(`/categories/${encodeURIComponent(slug)}`);
  }
}

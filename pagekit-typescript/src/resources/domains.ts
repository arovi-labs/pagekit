import type { HttpClient } from "../http";
import type { Domain, DomainCreateInput, Paginated } from "../types";

export class DomainsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: { page?: number; limit?: number } = {}): Promise<Paginated<Domain>> {
    return this.http.request<Paginated<Domain>>("/domains", { query: { ...params } });
  }

  get(id: string): Promise<Domain> {
    return this.http.request<Domain>(`/domains/${encodeURIComponent(id)}`);
  }

  create(input: DomainCreateInput): Promise<Domain> {
    return this.http.request<Domain>("/domains", { method: "POST", body: input });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/domains/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  verify(id: string): Promise<Domain> {
    return this.http.request<Domain>(`/domains/${encodeURIComponent(id)}/verify`, { method: "POST" });
  }
}

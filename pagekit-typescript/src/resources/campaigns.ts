import type { HttpClient } from "../http";
import type { Campaign, CampaignCreateInput, CampaignListParams, CampaignUpdateInput, Paginated } from "../types";

export class CampaignsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: CampaignListParams = {}): Promise<Paginated<Campaign>> {
    return this.http.request<Paginated<Campaign>>("/campaigns", { query: { ...params } });
  }

  get(id: string): Promise<Campaign> {
    return this.http.request<Campaign>(`/campaigns/${encodeURIComponent(id)}`);
  }

  create(input: CampaignCreateInput): Promise<Campaign> {
    return this.http.request<Campaign>("/campaigns", { method: "POST", body: input });
  }

  update(id: string, input: CampaignUpdateInput): Promise<Campaign> {
    return this.http.request<Campaign>(`/campaigns/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/campaigns/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  send(id: string): Promise<Campaign> {
    return this.http.request<Campaign>(`/campaigns/${encodeURIComponent(id)}/send`, { method: "POST" });
  }
}

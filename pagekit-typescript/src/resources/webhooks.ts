import type { HttpClient } from "../http";
import type { Paginated, Webhook, WebhookCreateInput, WebhookListParams, WebhookUpdateInput } from "../types";

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  list(params: WebhookListParams = {}): Promise<Paginated<Webhook>> {
    return this.http.request<Paginated<Webhook>>("/webhooks", { query: { ...params } });
  }

  get(id: string): Promise<Webhook> {
    return this.http.request<Webhook>(`/webhooks/${encodeURIComponent(id)}`);
  }

  create(input: WebhookCreateInput): Promise<Webhook> {
    return this.http.request<Webhook>("/webhooks", { method: "POST", body: input });
  }

  update(id: string, input: WebhookUpdateInput): Promise<Webhook> {
    return this.http.request<Webhook>(`/webhooks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/webhooks/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

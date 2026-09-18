import type { HttpClient } from "../http";
import type { Paginated, Subscriber, SubscriberCreateInput, SubscriberListParams } from "../types";

export class SubscribersResource {
  constructor(private readonly http: HttpClient) {}

  list(params: SubscriberListParams = {}): Promise<Paginated<Subscriber>> {
    return this.http.request<Paginated<Subscriber>>("/subscribers", { query: { ...params } });
  }

  get(id: string): Promise<Subscriber> {
    return this.http.request<Subscriber>(`/subscribers/${encodeURIComponent(id)}`);
  }

  create(input: SubscriberCreateInput): Promise<Subscriber> {
    return this.http.request<Subscriber>("/subscribers", { method: "POST", body: input });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/subscribers/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

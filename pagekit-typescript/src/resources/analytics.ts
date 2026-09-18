import type { HttpClient } from "../http";
import type { AnalyticsEventCreateInput, AnalyticsStats, Paginated, AnalyticsEvent } from "../types";

export class AnalyticsResource {
  constructor(private readonly http: HttpClient) {}

  getStats(): Promise<AnalyticsStats> {
    return this.http.request<AnalyticsStats>("/analytics/stats");
  }

  list(params: { page?: number; limit?: number; type?: string } = {}): Promise<Paginated<AnalyticsEvent>> {
    return this.http.request<Paginated<AnalyticsEvent>>("/analytics", { query: { ...params } });
  }

  track(input: AnalyticsEventCreateInput): Promise<void> {
    return this.http.request<void>("/analytics", { method: "POST", body: input });
  }
}

import type { HttpClient } from "../http";
import type { Notification, Paginated } from "../types";

export class NotificationsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: { page?: number; limit?: number; unread?: boolean } = {}): Promise<Paginated<Notification>> {
    return this.http.request<Paginated<Notification>>("/notifications", { query: { ...params } });
  }

  get(id: string): Promise<Notification> {
    return this.http.request<Notification>(`/notifications/${encodeURIComponent(id)}`);
  }

  markRead(id: string): Promise<Notification> {
    return this.http.request<Notification>(`/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
  }

  markAllRead(): Promise<void> {
    return this.http.request<void>("/notifications/read-all", { method: "POST" });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/notifications/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

import type { HttpClient } from "../http";
import type { Media, MediaCreateInput, MediaListParams, Paginated } from "../types";

export class MediaResource {
  constructor(private readonly http: HttpClient) {}

  list(params: MediaListParams = {}): Promise<Paginated<Media>> {
    return this.http.request<Paginated<Media>>("/media", { query: { ...params } });
  }

  /** Registers an asset that already lives in object storage. */
  create(input: MediaCreateInput): Promise<Media> {
    return this.http.request<Media>("/media", { method: "POST", body: input });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/media/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

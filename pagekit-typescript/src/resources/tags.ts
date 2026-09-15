import type { HttpClient } from "../http";
import type { Paginated, Tag, TagListParams } from "../types";

export class TagsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: TagListParams = {}): Promise<Paginated<Tag>> {
    return this.http.request<Paginated<Tag>>("/tags", { query: { ...params } });
  }
}

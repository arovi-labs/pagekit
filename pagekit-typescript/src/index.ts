export { Pagekit, DEFAULT_BASE_URL } from "./client";
export type { PagekitOptions } from "./client";

export { PagekitError } from "./errors";

export type { HttpClient, HttpMethod, RequestOptions } from "./http";

export { AuthorsResource } from "./resources/authors";
export { CampaignsResource } from "./resources/campaigns";
export { CategoriesResource } from "./resources/categories";
export { DomainsResource } from "./resources/domains";
export { MediaResource } from "./resources/media";
export { NotificationsResource } from "./resources/notifications";
export { PostsResource } from "./resources/posts";
export { SubscribersResource } from "./resources/subscribers";
export { TagsResource } from "./resources/tags";
export { WebhooksResource } from "./resources/webhooks";
export { AnalyticsResource } from "./resources/analytics";

export type {
  AnalyticsEvent,
  AnalyticsEventCreateInput,
  AnalyticsStats,
  Author,
  AuthorCreateInput,
  AuthorListParams,
  AuthorUpdateInput,
  Campaign,
  CampaignCreateInput,
  CampaignListParams,
  CampaignUpdateInput,
  Category,
  CategoryListParams,
  Domain,
  DomainCreateInput,
  Media,
  MediaCreateInput,
  MediaListParams,
  Notification,
  Paginated,
  Pagination,
  Post,
  PostCreateInput,
  PostListParams,
  PostStatus,
  PostUpdateInput,
  Seo,
  Subscriber,
  SubscriberCreateInput,
  SubscriberListParams,
  Tag,
  TagListParams,
  Webhook,
  WebhookCreateInput,
  WebhookListParams,
  WebhookUpdateInput,
} from "./types";

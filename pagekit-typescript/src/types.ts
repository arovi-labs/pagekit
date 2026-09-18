export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export interface Seo {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
}

export interface Author {
  id: string;
  name: string;
  slug?: string | null;
  userId?: string | null;
  email?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorCreateInput {
  name: string;
  slug?: string;
  userId?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export type AuthorUpdateInput = Partial<AuthorCreateInput>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  createdAt?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggeredAt?: string | null;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookCreateInput {
  url: string;
  events: string[];
  secret?: string;
}

export type WebhookUpdateInput = Partial<WebhookCreateInput>;

export interface Domain {
  id: string;
  hostname: string;
  dnsRecordType: string;
  verified: boolean;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DomainCreateInput {
  hostname: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  status: "pending" | "subscribed" | "unsubscribed" | "bounced";
  createdAt: string;
}

export interface SubscriberCreateInput {
  email: string;
  name?: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject?: string | null;
  content?: string | null;
  status: "draft" | "scheduled" | "sending" | "sent";
  scheduledFor?: string | null;
  sentAt?: string | null;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCreateInput {
  name: string;
  subject?: string;
  content?: string;
  scheduledFor?: string;
}

export type CampaignUpdateInput = Partial<CampaignCreateInput>;

export interface AnalyticsEvent {
  id: string;
  type: string;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  createdAt: string;
}

export interface AnalyticsEventCreateInput {
  type: string;
  path?: string;
  referrer?: string;
  country?: string;
}

export interface AnalyticsStats {
  totalViews: number;
  viewsThisMonth: number;
  topPosts: { title: string; views: number }[];
  daily: { date: string; views: number }[];
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

/** Shape returned by the API - matches PRD §17. */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  publishedAt: string | null;
  scheduledFor: string | null;
  author: Pick<Author, "id" | "name"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  tags: string[];
  seo: Seo;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export interface PostListParams {
  status?: PostStatus;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
  /** `-field` for descending, e.g. `-published_at`. */
  sort?: string;
}

export interface PostCreateInput {
  title: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  authorId?: string;
  categoryId?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  publishedAt?: string;
  scheduledFor?: string;
}

export type PostUpdateInput = Partial<PostCreateInput>;

export interface CategoryListParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface TagListParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface AuthorListParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface MediaListParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface MediaCreateInput {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
}

export interface WebhookListParams {
  page?: number;
  limit?: number;
}

export interface SubscriberListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  status?: string;
}

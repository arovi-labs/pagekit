import { Pagekit, type PagekitOptions, type Post, type Paginated } from "@arovi/pagekit-core";

export type {
  Post,
  Paginated,
  Author,
  Category,
  Tag,
  Media,
  Webhook,
  Domain,
  Subscriber,
  Campaign,
  AnalyticsStats,
  Notification,
  PostStatus,
  Seo,
} from "@arovi/pagekit-core";

export interface PageKitConfig extends Omit<PagekitOptions, "fetch"> {}

let _client: Pagekit | null = null;

function getClient(config?: PageKitConfig): Pagekit {
  if (_client && !config) return _client;

  const apiKey = config?.apiKey ?? process.env.PAGEKIT_API_KEY;
  const baseUrl = config?.baseUrl ?? process.env.PAGEKIT_API_URL;

  if (!apiKey) {
    throw new Error(
      "PAGEKIT_API_KEY is required. Set it in .env.local or pass it to createPageKit().",
    );
  }

  _client = new Pagekit({ apiKey, baseUrl });
  return _client;
}

export function createPageKit(config: PageKitConfig): Pagekit {
  _client = new Pagekit(config);
  return _client;
}

export async function getPosts(
  params?: { status?: string; sort?: string; limit?: number; page?: number },
  config?: PageKitConfig,
): Promise<Paginated<Post>> {
  const client = getClient(config);
  return client.posts.list(params as any);
}

export async function getPost(
  identifier: { id?: string; slug?: string },
  config?: PageKitConfig,
): Promise<Post> {
  const client = getClient(config);
  if (identifier.slug) return client.posts.getBySlug(identifier.slug);
  if (identifier.id) return client.posts.get(identifier.id);
  throw new Error("Provide either id or slug");
}

export async function getAuthors(config?: PageKitConfig) {
  const client = getClient(config);
  return client.authors.list();
}

export async function getCategories(config?: PageKitConfig) {
  const client = getClient(config);
  return client.categories.list();
}

export async function getTags(config?: PageKitConfig) {
  const client = getClient(config);
  return client.tags.list();
}

export async function getWebhooks(config?: PageKitConfig) {
  const client = getClient(config);
  return client.webhooks.list();
}

export async function getDomains(config?: PageKitConfig) {
  const client = getClient(config);
  return client.domains.list();
}

export async function getSubscribers(config?: PageKitConfig) {
  const client = getClient(config);
  return client.subscribers.list();
}

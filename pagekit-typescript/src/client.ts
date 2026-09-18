import { PagekitError } from "./errors";
import type { HttpClient, RequestOptions } from "./http";
import { AnalyticsResource } from "./resources/analytics";
import { AuthorsResource } from "./resources/authors";
import { CampaignsResource } from "./resources/campaigns";
import { CategoriesResource } from "./resources/categories";
import { DomainsResource } from "./resources/domains";
import { MediaResource } from "./resources/media";
import { NotificationsResource } from "./resources/notifications";
import { PostsResource } from "./resources/posts";
import { SubscribersResource } from "./resources/subscribers";
import { TagsResource } from "./resources/tags";
import { WebhooksResource } from "./resources/webhooks";

export interface PagekitOptions {
  /** A project API key - `pk_live_...`. */
  apiKey: string;
  /** Defaults to the hosted API. Point this at your own deployment if self-hosting. */
  baseUrl?: string;
  /** Injectable fetch, useful for tests and non-standard runtimes. */
  fetch?: typeof globalThis.fetch;
  /** Per-request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
  headers?: Record<string, string>;
}

export const DEFAULT_BASE_URL = "https://api.pagekit.app/v1";

export class Pagekit implements HttpClient {
  readonly apiKey: string;
  readonly baseUrl: string;

  readonly posts: PostsResource;
  readonly authors: AuthorsResource;
  readonly categories: CategoriesResource;
  readonly tags: TagsResource;
  readonly media: MediaResource;
  readonly webhooks: WebhooksResource;
  readonly domains: DomainsResource;
  readonly subscribers: SubscribersResource;
  readonly campaigns: CampaignsResource;
  readonly analytics: AnalyticsResource;
  readonly notifications: NotificationsResource;

  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: PagekitOptions) {
    if (!options?.apiKey) {
      throw new PagekitError(
        "A Pagekit API key is required. Create one in Project → Developer → API keys.",
        0,
        "missing_api_key",
      );
    }

    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      throw new PagekitError(
        "No fetch implementation found. Pass one via the `fetch` option.",
        0,
        "missing_fetch",
      );
    }

    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = fetchImpl;
    this.timeout = options.timeout ?? 30_000;
    this.defaultHeaders = options.headers ?? {};

    this.posts = new PostsResource(this);
    this.authors = new AuthorsResource(this);
    this.categories = new CategoriesResource(this);
    this.tags = new TagsResource(this);
    this.media = new MediaResource(this);
    this.webhooks = new WebhooksResource(this);
    this.domains = new DomainsResource(this);
    this.subscribers = new SubscribersResource(this);
    this.campaigns = new CampaignsResource(this);
    this.analytics = new AnalyticsResource(this);
    this.notifications = new NotificationsResource(this);
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: options.method ?? "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
          ...this.defaultHeaders,
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal ?? controller.signal,
        cache: "no-store",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new PagekitError(
          `Request to ${url} timed out after ${this.timeout}ms.`,
          0,
          "timeout",
        );
      }
      throw new PagekitError(
        error instanceof Error ? error.message : "Network request failed.",
        0,
        "network_error",
        error,
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const payload = text ? safeJsonParse(text) : undefined;

    if (!response.ok) {
      throw new PagekitError(
        extractMessage(payload) ?? `Request failed with status ${response.status}.`,
        response.status,
        extractCode(payload) ?? "api_error",
        payload,
      );
    }

    return payload as T;
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(payload: unknown): string | undefined {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  const error = record.error;

  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  if (typeof record.message === "string") return record.message;

  return undefined;
}

function extractCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  const error = record.error;

  if (error && typeof error === "object") {
    const code = (error as Record<string, unknown>).code;
    if (typeof code === "string") return code;
  }
  if (typeof record.code === "string") return record.code;

  return undefined;
}

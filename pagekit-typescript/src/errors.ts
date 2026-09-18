export class PagekitError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status = 0, code = "unknown_error", details?: unknown) {
    super(message);
    this.name = "PagekitError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** True for 401/403 - an invalid, revoked, or missing API key. */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** True for 429 - the project exceeded its rate limit. */
  get isRateLimited(): boolean {
    return this.status === 429;
  }

  /** True for 5xx - the request is safe to retry with backoff. */
  get isServerError(): boolean {
    return this.status >= 500;
  }
}

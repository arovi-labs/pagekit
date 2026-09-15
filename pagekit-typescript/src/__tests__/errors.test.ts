import { describe, it, expect } from "vitest";
import { PagekitError } from "../errors";

describe("PagekitError", () => {
  it("has correct defaults", () => {
    const error = new PagekitError("test");
    expect(error.message).toBe("test");
    expect(error.status).toBe(0);
    expect(error.code).toBe("unknown_error");
    expect(error.name).toBe("PagekitError");
    expect(error).toBeInstanceOf(Error);
  });

  it("accepts custom status and code", () => {
    const error = new PagekitError("not found", 404, "not_found");
    expect(error.status).toBe(404);
    expect(error.code).toBe("not_found");
  });

  it("stores details", () => {
    const details = { field: "title" };
    const error = new PagekitError("validation", 422, "validation_error", details);
    expect(error.details).toEqual(details);
  });

  describe("isAuthError", () => {
    it("returns true for 401", () => {
      expect(new PagekitError("unauthorized", 401).isAuthError).toBe(true);
    });

    it("returns true for 403", () => {
      expect(new PagekitError("forbidden", 403).isAuthError).toBe(true);
    });

    it("returns false for other statuses", () => {
      expect(new PagekitError("not found", 404).isAuthError).toBe(false);
      expect(new PagekitError("error", 500).isAuthError).toBe(false);
    });
  });

  describe("isRateLimited", () => {
    it("returns true for 429", () => {
      expect(new PagekitError("rate limited", 429).isRateLimited).toBe(true);
    });

    it("returns false for other statuses", () => {
      expect(new PagekitError("error", 400).isRateLimited).toBe(false);
    });
  });

  describe("isServerError", () => {
    it("returns true for 5xx", () => {
      expect(new PagekitError("error", 500).isServerError).toBe(true);
      expect(new PagekitError("error", 503).isServerError).toBe(true);
      expect(new PagekitError("error", 599).isServerError).toBe(true);
    });

    it("returns false for non-5xx", () => {
      expect(new PagekitError("error", 400).isServerError).toBe(false);
      expect(new PagekitError("error", 404).isServerError).toBe(false);
    });
  });
});

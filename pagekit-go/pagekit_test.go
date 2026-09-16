package pagekit

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"time"
)

func TestNewClient(t *testing.T) {
	client, err := NewClient("pk_live_test")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if client.APIKey != "pk_live_test" {
		t.Errorf("APIKey = %q, want %q", client.APIKey, "pk_live_test")
	}
	if client.BaseURL != DefaultBaseURL {
		t.Errorf("BaseURL = %q, want %q", client.BaseURL, DefaultBaseURL)
	}
}

func TestNewClient_MissingAPIKey(t *testing.T) {
	_, err := NewClient("")
	if err == nil {
		t.Fatal("expected error for empty API key")
	}
	var pErr *PagekitError
	if !errors.As(err, &pErr) {
		t.Errorf("expected PagekitError, got %T", err)
	}
}

func TestWithBaseURL(t *testing.T) {
	client, err := NewClient("pk_test", WithBaseURL("https://custom.api/v1/"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if client.BaseURL != "https://custom.api/v1" {
		t.Errorf("BaseURL = %q, want %q", client.BaseURL, "https://custom.api/v1")
	}
}

func TestWithTimeout(t *testing.T) {
	client, err := NewClient("pk_test", WithTimeout(5*time.Second))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if client.HTTPClient.Timeout != 5*time.Second {
		t.Errorf("Timeout = %v, want %v", client.HTTPClient.Timeout, 5*time.Second)
	}
}

func TestClient_AuthHeader(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertAuth(t, r)
		writeJSON(t, w, 200, map[string]string{"ok": "true"})
	})
	defer ts.Close()

	_, err := client.Posts.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestClient_APIError(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(t, w, 401, map[string]interface{}{
			"error": "Invalid API key",
			"code":  "invalid_api_key",
		})
	})
	defer ts.Close()

	_, err := client.Posts.List(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
	var pErr *PagekitError
	if !errors.As(err, &pErr) {
		t.Fatalf("expected PagekitError, got %T", err)
	}
	if pErr.Status != 401 {
		t.Errorf("Status = %d, want 401", pErr.Status)
	}
	if pErr.Code != "invalid_api_key" {
		t.Errorf("Code = %q, want %q", pErr.Code, "invalid_api_key")
	}
	if !pErr.IsAuthError() {
		t.Error("IsAuthError() = false, want true")
	}
}

func TestClient_RateLimited(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(t, w, 429, map[string]interface{}{
			"error": "Rate limited",
			"code":  "rate_limited",
		})
	})
	defer ts.Close()

	_, err := client.Posts.List(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
	var pErr *PagekitError
	if !errors.As(err, &pErr) {
		t.Fatalf("expected PagekitError, got %T", err)
	}
	if !pErr.IsRateLimited() {
		t.Error("IsRateLimited() = false, want true")
	}
}

func TestClient_ServerError(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(t, w, 500, map[string]interface{}{
			"error": "Internal error",
		})
	})
	defer ts.Close()

	_, err := client.Posts.List(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
	var pErr *PagekitError
	if !errors.As(err, &pErr) {
		t.Fatalf("expected PagekitError, got %T", err)
	}
	if !pErr.IsServerError() {
		t.Error("IsServerError() = false, want true")
	}
}

func TestPagekitError_Error(t *testing.T) {
	e := &PagekitError{Message: "not found", Status: 404, Code: "not_found"}
	got := e.Error()
	if got != "pagekit: not found (status 404, code: not_found)" {
		t.Errorf("Error() = %q", got)
	}
}

func TestPagekitError_NoStatus(t *testing.T) {
	e := &PagekitError{Message: "timeout", Code: "timeout"}
	got := e.Error()
	if got != "pagekit: timeout" {
		t.Errorf("Error() = %q", got)
	}
}

func TestClient_UserAgent(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		ua := r.Header.Get("User-Agent")
		if ua != "pagekit-go/"+Version {
			t.Errorf("User-Agent = %q, want %q", ua, "pagekit-go/"+Version)
		}
		writeJSON(t, w, 200, map[string]string{"ok": "true"})
	})
	defer ts.Close()

	_, err := client.Posts.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestClient_RetryOnServerError(t *testing.T) {
	attempts := 0
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		if attempts < 3 {
			writeJSON(t, w, 500, map[string]interface{}{"error": "temporary"})
			return
		}
		writeJSON(t, w, 200, Paginated[Post]{Data: []Post{}, Pagination: Pagination{}})
	})
	defer ts.Close()

	client.MaxRetries = 3
	result, err := client.Posts.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result == nil {
		t.Fatal("expected result")
	}
	if attempts != 3 {
		t.Errorf("attempts = %d, want 3", attempts)
	}
}

func TestClient_NoRetryOnAuthError(t *testing.T) {
	attempts := 0
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		writeJSON(t, w, 401, map[string]interface{}{"error": "unauthorized"})
	})
	defer ts.Close()

	client.MaxRetries = 3
	_, err := client.Posts.List(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
	if attempts != 1 {
		t.Errorf("attempts = %d, want 1 (no retry on auth error)", attempts)
	}
}

func TestClient_RetryAfterHeader(t *testing.T) {
	attempts := 0
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		if attempts == 1 {
			w.Header().Set("Retry-After", "1")
			writeJSON(t, w, 429, map[string]interface{}{"error": "rate limited"})
			return
		}
		writeJSON(t, w, 200, Paginated[Post]{Data: []Post{}, Pagination: Pagination{}})
	})
	defer ts.Close()

	client.MaxRetries = 1
	_, err := client.Posts.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if attempts != 2 {
		t.Errorf("attempts = %d, want 2", attempts)
	}
}

func TestWithMaxRetries(t *testing.T) {
	client, err := NewClient("pk_test", WithMaxRetries(5))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if client.MaxRetries != 5 {
		t.Errorf("MaxRetries = %d, want 5", client.MaxRetries)
	}
}

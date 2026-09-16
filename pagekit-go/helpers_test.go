package pagekit

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func newTestServer(handler http.HandlerFunc) (*httptest.Server, *Client) {
	ts := httptest.NewServer(handler)
	client, _ := NewClient("pk_live_test_key", WithBaseURL(ts.URL))
	return ts, client
}

func assertJSON(t *testing.T, r *http.Request, v interface{}) {
	t.Helper()
	body, err := io.ReadAll(r.Body)
	if err != nil {
		t.Fatalf("failed to read body: %v", err)
	}
	if err := json.Unmarshal(body, v); err != nil {
		t.Fatalf("failed to unmarshal body: %v", err)
	}
}

func assertAuth(t *testing.T, r *http.Request) {
	t.Helper()
	if got := r.Header.Get("Authorization"); got != "Bearer pk_live_test_key" {
		t.Errorf("Authorization = %q, want %q", got, "Bearer pk_live_test_key")
	}
}

func assertMethod(t *testing.T, r *http.Request, want string) {
	t.Helper()
	if r.Method != want {
		t.Errorf("Method = %q, want %q", r.Method, want)
	}
}

func assertPath(t *testing.T, r *http.Request, want string) {
	t.Helper()
	if r.URL.Path != want {
		t.Errorf("Path = %q, want %q", r.URL.Path, want)
	}
}

func writeJSON(t *testing.T, w http.ResponseWriter, status int, v interface{}) {
	t.Helper()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		t.Fatalf("failed to encode response: %v", err)
	}
}

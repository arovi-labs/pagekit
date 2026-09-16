package pagekit

import (
	"context"
	"net/http"
	"testing"
	"time"
)

func TestAuthors_List(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/authors")

		writeJSON(t, w, 200, Paginated[Author]{
			Data: []Author{
				{ID: "author_1", Name: "Shuence", CreatedAt: &now},
			},
			Pagination: Pagination{Page: 1, Total: 1},
		})
	})
	defer ts.Close()

	result, err := client.Authors.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(result.Data) != 1 {
		t.Fatalf("len(Data) = %d, want 1", len(result.Data))
	}
	if result.Data[0].Name != "Shuence" {
		t.Errorf("Name = %q, want %q", result.Data[0].Name, "Shuence")
	}
}

func TestAuthors_Get(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/authors/author_1")

		writeJSON(t, w, 200, Author{
			ID: "author_1", Name: "Shuence", CreatedAt: &now,
		})
	})
	defer ts.Close()

	author, err := client.Authors.Get(context.Background(), "author_1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if author.ID != "author_1" {
		t.Errorf("ID = %q, want %q", author.ID, "author_1")
	}
}

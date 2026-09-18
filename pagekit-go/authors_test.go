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

func TestAuthors_GetBySlug(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/authors/slug/shuence")

		writeJSON(t, w, 200, Author{
			ID: "author_1", Name: "Shuence", Slug: Ptr("shuence"),
		})
	})
	defer ts.Close()

	author, err := client.Authors.GetBySlug(context.Background(), "shuence")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if author.Slug == nil || *author.Slug != "shuence" {
		t.Errorf("Slug = %v, want shuence", author.Slug)
	}
}

func TestAuthors_Create(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "POST")
		assertPath(t, r, "/authors")

		writeJSON(t, w, 201, Author{
			ID: "author_2", Name: "Jane Doe", Slug: Ptr("jane-doe"),
		})
	})
	defer ts.Close()

	author, err := client.Authors.Create(context.Background(), AuthorCreateInput{
		Name: "Jane Doe",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if author.Name != "Jane Doe" {
		t.Errorf("Name = %q, want Jane Doe", author.Name)
	}
}

func TestAuthors_Update(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "PATCH")
		assertPath(t, r, "/authors/author_1")

		writeJSON(t, w, 200, Author{
			ID: "author_1", Name: "Shuence", Bio: Ptr("Editor"),
		})
	})
	defer ts.Close()

	author, err := client.Authors.Update(context.Background(), "author_1", AuthorUpdateInput{
		Bio: Ptr("Editor"),
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if author.Bio == nil || *author.Bio != "Editor" {
		t.Errorf("Bio = %v, want Editor", author.Bio)
	}
}

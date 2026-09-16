package pagekit

import (
	"context"
	"net/http"
	"testing"
	"time"
)

func TestPosts_List(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/posts")

		writeJSON(t, w, 200, Paginated[Post]{
			Data: []Post{
				{
					ID:    "post_1",
					Title: "Hello",
					Slug:  "hello",
					Status: PostStatusPublished,
					CreatedAt: now,
					UpdatedAt: now,
				},
			},
			Pagination: Pagination{
				Page: 1, Limit: 20, Total: 1, TotalPages: 1,
			},
		})
	})
	defer ts.Close()

	result, err := client.Posts.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(result.Data) != 1 {
		t.Fatalf("len(Data) = %d, want 1", len(result.Data))
	}
	if result.Data[0].Title != "Hello" {
		t.Errorf("Title = %q, want %q", result.Data[0].Title, "Hello")
	}
	if result.Pagination.Total != 1 {
		t.Errorf("Total = %d, want 1", result.Pagination.Total)
	}
}

func TestPosts_ListWithParams(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("status") != "published" {
			t.Errorf("status = %q, want %q", r.URL.Query().Get("status"), "published")
		}
		if r.URL.Query().Get("limit") != "10" {
			t.Errorf("limit = %q, want %q", r.URL.Query().Get("limit"), "10")
		}
		if r.URL.Query().Get("sort") != "-published_at" {
			t.Errorf("sort = %q, want %q", r.URL.Query().Get("sort"), "-published_at")
		}

		writeJSON(t, w, 200, Paginated[Post]{Data: []Post{}, Pagination: Pagination{}})
	})
	defer ts.Close()

	status := PostStatusPublished
	limit := 10
	sort := "-published_at"
	_, err := client.Posts.List(context.Background(), PostListParams{
		Status: &status,
		Limit:  &limit,
		Sort:   &sort,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestPosts_Get(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/posts/post_123")

		writeJSON(t, w, 200, Post{
			ID: "post_123", Title: "Test", Slug: "test",
			Status: PostStatusDraft, CreatedAt: now, UpdatedAt: now,
		})
	})
	defer ts.Close()

	post, err := client.Posts.Get(context.Background(), "post_123")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post.ID != "post_123" {
		t.Errorf("ID = %q, want %q", post.ID, "post_123")
	}
}

func TestPosts_GetBySlug(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/posts/slug/hello-world")

		writeJSON(t, w, 200, Post{
			ID: "post_1", Title: "Hello World", Slug: "hello-world",
			Status: PostStatusPublished, CreatedAt: now, UpdatedAt: now,
		})
	})
	defer ts.Close()

	post, err := client.Posts.GetBySlug(context.Background(), "hello-world")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post.Slug != "hello-world" {
		t.Errorf("Slug = %q, want %q", post.Slug, "hello-world")
	}
}

func TestPosts_Create(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "POST")
		assertPath(t, r, "/posts")

		var input PostCreateInput
		assertJSON(t, r, &input)
		if input.Title != "New Post" {
			t.Errorf("Title = %q, want %q", input.Title, "New Post")
		}

		writeJSON(t, w, 201, Post{
			ID: "post_new", Title: input.Title, Slug: "new-post",
			Status: PostStatusDraft, CreatedAt: now, UpdatedAt: now,
		})
	})
	defer ts.Close()

	status := PostStatusDraft
	post, err := client.Posts.Create(context.Background(), PostCreateInput{
		Title:  "New Post",
		Status: &status,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post.ID != "post_new" {
		t.Errorf("ID = %q, want %q", post.ID, "post_new")
	}
}

func TestPosts_Update(t *testing.T) {
	now := time.Now()
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "PATCH")
		assertPath(t, r, "/posts/post_123")

		var input PostUpdateInput
		assertJSON(t, r, &input)
		if input.Title == nil || *input.Title != "Updated" {
			t.Errorf("Title = %v, want %q", input.Title, "Updated")
		}

		writeJSON(t, w, 200, Post{
			ID: "post_123", Title: "Updated", Slug: "test",
			Status: PostStatusDraft, CreatedAt: now, UpdatedAt: now,
		})
	})
	defer ts.Close()

	title := "Updated"
	post, err := client.Posts.Update(context.Background(), "post_123", PostUpdateInput{
		Title: &title,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post.Title != "Updated" {
		t.Errorf("Title = %q, want %q", post.Title, "Updated")
	}
}

func TestPosts_Delete(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "DELETE")
		assertPath(t, r, "/posts/post_123")
		w.WriteHeader(http.StatusNoContent)
	})
	defer ts.Close()

	err := client.Posts.Delete(context.Background(), "post_123")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

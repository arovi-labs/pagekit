package pagekit

import (
	"context"
	"net/http"
	"testing"
)

func TestCategories_List(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/categories")

		writeJSON(t, w, 200, Paginated[Category]{
			Data: []Category{
				{ID: "cat_1", Name: "Engineering", Slug: "engineering"},
			},
			Pagination: Pagination{Page: 1, Total: 1},
		})
	})
	defer ts.Close()

	result, err := client.Categories.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(result.Data) != 1 {
		t.Fatalf("len(Data) = %d, want 1", len(result.Data))
	}
	if result.Data[0].Slug != "engineering" {
		t.Errorf("Slug = %q, want %q", result.Data[0].Slug, "engineering")
	}
}

func TestCategories_GetBySlug(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/categories/engineering")

		writeJSON(t, w, 200, Category{
			ID: "cat_1", Name: "Engineering", Slug: "engineering",
		})
	})
	defer ts.Close()

	cat, err := client.Categories.GetBySlug(context.Background(), "engineering")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cat.Name != "Engineering" {
		t.Errorf("Name = %q, want %q", cat.Name, "Engineering")
	}
}

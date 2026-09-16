package pagekit

import (
	"context"
	"net/http"
	"testing"
)

func TestTags_List(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/tags")

		writeJSON(t, w, 200, Paginated[Tag]{
			Data: []Tag{
				{ID: "tag_1", Name: "AI", Slug: "ai"},
				{ID: "tag_2", Name: "Go", Slug: "go"},
			},
			Pagination: Pagination{Page: 1, Total: 2},
		})
	})
	defer ts.Close()

	result, err := client.Tags.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(result.Data) != 2 {
		t.Fatalf("len(Data) = %d, want 2", len(result.Data))
	}
	if result.Data[0].Name != "AI" {
		t.Errorf("Name = %q, want %q", result.Data[0].Name, "AI")
	}
}

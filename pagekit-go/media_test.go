package pagekit

import (
	"context"
	"net/http"
	"testing"
)

func TestMedia_List(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "GET")
		assertPath(t, r, "/media")

		writeJSON(t, w, 200, Paginated[Media]{
			Data: []Media{
				{ID: "media_1", URL: "https://cdn.example.com/img.png", Filename: "img.png", MimeType: "image/png", Size: 1024},
			},
			Pagination: Pagination{Page: 1, Total: 1},
		})
	})
	defer ts.Close()

	result, err := client.Media.List(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(result.Data) != 1 {
		t.Fatalf("len(Data) = %d, want 1", len(result.Data))
	}
	if result.Data[0].Filename != "img.png" {
		t.Errorf("Filename = %q, want %q", result.Data[0].Filename, "img.png")
	}
}

func TestMedia_Create(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "POST")
		assertPath(t, r, "/media")

		var input MediaCreateInput
		assertJSON(t, r, &input)
		if input.URL != "https://cdn.example.com/photo.jpg" {
			t.Errorf("URL = %q, want %q", input.URL, "https://cdn.example.com/photo.jpg")
		}

		writeJSON(t, w, 201, Media{
			ID: "media_new", URL: input.URL, Filename: input.Filename, MimeType: input.MimeType, Size: input.Size,
		})
	})
	defer ts.Close()

	media, err := client.Media.Create(context.Background(), MediaCreateInput{
		URL:      "https://cdn.example.com/photo.jpg",
		Filename: "photo.jpg",
		MimeType: "image/jpeg",
		Size:     2048,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if media.ID != "media_new" {
		t.Errorf("ID = %q, want %q", media.ID, "media_new")
	}
}

func TestMedia_Delete(t *testing.T) {
	ts, client := newTestServer(func(w http.ResponseWriter, r *http.Request) {
		assertMethod(t, r, "DELETE")
		assertPath(t, r, "/media/media_1")
		w.WriteHeader(http.StatusNoContent)
	})
	defer ts.Close()

	err := client.Media.Delete(context.Background(), "media_1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

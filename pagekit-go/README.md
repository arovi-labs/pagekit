# PageKit Go Client

Go client for the [PageKit](https://pagekit.app) content API.

## Installation

```bash
go get github.com/arovi-labs/pagekit-go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"

    pagekit "github.com/arovi-labs/pagekit-go"
)

func main() {
    client, err := pagekit.NewClient("pk_live_your_api_key")
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    // List published posts
    posts, err := client.Posts.List(ctx, pagekit.PostListParams{
        Status: pagekit.Ptr(pagekit.PostStatusPublished),
    })
    if err != nil {
        log.Fatal(err)
    }

    for _, post := range posts.Data {
        fmt.Printf("%s — %s\n", post.Title, post.Slug)
    }
}
```

## Usage

### Posts

```go
// List posts with filters
posts, err := client.Posts.List(ctx, pagekit.PostListParams{
    Status: pagekit.Ptr(pagekit.PostStatusPublished),
    Limit:  pagekit.Ptr(10),
    Sort:   pagekit.Ptr("-published_at"),
})

// Get a post by ID
post, err := client.Posts.Get(ctx, "post_123")

// Get a post by slug
post, err := client.Posts.GetBySlug(ctx, "my-first-post")

// Create a post
post, err := client.Posts.Create(ctx, pagekit.PostCreateInput{
    Title:   "Hello World",
    Content: pagekit.Ptr("# Hello\n\nThis is my first post."),
    Status:  pagekit.Ptr(pagekit.PostStatusPublished),
})

// Update a post
post, err := client.Posts.Update(ctx, "post_123", pagekit.PostUpdateInput{
    Title: pagekit.Ptr("Updated Title"),
})

// Delete a post
err = client.Posts.Delete(ctx, "post_123")
```

### Authors

```go
// List authors
authors, err := client.Authors.List(ctx)

// Get an author
author, err := client.Authors.Get(ctx, "author_1")
```

### Categories

```go
// List categories
categories, err := client.Categories.List(ctx)

// Get by slug
category, err := client.Categories.GetBySlug(ctx, "engineering")
```

### Tags

```go
// List tags
tags, err := client.Tags.List(ctx)
```

### Media

```go
// List media
media, err := client.Media.List(ctx)

// Register a media asset
asset, err := client.Media.Create(ctx, pagekit.MediaCreateInput{
    URL:      "https://example.com/image.png",
    Filename: "image.png",
    MimeType: "image/png",
    Size:     1024,
})

// Delete media
err = client.Media.Delete(ctx, "media_123")
```

### Error Handling

```go
posts, err := client.Posts.List(ctx)
if err != nil {
    var pErr *pagekit.PagekitError
    if errors.As(err, &pErr) {
        fmt.Printf("Status: %d, Code: %s\n", pErr.Status, pErr.Code)
        fmt.Printf("Auth error: %v\n", pErr.IsAuthError())
        fmt.Printf("Rate limited: %v\n", pErr.IsRateLimited())
        fmt.Printf("Server error: %v\n", pErr.IsServerError())
    }
}
```

### Configuration

```go
// Custom base URL (self-hosted)
client, err := pagekit.NewClient("pk_live_...",
    pagekit.WithBaseURL("https://my-instance.pagekit.app/v1"),
)

// Custom HTTP client
client, err := pagekit.NewClient("pk_live_...",
    pagekit.WithHTTPClient(&http.Client{
        Timeout: 10 * time.Second,
    }),
)

// Custom timeout
client, err := pagekit.NewClient("pk_live_...",
    pagekit.WithTimeout(5 * time.Second),
)
```

## Helper

Use `pagekit.Ptr()` to create pointers for optional fields:

```go
status := pagekit.Ptr(pagekit.PostStatusPublished)
limit := pagekit.Ptr(20)
```

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)

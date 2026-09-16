package pagekit

import (
	"context"
	"fmt"
	"net/url"
)

type PostsService struct {
	client *Client
}

func (s *PostsService) List(ctx context.Context, params ...PostListParams) (*Paginated[Post], error) {
	var p PostListParams
	if len(params) > 0 {
		p = params[0]
	}

	values := buildParams(map[string]interface{}{
		"status":   p.Status,
		"category": p.Category,
		"tag":      p.Tag,
		"author":   p.Author,
		"search":   p.Search,
		"page":     p.Page,
		"limit":    p.Limit,
		"sort":     p.Sort,
	})

	var result Paginated[Post]
	if err := s.client.get(ctx, "/posts", values, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *PostsService) Get(ctx context.Context, id string) (*Post, error) {
	var result Post
	if err := s.client.get(ctx, fmt.Sprintf("/posts/%s", url.PathEscape(id)), nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *PostsService) GetBySlug(ctx context.Context, slug string) (*Post, error) {
	var result Post
	if err := s.client.get(ctx, fmt.Sprintf("/posts/slug/%s", url.PathEscape(slug)), nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *PostsService) Create(ctx context.Context, input PostCreateInput) (*Post, error) {
	var result Post
	if err := s.client.post(ctx, "/posts", input, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *PostsService) Update(ctx context.Context, id string, input PostUpdateInput) (*Post, error) {
	var result Post
	if err := s.client.patch(ctx, fmt.Sprintf("/posts/%s", url.PathEscape(id)), input, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *PostsService) Delete(ctx context.Context, id string) error {
	return s.client.delete(ctx, fmt.Sprintf("/posts/%s", url.PathEscape(id)))
}

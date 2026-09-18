package pagekit

import (
	"context"
	"fmt"
	"net/url"
)

type AuthorsService struct {
	client *Client
}

func (s *AuthorsService) List(ctx context.Context, params ...AuthorListParams) (*Paginated[Author], error) {
	var p AuthorListParams
	if len(params) > 0 {
		p = params[0]
	}

	values := buildParams(map[string]interface{}{
		"page":  p.Page,
		"limit": p.Limit,
		"sort":  p.Sort,
	})

	var result Paginated[Author]
	if err := s.client.get(ctx, "/authors", values, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *AuthorsService) Get(ctx context.Context, id string) (*Author, error) {
	var result Author
	if err := s.client.get(ctx, fmt.Sprintf("/authors/%s", url.PathEscape(id)), nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *AuthorsService) GetBySlug(ctx context.Context, slug string) (*Author, error) {
	var result Author
	if err := s.client.get(ctx, fmt.Sprintf("/authors/slug/%s", url.PathEscape(slug)), nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *AuthorsService) Create(ctx context.Context, input AuthorCreateInput) (*Author, error) {
	var result Author
	if err := s.client.post(ctx, "/authors", input, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *AuthorsService) Update(ctx context.Context, id string, input AuthorUpdateInput) (*Author, error) {
	var result Author
	if err := s.client.patch(ctx, fmt.Sprintf("/authors/%s", url.PathEscape(id)), input, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

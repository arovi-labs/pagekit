package pagekit

import (
	"context"
	"fmt"
	"net/url"
)

type MediaService struct {
	client *Client
}

func (s *MediaService) List(ctx context.Context, params ...MediaListParams) (*Paginated[Media], error) {
	var p MediaListParams
	if len(params) > 0 {
		p = params[0]
	}

	values := buildParams(map[string]interface{}{
		"page":  p.Page,
		"limit": p.Limit,
		"sort":  p.Sort,
	})

	var result Paginated[Media]
	if err := s.client.get(ctx, "/media", values, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *MediaService) Create(ctx context.Context, input MediaCreateInput) (*Media, error) {
	var result Media
	if err := s.client.post(ctx, "/media", input, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *MediaService) Delete(ctx context.Context, id string) error {
	return s.client.delete(ctx, fmt.Sprintf("/media/%s", url.PathEscape(id)))
}

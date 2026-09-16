package pagekit

import (
	"context"
	"fmt"
	"net/url"
)

type CategoriesService struct {
	client *Client
}

func (s *CategoriesService) List(ctx context.Context, params ...CategoryListParams) (*Paginated[Category], error) {
	var p CategoryListParams
	if len(params) > 0 {
		p = params[0]
	}

	values := buildParams(map[string]interface{}{
		"page":  p.Page,
		"limit": p.Limit,
		"sort":  p.Sort,
	})

	var result Paginated[Category]
	if err := s.client.get(ctx, "/categories", values, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *CategoriesService) GetBySlug(ctx context.Context, slug string) (*Category, error) {
	var result Category
	if err := s.client.get(ctx, fmt.Sprintf("/categories/%s", url.PathEscape(slug)), nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

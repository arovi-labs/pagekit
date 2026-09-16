package pagekit

import "context"

type TagsService struct {
	client *Client
}

func (s *TagsService) List(ctx context.Context, params ...TagListParams) (*Paginated[Tag], error) {
	var p TagListParams
	if len(params) > 0 {
		p = params[0]
	}

	values := buildParams(map[string]interface{}{
		"page":  p.Page,
		"limit": p.Limit,
		"sort":  p.Sort,
	})

	var result Paginated[Tag]
	if err := s.client.get(ctx, "/tags", values, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

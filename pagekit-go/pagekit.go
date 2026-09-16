package pagekit

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

const (
	DefaultBaseURL = "https://api.pagekit.app/v1"
	Version        = "0.1.0"
	userAgent      = "pagekit-go/" + Version
	maxRetries     = 3
)

type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
	MaxRetries int

	Posts      *PostsService
	Authors    *AuthorsService
	Categories *CategoriesService
	Tags       *TagsService
	Media      *MediaService
}

type ClientOption func(*Client)

func WithBaseURL(baseURL string) ClientOption {
	return func(c *Client) {
		c.BaseURL = strings.TrimRight(baseURL, "/")
	}
}

func WithHTTPClient(httpClient *http.Client) ClientOption {
	return func(c *Client) {
		c.HTTPClient = httpClient
	}
}

func WithTimeout(timeout time.Duration) ClientOption {
	return func(c *Client) {
		c.HTTPClient.Timeout = timeout
	}
}

func WithMaxRetries(n int) ClientOption {
	return func(c *Client) {
		c.MaxRetries = n
	}
}

func NewClient(apiKey string, opts ...ClientOption) (*Client, error) {
	if apiKey == "" {
		return nil, &PagekitError{
			Message: "A Pagekit API key is required. Create one in Project → Developer → API keys.",
			Code:    "missing_api_key",
		}
	}

	c := &Client{
		APIKey:  apiKey,
		BaseURL: DefaultBaseURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		MaxRetries: maxRetries,
	}

	for _, opt := range opts {
		opt(c)
	}

	c.Posts = &PostsService{client: c}
	c.Authors = &AuthorsService{client: c}
	c.Categories = &CategoriesService{client: c}
	c.Tags = &TagsService{client: c}
	c.Media = &MediaService{client: c}

	return c, nil
}

func (c *Client) get(ctx context.Context, path string, params url.Values, result interface{}) error {
	return c.do(ctx, http.MethodGet, path, params, nil, result)
}

func (c *Client) post(ctx context.Context, path string, body interface{}, result interface{}) error {
	return c.do(ctx, http.MethodPost, path, nil, body, result)
}

func (c *Client) patch(ctx context.Context, path string, body interface{}, result interface{}) error {
	return c.do(ctx, http.MethodPatch, path, nil, body, result)
}

func (c *Client) delete(ctx context.Context, path string) error {
	return c.do(ctx, http.MethodDelete, path, nil, nil, nil)
}

func (c *Client) do(ctx context.Context, method, path string, params url.Values, body interface{}, result interface{}) error {
	var lastErr error

	for attempt := 0; attempt <= c.MaxRetries; attempt++ {
		if attempt > 0 {
			backoff := c.retryBackoff(attempt, lastErr)
			select {
			case <-ctx.Done():
				return &PagekitError{
					Message: "context cancelled during retry backoff",
					Code:    "context_cancelled",
				}
			case <-time.After(backoff):
			}
		}

		err := c.doOnce(ctx, method, path, params, body, result)
		if err == nil {
			return nil
		}

		lastErr = err

		var pErr *PagekitError
		if !errors.As(err, &pErr) || !pErr.IsRetryable() {
			return err
		}
		if attempt >= c.MaxRetries {
			return err
		}
	}

	return lastErr
}

func (c *Client) retryBackoff(attempt int, err error) time.Duration {
	var retryAfter time.Duration
	if pErr, ok := err.(*PagekitError); ok {
		retryAfter = pErr.RetryAfter
	}

	if retryAfter > 0 {
		return retryAfter
	}

	backoff := time.Duration(math.Pow(2, float64(attempt))) * time.Second
	if backoff > 30*time.Second {
		backoff = 30 * time.Second
	}
	return backoff
}

func (c *Client) doOnce(ctx context.Context, method, path string, params url.Values, body interface{}, result interface{}) error {
	u := fmt.Sprintf("%s%s", c.BaseURL, path)
	if params != nil && len(params) > 0 {
		u += "?" + params.Encode()
	}

	var bodyReader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return &PagekitError{
				Message: fmt.Sprintf("failed to marshal request body: %v", err),
				Code:    "marshal_error",
			}
		}
		bodyReader = bytes.NewReader(data)
	}

	req, err := http.NewRequestWithContext(ctx, method, u, bodyReader)
	if err != nil {
		return &PagekitError{
			Message: fmt.Sprintf("failed to create request: %v", err),
			Code:    "request_error",
		}
	}

	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", userAgent)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return &PagekitError{
				Message: "request timed out",
				Code:    "timeout",
			}
		}
		return &PagekitError{
			Message: fmt.Sprintf("network request failed: %v", err),
			Code:    "network_error",
		}
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return &PagekitError{
			Message: fmt.Sprintf("failed to read response body: %v", err),
			Code:    "read_error",
		}
	}

	requestID := resp.Header.Get("X-Request-Id")

	if resp.StatusCode == http.StatusNoContent {
		return nil
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var errPayload struct {
			Error   string `json:"error"`
			Message string `json:"message"`
			Code    string `json:"code"`
		}
		if len(respBody) > 0 {
			_ = json.Unmarshal(respBody, &errPayload)
		}

		message := errPayload.Error
		if message == "" {
			message = errPayload.Message
		}
		if message == "" {
			message = fmt.Sprintf("request failed with status %d", resp.StatusCode)
		}
		code := errPayload.Code
		if code == "" {
			code = "api_error"
		}

		pErr := &PagekitError{
			Message:   message,
			Status:    resp.StatusCode,
			Code:      code,
			Details:   respBody,
			RequestID: requestID,
		}

		if resp.StatusCode == http.StatusTooManyRequests {
			pErr.RateLimit = true
			if retryAfter := resp.Header.Get("Retry-After"); retryAfter != "" {
				if secs, err := strconv.Atoi(retryAfter); err == nil {
					pErr.RetryAfter = time.Duration(secs) * time.Second
				}
			}
		}

		return pErr
	}

	if result != nil && len(respBody) > 0 {
		if err := json.Unmarshal(respBody, result); err != nil {
			return &PagekitError{
				Message:   fmt.Sprintf("failed to decode response: %v", err),
				Code:      "decode_error",
				RequestID: requestID,
			}
		}
	}

	return nil
}

func buildParams(values map[string]interface{}) url.Values {
	params := url.Values{}
	for k, v := range values {
		if v == nil {
			continue
		}
		switch val := v.(type) {
		case string:
			if val != "" {
				params.Set(k, val)
			}
		case int:
			params.Set(k, fmt.Sprintf("%d", val))
		case *string:
			if val != nil && *val != "" {
				params.Set(k, *val)
			}
		case *int:
			if val != nil {
				params.Set(k, fmt.Sprintf("%d", *val))
			}
		case PostStatus:
			params.Set(k, string(val))
		case *PostStatus:
			if val != nil {
				params.Set(k, string(*val))
			}
		}
	}
	return params
}

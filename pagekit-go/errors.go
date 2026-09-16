package pagekit

import (
	"fmt"
	"time"
)

type PagekitError struct {
	Message   string
	Status    int
	Code      string
	Details   interface{}
	RequestID string

	RateLimit     bool
	RetryAfter    time.Duration
}

func (e *PagekitError) Error() string {
	if e.Status > 0 {
		return fmt.Sprintf("pagekit: %s (status %d, code: %s)", e.Message, e.Status, e.Code)
	}
	return fmt.Sprintf("pagekit: %s", e.Message)
}

func (e *PagekitError) IsAuthError() bool {
	return e.Status == 401 || e.Status == 403
}

func (e *PagekitError) IsRateLimited() bool {
	return e.Status == 429
}

func (e *PagekitError) IsServerError() bool {
	return e.Status >= 500
}

func (e *PagekitError) IsRetryable() bool {
	return e.IsRateLimited() || e.IsServerError()
}

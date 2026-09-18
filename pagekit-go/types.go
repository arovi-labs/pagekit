package pagekit

import "time"

// Ptr returns a pointer to the given value. Useful for optional fields.
func Ptr[T any](v T) *T {
	return &v
}

type PostStatus string

const (
	PostStatusDraft     PostStatus = "draft"
	PostStatusScheduled PostStatus = "scheduled"
	PostStatusPublished PostStatus = "published"
	PostStatusArchived  PostStatus = "archived"
)

type SEO struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	CanonicalURL *string `json:"canonicalUrl"`
	OGImage     *string `json:"ogImage"`
}

type Author struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Slug      *string    `json:"slug,omitempty"`
	UserID    *string    `json:"userId,omitempty"`
	Email     *string    `json:"email,omitempty"`
	Bio       *string    `json:"bio,omitempty"`
	AvatarURL *string    `json:"avatarUrl,omitempty"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
}

type AuthorCreateInput struct {
	Name      string  `json:"name"`
	Slug      *string `json:"slug,omitempty"`
	UserID    *string `json:"userId,omitempty"`
	Email     *string `json:"email,omitempty"`
	Bio       *string `json:"bio,omitempty"`
	AvatarURL *string `json:"avatarUrl,omitempty"`
}

type AuthorUpdateInput struct {
	Name      *string `json:"name,omitempty"`
	Slug      *string `json:"slug,omitempty"`
	UserID    *string `json:"userId,omitempty"`
	Email     *string `json:"email,omitempty"`
	Bio       *string `json:"bio,omitempty"`
	AvatarURL *string `json:"avatarUrl,omitempty"`
}

type AuthorRef struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Category struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	Description *string `json:"description,omitempty"`
}

type CategoryRef struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Media struct {
	ID        string     `json:"id"`
	URL       string     `json:"url"`
	Filename  string     `json:"filename"`
	MimeType  string     `json:"mimeType"`
	Size      int64      `json:"size"`
	Width     *int       `json:"width,omitempty"`
	Height    *int       `json:"height,omitempty"`
	Alt       *string    `json:"alt,omitempty"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
}

type Post struct {
	ID           string       `json:"id"`
	Title        string       `json:"title"`
	Slug         string       `json:"slug"`
	Content      string       `json:"content"`
	Excerpt      *string      `json:"excerpt"`
	CoverImage   *string      `json:"coverImage"`
	Status       PostStatus   `json:"status"`
	PublishedAt  *time.Time   `json:"publishedAt"`
	ScheduledFor *time.Time   `json:"scheduledFor"`
	Author       *AuthorRef   `json:"author"`
	Category     *CategoryRef `json:"category"`
	Tags         []string     `json:"tags"`
	SEO          SEO          `json:"seo"`
	CreatedAt    time.Time    `json:"createdAt"`
	UpdatedAt    time.Time    `json:"updatedAt"`
}

type Pagination struct {
	Page           int  `json:"page"`
	Limit          int  `json:"limit"`
	Total          int  `json:"total"`
	TotalPages     int  `json:"totalPages"`
	HasNextPage    bool `json:"hasNextPage"`
	HasPreviousPage bool `json:"hasPreviousPage"`
}

type Paginated[T any] struct {
	Data       []T        `json:"data"`
	Pagination Pagination `json:"pagination"`
}

type PostListParams struct {
	Status   *PostStatus `json:"status,omitempty"`
	Category *string     `json:"category,omitempty"`
	Tag      *string     `json:"tag,omitempty"`
	Author   *string     `json:"author,omitempty"`
	Search   *string     `json:"search,omitempty"`
	Page     *int        `json:"page,omitempty"`
	Limit    *int        `json:"limit,omitempty"`
	Sort     *string     `json:"sort,omitempty"`
}

type PostCreateInput struct {
	Title          string      `json:"title"`
	Content        *string     `json:"content,omitempty"`
	Slug           *string     `json:"slug,omitempty"`
	Excerpt        *string     `json:"excerpt,omitempty"`
	CoverImage     *string     `json:"coverImage,omitempty"`
	Status         *PostStatus `json:"status,omitempty"`
	AuthorID       *string     `json:"authorId,omitempty"`
	CategoryID     *string     `json:"categoryId,omitempty"`
	Tags           []string    `json:"tags,omitempty"`
	SEOTitle       *string     `json:"seoTitle,omitempty"`
	SEODescription *string     `json:"seoDescription,omitempty"`
	CanonicalURL   *string     `json:"canonicalUrl,omitempty"`
	OGImage        *string     `json:"ogImage,omitempty"`
	PublishedAt    *time.Time  `json:"publishedAt,omitempty"`
	ScheduledFor   *time.Time  `json:"scheduledFor,omitempty"`
}

type PostUpdateInput struct {
	Title          *string     `json:"title,omitempty"`
	Content        *string     `json:"content,omitempty"`
	Slug           *string     `json:"slug,omitempty"`
	Excerpt        *string     `json:"excerpt,omitempty"`
	CoverImage     *string     `json:"coverImage,omitempty"`
	Status         *PostStatus `json:"status,omitempty"`
	AuthorID       *string     `json:"authorId,omitempty"`
	CategoryID     *string     `json:"categoryId,omitempty"`
	Tags           []string    `json:"tags,omitempty"`
	SEOTitle       *string     `json:"seoTitle,omitempty"`
	SEODescription *string     `json:"seoDescription,omitempty"`
	CanonicalURL   *string     `json:"canonicalUrl,omitempty"`
	OGImage        *string     `json:"ogImage,omitempty"`
	PublishedAt    *time.Time  `json:"publishedAt,omitempty"`
	ScheduledFor   *time.Time  `json:"scheduledFor,omitempty"`
}

type CategoryListParams struct {
	Page  *int    `json:"page,omitempty"`
	Limit *int    `json:"limit,omitempty"`
	Sort  *string `json:"sort,omitempty"`
}

type TagListParams struct {
	Page  *int    `json:"page,omitempty"`
	Limit *int    `json:"limit,omitempty"`
	Sort  *string `json:"sort,omitempty"`
}

type AuthorListParams struct {
	Page  *int    `json:"page,omitempty"`
	Limit *int    `json:"limit,omitempty"`
	Sort  *string `json:"sort,omitempty"`
}

type MediaListParams struct {
	Page  *int    `json:"page,omitempty"`
	Limit *int    `json:"limit,omitempty"`
	Sort  *string `json:"sort,omitempty"`
}

type MediaCreateInput struct {
	URL      string `json:"url"`
	Filename string `json:"filename"`
	MimeType string `json:"mimeType"`
	Size     int64  `json:"size"`
	Width    *int   `json:"width,omitempty"`
	Height   *int   `json:"height,omitempty"`
	Alt      *string `json:"alt,omitempty"`
}

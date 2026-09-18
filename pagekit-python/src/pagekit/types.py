from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Generic, Literal, TypeVar

T = TypeVar("T")


class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"


@dataclass
class Seo:
    title: str | None = None
    description: str | None = None
    canonical_url: str | None = None
    og_image: str | None = None


@dataclass
class Author:
    id: str
    name: str
    slug: str | None = None
    user_id: str | None = None
    email: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


@dataclass
class AuthorCreateInput:
    name: str
    slug: str | None = None
    user_id: str | None = None
    email: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


@dataclass
class AuthorUpdateInput:
    name: str | None = None
    slug: str | None = None
    user_id: str | None = None
    email: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


@dataclass
class Category:
    id: str
    name: str
    slug: str
    description: str | None = None


@dataclass
class Tag:
    id: str
    name: str
    slug: str


@dataclass
class Media:
    id: str
    url: str
    filename: str
    mime_type: str
    size: int
    width: int | None = None
    height: int | None = None
    alt: str | None = None
    created_at: str | None = None


@dataclass
class AuthorRef:
    id: str
    name: str


@dataclass
class CategoryRef:
    id: str
    name: str
    slug: str


@dataclass
class Post:
    id: str
    title: str
    slug: str
    content: str
    excerpt: str | None = None
    cover_image: str | None = None
    status: PostStatus = PostStatus.DRAFT
    published_at: str | None = None
    scheduled_for: str | None = None
    author: AuthorRef | None = None
    category: CategoryRef | None = None
    tags: list[str] = field(default_factory=list)
    seo: Seo = field(default_factory=Seo)
    created_at: str = ""
    updated_at: str = ""


@dataclass
class Pagination:
    page: int
    limit: int
    total: int
    total_pages: int
    has_next_page: bool
    has_previous_page: bool


@dataclass
class Paginated(Generic[T]):
    data: list[T]
    pagination: Pagination


@dataclass
class PostCreateInput:
    title: str
    content: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    cover_image: str | None = None
    status: PostStatus | None = None
    author_id: str | None = None
    category_id: str | None = None
    tags: list[str] | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    canonical_url: str | None = None
    og_image: str | None = None
    published_at: str | None = None
    scheduled_for: str | None = None


@dataclass
class PostUpdateInput:
    title: str | None = None
    content: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    cover_image: str | None = None
    status: PostStatus | None = None
    author_id: str | None = None
    category_id: str | None = None
    tags: list[str] | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    canonical_url: str | None = None
    og_image: str | None = None
    published_at: str | None = None
    scheduled_for: str | None = None


@dataclass
class PostListParams:
    status: PostStatus | None = None
    category: str | None = None
    tag: str | None = None
    author: str | None = None
    search: str | None = None
    page: int | None = None
    limit: int | None = None
    sort: str | None = None


@dataclass
class CategoryListParams:
    page: int | None = None
    limit: int | None = None
    sort: str | None = None


@dataclass
class TagListParams:
    page: int | None = None
    limit: int | None = None
    sort: str | None = None


@dataclass
class AuthorListParams:
    page: int | None = None
    limit: int | None = None
    sort: str | None = None


@dataclass
class MediaListParams:
    page: int | None = None
    limit: int | None = None
    sort: str | None = None


@dataclass
class MediaCreateInput:
    url: str
    filename: str
    mime_type: str
    size: int
    width: int | None = None
    height: int | None = None
    alt: str | None = None

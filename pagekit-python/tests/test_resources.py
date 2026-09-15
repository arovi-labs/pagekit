from __future__ import annotations

import httpx
import respx

from pagekit import Pagekit, PagekitError
from pagekit.types import (
    AuthorListParams,
    MediaCreateInput,
    PostCreateInput,
    PostListParams,
    PostStatus,
    PostUpdateInput,
)

API_KEY = "pk_test_123"


@respx.mock
def test_posts_list():
    respx.get("https://api.pagekit.cc/v1/posts").mock(
        return_value=httpx.Response(200, json={"data": [], "pagination": {"page": 1, "limit": 10, "total": 0, "totalPages": 0, "hasNextPage": False, "hasPreviousPage": False}})
    )
    client = Pagekit(api_key=API_KEY)
    result = client.posts.list(PostListParams(status=PostStatus.PUBLISHED, limit=5))
    assert result.data == []
    assert result.pagination.page == 1
    client.close()


@respx.mock
def test_posts_get():
    respx.get("https://api.pagekit.cc/v1/posts/123").mock(
        return_value=httpx.Response(200, json={"id": "123", "title": "Test", "slug": "test", "content": "", "status": "published", "createdAt": "2024-01-01", "updatedAt": "2024-01-01", "tags": [], "seo": {}})
    )
    client = Pagekit(api_key=API_KEY)
    post = client.posts.get("123")
    assert post.id == "123"
    assert post.title == "Test"
    client.close()


@respx.mock
def test_posts_get_by_slug():
    respx.get("https://api.pagekit.cc/v1/posts/slug/hello").mock(
        return_value=httpx.Response(200, json={"id": "1", "title": "Hello", "slug": "hello", "content": "", "status": "published", "createdAt": "2024-01-01", "updatedAt": "2024-01-01", "tags": [], "seo": {}})
    )
    client = Pagekit(api_key=API_KEY)
    post = client.posts.get_by_slug("hello")
    assert post.slug == "hello"
    client.close()


@respx.mock
def test_posts_create():
    respx.post("https://api.pagekit.cc/v1/posts").mock(
        return_value=httpx.Response(200, json={"id": "new", "title": "New Post", "slug": "new-post", "content": "Hello", "status": "draft", "createdAt": "2024-01-01", "updatedAt": "2024-01-01", "tags": [], "seo": {}})
    )
    client = Pagekit(api_key=API_KEY)
    post = client.posts.create(PostCreateInput(title="New Post", content="Hello"))
    assert post.id == "new"
    client.close()


@respx.mock
def test_posts_update():
    respx.patch("https://api.pagekit.cc/v1/posts/123").mock(
        return_value=httpx.Response(200, json={"id": "123", "title": "Updated", "slug": "test", "content": "", "status": "draft", "createdAt": "2024-01-01", "updatedAt": "2024-01-01", "tags": [], "seo": {}})
    )
    client = Pagekit(api_key=API_KEY)
    post = client.posts.update("123", PostUpdateInput(title="Updated"))
    assert post.title == "Updated"
    client.close()


@respx.mock
def test_posts_delete():
    respx.delete("https://api.pagekit.cc/v1/posts/123").mock(
        return_value=httpx.Response(204)
    )
    client = Pagekit(api_key=API_KEY)
    client.posts.delete("123")
    client.close()


@respx.mock
def test_authors_list():
    respx.get("https://api.pagekit.cc/v1/authors").mock(
        return_value=httpx.Response(200, json={"data": [], "pagination": {"page": 1, "limit": 10, "total": 0, "totalPages": 0, "hasNextPage": False, "hasPreviousPage": False}})
    )
    client = Pagekit(api_key=API_KEY)
    result = client.authors.list()
    assert result.data == []
    client.close()


@respx.mock
def test_authors_get():
    respx.get("https://api.pagekit.cc/v1/authors/a1").mock(
        return_value=httpx.Response(200, json={"id": "a1", "name": "Alice"})
    )
    client = Pagekit(api_key=API_KEY)
    author = client.authors.get("a1")
    assert author.id == "a1"
    client.close()


@respx.mock
def test_categories_list():
    respx.get("https://api.pagekit.cc/v1/categories").mock(
        return_value=httpx.Response(200, json={"data": [], "pagination": {"page": 1, "limit": 10, "total": 0, "totalPages": 0, "hasNextPage": False, "hasPreviousPage": False}})
    )
    client = Pagekit(api_key=API_KEY)
    result = client.categories.list()
    assert result.data == []
    client.close()


@respx.mock
def test_categories_get_by_slug():
    respx.get("https://api.pagekit.cc/v1/categories/engineering").mock(
        return_value=httpx.Response(200, json={"id": "c1", "name": "Engineering", "slug": "engineering"})
    )
    client = Pagekit(api_key=API_KEY)
    cat = client.categories.get_by_slug("engineering")
    assert cat.slug == "engineering"
    client.close()


@respx.mock
def test_tags_list():
    respx.get("https://api.pagekit.cc/v1/tags").mock(
        return_value=httpx.Response(200, json={"data": [], "pagination": {"page": 1, "limit": 10, "total": 0, "totalPages": 0, "hasNextPage": False, "hasPreviousPage": False}})
    )
    client = Pagekit(api_key=API_KEY)
    result = client.tags.list()
    assert result.data == []
    client.close()


@respx.mock
def test_media_list():
    respx.get("https://api.pagekit.cc/v1/media").mock(
        return_value=httpx.Response(200, json={"data": [], "pagination": {"page": 1, "limit": 10, "total": 0, "totalPages": 0, "hasNextPage": False, "hasPreviousPage": False}})
    )
    client = Pagekit(api_key=API_KEY)
    result = client.media.list()
    assert result.data == []
    client.close()


@respx.mock
def test_media_create():
    respx.post("https://api.pagekit.cc/v1/media").mock(
        return_value=httpx.Response(200, json={"id": "m1", "url": "https://example.com/img.png", "filename": "img.png", "mimeType": "image/png", "size": 1024})
    )
    client = Pagekit(api_key=API_KEY)
    media = client.media.create(MediaCreateInput(url="https://example.com/img.png", filename="img.png", mime_type="image/png", size=1024))
    assert media.id == "m1"
    client.close()


@respx.mock
def test_media_delete():
    respx.delete("https://api.pagekit.cc/v1/media/m1").mock(
        return_value=httpx.Response(204)
    )
    client = Pagekit(api_key=API_KEY)
    client.media.delete("m1")
    client.close()


@respx.mock
def test_error_response():
    respx.get("https://api.pagekit.cc/v1/posts/999").mock(
        return_value=httpx.Response(404, json={"error": {"message": "Not found", "code": "not_found"}})
    )
    client = Pagekit(api_key=API_KEY)
    try:
        client.posts.get("999")
        assert False, "Should have raised"
    except PagekitError as e:
        assert e.status == 404
        assert e.code == "not_found"
    client.close()

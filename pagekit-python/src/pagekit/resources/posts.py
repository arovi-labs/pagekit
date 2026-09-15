from __future__ import annotations

from urllib.parse import quote

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import (
    Author,
    AuthorListParams,
    Paginated,
    Pagination,
    Post,
    PostCreateInput,
    PostListParams,
    PostUpdateInput,
)


class AsyncPostsResource:
    def __init__(self, http: AsyncHttpClient) -> None:
        self._http = http

    async def list(self, params: PostListParams | None = None) -> Paginated[Post]:
        query = _build_query(params) if params else {}
        raw = await self._http.request("/posts", query=query)
        return Paginated(
            data=[_deserialize(p, Post) for p in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    async def get(self, id: str) -> Post:
        raw = await self._http.request(f"/posts/{quote(id, safe='')}")
        return _deserialize(raw, Post)

    async def get_by_slug(self, slug: str) -> Post:
        raw = await self._http.request(f"/posts/slug/{quote(slug, safe='')}")
        return _deserialize(raw, Post)

    async def create(self, input: PostCreateInput) -> Post:
        raw = await self._http.request("/posts", method="POST", body=input)
        return _deserialize(raw, Post)

    async def update(self, id: str, input: PostUpdateInput) -> Post:
        raw = await self._http.request(f"/posts/{quote(id, safe='')}", method="PATCH", body=input)
        return _deserialize(raw, Post)

    async def delete(self, id: str) -> None:
        await self._http.request(f"/posts/{quote(id, safe='')}", method="DELETE")


class SyncPostsResource:
    def __init__(self, http: SyncHttpClient) -> None:
        self._http = http

    def list(self, params: PostListParams | None = None) -> Paginated[Post]:
        query = _build_query(params) if params else {}
        raw = self._http.request("/posts", query=query)
        return Paginated(
            data=[_deserialize(p, Post) for p in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    def get(self, id: str) -> Post:
        raw = self._http.request(f"/posts/{quote(id, safe='')}")
        return _deserialize(raw, Post)

    def get_by_slug(self, slug: str) -> Post:
        raw = self._http.request(f"/posts/slug/{quote(slug, safe='')}")
        return _deserialize(raw, Post)

    def create(self, input: PostCreateInput) -> Post:
        raw = self._http.request("/posts", method="POST", body=input)
        return _deserialize(raw, Post)

    def update(self, id: str, input: PostUpdateInput) -> Post:
        raw = self._http.request(f"/posts/{quote(id, safe='')}", method="PATCH", body=input)
        return _deserialize(raw, Post)

    def delete(self, id: str) -> None:
        self._http.request(f"/posts/{quote(id, safe='')}", method="DELETE")

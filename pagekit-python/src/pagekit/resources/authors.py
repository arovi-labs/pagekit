from __future__ import annotations

from urllib.parse import quote

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import Author, AuthorCreateInput, AuthorListParams, AuthorUpdateInput, Paginated, Pagination


class AsyncAuthorsResource:
    def __init__(self, http: AsyncHttpClient) -> None:
        self._http = http

    async def list(self, params: AuthorListParams | None = None) -> Paginated[Author]:
        query = _build_query(params) if params else {}
        raw = await self._http.request("/authors", query=query)
        return Paginated(
            data=[_deserialize(a, Author) for a in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    async def get(self, id: str) -> Author:
        raw = await self._http.request(f"/authors/{quote(id, safe='')}")
        return _deserialize(raw, Author)

    async def get_by_slug(self, slug: str) -> Author:
        raw = await self._http.request(f"/authors/slug/{quote(slug, safe='')}")
        return _deserialize(raw, Author)

    async def create(self, input: AuthorCreateInput) -> Author:
        raw = await self._http.request("/authors", method="POST", body=input)
        return _deserialize(raw, Author)

    async def update(self, id: str, input: AuthorUpdateInput) -> Author:
        raw = await self._http.request(
            f"/authors/{quote(id, safe='')}",
            method="PATCH",
            body=input,
        )
        return _deserialize(raw, Author)


class SyncAuthorsResource:
    def __init__(self, http: SyncHttpClient) -> None:
        self._http = http

    def list(self, params: AuthorListParams | None = None) -> Paginated[Author]:
        query = _build_query(params) if params else {}
        raw = self._http.request("/authors", query=query)
        return Paginated(
            data=[_deserialize(a, Author) for a in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    def get(self, id: str) -> Author:
        raw = self._http.request(f"/authors/{quote(id, safe='')}")
        return _deserialize(raw, Author)

    def get_by_slug(self, slug: str) -> Author:
        raw = self._http.request(f"/authors/slug/{quote(slug, safe='')}")
        return _deserialize(raw, Author)

    def create(self, input: AuthorCreateInput) -> Author:
        raw = self._http.request("/authors", method="POST", body=input)
        return _deserialize(raw, Author)

    def update(self, id: str, input: AuthorUpdateInput) -> Author:
        raw = self._http.request(
            f"/authors/{quote(id, safe='')}",
            method="PATCH",
            body=input,
        )
        return _deserialize(raw, Author)

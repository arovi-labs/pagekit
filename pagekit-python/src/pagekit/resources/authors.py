from __future__ import annotations

from urllib.parse import quote

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import Author, AuthorListParams, Paginated, Pagination


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

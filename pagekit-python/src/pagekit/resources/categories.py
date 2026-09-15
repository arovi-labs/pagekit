from __future__ import annotations

from urllib.parse import quote

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import Category, CategoryListParams, Paginated, Pagination


class AsyncCategoriesResource:
    def __init__(self, http: AsyncHttpClient) -> None:
        self._http = http

    async def list(self, params: CategoryListParams | None = None) -> Paginated[Category]:
        query = _build_query(params) if params else {}
        raw = await self._http.request("/categories", query=query)
        return Paginated(
            data=[_deserialize(c, Category) for c in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    async def get_by_slug(self, slug: str) -> Category:
        raw = await self._http.request(f"/categories/{quote(slug, safe='')}")
        return _deserialize(raw, Category)


class SyncCategoriesResource:
    def __init__(self, http: SyncHttpClient) -> None:
        self._http = http

    def list(self, params: CategoryListParams | None = None) -> Paginated[Category]:
        query = _build_query(params) if params else {}
        raw = self._http.request("/categories", query=query)
        return Paginated(
            data=[_deserialize(c, Category) for c in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    def get_by_slug(self, slug: str) -> Category:
        raw = self._http.request(f"/categories/{quote(slug, safe='')}")
        return _deserialize(raw, Category)

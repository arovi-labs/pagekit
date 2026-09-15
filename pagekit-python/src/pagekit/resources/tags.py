from __future__ import annotations

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import Paginated, Pagination, Tag, TagListParams


class AsyncTagsResource:
    def __init__(self, http: AsyncHttpClient) -> None:
        self._http = http

    async def list(self, params: TagListParams | None = None) -> Paginated[Tag]:
        query = _build_query(params) if params else {}
        raw = await self._http.request("/tags", query=query)
        return Paginated(
            data=[_deserialize(t, Tag) for t in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )


class SyncTagsResource:
    def __init__(self, http: SyncHttpClient) -> None:
        self._http = http

    def list(self, params: TagListParams | None = None) -> Paginated[Tag]:
        query = _build_query(params) if params else {}
        raw = self._http.request("/tags", query=query)
        return Paginated(
            data=[_deserialize(t, Tag) for t in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

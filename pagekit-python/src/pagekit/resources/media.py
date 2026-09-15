from __future__ import annotations

from urllib.parse import quote

from ..http import AsyncHttpClient, SyncHttpClient, _build_query, _deserialize
from ..types import Media, MediaCreateInput, MediaListParams, Paginated, Pagination


class AsyncMediaResource:
    def __init__(self, http: AsyncHttpClient) -> None:
        self._http = http

    async def list(self, params: MediaListParams | None = None) -> Paginated[Media]:
        query = _build_query(params) if params else {}
        raw = await self._http.request("/media", query=query)
        return Paginated(
            data=[_deserialize(m, Media) for m in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    async def create(self, input: MediaCreateInput) -> Media:
        raw = await self._http.request("/media", method="POST", body=input)
        return _deserialize(raw, Media)

    async def delete(self, id: str) -> None:
        await self._http.request(f"/media/{quote(id, safe='')}", method="DELETE")


class SyncMediaResource:
    def __init__(self, http: SyncHttpClient) -> None:
        self._http = http

    def list(self, params: MediaListParams | None = None) -> Paginated[Media]:
        query = _build_query(params) if params else {}
        raw = self._http.request("/media", query=query)
        return Paginated(
            data=[_deserialize(m, Media) for m in raw["data"]],
            pagination=_deserialize(raw["pagination"], Pagination),
        )

    def create(self, input: MediaCreateInput) -> Media:
        raw = self._http.request("/media", method="POST", body=input)
        return _deserialize(raw, Media)

    def delete(self, id: str) -> None:
        self._http.request(f"/media/{quote(id, safe='')}", method="DELETE")

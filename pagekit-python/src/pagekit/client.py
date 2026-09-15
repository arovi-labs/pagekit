from __future__ import annotations

import httpx

from .errors import PagekitError
from .http import DEFAULT_BASE_URL, AsyncHttpClient, SyncHttpClient
from .resources.authors import AsyncAuthorsResource, SyncAuthorsResource
from .resources.categories import AsyncCategoriesResource, SyncCategoriesResource
from .resources.media import AsyncMediaResource, SyncMediaResource
from .resources.posts import AsyncPostsResource, SyncPostsResource
from .resources.tags import AsyncTagsResource, SyncTagsResource


class AsyncPagekit:
    """Async Pagekit content API client."""

    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30,
        headers: dict[str, str] | None = None,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self._http = AsyncHttpClient(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            headers=headers,
            http_client=http_client,
        )
        self.posts = AsyncPostsResource(self._http)
        self.authors = AsyncAuthorsResource(self._http)
        self.categories = AsyncCategoriesResource(self._http)
        self.tags = AsyncTagsResource(self._http)
        self.media = AsyncMediaResource(self._http)

    async def close(self) -> None:
        await self._http._client.aclose()

    async def __aenter__(self) -> AsyncPagekit:
        return self

    async def __aexit__(self, *args: object) -> None:
        await self.close()


class Pagekit:
    """Synchronous Pagekit content API client."""

    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30,
        headers: dict[str, str] | None = None,
        http_client: httpx.Client | None = None,
    ) -> None:
        self._http = SyncHttpClient(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            headers=headers,
            http_client=http_client,
        )
        self.posts = SyncPostsResource(self._http)
        self.authors = SyncAuthorsResource(self._http)
        self.categories = SyncCategoriesResource(self._http)
        self.tags = SyncTagsResource(self._http)
        self.media = SyncMediaResource(self._http)

    def close(self) -> None:
        self._http._client.close()

    def __enter__(self) -> Pagekit:
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

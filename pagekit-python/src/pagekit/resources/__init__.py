from __future__ import annotations

from ..resources.authors import AsyncAuthorsResource, SyncAuthorsResource
from ..resources.categories import AsyncCategoriesResource, SyncCategoriesResource
from ..resources.media import AsyncMediaResource, SyncMediaResource
from ..resources.posts import AsyncPostsResource, SyncPostsResource
from ..resources.tags import AsyncTagsResource, SyncTagsResource

__all__ = [
    "AsyncAuthorsResource",
    "AsyncCategoriesResource",
    "AsyncMediaResource",
    "AsyncPostsResource",
    "AsyncTagsResource",
    "SyncAuthorsResource",
    "SyncCategoriesResource",
    "SyncMediaResource",
    "SyncPostsResource",
    "SyncTagsResource",
]

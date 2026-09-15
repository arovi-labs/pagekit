from __future__ import annotations

from typing import Any


class PagekitError(Exception):
    """Error returned by the Pagekit API."""

    def __init__(
        self,
        message: str,
        *,
        status: int = 0,
        code: str = "api_error",
        details: Any = None,
    ) -> None:
        super().__init__(message)
        self.status = status
        self.code = code
        self.details = details

    @property
    def is_auth_error(self) -> bool:
        return self.status in (401, 403)

    @property
    def is_rate_limited(self) -> bool:
        return self.status == 429

    @property
    def is_server_error(self) -> bool:
        return self.status >= 500

from __future__ import annotations

from typing import Any, Protocol

import httpx

from .errors import PagekitError

DEFAULT_BASE_URL = "https://api.pagekit.app/v1"


class HttpClient(Protocol):
    async def request(
        self, path: str, *, method: str = "GET", query: dict[str, Any] | None = None, body: Any = None
    ) -> Any: ...


def _to_camel(key: str) -> str:
    parts = key.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


def _serialize_params(obj: Any) -> Any:
    if hasattr(obj, "__dataclass_fields__"):
        result = {}
        for k, v in obj.__dataclass_fields__.items():  # type: ignore[attr-defined]
            val = getattr(obj, k)
            if val is not None:
                result[_to_camel(k)] = _serialize_params(val)
        return result
    if isinstance(obj, dict):
        return {k: _serialize_params(v) for k, v in obj.items() if v is not None}
    if isinstance(obj, list):
        return [_serialize_params(v) for v in obj]
    if hasattr(obj, "value"):
        return obj.value
    return obj


def _build_query(params: Any) -> dict[str, str]:
    if params is None:
        return {}
    raw = _serialize_params(params) if hasattr(params, "__dataclass_fields__") else params or {}
    return {k: str(v) for k, v in raw.items() if v is not None and v != ""}


def _unwrap_type(ft: Any) -> Any:
    """Unwrap Optional/Union types to get the inner dataclass type."""
    import typing

    origin = getattr(ft, "__origin__", None)
    if origin is typing.Union:
        args = [a for a in ft.__args__ if a is not type(None)]
        if len(args) == 1:
            return args[0]
    return ft


def _deserialize(data: dict[str, Any], cls: type) -> Any:
    if not isinstance(data, dict):
        return data
    import dataclasses

    if not dataclasses.is_dataclass(cls):
        return data

    field_map = {f.name: f for f in dataclasses.fields(cls)}
    kwargs = {}
    for f in dataclasses.fields(cls):
        snake = f.name
        camel = _to_camel(snake)
        raw = data.get(camel, data.get(snake))
        if raw is None:
            continue
        ft = f.type
        if isinstance(ft, str):
            import typing

            ft = typing.get_type_hints(cls).get(snake, f.type)
        inner = _unwrap_type(ft)
        if dataclasses.is_dataclass(inner) and isinstance(raw, dict):
            kwargs[snake] = _deserialize(raw, inner)
        else:
            kwargs[snake] = raw
    return cls(**kwargs)


def _extract_message(body: Any) -> str:
    if isinstance(body, dict):
        err = body.get("error")
        if isinstance(err, dict) and "message" in err:
            return err["message"]
        if "message" in body:
            return body["message"]
    return "Unknown error"


def _extract_code(body: Any) -> str:
    if isinstance(body, dict):
        err = body.get("error")
        if isinstance(err, dict) and "code" in err:
            return err["code"]
        if "code" in body:
            return body["code"]
    return "api_error"


class AsyncHttpClient:
    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30,
        headers: dict[str, str] | None = None,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        if not api_key:
            raise PagekitError("api_key is required", code="missing_api_key")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._default_headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            **(headers or {}),
        }
        self._client = http_client or httpx.AsyncClient(
            timeout=httpx.Timeout(timeout),
        )

    async def request(
        self,
        path: str,
        *,
        method: str = "GET",
        query: dict[str, Any] | None = None,
        body: Any = None,
    ) -> Any:
        url = f"{self.base_url}{path}"
        headers = {**self._default_headers}
        if body is not None:
            headers["Content-Type"] = "application/json"

        try:
            resp = await self._client.request(
                method,
                url,
                headers=headers,
                params=_build_query(query) or None,
                content=__import__("json").dumps(_serialize_params(body)) if body is not None else None,
            )
        except httpx.TimeoutException:
            raise PagekitError("Request timed out", code="timeout")
        except httpx.HTTPError as exc:
            raise PagekitError(f"Network error: {exc}", code="network_error")

        if resp.status_code == 204:
            return None

        try:
            data = resp.json()
        except Exception:
            data = None

        if not resp.is_success:
            raise PagekitError(
                _extract_message(data),
                status=resp.status_code,
                code=_extract_code(data),
                details=data,
            )

        return data


class SyncHttpClient:
    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30,
        headers: dict[str, str] | None = None,
        http_client: httpx.Client | None = None,
    ) -> None:
        if not api_key:
            raise PagekitError("api_key is required", code="missing_api_key")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._default_headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            **(headers or {}),
        }
        self._client = http_client or httpx.Client(
            timeout=httpx.Timeout(timeout),
        )

    def request(
        self,
        path: str,
        *,
        method: str = "GET",
        query: dict[str, Any] | None = None,
        body: Any = None,
    ) -> Any:
        url = f"{self.base_url}{path}"
        headers = {**self._default_headers}
        if body is not None:
            headers["Content-Type"] = "application/json"

        try:
            resp = self._client.request(
                method,
                url,
                headers=headers,
                params=_build_query(query) or None,
                content=__import__("json").dumps(_serialize_params(body)) if body is not None else None,
            )
        except httpx.TimeoutException:
            raise PagekitError("Request timed out", code="timeout")
        except httpx.HTTPError as exc:
            raise PagekitError(f"Network error: {exc}", code="network_error")

        if resp.status_code == 204:
            return None

        try:
            data = resp.json()
        except Exception:
            data = None

        if not resp.is_success:
            raise PagekitError(
                _extract_message(data),
                status=resp.status_code,
                code=_extract_code(data),
                details=data,
            )

        return data

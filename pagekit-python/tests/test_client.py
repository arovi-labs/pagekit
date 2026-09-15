from __future__ import annotations

import pytest

from pagekit import Pagekit, PagekitError
from pagekit.http import DEFAULT_BASE_URL


def test_throws_when_no_api_key():
    with pytest.raises(PagekitError, match="api_key is required"):
        Pagekit(api_key="")


def test_creates_instance_with_valid_options():
    client = Pagekit(api_key="pk_test_123")
    assert client._http.api_key == "pk_test_123"
    assert client._http.base_url == DEFAULT_BASE_URL
    client.close()


def test_uses_custom_base_url():
    client = Pagekit(api_key="pk_test_123", base_url="https://my-api.example.com/v1/")
    assert client._http.base_url == "https://my-api.example.com/v1"
    client.close()


def test_strips_trailing_slashes():
    client = Pagekit(api_key="pk_test_123", base_url="https://example.com/v1///")
    assert client._http.base_url == "https://example.com/v1"
    client.close()


def test_exposes_resource_namespaces():
    client = Pagekit(api_key="pk_test_123")
    assert client.posts is not None
    assert client.authors is not None
    assert client.categories is not None
    assert client.tags is not None
    assert client.media is not None
    client.close()

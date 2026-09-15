from __future__ import annotations

from pagekit import PagekitError


def test_has_correct_defaults():
    error = PagekitError("test")
    assert str(error) == "test"
    assert error.status == 0
    assert error.code == "api_error"


def test_accepts_custom_status_and_code():
    error = PagekitError("not found", status=404, code="not_found")
    assert error.status == 404
    assert error.code == "not_found"


def test_stores_details():
    details = {"field": "title"}
    error = PagekitError("validation", status=422, code="validation_error", details=details)
    assert error.details == details


def test_is_auth_error_true_for_401():
    assert PagekitError("unauthorized", status=401).is_auth_error is True


def test_is_auth_error_true_for_403():
    assert PagekitError("forbidden", status=403).is_auth_error is True


def test_is_auth_error_false_for_other():
    assert PagekitError("not found", status=404).is_auth_error is False
    assert PagekitError("error", status=500).is_auth_error is False


def test_is_rate_limited_true_for_429():
    assert PagekitError("rate limited", status=429).is_rate_limited is True


def test_is_rate_limited_false_for_other():
    assert PagekitError("error", status=400).is_rate_limited is False


def test_is_server_error_true_for_5xx():
    assert PagekitError("error", status=500).is_server_error is True
    assert PagekitError("error", status=503).is_server_error is True
    assert PagekitError("error", status=599).is_server_error is True


def test_is_server_error_false_for_non_5xx():
    assert PagekitError("error", status=400).is_server_error is False
    assert PagekitError("error", status=404).is_server_error is False

# -*- coding: utf-8 -*-
import os
import shutil
import tempfile

import pytest

_TMP_DIR = tempfile.mkdtemp(prefix="mindflow-tests-")
os.environ.update(
    {
        "DATABASE_URL": f"sqlite+aiosqlite:///{_TMP_DIR}/test.db",
        "ALLOW_SQLITE_FALLBACK": "true",
        "AUTO_CREATE_TABLES": "true",
        "LLM_MODE": "mock",
        "AES_KEY": "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
        "REPORTS_DIR": f"{_TMP_DIR}/reports",
        "JWT_SECRET_KEY": "test-jwt-secret",
    }
)

from fastapi.testclient import TestClient  # noqa: E402

from interfaces.api.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client
    shutil.rmtree(_TMP_DIR, ignore_errors=True)


@pytest.fixture
def auth_headers(client):
    import uuid

    email = f"user-{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    response = client.post(
        "/auth/register",
        json={"email": email, "password": password, "full_name": "Terapeuta Test"},
    )
    assert response.status_code == 201, response.text
    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

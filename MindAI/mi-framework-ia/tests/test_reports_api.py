# -*- coding: utf-8 -*-
import uuid
from pathlib import Path

import pytest

from core.errors import NotFoundError
from core.reporting.report_service import resolve_report_file

NOTE = (
    "Me siento muy ansioso y triste. Siempre creo que todo va a salir mal y es un desastre. "
    "No puedo dormir y me cuesta concentrarme."
)


def _other_user_headers(client) -> dict[str, str]:
    email = f"other-{uuid.uuid4().hex[:8]}@example.com"
    client.post(
        "/auth/register",
        json={"email": email, "password": "password123", "full_name": "Otro Terapeuta"},
    )
    login = client.post("/auth/login", json={"email": email, "password": "password123"})
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


def test_analyze_returns_relative_report_url(client, auth_headers):
    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    assert response.status_code == 201, response.text
    body = response.json()
    analysis_id = body["analysis"]["analysis_id"]

    assert body["report_url"] == f"/reports/{analysis_id}"
    assert body["report_format"] == "markdown"
    assert body["report_path"]


def test_report_download_returns_markdown_to_owner(client, auth_headers):
    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    report_url = response.json()["report_url"]

    download = client.get(report_url, headers=auth_headers)
    assert download.status_code == 200, download.text
    assert "text/markdown" in download.headers["content-type"]
    assert "attachment" in download.headers.get("content-disposition", "")
    assert "# Reporte de apoyo al triaje emocional" in download.text
    assert "Debe ser revisado por el profesional" in download.text


def test_report_download_blocks_other_users_and_missing_analysis(client, auth_headers):
    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    report_url = response.json()["report_url"]

    assert client.get(report_url, headers=_other_user_headers(client)).status_code == 404
    assert client.get(f"/reports/{uuid.uuid4()}", headers=auth_headers).status_code == 404
    assert client.get(report_url).status_code == 401


def test_report_download_rejects_path_traversal():
    outside = Path.cwd() / f"outside-{uuid.uuid4().hex}.md"
    with pytest.raises(NotFoundError):
        resolve_report_file(str(outside))


def test_report_download_rejects_traversal_through_api(client, auth_headers, tmp_path, monkeypatch):
    from core.db.repositories import ReportRepository

    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    report_url = response.json()["report_url"]

    outside_file = tmp_path / "outside.md"
    outside_file.write_text("# fuera de reports", encoding="utf-8")

    class FakeReport:
        file_path = str(outside_file)

    async def fake_latest(self, analysis_id):
        return FakeReport()

    monkeypatch.setattr(ReportRepository, "get_latest_for_analysis", fake_latest)
    assert client.get(report_url, headers=auth_headers).status_code == 404

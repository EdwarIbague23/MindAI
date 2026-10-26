# -*- coding: utf-8 -*-
import uuid

NOTE = (
    "Me siento muy ansioso y triste. Siempre creo que todo va a salir mal y es un desastre. "
    "No puedo dormir y me cuesta concentrarme."
)


def test_analysis_requires_authentication(client):
    response = client.post("/analysis/analyze", json={"note": NOTE})
    assert response.status_code == 401


def test_full_analysis_and_report_flow(client, auth_headers):
    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    assert response.status_code == 201, response.text
    body = response.json()
    analysis = body["analysis"]
    assert analysis["triage_level"] in {"low", "medium", "high"}
    assert analysis["emotions"]
    assert body["pii_findings"] is not None

    analysis_id = analysis["analysis_id"]
    response = client.post(f"/analysis/{analysis_id}/report", headers=auth_headers)
    assert response.status_code == 201, response.text
    assert response.json()["format"] == "markdown"

    response = client.get(f"/analysis/{analysis_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["analysis"]["analysis_id"] == analysis_id


def test_analysis_is_scoped_to_owner(client, auth_headers):
    response = client.post("/analysis/analyze", json={"note": NOTE}, headers=auth_headers)
    analysis_id = response.json()["analysis"]["analysis_id"]

    email = f"other-{uuid.uuid4().hex[:8]}@example.com"
    client.post(
        "/auth/register",
        json={"email": email, "password": "password123", "full_name": "Otro Terapeuta"},
    )
    login = client.post("/auth/login", json={"email": email, "password": "password123"})
    other_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    response = client.get(f"/analysis/{analysis_id}", headers=other_headers)
    assert response.status_code == 404

# -*- coding: utf-8 -*-
import pytest

from core.manifest_validator import ManifestValidationError, load_and_validate, validate_manifests


def test_config_manifests_are_valid():
    agents, skills = load_and_validate("config")
    names = {agent["name"] for agent in agents}
    assert {"emotion_analysis_agent", "triage_agent", "report_agent"} <= names
    assert {skill["name"] for skill in skills} == {
        "code_executor",
        "db_query",
        "document_generator",
        "web_search",
    }


def test_forbidden_output_field_is_rejected():
    agents = {
        "agents": [
            {
                "name": "bad_agent",
                "version": "1.0.0",
                "description": "x",
                "owner": "team",
                "role": "triage",
                "output_schema": {"properties": {"diagnosis": {"type": "string"}}},
                "permissions": {"allowed_skills": []},
                "pii_policy": "anonymized_only",
                "model_policy": {"provider": "mock"},
            }
        ]
    }
    skills = {
        "skills": [
            {
                "name": "x",
                "version": "1.0.0",
                "category": "db_query",
                "entrypoint": "x:y",
                "permissions": {"pii_access": "forbidden"},
            }
        ]
    }
    with pytest.raises(ManifestValidationError) as exc:
        validate_manifests(agents, skills)
    assert "prohibidos" in str(exc.value)

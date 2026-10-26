# -*- coding: utf-8 -*-
import re
from pathlib import Path
from typing import Any

import yaml

SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")
VALID_ROLES = {"triage", "emotion_analysis", "report_generation", "system_audit"}
VALID_CATEGORIES = {"code_executor", "db_query", "document_generator", "web_search"}
FORBIDDEN_OUTPUT_KEYS = {"diagnosis", "diagnostico", "prescription", "prescripcion", "treatment_plan"}


class ManifestValidationError(ValueError):
    def __init__(self, errors: list[str]) -> None:
        self.errors = errors
        super().__init__("; ".join(errors))


def _load(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or {}
    if not isinstance(data, dict):
        raise ManifestValidationError([f"{path.name}: la raiz debe ser un objeto"])
    return data


def _collect_keys(schema: Any) -> set[str]:
    keys: set[str] = set()
    if isinstance(schema, dict):
        properties = schema.get("properties")
        if isinstance(properties, dict):
            keys.update(str(key).lower() for key in properties)
        for value in schema.values():
            keys |= _collect_keys(value)
    elif isinstance(schema, list):
        for item in schema:
            keys |= _collect_keys(item)
    return keys


def validate_manifests(agents_doc: dict[str, Any], skills_doc: dict[str, Any]) -> tuple[list[dict], list[dict]]:
    errors: list[str] = []
    agents = agents_doc.get("agents")
    skills = skills_doc.get("skills")

    if not isinstance(agents, list) or not agents:
        errors.append("agents.yaml: se requiere una lista 'agents' no vacia")
        agents = []
    if not isinstance(skills, list) or not skills:
        errors.append("skills.yaml: se requiere una lista 'skills' no vacia")
        skills = []

    skill_names: set[str] = set()
    for skill in skills:
        if not isinstance(skill, dict):
            errors.append("skills.yaml: cada skill debe ser un objeto")
            continue
        name = skill.get("name")
        if not name:
            errors.append("skills.yaml: skill sin 'name'")
            continue
        if name in skill_names:
            errors.append(f"skills.yaml: nombre duplicado '{name}'")
        skill_names.add(name)

        if not SEMVER_RE.match(str(skill.get("version", ""))):
            errors.append(f"skills.yaml[{name}]: version semver invalida")
        if skill.get("category") not in VALID_CATEGORIES:
            errors.append(f"skills.yaml[{name}]: category invalida")
        if not skill.get("entrypoint"):
            errors.append(f"skills.yaml[{name}]: falta entrypoint")

        permissions = skill.get("permissions") or {}
        if permissions.get("pii_access") != "forbidden":
            errors.append(f"skills.yaml[{name}]: pii_access debe ser 'forbidden'")
        if skill.get("category") == "code_executor" and skill.get("sandboxed") is not True:
            errors.append(f"skills.yaml[{name}]: code_executor exige sandboxed: true")
        if permissions.get("requires_network") is True and not permissions.get("allowed_domains"):
            errors.append(f"skills.yaml[{name}]: requiere allowed_domains no vacio")

    agent_names: set[str] = set()
    for agent in agents:
        if not isinstance(agent, dict):
            errors.append("agents.yaml: cada agente debe ser un objeto")
            continue
        name = agent.get("name")
        if not name:
            errors.append("agents.yaml: agente sin 'name'")
            continue
        if name in agent_names:
            errors.append(f"agents.yaml: nombre duplicado '{name}'")
        agent_names.add(name)

        if not SEMVER_RE.match(str(agent.get("version", ""))):
            errors.append(f"agents.yaml[{name}]: version semver invalida")
        if agent.get("role") not in VALID_ROLES:
            errors.append(f"agents.yaml[{name}]: role invalida")
        if not agent.get("description") or not agent.get("owner"):
            errors.append(f"agents.yaml[{name}]: faltan description/owner")
        if agent.get("pii_policy") not in {"anonymized_only", "no_clinical_data"}:
            errors.append(f"agents.yaml[{name}]: pii_policy invalida")

        output_schema = agent.get("output_schema") or {}
        forbidden = _collect_keys(output_schema) & FORBIDDEN_OUTPUT_KEYS
        if forbidden:
            errors.append(f"agents.yaml[{name}]: output_schema contiene campos prohibidos {sorted(forbidden)}")

        permissions = agent.get("permissions") or {}
        allowed = permissions.get("allowed_skills")
        if not isinstance(allowed, list):
            errors.append(f"agents.yaml[{name}]: permissions.allowed_skills debe ser lista")
            allowed = []
        for skill_name in allowed:
            if skill_name not in skill_names:
                errors.append(f"agents.yaml[{name}]: skill inexistente '{skill_name}'")
        if agent.get("pii_policy") == "anonymized_only" and permissions.get("pii_access") != "anonymized_only":
            errors.append(f"agents.yaml[{name}]: coherencia PII invalida")

        model_policy = agent.get("model_policy") or {}
        if not model_policy.get("provider"):
            errors.append(f"agents.yaml[{name}]: falta model_policy.provider")

    if errors:
        raise ManifestValidationError(errors)
    return agents, skills


def load_and_validate(config_dir: str | Path) -> tuple[list[dict], list[dict]]:
    config_path = Path(config_dir)
    agents_doc = _load(config_path / "agents.yaml")
    skills_doc = _load(config_path / "skills.yaml")
    return validate_manifests(agents_doc, skills_doc)

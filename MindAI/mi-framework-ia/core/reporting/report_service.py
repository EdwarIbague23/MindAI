# -*- coding: utf-8 -*-
"""Generacion de reportes Markdown sin PII a partir del analisis estructurado."""

import asyncio
from datetime import UTC, datetime
from pathlib import Path

from core.config import BASE_DIR, get_settings
from core.errors import NotFoundError
from core.schemas.analysis import AnalysisResponse

RISK_NOTICE = (
    "> **Alerta de riesgo:** el texto contiene indicadores que sugieren contencion inmediata. "
    "Contacte la linea de atencion en crisis de su region."
)
DISCLAIMER = "Analisis generado por IA. Debe ser revisado por el profesional."


def _render(analysis: AnalysisResponse) -> str:
    stamp = datetime.now(UTC).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Reporte de apoyo al triaje emocional",
        "",
        f"- **Analisis:** `{analysis.analysis_id}`",
        f"- **Generado:** {stamp}",
        f"- **Nivel de atencion sugerido:** {analysis.triage_level}",
        "",
    ]
    if analysis.risk_detected:
        lines += [RISK_NOTICE, ""]

    lines += ["## Resumen", "", analysis.summary, "", "## Emociones identificadas", ""]
    if analysis.emotions:
        lines += ["| Emocion | Intensidad | Evidencia |", "| --- | --- | --- |"]
        for emotion in analysis.emotions:
            evidence = (emotion.evidence or "").replace("|", "/")
            lines.append(f"| {emotion.name} | {emotion.score}/100 | {evidence} |")
    else:
        lines.append("Sin emociones con evidencia suficiente.")

    lines += ["", "## Distorsiones cognitivas", ""]
    if analysis.distortions:
        for distortion in analysis.distortions:
            lines.append(f"- **{distortion.type}:** {distortion.explanation}")
            lines.append(f"  - Evidencia: \"{distortion.evidence}\"")
    else:
        lines.append("No se identificaron distorsiones con evidencia textual suficiente.")

    lines += ["", "## Preguntas guia", ""]
    for question in analysis.guiding_questions:
        lines.append(f"- {question.question}")
        if question.rationale:
            lines.append(f"  - _Proposito:_ {question.rationale}")

    lines += ["", "---", "", analysis.disclaimer or DISCLAIMER, ""]
    return "\n".join(lines)


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def reports_base_dir() -> Path:
    settings = get_settings()
    base = Path(settings.reports_dir)
    if not base.is_absolute():
        base = BASE_DIR / base
    return base.resolve()


def build_report_url(analysis_id: str | object) -> str:
    return f"/reports/{analysis_id}"


def resolve_report_file(file_path: str) -> Path:
    """Resuelve un reporte y bloquea cualquier ruta fuera de reports_dir."""
    base = reports_base_dir()
    candidate = Path(file_path)
    if not candidate.is_absolute():
        candidate = base / candidate
    resolved = candidate.resolve()
    if not resolved.is_relative_to(base):
        raise NotFoundError("Reporte no encontrado")
    if not resolved.is_file():
        raise NotFoundError("Reporte no encontrado")
    return resolved


async def generate_report(analysis: AnalysisResponse, session_id: str) -> tuple[Path, str]:
    base = reports_base_dir()
    safe_session = "".join(char for char in session_id if char.isalnum() or char in "-_")
    path = base / safe_session / f"analisis_{analysis.analysis_id}.md"
    content = _render(analysis)
    await asyncio.to_thread(_write, path, content)
    return path, "markdown"

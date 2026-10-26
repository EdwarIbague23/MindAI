# -*- coding: utf-8 -*-
from fastapi import APIRouter, status

from core.db.repositories import AnalysisRepository, NoteRepository, ReportRepository, SessionRepository
from core.errors import ValidationError
from core.reporting.report_service import build_report_url
from core.schemas.analysis import AnalysisRequest, AnalysisResult, ReportResponse
from core.security.guardrails import Guardrails
from core.security.pii_pipeline import PIIPipeline
from interfaces.api.deps import CurrentUser, DbSession, OrchestratorDep

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/analyze", response_model=AnalysisResult, status_code=status.HTTP_201_CREATED)
async def analyze_note(
    payload: AnalysisRequest,
    user: CurrentUser,
    orchestrator: OrchestratorDep,
    db: DbSession,
) -> AnalysisResult:
    Guardrails.assert_valid_input(payload.note)

    anonymized = PIIPipeline.anonymize(payload.note)
    text = anonymized["anonymized_text"].strip()
    if len(text) < 5:
        raise ValidationError("No hay contenido suficiente despues de anonimizar")

    session_repository = SessionRepository(db)
    if payload.session_id is not None:
        session = await session_repository.get_owned(str(payload.session_id), user.id)
    else:
        session = await session_repository.create(user.id)

    note = await NoteRepository(db).create(session.id, text, anonymized["findings"])
    analysis, report = await orchestrator.run(text, str(session.id))
    analysis_record = await AnalysisRepository(db).create(session.id, note.id, analysis)

    report_path = report.get("file_path") if isinstance(report, dict) else None
    report_format = report.get("format") if isinstance(report, dict) else None
    if report_path:
        await ReportRepository(db).create(analysis_record.id, report_path, report_format or "markdown")

    return AnalysisResult(
        analysis=analysis,
        session_id=session.id,
        report_path=report_path,
        report_url=build_report_url(analysis.analysis_id) if report_path else None,
        report_format=report_format,
        pii_findings=anonymized["findings"],
    )


@router.get("/{analysis_id}", response_model=AnalysisResult)
async def get_analysis(analysis_id: str, user: CurrentUser, db: DbSession) -> AnalysisResult:
    repository = AnalysisRepository(db)
    record = await repository.get_owned(analysis_id, user.id)
    analysis = await repository.decrypt_payload(record)
    report = await ReportRepository(db).get_latest_for_analysis(analysis_id)

    return AnalysisResult(
        analysis=analysis,
        session_id=record.session_id,
        report_path=report.file_path if report else None,
        report_url=build_report_url(analysis_id) if report else None,
        report_format=report.format if report else None,
    )


@router.post(
    "/{analysis_id}/report",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_report(
    analysis_id: str,
    user: CurrentUser,
    orchestrator: OrchestratorDep,
    db: DbSession,
) -> ReportResponse:
    repository = AnalysisRepository(db)
    record = await repository.get_owned(analysis_id, user.id)
    analysis = await repository.decrypt_payload(record)

    report_data = await orchestrator.generate_report(analysis, record.session_id)
    path = report_data.get("file_path")
    report_format = report_data.get("format") or "markdown"
    if not path:
        raise ValidationError("No fue posible generar el reporte")
    report = await ReportRepository(db).create(record.id, str(path), report_format)

    return ReportResponse(
        id=report.id,
        analysis_id=analysis.analysis_id,
        format=report.format,
        file_path=report.file_path,
        report_url=build_report_url(analysis.analysis_id),
        created_at=report.created_at,
    )

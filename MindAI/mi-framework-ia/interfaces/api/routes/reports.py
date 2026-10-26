# -*- coding: utf-8 -*-
"""Descarga autenticada de reportes Markdown con validacion de ownership."""

from fastapi import APIRouter
from fastapi.responses import FileResponse

from core.db.repositories import AnalysisRepository, ReportRepository
from core.errors import NotFoundError
from core.reporting.report_service import resolve_report_file
from interfaces.api.deps import CurrentUser, DbSession

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{analysis_id}")
async def download_report(analysis_id: str, user: CurrentUser, db: DbSession) -> FileResponse:
    await AnalysisRepository(db).get_owned(analysis_id, user.id)
    report = await ReportRepository(db).get_latest_for_analysis(analysis_id)
    if report is None:
        raise NotFoundError("Reporte no encontrado")

    path = resolve_report_file(report.file_path)
    return FileResponse(
        path=path,
        media_type="text/markdown; charset=utf-8",
        filename=f"analisis_{analysis_id}.md",
    )

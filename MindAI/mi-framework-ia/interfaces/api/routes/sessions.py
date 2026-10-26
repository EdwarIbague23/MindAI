# -*- coding: utf-8 -*-
from fastapi import APIRouter, status

from core.db.repositories import AnalysisRepository, SessionRepository
from core.schemas.session import AnalysisSummary, SessionCreate, SessionOut
from interfaces.api.deps import CurrentUser, DbSession

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(payload: SessionCreate, user: CurrentUser, db: DbSession) -> SessionOut:
    record = await SessionRepository(db).create(user.id, payload.title)
    return SessionOut.model_validate(record)


@router.get("", response_model=list[SessionOut])
async def list_sessions(user: CurrentUser, db: DbSession) -> list[SessionOut]:
    records = await SessionRepository(db).list_for_user(user.id)
    return [SessionOut.model_validate(record) for record in records]


@router.get("/{session_id}/analyses", response_model=list[AnalysisSummary])
async def list_session_analyses(session_id: str, user: CurrentUser, db: DbSession) -> list[AnalysisSummary]:
    await SessionRepository(db).get_owned(session_id, user.id)
    repository = AnalysisRepository(db)
    records = await repository.list_for_session(session_id)
    summaries: list[AnalysisSummary] = []
    for record in records:
        analysis = await repository.decrypt_payload(record)
        summaries.append(
            AnalysisSummary(
                id=analysis.analysis_id,
                session_id=session_id,
                triage_level=analysis.triage_level,
                risk_detected=analysis.risk_detected,
                summary=analysis.summary,
                created_at=record.created_at,
            )
        )
    return summaries

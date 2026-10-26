# -*- coding: utf-8 -*-
"""Repositorios async: cifrado en reposo y verificacion de ownership."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db.models import Analysis, Note, Report, Session, User
from core.errors import NotFoundError
from core.schemas.analysis import AnalysisResponse
from core.security.encryption_service import encryption_service


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email.lower()))
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: str) -> User | None:
        return await self.session.get(User, user_id)

    async def create(self, email: str, hashed_password: str, full_name: str | None = None) -> User:
        user = User(email=email.lower(), hashed_password=hashed_password, full_name=full_name)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user


class SessionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, user_id: str, title: str = "Nueva sesion") -> Session:
        record = Session(user_id=user_id, title=title)
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def get_owned(self, session_id: str, user_id: str) -> Session:
        record = await self.session.get(Session, session_id)
        if record is None:
            raise NotFoundError("Sesion no encontrada")
        if record.user_id != user_id:
            raise NotFoundError("Sesion no encontrada")
        return record

    async def list_for_user(self, user_id: str) -> list[Session]:
        result = await self.session.execute(
            select(Session).where(Session.user_id == user_id).order_by(Session.created_at.desc())
        )
        return list(result.scalars())


class NoteRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, session_id: str, content: str, pii_findings: dict) -> Note:
        record = Note(
            session_id=session_id,
            encrypted_content=encryption_service.encrypt(content),
            pii_findings=pii_findings,
        )
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def decrypt_content(self, note: Note) -> str:
        return encryption_service.decrypt(note.encrypted_content)

    async def list_for_session(self, session_id: str) -> list[Note]:
        result = await self.session.execute(
            select(Note).where(Note.session_id == session_id).order_by(Note.created_at.desc())
        )
        return list(result.scalars())


class AnalysisRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, session_id: str, note_id: str, analysis: AnalysisResponse) -> Analysis:
        record = Analysis(
            id=str(analysis.analysis_id),
            session_id=session_id,
            note_id=note_id,
            encrypted_payload=encryption_service.encrypt(analysis.model_dump_json()),
            triage_level=analysis.triage_level,
            risk_detected=analysis.risk_detected,
        )
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def get_owned(self, analysis_id: str, user_id: str) -> Analysis:
        result = await self.session.execute(
            select(Analysis).join(Session).where(Analysis.id == analysis_id, Session.user_id == user_id)
        )
        record = result.scalar_one_or_none()
        if record is None:
            raise NotFoundError("Analisis no encontrado")
        return record

    async def decrypt_payload(self, analysis: Analysis) -> AnalysisResponse:
        return AnalysisResponse.model_validate_json(
            encryption_service.decrypt(analysis.encrypted_payload)
        )

    async def list_for_session(self, session_id: str) -> list[Analysis]:
        result = await self.session.execute(
            select(Analysis).where(Analysis.session_id == session_id).order_by(Analysis.created_at.desc())
        )
        return list(result.scalars())


class ReportRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, analysis_id: str, file_path: str, report_format: str = "markdown") -> Report:
        record = Report(analysis_id=analysis_id, file_path=file_path, format=report_format)
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def list_for_analysis(self, analysis_id: str) -> list[Report]:
        result = await self.session.execute(
            select(Report).where(Report.analysis_id == analysis_id).order_by(Report.created_at.desc())
        )
        return list(result.scalars())

    async def get_latest_for_analysis(self, analysis_id: str) -> Report | None:
        result = await self.session.execute(
            select(Report)
            .where(Report.analysis_id == analysis_id)
            .order_by(Report.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

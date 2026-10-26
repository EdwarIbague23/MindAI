# -*- coding: utf-8 -*-
"""Dependencias compartidas de FastAPI."""

from typing import Annotated

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from core.db.database import get_session
from core.db.models import User
from core.db.repositories import UserRepository
from core.errors import AuthenticationError
from core.orchestrator.orchestrator import AnalysisOrchestrator
from core.security.auth import decode_token

bearer_scheme = HTTPBearer(auto_error=False)

DbSession = Annotated[AsyncSession, Depends(get_session)]


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: DbSession,
) -> User:
    if credentials is None:
        raise AuthenticationError("Se requiere autenticacion")
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError("Token sin sujeto")
    user = await UserRepository(db).get_by_id(str(user_id))
    if user is None or not user.is_active:
        raise AuthenticationError("Usuario no valido")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_orchestrator(request: Request) -> AnalysisOrchestrator:
    return request.app.state.orchestrator


OrchestratorDep = Annotated[AnalysisOrchestrator, Depends(get_orchestrator)]

# -*- coding: utf-8 -*-
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SessionCreate(BaseModel):
    title: str = Field(default="Nueva sesion", min_length=1, max_length=255)


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    created_at: datetime


class AnalysisSummary(BaseModel):
    id: UUID
    session_id: UUID
    triage_level: str
    risk_detected: bool
    summary: str
    created_at: datetime

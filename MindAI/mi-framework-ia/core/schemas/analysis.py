# -*- coding: utf-8 -*-
from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_validator

DISCLAIMER = "Analisis generado por IA. Debe ser revisado por el profesional."

FORBIDDEN_OUTPUT_FIELDS = (
    "diagnosis",
    "diagnostico",
    "prescription",
    "prescripcion",
    "treatment_plan",
    "plan_de_tratamiento",
)


class Emotion(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    score: int = Field(..., ge=0, le=100)
    evidence: str | None = Field(None, max_length=500)

    @field_validator("name")
    @classmethod
    def no_html(cls, v: str) -> str:
        if "<" in v or ">" in v:
            raise ValueError("HTML not allowed")
        return v.strip()


class CognitiveDistortion(BaseModel):
    type: str = Field(..., min_length=1, max_length=100)
    evidence: str = Field(..., min_length=1, max_length=500)
    explanation: str = Field(..., min_length=1, max_length=500)

    @field_validator("type")
    @classmethod
    def no_html(cls, v: str) -> str:
        if "<" in v or ">" in v:
            raise ValueError("HTML not allowed")
        return v.strip()


class GuidingQuestion(BaseModel):
    question: str = Field(..., min_length=1, max_length=300)
    rationale: str | None = Field(None, max_length=300)


class AnalysisRequest(BaseModel):
    note: str = Field(..., min_length=10, max_length=10000)
    session_id: UUID | None = None

    @field_validator("note")
    @classmethod
    def no_script(cls, v: str) -> str:
        if "<script" in v.lower():
            raise ValueError("Invalid content")
        return v.strip()


class AnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    analysis_id: UUID = Field(default_factory=uuid4)
    emotions: list[Emotion] = Field(default_factory=list)
    distortions: list[CognitiveDistortion] = Field(default_factory=list)
    guiding_questions: list[GuidingQuestion] = Field(default_factory=list)
    triage_level: str = Field(..., pattern="^(low|medium|high)$")
    summary: str = Field(..., min_length=1, max_length=1000)
    risk_detected: bool = False
    disclaimer: str = DISCLAIMER


class AnalysisResult(BaseModel):
    analysis: AnalysisResponse
    session_id: UUID | None = None
    report_path: str | None = None
    report_url: str | None = None
    report_format: str | None = None
    pii_findings: dict = Field(default_factory=dict)


class ReportResponse(BaseModel):
    id: UUID
    analysis_id: UUID
    format: str
    file_path: str
    report_url: str
    created_at: datetime


class ErrorResponse(BaseModel):
    error: str
    message: str
    request_id: str | None = None

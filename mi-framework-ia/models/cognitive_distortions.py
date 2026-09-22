"""Cognitive distortion model for MindFlow AI distortion detection."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class CognitiveDistortion(Base):
    """Cognitive distortion entity detecting thinking patterns in analysis."""
    __tablename__ = "cognitive_distortions"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    analysis_id = Column(
        sa.UUID(),
        sa.ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
    )
    distortion_type = Column(
        sa.Enum(
            "all_or_nothing",
            "catastrophizing",
            "overgeneralization",
            "mind_reading",
            "emotional_reasoning",
            "labeling",
            name="distortiontype",
        ),
        nullable=False,
    )
    severity = Column(sa.VARCHAR(20), nullable=True)  # 'low','medium','high'
    description = Column(sa.TEXT(), nullable=True)
    detected_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
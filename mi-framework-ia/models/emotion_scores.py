"""Emotion score model for MindFlow AI emotional analysis."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class EmotionScore(Base):
    """Emotion score entity representing detected emotions in analysis."""
    __tablename__ = "emotion_scores"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    analysis_id = Column(
        sa.UUID(),
        sa.ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
    )
    emotion_name = Column(
        sa.Enum("joy", "sadness", "anger", "fear", "disgust", "surprise", name="emotionname"),
        nullable=False,
    )
    score = Column(sa.FLOAT(3, 2), nullable=False)  # 0.00 to 1.00
    confidence = Column(sa.FLOAT(3, 2), nullable=True)
    timestamp = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
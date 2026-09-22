"""Guiding question model for MindFlow AI suggested questions."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class GuidingQuestion(Base):
    """Guiding question entity suggesting therapeutic questions per analysis."""
    __tablename__ = "guiding_questions"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    analysis_id = Column(
        sa.UUID(),
        sa.ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
    )
    question_text = Column(sa.TEXT(), nullable=False)
    category = Column(
        sa.Enum("reflection", "action", "clarification", name="questioncategory"),
        nullable=False,
    )
    priority = Column(sa.INTEGER(), nullable=False, server_default="3")  # 1-5 scale
    created_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
"""Report model for MindFlow AI generated clinical reports."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class Report(Base):
    """Report entity representing generated clinical reports per analysis."""
    __tablename__ = "reports"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    analysis_id = Column(
        sa.UUID(),
        sa.ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    format = Column(
        sa.Enum("pdf", "html", "text", name="reportformat"),
        nullable=False,
        server_default="pdf",
    )
    generated_content = Column(sa.TEXT(), nullable=True)  # JSON with report data
    generated_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
    word_count = Column(sa.INTEGER(), nullable=False, server_default="0")
"""Analysis model for MindFlow AI IA processing results."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class Analysis(Base):
    """Analysis entity representing IA processing of a clinical note."""
    __tablename__ = "analyses"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    clinical_note_id = Column(
        sa.UUID(),
        sa.ForeignKey("clinical_notes.id", ondelete="CASCADE"),
        nullable=False,
    )
    status = Column(
        sa.Enum("pending", "completed", "error", name="analysisstatus"),
        nullable=False,
        server_default="pending",
    )
    ia_model = Column(sa.VARCHAR(50), nullable=False)  # 'claude-3.5-sonnet' or 'gpt-4o'
    processing_time = Column(sa.FLOAT(), nullable=True)  # seconds
    created_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
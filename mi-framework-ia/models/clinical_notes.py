"""Clinical note model for MindFlow AI patient records."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class ClinicalNote(Base):
    """Clinical note entity representing therapist-entered patient notes."""
    __tablename__ = "clinical_notes"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    therapist_id = Column(
        sa.UUID(),
        sa.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    patient_hash = Column(sa.CHAR(32), nullable=False)  # SHA-256 hash, no PII
    note_text = Column(sa.TEXT(), nullable=False)
    language = Column(sa.VARCHAR(10), nullable=False, server_default="es")
    word_count = Column(sa.INTEGER(), nullable=False, server_default="0")
    created_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
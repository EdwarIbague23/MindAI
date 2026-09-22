"""Initial migration: 7 tables for MindFlow AI"""

from alembic import op
import sqlalchemy as sa

# enum types
distortion_types = sa.Enum(
    "all_or_nothing",
    "catastrophizing",
    "overgeneralization",
    "mind_reading",
    "emotional_reasoning",
    "labeling",
    name="distortiontype",
)

emotion_names = sa.Enum(
    "joy",
    "sadness",
    "anger",
    "fear",
    "disgust",
    "surprise",
    name="emotionname",
)

report_format = sa.Enum("pdf", "html", "text", name="reportformat")

analysis_status = sa.Enum(
    "pending",
    "completed",
    "error",
    name="analysisstatus",
)

question_category = sa.Enum(
    "reflection",
    "action",
    "clarification",
    name="questioncategory",
)


def upgrade():
    """Create the 7 initial tables for MindFlow AI."""

    # 1. users table
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.VARCHAR(255), unique=True, nullable=False),
        sa.Column("name", sa.VARCHAR(128), nullable=False),
        sa.Column(
            "role",
            sa.Enum("therapist", "admin", name="userrole"),
            nullable=False,
            server_default="therapist",
        ),
        sa.Column("hashed_password", sa.VARCHAR(255), nullable=False),
        sa.Column("is_therapist", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column("last_login", sa.TIMESTAMP(), nullable=True),
    )

    # 2. clinical_notes table
    op.create_table(
        "clinical_notes",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("therapist_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("patient_hash", sa.CHAR(32), nullable=False),  # SHA-256 hash, no PII
        sa.Column("note_text", sa.TEXT(), nullable=False),
        sa.Column("language", sa.VARCHAR(10), nullable=False, server_default="es"),
        sa.Column("word_count", sa.INTEGER(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(
        "ix_clinical_notes_patient_hash", "clinical_notes", ["patient_hash"], unique=False
    )
    op.create_index("ix_clinical_notes_therapist", "clinical_notes", ["therapist_id"])

    # 3. analyses table
    op.create_table(
        "analyses",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column(
            "clinical_note_id",
            sa.UUID(),
            sa.ForeignKey("clinical_notes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", analysis_status, nullable=False, server_default="pending"),
        sa.Column("ia_model", sa.VARCHAR(50), nullable=False),  # 'claude-3.5-sonnet' or 'gpt-4o'
        sa.Column("processing_time", sa.FLOAT(), nullable=True),  # seconds
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_analyses_clinical_note", "analyses", ["clinical_note_id"])

    # 4. emotion_scores table
    op.create_table(
        "emotion_scores",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("analysis_id", sa.UUID(), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("emotion_name", emotion_names, nullable=False),
        sa.Column("score", sa.FLOAT(3, 2), nullable=False),  # 0.00 to 1.00
        sa.Column("confidence", sa.FLOAT(3, 2), nullable=True),
        sa.Column("timestamp", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_emotions_analysis", "emotion_scores", ["analysis_id"])
    op.create_index("ix_emotions_emotion", "emotion_scores", ["emotion_name"])

    # 5. cognitive_distortions table
    op.create_table(
        "cognitive_distortions",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("analysis_id", sa.UUID(), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("distortion_type", distortion_types, nullable=False),
        sa.Column("severity", sa.VARCHAR(20), nullable=True),  # 'low','medium','high'
        sa.Column("description", sa.TEXT(), nullable=True),
        sa.Column("detected_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_distortions_analysis", "cognitive_distortions", ["analysis_id"])
    op.create_index("ix_distortions_type", "cognitive_distortions", ["distortion_type"])

    # 6. guiding_questions table
    op.create_table(
        "guiding_questions",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("analysis_id", sa.UUID(), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_text", sa.TEXT(), nullable=False),
        sa.Column("category", question_category, nullable=False),
        sa.Column("priority", sa.INTEGER(), nullable=False, server_default="3"),  # 1-5 scale
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_questions_analysis", "guiding_questions", ["analysis_id"])
    op.create_index("ix_questions_priority", "guiding_questions", ["priority"])

    # 7. reports table
    op.create_table(
        "reports",
        sa.Column("id", sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column("analysis_id", sa.UUID(), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("format", report_format, nullable=False, server_default="pdf"),
        sa.Column("generated_content", sa.TEXT(), nullable=True),  # JSON with report data
        sa.Column("generated_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column("word_count", sa.INTEGER(), nullable=False, server_default="0"),
    )


def downgrade():
    """Drop all tables in reverse order."""

    op.drop_table("reports")
    op.drop_table("guiding_questions")
    op.drop_table("cognitive_distortions")
    op.drop_table("emotion_scores")
    op.drop_table("analyses")
    op.drop_table("clinical_notes")
    op.drop_table("users")

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS reportformat")
    op.execute("DROP TYPE IF EXISTS questioncategory")
    op.execute("DROP TYPE IF EXISTS distortiontype")
    op.execute("DROP TYPE IF EXISTS emotionname")
    op.execute("DROP TYPE IF EXISTS analysisstatus")
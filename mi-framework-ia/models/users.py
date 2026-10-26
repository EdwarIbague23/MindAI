"""User model for MindFlow AI authentication and authorization."""

import sqlalchemy as sa
from sqlalchemy import Column
from core.base import Base


class User(Base):
    """User entity representing therapists and admins in the system."""
    __tablename__ = "users"

    id = Column(sa.UUID(), primary_key=True, default=sa.text("gen_random_uuid()"))
    email = Column(sa.VARCHAR(255), unique=True, nullable=False)
    name = Column(sa.VARCHAR(128), nullable=False)
    role = Column(
        sa.Enum("therapist", "admin", name="userrole"),
        nullable=False,
        server_default="therapist",
    )
    hashed_password = Column(sa.VARCHAR(255), nullable=False)
    is_therapist = Column(sa.Boolean(), nullable=False, server_default=sa.false())
    created_at = Column(sa.TIMESTAMP(), nullable=False, server_default=sa.func.now())
    last_login = Column(sa.TIMESTAMP(), nullable=True)
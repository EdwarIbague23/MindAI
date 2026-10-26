"""Models package for MindFlow AI.

Contains SQLAlchemy model definitions for the 7 core tables:
- users
- clinical_notes
- analyses
- emotion_scores
- cognitive_distortions
- guiding_questions
- reports
"""

from .users import User
from .clinical_notes import ClinicalNote
from .analyses import Analysis
from .emotion_scores import EmotionScore
from .cognitive_distortions import CognitiveDistortion
from .guiding_questions import GuidingQuestion
from .reports import Report

# Import Base from the core module for Alembic target_metadata
from core.base import Base

__all__ = [
    "User",
    "ClinicalNote",
    "Analysis",
    "EmotionScore",
    "CognitiveDistortion",
    "GuidingQuestion",
    "Report",
]
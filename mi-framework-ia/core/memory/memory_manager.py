"""Unified read/write memory API used by all agents.

No agent or skill should access short_term/long_term directly:
all interactions go through this module for traceability and composability."""

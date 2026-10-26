# Changelog - Hybrid Project Update

## Overview
This commit summarizes the general update to the MindFlow AI project, reflecting the hybrid (Web + Mobile) architecture and the dual-storage infrastructure (PostgreSQL + Redis).

## Updated Technologies
- **PostgreSQL v16** - Relational database with ACID transactions, referential integrity, and tenant isolation via schemas/RLS
- **SQLAlchemy 2.x** - ORM layer for database interaction
- **Alembic** - Versioned migrations, reversible when viable, no credentials in scripts
- **Redis v7** - In-memory cache for active sessions, O(1) access time, TTL automatic, reduces latency in copilot responses

## Documentation Updates
- `README.md` - Updated stack technology table and infrastructure section
- `mi-framework-ia/docs/architecture.md` - System architecture with tenant isolation principles
- `mi-framework-ia/docs/decision_tecnologica.md` - Technology decisions with dual-storage justification
- `mi-framework-ia/docs/prompt_01_arquitectura.md` - Architecture base prompt with dual stack
- `mi-framework-ia/models/prompts_base_de_datos_origen.md` - SQLAlchemy 2.x + PostgreSQL v16 + Alembic models
- `mi-framework-ia/models/prompts_modelado_datos.md` - Data modeling V1 with dual storage rule

## Generated Diagrams (Mermaid .mmd format)
- `diagrama_clases_mindflow.mmd` - Class diagram with 7 SQLAlchemy models
- `diagrama_erd_mindflow.mmd` - Entity-Relation diagram with 7 database tables
- `diagrama_componentes_mindflow.mmd` - Component diagram of hybrid platform
- `casos_uso_mindflow.mmd` - Use case diagram with 3 actors and 9 use cases (US-001 to US-009)

## Architecture
Hybrid platform with:
- **Web client** (React + TypeScript)
- **Mobile client** (React Native)
- **API layer** (FastAPI + Python 3.11+)
- **Orchestrator Core** (agent registry, planner, executor, LLM gateway)
- **Database** (PostgreSQL v16 + SQLAlchemy 2.x + Alembic)
- **Cache** (Redis v7 for sessions and latency optimization)
- **LLM Provider** (Claude 3.5 Sonnet / GPT-4o through LLM Gateway)
- **S3 Storage** (for document metadata and references)

## Key Changes
- Dual storage architecture documented explicitly
- Tenant isolation via PostgreSQL schemas and RLS policies
- ACID compliance for clinical data
- Session management with Redis TTL automation
- 9 use cases (US-001 to US-009) covering V1 scope
- 7 data models with SQLAlchemy 2.x definitions
- 4 Mermaid diagrams for class, ER, component, and use case views

## Files Removed from Git (local reference only)
- STITCH_FULL_PROTOTYPE_SPEC.md
- STITCH_MOBILE_PROTOTYPE_SPEC.md
- STITCH_WEB_PROTOTYPE_SPEC.md
- AI_CODEGEN_PLAYBOOK.md

## Branch Information
- **main** - Updated with all hybrid architecture changes
- **product-designer** - Source branch for these changes
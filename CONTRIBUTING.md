# MindFlow AI — Contributing Guide

## 🌐 Language Standard

**All code, comments, and documentation must be in English.** This is a thesis project that will migrate to a professional production repository. English is the global standard for software engineering and academia.

## 📜 Conventional Commits

All commits must follow the Conventional Commits format:

```
<tipo>(alcance): descripción corta

Tipos:
- feat:     New feature
- fix:      Bug fix
- refactor: Refactoring (no behavior change)
- docs:     Documentation only
- style:    Formatting, semi-colons, etc.
- test:     Adding missing tests
- chore:    Maintenance tasks

## Ejemplos

```bash
git commit -m "feat(core): add PII pipeline middleware"
git commit -m "fix(llm_gateway): handle rate limit exceptions"
git commit -m "refactor(agents): rename emotion_agent to analysis_agent"
git commit -m "docs(readme): migrate to English technical writing"
git commit -m "test(emotion): add unit tests for PII anonimization"
```

## 📁 Repository Structure

```
MindFlow AI/
├── .vscode/           # IDE config
├── mi-framework-ia/   # Main Python framework
│   ├── agents/        # Specialist agents
│   ├── config/        # Framework configuration
│   ├── core/          # Core orchestration layer
│   ├── docs/          # Technical documentation
│   ├── evaluations/   # Tests and benchmarks
│   ├── interfaces/    # API and frontend contracts
│   ├── models/        # SQLAlchemy models
│   ├── skills/        # Modular skills
│   └── tools/         # Utility integrations
├── README.md          # Project overview (English)
├── scripts/           # Automation scripts
└── CONTRIBUTING.md    # This file
```

## 🛠️ Development Workflow

1. **Branch naming:** `feature/<name>`, `fix/<name>`, `refactor/<name>`, `docs/<name>`
2. **Commit format:** Conventional Commits (see above)
3. **Code style:** Black (Python), prettier (TypeScript/React)
4. **Pull Requests:** Must include description of changes and rationale
5. **Language check:** All new code comments must be in English

## 📝 Documentation Requirements

- All new `.md` files must start with a level-1 heading in English
- Docstrings in Python must be in English (google-style or numpy-style)
- YAML manifest `description` fields must be in English
- API descriptions must be in English

## ✅ Pre-commit Checklist

- [ ] All code comments are in English
- [ ] YAML manifest descriptions are in English
- [ ] Commit message follows Conventional Commits format
- [ ] No Spanish-only text in new source files
# MindFlow AI — Portable Audit Kit

This kit generates a provider-neutral context package from a local clone of the repository.

## Requirements

- Python 3.10+ recommended
- Git optional
- No third-party Python packages required

## Quick start

```bash
python audit_mindflow.py /path/to/MindAI
```

For a physical code audit where an AI needs to inspect source:

```bash
python audit_mindflow.py /path/to/MindAI --include-source
```

The output is created beside the repository:

```text
MindAI_AUDIT_CONTEXT/
├── manifest.json
├── data/
│   ├── inventory.json
│   ├── dependencies.json
│   ├── security_signals.json
│   ├── api_routes.json
│   ├── ai_signals.json
│   └── excluded_files.json
├── reports/
│   ├── AUDIT_README.md
│   ├── PROJECT_TREE.md
│   └── TECH_STACK.md
└── source/                 # only with --include-source
```

## Important security rule

Do NOT upload a real `.env`, private key, credential file, service-account file, database dump, patient data, clinical notes, or production export to an AI.

The generator excludes common secret-like filenames and does not include likely fixture/data files in `source/` by default. This is a safety filter, not a guarantee. Review `data/inventory.json` and `data/excluded_files.json` before sharing.

## Compatibility

The generated package is plain:
- Markdown
- JSON
- UTF-8 text
- source files

It is therefore usable with Gemini, Claude, ChatGPT, OpenCode, Antigravity, IDE agents, RAG systems, or custom agents.

## Recommended workflow

Repository → generator → audit context → AI auditor → verified audit → architecture decisions → implementation plan.

Do not let an AI modify code during the first audit.

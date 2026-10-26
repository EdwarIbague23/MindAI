# MindFlow Audit Context

This folder is a provider-neutral audit context generated from the repository.

## Ground rules
- `manifest.json` describes the generation run.
- `data/` contains machine-readable inventories.
- `reports/` contains human-readable summaries.
- `source/` exists only when `--include-source` was used.
- Secret-like files are excluded by filename pattern.
- Likely fixture/sample/health-data filenames are flagged; they are not automatically safe to share.
- Security signals are indicators, not confirmed vulnerabilities.
- API and AI detections are heuristic and require source verification.

## Recommended AI workflow
1. Read `manifest.json`.
2. Read all files under `reports/`.
3. Read `data/*.json`.
4. If `source/` exists, inspect source files and cite exact paths.
5. Distinguish IMPLEMENTED / PARTIAL / DOCUMENTED / ABSENT / NOT_VERIFIABLE.
6. Never infer implementation from README text alone.

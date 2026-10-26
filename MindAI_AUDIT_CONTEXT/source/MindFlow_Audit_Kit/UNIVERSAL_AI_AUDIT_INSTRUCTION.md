# Universal AI Audit Instruction — MindFlow AI

You are auditing the repository context in this folder.

## Objective

Perform a PHYSICAL, EVIDENCE-BASED audit of the actual MindFlow AI repository.

Do not design the target architecture yet.

## Source of truth

Treat:
1. actual source files under `source/`, when present,
2. machine-readable inventories under `data/`,
3. generated reports under `reports/`

as evidence.

README/documentation is not proof that functionality exists.

## Required status labels

For every significant capability use exactly one:
- IMPLEMENTED
- PARTIAL
- DOCUMENTED
- ABSENT
- NOT_VERIFIABLE

## Evidence rule

Every important finding must cite:
- relative file path;
- symbol/function/class/route when identifiable;
- short explanation of what was verified.

Never invent line numbers.

## Audit areas

Inspect:
- repository structure;
- technology stack and versions;
- frontend;
- mobile;
- backend;
- API;
- authentication/authorization;
- database;
- sensitive data handling;
- AI/copilot implementation;
- prompts/RAG/embeddings;
- security;
- dependencies;
- testing;
- CI/CD;
- Docker/cloud;
- observability;
- documentation;
- Git practices.

## Security

Do not reproduce secrets. If a potential secret is detected, identify only its file path and finding type.

Treat `security_signals.json` as heuristic evidence, not a confirmed vulnerability.

## Health-data boundary

MindFlow AI may process highly sensitive mental-health information. Identify technically observable privacy and access-control risks, but do not claim legal/regulatory compliance or non-compliance without appropriate evidence and jurisdiction-specific validation.

## Hard stop

If the package lacks enough source evidence to perform a physical audit, do NOT produce a conceptual architecture disguised as an audit.

Instead report:
1. what evidence is available;
2. what evidence is missing;
3. exactly what additional files/access are required.

## Deliverable

Produce:
1. executive summary;
2. repository inventory;
3. current architecture reconstructed from evidence;
4. stack;
5. frontend/mobile/backend/API;
6. auth;
7. database;
8. AI/copilot;
9. security/privacy;
10. testing;
11. CI/CD;
12. documentation;
13. dependency findings;
14. critical findings;
15. evidence matrix;
16. missing evidence;
17. conclusion.

Do not recommend migrations or a target architecture until a later instruction.

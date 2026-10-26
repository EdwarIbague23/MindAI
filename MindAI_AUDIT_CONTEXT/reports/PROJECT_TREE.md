# Project Tree

```text
MindAI-1/
├── CHANGELOG_Hybrid_Update.md
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── ai_signals.json
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── api_routes.json
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── dependencies.json
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── excluded_files.json
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── inventory.json
│   MindAI_AUDIT_CONTEXT
│   │   data
│   │   ├── security_signals.json
│   MindAI_AUDIT_CONTEXT
│   ├── manifest.json
├── MindFlow_Audit_Kit.zip
│   MindFlow_Audit_Kit
│   ├── .gitignore
│   MindFlow_Audit_Kit
│   ├── README.md
│   MindFlow_Audit_Kit
│   ├── UNIVERSAL_AI_AUDIT_INSTRUCTION.md
│   MindFlow_Audit_Kit
│   ├── audit_mindflow.py
├── README.md
│   mi-framework-ia
│   ├── .gitignore
│   mi-framework-ia
│   │   agents
│   │   ├── __init__.py
│   mi-framework-ia
│   │   agents
│   │   │   coding_agent
│   │   │   ├── agent.py
│   mi-framework-ia
│   │   agents
│   │   │   coding_agent
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   agents
│   │   │   emotion_analysis_agent
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   agents
│   │   │   emotion_analysis_agent
│   │   │   │   prompts
│   │   │   │   ├── analisis_emocional.md
│   mi-framework-ia
│   │   agents
│   │   │   emotion_analysis_agent
│   │   │   │   prompts
│   │   │   │   ├── legacy_bateria_08_10.md
│   mi-framework-ia
│   │   agents
│   │   │   research_agent
│   │   │   ├── agent.py
│   mi-framework-ia
│   │   agents
│   │   │   research_agent
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   ├── alembic.ini
│   mi-framework-ia
│   │   alembic
│   │   ├── env.py
│   mi-framework-ia
│   │   alembic
│   │   │   versions
│   │   │   ├── 20260921_initial_schema.py
│   mi-framework-ia
│   │   config
│   │   ├── agents.yaml
│   mi-framework-ia
│   │   config
│   │   │   environments
│   │   │   ├── dev.yaml
│   mi-framework-ia
│   │   config
│   │   │   environments
│   │   │   ├── prod.yaml
│   mi-framework-ia
│   │   config
│   │   ├── skills.yaml
│   mi-framework-ia
│   │   core
│   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   agent_base
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   agent_base
│   │   │   ├── agent_registry.py
│   mi-framework-ia
│   │   core
│   │   │   agent_base
│   │   │   ├── base_agent.py
│   mi-framework-ia
│   │   core
│   │   ├── base.py
│   mi-framework-ia
│   │   core
│   │   │   llm_gateway
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   llm_gateway
│   │   │   ├── cost_tracker.py
│   mi-framework-ia
│   │   core
│   │   │   llm_gateway
│   │   │   ├── provider_router.py
│   mi-framework-ia
│   │   core
│   │   │   memory
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   memory
│   │   │   ├── long_term.py
│   mi-framework-ia
│   │   core
│   │   │   memory
│   │   │   ├── memory_manager.py
│   mi-framework-ia
│   │   core
│   │   │   memory
│   │   │   ├── short_term.py
│   mi-framework-ia
│   │   core
│   │   │   observability
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   observability
│   │   │   ├── logger.py
│   mi-framework-ia
│   │   core
│   │   │   observability
│   │   │   ├── tracer.py
│   mi-framework-ia
│   │   core
│   │   │   orchestrator
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   orchestrator
│   │   │   ├── executor.py
│   mi-framework-ia
│   │   core
│   │   │   orchestrator
│   │   │   ├── planner.py
│   mi-framework-ia
│   │   core
│   │   │   orchestrator
│   │   │   ├── router.py
│   mi-framework-ia
│   │   core
│   │   ├── prompt_llm_gateway.md
│   mi-framework-ia
│   │   core
│   │   ├── prompts_seguridad_cripto.md
│   mi-framework-ia
│   │   core
│   │   │   security
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   security
│   │   │   ├── guardrails.py
│   mi-framework-ia
│   │   core
│   │   │   security
│   │   │   ├── permissions.py
│   mi-framework-ia
│   │   core
│   │   │   security
│   │   │   ├── prompts_anonimizacion_pii.md
│   mi-framework-ia
│   │   core
│   │   │   security
│   │   │   ├── prompts_pii_anonymizer_origen.md
│   mi-framework-ia
│   │   core
│   │   │   skill_base
│   │   │   ├── __init__.py
│   mi-framework-ia
│   │   core
│   │   │   skill_base
│   │   │   ├── base_skill.py
│   mi-framework-ia
│   │   core
│   │   │   skill_base
│   │   │   ├── skill_registry.py
│   mi-framework-ia
│   │   deployment
│   │   ├── prompts_devops.md
│   mi-framework-ia
│   │   deployment
│   │   ├── prompts_infraestructura_devops_origen.md
│   mi-framework-ia
│   │   docs
│   │   ├── 01_contexto_y_entrevista.md
│   mi-framework-ia
│   │   docs
│   │   ├── 02_requerimientos_rf_rnf.md
│   mi-framework-ia
│   │   docs
│   │   ├── 03_historias_de_usuario.md
│   mi-framework-ia
│   │   docs
│   │   ├── Diagrama_casos_uso_mindflow.mmd
│   mi-framework-ia
│   │   docs
│   │   ├── architecture.md
│   mi-framework-ia
│   │   docs
│   │   ├── decision_tecnologica.md
│   mi-framework-ia
│   │   docs
│   │   ├── diagrama_componentes_mindflow.drawio
│   mi-framework-ia
│   │   docs
│   │   ├── diagrama_componentes_mindflow.mmd
│   mi-framework-ia
│   │   docs
│   │   ├── diagrama_de_clases_mindflow.mmd
│   mi-framework-ia
│   │   docs
│   │   ├── diagrama_erd_mindflow.drawio
│   mi-framework-ia
│   │   docs
│   │   ├── diagrama_erd_mindflow.mmd
│   mi-framework-ia
│   │   docs
│   │   ├── manifest_schema.md
│   mi-framework-ia
│   │   docs
│   │   ├── prompt_01_arquitectura.md
│   mi-framework-ia
│   │   evaluations
│   │   │   agent_benchmarks
│   │   │   ├── README.md
│   mi-framework-ia
│   │   evaluations
│   │   │   agent_benchmarks
│   │   │   ├── emotion_analysis_agent.md
│   mi-framework-ia
│   │   evaluations
│   │   ├── prompts_client_testing.md
│   mi-framework-ia
│   │   evaluations
│   │   ├── prompts_testing_unitario_mock.md
│   mi-framework-ia
│   │   evaluations
│   │   │   skill_tests
│   │   │   ├── README.md
│   mi-framework-ia
│   │   interfaces
│   │   │   api
│   │   │   ├── main.py
│   mi-framework-ia
│   │   interfaces
│   │   │   api
│   │   │   ├── prompts_api_dominio_v1.md
│   mi-framework-ia
│   │   interfaces
│   │   │   api
│   │   │   ├── prompts_contratos_y_seguridad.md
│   mi-framework-ia
│   │   interfaces
│   │   │   api
│   │   │   ├── prompts_schemas_openapi.md
│   mi-framework-ia
│   │   interfaces
│   │   │   api
│   │   │   ├── prompts_seguridad_api.md
│   mi-framework-ia
│   │   interfaces
│   │   │   chat_ui
│   │   │   ├── README.md
│   mi-framework-ia
│   │   interfaces
│   │   │   cli
│   │   │   ├── main.py
│   mi-framework-ia
│   │   interfaces
│   │   │   frontend
│   │   │   ├── prompts_export_pdf_origen.md
│   mi-framework-ia
│   │   interfaces
│   │   │   frontend
│   │   │   ├── prompts_report_pdf.md
│   mi-framework-ia
│   │   interfaces
│   │   │   frontend
│   │   │   ├── prompts_ui_react.md
│   mi-framework-ia
│   │   interfaces
│   │   │   frontend
│   │   │   ├── prompts_ui_roles_react.md
│   mi-framework-ia
│   │   interfaces
│   │   │   mobile
│   │   │   ├── prompts_mobile_react_native.md
│   mi-framework-ia
│   │   models
│   │   ├── __init__.py
│   mi-framework-ia
│   │   models
│   │   ├── analyses.py
│   mi-framework-ia
│   │   models
│   │   ├── clinical_notes.py
│   mi-framework-ia
│   │   models
│   │   ├── cognitive_distortions.py
│   mi-framework-ia
│   │   models
│   │   ├── emotion_scores.py
│   mi-framework-ia
│   │   models
│   │   ├── guiding_questions.py
│   mi-framework-ia
│   │   models
│   │   ├── prompts_base_de_datos_origen.md
│   mi-framework-ia
│   │   models
│   │   ├── prompts_modelado_datos.md
│   mi-framework-ia
│   │   models
│   │   ├── reports.py
│   mi-framework-ia
│   │   models
│   │   ├── users.py
│   mi-framework-ia
│   │   skills
│   │   ├── __init__.py
│   mi-framework-ia
│   │   skills
│   │   │   code_executor
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   skills
│   │   │   code_executor
│   │   │   ├── skill.py
│   mi-framework-ia
│   │   skills
│   │   │   db_query
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   skills
│   │   │   db_query
│   │   │   ├── skill.py
│   mi-framework-ia
│   │   skills
│   │   │   document_generator
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   skills
│   │   │   document_generator
│   │   │   ├── prompts_document_generator.md
│   mi-framework-ia
│   │   skills
│   │   │   document_generator
│   │   │   ├── skill.py
│   mi-framework-ia
│   │   skills
│   │   │   web_search
│   │   │   ├── manifest.yaml
│   mi-framework-ia
│   │   skills
│   │   │   web_search
│   │   │   ├── skill.py
│   mi-framework-ia
│   │   tools
│   │   ├── __init__.py
│   mi-framework-ia
│   │   tools
│   │   ├── github_client.py
│   mi-framework-ia
│   │   tools
│   │   ├── slack_client.py
│   scripts
│   ├── update_readme.ps1
│   scripts
│   ├── watch_readme.ps1
```

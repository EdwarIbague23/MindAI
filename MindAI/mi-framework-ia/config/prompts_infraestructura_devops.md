# Prompts 23, 24 y 25 – Docker, CI/CD y DevOps

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 34‑37).  
**Bloque:** F – Testing & DevOps.  
**Prioridad:** 4 (todos).  
**Área / Submódulo:** DevOps / Containerización / Local Infrastructure / Continuous Integration.  
**Rol Senior:** Senior DevOps Engineer / Senior DevOps Architect / Senior DevSecOps Engineer.

---

## Prompt 23 – Dockerfile Multi‑Stage

### Tarea específica y casos borde

Crear un Dockerfile multi‑stage para FastAPI, separando builder y runtime.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `docker build -t mindflow-backend .` | Imagen mínima razonable; usuario no‑root; `.dockerignore` configurado; No incluir `.env` ni secretos; Healthcheck definido; No ejecutar como root. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `docker build -t mindflow-backend .` | Imagen lista para producción. |

### Restricciones técnicas y de seguridad

- Imagen mínima razonable.
- Usuario no‑root.
- `.dockerignore` configurado.
- No incluir `.env` ni secretos.
- Healthcheck definido.
- No ejecutar como root.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior DevOps Engineer specialized in Docker and production Python deployments.

Context:
DevOps / Containerization. Create a multi‑stage Dockerfile for FastAPI, separating the builder and runtime stages.

Task:
Create a multi‑stage Dockerfile for FastAPI, separating the builder and runtime stages.

Format:

Examples of the expected format and level:
docker build -t mindflow-backend .

Constraints:
- Reasonably minimal image.
- Non‑root user.
- .dockerignore configured.
- Do not include .env or secrets.
- Healthcheck defined.
- Do not run as root.
```
---

## Prompt 24 – Docker Compose

### Tarea específica y casos borde

Crear `docker-compose.yml` con los servicios backend, frontend, postgres y redis (este último preparado para rate limiting futuro).

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `docker compose up --build` | Servicios Levantados: backend, frontend, postgres, redis. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `docker compose up --build` | Contenedores corriendo en local. |

### Restricciones técnicas y de seguridad

- Healthchecks en todos los servicios.
- Volúmenes persistentes para PostgreSQL.
- Secrets mediante `.env`.
- No exponer PostgreSQL públicamente sin necesidad.
- Redes internas.
- Configuración separada para producción.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior DevOps Architect.

Context:
DevOps / Local Infrastructure. Create docker-compose.yml with the backend, frontend, postgres, and redis services (the latter set up for future rate limiting).

Task:
Create docker-compose.yml with the backend, frontend, postgres, and redis services (the latter set up for future rate limiting).

Format:

Examples of the expected format and level:
--build

Constraints:
- Healthchecks on all services.
- Persistent volumes for PostgreSQL.
- Secrets via .env.
- Do not expose PostgreSQL publicly without need.
- Internal networks.
- Separate configuration for production.
```
---

## Prompt 25 – GitHub Actions CI/CD

### Tarea específica y casos borde

Crear `.github/workflows/ci.yml` con el pipeline: Docker build. No incluir secretos en el YAML; usar GitHub Secrets; no imprimir variables sensibles; bloquear merge si fallan los tests; dependencias fijadas cuando sea razonable; análisis de seguridad/dependencias recomendado.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| Pull Request abierto sobre main | CI = passed (build exitoso) o CI = failed (test fallido, bloquea el merge). |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| PR mergeado | Checks verdes; merge autorizado. |

### Restricciones técnicas y de seguridad

- No incluir secretos en el YAML.
- Utilizar GitHub Secrets.
- No imprimir variables sensibles.
- Bloquear merge si fallan los tests.
- Dependencias fijadas cuando sea razonable.
- Análisis de seguridad/dependencias recomendado.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior DevSecOps Engineer specialized in GitHub Actions, Python, and React.

Context:
DevOps / Continuous Integration. Create .github/workflows/ci.yml with the pipeline: Docker build.

Task:

Format:

Examples of the expected format and level:
merge)

Constraints:
- Do not include secrets in the YAML; use GitHub Secrets; do not print sensitive variables; block the merge if tests fail; pin dependencies when reasonable; a security/dependency scan is recommended.
```
---
*Pipeline CI/CD y configuración de contenedores para MindFlow AI.*
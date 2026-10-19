# Prompt 06 – Cifrado AES‑256 para Notas

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 13‑14).  
**Bloque:** B – Seguridad & PII.  
**Prioridad:** 1.  
**Área / Submódulo:** Seguridad / Cifrado de Información Clínica.  
**Rol Senior:** Senior Application Security Engineer especializado en criptografía aplicada y protección de datos sensibles.

## Tarea específica y casos borde

Implementar `encryption_service.py` usando cifrado autenticado basado en AES‑256 (preferiblemente AES‑256‑GCM), con funciones `encrypt()` y `decrypt()`.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `plaintext = "Nota clínica anonimizada..."` | `ciphertext + nonce + authentication tag`. La base de datos nunca almacena la nota como texto plano. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `encrypt("hola")` | `ciphertext` (binario) + nonce + tag. |
| `decrypt(ciphertext)` | `"hola"`. |
| `decrypt(tampered_ciphertext)` | Error de autenticación (detecta manipulación). |

### Restricciones técnicas y de seguridad

- AES‑256.
- Nunca hardcodear claves.
- Clave por variable de entorno / secret manager.
- No reutilizar nonce con la misma clave.
- Detectar manipulación mediante autenticación.
- No escribir plaintext en logs.
- Diseñar rotación de claves como extensión futura.
- Documentar el modelo de gestión de claves.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Application Security Engineer specialized in applied cryptography and sensitive data protection.

Context:
Security / Clinical Information Encryption. Implement encryption_service.py using authenticated encryption based on AES‑256 (preferably AES‑256‑GCM), with encrypt() and decrypt() functions.

Task:
Implement encryption_service.py using authenticated encryption based on AES‑256 (preferably AES‑256‑GCM), with encrypt() and decrypt() functions.

Format:
note as plain text.

Examples of the expected format and level:
- encrypt("hola")
- decrypt(ciphertext)
- decrypt(tampered_ciphertext)

Constraints:
- AES‑256.
- Never hardcode keys; key via environment variable / secret manager.
- Do not reuse a nonce with the same key; detect tampering through authentication; do not write plaintext to logs; design key rotation as a future extension; document the key management model.
```
---
*Implementación de cifrado autenticado para historias clínicas.*
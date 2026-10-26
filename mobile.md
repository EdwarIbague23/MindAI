# Mobile — MindFlow AI

Estado: **propuesta futura, no implementada**.

No existe carpeta ni código móvil en el repositorio. El MVP se usa desde la SPA web
(`interfaces/frontend`). Este documento solo registra la evaluación preliminar.

## Escenarios que justificarían móvil

- El terapeuta necesita dictar o cargar notas entre sesiones sin un portátil.
- Se requiere notificación de análisis listo o de triaje de riesgo alto.
- Se necesita almacenamiento seguro local de borradores.

## Opciones a evaluar

| Opción | Ventaja | Riesgo |
|---|---|---|
| React Native + Expo | Reutiliza TypeScript y contratos HTTP | Nuevo pipeline de build y pruebas |
| PWA sobre la SPA actual | Menor coste, instalación y offline básico | Acceso limitado a APIs nativas |
| No desarrollar móvil | Cero coste; el MVP ya es responsive | Sin uso en movilidad real |

## Restricciones obligatorias

- Tokens en almacenamiento seguro (no `localStorage`).
- Prohibido registrar texto clínico o PII.
- Disclaimer ético visible y aceptación explícita.
- TLS obligatorio; sin endpoints nuevos que omitan autenticación.
- Pruebas en dispositivos reales antes de cualquier piloto.

No hay decisión tomada, cronograma ni código asociado. Cualquier stack mencionado en
borradores anteriores (Expo Router, SecureStore, victory-native, etc.) es exploratorio.

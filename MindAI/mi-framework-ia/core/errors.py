# -*- coding: utf-8 -*-
class MindFlowError(Exception):
    code = "MIND_FLOW_ERROR"
    http_status = 500
    public_message = "No fue posible procesar la solicitud."

    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or self.public_message)
        self.detail = message or self.public_message


class ValidationError(MindFlowError):
    code = "VALIDATION_ERROR"
    http_status = 400
    public_message = "La solicitud no es valida."


class PIIRedactionError(MindFlowError):
    code = "PII_REDACTION_ERROR"
    http_status = 422
    public_message = "No fue posible anonimizar el contenido clinico."


class ProviderUnavailableError(MindFlowError):
    code = "PROVIDER_UNAVAILABLE"
    http_status = 503
    public_message = "El proveedor de analisis no esta disponible."


class LLMTimeoutError(ProviderUnavailableError):
    code = "LLM_TIMEOUT"
    public_message = "El analisis excedio el tiempo maximo permitido."


class RateLimitError(MindFlowError):
    code = "RATE_LIMIT_EXCEEDED"
    http_status = 429
    public_message = "Se excedio el limite de solicitudes."


class StructuredOutputError(MindFlowError):
    code = "STRUCTURED_OUTPUT_ERROR"
    http_status = 502
    public_message = "La respuesta del modelo no cumple el esquema requerido."


class PermissionDeniedError(MindFlowError):
    code = "PERMISSION_DENIED"
    http_status = 403
    public_message = "La operacion no esta autorizada."


class AuthenticationError(MindFlowError):
    code = "AUTHENTICATION_ERROR"
    http_status = 401
    public_message = "Credenciales invalidas o sesion expirada."


class NotFoundError(MindFlowError):
    code = "NOT_FOUND"
    http_status = 404
    public_message = "El recurso solicitado no existe."

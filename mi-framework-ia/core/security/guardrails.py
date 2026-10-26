"""Input/output validation and security filters for MindFlow AI."""

import re
from typing import Optional, Dict, Any, List


# PATTERNS de expresiones regulares para detección de PII (Ley 1581 / Decreto 1377)
PII_PATTERNS: Dict[str, re.Pattern] = {
    "email": re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"),
    "colombia_id": re.compile(r"\d{8,10}"),       # CC, NIT básico
    "phone_colombia": re.compile(r"(?:\+57|57)?3[0-9]{8}"),
    "full_name": re.compile(r"(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)\s+(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)"),
    "credit_card": re.compile(r"\b(?:\d[ -]*?){13,16}\b"),
    "medical_record": re.compile(r"\bMED-\d{4,8}\b|EXP-\d{3,6}\b"),
}

# Palabras clave de toxicidad / lenguaje inapropiado para bloqueo
TOXICITY_KEYWORDS: List[str] = [
    "matar", "asesinar", "hurtar", "robar", "dañar",
    "odio", "prejudicar", "vengar", "threaten",
]

# Tokens de enmascaramiento para PII redactada
REDACT_TOKEN = "[PIX_REDACTED]"


def redact_pii(text: str) -> str:
    """
    Anonimiza datos personales sensibles en texto clínico antes de enviar al LLM.
    Aplica replacements por tipos de PII detectados, preservando el contexto no sensible.
    
    Args:
        text: Texto de entrada que puede contener datos de salud identificables
        
    Returns:
        Texto con PII reemplazado por tokens de enmascaramiento
    """
    if not text:
        return text
    
    result = text
    
    # Orden importante: patterns más específicos primero
    for pattern_name, pattern in sorted(PII_PATTERNS.items(), key=lambda x: len(x[1].pattern), reverse=True):
        matches = pattern.findall(result)
        if matches:
            # Reemplazar todas las ocurrencias encontradas
            for match in set(matches):
                result = result.replace(match, REDACT_TOKEN)
    
    # Normalizar espacios múltiples que puedan haber quedado
    result = re.sub(r"\s+", " ", result).strip()
    
    return result


def detect_toxicity(text: str) -> bool:
    """
    Detecta lenguaje tóxico o amenazas en la entrada del usuario.
    Retorna True si se detecta contenido que requiere rechazo/filtrado.
    
    Args:
        text: Texto a evaluar
        
    Returns:
        bool: True si se detectó toxicidad
    """
    if not text:
        return False
    
    text_lower = text.lower()
    
    for keyword in TOXICITY_KEYWORDS:
        if keyword in text_lower:
            return True
    
    # También verificar patrones de amenaza directa
    threat_patterns = [r"\b(voy a|vamos a|te voy|te voy a)" r".*(matar|asesinar|hacer\ daño)"]
    for pattern in threat_patterns:
        if re.search(pattern, text_lower):
            return True
    
    return False


def validate_prompt_injection(text: str) -> Optional[Dict[str, Any]]:
    """
    Detecta posibles inyecciones de prompt en la entrada del usuario.
    Retorna un dict con el resultado o None si la entrada es segura.
    
    Patrones comunes de inyection:
    - "Ignore previous instructions"
    - "Forget system prompts"
    - "You are now"
    - System role override attempts
    """
    if not text:
        return None
    
    injection_patterns = [
        r"ignore\s+previous\s+instruction",
        r"forget\s+all\s+previous",
        r"new\s+system\s+prompt",
        r"^\s*you\s+are\s+",
        r"\b(system|admin|root)\b\s*:",
        r"\boverride\b",
        r"\b<system>",
    ]
    
    text_lower = text.lower()
    
    for pattern in injection_patterns:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return {
                "detected": True,
                "pattern": pattern,
                "risk_level": "high",
                "original_text": text[:100] + "..." if len(text) > 100 else text,
            }
    
    return None


def sanitize_input(text: str) -> Dict[str, Any]:
    """
    Pipeline completo de sanitización de entrada: PII → toxicidad → inyección.
    Retorna un dict con el texto limpio y el reporte de validación.
    
    Args:
        text: Texto de entrada crudo del usuario
        
    Returns:
        Dict con:
        - "text": texto sanitizado
        - "pii_detected": bool
        - "toxicity_detected": bool  
        - "injection_detected": Optional dict
    """
    pii_redacted = redact_pii(text)
    
    toxicity_flag = detect_toxicity(pii_redacted)
    
    injection_result = validate_prompt_injection(pii_redacted)
    
    return {
        "text": pii_redacted,
        "pii_detected": True if pii_redacted != text else False,
        "toxicity_detected": toxicity_flag,
        "injection_detected": injection_result,
    }


def get_pii_statistics(text: str) -> Dict[str, int]:
    """
    Cuenta cuántos tipos de PII están presentes en el texto.
    Útil para reportes de telemetría y cumplimiento de Ley 1581.
    
    Args:
        text: Texto a analizar
        
    Returns:
        Dict con conteo por tipo de PII
    """
    stats: Dict[str, int] = {}
    
    for pattern_name, pattern in PII_PATTERNS.items():
        matches = pattern.findall(text)
        if matches:
            stats[pattern_name] = len(matches)
    
    return stats


# Función de utilidad para exportar en entornos que requieren deserialización simple
__all__ = [
    "redact_pii",
    "detect_toxicity", 
    "validate_prompt_injection",
    "sanitize_input",
    "get_pii_statistics",
    "PII_PATTERNS",
    "TOXICITY_KEYWORDS",
]
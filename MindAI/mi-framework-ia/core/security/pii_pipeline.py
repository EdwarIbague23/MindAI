# -*- coding: utf-8 -*-
"""Deteccion y anonimizacion obligatoria de PII (Regex + spaCy es_core_news_sm).

Nunca expone ni registra los valores detectados: solo contadores por categoria.
"""

import re
from functools import lru_cache
from typing import Any

from core.config import get_settings

REDACTION_LABELS = {
    "emails": "[EMAIL_REDACTED]",
    "phones": "[PHONE_REDACTED]",
    "ids": "[ID_REDACTED]",
    "names": "[NAME_REDACTED]",
    "addresses": "[ADDRESS_REDACTED]",
    "dates": "[DATE_REDACTED]",
    "urls": "[URL_REDACTED]",
    "medical_records": "[MEDICAL_RECORD_REDACTED]",
}


@lru_cache
def _load_nlp():
    try:
        import spacy

        return spacy.load(get_settings().spacy_model)
    except Exception:
        return None


class PIIPipeline:
    URL_RE = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
    EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+", re.IGNORECASE)
    PHONE_RE = re.compile(r"(?<!\d)(\+?57[-\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}(?!\d)")
    MEDICAL_RECORD_RE = re.compile(r"\b(?:hc|historia\s+clinica|historia\s+clínica)\s*(?:n[o°.]*|#)?\s*[:#-]?\s*\d{3,}\b", re.IGNORECASE)
    ADDRESS_RE = re.compile(
        r"\b(?:calle|cl|carrera|cra|avenida|av|diagonal|diag|transversal|tv|manzana|mz)\s*\.?\s*\d{1,4}[a-z]?"
        r"\s*(?:#|no\.?|n[o°])?\s*\d{1,4}[a-z]?\s*[-–]?\s*\d{0,4}\b",
        re.IGNORECASE,
    )
    DATE_RE = re.compile(
        r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|"
        r"\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)"
        r"(?:\s+de\s+\d{4})?)\b",
        re.IGNORECASE,
    )
    ID_RE = re.compile(r"(?<!\d)\d{6,10}(?!\d)")

    @classmethod
    def redact(cls, text: str, use_ner: bool = True) -> tuple[str, dict[str, int]]:
        redacted = text or ""
        findings = {key: 0 for key in REDACTION_LABELS}

        redacted, findings["urls"] = cls.URL_RE.subn(REDACTION_LABELS["urls"], redacted)
        redacted, findings["emails"] = cls.EMAIL_RE.subn(REDACTION_LABELS["emails"], redacted)
        redacted, findings["phones"] = cls.PHONE_RE.subn(REDACTION_LABELS["phones"], redacted)
        redacted, findings["medical_records"] = cls.MEDICAL_RECORD_RE.subn(
            REDACTION_LABELS["medical_records"], redacted
        )
        redacted, findings["addresses"] = cls.ADDRESS_RE.subn(REDACTION_LABELS["addresses"], redacted)
        redacted, findings["dates"] = cls.DATE_RE.subn(REDACTION_LABELS["dates"], redacted)
        redacted, findings["ids"] = cls.ID_RE.subn(REDACTION_LABELS["ids"], redacted)

        if use_ner:
            nlp = _load_nlp()
            if nlp is not None:
                doc = nlp(redacted)
                names = {
                    entity.text.strip()
                    for entity in doc.ents
                    if entity.label_ in {"PER", "PERSON"} and len(entity.text.strip()) > 2
                }
                for name in sorted(names, key=len, reverse=True):
                    pattern = re.compile(rf"(?<!\w){re.escape(name)}(?!\w)")
                    redacted, count = pattern.subn(REDACTION_LABELS["names"], redacted)
                    findings["names"] += count

        return redacted, findings

    @classmethod
    def anonymize(cls, text: str) -> dict[str, Any]:
        redacted, findings = cls.redact(text)
        return {
            "anonymized_text": redacted,
            "entities_detected": sum(findings.values()),
            "findings": findings,
        }

    @classmethod
    def is_safe(cls, text: str) -> bool:
        _, findings = cls.redact(text)
        return sum(findings.values()) == 0

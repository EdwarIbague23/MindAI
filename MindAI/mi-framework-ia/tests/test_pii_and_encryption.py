# -*- coding: utf-8 -*-
import pytest

from core.errors import StructuredOutputError
from core.security.encryption_service import EncryptionService
from core.security.guardrails import Guardrails
from core.security.pii_pipeline import PIIPipeline


def test_pii_redacts_email_phone_and_id_without_leaking_values():
    text = "Contacto: maria@example.com, telefono 3105551234, documento 1020304050."
    result = PIIPipeline.anonymize(text)
    redacted = result["anonymized_text"]

    assert "maria@example.com" not in redacted
    assert "3105551234" not in redacted
    assert "1020304050" not in redacted
    assert result["entities_detected"] >= 3
    assert all(isinstance(value, int) for value in result["findings"].values())


def test_risk_detection_does_not_block_triage_text():
    text = "Pienso en el suicidio y no quiero vivir."
    ok, _ = Guardrails.validate_input(text)
    assert ok is True
    assert Guardrails.detect_risk(text) is True


def test_guardrails_reject_diagnostic_fields():
    with pytest.raises(StructuredOutputError):
        Guardrails.assert_non_diagnostic({"summary": "ok", "diagnosis": "depresion"})


def test_encryption_roundtrip_and_tamper_detection():
    service = EncryptionService(key=b"0" * 32)
    token = service.encrypt("nota clinica sensible")
    assert service.decrypt(token) == "nota clinica sensible"

    tampered = token[:-2] + ("AA" if token[-2:] != "AA" else "BB")
    with pytest.raises(ValueError):
        service.decrypt(tampered)


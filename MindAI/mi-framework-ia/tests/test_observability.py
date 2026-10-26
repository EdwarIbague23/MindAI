# -*- coding: utf-8 -*-
import json
import logging

from core.observability.logger import JsonFormatter
from core.observability.tracer import (
    get_analysis_id,
    get_request_id,
    new_request_id,
    set_analysis_id,
    set_request_id,
)


def _record(**fields) -> logging.LogRecord:
    record = logging.LogRecord(
        name="mindflow.test",
        level=logging.INFO,
        pathname=__file__,
        lineno=1,
        msg="evento",
        args=(),
        exc_info=None,
    )
    record.fields = fields
    return record


def test_json_logger_redacts_sensitive_clinical_fields():
    payload = json.loads(
        JsonFormatter().format(
            _record(note="texto clinico secreto", summary="resumen sensible", agent="triage_agent")
        )
    )

    assert "[REDACTED]" in str(payload.values())
    assert "secreto" not in json.dumps(payload)
    assert "resumen sensible" not in json.dumps(payload)
    assert payload["agent"] == "triage_agent"


def test_tracer_context_propagates_request_and_analysis_ids():
    request_id = set_request_id(new_request_id())
    set_analysis_id("analysis-123")

    assert get_request_id() == request_id
    assert get_analysis_id() == "analysis-123"

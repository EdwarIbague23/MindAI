# -*- coding: utf-8 -*-
"""Proveedores LLM: mock deterministico y adaptadores OpenAI/Anthropic."""

import re
from abc import ABC, abstractmethod
from typing import Any

import httpx

from core.config import Settings
from core.errors import ProviderUnavailableError
from core.llm_gateway.json_parser import parse_json_response
from core.security.guardrails import Guardrails

SYSTEM_PROMPT = (
    "Eres un asistente clinico de apoyo para terapeutas. Analiza exclusivamente el texto "
    "anonimizado recibido. Devuelve JSON con esta forma: "
    '{"emotions":[{"name":"ansiedad","score":0-100,"evidence":"cita textual"}],'
    '"distortions":[{"type":"catastrofizacion","evidence":"cita textual","explanation":"..."}],'
    '"guiding_questions":[{"question":"...","rationale":"..."}],'
    '"triage_level":"low|medium|high","summary":"resumen breve","risk_detected":false}. '
    "Prohibido diagnosticar, prescribir o afirmar causalidad clinica. No inventes citas. "
    "Si no hay evidencia suficiente devuelve listas vacias."
)

EMOTION_KEYWORDS: dict[str, list[str]] = {
    "ansiedad": ["ansiedad", "ansioso", "preocup", "nervios", "angustia", "inquiet"],
    "tristeza": ["triste", "desanim", "llor", "deprim", "soledad", "vacío", "vacio"],
    "miedo": ["miedo", "temor", "pánico", "panico", "asust", "terror"],
    "ira": ["ira", "enoj", "rabia", "furia", "molest", "irrit"],
    "frustracion": ["frustr", "no puedo", "rendir", "estanc", "impotencia"],
    "alegria": ["alegr", "feliz", "content", "entusiasm", "logro", "mejor"],
    "culpa": ["culpa", "culpable", "debería", "deberia", "mi error", "fallé", "falle"],
    "verguenza": ["verguenza", "vergüenza", "pena", "humill", "ridicul"],
}

DISTORTION_KEYWORDS: dict[str, tuple[list[str], str]] = {
    "catastrofizacion": (
        ["peor", "desastre", "nunca", "fracaso", "terrible", "arruin"],
        "Tendencia a anticipar el escenario mas adverso con evidencia limitada.",
    ),
    "pensamiento dicotomico": (
        ["todo o nada", "perfecto", "siempre", "nunca", "completamente", "fracas"],
        "El texto presenta opciones extremas sin matices intermedios.",
    ),
    "generalizacion": (
        ["siempre", "nunca", "todos", "nadie", "ninguno", "cada vez"],
        "Se observa una conclusion amplia a partir de un evento puntual.",
    ),
    "lectura de mente": (
        ["creen que", "piensan que", "seguro piensa", "saben que", "me juzgan"],
        "Se infiere el pensamiento de otras personas sin evidencia directa.",
    ),
}

GUIDING_QUESTIONS = [
    {
        "question": "¿Que evidencia a favor y en contra tienes de este pensamiento?",
        "rationale": "Reestructuracion cognitiva basada en evidencia.",
    },
    {
        "question": "¿Que le dirias a una persona cercana que estuviera en esta situacion?",
        "rationale": "Promueve distancia cognitiva y auto-compasion.",
    },
    {
        "question": "¿Cual es el peor escenario realista y como podrias afrontarlo?",
        "rationale": "Reduce la anticipacion catastrofica con un plan concreto.",
    },
]


def _sentence_for(text: str, keywords: list[str]) -> str | None:
    sentences = re.split(r"(?<=[.!?])\s+|\n+", text)
    for sentence in sentences:
        lowered = sentence.lower()
        if any(keyword in lowered for keyword in keywords):
            return sentence.strip()[:280]
    return None


class LLMProvider(ABC):
    name = "abstract"

    @abstractmethod
    async def analyze(self, text: str) -> dict[str, Any]:
        """Analiza texto anonimizado y devuelve un diccionario estructurado."""


class MockLLMProvider(LLMProvider):
    name = "mock"

    async def analyze(self, text: str) -> dict[str, Any]:
        lowered = text.lower()
        emotions: list[dict[str, Any]] = []
        for name, keywords in EMOTION_KEYWORDS.items():
            hits = sum(lowered.count(keyword) for keyword in keywords)
            score = min(95, 8 + hits * 22) if hits else 5
            emotions.append(
                {
                    "name": name,
                    "score": score,
                    "evidence": _sentence_for(text, keywords),
                }
            )
        emotions.sort(key=lambda item: item["score"], reverse=True)

        distortions: list[dict[str, Any]] = []
        for name, (keywords, explanation) in DISTORTION_KEYWORDS.items():
            evidence = _sentence_for(text, keywords)
            if evidence:
                distortions.append({"type": name, "evidence": evidence, "explanation": explanation})

        risk_detected = Guardrails.detect_risk(text)
        top_scores = [item["score"] for item in emotions[:2]]
        if risk_detected:
            triage = "high"
        elif sum(top_scores) >= 140 or len(distortions) >= 2:
            triage = "medium"
        else:
            triage = "low"

        top_emotions = [f"{item['name']} ({item['score']}/100)" for item in emotions[:2]]
        summary = (
            f"El analisis sugiere senales de {', '.join(top_emotions)}. "
            f"Se identificaron {len(distortions)} patrones de distorsion cognitiva con evidencia textual. "
            f"Nivel de atencion sugerido: {triage}. "
            "Este resultado es apoyo analitico y no constituye diagnostico clinico."
        )

        return {
            "emotions": emotions,
            "distortions": distortions,
            "guiding_questions": GUIDING_QUESTIONS,
            "triage_level": triage,
            "summary": summary,
            "risk_detected": risk_detected,
        }


class OpenAIProvider(LLMProvider):
    name = "openai"

    def __init__(self, settings: Settings) -> None:
        self.api_key = settings.openai_api_key
        self.model = settings.default_model
        self.timeout = settings.llm_timeout_seconds

    async def analyze(self, text: str) -> dict[str, Any]:
        if not self.api_key:
            raise ProviderUnavailableError("OPENAI_API_KEY no configurada")
        payload = {
            "model": self.model,
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
        }
        headers = {"Authorization": f"Bearer {self.api_key}"}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions", json=payload, headers=headers
            )
        if response.status_code >= 400:
            raise ProviderUnavailableError("OpenAI devolvio un error de servicio")
        content = response.json()["choices"][0]["message"]["content"]
        return parse_json_response(content)


class AnthropicProvider(LLMProvider):
    name = "anthropic"

    def __init__(self, settings: Settings) -> None:
        self.api_key = settings.anthropic_api_key
        self.model = settings.default_model
        self.timeout = settings.llm_timeout_seconds

    async def analyze(self, text: str) -> dict[str, Any]:
        if not self.api_key:
            raise ProviderUnavailableError("ANTHROPIC_API_KEY no configurada")
        payload = {
            "model": self.model,
            "max_tokens": 2048,
            "temperature": 0.2,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": text}],
        }
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post("https://api.anthropic.com/v1/messages", json=payload, headers=headers)
        if response.status_code >= 400:
            raise ProviderUnavailableError("Anthropic devolvio un error de servicio")
        content = response.json()["content"][0]["text"]
        return parse_json_response(content)

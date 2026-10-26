# -*- coding: utf-8 -*-
"""Cifrado autenticado AES-256-GCM para notas y resultados clinicos en reposo."""

import base64
import hashlib
import os

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from core.config import get_settings

NONCE_SIZE = 12


class EncryptionService:
    def __init__(self, key: bytes | None = None) -> None:
        self._key = key or self._resolve_key()

    @staticmethod
    def _resolve_key() -> bytes:
        settings = get_settings()
        raw = settings.aes_key or settings.secret_key
        try:
            decoded = base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4))
            if len(decoded) == 32:
                return decoded
        except Exception:
            pass
        return hashlib.sha256(raw.encode("utf-8")).digest()

    def encrypt(self, plaintext: str) -> str:
        nonce = os.urandom(NONCE_SIZE)
        ciphertext = AESGCM(self._key).encrypt(nonce, plaintext.encode("utf-8"), None)
        return base64.urlsafe_b64encode(nonce + ciphertext).decode("ascii")

    def decrypt(self, token: str) -> str:
        payload = base64.urlsafe_b64decode(token.encode("ascii"))
        nonce, ciphertext = payload[:NONCE_SIZE], payload[NONCE_SIZE:]
        try:
            plaintext = AESGCM(self._key).decrypt(nonce, ciphertext, None)
        except InvalidTag as exc:
            raise ValueError("Ciphertext manipulado o clave incorrecta") from exc
        return plaintext.decode("utf-8")

    def encrypt_bytes(self, data: bytes) -> bytes:
        nonce = os.urandom(NONCE_SIZE)
        return nonce + AESGCM(self._key).encrypt(nonce, data, None)

    def decrypt_bytes(self, payload: bytes) -> bytes:
        nonce, ciphertext = payload[:NONCE_SIZE], payload[NONCE_SIZE:]
        try:
            return AESGCM(self._key).decrypt(nonce, ciphertext, None)
        except InvalidTag as exc:
            raise ValueError("Ciphertext manipulado o clave incorrecta") from exc


encryption_service = EncryptionService()


def encrypt(plaintext: str) -> str:
    return encryption_service.encrypt(plaintext)


def decrypt(token: str) -> str:
    return encryption_service.decrypt(token)

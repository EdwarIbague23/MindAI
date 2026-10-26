# -*- coding: utf-8 -*-
from fastapi import APIRouter, status

from core.db.repositories import UserRepository
from core.errors import AuthenticationError, ValidationError
from core.schemas.auth import Token, UserCreate, UserLogin, UserOut
from core.security.auth import PasswordHasher, create_access_token
from interfaces.api.deps import CurrentUser, DbSession

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: DbSession) -> UserOut:
    repository = UserRepository(db)
    if await repository.get_by_email(payload.email):
        raise ValidationError("El correo ya esta registrado")
    user = await repository.create(
        email=payload.email,
        hashed_password=PasswordHasher.hash(payload.password),
        full_name=payload.full_name,
    )
    return UserOut.model_validate(user)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: DbSession) -> Token:
    user = await UserRepository(db).get_by_email(payload.email)
    if user is None or not PasswordHasher.verify(payload.password, user.hashed_password):
        raise AuthenticationError("Credenciales invalidas")
    if not user.is_active:
        raise AuthenticationError("Usuario inactivo")
    token, expires_in = create_access_token(user.id, {"email": user.email, "role": user.role})
    return Token(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)

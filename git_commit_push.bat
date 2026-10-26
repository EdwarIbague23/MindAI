@echo off
title Git Commit and Push - MindFlow AI
chcp 65001 >nul
cd /d "C:\Users\THE GHOST\OneDrive - uniminuto.edu\UNIVERSIDAD IBAGUETHOO\UNIVERDIDAD UMD\VIII SEMESTRE\ELECTIVA CPC IAA\MindFlow AI"

echo.
echo ==========================================
echo  📦 Git Commit and Push - MindFlow AI
echo ==========================================
echo.

:: Paso 1: Inicializar repositorio git (si no existe)
if not exist .git (
    echo [1/5] Inicializando repositorio git...
    git init
    echo   ✅ Repositorio inicializado
) else (
    echo [1/5] El repositorio ya existe
)

:: Paso 2: Agregar todos los archivos
echo.
echo [2/5] Agregando archivos al staging area...
git add .
echo   ✅ Archivos agregados

:: Paso 3: Commit con mensaje solicitado
echo.
echo [3/5] Haciendo commit con mensaje: "Entrega Código Resultado Prompt"
git commit -m "Entrega Código Resultado Prompt"
echo   ✅ Commit creado

:: Paso 4: Configurar remote (usuario debe configurar su URL)
echo.
echo [4/5] Configurando remote origin...
echo.
echo "Por favor, ingresa la URL de tu repositorioGitHub:"
echo "Ejemplo: https://github.com/EdwarIbague23/MindAI.git"
set /p GIT_URL="URL: "

if not exist .git\config (
    git remote add origin %GIT_URL%
) else (
    git remote set-url origin %GIT_URL%
)

echo.
echo [5/5] Haciendo push a la rama main...
git push -u origin main
echo.
echo ==========================================
echo  ✅ ¡Proceso completado!
echo  📂 Tus archivos están respaldados enGitHub
echo ==========================================
pause >nul
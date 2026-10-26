@echo off
title MindFlow AI - Servidor Fase 1
color 0A
echo.
echo ==========================================
echo  🚀 MindFlow AI - API Híbrida Fase 1
echo ==========================================
echo.
echo  📍 Servidor: http://127.0.0.1:8000
echo  🌐 CORS: http://localhost:3000, http://localhost:19000, http://localhost:8080
echo.
echo  Presione Ctrl+C para detener el servidor
echo.

set PYTHONPATH=C:\Users\THE GHOST\OneDrive - uniminuto.edu\UNIVERSIDAD IBAGUETHOO\UNIVERDIDAD UMD\VIII SEMESTRE\ELECTIVA CPC IAA\MindFlow AI
python -m uvicorn mi_framework_ia.interfaces.api.main:app --host 127.0.0.1 --port 8000 --reload
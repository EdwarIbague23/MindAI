@echo off
chcp 65001 >nul
title MindFlow AI - Servidor Fase 1
echo.
echo ==========================================
echo  🚀 MindFlow AI - API Híbrida Fase 1
echo ==========================================
echo.
echo  📍 Servidor: http://127.0.0.1:8000
echo  🌐 CORS: http://localhost:3000, http://localhost:19000, http://localhost:8080
echo.
echo  Presione cualquier tecla para detener...
echo.

set PYTHONPATH=C:\Users\THE GHOST\OneDrive - uniminuto.edu\UNIVERSIDAD IBAGUETHOO\UNIVERDIDAD UMD\VIII SEMESTRE\ELECTIVA CPC IAA\MindFlow AI
python start_simple.py

pause >nul
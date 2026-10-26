#!/usr/bin/env python
"""Script de inicio del servidor FastAPI - Fase 1.

Este script asegura que el path correcto se establezca antes de levantar
el servidor, necesario para la instalación de Python desde Windows Store.
"""

import sys
import os

# Añadir el directorio del proyecto al sys.path
project_dir = r"C:\Users\THE GHOST\OneDrive - uniminuto.edu\UNIVERSIDAD IBAGUETHOO\UNIVERDIDAD UMD\VIII SEMESTRE\ELECTIVA CPC IAA\MindFlow AI"
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

# Ahora importar y levantar la app
from mi_framework_ia.interfaces.api.main import app

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando MindFlow AI API - Fase 1")
    print("📍 Servidor: http://0.0.0.0:8000")
    print("🌐 CORS configurado para: http://localhost:3000, http://localhost:19000, http://localhost:8080")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
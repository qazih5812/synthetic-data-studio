@echo off
echo ==========================================
echo   HackDataV2 — AI Synthetic Data Platform
echo ==========================================
echo.
echo Starting backend server...
echo API:      http://localhost:8000/api
echo Docs:     http://localhost:8000/api/docs
echo App:      http://localhost:8000
echo.
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

@echo off
setlocal
cd /d "%~dp0"

set "ROOT=%~dp0"
set "PYTHON="
if exist "%ROOT%backend\.venv\Scripts\python.exe" set "PYTHON=%ROOT%backend\.venv\Scripts\python.exe"
if exist "%ROOT%.venv\Scripts\python.exe" set "PYTHON=%ROOT%.venv\Scripts\python.exe"
if exist "%ROOT%venv\Scripts\python.exe" set "PYTHON=%ROOT%venv\Scripts\python.exe"

if not defined PYTHON (
  echo Creating virtual environment at backend\.venv ...
  python -m venv "%ROOT%backend\.venv"
  if errorlevel 1 (
    echo Could not create the virtual environment. Install Python 3.12+ and try again.
    exit /b 1
  )
  set "PYTHON=%ROOT%backend\.venv\Scripts\python.exe"
)

"%PYTHON%" -m pip install -q -r "%ROOT%backend\requirements.txt"
if errorlevel 1 (
  echo Failed to install dependencies from backend\requirements.txt
  exit /b 1
)

echo.
echo ========================================
echo  Shantanu Soni - Portfolio
echo  Web server starting...
echo  Local:   http://127.0.0.1:8000
echo  Docs:    http://127.0.0.1:8000/docs
echo ========================================
echo.

start "" http://127.0.0.1:8000

cd /d "%ROOT%backend"
"%PYTHON%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

endlocal

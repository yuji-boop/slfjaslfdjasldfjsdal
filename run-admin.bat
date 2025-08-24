@echo off
setlocal ENABLEDELAYEDEXPANSION
title Tastetrip Admin

cd /d "%~dp0"

if not exist "node_modules" (
  echo [ERROR] node_modules directory not found.
  echo Please run install-deps.bat first.
  pause
  exit /b 1
)

set PORT=5173
set URL=http://localhost:%PORT%

echo Checking if dev server is already running at %URL% ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 -Uri '%URL%') | Out-Null; exit 0 } catch { exit 1 }"

if %errorlevel%==0 (
  echo Detected running dev server.
) else (
  echo Starting dev server ...
  start "Tastetrip Dev" powershell -NoProfile -ExecutionPolicy Bypass -Command "npm run dev | Write-Output"
)

echo Waiting for server to be ready ...
set tries=0
:wait_admin
set /a tries+=1
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 -Uri '%URL%') | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel%==0 goto open_admin
if %tries% GEQ 60 goto open_admin
timeout /t 1 >nul
goto wait_admin

:open_admin
echo Opening browser to admin view ...
start chrome "%URL%/?view=admin"

echo.
echo Script finished.
pause
exit /b 0
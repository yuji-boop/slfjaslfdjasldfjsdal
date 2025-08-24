@echo off
setlocal ENABLEDELAYEDEXPANSION
title Tastetrip Launcher

cd /d "%~dp0"

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
:wait_default
set /a tries+=1
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 -Uri '%URL%') | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel%==0 goto open_default
if %tries% GEQ 60 goto open_default
timeout /t 1 >nul
goto wait_default

:open_default
echo Opening browser to front view ...
start "" "%URL%/?view=home"
echo Admin view: %URL%/?view=admin
exit /b 0
@echo off
setlocal
title Tastetrip Install Dependencies

cd /d "%~dp0"

echo Checking for Node.js and npm...
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org and try again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not available. Please ensure Node.js/npm is installed correctly.
  pause
  exit /b 1
)

echo Installing dependencies...
if exist package-lock.json (
  echo Detected package-lock.json, running: npm ci
  call npm ci
) else (
  echo Running: npm install
  call npm install
)

if errorlevel 1 (
  echo [ERROR] Dependency installation failed.
  pause
  exit /b 1
)

echo.
echo Dependencies installed successfully.
pause
exit /b 0

endlocal


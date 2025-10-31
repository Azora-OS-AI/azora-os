@echo off
REM AZORA PROPRIETARY LICENSE
REM Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.

echo ========================================
echo AZORA OS - WINDOWS INSTALLER BUILDER
echo ========================================
echo.

echo [1/5] Checking system health...
call npm run health:full
if %errorlevel% neq 0 (
    echo.
    echo WARNING: Health check found issues. Continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
)

echo.
echo [2/5] Installing dependencies...
call npm install

echo.
echo [3/5] Building Next.js application...
call npm run build

echo.
echo [4/5] Creating Windows installers...
call node build-production-installers.js

echo.
echo [5/5] Done!
echo.
echo ========================================
echo Installers created in: dist-installers/
echo ========================================
echo.
echo Available installers:
dir /b dist-installers\*.exe dist-installers\*.msi 2>nul
echo.
echo Next steps:
echo 1. Test the installers
echo 2. Sign the installers (optional but recommended)
echo 3. Distribute to users
echo.
pause

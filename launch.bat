@echo off
REM AZORA OS - Universal Launch Script for Windows
REM Copyright (C) 2025 Azora ES (Pty) Ltd. All Rights Reserved.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo    🚀 AZORA OS - AI-Powered Development Platform
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Founded by:
echo   • Sizwe Ngwenya - CEO ^& Founder
echo   • Sizwe Motingwe - Head of Sales
echo   • Nolundi Ngwenya - Head of Retail
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 22+
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node -v
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo Select launch mode:
echo   1) Web Platform (localhost:3000)
echo   2) Azora IDE (Desktop Application)
echo   3) All Services
echo   4) Development Mode
echo.

set /p choice="Enter choice [1-4]: "

if "%choice%"=="1" (
    echo.
    echo 🌐 Launching Web Platform...
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 💻 Launching Azora IDE...
    npm run ide:start
) else if "%choice%"=="3" (
    echo.
    echo ⚙️  Starting All Services...
    npm run services:start
) else if "%choice%"=="4" (
    echo.
    echo 🔧 Starting Development Mode...
    npm run dev
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

pause

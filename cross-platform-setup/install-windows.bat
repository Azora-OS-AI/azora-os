@echo off
:: AZORA OS - WINDOWS DEVELOPMENT ENVIRONMENT SETUP
:: Automated installation script for Windows developers
:: Date: October 30, 2025

echo ================================================
echo   AZORA OS - WINDOWS DEVELOPMENT ENVIRONMENT SETUP
echo ================================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Running with administrator privileges
) else (
    echo [WARNING] Not running as administrator. Some features may not work properly.
    echo.
)

:: Check if Node.js is installed
echo [CHECK] Checking for Node.js installation...
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo [SUCCESS] Node.js is already installed
    node --version
) else (
    echo [INSTALL] Installing Node.js...
    :: Download and install Node.js LTS
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/latest-v22.x/node-v22.11.0-win-x64.msi' -OutFile 'node-installer.msi'"
    msiexec /i node-installer.msi /quiet
    del node-installer.msi
)

:: Check if Git is installed
echo [CHECK] Checking for Git installation...
git --version >nul 2>&1
if %errorLevel% == 0 (
    echo [SUCCESS] Git is already installed
    git --version
) else (
    echo [INSTALL] Installing Git...
    :: Download and install Git
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.47.0.windows.1/Git-2.47.0-64-bit.exe' -OutFile 'git-installer.exe'"
    git-installer.exe /SILENT
    del git-installer.exe
)

:: Install project dependencies
echo [INSTALL] Installing project dependencies...
npm install -g pnpm
pnpm install

:: Setup environment variables
echo [CONFIG] Setting up environment variables...
setx AZORA_DEV_ENV "windows"
setx NODE_ENV "development"

:: Create desktop shortcut
echo [CONFIG] Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.Environment]::GetFolderPath('Desktop') + '\Azora OS Dev.lnk'); $Shortcut.TargetPath = '%CD%\run-azora-supreme.ts'; $Shortcut.Save()"

echo.
echo ================================================
echo   AZORA OS WINDOWS SETUP COMPLETE!
echo ================================================
echo.
echo Next steps:
echo 1. Open a new terminal
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000 in your browser
echo.
echo For constitutional compliance verification, run:
echo 'node verify-constitutional-compliance.js'
echo.
echo Happy coding from Africa! 🇿🇦
pause
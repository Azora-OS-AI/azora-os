# AZORA OS - WINDOWS DEVELOPMENT ENVIRONMENT SETUP (PowerShell)
# Automated installation script for Windows developers using PowerShell
# Date: October 30, 2025

Write-Host "================================================" -ForegroundColor Green
Write-Host "  AZORA OS - WINDOWS POWERSHELL SETUP" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "[INFO] Running with administrator privileges" -ForegroundColor Cyan
} else {
    Write-Host "[WARNING] Not running as administrator. Some features may not work properly." -ForegroundColor Yellow
    Write-Host ""
}

# Check if Node.js is installed
Write-Host "[CHECK] Checking for Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "[SUCCESS] Node.js is already installed" -ForegroundColor Green
    Write-Host $nodeVersion -ForegroundColor Gray
} catch {
    Write-Host "[INSTALL] Installing Node.js..." -ForegroundColor Cyan
    # Download and install Node.js LTS
    Invoke-WebRequest -Uri "https://nodejs.org/dist/latest-v22.x/node-v22.11.0-win-x64.msi" -OutFile "node-installer.msi"
    Start-Process msiexec.exe -ArgumentList "/i node-installer.msi /quiet" -Wait
    Remove-Item "node-installer.msi"
}

# Check if Git is installed
Write-Host "[CHECK] Checking for Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "[SUCCESS] Git is already installed" -ForegroundColor Green
    Write-Host $gitVersion -ForegroundColor Gray
} catch {
    Write-Host "[INSTALL] Installing Git..." -ForegroundColor Cyan
    # Download and install Git
    Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.47.0.windows.1/Git-2.47.0-64-bit.exe" -OutFile "git-installer.exe"
    Start-Process -FilePath ".\git-installer.exe" -ArgumentList "/SILENT" -Wait
    Remove-Item "git-installer.exe"
}

# Install project dependencies
Write-Host "[INSTALL] Installing project dependencies..." -ForegroundColor Cyan
npm install -g pnpm
pnpm install

# Setup environment variables
Write-Host "[CONFIG] Setting up environment variables..." -ForegroundColor Cyan
[Environment]::SetEnvironmentVariable("AZORA_DEV_ENV", "windows", [EnvironmentVariableTarget]::User)
[Environment]::SetEnvironmentVariable("NODE_ENV", "development", [EnvironmentVariableTarget]::User)

# Create desktop shortcut
Write-Host "[CONFIG] Creating desktop shortcut..." -ForegroundColor Cyan
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut([System.Environment]::GetFolderPath('Desktop') + '\Azora OS Dev.lnk')
$Shortcut.TargetPath = "$PWD\run-azora-supreme.ts"
$Shortcut.Save()

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  AZORA OS WINDOWS POWERSHELL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Open a new terminal" -ForegroundColor Gray
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor Gray
Write-Host "3. Visit http://localhost:3000 in your browser" -ForegroundColor Gray
Write-Host ""
Write-Host "For constitutional compliance verification, run:" -ForegroundColor White
Write-Host "'node verify-constitutional-compliance.js'" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding from Africa! 🇿🇦" -ForegroundColor Green
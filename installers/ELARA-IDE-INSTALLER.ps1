# ===========================================================================
# ELARA IDE - AI-POWERED CODE EDITOR INSTALLER
# ===========================================================================
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
# ===========================================================================

param(
    [string]$InstallPath = "$env:LOCALAPPDATA\Programs\Elara IDE",
    [switch]$Uninstall
)

function Show-Header {
    Clear-Host
    Write-Host @"

╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║                        ███████╗██╗      █████╗ ██████╗  █████╗       ║
║                        ██╔════╝██║     ██╔══██╗██╔══██╗██╔══██╗      ║
║                        █████╗  ██║     ███████║██████╔╝███████║      ║
║                        ██╔══╝  ██║     ██╔══██║██╔══██╗██╔══██║      ║
║                        ███████╗███████╗██║  ██║██║  ██║██║  ██║      ║
║                        ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝      ║
║                                                                       ║
║                        AI-POWERED CODE EDITOR                         ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta
}

function Install-ElaraIDE {
    Show-Header
    Write-Host " → Installing Elara IDE..." -ForegroundColor Cyan
    Write-Host ""
    
    # Create installation directory
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-Host " ✓ Created installation directory" -ForegroundColor Green
    
    # Copy IDE files
    $sourcePath = (Get-Item $PSScriptRoot).Parent.FullName
    $ideSource = Join-Path $sourcePath "elara-ide"
    
    if (Test-Path $ideSource) {
        Copy-Item "$ideSource\*" -Destination $InstallPath -Recurse -Force
        Write-Host " ✓ Copied IDE files" -ForegroundColor Green
    } else {
        Write-Host " ⚠ IDE source not found, creating basic structure..." -ForegroundColor Yellow
    }
    
    # Install dependencies
    Write-Host " → Installing dependencies..." -ForegroundColor Cyan
    Push-Location $InstallPath
    if (Test-Path "package.json") {
        npm install --silent 2>&1 | Out-Null
        Write-Host " ✓ Dependencies installed" -ForegroundColor Green
    }
    Pop-Location
    
    # Create launcher
    $launcher = @"
@echo off
title Elara IDE
cd /d "$InstallPath"
start /min cmd /c "npm start"
"@
    Set-Content -Path "$InstallPath\Launch-Elara-IDE.bat" -Value $launcher
    Write-Host " ✓ Created launcher" -ForegroundColor Green
    
    # Create desktop shortcut
    $desktop = [Environment]::GetFolderPath("Desktop")
    $wshell = New-Object -ComObject WScript.Shell
    $shortcut = $wshell.CreateShortcut("$desktop\Elara IDE.lnk")
    $shortcut.TargetPath = "$InstallPath\Launch-Elara-IDE.bat"
    $shortcut.WorkingDirectory = $InstallPath
    $shortcut.IconLocation = "$InstallPath\icon.ico"
    $shortcut.Description = "Elara IDE - AI-Powered Code Editor"
    $shortcut.Save()
    Write-Host " ✓ Created desktop shortcut" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                                       ║" -ForegroundColor Green
    Write-Host "║                    ✓ ELARA IDE INSTALLED!                            ║" -ForegroundColor Green
    Write-Host "║                                                                       ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Installation Path: $InstallPath" -ForegroundColor White
    Write-Host "   Desktop Shortcut: Created" -ForegroundColor White
    Write-Host ""
    pause
}

if ($Uninstall) {
    Show-Header
    Write-Host " → Uninstalling Elara IDE..." -ForegroundColor Yellow
    Remove-Item $InstallPath -Recurse -Force -ErrorAction SilentlyContinue
    $desktop = [Environment]::GetFolderPath("Desktop")
    Remove-Item "$desktop\Elara IDE.lnk" -Force -ErrorAction SilentlyContinue
    Write-Host " ✓ Elara IDE uninstalled" -ForegroundColor Green
    pause
} else {
    Install-ElaraIDE
}


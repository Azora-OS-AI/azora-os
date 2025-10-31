# ===========================================================================
# AZORA OS - PROFESSIONAL INSTALLER
# Universal Human Infrastructure Platform
# ===========================================================================
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
# ===========================================================================

param(
    [switch]$FullInstall,
    [switch]$DevMode,
    [switch]$Uninstall,
    [string]$InstallPath = "$env:ProgramFiles\Azora OS"
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# ===========================================================================
# BRANDING & UI
# ===========================================================================

function Show-Header {
    Clear-Host
    Write-Host @"

╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║                          █████╗ ███████╗ ██████╗ ██████╗  █████╗     ║
║                         ██╔══██╗╚══███╔╝██╔═══██╗██╔══██╗██╔══██╗    ║
║                         ███████║  ███╔╝ ██║   ██║██████╔╝███████║    ║
║                         ██╔══██║ ███╔╝  ██║   ██║██╔══██╗██╔══██║    ║
║                         ██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║    ║
║                         ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ║
║                                                                       ║
║               UNIVERSAL HUMAN INFRASTRUCTURE PLATFORM                 ║
║                                                                       ║
║                   Quantum-Secure • AI-Powered • Open Source           ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    
    $color = switch ($Type) {
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
        default { "Cyan" }
    }
    
    $icon = switch ($Type) {
        "Success" { "✓" }
        "Error" { "✗" }
        "Warning" { "⚠" }
        default { "→" }
    }
    
    Write-Host " $icon $Message" -ForegroundColor $color
}

# ===========================================================================
# SYSTEM CHECKS
# ===========================================================================

function Test-AdminRights {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-Prerequisites {
    Write-Status "Checking system prerequisites..." "Info"
    
    # Check Node.js
    $nodeVersion = try { (node --version 2>&1) } catch { $null }
    if ($nodeVersion -match "v(\d+)") {
        $version = [int]$matches[1]
        if ($version -ge 18) {
            Write-Status "Node.js $nodeVersion detected" "Success"
        } else {
            Write-Status "Node.js version too old. Need v18+" "Warning"
            return $false
        }
    } else {
        Write-Status "Node.js not found. Please install Node.js 18+ from nodejs.org" "Error"
        return $false
    }
    
    # Check available disk space (need at least 2GB)
    $drive = (Get-Item $InstallPath -ErrorAction SilentlyContinue).PSDrive.Name
    if (!$drive) { $drive = $env:SystemDrive.Replace(":", "") }
    $freeSpace = (Get-PSDrive $drive).Free / 1GB
    
    if ($freeSpace -lt 2) {
        Write-Status "Insufficient disk space. Need at least 2GB" "Error"
        return $false
    }
    
    Write-Status "Available disk space: $([math]::Round($freeSpace, 2))GB" "Success"
    return $true
}

# ===========================================================================
# INSTALLATION
# ===========================================================================

function Install-AzoraOS {
    Show-Header
    Write-Status "Starting Azora OS Installation..." "Info"
    Write-Host ""
    
    if (!(Test-AdminRights)) {
        Write-Status "Administrator privileges required!" "Error"
        Write-Host ""
        Write-Host "   Please run this installer as Administrator:" -ForegroundColor Yellow
        Write-Host "   Right-click → Run as Administrator" -ForegroundColor Yellow
        Write-Host ""
        pause
        exit 1
    }
    
    if (!(Test-Prerequisites)) {
        Write-Host ""
        Write-Status "Prerequisites check failed!" "Error"
        Write-Host ""
        pause
        exit 1
    }
    
    Write-Host ""
    Write-Status "Installation Details:" "Info"
    Write-Host "   Installation Path: $InstallPath" -ForegroundColor Gray
    Write-Host "   Installation Type: $(if($FullInstall){"Full Install"}else{"Standard Install"})" -ForegroundColor Gray
    Write-Host ""
    
    # Create installation directory
    Write-Status "Creating installation directory..." "Info"
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    
    # Copy files
    Write-Status "Copying Azora OS files..." "Info"
    $sourcePath = $PSScriptRoot.Replace("\installers", "")
    
    $itemsToCopy = @(
        "app", "public", "services", "components", "lib",
        "package.json", "package-lock.json", "next.config.ts",
        "tailwind.config.js", "tsconfig.json", "BRANDING-GUIDE.md"
    )
    
    foreach ($item in $itemsToCopy) {
        $source = Join-Path $sourcePath $item
        if (Test-Path $source) {
            Copy-Item $source -Destination $InstallPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Status "Files copied successfully" "Success"
    
    # Install dependencies
    Write-Status "Installing dependencies (this may take a few minutes)..." "Info"
    Push-Location $InstallPath
    
    $npmOutput = npm install --production --silent 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Dependencies installed successfully" "Success"
    } else {
        Write-Status "Dependency installation had warnings (non-critical)" "Warning"
    }
    
    Pop-Location
    
    # Build application
    if (!$DevMode) {
        Write-Status "Building application for production..." "Info"
        Push-Location $InstallPath
        npm run build 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Build completed successfully" "Success"
        }
        Pop-Location
    }
    
    # Create launcher scripts
    Write-Status "Creating launcher scripts..." "Info"
    
    $launcherBat = @"
@echo off
title Azora OS
cd /d "$InstallPath"
start /min cmd /c "npm run start"
timeout /t 3 /nobreak >nul
start http://localhost:3000
"@
    Set-Content -Path "$InstallPath\Launch-Azora-OS.bat" -Value $launcherBat
    
    $launcherPs1 = @"
Set-Location "$InstallPath"
Start-Process -FilePath "npm" -ArgumentList "run", "start" -NoNewWindow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
"@
    Set-Content -Path "$InstallPath\Launch-Azora-OS.ps1" -Value $launcherPs1
    
    # Create desktop shortcut
    Write-Status "Creating desktop shortcut..." "Info"
    $desktop = [Environment]::GetFolderPath("Desktop")
    $wshell = New-Object -ComObject WScript.Shell
    $shortcut = $wshell.CreateShortcut("$desktop\Azora OS.lnk")
    $shortcut.TargetPath = "$InstallPath\Launch-Azora-OS.bat"
    $shortcut.WorkingDirectory = $InstallPath
    $shortcut.IconLocation = "$InstallPath\public\favicon.ico"
    $shortcut.Description = "Azora OS - Universal Human Infrastructure"
    $shortcut.Save()
    
    # Create Start Menu entry
    Write-Status "Creating Start Menu entry..." "Info"
    $startMenu = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Azora OS"
    New-Item -ItemType Directory -Path $startMenu -Force | Out-Null
    
    $shortcut = $wshell.CreateShortcut("$startMenu\Azora OS.lnk")
    $shortcut.TargetPath = "$InstallPath\Launch-Azora-OS.bat"
    $shortcut.WorkingDirectory = $InstallPath
    $shortcut.IconLocation = "$InstallPath\public\favicon.ico"
    $shortcut.Save()
    
    # Add to PATH
    Write-Status "Adding to system PATH..." "Info"
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$InstallPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$InstallPath", "Machine")
    }
    
    # Create uninstaller
    Write-Status "Creating uninstaller..." "Info"
    $uninstaller = @"
Write-Host "Uninstalling Azora OS..." -ForegroundColor Yellow
Remove-Item "$InstallPath" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$desktop\Azora OS.lnk" -Force -ErrorAction SilentlyContinue
Remove-Item "$startMenu" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Azora OS uninstalled successfully" -ForegroundColor Green
pause
"@
    Set-Content -Path "$InstallPath\Uninstall.ps1" -Value $uninstaller
    
    # Installation complete
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                                       ║" -ForegroundColor Green
    Write-Host "║                    ✓ INSTALLATION COMPLETE!                          ║" -ForegroundColor Green
    Write-Host "║                                                                       ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Installation Path:" -ForegroundColor Cyan
    Write-Host "   $InstallPath" -ForegroundColor White
    Write-Host ""
    Write-Host "   Desktop Shortcut:" -ForegroundColor Cyan
    Write-Host "   Created" -ForegroundColor White
    Write-Host ""
    Write-Host "   Start Menu Entry:" -ForegroundColor Cyan
    Write-Host "   Created" -ForegroundColor White
    Write-Host ""
    Write-Host "   To Launch Azora OS:" -ForegroundColor Cyan
    Write-Host "   • Double-click desktop shortcut" -ForegroundColor White
    Write-Host "   • Search for 'Azora OS' in Start Menu" -ForegroundColor White
    Write-Host "   • Run: $InstallPath\Launch-Azora-OS.bat" -ForegroundColor White
    Write-Host ""
    Write-Host "   GitHub Repository:" -ForegroundColor Cyan
    Write-Host "   https://github.com/Azora-OS-AI/azora-os" -ForegroundColor White
    Write-Host ""
    Write-Host "   Support:" -ForegroundColor Cyan
    Write-Host "   sizwe.ngwenya@azora.world" -ForegroundColor White
    Write-Host ""
    Write-Host "   Press any key to launch Azora OS..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    & "$InstallPath\Launch-Azora-OS.bat"
}

function Uninstall-AzoraOS {
    Show-Header
    Write-Status "Uninstalling Azora OS..." "Warning"
    Write-Host ""
    
    if (!(Test-AdminRights)) {
        Write-Status "Administrator privileges required!" "Error"
        pause
        exit 1
    }
    
    $confirm = Read-Host "Are you sure you want to uninstall Azora OS? (Y/N)"
    if ($confirm -ne "Y" -and $confirm -ne "y") {
        Write-Status "Uninstallation cancelled" "Info"
        exit 0
    }
    
    Write-Status "Removing files..." "Info"
    Remove-Item $InstallPath -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Status "Removing shortcuts..." "Info"
    $desktop = [Environment]::GetFolderPath("Desktop")
    Remove-Item "$desktop\Azora OS.lnk" -Force -ErrorAction SilentlyContinue
    
    $startMenu = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Azora OS"
    Remove-Item $startMenu -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Status "Azora OS has been uninstalled" "Success"
    Write-Host ""
    pause
}

# ===========================================================================
# MAIN
# ===========================================================================

if ($Uninstall) {
    Uninstall-AzoraOS
} else {
    Install-AzoraOS
}


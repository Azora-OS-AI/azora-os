# AZORA IDE - Windows Installer Build Script
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

Write-Host "🚀 Building Azora IDE for Windows..." -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Build the IDE
Write-Host "`n🔨 Building Azora IDE..." -ForegroundColor Yellow
npm run ide:build:windows

# Step 3: Copy assets
Write-Host "`n📁 Copying assets..." -ForegroundColor Yellow
Copy-Item -Path "assets/*" -Destination "dist/assets/" -Recurse -Force

# Step 4: Build installer with NSIS
Write-Host "`n📦 Building installer..." -ForegroundColor Yellow
& "C:\Program Files (x86)\NSIS\makensis.exe" windows-setup\installer.nsi

# Step 5: Sign the installer (optional)
if (Test-Path "signing-certificate.pfx") {
    Write-Host "`n🔐 Signing installer..." -ForegroundColor Yellow
    & "signtool.exe" sign /f signing-certificate.pfx /p $env:CERT_PASSWORD /t http://timestamp.digicert.com "azora-ide-setup-1.0.0.exe"
}

Write-Host "`n✅ Build complete! Installer: azora-ide-setup-1.0.0.exe" -ForegroundColor Green
Write-Host "📍 Location: $(Get-Location)\azora-ide-setup-1.0.0.exe" -ForegroundColor Green

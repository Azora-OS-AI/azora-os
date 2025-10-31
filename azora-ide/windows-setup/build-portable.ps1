# AZORA IDE - Portable Windows Build Script
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

Write-Host "🚀 Building Azora IDE Portable for Windows..." -ForegroundColor Cyan

# Build the application
Write-Host "`n🔨 Building application..." -ForegroundColor Yellow
npm run ide:build:windows

# Create portable package
Write-Host "`n📦 Creating portable package..." -ForegroundColor Yellow
$portableDir = "azora-ide-portable"
New-Item -ItemType Directory -Force -Path $portableDir

# Copy files
Copy-Item -Path "dist/*" -Destination "$portableDir/" -Recurse -Force
Copy-Item -Path "README.md" -Destination "$portableDir/"
Copy-Item -Path "LICENSE" -Destination "$portableDir/"

# Create launcher script
@"
@echo off
echo Starting Azora IDE...
start "" "azora-ide.exe"
"@ | Out-File -FilePath "$portableDir\Launch-Azora-IDE.bat" -Encoding ASCII

# Create ZIP package
Write-Host "`n🗜️ Creating ZIP archive..." -ForegroundColor Yellow
Compress-Archive -Path "$portableDir/*" -DestinationPath "azora-ide-portable-1.0.0.zip" -Force

Write-Host "`n✅ Portable build complete!" -ForegroundColor Green
Write-Host "📍 Location: $(Get-Location)\azora-ide-portable-1.0.0.zip" -ForegroundColor Green

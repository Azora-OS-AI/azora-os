# 🪟 WINDOWS-AZORA OS - BOOTABLE SYSTEM GUIDE

**Transform Windows into Azora OS**  
**Version:** 1.0  
**Last Updated:** October 31, 2025

---

## 🎯 **OVERVIEW**

Azora OS can be integrated with Windows to create a hybrid operating system that combines:
- ✅ Windows stability and compatibility
- ✅ Azora OS services and AI capabilities
- ✅ Custom boot experience
- ✅ Integrated system-wide features

---

## 📦 **INSTALLATION METHODS**

### **Method 1: Windows Application (Recommended)**
Install Azora OS as a Windows application that runs on startup.

### **Method 2: Custom Windows ISO**
Create a bootable Windows ISO with Azora OS pre-installed.

### **Method 3: Boot Manager Integration**
Integrate Azora OS into Windows Boot Manager for startup control.

---

## 🚀 **METHOD 1: WINDOWS APPLICATION**

### **Step 1: Download Azora OS Installer**

```powershell
# Download Azora OS setup
Invoke-WebRequest -Uri "https://azora.world/download/azora-os-setup.exe" -OutFile "azora-os-setup.exe"
```

### **Step 2: Install Azora OS**

```powershell
# Run installer as Administrator
Start-Process "azora-os-setup.exe" -Verb RunAs -Wait
```

### **Step 3: Configure Auto-Start**

```powershell
# Create startup shortcut
$startup = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$target = "$env:ProgramFiles\Azora OS\azora-os.exe"
$shortcut = (New-Object -ComObject WScript.Shell).CreateShortcut("$startup\Azora OS.lnk")
$shortcut.TargetPath = $target
$shortcut.Save()
```

---

## 💿 **METHOD 2: CUSTOM WINDOWS ISO**

### **Requirements**

- Windows 10/11 ISO
- Windows Assessment and Deployment Kit (ADK)
- Azora OS source files
- 16GB+ USB drive

### **Step 1: Prepare Tools**

```powershell
# Install Windows ADK
# Download from: https://docs.microsoft.com/en-us/windows-hardware/get-started/adk-install

# Install DISM
Install-WindowsFeature -Name DISM
```

### **Step 2: Extract Windows ISO**

```powershell
# Mount ISO
$iso = Mount-DiskImage -ImagePath "C:\path\to\windows.iso" -PassThru
$driveLetter = ($iso | Get-Volume).DriveLetter

# Copy files to working directory
Copy-Item "${driveLetter}:\*" -Destination "C:\WinAzora" -Recurse -Force

# Dismount ISO
Dismount-DiskImage -ImagePath "C:\path\to\windows.iso"
```

### **Step 3: Integrate Azora OS**

```powershell
# Mount Windows image
Mount-WindowsImage -ImagePath "C:\WinAzora\sources\install.wim" -Index 1 -Path "C:\Mount"

# Copy Azora OS files
Copy-Item "C:\Users\Sizwe Ngwenya\Desktop\azora-os" -Destination "C:\Mount\Program Files\Azora OS" -Recurse

# Create startup scripts
$startupScript = @"
@echo off
cd /d "%ProgramFiles%\Azora OS"
start /min cmd /c "npm run start-all-services"
start /min cmd /c "npm run dev"
"@
Set-Content -Path "C:\Mount\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\AzoraOS.bat" -Value $startupScript

# Dismount and save
Dismount-WindowsImage -Path "C:\Mount" -Save
```

### **Step 4: Create Bootable USB**

```powershell
# Format USB (WARNING: This erases all data on the drive!)
$usbDrive = "E:"  # Change to your USB drive letter
Format-Volume -DriveLetter $usbDrive.Replace(":", "") -FileSystem NTFS -NewFileSystemLabel "AZORA_OS"

# Copy files to USB
Copy-Item "C:\WinAzora\*" -Destination "${usbDrive}\" -Recurse -Force

# Make bootable
bootsect /nt60 ${usbDrive} /force /mbr
```

---

## ⚙️ **METHOD 3: BOOT MANAGER INTEGRATION**

### **Custom Boot Screen**

```powershell
# Backup BCD
bcdedit /export "C:\BCD_Backup"

# Set custom boot screen
bcdedit /set {default} bootmenupolicy legacy
bcdedit /set {default} description "Azora OS - Universal Human Infrastructure"

# Add custom logo (requires unsigned driver acceptance)
bcdedit /set {globalsettings} custom:26000027 "C:\Program Files\Azora OS\public\branding\icon-square.svg"
```

### **Boot Menu Customization**

```powershell
# Set timeout
bcdedit /timeout 5

# Set default OS
bcdedit /default {current}

# Add Azora OS startup
$startupTask = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
    </LogonTrigger>
  </Triggers>
  <Actions>
    <Exec>
      <Command>"%ProgramFiles%\Azora OS\start-azora-os.bat"</Command>
    </Exec>
  </Actions>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
</Task>
"@

Set-Content -Path "C:\Temp\AzoraOSStartup.xml" -Value $startupTask
schtasks /create /tn "Azora OS Startup" /xml "C:\Temp\AzoraOSStartup.xml" /ru SYSTEM
```

---

## 🎨 **CUSTOM WINDOWS THEME**

### **Install Azora OS Theme**

```powershell
# Create theme directory
$themePath = "$env:LOCALAPPDATA\Microsoft\Windows\Themes\Azora OS"
New-Item -ItemType Directory -Path $themePath -Force

# Create theme file
$themeContent = @"
[Theme]
DisplayName=Azora OS

[Control Panel\Colors]
ActiveBorder=139 92 246
ActiveTitle=236 72 153
AppWorkSpace=15 23 42
Background=15 23 42
ButtonFace=30 27 75
ButtonHilight=167 139 250
ButtonLight=139 92 246
ButtonShadow=124 58 237
ButtonText=255 255 255
GradientActiveTitle=139 92 246
GradientInactiveTitle=30 27 75
GrayText=148 163 184
Hilight=139 92 246
HilightText=255 255 255
InactiveBorder=30 27 75
InactiveTitle=30 27 75
InactiveTitleText=148 163 184
InfoText=255 255 255
InfoWindow=236 72 153
Menu=15 23 42
MenuBar=15 23 42
MenuHilight=139 92 246
MenuText=255 255 255
Scrollbar=30 27 75
TitleText=255 255 255
Window=15 23 42
WindowFrame=15 23 42
WindowText=255 255 255

[Control Panel\Desktop]
Wallpaper=$themePath\wallpaper.jpg
TileWallpaper=0
WallpaperStyle=10
Pattern=

[VisualStyles]
Path=%SystemRoot%\resources\Themes\Aero\Aero.msstyles
ColorStyle=NormalColor
Size=NormalSize
"@

Set-Content -Path "$themePath\Azora OS.theme" -Value $themeContent

# Apply theme
Start-Process "$themePath\Azora OS.theme"
```

---

## 🖼️ **WALLPAPER & ASSETS**

### **Create Azora OS Wallpaper**

Location: `C:\Users\Sizwe Ngwenya\Desktop\azora-os\public\branding\wallpaper-4k.svg`

Wallpapers to create:
- 4K (3840x2160)
- 1080p (1920x1080)
- Ultrawide (3440x1440)
- Mobile (1080x1920)

---

## 🚀 **AUTOMATED INSTALLATION SCRIPT**

Save this as `install-azora-os.ps1`:

```powershell
# Azora OS - Automated Installation Script
# Run as Administrator

param(
    [switch]$FullInstall,
    [switch]$QuickSetup,
    [string]$InstallPath = "$env:ProgramFiles\Azora OS"
)

Write-Host @"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         AZORA OS - WINDOWS INTEGRATION INSTALLER           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Check admin rights
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges" -ForegroundColor Red
    Start-Process powershell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`" $args"
    exit
}

# Create installation directory
Write-Host "`n📁 Creating installation directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null

# Copy Azora OS files
Write-Host "📦 Copying Azora OS files..." -ForegroundColor Yellow
$sourcePath = "C:\Users\Sizwe Ngwenya\Desktop\azora-os"
if (Test-Path $sourcePath) {
    Copy-Item "$sourcePath\*" -Destination $InstallPath -Recurse -Force
    Write-Host "✅ Files copied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Source files not found at $sourcePath" -ForegroundColor Red
    exit 1
}

# Install Node.js dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Push-Location $InstallPath
if (Test-Path "package.json") {
    npm install --production
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  No package.json found, skipping npm install" -ForegroundColor Yellow
}
Pop-Location

# Create startup task
Write-Host "`n⚙️  Configuring automatic startup..." -ForegroundColor Yellow
$taskXml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
    </LogonTrigger>
  </Triggers>
  <Actions>
    <Exec>
      <Command>"$InstallPath\START-AZORA-OS.bat"</Command>
      <WorkingDirectory>$InstallPath</WorkingDirectory>
    </Exec>
  </Actions>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <Enabled>true</Enabled>
  </Settings>
</Task>
"@

$taskPath = "$env:TEMP\AzoraOSTask.xml"
Set-Content -Path $taskPath -Value $taskXml
schtasks /create /tn "Azora OS Startup" /xml $taskPath /f
Remove-Item $taskPath
Write-Host "✅ Startup task created" -ForegroundColor Green

# Create desktop shortcut
Write-Host "`n🔗 Creating desktop shortcut..." -ForegroundColor Yellow
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcut = (New-Object -ComObject WScript.Shell).CreateShortcut("$desktop\Azora OS.lnk")
$shortcut.TargetPath = "$InstallPath\START-AZORA-OS.bat"
$shortcut.WorkingDirectory = $InstallPath
$shortcut.IconLocation = "$InstallPath\public\favicon.ico"
$shortcut.Description = "Azora OS - Universal Human Infrastructure"
$shortcut.Save()
Write-Host "✅ Desktop shortcut created" -ForegroundColor Green

# Add to PATH
Write-Host "`n🛤️  Adding to system PATH..." -ForegroundColor Yellow
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*$InstallPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$InstallPath", "Machine")
    Write-Host "✅ Added to PATH" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Already in PATH" -ForegroundColor Cyan
}

# Create uninstaller
Write-Host "`n🗑️  Creating uninstaller..." -ForegroundColor Yellow
$uninstallScript = @"
# Azora OS Uninstaller
Write-Host "Uninstalling Azora OS..." -ForegroundColor Yellow
schtasks /delete /tn "Azora OS Startup" /f
Remove-Item "$InstallPath" -Recurse -Force
Remove-Item "$desktop\Azora OS.lnk" -Force -ErrorAction SilentlyContinue
Write-Host "✅ Azora OS uninstalled" -ForegroundColor Green
"@
Set-Content -Path "$InstallPath\uninstall.ps1" -Value $uninstallScript
Write-Host "✅ Uninstaller created" -ForegroundColor Green

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         ✅ AZORA OS INSTALLATION COMPLETE! ✅              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

📍 Installation Location: $InstallPath
🖥️  Desktop Shortcut: Created
⚙️  Auto-Start: Configured
🔗 System PATH: Updated

🚀 NEXT STEPS:
   1. Restart your computer (recommended)
   2. Or run: $InstallPath\START-AZORA-OS.bat

📞 Support: sizwe.ngwenya@azora.world

"@ -ForegroundColor Green
```

---

## 📚 **ADDITIONAL RESOURCES**

### **Required Software**

- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Git ([git-scm.com](https://git-scm.com))
- Visual Studio Code (optional)

### **Documentation**

- Setup Guide: `AZORA-OS-STARTUP-GUIDE.md`
- Branding Guide: `BRANDING-GUIDE.md`
- System Status: `SYSTEM-STATUS.md`

---

## 🔒 **SECURITY NOTES**

- ⚠️ Creating bootable media requires Administrator rights
- ⚠️ Always backup your data before modifying boot configurations
- ⚠️ Custom boot screens may require disabling Secure Boot
- ⚠️ Test in a virtual machine first

---

## 📞 **SUPPORT**

**Email:** sizwe.ngwenya@azora.world  
**Phone:** +27 73 234 7232  
**Website:** azora.world

---

**© 2025 Azora ES (Pty) Ltd. All Rights Reserved.**


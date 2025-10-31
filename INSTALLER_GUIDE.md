# Azora OS - Complete Installer Creation Guide

## 🚀 Quick Start

### Windows
```cmd
build-installers.bat
```

### macOS / Linux
```bash
chmod +x build-installers.sh
./build-installers.sh
```

### Or use npm
```bash
npm run build:installers
```

---

## 📦 What Gets Created

### Windows Installers
1. **NSIS Installer** (`Azora-OS-Setup-1.0.0.exe`)
   - Professional installation wizard
   - Start Menu and Desktop shortcuts
   - Uninstaller included
   - Recommended for end users

2. **MSI Installer** (`Azora-OS-1.0.0.msi`)
   - Enterprise deployment
   - Group Policy compatible
   - Silent installation support
   - Recommended for IT departments

3. **Portable** (`AzoraOS-Portable-1.0.0.exe`)
   - No installation required
   - Run from USB or network drive
   - Perfect for restricted environments

### macOS Installers
1. **DMG** (`Azora-OS-1.0.0.dmg`)
   - Drag-and-drop installation
   - Beautiful installer UI
   - Recommended for end users

2. **PKG** (`Azora-OS-1.0.0.pkg`)
   - Standard macOS installer
   - Silent installation support
   - Recommended for IT departments

3. **ZIP** (`Azora-OS-1.0.0-mac.zip`)
   - Simple archive
   - Extract and run
   - For advanced users

### Linux Installers
1. **AppImage** (`Azora-OS-1.0.0.AppImage`)
   - Universal Linux app
   - No installation required
   - Works on all distributions
   - Recommended for end users

2. **DEB** (`azora-os_1.0.0_amd64.deb`)
   - Debian, Ubuntu, Mint, Elementary
   - Automatic dependency resolution
   - System integration

3. **RPM** (`azora-os-1.0.0.x86_64.rpm`)
   - Fedora, RHEL, CentOS, openSUSE
   - Automatic dependency resolution
   - System integration

4. **Snap** (`azora-os_1.0.0_amd64.snap`)
   - Ubuntu and others
   - Sandboxed security
   - Automatic updates

5. **TAR.GZ** (`azora-os-1.0.0.tar.gz`)
   - Generic archive
   - Works on all distributions
   - Manual installation

---

## 🛠️ Build Process Explained

### Step 1: System Health Check
Validates:
- Node.js version (22+)
- npm installation
- Project files present
- package.json valid
- TypeScript configuration
- Electron configuration
- Git repository status

### Step 2: Install Dependencies
- Installs electron, electron-builder
- Installs all project dependencies
- Prepares build tools

### Step 3: Build Next.js App
- Creates production build
- Optimizes for static export
- Generates `out/` directory

### Step 4: Configure Electron
- Updates electron-main.js for production
- Configures auto-updater
- Sets up security policies

### Step 5: Create Installers
- Packages app with electron-builder
- Creates platform-specific installers
- Generates installation documentation

---

## 🔧 Advanced Configuration

### Code Signing (Recommended for Production)

#### Windows
1. Get a code signing certificate
2. Set environment variables:
   ```cmd
   set WIN_CSC_LINK=path/to/certificate.pfx
   set WIN_CSC_KEY_PASSWORD=your_password
   ```

#### macOS
1. Enroll in Apple Developer Program
2. Get Developer ID certificate
3. Set environment variables:
   ```bash
   export CSC_LINK=path/to/certificate.p12
   export CSC_KEY_PASSWORD=your_password
   export APPLE_ID=your@apple.id
   export APPLE_ID_PASSWORD=app_specific_password
   ```

#### Linux
Most Linux distributions don't require signing for desktop apps.

### Custom Build Configuration

Edit `electron-builder.json` to customize:
- App name and ID
- Icons and branding
- Installation directories
- File associations
- Auto-update settings

---

## 🧪 Testing Installers

### Before Distribution
1. **Test on clean system** - Install on a system without Node.js
2. **Test permissions** - Verify admin/sudo requirements
3. **Test upgrade** - Install new version over old version
4. **Test uninstall** - Verify complete removal
5. **Test auto-update** - Check update mechanism works

### Automated Testing
```bash
# Run on different platforms
npm run test:installers
```

---

## 📤 Distribution

### GitHub Releases (Recommended)
1. Create a new release:
   ```bash
   npm run release:minor
   ```

2. GitHub Actions will automatically:
   - Build installers for all platforms
   - Upload to release assets
   - Configure auto-updates

### Manual Distribution
1. Upload installers to your server
2. Update download links
3. Announce to users

### App Stores

#### Windows Store
- Use Windows Application Certification Kit
- Submit through Partner Center
- Review process: 1-3 days

#### Mac App Store
- Use Xcode and transporter
- Submit through App Store Connect
- Review process: 1-3 days

#### Snap Store
```bash
snapcraft register azora-os
snapcraft upload --release=stable azora-os_1.0.0_amd64.snap
```

---

## 🔄 Auto-Updates

Azora OS includes automatic updates via `electron-updater`.

### Configuration
Updates are configured in `electron-builder.json`:
```json
{
  "publish": {
    "provider": "github",
    "owner": "Sizwe780",
    "repo": "azora-os"
  }
}
```

### How It Works
1. App checks for updates on startup
2. Downloads in background
3. Notifies user when ready
4. Installs on next restart

### Disable Auto-Updates
Set environment variable:
```bash
export ELECTRON_UPDATER_ENABLED=false
```

---

## 🚨 Troubleshooting

### Build Fails - Windows
**Problem**: `electron-builder` fails with access denied
**Solution**: Run as Administrator or disable antivirus temporarily

**Problem**: Icons not found
**Solution**: Create proper ICO file (256x256) in `build-resources/`

### Build Fails - macOS
**Problem**: `xcodebuild` not found
**Solution**: Install Xcode Command Line Tools:
```bash
xcode-select --install
```

**Problem**: Notarization fails
**Solution**: Check Apple ID credentials and app-specific password

### Build Fails - Linux
**Problem**: `fpm` not found
**Solution**: Install ruby and fpm:
```bash
sudo apt-get install ruby ruby-dev
sudo gem install fpm
```

**Problem**: `rpm` not found
**Solution**: Install rpm tools:
```bash
sudo apt-get install rpm
```

### Installer Doesn't Run
**Problem**: Windows SmartScreen warning
**Solution**: Code sign the installer with valid certificate

**Problem**: macOS Gatekeeper blocks app
**Solution**: Sign and notarize with Apple Developer certificate

**Problem**: Linux "not executable"
**Solution**: Add execute permission:
```bash
chmod +x Azora-OS-1.0.0.AppImage
```

---

## 🎯 Best Practices

### 1. Always Test First
- Test on clean virtual machines
- Test all installer types
- Test upgrade paths

### 2. Sign Your Code
- Builds trust with users
- Prevents security warnings
- Required for some platforms

### 3. Version Properly
- Use semantic versioning (X.Y.Z)
- Update version in package.json
- Tag releases in git

### 4. Automate Builds
- Use GitHub Actions (included)
- Build on each platform natively
- Test before releasing

### 5. Document Changes
- Maintain CHANGELOG.md
- Write clear release notes
- Notify users of major changes

---

## 📊 Size Optimization

Installers can be large. Optimize with:

### 1. Remove Unused Dependencies
```bash
npm prune --production
```

### 2. Exclude Development Files
Edit `electron-builder.json`:
```json
{
  "files": [
    "!**/*.map",
    "!**/*.md",
    "!**/test/**"
  ]
}
```

### 3. Compress Resources
- Use compressed images (WebP, optimized PNG)
- Minify JavaScript and CSS
- Use tree-shaking

### 4. Platform-Specific Builds
Build only for target platform:
```bash
npm run build:installers:windows  # Windows only
npm run build:installers:mac      # macOS only
npm run build:installers:linux    # Linux only
```

---

## 📈 Metrics

Track installer downloads and installations:

### 1. Download Analytics
- Use GitHub Releases API
- Track from your website
- Monitor conversion rates

### 2. Installation Telemetry
Add to app (with user consent):
```typescript
analytics.track('app_installed', {
  version: app.getVersion(),
  platform: process.platform,
  timestamp: Date.now()
});
```

### 3. Update Metrics
Monitor auto-update adoption:
- Update check frequency
- Download success rate
- Installation success rate

---

## 🌍 Localization

Support multiple languages:

### 1. Installer Language
Edit `electron-builder.json`:
```json
{
  "nsis": {
    "language": ["en", "fr", "es", "pt", "zu"]
  }
}
```

### 2. App Language
Detected automatically from system settings.

---

## 💰 Licensing

### Free Distribution
- No cost to distribute
- Open source or proprietary
- Your choice of license

### Paid Distribution
- Integrate payment provider
- License key validation
- Trial periods supported

---

## 🆘 Support

### Documentation
- Main docs: `/docs/`
- API docs: `/docs/API_DOCUMENTATION.md`
- Architecture: `/ARCHITECTURE.md`

### Community
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Email: support@azora.world

### Professional Support
- Enterprise support available
- Custom builds and deployments
- Training and consultation
- Email: enterprise@azora.world

---

## 🎉 Success Checklist

Before releasing to users:

- [ ] Health check passes (90%+)
- [ ] All installers created successfully
- [ ] Tested on target platforms
- [ ] Code signed (Windows & macOS)
- [ ] Auto-updates configured
- [ ] Release notes written
- [ ] Download links updated
- [ ] Users notified
- [ ] Support channels ready
- [ ] Monitoring in place

---

## 🚀 Next Steps

1. **Build your first installer**
   ```bash
   npm run build:installers
   ```

2. **Test it thoroughly**
   - Install on a clean system
   - Test all features
   - Check for errors

3. **Prepare for distribution**
   - Code sign if possible
   - Write release notes
   - Update documentation

4. **Release to the world!**
   - Create GitHub release
   - Announce to community
   - Monitor feedback

---

**From Africa, For Humanity, Towards Infinity** 🇿🇦 🌍

**AZORA PROPRIETARY LICENSE**  
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

# Azora OS - Quick Start Guide

## 🚀 5-Minute Setup

### For Users (Install Pre-built App)

#### Windows
1. Download `Azora-OS-Setup.exe`
2. Double-click to install
3. Launch from Start Menu
4. Done! 🎉

#### macOS
1. Download `Azora-OS.dmg`
2. Drag to Applications
3. Launch from Applications
4. Done! 🎉

#### Linux
1. Download `Azora-OS.AppImage`
2. Make executable: `chmod +x Azora-OS.AppImage`
3. Run: `./Azora-OS.AppImage`
4. Done! 🎉

---

### For Developers (Build from Source)

#### Prerequisites
- Node.js 22+
- npm 10+
- Git

#### Setup
```bash
# Clone repository
git clone https://github.com/Sizwe780/azora-os.git
cd azora-os

# Install dependencies
npm install

# Run health check
npm run health:full

# Start development server
npm run dev
# Opens http://localhost:3000

# Or start Electron app
npm run electron:dev
```

#### Build Installers
```bash
# Build for your platform
npm run build:installers

# Or use the script
./build-installers.sh  # macOS/Linux
build-installers.bat   # Windows
```

---

## 📖 Documentation

- [Installation Guide](INSTALLER_GUIDE.md) - Complete installer documentation
- [Architecture](ARCHITECTURE.md) - System architecture
- [API Docs](docs/API_DOCUMENTATION.md) - API reference
- [Contributing](CONTRIBUTING.md) - How to contribute

---

## 🆘 Troubleshooting

### App Won't Start
1. Check system requirements
2. Run: `npm run health:full`
3. Check logs in app folder

### Build Fails
1. Update Node.js to 22+
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`

### Installer Issues
- Windows: Run as Administrator
- macOS: Allow in Security & Privacy
- Linux: Make executable with `chmod +x`

---

## 💬 Support

- Email: support@azora.world
- GitHub Issues: Report bugs
- Documentation: Full guides

---

**From Africa, For Humanity, Towards Infinity** 🇿🇦

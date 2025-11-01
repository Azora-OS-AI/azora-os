# 🚀 AZORA OS - STARTUP GUIDE

## ✅ System Status: LAUNCHED!

All Azora services have been launched and are initializing.

---

## 📋 Quick Start

### Option 1: Double-Click Launcher (Easiest)
Simply double-click `START-AZORA-OS.bat` on your Desktop to launch all services.

### Option 2: PowerShell
```powershell
cd "$env:USERPROFILE\Desktop\azora-os"
powershell -ExecutionPolicy Bypass -File .\START-AZORA-OS.ps1
```

---

## 🎯 Core Services

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| **Azora Mint** | 3000 | Economic Engine & DeFi Protocol | 🟢 Starting |
| **Azora Covenant** | 3001 | Blockchain & Smart Contracts | 🟢 Starting |
| **Azora Forge** | 3002 | P2P Marketplace | 🟢 Starting |
| **Azora Aegis** | 3003 | Security & Citadel | 🟢 Starting |
| **Azora Oracle** | 3004 | Data Oracle Service | 🟢 Starting |
| **Azora Sapiens** | 3005 | Universal Education Platform | 🟢 Starting |
| **Azora Nexus** | 3006 | AI Recommendations Hub | 🟢 Active |
| **Azora Synapse** | 3000 | Main Frontend (Next.js) | 🟢 Starting |

---

## 🌐 Access Points

- **Main Frontend**: http://localhost:3000
- **Azora Mint API**: http://localhost:3000/api/mint
- **Azora Covenant API**: http://localhost:3001/api
- **Azora Forge API**: http://localhost:3002/api
- **Azora Aegis API**: http://localhost:3003/api
- **Azora Oracle API**: http://localhost:3004/api
- **Azora Sapiens API**: http://localhost:3005/api
- **Azora Nexus API**: http://localhost:3006/api

---

## 🎉 LAUNCH SPECIAL OFFERS

### Exclusive Promo Codes:
- **SIZWE2025** - Founder: 1 Year FREE (sizwe.ngwenya@azora.world)
- **LAUNCH50** - 50% off for 3 months
- **EARLYBIRD** - 75% off first month
- **AFRICA25** - 25% off for 6 months (Africa region)

### Launch Package Includes:
- ✅ 1 Month FREE Trial
- ✅ 50% OFF Next 2 Months
- ✅ All Premium Features
- ✅ 100 AZR Coin Bonus

---

## 🔍 Checking Service Status

Run this in PowerShell to check status:
```powershell
# Check Node.js processes
Get-Process -Name node

# Check active ports
netstat -ano | findstr ":300"

# View service logs
Get-ChildItem $env:TEMP\azora-*.log
```

---

## 📝 Log Files

All service logs are stored in: `%TEMP%\azora-*.log`

To view logs:
```powershell
notepad $env:TEMP\azora-mint-err.log
notepad $env:TEMP\azora-nexus-err.log
```

---

## 🛑 Stopping Services

### Option 1: Close the PowerShell window running START-AZORA-OS.ps1

### Option 2: Kill all Node processes
```powershell
Stop-Process -Name node -Force
```

---

## 📞 Support & Contact

- **Email**: sizwe.ngwenya@azora.world
- **Phone**: +27 73 234 7232
- **Website**: Coming Soon

---

## 🏗️ Architecture Overview

Azora OS consists of 7 core services:

1. **Azora Mint** - Economic engine managing AZR tokens, staking, and DeFi
2. **Azora Covenant** - Blockchain ledger and smart contract execution
3. **Azora Forge** - P2P marketplace for digital goods and services
4. **Azora Aegis** - Security layer with quantum-resistant encryption
5. **Azora Oracle** - Real-world data feeds and digital twin management
6. **Azora Sapiens** - Education platform with proof-of-knowledge
7. **Azora Nexus** - AI hub for recommendations and neural networks

All services communicate through RESTful APIs and WebSocket connections.

---

## 🔧 Troubleshooting

### Service won't start?
1. Check if port is already in use
2. View error logs in `%TEMP%\azora-[service]-err.log`
3. Ensure Node.js dependencies are installed

### Port conflicts?
Edit the service configuration files to use different ports.

### Dependencies missing?
```powershell
cd azora-mint
npm install
```

---

## 🎯 Next Steps

1. ✅ Services are starting...
2. 🔜 Wait 30-60 seconds for full initialization
3. 🌐 Open http://localhost:3000 in your browser
4. 🎉 Start using Azora OS!

---

**Last Updated**: October 31, 2025
**Version**: 0.1.0
**Status**: LIVE 🚀


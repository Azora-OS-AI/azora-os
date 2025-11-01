# 🚀 Launch All Systems - Instructions

## Quick Start Options

### Option 1: Node.js Launcher (Recommended - Works without Docker)
```bash
cd services/azora-nexus/services
node launch-all-services.js
```

This will:
- ✅ Launch all 21 services simultaneously
- ✅ Verify health of each service
- ✅ Display service URLs (health, metrics, API docs)
- ✅ Handle graceful shutdown (Ctrl+C)

### Option 2: PowerShell Script
```powershell
cd services\azora-nexus\services
.\launch.ps1
```

### Option 3: Docker Compose (Requires Docker Desktop)
```bash
cd services/azora-nexus/services
docker-compose up -d
```

**Note**: Make sure Docker Desktop is running first!

---

## Service Endpoints

Once launched, all services will be available at:

| Service | Port | Health Check | Metrics | API Docs |
|---------|------|--------------|---------|----------|
| Wallet | 4100 | http://localhost:4100/health | http://localhost:4100/metrics | http://localhost:4100/api-docs |
| Blockchain | 4101 | http://localhost:4101/health | http://localhost:4101/metrics | http://localhost:4101/api-docs |
| AI Trading | 4102 | http://localhost:4102/health | http://localhost:4102/metrics | http://localhost:4102/api-docs |
| AI Valuation | 4103 | http://localhost:4103/health | http://localhost:4103/metrics | http://localhost:4103/api-docs |
| Backed Valuation | 4104 | http://localhost:4104/health | http://localhost:4104/metrics | http://localhost:4104/api-docs |
| Compliance | 4105 | http://localhost:4105/health | http://localhost:4105/metrics | http://localhost:4105/api-docs |
| Dashboard | 4106 | http://localhost:4106/health | http://localhost:4106/metrics | http://localhost:4106/api-docs |
| DeFi | 4107 | http://localhost:4107/health | http://localhost:4107/metrics | http://localhost:4107/api-docs |
| Global Adoption | 4108 | http://localhost:4108/health | http://localhost:4108/metrics | http://localhost:4108/api-docs |
| Guardian | 4109 | http://localhost:4109/health | http://localhost:4109/metrics | http://localhost:4109/api-docs |
| Identity | 4110 | http://localhost:4110/health | http://localhost:4110/metrics | http://localhost:4110/api-docs |
| Ledger | 4111 | http://localhost:4111/health | http://localhost:4111/metrics | http://localhost:4111/api-docs |
| Liquidity | 4112 | http://localhost:4112/health | http://localhost:4112/metrics | http://localhost:4112/api-docs |
| Marketplace | 4113 | http://localhost:4113/health | http://localhost:4113/metrics | http://localhost:4113/api-docs |
| NFT | 4114 | http://localhost:4114/health | http://localhost:4114/metrics | http://localhost:4114/api-docs |
| Partnerships | 4115 | http://localhost:4115/health | http://localhost:4115/metrics | http://localhost:4115/api-docs |
| Reporting | 4116 | http://localhost:4116/health | http://localhost:4116/metrics | http://localhost:4116/api-docs |
| Revenue | 4117 | http://localhost:4117/health | http://localhost:4117/metrics | http://localhost:4117/api-docs |
| Staking | 4118 | http://localhost:4118/health | http://localhost:4118/metrics | http://localhost:4118/api-docs |
| User Growth | 4119 | http://localhost:4119/health | http://localhost:4119/metrics | http://localhost:4119/api-docs |
| Subscription | 4129 | http://localhost:4129/health | http://localhost:4129/metrics | http://localhost:4129/api-docs |

---

## Verification

Check if services are running:
```bash
# Quick health check
curl http://localhost:4100/health
curl http://localhost:4101/health
# ... etc
```

Or use the integration test:
```bash
node tests/integration/azora-nexus-services.test.js
```

---

## Stopping Services

### Node.js Launcher
Press `Ctrl+C` in the terminal where services are running.

### Docker Compose
```bash
docker-compose down
```

---

## Troubleshooting

### Port Already in Use
If a port is already in use, either:
1. Stop the existing service on that port
2. Change the PORT environment variable for that service

### Services Not Starting
1. Check Node.js is installed: `node --version`
2. Check dependencies: `npm install` in each service directory
3. Check logs for errors

### Docker Not Running
If using Docker Compose:
1. Start Docker Desktop
2. Wait for it to fully start
3. Try again

---

## Status

🎯 **All systems ready for launch!**

Use the launcher script for the easiest startup experience.


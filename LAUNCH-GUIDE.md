# 🚀 Azora OS - Launch Guide

## Quick Start (30 seconds)

```bash
# Install dependencies (first time only)
npm install

# Launch everything with the orchestrator
npm run launch
```

That's it! The orchestrator handles everything automatically.

---

## Launch Options

### Option 1: Advanced Orchestrator (Recommended ⭐)

**Features:**
- ✅ Intelligent dependency management
- ✅ Priority-based startup (critical services first)
- ✅ Auto-retry and error recovery
- ✅ Real-time health monitoring
- ✅ Live dashboard at `http://localhost:9999`
- ✅ Graceful shutdown
- ✅ Service restart on failure

```bash
npm run launch

# Or directly:
tsx launch-orchestrator.ts

# Or with Node.js:
npx tsx launch-orchestrator.ts
```

**Dashboard:** Open `http://localhost:9999` to see:
- All services status in real-time
- Health indicators
- Error messages
- Restart counts
- Port mappings

---

### Option 2: Simple Launcher

Basic launch without advanced features:

```bash
node LAUNCH_ALL_SERVICES.js
```

---

### Option 3: Resilient Launcher

Launch with mock mode (no DB/API requirements):

```bash
node START_ALL_SERVICES_RESILIENT.js
```

---

## Service Architecture

### Priority 1: Core Infrastructure (Critical)
These start first - they're required by other services:

| Service | Port | Description |
|---------|------|-------------|
| **Azora Aegis** | 4000 | Security & Compliance - Core Infrastructure |
| **Azora Covenant** | 4099 | Blockchain & Smart Contracts |

### Priority 2: Essential Services
These depend on core services:

| Service | Port | Description |
|---------|------|-------------|
| **Azora Mint** | 4300 | Financial Services & Currency |
| **Azora Nexus** | 3006 | AI Recommendations Engine |
| **Azora Sapiens** | 4200 | Education Platform |

### Priority 3: Application Services
These provide specific functionality:

| Service | Port | Description |
|---------|------|-------------|
| **Azora Forge** | 12345 | Marketplace & Commerce |
| **21 Nexus Sub-Services** | 4100-4129 | Specialized microservices |

---

## Dependency Graph

```
Azora Aegis (Security)
├── Azora Covenant (Blockchain)
│   ├── Azora Mint (Finance)
│   │   ├── Azora Sapiens (Education)
│   │   ├── Azora Forge (Marketplace)
│   │   └── Revenue Service
│   ├── DeFi Service
│   ├── Blockchain Service
│   ├── NFT Service
│   └── Staking Service
├── Azora Nexus (AI)
│   ├── Wallet Service
│   ├── AI Trading
│   ├── Dashboard
│   └── ... (17 more sub-services)
└── Compliance Service
    └── Guardian Service
        └── Identity Service
```

---

## Understanding the Launch Process

### Phase 1: Core Infrastructure (0-10s)
```
🚀 Launching Azora Aegis...
✅ Azora Aegis started on port 4000
💚 Health check passed

🚀 Launching Azora Covenant...
⏸️  WAIT: Waiting for dependency: Azora Aegis
✅ Azora Covenant started on port 4099
💚 Health check passed
```

### Phase 2: Essential Services (10-20s)
```
🚀 Launching Azora Mint...
⏸️  WAIT: Waiting for dependencies: Azora Covenant, Azora Aegis
✅ Azora Mint started on port 4300

🚀 Launching Azora Nexus...
✅ Azora Nexus started on port 3006

... etc
```

### Phase 3: Application Services (20-40s)
```
🚀 Launching 21 Nexus sub-services in parallel...
✅ Wallet Service started on port 4100
✅ Blockchain Service started on port 4101
... (all sub-services)
```

### Phase 4: Health Verification (40-50s)
```
🔍 Performing final health checks...
💚 Azora Aegis - healthy
💚 Azora Covenant - healthy
💚 Azora Mint - healthy
... (all services)

📊 LAUNCH SUMMARY:
   Total Services: 27
   Running: 27
   Healthy: 27
   Failed: 0

🎉 ALL SYSTEMS OPERATIONAL! 🚀
```

---

## Monitoring & Management

### Real-Time Dashboard

The orchestrator includes a web dashboard at `http://localhost:9999`:

**Features:**
- Service status grid
- Health indicators (green/yellow/red)
- Port mappings
- Error messages
- Restart counts
- Auto-refresh every 5 seconds

### Command Line Monitoring

The orchestrator prints continuous status updates:
- Service startup messages
- Health check results
- Error notifications
- Dependency wait states
- Final summary

---

## Service Health Checks

Each service is monitored at:
```
http://localhost:{PORT}/health
```

**Health Check Process:**
1. Service starts
2. Wait 1-2 seconds for initialization
3. Send GET request to `/health` endpoint
4. Expect 200 OK response
5. Retry up to 10 times (1 second apart)
6. Mark as healthy or unhealthy

**Health Statuses:**
- 💚 **Healthy**: Service responding to health checks
- ❓ **Unknown**: Service starting or no health endpoint
- 💔 **Unhealthy**: Service not responding

---

## Error Recovery & Auto-Restart

### Automatic Restart

Services automatically restart on failure:

| Priority | Max Retries | Restart Delay |
|----------|-------------|---------------|
| 1 (Critical) | 3 attempts | 5 seconds |
| 2 (Important) | 2 attempts | 5 seconds |
| 3 (Optional) | 1 attempt | 5 seconds |

**Example:**
```
❌ Azora Mint exited with code 1
🔄 Attempting to restart Azora Mint (Attempt 1/2)...
⏳ Waiting 5 seconds...
🚀 Launching Azora Mint...
✅ Azora Mint restarted successfully
```

### Manual Restart

To restart a specific service:
1. Stop the orchestrator (Ctrl+C)
2. Re-run `npm run launch`
3. Or manually kill and restart the specific service

---

## Graceful Shutdown

The orchestrator handles shutdown elegantly:

```
Press Ctrl+C

🛑 Received SIGINT - Initiating graceful shutdown...
   Stopping 27 services...
   Stopping Azora Aegis...
   Stopping Azora Covenant...
   ... (all services)
   
✅ All services stopped
👋 Azora OS shutdown complete
```

**Shutdown Process:**
1. Catch SIGINT/SIGTERM signal
2. Send SIGTERM to all services (graceful)
3. Wait 3 seconds for cleanup
4. Force kill (SIGKILL) any remaining processes
5. Exit cleanly

---

## Troubleshooting

### Port Already in Use

**Problem:**
```
⚠️  Port 4000 already in use - Azora Aegis may already be running
```

**Solution 1:** Kill existing process
```bash
# Find process on port 4000
lsof -i :4000    # macOS/Linux
netstat -ano | findstr :4000    # Windows

# Kill it
kill -9 {PID}    # macOS/Linux
taskkill /PID {PID} /F    # Windows
```

**Solution 2:** Change port in service config

---

### Service Won't Start

**Problem:**
```
❌ Azora Mint - Entry file not found
```

**Possible Causes:**
1. Service not installed
2. Entry file path incorrect
3. Missing dependencies

**Solutions:**
```bash
# Install service dependencies
cd services/azora-mint
npm install

# Check if entry file exists
ls src/index.ts

# Try alternate entry file (index.js, server.js, main.ts)
```

---

### Dependency Wait Timeout

**Problem:**
```
⏸️  WAIT: Azora Sapiens - Waiting for dependency: Azora Mint
❌ Timeout waiting for dependency
```

**Solution:**
Check if dependency service started successfully:
```bash
curl http://localhost:4300/health
```

If unhealthy, check that service's logs for errors.

---

### Service Health Check Failing

**Problem:**
```
💔 Azora Nexus - unhealthy
```

**Solutions:**

1. **Check logs** - Look at orchestrator output for errors
2. **Manually test health endpoint:**
   ```bash
   curl http://localhost:3006/health
   ```
3. **Check service logs** in the service directory
4. **Restart** the specific service

---

### Dashboard Not Loading

**Problem:** Can't access `http://localhost:9999`

**Solutions:**
1. Check orchestrator is running
2. Check port 9999 not in use
3. Try `http://127.0.0.1:9999`
4. Check firewall settings

---

## Performance Optimization

### Fast Startup

To minimize startup time:
1. ✅ Use SSD (not HDD)
2. ✅ Close unnecessary applications
3. ✅ Increase Node.js memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run launch
   ```

### Resource Monitoring

Monitor system resources during launch:
```bash
# CPU & Memory
htop    # Linux/macOS
Task Manager    # Windows

# Port usage
netstat -tulpn    # Linux
netstat -an    # macOS/Windows
```

---

## Development vs Production

### Development Mode (Default)
```bash
npm run launch
```
- All services on localhost
- Debug logging enabled
- Hot reload (if configured)
- Mock data acceptable

### Production Mode
```bash
NODE_ENV=production npm run launch
```
- Production optimizations
- Minimal logging
- Real databases required
- Security hardened

---

## Advanced Configuration

### Environment Variables

Create `.env` file:
```bash
# Node environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Database (if required)
DATABASE_URL=postgresql://...

# API Keys (if required)
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

### Custom Service Ports

Edit `launch-orchestrator.ts`:
```typescript
{
  name: 'Azora Sapiens',
  port: 4200,    // ← Change this
  dir: './services/azora-sapiens',
  // ...
}
```

---

## Testing Launch

### Quick Health Check

Test all services at once:
```bash
# Create test script
cat > check-all.sh << 'EOF'
#!/bin/bash
for port in 4000 4099 4200 4300 3006 12345 4100 4101 4102; do
  echo "Checking port $port..."
  curl -s http://localhost:$port/health && echo " ✅" || echo " ❌"
done
EOF

chmod +x check-all.sh
./check-all.sh
```

### Integration Test

Run full integration test:
```bash
npm run test:integration
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Launch Test
on: [push, pull_request]

jobs:
  launch-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - run: npm install
      - run: npm run launch &
      - run: sleep 60  # Wait for launch
      - run: npm run test:health
```

---

## Best Practices

### ✅ DO:
- Start with the orchestrator (`npm run launch`)
- Monitor the dashboard during development
- Check health endpoints after launch
- Use graceful shutdown (Ctrl+C)
- Review error messages in the orchestrator output

### ❌ DON'T:
- Kill processes with SIGKILL unless necessary
- Start services manually without the orchestrator
- Ignore health check failures
- Run multiple orchestrators simultaneously
- Change ports without updating dependencies

---

## Support

### Common Issues Database
- **Port conflicts**: Use orchestrator's auto-detection
- **Dependency errors**: Check service order in config
- **Health check timeouts**: Increase `startupTimeout`
- **Memory issues**: Increase Node.js heap size

### Getting Help

1. **Check Dashboard**: `http://localhost:9999`
2. **Read Logs**: Look at orchestrator output
3. **Test Health**: `curl http://localhost:{PORT}/health`
4. **GitHub Issues**: Report bugs with logs
5. **Documentation**: Check service-specific READMEs

---

## What's Next?

Once services are running:

1. **🎓 Education**: Visit `http://localhost:4200`
2. **💰 Finance**: Visit `http://localhost:4300`
3. **🛍️ Marketplace**: Visit `http://localhost:12345`
4. **📊 Dashboard**: Visit `http://localhost:4106`
5. **🔐 Security**: Visit `http://localhost:4000`

---

## Summary

```bash
# One command to launch everything:
npm run launch

# Monitor at:
http://localhost:9999

# Stop with:
Ctrl+C
```

**It's that simple!** 🚀

---

**© 2025 Azora ES (Pty) Ltd. All Rights Reserved.**

*For the full technical documentation, see the inline comments in `launch-orchestrator.ts`*

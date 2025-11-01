# Services

This directory contains all Azora OS microservices.

## Service Structure

Each service should follow the standard structure defined in [docs/STRUCTURE_STANDARDS.md](../docs/STRUCTURE_STANDARDS.md).

## Core Services

### Azora Aegis
Security, compliance, and validation service.

### Azora Covenant
Blockchain, contracts, and founder API service.

### Azora Education
Education platform service.

### Azora Forge
Marketplace service.

### Azora Mint
Economic engine and DeFi service.

### Azora Nexus
AI recommendations and neural hub service.

### Azora Oracle
Intelligence oracle service.

### Azora Sapiens
Education platform backend service.

### Azora Scriptorium
Document and content management service.

### Azora Synapse
Synapse platform service.

### Azora Workspace
Workspace management service.

## Service Standards

All services must have:
- `README.md` - Service documentation
- `package.json` - Dependencies and scripts
- Entry point (`index.js`, `index.ts`, or `src/index.ts`)

See [docs/STRUCTURE_STANDARDS.md](../docs/STRUCTURE_STANDARDS.md) for complete structure requirements.

## Adding a New Service

1. Create service directory: `services/your-service-name/`
2. Add required files: `README.md`, `package.json`
3. Follow standard structure from `docs/STRUCTURE_STANDARDS.md`
4. Update this README to list your service


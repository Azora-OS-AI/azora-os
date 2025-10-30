# Development Environment Setup

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [hardhat.config.ts](file://hardhat.config.ts)
- [services/azora-mint/package.json](file://services/azora-mint/package.json)
- [azora/azora-mint-mine-engine-next/package.json](file://azora/azora-mint-mine-engine-next/package.json)
- [vessels/docker-compose.yml](file://vessels/docker-compose.yml)
- [codex/DEVELOPER_GUIDE.md](file://codex/DEVELOPER_GUIDE.md)
</cite>

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Dependency Installation](#dependency-installation)
4. [Environment Configuration](#environment-configuration)
5. [Running with Docker](#running-with-docker)
6. [Supabase Configuration](#supabase-configuration)
7. [Blockchain Network Setup](#blockchain-network-setup)
8. [Common Issues and Solutions](#common-issues-and-solutions)

## Prerequisites

Before setting up the Azora OS development environment, ensure you have the following tools installed:

- **Node.js 22+**: Required for running JavaScript/TypeScript applications
- **npm or yarn**: Package managers for Node.js dependencies
- **Docker and Docker Compose**: For containerized service deployment
- **Git**: For version control and repository cloning
- **TypeScript 5+**: For type checking and compilation
- **Hardhat**: Ethereum development environment for smart contracts

Verify your Node.js and npm installations:
```bash
node --version  # Should show v22.x.x or higher
npm --version   # Should show 10.x.x or higher
```

**Section sources**
- [README.md](file://README.md#L1-L555)
- [package.json](file://package.json#L1-L176)

## Repository Setup

Clone the Azora OS repository and navigate to the project directory:

```bash
git clone https://github.com/Sizwe780/azora-os
cd azora-os
```

The repository contains multiple subsystems organized in a monorepo structure:
- **azora/**: Core application components including Aegis, Mint-Mine Engine, and UI
- **services/**: Microservices architecture with individual service implementations
- **vessels/**: Docker orchestration configurations for different deployment scenarios
- **contracts/**: Solidity smart contracts for blockchain functionality
- **genome/**: AI agent framework and core intelligence components

Initialize the repository submodules if present:
```bash
git submodule init
git submodule update
```

**Section sources**
- [README.md](file://README.md#L1-L555)
- [codex/DEVELOPER_GUIDE.md](file://codex/DEVELOPER_GUIDE.md#L1-L124)

## Dependency Installation

Install the root-level dependencies using npm:

```bash
npm install
```

This installs dependencies for the main application including:
- Next.js framework for the frontend
- Express.js for backend services
- Hardhat for blockchain development
- Testing frameworks (Jest, Supertest)
- Linting and formatting tools (ESLint, Prettier)

For service-specific development, navigate to individual service directories and install their dependencies:

```bash
cd services/azora-mint
npm install
```

The Azora Mint service has specific dependencies for:
- Blockchain integration (ethers, @nomicfoundation/hardhat-ethers)
- Database connectivity (mongoose, pg, redis)
- API security (helmet, cors, express-rate-limit)
- Documentation (swagger-jsdoc, swagger-ui-express)

**Section sources**
- [package.json](file://package.json#L1-L176)
- [services/azora-mint/package.json](file://services/azora-mint/package.json#L1-L80)

## Environment Configuration

Create a `.env` file in the root directory to configure environment variables:

```env
# Blockchain Configuration
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
AZORA_RPC_URL=https://rpc.azora.network

# Database Configuration
DB_PASSWORD=your_database_password

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Application Configuration
NODE_ENV=development
REACT_APP_API_BASE=http://localhost
```

The Hardhat configuration file (`hardhat.config.ts`) defines network settings including:
- Local development network (localhost:8545)
- Azora network configuration (chainId: 195)
- Solidity compiler version (0.8.20) with optimizer settings

**Section sources**
- [hardhat.config.ts](file://hardhat.config.ts#L1-L54)
- [package.json](file://package.json#L1-L176)

## Running with Docker

Use Docker Compose to run the complete Azora OS platform:

```bash
# Start all services defined in vessels/docker-compose.yml
docker-compose -f vessels/docker-compose.yml up --build

# Run in detached mode
docker-compose -f vessels/docker-compose.yml up -d

# Stop all services
docker-compose -f vessels/docker-compose.yml down
```

The docker-compose configuration includes:
- **main-app**: Frontend application running on port 3000
- **ai-personalization**: AI service on port 3010
- **ai-sentiment**: Sentiment analysis service on port 3011
- **ai-chatbot**: Conversational AI on port 3012
- **ai-vision**: Computer vision service on port 3013

Each service is built from its respective directory and configured with appropriate environment variables and port mappings.

```mermaid
graph TB
Client[Client Application] --> MainApp[main-app:3000]
MainApp --> AI_Personalization[ai-personalization:3010]
MainApp --> AI_Sentiment[ai-sentiment:3011]
MainApp --> AI_Chatbot[ai-chatbot:3012]
MainApp --> AI_Vision[ai-vision:3013]
subgraph "Docker Services"
MainApp
AI_Personalization
AI_Sentiment
AI_Chatbot
AI_Vision
end
style Client fill:#f9f,stroke:#333
style subgraph fill:#eef,stroke:#666
```

**Diagram sources**
- [vessels/docker-compose.yml](file://vessels/docker-compose.yml#L1-L30)

**Section sources**
- [vessels/docker-compose.yml](file://vessels/docker-compose.yml#L1-L30)
- [README.md](file://README.md#L1-L555)

## Supabase Configuration

Configure Supabase for database and authentication services:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Obtain your project URL, anon key, and service key from the API settings
3. Set the environment variables in your `.env` file

Apply the database schema by running:
```bash
npm run db:setup
```

This command instructs you to run the `supabase/schema.sql` script in your Supabase dashboard to initialize the database structure.

The Supabase client is integrated through the `@supabase/supabase-js` package, which is listed as a dependency in the root package.json. This enables:
- Authentication management
- Real-time database subscriptions
- Storage operations
- Function invocations

**Section sources**
- [package.json](file://package.json#L1-L176)
- [README.md](file://README.md#L1-L555)

## Blockchain Network Setup

Configure the blockchain development environment using Hardhat:

1. Ensure your `.env` file contains the `BLOCKCHAIN_PRIVATE_KEY`
2. The private key is used for signing transactions on the Azora network (chainId: 195)
3. The RPC endpoint is configured to connect to `https://rpc.azora.network` by default

Compile and test smart contracts:
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contracts
npx hardhat run scripts/deploy.js --network azora
```

The contracts are located in the `contracts/` directory and include:
- **MockERC20.sol**: ERC-20 token implementation for testing
- **Redemption.sol**: Redemption logic for token economics

Artifacts from compilation are stored in the `artifacts/` directory, while build information is kept in `artifacts/build-info/`.

**Section sources**
- [hardhat.config.ts](file://hardhat.config.ts#L1-L54)
- [README.md](file://README.md#L1-L555)

## Common Issues and Solutions

### Node.js Version Issues
**Problem**: Incompatible Node.js version causing package installation failures
**Solution**: Use Node.js 22+ as specified in the project requirements
```bash
# Check current version
node --version

# Use nvm to switch to required version
nvm install 22
nvm use 22
```

### Missing Environment Variables
**Problem**: Application fails to start due to undefined environment variables
**Solution**: Create a complete `.env` file with all required variables
```bash
# Verify environment variables are loaded
console.log('Supabase URL defined:', !!process.env.SUPABASE_URL);
```

### Docker Build Failures
**Problem**: Docker containers fail to build due to missing dependencies
**Solution**: Clean the Docker build cache and rebuild
```bash
# Clean Docker build cache
docker builder prune --all

# Rebuild with forced rebuild
docker-compose -f vessels/docker-compose.yml build --no-cache
```

### Blockchain Connection Issues
**Problem**: Unable to connect to the Azora network
**Solution**: Verify RPC URL and private key configuration
```bash
# Test connection using curl
curl https://rpc.azora.network/health
```

### Dependency Conflicts
**Problem**: Conflicting dependency versions between root and service packages
**Solution**: Use consistent versions across the monorepo
```bash
# Check for version conflicts
npm ls typescript
npm ls react
```

**Section sources**
- [README.md](file://README.md#L1-L555)
- [package.json](file://package.json#L1-L176)
- [hardhat.config.ts](file://hardhat.config.ts#L1-L54)
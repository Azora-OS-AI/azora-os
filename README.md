# Azora OS

A comprehensive technology platform that combines education, financial services, and infrastructure tools to create a self-sustaining ecosystem.

[![License: AZORA PROPRIETARY](https://img.shields.io/badge/License-AZORA%20PROPRIETARY-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

## Overview

Azora OS is a technology platform that provides educational opportunities while enabling users to earn value through knowledge-based activities. The platform integrates education, financial services, and infrastructure tools designed for emerging markets.

## Core Features

### Education Platform
- Interactive learning with AI-powered tools
- Multi-language support (11 South African languages)
- Offline-first design for areas with limited connectivity
- Progress tracking and assessment systems

### Financial Services
- Banking integration for South African users
- Cryptocurrency integration (AZR token)
- Mobile money support
- Proof-of-Knowledge reward system

### Infrastructure Tools
- Device security with GPS tracking
- Anti-theft protection
- Self-healing system monitoring
- Real-time health dashboards

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Supabase
- **APIs**: Luno (cryptocurrency), Capitec (banking)
- **AI Services**: OpenAI, AssemblyAI
- **Deployment**: Docker, Kubernetes, Vercel

## Quick Start

### Prerequisites
- Node.js 22+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Azora-OS-AI/azora-os.git
cd azora-os

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linting

# Services
npm run services     # Start all services
npm run db:migrate   # Run database migrations
```

## Project Structure

```
azora-os/
├── ui/                 # Frontend application
├── services/           # Backend services
├── core/              # Core system components
├── deployment/        # Deployment configurations
├── integration/       # System integration
├── .openhands/        # OpenHands microagents
└── docs/              # Documentation
```

## Core Systems

### Aegis Citadel
Global fund management and sovereign seed grants

### Azora Sapiens
Education platform with AI-powered learning tools

### Azora Mint
Economic engine handling rewards and token distribution

### Azora Oracle
Intelligence oracle providing real-time data and insights

## API Endpoints

### Health Check
```
GET /health - System health status
```

### Education
```
GET /api/programs - Available programs
POST /api/enroll - Enroll in program
```

### Financial
```
GET /api/metrics - Economic metrics
POST /api/knowledge-reward - Process rewards
```

## Development

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`

3. Start the development environment:
```bash
npm run dev
```

### Docker Development

```bash
# Build and run with Docker
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up
```

## Deployment

### Vercel Deployment
```bash
npm run deploy:vercel
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.

Unauthorized copying of this project, via any medium is strictly prohibited.
Proprietary and confidential.

## Support

For support and questions, please refer to the documentation or contact the development team.
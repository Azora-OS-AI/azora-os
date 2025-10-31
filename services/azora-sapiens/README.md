# Azora Sapiens

Universal Education Platform with Proof-of-Knowledge Protocol.

## Overview

Azora Sapiens is the core education platform service for Azora OS, providing comprehensive educational infrastructure from primary to university level. It implements the Proof-of-Knowledge (POK) protocol, enabling students to earn cryptocurrency rewards for learning achievements.

## Features

- **CKQ Programs**: Complete Knowledge Qualification programs
- **Enrollment Management**: Student enrollment and progress tracking
- **Aegis-Protected Assessments**: Secure, integrity-monitored exams
- **Proof-of-Knowledge Integration**: Automatic reward distribution for learning milestones
- **Real-time Monitoring**: WebSocket-based Aegis integrity monitoring
- **Multi-level Education**: Primary, secondary, and university programs

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
# or
node sapiens-service.js
```

## Configuration

Set environment variables:
- `PORT` - Service port (default: 4200)
- `AZORA_MINT_URL` - Azora Mint service URL for rewards
- `AZORA_AEGIS_URL` - Aegis Citadel URL for integrity monitoring

## API Endpoints

### Enrollment
- `POST /api/enroll` - Enroll in CKQ program
- `GET /api/enrollments/:userId` - Get user enrollment history

### Programs
- `GET /api/programs` - List available CKQ programs

### Assessments
- `POST /api/exam/start` - Start Aegis-protected exam
- `POST /api/exam/submit` - Submit exam for grading

### Modules
- `POST /api/module/complete` - Complete module (triggers rewards)

### Knowledge Graph
- `GET /api/knowledge-graph/status` - Ascension Protocol progress

## Integration

### With Azora Mint
When a student completes a module or passes an exam, Azora Sapiens calls:
```
POST {AZORA_MINT_URL}/api/knowledge-reward
```

### With Azora Aegis
All assessments are protected by Aegis integrity monitoring via WebSocket.

## License

AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.


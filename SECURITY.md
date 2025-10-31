# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead, please report vulnerabilities to:
- **Email**: security@azora.world
- **GPG Key**: [Available on request]

### What to Include
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

### Response Time
- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 1-7 days
  - Medium: 1-4 weeks
  - Low: Next release

### Disclosure Policy
- We follow responsible disclosure
- Vulnerabilities will be disclosed after fix is released
- Credit will be given to reporter (unless anonymity requested)

## Security Features

### Data Protection
- AES-256-GCM encryption at rest
- TLS 1.3 for data in transit
- End-to-end encryption for sensitive operations

### Authentication
- JWT with RS256 signing
- Multi-factor authentication support
- Session management with secure tokens

### Code Security
- Regular security audits
- Dependency vulnerability scanning
- Static code analysis
- Penetration testing

### Platform Security
- Sandboxed execution (Electron)
- Content Security Policy
- Secure context enforcement
- No eval() or unsafe operations

## Third-Party Dependencies

We regularly audit and update dependencies:
```bash
npm audit
npm audit fix
```

## Security Updates

Security updates are released as soon as possible:
- **Critical**: Immediate release
- **High**: Within 7 days
- **Medium/Low**: Next regular release

## Contact

- **Security Team**: security@azora.world
- **General Support**: support@azora.world
- **Emergency**: +27-73-234-7232

---

**AZORA PROPRIETARY LICENSE**
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

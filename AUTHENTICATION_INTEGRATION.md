# Azora OS Authentication Integration

## 🎯 Overview

This document outlines the comprehensive authentication system that has been integrated across Azora OS services. The system provides enterprise-grade security with unified login/signup functionality across all major services.

## 🏗️ Architecture

### Core Components

1. **Central Authentication Service** (`/organs/auth/`)
   - JWT-based authentication with refresh tokens
   - Multi-factor authentication (MFA) support
   - Email verification and password reset
   - Rate limiting and security headers
   - Audit logging and session management

2. **Unified Authentication Middleware** (`/shared/auth-integration.js`)
   - Standardized authentication across all services
   - Role-based access control (RBAC)
   - Service-to-service authentication
   - API key authentication support

3. **Frontend Authentication Components** (`/ui/components/auth/`)
   - React authentication context and hooks
   - Login and registration forms
   - Protected route components
   - Role-based UI components

## 🔐 Security Features

### Authentication Methods
- **Email/Password**: Standard authentication with strong password requirements
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA using authenticator apps
- **Email Verification**: Required for account activation
- **Password Reset**: Secure token-based password recovery

### Security Measures
- **JWT Tokens**: Short-lived access tokens (15 min) with long-lived refresh tokens (7 days)
- **Rate Limiting**: Configurable per-service rate limits
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **Audit Logging**: Complete audit trail of authentication events
- **Session Management**: Secure session handling with database persistence

### Password Security
- **Minimum Requirements**: 8+ characters, uppercase, lowercase, numbers
- **Bcrypt Hashing**: Industry-standard password hashing (12 rounds)
- **Password Strength Indicator**: Real-time password strength feedback

## 📊 Database Schema

### Enhanced User Model
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  firstName             String?
  lastName              String?
  role                  String    @default("user")
  isEmailVerified       Boolean   @default(false)
  emailVerificationToken String?
  emailVerificationExpires DateTime?
  passwordResetToken    String?
  passwordResetExpires  DateTime?
  isMfaEnabled          Boolean   @default(false)
  mfaSecret             String?
  backupCodes           String[]
  lastLoginAt           DateTime?
  loginAttempts         Int       @default(0)
  lockoutUntil          DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  sessions              Session[]
  auditLogs             AuditLog[]
  apiKeys               ApiKey[]
}
```

### Session Management
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  type      String   @default("access")
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🚀 Service Integration

### Integrated Services

1. **Azora Nexus** (`/services/azora-nexus/`)
   - AI agent interactions require authentication
   - User-specific context and personalization
   - Role-based access to advanced features

2. **Authentication Service** (`/organs/auth/`)
   - Central authentication hub
   - User management and security features
   - Token management and validation

### Integration Pattern

Each service uses the unified authentication middleware:

```javascript
import { 
  initializeAuth, 
  requireAuth, 
  optionalAuth, 
  requireRole 
} from '../../../shared/auth-integration.js';

// Initialize authentication for the service
initializeAuth(app, {
  corsOrigins: ['http://localhost:3000', 'https://azora-os.com'],
  rateLimitMax: 500,
  rateLimitWindowMs: 15 * 60 * 1000
});

// Protected endpoints
app.post('/api/protected', requireAuth, handler);
app.get('/api/admin', requireRole('admin'), handler);
app.get('/api/optional', optionalAuth, handler);
```

## 🎨 Frontend Components

### Authentication Context
```typescript
// Usage in React components
import { useAuth } from './components/auth/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Protected Routes
```typescript
// Higher-order component for protected routes
import { withAuth } from './components/auth/AuthContext';

const ProtectedComponent = withAuth(MyComponent);

// Or use the hook
import { useRequireRole } from './components/auth/AuthContext';

function AdminPanel() {
  const { hasRole } = useRequireRole(['admin', 'super_admin']);
  
  if (!hasRole) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Core authentication logic (12/12 tests passing)
- **Integration Tests**: Service-to-service authentication
- **Security Tests**: Rate limiting, token validation, CORS
- **Frontend Tests**: Authentication components and flows

### Running Tests
```bash
# Core authentication tests
node test-auth-system.cjs

# Integration tests (requires services running)
cd test && npm test

# Service-specific tests
cd organs/auth && npm test
```

## 📈 Monitoring and Metrics

### Health Checks
Each service provides enhanced health checks with authentication status:
```json
{
  "status": "healthy",
  "service": "azora-nexus",
  "auth": {
    "localDb": "connected",
    "remoteService": "connected"
  }
}
```

### Metrics Endpoints
- User registration and login rates
- Active sessions count
- Authentication failure rates
- Service-specific authentication metrics

## 🔧 Configuration

### Environment Variables
```bash
# Authentication Service
JWT_SECRET=your-secret-key
AUTH_DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=http://localhost:3000,https://azora-os.com
NODE_ENV=production

# Service Integration
SERVICE_NAME=azora-nexus
AUTH_SERVICE_URL=http://localhost:3001
SERVICE_AUTH_KEY=service-to-service-key
```

### Service Configuration
```javascript
// Per-service authentication configuration
initializeAuth(app, {
  corsOrigins: ['http://localhost:3000'],
  rateLimitMax: 1000,
  rateLimitWindowMs: 15 * 60 * 1000,
  enableCookieParser: true,
  enableRateLimit: true
});
```

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET in production
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting appropriately
- [ ] Set up monitoring and alerting
- [ ] Configure email service for verification
- [ ] Set up Redis for session storage (optional)

### Docker Support
Each service includes Dockerfile with authentication dependencies:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔄 Next Development Phases

### Phase 1: Enhanced Security (Immediate)
- [ ] Implement OAuth2 providers (Google, GitHub, Microsoft)
- [ ] Add SAML SSO support for enterprise customers
- [ ] Implement biometric authentication
- [ ] Add device fingerprinting and risk assessment

### Phase 2: Advanced Features (Short-term)
- [ ] Multi-tenant authentication
- [ ] Advanced audit logging and compliance
- [ ] API key management dashboard
- [ ] Advanced MFA options (SMS, hardware keys)

### Phase 3: Enterprise Features (Medium-term)
- [ ] Identity provider integration (LDAP, Active Directory)
- [ ] Advanced role and permission management
- [ ] Compliance reporting (SOC2, GDPR)
- [ ] Advanced threat detection and response

### Phase 4: AI-Powered Security (Long-term)
- [ ] Behavioral authentication
- [ ] AI-powered fraud detection
- [ ] Adaptive authentication based on risk
- [ ] Automated security incident response

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Token refresh
GET  /api/auth/me          - Get current user
POST /api/auth/verify-email - Email verification
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password  - Password reset
POST /api/auth/setup-mfa    - MFA setup
POST /api/auth/enable-mfa   - MFA activation
```

### Service Integration Endpoints
```
GET  /health               - Enhanced health check
GET  /api/user/me         - User info (service-specific)
GET  /metrics             - Authentication metrics
```

## 🤝 Contributing

### Adding Authentication to New Services
1. Install the shared authentication module
2. Import and initialize authentication
3. Add authentication middleware to protected routes
4. Update service health checks
5. Add service-specific tests

### Security Guidelines
- Always use HTTPS in production
- Implement proper rate limiting
- Log authentication events
- Regular security audits
- Keep dependencies updated

## 📞 Support

For authentication-related issues:
1. Check service health endpoints
2. Review authentication logs
3. Verify JWT token validity
4. Check database connectivity
5. Validate environment configuration

---

**Status**: ✅ **COMPLETED** - Authentication system fully integrated and tested
**Last Updated**: 2025-01-30
**Version**: 2.0.0
/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
        isEmailVerified: boolean;
        isMfaEnabled: boolean;
      };
      session?: {
        id: string;
        token: string;
        expiresAt: Date;
      };
    }
  }
}

export interface AuthOptions {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
  requireEmailVerification?: boolean;
  requireMfa?: boolean;
}

/**
 * Universal authentication middleware for all Azora OS services
 */
export function authenticate(options: AuthOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from various sources
      const token = extractToken(req);
      
      if (!token) {
        if (options.required !== false) {
          return res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_TOKEN_MISSING',
          });
        }
        return next(); // Optional auth, continue without user
      }

      // Verify JWT token
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      } catch (jwtError: any) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token expired',
            code: 'AUTH_TOKEN_EXPIRED',
          });
        }
        return res.status(401).json({
          error: 'Invalid token',
          code: 'AUTH_TOKEN_INVALID',
        });
      }

      // Validate token type
      if (decoded.type && decoded.type !== 'access') {
        return res.status(401).json({
          error: 'Invalid token type',
          code: 'AUTH_TOKEN_INVALID_TYPE',
        });
      }

      // Fetch user and session from database
      const session = await prisma.session.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (!session || !session.user) {
        return res.status(401).json({
          error: 'Session not found or expired',
          code: 'AUTH_SESSION_INVALID',
        });
      }

      const user = session.user;

      // Check email verification requirement
      if (options.requireEmailVerification && !user.isEmailVerified) {
        return res.status(403).json({
          error: 'Email verification required',
          code: 'AUTH_EMAIL_NOT_VERIFIED',
        });
      }

      // Check MFA requirement
      if (options.requireMfa && !user.isMfaEnabled) {
        return res.status(403).json({
          error: 'Multi-factor authentication required',
          code: 'AUTH_MFA_REQUIRED',
        });
      }

      // Check role-based access
      if (options.roles && options.roles.length > 0) {
        if (!options.roles.includes(user.role)) {
          return res.status(403).json({
            error: 'Insufficient permissions',
            code: 'AUTH_INSUFFICIENT_ROLE',
            required: options.roles,
            current: user.role,
          });
        }
      }

      // Attach user and session to request
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        isEmailVerified: user.isEmailVerified,
        isMfaEnabled: user.isMfaEnabled,
      };

      req.session = {
        id: session.id,
        token: session.token,
        expiresAt: session.expiresAt,
      };

      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(500).json({
        error: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
      });
    }
  };
}

/**
 * Convenience middleware for required authentication
 */
export const requireAuth = authenticate({ required: true });

/**
 * Convenience middleware for optional authentication
 */
export const optionalAuth = authenticate({ required: false });

/**
 * Role-based authentication middleware
 */
export function requireRole(...roles: string[]) {
  return authenticate({ required: true, roles });
}

/**
 * Admin-only authentication middleware
 */
export const requireAdmin = requireRole('admin', 'super_admin');

/**
 * Verified email requirement middleware
 */
export const requireVerifiedEmail = authenticate({ 
  required: true, 
  requireEmailVerification: true 
});

/**
 * MFA requirement middleware
 */
export const requireMfa = authenticate({ 
  required: true, 
  requireMfa: true 
});

/**
 * Service-to-service authentication middleware
 */
export function authenticateService() {
  return (req: Request, res: Response, next: NextFunction) => {
    const serviceKey = req.headers['x-service-key'] as string;
    const expectedKey = process.env.SERVICE_AUTH_KEY;

    if (!serviceKey || !expectedKey || serviceKey !== expectedKey) {
      return res.status(401).json({
        error: 'Service authentication required',
        code: 'AUTH_SERVICE_KEY_INVALID',
      });
    }

    next();
  };
}

/**
 * API key authentication middleware
 */
export function authenticateApiKey() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;

      if (!apiKey) {
        return res.status(401).json({
          error: 'API key required',
          code: 'AUTH_API_KEY_MISSING',
        });
      }

      const keyRecord = await prisma.apiKey.findFirst({
        where: {
          key: apiKey,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (!keyRecord) {
        return res.status(401).json({
          error: 'Invalid or expired API key',
          code: 'AUTH_API_KEY_INVALID',
        });
      }

      // Update last used timestamp
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      });

      // Attach API key info to request
      req.apiKey = {
        id: keyRecord.id,
        name: keyRecord.name,
        userId: keyRecord.userId,
        permissions: keyRecord.permissions as string[],
      };

      next();
    } catch (error) {
      console.error('API key authentication error:', error);
      res.status(500).json({
        error: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
      });
    }
  };
}

/**
 * Rate limiting by user ID
 */
export function rateLimitByUser(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    
    if (!userId) {
      return next(); // Skip rate limiting for unauthenticated requests
    }

    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        resetTime: new Date(userLimit.resetTime).toISOString(),
      });
    }

    userLimit.count++;
    next();
  };
}

/**
 * Extract token from request headers, cookies, or query params
 */
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  // Check query parameter (less secure, use with caution)
  if (req.query.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
}

/**
 * Middleware to log authentication events
 */
export function auditAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log authentication events
      if (req.user) {
        console.log(`Auth Success: ${req.user.email} - ${req.method} ${req.path}`);
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        console.log(`Auth Failed: ${req.ip} - ${req.method} ${req.path} - ${res.statusCode}`);
      }
      
      return originalSend.call(this, data);
    };

    next();
  };
}

// Extend Express Request interface for API keys
declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        id: string;
        name: string;
        userId: string;
        permissions: string[];
      };
    }
  }
}
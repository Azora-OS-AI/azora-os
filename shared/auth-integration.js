/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * Universal Authentication Integration for Azora OS Services
 * 
 * This module provides a standardized way to integrate authentication
 * across all Azora OS services with minimal configuration.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// Configuration
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SERVICE_NAME = process.env.SERVICE_NAME || 'unknown-service';

// Prisma client for auth database (optional - services can use their own DB)
let authPrisma = null;
try {
  authPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL
      }
    }
  });
} catch (error) {
  console.warn('Auth database not available, using remote auth service only');
}

/**
 * Express middleware factory for authentication
 * @param {Object} options - Authentication options
 * @param {boolean} options.required - Whether authentication is required
 * @param {string[]} options.roles - Required roles
 * @param {boolean} options.requireEmailVerification - Require verified email
 * @param {boolean} options.requireMfa - Require MFA
 * @returns {Function} Express middleware
 */
function createAuthMiddleware(options = {}) {
  const {
    required = true,
    roles = [],
    requireEmailVerification = false,
    requireMfa = false
  } = options;

  return async (req, res, next) => {
    try {
      // Extract token
      const token = extractToken(req);
      
      if (!token) {
        if (!required) {
          return next();
        }
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_TOKEN_MISSING',
          service: SERVICE_NAME
        });
      }

      // Verify JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token expired',
            code: 'AUTH_TOKEN_EXPIRED',
            service: SERVICE_NAME
          });
        }
        return res.status(401).json({
          error: 'Invalid token',
          code: 'AUTH_TOKEN_INVALID',
          service: SERVICE_NAME
        });
      }

      // Get user info (try local DB first, then remote service)
      let user = null;
      let session = null;

      if (authPrisma) {
        try {
          session = await authPrisma.session.findFirst({
            where: {
              token,
              expiresAt: { gt: new Date() }
            },
            include: {
              user: true
            }
          });
          
          if (session && session.user) {
            user = session.user;
          }
        } catch (dbError) {
          console.warn('Local auth DB query failed, falling back to remote service');
        }
      }

      // Fallback to remote auth service
      if (!user) {
        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Service-Name': SERVICE_NAME
            }
          });

          if (!response.ok) {
            throw new Error(`Auth service responded with ${response.status}`);
          }

          const authData = await response.json();
          user = authData.user;
        } catch (fetchError) {
          console.error('Remote auth service unavailable:', fetchError.message);
          return res.status(503).json({
            error: 'Authentication service unavailable',
            code: 'AUTH_SERVICE_UNAVAILABLE',
            service: SERVICE_NAME
          });
        }
      }

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'AUTH_USER_NOT_FOUND',
          service: SERVICE_NAME
        });
      }

      // Check email verification
      if (requireEmailVerification && !user.isEmailVerified) {
        return res.status(403).json({
          error: 'Email verification required',
          code: 'AUTH_EMAIL_NOT_VERIFIED',
          service: SERVICE_NAME
        });
      }

      // Check MFA requirement
      if (requireMfa && !user.isMfaEnabled) {
        return res.status(403).json({
          error: 'Multi-factor authentication required',
          code: 'AUTH_MFA_REQUIRED',
          service: SERVICE_NAME
        });
      }

      // Check role-based access
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'AUTH_INSUFFICIENT_ROLE',
          required: roles,
          current: user.role,
          service: SERVICE_NAME
        });
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        isMfaEnabled: user.isMfaEnabled
      };

      if (session) {
        req.session = {
          id: session.id,
          token: session.token,
          expiresAt: session.expiresAt
        };
      }

      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(500).json({
        error: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
        service: SERVICE_NAME
      });
    }
  };
}

/**
 * Extract token from request
 */
function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  // Check query parameter (less secure)
  if (req.query.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
}

/**
 * Convenience middleware functions
 */
const requireAuth = createAuthMiddleware({ required: true });
const optionalAuth = createAuthMiddleware({ required: false });

const requireRole = (...roles) => createAuthMiddleware({ 
  required: true, 
  roles 
});

const requireAdmin = requireRole('admin', 'super_admin');

const requireVerifiedEmail = createAuthMiddleware({ 
  required: true, 
  requireEmailVerification: true 
});

const requireMfa = createAuthMiddleware({ 
  required: true, 
  requireMfa: true 
});

/**
 * Service-to-service authentication
 */
function requireServiceAuth() {
  return (req, res, next) => {
    const serviceKey = req.headers['x-service-key'];
    const expectedKey = process.env.SERVICE_AUTH_KEY;

    if (!serviceKey || !expectedKey || serviceKey !== expectedKey) {
      return res.status(401).json({
        error: 'Service authentication required',
        code: 'AUTH_SERVICE_KEY_INVALID',
        service: SERVICE_NAME
      });
    }

    next();
  };
}

/**
 * Initialize authentication for a service
 * @param {Object} app - Express app instance
 * @param {Object} options - Configuration options
 */
function initializeAuth(app, options = {}) {
  const {
    enableCors = true,
    enableCookieParser = true,
    enableRateLimit = true,
    corsOrigins = ['http://localhost:3000'],
    rateLimitMax = 1000,
    rateLimitWindowMs = 15 * 60 * 1000
  } = options;

  // Enable CORS if requested
  if (enableCors) {
    const cors = require('cors');
    app.use(cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Service-Key']
    }));
  }

  // Enable cookie parser if requested
  if (enableCookieParser) {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
  }

  // Enable rate limiting if requested
  if (enableRateLimit) {
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      message: { 
        error: 'Too many requests from this IP', 
        service: SERVICE_NAME 
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    app.use(limiter);
  }

  console.log(`🔐 Authentication initialized for ${SERVICE_NAME}`);
}

/**
 * Health check endpoint that includes auth service status
 */
function createAuthHealthCheck() {
  return async (req, res) => {
    const health = {
      service: SERVICE_NAME,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      auth: {
        localDb: 'unknown',
        remoteService: 'unknown'
      }
    };

    // Check local auth DB
    if (authPrisma) {
      try {
        await authPrisma.$queryRaw`SELECT 1`;
        health.auth.localDb = 'connected';
      } catch (error) {
        health.auth.localDb = 'disconnected';
      }
    } else {
      health.auth.localDb = 'not_configured';
    }

    // Check remote auth service
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/health`, {
        timeout: 5000
      });
      health.auth.remoteService = response.ok ? 'connected' : 'error';
    } catch (error) {
      health.auth.remoteService = 'disconnected';
    }

    // Determine overall status
    if (health.auth.localDb === 'disconnected' && health.auth.remoteService === 'disconnected') {
      health.status = 'unhealthy';
      res.status(503);
    }

    res.json(health);
  };
}

/**
 * User info endpoint for authenticated users
 */
function createUserInfoEndpoint() {
  return [requireAuth, (req, res) => {
    res.json({
      user: req.user,
      service: SERVICE_NAME,
      timestamp: new Date().toISOString()
    });
  }];
}

module.exports = {
  // Middleware functions
  createAuthMiddleware,
  requireAuth,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireVerifiedEmail,
  requireMfa,
  requireServiceAuth,
  
  // Utility functions
  initializeAuth,
  createAuthHealthCheck,
  createUserInfoEndpoint,
  extractToken,
  
  // Constants
  AUTH_SERVICE_URL,
  SERVICE_NAME
};
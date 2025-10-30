/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { AuthService, AuditService } from './authService.js';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('lastName').optional().isLength({ min: 1, max: 50 }).trim(),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('mfaToken').optional().isLength({ min: 6, max: 6 }).isNumeric(),
];

const validatePasswordReset = [
  body('email').isEmail().normalizeEmail(),
];

const validatePasswordResetConfirm = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
];

// Helper function to get client IP
const getClientIP = (req: express.Request): string => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
};

// Helper function to handle validation errors
const handleValidationErrors = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  return null;
};

// POST /api/auth/register
router.post('/register', generalLimiter, validateRegistration, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { email, password, firstName, lastName, role } = req.body;
    const ipAddress = getClientIP(req);
    
    const user = await AuthService.createUser(email, password, firstName, lastName, role);
    
    await AuditService.log('USER_REGISTRATION_ATTEMPT', { email, success: true }, user.id, ipAddress);
    
    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error: any) {
    const ipAddress = getClientIP(req);
    await AuditService.log('USER_REGISTRATION_ATTEMPT', { 
      email: req.body.email, 
      success: false, 
      error: error.message 
    }, undefined, ipAddress);
    
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { email, password, mfaToken } = req.body;
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const result = await AuthService.authenticateUser(email, password, mfaToken, ipAddress);
    
    // Set secure HTTP-only cookies for tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 15 * 60 * 1000, // 15 minutes for access token
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    };

    if (result.requiresMfa) {
      res.json({
        requiresMfa: true,
        mfaToken: result.mfaToken,
        message: 'Please provide your MFA token to complete login',
      });
    } else {
      res.cookie('accessToken', result.token, cookieOptions);
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
      
      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token, // Also return in body for API clients
        refreshToken: result.refreshToken,
      });
    }
  } catch (error: any) {
    const ipAddress = getClientIP(req);
    await AuditService.log('LOGIN_ATTEMPT', { 
      email: req.body.email, 
      success: false, 
      error: error.message 
    }, undefined, ipAddress);
    
    res.status(401).json({ error: error.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', generalLimiter, async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const ipAddress = getClientIP(req);
    const result = await AuthService.refreshToken(refreshToken, ipAddress);
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 15 * 60 * 1000,
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('accessToken', result.token, cookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    
    res.json({
      message: 'Token refreshed successfully',
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', generalLimiter, async (req, res) => {
  try {
    const token = req.body.token || req.cookies.accessToken;
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    const ipAddress = getClientIP(req);
    
    if (token) {
      await AuthService.invalidateSession(token);
    }
    if (refreshToken) {
      await AuthService.invalidateSession(refreshToken);
    }
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    await AuditService.log('USER_LOGOUT', { ipAddress }, undefined, ipAddress);
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', generalLimiter, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token required' });
    }

    const user = await AuthService.verifyEmail(token);
    res.json({
      message: 'Email verified successfully',
      user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, validatePasswordReset, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { email } = req.body;
    const result = await AuthService.requestPasswordReset(email);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, validatePasswordResetConfirm, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword(token, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// MFA endpoints (require authentication)
const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token (simplified - in production, use proper JWT verification)
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/auth/setup-mfa
router.post('/setup-mfa', generalLimiter, requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await AuthService.setupMfa(userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/enable-mfa
router.post('/enable-mfa', generalLimiter, requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'MFA token required' });
    }

    const result = await AuthService.enableMfa(userId, token);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', generalLimiter, requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    await AuthService.invalidateAllSessions(userId);
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    res.json({ message: 'All sessions invalidated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to logout from all sessions' });
  }
});

// GET /api/auth/me
router.get('/me', generalLimiter, requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    // In a real implementation, fetch user from database
    res.json({ userId, message: 'User authenticated' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

export default router;
/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  user: UserProfile;
  token: string;
  refreshToken: string;
  requiresMfa?: boolean;
  mfaToken?: string;
}

export class AuditService {
  static async log(eventType: string, details: any, userId?: string, ipAddress?: string) {
    await prisma.auditLog.create({
      data: {
        eventType,
        details: {
          ...details,
          ipAddress,
          timestamp: new Date().toISOString(),
        },
        userId,
      },
    });
  }
}

export class AuthService {
  // Enhanced user creation with validation and email verification
  static async createUser(
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string,
    role: string = 'user'
  ): Promise<UserProfile> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        emailVerificationToken,
        isEmailVerified: false,
      },
    });

    // Send verification email
    await this.sendVerificationEmail(email, emailVerificationToken);
    
    await AuditService.log('USER_CREATED', { email, role }, user.id);
    
    return this.sanitizeUser(user);
  }

  // Enhanced authentication with MFA support
  static async authenticateUser(
    email: string, 
    password: string, 
    mfaToken?: string,
    ipAddress?: string
  ): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await AuditService.log('LOGIN_FAILED', { email, reason: 'invalid_credentials' }, undefined, ipAddress);
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Check if MFA is enabled
    if (user.mfaSecret && user.isMfaEnabled) {
      if (!mfaToken) {
        // Generate temporary MFA token for the second step
        const tempMfaToken = jwt.sign(
          { userId: user.id, step: 'mfa' }, 
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '5m' }
        );
        
        return {
          user: this.sanitizeUser(user),
          token: '',
          refreshToken: '',
          requiresMfa: true,
          mfaToken: tempMfaToken,
        };
      }

      // Verify MFA token
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2,
      });

      if (!verified) {
        await AuditService.log('LOGIN_FAILED', { email, reason: 'invalid_mfa' }, user.id, ipAddress);
        throw new Error('Invalid MFA token');
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const session = await this.createSession(user.id, ipAddress);
    await AuditService.log('USER_LOGIN', { email }, user.id, ipAddress);

    return {
      user: this.sanitizeUser(user),
      token: session.token,
      refreshToken: session.refreshToken,
    };
  }

  // Enhanced session creation with refresh tokens
  static async createSession(userId: string, ipAddress?: string) {
    const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const accessToken = jwt.sign(
      { userId, type: 'access' }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const session = await prisma.session.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        expiresAt: accessTokenExpiry,
        refreshExpiresAt: refreshTokenExpiry,
        ipAddress,
      },
    });

    await AuditService.log('SESSION_CREATED', { ipAddress }, userId);
    return session;
  }

  // Refresh access token
  static async refreshToken(refreshToken: string, ipAddress?: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret') as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const session = await prisma.session.findFirst({
        where: {
          refreshToken,
          refreshExpiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session) {
        throw new Error('Invalid or expired refresh token');
      }

      // Create new session
      const newSession = await this.createSession(session.userId, ipAddress);
      
      // Invalidate old session
      await prisma.session.delete({ where: { id: session.id } });

      return {
        token: newSession.token,
        refreshToken: newSession.refreshToken,
        user: this.sanitizeUser(session.user),
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Email verification
  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    await AuditService.log('EMAIL_VERIFIED', { email: user.email }, user.id);
    return this.sanitizeUser(user);
  }

  // Password reset
  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    await this.sendPasswordResetEmail(email, resetToken);
    await AuditService.log('PASSWORD_RESET_REQUESTED', { email }, user.id);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: user.id } });

    await AuditService.log('PASSWORD_RESET', { email: user.email }, user.id);
    return { message: 'Password reset successfully' };
  }

  // MFA setup
  static async setupMfa(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `Azora OS (${user.email})`,
      issuer: 'Azora OS',
    });

    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    };
  }

  static async enableMfa(userId: string, token: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      throw new Error('MFA not set up');
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new Error('Invalid MFA token');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: true },
    });

    await AuditService.log('MFA_ENABLED', {}, userId);
    return { message: 'MFA enabled successfully' };
  }

  // Session management
  static async invalidateSession(token: string, userId?: string) {
    await prisma.session.deleteMany({
      where: {
        OR: [
          { token },
          { refreshToken: token },
        ],
        ...(userId && { userId }),
      },
    });

    await AuditService.log('SESSION_INVALIDATED', { token: token.substring(0, 10) + '...' }, userId);
  }

  static async invalidateAllSessions(userId: string) {
    await prisma.session.deleteMany({ where: { userId } });
    await AuditService.log('ALL_SESSIONS_INVALIDATED', {}, userId);
  }

  // Utility methods
  private static sanitizeUser(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      isMfaEnabled: user.isMfaEnabled || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@azora.com',
      to: email,
      subject: 'Verify Your Azora OS Account',
      html: `
        <h2>Welcome to Azora OS!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw error to prevent user creation failure
    }
  }

  private static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@azora.com',
      to: email,
      subject: 'Reset Your Azora OS Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }
}
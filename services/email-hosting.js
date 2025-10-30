/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

/**
 * Email Hosting Service
 * Professional email infrastructure for @azora.africa domains
 * Aligns with Constitution Article VI: Infrastructure Independence
 */

import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

class EmailHostingService {
  constructor() {
    this.config = this.loadConfig();
    this.transporter = this.createTransporter();
  }

  /**
   * Load email configuration
   */
  loadConfig() {
    const configPath = join(process.cwd(), 'config', 'email-config.json');
    if (existsSync(configPath)) {
      return JSON.parse(readFileSync(configPath, 'utf8'));
    }
    
    // Default configuration for Zoho Mail
    return {
      service: 'Zoho',
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'admin@azora.africa',
        pass: process.env.EMAIL_PASS || ''
      }
    };
  }

  /**
   * Create email transporter
   */
  createTransporter() {
    return createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass
      }
    });
  }

  /**
   * Send email
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: this.config.auth.user,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConfiguration() {
    try {
      await this.transporter.verify();
      console.log('Email configuration verified successfully');
      return { success: true };
    } catch (error) {
      console.error('Email configuration verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create email account
   */
  async createAccount(username, password) {
    // This would integrate with Zoho Mail or similar service API
    console.log(`Creating email account: ${username}@azora.africa`);
    
    // In a real implementation, this would call the email provider's API
    return {
      success: true,
      email: `${username}@azora.africa`,
      instructions: 'Account created. Please configure your email client with the following settings.'
    };
  }

  /**
   * Get email client configuration
   */
  getEmailClientConfig() {
    return {
      incoming: {
        server: 'imap.zoho.com',
        port: 993,
        encryption: 'SSL/TLS'
      },
      outgoing: {
        server: 'smtp.zoho.com',
        port: 587,
        encryption: 'STARTTLS'
      },
      username: 'your-email@azora.africa',
      password: 'your-password'
    };
  }
}

// Create singleton instance
const emailHostingService = new EmailHostingService();

// Verify configuration on startup
emailHostingService.verifyConfiguration();

export default emailHostingService;
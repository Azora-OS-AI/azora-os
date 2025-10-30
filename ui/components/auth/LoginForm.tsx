/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, onSwitchToRegister, className = '' }: LoginFormProps) {
  const { login, isLoading, error, requiresMfa, mfaToken, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaToken: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Clear error when component mounts or form data changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
        mfaToken: formData.mfaToken || undefined,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const isFormValid = formData.email && formData.password && (!requiresMfa || formData.mfaToken);

  return (
    <div className={`auth-form login-form ${className}`}>
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your Azora OS account</p>
      </div>

      {error && (
        <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form-content">
        {!requiresMfa ? (
          <>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              
              <button
                type="button"
                className="link-button"
                onClick={() => {/* TODO: Implement forgot password modal */}}
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <div className="mfa-section">
            <div className="mfa-info">
              <h3>Two-Factor Authentication</h3>
              <p>Please enter the 6-digit code from your authenticator app</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="mfaToken">Authentication Code</label>
              <input
                type="text"
                id="mfaToken"
                name="mfaToken"
                value={formData.mfaToken}
                onChange={handleInputChange}
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                autoComplete="one-time-code"
                className="form-input mfa-input"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="btn btn-primary btn-full-width"
        >
          {isLoading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              Signing in...
            </span>
          ) : requiresMfa ? (
            'Verify & Sign In'
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToRegister}
          >
            Sign up
          </button>
        </p>
      </div>

      <style jsx>{`
        .auth-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .auth-header p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .alert-error {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background-color: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: #6b7280;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #374151;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkbox-custom {
          width: 16px;
          height: 16px;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          margin-right: 0.5rem;
          position: relative;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          color: white;
          font-size: 12px;
        }

        .link-button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .link-button:hover {
          color: #2563eb;
        }

        .mfa-section {
          text-align: center;
        }

        .mfa-info {
          margin-bottom: 2rem;
        }

        .mfa-info h3 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
          font-size: 1.25rem;
        }

        .mfa-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .mfa-input {
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.5rem;
          font-weight: 600;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-full-width {
          width: 100%;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .auth-footer p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
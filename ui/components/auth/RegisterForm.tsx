/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export function RegisterForm({ onSuccess, onSwitchToLogin, className = '' }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Clear error when component mounts or form data changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validate email
    errors.email = validateEmail(formData.email);

    // Validate password
    errors.password = validatePassword(formData.password);

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate names (optional but if provided, should be valid)
    if (formData.firstName && formData.firstName.trim().length < 1) {
      errors.firstName = 'First name cannot be empty';
    }
    if (formData.lastName && formData.lastName.trim().length < 1) {
      errors.lastName = 'Last name cannot be empty';
    }

    setFormErrors(errors);
    return Object.keys(errors).every(key => !errors[key as keyof FormErrors]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !acceptTerms) {
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const isFormValid = 
    formData.email && 
    formData.password && 
    formData.confirmPassword && 
    acceptTerms &&
    Object.keys(formErrors).every(key => !formErrors[key as keyof FormErrors]);

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[Math.min(strength, 4)],
      color: colors[Math.min(strength, 4)],
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={`auth-form register-form ${className}`}>
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join Azora OS and start your journey</p>
      </div>

      {error && (
        <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name (Optional)</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              autoComplete="given-name"
              className={`form-input ${formErrors.firstName ? 'error' : ''}`}
            />
            {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name (Optional)</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              autoComplete="family-name"
              className={`form-input ${formErrors.lastName ? 'error' : ''}`}
            />
            {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
            className={`form-input ${formErrors.email ? 'error' : ''}`}
          />
          {formErrors.email && <span className="error-message">{formErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              className={`form-input ${formErrors.password ? 'error' : ''}`}
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
          {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${passwordStrength.strength}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
              </div>
              <span className="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <span className="checkbox-custom"></span>
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="btn btn-primary btn-full-width"
        >
          {isLoading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>

      <style jsx>{`
        .auth-form {
          max-width: 500px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .form-input.error {
          border-color: #dc2626;
        }

        .form-input.error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .error-message {
          display: block;
          margin-top: 0.25rem;
          color: #dc2626;
          font-size: 0.8rem;
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

        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-bar {
          width: 100%;
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-label {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          font-size: 0.9rem;
          color: #374151;
          line-height: 1.4;
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
          margin-top: 0.1rem;
          position: relative;
          flex-shrink: 0;
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

        .link {
          color: #3b82f6;
          text-decoration: underline;
        }

        .link:hover {
          color: #2563eb;
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

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .auth-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
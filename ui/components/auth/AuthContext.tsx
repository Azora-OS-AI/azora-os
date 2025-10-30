/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  requiresMfa: boolean;
  mfaToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mfaToken?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'AUTH_MFA_REQUIRED'; payload: { mfaToken: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH_SUCCESS'; payload: { token: string; refreshToken: string } }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  requiresMfa: false,
  mfaToken: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        requiresMfa: false,
        mfaToken: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
        requiresMfa: false,
        mfaToken: null,
      };

    case 'AUTH_MFA_REQUIRED':
      return {
        ...state,
        isLoading: false,
        requiresMfa: true,
        mfaToken: action.payload.mfaToken,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        requiresMfa: false,
        mfaToken: null,
      };

    case 'AUTH_LOGOUT':
      return {
        ...initialState,
      };

    case 'AUTH_REFRESH_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    // Add authorization header if token exists
    if (state.token && !config.headers?.['Authorization']) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${state.token}`,
      };
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.requiresMfa) {
        dispatch({ 
          type: 'AUTH_MFA_REQUIRED', 
          payload: { mfaToken: data.mfaToken } 
        });
      } else {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
          },
        });

        // Store tokens in localStorage as backup
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Registration successful - user needs to verify email
      dispatch({ type: 'AUTH_ERROR', payload: 'Registration successful! Please check your email to verify your account.' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiCall('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({
          token: state.token,
          refreshToken: state.refreshToken,
        }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh authentication
  const refreshAuth = async () => {
    try {
      const refreshToken = state.refreshToken || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const data = await apiCall('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      dispatch({
        type: 'AUTH_REFRESH_SUCCESS',
        payload: {
          token: data.token,
          refreshToken: data.refreshToken,
        },
      });

      // Update localStorage
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      await apiCall('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      await apiCall('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      await apiCall('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        try {
          // Verify token by calling /me endpoint
          const data = await apiCall('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          // If successful, set auth state
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: data.user,
              token,
              refreshToken,
            },
          });
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            await refreshAuth();
          } catch (refreshError) {
            // Refresh failed, clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!state.token) return;

    // Refresh token every 10 minutes (tokens expire in 15 minutes)
    const interval = setInterval(() => {
      refreshAuth();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.token]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} />;
  };
}

// Hook for role-based access
export function useRequireRole(requiredRoles: string[]) {
  const { user, isAuthenticated } = useAuth();

  const hasRole = isAuthenticated && user && requiredRoles.includes(user.role);

  return {
    hasRole,
    user,
    isAuthenticated,
  };
}
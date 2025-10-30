/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

// Jest setup file for authentication tests

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test configuration
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-azora-os-auth-tests';
process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
process.env.NEXUS_SERVICE_URL = process.env.NEXUS_SERVICE_URL || 'http://localhost:3006';

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = (...args) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleLog(...args);
    }
  };
  
  console.error = (...args) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleError(...args);
    }
  };
  
  console.warn = (...args) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleWarn(...args);
    }
  };
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Helper to wait for a condition
global.waitFor = async (condition, timeout = 10000, interval = 100) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
};

// Helper to retry async operations
global.retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * Comprehensive Authentication Integration Tests
 * 
 * Tests the unified authentication system across all Azora OS services
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Test configuration
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const NEXUS_SERVICE_URL = process.env.NEXUS_SERVICE_URL || 'http://localhost:3006';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Test user data
const testUser = {
  email: 'test@azora-os.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

let authToken = null;
let refreshToken = null;
let userId = null;

describe('Azora OS Authentication Integration', () => {
  
  describe('Auth Service Tests', () => {
    
    test('Health check should work', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('auth');
      expect(response.body.database).toBe('connected');
    });

    test('User registration should work', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(response.body.message).toContain('Registration successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      
      userId = response.body.user.id;
    });

    test('User login should work', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      
      authToken = response.body.token;
      refreshToken = response.body.refreshToken;
    });

    test('Token should be valid JWT', () => {
      const decoded = jwt.verify(authToken, JWT_SECRET);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.type).toBe('access');
    });

    test('Protected endpoint should require authentication', async () => {
      await request(AUTH_SERVICE_URL)
        .get('/api/auth/me')
        .expect(401);
    });

    test('Protected endpoint should work with valid token', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.id).toBe(userId);
    });

  });

  describe('Service Integration Tests', () => {
    
    test('Nexus service health check should include auth status', async () => {
      const response = await request(NEXUS_SERVICE_URL)
        .get('/health')
        .expect(200);
      
      expect(response.body.service).toBe('azora-nexus');
      expect(response.body.auth).toBeDefined();
      expect(response.body.auth.remoteService).toBeDefined();
    });

    test('Nexus service should reject unauthenticated requests', async () => {
      await request(NEXUS_SERVICE_URL)
        .post('/api/agent/interact')
        .send({ message: 'Hello' })
        .expect(401);
    });

    test('Nexus service should accept authenticated requests', async () => {
      const response = await request(NEXUS_SERVICE_URL)
        .post('/api/agent/interact')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          message: 'Hello, test the agent interaction',
          context: { test: true }
        })
        .expect(200);
      
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.email).toBe(testUser.email);
    });

    test('Nexus user info endpoint should work', async () => {
      const response = await request(NEXUS_SERVICE_URL)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.service).toBe('azora-nexus');
    });

    test('Nexus agent status should work with optional auth', async () => {
      // Test without auth
      const response1 = await request(NEXUS_SERVICE_URL)
        .get('/api/agent/status')
        .expect(200);
      
      expect(response1.body.service).toBe('azora-nexus');
      expect(response1.body.user).toBeNull();

      // Test with auth
      const response2 = await request(NEXUS_SERVICE_URL)
        .get('/api/agent/status')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response2.body.service).toBe('azora-nexus');
      expect(response2.body.user).toBeDefined();
      expect(response2.body.user.email).toBe(testUser.email);
    });

  });

  describe('Token Management Tests', () => {
    
    test('Token refresh should work', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);
      
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.token).not.toBe(authToken); // Should be new token
      
      // Update tokens for subsequent tests
      authToken = response.body.token;
      refreshToken = response.body.refreshToken;
    });

    test('Invalid token should be rejected', async () => {
      await request(NEXUS_SERVICE_URL)
        .post('/api/agent/interact')
        .set('Authorization', 'Bearer invalid-token')
        .send({ message: 'Hello' })
        .expect(401);
    });

    test('Expired token should be rejected', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId, email: testUser.email, type: 'access' },
        JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      await request(NEXUS_SERVICE_URL)
        .post('/api/agent/interact')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ message: 'Hello' })
        .expect(401);
    });

  });

  describe('Security Tests', () => {
    
    test('Rate limiting should work', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(AUTH_SERVICE_URL)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@test.com', password: 'wrong' })
        );
      }

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    });

    test('CORS headers should be present', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .options('/api/auth/login')
        .expect(204);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });

    test('Security headers should be present', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .get('/health')
        .expect(200);
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });

  });

  describe('Error Handling Tests', () => {
    
    test('Invalid email format should be rejected', async () => {
      await request(AUTH_SERVICE_URL)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'ValidPassword123!'
        })
        .expect(400);
    });

    test('Weak password should be rejected', async () => {
      await request(AUTH_SERVICE_URL)
        .post('/api/auth/register')
        .send({
          email: 'test2@azora-os.com',
          password: '123'
        })
        .expect(400);
    });

    test('Duplicate email should be rejected', async () => {
      await request(AUTH_SERVICE_URL)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    test('Wrong password should be rejected', async () => {
      await request(AUTH_SERVICE_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);
    });

  });

  describe('Cleanup Tests', () => {
    
    test('User logout should work', async () => {
      const response = await request(AUTH_SERVICE_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          token: authToken,
          refreshToken: refreshToken
        })
        .expect(200);
      
      expect(response.body.message).toContain('Logged out successfully');
    });

    test('Logged out token should be invalid', async () => {
      await request(NEXUS_SERVICE_URL)
        .post('/api/agent/interact')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Hello' })
        .expect(401);
    });

  });

});

// Helper function to wait for services to be ready
async function waitForServices() {
  const maxRetries = 30;
  const retryDelay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await request(AUTH_SERVICE_URL).get('/health');
      await request(NEXUS_SERVICE_URL).get('/health');
      console.log('✅ All services are ready');
      return;
    } catch (error) {
      console.log(`⏳ Waiting for services... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw new Error('Services did not become ready in time');
}

// Setup and teardown
beforeAll(async () => {
  console.log('🚀 Starting authentication integration tests...');
  await waitForServices();
}, 60000);

afterAll(async () => {
  console.log('🧹 Cleaning up test data...');
  // Additional cleanup if needed
});

module.exports = {
  testUser,
  AUTH_SERVICE_URL,
  NEXUS_SERVICE_URL
};
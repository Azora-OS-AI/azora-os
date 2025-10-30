/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from '@/config/database';
import { setupSwagger } from '@/config/swagger';
import { errorHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';
import { metricsMiddleware } from '@/middleware/metrics';
import recommendationRoutes from '@/routes/recommendations';
import neuralRoutes from '@/routes/neural';
import insightRoutes from '@/routes/insights';
import analysisRoutes from '@/routes/analysis';
import { logger } from '@/utils/logger';
import { startMetricsServer } from '@/utils/metrics';

// Import unified authentication system
import { 
  initializeAuth, 
  requireAuth, 
  optionalAuth, 
  requireRole,
  createAuthHealthCheck,
  createUserInfoEndpoint 
} from '../../../shared/auth-integration.js';

// Import new agent components
import { azoraNexusAgent } from '@genome/agent-tools';

const app = express();
const PORT = process.env.PORT || 3006;

// Set service name for authentication
process.env.SERVICE_NAME = 'azora-nexus';

// Connect to MongoDB
connectDB();

// Initialize unified authentication system
initializeAuth(app, {
  corsOrigins: [
    'http://localhost:3000',
    'https://azora-os.com',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  rateLimitMax: 500, // Higher limit for AI service
  rateLimitWindowMs: 15 * 60 * 1000
});

// Initialize agent tools and systems
// initializeTools();

// Initialize the Azora Nexus Agent
azoraNexusAgent.initialize().catch(error => {
  logger.error('Failed to initialize Azora Nexus Agent', { error: error.message });
});

// Additional security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression
app.use(compression());

// Logging and metrics
app.use(requestLogger);
app.use(metricsMiddleware);

// Enhanced health check endpoint with auth status
app.get('/health', createAuthHealthCheck());

// User info endpoint for authenticated users
app.get('/api/user/me', ...createUserInfoEndpoint());

// Agent status endpoint (public for monitoring)
app.get('/api/agent/status', optionalAuth, (req, res) => {
  const status = azoraNexusAgent.getStatus();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'azora-nexus',
    version: '1.0.0',
    agent: {
      status: status.agentState.status,
      tasksCompleted: status.metrics.tasksCompleted,
      activeUsers: status.activeUsers,
      totalProfiles: status.totalProfiles,
    },
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null
  });
});

// Agent-specific endpoints (require authentication)
app.post('/api/agent/interact', requireAuth, async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    // Process user input through the agent using authenticated user ID
    const result = await azoraNexusAgent.processUserInput(
      message,
      req.user.id, // Use authenticated user ID
      undefined,
      {
        ...context,
        userEmail: req.user.email,
        userRole: req.user.role
      }
    );

    res.json({
      ...result,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });

  } catch (error: any) {
    logger.error('Agent interaction error', { 
      error: error.message, 
      userId: req.user?.id,
      userEmail: req.user?.email 
    });
    res.status(500).json({ error: 'Agent interaction failed' });
  }
});

app.post('/api/agent/task', requireAuth, async (req, res) => {
  try {
    const { capability, parameters, sessionId } = req.body;

    // Execute capability directly using authenticated user
    const result = await azoraNexusAgent.executeCapability(
      capability,
      parameters,
      req.user.id, // Use authenticated user ID
      sessionId || `session-${Date.now()}-${req.user.id}`
    );

    res.json({
      status: 'executed',
      result,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });

  } catch (error: any) {
    logger.error('Capability execution error', { 
      error: error.message,
      userId: req.user?.id,
      capability 
    });
    res.status(500).json({ error: 'Capability execution failed' });
  }
});

// API routes with authentication
app.use('/api/recommendations', requireAuth, recommendationRoutes);
app.use('/api/neural', requireAuth, neuralRoutes);
app.use('/api/insights', requireAuth, insightRoutes);
app.use('/api/analysis', requireAuth, analysisRoutes);

// Swagger documentation
setupSwagger(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start metrics server
startMetricsServer();

// Start autonomous agent
azoraNexusAgent.start().catch(error => {
  logger.error('Failed to start Azora Nexus Agent', { error: error.message });
});

app.listen(PORT, () => {
  logger.info(`Azora Nexus Autonomous Agent running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`Agent interaction available at http://localhost:${PORT}/api/agent/interact`);
  logger.info(`API documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
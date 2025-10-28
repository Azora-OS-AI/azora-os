/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import express from 'express';

const app = express();
const PORT = process.env.PORT || 12345;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'azora-forge',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Azora Forge service running on port ${PORT}`);
});
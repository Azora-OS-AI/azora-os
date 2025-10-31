/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

const express = require('express');
const pricingConfig = require('./pricingConfig');
const app = express();
app.use(express.json());

/**
 * Advanced Revenue Service.
 * Tracks subscriptions, transactions, and projections.
 * Now tracks revenue by currency and subscription tiers.
 */
let totalRevenue = 250000;
let sources = { subscriptions: 150000, transactions: 100000 };
let revenueByCurrency = { ZAR: 250000, USD: 0, EUR: 0, GBP: 0 };
let revenueByTier = { student: 0, starter: 0, professional: 0, enterprise: 0 };

app.post('/api/revenue/add', (req, res) => {
  const { amount, source = 'transactions', currency = 'ZAR', tier } = req.body;
  const amountNum = Number(amount);

  totalRevenue += amountNum;
  sources[source] = (sources[source] || 0) + amountNum;

  // Track by currency
  revenueByCurrency[currency] = (revenueByCurrency[currency] || 0) + amountNum;

  // Track by tier if provided
  if (tier) {
    revenueByTier[tier] = (revenueByTier[tier] || 0) + amountNum;
  }

  res.json({
    totalRevenue,
    sources,
    byCurrency: revenueByCurrency,
    byTier: revenueByTier
  });
});

/**
 * Add subscription revenue
 * POST /api/revenue/subscription
 */
app.post('/api/revenue/subscription', (req, res) => {
  const { amount, currency, tier, countryCode } = req.body;

  // Convert to ZAR for base tracking
  const currencyKey = currency || pricingConfig.getCurrencyForCountry(countryCode);
  const exchangeRate = pricingConfig.EXCHANGE_RATES[currencyKey] || 1;
  const amountZAR = currencyKey === 'ZAR' ? Number(amount) : Number(amount) / exchangeRate;

  totalRevenue += amountZAR;
  sources.subscriptions = (sources.subscriptions || 0) + amountZAR;
  revenueByCurrency[currencyKey] = (revenueByCurrency[currencyKey] || 0) + Number(amount);

  if (tier) {
    revenueByTier[tier] = (revenueByTier[tier] || 0) + amountZAR;
  }

  res.json({
    success: true,
    totalRevenue,
    sources,
    byCurrency: revenueByCurrency,
    byTier: revenueByTier
  });
});

app.get('/api/revenue/total', (req, res) => {
  res.json({
    totalRevenue,
    sources,
    byCurrency: revenueByCurrency,
    byTier: revenueByTier
  });
});

app.get('/api/revenue/projection', (req, res) => {
  const projection = totalRevenue * 1.2; // 20% growth
  res.json({ projectedRevenue: projection });
});

const PORT = 4126;
app.listen(PORT, () => console.log(`💵 Advanced Revenue Service running on port ${PORT}`));

/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

const express = require('express');
const pricingConfig = require('./pricingConfig');
const app = express();
app.use(express.json());

let subscriptions = {};
let studentVerifications = {}; // Store student verification status

/**
 * Detect country from request (IP geolocation or headers)
 * In production, use a proper geolocation service like MaxMind, ipapi.co, etc.
 */
const detectCountry = (req) => {
  // Check for explicit country code in headers (set by frontend geolocation)
  if (req.headers['x-country-code']) {
    return req.headers['x-country-code'].toUpperCase();
  }

  // Check for country in query params
  if (req.query.country) {
    return req.query.country.toUpperCase();
  }

  // Check for country in body
  if (req.body.countryCode) {
    return req.body.countryCode.toUpperCase();
  }

  // Default to US if not detected (can be changed)
  return 'US';
};

/**
 * Verify student status
 * In production, integrate with student verification service
 */
const verifyStudent = async (userId, studentId, email) => {
  // Check if student email domain (.edu, .ac.za, etc.)
  const studentDomains = ['.edu', '.ac.za', '.ac.uk', '.edu.au', '.ac.ke', '.edu.gh'];
  const isStudentEmail = studentDomains.some(domain => email && email.toLowerCase().includes(domain));

  // Store verification
  if (studentId || isStudentEmail) {
    studentVerifications[userId] = {
      verified: true,
      verifiedAt: new Date().toISOString(),
      studentId,
      email
    };
    return true;
  }

  return false;
};

/**
 * Subscribe to a platform tier with optional service add-ons
 * POST /api/subscription/subscribe
 * Body: { userId, tier, services: { ... } }
 */
app.post('/api/subscription/subscribe', async (req, res) => {
  const { userId, tier, services = {}, studentId, email, countryCode } = req.body;

  // Detect country if not provided
  const detectedCountry = countryCode || detectCountry(req);

  // Validate tier
  const validTiers = ['student', 'starter', 'professional', 'enterprise'];
  if (!validTiers.includes(tier)) {
    return res.status(400).json({
      error: 'Invalid tier',
      validTiers
    });
  }

  // Check if student tier requires verification
  let isStudent = tier === 'student';
  if (tier === 'student') {
    if (!studentId && !email) {
      return res.status(400).json({
        error: 'Student verification required',
        message: 'Please provide student ID or .edu email address'
      });
    }

    // Verify student status
    const verified = await verifyStudent(userId, studentId, email);
    if (!verified) {
      return res.status(400).json({
        error: 'Student verification failed',
        message: 'Please provide a valid student ID or .edu email address'
      });
    }
    isStudent = true;
  } else if (studentId || email) {
    // Check if user is a student applying for regular tier (gets student discount)
    isStudent = await verifyStudent(userId, studentId, email);
  }

  // Calculate total price
  const baseTier = pricingConfig.platformTiers.find(t => t.id === tier);
  if (!baseTier) {
    return res.status(400).json({ error: 'Tier not found' });
  }

  // Apply first year discount (25% off for first year)
  const applyFirstYearDiscount = true; // Always apply for new subscriptions
  const priceBreakdown = pricingConfig.calculatePriceWithBreakdown(
    tier,
    services,
    applyFirstYearDiscount,
    isStudent,
    detectedCountry
  );

  // Create subscription
  subscriptions[userId] = {
    tier,
    basePrice: baseTier.basePrice,
    totalPrice: priceBreakdown.finalPriceConverted,
    totalPriceZAR: priceBreakdown.finalPrice,
    baseTotalPrice: priceBreakdown.basePrice,
    baseTotalPriceConverted: priceBreakdown.basePriceConverted,
    discountAmount: priceBreakdown.discountAmountConverted,
    discountPercentage: priceBreakdown.discountPercentage,
    currency: priceBreakdown.currency,
    countryCode: detectedCountry,
    services,
    isStudent,
    active: true,
    createdAt: new Date().toISOString(),
    firstYearDiscount: true,
    firstYearDiscountEnds: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    trialDays: baseTier.trialDays,
    promoDiscount: baseTier.promoDiscount,
    promoMonths: baseTier.promoMonths,
    formatted: priceBreakdown.formatted
  };

  // Track revenue from subscription
  try {
    const revenueServiceUrl = process.env.REVENUE_SERVICE_URL || 'http://localhost:4126';
    await fetch(`${revenueServiceUrl}/api/revenue/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: priceBreakdown.finalPriceConverted,
        currency: priceBreakdown.currency,
        tier,
        countryCode: detectedCountry
      })
    });
  } catch (error) {
    console.error('Error tracking revenue:', error);
    // Don't fail subscription if revenue tracking fails
  }

  res.json({
    subscription: subscriptions[userId],
    message: `Successfully subscribed to ${baseTier.name}`,
    pricing: priceBreakdown
  });
});

/**
 * Get subscription status
 * GET /api/subscription/status/:userId
 */
app.get('/api/subscription/status/:userId', (req, res) => {
  const { userId } = req.params;
  const subscription = subscriptions[userId];

  if (!subscription) {
    return res.json({
      active: false,
      message: 'No active subscription found'
    });
  }

  res.json({ subscription });
});

/**
 * Get pricing information
 * GET /api/subscription/pricing
 */
app.get('/api/subscription/pricing', (req, res) => {
  res.json({
    platformTiers: pricingConfig.platformTiers,
    services: Object.keys(pricingConfig.servicePricing),
    message: 'Use /api/subscription/pricing/:service to get specific service pricing'
  });
});

/**
 * Get pricing for a specific service
 * GET /api/subscription/pricing/:service
 */
app.get('/api/subscription/pricing/:service', (req, res) => {
  const { service } = req.params;
  const pricing = pricingConfig.getServicePricing(service);

  if (!pricing) {
    return res.status(404).json({
      error: 'Service not found',
      availableServices: pricingConfig.getAllServices()
    });
  }

  res.json({ service, pricing });
});

/**
 * Calculate custom pricing
 * POST /api/subscription/calculate
 * Body: { tier, services: { ... } }
 */
app.post('/api/subscription/calculate', (req, res) => {
  const { tier, services = {}, countryCode, isStudent, applyFirstYearDiscount } = req.body;

  if (!tier) {
    return res.status(400).json({ error: 'Tier is required' });
  }

  // Detect country if not provided
  const detectedCountry = countryCode || detectCountry(req);
  const studentStatus = isStudent === true || isStudent === 'true';
  const applyDiscount = applyFirstYearDiscount !== false; // Default to true

  const priceBreakdown = pricingConfig.calculatePriceWithBreakdown(
    tier,
    services,
    applyDiscount,
    studentStatus,
    detectedCountry
  );

  const baseTier = pricingConfig.platformTiers.find(t => t.id === tier);

  res.json({
    tier,
    basePrice: baseTier ? baseTier.basePrice : 0,
    basePriceConverted: baseTier ? priceBreakdown.basePriceConverted : 0,
    serviceAddons: priceBreakdown.basePrice - (baseTier ? baseTier.basePrice : 0),
    priceBreakdown,
    currency: priceBreakdown.currency,
    countryCode: detectedCountry,
    formatted: priceBreakdown.formatted,
    note: applyDiscount
      ? `First year ${priceBreakdown.discountPercentage}% discount applied!`
      : 'Regular pricing'
  });
});

/**
 * Get pricing for a specific country
 * GET /api/subscription/pricing/country/:countryCode
 */
app.get('/api/subscription/pricing/country/:countryCode', (req, res) => {
  const { countryCode } = req.params;
  const { tier = 'starter', services = {}, isStudent = false } = req.query;

  const pricing = pricingConfig.getPricingForCountry(
    countryCode,
    tier,
    typeof services === 'string' ? JSON.parse(services) : services,
    true, // Apply first year discount by default
    isStudent === 'true'
  );

  res.json(pricing);
});

/**
 * Verify student status
 * POST /api/subscription/verify-student
 */
app.post('/api/subscription/verify-student', async (req, res) => {
  const { userId, studentId, email } = req.body;

  if (!userId || (!studentId && !email)) {
    return res.status(400).json({
      error: 'User ID and either student ID or email required'
    });
  }

  const verified = await verifyStudent(userId, studentId, email);

  res.json({
    verified,
    userId,
    verification: studentVerifications[userId] || null
  });
});

/**
 * Update subscription (add/remove services)
 * PUT /api/subscription/update/:userId
 * Body: { services: { ... } }
 */
app.put('/api/subscription/update/:userId', (req, res) => {
  const { userId } = req.params;
  const { services } = req.body;

  if (!subscriptions[userId]) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const subscription = subscriptions[userId];
  const updatedServices = { ...subscription.services, ...services };

  // Check if still in first year discount period
  const isFirstYear = subscription.firstYearDiscount &&
    new Date(subscription.firstYearDiscountEnds) > new Date();

  const priceBreakdown = pricingConfig.calculatePriceWithBreakdown(
    subscription.tier,
    updatedServices,
    isFirstYear
  );

  subscriptions[userId] = {
    ...subscription,
    services: updatedServices,
    totalPrice: priceBreakdown.finalPrice,
    baseTotalPrice: priceBreakdown.basePrice,
    discountAmount: priceBreakdown.discountAmount,
    updatedAt: new Date().toISOString()
  };

  res.json({
    subscription: subscriptions[userId],
    message: 'Subscription updated successfully'
  });
});

/**
 * Cancel subscription
 * DELETE /api/subscription/cancel/:userId
 */
app.delete('/api/subscription/cancel/:userId', (req, res) => {
  const { userId } = req.params;

  if (!subscriptions[userId]) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  subscriptions[userId].active = false;
  subscriptions[userId].cancelledAt = new Date().toISOString();

  res.json({
    message: 'Subscription cancelled successfully',
    subscription: subscriptions[userId]
  });
});

const PORT = 4129;
app.listen(PORT, () => console.log(`💳 Subscription Service running on port ${PORT}`));

/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

const express = require('express')
const path = require('path')
const app = express()
app.use(express.json())

// Import pricing config from main service
// In production, this should be a shared package or API call
let pricingConfig
try {
  // Try to load from relative path (when running from project root)
  pricingConfig = require('../../../../ui/lib/services/pricingConfig.js')
} catch (error) {
  console.warn('Could not load pricing config, using fallback')
  // Fallback pricing
  pricingConfig = {
    platformTiers: [
      { id: 'student', name: 'Student Plan', basePrice: 500 },
      { id: 'starter', name: 'Starter Plan', basePrice: 2500 },
      { id: 'professional', name: 'Professional Plan', basePrice: 7500 },
      { id: 'enterprise', name: 'Enterprise Plan', basePrice: 25000 },
    ],
    calculatePriceWithBreakdown: (tier, services, applyDiscount, isStudent, countryCode) => ({
      basePrice: 2500,
      finalPrice: 1875,
      currency: 'USD',
      formatted: { final: '$1,875.00' },
    }),
  }
}

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'subscription' }))

// Proxy to main subscription service
app.get('/api/subscription/pricing', async (req, res) => {
  try {
    const mainServiceUrl = process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:4129'
    const response = await fetch(`${mainServiceUrl}/api/subscription/pricing`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.json({
      platformTiers: pricingConfig.platformTiers || [],
      services: [],
      message: 'Using fallback pricing',
    })
  }
})

app.post('/api/subscription/calculate', async (req, res) => {
  try {
    const mainServiceUrl = process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:4129'
    const response = await fetch(`${mainServiceUrl}/api/subscription/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Subscription service unavailable' })
  }
})

const PORT = process.env.PORT || 4000 + Math.floor(Math.random() * 1000)
app.listen(PORT, () => console.log(`💳 Azora Nexus Subscription Service running on port ${PORT}`))

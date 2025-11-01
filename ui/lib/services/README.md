# Pricing & Subscription Services

This directory contains the core pricing and subscription services for Azora OS.

## Services

### 1. `pricingConfig.js`
Comprehensive pricing configuration with:
- Platform tiers (Student, Starter, Professional, Enterprise)
- Service-specific pricing (Elara IDE, Nexus, Forge, Mint, Oracle, etc.)
- Currency conversion for international customers
- Student discount logic
- First year discount (25% off)

**Key Features:**
- Multi-currency support (ZAR, USD, EUR, GBP, NGN, KES, GHS, CAD, AUD, JPY, CNY, INR)
- Country-based currency detection
- Student verification and discounts
- Automatic discount calculation

### 2. `subscription.js`
Subscription management service that:
- Handles subscription creation and updates
- Verifies student status
- Detects user country
- Calculates pricing with discounts
- Tracks revenue automatically

**Endpoints:**
- `POST /api/subscription/subscribe` - Create subscription
- `GET /api/subscription/status/:userId` - Get subscription status
- `GET /api/subscription/pricing` - Get all pricing tiers
- `POST /api/subscription/calculate` - Calculate pricing
- `GET /api/subscription/pricing/country/:countryCode` - Country-specific pricing
- `POST /api/subscription/verify-student` - Verify student status

### 3. `revenue.js`
Revenue tracking service:
- Tracks revenue by currency
- Tracks revenue by tier
- Projects revenue growth
- Integrates with subscription service

**Endpoints:**
- `POST /api/revenue/add` - Add revenue
- `GET /api/revenue/total` - Get total revenue
- `POST /api/revenue/subscription` - Track subscription revenue
- `GET /api/revenue/projection` - Get revenue projections

## Usage

### In Frontend Components

```typescript
import { usePricing } from '@/lib/hooks/usePricing';

function PricingPage() {
  const { 
    countryCode, 
    currency, 
    isStudent, 
    calculatePricing, 
    subscribe 
  } = usePricing();
  
  // Use pricing functions
}
```

### In API Routes

```javascript
const pricingConfig = require('./pricingConfig');

const pricing = pricingConfig.getPricingForCountry(
  'US', 
  'professional', 
  {}, 
  true // isStudent
);
```

## Configuration

### Environment Variables

- `SUBSCRIPTION_SERVICE_URL` - URL of subscription service (default: http://localhost:4129)
- `REVENUE_SERVICE_URL` - URL of revenue service (default: http://localhost:4126)

### Exchange Rates

Exchange rates can be updated via:

```javascript
pricingConfig.updateExchangeRates({
  USD: 0.054,
  EUR: 0.050,
  // ...
});
```

## Student Verification

Students are verified by:
1. Email domain (.edu, .ac.za, .ac.uk, etc.)
2. Student ID (manual verification)

## Pricing Tiers

1. **Student** - R500/month (80% discount)
2. **Starter** - R2,500/month
3. **Professional** - R7,500/month
4. **Enterprise** - R25,000/month

All tiers include:
- 25% first year discount
- 1 month free trial
- 50% off for 2 months after trial

Students get additional 50% discount on regular tiers.

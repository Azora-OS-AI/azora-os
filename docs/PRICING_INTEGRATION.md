# Pricing System Integration Guide

This document describes how the pricing system is integrated across Azora OS services.

## Architecture Overview

The pricing system consists of:

1. **Pricing Configuration** (`ui/lib/services/pricingConfig.js`)
   - Core pricing tiers and service pricing
   - Currency conversion and country mapping
   - Student discount logic

2. **Subscription Service** (`ui/lib/services/subscription.js`)
   - Subscription management API
   - Student verification
   - Country detection

3. **Frontend Integration** (`ui/lib/hooks/usePricing.ts`)
   - React hook for pricing functionality
   - Country detection
   - Currency display

4. **API Routes** (`ui/app/api/subscription/`)
   - Next.js API routes that proxy to subscription service
   - Pricing calculation endpoints
   - Student verification endpoints

## Integration Points

### 1. Frontend Components

Use the `usePricing` hook in React components:

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

  // Component implementation
}
```

### 2. API Endpoints

**Get Pricing Tiers:**
```
GET /api/subscription/pricing
```

**Calculate Pricing:**
```
POST /api/subscription/calculate
Body: {
  tier: 'starter',
  countryCode: 'US',
  isStudent: false,
  services: {}
}
```

**Subscribe:**
```
POST /api/subscription/subscribe
Body: {
  userId: 'user123',
  tier: 'professional',
  countryCode: 'US',
  studentId: 'optional',
  email: 'user@example.com',
  services: {}
}
```

**Get Country Pricing:**
```
GET /api/subscription/pricing/country/US?tier=starter&isStudent=false
```

**Verify Student:**
```
POST /api/subscription/verify-student
Body: {
  userId: 'user123',
  studentId: 'optional',
  email: 'student@university.edu'
}
```

### 3. Revenue Tracking

Subscription revenue is automatically tracked when a subscription is created:

```javascript
// Automatically called in subscription service
POST /api/revenue/subscription
Body: {
  amount: 5000,
  currency: 'USD',
  tier: 'professional',
  countryCode: 'US'
}
```

### 4. Country Detection

Country is automatically detected from:
1. Browser geolocation API (if user allows)
2. IP-based geolocation (fallback)
3. Manual country selection (user preference)

### 5. Currency Conversion

Prices are stored in ZAR (base currency) and converted to user's local currency using exchange rates defined in `pricingConfig.js`.

Exchange rates can be updated via API:
```javascript
pricingConfig.updateExchangeRates({
  USD: 0.054,
  EUR: 0.050,
  // ...
});
```

## Service Dependencies

### Subscription Service
- Port: 4129
- Environment Variable: `SUBSCRIPTION_SERVICE_URL`

### Revenue Service  
- Port: 4126
- Environment Variable: `REVENUE_SERVICE_URL`

## Student Verification

Student verification works via:
1. **Email Domain Check**: Validates .edu, .ac.za, .ac.uk, etc.
2. **Student ID**: Manual verification (for production, integrate with student verification service)

## Currency Support

Supported currencies:
- ZAR (South African Rand) - Base
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- NGN (Nigerian Naira)
- KES (Kenyan Shilling)
- GHS (Ghanaian Cedi)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- INR (Indian Rupee)

## Discount Structure

1. **First Year Discount**: 25% off (all users)
2. **Student Discount**: 
   - 80% off Student Plan
   - 50% additional discount on regular tiers
3. **Combined**: Up to 62.5% off for students

## Testing

Test pricing calculations:
```bash
curl -X POST http://localhost:4129/api/subscription/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "professional",
    "countryCode": "US",
    "isStudent": false
  }'
```

Test student verification:
```bash
curl -X POST http://localhost:4129/api/subscription/verify-student \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "email": "student@university.edu"
  }'
```

## Production Considerations

1. **Exchange Rates**: Integrate with live exchange rate API (e.g., ExchangeRate-API, Fixer.io)
2. **Student Verification**: Integrate with official student verification services
3. **IP Geolocation**: Use paid service for accurate country detection (MaxMind, ipapi.co)
4. **Payment Processing**: Integrate with payment gateways (Stripe, PayPal, etc.)
5. **Database**: Store subscriptions in persistent database instead of in-memory
6. **Analytics**: Track pricing metrics and conversion rates

## Environment Variables

```bash
SUBSCRIPTION_SERVICE_URL=http://localhost:4129
REVENUE_SERVICE_URL=http://localhost:4126
```



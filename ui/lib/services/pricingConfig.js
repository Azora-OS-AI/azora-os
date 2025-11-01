/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * Azora OS Comprehensive Pricing Configuration
 * Base prices in ZAR (South African Rand)
 * Currency conversion for international customers
 * Trial: 1 month free, then 50% off for 2 months
 */

// Currency Exchange Rates (updated regularly, defaults to approximate rates)
// These should ideally be fetched from an API, but we'll use defaults
const EXCHANGE_RATES = {
  ZAR: 1.0,        // Base currency (South African Rand)
  USD: 0.054,      // ~1 USD = 18.5 ZAR
  EUR: 0.050,      // ~1 EUR = 20 ZAR
  GBP: 0.042,      // ~1 GBP = 24 ZAR
  NGN: 84.0,       // ~1 NGN = 0.012 ZAR
  KES: 0.74,       // ~1 KES = 1.35 ZAR
  GHS: 0.78,       // ~1 GHS = 1.28 ZAR
  CAD: 0.074,      // ~1 CAD = 13.5 ZAR
  AUD: 0.082,      // ~1 AUD = 12.2 ZAR
  JPY: 8.0,        // ~1 JPY = 0.125 ZAR
  CNY: 0.38,       // ~1 CNY = 2.6 ZAR
  INR: 4.5,        // ~1 INR = 0.22 ZAR
};

// Country to Currency Mapping
const COUNTRY_CURRENCY = {
  'ZA': 'ZAR', // South Africa
  'US': 'USD', 'USA': 'USD', // United States
  'CA': 'CAD', 'CAN': 'CAD', // Canada
  'GB': 'GBP', 'UK': 'GBP', 'GBR': 'GBP', // United Kingdom
  'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', // Eurozone
  'NG': 'NGN', 'NGA': 'NGN', // Nigeria
  'KE': 'KES', 'KEN': 'KES', // Kenya
  'GH': 'GHS', 'GHA': 'GHS', // Ghana
  'AU': 'AUD', 'AUS': 'AUD', // Australia
  'JP': 'JPY', 'JPN': 'JPY', // Japan
  'CN': 'CNY', 'CHN': 'CNY', // China
  'IN': 'INR', 'IND': 'INR', // India
};

// Default currency for unknown countries
const DEFAULT_CURRENCY = 'USD';

// Core Platform Tiers (Base prices in ZAR)
const platformTiers = [
  {
    id: 'student',
    tier: 'student',
    name: 'Student Plan',
    basePrice: 500, // R500/month (heavily discounted for students)
    studentDiscount: 0.80, // 80% discount from starter plan
    trialDays: 30,
    promoDiscount: 0.5,
    promoMonths: 2,
    features: [
      'Full platform access',
      'All learning resources',
      'AI coding assistant (Elara IDE)',
      'Limited AI features (50 requests/month)',
      'Student wallet features',
      'Access to courses and certifications',
      'Community support',
      'Portfolio building tools',
      'Job placement resources',
      'Mentorship programs'
    ],
    requiresVerification: true, // Requires student ID/email verification
    maxAge: 30 // Maximum age for student plan (years)
  },
  {
    id: 'starter',
    tier: 'starter',
    name: 'Starter Plan',
    basePrice: 2500, // R2,500/month
    trialDays: 30,
    promoDiscount: 0.5,
    promoMonths: 2,
    features: [
      'Up to 10 users',
      'Basic route optimization',
      'Real-time tracking',
      'Mobile app access',
      'Email support',
      'Basic wallet features',
      'Limited AI features (100 requests/month)',
      'Community support'
    ]
  },
  {
    id: 'professional',
    tier: 'professional',
    name: 'Professional Plan',
    basePrice: 7500, // R7,500/month
    trialDays: 30,
    promoDiscount: 0.5,
    promoMonths: 2,
    features: [
      'Up to 50 users',
      'Advanced AI optimization',
      'Predictive maintenance',
      'Custom integrations',
      'Priority support',
      'Advanced analytics',
      'Full wallet & staking',
      'NFT marketplace access',
      'AI features (1,000 requests/month)',
      'Elara IDE access',
      'DeFi tools'
    ]
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'Enterprise Plan',
    basePrice: 25000, // R25,000/month
    trialDays: 30,
    promoDiscount: 0.5,
    promoMonths: 2,
    features: [
      'Unlimited users',
      'Full AI suite',
      'Custom AI models',
      'White-label solution',
      'Dedicated support',
      'Advanced security',
      'Compliance automation',
      'Unlimited AI requests',
      'Private blockchain access',
      'Custom integrations',
      'SLA guarantee'
    ]
  }
];

// Service-Specific Pricing (Add-ons)
const servicePricing = {
  // Elara IDE Services
  elaraIde: {
    base: 500, // R500/month base
    aiChat: {
      starter: 200, // R200/month - 100 requests/day
      professional: 500, // R500/month - 500 requests/day
      enterprise: 0 // Included in enterprise
    },
    codeGeneration: {
      starter: 300, // R300/month - 50 generations/month
      professional: 800, // R800/month - 200 generations/month
      enterprise: 0 // Included
    },
    advancedFeatures: {
      starter: 0,
      professional: 600, // R600/month
      enterprise: 0 // Included
    }
  },

  // Azora Nexus Services
  nexus: {
    wallet: {
      basic: 0, // Free for basic wallet
      advanced: 200, // R200/month - Multi-currency, advanced security
      enterprise: 0 // Included
    },
    staking: {
      fee: 0.025, // 2.5% of staking rewards
      minimum: 100 // R100 minimum per transaction
    },
    nft: {
      minting: {
        perNFT: 50, // R50 per NFT minted
        batch: {
          '10-50': 40, // R40 each for 10-50
          '51-100': 30, // R30 each for 51-100
          '100+': 25 // R25 each for 100+
        }
      },
      marketplace: {
        listingFee: 100, // R100 per listing
        transactionFee: 0.05 // 5% of sale price
      }
    },
    defi: {
      trading: {
        fee: 0.003, // 0.3% trading fee
        premium: 1500 // R1,500/month for premium features
      },
      liquidity: {
        fee: 0.002, // 0.2% liquidity provider fee
        management: 800 // R800/month for liquidity management
      }
    },
    aiTrading: {
      basic: 2000, // R2,000/month - Basic AI trading
      advanced: 5000, // R5,000/month - Advanced AI strategies
      enterprise: 10000 // R10,000/month - Custom AI models
    },
    aiValuation: {
      perValuation: 500, // R500 per valuation
      bulk: {
        '10+': 400, // R400 each for 10+
        '50+': 300, // R300 each for 50+
        '100+': 250 // R250 each for 100+
      }
    },
    compliance: {
      basic: 1500, // R1,500/month - Basic compliance monitoring
      advanced: 4000, // R4,000/month - Advanced compliance automation
      enterprise: 8000 // R8,000/month - Full compliance suite
    },
    identity: {
      basic: 50, // R50 per identity verification
      premium: 200, // R200 per premium verification with KYC
      enterprise: 0 // Included in enterprise plan
    },
    guardian: {
      basic: 300, // R300/month - Basic security monitoring
      advanced: 1000, // R1,000/month - Advanced threat protection
      enterprise: 0 // Included
    }
  },

  // Azora Forge (Merchant Services)
  forge: {
    base: 800, // R800/month base subscription
    transactionFee: 0.029, // 2.9% + R0.50 per transaction
    monthlyFee: 0.50,
    premium: {
      monthly: 2000, // R2,000/month
      transactionFee: 0.019, // 1.9% for premium
      features: ['Advanced analytics', 'Custom checkout', 'Multi-currency']
    },
    enterprise: {
      custom: true, // Custom pricing
      features: ['White-label', 'Dedicated support', 'SLA']
    }
  },

  // Azora Mint (NFT Minting Platform)
  mint: {
    perMint: 75, // R75 per NFT minted
    batch: {
      '10-100': 60, // R60 each
      '101-500': 45, // R45 each
      '500+': 35 // R35 each
    },
    platform: {
      monthly: 1500, // R1,500/month platform fee
      royalties: 0.05 // 5% royalty fee on secondary sales
    }
  },

  // Azora Oracle (Data Services)
  oracle: {
    dataFeeds: {
      basic: 500, // R500/month - 1,000 API calls
      professional: 1500, // R1,500/month - 10,000 API calls
      enterprise: 5000 // R5,000/month - Unlimited calls
    },
    customQueries: {
      perQuery: 100, // R100 per custom query
      bulk: {
        '10+': 80,
        '50+': 60,
        '100+': 50
      }
    },
    realTime: {
      monthly: 3000, // R3,000/month for real-time data streams
      premium: 8000 // R8,000/month for premium real-time
    }
  },

  // Azora Sapiens (Education Platform)
  sapiens: {
    courses: {
      perCourse: 500, // R500 per course enrollment
      bundle: {
        '5': 2000, // R2,000 for 5 courses (20% discount)
        '10': 3500, // R3,500 for 10 courses (30% discount)
        'unlimited': 5000 // R5,000/month for unlimited courses
      }
    },
    certifications: {
      perCert: 1500, // R1,500 per certification
      bundle: {
        '3': 4000, // R4,000 for 3 certifications
        '5': 6000 // R6,000 for 5 certifications
      }
    },
    tutoring: {
      perHour: 300, // R300/hour for AI tutoring
      monthly: 2000 // R2,000/month for 10 hours
    },
    enterprise: {
      perUser: 200, // R200 per user per month
      minimum: 10000 // R10,000 minimum
    }
  },

  // Azora Scriptorium (Document/Publishing)
  scriptorium: {
    publishing: {
      perDocument: 250, // R250 per document published
      monthly: 1500, // R1,500/month for unlimited publishing
      enterprise: 5000 // R5,000/month for enterprise features
    },
    storage: {
      free: 5, // 5GB free
      additional: 50 // R50 per additional 10GB
    },
    collaboration: {
      basic: 800, // R800/month - Up to 10 collaborators
      professional: 2000, // R2,000/month - Up to 50 collaborators
      enterprise: 5000 // R5,000/month - Unlimited collaborators
    }
  },

  // Azora Education
  education: {
    institution: {
      perStudent: 150, // R150 per student per month
      minimum: 5000, // R5,000 minimum per month
      bulk: {
        '100-500': 120, // R120 per student
        '500+': 100 // R100 per student
      }
    },
    features: {
      lms: 3000, // R3,000/month for LMS features
      assessment: 2000, // R2,000/month for assessment tools
      analytics: 2500 // R2,500/month for analytics
    }
  },

  // Azora Workspace
  workspace: {
    perUser: 350, // R350 per user per month
    features: {
      collaboration: 0, // Included
      storage: 100, // R100 per 100GB additional storage
      integrations: 500 // R500/month for premium integrations
    },
    enterprise: {
      perUser: 280, // R280 per user (bulk discount)
      minimum: 20000 // R20,000 minimum
    }
  },

  // Integration Services
  integrations: {
    microsoft365: {
      monthly: 800, // R800/month
      perUser: 150 // R150 per user additional
    },
    googleWorkspace: {
      monthly: 700, // R700/month
      perUser: 120 // R120 per user additional
    },
    azure: {
      monthly: 1200, // R1,200/month
      usageBased: true // Additional charges based on usage
    },
    googleCloud: {
      monthly: 1100, // R1,100/month
      usageBased: true
    }
  },

  // Specialized Services
  specialized: {
    coldChain: {
      monthly: 2000, // R2,000/month base
      perDevice: 200 // R200 per monitored device
    },
    securityFramework: {
      monthly: 3000, // R3,000/month
      enterprise: 8000 // R8,000/month for enterprise
    },
    neuralLink: {
      api: 1500, // R1,500/month for API access
      infrastructure: 5000 // R5,000/month for infrastructure
    },
    constitutionalAI: {
      monthly: 4000, // R4,000/month for governance features
      enterprise: 10000 // R10,000/month for enterprise
    }
  }
};

// Pricing Configuration Constants
const FIRST_YEAR_DISCOUNT = 0.25; // 25% discount for first year
const STUDENT_DISCOUNT = 0.50; // 50% additional discount for students (applied after first year discount)

/**
 * Get currency for a country code
 */
const getCurrencyForCountry = (countryCode) => {
  if (!countryCode) return DEFAULT_CURRENCY;
  const code = countryCode.toUpperCase();
  return COUNTRY_CURRENCY[code] || DEFAULT_CURRENCY;
};

/**
 * Convert price from ZAR to target currency
 */
const convertPrice = (priceZAR, targetCurrency = 'USD') => {
  const rate = EXCHANGE_RATES[targetCurrency.toUpperCase()];
  if (!rate) return priceZAR; // Return original if currency not found

  // Convert: priceZAR * rate = price in target currency
  return Math.round((priceZAR * rate) * 100) / 100;
};

/**
 * Format price with currency symbol
 */
const formatPrice = (price, currency = 'USD') => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'ZAR': 'R',
    'NGN': '₦',
    'KES': 'KSh',
    'GHS': '₵',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹'
  };

  const symbol = symbols[currency.toUpperCase()] || currency;
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Handle symbol placement
  if (currency === 'USD' || currency === 'CAD' || currency === 'AUD') {
    return `${symbol}${formatted}`;
  } else if (currency === 'EUR' || currency === 'GBP') {
    return `${symbol}${formatted}`;
  } else {
    return `${symbol} ${formatted}`;
  }
};

module.exports = {
  platformTiers,
  servicePricing,
  FIRST_YEAR_DISCOUNT,
  STUDENT_DISCOUNT,
  EXCHANGE_RATES,
  COUNTRY_CURRENCY,
  getCurrencyForCountry,
  convertPrice,
  formatPrice,

  // Helper function to calculate total price for a service configuration
  calculatePrice: (tier, services = {}, applyFirstYearDiscount = false, isStudent = false, countryCode = null) => {
    let total = 0;

    // Base platform tier price
    const platformTier = platformTiers.find(t => t.id === tier);
    if (platformTier) {
      total += platformTier.basePrice;
    }

    // Add service add-on prices
    Object.entries(services).forEach(([service, config]) => {
      if (servicePricing[service] && typeof config === 'object') {
        // Handle nested service pricing
        Object.entries(config).forEach(([key, value]) => {
          const pricing = servicePricing[service][key];
          if (pricing) {
            if (typeof pricing === 'number') {
              total += pricing;
            } else if (typeof pricing === 'object' && pricing[tier]) {
              total += pricing[tier];
            }
          }
        });
      }
    });

    // Apply student discount (if student and not already on student tier)
    if (isStudent && tier !== 'student') {
      total = total * (1 - STUDENT_DISCOUNT);
    }

    // Apply first year discount if requested
    if (applyFirstYearDiscount) {
      total = total * (1 - FIRST_YEAR_DISCOUNT);
    }

    return Math.round(total * 100) / 100; // Round to 2 decimal places
  },

  // Calculate price with breakdown (base, discount, final)
  calculatePriceWithBreakdown: (tier, services = {}, applyFirstYearDiscount = false, isStudent = false, countryCode = null) => {
    const basePrice = module.exports.calculatePrice(tier, services, false, false);
    let finalPrice = basePrice;
    let discountAmount = 0;
    let studentDiscountAmount = 0;
    let discountPercentage = 0;

    // Calculate student discount
    if (isStudent && tier !== 'student') {
      studentDiscountAmount = basePrice * STUDENT_DISCOUNT;
      finalPrice = basePrice - studentDiscountAmount;
      discountPercentage += STUDENT_DISCOUNT * 100;
    }

    // Calculate first year discount (applied on top of student discount if applicable)
    if (applyFirstYearDiscount) {
      const remainingPrice = finalPrice;
      const firstYearDiscount = remainingPrice * FIRST_YEAR_DISCOUNT;
      discountAmount += firstYearDiscount;
      finalPrice = remainingPrice - firstYearDiscount;
      discountPercentage += FIRST_YEAR_DISCOUNT * 100;
    }

    // Get currency for country
    const currency = getCurrencyForCountry(countryCode);
    const basePriceConverted = convertPrice(basePrice, currency);
    const finalPriceConverted = convertPrice(finalPrice, currency);
    const discountAmountConverted = convertPrice(discountAmount + studentDiscountAmount, currency);

    const currencySymbol = formatPrice(1, currency).replace('1.00', '').trim();

    return {
      basePrice: Math.round(basePrice * 100) / 100,
      basePriceConverted: Math.round(basePriceConverted * 100) / 100,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      discountAmount: Math.round((discountAmount + studentDiscountAmount) * 100) / 100,
      discountAmountConverted: Math.round(discountAmountConverted * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      finalPriceConverted: Math.round(finalPriceConverted * 100) / 100,
      currency: currency,
      currencySymbol: currencySymbol,
      countryCode: countryCode,
      isStudent: isStudent,
      savings: discountAmount > 0 || studentDiscountAmount > 0
        ? `Save ${formatPrice(discountAmountConverted + studentDiscountAmount > 0 ? studentDiscountAmount : 0, currency)} in your first year!`
        : null
    };
  },

  // Get pricing for a specific country/currency
  getPricingForCountry: (countryCode, tier = 'starter', services = {}, applyFirstYearDiscount = false, isStudent = false) => {
    const currency = getCurrencyForCountry(countryCode);
    const breakdown = module.exports.calculatePriceWithBreakdown(
      tier,
      services,
      applyFirstYearDiscount,
      isStudent,
      countryCode
    );

    return {
      ...breakdown,
      formatted: {
        base: formatPrice(breakdown.basePriceConverted, currency),
        final: formatPrice(breakdown.finalPriceConverted, currency),
        savings: breakdown.savings
      }
    };
  },

  // Get all available services
  getAllServices: () => Object.keys(servicePricing),

  // Get pricing for a specific service
  getServicePricing: (service) => servicePricing[service] || null,

  // Update exchange rates (should be called periodically from API)
  updateExchangeRates: (newRates) => {
    Object.assign(EXCHANGE_RATES, newRates);
  }
};

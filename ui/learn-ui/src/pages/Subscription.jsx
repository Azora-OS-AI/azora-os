import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Import pricing hook (if available, otherwise use local state)
const usePricing = () => {
  const [countryCode, setCountryCode] = useState('US')
  const [currency, setCurrency] = useState('USD')
  const [isStudent, setIsStudent] = useState(false)
  const [pricingData, setPricingData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    detectCountry()
  }, [])

  const detectCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      if (data.country_code) {
        setCountryCode(data.country_code)
        const currencyMap = {
          'ZA': 'ZAR', 'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'UK': 'GBP',
          'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
          'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'AU': 'AUD'
        }
        setCurrency(currencyMap[data.country_code] || 'USD')
      }
    } catch (error) {
      console.error('Country detection error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPricing = async (tier) => {
    try {
      const response = await fetch(`/api/subscription/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          countryCode,
          isStudent,
          applyFirstYearDiscount: true
        })
      })
      const data = await response.json()
      if (data.priceBreakdown) {
        setPricingData(prev => ({ ...prev, [tier]: data.priceBreakdown }))
      }
    } catch (error) {
      console.error('Error loading pricing:', error)
    }
  }

  return { countryCode, currency, isStudent, setIsStudent, loading, loadPricing, pricingData }
}

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [showStudentVerification, setShowStudentVerification] = useState(false)
  const { countryCode, currency, isStudent, setIsStudent, loading, loadPricing, pricingData } = usePricing()

  useEffect(() => {
    // Load pricing for all tiers
    ['student', 'starter', 'professional', 'enterprise'].forEach(tier => {
      loadPricing(tier)
    })
  }, [countryCode, isStudent])

  const plans = [
    {
      id: 'student',
      name: 'Student',
      basePrice: 500,
      currency: 'ZAR',
      period: 'month',
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
      requiresVerification: true,
      badge: '🎓 Best Value'
    },
    {
      id: 'starter',
      name: 'Starter',
      basePrice: 2500,
      currency: 'ZAR',
      period: 'month',
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
      name: 'Professional',
      basePrice: 7500,
      currency: 'ZAR',
      period: 'month',
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
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 25000,
      currency: 'ZAR',
      period: 'month',
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
  ]

  const formatPrice = (price, curr = currency) => {
    const symbols = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'ZAR': 'R',
      'NGN': '₦', 'KES': 'KSh', 'GHS': '₵', 'CAD': 'C$', 'AUD': 'A$'
    }
    const symbol = symbols[curr] || curr
    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getDisplayPrice = (plan) => {
    const pricing = pricingData[plan.id]
    if (pricing && pricing.formatted) {
      return pricing.formatted.final
    }
    // Fallback to base price with currency conversion
    return formatPrice(plan.basePrice)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the perfect plan for your Azora OS deployment</p>
        {countryCode && (
          <p className="text-sm text-muted-foreground mt-2">
            Prices shown in {currency} ({countryCode}) • 25% off first year!
          </p>
        )}
      </div>

      {showStudentVerification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Student Verification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Student Email (.edu)</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/subscription/verify-student', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 'current-user', email: studentEmail })
                  })
                  const data = await response.json()
                  if (data.verified) {
                    setIsStudent(true)
                    setShowStudentVerification(false)
                  }
                } catch (error) {
                  console.error('Verification error:', error)
                }
              }}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
            >
              Verify Student Status
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative bg-card border border-border rounded-lg p-6 ${
              plan.popular ? 'ring-2 ring-primary' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {(plan.badge || plan.popular) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {plan.badge || 'Most Popular'}
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-2">
                {loading ? (
                  <span className="text-muted-foreground">Loading...</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-foreground">{getDisplayPrice(plan)}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                    {pricingData[plan.id]?.formatted?.savings && (
                      <div className="text-sm text-green-500 mt-1">
                        {pricingData[plan.id].formatted.savings}
                      </div>
                    )}
                  </>
                )}
              </div>
              {plan.requiresVerification && (
                <p className="text-xs text-muted-foreground mt-1">Student verification required</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (plan.requiresVerification && !isStudent) {
                  setShowStudentVerification(true)
                } else {
                  setSelectedPlan(plan.id)
                }
              }}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                selectedPlan === plan.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {selectedPlan === plan.id ? 'Selected' : plan.requiresVerification && !isStudent ? 'Verify Student' : 'Select Plan'}
            </button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Complete Your Subscription</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Subscription

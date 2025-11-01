/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { useState, useEffect } from 'react';

interface PricingBreakdown {
  basePrice: number;
  basePriceConverted: number;
  discountPercentage: number;
  discountAmount: number;
  discountAmountConverted: number;
  finalPrice: number;
  finalPriceConverted: number;
  currency: string;
  currencySymbol: string;
  countryCode: string;
  isStudent: boolean;
  savings: string | null;
  formatted: {
    base: string;
    final: string;
    savings: string | null;
  };
}

interface Tier {
  id: string;
  tier: string;
  name: string;
  basePrice: number;
  features: string[];
  trialDays: number;
  promoDiscount: number;
  promoMonths: number;
}

/**
 * Hook for pricing functionality
 * Handles country detection, currency conversion, and student verification
 */
export function usePricing() {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tiers, setTiers] = useState<Tier[]>([]);

  // Detect country on mount
  useEffect(() => {
    detectCountry();
    loadPricingTiers();
  }, []);

  /**
   * Detect user's country from browser or IP
   */
  const detectCountry = async () => {
    try {
      // Try browser geolocation API first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Reverse geocode to get country
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            );
            const data = await response.json();
            if (data.countryCode) {
              setCountryCode(data.countryCode);
              updateCurrency(data.countryCode);
            }
          },
          () => {
            // Fallback to IP-based detection
            detectCountryByIP();
          }
        );
      } else {
        detectCountryByIP();
      }
    } catch (error) {
      console.error('Country detection error:', error);
      // Default to US
      setCountryCode('US');
      updateCurrency('US');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Detect country by IP address
   */
  const detectCountryByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country_code) {
        setCountryCode(data.country_code);
        updateCurrency(data.country_code);
      } else {
        setCountryCode('US');
        updateCurrency('US');
      }
    } catch (error) {
      console.error('IP-based country detection error:', error);
      setCountryCode('US');
      updateCurrency('US');
    }
  };

  /**
   * Update currency based on country code
   */
  const updateCurrency = (code: string) => {
    const currencyMap: Record<string, string> = {
      'ZA': 'ZAR',
      'US': 'USD',
      'CA': 'CAD',
      'GB': 'GBP',
      'UK': 'GBP',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'NG': 'NGN',
      'KE': 'KES',
      'GH': 'GHS',
      'AU': 'AUD',
      'JP': 'JPY',
      'CN': 'CNY',
      'IN': 'INR',
    };
    setCurrency(currencyMap[code] || 'USD');
  };

  /**
   * Load pricing tiers from API
   */
  const loadPricingTiers = async () => {
    try {
      const response = await fetch('/api/subscription/pricing');
      const data = await response.json();
      if (data.platformTiers) {
        setTiers(data.platformTiers);
      }
    } catch (error) {
      console.error('Error loading pricing tiers:', error);
    }
  };

  /**
   * Calculate pricing for a tier and services
   */
  const calculatePricing = async (
    tier: string,
    services: Record<string, any> = {},
    applyFirstYearDiscount: boolean = true,
    studentStatus: boolean = false
  ): Promise<PricingBreakdown | null> => {
    try {
      const response = await fetch('/api/subscription/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          services,
          countryCode: countryCode || 'US',
          isStudent: studentStatus || isStudent,
          applyFirstYearDiscount,
        }),
      });

      const data = await response.json();
      return data.priceBreakdown || null;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      return null;
    }
  };

  /**
   * Get pricing for specific country
   */
  const getPricingForCountry = async (
    country: string,
    tier: string = 'starter',
    services: Record<string, any> = {},
    studentStatus: boolean = false
  ): Promise<PricingBreakdown | null> => {
    try {
      const response = await fetch(
        `/api/subscription/pricing/country/${country}?tier=${tier}&isStudent=${studentStatus}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting country pricing:', error);
      return null;
    }
  };

  /**
   * Verify student status
   */
  const verifyStudentStatus = async (userId: string, studentId?: string, email?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscription/verify-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          studentId,
          email,
        }),
      });

      const data = await response.json();
      if (data.verified) {
        setIsStudent(true);
      }
      return data.verified || false;
    } catch (error) {
      console.error('Error verifying student status:', error);
      return false;
    }
  };

  /**
   * Subscribe to a plan
   */
  const subscribe = async (
    userId: string,
    tier: string,
    services: Record<string, any> = {},
    studentId?: string,
    email?: string
  ) => {
    try {
      const response = await fetch('/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tier,
          services,
          countryCode: countryCode || 'US',
          studentId,
          email,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  };

  return {
    countryCode,
    currency,
    isStudent,
    loading,
    tiers,
    detectCountry,
    calculatePricing,
    getPricingForCountry,
    verifyStudentStatus,
    subscribe,
    setIsStudent,
    setCountryCode,
  };
}



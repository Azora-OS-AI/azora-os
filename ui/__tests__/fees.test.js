/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

const { calcFeeUSD } = require('../fees');

describe('Fee Calculation Utilities', () => {
  describe('calcFeeUSD', () => {
    describe('core functionality with default configuration', () => {
      it('should calculate percentage fee for amounts above minimum threshold', () => {
        // Default: 10 BPS = 0.10%, minimum $0.01
        // $100 * 0.10% = $0.10
        expect(calcFeeUSD(100)).toBe(0.10);
        
        // $1000 * 0.10% = $1.00
        expect(calcFeeUSD(1000)).toBe(1.00);
        
        // $50 * 0.10% = $0.05
        expect(calcFeeUSD(50)).toBe(0.05);
      });

      it('should apply minimum fee for small amounts', () => {
        // $1 * 0.10% = $0.001, but minimum is $0.01
        expect(calcFeeUSD(1)).toBe(0.01);
        
        // $5 * 0.10% = $0.005, but minimum is $0.01
        expect(calcFeeUSD(5)).toBe(0.01);
        
        // $9 * 0.10% = $0.009, but minimum is $0.01
        expect(calcFeeUSD(9)).toBe(0.01);
      });

      it('should handle the threshold where percentage equals minimum', () => {
        // At $10: $10 * 0.10% = $0.01 (equals minimum)
        expect(calcFeeUSD(10)).toBe(0.01);
        
        // Just above threshold: $10.01 * 0.10% = $0.01001
        expect(calcFeeUSD(10.01)).toBeCloseTo(0.01001, 5);
      });

      it('should handle zero and very small amounts', () => {
        expect(calcFeeUSD(0)).toBe(0.01);
        expect(calcFeeUSD(0.01)).toBe(0.01);
        expect(calcFeeUSD(0.1)).toBe(0.01);
      });

      it('should handle large amounts correctly', () => {
        // $1,000,000 * 0.10% = $1,000
        expect(calcFeeUSD(1000000)).toBe(1000);
        
        // $10,000,000 * 0.10% = $10,000
        expect(calcFeeUSD(10000000)).toBe(10000);
      });

      it('should handle decimal amounts precisely', () => {
        // $123.45 * 0.10% = $0.12345
        expect(calcFeeUSD(123.45)).toBeCloseTo(0.12345, 5);
        
        // $999.99 * 0.10% = $0.99999
        expect(calcFeeUSD(999.99)).toBeCloseTo(0.99999, 5);
      });
    });

    describe('edge cases and error handling', () => {
      it('should handle negative amounts gracefully', () => {
        // Negative amounts should still apply minimum fee
        expect(calcFeeUSD(-100)).toBe(0.01);
        expect(calcFeeUSD(-1)).toBe(0.01);
      });

      it('should handle very large numbers', () => {
        const largeAmount = Number.MAX_SAFE_INTEGER;
        const result = calcFeeUSD(largeAmount);
        
        // Should not throw and should return a reasonable number
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThan(0);
        expect(isFinite(result)).toBe(true);
      });

      it('should handle floating point precision correctly', () => {
        // Test amounts that might cause floating point issues
        expect(calcFeeUSD(0.1 + 0.2)).toBeCloseTo(calcFeeUSD(0.3), 10);
        expect(calcFeeUSD(1.1 * 3)).toBeCloseTo(calcFeeUSD(3.3), 10);
      });

      it('should handle NaN and undefined inputs', () => {
        // NaN should result in NaN (actual behavior)
        expect(calcFeeUSD(NaN)).toBeNaN();
        
        // undefined should result in NaN (actual behavior)
        expect(calcFeeUSD(undefined)).toBeNaN();
        
        // null should result in minimum fee (actual behavior)
        expect(calcFeeUSD(null)).toBe(0.01);
      });

      it('should handle string inputs that can be converted to numbers', () => {
        // String numbers should be converted
        expect(calcFeeUSD('100')).toBe(0.10);
        expect(calcFeeUSD('1000')).toBe(1.00);
        expect(calcFeeUSD('10')).toBe(0.01);
      });

      it('should handle string inputs that cannot be converted to numbers', () => {
        // Invalid strings should result in NaN (actual behavior)
        expect(calcFeeUSD('invalid')).toBeNaN();
        expect(calcFeeUSD('abc')).toBeNaN();
        expect(calcFeeUSD('')).toBe(0.01); // Empty string converts to 0, which uses minimum
      });
    });

    describe('mathematical properties', () => {
      it('should be monotonically increasing for amounts above minimum threshold', () => {
        const amounts = [100, 200, 500, 1000, 2000, 5000];
        const fees = amounts.map(calcFeeUSD);
        
        // Each fee should be greater than or equal to the previous
        for (let i = 1; i < fees.length; i++) {
          expect(fees[i]).toBeGreaterThanOrEqual(fees[i - 1]);
        }
      });

      it('should scale linearly with amount for large amounts', () => {
        const baseAmount = 10000;
        const baseFee = calcFeeUSD(baseAmount);
        
        // Double the amount should double the fee
        expect(calcFeeUSD(baseAmount * 2)).toBeCloseTo(baseFee * 2, 10);
        
        // Triple the amount should triple the fee
        expect(calcFeeUSD(baseAmount * 3)).toBeCloseTo(baseFee * 3, 10);
      });

      it('should have consistent ratio for percentage-based fees', () => {
        const amount1 = 1000;
        const amount2 = 2000;
        const fee1 = calcFeeUSD(amount1);
        const fee2 = calcFeeUSD(amount2);
        
        // Ratio of fees should equal ratio of amounts (when above minimum)
        expect(fee2 / fee1).toBeCloseTo(amount2 / amount1, 10);
      });

      it('should return a positive number for valid inputs', () => {
        const validAmounts = [0, 1, 10, 100, 1000, -100, null];
        
        validAmounts.forEach(amount => {
          const fee = calcFeeUSD(amount);
          expect(fee).toBeGreaterThan(0);
          expect(typeof fee).toBe('number');
          expect(isFinite(fee)).toBe(true);
        });
      });

      it('should return NaN for invalid inputs', () => {
        const invalidAmounts = [NaN, undefined, 'invalid', 'abc'];
        
        invalidAmounts.forEach(amount => {
          const fee = calcFeeUSD(amount);
          expect(fee).toBeNaN();
        });
      });

      it('should have minimum fee as lower bound', () => {
        const testAmounts = [0, 0.01, 0.1, 1, 5, 9, 9.99];
        
        testAmounts.forEach(amount => {
          const fee = calcFeeUSD(amount);
          expect(fee).toBeGreaterThanOrEqual(0.01);
        });
      });
    });

    describe('business logic validation', () => {
      it('should calculate correct fees for typical transaction amounts', () => {
        // Common transaction amounts and expected fees
        const testCases = [
          { amount: 1, expectedFee: 0.01 },      // Minimum fee applies
          { amount: 10, expectedFee: 0.01 },     // At threshold
          { amount: 20, expectedFee: 0.02 },     // $20 * 0.10% = $0.02
          { amount: 100, expectedFee: 0.10 },    // $100 * 0.10% = $0.10
          { amount: 500, expectedFee: 0.50 },    // $500 * 0.10% = $0.50
          { amount: 1000, expectedFee: 1.00 },   // $1000 * 0.10% = $1.00
          { amount: 5000, expectedFee: 5.00 },   // $5000 * 0.10% = $5.00
          { amount: 10000, expectedFee: 10.00 }  // $10000 * 0.10% = $10.00
        ];

        testCases.forEach(({ amount, expectedFee }) => {
          expect(calcFeeUSD(amount)).toBeCloseTo(expectedFee, 2);
        });
      });

      it('should handle micro-transactions correctly', () => {
        // Very small amounts should all use minimum fee
        const microAmounts = [0.01, 0.05, 0.10, 0.50, 1.00, 5.00, 9.99];
        
        microAmounts.forEach(amount => {
          expect(calcFeeUSD(amount)).toBe(0.01);
        });
      });

      it('should handle high-value transactions correctly', () => {
        // Large amounts should scale proportionally
        const highValueCases = [
          { amount: 100000, expectedFee: 100.00 },   // $100k * 0.10% = $100
          { amount: 1000000, expectedFee: 1000.00 }, // $1M * 0.10% = $1000
          { amount: 5000000, expectedFee: 5000.00 }  // $5M * 0.10% = $5000
        ];

        highValueCases.forEach(({ amount, expectedFee }) => {
          expect(calcFeeUSD(amount)).toBeCloseTo(expectedFee, 2);
        });
      });
    });

    describe('performance and reliability', () => {
      it('should handle repeated calls consistently', () => {
        const amount = 1234.56;
        const expectedFee = calcFeeUSD(amount);
        
        // Multiple calls should return the same result
        for (let i = 0; i < 100; i++) {
          expect(calcFeeUSD(amount)).toBe(expectedFee);
        }
      });

      it('should be fast for typical usage', () => {
        const startTime = Date.now();
        
        // Perform many calculations
        for (let i = 0; i < 10000; i++) {
          calcFeeUSD(Math.random() * 10000);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Should complete 10,000 calculations in reasonable time (< 100ms)
        expect(duration).toBeLessThan(100);
      });
    });
  });
});
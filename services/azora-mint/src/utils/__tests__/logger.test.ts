/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import fs from 'fs';
import path from 'path';
import { TransactionLogger } from '../logger';
import { AuditLogEntry } from '../../interfaces/Reward';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();

describe('TransactionLogger', () => {
  const mockLogDir = expect.stringContaining('logs');
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.existsSync.mockReturnValue(true);
    mockFs.mkdirSync.mockImplementation();
    mockFs.writeFileSync.mockImplementation();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleInfo.mockRestore();
  });

  describe('auditLog', () => {
    it('should write audit log entry to file', () => {
      const mockEntry: AuditLogEntry = {
        auditReportId: 'test-audit-123',
        status: 'SUCCESS',
        genesisTimestamp: '2025-01-01T00:00:00.000Z',
        serviceInitiator: 'azora-mint',
        destinationService: 'azora-covenant',
        rewardDetails: {
          userId: 'user123',
          economyId: 'economy456',
          rewardAmount: 100,
          sourceTransactionId: 'tx789'
        },
        complianceCheck: {
          kycStatus: 'verified',
          complianceLogId: 'compliance123',
          idempotencyCheck: true
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 1000,
          uboBalanceAfter: 900,
          transferExecuted: 100
        },
        auditCheckpoints: {
          validation: true,
          transfer: 'completed'
        }
      };

      TransactionLogger.auditLog(mockEntry);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('audit-test-audit-123.json'),
        JSON.stringify(mockEntry, null, 2)
      );
    });

    it('should create log directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const mockEntry: AuditLogEntry = {
        auditReportId: 'test-audit-456',
        status: 'FAILURE',
        genesisTimestamp: '2025-01-01T00:00:00.000Z',
        serviceInitiator: 'azora-mint',
        destinationService: 'azora-covenant',
        rewardDetails: {
          userId: 'user123',
          economyId: 'economy456',
          rewardAmount: 100,
          sourceTransactionId: 'tx789'
        },
        complianceCheck: {
          kycStatus: 'pending',
          complianceLogId: 'compliance456',
          idempotencyCheck: false
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 1000,
          uboBalanceAfter: 1000,
          transferExecuted: 0
        },
        auditCheckpoints: {}
      };

      TransactionLogger.auditLog(mockEntry);

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        mockLogDir,
        { recursive: true }
      );
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should not create directory if it already exists', () => {
      mockFs.existsSync.mockReturnValue(true);
      
      const mockEntry: AuditLogEntry = {
        auditReportId: 'test-audit-789',
        status: 'SUCCESS',
        genesisTimestamp: '2025-01-01T00:00:00.000Z',
        serviceInitiator: 'azora-mint',
        destinationService: 'azora-covenant',
        rewardDetails: {
          userId: 'user123',
          economyId: 'economy456',
          rewardAmount: 50,
          sourceTransactionId: 'tx101112'
        },
        complianceCheck: {
          kycStatus: 'verified',
          complianceLogId: 'compliance789',
          idempotencyCheck: true
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 500,
          uboBalanceAfter: 450,
          transferExecuted: 50
        },
        auditCheckpoints: {
          validation: true,
          compliance: 'passed'
        }
      };

      TransactionLogger.auditLog(mockEntry);

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('logAudit', () => {
    it('should create and log audit entry for successful transaction', () => {
      const transactionId = 'tx-success-123';
      const action = 'TRANSACTION_SUCCESS';
      const details = {
        rewardDetails: {
          userId: 'user456',
          economyId: 'economy789',
          rewardAmount: 200,
          sourceTransactionId: 'source-tx-456'
        },
        complianceCheck: {
          kycStatus: 'verified',
          complianceLogId: 'compliance-456',
          idempotencyCheck: true
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 2000,
          uboBalanceAfter: 1800,
          transferExecuted: 200
        },
        blockchainDetails: {
          hash: '0x123abc',
          block: 12345,
          signer: '0xsigner',
          covenantFunction: 'transferReward'
        },
        auditCheckpoints: {
          validation: true,
          blockchain: 'confirmed'
        }
      };

      TransactionLogger.logAudit(transactionId, action, details);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`audit-${transactionId}.json`),
        expect.stringContaining('"status": "SUCCESS"')
      );
    });

    it('should create and log audit entry for failed transaction', () => {
      const transactionId = 'tx-failure-456';
      const action = 'TRANSACTION_FAILURE';
      const details = {
        error: 'Insufficient funds',
        rewardDetails: {
          userId: 'user789',
          economyId: 'economy101',
          rewardAmount: 300,
          sourceTransactionId: 'source-tx-789'
        }
      };

      TransactionLogger.logAudit(transactionId, action, details);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`audit-${transactionId}.json`),
        expect.stringContaining('"status": "FAILURE"')
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('"errorDetails": "Insufficient funds"')
      );
    });

    it('should use default values when details are missing', () => {
      const transactionId = 'tx-minimal-789';
      const action = 'TRANSACTION_SUCCESS';
      const details = {};

      TransactionLogger.logAudit(transactionId, action, details);

      const expectedCall = mockFs.writeFileSync.mock.calls[0];
      const loggedData = JSON.parse(expectedCall[1] as string);

      expect(loggedData).toMatchObject({
        auditReportId: transactionId,
        status: 'SUCCESS',
        serviceInitiator: 'azora-mint',
        destinationService: 'azora-covenant',
        rewardDetails: {},
        complianceCheck: {
          kycStatus: 'unknown',
          complianceLogId: transactionId,
          idempotencyCheck: true
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 0,
          uboBalanceAfter: 0,
          transferExecuted: 0
        },
        auditCheckpoints: {}
      });
    });

    it('should include timestamp in ISO format', () => {
      const transactionId = 'tx-timestamp-test';
      const action = 'TRANSACTION_SUCCESS';
      const details = {};

      // Mock Date to return a specific timestamp
      const mockDate = new Date('2025-01-15T10:30:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      TransactionLogger.logAudit(transactionId, action, details);

      const expectedCall = mockFs.writeFileSync.mock.calls[0];
      const loggedData = JSON.parse(expectedCall[1] as string);

      expect(loggedData.genesisTimestamp).toBe('2025-01-15T10:30:00.000Z');

      // Restore Date
      (global.Date as any).mockRestore();
    });
  });

  describe('error', () => {
    it('should log error message to console', () => {
      const message = 'Test error message';
      const context = { userId: 'user123', transactionId: 'tx456' };

      TransactionLogger.error(message, context);

      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR] Test error message',
        context
      );
    });

    it('should log error message without context', () => {
      const message = 'Simple error message';

      TransactionLogger.error(message);

      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR] Simple error message',
        undefined
      );
    });
  });

  describe('warn', () => {
    it('should log warning message to console', () => {
      const message = 'Test warning message';
      const context = { retryCount: 3, maxRetries: 5 };

      TransactionLogger.warn(message, context);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[WARN] Test warning message',
        context
      );
    });

    it('should log warning message without context', () => {
      const message = 'Simple warning message';

      TransactionLogger.warn(message);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[WARN] Simple warning message',
        undefined
      );
    });
  });

  describe('info', () => {
    it('should log info message to console', () => {
      const message = 'Test info message';
      const context = { operation: 'reward_processing', status: 'completed' };

      TransactionLogger.info(message, context);

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        '[INFO] Test info message',
        context
      );
    });

    it('should log info message without context', () => {
      const message = 'Simple info message';

      TransactionLogger.info(message);

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        '[INFO] Simple info message',
        undefined
      );
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle special characters in audit report ID', () => {
      const specialId = 'audit-with-special-chars-@#$%';
      const mockEntry: AuditLogEntry = {
        auditReportId: specialId,
        status: 'SUCCESS',
        genesisTimestamp: '2025-01-01T00:00:00.000Z',
        serviceInitiator: 'azora-mint',
        destinationService: 'azora-covenant',
        rewardDetails: {
          userId: 'user123',
          economyId: 'economy456',
          rewardAmount: 100,
          sourceTransactionId: 'tx789'
        },
        complianceCheck: {
          kycStatus: 'verified',
          complianceLogId: 'compliance123',
          idempotencyCheck: true
        },
        fundStatusSnapshot: {
          uboBalanceBefore: 1000,
          uboBalanceAfter: 900,
          transferExecuted: 100
        },
        auditCheckpoints: {}
      };

      TransactionLogger.auditLog(mockEntry);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`audit-${specialId}.json`),
        expect.any(String)
      );
    });

    it('should handle empty audit checkpoints', () => {
      const transactionId = 'tx-empty-checkpoints';
      const action = 'TRANSACTION_SUCCESS';
      const details = {
        auditCheckpoints: {}
      };

      TransactionLogger.logAudit(transactionId, action, details);

      const expectedCall = mockFs.writeFileSync.mock.calls[0];
      const loggedData = JSON.parse(expectedCall[1] as string);

      expect(loggedData.auditCheckpoints).toEqual({});
    });

    it('should handle null/undefined error details', () => {
      const transactionId = 'tx-null-error';
      const action = 'TRANSACTION_FAILURE';
      const details = {
        error: null
      };

      TransactionLogger.logAudit(transactionId, action, details);

      const expectedCall = mockFs.writeFileSync.mock.calls[0];
      const loggedData = JSON.parse(expectedCall[1] as string);

      expect(loggedData.errorDetails).toBeNull();
    });
  });
});
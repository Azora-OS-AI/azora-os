// azora-mint/src/controllers/rewardController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { KnowledgeRewardRequest, RewardValidationResult, TransferResult } from '../interfaces/Reward.js';
import { TransactionLogger } from '../utils/logger.js';
import { AegisService } from '../services/aegis.js';
import { CovenantService } from '../services/covenant.js';

const prisma = new PrismaClient();

export async function processKnowledgeReward(req: Request, res: Response) {
    const request: KnowledgeRewardRequest = req.body;
    const transactionId = request.transactionId;

    try {
        // Step 1: Validate request structure
        const validation = await validateKnowledgeRewardRequest(request);
        if (!validation.isValid) {
            TransactionLogger.logAudit(transactionId, 'VALIDATION_FAILED', {
                reason: validation.reason,
                request: request
            });
            return res.status(400).json({ error: validation.reason });
        }

        // Step 2: Check idempotency (prevent duplicate processing)
        const existingReward = await prisma.knowledgeReward.findUnique({
            where: { sourceTrxId: transactionId }
        });
        if (existingReward) {
            TransactionLogger.logAudit(transactionId, 'DUPLICATE_TRANSACTION', {
                existingRewardId: existingReward.id
            });
            return res.status(409).json({ error: 'Transaction already processed' });
        }

        // Step 3: Verify signature and compliance with Aegis
        let complianceCheck: { isValid: boolean; reason?: string } = { isValid: true, reason: 'Development mode - Aegis not available' };
        try {
            complianceCheck = await AegisService.verifySignature(request);
        } catch (error) {
            console.warn('Aegis service not available, proceeding in development mode');
        }

        if (!complianceCheck.isValid) {
            TransactionLogger.logAudit(transactionId, 'COMPLIANCE_FAILED', {
                reason: complianceCheck.reason,
                request: request
            });
            return res.status(403).json({ error: 'Compliance check failed' });
        }

        // Step 4: Atomic database transaction
        const result: any = await prisma.$transaction(async (tx: any) => {
            // Check UBO fund balance (simplified for now)
            // const uboBalance = await CovenantService.getUBOBalance(request.economyId);
            // if (uboBalance < request.amount) {
            //     throw new Error('Insufficient UBO funds');
            // }

            // Create user if not exists
            const user = await tx.user.upsert({
                where: { azoraId: request.userId },
                update: {},
                create: {
                    azoraId: request.userId,
                    walletAddress: `0x${request.userId}`, // Placeholder
                    kycStatus: 'VERIFIED' // Assume verified for demo
                }
            });

            // Create or update user balance
            const userBalance = await tx.userBalance.upsert({
                where: {
                    userId_currencyCode: {
                        userId: user.id,
                        currencyCode: request.economyId
                    }
                },
                update: {
                    amount: { increment: request.amount }
                },
                create: {
                    userId: user.id,
                    currencyCode: request.economyId,
                    amount: request.amount
                }
            });

            // Record the knowledge reward
            const reward = await tx.knowledgeReward.create({
                data: {
                    userId: user.id,
                    rewardAmount: request.amount,
                    currencyCode: request.economyId,
                    sourceTrxId: transactionId,
                    achievement: `${request.knowledgeType}: ${request.knowledgeId}`,
                    status: 'COMPLETED',
                    processedAt: new Date()
                }
            });

            // Execute blockchain transfer (mock for now)
            const transferResult: TransferResult = {
                hash: `0x${Math.random().toString(36).substr(2, 9)}`,
                block: Math.floor(Math.random() * 1000000),
                signer: 'azora-covenant',
                covenantFunction: 'transferFromUBO'
            };

            return { user, userBalance, reward, transferResult };
        });

        // Step 5: Log successful transaction
        TransactionLogger.logAudit(transactionId, 'TRANSACTION_SUCCESS', {
            rewardId: result.reward.id,
            userBalance: result.userBalance.amount,
            transferHash: result.transferResult.hash,
            blockNumber: result.transferResult.block
        });

        // Step 6: Return success response
        res.json({
            success: true,
            transactionId,
            rewardId: result.reward.id,
            newBalance: result.userBalance.amount,
            transferHash: result.transferResult.hash,
            blockNumber: result.transferResult.block,
            processedAt: result.reward.processedAt
        });

    } catch (error) {
        // Log error and return failure
        TransactionLogger.logAudit(transactionId, 'TRANSACTION_FAILED', {
            error: (error as Error).message,
            request: request
        });

        console.error('Knowledge reward processing failed:', error);
        res.status(500).json({ error: 'Transaction processing failed' });
    }
}

async function validateKnowledgeRewardRequest(request: KnowledgeRewardRequest): Promise<RewardValidationResult> {
    if (!request.transactionId || !request.userId || !request.economyId ||
        !request.amount || !request.knowledgeType || !request.knowledgeId ||
        !request.signature) {
        return { isValid: false, reason: 'Missing required fields' };
    }

    if (request.amount <= 0) {
        return { isValid: false, reason: 'Amount must be positive' };
    }

    if (request.amount > 1000) { // Max reward limit
        return { isValid: false, reason: 'Amount exceeds maximum reward limit' };
    }

    // Validate knowledge type
    const validTypes = ['course_completion', 'assessment_pass', 'certification', 'contribution'];
    if (!validTypes.includes(request.knowledgeType)) {
        return { isValid: false, reason: 'Invalid knowledge type' };
    }

    return { isValid: true };
}
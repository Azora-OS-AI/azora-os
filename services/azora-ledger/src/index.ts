// index.ts
import express from 'express';
import ledgerService from './ledgerService.js';
import { PrismaClient } from '@prisma/client';

// Define UserRole enum locally if needed
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  // Add other roles as needed
}

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

// --- User/Auth Routes (Simplified) ---
// In a real app, 'req.userId' would come from a JWT or session middleware
app.post('/register', async (req, res) => {
  const { email, role } = req.body as { email: string, role: UserRole };
  try {
    const user = await ledgerService.createUser(email, role);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// --- Wallet Endpoints ---
app.get('/balance', async (req, res) => {
  // const userId = req.user.id; // From auth middleware
  const { userId } = req.query as { userId: string }; // Using query param for testing
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const balance = await ledgerService.getBalance(userId);
  res.json({ userId, azoraBalance: balance });
});

app.get('/history', async (req, res) => {
  // const userId = req.user.id; // From auth middleware
  const { userId } = req.query as { userId: string }; // Using query param for testing
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  
  const history = await ledgerService.getHistory(userId);
  res.json(history);
});

/**
 * Your "Instant Withdrawal" Endpoint
 * This is now fully ledger-backed.
 */
app.post('/withdraw', async (req, res) => {
  // const userId = req.user.id; // From auth middleware
  const { userId, amount } = req.body as { userId: string, amount: number };
  
  if (amount <= 0) {
    return res.status(400).json({ error: 'Withdrawal amount must be positive' });
  }

  try {
    const { transaction, newBalance } = await ledgerService.requestWithdrawal(userId, amount);
    // The payout is now processing in the background
    res.status(202).json({
      message: 'Withdrawal initiated. Payout is processing.',
      transactionId: transaction.id,
      status: transaction.status,
      newBalance,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// --- Admin & Webhook Routes (Must be protected!) ---

/**
 * Endpoint to be called by your payment provider (Stripe, etc.)
 * when a user successfully deposits $1.
 * This Mints 1 AZR.
 */
app.post('/webhooks/deposit-successful', async (req, res) => {
  // TODO: Verify webhook signature!
  const { userId, amountUsd, chargeId } = req.body;

  try {
    await ledgerService.mint(
      userId,
      amountUsd, // Assumes 1:1
      `Deposit from charge ${chargeId}`,
      chargeId
    );
    res.status(200).send({ received: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process minting webhook' });
  }
});

/**
 * Public Endpoint for Proof of Reserve
 * This builds trust by proving 1:1 backing.
 */
app.get('/proof-of-reserve', async (req, res) => {
  // 1. Get total supply of AZR from our ledger
  const supplyAggregation = await prisma.wallet.aggregate({
    _sum: {
      balance: true,
    },
  });
  const totalAzoraSupply = supplyAggregation._sum.balance || 0;

  // 2. Get real reserve balance
  // !! This is the crucial part !!
  // You must fetch this from your bank or crypto wallet API
  // For now, we can mock it from an .env variable
  const totalReserveHoldings = parseFloat(process.env.RESERVE_BALANCE_USD || '0.0');
  
  // Example: Fetching from a USDC wallet API (pseudocode)
  // const usdcBalance = await usdcWalletApi.getBalance(process.env.RESERVE_WALLET_ADDRESS);
  // const totalReserveHoldings = usdcBalance.amount;

  const isBacked = totalReserveHoldings >= totalAzoraSupply;
  
  res.json({
    totalAzoraSupply,
    totalReserveHoldings,
    status: isBacked ? 'FULLY_BACKED' : 'UNDER_COLLATERALIZED',
    discrepancy: totalReserveHoldings - totalAzoraSupply,
    lastChecked: new Date().toISOString(),
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Azora Ledger Server running on port ${PORT}`);
});
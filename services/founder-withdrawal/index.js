const tokenExchangeService = require('../token-exchange/index');
const azoraCoinService = require('../azora-coin-service/index');

class FounderWithdrawalService {
  withdraw(userId, azrAmount) {
    if (userId !== 'ceo') throw new Error('Unauthorized');
    if (azrAmount <= 0) throw new Error('Invalid withdrawal amount');
    const zarAmount = tokenExchangeService.exchangeAZRtoZAR(userId, azrAmount, azoraCoinService);
    // Simulate payout integration
    console.log(`[PAYOUT] Initiating ZAR payout of ${zarAmount} to ${userId}`);
    return { userId, azrAmount, zarAmount, status: 'payout_initiated' };
  }
}
module.exports = new FounderWithdrawalService();

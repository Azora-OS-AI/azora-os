const valuationService = require('./valuation-service');

class TokenExchangeService {
  async exchangeAzrToZar(azrAmount) {
    const zarAmount = await valuationService.calculateWithdrawal(azrAmount);
    // Simulate transfer
    return { zarReceived: zarAmount };
  }

  async instantWithdrawal(azrAmount, bankDetails) {
    const zarAmount = await valuationService.calculateWithdrawal(azrAmount);
    // Integrate Paystack
    return { payout: zarAmount };
  }
}

module.exports = new TokenExchangeService();

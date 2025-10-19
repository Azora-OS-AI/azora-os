const Web3 = require('web3');

class ValuationService {
  constructor() {
    this.azrValue = 1; // $1 per AZR
  }

  async setValuation(azrAmount) {
    const usdValue = azrAmount * this.azrValue;
    const zarValue = usdValue * 18;
    return { azr: azrAmount, usd: usdValue, zar: zarValue };
  }

  async calculateWithdrawal(amount) {
    const valuation = await this.setValuation(amount);
    return valuation.zar;
  }
}

module.exports = new ValuationService();

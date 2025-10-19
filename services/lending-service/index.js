const AzoraPayService = require('../azora-pay-service/index');

class LendingService {
  async depositCollateral(userAddress, amount) {
    // Check if user has enough AZR
    const balance = await AzoraPayService.getBalance(userAddress);
    if (balance < amount) return { error: 'Insufficient AZR balance' };
    return await AzoraPayService.callContract('depositCollateral', [amount], userAddress);
  }

  async withdrawCollateral(userAddress, amount) {
    const collateral = await AzoraPayService.callContract('collateralBalance', [userAddress]);
    if (collateral < amount) return { error: 'Insufficient collateral' };
    return await AzoraPayService.callContract('withdrawCollateral', [amount], userAddress);
  }

  async approveLoan(userAddress, amount) {
    // Check credit score or collateral via external API (placeholder)
    const collateralRatio = await AzoraPayService.callContract('calculateCollateralRatio', [userAddress]);
    if (collateralRatio < 150) return { error: 'Insufficient collateral ratio' };
    return await AzoraPayService.callContract('mintLoan', [amount], userAddress);
  }

  async repayLoan(userAddress, amount) {
    const loan = await AzoraPayService.callContract('getLoanDetails', [userAddress]);
    if (!loan.active) return { error: 'No active loan' };
    return await AzoraPayService.callContract('repayLoan', [amount], userAddress);
  }

  async getLoanStatus(userAddress) {
    return await AzoraPayService.callContract('getLoanDetails', [userAddress]);
  }

  async liquidateLoan(userAddress) {
    // Only owner can call, but service can trigger
    return await AzoraPayService.callContract('liquidateLoan', [userAddress]);
  }
}

module.exports = new LendingService();
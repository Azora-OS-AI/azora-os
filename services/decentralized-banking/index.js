const ethers = require('ethers');

class DecentralizedBanking {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
    this.aavePoolAddress = process.env.AAVE_POOL_ADDRESS || '0x87870Bcd...'; // Ethereum Aave v3 Pool
    this.aavePoolAbi = [/* Aave Pool ABI */]; // Full ABI needed
  }

  async depositToPool(tokenAddress, amount) {
    const pool = new ethers.Contract(this.aavePoolAddress, this.aavePoolAbi, this.signer);
    try {
      const tx = await pool.supply(tokenAddress, amount, this.signer.address, 0);
      await tx.wait();
      return { status: 'Deposited', amount, txHash: tx.hash };
    } catch (err) {
      return { error: err.message };
    }
  }

  async borrowFromPool(tokenAddress, amount, interestRateMode = 1) { // 1 for stable, 2 for variable
    const pool = new ethers.Contract(this.aavePoolAddress, this.aavePoolAbi, this.signer);
    try {
      const tx = await pool.borrow(tokenAddress, amount, interestRateMode, 0, this.signer.address);
      await tx.wait();
      return { status: 'Borrowed', amount, txHash: tx.hash };
    } catch (err) {
      return { error: err.message };
    }
  }

  async repayLoan(tokenAddress, amount) {
    const pool = new ethers.Contract(this.aavePoolAddress, this.aavePoolAbi, this.signer);
    try {
      const tx = await pool.repay(tokenAddress, amount, 1, this.signer.address);
      await tx.wait();
      return { status: 'Repaid', amount, txHash: tx.hash };
    } catch (err) {
      return { error: err.message };
    }
  }

  async getUserAccountData(userAddress) {
    const pool = new ethers.Contract(this.aavePoolAddress, this.aavePoolAbi, this.provider);
    try {
      const data = await pool.getUserAccountData(userAddress);
      return {
        totalCollateralBase: data.totalCollateralBase.toString(),
        totalDebtBase: data.totalDebtBase.toString(),
        availableBorrowsBase: data.availableBorrowsBase.toString(),
        currentLiquidationThreshold: data.currentLiquidationThreshold.toString(),
        ltv: data.ltv.toString(),
        healthFactor: data.healthFactor.toString()
      };
    } catch (err) {
      return { error: err.message };
    }
  }

  async withdrawFromPool(tokenAddress, amount) {
    const pool = new ethers.Contract(this.aavePoolAddress, this.aavePoolAbi, this.signer);
    try {
      const tx = await pool.withdraw(tokenAddress, amount, this.signer.address);
      await tx.wait();
      return { status: 'Withdrawn', amount, txHash: tx.hash };
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = new DecentralizedBanking();
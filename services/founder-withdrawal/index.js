const axios = (() => {
  try { return require('axios'); } catch { return null; }
})();

let Web3;
try { Web3 = require('web3'); } catch { Web3 = null; }

const fs = require('fs');
const path = require('path');

class FounderWithdrawalService {
  constructor() {
    this.blockchainRpc = process.env.BLOCKCHAIN_RPC || null;
    this.paystackSecret = process.env.PAYSTACK_SECRET_KEY || null;
    this.azrAddress = process.env.AZR_CONTRACT_ADDRESS || null;
    this.ceoAddress = process.env.CEO_ADDRESS || null;

    this.simulation = !Web3 || !this.blockchainRpc || !this.azrAddress || !this.ceoAddress;
    if (!this.simulation) {
      this.web3 = new Web3(this.blockchainRpc);
      // try common Hardhat/Truffle artifact locations for ABI
      const tryPaths = [
        path.join(__dirname, '..', '..', 'artifacts', 'contracts', 'AZR.sol', 'AZR.json'),
        path.join(__dirname, '..', '..', 'artifacts', 'build-info'),
        path.join(__dirname, '..', '..', 'build', 'contracts', 'AZR.json'),
      ];
      this.azrAbi = null;
      for (const p of tryPaths) {
        try {
          if (fs.existsSync(p)) {
            const json = require(p);
            if (json && (json.abi || (json.output && json.output.abi))) {
              this.azrAbi = json.abi || json.output.abi;
              break;
            }
          }
        } catch (e) { /* continue */ }
      }
      if (!this.azrAbi) this.simulation = true;
    }

    // in-memory balances for simulation/testing
    this._balances = {};
    if (!this._balances[this.ceoAddress]) this._balances[this.ceoAddress] = 0;
  }

  async mintAsCEO(amount) {
    if (this.simulation) {
      // simulated mint (useful for local/dev)
      this._balances[this.ceoAddress] = (this._balances[this.ceoAddress] || 0) + Number(amount);
      return { simulated: true, minted: Number(amount), balance: this._balances[this.ceoAddress] };
    }

    const contract = new this.web3.eth.Contract(this.azrAbi, this.azrAddress);
    const tx = await contract.methods.mint(this.ceoAddress, amount).send({ from: this.ceoAddress });
    return { txHash: tx.transactionHash, minted: amount };
  }

  async instantWithdrawToAccount(amount, bankDetails) {
    if (!this.paystackSecret || !axios) {
      // fallback: simulate payout
      const zarAmount = Number(amount) * 18;
      return { simulated: true, zarAmount, note: 'Paystack or axios not configured' };
    }

    const zarAmount = Number(amount) * 18;
    try {
      const res = await axios.post('https://api.paystack.co/transfer', {
        source: 'balance',
        amount: Math.round(zarAmount * 100),
        recipient: bankDetails.recipientCode,
        reason: 'CEO Withdrawal'
      }, {
        headers: { Authorization: `Bearer ${this.paystackSecret}` }
      });
      return { transferCode: res.data.data.transfer_code, zarAmount };
    } catch (err) {
      const msg = err?.response?.data || err.message || String(err);
      throw new Error(`Paystack transfer failed: ${JSON.stringify(msg)}`);
    }
  }

  async checkBalance() {
    if (this.simulation) {
      return this._balances[this.ceoAddress] || 0;
    }
    const contract = new this.web3.eth.Contract(this.azrAbi, this.azrAddress);
    return await contract.methods.balanceOf(this.ceoAddress).call();
  }
}

module.exports = new FounderWithdrawalService();

const Web3 = require('web3');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

class AzoraPayService {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_RPC);
    this.azrAbi = JSON.parse(fs.readFileSync(path.join(__dirname, '../../artifacts/contracts/AZR.sol/AZR.json'))).abi;
    this.azrAddress = process.env.AZR_CONTRACT_ADDRESS;
    this.ceoAddress = process.env.CEO_ADDRESS;
    this.privateKey = process.env.PRIVATE_KEY;
    this.lunoApiKey = process.env.LUNO_API_KEY;
    this.lunoApiSecret = process.env.LUNO_API_SECRET || '';
    this.lunoAccountId = process.env.LUNO_ACCOUNT_ID;
    this.paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    this.paystackRecipient = process.env.PAYSTACK_RECIPIENT_CODE;
  }

  async mintAZR(to, amount) {
    try {
      const contract = new this.web3.eth.Contract(this.azrAbi, this.azrAddress);
      const tx = contract.methods.mint(to, amount);
      const gas = await tx.estimateGas({ from: this.ceoAddress });
      const data = tx.encodeABI();
      const txData = {
        to: this.azrAddress,
        data,
        gas,
      };
      const signedTx = await this.web3.eth.accounts.signTransaction(txData, this.privateKey);
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      return { txHash: receipt.transactionHash, minted: amount, status: 'success' };
    } catch (err) {
      return { error: err.message, status: 'failed' };
    }
  }

  async withdrawZAR(zarAmount, reason = 'Azora Pay Withdrawal') {
    try {
      const response = await axios.post('https://api.paystack.co/transfer', {
        source: 'balance',
        amount: Math.round(zarAmount * 100),
        recipient: this.paystackRecipient,
        reason
      }, {
        headers: { Authorization: `Bearer ${this.paystackSecret}` }
      });
      return {
        transferCode: response.data.data.transfer_code,
        status: response.data.data.status,
        zarAmount
      };
    } catch (err) {
      return { error: err.response?.data || err.message, status: 'failed' };
    }
  }

  async withdrawToLuno(zarAmount) {
    const timestamp = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = '/api/1/withdrawals';
    const body = {
      type: 'ZAR_EFT',
      amount: zarAmount.toString(),
      beneficiary_id: process.env.LUNO_BENEFICIARY_ID
    };
    const bodyString = JSON.stringify(body);
    const message = timestamp + method + path + bodyString;
    const signature = crypto.createHmac('sha256', process.env.LUNO_API_SECRET).update(message).digest('hex');

    try {
      const response = await axios.post('https://api.luno.com' + path, body, {
        headers: {
          'Authorization': `LUNO-API-KEY ${process.env.LUNO_API_KEY}`,
          'LUNO-TIMESTAMP': timestamp.toString(),
          'LUNO-SIGNATURE': signature,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }

  async getAZRBalance(address) {
    try {
      const contract = new this.web3.eth.Contract(this.azrAbi, this.azrAddress);
      const balance = await contract.methods.balanceOf(address).call();
      return { balance: parseInt(balance) };
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = new AzoraPayService();
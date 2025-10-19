import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Web3 from 'web3';

class AzoraPayService {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_RPC);
    const abiPath = path.join(path.resolve(), 'artifacts/contracts/AZR.sol/AZR.json');
    const abiJson = JSON.parse(fs.readFileSync(abiPath));
    this.azrAbi = abiJson.abi;
    this.azrAddress = process.env.AZR_CONTRACT_ADDRESS;
    this.ceoAddress = process.env.CEO_ADDRESS;
    this.privateKey = process.env.PRIVATE_KEY;
    this.lunoApiKey = process.env.LUNO_API_KEY;
    this.lunoApiSecret = process.env.LUNO_API_SECRET || ''; // If needed
    this.lunoAccountId = process.env.LUNO_ACCOUNT_ID;
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
    try {
      const response = await axios.post(
        'https://api.luno.com/api/1/withdrawals',
        {
          type: 'ZAR_EFT',
          amount: zarAmount,
          account_id: this.lunoAccountId
        },
        {
          auth: {
            username: this.lunoApiKey,
            password: this.lunoApiSecret
          }
        }
      );
      return response.data;
    } catch (err) {
      return { error: err.response?.data || err.message };
    }
  }

  async getAZRBalance(address) {
    try {
      const contract = new this.web3.eth.Contract(this.azrAbi, this.azrAddress);
      const balance = await contract.methods.balanceOf(address).call();
      return { balance: Number(balance) };
    } catch (err) {
      return { error: err.message };
    }
  }
}

export default new AzoraPayService();
const Web3 = require('web3');
const AZR_ABI = require('../../contracts/AZR.sol'); // Replace with actual ABI import

class AzoraCoinService {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_RPC);
    this.contract = new this.web3.eth.Contract(AZR_ABI, process.env.AZR_CONTRACT_ADDRESS);
    this.balances = {};
  }
  mint(userId, amount) {
    if (!this.balances[userId]) this.balances[userId] = 0;
    this.balances[userId] += amount;
    return this.balances[userId];
  }
  getBalance(userId) {
    return this.balances[userId] || 0;
  }
  async mintOnChain(to, amount) {
    return await this.contract.methods.mint(to, amount).send({ from: process.env.MINTER_ADDRESS });
  }
  async balanceOf(address) {
    return await this.contract.methods.balanceOf(address).call();
  }
  async transfer(from, to, amount) {
    return await this.contract.methods.transfer(to, amount).send({ from });
  }
}
module.exports = new AzoraCoinService();

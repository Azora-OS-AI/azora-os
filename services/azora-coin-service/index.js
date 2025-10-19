const Web3 = require('web3');
const azrContract = require('../contracts/AZR.sol');

class AzoraCoinService {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_RPC);
    this.contract = new this.web3.eth.Contract(azrContract.abi, process.env.AZR_CONTRACT_ADDRESS);
  }

  async mint(to, amount) {
    const tx = await this.contract.methods.mint(to, amount).send({ from: process.env.MINTER_ADDRESS });
    return tx.transactionHash;
  }

  async balanceOf(address) {
    return await this.contract.methods.balanceOf(address).call();
  }

  async transfer(from, to, amount) {
    const tx = await this.contract.methods.transfer(to, amount).send({ from: from });
    return tx.transactionHash;
  }
}

module.exports = new AzoraCoinService();

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    mainnet: {
      url: process.env.BLOCKCHAIN_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
import "@nomiclabs/hardhat-waffle";
import 'dotenv/config';

export default {
  solidity: "0.8.19",
  networks: {
    mainnet: {
      url: process.env.BLOCKCHAIN_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
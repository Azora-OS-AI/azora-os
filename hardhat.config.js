import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

export default {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      url: process.env.BLOCKCHAIN_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
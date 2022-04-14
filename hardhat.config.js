/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "testnet",
   networks: {
      hardhat: {},
      testnet: {
         url: "https://data-seed-prebsc-1-s1.binance.org:8545",
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
};

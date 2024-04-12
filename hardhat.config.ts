import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "./tasks/erc20Task"
import "./tasks/erc721Task"


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    ethmainnet: {
      url: "https://mainnet.infura.io",
      chainId: 1
    },
    ethtestnet: {
      url: "https://ropsten.infura.io",
      chainId: 3
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      // accounts: ["db76693384544a9426000651b426cff9be9919656ce5394774816c767e03b845"]
    },
  }
};

export default config;

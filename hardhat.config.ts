import { HardhatUserConfig } from "hardhat/config";
import { NetworksUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "./tasks/erc20Task"
import "./tasks/erc721Task"
import "./tasks/commonTask"
import "./tasks/localTask"
import { ethers } from "ethers";
import { readEnv } from "./src/lib/utils";
// import "hardhat/console.sol";

const { using_private_key, mnemonic, api_key } = readEnv();

function getTestAccount() {
  const res: Array<any> = [];
  const accountBalance = "10000000000000000000000"
  for (let index = 0; index < 10; index++) {
    const indexPath = `m/44'/60'/0'/0/${index}`
    const tmpAccount = ethers.HDNodeWallet.fromPhrase(mnemonic ?? "", "", indexPath);

    // console.log(`>>>publicKey: ${tmpAccount.address}\n   privateKey: ${tmpAccount.privateKey} \n`)
    res.push({ privateKey: tmpAccount.privateKey, balance: accountBalance })
  }
  return res

}

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
    // hardhat: {
    //   chainId: 1337,
    //   initialBaseFeePerGas: 0,
    //   accounts: getTestAccount()
    // },

    // hardhat: {
    //   forking: {
    //     url: `https://mainnet.infura.io/v3/${api_key}`,
    //     // url: `https://sepolia.infura.io/v3/${api_key}`,
    //     blockNumber: 19892109,
    //     // blockNumber: 5923477,
    //   },
    //   chainId: 31337,
    //   // gas: "auto"
    //   // gas: 8816657843000
    // },

    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    },

    // gethnet: {
    //   url: "http://127.0.0.1:8545",
    //   chainId: 1337,
    //   accounts: {
    //     mnemonic: "safe theory grace assume whisper custom void bamboo wrestle already you acquire" // 替换为您的助记词，用于解锁账户
    //   }
    // },
    ethmainnet: {
      // url: "https://mainnet.infura.io",
      url: "https://mainnet.infura.io/v3/b08ad6dc32664933b42f27ff376d7767",
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
      // url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      url: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
      chainId: 97,
      gas: 30000
      // accounts: ["db76693384544a9426000651b426cff9be9919656ce5394774816c767e03b845"]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${api_key}`,
      // url: "https://api.zan.top/node/v1/eth/sepolia/public",
      chainId: 11155111,
      // accounts: ["db76693384544a9426000651b426cff9be9919656ce5394774816c767e03b845"]
    }
  },
};


export default config;


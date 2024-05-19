import { task, types, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';

import "@nomicfoundation/hardhat-ethers";
import * as erc20Abi from "../src/abis/erc20-abi.json"

import { fromPrivateKey, readEnv, getContractInstance } from "../src/lib/utils";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";

const accountTask = task("account", "show account address of private key")
accountTask.addOptionalParam("private", "private_key")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        console.log(`>>> run in testmn`);
        const { wallet, address } = fromPrivateKey(args.private, hre);
        console.log();
        console.log(`>>> account address of private is: ${address}`);
    })

const mnemonicTask = task("mnemonic", "generate mnemonic or take a look at nth public/private key of account")
mnemonicTask.addOptionalParam("index", "undefine: generate mnemonic, 0: first account, 1: sedcond account ...")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const index = args.index;

        const { mnemonic } = readEnv();
        if (index === undefined) {
            const wallet = hre.ethers.Wallet.createRandom();
            console.log(`====== generate mnemonic string ======`);
            console.log("new generate mnemonic string is:", wallet.mnemonic?.phrase);
        } else {
            console.log(`====== take a look at nth public/private key of account ======`);
            const password = "";
            const indexPath = `m/44'/60'/0'/0/${index}`
            const tmpAccount = hre.ethers.HDNodeWallet.fromPhrase(mnemonic ?? "", password, indexPath);
            let i = parseInt(index);
            console.log(` Public key of ${i + 1}th account is:`, tmpAccount.address);
            console.log(`Private key of ${i + 1}th account is:`, tmpAccount.privateKey);
        }
    })



// todo
// ERC20 interface:
// approve(address _spender, uint256 _value) public returns (bool success)
// allowance(address _owner, address _spender) public view returns (uint256 remaining)
// Transfer(address indexed _from, address indexed _to, uint256 _value)
// Approval(address indexed _owner, address indexed _spender, uint256 _value)

const transferTask = task("transfererc20", "eg: mmc transfererc20 --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --amount 5 --token 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 --network localhost");
transferTask.addParam("to", "to address")
    .addParam("amount", "to_amount")
    .addOptionalParam("token", "erc20 token address")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        console.log(`>>> run in ${transferTask.name}`, 112, args.token);
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        const toAddress = args.to;
        const amountNum = args.amount;

        console.log(`>>> token address 1111 ->`, args.token)

        const tokenAddress = args.token
        console.log(`>>> token address 2222 ->`);
        const contract = await new hre.ethers.Contract(tokenAddress, erc20Abi.abi, fromWallet);
        const tx1 = await contract.transfer(toAddress, amountNum);
        console.log(">>> txERC20 --> ", tx1);
    });

const balanceOfTask = task("balanceerc20", "eg: mmc balance --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --token 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 --network localhost");
balanceOfTask.addParam("from", "specific address to check amount of ETH balance or ERC20 Token balance")
    .addOptionalParam("token", "erc20 token address")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        console.log(`>>> run in ${balanceOfTask.name}`, 113, args.token);
        const { private_keys } = readEnv();

        const { using_private_key } = readEnv();
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);
        const fa = args.from;
        const tokenAddress = args.token

        if (args.token !== undefined) {
            // erc20
            console.log(`>>> === erc20 balance ===`)
            const contract = new hre.ethers.Contract(tokenAddress, erc20Abi.abi, fromWallet);
            const erc20TokenAmount = await contract.balanceOf(fa);
            console.log(`>>> address: ${args.from}, erc20 token amount: ${erc20TokenAmount} Wei, ${hre.ethers.formatEther(erc20TokenAmount)}`);
        }
    });

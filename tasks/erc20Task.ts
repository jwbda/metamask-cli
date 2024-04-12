import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';

import "@nomicfoundation/hardhat-ethers";
import * as erc20Abi from "../src/abis/erc20-abi.json"
import fs from 'fs';
import { fromPrivateKey, readEnv, getContractInstance} from "../src/lib/utils";

const accountTask = task("account", "show account address of private key")
accountTask.addOptionalParam("private", "private_key")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        console.log(`>>> run in testmn`)
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

async function getBalance(addr: string, hre: HardhatRuntimeEnvironment) {
    return hre.ethers.formatEther(await hre.ethers.provider.getBalance(addr));
}

// todo
// ERC20 interface:
// approve(address _spender, uint256 _value) public returns (bool success)
// allowance(address _owner, address _spender) public view returns (uint256 remaining)
// Transfer(address indexed _from, address indexed _to, uint256 _value)
// Approval(address indexed _owner, address indexed _spender, uint256 _value)

const transferTask = task("transfererc20", "eg: mmc transfer --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --amount 5 --network localhost;\n                            mmc transfer --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --amount 5 --token 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 --network localhost");
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
        if (args.token !== undefined) {
            const tokenAddress = args.token
            console.log(`>>> token address 2222 ->`);
            // // 调用合约的transfer方法
            const contract = await new hre.ethers.Contract(tokenAddress, erc20Abi.abi, fromWallet);

            const tx1 = await contract.transfer(toAddress, amountNum);
            console.log(">>> txERC20 --> ", tx1);
            // const receipt1 = await fromWallet.getTransactionReceipt(tx1.hash);
            // const gasUsed1 = receipt1.gasUsed.toString();
            // console.log(">>> gasUsed1 -->", gasUsed1);

        } else {
            // @ts-ignore
            console.log(`====== before ${transferTask.name}: ======`);
            console.log(`>>> fromAddress:   ${fromAddress}; balance --> ${await getBalance(fromAddress, hre)} ETH`);
            console.log(`>>>   toAddress:   ${toAddress}; balance --> ${await getBalance(toAddress, hre)} ETH`);
            console.log(`fromAddress -> `, fromAddress);
            // console.log(`toAddress -> `, toAddress);
            const amount = hre.ethers.parseEther(amountNum);
            const txReq = {
                to: toAddress,
                value: amount
            }
            const txRes = await fromWallet.sendTransaction(txReq)
            await txRes.wait();
            // @ts-ignore
            console.log(`====== after ${transferTask.name}: ======`);
            console.log(`>>> fromAddress:   ${fromAddress}; balance --> ${await getBalance(fromAddress, hre)} ETH`);
            console.log(`>>>   toAddress:   ${toAddress}; balance --> ${await getBalance(toAddress, hre)} ETH`);
        }
    });

const setaccountTask = task("setaccount", "configure to use USING_PRIVATE_KEY of account")
setaccountTask
    .addOptionalParam("private", "nth account, 0: first account, 1: sedcond account")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        console.log(`>>> run in setaccount task`)

        const filePath = '.env';
        const keyToModify = 'USING_PRIVATE_KEY';
        const newValue = `${args.private}`;

        try {
            // 读取.env文件内容
            let data = fs.readFileSync(filePath, 'utf8');

            // 使用正则表达式替换键值对的值
            const regex = new RegExp(`${keyToModify}=(.*)`, 'g');
            data = data.replace(regex, `${keyToModify}=${newValue}`);

            // 将修改后的内容写回到.env文件
            fs.writeFileSync(filePath, data);

            console.log(`Successfully updated ${keyToModify} in ${filePath}`);
        } catch (error: any) {
            console.error(`Error updating ${keyToModify} in ${filePath}: ${error.message}`);
        }
    })

const balanceOfTask = task("balance", "eg: mmc balance --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --network localhost;\n                            mmc balance --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --token 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 --network localhost");
balanceOfTask.addParam("from", "specific address to check amount of ETH balance or ERC20 Token balance")
    .addOptionalParam("token", "erc20 token address")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        console.log(`>>> run in ${balanceOfTask.name}`, 112, args.token);
        const { private_keys } = readEnv();

        const { using_private_key } = readEnv();
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        if (args.token !== undefined) {
            // erc20
            const tokenAddress = args.token
            const contract = new hre.ethers.Contract(tokenAddress, erc20Abi.abi, fromWallet);
            const erc20TokenAmount = await contract.balanceOf(fromAddress);
            console.log(`>>> address: ${args.from}, erc20 token amount: ${hre.ethers.formatEther(erc20TokenAmount)}`);

        } else {
            // eth
            console.log(`>>> 222222222`)
            const fromBalance = await fromWallet.provider?.getBalance(fromAddress) ?? 0;
            console.log(`>>> fromBalance -> ${hre.ethers.formatEther(fromBalance)} ETH`);
        }
    });

task("contractapi", "eg: call contract api")
    .addParam("cn", "contractname")
    .addParam("ca", "contractAddress")
    .addParam("methodname", "methodname")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        console.log(`>>> run in contractapi`);
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        const contractName = args.cn;
        const contractAddress = args.ca;
        const methodname = args.methodname;

        const contractInstance = await getContractInstance(contractAddress, contractName, hre, fromWallet);
        const res = await contractInstance[methodname]();
        console.log(">>> res --> ", res); 
    })


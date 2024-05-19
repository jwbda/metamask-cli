import { task, types, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';
import { fromPrivateKey, getBalance, getContractInstance, getUsingAccount, readEnv, } from "../src/lib/utils";
import { Bytecode } from "hardhat/internal/hardhat-network/stack-traces/model";
import fs from 'fs';
import { ContractEventPayload, ContractTransactionResponse } from 'ethers';


export function dealValueField(valueStr: string, hre: HardhatRuntimeEnvironment) {
    const v = valueStr.split(":")[1]
    const valueInt = hre.ethers.parseEther(v)
    return valueInt;
}

export function dealContractMethodArgs(tmpMethodArgs: string, hre: HardhatRuntimeEnvironment): Array<string | bigint | { value: bigint } | undefined> {
    return tmpMethodArgs.split(",")
        .filter(item => item !== "")
        .map((item: string) => {
            if (item.startsWith("ERC20")) {
                return hre.ethers.parseEther(item.split("=")[1])
            } else if (item.startsWith("USDT")) {
                return hre.ethers.parseUnits(item.split("=")[1], 6)
            } else {
                return item;
            }
        })
}

export function dealAllArgs(tmpMethodArgs: string | undefined, hre: HardhatRuntimeEnvironment): (string | bigint | { value: bigint; } | undefined)[] {
    let methodArgs: Array<string | bigint | { value: bigint } | undefined> = [];
    let argsPart;
    tmpMethodArgs = tmpMethodArgs === undefined ? "" : tmpMethodArgs
    // console.log(`>>> tmpMethodArgs ->`, tmpMethodArgs);
    if (tmpMethodArgs.includes("value:")) {
        if (tmpMethodArgs.startsWith("value")) {
            const valueInt = dealValueField(tmpMethodArgs, hre)
            methodArgs.push({ value: valueInt })
        } else {
            const lastIndex = tmpMethodArgs.lastIndexOf(",")
            argsPart = tmpMethodArgs.substring(0, lastIndex);
            const valueInt = dealValueField(tmpMethodArgs.substring(lastIndex + 1), hre)

            methodArgs = dealContractMethodArgs(argsPart, hre)
            methodArgs.push({ value: valueInt })
        }
    } else {
        methodArgs = dealContractMethodArgs(tmpMethodArgs, hre)

    }
    return methodArgs
}

task("pre_action", "set money to private key")
    .setAction(async (args, hre) => {
        console.log(">>> run in metamask-cli node");

        // await runSuper();
        console.log(">>> run in metamask-cli node 111111");
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: toWallet, address: toAddress } = fromPrivateKey(using_private_key, hre);
        // 判断是否是localhost网络
        if (hre.network.name === 'localhost') {
            // 然后从 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 钱包中转账 500ETH 到 using_private_key
            const { wallet: fromWallet, address: fromAddress } = fromPrivateKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", hre);
            const txReq = {
                to: toAddress,
                value: hre.ethers.parseEther("500")
            }
            const tx = await fromWallet.sendTransaction(txReq);
            await tx.wait();
        }
    })

task("testtest", "testtest")
    .addOptionalParam("from", "fromAddress")
    .addOptionalParam("to", "toAddress")
    .addOptionalParam("value", "value number")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        console.log(">>> run in testtest");
        const fromAddr = args.from;
        const toAddr = args.to;
        const value = args.value;

        const str = 'Hello, World!';
        const inputDataByteStr = hre.ethers.encodeBytes32String(str);

        const txReq = {
            from: fromAddr,
            to: toAddr,
            value: hre.ethers.parseEther(value),
            // customData: "yyyttt" // 单纯的转账， customData 不会显示在区块浏览器上
            // Input Data
            data: inputDataByteStr
        }
        const tx = await fromWallet.sendTransaction(txReq);
        await tx.wait();
    })

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



task("deploycontract", "deploycontract; mmc deploycontract --cn Mmc --args 'xxx,yyy,USDT=6,ERC20=4,value:67' --network localhost")
    .addOptionalParam("cn", "contractName")
    .addOptionalParam("args", "optional, contract arguments")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);
        const contractName = args.cn;
        const tmpMethodArgs = args.args;
        // console.log(`>>> run in deploycontract`, contractName, tmpMethodArgs);

        const artifact = await hre.artifacts.readArtifact(contractName);

        const C = await hre.ethers.getContractFactory(artifact.abi, artifact.bytecode, fromWallet);
        // console.log(`>>> run in deploycontract 222222`);
        const allArgs = dealAllArgs(tmpMethodArgs, hre);
        // console.log(">>> allArgs ->", allArgs);
        const c = await C.deploy(...allArgs);
        await c.waitForDeployment();
        // const contractAddress = await c.getAddress();
        // console.log(">>> deploy contract address->", contractAddress);
        return c;
    })


/**
* Dynamic call method name. If contract need ETH, send ETH by other method.
*/
task("contractapi", "eg: call contract api; mmc contractapi --cn TestAll --ca 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --mn withdraw --args 'xxx,yyy,USDT=6,ERC20=4,value:67' --network localhost;        mmc contractapi --cn FlashLoan --ca 0x97186594dA62AF0FCdf266E9eAc4736dcA6E6EAE --mn deposit --args 'xxx,yyy,USDT=6,ERC20=4,value:67' --network localhost;")
    .addParam("cn", "contractname")
    .addParam("ca", "contractAddress")
    .addParam("mn", "methodname")
    .addOptionalParam("args", "list args 0f method")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        // console.log(`>>> run in contractapi`);
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        const contractName = args.cn;
        const contractAddress = args.ca;
        const methodName = args.mn;
        const tmpMethodArgs: string = args.args;
        console.log(`>>> before run: \ncontractName: ${contractName}, contract address: ${contractAddress}, methodName: ${methodName}, args of method: ${tmpMethodArgs}`);

        const methodArgs = dealAllArgs(tmpMethodArgs, hre)
        const contractInstance = await getContractInstance(contractAddress, contractName, hre, fromWallet);
        contractInstance.on("*", (event: ContractEventPayload) => {
            console.log(`Triggered events -> ${event.eventName}, ${event.log.address}, ${event.args}`);
        })

        const res = await contractInstance[methodName](...methodArgs)
        if (res instanceof ContractTransactionResponse) {
            if ((await hre.ethers.provider.getTransactionReceipt(res.hash))?.status) {
                await res.wait();
                // console.log(`>>> call ${methodName} method successed; res ->`, res);
            }
        }
        else {
            console.log(`>>> call ${methodName} Attr successed; res ->`, res, typeof res);
        }
        return res
    })

const tt = task("transfer", "eg: mmc transfer --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --amount 5 --network localhost;")
    .addParam("to", "to address")
    .addParam("amount", "to_amount")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const { using_private_key } = readEnv();
        const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(using_private_key, hre);

        const toAddress = args.to;
        const amountNum = args.amount;

        // @ts-ignore
        console.log(`====== before ${tt.name}: ======`);
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
    });

const balanceOfTask = task("balance", "eg: mmc balance --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --network localhost;\n                            mmc balance --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --token 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 --network localhost");
balanceOfTask.addParam("from", "specific address to check amount of ETH balance or ERC20 Token balance")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        // @ts-ignore
        console.log(`>>> run in ${balanceOfTask.name}`);
        const fa = args.from;

        const balance = await hre.ethers.provider.getBalance(fa);
        const res = `${hre.ethers.formatEther(balance)}`;
        console.log(`ETH balance of ${fa} is: ${balance} Wei,= ${res} ETH`);
        return balance;
    });

export function contractapi(contractName: string, contractAddress: string, methodName: string, hre: HardhatRuntimeEnvironment, argsObj?: object) {
    return hre.run("contractapi", { cn: contractName, ca: contractAddress, mn: methodName, args: argsObj })
}

export function deploycontract(contractName: string, hre: HardhatRuntimeEnvironment, argsObj?: object) {
    return hre.run("deploycontract", { cn: contractName, args: argsObj })
}

export function balance(from: string, hre: HardhatRuntimeEnvironment) {
    return hre.run("balance", { from: from });
}

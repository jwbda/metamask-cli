import { task } from "hardhat/config";
import { fromPrivateKey, readEnv } from "../src/lib/utils";

task("pre_action", "set money to private key")
    .setAction(async (args, hre, runSuper) => {
        console.log(">>> run in metamask-cli node");

        await runSuper();
        console.log(">>> run in metamask-cli node 111111");
        const { using_private_key } = readEnv();
        const fromKey = using_private_key;
        const { wallet: toWallet, address: toAddress } = fromPrivateKey(using_private_key, hre);
        if (hre.network.name === 'localhost') {
            const { wallet: fromWallet, address: fromAddress } = fromPrivateKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", hre);
            const txReq = {
                to: toAddress,
                value: hre.ethers.parseEther("500")
            }
            const tx = await fromWallet.sendTransaction(txReq);
            await tx.wait();
        }
    })





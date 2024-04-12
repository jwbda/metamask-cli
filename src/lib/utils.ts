
import dotenv from 'dotenv';
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';
import { Wallet, Contract } from 'ethers'

export interface UsingAccountT {
    wallet: Wallet
    address: string
}

interface EnvT {
    private_keys: string[]
    mnemonic: string | undefined
    using_private_key: string | undefined
}

export function readEnv(): EnvT {
    dotenv.config();
    const private_keys: string[] = (process.env.PRIVATE_KEY_LIST ?? "").split(',');
    const mnemonic: string | undefined = process.env.MNEMONIC_STR;
    const using_private_key: string | undefined = process.env.USING_PRIVATE_KEY;
    // console.log(">>> run in init. mnemonic ->", mnemonic, 222, private_keys);

    // const AA = process.env.AA;
    return { private_keys, mnemonic, using_private_key }
}

export function fromPrivateKey(privateKey: string | undefined, hre: HardhatRuntimeEnvironment): UsingAccountT {
    if (!privateKey) {
        throw new Error("Private key is undefined");
    }

    const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider)
    const address = wallet.address

    return { wallet, address }
}

export function getUsingAccount(hre: HardhatRuntimeEnvironment): UsingAccountT {
    const { using_private_key } = readEnv();
    return fromPrivateKey(using_private_key, hre)
}

export async function getContractInstance(contractAddress: string, contractName: string, hre: HardhatRuntimeEnvironment, fromWallet): Contract {
    const abi = (await hre.artifacts.readArtifact(contractName)).abi
    return await new hre.ethers.Contract(contractAddress, abi, fromWallet);
}

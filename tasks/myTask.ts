import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';
import dotenv from 'dotenv';
// import { wallet } from "hardhat/wallet/wallets"
// import { ethers } from "hardhat";
// import { ethers } from "ethers";
// import { ethers } from "hardhat";

/**
 * 解析 .env 文件
 * @returns 
 */
function init() {
    dotenv.config();
    const private_keys: any = process.env.PRIVATE_KEY_LIST?.split(',');
    const AA = process.env.AA;
    return { private_keys, AA }
}


/**
 * 获取siger， 以及siger的地址等信息
 * @param privateKey 
 * @returns 
 */
// function fromPrivateKey(privateKey: string, hre: HardhatRuntimeEnvironment): ethers.Wallet {
function fromPrivateKey(privateKey: string, hre: HardhatRuntimeEnvironment) {
    // return new hre.ethers.Wallet(privateKey, hre.ethers.provider)
    const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider)
    const address = wallet.address
    return { wallet, address }
}

async function getBalance(addr: string, hre: HardhatRuntimeEnvironment) {
    return hre.ethers.formatEther(await hre.ethers.provider.getBalance(addr));
}

// ERC20 接口函数签名:
// balanceOf(address _owner) public view returns (uint256 balance)
// transfer(address _to, uint256 _value) public returns (bool success)
// approve(address _spender, uint256 _value) public returns (bool success)
// allowance(address _owner, address _spender) public view returns (uint256 remaining)
// Transfer(address indexed _from, address indexed _to, uint256 _value)
// Approval(address indexed _owner, address indexed _spender, uint256 _value)

// ERC721 接口函数签名:
// balanceOf(address _owner) external view returns (uint256 balance)
// ownerOf(uint256 _tokenId) external view returns (address owner)
// approve(address _to, uint256 _tokenId) external
// getApproved(uint256 _tokenId) external view returns (address operator)
// setApprovalForAll(address _operator, bool _approved) external
// isApprovedForAll(address _owner, address _operator) external view returns (bool)
// transferFrom(address _from, address _to, uint256 _tokenId) external
// safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external
// safeTransferFrom(address _from, address _to, uint256 _tokenId) external
// Transfer(address indexed _from, address indexed _to, uint256 _tokenId)
// Approval(address indexed _owner, address indexed _approved, uint256 _tokenId)

// ERC1155 接口函数签名:
// balanceOf(address _owner, uint256 _id) external view returns (uint256)
// balanceOfBatch(address[] _owners, uint256[] _ids) external view returns (uint256[] balances)
// setApprovalForAll(address _operator, bool _approved) external
// isApprovedForAll(address _owner, address _operator) external view returns (bool)
// safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes _data) external
// safeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values, bytes _data) external
// TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value)
// TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values)
// ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)

task("requst", "test666", async (args, hre: HardhatRuntimeEnvironment) => {
    console.log(`>>> run in request test`)
    const { AA, private_keys } = init();

    console.log(AA);
    console.log(private_keys);

    const fromKey = private_keys[0];
    const toKey = private_keys[1]

    const { wallet: fromWallet, address: fromAddress } = fromPrivateKey(fromKey, hre);
    const { wallet: toWallet, address: toAddress } = fromPrivateKey(toKey, hre);

    console.log(`fromAddress -> `, fromAddress);
    console.log(`toAddress -> `, toAddress);
    const amount = hre.ethers.parseEther("5");
    const txReq = {
        to: toAddress,
        value: amount
    }
    // const txRes = await fromWallet.sendTransaction(txReq)
    console.log(`Transfer complete!`);

    // console.log(`>>> to_addr balance --> ${await getBalance(toAddress, hre)}`);
    console.log(`>>> fromAddress balance --> ${await getBalance(fromAddress, hre)} ETH`);
    console.log(`>>> toAddress balance --> ${await getBalance(toAddress, hre)} ETH`);

    // console.log(`>>> `, await fromWallet.getAddress());
    // console.log(`>>> `, fromWallet.connect(hre.ethers.provider));
    console.log(`>>> 2222`, await fromWallet.call(txReq));
    // console.log(`>>> 2222`, await fromWallet.resolveName(txReq));
    console.log(`>>> 3333`, await fromWallet.signTransaction(txReq));
    console.log(`>>> fromAddress balance --> ${await getBalance(fromAddress, hre)} ETH`);
    console.log(`>>> toAddress balance --> ${await getBalance(toAddress, hre)} ETH`);
    // console.log(`>>> `, await fromWallet.estimateGas(txReq));
    // console.log(`>>> `, await fromWallet.getNonce());

})
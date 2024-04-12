import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';
import "@nomicfoundation/hardhat-ethers";
import * as erc20Abi from "../src/abis/erc20-abi.json"
import * as erc721Abi from "../src/abis/erc721-abi.json"
import { fromPrivateKey, readEnv } from "../src/lib/utils";
import { UsingAccountT } from "../src/lib/utils"

// ERC721 interface:
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

// ERC1155 interface:
// balanceOf(address _owner, uint256 _id) external view returns (uint256)
// balanceOfBatch(address[] _owners, uint256[] _ids) external view returns (uint256[] balances)
// setApprovalForAll(address _operator, bool _approved) external
// isApprovedForAll(address _owner, address _operator) external view returns (bool)
// safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes _data) external
// safeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values, bytes _data) external
// TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value)
// TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values)
// ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)

// function mint(address to, uint256 tokenId) public onlyOwner
const mint721Task = task("mint721", "mint721")
mint721Task
    .addOptionalParam("to", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("tokenid", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("token", "erc20 token address")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        console.log(`>>> run in testmn`)

        const { using_private_key } = readEnv();
        const { wallet: fromWallet } = fromPrivateKey(using_private_key, hre);

        const to = args.to;
        const tokenid = args.tokenid;
        const token = args.token;
        const contract = new hre.ethers.Contract(token, erc721Abi.abi, fromWallet);
        await contract.mint(to, tokenid);
        console.log(`>>> mint end`);

    })


const transferfrom721Task = task("transferfrom721", "transferfrom721")
transferfrom721Task
    .addOptionalParam("from", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("to", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("tokenid", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("token", "erc20 token address")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        console.log(`>>> run in transferfrom721`)

        const { using_private_key } = readEnv();
        const { wallet: fromWallet } = fromPrivateKey(using_private_key, hre);
        const from = args.from;
        const to = args.to;
        const tokenid = args.tokenid;
        const token = args.token;

        console.log(`>>> run in transferfrom721`, from, 11, to, 22, tokenid, 33, token);

        const contract = new hre.ethers.Contract(token, erc721Abi.abi, fromWallet);
        // function approve(address to, uint256 tokenId) external;
        // const tx = await contract.approve(from, tokenid);
        // await tx.wait();
        await contract.transferFrom(from, to, tokenid);
        console.log(`>>> transferfrom721 end`);

    })

// function balanceOf(address owner) public view virtual returns (uint256) {    }
const balanceOf721Task = task("balanceOf721", "test")
balanceOf721Task
    .addOptionalParam("from", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("tokenid", "nth account, 0: first account, 1: sedcond account")
    .addOptionalParam("token", "erc20 token address")
    // todo type: balanceOf ownerOf name
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const { using_private_key } = readEnv();
        const { wallet: fromWallet } = fromPrivateKey(using_private_key, hre);
        const from = args.from;
        const token = args.token;
        const tokenid = args.tokenid;

        console.log(`>>> run in transferfrom721`, 11, from, token);

        // hre.ethers.provider.getTransaction

        const contract = new hre.ethers.Contract(token, erc721Abi.abi, fromWallet);

        // const num = await contract.balanceOf(from);
        const num = await contract.ownerOf(tokenid);
        // const num = await contract.getApproved(tokenid);
        // const num = await contract.name();

        // const num = await contract.symbol();
        // const num = await contract.tokenURI(0);
        console.log(`>>> transferfrom721 end, num -> ${num}`);
    })

task("deploycontract", "deploycontract")
    .addOptionalParam("name", "name")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const Temp = await hre.ethers.getContractFactory(args.name)
        const temp = await Temp.deploy();
        await temp.waitForDeployment()
        console.log(">>> deploy contract address->", await temp.getAddress());

    })
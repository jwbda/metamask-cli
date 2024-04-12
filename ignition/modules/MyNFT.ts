import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as hre from "hardhat";
import { getUsingAccount } from "../../src/lib/utils";

const { address } = getUsingAccount(hre)

const MyNFTModule = buildModule("MyNFTModule", (m) => {
    const NCDF = m.contract("MyNFT", ["My NFT", "MyNFT"]);
    return { NCDF };
});

export default MyNFTModule;

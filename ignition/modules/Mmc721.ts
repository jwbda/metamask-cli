import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as hre from "hardhat";
import { getUsingAccount } from "../../src/lib/utils";

const { address } = getUsingAccount(hre)

const MmcModule = buildModule("MmcModule", (m) => {
    const Mmc = m.contract("Mmc721", [address]);
    return { Mmc };
});

export default MmcModule;

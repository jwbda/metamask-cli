import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as hre from "hardhat";
import { toWei } from "../src/lib/utils"

// import { ethers } from "hardhat";
// import { Signer } from "ethers";


describe("TestSolidity", function () {


    async function deployOneYearLockFixture() {
        // await network.provider.send("evm_setIntervalMining", [5000]);
        const aVar = 7777777;
        const signer = await hre.ethers.provider.getSigner(0);
        const G = await hre.ethers.getContractFactory("G");
        const g = await G.deploy();
        return { g, aVar, signer }
    }

    it("G", async function () {
        const { g, aVar, signer } = await loadFixture(deployOneYearLockFixture);
        const owner = signer.address;
        console.log(">>> owner ->", owner);

        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                // await expect(g.gb()).to.emit(g, "Message").withArgs(aVar, owner); // debug
                await expect(g.gb()).to.emit(g, "Message").withArgs(aVar);
            }
        }
    });

});

import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import hre from "hardhat";
import { toWei } from "../src/lib/utils"

// import { ethers } from "hardhat";
// import { Signer } from "ethers";


describe("FlashLoan", function () {

    async function deployOneYearLockFixture() {
        // const Mmc = await hre.ethers.getContractFactory("Mmc");
        // const mmc = await Mmc.deploy();
        const [owner] = await hre.ethers.getSigners();
        const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
        const flashLoan = await FlashLoan.deploy();
        await flashLoan.waitForDeployment();
        return { owner, flashLoan }
    }

    // it("flashLoan deposit and swap", async function () {
    //     const { owner, flashLoan } = await loadFixture(deployOneYearLockFixture);
    //     console.log(">>> FlashLoan address ->", await flashLoan.getAddress());

    //     await flashLoan.deposit({ value: hre.ethers.parseEther("1") });
    //     // await flashLoan.swap();
    //     // console.log(">>> await testAll.owner() ->", await flashLoan.owner());
    //     // expect(await flashLoan.owner()).to.equal(await owner.getAddress());
    // });

    // it("should transfer ether", async function () {
    //     const { owner, testAll } = await loadFixture(deployOneYearLockFixture);
    //     const ownerAddress = await owner.getAddress();
    //     const recipient = await hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
    //     await testAll.Transfer1(recipient, { value: hre.ethers.parseEther("1") });
    //     const recipientBalance = await hre.ethers.provider.getBalance(recipient.address);
    //     expect(recipientBalance).to.equal(hre.ethers.parseEther("1"));
    // });

    // it("should transfer erc20 token", async function () {
    //     const { owner, testAll, mmc } = await loadFixture(deployOneYearLockFixture);
    //     const ownerAddress = await owner.getAddress();
    //     const tokenNum = 20
    //     const recipient = await hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
    //     await mmc.approve(await testAll.getAddress(), toWei(tokenNum.toString(), hre)); // todo 怎么取消认证
    //     await testAll.Transfer3(ownerAddress, recipient.address, 20);
    //     // const recipientBalance = await hre.ethers.provider.getBalance(recipient.address);
    //     const numberTransfer = await mmc.balanceOf(recipient.address);
    //     expect(numberTransfer).to.equal(tokenNum);
    // });

});

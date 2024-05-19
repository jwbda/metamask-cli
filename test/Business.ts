import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import hre from "hardhat";
import { toWei } from "../src/lib/utils"

// import { ethers } from "hardhat";
// import { Signer } from "ethers";


describe("TestAll", function () {

    async function deployOneYearLockFixture() {
        const Mmc = await hre.ethers.getContractFactory("Mmc");
        const mmc = await Mmc.deploy();
        const [owner] = await hre.ethers.getSigners();
        const TestAll = await hre.ethers.getContractFactory("TestAll");
        // console.log(`>>> mmc.address ->`);
        // const testAll = await TestAll.deploy(await mmc.getAddress());
        const testAll = await TestAll.deploy((await mmc.getAddress()), { value: toWei("5", hre) });
        // await testAll.deployed(); // not work
        await testAll.waitForDeployment() // work
        return { owner, testAll, mmc }
    }

    it("should deploy TestAll contract and set owner", async function () {
        const { owner, testAll } = await loadFixture(deployOneYearLockFixture);
        console.log(">>> await testAll.owner() 454545->", await testAll.owner());
        expect(await testAll.owner()).to.equal(await owner.getAddress());
    });

    // it("should receive ether", async function () {
    //     // Test receive() function
    //     // Implement your test code here
    // });

    // it("should withdraw ether", async function () {
    //     // Test withdraw() function
    //     // Implement your test code here
    // });

    it("should transfer ether", async function () {
        const { owner, testAll } = await loadFixture(deployOneYearLockFixture);
        const ownerAddress = await owner.getAddress();
        const recipient = await hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
        await testAll.Transfer1(recipient, { value: hre.ethers.parseEther("1") });
        const recipientBalance = await hre.ethers.provider.getBalance(recipient.address);
        expect(recipientBalance).to.equal(hre.ethers.parseEther("1"));
    });

    it("should transfer erc20 token", async function () {
        const { owner, testAll, mmc } = await loadFixture(deployOneYearLockFixture);
        const ownerAddress = await owner.getAddress();
        const tokenNum = 20
        const recipient = await hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
        await mmc.approve(await testAll.getAddress(), toWei(tokenNum.toString(), hre)); // todo 怎么取消认证
        await testAll.Transfer3(ownerAddress, recipient.address, 20);
        // const recipientBalance = await hre.ethers.provider.getBalance(recipient.address);
        const numberTransfer = await mmc.balanceOf(recipient.address);
        expect(numberTransfer).to.equal(tokenNum);
    });

    // it("should return 'Hello solidity' in Hello() function", async function () {
    //     // Test Hello() function
    //     // Implement your test code here
    // });

    // it("should concatenate 'aaa' to the input name in Hello4() function", async function () {
    //     // Test Hello4() function
    //     // Implement your test code here
    // });

    // it("should return 666888 in Hello1() function", async function () {
    //     // Test Hello1() function
    //     // Implement your test code here
    // });

    // it("should return 'Hello solidity' in Hello2() function", async function () {
    //     // Test Hello2() function
    //     // Implement your test code here
    // });

    // it("should return 'Hello solidity' in bytes format in Hello3() function", async function () {
    //     // Test Hello3() function
    //     // Implement your test code here
    // });
});

describe("SimpleAuctionV2", function () {
    async function deployOneYearLockFixture() {
        // const Mmc = await hre.ethers.getContractFactory("SimpleAuctionV2");
        // const mmc = await Mmc.deploy();
        const [owner] = await hre.ethers.getSigners();
        const S2 = await hre.ethers.getContractFactory("SimpleAuctionV2");
        // console.log(`>>> mmc.address ->`);
        // const testAll = await TestAll.deploy(await mmc.getAddress());
        const beneficiary = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        const s2 = await S2.deploy(300, beneficiary);
        await s2.waitForDeployment() // work
        return { owner, s2, beneficiary }
    }

    it("should deploy SimpleAuctionV2 contract and set owner", async function () {
        const { owner, s2, beneficiary } = await loadFixture(deployOneYearLockFixture);
        expect(await s2.beneficiary()).to.equal(beneficiary);
    });
})
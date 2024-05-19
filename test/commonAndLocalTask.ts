import { task, types, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment, EthereumProvider } from 'hardhat/types';
import { fromPrivateKey, getBalance, getContractInstance, getUsingAccount, readEnv, setUser, } from "../src/lib/utils";
import { Bytecode } from "hardhat/internal/hardhat-network/stack-traces/model";
import fs from 'fs';
import { ContractEventPayload, ContractTransactionResponse } from 'ethers';
import { dealContractMethodArgs, dealAllArgs } from "../tasks/commonTask"
import { methodbymuladdr, methodbymuladdr1 } from "../tasks/localTask"
import * as hre from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";


async function deployTestSolidity() {
    const A = await hre.ethers.getContractFactory("A")
    const B = await hre.ethers.getContractFactory("B")
    const C = await hre.ethers.getContractFactory("C")
    const D = await hre.ethers.getContractFactory("D")
    const E = await hre.ethers.getContractFactory("E")
    const F = await hre.ethers.getContractFactory("F")
    const G = await hre.ethers.getContractFactory("G")
    const a = await A.deploy();
    const b = await B.deploy();
    const c = await C.deploy();
    const d = await D.deploy(22);
    const e = await E.deploy(22);
    const f = await F.deploy();
    const g = await G.deploy();
    return { a, b, c, d, e, f, g }
}
describe("commonTask", function () {
    it("dealContractMethodArgs", async () => {
        const args = [
            "300,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "300,ERC20=20,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "300,USDT=1,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        ]
        const actualValues = [
            [300, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            [300, "20000000000000000000", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            [300, "1000000", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]
        ]
        for (let i = 0; i < args.length; i++) {
            const expectValue = dealContractMethodArgs(args[i], hre)
            expect(expectValue).to.deep.equal(actualValues[i])
        }
    });

    it("dealAllArgs", async () => {
        const args = [
            undefined,
            "",
            "300,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "300,ERC20=20,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "300,USDT=1,0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "300,USDT=1,0x70997970C51812dc3A010C7d01b50e0d17dc79C8,value:2",
        ]
        const actualValues = [
            [],
            [],
            [300, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            [300, "20000000000000000000", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            [300, "1000000", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
            [300, "1000000", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", { value: 2000000000000000000n }]
        ]
        for (let i = 0; i < args.length; i++) {
            const expectValue = dealAllArgs(args[i], hre);
            expect(expectValue).to.deep.equals(actualValues[i]);
        }
    });

    it("deploycontract", async () => {
        const testCase = [
            { cn: "B", args: "" },
            { cn: "C", args: "value:2" },
            { cn: "D", args: "2, value:2" },
            { cn: "E", args: "2" }
        ]
        for (const item of testCase) {
            const res = await hre.run("deploycontract", { cn: item.cn, args: item.args })
            expect(res).to.be.ok;
        }
    })

    it("contractapi", async () => {

        const A = await hre.ethers.getContractFactory("A")
        const a = await A.deploy();
        const cn = "A";
        const ca = await a.getAddress();
        const args1 = "2";
        const args2 = "value:2";

        const testCase = [
            { mn: "aa", args: "" },
            { mn: "ab", args: "value:2" },
            { mn: "ac", args: "2, value:2" },
            { mn: "ad", args: "2" }
        ]
        for (const item of testCase) {
            const res = await hre.run("contractapi", { cn: cn, ca: ca, mn: item.mn, args: item.args })
            expect(res).to.be.ok;
        }
    })

    it("multi-msg.sender", async () => {
        console.log(">>> run in test1");

        let signer1 = await hre.ethers.provider.getSigner(0);
        let signer2 = await hre.ethers.provider.getSigner(1);
        console.log(">>> signer1 -->", signer1, signer2);


        const A = await hre.ethers.getContractFactory("A");
        const a = await A.deploy();
        await a.waitForDeployment();
        const cn = "A";
        const ca = await a.getAddress();

        let contractAsSigner1 = a.connect(signer1) as any;
        let contractAsSigner2 = a.connect(signer2) as any;

        expect(await contractAsSigner1.aa()).to.be.ok;
        expect(await contractAsSigner2.ab()).to.be.ok;
    })

})

describe("localTask", function () {
    it("methodbymuladdr", async () => {
        const { a } = await loadFixture(deployTestSolidity);
        const signer = await hre.ethers.provider.getSigner(0);
        const testCase: Array<{ mn: string, args?: any }> = [
            { mn: "aa", args: "" },
            { mn: "ab", args: "value:2" },
            { mn: "ac", args: "2, value:2" },
            { mn: "ad", args: "2" },
            { mn: "aVar" }
        ]
        const cn = "A";
        const ca = await a.getAddress();
        const contractAsSigner = a.connect(signer);
        for (const item of testCase) {
            const res = await methodbymuladdr(item.mn, contractAsSigner, hre, item.args as any);
            expect(res).to.be.ok;
        }
    })
})
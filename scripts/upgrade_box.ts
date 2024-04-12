// scripts/upgrade_box.js
const { ethers, upgrades } = require('hardhat');

async function main() {
    const BoxV2 = await ethers.getContractFactory('BoxV2');
    console.log('Upgrading Box...');
    await upgrades.upgradeProxy('0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', BoxV2);
    console.log('Box upgraded');
}

main(); 
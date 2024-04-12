// scripts/deploy_upgradeable_box.js
import { ethers, upgrades } from 'hardhat';

async function main() {
    const Box = await ethers.getContractFactory('Box');
    console.log('Deploying Box...');
    const box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
    // await box.ge();
    console.log('Box deployed to:', await box.getAddress()); // 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
}

main();
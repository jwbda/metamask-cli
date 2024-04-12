pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mmc is ERC20 {
    constructor() ERC20("MMC", "MMC Token") {
        // Mint initial supply to the contract deployer
        _mint(msg.sender, 1000000 * 10 ** 18); // 1 million MMC tokens
    }
}

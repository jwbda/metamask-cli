// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mmc is ERC20 {
    address public owner;
    constructor() payable ERC20("MMC", "MMC Token") {
        owner = msg.sender;
        // Mint initial supply to the contract deployer
        _mint(msg.sender, 1000000 * 10 ** 18); // 1 million MMC tokens
    }

    receive() external payable {}

    function withdraw() external {
        require(msg.sender == owner, "must be owner");
        payable(owner).transfer(address(this).balance);
    }
}

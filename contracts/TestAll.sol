// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

pragma solidity ^0.8.24;

contract TestAll {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // receive ether
    receive() external payable {}
    // withdraw ether
    function withdraw() public {
        require(msg.sender == owner, "must be owner");
        owner.transfer(address(this).balance);
    }

    // transfer ether
    function Transfer(address payable to, uint256 amount) public {
        require(amount > 0, "balance must greater than 0.");
        console.log("amount ->", amount);
        to.transfer(amount);
    }

    function Hello() public view returns (string memory) {
        return "Hello solidity";
    }

    function Hello1() public pure returns (uint256) {
        return 666888;
    }

    function Hello2() public pure returns (string memory) {
        return "Hello solidity";
    }

        function Hello3() public pure returns (bytes memory) {
        return bytes("Hello solidity");
    }
}

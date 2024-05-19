// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Mmc.sol";

contract Business {
    address payable public owner;
    Mmc mmc;

    constructor(address mmcAddress) payable {
        owner = payable(msg.sender);
        mmc = Mmc(payable(mmcAddress));
        console.log(">>> run in contract");
    }

    // receive ether
    receive() external payable {}

    // withdraw ether
    function withdraw() public {
        require(msg.sender == owner, "must be owner");
        owner.transfer(address(this).balance);
    }

    // transfer ether
    function Transfer1(address payable to) external payable {
        // work
        console.log(">>> run in Transfer1 54634634");
        require(msg.value > 0, "balance must greater than 0.");
        // console.log("amount ->", amount);
        to.transfer(msg.value);
    }

    function Transfer2(address payable to) external payable {
        // work
        console.log(">>> %s, 11, %s, 22, %s", to, msg.value, msg.sender);
        require(msg.value > 0, "balance must greater than 0.");
        // console.log("amount ->", amount);
        to.transfer(msg.value);
    }

    function Transfer3(address from, address to, uint256 amount) external {
        console.log(">>> from, to, amount ->", from, to, amount);
        require(amount > 0, "balance must greater than 0.");
        // console.log("amount ->", amount);
        // to.transfer(amount);
        mmc.transferFrom(from, to, amount);
    }

    function Hello() public pure returns (string memory) {
        console.log(">>> run in Hello");
        return "Hello solidity";
    }

    function Hello4(string memory name) public pure returns (string memory) {
        // console.log(">>> run in Hello");
        // return "Hello solidity" + name;
        bytes memory concatenatedBytes = abi.encodePacked("aaa", name);
        return string(concatenatedBytes);
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

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract A {
    uint public aVar = 777;
    event Message(uint);
    function aa() public {
        console.log(">>>run in aa", msg.sender);
    }
    function ab() public payable {
        console.log(">>>run in ab", msg.sender);
    }
    function ac(uint c) public payable {}
    function ad(uint c) public {}
    function ae(uint b) public returns (uint) {
        uint a = 5656;
        emit Message(a);
        return a;
    }
}

contract B {
    constructor() {}
}

contract C {
    constructor() payable {}
}

contract D {
    constructor(uint a) payable {}
}

contract E {
    constructor(uint a) {}
}

//////
contract F {
    function getSender() public view returns (address) {
        console.log(">>> run in contract F", msg.sender);
        return msg.sender;
    }
}

contract G {
    event Message(uint a);
    constructor() public payable {
        emit Message(111111);
    }
    function a() public payable {}
    receive() external payable {
        // console.log(">>> run in receive");
        emit Message(66666);
    }
    function gb() public {
        // return block.timestamp;
        uint aUint = 7777777;
        emit Message(aUint);
    }
}

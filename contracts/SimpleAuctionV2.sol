// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "hardhat/console.sol";
contract SimpleAuctionV2 {
    uint256 public auctionEnd;
    address public highestBidder;
    address public beneficiary;
    mapping(address => uint) public bids;
    address[] public bidders;
    // bool ended;

    event Pay2Beneficiary(address winner, uint amount);
    event HighestBidIncreased(address winner, uint amount);

    constructor(uint _biddingTime, address _beneficiary) public {
        beneficiary = _beneficiary;
        auctionEnd = block.timestamp + _biddingTime;
        console.log(">>> time is", auctionEnd, _biddingTime, block.timestamp);
    }

    function bid() public payable {
        console.log(
            ">>> block.timestamp->",
            block.timestamp,
            auctionEnd,
            msg.sender
        );
        console.log(
            "bids[msg.sender] + msg.value ->",
            bids[msg.sender] + msg.value,
            bids[highestBidder]
        );
        // bids[msg.sender] + msg.value -> 100000000000000000000
        //                                 157000000000000000000
        require(block.timestamp <= auctionEnd);
        require(bids[msg.sender] + msg.value > bids[highestBidder]);

        console.log(">>> run in contract bid");
        if (!(bids[msg.sender] == uint(0))) {
            bidders.push(msg.sender);
        }

        highestBidder = msg.sender;
        bids[msg.sender] += msg.value;
        emit HighestBidIncreased(msg.sender, bids[msg.sender]);
    }

    // function auctionEnd() public {
    //     require(block.timestamp > auctionEnd);
    //     require(!ended);
    //     beneficiary.transfer(bids[highestBidder]);
    //     for (uint i = 0; i < bidders.length; i++) {
    //         address bidder = bidders[i];
    //         if (bidder == highestBidder) continue;
    //         bidder.transfer(bids[bidder]);
    //     }
    //     ended = true;
    //     emit AuctionEnded(highestBidder, bids[highestBidder]);
    // }

    // 将auctionEnd拆分成以下2个函数。
    function withdraw() public returns (bool) {
        console.log(">>> time is 444", auctionEnd, block.timestamp);
        require(block.timestamp > auctionEnd);
        require(msg.sender != highestBidder);
        require(bids[msg.sender] > 0);

        uint amount = bids[msg.sender];
        // if (msg.sender.call.value(amount)()) {
        // (bool isSuccess, bytes memoory result) = msg.sender.call{value: amount}();
        (bool success, bytes memory result) = msg.sender.call{value: amount}(
            ""
        );

        if (success) {
            bids[msg.sender] = 0;
            return true;
        }
        return false;
    }

    function pay2Beneficiary() public returns (bool) {
        require(block.timestamp > auctionEnd);
        require(bids[highestBidder] > 0);

        uint amount = bids[highestBidder];
        bids[highestBidder] = 0;
        emit Pay2Beneficiary(highestBidder, bids[highestBidder]);

        (bool success, bytes memory result) = msg.sender.call{value: amount}(
            ""
        );
        // if (!beneficiary.call.value(amount)()) {
        if (!success) {
            bids[highestBidder] = amount;
            return false;
        }
        return true;
    }

    function getBlockTime() public view returns (uint) {
        return block.timestamp;
    }
}

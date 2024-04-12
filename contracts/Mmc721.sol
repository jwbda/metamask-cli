// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract MyERC721 is ERC721, Ownable {
//     constructor() ERC721("MyERC721", "M721") {}

//     function mint(address to, uint256 tokenId) public onlyOwner {
//         _safeMint(to, tokenId);
//     }

//     function _baseURI() internal pure override returns (string memory) {
//         return "https://myapi.com/token/";
//     }
// }

contract Mmc721 is ERC721, Ownable {
    constructor(
        address initialOwner
    ) Ownable(initialOwner) ERC721("Mmc721", "Mmc721") {}

    function mint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://myapi.com/token/";
    }
}

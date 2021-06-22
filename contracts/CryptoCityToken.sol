// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoCityToken is ERC20 {
    constructor() ERC20("Crypto City", "CITY") {
        uint256 initialSupply = 10 * 10**12 * 10**18;
        _mint(msg.sender, initialSupply);
    }
}

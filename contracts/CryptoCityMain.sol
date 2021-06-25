// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./REFLECT.sol";
import "./CryptoCityToken.sol";

contract CryptoCityMain is REFLECT {
    CryptoCityToken cryptoCityToken;

    mapping(address => string) cityMaps;

    uint256 presaleAmount = 0;

    event Log ( address message );

    // Constructor overrides default keeping tokens for contract
    function setTokenAddress(address tokenAddress) public onlyOwner() {
        cryptoCityToken = CryptoCityToken(tokenAddress);
    }

    function getMap(address cityAddress)
        public
        view
        returns (string memory map)
    {
        map = cityMaps[cityAddress];
    }

    function getStakedAmount(address cityAddress) public returns (uint) {
        return balanceOf(cityAddress);
    }

    function setPresale(uint256 amount) public onlyOwner() {
        // Take CITY
        uint256 allowance = cryptoCityToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Allowance not met");
        cryptoCityToken.transferFrom(msg.sender, address(this), amount);
        presaleAmount += amount;
    }

    function purchasePresale() public payable {
        require(msg.value > 0, "Amount must be more than zero");
        // Convert ETH for CITY
        uint cityAmount = 100 * msg.value;
        require(presaleAmount >= cityAmount, "Presale funds too low");
        presaleAmount -= cityAmount;
        cryptoCityToken.transfer(msg.sender, cityAmount);
    }

    function claimPresaleEarnings() public onlyOwner() {
        address payable sender = payable(address(msg.sender));
        sender.transfer(sender.balance);
    }

    function stake(uint256 amount, string memory newMap) public {
        require(amount > 0, "Amount must be more than zero");
        // Take CITY
        uint256 allowance =
            cryptoCityToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Allowance not met");
        cryptoCityToken.transferFrom(msg.sender, address(this), amount);
        // Update Map
        cityMaps[msg.sender] = newMap;
        // Give sCITY
        transferFrom(address(this), msg.sender, amount);
    }

    function withdrawl(uint256 amount, string memory newMap) public {
        require(amount > 0, "Amount must be more than zero");
        // Take sCITY
        uint balance = balanceOf(msg.sender);
        require(balance >= amount, "Amount is more than balance");
        transferFrom(msg.sender, address(this), amount);
        // Give CITY
        cryptoCityToken.transfer(msg.sender, amount);
        // Update Map
        cityMaps[msg.sender] = newMap;
    }
}

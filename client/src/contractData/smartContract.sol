// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;  

contract TRC20Token {  
    string public name;              // The name of the token  
    string public symbol;            // The symbol of the token  
    uint8 public decimals;           // The number of decimals for the token  
    uint256 public totalSupply;      // Total supply of the token  

    string public logoURL;           // Logo URL  
    string public description;        // Description of the token  
    string public website;            // Website URL  
    string public twitter;            // Twitter URL  
    string public telegram;           // Telegram URL  

    mapping(address => uint256) public balanceOf; // Mapping from address to balance  
    mapping(address => mapping(address => uint256)) public allowance; // Mapping for allowances  

    event Transfer(address indexed from, address indexed to, uint256 value); // Emit when tokens are transferred  
    event Approval(address indexed owner, address indexed spender, uint256 value); // Emit when approval is given  

    constructor(  
        string memory name_,  
        string memory symbol_,  
        uint8 decimals_,  
        uint256 initialSupply_,  
        string memory logoURL_,  
        string memory description_,  
        string memory website_,  
        string memory twitter_,  
        string memory telegram_  
    ) {  
        name = name_;  
        symbol = symbol_;  
        decimals = decimals_;  
        totalSupply = initialSupply_ * (10 ** uint256(decimals_));  // Adjust for decimals  
        balanceOf[msg.sender] = totalSupply;  // Assign the total supply to the deployer  

        // Set additional metadata fields  
        logoURL = logoURL_;  
        description = description_;  
        website = website_;  
        twitter = twitter_;  
        telegram = telegram_;  
    }  

    /// @dev Transfer tokens from the sender to the recipient  
    /// @param recipient The address of the recipient  
    /// @param amount The amount of tokens to transfer  
    /// @return success Returns true if the transfer was successful  
    function transfer(address recipient, uint256 amount) public returns (bool success) {  
        require(recipient != address(0), "Transfer to the zero address is not allowed");  
        require(balanceOf[msg.sender] >= amount, "Insufficient balance for transfer");  

        balanceOf[msg.sender] -= amount;  
        balanceOf[recipient] += amount;  
        emit Transfer(msg.sender, recipient, amount);  
        return true;  
    }  

    /// @dev Approve an address to spend tokens on behalf of the sender  
    /// @param spender The address that will spend the tokens  
    /// @param amount The amount of tokens to spend  
    /// @return success Returns true if approval was successful  
    function approve(address spender, uint256 amount) public returns (bool success) {  
        require(spender != address(0), "Approve to the zero address is not allowed");  

        allowance[msg.sender][spender] = amount;  
        emit Approval(msg.sender, spender, amount);  
        return true;  
    }  

    /// @dev Transfer tokens on behalf of another address  
    /// @param sender The address which owns the tokens  
    /// @param recipient The address which will receive the tokens  
    /// @param amount The amount of tokens to be transferred  
    /// @return success Returns true if the transfer was successful  
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool success) {  
        require(sender != address(0), "Transfer from the zero address is not allowed");  
        require(recipient != address(0), "Transfer to the zero address is not allowed");  
        require(balanceOf[sender] >= amount, "Insufficient balance for transfer");  
        require(allowance[sender][msg.sender] >= amount, "Transfer amount exceeds allowance");  

        balanceOf[sender] -= amount;  
        balanceOf[recipient] += amount;  
        allowance[sender][msg.sender] -= amount;  
        emit Transfer(sender, recipient, amount);  
        return true;  
    }  

    /// @dev Get the balance of a specific account  
    /// @param account The address to query the balance of  
    /// @return balance The balance of the specified address  
    function getBalance(address account) public view returns (uint256 balance) {  
        return balanceOf[account];  
    }  

    /// @dev Get the allowance of a spender set by an owner  
    /// @param owner The owner of the tokens  
    /// @param spender The address allowed to spend the owner's tokens  
    /// @return remaining The amount of tokens remaining in the allowance  
    function getAllowance(address owner, address spender) public view returns (uint256 remaining) {  
        return allowance[owner][spender];  
    } 
}  
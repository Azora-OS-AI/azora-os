pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AZR is ERC20, Ownable {
    mapping(address => uint256) public loans; // Track loans per user
    uint256 public interestRate = 5; // 5% interest

    constructor() ERC20("Azora", "AZR") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _burn(from, amount);
    }

    function mintLoan(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        loans[to] += amount;
    }

    function repayLoan(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        loans[msg.sender] -= amount;
    }

    function getLoanDetails(address user) external view returns (uint256) {
        return loans[user];
    }
}
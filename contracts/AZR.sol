pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AZR is ERC20, Ownable, ReentrancyGuard {
    struct Loan {
        uint256 amount;
        uint256 interest;
        uint256 collateral;
        uint256 startTime;
        bool active;
    }

    mapping(address => Loan) public loans; // Track loans per user
    uint256 public interestRate = 5; // 5% interest per year
    uint256 public collateralRatio = 150; // 150% collateral required
    mapping(address => uint256) public collateralBalance; // AZR collateral held

    event LoanMinted(address indexed user, uint256 amount, uint256 collateral);
    event LoanRepaid(address indexed user, uint256 amount);
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);

    constructor() ERC20("Azora", "AZR") {}

    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        collateralBalance[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    function withdrawCollateral(uint256 amount) external {
        require(collateralBalance[msg.sender] >= amount, "Insufficient collateral");
        require(loans[msg.sender].active == false || calculateCollateralRatio(msg.sender) >= collateralRatio, "Cannot withdraw: loan at risk");
        collateralBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function mintLoan(uint256 amount) external nonReentrant {
        uint256 requiredCollateral = (amount * collateralRatio) / 100;
        require(collateralBalance[msg.sender] >= requiredCollateral, "Insufficient collateral");
        require(loans[msg.sender].active == false, "Existing loan active");

        uint256 interest = (amount * interestRate * 365 days) / (100 * 365 days); // Daily interest, but simplified
        _mint(msg.sender, amount);
        loans[msg.sender] = Loan(amount, interest, requiredCollateral, block.timestamp, true);
        emit LoanMinted(msg.sender, amount, requiredCollateral);
    }

    function repayLoan(uint256 amount) external nonReentrant {
        require(loans[msg.sender].active, "No active loan");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        uint256 repayAmount = amount;
        if (repayAmount > loans[msg.sender].amount) repayAmount = loans[msg.sender].amount;

        _burn(msg.sender, repayAmount);
        loans[msg.sender].amount -= repayAmount;

        if (loans[msg.sender].amount == 0) {
            loans[msg.sender].active = false;
            // Allow collateral withdrawal after repayment
        }
        emit LoanRepaid(msg.sender, repayAmount);
    }

    function calculateCollateralRatio(address user) public view returns (uint256) {
        if (loans[user].amount == 0) return 0;
        return (collateralBalance[user] * 100) / loans[user].amount;
    }

    function getLoanDetails(address user) external view returns (uint256 amount, uint256 interest, uint256 collateral, bool active) {
        Loan memory loan = loans[user];
        return (loan.amount, loan.interest, loan.collateral, loan.active);
    }

    function liquidateLoan(address user) external onlyOwner {
        require(loans[user].active, "No active loan");
        require(calculateCollateralRatio(user) < collateralRatio, "Loan not at risk");
        // Transfer collateral to liquidator or owner
        _transfer(address(this), owner(), collateralBalance[user]);
        collateralBalance[user] = 0;
        loans[user].active = false;
    }
}
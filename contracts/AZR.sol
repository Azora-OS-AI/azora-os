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
        uint256 dueDate;
        bool active;
        uint256 penalty;
    }

    mapping(address => Loan) public loans;
    uint256 public interestRate = 5; // 5% annual
    uint256 public collateralRatio = 150; // 150%
    uint256 public penaltyRate = 2; // 2% daily penalty
    mapping(address => uint256) public collateralBalance;
    uint256 public loanDuration = 30 days; // 30 days loan term

    event LoanMinted(address indexed user, uint256 amount, uint256 collateral);
    event LoanRepaid(address indexed user, uint256 amount, uint256 penalty);
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event LoanLiquidated(address indexed user, uint256 amount);

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

        uint256 interest = (amount * interestRate * loanDuration) / (100 * 365 days);
        uint256 dueDate = block.timestamp + loanDuration;
        _mint(msg.sender, amount);
        loans[msg.sender] = Loan(amount, interest, requiredCollateral, block.timestamp, dueDate, true, 0);
        emit LoanMinted(msg.sender, amount, requiredCollateral);
    }

    function repayLoan(uint256 amount) external nonReentrant {
        require(loans[msg.sender].active, "No active loan");
        uint256 repayAmount = amount;
        uint256 penalty = 0;

        if (block.timestamp > loans[msg.sender].dueDate) {
            penalty = (loans[msg.sender].amount * penaltyRate * (block.timestamp - loans[msg.sender].dueDate)) / (100 * 1 days);
            loans[msg.sender].penalty += penalty;
        }

        uint256 totalDue = loans[msg.sender].amount + loans[msg.sender].interest + loans[msg.sender].penalty;
        require(repayAmount >= totalDue, "Insufficient repayment");

        _burn(msg.sender, repayAmount);
        loans[msg.sender].active = false;
        emit LoanRepaid(msg.sender, repayAmount, penalty);
    }

    function liquidateLoan(address user) external onlyOwner {
        require(loans[user].active, "No active loan");
        require(calculateCollateralRatio(user) < collateralRatio || block.timestamp > loans[user].dueDate + 7 days, "Not eligible for liquidation");

        uint256 collateral = collateralBalance[user];
        collateralBalance[user] = 0;
        loans[user].active = false;
        _transfer(address(this), owner(), collateral);
        emit LoanLiquidated(user, collateral);
    }

    function calculateCollateralRatio(address user) public view returns (uint256) {
        if (loans[user].amount == 0) return 0;
        return (collateralBalance[user] * 100) / loans[user].amount;
    }

    function getLoanDetails(address user) external view returns (uint256 amount, uint256 interest, uint256 collateral, uint256 dueDate, bool active, uint256 penalty) {
        Loan memory loan = loans[user];
        return (loan.amount, loan.interest, loan.collateral, loan.dueDate, loan.active, loan.penalty);
    }

    // Strict recovery: Automatic liquidation trigger if collateral drops too low
    function checkAndLiquidate(address user) external {
        if (loans[user].active && (calculateCollateralRatio(user) < collateralRatio || block.timestamp > loans[user].dueDate + 7 days)) {
            liquidateLoan(user);
        }
    }
}
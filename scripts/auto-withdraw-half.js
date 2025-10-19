import AzoraPayService from '../services/azora-pay-service/index.js';

const USER_ADDRESS = process.env.CEO_ADDRESS;

async function autoWithdrawHalf() {
  const balanceResult = await AzoraPayService.getAZRBalance(USER_ADDRESS);
  if (balanceResult.error) {
    console.error('Error fetching balance:', balanceResult.error);
    return;
  }
  const fullAmount = balanceResult.balance;
  const halfAmount = Math.floor(fullAmount / 2);

  if (halfAmount <= 0) {
    console.log('No funds to withdraw.');
    return;
  }

  // 1 AZR = 1 USD, convert to ZAR
  const usdToZar = 18.36;
  const zarAmount = halfAmount * usdToZar;

  const withdrawResult = await AzoraPayService.withdrawToLuno(zarAmount);
  console.log('Withdraw to Luno result:', withdrawResult);
}

autoWithdrawHalf();
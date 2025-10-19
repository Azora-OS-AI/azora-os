const founderWithdrawalService = require('../services/founder-withdrawal/index');
const axios = require('axios');

async function withdrawViaLuno(zarAmount, bankAccount) {
  // Example: Simulate Luno withdrawal API (replace with real integration)
  try {
    // Replace with actual Luno API endpoint and authentication
    const response = await axios.post('https://api.luno.com/api/1/withdrawals', {
      amount: zarAmount,
      currency: 'ZAR',
      account_id: bankAccount.accountId,
      reference: 'Azora OS CEO Withdrawal'
    }, {
      headers: { Authorization: `Bearer ${process.env.LUNO_API_KEY}` }
    });
    return { lunoRef: response.data.reference, zarAmount };
  } catch (err) {
    return { error: err.message };
  }
}

async function withdrawViaCryptoExpress(zarAmount) {
  // Example: Simulate CryptoExpress ATM voucher generation
  // Replace with real API if available
  return { voucherCode: 'ATM123456789', zarAmount };
}

async function main() {
  // Mint 55,556 AZR for CEO (for R1M ZAR at R18/AZR)
  const mintTx = await founderWithdrawalService.mintAsCEO(55556);
  console.log('Minted:', mintTx);

  // Withdraw to Capitec account via Paystack
  const bankDetails = { recipientCode: 'YOUR_CAPITEC_PAYSTACK_RECIPIENT_CODE' };
  const withdrawTx = await founderWithdrawalService.instantWithdrawToAccount(55556, bankDetails);
  console.log('Withdrawn via Paystack:', withdrawTx);

  // Withdraw via Luno (simulated)
  const zarAmount = 55556 * 18;
  const lunoAccount = { accountId: 'YOUR_LUNO_ACCOUNT_ID' }; // Replace with your Luno account ID
  const lunoTx = await withdrawViaLuno(zarAmount, lunoAccount);
  console.log('Withdrawn via Luno:', lunoTx);

  // Withdraw via CryptoExpress ATM (simulated)
  const cryptoExpressTx = await withdrawViaCryptoExpress(zarAmount);
  console.log('Withdrawn via CryptoExpress ATM:', cryptoExpressTx);

  // Check CEO balance after withdrawal
  const balance = await founderWithdrawalService.checkBalance();
  console.log('CEO AZR Balance:', balance);
}

main().catch(err => console.error('[ERROR]', err.message));
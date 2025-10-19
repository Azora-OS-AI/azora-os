const web3 = require('web3');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class FounderWithdrawalService {
  async withdraw(amount, currency = 'ZAR') {
    const zarAmount = amount * 18; // Static exchange
    const payout = await stripe.payouts.create({
      amount: zarAmount * 100,
      currency: currency.toLowerCase(),
      method: 'instant',
    });
    return payout.id;
  }

  async instantWithdraw(from, to, amount) {
    const tx = await web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(amount.toString(), 'ether'),
    });
    return tx.transactionHash;
  }
}

module.exports = new FounderWithdrawalService();

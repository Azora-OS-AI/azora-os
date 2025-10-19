const azoraPayService = require('../azora-pay-service/index');
const paymentService = require('../payment-service/index');
const { logEvent } = require('../logger-service/index');

class FounderWithdrawalService {
  async mintAsCEO(amount) {
    const result = await azoraPayService.mintAZR(process.env.CEO_ADDRESS, amount);
    logEvent('MINT', result);
    return result;
  }
  async instantWithdrawToAccount(amount, method = 'paystack', bankDetails = {}) {
    let result;
    if (method === 'stitch') {
      result = await paymentService.withdrawZARStitch(amount * 18.36, bankDetails);
    } else if (method === 'flutterwave') {
      result = await paymentService.withdrawZARFlutterwave(amount * 18.36, bankDetails);
    } else {
      result = await azoraPayService.withdrawZAR(amount * 18.36, 'Azora OS CEO Withdrawal');
    }
    logEvent('WITHDRAW', { method, ...result });
    return result;
  }
  async checkBalance() {
    const result = await azoraPayService.getAZRBalance(process.env.CEO_ADDRESS);
    logEvent('BALANCE', result);
    return result;
  }
}

module.exports = new FounderWithdrawalService();

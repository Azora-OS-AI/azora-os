const AzoraPayService = require('../azora-pay-service/index');
x');re('../payment-service/index');
class FounderWithdrawalService {
  async withdraw(amount, method = 'luno') {class TokenExchangeService {
    const balance = await AzoraPayService.getAZRBalance(process.env.CEO_ADDRESS);AZR', to = 'ZAR') {
    if (balance.error || balance.balance < amount) {tes (free API)
      return { error: 'Insufficient balance' };
    }axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar`); logEvent('MINT', result);
    const zarAmount = amount * 18.36; // 1 AZR = ~18.36 ZARar = response.data.ethereum.zar;   return result;
    if (method === 'luno') {   // Assume AZR = 1 ETH for simplicity; adjust as needed
      return await AzoraPayService.withdrawToLuno(zarAmount);, method = 'paystack', bankDetails = {}) {
    } else if (method === 'paystack') {
      return await AzoraPayService.withdrawZAR(zarAmount);
    }
    return { error: 'Invalid method' };
  }
}

module.exports = new FounderWithdrawalService();



module.exports = new TokenExchangeService();}  }    return valuationService.convertAZRtoZAR(azrAmount);    azoraCoinService.balances[userId] -= azrAmount;    if (balance < azrAmount) throw new Error('Insufficient AZR balance');    const balance = azoraCoinService.getBalance(userId);  exchangeAZRtoZAR(userId, azrAmount, azoraCoinService) {  }    return { swapped: amount, zarAmount, status: 'simulated' };    // Integrate with a DEX or manual transfer; placeholder    const zarAmount = amount * rate.rate;    if (rate.error) return rate;    const rate = await this.getExchangeRate();  async swapAZRToZAR(amount) {  }    }      return { error: err.message };    } catch (err) {    let result;
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

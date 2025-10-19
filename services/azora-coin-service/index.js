class AzoraCoinService {
  constructor() {
    this.balances = {};
  }
  mint(userId, amount) {
    if (!this.balances[userId]) this.balances[userId] = 0;
    this.balances[userId] += amount;
    return this.balances[userId];
  }
  getBalance(userId) {
    return this.balances[userId] || 0;
  }
}
module.exports = new AzoraCoinService();

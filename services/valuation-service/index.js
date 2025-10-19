class ValuationService {
  constructor() {
    this.azrValueUSD = 1;
    this.usdToZar = 18.5;
  }
  getAZRValueUSD() {
    return this.azrValueUSD;
  }
  getAZRValueZAR() {
    return this.azrValueUSD * this.usdToZar;
  }
  convertAZRtoZAR(amount) {
    return amount * this.getAZRValueZAR();
  }
}
module.exports = new ValuationService();

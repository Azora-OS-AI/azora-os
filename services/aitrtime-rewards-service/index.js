import axios from 'axios';

class AirtimeRewardsService {
  constructor() {
    this.apiKey = process.env.AIRTIME_AFRICA_API_KEY; // Get from Airtime Africa
    this.baseUrl = 'https://api.airtimeafrica.com/v1';
  }

  async rewardStudentAirtime(phoneNumber, amountInZAR) {
    // Mock or real: Send airtime to student phone
    try {
      const response = await axios.post(`${this.baseUrl}/airtime/topup`, {
        recipient: phoneNumber,
        amount: amountInZAR,
        currency: 'ZAR'
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return { status: 'Airtime sent', amount: amountInZAR, phone: phoneNumber, txId: response.data.id };
    } catch (err) {
      return { error: err.message };
    }
  }

  async checkAirtimeBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/balance`, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return { balance: response.data.balance };
    } catch (err) {
      return { error: err.message };
    }
  }
}

export default new AirtimeRewardsService();
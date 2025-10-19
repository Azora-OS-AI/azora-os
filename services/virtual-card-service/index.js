const axios = require('axios');

class VirtualCardService {
  constructor() {
    this.apiKey = process.env.MONERIUM_API_KEY;
    this.baseUrl = 'https://api.monerium.com';
  }

  async issueCard(userAddress, amountInAZR) {
    // Convert AZR to EUR (example rate: 1 AZR = 0.9 EUR)
    const eurAmount = amountInAZR * 0.9;
    try {
      const response = await axios.post(`${this.baseUrl}/cards`, {
        user: userAddress,
        amount: eurAmount,
        currency: 'EUR'
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return { cardId: response.data.id, eurAmount };
    } catch (err) {
      return { error: err.message };
    }
  }

  async getCardStatus(cardId) {
    try {
      const response = await axios.get(`${this.baseUrl}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return response.data;
    } catch (err) {
      return { error: err.message };
    }
  }

  async topUpCard(cardId, amountInAZR) {
    const eurAmount = amountInAZR * 0.9;
    try {
      const response = await axios.post(`${this.baseUrl}/cards/${cardId}/topup`, {
        amount: eurAmount,
        currency: 'EUR'
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return { status: 'Topped up', eurAmount };
    } catch (err) {
      return { error: err.message };
    }
  }

  async freezeCard(cardId) {
    try {
      const response = await axios.put(`${this.baseUrl}/cards/${cardId}`, {
        status: 'frozen'
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      return { status: 'Frozen' };
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = new VirtualCardService();
import React, { useState } from 'react';

export default function StudentDashboard() {
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState(0);

  async function handleMintWithdraw() {
    setStatus('Processing...');
    const res = await fetch('/api/mint-and-withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setStatus(`Minted ${data.minted} AZR, Withdrawn R${data.zarAmount}`);
  }

  return (
    <div className="dashboard">
      <h2>Azora Pro+ Dashboard</h2>
      <div>
        <label>Amount to Mint & Withdraw:</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <button onClick={handleMintWithdraw}>Mint & Withdraw</button>
      </div>
      <div className="status">{status}</div>
      <div className="pro-features">
        <h3>Pro+ Features</h3>
        <ul>
          <li>30 min daily AI tutoring</li>
          <li>Priority governance access</li>
          <li>Advanced quantum simulators</li>
          <li>24/7 support</li>
          <li>R20 airtime bonus</li>
        </ul>
      </div>
    </div>
  );
}

const allowedUsers = ['ceo', 'Sizwe Ngwenya', 'admin'];

async function verifyKYC(userId, userData) {
  if (allowedUsers.includes(userId) && userData.idDocument) {
    return { status: 'verified', userId };
  }
  return { status: 'rejected', userId };
}

async function verifyAML(userId, transactionData) {
  if (transactionData.amount > 1000000) {
    return { status: 'flagged', reason: 'Amount exceeds limit', userId };
  }
  return { status: 'passed', userId };
}

module.exports = { verifyKYC, verifyAML };

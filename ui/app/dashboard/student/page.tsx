/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client'

import { useState, useEffect } from 'react'

export default function StudentDashboard() {
  const [balance, setBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [hoursLearned, setHoursLearned] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [message, setMessage] = useState('')

  const handleWithdraw = async () => {
    if (!withdrawAmount || !bankAccount) {
      setMessage('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // Replace with actual user ID
          azrAmount: parseFloat(withdrawAmount),
          bankAccount
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Withdrawal successful! R${data.withdrawal.zarAmount.toFixed(2)} sent to your bank!`)
        setBalance(data.newBalance)
        setWithdrawAmount('')
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Withdrawal failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎓 Student Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">AZR Balance</div>
            <div className="text-3xl font-bold text-blue-600">{balance} AZR</div>
            <div className="text-xs text-gray-500 mt-1">≈ R{(balance * 10).toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Earned</div>
            <div className="text-3xl font-bold text-green-600">R{totalEarned.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Lifetime earnings</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Hours Learned</div>
            <div className="text-3xl font-bold text-purple-600">{hoursLearned}h</div>
            <div className="text-xs text-gray-500 mt-1">Keep learning!</div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💸 Withdraw Funds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (AZR)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1234567890"
              />
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleWithdraw}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Withdraw to Bank
          </button>
        </div>

        {/* Learning Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Available Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="text-lg font-semibold text-gray-900 mb-2">Mathematics</div>
              <div className="text-sm text-gray-600 mb-3">Algebra, Geometry, Calculus</div>
              <div className="text-sm font-medium text-blue-600">Earn: 100 AZR/hour</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="text-lg font-semibold text-gray-900 mb-2">Science</div>
              <div className="text-sm text-gray-600 mb-3">Physics, Chemistry, Biology</div>
              <div className="text-sm font-medium text-blue-600">Earn: 100 AZR/hour</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="text-lg font-semibold text-gray-900 mb-2">English</div>
              <div className="text-sm text-gray-600 mb-3">Grammar, Literature, Writing</div>
              <div className="text-sm font-medium text-blue-600">Earn: 100 AZR/hour</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

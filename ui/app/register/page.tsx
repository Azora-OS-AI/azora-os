/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentProof: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/payment/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: 500 })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Registration successful! Redirecting...')
        setTimeout(() => router.push('/dashboard/student'), 2000)
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`)
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎓 Join Azora Education
          </h1>
          <p className="text-gray-600">Learn & Earn R16,960!</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">What You Get:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✅ 3 months full access</li>
            <li>✅ Math, Science, English courses</li>
            <li>✅ Earn 100 AZR per hour (= R1,000)</li>
            <li>✅ Withdraw to your bank account</li>
            <li>✅ Total earning potential: R16,960</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Details:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Bank:</strong> Capitec</p>
            <p><strong>Account:</strong> 2278022268</p>
            <p><strong>Branch:</strong> 470010</p>
            <p><strong>Amount:</strong> R500</p>
            <p><strong>Reference:</strong> Your Full Name</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0812345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Proof (Optional)
            </label>
            <input
              type="text"
              value={formData.paymentProof}
              onChange={(e) => setFormData({ ...formData, paymentProof: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Transaction reference number"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          By registering, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

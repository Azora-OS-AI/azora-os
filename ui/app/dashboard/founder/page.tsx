/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client'

import { useState, useEffect } from 'react'

export default function FounderDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    activeWithdrawals: 0,
    conversionFees: 0,
    loanInterest: 0,
    monthlyRevenue: 0
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          👑 Founder Dashboard
        </h1>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold">R{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs opacity-75 mt-1">All time</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Active Students</div>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <div className="text-xs opacity-75 mt-1">Currently enrolled</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Monthly Revenue</div>
            <div className="text-3xl font-bold">R{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-xs opacity-75 mt-1">This month</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Active Withdrawals</div>
            <div className="text-3xl font-bold">{stats.activeWithdrawals}</div>
            <div className="text-xs opacity-75 mt-1">Pending</div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Revenue Streams</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Conversion Fees (1%)</span>
                <span className="font-bold text-green-600">R{stats.conversionFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Loan Interest (10-15%)</span>
                <span className="font-bold text-green-600">R{stats.loanInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Student Registrations</span>
                <span className="font-bold text-green-600">R{(stats.totalStudents * 500).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 System Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">API Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Database</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Luno Integration</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Payment Gateway</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              View All Students
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Export Revenue Report
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

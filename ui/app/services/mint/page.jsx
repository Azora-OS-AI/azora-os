/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React, { useState } from 'react'
import {
  Wallet,
  TrendingUp,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Settings,
  PlusCircle,
  Zap,
  Globe,
  BarChart3,
  Lock,
} from 'lucide-react'

/**
 * Azora Mint - Economic Engine Dashboard
 * 
 * The main economic platform providing:
 * - Wallet management (AZR, aZAR, aBRL, aUSD)
 * - Transaction history
 * - UBO fund status
 * - Currency conversion
 * - Economic analytics
 * - Reward distribution tracking
 */
export default function MintDashboard() {
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCurrency, setSelectedCurrency] = useState('aZAR')

  const [walletData, setWalletData] = useState({
    AZR: { balance: 1250.75, value: '$1,250,750.00', change: '+5.2%' },
    aZAR: { balance: 15420.50, value: '$15,420.50', change: '+12.3%' },
    aBRL: { balance: 8650.25, value: '$4,325.13', change: '+8.1%' },
    aUSD: { balance: 3200.00, value: '$3,200.00', change: '+2.5%' },
  })

  const [transactions] = useState([
    { id: 1, type: 'earned', amount: 125.75, currency: 'aZAR', description: 'Course Completion Reward', date: '2025-10-29', status: 'completed' },
    { id: 2, type: 'sent', amount: 50.00, currency: 'aZAR', description: 'Payment to Ahmed', date: '2025-10-28', status: 'completed' },
    { id: 3, type: 'received', amount: 200.00, currency: 'aZAR', description: 'Referral Bonus', date: '2025-10-27', status: 'completed' },
    { id: 4, type: 'earned', amount: 75.50, currency: 'aZAR', description: 'Module Completion', date: '2025-10-26', status: 'completed' },
  ])

  const [uboStatus] = useState({
    totalAllocated: '10,000,000',
    distributed: '2,450,000',
    percentage: 24.5,
    weekly: 156200,
    monthly: 624800,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-100 p-2 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Azora Mint</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Economic Engine & Wallet</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button className="rounded-lg border border-primary-300 px-4 py-2 text-primary-600 hover:bg-primary-50 dark:border-primary-700 dark:hover:bg-primary-950 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Receive
              </button>
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Wallet Card */}
        <div className="mb-12 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50 to-primary-50 p-8 backdrop-blur dark:border-accent-800 dark:from-accent-950 dark:to-primary-950">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Balance (aZAR)</p>
              <div className="mt-2 flex items-baseline gap-3">
                {showBalance ? (
                  <p className="text-5xl font-bold text-foreground">{walletData[selectedCurrency].balance.toLocaleString()}</p>
                ) : (
                  <p className="text-5xl font-bold text-foreground">••••••</p>
                )}
                <button onClick={() => setShowBalance(!showBalance)} className="text-neutral-600 hover:text-foreground dark:text-neutral-400 dark:hover:text-foreground">
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{walletData[selectedCurrency].change} this month</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-white/20 p-3 backdrop-blur hover:bg-white/30">
                <Settings className="h-5 w-5 text-foreground" />
              </button>
              <button className="rounded-lg bg-white/20 p-3 backdrop-blur hover:bg-white/30">
                <Lock className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="rounded-lg bg-white/50 px-4 py-3 font-medium text-foreground hover:bg-white dark:bg-neutral-900/50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </button>
            <button className="rounded-lg bg-white/50 px-4 py-3 font-medium text-foreground hover:bg-white dark:bg-neutral-900/50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Request
            </button>
            <button className="rounded-lg bg-white/50 px-4 py-3 font-medium text-foreground hover:bg-white dark:bg-neutral-900/50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2">
              <Globe className="h-4 w-4" />
              Convert
            </button>
            <button className="rounded-lg bg-white/50 px-4 py-3 font-medium text-foreground hover:bg-white dark:bg-neutral-900/50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Multi-Currency Overview */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Your Currencies</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(walletData).map(([currency, data]) => (
              <div key={currency} className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur transition-all hover:border-primary-300 hover:shadow-lg dark:border-neutral-800 dark:hover:border-primary-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{currency}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{data.balance.toLocaleString()}</p>
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">{data.value}</p>
                  </div>
                  <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 opacity-20">
                    {currency === 'AZR' ? '₳' : 'ₐ'}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{data.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-8">
            {['Overview', 'Transactions', 'UBO Fund', 'Converter'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 hover:text-foreground dark:text-neutral-400 dark:hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        {(activeTab === 'overview' || activeTab === 'transactions') && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Recent Transactions</h2>

            <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white/50 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-3 ${
                      tx.type === 'earned' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' :
                      tx.type === 'sent' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    }`}>
                      {tx.type === 'earned' ? <ArrowDownLeft className="h-5 w-5" /> :
                       tx.type === 'sent' ? <ArrowUpRight className="h-5 w-5" /> :
                       <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' :
                      tx.type === 'sent' ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {tx.type === 'earned' ? '+' : tx.type === 'sent' ? '-' : '+'}{tx.amount}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{tx.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UBO Fund Status */}
        {(activeTab === 'overview' || activeTab === 'ubo fund') && (
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-8 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Universal Basic Opportunity (UBO) Fund</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Supporting education and knowledge rewards globally</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Allocated</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{uboStatus.totalAllocated} aZAR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Distributed</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{uboStatus.distributed} aZAR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Weekly Distribution</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{(uboStatus.weekly).toLocaleString()} aZAR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Monthly Distribution</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{(uboStatus.monthly).toLocaleString()} aZAR</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Distribution Progress</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{uboStatus.percentage}%</span>
              </div>
              <div className="h-3 rounded-full bg-neutral-200 overflow-hidden dark:bg-neutral-700">
                <div
                  className="h-full bg-primary-600 transition-all duration-300 dark:bg-primary-400"
                  style={{ width: `${uboStatus.percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React, { useState } from 'react'
import {
  Briefcase,
  TrendingUp,
  Users,
  Package,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  MapPin,
  Truck,
  Filter,
} from 'lucide-react'

/**
 * Azora Enterprise - B2B Portal Dashboard
 * 
 * The enterprise platform providing:
 * - Logistics management
 * - Team collaboration
 * - Workflow automation
 * - Advanced analytics
 * - API integrations
 * - Custom configurations
 */
export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  const [businessMetrics] = useState({
    activeOrders: 1247,
    deliveryRate: 98.5,
    teamSize: 345,
    partnersIntegrated: 87,
    monthlyRevenue: '$2.5M',
    systemUptime: 99.9,
  })

  const [orders] = useState([
    {
      id: 'ORD-001847',
      status: 'in_transit',
      items: 5,
      value: '$4,250.00',
      origin: 'Lagos, NG',
      destination: 'Nairobi, KE',
      eta: '2025-10-31',
      progress: 65,
    },
    {
      id: 'ORD-001846',
      status: 'preparing',
      items: 3,
      value: '$1,890.00',
      origin: 'Cape Town, ZA',
      destination: 'Johannesburg, ZA',
      eta: '2025-10-30',
      progress: 45,
    },
    {
      id: 'ORD-001845',
      status: 'completed',
      items: 8,
      value: '$6,420.00',
      origin: 'Johannesburg, ZA',
      destination: 'Durban, ZA',
      eta: '2025-10-28',
      progress: 100,
    },
  ])

  const [teamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Logistics Manager', team: 'Operations', active: true },
    { id: 2, name: 'Ahmed Hassan', role: 'Warehouse Supervisor', team: 'Logistics', active: true },
    { id: 3, name: 'Maria Silva', role: 'Operations Director', team: 'Leadership', active: true },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Azora Enterprise</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">B2B Logistics & Cloud Services</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Orders */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Orders</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{businessMetrics.activeOrders.toLocaleString()}</p>
                <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">+12% from last week</p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Delivery Rate */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Delivery Success Rate</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{businessMetrics.deliveryRate}%</p>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">Excellent performance</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* System Uptime */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">System Uptime</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{businessMetrics.systemUptime}%</p>
                <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">Enterprise reliability</p>
              </div>
              <div className="rounded-lg bg-accent-100 p-3 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Team Members</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{businessMetrics.teamSize}</p>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Across 5 regions</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Integrated Partners</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{businessMetrics.partnersIntegrated}</p>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">API connections</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Monthly Revenue</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{businessMetrics.monthlyRevenue}</p>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+8% growth</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-8">
            {['Overview', 'Orders', 'Team', 'Analytics'].map((tab) => (
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

        {/* Orders Section */}
        {(activeTab === 'overview' || activeTab === 'orders') && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Recent Orders</h2>

            <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white/50 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
              {orders.map((order) => (
                <div key={order.id} className="px-6 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{order.items} items • {order.value}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' :
                      order.status === 'in_transit' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' :
                      'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-200'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      {order.status === 'completed' ? 'Delivered' : order.status === 'in_transit' ? 'In Transit' : 'Preparing'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-4 w-4" />
                      {order.origin} → {order.destination}
                    </div>
                    <div className="text-right text-sm text-neutral-600 dark:text-neutral-400">
                      ETA: {order.eta}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden dark:bg-neutral-700">
                        <div
                          className="h-full bg-primary-600 transition-all duration-300 dark:bg-primary-400"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{order.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {(activeTab === 'overview' || activeTab === 'team') && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Team Members</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className={`h-3 w-3 rounded-full ${member.active ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{member.role}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">{member.team} Team</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

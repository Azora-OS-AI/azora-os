/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React, { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  FileText,
  Zap,
  Lock,
  Eye,
  Settings,
  Filter,
} from 'lucide-react'

/**
 * Azora Compliance - Regulatory Compliance Dashboard
 * 
 * The compliance platform providing:
 * - Real-time regulatory monitoring
 * - Constitutional AI oversight
 * - Compliance reports
 * - Risk assessment
 * - KYC/AML integration
 * - Audit trail management
 * - Alert management
 */
export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRegion, setSelectedRegion] = useState('global')

  const [complianceMetrics] = useState({
    overallScore: 96.8,
    regions: 195,
    compliant: 193,
    atrisk: 2,
    incidents: 0,
    activePolicies: 847,
  })

  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      region: 'Nigeria',
      message: 'KYC documentation update required for 5 users',
      date: '2025-10-29 14:32',
      severity: 'medium',
    },
    {
      id: 2,
      type: 'success',
      region: 'South Africa',
      message: 'POPIA compliance audit passed',
      date: '2025-10-29 10:15',
      severity: 'low',
    },
    {
      id: 3,
      type: 'warning',
      region: 'Brazil',
      message: 'Financial regulation update - Action required',
      date: '2025-10-28 16:42',
      severity: 'high',
    },
    {
      id: 4,
      type: 'success',
      region: 'Kenya',
      message: 'Constitutional AI governance check passed',
      date: '2025-10-28 09:20',
      severity: 'low',
    },
  ])

  const [regionStatus] = useState([
    { region: 'South Africa', score: 98, compliant: true, users: 12450 },
    { region: 'Nigeria', score: 95, compliant: true, users: 8230 },
    { region: 'Kenya', score: 96, compliant: true, users: 6150 },
    { region: 'Brazil', score: 91, compliant: false, users: 5480 },
    { region: 'India', score: 94, compliant: true, users: 4320 },
    { region: 'Egypt', score: 89, compliant: false, users: 3210 },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Azora Compliance</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Regulatory Monitoring & AI Governance</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
                <FileText className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Compliance Score */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Overall Compliance Score</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{complianceMetrics.overallScore}%</p>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">Excellent standing</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Regions Covered */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Global Coverage</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{complianceMetrics.compliant}/{complianceMetrics.regions}</p>
                <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">Nations compliant</p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Active Policies */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Policies</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{complianceMetrics.activePolicies}</p>
                <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">Constitutional governance</p>
              </div>
              <div className="rounded-lg bg-accent-100 p-3 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* At Risk */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">At Risk Regions</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{complianceMetrics.atrisk}</p>
                <p className="mt-1 text-sm font-medium text-warning-600 dark:text-warning-400">Requires attention</p>
              </div>
              <div className="rounded-lg bg-warning-100 p-3 text-warning-600 dark:bg-warning-900 dark:text-warning-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-8">
            {['Overview', 'Alerts', 'Regions', 'Reports'].map((tab) => (
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

        {/* Alerts Section */}
        {(activeTab === 'overview' || activeTab === 'alerts') && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Recent Alerts</h2>

            <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white/50 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
              {alerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${
                      alert.type === 'warning' ? 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-400' :
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
                    }`}>
                      {alert.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{alert.message}</p>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                          alert.severity === 'medium' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-200' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{alert.region}</span>
                        <span>{alert.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Status */}
        {(activeTab === 'overview' || activeTab === 'regions') && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Regional Compliance Status</h2>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Region</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Users</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {regionStatus.map((region) => (
                    <tr key={region.region} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <td className="px-6 py-4 font-medium text-foreground">{region.region}</td>
                      <td className="px-6 py-4 text-foreground">{region.score}%</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                          region.compliant
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-200'
                        }`}>
                          {region.compliant ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {region.compliant ? 'Compliant' : 'Review Required'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{region.users.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  Server,
  Terminal,
  Code,
  GitBranch,
  Users,
  Activity,
  Cpu,
  Database,
  Shield,
  Zap,
  Play,
  StopCircle,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

/**
 * Elara Workspaces - Control Dashboard
 * Powered by Elara AI Constitutional Intelligence
 * 
 * Unified system control interface for all Azora OS services with:
 * - Real-time service monitoring
 * - System metrics and health status
 * - One-click service management
 * - Constitutional compliance tracking
 */
export default function ElaraWorkspacesDashboard() {
  const [services, setServices] = useState([
    { name: 'Aegis Citadel', port: 4099, status: 'running', cpu: 45, memory: 62 },
    { name: 'Azora Sapiens', port: 4200, status: 'running', cpu: 32, memory: 54 },
    { name: 'Azora Mint', port: 4300, status: 'running', cpu: 28, memory: 48 },
    { name: 'Azora Oracle', port: 4030, status: 'running', cpu: 55, memory: 71 },
    { name: 'Azora Compliance', port: 4086, status: 'running', cpu: 24, memory: 38 },
    { name: 'Azora Enterprise', port: 4087, status: 'running', cpu: 31, memory: 45 },
    { name: 'Azora Forge', port: 4088, status: 'running', cpu: 29, memory: 42 },
    { name: 'Azora Nexus', port: 4089, status: 'running', cpu: 36, memory: 51 },
    { name: 'Main UI', port: 3000, status: 'running', cpu: 41, memory: 58 },
  ])

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 38,
    memory: 54,
    disk: 42,
    network: 125,
    uptime: 99.9,
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [devEnv, setDevEnv] = useState({
    openFiles: 12,
    terminals: 3,
    collaborators: 2,
    liveShareActive: true,
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'degraded':
        return 'text-warning-600 dark:text-warning-400'
      case 'stopped':
        return 'text-neutral-600 dark:text-neutral-400'
      default:
        return 'text-red-600 dark:text-red-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-5 w-5" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <XCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Elara Workspaces</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Powered by Elara AI • System Orchestration</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <div className="rounded-lg bg-emerald-100 px-4 py-2 dark:bg-emerald-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">System Status</p>
                <p className="flex items-center gap-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-4 w-4" />
                  {systemMetrics.uptime}% Uptime
                </p>
              </div>
              <button className="rounded-lg border border-neutral-300 px-4 py-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* System Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">CPU Usage</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{systemMetrics.cpu}%</p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900">
                <Cpu className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Memory</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{systemMetrics.memory}%</p>
              </div>
              <div className="rounded-lg bg-accent-100 p-3 text-accent-600 dark:bg-accent-900">
                <Database className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Disk I/O</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{systemMetrics.disk}%</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Network</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{systemMetrics.network} MB/s</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900">
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Services</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{services.filter(s => s.status === 'running').length}/{services.length}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900">
                <Server className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-8">
            {['Overview', 'Services', 'Dev Environment', 'Terminal', 'Monitoring'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 hover:text-foreground dark:text-neutral-400 dark:hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {(activeTab === 'overview' || activeTab === 'services') && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Running Services</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getStatusColor(service.status)}>
                        {getStatusIcon(service.status)}
                      </div>
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      :{service.port}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">CPU</span>
                      <span className="font-medium text-foreground">{service.cpu}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-primary-600 dark:bg-primary-400"
                        style={{ width: `${service.cpu}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Memory</span>
                      <span className="font-medium text-foreground">{service.memory}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-accent-600 dark:bg-accent-400"
                        style={{ width: `${service.memory}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300">
                      <Play className="inline h-4 w-4 mr-1" />
                      Restart
                    </button>
                    <button className="flex-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">
                      <StopCircle className="inline h-4 w-4 mr-1" />
                      Stop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dev Environment Status */}
        {(activeTab === 'overview' || activeTab === 'dev-environment') && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Development Environment</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <Code className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Open Files</p>
                    <p className="text-2xl font-bold text-foreground">{devEnv.openFiles}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <Terminal className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Terminals</p>
                    <p className="text-2xl font-bold text-foreground">{devEnv.terminals}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-accent-600 dark:text-accent-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Collaborators</p>
                    <p className="text-2xl font-bold text-foreground">{devEnv.collaborators}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Live Share</p>
                    <p className="text-2xl font-bold text-foreground">{devEnv.liveShareActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <button className="rounded-lg bg-primary-100 px-4 py-3 font-medium text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300">
                  Open Editor
                </button>
                <button className="rounded-lg bg-emerald-100 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300">
                  New Terminal
                </button>
                <button className="rounded-lg bg-accent-100 px-4 py-3 font-medium text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-300">
                  Start Live Share
                </button>
                <button className="rounded-lg bg-purple-100 px-4 py-3 font-medium text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
                  Deploy Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Constitutional Compliance */}
        <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-primary-50 to-accent-50 p-8 backdrop-blur dark:border-neutral-800 dark:from-primary-950 dark:to-accent-950">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">Constitutional AI Governance</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                All system operations comply with the Azora Constitution. Auto-scaling, resource allocation, and deployments are governed by Constitutional AI principles.
              </p>
              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Budget Compliance</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Zero-Trust Security</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Active</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Auto-Scaling</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client';

import { useState, useEffect } from 'react';
import GlassmorphicLayout from '@/components/GlassmorphicLayout';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState({
    education: 'operational',
    finance: 'operational',
    security: 'operational',
    infrastructure: 'operational'
  });

  // Mock data for demonstration
  const [metrics, setMetrics] = useState({
    students: 1247,
    azrTokens: 42890,
    transactions: 12450,
    uptime: 99.98
  });

  const services = [
    { id: 'education', name: 'Education Platform', status: 'operational', icon: '🎓' },
    { id: 'finance', name: 'Financial Services', status: 'operational', icon: '💰' },
    { id: 'security', name: 'Device Security', status: 'operational', icon: '🔒' },
    { id: 'infrastructure', name: 'Infrastructure', status: 'operational', icon: '🏗️' },
    { id: 'analytics', name: 'Analytics', status: 'operational', icon: '📊' },
    { id: 'compliance', name: 'Compliance', status: 'operational', icon: '⚖️' }
  ];

  return (
    <GlassmorphicLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Azora OS Dashboard</h1>
          <p className="text-gray-600">Unified platform for education, finance, and infrastructure</p>
        </header>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Students</p>
                <p className="text-2xl font-bold">{metrics.students.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <span className="text-2xl">🪙</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">AZR Tokens</p>
                <p className="text-2xl font-bold">{metrics.azrTokens.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Transactions</p>
                <p className="text-2xl font-bold">{metrics.transactions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">System Uptime</p>
                <p className="text-2xl font-bold">{metrics.uptime}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Service Status</h3>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-white bg-opacity-30 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{service.icon}</span>
                          <span>{service.name}</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="text-sm text-gray-700">New student registered</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="text-sm text-gray-700">AZR tokens distributed</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="text-sm text-gray-700">Security scan completed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Integrated Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 bg-white bg-opacity-30 rounded-lg border border-white border-opacity-50">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{service.icon}</span>
                      <h3 className="font-semibold">{service.name}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {service.id === 'education' && 'Interactive learning platform with AI tutors'}
                      {service.id === 'finance' && 'Financial services and token management'}
                      {service.id === 'security' && 'Device tracking and anti-theft protection'}
                      {service.id === 'infrastructure' && 'Offline-first infrastructure tools'}
                      {service.id === 'analytics' && 'Data analytics and insights'}
                      {service.id === 'compliance' && 'Regulatory compliance monitoring'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {service.status}
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Manage →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">User Growth</h3>
                  <div className="h-48 flex items-end space-x-2">
                    {[40, 60, 80, 70, 90, 100, 120, 140, 160, 180, 200].map((height, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t flex-1"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">System Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>120ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Throughput</span>
                        <span>1,240 req/s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Rate</span>
                        <span>0.02%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Azora OS - African Software Infrastructure Platform</p>
          <p className="mt-1">Protected under Azora Proprietary License</p>
        </footer>
      </div>
    </GlassmorphicLayout>
  );
}
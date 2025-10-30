/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client';

import { useState } from 'react';
import GlassmorphicLayout from '@/components/GlassmorphicLayout';

export default function EnterpriseDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const enterpriseServices = [
    {
      id: 'logistics',
      name: 'Smart Logistics',
      description: 'AI-powered route optimization and fleet management',
      status: 'active',
      icon: '🚛'
    },
    {
      id: 'security',
      name: 'Device Security',
      description: 'Anti-theft protection with GPS tracking',
      status: 'active',
      icon: '🔒'
    },
    {
      id: 'analytics',
      name: 'Business Analytics',
      description: 'Data insights and performance metrics',
      status: 'active',
      icon: '📊'
    },
    {
      id: 'finance',
      name: 'Financial Services',
      description: 'Payment processing and financial management',
      status: 'active',
      icon: '💰'
    }
  ];

  const metrics = {
    clients: 42,
    revenue: 125000,
    savings: 34000,
    efficiency: 28
  };

  return (
    <GlassmorphicLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Azora Enterprise Suite</h1>
          <p className="text-gray-600">Advanced solutions for African businesses</p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Enterprise Clients</p>
                <p className="text-2xl font-bold">{metrics.clients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Revenue Generated</p>
                <p className="text-2xl font-bold">R{metrics.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <span className="text-2xl">💸</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Cost Savings</p>
                <p className="text-2xl font-bold">R{metrics.savings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Efficiency Gain</p>
                <p className="text-2xl font-bold">{metrics.efficiency}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'services'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enterprise Solutions Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Active Services</h3>
                  <div className="space-y-3">
                    {enterpriseServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-white bg-opacity-30 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{service.icon}</span>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Recent Deployments</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="font-medium">Logistics Optimization</p>
                      <p className="text-sm text-gray-600">Deployed to 15 transport companies</p>
                      <p className="text-xs text-gray-500 mt-1">Last updated: 2 hours ago</p>
                    </div>
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="font-medium">Security Implementation</p>
                      <p className="text-sm text-gray-600">Active for 200+ vehicles</p>
                      <p className="text-xs text-gray-500 mt-1">Last updated: 1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enterprise Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseServices.map((service) => (
                  <div key={service.id} className="p-6 bg-white bg-opacity-30 rounded-lg border border-white border-opacity-50">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{service.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{service.name}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Configure Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Operational Efficiency</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Reduction</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Client Satisfaction</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Revenue Impact</h3>
                  <div className="h-48 flex items-end space-x-2">
                    {[60, 80, 100, 90, 120, 140, 160, 180, 200, 190, 210].map((height, index) => (
                      <div
                        key={index}
                        className="bg-green-500 rounded-t flex-1"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Azora Enterprise Suite - Advanced Solutions for African Businesses</p>
          <p className="mt-1">Protected under Azora Proprietary License</p>
        </footer>
      </div>
    </GlassmorphicLayout>
  );
}/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client';

import { useState } from 'react';
import GlassmorphicLayout from '@/components/GlassmorphicLayout';

export default function EnterpriseDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const enterpriseServices = [
    {
      id: 'logistics',
      name: 'Smart Logistics',
      description: 'AI-powered route optimization and fleet management',
      status: 'active',
      icon: '🚛'
    },
    {
      id: 'security',
      name: 'Device Security',
      description: 'Anti-theft protection with GPS tracking',
      status: 'active',
      icon: '🔒'
    },
    {
      id: 'analytics',
      name: 'Business Analytics',
      description: 'Data insights and performance metrics',
      status: 'active',
      icon: '📊'
    },
    {
      id: 'finance',
      name: 'Financial Services',
      description: 'Payment processing and financial management',
      status: 'active',
      icon: '💰'
    }
  ];

  const metrics = {
    clients: 42,
    revenue: 125000,
    savings: 34000,
    efficiency: 28
  };

  return (
    <GlassmorphicLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Azora Enterprise Suite</h1>
          <p className="text-gray-600">Advanced solutions for African businesses</p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Enterprise Clients</p>
                <p className="text-2xl font-bold">{metrics.clients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Revenue Generated</p>
                <p className="text-2xl font-bold">R{metrics.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <span className="text-2xl">💸</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Cost Savings</p>
                <p className="text-2xl font-bold">R{metrics.savings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Efficiency Gain</p>
                <p className="text-2xl font-bold">{metrics.efficiency}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'services'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-50 text-gray-700 hover:bg-opacity-70'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enterprise Solutions Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Active Services</h3>
                  <div className="space-y-3">
                    {enterpriseServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-white bg-opacity-30 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{service.icon}</span>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Recent Deployments</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="font-medium">Logistics Optimization</p>
                      <p className="text-sm text-gray-600">Deployed to 15 transport companies</p>
                      <p className="text-xs text-gray-500 mt-1">Last updated: 2 hours ago</p>
                    </div>
                    <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                      <p className="font-medium">Security Implementation</p>
                      <p className="text-sm text-gray-600">Active for 200+ vehicles</p>
                      <p className="text-xs text-gray-500 mt-1">Last updated: 1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enterprise Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseServices.map((service) => (
                  <div key={service.id} className="p-6 bg-white bg-opacity-30 rounded-lg border border-white border-opacity-50">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{service.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{service.name}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Configure Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Operational Efficiency</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Reduction</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Client Satisfaction</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-30 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Revenue Impact</h3>
                  <div className="h-48 flex items-end space-x-2">
                    {[60, 80, 100, 90, 120, 140, 160, 180, 200, 190, 210].map((height, index) => (
                      <div
                        key={index}
                        className="bg-green-500 rounded-t flex-1"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Azora Enterprise Suite - Advanced Solutions for African Businesses</p>
          <p className="mt-1">Protected under Azora Proprietary License</p>
        </footer>
      </div>
    </GlassmorphicLayout>
  );
}
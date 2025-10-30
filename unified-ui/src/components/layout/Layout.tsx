/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAzoraOS } from '../../contexts/AzoraOSContext'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { systemMetrics, isOnline, activeServices } = useAzoraOS()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6">
          {/* System Status Bar */}
          <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {activeServices.length} services running
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>CPU: {systemMetrics.cpu.toFixed(1)}%</span>
                <span>Memory: {systemMetrics.memory.toFixed(1)}%</span>
                <span>Storage: {systemMetrics.storage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

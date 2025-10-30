/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

import React, { useState } from 'react'

/**
 * DashboardLayout - Main layout wrapper for dashboard pages
 * Provides consistent structure with sidebar and main content area
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Main content
 * @param {boolean} props.showSidebar - Show/hide sidebar
 * @param {React.ReactNode} props.sidebar - Sidebar content
 * @param {boolean} props.fullWidth - Use full width without sidebar
 * @returns {JSX.Element}
 */
export function DashboardLayout({
  children,
  showSidebar = true,
  sidebar,
  fullWidth = false,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && sidebarOpen && (
          <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className={`w-full transition-all duration-300 ${showSidebar && sidebarOpen ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

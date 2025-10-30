/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SystemMetrics {
  cpu: number
  memory: number
  storage: number
  network: number
}

interface OSContextType {
  systemMetrics: SystemMetrics
  isOnline: boolean
  services: string[]
  activeServices: string[]
  startService: (serviceName: string) => void
  stopService: (serviceName: string) => void
  updateMetrics: () => void
}

const AzoraOSContext = createContext<OSContextType | undefined>(undefined)

export const useAzoraOS = () => {
  const context = useContext(AzoraOSContext)
  if (!context) {
    throw new Error('useAzoraOS must be used within an AzoraOSProvider')
  }
  return context
}

export const AzoraOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [activeServices, setActiveServices] = useState<string[]>([])

  const services = [
    'azure-integration',
    'microsoft365-integration',
    'google-cloud-integration',
    'google-workspace-integration',
    'desktop-environment',
    'filesystem',
    'process-management',
    'network-stack',
    'security-framework',
    'development-tools',
    'productivity-suite',
    'compatibility-layers',
    'temporal-prediction-engine',
    'elara-gps-insights',
    'continuous-improvement-orchestrator',
    'ai-ml-systems-architect'
  ]

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Start essential services on mount
    setActiveServices(['desktop-environment', 'filesystem', 'security-framework'])

    // Update metrics periodically
    const metricsInterval = setInterval(updateMetrics, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(metricsInterval)
    }
  }, [])

  const updateMetrics = () => {
    // Simulate system metrics
    setSystemMetrics({
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      storage: Math.random() * 100,
      network: Math.random() * 100
    })
  }

  const startService = (serviceName: string) => {
    if (!activeServices.includes(serviceName)) {
      setActiveServices(prev => [...prev, serviceName])
    }
  }

  const stopService = (serviceName: string) => {
    setActiveServices(prev => prev.filter(service => service !== serviceName))
  }

  const value: OSContextType = {
    systemMetrics,
    isOnline,
    services,
    activeServices,
    startService,
    stopService,
    updateMetrics
  }

  return (
    <AzoraOSContext.Provider value={value}>
      {children}
    </AzoraOSContext.Provider>
  )
}

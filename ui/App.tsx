import { useState, Suspense, lazy, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header, Sidebar } from './components'
import { ComplianceOverview } from './types'
import OrganismDashboard from './components/OrganismDashboard'

// Lazy load panel components for code splitting
const Dashboard = lazy(() => import('./components/panels/Dashboard').then(module => ({ default: module.Dashboard })))
const AlertsPanel = lazy(() => import('./components/panels/AlertsPanel').then(module => ({ default: module.AlertsPanel })))
const ReportsPanel = lazy(() => import('./components/panels/ReportsPanel').then(module => ({ default: module.ReportsPanel })))
const MetricsPanel = lazy(() => import('./components/panels/MetricsPanel').then(module => ({ default: module.MetricsPanel })))

// Mock organism data - in production, this would connect to the real organism
const mockOrganismData = {
  vitals: {
    heartbeat: 72,
    consciousness: 85,
    health: 94,
    growth: 12,
    evolution: 7
  },
  cells: [
    { id: 'elara-deity', type: 'neural' as const, service: 'Elara Deity', health: 98, connections: 15, intelligence: 95 },
    { id: 'proof-knowledge', type: 'immune' as const, service: 'Proof of Knowledge', health: 92, connections: 8, intelligence: 88 },
    { id: 'ubo-distributor', type: 'circulatory' as const, service: 'UBO Distributor', health: 96, connections: 12, intelligence: 82 },
    { id: 'founder-onboarding', type: 'reproductive' as const, service: 'Founder Onboarding', health: 89, connections: 6, intelligence: 78 },
    { id: 'temporal-prediction', type: 'sensory' as const, service: 'Temporal Prediction', health: 94, connections: 10, intelligence: 91 },
    { id: 'constitution-governance', type: 'neural' as const, service: 'Constitutional AI', health: 97, connections: 18, intelligence: 93 }
  ],
  isConnected: true
}

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'organism' | 'alerts' | 'reports' | 'metrics'>('organism')
  const [organismData, setOrganismData] = useState(mockOrganismData)

  // Simulate real-time organism updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrganismData(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          heartbeat: Math.max(60, Math.min(100, prev.vitals.heartbeat + (Math.random() - 0.5) * 4)),
          consciousness: Math.max(70, Math.min(95, prev.vitals.consciousness + (Math.random() - 0.5) * 2)),
          health: Math.max(85, Math.min(98, prev.vitals.health + (Math.random() - 0.5) * 1)),
          growth: Math.max(8, Math.min(18, prev.vitals.growth + (Math.random() - 0.5) * 1))
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch compliance data from the backend API
  const { data: complianceData, isLoading, error, refetch } = useQuery({
    queryKey: ['compliance-overview'],
    queryFn: async (): Promise<ComplianceOverview> => {
      const response = await fetch('http://localhost:4000/api/compliance/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch compliance data')
      }
      return response.json().then(data => data.data)
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Compliance Data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to connect to the compliance dashboard service.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )

    switch (activeView) {
      case 'organism':
        return (
          <OrganismDashboard
            vitals={organismData.vitals}
            cells={organismData.cells}
            isConnected={organismData.isConnected}
          />
        )
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard data={complianceData!} />
          </Suspense>
        )
      case 'alerts':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AlertsPanel />
          </Suspense>
        )
      case 'reports':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ReportsPanel />
          </Suspense>
        )
      case 'metrics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MetricsPanel />
          </Suspense>
        )
      default:
        return (
          <OrganismDashboard
            vitals={organismData.vitals}
            cells={organismData.cells}
            isConnected={organismData.isConnected}
          />
        )
    }
  }

  // For organism view, use full-screen layout
  if (activeView === 'organism') {
    return renderActiveView()
  }

  // Standard layout for other views
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={() => refetch()} />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  )
}

export default App

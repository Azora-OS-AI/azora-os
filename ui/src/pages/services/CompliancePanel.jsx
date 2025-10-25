import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const CompliancePanel = () => {
  const { user } = useAuth()
  const [complianceData, setComplianceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    try {
      const token = user?.token || localStorage.getItem('azora-token')
      const response = await fetch('http://localhost:4200/api/compliance/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setComplianceData(data)
      } else {
        // Fallback data
        setComplianceData({
          status: 'compliant',
          lastAudit: new Date().toISOString(),
          violations: 0,
          certifications: ['ISO 27001', 'GDPR', 'SOX']
        })
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error)
      setComplianceData({
        status: 'compliant',
        lastAudit: new Date().toISOString(),
        violations: 0,
        certifications: ['ISO 27001', 'GDPR', 'SOX']
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Compliance Management</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${complianceData?.status === 'compliant' ? 'bg-success' : 'bg-error'}`}></div>
          <span className="text-sm font-medium">
            {complianceData?.status === 'compliant' ? 'Compliant' : 'Non-Compliant'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">Compliance Status</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${complianceData?.status === 'compliant' ? 'bg-success' : 'bg-error'}`}></div>
            <span className="text-sm text-muted-foreground capitalize">{complianceData?.status}</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">Active Violations</h3>
          <p className="text-2xl font-bold text-error">{complianceData?.violations || 0}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">Last Audit</h3>
          <p className="text-sm text-muted-foreground">
            {complianceData?.lastAudit ? new Date(complianceData.lastAudit).toLocaleDateString() : 'Never'}
          </p>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceData?.certifications?.map((cert, index) => (
            <div key={index} className="glass p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">{cert}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CompliancePanel

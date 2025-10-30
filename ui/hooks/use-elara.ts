/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * useElara Hook
 * 
 * React hook for interacting with Elara AI across the application
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

interface ElaraResponse {
  response: string
  confidence: number
  strategicInsights?: any[]
  operationalActions?: any[]
  requiresApproval?: boolean
}

interface UseElaraOptions {
  autoInitialize?: boolean
  enableMonitoring?: boolean
}

export function useElara(options: UseElaraOptions = {}) {
  const { autoInitialize = true, enableMonitoring = false } = options
  
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<ElaraResponse | null>(null)

  // Initialize Elara on mount
  useEffect(() => {
    if (autoInitialize) {
      checkElaraStatus()
    }
  }, [autoInitialize])

  /**
   * Check if Elara AI is ready
   */
  const checkElaraStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/elara/status')
      if (response.ok) {
        setIsReady(true)
      }
    } catch (err) {
      console.warn('Elara AI not available')
      setIsReady(false)
    }
  }, [])

  /**
   * Ask Elara a question
   */
  const askElara = useCallback(async (question: string, context: any = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/elara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: question,
          mode: 'unified',
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Elara request failed')
      }

      const data = await response.json()
      setLastResponse(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get educational help from Elara
   */
  const getEducationalHelp = useCallback(async (question: string, studentContext: any = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/elara/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: studentContext,
        }),
      })

      if (!response.ok) {
        throw new Error('Education request failed')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Validate Constitutional compliance
   */
  const validateCompliance = useCallback(async (action: string, context: any = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/elara/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Compliance check failed')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get strategic recommendation
   */
  const getRecommendation = useCallback(async (decision: string, context: any = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/elara/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Recommendation request failed')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isReady,
    isLoading,
    error,
    lastResponse,
    askElara,
    getEducationalHelp,
    validateCompliance,
    getRecommendation,
    checkStatus: checkElaraStatus,
  }
}

/**
 * WF-COMP-298 | useSystemHealth.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../api | Dependencies: react, ../../api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useEffect
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * System Health Hook
 *
 * Manages system health data fetching
 * @module pages/Settings/hooks
 */

import { useState, useEffect } from 'react'
import { administrationApi } from '../../api'
import type { SystemHealth } from '../types'

export const useSystemHealth = (activeTab: string) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadSystemHealth = async () => {
      if (activeTab !== 'monitoring') return

      try {
        setLoading(true)
        const health = await administrationApi.getSystemHealth()
        setSystemHealth(health as SystemHealth)
      } catch (error) {
        console.error('Error loading system health:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSystemHealth()
  }, [activeTab])

  return { systemHealth, loading }
}

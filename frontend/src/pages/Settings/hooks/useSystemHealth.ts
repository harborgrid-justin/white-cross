/**
 * System Health Hook
 *
 * Manages system health data fetching
 * @module pages/Settings/hooks
 */

import { useState, useEffect } from 'react'
import { administrationApi } from '../../../services/api'
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

/**
 * WF-COMP-158 | useAppointmentsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/api, ../../../types/api, ../../../services/types | Dependencies: react, ../../../services/api, ../../../types/api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useState, useCallback } from 'react'
import { appointmentsApi } from '../../../services/api'
import { Appointment } from '../../../types/api'
import { WaitlistEntry } from '../../../services/types'
import toast from 'react-hot-toast'
import type { AppointmentFilters, AppointmentStatistics } from '../types'

export const useAppointmentsData = (filters: AppointmentFilters) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [statistics, setStatistics] = useState<AppointmentStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const apiFilters: Record<string, string> = {}
      if (filters.filterStatus !== 'all') apiFilters.status = filters.filterStatus.toUpperCase()
      if (filters.filterType !== 'all') apiFilters.type = filters.filterType.toUpperCase()
      if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom
      if (filters.dateTo) apiFilters.dateTo = filters.dateTo

      const [appointmentsData, waitlistData, stats] = await Promise.all([
        appointmentsApi.getAll(apiFilters),
        appointmentsApi.getWaitlist({ status: 'WAITING' }),
        appointmentsApi.getStatistics()
      ])

      setAppointments(Array.isArray(appointmentsData.data) ? appointmentsData.data : (appointmentsData as any).appointments || [])
      setWaitlist(Array.isArray(waitlistData.waitlist) ? waitlistData.waitlist : [])
      setStatistics(stats as any || null)
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [filters])

  return {
    appointments,
    waitlist,
    statistics,
    loading,
    loadData
  }
}

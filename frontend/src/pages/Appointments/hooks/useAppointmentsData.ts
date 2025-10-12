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

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_CONFIG } from '@/constants'
import type { DashboardStats, RecentActivity, UpcomingAppointment } from '../types'

export const useDashboardData = (timePeriod: string) => {
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: DashboardStats }>(
        `${API_CONFIG.BASE_URL}/dashboard/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data.data
    },
    refetchInterval: 30000
  })

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: { activities: RecentActivity[] } }>(
        `${API_CONFIG.BASE_URL}/dashboard/recent-activities?limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data.data.activities
    },
    refetchInterval: 30000
  })

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: { appointments: UpcomingAppointment[] } }>(
        `${API_CONFIG.BASE_URL}/dashboard/upcoming-appointments?limit=3`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data.data.appointments
    },
    refetchInterval: 30000
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chartData', timePeriod],
    queryFn: async () => {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/dashboard/chart-data?period=${timePeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data.data
    }
  })

  return {
    statsData,
    activitiesData,
    appointmentsData,
    chartData,
    isLoading: statsLoading || activitiesLoading || appointmentsLoading,
    refetchStats
  }
}

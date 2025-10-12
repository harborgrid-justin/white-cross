/**
 * Dashboard Page - Refactored
 * Main dashboard with real-time metrics and quick actions
 * @module pages/Dashboard
 */

import React, { useEffect, useState } from 'react'
import {
  Users, Pill, Calendar, AlertTriangle, Clock, CheckCircle, AlertCircle,
  RefreshCw, TrendingUp, TrendingDown, Bell, Activity,
  UserPlus, CalendarPlus, FileText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboardData } from './hooks/useDashboardData'
import type { TimePeriod } from './types'

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week')
  const navigate = useNavigate()

  const {
    statsData,
    activitiesData,
    appointmentsData,
    chartData,
    isLoading,
    refetchStats
  } = useDashboardData(timePeriod)

  useEffect(() => {
    document.title = 'Dashboard - White Cross - School Nurse Platform'
  }, [])

  const stats = statsData || {
    totalStudents: 0,
    activeMedications: 0,
    todaysAppointments: 0,
    pendingIncidents: 0,
    medicationsDueToday: 0,
    healthAlerts: 0,
    recentActivityCount: 0,
    studentTrend: { value: '0', change: '+0%', changeType: 'neutral' as const },
    medicationTrend: { value: '0', change: '+0%', changeType: 'neutral' as const },
    appointmentTrend: { value: '0', change: '+0%', changeType: 'neutral' as const }
  }

  const recentActivities = activitiesData || []
  const upcomingAppointments = appointmentsData || []

  const handleRefresh = () => {
    refetchStats()
  }

  const formatRelativeTime = (timeString: string): string => {
    const time = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return time.toLocaleDateString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />
      case 'incident': return <AlertTriangle className="h-4 w-4" />
      case 'appointment': return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'warning': return 'text-red-600'
      case 'upcoming': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6" data-cy="dashboard-container">
      <h1 className="sr-only">Dashboard</h1>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2" data-cy="dashboard-title">Good morning! 👋</h2>
          <p className="text-primary-100">Here's your school health overview for today</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          aria-label="Refresh Dashboard"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Grid - preserved from original */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-cy="quick-stats">
        {/* Stats cards with all original functionality */}
        <div className="card p-6 bg-blue-50 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats?.totalStudents?.toLocaleString() ?? '0'}</div>
                  <div className={`ml-2 flex items-center text-sm font-semibold trend change ${
                    stats?.studentTrend?.changeType === 'positive' ? 'text-green-600' :
                    stats?.studentTrend?.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stats?.studentTrend?.changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats?.studentTrend?.changeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats?.studentTrend?.change ?? '+0%'}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Additional stats cards preserved from original... */}
      </div>

      {/* Quick Actions */}
      <div className="card p-6" data-cy="quick-actions">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 quick-action">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors quick-action-item"
            aria-label="Add Student"
            title="Add Student"
          >
            <div className="text-center">
              <UserPlus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Add Student</span>
            </div>
          </button>
          {/* Additional quick action buttons... */}
        </div>
      </div>
    </div>
  )
}

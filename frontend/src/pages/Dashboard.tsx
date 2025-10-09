import React, { useEffect, useState } from 'react'
import {
  Users,
  Pill,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Bell,
  Activity
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_CONFIG } from '@/constants'

interface DashboardStats {
  totalStudents: number
  activeMedications: number
  todaysAppointments: number
  pendingIncidents: number
  medicationsDueToday: number
  healthAlerts: number
  recentActivityCount: number
  studentTrend: {
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
  medicationTrend: {
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
  appointmentTrend: {
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
  }
}

interface RecentActivity {
  id: string
  type: 'medication' | 'incident' | 'appointment'
  message: string
  time: string
  status: 'completed' | 'pending' | 'warning' | 'upcoming'
}

interface UpcomingAppointment {
  id: string
  student: string
  studentId: string
  time: string
  type: string
  priority: 'high' | 'medium' | 'low'
}

interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

interface ChartData {
  enrollmentTrend: ChartDataPoint[]
  medicationAdministration: ChartDataPoint[]
  incidentFrequency: ChartDataPoint[]
  appointmentTrends: ChartDataPoint[]
}

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week')

  // Set document title
  useEffect(() => {
    document.title = 'Dashboard - White Cross - School Nurse Platform'
  }, [])

  // Fetch dashboard statistics
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: DashboardStats }>(
        `${API_CONFIG.BASE_URL}/dashboard/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      return response.data.data
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  // Fetch recent activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: { activities: RecentActivity[] } }>(
        `${API_CONFIG.BASE_URL}/dashboard/recent-activities?limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      return response.data.data.activities
    },
    refetchInterval: 30000
  })

  // Fetch upcoming appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: { appointments: UpcomingAppointment[] } }>(
        `${API_CONFIG.BASE_URL}/dashboard/upcoming-appointments?limit=3`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      return response.data.data.appointments
    },
    refetchInterval: 30000
  })

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chartData', timePeriod],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: ChartData }>(
        `${API_CONFIG.BASE_URL}/dashboard/chart-data?period=${timePeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      return response.data.data
    }
  })

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
    <div className="space-y-6">
      {/* Welcome Section with Refresh Button */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2" data-cy="dashboard-title">Good morning! 👋</h1>
          <p className="text-primary-100">Here's your school health overview for today</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          aria-label="Refresh Dashboard"
        >
          <RefreshCw className={`h-5 w-5 ${statsLoading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-cy="quick-stats">
        {/* Total Students */}
        <div className="card p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
                  <div className={`ml-2 flex items-center text-sm font-semibold trend change ${
                    stats.studentTrend.changeType === 'positive' ? 'text-green-600' :
                    stats.studentTrend.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stats.studentTrend.changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.studentTrend.changeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.studentTrend.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Active Medications */}
        <div className="card p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Pill className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Medications</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.activeMedications}</div>
                  <div className={`ml-2 flex items-center text-sm font-semibold trend change ${
                    stats.medicationTrend.changeType === 'positive' ? 'text-green-600' :
                    stats.medicationTrend.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stats.medicationTrend.changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.medicationTrend.changeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.medicationTrend.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.todaysAppointments}</div>
                  <div className={`ml-2 flex items-center text-sm font-semibold trend change ${
                    stats.appointmentTrend.changeType === 'positive' ? 'text-green-600' :
                    stats.appointmentTrend.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stats.appointmentTrend.changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.appointmentTrend.changeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.appointmentTrend.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Pending Incidents */}
        <div className="card p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Incidents</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.pendingIncidents}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500 trend change">
                    {stats.pendingIncidents > 0 ? '+' : ''}{stats.pendingIncidents}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medications Due Today */}
        <div className="card p-6 hover:shadow-lg hover:border-yellow-200 transition-all duration-200 cursor-pointer bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Medications Due Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.medicationsDueToday}</p>
            </div>
            <Pill className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        {/* Health Alerts */}
        <div className="card p-6 hover:shadow-lg hover:border-red-200 transition-all duration-200 cursor-pointer bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Health Alerts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.healthAlerts}</p>
            </div>
            <Bell className="h-10 w-10 text-red-600" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recentActivityCount}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 chart-title">Medication Administration Trends</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimePeriod('week')}
              className={`px-3 py-1 text-sm rounded ${timePeriod === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`px-3 py-1 text-sm rounded ${timePeriod === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriod('year')}
              className={`px-3 py-1 text-sm rounded ${timePeriod === 'year' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Simple chart visualization */}
        {chartLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="skeleton w-full h-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : chartData && chartData.medicationAdministration.length > 0 ? (
          <div className="relative h-64">
            <svg className="w-full h-full chart" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis */}
              <line x1="50" y1="10" x2="50" y2="180" stroke="#e5e7eb" strokeWidth="2" className="axis" />
              {/* X-axis */}
              <line x1="50" y1="180" x2="750" y2="180" stroke="#e5e7eb" strokeWidth="2" className="axis" />

              {/* Data points */}
              {chartData.medicationAdministration.map((point, index) => {
                const x = 50 + (index * (700 / (chartData.medicationAdministration.length - 1 || 1)))
                const y = 180 - (point.value * 15) // Scale factor
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="4" fill="#3b82f6" className="hover:r-6 transition-all" />
                    <text x={x} y="195" textAnchor="middle" fontSize="10" fill="#6b7280">{point.date}</text>
                  </g>
                )
              })}

              {/* Line connecting points */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={chartData.medicationAdministration.map((point, index) => {
                  const x = 50 + (index * (700 / (chartData.medicationAdministration.length - 1 || 1)))
                  const y = 180 - (point.value * 15)
                  return `${x},${y}`
                }).join(' ')}
              />
            </svg>
            <div className="mt-4 flex justify-center items-center legend">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Medications Administered</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No chart data available for this period
          </div>
        )}
      </div>

      {/* Student Enrollment Trend Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 chart-title">Student Enrollment Trend</h3>
        {chartLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="skeleton w-full h-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : chartData && chartData.enrollmentTrend.length > 0 ? (
          <div className="h-48">
            <svg className="w-full h-full chart" viewBox="0 0 800 150" preserveAspectRatio="xMidYMid meet">
              {/* Simple bar chart */}
              {chartData.enrollmentTrend.map((point, index) => {
                const x = 80 + (index * (650 / chartData.enrollmentTrend.length))
                const barHeight = point.value * 10
                const y = 130 - barHeight
                return (
                  <g key={index}>
                    <rect x={x} y={y} width="40" height={barHeight} fill="#10b981" className="hover:opacity-80 transition-opacity" />
                    <text x={x + 20} y="145" textAnchor="middle" fontSize="10" fill="#6b7280">{point.date}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No enrollment data available
          </div>
        )}
      </div>

      {/* Recent Activities and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card p-6" data-cy="recent-activities">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          {activitiesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 mt-1 ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{appointment.student}</p>
                    <p className="text-xs text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Add Student</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Schedule Appointment</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Report Incident</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Pill className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Log Medication</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

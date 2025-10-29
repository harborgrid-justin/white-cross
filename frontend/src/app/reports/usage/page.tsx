/**
 * Usage Analytics Reports - System usage and user activity tracking
 *
 * @module app/reports/usage/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Activity, Clock, Download } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface UsageStats {
  activeUsers: number
  totalLogins: number
  avgSessionDuration: number
  peakUsageHour: string
  topFeatures: Array<{ name: string; usage: number }>
  userActivity: Array<{
    date: string
    logins: number
    actions: number
  }>
}

export default function UsageReportsPage() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7days')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`/api/reports/usage?range=${dateRange}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setStats(data.stats || null)
      } catch (error) {
        console.error('Error fetching usage stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [dateRange])

  const handleExport = async () => {
    if (!stats) return
    await exportData(stats.userActivity, {
      format: 'csv',
      filename: `usage-report-${new Date().toISOString().split('T')[0]}`,
    })
    toast.success('Usage report exported')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track system usage, user activity, and feature adoption
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeUsers || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Logins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalLogins || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.avgSessionDuration || 0}m</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Usage</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.peakUsageHour || 'N/A'}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Features</h3>
        <div className="space-y-3">
          {stats?.topFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{feature.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${feature.usage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {feature.usage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.userActivity?.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{activity.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{activity.logins}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{activity.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

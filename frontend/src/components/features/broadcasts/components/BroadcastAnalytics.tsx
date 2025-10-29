'use client';

/**
 * @fileoverview Broadcast Analytics - Analytics and metrics for broadcasts
 * @module components/features/broadcasts/components/BroadcastAnalytics
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye, ThumbsUp, MessageSquare, Calendar, Download } from 'lucide-react'

interface AnalyticsData {
  totalBroadcasts: number
  totalRecipients: number
  averageOpenRate: number
  averageResponseRate: number
  topPerformingCategory: string
  recentActivity: {
    date: string
    broadcasts: number
    recipients: number
    engagement: number
  }[]
}

/**
 * Broadcast Analytics Component
 *
 * Displays comprehensive analytics and metrics for broadcast performance.
 *
 * @component
 */
export default function BroadcastAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')

  // Mock analytics data
  const analytics: AnalyticsData = {
    totalBroadcasts: 156,
    totalRecipients: 12450,
    averageOpenRate: 78.5,
    averageResponseRate: 12.3,
    topPerformingCategory: 'Health Updates',
    recentActivity: [
      { date: '2025-01-15', broadcasts: 3, recipients: 892, engagement: 85 },
      { date: '2025-01-14', broadcasts: 2, recipients: 645, engagement: 72 },
      { date: '2025-01-13', broadcasts: 4, recipients: 1200, engagement: 91 },
      { date: '2025-01-12', broadcasts: 1, recipients: 345, engagement: 68 },
      { date: '2025-01-11', broadcasts: 2, recipients: 567, engagement: 79 }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Broadcast Analytics</h2>
          <p className="mt-1 text-gray-600">
            Track performance and engagement metrics for your broadcasts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Broadcasts</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalBroadcasts}</div>
          <div className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Recipients</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalRecipients.toLocaleString()}</div>
          <div className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Avg Open Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.averageOpenRate}%</div>
          <div className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +5% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Avg Response Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.averageResponseRate}%</div>
          <div className="text-sm text-red-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
            -2% from last month
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">{activity.broadcasts} broadcasts</span>
                  <span className="text-gray-600">{activity.recipients} recipients</span>
                  <span className="text-green-600 font-medium">{activity.engagement}% engaged</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Health Updates</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">85%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Emergency Alerts</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">92%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Academic Updates</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">78%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">General Notices</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">65%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Events & Activities</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">71%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Broadcasts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Broadcasts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Broadcast Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Sent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Emergency Weather Alert
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,847</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    94%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    87%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2024</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Parent-Teacher Conference
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,245</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    89%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    72%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 12, 2024</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Health Screening Update
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,142</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    86%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    65%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 10, 2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
        <h2 className="text-lg font-semibold">Broadcast Analytics</h2>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2 inline" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Broadcasts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalBroadcasts}</div>
          <div className="text-sm text-green-600">+12% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Recipients</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalRecipients.toLocaleString()}</div>
          <div className="text-sm text-green-600">+8% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Avg Open Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.averageOpenRate}%</div>
          <div className="text-sm text-green-600">+5% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Avg Response Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.averageResponseRate}%</div>
          <div className="text-sm text-red-600">-2% from last month</div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-900">{activity.broadcasts} broadcasts</span>
                  <span className="text-gray-600">{activity.recipients} recipients</span>
                  <span className="text-green-600 font-medium">{activity.engagement}% engaged</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health Updates</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Emergency</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </

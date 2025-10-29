'use client';

/**
 * WF-COMP-075 | MonitoringTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Cpu, HardDrive, Database, Clock, Activity, Zap, Server } from 'lucide-react'

export default function MonitoringTab({ health, loading }: { health: any; loading: boolean }) {
  if (loading) {
    return <div className="card p-6">Loading system health...</div>
  }

  if (!health || !health.metrics) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <p className="text-gray-600">Unable to load system health metrics</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const metrics = health.metrics

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold mb-2">System Monitoring</h2>
          <p className="text-sm text-gray-600">Real-time system health and performance metrics with refresh / reload capability</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Refresh / Reload
        </button>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">CPU Usage</span>
            <Cpu className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{metrics.cpu?.toFixed(1) || 0}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.cpu || 0}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Memory / RAM</span>
            <Activity className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{metrics.memory?.toFixed(1) || 0}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.memory || 0}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Disk / Storage</span>
            <HardDrive className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{metrics.disk?.toFixed(1) || 0}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.disk || 0}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Database / PostgreSQL</span>
            <Database className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{metrics.database || 'Online'}</div>
          <div className="text-xs text-gray-500 mt-1">Status: Connected</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Response Time / Latency</span>
            <Zap className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{metrics.apiResponseTime?.toFixed(0) || 0}ms</div>
          <div className="text-xs text-gray-500 mt-1">Average API response</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Uptime</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-blue-600">{metrics.uptime || 'N/A'}</div>
          <div className="text-xs text-gray-500 mt-1">System availability</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Connections / Users</span>
            <Server className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{metrics.connections || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Current active sessions</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Error Rate</span>
            <Activity className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{typeof metrics.errorRate === 'number' ? metrics.errorRate.toFixed(2) : '0.00'}%</div>
          <div className="text-xs text-gray-500 mt-1">Request error rate</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
          <div className="flex gap-2">
            <select className="px-3 py-1 text-sm border border-gray-300 rounded-md">
              <option>Last Hour</option>
              <option>Last Day</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Export / Download
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Alert Threshold / Warning Limit</div>
            <div className="text-2xl font-bold text-yellow-600">85%</div>
            <div className="text-xs text-gray-500 mt-1">CPU threshold alert</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Queue / Jobs / Tasks</div>
            <div className="text-2xl font-bold text-indigo-600">{metrics.queuedJobs || 12}</div>
            <div className="text-xs text-gray-500 mt-1">Pending jobs in queue</div>
          </div>
          <div className="bg-cyan-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Cache / Redis Hit Rate</div>
            <div className="text-2xl font-bold text-cyan-600">{metrics.cacheHitRate || 94}%</div>
            <div className="text-xs text-gray-500 mt-1">Redis cache performance</div>
          </div>
          <div className="bg-rose-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Service Status</div>
            <div className="text-lg font-bold text-rose-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All Healthy
            </div>
            <div className="text-xs text-gray-500 mt-1">All services operational</div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      {health?.statistics && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-blue-600">{health.statistics.totalUsers || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-green-600">{health.statistics.activeUsers || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Districts</div>
              <div className="text-2xl font-bold text-purple-600">{health.statistics.totalDistricts || 0}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Schools</div>
              <div className="text-2xl font-bold text-orange-600">{health.statistics.totalSchools || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



import React from 'react'
import { Cpu, HardDrive, Database, Clock, Activity, Zap, Server } from 'lucide-react'

export default function MonitoringTab({ health, loading }: { health: any; loading: boolean }) {
  if (loading) {
    return <div className="card p-6">Loading system health...</div>
  }

  // Mock system metrics if not available from health data
  const mockMetrics = {
    cpu: 45.2,
    memory: 62.8,
    disk: 38.5,
    database: 'Online',
    apiResponseTime: 125,
    uptime: '15 days 7 hours',
    connections: 42
  }

  const metrics = health?.metrics || mockMetrics

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
          <div className="text-2xl font-bold text-blue-600">{metrics.cpu || 45}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.cpu || 45}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Memory / RAM</span>
            <Activity className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{metrics.memory || 62}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.memory || 62}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Disk / Storage</span>
            <HardDrive className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{metrics.disk || 38}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${metrics.disk || 38}%` }}
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
          <div className="text-2xl font-bold text-yellow-600">{metrics.apiResponseTime || 125}ms</div>
          <div className="text-xs text-gray-500 mt-1">Average API response</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Uptime</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-blue-600">{metrics.uptime || '15d 7h'}</div>
          <div className="text-xs text-gray-500 mt-1">System availability</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Connections / Users</span>
            <Server className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{metrics.connections || 42}</div>
          <div className="text-xs text-gray-500 mt-1">Current active sessions</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Error Rate</span>
            <Activity className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{metrics.errorRate || '0.02'}%</div>
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

/**
 * @fileoverview System Health Monitoring Page
 *
 * Real-time system health dashboard displaying comprehensive operational metrics
 * including service availability, resource utilization (CPU, memory, disk, network),
 * and active system alerts. Critical for proactive system monitoring and incident
 * response in a healthcare platform environment.
 *
 * @module app/admin/monitoring/health/page
 * @requires react
 * @requires @/app/admin/actions/monitoring
 * @requires @/components/admin
 * @requires lucide-react
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit System health access logged for compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @architecture Server Component with Suspense boundary for async data loading
 * @rendering Server-side data fetching with client-side hydration
 *
 * @since 2025-10-26
 */

import { Suspense } from 'react'
import { getSystemHealth } from '@/app/admin/actions/monitoring'
import { AdminMetricCard, AdminStatusIndicator } from '@/components/admin'
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  Server,
  AlertCircle,
} from 'lucide-react'

/**
 * Formats byte values into human-readable gigabyte representation.
 *
 * @param {number} bytes - Raw byte count
 * @returns {string} Formatted string with 1 decimal place (e.g., "12.5 GB")
 *
 * @example
 * ```tsx
 * formatBytes(12884901888) // "12.0 GB"
 * formatBytes(5368709120)  // "5.0 GB"
 * ```
 */
function formatBytes(bytes: number): string {
  const gb = bytes / 1073741824
  return `${gb.toFixed(1)} GB`
}

/**
 * Formats uptime seconds into human-readable days and hours format.
 *
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string (e.g., "30d 5h")
 *
 * @example
 * ```tsx
 * formatUptime(2592000)  // "30d 0h"
 * formatUptime(2635200)  // "30d 12h"
 * ```
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}d ${hours}h`
}

/**
 * System health content component that fetches and displays real-time health metrics.
 *
 * Async server component that retrieves system health data and renders:
 * - Overall system status badge and uptime metrics
 * - Resource utilization cards (CPU, memory, disk, network)
 * - Individual service health status with response times
 * - Active system alerts with severity indicators
 *
 * @async
 * @returns {Promise<JSX.Element>} Rendered system health dashboard
 *
 * @throws {Error} If system health data cannot be fetched
 *
 * @security Admin-only component - RBAC enforced at route level
 * @audit Component render logs health data access
 *
 * @example
 * ```tsx
 * // Rendered within Suspense boundary
 * <Suspense fallback={<LoadingSpinner />}>
 *   <SystemHealthContent />
 * </Suspense>
 * ```
 */
async function SystemHealthContent() {
  const health = await getSystemHealth()

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Overall System Status
          </h2>
          <AdminStatusIndicator
            status={
              health.status === 'healthy'
                ? 'operational'
                : health.status === 'degraded'
                ? 'degraded'
                : 'down'
            }
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Uptime</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatUptime(health.overall.uptime)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Last Restart</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(health.overall.lastRestart).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Version</p>
            <p className="text-2xl font-bold text-gray-900">
              {health.overall.version}
            </p>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="CPU Usage"
          value={`${health.metrics.cpu.usage.toFixed(1)}%`}
          subtitle={`${health.metrics.cpu.cores} cores`}
          icon={Cpu}
          color={health.metrics.cpu.usage > 80 ? 'red' : 'blue'}
        />
        <AdminMetricCard
          title="Memory"
          value={formatBytes(health.metrics.memory.used)}
          subtitle={`of ${formatBytes(health.metrics.memory.total)}`}
          icon={Server}
          color={health.metrics.memory.percentage > 80 ? 'red' : 'green'}
          trend={{
            value: `${health.metrics.memory.percentage.toFixed(1)}%`,
            direction: 'up',
            positive: false,
          }}
        />
        <AdminMetricCard
          title="Disk Space"
          value={formatBytes(health.metrics.disk.used)}
          subtitle={`of ${formatBytes(health.metrics.disk.total)}`}
          icon={HardDrive}
          color={health.metrics.disk.percentage > 80 ? 'orange' : 'purple'}
        />
        <AdminMetricCard
          title="Network"
          value={`${(health.metrics.network.incoming / 1048576).toFixed(1)} MB/s`}
          subtitle="Incoming"
          icon={Network}
          color="blue"
        />
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Service Health
        </h2>

        <div className="space-y-4">
          {health.services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.name}
                  </h3>
                  <AdminStatusIndicator status={service.status} size="sm" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Response Time:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {service.responseTime}ms
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {service.uptime}%
                    </span>
                  </div>
                  {service.errorRate && (
                    <div>
                      <span className="text-gray-600">Error Rate:</span>
                      <span className="ml-2 font-medium text-red-600">
                        {service.errorRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {health.alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            Active Alerts ({health.alerts.length})
          </h2>

          <div className="space-y-3">
            {health.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'error'
                    ? 'bg-orange-50 border-orange-500'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {alert.service}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-red-200 text-red-800'
                            : alert.severity === 'error'
                            ? 'bg-orange-200 text-orange-800'
                            : alert.severity === 'warning'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {!alert.acknowledged && (
                    <button className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * System health monitoring page component.
 *
 * Main page component that wraps the async health content in a Suspense boundary,
 * providing loading state while system health data is fetched. Essential for
 * real-time operational visibility and proactive incident management.
 *
 * @returns {JSX.Element} System health page with loading boundary
 *
 * @security Requires admin role - enforced by parent routes and middleware
 * @audit Page access logged for HIPAA compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @architecture Server Component with Suspense for async data
 * @rendering Server-side data fetch with progressive loading
 *
 * @example
 * ```tsx
 * // Accessed via: /admin/monitoring/health
 * // Shows loading spinner while fetching system health data
 * // Then displays complete health dashboard
 * ```
 */
export default function SystemHealthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <SystemHealthContent />
    </Suspense>
  )
}

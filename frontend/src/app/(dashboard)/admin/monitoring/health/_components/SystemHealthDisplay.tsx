'use client';

import React from 'react';
import { AdminMetricCard, AdminStatusIndicator } from '@/components/admin';
import {
  Cpu,
  HardDrive,
  Network,
  Server,
  AlertCircle,
} from 'lucide-react';
import type { getSystemHealth } from '@/app/admin/_actions/monitoring';
import type { ServiceHealth, SystemAlert } from '@/types/admin';

interface SystemHealthDisplayProps {
  health: Awaited<ReturnType<typeof getSystemHealth>>;
}

/**
 * Formats byte values into human-readable gigabyte representation.
 */
function formatBytes(bytes: number): string {
  const gb = bytes / 1073741824
  return `${gb.toFixed(1)} GB`
}

/**
 * Formats uptime seconds into human-readable days and hours format.
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}d ${hours}h`
}

export function SystemHealthDisplay({ health }: SystemHealthDisplayProps) {
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
          {health.services.map((service: ServiceHealth) => (
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
            {health.alerts.map((alert: SystemAlert) => (
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
  );
}

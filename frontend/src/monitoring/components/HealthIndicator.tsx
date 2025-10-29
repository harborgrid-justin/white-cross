/**
 * Health Indicator Component
 *
 * Displays system health status
 */

'use client';

import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';

export interface HealthIndicatorProps {
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function HealthIndicator({
  showDetails = false,
  position = 'top-right',
}: HealthIndicatorProps) {
  const { status, isHealthy, isDegraded, isUnhealthy, isOnline } = useHealthCheck();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (isHealthy) return 'bg-green-500';
    if (isDegraded) return 'bg-yellow-500';
    if (isUnhealthy) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isHealthy) return 'Healthy';
    if (isDegraded) return 'Degraded';
    if (isUnhealthy) return 'Unhealthy';
    return 'Unknown';
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 hover:shadow-xl transition-shadow"
          title="System Health"
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
          <span className="text-xs font-medium text-gray-700">
            {getStatusText()}
          </span>
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <h3 className="text-sm font-semibold text-gray-900">
                System Health
              </h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Overall Status */}
            <div className="pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Status</span>
                <span className={`text-xs font-semibold ${
                  isHealthy ? 'text-green-600' :
                  isDegraded ? 'text-yellow-600' :
                  isUnhealthy ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {getStatusText()}
                </span>
              </div>
              {!isOnline && (
                <p className="text-xs text-red-600 mt-1">
                  No internet connection
                </p>
              )}
            </div>

            {/* Component Checks */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-700">Components</h4>

              <CheckRow
                label="API"
                status={status.checks.api}
                latency={status.latency.api}
              />

              <CheckRow
                label="Database"
                status={status.checks.database}
                latency={status.latency.database}
              />

              <CheckRow
                label="Cache"
                status={status.checks.cache}
              />

              {status.checks.websocket !== undefined && (
                <CheckRow
                  label="WebSocket"
                  status={status.checks.websocket}
                />
              )}
            </div>

            {/* Errors */}
            {status.errors.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">
                  Errors
                </h4>
                <div className="space-y-1">
                  {status.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Last Check */}
            <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
              Last check: {new Date(status.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CheckRowProps {
  label: string;
  status: boolean;
  latency?: number;
}

function CheckRow({ label, status, latency }: CheckRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        {latency !== undefined && status && (
          <span className="text-xs text-gray-500">{latency.toFixed(0)}ms</span>
        )}
        <div
          className={`w-2 h-2 rounded-full ${
            status ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>
    </div>
  );
}

/**
 * WF-COMP-211 | InventoryAlerts.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Inventory Alerts Component
 *
 * Displays active inventory alerts
 *
 * @module components/InventoryAlerts
 */

import React from 'react';
import { Bell } from 'lucide-react';
import type { InventoryAlert } from '../types';

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
}

/**
 * Helper to get alert badge color
 */
const getAlertBadgeColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

/**
 * Alerts component
 */
export default function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        <Bell className="h-5 w-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold">Active Alerts ({alerts.length})</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${
              alert.severity === 'CRITICAL'
                ? 'border-red-200 bg-red-50'
                : alert.severity === 'HIGH'
                ? 'border-orange-200 bg-orange-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getAlertBadgeColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs text-gray-500">
                    {alert.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

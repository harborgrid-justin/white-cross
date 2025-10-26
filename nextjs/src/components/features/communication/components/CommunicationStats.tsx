'use client';

/**
 * WF-COMP-008 | CommunicationStats.tsx - React component or utility module
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
import {
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

/**
 * Props for the CommunicationStats component
 *
 * @interface CommunicationStatsProps
 * @property {object | null} statistics - Communication statistics data
 * @property {number} [statistics.totalMessages] - Total number of messages sent
 * @property {object} [statistics.deliveryStatus] - Message delivery status breakdown
 * @property {number} [statistics.deliveryStatus.DELIVERED] - Number of successfully delivered messages
 * @property {number} [statistics.deliveryStatus.PENDING] - Number of pending messages
 * @property {number} [statistics.deliveryStatus.FAILED] - Number of failed messages
 */
interface CommunicationStatsProps {
  statistics: {
    totalMessages?: number
    deliveryStatus?: {
      DELIVERED?: number
      PENDING?: number
      FAILED?: number
    }
  } | null
}

/**
 * CommunicationStats - Displays communication statistics in a dashboard grid
 *
 * Renders a responsive grid showing total messages sent and their delivery status
 * breakdown (delivered, pending, failed). Used in the communication center dashboard
 * to provide at-a-glance insights into message delivery performance.
 *
 * @param {CommunicationStatsProps} props - Component props
 * @returns {JSX.Element | null} Statistics grid or null if no data available
 *
 * @example
 * ```tsx
 * <CommunicationStats
 *   statistics={{
 *     totalMessages: 1250,
 *     deliveryStatus: {
 *       DELIVERED: 1180,
 *       PENDING: 45,
 *       FAILED: 25
 *     }
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Returns null if statistics data is not provided
 * - Displays "0" for missing or undefined counts
 * - Grid layout adapts from 1 column (mobile) to 4 columns (desktop)
 * - Color-coded icons: blue (total), green (delivered), yellow (pending), red (failed)
 *
 * @security
 * - Does not display PHI (Protected Health Information)
 * - Statistics are aggregated counts only, no individual recipient data
 * - Suitable for display in audit logs and dashboards
 */
export default function CommunicationStats({ statistics }: CommunicationStatsProps) {
  if (!statistics) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.totalMessages || 0}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {statistics.deliveryStatus?.DELIVERED || 0}
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {statistics.deliveryStatus?.PENDING || 0}
            </p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {statistics.deliveryStatus?.FAILED || 0}
            </p>
          </div>
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>
  )
}

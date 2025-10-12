/**
 * Communication Statistics Component
 *
 * Displays communication metrics and statistics
 * @module pages/Communication/components
 */

import React from 'react'
import { MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react'
import type { CommunicationStatistics } from '../types'

interface CommunicationStatisticsProps {
  statistics: CommunicationStatistics | null
}

export const CommunicationStatisticsCards: React.FC<CommunicationStatisticsProps> = ({
  statistics
}) => {
  if (!statistics) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.totalMessages || 0}
            </p>
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

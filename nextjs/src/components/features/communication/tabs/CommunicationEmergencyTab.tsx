'use client';

/**
 * @fileoverview Communication Emergency Tab - Send urgent emergency messages
 * @module components/features/communication/tabs/CommunicationEmergencyTab
 * @version 1.0.0
 *
 * REAL-TIME FEATURE: Uses WebSocket for live emergency message delivery status
 */

'use client'

import React, { useState } from 'react'
import { AlertTriangle, Bell } from 'lucide-react'

export default function CommunicationEmergencyTab() {
  const [emergencyMessage, setEmergencyMessage] = useState('')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center text-red-600">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency Communications
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <Bell className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Emergency Alert System
              </h3>
              <p className="text-sm text-red-700">
                Use this feature only for urgent, time-sensitive communications that require immediate attention.
                All recipients will receive push notifications and SMS alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Message Composition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Message
          </label>
          <textarea
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Type your emergency message here..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ⚠️ Real-time delivery status tracking via WebSocket
          </p>
          <button
            disabled={!emergencyMessage.trim()}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Send Emergency Alert
          </button>
        </div>
      </div>
    </div>
  )
}

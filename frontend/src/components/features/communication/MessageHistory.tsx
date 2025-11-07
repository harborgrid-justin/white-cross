/**
 * @fileoverview Message History Component - Full-page message history view
 * @module components/features/communication/MessageHistory
 * @version 1.0.0
 */

'use client'

import React from 'react'
import CommunicationHistoryTab from './tabs/CommunicationHistoryTab'

function MessageHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Message History</h1>
        <p className="mt-1 text-gray-600">
          View and search your sent and received messages
        </p>
      </div>

      <CommunicationHistoryTab />
    </div>
  )
}

// Export both named and default for flexibility
export { MessageHistory }
export default MessageHistory

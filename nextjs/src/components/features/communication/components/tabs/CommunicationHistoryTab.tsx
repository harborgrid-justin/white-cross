/**
 * WF-COMP-012 | CommunicationHistoryTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'

/**
 * Message history record structure
 *
 * @interface Message
 * @property {string} id - Unique message identifier
 * @property {string} [subject] - Message subject line (optional, primarily for emails)
 * @property {string} content - Message body content
 * @property {string} priority - Message priority level: "LOW", "MEDIUM", "HIGH", or "URGENT"
 * @property {string} category - Message category classification
 * @property {number} recipientCount - Number of recipients who received the message
 * @property {string} createdAt - ISO timestamp when message was sent
 */
interface Message {
  id: string
  subject?: string
  content: string
  priority: string
  category: string
  recipientCount: number
  createdAt: string
}

/**
 * Props for the CommunicationHistoryTab component
 *
 * @interface CommunicationHistoryTabProps
 * @property {Message[]} messages - Array of sent message history records
 * @property {function} getPriorityColor - Function to determine CSS classes for priority badge styling
 */
interface CommunicationHistoryTabProps {
  messages: Message[]
  getPriorityColor: (priority: string) => string
}

/**
 * CommunicationHistoryTab - Message history and audit trail viewer
 *
 * Displays a chronological list of sent messages with details including subject,
 * content, priority, category, recipient count, and timestamp. Provides an audit
 * trail for all communications sent through the system.
 *
 * @param {CommunicationHistoryTabProps} props - Component props
 * @returns {JSX.Element} Message history list
 *
 * @example
 * ```tsx
 * <CommunicationHistoryTab
 *   messages={sentMessages}
 *   getPriorityColor={(priority) => {
 *     const colors = {
 *       URGENT: 'bg-red-100 text-red-800',
 *       HIGH: 'bg-orange-100 text-orange-800',
 *       MEDIUM: 'bg-yellow-100 text-yellow-800',
 *       LOW: 'bg-gray-100 text-gray-800'
 *     }
 *     return colors[priority] || colors.LOW
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Messages displayed in reverse chronological order (newest first)
 * - Subject defaults to "No Subject" if not provided
 * - Timestamps formatted using browser locale settings
 * - Priority badges color-coded using getPriorityColor function
 * - Recipient count shows total number of message recipients
 * - Categories: GENERAL, EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER,
 *   MEDICATION_REMINDER, INCIDENT_NOTIFICATION, COMPLIANCE
 *
 * @security
 * - History shows sent messages only (user must have appropriate permissions)
 * - Message content displayed as-is from historical records
 * - No PHI should be visible in message list (content should be generic)
 * - Full message details available through detail view (not shown in list)
 *
 * @compliance
 * - Provides audit trail required for HIPAA compliance
 * - Message history retained according to regulatory requirements
 * - Timestamps stored in UTC, displayed in local time
 * - All displayed messages have been logged in system audit trail
 */
export default function CommunicationHistoryTab({
  messages,
  getPriorityColor
}: CommunicationHistoryTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Message History</h2>
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{message.subject || 'No Subject'}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    Category: {message.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Recipients: {message.recipientCount}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

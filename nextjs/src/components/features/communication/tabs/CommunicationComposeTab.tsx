'use client';

/**
 * WF-COMP-010 | CommunicationComposeTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Send, Mail, MessageSquare, Smartphone, Phone } from 'lucide-react'

/**
 * Message composition form data structure
 *
 * @interface ComposeFormData
 * @property {string} recipients - Comma-separated recipient IDs (e.g., "student-1, student-2")
 * @property {string[]} channels - Communication channels: "EMAIL", "SMS", "PUSH_NOTIFICATION", "VOICE"
 * @property {string} subject - Message subject line (primarily for email)
 * @property {string} content - Message body content
 * @property {string} priority - Message priority: "LOW", "MEDIUM", "HIGH", or "URGENT"
 * @property {string} category - Message category for classification and routing
 * @property {string} scheduledAt - ISO datetime string for scheduled delivery (optional)
 */
interface ComposeFormData {
  recipients: string
  channels: string[]
  subject: string
  content: string
  priority: string
  category: string
  scheduledAt: string
}

/**
 * Props for the CommunicationComposeTab component
 *
 * @interface CommunicationComposeTabProps
 * @property {ComposeFormData} formData - Current message composition form data
 * @property {function} onFormChange - Callback when form data changes
 * @property {function} onSubmit - Form submission handler
 * @property {boolean} loading - Loading state during message sending
 */
interface CommunicationComposeTabProps {
  formData: ComposeFormData
  onFormChange: (data: ComposeFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

/**
 * CommunicationComposeTab - Individual message composition interface
 *
 * Provides a form for composing and sending messages to specific recipients.
 * Supports multiple communication channels, priority levels, message categorization,
 * and optional scheduled delivery for healthcare communications.
 *
 * @param {CommunicationComposeTabProps} props - Component props
 * @returns {JSX.Element} Message composition form
 *
 * @example
 * ```tsx
 * <CommunicationComposeTab
 *   formData={composeFormData}
 *   onFormChange={handleFormChange}
 *   onSubmit={handleSendMessage}
 *   loading={isSending}
 * />
 * ```
 *
 * @remarks
 * - Recipients field accepts comma-separated student/contact IDs
 * - Requires at least one communication channel to be selected
 * - Submit button disabled when loading or no channels selected
 * - Subject field primarily used for email communications
 * - Scheduled delivery is optional (leave blank for immediate send)
 * - Priority levels: LOW, MEDIUM, HIGH, URGENT
 * - Categories: GENERAL, EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER,
 *   MEDICATION_REMINDER, INCIDENT_NOTIFICATION, COMPLIANCE
 *
 * @security
 * - Recipient validation performed server-side before sending
 * - Message content should not include sensitive PHI details
 * - All communications logged in audit trail with sender ID
 * - Channel selection respects recipient preferences
 *
 * @compliance
 * - HIPAA-compliant message delivery for healthcare notifications
 * - Audit logging enabled for all sent communications
 * - Encryption in transit for all communication channels
 */
export default function CommunicationComposeTab({
  formData,
  onFormChange,
  onSubmit,
  loading
}: CommunicationComposeTabProps) {
  const handleChannelToggle = (channel: string) => {
    const updated = formData.channels.includes(channel)
      ? formData.channels.filter(c => c !== channel)
      : [...formData.channels, channel]
    onFormChange({ ...formData, channels: updated })
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SMS': return <MessageSquare className="h-4 w-4" />
      case 'PUSH_NOTIFICATION': return <Smartphone className="h-4 w-4" />
      case 'VOICE': return <Phone className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Send Message</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipients (comma-separated IDs)
        </label>
        <input
          type="text"
          value={formData.recipients}
          onChange={(e) => onFormChange({ ...formData, recipients: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="student-1, student-2, ..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channels
        </label>
        <div className="flex flex-wrap gap-2">
          {['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'].map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => handleChannelToggle(channel)}
              className={`
                px-4 py-2 rounded-md flex items-center gap-2
                ${formData.channels.includes(channel)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {getChannelIcon(channel)}
              {channel.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => onFormChange({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="GENERAL">General</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="HEALTH_UPDATE">Health Update</option>
            <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
            <option value="MEDICATION_REMINDER">Medication Reminder</option>
            <option value="INCIDENT_NOTIFICATION">Incident Notification</option>
            <option value="COMPLIANCE">Compliance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => onFormChange({ ...formData, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Message subject"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => onFormChange({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={6}
          placeholder="Type your message here..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule Send (Optional)
        </label>
        <input
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => onFormChange({ ...formData, scheduledAt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading || formData.channels.length === 0}
        className="btn-primary w-full"
      >
        <Send className="h-4 w-4 mr-2 inline" />
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

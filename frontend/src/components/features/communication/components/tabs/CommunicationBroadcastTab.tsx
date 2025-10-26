/**
 * WF-COMP-009 | CommunicationBroadcastTab.tsx - React component or utility module
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
import { Users, Mail, MessageSquare, Smartphone, Phone } from 'lucide-react'

/**
 * Broadcast message form data structure
 *
 * @interface BroadcastFormData
 * @property {string} grades - Comma-separated target grade levels (e.g., "9, 10, 11, 12") - empty for all grades
 * @property {string[]} channels - Communication channels: "EMAIL", "SMS", "PUSH_NOTIFICATION", "VOICE"
 * @property {string} subject - Broadcast message subject line (primarily for email)
 * @property {string} content - Broadcast message body content
 * @property {string} priority - Message priority: "LOW", "MEDIUM", "HIGH", or "URGENT"
 * @property {string} category - Message category for classification
 * @property {boolean} includeParents - Whether to include parents/guardians in broadcast
 * @property {boolean} includeEmergencyContacts - Whether to include emergency contacts in broadcast
 */
interface BroadcastFormData {
  grades: string
  channels: string[]
  subject: string
  content: string
  priority: string
  category: string
  includeParents: boolean
  includeEmergencyContacts: boolean
}

/**
 * Props for the CommunicationBroadcastTab component
 *
 * @interface CommunicationBroadcastTabProps
 * @property {BroadcastFormData} formData - Current broadcast form data
 * @property {function} onFormChange - Callback when form data changes
 * @property {function} onSubmit - Form submission handler
 * @property {boolean} loading - Loading state during broadcast sending
 */
interface CommunicationBroadcastTabProps {
  formData: BroadcastFormData
  onFormChange: (data: BroadcastFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

/**
 * CommunicationBroadcastTab - Mass communication broadcast interface
 *
 * Provides a form for sending broadcast messages to multiple recipients based on
 * grade level filtering. Supports targeting students, parents, and emergency contacts
 * across multiple communication channels for school-wide or grade-specific announcements.
 *
 * @param {CommunicationBroadcastTabProps} props - Component props
 * @returns {JSX.Element} Broadcast message form
 *
 * @example
 * ```tsx
 * <CommunicationBroadcastTab
 *   formData={broadcastFormData}
 *   onFormChange={handleFormChange}
 *   onSubmit={handleBroadcastSend}
 *   loading={isSending}
 * />
 * ```
 *
 * @remarks
 * - Grades field is optional - leave empty to broadcast to all grades
 * - Requires at least one communication channel to be selected
 * - Submit button disabled when loading or no channels selected
 * - Can include parents and/or emergency contacts in addition to students
 * - Subject field primarily used for email communications
 * - Priority levels: LOW, MEDIUM, HIGH, URGENT
 * - Categories: GENERAL, EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER,
 *   MEDICATION_REMINDER, INCIDENT_NOTIFICATION, COMPLIANCE
 *
 * @security
 * - Broadcast recipient lists generated server-side based on filters
 * - No PHI should be included in broadcast messages
 * - All broadcast communications logged in audit trail
 * - Requires appropriate permissions to send broadcasts
 *
 * @compliance
 * - HIPAA-compliant bulk message delivery
 * - Respects recipient communication preferences and opt-outs
 * - Audit logging enabled for all broadcast communications
 * - Channel selection validated against recipient permissions
 */
export default function CommunicationBroadcastTab({
  formData,
  onFormChange,
  onSubmit,
  loading
}: CommunicationBroadcastTabProps) {
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
      <h2 className="text-lg font-semibold mb-4">Broadcast Message</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Grades (comma-separated, optional)
        </label>
        <input
          type="text"
          value={formData.grades}
          onChange={(e) => onFormChange({ ...formData, grades: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="9, 10, 11, 12"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeParents}
            onChange={(e) => onFormChange({ ...formData, includeParents: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Include Parents</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeEmergencyContacts}
            onChange={(e) => onFormChange({ ...formData, includeEmergencyContacts: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Include Emergency Contacts</span>
        </label>
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
          placeholder="Broadcast subject"
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
          placeholder="Type your broadcast message here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || formData.channels.length === 0}
        className="btn-primary w-full"
      >
        <Users className="h-4 w-4 mr-2 inline" />
        {loading ? 'Sending...' : 'Send Broadcast'}
      </button>
    </form>
  )
}

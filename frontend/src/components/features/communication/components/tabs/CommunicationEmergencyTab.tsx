/**
 * WF-COMP-011 | CommunicationEmergencyTab.tsx - React component or utility module
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
import { Bell, AlertCircle, Mail, MessageSquare, Smartphone, Phone } from 'lucide-react'

interface EmergencyFormData {
  title: string
  message: string
  severity: string
  audience: string
  channels: string[]
}

interface CommunicationEmergencyTabProps {
  formData: EmergencyFormData
  onFormChange: (data: EmergencyFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export default function CommunicationEmergencyTab({
  formData,
  onFormChange,
  onSubmit,
  loading
}: CommunicationEmergencyTabProps) {
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-sm text-red-800">
            Emergency alerts are sent with highest priority to designated staff members.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold">Send Emergency Alert</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alert Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g., Medical Emergency - Building A"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alert Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={4}
          placeholder="Describe the emergency situation..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity Level
          </label>
          <select
            value={formData.severity}
            onChange={(e) => onFormChange({ ...formData, severity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <select
            value={formData.audience}
            onChange={(e) => onFormChange({ ...formData, audience: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="ALL_STAFF">All Staff</option>
            <option value="NURSES_ONLY">Nurses Only</option>
            <option value="SPECIFIC_GROUPS">Specific Groups</option>
          </select>
        </div>
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
                  ? 'bg-red-600 text-white'
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

      <button
        type="submit"
        disabled={loading || formData.channels.length === 0}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
      >
        <Bell className="h-4 w-4 mr-2" />
        {loading ? 'Sending Alert...' : 'Send Emergency Alert'}
      </button>
    </form>
  )
}

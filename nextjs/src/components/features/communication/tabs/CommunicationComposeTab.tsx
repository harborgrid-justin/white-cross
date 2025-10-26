'use client';

/**
 * @fileoverview Communication Compose Tab - Send individual messages
 * @module components/features/communication/tabs/CommunicationComposeTab
 * @version 1.0.0
 */

'use client'

import React, { useState } from 'react'
import { Send, Mail, MessageSquare, Smartphone, Phone } from 'lucide-react'
import { toast } from 'react-hot-toast'

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
 * Communication Compose Tab
 *
 * Form for composing and sending individual messages.
 * Supports multiple channels, priority levels, and scheduling.
 *
 * @component
 */
export default function CommunicationComposeTab() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ComposeFormData>({
    recipients: '',
    channels: ['EMAIL'],
    subject: '',
    content: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    scheduledAt: ''
  })

  const handleChannelToggle = (channel: string) => {
    const updated = formData.channels.includes(channel)
      ? formData.channels.filter(c => c !== channel)
      : [...formData.channels, channel]
    setFormData({ ...formData, channels: updated })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // TODO: Implement Server Action for sending message
      const response = await fetch('/api/proxy/v1/communication/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: formData.recipients.split(',').map(r => r.trim()),
          channels: formData.channels,
          subject: formData.subject,
          content: formData.content,
          priority: formData.priority,
          category: formData.category,
          scheduledAt: formData.scheduledAt || undefined
        })
      })

      if (!response.ok) throw new Error('Failed to send message')

      toast.success('Message sent successfully')

      // Reset form
      setFormData({
        recipients: '',
        channels: ['EMAIL'],
        subject: '',
        content: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
        scheduledAt: ''
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Send Message</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipients (comma-separated IDs)
          </label>
          <input
            type="text"
            value={formData.recipients}
            onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  px-4 py-2 rounded-md flex items-center gap-2 transition-colors
                  ${formData.channels.includes(channel)
                    ? 'bg-blue-600 text-white'
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
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Message subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || formData.channels.length === 0}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}

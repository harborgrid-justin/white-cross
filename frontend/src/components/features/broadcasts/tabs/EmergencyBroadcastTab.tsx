'use client';

/**
 * @fileoverview Emergency Broadcast Tab - Create and manage emergency broadcast notifications
 * @module components/features/broadcasts/tabs/EmergencyBroadcastTab
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  AlertTriangle,
  Siren,
  Clock,
  Users,
  Send,
  Eye,
  History,
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Megaphone,
  MapPin,
  Calendar,
} from 'lucide-react'

interface EmergencyBroadcast {
  id: string
  title: string
  message: string
  type: 'weather' | 'security' | 'health' | 'infrastructure' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  channels: ('email' | 'sms' | 'push' | 'voice')[]
  targetAudience: string[]
  location?: string
  createdAt: string
  sentAt?: string
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  recipientCount: number
  deliveryStats?: {
    sent: number
    delivered: number
    failed: number
    opened: number
  }
}

const mockEmergencyBroadcasts: EmergencyBroadcast[] = [
  {
    id: '1',
    title: 'School Closure - Severe Weather Alert',
    message: 'Due to severe weather conditions and safety concerns, all schools in the district will be closed today, January 20th. All after-school activities are cancelled. Please stay indoors and monitor local weather updates.',
    type: 'weather',
    priority: 'critical',
    channels: ['email', 'sms', 'push', 'voice'],
    targetAudience: ['All Parents', 'All Staff', 'Emergency Contacts'],
    location: 'District Wide',
    createdAt: '2024-01-20T06:00:00Z',
    sentAt: '2024-01-20T06:15:00Z',
    status: 'sent',
    recipientCount: 2840,
    deliveryStats: {
      sent: 2840,
      delivered: 2798,
      failed: 42,
      opened: 2156,
    },
  },
  {
    id: '2',
    title: 'Security Alert - Campus Lockdown Lifted',
    message: 'The security alert has been resolved and the lockdown has been lifted. Normal activities may resume. Thank you for your cooperation during this precautionary measure.',
    type: 'security',
    priority: 'high',
    channels: ['email', 'sms', 'push'],
    targetAudience: ['All Staff', 'All Students', 'All Parents'],
    location: 'Main Campus',
    createdAt: '2024-01-18T14:30:00Z',
    sentAt: '2024-01-18T14:35:00Z',
    status: 'sent',
    recipientCount: 3240,
    deliveryStats: {
      sent: 3240,
      delivered: 3198,
      failed: 42,
      opened: 2876,
    },
  },
  {
    id: '3',
    title: 'Water Main Break - Building Closure',
    message: 'Due to a water main break, the North Building will be closed for the remainder of the day. Classes will resume tomorrow in alternate locations. Check your email for specific room assignments.',
    type: 'infrastructure',
    priority: 'high',
    channels: ['email', 'sms'],
    targetAudience: ['North Building Staff', 'North Building Students'],
    location: 'North Building',
    createdAt: '2024-01-15T11:00:00Z',
    sentAt: '2024-01-15T11:10:00Z',
    status: 'sent',
    recipientCount: 456,
    deliveryStats: {
      sent: 456,
      delivered: 445,
      failed: 11,
      opened: 389,
    },
  },
]

const emergencyTypes = [
  { value: 'weather', label: 'Weather Emergency', icon: '🌪️', color: 'bg-blue-100 text-blue-800' },
  { value: 'security', label: 'Security Alert', icon: '🚨', color: 'bg-red-100 text-red-800' },
  { value: 'health', label: 'Health Emergency', icon: '🏥', color: 'bg-green-100 text-green-800' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'general', label: 'General Emergency', icon: '⚠️', color: 'bg-gray-100 text-gray-800' },
]

const priorityLevels = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical Alert', color: 'bg-red-100 text-red-800' },
]

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Megaphone,
  voice: Phone,
}

/**
 * Emergency Broadcast Tab Component
 *
 * Specialized interface for creating and managing emergency broadcast notifications
 * with priority handling and rapid deployment capabilities.
 *
 * @component
 */
export default function EmergencyBroadcastTab() {
  const [activeView, setActiveView] = useState<'create' | 'history'>('create')
  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>(mockEmergencyBroadcasts)
  const [isCreating, setIsCreating] = useState(false)
  
  // Form state for new emergency broadcast
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general' as EmergencyBroadcast['type'],
    priority: 'medium' as EmergencyBroadcast['priority'],
    channels: ['email', 'sms'] as EmergencyBroadcast['channels'],
    targetAudience: [] as string[],
    location: '',
    scheduleFor: 'immediate' as 'immediate' | 'scheduled',
    scheduledTime: '',
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleChannelToggle = (channel: EmergencyBroadcast['channels'][0]) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const handleSendEmergencyBroadcast = () => {
    // In a real app, this would send the emergency broadcast
    console.log('Sending emergency broadcast:', formData)
    
    const newBroadcast: EmergencyBroadcast = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      sentAt: formData.scheduleFor === 'immediate' ? new Date().toISOString() : undefined,
      status: formData.scheduleFor === 'immediate' ? 'sent' : 'scheduled',
      recipientCount: 1000, // Mock value
    }
    
    setBroadcasts([newBroadcast, ...broadcasts])
    setIsCreating(false)
    setFormData({
      title: '',
      message: '',
      type: 'general',
      priority: 'medium',
      channels: ['email', 'sms'],
      targetAudience: [],
      location: '',
      scheduleFor: 'immediate',
      scheduledTime: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Emergency Broadcasts</h2>
              <p className="mt-1 text-gray-600">
                Create and manage critical emergency notifications
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Siren className="h-4 w-4 mr-2" />
          Create Emergency Alert
        </button>
      </div>

      {/* View Toggle */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Emergency broadcast views">
          <button
            onClick={() => setActiveView('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'create'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Siren className="h-5 w-5 mr-2 inline" />
            Quick Alert
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'history'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="h-5 w-5 mr-2 inline" />
            Alert History ({broadcasts.length})
          </button>
        </nav>
      </div>

      {/* Create Emergency Alert View */}
      {activeView === 'create' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Emergency Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Emergency Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.type === type.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityLevels.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.priority === priority.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Alert Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Brief, clear alert title"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location/Area Affected
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Specific location or 'District Wide'"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Emergency Message *
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Clear, concise emergency information and instructions..."
              />
              <div className="mt-1 text-sm text-gray-500">
                {formData.message.length}/500 characters
              </div>
            </div>

            {/* Communication Channels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Communication Channels
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(channelIcons).map(([channel, Icon]) => (
                  <button
                    key={channel}
                    onClick={() => handleChannelToggle(channel as EmergencyBroadcast['channels'][0])}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                      formData.channels.includes(channel as EmergencyBroadcast['channels'][0])
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{channel.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Audience
              </label>
              <div className="space-y-2">
                {['All Parents', 'All Staff', 'All Students', 'Emergency Contacts', 'Administration'].map((audience) => (
                  <label key={audience} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetAudience.includes(audience)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          handleInputChange('targetAudience', [...formData.targetAudience, audience])
                        } else {
                          handleInputChange('targetAudience', formData.targetAudience.filter(a => a !== audience))
                        }
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{audience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send Timing
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.scheduleFor === 'immediate'}
                    onChange={() => handleInputChange('scheduleFor', 'immediate')}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">Send Immediately</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.scheduleFor === 'scheduled'}
                    onChange={() => handleInputChange('scheduleFor', 'scheduled')}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">Schedule for Later</span>
                </label>
                {formData.scheduleFor === 'scheduled' && (
                  <div className="ml-6">
                    <input
                      type="datetime-local"
                      value={formData.scheduledTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('scheduledTime', e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      aria-label="Schedule broadcast time"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <div className="space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSendEmergencyBroadcast}
                  disabled={!formData.title || !formData.message || formData.channels.length === 0}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {formData.scheduleFor === 'immediate' ? 'Send Alert Now' : 'Schedule Alert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert History View */}
      {activeView === 'history' && (
        <div className="space-y-4">
          {broadcasts.map((broadcast) => {
            const emergencyType = emergencyTypes.find(t => t.value === broadcast.type)
            const priorityLevel = priorityLevels.find(p => p.value === broadcast.priority)
            
            return (
              <div key={broadcast.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="text-xl mr-2">{emergencyType?.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{broadcast.title}</h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityLevel?.color}`}>
                        {priorityLevel?.label}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        broadcast.status === 'sent' ? 'bg-green-100 text-green-800' :
                        broadcast.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        broadcast.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {broadcast.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{broadcast.message}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {broadcast.recipientCount} recipients
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {broadcast.sentAt ? 
                          `Sent ${new Date(broadcast.sentAt).toLocaleString()}` :
                          `Created ${new Date(broadcast.createdAt).toLocaleString()}`
                        }
                      </div>
                      {broadcast.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {broadcast.location}
                        </div>
                      )}
                    </div>

                    {/* Delivery Stats */}
                    {broadcast.deliveryStats && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{broadcast.deliveryStats.sent}</div>
                          <div className="text-xs text-gray-500">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{broadcast.deliveryStats.delivered}</div>
                          <div className="text-xs text-gray-500">Delivered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{broadcast.deliveryStats.opened}</div>
                          <div className="text-xs text-gray-500">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{broadcast.deliveryStats.failed}</div>
                          <div className="text-xs text-gray-500">Failed</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

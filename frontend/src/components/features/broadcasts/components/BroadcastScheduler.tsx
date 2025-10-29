'use client';

/**
 * @fileoverview Broadcast Scheduler - Schedule and manage broadcast delivery timing
 * @module components/features/broadcasts/components/BroadcastScheduler
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Edit,
  Trash2,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Megaphone,
  Plus,
  Filter,
  RefreshCw,
} from 'lucide-react'

interface ScheduledBroadcast {
  id: string
  title: string
  message: string
  channels: ('email' | 'sms' | 'push' | 'voice')[]
  recipients: string[]
  scheduledTime: string
  status: 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  createdBy: string
  recipientCount: number
  deliveryStats?: {
    sent: number
    delivered: number
    failed: number
    opened: number
  }
}

const mockScheduledBroadcasts: ScheduledBroadcast[] = [
  {
    id: '1',
    title: 'Parent-Teacher Conference Reminder',
    message: 'Don\'t forget about the upcoming parent-teacher conferences next week. Please confirm your appointment slot.',
    channels: ['email', 'sms'],
    recipients: ['All Parents', '3rd Grade Parents'],
    scheduledTime: '2024-01-25T09:00:00Z',
    status: 'scheduled',
    priority: 'medium',
    createdAt: '2024-01-20T14:30:00Z',
    createdBy: 'Sarah Johnson',
    recipientCount: 245,
  },
  {
    id: '2',
    title: 'Weekly Newsletter',
    message: 'Check out this week\'s school newsletter with updates on upcoming events, achievements, and important announcements.',
    channels: ['email', 'push'],
    recipients: ['All Parents', 'All Staff'],
    scheduledTime: '2024-01-22T08:00:00Z',
    status: 'sent',
    priority: 'low',
    createdAt: '2024-01-19T16:00:00Z',
    createdBy: 'Mike Davis',
    recipientCount: 567,
    deliveryStats: {
      sent: 567,
      delivered: 554,
      failed: 13,
      opened: 432,
    },
  },
  {
    id: '3',
    title: 'Early Dismissal Notification',
    message: 'Due to scheduled maintenance, school will dismiss 2 hours early on Friday, January 26th. Buses will run accordingly.',
    channels: ['email', 'sms', 'push'],
    recipients: ['All Parents', 'All Staff', 'Transportation'],
    scheduledTime: '2024-01-24T07:30:00Z',
    status: 'scheduled',
    priority: 'high',
    createdAt: '2024-01-21T10:15:00Z',
    createdBy: 'Emma Wilson',
    recipientCount: 890,
  },
  {
    id: '4',
    title: 'Staff Meeting Reminder',
    message: 'Reminder: All staff meeting tomorrow at 3:30 PM in the main conference room. Please review the agenda beforehand.',
    channels: ['email'],
    recipients: ['All Staff', 'Administration'],
    scheduledTime: '2024-01-23T15:00:00Z',
    status: 'sending',
    priority: 'medium',
    createdAt: '2024-01-22T12:00:00Z',
    createdBy: 'John Smith',
    recipientCount: 42,
  },
]

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Megaphone,
  voice: Phone,
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  sending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

/**
 * Broadcast Scheduler Component
 *
 * Displays and manages scheduled broadcast messages with timing controls.
 *
 * @component
 */
export default function BroadcastScheduler() {
  const [broadcasts, setBroadcasts] = useState<ScheduledBroadcast[]>(mockScheduledBroadcasts)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  
  const statusOptions = ['all', 'scheduled', 'sending', 'sent', 'failed', 'cancelled']
  const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent']

  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    const matchesStatus = selectedStatus === 'all' || broadcast.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || broadcast.priority === selectedPriority
    return matchesStatus && matchesPriority
  })

  const handleCancelBroadcast = (broadcastId: string) => {
    setBroadcasts(broadcasts.map(b => 
      b.id === broadcastId ? { ...b, status: 'cancelled' as const } : b
    ))
  }

  const handleEditBroadcast = (broadcastId: string) => {
    // In a real app, this would open an edit modal or navigate to edit page
    console.log('Edit broadcast:', broadcastId)
  }

  const handleDeleteBroadcast = (broadcastId: string) => {
    setBroadcasts(broadcasts.filter(b => b.id !== broadcastId))
  }

  const getTimeUntilSend = (scheduledTime: string) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diffMs = scheduled.getTime() - now.getTime()
    
    if (diffMs < 0) return 'Overdue'
    
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    if (diffMins > 0) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`
    return 'sending soon'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Broadcast Scheduler</h2>
          <p className="mt-1 text-gray-600">
            Manage and monitor scheduled broadcast messages
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Broadcast
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Filter by status"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value)}
            className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Filter by priority"
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Scheduled Broadcasts List */}
      <div className="space-y-4">
        {filteredBroadcasts.map((broadcast) => (
          <div key={broadcast.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{broadcast.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[broadcast.status]
                    }`}>
                      {broadcast.status.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      priorityColors[broadcast.priority]
                    }`}>
                      {broadcast.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {broadcast.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleEditBroadcast(broadcast.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit broadcast"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancelBroadcast(broadcast.id)}
                          className="p-1 text-gray-400 hover:text-yellow-600"
                          title="Cancel broadcast"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteBroadcast(broadcast.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete broadcast"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Message Preview */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{broadcast.message}</p>

                {/* Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                  {/* Scheduled Time */}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-700">
                        {new Date(broadcast.scheduledTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs">
                        {new Date(broadcast.scheduledTime).toLocaleTimeString()} 
                        {broadcast.status === 'scheduled' && (
                          <span className="ml-1 text-blue-600">
                            ({getTimeUntilSend(broadcast.scheduledTime)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recipients */}
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-700">
                        {broadcast.recipientCount} recipients
                      </div>
                      <div className="text-xs">
                        {broadcast.recipients.slice(0, 2).join(', ')}
                        {broadcast.recipients.length > 2 && ` +${broadcast.recipients.length - 2} more`}
                      </div>
                    </div>
                  </div>

                  {/* Channels */}
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-2">
                      {broadcast.channels.map((channel) => {
                        const Icon = channelIcons[channel]
                        return <Icon key={channel} className="h-4 w-4" />
                      })}
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">
                        {broadcast.channels.length} channel{broadcast.channels.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs">
                        {broadcast.channels.map(c => c.toUpperCase()).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-700">{broadcast.createdBy}</div>
                      <div className="text-xs">
                        {new Date(broadcast.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Stats (for sent broadcasts) */}
                {broadcast.deliveryStats && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-4 gap-4">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBroadcasts.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled broadcasts</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedStatus !== 'all' || selectedPriority !== 'all'
              ? 'Try adjusting your filter criteria.'
              : 'Get started by scheduling your first broadcast.'
            }
          </p>
          {selectedStatus === 'all' && selectedPriority === 'all' && (
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Broadcast
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

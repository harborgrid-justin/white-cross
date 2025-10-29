'use client';

/**
 * @fileoverview Broadcast Recipients Tab - Manage broadcast recipient groups
 * @module components/features/broadcasts/tabs/BroadcastRecipientsTab
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Users, UserPlus, Settings, Mail, Phone, Smartphone, Eye, Edit, Trash2 } from 'lucide-react'

interface RecipientGroup {
  id: string
  name: string
  description: string
  memberCount: number
  channels: string[]
  criteria: {
    grades?: string[]
    roles?: string[]
    customFilters?: string[]
  }
  isActive: boolean
  lastUsed?: string
}

export default function BroadcastRecipientsTab() {
  const [groups, setGroups] = useState<RecipientGroup[]>([
    {
      id: '1',
      name: 'All Parents',
      description: 'All registered parents and guardians',
      memberCount: 892,
      channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
      criteria: {
        roles: ['parent', 'guardian']
      },
      isActive: true,
      lastUsed: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'High School Students',
      description: 'Students in grades 9-12',
      memberCount: 245,
      channels: ['SMS', 'PUSH_NOTIFICATION'],
      criteria: {
        grades: ['9', '10', '11', '12']
      },
      isActive: true,
      lastUsed: '2025-01-12T14:20:00Z'
    },
    {
      id: '3',
      name: 'Emergency Contacts',
      description: 'Designated emergency contacts for all students',
      memberCount: 156,
      channels: ['SMS', 'VOICE'],
      criteria: {
        roles: ['emergency_contact']
      },
      isActive: true
    },
    {
      id: '4',
      name: 'Staff Members',
      description: 'All school staff including teachers and administrators',
      memberCount: 78,
      channels: ['EMAIL', 'SMS'],
      criteria: {
        roles: ['teacher', 'administrator', 'staff']
      },
      isActive: false
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleGroupStatus = (id: string) => {
    setGroups(groups.map(g =>
      g.id === id ? { ...g, isActive: !g.isActive } : g
    ))
  }

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id))
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SMS': return <Phone className="h-4 w-4" />
      case 'PUSH_NOTIFICATION': return <Smartphone className="h-4 w-4" />
      case 'VOICE': return <Phone className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recipient Groups</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            <UserPlus className="h-4 w-4 mr-2 inline" />
            Create Group
          </button>
        </div>

        {/* Groups List */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.memberCount} members
                    </div>
                    {group.lastUsed && (
                      <div>Last used {new Date(group.lastUsed).toLocaleDateString()}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {group.channels.map((channel) => (
                      <div key={channel} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {getChannelIcon(channel)}
                        {channel.replace('_', ' ')}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="mb-1">Criteria:</div>
                    <div className="flex flex-wrap gap-1">
                      {group.criteria.grades && group.criteria.grades.map((grade) => (
                        <span key={grade} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          Grade {grade}
                        </span>
                      ))}
                      {group.criteria.roles && group.criteria.roles.map((role) => (
                        <span key={role} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleGroupStatus(group.id)}
                    className={`p-2 ${group.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recipient groups found.
          </div>
        )}
      </div>

      {/* Create Group Modal/Form - Placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Recipient Group</h3>
            <p className="text-gray-600 mb-4">Group creation form would be implemented here.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

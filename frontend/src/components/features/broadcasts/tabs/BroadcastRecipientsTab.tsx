'use client';

/**
 * @fileoverview Broadcast Recipients Tab - Manage broadcast recipient groups and contacts
 * @module components/features/broadcasts/tabs/BroadcastRecipientsTab
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Filter,
  Download,
  Upload,
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: 'student' | 'parent' | 'teacher' | 'staff' | 'admin'
  grade?: string
  department?: string
  lastContact: string | null
  preferences: {
    email: boolean
    sms: boolean
    push: boolean
    voice: boolean
  }
}

interface RecipientGroup {
  id: string
  name: string
  description: string
  contacts: Contact[]
  createdAt: string
  lastUsed: string | null
  totalContacts: number
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    role: 'parent',
    grade: '5th Grade',
    lastContact: '2024-01-20T10:30:00Z',
    preferences: { email: true, sms: true, push: false, voice: false },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1-555-0124',
    role: 'teacher',
    department: 'Mathematics',
    lastContact: '2024-01-19T14:15:00Z',
    preferences: { email: true, sms: false, push: true, voice: false },
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1-555-0125',
    role: 'parent',
    grade: '3rd Grade',
    lastContact: null,
    preferences: { email: true, sms: true, push: true, voice: true },
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@school.edu',
    phone: '+1-555-0126',
    role: 'admin',
    department: 'Administration',
    lastContact: '2024-01-18T09:00:00Z',
    preferences: { email: true, sms: true, push: true, voice: false },
  },
]

const mockGroups: RecipientGroup[] = [
  {
    id: '1',
    name: 'All Parents',
    description: 'All registered parents and guardians',
    contacts: mockContacts.filter(c => c.role === 'parent'),
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-20T08:00:00Z',
    totalContacts: 245,
  },
  {
    id: '2',
    name: 'Teaching Staff',
    description: 'All teachers and educational staff',
    contacts: mockContacts.filter(c => c.role === 'teacher'),
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-19T15:30:00Z',
    totalContacts: 32,
  },
  {
    id: '3',
    name: '5th Grade Parents',
    description: 'Parents of 5th grade students',
    contacts: mockContacts.filter(c => c.role === 'parent' && c.grade === '5th Grade'),
    createdAt: '2024-01-05T10:00:00Z',
    lastUsed: '2024-01-15T12:00:00Z',
    totalContacts: 28,
  },
  {
    id: '4',
    name: 'Emergency Contacts',
    description: 'Critical contacts for emergency notifications',
    contacts: mockContacts.filter(c => c.role === 'admin'),
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-10T07:45:00Z',
    totalContacts: 8,
  },
]

const roleIcons = {
  student: GraduationCap,
  parent: Users,
  teacher: GraduationCap,
  staff: Building,
  admin: Building,
}

const roleColors = {
  student: 'bg-green-100 text-green-800',
  parent: 'bg-blue-100 text-blue-800',
  teacher: 'bg-purple-100 text-purple-800',
  staff: 'bg-orange-100 text-orange-800',
  admin: 'bg-red-100 text-red-800',
}

/**
 * Broadcast Recipients Tab Component
 *
 * Manages recipient groups and individual contacts for broadcast targeting.
 *
 * @component
 */
export default function BroadcastRecipientsTab() {
  const [activeView, setActiveView] = useState<'groups' | 'contacts'>('groups')
  const [groups, setGroups] = useState<RecipientGroup[]>(mockGroups)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [isCreating, setIsCreating] = useState(false)

  const roles = ['all', 'parent', 'teacher', 'student', 'staff', 'admin']

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || contact.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId))
  }

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Broadcast Recipients</h2>
          <p className="mt-1 text-gray-600">
            Manage recipient groups and contacts for targeted broadcasting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeView === 'groups' ? 'Create Group' : 'Add Contact'}
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Recipient views">
          <button
            onClick={() => setActiveView('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 mr-2 inline" />
            Groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveView('contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'contacts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserPlus className="h-5 w-5 mr-2 inline" />
            Contacts ({contacts.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeView}...`}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            />
          </div>
        </div>
        {activeView === 'contacts' && (
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value)}
              aria-label="Filter contacts by role"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Groups View */}
      {activeView === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {group.totalContacts} contacts
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit group"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete group"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Last used: {group.lastUsed 
                    ? new Date(group.lastUsed).toLocaleDateString()
                    : 'Never'
                  }
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium">
                View Contacts
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contacts View */}
      {activeView === 'contacts' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => {
              const RoleIcon = roleIcons[contact.role]
              return (
                <li key={contact.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <RoleIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            roleColors[contact.role]
                          }`}>
                            {contact.role}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            {contact.phone}
                          </div>
                          {contact.grade && (
                            <div className="text-sm text-gray-500">
                              Grade: {contact.grade}
                            </div>
                          )}
                          {contact.department && (
                            <div className="text-sm text-gray-500">
                              Dept: {contact.department}
                            </div>
                          )}
                        </div>
                        {/* Communication Preferences */}
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-500">Preferences:</span>
                          {contact.preferences.email && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Email
                            </span>
                          )}
                          {contact.preferences.sms && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              SMS
                            </span>
                          )}
                          {contact.preferences.push && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Push
                            </span>
                          )}
                          {contact.preferences.voice && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              Voice
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit contact"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete contact"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Empty States */}
      {activeView === 'groups' && filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating a recipient group.'
            }
          </p>
        </div>
      )}

      {activeView === 'contacts' && filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedRole !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding contacts.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

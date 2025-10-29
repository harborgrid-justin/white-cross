'use client';

/**
 * @fileoverview Broadcast Templates Tab - Manage broadcast message templates
 * @module components/features/broadcasts/tabs/BroadcastTemplatesTab
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Tag,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Megaphone,
  LayoutTemplate,
} from 'lucide-react'

interface BroadcastTemplate {
  id: string
  name: string
  subject: string
  content: string
  channels: ('email' | 'sms' | 'push' | 'voice')[]
  category: string
  createdAt: string
  lastUsed: string | null
  usageCount: number
  tags: string[]
}

const mockTemplates: BroadcastTemplate[] = [
  {
    id: '1',
    name: 'School Closure - Weather',
    subject: 'School Closed Due to Weather',
    content: 'Due to severe weather conditions, all schools will be closed today. Please stay safe and check our website for updates.',
    channels: ['email', 'sms', 'push'],
    category: 'Emergency',
    createdAt: '2024-01-15T09:00:00Z',
    lastUsed: '2024-01-20T07:30:00Z',
    usageCount: 15,
    tags: ['weather', 'closure', 'safety'],
  },
  {
    id: '2',
    name: 'Parent-Teacher Conference Reminder',
    subject: 'Upcoming Parent-Teacher Conferences',
    content: 'Reminder: Parent-Teacher conferences are scheduled for next week. Please confirm your appointment time.',
    channels: ['email', 'sms'],
    category: 'Academic',
    createdAt: '2024-01-10T14:00:00Z',
    lastUsed: '2024-01-18T16:00:00Z',
    usageCount: 8,
    tags: ['conference', 'reminder', 'parents'],
  },
  {
    id: '3',
    name: 'Field Trip Permission',
    subject: 'Field Trip Permission Slip Required',
    content: 'Your child has an upcoming field trip. Please return the signed permission slip by the deadline.',
    channels: ['email'],
    category: 'Activities',
    createdAt: '2024-01-05T11:00:00Z',
    lastUsed: null,
    usageCount: 3,
    tags: ['field trip', 'permission', 'deadline'],
  },
  {
    id: '4',
    name: 'Lunch Menu Update',
    subject: 'Updated Lunch Menu Available',
    content: 'The cafeteria lunch menu has been updated for next month. View the new options on our website.',
    channels: ['email', 'push'],
    category: 'General',
    createdAt: '2024-01-03T10:00:00Z',
    lastUsed: '2024-01-15T12:00:00Z',
    usageCount: 12,
    tags: ['lunch', 'menu', 'cafeteria'],
  },
]

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Megaphone,
  voice: Phone,
}

const categoryColors = {
  Emergency: 'bg-red-100 text-red-800',
  Academic: 'bg-blue-100 text-blue-800',
  Activities: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-800',
}

/**
 * Broadcast Templates Tab Component
 *
 * Manages broadcast message templates with create, edit, delete, and organize functionality.
 *
 * @component
 */
export default function BroadcastTemplatesTab() {
  const [templates, setTemplates] = useState<BroadcastTemplate[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreating, setIsCreating] = useState(false)

  const categories = ['all', 'Emergency', 'Academic', 'Activities', 'General']

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDuplicateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const timestamp = new Date().getTime()
      const newTemplate: BroadcastTemplate = {
        ...template,
        id: `${templateId}-copy-${timestamp}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        usageCount: 0,
      }
      setTemplates([newTemplate, ...templates])
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Broadcast Templates</h2>
          <p className="mt-1 text-gray-600">
            Create and manage reusable message templates for faster broadcasting
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            aria-label="Filter templates by category"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[template.category as keyof typeof categoryColors]
                }`}>
                  <Tag className="h-3 w-3 mr-1" />
                  {template.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicateTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Duplicate template"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-blue-600"
                  title="Edit template"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
              <p className="text-sm text-gray-600">{template.subject}</p>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Content:</p>
              <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
            </div>

            {/* Channels */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Channels:</p>
              <div className="flex space-x-2">
                {template.channels.map((channel) => {
                  const Icon = channelIcons[channel]
                  return (
                    <span
                      key={channel}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {channel.toUpperCase()}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Used {template.usageCount} times
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {template.lastUsed 
                  ? `Last used ${new Date(template.lastUsed).toLocaleDateString()}`
                  : 'Never used'
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <LayoutTemplate className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new broadcast template.'
            }
          </p>
          {(!searchTerm && selectedCategory === 'all') && (
            <div className="mt-6">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

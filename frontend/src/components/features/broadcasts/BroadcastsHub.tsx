'use client';

/**
 * @fileoverview Broadcasts Hub - Main broadcast management page
 * @module components/features/broadcasts/BroadcastsHub
 * @version 1.0.0
 */

'use client'

import React, { useState } from 'react'
import {
  Radio,
  Clock,
  LayoutTemplate,
  Users,
  AlertTriangle,
  BarChart3,
  Calendar,
  Eye,
  FileText,
  Settings,
} from 'lucide-react'
import CreateBroadcastTab from './tabs/CreateBroadcastTab'
import BroadcastHistoryTab from './tabs/BroadcastHistoryTab'
import BroadcastTemplatesTab from './tabs/BroadcastTemplatesTab'
import BroadcastRecipientsTab from './tabs/BroadcastRecipientsTab'
import EmergencyBroadcastTab from './tabs/EmergencyBroadcastTab'
import BroadcastAnalytics from './components/BroadcastAnalytics'
import BroadcastScheduler from './components/BroadcastScheduler'

type TabType = 'create' | 'history' | 'templates' | 'recipients' | 'emergency' | 'analytics' | 'scheduler' | 'preview' | 'reports' | 'settings'

/**
 * Broadcasts Hub Component
 *
 * Main broadcast management interface with tabbed navigation.
 * Supports broadcast creation, history, templates, and recipient management.
 *
 * @component
 *
 * @remarks
 * - Client Component (requires 'use client')
 * - Tab state managed locally
 * - Each tab is a separate component for code organization
 */
export default function BroadcastsHub() {
  const [activeTab, setActiveTab] = useState<TabType>('create')

  const tabs = [
    { id: 'create' as const, label: 'Create Broadcast', icon: Radio },
    { id: 'history' as const, label: 'Broadcast History', icon: Clock },
    { id: 'templates' as const, label: 'Templates', icon: LayoutTemplate },
    { id: 'recipients' as const, label: 'Recipients', icon: Users },
    { id: 'emergency' as const, label: 'Emergency Broadcasts', icon: AlertTriangle },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'scheduler' as const, label: 'Scheduler', icon: Calendar },
    { id: 'preview' as const, label: 'Preview', icon: Eye },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Broadcasts</h1>
          <p className="mt-1 text-gray-600">
            Create and manage broadcast messages to students, parents, and staff
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-2" aria-label="Broadcast tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'create' && <CreateBroadcastTab />}
        {activeTab === 'history' && <BroadcastHistoryTab />}
        {activeTab === 'templates' && <BroadcastTemplatesTab />}
        {activeTab === 'recipients' && <BroadcastRecipientsTab />}
        {activeTab === 'emergency' && <EmergencyBroadcastTab />}
        {activeTab === 'analytics' && <BroadcastAnalytics />}
        {activeTab === 'scheduler' && <BroadcastScheduler />}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Broadcast Preview</h2>
            <p className="text-gray-600">Preview broadcasts before sending.</p>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Broadcast Reports</h2>
            <p className="text-gray-600">Generate and view broadcast reports.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Broadcast Settings</h2>
            <p className="text-gray-600">Configure broadcast preferences and defaults.</p>
          </div>
        )}
      </div>
    </div>
  )
}

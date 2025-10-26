'use client';

/**
 * @fileoverview Communication Hub - Multi-tab interface for messaging
 * @module components/features/communication/CommunicationHub
 * @version 1.0.0
 */

'use client'

import React, { useState } from 'react'
import {
  MessageSquare,
  Clock,
  LayoutTemplate,
  Radio,
  AlertTriangle,
} from 'lucide-react'
import CommunicationComposeTab from './tabs/CommunicationComposeTab'
import CommunicationHistoryTab from './tabs/CommunicationHistoryTab'
import CommunicationTemplatesTab from './tabs/CommunicationTemplatesTab'
import CommunicationBroadcastTab from './tabs/CommunicationBroadcastTab'
import CommunicationEmergencyTab from './tabs/CommunicationEmergencyTab'

type TabType = 'compose' | 'history' | 'templates' | 'broadcast' | 'emergency'

/**
 * Communication Hub Component
 *
 * Main communication management interface with tabbed navigation.
 * Supports multiple communication workflows via dedicated tabs.
 *
 * @component
 *
 * @remarks
 * - Client Component (requires 'use client')
 * - Tab state managed locally
 * - Each tab is a separate component for code organization
 */
export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState<TabType>('compose')

  const tabs = [
    { id: 'compose' as const, label: 'Compose', icon: MessageSquare },
    { id: 'history' as const, label: 'History', icon: Clock },
    { id: 'templates' as const, label: 'Templates', icon: LayoutTemplate },
    { id: 'broadcast' as const, label: 'Broadcast', icon: Radio },
    { id: 'emergency' as const, label: 'Emergency', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="mt-1 text-gray-600">
            Send messages and manage communications across all channels
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Communication tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
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
        {activeTab === 'compose' && <CommunicationComposeTab />}
        {activeTab === 'history' && <CommunicationHistoryTab />}
        {activeTab === 'templates' && <CommunicationTemplatesTab />}
        {activeTab === 'broadcast' && <CommunicationBroadcastTab />}
        {activeTab === 'emergency' && <CommunicationEmergencyTab />}
      </div>
    </div>
  )
}

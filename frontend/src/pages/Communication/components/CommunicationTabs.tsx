/**
 * Communication Tabs Component
 *
 * Tab navigation for different communication features
 * @module pages/Communication/components
 */

import React from 'react'
import { Send, Users, FileText, Clock, Bell } from 'lucide-react'
import type { Tab } from '../types'

interface CommunicationTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs = [
  { id: 'compose' as Tab, name: 'Compose', icon: Send },
  { id: 'broadcast' as Tab, name: 'Broadcast', icon: Users },
  { id: 'templates' as Tab, name: 'Templates', icon: FileText },
  { id: 'history' as Tab, name: 'History', icon: Clock },
  { id: 'emergency' as Tab, name: 'Emergency Alert', icon: Bell },
]

export const CommunicationTabs: React.FC<CommunicationTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

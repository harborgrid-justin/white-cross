/**
 * WF-COMP-297 | SettingsTabs.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Settings Tabs Component
 *
 * Navigation tabs for administration settings
 * @module pages/Settings/components
 */

import React from 'react'
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  Building2,
  School,
  Database,
  Activity,
  FileKey,
  BookOpen,
  FileText,
  Plug
} from 'lucide-react'
import type { SettingsTab } from '../types'

interface SettingsTabsProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

const tabs = [
  { id: 'overview' as SettingsTab, label: 'Overview', icon: SettingsIcon },
  { id: 'districts' as SettingsTab, label: 'Districts', icon: Building2 },
  { id: 'schools' as SettingsTab, label: 'Schools', icon: School },
  { id: 'users' as SettingsTab, label: 'Users', icon: Users },
  { id: 'config' as SettingsTab, label: 'Configuration', icon: Shield },
  { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Plug },
  { id: 'backups' as SettingsTab, label: 'Backups', icon: Database },
  { id: 'monitoring' as SettingsTab, label: 'Monitoring', icon: Activity },
  { id: 'licenses' as SettingsTab, label: 'Licenses', icon: FileKey },
  { id: 'training' as SettingsTab, label: 'Training', icon: BookOpen },
  { id: 'audit' as SettingsTab, label: 'Audit Logs', icon: FileText },
]

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" style={{ overflow: 'visible' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

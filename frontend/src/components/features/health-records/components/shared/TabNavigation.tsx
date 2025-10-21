/**
 * WF-COMP-027 | TabNavigation.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import type { TabType } from '@/types/healthRecords'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onTabLoad?: (tab: TabType) => void
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabLoad
}) => {
  const handleTabClick = (tab: TabType, event: React.MouseEvent<HTMLButtonElement>) => {
    // Scroll tab into view for better UX and Cypress testing
    event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

    onTabChange(tab)
    if (tab !== 'overview' && onTabLoad) {
      onTabLoad(tab)
    }
  }

  return (
    <div className="border-b border-gray-200">
      <div className="overflow-x-auto overflow-y-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.tab-navigation::-webkit-scrollbar { display: none; }`}</style>
        <nav className="flex -mb-px flex-nowrap tab-navigation" style={{ minWidth: 'max-content' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={(e) => handleTabClick(tab.id, e)}
                data-testid={`tab-${tab.id}`}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ minWidth: 'fit-content' }}
                aria-label={`${tab.label} tab`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
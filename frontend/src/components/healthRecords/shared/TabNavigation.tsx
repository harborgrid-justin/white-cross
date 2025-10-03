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
  const handleTabClick = (tab: TabType) => {
    onTabChange(tab)
    if (tab !== 'overview' && onTabLoad) {
      onTabLoad(tab)
    }
  }

  return (
    <div className="border-b border-gray-200" style={{ overflow: 'visible' }}>
      <div className="overflow-x-auto" style={{ overflowY: 'visible', minHeight: '60px' }}>
        <nav className="flex -mb-px flex-nowrap" style={{ minWidth: '800px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ flexShrink: 0, minWidth: 'fit-content' }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
import { MEDICATION_TABS } from '../../constants/medications'
import type { MedicationTab } from '../../types/medications'

interface TabNavigationProps {
  activeTab: MedicationTab
  onTabChange: (tab: MedicationTab) => void
  className?: string
  testId?: string
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
  testId
}) => {
  const tabIcons: Record<MedicationTab, React.ReactNode> = {
    overview: <span className="text-lg">📊</span>,
    medications: <span className="text-lg">💊</span>,
    inventory: <span className="text-lg">📦</span>,
    reminders: <span className="text-lg">⏰</span>,
    'adverse-reactions': <span className="text-lg">⚠️</span>
  }

  return (
    <div data-testid={testId} className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {MEDICATION_TABS.map(({ value, label }) => {
          const isActive = activeTab === value
          
          return (
            <button
              key={value}
              data-testid={`tab-${value}`}
              onClick={() => onTabChange(value)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${value}`}
            >
              <span className="mr-2">{tabIcons[value]}</span>
              {label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
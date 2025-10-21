/**
 * WF-COMP-088 | StatsCard.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  onClick?: () => void
  className?: string
  testId?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  iconColor = 'text-blue-600',
  trend,
  onClick,
  className = '',
  testId
}) => {
  const baseClasses = 'card p-6 hover:shadow-lg transition-shadow'
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-gray-50' : ''
  
  return (
    <div 
      data-testid={testId}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`${iconColor} mb-4`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

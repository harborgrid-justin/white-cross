/**
 * WF-COMP-082 | EmptyState.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  className?: string
  testId?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  testId
}) => {
  return (
    <div 
      data-testid={testId}
      className={`text-center py-12 ${className}`}
    >
      <div className="flex flex-col items-center">
        {icon && (
          <div className="text-gray-400 mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            {description}
          </p>
        )}
        {action && (
          <button
            data-testid={`${testId}-action`}
            onClick={action.onClick}
            className={
              action.variant === 'secondary'
                ? 'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'btn-primary inline-flex items-center'
            }
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * WF-COMP-084 | LoadingSpinner.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'gray' | 'white'
  message?: string
  className?: string
  testId?: string
  overlay?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'blue',
  message,
  className = '',
  testId,
  overlay = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4'
      case 'large':
        return 'h-12 w-12'
      case 'medium':
      default:
        return 'h-8 w-8'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'gray':
        return 'text-gray-600'
      case 'white':
        return 'text-white'
      case 'blue':
      default:
        return 'text-blue-600'
    }
  }

  const spinner = (
    <div 
      data-testid={testId}
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label={message || 'Loading'}
    >
      <div className="flex flex-col items-center space-y-2">
        <svg
          className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {message && (
          <span className={`text-sm font-medium ${getColorClasses()}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
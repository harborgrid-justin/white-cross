'use client';

/**
 * WF-COMP-080 | AlertBanner.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface AlertBannerProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
  testId?: string
  showIcon?: boolean
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  onDismiss,
  className = '',
  testId,
  showIcon = true
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        }
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <XCircle className="h-5 w-5 text-red-400" />,
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        }
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-400" />,
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        }
    }
  }

  const styles = getAlertStyles()

  return (
    <div 
      data-testid={testId}
      className={`
        rounded-md border p-4 ${styles.container} ${className}
      `}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className={`text-sm font-medium ${styles.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.messageColor}`}>
            {message}
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                data-testid={`${testId}-dismiss`}
                type="button"
                onClick={onDismiss}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' : ''}
                  ${type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' : ''}
                  ${type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' : ''}
                  ${type === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' : ''}
                `}
                aria-label="Dismiss alert"
              >
                <span className="sr-only">Dismiss</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

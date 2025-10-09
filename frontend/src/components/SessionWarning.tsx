import React from 'react'
import { Clock, X } from 'lucide-react'

interface SessionWarningProps {
  isOpen: boolean
  onExtend: () => void
  onDismiss: () => void
  minutesRemaining?: number
}

export const SessionWarning: React.FC<SessionWarningProps> = ({
  isOpen,
  onExtend,
  onDismiss,
  minutesRemaining = 2
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed top-4 right-4 z-50 bg-yellow-50 border-l-4 border-yellow-400 shadow-lg rounded-lg p-4 max-w-md"
      data-cy="session-warning"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Session Expiring Soon
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Your session will expire in {minutesRemaining} minutes due to inactivity. 
            Please save your work or extend your session to continue.
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={onExtend}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              data-cy="extend-session-button"
            >
              Extend Session
            </button>
            <button
              onClick={onDismiss}
              className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium text-yellow-700 hover:text-yellow-900"
            >
              Dismiss
            </button>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={onDismiss}
            className="inline-flex text-yellow-600 hover:text-yellow-800 focus:outline-none"
            aria-label="Dismiss warning"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * WF-COMP-061 | SessionExpiredModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface SessionExpiredModalProps {
  isOpen: boolean
  onLoginAgain: () => void
  onClose?: () => void
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onLoginAgain,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="session-expired-modal"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Session Expired</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600" data-testid="session-expired-message">
            Your session has expired for security reasons. Please log in again to continue accessing patient health records.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onLoginAgain}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            data-testid="login-again-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Log In Again
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              data-testid="close-session-modal"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
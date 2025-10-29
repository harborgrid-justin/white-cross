'use client';

/**
 * WF-COMP-066 | SessionExpiredModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface SessionExpiredModalProps {
  isOpen: boolean
  onLoginAgain: () => void
}

function SessionExpiredModal({ isOpen, onLoginAgain }: SessionExpiredModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="session-expired-modal"
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Session Expired
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        
        <div className="flex justify-end">
          <button
            onClick={onLoginAgain}
            className="btn-primary"
            data-testid="login-again-button"
          >
            Log In Again
          </button>
        </div>
      </div>
    </div>
  )
}

export { SessionExpiredModal };
export default SessionExpiredModal;

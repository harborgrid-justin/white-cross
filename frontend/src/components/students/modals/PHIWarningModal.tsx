/**
 * WF-COMP-095 | PHIWarningModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * PHI Warning Modal Component
 * HIPAA compliance warning for accessing protected health information
 */

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface PHIWarningModalProps {
  show: boolean
  onCancel: () => void
  onAccept: () => void
}

export const PHIWarningModal: React.FC<PHIWarningModalProps> = ({
  show,
  onCancel,
  onAccept
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" data-testid="phi-warning-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center" data-testid="phi-warning-title">
            Protected Health Information (PHI) Warning
          </h3>
          <p className="text-gray-600 mb-6" data-testid="phi-warning-message">
            You are about to access Protected Health Information (PHI). This action will be logged for HIPAA compliance.
            Only authorized personnel should proceed. Unauthorized access may result in legal action.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="btn-secondary"
              data-testid="cancel-phi-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary bg-yellow-600 hover:bg-yellow-700"
              data-testid="accept-phi-button"
              onClick={onAccept}
            >
              I Understand, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

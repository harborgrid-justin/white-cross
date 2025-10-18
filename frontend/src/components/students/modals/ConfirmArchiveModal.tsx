/**
 * WF-COMP-092 | ConfirmArchiveModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Confirm Archive Modal Component
 * Confirmation dialog for archiving students
 */

import React from 'react'

interface ConfirmArchiveModalProps {
  show: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  show,
  onCancel,
  onConfirm
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="confirm-delete-modal">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Archive</h3>
          <p className="text-gray-600 mb-6" data-testid="confirm-delete-message">
            Are you sure you want to archive this student? They will be moved to the archived students list.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="btn-secondary"
              data-testid="cancel-delete-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete-button"
              onClick={onConfirm}
            >
              Archive Student
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

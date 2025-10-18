/**
 * WF-COMP-065 | SensitiveRecordWarning.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { AlertTriangle, Shield } from 'lucide-react'

interface SensitiveRecordWarningProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  studentName?: string
}

export const SensitiveRecordWarning: React.FC<SensitiveRecordWarningProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  studentName = 'this student'
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6" data-testid="sensitive-record-warning">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sensitive Health Record Access
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                You are attempting to access sensitive health information for {studentName}. 
                This record may contain confidential mental health, behavioral, or other 
                protected health information.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Important Reminders:</span>
                </div>
                <ul className="mt-2 space-y-1 text-yellow-700 text-xs">
                  <li>• Access is logged and monitored for compliance</li>
                  <li>• Information must be used only for legitimate educational/health purposes</li>
                  <li>• Do not share this information without proper authorization</li>
                </ul>
              </div>
              
              <p className="font-medium text-gray-800">
                Do you wish to proceed with accessing this sensitive record?
              </p>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={onConfirm}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="confirm-access-button"
              >
                Yes, Access Record
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                data-testid="cancel-access-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensitiveRecordWarning
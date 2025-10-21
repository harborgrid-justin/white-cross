/**
 * WF-COMP-155 | AccessDeniedContent.tsx - React component or utility module
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
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react'
import type { AccessDeniedParams } from '../types'

interface AccessDeniedContentProps extends AccessDeniedParams {
  onGoBack: () => void
}

export const AccessDeniedContent: React.FC<AccessDeniedContentProps> = ({
  studentId,
  resource,
  reason,
  onGoBack
}) => {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600" data-testid="error-message">
            {studentId
              ? `You do not have permission to view this student's records`
              : `You do not have permission to access ${resource || 'student records'}`
            }
          </p>
          {reason && (
            <p className="text-xs text-gray-500">
              Reason: {reason}
            </p>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              HIPAA Compliance Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This access restriction is in place to protect student privacy and maintain HIPAA compliance.
                All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onGoBack}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="text-xs text-gray-400 space-y-1">
          <p>Security Event Logged</p>
          <p>Timestamp: {new Date().toISOString()}</p>
          {studentId && <p>Resource: Student {studentId}</p>}
        </div>
      </div>
    </div>
  )
}


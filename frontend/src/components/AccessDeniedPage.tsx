/**
 * WF-COMP-004 | AccessDeniedPage.tsx - React component or utility module
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
import { Shield, ArrowLeft } from 'lucide-react'

interface AccessDeniedPageProps {
  message?: string
  onBack?: () => void
}

export default function AccessDeniedPage({ 
  message = "You do not have permission to view this student's records",
  onBack
}: AccessDeniedPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="access-denied-page">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Shield className="mx-auto h-12 w-12 text-red-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-sm text-gray-600" data-testid="error-message">
            {message}
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            This content is restricted based on your current permissions. 
            If you believe you should have access, please contact your administrator.
          </p>
          
          {onBack && (
            <button
              onClick={onBack}
              className="btn-secondary flex items-center mx-auto"
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
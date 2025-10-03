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
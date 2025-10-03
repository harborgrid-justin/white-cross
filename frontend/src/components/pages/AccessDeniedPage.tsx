import React from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

interface AccessDeniedPageProps {
  message?: string
  onBack?: () => void
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  message = "You do not have permission to view this student's records",
  onBack
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="access-denied-page">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-6" data-testid="error-message">
          {message}
        </p>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your system administrator.
          </p>
          
          <button
            onClick={onBack || (() => window.history.back())}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            data-testid="back-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
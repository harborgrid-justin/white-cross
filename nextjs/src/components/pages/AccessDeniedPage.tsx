/**
 * AccessDeniedPage Component - 403 Access Denied Error Page
 *
 * Full-page component displayed when users attempt to access restricted content
 * without proper permissions. Provides clear messaging and navigation options.
 *
 * @module components/pages/AccessDeniedPage
 *
 * Security Context:
 * - Displayed for RBAC permission failures
 * - Shown when accessing PHI without proper role
 * - Used for feature-specific access restrictions
 * - Does not expose information about why access was denied beyond the message
 *
 * @component
 * @since 2025-10-17
 *
 * @example
 * ```tsx
 * // Basic usage with default message
 * <AccessDeniedPage onBack={() => navigate(-1)} />
 * ```
 *
 * @example
 * ```tsx
 * // Custom message for specific restriction
 * <AccessDeniedPage
 *   message="You need administrator privileges to access this feature"
 *   onBack={() => navigate('/dashboard')}
 * />
 * ```
 */

import React from 'react'
import { Shield, ArrowLeft } from 'lucide-react'

/**
 * Props for AccessDeniedPage component
 *
 * @interface AccessDeniedPageProps
 * @property {string} [message="You do not have permission to view this student's records"] - Custom denial message
 * @property {() => void} [onBack] - Optional callback for back navigation
 */
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
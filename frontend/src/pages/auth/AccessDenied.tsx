/**
 * Access Denied Page - White Cross Healthcare Platform
 * HIPAA-compliant access denial with security logging
 * 
 * @fileoverview Access denied page component
 * @module pages/auth/AccessDenied
 * @version 1.0.0
 */

import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AccessDeniedContent } from './components/AccessDeniedContent'

/**
 * Access Denied Page Component
 * 
 * Features:
 * - HIPAA compliant messaging
 * - Security event logging
 * - User-friendly error handling
 * - Navigation back to safe areas
 */
const AccessDenied: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const studentId = searchParams.get('studentId')
  const resource = searchParams.get('resource') || 'student records'
  const reason = searchParams.get('reason') || 'insufficient permissions'

  const handleGoBack = () => {
    navigate('/dashboard')
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
      data-testid="access-denied-page"
    >
      <AccessDeniedContent
        studentId={studentId}
        resource={resource}
        reason={reason}
        onGoBack={handleGoBack}
      />
    </div>
  )
}

export default AccessDenied

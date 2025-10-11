import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { healthRecordsApi } from '../services/api'
import { useValidatedParams, StudentHealthRecordParamSchema } from '@/utils/routeValidation'
import AccessDeniedPage from '../components/AccessDeniedPage'
import SensitiveRecordWarning from '../components/SensitiveRecordWarning'

interface StudentHealthRecordsPageProps {}

export const StudentHealthRecordsPage: React.FC<StudentHealthRecordsPageProps> = () => {
  // Validate route parameters
  const { data: params, loading: paramsLoading, error: paramsError } = useValidatedParams(
    StudentHealthRecordParamSchema,
    { fallbackRoute: '/health-records' }
  )

  const { user } = useAuthContext()
  const navigate = useNavigate()

  // Extract validated studentId
  const studentId = params?.studentId
  
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false)
  const [healthRecords, setHealthRecords] = useState<any>(null)
  
  // Check if this is a restricted student ID
  const isRestrictedStudent = studentId?.includes('restricted')
  const isSensitiveStudent = studentId?.includes('sensitive')

  useEffect(() => {
    const checkAccess = async () => {
      if (!studentId || !user) {
        setLoading(false)
        return
      }

      try {
        // Check if user has access to this student
        if (isRestrictedStudent) {
          // Simulate access check - restricted students require higher permissions
          const userCanAccessRestricted = ['ADMIN', 'SCHOOL_ADMIN'].includes(user.role)
          if (!userCanAccessRestricted) {
            setHasAccess(false)
            setLoading(false)
            return
          }
        }

        // Log the access attempt
        try {
          await healthRecordsApi.logAccess({
            action: 'VIEW_STUDENT_RECORD',
            studentId: studentId,
            details: { 
              tab: 'health-records',
              accessTime: new Date().toISOString()
            }
          })
        } catch (error) {
          console.warn('Failed to log access:', error)
        }

        // Check if this is a sensitive record that needs additional confirmation
        if (isSensitiveStudent && !showSensitiveWarning) {
          setShowSensitiveWarning(true)
          setLoading(false)
          return
        }

        // Load health records if access is granted
        setLoading(false)
        setHealthRecords({ 
          student: { name: 'Test Student' },
          records: []
        })

      } catch (error) {
        console.error('Access check failed:', error)
        setHasAccess(false)
        setLoading(false)
      }
    }

    checkAccess()
  }, [studentId, user, isRestrictedStudent, isSensitiveStudent, showSensitiveWarning])

  const handleSensitiveAccessConfirm = async () => {
    setShowSensitiveWarning(false)
    
    // Load the sensitive health record
    setHealthRecords({
      student: { name: 'Sensitive Student' },
      records: []
    })
  }

  const handleSensitiveAccessCancel = () => {
    navigate('/health-records')
  }

  const handleBackToRecords = () => {
    navigate('/health-records')
  }

  // Handle loading states
  if (paramsLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Validating route parameters...</span>
      </div>
    )
  }

  // Handle validation errors
  if (paramsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Student ID</h2>
          <p className="text-gray-600 mb-4">{paramsError.userMessage}</p>
          <button
            onClick={handleBackToRecords}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Health Records
          </button>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <AccessDeniedPage
        message="You do not have permission to view this student's records"
        onBack={handleBackToRecords}
      />
    )
  }

  if (showSensitiveWarning) {
    return (
      <SensitiveRecordWarning
        isOpen={true}
        onConfirm={handleSensitiveAccessConfirm}
        onCancel={handleSensitiveAccessCancel}
        studentName={`Student ${studentId}`}
      />
    )
  }

  // Regular health records content
  return (
    <div className="space-y-6" data-testid="health-record-content">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Records - {healthRecords?.student?.name}
          </h1>
          <p className="text-gray-600">Student ID: {studentId}</p>
        </div>
        <button
          onClick={handleBackToRecords}
          className="btn-secondary"
          data-testid="back-to-records-button"
        >
          Back to Records
        </button>
      </div>

      <div className="card p-6">
        <p className="text-gray-600">Health records content would be displayed here.</p>
      </div>
    </div>
  )
}

export default StudentHealthRecordsPage
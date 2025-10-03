import React from 'react'
import { AlertTriangle, Eye, EyeOff } from 'lucide-react'

interface SensitiveRecordWarningProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  studentName?: string
  recordType?: string
}

export const SensitiveRecordWarning: React.FC<SensitiveRecordWarningProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  studentName = "Student",
  recordType = "sensitive record"
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="sensitive-record-warning"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Sensitive Record Access</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            You are about to access a {recordType} for {studentName}. This record contains sensitive information that requires additional confirmation.
          </p>
          <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
            <strong>Privacy Notice:</strong> This access will be logged for HIPAA compliance. Only authorized personnel should view this information.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            data-testid="confirm-access-button"
          >
            <Eye className="h-4 w-4 mr-2" />
            Confirm Access
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
            data-testid="cancel-access-button"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
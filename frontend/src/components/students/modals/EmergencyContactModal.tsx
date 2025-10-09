/**
 * Emergency Contact Modal Component
 * Edit emergency contact information
 */

import React from 'react'
import { EmergencyContactFormData } from '@/types/student.types'

interface EmergencyContactModalProps {
  show: boolean
  contactData: EmergencyContactFormData
  onContactDataChange: (data: EmergencyContactFormData) => void
  onCancel: () => void
  onSave: () => void
}

export const EmergencyContactModal: React.FC<EmergencyContactModalProps> = ({
  show,
  contactData,
  onContactDataChange,
  onCancel,
  onSave
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Emergency Contact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="input-field"
                data-testid="emergency-contact-firstName"
                value={contactData.firstName}
                onChange={(e) =>
                  onContactDataChange({ ...contactData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                className="input-field"
                data-testid="emergency-contact-phone"
                value={contactData.phoneNumber}
                onChange={(e) =>
                  onContactDataChange({ ...contactData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              data-testid="save-emergency-contact-button"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

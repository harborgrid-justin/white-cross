/**
 * Student Details Modal Component
 * Displays detailed student information including emergency contacts and medical info
 */

import React from 'react'
import { X } from 'lucide-react'
import { Student } from '@/types/student.types'

interface StudentDetailsModalProps {
  show: boolean
  student: Student | null
  onClose: () => void
  onEditEmergencyContact: () => void
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  show,
  student,
  onClose,
  onEditEmergencyContact
}) => {
  if (!show || !student) return null

  const primaryContact = student.emergencyContacts.find(c => c.isPrimary)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white" data-testid="student-details-modal">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900" data-testid="student-name">
              {student.firstName} {student.lastName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="close-modal-button"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div data-testid="student-id">ID: {student.studentNumber}</div>
                <div data-testid="student-grade">Grade: {student.grade}</div>
                <div data-testid="student-dob">DOB: {student.dateOfBirth}</div>
                <div>Gender: {student.gender}</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Emergency Contact</h4>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  data-testid="edit-emergency-contact-button"
                  onClick={onEditEmergencyContact}
                >
                  Edit
                </button>
              </div>
              {primaryContact && (
                <div className="text-sm" data-testid="emergency-contact-section">
                  <div data-testid="emergency-contact-name">
                    {primaryContact.firstName} {primaryContact.lastName}
                  </div>
                  <div className="text-gray-500" data-testid="emergency-contact-phone">
                    {primaryContact.phoneNumber}
                  </div>
                  <div className="text-xs text-gray-400 mt-1" data-testid="emergency-contact-relationship">
                    {primaryContact.relationship}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Medical Information</h4>
            <div className="space-y-2 text-sm">
              {student.allergies.length > 0 && (
                <div className="bg-red-50 p-2 rounded" data-testid="critical-allergy-alert">
                  <div className="font-medium text-red-800">Critical Allergies:</div>
                  {student.allergies.map(allergy => (
                    <div key={allergy.id} className="text-red-700">
                      {allergy.allergen} ({allergy.severity})
                    </div>
                  ))}
                </div>
              )}

              {student.medications.length > 0 && (
                <div className="bg-blue-50 p-2 rounded" data-testid="medication-alert">
                  <div className="font-medium text-blue-800">Medications:</div>
                  {student.medications.map(med => (
                    <div key={med.id} className="text-blue-700">
                      {med.name} - {med.dosage}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

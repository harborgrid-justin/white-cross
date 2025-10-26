/**
 * Emergency Contact Modal Component - White Cross Healthcare Platform
 *
 * Modal dialog for editing student emergency contact information. Critical for student
 * safety compliance and enables quick contact updates for parents, guardians, and
 * designated emergency contacts.
 *
 * @fileoverview Emergency contact editing modal with FERPA compliance
 * @module pages/students/components/modals/EmergencyContactModal
 * @version 1.0.0
 */

import React from 'react'
import { EmergencyContactFormData } from '@/types/student.types'

/**
 * Props for the EmergencyContactModal component.
 *
 * @interface EmergencyContactModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {EmergencyContactFormData} contactData - Current emergency contact data being edited
 * @property {(data: EmergencyContactFormData) => void} onContactDataChange - Callback to update contact data
 * @property {() => void} onCancel - Callback when user cancels editing
 * @property {() => void} onSave - Callback when user saves emergency contact changes
 *
 * @remarks
 * **State Management**: Controlled component with contact data managed by parent.
 * Parent component typically handles validation and API calls.
 *
 * **Emergency Contact Importance**: Quick access to emergency contacts is critical for:
 * - Medical emergencies requiring parental consent
 * - Urgent student health or safety situations
 * - School closures or evacuation procedures
 * - Injury or illness notifications
 */
interface EmergencyContactModalProps {
  show: boolean
  contactData: EmergencyContactFormData
  onContactDataChange: (data: EmergencyContactFormData) => void
  onCancel: () => void
  onSave: () => void
}

/**
 * Emergency Contact Modal Component.
 *
 * Simple modal dialog for editing emergency contact name and phone number.
 * Provides immediate editing capability from the student details view without
 * navigating to a separate page.
 *
 * @component
 * @param {EmergencyContactModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when not visible
 *
 * @example
 * ```tsx
 * import { EmergencyContactModal } from './modals/EmergencyContactModal';
 *
 * function StudentDetails() {
 *   const [showModal, setShowModal] = useState(false);
 *   const [contactData, setContactData] = useState({
 *     firstName: 'Jane',
 *     phoneNumber: '555-1234'
 *   });
 *
 *   const handleSave = async () => {
 *     await emergencyContactsApi.update(studentId, contactData);
 *     setShowModal(false);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowModal(true)}>Edit Contact</button>
 *       <EmergencyContactModal
 *         show={showModal}
 *         contactData={contactData}
 *         onContactDataChange={setContactData}
 *         onCancel={() => setShowModal(false)}
 *         onSave={handleSave}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **FERPA Compliance**:
 * - Emergency contact data is part of educational records under FERPA
 * - Access restricted to authorized school personnel
 * - Changes should be audit logged for compliance tracking
 * - Contact information updates may require parental verification
 *
 * **Emergency Contact Management**:
 * - Students typically have multiple emergency contacts with priority ranking
 * - Primary contact called first in emergencies
 * - Secondary and tertiary contacts provide backup
 * - Contact information should be verified annually
 *
 * **Data Validation**:
 * - First name required for identification
 * - Phone number required for emergency communications
 * - Phone format validation should be applied (handled by parent)
 * - Relationship to student should be tracked (parent, guardian, family friend)
 *
 * **Safety Considerations**:
 * - Out-of-date contact information can delay emergency response
 * - Schools should verify contact data at enrollment and annually
 * - Multiple contacts provide redundancy for critical situations
 * - Contact authorization levels control who can pick up students
 *
 * **Accessibility**:
 * - Form fields have associated labels
 * - Test IDs for automated testing
 * - Clear action buttons (Save/Cancel)
 *
 * @see {@link StudentDetailsModal} for viewing complete contact information
 * @see {@link EmergencyContactFormData} for data structure
 */
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

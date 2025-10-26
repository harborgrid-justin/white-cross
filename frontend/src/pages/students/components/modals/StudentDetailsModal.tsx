/**
 * Student Details Modal Component - White Cross Healthcare Platform
 *
 * Comprehensive student details viewer modal displaying demographic information,
 * emergency contacts, and critical medical alerts. Provides quick access to essential
 * student data without navigating away from the main student list.
 *
 * @fileoverview FERPA-compliant student details modal with PHI warnings
 * @module pages/students/components/modals/StudentDetailsModal
 * @version 1.0.0
 */

import React from 'react'
import { X } from 'lucide-react'
import { Student, getPrimaryContact } from '@/types/student.types'

/**
 * Props for the StudentDetailsModal component.
 *
 * @interface StudentDetailsModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {Student | null} student - Student record to display, or null if no student selected
 * @property {() => void} onClose - Callback when modal is closed
 * @property {() => void} onEditEmergencyContact - Callback when user clicks to edit emergency contact
 *
 * @remarks
 * **PHI Display**: Modal displays critical medical information (allergies, medications).
 * Ensure proper access controls and audit logging are in place.
 */
interface StudentDetailsModalProps {
  show: boolean
  student: Student | null
  onClose: () => void
  onEditEmergencyContact: () => void
}

/**
 * Student Details Modal Component.
 *
 * Full-page modal displaying comprehensive student information organized into sections:
 * basic demographics, emergency contacts with inline editing, and critical medical alerts
 * for allergies and medications. Enables quick reference without leaving the student list.
 *
 * @component
 * @param {StudentDetailsModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when not shown or no student
 *
 * @example
 * ```tsx
 * import { StudentDetailsModal } from './modals/StudentDetailsModal';
 *
 * function StudentList() {
 *   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
 *   const [showDetailsModal, setShowDetailsModal] = useState(false);
 *   const [showContactModal, setShowContactModal] = useState(false);
 *
 *   const handleRowClick = (student: Student) => {
 *     setSelectedStudent(student);
 *     setShowDetailsModal(true);
 *   };
 *
 *   return (
 *     <>
 *       <StudentTable students={students} onRowClick={handleRowClick} />
 *       <StudentDetailsModal
 *         show={showDetailsModal}
 *         student={selectedStudent}
 *         onClose={() => setShowDetailsModal(false)}
 *         onEditEmergencyContact={() => {
 *           setShowDetailsModal(false);
 *           setShowContactModal(true);
 *         }}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Information Sections**:
 *
 * 1. **Basic Information** (FERPA-protected):
 *    - Student ID/Number
 *    - Grade Level
 *    - Date of Birth
 *    - Gender
 *
 * 2. **Emergency Contact** (Critical for Safety):
 *    - Primary contact name, phone, relationship
 *    - Inline "Edit" button for quick updates
 *    - Typically parent or legal guardian
 *
 * 3. **Medical Information** (PHI - HIPAA-protected):
 *    - Critical Allergies: Red alert boxes with allergen and severity
 *    - Medications: Blue information boxes with medication name and dosage
 *    - Visual color coding for quick recognition
 *
 * **FERPA Compliance**:
 * - All student demographic data is educational record under FERPA
 * - Access restricted to school officials with legitimate educational interest
 * - Modal view should be audit logged for compliance tracking
 *
 * **PHI Handling**:
 * - Allergies and medications are Protected Health Information under HIPAA
 * - Access requires NURSE, ADMIN, or COUNSELOR role
 * - All PHI views must be logged with user, timestamp, and reason
 * - Color-coded alerts (red for allergies, blue for medications) for quick recognition
 *
 * **Emergency Contact Management**:
 * - Displays primary contact (highest priority) from emergencyContacts array
 * - Uses getPrimaryContact() utility to find primary contact
 * - "Edit" button opens EmergencyContactModal for inline editing
 * - Contact updates critical for emergency response readiness
 *
 * **Medical Alerts**:
 * - **Critical Allergies**: Prominently displayed in red for immediate visibility
 * - **Medications**: Listed for awareness of ongoing treatments
 * - Severity levels shown for allergies (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * - Dosage information shown for medications
 * - Essential for school nurses and emergency responders
 *
 * **Accessibility**:
 * - Close button with X icon and aria-label
 * - Test IDs for automated testing
 * - Color-coded sections with semantic meaning
 * - Clear visual hierarchy
 *
 * **UI/UX Features**:
 * - Two-thirds width modal for comfortable reading
 * - Grid layout for organized information display
 * - Inline emergency contact editing without closing modal
 * - Color-coded medical alerts for quick recognition
 * - Empty states handled gracefully (no contacts, no medical info)
 *
 * @see {@link EmergencyContactModal} for emergency contact editing
 * @see {@link Student} for student data model
 * @see {@link getPrimaryContact} for contact prioritization utility
 */
export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  show,
  student,
  onClose,
  onEditEmergencyContact
}) => {
  if (!show || !student) return null

  const primaryContact = student.emergencyContacts ? getPrimaryContact(student.emergencyContacts) : undefined

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

/**
 * Confirm Archive Modal Component - White Cross Healthcare Platform
 *
 * Confirmation dialog for student archival operations. Implements soft-delete pattern
 * where students are moved to archived status rather than permanently deleted, preserving
 * FERPA-required educational records while removing from active student lists.
 *
 * @fileoverview Student archive confirmation with FERPA compliance
 * @module pages/students/components/modals/ConfirmArchiveModal
 * @version 1.0.0
 */

import React from 'react'

/**
 * Props for the ConfirmArchiveModal component.
 *
 * @interface ConfirmArchiveModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {() => void} onCancel - Callback when user cancels the archive operation
 * @property {() => void} onConfirm - Callback when user confirms the archive operation
 *
 * @remarks
 * **Soft Delete Pattern**: Students are archived (not deleted) to preserve records.
 * FERPA requires maintaining educational records for specified retention periods.
 */
interface ConfirmArchiveModalProps {
  show: boolean
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Confirm Archive Modal Component.
 *
 * Simple confirmation dialog preventing accidental student archival. Explains that
 * the student will be moved to the archived students list and can be restored later.
 * Implements standard destructive action confirmation pattern.
 *
 * @component
 * @param {ConfirmArchiveModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when not visible
 *
 * @example
 * ```tsx
 * import { ConfirmArchiveModal } from './modals/ConfirmArchiveModal';
 *
 * function StudentManagement() {
 *   const [showArchiveModal, setShowArchiveModal] = useState(false);
 *   const [studentToArchive, setStudentToArchive] = useState<string | null>(null);
 *
 *   const handleArchive = async () => {
 *     if (studentToArchive) {
 *       await studentsApi.archiveStudent(studentToArchive);
 *       setShowArchiveModal(false);
 *       refreshStudentList();
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => {
 *         setStudentToArchive(student.id);
 *         setShowArchiveModal(true);
 *       }}>
 *         Archive Student
 *       </button>
 *       <ConfirmArchiveModal
 *         show={showArchiveModal}
 *         onCancel={() => setShowArchiveModal(false)}
 *         onConfirm={handleArchive}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Archival vs. Deletion**:
 * - **Archive**: Soft delete - student marked inactive, hidden from active lists
 * - **Delete**: Permanent removal - avoided to comply with FERPA record retention
 * - Archived students can be restored if needed
 * - Educational records must be retained for years after student departure
 *
 * **FERPA Compliance**:
 * - FERPA requires schools to maintain student records for defined retention periods
 * - Archiving allows hiding inactive students while preserving required records
 * - Permanent deletion only allowed after retention period expires
 * - Archive actions should be audit logged with user, timestamp, and reason
 *
 * **Student Transfer/Graduation Workflows**:
 * - Students should be archived when transferring to another school
 * - Graduating students archived at end of school year
 * - Withdrawn students archived with withdrawal reason
 * - Historical records remain accessible for transcripts and requests
 *
 * **Restoration Capability**:
 * - Archived students can be restored to active status
 * - Useful for students who return after temporary absence
 * - All historical data (health records, grades, attendance) preserved
 * - Restoration typically requires administrator approval
 *
 * **UI/UX Patterns**:
 * - Red "Archive Student" button indicates destructive action
 * - Clear explanation of what archiving means
 * - Cancel option prominently displayed
 * - Confirmation prevents accidental archival
 *
 * **Accessibility**:
 * - Clear action buttons with test IDs
 * - Descriptive confirmation message
 * - Keyboard navigation support
 *
 * @see {@link Students} for student list management
 * @see {@link studentsApi.archiveStudent} for archive API operation
 */
export const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  show,
  onCancel,
  onConfirm
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="confirm-delete-modal">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Archive</h3>
          <p className="text-gray-600 mb-6" data-testid="confirm-delete-message">
            Are you sure you want to archive this student? They will be moved to the archived students list.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="btn-secondary"
              data-testid="cancel-delete-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete-button"
              onClick={onConfirm}
            >
              Archive Student
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

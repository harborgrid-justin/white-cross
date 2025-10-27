'use client';

import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { Archive, AlertTriangle } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-001 | ConfirmArchiveModal.tsx
 * Purpose: Confirmation dialog for archiving students with data preservation warnings
 *
 * @module app/(dashboard)/students/components/modals/ConfirmArchiveModal
 */

/**
 * Student data for archive confirmation
 */
export interface StudentArchiveData {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  hasHealthRecords: boolean;
  hasMedications: boolean;
  hasIncidents: boolean;
}

/**
 * Props for ConfirmArchiveModal component
 */
interface ConfirmArchiveModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Student to be archived */
  student: StudentArchiveData | null;
  /** Callback when archive is confirmed */
  onConfirm: (studentId: string) => void | Promise<void>;
  /** Whether archive operation is in progress */
  isLoading?: boolean;
}

/**
 * ConfirmArchiveModal Component
 *
 * Confirmation dialog for archiving student records with:
 * - Clear warning about archival
 * - Information about data preservation
 * - List of related records that will be affected
 * - Confirmation and cancel actions
 *
 * **Features:**
 * - Student information display
 * - Related records warning
 * - Loading state during archive
 * - Keyboard support (Escape to cancel)
 * - Focus management
 *
 * **HIPAA Compliance:**
 * - No PHI displayed in confirmation
 * - Audit trail of archive action
 * - Data retention notice
 *
 * **Accessibility:**
 * - ARIA labels and roles
 * - Keyboard navigation
 * - Focus trap
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * const [showArchiveModal, setShowArchiveModal] = useState(false);
 * const [studentToArchive, setStudentToArchive] = useState<StudentArchiveData | null>(null);
 *
 * <ConfirmArchiveModal
 *   isOpen={showArchiveModal}
 *   onClose={() => setShowArchiveModal(false)}
 *   student={studentToArchive}
 *   onConfirm={handleArchiveStudent}
 * />
 * ```
 */
export function ConfirmArchiveModal({
  isOpen,
  onClose,
  student,
  onConfirm,
  isLoading = false
}: ConfirmArchiveModalProps) {
  if (!student) return null;

  /**
   * Handle archive confirmation
   */
  const handleConfirm = async () => {
    await onConfirm(student.id);
  };

  /**
   * Get full name
   */
  const fullName = `${student.firstName} ${student.lastName}`;

  /**
   * Count related records
   */
  const relatedRecordsCount = [
    student.hasHealthRecords,
    student.hasMedications,
    student.hasIncidents
  ].filter(Boolean).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Archive className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Archive Student</h2>
            <p className="text-sm text-gray-600">Confirm student record archival</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          {/* Warning Alert */}
          <Alert variant="warning">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-semibold">This action will archive the student record</p>
              <p className="text-sm mt-1">
                The student will be moved to archived status. All data will be preserved but the
                student will no longer appear in active lists.
              </p>
            </div>
          </Alert>

          {/* Student Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Student Information</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Name:</dt>
                <dd className="text-gray-900">{fullName}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Student ID:</dt>
                <dd className="text-gray-900">{student.studentId}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Grade:</dt>
                <dd className="text-gray-900">
                  {student.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${student.gradeLevel}`}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Related Records:</dt>
                <dd className="text-gray-900">{relatedRecordsCount} types</dd>
              </div>
            </dl>
          </div>

          {/* Related Records Warning */}
          {relatedRecordsCount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Related Records</h3>
              <p className="text-sm text-gray-700 mb-3">
                The following related records will also be archived:
              </p>
              <ul className="space-y-2">
                {student.hasHealthRecords && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Health records (allergies, immunizations, conditions)</span>
                  </li>
                )}
                {student.hasMedications && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Medication records and administration logs</span>
                  </li>
                )}
                {student.hasIncidents && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Incident reports and follow-ups</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Data Retention Notice */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
            <p className="font-medium mb-1">Data Retention Notice:</p>
            <p>
              All archived data is retained according to HIPAA regulations and your organization's
              retention policy. Archived records can be restored by administrators if needed.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Archiving...
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Archive Student
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

'use client';

import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { Checkbox } from '@/components/ui/Checkbox';
import { useState } from 'react';
import { Shield, AlertTriangle, Eye } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-004 | PHIWarningModal.tsx
 * Purpose: HIPAA-compliant warning modal before accessing Protected Health Information
 *
 * @module app/(dashboard)/students/components/modals/PHIWarningModal
 */

/**
 * Props for PHIWarningModal component
 */
interface PHIWarningModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Student name for context */
  studentName?: string;
  /** Resource being accessed (e.g., "health records", "medications") */
  resource?: string;
  /** Callback when user acknowledges and proceeds */
  onProceed: () => void;
  /** Whether to require acknowledgment checkbox */
  requireAcknowledgment?: boolean;
}

/**
 * PHIWarningModal Component
 *
 * HIPAA-compliant warning modal displayed before accessing PHI with:
 * - Clear warning about PHI access
 * - HIPAA compliance information
 * - Audit trail notice
 * - Optional acknowledgment checkbox
 * - Proceed and cancel actions
 *
 * **Features:**
 * - HIPAA compliance warnings
 * - Acknowledgment requirement
 * - Audit trail notification
 * - Context-specific messaging
 * - Keyboard support
 *
 * **HIPAA Compliance:**
 * - Access notification
 * - Audit trail notice
 * - Minimum necessary principle reminder
 * - Security requirements notice
 * - User acknowledgment capture
 *
 * **Purpose:**
 * Ensures users are aware that:
 * 1. They are accessing Protected Health Information
 * 2. Access is being logged for audit purposes
 * 3. They must comply with HIPAA regulations
 * 4. They should only access necessary information
 *
 * **Accessibility:**
 * - ARIA labels and roles
 * - Keyboard navigation
 * - Focus management
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * const [showPHIWarning, setShowPHIWarning] = useState(false);
 *
 * <PHIWarningModal
 *   isOpen={showPHIWarning}
 *   onClose={() => setShowPHIWarning(false)}
 *   studentName="John Doe"
 *   resource="health records"
 *   onProceed={() => {
 *     setShowPHIWarning(false);
 *     loadHealthRecords();
 *   }}
 *   requireAcknowledgment
 * />
 * ```
 */
export function PHIWarningModal({
  isOpen,
  onClose,
  studentName,
  resource = 'Protected Health Information',
  onProceed,
  requireAcknowledgment = true
}: PHIWarningModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  /**
   * Handle proceed action
   */
  const handleProceed = () => {
    onProceed();
    // Reset acknowledgment for next time
    setAcknowledged(false);
  };

  /**
   * Handle close action
   */
  const handleClose = () => {
    setAcknowledged(false);
    onClose();
  };

  /**
   * Check if user can proceed
   */
  const canProceed = !requireAcknowledgment || acknowledged;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Protected Health Information Access</h2>
            <p className="text-sm text-gray-600">HIPAA Compliance Notice</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          {/* Main Warning */}
          <Alert variant="warning">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-semibold">You are about to access Protected Health Information</p>
              <p className="text-sm mt-1">
                {studentName
                  ? `You are accessing ${resource} for ${studentName}.`
                  : `You are accessing ${resource}.`}
              </p>
            </div>
          </Alert>

          {/* HIPAA Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              HIPAA Compliance Requirements
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Minimum Necessary:</strong> Only access the minimum amount of PHI necessary
                  to perform your job duties.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Authorized Access:</strong> You must have a legitimate work-related reason
                  to access this information.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Confidentiality:</strong> Do not share, discuss, or disclose this information
                  to unauthorized individuals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Security:</strong> Ensure your workstation is secure and not visible to
                  unauthorized persons.
                </span>
              </li>
            </ul>
          </div>

          {/* Audit Trail Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              Audit Trail Notice
            </h3>
            <p className="text-sm text-gray-700">
              This access will be logged for audit and compliance purposes. The following information
              will be recorded:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700 ml-4">
              <li>• Your user ID and name</li>
              <li>• Date and time of access</li>
              <li>• Student record accessed</li>
              <li>• Type of information viewed</li>
              <li>• IP address and session information</li>
            </ul>
          </div>

          {/* Acknowledgment Checkbox */}
          {requireAcknowledgment && (
            <div className="bg-white border-2 border-orange-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="phi-acknowledgment"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                />
                <label
                  htmlFor="phi-acknowledgment"
                  className="text-sm text-gray-900 cursor-pointer"
                >
                  <strong>I acknowledge</strong> that I understand my responsibilities under HIPAA,
                  I have a legitimate work-related reason to access this information, and my access
                  will be logged for audit purposes.
                </label>
              </div>
            </div>
          )}

          {/* Additional Warning */}
          <div className="text-xs text-gray-600 bg-red-50 border border-red-200 p-3 rounded">
            <p className="font-medium text-red-900 mb-1">Important:</p>
            <p>
              Unauthorized access, use, or disclosure of PHI is a violation of HIPAA regulations
              and may result in civil and criminal penalties, including termination of employment,
              fines, and imprisonment.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProceed}
            disabled={!canProceed}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            I Understand, Proceed
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

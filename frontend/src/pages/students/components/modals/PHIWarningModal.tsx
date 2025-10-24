/**
 * PHI Warning Modal Component - HIPAA Compliance Warning
 *
 * @fileoverview HIPAA-compliant warning modal for accessing Protected Health Information
 * @module pages/students/components/modals/PHIWarningModal
 * @version 1.0.0
 *
 * @remarks
 * HIPAA Compliance: This modal serves as a critical control point for PHI access.
 * It ensures users acknowledge HIPAA requirements before viewing protected health information.
 * All acceptances should be logged for audit purposes.
 */

import React from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * Props for the PHI Warning Modal component.
 *
 * @interface PHIWarningModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {() => void} onCancel - Callback when user cancels PHI access
 * @property {() => void} onAccept - Callback when user acknowledges and proceeds
 *
 * @remarks
 * Security: The onAccept callback should trigger audit logging before granting access.
 */
interface PHIWarningModalProps {
  show: boolean
  onCancel: () => void
  onAccept: () => void
}

/**
 * PHI (Protected Health Information) Warning Modal Component.
 *
 * Displays a HIPAA-compliant warning before users access protected health information.
 * Ensures users understand the legal implications and that their access will be logged.
 *
 * @component
 * @param {PHIWarningModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when not shown
 *
 * @remarks
 * HIPAA Compliance:
 * - Warns users that PHI access is monitored and logged
 * - Informs users of legal consequences of unauthorized access
 * - Requires explicit acknowledgment before proceeding
 * - All "Accept" actions should be logged with user ID, timestamp, and context
 *
 * Audit Requirements:
 * - Log user identity when onAccept is called
 * - Record timestamp of access
 * - Capture what PHI resource is being accessed
 * - Store IP address and session information
 * - Maintain audit trail for minimum 6 years (HIPAA requirement)
 *
 * Security:
 * - Modal overlay prevents accidental PHI exposure
 * - Clear Cancel option for users to withdraw access request
 * - Warning text emphasizes legal accountability
 * - Visual indicator (yellow warning icon) draws attention
 *
 * Accessibility:
 * - High contrast warning colors for visibility
 * - Clear, unambiguous action buttons
 * - Test IDs for automated testing and verification
 *
 * @example
 * ```tsx
 * import { PHIWarningModal } from './components/modals/PHIWarningModal';
 *
 * function HealthRecordView() {
 *   const [showWarning, setShowWarning] = useState(true);
 *
 *   const handleAccept = () => {
 *     // Log the PHI access
 *     auditLog.record({
 *       action: 'PHI_ACCESS',
 *       userId: currentUser.id,
 *       resource: 'health_record',
 *       timestamp: new Date().toISOString()
 *     });
 *
 *     setShowWarning(false);
 *     // Proceed to show PHI
 *   };
 *
 *   return (
 *     <>
 *       <PHIWarningModal
 *         show={showWarning}
 *         onCancel={() => router.back()}
 *         onAccept={handleAccept}
 *       />
 *       {!showWarning && <HealthRecordContent />}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With Redux for audit logging
 * function SecureHealthData() {
 *   const dispatch = useDispatch();
 *   const [acknowledged, setAcknowledged] = useState(false);
 *
 *   const handlePHIAccept = () => {
 *     dispatch(logPHIAccess({
 *       userId: user.id,
 *       resource: 'student_health_records',
 *       action: 'VIEW'
 *     }));
 *     setAcknowledged(true);
 *   };
 *
 *   return (
 *     <PHIWarningModal
 *       show={!acknowledged}
 *       onCancel={() => navigate('/dashboard')}
 *       onAccept={handlePHIAccept}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html} HIPAA Privacy Rule
 */
export const PHIWarningModal: React.FC<PHIWarningModalProps> = ({
  show,
  onCancel,
  onAccept
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" data-testid="phi-warning-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center" data-testid="phi-warning-title">
            Protected Health Information (PHI) Warning
          </h3>
          <p className="text-gray-600 mb-6" data-testid="phi-warning-message">
            You are about to access Protected Health Information (PHI). This action will be logged for HIPAA compliance.
            Only authorized personnel should proceed. Unauthorized access may result in legal action.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="btn-secondary"
              data-testid="cancel-phi-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary bg-yellow-600 hover:bg-yellow-700"
              data-testid="accept-phi-button"
              onClick={onAccept}
            >
              I Understand, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

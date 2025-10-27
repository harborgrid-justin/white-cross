/**
 * WitnessStatementDetails Component
 *
 * Full detailed view of a witness statement in a modal dialog.
 * Displays all statement information with edit, delete, and verify actions.
 *
 * Features:
 * - Complete witness statement information
 * - Verification status and history
 * - Edit mode with form
 * - Delete with confirmation
 * - Print functionality
 * - Attached documents/photos (future enhancement)
 * - Responsive modal design
 * - Loading and error states
 */

import React, { useState, useEffect } from 'react';
import { useWitnessStatements } from '@/hooks/domains/incidents';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/display/Badge';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import WitnessStatementForm from './WitnessStatementForm';
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Printer,
  FileText,
  AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { WitnessStatement, WitnessType } from '@/types/incidents';

interface WitnessStatementDetailsProps {
  /** Statement ID to display */
  statementId: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Optional CSS class name */
  className?: string;
}

// Witness type labels
const witnessTypeLabels: Record<WitnessType, string> = {
  STUDENT: 'Student',
  STAFF: 'Staff Member',
  PARENT: 'Parent/Guardian',
  OTHER: 'Other'
};

// Witness type badge variants
const witnessTypeBadgeVariants: Record<WitnessType, 'primary' | 'secondary' | 'info' | 'default'> = {
  STUDENT: 'primary',
  STAFF: 'info',
  PARENT: 'secondary',
  OTHER: 'default'
};

/**
 * WitnessStatementDetails component - Full statement detail view
 */
const WitnessStatementDetails: React.FC<WitnessStatementDetailsProps> = ({
  statementId,
  isOpen,
  onClose,
  className = ''
}) => {
  const { statements, deleteWitnessStatement, verifyStatement, unverifyStatement, operationLoading } = useWitnessStatements();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Find the statement by ID
  const statement = statements.find(s => s.id === statementId);

  // Reset edit mode when statement changes
  useEffect(() => {
    setIsEditMode(false);
  }, [statementId]);

  // Handle edit success
  const handleEditSuccess = () => {
    setIsEditMode(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this witness statement? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteWitnessStatement(statementId);
        onClose();
      } catch (error) {
        console.error('Failed to delete witness statement:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle verification toggle
  const handleVerifyToggle = async () => {
    if (!statement) return;

    setIsVerifying(true);
    try {
      if (statement.verified) {
        await unverifyStatement(statement.id);
      } else {
        await verifyStatement(statement.id);
      }
    } catch (error) {
      console.error('Failed to toggle verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Detect email vs phone contact
  const isEmail = statement?.witnessContact?.includes('@');

  // Loading state
  if (!statement && isOpen) {
    return (
      <Modal open={isOpen} onClose={onClose} size="lg" centered>
        <ModalBody>
          <div className="py-12">
            <LoadingSpinner size="lg" text="Loading witness statement..." />
          </div>
        </ModalBody>
      </Modal>
    );
  }

  // Not found state
  if (!statement) {
    return (
      <Modal open={isOpen} onClose={onClose} size="md" centered>
        <ModalBody>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Statement Not Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              The witness statement could not be found or has been deleted.
            </p>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      centered
      closeOnBackdropClick={!isEditMode}
      closeOnEscapeKey={!isEditMode}
      showCloseButton={true}
    >
      <ModalHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <ModalTitle>Witness Statement Details</ModalTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isEditMode ? 'Edit witness statement' : 'View complete witness statement information'}
              </p>
            </div>
          </div>
          {!isEditMode && statement.verified && (
            <Badge variant="success" size="md">
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </ModalHeader>

      <ModalBody>
        <div className={`space-y-6 ${className}`}>
          {isEditMode ? (
            // Edit Mode - Show Form
            <WitnessStatementForm
              incidentId={statement.incidentReportId}
              statement={statement}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          ) : (
            // View Mode - Show Details
            <>
              {/* Witness Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Witness Information
                </h3>
                <div className="space-y-3">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{statement.witnessName}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Badge variant={witnessTypeBadgeVariants[statement.witnessType]} size="sm">
                        {witnessTypeLabels[statement.witnessType]}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact */}
                  {statement.witnessContact && (
                    <div className="flex items-start gap-3">
                      {isEmail ? (
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                      ) : (
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{statement.witnessContact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Statement Text */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Witness Statement
                </h3>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {statement.statement}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Record Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recorded */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Recorded</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {statement.createdAt ? format(new Date(statement.createdAt), 'PPpp') : 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({statement.createdAt ? formatDistanceToNow(new Date(statement.createdAt), { addSuffix: true }) : 'Unknown'})
                      </p>
                    </div>
                  </div>

                  {/* Verification */}
                  <div className="flex items-start gap-3">
                    {statement.verified ? (
                      <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-warning-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Verification Status</p>
                      {statement.verified ? (
                        <>
                          <p className="text-sm font-medium text-success-600 dark:text-success-400">Verified</p>
                          {statement.verifiedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(statement.verifiedAt), { addSuffix: true })}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-medium text-warning-600 dark:text-warning-400">Not Verified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PHI/PII Warning */}
              <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-lg p-3">
                <p className="text-xs text-info-700 dark:text-info-300">
                  <strong>Note:</strong> This statement may contain Protected Health Information (PHI) or Personally
                  Identifiable Information (PII). Handle with appropriate security measures.
                </p>
              </div>
            </>
          )}
        </div>
      </ModalBody>

      {!isEditMode && (
        <ModalFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="h-4 w-4" />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={statement.verified ? 'outline' : 'success'}
                size="sm"
                icon={statement.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                iconPosition="left"
                onClick={handleVerifyToggle}
                loading={isVerifying}
                disabled={operationLoading.verify}
              >
                {statement.verified ? 'Unverify' : 'Verify'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={<Edit2 className="h-4 w-4" />}
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
                loading={isDeleting}
                disabled={operationLoading.delete}
              >
                Delete
              </Button>
            </div>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
};

WitnessStatementDetails.displayName = 'WitnessStatementDetails';

export default WitnessStatementDetails;

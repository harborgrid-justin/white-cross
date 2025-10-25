/**
 * AddCommentDialog Component
 *
 * Modal dialog for adding comments/notes to incident reports.
 * Supports character limit, importance marking, and auto-focus.
 *
 * @component
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';

export interface AddCommentDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** ID of the incident report to add comment to */
  incidentId: string;
  /** Callback when comment is successfully added */
  onSuccess?: (comment: string, isImportant: boolean) => void;
  /** Show loading state during submission */
  loading?: boolean;
  /** Maximum character count (default: 1000) */
  maxLength?: number;
  /** Show importance checkbox (default: true) */
  showImportanceOption?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AddCommentDialog component - Add comment/note modal
 *
 * Production-grade comment dialog with:
 * - Character counter (max 1000 characters)
 * - Optional "Mark as Important" checkbox
 * - Auto-focus on textarea when opened
 * - Loading state during submission
 * - Form validation
 * - Accessible keyboard navigation
 * - Healthcare-compliant design patterns
 *
 * @example
 * ```tsx
 * <AddCommentDialog
 *   isOpen={showCommentDialog}
 *   onClose={() => setShowCommentDialog(false)}
 *   incidentId="incident-123"
 *   onSuccess={(comment, isImportant) => {
 *     // Handle comment submission
 *     addFollowUpNotes(incidentId, comment, isImportant);
 *   }}
 * />
 * ```
 */
const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  isOpen,
  onClose,
  incidentId,
  onSuccess,
  loading = false,
  maxLength = 1000,
  showImportanceOption = true,
  className = '',
}) => {
  const [comment, setComment] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remainingChars = maxLength - comment.length;
  const isValid = comment.trim().length > 0 && comment.length <= maxLength;

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setComment('');
      setIsImportant(false);
      // Auto-focus textarea after modal animation
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid && !loading && onSuccess) {
      onSuccess(comment.trim(), isImportant);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isValid && !loading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      centered
      closeOnBackdropClick={!loading}
      closeOnEscapeKey={!loading}
      showCloseButton={!loading}
    >
      <ModalContent className={className}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Add Comment</ModalTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add a note or comment to this incident report. Comments are part of the official record.
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              {/* Incident ID reference */}
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                Incident ID: <span className="font-mono font-medium">{incidentId}</span>
              </div>

              {/* Comment textarea */}
              <div>
                <label
                  htmlFor="comment-textarea"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Comment <span className="text-danger-600">*</span>
                </label>
                <textarea
                  id="comment-textarea"
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={6}
                  maxLength={maxLength}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                  placeholder="Enter your comment or note here..."
                  aria-describedby="comment-char-count comment-hint"
                  required
                />

                {/* Character count */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p id="comment-hint" className="text-gray-500 dark:text-gray-400">
                    Tip: Press Ctrl+Enter to submit quickly
                  </p>
                  <p
                    id="comment-char-count"
                    className={`font-medium ${
                      remainingChars < 100
                        ? 'text-warning-600 dark:text-warning-400'
                        : remainingChars < 0
                        ? 'text-danger-600 dark:text-danger-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {remainingChars} characters remaining
                  </p>
                </div>
              </div>

              {/* Mark as Important checkbox */}
              {showImportanceOption && (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="mark-important"
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      disabled={loading}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="mark-important"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Mark as Important
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Important comments will be highlighted and flagged for review.
                    </p>
                  </div>
                </div>
              )}

              {/* Validation error */}
              {comment.length > maxLength && (
                <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-danger-600 dark:text-danger-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-danger-800 dark:text-danger-300">
                        Comment exceeds maximum length of {maxLength} characters.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* HIPAA compliance notice */}
              <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-info-600 dark:text-info-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-info-800 dark:text-info-300">
                      Comments are part of the official incident record and are subject to HIPAA compliance.
                      All actions are logged for audit purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
              disabled={!isValid || loading}
            >
              {loading ? 'Adding Comment...' : 'Add Comment'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddCommentDialog;

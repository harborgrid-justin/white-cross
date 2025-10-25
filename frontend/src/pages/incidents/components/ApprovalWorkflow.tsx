/**
 * ApprovalWorkflow Component
 *
 * Approval workflow management for incident reports.
 * Displays approval chain, pending approvals, approve/reject buttons,
 * approval comments, approval history, and required approvers checklist.
 *
 * @component
 * @example
 * ```tsx
 * <ApprovalWorkflow incidentId="incident-123" />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/shared/store-hooks-index';
import { Button } from '@/components/ui/buttons/Button';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Badge } from '@/components/ui/display/Badge';
import { fetchIncidentReportById, updateIncidentReport } from '../store/incidentReportsSlice';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:approval-workflow');

interface ApprovalWorkflowProps {
  /** ID of the incident to display approval workflow for */
  incidentId: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Approval status enum
 */
enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Approver interface
 */
interface Approver {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  required: boolean;
  status: ApprovalStatus;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
}

/**
 * ApprovalWorkflow component - Approval workflow management
 */
const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ incidentId, className = '' }) => {
  const dispatch = useAppDispatch();
  const incident = useAppSelector((state) =>
    state.incidentReports.reports.find((r) => r.id === incidentId) ||
    state.incidentReports.selectedReport
  );
  const currentUser = useAppSelector((state) => state.auth?.user);
  const isLoading = useAppSelector((state) => state.incidentReports.loading.detail);

  const [approvalComment, setApprovalComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showApprovalForm, setShowApprovalForm] = useState<boolean>(false);

  // Mock approvers data - replace with actual data from backend
  const [approvers, setApprovers] = useState<Approver[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'Jane Smith',
      userRole: 'School Nurse',
      required: true,
      status: ApprovalStatus.APPROVED,
      approvedAt: '2025-10-24T10:30:00Z',
      comments: 'Incident documented correctly. Follow-up scheduled.',
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'John Doe',
      userRole: 'Principal',
      required: true,
      status: ApprovalStatus.PENDING,
    },
    {
      id: '3',
      userId: 'user-3',
      userName: 'Sarah Johnson',
      userRole: 'District Administrator',
      required: false,
      status: ApprovalStatus.PENDING,
    },
  ]);

  // Fetch incident if not loaded
  useEffect(() => {
    if (!incident && incidentId) {
      log('Fetching incident for approval workflow:', incidentId);
      dispatch(fetchIncidentReportById(incidentId));
    }
  }, [incident, incidentId, dispatch]);

  // Calculate approval statistics
  const totalApprovers = approvers.length;
  const requiredApprovers = approvers.filter((a) => a.required).length;
  const approvedCount = approvers.filter((a) => a.status === ApprovalStatus.APPROVED).length;
  const requiredApprovedCount = approvers.filter(
    (a) => a.required && a.status === ApprovalStatus.APPROVED
  ).length;
  const rejectedCount = approvers.filter((a) => a.status === ApprovalStatus.REJECTED).length;
  const pendingCount = approvers.filter((a) => a.status === ApprovalStatus.PENDING).length;

  const allRequiredApproved = requiredApprovedCount === requiredApprovers;
  const hasRejections = rejectedCount > 0;

  // Check if current user can approve
  const currentUserApprover = approvers.find((a) => a.userId === currentUser?.id);
  const canCurrentUserApprove =
    currentUserApprover && currentUserApprover.status === ApprovalStatus.PENDING;

  /**
   * Handle approval submission
   */
  const handleApprove = async () => {
    if (!canCurrentUserApprove) {
      toast.error('You do not have permission to approve this incident');
      return;
    }

    setIsSubmitting(true);
    log('Approving incident:', incidentId, 'Comment:', approvalComment);

    try {
      // Update approver status (mock - replace with actual API call)
      setApprovers((prev) =>
        prev.map((approver) =>
          approver.id === currentUserApprover.id
            ? {
                ...approver,
                status: ApprovalStatus.APPROVED,
                approvedAt: new Date().toISOString(),
                comments: approvalComment,
              }
            : approver
        )
      );

      // Update incident in backend if needed
      await dispatch(
        updateIncidentReport({
          id: incidentId,
          data: {
            // Add approval-related fields based on your backend schema
            followUpNotes: `Approved by ${currentUser?.firstName} ${currentUser?.lastName}: ${approvalComment}`,
          },
        })
      ).unwrap();

      toast.success('Incident approved successfully');
      setApprovalComment('');
      setShowApprovalForm(false);
    } catch (error: any) {
      log('Error approving incident:', error);
      toast.error(error.message || 'Failed to approve incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle rejection submission
   */
  const handleReject = async () => {
    if (!canCurrentUserApprove) {
      toast.error('You do not have permission to reject this incident');
      return;
    }

    if (!approvalComment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    log('Rejecting incident:', incidentId, 'Comment:', approvalComment);

    try {
      // Update approver status (mock - replace with actual API call)
      setApprovers((prev) =>
        prev.map((approver) =>
          approver.id === currentUserApprover.id
            ? {
                ...approver,
                status: ApprovalStatus.REJECTED,
                rejectedAt: new Date().toISOString(),
                comments: approvalComment,
              }
            : approver
        )
      );

      // Update incident in backend if needed
      await dispatch(
        updateIncidentReport({
          id: incidentId,
          data: {
            followUpNotes: `Rejected by ${currentUser?.firstName} ${currentUser?.lastName}: ${approvalComment}`,
          },
        })
      ).unwrap();

      toast.success('Incident rejected');
      setApprovalComment('');
      setShowApprovalForm(false);
    } catch (error: any) {
      log('Error rejecting incident:', error);
      toast.error(error.message || 'Failed to reject incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get status badge variant
   */
  const getStatusBadgeVariant = (status: ApprovalStatus): 'success' | 'warning' | 'danger' => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return 'success';
      case ApprovalStatus.REJECTED:
        return 'danger';
      default:
        return 'warning';
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className={cn('approval-workflow', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('approval-workflow', className)}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Approval Workflow
            </h3>
            <div className="flex items-center gap-2">
              {allRequiredApproved && !hasRejections ? (
                <Badge variant="success">All Required Approvals Complete</Badge>
              ) : hasRejections ? (
                <Badge variant="danger">Rejected</Badge>
              ) : (
                <Badge variant="warning">Pending Approvals</Badge>
              )}
            </div>
          </div>

          {/* Approval Statistics */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {approvedCount}/{totalApprovers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Approved</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {requiredApprovedCount}/{requiredApprovers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Required Approved</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pendingCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {rejectedCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Rejected</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (if user can approve) */}
        {canCurrentUserApprove && !showApprovalForm && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
              Your approval is required for this incident.
            </p>
            <div className="flex gap-3">
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowApprovalForm(true)}
              >
                Approve Incident
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowApprovalForm(true)}
              >
                Reject Incident
              </Button>
            </div>
          </div>
        )}

        {/* Approval Form */}
        {showApprovalForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Provide Approval Decision
            </h4>
            <Textarea
              label="Comments"
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="Add your comments or reasons..."
              rows={3}
              maxLength={500}
              showCharCount
              disabled={isSubmitting}
            />
            <div className="flex gap-3 mt-4">
              <Button
                variant="success"
                size="sm"
                onClick={handleApprove}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                loading={isSubmitting}
                disabled={isSubmitting || !approvalComment.trim()}
              >
                Reject
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowApprovalForm(false);
                  setApprovalComment('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Approval Chain */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Approval Chain
          </h4>

          {approvers.map((approver, index) => (
            <div
              key={approver.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                approver.status === ApprovalStatus.PENDING &&
                  'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
                approver.status === ApprovalStatus.APPROVED &&
                  'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
                approver.status === ApprovalStatus.REJECTED &&
                  'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {approver.userName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({approver.userRole})
                    </span>
                    {approver.required && (
                      <Badge variant="danger" size="sm">
                        Required
                      </Badge>
                    )}
                  </div>

                  {/* Approval Status */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusBadgeVariant(approver.status)} size="sm">
                      {approver.status}
                    </Badge>
                    {approver.approvedAt && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Approved on {formatDate(approver.approvedAt)}
                      </span>
                    )}
                    {approver.rejectedAt && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Rejected on {formatDate(approver.rejectedAt)}
                      </span>
                    )}
                  </div>

                  {/* Comments */}
                  {approver.comments && (
                    <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      <span className="font-medium">Comments: </span>
                      {approver.comments}
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div>
                  {approver.status === ApprovalStatus.APPROVED && (
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {approver.status === ApprovalStatus.REJECTED && (
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {approver.status === ApprovalStatus.PENDING && (
                    <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Required Approvers Checklist */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Required Approvers Checklist
          </h4>
          <div className="space-y-2">
            {approvers
              .filter((a) => a.required)
              .map((approver) => (
                <div key={approver.id} className="flex items-center gap-2">
                  {approver.status === ApprovalStatus.APPROVED ? (
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span
                    className={cn(
                      'text-sm',
                      approver.status === ApprovalStatus.APPROVED
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {approver.userName} ({approver.userRole})
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;

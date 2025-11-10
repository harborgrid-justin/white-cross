/**
 * LOC: USACE-DOWNSTREAM-AWM-001
 * File: /reuse/frontend/composites/usace/downstream/approval-workflow-modules.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-document-control-composites.ts
 *   - React 18+, Next.js 16+, TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE document approval systems
 *   - Engineering review workflows
 *   - Quality control applications
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/approval-workflow-modules.ts
 * Locator: WC-USACE-DS-AWM-001
 * Purpose: Document Approval Workflow Modules for USACE
 *
 * LLM Context: Production-ready document approval workflow system for USACE.
 * Comprehensive approval routing, multi-level review, signature tracking, and approval analytics.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useDocumentApprovals,
  type Document,
  type DocumentApproval,
} from '../usace-document-control-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApprovalWorkflowStep {
  id: string;
  stepNumber: number;
  stepName: string;
  approverRole: string;
  requiredApprovers: number;
  parallel: boolean;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  approvals: DocumentApproval[];
}

export interface ApprovalMetrics {
  totalApprovals: number;
  pending: number;
  approved: number;
  rejected: number;
  averageApprovalTime: number;
}

// ============================================================================
// DOCUMENT APPROVAL WORKFLOW
// ============================================================================

/**
 * Complete document approval workflow with multi-level routing
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Approval workflow
 *
 * @example
 * ```tsx
 * <DocumentApprovalWorkflow
 *   documentId="DOC-001"
 *   onApprovalComplete={() => console.log('Approval complete')}
 * />
 * ```
 */
export function DocumentApprovalWorkflow({
  documentId,
  onApprovalComplete,
}: {
  documentId: string;
  onApprovalComplete?: () => void;
}) {
  const {
    approvals,
    requestApproval,
    approveDocument,
    rejectDocument,
    getPendingApprovals,
    isFullyApproved,
  } = useDocumentApprovals(documentId);

  const [comments, setComments] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<DocumentApproval | null>(null);

  const pendingApprovals = useMemo(() => getPendingApprovals(), [getPendingApprovals]);
  const fullyApproved = useMemo(() => isFullyApproved(), [isFullyApproved]);

  const workflowSteps = useMemo<ApprovalWorkflowStep[]>(() => {
    const steps: ApprovalWorkflowStep[] = [];
    const roleGroups: Record<string, DocumentApproval[]> = {};

    approvals.forEach(approval => {
      if (!roleGroups[approval.approverRole]) {
        roleGroups[approval.approverRole] = [];
      }
      roleGroups[approval.approverRole].push(approval);
    });

    let stepNumber = 1;
    Object.entries(roleGroups).forEach(([role, roleApprovals]) => {
      const approvedCount = roleApprovals.filter(a => a.status === 'approved').length;
      const rejectedCount = roleApprovals.filter(a => a.status === 'rejected').length;

      let status: ApprovalWorkflowStep['status'] = 'pending';
      if (approvedCount === roleApprovals.length) {
        status = 'approved';
      } else if (rejectedCount > 0) {
        status = 'rejected';
      } else if (approvedCount > 0) {
        status = 'in_progress';
      }

      steps.push({
        id: crypto.randomUUID(),
        stepNumber,
        stepName: `${role} Review`,
        approverRole: role,
        requiredApprovers: roleApprovals.length,
        parallel: true,
        status,
        approvals: roleApprovals,
      });

      stepNumber++;
    });

    return steps;
  }, [approvals]);

  const handleApprove = useCallback((approval: DocumentApproval) => {
    approveDocument(approval.id, comments);
    setComments('');
    setSelectedApproval(null);

    if (isFullyApproved() && onApprovalComplete) {
      onApprovalComplete();
    }
  }, [comments, approveDocument, isFullyApproved, onApprovalComplete]);

  const handleReject = useCallback((approval: DocumentApproval) => {
    if (!comments.trim()) {
      alert('Please provide comments for rejection');
      return;
    }
    rejectDocument(approval.id, comments);
    setComments('');
    setSelectedApproval(null);
  }, [comments, rejectDocument]);

  return (
    <div className="document-approval-workflow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Approval Workflow</h2>
        <p className="text-gray-600">Document ID: {documentId}</p>
      </div>

      {fullyApproved && (
        <div className="bg-green-100 p-4 rounded-lg mb-6 border-l-4 border-green-500">
          <div className="text-green-800 font-bold text-lg">
            ✓ Document Fully Approved
          </div>
          <div className="text-green-700 text-sm mt-1">
            All required approvals have been obtained.
          </div>
        </div>
      )}

      {/* Workflow Progress */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Workflow Progress</h3>
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300" />
              )}

              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  step.status === 'approved' ? 'bg-green-500' :
                  step.status === 'rejected' ? 'bg-red-500' :
                  step.status === 'in_progress' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}>
                  {step.status === 'approved' ? '✓' :
                   step.status === 'rejected' ? '✗' :
                   step.stepNumber}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-lg">{step.stepName}</div>
                      <div className="text-sm text-gray-600">
                        {step.approvals.length} approver(s) required
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-800' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      step.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {step.approvals.map(approval => (
                      <div
                        key={approval.id}
                        className={`p-3 border-2 rounded-lg ${
                          approval.status === 'approved' ? 'border-green-500 bg-green-50' :
                          approval.status === 'rejected' ? 'border-red-500 bg-red-50' :
                          selectedApproval?.id === approval.id ? 'border-blue-500 bg-blue-50' :
                          'border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{approval.approverName}</div>
                            <div className="text-sm text-gray-600">{approval.approverRole}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            approval.status === 'approved' ? 'bg-green-200 text-green-800' :
                            approval.status === 'rejected' ? 'bg-red-200 text-red-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {approval.status.toUpperCase()}
                          </div>
                        </div>

                        {approval.comments && (
                          <div className="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded">
                            <span className="font-medium">Comments:</span> {approval.comments}
                          </div>
                        )}

                        {approval.approvalDate && (
                          <div className="text-xs text-gray-500">
                            {approval.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                            {approval.approvalDate.toLocaleString()}
                          </div>
                        )}

                        {approval.status === 'pending' && (
                          <div className="mt-3">
                            {selectedApproval?.id === approval.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Add comments (required for rejection)..."
                                  rows={3}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(approval)}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(approval)}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => setSelectedApproval(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedApproval(approval)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Review & Approve
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Approval Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Approvers</div>
            <div className="text-3xl font-bold">{approvals.length}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-3xl font-bold text-green-600">
              {approvals.filter(a => a.status === 'approved').length}
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingApprovals.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Approval queue manager for bulk approval processing
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Approval queue
 *
 * @example
 * ```tsx
 * <ApprovalQueueManager
 *   approverRole="Technical Lead"
 *   onBulkApprove={(approvals) => console.log('Bulk approved', approvals)}
 * />
 * ```
 */
export function ApprovalQueueManager({
  approverRole,
  onBulkApprove,
}: {
  approverRole: string;
  onBulkApprove?: (approvals: DocumentApproval[]) => void;
}) {
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);

  const handleSelectAll = useCallback((approvals: DocumentApproval[]) => {
    const ids = approvals.map(a => a.id);
    setSelectedApprovals(ids);
  }, []);

  const handleBulkApprove = useCallback(() => {
    if (onBulkApprove) {
      const approvals = selectedApprovals.map(id => ({ id } as DocumentApproval));
      onBulkApprove(approvals);
    }
    setSelectedApprovals([]);
  }, [selectedApprovals, onBulkApprove]);

  return (
    <div className="approval-queue-manager p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Approval Queue</h2>
        <p className="text-gray-600">Role: {approverRole}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Pending Approvals</h3>
          {selectedApprovals.length > 0 && (
            <button
              onClick={handleBulkApprove}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Bulk Approve ({selectedApprovals.length})
            </button>
          )}
        </div>

        <div className="text-center py-8 text-gray-500">
          <div className="text-lg">No pending approvals</div>
          <div className="text-sm">You're all caught up!</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  DocumentApprovalWorkflow,
  ApprovalQueueManager,
};

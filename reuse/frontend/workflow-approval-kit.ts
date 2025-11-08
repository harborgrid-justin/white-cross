/**
 * LOC: WAK1234567
 * File: /reuse/frontend/workflow-approval-kit.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Content management systems
 *   - Document approval workflows
 *   - Review and publishing systems
 */

/**
 * File: /reuse/frontend/workflow-approval-kit.ts
 * Locator: WC-FE-WAK-001
 * Purpose: Comprehensive Workflow & Approval Kit - React hooks and components for content workflow management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x
 * Downstream: ../frontend/*, Content management, Document approval, Publishing workflows
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 45+ hooks, components, and utilities for workflow and approval management
 *
 * LLM Context: Enterprise-grade workflow and approval system for React/Next.js applications.
 * Provides comprehensive workflow state management, approval routing, multi-stage approvals,
 * parallel/sequential processing, escalation rules, delegation, notifications, audit trails,
 * and permission management. Essential for content management, document approval, and publishing workflows.
 */

'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  createContext,
  useContext,
  ReactNode,
  ComponentType,
  FC
} from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Workflow status enumeration
 */
export type WorkflowStatus =
  | 'draft'
  | 'pending'
  | 'in_progress'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'suspended';

/**
 * Approval decision types
 */
export type ApprovalDecision = 'approve' | 'reject' | 'request_changes' | 'delegate';

/**
 * Stage execution types
 */
export type StageExecutionType = 'sequential' | 'parallel' | 'conditional';

/**
 * Escalation action types
 */
export type EscalationAction = 'notify' | 'reassign' | 'auto_approve' | 'auto_reject';

/**
 * Workflow stage definition
 */
export interface WorkflowStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: StageExecutionType;
  approvers: string[];
  requiredApprovals: number;
  allowDelegation: boolean;
  allowParallelReview: boolean;
  timeoutMinutes?: number;
  escalationRules?: EscalationRule[];
  conditions?: WorkflowCondition[];
}

/**
 * Workflow condition for conditional routing
 */
export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
  nextStageId?: string;
}

/**
 * Escalation rule for timeout handling
 */
export interface EscalationRule {
  id: string;
  triggerAfterMinutes: number;
  action: EscalationAction;
  escalateTo?: string[];
  notifyUsers?: string[];
  message?: string;
}

/**
 * Workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: number;
  status: 'active' | 'inactive' | 'archived';
  stages: WorkflowStage[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Workflow instance (runtime state)
 */
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowVersion: number;
  contentId: string;
  contentType: string;
  currentStage: string;
  status: WorkflowStatus;
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
  stages: WorkflowStageInstance[];
  history: WorkflowHistoryEntry[];
  metadata?: Record<string, any>;
}

/**
 * Workflow stage instance (runtime state)
 */
export interface WorkflowStageInstance {
  stageId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  approvals: ApprovalRequest[];
  currentApprovers: string[];
  escalated: boolean;
}

/**
 * Approval request
 */
export interface ApprovalRequest {
  id: string;
  workflowInstanceId: string;
  stageId: string;
  requestedFrom: string;
  requestedBy: string;
  requestedAt: Date;
  decision?: ApprovalDecision;
  decidedAt?: Date;
  comments?: string;
  attachments?: string[];
  delegatedTo?: string;
  deadline?: Date;
}

/**
 * Approval review data
 */
export interface ApprovalReview {
  approvalId: string;
  decision: ApprovalDecision;
  comments?: string;
  attachments?: string[];
  delegateTo?: string;
  reviewedAt: Date;
}

/**
 * Workflow history entry
 */
export interface WorkflowHistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  performedBy: string;
  stageId?: string;
  details: Record<string, any>;
}

/**
 * Workflow notification
 */
export interface WorkflowNotification {
  id: string;
  type: 'approval_request' | 'approval_decision' | 'escalation' | 'completion' | 'delegation';
  workflowInstanceId: string;
  recipients: string[];
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Workflow permissions
 */
export interface WorkflowPermissions {
  canInitiate: boolean;
  canApprove: boolean;
  canReject: boolean;
  canDelegate: boolean;
  canCancel: boolean;
  canViewHistory: boolean;
  canEditWorkflow: boolean;
}

/**
 * Workflow role definition
 */
export interface WorkflowRole {
  id: string;
  name: string;
  description?: string;
  permissions: WorkflowPermissions;
  users: string[];
}

/**
 * Workflow builder state
 */
export interface WorkflowBuilderState {
  workflow: Partial<Workflow>;
  currentStage?: string;
  errors: Record<string, string[]>;
  isDirty: boolean;
}

/**
 * Workflow transition options
 */
export interface WorkflowTransitionOptions {
  skipValidation?: boolean;
  forceTransition?: boolean;
  comments?: string;
  metadata?: Record<string, any>;
}

/**
 * Workflow audit entry
 */
export interface WorkflowAuditEntry {
  id: string;
  workflowInstanceId: string;
  timestamp: Date;
  action: string;
  performedBy: string;
  beforeState?: any;
  afterState?: any;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// CONTEXT DEFINITIONS
// ============================================================================

/**
 * Workflow context for provider pattern
 */
interface WorkflowContextValue {
  workflows: Map<string, Workflow>;
  instances: Map<string, WorkflowInstance>;
  loading: boolean;
  error: Error | null;
  refreshWorkflows: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextValue | undefined>(undefined);

/**
 * Approval context for provider pattern
 */
interface ApprovalContextValue {
  pendingApprovals: ApprovalRequest[];
  completedApprovals: ApprovalRequest[];
  loading: boolean;
  error: Error | null;
  refreshApprovals: () => Promise<void>;
}

const ApprovalContext = createContext<ApprovalContextValue | undefined>(undefined);

// ============================================================================
// WORKFLOW CORE HOOKS
// ============================================================================

/**
 * Hook for managing workflow state and operations
 *
 * @param {string} workflowId - Workflow identifier
 * @returns Workflow state and operations
 *
 * @example
 * ```typescript
 * function WorkflowManager() {
 *   const { workflow, loading, updateWorkflow, deleteWorkflow } = useWorkflow('workflow-123');
 *
 *   return (
 *     <div>
 *       <h1>{workflow?.name}</h1>
 *       <button onClick={() => updateWorkflow({ name: 'New Name' })}>
 *         Update
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useWorkflow = (workflowId: string) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/${workflowId}`);
      if (!response.ok) throw new Error('Failed to fetch workflow');
      const data = await response.json();
      setWorkflow(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  const updateWorkflow = useCallback(async (updates: Partial<Workflow>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update workflow');
      const updated = await response.json();
      setWorkflow(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  const deleteWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete workflow');
      setWorkflow(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  return {
    workflow,
    loading,
    error,
    refetch: fetchWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
};

/**
 * Hook for managing workflow instance state
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Workflow instance state and operations
 *
 * @example
 * ```typescript
 * function WorkflowStatus() {
 *   const { instance, loading, currentStage } = useWorkflowState('instance-456');
 *
 *   return (
 *     <div>
 *       <p>Status: {instance?.status}</p>
 *       <p>Current Stage: {currentStage?.name}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useWorkflowState = (instanceId: string) => {
  const [instance, setInstance] = useState<WorkflowInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/instances/${instanceId}`);
      if (!response.ok) throw new Error('Failed to fetch workflow instance');
      const data = await response.json();
      setInstance(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchInstance();
  }, [fetchInstance]);

  const currentStage = useMemo(() => {
    if (!instance) return null;
    return instance.stages.find(s => s.stageId === instance.currentStage);
  }, [instance]);

  const isComplete = useMemo(() => {
    return instance?.status === 'completed' || instance?.status === 'approved';
  }, [instance]);

  const canProgress = useMemo(() => {
    if (!currentStage) return false;
    const requiredApprovals = currentStage.approvals.filter(
      a => a.decision === 'approve'
    ).length;
    return requiredApprovals >= (currentStage.approvals.length || 1);
  }, [currentStage]);

  return {
    instance,
    loading,
    error,
    refetch: fetchInstance,
    currentStage,
    isComplete,
    canProgress,
  };
};

/**
 * Hook for managing workflow transitions between stages
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Transition operations and state
 *
 * @example
 * ```typescript
 * function WorkflowControls() {
 *   const { transition, canTransition, loading } = useWorkflowTransition('instance-456');
 *
 *   return (
 *     <button
 *       onClick={() => transition('next-stage')}
 *       disabled={!canTransition || loading}
 *     >
 *       Move to Next Stage
 *     </button>
 *   );
 * }
 * ```
 */
export const useWorkflowTransition = (instanceId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { instance, refetch } = useWorkflowState(instanceId);

  const canTransition = useMemo(() => {
    if (!instance) return false;
    const currentStage = instance.stages.find(s => s.stageId === instance.currentStage);
    if (!currentStage) return false;

    const approvedCount = currentStage.approvals.filter(
      a => a.decision === 'approve'
    ).length;

    return approvedCount >= (currentStage.approvals.length || 1);
  }, [instance]);

  const transition = useCallback(async (
    targetStageId: string,
    options: WorkflowTransitionOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/workflows/instances/${instanceId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetStageId,
          ...options,
        }),
      });

      if (!response.ok) throw new Error('Failed to transition workflow');

      await refetch();
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [instanceId, refetch]);

  const moveToNextStage = useCallback(async () => {
    if (!instance) throw new Error('No workflow instance');

    const currentStageIndex = instance.stages.findIndex(
      s => s.stageId === instance.currentStage
    );

    if (currentStageIndex === -1 || currentStageIndex >= instance.stages.length - 1) {
      throw new Error('No next stage available');
    }

    const nextStage = instance.stages[currentStageIndex + 1];
    return transition(nextStage.stageId);
  }, [instance, transition]);

  const moveToPreviousStage = useCallback(async () => {
    if (!instance) throw new Error('No workflow instance');

    const currentStageIndex = instance.stages.findIndex(
      s => s.stageId === instance.currentStage
    );

    if (currentStageIndex <= 0) {
      throw new Error('No previous stage available');
    }

    const previousStage = instance.stages[currentStageIndex - 1];
    return transition(previousStage.stageId);
  }, [instance, transition]);

  return {
    transition,
    moveToNextStage,
    moveToPreviousStage,
    canTransition,
    loading,
    error,
  };
};

// ============================================================================
// APPROVAL HOOKS
// ============================================================================

/**
 * Hook for managing approval requests
 *
 * @param {string} approvalId - Approval request identifier
 * @returns Approval request state and operations
 *
 * @example
 * ```typescript
 * function ApprovalCard() {
 *   const { approval, loading, submitDecision } = useApprovalRequest('approval-789');
 *
 *   return (
 *     <div>
 *       <p>Requested from: {approval?.requestedFrom}</p>
 *       <button onClick={() => submitDecision('approve', 'Looks good!')}>
 *         Approve
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useApprovalRequest = (approvalId: string) => {
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApproval = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/approvals/${approvalId}`);
      if (!response.ok) throw new Error('Failed to fetch approval');
      const data = await response.json();
      setApproval(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [approvalId]);

  const submitDecision = useCallback(async (
    decision: ApprovalDecision,
    comments?: string,
    attachments?: string[]
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/approvals/${approvalId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, comments, attachments }),
      });
      if (!response.ok) throw new Error('Failed to submit decision');
      await fetchApproval();
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [approvalId, fetchApproval]);

  useEffect(() => {
    fetchApproval();
  }, [fetchApproval]);

  const isOverdue = useMemo(() => {
    if (!approval?.deadline) return false;
    return new Date() > new Date(approval.deadline);
  }, [approval]);

  const isPending = useMemo(() => {
    return approval && !approval.decision;
  }, [approval]);

  return {
    approval,
    loading,
    error,
    refetch: fetchApproval,
    submitDecision,
    isOverdue,
    isPending,
  };
};

/**
 * Hook for reviewing and submitting approval decisions
 *
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @returns Review operations and state
 *
 * @example
 * ```typescript
 * function ReviewPanel() {
 *   const { submitReview, isSubmitting } = useApprovalReview('instance-456');
 *
 *   const handleApprove = async () => {
 *     await submitReview({
 *       approvalId: 'approval-789',
 *       decision: 'approve',
 *       comments: 'Approved with minor suggestions',
 *       reviewedAt: new Date(),
 *     });
 *   };
 *
 *   return <button onClick={handleApprove} disabled={isSubmitting}>Approve</button>;
 * }
 * ```
 */
export const useApprovalReview = (workflowInstanceId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitReview = useCallback(async (review: ApprovalReview) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${workflowInstanceId}/reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review),
        }
      );

      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [workflowInstanceId]);

  const submitBatchReview = useCallback(async (reviews: ApprovalReview[]) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${workflowInstanceId}/reviews/batch`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit batch reviews');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [workflowInstanceId]);

  return {
    submitReview,
    submitBatchReview,
    isSubmitting,
    error,
  };
};

/**
 * Hook for making approval decisions with validation
 *
 * @param {string} approvalId - Approval request identifier
 * @returns Decision operations and state
 *
 * @example
 * ```typescript
 * function DecisionButtons() {
 *   const { approve, reject, requestChanges, isProcessing } = useApprovalDecision('approval-789');
 *
 *   return (
 *     <>
 *       <button onClick={() => approve('LGTM')} disabled={isProcessing}>Approve</button>
 *       <button onClick={() => reject('Needs work')} disabled={isProcessing}>Reject</button>
 *       <button onClick={() => requestChanges('Please revise')} disabled={isProcessing}>
 *         Request Changes
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export const useApprovalDecision = (approvalId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { submitDecision } = useApprovalRequest(approvalId);

  const approve = useCallback(async (comments?: string, attachments?: string[]) => {
    setIsProcessing(true);
    try {
      return await submitDecision('approve', comments, attachments);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [submitDecision]);

  const reject = useCallback(async (comments: string, attachments?: string[]) => {
    if (!comments) {
      throw new Error('Comments are required when rejecting');
    }
    setIsProcessing(true);
    try {
      return await submitDecision('reject', comments, attachments);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [submitDecision]);

  const requestChanges = useCallback(async (comments: string, attachments?: string[]) => {
    if (!comments) {
      throw new Error('Comments are required when requesting changes');
    }
    setIsProcessing(true);
    try {
      return await submitDecision('request_changes', comments, attachments);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [submitDecision]);

  return {
    approve,
    reject,
    requestChanges,
    isProcessing,
    error,
  };
};

// ============================================================================
// WORKFLOW CRUD OPERATIONS
// ============================================================================

/**
 * Hook for creating new workflows
 *
 * @returns Workflow creation operations
 *
 * @example
 * ```typescript
 * function CreateWorkflow() {
 *   const { createWorkflow, isCreating } = useCreateWorkflow();
 *
 *   const handleCreate = async () => {
 *     const workflow = await createWorkflow({
 *       name: 'Content Review',
 *       stages: [
 *         { id: 'review', name: 'Editorial Review', order: 1, type: 'sequential', approvers: ['editor'] },
 *         { id: 'publish', name: 'Publish', order: 2, type: 'sequential', approvers: ['publisher'] }
 *       ]
 *     });
 *   };
 *
 *   return <button onClick={handleCreate} disabled={isCreating}>Create</button>;
 * }
 * ```
 */
export const useCreateWorkflow = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) throw new Error('Failed to create workflow');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createWorkflow,
    isCreating,
    error,
  };
};

/**
 * Hook for updating existing workflows
 *
 * @param {string} workflowId - Workflow identifier
 * @returns Workflow update operations
 *
 * @example
 * ```typescript
 * function EditWorkflow({ workflowId }: { workflowId: string }) {
 *   const { updateWorkflow, isUpdating } = useUpdateWorkflow(workflowId);
 *
 *   return (
 *     <button onClick={() => updateWorkflow({ name: 'Updated Name' })} disabled={isUpdating}>
 *       Save Changes
 *     </button>
 *   );
 * }
 * ```
 */
export const useUpdateWorkflow = (workflowId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateWorkflow = useCallback(async (updates: Partial<Workflow>) => {
    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update workflow');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [workflowId]);

  return {
    updateWorkflow,
    isUpdating,
    error,
  };
};

/**
 * Hook for deleting workflows
 *
 * @param {string} workflowId - Workflow identifier
 * @returns Workflow deletion operations
 *
 * @example
 * ```typescript
 * function DeleteWorkflowButton({ workflowId }: { workflowId: string }) {
 *   const { deleteWorkflow, isDeleting } = useDeleteWorkflow(workflowId);
 *
 *   return (
 *     <button onClick={deleteWorkflow} disabled={isDeleting}>
 *       Delete Workflow
 *     </button>
 *   );
 * }
 * ```
 */
export const useDeleteWorkflow = (workflowId: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteWorkflow = useCallback(async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workflow');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [workflowId]);

  return {
    deleteWorkflow,
    isDeleting,
    error,
  };
};

// ============================================================================
// WORKFLOW HISTORY & AUDIT
// ============================================================================

/**
 * Hook for accessing workflow history
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Workflow history and operations
 *
 * @example
 * ```typescript
 * function WorkflowHistory() {
 *   const { history, loading } = useWorkflowHistory('instance-456');
 *
 *   return (
 *     <ul>
 *       {history.map(entry => (
 *         <li key={entry.id}>
 *           {entry.action} by {entry.performedBy} at {entry.timestamp}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useWorkflowHistory = (instanceId: string) => {
  const [history, setHistory] = useState<WorkflowHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/instances/${instanceId}/history`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [history]);

  const filterByAction = useCallback((action: string) => {
    return history.filter(entry => entry.action === action);
  }, [history]);

  const filterByUser = useCallback((userId: string) => {
    return history.filter(entry => entry.performedBy === userId);
  }, [history]);

  return {
    history: sortedHistory,
    loading,
    error,
    refetch: fetchHistory,
    filterByAction,
    filterByUser,
  };
};

/**
 * Hook for accessing workflow audit trail
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Audit trail and operations
 *
 * @example
 * ```typescript
 * function AuditTrail() {
 *   const { auditEntries, loading } = useWorkflowAudit('instance-456');
 *
 *   return (
 *     <table>
 *       {auditEntries.map(entry => (
 *         <tr key={entry.id}>
 *           <td>{entry.action}</td>
 *           <td>{entry.performedBy}</td>
 *           <td>{entry.timestamp}</td>
 *         </tr>
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
export const useWorkflowAudit = (instanceId: string) => {
  const [auditEntries, setAuditEntries] = useState<WorkflowAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAudit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/instances/${instanceId}/audit`);
      if (!response.ok) throw new Error('Failed to fetch audit trail');
      const data = await response.json();
      setAuditEntries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  const exportAudit = useCallback(async (format: 'json' | 'csv' | 'pdf' = 'json') => {
    try {
      const response = await fetch(
        `/api/workflows/instances/${instanceId}/audit/export?format=${format}`
      );
      if (!response.ok) throw new Error('Failed to export audit trail');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-${instanceId}.${format}`;
      a.click();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [instanceId]);

  return {
    auditEntries,
    loading,
    error,
    refetch: fetchAudit,
    exportAudit,
  };
};

// ============================================================================
// APPROVAL ROUTING & ASSIGNMENT
// ============================================================================

/**
 * Hook for managing approval routing logic
 *
 * @param {string} workflowId - Workflow identifier
 * @returns Routing operations and state
 *
 * @example
 * ```typescript
 * function RoutingConfig() {
 *   const { routeToApprovers, calculateRoute } = useApprovalRouting('workflow-123');
 *
 *   const handleRoute = async () => {
 *     const route = await calculateRoute({ contentType: 'article', priority: 'high' });
 *     await routeToApprovers(route.approvers);
 *   };
 *
 *   return <button onClick={handleRoute}>Calculate Route</button>;
 * }
 * ```
 */
export const useApprovalRouting = (workflowId: string) => {
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateRoute = useCallback(async (context: Record<string, any>) => {
    try {
      setIsRouting(true);
      setError(null);

      const response = await fetch(`/api/workflows/${workflowId}/routing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!response.ok) throw new Error('Failed to calculate route');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsRouting(false);
    }
  }, [workflowId]);

  const routeToApprovers = useCallback(async (
    instanceId: string,
    approvers: string[],
    stageId: string
  ) => {
    try {
      setIsRouting(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/route`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approvers, stageId }),
        }
      );

      if (!response.ok) throw new Error('Failed to route to approvers');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsRouting(false);
    }
  }, []);

  return {
    calculateRoute,
    routeToApprovers,
    isRouting,
    error,
  };
};

/**
 * Hook for managing approver assignments
 *
 * @param {string} stageId - Workflow stage identifier
 * @returns Assignment operations and state
 *
 * @example
 * ```typescript
 * function AssignApprovers() {
 *   const { assignApprovers, removeApprover } = useApprovalAssignment('stage-123');
 *
 *   return (
 *     <button onClick={() => assignApprovers(['user1', 'user2'])}>
 *       Assign Approvers
 *     </button>
 *   );
 * }
 * ```
 */
export const useApprovalAssignment = (stageId: string) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignApprovers = useCallback(async (approvers: string[]) => {
    try {
      setIsAssigning(true);
      setError(null);

      const response = await fetch(`/api/workflows/stages/${stageId}/approvers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvers }),
      });

      if (!response.ok) throw new Error('Failed to assign approvers');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsAssigning(false);
    }
  }, [stageId]);

  const removeApprover = useCallback(async (approverId: string) => {
    try {
      setIsAssigning(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/stages/${stageId}/approvers/${approverId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to remove approver');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsAssigning(false);
    }
  }, [stageId]);

  const reassignApprover = useCallback(async (
    oldApproverId: string,
    newApproverId: string
  ) => {
    try {
      setIsAssigning(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/stages/${stageId}/approvers/${oldApproverId}/reassign`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newApproverId }),
        }
      );

      if (!response.ok) throw new Error('Failed to reassign approver');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsAssigning(false);
    }
  }, [stageId]);

  return {
    assignApprovers,
    removeApprover,
    reassignApprover,
    isAssigning,
    error,
  };
};

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

/**
 * Hook for sending approval notifications
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Notification operations
 *
 * @example
 * ```typescript
 * function NotificationManager() {
 *   const { notifyApprovers, notifyDecision } = useNotifyApprovers('instance-456');
 *
 *   return (
 *     <button onClick={() => notifyApprovers(['user1', 'user2'])}>
 *       Send Notifications
 *     </button>
 *   );
 * }
 * ```
 */
export const useNotifyApprovers = (instanceId: string) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const notifyApprovers = useCallback(async (
    approvers: string[],
    message?: string
  ) => {
    try {
      setIsSending(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/notify/approvers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approvers, message }),
        }
      );

      if (!response.ok) throw new Error('Failed to notify approvers');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [instanceId]);

  const notifyDecision = useCallback(async (
    decision: ApprovalDecision,
    recipients: string[],
    comments?: string
  ) => {
    try {
      setIsSending(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/notify/decision`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision, recipients, comments }),
        }
      );

      if (!response.ok) throw new Error('Failed to notify decision');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [instanceId]);

  const notifyEscalation = useCallback(async (
    stageId: string,
    escalatedTo: string[],
    reason: string
  ) => {
    try {
      setIsSending(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/notify/escalation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stageId, escalatedTo, reason }),
        }
      );

      if (!response.ok) throw new Error('Failed to notify escalation');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [instanceId]);

  return {
    notifyApprovers,
    notifyDecision,
    notifyEscalation,
    isSending,
    error,
  };
};

/**
 * Hook for managing approval notifications
 *
 * @param {string} userId - User identifier
 * @returns Notifications state and operations
 *
 * @example
 * ```typescript
 * function NotificationBell() {
 *   const { notifications, unreadCount, markAsRead } = useApprovalNotifications('user-123');
 *
 *   return (
 *     <div>
 *       <span>Notifications: {unreadCount}</span>
 *       {notifications.map(notif => (
 *         <div key={notif.id} onClick={() => markAsRead(notif.id)}>
 *           {notif.message}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useApprovalNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<WorkflowNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.metadata?.read).length;
  }, [notifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to mark as read');
      await fetchNotifications();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/users/${userId}/notifications/read-all`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to mark all as read');
      await fetchNotifications();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

// ============================================================================
// MULTI-STAGE APPROVAL HOOKS
// ============================================================================

/**
 * Hook for managing conditional approvals based on rules
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Conditional approval operations
 *
 * @example
 * ```typescript
 * function ConditionalWorkflow() {
 *   const { evaluateConditions, applyCondition } = useConditionalApprovals('instance-456');
 *
 *   const handleEvaluate = async () => {
 *     const result = await evaluateConditions({ amount: 5000 });
 *     // Routes to different stages based on conditions
 *   };
 *
 *   return <button onClick={handleEvaluate}>Evaluate</button>;
 * }
 * ```
 */
export const useConditionalApprovals = (instanceId: string) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const evaluateConditions = useCallback(async (context: Record<string, any>) => {
    try {
      setIsEvaluating(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/conditions/evaluate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context),
        }
      );

      if (!response.ok) throw new Error('Failed to evaluate conditions');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsEvaluating(false);
    }
  }, [instanceId]);

  const applyCondition = useCallback(async (
    stageId: string,
    condition: WorkflowCondition
  ) => {
    try {
      setIsEvaluating(true);
      setError(null);

      const response = await fetch(
        `/api/workflows/instances/${instanceId}/stages/${stageId}/conditions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(condition),
        }
      );

      if (!response.ok) throw new Error('Failed to apply condition');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsEvaluating(false);
    }
  }, [instanceId]);

  return {
    evaluateConditions,
    applyCondition,
    isEvaluating,
    error,
  };
};

/**
 * Hook for managing multi-stage approval workflows
 *
 * @param {string} instanceId - Workflow instance identifier
 * @returns Multi-stage operations and state
 *
 * @example
 * ```typescript
 * function MultiStageWorkflow() {
 *   const { currentStage, allStages, progressToStage } = useMultiStageApprovals('instance-456');
 *
 *   return (
 *     <div>
 *       <p>Current: {currentStage?.name}</p>
 *       <p>Progress: {currentStage?.order} / {allStages.length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useMultiStageApprovals = (instanceId: string) => {
  const { instance, loading, error } = useWorkflowState(instanceId);
  const { transition } = useWorkflowTransition(instanceId);

  const allStages = useMemo(() => {
    if (!instance) return [];
    return instance.stages.sort((a, b) => {
      const stageA = instance.stages.find(s => s.stageId === a.stageId);
      const stageB = instance.stages.find(s => s.stageId === b.stageId);
      return (stageA?.startedAt?.getTime() || 0) - (stageB?.startedAt?.getTime() || 0);
    });
  }, [instance]);

  const currentStage = useMemo(() => {
    if (!instance) return null;
    return instance.stages.find(s => s.stageId === instance.currentStage);
  }, [instance]);

  const completedStages = useMemo(() => {
    return allStages.filter(s => s.status === 'completed');
  }, [allStages]);

  const pendingStages = useMemo(() => {
    return allStages.filter(s => s.status === 'pending');
  }, [allStages]);

  const progressPercentage = useMemo(() => {
    if (allStages.length === 0) return 0;
    return (completedStages.length / allStages.length) * 100;
  }, [allStages, completedStages]);

  const progressToStage = useCallback(async (stageId: string) => {
    return transition(stageId);
  }, [transition]);

  return {
    instance,
    allStages,
    currentStage,
    completedStages,
    pendingStages,
    progressPercentage,
    progressToStage,
    loading,
    error,
  };
};

/**
 * Hook for managing parallel approval processes
 *
 * @param {string} stageId - Workflow stage identifier
 * @returns Parallel approval operations and state
 *
 * @example
 * ```typescript
 * function ParallelApprovalStage() {
 *   const { approvals, allApproved, anyRejected } = useParallelApprovals('stage-123');
 *
 *   return (
 *     <div>
 *       <p>Progress: {approvals.filter(a => a.decision).length} / {approvals.length}</p>
 *       {allApproved && <p>All approved!</p>}
 *       {anyRejected && <p>Some rejected</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useParallelApprovals = (stageId: string) => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/stages/${stageId}/approvals`);
      if (!response.ok) throw new Error('Failed to fetch approvals');
      const data = await response.json();
      setApprovals(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const pendingApprovals = useMemo(() => {
    return approvals.filter(a => !a.decision);
  }, [approvals]);

  const completedApprovals = useMemo(() => {
    return approvals.filter(a => a.decision);
  }, [approvals]);

  const allApproved = useMemo(() => {
    return approvals.length > 0 && approvals.every(a => a.decision === 'approve');
  }, [approvals]);

  const anyRejected = useMemo(() => {
    return approvals.some(a => a.decision === 'reject');
  }, [approvals]);

  const approvalProgress = useMemo(() => {
    if (approvals.length === 0) return 0;
    return (completedApprovals.length / approvals.length) * 100;
  }, [approvals, completedApprovals]);

  return {
    approvals,
    pendingApprovals,
    completedApprovals,
    allApproved,
    anyRejected,
    approvalProgress,
    loading,
    error,
    refetch: fetchApprovals,
  };
};

/**
 * Hook for managing sequential approval processes
 *
 * @param {string} stageId - Workflow stage identifier
 * @returns Sequential approval operations and state
 *
 * @example
 * ```typescript
 * function SequentialApprovalStage() {
 *   const { currentApproval, nextApproval, isLastApproval } = useSequentialApprovals('stage-123');
 *
 *   return (
 *     <div>
 *       <p>Current approver: {currentApproval?.requestedFrom}</p>
 *       {nextApproval && <p>Next: {nextApproval.requestedFrom}</p>}
 *       {isLastApproval && <p>Final approval stage</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useSequentialApprovals = (stageId: string) => {
  const { approvals, loading, error, refetch } = useParallelApprovals(stageId);

  const sortedApprovals = useMemo(() => {
    return [...approvals].sort((a, b) =>
      new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
    );
  }, [approvals]);

  const currentApproval = useMemo(() => {
    return sortedApprovals.find(a => !a.decision);
  }, [sortedApprovals]);

  const nextApproval = useMemo(() => {
    const currentIndex = sortedApprovals.findIndex(a => a.id === currentApproval?.id);
    if (currentIndex === -1) return null;
    return sortedApprovals[currentIndex + 1] || null;
  }, [sortedApprovals, currentApproval]);

  const previousApprovals = useMemo(() => {
    return sortedApprovals.filter(a => a.decision);
  }, [sortedApprovals]);

  const isLastApproval = useMemo(() => {
    return currentApproval !== null && nextApproval === null;
  }, [currentApproval, nextApproval]);

  const canProceed = useMemo(() => {
    return currentApproval?.decision === 'approve';
  }, [currentApproval]);

  return {
    approvals: sortedApprovals,
    currentApproval,
    nextApproval,
    previousApprovals,
    isLastApproval,
    canProceed,
    loading,
    error,
    refetch,
  };
};

// ============================================================================
// ESCALATION & TIMEOUT HOOKS
// ============================================================================

/**
 * Hook for managing escalation rules
 *
 * @param {string} stageId - Workflow stage identifier
 * @returns Escalation operations and state
 *
 * @example
 * ```typescript
 * function EscalationManager() {
 *   const { addRule, removeRule, triggerEscalation } = useEscalationRules('stage-123');
 *
 *   const handleAddRule = async () => {
 *     await addRule({
 *       id: 'rule-1',
 *       triggerAfterMinutes: 60,
 *       action: 'notify',
 *       escalateTo: ['manager@example.com']
 *     });
 *   };
 *
 *   return <button onClick={handleAddRule}>Add Escalation Rule</button>;
 * }
 * ```
 */
export const useEscalationRules = (stageId: string) => {
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules`);
      if (!response.ok) throw new Error('Failed to fetch escalation rules');
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const addRule = useCallback(async (rule: EscalationRule) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      if (!response.ok) throw new Error('Failed to add escalation rule');
      await fetchRules();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stageId, fetchRules]);

  const removeRule = useCallback(async (ruleId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/workflows/stages/${stageId}/escalation-rules/${ruleId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to remove escalation rule');
      await fetchRules();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stageId, fetchRules]);

  const triggerEscalation = useCallback(async (ruleId: string) => {
    try {
      const response = await fetch(
        `/api/workflows/stages/${stageId}/escalation-rules/${ruleId}/trigger`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to trigger escalation');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [stageId]);

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    addRule,
    removeRule,
    triggerEscalation,
  };
};

/**
 * Hook for handling approval timeouts
 *
 * @param {string} approvalId - Approval request identifier
 * @param {number} timeoutMinutes - Timeout duration in minutes
 * @returns Timeout state and operations
 *
 * @example
 * ```typescript
 * function ApprovalWithTimeout() {
 *   const { timeRemaining, isExpired, extend } = useTimeoutHandling('approval-789', 60);
 *
 *   return (
 *     <div>
 *       <p>Time remaining: {timeRemaining} minutes</p>
 *       {isExpired && <p>This approval has expired</p>}
 *       <button onClick={() => extend(30)}>Extend 30 minutes</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useTimeoutHandling = (approvalId: string, timeoutMinutes: number) => {
  const { approval, refetch } = useApprovalRequest(approvalId);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeoutMinutes);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!approval?.requestedAt) return;

    const interval = setInterval(() => {
      const requestedAt = new Date(approval.requestedAt).getTime();
      const now = Date.now();
      const elapsed = (now - requestedAt) / (1000 * 60); // Convert to minutes
      const remaining = Math.max(0, timeoutMinutes - elapsed);

      setTimeRemaining(Math.round(remaining));
      setIsExpired(remaining === 0);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [approval, timeoutMinutes]);

  const extend = useCallback(async (additionalMinutes: number) => {
    try {
      const response = await fetch(`/api/approvals/${approvalId}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalMinutes }),
      });
      if (!response.ok) throw new Error('Failed to extend timeout');
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [approvalId, refetch]);

  const cancel = useCallback(async () => {
    try {
      const response = await fetch(`/api/approvals/${approvalId}/cancel`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel approval');
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [approvalId, refetch]);

  return {
    timeRemaining,
    isExpired,
    extend,
    cancel,
  };
};

// ============================================================================
// DELEGATION HOOKS
// ============================================================================

/**
 * Hook for delegating approvals to other users
 *
 * @param {string} approvalId - Approval request identifier
 * @returns Delegation operations
 *
 * @example
 * ```typescript
 * function DelegateApprovalButton() {
 *   const { delegate, isDelegating } = useDelegateApproval('approval-789');
 *
 *   return (
 *     <button
 *       onClick={() => delegate('user-456', 'Out of office')}
 *       disabled={isDelegating}
 *     >
 *       Delegate Approval
 *     </button>
 *   );
 * }
 * ```
 */
export const useDelegateApproval = (approvalId: string) => {
  const [isDelegating, setIsDelegating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const delegate = useCallback(async (
    delegateToUserId: string,
    reason?: string
  ) => {
    try {
      setIsDelegating(true);
      setError(null);

      const response = await fetch(`/api/approvals/${approvalId}/delegate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegateToUserId, reason }),
      });

      if (!response.ok) throw new Error('Failed to delegate approval');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsDelegating(false);
    }
  }, [approvalId]);

  const reclaim = useCallback(async () => {
    try {
      setIsDelegating(true);
      setError(null);

      const response = await fetch(`/api/approvals/${approvalId}/reclaim`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reclaim approval');
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsDelegating(false);
    }
  }, [approvalId]);

  return {
    delegate,
    reclaim,
    isDelegating,
    error,
  };
};

/**
 * Hook for managing substitute approvers
 *
 * @param {string} userId - User identifier
 * @returns Substitute approver operations
 *
 * @example
 * ```typescript
 * function SubstituteManager() {
 *   const { substitutes, addSubstitute, removeSubstitute } = useSubstituteApprovers('user-123');
 *
 *   return (
 *     <div>
 *       {substitutes.map(sub => (
 *         <div key={sub.id}>
 *           {sub.name}
 *           <button onClick={() => removeSubstitute(sub.id)}>Remove</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useSubstituteApprovers = (userId: string) => {
  const [substitutes, setSubstitutes] = useState<Array<{ id: string; name: string; startDate: Date; endDate?: Date }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubstitutes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}/substitutes`);
      if (!response.ok) throw new Error('Failed to fetch substitutes');
      const data = await response.json();
      setSubstitutes(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubstitutes();
  }, [fetchSubstitutes]);

  const addSubstitute = useCallback(async (
    substituteUserId: string,
    startDate: Date,
    endDate?: Date
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/substitutes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ substituteUserId, startDate, endDate }),
      });
      if (!response.ok) throw new Error('Failed to add substitute');
      await fetchSubstitutes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchSubstitutes]);

  const removeSubstitute = useCallback(async (substituteId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/${userId}/substitutes/${substituteId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to remove substitute');
      await fetchSubstitutes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchSubstitutes]);

  return {
    substitutes,
    loading,
    error,
    refetch: fetchSubstitutes,
    addSubstitute,
    removeSubstitute,
  };
};

// ============================================================================
// PERMISSIONS & ROLES HOOKS
// ============================================================================

/**
 * Hook for managing workflow permissions
 *
 * @param {string} workflowId - Workflow identifier
 * @param {string} userId - User identifier
 * @returns Workflow permissions
 *
 * @example
 * ```typescript
 * function WorkflowActions() {
 *   const { permissions, loading } = useWorkflowPermissions('workflow-123', 'user-456');
 *
 *   return (
 *     <div>
 *       {permissions.canApprove && <button>Approve</button>}
 *       {permissions.canReject && <button>Reject</button>}
 *       {permissions.canDelegate && <button>Delegate</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useWorkflowPermissions = (workflowId: string, userId: string) => {
  const [permissions, setPermissions] = useState<WorkflowPermissions>({
    canInitiate: false,
    canApprove: false,
    canReject: false,
    canDelegate: false,
    canCancel: false,
    canViewHistory: false,
    canEditWorkflow: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/workflows/${workflowId}/permissions?userId=${userId}`
      );
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [workflowId, userId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback((permission: keyof WorkflowPermissions) => {
    return permissions[permission];
  }, [permissions]);

  return {
    permissions,
    hasPermission,
    loading,
    error,
    refetch: fetchPermissions,
  };
};

/**
 * Hook for managing workflow roles
 *
 * @param {string} workflowId - Workflow identifier
 * @returns Workflow roles operations
 *
 * @example
 * ```typescript
 * function RoleManager() {
 *   const { roles, addRole, updateRole, deleteRole } = useWorkflowRoles('workflow-123');
 *
 *   return (
 *     <div>
 *       {roles.map(role => (
 *         <div key={role.id}>
 *           {role.name}
 *           <button onClick={() => deleteRole(role.id)}>Delete</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useWorkflowRoles = (workflowId: string) => {
  const [roles, setRoles] = useState<WorkflowRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/${workflowId}/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const addRole = useCallback(async (role: Omit<WorkflowRole, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });
      if (!response.ok) throw new Error('Failed to add role');
      await fetchRoles();
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workflowId, fetchRoles]);

  const updateRole = useCallback(async (roleId: string, updates: Partial<WorkflowRole>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update role');
      await fetchRoles();
      return response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workflowId, fetchRoles]);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}/roles/${roleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete role');
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workflowId, fetchRoles]);

  const assignUserToRole = useCallback(async (roleId: string, userId: string) => {
    try {
      const response = await fetch(
        `/api/workflows/${workflowId}/roles/${roleId}/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) throw new Error('Failed to assign user to role');
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [workflowId, fetchRoles]);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    addRole,
    updateRole,
    deleteRole,
    assignUserToRole,
  };
};

// ============================================================================
// WORKFLOW BUILDER COMPONENTS
// ============================================================================

/**
 * Reducer for workflow builder state management
 */
const workflowBuilderReducer = (
  state: WorkflowBuilderState,
  action: { type: string; payload?: any }
): WorkflowBuilderState => {
  switch (action.type) {
    case 'SET_WORKFLOW':
      return { ...state, workflow: action.payload, isDirty: true };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflow: { ...state.workflow, ...action.payload },
        isDirty: true,
      };
    case 'ADD_STAGE':
      return {
        ...state,
        workflow: {
          ...state.workflow,
          stages: [...(state.workflow.stages || []), action.payload],
        },
        isDirty: true,
      };
    case 'UPDATE_STAGE':
      return {
        ...state,
        workflow: {
          ...state.workflow,
          stages: state.workflow.stages?.map(s =>
            s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
          ),
        },
        isDirty: true,
      };
    case 'REMOVE_STAGE':
      return {
        ...state,
        workflow: {
          ...state.workflow,
          stages: state.workflow.stages?.filter(s => s.id !== action.payload),
        },
        isDirty: true,
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET':
      return {
        workflow: {},
        errors: {},
        isDirty: false,
      };
    default:
      return state;
  }
};

/**
 * Hook for building workflows with drag-and-drop and visual editor
 *
 * @returns Workflow builder state and operations
 *
 * @example
 * ```typescript
 * function WorkflowBuilder() {
 *   const { workflow, addStage, updateStage, validate, save } = useWorkflowBuilder();
 *
 *   return (
 *     <div>
 *       <input
 *         value={workflow.name || ''}
 *         onChange={(e) => updateStage('name', e.target.value)}
 *       />
 *       <button onClick={() => addStage({ name: 'New Stage', type: 'sequential' })}>
 *         Add Stage
 *       </button>
 *       <button onClick={save}>Save Workflow</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useWorkflowBuilder = () => {
  const [state, dispatch] = useReducer(workflowBuilderReducer, {
    workflow: {},
    errors: {},
    isDirty: false,
  });

  const updateWorkflow = useCallback((updates: Partial<Workflow>) => {
    dispatch({ type: 'UPDATE_WORKFLOW', payload: updates });
  }, []);

  const addStage = useCallback((stage: WorkflowStage) => {
    dispatch({ type: 'ADD_STAGE', payload: stage });
  }, []);

  const updateStage = useCallback((stageId: string, updates: Partial<WorkflowStage>) => {
    dispatch({ type: 'UPDATE_STAGE', payload: { id: stageId, updates } });
  }, []);

  const removeStage = useCallback((stageId: string) => {
    dispatch({ type: 'REMOVE_STAGE', payload: stageId });
  }, []);

  const reorderStages = useCallback((stageIds: string[]) => {
    const reordered = stageIds.map((id, index) => {
      const stage = state.workflow.stages?.find(s => s.id === id);
      return stage ? { ...stage, order: index } : null;
    }).filter(Boolean) as WorkflowStage[];

    dispatch({
      type: 'UPDATE_WORKFLOW',
      payload: { stages: reordered },
    });
  }, [state.workflow.stages]);

  const validate = useCallback(() => {
    const errors: Record<string, string[]> = {};

    if (!state.workflow.name) {
      errors.name = ['Workflow name is required'];
    }

    if (!state.workflow.stages || state.workflow.stages.length === 0) {
      errors.stages = ['At least one stage is required'];
    }

    state.workflow.stages?.forEach((stage, index) => {
      if (!stage.name) {
        errors[`stage-${index}-name`] = ['Stage name is required'];
      }
      if (!stage.approvers || stage.approvers.length === 0) {
        errors[`stage-${index}-approvers`] = ['At least one approver is required'];
      }
    });

    dispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  }, [state.workflow]);

  const save = useCallback(async () => {
    if (!validate()) {
      throw new Error('Validation failed');
    }

    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.workflow),
    });

    if (!response.ok) {
      throw new Error('Failed to save workflow');
    }

    dispatch({ type: 'RESET' });
    return response.json();
  }, [state.workflow, validate]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    workflow: state.workflow,
    errors: state.errors,
    isDirty: state.isDirty,
    updateWorkflow,
    addStage,
    updateStage,
    removeStage,
    reorderStages,
    validate,
    save,
    reset,
  };
};

// ============================================================================
// PROVIDER COMPONENTS
// ============================================================================

/**
 * Workflow provider component for context-based workflow management
 *
 * @example
 * ```typescript
 * function App() {
 *   return (
 *     <WorkflowProvider>
 *       <WorkflowDashboard />
 *     </WorkflowProvider>
 *   );
 * }
 * ```
 */
export const WorkflowProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Map<string, Workflow>>(new Map());
  const [instances, setInstances] = useState<Map<string, WorkflowInstance>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/workflows');
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      const workflowMap = new Map(data.map((w: Workflow) => [w.id, w]));
      setWorkflows(workflowMap);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkflows();
  }, [refreshWorkflows]);

  const value: WorkflowContextValue = {
    workflows,
    instances,
    loading,
    error,
    refreshWorkflows,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

/**
 * Approval provider component for context-based approval management
 *
 * @example
 * ```typescript
 * function App() {
 *   return (
 *     <ApprovalProvider userId="user-123">
 *       <ApprovalDashboard />
 *     </ApprovalProvider>
 *   );
 * }
 * ```
 */
export const ApprovalProvider: FC<{ userId: string; children: ReactNode }> = ({
  userId,
  children,
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}/approvals`);
      if (!response.ok) throw new Error('Failed to fetch approvals');
      const data = await response.json();
      setPendingApprovals(data.filter((a: ApprovalRequest) => !a.decision));
      setCompletedApprovals(data.filter((a: ApprovalRequest) => a.decision));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshApprovals();
  }, [refreshApprovals]);

  const value: ApprovalContextValue = {
    pendingApprovals,
    completedApprovals,
    loading,
    error,
    refreshApprovals,
  };

  return (
    <ApprovalContext.Provider value={value}>
      {children}
    </ApprovalContext.Provider>
  );
};

/**
 * Hook to access workflow context
 */
export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within WorkflowProvider');
  }
  return context;
};

/**
 * Hook to access approval context
 */
export const useApprovalContext = () => {
  const context = useContext(ApprovalContext);
  if (!context) {
    throw new Error('useApprovalContext must be used within ApprovalProvider');
  }
  return context;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate workflow progress percentage
 */
export const calculateWorkflowProgress = (instance: WorkflowInstance): number => {
  const totalStages = instance.stages.length;
  const completedStages = instance.stages.filter(s => s.status === 'completed').length;
  return totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
};

/**
 * Check if stage is ready for transition
 */
export const canTransitionStage = (stage: WorkflowStageInstance): boolean => {
  const approvedCount = stage.approvals.filter(a => a.decision === 'approve').length;
  return approvedCount >= stage.approvals.length;
};

/**
 * Get next stage in workflow
 */
export const getNextStage = (
  instance: WorkflowInstance,
  currentStageId: string
): WorkflowStageInstance | null => {
  const currentIndex = instance.stages.findIndex(s => s.stageId === currentStageId);
  if (currentIndex === -1 || currentIndex >= instance.stages.length - 1) return null;
  return instance.stages[currentIndex + 1];
};

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes < 1) return 'Less than 1 minute';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}${
      remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''
    }`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return `${days} day${days !== 1 ? 's' : ''}${
    remainingHours > 0 ? ` ${remainingHours}h` : ''
  }`;
};

/**
 * Validate workflow configuration
 */
export const validateWorkflow = (workflow: Partial<Workflow>): string[] => {
  const errors: string[] = [];

  if (!workflow.name) {
    errors.push('Workflow name is required');
  }

  if (!workflow.stages || workflow.stages.length === 0) {
    errors.push('At least one stage is required');
  }

  workflow.stages?.forEach((stage, index) => {
    if (!stage.name) {
      errors.push(`Stage ${index + 1}: Name is required`);
    }
    if (!stage.approvers || stage.approvers.length === 0) {
      errors.push(`Stage ${index + 1}: At least one approver is required`);
    }
    if (stage.requiredApprovals > stage.approvers.length) {
      errors.push(`Stage ${index + 1}: Required approvals cannot exceed number of approvers`);
    }
  });

  return errors;
};

/**
 * Export workflow configuration as JSON
 */
export const exportWorkflow = (workflow: Workflow): string => {
  return JSON.stringify(workflow, null, 2);
};

/**
 * Import workflow configuration from JSON
 */
export const importWorkflow = (json: string): Workflow => {
  try {
    const workflow = JSON.parse(json);
    const errors = validateWorkflow(workflow);
    if (errors.length > 0) {
      throw new Error(`Invalid workflow: ${errors.join(', ')}`);
    }
    return workflow;
  } catch (err) {
    throw new Error('Invalid workflow JSON');
  }
};

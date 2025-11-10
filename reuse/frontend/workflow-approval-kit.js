"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importWorkflow = exports.exportWorkflow = exports.validateWorkflow = exports.formatTimeRemaining = exports.getNextStage = exports.canTransitionStage = exports.calculateWorkflowProgress = exports.useApprovalContext = exports.useWorkflowContext = exports.ApprovalProvider = exports.WorkflowProvider = exports.useWorkflowBuilder = exports.useWorkflowRoles = exports.useWorkflowPermissions = exports.useSubstituteApprovers = exports.useDelegateApproval = exports.useTimeoutHandling = exports.useEscalationRules = exports.useSequentialApprovals = exports.useParallelApprovals = exports.useMultiStageApprovals = exports.useConditionalApprovals = exports.useApprovalNotifications = exports.useNotifyApprovers = exports.useApprovalAssignment = exports.useApprovalRouting = exports.useWorkflowAudit = exports.useWorkflowHistory = exports.useDeleteWorkflow = exports.useUpdateWorkflow = exports.useCreateWorkflow = exports.useApprovalDecision = exports.useApprovalReview = exports.useApprovalRequest = exports.useWorkflowTransition = exports.useWorkflowState = exports.useWorkflow = void 0;
const react_1 = require("react");
const WorkflowContext = (0, react_1.createContext)(undefined);
const ApprovalContext = (0, react_1.createContext)(undefined);
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
const useWorkflow = (workflowId) => {
    const [workflow, setWorkflow] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchWorkflow = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}`);
            if (!response.ok)
                throw new Error('Failed to fetch workflow');
            const data = await response.json();
            setWorkflow(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [workflowId]);
    const updateWorkflow = (0, react_1.useCallback)(async (updates) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Failed to update workflow');
            const updated = await response.json();
            setWorkflow(updated);
            return updated;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [workflowId]);
    const deleteWorkflow = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/${workflowId}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete workflow');
            setWorkflow(null);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [workflowId]);
    (0, react_1.useEffect)(() => {
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
exports.useWorkflow = useWorkflow;
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
const useWorkflowState = (instanceId) => {
    const [instance, setInstance] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchInstance = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}`);
            if (!response.ok)
                throw new Error('Failed to fetch workflow instance');
            const data = await response.json();
            setInstance(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [instanceId]);
    (0, react_1.useEffect)(() => {
        fetchInstance();
    }, [fetchInstance]);
    const currentStage = (0, react_1.useMemo)(() => {
        if (!instance)
            return null;
        return instance.stages.find(s => s.stageId === instance.currentStage);
    }, [instance]);
    const isComplete = (0, react_1.useMemo)(() => {
        return instance?.status === 'completed' || instance?.status === 'approved';
    }, [instance]);
    const canProgress = (0, react_1.useMemo)(() => {
        if (!currentStage)
            return false;
        const requiredApprovals = currentStage.approvals.filter(a => a.decision === 'approve').length;
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
exports.useWorkflowState = useWorkflowState;
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
const useWorkflowTransition = (instanceId) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const { instance, refetch } = (0, exports.useWorkflowState)(instanceId);
    const canTransition = (0, react_1.useMemo)(() => {
        if (!instance)
            return false;
        const currentStage = instance.stages.find(s => s.stageId === instance.currentStage);
        if (!currentStage)
            return false;
        const approvedCount = currentStage.approvals.filter(a => a.decision === 'approve').length;
        return approvedCount >= (currentStage.approvals.length || 1);
    }, [instance]);
    const transition = (0, react_1.useCallback)(async (targetStageId, options = {}) => {
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
            if (!response.ok)
                throw new Error('Failed to transition workflow');
            await refetch();
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [instanceId, refetch]);
    const moveToNextStage = (0, react_1.useCallback)(async () => {
        if (!instance)
            throw new Error('No workflow instance');
        const currentStageIndex = instance.stages.findIndex(s => s.stageId === instance.currentStage);
        if (currentStageIndex === -1 || currentStageIndex >= instance.stages.length - 1) {
            throw new Error('No next stage available');
        }
        const nextStage = instance.stages[currentStageIndex + 1];
        return transition(nextStage.stageId);
    }, [instance, transition]);
    const moveToPreviousStage = (0, react_1.useCallback)(async () => {
        if (!instance)
            throw new Error('No workflow instance');
        const currentStageIndex = instance.stages.findIndex(s => s.stageId === instance.currentStage);
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
exports.useWorkflowTransition = useWorkflowTransition;
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
const useApprovalRequest = (approvalId) => {
    const [approval, setApproval] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchApproval = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/approvals/${approvalId}`);
            if (!response.ok)
                throw new Error('Failed to fetch approval');
            const data = await response.json();
            setApproval(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [approvalId]);
    const submitDecision = (0, react_1.useCallback)(async (decision, comments, attachments) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/approvals/${approvalId}/decision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, comments, attachments }),
            });
            if (!response.ok)
                throw new Error('Failed to submit decision');
            await fetchApproval();
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [approvalId, fetchApproval]);
    (0, react_1.useEffect)(() => {
        fetchApproval();
    }, [fetchApproval]);
    const isOverdue = (0, react_1.useMemo)(() => {
        if (!approval?.deadline)
            return false;
        return new Date() > new Date(approval.deadline);
    }, [approval]);
    const isPending = (0, react_1.useMemo)(() => {
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
exports.useApprovalRequest = useApprovalRequest;
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
const useApprovalReview = (workflowInstanceId) => {
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const submitReview = (0, react_1.useCallback)(async (review) => {
        try {
            setIsSubmitting(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${workflowInstanceId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review),
            });
            if (!response.ok)
                throw new Error('Failed to submit review');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsSubmitting(false);
        }
    }, [workflowInstanceId]);
    const submitBatchReview = (0, react_1.useCallback)(async (reviews) => {
        try {
            setIsSubmitting(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${workflowInstanceId}/reviews/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews }),
            });
            if (!response.ok)
                throw new Error('Failed to submit batch reviews');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useApprovalReview = useApprovalReview;
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
const useApprovalDecision = (approvalId) => {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const { submitDecision } = (0, exports.useApprovalRequest)(approvalId);
    const approve = (0, react_1.useCallback)(async (comments, attachments) => {
        setIsProcessing(true);
        try {
            return await submitDecision('approve', comments, attachments);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, [submitDecision]);
    const reject = (0, react_1.useCallback)(async (comments, attachments) => {
        if (!comments) {
            throw new Error('Comments are required when rejecting');
        }
        setIsProcessing(true);
        try {
            return await submitDecision('reject', comments, attachments);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, [submitDecision]);
    const requestChanges = (0, react_1.useCallback)(async (comments, attachments) => {
        if (!comments) {
            throw new Error('Comments are required when requesting changes');
        }
        setIsProcessing(true);
        try {
            return await submitDecision('request_changes', comments, attachments);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useApprovalDecision = useApprovalDecision;
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
const useCreateWorkflow = () => {
    const [isCreating, setIsCreating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const createWorkflow = (0, react_1.useCallback)(async (workflow) => {
        try {
            setIsCreating(true);
            setError(null);
            const response = await fetch('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workflow),
            });
            if (!response.ok)
                throw new Error('Failed to create workflow');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsCreating(false);
        }
    }, []);
    return {
        createWorkflow,
        isCreating,
        error,
    };
};
exports.useCreateWorkflow = useCreateWorkflow;
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
const useUpdateWorkflow = (workflowId) => {
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const updateWorkflow = (0, react_1.useCallback)(async (updates) => {
        try {
            setIsUpdating(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Failed to update workflow');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsUpdating(false);
        }
    }, [workflowId]);
    return {
        updateWorkflow,
        isUpdating,
        error,
    };
};
exports.useUpdateWorkflow = useUpdateWorkflow;
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
const useDeleteWorkflow = (workflowId) => {
    const [isDeleting, setIsDeleting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const deleteWorkflow = (0, react_1.useCallback)(async () => {
        try {
            setIsDeleting(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete workflow');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsDeleting(false);
        }
    }, [workflowId]);
    return {
        deleteWorkflow,
        isDeleting,
        error,
    };
};
exports.useDeleteWorkflow = useDeleteWorkflow;
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
const useWorkflowHistory = (instanceId) => {
    const [history, setHistory] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchHistory = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/history`);
            if (!response.ok)
                throw new Error('Failed to fetch history');
            const data = await response.json();
            setHistory(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [instanceId]);
    (0, react_1.useEffect)(() => {
        fetchHistory();
    }, [fetchHistory]);
    const sortedHistory = (0, react_1.useMemo)(() => {
        return [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [history]);
    const filterByAction = (0, react_1.useCallback)((action) => {
        return history.filter(entry => entry.action === action);
    }, [history]);
    const filterByUser = (0, react_1.useCallback)((userId) => {
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
exports.useWorkflowHistory = useWorkflowHistory;
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
const useWorkflowAudit = (instanceId) => {
    const [auditEntries, setAuditEntries] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchAudit = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/audit`);
            if (!response.ok)
                throw new Error('Failed to fetch audit trail');
            const data = await response.json();
            setAuditEntries(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [instanceId]);
    (0, react_1.useEffect)(() => {
        fetchAudit();
    }, [fetchAudit]);
    const exportAudit = (0, react_1.useCallback)(async (format = 'json') => {
        try {
            const response = await fetch(`/api/workflows/instances/${instanceId}/audit/export?format=${format}`);
            if (!response.ok)
                throw new Error('Failed to export audit trail');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-${instanceId}.${format}`;
            a.click();
        }
        catch (err) {
            setError(err);
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
exports.useWorkflowAudit = useWorkflowAudit;
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
const useApprovalRouting = (workflowId) => {
    const [isRouting, setIsRouting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const calculateRoute = (0, react_1.useCallback)(async (context) => {
        try {
            setIsRouting(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}/routing/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context),
            });
            if (!response.ok)
                throw new Error('Failed to calculate route');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsRouting(false);
        }
    }, [workflowId]);
    const routeToApprovers = (0, react_1.useCallback)(async (instanceId, approvers, stageId) => {
        try {
            setIsRouting(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvers, stageId }),
            });
            if (!response.ok)
                throw new Error('Failed to route to approvers');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useApprovalRouting = useApprovalRouting;
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
const useApprovalAssignment = (stageId) => {
    const [isAssigning, setIsAssigning] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const assignApprovers = (0, react_1.useCallback)(async (approvers) => {
        try {
            setIsAssigning(true);
            setError(null);
            const response = await fetch(`/api/workflows/stages/${stageId}/approvers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvers }),
            });
            if (!response.ok)
                throw new Error('Failed to assign approvers');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsAssigning(false);
        }
    }, [stageId]);
    const removeApprover = (0, react_1.useCallback)(async (approverId) => {
        try {
            setIsAssigning(true);
            setError(null);
            const response = await fetch(`/api/workflows/stages/${stageId}/approvers/${approverId}`, { method: 'DELETE' });
            if (!response.ok)
                throw new Error('Failed to remove approver');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsAssigning(false);
        }
    }, [stageId]);
    const reassignApprover = (0, react_1.useCallback)(async (oldApproverId, newApproverId) => {
        try {
            setIsAssigning(true);
            setError(null);
            const response = await fetch(`/api/workflows/stages/${stageId}/approvers/${oldApproverId}/reassign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newApproverId }),
            });
            if (!response.ok)
                throw new Error('Failed to reassign approver');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useApprovalAssignment = useApprovalAssignment;
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
const useNotifyApprovers = (instanceId) => {
    const [isSending, setIsSending] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const notifyApprovers = (0, react_1.useCallback)(async (approvers, message) => {
        try {
            setIsSending(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/notify/approvers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvers, message }),
            });
            if (!response.ok)
                throw new Error('Failed to notify approvers');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsSending(false);
        }
    }, [instanceId]);
    const notifyDecision = (0, react_1.useCallback)(async (decision, recipients, comments) => {
        try {
            setIsSending(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/notify/decision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, recipients, comments }),
            });
            if (!response.ok)
                throw new Error('Failed to notify decision');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsSending(false);
        }
    }, [instanceId]);
    const notifyEscalation = (0, react_1.useCallback)(async (stageId, escalatedTo, reason) => {
        try {
            setIsSending(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/notify/escalation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stageId, escalatedTo, reason }),
            });
            if (!response.ok)
                throw new Error('Failed to notify escalation');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useNotifyApprovers = useNotifyApprovers;
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
const useApprovalNotifications = (userId) => {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchNotifications = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/users/${userId}/notifications`);
            if (!response.ok)
                throw new Error('Failed to fetch notifications');
            const data = await response.json();
            setNotifications(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    (0, react_1.useEffect)(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    const unreadCount = (0, react_1.useMemo)(() => {
        return notifications.filter(n => !n.metadata?.read).length;
    }, [notifications]);
    const markAsRead = (0, react_1.useCallback)(async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
            if (!response.ok)
                throw new Error('Failed to mark as read');
            await fetchNotifications();
        }
        catch (err) {
            setError(err);
            throw err;
        }
    }, [fetchNotifications]);
    const markAllAsRead = (0, react_1.useCallback)(async () => {
        try {
            const response = await fetch(`/api/users/${userId}/notifications/read-all`, { method: 'POST' });
            if (!response.ok)
                throw new Error('Failed to mark all as read');
            await fetchNotifications();
        }
        catch (err) {
            setError(err);
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
exports.useApprovalNotifications = useApprovalNotifications;
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
const useConditionalApprovals = (instanceId) => {
    const [isEvaluating, setIsEvaluating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const evaluateConditions = (0, react_1.useCallback)(async (context) => {
        try {
            setIsEvaluating(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/conditions/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context),
            });
            if (!response.ok)
                throw new Error('Failed to evaluate conditions');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsEvaluating(false);
        }
    }, [instanceId]);
    const applyCondition = (0, react_1.useCallback)(async (stageId, condition) => {
        try {
            setIsEvaluating(true);
            setError(null);
            const response = await fetch(`/api/workflows/instances/${instanceId}/stages/${stageId}/conditions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(condition),
            });
            if (!response.ok)
                throw new Error('Failed to apply condition');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useConditionalApprovals = useConditionalApprovals;
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
const useMultiStageApprovals = (instanceId) => {
    const { instance, loading, error } = (0, exports.useWorkflowState)(instanceId);
    const { transition } = (0, exports.useWorkflowTransition)(instanceId);
    const allStages = (0, react_1.useMemo)(() => {
        if (!instance)
            return [];
        return instance.stages.sort((a, b) => {
            const stageA = instance.stages.find(s => s.stageId === a.stageId);
            const stageB = instance.stages.find(s => s.stageId === b.stageId);
            return (stageA?.startedAt?.getTime() || 0) - (stageB?.startedAt?.getTime() || 0);
        });
    }, [instance]);
    const currentStage = (0, react_1.useMemo)(() => {
        if (!instance)
            return null;
        return instance.stages.find(s => s.stageId === instance.currentStage);
    }, [instance]);
    const completedStages = (0, react_1.useMemo)(() => {
        return allStages.filter(s => s.status === 'completed');
    }, [allStages]);
    const pendingStages = (0, react_1.useMemo)(() => {
        return allStages.filter(s => s.status === 'pending');
    }, [allStages]);
    const progressPercentage = (0, react_1.useMemo)(() => {
        if (allStages.length === 0)
            return 0;
        return (completedStages.length / allStages.length) * 100;
    }, [allStages, completedStages]);
    const progressToStage = (0, react_1.useCallback)(async (stageId) => {
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
exports.useMultiStageApprovals = useMultiStageApprovals;
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
const useParallelApprovals = (stageId) => {
    const [approvals, setApprovals] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchApprovals = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/stages/${stageId}/approvals`);
            if (!response.ok)
                throw new Error('Failed to fetch approvals');
            const data = await response.json();
            setApprovals(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [stageId]);
    (0, react_1.useEffect)(() => {
        fetchApprovals();
    }, [fetchApprovals]);
    const pendingApprovals = (0, react_1.useMemo)(() => {
        return approvals.filter(a => !a.decision);
    }, [approvals]);
    const completedApprovals = (0, react_1.useMemo)(() => {
        return approvals.filter(a => a.decision);
    }, [approvals]);
    const allApproved = (0, react_1.useMemo)(() => {
        return approvals.length > 0 && approvals.every(a => a.decision === 'approve');
    }, [approvals]);
    const anyRejected = (0, react_1.useMemo)(() => {
        return approvals.some(a => a.decision === 'reject');
    }, [approvals]);
    const approvalProgress = (0, react_1.useMemo)(() => {
        if (approvals.length === 0)
            return 0;
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
exports.useParallelApprovals = useParallelApprovals;
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
const useSequentialApprovals = (stageId) => {
    const { approvals, loading, error, refetch } = (0, exports.useParallelApprovals)(stageId);
    const sortedApprovals = (0, react_1.useMemo)(() => {
        return [...approvals].sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
    }, [approvals]);
    const currentApproval = (0, react_1.useMemo)(() => {
        return sortedApprovals.find(a => !a.decision);
    }, [sortedApprovals]);
    const nextApproval = (0, react_1.useMemo)(() => {
        const currentIndex = sortedApprovals.findIndex(a => a.id === currentApproval?.id);
        if (currentIndex === -1)
            return null;
        return sortedApprovals[currentIndex + 1] || null;
    }, [sortedApprovals, currentApproval]);
    const previousApprovals = (0, react_1.useMemo)(() => {
        return sortedApprovals.filter(a => a.decision);
    }, [sortedApprovals]);
    const isLastApproval = (0, react_1.useMemo)(() => {
        return currentApproval !== null && nextApproval === null;
    }, [currentApproval, nextApproval]);
    const canProceed = (0, react_1.useMemo)(() => {
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
exports.useSequentialApprovals = useSequentialApprovals;
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
const useEscalationRules = (stageId) => {
    const [rules, setRules] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchRules = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules`);
            if (!response.ok)
                throw new Error('Failed to fetch escalation rules');
            const data = await response.json();
            setRules(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [stageId]);
    (0, react_1.useEffect)(() => {
        fetchRules();
    }, [fetchRules]);
    const addRule = (0, react_1.useCallback)(async (rule) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rule),
            });
            if (!response.ok)
                throw new Error('Failed to add escalation rule');
            await fetchRules();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [stageId, fetchRules]);
    const removeRule = (0, react_1.useCallback)(async (ruleId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules/${ruleId}`, { method: 'DELETE' });
            if (!response.ok)
                throw new Error('Failed to remove escalation rule');
            await fetchRules();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [stageId, fetchRules]);
    const triggerEscalation = (0, react_1.useCallback)(async (ruleId) => {
        try {
            const response = await fetch(`/api/workflows/stages/${stageId}/escalation-rules/${ruleId}/trigger`, { method: 'POST' });
            if (!response.ok)
                throw new Error('Failed to trigger escalation');
            return response.json();
        }
        catch (err) {
            setError(err);
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
exports.useEscalationRules = useEscalationRules;
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
const useTimeoutHandling = (approvalId, timeoutMinutes) => {
    const { approval, refetch } = (0, exports.useApprovalRequest)(approvalId);
    const [timeRemaining, setTimeRemaining] = (0, react_1.useState)(timeoutMinutes);
    const [isExpired, setIsExpired] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!approval?.requestedAt)
            return;
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
    const extend = (0, react_1.useCallback)(async (additionalMinutes) => {
        try {
            const response = await fetch(`/api/approvals/${approvalId}/extend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ additionalMinutes }),
            });
            if (!response.ok)
                throw new Error('Failed to extend timeout');
            await refetch();
        }
        catch (err) {
            throw err;
        }
    }, [approvalId, refetch]);
    const cancel = (0, react_1.useCallback)(async () => {
        try {
            const response = await fetch(`/api/approvals/${approvalId}/cancel`, {
                method: 'POST',
            });
            if (!response.ok)
                throw new Error('Failed to cancel approval');
            await refetch();
        }
        catch (err) {
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
exports.useTimeoutHandling = useTimeoutHandling;
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
const useDelegateApproval = (approvalId) => {
    const [isDelegating, setIsDelegating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const delegate = (0, react_1.useCallback)(async (delegateToUserId, reason) => {
        try {
            setIsDelegating(true);
            setError(null);
            const response = await fetch(`/api/approvals/${approvalId}/delegate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delegateToUserId, reason }),
            });
            if (!response.ok)
                throw new Error('Failed to delegate approval');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsDelegating(false);
        }
    }, [approvalId]);
    const reclaim = (0, react_1.useCallback)(async () => {
        try {
            setIsDelegating(true);
            setError(null);
            const response = await fetch(`/api/approvals/${approvalId}/reclaim`, {
                method: 'POST',
            });
            if (!response.ok)
                throw new Error('Failed to reclaim approval');
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useDelegateApproval = useDelegateApproval;
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
const useSubstituteApprovers = (userId) => {
    const [substitutes, setSubstitutes] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchSubstitutes = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/users/${userId}/substitutes`);
            if (!response.ok)
                throw new Error('Failed to fetch substitutes');
            const data = await response.json();
            setSubstitutes(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    (0, react_1.useEffect)(() => {
        fetchSubstitutes();
    }, [fetchSubstitutes]);
    const addSubstitute = (0, react_1.useCallback)(async (substituteUserId, startDate, endDate) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}/substitutes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ substituteUserId, startDate, endDate }),
            });
            if (!response.ok)
                throw new Error('Failed to add substitute');
            await fetchSubstitutes();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [userId, fetchSubstitutes]);
    const removeSubstitute = (0, react_1.useCallback)(async (substituteId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}/substitutes/${substituteId}`, { method: 'DELETE' });
            if (!response.ok)
                throw new Error('Failed to remove substitute');
            await fetchSubstitutes();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
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
exports.useSubstituteApprovers = useSubstituteApprovers;
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
const useWorkflowPermissions = (workflowId, userId) => {
    const [permissions, setPermissions] = (0, react_1.useState)({
        canInitiate: false,
        canApprove: false,
        canReject: false,
        canDelegate: false,
        canCancel: false,
        canViewHistory: false,
        canEditWorkflow: false,
    });
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchPermissions = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}/permissions?userId=${userId}`);
            if (!response.ok)
                throw new Error('Failed to fetch permissions');
            const data = await response.json();
            setPermissions(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [workflowId, userId]);
    (0, react_1.useEffect)(() => {
        fetchPermissions();
    }, [fetchPermissions]);
    const hasPermission = (0, react_1.useCallback)((permission) => {
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
exports.useWorkflowPermissions = useWorkflowPermissions;
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
const useWorkflowRoles = (workflowId) => {
    const [roles, setRoles] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchRoles = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/workflows/${workflowId}/roles`);
            if (!response.ok)
                throw new Error('Failed to fetch roles');
            const data = await response.json();
            setRoles(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [workflowId]);
    (0, react_1.useEffect)(() => {
        fetchRoles();
    }, [fetchRoles]);
    const addRole = (0, react_1.useCallback)(async (role) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/${workflowId}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(role),
            });
            if (!response.ok)
                throw new Error('Failed to add role');
            await fetchRoles();
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [workflowId, fetchRoles]);
    const updateRole = (0, react_1.useCallback)(async (roleId, updates) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/${workflowId}/roles/${roleId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Failed to update role');
            await fetchRoles();
            return response.json();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [workflowId, fetchRoles]);
    const deleteRole = (0, react_1.useCallback)(async (roleId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflows/${workflowId}/roles/${roleId}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete role');
            await fetchRoles();
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [workflowId, fetchRoles]);
    const assignUserToRole = (0, react_1.useCallback)(async (roleId, userId) => {
        try {
            const response = await fetch(`/api/workflows/${workflowId}/roles/${roleId}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok)
                throw new Error('Failed to assign user to role');
            await fetchRoles();
        }
        catch (err) {
            setError(err);
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
exports.useWorkflowRoles = useWorkflowRoles;
// ============================================================================
// WORKFLOW BUILDER COMPONENTS
// ============================================================================
/**
 * Reducer for workflow builder state management
 */
const workflowBuilderReducer = (state, action) => {
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
                    stages: state.workflow.stages?.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s),
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
const useWorkflowBuilder = () => {
    const [state, dispatch] = (0, react_1.useReducer)(workflowBuilderReducer, {
        workflow: {},
        errors: {},
        isDirty: false,
    });
    const updateWorkflow = (0, react_1.useCallback)((updates) => {
        dispatch({ type: 'UPDATE_WORKFLOW', payload: updates });
    }, []);
    const addStage = (0, react_1.useCallback)((stage) => {
        dispatch({ type: 'ADD_STAGE', payload: stage });
    }, []);
    const updateStage = (0, react_1.useCallback)((stageId, updates) => {
        dispatch({ type: 'UPDATE_STAGE', payload: { id: stageId, updates } });
    }, []);
    const removeStage = (0, react_1.useCallback)((stageId) => {
        dispatch({ type: 'REMOVE_STAGE', payload: stageId });
    }, []);
    const reorderStages = (0, react_1.useCallback)((stageIds) => {
        const reordered = stageIds.map((id, index) => {
            const stage = state.workflow.stages?.find(s => s.id === id);
            return stage ? { ...stage, order: index } : null;
        }).filter(Boolean);
        dispatch({
            type: 'UPDATE_WORKFLOW',
            payload: { stages: reordered },
        });
    }, [state.workflow.stages]);
    const validate = (0, react_1.useCallback)(() => {
        const errors = {};
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
    const save = (0, react_1.useCallback)(async () => {
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
    const reset = (0, react_1.useCallback)(() => {
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
exports.useWorkflowBuilder = useWorkflowBuilder;
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
const WorkflowProvider = ({ children }) => {
    const [workflows, setWorkflows] = (0, react_1.useState)(new Map());
    const [instances, setInstances] = (0, react_1.useState)(new Map());
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const refreshWorkflows = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/workflows');
            if (!response.ok)
                throw new Error('Failed to fetch workflows');
            const data = await response.json();
            const workflowMap = new Map(data.map((w) => [w.id, w]));
            setWorkflows(workflowMap);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        refreshWorkflows();
    }, [refreshWorkflows]);
    const value = {
        workflows,
        instances,
        loading,
        error,
        refreshWorkflows,
    };
    return value = { value } >
        { children }
        < /WorkflowContext.Provider>;
};
exports.WorkflowProvider = WorkflowProvider;
;
;
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
const ApprovalProvider = ({ userId, children, }) => {
    const [pendingApprovals, setPendingApprovals] = (0, react_1.useState)([]);
    const [completedApprovals, setCompletedApprovals] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const refreshApprovals = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/users/${userId}/approvals`);
            if (!response.ok)
                throw new Error('Failed to fetch approvals');
            const data = await response.json();
            setPendingApprovals(data.filter((a) => !a.decision));
            setCompletedApprovals(data.filter((a) => a.decision));
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    (0, react_1.useEffect)(() => {
        refreshApprovals();
    }, [refreshApprovals]);
    const value = {
        pendingApprovals,
        completedApprovals,
        loading,
        error,
        refreshApprovals,
    };
    return value = { value } >
        { children }
        < /ApprovalContext.Provider>;
};
exports.ApprovalProvider = ApprovalProvider;
;
;
/**
 * Hook to access workflow context
 */
const useWorkflowContext = () => {
    const context = (0, react_1.useContext)(WorkflowContext);
    if (!context) {
        throw new Error('useWorkflowContext must be used within WorkflowProvider');
    }
    return context;
};
exports.useWorkflowContext = useWorkflowContext;
/**
 * Hook to access approval context
 */
const useApprovalContext = () => {
    const context = (0, react_1.useContext)(ApprovalContext);
    if (!context) {
        throw new Error('useApprovalContext must be used within ApprovalProvider');
    }
    return context;
};
exports.useApprovalContext = useApprovalContext;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculate workflow progress percentage
 */
const calculateWorkflowProgress = (instance) => {
    const totalStages = instance.stages.length;
    const completedStages = instance.stages.filter(s => s.status === 'completed').length;
    return totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
};
exports.calculateWorkflowProgress = calculateWorkflowProgress;
/**
 * Check if stage is ready for transition
 */
const canTransitionStage = (stage) => {
    const approvedCount = stage.approvals.filter(a => a.decision === 'approve').length;
    return approvedCount >= stage.approvals.length;
};
exports.canTransitionStage = canTransitionStage;
/**
 * Get next stage in workflow
 */
const getNextStage = (instance, currentStageId) => {
    const currentIndex = instance.stages.findIndex(s => s.stageId === currentStageId);
    if (currentIndex === -1 || currentIndex >= instance.stages.length - 1)
        return null;
    return instance.stages[currentIndex + 1];
};
exports.getNextStage = getNextStage;
/**
 * Format time remaining for display
 */
const formatTimeRemaining = (minutes) => {
    if (minutes < 1)
        return 'Less than 1 minute';
    if (minutes < 60)
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
};
exports.formatTimeRemaining = formatTimeRemaining;
/**
 * Validate workflow configuration
 */
const validateWorkflow = (workflow) => {
    const errors = [];
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
exports.validateWorkflow = validateWorkflow;
/**
 * Export workflow configuration as JSON
 */
const exportWorkflow = (workflow) => {
    return JSON.stringify(workflow, null, 2);
};
exports.exportWorkflow = exportWorkflow;
/**
 * Import workflow configuration from JSON
 */
const importWorkflow = (json) => {
    try {
        const workflow = JSON.parse(json);
        const errors = (0, exports.validateWorkflow)(workflow);
        if (errors.length > 0) {
            throw new Error(`Invalid workflow: ${errors.join(', ')}`);
        }
        return workflow;
    }
    catch (err) {
        throw new Error('Invalid workflow JSON');
    }
};
exports.importWorkflow = importWorkflow;
//# sourceMappingURL=workflow-approval-kit.js.map
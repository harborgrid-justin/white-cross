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
import { ReactNode, FC } from 'react';
/**
 * Workflow status enumeration
 */
export type WorkflowStatus = 'draft' | 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'suspended';
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
export declare const useWorkflow: (workflowId: string) => {
    workflow: any;
    loading: any;
    error: any;
    refetch: any;
    updateWorkflow: any;
    deleteWorkflow: any;
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
export declare const useWorkflowState: (instanceId: string) => {
    instance: any;
    loading: any;
    error: any;
    refetch: any;
    currentStage: any;
    isComplete: any;
    canProgress: any;
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
export declare const useWorkflowTransition: (instanceId: string) => {
    transition: any;
    moveToNextStage: any;
    moveToPreviousStage: any;
    canTransition: any;
    loading: any;
    error: any;
};
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
export declare const useApprovalRequest: (approvalId: string) => {
    approval: any;
    loading: any;
    error: any;
    refetch: any;
    submitDecision: any;
    isOverdue: any;
    isPending: any;
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
export declare const useApprovalReview: (workflowInstanceId: string) => {
    submitReview: any;
    submitBatchReview: any;
    isSubmitting: any;
    error: any;
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
export declare const useApprovalDecision: (approvalId: string) => {
    approve: any;
    reject: any;
    requestChanges: any;
    isProcessing: any;
    error: any;
};
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
export declare const useCreateWorkflow: () => {
    createWorkflow: any;
    isCreating: any;
    error: any;
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
export declare const useUpdateWorkflow: (workflowId: string) => {
    updateWorkflow: any;
    isUpdating: any;
    error: any;
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
export declare const useDeleteWorkflow: (workflowId: string) => {
    deleteWorkflow: any;
    isDeleting: any;
    error: any;
};
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
export declare const useWorkflowHistory: (instanceId: string) => {
    history: any;
    loading: any;
    error: any;
    refetch: any;
    filterByAction: any;
    filterByUser: any;
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
export declare const useWorkflowAudit: (instanceId: string) => {
    auditEntries: any;
    loading: any;
    error: any;
    refetch: any;
    exportAudit: any;
};
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
export declare const useApprovalRouting: (workflowId: string) => {
    calculateRoute: any;
    routeToApprovers: any;
    isRouting: any;
    error: any;
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
export declare const useApprovalAssignment: (stageId: string) => {
    assignApprovers: any;
    removeApprover: any;
    reassignApprover: any;
    isAssigning: any;
    error: any;
};
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
export declare const useNotifyApprovers: (instanceId: string) => {
    notifyApprovers: any;
    notifyDecision: any;
    notifyEscalation: any;
    isSending: any;
    error: any;
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
export declare const useApprovalNotifications: (userId: string) => {
    notifications: any;
    unreadCount: any;
    loading: any;
    error: any;
    refetch: any;
    markAsRead: any;
    markAllAsRead: any;
};
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
export declare const useConditionalApprovals: (instanceId: string) => {
    evaluateConditions: any;
    applyCondition: any;
    isEvaluating: any;
    error: any;
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
export declare const useMultiStageApprovals: (instanceId: string) => {
    instance: any;
    allStages: any;
    currentStage: any;
    completedStages: any;
    pendingStages: any;
    progressPercentage: any;
    progressToStage: any;
    loading: any;
    error: any;
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
export declare const useParallelApprovals: (stageId: string) => {
    approvals: any;
    pendingApprovals: any;
    completedApprovals: any;
    allApproved: any;
    anyRejected: any;
    approvalProgress: any;
    loading: any;
    error: any;
    refetch: any;
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
export declare const useSequentialApprovals: (stageId: string) => {
    approvals: any;
    currentApproval: any;
    nextApproval: any;
    previousApprovals: any;
    isLastApproval: any;
    canProceed: any;
    loading: any;
    error: any;
    refetch: any;
};
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
export declare const useEscalationRules: (stageId: string) => {
    rules: any;
    loading: any;
    error: any;
    refetch: any;
    addRule: any;
    removeRule: any;
    triggerEscalation: any;
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
export declare const useTimeoutHandling: (approvalId: string, timeoutMinutes: number) => {
    timeRemaining: any;
    isExpired: any;
    extend: any;
    cancel: any;
};
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
export declare const useDelegateApproval: (approvalId: string) => {
    delegate: any;
    reclaim: any;
    isDelegating: any;
    error: any;
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
export declare const useSubstituteApprovers: (userId: string) => {
    substitutes: any;
    loading: any;
    error: any;
    refetch: any;
    addSubstitute: any;
    removeSubstitute: any;
};
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
export declare const useWorkflowPermissions: (workflowId: string, userId: string) => {
    permissions: any;
    hasPermission: any;
    loading: any;
    error: any;
    refetch: any;
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
export declare const useWorkflowRoles: (workflowId: string) => {
    roles: any;
    loading: any;
    error: any;
    refetch: any;
    addRole: any;
    updateRole: any;
    deleteRole: any;
    assignUserToRole: any;
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
export declare const useWorkflowBuilder: () => {
    workflow: any;
    errors: any;
    isDirty: any;
    updateWorkflow: any;
    addStage: any;
    updateStage: any;
    removeStage: any;
    reorderStages: any;
    validate: any;
    save: any;
    reset: any;
};
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
export declare const WorkflowProvider: FC<{
    children: ReactNode;
}>;
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
export declare const ApprovalProvider: FC<{
    userId: string;
    children: ReactNode;
}>;
/**
 * Hook to access workflow context
 */
export declare const useWorkflowContext: () => any;
/**
 * Hook to access approval context
 */
export declare const useApprovalContext: () => any;
/**
 * Calculate workflow progress percentage
 */
export declare const calculateWorkflowProgress: (instance: WorkflowInstance) => number;
/**
 * Check if stage is ready for transition
 */
export declare const canTransitionStage: (stage: WorkflowStageInstance) => boolean;
/**
 * Get next stage in workflow
 */
export declare const getNextStage: (instance: WorkflowInstance, currentStageId: string) => WorkflowStageInstance | null;
/**
 * Format time remaining for display
 */
export declare const formatTimeRemaining: (minutes: number) => string;
/**
 * Validate workflow configuration
 */
export declare const validateWorkflow: (workflow: Partial<Workflow>) => string[];
/**
 * Export workflow configuration as JSON
 */
export declare const exportWorkflow: (workflow: Workflow) => string;
/**
 * Import workflow configuration from JSON
 */
export declare const importWorkflow: (json: string) => Workflow;
//# sourceMappingURL=workflow-approval-kit.d.ts.map
/**
 * LOC: FINAUTH7890123
 * File: /reuse/financial/financial-authorization-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Authorization workflow services
 *   - Approval routing controllers
 *   - Financial audit services
 */
import { Sequelize, Transaction } from 'sequelize';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ApprovalRoute {
    routeId: string;
    documentType: string;
    documentId: string;
    amount: number;
    currency: string;
    organizationId: string;
    costCenterId: string;
    currentStepIndex: number;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'expired';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    createdBy: string;
    createdAt: Date;
    expiresAt?: Date;
    metadata: Record<string, any>;
}
export interface ApprovalStep {
    stepId: string;
    routeId: string;
    stepIndex: number;
    stepType: 'serial' | 'parallel' | 'conditional' | 'automatic';
    approverType: 'user' | 'role' | 'group' | 'system';
    approverIds: string[];
    requiredApprovals: number;
    actualApprovals: number;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped';
    condition?: string;
    timeoutMinutes?: number;
    escalationConfig?: EscalationConfig;
    notificationsSent: number;
    startedAt?: Date;
    completedAt?: Date;
}
export interface ApprovalAction {
    actionId: string;
    routeId: string;
    stepId: string;
    approverId: string;
    action: 'approve' | 'reject' | 'delegate' | 'recall' | 'request_info' | 'escalate';
    comments?: string;
    attachments?: string[];
    delegatedTo?: string;
    ipAddress: string;
    timestamp: Date;
    authMethod: string;
    deviceInfo?: Record<string, any>;
}
export interface AuthorizationLimit {
    limitId: string;
    userId: string;
    roleId?: string;
    documentType: string;
    accountCategory: string;
    maxAmount: number;
    currency: string;
    periodType: 'transaction' | 'daily' | 'weekly' | 'monthly' | 'annual';
    currentUsage: number;
    resetDate?: Date;
    effectiveFrom: Date;
    effectiveTo?: Date;
    conditions?: Record<string, any>;
    requiresSecondApproval: boolean;
    isActive: boolean;
}
export interface DelegationChain {
    delegationId: string;
    delegatorId: string;
    delegateId: string;
    authority: string;
    scope: 'all' | 'specific';
    specificDocumentTypes?: string[];
    maxAmount?: number;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'active' | 'expired' | 'revoked';
    createdAt: Date;
    revokedAt?: Date;
    revokedBy?: string;
    autoExpire: boolean;
}
export interface EscalationConfig {
    escalationId: string;
    triggerType: 'timeout' | 'manual' | 'conditional';
    timeoutMinutes?: number;
    escalationLevel: number;
    escalateToIds: string[];
    notificationTemplate: string;
    automaticApproval: boolean;
    maxEscalations: number;
    currentEscalation: number;
}
export interface NotificationConfig {
    notificationId: string;
    routeId: string;
    stepId?: string;
    recipientIds: string[];
    notificationType: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
    template: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    scheduledFor?: Date;
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
    retryCount: number;
    maxRetries: number;
    metadata: Record<string, any>;
}
export interface WorkflowRule {
    ruleId: string;
    ruleName: string;
    documentType: string;
    priority: number;
    conditions: RuleCondition[];
    actions: RuleAction[];
    isActive: boolean;
    effectiveFrom: Date;
    effectiveTo?: Date;
    description?: string;
}
export interface RuleCondition {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
export interface RuleAction {
    actionType: 'route_to' | 'notify' | 'escalate' | 'auto_approve' | 'require_dual_auth' | 'flag_review';
    parameters: Record<string, any>;
}
export interface SegregationOfDuties {
    sodId: string;
    functionA: string;
    functionB: string;
    conflictType: 'incompatible' | 'requires_review' | 'prohibited';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    isActive: boolean;
}
export interface ApprovalMatrix {
    matrixId: string;
    organizationId: string;
    documentType: string;
    amountRanges: AmountRange[];
    approvalLevels: number;
    parallelApprovals: boolean;
    requiresAllApprovals: boolean;
    version: number;
    isActive: boolean;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export interface AmountRange {
    minAmount: number;
    maxAmount: number;
    requiredApprovers: ApproverRequirement[];
    timeoutHours: number;
    escalationEnabled: boolean;
}
export interface ApproverRequirement {
    level: number;
    approverType: 'user' | 'role' | 'group' | 'position';
    approverIdentifiers: string[];
    minimumRequired: number;
    canDelegate: boolean;
}
export declare class ApprovalRouteDto {
    documentType: string;
    documentId: string;
    amount: number;
    currency: string;
    organizationId: string;
    costCenterId: string;
    priority: string;
    metadata?: Record<string, any>;
}
export declare class ApprovalActionDto {
    action: string;
    comments?: string;
    attachments?: string[];
    delegatedTo?: string;
}
export declare class DelegationDto {
    delegateId: string;
    authority: string;
    scope: string;
    specificDocumentTypes?: string[];
    maxAmount?: number;
    startDate: Date;
    endDate: Date;
    reason: string;
}
/**
 * Sequelize model for Approval Routes - manages the complete approval workflow lifecycle
 */
export declare const createApprovalRouteModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        routeId: string;
        documentType: string;
        documentId: string;
        amount: number;
        currency: string;
        organizationId: string;
        costCenterId: string;
        currentStepIndex: number;
        totalSteps: number;
        status: string;
        priority: string;
        createdBy: string;
        expiresAt: Date | null;
        completedAt: Date | null;
        completedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Approval Steps - individual approval steps within a route
 */
export declare const createApprovalStepModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        stepId: string;
        routeId: string;
        stepIndex: number;
        stepType: string;
        stepName: string;
        approverType: string;
        approverIds: string[];
        requiredApprovals: number;
        actualApprovals: number;
        status: string;
        condition: string | null;
        timeoutMinutes: number | null;
        notificationsSent: number;
        startedAt: Date | null;
        completedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Approval Actions - records all approval-related actions
 */
export declare const createApprovalActionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        actionId: string;
        routeId: string;
        stepId: string;
        approverId: string;
        action: string;
        comments: string | null;
        attachments: string[];
        delegatedTo: string | null;
        ipAddress: string;
        authMethod: string;
        deviceInfo: Record<string, any>;
        actionTimestamp: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Authorization Limits - defines spending and approval authority
 */
export declare const createAuthorizationLimitModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        limitId: string;
        userId: string;
        roleId: string | null;
        documentType: string;
        accountCategory: string;
        maxAmount: number;
        currency: string;
        periodType: string;
        currentUsage: number;
        resetDate: Date | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        conditions: Record<string, any>;
        requiresSecondApproval: boolean;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Delegation Chains - manages delegation of authority
 */
export declare const createDelegationChainModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        delegationId: string;
        delegatorId: string;
        delegateId: string;
        authority: string;
        scope: string;
        specificDocumentTypes: string[];
        maxAmount: number | null;
        startDate: Date;
        endDate: Date;
        reason: string;
        status: string;
        revokedAt: Date | null;
        revokedBy: string | null;
        autoExpire: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Workflow Rules - configurable business rules for routing
 */
export declare const createWorkflowRuleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        ruleId: string;
        ruleName: string;
        documentType: string;
        priority: number;
        conditions: RuleCondition[];
        actions: RuleAction[];
        isActive: boolean;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        description: string | null;
        executionCount: number;
        lastExecuted: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Guard to verify user has authorization within limits
 */
export declare class AuthorizationLimitGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
    private checkAuthorizationLimit;
}
/**
 * Interceptor for audit logging of approval actions
 */
export declare class ApprovalAuditInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logApprovalAction;
}
/**
 * 1. Create a new approval route based on document type and amount
 *
 * @param {ApprovalRoute} routeData - Approval route data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Created approval route
 *
 * @example
 * ```typescript
 * const route = await createApprovalRoute({
 *   documentType: 'purchase_order',
 *   documentId: 'PO-12345',
 *   amount: 50000,
 *   currency: 'USD',
 *   organizationId: 'ORG-001',
 *   costCenterId: 'CC-100',
 *   priority: 'high',
 *   createdBy: 'user123',
 *   metadata: { vendor: 'ACME Corp' }
 * }, transaction);
 * ```
 */
export declare function createApprovalRoute(routeData: Partial<ApprovalRoute>, transaction?: Transaction): Promise<ApprovalRoute>;
/**
 * 2. Get approval matrix for document type and amount
 *
 * @param {string} documentType - Document type
 * @param {string} organizationId - Organization ID
 * @param {number} amount - Transaction amount
 * @returns {Promise<ApprovalMatrix>} Approval matrix configuration
 */
export declare function getApprovalMatrix(documentType: string, organizationId: string, amount: number): Promise<ApprovalMatrix>;
/**
 * 3. Create approval steps for a route
 *
 * @param {string} routeId - Approval route ID
 * @param {ApprovalMatrix} matrix - Approval matrix
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep[]>} Created approval steps
 */
export declare function createApprovalSteps(routeId: string, matrix: ApprovalMatrix, transaction?: Transaction): Promise<ApprovalStep[]>;
/**
 * 4. Process approval action (approve, reject, delegate)
 *
 * @param {string} routeId - Approval route ID
 * @param {string} stepId - Approval step ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated approval route
 */
export declare function processApprovalAction(routeId: string, stepId: string, action: ApprovalAction, transaction?: Transaction): Promise<ApprovalRoute>;
/**
 * 5. Validate approver has authority for the step
 *
 * @param {string} approverId - Approver user ID
 * @param {string} stepId - Approval step ID
 * @returns {Promise<boolean>} Whether approver has authority
 */
export declare function validateApproverAuthority(approverId: string, stepId: string): Promise<boolean>;
/**
 * 6. Record approval action in audit trail
 *
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalAction>} Recorded action
 */
export declare function recordApprovalAction(action: ApprovalAction, transaction?: Transaction): Promise<ApprovalAction>;
/**
 * 7. Update approval step status
 *
 * @param {string} stepId - Step ID
 * @param {string} action - Action performed
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Updated step
 */
export declare function updateStepStatus(stepId: string, action: string, transaction?: Transaction): Promise<ApprovalStep>;
/**
 * 8. Advance route to next step if current step is complete
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated route
 */
export declare function advanceRouteIfReady(routeId: string, transaction?: Transaction): Promise<ApprovalRoute>;
/**
 * 9. Send approval notifications to approvers
 *
 * @param {string} routeId - Route ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function sendApprovalNotifications(routeId: string, action: ApprovalAction, transaction?: Transaction): Promise<void>;
/**
 * 10. Get next approval step for a route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalStep | null>} Next approval step or null
 */
export declare function getNextApprovalStep(routeId: string): Promise<ApprovalStep | null>;
/**
 * 11. Send batch notifications
 *
 * @param {NotificationConfig[]} notifications - Notifications to send
 * @returns {Promise<void>}
 */
export declare function sendBatchNotifications(notifications: NotificationConfig[]): Promise<void>;
/**
 * 12. Delegate approval authority to another user
 *
 * @param {DelegationChain} delegation - Delegation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Created delegation
 */
export declare function delegateApprovalAuthority(delegation: Partial<DelegationChain>, transaction?: Transaction): Promise<DelegationChain>;
/**
 * 13. Validate delegation chain doesn't create circular references
 *
 * @param {DelegationChain} delegation - Delegation to validate
 * @returns {Promise<boolean>} Whether delegation is valid
 */
export declare function validateDelegationChain(delegation: DelegationChain): Promise<boolean>;
/**
 * 14. Find active delegation for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain | null>} Active delegation or null
 */
export declare function findActiveDelegation(userId: string): Promise<DelegationChain | null>;
/**
 * 15. Revoke delegation
 *
 * @param {string} delegationId - Delegation ID
 * @param {string} revokedBy - User revoking delegation
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Revoked delegation
 */
export declare function revokeDelegation(delegationId: string, revokedBy: string, transaction?: Transaction): Promise<DelegationChain>;
/**
 * 16. Get delegation by ID
 *
 * @param {string} delegationId - Delegation ID
 * @returns {Promise<DelegationChain | null>} Delegation or null
 */
export declare function getDelegationById(delegationId: string): Promise<DelegationChain | null>;
/**
 * 17. Check authorization limits for user
 *
 * @param {string} userId - User ID
 * @param {string} documentType - Document type
 * @param {number} amount - Transaction amount
 * @returns {Promise<AuthorizationLimit>} Authorization limit
 */
export declare function checkAuthorizationLimit(userId: string, documentType: string, amount: number): Promise<AuthorizationLimit>;
/**
 * 18. Update authorization limit usage
 *
 * @param {string} limitId - Limit ID
 * @param {number} amount - Amount to add to usage
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<AuthorizationLimit>} Updated limit
 */
export declare function updateAuthorizationUsage(limitId: string, amount: number, transaction?: Transaction): Promise<AuthorizationLimit>;
/**
 * 19. Reset periodic authorization limits
 *
 * @param {string} periodType - Period type to reset
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of limits reset
 */
export declare function resetPeriodicLimits(periodType: string, transaction?: Transaction): Promise<number>;
/**
 * 20. Escalate approval to next level
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
export declare function escalateApproval(routeId: string, stepId: string, escalation: EscalationConfig, transaction?: Transaction): Promise<ApprovalStep>;
/**
 * 21. Send escalation notifications
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @returns {Promise<void>}
 */
export declare function sendEscalationNotifications(routeId: string, stepId: string, escalation: EscalationConfig): Promise<void>;
/**
 * 22. Get approval step by ID
 *
 * @param {string} stepId - Step ID
 * @returns {Promise<ApprovalStep | null>} Approval step or null
 */
export declare function getApprovalStepById(stepId: string): Promise<ApprovalStep | null>;
/**
 * 23. Check for timeout and auto-escalate
 *
 * @returns {Promise<number>} Number of escalations triggered
 */
export declare function checkTimeoutsAndEscalate(): Promise<number>;
/**
 * 24. Apply workflow rules to determine routing
 *
 * @param {ApprovalRoute} route - Approval route
 * @returns {Promise<WorkflowRule[]>} Matching workflow rules
 */
export declare function applyWorkflowRules(route: ApprovalRoute): Promise<WorkflowRule[]>;
/**
 * 25. Evaluate rule conditions
 *
 * @param {RuleCondition[]} conditions - Rule conditions
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Whether conditions are met
 */
export declare function evaluateRuleConditions(conditions: RuleCondition[], context: Record<string, any>): boolean;
/**
 * 26. Execute rule actions
 *
 * @param {RuleAction[]} actions - Actions to execute
 * @param {ApprovalRoute} route - Approval route
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function executeRuleActions(actions: RuleAction[], route: ApprovalRoute, transaction?: Transaction): Promise<void>;
/**
 * 27. Route approval to specific approvers
 *
 * @param {string} routeId - Route ID
 * @param {string[]} approverIds - Approver IDs
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function routeToApprovers(routeId: string, approverIds: string[], transaction?: Transaction): Promise<void>;
/**
 * 28. Send custom notification
 *
 * @param {string} routeId - Route ID
 * @param {Record<string, any>} parameters - Notification parameters
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function sendCustomNotification(routeId: string, parameters: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * 29. Auto-approve route based on rules
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Auto-approved route
 */
export declare function autoApproveRoute(routeId: string, transaction?: Transaction): Promise<ApprovalRoute>;
/**
 * 30. Require dual authentication for sensitive approval
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function requireDualAuthentication(routeId: string, transaction?: Transaction): Promise<void>;
/**
 * 31. Flag route for manual review
 *
 * @param {string} routeId - Route ID
 * @param {string} reason - Reason for flagging
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function flagForManualReview(routeId: string, reason: string, transaction?: Transaction): Promise<void>;
/**
 * 32. Check segregation of duties violations
 *
 * @param {string} userId - User ID
 * @param {string[]} functions - Functions being performed
 * @returns {Promise<SegregationOfDuties[]>} SOD violations
 */
export declare function checkSegregationOfDuties(userId: string, functions: string[]): Promise<SegregationOfDuties[]>;
/**
 * 33. Get approval history for route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalAction[]>} Approval actions
 */
export declare function getApprovalHistory(routeId: string): Promise<ApprovalAction[]>;
/**
 * 34. Get pending approvals for user
 *
 * @param {string} userId - User ID
 * @param {Record<string, any>} filters - Optional filters
 * @returns {Promise<ApprovalRoute[]>} Pending approval routes
 */
export declare function getPendingApprovalsForUser(userId: string, filters?: Record<string, any>): Promise<ApprovalRoute[]>;
/**
 * 35. Get approval statistics for organization
 *
 * @param {string} organizationId - Organization ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Approval statistics
 */
export declare function getApprovalStatistics(organizationId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * 36. Calculate expiration date based on priority
 *
 * @param {string} priority - Priority level
 * @returns {Date} Expiration date
 */
export declare function calculateExpiration(priority: string): Date;
/**
 * 37. Send reminder notifications for pending approvals
 *
 * @param {number} hoursBeforeExpiration - Hours before expiration to send reminder
 * @returns {Promise<number>} Number of reminders sent
 */
export declare function sendApprovalReminders(hoursBeforeExpiration?: number): Promise<number>;
/**
 * 38. Recall approval route
 *
 * @param {string} routeId - Route ID
 * @param {string} userId - User recalling route
 * @param {string} reason - Recall reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Recalled route
 */
export declare function recallApprovalRoute(routeId: string, userId: string, reason: string, transaction?: Transaction): Promise<ApprovalRoute>;
/**
 * 39. Get approval route by ID
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalRoute | null>} Approval route or null
 */
export declare function getApprovalRouteById(routeId: string): Promise<ApprovalRoute | null>;
/**
 * 40. Parallel approval processing
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @returns {Promise<boolean>} Whether step is complete
 */
export declare function processParallelApproval(routeId: string, stepId: string): Promise<boolean>;
/**
 * 41. Conditional approval evaluation
 *
 * @param {string} stepId - Step ID
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Whether step should be executed
 */
export declare function evaluateConditionalStep(stepId: string, context: Record<string, any>): Promise<boolean>;
/**
 * 42. Bulk approve routes
 *
 * @param {string[]} routeIds - Route IDs to approve
 * @param {string} approverId - Approver user ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute[]>} Approved routes
 */
export declare function bulkApproveRoutes(routeIds: string[], approverId: string, transaction?: Transaction): Promise<ApprovalRoute[]>;
/**
 * 43. Get delegated approvals for user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain[]>} Active delegations
 */
export declare function getDelegatedApprovals(userId: string): Promise<DelegationChain[]>;
/**
 * 44. Expire old approvals
 *
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of routes expired
 */
export declare function expireOldApprovals(transaction?: Transaction): Promise<number>;
/**
 * 45. Generate UUID helper
 *
 * @returns {string} UUID v4
 */
export declare function generateUUID(): string;
export declare class FinancialAuthorizationController {
    /**
     * Create new approval route
     */
    createRoute(routeDto: ApprovalRouteDto): Promise<ApprovalRoute>;
    /**
     * Get approval route by ID
     */
    getRoute(routeId: string): Promise<ApprovalRoute>;
    /**
     * Process approval action
     */
    processAction(routeId: string, stepId: string, actionDto: ApprovalActionDto): Promise<ApprovalRoute>;
    /**
     * Get pending approvals for current user
     */
    getMyApprovals(priority?: string, documentType?: string): Promise<ApprovalRoute[]>;
    /**
     * Delegate approval authority
     */
    createDelegation(delegationDto: DelegationDto): Promise<DelegationChain>;
    /**
     * Revoke delegation
     */
    revokeDelegation(delegationId: string): Promise<void>;
    /**
     * Get approval history
     */
    getHistory(routeId: string): Promise<ApprovalAction[]>;
    /**
     * Recall approval route
     */
    recallRoute(routeId: string, reason: string): Promise<ApprovalRoute>;
    /**
     * Get approval statistics
     */
    getStatistics(startDate: string, endDate: string): Promise<Record<string, any>>;
}
//# sourceMappingURL=financial-authorization-workflows-kit.d.ts.map
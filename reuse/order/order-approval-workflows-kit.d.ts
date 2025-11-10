/**
 * LOC: WC-ORD-APPWF-001
 * File: /reuse/order/order-approval-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order approval controllers
 *   - Order authorization services
 *   - Workflow management modules
 *   - Approval delegation services
 */
/**
 * Approval workflow status
 */
export declare enum ApprovalWorkflowStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    ON_HOLD = "ON_HOLD",
    ESCALATED = "ESCALATED"
}
/**
 * Approval step types
 */
export declare enum ApprovalStepType {
    SEQUENTIAL = "SEQUENTIAL",
    PARALLEL = "PARALLEL",
    CONDITIONAL = "CONDITIONAL",
    AUTOMATIC = "AUTOMATIC",
    HYBRID = "HYBRID"
}
/**
 * Approval action types
 */
export declare enum ApprovalAction {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    DELEGATE = "DELEGATE",
    ESCALATE = "ESCALATE",
    REQUEST_INFO = "REQUEST_INFO",
    RECALL = "RECALL",
    SKIP = "SKIP",
    TIMEOUT = "TIMEOUT"
}
/**
 * Approval authority levels
 */
export declare enum ApprovalAuthority {
    MANAGER = "MANAGER",
    DIRECTOR = "DIRECTOR",
    VP = "VP",
    CFO = "CFO",
    CEO = "CEO",
    BOARD = "BOARD",
    CUSTOM = "CUSTOM"
}
/**
 * Approval notification types
 */
export declare enum ApprovalNotificationType {
    EMAIL = "EMAIL",
    SMS = "SMS",
    PUSH = "PUSH",
    IN_APP = "IN_APP",
    SLACK = "SLACK",
    TEAMS = "TEAMS"
}
/**
 * Approval priority levels
 */
export declare enum ApprovalPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
/**
 * Order approval types
 */
export declare enum OrderApprovalType {
    STANDARD_ORDER = "STANDARD_ORDER",
    BUDGET_APPROVAL = "BUDGET_APPROVAL",
    PRICE_OVERRIDE = "PRICE_OVERRIDE",
    DISCOUNT_OVERRIDE = "DISCOUNT_OVERRIDE",
    CREDIT_LIMIT_OVERRIDE = "CREDIT_LIMIT_OVERRIDE",
    TERMS_OVERRIDE = "TERMS_OVERRIDE",
    SPECIAL_PRICING = "SPECIAL_PRICING",
    RUSH_ORDER = "RUSH_ORDER",
    BACKORDER_RELEASE = "BACKORDER_RELEASE",
    LARGE_ORDER = "LARGE_ORDER",
    HIGH_VALUE = "HIGH_VALUE",
    NEW_CUSTOMER = "NEW_CUSTOMER"
}
/**
 * Approval workflow configuration
 */
export interface ApprovalWorkflowConfig {
    workflowId: string;
    workflowName: string;
    orderType: string;
    approvalType: OrderApprovalType;
    description?: string;
    isActive: boolean;
    effectiveFrom: Date;
    effectiveTo?: Date;
    priority: ApprovalPriority;
    stepType: ApprovalStepType;
    steps: ApprovalStepConfig[];
    autoApprovalRules?: AutoApprovalRule[];
    escalationRules?: EscalationRule[];
    timeoutConfig?: TimeoutConfig;
    notificationConfig?: NotificationConfig;
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Approval step configuration
 */
export interface ApprovalStepConfig {
    stepId: string;
    stepNumber: number;
    stepName: string;
    stepType: ApprovalStepType;
    authority: ApprovalAuthority;
    approverRoles: string[];
    approverUsers?: string[];
    approverGroups?: string[];
    requiredApprovals: number;
    allowDelegation: boolean;
    allowParallelApproval: boolean;
    timeoutMinutes?: number;
    escalateOnTimeout: boolean;
    escalationAuthority?: ApprovalAuthority;
    condition?: string;
    metadata?: Record<string, any>;
}
/**
 * Approval route instance
 */
export interface ApprovalRoute {
    routeId: string;
    workflowId: string;
    orderId: string;
    orderNumber: string;
    orderType: string;
    approvalType: OrderApprovalType;
    orderAmount: number;
    currency: string;
    customerId: string;
    requestedBy: string;
    currentStepNumber: number;
    status: ApprovalWorkflowStatus;
    priority: ApprovalPriority;
    steps: ApprovalStepInstance[];
    startedAt: Date;
    expiresAt?: Date;
    completedAt?: Date;
    approvedBy?: string[];
    rejectedBy?: string;
    rejectionReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Approval step instance
 */
export interface ApprovalStepInstance {
    stepInstanceId: string;
    routeId: string;
    stepConfig: ApprovalStepConfig;
    status: ApprovalWorkflowStatus;
    assignedTo: string[];
    approvedBy: string[];
    rejectedBy?: string;
    delegatedTo?: DelegationRecord[];
    startedAt?: Date;
    completedAt?: Date;
    timeoutAt?: Date;
    escalatedAt?: Date;
    escalatedTo?: string;
    actions: ApprovalActionRecord[];
    metadata?: Record<string, any>;
}
/**
 * Approval action record
 */
export interface ApprovalActionRecord {
    actionId: string;
    routeId: string;
    stepInstanceId: string;
    action: ApprovalAction;
    performedBy: string;
    performedAt: Date;
    comments?: string;
    attachments?: string[];
    delegatedTo?: string;
    delegationReason?: string;
    escalatedTo?: string;
    escalationReason?: string;
    ipAddress?: string;
    userAgent?: string;
    authMethod?: string;
    metadata?: Record<string, any>;
}
/**
 * Auto-approval rule
 */
export interface AutoApprovalRule {
    ruleId: string;
    ruleName: string;
    description?: string;
    isActive: boolean;
    priority: number;
    conditions: AutoApprovalCondition[];
    applicableOrderTypes: string[];
    applicableCustomerGroups?: string[];
    maxOrderAmount?: number;
    requireAllConditions: boolean;
    bypassAuthority?: ApprovalAuthority;
    effectiveFrom: Date;
    effectiveTo?: Date;
    createdBy: string;
    metadata?: Record<string, any>;
}
/**
 * Auto-approval condition
 */
export interface AutoApprovalCondition {
    conditionId: string;
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
/**
 * Escalation rule configuration
 */
export interface EscalationRule {
    ruleId: string;
    ruleName: string;
    triggerType: 'timeout' | 'rejection' | 'manual' | 'condition';
    triggerCondition?: string;
    timeoutMinutes?: number;
    escalateToAuthority: ApprovalAuthority;
    escalateToUsers?: string[];
    escalateToRoles?: string[];
    notifyOriginalApprovers: boolean;
    notifyRequestor: boolean;
    maxEscalations: number;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Timeout configuration
 */
export interface TimeoutConfig {
    enabled: boolean;
    defaultTimeoutMinutes: number;
    stepTimeouts?: Map<number, number>;
    autoEscalate: boolean;
    autoReject: boolean;
    notifyBeforeTimeout: boolean;
    notifyMinutesBeforeTimeout?: number;
    metadata?: Record<string, any>;
}
/**
 * Notification configuration
 */
export interface NotificationConfig {
    enabled: boolean;
    channels: ApprovalNotificationType[];
    notifyOnSubmit: boolean;
    notifyOnApproval: boolean;
    notifyOnRejection: boolean;
    notifyOnDelegation: boolean;
    notifyOnEscalation: boolean;
    notifyOnTimeout: boolean;
    notifyRequestor: boolean;
    notifyApprovers: boolean;
    reminderEnabled: boolean;
    reminderIntervalMinutes?: number;
    maxReminders?: number;
    metadata?: Record<string, any>;
}
/**
 * Delegation record
 */
export interface DelegationRecord {
    delegationId: string;
    delegatorId: string;
    delegateId: string;
    routeId: string;
    stepInstanceId: string;
    delegatedAt: Date;
    expiresAt?: Date;
    reason?: string;
    status: 'active' | 'expired' | 'revoked' | 'completed';
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Approval authority limit
 */
export interface ApprovalAuthorityLimit {
    limitId: string;
    userId: string;
    roleId?: string;
    authority: ApprovalAuthority;
    orderTypes: string[];
    maxOrderAmount: number;
    currency: string;
    periodType: 'transaction' | 'daily' | 'weekly' | 'monthly' | 'annual';
    currentUsage: number;
    resetDate?: Date;
    requiresSecondApproval: boolean;
    effectiveFrom: Date;
    effectiveTo?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Budget approval configuration
 */
export interface BudgetApprovalConfig {
    budgetId: string;
    departmentId: string;
    budgetPeriod: string;
    totalBudget: number;
    remainingBudget: number;
    currency: string;
    requiresApprovalThreshold: number;
    approvalAuthority: ApprovalAuthority;
    allowOverBudget: boolean;
    overBudgetApprovalAuthority?: ApprovalAuthority;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Price override approval
 */
export interface PriceOverrideApproval {
    overrideId: string;
    orderId: string;
    orderLineId: string;
    productId: string;
    standardPrice: number;
    overridePrice: number;
    discountPercent: number;
    reason: string;
    requestedBy: string;
    approvalRequired: boolean;
    approvalAuthority?: ApprovalAuthority;
    approvedBy?: string;
    approvedAt?: Date;
    status: ApprovalWorkflowStatus;
    metadata?: Record<string, any>;
}
/**
 * Credit limit override approval
 */
export interface CreditLimitOverrideApproval {
    overrideId: string;
    customerId: string;
    orderId: string;
    currentCreditLimit: number;
    currentBalance: number;
    requestedCreditLimit: number;
    overrideAmount: number;
    reason: string;
    requestedBy: string;
    approvalAuthority: ApprovalAuthority;
    approvedBy?: string;
    approvedAt?: Date;
    expiresAt?: Date;
    status: ApprovalWorkflowStatus;
    metadata?: Record<string, any>;
}
/**
 * Approval audit trail
 */
export interface ApprovalAuditTrail {
    auditId: string;
    routeId: string;
    orderId: string;
    eventType: string;
    eventData: Record<string, any>;
    performedBy: string;
    performedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
/**
 * Create approval workflow configuration
 * Sets up multi-level approval workflow with steps and rules
 */
export declare function createApprovalWorkflow(workflowData: Partial<ApprovalWorkflowConfig>, createdBy: string): Promise<ApprovalWorkflowConfig>;
/**
 * Configure approval step with authority levels
 * Defines approval step with approvers, timeouts, and conditions
 */
export declare function configureApprovalStep(stepData: Partial<ApprovalStepConfig>): Promise<ApprovalStepConfig>;
/**
 * Define approval routing rules
 * Creates routing rules based on order attributes and conditions
 */
export declare function defineApprovalRoutingRules(orderType: string, approvalType: OrderApprovalType, conditions: Record<string, any>): Promise<ApprovalWorkflowConfig>;
/**
 * Update workflow configuration
 * Modifies existing approval workflow settings
 */
export declare function updateWorkflowConfig(workflowId: string, updates: Partial<ApprovalWorkflowConfig>, updatedBy: string): Promise<ApprovalWorkflowConfig>;
/**
 * Initialize approval route for order
 * Creates approval route instance and starts workflow
 */
export declare function initializeApprovalRoute(orderId: string, orderData: Record<string, any>, requestedBy: string): Promise<ApprovalRoute>;
/**
 * Route approval to next step
 * Advances approval workflow to subsequent step
 */
export declare function routeToNextStep(routeId: string, performedBy: string): Promise<ApprovalRoute>;
/**
 * Process parallel approval steps
 * Handles concurrent approvals with quorum requirements
 */
export declare function processParallelApprovals(stepInstanceId: string, approvalAction: ApprovalActionRecord): Promise<ApprovalStepInstance>;
/**
 * Evaluate conditional approval routing
 * Routes based on dynamic conditions and business rules
 */
export declare function evaluateConditionalRouting(routeId: string, orderData: Record<string, any>): Promise<ApprovalStepConfig | null>;
/**
 * Approve order at current step
 * Records approval and advances workflow if appropriate
 */
export declare function approveOrder(routeId: string, approverId: string, comments?: string, attachments?: string[]): Promise<ApprovalRoute>;
/**
 * Reject order with reason
 * Terminates approval workflow with rejection
 */
export declare function rejectOrder(routeId: string, rejectorId: string, reason: string, comments?: string): Promise<ApprovalRoute>;
/**
 * Request additional information
 * Pauses workflow and requests more details from requestor
 */
export declare function requestAdditionalInfo(routeId: string, approverId: string, requestedInfo: string[], comments?: string): Promise<ApprovalRoute>;
/**
 * Delegate approval to another user
 * Transfers approval authority temporarily
 */
export declare function delegateApproval(routeId: string, delegatorId: string, delegateId: string, reason?: string, expiresAt?: Date): Promise<DelegationRecord>;
/**
 * Revoke delegation
 * Cancels active delegation and returns authority
 */
export declare function revokeDelegation(delegationId: string, revokedBy: string): Promise<DelegationRecord>;
/**
 * Configure auto-approval rules
 * Sets up rules for automatic order approval
 */
export declare function configureAutoApprovalRule(ruleData: Partial<AutoApprovalRule>, createdBy: string): Promise<AutoApprovalRule>;
/**
 * Evaluate auto-approval eligibility
 * Checks if order meets auto-approval criteria
 */
export declare function evaluateAutoApproval(orderData: Record<string, any>, autoApprovalRules: AutoApprovalRule[]): Promise<{
    eligible: boolean;
    matchedRule?: AutoApprovalRule;
}>;
/**
 * Apply auto-approval to order
 * Automatically approves order bypassing manual workflow
 */
export declare function applyAutoApproval(orderId: string, orderData: Record<string, any>, matchedRule: AutoApprovalRule): Promise<ApprovalRoute>;
/**
 * Escalate approval to higher authority
 * Moves approval to escalation authority level
 */
export declare function escalateApproval(routeId: string, escalationReason: string, escalatedBy: string): Promise<ApprovalRoute>;
/**
 * Process timeout escalation
 * Automatically escalates when approval times out
 */
export declare function processTimeoutEscalation(routeId: string): Promise<ApprovalRoute>;
/**
 * Configure escalation rules
 * Sets up automatic escalation triggers and paths
 */
export declare function configureEscalationRule(ruleData: Partial<EscalationRule>): Promise<EscalationRule>;
/**
 * Monitor approval timeouts
 * Checks for expired approvals and triggers actions
 */
export declare function monitorApprovalTimeouts(): Promise<{
    processedRoutes: string[];
    escalatedRoutes: string[];
}>;
/**
 * Set approval step timeout
 * Configures timeout duration for approval step
 */
export declare function setApprovalTimeout(stepInstanceId: string, timeoutMinutes: number): Promise<ApprovalStepInstance>;
/**
 * Extend approval timeout
 * Adds additional time to existing timeout
 */
export declare function extendApprovalTimeout(stepInstanceId: string, additionalMinutes: number, requestedBy: string): Promise<ApprovalStepInstance>;
/**
 * Validate budget approval authority
 * Checks if approver has budget authority for amount
 */
export declare function validateBudgetApprovalAuthority(approverId: string, budgetAmount: number, departmentId: string): Promise<{
    authorized: boolean;
    authorityLimit?: ApprovalAuthorityLimit;
}>;
/**
 * Approve budget override
 * Authorizes exceeding budget limits
 */
export declare function approveBudgetOverride(budgetId: string, orderId: string, overrideAmount: number, approverId: string, reason: string): Promise<BudgetApprovalConfig>;
/**
 * Check budget availability for approval
 * Validates sufficient budget before approval
 */
export declare function checkBudgetAvailability(budgetId: string, requestedAmount: number): Promise<{
    available: boolean;
    remainingBudget: number;
    requiresOverride: boolean;
}>;
/**
 * Request price override approval
 * Initiates approval for price discount/override
 */
export declare function requestPriceOverrideApproval(overrideData: Partial<PriceOverrideApproval>, requestedBy: string): Promise<PriceOverrideApproval>;
/**
 * Approve price override
 * Authorizes special pricing or discount
 */
export declare function approvePriceOverride(overrideId: string, approverId: string, comments?: string): Promise<PriceOverrideApproval>;
/**
 * Validate price override limits
 * Checks if override is within approver's authority
 */
export declare function validatePriceOverrideLimits(approverId: string, discountPercent: number, orderAmount: number): Promise<boolean>;
/**
 * Request credit limit override approval
 * Initiates approval for exceeding customer credit
 */
export declare function requestCreditLimitOverrideApproval(overrideData: Partial<CreditLimitOverrideApproval>, requestedBy: string): Promise<CreditLimitOverrideApproval>;
/**
 * Approve credit limit override
 * Authorizes temporary or permanent credit increase
 */
export declare function approveCreditLimitOverride(overrideId: string, approverId: string, expiresAt?: Date, comments?: string): Promise<CreditLimitOverrideApproval>;
/**
 * Monitor credit override expirations
 * Checks for expired credit overrides and reverts limits
 */
export declare function monitorCreditOverrideExpirations(): Promise<string[]>;
/**
 * Send approval notifications
 * Notifies assigned approvers of pending approval
 */
export declare function sendApprovalNotifications(route: ApprovalRoute, step: ApprovalStepInstance): Promise<void>;
//# sourceMappingURL=order-approval-workflows-kit.d.ts.map
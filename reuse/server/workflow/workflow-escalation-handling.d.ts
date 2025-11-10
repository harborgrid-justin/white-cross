/**
 * LOC: WFL-ESC-001
 * File: /reuse/server/workflow/workflow-escalation-handling.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/schedule
 *   - sequelize / sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Workflow execution engines
 *   - Task escalation services
 *   - Notification services
 *   - SLA monitoring modules
 *   - Approval flow managers
 */
/**
 * Zod schema for escalation event definition.
 */
export declare const EscalationEventSchema: any;
/**
 * Zod schema for escalation hierarchy definition.
 */
export declare const EscalationHierarchySchema: any;
/**
 * Zod schema for escalation rule.
 */
export declare const EscalationRuleSchema: any;
/**
 * Zod schema for escalation state.
 */
export declare const EscalationStateSchema: any;
/**
 * Zod schema for escalation audit entry.
 */
export declare const EscalationAuditEntrySchema: any;
export interface EscalationEvent {
    escalationId: string;
    workflowInstanceId: string;
    taskId?: string;
    escalationType: 'time-based' | 'condition-based' | 'manual' | 'automatic' | 'sla-breach' | 'priority-change' | 'approval-delay';
    priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
    escalationCode: string;
    escalationName: string;
    escalationLevel: number;
    maxLevel: number;
    triggerCondition?: string;
    timeoutMs?: number;
    notificationChannels: ('email' | 'sms' | 'push' | 'webhook' | 'in-app')[];
    metadata?: Record<string, any>;
}
export interface EscalationHierarchy {
    hierarchyId: string;
    name: string;
    levels: EscalationLevel[];
    metadata?: Record<string, any>;
}
export interface EscalationLevel {
    level: number;
    escalateTo: string[];
    escalationDelayMs: number;
    notificationTemplate?: string;
    requiresAcknowledgment: boolean;
    autoEscalateOnNoResponse: boolean;
    actions?: string[];
}
export interface EscalationRule {
    ruleId: string;
    name: string;
    condition: string;
    priority: number;
    escalationType: string;
    escalationLevel: number;
    notificationChannels: string[];
    escalateTo: string[];
    actions?: string[];
    enabled: boolean;
    metadata?: Record<string, any>;
}
export interface EscalationState {
    escalationId: string;
    currentLevel: number;
    status: 'pending' | 'active' | 'acknowledged' | 'resolved' | 'cancelled' | 'escalated' | 'expired';
    triggeredAt: Date;
    lastEscalatedAt?: Date;
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    cancelledAt?: Date;
    cancelledBy?: string;
    notificationsSent: NotificationRecord[];
    history: EscalationHistoryEntry[];
}
export interface NotificationRecord {
    channel: string;
    recipient: string;
    sentAt: Date;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    messageId?: string;
    error?: string;
}
export interface EscalationHistoryEntry {
    level: number;
    timestamp: Date;
    action: string;
    performedBy?: string;
    details?: Record<string, any>;
}
export interface EscalationAuditEntry {
    auditId: string;
    escalationId: string;
    workflowInstanceId: string;
    eventType: 'escalation_defined' | 'escalation_triggered' | 'escalation_level_increased' | 'escalation_acknowledged' | 'escalation_resolved' | 'escalation_cancelled' | 'notification_sent' | 'rule_evaluated' | 'timeout_reached';
    level?: number;
    details: Record<string, any>;
    performedBy?: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
}
export interface EscalationMetrics {
    escalationId: string;
    totalEscalations: number;
    acknowledgedCount: number;
    resolvedCount: number;
    cancelledCount: number;
    averageResolutionTimeMs: number;
    averageAcknowledgmentTimeMs: number;
    escalationRate: number;
    currentLevel: number;
}
export interface EscalationNotificationContext {
    escalationId: string;
    workflowInstanceId: string;
    priority: string;
    level: number;
    escalationName: string;
    triggerReason: string;
    variables: Record<string, any>;
    recipients: string[];
}
export interface SecurityContext {
    userId: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
}
/**
 * Validates user authorization for escalation operations.
 */
export declare const validateEscalationAuthorization: (context: SecurityContext, requiredPermission: string) => boolean;
/**
 * Creates audit log entry for escalation operations.
 */
export declare const createEscalationAuditLog: (escalationId: string, workflowInstanceId: string, eventType: EscalationAuditEntry["eventType"], details: Record<string, any>, context: SecurityContext) => EscalationAuditEntry;
/**
 * 1. Defines a new escalation event with validation.
 *
 * @example
 * ```typescript
 * const escalation = defineEscalationEvent({
 *   escalationId: crypto.randomUUID(),
 *   workflowInstanceId: 'workflow-123',
 *   escalationType: 'time-based',
 *   priority: 'high',
 *   escalationCode: 'PATIENT_REVIEW_DELAY',
 *   escalationName: 'Patient Review Escalation',
 *   escalationLevel: 1,
 *   maxLevel: 3,
 *   timeoutMs: 3600000, // 1 hour
 *   notificationChannels: ['email', 'sms']
 * }, securityContext);
 * ```
 */
export declare const defineEscalationEvent: (event: EscalationEvent, context: SecurityContext) => EscalationEvent;
/**
 * 2. Creates time-based escalation event.
 *
 * @example
 * ```typescript
 * const timeBasedEscalation = createTimeBasedEscalation(
 *   workflowInstanceId,
 *   'APPROVAL_TIMEOUT',
 *   'Approval Request Timeout',
 *   7200000, // 2 hours
 *   'critical',
 *   securityContext
 * );
 * ```
 */
export declare const createTimeBasedEscalation: (workflowInstanceId: string, escalationCode: string, escalationName: string, timeoutMs: number, priority: EscalationEvent["priority"], context: SecurityContext) => EscalationEvent;
/**
 * 3. Creates condition-based escalation event.
 *
 * @example
 * ```typescript
 * const conditionEscalation = createConditionBasedEscalation(
 *   workflowInstanceId,
 *   'SLA_BREACH',
 *   'SLA Breach Detected',
 *   'slaPercentage < 0.8',
 *   'high',
 *   securityContext
 * );
 * ```
 */
export declare const createConditionBasedEscalation: (workflowInstanceId: string, escalationCode: string, escalationName: string, triggerCondition: string, priority: EscalationEvent["priority"], context: SecurityContext) => EscalationEvent;
/**
 * 4. Creates SLA breach escalation event.
 *
 * @example
 * ```typescript
 * const slaEscalation = createSLABreachEscalation(
 *   workflowInstanceId,
 *   taskId,
 *   'Patient response required within 24 hours',
 *   securityContext
 * );
 * ```
 */
export declare const createSLABreachEscalation: (workflowInstanceId: string, taskId: string, reason: string, context: SecurityContext) => EscalationEvent;
/**
 * 5. Validates escalation event definition.
 *
 * @example
 * ```typescript
 * const validation = validateEscalationEvent(escalationEvent);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateEscalationEvent: (event: EscalationEvent) => {
    valid: boolean;
    errors: string[];
};
/**
 * 6. Triggers an escalation event.
 *
 * @example
 * ```typescript
 * const state = triggerEscalation(escalationEvent, variables, securityContext);
 * ```
 */
export declare const triggerEscalation: (event: EscalationEvent, variables: Record<string, any>, context: SecurityContext) => EscalationState;
/**
 * 7. Triggers manual escalation.
 *
 * @example
 * ```typescript
 * const state = triggerManualEscalation(
 *   workflowInstanceId,
 *   'MANUAL_ESCALATION',
 *   'Manual intervention required',
 *   reason,
 *   securityContext
 * );
 * ```
 */
export declare const triggerManualEscalation: (workflowInstanceId: string, escalationCode: string, escalationName: string, reason: string, context: SecurityContext) => EscalationState;
/**
 * 8. Checks if escalation should be triggered based on condition.
 *
 * @example
 * ```typescript
 * const shouldTrigger = shouldTriggerEscalation(
 *   'responseTime > 3600000',
 *   variables
 * );
 * ```
 */
export declare const shouldTriggerEscalation: (condition: string, variables: Record<string, any>) => boolean;
/**
 * 9. Triggers escalation if condition is met.
 *
 * @example
 * ```typescript
 * const state = triggerConditionalEscalation(
 *   escalationEvent,
 *   variables,
 *   securityContext
 * );
 * ```
 */
export declare const triggerConditionalEscalation: (event: EscalationEvent, variables: Record<string, any>, context: SecurityContext) => EscalationState | null;
/**
 * 10. Schedules time-based escalation trigger.
 *
 * @example
 * ```typescript
 * const scheduledId = scheduleEscalationTrigger(
 *   escalationEvent,
 *   variables,
 *   async () => {
 *     await handleEscalation(escalationEvent);
 *   },
 *   securityContext
 * );
 * ```
 */
export declare const scheduleEscalationTrigger: (event: EscalationEvent, variables: Record<string, any>, triggerCallback: () => Promise<void>, context: SecurityContext) => string;
/**
 * 11. Defines escalation hierarchy with multiple levels.
 *
 * @example
 * ```typescript
 * const hierarchy = defineEscalationHierarchy({
 *   hierarchyId: crypto.randomUUID(),
 *   name: 'Patient Care Escalation',
 *   levels: [
 *     {
 *       level: 1,
 *       escalateTo: ['nurse-manager@hospital.com'],
 *       escalationDelayMs: 1800000, // 30 minutes
 *       requiresAcknowledgment: true,
 *       autoEscalateOnNoResponse: true
 *     },
 *     {
 *       level: 2,
 *       escalateTo: ['head-physician@hospital.com'],
 *       escalationDelayMs: 3600000, // 1 hour
 *       requiresAcknowledgment: true,
 *       autoEscalateOnNoResponse: true
 *     }
 *   ]
 * }, securityContext);
 * ```
 */
export declare const defineEscalationHierarchy: (hierarchy: EscalationHierarchy, context: SecurityContext) => EscalationHierarchy;
/**
 * 12. Gets escalation level configuration.
 *
 * @example
 * ```typescript
 * const levelConfig = getEscalationLevel(hierarchy, 2);
 * console.log('Escalate to:', levelConfig.escalateTo);
 * ```
 */
export declare const getEscalationLevel: (hierarchy: EscalationHierarchy, level: number) => EscalationLevel | null;
/**
 * 13. Gets next escalation level in hierarchy.
 *
 * @example
 * ```typescript
 * const nextLevel = getNextEscalationLevel(hierarchy, currentLevel);
 * if (nextLevel) {
 *   escalateToNextLevel(state, nextLevel, securityContext);
 * }
 * ```
 */
export declare const getNextEscalationLevel: (hierarchy: EscalationHierarchy, currentLevel: number) => EscalationLevel | null;
/**
 * 14. Checks if escalation has reached maximum level.
 *
 * @example
 * ```typescript
 * if (isMaxEscalationLevel(hierarchy, state.currentLevel)) {
 *   notifyCriticalEscalation(state);
 * }
 * ```
 */
export declare const isMaxEscalationLevel: (hierarchy: EscalationHierarchy, currentLevel: number) => boolean;
/**
 * 15. Validates escalation hierarchy configuration.
 *
 * @example
 * ```typescript
 * const validation = validateEscalationHierarchy(hierarchy);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateEscalationHierarchy: (hierarchy: EscalationHierarchy) => {
    valid: boolean;
    errors: string[];
};
/**
 * 16. Enables automatic escalation for event.
 *
 * @example
 * ```typescript
 * enableAutomaticEscalation(
 *   escalationEvent,
 *   hierarchy,
 *   state,
 *   securityContext
 * );
 * ```
 */
export declare const enableAutomaticEscalation: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, context: SecurityContext) => void;
/**
 * 17. Disables automatic escalation.
 *
 * @example
 * ```typescript
 * disableAutomaticEscalation(escalationEvent, state, securityContext);
 * ```
 */
export declare const disableAutomaticEscalation: (event: EscalationEvent, state: EscalationState, context: SecurityContext) => void;
/**
 * 18. Checks if automatic escalation is enabled.
 *
 * @example
 * ```typescript
 * if (isAutomaticEscalationEnabled(escalationEvent)) {
 *   scheduleNextEscalation(escalationEvent, hierarchy);
 * }
 * ```
 */
export declare const isAutomaticEscalationEnabled: (event: EscalationEvent) => boolean;
/**
 * 19. Processes automatic escalation to next level.
 *
 * @example
 * ```typescript
 * await processAutomaticEscalation(
 *   escalationEvent,
 *   hierarchy,
 *   state,
 *   securityContext
 * );
 * ```
 */
export declare const processAutomaticEscalation: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, context: SecurityContext) => Promise<void>;
/**
 * 20. Schedules automatic escalation check.
 *
 * @example
 * ```typescript
 * const timerId = scheduleAutomaticEscalationCheck(
 *   escalationEvent,
 *   hierarchy,
 *   state,
 *   securityContext
 * );
 * ```
 */
export declare const scheduleAutomaticEscalationCheck: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, context: SecurityContext) => string;
/**
 * 21. Creates time-based escalation scheduler.
 *
 * @example
 * ```typescript
 * const scheduler = createTimeBasedEscalationScheduler(
 *   escalationEvent,
 *   hierarchy,
 *   state,
 *   async () => {
 *     await handleEscalation();
 *   },
 *   securityContext
 * );
 * ```
 */
export declare const createTimeBasedEscalationScheduler: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, escalationCallback: () => Promise<void>, context: SecurityContext) => string;
/**
 * 22. Calculates time remaining until next escalation.
 *
 * @example
 * ```typescript
 * const timeRemaining = getTimeUntilNextEscalation(hierarchy, state);
 * console.log(`Next escalation in ${timeRemaining}ms`);
 * ```
 */
export declare const getTimeUntilNextEscalation: (hierarchy: EscalationHierarchy, state: EscalationState) => number | null;
/**
 * 23. Checks if escalation timeout has been reached.
 *
 * @example
 * ```typescript
 * if (hasEscalationTimeoutExpired(hierarchy, state)) {
 *   escalateToNextLevel(event, hierarchy, state, securityContext);
 * }
 * ```
 */
export declare const hasEscalationTimeoutExpired: (hierarchy: EscalationHierarchy, state: EscalationState) => boolean;
/**
 * 24. Extends escalation timeout.
 *
 * @example
 * ```typescript
 * extendEscalationTimeout(state, 3600000, 'Additional time requested', securityContext);
 * ```
 */
export declare const extendEscalationTimeout: (state: EscalationState, extensionMs: number, reason: string, context: SecurityContext) => void;
/**
 * 25. Resets escalation timer.
 *
 * @example
 * ```typescript
 * resetEscalationTimer(state, 'Issue partially resolved', securityContext);
 * ```
 */
export declare const resetEscalationTimer: (state: EscalationState, reason: string, context: SecurityContext) => void;
/**
 * 26. Defines escalation rule.
 *
 * @example
 * ```typescript
 * const rule = defineEscalationRule({
 *   ruleId: crypto.randomUUID(),
 *   name: 'High Priority Patient Alert',
 *   condition: 'priority === "critical" && responseTime > 900000',
 *   priority: 10,
 *   escalationType: 'immediate',
 *   escalationLevel: 2,
 *   notificationChannels: ['sms', 'push'],
 *   escalateTo: ['on-call-doctor@hospital.com'],
 *   enabled: true
 * }, securityContext);
 * ```
 */
export declare const defineEscalationRule: (rule: EscalationRule, context: SecurityContext) => EscalationRule;
/**
 * 27. Evaluates escalation rule against variables.
 *
 * @example
 * ```typescript
 * const matches = evaluateEscalationRule(rule, variables);
 * if (matches) {
 *   triggerRuleBasedEscalation(rule, variables, securityContext);
 * }
 * ```
 */
export declare const evaluateEscalationRule: (rule: EscalationRule, variables: Record<string, any>) => boolean;
/**
 * 28. Processes all escalation rules.
 *
 * @example
 * ```typescript
 * const matchedRules = processEscalationRules(
 *   allRules,
 *   variables,
 *   securityContext
 * );
 * ```
 */
export declare const processEscalationRules: (rules: EscalationRule[], variables: Record<string, any>, context: SecurityContext) => EscalationRule[];
/**
 * 29. Triggers rule-based escalation.
 *
 * @example
 * ```typescript
 * const state = triggerRuleBasedEscalation(
 *   rule,
 *   workflowInstanceId,
 *   variables,
 *   securityContext
 * );
 * ```
 */
export declare const triggerRuleBasedEscalation: (rule: EscalationRule, workflowInstanceId: string, variables: Record<string, any>, context: SecurityContext) => EscalationState;
/**
 * 30. Updates escalation rule.
 *
 * @example
 * ```typescript
 * updateEscalationRule(rule, { enabled: false }, securityContext);
 * ```
 */
export declare const updateEscalationRule: (rule: EscalationRule, updates: Partial<EscalationRule>, context: SecurityContext) => EscalationRule;
/**
 * 31. Sends escalation notification through channel.
 *
 * @example
 * ```typescript
 * await sendEscalationNotification(
 *   escalationEvent,
 *   state,
 *   'email',
 *   ['manager@hospital.com'],
 *   notificationContext,
 *   securityContext
 * );
 * ```
 */
export declare const sendEscalationNotification: (event: EscalationEvent, state: EscalationState, channel: string, recipients: string[], notificationContext: EscalationNotificationContext, context: SecurityContext) => Promise<void>;
/**
 * 32. Sends multi-channel escalation notifications.
 *
 * @example
 * ```typescript
 * await sendMultiChannelNotifications(
 *   escalationEvent,
 *   state,
 *   ['email', 'sms'],
 *   recipients,
 *   notificationContext,
 *   securityContext
 * );
 * ```
 */
export declare const sendMultiChannelNotifications: (event: EscalationEvent, state: EscalationState, channels: string[], recipients: string[], notificationContext: EscalationNotificationContext, context: SecurityContext) => Promise<void>;
/**
 * 33. Gets notification status for escalation.
 *
 * @example
 * ```typescript
 * const status = getNotificationStatus(state);
 * console.log(`Sent: ${status.sent}, Failed: ${status.failed}`);
 * ```
 */
export declare const getNotificationStatus: (state: EscalationState) => {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
};
/**
 * 34. Retries failed notifications.
 *
 * @example
 * ```typescript
 * await retryFailedNotifications(escalationEvent, state, securityContext);
 * ```
 */
export declare const retryFailedNotifications: (event: EscalationEvent, state: EscalationState, context: SecurityContext) => Promise<void>;
/**
 * 35. Creates notification context for escalation.
 *
 * @example
 * ```typescript
 * const notifContext = createNotificationContext(
 *   escalationEvent,
 *   state,
 *   variables,
 *   recipients
 * );
 * ```
 */
export declare const createNotificationContext: (event: EscalationEvent, state: EscalationState, variables: Record<string, any>, recipients: string[]) => EscalationNotificationContext;
/**
 * 36. Tracks escalation state change.
 *
 * @example
 * ```typescript
 * trackEscalationStateChange(state, 'acknowledged', securityContext);
 * ```
 */
export declare const trackEscalationStateChange: (state: EscalationState, newStatus: EscalationState["status"], context: SecurityContext) => void;
/**
 * 37. Gets escalation history.
 *
 * @example
 * ```typescript
 * const history = getEscalationHistory(state);
 * ```
 */
export declare const getEscalationHistory: (state: EscalationState) => EscalationHistoryEntry[];
/**
 * 38. Gets current escalation status.
 *
 * @example
 * ```typescript
 * const status = getCurrentEscalationStatus(state);
 * console.log(`Status: ${status.status}, Level: ${status.level}`);
 * ```
 */
export declare const getCurrentEscalationStatus: (state: EscalationState) => {
    status: string;
    level: number;
    duration: number;
};
/**
 * 39. Checks if escalation requires acknowledgment.
 *
 * @example
 * ```typescript
 * if (requiresAcknowledgment(hierarchy, state)) {
 *   await sendAcknowledgmentRequest(state);
 * }
 * ```
 */
export declare const requiresAcknowledgment: (hierarchy: EscalationHierarchy, state: EscalationState) => boolean;
/**
 * 40. Acknowledges escalation.
 *
 * @example
 * ```typescript
 * acknowledgeEscalation(state, securityContext);
 * ```
 */
export declare const acknowledgeEscalation: (state: EscalationState, context: SecurityContext) => void;
/**
 * 41. Cancels escalation.
 *
 * @example
 * ```typescript
 * cancelEscalation(escalationEvent, state, 'Issue resolved', securityContext);
 * ```
 */
export declare const cancelEscalation: (event: EscalationEvent, state: EscalationState, reason: string, context: SecurityContext) => void;
/**
 * 42. Resolves escalation.
 *
 * @example
 * ```typescript
 * resolveEscalation(escalationEvent, state, 'Patient reviewed by physician', securityContext);
 * ```
 */
export declare const resolveEscalation: (event: EscalationEvent, state: EscalationState, resolution: string, context: SecurityContext) => void;
/**
 * 43. Escalates to next level in hierarchy.
 *
 * @example
 * ```typescript
 * await escalateToNextLevel(escalationEvent, hierarchy, state, securityContext);
 * ```
 */
export declare const escalateToNextLevel: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, context: SecurityContext) => Promise<void>;
/**
 * 44. Escalates directly to specific level.
 *
 * @example
 * ```typescript
 * await escalateToLevel(escalationEvent, hierarchy, state, 3, 'Critical situation', securityContext);
 * ```
 */
export declare const escalateToLevel: (event: EscalationEvent, hierarchy: EscalationHierarchy, state: EscalationState, targetLevel: number, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 45. Calculates escalation metrics.
 *
 * @example
 * ```typescript
 * const metrics = calculateEscalationMetrics(state);
 * console.log(`Average resolution time: ${metrics.averageResolutionTimeMs}ms`);
 * ```
 */
export declare const calculateEscalationMetrics: (state: EscalationState) => EscalationMetrics;
//# sourceMappingURL=workflow-escalation-handling.d.ts.map
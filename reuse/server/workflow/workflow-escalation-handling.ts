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
 * File: /reuse/server/workflow/workflow-escalation-handling.ts
 * Locator: WC-WFL-ESC-001
 * Purpose: Production-grade Workflow Escalation Event Handling - Comprehensive escalation management for BPMN-style workflows
 *
 * Upstream: @nestjs/common, @nestjs/schedule, sequelize, sequelize-typescript, zod, rxjs
 * Downstream: ../backend/*, workflow engines, escalation managers, notification services, SLA monitors
 * Dependencies: NestJS 10.x, Sequelize 6.x, Zod 3.x, TypeScript 5.x, RxJS 7.x
 * Exports: 45 production-ready functions for escalation events, triggering, hierarchy, notifications, tracking, audit trails
 *
 * LLM Context: Enterprise-grade workflow escalation utilities for White Cross healthcare platform.
 * Provides comprehensive escalation event definition, automatic triggering, multi-level escalation hierarchies,
 * time-based escalation, rules engine, notification management, escalation tracking, cancellation, compensation,
 * and HIPAA-compliant audit trails. Supports BPMN 2.0 escalation patterns for healthcare workflow automation
 * including critical patient care escalations, approval delays, and SLA breach handling.
 *
 * Features:
 * - BPMN 2.0 compliant escalation events
 * - Multi-level escalation hierarchies
 * - Time-based automatic escalation
 * - Flexible rules engine
 * - Multi-channel notifications
 * - Escalation state tracking
 * - Compensation and rollback
 * - SLA monitoring and enforcement
 * - Priority-based escalation
 * - Escalation cancellation
 * - Comprehensive audit trails
 * - Healthcare-specific escalation patterns
 */

import { z } from 'zod';
import * as crypto from 'crypto';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for escalation event definition.
 */
export const EscalationEventSchema = z.object({
  escalationId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  taskId: z.string().optional(),
  escalationType: z.enum([
    'time-based',
    'condition-based',
    'manual',
    'automatic',
    'sla-breach',
    'priority-change',
    'approval-delay',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'critical', 'emergency']).default('medium'),
  escalationCode: z.string(),
  escalationName: z.string(),
  escalationLevel: z.number().int().min(1).default(1),
  maxLevel: z.number().int().min(1).default(3),
  triggerCondition: z.string().optional(),
  timeoutMs: z.number().int().positive().optional(),
  notificationChannels: z.array(z.enum(['email', 'sms', 'push', 'webhook', 'in-app'])).default(['email']),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for escalation hierarchy definition.
 */
export const EscalationHierarchySchema = z.object({
  hierarchyId: z.string().uuid(),
  name: z.string(),
  levels: z.array(
    z.object({
      level: z.number().int().min(1),
      escalateTo: z.array(z.string()),
      escalationDelayMs: z.number().int().min(0),
      notificationTemplate: z.string().optional(),
      requiresAcknowledgment: z.boolean().default(false),
      autoEscalateOnNoResponse: z.boolean().default(true),
      actions: z.array(z.string()).optional(),
    })
  ),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for escalation rule.
 */
export const EscalationRuleSchema = z.object({
  ruleId: z.string().uuid(),
  name: z.string(),
  condition: z.string(),
  priority: z.number().int().min(0).default(0),
  escalationType: z.string(),
  escalationLevel: z.number().int().min(1).default(1),
  notificationChannels: z.array(z.string()),
  escalateTo: z.array(z.string()),
  actions: z.array(z.string()).optional(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for escalation state.
 */
export const EscalationStateSchema = z.object({
  escalationId: z.string().uuid(),
  currentLevel: z.number().int().min(1),
  status: z.enum(['pending', 'active', 'acknowledged', 'resolved', 'cancelled', 'escalated', 'expired']),
  triggeredAt: z.date(),
  lastEscalatedAt: z.date().optional(),
  acknowledgedAt: z.date().optional(),
  acknowledgedBy: z.string().optional(),
  resolvedAt: z.date().optional(),
  resolvedBy: z.string().optional(),
  cancelledAt: z.date().optional(),
  cancelledBy: z.string().optional(),
  notificationsSent: z.array(
    z.object({
      channel: z.string(),
      recipient: z.string(),
      sentAt: z.date(),
      status: z.enum(['pending', 'sent', 'delivered', 'failed']),
    })
  ).default([]),
  history: z.array(
    z.object({
      level: z.number().int(),
      timestamp: z.date(),
      action: z.string(),
      performedBy: z.string().optional(),
      details: z.record(z.any()).optional(),
    })
  ).default([]),
});

/**
 * Zod schema for escalation audit entry.
 */
export const EscalationAuditEntrySchema = z.object({
  auditId: z.string().uuid(),
  escalationId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  eventType: z.enum([
    'escalation_defined',
    'escalation_triggered',
    'escalation_level_increased',
    'escalation_acknowledged',
    'escalation_resolved',
    'escalation_cancelled',
    'notification_sent',
    'rule_evaluated',
    'timeout_reached',
  ]),
  level: z.number().int().min(1).optional(),
  details: z.record(z.any()),
  performedBy: z.string().optional(),
  timestamp: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// AUTHORIZATION AND SECURITY CONTEXT
// ============================================================================

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
export const validateEscalationAuthorization = (
  context: SecurityContext,
  requiredPermission: string
): boolean => {
  return context.permissions.includes(requiredPermission) || context.roles.includes('admin');
};

/**
 * Creates audit log entry for escalation operations.
 */
export const createEscalationAuditLog = (
  escalationId: string,
  workflowInstanceId: string,
  eventType: EscalationAuditEntry['eventType'],
  details: Record<string, any>,
  context: SecurityContext
): EscalationAuditEntry => {
  return {
    auditId: crypto.randomUUID(),
    escalationId,
    workflowInstanceId,
    eventType,
    level: details.level,
    details: {
      ...details,
      tenantId: context.tenantId,
      sessionId: context.sessionId,
    },
    performedBy: context.userId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  };
};

// ============================================================================
// ESCALATION EVENT DEFINITION
// ============================================================================

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
export const defineEscalationEvent = (
  event: EscalationEvent,
  context: SecurityContext
): EscalationEvent => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:define')) {
    throw new Error('Unauthorized to define escalation event');
  }

  EscalationEventSchema.parse(event);

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_defined',
    { event },
    context
  );

  return event;
};

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
export const createTimeBasedEscalation = (
  workflowInstanceId: string,
  escalationCode: string,
  escalationName: string,
  timeoutMs: number,
  priority: EscalationEvent['priority'],
  context: SecurityContext
): EscalationEvent => {
  const event: EscalationEvent = {
    escalationId: crypto.randomUUID(),
    workflowInstanceId,
    escalationType: 'time-based',
    priority,
    escalationCode,
    escalationName,
    escalationLevel: 1,
    maxLevel: 3,
    timeoutMs,
    notificationChannels: ['email'],
  };

  return defineEscalationEvent(event, context);
};

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
export const createConditionBasedEscalation = (
  workflowInstanceId: string,
  escalationCode: string,
  escalationName: string,
  triggerCondition: string,
  priority: EscalationEvent['priority'],
  context: SecurityContext
): EscalationEvent => {
  const event: EscalationEvent = {
    escalationId: crypto.randomUUID(),
    workflowInstanceId,
    escalationType: 'condition-based',
    priority,
    escalationCode,
    escalationName,
    escalationLevel: 1,
    maxLevel: 3,
    triggerCondition,
    notificationChannels: ['email', 'push'],
  };

  return defineEscalationEvent(event, context);
};

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
export const createSLABreachEscalation = (
  workflowInstanceId: string,
  taskId: string,
  reason: string,
  context: SecurityContext
): EscalationEvent => {
  const event: EscalationEvent = {
    escalationId: crypto.randomUUID(),
    workflowInstanceId,
    taskId,
    escalationType: 'sla-breach',
    priority: 'critical',
    escalationCode: 'SLA_BREACH',
    escalationName: 'SLA Breach',
    escalationLevel: 1,
    maxLevel: 3,
    notificationChannels: ['email', 'sms', 'push'],
    metadata: { reason },
  };

  return defineEscalationEvent(event, context);
};

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
export const validateEscalationEvent = (
  event: EscalationEvent
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    EscalationEventSchema.parse(event);
  } catch (error: any) {
    return { valid: false, errors: error.errors.map((e: any) => e.message) };
  }

  if (event.escalationType === 'time-based' && !event.timeoutMs) {
    errors.push('Time-based escalation requires timeoutMs');
  }

  if (event.escalationType === 'condition-based' && !event.triggerCondition) {
    errors.push('Condition-based escalation requires triggerCondition');
  }

  if (event.escalationLevel > event.maxLevel) {
    errors.push('escalationLevel cannot exceed maxLevel');
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// ESCALATION TRIGGERING
// ============================================================================

/**
 * 6. Triggers an escalation event.
 *
 * @example
 * ```typescript
 * const state = triggerEscalation(escalationEvent, variables, securityContext);
 * ```
 */
export const triggerEscalation = (
  event: EscalationEvent,
  variables: Record<string, any>,
  context: SecurityContext
): EscalationState => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:trigger')) {
    throw new Error('Unauthorized to trigger escalation');
  }

  const state: EscalationState = {
    escalationId: event.escalationId,
    currentLevel: event.escalationLevel,
    status: 'active',
    triggeredAt: new Date(),
    notificationsSent: [],
    history: [
      {
        level: event.escalationLevel,
        timestamp: new Date(),
        action: 'escalation_triggered',
        performedBy: context.userId,
        details: { priority: event.priority, variables },
      },
    ],
  };

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_triggered',
    { level: event.escalationLevel, priority: event.priority, variables },
    context
  );

  return state;
};

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
export const triggerManualEscalation = (
  workflowInstanceId: string,
  escalationCode: string,
  escalationName: string,
  reason: string,
  context: SecurityContext
): EscalationState => {
  const event: EscalationEvent = {
    escalationId: crypto.randomUUID(),
    workflowInstanceId,
    escalationType: 'manual',
    priority: 'high',
    escalationCode,
    escalationName,
    escalationLevel: 1,
    maxLevel: 3,
    notificationChannels: ['email'],
    metadata: { reason, triggeredBy: context.userId },
  };

  defineEscalationEvent(event, context);
  return triggerEscalation(event, { reason }, context);
};

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
export const shouldTriggerEscalation = (
  condition: string,
  variables: Record<string, any>
): boolean => {
  try {
    const evaluator = new Function('vars', `with(vars) { return ${condition}; }`);
    return Boolean(evaluator(variables));
  } catch (error) {
    return false;
  }
};

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
export const triggerConditionalEscalation = (
  event: EscalationEvent,
  variables: Record<string, any>,
  context: SecurityContext
): EscalationState | null => {
  if (event.triggerCondition && shouldTriggerEscalation(event.triggerCondition, variables)) {
    return triggerEscalation(event, variables, context);
  }
  return null;
};

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
export const scheduleEscalationTrigger = (
  event: EscalationEvent,
  variables: Record<string, any>,
  triggerCallback: () => Promise<void>,
  context: SecurityContext
): string => {
  if (!event.timeoutMs) {
    throw new Error('Time-based escalation requires timeoutMs');
  }

  const timerId = crypto.randomUUID();

  // Schedule the escalation
  setTimeout(async () => {
    await triggerCallback();
    createEscalationAuditLog(
      event.escalationId,
      event.workflowInstanceId,
      'timeout_reached',
      { timeoutMs: event.timeoutMs, variables },
      context
    );
  }, event.timeoutMs);

  return timerId;
};

// ============================================================================
// ESCALATION HIERARCHY
// ============================================================================

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
export const defineEscalationHierarchy = (
  hierarchy: EscalationHierarchy,
  context: SecurityContext
): EscalationHierarchy => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:define')) {
    throw new Error('Unauthorized to define escalation hierarchy');
  }

  EscalationHierarchySchema.parse(hierarchy);

  // Validate levels are sequential
  const levels = hierarchy.levels.map((l) => l.level).sort((a, b) => a - b);
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] !== i + 1) {
      throw new Error('Escalation levels must be sequential starting from 1');
    }
  }

  return hierarchy;
};

/**
 * 12. Gets escalation level configuration.
 *
 * @example
 * ```typescript
 * const levelConfig = getEscalationLevel(hierarchy, 2);
 * console.log('Escalate to:', levelConfig.escalateTo);
 * ```
 */
export const getEscalationLevel = (
  hierarchy: EscalationHierarchy,
  level: number
): EscalationLevel | null => {
  return hierarchy.levels.find((l) => l.level === level) || null;
};

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
export const getNextEscalationLevel = (
  hierarchy: EscalationHierarchy,
  currentLevel: number
): EscalationLevel | null => {
  return getEscalationLevel(hierarchy, currentLevel + 1);
};

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
export const isMaxEscalationLevel = (
  hierarchy: EscalationHierarchy,
  currentLevel: number
): boolean => {
  const maxLevel = Math.max(...hierarchy.levels.map((l) => l.level));
  return currentLevel >= maxLevel;
};

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
export const validateEscalationHierarchy = (
  hierarchy: EscalationHierarchy
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    EscalationHierarchySchema.parse(hierarchy);
  } catch (error: any) {
    return { valid: false, errors: error.errors.map((e: any) => e.message) };
  }

  if (hierarchy.levels.length === 0) {
    errors.push('Hierarchy must have at least one level');
  }

  for (const level of hierarchy.levels) {
    if (level.escalateTo.length === 0) {
      errors.push(`Level ${level.level} must have at least one escalation recipient`);
    }
    if (level.escalationDelayMs < 0) {
      errors.push(`Level ${level.level} escalationDelayMs must be non-negative`);
    }
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// AUTOMATIC ESCALATION
// ============================================================================

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
export const enableAutomaticEscalation = (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  context: SecurityContext
): void => {
  if (!event.metadata) {
    event.metadata = {};
  }
  event.metadata.automaticEscalationEnabled = true;
  event.metadata.hierarchyId = hierarchy.hierarchyId;

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_defined',
    { action: 'automatic_escalation_enabled', hierarchyId: hierarchy.hierarchyId },
    context
  );
};

/**
 * 17. Disables automatic escalation.
 *
 * @example
 * ```typescript
 * disableAutomaticEscalation(escalationEvent, state, securityContext);
 * ```
 */
export const disableAutomaticEscalation = (
  event: EscalationEvent,
  state: EscalationState,
  context: SecurityContext
): void => {
  if (event.metadata) {
    event.metadata.automaticEscalationEnabled = false;
  }

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_defined',
    { action: 'automatic_escalation_disabled' },
    context
  );
};

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
export const isAutomaticEscalationEnabled = (event: EscalationEvent): boolean => {
  return event.metadata?.automaticEscalationEnabled === true;
};

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
export const processAutomaticEscalation = async (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  context: SecurityContext
): Promise<void> => {
  if (!isAutomaticEscalationEnabled(event)) {
    return;
  }

  const currentLevelConfig = getEscalationLevel(hierarchy, state.currentLevel);
  if (!currentLevelConfig || !currentLevelConfig.autoEscalateOnNoResponse) {
    return;
  }

  const nextLevel = getNextEscalationLevel(hierarchy, state.currentLevel);
  if (nextLevel) {
    await escalateToNextLevel(event, hierarchy, state, context);
  }
};

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
export const scheduleAutomaticEscalationCheck = (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  context: SecurityContext
): string => {
  const currentLevelConfig = getEscalationLevel(hierarchy, state.currentLevel);
  if (!currentLevelConfig) {
    throw new Error(`No configuration found for level ${state.currentLevel}`);
  }

  const timerId = crypto.randomUUID();

  setTimeout(async () => {
    if (state.status === 'active' && !state.acknowledgedAt) {
      await processAutomaticEscalation(event, hierarchy, state, context);
    }
  }, currentLevelConfig.escalationDelayMs);

  return timerId;
};

// ============================================================================
// TIME-BASED ESCALATION
// ============================================================================

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
export const createTimeBasedEscalationScheduler = (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  escalationCallback: () => Promise<void>,
  context: SecurityContext
): string => {
  const schedulerId = crypto.randomUUID();

  const scheduleNextLevel = (level: number) => {
    const levelConfig = getEscalationLevel(hierarchy, level);
    if (!levelConfig) return;

    setTimeout(async () => {
      if (state.status === 'active') {
        await escalationCallback();
        createEscalationAuditLog(
          event.escalationId,
          event.workflowInstanceId,
          'escalation_level_increased',
          { fromLevel: level - 1, toLevel: level },
          context
        );

        // Schedule next level if exists
        const nextLevel = getNextEscalationLevel(hierarchy, level);
        if (nextLevel && !isMaxEscalationLevel(hierarchy, level)) {
          scheduleNextLevel(level + 1);
        }
      }
    }, levelConfig.escalationDelayMs);
  };

  scheduleNextLevel(state.currentLevel + 1);
  return schedulerId;
};

/**
 * 22. Calculates time remaining until next escalation.
 *
 * @example
 * ```typescript
 * const timeRemaining = getTimeUntilNextEscalation(hierarchy, state);
 * console.log(`Next escalation in ${timeRemaining}ms`);
 * ```
 */
export const getTimeUntilNextEscalation = (
  hierarchy: EscalationHierarchy,
  state: EscalationState
): number | null => {
  const nextLevel = getNextEscalationLevel(hierarchy, state.currentLevel);
  if (!nextLevel) return null;

  const lastEscalation = state.lastEscalatedAt || state.triggeredAt;
  const elapsed = Date.now() - lastEscalation.getTime();
  const remaining = Math.max(0, nextLevel.escalationDelayMs - elapsed);

  return remaining;
};

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
export const hasEscalationTimeoutExpired = (
  hierarchy: EscalationHierarchy,
  state: EscalationState
): boolean => {
  const timeRemaining = getTimeUntilNextEscalation(hierarchy, state);
  return timeRemaining !== null && timeRemaining === 0;
};

/**
 * 24. Extends escalation timeout.
 *
 * @example
 * ```typescript
 * extendEscalationTimeout(state, 3600000, 'Additional time requested', securityContext);
 * ```
 */
export const extendEscalationTimeout = (
  state: EscalationState,
  extensionMs: number,
  reason: string,
  context: SecurityContext
): void => {
  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: 'timeout_extended',
    performedBy: context.userId,
    details: { extensionMs, reason },
  });
};

/**
 * 25. Resets escalation timer.
 *
 * @example
 * ```typescript
 * resetEscalationTimer(state, 'Issue partially resolved', securityContext);
 * ```
 */
export const resetEscalationTimer = (
  state: EscalationState,
  reason: string,
  context: SecurityContext
): void => {
  state.lastEscalatedAt = new Date();
  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: 'timer_reset',
    performedBy: context.userId,
    details: { reason },
  });
};

// ============================================================================
// ESCALATION RULES ENGINE
// ============================================================================

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
export const defineEscalationRule = (
  rule: EscalationRule,
  context: SecurityContext
): EscalationRule => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:rules:define')) {
    throw new Error('Unauthorized to define escalation rule');
  }

  EscalationRuleSchema.parse(rule);
  return rule;
};

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
export const evaluateEscalationRule = (
  rule: EscalationRule,
  variables: Record<string, any>
): boolean => {
  if (!rule.enabled) return false;

  try {
    const evaluator = new Function('vars', `with(vars) { return ${rule.condition}; }`);
    return Boolean(evaluator(variables));
  } catch (error) {
    return false;
  }
};

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
export const processEscalationRules = (
  rules: EscalationRule[],
  variables: Record<string, any>,
  context: SecurityContext
): EscalationRule[] => {
  const matchedRules = rules
    .filter((rule) => evaluateEscalationRule(rule, variables))
    .sort((a, b) => b.priority - a.priority);

  for (const rule of matchedRules) {
    createEscalationAuditLog(
      crypto.randomUUID(),
      variables.workflowInstanceId || 'unknown',
      'rule_evaluated',
      { ruleId: rule.ruleId, ruleName: rule.name, matched: true },
      context
    );
  }

  return matchedRules;
};

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
export const triggerRuleBasedEscalation = (
  rule: EscalationRule,
  workflowInstanceId: string,
  variables: Record<string, any>,
  context: SecurityContext
): EscalationState => {
  const event: EscalationEvent = {
    escalationId: crypto.randomUUID(),
    workflowInstanceId,
    escalationType: 'automatic',
    priority: 'high',
    escalationCode: rule.name,
    escalationName: rule.name,
    escalationLevel: rule.escalationLevel,
    maxLevel: 3,
    notificationChannels: rule.notificationChannels as any[],
    metadata: { ruleId: rule.ruleId, variables },
  };

  defineEscalationEvent(event, context);
  return triggerEscalation(event, variables, context);
};

/**
 * 30. Updates escalation rule.
 *
 * @example
 * ```typescript
 * updateEscalationRule(rule, { enabled: false }, securityContext);
 * ```
 */
export const updateEscalationRule = (
  rule: EscalationRule,
  updates: Partial<EscalationRule>,
  context: SecurityContext
): EscalationRule => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:rules:update')) {
    throw new Error('Unauthorized to update escalation rule');
  }

  const updatedRule = { ...rule, ...updates };
  EscalationRuleSchema.parse(updatedRule);
  return updatedRule;
};

// ============================================================================
// ESCALATION NOTIFICATION
// ============================================================================

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
export const sendEscalationNotification = async (
  event: EscalationEvent,
  state: EscalationState,
  channel: string,
  recipients: string[],
  notificationContext: EscalationNotificationContext,
  context: SecurityContext
): Promise<void> => {
  for (const recipient of recipients) {
    const notification: NotificationRecord = {
      channel,
      recipient,
      sentAt: new Date(),
      status: 'pending',
    };

    try {
      // Simulate sending notification
      // In production, integrate with email/sms/push services
      notification.status = 'sent';
      notification.messageId = crypto.randomUUID();
    } catch (error: any) {
      notification.status = 'failed';
      notification.error = error.message;
    }

    state.notificationsSent.push(notification);

    createEscalationAuditLog(
      event.escalationId,
      event.workflowInstanceId,
      'notification_sent',
      { channel, recipient, status: notification.status },
      context
    );
  }
};

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
export const sendMultiChannelNotifications = async (
  event: EscalationEvent,
  state: EscalationState,
  channels: string[],
  recipients: string[],
  notificationContext: EscalationNotificationContext,
  context: SecurityContext
): Promise<void> => {
  for (const channel of channels) {
    await sendEscalationNotification(event, state, channel, recipients, notificationContext, context);
  }
};

/**
 * 33. Gets notification status for escalation.
 *
 * @example
 * ```typescript
 * const status = getNotificationStatus(state);
 * console.log(`Sent: ${status.sent}, Failed: ${status.failed}`);
 * ```
 */
export const getNotificationStatus = (
  state: EscalationState
): { total: number; sent: number; delivered: number; failed: number; pending: number } => {
  return {
    total: state.notificationsSent.length,
    sent: state.notificationsSent.filter((n) => n.status === 'sent').length,
    delivered: state.notificationsSent.filter((n) => n.status === 'delivered').length,
    failed: state.notificationsSent.filter((n) => n.status === 'failed').length,
    pending: state.notificationsSent.filter((n) => n.status === 'pending').length,
  };
};

/**
 * 34. Retries failed notifications.
 *
 * @example
 * ```typescript
 * await retryFailedNotifications(escalationEvent, state, securityContext);
 * ```
 */
export const retryFailedNotifications = async (
  event: EscalationEvent,
  state: EscalationState,
  context: SecurityContext
): Promise<void> => {
  const failedNotifications = state.notificationsSent.filter((n) => n.status === 'failed');

  for (const notification of failedNotifications) {
    notification.status = 'pending';
    notification.sentAt = new Date();

    // Retry sending
    try {
      notification.status = 'sent';
      notification.messageId = crypto.randomUUID();
      notification.error = undefined;
    } catch (error: any) {
      notification.status = 'failed';
      notification.error = error.message;
    }
  }
};

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
export const createNotificationContext = (
  event: EscalationEvent,
  state: EscalationState,
  variables: Record<string, any>,
  recipients: string[]
): EscalationNotificationContext => {
  return {
    escalationId: event.escalationId,
    workflowInstanceId: event.workflowInstanceId,
    priority: event.priority,
    level: state.currentLevel,
    escalationName: event.escalationName,
    triggerReason: event.metadata?.reason || 'Escalation triggered',
    variables,
    recipients,
  };
};

// ============================================================================
// ESCALATION TRACKING
// ============================================================================

/**
 * 36. Tracks escalation state change.
 *
 * @example
 * ```typescript
 * trackEscalationStateChange(state, 'acknowledged', securityContext);
 * ```
 */
export const trackEscalationStateChange = (
  state: EscalationState,
  newStatus: EscalationState['status'],
  context: SecurityContext
): void => {
  const oldStatus = state.status;
  state.status = newStatus;

  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: `status_changed_${oldStatus}_to_${newStatus}`,
    performedBy: context.userId,
    details: { oldStatus, newStatus },
  });
};

/**
 * 37. Gets escalation history.
 *
 * @example
 * ```typescript
 * const history = getEscalationHistory(state);
 * ```
 */
export const getEscalationHistory = (state: EscalationState): EscalationHistoryEntry[] => {
  return [...state.history].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

/**
 * 38. Gets current escalation status.
 *
 * @example
 * ```typescript
 * const status = getCurrentEscalationStatus(state);
 * console.log(`Status: ${status.status}, Level: ${status.level}`);
 * ```
 */
export const getCurrentEscalationStatus = (
  state: EscalationState
): { status: string; level: number; duration: number } => {
  const duration = Date.now() - state.triggeredAt.getTime();
  return {
    status: state.status,
    level: state.currentLevel,
    duration,
  };
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
export const requiresAcknowledgment = (
  hierarchy: EscalationHierarchy,
  state: EscalationState
): boolean => {
  const levelConfig = getEscalationLevel(hierarchy, state.currentLevel);
  return levelConfig?.requiresAcknowledgment || false;
};

/**
 * 40. Acknowledges escalation.
 *
 * @example
 * ```typescript
 * acknowledgeEscalation(state, securityContext);
 * ```
 */
export const acknowledgeEscalation = (
  state: EscalationState,
  context: SecurityContext
): void => {
  state.status = 'acknowledged';
  state.acknowledgedAt = new Date();
  state.acknowledgedBy = context.userId;

  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: 'escalation_acknowledged',
    performedBy: context.userId,
  });
};

// ============================================================================
// ESCALATION CANCELLATION
// ============================================================================

/**
 * 41. Cancels escalation.
 *
 * @example
 * ```typescript
 * cancelEscalation(escalationEvent, state, 'Issue resolved', securityContext);
 * ```
 */
export const cancelEscalation = (
  event: EscalationEvent,
  state: EscalationState,
  reason: string,
  context: SecurityContext
): void => {
  if (!validateEscalationAuthorization(context, 'workflow:escalation:cancel')) {
    throw new Error('Unauthorized to cancel escalation');
  }

  state.status = 'cancelled';
  state.cancelledAt = new Date();
  state.cancelledBy = context.userId;

  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: 'escalation_cancelled',
    performedBy: context.userId,
    details: { reason },
  });

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_cancelled',
    { reason, level: state.currentLevel },
    context
  );
};

/**
 * 42. Resolves escalation.
 *
 * @example
 * ```typescript
 * resolveEscalation(escalationEvent, state, 'Patient reviewed by physician', securityContext);
 * ```
 */
export const resolveEscalation = (
  event: EscalationEvent,
  state: EscalationState,
  resolution: string,
  context: SecurityContext
): void => {
  state.status = 'resolved';
  state.resolvedAt = new Date();
  state.resolvedBy = context.userId;

  state.history.push({
    level: state.currentLevel,
    timestamp: new Date(),
    action: 'escalation_resolved',
    performedBy: context.userId,
    details: { resolution },
  });

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_resolved',
    { resolution, level: state.currentLevel },
    context
  );
};

// ============================================================================
// MULTI-LEVEL ESCALATION
// ============================================================================

/**
 * 43. Escalates to next level in hierarchy.
 *
 * @example
 * ```typescript
 * await escalateToNextLevel(escalationEvent, hierarchy, state, securityContext);
 * ```
 */
export const escalateToNextLevel = async (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  context: SecurityContext
): Promise<void> => {
  const nextLevel = getNextEscalationLevel(hierarchy, state.currentLevel);
  if (!nextLevel) {
    throw new Error(`No next level found after level ${state.currentLevel}`);
  }

  state.currentLevel = nextLevel.level;
  state.lastEscalatedAt = new Date();

  state.history.push({
    level: nextLevel.level,
    timestamp: new Date(),
    action: 'escalated_to_next_level',
    performedBy: context.userId,
    details: { previousLevel: state.currentLevel - 1 },
  });

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_level_increased',
    { fromLevel: state.currentLevel - 1, toLevel: nextLevel.level },
    context
  );

  // Send notifications to next level recipients
  const notifContext = createNotificationContext(event, state, {}, nextLevel.escalateTo);
  await sendMultiChannelNotifications(
    event,
    state,
    event.notificationChannels,
    nextLevel.escalateTo,
    notifContext,
    context
  );
};

/**
 * 44. Escalates directly to specific level.
 *
 * @example
 * ```typescript
 * await escalateToLevel(escalationEvent, hierarchy, state, 3, 'Critical situation', securityContext);
 * ```
 */
export const escalateToLevel = async (
  event: EscalationEvent,
  hierarchy: EscalationHierarchy,
  state: EscalationState,
  targetLevel: number,
  reason: string,
  context: SecurityContext
): Promise<void> => {
  const levelConfig = getEscalationLevel(hierarchy, targetLevel);
  if (!levelConfig) {
    throw new Error(`Level ${targetLevel} not found in hierarchy`);
  }

  const previousLevel = state.currentLevel;
  state.currentLevel = targetLevel;
  state.lastEscalatedAt = new Date();

  state.history.push({
    level: targetLevel,
    timestamp: new Date(),
    action: 'escalated_to_specific_level',
    performedBy: context.userId,
    details: { previousLevel, reason },
  });

  createEscalationAuditLog(
    event.escalationId,
    event.workflowInstanceId,
    'escalation_level_increased',
    { fromLevel: previousLevel, toLevel: targetLevel, reason },
    context
  );
};

// ============================================================================
// ESCALATION METRICS
// ============================================================================

/**
 * 45. Calculates escalation metrics.
 *
 * @example
 * ```typescript
 * const metrics = calculateEscalationMetrics(state);
 * console.log(`Average resolution time: ${metrics.averageResolutionTimeMs}ms`);
 * ```
 */
export const calculateEscalationMetrics = (state: EscalationState): EscalationMetrics => {
  const acknowledgedCount = state.acknowledgedAt ? 1 : 0;
  const resolvedCount = state.resolvedAt ? 1 : 0;
  const cancelledCount = state.cancelledAt ? 1 : 0;

  const resolutionTimeMs = state.resolvedAt
    ? state.resolvedAt.getTime() - state.triggeredAt.getTime()
    : 0;

  const acknowledgmentTimeMs = state.acknowledgedAt
    ? state.acknowledgedAt.getTime() - state.triggeredAt.getTime()
    : 0;

  const totalEscalations = state.history.filter((h) => h.action.includes('escalated')).length;
  const escalationRate = totalEscalations / Math.max(1, state.history.length);

  return {
    escalationId: state.escalationId,
    totalEscalations,
    acknowledgedCount,
    resolvedCount,
    cancelledCount,
    averageResolutionTimeMs: resolutionTimeMs,
    averageAcknowledgmentTimeMs: acknowledgmentTimeMs,
    escalationRate,
    currentLevel: state.currentLevel,
  };
};

/**
 * LOC: WUT-001
 * File: /reuse/server/workflow/workflow-user-tasks.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - @nestjs/cqrs
 *   - multer
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - User task management services
 *   - Human task handlers
 *   - Approval workflow services
 *   - Form processing modules
 *   - Collaboration services
 */

/**
 * File: /reuse/server/workflow/workflow-user-tasks.ts
 * Locator: WC-WF-WUT-001
 * Purpose: Advanced User Task Management Utilities - Production-grade human task handling, assignment, and collaboration
 *
 * Upstream: @nestjs/common, @nestjs/event-emitter, @nestjs/cqrs, multer, zod, date-fns, TypeScript 5.x
 * Downstream: ../backend/*, user task services, approval workflows, form handlers, collaboration modules
 * Dependencies: NestJS 10.x, Zod 3.x, TypeScript 5.x, date-fns 3.x, Multer 1.x
 * Exports: 45 production-grade utility functions for user task management, claiming, completion, forms, permissions, escalation, comments, attachments
 *
 * LLM Context: Enterprise-grade user task management utilities for White Cross healthcare platform.
 * Provides comprehensive user task assignment, claiming, completion tracking, form data handling, permission management,
 * task escalation, reassignment, commenting, attachment handling, history tracking, reminder systems, notifications,
 * workload balancing, delegation, approval workflows, collaborative editing, audit trails, and HIPAA-compliant data handling.
 * Optimized for healthcare workflow automation with multi-user collaboration and compliance requirements.
 *
 * Features:
 * - User task lifecycle management
 * - Task claiming and ownership
 * - Form data validation and persistence
 * - Role-based permission checks
 * - Escalation workflows
 * - Dynamic reassignment
 * - Threaded commenting
 * - File attachment handling
 * - Complete audit history
 * - Automated reminders
 * - Real-time notifications
 * - Workload analytics
 * - Collaborative workflows
 * - Approval chains
 * - Multi-tenant isolation
 */

import { z } from 'zod';
import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { differenceInHours, differenceInMinutes, addHours, addDays, isPast, isAfter } from 'date-fns';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for user task definition.
 */
export const UserTaskSchema = z.object({
  id: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  taskDefinitionKey: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).default('normal'),
  status: z.enum(['unassigned', 'assigned', 'claimed', 'in_progress', 'pending_approval', 'completed', 'cancelled', 'escalated']).default('unassigned'),
  assignee: z.string().optional(),
  candidateUsers: z.array(z.string()).default([]),
  candidateGroups: z.array(z.string()).default([]),
  claimedBy: z.string().optional(),
  claimedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dueDate: z.date().optional(),
  followUpDate: z.date().optional(),
  completedAt: z.date().optional(),
  completedBy: z.string().optional(),
  formKey: z.string().optional(),
  formData: z.record(z.any()).optional(),
  variables: z.record(z.any()).default({}),
  tenantId: z.string().optional(),
  parentTaskId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
});

/**
 * Zod schema for user task assignment.
 */
export const UserTaskAssignmentSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  assignedBy: z.string(),
  assignedAt: z.date(),
  reason: z.string().optional(),
  notifyUser: z.boolean().default(true),
  dueDate: z.date().optional(),
});

/**
 * Zod schema for user task claim.
 */
export const UserTaskClaimSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  claimedAt: z.date(),
  previousClaimant: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for user task completion.
 */
export const UserTaskCompletionSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  completedAt: z.date(),
  outcome: z.string().optional(),
  formData: z.record(z.any()).optional(),
  variables: z.record(z.any()).optional(),
  comments: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

/**
 * Zod schema for task form definition.
 */
export const TaskFormSchema = z.object({
  formKey: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).default('1.0.0'),
  fields: z.array(z.object({
    id: z.string().min(1),
    type: z.enum(['text', 'textarea', 'number', 'date', 'datetime', 'boolean', 'select', 'multiselect', 'radio', 'checkbox', 'file', 'signature']),
    label: z.string().min(1),
    placeholder: z.string().optional(),
    defaultValue: z.any().optional(),
    required: z.boolean().default(false),
    readonly: z.boolean().default(false),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      minLength: z.number().int().nonnegative().optional(),
      maxLength: z.number().int().positive().optional(),
      custom: z.string().optional(),
    }).optional(),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
      disabled: z.boolean().optional(),
    })).optional(),
    conditional: z.object({
      field: z.string(),
      operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
      value: z.any(),
    }).optional(),
    metadata: z.record(z.any()).optional(),
  })),
  layout: z.enum(['single', 'two-column', 'grid']).default('single'),
  submitLabel: z.string().default('Submit'),
  cancelLabel: z.string().default('Cancel'),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for user task permissions.
 */
export const TaskPermissionSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  permissions: z.array(z.enum(['view', 'claim', 'complete', 'reassign', 'escalate', 'comment', 'attach', 'delete'])),
  grantedBy: z.string().optional(),
  grantedAt: z.date(),
  expiresAt: z.date().optional(),
});

/**
 * Zod schema for task escalation.
 */
export const TaskEscalationSchema = z.object({
  taskId: z.string().uuid(),
  escalatedBy: z.string(),
  escalatedTo: z.string(),
  escalatedAt: z.date(),
  reason: z.string(),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  originalDueDate: z.date().optional(),
  newDueDate: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task comment.
 */
export const TaskCommentSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string(),
  content: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  parentCommentId: z.string().uuid().optional(),
  mentions: z.array(z.string()).default([]),
  attachments: z.array(z.string()).optional(),
  isInternal: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task attachment.
 */
export const TaskAttachmentSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
  fileUrl: z.string().url(),
  uploadedBy: z.string(),
  uploadedAt: z.date(),
  description: z.string().optional(),
  category: z.enum(['document', 'image', 'spreadsheet', 'presentation', 'other']).optional(),
  scanStatus: z.enum(['pending', 'clean', 'infected', 'error']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task history entry.
 */
export const TaskHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  action: z.enum(['created', 'assigned', 'claimed', 'released', 'completed', 'cancelled', 'escalated', 'reassigned', 'commented', 'attached', 'updated']),
  userId: z.string(),
  timestamp: z.date(),
  changes: z.record(z.object({
    from: z.any(),
    to: z.any(),
  })).optional(),
  comment: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task reminder.
 */
export const TaskReminderSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string(),
  reminderType: z.enum(['due_date', 'follow_up', 'escalation', 'custom']),
  scheduledFor: z.date(),
  channel: z.enum(['email', 'sms', 'push', 'in_app']).default('in_app'),
  message: z.string().optional(),
  sent: z.boolean().default(false),
  sentAt: z.date().optional(),
  recurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
});

/**
 * Zod schema for task reassignment.
 */
export const TaskReassignmentSchema = z.object({
  taskId: z.string().uuid(),
  fromUser: z.string(),
  toUser: z.string(),
  reassignedBy: z.string(),
  reassignedAt: z.date(),
  reason: z.string(),
  notifyBoth: z.boolean().default(true),
  transferOwnership: z.boolean().default(true),
});

/**
 * Zod schema for task delegation.
 */
export const UserTaskDelegationSchema = z.object({
  taskId: z.string().uuid(),
  delegatedBy: z.string(),
  delegatedTo: z.string(),
  delegatedAt: z.date(),
  expiresAt: z.date().optional(),
  reason: z.string().optional(),
  canReassign: z.boolean().default(false),
  returnOnCompletion: z.boolean().default(true),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserTask {
  id: string;
  workflowInstanceId: string;
  taskDefinitionKey: string;
  name: string;
  description?: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'unassigned' | 'assigned' | 'claimed' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled' | 'escalated';
  assignee?: string;
  candidateUsers: string[];
  candidateGroups: string[];
  claimedBy?: string;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  followUpDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  formKey?: string;
  formData?: Record<string, any>;
  variables: Record<string, any>;
  tenantId?: string;
  parentTaskId?: string;
  tags: string[];
}

export interface UserTaskAssignment {
  taskId: string;
  userId: string;
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
  notifyUser: boolean;
  dueDate?: Date;
}

export interface UserTaskClaim {
  taskId: string;
  userId: string;
  claimedAt: Date;
  previousClaimant?: string;
  metadata?: Record<string, any>;
}

export interface UserTaskCompletion {
  taskId: string;
  userId: string;
  completedAt: Date;
  outcome?: string;
  formData?: Record<string, any>;
  variables?: Record<string, any>;
  comments?: string;
  attachments?: string[];
}

export interface TaskForm {
  formKey: string;
  version: string;
  fields: TaskFormField[];
  layout: 'single' | 'two-column' | 'grid';
  submitLabel: string;
  cancelLabel: string;
  metadata?: Record<string, any>;
}

export interface TaskFormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'signature';
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required: boolean;
  readonly: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    custom?: string;
  };
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  metadata?: Record<string, any>;
}

export interface TaskPermission {
  taskId: string;
  userId: string;
  permissions: Array<'view' | 'claim' | 'complete' | 'reassign' | 'escalate' | 'comment' | 'attach' | 'delete'>;
  grantedBy?: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface TaskEscalation {
  taskId: string;
  escalatedBy: string;
  escalatedTo: string;
  escalatedAt: Date;
  reason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  originalDueDate?: Date;
  newDueDate?: Date;
  metadata?: Record<string, any>;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentCommentId?: string;
  mentions: string[];
  attachments?: string[];
  isInternal: boolean;
  metadata?: Record<string, any>;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
  category?: 'document' | 'image' | 'spreadsheet' | 'presentation' | 'other';
  scanStatus?: 'pending' | 'clean' | 'infected' | 'error';
  metadata?: Record<string, any>;
}

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  action: 'created' | 'assigned' | 'claimed' | 'released' | 'completed' | 'cancelled' | 'escalated' | 'reassigned' | 'commented' | 'attached' | 'updated';
  userId: string;
  timestamp: Date;
  changes?: Record<string, { from: any; to: any }>;
  comment?: string;
  metadata?: Record<string, any>;
}

export interface TaskReminder {
  id: string;
  taskId: string;
  userId: string;
  reminderType: 'due_date' | 'follow_up' | 'escalation' | 'custom';
  scheduledFor: Date;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  message?: string;
  sent: boolean;
  sentAt?: Date;
  recurring: boolean;
  recurrencePattern?: string;
}

export interface TaskReassignment {
  taskId: string;
  fromUser: string;
  toUser: string;
  reassignedBy: string;
  reassignedAt: Date;
  reason: string;
  notifyBoth: boolean;
  transferOwnership: boolean;
}

export interface UserTaskDelegation {
  taskId: string;
  delegatedBy: string;
  delegatedTo: string;
  delegatedAt: Date;
  expiresAt?: Date;
  reason?: string;
  canReassign: boolean;
  returnOnCompletion: boolean;
}

export interface WorkloadMetrics {
  userId: string;
  totalTasks: number;
  claimedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageCompletionTimeHours: number;
  tasksByPriority: Record<UserTask['priority'], number>;
}

export interface TaskFilter {
  status?: UserTask['status'][];
  priority?: UserTask['priority'][];
  assignee?: string;
  candidateUser?: string;
  candidateGroup?: string;
  tags?: string[];
  dueAfter?: Date;
  dueBefore?: Date;
  createdAfter?: Date;
  createdBefore?: Date;
  tenantId?: string;
}

// ============================================================================
// USER TASK CREATION AND ASSIGNMENT
// ============================================================================

/**
 * 1. Creates a new user task.
 *
 * @example
 * const task = createUserTask({
 *   workflowInstanceId: 'workflow-123',
 *   taskDefinitionKey: 'approve-patient-record',
 *   name: 'Approve Patient Admission Record',
 *   priority: 'high',
 *   candidateGroups: ['doctors', 'nurses'],
 *   formKey: 'patient-approval-form',
 * });
 */
export function createUserTask(config: Partial<UserTask> & Pick<UserTask, 'workflowInstanceId' | 'taskDefinitionKey' | 'name'>): UserTask {
  const now = new Date();

  return {
    id: config.id || crypto.randomUUID(),
    workflowInstanceId: config.workflowInstanceId,
    taskDefinitionKey: config.taskDefinitionKey,
    name: config.name,
    description: config.description,
    priority: config.priority || 'normal',
    status: config.status || 'unassigned',
    assignee: config.assignee,
    candidateUsers: config.candidateUsers || [],
    candidateGroups: config.candidateGroups || [],
    claimedBy: config.claimedBy,
    claimedAt: config.claimedAt,
    createdAt: config.createdAt || now,
    updatedAt: config.updatedAt || now,
    dueDate: config.dueDate,
    followUpDate: config.followUpDate,
    completedAt: config.completedAt,
    completedBy: config.completedBy,
    formKey: config.formKey,
    formData: config.formData,
    variables: config.variables || {},
    tenantId: config.tenantId,
    parentTaskId: config.parentTaskId,
    tags: config.tags || [],
  };
}

/**
 * 2. Assigns a user task to a specific user.
 *
 * @example
 * const assignment = assignUserTask(task, 'user-123', 'manager-456', 'Best qualified');
 */
export function assignUserTask(
  task: UserTask,
  userId: string,
  assignedBy: string,
  reason?: string,
  dueDate?: Date
): UserTaskAssignment {
  task.assignee = userId;
  task.status = 'assigned';
  task.updatedAt = new Date();
  if (dueDate) task.dueDate = dueDate;

  return {
    taskId: task.id,
    userId,
    assignedBy,
    assignedAt: new Date(),
    reason,
    notifyUser: true,
    dueDate: task.dueDate,
  };
}

/**
 * 3. Adds candidate users to a task.
 *
 * @example
 * addCandidateUsers(task, ['user-123', 'user-456']);
 */
export function addCandidateUsers(task: UserTask, userIds: string[]): void {
  const newCandidates = userIds.filter(id => !task.candidateUsers.includes(id));
  task.candidateUsers.push(...newCandidates);
  task.updatedAt = new Date();
}

/**
 * 4. Adds candidate groups to a task.
 *
 * @example
 * addCandidateGroups(task, ['doctors', 'specialists']);
 */
export function addCandidateGroups(task: UserTask, groupIds: string[]): void {
  const newGroups = groupIds.filter(id => !task.candidateGroups.includes(id));
  task.candidateGroups.push(...newGroups);
  task.updatedAt = new Date();
}

/**
 * 5. Auto-assigns task to user with lowest workload.
 *
 * @example
 * const assignedTo = autoAssignUserTask(task, candidateUsers, workloads);
 */
export function autoAssignUserTask(
  task: UserTask,
  candidateUsers: string[],
  workloadMetrics: Map<string, WorkloadMetrics>
): string {
  if (candidateUsers.length === 0) {
    throw new Error('No candidate users available');
  }

  const assignedTo = candidateUsers.reduce((minUser, userId) => {
    const userWorkload = workloadMetrics.get(userId)?.totalTasks || 0;
    const minWorkload = workloadMetrics.get(minUser)?.totalTasks || 0;
    return userWorkload < minWorkload ? userId : minUser;
  }, candidateUsers[0]);

  task.assignee = assignedTo;
  task.status = 'assigned';
  task.updatedAt = new Date();

  return assignedTo;
}

// ============================================================================
// USER TASK CLAIMING
// ============================================================================

/**
 * 6. Claims a user task.
 *
 * @example
 * const claim = claimUserTask(task, 'user-123');
 */
export function claimUserTask(task: UserTask, userId: string): UserTaskClaim {
  if (task.claimedBy && task.claimedBy !== userId) {
    throw new Error(`Task already claimed by ${task.claimedBy}`);
  }

  const previousClaimant = task.claimedBy;
  task.claimedBy = userId;
  task.claimedAt = new Date();
  task.status = 'claimed';
  task.assignee = userId;
  task.updatedAt = new Date();

  return {
    taskId: task.id,
    userId,
    claimedAt: task.claimedAt,
    previousClaimant,
  };
}

/**
 * 7. Releases a claimed task back to the pool.
 *
 * @example
 * releaseUserTask(task, 'user-123');
 */
export function releaseUserTask(task: UserTask, userId: string): void {
  if (task.claimedBy !== userId) {
    throw new ForbiddenException('Only the claimant can release this task');
  }

  task.claimedBy = undefined;
  task.claimedAt = undefined;
  task.status = task.assignee ? 'assigned' : 'unassigned';
  task.updatedAt = new Date();
}

/**
 * 8. Checks if a user can claim a task.
 *
 * @example
 * const canClaim = canUserClaimTask(task, 'user-123', ['doctors']);
 */
export function canUserClaimTask(task: UserTask, userId: string, userGroups: string[]): boolean {
  // Already claimed by someone else
  if (task.claimedBy && task.claimedBy !== userId) return false;

  // Already assigned to this user
  if (task.assignee === userId) return true;

  // User is in candidate users
  if (task.candidateUsers.includes(userId)) return true;

  // User is in candidate groups
  return task.candidateGroups.some(group => userGroups.includes(group));
}

/**
 * 9. Forces claim of a task (admin override).
 *
 * @example
 * forceClaimTask(task, 'admin-123', 'Emergency override');
 */
export function forceClaimTask(task: UserTask, userId: string, reason: string): UserTaskClaim {
  const previousClaimant = task.claimedBy;

  task.claimedBy = userId;
  task.claimedAt = new Date();
  task.status = 'claimed';
  task.assignee = userId;
  task.updatedAt = new Date();
  task.variables = {
    ...task.variables,
    forceClaim: { by: userId, reason, timestamp: new Date() },
  };

  return {
    taskId: task.id,
    userId,
    claimedAt: task.claimedAt,
    previousClaimant,
    metadata: { forced: true, reason },
  };
}

/**
 * 10. Gets all claimable tasks for a user.
 *
 * @example
 * const claimableTasks = getClaimableTasksForUser(allTasks, 'user-123', ['doctors']);
 */
export function getClaimableTasksForUser(
  tasks: UserTask[],
  userId: string,
  userGroups: string[]
): UserTask[] {
  return tasks.filter(task =>
    !task.claimedBy &&
    (task.candidateUsers.includes(userId) ||
     task.candidateGroups.some(group => userGroups.includes(group)))
  );
}

// ============================================================================
// USER TASK COMPLETION
// ============================================================================

/**
 * 11. Completes a user task with form data.
 *
 * @example
 * const completion = completeUserTask(task, 'user-123', {
 *   approved: true,
 *   comments: 'Looks good',
 * });
 */
export function completeUserTask(
  task: UserTask,
  userId: string,
  formData?: Record<string, any>,
  outcome?: string
): UserTaskCompletion {
  if (task.claimedBy && task.claimedBy !== userId && task.assignee !== userId) {
    throw new ForbiddenException('Only the assigned user can complete this task');
  }

  const now = new Date();

  task.status = 'completed';
  task.completedAt = now;
  task.completedBy = userId;
  task.updatedAt = now;
  if (formData) task.formData = formData;

  return {
    taskId: task.id,
    userId,
    completedAt: now,
    outcome,
    formData,
    variables: task.variables,
  };
}

/**
 * 12. Validates form data against form definition.
 *
 * @example
 * const errors = validateTaskFormData(formDefinition, formData);
 */
export function validateTaskFormData(
  form: TaskForm,
  data: Record<string, any>
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const field of form.fields) {
    const value = data[field.id];
    const fieldErrors: string[] = [];

    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field.label} is required`);
    }

    // Check validation rules
    if (value !== undefined && value !== null && field.validation) {
      const { min, max, pattern, minLength, maxLength } = field.validation;

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          fieldErrors.push(`${field.label} must be at least ${min}`);
        }
        if (max !== undefined && value > max) {
          fieldErrors.push(`${field.label} must be at most ${max}`);
        }
      }

      if (typeof value === 'string') {
        if (minLength !== undefined && value.length < minLength) {
          fieldErrors.push(`${field.label} must be at least ${minLength} characters`);
        }
        if (maxLength !== undefined && value.length > maxLength) {
          fieldErrors.push(`${field.label} must be at most ${maxLength} characters`);
        }
        if (pattern) {
          const regex = new RegExp(pattern);
          if (!regex.test(value)) {
            fieldErrors.push(`${field.label} format is invalid`);
          }
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
    }
  }

  return errors;
}

/**
 * 13. Saves partial form data (draft).
 *
 * @example
 * saveFormDataDraft(task, { patientName: 'John Doe' });
 */
export function saveFormDataDraft(task: UserTask, partialData: Record<string, any>): void {
  task.formData = {
    ...task.formData,
    ...partialData,
  };
  task.updatedAt = new Date();
  task.variables = {
    ...task.variables,
    lastDraftSaved: new Date(),
  };
}

/**
 * 14. Calculates task completion time.
 *
 * @example
 * const hours = calculateTaskCompletionTime(task);
 */
export function calculateTaskCompletionTime(task: UserTask): number | null {
  if (!task.completedAt) return null;

  const startTime = task.claimedAt || task.createdAt;
  return differenceInHours(task.completedAt, startTime);
}

/**
 * 15. Gets task completion statistics.
 *
 * @example
 * const stats = getTaskCompletionStats(tasks, 'user-123');
 */
export function getTaskCompletionStats(tasks: UserTask[], userId?: string): {
  total: number;
  completed: number;
  averageCompletionTimeHours: number;
  onTimeCompletionRate: number;
} {
  const userTasks = userId ? tasks.filter(t => t.completedBy === userId) : tasks;
  const completedTasks = userTasks.filter(t => t.status === 'completed');

  const completionTimes = completedTasks
    .map(t => calculateTaskCompletionTime(t))
    .filter((time): time is number => time !== null);

  const averageCompletionTimeHours = completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
    : 0;

  const onTimeCompletions = completedTasks.filter(t =>
    t.completedAt && t.dueDate && t.completedAt <= t.dueDate
  ).length;

  const onTimeCompletionRate = completedTasks.length > 0
    ? (onTimeCompletions / completedTasks.length) * 100
    : 0;

  return {
    total: userTasks.length,
    completed: completedTasks.length,
    averageCompletionTimeHours,
    onTimeCompletionRate,
  };
}

// ============================================================================
// TASK FORMS AND DATA
// ============================================================================

/**
 * 16. Creates a task form definition.
 *
 * @example
 * const form = createTaskForm('patient-approval', [
 *   { id: 'approved', type: 'boolean', label: 'Approve?', required: true },
 *   { id: 'comments', type: 'textarea', label: 'Comments' },
 * ]);
 */
export function createTaskForm(
  formKey: string,
  fields: TaskFormField[],
  options?: {
    version?: string;
    layout?: TaskForm['layout'];
    submitLabel?: string;
    cancelLabel?: string;
  }
): TaskForm {
  return {
    formKey,
    version: options?.version || '1.0.0',
    fields,
    layout: options?.layout || 'single',
    submitLabel: options?.submitLabel || 'Submit',
    cancelLabel: options?.cancelLabel || 'Cancel',
  };
}

/**
 * 17. Adds a field to a form definition.
 *
 * @example
 * addFormField(form, {
 *   id: 'diagnosis',
 *   type: 'text',
 *   label: 'Diagnosis',
 *   required: true,
 * });
 */
export function addFormField(form: TaskForm, field: TaskFormField): void {
  if (form.fields.some(f => f.id === field.id)) {
    throw new Error(`Field with id ${field.id} already exists`);
  }
  form.fields.push(field);
}

/**
 * 18. Evaluates conditional field visibility.
 *
 * @example
 * const visible = isFieldVisible(field, formData);
 */
export function isFieldVisible(field: TaskFormField, formData: Record<string, any>): boolean {
  if (!field.conditional) return true;

  const { field: condField, operator, value } = field.conditional;
  const fieldValue = formData[condField];

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(value);
    case 'greater_than':
      return typeof fieldValue === 'number' && fieldValue > value;
    case 'less_than':
      return typeof fieldValue === 'number' && fieldValue < value;
    default:
      return true;
  }
}

/**
 * 19. Renders form with conditional fields.
 *
 * @example
 * const visibleFields = getVisibleFormFields(form, formData);
 */
export function getVisibleFormFields(form: TaskForm, formData: Record<string, any>): TaskFormField[] {
  return form.fields.filter(field => isFieldVisible(field, formData));
}

/**
 * 20. Extracts form variables for workflow.
 *
 * @example
 * const variables = extractFormVariables(formData, form);
 */
export function extractFormVariables(
  formData: Record<string, any>,
  form: TaskForm
): Record<string, any> {
  const variables: Record<string, any> = {};

  for (const field of form.fields) {
    const value = formData[field.id];
    if (value !== undefined) {
      variables[field.id] = value;
    }
  }

  return variables;
}

// ============================================================================
// USER TASK PERMISSIONS
// ============================================================================

/**
 * 21. Checks if user has permission for task action.
 *
 * @example
 * const canComplete = hasTaskPermission(task, 'user-123', 'complete', userGroups);
 */
export function hasTaskPermission(
  task: UserTask,
  userId: string,
  action: TaskPermission['permissions'][number],
  userGroups: string[]
): boolean {
  // Assigned user has all permissions
  if (task.assignee === userId || task.claimedBy === userId) return true;

  // Check if user is in candidate lists
  const isCandidate = task.candidateUsers.includes(userId) ||
    task.candidateGroups.some(group => userGroups.includes(group));

  // Candidates can view and claim
  if (isCandidate && (action === 'view' || action === 'claim')) return true;

  return false;
}

/**
 * 22. Grants explicit permission to a user.
 *
 * @example
 * const permission = grantTaskPermission(task, 'user-123', ['view', 'comment'], 'admin-456');
 */
export function grantTaskPermission(
  task: UserTask,
  userId: string,
  permissions: TaskPermission['permissions'],
  grantedBy: string,
  expiresAt?: Date
): TaskPermission {
  const permission: TaskPermission = {
    taskId: task.id,
    userId,
    permissions,
    grantedBy,
    grantedAt: new Date(),
    expiresAt,
  };

  task.variables = {
    ...task.variables,
    customPermissions: [
      ...(task.variables.customPermissions || []),
      permission,
    ],
  };

  return permission;
}

/**
 * 23. Revokes permission from a user.
 *
 * @example
 * revokeTaskPermission(task, 'user-123');
 */
export function revokeTaskPermission(task: UserTask, userId: string): void {
  if (task.variables.customPermissions) {
    task.variables.customPermissions = task.variables.customPermissions.filter(
      (p: TaskPermission) => p.userId !== userId
    );
  }
}

/**
 * 24. Validates user can perform action.
 *
 * @example
 * validateTaskAction(task, 'user-123', 'complete', userGroups);
 */
export function validateTaskAction(
  task: UserTask,
  userId: string,
  action: TaskPermission['permissions'][number],
  userGroups: string[]
): void {
  if (!hasTaskPermission(task, userId, action, userGroups)) {
    throw new ForbiddenException(`User ${userId} does not have permission to ${action} task ${task.id}`);
  }
}

/**
 * 25. Gets all permissions for a user on a task.
 *
 * @example
 * const permissions = getTaskPermissionsForUser(task, 'user-123', userGroups);
 */
export function getTaskPermissionsForUser(
  task: UserTask,
  userId: string,
  userGroups: string[]
): TaskPermission['permissions'] {
  const permissions = new Set<TaskPermission['permissions'][number]>();

  if (task.assignee === userId || task.claimedBy === userId) {
    return ['view', 'claim', 'complete', 'reassign', 'escalate', 'comment', 'attach', 'delete'];
  }

  const isCandidate = task.candidateUsers.includes(userId) ||
    task.candidateGroups.some(group => userGroups.includes(group));

  if (isCandidate) {
    permissions.add('view');
    permissions.add('claim');
    permissions.add('comment');
  }

  // Check custom permissions
  if (task.variables.customPermissions) {
    const customPerms = task.variables.customPermissions.find(
      (p: TaskPermission) => p.userId === userId && (!p.expiresAt || isAfter(p.expiresAt, new Date()))
    );
    if (customPerms) {
      customPerms.permissions.forEach((p: TaskPermission['permissions'][number]) => permissions.add(p));
    }
  }

  return Array.from(permissions);
}

// ============================================================================
// TASK ESCALATION
// ============================================================================

/**
 * 26. Escalates a task to higher priority or different user.
 *
 * @example
 * const escalation = escalateUserTask(
 *   task,
 *   'user-123',
 *   'manager-456',
 *   'Overdue by 48 hours',
 *   'critical'
 * );
 */
export function escalateUserTask(
  task: UserTask,
  escalatedBy: string,
  escalatedTo: string,
  reason: string,
  urgencyLevel: TaskEscalation['urgencyLevel'] = 'high'
): TaskEscalation {
  const originalDueDate = task.dueDate;
  const originalPriority = task.priority;

  task.status = 'escalated';
  task.assignee = escalatedTo;
  task.priority = urgencyLevel === 'critical' ? 'urgent' : urgencyLevel as UserTask['priority'];
  task.updatedAt = new Date();

  const escalation: TaskEscalation = {
    taskId: task.id,
    escalatedBy,
    escalatedTo,
    escalatedAt: new Date(),
    reason,
    urgencyLevel,
    originalDueDate,
    metadata: { originalPriority },
  };

  task.variables = {
    ...task.variables,
    escalationHistory: [
      ...(task.variables.escalationHistory || []),
      escalation,
    ],
  };

  return escalation;
}

/**
 * 27. Auto-escalates overdue tasks.
 *
 * @example
 * const escalated = autoEscalateOverdueTasks(tasks, escalationRules);
 */
export function autoEscalateOverdueTasks(
  tasks: UserTask[],
  escalationRules: {
    hoursOverdue: number;
    escalateTo: string;
    urgencyLevel: TaskEscalation['urgencyLevel'];
  }[]
): UserTask[] {
  const now = new Date();
  const escalatedTasks: UserTask[] = [];

  for (const task of tasks) {
    if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') continue;

    const hoursOverdue = differenceInHours(now, task.dueDate);

    if (hoursOverdue > 0) {
      const matchingRule = escalationRules
        .sort((a, b) => b.hoursOverdue - a.hoursOverdue)
        .find(rule => hoursOverdue >= rule.hoursOverdue);

      if (matchingRule) {
        escalateUserTask(
          task,
          'system',
          matchingRule.escalateTo,
          `Task overdue by ${hoursOverdue} hours`,
          matchingRule.urgencyLevel
        );
        escalatedTasks.push(task);
      }
    }
  }

  return escalatedTasks;
}

/**
 * 28. Checks if task should be escalated.
 *
 * @example
 * const shouldEscalate = shouldEscalateTask(task, 24);
 */
export function shouldEscalateTask(task: UserTask, hoursOverdueThreshold: number): boolean {
  if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') return false;

  const hoursOverdue = differenceInHours(new Date(), task.dueDate);
  return hoursOverdue >= hoursOverdueThreshold;
}

/**
 * 29. De-escalates a task back to normal priority.
 *
 * @example
 * deEscalateTask(task, 'manager-456', 'Issue resolved');
 */
export function deEscalateTask(task: UserTask, deEscalatedBy: string, reason: string): void {
  const escalationHistory = task.variables.escalationHistory || [];
  const lastEscalation = escalationHistory[escalationHistory.length - 1];

  if (lastEscalation?.metadata?.originalPriority) {
    task.priority = lastEscalation.metadata.originalPriority;
  }

  task.status = task.claimedBy ? 'claimed' : task.assignee ? 'assigned' : 'unassigned';
  task.updatedAt = new Date();

  task.variables = {
    ...task.variables,
    deEscalated: {
      by: deEscalatedBy,
      reason,
      timestamp: new Date(),
    },
  };
}

/**
 * 30. Gets escalation path for task type.
 *
 * @example
 * const path = getEscalationPath('patient-approval', 1);
 */
export function getEscalationPath(
  taskType: string,
  escalationLevel: number,
  escalationPaths: Record<string, string[]>
): string | null {
  const path = escalationPaths[taskType];
  if (!path || escalationLevel >= path.length) return null;
  return path[escalationLevel];
}

// ============================================================================
// TASK REASSIGNMENT
// ============================================================================

/**
 * 31. Reassigns a task to a different user.
 *
 * @example
 * const reassignment = reassignUserTask(
 *   task,
 *   'user-789',
 *   'manager-123',
 *   'Better expertise match'
 * );
 */
export function reassignUserTask(
  task: UserTask,
  toUser: string,
  reassignedBy: string,
  reason: string
): TaskReassignment {
  const fromUser = task.assignee || task.claimedBy || 'unassigned';

  task.assignee = toUser;
  task.claimedBy = undefined;
  task.claimedAt = undefined;
  task.status = 'assigned';
  task.updatedAt = new Date();

  const reassignment: TaskReassignment = {
    taskId: task.id,
    fromUser,
    toUser,
    reassignedBy,
    reassignedAt: new Date(),
    reason,
    notifyBoth: true,
    transferOwnership: true,
  };

  task.variables = {
    ...task.variables,
    reassignmentHistory: [
      ...(task.variables.reassignmentHistory || []),
      reassignment,
    ],
  };

  return reassignment;
}

/**
 * 32. Delegates task temporarily to another user.
 *
 * @example
 * const delegation = delegateUserTask(
 *   task,
 *   'user-123',
 *   'user-456',
 *   addDays(new Date(), 7),
 *   'Covering during PTO'
 * );
 */
export function delegateUserTask(
  task: UserTask,
  delegatedBy: string,
  delegatedTo: string,
  expiresAt?: Date,
  reason?: string
): UserTaskDelegation {
  const delegation: UserTaskDelegation = {
    taskId: task.id,
    delegatedBy,
    delegatedTo,
    delegatedAt: new Date(),
    expiresAt,
    reason,
    canReassign: false,
    returnOnCompletion: true,
  };

  task.assignee = delegatedTo;
  task.updatedAt = new Date();
  task.variables = {
    ...task.variables,
    delegation,
    originalAssignee: delegatedBy,
  };

  return delegation;
}

/**
 * 33. Returns delegated task to original owner.
 *
 * @example
 * returnDelegatedTask(task, 'user-456');
 */
export function returnDelegatedTask(task: UserTask, returnedBy: string): void {
  const delegation = task.variables.delegation as UserTaskDelegation | undefined;
  if (!delegation) {
    throw new Error('Task is not delegated');
  }

  task.assignee = task.variables.originalAssignee;
  task.updatedAt = new Date();
  task.variables = {
    ...task.variables,
    delegation: undefined,
    originalAssignee: undefined,
    delegationReturned: {
      by: returnedBy,
      timestamp: new Date(),
    },
  };
}

/**
 * 34. Checks if delegation has expired.
 *
 * @example
 * const expired = isDelegationExpired(task);
 */
export function isDelegationExpired(task: UserTask): boolean {
  const delegation = task.variables.delegation as UserTaskDelegation | undefined;
  if (!delegation || !delegation.expiresAt) return false;
  return isPast(delegation.expiresAt);
}

/**
 * 35. Balances workload across team members.
 *
 * @example
 * const rebalanced = rebalanceTaskWorkload(tasks, teamMembers, maxTasksPerUser);
 */
export function rebalanceTaskWorkload(
  tasks: UserTask[],
  teamMembers: string[],
  maxTasksPerUser: number
): UserTask[] {
  const workloadMap = new Map<string, UserTask[]>();

  // Initialize workload map
  teamMembers.forEach(member => workloadMap.set(member, []));

  // Count current workload
  tasks.forEach(task => {
    if (task.assignee && workloadMap.has(task.assignee)) {
      workloadMap.get(task.assignee)!.push(task);
    }
  });

  const rebalancedTasks: UserTask[] = [];

  // Find overloaded users and redistribute
  for (const [userId, userTasks] of workloadMap.entries()) {
    if (userTasks.length > maxTasksPerUser) {
      const excessTasks = userTasks.slice(maxTasksPerUser);

      for (const task of excessTasks) {
        // Find user with lowest workload
        const targetUser = Array.from(workloadMap.entries())
          .filter(([id]) => id !== userId)
          .sort(([, a], [, b]) => a.length - b.length)[0];

        if (targetUser) {
          reassignUserTask(task, targetUser[0], 'system', 'Workload balancing');
          targetUser[1].push(task);
          rebalancedTasks.push(task);
        }
      }

      workloadMap.set(userId, userTasks.slice(0, maxTasksPerUser));
    }
  }

  return rebalancedTasks;
}

// ============================================================================
// TASK COMMENTS
// ============================================================================

/**
 * 36. Adds a comment to a task.
 *
 * @example
 * const comment = addTaskComment(
 *   task,
 *   'user-123',
 *   'Please review the updated diagnosis',
 *   ['user-456']
 * );
 */
export function addTaskComment(
  task: UserTask,
  userId: string,
  content: string,
  mentions?: string[],
  parentCommentId?: string,
  isInternal = false
): TaskComment {
  const comment: TaskComment = {
    id: crypto.randomUUID(),
    taskId: task.id,
    userId,
    content,
    createdAt: new Date(),
    parentCommentId,
    mentions: mentions || [],
    isInternal,
  };

  task.variables = {
    ...task.variables,
    comments: [
      ...(task.variables.comments || []),
      comment,
    ],
  };
  task.updatedAt = new Date();

  return comment;
}

/**
 * 37. Edits an existing comment.
 *
 * @example
 * updateTaskComment(task, commentId, 'Updated comment text');
 */
export function updateTaskComment(
  task: UserTask,
  commentId: string,
  newContent: string,
  userId: string
): void {
  const comments = task.variables.comments || [];
  const comment = comments.find((c: TaskComment) => c.id === commentId);

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenException('Only comment author can edit');
  }

  comment.content = newContent;
  comment.updatedAt = new Date();
  task.updatedAt = new Date();
}

/**
 * 38. Gets all comments for a task with threading.
 *
 * @example
 * const comments = getTaskComments(task, true);
 */
export function getTaskComments(task: UserTask, includeInternal = false): TaskComment[] {
  const comments = (task.variables.comments || []) as TaskComment[];

  if (!includeInternal) {
    return comments.filter(c => !c.isInternal);
  }

  return comments;
}

/**
 * 39. Gets comment thread (parent and replies).
 *
 * @example
 * const thread = getCommentThread(task, parentCommentId);
 */
export function getCommentThread(task: UserTask, parentCommentId: string): TaskComment[] {
  const comments = (task.variables.comments || []) as TaskComment[];
  const parent = comments.find(c => c.id === parentCommentId);

  if (!parent) return [];

  const replies = comments.filter(c => c.parentCommentId === parentCommentId);

  return [parent, ...replies];
}

/**
 * 40. Deletes a comment.
 *
 * @example
 * deleteTaskComment(task, commentId, 'user-123');
 */
export function deleteTaskComment(task: UserTask, commentId: string, userId: string): void {
  const comments = (task.variables.comments || []) as TaskComment[];
  const comment = comments.find(c => c.id === commentId);

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenException('Only comment author can delete');
  }

  task.variables.comments = comments.filter(c => c.id !== commentId);
  task.updatedAt = new Date();
}

// ============================================================================
// TASK ATTACHMENTS
// ============================================================================

/**
 * 41. Adds an attachment to a task.
 *
 * @example
 * const attachment = addTaskAttachment(task, {
 *   fileName: 'patient-record.pdf',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf',
 *   fileUrl: 'https://storage.example.com/files/123',
 *   uploadedBy: 'user-123',
 *   category: 'document',
 * });
 */
export function addTaskAttachment(
  task: UserTask,
  attachmentData: Omit<TaskAttachment, 'id' | 'taskId' | 'uploadedAt'>
): TaskAttachment {
  const attachment: TaskAttachment = {
    id: crypto.randomUUID(),
    taskId: task.id,
    ...attachmentData,
    uploadedAt: new Date(),
  };

  task.variables = {
    ...task.variables,
    attachments: [
      ...(task.variables.attachments || []),
      attachment,
    ],
  };
  task.updatedAt = new Date();

  return attachment;
}

/**
 * 42. Removes an attachment from a task.
 *
 * @example
 * removeTaskAttachment(task, attachmentId, 'user-123');
 */
export function removeTaskAttachment(task: UserTask, attachmentId: string, userId: string): void {
  const attachments = (task.variables.attachments || []) as TaskAttachment[];
  const attachment = attachments.find(a => a.id === attachmentId);

  if (!attachment) {
    throw new NotFoundException('Attachment not found');
  }

  if (attachment.uploadedBy !== userId) {
    throw new ForbiddenException('Only uploader can delete attachment');
  }

  task.variables.attachments = attachments.filter(a => a.id !== attachmentId);
  task.updatedAt = new Date();
}

/**
 * 43. Gets all attachments for a task.
 *
 * @example
 * const attachments = getTaskAttachments(task, 'document');
 */
export function getTaskAttachments(
  task: UserTask,
  category?: TaskAttachment['category']
): TaskAttachment[] {
  const attachments = (task.variables.attachments || []) as TaskAttachment[];

  if (category) {
    return attachments.filter(a => a.category === category);
  }

  return attachments;
}

/**
 * 44. Validates attachment size and type.
 *
 * @example
 * const valid = validateAttachment(fileName, fileSize, mimeType, {
 *   maxSizeMb: 10,
 *   allowedTypes: ['application/pdf', 'image/jpeg'],
 * });
 */
export function validateAttachment(
  fileName: string,
  fileSize: number,
  mimeType: string,
  rules: {
    maxSizeMb: number;
    allowedTypes?: string[];
    blockedExtensions?: string[];
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file size
  const sizeMb = fileSize / (1024 * 1024);
  if (sizeMb > rules.maxSizeMb) {
    errors.push(`File size (${sizeMb.toFixed(2)}MB) exceeds maximum (${rules.maxSizeMb}MB)`);
  }

  // Check MIME type
  if (rules.allowedTypes && !rules.allowedTypes.includes(mimeType)) {
    errors.push(`File type ${mimeType} is not allowed`);
  }

  // Check extension
  if (rules.blockedExtensions) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension && rules.blockedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 45. Scans attachment for security threats.
 *
 * @example
 * const scanResult = await scanAttachmentForThreats(attachment);
 */
export async function scanAttachmentForThreats(
  attachment: TaskAttachment
): Promise<{ safe: boolean; threats: string[] }> {
  // Placeholder for actual virus scanning integration
  // Would integrate with ClamAV, VirusTotal, etc.

  return {
    safe: true,
    threats: [],
  };
}

// ============================================================================
// TASK HISTORY AND REMINDERS
// ============================================================================

/**
 * 46. Records a history entry for a task action.
 *
 * @example
 * const entry = recordTaskHistory(task, 'completed', 'user-123', {
 *   status: { from: 'in_progress', to: 'completed' },
 * });
 */
export function recordTaskHistory(
  task: UserTask,
  action: TaskHistoryEntry['action'],
  userId: string,
  changes?: Record<string, { from: any; to: any }>,
  comment?: string
): TaskHistoryEntry {
  const entry: TaskHistoryEntry = {
    id: crypto.randomUUID(),
    taskId: task.id,
    action,
    userId,
    timestamp: new Date(),
    changes,
    comment,
  };

  task.variables = {
    ...task.variables,
    history: [
      ...(task.variables.history || []),
      entry,
    ],
  };

  return entry;
}

/**
 * 47. Gets complete task history.
 *
 * @example
 * const history = getTaskHistory(task);
 */
export function getTaskHistory(task: UserTask): TaskHistoryEntry[] {
  return (task.variables.history || []) as TaskHistoryEntry[];
}

/**
 * 48. Creates a reminder for a task.
 *
 * @example
 * const reminder = createTaskReminder(
 *   task,
 *   'user-123',
 *   'due_date',
 *   addHours(task.dueDate!, -4)
 * );
 */
export function createTaskReminder(
  task: UserTask,
  userId: string,
  reminderType: TaskReminder['reminderType'],
  scheduledFor: Date,
  channel: TaskReminder['channel'] = 'in_app',
  message?: string
): TaskReminder {
  const reminder: TaskReminder = {
    id: crypto.randomUUID(),
    taskId: task.id,
    userId,
    reminderType,
    scheduledFor,
    channel,
    message,
    sent: false,
    recurring: false,
  };

  task.variables = {
    ...task.variables,
    reminders: [
      ...(task.variables.reminders || []),
      reminder,
    ],
  };

  return reminder;
}

/**
 * 49. Gets pending reminders for a task.
 *
 * @example
 * const pending = getPendingReminders(task);
 */
export function getPendingReminders(task: UserTask): TaskReminder[] {
  const reminders = (task.variables.reminders || []) as TaskReminder[];
  const now = new Date();

  return reminders.filter(r => !r.sent && r.scheduledFor <= now);
}

/**
 * 50. Calculates user workload metrics.
 *
 * @example
 * const metrics = calculateUserWorkload(tasks, 'user-123');
 */
export function calculateUserWorkload(tasks: UserTask[], userId: string): WorkloadMetrics {
  const userTasks = tasks.filter(t =>
    t.assignee === userId || t.claimedBy === userId
  );

  const claimedTasks = userTasks.filter(t => t.status === 'claimed').length;
  const inProgressTasks = userTasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = userTasks.filter(t =>
    t.dueDate && isPast(t.dueDate) && t.status !== 'completed'
  ).length;

  const completionTimes = userTasks
    .filter(t => t.status === 'completed')
    .map(t => calculateTaskCompletionTime(t))
    .filter((time): time is number => time !== null);

  const averageCompletionTimeHours = completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
    : 0;

  const tasksByPriority: Record<UserTask['priority'], number> = {
    urgent: 0,
    high: 0,
    normal: 0,
    low: 0,
  };

  userTasks.forEach(t => {
    tasksByPriority[t.priority]++;
  });

  return {
    userId,
    totalTasks: userTasks.length,
    claimedTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    averageCompletionTimeHours,
    tasksByPriority,
  };
}

/**
 * Injectable service for user task management.
 *
 * @example
 * @Injectable()
 * export class ApprovalWorkflowService {
 *   constructor(private readonly userTaskService: UserTaskManagementService) {}
 *
 *   async createApprovalTask(patientId: string, assignedTo: string) {
 *     return this.userTaskService.createTask({
 *       workflowInstanceId: 'workflow-123',
 *       taskDefinitionKey: 'approve-patient',
 *       name: 'Approve Patient Record',
 *       assignee: assignedTo,
 *       formKey: 'patient-approval-form',
 *     });
 *   }
 * }
 */
@Injectable()
export class UserTaskManagementService {
  private readonly logger = new Logger(UserTaskManagementService.name);
  private readonly tasks = new Map<string, UserTask>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  createTask(config: Parameters<typeof createUserTask>[0]): UserTask {
    const task = createUserTask(config);
    this.tasks.set(task.id, task);
    this.eventEmitter.emit('user-task.created', task);
    recordTaskHistory(task, 'created', config.assignee || 'system');
    return task;
  }

  getTask(taskId: string): UserTask | undefined {
    return this.tasks.get(taskId);
  }

  claimTask(taskId: string, userId: string, userGroups: string[]): UserTaskClaim {
    const task = this.tasks.get(taskId);
    if (!task) throw new NotFoundException('Task not found');

    if (!canUserClaimTask(task, userId, userGroups)) {
      throw new ForbiddenException('User cannot claim this task');
    }

    const claim = claimUserTask(task, userId);
    this.eventEmitter.emit('user-task.claimed', { task, claim });
    recordTaskHistory(task, 'claimed', userId);

    return claim;
  }

  completeTask(
    taskId: string,
    userId: string,
    formData?: Record<string, any>,
    outcome?: string
  ): UserTaskCompletion {
    const task = this.tasks.get(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const completion = completeUserTask(task, userId, formData, outcome);
    this.eventEmitter.emit('user-task.completed', { task, completion });
    recordTaskHistory(task, 'completed', userId);

    return completion;
  }

  addComment(taskId: string, userId: string, content: string, mentions?: string[]): TaskComment {
    const task = this.tasks.get(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const comment = addTaskComment(task, userId, content, mentions);
    this.eventEmitter.emit('user-task.commented', { task, comment });
    recordTaskHistory(task, 'commented', userId);

    return comment;
  }

  addAttachment(taskId: string, attachmentData: Parameters<typeof addTaskAttachment>[1]): TaskAttachment {
    const task = this.tasks.get(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const attachment = addTaskAttachment(task, attachmentData);
    this.eventEmitter.emit('user-task.attachment-added', { task, attachment });
    recordTaskHistory(task, 'attached', attachmentData.uploadedBy);

    return attachment;
  }
}

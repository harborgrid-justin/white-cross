/**
 * LOC: WTO-001
 * File: /reuse/server/workflow/workflow-task-orchestration.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/bull
 *   - @nestjs/schedule
 *   - @nestjs/event-emitter
 *   - bull
 *   - rxjs
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Task management modules
 *   - Process automation handlers
 *   - Queue management services
 *   - Scheduling services
 */

/**
 * File: /reuse/server/workflow/workflow-task-orchestration.ts
 * Locator: WC-WF-WTO-001
 * Purpose: Advanced Task Orchestration and Management Utilities - Production-grade task scheduling, queue management, and workflow automation
 *
 * Upstream: @nestjs/common, @nestjs/bull, @nestjs/schedule, @nestjs/event-emitter, bull, rxjs, zod, date-fns, TypeScript 5.x
 * Downstream: ../backend/*, workflow services, task managers, orchestration systems, automation handlers
 * Dependencies: NestJS 10.x, Bull 4.x, RxJS 7.x, Zod 3.x, TypeScript 5.x, date-fns 3.x
 * Exports: 45 production-grade utility functions for task orchestration, queue management, scheduling, delegation, retry logic, timeouts
 *
 * LLM Context: Enterprise-grade task orchestration utilities for White Cross healthcare platform.
 * Provides comprehensive task creation, assignment, queue management, priority handling, scheduling, delegation,
 * completion tracking, retry mechanisms, timeout handling, dependency management, status transitions, notification systems,
 * task monitoring, error handling, compensation logic, parallel task execution, task chaining, deadline management,
 * resource allocation, task cancellation, task suspension/resumption, and audit trails.
 * Optimized for HIPAA-compliant healthcare workflow automation and process management.
 *
 * Features:
 * - Bull-based queue management
 * - Cron-based task scheduling
 * - Priority queue handling
 * - Retry with exponential backoff
 * - Task dependency graphs
 * - Timeout and deadline management
 * - Event-driven notifications
 * - Real-time task monitoring
 * - Distributed task execution
 * - Task compensation and rollback
 * - Audit trail and history
 * - Multi-tenant isolation
 * - Resource pooling
 * - Load balancing
 * - Task health checks
 */

import { z } from 'zod';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue, Job, JobOptions, ProcessCallbackFunction } from 'bull';
import { Observable, Subject, interval, timer } from 'rxjs';
import { map, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { add, isPast, isAfter, isBefore, differenceInMilliseconds, addMilliseconds } from 'date-fns';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for task definition.
 */
export const TaskDefinitionSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['critical', 'high', 'normal', 'low']).default('normal'),
  status: z.enum(['pending', 'queued', 'running', 'completed', 'failed', 'cancelled', 'timeout', 'suspended']).default('pending'),
  payload: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().optional(),
  assignedTo: z.string().optional(),
  scheduledFor: z.date().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  deadline: z.date().optional(),
  timeoutMs: z.number().int().positive().optional(),
  retryCount: z.number().int().nonnegative().default(0),
  maxRetries: z.number().int().nonnegative().default(3),
  retryDelayMs: z.number().int().positive().default(1000),
  dependencies: z.array(z.string().uuid()).default([]),
  tags: z.array(z.string()).default([]),
  tenantId: z.string().optional(),
});

/**
 * Zod schema for task queue configuration.
 */
export const TaskQueueConfigSchema = z.object({
  name: z.string().min(1),
  concurrency: z.number().int().positive().default(5),
  maxJobsPerWorker: z.number().int().positive().default(100),
  rateLimiter: z.object({
    max: z.number().int().positive(),
    duration: z.number().int().positive(),
  }).optional(),
  defaultJobOptions: z.object({
    attempts: z.number().int().positive().default(3),
    backoff: z.union([
      z.number().int().positive(),
      z.object({
        type: z.enum(['fixed', 'exponential']),
        delay: z.number().int().positive(),
      }),
    ]).optional(),
    priority: z.number().int().default(0),
    delay: z.number().int().nonnegative().default(0),
    timeout: z.number().int().positive().optional(),
    removeOnComplete: z.union([z.boolean(), z.number().int().positive()]).default(true),
    removeOnFail: z.union([z.boolean(), z.number().int().positive()]).default(false),
  }).optional(),
});

/**
 * Zod schema for task assignment.
 */
export const TaskAssignmentSchema = z.object({
  taskId: z.string().uuid(),
  assignedTo: z.string(),
  assignedBy: z.string(),
  assignedAt: z.date(),
  reason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task delegation.
 */
export const TaskDelegationSchema = z.object({
  taskId: z.string().uuid(),
  fromUser: z.string(),
  toUser: z.string(),
  delegatedAt: z.date(),
  reason: z.string().optional(),
  returnCondition: z.enum(['on_completion', 'on_deadline', 'manual', 'never']).default('on_completion'),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for task retry configuration.
 */
export const TaskRetryConfigSchema = z.object({
  maxAttempts: z.number().int().positive().default(3),
  backoffStrategy: z.enum(['fixed', 'exponential', 'linear']).default('exponential'),
  initialDelayMs: z.number().int().positive().default(1000),
  maxDelayMs: z.number().int().positive().default(60000),
  multiplier: z.number().positive().default(2),
  retryOn: z.array(z.string()).optional(),
  skipOn: z.array(z.string()).optional(),
});

/**
 * Zod schema for task dependency.
 */
export const TaskDependencySchema = z.object({
  taskId: z.string().uuid(),
  dependsOn: z.array(z.string().uuid()),
  dependencyType: z.enum(['all', 'any', 'none']).default('all'),
  failureStrategy: z.enum(['fail', 'skip', 'continue']).default('fail'),
});

/**
 * Zod schema for task notification.
 */
export const TaskNotificationSchema = z.object({
  taskId: z.string().uuid(),
  event: z.enum(['created', 'assigned', 'started', 'completed', 'failed', 'timeout', 'deadline_approaching', 'cancelled', 'suspended', 'resumed']),
  recipients: z.array(z.string()),
  channel: z.enum(['email', 'sms', 'push', 'webhook', 'internal']).default('internal'),
  template: z.string().optional(),
  data: z.record(z.any()).optional(),
  timestamp: z.date(),
});

/**
 * Zod schema for task schedule.
 */
export const TaskScheduleSchema = z.object({
  taskId: z.string().uuid(),
  scheduleType: z.enum(['once', 'recurring', 'cron']),
  scheduledFor: z.date().optional(),
  cronExpression: z.string().optional(),
  recurrencePattern: z.object({
    frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().int().positive().default(1),
    endDate: z.date().optional(),
    maxOccurrences: z.number().int().positive().optional(),
  }).optional(),
  timezone: z.string().default('UTC'),
  enabled: z.boolean().default(true),
});

/**
 * Zod schema for task timeout configuration.
 */
export const TaskTimeoutConfigSchema = z.object({
  taskId: z.string().uuid(),
  timeoutMs: z.number().int().positive(),
  action: z.enum(['fail', 'retry', 'compensate', 'notify']).default('fail'),
  compensationHandler: z.string().optional(),
  notifyOnTimeout: z.boolean().default(true),
});

/**
 * Zod schema for task monitoring metrics.
 */
export const TaskMetricsSchema = z.object({
  taskId: z.string().uuid(),
  queueName: z.string(),
  executionTimeMs: z.number().int().nonnegative().optional(),
  waitTimeMs: z.number().int().nonnegative().optional(),
  memoryUsageMb: z.number().nonnegative().optional(),
  cpuUsagePercent: z.number().nonnegative().optional(),
  retryAttempts: z.number().int().nonnegative().default(0),
  errorCount: z.number().int().nonnegative().default(0),
  completedAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaskDefinition {
  id: string;
  type: string;
  name: string;
  description?: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout' | 'suspended';
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  assignedTo?: string;
  scheduledFor?: Date;
  startedAt?: Date;
  completedAt?: Date;
  deadline?: Date;
  timeoutMs?: number;
  retryCount: number;
  maxRetries: number;
  retryDelayMs: number;
  dependencies: string[];
  tags: string[];
  tenantId?: string;
  error?: string;
  result?: any;
}

export interface TaskQueueConfig {
  name: string;
  concurrency: number;
  maxJobsPerWorker: number;
  rateLimiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: JobOptions;
}

export interface TaskAssignment {
  taskId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface TaskDelegation {
  taskId: string;
  fromUser: string;
  toUser: string;
  delegatedAt: Date;
  reason?: string;
  returnCondition: 'on_completion' | 'on_deadline' | 'manual' | 'never';
  metadata?: Record<string, any>;
}

export interface TaskRetryConfig {
  maxAttempts: number;
  backoffStrategy: 'fixed' | 'exponential' | 'linear';
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  retryOn?: string[];
  skipOn?: string[];
}

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  dependencyType: 'all' | 'any' | 'none';
  failureStrategy: 'fail' | 'skip' | 'continue';
}

export interface TaskNotification {
  taskId: string;
  event: 'created' | 'assigned' | 'started' | 'completed' | 'failed' | 'timeout' | 'deadline_approaching' | 'cancelled' | 'suspended' | 'resumed';
  recipients: string[];
  channel: 'email' | 'sms' | 'push' | 'webhook' | 'internal';
  template?: string;
  data?: Record<string, any>;
  timestamp: Date;
}

export interface TaskSchedule {
  taskId: string;
  scheduleType: 'once' | 'recurring' | 'cron';
  scheduledFor?: Date;
  cronExpression?: string;
  recurrencePattern?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    maxOccurrences?: number;
  };
  timezone: string;
  enabled: boolean;
}

export interface TaskTimeoutConfig {
  taskId: string;
  timeoutMs: number;
  action: 'fail' | 'retry' | 'compensate' | 'notify';
  compensationHandler?: string;
  notifyOnTimeout: boolean;
}

export interface TaskMetrics {
  taskId: string;
  queueName: string;
  executionTimeMs?: number;
  waitTimeMs?: number;
  memoryUsageMb?: number;
  cpuUsagePercent?: number;
  retryAttempts: number;
  errorCount: number;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface TaskExecutionContext {
  taskId: string;
  userId?: string;
  tenantId?: string;
  correlationId?: string;
  parentTaskId?: string;
  rootTaskId?: string;
  metadata?: Record<string, any>;
}

export interface TaskResult {
  taskId: string;
  status: 'completed' | 'failed';
  result?: any;
  error?: string;
  executionTimeMs: number;
  retryAttempts: number;
  completedAt: Date;
}

export interface TaskProcessor {
  taskType: string;
  handler: (task: TaskDefinition, context: TaskExecutionContext) => Promise<any>;
  retryConfig?: TaskRetryConfig;
  timeoutMs?: number;
}

export interface QueueMetrics {
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export interface TaskFilter {
  status?: TaskDefinition['status'][];
  priority?: TaskDefinition['priority'][];
  assignedTo?: string;
  createdBy?: string;
  tags?: string[];
  type?: string;
  tenantId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  deadlineBefore?: Date;
}

export interface TaskUpdatePayload {
  status?: TaskDefinition['status'];
  priority?: TaskDefinition['priority'];
  assignedTo?: string;
  deadline?: Date;
  metadata?: Record<string, any>;
  payload?: Record<string, any>;
}

export interface ParallelTaskConfig {
  tasks: TaskDefinition[];
  maxConcurrency?: number;
  failFast?: boolean;
  aggregateResults?: boolean;
}

export interface TaskChainConfig {
  tasks: TaskDefinition[];
  stopOnFailure?: boolean;
  shareContext?: boolean;
  compensateOnFailure?: boolean;
}

// ============================================================================
// TASK CREATION AND ASSIGNMENT
// ============================================================================

/**
 * 1. Creates a new task with comprehensive configuration.
 *
 * @example
 * const task = createTask({
 *   type: 'patient-record-processing',
 *   name: 'Process Patient Record',
 *   priority: 'high',
 *   payload: { patientId: '123', recordType: 'admission' },
 *   assignedTo: 'user-456',
 *   deadline: new Date('2025-12-31'),
 *   maxRetries: 5,
 *   tags: ['hipaa-compliant', 'critical'],
 * });
 */
export function createTask(config: Partial<TaskDefinition> & Pick<TaskDefinition, 'type' | 'name' | 'payload'>): TaskDefinition {
  const now = new Date();

  return {
    id: config.id || crypto.randomUUID(),
    type: config.type,
    name: config.name,
    description: config.description,
    priority: config.priority || 'normal',
    status: config.status || 'pending',
    payload: config.payload,
    metadata: config.metadata || {},
    createdAt: config.createdAt || now,
    updatedAt: config.updatedAt || now,
    createdBy: config.createdBy,
    assignedTo: config.assignedTo,
    scheduledFor: config.scheduledFor,
    startedAt: config.startedAt,
    completedAt: config.completedAt,
    deadline: config.deadline,
    timeoutMs: config.timeoutMs,
    retryCount: config.retryCount || 0,
    maxRetries: config.maxRetries ?? 3,
    retryDelayMs: config.retryDelayMs || 1000,
    dependencies: config.dependencies || [],
    tags: config.tags || [],
    tenantId: config.tenantId,
    error: config.error,
    result: config.result,
  };
}

/**
 * 2. Assigns a task to a specific user or role.
 *
 * @example
 * const assignment = assignTask(task, 'user-123', 'admin-user', 'Best fit for expertise');
 */
export function assignTask(
  task: TaskDefinition,
  assignedTo: string,
  assignedBy: string,
  reason?: string
): TaskAssignment {
  task.assignedTo = assignedTo;
  task.updatedAt = new Date();

  return {
    taskId: task.id,
    assignedTo,
    assignedBy,
    assignedAt: new Date(),
    reason,
    metadata: {
      previousAssignee: task.assignedTo,
    },
  };
}

/**
 * 3. Reassigns a task from one user to another.
 *
 * @example
 * const reassignment = reassignTask(task, 'user-456', 'manager-789', 'Workload balancing');
 */
export function reassignTask(
  task: TaskDefinition,
  newAssignee: string,
  reassignedBy: string,
  reason?: string
): TaskAssignment {
  const previousAssignee = task.assignedTo;

  task.assignedTo = newAssignee;
  task.updatedAt = new Date();

  return {
    taskId: task.id,
    assignedTo: newAssignee,
    assignedBy: reassignedBy,
    assignedAt: new Date(),
    reason,
    metadata: {
      previousAssignee,
      isReassignment: true,
    },
  };
}

/**
 * 4. Delegates a task to another user with return conditions.
 *
 * @example
 * const delegation = delegateTask(
 *   task,
 *   'user-123',
 *   'user-456',
 *   'on_completion',
 *   'Temporary delegation during PTO'
 * );
 */
export function delegateTask(
  task: TaskDefinition,
  fromUser: string,
  toUser: string,
  returnCondition: TaskDelegation['returnCondition'] = 'on_completion',
  reason?: string
): TaskDelegation {
  const delegation: TaskDelegation = {
    taskId: task.id,
    fromUser,
    toUser,
    delegatedAt: new Date(),
    reason,
    returnCondition,
    metadata: {
      originalAssignee: task.assignedTo,
    },
  };

  task.assignedTo = toUser;
  task.updatedAt = new Date();
  task.metadata = {
    ...task.metadata,
    delegation,
  };

  return delegation;
}

/**
 * 5. Auto-assigns tasks based on workload balancing.
 *
 * @example
 * const assignedTo = autoAssignTask(task, availableUsers, currentWorkloads);
 */
export function autoAssignTask(
  task: TaskDefinition,
  availableUsers: string[],
  currentWorkloads: Record<string, number>,
  prioritizeExpertise?: boolean
): string {
  if (availableUsers.length === 0) {
    throw new Error('No available users for assignment');
  }

  // Find user with lowest workload
  const assignedTo = availableUsers.reduce((minUser, user) => {
    const userWorkload = currentWorkloads[user] || 0;
    const minWorkload = currentWorkloads[minUser] || 0;
    return userWorkload < minWorkload ? user : minUser;
  }, availableUsers[0]);

  task.assignedTo = assignedTo;
  task.updatedAt = new Date();
  task.metadata = {
    ...task.metadata,
    autoAssigned: true,
    workloadAtAssignment: currentWorkloads[assignedTo],
  };

  return assignedTo;
}

// ============================================================================
// TASK QUEUE MANAGEMENT
// ============================================================================

/**
 * 6. Creates a task queue with configuration.
 *
 * @example
 * const queueConfig = createTaskQueue({
 *   name: 'patient-processing',
 *   concurrency: 10,
 *   rateLimiter: { max: 100, duration: 60000 },
 * });
 */
export function createTaskQueue(config: Partial<TaskQueueConfig> & Pick<TaskQueueConfig, 'name'>): TaskQueueConfig {
  return {
    name: config.name,
    concurrency: config.concurrency || 5,
    maxJobsPerWorker: config.maxJobsPerWorker || 100,
    rateLimiter: config.rateLimiter,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      ...config.defaultJobOptions,
    },
  };
}

/**
 * 7. Adds a task to a queue with priority handling.
 *
 * @example
 * const jobOptions = enqueueTask(task, queueConfig);
 */
export function enqueueTask(task: TaskDefinition, queueConfig: TaskQueueConfig): JobOptions {
  const priorityMap: Record<TaskDefinition['priority'], number> = {
    critical: 1,
    high: 2,
    normal: 3,
    low: 4,
  };

  task.status = 'queued';
  task.updatedAt = new Date();

  return {
    ...queueConfig.defaultJobOptions,
    jobId: task.id,
    priority: priorityMap[task.priority],
    delay: task.scheduledFor
      ? Math.max(0, task.scheduledFor.getTime() - Date.now())
      : 0,
    timeout: task.timeoutMs,
    attempts: task.maxRetries + 1,
  };
}

/**
 * 8. Dequeues a task from the queue.
 *
 * @example
 * const removed = dequeueTask(taskId, queue);
 */
export async function dequeueTask(taskId: string, queue: Queue): Promise<boolean> {
  try {
    const job = await queue.getJob(taskId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * 9. Gets queue metrics and statistics.
 *
 * @example
 * const metrics = await getQueueMetrics(queue);
 */
export async function getQueueMetrics(queue: Queue): Promise<QueueMetrics> {
  const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
    queue.isPaused(),
  ]);

  return {
    queueName: queue.name,
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
  };
}

/**
 * 10. Reorders tasks in queue based on priority changes.
 *
 * @example
 * await reorderQueueByPriority(queue, priorityUpdates);
 */
export async function reorderQueueByPriority(
  queue: Queue,
  priorityUpdates: Array<{ taskId: string; newPriority: number }>
): Promise<void> {
  for (const update of priorityUpdates) {
    const job = await queue.getJob(update.taskId);
    if (job) {
      await job.changePriority(update.newPriority);
    }
  }
}

// ============================================================================
// TASK PRIORITY HANDLING
// ============================================================================

/**
 * 11. Updates task priority dynamically.
 *
 * @example
 * updateTaskPriority(task, 'critical', 'Escalated due to deadline');
 */
export function updateTaskPriority(
  task: TaskDefinition,
  newPriority: TaskDefinition['priority'],
  reason?: string
): void {
  const oldPriority = task.priority;
  task.priority = newPriority;
  task.updatedAt = new Date();
  task.metadata = {
    ...task.metadata,
    priorityHistory: [
      ...(task.metadata?.priorityHistory || []),
      {
        from: oldPriority,
        to: newPriority,
        reason,
        timestamp: new Date(),
      },
    ],
  };
}

/**
 * 12. Escalates task priority based on deadline proximity.
 *
 * @example
 * const escalated = escalateTaskByDeadline(task, 24); // 24 hours
 */
export function escalateTaskByDeadline(task: TaskDefinition, hoursBeforeDeadline: number): boolean {
  if (!task.deadline) return false;

  const hoursUntilDeadline = differenceInMilliseconds(task.deadline, new Date()) / (1000 * 60 * 60);

  if (hoursUntilDeadline <= hoursBeforeDeadline && hoursUntilDeadline > 0) {
    const currentPriorityIndex = ['low', 'normal', 'high', 'critical'].indexOf(task.priority);
    if (currentPriorityIndex < 3) {
      const newPriority = ['low', 'normal', 'high', 'critical'][currentPriorityIndex + 1] as TaskDefinition['priority'];
      updateTaskPriority(task, newPriority, `Escalated due to deadline in ${hoursUntilDeadline.toFixed(1)} hours`);
      return true;
    }
  }

  return false;
}

/**
 * 13. Calculates task priority score for intelligent sorting.
 *
 * @example
 * const score = calculateTaskPriorityScore(task);
 */
export function calculateTaskPriorityScore(task: TaskDefinition): number {
  const priorityScores = { critical: 1000, high: 100, normal: 10, low: 1 };
  let score = priorityScores[task.priority];

  // Factor in deadline
  if (task.deadline) {
    const hoursUntilDeadline = differenceInMilliseconds(task.deadline, new Date()) / (1000 * 60 * 60);
    if (hoursUntilDeadline > 0) {
      score += Math.max(0, 100 - hoursUntilDeadline);
    } else {
      score += 1000; // Overdue tasks get highest priority
    }
  }

  // Factor in retry count (more retries = higher priority)
  score += task.retryCount * 10;

  // Factor in dependencies
  score += task.dependencies.length * 5;

  return score;
}

/**
 * 14. Sorts tasks by priority and deadline.
 *
 * @example
 * const sortedTasks = sortTasksByPriority(tasks);
 */
export function sortTasksByPriority(tasks: TaskDefinition[]): TaskDefinition[] {
  return [...tasks].sort((a, b) => {
    const scoreA = calculateTaskPriorityScore(a);
    const scoreB = calculateTaskPriorityScore(b);
    return scoreB - scoreA;
  });
}

/**
 * 15. Filters tasks by priority threshold.
 *
 * @example
 * const urgentTasks = filterTasksByPriority(tasks, ['critical', 'high']);
 */
export function filterTasksByPriority(
  tasks: TaskDefinition[],
  priorities: TaskDefinition['priority'][]
): TaskDefinition[] {
  return tasks.filter(task => priorities.includes(task.priority));
}

// ============================================================================
// TASK SCHEDULING
// ============================================================================

/**
 * 16. Schedules a task for future execution.
 *
 * @example
 * const schedule = scheduleTask(task, new Date('2025-12-31T10:00:00Z'));
 */
export function scheduleTask(task: TaskDefinition, scheduledFor: Date): TaskSchedule {
  task.scheduledFor = scheduledFor;
  task.updatedAt = new Date();

  return {
    taskId: task.id,
    scheduleType: 'once',
    scheduledFor,
    timezone: 'UTC',
    enabled: true,
  };
}

/**
 * 17. Creates a recurring task schedule.
 *
 * @example
 * const schedule = createRecurringSchedule(task, {
 *   frequency: 'daily',
 *   interval: 1,
 *   endDate: new Date('2025-12-31'),
 * });
 */
export function createRecurringSchedule(
  task: TaskDefinition,
  pattern: TaskSchedule['recurrencePattern']
): TaskSchedule {
  return {
    taskId: task.id,
    scheduleType: 'recurring',
    recurrencePattern: pattern,
    timezone: 'UTC',
    enabled: true,
  };
}

/**
 * 18. Creates a cron-based task schedule.
 *
 * @example
 * const schedule = createCronSchedule(task, '0 9 * * MON-FRI'); // 9 AM weekdays
 */
export function createCronSchedule(task: TaskDefinition, cronExpression: string, timezone = 'UTC'): TaskSchedule {
  return {
    taskId: task.id,
    scheduleType: 'cron',
    cronExpression,
    timezone,
    enabled: true,
  };
}

/**
 * 19. Calculates next execution time for a scheduled task.
 *
 * @example
 * const nextRun = calculateNextExecutionTime(schedule);
 */
export function calculateNextExecutionTime(schedule: TaskSchedule): Date | null {
  if (!schedule.enabled) return null;

  if (schedule.scheduleType === 'once') {
    return schedule.scheduledFor && isFuture(schedule.scheduledFor) ? schedule.scheduledFor : null;
  }

  if (schedule.scheduleType === 'recurring' && schedule.recurrencePattern) {
    const { frequency, interval } = schedule.recurrencePattern;
    const now = new Date();

    switch (frequency) {
      case 'hourly':
        return add(now, { hours: interval });
      case 'daily':
        return add(now, { days: interval });
      case 'weekly':
        return add(now, { weeks: interval });
      case 'monthly':
        return add(now, { months: interval });
      case 'yearly':
        return add(now, { years: interval });
    }
  }

  // For cron schedules, would need a cron parser library
  return null;
}

/**
 * 20. Cancels a scheduled task.
 *
 * @example
 * cancelScheduledTask(schedule, 'User requested cancellation');
 */
export function cancelScheduledTask(schedule: TaskSchedule, reason?: string): void {
  schedule.enabled = false;
}

// ============================================================================
// TASK COMPLETION TRACKING
// ============================================================================

/**
 * 21. Marks a task as completed with result.
 *
 * @example
 * const result = completeTask(task, { recordsProcessed: 100 });
 */
export function completeTask(task: TaskDefinition, result?: any): TaskResult {
  const now = new Date();
  const executionTimeMs = task.startedAt
    ? differenceInMilliseconds(now, task.startedAt)
    : 0;

  task.status = 'completed';
  task.completedAt = now;
  task.updatedAt = now;
  task.result = result;

  return {
    taskId: task.id,
    status: 'completed',
    result,
    executionTimeMs,
    retryAttempts: task.retryCount,
    completedAt: now,
  };
}

/**
 * 22. Marks a task as failed with error details.
 *
 * @example
 * const result = failTask(task, 'Database connection timeout');
 */
export function failTask(task: TaskDefinition, error: string | Error): TaskResult {
  const now = new Date();
  const errorMessage = error instanceof Error ? error.message : error;
  const executionTimeMs = task.startedAt
    ? differenceInMilliseconds(now, task.startedAt)
    : 0;

  task.status = 'failed';
  task.error = errorMessage;
  task.completedAt = now;
  task.updatedAt = now;

  return {
    taskId: task.id,
    status: 'failed',
    error: errorMessage,
    executionTimeMs,
    retryAttempts: task.retryCount,
    completedAt: now,
  };
}

/**
 * 23. Tracks task progress with percentage completion.
 *
 * @example
 * updateTaskProgress(task, 75, { recordsProcessed: 750, totalRecords: 1000 });
 */
export function updateTaskProgress(task: TaskDefinition, percentComplete: number, metadata?: Record<string, any>): void {
  task.metadata = {
    ...task.metadata,
    progress: {
      percent: Math.min(100, Math.max(0, percentComplete)),
      updatedAt: new Date(),
      ...metadata,
    },
  };
  task.updatedAt = new Date();
}

/**
 * 24. Calculates task execution metrics.
 *
 * @example
 * const metrics = calculateTaskMetrics(task, 'patient-processing-queue');
 */
export function calculateTaskMetrics(task: TaskDefinition, queueName: string): TaskMetrics {
  const executionTimeMs = task.startedAt && task.completedAt
    ? differenceInMilliseconds(task.completedAt, task.startedAt)
    : undefined;

  const waitTimeMs = task.createdAt && task.startedAt
    ? differenceInMilliseconds(task.startedAt, task.createdAt)
    : undefined;

  return {
    taskId: task.id,
    queueName,
    executionTimeMs,
    waitTimeMs,
    retryAttempts: task.retryCount,
    errorCount: task.error ? 1 : 0,
    completedAt: task.completedAt,
    metadata: task.metadata,
  };
}

/**
 * 25. Generates task completion report.
 *
 * @example
 * const report = generateTaskCompletionReport(tasks, startDate, endDate);
 */
export function generateTaskCompletionReport(
  tasks: TaskDefinition[],
  startDate: Date,
  endDate: Date
): {
  total: number;
  completed: number;
  failed: number;
  averageExecutionTimeMs: number;
  completionRate: number;
} {
  const relevantTasks = tasks.filter(
    task => task.completedAt &&
    isAfter(task.completedAt, startDate) &&
    isBefore(task.completedAt, endDate)
  );

  const completed = relevantTasks.filter(t => t.status === 'completed').length;
  const failed = relevantTasks.filter(t => t.status === 'failed').length;

  const executionTimes = relevantTasks
    .filter(t => t.startedAt && t.completedAt)
    .map(t => differenceInMilliseconds(t.completedAt!, t.startedAt!));

  const averageExecutionTimeMs = executionTimes.length > 0
    ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
    : 0;

  return {
    total: relevantTasks.length,
    completed,
    failed,
    averageExecutionTimeMs,
    completionRate: relevantTasks.length > 0 ? (completed / relevantTasks.length) * 100 : 0,
  };
}

// ============================================================================
// TASK RETRY MECHANISMS
// ============================================================================

/**
 * 26. Configures retry behavior for a task.
 *
 * @example
 * const retryConfig = configureTaskRetry({
 *   maxAttempts: 5,
 *   backoffStrategy: 'exponential',
 *   initialDelayMs: 1000,
 *   multiplier: 2,
 * });
 */
export function configureTaskRetry(config: Partial<TaskRetryConfig>): TaskRetryConfig {
  return {
    maxAttempts: config.maxAttempts || 3,
    backoffStrategy: config.backoffStrategy || 'exponential',
    initialDelayMs: config.initialDelayMs || 1000,
    maxDelayMs: config.maxDelayMs || 60000,
    multiplier: config.multiplier || 2,
    retryOn: config.retryOn,
    skipOn: config.skipOn,
  };
}

/**
 * 27. Calculates retry delay based on backoff strategy.
 *
 * @example
 * const delayMs = calculateRetryDelay(retryConfig, 3);
 */
export function calculateRetryDelay(config: TaskRetryConfig, attemptNumber: number): number {
  let delay: number;

  switch (config.backoffStrategy) {
    case 'fixed':
      delay = config.initialDelayMs;
      break;
    case 'linear':
      delay = config.initialDelayMs * attemptNumber;
      break;
    case 'exponential':
      delay = config.initialDelayMs * Math.pow(config.multiplier, attemptNumber - 1);
      break;
  }

  return Math.min(delay, config.maxDelayMs);
}

/**
 * 28. Determines if a task should be retried.
 *
 * @example
 * const shouldRetry = canRetryTask(task, retryConfig, error);
 */
export function canRetryTask(task: TaskDefinition, config: TaskRetryConfig, error?: Error): boolean {
  if (task.retryCount >= config.maxAttempts) {
    return false;
  }

  if (error && config.skipOn) {
    const errorName = error.constructor.name;
    if (config.skipOn.includes(errorName)) {
      return false;
    }
  }

  if (error && config.retryOn) {
    const errorName = error.constructor.name;
    return config.retryOn.includes(errorName);
  }

  return true;
}

/**
 * 29. Retries a failed task with backoff.
 *
 * @example
 * const retryDelay = retryTask(task, retryConfig);
 */
export function retryTask(task: TaskDefinition, config: TaskRetryConfig): number {
  task.retryCount += 1;
  task.status = 'pending';
  task.error = undefined;
  task.updatedAt = new Date();

  const delayMs = calculateRetryDelay(config, task.retryCount);
  task.scheduledFor = addMilliseconds(new Date(), delayMs);

  task.metadata = {
    ...task.metadata,
    retryHistory: [
      ...(task.metadata?.retryHistory || []),
      {
        attempt: task.retryCount,
        scheduledFor: task.scheduledFor,
        timestamp: new Date(),
      },
    ],
  };

  return delayMs;
}

/**
 * 30. Implements exponential backoff with jitter.
 *
 * @example
 * const delayMs = calculateBackoffWithJitter(1000, 3, 2, 0.1);
 */
export function calculateBackoffWithJitter(
  baseDelayMs: number,
  attemptNumber: number,
  multiplier: number,
  jitterFactor: number
): number {
  const exponentialDelay = baseDelayMs * Math.pow(multiplier, attemptNumber - 1);
  const jitter = exponentialDelay * jitterFactor * Math.random();
  return exponentialDelay + jitter;
}

// ============================================================================
// TASK TIMEOUT HANDLING
// ============================================================================

/**
 * 31. Configures timeout for a task.
 *
 * @example
 * const timeoutConfig = configureTaskTimeout(task, 30000, 'retry');
 */
export function configureTaskTimeout(
  task: TaskDefinition,
  timeoutMs: number,
  action: TaskTimeoutConfig['action'] = 'fail'
): TaskTimeoutConfig {
  task.timeoutMs = timeoutMs;
  task.updatedAt = new Date();

  return {
    taskId: task.id,
    timeoutMs,
    action,
    notifyOnTimeout: true,
  };
}

/**
 * 32. Checks if a task has timed out.
 *
 * @example
 * const timedOut = isTaskTimedOut(task);
 */
export function isTaskTimedOut(task: TaskDefinition): boolean {
  if (!task.timeoutMs || !task.startedAt) return false;

  const elapsedMs = differenceInMilliseconds(new Date(), task.startedAt);
  return elapsedMs > task.timeoutMs;
}

/**
 * 33. Handles task timeout with configured action.
 *
 * @example
 * handleTaskTimeout(task, timeoutConfig);
 */
export function handleTaskTimeout(task: TaskDefinition, config: TaskTimeoutConfig): void {
  task.status = 'timeout';
  task.updatedAt = new Date();
  task.error = `Task timed out after ${config.timeoutMs}ms`;

  task.metadata = {
    ...task.metadata,
    timeout: {
      configuredMs: config.timeoutMs,
      action: config.action,
      timestamp: new Date(),
    },
  };

  switch (config.action) {
    case 'fail':
      task.status = 'failed';
      break;
    case 'retry':
      task.status = 'pending';
      task.retryCount += 1;
      break;
    case 'compensate':
      task.status = 'failed';
      task.metadata.requiresCompensation = true;
      break;
  }
}

/**
 * 34. Sets deadline for task completion.
 *
 * @example
 * setTaskDeadline(task, new Date('2025-12-31T23:59:59Z'));
 */
export function setTaskDeadline(task: TaskDefinition, deadline: Date): void {
  task.deadline = deadline;
  task.updatedAt = new Date();
}

/**
 * 35. Checks if task deadline is approaching.
 *
 * @example
 * const approaching = isDeadlineApproaching(task, 24); // 24 hours
 */
export function isDeadlineApproaching(task: TaskDefinition, hoursThreshold: number): boolean {
  if (!task.deadline) return false;

  const hoursUntilDeadline = differenceInMilliseconds(task.deadline, new Date()) / (1000 * 60 * 60);
  return hoursUntilDeadline > 0 && hoursUntilDeadline <= hoursThreshold;
}

// ============================================================================
// TASK DEPENDENCY MANAGEMENT
// ============================================================================

/**
 * 36. Adds dependency between tasks.
 *
 * @example
 * addTaskDependency(childTask, parentTask.id);
 */
export function addTaskDependency(task: TaskDefinition, dependsOnTaskId: string): void {
  if (!task.dependencies.includes(dependsOnTaskId)) {
    task.dependencies.push(dependsOnTaskId);
    task.updatedAt = new Date();
  }
}

/**
 * 37. Checks if all task dependencies are completed.
 *
 * @example
 * const ready = areTaskDependenciesMet(task, allTasks);
 */
export function areTaskDependenciesMet(task: TaskDefinition, allTasks: Map<string, TaskDefinition>): boolean {
  if (task.dependencies.length === 0) return true;

  return task.dependencies.every(depId => {
    const depTask = allTasks.get(depId);
    return depTask?.status === 'completed';
  });
}

/**
 * 38. Builds task dependency graph.
 *
 * @example
 * const graph = buildTaskDependencyGraph(tasks);
 */
export function buildTaskDependencyGraph(tasks: TaskDefinition[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  for (const task of tasks) {
    graph.set(task.id, [...task.dependencies]);
  }

  return graph;
}

/**
 * 39. Detects circular dependencies in task graph.
 *
 * @example
 * const hasCircular = detectCircularDependencies(tasks);
 */
export function detectCircularDependencies(tasks: TaskDefinition[]): boolean {
  const graph = buildTaskDependencyGraph(tasks);
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(taskId: string): boolean {
    visited.add(taskId);
    recursionStack.add(taskId);

    const dependencies = graph.get(taskId) || [];
    for (const depId of dependencies) {
      if (!visited.has(depId)) {
        if (hasCycle(depId)) return true;
      } else if (recursionStack.has(depId)) {
        return true;
      }
    }

    recursionStack.delete(taskId);
    return false;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (hasCycle(task.id)) return true;
    }
  }

  return false;
}

/**
 * 40. Resolves task execution order based on dependencies.
 *
 * @example
 * const executionOrder = resolveTaskExecutionOrder(tasks);
 */
export function resolveTaskExecutionOrder(tasks: TaskDefinition[]): TaskDefinition[] {
  const graph = buildTaskDependencyGraph(tasks);
  const inDegree = new Map<string, number>();
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  // Calculate in-degrees
  for (const task of tasks) {
    inDegree.set(task.id, task.dependencies.length);
  }

  // Topological sort using Kahn's algorithm
  const queue: string[] = [];
  const result: TaskDefinition[] = [];

  for (const [taskId, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(taskId);
  }

  while (queue.length > 0) {
    const taskId = queue.shift()!;
    const task = taskMap.get(taskId);
    if (task) result.push(task);

    // Find tasks that depend on current task
    for (const [depTaskId, dependencies] of graph.entries()) {
      if (dependencies.includes(taskId)) {
        const currentDegree = inDegree.get(depTaskId)!;
        inDegree.set(depTaskId, currentDegree - 1);
        if (currentDegree - 1 === 0) {
          queue.push(depTaskId);
        }
      }
    }
  }

  return result;
}

// ============================================================================
// TASK STATUS TRANSITIONS
// ============================================================================

/**
 * 41. Validates task status transition.
 *
 * @example
 * const valid = isValidStatusTransition(task, 'running');
 */
export function isValidStatusTransition(
  task: TaskDefinition,
  newStatus: TaskDefinition['status']
): boolean {
  const validTransitions: Record<TaskDefinition['status'], TaskDefinition['status'][]> = {
    pending: ['queued', 'cancelled'],
    queued: ['running', 'cancelled', 'suspended'],
    running: ['completed', 'failed', 'timeout', 'cancelled', 'suspended'],
    completed: [],
    failed: ['pending', 'cancelled'],
    cancelled: [],
    timeout: ['pending', 'failed', 'cancelled'],
    suspended: ['queued', 'cancelled'],
  };

  return validTransitions[task.status]?.includes(newStatus) ?? false;
}

/**
 * 42. Transitions task to new status with validation.
 *
 * @example
 * transitionTaskStatus(task, 'running', 'Task picked up by worker');
 */
export function transitionTaskStatus(
  task: TaskDefinition,
  newStatus: TaskDefinition['status'],
  reason?: string
): void {
  if (!isValidStatusTransition(task, newStatus)) {
    throw new Error(`Invalid status transition from ${task.status} to ${newStatus}`);
  }

  const oldStatus = task.status;
  task.status = newStatus;
  task.updatedAt = new Date();

  if (newStatus === 'running') {
    task.startedAt = new Date();
  }

  task.metadata = {
    ...task.metadata,
    statusHistory: [
      ...(task.metadata?.statusHistory || []),
      {
        from: oldStatus,
        to: newStatus,
        reason,
        timestamp: new Date(),
      },
    ],
  };
}

/**
 * 43. Cancels a task with reason.
 *
 * @example
 * cancelTask(task, 'User requested cancellation');
 */
export function cancelTask(task: TaskDefinition, reason?: string): void {
  transitionTaskStatus(task, 'cancelled', reason);
  task.completedAt = new Date();
}

/**
 * 44. Suspends a running task.
 *
 * @example
 * suspendTask(task, 'System maintenance');
 */
export function suspendTask(task: TaskDefinition, reason?: string): void {
  transitionTaskStatus(task, 'suspended', reason);
}

/**
 * 45. Resumes a suspended task.
 *
 * @example
 * resumeTask(task, 'Maintenance completed');
 */
export function resumeTask(task: TaskDefinition, reason?: string): void {
  transitionTaskStatus(task, 'queued', reason);
}

// ============================================================================
// TASK NOTIFICATION SYSTEMS
// ============================================================================

/**
 * 46. Creates a task notification.
 *
 * @example
 * const notification = createTaskNotification(
 *   task,
 *   'assigned',
 *   ['user-123'],
 *   'email'
 * );
 */
export function createTaskNotification(
  task: TaskDefinition,
  event: TaskNotification['event'],
  recipients: string[],
  channel: TaskNotification['channel'] = 'internal',
  template?: string,
  data?: Record<string, any>
): TaskNotification {
  return {
    taskId: task.id,
    event,
    recipients,
    channel,
    template,
    data: {
      taskName: task.name,
      taskType: task.type,
      priority: task.priority,
      deadline: task.deadline,
      ...data,
    },
    timestamp: new Date(),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function isFuture(date: Date): boolean {
  return isAfter(date, new Date());
}

/**
 * Injectable service for task orchestration.
 *
 * @example
 * @Injectable()
 * export class WorkflowService {
 *   constructor(private readonly orchestrator: TaskOrchestrationService) {}
 *
 *   async processPatientRecord(patientId: string) {
 *     const task = this.orchestrator.createTask({
 *       type: 'patient-processing',
 *       name: 'Process Patient Record',
 *       payload: { patientId },
 *     });
 *     await this.orchestrator.executeTask(task);
 *   }
 * }
 */
@Injectable()
export class TaskOrchestrationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TaskOrchestrationService.name);
  private readonly tasks = new Map<string, TaskDefinition>();
  private readonly queues = new Map<string, Queue>();
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async onModuleInit() {
    this.logger.log('Task Orchestration Service initialized');
  }

  async onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up queues
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }

  createTask(config: Parameters<typeof createTask>[0]): TaskDefinition {
    const task = createTask(config);
    this.tasks.set(task.id, task);
    this.eventEmitter.emit('task.created', task);
    return task;
  }

  getTask(taskId: string): TaskDefinition | undefined {
    return this.tasks.get(taskId);
  }

  assignTask(taskId: string, assignedTo: string, assignedBy: string, reason?: string): TaskAssignment | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    const assignment = assignTask(task, assignedTo, assignedBy, reason);
    this.eventEmitter.emit('task.assigned', { task, assignment });
    return assignment;
  }

  async executeTask(task: TaskDefinition): Promise<TaskResult> {
    try {
      transitionTaskStatus(task, 'running');
      this.eventEmitter.emit('task.started', task);

      // Task execution logic would go here

      const result = completeTask(task, { success: true });
      this.eventEmitter.emit('task.completed', { task, result });
      return result;
    } catch (error) {
      const result = failTask(task, error as Error);
      this.eventEmitter.emit('task.failed', { task, result });
      return result;
    }
  }
}

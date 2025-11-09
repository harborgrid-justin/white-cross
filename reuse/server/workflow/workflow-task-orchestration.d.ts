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
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue, JobOptions } from 'bull';
/**
 * Zod schema for task definition.
 */
export declare const TaskDefinitionSchema: any;
/**
 * Zod schema for task queue configuration.
 */
export declare const TaskQueueConfigSchema: any;
/**
 * Zod schema for task assignment.
 */
export declare const TaskAssignmentSchema: any;
/**
 * Zod schema for task delegation.
 */
export declare const TaskDelegationSchema: any;
/**
 * Zod schema for task retry configuration.
 */
export declare const TaskRetryConfigSchema: any;
/**
 * Zod schema for task dependency.
 */
export declare const TaskDependencySchema: any;
/**
 * Zod schema for task notification.
 */
export declare const TaskNotificationSchema: any;
/**
 * Zod schema for task schedule.
 */
export declare const TaskScheduleSchema: any;
/**
 * Zod schema for task timeout configuration.
 */
export declare const TaskTimeoutConfigSchema: any;
/**
 * Zod schema for task monitoring metrics.
 */
export declare const TaskMetricsSchema: any;
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
export declare function createTask(config: Partial<TaskDefinition> & Pick<TaskDefinition, 'type' | 'name' | 'payload'>): TaskDefinition;
/**
 * 2. Assigns a task to a specific user or role.
 *
 * @example
 * const assignment = assignTask(task, 'user-123', 'admin-user', 'Best fit for expertise');
 */
export declare function assignTask(task: TaskDefinition, assignedTo: string, assignedBy: string, reason?: string): TaskAssignment;
/**
 * 3. Reassigns a task from one user to another.
 *
 * @example
 * const reassignment = reassignTask(task, 'user-456', 'manager-789', 'Workload balancing');
 */
export declare function reassignTask(task: TaskDefinition, newAssignee: string, reassignedBy: string, reason?: string): TaskAssignment;
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
export declare function delegateTask(task: TaskDefinition, fromUser: string, toUser: string, returnCondition?: TaskDelegation['returnCondition'], reason?: string): TaskDelegation;
/**
 * 5. Auto-assigns tasks based on workload balancing.
 *
 * @example
 * const assignedTo = autoAssignTask(task, availableUsers, currentWorkloads);
 */
export declare function autoAssignTask(task: TaskDefinition, availableUsers: string[], currentWorkloads: Record<string, number>, prioritizeExpertise?: boolean): string;
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
export declare function createTaskQueue(config: Partial<TaskQueueConfig> & Pick<TaskQueueConfig, 'name'>): TaskQueueConfig;
/**
 * 7. Adds a task to a queue with priority handling.
 *
 * @example
 * const jobOptions = enqueueTask(task, queueConfig);
 */
export declare function enqueueTask(task: TaskDefinition, queueConfig: TaskQueueConfig): JobOptions;
/**
 * 8. Dequeues a task from the queue.
 *
 * @example
 * const removed = dequeueTask(taskId, queue);
 */
export declare function dequeueTask(taskId: string, queue: Queue): Promise<boolean>;
/**
 * 9. Gets queue metrics and statistics.
 *
 * @example
 * const metrics = await getQueueMetrics(queue);
 */
export declare function getQueueMetrics(queue: Queue): Promise<QueueMetrics>;
/**
 * 10. Reorders tasks in queue based on priority changes.
 *
 * @example
 * await reorderQueueByPriority(queue, priorityUpdates);
 */
export declare function reorderQueueByPriority(queue: Queue, priorityUpdates: Array<{
    taskId: string;
    newPriority: number;
}>): Promise<void>;
/**
 * 11. Updates task priority dynamically.
 *
 * @example
 * updateTaskPriority(task, 'critical', 'Escalated due to deadline');
 */
export declare function updateTaskPriority(task: TaskDefinition, newPriority: TaskDefinition['priority'], reason?: string): void;
/**
 * 12. Escalates task priority based on deadline proximity.
 *
 * @example
 * const escalated = escalateTaskByDeadline(task, 24); // 24 hours
 */
export declare function escalateTaskByDeadline(task: TaskDefinition, hoursBeforeDeadline: number): boolean;
/**
 * 13. Calculates task priority score for intelligent sorting.
 *
 * @example
 * const score = calculateTaskPriorityScore(task);
 */
export declare function calculateTaskPriorityScore(task: TaskDefinition): number;
/**
 * 14. Sorts tasks by priority and deadline.
 *
 * @example
 * const sortedTasks = sortTasksByPriority(tasks);
 */
export declare function sortTasksByPriority(tasks: TaskDefinition[]): TaskDefinition[];
/**
 * 15. Filters tasks by priority threshold.
 *
 * @example
 * const urgentTasks = filterTasksByPriority(tasks, ['critical', 'high']);
 */
export declare function filterTasksByPriority(tasks: TaskDefinition[], priorities: TaskDefinition['priority'][]): TaskDefinition[];
/**
 * 16. Schedules a task for future execution.
 *
 * @example
 * const schedule = scheduleTask(task, new Date('2025-12-31T10:00:00Z'));
 */
export declare function scheduleTask(task: TaskDefinition, scheduledFor: Date): TaskSchedule;
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
export declare function createRecurringSchedule(task: TaskDefinition, pattern: TaskSchedule['recurrencePattern']): TaskSchedule;
/**
 * 18. Creates a cron-based task schedule.
 *
 * @example
 * const schedule = createCronSchedule(task, '0 9 * * MON-FRI'); // 9 AM weekdays
 */
export declare function createCronSchedule(task: TaskDefinition, cronExpression: string, timezone?: string): TaskSchedule;
/**
 * 19. Calculates next execution time for a scheduled task.
 *
 * @example
 * const nextRun = calculateNextExecutionTime(schedule);
 */
export declare function calculateNextExecutionTime(schedule: TaskSchedule): Date | null;
/**
 * 20. Cancels a scheduled task.
 *
 * @example
 * cancelScheduledTask(schedule, 'User requested cancellation');
 */
export declare function cancelScheduledTask(schedule: TaskSchedule, reason?: string): void;
/**
 * 21. Marks a task as completed with result.
 *
 * @example
 * const result = completeTask(task, { recordsProcessed: 100 });
 */
export declare function completeTask(task: TaskDefinition, result?: any): TaskResult;
/**
 * 22. Marks a task as failed with error details.
 *
 * @example
 * const result = failTask(task, 'Database connection timeout');
 */
export declare function failTask(task: TaskDefinition, error: string | Error): TaskResult;
/**
 * 23. Tracks task progress with percentage completion.
 *
 * @example
 * updateTaskProgress(task, 75, { recordsProcessed: 750, totalRecords: 1000 });
 */
export declare function updateTaskProgress(task: TaskDefinition, percentComplete: number, metadata?: Record<string, any>): void;
/**
 * 24. Calculates task execution metrics.
 *
 * @example
 * const metrics = calculateTaskMetrics(task, 'patient-processing-queue');
 */
export declare function calculateTaskMetrics(task: TaskDefinition, queueName: string): TaskMetrics;
/**
 * 25. Generates task completion report.
 *
 * @example
 * const report = generateTaskCompletionReport(tasks, startDate, endDate);
 */
export declare function generateTaskCompletionReport(tasks: TaskDefinition[], startDate: Date, endDate: Date): {
    total: number;
    completed: number;
    failed: number;
    averageExecutionTimeMs: number;
    completionRate: number;
};
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
export declare function configureTaskRetry(config: Partial<TaskRetryConfig>): TaskRetryConfig;
/**
 * 27. Calculates retry delay based on backoff strategy.
 *
 * @example
 * const delayMs = calculateRetryDelay(retryConfig, 3);
 */
export declare function calculateRetryDelay(config: TaskRetryConfig, attemptNumber: number): number;
/**
 * 28. Determines if a task should be retried.
 *
 * @example
 * const shouldRetry = canRetryTask(task, retryConfig, error);
 */
export declare function canRetryTask(task: TaskDefinition, config: TaskRetryConfig, error?: Error): boolean;
/**
 * 29. Retries a failed task with backoff.
 *
 * @example
 * const retryDelay = retryTask(task, retryConfig);
 */
export declare function retryTask(task: TaskDefinition, config: TaskRetryConfig): number;
/**
 * 30. Implements exponential backoff with jitter.
 *
 * @example
 * const delayMs = calculateBackoffWithJitter(1000, 3, 2, 0.1);
 */
export declare function calculateBackoffWithJitter(baseDelayMs: number, attemptNumber: number, multiplier: number, jitterFactor: number): number;
/**
 * 31. Configures timeout for a task.
 *
 * @example
 * const timeoutConfig = configureTaskTimeout(task, 30000, 'retry');
 */
export declare function configureTaskTimeout(task: TaskDefinition, timeoutMs: number, action?: TaskTimeoutConfig['action']): TaskTimeoutConfig;
/**
 * 32. Checks if a task has timed out.
 *
 * @example
 * const timedOut = isTaskTimedOut(task);
 */
export declare function isTaskTimedOut(task: TaskDefinition): boolean;
/**
 * 33. Handles task timeout with configured action.
 *
 * @example
 * handleTaskTimeout(task, timeoutConfig);
 */
export declare function handleTaskTimeout(task: TaskDefinition, config: TaskTimeoutConfig): void;
/**
 * 34. Sets deadline for task completion.
 *
 * @example
 * setTaskDeadline(task, new Date('2025-12-31T23:59:59Z'));
 */
export declare function setTaskDeadline(task: TaskDefinition, deadline: Date): void;
/**
 * 35. Checks if task deadline is approaching.
 *
 * @example
 * const approaching = isDeadlineApproaching(task, 24); // 24 hours
 */
export declare function isDeadlineApproaching(task: TaskDefinition, hoursThreshold: number): boolean;
/**
 * 36. Adds dependency between tasks.
 *
 * @example
 * addTaskDependency(childTask, parentTask.id);
 */
export declare function addTaskDependency(task: TaskDefinition, dependsOnTaskId: string): void;
/**
 * 37. Checks if all task dependencies are completed.
 *
 * @example
 * const ready = areTaskDependenciesMet(task, allTasks);
 */
export declare function areTaskDependenciesMet(task: TaskDefinition, allTasks: Map<string, TaskDefinition>): boolean;
/**
 * 38. Builds task dependency graph.
 *
 * @example
 * const graph = buildTaskDependencyGraph(tasks);
 */
export declare function buildTaskDependencyGraph(tasks: TaskDefinition[]): Map<string, string[]>;
/**
 * 39. Detects circular dependencies in task graph.
 *
 * @example
 * const hasCircular = detectCircularDependencies(tasks);
 */
export declare function detectCircularDependencies(tasks: TaskDefinition[]): boolean;
/**
 * 40. Resolves task execution order based on dependencies.
 *
 * @example
 * const executionOrder = resolveTaskExecutionOrder(tasks);
 */
export declare function resolveTaskExecutionOrder(tasks: TaskDefinition[]): TaskDefinition[];
/**
 * 41. Validates task status transition.
 *
 * @example
 * const valid = isValidStatusTransition(task, 'running');
 */
export declare function isValidStatusTransition(task: TaskDefinition, newStatus: TaskDefinition['status']): boolean;
/**
 * 42. Transitions task to new status with validation.
 *
 * @example
 * transitionTaskStatus(task, 'running', 'Task picked up by worker');
 */
export declare function transitionTaskStatus(task: TaskDefinition, newStatus: TaskDefinition['status'], reason?: string): void;
/**
 * 43. Cancels a task with reason.
 *
 * @example
 * cancelTask(task, 'User requested cancellation');
 */
export declare function cancelTask(task: TaskDefinition, reason?: string): void;
/**
 * 44. Suspends a running task.
 *
 * @example
 * suspendTask(task, 'System maintenance');
 */
export declare function suspendTask(task: TaskDefinition, reason?: string): void;
/**
 * 45. Resumes a suspended task.
 *
 * @example
 * resumeTask(task, 'Maintenance completed');
 */
export declare function resumeTask(task: TaskDefinition, reason?: string): void;
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
export declare function createTaskNotification(task: TaskDefinition, event: TaskNotification['event'], recipients: string[], channel?: TaskNotification['channel'], template?: string, data?: Record<string, any>): TaskNotification;
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
export declare class TaskOrchestrationService implements OnModuleInit, OnModuleDestroy {
    private readonly eventEmitter;
    private readonly logger;
    private readonly tasks;
    private readonly queues;
    private readonly destroy$;
    constructor(eventEmitter: EventEmitter2);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    createTask(config: Parameters<typeof createTask>[0]): TaskDefinition;
    getTask(taskId: string): TaskDefinition | undefined;
    assignTask(taskId: string, assignedTo: string, assignedBy: string, reason?: string): TaskAssignment | null;
    executeTask(task: TaskDefinition): Promise<TaskResult>;
}
//# sourceMappingURL=workflow-task-orchestration.d.ts.map
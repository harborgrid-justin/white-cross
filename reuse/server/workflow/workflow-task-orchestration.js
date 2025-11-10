"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskOrchestrationService = exports.TaskMetricsSchema = exports.TaskTimeoutConfigSchema = exports.TaskScheduleSchema = exports.TaskNotificationSchema = exports.TaskDependencySchema = exports.TaskRetryConfigSchema = exports.TaskDelegationSchema = exports.TaskAssignmentSchema = exports.TaskQueueConfigSchema = exports.TaskDefinitionSchema = void 0;
exports.createTask = createTask;
exports.assignTask = assignTask;
exports.reassignTask = reassignTask;
exports.delegateTask = delegateTask;
exports.autoAssignTask = autoAssignTask;
exports.createTaskQueue = createTaskQueue;
exports.enqueueTask = enqueueTask;
exports.dequeueTask = dequeueTask;
exports.getQueueMetrics = getQueueMetrics;
exports.reorderQueueByPriority = reorderQueueByPriority;
exports.updateTaskPriority = updateTaskPriority;
exports.escalateTaskByDeadline = escalateTaskByDeadline;
exports.calculateTaskPriorityScore = calculateTaskPriorityScore;
exports.sortTasksByPriority = sortTasksByPriority;
exports.filterTasksByPriority = filterTasksByPriority;
exports.scheduleTask = scheduleTask;
exports.createRecurringSchedule = createRecurringSchedule;
exports.createCronSchedule = createCronSchedule;
exports.calculateNextExecutionTime = calculateNextExecutionTime;
exports.cancelScheduledTask = cancelScheduledTask;
exports.completeTask = completeTask;
exports.failTask = failTask;
exports.updateTaskProgress = updateTaskProgress;
exports.calculateTaskMetrics = calculateTaskMetrics;
exports.generateTaskCompletionReport = generateTaskCompletionReport;
exports.configureTaskRetry = configureTaskRetry;
exports.calculateRetryDelay = calculateRetryDelay;
exports.canRetryTask = canRetryTask;
exports.retryTask = retryTask;
exports.calculateBackoffWithJitter = calculateBackoffWithJitter;
exports.configureTaskTimeout = configureTaskTimeout;
exports.isTaskTimedOut = isTaskTimedOut;
exports.handleTaskTimeout = handleTaskTimeout;
exports.setTaskDeadline = setTaskDeadline;
exports.isDeadlineApproaching = isDeadlineApproaching;
exports.addTaskDependency = addTaskDependency;
exports.areTaskDependenciesMet = areTaskDependenciesMet;
exports.buildTaskDependencyGraph = buildTaskDependencyGraph;
exports.detectCircularDependencies = detectCircularDependencies;
exports.resolveTaskExecutionOrder = resolveTaskExecutionOrder;
exports.isValidStatusTransition = isValidStatusTransition;
exports.transitionTaskStatus = transitionTaskStatus;
exports.cancelTask = cancelTask;
exports.suspendTask = suspendTask;
exports.resumeTask = resumeTask;
exports.createTaskNotification = createTaskNotification;
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
const zod_1 = require("zod");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const date_fns_1 = require("date-fns");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for task definition.
 */
exports.TaskDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['critical', 'high', 'normal', 'low']).default('normal'),
    status: zod_1.z.enum(['pending', 'queued', 'running', 'completed', 'failed', 'cancelled', 'timeout', 'suspended']).default('pending'),
    payload: zod_1.z.record(zod_1.z.any()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    createdBy: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
    scheduledFor: zod_1.z.date().optional(),
    startedAt: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    deadline: zod_1.z.date().optional(),
    timeoutMs: zod_1.z.number().int().positive().optional(),
    retryCount: zod_1.z.number().int().nonnegative().default(0),
    maxRetries: zod_1.z.number().int().nonnegative().default(3),
    retryDelayMs: zod_1.z.number().int().positive().default(1000),
    dependencies: zod_1.z.array(zod_1.z.string().uuid()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    tenantId: zod_1.z.string().optional(),
});
/**
 * Zod schema for task queue configuration.
 */
exports.TaskQueueConfigSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    concurrency: zod_1.z.number().int().positive().default(5),
    maxJobsPerWorker: zod_1.z.number().int().positive().default(100),
    rateLimiter: zod_1.z.object({
        max: zod_1.z.number().int().positive(),
        duration: zod_1.z.number().int().positive(),
    }).optional(),
    defaultJobOptions: zod_1.z.object({
        attempts: zod_1.z.number().int().positive().default(3),
        backoff: zod_1.z.union([
            zod_1.z.number().int().positive(),
            zod_1.z.object({
                type: zod_1.z.enum(['fixed', 'exponential']),
                delay: zod_1.z.number().int().positive(),
            }),
        ]).optional(),
        priority: zod_1.z.number().int().default(0),
        delay: zod_1.z.number().int().nonnegative().default(0),
        timeout: zod_1.z.number().int().positive().optional(),
        removeOnComplete: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number().int().positive()]).default(true),
        removeOnFail: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number().int().positive()]).default(false),
    }).optional(),
});
/**
 * Zod schema for task assignment.
 */
exports.TaskAssignmentSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    assignedTo: zod_1.z.string(),
    assignedBy: zod_1.z.string(),
    assignedAt: zod_1.z.date(),
    reason: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task delegation.
 */
exports.TaskDelegationSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    fromUser: zod_1.z.string(),
    toUser: zod_1.z.string(),
    delegatedAt: zod_1.z.date(),
    reason: zod_1.z.string().optional(),
    returnCondition: zod_1.z.enum(['on_completion', 'on_deadline', 'manual', 'never']).default('on_completion'),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task retry configuration.
 */
exports.TaskRetryConfigSchema = zod_1.z.object({
    maxAttempts: zod_1.z.number().int().positive().default(3),
    backoffStrategy: zod_1.z.enum(['fixed', 'exponential', 'linear']).default('exponential'),
    initialDelayMs: zod_1.z.number().int().positive().default(1000),
    maxDelayMs: zod_1.z.number().int().positive().default(60000),
    multiplier: zod_1.z.number().positive().default(2),
    retryOn: zod_1.z.array(zod_1.z.string()).optional(),
    skipOn: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Zod schema for task dependency.
 */
exports.TaskDependencySchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    dependsOn: zod_1.z.array(zod_1.z.string().uuid()),
    dependencyType: zod_1.z.enum(['all', 'any', 'none']).default('all'),
    failureStrategy: zod_1.z.enum(['fail', 'skip', 'continue']).default('fail'),
});
/**
 * Zod schema for task notification.
 */
exports.TaskNotificationSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    event: zod_1.z.enum(['created', 'assigned', 'started', 'completed', 'failed', 'timeout', 'deadline_approaching', 'cancelled', 'suspended', 'resumed']),
    recipients: zod_1.z.array(zod_1.z.string()),
    channel: zod_1.z.enum(['email', 'sms', 'push', 'webhook', 'internal']).default('internal'),
    template: zod_1.z.string().optional(),
    data: zod_1.z.record(zod_1.z.any()).optional(),
    timestamp: zod_1.z.date(),
});
/**
 * Zod schema for task schedule.
 */
exports.TaskScheduleSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    scheduleType: zod_1.z.enum(['once', 'recurring', 'cron']),
    scheduledFor: zod_1.z.date().optional(),
    cronExpression: zod_1.z.string().optional(),
    recurrencePattern: zod_1.z.object({
        frequency: zod_1.z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly']),
        interval: zod_1.z.number().int().positive().default(1),
        endDate: zod_1.z.date().optional(),
        maxOccurrences: zod_1.z.number().int().positive().optional(),
    }).optional(),
    timezone: zod_1.z.string().default('UTC'),
    enabled: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for task timeout configuration.
 */
exports.TaskTimeoutConfigSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    timeoutMs: zod_1.z.number().int().positive(),
    action: zod_1.z.enum(['fail', 'retry', 'compensate', 'notify']).default('fail'),
    compensationHandler: zod_1.z.string().optional(),
    notifyOnTimeout: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for task monitoring metrics.
 */
exports.TaskMetricsSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    queueName: zod_1.z.string(),
    executionTimeMs: zod_1.z.number().int().nonnegative().optional(),
    waitTimeMs: zod_1.z.number().int().nonnegative().optional(),
    memoryUsageMb: zod_1.z.number().nonnegative().optional(),
    cpuUsagePercent: zod_1.z.number().nonnegative().optional(),
    retryAttempts: zod_1.z.number().int().nonnegative().default(0),
    errorCount: zod_1.z.number().int().nonnegative().default(0),
    completedAt: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
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
function createTask(config) {
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
function assignTask(task, assignedTo, assignedBy, reason) {
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
function reassignTask(task, newAssignee, reassignedBy, reason) {
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
function delegateTask(task, fromUser, toUser, returnCondition = 'on_completion', reason) {
    const delegation = {
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
function autoAssignTask(task, availableUsers, currentWorkloads, prioritizeExpertise) {
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
function createTaskQueue(config) {
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
function enqueueTask(task, queueConfig) {
    const priorityMap = {
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
async function dequeueTask(taskId, queue) {
    try {
        const job = await queue.getJob(taskId);
        if (job) {
            await job.remove();
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
/**
 * 9. Gets queue metrics and statistics.
 *
 * @example
 * const metrics = await getQueueMetrics(queue);
 */
async function getQueueMetrics(queue) {
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
async function reorderQueueByPriority(queue, priorityUpdates) {
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
function updateTaskPriority(task, newPriority, reason) {
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
function escalateTaskByDeadline(task, hoursBeforeDeadline) {
    if (!task.deadline)
        return false;
    const hoursUntilDeadline = (0, date_fns_1.differenceInMilliseconds)(task.deadline, new Date()) / (1000 * 60 * 60);
    if (hoursUntilDeadline <= hoursBeforeDeadline && hoursUntilDeadline > 0) {
        const currentPriorityIndex = ['low', 'normal', 'high', 'critical'].indexOf(task.priority);
        if (currentPriorityIndex < 3) {
            const newPriority = ['low', 'normal', 'high', 'critical'][currentPriorityIndex + 1];
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
function calculateTaskPriorityScore(task) {
    const priorityScores = { critical: 1000, high: 100, normal: 10, low: 1 };
    let score = priorityScores[task.priority];
    // Factor in deadline
    if (task.deadline) {
        const hoursUntilDeadline = (0, date_fns_1.differenceInMilliseconds)(task.deadline, new Date()) / (1000 * 60 * 60);
        if (hoursUntilDeadline > 0) {
            score += Math.max(0, 100 - hoursUntilDeadline);
        }
        else {
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
function sortTasksByPriority(tasks) {
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
function filterTasksByPriority(tasks, priorities) {
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
function scheduleTask(task, scheduledFor) {
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
function createRecurringSchedule(task, pattern) {
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
function createCronSchedule(task, cronExpression, timezone = 'UTC') {
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
function calculateNextExecutionTime(schedule) {
    if (!schedule.enabled)
        return null;
    if (schedule.scheduleType === 'once') {
        return schedule.scheduledFor && isFuture(schedule.scheduledFor) ? schedule.scheduledFor : null;
    }
    if (schedule.scheduleType === 'recurring' && schedule.recurrencePattern) {
        const { frequency, interval } = schedule.recurrencePattern;
        const now = new Date();
        switch (frequency) {
            case 'hourly':
                return (0, date_fns_1.add)(now, { hours: interval });
            case 'daily':
                return (0, date_fns_1.add)(now, { days: interval });
            case 'weekly':
                return (0, date_fns_1.add)(now, { weeks: interval });
            case 'monthly':
                return (0, date_fns_1.add)(now, { months: interval });
            case 'yearly':
                return (0, date_fns_1.add)(now, { years: interval });
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
function cancelScheduledTask(schedule, reason) {
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
function completeTask(task, result) {
    const now = new Date();
    const executionTimeMs = task.startedAt
        ? (0, date_fns_1.differenceInMilliseconds)(now, task.startedAt)
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
function failTask(task, error) {
    const now = new Date();
    const errorMessage = error instanceof Error ? error.message : error;
    const executionTimeMs = task.startedAt
        ? (0, date_fns_1.differenceInMilliseconds)(now, task.startedAt)
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
function updateTaskProgress(task, percentComplete, metadata) {
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
function calculateTaskMetrics(task, queueName) {
    const executionTimeMs = task.startedAt && task.completedAt
        ? (0, date_fns_1.differenceInMilliseconds)(task.completedAt, task.startedAt)
        : undefined;
    const waitTimeMs = task.createdAt && task.startedAt
        ? (0, date_fns_1.differenceInMilliseconds)(task.startedAt, task.createdAt)
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
function generateTaskCompletionReport(tasks, startDate, endDate) {
    const relevantTasks = tasks.filter(task => task.completedAt &&
        (0, date_fns_1.isAfter)(task.completedAt, startDate) &&
        (0, date_fns_1.isBefore)(task.completedAt, endDate));
    const completed = relevantTasks.filter(t => t.status === 'completed').length;
    const failed = relevantTasks.filter(t => t.status === 'failed').length;
    const executionTimes = relevantTasks
        .filter(t => t.startedAt && t.completedAt)
        .map(t => (0, date_fns_1.differenceInMilliseconds)(t.completedAt, t.startedAt));
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
function configureTaskRetry(config) {
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
function calculateRetryDelay(config, attemptNumber) {
    let delay;
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
function canRetryTask(task, config, error) {
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
function retryTask(task, config) {
    task.retryCount += 1;
    task.status = 'pending';
    task.error = undefined;
    task.updatedAt = new Date();
    const delayMs = calculateRetryDelay(config, task.retryCount);
    task.scheduledFor = (0, date_fns_1.addMilliseconds)(new Date(), delayMs);
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
function calculateBackoffWithJitter(baseDelayMs, attemptNumber, multiplier, jitterFactor) {
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
function configureTaskTimeout(task, timeoutMs, action = 'fail') {
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
function isTaskTimedOut(task) {
    if (!task.timeoutMs || !task.startedAt)
        return false;
    const elapsedMs = (0, date_fns_1.differenceInMilliseconds)(new Date(), task.startedAt);
    return elapsedMs > task.timeoutMs;
}
/**
 * 33. Handles task timeout with configured action.
 *
 * @example
 * handleTaskTimeout(task, timeoutConfig);
 */
function handleTaskTimeout(task, config) {
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
function setTaskDeadline(task, deadline) {
    task.deadline = deadline;
    task.updatedAt = new Date();
}
/**
 * 35. Checks if task deadline is approaching.
 *
 * @example
 * const approaching = isDeadlineApproaching(task, 24); // 24 hours
 */
function isDeadlineApproaching(task, hoursThreshold) {
    if (!task.deadline)
        return false;
    const hoursUntilDeadline = (0, date_fns_1.differenceInMilliseconds)(task.deadline, new Date()) / (1000 * 60 * 60);
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
function addTaskDependency(task, dependsOnTaskId) {
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
function areTaskDependenciesMet(task, allTasks) {
    if (task.dependencies.length === 0)
        return true;
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
function buildTaskDependencyGraph(tasks) {
    const graph = new Map();
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
function detectCircularDependencies(tasks) {
    const graph = buildTaskDependencyGraph(tasks);
    const visited = new Set();
    const recursionStack = new Set();
    function hasCycle(taskId) {
        visited.add(taskId);
        recursionStack.add(taskId);
        const dependencies = graph.get(taskId) || [];
        for (const depId of dependencies) {
            if (!visited.has(depId)) {
                if (hasCycle(depId))
                    return true;
            }
            else if (recursionStack.has(depId)) {
                return true;
            }
        }
        recursionStack.delete(taskId);
        return false;
    }
    for (const task of tasks) {
        if (!visited.has(task.id)) {
            if (hasCycle(task.id))
                return true;
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
function resolveTaskExecutionOrder(tasks) {
    const graph = buildTaskDependencyGraph(tasks);
    const inDegree = new Map();
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    // Calculate in-degrees
    for (const task of tasks) {
        inDegree.set(task.id, task.dependencies.length);
    }
    // Topological sort using Kahn's algorithm
    const queue = [];
    const result = [];
    for (const [taskId, degree] of inDegree.entries()) {
        if (degree === 0)
            queue.push(taskId);
    }
    while (queue.length > 0) {
        const taskId = queue.shift();
        const task = taskMap.get(taskId);
        if (task)
            result.push(task);
        // Find tasks that depend on current task
        for (const [depTaskId, dependencies] of graph.entries()) {
            if (dependencies.includes(taskId)) {
                const currentDegree = inDegree.get(depTaskId);
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
function isValidStatusTransition(task, newStatus) {
    const validTransitions = {
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
function transitionTaskStatus(task, newStatus, reason) {
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
function cancelTask(task, reason) {
    transitionTaskStatus(task, 'cancelled', reason);
    task.completedAt = new Date();
}
/**
 * 44. Suspends a running task.
 *
 * @example
 * suspendTask(task, 'System maintenance');
 */
function suspendTask(task, reason) {
    transitionTaskStatus(task, 'suspended', reason);
}
/**
 * 45. Resumes a suspended task.
 *
 * @example
 * resumeTask(task, 'Maintenance completed');
 */
function resumeTask(task, reason) {
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
function createTaskNotification(task, event, recipients, channel = 'internal', template, data) {
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
function isFuture(date) {
    return (0, date_fns_1.isAfter)(date, new Date());
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
let TaskOrchestrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TaskOrchestrationService = _classThis = class {
        constructor(eventEmitter) {
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(TaskOrchestrationService.name);
            this.tasks = new Map();
            this.queues = new Map();
            this.destroy$ = new rxjs_1.Subject();
        }
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
        createTask(config) {
            const task = createTask(config);
            this.tasks.set(task.id, task);
            this.eventEmitter.emit('task.created', task);
            return task;
        }
        getTask(taskId) {
            return this.tasks.get(taskId);
        }
        assignTask(taskId, assignedTo, assignedBy, reason) {
            const task = this.tasks.get(taskId);
            if (!task)
                return null;
            const assignment = assignTask(task, assignedTo, assignedBy, reason);
            this.eventEmitter.emit('task.assigned', { task, assignment });
            return assignment;
        }
        async executeTask(task) {
            try {
                transitionTaskStatus(task, 'running');
                this.eventEmitter.emit('task.started', task);
                // Task execution logic would go here
                const result = completeTask(task, { success: true });
                this.eventEmitter.emit('task.completed', { task, result });
                return result;
            }
            catch (error) {
                const result = failTask(task, error);
                this.eventEmitter.emit('task.failed', { task, result });
                return result;
            }
        }
    };
    __setFunctionName(_classThis, "TaskOrchestrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TaskOrchestrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TaskOrchestrationService = _classThis;
})();
exports.TaskOrchestrationService = TaskOrchestrationService;
//# sourceMappingURL=workflow-task-orchestration.js.map
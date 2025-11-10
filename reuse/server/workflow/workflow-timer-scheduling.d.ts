/**
 * LOC: WFTS-001
 * File: /reuse/server/workflow/workflow-timer-scheduling.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize / sequelize-typescript
 *   - node-cron / cron scheduling systems
 *   - Workflow execution engines
 *   - Timer persistence storage
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Scheduled task handlers
 *   - Timer event processors
 *   - Distributed scheduler coordinators
 */
/**
 * File: /reuse/server/workflow/workflow-timer-scheduling.ts
 * Locator: WC-UTL-WFTS-001
 * Purpose: Workflow Timer Scheduling - Production-grade timer events and scheduling for workflow systems
 *
 * Upstream: Sequelize ORM, cron systems, workflow engines, timer coordinators
 * Downstream: ../backend/*, ../services/*, workflow orchestration, scheduled tasks
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, node-cron
 * Exports: 45 utility functions for timer events, scheduling, cron jobs, timer persistence
 *
 * LLM Context: Enterprise-grade workflow timer scheduling utilities for White Cross healthcare platform.
 * Provides timer start event scheduling, timer intermediate event handling, timer boundary event processing,
 * cron-based scheduling, duration-based timers, cycle-based timers, timer cancellation, timer rescheduling,
 * timer persistence, timer recovery after restart, distributed timer coordination. Essential for time-based
 * workflow automation in healthcare applications with reliability and HIPAA compliance requirements.
 *
 * Features:
 * - Cron expression parsing and execution
 * - Duration-based timer scheduling (ISO 8601)
 * - Cycle-based repeating timers
 * - Timer boundary events (interrupting/non-interrupting)
 * - Timer persistence with database storage
 * - Distributed timer coordination with locking
 * - Timer recovery after system restart
 * - Missed timer catch-up strategies
 * - Timer escalation and deadline management
 * - Healthcare-specific scheduling (appointments, reminders)
 * - Timezone-aware scheduling
 * - Audit trail for timer executions
 */
import { Sequelize, Transaction } from 'sequelize';
export interface WorkflowTimer {
    id: string;
    workflowInstanceId: string;
    activityId: string;
    timerType: TimerType;
    timerEvent: TimerEventType;
    scheduledAt: Date;
    executedAt?: Date;
    cancelledAt?: Date;
    status: TimerStatus;
    configuration: TimerConfiguration;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TimerType {
    START_EVENT = "START_EVENT",
    INTERMEDIATE_EVENT = "INTERMEDIATE_EVENT",
    BOUNDARY_EVENT = "BOUNDARY_EVENT",
    DEADLINE = "DEADLINE",
    REMINDER = "REMINDER"
}
export declare enum TimerEventType {
    DURATION = "DURATION",
    DATE = "DATE",
    CYCLE = "CYCLE",
    CRON = "CRON"
}
export declare enum TimerStatus {
    SCHEDULED = "SCHEDULED",
    EXECUTING = "EXECUTING",
    EXECUTED = "EXECUTED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    MISSED = "MISSED"
}
export interface TimerConfiguration {
    duration?: string;
    date?: Date;
    cycle?: string;
    cycleCount?: number;
    currentCycle?: number;
    cronExpression?: string;
    interrupting?: boolean;
    cancelActivity?: boolean;
    timezone?: string;
    catchUpStrategy?: CatchUpStrategy;
}
export declare enum CatchUpStrategy {
    EXECUTE_ALL = "EXECUTE_ALL",
    EXECUTE_LATEST = "EXECUTE_LATEST",
    SKIP = "SKIP",
    RESCHEDULE = "RESCHEDULE"
}
export interface CronSchedule {
    id: string;
    name: string;
    cronExpression: string;
    workflowDefinitionId: string;
    enabled: boolean;
    lastExecutedAt?: Date;
    nextExecutionAt: Date;
    timezone: string;
    metadata: Record<string, any>;
}
export interface TimerExecution {
    id: string;
    timerId: string;
    executedAt: Date;
    executionTimeMs: number;
    success: boolean;
    error?: string;
    triggeredWorkflowInstanceId?: string;
}
export interface DistributedTimerLock {
    timerId: string;
    nodeId: string;
    acquiredAt: Date;
    expiresAt: Date;
    lockKey: string;
}
export interface TimerRecoveryInfo {
    timerId: string;
    missedExecutions: Date[];
    nextScheduledAt: Date;
    shouldExecute: boolean;
    catchUpStrategy: CatchUpStrategy;
}
export interface SchedulerHealth {
    activeTimers: number;
    scheduledTimers: number;
    executingTimers: number;
    missedTimers: number;
    nodeId: string;
    lastHealthCheck: Date;
}
/**
 * Schedules a timer start event for a workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowDefinitionId - Workflow definition identifier
 * @param {TimerConfiguration} config - Timer configuration
 * @param {Record<string, any>} metadata - Additional metadata
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Created timer
 *
 * @example
 * ```typescript
 * const timer = await scheduleTimerStartEvent(sequelize, 'wf-def-123', {
 *   cronExpression: '0 9 * * 1-5',  // 9 AM on weekdays
 *   timezone: 'America/New_York'
 * }, { department: 'cardiology' });
 * ```
 */
export declare function scheduleTimerStartEvent(sequelize: Sequelize, workflowDefinitionId: string, config: TimerConfiguration, metadata?: Record<string, any>, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Schedules bulk timer start events for multiple workflows.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{workflowDefinitionId: string, config: TimerConfiguration, metadata?: Record<string, any>}>} timers - Timers to schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer[]>} Created timers
 *
 * @example
 * ```typescript
 * const timers = await scheduleBulkTimerStartEvents(sequelize, [
 *   { workflowDefinitionId: 'wf-1', config: { date: new Date('2024-12-01') } },
 *   { workflowDefinitionId: 'wf-2', config: { duration: 'PT1H' } }
 * ]);
 * ```
 */
export declare function scheduleBulkTimerStartEvents(sequelize: Sequelize, timers: Array<{
    workflowDefinitionId: string;
    config: TimerConfiguration;
    metadata?: Record<string, any>;
}>, transaction?: Transaction): Promise<WorkflowTimer[]>;
/**
 * Retrieves scheduled timer start events due for execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [beforeDate] - Get timers due before this date
 * @param {number} [limit] - Maximum number of timers to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer[]>} Due timers
 *
 * @example
 * ```typescript
 * const dueTimers = await getDueTimerStartEvents(sequelize, new Date(), 100);
 * for (const timer of dueTimers) {
 *   await startWorkflowFromTimer(timer);
 * }
 * ```
 */
export declare function getDueTimerStartEvents(sequelize: Sequelize, beforeDate?: Date, limit?: number, transaction?: Transaction): Promise<WorkflowTimer[]>;
/**
 * Creates a timer intermediate event within a workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity identifier
 * @param {TimerConfiguration} config - Timer configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Created timer
 *
 * @example
 * ```typescript
 * const timer = await createIntermediateTimerEvent(
 *   sequelize,
 *   'wf-instance-123',
 *   'wait-activity',
 *   { duration: 'PT24H' }  // Wait 24 hours
 * );
 * ```
 */
export declare function createIntermediateTimerEvent(sequelize: Sequelize, workflowInstanceId: string, activityId: string, config: TimerConfiguration, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Waits for a timer intermediate event to complete.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {number} [pollIntervalMs] - Polling interval in milliseconds
 * @param {number} [timeoutMs] - Maximum wait time in milliseconds
 * @returns {Promise<WorkflowTimer>} Executed timer
 *
 * @example
 * ```typescript
 * const executedTimer = await waitForIntermediateTimer(
 *   sequelize,
 *   'timer-123',
 *   1000,   // Poll every 1 second
 *   300000  // Timeout after 5 minutes
 * );
 * ```
 */
export declare function waitForIntermediateTimer(sequelize: Sequelize, timerId: string, pollIntervalMs?: number, timeoutMs?: number): Promise<WorkflowTimer>;
/**
 * Retrieves all intermediate timers for a workflow instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {TimerStatus} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer[]>} Intermediate timers
 *
 * @example
 * ```typescript
 * const activeTimers = await getIntermediateTimers(
 *   sequelize,
 *   'wf-instance-123',
 *   TimerStatus.SCHEDULED
 * );
 * ```
 */
export declare function getIntermediateTimers(sequelize: Sequelize, workflowInstanceId: string, status?: TimerStatus, transaction?: Transaction): Promise<WorkflowTimer[]>;
/**
 * Attaches a timer boundary event to an activity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity identifier to attach to
 * @param {TimerConfiguration} config - Timer configuration
 * @param {boolean} interrupting - Whether timer interrupts the activity
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Created boundary timer
 *
 * @example
 * ```typescript
 * const boundaryTimer = await attachTimerBoundaryEvent(
 *   sequelize,
 *   'wf-instance-123',
 *   'user-task-activity',
 *   { duration: 'PT2H' },  // 2 hour timeout
 *   true  // Interrupting - cancels activity on timeout
 * );
 * ```
 */
export declare function attachTimerBoundaryEvent(sequelize: Sequelize, workflowInstanceId: string, activityId: string, config: TimerConfiguration, interrupting?: boolean, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Processes triggered boundary timer events.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Function} boundaryHandler - Handler for boundary event
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processBoundaryTimerEvent(sequelize, 'timer-123', async (timer) => {
 *   if (timer.configuration.interrupting) {
 *     await cancelActivity(timer.activityId);
 *   }
 *   await triggerEscalation(timer);
 * });
 * ```
 */
export declare function processBoundaryTimerEvent(sequelize: Sequelize, timerId: string, boundaryHandler: (timer: WorkflowTimer) => Promise<void>, transaction?: Transaction): Promise<void>;
/**
 * Cancels all boundary timers for an activity when it completes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await cancelBoundaryTimers(
 *   sequelize,
 *   'wf-instance-123',
 *   'user-task-activity'
 * );
 * console.log(`Cancelled ${cancelled} boundary timers`);
 * ```
 */
export declare function cancelBoundaryTimers(sequelize: Sequelize, workflowInstanceId: string, activityId: string, transaction?: Transaction): Promise<number>;
/**
 * Creates a cron-based schedule for workflow execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} name - Schedule name
 * @param {string} cronExpression - Cron expression (e.g., "0 9 * * 1-5")
 * @param {string} workflowDefinitionId - Workflow definition to execute
 * @param {string} [timezone] - Timezone (default: UTC)
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CronSchedule>} Created cron schedule
 *
 * @example
 * ```typescript
 * const schedule = await createCronSchedule(
 *   sequelize,
 *   'daily-report-generation',
 *   '0 8 * * *',  // Every day at 8 AM
 *   'report-workflow',
 *   'America/New_York',
 *   { reportType: 'daily-summary' }
 * );
 * ```
 */
export declare function createCronSchedule(sequelize: Sequelize, name: string, cronExpression: string, workflowDefinitionId: string, timezone?: string, metadata?: Record<string, any>, transaction?: Transaction): Promise<CronSchedule>;
/**
 * Retrieves cron schedules due for execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [beforeDate] - Get schedules due before this date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CronSchedule[]>} Due cron schedules
 *
 * @example
 * ```typescript
 * const dueSchedules = await getDueCronSchedules(sequelize);
 * for (const schedule of dueSchedules) {
 *   await executeScheduledWorkflow(schedule);
 * }
 * ```
 */
export declare function getDueCronSchedules(sequelize: Sequelize, beforeDate?: Date, transaction?: Transaction): Promise<CronSchedule[]>;
/**
 * Updates cron schedule after execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCronScheduleAfterExecution(sequelize, 'schedule-123');
 * ```
 */
export declare function updateCronScheduleAfterExecution(sequelize: Sequelize, scheduleId: string, transaction?: Transaction): Promise<void>;
/**
 * Enables or disables a cron schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule identifier
 * @param {boolean} enabled - Whether to enable or disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await toggleCronSchedule(sequelize, 'schedule-123', false);  // Disable
 * ```
 */
export declare function toggleCronSchedule(sequelize: Sequelize, scheduleId: string, enabled: boolean, transaction?: Transaction): Promise<void>;
/**
 * Schedules a duration-based timer (ISO 8601 format).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity identifier
 * @param {string} duration - ISO 8601 duration (e.g., "PT1H", "P1D", "PT30M")
 * @param {TimerType} [timerType] - Type of timer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Created timer
 *
 * @example
 * ```typescript
 * const timer = await scheduleDurationTimer(
 *   sequelize,
 *   'wf-instance-123',
 *   'wait-activity',
 *   'PT2H30M'  // 2 hours and 30 minutes
 * );
 * ```
 */
export declare function scheduleDurationTimer(sequelize: Sequelize, workflowInstanceId: string, activityId: string, duration: string, timerType?: TimerType, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Parses ISO 8601 duration to milliseconds.
 *
 * @param {string} duration - ISO 8601 duration string
 * @returns {number} Duration in milliseconds
 *
 * @example
 * ```typescript
 * const ms = parseDuration('PT1H30M');  // 5400000 (1.5 hours)
 * const ms = parseDuration('P1D');      // 86400000 (1 day)
 * ```
 */
export declare function parseDuration(duration: string): number;
/**
 * Schedules multiple duration-based timers in bulk.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{workflowInstanceId: string, activityId: string, duration: string}>} timers - Timers to schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer[]>} Created timers
 *
 * @example
 * ```typescript
 * const timers = await scheduleBulkDurationTimers(sequelize, [
 *   { workflowInstanceId: 'wf-1', activityId: 'act-1', duration: 'PT1H' },
 *   { workflowInstanceId: 'wf-2', activityId: 'act-2', duration: 'PT2H' }
 * ]);
 * ```
 */
export declare function scheduleBulkDurationTimers(sequelize: Sequelize, timers: Array<{
    workflowInstanceId: string;
    activityId: string;
    duration: string;
}>, transaction?: Transaction): Promise<WorkflowTimer[]>;
/**
 * Schedules a cycle-based repeating timer (ISO 8601 repetition).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity identifier
 * @param {string} cycle - ISO 8601 cycle (e.g., "R3/PT1H" = repeat 3 times every hour)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Created cycle timer
 *
 * @example
 * ```typescript
 * const timer = await scheduleCycleTimer(
 *   sequelize,
 *   'wf-instance-123',
 *   'reminder-activity',
 *   'R5/PT30M'  // Repeat 5 times every 30 minutes
 * );
 * ```
 */
export declare function scheduleCycleTimer(sequelize: Sequelize, workflowInstanceId: string, activityId: string, cycle: string, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Advances a cycle timer to the next cycle.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer | null>} Updated timer or null if cycle complete
 *
 * @example
 * ```typescript
 * const nextTimer = await advanceCycleTimer(sequelize, 'timer-123');
 * if (nextTimer) {
 *   console.log(`Next cycle scheduled for ${nextTimer.scheduledAt}`);
 * } else {
 *   console.log('Cycle complete');
 * }
 * ```
 */
export declare function advanceCycleTimer(sequelize: Sequelize, timerId: string, transaction?: Transaction): Promise<WorkflowTimer | null>;
/**
 * Gets remaining cycles for a cycle timer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Remaining cycles
 *
 * @example
 * ```typescript
 * const remaining = await getRemainingCycles(sequelize, 'timer-123');
 * console.log(`${remaining} cycles remaining`);
 * ```
 */
export declare function getRemainingCycles(sequelize: Sequelize, timerId: string, transaction?: Transaction): Promise<number>;
/**
 * Cancels a scheduled timer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {string} [reason] - Cancellation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelTimer(sequelize, 'timer-123', 'User completed task early');
 * ```
 */
export declare function cancelTimer(sequelize: Sequelize, timerId: string, reason?: string, transaction?: Transaction): Promise<void>;
/**
 * Cancels all timers for a workflow instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} [reason] - Cancellation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await cancelWorkflowTimers(
 *   sequelize,
 *   'wf-instance-123',
 *   'Workflow cancelled by user'
 * );
 * ```
 */
export declare function cancelWorkflowTimers(sequelize: Sequelize, workflowInstanceId: string, reason?: string, transaction?: Transaction): Promise<number>;
/**
 * Cancels timers matching specific criteria in bulk.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} criteria - Cancellation criteria
 * @param {string} [reason] - Cancellation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTimersByCriteria(sequelize, {
 *   timerType: TimerType.REMINDER,
 *   scheduledBefore: new Date('2024-12-31')
 * }, 'Bulk cancellation');
 * ```
 */
export declare function cancelTimersByCriteria(sequelize: Sequelize, criteria: {
    timerType?: TimerType;
    activityId?: string;
    scheduledBefore?: Date;
    scheduledAfter?: Date;
}, reason?: string, transaction?: Transaction): Promise<number>;
/**
 * Reschedules a timer to a new date/time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Date} newScheduledAt - New scheduled date/time
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Updated timer
 *
 * @example
 * ```typescript
 * const newDate = new Date('2024-12-25T09:00:00Z');
 * const updated = await rescheduleTimer(sequelize, 'timer-123', newDate);
 * ```
 */
export declare function rescheduleTimer(sequelize: Sequelize, timerId: string, newScheduledAt: Date, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Reschedules a timer with a new duration from now.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {string} duration - New ISO 8601 duration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Updated timer
 *
 * @example
 * ```typescript
 * const updated = await rescheduleTimerWithDuration(
 *   sequelize,
 *   'timer-123',
 *   'PT2H'  // Reschedule to 2 hours from now
 * );
 * ```
 */
export declare function rescheduleTimerWithDuration(sequelize: Sequelize, timerId: string, duration: string, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Bulk reschedules timers matching criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} criteria - Selection criteria
 * @param {Date | string} adjustment - New date or duration adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers rescheduled
 *
 * @example
 * ```typescript
 * const rescheduled = await bulkRescheduleTimers(sequelize, {
 *   workflowInstanceId: 'wf-123',
 *   timerType: TimerType.REMINDER
 * }, 'PT1H');  // Delay all by 1 hour
 * ```
 */
export declare function bulkRescheduleTimers(sequelize: Sequelize, criteria: {
    workflowInstanceId?: string;
    timerType?: TimerType;
    activityId?: string;
}, adjustment: Date | string, transaction?: Transaction): Promise<number>;
/**
 * Persists timer state to ensure durability across restarts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WorkflowTimer} timer - Timer to persist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistTimerState(sequelize, timer);
 * ```
 */
export declare function persistTimerState(sequelize: Sequelize, timer: WorkflowTimer, transaction?: Transaction): Promise<void>;
/**
 * Loads persisted timer state from database.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowTimer>} Loaded timer
 *
 * @example
 * ```typescript
 * const timer = await loadTimerState(sequelize, 'timer-123');
 * ```
 */
export declare function loadTimerState(sequelize: Sequelize, timerId: string, transaction?: Transaction): Promise<WorkflowTimer>;
/**
 * Archives executed timers for historical analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysOld - Archive timers older than this many days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers archived
 *
 * @example
 * ```typescript
 * const archived = await archiveExecutedTimers(sequelize, 30);
 * console.log(`Archived ${archived} timers`);
 * ```
 */
export declare function archiveExecutedTimers(sequelize: Sequelize, daysOld?: number, transaction?: Transaction): Promise<number>;
/**
 * Recovers timers after system restart or failure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node identifier for distributed systems
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TimerRecoveryInfo[]>} Recovery information
 *
 * @example
 * ```typescript
 * const recoveryInfo = await recoverTimersAfterRestart(sequelize, 'node-1');
 * for (const info of recoveryInfo) {
 *   if (info.shouldExecute) {
 *     await executeRecoveredTimer(info.timerId);
 *   }
 * }
 * ```
 */
export declare function recoverTimersAfterRestart(sequelize: Sequelize, nodeId: string, transaction?: Transaction): Promise<TimerRecoveryInfo[]>;
/**
 * Processes missed timer executions based on catch-up strategy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TimerRecoveryInfo} recoveryInfo - Recovery information
 * @param {Function} executionHandler - Handler to execute timer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers executed
 *
 * @example
 * ```typescript
 * const executed = await processMissedTimers(
 *   sequelize,
 *   recoveryInfo,
 *   async (timer) => { await triggerWorkflow(timer); }
 * );
 * ```
 */
export declare function processMissedTimers(sequelize: Sequelize, recoveryInfo: TimerRecoveryInfo, executionHandler: (timer: WorkflowTimer, executionDate: Date) => Promise<void>, transaction?: Transaction): Promise<number>;
/**
 * Marks stale timers as failed after recovery timeout.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} timeoutMinutes - Minutes after which timers are considered stale
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of timers marked as failed
 *
 * @example
 * ```typescript
 * const failed = await markStaleTimersAsFailed(sequelize, 60);  // 1 hour timeout
 * ```
 */
export declare function markStaleTimersAsFailed(sequelize: Sequelize, timeoutMinutes?: number, transaction?: Transaction): Promise<number>;
/**
 * Acquires a distributed lock for timer execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {string} nodeId - Node identifier
 * @param {number} [lockDurationMs] - Lock duration in milliseconds
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DistributedTimerLock | null>} Lock if acquired, null otherwise
 *
 * @example
 * ```typescript
 * const lock = await acquireTimerLock(sequelize, 'timer-123', 'node-1', 30000);
 * if (lock) {
 *   try {
 *     await executeTimer(timerId);
 *   } finally {
 *     await releaseTimerLock(sequelize, timerId);
 *   }
 * }
 * ```
 */
export declare function acquireTimerLock(sequelize: Sequelize, timerId: string, nodeId: string, lockDurationMs?: number, transaction?: Transaction): Promise<DistributedTimerLock | null>;
/**
 * Releases a distributed timer lock.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseTimerLock(sequelize, 'timer-123');
 * ```
 */
export declare function releaseTimerLock(sequelize: Sequelize, timerId: string, transaction?: Transaction): Promise<void>;
/**
 * Cleans up expired distributed locks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of locks cleaned up
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredLocks(sequelize);
 * ```
 */
export declare function cleanupExpiredLocks(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Gets scheduler health metrics for monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SchedulerHealth>} Health metrics
 *
 * @example
 * ```typescript
 * const health = await getSchedulerHealth(sequelize, 'node-1');
 * console.log(`Active timers: ${health.activeTimers}`);
 * ```
 */
export declare function getSchedulerHealth(sequelize: Sequelize, nodeId: string, transaction?: Transaction): Promise<SchedulerHealth>;
/**
 * Executes timer with distributed coordination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} timerId - Timer identifier
 * @param {string} nodeId - Node identifier
 * @param {Function} executionHandler - Execution handler
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if executed, false if lock not acquired
 *
 * @example
 * ```typescript
 * const executed = await executeTimerWithCoordination(
 *   sequelize,
 *   'timer-123',
 *   'node-1',
 *   async (timer) => { await triggerWorkflow(timer); }
 * );
 * ```
 */
export declare function executeTimerWithCoordination(sequelize: Sequelize, timerId: string, nodeId: string, executionHandler: (timer: WorkflowTimer) => Promise<void>, transaction?: Transaction): Promise<boolean>;
declare const _default: {
    scheduleTimerStartEvent: typeof scheduleTimerStartEvent;
    scheduleBulkTimerStartEvents: typeof scheduleBulkTimerStartEvents;
    getDueTimerStartEvents: typeof getDueTimerStartEvents;
    createIntermediateTimerEvent: typeof createIntermediateTimerEvent;
    waitForIntermediateTimer: typeof waitForIntermediateTimer;
    getIntermediateTimers: typeof getIntermediateTimers;
    attachTimerBoundaryEvent: typeof attachTimerBoundaryEvent;
    processBoundaryTimerEvent: typeof processBoundaryTimerEvent;
    cancelBoundaryTimers: typeof cancelBoundaryTimers;
    createCronSchedule: typeof createCronSchedule;
    getDueCronSchedules: typeof getDueCronSchedules;
    updateCronScheduleAfterExecution: typeof updateCronScheduleAfterExecution;
    toggleCronSchedule: typeof toggleCronSchedule;
    scheduleDurationTimer: typeof scheduleDurationTimer;
    parseDuration: typeof parseDuration;
    scheduleBulkDurationTimers: typeof scheduleBulkDurationTimers;
    scheduleCycleTimer: typeof scheduleCycleTimer;
    advanceCycleTimer: typeof advanceCycleTimer;
    getRemainingCycles: typeof getRemainingCycles;
    cancelTimer: typeof cancelTimer;
    cancelWorkflowTimers: typeof cancelWorkflowTimers;
    cancelTimersByCriteria: typeof cancelTimersByCriteria;
    rescheduleTimer: typeof rescheduleTimer;
    rescheduleTimerWithDuration: typeof rescheduleTimerWithDuration;
    bulkRescheduleTimers: typeof bulkRescheduleTimers;
    persistTimerState: typeof persistTimerState;
    loadTimerState: typeof loadTimerState;
    archiveExecutedTimers: typeof archiveExecutedTimers;
    recoverTimersAfterRestart: typeof recoverTimersAfterRestart;
    processMissedTimers: typeof processMissedTimers;
    markStaleTimersAsFailed: typeof markStaleTimersAsFailed;
    acquireTimerLock: typeof acquireTimerLock;
    releaseTimerLock: typeof releaseTimerLock;
    cleanupExpiredLocks: typeof cleanupExpiredLocks;
    getSchedulerHealth: typeof getSchedulerHealth;
    executeTimerWithCoordination: typeof executeTimerWithCoordination;
};
export default _default;
//# sourceMappingURL=workflow-timer-scheduling.d.ts.map
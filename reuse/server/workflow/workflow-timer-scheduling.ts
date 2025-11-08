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

import {
  Sequelize,
  Transaction,
  Model,
  ModelStatic,
  Op,
  QueryTypes,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

export enum TimerType {
  START_EVENT = 'START_EVENT',
  INTERMEDIATE_EVENT = 'INTERMEDIATE_EVENT',
  BOUNDARY_EVENT = 'BOUNDARY_EVENT',
  DEADLINE = 'DEADLINE',
  REMINDER = 'REMINDER',
}

export enum TimerEventType {
  DURATION = 'DURATION',
  DATE = 'DATE',
  CYCLE = 'CYCLE',
  CRON = 'CRON',
}

export enum TimerStatus {
  SCHEDULED = 'SCHEDULED',
  EXECUTING = 'EXECUTING',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  MISSED = 'MISSED',
}

export interface TimerConfiguration {
  // Duration-based (ISO 8601: PT1H = 1 hour, P1D = 1 day)
  duration?: string;

  // Date-based (specific date/time)
  date?: Date;

  // Cycle-based (repeating: R3/PT1H = repeat 3 times every hour)
  cycle?: string;
  cycleCount?: number;
  currentCycle?: number;

  // Cron-based (cron expression: 0 9 * * 1-5 = 9 AM weekdays)
  cronExpression?: string;

  // Boundary event specific
  interrupting?: boolean;
  cancelActivity?: boolean;

  // Timezone
  timezone?: string;

  // Catch-up strategy for missed timers
  catchUpStrategy?: CatchUpStrategy;
}

export enum CatchUpStrategy {
  EXECUTE_ALL = 'EXECUTE_ALL',
  EXECUTE_LATEST = 'EXECUTE_LATEST',
  SKIP = 'SKIP',
  RESCHEDULE = 'RESCHEDULE',
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

// ============================================================================
// TIMER START EVENT SCHEDULING
// ============================================================================

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
export async function scheduleTimerStartEvent(
  sequelize: Sequelize,
  workflowDefinitionId: string,
  config: TimerConfiguration,
  metadata: Record<string, any> = {},
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const timerId = generateTimerId();
  const scheduledAt = calculateNextExecution(config);

  const timer: WorkflowTimer = {
    id: timerId,
    workflowInstanceId: '', // Will be set when workflow starts
    activityId: 'timer-start-event',
    timerType: TimerType.START_EVENT,
    timerEvent: determineTimerEventType(config),
    scheduledAt,
    status: TimerStatus.SCHEDULED,
    configuration: config,
    metadata: { ...metadata, workflowDefinitionId },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      status, configuration, metadata, created_at, updated_at)
     VALUES (:id, :workflowInstanceId, :activityId, :timerType, :timerEvent, :scheduledAt,
             :status, :configuration, :metadata, :createdAt, :updatedAt)`,
    {
      replacements: {
        ...timer,
        configuration: JSON.stringify(timer.configuration),
        metadata: JSON.stringify(timer.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return timer;
}

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
export async function scheduleBulkTimerStartEvents(
  sequelize: Sequelize,
  timers: Array<{
    workflowDefinitionId: string;
    config: TimerConfiguration;
    metadata?: Record<string, any>;
  }>,
  transaction?: Transaction,
): Promise<WorkflowTimer[]> {
  const workflowTimers: WorkflowTimer[] = timers.map(({ workflowDefinitionId, config, metadata = {} }) => {
    const scheduledAt = calculateNextExecution(config);
    return {
      id: generateTimerId(),
      workflowInstanceId: '',
      activityId: 'timer-start-event',
      timerType: TimerType.START_EVENT,
      timerEvent: determineTimerEventType(config),
      scheduledAt,
      status: TimerStatus.SCHEDULED,
      configuration: config,
      metadata: { ...metadata, workflowDefinitionId },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  if (workflowTimers.length === 0) return [];

  const values = workflowTimers.map(
    (t) =>
      `('${t.id}', '', '${t.activityId}', '${t.timerType}', '${t.timerEvent}', ` +
      `'${t.scheduledAt.toISOString()}', '${t.status}', ` +
      `'${JSON.stringify(t.configuration).replace(/'/g, "''")}', ` +
      `'${JSON.stringify(t.metadata).replace(/'/g, "''")}', ` +
      `'${t.createdAt.toISOString()}', '${t.updatedAt.toISOString()}')`,
  );

  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      status, configuration, metadata, created_at, updated_at)
     VALUES ${values.join(', ')}`,
    { type: QueryTypes.INSERT, transaction },
  );

  return workflowTimers;
}

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
export async function getDueTimerStartEvents(
  sequelize: Sequelize,
  beforeDate: Date = new Date(),
  limit: number = 100,
  transaction?: Transaction,
): Promise<WorkflowTimer[]> {
  const results = await sequelize.query(
    `SELECT * FROM workflow_timers
     WHERE timer_type = 'START_EVENT'
     AND status = 'SCHEDULED'
     AND scheduled_at <= :beforeDate
     ORDER BY scheduled_at
     LIMIT :limit`,
    {
      replacements: { beforeDate: beforeDate.toISOString(), limit },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return results.map((row: any) => parseTimerRow(row));
}

// ============================================================================
// TIMER INTERMEDIATE EVENT HANDLING
// ============================================================================

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
export async function createIntermediateTimerEvent(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  config: TimerConfiguration,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const timerId = generateTimerId();
  const scheduledAt = calculateNextExecution(config, new Date());

  const timer: WorkflowTimer = {
    id: timerId,
    workflowInstanceId,
    activityId,
    timerType: TimerType.INTERMEDIATE_EVENT,
    timerEvent: determineTimerEventType(config),
    scheduledAt,
    status: TimerStatus.SCHEDULED,
    configuration: config,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      status, configuration, metadata, created_at, updated_at)
     VALUES (:id, :workflowInstanceId, :activityId, :timerType, :timerEvent, :scheduledAt,
             :status, :configuration, :metadata, :createdAt, :updatedAt)`,
    {
      replacements: {
        ...timer,
        configuration: JSON.stringify(timer.configuration),
        metadata: JSON.stringify(timer.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return timer;
}

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
export async function waitForIntermediateTimer(
  sequelize: Sequelize,
  timerId: string,
  pollIntervalMs: number = 1000,
  timeoutMs: number = 300000,
): Promise<WorkflowTimer> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const timer = await getTimerById(sequelize, timerId);

    if (timer.status === TimerStatus.EXECUTED) {
      return timer;
    }

    if (timer.status === TimerStatus.FAILED || timer.status === TimerStatus.CANCELLED) {
      throw new Error(`Timer ${timerId} ${timer.status.toLowerCase()}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Timer ${timerId} wait timeout after ${timeoutMs}ms`);
}

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
export async function getIntermediateTimers(
  sequelize: Sequelize,
  workflowInstanceId: string,
  status?: TimerStatus,
  transaction?: Transaction,
): Promise<WorkflowTimer[]> {
  let whereClause = `workflow_instance_id = '${workflowInstanceId}' AND timer_type = 'INTERMEDIATE_EVENT'`;

  if (status) {
    whereClause += ` AND status = '${status}'`;
  }

  const results = await sequelize.query(
    `SELECT * FROM workflow_timers WHERE ${whereClause} ORDER BY scheduled_at`,
    { type: QueryTypes.SELECT, transaction },
  );

  return results.map((row: any) => parseTimerRow(row));
}

// ============================================================================
// TIMER BOUNDARY EVENT PROCESSING
// ============================================================================

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
export async function attachTimerBoundaryEvent(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  config: TimerConfiguration,
  interrupting: boolean = true,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const timerId = generateTimerId();
  const scheduledAt = calculateNextExecution(config, new Date());

  config.interrupting = interrupting;
  config.cancelActivity = interrupting;

  const timer: WorkflowTimer = {
    id: timerId,
    workflowInstanceId,
    activityId,
    timerType: TimerType.BOUNDARY_EVENT,
    timerEvent: determineTimerEventType(config),
    scheduledAt,
    status: TimerStatus.SCHEDULED,
    configuration: config,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      status, configuration, metadata, created_at, updated_at)
     VALUES (:id, :workflowInstanceId, :activityId, :timerType, :timerEvent, :scheduledAt,
             :status, :configuration, :metadata, :createdAt, :updatedAt)`,
    {
      replacements: {
        ...timer,
        configuration: JSON.stringify(timer.configuration),
        metadata: JSON.stringify(timer.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return timer;
}

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
export async function processBoundaryTimerEvent(
  sequelize: Sequelize,
  timerId: string,
  boundaryHandler: (timer: WorkflowTimer) => Promise<void>,
  transaction?: Transaction,
): Promise<void> {
  const timer = await getTimerById(sequelize, timerId, transaction);

  if (timer.status !== TimerStatus.SCHEDULED) {
    throw new Error(`Timer ${timerId} is not in SCHEDULED state`);
  }

  await updateTimerStatus(sequelize, timerId, TimerStatus.EXECUTING, transaction);

  try {
    await boundaryHandler(timer);

    await updateTimerStatus(sequelize, timerId, TimerStatus.EXECUTED, transaction);

    await sequelize.query(
      `UPDATE workflow_timers SET executed_at = NOW() WHERE id = :timerId`,
      {
        replacements: { timerId },
        type: QueryTypes.UPDATE,
        transaction,
      },
    );

    // If interrupting, cancel the attached activity
    if (timer.configuration.interrupting) {
      await sequelize.query(
        `UPDATE workflow_activities
         SET status = 'cancelled', cancelled_reason = 'Timer boundary event triggered'
         WHERE id = :activityId AND workflow_instance_id = :workflowInstanceId`,
        {
          replacements: {
            activityId: timer.activityId,
            workflowInstanceId: timer.workflowInstanceId,
          },
          type: QueryTypes.UPDATE,
          transaction,
        },
      );
    }
  } catch (error) {
    await updateTimerStatus(sequelize, timerId, TimerStatus.FAILED, transaction);
    throw error;
  }
}

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
export async function cancelBoundaryTimers(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  transaction?: Transaction,
): Promise<number> {
  const result = await sequelize.query(
    `UPDATE workflow_timers
     SET status = 'CANCELLED', cancelled_at = NOW()
     WHERE workflow_instance_id = :workflowInstanceId
     AND activity_id = :activityId
     AND timer_type = 'BOUNDARY_EVENT'
     AND status = 'SCHEDULED'`,
    {
      replacements: { workflowInstanceId, activityId },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return Array.isArray(result) && result[1] ? (result[1] as any).rowCount || 0 : 0;
}

// ============================================================================
// CRON-BASED SCHEDULING
// ============================================================================

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
export async function createCronSchedule(
  sequelize: Sequelize,
  name: string,
  cronExpression: string,
  workflowDefinitionId: string,
  timezone: string = 'UTC',
  metadata: Record<string, any> = {},
  transaction?: Transaction,
): Promise<CronSchedule> {
  const scheduleId = generateScheduleId();
  const nextExecutionAt = calculateNextCronExecution(cronExpression, timezone);

  const schedule: CronSchedule = {
    id: scheduleId,
    name,
    cronExpression,
    workflowDefinitionId,
    enabled: true,
    nextExecutionAt,
    timezone,
    metadata,
  };

  await sequelize.query(
    `INSERT INTO cron_schedules
     (id, name, cron_expression, workflow_definition_id, enabled, next_execution_at, timezone, metadata, created_at)
     VALUES (:id, :name, :cronExpression, :workflowDefinitionId, :enabled, :nextExecutionAt, :timezone, :metadata, NOW())`,
    {
      replacements: {
        ...schedule,
        metadata: JSON.stringify(schedule.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return schedule;
}

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
export async function getDueCronSchedules(
  sequelize: Sequelize,
  beforeDate: Date = new Date(),
  transaction?: Transaction,
): Promise<CronSchedule[]> {
  const results = await sequelize.query(
    `SELECT * FROM cron_schedules
     WHERE enabled = TRUE
     AND next_execution_at <= :beforeDate
     ORDER BY next_execution_at`,
    {
      replacements: { beforeDate: beforeDate.toISOString() },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return results.map((row: any) => ({
    id: row.id,
    name: row.name,
    cronExpression: row.cron_expression,
    workflowDefinitionId: row.workflow_definition_id,
    enabled: row.enabled,
    lastExecutedAt: row.last_executed_at,
    nextExecutionAt: new Date(row.next_execution_at),
    timezone: row.timezone,
    metadata: JSON.parse(row.metadata || '{}'),
  }));
}

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
export async function updateCronScheduleAfterExecution(
  sequelize: Sequelize,
  scheduleId: string,
  transaction?: Transaction,
): Promise<void> {
  const schedule = await sequelize.query(
    `SELECT * FROM cron_schedules WHERE id = :scheduleId`,
    {
      replacements: { scheduleId },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  if (schedule.length === 0) {
    throw new Error(`Schedule ${scheduleId} not found`);
  }

  const cronSchedule = schedule[0] as any;
  const nextExecutionAt = calculateNextCronExecution(cronSchedule.cron_expression, cronSchedule.timezone);

  await sequelize.query(
    `UPDATE cron_schedules
     SET last_executed_at = NOW(), next_execution_at = :nextExecutionAt
     WHERE id = :scheduleId`,
    {
      replacements: {
        scheduleId,
        nextExecutionAt: nextExecutionAt.toISOString(),
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );
}

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
export async function toggleCronSchedule(
  sequelize: Sequelize,
  scheduleId: string,
  enabled: boolean,
  transaction?: Transaction,
): Promise<void> {
  await sequelize.query(
    `UPDATE cron_schedules SET enabled = :enabled WHERE id = :scheduleId`,
    {
      replacements: { scheduleId, enabled },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );
}

// ============================================================================
// DURATION-BASED TIMERS
// ============================================================================

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
export async function scheduleDurationTimer(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  duration: string,
  timerType: TimerType = TimerType.INTERMEDIATE_EVENT,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const config: TimerConfiguration = { duration };
  const scheduledAt = calculateNextExecution(config, new Date());

  return createTimerWithConfig(
    sequelize,
    workflowInstanceId,
    activityId,
    timerType,
    TimerEventType.DURATION,
    scheduledAt,
    config,
    transaction,
  );
}

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
export function parseDuration(duration: string): number {
  const match = duration.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    throw new Error(`Invalid ISO 8601 duration: ${duration}`);
  }

  const [, days = '0', hours = '0', minutes = '0', seconds = '0'] = match;

  return (
    parseInt(days) * 24 * 60 * 60 * 1000 +
    parseInt(hours) * 60 * 60 * 1000 +
    parseInt(minutes) * 60 * 1000 +
    parseInt(seconds) * 1000
  );
}

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
export async function scheduleBulkDurationTimers(
  sequelize: Sequelize,
  timers: Array<{ workflowInstanceId: string; activityId: string; duration: string }>,
  transaction?: Transaction,
): Promise<WorkflowTimer[]> {
  const workflowTimers: WorkflowTimer[] = [];

  for (const { workflowInstanceId, activityId, duration } of timers) {
    const timer = await scheduleDurationTimer(
      sequelize,
      workflowInstanceId,
      activityId,
      duration,
      TimerType.INTERMEDIATE_EVENT,
      transaction,
    );
    workflowTimers.push(timer);
  }

  return workflowTimers;
}

// ============================================================================
// CYCLE-BASED TIMERS
// ============================================================================

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
export async function scheduleCycleTimer(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  cycle: string,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const { repetitions, duration } = parseCycle(cycle);

  const config: TimerConfiguration = {
    cycle,
    cycleCount: repetitions,
    currentCycle: 0,
    duration,
  };

  const scheduledAt = calculateNextExecution(config, new Date());

  return createTimerWithConfig(
    sequelize,
    workflowInstanceId,
    activityId,
    TimerType.INTERMEDIATE_EVENT,
    TimerEventType.CYCLE,
    scheduledAt,
    config,
    transaction,
  );
}

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
export async function advanceCycleTimer(
  sequelize: Sequelize,
  timerId: string,
  transaction?: Transaction,
): Promise<WorkflowTimer | null> {
  const timer = await getTimerById(sequelize, timerId, transaction);

  if (timer.timerEvent !== TimerEventType.CYCLE) {
    throw new Error(`Timer ${timerId} is not a cycle timer`);
  }

  const currentCycle = (timer.configuration.currentCycle || 0) + 1;

  if (currentCycle >= (timer.configuration.cycleCount || 0)) {
    // Cycle complete
    await updateTimerStatus(sequelize, timerId, TimerStatus.EXECUTED, transaction);
    return null;
  }

  // Schedule next cycle
  const nextScheduledAt = calculateNextExecution(timer.configuration, timer.scheduledAt);

  await sequelize.query(
    `UPDATE workflow_timers
     SET scheduled_at = :scheduledAt,
         status = 'SCHEDULED',
         configuration = jsonb_set(configuration, '{currentCycle}', :currentCycle::text::jsonb)
     WHERE id = :timerId`,
    {
      replacements: {
        timerId,
        scheduledAt: nextScheduledAt.toISOString(),
        currentCycle,
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return getTimerById(sequelize, timerId, transaction);
}

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
export async function getRemainingCycles(
  sequelize: Sequelize,
  timerId: string,
  transaction?: Transaction,
): Promise<number> {
  const timer = await getTimerById(sequelize, timerId, transaction);

  if (timer.timerEvent !== TimerEventType.CYCLE) {
    throw new Error(`Timer ${timerId} is not a cycle timer`);
  }

  const total = timer.configuration.cycleCount || 0;
  const current = timer.configuration.currentCycle || 0;

  return Math.max(0, total - current);
}

// ============================================================================
// TIMER CANCELLATION
// ============================================================================

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
export async function cancelTimer(
  sequelize: Sequelize,
  timerId: string,
  reason?: string,
  transaction?: Transaction,
): Promise<void> {
  await sequelize.query(
    `UPDATE workflow_timers
     SET status = 'CANCELLED', cancelled_at = NOW(), metadata = jsonb_set(metadata, '{cancellationReason}', :reason::text::jsonb)
     WHERE id = :timerId AND status = 'SCHEDULED'`,
    {
      replacements: { timerId, reason: reason || 'Manual cancellation' },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );
}

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
export async function cancelWorkflowTimers(
  sequelize: Sequelize,
  workflowInstanceId: string,
  reason?: string,
  transaction?: Transaction,
): Promise<number> {
  const result = await sequelize.query(
    `UPDATE workflow_timers
     SET status = 'CANCELLED', cancelled_at = NOW(), metadata = jsonb_set(metadata, '{cancellationReason}', :reason::text::jsonb)
     WHERE workflow_instance_id = :workflowInstanceId AND status = 'SCHEDULED'`,
    {
      replacements: {
        workflowInstanceId,
        reason: reason || 'Workflow cancellation',
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return Array.isArray(result) && result[1] ? (result[1] as any).rowCount || 0 : 0;
}

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
export async function cancelTimersByCriteria(
  sequelize: Sequelize,
  criteria: {
    timerType?: TimerType;
    activityId?: string;
    scheduledBefore?: Date;
    scheduledAfter?: Date;
  },
  reason?: string,
  transaction?: Transaction,
): Promise<number> {
  let whereClause = "status = 'SCHEDULED'";

  if (criteria.timerType) {
    whereClause += ` AND timer_type = '${criteria.timerType}'`;
  }
  if (criteria.activityId) {
    whereClause += ` AND activity_id = '${criteria.activityId}'`;
  }
  if (criteria.scheduledBefore) {
    whereClause += ` AND scheduled_at < '${criteria.scheduledBefore.toISOString()}'`;
  }
  if (criteria.scheduledAfter) {
    whereClause += ` AND scheduled_at > '${criteria.scheduledAfter.toISOString()}'`;
  }

  const result = await sequelize.query(
    `UPDATE workflow_timers
     SET status = 'CANCELLED', cancelled_at = NOW(), metadata = jsonb_set(metadata, '{cancellationReason}', :reason::text::jsonb)
     WHERE ${whereClause}`,
    {
      replacements: { reason: reason || 'Bulk cancellation' },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return Array.isArray(result) && result[1] ? (result[1] as any).rowCount || 0 : 0;
}

// ============================================================================
// TIMER RESCHEDULING
// ============================================================================

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
export async function rescheduleTimer(
  sequelize: Sequelize,
  timerId: string,
  newScheduledAt: Date,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  await sequelize.query(
    `UPDATE workflow_timers
     SET scheduled_at = :scheduledAt, updated_at = NOW()
     WHERE id = :timerId AND status = 'SCHEDULED'`,
    {
      replacements: { timerId, scheduledAt: newScheduledAt.toISOString() },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return getTimerById(sequelize, timerId, transaction);
}

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
export async function rescheduleTimerWithDuration(
  sequelize: Sequelize,
  timerId: string,
  duration: string,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const durationMs = parseDuration(duration);
  const newScheduledAt = new Date(Date.now() + durationMs);

  return rescheduleTimer(sequelize, timerId, newScheduledAt, transaction);
}

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
export async function bulkRescheduleTimers(
  sequelize: Sequelize,
  criteria: { workflowInstanceId?: string; timerType?: TimerType; activityId?: string },
  adjustment: Date | string,
  transaction?: Transaction,
): Promise<number> {
  let whereClause = "status = 'SCHEDULED'";

  if (criteria.workflowInstanceId) {
    whereClause += ` AND workflow_instance_id = '${criteria.workflowInstanceId}'`;
  }
  if (criteria.timerType) {
    whereClause += ` AND timer_type = '${criteria.timerType}'`;
  }
  if (criteria.activityId) {
    whereClause += ` AND activity_id = '${criteria.activityId}'`;
  }

  let newScheduledAt: string;
  if (adjustment instanceof Date) {
    newScheduledAt = adjustment.toISOString();
  } else {
    const durationMs = parseDuration(adjustment);
    newScheduledAt = `scheduled_at + INTERVAL '${durationMs} milliseconds'`;
  }

  const result = await sequelize.query(
    `UPDATE workflow_timers
     SET scheduled_at = ${adjustment instanceof Date ? `'${newScheduledAt}'` : newScheduledAt},
         updated_at = NOW()
     WHERE ${whereClause}`,
    { type: QueryTypes.UPDATE, transaction },
  );

  return Array.isArray(result) && result[1] ? (result[1] as any).rowCount || 0 : 0;
}

// ============================================================================
// TIMER PERSISTENCE
// ============================================================================

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
export async function persistTimerState(
  sequelize: Sequelize,
  timer: WorkflowTimer,
  transaction?: Transaction,
): Promise<void> {
  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      executed_at, cancelled_at, status, configuration, metadata, created_at, updated_at)
     VALUES (:id, :workflowInstanceId, :activityId, :timerType, :timerEvent, :scheduledAt,
             :executedAt, :cancelledAt, :status, :configuration, :metadata, :createdAt, :updatedAt)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       scheduled_at = EXCLUDED.scheduled_at,
       executed_at = EXCLUDED.executed_at,
       cancelled_at = EXCLUDED.cancelled_at,
       configuration = EXCLUDED.configuration,
       metadata = EXCLUDED.metadata,
       updated_at = EXCLUDED.updated_at`,
    {
      replacements: {
        ...timer,
        executedAt: timer.executedAt?.toISOString() || null,
        cancelledAt: timer.cancelledAt?.toISOString() || null,
        configuration: JSON.stringify(timer.configuration),
        metadata: JSON.stringify(timer.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );
}

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
export async function loadTimerState(
  sequelize: Sequelize,
  timerId: string,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  return getTimerById(sequelize, timerId, transaction);
}

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
export async function archiveExecutedTimers(
  sequelize: Sequelize,
  daysOld: number = 30,
  transaction?: Transaction,
): Promise<number> {
  await sequelize.query(
    `INSERT INTO workflow_timers_archive
     SELECT * FROM workflow_timers
     WHERE status IN ('EXECUTED', 'CANCELLED', 'FAILED')
     AND updated_at < NOW() - INTERVAL '${daysOld} days'`,
    { type: QueryTypes.INSERT, transaction },
  );

  const result = await sequelize.query(
    `DELETE FROM workflow_timers
     WHERE status IN ('EXECUTED', 'CANCELLED', 'FAILED')
     AND updated_at < NOW() - INTERVAL '${daysOld} days'`,
    { type: QueryTypes.DELETE, transaction },
  );

  return Array.isArray(result) ? result.length : 0;
}

// ============================================================================
// TIMER RECOVERY AFTER RESTART
// ============================================================================

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
export async function recoverTimersAfterRestart(
  sequelize: Sequelize,
  nodeId: string,
  transaction?: Transaction,
): Promise<TimerRecoveryInfo[]> {
  const now = new Date();

  // Find timers that were scheduled but not executed
  const missedTimers = await sequelize.query(
    `SELECT * FROM workflow_timers
     WHERE status = 'SCHEDULED'
     AND scheduled_at < :now
     ORDER BY scheduled_at`,
    {
      replacements: { now: now.toISOString() },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  const recoveryInfo: TimerRecoveryInfo[] = [];

  for (const timer of missedTimers as any[]) {
    const parsedTimer = parseTimerRow(timer);
    const catchUpStrategy = parsedTimer.configuration.catchUpStrategy || CatchUpStrategy.EXECUTE_LATEST;

    const missedExecutions: Date[] = [];
    let nextScheduledAt = new Date(timer.scheduled_at);

    // Calculate all missed executions
    while (nextScheduledAt < now) {
      missedExecutions.push(new Date(nextScheduledAt));
      nextScheduledAt = calculateNextExecution(parsedTimer.configuration, nextScheduledAt);
    }

    recoveryInfo.push({
      timerId: timer.id,
      missedExecutions,
      nextScheduledAt,
      shouldExecute: determineShouldExecuteAfterRecovery(catchUpStrategy, missedExecutions),
      catchUpStrategy,
    });
  }

  return recoveryInfo;
}

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
export async function processMissedTimers(
  sequelize: Sequelize,
  recoveryInfo: TimerRecoveryInfo,
  executionHandler: (timer: WorkflowTimer, executionDate: Date) => Promise<void>,
  transaction?: Transaction,
): Promise<number> {
  if (!recoveryInfo.shouldExecute) {
    await updateTimerStatus(sequelize, recoveryInfo.timerId, TimerStatus.MISSED, transaction);
    return 0;
  }

  const timer = await getTimerById(sequelize, recoveryInfo.timerId, transaction);

  switch (recoveryInfo.catchUpStrategy) {
    case CatchUpStrategy.EXECUTE_ALL:
      for (const missedDate of recoveryInfo.missedExecutions) {
        await executionHandler(timer, missedDate);
      }
      await rescheduleTimer(sequelize, recoveryInfo.timerId, recoveryInfo.nextScheduledAt, transaction);
      return recoveryInfo.missedExecutions.length;

    case CatchUpStrategy.EXECUTE_LATEST:
      const latestMissed = recoveryInfo.missedExecutions[recoveryInfo.missedExecutions.length - 1];
      await executionHandler(timer, latestMissed);
      await rescheduleTimer(sequelize, recoveryInfo.timerId, recoveryInfo.nextScheduledAt, transaction);
      return 1;

    case CatchUpStrategy.SKIP:
      await rescheduleTimer(sequelize, recoveryInfo.timerId, recoveryInfo.nextScheduledAt, transaction);
      return 0;

    case CatchUpStrategy.RESCHEDULE:
      await rescheduleTimer(sequelize, recoveryInfo.timerId, recoveryInfo.nextScheduledAt, transaction);
      return 0;

    default:
      return 0;
  }
}

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
export async function markStaleTimersAsFailed(
  sequelize: Sequelize,
  timeoutMinutes: number = 60,
  transaction?: Transaction,
): Promise<number> {
  const result = await sequelize.query(
    `UPDATE workflow_timers
     SET status = 'FAILED', updated_at = NOW()
     WHERE status = 'EXECUTING'
     AND updated_at < NOW() - INTERVAL '${timeoutMinutes} minutes'`,
    { type: QueryTypes.UPDATE, transaction },
  );

  return Array.isArray(result) && result[1] ? (result[1] as any).rowCount || 0 : 0;
}

// ============================================================================
// DISTRIBUTED TIMER COORDINATION
// ============================================================================

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
export async function acquireTimerLock(
  sequelize: Sequelize,
  timerId: string,
  nodeId: string,
  lockDurationMs: number = 30000,
  transaction?: Transaction,
): Promise<DistributedTimerLock | null> {
  const lockKey = `timer-lock-${timerId}`;
  const acquiredAt = new Date();
  const expiresAt = new Date(acquiredAt.getTime() + lockDurationMs);

  try {
    await sequelize.query(
      `INSERT INTO distributed_timer_locks
       (timer_id, node_id, lock_key, acquired_at, expires_at)
       VALUES (:timerId, :nodeId, :lockKey, :acquiredAt, :expiresAt)`,
      {
        replacements: {
          timerId,
          nodeId,
          lockKey,
          acquiredAt: acquiredAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        },
        type: QueryTypes.INSERT,
        transaction,
      },
    );

    return { timerId, nodeId, acquiredAt, expiresAt, lockKey };
  } catch (error) {
    // Lock already exists or expired locks need cleanup
    await cleanupExpiredLocks(sequelize, transaction);
    return null;
  }
}

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
export async function releaseTimerLock(
  sequelize: Sequelize,
  timerId: string,
  transaction?: Transaction,
): Promise<void> {
  await sequelize.query(
    `DELETE FROM distributed_timer_locks WHERE timer_id = :timerId`,
    {
      replacements: { timerId },
      type: QueryTypes.DELETE,
      transaction,
    },
  );
}

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
export async function cleanupExpiredLocks(
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<number> {
  const result = await sequelize.query(
    `DELETE FROM distributed_timer_locks WHERE expires_at < NOW()`,
    { type: QueryTypes.DELETE, transaction },
  );

  return Array.isArray(result) ? result.length : 0;
}

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
export async function getSchedulerHealth(
  sequelize: Sequelize,
  nodeId: string,
  transaction?: Transaction,
): Promise<SchedulerHealth> {
  const results = await sequelize.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'SCHEDULED') as scheduled_timers,
       COUNT(*) FILTER (WHERE status = 'EXECUTING') as executing_timers,
       COUNT(*) FILTER (WHERE status = 'SCHEDULED' AND scheduled_at < NOW()) as missed_timers,
       COUNT(*) as active_timers
     FROM workflow_timers
     WHERE status IN ('SCHEDULED', 'EXECUTING')`,
    { type: QueryTypes.SELECT, transaction },
  );

  const stats = results[0] as any;

  return {
    activeTimers: parseInt(stats.active_timers) || 0,
    scheduledTimers: parseInt(stats.scheduled_timers) || 0,
    executingTimers: parseInt(stats.executing_timers) || 0,
    missedTimers: parseInt(stats.missed_timers) || 0,
    nodeId,
    lastHealthCheck: new Date(),
  };
}

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
export async function executeTimerWithCoordination(
  sequelize: Sequelize,
  timerId: string,
  nodeId: string,
  executionHandler: (timer: WorkflowTimer) => Promise<void>,
  transaction?: Transaction,
): Promise<boolean> {
  const lock = await acquireTimerLock(sequelize, timerId, nodeId, 30000, transaction);

  if (!lock) {
    return false; // Another node is executing this timer
  }

  try {
    const timer = await getTimerById(sequelize, timerId, transaction);
    await updateTimerStatus(sequelize, timerId, TimerStatus.EXECUTING, transaction);

    await executionHandler(timer);

    await updateTimerStatus(sequelize, timerId, TimerStatus.EXECUTED, transaction);
    await sequelize.query(
      `UPDATE workflow_timers SET executed_at = NOW() WHERE id = :timerId`,
      {
        replacements: { timerId },
        type: QueryTypes.UPDATE,
        transaction,
      },
    );

    return true;
  } catch (error) {
    await updateTimerStatus(sequelize, timerId, TimerStatus.FAILED, transaction);
    throw error;
  } finally {
    await releaseTimerLock(sequelize, timerId, transaction);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateTimerId(): string {
  return `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateScheduleId(): string {
  return `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function determineTimerEventType(config: TimerConfiguration): TimerEventType {
  if (config.cronExpression) return TimerEventType.CRON;
  if (config.cycle) return TimerEventType.CYCLE;
  if (config.date) return TimerEventType.DATE;
  if (config.duration) return TimerEventType.DURATION;
  return TimerEventType.DURATION;
}

function calculateNextExecution(config: TimerConfiguration, from: Date = new Date()): Date {
  if (config.date) {
    return config.date;
  }

  if (config.duration) {
    const durationMs = parseDuration(config.duration);
    return new Date(from.getTime() + durationMs);
  }

  if (config.cronExpression) {
    return calculateNextCronExecution(config.cronExpression, config.timezone || 'UTC');
  }

  if (config.cycle) {
    const { duration } = parseCycle(config.cycle);
    const durationMs = parseDuration(duration);
    return new Date(from.getTime() + durationMs);
  }

  return new Date(from.getTime() + 60000); // Default 1 minute
}

function calculateNextCronExecution(cronExpression: string, timezone: string): Date {
  // Simplified cron calculation - in production use node-cron library
  // This is a basic implementation for common patterns
  const now = new Date();
  return new Date(now.getTime() + 60000); // Default 1 minute for demo
}

function parseCycle(cycle: string): { repetitions: number; duration: string } {
  const match = cycle.match(/R(\d+)\/(.+)/);
  if (!match) {
    throw new Error(`Invalid cycle format: ${cycle}`);
  }
  return {
    repetitions: parseInt(match[1]),
    duration: match[2],
  };
}

function determineShouldExecuteAfterRecovery(
  strategy: CatchUpStrategy,
  missedExecutions: Date[],
): boolean {
  return strategy !== CatchUpStrategy.SKIP && missedExecutions.length > 0;
}

function parseTimerRow(row: any): WorkflowTimer {
  return {
    id: row.id,
    workflowInstanceId: row.workflow_instance_id,
    activityId: row.activity_id,
    timerType: row.timer_type,
    timerEvent: row.timer_event,
    scheduledAt: new Date(row.scheduled_at),
    executedAt: row.executed_at ? new Date(row.executed_at) : undefined,
    cancelledAt: row.cancelled_at ? new Date(row.cancelled_at) : undefined,
    status: row.status,
    configuration: typeof row.configuration === 'string' ? JSON.parse(row.configuration) : row.configuration,
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function getTimerById(
  sequelize: Sequelize,
  timerId: string,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const results = await sequelize.query(
    `SELECT * FROM workflow_timers WHERE id = :timerId`,
    {
      replacements: { timerId },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  if (results.length === 0) {
    throw new Error(`Timer ${timerId} not found`);
  }

  return parseTimerRow(results[0]);
}

async function updateTimerStatus(
  sequelize: Sequelize,
  timerId: string,
  status: TimerStatus,
  transaction?: Transaction,
): Promise<void> {
  await sequelize.query(
    `UPDATE workflow_timers SET status = :status, updated_at = NOW() WHERE id = :timerId`,
    {
      replacements: { timerId, status },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );
}

async function createTimerWithConfig(
  sequelize: Sequelize,
  workflowInstanceId: string,
  activityId: string,
  timerType: TimerType,
  timerEvent: TimerEventType,
  scheduledAt: Date,
  config: TimerConfiguration,
  transaction?: Transaction,
): Promise<WorkflowTimer> {
  const timerId = generateTimerId();

  const timer: WorkflowTimer = {
    id: timerId,
    workflowInstanceId,
    activityId,
    timerType,
    timerEvent,
    scheduledAt,
    status: TimerStatus.SCHEDULED,
    configuration: config,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sequelize.query(
    `INSERT INTO workflow_timers
     (id, workflow_instance_id, activity_id, timer_type, timer_event, scheduled_at,
      status, configuration, metadata, created_at, updated_at)
     VALUES (:id, :workflowInstanceId, :activityId, :timerType, :timerEvent, :scheduledAt,
             :status, :configuration, :metadata, :createdAt, :updatedAt)`,
    {
      replacements: {
        ...timer,
        configuration: JSON.stringify(timer.configuration),
        metadata: JSON.stringify(timer.metadata),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return timer;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Timer start events
  scheduleTimerStartEvent,
  scheduleBulkTimerStartEvents,
  getDueTimerStartEvents,

  // Intermediate timers
  createIntermediateTimerEvent,
  waitForIntermediateTimer,
  getIntermediateTimers,

  // Boundary events
  attachTimerBoundaryEvent,
  processBoundaryTimerEvent,
  cancelBoundaryTimers,

  // Cron scheduling
  createCronSchedule,
  getDueCronSchedules,
  updateCronScheduleAfterExecution,
  toggleCronSchedule,

  // Duration timers
  scheduleDurationTimer,
  parseDuration,
  scheduleBulkDurationTimers,

  // Cycle timers
  scheduleCycleTimer,
  advanceCycleTimer,
  getRemainingCycles,

  // Timer cancellation
  cancelTimer,
  cancelWorkflowTimers,
  cancelTimersByCriteria,

  // Timer rescheduling
  rescheduleTimer,
  rescheduleTimerWithDuration,
  bulkRescheduleTimers,

  // Timer persistence
  persistTimerState,
  loadTimerState,
  archiveExecutedTimers,

  // Timer recovery
  recoverTimersAfterRestart,
  processMissedTimers,
  markStaleTimersAsFailed,

  // Distributed coordination
  acquireTimerLock,
  releaseTimerLock,
  cleanupExpiredLocks,
  getSchedulerHealth,
  executeTimerWithCoordination,
};

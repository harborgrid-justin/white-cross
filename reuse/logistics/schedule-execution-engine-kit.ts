/**
 * LOC: SCHED-EXEC-001
 * File: /reuse/logistics/schedule-execution-engine-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Production controllers
 *   - Manufacturing services
 *   - Resource management modules
 *   - Shop floor control systems
 */

/**
 * File: /reuse/logistics/schedule-execution-engine-kit.ts
 * Locator: WC-LOGISTICS-SCHED-001
 * Purpose: Production Schedule Execution Engine - Complete schedule lifecycle for manufacturing operations
 *
 * Upstream: Independent utility module for production scheduling and execution
 * Downstream: ../backend/logistics/*, Manufacturing modules, MES systems, Shop floor control
 * Dependencies: TypeScript 5.x, Node 18+, crypto
 * Exports: 39 utility functions for schedule creation, task execution, resource management, status tracking
 *
 * LLM Context: Enterprise-grade production schedule execution utilities to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive schedule lifecycle management, work order execution, resource allocation,
 * capacity planning, real-time status tracking, exception handling, timeline management,
 * and integration with manufacturing execution systems (MES).
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Schedule status enumeration
 */
export enum ScheduleStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  RELEASED = 'RELEASED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

/**
 * Task execution status
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

/**
 * Resource type enumeration
 */
export enum ResourceType {
  MACHINE = 'MACHINE',
  LABOR = 'LABOR',
  TOOL = 'TOOL',
  MATERIAL = 'MATERIAL',
  FACILITY = 'FACILITY',
}

/**
 * Resource status
 */
export enum ResourceStatus {
  AVAILABLE = 'AVAILABLE',
  ALLOCATED = 'ALLOCATED',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE',
}

/**
 * Priority levels
 */
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

/**
 * Exception severity levels
 */
export enum ExceptionSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Exception type enumeration
 */
export enum ExceptionType {
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  MATERIAL_SHORTAGE = 'MATERIAL_SHORTAGE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  SCHEDULE_CONFLICT = 'SCHEDULE_CONFLICT',
  CAPACITY_EXCEEDED = 'CAPACITY_EXCEEDED',
  DELAYED_COMPLETION = 'DELAYED_COMPLETION',
  SAFETY_CONCERN = 'SAFETY_CONCERN',
}

/**
 * Resource requirement definition
 */
export interface ResourceRequirement {
  requirementId: string;
  resourceType: ResourceType;
  resourceId?: string;
  quantity: number;
  unit: string;
  duration?: number; // minutes
  setupTime?: number; // minutes
  skillLevel?: string;
  alternatives?: string[]; // Alternative resource IDs
}

/**
 * Task operation definition
 */
export interface TaskOperation {
  operationId: string;
  sequenceNumber: number;
  name: string;
  description: string;
  workCenterId: string;
  estimatedDuration: number; // minutes
  setupTime: number; // minutes
  teardownTime: number; // minutes
  status: TaskStatus;
  resources: ResourceRequirement[];
  dependencies: string[]; // Operation IDs that must complete first
  startTime?: Date;
  endTime?: Date;
  actualDuration?: number;
  completedBy?: string;
  qualityCheckRequired: boolean;
  notes?: string;
}

/**
 * Production schedule definition
 */
export interface ProductionSchedule {
  scheduleId: string;
  scheduleNumber: string;
  name: string;
  description?: string;
  workOrderId: string;
  productId: string;
  quantity: number;
  unit: string;
  priority: Priority;
  status: ScheduleStatus;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  operations: TaskOperation[];
  milestones: ScheduleMilestone[];
  facilityId: string;
  customerId?: string;
  dueDate: Date;
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
  metadata?: Record<string, any>;
}

/**
 * Schedule milestone
 */
export interface ScheduleMilestone {
  milestoneId: string;
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  completed: boolean;
  criticalPath: boolean;
}

/**
 * Resource allocation record
 */
export interface ResourceAllocation {
  allocationId: string;
  scheduleId: string;
  operationId: string;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
  allocatedFrom: Date;
  allocatedTo: Date;
  actualFrom?: Date;
  actualTo?: Date;
  status: ResourceStatus;
  utilizationRate?: number; // percentage
  cost?: number;
}

/**
 * Timeline entry
 */
export interface TimelineEntry {
  entryId: string;
  scheduleId: string;
  operationId: string;
  timestamp: Date;
  event: string;
  status: TaskStatus;
  performedBy?: string;
  duration?: number;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Execution job definition
 */
export interface ExecutionJob {
  jobId: string;
  scheduleId: string;
  operationId: string;
  workCenterId: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: Priority;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  progress: number; // percentage 0-100
  output?: number; // quantity produced
  scrapCount?: number;
  reworkCount?: number;
  qualityStatus?: string;
  notes?: string[];
}

/**
 * Schedule exception/issue
 */
export interface ScheduleException {
  exceptionId: string;
  scheduleId: string;
  operationId?: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  title: string;
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  impact: string;
  actionItems: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

/**
 * Capacity analysis result
 */
export interface CapacityAnalysis {
  workCenterId: string;
  workCenterName: string;
  date: Date;
  totalCapacity: number; // minutes
  scheduledLoad: number; // minutes
  utilizationRate: number; // percentage
  overloaded: boolean;
  availableCapacity: number; // minutes
  scheduledJobs: number;
}

/**
 * Schedule creation configuration
 */
export interface ScheduleConfig {
  workOrderId: string;
  productId: string;
  quantity: number;
  unit: string;
  priority: Priority;
  dueDate: Date;
  facilityId: string;
  customerId?: string;
  routingId?: string;
  createdBy: string;
}

/**
 * Schedule search criteria
 */
export interface ScheduleSearchCriteria {
  facilityId?: string;
  status?: ScheduleStatus[];
  priority?: Priority[];
  dateFrom?: Date;
  dateTo?: Date;
  workOrderId?: string;
  productId?: string;
  customerId?: string;
}

/**
 * Schedule performance metrics
 */
export interface ScheduleMetrics {
  scheduleId: string;
  onTimePerformance: number; // percentage
  utilizationRate: number; // percentage
  efficiencyRate: number; // percentage
  cycleTimeVariance: number; // percentage
  qualityRate: number; // percentage
  completionRate: number; // percentage
  exceptionCount: number;
  avgSetupTime: number; // minutes
  avgProcessTime: number; // minutes
}

/**
 * Resource availability check result
 */
export interface ResourceAvailability {
  resourceId: string;
  resourceType: ResourceType;
  available: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  conflicts: Array<{
    scheduleId: string;
    operationId: string;
    from: Date;
    to: Date;
  }>;
  utilizationRate: number; // percentage
}

// ============================================================================
// SECTION 1: SCHEDULE CREATION (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a new production schedule instance.
 *
 * @param {ScheduleConfig} config - Schedule configuration
 * @returns {ProductionSchedule} New schedule object
 *
 * @example
 * ```typescript
 * const schedule = createProductionSchedule({
 *   workOrderId: 'WO-2024-001',
 *   productId: 'PROD-12345',
 *   quantity: 1000,
 *   unit: 'EA',
 *   priority: Priority.HIGH,
 *   dueDate: new Date('2024-12-31'),
 *   facilityId: 'FAC-001',
 *   createdBy: 'USER-001'
 * });
 * ```
 */
export function createProductionSchedule(config: ScheduleConfig): ProductionSchedule {
  const scheduleId = generateScheduleId();
  const scheduleNumber = generateScheduleNumber(config.facilityId);
  const now = new Date();

  return {
    scheduleId,
    scheduleNumber,
    name: `Schedule for WO ${config.workOrderId}`,
    workOrderId: config.workOrderId,
    productId: config.productId,
    quantity: config.quantity,
    unit: config.unit,
    priority: config.priority,
    status: ScheduleStatus.DRAFT,
    plannedStartDate: now,
    plannedEndDate: config.dueDate,
    operations: [],
    milestones: [],
    facilityId: config.facilityId,
    customerId: config.customerId,
    dueDate: config.dueDate,
    createdBy: config.createdBy,
    createdAt: now,
    lastUpdated: now,
  };
}

/**
 * 2. Adds an operation to the production schedule.
 *
 * @param {ProductionSchedule} schedule - Schedule to update
 * @param {Partial<TaskOperation>} operation - Operation details
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = addOperation(schedule, {
 *   name: 'Cutting Operation',
 *   workCenterId: 'WC-CUTTING-01',
 *   estimatedDuration: 120,
 *   setupTime: 30,
 *   sequenceNumber: 10,
 *   resources: [{
 *     requirementId: crypto.randomUUID(),
 *     resourceType: ResourceType.MACHINE,
 *     resourceId: 'MACHINE-CUT-01',
 *     quantity: 1,
 *     unit: 'EA'
 *   }]
 * });
 * ```
 */
export function addOperation(
  schedule: ProductionSchedule,
  operation: Partial<TaskOperation>
): ProductionSchedule {
  const operationId = crypto.randomUUID();

  const newOperation: TaskOperation = {
    operationId,
    sequenceNumber: operation.sequenceNumber || schedule.operations.length + 1,
    name: operation.name || '',
    description: operation.description || '',
    workCenterId: operation.workCenterId || '',
    estimatedDuration: operation.estimatedDuration || 0,
    setupTime: operation.setupTime || 0,
    teardownTime: operation.teardownTime || 0,
    status: TaskStatus.PENDING,
    resources: operation.resources || [],
    dependencies: operation.dependencies || [],
    qualityCheckRequired: operation.qualityCheckRequired ?? false,
  };

  const updatedSchedule = {
    ...schedule,
    operations: [...schedule.operations, newOperation].sort(
      (a, b) => a.sequenceNumber - b.sequenceNumber
    ),
    lastUpdated: new Date(),
  };

  return updatedSchedule;
}

/**
 * 3. Calculates and sets planned dates for all operations based on dependencies.
 *
 * @param {ProductionSchedule} schedule - Schedule to calculate
 * @param {Date} startDate - Planned start date
 * @returns {ProductionSchedule} Schedule with calculated dates
 *
 * @example
 * ```typescript
 * const scheduled = calculateOperationDates(schedule, new Date());
 * ```
 */
export function calculateOperationDates(
  schedule: ProductionSchedule,
  startDate: Date
): ProductionSchedule {
  const operations = [...schedule.operations].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  const operationDates = new Map<string, { start: Date; end: Date }>();

  let currentDate = new Date(startDate);

  for (const operation of operations) {
    // Check dependencies
    let latestDependencyEnd = currentDate;
    for (const depId of operation.dependencies) {
      const depDates = operationDates.get(depId);
      if (depDates && depDates.end > latestDependencyEnd) {
        latestDependencyEnd = depDates.end;
      }
    }

    const opStartDate = new Date(latestDependencyEnd);
    const totalMinutes = operation.setupTime + operation.estimatedDuration + operation.teardownTime;
    const opEndDate = new Date(opStartDate.getTime() + totalMinutes * 60000);

    operationDates.set(operation.operationId, {
      start: opStartDate,
      end: opEndDate,
    });

    currentDate = opEndDate;
  }

  const updatedOperations = operations.map(op => {
    const dates = operationDates.get(op.operationId);
    return {
      ...op,
      startTime: dates?.start,
      endTime: dates?.end,
    };
  });

  const lastOperation = updatedOperations[updatedOperations.length - 1];

  return {
    ...schedule,
    operations: updatedOperations,
    plannedStartDate: startDate,
    plannedEndDate: lastOperation?.endTime || startDate,
    lastUpdated: new Date(),
  };
}

/**
 * 4. Adds a milestone to the schedule.
 *
 * @param {ProductionSchedule} schedule - Schedule to update
 * @param {Partial<ScheduleMilestone>} milestone - Milestone details
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = addMilestone(schedule, {
 *   name: 'Phase 1 Complete',
 *   description: 'All cutting operations finished',
 *   targetDate: new Date('2024-06-15'),
 *   criticalPath: true
 * });
 * ```
 */
export function addMilestone(
  schedule: ProductionSchedule,
  milestone: Partial<ScheduleMilestone>
): ProductionSchedule {
  const milestoneId = crypto.randomUUID();

  const newMilestone: ScheduleMilestone = {
    milestoneId,
    name: milestone.name || '',
    description: milestone.description || '',
    targetDate: milestone.targetDate || new Date(),
    completed: false,
    criticalPath: milestone.criticalPath ?? false,
  };

  return {
    ...schedule,
    milestones: [...schedule.milestones, newMilestone],
    lastUpdated: new Date(),
  };
}

/**
 * 5. Validates schedule for release (checks resources, dates, dependencies).
 *
 * @param {ProductionSchedule} schedule - Schedule to validate
 * @returns {object} Validation result with issues
 *
 * @example
 * ```typescript
 * const validation = validateScheduleForRelease(schedule);
 * if (!validation.valid) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export function validateScheduleForRelease(schedule: ProductionSchedule): {
  valid: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check if schedule has operations
  if (schedule.operations.length === 0) {
    issues.push('Schedule has no operations');
  }

  // Check if operations have required resources
  for (const operation of schedule.operations) {
    if (operation.resources.length === 0) {
      warnings.push(`Operation ${operation.name} has no resource requirements`);
    }

    if (!operation.workCenterId) {
      issues.push(`Operation ${operation.name} has no work center assigned`);
    }

    if (operation.estimatedDuration <= 0) {
      issues.push(`Operation ${operation.name} has invalid duration`);
    }
  }

  // Check for circular dependencies
  const hasCircularDependency = detectCircularDependencies(schedule.operations);
  if (hasCircularDependency) {
    issues.push('Circular dependencies detected in operations');
  }

  // Check dates
  if (schedule.plannedEndDate <= schedule.plannedStartDate) {
    issues.push('Planned end date must be after start date');
  }

  if (schedule.dueDate < schedule.plannedEndDate) {
    warnings.push('Planned end date is after due date - schedule may be late');
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * 6. Releases schedule for execution (changes status to RELEASED).
 *
 * @param {ProductionSchedule} schedule - Schedule to release
 * @param {string} releasedBy - User releasing the schedule
 * @returns {ProductionSchedule} Released schedule
 *
 * @example
 * ```typescript
 * const released = releaseSchedule(schedule, 'USER-001');
 * ```
 */
export function releaseSchedule(
  schedule: ProductionSchedule,
  releasedBy: string
): ProductionSchedule {
  const validation = validateScheduleForRelease(schedule);

  if (!validation.valid) {
    throw new Error(`Cannot release schedule: ${validation.issues.join(', ')}`);
  }

  return {
    ...schedule,
    status: ScheduleStatus.RELEASED,
    lastUpdated: new Date(),
    metadata: {
      ...schedule.metadata,
      releasedBy,
      releasedAt: new Date().toISOString(),
    },
  };
}

/**
 * 7. Clones a schedule for reuse or what-if analysis.
 *
 * @param {ProductionSchedule} schedule - Schedule to clone
 * @param {Partial<ScheduleConfig>} overrides - Configuration overrides
 * @returns {ProductionSchedule} Cloned schedule
 *
 * @example
 * ```typescript
 * const clone = cloneSchedule(originalSchedule, {
 *   workOrderId: 'WO-2024-002',
 *   quantity: 2000
 * });
 * ```
 */
export function cloneSchedule(
  schedule: ProductionSchedule,
  overrides?: Partial<ScheduleConfig>
): ProductionSchedule {
  const cloned: ProductionSchedule = JSON.parse(JSON.stringify(schedule));

  cloned.scheduleId = generateScheduleId();
  cloned.scheduleNumber = generateScheduleNumber(schedule.facilityId);
  cloned.status = ScheduleStatus.DRAFT;
  cloned.createdAt = new Date();
  cloned.lastUpdated = new Date();
  cloned.actualStartDate = undefined;
  cloned.actualEndDate = undefined;

  if (overrides) {
    if (overrides.workOrderId) cloned.workOrderId = overrides.workOrderId;
    if (overrides.quantity) cloned.quantity = overrides.quantity;
    if (overrides.priority) cloned.priority = overrides.priority;
    if (overrides.dueDate) cloned.dueDate = overrides.dueDate;
  }

  // Reset operation statuses and actual times
  cloned.operations = cloned.operations.map(op => ({
    ...op,
    operationId: crypto.randomUUID(),
    status: TaskStatus.PENDING,
    startTime: undefined,
    endTime: undefined,
    actualDuration: undefined,
    completedBy: undefined,
  }));

  // Reset milestones
  cloned.milestones = cloned.milestones.map(m => ({
    ...m,
    milestoneId: crypto.randomUUID(),
    completed: false,
    actualDate: undefined,
  }));

  return cloned;
}

/**
 * 8. Optimizes schedule using finite capacity scheduling algorithm.
 *
 * @param {ProductionSchedule} schedule - Schedule to optimize
 * @param {CapacityAnalysis[]} capacityData - Available capacity information
 * @returns {ProductionSchedule} Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = optimizeSchedule(schedule, capacityData);
 * ```
 */
export function optimizeSchedule(
  schedule: ProductionSchedule,
  capacityData: CapacityAnalysis[]
): ProductionSchedule {
  const operations = [...schedule.operations].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  const capacityMap = new Map(capacityData.map(c => [c.workCenterId, c]));

  let currentDate = new Date(schedule.plannedStartDate);

  const optimizedOps = operations.map(operation => {
    const capacity = capacityMap.get(operation.workCenterId);

    if (capacity && capacity.overloaded) {
      // Shift operation to next available slot
      const availableDate = new Date(capacity.date);
      availableDate.setDate(availableDate.getDate() + 1);
      currentDate = availableDate;
    }

    const totalMinutes = operation.setupTime + operation.estimatedDuration + operation.teardownTime;
    const endDate = new Date(currentDate.getTime() + totalMinutes * 60000);

    const optimized = {
      ...operation,
      startTime: new Date(currentDate),
      endTime: endDate,
    };

    currentDate = endDate;

    return optimized;
  });

  return {
    ...schedule,
    operations: optimizedOps,
    plannedEndDate: currentDate,
    lastUpdated: new Date(),
    metadata: {
      ...schedule.metadata,
      optimizedAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// SECTION 2: TASK EXECUTION (Functions 9-16)
// ============================================================================

/**
 * 9. Starts execution of a schedule (updates status to IN_PROGRESS).
 *
 * @param {ProductionSchedule} schedule - Schedule to start
 * @param {string} startedBy - User starting execution
 * @returns {ProductionSchedule} Started schedule
 *
 * @example
 * ```typescript
 * const started = startScheduleExecution(schedule, 'USER-001');
 * ```
 */
export function startScheduleExecution(
  schedule: ProductionSchedule,
  startedBy: string
): ProductionSchedule {
  if (schedule.status !== ScheduleStatus.RELEASED) {
    throw new Error('Schedule must be RELEASED before starting execution');
  }

  return {
    ...schedule,
    status: ScheduleStatus.IN_PROGRESS,
    actualStartDate: new Date(),
    lastUpdated: new Date(),
    metadata: {
      ...schedule.metadata,
      startedBy,
    },
  };
}

/**
 * 10. Starts execution of a specific operation.
 *
 * @param {ProductionSchedule} schedule - Schedule containing the operation
 * @param {string} operationId - Operation ID to start
 * @param {string} startedBy - User starting the operation
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = startOperation(schedule, 'OP-001', 'USER-001');
 * ```
 */
export function startOperation(
  schedule: ProductionSchedule,
  operationId: string,
  startedBy: string
): ProductionSchedule {
  const operations = schedule.operations.map(op => {
    if (op.operationId === operationId) {
      // Check dependencies
      const dependenciesMet = op.dependencies.every(depId => {
        const depOp = schedule.operations.find(o => o.operationId === depId);
        return depOp?.status === TaskStatus.COMPLETED;
      });

      if (!dependenciesMet) {
        throw new Error('Cannot start operation - dependencies not met');
      }

      return {
        ...op,
        status: TaskStatus.IN_PROGRESS,
        startTime: new Date(),
        completedBy: startedBy,
      };
    }
    return op;
  });

  return {
    ...schedule,
    operations,
    lastUpdated: new Date(),
  };
}

/**
 * 11. Completes execution of an operation with output data.
 *
 * @param {ProductionSchedule} schedule - Schedule containing the operation
 * @param {string} operationId - Operation ID to complete
 * @param {object} completionData - Completion details
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = completeOperation(schedule, 'OP-001', {
 *   completedBy: 'USER-001',
 *   output: 950,
 *   scrap: 50,
 *   notes: 'Completed successfully'
 * });
 * ```
 */
export function completeOperation(
  schedule: ProductionSchedule,
  operationId: string,
  completionData: {
    completedBy: string;
    output?: number;
    scrap?: number;
    rework?: number;
    notes?: string;
  }
): ProductionSchedule {
  const operations = schedule.operations.map(op => {
    if (op.operationId === operationId) {
      if (op.status !== TaskStatus.IN_PROGRESS) {
        throw new Error('Operation must be IN_PROGRESS to complete');
      }

      const endTime = new Date();
      const actualDuration = op.startTime
        ? Math.round((endTime.getTime() - op.startTime.getTime()) / 60000)
        : op.estimatedDuration;

      return {
        ...op,
        status: TaskStatus.COMPLETED,
        endTime,
        actualDuration,
        completedBy: completionData.completedBy,
        notes: completionData.notes,
      };
    }
    return op;
  });

  // Check if all operations are complete
  const allComplete = operations.every(op => op.status === TaskStatus.COMPLETED);

  return {
    ...schedule,
    operations,
    status: allComplete ? ScheduleStatus.COMPLETED : schedule.status,
    actualEndDate: allComplete ? new Date() : schedule.actualEndDate,
    lastUpdated: new Date(),
  };
}

/**
 * 12. Records progress update for an in-progress operation.
 *
 * @param {ExecutionJob} job - Job to update
 * @param {number} progress - Progress percentage (0-100)
 * @param {number} output - Quantity produced
 * @returns {ExecutionJob} Updated job
 *
 * @example
 * ```typescript
 * const updated = recordOperationProgress(job, 75, 750);
 * ```
 */
export function recordOperationProgress(
  job: ExecutionJob,
  progress: number,
  output: number
): ExecutionJob {
  if (progress < 0 || progress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }

  return {
    ...job,
    progress,
    output,
    notes: [...(job.notes || []), `Progress updated to ${progress}% at ${new Date().toISOString()}`],
  };
}

/**
 * 13. Pauses an in-progress operation.
 *
 * @param {ProductionSchedule} schedule - Schedule containing the operation
 * @param {string} operationId - Operation ID to pause
 * @param {string} reason - Reason for pausing
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = pauseOperation(schedule, 'OP-001', 'Equipment maintenance required');
 * ```
 */
export function pauseOperation(
  schedule: ProductionSchedule,
  operationId: string,
  reason: string
): ProductionSchedule {
  const operations = schedule.operations.map(op => {
    if (op.operationId === operationId) {
      if (op.status !== TaskStatus.IN_PROGRESS) {
        throw new Error('Can only pause IN_PROGRESS operations');
      }

      return {
        ...op,
        status: TaskStatus.BLOCKED,
        notes: `Paused: ${reason}`,
      };
    }
    return op;
  });

  return {
    ...schedule,
    operations,
    status: ScheduleStatus.ON_HOLD,
    lastUpdated: new Date(),
  };
}

/**
 * 14. Resumes a paused operation.
 *
 * @param {ProductionSchedule} schedule - Schedule containing the operation
 * @param {string} operationId - Operation ID to resume
 * @param {string} resumedBy - User resuming the operation
 * @returns {ProductionSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = resumeOperation(schedule, 'OP-001', 'USER-001');
 * ```
 */
export function resumeOperation(
  schedule: ProductionSchedule,
  operationId: string,
  resumedBy: string
): ProductionSchedule {
  const operations = schedule.operations.map(op => {
    if (op.operationId === operationId) {
      if (op.status !== TaskStatus.BLOCKED) {
        throw new Error('Can only resume BLOCKED operations');
      }

      return {
        ...op,
        status: TaskStatus.IN_PROGRESS,
        notes: `Resumed by ${resumedBy}`,
      };
    }
    return op;
  });

  return {
    ...schedule,
    operations,
    status: ScheduleStatus.IN_PROGRESS,
    lastUpdated: new Date(),
  };
}

/**
 * 15. Creates an execution job from a schedule operation.
 *
 * @param {ProductionSchedule} schedule - Source schedule
 * @param {string} operationId - Operation ID
 * @returns {ExecutionJob} Execution job
 *
 * @example
 * ```typescript
 * const job = createExecutionJob(schedule, 'OP-001');
 * ```
 */
export function createExecutionJob(
  schedule: ProductionSchedule,
  operationId: string
): ExecutionJob {
  const operation = schedule.operations.find(op => op.operationId === operationId);

  if (!operation) {
    throw new Error(`Operation ${operationId} not found in schedule`);
  }

  return {
    jobId: crypto.randomUUID(),
    scheduleId: schedule.scheduleId,
    operationId: operation.operationId,
    workCenterId: operation.workCenterId,
    status: operation.status,
    priority: schedule.priority,
    scheduledStart: operation.startTime || new Date(),
    scheduledEnd: operation.endTime || new Date(),
    actualStart: operation.startTime,
    actualEnd: operation.endTime,
    progress: 0,
    notes: [],
  };
}

/**
 * 16. Dispatches jobs to work centers based on priority and capacity.
 *
 * @param {ExecutionJob[]} jobs - Jobs to dispatch
 * @param {CapacityAnalysis[]} capacityData - Work center capacity
 * @returns {ExecutionJob[]} Dispatched jobs with assignments
 *
 * @example
 * ```typescript
 * const dispatched = dispatchJobs(pendingJobs, capacityData);
 * ```
 */
export function dispatchJobs(
  jobs: ExecutionJob[],
  capacityData: CapacityAnalysis[]
): ExecutionJob[] {
  const capacityMap = new Map(capacityData.map(c => [c.workCenterId, c]));

  // Sort by priority
  const sortedJobs = [...jobs].sort((a, b) => {
    const priorityOrder = { CRITICAL: 0, URGENT: 1, HIGH: 2, NORMAL: 3, LOW: 4 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return sortedJobs.map(job => {
    const capacity = capacityMap.get(job.workCenterId);

    if (!capacity || capacity.overloaded) {
      return {
        ...job,
        status: TaskStatus.BLOCKED,
        notes: [...(job.notes || []), 'Work center at capacity - delayed'],
      };
    }

    return {
      ...job,
      status: TaskStatus.READY,
    };
  });
}

// ============================================================================
// SECTION 3: RESOURCE MANAGEMENT (Functions 17-24)
// ============================================================================

/**
 * 17. Allocates resources to a schedule operation.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} operationId - Operation ID
 * @param {ResourceRequirement} requirement - Resource requirement
 * @param {Date} from - Start time
 * @param {Date} to - End time
 * @returns {ResourceAllocation} Resource allocation record
 *
 * @example
 * ```typescript
 * const allocation = allocateResource(
 *   'SCH-001',
 *   'OP-001',
 *   resourceRequirement,
 *   startTime,
 *   endTime
 * );
 * ```
 */
export function allocateResource(
  scheduleId: string,
  operationId: string,
  requirement: ResourceRequirement,
  from: Date,
  to: Date
): ResourceAllocation {
  return {
    allocationId: crypto.randomUUID(),
    scheduleId,
    operationId,
    resourceType: requirement.resourceType,
    resourceId: requirement.resourceId || '',
    resourceName: `${requirement.resourceType}-${requirement.resourceId}`,
    quantity: requirement.quantity,
    unit: requirement.unit,
    allocatedFrom: from,
    allocatedTo: to,
    status: ResourceStatus.ALLOCATED,
  };
}

/**
 * 18. Checks resource availability for a time period.
 *
 * @param {string} resourceId - Resource ID
 * @param {ResourceType} resourceType - Resource type
 * @param {Date} from - Start time
 * @param {Date} to - End time
 * @param {ResourceAllocation[]} existingAllocations - Current allocations
 * @returns {ResourceAvailability} Availability check result
 *
 * @example
 * ```typescript
 * const availability = checkResourceAvailability(
 *   'MACHINE-001',
 *   ResourceType.MACHINE,
 *   startDate,
 *   endDate,
 *   allocations
 * );
 * ```
 */
export function checkResourceAvailability(
  resourceId: string,
  resourceType: ResourceType,
  from: Date,
  to: Date,
  existingAllocations: ResourceAllocation[]
): ResourceAvailability {
  const conflicts = existingAllocations.filter(
    alloc =>
      alloc.resourceId === resourceId &&
      alloc.status !== ResourceStatus.AVAILABLE &&
      ((from >= alloc.allocatedFrom && from < alloc.allocatedTo) ||
        (to > alloc.allocatedFrom && to <= alloc.allocatedTo) ||
        (from <= alloc.allocatedFrom && to >= alloc.allocatedTo))
  );

  const totalDuration = to.getTime() - from.getTime();
  const conflictDuration = conflicts.reduce(
    (sum, c) => sum + (c.allocatedTo.getTime() - c.allocatedFrom.getTime()),
    0
  );

  const utilizationRate = totalDuration > 0 ? (conflictDuration / totalDuration) * 100 : 0;

  return {
    resourceId,
    resourceType,
    available: conflicts.length === 0,
    conflicts: conflicts.map(c => ({
      scheduleId: c.scheduleId,
      operationId: c.operationId,
      from: c.allocatedFrom,
      to: c.allocatedTo,
    })),
    utilizationRate,
  };
}

/**
 * 19. Releases resource allocation when operation completes.
 *
 * @param {ResourceAllocation} allocation - Allocation to release
 * @returns {ResourceAllocation} Updated allocation
 *
 * @example
 * ```typescript
 * const released = releaseResourceAllocation(allocation);
 * ```
 */
export function releaseResourceAllocation(allocation: ResourceAllocation): ResourceAllocation {
  return {
    ...allocation,
    status: ResourceStatus.AVAILABLE,
    actualTo: new Date(),
  };
}

/**
 * 20. Finds alternative resources when primary is unavailable.
 *
 * @param {ResourceRequirement} requirement - Resource requirement
 * @param {ResourceAvailability[]} availabilityData - Availability info
 * @returns {string[]} Available alternative resource IDs
 *
 * @example
 * ```typescript
 * const alternatives = findAlternativeResources(requirement, availabilityData);
 * ```
 */
export function findAlternativeResources(
  requirement: ResourceRequirement,
  availabilityData: ResourceAvailability[]
): string[] {
  // Check alternatives defined in requirement
  if (requirement.alternatives && requirement.alternatives.length > 0) {
    return requirement.alternatives.filter(altId => {
      const availability = availabilityData.find(a => a.resourceId === altId);
      return availability?.available;
    });
  }

  // Find available resources of same type
  return availabilityData
    .filter(a => a.resourceType === requirement.resourceType && a.available)
    .map(a => a.resourceId);
}

/**
 * 21. Calculates resource utilization rate for a time period.
 *
 * @param {string} resourceId - Resource ID
 * @param {ResourceAllocation[]} allocations - All allocations
 * @param {Date} from - Period start
 * @param {Date} to - Period end
 * @returns {number} Utilization rate percentage
 *
 * @example
 * ```typescript
 * const utilization = calculateResourceUtilization('MACHINE-001', allocations, start, end);
 * // Returns: 85.5
 * ```
 */
export function calculateResourceUtilization(
  resourceId: string,
  allocations: ResourceAllocation[],
  from: Date,
  to: Date
): number {
  const totalAvailableTime = to.getTime() - from.getTime();

  const relevantAllocations = allocations.filter(
    alloc => alloc.resourceId === resourceId && alloc.actualFrom && alloc.actualTo
  );

  const totalUsedTime = relevantAllocations.reduce((sum, alloc) => {
    if (!alloc.actualFrom || !alloc.actualTo) return sum;

    const start = alloc.actualFrom.getTime();
    const end = alloc.actualTo.getTime();
    const duration = end - start;

    return sum + duration;
  }, 0);

  return totalAvailableTime > 0 ? (totalUsedTime / totalAvailableTime) * 100 : 0;
}

/**
 * 22. Performs capacity analysis for a work center.
 *
 * @param {string} workCenterId - Work center ID
 * @param {Date} date - Analysis date
 * @param {ExecutionJob[]} scheduledJobs - Scheduled jobs
 * @param {number} availableMinutes - Available capacity in minutes
 * @returns {CapacityAnalysis} Capacity analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeWorkCenterCapacity('WC-001', new Date(), jobs, 480);
 * ```
 */
export function analyzeWorkCenterCapacity(
  workCenterId: string,
  date: Date,
  scheduledJobs: ExecutionJob[],
  availableMinutes: number
): CapacityAnalysis {
  const jobsForWorkCenter = scheduledJobs.filter(job => job.workCenterId === workCenterId);

  const scheduledLoad = jobsForWorkCenter.reduce((sum, job) => {
    const duration =
      (job.scheduledEnd.getTime() - job.scheduledStart.getTime()) / 60000;
    return sum + duration;
  }, 0);

  const utilizationRate = (scheduledLoad / availableMinutes) * 100;
  const overloaded = utilizationRate > 100;
  const availableCapacity = Math.max(0, availableMinutes - scheduledLoad);

  return {
    workCenterId,
    workCenterName: `Work Center ${workCenterId}`,
    date,
    totalCapacity: availableMinutes,
    scheduledLoad,
    utilizationRate,
    overloaded,
    availableCapacity,
    scheduledJobs: jobsForWorkCenter.length,
  };
}

/**
 * 23. Rebalances resource allocations to optimize utilization.
 *
 * @param {ResourceAllocation[]} allocations - Current allocations
 * @param {CapacityAnalysis[]} capacityData - Capacity information
 * @returns {ResourceAllocation[]} Rebalanced allocations
 *
 * @example
 * ```typescript
 * const rebalanced = rebalanceResourceAllocations(allocations, capacityData);
 * ```
 */
export function rebalanceResourceAllocations(
  allocations: ResourceAllocation[],
  capacityData: CapacityAnalysis[]
): ResourceAllocation[] {
  const overloadedCenters = capacityData.filter(c => c.overloaded);

  if (overloadedCenters.length === 0) {
    return allocations;
  }

  // Move allocations from overloaded centers to available ones
  return allocations.map(alloc => {
    // If allocation is for an overloaded center and hasn't started yet
    if (
      !alloc.actualFrom &&
      overloadedCenters.some(c => c.workCenterId === alloc.resourceId)
    ) {
      // Find available alternative (simplified logic)
      const alternative = capacityData.find(
        c => !c.overloaded && c.resourceType === alloc.resourceType
      );

      if (alternative) {
        return {
          ...alloc,
          resourceId: alternative.workCenterId,
          resourceName: alternative.workCenterName,
        };
      }
    }

    return alloc;
  });
}

/**
 * 24. Validates resource requirements against available capacity.
 *
 * @param {ProductionSchedule} schedule - Schedule to validate
 * @param {CapacityAnalysis[]} capacityData - Available capacity
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateResourceCapacity(schedule, capacityData);
 * ```
 */
export function validateResourceCapacity(
  schedule: ProductionSchedule,
  capacityData: CapacityAnalysis[]
): {
  valid: boolean;
  issues: Array<{
    operationId: string;
    workCenterId: string;
    issue: string;
  }>;
} {
  const issues: Array<{ operationId: string; workCenterId: string; issue: string }> = [];

  for (const operation of schedule.operations) {
    const capacity = capacityData.find(c => c.workCenterId === operation.workCenterId);

    if (!capacity) {
      issues.push({
        operationId: operation.operationId,
        workCenterId: operation.workCenterId,
        issue: 'Work center capacity data not found',
      });
      continue;
    }

    const operationDuration = operation.setupTime + operation.estimatedDuration + operation.teardownTime;

    if (operationDuration > capacity.availableCapacity) {
      issues.push({
        operationId: operation.operationId,
        workCenterId: operation.workCenterId,
        issue: `Insufficient capacity: needs ${operationDuration} min, available ${capacity.availableCapacity} min`,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// SECTION 4: STATUS TRACKING (Functions 25-31)
// ============================================================================

/**
 * 25. Records a timeline event for schedule tracking.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} operationId - Operation ID
 * @param {string} event - Event description
 * @param {TaskStatus} status - Current status
 * @param {string} performedBy - User who performed the action
 * @returns {TimelineEntry} Timeline entry
 *
 * @example
 * ```typescript
 * const entry = recordTimelineEvent(
 *   'SCH-001',
 *   'OP-001',
 *   'Operation started',
 *   TaskStatus.IN_PROGRESS,
 *   'USER-001'
 * );
 * ```
 */
export function recordTimelineEvent(
  scheduleId: string,
  operationId: string,
  event: string,
  status: TaskStatus,
  performedBy?: string
): TimelineEntry {
  return {
    entryId: crypto.randomUUID(),
    scheduleId,
    operationId,
    timestamp: new Date(),
    event,
    status,
    performedBy,
  };
}

/**
 * 26. Calculates schedule completion percentage.
 *
 * @param {ProductionSchedule} schedule - Schedule to analyze
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const completion = calculateScheduleCompletion(schedule);
 * // Returns: 75.5
 * ```
 */
export function calculateScheduleCompletion(schedule: ProductionSchedule): number {
  if (schedule.operations.length === 0) return 0;

  const completedOps = schedule.operations.filter(
    op => op.status === TaskStatus.COMPLETED
  ).length;

  return (completedOps / schedule.operations.length) * 100;
}

/**
 * 27. Generates schedule performance metrics.
 *
 * @param {ProductionSchedule} schedule - Schedule to analyze
 * @param {ResourceAllocation[]} allocations - Resource allocations
 * @returns {ScheduleMetrics} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = generateScheduleMetrics(schedule, allocations);
 * ```
 */
export function generateScheduleMetrics(
  schedule: ProductionSchedule,
  allocations: ResourceAllocation[]
): ScheduleMetrics {
  const completedOps = schedule.operations.filter(op => op.status === TaskStatus.COMPLETED);
  const totalOps = schedule.operations.length;

  const onTimeOps = completedOps.filter(
    op => op.endTime && op.actualDuration && op.actualDuration <= op.estimatedDuration
  ).length;

  const totalEstimatedTime = schedule.operations.reduce(
    (sum, op) => sum + op.estimatedDuration,
    0
  );
  const totalActualTime = completedOps.reduce(
    (sum, op) => sum + (op.actualDuration || 0),
    0
  );

  const avgSetupTime =
    schedule.operations.reduce((sum, op) => sum + op.setupTime, 0) / totalOps || 0;

  const avgProcessTime =
    completedOps.reduce((sum, op) => sum + (op.actualDuration || op.estimatedDuration), 0) /
      completedOps.length || 0;

  return {
    scheduleId: schedule.scheduleId,
    onTimePerformance: completedOps.length > 0 ? (onTimeOps / completedOps.length) * 100 : 0,
    utilizationRate:
      totalEstimatedTime > 0 ? (totalActualTime / totalEstimatedTime) * 100 : 0,
    efficiencyRate:
      totalActualTime > 0 ? (totalEstimatedTime / totalActualTime) * 100 : 0,
    cycleTimeVariance:
      totalEstimatedTime > 0
        ? ((totalActualTime - totalEstimatedTime) / totalEstimatedTime) * 100
        : 0,
    qualityRate: 100, // Would be calculated from actual quality data
    completionRate: (completedOps.length / totalOps) * 100,
    exceptionCount: 0, // Would be tracked separately
    avgSetupTime,
    avgProcessTime,
  };
}

/**
 * 28. Gets current status summary of a schedule.
 *
 * @param {ProductionSchedule} schedule - Schedule to summarize
 * @returns {object} Status summary
 *
 * @example
 * ```typescript
 * const summary = getScheduleStatusSummary(schedule);
 * ```
 */
export function getScheduleStatusSummary(schedule: ProductionSchedule): {
  scheduleId: string;
  status: ScheduleStatus;
  completionPercentage: number;
  operationsTotal: number;
  operationsPending: number;
  operationsInProgress: number;
  operationsCompleted: number;
  operationsBlocked: number;
  onSchedule: boolean;
  daysRemaining: number;
} {
  const completionPercentage = calculateScheduleCompletion(schedule);

  const statusCounts = schedule.operations.reduce(
    (acc, op) => {
      acc[op.status] = (acc[op.status] || 0) + 1;
      return acc;
    },
    {} as Record<TaskStatus, number>
  );

  const now = new Date();
  const daysRemaining = Math.ceil(
    (schedule.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const onSchedule = schedule.actualEndDate
    ? schedule.actualEndDate <= schedule.dueDate
    : schedule.plannedEndDate <= schedule.dueDate;

  return {
    scheduleId: schedule.scheduleId,
    status: schedule.status,
    completionPercentage,
    operationsTotal: schedule.operations.length,
    operationsPending: statusCounts[TaskStatus.PENDING] || 0,
    operationsInProgress: statusCounts[TaskStatus.IN_PROGRESS] || 0,
    operationsCompleted: statusCounts[TaskStatus.COMPLETED] || 0,
    operationsBlocked: statusCounts[TaskStatus.BLOCKED] || 0,
    onSchedule,
    daysRemaining,
  };
}

/**
 * 29. Identifies critical path operations in the schedule.
 *
 * @param {ProductionSchedule} schedule - Schedule to analyze
 * @returns {string[]} Operation IDs on critical path
 *
 * @example
 * ```typescript
 * const criticalPath = identifyCriticalPath(schedule);
 * ```
 */
export function identifyCriticalPath(schedule: ProductionSchedule): string[] {
  // Simple critical path: operations with no slack time
  const operations = [...schedule.operations].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  const criticalOps: string[] = [];

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const nextOp = operations[i + 1];

    if (!nextOp) {
      criticalOps.push(op.operationId);
      continue;
    }

    // If operation end time equals next operation start time, no slack
    if (op.endTime && nextOp.startTime && op.endTime >= nextOp.startTime) {
      criticalOps.push(op.operationId);
    }
  }

  return criticalOps;
}

/**
 * 30. Searches schedules by criteria.
 *
 * @param {ProductionSchedule[]} schedules - All schedules
 * @param {ScheduleSearchCriteria} criteria - Search criteria
 * @returns {ProductionSchedule[]} Matching schedules
 *
 * @example
 * ```typescript
 * const results = searchSchedules(allSchedules, {
 *   facilityId: 'FAC-001',
 *   status: [ScheduleStatus.IN_PROGRESS],
 *   priority: [Priority.HIGH, Priority.URGENT]
 * });
 * ```
 */
export function searchSchedules(
  schedules: ProductionSchedule[],
  criteria: ScheduleSearchCriteria
): ProductionSchedule[] {
  return schedules.filter(schedule => {
    if (criteria.facilityId && schedule.facilityId !== criteria.facilityId) return false;
    if (criteria.status && !criteria.status.includes(schedule.status)) return false;
    if (criteria.priority && !criteria.priority.includes(schedule.priority)) return false;
    if (criteria.workOrderId && schedule.workOrderId !== criteria.workOrderId) return false;
    if (criteria.productId && schedule.productId !== criteria.productId) return false;
    if (criteria.customerId && schedule.customerId !== criteria.customerId) return false;
    if (criteria.dateFrom && schedule.plannedStartDate < criteria.dateFrom) return false;
    if (criteria.dateTo && schedule.plannedStartDate > criteria.dateTo) return false;

    return true;
  });
}

/**
 * 31. Exports schedule data to CSV format.
 *
 * @param {ProductionSchedule[]} schedules - Schedules to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportSchedulesToCSV(schedules);
 * ```
 */
export function exportSchedulesToCSV(schedules: ProductionSchedule[]): string {
  const headers = [
    'Schedule ID',
    'Schedule Number',
    'Work Order',
    'Product ID',
    'Quantity',
    'Priority',
    'Status',
    'Planned Start',
    'Planned End',
    'Due Date',
    'Facility',
    'Operations',
    'Completed %',
  ];

  let csv = headers.join(',') + '\n';

  for (const schedule of schedules) {
    const completion = calculateScheduleCompletion(schedule);

    const row = [
      schedule.scheduleId,
      schedule.scheduleNumber,
      schedule.workOrderId,
      schedule.productId,
      schedule.quantity,
      schedule.priority,
      schedule.status,
      schedule.plannedStartDate.toISOString(),
      schedule.plannedEndDate.toISOString(),
      schedule.dueDate.toISOString(),
      schedule.facilityId,
      schedule.operations.length,
      completion.toFixed(1),
    ];

    csv += row.join(',') + '\n';
  }

  return csv;
}

// ============================================================================
// SECTION 5: EXCEPTION HANDLING (Functions 32-39)
// ============================================================================

/**
 * 32. Creates a schedule exception record.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {ExceptionType} type - Exception type
 * @param {ExceptionSeverity} severity - Exception severity
 * @param {string} title - Exception title
 * @param {string} description - Exception description
 * @param {string} impact - Impact description
 * @returns {ScheduleException} Exception record
 *
 * @example
 * ```typescript
 * const exception = createScheduleException(
 *   'SCH-001',
 *   ExceptionType.EQUIPMENT_FAILURE,
 *   ExceptionSeverity.CRITICAL,
 *   'Machine Breakdown',
 *   'CNC machine failed during operation',
 *   'Production delayed by 4 hours'
 * );
 * ```
 */
export function createScheduleException(
  scheduleId: string,
  type: ExceptionType,
  severity: ExceptionSeverity,
  title: string,
  description: string,
  impact: string
): ScheduleException {
  return {
    exceptionId: crypto.randomUUID(),
    scheduleId,
    type,
    severity,
    title,
    description,
    detectedAt: new Date(),
    impact,
    actionItems: [],
    status: 'OPEN',
  };
}

/**
 * 33. Detects schedule delays and creates exceptions.
 *
 * @param {ProductionSchedule} schedule - Schedule to check
 * @returns {ScheduleException[]} Detected delay exceptions
 *
 * @example
 * ```typescript
 * const delays = detectScheduleDelays(schedule);
 * ```
 */
export function detectScheduleDelays(schedule: ProductionSchedule): ScheduleException[] {
  const exceptions: ScheduleException[] = [];
  const now = new Date();

  for (const operation of schedule.operations) {
    if (
      operation.status === TaskStatus.IN_PROGRESS &&
      operation.endTime &&
      now > operation.endTime
    ) {
      const delayMinutes = Math.round((now.getTime() - operation.endTime.getTime()) / 60000);

      exceptions.push(
        createScheduleException(
          schedule.scheduleId,
          ExceptionType.DELAYED_COMPLETION,
          delayMinutes > 60 ? ExceptionSeverity.ERROR : ExceptionSeverity.WARNING,
          `Operation ${operation.name} Delayed`,
          `Operation is ${delayMinutes} minutes behind schedule`,
          `Schedule may miss due date if not resolved`
        )
      );
    }
  }

  return exceptions;
}

/**
 * 34. Handles resource unavailability exceptions.
 *
 * @param {ProductionSchedule} schedule - Schedule affected
 * @param {string} operationId - Operation ID
 * @param {string} resourceId - Unavailable resource
 * @param {string[]} alternatives - Alternative resources
 * @returns {ScheduleException} Exception with resolution options
 *
 * @example
 * ```typescript
 * const exception = handleResourceUnavailable(
 *   schedule,
 *   'OP-001',
 *   'MACHINE-001',
 *   ['MACHINE-002', 'MACHINE-003']
 * );
 * ```
 */
export function handleResourceUnavailable(
  schedule: ProductionSchedule,
  operationId: string,
  resourceId: string,
  alternatives: string[]
): ScheduleException {
  const operation = schedule.operations.find(op => op.operationId === operationId);

  const exception = createScheduleException(
    schedule.scheduleId,
    ExceptionType.RESOURCE_UNAVAILABLE,
    ExceptionSeverity.ERROR,
    'Resource Unavailable',
    `Resource ${resourceId} is not available for operation ${operation?.name || operationId}`,
    'Operation cannot proceed without resource allocation'
  );

  exception.operationId = operationId;
  exception.actionItems = alternatives.map(alt => `Allocate alternative resource: ${alt}`);

  return exception;
}

/**
 * 35. Handles material shortage exceptions.
 *
 * @param {ProductionSchedule} schedule - Schedule affected
 * @param {string} operationId - Operation ID
 * @param {string} materialId - Material ID
 * @param {number} required - Required quantity
 * @param {number} available - Available quantity
 * @returns {ScheduleException} Material shortage exception
 *
 * @example
 * ```typescript
 * const exception = handleMaterialShortage(schedule, 'OP-001', 'MAT-001', 1000, 750);
 * ```
 */
export function handleMaterialShortage(
  schedule: ProductionSchedule,
  operationId: string,
  materialId: string,
  required: number,
  available: number
): ScheduleException {
  const shortage = required - available;
  const severity = shortage / required > 0.5 ? ExceptionSeverity.CRITICAL : ExceptionSeverity.ERROR;

  const exception = createScheduleException(
    schedule.scheduleId,
    ExceptionType.MATERIAL_SHORTAGE,
    severity,
    'Material Shortage',
    `Material ${materialId} shortage: need ${required}, have ${available}`,
    `Production cannot proceed without ${shortage} additional units`
  );

  exception.operationId = operationId;
  exception.actionItems = [
    `Order ${shortage} units of ${materialId}`,
    'Check alternative materials',
    'Consider partial production with available quantity',
  ];

  return exception;
}

/**
 * 36. Resolves an exception with resolution details.
 *
 * @param {ScheduleException} exception - Exception to resolve
 * @param {string} resolvedBy - User resolving the exception
 * @param {string} resolution - Resolution description
 * @returns {ScheduleException} Resolved exception
 *
 * @example
 * ```typescript
 * const resolved = resolveException(
 *   exception,
 *   'USER-001',
 *   'Allocated alternative machine MACHINE-002'
 * );
 * ```
 */
export function resolveException(
  exception: ScheduleException,
  resolvedBy: string,
  resolution: string
): ScheduleException {
  return {
    ...exception,
    status: 'RESOLVED',
    resolvedAt: new Date(),
    resolvedBy,
    resolution,
  };
}

/**
 * 37. Escalates critical exceptions for management attention.
 *
 * @param {ScheduleException[]} exceptions - Exceptions to check
 * @returns {ScheduleException[]} Critical exceptions requiring escalation
 *
 * @example
 * ```typescript
 * const criticalExceptions = escalateCriticalExceptions(allExceptions);
 * ```
 */
export function escalateCriticalExceptions(
  exceptions: ScheduleException[]
): ScheduleException[] {
  return exceptions.filter(
    ex =>
      ex.severity === ExceptionSeverity.CRITICAL &&
      ex.status === 'OPEN' &&
      // Escalate if open for more than 1 hour
      new Date().getTime() - ex.detectedAt.getTime() > 60 * 60 * 1000
  );
}

/**
 * 38. Generates exception report for a time period.
 *
 * @param {ScheduleException[]} exceptions - All exceptions
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {object} Exception report
 *
 * @example
 * ```typescript
 * const report = generateExceptionReport(exceptions, startDate, endDate);
 * ```
 */
export function generateExceptionReport(
  exceptions: ScheduleException[],
  from: Date,
  to: Date
): {
  totalExceptions: number;
  byType: Record<ExceptionType, number>;
  bySeverity: Record<ExceptionSeverity, number>;
  byStatus: Record<string, number>;
  avgResolutionTime: number; // minutes
  unresolvedCount: number;
} {
  const periodExceptions = exceptions.filter(
    ex => ex.detectedAt >= from && ex.detectedAt <= to
  );

  const byType = periodExceptions.reduce((acc, ex) => {
    acc[ex.type] = (acc[ex.type] || 0) + 1;
    return acc;
  }, {} as Record<ExceptionType, number>);

  const bySeverity = periodExceptions.reduce((acc, ex) => {
    acc[ex.severity] = (acc[ex.severity] || 0) + 1;
    return acc;
  }, {} as Record<ExceptionSeverity, number>);

  const byStatus = periodExceptions.reduce((acc, ex) => {
    acc[ex.status] = (acc[ex.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resolvedExceptions = periodExceptions.filter(ex => ex.resolvedAt);
  const totalResolutionTime = resolvedExceptions.reduce((sum, ex) => {
    if (!ex.resolvedAt) return sum;
    return sum + (ex.resolvedAt.getTime() - ex.detectedAt.getTime());
  }, 0);

  const avgResolutionTime =
    resolvedExceptions.length > 0
      ? totalResolutionTime / resolvedExceptions.length / 60000
      : 0;

  return {
    totalExceptions: periodExceptions.length,
    byType,
    bySeverity,
    byStatus,
    avgResolutionTime,
    unresolvedCount: periodExceptions.filter(ex => ex.status === 'OPEN').length,
  };
}

/**
 * 39. Performs proactive exception detection based on schedule analysis.
 *
 * @param {ProductionSchedule} schedule - Schedule to analyze
 * @param {ResourceAllocation[]} allocations - Resource allocations
 * @param {CapacityAnalysis[]} capacityData - Capacity information
 * @returns {ScheduleException[]} Detected potential exceptions
 *
 * @example
 * ```typescript
 * const potentialIssues = detectPotentialExceptions(schedule, allocations, capacityData);
 * ```
 */
export function detectPotentialExceptions(
  schedule: ProductionSchedule,
  allocations: ResourceAllocation[],
  capacityData: CapacityAnalysis[]
): ScheduleException[] {
  const exceptions: ScheduleException[] = [];

  // Check for capacity issues
  const capacityIssues = validateResourceCapacity(schedule, capacityData);
  if (!capacityIssues.valid) {
    for (const issue of capacityIssues.issues) {
      exceptions.push(
        createScheduleException(
          schedule.scheduleId,
          ExceptionType.CAPACITY_EXCEEDED,
          ExceptionSeverity.WARNING,
          'Capacity Constraint',
          issue.issue,
          'May cause schedule delays'
        )
      );
    }
  }

  // Check for schedule conflicts
  const conflicts = findScheduleConflicts(schedule, allocations);
  for (const conflict of conflicts) {
    exceptions.push(
      createScheduleException(
        schedule.scheduleId,
        ExceptionType.SCHEDULE_CONFLICT,
        ExceptionSeverity.WARNING,
        'Schedule Conflict',
        conflict,
        'Resource double-booked'
      )
    );
  }

  // Check if schedule is at risk of missing due date
  const now = new Date();
  const daysToDeadline = (schedule.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const completion = calculateScheduleCompletion(schedule);

  if (daysToDeadline < 2 && completion < 90) {
    exceptions.push(
      createScheduleException(
        schedule.scheduleId,
        ExceptionType.DELAYED_COMPLETION,
        ExceptionSeverity.WARNING,
        'At Risk of Missing Deadline',
        `Schedule is ${completion.toFixed(1)}% complete with ${daysToDeadline.toFixed(1)} days remaining`,
        'Expedite remaining operations to meet deadline'
      )
    );
  }

  return exceptions;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates unique schedule ID.
 */
function generateScheduleId(): string {
  return `SCH-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates human-readable schedule number.
 */
function generateScheduleNumber(facilityId: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.getTime().toString().slice(-4);
  const facCode = facilityId.replace(/[^A-Z0-9]/g, '');

  return `${facCode}-${dateStr}-${timeStr}`;
}

/**
 * Helper: Detects circular dependencies in operations.
 */
function detectCircularDependencies(operations: TaskOperation[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(opId: string): boolean {
    visited.add(opId);
    recursionStack.add(opId);

    const operation = operations.find(op => op.operationId === opId);
    if (!operation) return false;

    for (const depId of operation.dependencies) {
      if (!visited.has(depId)) {
        if (hasCycle(depId)) return true;
      } else if (recursionStack.has(depId)) {
        return true;
      }
    }

    recursionStack.delete(opId);
    return false;
  }

  for (const operation of operations) {
    if (!visited.has(operation.operationId)) {
      if (hasCycle(operation.operationId)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper: Finds schedule conflicts in resource allocations.
 */
function findScheduleConflicts(
  schedule: ProductionSchedule,
  allocations: ResourceAllocation[]
): string[] {
  const conflicts: string[] = [];
  const scheduleAllocations = allocations.filter(a => a.scheduleId === schedule.scheduleId);

  for (let i = 0; i < scheduleAllocations.length; i++) {
    for (let j = i + 1; j < scheduleAllocations.length; j++) {
      const alloc1 = scheduleAllocations[i];
      const alloc2 = scheduleAllocations[j];

      if (
        alloc1.resourceId === alloc2.resourceId &&
        alloc1.operationId !== alloc2.operationId &&
        ((alloc1.allocatedFrom >= alloc2.allocatedFrom &&
          alloc1.allocatedFrom < alloc2.allocatedTo) ||
          (alloc1.allocatedTo > alloc2.allocatedFrom &&
            alloc1.allocatedTo <= alloc2.allocatedTo))
      ) {
        conflicts.push(
          `Resource ${alloc1.resourceId} has conflicting allocations for operations ${alloc1.operationId} and ${alloc2.operationId}`
        );
      }
    }
  }

  return conflicts;
}

// ============================================================================
// OPENAPI / SWAGGER SCHEMAS
// ============================================================================

/**
 * OpenAPI 3.0 Schema Definitions
 *
 * These schemas can be used directly in OpenAPI/Swagger specifications for API documentation.
 * They provide comprehensive type definitions for all data structures used in the
 * schedule execution engine.
 */

export const OPENAPI_SCHEMAS = {
  ProductionSchedule: {
    type: 'object',
    required: [
      'scheduleId',
      'scheduleNumber',
      'workOrderId',
      'productId',
      'quantity',
      'status',
      'facilityId',
    ],
    properties: {
      scheduleId: { type: 'string', example: 'SCH-550e8400-e29b-41d4-a716-446655440000' },
      scheduleNumber: { type: 'string', example: 'FAC001-20240115-2345' },
      name: { type: 'string', example: 'Schedule for WO WO-2024-001' },
      description: { type: 'string', example: 'Production schedule for widget assembly' },
      workOrderId: { type: 'string', example: 'WO-2024-001' },
      productId: { type: 'string', example: 'PROD-12345' },
      quantity: { type: 'number', example: 1000 },
      unit: { type: 'string', example: 'EA' },
      priority: { type: 'string', enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL'] },
      status: {
        type: 'string',
        enum: ['DRAFT', 'PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'],
      },
      plannedStartDate: { type: 'string', format: 'date-time' },
      plannedEndDate: { type: 'string', format: 'date-time' },
      actualStartDate: { type: 'string', format: 'date-time', nullable: true },
      actualEndDate: { type: 'string', format: 'date-time', nullable: true },
      operations: { type: 'array', items: { $ref: '#/components/schemas/TaskOperation' } },
      milestones: { type: 'array', items: { $ref: '#/components/schemas/ScheduleMilestone' } },
      facilityId: { type: 'string', example: 'FAC-001' },
      customerId: { type: 'string', example: 'CUST-001', nullable: true },
      dueDate: { type: 'string', format: 'date-time' },
      createdBy: { type: 'string', example: 'USER-001' },
      createdAt: { type: 'string', format: 'date-time' },
      lastUpdated: { type: 'string', format: 'date-time' },
      metadata: { type: 'object', additionalProperties: true },
    },
  },

  TaskOperation: {
    type: 'object',
    required: ['operationId', 'sequenceNumber', 'name', 'workCenterId', 'status'],
    properties: {
      operationId: { type: 'string', format: 'uuid' },
      sequenceNumber: { type: 'number', example: 10 },
      name: { type: 'string', example: 'Cutting Operation' },
      description: { type: 'string', example: 'Cut raw materials to size' },
      workCenterId: { type: 'string', example: 'WC-CUTTING-01' },
      estimatedDuration: { type: 'number', description: 'Duration in minutes', example: 120 },
      setupTime: { type: 'number', description: 'Setup time in minutes', example: 30 },
      teardownTime: { type: 'number', description: 'Teardown time in minutes', example: 15 },
      status: {
        type: 'string',
        enum: ['PENDING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'FAILED', 'SKIPPED'],
      },
      resources: { type: 'array', items: { $ref: '#/components/schemas/ResourceRequirement' } },
      dependencies: { type: 'array', items: { type: 'string' } },
      startTime: { type: 'string', format: 'date-time', nullable: true },
      endTime: { type: 'string', format: 'date-time', nullable: true },
      actualDuration: { type: 'number', nullable: true },
      completedBy: { type: 'string', nullable: true },
      qualityCheckRequired: { type: 'boolean', example: true },
      notes: { type: 'string', nullable: true },
    },
  },

  ResourceRequirement: {
    type: 'object',
    required: ['requirementId', 'resourceType', 'quantity', 'unit'],
    properties: {
      requirementId: { type: 'string', format: 'uuid' },
      resourceType: { type: 'string', enum: ['MACHINE', 'LABOR', 'TOOL', 'MATERIAL', 'FACILITY'] },
      resourceId: { type: 'string', example: 'MACHINE-CUT-01', nullable: true },
      quantity: { type: 'number', example: 1 },
      unit: { type: 'string', example: 'EA' },
      duration: { type: 'number', description: 'Duration in minutes', nullable: true },
      setupTime: { type: 'number', description: 'Setup time in minutes', nullable: true },
      skillLevel: { type: 'string', example: 'Expert', nullable: true },
      alternatives: { type: 'array', items: { type: 'string' } },
    },
  },

  ResourceAllocation: {
    type: 'object',
    properties: {
      allocationId: { type: 'string', format: 'uuid' },
      scheduleId: { type: 'string', example: 'SCH-001' },
      operationId: { type: 'string', format: 'uuid' },
      resourceType: { type: 'string', enum: ['MACHINE', 'LABOR', 'TOOL', 'MATERIAL', 'FACILITY'] },
      resourceId: { type: 'string', example: 'MACHINE-001' },
      resourceName: { type: 'string', example: 'CNC Machine #1' },
      quantity: { type: 'number', example: 1 },
      unit: { type: 'string', example: 'EA' },
      allocatedFrom: { type: 'string', format: 'date-time' },
      allocatedTo: { type: 'string', format: 'date-time' },
      actualFrom: { type: 'string', format: 'date-time', nullable: true },
      actualTo: { type: 'string', format: 'date-time', nullable: true },
      status: {
        type: 'string',
        enum: ['AVAILABLE', 'ALLOCATED', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE'],
      },
      utilizationRate: { type: 'number', example: 85.5, nullable: true },
      cost: { type: 'number', example: 150.0, nullable: true },
    },
  },

  ScheduleException: {
    type: 'object',
    properties: {
      exceptionId: { type: 'string', format: 'uuid' },
      scheduleId: { type: 'string', example: 'SCH-001' },
      operationId: { type: 'string', format: 'uuid', nullable: true },
      type: {
        type: 'string',
        enum: [
          'RESOURCE_UNAVAILABLE',
          'MATERIAL_SHORTAGE',
          'QUALITY_ISSUE',
          'EQUIPMENT_FAILURE',
          'SCHEDULE_CONFLICT',
          'CAPACITY_EXCEEDED',
          'DELAYED_COMPLETION',
          'SAFETY_CONCERN',
        ],
      },
      severity: { type: 'string', enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] },
      title: { type: 'string', example: 'Machine Breakdown' },
      description: { type: 'string', example: 'CNC machine failed during operation' },
      detectedAt: { type: 'string', format: 'date-time' },
      resolvedAt: { type: 'string', format: 'date-time', nullable: true },
      resolvedBy: { type: 'string', nullable: true },
      resolution: { type: 'string', nullable: true },
      impact: { type: 'string', example: 'Production delayed by 4 hours' },
      actionItems: { type: 'array', items: { type: 'string' } },
      status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
    },
  },

  ScheduleMetrics: {
    type: 'object',
    properties: {
      scheduleId: { type: 'string', example: 'SCH-001' },
      onTimePerformance: { type: 'number', description: 'Percentage', example: 95.5 },
      utilizationRate: { type: 'number', description: 'Percentage', example: 87.3 },
      efficiencyRate: { type: 'number', description: 'Percentage', example: 92.1 },
      cycleTimeVariance: { type: 'number', description: 'Percentage', example: -5.2 },
      qualityRate: { type: 'number', description: 'Percentage', example: 98.7 },
      completionRate: { type: 'number', description: 'Percentage', example: 75.0 },
      exceptionCount: { type: 'number', example: 3 },
      avgSetupTime: { type: 'number', description: 'Minutes', example: 28.5 },
      avgProcessTime: { type: 'number', description: 'Minutes', example: 115.2 },
    },
  },

  CapacityAnalysis: {
    type: 'object',
    properties: {
      workCenterId: { type: 'string', example: 'WC-001' },
      workCenterName: { type: 'string', example: 'Cutting Department' },
      date: { type: 'string', format: 'date-time' },
      totalCapacity: { type: 'number', description: 'Minutes', example: 480 },
      scheduledLoad: { type: 'number', description: 'Minutes', example: 420 },
      utilizationRate: { type: 'number', description: 'Percentage', example: 87.5 },
      overloaded: { type: 'boolean', example: false },
      availableCapacity: { type: 'number', description: 'Minutes', example: 60 },
      scheduledJobs: { type: 'number', example: 8 },
    },
  },

  // API Request/Response Examples
  CreateScheduleRequest: {
    type: 'object',
    required: ['workOrderId', 'productId', 'quantity', 'unit', 'dueDate', 'facilityId', 'createdBy'],
    properties: {
      workOrderId: { type: 'string', example: 'WO-2024-001' },
      productId: { type: 'string', example: 'PROD-12345' },
      quantity: { type: 'number', example: 1000 },
      unit: { type: 'string', example: 'EA' },
      priority: { type: 'string', enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL'], default: 'NORMAL' },
      dueDate: { type: 'string', format: 'date-time' },
      facilityId: { type: 'string', example: 'FAC-001' },
      customerId: { type: 'string', example: 'CUST-001', nullable: true },
      createdBy: { type: 'string', example: 'USER-001' },
    },
  },

  StartOperationRequest: {
    type: 'object',
    required: ['operationId', 'startedBy'],
    properties: {
      operationId: { type: 'string', format: 'uuid' },
      startedBy: { type: 'string', example: 'USER-001' },
    },
  },

  CompleteOperationRequest: {
    type: 'object',
    required: ['operationId', 'completedBy'],
    properties: {
      operationId: { type: 'string', format: 'uuid' },
      completedBy: { type: 'string', example: 'USER-001' },
      output: { type: 'number', example: 950, nullable: true },
      scrap: { type: 'number', example: 50, nullable: true },
      rework: { type: 'number', example: 0, nullable: true },
      notes: { type: 'string', example: 'Completed successfully', nullable: true },
    },
  },
};

/**
 * Example API Endpoints Documentation
 *
 * POST /api/schedules
 * Summary: Create a new production schedule
 * Request Body: CreateScheduleRequest
 * Response: ProductionSchedule
 *
 * GET /api/schedules/{scheduleId}
 * Summary: Get schedule by ID
 * Response: ProductionSchedule
 *
 * PUT /api/schedules/{scheduleId}/release
 * Summary: Release schedule for execution
 * Response: ProductionSchedule
 *
 * POST /api/schedules/{scheduleId}/operations/{operationId}/start
 * Summary: Start operation execution
 * Request Body: StartOperationRequest
 * Response: ProductionSchedule
 *
 * POST /api/schedules/{scheduleId}/operations/{operationId}/complete
 * Summary: Complete operation
 * Request Body: CompleteOperationRequest
 * Response: ProductionSchedule
 *
 * GET /api/schedules/{scheduleId}/metrics
 * Summary: Get schedule performance metrics
 * Response: ScheduleMetrics
 *
 * GET /api/schedules/{scheduleId}/exceptions
 * Summary: Get schedule exceptions
 * Response: Array of ScheduleException
 *
 * POST /api/resources/allocate
 * Summary: Allocate resource to operation
 * Response: ResourceAllocation
 *
 * GET /api/work-centers/{workCenterId}/capacity
 * Summary: Get work center capacity analysis
 * Response: CapacityAnalysis
 */

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Schedule Creation
  createProductionSchedule,
  addOperation,
  calculateOperationDates,
  addMilestone,
  validateScheduleForRelease,
  releaseSchedule,
  cloneSchedule,
  optimizeSchedule,

  // Task Execution
  startScheduleExecution,
  startOperation,
  completeOperation,
  recordOperationProgress,
  pauseOperation,
  resumeOperation,
  createExecutionJob,
  dispatchJobs,

  // Resource Management
  allocateResource,
  checkResourceAvailability,
  releaseResourceAllocation,
  findAlternativeResources,
  calculateResourceUtilization,
  analyzeWorkCenterCapacity,
  rebalanceResourceAllocations,
  validateResourceCapacity,

  // Status Tracking
  recordTimelineEvent,
  calculateScheduleCompletion,
  generateScheduleMetrics,
  getScheduleStatusSummary,
  identifyCriticalPath,
  searchSchedules,
  exportSchedulesToCSV,

  // Exception Handling
  createScheduleException,
  detectScheduleDelays,
  handleResourceUnavailable,
  handleMaterialShortage,
  resolveException,
  escalateCriticalExceptions,
  generateExceptionReport,
  detectPotentialExceptions,
};

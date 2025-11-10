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
 * Schedule status enumeration
 */
export declare enum ScheduleStatus {
    DRAFT = "DRAFT",
    PLANNED = "PLANNED",
    RELEASED = "RELEASED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED"
}
/**
 * Task execution status
 */
export declare enum TaskStatus {
    PENDING = "PENDING",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    BLOCKED = "BLOCKED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
/**
 * Resource type enumeration
 */
export declare enum ResourceType {
    MACHINE = "MACHINE",
    LABOR = "LABOR",
    TOOL = "TOOL",
    MATERIAL = "MATERIAL",
    FACILITY = "FACILITY"
}
/**
 * Resource status
 */
export declare enum ResourceStatus {
    AVAILABLE = "AVAILABLE",
    ALLOCATED = "ALLOCATED",
    IN_USE = "IN_USE",
    MAINTENANCE = "MAINTENANCE",
    UNAVAILABLE = "UNAVAILABLE"
}
/**
 * Priority levels
 */
export declare enum Priority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
/**
 * Exception severity levels
 */
export declare enum ExceptionSeverity {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
/**
 * Exception type enumeration
 */
export declare enum ExceptionType {
    RESOURCE_UNAVAILABLE = "RESOURCE_UNAVAILABLE",
    MATERIAL_SHORTAGE = "MATERIAL_SHORTAGE",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    EQUIPMENT_FAILURE = "EQUIPMENT_FAILURE",
    SCHEDULE_CONFLICT = "SCHEDULE_CONFLICT",
    CAPACITY_EXCEEDED = "CAPACITY_EXCEEDED",
    DELAYED_COMPLETION = "DELAYED_COMPLETION",
    SAFETY_CONCERN = "SAFETY_CONCERN"
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
    duration?: number;
    setupTime?: number;
    skillLevel?: string;
    alternatives?: string[];
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
    estimatedDuration: number;
    setupTime: number;
    teardownTime: number;
    status: TaskStatus;
    resources: ResourceRequirement[];
    dependencies: string[];
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
    utilizationRate?: number;
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
    progress: number;
    output?: number;
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
    totalCapacity: number;
    scheduledLoad: number;
    utilizationRate: number;
    overloaded: boolean;
    availableCapacity: number;
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
    onTimePerformance: number;
    utilizationRate: number;
    efficiencyRate: number;
    cycleTimeVariance: number;
    qualityRate: number;
    completionRate: number;
    exceptionCount: number;
    avgSetupTime: number;
    avgProcessTime: number;
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
    utilizationRate: number;
}
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
export declare function createProductionSchedule(config: ScheduleConfig): ProductionSchedule;
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
export declare function addOperation(schedule: ProductionSchedule, operation: Partial<TaskOperation>): ProductionSchedule;
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
export declare function calculateOperationDates(schedule: ProductionSchedule, startDate: Date): ProductionSchedule;
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
export declare function addMilestone(schedule: ProductionSchedule, milestone: Partial<ScheduleMilestone>): ProductionSchedule;
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
export declare function validateScheduleForRelease(schedule: ProductionSchedule): {
    valid: boolean;
    issues: string[];
    warnings: string[];
};
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
export declare function releaseSchedule(schedule: ProductionSchedule, releasedBy: string): ProductionSchedule;
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
export declare function cloneSchedule(schedule: ProductionSchedule, overrides?: Partial<ScheduleConfig>): ProductionSchedule;
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
export declare function optimizeSchedule(schedule: ProductionSchedule, capacityData: CapacityAnalysis[]): ProductionSchedule;
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
export declare function startScheduleExecution(schedule: ProductionSchedule, startedBy: string): ProductionSchedule;
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
export declare function startOperation(schedule: ProductionSchedule, operationId: string, startedBy: string): ProductionSchedule;
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
export declare function completeOperation(schedule: ProductionSchedule, operationId: string, completionData: {
    completedBy: string;
    output?: number;
    scrap?: number;
    rework?: number;
    notes?: string;
}): ProductionSchedule;
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
export declare function recordOperationProgress(job: ExecutionJob, progress: number, output: number): ExecutionJob;
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
export declare function pauseOperation(schedule: ProductionSchedule, operationId: string, reason: string): ProductionSchedule;
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
export declare function resumeOperation(schedule: ProductionSchedule, operationId: string, resumedBy: string): ProductionSchedule;
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
export declare function createExecutionJob(schedule: ProductionSchedule, operationId: string): ExecutionJob;
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
export declare function dispatchJobs(jobs: ExecutionJob[], capacityData: CapacityAnalysis[]): ExecutionJob[];
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
export declare function allocateResource(scheduleId: string, operationId: string, requirement: ResourceRequirement, from: Date, to: Date): ResourceAllocation;
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
export declare function checkResourceAvailability(resourceId: string, resourceType: ResourceType, from: Date, to: Date, existingAllocations: ResourceAllocation[]): ResourceAvailability;
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
export declare function releaseResourceAllocation(allocation: ResourceAllocation): ResourceAllocation;
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
export declare function findAlternativeResources(requirement: ResourceRequirement, availabilityData: ResourceAvailability[]): string[];
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
export declare function calculateResourceUtilization(resourceId: string, allocations: ResourceAllocation[], from: Date, to: Date): number;
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
export declare function analyzeWorkCenterCapacity(workCenterId: string, date: Date, scheduledJobs: ExecutionJob[], availableMinutes: number): CapacityAnalysis;
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
export declare function rebalanceResourceAllocations(allocations: ResourceAllocation[], capacityData: CapacityAnalysis[]): ResourceAllocation[];
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
export declare function validateResourceCapacity(schedule: ProductionSchedule, capacityData: CapacityAnalysis[]): {
    valid: boolean;
    issues: Array<{
        operationId: string;
        workCenterId: string;
        issue: string;
    }>;
};
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
export declare function recordTimelineEvent(scheduleId: string, operationId: string, event: string, status: TaskStatus, performedBy?: string): TimelineEntry;
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
export declare function calculateScheduleCompletion(schedule: ProductionSchedule): number;
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
export declare function generateScheduleMetrics(schedule: ProductionSchedule, allocations: ResourceAllocation[]): ScheduleMetrics;
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
export declare function getScheduleStatusSummary(schedule: ProductionSchedule): {
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
};
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
export declare function identifyCriticalPath(schedule: ProductionSchedule): string[];
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
export declare function searchSchedules(schedules: ProductionSchedule[], criteria: ScheduleSearchCriteria): ProductionSchedule[];
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
export declare function exportSchedulesToCSV(schedules: ProductionSchedule[]): string;
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
export declare function createScheduleException(scheduleId: string, type: ExceptionType, severity: ExceptionSeverity, title: string, description: string, impact: string): ScheduleException;
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
export declare function detectScheduleDelays(schedule: ProductionSchedule): ScheduleException[];
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
export declare function handleResourceUnavailable(schedule: ProductionSchedule, operationId: string, resourceId: string, alternatives: string[]): ScheduleException;
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
export declare function handleMaterialShortage(schedule: ProductionSchedule, operationId: string, materialId: string, required: number, available: number): ScheduleException;
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
export declare function resolveException(exception: ScheduleException, resolvedBy: string, resolution: string): ScheduleException;
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
export declare function escalateCriticalExceptions(exceptions: ScheduleException[]): ScheduleException[];
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
export declare function generateExceptionReport(exceptions: ScheduleException[], from: Date, to: Date): {
    totalExceptions: number;
    byType: Record<ExceptionType, number>;
    bySeverity: Record<ExceptionSeverity, number>;
    byStatus: Record<string, number>;
    avgResolutionTime: number;
    unresolvedCount: number;
};
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
export declare function detectPotentialExceptions(schedule: ProductionSchedule, allocations: ResourceAllocation[], capacityData: CapacityAnalysis[]): ScheduleException[];
/**
 * OpenAPI 3.0 Schema Definitions
 *
 * These schemas can be used directly in OpenAPI/Swagger specifications for API documentation.
 * They provide comprehensive type definitions for all data structures used in the
 * schedule execution engine.
 */
export declare const OPENAPI_SCHEMAS: {
    ProductionSchedule: {
        type: string;
        required: string[];
        properties: {
            scheduleId: {
                type: string;
                example: string;
            };
            scheduleNumber: {
                type: string;
                example: string;
            };
            name: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            workOrderId: {
                type: string;
                example: string;
            };
            productId: {
                type: string;
                example: string;
            };
            quantity: {
                type: string;
                example: number;
            };
            unit: {
                type: string;
                example: string;
            };
            priority: {
                type: string;
                enum: string[];
            };
            status: {
                type: string;
                enum: string[];
            };
            plannedStartDate: {
                type: string;
                format: string;
            };
            plannedEndDate: {
                type: string;
                format: string;
            };
            actualStartDate: {
                type: string;
                format: string;
                nullable: boolean;
            };
            actualEndDate: {
                type: string;
                format: string;
                nullable: boolean;
            };
            operations: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            milestones: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            facilityId: {
                type: string;
                example: string;
            };
            customerId: {
                type: string;
                example: string;
                nullable: boolean;
            };
            dueDate: {
                type: string;
                format: string;
            };
            createdBy: {
                type: string;
                example: string;
            };
            createdAt: {
                type: string;
                format: string;
            };
            lastUpdated: {
                type: string;
                format: string;
            };
            metadata: {
                type: string;
                additionalProperties: boolean;
            };
        };
    };
    TaskOperation: {
        type: string;
        required: string[];
        properties: {
            operationId: {
                type: string;
                format: string;
            };
            sequenceNumber: {
                type: string;
                example: number;
            };
            name: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            workCenterId: {
                type: string;
                example: string;
            };
            estimatedDuration: {
                type: string;
                description: string;
                example: number;
            };
            setupTime: {
                type: string;
                description: string;
                example: number;
            };
            teardownTime: {
                type: string;
                description: string;
                example: number;
            };
            status: {
                type: string;
                enum: string[];
            };
            resources: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            dependencies: {
                type: string;
                items: {
                    type: string;
                };
            };
            startTime: {
                type: string;
                format: string;
                nullable: boolean;
            };
            endTime: {
                type: string;
                format: string;
                nullable: boolean;
            };
            actualDuration: {
                type: string;
                nullable: boolean;
            };
            completedBy: {
                type: string;
                nullable: boolean;
            };
            qualityCheckRequired: {
                type: string;
                example: boolean;
            };
            notes: {
                type: string;
                nullable: boolean;
            };
        };
    };
    ResourceRequirement: {
        type: string;
        required: string[];
        properties: {
            requirementId: {
                type: string;
                format: string;
            };
            resourceType: {
                type: string;
                enum: string[];
            };
            resourceId: {
                type: string;
                example: string;
                nullable: boolean;
            };
            quantity: {
                type: string;
                example: number;
            };
            unit: {
                type: string;
                example: string;
            };
            duration: {
                type: string;
                description: string;
                nullable: boolean;
            };
            setupTime: {
                type: string;
                description: string;
                nullable: boolean;
            };
            skillLevel: {
                type: string;
                example: string;
                nullable: boolean;
            };
            alternatives: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
    ResourceAllocation: {
        type: string;
        properties: {
            allocationId: {
                type: string;
                format: string;
            };
            scheduleId: {
                type: string;
                example: string;
            };
            operationId: {
                type: string;
                format: string;
            };
            resourceType: {
                type: string;
                enum: string[];
            };
            resourceId: {
                type: string;
                example: string;
            };
            resourceName: {
                type: string;
                example: string;
            };
            quantity: {
                type: string;
                example: number;
            };
            unit: {
                type: string;
                example: string;
            };
            allocatedFrom: {
                type: string;
                format: string;
            };
            allocatedTo: {
                type: string;
                format: string;
            };
            actualFrom: {
                type: string;
                format: string;
                nullable: boolean;
            };
            actualTo: {
                type: string;
                format: string;
                nullable: boolean;
            };
            status: {
                type: string;
                enum: string[];
            };
            utilizationRate: {
                type: string;
                example: number;
                nullable: boolean;
            };
            cost: {
                type: string;
                example: number;
                nullable: boolean;
            };
        };
    };
    ScheduleException: {
        type: string;
        properties: {
            exceptionId: {
                type: string;
                format: string;
            };
            scheduleId: {
                type: string;
                example: string;
            };
            operationId: {
                type: string;
                format: string;
                nullable: boolean;
            };
            type: {
                type: string;
                enum: string[];
            };
            severity: {
                type: string;
                enum: string[];
            };
            title: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            detectedAt: {
                type: string;
                format: string;
            };
            resolvedAt: {
                type: string;
                format: string;
                nullable: boolean;
            };
            resolvedBy: {
                type: string;
                nullable: boolean;
            };
            resolution: {
                type: string;
                nullable: boolean;
            };
            impact: {
                type: string;
                example: string;
            };
            actionItems: {
                type: string;
                items: {
                    type: string;
                };
            };
            status: {
                type: string;
                enum: string[];
            };
        };
    };
    ScheduleMetrics: {
        type: string;
        properties: {
            scheduleId: {
                type: string;
                example: string;
            };
            onTimePerformance: {
                type: string;
                description: string;
                example: number;
            };
            utilizationRate: {
                type: string;
                description: string;
                example: number;
            };
            efficiencyRate: {
                type: string;
                description: string;
                example: number;
            };
            cycleTimeVariance: {
                type: string;
                description: string;
                example: number;
            };
            qualityRate: {
                type: string;
                description: string;
                example: number;
            };
            completionRate: {
                type: string;
                description: string;
                example: number;
            };
            exceptionCount: {
                type: string;
                example: number;
            };
            avgSetupTime: {
                type: string;
                description: string;
                example: number;
            };
            avgProcessTime: {
                type: string;
                description: string;
                example: number;
            };
        };
    };
    CapacityAnalysis: {
        type: string;
        properties: {
            workCenterId: {
                type: string;
                example: string;
            };
            workCenterName: {
                type: string;
                example: string;
            };
            date: {
                type: string;
                format: string;
            };
            totalCapacity: {
                type: string;
                description: string;
                example: number;
            };
            scheduledLoad: {
                type: string;
                description: string;
                example: number;
            };
            utilizationRate: {
                type: string;
                description: string;
                example: number;
            };
            overloaded: {
                type: string;
                example: boolean;
            };
            availableCapacity: {
                type: string;
                description: string;
                example: number;
            };
            scheduledJobs: {
                type: string;
                example: number;
            };
        };
    };
    CreateScheduleRequest: {
        type: string;
        required: string[];
        properties: {
            workOrderId: {
                type: string;
                example: string;
            };
            productId: {
                type: string;
                example: string;
            };
            quantity: {
                type: string;
                example: number;
            };
            unit: {
                type: string;
                example: string;
            };
            priority: {
                type: string;
                enum: string[];
                default: string;
            };
            dueDate: {
                type: string;
                format: string;
            };
            facilityId: {
                type: string;
                example: string;
            };
            customerId: {
                type: string;
                example: string;
                nullable: boolean;
            };
            createdBy: {
                type: string;
                example: string;
            };
        };
    };
    StartOperationRequest: {
        type: string;
        required: string[];
        properties: {
            operationId: {
                type: string;
                format: string;
            };
            startedBy: {
                type: string;
                example: string;
            };
        };
    };
    CompleteOperationRequest: {
        type: string;
        required: string[];
        properties: {
            operationId: {
                type: string;
                format: string;
            };
            completedBy: {
                type: string;
                example: string;
            };
            output: {
                type: string;
                example: number;
                nullable: boolean;
            };
            scrap: {
                type: string;
                example: number;
                nullable: boolean;
            };
            rework: {
                type: string;
                example: number;
                nullable: boolean;
            };
            notes: {
                type: string;
                example: string;
                nullable: boolean;
            };
        };
    };
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
declare const _default: {
    createProductionSchedule: typeof createProductionSchedule;
    addOperation: typeof addOperation;
    calculateOperationDates: typeof calculateOperationDates;
    addMilestone: typeof addMilestone;
    validateScheduleForRelease: typeof validateScheduleForRelease;
    releaseSchedule: typeof releaseSchedule;
    cloneSchedule: typeof cloneSchedule;
    optimizeSchedule: typeof optimizeSchedule;
    startScheduleExecution: typeof startScheduleExecution;
    startOperation: typeof startOperation;
    completeOperation: typeof completeOperation;
    recordOperationProgress: typeof recordOperationProgress;
    pauseOperation: typeof pauseOperation;
    resumeOperation: typeof resumeOperation;
    createExecutionJob: typeof createExecutionJob;
    dispatchJobs: typeof dispatchJobs;
    allocateResource: typeof allocateResource;
    checkResourceAvailability: typeof checkResourceAvailability;
    releaseResourceAllocation: typeof releaseResourceAllocation;
    findAlternativeResources: typeof findAlternativeResources;
    calculateResourceUtilization: typeof calculateResourceUtilization;
    analyzeWorkCenterCapacity: typeof analyzeWorkCenterCapacity;
    rebalanceResourceAllocations: typeof rebalanceResourceAllocations;
    validateResourceCapacity: typeof validateResourceCapacity;
    recordTimelineEvent: typeof recordTimelineEvent;
    calculateScheduleCompletion: typeof calculateScheduleCompletion;
    generateScheduleMetrics: typeof generateScheduleMetrics;
    getScheduleStatusSummary: typeof getScheduleStatusSummary;
    identifyCriticalPath: typeof identifyCriticalPath;
    searchSchedules: typeof searchSchedules;
    exportSchedulesToCSV: typeof exportSchedulesToCSV;
    createScheduleException: typeof createScheduleException;
    detectScheduleDelays: typeof detectScheduleDelays;
    handleResourceUnavailable: typeof handleResourceUnavailable;
    handleMaterialShortage: typeof handleMaterialShortage;
    resolveException: typeof resolveException;
    escalateCriticalExceptions: typeof escalateCriticalExceptions;
    generateExceptionReport: typeof generateExceptionReport;
    detectPotentialExceptions: typeof detectPotentialExceptions;
};
export default _default;
//# sourceMappingURL=schedule-execution-engine-kit.d.ts.map
/**
 * LOC: WH-LABOR-001
 * File: /reuse/logistics/warehouse-labor-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse management systems
 *   - Labor tracking services
 *   - Productivity analytics
 *   - Payroll systems
 */
/**
 * Task category enumeration
 */
export declare enum TaskCategory {
    RECEIVING = "RECEIVING",
    PUTAWAY = "PUTAWAY",
    PICKING = "PICKING",
    PACKING = "PACKING",
    LOADING = "LOADING",
    REPLENISHMENT = "REPLENISHMENT",
    CYCLE_COUNT = "CYCLE_COUNT",
    QUALITY_CHECK = "QUALITY_CHECK",
    RETURNS_PROCESSING = "RETURNS_PROCESSING",
    MAINTENANCE = "MAINTENANCE"
}
/**
 * Task status enumeration
 */
export declare enum TaskStatus {
    UNASSIGNED = "UNASSIGNED",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    OVERDUE = "OVERDUE"
}
/**
 * Skill level enumeration
 */
export declare enum SkillLevel {
    NOVICE = "NOVICE",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT",
    TRAINER = "TRAINER"
}
/**
 * Performance rating enumeration
 */
export declare enum PerformanceRating {
    EXCELLENT = "EXCELLENT",
    ABOVE_AVERAGE = "ABOVE_AVERAGE",
    MEETS_EXPECTATIONS = "MEETS_EXPECTATIONS",
    NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT",
    UNSATISFACTORY = "UNSATISFACTORY"
}
/**
 * Incentive type enumeration
 */
export declare enum IncentiveType {
    PRODUCTIVITY = "PRODUCTIVITY",
    QUALITY = "QUALITY",
    ATTENDANCE = "ATTENDANCE",
    SAFETY = "SAFETY",
    TEAM_PERFORMANCE = "TEAM_PERFORMANCE"
}
/**
 * Labor standard - Engineered time standard for warehouse tasks
 */
export interface LaborStandard {
    standardId: string;
    taskCategory: TaskCategory;
    taskName: string;
    description: string;
    standardTime: number;
    unitsPerHour: number;
    difficultyLevel: number;
    requiredSkillLevel: SkillLevel;
    equipmentRequired?: string[];
    efficiencyFactor: number;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Task assignment
 */
export interface TaskAssignment {
    assignmentId: string;
    taskId: string;
    taskCategory: TaskCategory;
    taskName: string;
    workerId: string;
    workerName: string;
    standardId?: string;
    status: TaskStatus;
    priority: number;
    assignedAt: Date;
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    estimatedDuration: number;
    actualDuration?: number;
    quantity: number;
    completedQuantity: number;
    location?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Time entry for tracking work time
 */
export interface TimeEntry {
    entryId: string;
    workerId: string;
    assignmentId?: string;
    taskCategory?: TaskCategory;
    startTime: Date;
    endTime?: Date;
    pausedAt?: Date;
    resumedAt?: Date;
    pauseDuration: number;
    actualDuration: number;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
    breaks: TimeBreak[];
    metadata?: Record<string, any>;
}
/**
 * Time break record
 */
export interface TimeBreak {
    breakId: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    breakType: 'MEAL' | 'REST' | 'EMERGENCY' | 'UNAUTHORIZED';
}
/**
 * Worker shift information
 */
export interface WorkerShift {
    shiftId: string;
    workerId: string;
    workerName: string;
    shiftDate: Date;
    shiftStart: Date;
    shiftEnd: Date;
    scheduledHours: number;
    actualHours: number;
    productiveHours: number;
    breakHours: number;
    idleHours: number;
    overtimeHours: number;
    assignments: TaskAssignment[];
    timeEntries: TimeEntry[];
}
/**
 * Productivity metrics
 */
export interface ProductivityMetrics {
    workerId: string;
    workerName: string;
    period: {
        start: Date;
        end: Date;
    };
    totalHours: number;
    productiveHours: number;
    idleHours: number;
    tasksCompleted: number;
    unitsProcessed: number;
    unitsPerHour: number;
    efficiency: number;
    utilization: number;
    qualityScore?: number;
    accuracyRate?: number;
    taskBreakdown: Record<TaskCategory, number>;
}
/**
 * Performance goal
 */
export interface PerformanceGoal {
    goalId: string;
    name: string;
    metricType: 'UPH' | 'EFFICIENCY' | 'ACCURACY' | 'TASKS_COMPLETED';
    targetValue: number;
    currentValue: number;
    progress: number;
    startDate: Date;
    endDate: Date;
    achieved: boolean;
}
/**
 * Incentive plan
 */
export interface IncentivePlan {
    planId: string;
    name: string;
    type: IncentiveType;
    description: string;
    active: boolean;
    startDate: Date;
    endDate?: Date;
    tiers: IncentiveTier[];
    payoutFrequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    eligibilityCriteria?: Record<string, any>;
}
/**
 * Incentive tier (threshold-based rewards)
 */
export interface IncentiveTier {
    tierId: string;
    threshold: number;
    reward: number;
    rewardType: 'FIXED' | 'PERCENTAGE';
    description: string;
}
/**
 * Incentive earnings calculation
 */
export interface IncentiveEarnings {
    workerId: string;
    workerName: string;
    period: {
        start: Date;
        end: Date;
    };
    planId: string;
    planName: string;
    performanceValue: number;
    tierAchieved?: IncentiveTier;
    baseEarnings: number;
    incentiveAmount: number;
    totalEarnings: number;
    breakdown: Array<{
        date: Date;
        value: number;
        amount: number;
    }>;
}
/**
 * Performance evaluation
 */
export interface PerformanceEvaluation {
    evaluationId: string;
    workerId: string;
    workerName: string;
    evaluationPeriod: {
        start: Date;
        end: Date;
    };
    overallRating: PerformanceRating;
    productivityScore: number;
    qualityScore: number;
    attendanceScore: number;
    safetyScore: number;
    metrics: ProductivityMetrics;
    strengths: string[];
    areasForImprovement: string[];
    goals: PerformanceGoal[];
    evaluatedBy: string;
    evaluatedAt: Date;
    comments?: string;
}
/**
 * Workload balance configuration
 */
export interface WorkloadBalanceConfig {
    maxTasksPerWorker: number;
    maxHoursPerShift: number;
    skillMatchRequired: boolean;
    considerCurrentLoad: boolean;
    priorityWeighting: number;
}
/**
 * 1. Creates an engineered labor standard for a warehouse task.
 *
 * @param {Partial<LaborStandard>} standard - Labor standard details
 * @returns {LaborStandard} Created labor standard
 *
 * @example
 * ```typescript
 * const standard = createLaborStandard({
 *   taskCategory: TaskCategory.PICKING,
 *   taskName: 'Single Item Pick',
 *   standardTime: 0.75, // 45 seconds
 *   requiredSkillLevel: SkillLevel.INTERMEDIATE,
 *   efficiencyFactor: 1.0
 * });
 * ```
 */
export declare function createLaborStandard(standard: Partial<LaborStandard>): LaborStandard;
/**
 * 2. Calculates standard time for a task based on quantity and complexity.
 *
 * @param {LaborStandard} standard - Labor standard
 * @param {number} quantity - Number of units to process
 * @param {number} complexityMultiplier - Complexity adjustment (0.5-2.0)
 * @returns {object} Time calculation breakdown
 *
 * @example
 * ```typescript
 * const timeCalc = calculateStandardTime(pickingStandard, 100, 1.2);
 * // Returns: { quantity: 100, standardTime: 75, adjustedTime: 90 }
 * ```
 */
export declare function calculateStandardTime(standard: LaborStandard, quantity: number, complexityMultiplier?: number): {
    quantity: number;
    baseStandardTime: number;
    complexityMultiplier: number;
    efficiencyFactor: number;
    adjustedTime: number;
    estimatedUPH: number;
};
/**
 * 3. Updates an existing labor standard.
 *
 * @param {LaborStandard} standard - Existing standard
 * @param {Partial<LaborStandard>} updates - Updates to apply
 * @returns {LaborStandard} Updated standard
 *
 * @example
 * ```typescript
 * const updated = updateLaborStandard(existingStandard, {
 *   standardTime: 0.6,
 *   efficiencyFactor: 1.1
 * });
 * ```
 */
export declare function updateLaborStandard(standard: LaborStandard, updates: Partial<LaborStandard>): LaborStandard;
/**
 * 4. Validates labor standard requirements and data integrity.
 *
 * @param {LaborStandard} standard - Standard to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateLaborStandard(standard);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateLaborStandard(standard: LaborStandard): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 5. Applies efficiency factor adjustment to labor standard.
 *
 * @param {LaborStandard} standard - Standard to adjust
 * @param {number} newEfficiencyFactor - New efficiency factor (0.5-2.0)
 * @param {string} reason - Reason for adjustment
 * @returns {LaborStandard} Adjusted standard
 *
 * @example
 * ```typescript
 * const adjusted = applyEfficiencyFactor(standard, 1.15, 'New equipment installed');
 * ```
 */
export declare function applyEfficiencyFactor(standard: LaborStandard, newEfficiencyFactor: number, reason: string): LaborStandard;
/**
 * 6. Calculates labor cost for a task based on standard and hourly rate.
 *
 * @param {LaborStandard} standard - Labor standard
 * @param {number} quantity - Number of units
 * @param {number} hourlyRate - Worker hourly rate
 * @returns {object} Cost breakdown
 *
 * @example
 * ```typescript
 * const cost = calculateLaborCost(pickingStandard, 200, 18.50);
 * // Returns labor cost for picking 200 units at $18.50/hour
 * ```
 */
export declare function calculateLaborCost(standard: LaborStandard, quantity: number, hourlyRate: number): {
    quantity: number;
    totalMinutes: number;
    totalHours: number;
    hourlyRate: number;
    totalCost: number;
    costPerUnit: number;
};
/**
 * 7. Compares multiple labor standards for the same task category.
 *
 * @param {LaborStandard[]} standards - Standards to compare
 * @returns {object} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = compareLaborStandards([standard1, standard2, standard3]);
 * ```
 */
export declare function compareLaborStandards(standards: LaborStandard[]): {
    taskCategory: TaskCategory;
    standardCount: number;
    averageStandardTime: number;
    minStandardTime: number;
    maxStandardTime: number;
    averageUPH: number;
    standards: Array<{
        standardId: string;
        taskName: string;
        standardTime: number;
        unitsPerHour: number;
        efficiencyFactor: number;
    }>;
};
/**
 * 8. Exports labor standards to CSV format.
 *
 * @param {LaborStandard[]} standards - Standards to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportLaborStandards(allStandards);
 * fs.writeFileSync('labor-standards.csv', csv);
 * ```
 */
export declare function exportLaborStandards(standards: LaborStandard[]): string;
/**
 * 9. Creates a task assignment for a worker.
 *
 * @param {Partial<TaskAssignment>} assignment - Assignment details
 * @param {LaborStandard} standard - Associated labor standard
 * @returns {TaskAssignment} Created task assignment
 *
 * @example
 * ```typescript
 * const assignment = createTaskAssignment({
 *   taskName: 'Pick Order #12345',
 *   workerId: 'WKR-001',
 *   workerName: 'John Smith',
 *   quantity: 50,
 *   priority: 1
 * }, pickingStandard);
 * ```
 */
export declare function createTaskAssignment(assignment: Partial<TaskAssignment>, standard?: LaborStandard): TaskAssignment;
/**
 * 10. Assigns multiple tasks to workers in bulk.
 *
 * @param {Array<Partial<TaskAssignment>>} assignments - Tasks to assign
 * @param {LaborStandard[]} standards - Available labor standards
 * @returns {TaskAssignment[]} Created assignments
 *
 * @example
 * ```typescript
 * const assignments = assignBulkTasks([
 *   { taskName: 'Pick Order 1', workerId: 'WKR-001', quantity: 30 },
 *   { taskName: 'Pick Order 2', workerId: 'WKR-002', quantity: 45 }
 * ], laborStandards);
 * ```
 */
export declare function assignBulkTasks(assignments: Array<Partial<TaskAssignment>>, standards: LaborStandard[]): TaskAssignment[];
/**
 * 11. Reassigns a task to a different worker.
 *
 * @param {TaskAssignment} assignment - Current assignment
 * @param {string} newWorkerId - New worker ID
 * @param {string} newWorkerName - New worker name
 * @param {string} reason - Reason for reassignment
 * @returns {TaskAssignment} Reassigned task
 *
 * @example
 * ```typescript
 * const reassigned = reassignTask(currentAssignment, 'WKR-005', 'Jane Doe', 'Original worker unavailable');
 * ```
 */
export declare function reassignTask(assignment: TaskAssignment, newWorkerId: string, newWorkerName: string, reason: string): TaskAssignment;
/**
 * 12. Updates task priority.
 *
 * @param {TaskAssignment} assignment - Task assignment
 * @param {number} newPriority - New priority (1-10)
 * @param {string} reason - Reason for priority change
 * @returns {TaskAssignment} Updated assignment
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeTask(assignment, 1, 'Rush order');
 * ```
 */
export declare function prioritizeTask(assignment: TaskAssignment, newPriority: number, reason: string): TaskAssignment;
/**
 * 13. Balances workload across multiple workers.
 *
 * @param {TaskAssignment[]} unassignedTasks - Tasks to assign
 * @param {Array<{workerId: string; workerName: string; currentLoad: number}>} workers - Available workers
 * @param {WorkloadBalanceConfig} config - Balance configuration
 * @returns {TaskAssignment[]} Balanced assignments
 *
 * @example
 * ```typescript
 * const balanced = balanceWorkload(pendingTasks, activeWorkers, {
 *   maxTasksPerWorker: 10,
 *   maxHoursPerShift: 8,
 *   skillMatchRequired: true,
 *   considerCurrentLoad: true,
 *   priorityWeighting: 0.7
 * });
 * ```
 */
export declare function balanceWorkload(unassignedTasks: TaskAssignment[], workers: Array<{
    workerId: string;
    workerName: string;
    currentLoad: number;
    skillLevel?: SkillLevel;
}>, config: WorkloadBalanceConfig): TaskAssignment[];
/**
 * 14. Matches tasks to workers based on skill level.
 *
 * @param {TaskAssignment} task - Task to match
 * @param {LaborStandard} standard - Task standard
 * @param {Array<{workerId: string; workerName: string; skillLevel: SkillLevel}>} workers - Available workers
 * @returns {object} Matching result
 *
 * @example
 * ```typescript
 * const match = matchTaskToSkill(complexTask, expertStandard, availableWorkers);
 * ```
 */
export declare function matchTaskToSkill(task: TaskAssignment, standard: LaborStandard, workers: Array<{
    workerId: string;
    workerName: string;
    skillLevel: SkillLevel;
}>): {
    matched: boolean;
    qualifiedWorkers: Array<{
        workerId: string;
        workerName: string;
        skillLevel: SkillLevel;
    }>;
    bestMatch?: {
        workerId: string;
        workerName: string;
        skillLevel: SkillLevel;
    };
};
/**
 * 15. Schedules task with specific time window.
 *
 * @param {TaskAssignment} assignment - Task assignment
 * @param {Date} startTime - Scheduled start time
 * @param {Date} endTime - Scheduled end time
 * @returns {TaskAssignment} Scheduled assignment
 *
 * @example
 * ```typescript
 * const scheduled = scheduleTask(
 *   assignment,
 *   new Date('2024-01-15T09:00:00'),
 *   new Date('2024-01-15T11:00:00')
 * );
 * ```
 */
export declare function scheduleTask(assignment: TaskAssignment, startTime: Date, endTime: Date): TaskAssignment;
/**
 * 16. Cancels a task assignment.
 *
 * @param {TaskAssignment} assignment - Assignment to cancel
 * @param {string} reason - Cancellation reason
 * @returns {TaskAssignment} Cancelled assignment
 *
 * @example
 * ```typescript
 * const cancelled = cancelTaskAssignment(assignment, 'Order cancelled by customer');
 * ```
 */
export declare function cancelTaskAssignment(assignment: TaskAssignment, reason: string): TaskAssignment;
/**
 * 17. Starts time entry for a worker.
 *
 * @param {string} workerId - Worker ID
 * @param {string} assignmentId - Task assignment ID
 * @param {TaskCategory} taskCategory - Task category
 * @returns {TimeEntry} Started time entry
 *
 * @example
 * ```typescript
 * const timeEntry = startTimeEntry('WKR-001', 'TA-ABC123', TaskCategory.PICKING);
 * ```
 */
export declare function startTimeEntry(workerId: string, assignmentId?: string, taskCategory?: TaskCategory): TimeEntry;
/**
 * 18. Stops time entry and calculates final duration.
 *
 * @param {TimeEntry} entry - Time entry to stop
 * @returns {TimeEntry} Completed time entry
 *
 * @example
 * ```typescript
 * const completed = stopTimeEntry(activeTimeEntry);
 * console.log(`Task took ${completed.actualDuration} minutes`);
 * ```
 */
export declare function stopTimeEntry(entry: TimeEntry): TimeEntry;
/**
 * 19. Pauses time entry (for breaks or interruptions).
 *
 * @param {TimeEntry} entry - Time entry to pause
 * @param {'MEAL' | 'REST' | 'EMERGENCY' | 'UNAUTHORIZED'} breakType - Type of break
 * @returns {TimeEntry} Paused time entry
 *
 * @example
 * ```typescript
 * const paused = pauseTimeEntry(activeTimeEntry, 'MEAL');
 * ```
 */
export declare function pauseTimeEntry(entry: TimeEntry, breakType?: 'MEAL' | 'REST' | 'EMERGENCY' | 'UNAUTHORIZED'): TimeEntry;
/**
 * 20. Resumes paused time entry.
 *
 * @param {TimeEntry} entry - Paused time entry
 * @returns {TimeEntry} Resumed time entry
 *
 * @example
 * ```typescript
 * const resumed = resumeTimeEntry(pausedTimeEntry);
 * ```
 */
export declare function resumeTimeEntry(entry: TimeEntry): TimeEntry;
/**
 * 21. Calculates actual time spent on task (excluding breaks).
 *
 * @param {TimeEntry} entry - Time entry
 * @returns {object} Time calculation
 *
 * @example
 * ```typescript
 * const timeCalc = calculateActualTime(timeEntry);
 * console.log(`Productive time: ${timeCalc.productiveMinutes} minutes`);
 * ```
 */
export declare function calculateActualTime(entry: TimeEntry): {
    totalMinutes: number;
    breakMinutes: number;
    productiveMinutes: number;
    efficiency?: number;
};
/**
 * 22. Calculates break time breakdown.
 *
 * @param {TimeEntry} entry - Time entry
 * @returns {object} Break time analysis
 *
 * @example
 * ```typescript
 * const breakAnalysis = calculateBreakTime(timeEntry);
 * ```
 */
export declare function calculateBreakTime(entry: TimeEntry): {
    totalBreaks: number;
    totalBreakTime: number;
    breaksByType: Record<string, {
        count: number;
        duration: number;
    }>;
    longestBreak: number;
    averageBreakTime: number;
};
/**
 * 23. Validates time entry data.
 *
 * @param {TimeEntry} entry - Time entry to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTimeEntry(timeEntry);
 * if (!validation.valid) {
 *   console.error('Issues:', validation.issues);
 * }
 * ```
 */
export declare function validateTimeEntry(entry: TimeEntry): {
    valid: boolean;
    issues: string[];
};
/**
 * 24. Adjusts time entry with reason.
 *
 * @param {TimeEntry} entry - Time entry to adjust
 * @param {Partial<TimeEntry>} adjustments - Adjustments to apply
 * @param {string} reason - Reason for adjustment
 * @returns {TimeEntry} Adjusted time entry
 *
 * @example
 * ```typescript
 * const adjusted = adjustTimeEntry(timeEntry, {
 *   actualDuration: 45
 * }, 'Corrected for system clock issue');
 * ```
 */
export declare function adjustTimeEntry(entry: TimeEntry, adjustments: Partial<TimeEntry>, reason: string): TimeEntry;
/**
 * 25. Calculates productivity rate for a worker.
 *
 * @param {TaskAssignment[]} assignments - Completed assignments
 * @param {TimeEntry[]} timeEntries - Associated time entries
 * @returns {object} Productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = calculateProductivity(completedTasks, workerTimeEntries);
 * console.log(`Worker productivity: ${productivity.unitsPerHour} UPH`);
 * ```
 */
export declare function calculateProductivity(assignments: TaskAssignment[], timeEntries: TimeEntry[]): {
    totalTasks: number;
    totalUnits: number;
    totalTimeMinutes: number;
    totalTimeHours: number;
    unitsPerHour: number;
    tasksPerHour: number;
    averageTaskTime: number;
};
/**
 * 26. Calculates efficiency percentage (actual vs. standard performance).
 *
 * @param {TaskAssignment} assignment - Task assignment
 * @param {LaborStandard} standard - Labor standard
 * @param {number} actualMinutes - Actual time taken
 * @returns {object} Efficiency calculation
 *
 * @example
 * ```typescript
 * const efficiency = calculateEfficiency(assignment, standard, 42);
 * console.log(`Efficiency: ${efficiency.efficiencyPercent}%`);
 * ```
 */
export declare function calculateEfficiency(assignment: TaskAssignment, standard: LaborStandard, actualMinutes: number): {
    standardMinutes: number;
    actualMinutes: number;
    efficiencyPercent: number;
    variance: number;
    performanceRating: string;
};
/**
 * 27. Calculates labor utilization (productive time vs. available time).
 *
 * @param {number} productiveMinutes - Productive working time
 * @param {number} availableMinutes - Total available time
 * @returns {object} Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = calculateUtilization(420, 480);
 * console.log(`Utilization: ${utilization.utilizationPercent}%`);
 * ```
 */
export declare function calculateUtilization(productiveMinutes: number, availableMinutes: number): {
    productiveMinutes: number;
    availableMinutes: number;
    idleMinutes: number;
    utilizationPercent: number;
    idlePercent: number;
};
/**
 * 28. Calculates units per hour (UPH) metric.
 *
 * @param {number} unitsProcessed - Total units processed
 * @param {number} hoursWorked - Total hours worked
 * @returns {object} UPH metrics
 *
 * @example
 * ```typescript
 * const uph = calculateUnitsPerHour(500, 8);
 * console.log(`UPH: ${uph.unitsPerHour}`);
 * ```
 */
export declare function calculateUnitsPerHour(unitsProcessed: number, hoursWorked: number): {
    unitsProcessed: number;
    hoursWorked: number;
    unitsPerHour: number;
    minutesPerUnit: number;
};
/**
 * 29. Calculates idle time and reasons.
 *
 * @param {WorkerShift} shift - Worker shift data
 * @returns {object} Idle time analysis
 *
 * @example
 * ```typescript
 * const idleAnalysis = calculateIdleTime(workerShift);
 * ```
 */
export declare function calculateIdleTime(shift: WorkerShift): {
    totalShiftMinutes: number;
    productiveMinutes: number;
    breakMinutes: number;
    idleMinutes: number;
    idlePercent: number;
    unaccountedMinutes: number;
};
/**
 * 30. Generates comprehensive productivity report.
 *
 * @param {string} workerId - Worker ID
 * @param {string} workerName - Worker name
 * @param {TaskAssignment[]} assignments - Task assignments
 * @param {TimeEntry[]} timeEntries - Time entries
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @returns {ProductivityMetrics} Productivity report
 *
 * @example
 * ```typescript
 * const report = generateProductivityReport(
 *   'WKR-001',
 *   'John Smith',
 *   assignments,
 *   timeEntries,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function generateProductivityReport(workerId: string, workerName: string, assignments: TaskAssignment[], timeEntries: TimeEntry[], periodStart: Date, periodEnd: Date): ProductivityMetrics;
/**
 * 31. Compares performance between workers.
 *
 * @param {ProductivityMetrics[]} metrics - Worker productivity metrics
 * @returns {object} Performance comparison
 *
 * @example
 * ```typescript
 * const comparison = compareWorkerPerformance([worker1Metrics, worker2Metrics, worker3Metrics]);
 * ```
 */
export declare function compareWorkerPerformance(metrics: ProductivityMetrics[]): {
    workerCount: number;
    averageUPH: number;
    topPerformer: ProductivityMetrics;
    lowestPerformer: ProductivityMetrics;
    rankings: Array<{
        workerId: string;
        workerName: string;
        unitsPerHour: number;
        efficiency: number;
        rank: number;
    }>;
};
/**
 * 32. Calculates team productivity metrics.
 *
 * @param {ProductivityMetrics[]} workerMetrics - Individual worker metrics
 * @returns {object} Team metrics
 *
 * @example
 * ```typescript
 * const teamMetrics = calculateTeamProductivity(allWorkerMetrics);
 * ```
 */
export declare function calculateTeamProductivity(workerMetrics: ProductivityMetrics[]): {
    teamSize: number;
    totalHours: number;
    totalUnitsProcessed: number;
    totalTasksCompleted: number;
    averageUPH: number;
    averageEfficiency: number;
    averageUtilization: number;
    totalProductiveCost?: number;
};
/**
 * 33. Creates an incentive plan for workers.
 *
 * @param {Partial<IncentivePlan>} plan - Incentive plan details
 * @returns {IncentivePlan} Created incentive plan
 *
 * @example
 * ```typescript
 * const plan = createIncentivePlan({
 *   name: 'Q1 Productivity Bonus',
 *   type: IncentiveType.PRODUCTIVITY,
 *   tiers: [
 *     { threshold: 100, reward: 50, rewardType: 'FIXED', description: '100+ UPH' },
 *     { threshold: 120, reward: 100, rewardType: 'FIXED', description: '120+ UPH' },
 *     { threshold: 150, reward: 200, rewardType: 'FIXED', description: '150+ UPH' }
 *   ]
 * });
 * ```
 */
export declare function createIncentivePlan(plan: Partial<IncentivePlan>): IncentivePlan;
/**
 * 34. Calculates incentive pay for a worker based on performance.
 *
 * @param {string} workerId - Worker ID
 * @param {string} workerName - Worker name
 * @param {IncentivePlan} plan - Incentive plan
 * @param {ProductivityMetrics} metrics - Worker performance metrics
 * @param {number} baseHourlyRate - Base hourly rate
 * @returns {IncentiveEarnings} Calculated incentive earnings
 *
 * @example
 * ```typescript
 * const earnings = calculateIncentivePay(
 *   'WKR-001',
 *   'John Smith',
 *   productivityPlan,
 *   workerMetrics,
 *   18.50
 * );
 * console.log(`Incentive: $${earnings.incentiveAmount}`);
 * ```
 */
export declare function calculateIncentivePay(workerId: string, workerName: string, plan: IncentivePlan, metrics: ProductivityMetrics, baseHourlyRate: number): IncentiveEarnings;
/**
 * 35. Evaluates worker performance and generates performance review.
 *
 * @param {string} workerId - Worker ID
 * @param {string} workerName - Worker name
 * @param {ProductivityMetrics} metrics - Performance metrics
 * @param {string} evaluatedBy - Evaluator ID
 * @returns {PerformanceEvaluation} Performance evaluation
 *
 * @example
 * ```typescript
 * const evaluation = evaluatePerformance(
 *   'WKR-001',
 *   'John Smith',
 *   monthlyMetrics,
 *   'MGR-005'
 * );
 * ```
 */
export declare function evaluatePerformance(workerId: string, workerName: string, metrics: ProductivityMetrics, evaluatedBy: string): PerformanceEvaluation;
/**
 * 36. Tracks performance trend over time.
 *
 * @param {ProductivityMetrics[]} historicalMetrics - Historical performance data
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = trackPerformanceTrend(last12MonthsMetrics);
 * console.log(`Trend: ${trend.trendDirection}`);
 * ```
 */
export declare function trackPerformanceTrend(historicalMetrics: ProductivityMetrics[]): {
    periods: number;
    startingUPH: number;
    endingUPH: number;
    changePercent: number;
    trendDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
    averageUPH: number;
    peakUPH: number;
    lowestUPH: number;
    consistency: number;
};
/**
 * 37. Identifies top performers based on metrics.
 *
 * @param {ProductivityMetrics[]} allMetrics - All worker metrics
 * @param {number} topN - Number of top performers to identify
 * @returns {object} Top performers
 *
 * @example
 * ```typescript
 * const topPerformers = identifyTopPerformers(teamMetrics, 5);
 * ```
 */
export declare function identifyTopPerformers(allMetrics: ProductivityMetrics[], topN?: number): {
    topPerformers: Array<{
        workerId: string;
        workerName: string;
        unitsPerHour: number;
        efficiency: number;
        utilization: number;
        compositeScore: number;
        rank: number;
    }>;
    averageCompositeScore: number;
    performanceThreshold: number;
};
/**
 * 38. Identifies underperformers who need coaching.
 *
 * @param {ProductivityMetrics[]} allMetrics - All worker metrics
 * @param {number} thresholdPercent - Performance threshold (e.g., bottom 10%)
 * @returns {object} Underperformers analysis
 *
 * @example
 * ```typescript
 * const underperformers = identifyUnderperformers(teamMetrics, 10);
 * ```
 */
export declare function identifyUnderperformers(allMetrics: ProductivityMetrics[], thresholdPercent?: number): {
    underperformers: Array<{
        workerId: string;
        workerName: string;
        unitsPerHour: number;
        efficiency: number;
        utilization: number;
        compositeScore: number;
        gapFromAverage: number;
        improvementAreas: string[];
    }>;
    teamAverage: number;
    improvementOpportunity: number;
};
/**
 * 39. Generates comprehensive performance review document.
 *
 * @param {PerformanceEvaluation} evaluation - Performance evaluation
 * @returns {string} Formatted review document
 *
 * @example
 * ```typescript
 * const review = generatePerformanceReview(workerEvaluation);
 * console.log(review);
 * ```
 */
export declare function generatePerformanceReview(evaluation: PerformanceEvaluation): string;
/**
 * 40. Calculates team-based incentives for group performance.
 *
 * @param {ProductivityMetrics[]} teamMetrics - All team member metrics
 * @param {IncentivePlan} plan - Team incentive plan
 * @param {number} totalIncentivePool - Total incentive amount to distribute
 * @returns {object} Team incentive distribution
 *
 * @example
 * ```typescript
 * const teamIncentives = calculateTeamIncentives(
 *   allTeamMetrics,
 *   teamIncentivePlan,
 *   5000
 * );
 * ```
 */
export declare function calculateTeamIncentives(teamMetrics: ProductivityMetrics[], plan: IncentivePlan, totalIncentivePool: number): {
    teamPerformance: number;
    tierAchieved?: IncentiveTier;
    qualifies: boolean;
    totalIncentive: number;
    distribution: Array<{
        workerId: string;
        workerName: string;
        contributionPercent: number;
        incentiveAmount: number;
    }>;
};
declare const _default: {
    createLaborStandard: typeof createLaborStandard;
    calculateStandardTime: typeof calculateStandardTime;
    updateLaborStandard: typeof updateLaborStandard;
    validateLaborStandard: typeof validateLaborStandard;
    applyEfficiencyFactor: typeof applyEfficiencyFactor;
    calculateLaborCost: typeof calculateLaborCost;
    compareLaborStandards: typeof compareLaborStandards;
    exportLaborStandards: typeof exportLaborStandards;
    createTaskAssignment: typeof createTaskAssignment;
    assignBulkTasks: typeof assignBulkTasks;
    reassignTask: typeof reassignTask;
    prioritizeTask: typeof prioritizeTask;
    balanceWorkload: typeof balanceWorkload;
    matchTaskToSkill: typeof matchTaskToSkill;
    scheduleTask: typeof scheduleTask;
    cancelTaskAssignment: typeof cancelTaskAssignment;
    startTimeEntry: typeof startTimeEntry;
    stopTimeEntry: typeof stopTimeEntry;
    pauseTimeEntry: typeof pauseTimeEntry;
    resumeTimeEntry: typeof resumeTimeEntry;
    calculateActualTime: typeof calculateActualTime;
    calculateBreakTime: typeof calculateBreakTime;
    validateTimeEntry: typeof validateTimeEntry;
    adjustTimeEntry: typeof adjustTimeEntry;
    calculateProductivity: typeof calculateProductivity;
    calculateEfficiency: typeof calculateEfficiency;
    calculateUtilization: typeof calculateUtilization;
    calculateUnitsPerHour: typeof calculateUnitsPerHour;
    calculateIdleTime: typeof calculateIdleTime;
    generateProductivityReport: typeof generateProductivityReport;
    compareWorkerPerformance: typeof compareWorkerPerformance;
    calculateTeamProductivity: typeof calculateTeamProductivity;
    createIncentivePlan: typeof createIncentivePlan;
    calculateIncentivePay: typeof calculateIncentivePay;
    evaluatePerformance: typeof evaluatePerformance;
    trackPerformanceTrend: typeof trackPerformanceTrend;
    identifyTopPerformers: typeof identifyTopPerformers;
    identifyUnderperformers: typeof identifyUnderperformers;
    generatePerformanceReview: typeof generatePerformanceReview;
    calculateTeamIncentives: typeof calculateTeamIncentives;
};
export default _default;
//# sourceMappingURL=warehouse-labor-management-kit.d.ts.map
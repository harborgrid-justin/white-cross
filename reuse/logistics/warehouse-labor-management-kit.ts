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
 * File: /reuse/logistics/warehouse-labor-management-kit.ts
 * Locator: WC-LOGISTICS-LABOR-001
 * Purpose: Comprehensive Warehouse Labor Management - Labor standards, task assignment, time tracking, and productivity
 *
 * Upstream: Independent utility module for warehouse labor operations
 * Downstream: ../backend/logistics/*, WMS modules, Labor tracking, Payroll systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for labor standards, task assignment, time tracking, productivity metrics, incentives
 *
 * LLM Context: Enterprise-grade warehouse labor management utilities to compete with Oracle JDE.
 * Provides comprehensive labor standards (engineered standards), task assignment and balancing,
 * real-time time tracking with pause/resume, productivity metrics (UPH, efficiency, utilization),
 * performance evaluation, incentive calculations, and team-based performance management.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Task category enumeration
 */
export enum TaskCategory {
  RECEIVING = 'RECEIVING',
  PUTAWAY = 'PUTAWAY',
  PICKING = 'PICKING',
  PACKING = 'PACKING',
  LOADING = 'LOADING',
  REPLENISHMENT = 'REPLENISHMENT',
  CYCLE_COUNT = 'CYCLE_COUNT',
  QUALITY_CHECK = 'QUALITY_CHECK',
  RETURNS_PROCESSING = 'RETURNS_PROCESSING',
  MAINTENANCE = 'MAINTENANCE',
}

/**
 * Task status enumeration
 */
export enum TaskStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

/**
 * Skill level enumeration
 */
export enum SkillLevel {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  TRAINER = 'TRAINER',
}

/**
 * Performance rating enumeration
 */
export enum PerformanceRating {
  EXCELLENT = 'EXCELLENT',
  ABOVE_AVERAGE = 'ABOVE_AVERAGE',
  MEETS_EXPECTATIONS = 'MEETS_EXPECTATIONS',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  UNSATISFACTORY = 'UNSATISFACTORY',
}

/**
 * Incentive type enumeration
 */
export enum IncentiveType {
  PRODUCTIVITY = 'PRODUCTIVITY',
  QUALITY = 'QUALITY',
  ATTENDANCE = 'ATTENDANCE',
  SAFETY = 'SAFETY',
  TEAM_PERFORMANCE = 'TEAM_PERFORMANCE',
}

/**
 * Labor standard - Engineered time standard for warehouse tasks
 */
export interface LaborStandard {
  standardId: string;
  taskCategory: TaskCategory;
  taskName: string;
  description: string;
  standardTime: number; // in minutes
  unitsPerHour: number; // target UPH
  difficultyLevel: number; // 1-10
  requiredSkillLevel: SkillLevel;
  equipmentRequired?: string[];
  efficiencyFactor: number; // adjustment factor (0.8-1.2)
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
  priority: number; // 1 (highest) - 10 (lowest)
  assignedAt: Date;
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  quantity: number; // units to process
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
  pauseDuration: number; // total pause time in minutes
  actualDuration: number; // working time excluding pauses
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
  duration: number; // in minutes
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
  period: { start: Date; end: Date };
  totalHours: number;
  productiveHours: number;
  idleHours: number;
  tasksCompleted: number;
  unitsProcessed: number;
  unitsPerHour: number;
  efficiency: number; // percentage (actual vs. standard)
  utilization: number; // percentage (productive vs. total)
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
  progress: number; // percentage
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
  threshold: number; // minimum performance level
  reward: number; // dollar amount or percentage
  rewardType: 'FIXED' | 'PERCENTAGE';
  description: string;
}

/**
 * Incentive earnings calculation
 */
export interface IncentiveEarnings {
  workerId: string;
  workerName: string;
  period: { start: Date; end: Date };
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
  evaluationPeriod: { start: Date; end: Date };
  overallRating: PerformanceRating;
  productivityScore: number; // 0-100
  qualityScore: number; // 0-100
  attendanceScore: number; // 0-100
  safetyScore: number; // 0-100
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
  priorityWeighting: number; // 0-1
}

// ============================================================================
// SECTION 1: LABOR STANDARDS (Functions 1-8)
// ============================================================================

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
export function createLaborStandard(standard: Partial<LaborStandard>): LaborStandard {
  const standardId = `LS-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const standardTime = standard.standardTime || 1;
  const unitsPerHour = 60 / standardTime;

  return {
    standardId,
    taskCategory: standard.taskCategory || TaskCategory.PICKING,
    taskName: standard.taskName || '',
    description: standard.description || '',
    standardTime,
    unitsPerHour,
    difficultyLevel: standard.difficultyLevel || 5,
    requiredSkillLevel: standard.requiredSkillLevel || SkillLevel.INTERMEDIATE,
    equipmentRequired: standard.equipmentRequired,
    efficiencyFactor: standard.efficiencyFactor || 1.0,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: standard.metadata,
  };
}

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
export function calculateStandardTime(
  standard: LaborStandard,
  quantity: number,
  complexityMultiplier: number = 1.0
): {
  quantity: number;
  baseStandardTime: number;
  complexityMultiplier: number;
  efficiencyFactor: number;
  adjustedTime: number;
  estimatedUPH: number;
} {
  const baseStandardTime = standard.standardTime * quantity;
  const adjustedTime = baseStandardTime * complexityMultiplier * standard.efficiencyFactor;
  const estimatedUPH = (quantity / adjustedTime) * 60;

  return {
    quantity,
    baseStandardTime: Number(baseStandardTime.toFixed(2)),
    complexityMultiplier,
    efficiencyFactor: standard.efficiencyFactor,
    adjustedTime: Number(adjustedTime.toFixed(2)),
    estimatedUPH: Number(estimatedUPH.toFixed(2)),
  };
}

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
export function updateLaborStandard(
  standard: LaborStandard,
  updates: Partial<LaborStandard>
): LaborStandard {
  const updated = {
    ...standard,
    ...updates,
    updatedAt: new Date(),
  };

  // Recalculate UPH if standard time changed
  if (updates.standardTime) {
    updated.unitsPerHour = 60 / updates.standardTime;
  }

  return updated;
}

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
export function validateLaborStandard(standard: LaborStandard): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!standard.taskName || standard.taskName.trim() === '') {
    errors.push('Task name is required');
  }

  if (standard.standardTime <= 0) {
    errors.push('Standard time must be greater than 0');
  }

  if (standard.standardTime > 60) {
    warnings.push('Standard time exceeds 60 minutes per unit');
  }

  if (standard.efficiencyFactor < 0.5 || standard.efficiencyFactor > 2.0) {
    errors.push('Efficiency factor must be between 0.5 and 2.0');
  }

  if (standard.difficultyLevel < 1 || standard.difficultyLevel > 10) {
    errors.push('Difficulty level must be between 1 and 10');
  }

  if (standard.unitsPerHour !== 60 / standard.standardTime) {
    warnings.push('Units per hour calculation may be incorrect');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function applyEfficiencyFactor(
  standard: LaborStandard,
  newEfficiencyFactor: number,
  reason: string
): LaborStandard {
  if (newEfficiencyFactor < 0.5 || newEfficiencyFactor > 2.0) {
    throw new Error('Efficiency factor must be between 0.5 and 2.0');
  }

  return {
    ...standard,
    efficiencyFactor: newEfficiencyFactor,
    updatedAt: new Date(),
    metadata: {
      ...standard.metadata,
      efficiencyAdjustments: [
        ...(standard.metadata?.efficiencyAdjustments || []),
        {
          previousFactor: standard.efficiencyFactor,
          newFactor: newEfficiencyFactor,
          reason,
          adjustedAt: new Date(),
        },
      ],
    },
  };
}

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
export function calculateLaborCost(
  standard: LaborStandard,
  quantity: number,
  hourlyRate: number
): {
  quantity: number;
  totalMinutes: number;
  totalHours: number;
  hourlyRate: number;
  totalCost: number;
  costPerUnit: number;
} {
  const timeCalc = calculateStandardTime(standard, quantity);
  const totalMinutes = timeCalc.adjustedTime;
  const totalHours = totalMinutes / 60;
  const totalCost = totalHours * hourlyRate;
  const costPerUnit = totalCost / quantity;

  return {
    quantity,
    totalMinutes: Number(totalMinutes.toFixed(2)),
    totalHours: Number(totalHours.toFixed(2)),
    hourlyRate,
    totalCost: Number(totalCost.toFixed(2)),
    costPerUnit: Number(costPerUnit.toFixed(4)),
  };
}

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
export function compareLaborStandards(standards: LaborStandard[]): {
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
} {
  if (standards.length === 0) {
    throw new Error('At least one standard is required for comparison');
  }

  const taskCategory = standards[0].taskCategory;
  const standardTimes = standards.map(s => s.standardTime);
  const uphs = standards.map(s => s.unitsPerHour);

  return {
    taskCategory,
    standardCount: standards.length,
    averageStandardTime: Number(
      (standardTimes.reduce((sum, t) => sum + t, 0) / standards.length).toFixed(2)
    ),
    minStandardTime: Math.min(...standardTimes),
    maxStandardTime: Math.max(...standardTimes),
    averageUPH: Number((uphs.reduce((sum, u) => sum + u, 0) / standards.length).toFixed(2)),
    standards: standards.map(s => ({
      standardId: s.standardId,
      taskName: s.taskName,
      standardTime: s.standardTime,
      unitsPerHour: s.unitsPerHour,
      efficiencyFactor: s.efficiencyFactor,
    })),
  };
}

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
export function exportLaborStandards(standards: LaborStandard[]): string {
  const headers = [
    'Standard ID',
    'Task Category',
    'Task Name',
    'Standard Time (min)',
    'Units Per Hour',
    'Difficulty Level',
    'Required Skill Level',
    'Efficiency Factor',
    'Created At',
  ];

  let csv = headers.join(',') + '\n';

  for (const standard of standards) {
    const row = [
      standard.standardId,
      standard.taskCategory,
      `"${standard.taskName}"`,
      standard.standardTime.toFixed(2),
      standard.unitsPerHour.toFixed(2),
      standard.difficultyLevel,
      standard.requiredSkillLevel,
      standard.efficiencyFactor.toFixed(2),
      standard.createdAt.toISOString(),
    ];
    csv += row.join(',') + '\n';
  }

  return csv;
}

// ============================================================================
// SECTION 2: TASK ASSIGNMENT (Functions 9-16)
// ============================================================================

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
export function createTaskAssignment(
  assignment: Partial<TaskAssignment>,
  standard?: LaborStandard
): TaskAssignment {
  const assignmentId = `TA-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const quantity = assignment.quantity || 1;

  let estimatedDuration = assignment.estimatedDuration || 60;
  if (standard) {
    const timeCalc = calculateStandardTime(standard, quantity);
    estimatedDuration = timeCalc.adjustedTime;
  }

  return {
    assignmentId,
    taskId: assignment.taskId || `TASK-${Date.now()}`,
    taskCategory: assignment.taskCategory || TaskCategory.PICKING,
    taskName: assignment.taskName || '',
    workerId: assignment.workerId || '',
    workerName: assignment.workerName || '',
    standardId: standard?.standardId,
    status: TaskStatus.ASSIGNED,
    priority: assignment.priority || 5,
    assignedAt: new Date(),
    scheduledStartTime: assignment.scheduledStartTime,
    scheduledEndTime: assignment.scheduledEndTime,
    estimatedDuration,
    quantity,
    completedQuantity: 0,
    location: assignment.location,
    notes: assignment.notes,
    metadata: assignment.metadata,
  };
}

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
export function assignBulkTasks(
  assignments: Array<Partial<TaskAssignment>>,
  standards: LaborStandard[]
): TaskAssignment[] {
  return assignments.map(assignment => {
    const standard = standards.find(
      s => s.taskCategory === assignment.taskCategory && s.standardId === assignment.standardId
    );
    return createTaskAssignment(assignment, standard);
  });
}

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
export function reassignTask(
  assignment: TaskAssignment,
  newWorkerId: string,
  newWorkerName: string,
  reason: string
): TaskAssignment {
  if (assignment.status === TaskStatus.COMPLETED) {
    throw new Error('Cannot reassign completed task');
  }

  return {
    ...assignment,
    workerId: newWorkerId,
    workerName: newWorkerName,
    status: TaskStatus.ASSIGNED,
    actualStartTime: undefined,
    actualEndTime: undefined,
    metadata: {
      ...assignment.metadata,
      reassignments: [
        ...(assignment.metadata?.reassignments || []),
        {
          previousWorkerId: assignment.workerId,
          previousWorkerName: assignment.workerName,
          newWorkerId,
          newWorkerName,
          reason,
          reassignedAt: new Date(),
        },
      ],
    },
  };
}

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
export function prioritizeTask(
  assignment: TaskAssignment,
  newPriority: number,
  reason: string
): TaskAssignment {
  if (newPriority < 1 || newPriority > 10) {
    throw new Error('Priority must be between 1 (highest) and 10 (lowest)');
  }

  return {
    ...assignment,
    priority: newPriority,
    metadata: {
      ...assignment.metadata,
      priorityChanges: [
        ...(assignment.metadata?.priorityChanges || []),
        {
          previousPriority: assignment.priority,
          newPriority,
          reason,
          changedAt: new Date(),
        },
      ],
    },
  };
}

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
export function balanceWorkload(
  unassignedTasks: TaskAssignment[],
  workers: Array<{ workerId: string; workerName: string; currentLoad: number; skillLevel?: SkillLevel }>,
  config: WorkloadBalanceConfig
): TaskAssignment[] {
  // Sort tasks by priority (highest first)
  const sortedTasks = [...unassignedTasks].sort((a, b) => a.priority - b.priority);

  // Sort workers by current load (lowest first)
  const sortedWorkers = [...workers].sort((a, b) => a.currentLoad - b.currentLoad);

  const assignments: TaskAssignment[] = [];
  let workerIndex = 0;

  for (const task of sortedTasks) {
    // Find next available worker
    const worker = sortedWorkers[workerIndex % sortedWorkers.length];

    const assignment = {
      ...task,
      workerId: worker.workerId,
      workerName: worker.workerName,
      status: TaskStatus.ASSIGNED,
    };

    assignments.push(assignment);

    // Update worker load
    worker.currentLoad += task.estimatedDuration;

    // Move to next worker for round-robin distribution
    workerIndex++;
  }

  return assignments;
}

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
export function matchTaskToSkill(
  task: TaskAssignment,
  standard: LaborStandard,
  workers: Array<{ workerId: string; workerName: string; skillLevel: SkillLevel }>
): {
  matched: boolean;
  qualifiedWorkers: Array<{ workerId: string; workerName: string; skillLevel: SkillLevel }>;
  bestMatch?: { workerId: string; workerName: string; skillLevel: SkillLevel };
} {
  const skillLevelOrder = [
    SkillLevel.NOVICE,
    SkillLevel.INTERMEDIATE,
    SkillLevel.ADVANCED,
    SkillLevel.EXPERT,
    SkillLevel.TRAINER,
  ];

  const requiredLevel = standard.requiredSkillLevel;
  const requiredIndex = skillLevelOrder.indexOf(requiredLevel);

  // Find workers with equal or higher skill level
  const qualifiedWorkers = workers.filter(worker => {
    const workerIndex = skillLevelOrder.indexOf(worker.skillLevel);
    return workerIndex >= requiredIndex;
  });

  // Best match is the worker with skill level closest to required
  const bestMatch = qualifiedWorkers.reduce((best, worker) => {
    if (!best) return worker;
    const bestIndex = skillLevelOrder.indexOf(best.skillLevel);
    const workerIndex = skillLevelOrder.indexOf(worker.skillLevel);
    return Math.abs(workerIndex - requiredIndex) < Math.abs(bestIndex - requiredIndex)
      ? worker
      : best;
  }, qualifiedWorkers[0]);

  return {
    matched: qualifiedWorkers.length > 0,
    qualifiedWorkers,
    bestMatch,
  };
}

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
export function scheduleTask(
  assignment: TaskAssignment,
  startTime: Date,
  endTime: Date
): TaskAssignment {
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  if (durationMinutes < assignment.estimatedDuration) {
    throw new Error(
      `Scheduled time window (${durationMinutes} min) is less than estimated duration (${assignment.estimatedDuration} min)`
    );
  }

  return {
    ...assignment,
    scheduledStartTime: startTime,
    scheduledEndTime: endTime,
  };
}

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
export function cancelTaskAssignment(assignment: TaskAssignment, reason: string): TaskAssignment {
  if (assignment.status === TaskStatus.COMPLETED) {
    throw new Error('Cannot cancel completed task');
  }

  return {
    ...assignment,
    status: TaskStatus.CANCELLED,
    metadata: {
      ...assignment.metadata,
      cancellationReason: reason,
      cancelledAt: new Date(),
    },
  };
}

// ============================================================================
// SECTION 3: TIME TRACKING (Functions 17-24)
// ============================================================================

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
export function startTimeEntry(
  workerId: string,
  assignmentId?: string,
  taskCategory?: TaskCategory
): TimeEntry {
  const entryId = `TE-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

  return {
    entryId,
    workerId,
    assignmentId,
    taskCategory,
    startTime: new Date(),
    pauseDuration: 0,
    actualDuration: 0,
    status: 'ACTIVE',
    breaks: [],
  };
}

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
export function stopTimeEntry(entry: TimeEntry): TimeEntry {
  if (entry.status === 'COMPLETED') {
    throw new Error('Time entry is already completed');
  }

  const endTime = new Date();
  const totalMinutes = (endTime.getTime() - entry.startTime.getTime()) / (1000 * 60);
  const actualDuration = totalMinutes - entry.pauseDuration;

  return {
    ...entry,
    endTime,
    actualDuration: Number(actualDuration.toFixed(2)),
    status: 'COMPLETED',
  };
}

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
export function pauseTimeEntry(
  entry: TimeEntry,
  breakType: 'MEAL' | 'REST' | 'EMERGENCY' | 'UNAUTHORIZED' = 'REST'
): TimeEntry {
  if (entry.status === 'PAUSED') {
    throw new Error('Time entry is already paused');
  }

  if (entry.status === 'COMPLETED') {
    throw new Error('Cannot pause completed time entry');
  }

  const breakId = `BRK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const pausedAt = new Date();

  const newBreak: TimeBreak = {
    breakId,
    startTime: pausedAt,
    duration: 0,
    breakType,
  };

  return {
    ...entry,
    pausedAt,
    status: 'PAUSED',
    breaks: [...entry.breaks, newBreak],
  };
}

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
export function resumeTimeEntry(entry: TimeEntry): TimeEntry {
  if (entry.status !== 'PAUSED') {
    throw new Error('Time entry is not paused');
  }

  const resumedAt = new Date();

  // Update the last break with end time and duration
  const breaks = [...entry.breaks];
  const lastBreak = breaks[breaks.length - 1];

  if (lastBreak && !lastBreak.endTime) {
    const breakDuration = (resumedAt.getTime() - lastBreak.startTime.getTime()) / (1000 * 60);
    lastBreak.endTime = resumedAt;
    lastBreak.duration = Number(breakDuration.toFixed(2));
  }

  const totalPauseDuration = breaks.reduce((sum, b) => sum + b.duration, 0);

  return {
    ...entry,
    resumedAt,
    pauseDuration: Number(totalPauseDuration.toFixed(2)),
    status: 'ACTIVE',
    breaks,
  };
}

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
export function calculateActualTime(entry: TimeEntry): {
  totalMinutes: number;
  breakMinutes: number;
  productiveMinutes: number;
  efficiency?: number;
} {
  const endTime = entry.endTime || new Date();
  const totalMinutes = (endTime.getTime() - entry.startTime.getTime()) / (1000 * 60);
  const breakMinutes = entry.pauseDuration;
  const productiveMinutes = totalMinutes - breakMinutes;

  return {
    totalMinutes: Number(totalMinutes.toFixed(2)),
    breakMinutes: Number(breakMinutes.toFixed(2)),
    productiveMinutes: Number(productiveMinutes.toFixed(2)),
  };
}

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
export function calculateBreakTime(entry: TimeEntry): {
  totalBreaks: number;
  totalBreakTime: number;
  breaksByType: Record<string, { count: number; duration: number }>;
  longestBreak: number;
  averageBreakTime: number;
} {
  const breaksByType: Record<string, { count: number; duration: number }> = {};

  for (const brk of entry.breaks) {
    if (!breaksByType[brk.breakType]) {
      breaksByType[brk.breakType] = { count: 0, duration: 0 };
    }
    breaksByType[brk.breakType].count++;
    breaksByType[brk.breakType].duration += brk.duration;
  }

  const durations = entry.breaks.map(b => b.duration);
  const longestBreak = durations.length > 0 ? Math.max(...durations) : 0;
  const averageBreakTime = durations.length > 0
    ? durations.reduce((sum, d) => sum + d, 0) / durations.length
    : 0;

  return {
    totalBreaks: entry.breaks.length,
    totalBreakTime: entry.pauseDuration,
    breaksByType,
    longestBreak,
    averageBreakTime: Number(averageBreakTime.toFixed(2)),
  };
}

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
export function validateTimeEntry(entry: TimeEntry): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!entry.workerId) {
    issues.push('Worker ID is required');
  }

  if (!entry.startTime) {
    issues.push('Start time is required');
  }

  if (entry.status === 'COMPLETED' && !entry.endTime) {
    issues.push('End time is required for completed entry');
  }

  if (entry.endTime && entry.endTime < entry.startTime) {
    issues.push('End time cannot be before start time');
  }

  if (entry.pauseDuration < 0) {
    issues.push('Pause duration cannot be negative');
  }

  // Validate breaks
  for (const brk of entry.breaks) {
    if (brk.endTime && brk.endTime < brk.startTime) {
      issues.push(`Break ${brk.breakId} has invalid time range`);
    }
  }

  // Check if there's an unclosed break
  const hasOpenBreak = entry.breaks.some(b => !b.endTime);
  if (hasOpenBreak && entry.status !== 'PAUSED') {
    issues.push('Unclosed break found in non-paused entry');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

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
export function adjustTimeEntry(
  entry: TimeEntry,
  adjustments: Partial<TimeEntry>,
  reason: string
): TimeEntry {
  return {
    ...entry,
    ...adjustments,
    metadata: {
      ...entry.metadata,
      adjustments: [
        ...(entry.metadata?.adjustments || []),
        {
          previousValues: {
            actualDuration: entry.actualDuration,
            pauseDuration: entry.pauseDuration,
          },
          newValues: adjustments,
          reason,
          adjustedAt: new Date(),
        },
      ],
    },
  };
}

// ============================================================================
// SECTION 4: PRODUCTIVITY METRICS (Functions 25-32)
// ============================================================================

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
export function calculateProductivity(
  assignments: TaskAssignment[],
  timeEntries: TimeEntry[]
): {
  totalTasks: number;
  totalUnits: number;
  totalTimeMinutes: number;
  totalTimeHours: number;
  unitsPerHour: number;
  tasksPerHour: number;
  averageTaskTime: number;
} {
  const completedTasks = assignments.filter(a => a.status === TaskStatus.COMPLETED);
  const totalUnits = completedTasks.reduce((sum, a) => sum + a.completedQuantity, 0);
  const totalTimeMinutes = timeEntries.reduce((sum, e) => sum + e.actualDuration, 0);
  const totalTimeHours = totalTimeMinutes / 60;

  const unitsPerHour = totalTimeHours > 0 ? totalUnits / totalTimeHours : 0;
  const tasksPerHour = totalTimeHours > 0 ? completedTasks.length / totalTimeHours : 0;
  const averageTaskTime = completedTasks.length > 0 ? totalTimeMinutes / completedTasks.length : 0;

  return {
    totalTasks: completedTasks.length,
    totalUnits,
    totalTimeMinutes: Number(totalTimeMinutes.toFixed(2)),
    totalTimeHours: Number(totalTimeHours.toFixed(2)),
    unitsPerHour: Number(unitsPerHour.toFixed(2)),
    tasksPerHour: Number(tasksPerHour.toFixed(2)),
    averageTaskTime: Number(averageTaskTime.toFixed(2)),
  };
}

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
export function calculateEfficiency(
  assignment: TaskAssignment,
  standard: LaborStandard,
  actualMinutes: number
): {
  standardMinutes: number;
  actualMinutes: number;
  efficiencyPercent: number;
  variance: number;
  performanceRating: string;
} {
  const timeCalc = calculateStandardTime(standard, assignment.completedQuantity);
  const standardMinutes = timeCalc.adjustedTime;
  const efficiencyPercent = (standardMinutes / actualMinutes) * 100;
  const variance = actualMinutes - standardMinutes;

  let performanceRating = 'Meets Expectations';
  if (efficiencyPercent >= 120) performanceRating = 'Excellent';
  else if (efficiencyPercent >= 100) performanceRating = 'Above Average';
  else if (efficiencyPercent >= 80) performanceRating = 'Meets Expectations';
  else if (efficiencyPercent >= 60) performanceRating = 'Needs Improvement';
  else performanceRating = 'Unsatisfactory';

  return {
    standardMinutes: Number(standardMinutes.toFixed(2)),
    actualMinutes: Number(actualMinutes.toFixed(2)),
    efficiencyPercent: Number(efficiencyPercent.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    performanceRating,
  };
}

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
export function calculateUtilization(
  productiveMinutes: number,
  availableMinutes: number
): {
  productiveMinutes: number;
  availableMinutes: number;
  idleMinutes: number;
  utilizationPercent: number;
  idlePercent: number;
} {
  const idleMinutes = availableMinutes - productiveMinutes;
  const utilizationPercent = (productiveMinutes / availableMinutes) * 100;
  const idlePercent = (idleMinutes / availableMinutes) * 100;

  return {
    productiveMinutes,
    availableMinutes,
    idleMinutes: Number(idleMinutes.toFixed(2)),
    utilizationPercent: Number(utilizationPercent.toFixed(2)),
    idlePercent: Number(idlePercent.toFixed(2)),
  };
}

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
export function calculateUnitsPerHour(
  unitsProcessed: number,
  hoursWorked: number
): {
  unitsProcessed: number;
  hoursWorked: number;
  unitsPerHour: number;
  minutesPerUnit: number;
} {
  const unitsPerHour = hoursWorked > 0 ? unitsProcessed / hoursWorked : 0;
  const minutesPerUnit = unitsProcessed > 0 ? (hoursWorked * 60) / unitsProcessed : 0;

  return {
    unitsProcessed,
    hoursWorked,
    unitsPerHour: Number(unitsPerHour.toFixed(2)),
    minutesPerUnit: Number(minutesPerUnit.toFixed(2)),
  };
}

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
export function calculateIdleTime(shift: WorkerShift): {
  totalShiftMinutes: number;
  productiveMinutes: number;
  breakMinutes: number;
  idleMinutes: number;
  idlePercent: number;
  unaccountedMinutes: number;
} {
  const totalShiftMinutes = shift.scheduledHours * 60;
  const productiveMinutes = shift.productiveHours * 60;
  const breakMinutes = shift.breakHours * 60;
  const idleMinutes = shift.idleHours * 60;
  const accountedMinutes = productiveMinutes + breakMinutes + idleMinutes;
  const unaccountedMinutes = totalShiftMinutes - accountedMinutes;
  const idlePercent = (idleMinutes / totalShiftMinutes) * 100;

  return {
    totalShiftMinutes: Number(totalShiftMinutes.toFixed(2)),
    productiveMinutes: Number(productiveMinutes.toFixed(2)),
    breakMinutes: Number(breakMinutes.toFixed(2)),
    idleMinutes: Number(idleMinutes.toFixed(2)),
    idlePercent: Number(idlePercent.toFixed(2)),
    unaccountedMinutes: Number(unaccountedMinutes.toFixed(2)),
  };
}

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
export function generateProductivityReport(
  workerId: string,
  workerName: string,
  assignments: TaskAssignment[],
  timeEntries: TimeEntry[],
  periodStart: Date,
  periodEnd: Date
): ProductivityMetrics {
  const completedTasks = assignments.filter(a => a.status === TaskStatus.COMPLETED);
  const productivity = calculateProductivity(completedTasks, timeEntries);

  const totalMinutes = timeEntries.reduce((sum, e) => sum + e.actualDuration, 0);
  const breakMinutes = timeEntries.reduce((sum, e) => sum + e.pauseDuration, 0);
  const productiveMinutes = totalMinutes - breakMinutes;

  const taskBreakdown: Record<TaskCategory, number> = {} as any;
  for (const task of completedTasks) {
    taskBreakdown[task.taskCategory] = (taskBreakdown[task.taskCategory] || 0) + 1;
  }

  return {
    workerId,
    workerName,
    period: { start: periodStart, end: periodEnd },
    totalHours: Number((totalMinutes / 60).toFixed(2)),
    productiveHours: Number((productiveMinutes / 60).toFixed(2)),
    idleHours: Number((breakMinutes / 60).toFixed(2)),
    tasksCompleted: completedTasks.length,
    unitsProcessed: productivity.totalUnits,
    unitsPerHour: productivity.unitsPerHour,
    efficiency: 100, // Would be calculated against standards
    utilization: Number(((productiveMinutes / totalMinutes) * 100).toFixed(2)),
    taskBreakdown,
  };
}

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
export function compareWorkerPerformance(metrics: ProductivityMetrics[]): {
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
} {
  if (metrics.length === 0) {
    throw new Error('At least one worker metric is required');
  }

  const sorted = [...metrics].sort((a, b) => b.unitsPerHour - a.unitsPerHour);
  const averageUPH = metrics.reduce((sum, m) => sum + m.unitsPerHour, 0) / metrics.length;

  const rankings = sorted.map((m, index) => ({
    workerId: m.workerId,
    workerName: m.workerName,
    unitsPerHour: m.unitsPerHour,
    efficiency: m.efficiency,
    rank: index + 1,
  }));

  return {
    workerCount: metrics.length,
    averageUPH: Number(averageUPH.toFixed(2)),
    topPerformer: sorted[0],
    lowestPerformer: sorted[sorted.length - 1],
    rankings,
  };
}

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
export function calculateTeamProductivity(workerMetrics: ProductivityMetrics[]): {
  teamSize: number;
  totalHours: number;
  totalUnitsProcessed: number;
  totalTasksCompleted: number;
  averageUPH: number;
  averageEfficiency: number;
  averageUtilization: number;
  totalProductiveCost?: number;
} {
  const teamSize = workerMetrics.length;
  const totalHours = workerMetrics.reduce((sum, m) => sum + m.totalHours, 0);
  const totalUnitsProcessed = workerMetrics.reduce((sum, m) => sum + m.unitsProcessed, 0);
  const totalTasksCompleted = workerMetrics.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const averageUPH = workerMetrics.reduce((sum, m) => sum + m.unitsPerHour, 0) / teamSize;
  const averageEfficiency = workerMetrics.reduce((sum, m) => sum + m.efficiency, 0) / teamSize;
  const averageUtilization = workerMetrics.reduce((sum, m) => sum + m.utilization, 0) / teamSize;

  return {
    teamSize,
    totalHours: Number(totalHours.toFixed(2)),
    totalUnitsProcessed,
    totalTasksCompleted,
    averageUPH: Number(averageUPH.toFixed(2)),
    averageEfficiency: Number(averageEfficiency.toFixed(2)),
    averageUtilization: Number(averageUtilization.toFixed(2)),
  };
}

// ============================================================================
// SECTION 5: PERFORMANCE MANAGEMENT (Functions 33-40)
// ============================================================================

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
export function createIncentivePlan(plan: Partial<IncentivePlan>): IncentivePlan {
  const planId = `IP-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

  // Sort tiers by threshold ascending
  const sortedTiers = (plan.tiers || [])
    .map(tier => ({
      ...tier,
      tierId: tier.tierId || `TIER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    }))
    .sort((a, b) => a.threshold - b.threshold);

  return {
    planId,
    name: plan.name || '',
    type: plan.type || IncentiveType.PRODUCTIVITY,
    description: plan.description || '',
    active: plan.active ?? true,
    startDate: plan.startDate || new Date(),
    endDate: plan.endDate,
    tiers: sortedTiers,
    payoutFrequency: plan.payoutFrequency || 'WEEKLY',
    eligibilityCriteria: plan.eligibilityCriteria,
  };
}

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
export function calculateIncentivePay(
  workerId: string,
  workerName: string,
  plan: IncentivePlan,
  metrics: ProductivityMetrics,
  baseHourlyRate: number
): IncentiveEarnings {
  // Determine performance value based on plan type
  let performanceValue = 0;
  switch (plan.type) {
    case IncentiveType.PRODUCTIVITY:
      performanceValue = metrics.unitsPerHour;
      break;
    case IncentiveType.QUALITY:
      performanceValue = metrics.accuracyRate || 0;
      break;
    default:
      performanceValue = metrics.efficiency;
  }

  // Find achieved tier (highest threshold met)
  let tierAchieved: IncentiveTier | undefined;
  for (const tier of plan.tiers) {
    if (performanceValue >= tier.threshold) {
      tierAchieved = tier;
    }
  }

  // Calculate incentive amount
  let incentiveAmount = 0;
  if (tierAchieved) {
    if (tierAchieved.rewardType === 'FIXED') {
      incentiveAmount = tierAchieved.reward;
    } else if (tierAchieved.rewardType === 'PERCENTAGE') {
      const baseEarnings = metrics.totalHours * baseHourlyRate;
      incentiveAmount = baseEarnings * (tierAchieved.reward / 100);
    }
  }

  const baseEarnings = metrics.totalHours * baseHourlyRate;
  const totalEarnings = baseEarnings + incentiveAmount;

  return {
    workerId,
    workerName,
    period: metrics.period,
    planId: plan.planId,
    planName: plan.name,
    performanceValue,
    tierAchieved,
    baseEarnings: Number(baseEarnings.toFixed(2)),
    incentiveAmount: Number(incentiveAmount.toFixed(2)),
    totalEarnings: Number(totalEarnings.toFixed(2)),
    breakdown: [], // Could be populated with daily breakdown
  };
}

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
export function evaluatePerformance(
  workerId: string,
  workerName: string,
  metrics: ProductivityMetrics,
  evaluatedBy: string
): PerformanceEvaluation {
  const evaluationId = `EVAL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

  // Calculate scores (0-100)
  const productivityScore = Math.min(100, (metrics.unitsPerHour / 100) * 100);
  const qualityScore = metrics.accuracyRate || 95;
  const attendanceScore = 100; // Would be calculated from attendance records
  const safetyScore = 100; // Would be calculated from incident records

  // Overall rating
  const averageScore = (productivityScore + qualityScore + attendanceScore + safetyScore) / 4;
  let overallRating: PerformanceRating;
  if (averageScore >= 90) overallRating = PerformanceRating.EXCELLENT;
  else if (averageScore >= 80) overallRating = PerformanceRating.ABOVE_AVERAGE;
  else if (averageScore >= 70) overallRating = PerformanceRating.MEETS_EXPECTATIONS;
  else if (averageScore >= 60) overallRating = PerformanceRating.NEEDS_IMPROVEMENT;
  else overallRating = PerformanceRating.UNSATISFACTORY;

  // Identify strengths and areas for improvement
  const strengths: string[] = [];
  const areasForImprovement: string[] = [];

  if (metrics.efficiency >= 100) strengths.push('Consistently meets or exceeds productivity standards');
  if (metrics.utilization >= 85) strengths.push('Excellent time utilization');
  if (metrics.efficiency < 80) areasForImprovement.push('Productivity below expectations');
  if (metrics.utilization < 70) areasForImprovement.push('Time management needs improvement');

  return {
    evaluationId,
    workerId,
    workerName,
    evaluationPeriod: metrics.period,
    overallRating,
    productivityScore: Number(productivityScore.toFixed(2)),
    qualityScore: Number(qualityScore.toFixed(2)),
    attendanceScore,
    safetyScore,
    metrics,
    strengths,
    areasForImprovement,
    goals: [],
    evaluatedBy,
    evaluatedAt: new Date(),
  };
}

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
export function trackPerformanceTrend(historicalMetrics: ProductivityMetrics[]): {
  periods: number;
  startingUPH: number;
  endingUPH: number;
  changePercent: number;
  trendDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
  averageUPH: number;
  peakUPH: number;
  lowestUPH: number;
  consistency: number;
} {
  if (historicalMetrics.length < 2) {
    throw new Error('At least 2 periods of data required for trend analysis');
  }

  const sortedMetrics = [...historicalMetrics].sort(
    (a, b) => a.period.start.getTime() - b.period.start.getTime()
  );

  const startingUPH = sortedMetrics[0].unitsPerHour;
  const endingUPH = sortedMetrics[sortedMetrics.length - 1].unitsPerHour;
  const changePercent = ((endingUPH - startingUPH) / startingUPH) * 100;

  let trendDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
  if (changePercent > 5) trendDirection = 'IMPROVING';
  else if (changePercent < -5) trendDirection = 'DECLINING';
  else trendDirection = 'STABLE';

  const uphs = sortedMetrics.map(m => m.unitsPerHour);
  const averageUPH = uphs.reduce((sum, u) => sum + u, 0) / uphs.length;
  const peakUPH = Math.max(...uphs);
  const lowestUPH = Math.min(...uphs);

  // Calculate consistency (inverse of coefficient of variation)
  const stdDev = Math.sqrt(
    uphs.reduce((sum, u) => sum + Math.pow(u - averageUPH, 2), 0) / uphs.length
  );
  const coefficientOfVariation = (stdDev / averageUPH) * 100;
  const consistency = 100 - Math.min(100, coefficientOfVariation);

  return {
    periods: historicalMetrics.length,
    startingUPH: Number(startingUPH.toFixed(2)),
    endingUPH: Number(endingUPH.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    trendDirection,
    averageUPH: Number(averageUPH.toFixed(2)),
    peakUPH: Number(peakUPH.toFixed(2)),
    lowestUPH: Number(lowestUPH.toFixed(2)),
    consistency: Number(consistency.toFixed(2)),
  };
}

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
export function identifyTopPerformers(
  allMetrics: ProductivityMetrics[],
  topN: number = 5
): {
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
} {
  // Calculate composite score (weighted average of key metrics)
  const scored = allMetrics.map(m => {
    const compositeScore =
      m.unitsPerHour * 0.4 + // 40% weight on UPH
      m.efficiency * 0.35 + // 35% weight on efficiency
      m.utilization * 0.25; // 25% weight on utilization

    return {
      workerId: m.workerId,
      workerName: m.workerName,
      unitsPerHour: m.unitsPerHour,
      efficiency: m.efficiency,
      utilization: m.utilization,
      compositeScore: Number(compositeScore.toFixed(2)),
      rank: 0,
    };
  });

  // Sort by composite score descending
  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  // Assign ranks
  scored.forEach((s, index) => {
    s.rank = index + 1;
  });

  const topPerformers = scored.slice(0, topN);
  const averageCompositeScore =
    scored.reduce((sum, s) => sum + s.compositeScore, 0) / scored.length;
  const performanceThreshold = topPerformers.length > 0
    ? topPerformers[topPerformers.length - 1].compositeScore
    : 0;

  return {
    topPerformers,
    averageCompositeScore: Number(averageCompositeScore.toFixed(2)),
    performanceThreshold: Number(performanceThreshold.toFixed(2)),
  };
}

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
export function identifyUnderperformers(
  allMetrics: ProductivityMetrics[],
  thresholdPercent: number = 10
): {
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
} {
  // Calculate composite scores
  const scored = allMetrics.map(m => {
    const compositeScore =
      m.unitsPerHour * 0.4 + m.efficiency * 0.35 + m.utilization * 0.25;
    return { ...m, compositeScore };
  });

  const teamAverage =
    scored.reduce((sum, s) => sum + s.compositeScore, 0) / scored.length;

  // Sort by composite score ascending
  scored.sort((a, b) => a.compositeScore - b.compositeScore);

  // Take bottom X%
  const count = Math.max(1, Math.ceil((thresholdPercent / 100) * scored.length));
  const underperformers = scored.slice(0, count).map(m => {
    const gapFromAverage = teamAverage - m.compositeScore;
    const improvementAreas: string[] = [];

    if (m.unitsPerHour < teamAverage * 0.4) improvementAreas.push('Productivity (UPH)');
    if (m.efficiency < 80) improvementAreas.push('Efficiency vs. Standard');
    if (m.utilization < 70) improvementAreas.push('Time Utilization');

    return {
      workerId: m.workerId,
      workerName: m.workerName,
      unitsPerHour: m.unitsPerHour,
      efficiency: m.efficiency,
      utilization: m.utilization,
      compositeScore: Number(m.compositeScore.toFixed(2)),
      gapFromAverage: Number(gapFromAverage.toFixed(2)),
      improvementAreas,
    };
  });

  const improvementOpportunity = underperformers.reduce(
    (sum, u) => sum + u.gapFromAverage,
    0
  );

  return {
    underperformers,
    teamAverage: Number(teamAverage.toFixed(2)),
    improvementOpportunity: Number(improvementOpportunity.toFixed(2)),
  };
}

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
export function generatePerformanceReview(evaluation: PerformanceEvaluation): string {
  let review = '';
  review += '='.repeat(60) + '\n';
  review += 'PERFORMANCE REVIEW\n';
  review += '='.repeat(60) + '\n\n';

  review += `Worker: ${evaluation.workerName} (${evaluation.workerId})\n`;
  review += `Review Period: ${evaluation.evaluationPeriod.start.toLocaleDateString()} - ${evaluation.evaluationPeriod.end.toLocaleDateString()}\n`;
  review += `Overall Rating: ${evaluation.overallRating}\n`;
  review += `Evaluated By: ${evaluation.evaluatedBy}\n`;
  review += `Date: ${evaluation.evaluatedAt.toLocaleDateString()}\n\n`;

  review += '-'.repeat(60) + '\n';
  review += 'PERFORMANCE SCORES\n';
  review += '-'.repeat(60) + '\n';
  review += `Productivity:  ${evaluation.productivityScore.toFixed(1)}/100\n`;
  review += `Quality:       ${evaluation.qualityScore.toFixed(1)}/100\n`;
  review += `Attendance:    ${evaluation.attendanceScore.toFixed(1)}/100\n`;
  review += `Safety:        ${evaluation.safetyScore.toFixed(1)}/100\n\n`;

  review += '-'.repeat(60) + '\n';
  review += 'KEY METRICS\n';
  review += '-'.repeat(60) + '\n';
  review += `Tasks Completed:   ${evaluation.metrics.tasksCompleted}\n`;
  review += `Units Processed:   ${evaluation.metrics.unitsProcessed}\n`;
  review += `Units Per Hour:    ${evaluation.metrics.unitsPerHour}\n`;
  review += `Efficiency:        ${evaluation.metrics.efficiency}%\n`;
  review += `Utilization:       ${evaluation.metrics.utilization}%\n`;
  review += `Total Hours:       ${evaluation.metrics.totalHours}\n\n`;

  if (evaluation.strengths.length > 0) {
    review += '-'.repeat(60) + '\n';
    review += 'STRENGTHS\n';
    review += '-'.repeat(60) + '\n';
    evaluation.strengths.forEach((strength, i) => {
      review += `${i + 1}. ${strength}\n`;
    });
    review += '\n';
  }

  if (evaluation.areasForImprovement.length > 0) {
    review += '-'.repeat(60) + '\n';
    review += 'AREAS FOR IMPROVEMENT\n';
    review += '-'.repeat(60) + '\n';
    evaluation.areasForImprovement.forEach((area, i) => {
      review += `${i + 1}. ${area}\n`;
    });
    review += '\n';
  }

  if (evaluation.comments) {
    review += '-'.repeat(60) + '\n';
    review += 'ADDITIONAL COMMENTS\n';
    review += '-'.repeat(60) + '\n';
    review += evaluation.comments + '\n\n';
  }

  review += '='.repeat(60) + '\n';

  return review;
}

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
export function calculateTeamIncentives(
  teamMetrics: ProductivityMetrics[],
  plan: IncentivePlan,
  totalIncentivePool: number
): {
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
} {
  // Calculate team performance
  const teamProductivity = calculateTeamProductivity(teamMetrics);
  const teamPerformance = teamProductivity.averageUPH;

  // Find achieved tier
  let tierAchieved: IncentiveTier | undefined;
  for (const tier of plan.tiers) {
    if (teamPerformance >= tier.threshold) {
      tierAchieved = tier;
    }
  }

  const qualifies = tierAchieved !== undefined;
  const totalIncentive = qualifies ? totalIncentivePool : 0;

  // Distribute incentive based on individual contribution
  const totalUnits = teamMetrics.reduce((sum, m) => sum + m.unitsProcessed, 0);

  const distribution = teamMetrics.map(m => {
    const contributionPercent = (m.unitsProcessed / totalUnits) * 100;
    const incentiveAmount = (contributionPercent / 100) * totalIncentive;

    return {
      workerId: m.workerId,
      workerName: m.workerName,
      contributionPercent: Number(contributionPercent.toFixed(2)),
      incentiveAmount: Number(incentiveAmount.toFixed(2)),
    };
  });

  return {
    teamPerformance: Number(teamPerformance.toFixed(2)),
    tierAchieved,
    qualifies,
    totalIncentive: Number(totalIncentive.toFixed(2)),
    distribution,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Labor Standards
  createLaborStandard,
  calculateStandardTime,
  updateLaborStandard,
  validateLaborStandard,
  applyEfficiencyFactor,
  calculateLaborCost,
  compareLaborStandards,
  exportLaborStandards,

  // Task Assignment
  createTaskAssignment,
  assignBulkTasks,
  reassignTask,
  prioritizeTask,
  balanceWorkload,
  matchTaskToSkill,
  scheduleTask,
  cancelTaskAssignment,

  // Time Tracking
  startTimeEntry,
  stopTimeEntry,
  pauseTimeEntry,
  resumeTimeEntry,
  calculateActualTime,
  calculateBreakTime,
  validateTimeEntry,
  adjustTimeEntry,

  // Productivity Metrics
  calculateProductivity,
  calculateEfficiency,
  calculateUtilization,
  calculateUnitsPerHour,
  calculateIdleTime,
  generateProductivityReport,
  compareWorkerPerformance,
  calculateTeamProductivity,

  // Performance Management
  createIncentivePlan,
  calculateIncentivePay,
  evaluatePerformance,
  trackPerformanceTrend,
  identifyTopPerformers,
  identifyUnderperformers,
  generatePerformanceReview,
  calculateTeamIncentives,
};

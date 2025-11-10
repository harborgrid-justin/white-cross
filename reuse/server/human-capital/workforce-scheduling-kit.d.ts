/**
 * LOC: HCMSCHED1234567
 * File: /reuse/server/human-capital/workforce-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ./time-attendance-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Workforce management applications
 *   - Mobile scheduling apps
 */
/**
 * File: /reuse/server/human-capital/workforce-scheduling-kit.ts
 * Locator: WC-HCM-SCHED-001
 * Purpose: Comprehensive Workforce Scheduling & Shift Management - SAP SuccessFactors Time parity
 *
 * Upstream: Error handling, validation, time-attendance utilities
 * Downstream: ../backend/*, HR controllers, scheduling services, workforce planning, mobile apps
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for shift patterns, schedule creation, optimization, assignments, swapping, on-call, forecasting, compliance
 *
 * LLM Context: Enterprise-grade workforce scheduling system with SAP SuccessFactors Time parity.
 * Provides shift pattern templates, schedule optimization, automated assignments, shift swapping, coverage management,
 * on-call scheduling, demand forecasting, conflict resolution, schedule compliance, labor law validation,
 * mobile self-service, notifications, analytics, real-time schedule updates, integration with time tracking.
 */
import { Sequelize } from 'sequelize';
interface ShiftPattern {
    patternId: string;
    patternName: string;
    patternType: 'FIXED' | 'ROTATING' | 'SPLIT' | 'FLEX' | 'ON_CALL';
    startTime: string;
    endTime: string;
    duration: number;
    daysOfWeek: number[];
    rotationCycle?: number;
    breakAllocations: Array<{
        breakType: string;
        duration: number;
        startOffset: number;
    }>;
    active: boolean;
    metadata: Record<string, any>;
}
interface WorkSchedule {
    scheduleId: string;
    scheduleName: string;
    scheduleType: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';
    periodStart: Date;
    periodEnd: Date;
    department: string;
    totalShifts: number;
    totalAssignments: number;
    staffingLevel: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    publishedAt?: Date;
    publishedBy?: string;
    metadata: Record<string, any>;
}
interface ShiftAssignment {
    assignmentId: string;
    scheduleId: string;
    employeeId: string;
    employeeName: string;
    shiftPatternId: string;
    shiftDate: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    confirmedAt?: Date;
    notes?: string;
}
interface ShiftSwapRequest {
    swapId: string;
    requestingEmployeeId: string;
    requestingEmployeeName: string;
    originalAssignmentId: string;
    originalShiftDate: Date;
    targetEmployeeId?: string;
    targetEmployeeName?: string;
    targetAssignmentId?: string;
    swapReason: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED' | 'COMPLETED' | 'CANCELLED';
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    denialReason?: string;
}
interface CoverageRequirement {
    requirementId: string;
    department: string;
    date: Date;
    shift: string;
    requiredStaff: number;
    assignedStaff: number;
    coverageGap: number;
    skillsNeeded: string[];
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'UNDERSTAFFED' | 'ADEQUATELY_STAFFED' | 'OVERSTAFFED';
}
interface OnCallSchedule {
    onCallId: string;
    employeeId: string;
    employeeName: string;
    onCallType: 'PRIMARY' | 'SECONDARY' | 'BACKUP';
    startDateTime: Date;
    endDateTime: Date;
    department: string;
    compensation: 'HOURLY' | 'FLAT_RATE' | 'CALLBACK_ONLY';
    responseTimeRequired: number;
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    callbacksReceived: number;
}
interface DemandForecast {
    forecastId: string;
    department: string;
    forecastDate: Date;
    forecastPeriod: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
    predictedDemand: number;
    confidence: number;
    seasonalFactors: Record<string, any>;
    historicalAverage: number;
    recommendedStaffing: number;
}
interface ScheduleConflict {
    conflictId: string;
    conflictType: 'DOUBLE_BOOKING' | 'SKILL_MISMATCH' | 'OVERTIME_VIOLATION' | 'REST_PERIOD_VIOLATION' | 'UNAVAILABILITY';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    employeeId: string;
    affectedAssignments: string[];
    description: string;
    suggestedResolution?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
}
interface ScheduleNotification {
    notificationId: string;
    notificationType: 'SCHEDULE_PUBLISHED' | 'SHIFT_ASSIGNED' | 'SHIFT_CHANGED' | 'SHIFT_CANCELLED' | 'SWAP_REQUEST' | 'REMINDER';
    employeeId: string;
    message: string;
    priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
    deliveryMethods: Array<'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP'>;
    sentAt?: Date;
    readAt?: Date;
    acknowledgedAt?: Date;
}
interface ScheduleCompliance {
    complianceId: string;
    complianceType: 'LABOR_LAW' | 'UNION_RULES' | 'COMPANY_POLICY' | 'FATIGUE_MANAGEMENT';
    regulation: string;
    checkDate: Date;
    compliant: boolean;
    violations: Array<{
        violationType: string;
        employeeId: string;
        description: string;
        severity: string;
    }>;
}
interface ScheduleAnalytics {
    period: string;
    totalShifts: number;
    totalHoursScheduled: number;
    averageShiftLength: number;
    staffingEfficiency: number;
    overtimePercentage: number;
    callOutRate: number;
    swapRequestRate: number;
    schedulingCost: number;
    laborProductivity: number;
}
export declare const ShiftPatternSchema: any;
export declare const ShiftAssignmentSchema: any;
export declare const ScheduleComplianceSchema: any;
/**
 * Sequelize model for Shift Patterns with rotation and break configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ShiftPattern model
 *
 * @example
 * ```typescript
 * const ShiftPattern = createShiftPatternModel(sequelize);
 * const pattern = await ShiftPattern.create({
 *   patternName: 'Day Shift',
 *   patternType: 'FIXED',
 *   startTime: '08:00',
 *   endTime: '17:00',
 *   daysOfWeek: [1, 2, 3, 4, 5]
 * });
 * ```
 */
export declare const createShiftPatternModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        patternId: string;
        patternName: string;
        patternType: string;
        startTime: string;
        endTime: string;
        duration: number;
        daysOfWeek: number[];
        rotationCycle: number | null;
        breakAllocations: Array<any>;
        color: string | null;
        active: boolean;
        validFrom: Date;
        validTo: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Work Schedules with publishing workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkSchedule model
 *
 * @example
 * ```typescript
 * const WorkSchedule = createWorkScheduleModel(sequelize);
 * const schedule = await WorkSchedule.create({
 *   scheduleName: 'January 2025 Schedule',
 *   scheduleType: 'MONTHLY',
 *   periodStart: new Date('2025-01-01'),
 *   periodEnd: new Date('2025-01-31'),
 *   department: 'Operations'
 * });
 * ```
 */
export declare const createWorkScheduleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        scheduleId: string;
        scheduleName: string;
        scheduleType: string;
        periodStart: Date;
        periodEnd: Date;
        department: string;
        location: string | null;
        totalShifts: number;
        totalAssignments: number;
        requiredStaffing: number;
        actualStaffing: number;
        staffingLevel: number;
        status: string;
        publishedAt: Date | null;
        publishedBy: string | null;
        lockedAt: Date | null;
        lockedBy: string | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Shift Assignments with confirmation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ShiftAssignment model
 *
 * @example
 * ```typescript
 * const ShiftAssignment = createShiftAssignmentModel(sequelize);
 * const assignment = await ShiftAssignment.create({
 *   scheduleId: 'SCH-2025-001',
 *   employeeId: 'EMP-12345',
 *   shiftPatternId: 'PAT-DAY-001',
 *   shiftDate: new Date('2025-01-15'),
 *   status: 'SCHEDULED'
 * });
 * ```
 */
export declare const createShiftAssignmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assignmentId: string;
        scheduleId: string;
        employeeId: string;
        employeeName: string;
        shiftPatternId: string;
        shiftDate: Date;
        startTime: Date;
        endTime: Date;
        location: string;
        position: string | null;
        status: string;
        confirmedAt: Date | null;
        confirmedBy: string | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        notes: string | null;
        timeEntryId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates shift pattern template.
 *
 * @param {object} pattern - Pattern configuration
 * @returns {Promise<ShiftPattern>} Created shift pattern
 *
 * @example
 * ```typescript
 * const pattern = await createShiftPattern({
 *   patternName: 'Day Shift - 8hrs',
 *   patternType: 'FIXED',
 *   startTime: '08:00',
 *   endTime: '17:00',
 *   daysOfWeek: [1, 2, 3, 4, 5]
 * });
 * ```
 */
export declare const createShiftPattern: (pattern: Partial<ShiftPattern>) => Promise<ShiftPattern>;
/**
 * Creates rotating shift pattern with cycle configuration.
 *
 * @param {object} pattern - Rotating pattern details
 * @param {number} rotationCycle - Rotation cycle in days
 * @returns {Promise<ShiftPattern>} Created rotating pattern
 *
 * @example
 * ```typescript
 * const pattern = await createRotatingShiftPattern({
 *   patternName: '2-2-3 Rotation',
 *   startTime: '07:00',
 *   endTime: '19:00'
 * }, 14);
 * ```
 */
export declare const createRotatingShiftPattern: (pattern: Partial<ShiftPattern>, rotationCycle: number) => Promise<ShiftPattern>;
/**
 * Retrieves shift patterns with filtering.
 *
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<ShiftPattern[]>} Shift patterns
 *
 * @example
 * ```typescript
 * const patterns = await getShiftPatterns({ patternType: 'FIXED', active: true });
 * ```
 */
export declare const getShiftPatterns: (filters?: {
    patternType?: string;
    active?: boolean;
    department?: string;
}) => Promise<ShiftPattern[]>;
/**
 * Updates shift pattern configuration.
 *
 * @param {string} patternId - Pattern ID
 * @param {object} updates - Pattern updates
 * @returns {Promise<ShiftPattern>} Updated pattern
 *
 * @example
 * ```typescript
 * const pattern = await updateShiftPattern('PAT-12345', { startTime: '09:00', endTime: '18:00' });
 * ```
 */
export declare const updateShiftPattern: (patternId: string, updates: Partial<ShiftPattern>) => Promise<ShiftPattern>;
/**
 * Deactivates shift pattern.
 *
 * @param {string} patternId - Pattern ID
 * @param {Date} [effectiveDate] - Effective deactivation date
 * @returns {Promise<ShiftPattern>} Deactivated pattern
 *
 * @example
 * ```typescript
 * const pattern = await deactivateShiftPattern('PAT-12345', new Date('2025-12-31'));
 * ```
 */
export declare const deactivateShiftPattern: (patternId: string, effectiveDate?: Date) => Promise<ShiftPattern>;
/**
 * Creates work schedule for period.
 *
 * @param {object} schedule - Schedule configuration
 * @returns {Promise<WorkSchedule>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createWorkSchedule({
 *   scheduleName: 'February 2025',
 *   scheduleType: 'MONTHLY',
 *   periodStart: new Date('2025-02-01'),
 *   periodEnd: new Date('2025-02-28'),
 *   department: 'Operations'
 * });
 * ```
 */
export declare const createWorkSchedule: (schedule: Partial<WorkSchedule>) => Promise<WorkSchedule>;
/**
 * Generates optimal schedule using AI/ML algorithms.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {object} constraints - Scheduling constraints
 * @returns {Promise<{ assignments: ShiftAssignment[]; score: number; conflicts: number }>} Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = await optimizeSchedule('SCH-12345', {
 *   maxConsecutiveDays: 6,
 *   minRestHours: 11,
 *   preferredStaffing: 10
 * });
 * ```
 */
export declare const optimizeSchedule: (scheduleId: string, constraints: {
    maxConsecutiveDays?: number;
    minRestHours?: number;
    preferredStaffing?: number;
    skillRequirements?: Record<string, string[]>;
}) => Promise<{
    assignments: ShiftAssignment[];
    score: number;
    conflicts: number;
}>;
/**
 * Auto-assigns shifts based on availability and skills.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {object} [options] - Assignment options
 * @returns {Promise<{ assigned: number; unassigned: number; assignments: ShiftAssignment[] }>} Assignment result
 *
 * @example
 * ```typescript
 * const result = await autoAssignShifts('SCH-12345', {
 *   respectPreferences: true,
 *   balanceWorkload: true
 * });
 * ```
 */
export declare const autoAssignShifts: (scheduleId: string, options?: {
    respectPreferences?: boolean;
    balanceWorkload?: boolean;
}) => Promise<{
    assigned: number;
    unassigned: number;
    assignments: ShiftAssignment[];
}>;
/**
 * Validates schedule for conflicts and compliance.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[]; conflicts: ScheduleConflict[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSchedule('SCH-12345');
 * if (!validation.valid) {
 *   console.error('Schedule has errors:', validation.errors);
 * }
 * ```
 */
export declare const validateSchedule: (scheduleId: string) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    conflicts: ScheduleConflict[];
}>;
/**
 * Copies schedule to new period with adjustments.
 *
 * @param {string} sourceScheduleId - Source schedule ID
 * @param {Date} newPeriodStart - New period start
 * @param {Date} newPeriodEnd - New period end
 * @param {object} [adjustments] - Schedule adjustments
 * @returns {Promise<WorkSchedule>} Copied schedule
 *
 * @example
 * ```typescript
 * const newSchedule = await copySchedule('SCH-12345', new Date('2025-02-01'), new Date('2025-02-28'));
 * ```
 */
export declare const copySchedule: (sourceScheduleId: string, newPeriodStart: Date, newPeriodEnd: Date, adjustments?: any) => Promise<WorkSchedule>;
/**
 * Assigns shift to employee.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} employeeId - Employee ID
 * @param {object} shift - Shift details
 * @returns {Promise<ShiftAssignment>} Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignShift('SCH-12345', 'EMP-67890', {
 *   shiftPatternId: 'PAT-DAY-001',
 *   shiftDate: new Date('2025-01-20'),
 *   location: 'Main Office'
 * });
 * ```
 */
export declare const assignShift: (scheduleId: string, employeeId: string, shift: Partial<ShiftAssignment>) => Promise<ShiftAssignment>;
/**
 * Unassigns shift from employee.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string} reason - Unassignment reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unassignShift('ASG-12345', 'Employee requested time off');
 * ```
 */
export declare const unassignShift: (assignmentId: string, reason: string) => Promise<void>;
/**
 * Publishes schedule to employees.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} publishedBy - User publishing
 * @param {object} [options] - Publishing options
 * @returns {Promise<{ published: boolean; notificationsSent: number; errors: string[] }>} Publishing result
 *
 * @example
 * ```typescript
 * const result = await publishSchedule('SCH-12345', 'mgr.smith', {
 *   sendNotifications: true,
 *   notificationMethods: ['EMAIL', 'SMS']
 * });
 * ```
 */
export declare const publishSchedule: (scheduleId: string, publishedBy: string, options?: {
    sendNotifications?: boolean;
    notificationMethods?: string[];
}) => Promise<{
    published: boolean;
    notificationsSent: number;
    errors: string[];
}>;
/**
 * Retrieves employee's assigned shifts.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<ShiftAssignment[]>} Employee's shifts
 *
 * @example
 * ```typescript
 * const shifts = await getEmployeeShifts('EMP-12345', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare const getEmployeeShifts: (employeeId: string, startDate: Date, endDate: Date) => Promise<ShiftAssignment[]>;
/**
 * Confirms shift assignment by employee.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string} employeeId - Employee ID confirming
 * @returns {Promise<ShiftAssignment>} Confirmed assignment
 *
 * @example
 * ```typescript
 * const assignment = await confirmShiftAssignment('ASG-12345', 'EMP-67890');
 * ```
 */
export declare const confirmShiftAssignment: (assignmentId: string, employeeId: string) => Promise<ShiftAssignment>;
/**
 * Creates shift swap request.
 *
 * @param {string} requestingEmployeeId - Employee requesting swap
 * @param {string} originalAssignmentId - Original assignment ID
 * @param {object} swap - Swap details
 * @returns {Promise<ShiftSwapRequest>} Created swap request
 *
 * @example
 * ```typescript
 * const swapRequest = await createShiftSwapRequest('EMP-12345', 'ASG-67890', {
 *   targetEmployeeId: 'EMP-99999',
 *   swapReason: 'Family emergency'
 * });
 * ```
 */
export declare const createShiftSwapRequest: (requestingEmployeeId: string, originalAssignmentId: string, swap: Partial<ShiftSwapRequest>) => Promise<ShiftSwapRequest>;
/**
 * Approves shift swap request.
 *
 * @param {string} swapId - Swap request ID
 * @param {string} approvedBy - User approving
 * @returns {Promise<ShiftSwapRequest>} Approved swap
 *
 * @example
 * ```typescript
 * const swap = await approveShiftSwap('SWP-12345', 'mgr.smith');
 * ```
 */
export declare const approveShiftSwap: (swapId: string, approvedBy: string) => Promise<ShiftSwapRequest>;
/**
 * Denies shift swap request.
 *
 * @param {string} swapId - Swap request ID
 * @param {string} deniedBy - User denying
 * @param {string} reason - Denial reason
 * @returns {Promise<ShiftSwapRequest>} Denied swap
 *
 * @example
 * ```typescript
 * const swap = await denyShiftSwap('SWP-12345', 'mgr.smith', 'Insufficient coverage');
 * ```
 */
export declare const denyShiftSwap: (swapId: string, deniedBy: string, reason: string) => Promise<ShiftSwapRequest>;
/**
 * Identifies coverage gaps in schedule.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<CoverageRequirement[]>} Coverage gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyCoverageGaps('SCH-12345', { priority: 'CRITICAL' });
 * ```
 */
export declare const identifyCoverageGaps: (scheduleId: string, filters?: any) => Promise<CoverageRequirement[]>;
/**
 * Finds eligible employees for shift coverage.
 *
 * @param {string} assignmentId - Assignment needing coverage
 * @param {object} [criteria] - Selection criteria
 * @returns {Promise<Array<{ employeeId: string; employeeName: string; score: number; available: boolean }>>} Eligible employees
 *
 * @example
 * ```typescript
 * const eligible = await findEligibleCoverage('ASG-12345', {
 *   mustHaveSkills: ['CPR', 'FORKLIFT'],
 *   preferLocal: true
 * });
 * ```
 */
export declare const findEligibleCoverage: (assignmentId: string, criteria?: {
    mustHaveSkills?: string[];
    preferLocal?: boolean;
}) => Promise<Array<{
    employeeId: string;
    employeeName: string;
    score: number;
    available: boolean;
}>>;
/**
 * Creates on-call schedule for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} onCall - On-call details
 * @returns {Promise<OnCallSchedule>} Created on-call schedule
 *
 * @example
 * ```typescript
 * const onCall = await createOnCallSchedule('EMP-12345', {
 *   onCallType: 'PRIMARY',
 *   startDateTime: new Date('2025-01-20 18:00'),
 *   endDateTime: new Date('2025-01-27 08:00'),
 *   department: 'IT Support'
 * });
 * ```
 */
export declare const createOnCallSchedule: (employeeId: string, onCall: Partial<OnCallSchedule>) => Promise<OnCallSchedule>;
/**
 * Retrieves on-call rotation schedule.
 *
 * @param {string} department - Department
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<OnCallSchedule[]>} On-call schedules
 *
 * @example
 * ```typescript
 * const rotation = await getOnCallRotation('IT Support', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const getOnCallRotation: (department: string, startDate: Date, endDate: Date) => Promise<OnCallSchedule[]>;
/**
 * Records on-call callback event.
 *
 * @param {string} onCallId - On-call schedule ID
 * @param {object} callback - Callback details
 * @returns {Promise<object>} Callback record
 *
 * @example
 * ```typescript
 * const callback = await recordOnCallCallback('ONC-12345', {
 *   callTime: new Date(),
 *   duration: 45,
 *   resolved: true
 * });
 * ```
 */
export declare const recordOnCallCallback: (onCallId: string, callback: {
    callTime: Date;
    duration: number;
    resolved: boolean;
    notes?: string;
}) => Promise<any>;
/**
 * Calculates on-call compensation.
 *
 * @param {string} onCallId - On-call schedule ID
 * @param {number} baseRate - Base hourly rate
 * @returns {Promise<{ onCallPay: number; callbackPay: number; totalPay: number }>} Compensation calculation
 *
 * @example
 * ```typescript
 * const compensation = await calculateOnCallCompensation('ONC-12345', 35.00);
 * ```
 */
export declare const calculateOnCallCompensation: (onCallId: string, baseRate: number) => Promise<{
    onCallPay: number;
    callbackPay: number;
    totalPay: number;
}>;
/**
 * Validates on-call schedule for compliance.
 *
 * @param {OnCallSchedule[]} schedules - On-call schedules
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateOnCallSchedule(schedules);
 * ```
 */
export declare const validateOnCallSchedule: (schedules: OnCallSchedule[]) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Forecasts staffing demand using historical data.
 *
 * @param {string} department - Department
 * @param {Date} forecastDate - Date to forecast
 * @param {object} [options] - Forecasting options
 * @returns {Promise<DemandForecast>} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastDemand('Operations', new Date('2025-03-15'), {
 *   includeSeasonality: true,
 *   confidenceLevel: 0.95
 * });
 * ```
 */
export declare const forecastDemand: (department: string, forecastDate: Date, options?: {
    includeSeasonality?: boolean;
    confidenceLevel?: number;
}) => Promise<DemandForecast>;
/**
 * Analyzes historical staffing patterns.
 *
 * @param {string} department - Department
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Staffing analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeHistoricalStaffing('Operations', new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const analyzeHistoricalStaffing: (department: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Generates recommended staffing levels.
 *
 * @param {string} department - Department
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {object} [constraints] - Staffing constraints
 * @returns {Promise<Array<{ date: Date; recommended: number; minimum: number; maximum: number }>>} Staffing recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateStaffingRecommendations('Operations',
 *   new Date('2025-02-01'),
 *   new Date('2025-02-28')
 * );
 * ```
 */
export declare const generateStaffingRecommendations: (department: string, periodStart: Date, periodEnd: Date, constraints?: {
    budgetLimit?: number;
    maxStaff?: number;
}) => Promise<Array<{
    date: Date;
    recommended: number;
    minimum: number;
    maximum: number;
}>>;
/**
 * Identifies peak demand periods.
 *
 * @param {string} department - Department
 * @param {number} [lookbackDays=365] - Days to analyze
 * @returns {Promise<Array<{ period: string; demandLevel: number; frequency: number }>>} Peak periods
 *
 * @example
 * ```typescript
 * const peaks = await identifyPeakPeriods('Operations', 365);
 * ```
 */
export declare const identifyPeakPeriods: (department: string, lookbackDays?: number) => Promise<Array<{
    period: string;
    demandLevel: number;
    frequency: number;
}>>;
/**
 * Calculates optimal staffing budget.
 *
 * @param {string} department - Department
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} averageRate - Average hourly rate
 * @returns {Promise<{ estimatedCost: number; recommendedBudget: number; breakdown: object }>} Budget calculation
 *
 * @example
 * ```typescript
 * const budget = await calculateStaffingBudget('Operations',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31'),
 *   28.50
 * );
 * ```
 */
export declare const calculateStaffingBudget: (department: string, periodStart: Date, periodEnd: Date, averageRate: number) => Promise<{
    estimatedCost: number;
    recommendedBudget: number;
    breakdown: object;
}>;
/**
 * Detects scheduling conflicts.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<ScheduleConflict[]>} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await detectScheduleConflicts('SCH-12345');
 * ```
 */
export declare const detectScheduleConflicts: (scheduleId: string) => Promise<ScheduleConflict[]>;
/**
 * Resolves schedule conflict automatically.
 *
 * @param {string} conflictId - Conflict ID
 * @param {string} resolutionStrategy - Resolution strategy
 * @returns {Promise<{ resolved: boolean; action: string; affectedAssignments: string[] }>} Resolution result
 *
 * @example
 * ```typescript
 * const result = await resolveScheduleConflict('CNF-12345', 'AUTO_REASSIGN');
 * ```
 */
export declare const resolveScheduleConflict: (conflictId: string, resolutionStrategy: string) => Promise<{
    resolved: boolean;
    action: string;
    affectedAssignments: string[];
}>;
/**
 * Validates employee availability for assignment.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startTime - Assignment start time
 * @param {Date} endTime - Assignment end time
 * @returns {Promise<{ available: boolean; conflicts: string[]; warnings: string[] }>} Availability check
 *
 * @example
 * ```typescript
 * const check = await checkEmployeeAvailability('EMP-12345',
 *   new Date('2025-01-20 08:00'),
 *   new Date('2025-01-20 17:00')
 * );
 * ```
 */
export declare const checkEmployeeAvailability: (employeeId: string, startTime: Date, endTime: Date) => Promise<{
    available: boolean;
    conflicts: string[];
    warnings: string[];
}>;
/**
 * Validates rest period compliance between shifts.
 *
 * @param {ShiftAssignment[]} assignments - Employee's assignments
 * @param {number} [minimumRestHours=11] - Minimum rest hours required
 * @returns {Promise<{ compliant: boolean; violations: Array<{ date: Date; restHours: number; required: number }> }>} Compliance check
 *
 * @example
 * ```typescript
 * const compliance = await validateRestPeriods(assignments, 11);
 * ```
 */
export declare const validateRestPeriods: (assignments: ShiftAssignment[], minimumRestHours?: number) => Promise<{
    compliant: boolean;
    violations: Array<{
        date: Date;
        restHours: number;
        required: number;
    }>;
}>;
/**
 * Suggests conflict resolution options.
 *
 * @param {ScheduleConflict} conflict - Schedule conflict
 * @returns {Promise<Array<{ strategy: string; feasibility: number; impact: string }>>} Resolution options
 *
 * @example
 * ```typescript
 * const options = await suggestConflictResolution(conflict);
 * ```
 */
export declare const suggestConflictResolution: (conflict: ScheduleConflict) => Promise<Array<{
    strategy: string;
    feasibility: number;
    impact: string;
}>>;
/**
 * Sends schedule notification to employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} notification - Notification details
 * @returns {Promise<ScheduleNotification>} Sent notification
 *
 * @example
 * ```typescript
 * const notification = await sendScheduleNotification('EMP-12345', {
 *   notificationType: 'SHIFT_ASSIGNED',
 *   message: 'You have been assigned to the day shift on Jan 20',
 *   priority: 'NORMAL',
 *   deliveryMethods: ['EMAIL', 'PUSH']
 * });
 * ```
 */
export declare const sendScheduleNotification: (employeeId: string, notification: Partial<ScheduleNotification>) => Promise<ScheduleNotification>;
/**
 * Sends shift reminder to employees.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {number} [hoursBeforeShift=24] - Hours before shift to send reminder
 * @returns {Promise<{ sent: number; failed: number }>} Reminder result
 *
 * @example
 * ```typescript
 * const result = await sendShiftReminders('SCH-12345', 24);
 * ```
 */
export declare const sendShiftReminders: (scheduleId: string, hoursBeforeShift?: number) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * Configures notification preferences for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} preferences - Notification preferences
 * @returns {Promise<object>} Updated preferences
 *
 * @example
 * ```typescript
 * const prefs = await configureNotificationPreferences('EMP-12345', {
 *   emailEnabled: true,
 *   smsEnabled: false,
 *   pushEnabled: true,
 *   reminderHours: 24
 * });
 * ```
 */
export declare const configureNotificationPreferences: (employeeId: string, preferences: any) => Promise<any>;
/**
 * Retrieves notification history for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<ScheduleNotification[]>} Notification history
 *
 * @example
 * ```typescript
 * const history = await getNotificationHistory('EMP-12345', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare const getNotificationHistory: (employeeId: string, startDate?: Date, endDate?: Date) => Promise<ScheduleNotification[]>;
/**
 * Acknowledges notification receipt.
 *
 * @param {string} notificationId - Notification ID
 * @param {string} employeeId - Employee ID
 * @returns {Promise<ScheduleNotification>} Acknowledged notification
 *
 * @example
 * ```typescript
 * const notification = await acknowledgeNotification('NTF-12345', 'EMP-67890');
 * ```
 */
export declare const acknowledgeNotification: (notificationId: string, employeeId: string) => Promise<ScheduleNotification>;
/**
 * Validates schedule compliance with labor laws.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} jurisdiction - Legal jurisdiction
 * @returns {Promise<ScheduleCompliance>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await validateLaborLawCompliance('SCH-12345', 'CA');
 * ```
 */
export declare const validateLaborLawCompliance: (scheduleId: string, jurisdiction: string) => Promise<ScheduleCompliance>;
/**
 * Validates union rule compliance.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} unionContract - Union contract identifier
 * @returns {Promise<ScheduleCompliance>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await validateUnionCompliance('SCH-12345', 'UNION-2025-001');
 * ```
 */
export declare const validateUnionCompliance: (scheduleId: string, unionContract: string) => Promise<ScheduleCompliance>;
/**
 * Generates schedule analytics dashboard.
 *
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<ScheduleAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateScheduleAnalytics(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   { department: 'Operations' }
 * );
 * ```
 */
export declare const generateScheduleAnalytics: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<ScheduleAnalytics>;
/**
 * Calculates schedule efficiency metrics.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<{ utilizationRate: number; costEfficiency: number; satisfactionScore: number }>} Efficiency metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateScheduleEfficiency('SCH-12345');
 * ```
 */
export declare const calculateScheduleEfficiency: (scheduleId: string) => Promise<{
    utilizationRate: number;
    costEfficiency: number;
    satisfactionScore: number;
}>;
/**
 * Exports schedule data in various formats.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV' | 'iCAL')
 * @param {object} [options] - Export options
 * @returns {Promise<Buffer>} Exported schedule
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportSchedule('SCH-12345', 'PDF', { includeEmployeePhotos: true });
 * ```
 */
export declare const exportSchedule: (scheduleId: string, format: string, options?: any) => Promise<Buffer>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createShiftPatternModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            patternId: string;
            patternName: string;
            patternType: string;
            startTime: string;
            endTime: string;
            duration: number;
            daysOfWeek: number[];
            rotationCycle: number | null;
            breakAllocations: Array<any>;
            color: string | null;
            active: boolean;
            validFrom: Date;
            validTo: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createWorkScheduleModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            scheduleId: string;
            scheduleName: string;
            scheduleType: string;
            periodStart: Date;
            periodEnd: Date;
            department: string;
            location: string | null;
            totalShifts: number;
            totalAssignments: number;
            requiredStaffing: number;
            actualStaffing: number;
            staffingLevel: number;
            status: string;
            publishedAt: Date | null;
            publishedBy: string | null;
            lockedAt: Date | null;
            lockedBy: string | null;
            notes: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createShiftAssignmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            assignmentId: string;
            scheduleId: string;
            employeeId: string;
            employeeName: string;
            shiftPatternId: string;
            shiftDate: Date;
            startTime: Date;
            endTime: Date;
            location: string;
            position: string | null;
            status: string;
            confirmedAt: Date | null;
            confirmedBy: string | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancelledBy: string | null;
            cancellationReason: string | null;
            notes: string | null;
            timeEntryId: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createShiftPattern: (pattern: Partial<ShiftPattern>) => Promise<ShiftPattern>;
    createRotatingShiftPattern: (pattern: Partial<ShiftPattern>, rotationCycle: number) => Promise<ShiftPattern>;
    getShiftPatterns: (filters?: {
        patternType?: string;
        active?: boolean;
        department?: string;
    }) => Promise<ShiftPattern[]>;
    updateShiftPattern: (patternId: string, updates: Partial<ShiftPattern>) => Promise<ShiftPattern>;
    deactivateShiftPattern: (patternId: string, effectiveDate?: Date) => Promise<ShiftPattern>;
    createWorkSchedule: (schedule: Partial<WorkSchedule>) => Promise<WorkSchedule>;
    optimizeSchedule: (scheduleId: string, constraints: {
        maxConsecutiveDays?: number;
        minRestHours?: number;
        preferredStaffing?: number;
        skillRequirements?: Record<string, string[]>;
    }) => Promise<{
        assignments: ShiftAssignment[];
        score: number;
        conflicts: number;
    }>;
    autoAssignShifts: (scheduleId: string, options?: {
        respectPreferences?: boolean;
        balanceWorkload?: boolean;
    }) => Promise<{
        assigned: number;
        unassigned: number;
        assignments: ShiftAssignment[];
    }>;
    validateSchedule: (scheduleId: string) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
        conflicts: ScheduleConflict[];
    }>;
    copySchedule: (sourceScheduleId: string, newPeriodStart: Date, newPeriodEnd: Date, adjustments?: any) => Promise<WorkSchedule>;
    assignShift: (scheduleId: string, employeeId: string, shift: Partial<ShiftAssignment>) => Promise<ShiftAssignment>;
    unassignShift: (assignmentId: string, reason: string) => Promise<void>;
    publishSchedule: (scheduleId: string, publishedBy: string, options?: {
        sendNotifications?: boolean;
        notificationMethods?: string[];
    }) => Promise<{
        published: boolean;
        notificationsSent: number;
        errors: string[];
    }>;
    getEmployeeShifts: (employeeId: string, startDate: Date, endDate: Date) => Promise<ShiftAssignment[]>;
    confirmShiftAssignment: (assignmentId: string, employeeId: string) => Promise<ShiftAssignment>;
    createShiftSwapRequest: (requestingEmployeeId: string, originalAssignmentId: string, swap: Partial<ShiftSwapRequest>) => Promise<ShiftSwapRequest>;
    approveShiftSwap: (swapId: string, approvedBy: string) => Promise<ShiftSwapRequest>;
    denyShiftSwap: (swapId: string, deniedBy: string, reason: string) => Promise<ShiftSwapRequest>;
    identifyCoverageGaps: (scheduleId: string, filters?: any) => Promise<CoverageRequirement[]>;
    findEligibleCoverage: (assignmentId: string, criteria?: {
        mustHaveSkills?: string[];
        preferLocal?: boolean;
    }) => Promise<Array<{
        employeeId: string;
        employeeName: string;
        score: number;
        available: boolean;
    }>>;
    createOnCallSchedule: (employeeId: string, onCall: Partial<OnCallSchedule>) => Promise<OnCallSchedule>;
    getOnCallRotation: (department: string, startDate: Date, endDate: Date) => Promise<OnCallSchedule[]>;
    recordOnCallCallback: (onCallId: string, callback: {
        callTime: Date;
        duration: number;
        resolved: boolean;
        notes?: string;
    }) => Promise<any>;
    calculateOnCallCompensation: (onCallId: string, baseRate: number) => Promise<{
        onCallPay: number;
        callbackPay: number;
        totalPay: number;
    }>;
    validateOnCallSchedule: (schedules: OnCallSchedule[]) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    forecastDemand: (department: string, forecastDate: Date, options?: {
        includeSeasonality?: boolean;
        confidenceLevel?: number;
    }) => Promise<DemandForecast>;
    analyzeHistoricalStaffing: (department: string, startDate: Date, endDate: Date) => Promise<any>;
    generateStaffingRecommendations: (department: string, periodStart: Date, periodEnd: Date, constraints?: {
        budgetLimit?: number;
        maxStaff?: number;
    }) => Promise<Array<{
        date: Date;
        recommended: number;
        minimum: number;
        maximum: number;
    }>>;
    identifyPeakPeriods: (department: string, lookbackDays?: number) => Promise<Array<{
        period: string;
        demandLevel: number;
        frequency: number;
    }>>;
    calculateStaffingBudget: (department: string, periodStart: Date, periodEnd: Date, averageRate: number) => Promise<{
        estimatedCost: number;
        recommendedBudget: number;
        breakdown: object;
    }>;
    detectScheduleConflicts: (scheduleId: string) => Promise<ScheduleConflict[]>;
    resolveScheduleConflict: (conflictId: string, resolutionStrategy: string) => Promise<{
        resolved: boolean;
        action: string;
        affectedAssignments: string[];
    }>;
    checkEmployeeAvailability: (employeeId: string, startTime: Date, endTime: Date) => Promise<{
        available: boolean;
        conflicts: string[];
        warnings: string[];
    }>;
    validateRestPeriods: (assignments: ShiftAssignment[], minimumRestHours?: number) => Promise<{
        compliant: boolean;
        violations: Array<{
            date: Date;
            restHours: number;
            required: number;
        }>;
    }>;
    suggestConflictResolution: (conflict: ScheduleConflict) => Promise<Array<{
        strategy: string;
        feasibility: number;
        impact: string;
    }>>;
    sendScheduleNotification: (employeeId: string, notification: Partial<ScheduleNotification>) => Promise<ScheduleNotification>;
    sendShiftReminders: (scheduleId: string, hoursBeforeShift?: number) => Promise<{
        sent: number;
        failed: number;
    }>;
    configureNotificationPreferences: (employeeId: string, preferences: any) => Promise<any>;
    getNotificationHistory: (employeeId: string, startDate?: Date, endDate?: Date) => Promise<ScheduleNotification[]>;
    acknowledgeNotification: (notificationId: string, employeeId: string) => Promise<ScheduleNotification>;
    validateLaborLawCompliance: (scheduleId: string, jurisdiction: string) => Promise<ScheduleCompliance>;
    validateUnionCompliance: (scheduleId: string, unionContract: string) => Promise<ScheduleCompliance>;
    generateScheduleAnalytics: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<ScheduleAnalytics>;
    calculateScheduleEfficiency: (scheduleId: string) => Promise<{
        utilizationRate: number;
        costEfficiency: number;
        satisfactionScore: number;
    }>;
    exportSchedule: (scheduleId: string, format: string, options?: any) => Promise<Buffer>;
};
export default _default;
//# sourceMappingURL=workforce-scheduling-kit.d.ts.map
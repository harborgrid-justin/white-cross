/**
 * LOC: HCMTIME1234567
 * File: /reuse/server/human-capital/time-attendance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../database-models-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Time tracking applications
 *   - Payroll integration controllers
 */
/**
 * File: /reuse/server/human-capital/time-attendance-kit.ts
 * Locator: WC-HCM-TIME-001
 * Purpose: Comprehensive Time & Attendance Management Utilities - SAP SuccessFactors Time parity
 *
 * Upstream: Error handling, validation, database model utilities
 * Downstream: ../backend/*, HR controllers, payroll services, time tracking apps, workforce management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 49 utility functions for time tracking, attendance, timesheets, clock in/out, absences, overtime, breaks, approvals
 *
 * LLM Context: Enterprise-grade time and attendance system with SAP SuccessFactors Time parity.
 * Provides clock in/out management, timesheet creation, attendance tracking, absence recording, shift scheduling,
 * overtime calculations, break tracking, time-off requests, attendance policy enforcement, tardiness tracking,
 * time corrections, payroll integration, real-time analytics, compliance reporting, mobile time entry.
 */
import { Sequelize } from 'sequelize';
interface TimeEntry {
    employeeId: string;
    entryDate: Date;
    clockIn: Date;
    clockOut?: Date;
    breakStart?: Date;
    breakEnd?: Date;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
    location?: string;
    deviceId?: string;
    notes?: string;
}
interface Timesheet {
    timesheetId: string;
    employeeId: string;
    employeeName: string;
    periodStart: Date;
    periodEnd: Date;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    ptoHours: number;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';
    submittedAt?: Date;
    approvedAt?: Date;
    approvedBy?: string;
    entries: TimeEntry[];
}
interface AttendanceRecord {
    employeeId: string;
    date: Date;
    scheduleIn: Date;
    scheduleOut: Date;
    actualIn?: Date;
    actualOut?: Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEFT_EARLY' | 'EXCUSED' | 'UNEXCUSED';
    tardyMinutes: number;
    earlyDepartureMinutes: number;
    attendancePoints?: number;
    notes?: string;
}
interface AbsenceRecord {
    absenceId: string;
    employeeId: string;
    absenceType: 'SICK' | 'VACATION' | 'PERSONAL' | 'BEREAVEMENT' | 'JURY_DUTY' | 'FMLA' | 'UNPAID';
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalHours: number;
    status: 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED';
    reason?: string;
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    denialReason?: string;
}
interface OvertimeRequest {
    overtimeId: string;
    employeeId: string;
    workDate: Date;
    requestedHours: number;
    actualHours?: number;
    overtimeType: 'REGULAR_OT' | 'DOUBLE_TIME' | 'HOLIDAY_OT';
    justification: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
}
interface BreakPeriod {
    breakId: string;
    employeeId: string;
    breakType: 'MEAL' | 'REST' | 'PAID' | 'UNPAID';
    startTime: Date;
    endTime?: Date;
    duration: number;
    isPaid: boolean;
    complianceViolation?: boolean;
    violationReason?: string;
}
interface TimeOffRequest {
    requestId: string;
    employeeId: string;
    employeeName: string;
    requestType: 'PTO' | 'SICK' | 'VACATION' | 'PERSONAL' | 'COMP_TIME';
    startDate: Date;
    endDate: Date;
    totalHours: number;
    partialDay: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED';
    requestedAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    denialReason?: string;
}
interface AttendancePolicy {
    policyId: string;
    policyName: string;
    policyType: 'PUNCTUALITY' | 'ABSENCE' | 'OVERTIME' | 'BREAK' | 'TIMESHEET';
    rules: Array<{
        condition: string;
        action: string;
        points?: number;
        threshold?: number;
    }>;
    pointsThresholds: {
        warning: number;
        suspension: number;
        termination: number;
    };
    active: boolean;
}
interface TimeCorrection {
    correctionId: string;
    employeeId: string;
    originalEntry: TimeEntry;
    correctedEntry: TimeEntry;
    reason: string;
    correctionType: 'CLOCK_IN' | 'CLOCK_OUT' | 'HOURS' | 'BREAK' | 'FULL_ENTRY';
    requestedBy: string;
    requestedAt: Date;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    approvedBy?: string;
    approvedAt?: Date;
}
interface PayrollExport {
    exportId: string;
    periodStart: Date;
    periodEnd: Date;
    totalEmployees: number;
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalPTOHours: number;
    exportFormat: 'ADP' | 'PAYCHEX' | 'QUICKBOOKS' | 'SAP' | 'CUSTOM';
    exportedAt: Date;
    exportedBy: string;
    status: 'GENERATED' | 'TRANSMITTED' | 'CONFIRMED' | 'ERROR';
}
interface AttendanceAnalytics {
    period: string;
    totalEmployees: number;
    averageHoursPerEmployee: number;
    totalAbsences: number;
    absenceRate: number;
    tardyIncidents: number;
    punctualityRate: number;
    overtimeHours: number;
    overtimePercentage: number;
    complianceViolations: number;
}
export declare const TimeEntrySchema: any;
export declare const TimesheetSchema: any;
export declare const AbsenceRecordSchema: any;
/**
 * Sequelize model for Time Entries with clock in/out tracking and approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TimeEntry model
 *
 * @example
 * ```typescript
 * const TimeEntry = createTimeEntryModel(sequelize);
 * const entry = await TimeEntry.create({
 *   employeeId: 'EMP-12345',
 *   entryDate: new Date(),
 *   clockIn: new Date(),
 *   status: 'IN_PROGRESS'
 * });
 * ```
 */
export declare const createTimeEntryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        employeeId: string;
        employeeName: string;
        entryDate: Date;
        clockIn: Date;
        clockOut: Date | null;
        breakStart: Date | null;
        breakEnd: Date | null;
        totalHours: number;
        regularHours: number;
        overtimeHours: number;
        status: string;
        location: string | null;
        deviceId: string | null;
        ipAddress: string | null;
        geolocation: Record<string, any> | null;
        notes: string | null;
        timesheetId: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Timesheets with period tracking and approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Timesheet model
 *
 * @example
 * ```typescript
 * const Timesheet = createTimesheetModel(sequelize);
 * const timesheet = await Timesheet.create({
 *   timesheetId: 'TS-2025-001',
 *   employeeId: 'EMP-12345',
 *   periodStart: new Date('2025-01-01'),
 *   periodEnd: new Date('2025-01-15'),
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createTimesheetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        timesheetId: string;
        employeeId: string;
        employeeName: string;
        department: string;
        periodStart: Date;
        periodEnd: Date;
        totalHours: number;
        regularHours: number;
        overtimeHours: number;
        doubleTimeHours: number;
        ptoHours: number;
        sickHours: number;
        holidayHours: number;
        status: string;
        submittedAt: Date | null;
        submittedBy: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedBy: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        paidAt: Date | null;
        payrollBatch: string | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Attendance Records with punctuality tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AttendanceRecord model
 *
 * @example
 * ```typescript
 * const AttendanceRecord = createAttendanceRecordModel(sequelize);
 * const attendance = await AttendanceRecord.create({
 *   employeeId: 'EMP-12345',
 *   date: new Date(),
 *   scheduleIn: new Date('2025-01-15 09:00'),
 *   scheduleOut: new Date('2025-01-15 17:00'),
 *   status: 'PRESENT'
 * });
 * ```
 */
export declare const createAttendanceRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        employeeId: string;
        employeeName: string;
        date: Date;
        scheduleIn: Date;
        scheduleOut: Date;
        actualIn: Date | null;
        actualOut: Date | null;
        status: string;
        tardyMinutes: number;
        earlyDepartureMinutes: number;
        attendancePoints: number;
        excused: boolean;
        excuseReason: string | null;
        notes: string | null;
        shiftId: string | null;
        timeEntryId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Records employee clock in with location and device tracking.
 *
 * @param {string} employeeId - Employee identifier
 * @param {object} options - Clock in options (location, deviceId, geolocation)
 * @returns {Promise<TimeEntry>} Created time entry
 *
 * @example
 * ```typescript
 * const entry = await clockIn('EMP-12345', {
 *   location: 'Main Office',
 *   deviceId: 'KIOSK-001',
 *   geolocation: { lat: 38.9072, lng: -77.0369 }
 * });
 * ```
 */
export declare const clockIn: (employeeId: string, options?: {
    location?: string;
    deviceId?: string;
    geolocation?: any;
    ipAddress?: string;
}) => Promise<TimeEntry>;
/**
 * Records employee clock out and calculates total hours worked.
 *
 * @param {string} employeeId - Employee identifier
 * @param {number} timeEntryId - Time entry ID to complete
 * @param {object} [options] - Clock out options
 * @returns {Promise<TimeEntry>} Updated time entry with calculated hours
 *
 * @example
 * ```typescript
 * const entry = await clockOut('EMP-12345', 1001);
 * console.log(`Total hours worked: ${entry.totalHours}`);
 * ```
 */
export declare const clockOut: (employeeId: string, timeEntryId: number, options?: {
    deviceId?: string;
    notes?: string;
}) => Promise<TimeEntry>;
/**
 * Validates time entry for business rules and compliance.
 *
 * @param {TimeEntry} entry - Time entry to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTimeEntry(entry);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateTimeEntry: (entry: TimeEntry) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Retrieves time entries for employee and date range.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<TimeEntry[]>} Time entries
 *
 * @example
 * ```typescript
 * const entries = await getTimeEntries('EMP-12345', new Date('2025-01-01'), new Date('2025-01-15'));
 * ```
 */
export declare const getTimeEntries: (employeeId: string, startDate: Date, endDate: Date) => Promise<TimeEntry[]>;
/**
 * Calculates total hours from time entries with overtime breakdown.
 *
 * @param {TimeEntry[]} entries - Time entries to calculate
 * @param {object} [overtimeRules] - Overtime calculation rules
 * @returns {Promise<{ totalHours: number; regularHours: number; overtimeHours: number; doubleTimeHours: number }>} Hours breakdown
 *
 * @example
 * ```typescript
 * const hours = await calculateTotalHours(entries, { dailyOvertimeThreshold: 8, weeklyOvertimeThreshold: 40 });
 * ```
 */
export declare const calculateTotalHours: (entries: TimeEntry[], overtimeRules?: {
    dailyOvertimeThreshold?: number;
    weeklyOvertimeThreshold?: number;
}) => Promise<{
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
}>;
/**
 * Creates new timesheet for employee and period.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<Timesheet>} Created timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await createTimesheet('EMP-12345', new Date('2025-01-01'), new Date('2025-01-15'));
 * ```
 */
export declare const createTimesheet: (employeeId: string, periodStart: Date, periodEnd: Date) => Promise<Timesheet>;
/**
 * Submits timesheet for approval.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} submittedBy - User submitting
 * @returns {Promise<Timesheet>} Updated timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await submitTimesheet('TS-12345', 'emp.12345');
 * ```
 */
export declare const submitTimesheet: (timesheetId: string, submittedBy: string) => Promise<Timesheet>;
/**
 * Approves timesheet and processes for payroll.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} approvedBy - User approving
 * @param {string} [notes] - Approval notes
 * @returns {Promise<Timesheet>} Approved timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await approveTimesheet('TS-12345', 'mgr.smith');
 * ```
 */
export declare const approveTimesheet: (timesheetId: string, approvedBy: string, notes?: string) => Promise<Timesheet>;
/**
 * Rejects timesheet with reason.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} rejectedBy - User rejecting
 * @param {string} reason - Rejection reason
 * @returns {Promise<Timesheet>} Rejected timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await rejectTimesheet('TS-12345', 'mgr.smith', 'Missing break deductions');
 * ```
 */
export declare const rejectTimesheet: (timesheetId: string, rejectedBy: string, reason: string) => Promise<Timesheet>;
/**
 * Retrieves timesheets for approval queue.
 *
 * @param {string} managerId - Manager identifier
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<Timesheet[]>} Pending timesheets
 *
 * @example
 * ```typescript
 * const pending = await getTimesheetsForApproval('MGR-001', { department: 'Engineering' });
 * ```
 */
export declare const getTimesheetsForApproval: (managerId: string, filters?: any) => Promise<Timesheet[]>;
/**
 * Records daily attendance for employee.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} date - Attendance date
 * @param {object} attendance - Attendance details
 * @returns {Promise<AttendanceRecord>} Created attendance record
 *
 * @example
 * ```typescript
 * const attendance = await recordAttendance('EMP-12345', new Date(), {
 *   status: 'PRESENT',
 *   actualIn: new Date(),
 *   actualOut: new Date()
 * });
 * ```
 */
export declare const recordAttendance: (employeeId: string, date: Date, attendance: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
/**
 * Calculates tardiness based on scheduled vs actual clock in.
 *
 * @param {Date} scheduledIn - Scheduled clock in time
 * @param {Date} actualIn - Actual clock in time
 * @param {number} [gracePeriod=5] - Grace period in minutes
 * @returns {Promise<{ isLate: boolean; tardyMinutes: number; points: number }>} Tardiness calculation
 *
 * @example
 * ```typescript
 * const tardy = await calculateTardiness(
 *   new Date('2025-01-15 09:00'),
 *   new Date('2025-01-15 09:15'),
 *   5
 * );
 * ```
 */
export declare const calculateTardiness: (scheduledIn: Date, actualIn: Date, gracePeriod?: number) => Promise<{
    isLate: boolean;
    tardyMinutes: number;
    points: number;
}>;
/**
 * Retrieves attendance history for employee.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<AttendanceRecord[]>} Attendance records
 *
 * @example
 * ```typescript
 * const history = await getAttendanceHistory('EMP-12345', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare const getAttendanceHistory: (employeeId: string, startDate: Date, endDate: Date) => Promise<AttendanceRecord[]>;
/**
 * Generates attendance summary report.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Attendance summary
 *
 * @example
 * ```typescript
 * const summary = await generateAttendanceSummary('EMP-12345', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateAttendanceSummary: (employeeId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Identifies attendance violations and trends.
 *
 * @param {string} employeeId - Employee identifier
 * @param {number} [lookbackDays=90] - Days to analyze
 * @returns {Promise<Array<{ type: string; severity: string; description: string }>>} Attendance issues
 *
 * @example
 * ```typescript
 * const violations = await identifyAttendanceViolations('EMP-12345', 90);
 * ```
 */
export declare const identifyAttendanceViolations: (employeeId: string, lookbackDays?: number) => Promise<Array<{
    type: string;
    severity: string;
    description: string;
}>>;
/**
 * Records employee absence.
 *
 * @param {string} employeeId - Employee identifier
 * @param {object} absence - Absence details
 * @returns {Promise<AbsenceRecord>} Created absence record
 *
 * @example
 * ```typescript
 * const absence = await recordAbsence('EMP-12345', {
 *   absenceType: 'SICK',
 *   startDate: new Date('2025-01-15'),
 *   endDate: new Date('2025-01-16'),
 *   reason: 'Illness'
 * });
 * ```
 */
export declare const recordAbsence: (employeeId: string, absence: Partial<AbsenceRecord>) => Promise<AbsenceRecord>;
/**
 * Calculates absence balance for employee.
 *
 * @param {string} employeeId - Employee identifier
 * @param {string} absenceType - Type of absence
 * @returns {Promise<{ available: number; used: number; pending: number; remaining: number }>} Absence balance
 *
 * @example
 * ```typescript
 * const balance = await calculateAbsenceBalance('EMP-12345', 'VACATION');
 * console.log(`Remaining vacation: ${balance.remaining} hours`);
 * ```
 */
export declare const calculateAbsenceBalance: (employeeId: string, absenceType: string) => Promise<{
    available: number;
    used: number;
    pending: number;
    remaining: number;
}>;
/**
 * Approves absence request.
 *
 * @param {string} absenceId - Absence ID
 * @param {string} approvedBy - User approving
 * @param {string} [notes] - Approval notes
 * @returns {Promise<AbsenceRecord>} Approved absence
 *
 * @example
 * ```typescript
 * const absence = await approveAbsence('ABS-12345', 'mgr.smith');
 * ```
 */
export declare const approveAbsence: (absenceId: string, approvedBy: string, notes?: string) => Promise<AbsenceRecord>;
/**
 * Denies absence request with reason.
 *
 * @param {string} absenceId - Absence ID
 * @param {string} deniedBy - User denying
 * @param {string} reason - Denial reason
 * @returns {Promise<AbsenceRecord>} Denied absence
 *
 * @example
 * ```typescript
 * const absence = await denyAbsence('ABS-12345', 'mgr.smith', 'Insufficient coverage');
 * ```
 */
export declare const denyAbsence: (absenceId: string, deniedBy: string, reason: string) => Promise<AbsenceRecord>;
/**
 * Retrieves absence requests for approval.
 *
 * @param {string} managerId - Manager identifier
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<AbsenceRecord[]>} Pending absence requests
 *
 * @example
 * ```typescript
 * const pending = await getAbsenceRequestsForApproval('MGR-001', { status: 'PENDING' });
 * ```
 */
export declare const getAbsenceRequestsForApproval: (managerId: string, filters?: any) => Promise<AbsenceRecord[]>;
/**
 * Creates overtime request.
 *
 * @param {string} employeeId - Employee identifier
 * @param {object} overtime - Overtime details
 * @returns {Promise<OvertimeRequest>} Created overtime request
 *
 * @example
 * ```typescript
 * const request = await createOvertimeRequest('EMP-12345', {
 *   workDate: new Date('2025-01-20'),
 *   requestedHours: 4,
 *   justification: 'Project deadline'
 * });
 * ```
 */
export declare const createOvertimeRequest: (employeeId: string, overtime: Partial<OvertimeRequest>) => Promise<OvertimeRequest>;
/**
 * Calculates overtime pay based on hours and rate.
 *
 * @param {number} overtimeHours - Overtime hours
 * @param {number} baseRate - Base hourly rate
 * @param {string} overtimeType - Type of overtime
 * @returns {Promise<{ overtimeHours: number; overtimeRate: number; overtimePay: number }>} Overtime calculation
 *
 * @example
 * ```typescript
 * const pay = await calculateOvertimePay(10, 25, 'REGULAR_OT');
 * console.log(`Overtime pay: $${pay.overtimePay}`);
 * ```
 */
export declare const calculateOvertimePay: (overtimeHours: number, baseRate: number, overtimeType: string) => Promise<{
    overtimeHours: number;
    overtimeRate: number;
    overtimePay: number;
}>;
/**
 * Approves overtime request.
 *
 * @param {string} overtimeId - Overtime request ID
 * @param {string} approvedBy - User approving
 * @returns {Promise<OvertimeRequest>} Approved overtime request
 *
 * @example
 * ```typescript
 * const overtime = await approveOvertimeRequest('OT-12345', 'mgr.smith');
 * ```
 */
export declare const approveOvertimeRequest: (overtimeId: string, approvedBy: string) => Promise<OvertimeRequest>;
/**
 * Validates overtime against company policies.
 *
 * @param {OvertimeRequest} request - Overtime request
 * @param {object} [policies] - Overtime policies
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateOvertimeRequest(request, { maxDailyOT: 4, maxWeeklyOT: 12 });
 * ```
 */
export declare const validateOvertimeRequest: (request: OvertimeRequest, policies?: any) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Retrieves overtime summary for period.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Overtime summary
 *
 * @example
 * ```typescript
 * const summary = await getOvertimeSummary('EMP-12345', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare const getOvertimeSummary: (employeeId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Records break start for employee.
 *
 * @param {string} employeeId - Employee identifier
 * @param {string} breakType - Type of break
 * @returns {Promise<BreakPeriod>} Started break period
 *
 * @example
 * ```typescript
 * const breakPeriod = await startBreak('EMP-12345', 'MEAL');
 * ```
 */
export declare const startBreak: (employeeId: string, breakType: string) => Promise<BreakPeriod>;
/**
 * Records break end and calculates duration.
 *
 * @param {string} breakId - Break ID
 * @returns {Promise<BreakPeriod>} Completed break period
 *
 * @example
 * ```typescript
 * const breakPeriod = await endBreak('BRK-12345');
 * console.log(`Break duration: ${breakPeriod.duration} minutes`);
 * ```
 */
export declare const endBreak: (breakId: string) => Promise<BreakPeriod>;
/**
 * Validates break compliance with labor laws.
 *
 * @param {BreakPeriod[]} breaks - Break periods
 * @param {number} totalHoursWorked - Total hours worked
 * @param {object} [regulations] - Labor law regulations
 * @returns {Promise<{ compliant: boolean; violations: string[] }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await validateBreakCompliance(breaks, 8.5);
 * ```
 */
export declare const validateBreakCompliance: (breaks: BreakPeriod[], totalHoursWorked: number, regulations?: any) => Promise<{
    compliant: boolean;
    violations: string[];
}>;
/**
 * Retrieves break history for employee.
 *
 * @param {string} employeeId - Employee identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<BreakPeriod[]>} Break periods
 *
 * @example
 * ```typescript
 * const breaks = await getBreakHistory('EMP-12345', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare const getBreakHistory: (employeeId: string, startDate: Date, endDate: Date) => Promise<BreakPeriod[]>;
/**
 * Calculates break deductions from total hours.
 *
 * @param {number} totalHours - Total hours worked
 * @param {BreakPeriod[]} breaks - Break periods
 * @returns {Promise<{ grossHours: number; breakDeductions: number; netHours: number }>} Hours calculation
 *
 * @example
 * ```typescript
 * const hours = await calculateBreakDeductions(8.5, breaks);
 * ```
 */
export declare const calculateBreakDeductions: (totalHours: number, breaks: BreakPeriod[]) => Promise<{
    grossHours: number;
    breakDeductions: number;
    netHours: number;
}>;
/**
 * Creates time off request.
 *
 * @param {string} employeeId - Employee identifier
 * @param {object} request - Time off request details
 * @returns {Promise<TimeOffRequest>} Created request
 *
 * @example
 * ```typescript
 * const request = await createTimeOffRequest('EMP-12345', {
 *   requestType: 'VACATION',
 *   startDate: new Date('2025-06-01'),
 *   endDate: new Date('2025-06-05'),
 *   reason: 'Family vacation'
 * });
 * ```
 */
export declare const createTimeOffRequest: (employeeId: string, request: Partial<TimeOffRequest>) => Promise<TimeOffRequest>;
/**
 * Approves time off request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approvedBy - User approving
 * @returns {Promise<TimeOffRequest>} Approved request
 *
 * @example
 * ```typescript
 * const request = await approveTimeOffRequest('TOR-12345', 'mgr.smith');
 * ```
 */
export declare const approveTimeOffRequest: (requestId: string, approvedBy: string) => Promise<TimeOffRequest>;
/**
 * Denies time off request.
 *
 * @param {string} requestId - Request ID
 * @param {string} deniedBy - User denying
 * @param {string} reason - Denial reason
 * @returns {Promise<TimeOffRequest>} Denied request
 *
 * @example
 * ```typescript
 * const request = await denyTimeOffRequest('TOR-12345', 'mgr.smith', 'Insufficient coverage');
 * ```
 */
export declare const denyTimeOffRequest: (requestId: string, deniedBy: string, reason: string) => Promise<TimeOffRequest>;
/**
 * Checks time off balance availability.
 *
 * @param {string} employeeId - Employee identifier
 * @param {string} requestType - Type of time off
 * @param {number} requestedHours - Hours requested
 * @returns {Promise<{ available: boolean; currentBalance: number; projectedBalance: number }>} Balance check
 *
 * @example
 * ```typescript
 * const balance = await checkTimeOffBalance('EMP-12345', 'VACATION', 40);
 * ```
 */
export declare const checkTimeOffBalance: (employeeId: string, requestType: string, requestedHours: number) => Promise<{
    available: boolean;
    currentBalance: number;
    projectedBalance: number;
}>;
/**
 * Retrieves time off calendar for team.
 *
 * @param {string} teamId - Team identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array<{ date: Date; employees: string[] }>>} Time off calendar
 *
 * @example
 * ```typescript
 * const calendar = await getTimeOffCalendar('TEAM-001', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const getTimeOffCalendar: (teamId: string, startDate: Date, endDate: Date) => Promise<Array<{
    date: Date;
    employees: string[];
}>>;
/**
 * Creates attendance policy with rules and thresholds.
 *
 * @param {object} policy - Policy configuration
 * @returns {Promise<AttendancePolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createAttendancePolicy({
 *   policyName: 'Standard Attendance',
 *   policyType: 'PUNCTUALITY',
 *   rules: [{ condition: 'LATE', action: 'ASSIGN_POINTS', points: 0.5 }]
 * });
 * ```
 */
export declare const createAttendancePolicy: (policy: Partial<AttendancePolicy>) => Promise<AttendancePolicy>;
/**
 * Applies attendance policy to record.
 *
 * @param {AttendanceRecord} record - Attendance record
 * @param {AttendancePolicy} policy - Policy to apply
 * @returns {Promise<{ pointsAssessed: number; actions: string[] }>} Policy application result
 *
 * @example
 * ```typescript
 * const result = await applyAttendancePolicy(record, policy);
 * ```
 */
export declare const applyAttendancePolicy: (record: AttendanceRecord, policy: AttendancePolicy) => Promise<{
    pointsAssessed: number;
    actions: string[];
}>;
/**
 * Calculates employee attendance points.
 *
 * @param {string} employeeId - Employee identifier
 * @param {number} [lookbackDays=365] - Days to look back
 * @returns {Promise<{ totalPoints: number; status: string; nextThreshold: number }>} Points calculation
 *
 * @example
 * ```typescript
 * const points = await calculateAttendancePoints('EMP-12345', 365);
 * ```
 */
export declare const calculateAttendancePoints: (employeeId: string, lookbackDays?: number) => Promise<{
    totalPoints: number;
    status: string;
    nextThreshold: number;
}>;
/**
 * Identifies employees exceeding attendance thresholds.
 *
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<Array<{ employeeId: string; points: number; threshold: string }>>} At-risk employees
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAttendanceThresholdViolations({ department: 'Engineering' });
 * ```
 */
export declare const identifyAttendanceThresholdViolations: (filters?: any) => Promise<Array<{
    employeeId: string;
    points: number;
    threshold: string;
}>>;
/**
 * Generates attendance policy compliance report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateAttendancePolicyReport(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateAttendancePolicyReport: (startDate: Date, endDate: Date, filters?: any) => Promise<any>;
/**
 * Creates time correction request.
 *
 * @param {string} employeeId - Employee identifier
 * @param {object} correction - Correction details
 * @returns {Promise<TimeCorrection>} Created correction request
 *
 * @example
 * ```typescript
 * const correction = await createTimeCorrection('EMP-12345', {
 *   correctionType: 'CLOCK_IN',
 *   reason: 'Forgot to clock in',
 *   originalEntry: originalEntry,
 *   correctedEntry: correctedEntry
 * });
 * ```
 */
export declare const createTimeCorrection: (employeeId: string, correction: Partial<TimeCorrection>) => Promise<TimeCorrection>;
/**
 * Approves time correction.
 *
 * @param {string} correctionId - Correction ID
 * @param {string} approvedBy - User approving
 * @returns {Promise<TimeCorrection>} Approved correction
 *
 * @example
 * ```typescript
 * const correction = await approveTimeCorrection('COR-12345', 'mgr.smith');
 * ```
 */
export declare const approveTimeCorrection: (correctionId: string, approvedBy: string) => Promise<TimeCorrection>;
/**
 * Retrieves time corrections for approval.
 *
 * @param {string} managerId - Manager identifier
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<TimeCorrection[]>} Pending corrections
 *
 * @example
 * ```typescript
 * const pending = await getTimeCorrectionsForApproval('MGR-001');
 * ```
 */
export declare const getTimeCorrectionsForApproval: (managerId: string, filters?: any) => Promise<TimeCorrection[]>;
/**
 * Validates time correction request.
 *
 * @param {TimeCorrection} correction - Correction to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTimeCorrection(correction);
 * ```
 */
export declare const validateTimeCorrection: (correction: TimeCorrection) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Exports timesheet data for payroll processing.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {string} format - Export format
 * @returns {Promise<PayrollExport>} Payroll export
 *
 * @example
 * ```typescript
 * const export = await exportTimesheetsForPayroll(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-15'),
 *   'ADP'
 * );
 * ```
 */
export declare const exportTimesheetsForPayroll: (periodStart: Date, periodEnd: Date, format: string) => Promise<PayrollExport>;
/**
 * Validates payroll data for completeness.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePayrollData(new Date('2025-01-01'), new Date('2025-01-15'));
 * ```
 */
export declare const validatePayrollData: (periodStart: Date, periodEnd: Date) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Generates payroll summary report.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<object>} Payroll summary
 *
 * @example
 * ```typescript
 * const summary = await generatePayrollSummary(new Date('2025-01-01'), new Date('2025-01-15'));
 * ```
 */
export declare const generatePayrollSummary: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<any>;
/**
 * Reconciles time data with payroll system.
 *
 * @param {string} payrollBatchId - Payroll batch ID
 * @returns {Promise<{ reconciled: boolean; discrepancies: any[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileWithPayroll('BATCH-12345');
 * ```
 */
export declare const reconcileWithPayroll: (payrollBatchId: string) => Promise<{
    reconciled: boolean;
    discrepancies: any[];
}>;
/**
 * Generates time & attendance analytics dashboard.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<AttendanceAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateAttendanceAnalytics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateAttendanceAnalytics: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<AttendanceAnalytics>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createTimeEntryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            employeeId: string;
            employeeName: string;
            entryDate: Date;
            clockIn: Date;
            clockOut: Date | null;
            breakStart: Date | null;
            breakEnd: Date | null;
            totalHours: number;
            regularHours: number;
            overtimeHours: number;
            status: string;
            location: string | null;
            deviceId: string | null;
            ipAddress: string | null;
            geolocation: Record<string, any> | null;
            notes: string | null;
            timesheetId: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTimesheetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            timesheetId: string;
            employeeId: string;
            employeeName: string;
            department: string;
            periodStart: Date;
            periodEnd: Date;
            totalHours: number;
            regularHours: number;
            overtimeHours: number;
            doubleTimeHours: number;
            ptoHours: number;
            sickHours: number;
            holidayHours: number;
            status: string;
            submittedAt: Date | null;
            submittedBy: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            rejectedBy: string | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            paidAt: Date | null;
            payrollBatch: string | null;
            notes: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAttendanceRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            employeeId: string;
            employeeName: string;
            date: Date;
            scheduleIn: Date;
            scheduleOut: Date;
            actualIn: Date | null;
            actualOut: Date | null;
            status: string;
            tardyMinutes: number;
            earlyDepartureMinutes: number;
            attendancePoints: number;
            excused: boolean;
            excuseReason: string | null;
            notes: string | null;
            shiftId: string | null;
            timeEntryId: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    clockIn: (employeeId: string, options?: {
        location?: string;
        deviceId?: string;
        geolocation?: any;
        ipAddress?: string;
    }) => Promise<TimeEntry>;
    clockOut: (employeeId: string, timeEntryId: number, options?: {
        deviceId?: string;
        notes?: string;
    }) => Promise<TimeEntry>;
    validateTimeEntry: (entry: TimeEntry) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    getTimeEntries: (employeeId: string, startDate: Date, endDate: Date) => Promise<TimeEntry[]>;
    calculateTotalHours: (entries: TimeEntry[], overtimeRules?: {
        dailyOvertimeThreshold?: number;
        weeklyOvertimeThreshold?: number;
    }) => Promise<{
        totalHours: number;
        regularHours: number;
        overtimeHours: number;
        doubleTimeHours: number;
    }>;
    createTimesheet: (employeeId: string, periodStart: Date, periodEnd: Date) => Promise<Timesheet>;
    submitTimesheet: (timesheetId: string, submittedBy: string) => Promise<Timesheet>;
    approveTimesheet: (timesheetId: string, approvedBy: string, notes?: string) => Promise<Timesheet>;
    rejectTimesheet: (timesheetId: string, rejectedBy: string, reason: string) => Promise<Timesheet>;
    getTimesheetsForApproval: (managerId: string, filters?: any) => Promise<Timesheet[]>;
    recordAttendance: (employeeId: string, date: Date, attendance: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
    calculateTardiness: (scheduledIn: Date, actualIn: Date, gracePeriod?: number) => Promise<{
        isLate: boolean;
        tardyMinutes: number;
        points: number;
    }>;
    getAttendanceHistory: (employeeId: string, startDate: Date, endDate: Date) => Promise<AttendanceRecord[]>;
    generateAttendanceSummary: (employeeId: string, startDate: Date, endDate: Date) => Promise<any>;
    identifyAttendanceViolations: (employeeId: string, lookbackDays?: number) => Promise<Array<{
        type: string;
        severity: string;
        description: string;
    }>>;
    recordAbsence: (employeeId: string, absence: Partial<AbsenceRecord>) => Promise<AbsenceRecord>;
    calculateAbsenceBalance: (employeeId: string, absenceType: string) => Promise<{
        available: number;
        used: number;
        pending: number;
        remaining: number;
    }>;
    approveAbsence: (absenceId: string, approvedBy: string, notes?: string) => Promise<AbsenceRecord>;
    denyAbsence: (absenceId: string, deniedBy: string, reason: string) => Promise<AbsenceRecord>;
    getAbsenceRequestsForApproval: (managerId: string, filters?: any) => Promise<AbsenceRecord[]>;
    createOvertimeRequest: (employeeId: string, overtime: Partial<OvertimeRequest>) => Promise<OvertimeRequest>;
    calculateOvertimePay: (overtimeHours: number, baseRate: number, overtimeType: string) => Promise<{
        overtimeHours: number;
        overtimeRate: number;
        overtimePay: number;
    }>;
    approveOvertimeRequest: (overtimeId: string, approvedBy: string) => Promise<OvertimeRequest>;
    validateOvertimeRequest: (request: OvertimeRequest, policies?: any) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    getOvertimeSummary: (employeeId: string, startDate: Date, endDate: Date) => Promise<any>;
    startBreak: (employeeId: string, breakType: string) => Promise<BreakPeriod>;
    endBreak: (breakId: string) => Promise<BreakPeriod>;
    validateBreakCompliance: (breaks: BreakPeriod[], totalHoursWorked: number, regulations?: any) => Promise<{
        compliant: boolean;
        violations: string[];
    }>;
    getBreakHistory: (employeeId: string, startDate: Date, endDate: Date) => Promise<BreakPeriod[]>;
    calculateBreakDeductions: (totalHours: number, breaks: BreakPeriod[]) => Promise<{
        grossHours: number;
        breakDeductions: number;
        netHours: number;
    }>;
    createTimeOffRequest: (employeeId: string, request: Partial<TimeOffRequest>) => Promise<TimeOffRequest>;
    approveTimeOffRequest: (requestId: string, approvedBy: string) => Promise<TimeOffRequest>;
    denyTimeOffRequest: (requestId: string, deniedBy: string, reason: string) => Promise<TimeOffRequest>;
    checkTimeOffBalance: (employeeId: string, requestType: string, requestedHours: number) => Promise<{
        available: boolean;
        currentBalance: number;
        projectedBalance: number;
    }>;
    getTimeOffCalendar: (teamId: string, startDate: Date, endDate: Date) => Promise<Array<{
        date: Date;
        employees: string[];
    }>>;
    createAttendancePolicy: (policy: Partial<AttendancePolicy>) => Promise<AttendancePolicy>;
    applyAttendancePolicy: (record: AttendanceRecord, policy: AttendancePolicy) => Promise<{
        pointsAssessed: number;
        actions: string[];
    }>;
    calculateAttendancePoints: (employeeId: string, lookbackDays?: number) => Promise<{
        totalPoints: number;
        status: string;
        nextThreshold: number;
    }>;
    identifyAttendanceThresholdViolations: (filters?: any) => Promise<Array<{
        employeeId: string;
        points: number;
        threshold: string;
    }>>;
    generateAttendancePolicyReport: (startDate: Date, endDate: Date, filters?: any) => Promise<any>;
    createTimeCorrection: (employeeId: string, correction: Partial<TimeCorrection>) => Promise<TimeCorrection>;
    approveTimeCorrection: (correctionId: string, approvedBy: string) => Promise<TimeCorrection>;
    getTimeCorrectionsForApproval: (managerId: string, filters?: any) => Promise<TimeCorrection[]>;
    validateTimeCorrection: (correction: TimeCorrection) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    exportTimesheetsForPayroll: (periodStart: Date, periodEnd: Date, format: string) => Promise<PayrollExport>;
    validatePayrollData: (periodStart: Date, periodEnd: Date) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    generatePayrollSummary: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<any>;
    reconcileWithPayroll: (payrollBatchId: string) => Promise<{
        reconciled: boolean;
        discrepancies: any[];
    }>;
    generateAttendanceAnalytics: (periodStart: Date, periodEnd: Date, filters?: any) => Promise<AttendanceAnalytics>;
};
export default _default;
//# sourceMappingURL=time-attendance-kit.d.ts.map
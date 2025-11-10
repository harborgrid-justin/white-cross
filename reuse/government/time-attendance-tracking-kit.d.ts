/**
 * LOC: GOVTIME1234567
 * File: /reuse/government/time-attendance-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS government HR controllers
 *   - Backend payroll services
 *   - API time tracking endpoints
 *   - Government compliance modules
 */
import { Sequelize } from 'sequelize';
interface TimeAttendanceContext {
    userId: string;
    employeeId: string;
    departmentId: string;
    agencyId: string;
    supervisorId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
interface TimeEntry {
    id?: string;
    employeeId: string;
    entryDate: string;
    clockInTime?: string;
    clockOutTime?: string;
    breakStartTime?: string;
    breakEndTime?: string;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
    totalHours: number;
    entryType: TimeEntryType;
    entryMethod: EntryMethod;
    workLocation?: string;
    projectCode?: string;
    costCenter?: string;
    activityCode?: string;
    biometricVerified: boolean;
    gpsLocation?: GpsCoordinates;
    ipAddress?: string;
    deviceId?: string;
    status: TimeEntryStatus;
    approvedBy?: string;
    approvedAt?: string;
    rejectedReason?: string;
    notes?: string;
    attachments?: string[];
    metadata?: Record<string, any>;
}
interface AttendanceRecord {
    id?: string;
    employeeId: string;
    attendanceDate: string;
    shiftId?: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    attendanceStatus: AttendanceStatus;
    lateMinutes: number;
    earlyDepartureMinutes: number;
    absentReason?: string;
    leaveRequestId?: string;
    excused: boolean;
    excusedBy?: string;
    excusedReason?: string;
    location?: string;
    biometricCheckIn: boolean;
    biometricCheckOut: boolean;
    notes?: string;
    metadata?: Record<string, any>;
}
interface LeaveRequest {
    id?: string;
    requestNumber: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalHours: number;
    reason: string;
    status: LeaveRequestStatus;
    submittedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    leaveBalance: LeaveBalance;
    supportingDocuments?: string[];
    returnToWorkDate?: string;
    workflowStage: number;
    approvalChain: ApprovalStep[];
    metadata?: Record<string, any>;
}
interface LeaveBalance {
    leaveType: LeaveType;
    employeeId: string;
    fiscalYear: number;
    accrued: number;
    used: number;
    pending: number;
    available: number;
    carryOver: number;
    maxAccrual: number;
    accrualRate: number;
    lastAccrualDate?: string;
    expirationDate?: string;
}
interface ApprovalStep {
    level: number;
    approverId: string;
    approverName: string;
    approverRole: string;
    status: ApprovalStatus;
    approvedAt?: string;
    rejectedAt?: string;
    comments?: string;
    delegatedTo?: string;
    notifiedAt?: string;
}
interface ShiftSchedule {
    id?: string;
    scheduleId: string;
    employeeId: string;
    shiftDate: string;
    shiftType: ShiftType;
    startTime: string;
    endTime: string;
    breakDuration: number;
    department: string;
    location: string;
    supervisorId: string;
    status: ScheduleStatus;
    notes?: string;
    swapRequestId?: string;
    coverageRequired: boolean;
    skillsRequired?: string[];
    metadata?: Record<string, any>;
}
interface OvertimeRequest {
    id?: string;
    requestNumber: string;
    employeeId: string;
    requestDate: string;
    workDate: string;
    estimatedHours: number;
    actualHours?: number;
    overtimeType: OvertimeType;
    justification: string;
    status: OvertimeStatus;
    approvedBy?: string;
    approvedAt?: string;
    rejectedReason?: string;
    flsaExempt: boolean;
    compensationType: CompensationType;
    timeEntryId?: string;
    metadata?: Record<string, any>;
}
interface TimesheetPeriod {
    id?: string;
    periodNumber: string;
    payPeriodType: PayPeriodType;
    startDate: string;
    endDate: string;
    fiscalYear: number;
    fiscalPeriod: number;
    status: PeriodStatus;
    submissionDeadline: string;
    paymentDate: string;
    isClosed: boolean;
    closedBy?: string;
    closedAt?: string;
    metadata?: Record<string, any>;
}
interface Timesheet {
    id?: string;
    timesheetNumber: string;
    employeeId: string;
    periodId: string;
    periodStartDate: string;
    periodEndDate: string;
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalCompTime: number;
    totalLeaveHours: number;
    status: TimesheetStatus;
    timeEntries: TimeEntry[];
    leaveEntries: LeaveEntry[];
    submittedAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    rejectedReason?: string;
    certificationSignature?: string;
    certifiedAt?: string;
    auditLog: AuditEntry[];
    metadata?: Record<string, any>;
}
interface LeaveEntry {
    leaveType: LeaveType;
    date: string;
    hours: number;
    leaveRequestId?: string;
}
interface BiometricEvent {
    id?: string;
    eventId: string;
    employeeId: string;
    eventType: BiometricEventType;
    timestamp: string;
    deviceId: string;
    deviceLocation: string;
    biometricType: BiometricType;
    verificationResult: VerificationResult;
    confidence: number;
    temperature?: number;
    maskDetected?: boolean;
    timeEntryId?: string;
    attendanceRecordId?: string;
    metadata?: Record<string, any>;
}
interface HolidayCalendar {
    id?: string;
    holidayName: string;
    holidayDate: string;
    fiscalYear: number;
    holidayType: HolidayType;
    observedDate: string;
    federalHoliday: boolean;
    stateHoliday: boolean;
    localHoliday: boolean;
    agencyId?: string;
    paidHoliday: boolean;
    eligibilityRules?: string[];
    metadata?: Record<string, any>;
}
interface CompensatoryTime {
    id?: string;
    employeeId: string;
    earnedDate: string;
    hoursEarned: number;
    hoursUsed: number;
    hoursAvailable: number;
    expirationDate: string;
    reason: string;
    overtimeRequestId?: string;
    approvedBy: string;
    approvedAt: string;
    useByDate: string;
    flsaCompliant: boolean;
    metadata?: Record<string, any>;
}
interface FlsaCompliance {
    employeeId: string;
    weekStartDate: string;
    weekEndDate: string;
    regularHours: number;
    overtimeHours: number;
    flsaExempt: boolean;
    exemptionType?: FlsaExemptionType;
    weeklyThreshold: number;
    dailyThreshold: number;
    violations: FlsaViolation[];
    complianceStatus: ComplianceStatus;
    reviewedBy?: string;
    reviewedAt?: string;
}
interface FlsaViolation {
    violationType: string;
    description: string;
    severity: ViolationSeverity;
    detectedDate: string;
    resolvedDate?: string;
    resolution?: string;
}
interface GpsCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
}
interface AuditEntry {
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
interface TimeAttendanceReport {
    reportType: string;
    reportPeriod: {
        startDate: string;
        endDate: string;
    };
    generatedAt: string;
    generatedBy: string;
    filters: Record<string, any>;
    data: any[];
    summary: Record<string, any>;
    metadata?: Record<string, any>;
}
type TimeEntryType = 'regular' | 'overtime' | 'comp_time' | 'leave' | 'holiday' | 'training' | 'jury_duty' | 'military';
type EntryMethod = 'manual' | 'biometric' | 'web' | 'mobile' | 'phone' | 'kiosk' | 'import';
type TimeEntryStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'modified';
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'on_leave' | 'holiday' | 'remote' | 'field';
type LeaveType = 'annual' | 'sick' | 'personal' | 'military' | 'jury_duty' | 'bereavement' | 'fmla' | 'unpaid' | 'administrative' | 'compensatory';
type LeaveRequestStatus = 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_use' | 'completed';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'auto_approved' | 'expired';
type ShiftType = 'day' | 'evening' | 'night' | 'rotating' | 'split' | 'on_call' | 'flex';
type ScheduleStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'swap_pending' | 'covered';
type OvertimeType = 'pre_approved' | 'emergency' | 'mandatory' | 'voluntary';
type OvertimeStatus = 'requested' | 'pending' | 'approved' | 'denied' | 'completed';
type CompensationType = 'overtime_pay' | 'comp_time' | 'straight_time';
type PayPeriodType = 'weekly' | 'biweekly' | 'semi_monthly' | 'monthly';
type PeriodStatus = 'upcoming' | 'open' | 'closing' | 'closed' | 'processing' | 'finalized';
type TimesheetStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'certified' | 'processed';
type BiometricEventType = 'clock_in' | 'clock_out' | 'break_start' | 'break_end' | 'access_granted' | 'access_denied';
type BiometricType = 'fingerprint' | 'facial_recognition' | 'iris_scan' | 'palm_vein' | 'badge' | 'pin';
type VerificationResult = 'verified' | 'failed' | 'partial' | 'override';
type HolidayType = 'federal' | 'state' | 'local' | 'agency_specific' | 'religious' | 'custom';
type FlsaExemptionType = 'executive' | 'administrative' | 'professional' | 'computer' | 'outside_sales' | 'none';
type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'under_review';
type ViolationSeverity = 'low' | 'medium' | 'high' | 'critical';
/**
 * Sequelize model for Time Entries with biometric verification and approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TimeEntry model
 *
 * @example
 * ```typescript
 * const TimeEntry = createTimeEntryModel(sequelize);
 * const entry = await TimeEntry.create({
 *   employeeId: 'EMP123',
 *   entryDate: '2025-01-15',
 *   clockInTime: '08:00:00',
 *   clockOutTime: '17:00:00',
 *   regularHours: 8.0,
 *   status: 'submitted'
 * });
 * ```
 */
export declare const createTimeEntryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        employeeId: string;
        entryDate: Date;
        clockInTime: Date | null;
        clockOutTime: Date | null;
        breakStartTime: Date | null;
        breakEndTime: Date | null;
        regularHours: number;
        overtimeHours: number;
        doubleTimeHours: number;
        totalHours: number;
        entryType: string;
        entryMethod: string;
        workLocation: string | null;
        projectCode: string | null;
        costCenter: string | null;
        activityCode: string | null;
        biometricVerified: boolean;
        gpsLocation: Record<string, any> | null;
        ipAddress: string | null;
        deviceId: string | null;
        status: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        notes: string | null;
        attachments: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Leave Requests with multi-level approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveRequest model
 *
 * @example
 * ```typescript
 * const LeaveRequest = createLeaveRequestModel(sequelize);
 * const leave = await LeaveRequest.create({
 *   requestNumber: 'LV-2025-001234',
 *   employeeId: 'EMP123',
 *   leaveType: 'annual',
 *   startDate: '2025-02-10',
 *   endDate: '2025-02-14',
 *   totalDays: 5,
 *   status: 'submitted'
 * });
 * ```
 */
export declare const createLeaveRequestModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        requestNumber: string;
        employeeId: string;
        leaveType: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        totalHours: number;
        reason: string;
        status: string;
        submittedAt: Date;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedBy: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        leaveBalance: Record<string, any>;
        supportingDocuments: string[];
        returnToWorkDate: Date | null;
        workflowStage: number;
        approvalChain: ApprovalStep[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Timesheets with certification and payroll integration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Timesheet model
 *
 * @example
 * ```typescript
 * const Timesheet = createTimesheetModel(sequelize);
 * const timesheet = await Timesheet.create({
 *   timesheetNumber: 'TS-2025-PP01-EMP123',
 *   employeeId: 'EMP123',
 *   periodId: 'PP-2025-01',
 *   periodStartDate: '2025-01-01',
 *   periodEndDate: '2025-01-14',
 *   status: 'draft'
 * });
 * ```
 */
export declare const createTimesheetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        timesheetNumber: string;
        employeeId: string;
        periodId: string;
        periodStartDate: Date;
        periodEndDate: Date;
        totalRegularHours: number;
        totalOvertimeHours: number;
        totalCompTime: number;
        totalLeaveHours: number;
        status: string;
        timeEntries: TimeEntry[];
        leaveEntries: LeaveEntry[];
        submittedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        certificationSignature: string | null;
        certifiedAt: Date | null;
        auditLog: AuditEntry[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Biometric Events with device tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BiometricEvent model
 *
 * @example
 * ```typescript
 * const BiometricEvent = createBiometricEventModel(sequelize);
 * const event = await BiometricEvent.create({
 *   eventId: 'BIO-2025-001234',
 *   employeeId: 'EMP123',
 *   eventType: 'clock_in',
 *   timestamp: new Date(),
 *   deviceId: 'DEVICE-001',
 *   biometricType: 'fingerprint',
 *   verificationResult: 'verified'
 * });
 * ```
 */
export declare const createBiometricEventModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        eventId: string;
        employeeId: string;
        eventType: string;
        timestamp: Date;
        deviceId: string;
        deviceLocation: string;
        biometricType: string;
        verificationResult: string;
        confidence: number;
        temperature: number | null;
        maskDetected: boolean | null;
        timeEntryId: number | null;
        attendanceRecordId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates employee time entry with automatic hour calculations.
 *
 * @param {Partial<TimeEntry>} entryData - Time entry data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeEntry>} Created time entry
 *
 * @example
 * ```typescript
 * const entry = await createTimeEntry({
 *   employeeId: 'EMP123',
 *   entryDate: '2025-01-15',
 *   clockInTime: '08:00:00',
 *   clockOutTime: '17:00:00',
 *   entryMethod: 'biometric'
 * }, context);
 * ```
 */
export declare function createTimeEntry(entryData: Partial<TimeEntry>, context: TimeAttendanceContext): Promise<TimeEntry>;
/**
 * Validates time entry against FLSA rules and agency policies.
 *
 * @param {TimeEntry} entry - Time entry to validate
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<{isValid: boolean; violations: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTimeEntry(entry, context);
 * if (!validation.isValid) {
 *   console.log('Violations:', validation.violations);
 * }
 * ```
 */
export declare function validateTimeEntry(entry: TimeEntry, context: TimeAttendanceContext): Promise<{
    isValid: boolean;
    violations: string[];
}>;
/**
 * Approves time entry with supervisor authorization.
 *
 * @param {string} entryId - Time entry ID
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeEntry>} Approved time entry
 *
 * @example
 * ```typescript
 * const approved = await approveTimeEntry('ENTRY123', 'SUP456', 'Approved', context);
 * ```
 */
export declare function approveTimeEntry(entryId: string, approverId: string, comments: string | undefined, context: TimeAttendanceContext): Promise<TimeEntry>;
/**
 * Imports time entries from biometric system or external source.
 *
 * @param {TimeEntry[]} entries - Time entries to import
 * @param {string} source - Import source identifier
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<{imported: number; failed: number; errors: any[]}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importTimeEntries(biometricData, 'BIOMETRIC-SYSTEM-001', context);
 * console.log(`Imported: ${result.imported}, Failed: ${result.failed}`);
 * ```
 */
export declare function importTimeEntries(entries: TimeEntry[], source: string, context: TimeAttendanceContext): Promise<{
    imported: number;
    failed: number;
    errors: any[];
}>;
/**
 * Calculates work hours between clock in/out times excluding breaks.
 *
 * @param {string | undefined} clockIn - Clock in time
 * @param {string | undefined} clockOut - Clock out time
 * @param {string | undefined} breakStart - Break start time
 * @param {string | undefined} breakEnd - Break end time
 * @returns {number} Total work hours
 *
 * @example
 * ```typescript
 * const hours = calculateWorkHours('08:00', '17:00', '12:00', '13:00');
 * // Returns 8.0
 * ```
 */
export declare function calculateWorkHours(clockIn: string | undefined, clockOut: string | undefined, breakStart: string | undefined, breakEnd: string | undefined): number;
/**
 * Checks for overlapping time entries for same employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} date - Entry date
 * @param {string | undefined} clockIn - Clock in time
 * @param {string | undefined} clockOut - Clock out time
 * @returns {Promise<boolean>} True if overlap exists
 *
 * @example
 * ```typescript
 * const hasOverlap = await checkOverlappingTimeEntries('EMP123', '2025-01-15', '08:00', '17:00');
 * ```
 */
export declare function checkOverlappingTimeEntries(employeeId: string, date: string, clockIn: string | undefined, clockOut: string | undefined): Promise<boolean>;
/**
 * Submits time entry for approval workflow.
 *
 * @param {string} entryId - Time entry ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeEntry>} Submitted time entry
 *
 * @example
 * ```typescript
 * const submitted = await submitTimeEntry('ENTRY123', context);
 * ```
 */
export declare function submitTimeEntry(entryId: string, context: TimeAttendanceContext): Promise<TimeEntry>;
/**
 * Modifies existing time entry before approval.
 *
 * @param {string} entryId - Time entry ID
 * @param {Partial<TimeEntry>} updates - Updated fields
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeEntry>} Modified time entry
 *
 * @example
 * ```typescript
 * const modified = await modifyTimeEntry('ENTRY123', {
 *   clockOutTime: '18:00:00',
 *   notes: 'Worked late for project deadline'
 * }, context);
 * ```
 */
export declare function modifyTimeEntry(entryId: string, updates: Partial<TimeEntry>, context: TimeAttendanceContext): Promise<TimeEntry>;
/**
 * Creates leave request with balance validation.
 *
 * @param {Partial<LeaveRequest>} leaveData - Leave request data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<LeaveRequest>} Created leave request
 *
 * @example
 * ```typescript
 * const leave = await createLeaveRequest({
 *   employeeId: 'EMP123',
 *   leaveType: 'annual',
 *   startDate: '2025-02-10',
 *   endDate: '2025-02-14',
 *   reason: 'Family vacation'
 * }, context);
 * ```
 */
export declare function createLeaveRequest(leaveData: Partial<LeaveRequest>, context: TimeAttendanceContext): Promise<LeaveRequest>;
/**
 * Approves leave request with supervisor authorization.
 *
 * @param {string} requestId - Leave request ID
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<LeaveRequest>} Approved leave request
 *
 * @example
 * ```typescript
 * const approved = await approveLeaveRequest('LV-2025-001234', 'SUP456', 'Approved', context);
 * ```
 */
export declare function approveLeaveRequest(requestId: string, approverId: string, comments: string | undefined, context: TimeAttendanceContext): Promise<LeaveRequest>;
/**
 * Rejects leave request with reason.
 *
 * @param {string} requestId - Leave request ID
 * @param {string} rejecterId - Rejecter user ID
 * @param {string} reason - Rejection reason
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<LeaveRequest>} Rejected leave request
 *
 * @example
 * ```typescript
 * const rejected = await rejectLeaveRequest('LV-2025-001234', 'SUP456', 'Insufficient staffing', context);
 * ```
 */
export declare function rejectLeaveRequest(requestId: string, rejecterId: string, reason: string, context: TimeAttendanceContext): Promise<LeaveRequest>;
/**
 * Calculates employee leave balance for specified leave type.
 *
 * @param {string} employeeId - Employee ID
 * @param {LeaveType} leaveType - Type of leave
 * @returns {Promise<LeaveBalance>} Leave balance details
 *
 * @example
 * ```typescript
 * const balance = await getLeaveBalance('EMP123', 'annual');
 * console.log(`Available: ${balance.available} hours`);
 * ```
 */
export declare function getLeaveBalance(employeeId: string, leaveType: LeaveType): Promise<LeaveBalance>;
/**
 * Processes leave accrual for pay period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} periodId - Pay period ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<Record<LeaveType, number>>} Accrued hours by leave type
 *
 * @example
 * ```typescript
 * const accrued = await processLeaveAccrual('EMP123', 'PP-2025-01', context);
 * // { annual: 4.62, sick: 4.00 }
 * ```
 */
export declare function processLeaveAccrual(employeeId: string, periodId: string, context: TimeAttendanceContext): Promise<Record<string, number>>;
/**
 * Cancels approved leave request before leave start date.
 *
 * @param {string} requestId - Leave request ID
 * @param {string} reason - Cancellation reason
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<LeaveRequest>} Cancelled leave request
 *
 * @example
 * ```typescript
 * const cancelled = await cancelLeaveRequest('LV-2025-001234', 'Travel plans changed', context);
 * ```
 */
export declare function cancelLeaveRequest(requestId: string, reason: string, context: TimeAttendanceContext): Promise<LeaveRequest>;
/**
 * Validates leave request against balance and policies.
 *
 * @param {LeaveRequest} request - Leave request to validate
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLeaveRequest(request, context);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare function validateLeaveRequest(request: LeaveRequest, context: TimeAttendanceContext): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Generates unique leave request number.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<string>} Unique request number
 *
 * @example
 * ```typescript
 * const requestNumber = await generateLeaveRequestNumber('EMP123');
 * // 'LV-2025-001234'
 * ```
 */
export declare function generateLeaveRequestNumber(employeeId: string): Promise<string>;
/**
 * Creates overtime request with pre-approval workflow.
 *
 * @param {Partial<OvertimeRequest>} overtimeData - Overtime request data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<OvertimeRequest>} Created overtime request
 *
 * @example
 * ```typescript
 * const overtime = await createOvertimeRequest({
 *   employeeId: 'EMP123',
 *   workDate: '2025-01-20',
 *   estimatedHours: 4,
 *   justification: 'Project deadline',
 *   overtimeType: 'pre_approved'
 * }, context);
 * ```
 */
export declare function createOvertimeRequest(overtimeData: Partial<OvertimeRequest>, context: TimeAttendanceContext): Promise<OvertimeRequest>;
/**
 * Calculates overtime hours and pay based on FLSA rules.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} weekStartDate - Week start date
 * @param {number} totalHours - Total hours worked in week
 * @returns {Promise<{overtimeHours: number; overtimePay: number; doubleTimeHours: number}>} Overtime calculation
 *
 * @example
 * ```typescript
 * const ot = await calculateOvertimePay('EMP123', '2025-01-13', 45);
 * // { overtimeHours: 5, overtimePay: 187.50, doubleTimeHours: 0 }
 * ```
 */
export declare function calculateOvertimePay(employeeId: string, weekStartDate: string, totalHours: number): Promise<{
    overtimeHours: number;
    overtimePay: number;
    doubleTimeHours: number;
}>;
/**
 * Tracks compensatory time earned and usage.
 *
 * @param {Partial<CompensatoryTime>} compTimeData - Comp time data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<CompensatoryTime>} Compensatory time record
 *
 * @example
 * ```typescript
 * const compTime = await trackCompensatoryTime({
 *   employeeId: 'EMP123',
 *   hoursEarned: 4,
 *   reason: 'Weekend work for emergency maintenance',
 *   expirationDate: '2025-12-31'
 * }, context);
 * ```
 */
export declare function trackCompensatoryTime(compTimeData: Partial<CompensatoryTime>, context: TimeAttendanceContext): Promise<CompensatoryTime>;
/**
 * Uses compensatory time for time off.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} hours - Hours to use
 * @param {string} useDate - Date of usage
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<CompensatoryTime>} Updated comp time record
 *
 * @example
 * ```typescript
 * const used = await useCompensatoryTime('EMP123', 8, '2025-02-15', context);
 * ```
 */
export declare function useCompensatoryTime(employeeId: string, hours: number, useDate: string, context: TimeAttendanceContext): Promise<CompensatoryTime>;
/**
 * Gets available compensatory time balance.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number>} Available comp time hours
 *
 * @example
 * ```typescript
 * const available = await getAvailableCompTime('EMP123');
 * console.log(`Available: ${available} hours`);
 * ```
 */
export declare function getAvailableCompTime(employeeId: string): Promise<number>;
/**
 * Validates overtime request against FLSA and agency policies.
 *
 * @param {OvertimeRequest} request - Overtime request
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<{isValid: boolean; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateOvertimeRequest(request, context);
 * ```
 */
export declare function validateOvertimeRequest(request: OvertimeRequest, context: TimeAttendanceContext): Promise<{
    isValid: boolean;
    warnings: string[];
}>;
/**
 * Approves overtime request.
 *
 * @param {string} requestId - Overtime request ID
 * @param {string} approverId - Approver user ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<OvertimeRequest>} Approved overtime request
 *
 * @example
 * ```typescript
 * const approved = await approveOvertimeRequest('OT-2025-001234', 'SUP456', context);
 * ```
 */
export declare function approveOvertimeRequest(requestId: string, approverId: string, context: TimeAttendanceContext): Promise<OvertimeRequest>;
/**
 * Generates unique overtime request number.
 *
 * @returns {Promise<string>} Unique request number
 *
 * @example
 * ```typescript
 * const requestNumber = await generateOvertimeRequestNumber();
 * // 'OT-2025-001234'
 * ```
 */
export declare function generateOvertimeRequestNumber(): Promise<string>;
/**
 * Creates timesheet for pay period with time entries.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} periodId - Pay period ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<Timesheet>} Created timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await createTimesheet('EMP123', 'PP-2025-01', context);
 * ```
 */
export declare function createTimesheet(employeeId: string, periodId: string, context: TimeAttendanceContext): Promise<Timesheet>;
/**
 * Submits timesheet for approval.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<Timesheet>} Submitted timesheet
 *
 * @example
 * ```typescript
 * const submitted = await submitTimesheet('TS-2025-PP01-EMP123', context);
 * ```
 */
export declare function submitTimesheet(timesheetId: string, context: TimeAttendanceContext): Promise<Timesheet>;
/**
 * Approves timesheet for payroll processing.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} approverId - Approver user ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<Timesheet>} Approved timesheet
 *
 * @example
 * ```typescript
 * const approved = await approveTimesheet('TS-2025-PP01-EMP123', 'SUP456', context);
 * ```
 */
export declare function approveTimesheet(timesheetId: string, approverId: string, context: TimeAttendanceContext): Promise<Timesheet>;
/**
 * Certifies timesheet with employee signature.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} signature - Digital signature data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<Timesheet>} Certified timesheet
 *
 * @example
 * ```typescript
 * const certified = await certifyTimesheet('TS-2025-PP01-EMP123', signatureData, context);
 * ```
 */
export declare function certifyTimesheet(timesheetId: string, signature: string, context: TimeAttendanceContext): Promise<Timesheet>;
/**
 * Generates time and attendance report.
 *
 * @param {string} reportType - Type of report
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Record<string, any>} filters - Report filters
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeAttendanceReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generateTimeAttendanceReport(
 *   'attendance_summary',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   { departmentId: 'DEPT-123' },
 *   context
 * );
 * ```
 */
export declare function generateTimeAttendanceReport(reportType: string, startDate: Date, endDate: Date, filters: Record<string, any>, context: TimeAttendanceContext): Promise<TimeAttendanceReport>;
/**
 * Validates timesheet for completeness and accuracy.
 *
 * @param {Timesheet} timesheet - Timesheet to validate
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTimesheet(timesheet, context);
 * ```
 */
export declare function validateTimesheet(timesheet: Timesheet, context: TimeAttendanceContext): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Exports timesheet to payroll system format.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} format - Export format (csv, json, xml)
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportTimesheetToPayroll('TS-2025-PP01-EMP123', 'csv', context);
 * ```
 */
export declare function exportTimesheetToPayroll(timesheetId: string, format: string, context: TimeAttendanceContext): Promise<string>;
/**
 * Gets pay period information.
 *
 * @param {string} periodId - Pay period ID
 * @returns {Promise<TimesheetPeriod>} Pay period details
 *
 * @example
 * ```typescript
 * const period = await getPayPeriod('PP-2025-01');
 * ```
 */
export declare function getPayPeriod(periodId: string): Promise<TimesheetPeriod>;
/**
 * Validates FLSA compliance for employee work week.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} weekStartDate - Week start date
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<FlsaCompliance>} FLSA compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateFlsaCompliance('EMP123', '2025-01-13', context);
 * if (compliance.complianceStatus === 'violation') {
 *   console.log('Violations:', compliance.violations);
 * }
 * ```
 */
export declare function validateFlsaCompliance(employeeId: string, weekStartDate: string, context: TimeAttendanceContext): Promise<FlsaCompliance>;
/**
 * Checks employee FLSA exemption status.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<boolean>} True if FLSA exempt
 *
 * @example
 * ```typescript
 * const isExempt = await checkFlsaExemptStatus('EMP123');
 * ```
 */
export declare function checkFlsaExemptStatus(employeeId: string): Promise<boolean>;
/**
 * Calculates weekly hours worked for FLSA compliance.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} weekStartDate - Week start date
 * @returns {Promise<number>} Total weekly hours
 *
 * @example
 * ```typescript
 * const hours = await getWeeklyHours('EMP123', '2025-01-13');
 * console.log(`Weekly hours: ${hours}`);
 * ```
 */
export declare function getWeeklyHours(employeeId: string, weekStartDate: string): Promise<number>;
/**
 * Generates FLSA compliance report for audit.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<TimeAttendanceReport>} FLSA compliance report
 *
 * @example
 * ```typescript
 * const report = await generateFlsaComplianceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   context
 * );
 * ```
 */
export declare function generateFlsaComplianceReport(startDate: Date, endDate: Date, context: TimeAttendanceContext): Promise<TimeAttendanceReport>;
/**
 * Detects potential FLSA violations across all employees.
 *
 * @param {string} weekStartDate - Week start date
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<FlsaCompliance[]>} List of compliance issues
 *
 * @example
 * ```typescript
 * const violations = await detectFlsaViolations('2025-01-13', context);
 * ```
 */
export declare function detectFlsaViolations(weekStartDate: string, context: TimeAttendanceContext): Promise<FlsaCompliance[]>;
/**
 * Calculates FLSA overtime threshold for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodType - Pay period type
 * @returns {Promise<number>} Overtime threshold hours
 *
 * @example
 * ```typescript
 * const threshold = await calculateFlsaOvertimeThreshold('EMP123', 'biweekly');
 * // Returns 80 for biweekly period
 * ```
 */
export declare function calculateFlsaOvertimeThreshold(employeeId: string, payPeriodType: PayPeriodType): Promise<number>;
/**
 * Tracks FLSA exemption changes and effective dates.
 *
 * @param {string} employeeId - Employee ID
 * @param {FlsaExemptionType} exemptionType - New exemption type
 * @param {string} effectiveDate - Effective date
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<boolean>} Update success
 *
 * @example
 * ```typescript
 * await updateFlsaExemptionStatus('EMP123', 'administrative', '2025-02-01', context);
 * ```
 */
export declare function updateFlsaExemptionStatus(employeeId: string, exemptionType: FlsaExemptionType, effectiveDate: string, context: TimeAttendanceContext): Promise<boolean>;
/**
 * Validates FLSA recordkeeping requirements compliance.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @returns {Promise<{compliant: boolean; missingRecords: string[]}>} Audit result
 *
 * @example
 * ```typescript
 * const audit = await auditFlsaRecordkeeping('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function auditFlsaRecordkeeping(employeeId: string, startDate: Date, endDate: Date): Promise<{
    compliant: boolean;
    missingRecords: string[];
}>;
/**
 * Records employee attendance with biometric verification.
 *
 * @param {Partial<AttendanceRecord>} attendanceData - Attendance data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<AttendanceRecord>} Created attendance record
 *
 * @example
 * ```typescript
 * const attendance = await recordAttendance({
 *   employeeId: 'EMP123',
 *   attendanceDate: '2025-01-15',
 *   scheduledStartTime: '08:00:00',
 *   actualStartTime: '08:05:00',
 *   attendanceStatus: 'late',
 *   biometricCheckIn: true
 * }, context);
 * ```
 */
export declare function recordAttendance(attendanceData: Partial<AttendanceRecord>, context: TimeAttendanceContext): Promise<AttendanceRecord>;
/**
 * Creates shift schedule for employee.
 *
 * @param {Partial<ShiftSchedule>} scheduleData - Schedule data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<ShiftSchedule>} Created shift schedule
 *
 * @example
 * ```typescript
 * const shift = await createShiftSchedule({
 *   employeeId: 'EMP123',
 *   shiftDate: '2025-01-20',
 *   shiftType: 'day',
 *   startTime: '08:00:00',
 *   endTime: '17:00:00',
 *   department: 'Operations'
 * }, context);
 * ```
 */
export declare function createShiftSchedule(scheduleData: Partial<ShiftSchedule>, context: TimeAttendanceContext): Promise<ShiftSchedule>;
/**
 * Processes biometric clock in/out event.
 *
 * @param {Partial<BiometricEvent>} eventData - Biometric event data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<BiometricEvent>} Created biometric event
 *
 * @example
 * ```typescript
 * const event = await processBiometricEvent({
 *   employeeId: 'EMP123',
 *   eventType: 'clock_in',
 *   deviceId: 'DEVICE-001',
 *   biometricType: 'fingerprint',
 *   verificationResult: 'verified',
 *   confidence: 98.5
 * }, context);
 * ```
 */
export declare function processBiometricEvent(eventData: Partial<BiometricEvent>, context: TimeAttendanceContext): Promise<BiometricEvent>;
/**
 * Marks absence as excused with documentation.
 *
 * @param {string} attendanceId - Attendance record ID
 * @param {string} reason - Excuse reason
 * @param {string} excusedBy - Authorizing user ID
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<AttendanceRecord>} Updated attendance record
 *
 * @example
 * ```typescript
 * const excused = await excuseAbsence('ATT-123', 'Medical appointment', 'SUP456', context);
 * ```
 */
export declare function excuseAbsence(attendanceId: string, reason: string, excusedBy: string, context: TimeAttendanceContext): Promise<AttendanceRecord>;
/**
 * Generates attendance summary report.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Attendance summary
 *
 * @example
 * ```typescript
 * const summary = await generateAttendanceSummary('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function generateAttendanceSummary(employeeId: string, startDate: Date, endDate: Date): Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
}>;
/**
 * Manages holiday calendar for agency.
 *
 * @param {Partial<HolidayCalendar>} holidayData - Holiday data
 * @param {TimeAttendanceContext} context - Execution context
 * @returns {Promise<HolidayCalendar>} Created holiday
 *
 * @example
 * ```typescript
 * const holiday = await manageHolidayCalendar({
 *   holidayName: 'Independence Day',
 *   holidayDate: '2025-07-04',
 *   fiscalYear: 2025,
 *   holidayType: 'federal',
 *   federalHoliday: true,
 *   paidHoliday: true
 * }, context);
 * ```
 */
export declare function manageHolidayCalendar(holidayData: Partial<HolidayCalendar>, context: TimeAttendanceContext): Promise<HolidayCalendar>;
/**
 * Calculates tardiness and early departure minutes.
 *
 * @param {string} scheduledTime - Scheduled time
 * @param {string} actualTime - Actual time
 * @returns {number} Minutes late/early
 *
 * @example
 * ```typescript
 * const late = calculateLateMinutes('08:00:00', '08:15:00');
 * // Returns 15
 * ```
 */
export declare function calculateLateMinutes(scheduledTime: string, actualTime: string): number;
/**
 * Calculates business days between two dates excluding weekends and holidays.
 *
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {number} Number of business days
 *
 * @example
 * ```typescript
 * const days = calculateBusinessDays('2025-01-13', '2025-01-17');
 * // Returns 5
 * ```
 */
export declare function calculateBusinessDays(startDate: string, endDate: string): number;
/**
 * Formats hours for display.
 *
 * @param {number} hours - Hours to format
 * @returns {string} Formatted hours string
 *
 * @example
 * ```typescript
 * const formatted = formatHours(8.5);
 * // '8.50 hours'
 * ```
 */
export declare function formatHours(hours: number): string;
/**
 * Parses time string to minutes.
 *
 * @param {string} timeString - Time string (HH:MM:SS or HH:MM)
 * @returns {number} Total minutes
 *
 * @example
 * ```typescript
 * const minutes = parseTimeToMinutes('08:30:00');
 * // Returns 510
 * ```
 */
export declare function parseTimeToMinutes(timeString: string): number;
/**
 * NestJS controller for time and attendance management.
 */
export declare class TimeAttendanceController {
    createEntry(entryData: any): Promise<TimeEntry>;
    createLeave(leaveData: any): Promise<LeaveRequest>;
    getBalance(employeeId: string, leaveType: LeaveType): Promise<LeaveBalance>;
    submitTimesheetEndpoint(timesheetId: string): Promise<Timesheet>;
    validateFlsa(employeeId: string, weekStartDate: string): Promise<FlsaCompliance>;
}
export {};
//# sourceMappingURL=time-attendance-tracking-kit.d.ts.map
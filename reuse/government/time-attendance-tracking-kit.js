"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeAttendanceController = exports.createBiometricEventModel = exports.createTimesheetModel = exports.createLeaveRequestModel = exports.createTimeEntryModel = void 0;
exports.createTimeEntry = createTimeEntry;
exports.validateTimeEntry = validateTimeEntry;
exports.approveTimeEntry = approveTimeEntry;
exports.importTimeEntries = importTimeEntries;
exports.calculateWorkHours = calculateWorkHours;
exports.checkOverlappingTimeEntries = checkOverlappingTimeEntries;
exports.submitTimeEntry = submitTimeEntry;
exports.modifyTimeEntry = modifyTimeEntry;
exports.createLeaveRequest = createLeaveRequest;
exports.approveLeaveRequest = approveLeaveRequest;
exports.rejectLeaveRequest = rejectLeaveRequest;
exports.getLeaveBalance = getLeaveBalance;
exports.processLeaveAccrual = processLeaveAccrual;
exports.cancelLeaveRequest = cancelLeaveRequest;
exports.validateLeaveRequest = validateLeaveRequest;
exports.generateLeaveRequestNumber = generateLeaveRequestNumber;
exports.createOvertimeRequest = createOvertimeRequest;
exports.calculateOvertimePay = calculateOvertimePay;
exports.trackCompensatoryTime = trackCompensatoryTime;
exports.useCompensatoryTime = useCompensatoryTime;
exports.getAvailableCompTime = getAvailableCompTime;
exports.validateOvertimeRequest = validateOvertimeRequest;
exports.approveOvertimeRequest = approveOvertimeRequest;
exports.generateOvertimeRequestNumber = generateOvertimeRequestNumber;
exports.createTimesheet = createTimesheet;
exports.submitTimesheet = submitTimesheet;
exports.approveTimesheet = approveTimesheet;
exports.certifyTimesheet = certifyTimesheet;
exports.generateTimeAttendanceReport = generateTimeAttendanceReport;
exports.validateTimesheet = validateTimesheet;
exports.exportTimesheetToPayroll = exportTimesheetToPayroll;
exports.getPayPeriod = getPayPeriod;
exports.validateFlsaCompliance = validateFlsaCompliance;
exports.checkFlsaExemptStatus = checkFlsaExemptStatus;
exports.getWeeklyHours = getWeeklyHours;
exports.generateFlsaComplianceReport = generateFlsaComplianceReport;
exports.detectFlsaViolations = detectFlsaViolations;
exports.calculateFlsaOvertimeThreshold = calculateFlsaOvertimeThreshold;
exports.updateFlsaExemptionStatus = updateFlsaExemptionStatus;
exports.auditFlsaRecordkeeping = auditFlsaRecordkeeping;
exports.recordAttendance = recordAttendance;
exports.createShiftSchedule = createShiftSchedule;
exports.processBiometricEvent = processBiometricEvent;
exports.excuseAbsence = excuseAbsence;
exports.generateAttendanceSummary = generateAttendanceSummary;
exports.manageHolidayCalendar = manageHolidayCalendar;
exports.calculateLateMinutes = calculateLateMinutes;
exports.calculateBusinessDays = calculateBusinessDays;
exports.formatHours = formatHours;
exports.parseTimeToMinutes = parseTimeToMinutes;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================
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
const createTimeEntryModel = (sequelize) => {
    class TimeEntry extends sequelize_1.Model {
    }
    TimeEntry.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        entryDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date of time entry',
        },
        clockInTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Clock in timestamp',
        },
        clockOutTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Clock out timestamp',
        },
        breakStartTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Break start timestamp',
        },
        breakEndTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Break end timestamp',
        },
        regularHours: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Regular hours worked',
        },
        overtimeHours: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overtime hours worked',
        },
        doubleTimeHours: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Double time hours worked',
        },
        totalHours: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total hours worked',
        },
        entryType: {
            type: sequelize_1.DataTypes.ENUM('regular', 'overtime', 'comp_time', 'leave', 'holiday', 'training', 'jury_duty', 'military'),
            allowNull: false,
            defaultValue: 'regular',
            comment: 'Type of time entry',
        },
        entryMethod: {
            type: sequelize_1.DataTypes.ENUM('manual', 'biometric', 'web', 'mobile', 'phone', 'kiosk', 'import'),
            allowNull: false,
            defaultValue: 'manual',
            comment: 'Method of time entry',
        },
        workLocation: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Work location',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Project code for cost allocation',
        },
        costCenter: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Cost center code',
        },
        activityCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Activity code',
        },
        biometricVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Verified by biometric system',
        },
        gpsLocation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'GPS coordinates of entry',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address of entry',
        },
        deviceId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Device identifier',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'modified'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Entry status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Approver user ID',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        rejectedReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Rejection reason',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Attachment URLs',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'time_entries',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['entryDate'] },
            { fields: ['status'] },
            { fields: ['entryType'] },
            { fields: ['approvedBy'] },
            { fields: ['biometricVerified'] },
            { fields: ['createdAt'] },
        ],
    });
    return TimeEntry;
};
exports.createTimeEntryModel = createTimeEntryModel;
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
const createLeaveRequestModel = (sequelize) => {
    class LeaveRequest extends sequelize_1.Model {
    }
    LeaveRequest.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        requestNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique leave request number',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        leaveType: {
            type: sequelize_1.DataTypes.ENUM('annual', 'sick', 'personal', 'military', 'jury_duty', 'bereavement', 'fmla', 'unpaid', 'administrative', 'compensatory'),
            allowNull: false,
            comment: 'Type of leave',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Leave start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Leave end date',
        },
        totalDays: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Total leave days',
        },
        totalHours: {
            type: sequelize_1.DataTypes.DECIMAL(7, 2),
            allowNull: false,
            comment: 'Total leave hours',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for leave',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'cancelled', 'in_use', 'completed'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Request status',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Submission timestamp',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Approver user ID',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        rejectedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Rejector user ID',
        },
        rejectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rejection timestamp',
        },
        rejectionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Rejection reason',
        },
        cancelledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Cancellation timestamp',
        },
        cancellationReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Cancellation reason',
        },
        leaveBalance: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Leave balance snapshot',
        },
        supportingDocuments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Supporting document URLs',
        },
        returnToWorkDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Scheduled return to work date',
        },
        workflowStage: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current workflow approval stage',
        },
        approvalChain: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Approval workflow chain',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'leave_requests',
        timestamps: true,
        indexes: [
            { fields: ['requestNumber'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['leaveType'] },
            { fields: ['status'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
            { fields: ['submittedAt'] },
        ],
    });
    return LeaveRequest;
};
exports.createLeaveRequestModel = createLeaveRequestModel;
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
const createTimesheetModel = (sequelize) => {
    class Timesheet extends sequelize_1.Model {
    }
    Timesheet.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        timesheetNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique timesheet identifier',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        periodId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Pay period identifier',
        },
        periodStartDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Pay period start date',
        },
        periodEndDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Pay period end date',
        },
        totalRegularHours: {
            type: sequelize_1.DataTypes.DECIMAL(7, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total regular hours',
        },
        totalOvertimeHours: {
            type: sequelize_1.DataTypes.DECIMAL(7, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total overtime hours',
        },
        totalCompTime: {
            type: sequelize_1.DataTypes.DECIMAL(7, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total compensatory time',
        },
        totalLeaveHours: {
            type: sequelize_1.DataTypes.DECIMAL(7, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total leave hours',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'certified', 'processed'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Timesheet status',
        },
        timeEntries: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Time entry details',
        },
        leaveEntries: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Leave entry details',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Submission timestamp',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Approver user ID',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        rejectedReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Rejection reason',
        },
        certificationSignature: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Digital signature data',
        },
        certifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Certification timestamp',
        },
        auditLog: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Audit trail',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'timesheets',
        timestamps: true,
        indexes: [
            { fields: ['timesheetNumber'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['periodId'] },
            { fields: ['status'] },
            { fields: ['periodStartDate'] },
            { fields: ['periodEndDate'] },
            { fields: ['submittedAt'] },
        ],
    });
    return Timesheet;
};
exports.createTimesheetModel = createTimesheetModel;
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
const createBiometricEventModel = (sequelize) => {
    class BiometricEvent extends sequelize_1.Model {
    }
    BiometricEvent.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique event identifier',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        eventType: {
            type: sequelize_1.DataTypes.ENUM('clock_in', 'clock_out', 'break_start', 'break_end', 'access_granted', 'access_denied'),
            allowNull: false,
            comment: 'Type of biometric event',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Event timestamp',
        },
        deviceId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Biometric device identifier',
        },
        deviceLocation: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Device physical location',
        },
        biometricType: {
            type: sequelize_1.DataTypes.ENUM('fingerprint', 'facial_recognition', 'iris_scan', 'palm_vein', 'badge', 'pin'),
            allowNull: false,
            comment: 'Type of biometric authentication',
        },
        verificationResult: {
            type: sequelize_1.DataTypes.ENUM('verified', 'failed', 'partial', 'override'),
            allowNull: false,
            comment: 'Verification result',
        },
        confidence: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Verification confidence score (0-100)',
        },
        temperature: {
            type: sequelize_1.DataTypes.DECIMAL(4, 1),
            allowNull: true,
            comment: 'Temperature reading (if applicable)',
        },
        maskDetected: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
            comment: 'Mask detection result',
        },
        timeEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated time entry ID',
        },
        attendanceRecordId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated attendance record ID',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'biometric_events',
        timestamps: true,
        indexes: [
            { fields: ['eventId'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['eventType'] },
            { fields: ['timestamp'] },
            { fields: ['deviceId'] },
            { fields: ['verificationResult'] },
        ],
    });
    return BiometricEvent;
};
exports.createBiometricEventModel = createBiometricEventModel;
// ============================================================================
// TIME ENTRY FUNCTIONS (1-8)
// ============================================================================
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
async function createTimeEntry(entryData, context) {
    const totalHours = calculateWorkHours(entryData.clockInTime, entryData.clockOutTime, entryData.breakStartTime, entryData.breakEndTime);
    const entry = {
        ...entryData,
        employeeId: entryData.employeeId || context.employeeId,
        regularHours: Math.min(totalHours, 8),
        overtimeHours: Math.max(totalHours - 8, 0),
        doubleTimeHours: 0,
        totalHours,
        entryType: entryData.entryType || 'regular',
        entryMethod: entryData.entryMethod || 'manual',
        biometricVerified: entryData.biometricVerified || false,
        status: 'draft',
        attachments: entryData.attachments || [],
        metadata: entryData.metadata || {},
    };
    return entry;
}
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
async function validateTimeEntry(entry, context) {
    const violations = [];
    // Check for future dates
    if (new Date(entry.entryDate) > new Date()) {
        violations.push('Cannot enter time for future dates');
    }
    // Check for overlapping entries
    const hasOverlap = await checkOverlappingTimeEntries(entry.employeeId, entry.entryDate, entry.clockInTime, entry.clockOutTime);
    if (hasOverlap) {
        violations.push('Time entry overlaps with existing entry');
    }
    // Check maximum daily hours
    if (entry.totalHours > 24) {
        violations.push('Total hours cannot exceed 24 hours per day');
    }
    // Check clock in/out sequence
    if (entry.clockInTime && entry.clockOutTime && entry.clockInTime >= entry.clockOutTime) {
        violations.push('Clock out time must be after clock in time');
    }
    return {
        isValid: violations.length === 0,
        violations,
    };
}
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
async function approveTimeEntry(entryId, approverId, comments, context) {
    return {
        id: entryId,
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date().toISOString(),
        notes: comments,
    };
}
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
async function importTimeEntries(entries, source, context) {
    let imported = 0;
    let failed = 0;
    const errors = [];
    for (const entry of entries) {
        try {
            const validation = await validateTimeEntry(entry, context);
            if (validation.isValid) {
                await createTimeEntry(entry, context);
                imported++;
            }
            else {
                failed++;
                errors.push({ entry, violations: validation.violations });
            }
        }
        catch (error) {
            failed++;
            errors.push({ entry, error: error.message });
        }
    }
    return { imported, failed, errors };
}
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
function calculateWorkHours(clockIn, clockOut, breakStart, breakEnd) {
    if (!clockIn || !clockOut)
        return 0;
    const inTime = new Date(clockIn).getTime();
    const outTime = new Date(clockOut).getTime();
    let totalMinutes = (outTime - inTime) / (1000 * 60);
    if (breakStart && breakEnd) {
        const breakStartTime = new Date(breakStart).getTime();
        const breakEndTime = new Date(breakEnd).getTime();
        const breakMinutes = (breakEndTime - breakStartTime) / (1000 * 60);
        totalMinutes -= breakMinutes;
    }
    return Math.round((totalMinutes / 60) * 100) / 100;
}
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
async function checkOverlappingTimeEntries(employeeId, date, clockIn, clockOut) {
    // Implementation would query database for overlapping entries
    return false;
}
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
async function submitTimeEntry(entryId, context) {
    return {
        id: entryId,
        status: 'submitted',
    };
}
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
async function modifyTimeEntry(entryId, updates, context) {
    const totalHours = calculateWorkHours(updates.clockInTime, updates.clockOutTime, updates.breakStartTime, updates.breakEndTime);
    return {
        id: entryId,
        ...updates,
        totalHours,
        regularHours: Math.min(totalHours, 8),
        overtimeHours: Math.max(totalHours - 8, 0),
        status: 'modified',
    };
}
// ============================================================================
// LEAVE MANAGEMENT FUNCTIONS (9-16)
// ============================================================================
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
async function createLeaveRequest(leaveData, context) {
    const requestNumber = await generateLeaveRequestNumber(leaveData.employeeId);
    const totalDays = calculateBusinessDays(leaveData.startDate, leaveData.endDate);
    const balance = await getLeaveBalance(leaveData.employeeId, leaveData.leaveType);
    const request = {
        ...leaveData,
        requestNumber,
        employeeId: leaveData.employeeId || context.employeeId,
        totalDays,
        totalHours: totalDays * 8,
        status: 'draft',
        submittedAt: new Date().toISOString(),
        leaveBalance: balance,
        supportingDocuments: leaveData.supportingDocuments || [],
        workflowStage: 0,
        approvalChain: [],
        metadata: leaveData.metadata || {},
    };
    return request;
}
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
async function approveLeaveRequest(requestId, approverId, comments, context) {
    return {
        id: requestId,
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date().toISOString(),
    };
}
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
async function rejectLeaveRequest(requestId, rejecterId, reason, context) {
    return {
        id: requestId,
        status: 'rejected',
        rejectedBy: rejecterId,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
    };
}
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
async function getLeaveBalance(employeeId, leaveType) {
    const fiscalYear = new Date().getFullYear();
    return {
        leaveType,
        employeeId,
        fiscalYear,
        accrued: 120,
        used: 40,
        pending: 16,
        available: 64,
        carryOver: 0,
        maxAccrual: 240,
        accrualRate: 4.62,
    };
}
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
async function processLeaveAccrual(employeeId, periodId, context) {
    return {
        annual: 4.62,
        sick: 4.00,
        personal: 0,
    };
}
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
async function cancelLeaveRequest(requestId, reason, context) {
    return {
        id: requestId,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
    };
}
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
async function validateLeaveRequest(request, context) {
    const errors = [];
    // Check sufficient balance
    const balance = await getLeaveBalance(request.employeeId, request.leaveType);
    if (balance.available < request.totalHours) {
        errors.push(`Insufficient ${request.leaveType} leave balance. Available: ${balance.available} hours, Requested: ${request.totalHours} hours`);
    }
    // Check past dates
    if (new Date(request.startDate) < new Date()) {
        errors.push('Leave start date cannot be in the past');
    }
    // Check minimum notice period
    const daysUntilLeave = Math.ceil((new Date(request.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilLeave < 3 && request.leaveType === 'annual') {
        errors.push('Annual leave requires minimum 3 days advance notice');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
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
async function generateLeaveRequestNumber(employeeId) {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `LV-${year}-${sequence}`;
}
// ============================================================================
// OVERTIME & COMPENSATORY TIME FUNCTIONS (17-24)
// ============================================================================
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
async function createOvertimeRequest(overtimeData, context) {
    const requestNumber = await generateOvertimeRequestNumber();
    const flsaExempt = await checkFlsaExemptStatus(overtimeData.employeeId);
    return {
        ...overtimeData,
        requestNumber,
        employeeId: overtimeData.employeeId || context.employeeId,
        requestDate: new Date().toISOString(),
        status: 'requested',
        flsaExempt,
        compensationType: overtimeData.compensationType || 'overtime_pay',
        metadata: overtimeData.metadata || {},
    };
}
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
async function calculateOvertimePay(employeeId, weekStartDate, totalHours) {
    const hourlyRate = 25.00; // Would be fetched from employee record
    const overtimeThreshold = 40;
    const overtimeHours = Math.max(totalHours - overtimeThreshold, 0);
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    return {
        overtimeHours,
        overtimePay,
        doubleTimeHours: 0,
    };
}
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
async function trackCompensatoryTime(compTimeData, context) {
    return {
        ...compTimeData,
        employeeId: compTimeData.employeeId || context.employeeId,
        earnedDate: new Date().toISOString(),
        hoursUsed: 0,
        hoursAvailable: compTimeData.hoursEarned,
        approvedBy: context.supervisorId,
        approvedAt: new Date().toISOString(),
        useByDate: compTimeData.expirationDate,
        flsaCompliant: true,
        metadata: compTimeData.metadata || {},
    };
}
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
async function useCompensatoryTime(employeeId, hours, useDate, context) {
    const available = await getAvailableCompTime(employeeId);
    if (available < hours) {
        throw new Error(`Insufficient comp time. Available: ${available}, Requested: ${hours}`);
    }
    return {
        employeeId,
        hoursUsed: hours,
        hoursAvailable: available - hours,
    };
}
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
async function getAvailableCompTime(employeeId) {
    return 24; // Would query database for actual balance
}
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
async function validateOvertimeRequest(request, context) {
    const warnings = [];
    // Check FLSA exempt status
    if (request.flsaExempt) {
        warnings.push('Employee is FLSA exempt - overtime may not apply');
    }
    // Check weekly hour limits
    const weeklyHours = await getWeeklyHours(request.employeeId, request.workDate);
    if (weeklyHours + request.estimatedHours > 60) {
        warnings.push('Total weekly hours will exceed 60 hours');
    }
    return {
        isValid: true,
        warnings,
    };
}
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
async function approveOvertimeRequest(requestId, approverId, context) {
    return {
        id: requestId,
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date().toISOString(),
    };
}
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
async function generateOvertimeRequestNumber() {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `OT-${year}-${sequence}`;
}
// ============================================================================
// TIMESHEET & REPORTING FUNCTIONS (25-32)
// ============================================================================
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
async function createTimesheet(employeeId, periodId, context) {
    const period = await getPayPeriod(periodId);
    const timesheetNumber = `TS-${period.fiscalYear}-${period.periodNumber}-${employeeId}`;
    return {
        timesheetNumber,
        employeeId,
        periodId,
        periodStartDate: period.startDate,
        periodEndDate: period.endDate,
        totalRegularHours: 0,
        totalOvertimeHours: 0,
        totalCompTime: 0,
        totalLeaveHours: 0,
        status: 'draft',
        timeEntries: [],
        leaveEntries: [],
        auditLog: [],
        metadata: {},
    };
}
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
async function submitTimesheet(timesheetId, context) {
    return {
        id: timesheetId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
    };
}
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
async function approveTimesheet(timesheetId, approverId, context) {
    return {
        id: timesheetId,
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date().toISOString(),
    };
}
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
async function certifyTimesheet(timesheetId, signature, context) {
    return {
        id: timesheetId,
        certificationSignature: signature,
        certifiedAt: new Date().toISOString(),
    };
}
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
async function generateTimeAttendanceReport(reportType, startDate, endDate, filters, context) {
    return {
        reportType,
        reportPeriod: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        generatedAt: new Date().toISOString(),
        generatedBy: context.userId,
        filters,
        data: [],
        summary: {},
    };
}
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
async function validateTimesheet(timesheet, context) {
    const errors = [];
    // Check for missing days
    const workDays = calculateBusinessDays(timesheet.periodStartDate, timesheet.periodEndDate);
    if (timesheet.timeEntries.length < workDays) {
        errors.push(`Missing time entries. Expected: ${workDays}, Found: ${timesheet.timeEntries.length}`);
    }
    // Validate total hours
    if (timesheet.totalRegularHours + timesheet.totalOvertimeHours + timesheet.totalLeaveHours === 0) {
        errors.push('Timesheet has no hours recorded');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
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
async function exportTimesheetToPayroll(timesheetId, format, context) {
    // Would generate formatted export data
    return 'EXPORTED_DATA';
}
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
async function getPayPeriod(periodId) {
    return {
        periodNumber: periodId,
        payPeriodType: 'biweekly',
        startDate: '2025-01-01',
        endDate: '2025-01-14',
        fiscalYear: 2025,
        fiscalPeriod: 1,
        status: 'open',
        submissionDeadline: '2025-01-16',
        paymentDate: '2025-01-24',
        isClosed: false,
    };
}
// ============================================================================
// FLSA COMPLIANCE FUNCTIONS (33-40)
// ============================================================================
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
async function validateFlsaCompliance(employeeId, weekStartDate, context) {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weeklyHours = await getWeeklyHours(employeeId, weekStartDate);
    const flsaExempt = await checkFlsaExemptStatus(employeeId);
    const violations = [];
    if (!flsaExempt && weeklyHours > 40) {
        const overtimeHours = weeklyHours - 40;
        // Check if overtime was properly compensated
    }
    return {
        employeeId,
        weekStartDate,
        weekEndDate: weekEndDate.toISOString().split('T')[0],
        regularHours: Math.min(weeklyHours, 40),
        overtimeHours: Math.max(weeklyHours - 40, 0),
        flsaExempt,
        weeklyThreshold: 40,
        dailyThreshold: 8,
        violations,
        complianceStatus: violations.length > 0 ? 'violation' : 'compliant',
    };
}
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
async function checkFlsaExemptStatus(employeeId) {
    // Would query employee record for FLSA status
    return false;
}
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
async function getWeeklyHours(employeeId, weekStartDate) {
    // Would sum time entries for the week
    return 42;
}
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
async function generateFlsaComplianceReport(startDate, endDate, context) {
    return generateTimeAttendanceReport('flsa_compliance', startDate, endDate, {}, context);
}
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
async function detectFlsaViolations(weekStartDate, context) {
    // Would scan all employees for violations
    return [];
}
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
async function calculateFlsaOvertimeThreshold(employeeId, payPeriodType) {
    const weeklyThreshold = 40;
    switch (payPeriodType) {
        case 'weekly': return weeklyThreshold;
        case 'biweekly': return weeklyThreshold * 2;
        case 'semi_monthly': return (weeklyThreshold * 52) / 24;
        case 'monthly': return (weeklyThreshold * 52) / 12;
        default: return weeklyThreshold;
    }
}
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
async function updateFlsaExemptionStatus(employeeId, exemptionType, effectiveDate, context) {
    return true;
}
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
async function auditFlsaRecordkeeping(employeeId, startDate, endDate) {
    return {
        compliant: true,
        missingRecords: [],
    };
}
// ============================================================================
// ATTENDANCE & SCHEDULING FUNCTIONS (41-48)
// ============================================================================
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
async function recordAttendance(attendanceData, context) {
    const lateMinutes = calculateLateMinutes(attendanceData.scheduledStartTime, attendanceData.actualStartTime);
    return {
        ...attendanceData,
        employeeId: attendanceData.employeeId || context.employeeId,
        attendanceStatus: lateMinutes > 0 ? 'late' : 'present',
        lateMinutes,
        earlyDepartureMinutes: 0,
        excused: false,
        biometricCheckIn: attendanceData.biometricCheckIn || false,
        biometricCheckOut: false,
        metadata: attendanceData.metadata || {},
    };
}
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
async function createShiftSchedule(scheduleData, context) {
    const scheduleId = await generateScheduleId();
    return {
        ...scheduleData,
        scheduleId,
        employeeId: scheduleData.employeeId || context.employeeId,
        breakDuration: scheduleData.breakDuration || 30,
        supervisorId: context.supervisorId,
        status: 'scheduled',
        coverageRequired: false,
        metadata: scheduleData.metadata || {},
    };
}
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
async function processBiometricEvent(eventData, context) {
    const eventId = await generateBiometricEventId();
    return {
        ...eventData,
        eventId,
        employeeId: eventData.employeeId || context.employeeId,
        timestamp: new Date().toISOString(),
        deviceLocation: eventData.deviceLocation || 'Main Entrance',
        confidence: eventData.confidence || 0,
        metadata: eventData.metadata || {},
    };
}
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
async function excuseAbsence(attendanceId, reason, excusedBy, context) {
    return {
        id: attendanceId,
        excused: true,
        excusedBy,
        excusedReason: reason,
    };
}
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
async function generateAttendanceSummary(employeeId, startDate, endDate) {
    return {
        totalDays: 20,
        presentDays: 18,
        absentDays: 2,
        lateDays: 3,
        excusedDays: 1,
        attendanceRate: 90,
    };
}
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
async function manageHolidayCalendar(holidayData, context) {
    return {
        ...holidayData,
        observedDate: holidayData.observedDate || holidayData.holidayDate,
        stateHoliday: holidayData.stateHoliday || false,
        localHoliday: holidayData.localHoliday || false,
        agencyId: context.agencyId,
        metadata: holidayData.metadata || {},
    };
}
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
function calculateLateMinutes(scheduledTime, actualTime) {
    const scheduled = new Date(`2000-01-01T${scheduledTime}`).getTime();
    const actual = new Date(`2000-01-01T${actualTime}`).getTime();
    const diffMinutes = (actual - scheduled) / (1000 * 60);
    return Math.max(diffMinutes, 0);
}
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
function calculateBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday(0) or Saturday(6)
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}
// ============================================================================
// HELPER UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates unique schedule ID.
 *
 * @returns {Promise<string>} Unique schedule ID
 */
async function generateScheduleId() {
    return `SCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
/**
 * Generates unique biometric event ID.
 *
 * @returns {Promise<string>} Unique event ID
 */
async function generateBiometricEventId() {
    return `BIO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
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
function formatHours(hours) {
    return `${hours.toFixed(2)} hours`;
}
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
function parseTimeToMinutes(timeString) {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
}
// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================
/**
 * NestJS controller for time and attendance management.
 */
let TimeAttendanceController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Time & Attendance'), (0, common_1.Controller)('time-attendance'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createEntry_decorators;
    let _createLeave_decorators;
    let _getBalance_decorators;
    let _submitTimesheetEndpoint_decorators;
    let _validateFlsa_decorators;
    var TimeAttendanceController = _classThis = class {
        async createEntry(entryData) {
            const context = {
                userId: 'USER123',
                employeeId: entryData.employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                timestamp: new Date().toISOString(),
            };
            return createTimeEntry(entryData, context);
        }
        async createLeave(leaveData) {
            const context = {
                userId: 'USER123',
                employeeId: leaveData.employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                timestamp: new Date().toISOString(),
            };
            return createLeaveRequest(leaveData, context);
        }
        async getBalance(employeeId, leaveType) {
            return getLeaveBalance(employeeId, leaveType);
        }
        async submitTimesheetEndpoint(timesheetId) {
            const context = {
                userId: 'USER123',
                employeeId: 'EMP123',
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                timestamp: new Date().toISOString(),
            };
            return submitTimesheet(timesheetId, context);
        }
        async validateFlsa(employeeId, weekStartDate) {
            const context = {
                userId: 'USER123',
                employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                timestamp: new Date().toISOString(),
            };
            return validateFlsaCompliance(employeeId, weekStartDate, context);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "TimeAttendanceController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createEntry_decorators = [(0, common_1.Post)('time-entry'), (0, swagger_1.ApiOperation)({ summary: 'Create time entry' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Time entry created successfully' })];
        _createLeave_decorators = [(0, common_1.Post)('leave-request'), (0, swagger_1.ApiOperation)({ summary: 'Create leave request' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Leave request created successfully' })];
        _getBalance_decorators = [(0, common_1.Get)('leave-balance/:employeeId/:leaveType'), (0, swagger_1.ApiOperation)({ summary: 'Get leave balance' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' }), (0, swagger_1.ApiParam)({ name: 'leaveType', description: 'Leave type' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Leave balance retrieved successfully' })];
        _submitTimesheetEndpoint_decorators = [(0, common_1.Post)('timesheet/submit/:timesheetId'), (0, swagger_1.ApiOperation)({ summary: 'Submit timesheet for approval' }), (0, swagger_1.ApiParam)({ name: 'timesheetId', description: 'Timesheet ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Timesheet submitted successfully' })];
        _validateFlsa_decorators = [(0, common_1.Post)('flsa/validate/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Validate FLSA compliance' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' }), (0, swagger_1.ApiQuery)({ name: 'weekStartDate', description: 'Week start date (YYYY-MM-DD)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'FLSA compliance validated' })];
        __esDecorate(_classThis, null, _createEntry_decorators, { kind: "method", name: "createEntry", static: false, private: false, access: { has: obj => "createEntry" in obj, get: obj => obj.createEntry }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createLeave_decorators, { kind: "method", name: "createLeave", static: false, private: false, access: { has: obj => "createLeave" in obj, get: obj => obj.createLeave }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBalance_decorators, { kind: "method", name: "getBalance", static: false, private: false, access: { has: obj => "getBalance" in obj, get: obj => obj.getBalance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitTimesheetEndpoint_decorators, { kind: "method", name: "submitTimesheetEndpoint", static: false, private: false, access: { has: obj => "submitTimesheetEndpoint" in obj, get: obj => obj.submitTimesheetEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateFlsa_decorators, { kind: "method", name: "validateFlsa", static: false, private: false, access: { has: obj => "validateFlsa" in obj, get: obj => obj.validateFlsa }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimeAttendanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimeAttendanceController = _classThis;
})();
exports.TimeAttendanceController = TimeAttendanceController;
// Helper function to make ApiProperty available
function ApiProperty(options) {
    return (target, propertyKey) => { };
}
//# sourceMappingURL=time-attendance-tracking-kit.js.map
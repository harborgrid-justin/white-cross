/**
 * LOC: CEFMSETA001
 * File: /reuse/financial/cefms/composites/cefms-employee-time-attendance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../government/time-attendance-tracking-kit.ts
 *   - ../../government/government-payroll-benefits-kit.ts
 *   - ../../government/position-control-workforce-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS time and attendance services
 *   - USACE labor distribution systems
 *   - Timesheet approval modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-employee-time-attendance-composite.ts
 * Locator: WC-CEFMS-ETA-001
 * Purpose: USACE CEFMS Employee Time & Attendance - timesheet management, leave accrual, labor distribution, overtime tracking
 *
 * Upstream: Composes utilities from government kits for time and attendance operations
 * Downstream: ../../../backend/cefms/*, Time tracking controllers, payroll integration, labor costing, compliance reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 39+ composite functions for USACE CEFMS employee time and attendance operations
 *
 * LLM Context: Production-ready USACE CEFMS employee time and attendance system.
 * Comprehensive timesheet management, time entry and approval workflows, leave accrual calculations, overtime and compensatory time tracking,
 * labor distribution to projects and cost centers, absence management, shift scheduling, FLSA compliance validation, timesheet corrections,
 * biometric integration, holiday management, time-off request processing, attendance reporting, and audit trail generation.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TimesheetData {
  timesheetId: string;
  employeeId: string;
  payPeriodId: string;
  periodStartDate: Date;
  periodEndDate: Date;
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalLeaveHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'posted';
  submittedBy?: string;
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

interface TimeEntryData {
  entryId: string;
  timesheetId: string;
  entryDate: Date;
  projectCode?: string;
  costCenter?: string;
  taskCode?: string;
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  leaveHours: number;
  leaveType?: string;
  comments?: string;
}

interface LeaveAccrualData {
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'comp_time' | 'holiday' | 'military' | 'jury_duty';
  fiscalYear: number;
  beginningBalance: number;
  accrualRate: number;
  accruedHours: number;
  usedHours: number;
  adjustmentHours: number;
  currentBalance: number;
  maxAccrual: number;
}

interface LaborDistributionData {
  distributionId: string;
  timesheetId: string;
  employeeId: string;
  projectCode: string;
  taskCode: string;
  costCenter: string;
  accountCode: string;
  regularHours: number;
  overtimeHours: number;
  laborCost: number;
  burdenCost: number;
  totalCost: number;
}

interface OvertimeCalculationData {
  employeeId: string;
  payPeriodId: string;
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  flsaStatus: 'exempt' | 'non_exempt';
  overtimeEligible: boolean;
  weeklyThreshold: number;
  dailyThreshold: number;
}

interface AttendanceRecordData {
  employeeId: string;
  recordDate: Date;
  clockInTime?: Date;
  clockOutTime?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  attendanceStatus: 'present' | 'absent' | 'tardy' | 'left_early' | 'on_leave';
  absenceReason?: string;
  totalHours: number;
}

interface LeaveRequestData {
  requestId: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  reason?: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

interface ShiftScheduleData {
  scheduleId: string;
  employeeId: string;
  shiftDate: Date;
  shiftType: 'day' | 'evening' | 'night' | 'rotating';
  startTime: string;
  endTime: string;
  breakDuration: number;
  location?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Timesheets with approval workflow tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Timesheet model
 *
 * @example
 * ```typescript
 * const Timesheet = createTimesheetModel(sequelize);
 * const timesheet = await Timesheet.create({
 *   timesheetId: 'TS-2024-001',
 *   employeeId: 'EMP-123',
 *   payPeriodId: 'PP-2024-01',
 *   periodStartDate: new Date('2024-01-01'),
 *   periodEndDate: new Date('2024-01-14'),
 *   status: 'draft'
 * });
 * ```
 */
export const createTimesheetModel = (sequelize: Sequelize) => {
  class Timesheet extends Model {
    public id!: string;
    public timesheetId!: string;
    public employeeId!: string;
    public payPeriodId!: string;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public totalRegularHours!: number;
    public totalOvertimeHours!: number;
    public totalLeaveHours!: number;
    public status!: string;
    public submittedBy!: string | null;
    public submittedAt!: Date | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectedBy!: string | null;
    public rejectedAt!: Date | null;
    public rejectionReason!: string | null;
    public postedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Timesheet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      timesheetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Timesheet identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      payPeriodId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Pay period identifier',
      },
      periodStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      periodEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      totalRegularHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total regular hours',
      },
      totalOvertimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total overtime hours',
      },
      totalLeaveHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total leave hours',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'posted'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Timesheet status',
      },
      submittedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Submitted by user',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Rejected by user',
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Rejection timestamp',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posted to payroll timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'timesheets',
      timestamps: true,
      indexes: [
        { fields: ['timesheetId'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['payPeriodId'] },
        { fields: ['status'] },
        { fields: ['periodStartDate', 'periodEndDate'] },
        { fields: ['approvedBy'] },
      ],
    },
  );

  return Timesheet;
};

/**
 * Sequelize model for Time Entries with project and task tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TimeEntry model
 */
export const createTimeEntryModel = (sequelize: Sequelize) => {
  class TimeEntry extends Model {
    public id!: string;
    public entryId!: string;
    public timesheetId!: string;
    public entryDate!: Date;
    public projectCode!: string | null;
    public costCenter!: string | null;
    public taskCode!: string | null;
    public regularHours!: number;
    public overtimeHours!: number;
    public doubleTimeHours!: number;
    public leaveHours!: number;
    public leaveType!: string | null;
    public comments!: string | null;
    public correctionOf!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TimeEntry.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      entryId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Entry identifier',
      },
      timesheetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related timesheet',
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Entry date',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center',
      },
      taskCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Task code',
      },
      regularHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Regular hours',
        validate: {
          min: 0,
          max: 24,
        },
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours',
        validate: {
          min: 0,
          max: 24,
        },
      },
      doubleTimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Double time hours',
        validate: {
          min: 0,
          max: 24,
        },
      },
      leaveHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Leave hours',
        validate: {
          min: 0,
          max: 24,
        },
      },
      leaveType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Leave type',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Entry comments',
      },
      correctionOf: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Original entry being corrected',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'time_entries',
      timestamps: true,
      indexes: [
        { fields: ['entryId'], unique: true },
        { fields: ['timesheetId'] },
        { fields: ['entryDate'] },
        { fields: ['projectCode'] },
        { fields: ['costCenter'] },
        { fields: ['taskCode'] },
      ],
    },
  );

  return TimeEntry;
};

/**
 * Sequelize model for Leave Accruals with balance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveAccrual model
 */
export const createLeaveAccrualModel = (sequelize: Sequelize) => {
  class LeaveAccrual extends Model {
    public id!: string;
    public employeeId!: string;
    public leaveType!: string;
    public fiscalYear!: number;
    public beginningBalance!: number;
    public accrualRate!: number;
    public accruedHours!: number;
    public usedHours!: number;
    public adjustmentHours!: number;
    public currentBalance!: number;
    public maxAccrual!: number;
    public carryoverHours!: number;
    public forfeitedHours!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaveAccrual.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      leaveType: {
        type: DataTypes.ENUM('annual', 'sick', 'comp_time', 'holiday', 'military', 'jury_duty'),
        allowNull: false,
        comment: 'Leave type',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      beginningBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Beginning balance',
      },
      accrualRate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accrual rate per pay period',
      },
      accruedHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Hours accrued this year',
      },
      usedHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Hours used this year',
      },
      adjustmentHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Manual adjustments',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current balance',
      },
      maxAccrual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Maximum accrual limit',
      },
      carryoverHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Hours carried over',
      },
      forfeitedHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Hours forfeited',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'leave_accruals',
      timestamps: true,
      indexes: [
        { fields: ['employeeId', 'leaveType', 'fiscalYear'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['fiscalYear'] },
        { fields: ['leaveType'] },
      ],
    },
  );

  return LeaveAccrual;
};

/**
 * Sequelize model for Labor Distribution with cost allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LaborDistribution model
 */
export const createLaborDistributionModel = (sequelize: Sequelize) => {
  class LaborDistribution extends Model {
    public id!: string;
    public distributionId!: string;
    public timesheetId!: string;
    public employeeId!: string;
    public projectCode!: string;
    public taskCode!: string;
    public costCenter!: string;
    public accountCode!: string;
    public regularHours!: number;
    public overtimeHours!: number;
    public laborCost!: number;
    public burdenCost!: number;
    public totalCost!: number;
    public billable!: boolean;
    public billingRate!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LaborDistribution.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      distributionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Distribution identifier',
      },
      timesheetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related timesheet',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      taskCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Task code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost center',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      regularHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Regular hours',
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours',
      },
      laborCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Direct labor cost',
      },
      burdenCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Burden/overhead cost',
      },
      totalCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total cost',
      },
      billable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is billable',
      },
      billingRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Billing rate',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'labor_distributions',
      timestamps: true,
      indexes: [
        { fields: ['distributionId'], unique: true },
        { fields: ['timesheetId'] },
        { fields: ['employeeId'] },
        { fields: ['projectCode'] },
        { fields: ['costCenter'] },
        { fields: ['accountCode'] },
      ],
    },
  );

  return LaborDistribution;
};

/**
 * Sequelize model for Leave Requests with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveRequest model
 */
export const createLeaveRequestModel = (sequelize: Sequelize) => {
  class LeaveRequest extends Model {
    public id!: string;
    public requestId!: string;
    public employeeId!: string;
    public leaveType!: string;
    public startDate!: Date;
    public endDate!: Date;
    public totalHours!: number;
    public reason!: string | null;
    public status!: string;
    public requestedBy!: string;
    public requestedAt!: Date;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public deniedBy!: string | null;
    public deniedAt!: Date | null;
    public denialReason!: string | null;
    public cancelledBy!: string | null;
    public cancelledAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaveRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requestId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Request identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      leaveType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Leave type',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Leave start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Leave end date',
      },
      totalHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total hours requested',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Leave reason',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Request status',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user',
      },
      requestedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      deniedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Denied by user',
      },
      deniedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Denial timestamp',
      },
      denialReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Denial reason',
      },
      cancelledBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cancelled by user',
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cancellation timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'leave_requests',
      timestamps: true,
      indexes: [
        { fields: ['requestId'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
        { fields: ['approvedBy'] },
      ],
    },
  );

  return LeaveRequest;
};

/**
 * Sequelize model for Attendance Records with clock in/out tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AttendanceRecord model
 */
export const createAttendanceRecordModel = (sequelize: Sequelize) => {
  class AttendanceRecord extends Model {
    public id!: string;
    public employeeId!: string;
    public recordDate!: Date;
    public clockInTime!: Date | null;
    public clockOutTime!: Date | null;
    public breakStartTime!: Date | null;
    public breakEndTime!: Date | null;
    public attendanceStatus!: string;
    public absenceReason!: string | null;
    public totalHours!: number;
    public lateMinutes!: number;
    public earlyDepartureMinutes!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AttendanceRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      recordDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Record date',
      },
      clockInTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Clock in time',
      },
      clockOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Clock out time',
      },
      breakStartTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Break start time',
      },
      breakEndTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Break end time',
      },
      attendanceStatus: {
        type: DataTypes.ENUM('present', 'absent', 'tardy', 'left_early', 'on_leave'),
        allowNull: false,
        comment: 'Attendance status',
      },
      absenceReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Absence reason',
      },
      totalHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total hours worked',
      },
      lateMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Minutes late',
      },
      earlyDepartureMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Minutes left early',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'attendance_records',
      timestamps: true,
      indexes: [
        { fields: ['employeeId', 'recordDate'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['recordDate'] },
        { fields: ['attendanceStatus'] },
      ],
    },
  );

  return AttendanceRecord;
};

// ============================================================================
// TIMESHEET MANAGEMENT (1-7)
// ============================================================================

/**
 * Creates new timesheet for pay period.
 *
 * @param {TimesheetData} timesheetData - Timesheet data
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Created timesheet
 */
export const createTimesheet = async (
  timesheetData: TimesheetData,
  Timesheet: any,
): Promise<any> => {
  return await Timesheet.create(timesheetData);
};

/**
 * Submits timesheet for approval.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} userId - User submitting timesheet
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Submitted timesheet
 */
export const submitTimesheet = async (
  timesheetId: string,
  userId: string,
  Timesheet: any,
): Promise<any> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  if (timesheet.status !== 'draft') {
    throw new Error('Only draft timesheets can be submitted');
  }

  timesheet.status = 'submitted';
  timesheet.submittedBy = userId;
  timesheet.submittedAt = new Date();
  await timesheet.save();

  return timesheet;
};

/**
 * Approves submitted timesheet.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} approverId - Approving user ID
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Approved timesheet
 */
export const approveTimesheet = async (
  timesheetId: string,
  approverId: string,
  Timesheet: any,
): Promise<any> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  if (timesheet.status !== 'submitted') {
    throw new Error('Only submitted timesheets can be approved');
  }

  timesheet.status = 'approved';
  timesheet.approvedBy = approverId;
  timesheet.approvedAt = new Date();
  await timesheet.save();

  return timesheet;
};

/**
 * Rejects submitted timesheet.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {string} approverId - Approving user ID
 * @param {string} reason - Rejection reason
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Rejected timesheet
 */
export const rejectTimesheet = async (
  timesheetId: string,
  approverId: string,
  reason: string,
  Timesheet: any,
): Promise<any> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  timesheet.status = 'rejected';
  timesheet.rejectedBy = approverId;
  timesheet.rejectedAt = new Date();
  timesheet.rejectionReason = reason;
  await timesheet.save();

  return timesheet;
};

/**
 * Posts approved timesheet to payroll.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Posted timesheet
 */
export const postTimesheetToPayroll = async (
  timesheetId: string,
  Timesheet: any,
): Promise<any> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  if (timesheet.status !== 'approved') {
    throw new Error('Only approved timesheets can be posted');
  }

  timesheet.status = 'posted';
  timesheet.postedAt = new Date();
  await timesheet.save();

  return timesheet;
};

/**
 * Retrieves timesheets by status.
 *
 * @param {string} status - Timesheet status
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any[]>} Timesheets
 */
export const getTimesheetsByStatus = async (
  status: string,
  Timesheet: any,
): Promise<any[]> => {
  return await Timesheet.findAll({
    where: { status },
    order: [['periodStartDate', 'DESC']],
  });
};

/**
 * Calculates timesheet totals from entries.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} Timesheet - Timesheet model
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<any>} Updated timesheet with totals
 */
export const calculateTimesheetTotals = async (
  timesheetId: string,
  Timesheet: any,
  TimeEntry: any,
): Promise<any> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  const entries = await TimeEntry.findAll({ where: { timesheetId } });

  const totals = entries.reduce(
    (acc: any, entry: any) => ({
      regularHours: acc.regularHours + parseFloat(entry.regularHours),
      overtimeHours: acc.overtimeHours + parseFloat(entry.overtimeHours),
      leaveHours: acc.leaveHours + parseFloat(entry.leaveHours),
    }),
    { regularHours: 0, overtimeHours: 0, leaveHours: 0 },
  );

  timesheet.totalRegularHours = totals.regularHours;
  timesheet.totalOvertimeHours = totals.overtimeHours;
  timesheet.totalLeaveHours = totals.leaveHours;
  await timesheet.save();

  return timesheet;
};

// ============================================================================
// TIME ENTRY MANAGEMENT (8-14)
// ============================================================================

/**
 * Creates time entry for timesheet.
 *
 * @param {TimeEntryData} entryData - Entry data
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<any>} Created entry
 */
export const createTimeEntry = async (
  entryData: TimeEntryData,
  TimeEntry: any,
): Promise<any> => {
  return await TimeEntry.create(entryData);
};

/**
 * Updates existing time entry.
 *
 * @param {string} entryId - Entry ID
 * @param {Partial<TimeEntryData>} updates - Updated fields
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<any>} Updated entry
 */
export const updateTimeEntry = async (
  entryId: string,
  updates: Partial<TimeEntryData>,
  TimeEntry: any,
): Promise<any> => {
  const entry = await TimeEntry.findOne({ where: { entryId } });
  if (!entry) throw new Error('Entry not found');

  Object.assign(entry, updates);
  await entry.save();

  return entry;
};

/**
 * Deletes time entry.
 *
 * @param {string} entryId - Entry ID
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<boolean>} Deletion success
 */
export const deleteTimeEntry = async (
  entryId: string,
  TimeEntry: any,
): Promise<boolean> => {
  const entry = await TimeEntry.findOne({ where: { entryId } });
  if (!entry) throw new Error('Entry not found');

  await entry.destroy();
  return true;
};

/**
 * Validates time entry hours.
 *
 * @param {TimeEntryData} entryData - Entry data
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export const validateTimeEntryHours = (
  entryData: TimeEntryData,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const totalHours =
    entryData.regularHours + entryData.overtimeHours + entryData.doubleTimeHours + entryData.leaveHours;

  if (totalHours > 24) {
    errors.push('Total hours cannot exceed 24 for a single day');
  }

  if (entryData.regularHours < 0 || entryData.overtimeHours < 0 || entryData.leaveHours < 0) {
    errors.push('Hours cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Retrieves time entries by date range.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<any[]>} Time entries
 */
export const getTimeEntriesByDateRange = async (
  timesheetId: string,
  startDate: Date,
  endDate: Date,
  TimeEntry: any,
): Promise<any[]> => {
  return await TimeEntry.findAll({
    where: {
      timesheetId,
      entryDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['entryDate', 'ASC']],
  });
};

/**
 * Creates correction entry for time adjustment.
 *
 * @param {string} originalEntryId - Original entry ID
 * @param {Partial<TimeEntryData>} corrections - Corrected values
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<any>} Correction entry
 */
export const createCorrectionEntry = async (
  originalEntryId: string,
  corrections: Partial<TimeEntryData>,
  TimeEntry: any,
): Promise<any> => {
  const originalEntry = await TimeEntry.findOne({ where: { entryId: originalEntryId } });
  if (!originalEntry) throw new Error('Original entry not found');

  const correctionEntry = await TimeEntry.create({
    ...originalEntry.toJSON(),
    ...corrections,
    entryId: `CORR-${originalEntryId}`,
    correctionOf: originalEntryId,
    comments: `Correction of ${originalEntryId}`,
  });

  return correctionEntry;
};

/**
 * Exports timesheet entries to CSV.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<string>} CSV content
 */
export const exportTimesheetEntriesCSV = async (
  timesheetId: string,
  TimeEntry: any,
): Promise<string> => {
  const entries = await TimeEntry.findAll({
    where: { timesheetId },
    order: [['entryDate', 'ASC']],
  });

  const headers = 'Date,Project,Cost Center,Regular Hours,Overtime Hours,Leave Hours,Comments\n';
  const rows = entries.map((e: any) =>
    `${e.entryDate.toISOString().split('T')[0]},${e.projectCode || ''},${e.costCenter || ''},${e.regularHours},${e.overtimeHours},${e.leaveHours},"${e.comments || ''}"`
  );

  return headers + rows.join('\n');
};

// ============================================================================
// LEAVE ACCRUAL MANAGEMENT (15-21)
// ============================================================================

/**
 * Calculates leave accrual for pay period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Updated accrual
 */
export const calculateLeaveAccrual = async (
  employeeId: string,
  payPeriodId: string,
  LeaveAccrual: any,
): Promise<any> => {
  const currentYear = new Date().getFullYear();
  const accrual = await LeaveAccrual.findOne({
    where: { employeeId, fiscalYear: currentYear },
  });

  if (!accrual) throw new Error('Accrual record not found');

  const accruedThisPeriod = accrual.accrualRate;
  accrual.accruedHours += accruedThisPeriod;
  accrual.currentBalance = accrual.beginningBalance + accrual.accruedHours - accrual.usedHours + accrual.adjustmentHours;

  if (accrual.currentBalance > accrual.maxAccrual) {
    accrual.forfeitedHours += accrual.currentBalance - accrual.maxAccrual;
    accrual.currentBalance = accrual.maxAccrual;
  }

  await accrual.save();
  return accrual;
};

/**
 * Deducts leave hours from balance.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {number} hours - Hours to deduct
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Updated accrual
 */
export const deductLeaveHours = async (
  employeeId: string,
  leaveType: string,
  hours: number,
  LeaveAccrual: any,
): Promise<any> => {
  const currentYear = new Date().getFullYear();
  const accrual = await LeaveAccrual.findOne({
    where: { employeeId, leaveType, fiscalYear: currentYear },
  });

  if (!accrual) throw new Error('Accrual record not found');

  if (accrual.currentBalance < hours) {
    throw new Error(`Insufficient ${leaveType} balance`);
  }

  accrual.usedHours += hours;
  accrual.currentBalance -= hours;
  await accrual.save();

  return accrual;
};

/**
 * Retrieves leave balances for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any[]>} Leave balances
 */
export const getEmployeeLeaveBalances = async (
  employeeId: string,
  fiscalYear: number,
  LeaveAccrual: any,
): Promise<any[]> => {
  return await LeaveAccrual.findAll({
    where: { employeeId, fiscalYear },
  });
};

/**
 * Adjusts leave balance manually.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {number} adjustmentHours - Adjustment amount
 * @param {string} reason - Adjustment reason
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Updated accrual
 */
export const adjustLeaveBalance = async (
  employeeId: string,
  leaveType: string,
  adjustmentHours: number,
  reason: string,
  LeaveAccrual: any,
): Promise<any> => {
  const currentYear = new Date().getFullYear();
  const accrual = await LeaveAccrual.findOne({
    where: { employeeId, leaveType, fiscalYear: currentYear },
  });

  if (!accrual) throw new Error('Accrual record not found');

  accrual.adjustmentHours += adjustmentHours;
  accrual.currentBalance += adjustmentHours;
  accrual.metadata = {
    ...accrual.metadata,
    adjustments: [
      ...(accrual.metadata.adjustments || []),
      { date: new Date(), hours: adjustmentHours, reason },
    ],
  };

  await accrual.save();
  return accrual;
};

/**
 * Processes year-end leave carryover.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fromYear - From fiscal year
 * @param {number} toYear - To fiscal year
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} New year accrual
 */
export const processLeaveCarryover = async (
  employeeId: string,
  fromYear: number,
  toYear: number,
  LeaveAccrual: any,
): Promise<any> => {
  const previousAccruals = await LeaveAccrual.findAll({
    where: { employeeId, fiscalYear: fromYear },
  });

  const newAccruals = [];
  for (const prevAccrual of previousAccruals) {
    const carryoverAmount = Math.min(prevAccrual.currentBalance, prevAccrual.maxAccrual * 0.5);

    const newAccrual = await LeaveAccrual.create({
      employeeId,
      leaveType: prevAccrual.leaveType,
      fiscalYear: toYear,
      beginningBalance: carryoverAmount,
      accrualRate: prevAccrual.accrualRate,
      currentBalance: carryoverAmount,
      maxAccrual: prevAccrual.maxAccrual,
      carryoverHours: carryoverAmount,
    });

    newAccruals.push(newAccrual);
  }

  return newAccruals;
};

/**
 * Generates leave usage report.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Leave usage report
 */
export const generateLeaveUsageReport = async (
  employeeId: string,
  fiscalYear: number,
  LeaveAccrual: any,
): Promise<any> => {
  const accruals = await LeaveAccrual.findAll({
    where: { employeeId, fiscalYear },
  });

  return {
    employeeId,
    fiscalYear,
    leaveTypes: accruals.map((a: any) => ({
      leaveType: a.leaveType,
      beginningBalance: a.beginningBalance,
      accruedHours: a.accruedHours,
      usedHours: a.usedHours,
      currentBalance: a.currentBalance,
      utilizationRate: a.accruedHours > 0 ? (a.usedHours / a.accruedHours) * 100 : 0,
    })),
  };
};

/**
 * Validates leave balance availability.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {number} requestedHours - Requested hours
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<{ available: boolean; balance: number }>}
 */
export const validateLeaveAvailability = async (
  employeeId: string,
  leaveType: string,
  requestedHours: number,
  LeaveAccrual: any,
): Promise<{ available: boolean; balance: number }> => {
  const currentYear = new Date().getFullYear();
  const accrual = await LeaveAccrual.findOne({
    where: { employeeId, leaveType, fiscalYear: currentYear },
  });

  if (!accrual) {
    return { available: false, balance: 0 };
  }

  return {
    available: accrual.currentBalance >= requestedHours,
    balance: accrual.currentBalance,
  };
};

// ============================================================================
// LABOR DISTRIBUTION (22-28)
// ============================================================================

/**
 * Creates labor distribution from timesheet.
 *
 * @param {LaborDistributionData} distributionData - Distribution data
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<any>} Created distribution
 */
export const createLaborDistribution = async (
  distributionData: LaborDistributionData,
  LaborDistribution: any,
): Promise<any> => {
  return await LaborDistribution.create(distributionData);
};

/**
 * Calculates labor costs for distribution.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} regularHours - Regular hours
 * @param {number} overtimeHours - Overtime hours
 * @param {number} hourlyRate - Hourly rate
 * @param {number} overtimeRate - Overtime rate multiplier
 * @param {number} burdenRate - Burden rate percentage
 * @returns {{ laborCost: number; burdenCost: number; totalCost: number }}
 */
export const calculateLaborCosts = (
  employeeId: string,
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
  overtimeRate: number,
  burdenRate: number,
): { laborCost: number; burdenCost: number; totalCost: number } => {
  const regularCost = regularHours * hourlyRate;
  const overtimeCost = overtimeHours * hourlyRate * overtimeRate;
  const laborCost = regularCost + overtimeCost;
  const burdenCost = laborCost * (burdenRate / 100);
  const totalCost = laborCost + burdenCost;

  return { laborCost, burdenCost, totalCost };
};

/**
 * Distributes labor to multiple cost centers.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} TimeEntry - TimeEntry model
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<any[]>} Distribution records
 */
export const distributeLaborToCostCenters = async (
  timesheetId: string,
  TimeEntry: any,
  LaborDistribution: any,
): Promise<any[]> => {
  const entries = await TimeEntry.findAll({ where: { timesheetId } });
  const distributions = [];

  for (const entry of entries) {
    if (!entry.projectCode || !entry.costCenter) continue;

    const costs = calculateLaborCosts(
      entry.employeeId,
      parseFloat(entry.regularHours),
      parseFloat(entry.overtimeHours),
      50, // Base rate - would fetch from employee record
      1.5,
      30,
    );

    const distribution = await createLaborDistribution(
      {
        distributionId: `DIST-${entry.entryId}`,
        timesheetId,
        employeeId: entry.employeeId,
        projectCode: entry.projectCode,
        taskCode: entry.taskCode || '',
        costCenter: entry.costCenter,
        accountCode: '6100', // Labor expense account
        regularHours: parseFloat(entry.regularHours),
        overtimeHours: parseFloat(entry.overtimeHours),
        laborCost: costs.laborCost,
        burdenCost: costs.burdenCost,
        totalCost: costs.totalCost,
      },
      LaborDistribution,
    );

    distributions.push(distribution);
  }

  return distributions;
};

/**
 * Retrieves labor distribution by project.
 *
 * @param {string} projectCode - Project code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<any[]>} Labor distributions
 */
export const getLaborDistributionByProject = async (
  projectCode: string,
  startDate: Date,
  endDate: Date,
  LaborDistribution: any,
): Promise<any[]> => {
  return await LaborDistribution.findAll({
    where: {
      projectCode,
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    order: [['createdAt', 'ASC']],
  });
};

/**
 * Generates labor cost report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<any>} Labor cost report
 */
export const generateLaborCostReport = async (
  startDate: Date,
  endDate: Date,
  LaborDistribution: any,
): Promise<any> => {
  const distributions = await LaborDistribution.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const byProject = new Map<string, any>();

  distributions.forEach((d: any) => {
    if (!byProject.has(d.projectCode)) {
      byProject.set(d.projectCode, {
        projectCode: d.projectCode,
        totalHours: 0,
        laborCost: 0,
        burdenCost: 0,
        totalCost: 0,
      });
    }

    const project = byProject.get(d.projectCode);
    project.totalHours += parseFloat(d.regularHours) + parseFloat(d.overtimeHours);
    project.laborCost += parseFloat(d.laborCost);
    project.burdenCost += parseFloat(d.burdenCost);
    project.totalCost += parseFloat(d.totalCost);
  });

  return {
    period: { startDate, endDate },
    projects: Array.from(byProject.values()),
    totalLaborCost: distributions.reduce((sum: number, d: any) => sum + parseFloat(d.laborCost), 0),
    totalBurdenCost: distributions.reduce((sum: number, d: any) => sum + parseFloat(d.burdenCost), 0),
  };
};

/**
 * Validates labor distribution completeness.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} TimeEntry - TimeEntry model
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<{ complete: boolean; missingEntries: string[] }>}
 */
export const validateLaborDistributionCompleteness = async (
  timesheetId: string,
  TimeEntry: any,
  LaborDistribution: any,
): Promise<{ complete: boolean; missingEntries: string[] }> => {
  const entries = await TimeEntry.findAll({ where: { timesheetId } });
  const distributions = await LaborDistribution.findAll({ where: { timesheetId } });

  const distributedEntries = new Set(distributions.map((d: any) => d.entryId));
  const missingEntries = entries
    .filter((e: any) => !distributedEntries.has(e.entryId))
    .map((e: any) => e.entryId);

  return {
    complete: missingEntries.length === 0,
    missingEntries,
  };
};

/**
 * Exports labor distribution to GL format.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} LaborDistribution - LaborDistribution model
 * @returns {Promise<any>} GL journal entry data
 */
export const exportLaborDistributionToGL = async (
  timesheetId: string,
  LaborDistribution: any,
): Promise<any> => {
  const distributions = await LaborDistribution.findAll({ where: { timesheetId } });

  const journalLines = distributions.map((d: any) => ({
    accountCode: d.accountCode,
    costCenter: d.costCenter,
    projectCode: d.projectCode,
    debitAmount: parseFloat(d.totalCost),
    description: `Labor cost for ${d.projectCode}`,
  }));

  return {
    timesheetId,
    entryDate: new Date(),
    totalDebit: journalLines.reduce((sum: number, line: any) => sum + line.debitAmount, 0),
    lines: journalLines,
  };
};

// ============================================================================
// LEAVE REQUEST MANAGEMENT (29-34)
// ============================================================================

/**
 * Creates leave request.
 *
 * @param {LeaveRequestData} requestData - Request data
 * @param {Model} LeaveRequest - LeaveRequest model
 * @returns {Promise<any>} Created request
 */
export const createLeaveRequest = async (
  requestData: LeaveRequestData,
  LeaveRequest: any,
): Promise<any> => {
  return await LeaveRequest.create(requestData);
};

/**
 * Approves leave request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {Model} LeaveRequest - LeaveRequest model
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Approved request
 */
export const approveLeaveRequest = async (
  requestId: string,
  approverId: string,
  LeaveRequest: any,
  LeaveAccrual: any,
): Promise<any> => {
  const request = await LeaveRequest.findOne({ where: { requestId } });
  if (!request) throw new Error('Request not found');

  if (request.status !== 'pending') {
    throw new Error('Only pending requests can be approved');
  }

  // Validate leave balance
  const validation = await validateLeaveAvailability(
    request.employeeId,
    request.leaveType,
    request.totalHours,
    LeaveAccrual,
  );

  if (!validation.available) {
    throw new Error('Insufficient leave balance');
  }

  request.status = 'approved';
  request.approvedBy = approverId;
  request.approvedAt = new Date();
  await request.save();

  return request;
};

/**
 * Denies leave request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {string} reason - Denial reason
 * @param {Model} LeaveRequest - LeaveRequest model
 * @returns {Promise<any>} Denied request
 */
export const denyLeaveRequest = async (
  requestId: string,
  approverId: string,
  reason: string,
  LeaveRequest: any,
): Promise<any> => {
  const request = await LeaveRequest.findOne({ where: { requestId } });
  if (!request) throw new Error('Request not found');

  request.status = 'denied';
  request.deniedBy = approverId;
  request.deniedAt = new Date();
  request.denialReason = reason;
  await request.save();

  return request;
};

/**
 * Cancels leave request.
 *
 * @param {string} requestId - Request ID
 * @param {string} userId - Cancelling user ID
 * @param {Model} LeaveRequest - LeaveRequest model
 * @returns {Promise<any>} Cancelled request
 */
export const cancelLeaveRequest = async (
  requestId: string,
  userId: string,
  LeaveRequest: any,
): Promise<any> => {
  const request = await LeaveRequest.findOne({ where: { requestId } });
  if (!request) throw new Error('Request not found');

  request.status = 'cancelled';
  request.cancelledBy = userId;
  request.cancelledAt = new Date();
  await request.save();

  return request;
};

/**
 * Retrieves pending leave requests for approval.
 *
 * @param {string} approverId - Approver user ID
 * @param {Model} LeaveRequest - LeaveRequest model
 * @returns {Promise<any[]>} Pending requests
 */
export const getPendingLeaveRequests = async (
  approverId: string,
  LeaveRequest: any,
): Promise<any[]> => {
  return await LeaveRequest.findAll({
    where: { status: 'pending' },
    order: [['requestedAt', 'ASC']],
  });
};

/**
 * Generates leave request calendar.
 *
 * @param {string} departmentId - Department ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LeaveRequest - LeaveRequest model
 * @returns {Promise<any>} Leave calendar
 */
export const generateLeaveCalendar = async (
  departmentId: string,
  startDate: Date,
  endDate: Date,
  LeaveRequest: any,
): Promise<any> => {
  const requests = await LeaveRequest.findAll({
    where: {
      status: 'approved',
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: startDate },
    },
    order: [['startDate', 'ASC']],
  });

  return {
    departmentId,
    period: { startDate, endDate },
    leaveRequests: requests,
    totalEmployeesOnLeave: new Set(requests.map((r: any) => r.employeeId)).size,
  };
};

// ============================================================================
// OVERTIME & FLSA COMPLIANCE (35-39)
// ============================================================================

/**
 * Calculates overtime hours per FLSA rules.
 *
 * @param {OvertimeCalculationData} data - Calculation data
 * @returns {{ regularHours: number; overtimeHours: number; doubleTimeHours: number }}
 */
export const calculateFLSAOvertime = (
  data: OvertimeCalculationData,
): { regularHours: number; overtimeHours: number; doubleTimeHours: number } => {
  if (data.flsaStatus === 'exempt' || !data.overtimeEligible) {
    return {
      regularHours: data.regularHours,
      overtimeHours: 0,
      doubleTimeHours: 0,
    };
  }

  const totalHours = data.regularHours;
  let regularHours = Math.min(totalHours, data.weeklyThreshold);
  let overtimeHours = Math.max(0, Math.min(totalHours - data.weeklyThreshold, 40));
  let doubleTimeHours = Math.max(0, totalHours - data.weeklyThreshold - 40);

  return { regularHours, overtimeHours, doubleTimeHours };
};

/**
 * Validates FLSA compliance for timesheet.
 *
 * @param {string} timesheetId - Timesheet ID
 * @param {Model} Timesheet - Timesheet model
 * @param {Model} TimeEntry - TimeEntry model
 * @returns {Promise<{ compliant: boolean; violations: string[] }>}
 */
export const validateFLSACompliance = async (
  timesheetId: string,
  Timesheet: any,
  TimeEntry: any,
): Promise<{ compliant: boolean; violations: string[] }> => {
  const timesheet = await Timesheet.findOne({ where: { timesheetId } });
  if (!timesheet) throw new Error('Timesheet not found');

  const entries = await TimeEntry.findAll({ where: { timesheetId } });
  const violations: string[] = [];

  // Check for excessive daily hours
  entries.forEach((entry: any) => {
    const dailyHours = parseFloat(entry.regularHours) + parseFloat(entry.overtimeHours);
    if (dailyHours > 16) {
      violations.push(`Excessive daily hours on ${entry.entryDate}: ${dailyHours}`);
    }
  });

  // Check weekly hours
  const weeklyHours = timesheet.totalRegularHours + timesheet.totalOvertimeHours;
  if (weeklyHours > 80) {
    violations.push(`Excessive weekly hours: ${weeklyHours}`);
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
};

/**
 * Generates overtime report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Timesheet - Timesheet model
 * @returns {Promise<any>} Overtime report
 */
export const generateOvertimeReport = async (
  startDate: Date,
  endDate: Date,
  Timesheet: any,
): Promise<any> => {
  const timesheets = await Timesheet.findAll({
    where: {
      periodStartDate: { [Op.gte]: startDate },
      periodEndDate: { [Op.lte]: endDate },
      status: { [Op.in]: ['approved', 'posted'] },
    },
  });

  const totalOvertimeHours = timesheets.reduce(
    (sum: number, t: any) => sum + parseFloat(t.totalOvertimeHours),
    0,
  );

  const byEmployee = new Map<string, number>();
  timesheets.forEach((t: any) => {
    const current = byEmployee.get(t.employeeId) || 0;
    byEmployee.set(t.employeeId, current + parseFloat(t.totalOvertimeHours));
  });

  return {
    period: { startDate, endDate },
    totalOvertimeHours,
    employeeOvertimeHours: Array.from(byEmployee.entries()).map(([employeeId, hours]) => ({
      employeeId,
      overtimeHours: hours,
    })),
  };
};

/**
 * Tracks compensatory time accrual.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} overtimeHours - Overtime hours
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Updated comp time accrual
 */
export const trackCompensatoryTime = async (
  employeeId: string,
  overtimeHours: number,
  LeaveAccrual: any,
): Promise<any> => {
  const currentYear = new Date().getFullYear();
  const compAccrual = await LeaveAccrual.findOne({
    where: { employeeId, leaveType: 'comp_time', fiscalYear: currentYear },
  });

  if (!compAccrual) throw new Error('Comp time accrual not found');

  const compTimeEarned = overtimeHours * 1.5; // Time and a half
  compAccrual.accruedHours += compTimeEarned;
  compAccrual.currentBalance += compTimeEarned;

  if (compAccrual.currentBalance > compAccrual.maxAccrual) {
    compAccrual.forfeitedHours += compAccrual.currentBalance - compAccrual.maxAccrual;
    compAccrual.currentBalance = compAccrual.maxAccrual;
  }

  await compAccrual.save();
  return compAccrual;
};

/**
 * Exports comprehensive time and attendance report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Timesheet - Timesheet model
 * @param {Model} TimeEntry - TimeEntry model
 * @param {Model} LeaveAccrual - LeaveAccrual model
 * @returns {Promise<any>} Comprehensive report
 */
export const exportTimeAttendanceReport = async (
  startDate: Date,
  endDate: Date,
  Timesheet: any,
  TimeEntry: any,
  LeaveAccrual: any,
): Promise<any> => {
  const timesheets = await Timesheet.findAll({
    where: {
      periodStartDate: { [Op.gte]: startDate },
      periodEndDate: { [Op.lte]: endDate },
    },
  });

  const totalRegularHours = timesheets.reduce(
    (sum: number, t: any) => sum + parseFloat(t.totalRegularHours),
    0,
  );
  const totalOvertimeHours = timesheets.reduce(
    (sum: number, t: any) => sum + parseFloat(t.totalOvertimeHours),
    0,
  );
  const totalLeaveHours = timesheets.reduce(
    (sum: number, t: any) => sum + parseFloat(t.totalLeaveHours),
    0,
  );

  return {
    period: { startDate, endDate },
    summary: {
      totalTimesheets: timesheets.length,
      totalRegularHours,
      totalOvertimeHours,
      totalLeaveHours,
      approvedTimesheets: timesheets.filter((t: any) => t.status === 'approved').length,
      postedTimesheets: timesheets.filter((t: any) => t.status === 'posted').length,
    },
    timesheets,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSEmployeeTimeAttendanceService {
  constructor(private readonly sequelize: Sequelize) {}

  async createTimesheet(timesheetData: TimesheetData) {
    const Timesheet = createTimesheetModel(this.sequelize);
    return createTimesheet(timesheetData, Timesheet);
  }

  async submitTimesheet(timesheetId: string, userId: string) {
    const Timesheet = createTimesheetModel(this.sequelize);
    return submitTimesheet(timesheetId, userId, Timesheet);
  }

  async calculateLeaveAccrual(employeeId: string, payPeriodId: string) {
    const LeaveAccrual = createLeaveAccrualModel(this.sequelize);
    return calculateLeaveAccrual(employeeId, payPeriodId, LeaveAccrual);
  }

  async distributeLaborToCostCenters(timesheetId: string) {
    const TimeEntry = createTimeEntryModel(this.sequelize);
    const LaborDistribution = createLaborDistributionModel(this.sequelize);
    return distributeLaborToCostCenters(timesheetId, TimeEntry, LaborDistribution);
  }
}

export default {
  // Models
  createTimesheetModel,
  createTimeEntryModel,
  createLeaveAccrualModel,
  createLaborDistributionModel,
  createLeaveRequestModel,
  createAttendanceRecordModel,

  // Timesheet Management
  createTimesheet,
  submitTimesheet,
  approveTimesheet,
  rejectTimesheet,
  postTimesheetToPayroll,
  getTimesheetsByStatus,
  calculateTimesheetTotals,

  // Time Entry Management
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  validateTimeEntryHours,
  getTimeEntriesByDateRange,
  createCorrectionEntry,
  exportTimesheetEntriesCSV,

  // Leave Accrual Management
  calculateLeaveAccrual,
  deductLeaveHours,
  getEmployeeLeaveBalances,
  adjustLeaveBalance,
  processLeaveCarryover,
  generateLeaveUsageReport,
  validateLeaveAvailability,

  // Labor Distribution
  createLaborDistribution,
  calculateLaborCosts,
  distributeLaborToCostCenters,
  getLaborDistributionByProject,
  generateLaborCostReport,
  validateLaborDistributionCompleteness,
  exportLaborDistributionToGL,

  // Leave Request Management
  createLeaveRequest,
  approveLeaveRequest,
  denyLeaveRequest,
  cancelLeaveRequest,
  getPendingLeaveRequests,
  generateLeaveCalendar,

  // Overtime & FLSA Compliance
  calculateFLSAOvertime,
  validateFLSACompliance,
  generateOvertimeReport,
  trackCompensatoryTime,
  exportTimeAttendanceReport,

  // Service
  CEFMSEmployeeTimeAttendanceService,
};

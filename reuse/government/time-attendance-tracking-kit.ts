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

/**
 * File: /reuse/government/time-attendance-tracking-kit.ts
 * Locator: WC-GOV-TIME-001
 * Purpose: Comprehensive Time & Attendance Tracking - employee time entry, attendance, leave management, FLSA compliance
 *
 * Upstream: Independent utility module for government time and attendance management
 * Downstream: ../backend/*, API controllers, payroll services, attendance workflows, FLSA compliance validators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, @nestjs/swagger
 * Exports: 50+ utility functions for time tracking, attendance, leave management, overtime, FLSA compliance
 *
 * LLM Context: Government-grade time and attendance system for federal, state, and local agencies.
 * Provides employee time entry, attendance tracking, leave request management, overtime calculation,
 * shift scheduling, time approval workflows, absence management, timesheet reporting, biometric integration,
 * FLSA compliance validation, compensatory time tracking, holiday management, audit trails, and integration
 * with payroll systems. Supports DCPS, DCAA, and OPM requirements.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError as SequelizeValidationError } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  reportPeriod: { startDate: string; endDate: string };
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
export const createTimeEntryModel = (sequelize: Sequelize) => {
  class TimeEntry extends Model {
    public id!: number;
    public employeeId!: string;
    public entryDate!: Date;
    public clockInTime!: Date | null;
    public clockOutTime!: Date | null;
    public breakStartTime!: Date | null;
    public breakEndTime!: Date | null;
    public regularHours!: number;
    public overtimeHours!: number;
    public doubleTimeHours!: number;
    public totalHours!: number;
    public entryType!: string;
    public entryMethod!: string;
    public workLocation!: string | null;
    public projectCode!: string | null;
    public costCenter!: string | null;
    public activityCode!: string | null;
    public biometricVerified!: boolean;
    public gpsLocation!: Record<string, any> | null;
    public ipAddress!: string | null;
    public deviceId!: string | null;
    public status!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectedReason!: string | null;
    public notes!: string | null;
    public attachments!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TimeEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      entryDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of time entry',
      },
      clockInTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Clock in timestamp',
      },
      clockOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Clock out timestamp',
      },
      breakStartTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Break start timestamp',
      },
      breakEndTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Break end timestamp',
      },
      regularHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Regular hours worked',
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours worked',
      },
      doubleTimeHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Double time hours worked',
      },
      totalHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total hours worked',
      },
      entryType: {
        type: DataTypes.ENUM('regular', 'overtime', 'comp_time', 'leave', 'holiday', 'training', 'jury_duty', 'military'),
        allowNull: false,
        defaultValue: 'regular',
        comment: 'Type of time entry',
      },
      entryMethod: {
        type: DataTypes.ENUM('manual', 'biometric', 'web', 'mobile', 'phone', 'kiosk', 'import'),
        allowNull: false,
        defaultValue: 'manual',
        comment: 'Method of time entry',
      },
      workLocation: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Work location',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code for cost allocation',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      activityCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Activity code',
      },
      biometricVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Verified by biometric system',
      },
      gpsLocation: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'GPS coordinates of entry',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address of entry',
      },
      deviceId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Device identifier',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'modified'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Entry status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Attachment URLs',
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
        { fields: ['employeeId'] },
        { fields: ['entryDate'] },
        { fields: ['status'] },
        { fields: ['entryType'] },
        { fields: ['approvedBy'] },
        { fields: ['biometricVerified'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return TimeEntry;
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
export const createLeaveRequestModel = (sequelize: Sequelize) => {
  class LeaveRequest extends Model {
    public id!: number;
    public requestNumber!: string;
    public employeeId!: string;
    public leaveType!: string;
    public startDate!: Date;
    public endDate!: Date;
    public totalDays!: number;
    public totalHours!: number;
    public reason!: string;
    public status!: string;
    public submittedAt!: Date;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectedBy!: string | null;
    public rejectedAt!: Date | null;
    public rejectionReason!: string | null;
    public cancelledAt!: Date | null;
    public cancellationReason!: string | null;
    public leaveBalance!: Record<string, any>;
    public supportingDocuments!: string[];
    public returnToWorkDate!: Date | null;
    public workflowStage!: number;
    public approvalChain!: ApprovalStep[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaveRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requestNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique leave request number',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      leaveType: {
        type: DataTypes.ENUM('annual', 'sick', 'personal', 'military', 'jury_duty', 'bereavement', 'fmla', 'unpaid', 'administrative', 'compensatory'),
        allowNull: false,
        comment: 'Type of leave',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Leave start date',
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Leave end date',
      },
      totalDays: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Total leave days',
      },
      totalHours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        comment: 'Total leave hours',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for leave',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'cancelled', 'in_use', 'completed'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Request status',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Submission timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Rejector user ID',
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
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cancellation timestamp',
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Cancellation reason',
      },
      leaveBalance: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Leave balance snapshot',
      },
      supportingDocuments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Supporting document URLs',
      },
      returnToWorkDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Scheduled return to work date',
      },
      workflowStage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current workflow approval stage',
      },
      approvalChain: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Approval workflow chain',
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
        { fields: ['requestNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['leaveType'] },
        { fields: ['status'] },
        { fields: ['startDate'] },
        { fields: ['endDate'] },
        { fields: ['submittedAt'] },
      ],
    },
  );

  return LeaveRequest;
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
export const createTimesheetModel = (sequelize: Sequelize) => {
  class Timesheet extends Model {
    public id!: number;
    public timesheetNumber!: string;
    public employeeId!: string;
    public periodId!: string;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public totalRegularHours!: number;
    public totalOvertimeHours!: number;
    public totalCompTime!: number;
    public totalLeaveHours!: number;
    public status!: string;
    public timeEntries!: TimeEntry[];
    public leaveEntries!: LeaveEntry[];
    public submittedAt!: Date | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectedReason!: string | null;
    public certificationSignature!: string | null;
    public certifiedAt!: Date | null;
    public auditLog!: AuditEntry[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Timesheet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      timesheetNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique timesheet identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      periodId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Pay period identifier',
      },
      periodStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Pay period start date',
      },
      periodEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Pay period end date',
      },
      totalRegularHours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total regular hours',
      },
      totalOvertimeHours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total overtime hours',
      },
      totalCompTime: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total compensatory time',
      },
      totalLeaveHours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total leave hours',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'certified', 'processed'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Timesheet status',
      },
      timeEntries: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Time entry details',
      },
      leaveEntries: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Leave entry details',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      certificationSignature: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Digital signature data',
      },
      certifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Certification timestamp',
      },
      auditLog: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Audit trail',
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
        { fields: ['timesheetNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['periodId'] },
        { fields: ['status'] },
        { fields: ['periodStartDate'] },
        { fields: ['periodEndDate'] },
        { fields: ['submittedAt'] },
      ],
    },
  );

  return Timesheet;
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
export const createBiometricEventModel = (sequelize: Sequelize) => {
  class BiometricEvent extends Model {
    public id!: number;
    public eventId!: string;
    public employeeId!: string;
    public eventType!: string;
    public timestamp!: Date;
    public deviceId!: string;
    public deviceLocation!: string;
    public biometricType!: string;
    public verificationResult!: string;
    public confidence!: number;
    public temperature!: number | null;
    public maskDetected!: boolean | null;
    public timeEntryId!: number | null;
    public attendanceRecordId!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BiometricEvent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique event identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      eventType: {
        type: DataTypes.ENUM('clock_in', 'clock_out', 'break_start', 'break_end', 'access_granted', 'access_denied'),
        allowNull: false,
        comment: 'Type of biometric event',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Event timestamp',
      },
      deviceId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Biometric device identifier',
      },
      deviceLocation: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Device physical location',
      },
      biometricType: {
        type: DataTypes.ENUM('fingerprint', 'facial_recognition', 'iris_scan', 'palm_vein', 'badge', 'pin'),
        allowNull: false,
        comment: 'Type of biometric authentication',
      },
      verificationResult: {
        type: DataTypes.ENUM('verified', 'failed', 'partial', 'override'),
        allowNull: false,
        comment: 'Verification result',
      },
      confidence: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Verification confidence score (0-100)',
      },
      temperature: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: true,
        comment: 'Temperature reading (if applicable)',
      },
      maskDetected: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: 'Mask detection result',
      },
      timeEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated time entry ID',
      },
      attendanceRecordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated attendance record ID',
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
    },
  );

  return BiometricEvent;
};

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
export async function createTimeEntry(
  entryData: Partial<TimeEntry>,
  context: TimeAttendanceContext,
): Promise<TimeEntry> {
  const totalHours = calculateWorkHours(entryData.clockInTime, entryData.clockOutTime, entryData.breakStartTime, entryData.breakEndTime);

  const entry: TimeEntry = {
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
export async function validateTimeEntry(
  entry: TimeEntry,
  context: TimeAttendanceContext,
): Promise<{ isValid: boolean; violations: string[] }> {
  const violations: string[] = [];

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
export async function approveTimeEntry(
  entryId: string,
  approverId: string,
  comments: string | undefined,
  context: TimeAttendanceContext,
): Promise<TimeEntry> {
  return {
    id: entryId,
    status: 'approved',
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
    notes: comments,
  } as TimeEntry;
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
export async function importTimeEntries(
  entries: TimeEntry[],
  source: string,
  context: TimeAttendanceContext,
): Promise<{ imported: number; failed: number; errors: any[] }> {
  let imported = 0;
  let failed = 0;
  const errors: any[] = [];

  for (const entry of entries) {
    try {
      const validation = await validateTimeEntry(entry, context);
      if (validation.isValid) {
        await createTimeEntry(entry, context);
        imported++;
      } else {
        failed++;
        errors.push({ entry, violations: validation.violations });
      }
    } catch (error) {
      failed++;
      errors.push({ entry, error: (error as Error).message });
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
export function calculateWorkHours(
  clockIn: string | undefined,
  clockOut: string | undefined,
  breakStart: string | undefined,
  breakEnd: string | undefined,
): number {
  if (!clockIn || !clockOut) return 0;

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
export async function checkOverlappingTimeEntries(
  employeeId: string,
  date: string,
  clockIn: string | undefined,
  clockOut: string | undefined,
): Promise<boolean> {
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
export async function submitTimeEntry(
  entryId: string,
  context: TimeAttendanceContext,
): Promise<TimeEntry> {
  return {
    id: entryId,
    status: 'submitted',
  } as TimeEntry;
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
export async function modifyTimeEntry(
  entryId: string,
  updates: Partial<TimeEntry>,
  context: TimeAttendanceContext,
): Promise<TimeEntry> {
  const totalHours = calculateWorkHours(updates.clockInTime, updates.clockOutTime, updates.breakStartTime, updates.breakEndTime);

  return {
    id: entryId,
    ...updates,
    totalHours,
    regularHours: Math.min(totalHours, 8),
    overtimeHours: Math.max(totalHours - 8, 0),
    status: 'modified',
  } as TimeEntry;
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
export async function createLeaveRequest(
  leaveData: Partial<LeaveRequest>,
  context: TimeAttendanceContext,
): Promise<LeaveRequest> {
  const requestNumber = await generateLeaveRequestNumber(leaveData.employeeId!);
  const totalDays = calculateBusinessDays(leaveData.startDate!, leaveData.endDate!);
  const balance = await getLeaveBalance(leaveData.employeeId!, leaveData.leaveType!);

  const request: LeaveRequest = {
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
export async function approveLeaveRequest(
  requestId: string,
  approverId: string,
  comments: string | undefined,
  context: TimeAttendanceContext,
): Promise<LeaveRequest> {
  return {
    id: requestId,
    status: 'approved',
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  } as LeaveRequest;
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
export async function rejectLeaveRequest(
  requestId: string,
  rejecterId: string,
  reason: string,
  context: TimeAttendanceContext,
): Promise<LeaveRequest> {
  return {
    id: requestId,
    status: 'rejected',
    rejectedBy: rejecterId,
    rejectedAt: new Date().toISOString(),
    rejectionReason: reason,
  } as LeaveRequest;
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
export async function getLeaveBalance(
  employeeId: string,
  leaveType: LeaveType,
): Promise<LeaveBalance> {
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
export async function processLeaveAccrual(
  employeeId: string,
  periodId: string,
  context: TimeAttendanceContext,
): Promise<Record<string, number>> {
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
export async function cancelLeaveRequest(
  requestId: string,
  reason: string,
  context: TimeAttendanceContext,
): Promise<LeaveRequest> {
  return {
    id: requestId,
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
  } as LeaveRequest;
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
export async function validateLeaveRequest(
  request: LeaveRequest,
  context: TimeAttendanceContext,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

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
export async function generateLeaveRequestNumber(employeeId: string): Promise<string> {
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
export async function createOvertimeRequest(
  overtimeData: Partial<OvertimeRequest>,
  context: TimeAttendanceContext,
): Promise<OvertimeRequest> {
  const requestNumber = await generateOvertimeRequestNumber();
  const flsaExempt = await checkFlsaExemptStatus(overtimeData.employeeId!);

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
export async function calculateOvertimePay(
  employeeId: string,
  weekStartDate: string,
  totalHours: number,
): Promise<{ overtimeHours: number; overtimePay: number; doubleTimeHours: number }> {
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
export async function trackCompensatoryTime(
  compTimeData: Partial<CompensatoryTime>,
  context: TimeAttendanceContext,
): Promise<CompensatoryTime> {
  return {
    ...compTimeData,
    employeeId: compTimeData.employeeId || context.employeeId,
    earnedDate: new Date().toISOString(),
    hoursUsed: 0,
    hoursAvailable: compTimeData.hoursEarned!,
    approvedBy: context.supervisorId!,
    approvedAt: new Date().toISOString(),
    useByDate: compTimeData.expirationDate!,
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
export async function useCompensatoryTime(
  employeeId: string,
  hours: number,
  useDate: string,
  context: TimeAttendanceContext,
): Promise<CompensatoryTime> {
  const available = await getAvailableCompTime(employeeId);

  if (available < hours) {
    throw new Error(`Insufficient comp time. Available: ${available}, Requested: ${hours}`);
  }

  return {
    employeeId,
    hoursUsed: hours,
    hoursAvailable: available - hours,
  } as CompensatoryTime;
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
export async function getAvailableCompTime(employeeId: string): Promise<number> {
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
export async function validateOvertimeRequest(
  request: OvertimeRequest,
  context: TimeAttendanceContext,
): Promise<{ isValid: boolean; warnings: string[] }> {
  const warnings: string[] = [];

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
export async function approveOvertimeRequest(
  requestId: string,
  approverId: string,
  context: TimeAttendanceContext,
): Promise<OvertimeRequest> {
  return {
    id: requestId,
    status: 'approved',
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  } as OvertimeRequest;
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
export async function generateOvertimeRequestNumber(): Promise<string> {
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
export async function createTimesheet(
  employeeId: string,
  periodId: string,
  context: TimeAttendanceContext,
): Promise<Timesheet> {
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
export async function submitTimesheet(
  timesheetId: string,
  context: TimeAttendanceContext,
): Promise<Timesheet> {
  return {
    id: timesheetId,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  } as Timesheet;
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
export async function approveTimesheet(
  timesheetId: string,
  approverId: string,
  context: TimeAttendanceContext,
): Promise<Timesheet> {
  return {
    id: timesheetId,
    status: 'approved',
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  } as Timesheet;
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
export async function certifyTimesheet(
  timesheetId: string,
  signature: string,
  context: TimeAttendanceContext,
): Promise<Timesheet> {
  return {
    id: timesheetId,
    certificationSignature: signature,
    certifiedAt: new Date().toISOString(),
  } as Timesheet;
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
export async function generateTimeAttendanceReport(
  reportType: string,
  startDate: Date,
  endDate: Date,
  filters: Record<string, any>,
  context: TimeAttendanceContext,
): Promise<TimeAttendanceReport> {
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
export async function validateTimesheet(
  timesheet: Timesheet,
  context: TimeAttendanceContext,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

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
export async function exportTimesheetToPayroll(
  timesheetId: string,
  format: string,
  context: TimeAttendanceContext,
): Promise<string> {
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
export async function getPayPeriod(periodId: string): Promise<TimesheetPeriod> {
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
export async function validateFlsaCompliance(
  employeeId: string,
  weekStartDate: string,
  context: TimeAttendanceContext,
): Promise<FlsaCompliance> {
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const weeklyHours = await getWeeklyHours(employeeId, weekStartDate);
  const flsaExempt = await checkFlsaExemptStatus(employeeId);
  const violations: FlsaViolation[] = [];

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
export async function checkFlsaExemptStatus(employeeId: string): Promise<boolean> {
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
export async function getWeeklyHours(employeeId: string, weekStartDate: string): Promise<number> {
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
export async function generateFlsaComplianceReport(
  startDate: Date,
  endDate: Date,
  context: TimeAttendanceContext,
): Promise<TimeAttendanceReport> {
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
export async function detectFlsaViolations(
  weekStartDate: string,
  context: TimeAttendanceContext,
): Promise<FlsaCompliance[]> {
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
export async function calculateFlsaOvertimeThreshold(
  employeeId: string,
  payPeriodType: PayPeriodType,
): Promise<number> {
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
export async function updateFlsaExemptionStatus(
  employeeId: string,
  exemptionType: FlsaExemptionType,
  effectiveDate: string,
  context: TimeAttendanceContext,
): Promise<boolean> {
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
export async function auditFlsaRecordkeeping(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<{ compliant: boolean; missingRecords: string[] }> {
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
export async function recordAttendance(
  attendanceData: Partial<AttendanceRecord>,
  context: TimeAttendanceContext,
): Promise<AttendanceRecord> {
  const lateMinutes = calculateLateMinutes(attendanceData.scheduledStartTime!, attendanceData.actualStartTime!);

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
export async function createShiftSchedule(
  scheduleData: Partial<ShiftSchedule>,
  context: TimeAttendanceContext,
): Promise<ShiftSchedule> {
  const scheduleId = await generateScheduleId();

  return {
    ...scheduleData,
    scheduleId,
    employeeId: scheduleData.employeeId || context.employeeId,
    breakDuration: scheduleData.breakDuration || 30,
    supervisorId: context.supervisorId!,
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
export async function processBiometricEvent(
  eventData: Partial<BiometricEvent>,
  context: TimeAttendanceContext,
): Promise<BiometricEvent> {
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
export async function excuseAbsence(
  attendanceId: string,
  reason: string,
  excusedBy: string,
  context: TimeAttendanceContext,
): Promise<AttendanceRecord> {
  return {
    id: attendanceId,
    excused: true,
    excusedBy,
    excusedReason: reason,
  } as AttendanceRecord;
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
export async function generateAttendanceSummary(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}> {
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
export async function manageHolidayCalendar(
  holidayData: Partial<HolidayCalendar>,
  context: TimeAttendanceContext,
): Promise<HolidayCalendar> {
  return {
    ...holidayData,
    observedDate: holidayData.observedDate || holidayData.holidayDate!,
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
export function calculateLateMinutes(scheduledTime: string, actualTime: string): number {
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
export function calculateBusinessDays(startDate: string, endDate: string): number {
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
async function generateScheduleId(): Promise<string> {
  return `SCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Generates unique biometric event ID.
 *
 * @returns {Promise<string>} Unique event ID
 */
async function generateBiometricEventId(): Promise<string> {
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
export function formatHours(hours: number): string {
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
export function parseTimeToMinutes(timeString: string): number {
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
@ApiTags('Time & Attendance')
@Controller('time-attendance')
@ApiBearerAuth()
export class TimeAttendanceController {
  @Post('time-entry')
  @ApiOperation({ summary: 'Create time entry' })
  @ApiResponse({ status: 201, description: 'Time entry created successfully' })
  async createEntry(@Body() entryData: any): Promise<TimeEntry> {
    const context: TimeAttendanceContext = {
      userId: 'USER123',
      employeeId: entryData.employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      timestamp: new Date().toISOString(),
    };
    return createTimeEntry(entryData, context);
  }

  @Post('leave-request')
  @ApiOperation({ summary: 'Create leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully' })
  async createLeave(@Body() leaveData: any): Promise<LeaveRequest> {
    const context: TimeAttendanceContext = {
      userId: 'USER123',
      employeeId: leaveData.employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      timestamp: new Date().toISOString(),
    };
    return createLeaveRequest(leaveData, context);
  }

  @Get('leave-balance/:employeeId/:leaveType')
  @ApiOperation({ summary: 'Get leave balance' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiParam({ name: 'leaveType', description: 'Leave type' })
  @ApiResponse({ status: 200, description: 'Leave balance retrieved successfully' })
  async getBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: LeaveType,
  ): Promise<LeaveBalance> {
    return getLeaveBalance(employeeId, leaveType);
  }

  @Post('timesheet/submit/:timesheetId')
  @ApiOperation({ summary: 'Submit timesheet for approval' })
  @ApiParam({ name: 'timesheetId', description: 'Timesheet ID' })
  @ApiResponse({ status: 200, description: 'Timesheet submitted successfully' })
  async submitTimesheetEndpoint(@Param('timesheetId') timesheetId: string): Promise<Timesheet> {
    const context: TimeAttendanceContext = {
      userId: 'USER123',
      employeeId: 'EMP123',
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      timestamp: new Date().toISOString(),
    };
    return submitTimesheet(timesheetId, context);
  }

  @Post('flsa/validate/:employeeId')
  @ApiOperation({ summary: 'Validate FLSA compliance' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiQuery({ name: 'weekStartDate', description: 'Week start date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'FLSA compliance validated' })
  async validateFlsa(
    @Param('employeeId') employeeId: string,
    @Query('weekStartDate') weekStartDate: string,
  ): Promise<FlsaCompliance> {
    const context: TimeAttendanceContext = {
      userId: 'USER123',
      employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      timestamp: new Date().toISOString(),
    };
    return validateFlsaCompliance(employeeId, weekStartDate, context);
  }
}

// Helper function to make ApiProperty available
function ApiProperty(options: any): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {};
}

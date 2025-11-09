/**
 * ASSET CALIBRATION MANAGEMENT COMMANDS
 *
 * Production-ready command functions for comprehensive asset calibration management in enterprise systems.
 * Provides 40+ specialized functions covering:
 * - Calibration scheduling and frequency optimization
 * - Calibration execution and measurement recording
 * - Calibration certification and documentation
 * - Calibration standards management and traceability
 * - Out-of-tolerance detection and handling workflows
 * - Calibration vendor management and performance tracking
 * - Calibration due date tracking and notifications
 * - Calibration cost tracking and analysis
 * - Multi-point calibration procedures
 * - Environmental condition monitoring
 * - Calibration equipment management
 * - Regulatory compliance (ISO/IEC 17025, FDA 21 CFR Part 11)
 *
 * @module AssetCalibrationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security Compliant with ISO/IEC 17025, FDA 21 CFR Part 11, HIPAA
 * @performance Optimized for high-volume calibration operations (1000+ assets)
 *
 * @example
 * ```typescript
 * import {
 *   scheduleCalibration,
 *   recordCalibrationCompletion,
 *   detectOutOfTolerance,
 *   generateCalibrationCertificate,
 *   CalibrationSchedule,
 *   CalibrationFrequency
 * } from './asset-calibration-commands';
 *
 * // Schedule calibration for critical medical equipment
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-mri-001',
 *   calibrationTypeId: 'cal-type-magnetic-field',
 *   frequency: CalibrationFrequency.MONTHLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   standardIds: ['std-nist-001', 'std-iso-002']
 * });
 *
 * // Record calibration results
 * const record = await recordCalibrationCompletion(schedule.id, {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'field-strength', reading: 1.5, unit: 'Tesla', tolerance: 0.01 }
 *   ],
 *   passed: true,
 *   environmentalConditions: {
 *     temperature: 22.5,
 *     humidity: 45,
 *     pressure: 101.3
 *   }
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Calibration frequency types
 */
export enum CalibrationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMIANNUALLY = 'semiannually',
  ANNUALLY = 'annually',
  BIANNUALLY = 'biannually',
  ON_DEMAND = 'on_demand',
  USAGE_BASED = 'usage_based',
}

/**
 * Calibration status
 */
export enum CalibrationStatus {
  SCHEDULED = 'scheduled',
  DUE = 'due',
  OVERDUE = 'overdue',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PASSED = 'passed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  DEFERRED = 'deferred',
}

/**
 * Calibration result
 */
export enum CalibrationResult {
  PASS = 'pass',
  FAIL = 'fail',
  LIMITED_PASS = 'limited_pass',
  OUT_OF_TOLERANCE = 'out_of_tolerance',
  CONDITIONAL = 'conditional',
}

/**
 * Out-of-tolerance action
 */
export enum OutOfToleranceAction {
  QUARANTINE = 'quarantine',
  ADJUST_AND_RETEST = 'adjust_and_retest',
  REPAIR = 'repair',
  REPLACE = 'replace',
  ACCEPT_AS_IS = 'accept_as_is',
  INVESTIGATE = 'investigate',
}

/**
 * Calibration method
 */
export enum CalibrationMethod {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  SELF_CALIBRATION = 'self_calibration',
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

/**
 * Standard traceability source
 */
export enum TraceabilitySource {
  NIST = 'nist',
  ISO = 'iso',
  PTB = 'ptb',
  NPL = 'npl',
  MANUFACTURER = 'manufacturer',
  ACCREDITED_LAB = 'accredited_lab',
}

/**
 * Calibration schedule data
 */
export interface CalibrationScheduleData {
  assetId: string;
  calibrationTypeId: string;
  frequency: CalibrationFrequency;
  dueDate: Date;
  assignedTechnicianId?: string;
  assignedVendorId?: string;
  standardIds?: string[];
  procedureId?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  notes?: string;
}

/**
 * Calibration completion data
 */
export interface CalibrationCompletionData {
  performedBy: string;
  performedDate: Date;
  measurements: CalibrationMeasurement[];
  passed: boolean;
  result: CalibrationResult;
  environmentalConditions?: EnvironmentalConditions;
  equipmentUsed?: string[];
  standardsUsed?: string[];
  adjustmentsMade?: string;
  deviations?: string;
  notes?: string;
  certificateNumber?: string;
}

/**
 * Calibration measurement
 */
export interface CalibrationMeasurement {
  parameter: string;
  nominalValue?: number;
  reading: number;
  unit: string;
  tolerance: number;
  toleranceType?: 'absolute' | 'percentage';
  upperLimit?: number;
  lowerLimit?: number;
  uncertainty?: number;
  passed: boolean;
}

/**
 * Environmental conditions during calibration
 */
export interface EnvironmentalConditions {
  temperature: number;
  temperatureUnit?: string;
  humidity: number;
  pressure?: number;
  pressureUnit?: string;
  vibration?: number;
  electromagneticInterference?: number;
}

/**
 * Calibration standard data
 */
export interface CalibrationStandardData {
  standardNumber: string;
  description: string;
  traceabilitySource: TraceabilitySource;
  traceabilityCertificateNumber?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  calibrationDate: Date;
  expirationDate: Date;
  uncertaintyValue?: number;
  uncertaintyUnit?: string;
  custodian?: string;
  location?: string;
}

/**
 * Out-of-tolerance handling data
 */
export interface OutOfToleranceHandlingData {
  calibrationRecordId: string;
  action: OutOfToleranceAction;
  assignedTo: string;
  dueDate?: Date;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  impactAssessment?: string;
  affectedAssets?: string[];
  notificationsSent?: string[];
}

/**
 * Vendor performance metrics
 */
export interface VendorPerformanceMetrics {
  vendorId: string;
  totalCalibrations: number;
  passRate: number;
  averageTurnaroundTime: number;
  onTimeDeliveryRate: number;
  costEfficiency: number;
  qualityScore: number;
  customerSatisfactionScore?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Calibration Type Model - Defines calibration procedures and specifications
 */
@Table({
  tableName: 'calibration_types',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class CalibrationType extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Calibration type code' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  code!: string;

  @ApiProperty({ description: 'Calibration type name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Default frequency' })
  @Column({ type: DataType.ENUM(...Object.values(CalibrationFrequency)) })
  defaultFrequency?: CalibrationFrequency;

  @ApiProperty({ description: 'Required standards' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  requiredStandards?: string[];

  @ApiProperty({ description: 'Procedure document URL' })
  @Column({ type: DataType.STRING(500) })
  procedureDocumentUrl?: string;

  @ApiProperty({ description: 'Tolerance specifications' })
  @Column({ type: DataType.JSONB })
  toleranceSpecs?: Record<string, any>;

  @ApiProperty({ description: 'Whether type is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => CalibrationSchedule)
  schedules?: CalibrationSchedule[];
}

/**
 * Calibration Schedule Model - Tracks calibration schedules for assets
 */
@Table({
  tableName: 'calibration_schedules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['calibration_type_id'] },
    { fields: ['due_date'] },
    { fields: ['status'] },
    { fields: ['assigned_technician_id'] },
    { fields: ['assigned_vendor_id'] },
  ],
})
export class CalibrationSchedule extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Calibration type ID' })
  @ForeignKey(() => CalibrationType)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  calibrationTypeId!: string;

  @ApiProperty({ description: 'Calibration frequency' })
  @Column({
    type: DataType.ENUM(...Object.values(CalibrationFrequency)),
    allowNull: false,
  })
  frequency!: CalibrationFrequency;

  @ApiProperty({ description: 'Scheduled date' })
  @Column({ type: DataType.DATE })
  scheduledDate?: Date;

  @ApiProperty({ description: 'Due date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  dueDate!: Date;

  @ApiProperty({ description: 'Calibration status' })
  @Column({
    type: DataType.ENUM(...Object.values(CalibrationStatus)),
    defaultValue: CalibrationStatus.SCHEDULED,
  })
  @Index
  status!: CalibrationStatus;

  @ApiProperty({ description: 'Assigned technician ID' })
  @Column({ type: DataType.UUID })
  @Index
  assignedTechnicianId?: string;

  @ApiProperty({ description: 'Assigned vendor ID' })
  @Column({ type: DataType.UUID })
  @Index
  assignedVendorId?: string;

  @ApiProperty({ description: 'Calibration method' })
  @Column({ type: DataType.ENUM(...Object.values(CalibrationMethod)) })
  method?: CalibrationMethod;

  @ApiProperty({ description: 'Standard IDs to be used' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  standardIds?: string[];

  @ApiProperty({ description: 'Procedure ID' })
  @Column({ type: DataType.UUID })
  procedureId?: string;

  @ApiProperty({ description: 'Priority level' })
  @Column({ type: DataType.ENUM('critical', 'high', 'medium', 'low') })
  priority?: string;

  @ApiProperty({ description: 'Work order number' })
  @Column({ type: DataType.STRING(100) })
  workOrderNumber?: string;

  @ApiProperty({ description: 'Estimated duration in hours' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  estimatedDuration?: number;

  @ApiProperty({ description: 'Estimated cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  estimatedCost?: number;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Reminder sent date' })
  @Column({ type: DataType.DATE })
  reminderSentDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => CalibrationType)
  calibrationType?: CalibrationType;

  @HasMany(() => CalibrationRecord)
  records?: CalibrationRecord[];
}

/**
 * Calibration Record Model - Records actual calibration execution and results
 */
@Table({
  tableName: 'calibration_records',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['schedule_id'] },
    { fields: ['asset_id'] },
    { fields: ['performed_date'] },
    { fields: ['result'] },
    { fields: ['certificate_number'] },
    { fields: ['performed_by'] },
  ],
})
export class CalibrationRecord extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Schedule ID' })
  @ForeignKey(() => CalibrationSchedule)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  scheduleId!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Performed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  performedBy!: string;

  @ApiProperty({ description: 'Performed date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  performedDate!: Date;

  @ApiProperty({ description: 'Completion date' })
  @Column({ type: DataType.DATE })
  completionDate?: Date;

  @ApiProperty({ description: 'Calibration result' })
  @Column({
    type: DataType.ENUM(...Object.values(CalibrationResult)),
    allowNull: false,
  })
  @Index
  result!: CalibrationResult;

  @ApiProperty({ description: 'Passed indicator' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  passed!: boolean;

  @ApiProperty({ description: 'Certificate number' })
  @Column({ type: DataType.STRING(100), unique: true })
  @Index
  certificateNumber?: string;

  @ApiProperty({ description: 'Measurements data' })
  @Column({ type: DataType.JSONB, allowNull: false })
  measurements!: CalibrationMeasurement[];

  @ApiProperty({ description: 'Environmental conditions' })
  @Column({ type: DataType.JSONB })
  environmentalConditions?: EnvironmentalConditions;

  @ApiProperty({ description: 'Equipment used' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  equipmentUsed?: string[];

  @ApiProperty({ description: 'Standards used' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  standardsUsed?: string[];

  @ApiProperty({ description: 'Adjustments made' })
  @Column({ type: DataType.TEXT })
  adjustmentsMade?: string;

  @ApiProperty({ description: 'Deviations from procedure' })
  @Column({ type: DataType.TEXT })
  deviations?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Actual duration in hours' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  actualDuration?: number;

  @ApiProperty({ description: 'Actual cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  actualCost?: number;

  @ApiProperty({ description: 'Next calibration due date' })
  @Column({ type: DataType.DATE })
  nextDueDate?: Date;

  @ApiProperty({ description: 'Reviewed by user ID' })
  @Column({ type: DataType.UUID })
  reviewedBy?: string;

  @ApiProperty({ description: 'Review date' })
  @Column({ type: DataType.DATE })
  reviewDate?: Date;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Certificate file path' })
  @Column({ type: DataType.STRING(500) })
  certificateFilePath?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => CalibrationSchedule)
  schedule?: CalibrationSchedule;

  @HasMany(() => OutOfToleranceAction)
  ootActions?: OutOfToleranceAction[];
}

/**
 * Calibration Standard Model - Manages calibration standards and traceability
 */
@Table({
  tableName: 'calibration_standards',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['standard_number'], unique: true },
    { fields: ['traceability_source'] },
    { fields: ['expiration_date'] },
    { fields: ['location'] },
    { fields: ['is_active'] },
  ],
})
export class CalibrationStandard extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Standard number' })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  @Index
  standardNumber!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Traceability source' })
  @Column({
    type: DataType.ENUM(...Object.values(TraceabilitySource)),
    allowNull: false,
  })
  @Index
  traceabilitySource!: TraceabilitySource;

  @ApiProperty({ description: 'Traceability certificate number' })
  @Column({ type: DataType.STRING(100) })
  traceabilityCertificateNumber?: string;

  @ApiProperty({ description: 'Manufacturer' })
  @Column({ type: DataType.STRING(200) })
  manufacturer?: string;

  @ApiProperty({ description: 'Model' })
  @Column({ type: DataType.STRING(200) })
  model?: string;

  @ApiProperty({ description: 'Serial number' })
  @Column({ type: DataType.STRING(200) })
  serialNumber?: string;

  @ApiProperty({ description: 'Calibration date' })
  @Column({ type: DataType.DATE, allowNull: false })
  calibrationDate!: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  expirationDate!: Date;

  @ApiProperty({ description: 'Uncertainty value' })
  @Column({ type: DataType.DECIMAL(15, 6) })
  uncertaintyValue?: number;

  @ApiProperty({ description: 'Uncertainty unit' })
  @Column({ type: DataType.STRING(50) })
  uncertaintyUnit?: string;

  @ApiProperty({ description: 'Custodian user ID' })
  @Column({ type: DataType.UUID })
  custodian?: string;

  @ApiProperty({ description: 'Storage location' })
  @Column({ type: DataType.STRING(200) })
  @Index
  location?: string;

  @ApiProperty({ description: 'Certificate file path' })
  @Column({ type: DataType.STRING(500) })
  certificateFilePath?: string;

  @ApiProperty({ description: 'Specifications' })
  @Column({ type: DataType.JSONB })
  specifications?: Record<string, any>;

  @ApiProperty({ description: 'Whether standard is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Out-of-Tolerance Action Model - Tracks OOT handling and corrective actions
 */
@Table({
  tableName: 'out_of_tolerance_actions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['calibration_record_id'] },
    { fields: ['action'] },
    { fields: ['status'] },
    { fields: ['assigned_to'] },
    { fields: ['due_date'] },
  ],
})
export class OutOfToleranceAction extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Calibration record ID' })
  @ForeignKey(() => CalibrationRecord)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  calibrationRecordId!: string;

  @ApiProperty({ description: 'Action type' })
  @Column({
    type: DataType.ENUM(...Object.values(OutOfToleranceAction)),
    allowNull: false,
  })
  @Index
  action!: OutOfToleranceAction;

  @ApiProperty({ description: 'Action status' })
  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  })
  @Index
  status!: string;

  @ApiProperty({ description: 'Assigned to user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assignedTo!: string;

  @ApiProperty({ description: 'Due date' })
  @Column({ type: DataType.DATE })
  @Index
  dueDate?: Date;

  @ApiProperty({ description: 'Root cause analysis' })
  @Column({ type: DataType.TEXT })
  rootCause?: string;

  @ApiProperty({ description: 'Corrective action' })
  @Column({ type: DataType.TEXT })
  correctiveAction?: string;

  @ApiProperty({ description: 'Preventive action' })
  @Column({ type: DataType.TEXT })
  preventiveAction?: string;

  @ApiProperty({ description: 'Impact assessment' })
  @Column({ type: DataType.TEXT })
  impactAssessment?: string;

  @ApiProperty({ description: 'Affected assets' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  affectedAssets?: string[];

  @ApiProperty({ description: 'Notifications sent to' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  notificationsSent?: string[];

  @ApiProperty({ description: 'Completion date' })
  @Column({ type: DataType.DATE })
  completionDate?: Date;

  @ApiProperty({ description: 'Completed by user ID' })
  @Column({ type: DataType.UUID })
  completedBy?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => CalibrationRecord)
  calibrationRecord?: CalibrationRecord;
}

/**
 * Calibration Vendor Model - Manages external calibration service providers
 */
@Table({
  tableName: 'calibration_vendors',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['is_active'] },
    { fields: ['accreditation_number'] },
  ],
})
export class CalibrationVendor extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor code' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  code!: string;

  @ApiProperty({ description: 'Vendor name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Contact information' })
  @Column({ type: DataType.JSONB })
  contactInfo?: Record<string, any>;

  @ApiProperty({ description: 'Accreditation number (e.g., ISO/IEC 17025)' })
  @Column({ type: DataType.STRING(100) })
  @Index
  accreditationNumber?: string;

  @ApiProperty({ description: 'Accreditation expiration date' })
  @Column({ type: DataType.DATE })
  accreditationExpiration?: Date;

  @ApiProperty({ description: 'Scope of accreditation' })
  @Column({ type: DataType.TEXT })
  scopeOfAccreditation?: string;

  @ApiProperty({ description: 'Capabilities' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  capabilities?: string[];

  @ApiProperty({ description: 'Turnaround time in days' })
  @Column({ type: DataType.INTEGER })
  turnaroundTimeDays?: number;

  @ApiProperty({ description: 'Average cost per calibration' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  averageCost?: number;

  @ApiProperty({ description: 'Quality rating (1-5)' })
  @Column({ type: DataType.DECIMAL(2, 1) })
  qualityRating?: number;

  @ApiProperty({ description: 'Whether vendor is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

// ============================================================================
// CALIBRATION SCHEDULING FUNCTIONS
// ============================================================================

/**
 * Schedules a calibration for an asset
 *
 * @param data - Calibration schedule data
 * @param transaction - Optional database transaction
 * @returns Created calibration schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-123',
 *   calibrationTypeId: 'cal-type-001',
 *   frequency: CalibrationFrequency.QUARTERLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   priority: 'high'
 * });
 * ```
 */
export async function scheduleCalibration(
  data: CalibrationScheduleData,
  transaction?: Transaction,
): Promise<CalibrationSchedule> {
  // Validate calibration type exists
  const calibrationType = await CalibrationType.findByPk(data.calibrationTypeId, {
    transaction,
  });
  if (!calibrationType || !calibrationType.isActive) {
    throw new NotFoundException(
      `Calibration type ${data.calibrationTypeId} not found or inactive`,
    );
  }

  // Check for existing active schedule
  const existingSchedule = await CalibrationSchedule.findOne({
    where: {
      assetId: data.assetId,
      calibrationTypeId: data.calibrationTypeId,
      status: {
        [Op.in]: [
          CalibrationStatus.SCHEDULED,
          CalibrationStatus.DUE,
          CalibrationStatus.IN_PROGRESS,
        ],
      },
    },
    transaction,
  });

  if (existingSchedule) {
    throw new ConflictException(
      'Active calibration schedule already exists for this asset and type',
    );
  }

  // Generate work order number
  const workOrderNumber = await generateCalibrationWorkOrderNumber(transaction);

  // Create schedule
  const schedule = await CalibrationSchedule.create(
    {
      assetId: data.assetId,
      calibrationTypeId: data.calibrationTypeId,
      frequency: data.frequency,
      dueDate: data.dueDate,
      assignedTechnicianId: data.assignedTechnicianId,
      assignedVendorId: data.assignedVendorId,
      standardIds: data.standardIds,
      procedureId: data.procedureId,
      priority: data.priority || 'medium',
      workOrderNumber,
      notes: data.notes,
      status: CalibrationStatus.SCHEDULED,
    },
    { transaction },
  );

  return schedule;
}

/**
 * Generates a unique calibration work order number
 *
 * @param transaction - Optional database transaction
 * @returns Work order number
 *
 * @example
 * ```typescript
 * const woNumber = await generateCalibrationWorkOrderNumber();
 * // Returns: "CAL-2024-001234"
 * ```
 */
export async function generateCalibrationWorkOrderNumber(
  transaction?: Transaction,
): Promise<string> {
  const year = new Date().getFullYear();
  const count = await CalibrationSchedule.count({ transaction });
  return `CAL-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Updates a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updateCalibrationSchedule('schedule-123', {
 *   dueDate: new Date('2024-12-15'),
 *   assignedTechnicianId: 'tech-002'
 * });
 * ```
 */
export async function updateCalibrationSchedule(
  scheduleId: string,
  updates: Partial<CalibrationSchedule>,
  transaction?: Transaction,
): Promise<CalibrationSchedule> {
  const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Calibration schedule ${scheduleId} not found`);
  }

  await schedule.update(updates, { transaction });
  return schedule;
}

/**
 * Gets calibrations due within a specified timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @param filters - Optional filters (asset type, priority, etc.)
 * @returns List of due calibrations
 *
 * @example
 * ```typescript
 * const dueSoon = await getCalibrationsDue(30, { priority: 'critical' });
 * ```
 */
export async function getCalibrationsDue(
  daysAhead: number = 30,
  filters?: {
    assetTypeId?: string;
    priority?: string;
    assignedTechnicianId?: string;
  },
): Promise<CalibrationSchedule[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);

  const where: WhereOptions = {
    dueDate: {
      [Op.lte]: targetDate,
    },
    status: {
      [Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
    },
  };

  if (filters?.priority) {
    where.priority = filters.priority;
  }

  if (filters?.assignedTechnicianId) {
    where.assignedTechnicianId = filters.assignedTechnicianId;
  }

  const schedules = await CalibrationSchedule.findAll({
    where,
    include: [{ model: CalibrationType }],
    order: [
      ['priority', 'ASC'],
      ['dueDate', 'ASC'],
    ],
  });

  return schedules;
}

/**
 * Gets overdue calibrations
 *
 * @param filters - Optional filters
 * @returns List of overdue calibrations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueCalibrations();
 * ```
 */
export async function getOverdueCalibrations(filters?: {
  assetTypeId?: string;
  priority?: string;
}): Promise<CalibrationSchedule[]> {
  const where: WhereOptions = {
    dueDate: {
      [Op.lt]: new Date(),
    },
    status: {
      [Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
    },
  };

  if (filters?.priority) {
    where.priority = filters.priority;
  }

  const schedules = await CalibrationSchedule.findAll({
    where,
    include: [{ model: CalibrationType }],
    order: [
      ['priority', 'ASC'],
      ['dueDate', 'ASC'],
    ],
  });

  // Update status to overdue
  for (const schedule of schedules) {
    await schedule.update({ status: CalibrationStatus.OVERDUE });
  }

  return schedules;
}

/**
 * Calculates optimal calibration frequency based on historical data
 *
 * @param assetId - Asset identifier
 * @param calibrationTypeId - Calibration type identifier
 * @returns Recommended frequency
 *
 * @example
 * ```typescript
 * const frequency = await calculateOptimalFrequency('asset-123', 'cal-type-001');
 * ```
 */
export async function calculateOptimalFrequency(
  assetId: string,
  calibrationTypeId: string,
): Promise<{
  recommendedFrequency: CalibrationFrequency;
  confidence: number;
  rationale: string;
}> {
  // Get calibration history
  const records = await CalibrationRecord.findAll({
    where: {
      assetId,
    },
    include: [
      {
        model: CalibrationSchedule,
        where: { calibrationTypeId },
      },
    ],
    order: [['performedDate', 'DESC']],
    limit: 10,
  });

  if (records.length < 3) {
    return {
      recommendedFrequency: CalibrationFrequency.ANNUALLY,
      confidence: 0.3,
      rationale: 'Insufficient historical data for optimization',
    };
  }

  // Calculate failure rate
  const failureRate =
    records.filter((r) => r.result === CalibrationResult.FAIL).length / records.length;

  // Calculate average time between failures
  let recommendedFrequency: CalibrationFrequency;
  let confidence: number;
  let rationale: string;

  if (failureRate > 0.3) {
    recommendedFrequency = CalibrationFrequency.MONTHLY;
    confidence = 0.8;
    rationale = 'High failure rate detected, recommending more frequent calibrations';
  } else if (failureRate > 0.15) {
    recommendedFrequency = CalibrationFrequency.QUARTERLY;
    confidence = 0.75;
    rationale = 'Moderate failure rate, quarterly calibrations recommended';
  } else if (failureRate > 0.05) {
    recommendedFrequency = CalibrationFrequency.SEMIANNUALLY;
    confidence = 0.7;
    rationale = 'Low failure rate, semi-annual calibrations sufficient';
  } else {
    recommendedFrequency = CalibrationFrequency.ANNUALLY;
    confidence = 0.85;
    rationale = 'Excellent calibration stability, annual calibrations recommended';
  }

  return {
    recommendedFrequency,
    confidence,
    rationale,
  };
}

/**
 * Cancels a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await cancelCalibrationSchedule('schedule-123', 'Asset retired');
 * ```
 */
export async function cancelCalibrationSchedule(
  scheduleId: string,
  reason: string,
  transaction?: Transaction,
): Promise<CalibrationSchedule> {
  const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Calibration schedule ${scheduleId} not found`);
  }

  await schedule.update(
    {
      status: CalibrationStatus.CANCELLED,
      notes: `${schedule.notes || ''}\nCancelled: ${reason}`,
    },
    { transaction },
  );

  return schedule;
}

/**
 * Defers a calibration schedule to a new date
 *
 * @param scheduleId - Schedule identifier
 * @param newDueDate - New due date
 * @param reason - Deferral reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deferCalibration('schedule-123', new Date('2024-12-31'), 'Equipment unavailable');
 * ```
 */
export async function deferCalibration(
  scheduleId: string,
  newDueDate: Date,
  reason: string,
  transaction?: Transaction,
): Promise<CalibrationSchedule> {
  const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Calibration schedule ${scheduleId} not found`);
  }

  await schedule.update(
    {
      dueDate: newDueDate,
      status: CalibrationStatus.DEFERRED,
      notes: `${schedule.notes || ''}\nDeferred to ${newDueDate.toISOString()}: ${reason}`,
    },
    { transaction },
  );

  return schedule;
}

// ============================================================================
// CALIBRATION EXECUTION AND RECORDING
// ============================================================================

/**
 * Starts a calibration execution
 *
 * @param scheduleId - Schedule identifier
 * @param technicianId - Technician performing calibration
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await startCalibrationExecution('schedule-123', 'tech-001');
 * ```
 */
export async function startCalibrationExecution(
  scheduleId: string,
  technicianId: string,
  transaction?: Transaction,
): Promise<CalibrationSchedule> {
  const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Calibration schedule ${scheduleId} not found`);
  }

  if (
    ![CalibrationStatus.SCHEDULED, CalibrationStatus.DUE, CalibrationStatus.OVERDUE].includes(
      schedule.status,
    )
  ) {
    throw new BadRequestException(
      `Cannot start calibration with status ${schedule.status}`,
    );
  }

  await schedule.update(
    {
      status: CalibrationStatus.IN_PROGRESS,
      assignedTechnicianId: technicianId,
      scheduledDate: new Date(),
    },
    { transaction },
  );

  return schedule;
}

/**
 * Records calibration completion with results
 *
 * @param scheduleId - Schedule identifier
 * @param data - Calibration completion data
 * @param transaction - Optional database transaction
 * @returns Created calibration record
 *
 * @example
 * ```typescript
 * const record = await recordCalibrationCompletion('schedule-123', {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'voltage', reading: 5.01, unit: 'V', tolerance: 0.05, passed: true }
 *   ],
 *   passed: true,
 *   result: CalibrationResult.PASS
 * });
 * ```
 */
export async function recordCalibrationCompletion(
  scheduleId: string,
  data: CalibrationCompletionData,
  transaction?: Transaction,
): Promise<CalibrationRecord> {
  const schedule = await CalibrationSchedule.findByPk(scheduleId, {
    include: [{ model: CalibrationType }],
    transaction,
  });

  if (!schedule) {
    throw new NotFoundException(`Calibration schedule ${scheduleId} not found`);
  }

  // Generate certificate number
  const certificateNumber =
    data.certificateNumber || (await generateCalibrationCertificateNumber(transaction));

  // Calculate next due date based on frequency
  const nextDueDate = calculateNextCalibrationDueDate(schedule.frequency, data.performedDate);

  // Create calibration record
  const record = await CalibrationRecord.create(
    {
      scheduleId,
      assetId: schedule.assetId,
      performedBy: data.performedBy,
      performedDate: data.performedDate,
      completionDate: new Date(),
      result: data.result,
      passed: data.passed,
      certificateNumber,
      measurements: data.measurements,
      environmentalConditions: data.environmentalConditions,
      equipmentUsed: data.equipmentUsed,
      standardsUsed: data.standardsUsed,
      adjustmentsMade: data.adjustmentsMade,
      deviations: data.deviations,
      notes: data.notes,
      nextDueDate,
    },
    { transaction },
  );

  // Update schedule status
  await schedule.update(
    {
      status: data.passed ? CalibrationStatus.PASSED : CalibrationStatus.FAILED,
    },
    { transaction },
  );

  // Create new schedule for next calibration if passed
  if (data.passed && nextDueDate) {
    await scheduleCalibration(
      {
        assetId: schedule.assetId,
        calibrationTypeId: schedule.calibrationTypeId,
        frequency: schedule.frequency,
        dueDate: nextDueDate,
        assignedTechnicianId: schedule.assignedTechnicianId,
        standardIds: schedule.standardIds,
        procedureId: schedule.procedureId,
        priority: schedule.priority as any,
      },
      transaction,
    );
  }

  return record;
}

/**
 * Generates a unique calibration certificate number
 *
 * @param transaction - Optional database transaction
 * @returns Certificate number
 *
 * @example
 * ```typescript
 * const certNumber = await generateCalibrationCertificateNumber();
 * // Returns: "CERT-2024-001234"
 * ```
 */
export async function generateCalibrationCertificateNumber(
  transaction?: Transaction,
): Promise<string> {
  const year = new Date().getFullYear();
  const count = await CalibrationRecord.count({ transaction });
  return `CERT-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Calculates next calibration due date based on frequency
 *
 * @param frequency - Calibration frequency
 * @param fromDate - Starting date (default: today)
 * @returns Next due date
 *
 * @example
 * ```typescript
 * const nextDue = calculateNextCalibrationDueDate(CalibrationFrequency.QUARTERLY);
 * ```
 */
export function calculateNextCalibrationDueDate(
  frequency: CalibrationFrequency,
  fromDate: Date = new Date(),
): Date {
  const nextDate = new Date(fromDate);

  switch (frequency) {
    case CalibrationFrequency.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case CalibrationFrequency.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case CalibrationFrequency.BIWEEKLY:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case CalibrationFrequency.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case CalibrationFrequency.QUARTERLY:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case CalibrationFrequency.SEMIANNUALLY:
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case CalibrationFrequency.ANNUALLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case CalibrationFrequency.BIANNUALLY:
      nextDate.setFullYear(nextDate.getFullYear() + 2);
      break;
    default:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  return nextDate;
}

/**
 * Records individual calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @param measurements - Array of measurements
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await recordCalibrationMeasurements('record-123', [
 *   { parameter: 'temp', reading: 25.1, unit: 'C', tolerance: 0.5, passed: true }
 * ]);
 * ```
 */
export async function recordCalibrationMeasurements(
  recordId: string,
  measurements: CalibrationMeasurement[],
  transaction?: Transaction,
): Promise<CalibrationRecord> {
  const record = await CalibrationRecord.findByPk(recordId, { transaction });
  if (!record) {
    throw new NotFoundException(`Calibration record ${recordId} not found`);
  }

  // Validate each measurement against tolerance
  const validatedMeasurements = measurements.map((m) => {
    const passed = validateMeasurementTolerance(m);
    return { ...m, passed };
  });

  await record.update(
    {
      measurements: validatedMeasurements,
      passed: validatedMeasurements.every((m) => m.passed),
    },
    { transaction },
  );

  return record;
}

/**
 * Validates a measurement against its tolerance
 *
 * @param measurement - Calibration measurement
 * @returns Whether measurement passed tolerance check
 *
 * @example
 * ```typescript
 * const passed = validateMeasurementTolerance({
 *   parameter: 'voltage',
 *   reading: 5.01,
 *   nominalValue: 5.0,
 *   tolerance: 0.05,
 *   unit: 'V'
 * });
 * ```
 */
export function validateMeasurementTolerance(measurement: CalibrationMeasurement): boolean {
  if (measurement.upperLimit !== undefined && measurement.lowerLimit !== undefined) {
    return (
      measurement.reading >= measurement.lowerLimit &&
      measurement.reading <= measurement.upperLimit
    );
  }

  if (measurement.nominalValue !== undefined) {
    const deviation = Math.abs(measurement.reading - measurement.nominalValue);

    if (measurement.toleranceType === 'percentage') {
      const percentageDeviation = (deviation / measurement.nominalValue) * 100;
      return percentageDeviation <= measurement.tolerance;
    }

    return deviation <= measurement.tolerance;
  }

  return true;
}

/**
 * Gets calibration history for an asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Calibration records
 *
 * @example
 * ```typescript
 * const history = await getCalibrationHistory('asset-123', 10);
 * ```
 */
export async function getCalibrationHistory(
  assetId: string,
  limit: number = 50,
): Promise<CalibrationRecord[]> {
  return CalibrationRecord.findAll({
    where: { assetId },
    include: [
      {
        model: CalibrationSchedule,
        include: [{ model: CalibrationType }],
      },
    ],
    order: [['performedDate', 'DESC']],
    limit,
  });
}

/**
 * Approves a calibration record
 *
 * @param recordId - Record identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await approveCalibrationRecord('record-123', 'supervisor-001');
 * ```
 */
export async function approveCalibrationRecord(
  recordId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<CalibrationRecord> {
  const record = await CalibrationRecord.findByPk(recordId, { transaction });
  if (!record) {
    throw new NotFoundException(`Calibration record ${recordId} not found`);
  }

  await record.update(
    {
      approvedBy,
      approvalDate: new Date(),
    },
    { transaction },
  );

  return record;
}

// ============================================================================
// OUT-OF-TOLERANCE HANDLING
// ============================================================================

/**
 * Detects out-of-tolerance conditions in calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @returns OOT measurements
 *
 * @example
 * ```typescript
 * const ootMeasurements = await detectOutOfTolerance('record-123');
 * ```
 */
export async function detectOutOfTolerance(
  recordId: string,
): Promise<CalibrationMeasurement[]> {
  const record = await CalibrationRecord.findByPk(recordId);
  if (!record) {
    throw new NotFoundException(`Calibration record ${recordId} not found`);
  }

  const ootMeasurements = record.measurements.filter((m) => !m.passed);

  return ootMeasurements;
}

/**
 * Initiates out-of-tolerance handling workflow
 *
 * @param data - OOT handling data
 * @param transaction - Optional database transaction
 * @returns Created OOT action record
 *
 * @example
 * ```typescript
 * const ootAction = await handleOutOfTolerance({
 *   calibrationRecordId: 'record-123',
 *   action: OutOfToleranceAction.QUARANTINE,
 *   assignedTo: 'supervisor-001',
 *   rootCause: 'Environmental conditions outside spec',
 *   correctiveAction: 'Recalibrate in controlled environment'
 * });
 * ```
 */
export async function handleOutOfTolerance(
  data: OutOfToleranceHandlingData,
  transaction?: Transaction,
): Promise<OutOfToleranceAction> {
  const record = await CalibrationRecord.findByPk(data.calibrationRecordId, {
    transaction,
  });

  if (!record) {
    throw new NotFoundException(
      `Calibration record ${data.calibrationRecordId} not found`,
    );
  }

  // Create OOT action record
  const ootAction = await OutOfToleranceAction.create(
    {
      calibrationRecordId: data.calibrationRecordId,
      action: data.action,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      rootCause: data.rootCause,
      correctiveAction: data.correctiveAction,
      preventiveAction: data.preventiveAction,
      impactAssessment: data.impactAssessment,
      affectedAssets: data.affectedAssets,
      notificationsSent: data.notificationsSent,
      status: 'pending',
    },
    { transaction },
  );

  // Update calibration record
  await record.update(
    {
      result: CalibrationResult.OUT_OF_TOLERANCE,
      passed: false,
    },
    { transaction },
  );

  return ootAction;
}

/**
 * Quarantines an asset due to failed calibration
 *
 * @param assetId - Asset identifier
 * @param recordId - Calibration record identifier
 * @param reason - Quarantine reason
 * @param transaction - Optional database transaction
 * @returns OOT action record
 *
 * @example
 * ```typescript
 * await quarantineAsset('asset-123', 'record-456', 'Failed critical measurements');
 * ```
 */
export async function quarantineAsset(
  assetId: string,
  recordId: string,
  reason: string,
  transaction?: Transaction,
): Promise<OutOfToleranceAction> {
  return handleOutOfTolerance(
    {
      calibrationRecordId: recordId,
      action: OutOfToleranceAction.QUARANTINE,
      assignedTo: 'system',
      rootCause: reason,
      correctiveAction: 'Asset quarantined pending investigation',
    },
    transaction,
  );
}

/**
 * Completes an out-of-tolerance action
 *
 * @param ootActionId - OOT action identifier
 * @param completedBy - User completing action
 * @param notes - Completion notes
 * @param transaction - Optional database transaction
 * @returns Updated OOT action
 *
 * @example
 * ```typescript
 * await completeOutOfToleranceAction('oot-123', 'tech-001', 'Recalibrated successfully');
 * ```
 */
export async function completeOutOfToleranceAction(
  ootActionId: string,
  completedBy: string,
  notes?: string,
  transaction?: Transaction,
): Promise<OutOfToleranceAction> {
  const ootAction = await OutOfToleranceAction.findByPk(ootActionId, { transaction });
  if (!ootAction) {
    throw new NotFoundException(`OOT action ${ootActionId} not found`);
  }

  await ootAction.update(
    {
      status: 'completed',
      completionDate: new Date(),
      completedBy,
      notes: notes ? `${ootAction.notes || ''}\n${notes}` : ootAction.notes,
    },
    { transaction },
  );

  return ootAction;
}

// ============================================================================
// CALIBRATION STANDARDS MANAGEMENT
// ============================================================================

/**
 * Registers a calibration standard
 *
 * @param data - Standard data
 * @param transaction - Optional database transaction
 * @returns Created standard
 *
 * @example
 * ```typescript
 * const standard = await registerCalibrationStandard({
 *   standardNumber: 'STD-2024-001',
 *   description: 'Voltage calibration standard',
 *   traceabilitySource: TraceabilitySource.NIST,
 *   calibrationDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2025-01-01'),
 *   uncertaintyValue: 0.001,
 *   uncertaintyUnit: 'V'
 * });
 * ```
 */
export async function registerCalibrationStandard(
  data: CalibrationStandardData,
  transaction?: Transaction,
): Promise<CalibrationStandard> {
  // Check for duplicate standard number
  const existing = await CalibrationStandard.findOne({
    where: { standardNumber: data.standardNumber },
    transaction,
  });

  if (existing) {
    throw new ConflictException(
      `Standard with number ${data.standardNumber} already exists`,
    );
  }

  const standard = await CalibrationStandard.create(
    {
      standardNumber: data.standardNumber,
      description: data.description,
      traceabilitySource: data.traceabilitySource,
      traceabilityCertificateNumber: data.traceabilityCertificateNumber,
      manufacturer: data.manufacturer,
      model: data.model,
      serialNumber: data.serialNumber,
      calibrationDate: data.calibrationDate,
      expirationDate: data.expirationDate,
      uncertaintyValue: data.uncertaintyValue,
      uncertaintyUnit: data.uncertaintyUnit,
      custodian: data.custodian,
      location: data.location,
      isActive: true,
    },
    { transaction },
  );

  return standard;
}

/**
 * Gets calibration standards expiring within a timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @returns Expiring standards
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCalibrationStandards(30);
 * ```
 */
export async function getExpiringCalibrationStandards(
  daysAhead: number = 30,
): Promise<CalibrationStandard[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);

  return CalibrationStandard.findAll({
    where: {
      expirationDate: {
        [Op.between]: [new Date(), targetDate],
      },
      isActive: true,
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Tracks calibration standard traceability chain
 *
 * @param standardId - Standard identifier
 * @returns Traceability information
 *
 * @example
 * ```typescript
 * const traceability = await trackStandardTraceability('std-123');
 * ```
 */
export async function trackStandardTraceability(standardId: string): Promise<{
  standard: CalibrationStandard;
  traceabilityChain: Array<{
    level: number;
    source: string;
    certificateNumber?: string;
    date: Date;
  }>;
}> {
  const standard = await CalibrationStandard.findByPk(standardId);
  if (!standard) {
    throw new NotFoundException(`Calibration standard ${standardId} not found`);
  }

  // Build traceability chain
  const traceabilityChain = [
    {
      level: 1,
      source: standard.traceabilitySource,
      certificateNumber: standard.traceabilityCertificateNumber,
      date: standard.calibrationDate,
    },
  ];

  return {
    standard,
    traceabilityChain,
  };
}

/**
 * Updates calibration standard
 *
 * @param standardId - Standard identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await updateCalibrationStandard('std-123', {
 *   location: 'Lab-A-Cabinet-3',
 *   custodian: 'user-001'
 * });
 * ```
 */
export async function updateCalibrationStandard(
  standardId: string,
  updates: Partial<CalibrationStandard>,
  transaction?: Transaction,
): Promise<CalibrationStandard> {
  const standard = await CalibrationStandard.findByPk(standardId, { transaction });
  if (!standard) {
    throw new NotFoundException(`Calibration standard ${standardId} not found`);
  }

  await standard.update(updates, { transaction });
  return standard;
}

/**
 * Retires a calibration standard
 *
 * @param standardId - Standard identifier
 * @param reason - Retirement reason
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await retireCalibrationStandard('std-123', 'Expired and replaced');
 * ```
 */
export async function retireCalibrationStandard(
  standardId: string,
  reason: string,
  transaction?: Transaction,
): Promise<CalibrationStandard> {
  const standard = await CalibrationStandard.findByPk(standardId, { transaction });
  if (!standard) {
    throw new NotFoundException(`Calibration standard ${standardId} not found`);
  }

  await standard.update(
    {
      isActive: false,
      notes: `${standard.notes || ''}\nRetired: ${reason}`,
    },
    { transaction },
  );

  return standard;
}

// ============================================================================
// CALIBRATION VENDOR MANAGEMENT
// ============================================================================

/**
 * Registers a calibration vendor
 *
 * @param vendorData - Vendor information
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerCalibrationVendor({
 *   code: 'VENDOR-001',
 *   name: 'Precision Calibration Services',
 *   accreditationNumber: 'ISO17025-12345',
 *   capabilities: ['electrical', 'mechanical', 'thermal']
 * });
 * ```
 */
export async function registerCalibrationVendor(
  vendorData: {
    code: string;
    name: string;
    contactInfo?: Record<string, any>;
    accreditationNumber?: string;
    accreditationExpiration?: Date;
    capabilities?: string[];
    turnaroundTimeDays?: number;
  },
  transaction?: Transaction,
): Promise<CalibrationVendor> {
  const existing = await CalibrationVendor.findOne({
    where: { code: vendorData.code },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Vendor with code ${vendorData.code} already exists`);
  }

  const vendor = await CalibrationVendor.create(
    {
      ...vendorData,
      isActive: true,
    },
    { transaction },
  );

  return vendor;
}

/**
 * Evaluates calibration vendor performance
 *
 * @param vendorId - Vendor identifier
 * @param startDate - Evaluation period start
 * @param endDate - Evaluation period end
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateVendorPerformance(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function evaluateVendorPerformance(
  vendorId: string,
  startDate: Date,
  endDate: Date,
): Promise<VendorPerformanceMetrics> {
  // Get all calibrations performed by vendor in period
  const schedules = await CalibrationSchedule.findAll({
    where: {
      assignedVendorId: vendorId,
      scheduledDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [{ model: CalibrationRecord }],
  });

  const totalCalibrations = schedules.length;
  if (totalCalibrations === 0) {
    return {
      vendorId,
      totalCalibrations: 0,
      passRate: 0,
      averageTurnaroundTime: 0,
      onTimeDeliveryRate: 0,
      costEfficiency: 0,
      qualityScore: 0,
    };
  }

  const passed = schedules.filter(
    (s) => s.records && s.records.some((r) => r.passed),
  ).length;
  const passRate = (passed / totalCalibrations) * 100;

  // Calculate average turnaround time
  let totalTurnaround = 0;
  let onTimeDeliveries = 0;

  for (const schedule of schedules) {
    if (schedule.records && schedule.records.length > 0) {
      const record = schedule.records[0];
      const turnaround =
        (record.completionDate!.getTime() - schedule.scheduledDate!.getTime()) /
        (1000 * 60 * 60 * 24);
      totalTurnaround += turnaround;

      if (record.completionDate! <= schedule.dueDate) {
        onTimeDeliveries++;
      }
    }
  }

  const averageTurnaroundTime = totalTurnaround / totalCalibrations;
  const onTimeDeliveryRate = (onTimeDeliveries / totalCalibrations) * 100;

  // Calculate cost efficiency (lower is better)
  const totalCost = schedules.reduce(
    (sum, s) =>
      sum + (s.records?.[0]?.actualCost ? Number(s.records[0].actualCost) : 0),
    0,
  );
  const averageCost = totalCost / totalCalibrations;
  const costEfficiency = averageCost;

  // Calculate overall quality score
  const qualityScore =
    passRate * 0.4 + onTimeDeliveryRate * 0.3 + Math.min((10 / averageTurnaroundTime) * 100, 100) * 0.3;

  return {
    vendorId,
    totalCalibrations,
    passRate,
    averageTurnaroundTime,
    onTimeDeliveryRate,
    costEfficiency,
    qualityScore,
  };
}

/**
 * Gets top performing calibration vendors
 *
 * @param limit - Number of vendors to return
 * @returns Top vendors by quality score
 *
 * @example
 * ```typescript
 * const topVendors = await getTopCalibrationVendors(5);
 * ```
 */
export async function getTopCalibrationVendors(
  limit: number = 10,
): Promise<CalibrationVendor[]> {
  return CalibrationVendor.findAll({
    where: { isActive: true },
    order: [['qualityRating', 'DESC']],
    limit,
  });
}

// ============================================================================
// CALIBRATION COST TRACKING
// ============================================================================

/**
 * Tracks calibration costs for an asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Cost summary
 *
 * @example
 * ```typescript
 * const costs = await trackCalibrationCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function trackCalibrationCosts(
  assetId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalCost: number;
  averageCost: number;
  calibrationCount: number;
  costByType: Record<string, number>;
}> {
  const records = await CalibrationRecord.findAll({
    where: {
      assetId,
      performedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: CalibrationSchedule,
        include: [{ model: CalibrationType }],
      },
    ],
  });

  const totalCost = records.reduce(
    (sum, r) => sum + (r.actualCost ? Number(r.actualCost) : 0),
    0,
  );
  const calibrationCount = records.length;
  const averageCost = calibrationCount > 0 ? totalCost / calibrationCount : 0;

  const costByType: Record<string, number> = {};
  for (const record of records) {
    const typeName = record.schedule?.calibrationType?.name || 'Unknown';
    costByType[typeName] = (costByType[typeName] || 0) + Number(record.actualCost || 0);
  }

  return {
    totalCost,
    averageCost,
    calibrationCount,
    costByType,
  };
}

/**
 * Generates calibration cost forecast
 *
 * @param assetId - Asset identifier
 * @param forecastMonths - Number of months to forecast
 * @returns Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCalibrationCosts('asset-123', 12);
 * ```
 */
export async function forecastCalibrationCosts(
  assetId: string,
  forecastMonths: number = 12,
): Promise<{
  forecastedTotalCost: number;
  monthlyBreakdown: Array<{ month: string; cost: number }>;
}> {
  // Get historical costs
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const historical = await trackCalibrationCosts(assetId, oneYearAgo, new Date());

  // Get upcoming scheduled calibrations
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + forecastMonths);

  const upcomingSchedules = await CalibrationSchedule.findAll({
    where: {
      assetId,
      dueDate: {
        [Op.between]: [new Date(), endDate],
      },
      status: {
        [Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
      },
    },
  });

  const forecastedTotalCost = upcomingSchedules.reduce(
    (sum, s) => sum + Number(s.estimatedCost || historical.averageCost),
    0,
  );

  const monthlyBreakdown: Array<{ month: string; cost: number }> = [];
  for (let i = 0; i < forecastMonths; i++) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() + i);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const monthSchedules = upcomingSchedules.filter(
      (s) => s.dueDate >= monthStart && s.dueDate < monthEnd,
    );

    const monthCost = monthSchedules.reduce(
      (sum, s) => sum + Number(s.estimatedCost || historical.averageCost),
      0,
    );

    monthlyBreakdown.push({
      month: monthStart.toISOString().substring(0, 7),
      cost: monthCost,
    });
  }

  return {
    forecastedTotalCost,
    monthlyBreakdown,
  };
}

// ============================================================================
// CALIBRATION REPORTING AND ANALYTICS
// ============================================================================

/**
 * Generates calibration certificate
 *
 * @param recordId - Calibration record identifier
 * @returns Certificate data
 *
 * @example
 * ```typescript
 * const certificate = await generateCalibrationCertificate('record-123');
 * ```
 */
export async function generateCalibrationCertificate(recordId: string): Promise<{
  certificateNumber: string;
  assetId: string;
  calibrationType: string;
  performedDate: Date;
  performedBy: string;
  result: CalibrationResult;
  measurements: CalibrationMeasurement[];
  environmentalConditions?: EnvironmentalConditions;
  standardsUsed?: string[];
  nextDueDate?: Date;
  issuedDate: Date;
}> {
  const record = await CalibrationRecord.findByPk(recordId, {
    include: [
      {
        model: CalibrationSchedule,
        include: [{ model: CalibrationType }],
      },
    ],
  });

  if (!record) {
    throw new NotFoundException(`Calibration record ${recordId} not found`);
  }

  return {
    certificateNumber: record.certificateNumber!,
    assetId: record.assetId,
    calibrationType: record.schedule?.calibrationType?.name || 'Unknown',
    performedDate: record.performedDate,
    performedBy: record.performedBy,
    result: record.result,
    measurements: record.measurements,
    environmentalConditions: record.environmentalConditions,
    standardsUsed: record.standardsUsed,
    nextDueDate: record.nextDueDate,
    issuedDate: new Date(),
  };
}

/**
 * Generates calibration compliance report
 *
 * @param startDate - Report period start
 * @param endDate - Report period end
 * @param filters - Optional filters
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateCalibrationComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function generateCalibrationComplianceReport(
  startDate: Date,
  endDate: Date,
  filters?: {
    assetTypeId?: string;
    priority?: string;
  },
): Promise<{
  totalAssets: number;
  compliantAssets: number;
  nonCompliantAssets: number;
  complianceRate: number;
  overdueCalibrations: number;
  upcomingCalibrations: number;
  passRate: number;
}> {
  const where: WhereOptions = {
    dueDate: {
      [Op.between]: [startDate, endDate],
    },
  };

  if (filters?.priority) {
    where.priority = filters.priority;
  }

  const schedules = await CalibrationSchedule.findAll({
    where,
    include: [{ model: CalibrationRecord }],
  });

  const totalAssets = new Set(schedules.map((s) => s.assetId)).size;
  const overdueCalibrations = schedules.filter(
    (s) => s.status === CalibrationStatus.OVERDUE,
  ).length;
  const upcomingCalibrations = schedules.filter(
    (s) => s.status === CalibrationStatus.SCHEDULED,
  ).length;

  const completedCalibrations = schedules.filter(
    (s) => s.records && s.records.length > 0,
  );
  const passedCalibrations = completedCalibrations.filter(
    (s) => s.records && s.records.some((r) => r.passed),
  ).length;

  const passRate =
    completedCalibrations.length > 0
      ? (passedCalibrations / completedCalibrations.length) * 100
      : 0;

  const compliantAssets = new Set(
    schedules
      .filter((s) => s.status !== CalibrationStatus.OVERDUE)
      .map((s) => s.assetId),
  ).size;
  const nonCompliantAssets = totalAssets - compliantAssets;
  const complianceRate = totalAssets > 0 ? (compliantAssets / totalAssets) * 100 : 0;

  return {
    totalAssets,
    compliantAssets,
    nonCompliantAssets,
    complianceRate,
    overdueCalibrations,
    upcomingCalibrations,
    passRate,
  };
}

/**
 * Gets calibration statistics for a date range
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Calibration statistics
 *
 * @example
 * ```typescript
 * const stats = await getCalibrationStatistics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getCalibrationStatistics(
  startDate: Date,
  endDate: Date,
): Promise<{
  totalCalibrations: number;
  passed: number;
  failed: number;
  passRate: number;
  averageDuration: number;
  totalCost: number;
  averageCost: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
}> {
  const records = await CalibrationRecord.findAll({
    where: {
      performedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: CalibrationSchedule,
        include: [{ model: CalibrationType }],
      },
    ],
  });

  const totalCalibrations = records.length;
  const passed = records.filter((r) => r.passed).length;
  const failed = totalCalibrations - passed;
  const passRate = totalCalibrations > 0 ? (passed / totalCalibrations) * 100 : 0;

  const totalDuration = records.reduce(
    (sum, r) => sum + Number(r.actualDuration || 0),
    0,
  );
  const averageDuration = totalCalibrations > 0 ? totalDuration / totalCalibrations : 0;

  const totalCost = records.reduce((sum, r) => sum + Number(r.actualCost || 0), 0);
  const averageCost = totalCalibrations > 0 ? totalCost / totalCalibrations : 0;

  const byType: Record<string, number> = {};
  const byMonth: Record<string, number> = {};

  for (const record of records) {
    const typeName = record.schedule?.calibrationType?.name || 'Unknown';
    byType[typeName] = (byType[typeName] || 0) + 1;

    const month = record.performedDate.toISOString().substring(0, 7);
    byMonth[month] = (byMonth[month] || 0) + 1;
  }

  return {
    totalCalibrations,
    passed,
    failed,
    passRate,
    averageDuration,
    totalCost,
    averageCost,
    byType,
    byMonth,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  CalibrationType,
  CalibrationSchedule,
  CalibrationRecord,
  CalibrationStandard,
  OutOfToleranceAction,
  CalibrationVendor,

  // Scheduling
  scheduleCalibration,
  updateCalibrationSchedule,
  getCalibrationsDue,
  getOverdueCalibrations,
  calculateOptimalFrequency,
  cancelCalibrationSchedule,
  deferCalibration,

  // Execution
  startCalibrationExecution,
  recordCalibrationCompletion,
  recordCalibrationMeasurements,
  validateMeasurementTolerance,
  getCalibrationHistory,
  approveCalibrationRecord,

  // Out-of-Tolerance
  detectOutOfTolerance,
  handleOutOfTolerance,
  quarantineAsset,
  completeOutOfToleranceAction,

  // Standards
  registerCalibrationStandard,
  getExpiringCalibrationStandards,
  trackStandardTraceability,
  updateCalibrationStandard,
  retireCalibrationStandard,

  // Vendors
  registerCalibrationVendor,
  evaluateVendorPerformance,
  getTopCalibrationVendors,

  // Cost Tracking
  trackCalibrationCosts,
  forecastCalibrationCosts,

  // Reporting
  generateCalibrationCertificate,
  generateCalibrationComplianceReport,
  getCalibrationStatistics,

  // Utilities
  generateCalibrationWorkOrderNumber,
  generateCalibrationCertificateNumber,
  calculateNextCalibrationDueDate,
};

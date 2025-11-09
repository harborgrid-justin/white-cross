/**
 * ASSET MAINTENANCE COMMAND FUNCTIONS
 *
 * Enterprise-grade asset maintenance management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Preventive maintenance scheduling and execution
 * - Corrective maintenance workflows
 * - Maintenance request management
 * - Work order generation and tracking
 * - Technician assignment and dispatch
 * - Parts inventory and procurement
 * - Maintenance history tracking
 * - Downtime tracking and analysis
 * - PM schedule optimization
 * - Equipment reliability metrics
 *
 * @module AssetMaintenanceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createMaintenanceRequest,
 *   createWorkOrder,
 *   schedulePreventiveMaintenance,
 *   assignTechnician,
 *   MaintenanceRequest,
 *   WorkOrderStatus
 * } from './asset-maintenance-commands';
 *
 * // Create maintenance request
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Machine making unusual noise',
 *   requestedBy: 'user-456'
 * });
 *
 * // Create work order from request
 * const workOrder = await createWorkOrder({
 *   maintenanceRequestId: request.id,
 *   assignedTechnicianId: 'tech-789',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  BeforeCreate,
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Maintenance type
 */
export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  PREDICTIVE = 'predictive',
  CORRECTIVE = 'corrective',
  EMERGENCY = 'emergency',
  ROUTINE = 'routine',
  BREAKDOWN = 'breakdown',
}

/**
 * Maintenance priority
 */
export enum MaintenancePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Work order status
 */
export enum WorkOrderStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING_PARTS = 'pending_parts',
}

/**
 * Request status
 */
export enum RequestStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WORK_ORDER_CREATED = 'work_order_created',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * PM schedule frequency
 */
export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  BI_ANNUAL = 'bi_annual',
  METER_BASED = 'meter_based',
  CONDITION_BASED = 'condition_based',
}

/**
 * Part status
 */
export enum PartStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  ISSUED = 'issued',
  ON_ORDER = 'on_order',
  OUT_OF_STOCK = 'out_of_stock',
}

/**
 * Downtime category
 */
export enum DowntimeCategory {
  PLANNED = 'planned',
  UNPLANNED = 'unplanned',
  EMERGENCY = 'emergency',
}

/**
 * Failure mode
 */
export enum FailureMode {
  MECHANICAL = 'mechanical',
  ELECTRICAL = 'electrical',
  ELECTRONIC = 'electronic',
  SOFTWARE = 'software',
  OPERATOR_ERROR = 'operator_error',
  ENVIRONMENTAL = 'environmental',
  WEAR_AND_TEAR = 'wear_and_tear',
  MATERIAL_DEFECT = 'material_defect',
}

/**
 * Maintenance request data
 */
export interface MaintenanceRequestData {
  assetId: string;
  requestType: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  requestedBy: string;
  departmentId?: string;
  locationId?: string;
  symptoms?: string[];
  attachments?: string[];
  requestedCompletionDate?: Date;
}

/**
 * Work order data
 */
export interface WorkOrderData {
  maintenanceRequestId?: string;
  assetId: string;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  assignedTechnicianId?: string;
  scheduledStartDate: Date;
  scheduledEndDate?: Date;
  estimatedDuration?: number;
  instructions?: string;
  safetyRequirements?: string[];
  requiredParts?: PartRequirement[];
  requiredTools?: string[];
}

/**
 * Part requirement
 */
export interface PartRequirement {
  partId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitCost?: number;
  available?: boolean;
}

/**
 * Work order completion data
 */
export interface WorkOrderCompletionData {
  workOrderId: string;
  completedBy: string;
  completionDate: Date;
  actualDuration: number;
  workPerformed: string;
  partsUsed?: PartUsage[];
  findings?: string;
  recommendations?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
}

/**
 * Part usage
 */
export interface PartUsage {
  partId: string;
  quantityUsed: number;
  laborHours?: number;
  notes?: string;
}

/**
 * PM schedule data
 */
export interface PMScheduleData {
  assetId: string;
  scheduleType: MaintenanceType;
  frequency: ScheduleFrequency;
  frequencyValue?: number;
  meterBasedTrigger?: number;
  description: string;
  tasks: MaintenanceTask[];
  estimatedDuration: number;
  requiredSkills?: string[];
  requiredParts?: PartRequirement[];
  startDate: Date;
  endDate?: Date;
}

/**
 * Maintenance task
 */
export interface MaintenanceTask {
  sequence: number;
  description: string;
  estimatedDuration: number;
  safetyNotes?: string;
  qualityCheckpoints?: string[];
}

/**
 * Downtime record data
 */
export interface DowntimeRecordData {
  assetId: string;
  category: DowntimeCategory;
  startTime: Date;
  endTime?: Date;
  reason: string;
  failureMode?: FailureMode;
  impactedOperations?: string[];
  workOrderId?: string;
  estimatedLoss?: number;
}

/**
 * Technician assignment data
 */
export interface TechnicianAssignmentData {
  workOrderId: string;
  technicianId: string;
  assignedDate: Date;
  primaryTechnician: boolean;
  estimatedHours?: number;
  skillsRequired?: string[];
}

/**
 * Part reservation data
 */
export interface PartReservationData {
  workOrderId: string;
  partId: string;
  quantity: number;
  reservedBy: string;
  requiredBy: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Maintenance Request Model
 */
@Table({
  tableName: 'maintenance_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['request_number'], unique: true },
    { fields: ['asset_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['requested_by'] },
  ],
})
export class MaintenanceRequest extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Request number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  requestNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Request type' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })
  requestType!: MaintenanceType;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(RequestStatus)), defaultValue: RequestStatus.SUBMITTED })
  @Index
  status!: RequestStatus;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenancePriority)), allowNull: false })
  @Index
  priority!: MaintenancePriority;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  requestedBy!: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID })
  departmentId?: string;

  @ApiProperty({ description: 'Location ID' })
  @Column({ type: DataType.UUID })
  locationId?: string;

  @ApiProperty({ description: 'Symptoms' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  symptoms?: string[];

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Requested completion date' })
  @Column({ type: DataType.DATE })
  requestedCompletionDate?: Date;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Rejection reason' })
  @Column({ type: DataType.TEXT })
  rejectionReason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => WorkOrder)
  workOrders?: WorkOrder[];

  @BeforeCreate
  static async generateRequestNumber(instance: MaintenanceRequest) {
    if (!instance.requestNumber) {
      const count = await MaintenanceRequest.count();
      const year = new Date().getFullYear();
      instance.requestNumber = `MR-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Work Order Model
 */
@Table({
  tableName: 'work_orders',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['work_order_number'], unique: true },
    { fields: ['asset_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['assigned_technician_id'] },
    { fields: ['scheduled_start_date'] },
  ],
})
export class WorkOrder extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Work order number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  workOrderNumber!: string;

  @ApiProperty({ description: 'Maintenance request ID' })
  @ForeignKey(() => MaintenanceRequest)
  @Column({ type: DataType.UUID })
  maintenanceRequestId?: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Maintenance type' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })
  maintenanceType!: MaintenanceType;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(WorkOrderStatus)), defaultValue: WorkOrderStatus.DRAFT })
  @Index
  status!: WorkOrderStatus;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenancePriority)), allowNull: false })
  @Index
  priority!: MaintenancePriority;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Assigned technician ID' })
  @Column({ type: DataType.UUID })
  @Index
  assignedTechnicianId?: string;

  @ApiProperty({ description: 'Scheduled start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  scheduledStartDate!: Date;

  @ApiProperty({ description: 'Scheduled end date' })
  @Column({ type: DataType.DATE })
  scheduledEndDate?: Date;

  @ApiProperty({ description: 'Actual start date' })
  @Column({ type: DataType.DATE })
  actualStartDate?: Date;

  @ApiProperty({ description: 'Actual end date' })
  @Column({ type: DataType.DATE })
  actualEndDate?: Date;

  @ApiProperty({ description: 'Estimated duration in minutes' })
  @Column({ type: DataType.INTEGER })
  estimatedDuration?: number;

  @ApiProperty({ description: 'Actual duration in minutes' })
  @Column({ type: DataType.INTEGER })
  actualDuration?: number;

  @ApiProperty({ description: 'Instructions' })
  @Column({ type: DataType.TEXT })
  instructions?: string;

  @ApiProperty({ description: 'Safety requirements' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  safetyRequirements?: string[];

  @ApiProperty({ description: 'Required parts' })
  @Column({ type: DataType.JSONB })
  requiredParts?: PartRequirement[];

  @ApiProperty({ description: 'Required tools' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  requiredTools?: string[];

  @ApiProperty({ description: 'Work performed' })
  @Column({ type: DataType.TEXT })
  workPerformed?: string;

  @ApiProperty({ description: 'Parts used' })
  @Column({ type: DataType.JSONB })
  partsUsed?: PartUsage[];

  @ApiProperty({ description: 'Labor hours' })
  @Column({ type: DataType.DECIMAL(8, 2) })
  laborHours?: number;

  @ApiProperty({ description: 'Findings' })
  @Column({ type: DataType.TEXT })
  findings?: string;

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.TEXT })
  recommendations?: string;

  @ApiProperty({ description: 'Follow-up required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  followUpRequired!: boolean;

  @ApiProperty({ description: 'Follow-up notes' })
  @Column({ type: DataType.TEXT })
  followUpNotes?: string;

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

  @BelongsTo(() => MaintenanceRequest)
  maintenanceRequest?: MaintenanceRequest;

  @HasMany(() => TechnicianAssignment)
  technicianAssignments?: TechnicianAssignment[];

  @HasMany(() => PartReservation)
  partReservations?: PartReservation[];

  @BeforeCreate
  static async generateWorkOrderNumber(instance: WorkOrder) {
    if (!instance.workOrderNumber) {
      const count = await WorkOrder.count();
      const year = new Date().getFullYear();
      instance.workOrderNumber = `WO-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * PM Schedule Model
 */
@Table({
  tableName: 'pm_schedules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['frequency'] },
    { fields: ['is_active'] },
    { fields: ['next_due_date'] },
  ],
})
export class PMSchedule extends Model {
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

  @ApiProperty({ description: 'Schedule type' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })
  scheduleType!: MaintenanceType;

  @ApiProperty({ description: 'Frequency' })
  @Column({ type: DataType.ENUM(...Object.values(ScheduleFrequency)), allowNull: false })
  @Index
  frequency!: ScheduleFrequency;

  @ApiProperty({ description: 'Frequency value (for custom intervals)' })
  @Column({ type: DataType.INTEGER })
  frequencyValue?: number;

  @ApiProperty({ description: 'Meter-based trigger value' })
  @Column({ type: DataType.INTEGER })
  meterBasedTrigger?: number;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Maintenance tasks' })
  @Column({ type: DataType.JSONB, allowNull: false })
  tasks!: MaintenanceTask[];

  @ApiProperty({ description: 'Estimated duration in minutes' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  estimatedDuration!: number;

  @ApiProperty({ description: 'Required skills' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  requiredSkills?: string[];

  @ApiProperty({ description: 'Required parts' })
  @Column({ type: DataType.JSONB })
  requiredParts?: PartRequirement[];

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE })
  endDate?: Date;

  @ApiProperty({ description: 'Last performed date' })
  @Column({ type: DataType.DATE })
  lastPerformedDate?: Date;

  @ApiProperty({ description: 'Next due date' })
  @Column({ type: DataType.DATE })
  @Index
  nextDueDate?: Date;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Total executions' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalExecutions!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Technician Assignment Model
 */
@Table({
  tableName: 'technician_assignments',
  timestamps: true,
  indexes: [
    { fields: ['work_order_id'] },
    { fields: ['technician_id'] },
    { fields: ['assigned_date'] },
  ],
})
export class TechnicianAssignment extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Work order ID' })
  @ForeignKey(() => WorkOrder)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  workOrderId!: string;

  @ApiProperty({ description: 'Technician ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  technicianId!: string;

  @ApiProperty({ description: 'Assigned date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  assignedDate!: Date;

  @ApiProperty({ description: 'Primary technician' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  primaryTechnician!: boolean;

  @ApiProperty({ description: 'Estimated hours' })
  @Column({ type: DataType.DECIMAL(8, 2) })
  estimatedHours?: number;

  @ApiProperty({ description: 'Actual hours' })
  @Column({ type: DataType.DECIMAL(8, 2) })
  actualHours?: number;

  @ApiProperty({ description: 'Skills required' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  skillsRequired?: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => WorkOrder)
  workOrder?: WorkOrder;
}

/**
 * Part Inventory Model
 */
@Table({
  tableName: 'part_inventory',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['part_number'], unique: true },
    { fields: ['status'] },
    { fields: ['location_id'] },
  ],
})
export class PartInventory extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Part number' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  partNumber!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Category' })
  @Column({ type: DataType.STRING(100) })
  category?: string;

  @ApiProperty({ description: 'Manufacturer' })
  @Column({ type: DataType.STRING(200) })
  manufacturer?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(PartStatus)), defaultValue: PartStatus.AVAILABLE })
  @Index
  status!: PartStatus;

  @ApiProperty({ description: 'Quantity on hand' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  quantityOnHand!: number;

  @ApiProperty({ description: 'Quantity reserved' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  quantityReserved!: number;

  @ApiProperty({ description: 'Quantity available' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  quantityAvailable!: number;

  @ApiProperty({ description: 'Reorder point' })
  @Column({ type: DataType.INTEGER })
  reorderPoint?: number;

  @ApiProperty({ description: 'Reorder quantity' })
  @Column({ type: DataType.INTEGER })
  reorderQuantity?: number;

  @ApiProperty({ description: 'Unit cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  unitCost?: number;

  @ApiProperty({ description: 'Location ID' })
  @Column({ type: DataType.UUID })
  @Index
  locationId?: string;

  @ApiProperty({ description: 'Bin location' })
  @Column({ type: DataType.STRING(100) })
  binLocation?: string;

  @ApiProperty({ description: 'Is critical part' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCritical!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => PartReservation)
  reservations?: PartReservation[];
}

/**
 * Part Reservation Model
 */
@Table({
  tableName: 'part_reservations',
  timestamps: true,
  indexes: [
    { fields: ['work_order_id'] },
    { fields: ['part_id'] },
    { fields: ['status'] },
  ],
})
export class PartReservation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Work order ID' })
  @ForeignKey(() => WorkOrder)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  workOrderId!: string;

  @ApiProperty({ description: 'Part ID' })
  @ForeignKey(() => PartInventory)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  partId!: string;

  @ApiProperty({ description: 'Quantity reserved' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  quantityReserved!: number;

  @ApiProperty({ description: 'Quantity issued' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  quantityIssued!: number;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM('reserved', 'issued', 'cancelled'), defaultValue: 'reserved' })
  @Index
  status!: string;

  @ApiProperty({ description: 'Reserved by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  reservedBy!: string;

  @ApiProperty({ description: 'Required by date' })
  @Column({ type: DataType.DATE, allowNull: false })
  requiredBy!: Date;

  @ApiProperty({ description: 'Issued by user ID' })
  @Column({ type: DataType.UUID })
  issuedBy?: string;

  @ApiProperty({ description: 'Issued date' })
  @Column({ type: DataType.DATE })
  issuedDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => WorkOrder)
  workOrder?: WorkOrder;

  @BelongsTo(() => PartInventory)
  part?: PartInventory;
}

/**
 * Downtime Record Model
 */
@Table({
  tableName: 'downtime_records',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['category'] },
    { fields: ['start_time'] },
    { fields: ['work_order_id'] },
  ],
})
export class DowntimeRecord extends Model {
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

  @ApiProperty({ description: 'Category' })
  @Column({ type: DataType.ENUM(...Object.values(DowntimeCategory)), allowNull: false })
  @Index
  category!: DowntimeCategory;

  @ApiProperty({ description: 'Start time' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startTime!: Date;

  @ApiProperty({ description: 'End time' })
  @Column({ type: DataType.DATE })
  endTime?: Date;

  @ApiProperty({ description: 'Duration in minutes' })
  @Column({ type: DataType.INTEGER })
  durationMinutes?: number;

  @ApiProperty({ description: 'Reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Failure mode' })
  @Column({ type: DataType.ENUM(...Object.values(FailureMode)) })
  failureMode?: FailureMode;

  @ApiProperty({ description: 'Impacted operations' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  impactedOperations?: string[];

  @ApiProperty({ description: 'Work order ID' })
  @Column({ type: DataType.UUID })
  @Index
  workOrderId?: string;

  @ApiProperty({ description: 'Estimated loss amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedLoss?: number;

  @ApiProperty({ description: 'Root cause' })
  @Column({ type: DataType.TEXT })
  rootCause?: string;

  @ApiProperty({ description: 'Corrective actions' })
  @Column({ type: DataType.TEXT })
  correctiveActions?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Maintenance History Model
 */
@Table({
  tableName: 'maintenance_history',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['work_order_id'] },
    { fields: ['maintenance_date'] },
  ],
})
export class MaintenanceHistory extends Model {
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

  @ApiProperty({ description: 'Work order ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  workOrderId!: string;

  @ApiProperty({ description: 'Maintenance type' })
  @Column({ type: DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })
  maintenanceType!: MaintenanceType;

  @ApiProperty({ description: 'Maintenance date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  maintenanceDate!: Date;

  @ApiProperty({ description: 'Performed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  performedBy!: string;

  @ApiProperty({ description: 'Work description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  workDescription!: string;

  @ApiProperty({ description: 'Labor hours' })
  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  laborHours!: number;

  @ApiProperty({ description: 'Parts cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  partsCost?: number;

  @ApiProperty({ description: 'Labor cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  laborCost?: number;

  @ApiProperty({ description: 'Total cost' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  totalCost?: number;

  @ApiProperty({ description: 'Asset meter reading' })
  @Column({ type: DataType.INTEGER })
  assetMeterReading?: number;

  @ApiProperty({ description: 'Follow-up required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  followUpRequired!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// MAINTENANCE REQUEST FUNCTIONS
// ============================================================================

/**
 * Creates a maintenance request
 *
 * @param data - Maintenance request data
 * @param transaction - Optional database transaction
 * @returns Created maintenance request
 *
 * @example
 * ```typescript
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Motor overheating',
 *   requestedBy: 'user-456',
 *   symptoms: ['unusual noise', 'excessive heat']
 * });
 * ```
 */
export async function createMaintenanceRequest(
  data: MaintenanceRequestData,
  transaction?: Transaction
): Promise<MaintenanceRequest> {
  const request = await MaintenanceRequest.create(
    {
      ...data,
      status: RequestStatus.SUBMITTED,
    },
    { transaction }
  );

  return request;
}

/**
 * Approves maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await approveMaintenanceRequest('req-123', 'manager-456');
 * ```
 */
export async function approveMaintenanceRequest(
  requestId: string,
  approverId: string,
  transaction?: Transaction
): Promise<MaintenanceRequest> {
  const request = await MaintenanceRequest.findByPk(requestId, { transaction });
  if (!request) {
    throw new NotFoundException(`Maintenance request ${requestId} not found`);
  }

  await request.update({
    status: RequestStatus.APPROVED,
    approvedBy: approverId,
    approvalDate: new Date(),
  }, { transaction });

  return request;
}

/**
 * Rejects maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await rejectMaintenanceRequest('req-123', 'manager-456', 'Duplicate request');
 * ```
 */
export async function rejectMaintenanceRequest(
  requestId: string,
  approverId: string,
  reason: string,
  transaction?: Transaction
): Promise<MaintenanceRequest> {
  const request = await MaintenanceRequest.findByPk(requestId, { transaction });
  if (!request) {
    throw new NotFoundException(`Maintenance request ${requestId} not found`);
  }

  await request.update({
    status: RequestStatus.REJECTED,
    approvedBy: approverId,
    approvalDate: new Date(),
    rejectionReason: reason,
  }, { transaction });

  return request;
}

/**
 * Gets maintenance requests by status
 *
 * @param status - Request status
 * @param options - Query options
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const pending = await getMaintenanceRequestsByStatus(RequestStatus.SUBMITTED);
 * ```
 */
export async function getMaintenanceRequestsByStatus(
  status: RequestStatus,
  options: FindOptions = {}
): Promise<MaintenanceRequest[]> {
  return MaintenanceRequest.findAll({
    where: { status },
    order: [['priority', 'DESC'], ['createdAt', 'ASC']],
    ...options,
  });
}

/**
 * Gets maintenance requests by asset
 *
 * @param assetId - Asset identifier
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const requests = await getMaintenanceRequestsByAsset('asset-123');
 * ```
 */
export async function getMaintenanceRequestsByAsset(
  assetId: string
): Promise<MaintenanceRequest[]> {
  return MaintenanceRequest.findAll({
    where: { assetId },
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// WORK ORDER MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a work order
 *
 * @param data - Work order data
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await createWorkOrder({
 *   assetId: 'asset-123',
 *   maintenanceType: MaintenanceType.PREVENTIVE,
 *   priority: MaintenancePriority.MEDIUM,
 *   description: 'Monthly PM inspection',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */
export async function createWorkOrder(
  data: WorkOrderData,
  transaction?: Transaction
): Promise<WorkOrder> {
  const workOrder = await WorkOrder.create(
    {
      ...data,
      status: WorkOrderStatus.DRAFT,
    },
    { transaction }
  );

  // If created from request, update request status
  if (data.maintenanceRequestId) {
    await MaintenanceRequest.update(
      { status: RequestStatus.WORK_ORDER_CREATED },
      { where: { id: data.maintenanceRequestId }, transaction }
    );
  }

  return workOrder;
}

/**
 * Assigns work order to technician
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * await assignTechnician({
 *   workOrderId: 'wo-123',
 *   technicianId: 'tech-456',
 *   assignedDate: new Date(),
 *   primaryTechnician: true,
 *   estimatedHours: 2.5
 * });
 * ```
 */
export async function assignTechnician(
  data: TechnicianAssignmentData,
  transaction?: Transaction
): Promise<TechnicianAssignment> {
  const assignment = await TechnicianAssignment.create(data, { transaction });

  // Update work order status and assigned technician
  if (data.primaryTechnician) {
    await WorkOrder.update(
      {
        status: WorkOrderStatus.ASSIGNED,
        assignedTechnicianId: data.technicianId,
      },
      { where: { id: data.workOrderId }, transaction }
    );
  }

  return assignment;
}

/**
 * Starts work order execution
 *
 * @param workOrderId - Work order identifier
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await startWorkOrder('wo-123');
 * ```
 */
export async function startWorkOrder(
  workOrderId: string,
  transaction?: Transaction
): Promise<WorkOrder> {
  const wo = await WorkOrder.findByPk(workOrderId, { transaction });
  if (!wo) {
    throw new NotFoundException(`Work order ${workOrderId} not found`);
  }

  if (wo.status !== WorkOrderStatus.SCHEDULED && wo.status !== WorkOrderStatus.ASSIGNED) {
    throw new BadRequestException('Work order must be scheduled or assigned to start');
  }

  await wo.update({
    status: WorkOrderStatus.IN_PROGRESS,
    actualStartDate: new Date(),
  }, { transaction });

  // Create downtime record if applicable
  if (wo.maintenanceType === MaintenanceType.CORRECTIVE ||
      wo.maintenanceType === MaintenanceType.EMERGENCY) {
    await createDowntimeRecord({
      assetId: wo.assetId,
      category: wo.maintenanceType === MaintenanceType.EMERGENCY
        ? DowntimeCategory.EMERGENCY
        : DowntimeCategory.UNPLANNED,
      startTime: new Date(),
      reason: wo.description,
      workOrderId: wo.id,
    }, transaction);
  }

  return wo;
}

/**
 * Completes work order
 *
 * @param data - Completion data
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await completeWorkOrder({
 *   workOrderId: 'wo-123',
 *   completedBy: 'tech-456',
 *   completionDate: new Date(),
 *   actualDuration: 135,
 *   workPerformed: 'Replaced bearings and lubricated',
 *   partsUsed: [{ partId: 'part-1', quantityUsed: 2 }],
 *   followUpRequired: false
 * });
 * ```
 */
export async function completeWorkOrder(
  data: WorkOrderCompletionData,
  transaction?: Transaction
): Promise<WorkOrder> {
  const wo = await WorkOrder.findByPk(data.workOrderId, { transaction });
  if (!wo) {
    throw new NotFoundException(`Work order ${data.workOrderId} not found`);
  }

  await wo.update({
    status: WorkOrderStatus.COMPLETED,
    actualEndDate: data.completionDate,
    actualDuration: data.actualDuration,
    completedBy: data.completedBy,
    workPerformed: data.workPerformed,
    partsUsed: data.partsUsed,
    findings: data.findings,
    recommendations: data.recommendations,
    followUpRequired: data.followUpRequired,
    followUpNotes: data.followUpNotes,
  }, { transaction });

  // Create maintenance history record
  const laborHours = data.actualDuration / 60;
  await MaintenanceHistory.create({
    assetId: wo.assetId,
    workOrderId: wo.id,
    maintenanceType: wo.maintenanceType,
    maintenanceDate: data.completionDate,
    performedBy: data.completedBy,
    workDescription: data.workPerformed,
    laborHours,
    followUpRequired: data.followUpRequired,
  }, { transaction });

  // Close downtime record if exists
  const downtime = await DowntimeRecord.findOne({
    where: { workOrderId: wo.id, endTime: null },
    transaction,
  });

  if (downtime) {
    await endDowntime(downtime.id, transaction);
  }

  // Update request status if applicable
  if (wo.maintenanceRequestId) {
    await MaintenanceRequest.update(
      { status: RequestStatus.COMPLETED },
      { where: { id: wo.maintenanceRequestId }, transaction }
    );
  }

  return wo;
}

/**
 * Puts work order on hold
 *
 * @param workOrderId - Work order identifier
 * @param reason - Hold reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await putWorkOrderOnHold('wo-123', 'Waiting for parts delivery');
 * ```
 */
export async function putWorkOrderOnHold(
  workOrderId: string,
  reason: string,
  transaction?: Transaction
): Promise<WorkOrder> {
  const wo = await WorkOrder.findByPk(workOrderId, { transaction });
  if (!wo) {
    throw new NotFoundException(`Work order ${workOrderId} not found`);
  }

  await wo.update({
    status: WorkOrderStatus.ON_HOLD,
    notes: `${wo.notes || ''}\n[${new Date().toISOString()}] On hold: ${reason}`,
  }, { transaction });

  return wo;
}

/**
 * Cancels work order
 *
 * @param workOrderId - Work order identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await cancelWorkOrder('wo-123', 'Asset no longer in service');
 * ```
 */
export async function cancelWorkOrder(
  workOrderId: string,
  reason: string,
  transaction?: Transaction
): Promise<WorkOrder> {
  const wo = await WorkOrder.findByPk(workOrderId, { transaction });
  if (!wo) {
    throw new NotFoundException(`Work order ${workOrderId} not found`);
  }

  if (wo.status === WorkOrderStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel completed work order');
  }

  await wo.update({
    status: WorkOrderStatus.CANCELLED,
    notes: `${wo.notes || ''}\n[${new Date().toISOString()}] Cancelled: ${reason}`,
  }, { transaction });

  return wo;
}

/**
 * Gets work orders by status
 *
 * @param status - Work order status
 * @param options - Query options
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const inProgress = await getWorkOrdersByStatus(WorkOrderStatus.IN_PROGRESS);
 * ```
 */
export async function getWorkOrdersByStatus(
  status: WorkOrderStatus,
  options: FindOptions = {}
): Promise<WorkOrder[]> {
  return WorkOrder.findAll({
    where: { status },
    order: [['priority', 'DESC'], ['scheduledStartDate', 'ASC']],
    ...options,
  });
}

/**
 * Gets work orders by technician
 *
 * @param technicianId - Technician identifier
 * @param activeOnly - Filter for active work orders only
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const myWorkOrders = await getWorkOrdersByTechnician('tech-123', true);
 * ```
 */
export async function getWorkOrdersByTechnician(
  technicianId: string,
  activeOnly: boolean = false
): Promise<WorkOrder[]> {
  const where: WhereOptions = { assignedTechnicianId: technicianId };

  if (activeOnly) {
    where.status = {
      [Op.in]: [
        WorkOrderStatus.ASSIGNED,
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.SCHEDULED,
      ],
    };
  }

  return WorkOrder.findAll({
    where,
    order: [['scheduledStartDate', 'ASC']],
  });
}

/**
 * Gets work orders by asset
 *
 * @param assetId - Asset identifier
 * @returns Work order history
 *
 * @example
 * ```typescript
 * const history = await getWorkOrdersByAsset('asset-123');
 * ```
 */
export async function getWorkOrdersByAsset(assetId: string): Promise<WorkOrder[]> {
  return WorkOrder.findAll({
    where: { assetId },
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// PM SCHEDULE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates PM schedule
 *
 * @param data - PM schedule data
 * @param transaction - Optional database transaction
 * @returns Created PM schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPMSchedule({
 *   assetId: 'asset-123',
 *   scheduleType: MaintenanceType.PREVENTIVE,
 *   frequency: ScheduleFrequency.MONTHLY,
 *   description: 'Monthly inspection',
 *   tasks: [{
 *     sequence: 1,
 *     description: 'Check oil levels',
 *     estimatedDuration: 15
 *   }],
 *   estimatedDuration: 60,
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export async function createPMSchedule(
  data: PMScheduleData,
  transaction?: Transaction
): Promise<PMSchedule> {
  const schedule = await PMSchedule.create(
    {
      ...data,
      isActive: true,
      totalExecutions: 0,
      nextDueDate: calculateNextDueDate(data.startDate, data.frequency, data.frequencyValue),
    },
    { transaction }
  );

  return schedule;
}

/**
 * Generates work order from PM schedule
 *
 * @param scheduleId - PM schedule identifier
 * @param scheduledDate - Scheduled execution date
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await generateWorkOrderFromPM('schedule-123', new Date('2024-06-01'));
 * ```
 */
export async function generateWorkOrderFromPM(
  scheduleId: string,
  scheduledDate: Date,
  transaction?: Transaction
): Promise<WorkOrder> {
  const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`PM schedule ${scheduleId} not found`);
  }

  if (!schedule.isActive) {
    throw new BadRequestException('PM schedule is not active');
  }

  const workOrder = await createWorkOrder({
    assetId: schedule.assetId,
    maintenanceType: schedule.scheduleType,
    priority: MaintenancePriority.MEDIUM,
    description: schedule.description,
    scheduledStartDate: scheduledDate,
    estimatedDuration: schedule.estimatedDuration,
    instructions: generatePMInstructions(schedule.tasks),
    requiredParts: schedule.requiredParts,
  }, transaction);

  // Update schedule
  await schedule.update({
    lastPerformedDate: scheduledDate,
    nextDueDate: calculateNextDueDate(scheduledDate, schedule.frequency, schedule.frequencyValue),
    totalExecutions: schedule.totalExecutions + 1,
  }, { transaction });

  return workOrder;
}

/**
 * Gets due PM schedules
 *
 * @param daysAhead - Days to look ahead
 * @returns Due PM schedules
 *
 * @example
 * ```typescript
 * const due = await getDuePMSchedules(7); // Next 7 days
 * ```
 */
export async function getDuePMSchedules(daysAhead: number = 30): Promise<PMSchedule[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return PMSchedule.findAll({
    where: {
      isActive: true,
      nextDueDate: {
        [Op.lte]: futureDate,
      },
    },
    order: [['nextDueDate', 'ASC']],
  });
}

/**
 * Updates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updatePMSchedule('schedule-123', {
 *   frequency: ScheduleFrequency.QUARTERLY,
 *   estimatedDuration: 90
 * });
 * ```
 */
export async function updatePMSchedule(
  scheduleId: string,
  updates: Partial<PMSchedule>,
  transaction?: Transaction
): Promise<PMSchedule> {
  const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`PM schedule ${scheduleId} not found`);
  }

  await schedule.update(updates, { transaction });
  return schedule;
}

/**
 * Deactivates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deactivatePMSchedule('schedule-123');
 * ```
 */
export async function deactivatePMSchedule(
  scheduleId: string,
  transaction?: Transaction
): Promise<PMSchedule> {
  const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`PM schedule ${scheduleId} not found`);
  }

  await schedule.update({ isActive: false }, { transaction });
  return schedule;
}

/**
 * Gets PM schedules by asset
 *
 * @param assetId - Asset identifier
 * @param activeOnly - Filter for active schedules only
 * @returns PM schedules
 *
 * @example
 * ```typescript
 * const schedules = await getPMSchedulesByAsset('asset-123', true);
 * ```
 */
export async function getPMSchedulesByAsset(
  assetId: string,
  activeOnly: boolean = false
): Promise<PMSchedule[]> {
  const where: WhereOptions = { assetId };
  if (activeOnly) {
    where.isActive = true;
  }

  return PMSchedule.findAll({
    where,
    order: [['nextDueDate', 'ASC']],
  });
}

// ============================================================================
// PARTS MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Reserves parts for work order
 *
 * @param data - Part reservation data
 * @param transaction - Optional database transaction
 * @returns Created reservation
 *
 * @example
 * ```typescript
 * await reservePart({
 *   workOrderId: 'wo-123',
 *   partId: 'part-456',
 *   quantity: 2,
 *   reservedBy: 'planner-789',
 *   requiredBy: new Date('2024-06-01')
 * });
 * ```
 */
export async function reservePart(
  data: PartReservationData,
  transaction?: Transaction
): Promise<PartReservation> {
  const part = await PartInventory.findByPk(data.partId, { transaction });
  if (!part) {
    throw new NotFoundException(`Part ${data.partId} not found`);
  }

  if (part.quantityAvailable < data.quantity) {
    throw new BadRequestException(
      `Insufficient quantity available. Available: ${part.quantityAvailable}, Requested: ${data.quantity}`
    );
  }

  const reservation = await PartReservation.create(
    {
      ...data,
      status: 'reserved',
    },
    { transaction }
  );

  // Update part inventory
  await part.update({
    quantityReserved: part.quantityReserved + data.quantity,
    quantityAvailable: part.quantityAvailable - data.quantity,
  }, { transaction });

  return reservation;
}

/**
 * Issues reserved parts
 *
 * @param reservationId - Reservation identifier
 * @param issuedBy - User issuing parts
 * @param quantityIssued - Quantity to issue
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await issueReservedParts('res-123', 'storekeeper-456', 2);
 * ```
 */
export async function issueReservedParts(
  reservationId: string,
  issuedBy: string,
  quantityIssued: number,
  transaction?: Transaction
): Promise<PartReservation> {
  const reservation = await PartReservation.findByPk(reservationId, {
    include: [{ model: PartInventory }],
    transaction,
  });

  if (!reservation) {
    throw new NotFoundException(`Reservation ${reservationId} not found`);
  }

  if (quantityIssued > reservation.quantityReserved) {
    throw new BadRequestException('Cannot issue more than reserved quantity');
  }

  await reservation.update({
    quantityIssued,
    status: 'issued',
    issuedBy,
    issuedDate: new Date(),
  }, { transaction });

  // Update part inventory
  const part = reservation.part!;
  await part.update({
    quantityOnHand: part.quantityOnHand - quantityIssued,
    quantityReserved: part.quantityReserved - quantityIssued,
  }, { transaction });

  return reservation;
}

/**
 * Cancels part reservation
 *
 * @param reservationId - Reservation identifier
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await cancelPartReservation('res-123');
 * ```
 */
export async function cancelPartReservation(
  reservationId: string,
  transaction?: Transaction
): Promise<PartReservation> {
  const reservation = await PartReservation.findByPk(reservationId, {
    include: [{ model: PartInventory }],
    transaction,
  });

  if (!reservation) {
    throw new NotFoundException(`Reservation ${reservationId} not found`);
  }

  if (reservation.status === 'issued') {
    throw new BadRequestException('Cannot cancel already issued reservation');
  }

  await reservation.update({ status: 'cancelled' }, { transaction });

  // Return parts to available inventory
  const part = reservation.part!;
  await part.update({
    quantityReserved: part.quantityReserved - reservation.quantityReserved,
    quantityAvailable: part.quantityAvailable + reservation.quantityReserved,
  }, { transaction });

  return reservation;
}

/**
 * Gets parts below reorder point
 *
 * @returns Parts needing reorder
 *
 * @example
 * ```typescript
 * const lowStock = await getPartsNeedingReorder();
 * ```
 */
export async function getPartsNeedingReorder(): Promise<PartInventory[]> {
  return PartInventory.findAll({
    where: {
      quantityAvailable: {
        [Op.lte]: PartInventory.sequelize!.col('reorder_point'),
      },
      reorderPoint: { [Op.not]: null },
    },
    order: [['isCritical', 'DESC'], ['quantityAvailable', 'ASC']],
  });
}

// ============================================================================
// DOWNTIME TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates downtime record
 *
 * @param data - Downtime data
 * @param transaction - Optional database transaction
 * @returns Created downtime record
 *
 * @example
 * ```typescript
 * const downtime = await createDowntimeRecord({
 *   assetId: 'asset-123',
 *   category: DowntimeCategory.UNPLANNED,
 *   startTime: new Date(),
 *   reason: 'Bearing failure',
 *   failureMode: FailureMode.MECHANICAL
 * });
 * ```
 */
export async function createDowntimeRecord(
  data: DowntimeRecordData,
  transaction?: Transaction
): Promise<DowntimeRecord> {
  const record = await DowntimeRecord.create(data, { transaction });
  return record;
}

/**
 * Ends downtime
 *
 * @param downtimeId - Downtime record identifier
 * @param transaction - Optional database transaction
 * @returns Updated downtime record
 *
 * @example
 * ```typescript
 * await endDowntime('downtime-123');
 * ```
 */
export async function endDowntime(
  downtimeId: string,
  transaction?: Transaction
): Promise<DowntimeRecord> {
  const record = await DowntimeRecord.findByPk(downtimeId, { transaction });
  if (!record) {
    throw new NotFoundException(`Downtime record ${downtimeId} not found`);
  }

  const endTime = new Date();
  const durationMinutes = Math.floor(
    (endTime.getTime() - record.startTime.getTime()) / (1000 * 60)
  );

  await record.update({
    endTime,
    durationMinutes,
  }, { transaction });

  return record;
}

/**
 * Gets downtime by asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime records
 *
 * @example
 * ```typescript
 * const downtime = await getDowntimeByAsset(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getDowntimeByAsset(
  assetId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DowntimeRecord[]> {
  const where: WhereOptions = { assetId };

  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) {
      (where.startTime as any)[Op.gte] = startDate;
    }
    if (endDate) {
      (where.startTime as any)[Op.lte] = endDate;
    }
  }

  return DowntimeRecord.findAll({
    where,
    order: [['startTime', 'DESC']],
  });
}

/**
 * Calculates downtime metrics
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateDowntimeMetrics(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function calculateDowntimeMetrics(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalDowntime: number;
  plannedDowntime: number;
  unplannedDowntime: number;
  emergencyDowntime: number;
  mtbf: number; // Mean Time Between Failures
  mttr: number; // Mean Time To Repair
}> {
  const records = await getDowntimeByAsset(assetId, startDate, endDate);

  const metrics = {
    totalDowntime: 0,
    plannedDowntime: 0,
    unplannedDowntime: 0,
    emergencyDowntime: 0,
    mtbf: 0,
    mttr: 0,
  };

  records.forEach(record => {
    const duration = record.durationMinutes || 0;
    metrics.totalDowntime += duration;

    switch (record.category) {
      case DowntimeCategory.PLANNED:
        metrics.plannedDowntime += duration;
        break;
      case DowntimeCategory.UNPLANNED:
        metrics.unplannedDowntime += duration;
        break;
      case DowntimeCategory.EMERGENCY:
        metrics.emergencyDowntime += duration;
        break;
    }
  });

  // Calculate MTTR (average repair time)
  const completedRecords = records.filter(r => r.durationMinutes);
  if (completedRecords.length > 0) {
    metrics.mttr = metrics.totalDowntime / completedRecords.length;
  }

  // Calculate MTBF
  const periodHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const operatingHours = periodHours - (metrics.totalDowntime / 60);
  if (completedRecords.length > 0) {
    metrics.mtbf = operatingHours / completedRecords.length;
  }

  return metrics;
}

// ============================================================================
// MAINTENANCE HISTORY AND ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Gets maintenance history for asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory('asset-123', 50);
 * ```
 */
export async function getMaintenanceHistory(
  assetId: string,
  limit: number = 100
): Promise<MaintenanceHistory[]> {
  return MaintenanceHistory.findAll({
    where: { assetId },
    order: [['maintenanceDate', 'DESC']],
    limit,
  });
}

/**
 * Calculates maintenance costs
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateMaintenanceCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function calculateMaintenanceCosts(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalCost: number;
  laborCost: number;
  partsCost: number;
  byMaintenanceType: Record<MaintenanceType, number>;
}> {
  const history = await MaintenanceHistory.findAll({
    where: {
      assetId,
      maintenanceDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const result = {
    totalCost: 0,
    laborCost: 0,
    partsCost: 0,
    byMaintenanceType: {} as Record<MaintenanceType, number>,
  };

  history.forEach(record => {
    const total = Number(record.totalCost || 0);
    const labor = Number(record.laborCost || 0);
    const parts = Number(record.partsCost || 0);

    result.totalCost += total;
    result.laborCost += labor;
    result.partsCost += parts;

    if (!result.byMaintenanceType[record.maintenanceType]) {
      result.byMaintenanceType[record.maintenanceType] = 0;
    }
    result.byMaintenanceType[record.maintenanceType] += total;
  });

  return result;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates next due date for PM schedule
 */
function calculateNextDueDate(
  lastDate: Date,
  frequency: ScheduleFrequency,
  customValue?: number
): Date {
  const next = new Date(lastDate);

  switch (frequency) {
    case ScheduleFrequency.DAILY:
      next.setDate(next.getDate() + (customValue || 1));
      break;
    case ScheduleFrequency.WEEKLY:
      next.setDate(next.getDate() + (customValue || 1) * 7);
      break;
    case ScheduleFrequency.MONTHLY:
      next.setMonth(next.getMonth() + (customValue || 1));
      break;
    case ScheduleFrequency.QUARTERLY:
      next.setMonth(next.getMonth() + 3);
      break;
    case ScheduleFrequency.SEMI_ANNUAL:
      next.setMonth(next.getMonth() + 6);
      break;
    case ScheduleFrequency.ANNUAL:
      next.setFullYear(next.getFullYear() + 1);
      break;
    case ScheduleFrequency.BI_ANNUAL:
      next.setFullYear(next.getFullYear() + 2);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }

  return next;
}

/**
 * Generates PM instructions from tasks
 */
function generatePMInstructions(tasks: MaintenanceTask[]): string {
  return tasks
    .sort((a, b) => a.sequence - b.sequence)
    .map(task => `${task.sequence}. ${task.description}`)
    .join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  MaintenanceRequest,
  WorkOrder,
  PMSchedule,
  TechnicianAssignment,
  PartInventory,
  PartReservation,
  DowntimeRecord,
  MaintenanceHistory,

  // Maintenance Request Functions
  createMaintenanceRequest,
  approveMaintenanceRequest,
  rejectMaintenanceRequest,
  getMaintenanceRequestsByStatus,
  getMaintenanceRequestsByAsset,

  // Work Order Functions
  createWorkOrder,
  assignTechnician,
  startWorkOrder,
  completeWorkOrder,
  putWorkOrderOnHold,
  cancelWorkOrder,
  getWorkOrdersByStatus,
  getWorkOrdersByTechnician,
  getWorkOrdersByAsset,

  // PM Schedule Functions
  createPMSchedule,
  generateWorkOrderFromPM,
  getDuePMSchedules,
  updatePMSchedule,
  deactivatePMSchedule,
  getPMSchedulesByAsset,

  // Parts Management Functions
  reservePart,
  issueReservedParts,
  cancelPartReservation,
  getPartsNeedingReorder,

  // Downtime Functions
  createDowntimeRecord,
  endDowntime,
  getDowntimeByAsset,
  calculateDowntimeMetrics,

  // History and Analytics Functions
  getMaintenanceHistory,
  calculateMaintenanceCosts,
};

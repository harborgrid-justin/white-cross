/**
 * ASSET TRANSFER MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset transfer management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive transfer workflows including:
 * - Inter-location transfers with tracking
 * - Inter-department transfers and assignments
 * - Custody transfers and chain of custody
 * - Transfer documentation and compliance
 * - Shipping management and logistics
 * - Multi-level transfer approvals
 * - Transfer cost tracking and allocation
 * - Complete transfer history and audit trails
 * - Bulk transfer operations
 * - Transfer request workflows
 * - Asset condition verification
 * - Transfer insurance and liability
 * - Real-time transfer status tracking
 *
 * @module AssetTransferCommands
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
 *   initiateAssetTransfer,
 *   approveTransferRequest,
 *   trackTransferShipment,
 *   completeTransfer,
 *   TransferType,
 *   TransferStatus
 * } from './asset-transfer-commands';
 *
 * // Initiate transfer
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department relocation',
 *   targetTransferDate: new Date('2024-07-01')
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
 * Transfer types
 */
export enum TransferType {
  INTER_LOCATION = 'inter_location',
  INTER_DEPARTMENT = 'inter_department',
  INTER_FACILITY = 'inter_facility',
  CUSTODY_CHANGE = 'custody_change',
  EMPLOYEE_ASSIGNMENT = 'employee_assignment',
  TEMPORARY_LOAN = 'temporary_loan',
  PERMANENT_TRANSFER = 'permanent_transfer',
  RETURN_FROM_LOAN = 'return_from_loan',
  MAINTENANCE_TRANSFER = 'maintenance_transfer',
  STORAGE_TRANSFER = 'storage_transfer',
}

/**
 * Transfer status
 */
export enum TransferStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
  DELAYED = 'delayed',
}

/**
 * Shipping method
 */
export enum ShippingMethod {
  INTERNAL_COURIER = 'internal_courier',
  THIRD_PARTY_CARRIER = 'third_party_carrier',
  FREIGHT = 'freight',
  AIR_FREIGHT = 'air_freight',
  HAND_CARRY = 'hand_carry',
  POSTAL_SERVICE = 'postal_service',
  WHITE_GLOVE = 'white_glove',
}

/**
 * Transfer priority
 */
export enum TransferPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

/**
 * Asset transfer request data
 */
export interface TransferRequestData {
  assetId: string;
  transferType: TransferType;
  fromLocationId?: string;
  toLocationId?: string;
  fromDepartmentId?: string;
  toDepartmentId?: string;
  fromCustodianId?: string;
  toCustodianId?: string;
  requestedBy: string;
  reason: string;
  targetTransferDate?: Date;
  expectedReturnDate?: Date;
  priority?: TransferPriority;
  requiresInsurance?: boolean;
  specialHandling?: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Transfer approval data
 */
export interface TransferApprovalData {
  transferId: string;
  approverId: string;
  approved: boolean;
  comments?: string;
  conditions?: string[];
  approvalDate: Date;
}

/**
 * Shipping details
 */
export interface ShippingDetails {
  shippingMethod: ShippingMethod;
  carrier?: string;
  trackingNumber?: string;
  shippingCost?: number;
  insuranceValue?: number;
  insuranceCost?: number;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  packagingRequirements?: string;
  specialInstructions?: string;
}

/**
 * Transfer cost breakdown
 */
export interface TransferCostBreakdown {
  shippingCost: number;
  packagingCost: number;
  insuranceCost: number;
  handlingFee: number;
  laborCost: number;
  documentationFee: number;
  otherCosts: number;
  totalCost: number;
}

/**
 * Transfer verification data
 */
export interface TransferVerification {
  verifiedBy: string;
  verificationDate: Date;
  conditionOnDeparture?: string;
  conditionOnArrival?: string;
  damageReported?: boolean;
  damageDescription?: string;
  photosOnDeparture?: string[];
  photosOnArrival?: string[];
  signatureOnDeparture?: string;
  signatureOnArrival?: string;
}

/**
 * Bulk transfer data
 */
export interface BulkTransferData {
  assetIds: string[];
  transferType: TransferType;
  fromLocationId?: string;
  toLocationId?: string;
  fromDepartmentId?: string;
  toDepartmentId?: string;
  requestedBy: string;
  reason: string;
  targetTransferDate?: Date;
}

/**
 * Bulk transfer result
 */
export interface BulkTransferResult {
  totalAssets: number;
  successful: number;
  failed: number;
  transferIds: string[];
  errors: Array<{ assetId: string; error: string }>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Asset Transfer Model
 */
@Table({
  tableName: 'asset_transfers',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['transfer_number'], unique: true },
    { fields: ['asset_id'] },
    { fields: ['transfer_type'] },
    { fields: ['status'] },
    { fields: ['from_location_id'] },
    { fields: ['to_location_id'] },
    { fields: ['from_custodian_id'] },
    { fields: ['to_custodian_id'] },
    { fields: ['requested_by'] },
    { fields: ['target_transfer_date'] },
  ],
})
export class AssetTransfer extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Transfer number' })
  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  @Index
  transferNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Transfer type' })
  @Column({
    type: DataType.ENUM(...Object.values(TransferType)),
    allowNull: false,
  })
  @Index
  transferType!: TransferType;

  @ApiProperty({ description: 'Transfer status' })
  @Column({
    type: DataType.ENUM(...Object.values(TransferStatus)),
    defaultValue: TransferStatus.DRAFT,
  })
  @Index
  status!: TransferStatus;

  @ApiProperty({ description: 'Transfer priority' })
  @Column({
    type: DataType.ENUM(...Object.values(TransferPriority)),
    defaultValue: TransferPriority.NORMAL,
  })
  priority!: TransferPriority;

  @ApiProperty({ description: 'From location ID' })
  @Column({ type: DataType.UUID })
  @Index
  fromLocationId?: string;

  @ApiProperty({ description: 'To location ID' })
  @Column({ type: DataType.UUID })
  @Index
  toLocationId?: string;

  @ApiProperty({ description: 'From department ID' })
  @Column({ type: DataType.UUID })
  fromDepartmentId?: string;

  @ApiProperty({ description: 'To department ID' })
  @Column({ type: DataType.UUID })
  toDepartmentId?: string;

  @ApiProperty({ description: 'From custodian ID' })
  @Column({ type: DataType.UUID })
  @Index
  fromCustodianId?: string;

  @ApiProperty({ description: 'To custodian ID' })
  @Column({ type: DataType.UUID })
  @Index
  toCustodianId?: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  requestedBy!: string;

  @ApiProperty({ description: 'Request date' })
  @Column({ type: DataType.DATE, allowNull: false })
  requestDate!: Date;

  @ApiProperty({ description: 'Transfer reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Target transfer date' })
  @Column({ type: DataType.DATE })
  @Index
  targetTransferDate?: Date;

  @ApiProperty({ description: 'Actual transfer date' })
  @Column({ type: DataType.DATE })
  actualTransferDate?: Date;

  @ApiProperty({ description: 'Expected return date (for loans)' })
  @Column({ type: DataType.DATE })
  expectedReturnDate?: Date;

  @ApiProperty({ description: 'Actual return date (for loans)' })
  @Column({ type: DataType.DATE })
  actualReturnDate?: Date;

  @ApiProperty({ description: 'Requires approval' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  requiresApproval!: boolean;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Requires insurance' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  requiresInsurance!: boolean;

  @ApiProperty({ description: 'Insurance value' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  insuranceValue?: number;

  @ApiProperty({ description: 'Shipping details' })
  @Column({ type: DataType.JSONB })
  shippingDetails?: ShippingDetails;

  @ApiProperty({ description: 'Transfer cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  transferCost?: number;

  @ApiProperty({ description: 'Cost breakdown' })
  @Column({ type: DataType.JSONB })
  costBreakdown?: TransferCostBreakdown;

  @ApiProperty({ description: 'Cost allocation department' })
  @Column({ type: DataType.UUID })
  costAllocationDepartmentId?: string;

  @ApiProperty({ description: 'Special handling instructions' })
  @Column({ type: DataType.TEXT })
  specialHandling?: string;

  @ApiProperty({ description: 'Departure verification' })
  @Column({ type: DataType.JSONB })
  departureVerification?: Partial<TransferVerification>;

  @ApiProperty({ description: 'Arrival verification' })
  @Column({ type: DataType.JSONB })
  arrivalVerification?: Partial<TransferVerification>;

  @ApiProperty({ description: 'Condition on departure' })
  @Column({ type: DataType.STRING(100) })
  conditionOnDeparture?: string;

  @ApiProperty({ description: 'Condition on arrival' })
  @Column({ type: DataType.STRING(100) })
  conditionOnArrival?: string;

  @ApiProperty({ description: 'Damage reported' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  damageReported!: boolean;

  @ApiProperty({ description: 'Damage description' })
  @Column({ type: DataType.TEXT })
  damageDescription?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => TransferApproval)
  approvals?: TransferApproval[];

  @HasMany(() => TransferStatusHistory)
  statusHistory?: TransferStatusHistory[];

  @HasMany(() => TransferAuditLog)
  auditLogs?: TransferAuditLog[];
}

/**
 * Transfer Approval Model
 */
@Table({
  tableName: 'transfer_approvals',
  timestamps: true,
  indexes: [
    { fields: ['transfer_id'] },
    { fields: ['approver_id'] },
    { fields: ['approved'] },
    { fields: ['approval_date'] },
  ],
})
export class TransferApproval extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Transfer ID' })
  @ForeignKey(() => AssetTransfer)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  transferId!: string;

  @ApiProperty({ description: 'Approver user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  approverId!: string;

  @ApiProperty({ description: 'Approval level' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  approvalLevel!: number;

  @ApiProperty({ description: 'Approved' })
  @Column({ type: DataType.BOOLEAN })
  @Index
  approved?: boolean;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  @Index
  approvalDate?: Date;

  @ApiProperty({ description: 'Comments' })
  @Column({ type: DataType.TEXT })
  comments?: string;

  @ApiProperty({ description: 'Conditions' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  conditions?: string[];

  @ApiProperty({ description: 'Notified' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  notified!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => AssetTransfer)
  transfer?: AssetTransfer;
}

/**
 * Transfer Status History Model
 */
@Table({
  tableName: 'transfer_status_history',
  timestamps: true,
  indexes: [
    { fields: ['transfer_id'] },
    { fields: ['status'] },
    { fields: ['changed_at'] },
  ],
})
export class TransferStatusHistory extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Transfer ID' })
  @ForeignKey(() => AssetTransfer)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  transferId!: string;

  @ApiProperty({ description: 'Previous status' })
  @Column({ type: DataType.ENUM(...Object.values(TransferStatus)) })
  previousStatus?: TransferStatus;

  @ApiProperty({ description: 'New status' })
  @Column({
    type: DataType.ENUM(...Object.values(TransferStatus)),
    allowNull: false,
  })
  @Index
  status!: TransferStatus;

  @ApiProperty({ description: 'Changed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  changedBy!: string;

  @ApiProperty({ description: 'Changed at' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  changedAt!: Date;

  @ApiProperty({ description: 'Location at time of change' })
  @Column({ type: DataType.STRING(200) })
  locationAtChange?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @BelongsTo(() => AssetTransfer)
  transfer?: AssetTransfer;
}

/**
 * Transfer Audit Log Model
 */
@Table({
  tableName: 'transfer_audit_logs',
  timestamps: true,
  indexes: [
    { fields: ['transfer_id'] },
    { fields: ['action_type'] },
    { fields: ['performed_by'] },
    { fields: ['action_timestamp'] },
  ],
})
export class TransferAuditLog extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Transfer ID' })
  @ForeignKey(() => AssetTransfer)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  transferId!: string;

  @ApiProperty({ description: 'Action type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  actionType!: string;

  @ApiProperty({ description: 'Action description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  actionDescription!: string;

  @ApiProperty({ description: 'Performed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  performedBy!: string;

  @ApiProperty({ description: 'Action timestamp' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  actionTimestamp!: Date;

  @ApiProperty({ description: 'Previous state' })
  @Column({ type: DataType.JSONB })
  previousState?: Record<string, any>;

  @ApiProperty({ description: 'New state' })
  @Column({ type: DataType.JSONB })
  newState?: Record<string, any>;

  @ApiProperty({ description: 'IP address' })
  @Column({ type: DataType.STRING(50) })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent' })
  @Column({ type: DataType.TEXT })
  userAgent?: string;

  @CreatedAt
  createdAt!: Date;

  @BelongsTo(() => AssetTransfer)
  transfer?: AssetTransfer;
}

/**
 * Transfer Template Model - For common transfer routes
 */
@Table({
  tableName: 'transfer_templates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['template_name'] },
    { fields: ['is_active'] },
  ],
})
export class TransferTemplate extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Template name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  templateName!: string;

  @ApiProperty({ description: 'Transfer type' })
  @Column({ type: DataType.ENUM(...Object.values(TransferType)) })
  transferType!: TransferType;

  @ApiProperty({ description: 'From location ID' })
  @Column({ type: DataType.UUID })
  fromLocationId?: string;

  @ApiProperty({ description: 'To location ID' })
  @Column({ type: DataType.UUID })
  toLocationId?: string;

  @ApiProperty({ description: 'Default shipping method' })
  @Column({ type: DataType.ENUM(...Object.values(ShippingMethod)) })
  defaultShippingMethod?: ShippingMethod;

  @ApiProperty({ description: 'Estimated transit days' })
  @Column({ type: DataType.INTEGER })
  estimatedTransitDays?: number;

  @ApiProperty({ description: 'Estimated cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedCost?: number;

  @ApiProperty({ description: 'Required approvers' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  requiredApprovers?: string[];

  @ApiProperty({ description: 'Special instructions' })
  @Column({ type: DataType.TEXT })
  specialInstructions?: string;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

// ============================================================================
// TRANSFER REQUEST MANAGEMENT
// ============================================================================

/**
 * Initiates a new asset transfer
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department consolidation',
 *   targetTransferDate: new Date('2024-07-01'),
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
export async function initiateAssetTransfer(
  data: TransferRequestData,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  // Validate asset exists and is available for transfer
  // In production, would check asset status and location

  // Generate unique transfer number
  const transferNumber = await generateTransferNumber();

  const transfer = await AssetTransfer.create(
    {
      transferNumber,
      assetId: data.assetId,
      transferType: data.transferType,
      fromLocationId: data.fromLocationId,
      toLocationId: data.toLocationId,
      fromDepartmentId: data.fromDepartmentId,
      toDepartmentId: data.toDepartmentId,
      fromCustodianId: data.fromCustodianId,
      toCustodianId: data.toCustodianId,
      requestedBy: data.requestedBy,
      requestDate: new Date(),
      reason: data.reason,
      targetTransferDate: data.targetTransferDate,
      expectedReturnDate: data.expectedReturnDate,
      priority: data.priority || TransferPriority.NORMAL,
      requiresInsurance: data.requiresInsurance || false,
      specialHandling: data.specialHandling,
      notes: data.notes,
      attachments: data.attachments,
      status: TransferStatus.DRAFT,
    },
    { transaction },
  );

  // Create initial status history
  await createStatusHistory(
    transfer.id,
    undefined,
    TransferStatus.DRAFT,
    data.requestedBy,
    'Transfer initiated',
    transaction,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId: transfer.id,
    actionType: 'TRANSFER_INITIATED',
    actionDescription: `Transfer initiated for asset ${data.assetId}`,
    performedBy: data.requestedBy,
    actionTimestamp: new Date(),
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

/**
 * Generates unique transfer number
 *
 * @returns Transfer number
 *
 * @example
 * ```typescript
 * const transferNumber = await generateTransferNumber();
 * // Returns: "TRF-2024-001234"
 * ```
 */
export async function generateTransferNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await AssetTransfer.count({
    where: {
      createdAt: {
        [Op.gte]: new Date(`${year}-01-01`),
      },
    },
  });

  return `TRF-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Updates transfer status
 *
 * @param transferId - Transfer ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param location - Optional current location
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await updateTransferStatus(
 *   'transfer-123',
 *   TransferStatus.IN_TRANSIT,
 *   'user-001',
 *   'Asset picked up by courier',
 *   'Warehouse A - Loading Dock'
 * );
 * ```
 */
export async function updateTransferStatus(
  transferId: string,
  status: TransferStatus,
  updatedBy: string,
  notes?: string,
  location?: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  const previousState = transfer.toJSON();
  const oldStatus = transfer.status;

  await transfer.update(
    {
      status,
      notes: notes ? `${transfer.notes || ''}\n[${new Date().toISOString()}] ${notes}` : transfer.notes,
    },
    { transaction },
  );

  // Create status history
  await createStatusHistory(
    transferId,
    oldStatus,
    status,
    updatedBy,
    notes,
    transaction,
    location,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'STATUS_CHANGED',
    actionDescription: `Status changed from ${oldStatus} to ${status}`,
    performedBy: updatedBy,
    actionTimestamp: new Date(),
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

/**
 * Creates status history entry
 */
async function createStatusHistory(
  transferId: string,
  previousStatus: TransferStatus | undefined,
  status: TransferStatus,
  changedBy: string,
  notes?: string,
  transaction?: Transaction,
  location?: string,
): Promise<TransferStatusHistory> {
  return TransferStatusHistory.create(
    {
      transferId,
      previousStatus,
      status,
      changedBy,
      changedAt: new Date(),
      locationAtChange: location,
      notes,
    },
    { transaction },
  );
}

/**
 * Submits transfer for approval
 *
 * @param transferId - Transfer ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await submitTransferForApproval('transfer-123', 'user-001');
 * ```
 */
export async function submitTransferForApproval(
  transferId: string,
  submittedBy: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== TransferStatus.DRAFT) {
    throw new BadRequestException('Only draft transfers can be submitted for approval');
  }

  // Determine required approvers
  const approvers = await getRequiredApprovers(transfer);

  // Create approval records
  for (const approver of approvers) {
    await TransferApproval.create(
      {
        transferId,
        approverId: approver.userId,
        approvalLevel: approver.level,
      },
      { transaction },
    );
  }

  return updateTransferStatus(
    transferId,
    TransferStatus.PENDING_APPROVAL,
    submittedBy,
    'Submitted for approval',
    undefined,
    transaction,
  );
}

/**
 * Gets required approvers for transfer
 *
 * @param transfer - Transfer record
 * @returns Array of required approvers
 */
async function getRequiredApprovers(
  transfer: AssetTransfer,
): Promise<Array<{ userId: string; level: number; role: string }>> {
  const approvers: Array<{ userId: string; level: number; role: string }> = [];

  // Level 1: Source location manager
  if (transfer.fromLocationId) {
    approvers.push({
      userId: 'location-mgr-from', // Would be looked up from location
      level: 1,
      role: 'Source Location Manager',
    });
  }

  // Level 2: Destination location manager
  if (transfer.toLocationId) {
    approvers.push({
      userId: 'location-mgr-to', // Would be looked up from location
      level: 2,
      role: 'Destination Location Manager',
    });
  }

  // Level 3: Asset Manager (for high-value or critical priority)
  if (transfer.priority === TransferPriority.CRITICAL || transfer.priority === TransferPriority.HIGH) {
    approvers.push({
      userId: 'asset-manager',
      level: 3,
      role: 'Asset Manager',
    });
  }

  // Level 4: Department head (for inter-department transfers)
  if (transfer.transferType === TransferType.INTER_DEPARTMENT) {
    approvers.push({
      userId: 'dept-head',
      level: 4,
      role: 'Department Head',
    });
  }

  return approvers;
}

/**
 * Processes transfer approval
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await approveTransferRequest({
 *   transferId: 'transfer-123',
 *   approverId: 'mgr-001',
 *   approved: true,
 *   comments: 'Approved - asset available for transfer',
 *   approvalDate: new Date()
 * });
 * ```
 */
export async function approveTransferRequest(
  data: TransferApprovalData,
  transaction?: Transaction,
): Promise<TransferApproval> {
  const approval = await TransferApproval.findOne({
    where: {
      transferId: data.transferId,
      approverId: data.approverId,
      approved: null,
    },
    transaction,
  });

  if (!approval) {
    throw new NotFoundException('Pending approval not found for this approver');
  }

  const previousState = approval.toJSON();

  await approval.update(
    {
      approved: data.approved,
      approvalDate: data.approvalDate,
      comments: data.comments,
      conditions: data.conditions,
      notified: false,
    },
    { transaction },
  );

  // Check if all approvals are complete
  const allApprovals = await TransferApproval.findAll({
    where: { transferId: data.transferId },
    transaction,
  });

  const allApproved = allApprovals.every((a) => a.approved === true);
  const anyRejected = allApprovals.some((a) => a.approved === false);

  const transfer = await AssetTransfer.findByPk(data.transferId, { transaction });

  if (allApproved) {
    await transfer?.update(
      {
        status: TransferStatus.APPROVED,
        approvedBy: data.approverId,
        approvalDate: data.approvalDate,
      },
      { transaction },
    );

    await createStatusHistory(
      data.transferId,
      TransferStatus.PENDING_APPROVAL,
      TransferStatus.APPROVED,
      data.approverId,
      'All approvals received',
      transaction,
    );
  } else if (anyRejected) {
    await transfer?.update(
      {
        status: TransferStatus.REJECTED,
      },
      { transaction },
    );

    await createStatusHistory(
      data.transferId,
      TransferStatus.PENDING_APPROVAL,
      TransferStatus.REJECTED,
      data.approverId,
      `Rejected: ${data.comments}`,
      transaction,
    );
  }

  // Create audit log
  await createTransferAuditLog({
    transferId: data.transferId,
    actionType: 'APPROVAL_DECISION',
    actionDescription: `Transfer ${data.approved ? 'approved' : 'rejected'} by ${data.approverId}`,
    performedBy: data.approverId,
    actionTimestamp: data.approvalDate,
    previousState,
    newState: approval.toJSON(),
  }, transaction);

  return approval;
}

/**
 * Gets transfer with all approvals
 *
 * @param transferId - Transfer ID
 * @returns Transfer with approvals
 *
 * @example
 * ```typescript
 * const transfer = await getTransferWithApprovals('transfer-123');
 * ```
 */
export async function getTransferWithApprovals(
  transferId: string,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, {
    include: [
      { model: TransferApproval, as: 'approvals' },
      { model: TransferStatusHistory, as: 'statusHistory' },
    ],
  });

  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  return transfer;
}

// ============================================================================
// SHIPPING AND LOGISTICS MANAGEMENT
// ============================================================================

/**
 * Assigns shipping details to transfer
 *
 * @param transferId - Transfer ID
 * @param shippingDetails - Shipping information
 * @param assignedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await assignShippingDetails('transfer-123', {
 *   shippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   carrier: 'FedEx',
 *   trackingNumber: '1Z999AA10123456784',
 *   shippingCost: 125.50,
 *   insuranceValue: 50000,
 *   estimatedDeliveryDate: new Date('2024-07-05')
 * }, 'user-001');
 * ```
 */
export async function assignShippingDetails(
  transferId: string,
  shippingDetails: ShippingDetails,
  assignedBy: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== TransferStatus.APPROVED) {
    throw new BadRequestException('Transfer must be approved before assigning shipping');
  }

  const previousState = transfer.toJSON();

  await transfer.update(
    {
      shippingDetails,
    },
    { transaction },
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'SHIPPING_ASSIGNED',
    actionDescription: `Shipping assigned: ${shippingDetails.shippingMethod} via ${shippingDetails.carrier || 'internal'}`,
    performedBy: assignedBy,
    actionTimestamp: new Date(),
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

/**
 * Tracks shipment status update
 *
 * @param transferId - Transfer ID
 * @param trackingUpdate - Tracking information
 * @param updatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await trackTransferShipment('transfer-123', {
 *   currentLocation: 'Memphis, TN Distribution Center',
 *   status: 'In Transit',
 *   estimatedDelivery: new Date('2024-07-05'),
 *   lastUpdate: new Date()
 * }, 'system');
 * ```
 */
export async function trackTransferShipment(
  transferId: string,
  trackingUpdate: {
    currentLocation?: string;
    status?: string;
    estimatedDelivery?: Date;
    lastUpdate: Date;
    notes?: string;
  },
  updatedBy: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  const updatedShipping = {
    ...transfer.shippingDetails,
    ...trackingUpdate,
  };

  await transfer.update(
    {
      shippingDetails: updatedShipping,
      metadata: {
        ...transfer.metadata,
        trackingHistory: [
          ...(transfer.metadata?.trackingHistory || []),
          trackingUpdate,
        ],
      },
    },
    { transaction },
  );

  return transfer;
}

/**
 * Records departure verification
 *
 * @param transferId - Transfer ID
 * @param verification - Departure verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordDepartureVerification('transfer-123', {
 *   verifiedBy: 'warehouse-001',
 *   verificationDate: new Date(),
 *   conditionOnDeparture: 'Excellent',
 *   photosOnDeparture: ['https://storage/photo1.jpg'],
 *   signatureOnDeparture: 'base64-signature-data'
 * });
 * ```
 */
export async function recordDepartureVerification(
  transferId: string,
  verification: Partial<TransferVerification>,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  const previousState = transfer.toJSON();

  await transfer.update(
    {
      departureVerification: verification,
      conditionOnDeparture: verification.conditionOnDeparture,
      status: TransferStatus.IN_TRANSIT,
      actualTransferDate: verification.verificationDate,
    },
    { transaction },
  );

  await createStatusHistory(
    transferId,
    transfer.status,
    TransferStatus.IN_TRANSIT,
    verification.verifiedBy!,
    'Asset departed source location',
    transaction,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'DEPARTURE_VERIFIED',
    actionDescription: 'Asset departure verified and documented',
    performedBy: verification.verifiedBy!,
    actionTimestamp: verification.verificationDate!,
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

/**
 * Records arrival verification
 *
 * @param transferId - Transfer ID
 * @param verification - Arrival verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordArrivalVerification('transfer-123', {
 *   verifiedBy: 'warehouse-002',
 *   verificationDate: new Date(),
 *   conditionOnArrival: 'Good',
 *   damageReported: false,
 *   photosOnArrival: ['https://storage/arrival1.jpg'],
 *   signatureOnArrival: 'base64-signature-data'
 * });
 * ```
 */
export async function recordArrivalVerification(
  transferId: string,
  verification: Partial<TransferVerification>,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== TransferStatus.IN_TRANSIT) {
    throw new BadRequestException('Transfer must be in transit to record arrival');
  }

  const previousState = transfer.toJSON();

  await transfer.update(
    {
      arrivalVerification: verification,
      conditionOnArrival: verification.conditionOnArrival,
      damageReported: verification.damageReported || false,
      damageDescription: verification.damageDescription,
      status: TransferStatus.DELIVERED,
    },
    { transaction },
  );

  await createStatusHistory(
    transferId,
    TransferStatus.IN_TRANSIT,
    TransferStatus.DELIVERED,
    verification.verifiedBy!,
    'Asset arrived at destination',
    transaction,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'ARRIVAL_VERIFIED',
    actionDescription: 'Asset arrival verified and documented',
    performedBy: verification.verifiedBy!,
    actionTimestamp: verification.verificationDate!,
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

// ============================================================================
// TRANSFER COST MANAGEMENT
// ============================================================================

/**
 * Calculates transfer cost
 *
 * @param transferId - Transfer ID
 * @param costDetails - Cost component details
 * @param transaction - Optional database transaction
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateTransferCost('transfer-123', {
 *   shippingCost: 125.50,
 *   packagingCost: 35.00,
 *   insuranceCost: 50.00,
 *   handlingFee: 25.00,
 *   laborCost: 75.00
 * });
 * ```
 */
export async function calculateTransferCost(
  transferId: string,
  costDetails: {
    shippingCost?: number;
    packagingCost?: number;
    insuranceCost?: number;
    handlingFee?: number;
    laborCost?: number;
    documentationFee?: number;
    otherCosts?: number;
  },
  transaction?: Transaction,
): Promise<TransferCostBreakdown> {
  const breakdown: TransferCostBreakdown = {
    shippingCost: costDetails.shippingCost || 0,
    packagingCost: costDetails.packagingCost || 0,
    insuranceCost: costDetails.insuranceCost || 0,
    handlingFee: costDetails.handlingFee || 0,
    laborCost: costDetails.laborCost || 0,
    documentationFee: costDetails.documentationFee || 10, // Default doc fee
    otherCosts: costDetails.otherCosts || 0,
    totalCost: 0,
  };

  breakdown.totalCost =
    breakdown.shippingCost +
    breakdown.packagingCost +
    breakdown.insuranceCost +
    breakdown.handlingFee +
    breakdown.laborCost +
    breakdown.documentationFee +
    breakdown.otherCosts;

  await AssetTransfer.update(
    {
      transferCost: breakdown.totalCost,
      costBreakdown: breakdown,
    },
    {
      where: { id: transferId },
      transaction,
    },
  );

  return breakdown;
}

/**
 * Allocates transfer cost to department
 *
 * @param transferId - Transfer ID
 * @param departmentId - Department to charge
 * @param allocatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await allocateTransferCost('transfer-123', 'dept-002', 'admin-001');
 * ```
 */
export async function allocateTransferCost(
  transferId: string,
  departmentId: string,
  allocatedBy: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  await transfer.update(
    {
      costAllocationDepartmentId: departmentId,
    },
    { transaction },
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'COST_ALLOCATED',
    actionDescription: `Transfer cost of $${transfer.transferCost} allocated to department ${departmentId}`,
    performedBy: allocatedBy,
    actionTimestamp: new Date(),
  }, transaction);

  return transfer;
}

// ============================================================================
// TRANSFER COMPLETION AND FINALIZATION
// ============================================================================

/**
 * Completes asset transfer
 *
 * @param transferId - Transfer ID
 * @param completedBy - User ID
 * @param finalNotes - Optional final notes
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 *
 * @example
 * ```typescript
 * await completeTransfer('transfer-123', 'user-001',
 *   'Asset successfully transferred, all documentation complete'
 * );
 * ```
 */
export async function completeTransfer(
  transferId: string,
  completedBy: string,
  finalNotes?: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== TransferStatus.DELIVERED) {
    throw new BadRequestException('Transfer must be delivered before completion');
  }

  // Validate required verifications
  if (!transfer.departureVerification || !transfer.arrivalVerification) {
    throw new BadRequestException('Both departure and arrival verifications required');
  }

  const previousState = transfer.toJSON();

  await transfer.update(
    {
      status: TransferStatus.COMPLETED,
      notes: finalNotes
        ? `${transfer.notes || ''}\n[${new Date().toISOString()}] ${finalNotes}`
        : transfer.notes,
    },
    { transaction },
  );

  await createStatusHistory(
    transferId,
    TransferStatus.DELIVERED,
    TransferStatus.COMPLETED,
    completedBy,
    'Transfer completed successfully',
    transaction,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'TRANSFER_COMPLETED',
    actionDescription: 'Transfer completed and finalized',
    performedBy: completedBy,
    actionTimestamp: new Date(),
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

/**
 * Cancels asset transfer
 *
 * @param transferId - Transfer ID
 * @param cancelledBy - User ID
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Cancelled transfer
 *
 * @example
 * ```typescript
 * await cancelTransfer('transfer-123', 'user-001',
 *   'Asset no longer required at destination'
 * );
 * ```
 */
export async function cancelTransfer(
  transferId: string,
  cancelledBy: string,
  reason: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const transfer = await AssetTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.status === TransferStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel completed transfer');
  }

  if (transfer.status === TransferStatus.IN_TRANSIT) {
    throw new BadRequestException('Cannot cancel transfer in transit - put on hold first');
  }

  const previousState = transfer.toJSON();
  const oldStatus = transfer.status;

  await transfer.update(
    {
      status: TransferStatus.CANCELLED,
      notes: `${transfer.notes || ''}\n[${new Date().toISOString()}] CANCELLED: ${reason}`,
    },
    { transaction },
  );

  await createStatusHistory(
    transferId,
    oldStatus,
    TransferStatus.CANCELLED,
    cancelledBy,
    `Cancelled: ${reason}`,
    transaction,
  );

  // Create audit log
  await createTransferAuditLog({
    transferId,
    actionType: 'TRANSFER_CANCELLED',
    actionDescription: `Transfer cancelled: ${reason}`,
    performedBy: cancelledBy,
    actionTimestamp: new Date(),
    previousState,
    newState: transfer.toJSON(),
  }, transaction);

  return transfer;
}

// ============================================================================
// BULK TRANSFER OPERATIONS
// ============================================================================

/**
 * Initiates bulk asset transfer
 *
 * @param data - Bulk transfer data
 * @param transaction - Optional database transaction
 * @returns Bulk transfer result
 *
 * @example
 * ```typescript
 * const result = await initiateBulkTransfer({
 *   assetIds: ['asset-001', 'asset-002', 'asset-003'],
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Office relocation',
 *   targetTransferDate: new Date('2024-08-01')
 * });
 * ```
 */
export async function initiateBulkTransfer(
  data: BulkTransferData,
  transaction?: Transaction,
): Promise<BulkTransferResult> {
  const result: BulkTransferResult = {
    totalAssets: data.assetIds.length,
    successful: 0,
    failed: 0,
    transferIds: [],
    errors: [],
  };

  for (const assetId of data.assetIds) {
    try {
      const transfer = await initiateAssetTransfer(
        {
          assetId,
          transferType: data.transferType,
          fromLocationId: data.fromLocationId,
          toLocationId: data.toLocationId,
          fromDepartmentId: data.fromDepartmentId,
          toDepartmentId: data.toDepartmentId,
          requestedBy: data.requestedBy,
          reason: data.reason,
          targetTransferDate: data.targetTransferDate,
        },
        transaction,
      );

      result.successful++;
      result.transferIds.push(transfer.id);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        assetId,
        error: error.message,
      });
    }
  }

  return result;
}

/**
 * Bulk approves transfers
 *
 * @param transferIds - Array of transfer IDs
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Bulk approval result
 *
 * @example
 * ```typescript
 * const result = await bulkApproveTransfers(
 *   ['transfer-001', 'transfer-002', 'transfer-003'],
 *   'mgr-001',
 *   'Batch approved for Q3 office move'
 * );
 * ```
 */
export async function bulkApproveTransfers(
  transferIds: string[],
  approverId: string,
  comments?: string,
  transaction?: Transaction,
): Promise<{ successful: number; failed: number; errors: Array<{ transferId: string; error: string }> }> {
  const result = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ transferId: string; error: string }>,
  };

  for (const transferId of transferIds) {
    try {
      await approveTransferRequest(
        {
          transferId,
          approverId,
          approved: true,
          comments,
          approvalDate: new Date(),
        },
        transaction,
      );
      result.successful++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({ transferId, error: error.message });
    }
  }

  return result;
}

// ============================================================================
// TRANSFER TEMPLATES AND AUTOMATION
// ============================================================================

/**
 * Creates transfer template
 *
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createTransferTemplate({
 *   templateName: 'HQ to Branch Office A',
 *   transferType: TransferType.INTER_FACILITY,
 *   fromLocationId: 'loc-hq',
 *   toLocationId: 'loc-branch-a',
 *   defaultShippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   estimatedTransitDays: 3,
 *   estimatedCost: 150
 * });
 * ```
 */
export async function createTransferTemplate(
  templateData: {
    templateName: string;
    transferType: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
    defaultShippingMethod?: ShippingMethod;
    estimatedTransitDays?: number;
    estimatedCost?: number;
    requiredApprovers?: string[];
    specialInstructions?: string;
  },
  transaction?: Transaction,
): Promise<TransferTemplate> {
  return TransferTemplate.create(templateData, { transaction });
}

/**
 * Creates transfer from template
 *
 * @param templateId - Template ID
 * @param assetId - Asset to transfer
 * @param requestedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createTransferFromTemplate(
 *   'template-123',
 *   'asset-456',
 *   'user-001'
 * );
 * ```
 */
export async function createTransferFromTemplate(
  templateId: string,
  assetId: string,
  requestedBy: string,
  transaction?: Transaction,
): Promise<AssetTransfer> {
  const template = await TransferTemplate.findByPk(templateId, { transaction });
  if (!template) {
    throw new NotFoundException(`Template ${templateId} not found`);
  }

  if (!template.isActive) {
    throw new BadRequestException('Template is not active');
  }

  const transfer = await initiateAssetTransfer(
    {
      assetId,
      transferType: template.transferType,
      fromLocationId: template.fromLocationId,
      toLocationId: template.toLocationId,
      requestedBy,
      reason: `Transfer using template: ${template.templateName}`,
      specialHandling: template.specialInstructions,
    },
    transaction,
  );

  return transfer;
}

// ============================================================================
// AUDIT AND REPORTING
// ============================================================================

/**
 * Creates transfer audit log entry
 */
async function createTransferAuditLog(
  logData: {
    transferId: string;
    actionType: string;
    actionDescription: string;
    performedBy: string;
    actionTimestamp: Date;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  },
  transaction?: Transaction,
): Promise<TransferAuditLog> {
  return TransferAuditLog.create(logData, { transaction });
}

/**
 * Gets transfer audit trail
 *
 * @param transferId - Transfer ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getTransferAuditTrail('transfer-123');
 * ```
 */
export async function getTransferAuditTrail(
  transferId: string,
): Promise<TransferAuditLog[]> {
  return TransferAuditLog.findAll({
    where: { transferId },
    order: [['actionTimestamp', 'DESC']],
  });
}

/**
 * Gets transfer status history
 *
 * @param transferId - Transfer ID
 * @returns Status history
 *
 * @example
 * ```typescript
 * const history = await getTransferStatusHistory('transfer-123');
 * ```
 */
export async function getTransferStatusHistory(
  transferId: string,
): Promise<TransferStatusHistory[]> {
  return TransferStatusHistory.findAll({
    where: { transferId },
    order: [['changedAt', 'DESC']],
  });
}

/**
 * Generates transfer analytics report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @param filters - Optional filters
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateTransferReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function generateTransferReport(
  startDate: Date,
  endDate: Date,
  filters?: {
    transferType?: TransferType;
    fromLocationId?: string;
    toLocationId?: string;
  },
): Promise<{
  totalTransfers: number;
  byType: Record<TransferType, number>;
  byStatus: Record<TransferStatus, number>;
  averageTransitDays: number;
  totalCost: number;
  onTimeDelivery: number;
  damageRate: number;
}> {
  const where: WhereOptions = {
    createdAt: {
      [Op.between]: [startDate, endDate],
    },
  };

  if (filters?.transferType) {
    where.transferType = filters.transferType;
  }
  if (filters?.fromLocationId) {
    where.fromLocationId = filters.fromLocationId;
  }
  if (filters?.toLocationId) {
    where.toLocationId = filters.toLocationId;
  }

  const transfers = await AssetTransfer.findAll({ where });

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let totalCost = 0;
  let totalTransitDays = 0;
  let onTimeCount = 0;
  let damageCount = 0;

  transfers.forEach((transfer) => {
    byType[transfer.transferType] = (byType[transfer.transferType] || 0) + 1;
    byStatus[transfer.status] = (byStatus[transfer.status] || 0) + 1;
    totalCost += Number(transfer.transferCost || 0);

    if (transfer.actualTransferDate && transfer.shippingDetails?.actualDeliveryDate) {
      const transitDays = Math.floor(
        (transfer.shippingDetails.actualDeliveryDate.getTime() - transfer.actualTransferDate.getTime()) /
        (1000 * 60 * 60 * 24),
      );
      totalTransitDays += transitDays;

      if (
        transfer.shippingDetails.estimatedDeliveryDate &&
        transfer.shippingDetails.actualDeliveryDate <= transfer.shippingDetails.estimatedDeliveryDate
      ) {
        onTimeCount++;
      }
    }

    if (transfer.damageReported) {
      damageCount++;
    }
  });

  const completedTransfers = transfers.filter((t) => t.status === TransferStatus.COMPLETED).length;

  return {
    totalTransfers: transfers.length,
    byType: byType as Record<TransferType, number>,
    byStatus: byStatus as Record<TransferStatus, number>,
    averageTransitDays: completedTransfers > 0 ? totalTransitDays / completedTransfers : 0,
    totalCost,
    onTimeDelivery: completedTransfers > 0 ? (onTimeCount / completedTransfers) * 100 : 0,
    damageRate: transfers.length > 0 ? (damageCount / transfers.length) * 100 : 0,
  };
}

/**
 * Searches transfers with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered transfers
 *
 * @example
 * ```typescript
 * const results = await searchTransfers({
 *   status: TransferStatus.IN_TRANSIT,
 *   fromLocationId: 'loc-001',
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
export async function searchTransfers(
  filters: {
    status?: TransferStatus | TransferStatus[];
    transferType?: TransferType | TransferType[];
    assetId?: string;
    fromLocationId?: string;
    toLocationId?: string;
    requestedBy?: string;
    priority?: TransferPriority;
    startDate?: Date;
    endDate?: Date;
  },
  options: FindOptions = {},
): Promise<{ transfers: AssetTransfer[]; total: number }> {
  const where: WhereOptions = {};

  if (filters.status) {
    where.status = Array.isArray(filters.status)
      ? { [Op.in]: filters.status }
      : filters.status;
  }

  if (filters.transferType) {
    where.transferType = Array.isArray(filters.transferType)
      ? { [Op.in]: filters.transferType }
      : filters.transferType;
  }

  if (filters.assetId) {
    where.assetId = filters.assetId;
  }

  if (filters.fromLocationId) {
    where.fromLocationId = filters.fromLocationId;
  }

  if (filters.toLocationId) {
    where.toLocationId = filters.toLocationId;
  }

  if (filters.requestedBy) {
    where.requestedBy = filters.requestedBy;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.startDate || filters.endDate) {
    where.requestDate = {};
    if (filters.startDate) {
      (where.requestDate as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.requestDate as any)[Op.lte] = filters.endDate;
    }
  }

  const { rows: transfers, count: total } = await AssetTransfer.findAndCountAll({
    where,
    include: [
      { model: TransferApproval, as: 'approvals' },
      { model: TransferStatusHistory, as: 'statusHistory' },
    ],
    ...options,
  });

  return { transfers, total };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AssetTransfer,
  TransferApproval,
  TransferStatusHistory,
  TransferAuditLog,
  TransferTemplate,

  // Transfer Management
  initiateAssetTransfer,
  generateTransferNumber,
  updateTransferStatus,
  submitTransferForApproval,
  approveTransferRequest,
  getTransferWithApprovals,

  // Shipping and Logistics
  assignShippingDetails,
  trackTransferShipment,
  recordDepartureVerification,
  recordArrivalVerification,

  // Cost Management
  calculateTransferCost,
  allocateTransferCost,

  // Completion
  completeTransfer,
  cancelTransfer,

  // Bulk Operations
  initiateBulkTransfer,
  bulkApproveTransfers,

  // Templates
  createTransferTemplate,
  createTransferFromTemplate,

  // Audit and Reporting
  getTransferAuditTrail,
  getTransferStatusHistory,
  generateTransferReport,
  searchTransfers,
};

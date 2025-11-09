/**
 * ASSET DISPOSAL MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset disposal management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive disposal workflows including:
 * - Disposal workflows and approval processes
 * - Salvage value calculation and optimization
 * - Multiple disposal methods (sale, donation, scrap, trade-in)
 * - Environmental disposal requirements and compliance
 * - Disposal documentation and audit trails
 * - Asset write-off processing
 * - Disposal approvals and authorization
 * - Disposal vendor management
 * - Revenue recovery tracking
 * - Disposal cost management
 * - Certificate of destruction
 * - Data sanitization requirements
 * - Regulatory compliance (EPA, WEEE, RoHS)
 *
 * @module AssetDisposalCommands
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
 *   initiateAssetDisposal,
 *   calculateSalvageValue,
 *   processDisposalApproval,
 *   generateCertificateOfDestruction,
 *   DisposalRequest,
 *   DisposalMethod
 * } from './asset-disposal-commands';
 *
 * // Initiate disposal request
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'End of useful life',
 *   estimatedValue: 5000,
 *   requestedBy: 'user-001'
 * });
 *
 * // Calculate salvage value
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'fair',
 *   assetCondition: 'good',
 *   demandLevel: 'high'
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
  IsEmail,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Disposal methods
 */
export enum DisposalMethod {
  SALE = 'sale',
  DONATION = 'donation',
  SCRAP = 'scrap',
  RECYCLE = 'recycle',
  TRADE_IN = 'trade_in',
  DESTRUCTION = 'destruction',
  RETURN_TO_VENDOR = 'return_to_vendor',
  CANNIBALIZE = 'cannibalize',
  LANDFILL = 'landfill',
  HAZARDOUS_WASTE = 'hazardous_waste',
}

/**
 * Disposal request status
 */
export enum DisposalStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

/**
 * Approval status
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated',
  WITHDRAWN = 'withdrawn',
}

/**
 * Environmental classification
 */
export enum EnvironmentalClassification {
  NON_HAZARDOUS = 'non_hazardous',
  HAZARDOUS = 'hazardous',
  ELECTRONIC_WASTE = 'electronic_waste',
  CHEMICAL = 'chemical',
  BIOLOGICAL = 'biological',
  RADIOACTIVE = 'radioactive',
  UNIVERSAL_WASTE = 'universal_waste',
}

/**
 * Data sanitization level
 */
export enum DataSanitizationLevel {
  NONE = 'none',
  BASIC_WIPE = 'basic_wipe',
  DOD_3_PASS = 'dod_3_pass',
  DOD_7_PASS = 'dod_7_pass',
  GUTMANN = 'gutmann',
  PHYSICAL_DESTRUCTION = 'physical_destruction',
  DEGAUSSING = 'degaussing',
}

/**
 * Asset disposal request data
 */
export interface DisposalRequestData {
  assetId: string;
  disposalMethod: DisposalMethod;
  reason: string;
  requestedBy: string;
  estimatedValue?: number;
  targetDisposalDate?: Date;
  disposalVendorId?: string;
  requiresDataSanitization?: boolean;
  sanitizationLevel?: DataSanitizationLevel;
  environmentalClassification?: EnvironmentalClassification;
  notes?: string;
  attachments?: string[];
}

/**
 * Salvage value calculation parameters
 */
export interface SalvageValueParams {
  marketConditions?: 'excellent' | 'good' | 'fair' | 'poor';
  assetCondition?: 'excellent' | 'good' | 'fair' | 'poor';
  demandLevel?: 'high' | 'medium' | 'low';
  urgency?: 'immediate' | 'normal' | 'flexible';
  includeShippingCost?: boolean;
  includeRestorationCost?: boolean;
}

/**
 * Salvage value result
 */
export interface SalvageValueResult {
  assetId: string;
  originalCost: number;
  currentBookValue: number;
  estimatedMarketValue: number;
  salvageValue: number;
  restorationCost: number;
  shippingCost: number;
  netSalvageValue: number;
  calculationDate: Date;
  confidenceLevel: number;
  factors: Record<string, any>;
}

/**
 * Disposal approval data
 */
export interface DisposalApprovalData {
  disposalRequestId: string;
  approverId: string;
  decision: ApprovalStatus;
  comments?: string;
  conditions?: string[];
  approvalDate: Date;
}

/**
 * Environmental disposal requirements
 */
export interface EnvironmentalRequirements {
  classification: EnvironmentalClassification;
  requiresPermit: boolean;
  permitNumbers?: string[];
  handlingInstructions: string;
  regulatoryCompliance: string[];
  certifiedVendorRequired: boolean;
  manifestRequired: boolean;
  disposalFacilityType?: string;
  transportationRequirements?: string;
}

/**
 * Certificate of destruction data
 */
export interface CertificateOfDestructionData {
  disposalRequestId: string;
  certificateNumber: string;
  issuedBy: string;
  issuedDate: Date;
  destructionMethod: string;
  destructionDate: Date;
  witnessList?: string[];
  photographicEvidence?: string[];
  videoEvidence?: string[];
  certificationStandard?: string;
}

/**
 * Disposal cost breakdown
 */
export interface DisposalCostBreakdown {
  vendorFees: number;
  transportationCost: number;
  sanitizationCost: number;
  certificationCost: number;
  environmentalFees: number;
  administrativeCost: number;
  totalCost: number;
}

/**
 * Revenue recovery tracking
 */
export interface RevenueRecovery {
  saleAmount?: number;
  tradeInValue?: number;
  salvageValue?: number;
  taxDeduction?: number;
  totalRecovery: number;
  recoveryPercentage: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Disposal Request Model
 */
@Table({
  tableName: 'asset_disposal_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['status'] },
    { fields: ['disposal_method'] },
    { fields: ['requested_by'] },
    { fields: ['target_disposal_date'] },
    { fields: ['disposal_vendor_id'] },
  ],
})
export class DisposalRequest extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Disposal request number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  requestNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Disposal method' })
  @Column({
    type: DataType.ENUM(...Object.values(DisposalMethod)),
    allowNull: false,
  })
  @Index
  disposalMethod!: DisposalMethod;

  @ApiProperty({ description: 'Disposal status' })
  @Column({
    type: DataType.ENUM(...Object.values(DisposalStatus)),
    defaultValue: DisposalStatus.DRAFT,
  })
  @Index
  status!: DisposalStatus;

  @ApiProperty({ description: 'Disposal reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  requestedBy!: string;

  @ApiProperty({ description: 'Request date' })
  @Column({ type: DataType.DATE, allowNull: false })
  requestDate!: Date;

  @ApiProperty({ description: 'Estimated disposal value' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedValue?: number;

  @ApiProperty({ description: 'Actual disposal value' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  actualValue?: number;

  @ApiProperty({ description: 'Target disposal date' })
  @Column({ type: DataType.DATE })
  @Index
  targetDisposalDate?: Date;

  @ApiProperty({ description: 'Actual disposal date' })
  @Column({ type: DataType.DATE })
  actualDisposalDate?: Date;

  @ApiProperty({ description: 'Disposal vendor ID' })
  @Column({ type: DataType.UUID })
  @Index
  disposalVendorId?: string;

  @ApiProperty({ description: 'Requires data sanitization' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  requiresDataSanitization!: boolean;

  @ApiProperty({ description: 'Data sanitization level' })
  @Column({ type: DataType.ENUM(...Object.values(DataSanitizationLevel)) })
  sanitizationLevel?: DataSanitizationLevel;

  @ApiProperty({ description: 'Sanitization completed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sanitizationCompleted!: boolean;

  @ApiProperty({ description: 'Sanitization date' })
  @Column({ type: DataType.DATE })
  sanitizationDate?: Date;

  @ApiProperty({ description: 'Sanitized by user ID' })
  @Column({ type: DataType.UUID })
  sanitizedBy?: string;

  @ApiProperty({ description: 'Environmental classification' })
  @Column({ type: DataType.ENUM(...Object.values(EnvironmentalClassification)) })
  environmentalClassification?: EnvironmentalClassification;

  @ApiProperty({ description: 'Environmental permit required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  permitRequired!: boolean;

  @ApiProperty({ description: 'Permit numbers' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  permitNumbers?: string[];

  @ApiProperty({ description: 'Approval required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  approvalRequired!: boolean;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Disposal cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  disposalCost?: number;

  @ApiProperty({ description: 'Cost breakdown' })
  @Column({ type: DataType.JSONB })
  costBreakdown?: DisposalCostBreakdown;

  @ApiProperty({ description: 'Revenue recovery' })
  @Column({ type: DataType.JSONB })
  revenueRecovery?: RevenueRecovery;

  @ApiProperty({ description: 'Certificate of destruction ID' })
  @Column({ type: DataType.UUID })
  certificateOfDestructionId?: string;

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

  @HasMany(() => DisposalApproval)
  approvals?: DisposalApproval[];

  @HasMany(() => DisposalAuditLog)
  auditLogs?: DisposalAuditLog[];
}

/**
 * Disposal Approval Model
 */
@Table({
  tableName: 'asset_disposal_approvals',
  timestamps: true,
  indexes: [
    { fields: ['disposal_request_id'] },
    { fields: ['approver_id'] },
    { fields: ['status'] },
    { fields: ['approval_date'] },
  ],
})
export class DisposalApproval extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Disposal request ID' })
  @ForeignKey(() => DisposalRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  disposalRequestId!: string;

  @ApiProperty({ description: 'Approver user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  approverId!: string;

  @ApiProperty({ description: 'Approval level' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  approvalLevel!: number;

  @ApiProperty({ description: 'Approval status' })
  @Column({
    type: DataType.ENUM(...Object.values(ApprovalStatus)),
    defaultValue: ApprovalStatus.PENDING,
  })
  @Index
  status!: ApprovalStatus;

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

  @BelongsTo(() => DisposalRequest)
  disposalRequest?: DisposalRequest;
}

/**
 * Disposal Vendor Model
 */
@Table({
  tableName: 'disposal_vendors',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['vendor_code'], unique: true },
    { fields: ['is_active'] },
    { fields: ['is_certified'] },
  ],
})
export class DisposalVendor extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor code' })
  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  @Index
  vendorCode!: string;

  @ApiProperty({ description: 'Vendor name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  vendorName!: string;

  @ApiProperty({ description: 'Disposal methods offered' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  disposalMethodsOffered!: DisposalMethod[];

  @ApiProperty({ description: 'Certifications' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  certifications?: string[];

  @ApiProperty({ description: 'Is certified vendor' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isCertified!: boolean;

  @ApiProperty({ description: 'Environmental compliance' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  environmentalCompliance?: string[];

  @ApiProperty({ description: 'Contact name' })
  @Column({ type: DataType.STRING(200) })
  contactName?: string;

  @ApiProperty({ description: 'Contact email' })
  @Column({ type: DataType.STRING(200) })
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone' })
  @Column({ type: DataType.STRING(50) })
  contactPhone?: string;

  @ApiProperty({ description: 'Address' })
  @Column({ type: DataType.JSONB })
  address?: Record<string, any>;

  @ApiProperty({ description: 'Service areas' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  serviceAreas?: string[];

  @ApiProperty({ description: 'Pricing structure' })
  @Column({ type: DataType.JSONB })
  pricingStructure?: Record<string, any>;

  @ApiProperty({ description: 'Performance rating' })
  @Column({ type: DataType.DECIMAL(3, 2) })
  performanceRating?: number;

  @ApiProperty({ description: 'Is active' })
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
 * Certificate of Destruction Model
 */
@Table({
  tableName: 'certificates_of_destruction',
  timestamps: true,
  indexes: [
    { fields: ['certificate_number'], unique: true },
    { fields: ['disposal_request_id'] },
    { fields: ['issued_date'] },
  ],
})
export class CertificateOfDestruction extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Certificate number' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  certificateNumber!: string;

  @ApiProperty({ description: 'Disposal request ID' })
  @ForeignKey(() => DisposalRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  disposalRequestId!: string;

  @ApiProperty({ description: 'Issued by' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  issuedBy!: string;

  @ApiProperty({ description: 'Issued date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  issuedDate!: Date;

  @ApiProperty({ description: 'Destruction method' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  destructionMethod!: string;

  @ApiProperty({ description: 'Destruction date' })
  @Column({ type: DataType.DATE, allowNull: false })
  destructionDate!: Date;

  @ApiProperty({ description: 'Destruction location' })
  @Column({ type: DataType.STRING(500) })
  destructionLocation?: string;

  @ApiProperty({ description: 'Witness list' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  witnessList?: string[];

  @ApiProperty({ description: 'Photographic evidence URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  photographicEvidence?: string[];

  @ApiProperty({ description: 'Video evidence URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  videoEvidence?: string[];

  @ApiProperty({ description: 'Certification standard' })
  @Column({ type: DataType.STRING(100) })
  certificationStandard?: string;

  @ApiProperty({ description: 'Compliance verification' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  complianceVerification?: string[];

  @ApiProperty({ description: 'Digital signature' })
  @Column({ type: DataType.TEXT })
  digitalSignature?: string;

  @ApiProperty({ description: 'Certificate document URL' })
  @Column({ type: DataType.STRING(500) })
  certificateDocumentUrl?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DisposalRequest)
  disposalRequest?: DisposalRequest;
}

/**
 * Disposal Audit Log Model
 */
@Table({
  tableName: 'disposal_audit_logs',
  timestamps: true,
  indexes: [
    { fields: ['disposal_request_id'] },
    { fields: ['action_type'] },
    { fields: ['performed_by'] },
    { fields: ['action_timestamp'] },
  ],
})
export class DisposalAuditLog extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Disposal request ID' })
  @ForeignKey(() => DisposalRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  disposalRequestId!: string;

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

  @BelongsTo(() => DisposalRequest)
  disposalRequest?: DisposalRequest;
}

// ============================================================================
// DISPOSAL REQUEST MANAGEMENT
// ============================================================================

/**
 * Initiates a new asset disposal request
 *
 * @param data - Disposal request data
 * @param transaction - Optional database transaction
 * @returns Created disposal request
 *
 * @example
 * ```typescript
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'Equipment upgrade, existing unit fully functional',
 *   requestedBy: 'user-001',
 *   estimatedValue: 15000,
 *   targetDisposalDate: new Date('2024-06-30')
 * });
 * ```
 */
export async function initiateAssetDisposal(
  data: DisposalRequestData,
  transaction?: Transaction,
): Promise<DisposalRequest> {
  // Validate asset exists (would check against Asset model)
  // In production, verify asset is not already in disposal process

  // Generate unique request number
  const requestNumber = await generateDisposalRequestNumber();

  const disposal = await DisposalRequest.create(
    {
      requestNumber,
      assetId: data.assetId,
      disposalMethod: data.disposalMethod,
      reason: data.reason,
      requestedBy: data.requestedBy,
      requestDate: new Date(),
      estimatedValue: data.estimatedValue,
      targetDisposalDate: data.targetDisposalDate,
      disposalVendorId: data.disposalVendorId,
      requiresDataSanitization: data.requiresDataSanitization || false,
      sanitizationLevel: data.sanitizationLevel,
      environmentalClassification: data.environmentalClassification,
      notes: data.notes,
      attachments: data.attachments,
      status: DisposalStatus.DRAFT,
    },
    { transaction },
  );

  // Create audit log
  await createDisposalAuditLog({
    disposalRequestId: disposal.id,
    actionType: 'DISPOSAL_INITIATED',
    actionDescription: `Disposal request initiated for asset ${data.assetId}`,
    performedBy: data.requestedBy,
    actionTimestamp: new Date(),
    newState: disposal.toJSON(),
  }, transaction);

  return disposal;
}

/**
 * Generates unique disposal request number
 *
 * @returns Disposal request number
 *
 * @example
 * ```typescript
 * const requestNumber = await generateDisposalRequestNumber();
 * // Returns: "DISP-2024-001234"
 * ```
 */
export async function generateDisposalRequestNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await DisposalRequest.count({
    where: {
      createdAt: {
        [Op.gte]: new Date(`${year}-01-01`),
      },
    },
  });

  return `DISP-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Updates disposal request status
 *
 * @param requestId - Disposal request ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await updateDisposalStatus(
 *   'disposal-123',
 *   DisposalStatus.PENDING_APPROVAL,
 *   'user-001',
 *   'Ready for management review'
 * );
 * ```
 */
export async function updateDisposalStatus(
  requestId: string,
  status: DisposalStatus,
  updatedBy: string,
  notes?: string,
  transaction?: Transaction,
): Promise<DisposalRequest> {
  const disposal = await DisposalRequest.findByPk(requestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  const previousState = disposal.toJSON();
  const oldStatus = disposal.status;

  await disposal.update(
    {
      status,
      notes: notes ? `${disposal.notes || ''}\n[${new Date().toISOString()}] ${notes}` : disposal.notes,
    },
    { transaction },
  );

  // Create audit log
  await createDisposalAuditLog({
    disposalRequestId: requestId,
    actionType: 'STATUS_CHANGED',
    actionDescription: `Status changed from ${oldStatus} to ${status}`,
    performedBy: updatedBy,
    actionTimestamp: new Date(),
    previousState,
    newState: disposal.toJSON(),
  }, transaction);

  return disposal;
}

/**
 * Submits disposal request for approval
 *
 * @param requestId - Disposal request ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await submitDisposalForApproval('disposal-123', 'user-001');
 * ```
 */
export async function submitDisposalForApproval(
  requestId: string,
  submittedBy: string,
  transaction?: Transaction,
): Promise<DisposalRequest> {
  const disposal = await DisposalRequest.findByPk(requestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  if (disposal.status !== DisposalStatus.DRAFT) {
    throw new BadRequestException('Only draft requests can be submitted for approval');
  }

  // Create approval records based on approval hierarchy
  const approvalLevels = await getRequiredApprovalLevels(disposal);

  for (const level of approvalLevels) {
    await DisposalApproval.create(
      {
        disposalRequestId: requestId,
        approverId: level.approverId,
        approvalLevel: level.level,
        status: ApprovalStatus.PENDING,
      },
      { transaction },
    );
  }

  return updateDisposalStatus(
    requestId,
    DisposalStatus.PENDING_APPROVAL,
    submittedBy,
    'Submitted for approval',
    transaction,
  );
}

/**
 * Gets required approval levels for disposal request
 *
 * @param disposal - Disposal request
 * @returns Array of approval level requirements
 *
 * @example
 * ```typescript
 * const levels = await getRequiredApprovalLevels(disposalRequest);
 * ```
 */
export async function getRequiredApprovalLevels(
  disposal: DisposalRequest,
): Promise<Array<{ level: number; approverId: string; roleName: string }>> {
  const levels: Array<{ level: number; approverId: string; roleName: string }> = [];

  // Level 1: Department Manager (always required)
  levels.push({
    level: 1,
    approverId: 'dept-manager-id', // Would be determined from asset's department
    roleName: 'Department Manager',
  });

  // Level 2: Asset Manager (for values > $5,000)
  if ((disposal.estimatedValue || 0) > 5000) {
    levels.push({
      level: 2,
      approverId: 'asset-manager-id',
      roleName: 'Asset Manager',
    });
  }

  // Level 3: CFO (for values > $25,000)
  if ((disposal.estimatedValue || 0) > 25000) {
    levels.push({
      level: 3,
      approverId: 'cfo-id',
      roleName: 'CFO',
    });
  }

  // Level 4: Environmental Officer (for hazardous materials)
  if (
    disposal.environmentalClassification &&
    disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS
  ) {
    levels.push({
      level: 4,
      approverId: 'env-officer-id',
      roleName: 'Environmental Officer',
    });
  }

  return levels;
}

/**
 * Processes disposal approval decision
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await processDisposalApproval({
 *   disposalRequestId: 'disposal-123',
 *   approverId: 'user-mgr-001',
 *   decision: ApprovalStatus.APPROVED,
 *   comments: 'Approved for disposal via certified vendor',
 *   approvalDate: new Date()
 * });
 * ```
 */
export async function processDisposalApproval(
  data: DisposalApprovalData,
  transaction?: Transaction,
): Promise<DisposalApproval> {
  // Find the pending approval for this approver
  const approval = await DisposalApproval.findOne({
    where: {
      disposalRequestId: data.disposalRequestId,
      approverId: data.approverId,
      status: ApprovalStatus.PENDING,
    },
    transaction,
  });

  if (!approval) {
    throw new NotFoundException('Pending approval not found for this approver');
  }

  const previousState = approval.toJSON();

  await approval.update(
    {
      status: data.decision,
      approvalDate: data.approvalDate,
      comments: data.comments,
      conditions: data.conditions,
      notified: false,
    },
    { transaction },
  );

  // Check if all approvals are complete
  const allApprovals = await DisposalApproval.findAll({
    where: { disposalRequestId: data.disposalRequestId },
    transaction,
  });

  const allApproved = allApprovals.every(
    (a) => a.status === ApprovalStatus.APPROVED,
  );
  const anyRejected = allApprovals.some(
    (a) => a.status === ApprovalStatus.REJECTED,
  );

  const disposal = await DisposalRequest.findByPk(data.disposalRequestId, { transaction });

  if (allApproved) {
    await disposal?.update(
      {
        status: DisposalStatus.APPROVED,
        approvedBy: data.approverId,
        approvalDate: data.approvalDate,
      },
      { transaction },
    );
  } else if (anyRejected) {
    await disposal?.update(
      {
        status: DisposalStatus.REJECTED,
      },
      { transaction },
    );
  }

  // Create audit log
  await createDisposalAuditLog({
    disposalRequestId: data.disposalRequestId,
    actionType: 'APPROVAL_DECISION',
    actionDescription: `Approval ${data.decision} by ${data.approverId}`,
    performedBy: data.approverId,
    actionTimestamp: data.approvalDate,
    previousState,
    newState: approval.toJSON(),
  }, transaction);

  return approval;
}

/**
 * Gets disposal request with all approvals
 *
 * @param requestId - Disposal request ID
 * @returns Disposal request with approvals
 *
 * @example
 * ```typescript
 * const disposal = await getDisposalWithApprovals('disposal-123');
 * console.log(disposal.approvals);
 * ```
 */
export async function getDisposalWithApprovals(
  requestId: string,
): Promise<DisposalRequest> {
  const disposal = await DisposalRequest.findByPk(requestId, {
    include: [
      {
        model: DisposalApproval,
        as: 'approvals',
      },
    ],
  });

  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  return disposal;
}

// ============================================================================
// SALVAGE VALUE CALCULATION
// ============================================================================

/**
 * Calculates salvage value for asset
 *
 * @param assetId - Asset ID
 * @param params - Calculation parameters
 * @param transaction - Optional database transaction
 * @returns Salvage value calculation result
 *
 * @example
 * ```typescript
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'good',
 *   assetCondition: 'fair',
 *   demandLevel: 'medium',
 *   urgency: 'normal',
 *   includeShippingCost: true,
 *   includeRestorationCost: true
 * });
 * ```
 */
export async function calculateSalvageValue(
  assetId: string,
  params: SalvageValueParams = {},
  transaction?: Transaction,
): Promise<SalvageValueResult> {
  // In production, would fetch actual asset data
  const asset = {
    id: assetId,
    originalCost: 100000,
    currentBookValue: 45000,
    acquisitionDate: new Date('2020-01-01'),
    assetType: 'medical-equipment',
    manufacturer: 'GE Healthcare',
    model: 'MRI-3000',
  };

  const {
    marketConditions = 'fair',
    assetCondition = 'good',
    demandLevel = 'medium',
    urgency = 'normal',
    includeShippingCost = true,
    includeRestorationCost = true,
  } = params;

  // Base salvage value starts with current book value
  let salvageValue = asset.currentBookValue;

  // Market conditions factor
  const marketFactors = {
    excellent: 1.2,
    good: 1.0,
    fair: 0.8,
    poor: 0.6,
  };
  salvageValue *= marketFactors[marketConditions];

  // Asset condition factor
  const conditionFactors = {
    excellent: 1.0,
    good: 0.85,
    fair: 0.65,
    poor: 0.4,
  };
  salvageValue *= conditionFactors[assetCondition];

  // Demand level factor
  const demandFactors = {
    high: 1.3,
    medium: 1.0,
    low: 0.7,
  };
  salvageValue *= demandFactors[demandLevel];

  // Urgency factor
  const urgencyFactors = {
    immediate: 0.7,
    normal: 1.0,
    flexible: 1.1,
  };
  salvageValue *= urgencyFactors[urgency];

  // Calculate restoration cost
  const restorationCost = includeRestorationCost
    ? salvageValue * 0.1 // Assume 10% restoration cost
    : 0;

  // Calculate shipping cost
  const shippingCost = includeShippingCost
    ? asset.originalCost * 0.02 // Assume 2% of original cost
    : 0;

  // Estimated market value (before costs)
  const estimatedMarketValue = salvageValue;

  // Net salvage value after costs
  const netSalvageValue = Math.max(0, salvageValue - restorationCost - shippingCost);

  // Confidence level (0-100)
  const confidenceLevel = calculateConfidenceLevel({
    marketConditions,
    assetCondition,
    demandLevel,
    urgency,
  });

  return {
    assetId,
    originalCost: asset.originalCost,
    currentBookValue: asset.currentBookValue,
    estimatedMarketValue,
    salvageValue,
    restorationCost,
    shippingCost,
    netSalvageValue,
    calculationDate: new Date(),
    confidenceLevel,
    factors: {
      marketConditions,
      assetCondition,
      demandLevel,
      urgency,
      marketFactor: marketFactors[marketConditions],
      conditionFactor: conditionFactors[assetCondition],
      demandFactor: demandFactors[demandLevel],
      urgencyFactor: urgencyFactors[urgency],
    },
  };
}

/**
 * Calculates confidence level for salvage value estimate
 *
 * @param factors - Calculation factors
 * @returns Confidence level (0-100)
 */
function calculateConfidenceLevel(factors: {
  marketConditions: string;
  assetCondition: string;
  demandLevel: string;
  urgency: string;
}): number {
  let confidence = 70; // Base confidence

  // Adjust based on market conditions
  if (factors.marketConditions === 'excellent' || factors.marketConditions === 'good') {
    confidence += 10;
  } else if (factors.marketConditions === 'poor') {
    confidence -= 15;
  }

  // Adjust based on asset condition
  if (factors.assetCondition === 'excellent') {
    confidence += 10;
  } else if (factors.assetCondition === 'poor') {
    confidence -= 10;
  }

  // Adjust based on demand
  if (factors.demandLevel === 'high') {
    confidence += 10;
  } else if (factors.demandLevel === 'low') {
    confidence -= 10;
  }

  return Math.max(0, Math.min(100, confidence));
}

/**
 * Optimizes salvage value through market analysis
 *
 * @param assetId - Asset ID
 * @param targetRevenue - Target revenue amount
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeSalvageValue('asset-123', 50000);
 * ```
 */
export async function optimizeSalvageValue(
  assetId: string,
  targetRevenue?: number,
): Promise<{
  currentEstimate: SalvageValueResult;
  recommendations: Array<{
    strategy: string;
    expectedValue: number;
    timeline: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  optimalStrategy: string;
}> {
  const currentEstimate = await calculateSalvageValue(assetId, {
    marketConditions: 'fair',
    assetCondition: 'good',
    demandLevel: 'medium',
    urgency: 'normal',
  });

  const recommendations = [
    {
      strategy: 'Immediate sale as-is',
      expectedValue: currentEstimate.netSalvageValue * 0.85,
      timeline: '1-2 weeks',
      riskLevel: 'low' as const,
    },
    {
      strategy: 'Minor refurbishment + sale',
      expectedValue: currentEstimate.netSalvageValue * 1.15,
      timeline: '4-6 weeks',
      riskLevel: 'medium' as const,
    },
    {
      strategy: 'Full refurbishment + auction',
      expectedValue: currentEstimate.netSalvageValue * 1.35,
      timeline: '8-12 weeks',
      riskLevel: 'high' as const,
    },
    {
      strategy: 'Part out components',
      expectedValue: currentEstimate.netSalvageValue * 1.2,
      timeline: '12-16 weeks',
      riskLevel: 'medium' as const,
    },
  ];

  // Determine optimal strategy based on target revenue
  let optimalStrategy = recommendations[0].strategy;
  if (targetRevenue) {
    const viableOptions = recommendations.filter(
      (r) => r.expectedValue >= targetRevenue,
    );
    if (viableOptions.length > 0) {
      // Choose option with lowest risk among viable options
      optimalStrategy = viableOptions.sort((a, b) => {
        const riskOrder = { low: 1, medium: 2, high: 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      })[0].strategy;
    } else {
      // If no option meets target, choose highest value
      optimalStrategy = recommendations.sort(
        (a, b) => b.expectedValue - a.expectedValue,
      )[0].strategy;
    }
  }

  return {
    currentEstimate,
    recommendations,
    optimalStrategy,
  };
}

/**
 * Compares disposal methods by financial impact
 *
 * @param assetId - Asset ID
 * @returns Comparison of disposal methods
 *
 * @example
 * ```typescript
 * const comparison = await compareDisposalMethods('asset-123');
 * ```
 */
export async function compareDisposalMethods(
  assetId: string,
): Promise<Array<{
  method: DisposalMethod;
  estimatedRevenue: number;
  estimatedCost: number;
  netValue: number;
  timeline: string;
  complexity: 'low' | 'medium' | 'high';
}>> {
  const salvage = await calculateSalvageValue(assetId);

  return [
    {
      method: DisposalMethod.SALE,
      estimatedRevenue: salvage.netSalvageValue,
      estimatedCost: salvage.shippingCost + salvage.restorationCost,
      netValue: salvage.netSalvageValue,
      timeline: '4-8 weeks',
      complexity: 'medium',
    },
    {
      method: DisposalMethod.TRADE_IN,
      estimatedRevenue: salvage.netSalvageValue * 0.85,
      estimatedCost: 0,
      netValue: salvage.netSalvageValue * 0.85,
      timeline: '1-2 weeks',
      complexity: 'low',
    },
    {
      method: DisposalMethod.DONATION,
      estimatedRevenue: salvage.currentBookValue * 0.3, // Tax deduction
      estimatedCost: salvage.shippingCost,
      netValue: salvage.currentBookValue * 0.3 - salvage.shippingCost,
      timeline: '2-4 weeks',
      complexity: 'medium',
    },
    {
      method: DisposalMethod.SCRAP,
      estimatedRevenue: salvage.salvageValue * 0.1,
      estimatedCost: 500,
      netValue: salvage.salvageValue * 0.1 - 500,
      timeline: '1 week',
      complexity: 'low',
    },
    {
      method: DisposalMethod.RECYCLE,
      estimatedRevenue: 0,
      estimatedCost: 1000,
      netValue: -1000,
      timeline: '2 weeks',
      complexity: 'low',
    },
  ];
}

// ============================================================================
// ENVIRONMENTAL COMPLIANCE AND DISPOSAL REQUIREMENTS
// ============================================================================

/**
 * Determines environmental requirements for asset disposal
 *
 * @param assetId - Asset ID
 * @param disposalMethod - Disposal method
 * @returns Environmental requirements
 *
 * @example
 * ```typescript
 * const requirements = await getEnvironmentalRequirements(
 *   'asset-123',
 *   DisposalMethod.RECYCLE
 * );
 * ```
 */
export async function getEnvironmentalRequirements(
  assetId: string,
  disposalMethod: DisposalMethod,
): Promise<EnvironmentalRequirements> {
  // In production, would fetch actual asset environmental data
  const asset = {
    id: assetId,
    assetType: 'electronic-equipment',
    containsHazardousMaterials: true,
    materials: ['lead', 'mercury', 'lithium-batteries'],
  };

  let classification: EnvironmentalClassification;
  let requiresPermit = false;
  let certifiedVendorRequired = false;
  let manifestRequired = false;

  if (asset.containsHazardousMaterials) {
    if (asset.assetType === 'electronic-equipment') {
      classification = EnvironmentalClassification.ELECTRONIC_WASTE;
      certifiedVendorRequired = true;
      manifestRequired = true;
    } else {
      classification = EnvironmentalClassification.HAZARDOUS;
      requiresPermit = true;
      certifiedVendorRequired = true;
      manifestRequired = true;
    }
  } else {
    classification = EnvironmentalClassification.NON_HAZARDOUS;
  }

  const regulatoryCompliance = [];
  if (classification === EnvironmentalClassification.ELECTRONIC_WASTE) {
    regulatoryCompliance.push('WEEE Directive', 'RoHS Compliance', 'EPA R2 Standard');
  }
  if (classification === EnvironmentalClassification.HAZARDOUS) {
    regulatoryCompliance.push('RCRA', 'EPA TSCA', 'DOT Hazardous Materials');
  }

  return {
    classification,
    requiresPermit,
    permitNumbers: requiresPermit ? ['EPA-2024-12345'] : undefined,
    handlingInstructions: generateHandlingInstructions(classification, disposalMethod),
    regulatoryCompliance,
    certifiedVendorRequired,
    manifestRequired,
    disposalFacilityType: getRequiredFacilityType(classification, disposalMethod),
    transportationRequirements: getTransportationRequirements(classification),
  };
}

/**
 * Generates handling instructions based on classification
 */
function generateHandlingInstructions(
  classification: EnvironmentalClassification,
  method: DisposalMethod,
): string {
  const instructions: string[] = [];

  switch (classification) {
    case EnvironmentalClassification.ELECTRONIC_WASTE:
      instructions.push(
        'Remove and segregate batteries',
        'Drain all fluids',
        'Label all hazardous components',
        'Use anti-static packaging',
        'Transport in enclosed vehicle',
      );
      break;
    case EnvironmentalClassification.HAZARDOUS:
      instructions.push(
        'Use appropriate PPE during handling',
        'Maintain chain of custody documentation',
        'Store in approved containment',
        'Transport with certified hazmat carrier',
        'Obtain signed manifests',
      );
      break;
    default:
      instructions.push(
        'Standard handling procedures apply',
        'Ensure proper packaging for transport',
      );
  }

  return instructions.join('\n');
}

/**
 * Gets required facility type for disposal
 */
function getRequiredFacilityType(
  classification: EnvironmentalClassification,
  method: DisposalMethod,
): string {
  if (classification === EnvironmentalClassification.HAZARDOUS) {
    return 'EPA-permitted hazardous waste facility';
  }
  if (classification === EnvironmentalClassification.ELECTRONIC_WASTE) {
    return 'R2 or e-Stewards certified e-waste recycler';
  }
  if (method === DisposalMethod.RECYCLE) {
    return 'Certified recycling facility';
  }
  return 'Standard disposal facility';
}

/**
 * Gets transportation requirements
 */
function getTransportationRequirements(
  classification: EnvironmentalClassification,
): string {
  if (
    classification === EnvironmentalClassification.HAZARDOUS ||
    classification === EnvironmentalClassification.ELECTRONIC_WASTE
  ) {
    return 'DOT-certified hazardous materials transporter with proper placarding and documentation';
  }
  return 'Standard freight transportation';
}

/**
 * Validates disposal vendor compliance
 *
 * @param vendorId - Disposal vendor ID
 * @param requirements - Environmental requirements
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVendorCompliance('vendor-123', requirements);
 * ```
 */
export async function validateVendorCompliance(
  vendorId: string,
  requirements: EnvironmentalRequirements,
): Promise<{
  compliant: boolean;
  missingCertifications: string[];
  warnings: string[];
}> {
  const vendor = await DisposalVendor.findByPk(vendorId);
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  const missingCertifications: string[] = [];
  const warnings: string[] = [];

  if (requirements.certifiedVendorRequired && !vendor.isCertified) {
    missingCertifications.push('Certified vendor status required');
  }

  const vendorCompliance = vendor.environmentalCompliance || [];
  requirements.regulatoryCompliance.forEach((req) => {
    if (!vendorCompliance.includes(req)) {
      missingCertifications.push(req);
    }
  });

  if (vendor.performanceRating && vendor.performanceRating < 3.5) {
    warnings.push('Vendor has below-average performance rating');
  }

  return {
    compliant: missingCertifications.length === 0,
    missingCertifications,
    warnings,
  };
}

// ============================================================================
// DATA SANITIZATION AND DESTRUCTION
// ============================================================================

/**
 * Processes data sanitization for asset
 *
 * @param requestId - Disposal request ID
 * @param sanitizationData - Sanitization details
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await processDataSanitization('disposal-123', {
 *   sanitizationLevel: DataSanitizationLevel.DOD_7_PASS,
 *   sanitizedBy: 'tech-001',
 *   sanitizationDate: new Date(),
 *   verificationMethod: 'Visual inspection and software verification',
 *   certificateUrl: 'https://storage/cert-123.pdf'
 * });
 * ```
 */
export async function processDataSanitization(
  requestId: string,
  sanitizationData: {
    sanitizationLevel: DataSanitizationLevel;
    sanitizedBy: string;
    sanitizationDate: Date;
    verificationMethod?: string;
    certificateUrl?: string;
    notes?: string;
  },
  transaction?: Transaction,
): Promise<DisposalRequest> {
  const disposal = await DisposalRequest.findByPk(requestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  if (!disposal.requiresDataSanitization) {
    throw new BadRequestException('Data sanitization not required for this disposal');
  }

  const previousState = disposal.toJSON();

  await disposal.update(
    {
      sanitizationLevel: sanitizationData.sanitizationLevel,
      sanitizationCompleted: true,
      sanitizationDate: sanitizationData.sanitizationDate,
      sanitizedBy: sanitizationData.sanitizedBy,
      metadata: {
        ...disposal.metadata,
        sanitization: {
          verificationMethod: sanitizationData.verificationMethod,
          certificateUrl: sanitizationData.certificateUrl,
          notes: sanitizationData.notes,
        },
      },
    },
    { transaction },
  );

  // Create audit log
  await createDisposalAuditLog({
    disposalRequestId: requestId,
    actionType: 'DATA_SANITIZATION_COMPLETED',
    actionDescription: `Data sanitization completed using ${sanitizationData.sanitizationLevel}`,
    performedBy: sanitizationData.sanitizedBy,
    actionTimestamp: sanitizationData.sanitizationDate,
    previousState,
    newState: disposal.toJSON(),
  }, transaction);

  return disposal;
}

/**
 * Generates certificate of destruction
 *
 * @param data - Certificate data
 * @param transaction - Optional database transaction
 * @returns Created certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateCertificateOfDestruction({
 *   disposalRequestId: 'disposal-123',
 *   certificateNumber: 'COD-2024-001234',
 *   issuedBy: 'Certified Disposal Vendor Inc.',
 *   issuedDate: new Date(),
 *   destructionMethod: 'Industrial shredding and smelting',
 *   destructionDate: new Date(),
 *   witnessList: ['John Doe', 'Jane Smith'],
 *   photographicEvidence: ['https://storage/photo1.jpg'],
 *   certificationStandard: 'NAID AAA Certification'
 * });
 * ```
 */
export async function generateCertificateOfDestruction(
  data: CertificateOfDestructionData,
  transaction?: Transaction,
): Promise<CertificateOfDestruction> {
  const disposal = await DisposalRequest.findByPk(data.disposalRequestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${data.disposalRequestId} not found`);
  }

  const certificate = await CertificateOfDestruction.create(
    {
      certificateNumber: data.certificateNumber,
      disposalRequestId: data.disposalRequestId,
      issuedBy: data.issuedBy,
      issuedDate: data.issuedDate,
      destructionMethod: data.destructionMethod,
      destructionDate: data.destructionDate,
      witnessList: data.witnessList,
      photographicEvidence: data.photographicEvidence,
      videoEvidence: data.videoEvidence,
      certificationStandard: data.certificationStandard,
    },
    { transaction },
  );

  // Update disposal request with certificate reference
  await disposal.update(
    {
      certificateOfDestructionId: certificate.id,
    },
    { transaction },
  );

  return certificate;
}

/**
 * Validates destruction documentation
 *
 * @param certificateId - Certificate ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDestructionDocumentation('cert-123');
 * ```
 */
export async function validateDestructionDocumentation(
  certificateId: string,
): Promise<{
  valid: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const certificate = await CertificateOfDestruction.findByPk(certificateId);
  if (!certificate) {
    throw new NotFoundException(`Certificate ${certificateId} not found`);
  }

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!certificate.witnessList || certificate.witnessList.length === 0) {
    issues.push('No witnesses documented');
  }

  if (!certificate.photographicEvidence || certificate.photographicEvidence.length === 0) {
    issues.push('No photographic evidence provided');
  }

  if (!certificate.certificationStandard) {
    recommendations.push('Consider obtaining third-party certification');
  }

  if (!certificate.digitalSignature) {
    recommendations.push('Add digital signature for enhanced security');
  }

  const daysSinceDestruction = Math.floor(
    (new Date().getTime() - certificate.destructionDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceDestruction > 90) {
    recommendations.push('Certificate is older than 90 days, consider archival');
  }

  return {
    valid: issues.length === 0,
    issues,
    recommendations,
  };
}

// ============================================================================
// DISPOSAL VENDOR MANAGEMENT
// ============================================================================

/**
 * Registers new disposal vendor
 *
 * @param vendorData - Vendor registration data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerDisposalVendor({
 *   vendorCode: 'DV-2024-001',
 *   vendorName: 'Green Disposal Solutions Inc.',
 *   disposalMethodsOffered: [DisposalMethod.RECYCLE, DisposalMethod.SCRAP],
 *   certifications: ['R2', 'e-Stewards', 'ISO 14001'],
 *   isCertified: true,
 *   contactEmail: 'contact@greendisposal.com',
 *   contactPhone: '555-0123'
 * });
 * ```
 */
export async function registerDisposalVendor(
  vendorData: {
    vendorCode: string;
    vendorName: string;
    disposalMethodsOffered: DisposalMethod[];
    certifications?: string[];
    isCertified?: boolean;
    environmentalCompliance?: string[];
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: Record<string, any>;
    serviceAreas?: string[];
    pricingStructure?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<DisposalVendor> {
  // Check for duplicate vendor code
  const existing = await DisposalVendor.findOne({
    where: { vendorCode: vendorData.vendorCode },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Vendor code ${vendorData.vendorCode} already exists`);
  }

  const vendor = await DisposalVendor.create(
    {
      ...vendorData,
      performanceRating: 0,
      isActive: true,
    },
    { transaction },
  );

  return vendor;
}

/**
 * Updates vendor performance rating
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Completed disposal request ID
 * @param rating - Performance rating (1-5)
 * @param feedback - Optional feedback
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', 'disposal-456', 4.5,
 *   'Excellent service, timely completion'
 * );
 * ```
 */
export async function updateVendorPerformance(
  vendorId: string,
  disposalRequestId: string,
  rating: number,
  feedback?: string,
  transaction?: Transaction,
): Promise<DisposalVendor> {
  if (rating < 1 || rating > 5) {
    throw new BadRequestException('Rating must be between 1 and 5');
  }

  const vendor = await DisposalVendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  // Calculate new rolling average rating
  const currentRating = vendor.performanceRating || 0;
  const newRating = currentRating === 0 ? rating : (currentRating + rating) / 2;

  await vendor.update(
    {
      performanceRating: newRating,
      notes: feedback
        ? `${vendor.notes || ''}\n[${new Date().toISOString()}] Rating: ${rating}/5 - ${feedback}`
        : vendor.notes,
    },
    { transaction },
  );

  return vendor;
}

/**
 * Gets certified vendors for disposal method
 *
 * @param disposalMethod - Disposal method
 * @param environmentalClassification - Optional environmental classification filter
 * @returns Certified vendors
 *
 * @example
 * ```typescript
 * const vendors = await getCertifiedVendors(
 *   DisposalMethod.RECYCLE,
 *   EnvironmentalClassification.ELECTRONIC_WASTE
 * );
 * ```
 */
export async function getCertifiedVendors(
  disposalMethod: DisposalMethod,
  environmentalClassification?: EnvironmentalClassification,
): Promise<DisposalVendor[]> {
  const where: WhereOptions = {
    isActive: true,
    isCertified: true,
    disposalMethodsOffered: {
      [Op.contains]: [disposalMethod],
    },
  };

  if (environmentalClassification && environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
    // Filter vendors with appropriate environmental compliance
    const requiredCompliance = getRequiredComplianceForClassification(environmentalClassification);
    if (requiredCompliance.length > 0) {
      where.environmentalCompliance = {
        [Op.overlap]: requiredCompliance,
      };
    }
  }

  return DisposalVendor.findAll({
    where,
    order: [['performanceRating', 'DESC']],
  });
}

/**
 * Gets required compliance certifications for environmental classification
 */
function getRequiredComplianceForClassification(
  classification: EnvironmentalClassification,
): string[] {
  switch (classification) {
    case EnvironmentalClassification.ELECTRONIC_WASTE:
      return ['WEEE Directive', 'RoHS Compliance', 'R2', 'e-Stewards'];
    case EnvironmentalClassification.HAZARDOUS:
      return ['RCRA', 'EPA TSCA'];
    case EnvironmentalClassification.CHEMICAL:
      return ['RCRA', 'EPA TSCA', 'DOT Hazardous Materials'];
    default:
      return [];
  }
}

/**
 * Evaluates vendor for disposal request
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Disposal request ID
 * @returns Vendor evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorForDisposal('vendor-123', 'disposal-456');
 * ```
 */
export async function evaluateVendorForDisposal(
  vendorId: string,
  disposalRequestId: string,
): Promise<{
  vendor: DisposalVendor;
  suitabilityScore: number;
  strengths: string[];
  concerns: string[];
  recommendation: 'highly_recommended' | 'recommended' | 'acceptable' | 'not_recommended';
}> {
  const vendor = await DisposalVendor.findByPk(vendorId);
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  const disposal = await DisposalRequest.findByPk(disposalRequestId);
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${disposalRequestId} not found`);
  }

  const strengths: string[] = [];
  const concerns: string[] = [];
  let suitabilityScore = 50; // Base score

  // Check if vendor offers required disposal method
  if (!vendor.disposalMethodsOffered.includes(disposal.disposalMethod)) {
    concerns.push('Vendor does not offer required disposal method');
    suitabilityScore -= 50;
  } else {
    strengths.push('Offers required disposal method');
    suitabilityScore += 10;
  }

  // Check certification
  if (vendor.isCertified) {
    strengths.push('Certified vendor');
    suitabilityScore += 20;
  } else if (disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
    concerns.push('Not certified for hazardous disposal');
    suitabilityScore -= 30;
  }

  // Check performance rating
  if (vendor.performanceRating) {
    if (vendor.performanceRating >= 4.5) {
      strengths.push('Excellent performance history');
      suitabilityScore += 20;
    } else if (vendor.performanceRating >= 3.5) {
      strengths.push('Good performance history');
      suitabilityScore += 10;
    } else {
      concerns.push('Below-average performance history');
      suitabilityScore -= 15;
    }
  }

  // Determine recommendation
  let recommendation: 'highly_recommended' | 'recommended' | 'acceptable' | 'not_recommended';
  if (suitabilityScore >= 80) {
    recommendation = 'highly_recommended';
  } else if (suitabilityScore >= 60) {
    recommendation = 'recommended';
  } else if (suitabilityScore >= 40) {
    recommendation = 'acceptable';
  } else {
    recommendation = 'not_recommended';
  }

  return {
    vendor,
    suitabilityScore,
    strengths,
    concerns,
    recommendation,
  };
}

// ============================================================================
// DISPOSAL COST MANAGEMENT
// ============================================================================

/**
 * Calculates total disposal cost
 *
 * @param requestId - Disposal request ID
 * @param costDetails - Cost detail inputs
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateDisposalCost('disposal-123', {
 *   vendorFees: 2500,
 *   transportationCost: 750,
 *   sanitizationCost: 500,
 *   certificationCost: 300
 * });
 * ```
 */
export async function calculateDisposalCost(
  requestId: string,
  costDetails: {
    vendorFees?: number;
    transportationCost?: number;
    sanitizationCost?: number;
    certificationCost?: number;
    environmentalFees?: number;
    administrativeCost?: number;
  },
): Promise<DisposalCostBreakdown> {
  const breakdown: DisposalCostBreakdown = {
    vendorFees: costDetails.vendorFees || 0,
    transportationCost: costDetails.transportationCost || 0,
    sanitizationCost: costDetails.sanitizationCost || 0,
    certificationCost: costDetails.certificationCost || 0,
    environmentalFees: costDetails.environmentalFees || 0,
    administrativeCost: costDetails.administrativeCost || 100, // Default admin cost
    totalCost: 0,
  };

  breakdown.totalCost =
    breakdown.vendorFees +
    breakdown.transportationCost +
    breakdown.sanitizationCost +
    breakdown.certificationCost +
    breakdown.environmentalFees +
    breakdown.administrativeCost;

  // Update disposal request with cost breakdown
  await DisposalRequest.update(
    {
      disposalCost: breakdown.totalCost,
      costBreakdown: breakdown,
    },
    {
      where: { id: requestId },
    },
  );

  return breakdown;
}

/**
 * Tracks revenue recovery from disposal
 *
 * @param requestId - Disposal request ID
 * @param revenueData - Revenue details
 * @param transaction - Optional database transaction
 * @returns Revenue recovery summary
 *
 * @example
 * ```typescript
 * const recovery = await trackRevenueRecovery('disposal-123', {
 *   saleAmount: 15000,
 *   taxDeduction: 5000
 * });
 * ```
 */
export async function trackRevenueRecovery(
  requestId: string,
  revenueData: {
    saleAmount?: number;
    tradeInValue?: number;
    salvageValue?: number;
    taxDeduction?: number;
  },
  transaction?: Transaction,
): Promise<RevenueRecovery> {
  const disposal = await DisposalRequest.findByPk(requestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  const totalRecovery =
    (revenueData.saleAmount || 0) +
    (revenueData.tradeInValue || 0) +
    (revenueData.salvageValue || 0) +
    (revenueData.taxDeduction || 0);

  const originalValue = disposal.estimatedValue || 0;
  const recoveryPercentage = originalValue > 0 ? (totalRecovery / originalValue) * 100 : 0;

  const recovery: RevenueRecovery = {
    ...revenueData,
    totalRecovery,
    recoveryPercentage,
  };

  await disposal.update(
    {
      actualValue: totalRecovery,
      revenueRecovery: recovery,
    },
    { transaction },
  );

  return recovery;
}

/**
 * Completes disposal request
 *
 * @param requestId - Disposal request ID
 * @param completionData - Completion details
 * @param transaction - Optional database transaction
 * @returns Completed disposal request
 *
 * @example
 * ```typescript
 * await completeDisposal('disposal-123', {
 *   completedBy: 'user-001',
 *   actualDisposalDate: new Date(),
 *   finalNotes: 'Asset disposed via certified recycler, all documentation on file'
 * });
 * ```
 */
export async function completeDisposal(
  requestId: string,
  completionData: {
    completedBy: string;
    actualDisposalDate: Date;
    finalNotes?: string;
  },
  transaction?: Transaction,
): Promise<DisposalRequest> {
  const disposal = await DisposalRequest.findByPk(requestId, { transaction });
  if (!disposal) {
    throw new NotFoundException(`Disposal request ${requestId} not found`);
  }

  if (disposal.status !== DisposalStatus.IN_PROGRESS) {
    throw new BadRequestException('Only in-progress disposals can be completed');
  }

  // Validate required fields
  if (disposal.requiresDataSanitization && !disposal.sanitizationCompleted) {
    throw new BadRequestException('Data sanitization must be completed before finalizing disposal');
  }

  const previousState = disposal.toJSON();

  await disposal.update(
    {
      status: DisposalStatus.COMPLETED,
      actualDisposalDate: completionData.actualDisposalDate,
      notes: completionData.finalNotes
        ? `${disposal.notes || ''}\n[${new Date().toISOString()}] ${completionData.finalNotes}`
        : disposal.notes,
    },
    { transaction },
  );

  // Create audit log
  await createDisposalAuditLog({
    disposalRequestId: requestId,
    actionType: 'DISPOSAL_COMPLETED',
    actionDescription: 'Disposal request completed',
    performedBy: completionData.completedBy,
    actionTimestamp: completionData.actualDisposalDate,
    previousState,
    newState: disposal.toJSON(),
  }, transaction);

  return disposal;
}

// ============================================================================
// AUDIT AND REPORTING
// ============================================================================

/**
 * Creates disposal audit log entry
 *
 * @param logData - Audit log data
 * @param transaction - Optional database transaction
 * @returns Created audit log
 */
async function createDisposalAuditLog(
  logData: {
    disposalRequestId: string;
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
): Promise<DisposalAuditLog> {
  return DisposalAuditLog.create(logData, { transaction });
}

/**
 * Gets disposal audit trail
 *
 * @param requestId - Disposal request ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getDisposalAuditTrail('disposal-123');
 * ```
 */
export async function getDisposalAuditTrail(
  requestId: string,
): Promise<DisposalAuditLog[]> {
  return DisposalAuditLog.findAll({
    where: { disposalRequestId: requestId },
    order: [['actionTimestamp', 'DESC']],
  });
}

/**
 * Generates disposal compliance report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateDisposalComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function generateDisposalComplianceReport(
  startDate: Date,
  endDate: Date,
): Promise<{
  totalDisposals: number;
  byMethod: Record<DisposalMethod, number>;
  byStatus: Record<DisposalStatus, number>;
  environmentalCompliance: {
    hazardousDisposals: number;
    certifiedVendorUsage: number;
    certificatesIssued: number;
  };
  financialSummary: {
    totalCosts: number;
    totalRecovery: number;
    netImpact: number;
  };
}> {
  const disposals = await DisposalRequest.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const byMethod: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let hazardousDisposals = 0;
  let certifiedVendorUsage = 0;
  let totalCosts = 0;
  let totalRecovery = 0;

  disposals.forEach((disposal) => {
    byMethod[disposal.disposalMethod] = (byMethod[disposal.disposalMethod] || 0) + 1;
    byStatus[disposal.status] = (byStatus[disposal.status] || 0) + 1;

    if (
      disposal.environmentalClassification &&
      disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS
    ) {
      hazardousDisposals++;
    }

    if (disposal.disposalVendorId) {
      certifiedVendorUsage++;
    }

    totalCosts += Number(disposal.disposalCost || 0);
    totalRecovery += Number(disposal.actualValue || 0);
  });

  const certificates = await CertificateOfDestruction.count({
    where: {
      issuedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    totalDisposals: disposals.length,
    byMethod: byMethod as Record<DisposalMethod, number>,
    byStatus: byStatus as Record<DisposalStatus, number>,
    environmentalCompliance: {
      hazardousDisposals,
      certifiedVendorUsage,
      certificatesIssued: certificates,
    },
    financialSummary: {
      totalCosts,
      totalRecovery,
      netImpact: totalRecovery - totalCosts,
    },
  };
}

/**
 * Searches disposal requests with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered disposal requests
 *
 * @example
 * ```typescript
 * const results = await searchDisposalRequests({
 *   status: DisposalStatus.PENDING_APPROVAL,
 *   disposalMethod: DisposalMethod.SALE,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function searchDisposalRequests(
  filters: {
    status?: DisposalStatus | DisposalStatus[];
    disposalMethod?: DisposalMethod | DisposalMethod[];
    assetId?: string;
    requestedBy?: string;
    startDate?: Date;
    endDate?: Date;
    vendorId?: string;
    requiresApproval?: boolean;
  },
  options: FindOptions = {},
): Promise<{ requests: DisposalRequest[]; total: number }> {
  const where: WhereOptions = {};

  if (filters.status) {
    where.status = Array.isArray(filters.status)
      ? { [Op.in]: filters.status }
      : filters.status;
  }

  if (filters.disposalMethod) {
    where.disposalMethod = Array.isArray(filters.disposalMethod)
      ? { [Op.in]: filters.disposalMethod }
      : filters.disposalMethod;
  }

  if (filters.assetId) {
    where.assetId = filters.assetId;
  }

  if (filters.requestedBy) {
    where.requestedBy = filters.requestedBy;
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

  if (filters.vendorId) {
    where.disposalVendorId = filters.vendorId;
  }

  if (filters.requiresApproval !== undefined) {
    where.approvalRequired = filters.requiresApproval;
  }

  const { rows: requests, count: total } = await DisposalRequest.findAndCountAll({
    where,
    include: [
      { model: DisposalApproval, as: 'approvals' },
    ],
    ...options,
  });

  return { requests, total };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DisposalRequest,
  DisposalApproval,
  DisposalVendor,
  CertificateOfDestruction,
  DisposalAuditLog,

  // Disposal Request Management
  initiateAssetDisposal,
  generateDisposalRequestNumber,
  updateDisposalStatus,
  submitDisposalForApproval,
  getRequiredApprovalLevels,
  processDisposalApproval,
  getDisposalWithApprovals,

  // Salvage Value
  calculateSalvageValue,
  optimizeSalvageValue,
  compareDisposalMethods,

  // Environmental Compliance
  getEnvironmentalRequirements,
  validateVendorCompliance,

  // Data Sanitization
  processDataSanitization,
  generateCertificateOfDestruction,
  validateDestructionDocumentation,

  // Vendor Management
  registerDisposalVendor,
  updateVendorPerformance,
  getCertifiedVendors,
  evaluateVendorForDisposal,

  // Cost Management
  calculateDisposalCost,
  trackRevenueRecovery,
  completeDisposal,

  // Audit and Reporting
  getDisposalAuditTrail,
  generateDisposalComplianceReport,
  searchDisposalRequests,
};

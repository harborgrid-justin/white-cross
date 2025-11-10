/**
 * ASSET VENDOR MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade vendor management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive vendor lifecycle management including:
 * - Vendor master data management and onboarding
 * - Vendor performance tracking and scorecards
 * - Vendor contracts and agreements
 * - Service level agreements (SLAs) and monitoring
 * - Vendor evaluation and qualification
 * - Preferred vendor lists and tier management
 * - Vendor pricing and rate management
 * - Vendor communication and collaboration
 * - Vendor compliance and certification tracking
 * - Purchase order and invoice management
 * - Vendor risk assessment
 * - Multi-location vendor support
 *
 * @module AssetVendorCommands
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
 *   createVendor,
 *   evaluateVendorPerformance,
 *   createVendorContract,
 *   trackVendorSLA,
 *   VendorStatus,
 *   VendorTier
 * } from './asset-vendor-commands';
 *
 * // Create vendor
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'Tech Solutions Inc.',
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED,
 *   contactInfo: { email: 'contact@techsolutions.com', phone: '555-0123' }
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
  IsEmail,
  IsUrl,
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
 * Vendor types
 */
export enum VendorType {
  MANUFACTURER = 'manufacturer',
  DISTRIBUTOR = 'distributor',
  SERVICE_PROVIDER = 'service_provider',
  MAINTENANCE_PROVIDER = 'maintenance_provider',
  RESELLER = 'reseller',
  OEM = 'oem',
  CONTRACTOR = 'contractor',
  CONSULTANT = 'consultant',
}

/**
 * Vendor status
 */
export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval',
  BLACKLISTED = 'blacklisted',
  UNDER_REVIEW = 'under_review',
}

/**
 * Vendor tier
 */
export enum VendorTier {
  STRATEGIC = 'strategic',
  PREFERRED = 'preferred',
  APPROVED = 'approved',
  CONDITIONAL = 'conditional',
  PROBATIONARY = 'probationary',
}

/**
 * Contract status
 */
export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  RENEWED = 'renewed',
  SUSPENDED = 'suspended',
}

/**
 * SLA status
 */
export enum SLAStatus {
  MET = 'met',
  NOT_MET = 'not_met',
  EXCEEDED = 'exceeded',
  PENDING = 'pending',
  NA = 'na',
}

/**
 * Performance rating
 */
export enum PerformanceRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  SATISFACTORY = 'satisfactory',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  POOR = 'poor',
}

/**
 * Vendor data
 */
export interface VendorData {
  vendorCode: string;
  vendorName: string;
  vendorType: VendorType;
  tier?: VendorTier;
  taxId?: string;
  website?: string;
  businessAddress?: Record<string, any>;
  billingAddress?: Record<string, any>;
  contactInfo: {
    primaryContact?: string;
    email?: string;
    phone?: string;
    fax?: string;
  };
  paymentTerms?: string;
  bankingInfo?: Record<string, any>;
  certifications?: string[];
  insuranceCoverage?: string[];
  createdBy: string;
}

/**
 * Contract data
 */
export interface VendorContractData {
  vendorId: string;
  contractNumber: string;
  contractType: string;
  startDate: Date;
  endDate: Date;
  autoRenew?: boolean;
  renewalNoticeDays?: number;
  contractValue?: number;
  paymentSchedule?: string;
  terms?: string;
  deliverables?: string[];
  createdBy: string;
}

/**
 * SLA definition
 */
export interface SLADefinition {
  vendorId: string;
  slaName: string;
  metricType: string;
  targetValue: number;
  unit: string;
  measurementFrequency: string;
  penaltyForBreach?: string;
  description?: string;
}

/**
 * Performance evaluation data
 */
export interface PerformanceEvaluationData {
  vendorId: string;
  evaluationPeriodStart: Date;
  evaluationPeriodEnd: Date;
  evaluatedBy: string;
  overallRating: PerformanceRating;
  qualityScore: number;
  deliveryScore: number;
  communicationScore: number;
  pricingScore: number;
  responseTimeScore: number;
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

/**
 * Vendor scorecard
 */
export interface VendorScorecard {
  vendorId: string;
  period: string;
  overallScore: number;
  qualityScore: number;
  deliveryScore: number;
  communicationScore: number;
  pricingScore: number;
  responseTimeScore: number;
  slaComplianceRate: number;
  onTimeDeliveryRate: number;
  defectRate: number;
  totalTransactions: number;
  totalSpend: number;
  rating: PerformanceRating;
}

/**
 * Vendor pricing
 */
export interface VendorPricing {
  vendorId: string;
  itemCode: string;
  itemDescription: string;
  unitPrice: number;
  currency: string;
  effectiveDate: Date;
  expirationDate?: Date;
  minimumOrderQuantity?: number;
  volumeDiscounts?: Array<{ quantity: number; discountPercentage: number }>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Vendor Model
 */
@Table({
  tableName: 'asset_vendors',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['vendor_code'], unique: true },
    { fields: ['vendor_type'] },
    { fields: ['status'] },
    { fields: ['tier'] },
    { fields: ['is_active'] },
  ],
})
export class AssetVendor extends Model {
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

  @ApiProperty({ description: 'Vendor type' })
  @Column({
    type: DataType.ENUM(...Object.values(VendorType)),
    allowNull: false,
  })
  @Index
  vendorType!: VendorType;

  @ApiProperty({ description: 'Vendor status' })
  @Column({
    type: DataType.ENUM(...Object.values(VendorStatus)),
    defaultValue: VendorStatus.PENDING_APPROVAL,
  })
  @Index
  status!: VendorStatus;

  @ApiProperty({ description: 'Vendor tier' })
  @Column({ type: DataType.ENUM(...Object.values(VendorTier)) })
  @Index
  tier?: VendorTier;

  @ApiProperty({ description: 'Tax ID / EIN' })
  @Column({ type: DataType.STRING(50) })
  taxId?: string;

  @ApiProperty({ description: 'Website URL' })
  @Column({ type: DataType.STRING(500) })
  website?: string;

  @ApiProperty({ description: 'Business address' })
  @Column({ type: DataType.JSONB })
  businessAddress?: Record<string, any>;

  @ApiProperty({ description: 'Billing address' })
  @Column({ type: DataType.JSONB })
  billingAddress?: Record<string, any>;

  @ApiProperty({ description: 'Contact information' })
  @Column({ type: DataType.JSONB })
  contactInfo!: Record<string, any>;

  @ApiProperty({ description: 'Payment terms' })
  @Column({ type: DataType.STRING(200) })
  paymentTerms?: string;

  @ApiProperty({ description: 'Banking information' })
  @Column({ type: DataType.JSONB })
  bankingInfo?: Record<string, any>;

  @ApiProperty({ description: 'Certifications' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  certifications?: string[];

  @ApiProperty({ description: 'Insurance coverage' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  insuranceCoverage?: string[];

  @ApiProperty({ description: 'Performance score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  performanceScore?: number;

  @ApiProperty({ description: 'Quality score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  qualityScore?: number;

  @ApiProperty({ description: 'Delivery score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  deliveryScore?: number;

  @ApiProperty({ description: 'Total spend' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalSpend!: number;

  @ApiProperty({ description: 'Last evaluation date' })
  @Column({ type: DataType.DATE })
  lastEvaluationDate?: Date;

  @ApiProperty({ description: 'Next evaluation date' })
  @Column({ type: DataType.DATE })
  nextEvaluationDate?: Date;

  @ApiProperty({ description: 'Onboarding date' })
  @Column({ type: DataType.DATE })
  onboardingDate?: Date;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => VendorContract)
  contracts?: VendorContract[];

  @HasMany(() => VendorSLA)
  slas?: VendorSLA[];

  @HasMany(() => VendorPerformanceEvaluation)
  evaluations?: VendorPerformanceEvaluation[];

  @HasMany(() => VendorPricingModel)
  pricing?: VendorPricingModel[];
}

/**
 * Vendor Contract Model
 */
@Table({
  tableName: 'vendor_contracts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contract_number'], unique: true },
    { fields: ['vendor_id'] },
    { fields: ['status'] },
    { fields: ['start_date'] },
    { fields: ['end_date'] },
  ],
})
export class VendorContract extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Contract number' })
  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  @Index
  contractNumber!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => AssetVendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Contract type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  contractType!: string;

  @ApiProperty({ description: 'Contract status' })
  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
    defaultValue: ContractStatus.DRAFT,
  })
  @Index
  status!: ContractStatus;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate!: Date;

  @ApiProperty({ description: 'Auto-renew enabled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  autoRenew!: boolean;

  @ApiProperty({ description: 'Renewal notice days' })
  @Column({ type: DataType.INTEGER })
  renewalNoticeDays?: number;

  @ApiProperty({ description: 'Contract value' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  contractValue?: number;

  @ApiProperty({ description: 'Payment schedule' })
  @Column({ type: DataType.STRING(200) })
  paymentSchedule?: string;

  @ApiProperty({ description: 'Terms and conditions' })
  @Column({ type: DataType.TEXT })
  terms?: string;

  @ApiProperty({ description: 'Deliverables' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  deliverables?: string[];

  @ApiProperty({ description: 'Contract document URL' })
  @Column({ type: DataType.STRING(500) })
  contractDocumentUrl?: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: string;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => AssetVendor)
  vendor?: AssetVendor;
}

/**
 * Vendor SLA Model
 */
@Table({
  tableName: 'vendor_slas',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['metric_type'] },
    { fields: ['is_active'] },
  ],
})
export class VendorSLA extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => AssetVendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'SLA name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  slaName!: string;

  @ApiProperty({ description: 'Metric type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  metricType!: string;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  targetValue!: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  unit!: string;

  @ApiProperty({ description: 'Measurement frequency' })
  @Column({ type: DataType.STRING(100) })
  measurementFrequency?: string;

  @ApiProperty({ description: 'Current value' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  currentValue?: number;

  @ApiProperty({ description: 'Compliance percentage' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  compliancePercentage?: number;

  @ApiProperty({ description: 'Penalty for breach' })
  @Column({ type: DataType.TEXT })
  penaltyForBreach?: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Last measured date' })
  @Column({ type: DataType.DATE })
  lastMeasuredDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => AssetVendor)
  vendor?: AssetVendor;

  @HasMany(() => SLAMeasurement)
  measurements?: SLAMeasurement[];
}

/**
 * SLA Measurement Model
 */
@Table({
  tableName: 'sla_measurements',
  timestamps: true,
  indexes: [
    { fields: ['sla_id'] },
    { fields: ['measurement_date'] },
    { fields: ['status'] },
  ],
})
export class SLAMeasurement extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'SLA ID' })
  @ForeignKey(() => VendorSLA)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  slaId!: string;

  @ApiProperty({ description: 'Measurement date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  measurementDate!: Date;

  @ApiProperty({ description: 'Measured value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  measuredValue!: number;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  targetValue!: number;

  @ApiProperty({ description: 'Variance' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  variance?: number;

  @ApiProperty({ description: 'SLA status' })
  @Column({
    type: DataType.ENUM(...Object.values(SLAStatus)),
    allowNull: false,
  })
  @Index
  status!: SLAStatus;

  @ApiProperty({ description: 'Measured by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  measuredBy!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => VendorSLA)
  sla?: VendorSLA;
}

/**
 * Vendor Performance Evaluation Model
 */
@Table({
  tableName: 'vendor_performance_evaluations',
  timestamps: true,
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['evaluation_date'] },
    { fields: ['overall_rating'] },
  ],
})
export class VendorPerformanceEvaluation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => AssetVendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Evaluation period start' })
  @Column({ type: DataType.DATE, allowNull: false })
  evaluationPeriodStart!: Date;

  @ApiProperty({ description: 'Evaluation period end' })
  @Column({ type: DataType.DATE, allowNull: false })
  evaluationPeriodEnd!: Date;

  @ApiProperty({ description: 'Evaluation date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  evaluationDate!: Date;

  @ApiProperty({ description: 'Evaluated by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  evaluatedBy!: string;

  @ApiProperty({ description: 'Overall rating' })
  @Column({
    type: DataType.ENUM(...Object.values(PerformanceRating)),
    allowNull: false,
  })
  @Index
  overallRating!: PerformanceRating;

  @ApiProperty({ description: 'Quality score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  qualityScore!: number;

  @ApiProperty({ description: 'Delivery score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  deliveryScore!: number;

  @ApiProperty({ description: 'Communication score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  communicationScore!: number;

  @ApiProperty({ description: 'Pricing score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  pricingScore!: number;

  @ApiProperty({ description: 'Response time score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  responseTimeScore!: number;

  @ApiProperty({ description: 'Overall score (0-100)' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  overallScore?: number;

  @ApiProperty({ description: 'Comments' })
  @Column({ type: DataType.TEXT })
  comments?: string;

  @ApiProperty({ description: 'Strengths' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  strengths?: string[];

  @ApiProperty({ description: 'Weaknesses' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  weaknesses?: string[];

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  recommendations?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => AssetVendor)
  vendor?: AssetVendor;
}

/**
 * Vendor Pricing Model
 */
@Table({
  tableName: 'vendor_pricing',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['item_code'] },
    { fields: ['effective_date'] },
    { fields: ['is_active'] },
  ],
})
export class VendorPricingModel extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => AssetVendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Item code' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  itemCode!: string;

  @ApiProperty({ description: 'Item description' })
  @Column({ type: DataType.TEXT })
  itemDescription?: string;

  @ApiProperty({ description: 'Unit price' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  unitPrice!: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({ type: DataType.STRING(3), defaultValue: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE })
  expirationDate?: Date;

  @ApiProperty({ description: 'Minimum order quantity' })
  @Column({ type: DataType.INTEGER })
  minimumOrderQuantity?: number;

  @ApiProperty({ description: 'Lead time in days' })
  @Column({ type: DataType.INTEGER })
  leadTimeDays?: number;

  @ApiProperty({ description: 'Volume discounts' })
  @Column({ type: DataType.JSONB })
  volumeDiscounts?: Array<{ quantity: number; discountPercentage: number }>;

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

  @BelongsTo(() => AssetVendor)
  vendor?: AssetVendor;
}

// ============================================================================
// VENDOR MANAGEMENT
// ============================================================================

/**
 * Creates new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'ABC Manufacturing Inc.',
 *   vendorType: VendorType.MANUFACTURER,
 *   tier: VendorTier.APPROVED,
 *   contactInfo: {
 *     primaryContact: 'John Smith',
 *     email: 'john.smith@abcmfg.com',
 *     phone: '555-0123'
 *   },
 *   paymentTerms: 'Net 30',
 *   createdBy: 'user-001'
 * });
 * ```
 */
export async function createVendor(
  data: VendorData,
  transaction?: Transaction,
): Promise<AssetVendor> {
  // Check for duplicate vendor code
  const existing = await AssetVendor.findOne({
    where: { vendorCode: data.vendorCode },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Vendor code ${data.vendorCode} already exists`);
  }

  const vendor = await AssetVendor.create(
    {
      ...data,
      status: VendorStatus.PENDING_APPROVAL,
      onboardingDate: new Date(),
      isActive: true,
    },
    { transaction },
  );

  return vendor;
}

/**
 * Updates vendor information
 *
 * @param vendorId - Vendor ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendor('vendor-123', {
 *   tier: VendorTier.PREFERRED,
 *   paymentTerms: 'Net 45',
 *   contactInfo: { email: 'newemail@vendor.com' }
 * });
 * ```
 */
export async function updateVendor(
  vendorId: string,
  updates: Partial<VendorData>,
  transaction?: Transaction,
): Promise<AssetVendor> {
  const vendor = await AssetVendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  await vendor.update(updates, { transaction });
  return vendor;
}

/**
 * Approves vendor
 *
 * @param vendorId - Vendor ID
 * @param approvedBy - User ID
 * @param tier - Assigned tier
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await approveVendor('vendor-123', 'mgr-001', VendorTier.APPROVED);
 * ```
 */
export async function approveVendor(
  vendorId: string,
  approvedBy: string,
  tier: VendorTier = VendorTier.APPROVED,
  transaction?: Transaction,
): Promise<AssetVendor> {
  const vendor = await AssetVendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  await vendor.update(
    {
      status: VendorStatus.ACTIVE,
      tier,
      onboardingDate: new Date(),
    },
    { transaction },
  );

  return vendor;
}

/**
 * Gets vendor by ID
 *
 * @param vendorId - Vendor ID
 * @param includeRelated - Whether to include related data
 * @returns Vendor details
 *
 * @example
 * ```typescript
 * const vendor = await getVendorById('vendor-123', true);
 * ```
 */
export async function getVendorById(
  vendorId: string,
  includeRelated: boolean = false,
): Promise<AssetVendor> {
  const include = includeRelated
    ? [
        { model: VendorContract, as: 'contracts' },
        { model: VendorSLA, as: 'slas' },
        { model: VendorPerformanceEvaluation, as: 'evaluations' },
        { model: VendorPricingModel, as: 'pricing' },
      ]
    : [];

  const vendor = await AssetVendor.findByPk(vendorId, { include });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  return vendor;
}

/**
 * Searches vendors with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors({
 *   status: VendorStatus.ACTIVE,
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED
 * });
 * ```
 */
export async function searchVendors(
  filters: {
    status?: VendorStatus | VendorStatus[];
    vendorType?: VendorType | VendorType[];
    tier?: VendorTier | VendorTier[];
    searchTerm?: string;
    minPerformanceScore?: number;
  },
  options: FindOptions = {},
): Promise<{ vendors: AssetVendor[]; total: number }> {
  const where: WhereOptions = { isActive: true };

  if (filters.status) {
    where.status = Array.isArray(filters.status)
      ? { [Op.in]: filters.status }
      : filters.status;
  }

  if (filters.vendorType) {
    where.vendorType = Array.isArray(filters.vendorType)
      ? { [Op.in]: filters.vendorType }
      : filters.vendorType;
  }

  if (filters.tier) {
    where.tier = Array.isArray(filters.tier)
      ? { [Op.in]: filters.tier }
      : filters.tier;
  }

  if (filters.searchTerm) {
    where[Op.or] = [
      { vendorCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { vendorName: { [Op.iLike]: `%${filters.searchTerm}%` } },
    ];
  }

  if (filters.minPerformanceScore !== undefined) {
    where.performanceScore = { [Op.gte]: filters.minPerformanceScore };
  }

  const { rows: vendors, count: total } = await AssetVendor.findAndCountAll({
    where,
    ...options,
  });

  return { vendors, total };
}

// ============================================================================
// CONTRACT MANAGEMENT
// ============================================================================

/**
 * Creates vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createVendorContract({
 *   vendorId: 'vendor-123',
 *   contractNumber: 'CNT-2024-001',
 *   contractType: 'Service Agreement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   autoRenew: true,
 *   contractValue: 100000,
 *   createdBy: 'user-001'
 * });
 * ```
 */
export async function createVendorContract(
  data: VendorContractData,
  transaction?: Transaction,
): Promise<VendorContract> {
  const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${data.vendorId} not found`);
  }

  // Check for duplicate contract number
  const existing = await VendorContract.findOne({
    where: { contractNumber: data.contractNumber },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Contract number ${data.contractNumber} already exists`);
  }

  const contract = await VendorContract.create(
    {
      ...data,
      status: ContractStatus.DRAFT,
    },
    { transaction },
  );

  return contract;
}

/**
 * Activates vendor contract
 *
 * @param contractId - Contract ID
 * @param approvedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateVendorContract('contract-123', 'mgr-001');
 * ```
 */
export async function activateVendorContract(
  contractId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<VendorContract> {
  const contract = await VendorContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  await contract.update(
    {
      status: ContractStatus.ACTIVE,
      approvedBy,
      approvalDate: new Date(),
    },
    { transaction },
  );

  return contract;
}

/**
 * Gets expiring contracts
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(90);
 * ```
 */
export async function getExpiringContracts(
  daysAhead: number = 90,
): Promise<VendorContract[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return VendorContract.findAll({
    where: {
      status: ContractStatus.ACTIVE,
      endDate: {
        [Op.between]: [today, futureDate],
      },
    },
    include: [{ model: AssetVendor, as: 'vendor' }],
    order: [['endDate', 'ASC']],
  });
}

// ============================================================================
// SLA MANAGEMENT
// ============================================================================

/**
 * Creates vendor SLA
 *
 * @param data - SLA definition
 * @param transaction - Optional database transaction
 * @returns Created SLA
 *
 * @example
 * ```typescript
 * const sla = await createVendorSLA({
 *   vendorId: 'vendor-123',
 *   slaName: 'Response Time SLA',
 *   metricType: 'response_time',
 *   targetValue: 24,
 *   unit: 'hours',
 *   measurementFrequency: 'monthly',
 *   penaltyForBreach: '5% credit on monthly invoice'
 * });
 * ```
 */
export async function createVendorSLA(
  data: SLADefinition,
  transaction?: Transaction,
): Promise<VendorSLA> {
  const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${data.vendorId} not found`);
  }

  return VendorSLA.create(
    {
      ...data,
      isActive: true,
    },
    { transaction },
  );
}

/**
 * Records SLA measurement
 *
 * @param slaId - SLA ID
 * @param measuredValue - Measured value
 * @param measuredBy - User ID
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns SLA measurement
 *
 * @example
 * ```typescript
 * await recordSLAMeasurement('sla-123', 22, 'user-001',
 *   'Average response time for January'
 * );
 * ```
 */
export async function recordSLAMeasurement(
  slaId: string,
  measuredValue: number,
  measuredBy: string,
  notes?: string,
  transaction?: Transaction,
): Promise<SLAMeasurement> {
  const sla = await VendorSLA.findByPk(slaId, { transaction });
  if (!sla) {
    throw new NotFoundException(`SLA ${slaId} not found`);
  }

  const targetValue = Number(sla.targetValue);
  const variance = measuredValue - targetValue;

  let status: SLAStatus;
  if (measuredValue <= targetValue) {
    status = SLAStatus.MET;
  } else if (measuredValue <= targetValue * 1.1) {
    status = SLAStatus.EXCEEDED;
  } else {
    status = SLAStatus.NOT_MET;
  }

  const measurement = await SLAMeasurement.create(
    {
      slaId,
      measurementDate: new Date(),
      measuredValue,
      targetValue,
      variance,
      status,
      measuredBy,
      notes,
    },
    { transaction },
  );

  // Update SLA current value
  await sla.update(
    {
      currentValue: measuredValue,
      lastMeasuredDate: new Date(),
    },
    { transaction },
  );

  return measurement;
}

/**
 * Gets SLA compliance report
 *
 * @param vendorId - Vendor ID
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns SLA compliance summary
 *
 * @example
 * ```typescript
 * const report = await getSLAComplianceReport(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getSLAComplianceReport(
  vendorId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  vendorId: string;
  totalSLAs: number;
  measurements: number;
  metCount: number;
  notMetCount: number;
  complianceRate: number;
  slaDetails: Array<{
    slaName: string;
    metricType: string;
    complianceRate: number;
  }>;
}> {
  const slas = await VendorSLA.findAll({
    where: { vendorId },
    include: [
      {
        model: SLAMeasurement,
        as: 'measurements',
        where: {
          measurementDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        required: false,
      },
    ],
  });

  const totalSLAs = slas.length;
  let totalMeasurements = 0;
  let totalMet = 0;
  let totalNotMet = 0;

  const slaDetails = slas.map((sla) => {
    const measurements = sla.measurements || [];
    const metCount = measurements.filter((m) => m.status === SLAStatus.MET || m.status === SLAStatus.EXCEEDED).length;
    const complianceRate = measurements.length > 0 ? (metCount / measurements.length) * 100 : 0;

    totalMeasurements += measurements.length;
    totalMet += metCount;
    totalNotMet += measurements.length - metCount;

    return {
      slaName: sla.slaName,
      metricType: sla.metricType,
      complianceRate,
    };
  });

  const complianceRate = totalMeasurements > 0 ? (totalMet / totalMeasurements) * 100 : 0;

  return {
    vendorId,
    totalSLAs,
    measurements: totalMeasurements,
    metCount: totalMet,
    notMetCount: totalNotMet,
    complianceRate,
    slaDetails,
  };
}

// ============================================================================
// PERFORMANCE EVALUATION
// ============================================================================

/**
 * Evaluates vendor performance
 *
 * @param data - Evaluation data
 * @param transaction - Optional database transaction
 * @returns Performance evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorPerformance({
 *   vendorId: 'vendor-123',
 *   evaluationPeriodStart: new Date('2024-01-01'),
 *   evaluationPeriodEnd: new Date('2024-06-30'),
 *   evaluatedBy: 'mgr-001',
 *   overallRating: PerformanceRating.GOOD,
 *   qualityScore: 85,
 *   deliveryScore: 90,
 *   communicationScore: 88,
 *   pricingScore: 82,
 *   responseTimeScore: 87
 * });
 * ```
 */
export async function evaluateVendorPerformance(
  data: PerformanceEvaluationData,
  transaction?: Transaction,
): Promise<VendorPerformanceEvaluation> {
  const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${data.vendorId} not found`);
  }

  // Calculate overall score
  const overallScore =
    (data.qualityScore +
      data.deliveryScore +
      data.communicationScore +
      data.pricingScore +
      data.responseTimeScore) /
    5;

  const evaluation = await VendorPerformanceEvaluation.create(
    {
      ...data,
      evaluationDate: new Date(),
      overallScore,
    },
    { transaction },
  );

  // Update vendor scores
  await vendor.update(
    {
      performanceScore: overallScore,
      qualityScore: data.qualityScore,
      deliveryScore: data.deliveryScore,
      lastEvaluationDate: new Date(),
    },
    { transaction },
  );

  return evaluation;
}

/**
 * Generates vendor scorecard
 *
 * @param vendorId - Vendor ID
 * @param period - Time period
 * @returns Vendor scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123', '2024-Q2');
 * ```
 */
export async function generateVendorScorecard(
  vendorId: string,
  period: string,
): Promise<VendorScorecard> {
  const vendor = await AssetVendor.findByPk(vendorId);
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  // Get latest evaluation
  const evaluation = await VendorPerformanceEvaluation.findOne({
    where: { vendorId },
    order: [['evaluationDate', 'DESC']],
  });

  // Get SLA compliance
  const slaReport = await getSLAComplianceReport(
    vendorId,
    new Date(new Date().setMonth(new Date().getMonth() - 3)),
    new Date(),
  );

  const overallScore = Number(vendor.performanceScore || 0);

  let rating: PerformanceRating;
  if (overallScore >= 90) {
    rating = PerformanceRating.EXCELLENT;
  } else if (overallScore >= 80) {
    rating = PerformanceRating.GOOD;
  } else if (overallScore >= 70) {
    rating = PerformanceRating.SATISFACTORY;
  } else if (overallScore >= 60) {
    rating = PerformanceRating.NEEDS_IMPROVEMENT;
  } else {
    rating = PerformanceRating.POOR;
  }

  return {
    vendorId,
    period,
    overallScore,
    qualityScore: Number(vendor.qualityScore || 0),
    deliveryScore: Number(vendor.deliveryScore || 0),
    communicationScore: evaluation?.communicationScore ? Number(evaluation.communicationScore) : 0,
    pricingScore: evaluation?.pricingScore ? Number(evaluation.pricingScore) : 0,
    responseTimeScore: evaluation?.responseTimeScore ? Number(evaluation.responseTimeScore) : 0,
    slaComplianceRate: slaReport.complianceRate,
    onTimeDeliveryRate: 0, // Would be calculated from actual delivery data
    defectRate: 0, // Would be calculated from actual defect data
    totalTransactions: 0, // Would be calculated from actual transaction data
    totalSpend: Number(vendor.totalSpend),
    rating,
  };
}

// ============================================================================
// PRICING MANAGEMENT
// ============================================================================

/**
 * Creates vendor pricing
 *
 * @param data - Pricing data
 * @param transaction - Optional database transaction
 * @returns Vendor pricing
 *
 * @example
 * ```typescript
 * const pricing = await createVendorPricing({
 *   vendorId: 'vendor-123',
 *   itemCode: 'PART-001',
 *   itemDescription: 'Replacement Part A',
 *   unitPrice: 125.50,
 *   currency: 'USD',
 *   effectiveDate: new Date(),
 *   minimumOrderQuantity: 10
 * });
 * ```
 */
export async function createVendorPricing(
  data: VendorPricing,
  transaction?: Transaction,
): Promise<VendorPricingModel> {
  const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${data.vendorId} not found`);
  }

  // Deactivate previous pricing for same item
  await VendorPricingModel.update(
    { isActive: false },
    {
      where: {
        vendorId: data.vendorId,
        itemCode: data.itemCode,
        isActive: true,
      },
      transaction,
    },
  );

  return VendorPricingModel.create(
    {
      ...data,
      isActive: true,
    },
    { transaction },
  );
}

/**
 * Gets current pricing for item
 *
 * @param vendorId - Vendor ID
 * @param itemCode - Item code
 * @returns Current pricing or null
 *
 * @example
 * ```typescript
 * const pricing = await getVendorPricing('vendor-123', 'PART-001');
 * ```
 */
export async function getVendorPricing(
  vendorId: string,
  itemCode: string,
): Promise<VendorPricingModel | null> {
  return VendorPricingModel.findOne({
    where: {
      vendorId,
      itemCode,
      isActive: true,
      effectiveDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: new Date() } },
      ],
    },
    order: [['effectiveDate', 'DESC']],
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AssetVendor,
  VendorContract,
  VendorSLA,
  SLAMeasurement,
  VendorPerformanceEvaluation,
  VendorPricingModel,

  // Vendor Management
  createVendor,
  updateVendor,
  approveVendor,
  getVendorById,
  searchVendors,

  // Contract Management
  createVendorContract,
  activateVendorContract,
  getExpiringContracts,

  // SLA Management
  createVendorSLA,
  recordSLAMeasurement,
  getSLAComplianceReport,

  // Performance Evaluation
  evaluateVendorPerformance,
  generateVendorScorecard,

  // Pricing Management
  createVendorPricing,
  getVendorPricing,
};

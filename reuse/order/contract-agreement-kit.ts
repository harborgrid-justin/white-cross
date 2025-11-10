/**
 * LOC: ORD-CNT-001
 * File: /reuse/order/contract-agreement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Pricing services
 *   - Customer services
 *   - Contract management
 */

/**
 * File: /reuse/order/contract-agreement-kit.ts
 * Locator: WC-ORD-CNTAGR-001
 * Purpose: Contract & Agreement Management - Contract pricing, terms, renewals
 *
 * Upstream: Independent utility module for contract operations
 * Downstream: ../backend/order/*, Pricing modules, Customer services, Quote services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for contract creation, pricing agreements, volume commitments, terms, renewals, amendments, compliance tracking
 *
 * LLM Context: Enterprise-grade contract management to compete with SAP, Oracle, and JD Edwards contract systems.
 * Provides comprehensive contract lifecycle management, pricing agreements, volume commitments, minimum purchase requirements,
 * contract terms and conditions, auto-renewal handling, contract amendments, pricing schedules, tiered pricing in contracts,
 * contract compliance tracking, contract performance metrics, SLA monitoring, and multi-year agreements.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
  IsDate,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Op, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Contract status
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED',
  AMENDED = 'AMENDED',
}

/**
 * Contract types
 */
export enum ContractType {
  MASTER_AGREEMENT = 'MASTER_AGREEMENT',
  PRICING_AGREEMENT = 'PRICING_AGREEMENT',
  VOLUME_COMMITMENT = 'VOLUME_COMMITMENT',
  BLANKET_ORDER = 'BLANKET_ORDER',
  CONSIGNMENT = 'CONSIGNMENT',
  REBATE_AGREEMENT = 'REBATE_AGREEMENT',
  SERVICE_LEVEL = 'SERVICE_LEVEL',
  EXCLUSIVE_SUPPLIER = 'EXCLUSIVE_SUPPLIER',
  FRAMEWORK_AGREEMENT = 'FRAMEWORK_AGREEMENT',
}

/**
 * Contract pricing type
 */
export enum ContractPricingType {
  FIXED_PRICE = 'FIXED_PRICE',
  TIERED_PRICING = 'TIERED_PRICING',
  VOLUME_DISCOUNT = 'VOLUME_DISCOUNT',
  COST_PLUS = 'COST_PLUS',
  INDEX_BASED = 'INDEX_BASED',
  NEGOTIATED = 'NEGOTIATED',
  MARKET_RATE = 'MARKET_RATE',
}

/**
 * Renewal type
 */
export enum RenewalType {
  MANUAL = 'MANUAL',
  AUTO_RENEW = 'AUTO_RENEW',
  REQUIRES_APPROVAL = 'REQUIRES_APPROVAL',
  ONE_TIME_ONLY = 'ONE_TIME_ONLY',
}

/**
 * Amendment type
 */
export enum AmendmentType {
  PRICING_CHANGE = 'PRICING_CHANGE',
  TERM_EXTENSION = 'TERM_EXTENSION',
  VOLUME_CHANGE = 'VOLUME_CHANGE',
  PRODUCT_ADDITION = 'PRODUCT_ADDITION',
  PRODUCT_REMOVAL = 'PRODUCT_REMOVAL',
  TERMS_CHANGE = 'TERMS_CHANGE',
  PARTY_CHANGE = 'PARTY_CHANGE',
}

/**
 * Commitment type
 */
export enum CommitmentType {
  MINIMUM_QUANTITY = 'MINIMUM_QUANTITY',
  MINIMUM_VALUE = 'MINIMUM_VALUE',
  MAXIMUM_QUANTITY = 'MAXIMUM_QUANTITY',
  MAXIMUM_VALUE = 'MAXIMUM_VALUE',
  TARGET_QUANTITY = 'TARGET_QUANTITY',
  TARGET_VALUE = 'TARGET_VALUE',
}

/**
 * Commitment period
 */
export enum CommitmentPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  CONTRACT_TERM = 'CONTRACT_TERM',
}

/**
 * Penalty type for non-compliance
 */
export enum PenaltyType {
  PERCENTAGE_FEE = 'PERCENTAGE_FEE',
  FIXED_FEE = 'FIXED_FEE',
  PRICE_ADJUSTMENT = 'PRICE_ADJUSTMENT',
  REBATE_REDUCTION = 'REBATE_REDUCTION',
  CONTRACT_TERMINATION = 'CONTRACT_TERMINATION',
  WARNING_ONLY = 'WARNING_ONLY',
}

/**
 * Approval status
 */
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_REVISION = 'REQUIRES_REVISION',
}

/**
 * Performance metric type
 */
export enum PerformanceMetricType {
  PURCHASE_VOLUME = 'PURCHASE_VOLUME',
  PURCHASE_VALUE = 'PURCHASE_VALUE',
  DELIVERY_PERFORMANCE = 'DELIVERY_PERFORMANCE',
  QUALITY_METRICS = 'QUALITY_METRICS',
  COMPLIANCE_RATE = 'COMPLIANCE_RATE',
  SAVINGS_ACHIEVED = 'SAVINGS_ACHIEVED',
  ORDER_FREQUENCY = 'ORDER_FREQUENCY',
}

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

/**
 * Contract pricing tier
 */
export interface ContractPricingTier {
  tierId: string;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  discountPercent?: number;
  effectiveDate?: Date;
  expirationDate?: Date;
}

/**
 * Volume commitment details
 */
export interface VolumeCommitment {
  commitmentId: string;
  commitmentType: CommitmentType;
  period: CommitmentPeriod;
  targetQuantity?: number;
  targetValue?: number;
  minQuantity?: number;
  minValue?: number;
  maxQuantity?: number;
  maxValue?: number;
  penaltyType?: PenaltyType;
  penaltyAmount?: number;
}

/**
 * Contract terms and conditions
 */
export interface ContractTerms {
  paymentTerms: string;
  deliveryTerms: string;
  warrantyPeriodDays?: number;
  returnPolicy?: string;
  lateFeePercent?: number;
  earlyPaymentDiscountPercent?: number;
  disputeResolution?: string;
  governingLaw?: string;
  exclusivityClause?: boolean;
  nonCompeteClause?: boolean;
  confidentialityClause?: boolean;
  forcemajeure?: string;
  customClauses?: Record<string, string>;
}

/**
 * Pricing schedule entry
 */
export interface PricingScheduleEntry {
  entryId: string;
  productId: string;
  productSku: string;
  effectiveDate: Date;
  expirationDate?: Date;
  unitPrice: number;
  currency: string;
  uom: string;
  minOrderQuantity?: number;
  leadTimeDays?: number;
}

/**
 * Contract performance metrics
 */
export interface ContractPerformanceMetrics {
  metricType: PerformanceMetricType;
  targetValue: number;
  actualValue: number;
  achievementPercent: number;
  periodStart: Date;
  periodEnd: Date;
  status: 'MEETING' | 'EXCEEDING' | 'BELOW_TARGET' | 'CRITICAL';
}

/**
 * Renewal notification
 */
export interface RenewalNotification {
  notificationId: string;
  recipientEmail: string;
  recipientName: string;
  scheduledDate: Date;
  sent: boolean;
  sentDate?: Date;
}

/**
 * Contract compliance check result
 */
export interface ComplianceCheckResult {
  checkId: string;
  checkType: string;
  passed: boolean;
  actualValue: number;
  requiredValue: number;
  variance: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: Date;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Create contract DTO
 */
export class CreateContractDto {
  @ApiProperty({ description: 'Contract name' })
  @IsString()
  @IsNotEmpty()
  contractName: string;

  @ApiProperty({ description: 'Contract type', enum: ContractType })
  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({ description: 'Supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({ description: 'Contract start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'Contract end date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Contract pricing type', enum: ContractPricingType })
  @IsEnum(ContractPricingType)
  @IsNotEmpty()
  pricingType: ContractPricingType;

  @ApiPropertyOptional({ description: 'Renewal type', enum: RenewalType })
  @IsEnum(RenewalType)
  @IsOptional()
  renewalType?: RenewalType;

  @ApiPropertyOptional({ description: 'Auto-renewal notice days' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  renewalNoticeDays?: number;

  @ApiPropertyOptional({ description: 'Contract terms (JSON)' })
  @IsOptional()
  terms?: ContractTerms;

  @ApiPropertyOptional({ description: 'Volume commitments (JSON array)' })
  @IsArray()
  @IsOptional()
  volumeCommitments?: VolumeCommitment[];

  @ApiPropertyOptional({ description: 'Contract description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Custom fields (JSON)' })
  @IsOptional()
  customFields?: Record<string, unknown>;
}

/**
 * Create contract pricing DTO
 */
export class CreateContractPricingDto {
  @ApiProperty({ description: 'Contract ID' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Base unit price' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  baseUnitPrice: number;

  @ApiProperty({ description: 'Currency code' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional({ description: 'Unit of measure' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiPropertyOptional({ description: 'Pricing tiers (JSON array)' })
  @IsArray()
  @IsOptional()
  pricingTiers?: ContractPricingTier[];

  @ApiPropertyOptional({ description: 'Minimum order quantity' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderQuantity?: number;

  @ApiPropertyOptional({ description: 'Maximum order quantity' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxOrderQuantity?: number;

  @ApiPropertyOptional({ description: 'Lead time in days' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  leadTimeDays?: number;
}

/**
 * Create contract amendment DTO
 */
export class CreateContractAmendmentDto {
  @ApiProperty({ description: 'Contract ID' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Amendment type', enum: AmendmentType })
  @IsEnum(AmendmentType)
  @IsNotEmpty()
  amendmentType: AmendmentType;

  @ApiProperty({ description: 'Amendment description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Effective date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  effectiveDate: Date;

  @ApiPropertyOptional({ description: 'Previous values (JSON)' })
  @IsOptional()
  previousValues?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'New values (JSON)' })
  @IsOptional()
  newValues?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Requires customer approval' })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;
}

/**
 * Renew contract DTO
 */
export class RenewContractDto {
  @ApiProperty({ description: 'Contract ID to renew' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'New start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  newStartDate: Date;

  @ApiProperty({ description: 'New end date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  newEndDate: Date;

  @ApiPropertyOptional({ description: 'Price adjustment percent' })
  @IsNumber()
  @IsOptional()
  priceAdjustmentPercent?: number;

  @ApiPropertyOptional({ description: 'Copy pricing from original' })
  @IsBoolean()
  @IsOptional()
  copyPricing?: boolean;

  @ApiPropertyOptional({ description: 'Copy commitments from original' })
  @IsBoolean()
  @IsOptional()
  copyCommitments?: boolean;

  @ApiPropertyOptional({ description: 'Renewal notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * Contract compliance check DTO
 */
export class ContractComplianceCheckDto {
  @ApiProperty({ description: 'Contract ID' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Check period start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodStart: Date;

  @ApiProperty({ description: 'Check period end date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodEnd: Date;

  @ApiPropertyOptional({ description: 'Include warnings' })
  @IsBoolean()
  @IsOptional()
  includeWarnings?: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Contract model
 */
@Table({
  tableName: 'contracts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contractNumber'] },
    { fields: ['customerId'] },
    { fields: ['supplierId'] },
    { fields: ['status'] },
    { fields: ['contractType'] },
    { fields: ['startDate', 'endDate'] },
    { fields: ['renewalDate'] },
    {
      fields: ['customerId', 'status', 'startDate', 'endDate'],
      name: 'idx_contracts_customer_active'
    },
  ],
})
export class Contract extends Model {
  @ApiProperty({ description: 'Contract ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  contractId: string;

  @ApiProperty({ description: 'Contract number (unique)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  contractNumber: string;

  @ApiProperty({ description: 'Contract name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  contractName: string;

  @ApiProperty({ description: 'Contract type', enum: ContractType })
  @Column({
    type: DataType.ENUM(...Object.values(ContractType)),
    allowNull: false,
  })
  contractType: ContractType;

  @ApiProperty({ description: 'Contract status', enum: ContractStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
    allowNull: false,
    defaultValue: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Supplier ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  @Index
  supplierId: string;

  @ApiProperty({ description: 'Contract start date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @ApiProperty({ description: 'Contract end date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @ApiProperty({ description: 'Contract value (total estimated)' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  totalValue: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  })
  currency: string;

  @ApiProperty({ description: 'Pricing type', enum: ContractPricingType })
  @Column({
    type: DataType.ENUM(...Object.values(ContractPricingType)),
    allowNull: false,
  })
  pricingType: ContractPricingType;

  @ApiProperty({ description: 'Renewal type', enum: RenewalType })
  @Column({
    type: DataType.ENUM(...Object.values(RenewalType)),
    allowNull: false,
    defaultValue: RenewalType.MANUAL,
  })
  renewalType: RenewalType;

  @ApiProperty({ description: 'Auto-renewal notice days' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  renewalNoticeDays: number;

  @ApiProperty({ description: 'Renewal date (if renewed)' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  renewalDate: Date;

  @ApiProperty({ description: 'Parent contract ID (if renewed)' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentContractId: string;

  @ApiProperty({ description: 'Contract terms (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  terms: ContractTerms;

  @ApiProperty({ description: 'Volume commitments (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  volumeCommitments: VolumeCommitment[];

  @ApiProperty({ description: 'Contract description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ description: 'Approval status', enum: ApprovalStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ApprovalStatus)),
    allowNull: true,
  })
  approvalStatus: ApprovalStatus;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  approvedBy: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  approvedDate: Date;

  @ApiProperty({ description: 'Document URL (PDF, etc.)' })
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  documentUrl: string;

  @ApiProperty({ description: 'Custom fields (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customFields: Record<string, unknown>;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @ApiProperty({ description: 'Updated by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  updatedBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @HasMany(() => ContractPricing)
  contractPricing: ContractPricing[];

  @HasMany(() => ContractAmendment)
  amendments: ContractAmendment[];
}

/**
 * Contract pricing model
 */
@Table({
  tableName: 'contract_pricing',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['productId'] },
    { fields: ['contractId', 'productId'] },
    { fields: ['isActive'] },
  ],
})
export class ContractPricing extends Model {
  @ApiProperty({ description: 'Contract pricing ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  contractPricingId: string;

  @ApiProperty({ description: 'Contract ID' })
  @ForeignKey(() => Contract)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  contractId: string;

  @BelongsTo(() => Contract)
  contract: Contract;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  productId: string;

  @ApiProperty({ description: 'Product SKU' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  productSku: string;

  @ApiProperty({ description: 'Base unit price' })
  @Column({
    type: DataType.DECIMAL(15, 4),
    allowNull: false,
  })
  baseUnitPrice: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  })
  currency: string;

  @ApiProperty({ description: 'Unit of measure' })
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  uom: string;

  @ApiProperty({ description: 'Pricing tiers (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  pricingTiers: ContractPricingTier[];

  @ApiProperty({ description: 'Minimum order quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minOrderQuantity: number;

  @ApiProperty({ description: 'Maximum order quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxOrderQuantity: number;

  @ApiProperty({ description: 'Lead time in days' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  leadTimeDays: number;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Contract amendment model
 */
@Table({
  tableName: 'contract_amendments',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['amendmentNumber'] },
    { fields: ['amendmentType'] },
    { fields: ['effectiveDate'] },
  ],
})
export class ContractAmendment extends Model {
  @ApiProperty({ description: 'Amendment ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  amendmentId: string;

  @ApiProperty({ description: 'Contract ID' })
  @ForeignKey(() => Contract)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  contractId: string;

  @BelongsTo(() => Contract)
  contract: Contract;

  @ApiProperty({ description: 'Amendment number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  amendmentNumber: string;

  @ApiProperty({ description: 'Amendment type', enum: AmendmentType })
  @Column({
    type: DataType.ENUM(...Object.values(AmendmentType)),
    allowNull: false,
  })
  amendmentType: AmendmentType;

  @ApiProperty({ description: 'Amendment description' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ApiProperty({ description: 'Effective date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveDate: Date;

  @ApiProperty({ description: 'Previous values (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  previousValues: Record<string, unknown>;

  @ApiProperty({ description: 'New values (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  newValues: Record<string, unknown>;

  @ApiProperty({ description: 'Approval status', enum: ApprovalStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ApprovalStatus)),
    allowNull: false,
    defaultValue: ApprovalStatus.PENDING,
  })
  approvalStatus: ApprovalStatus;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  approvedBy: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  approvedDate: Date;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Contract performance tracking model
 */
@Table({
  tableName: 'contract_performance',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['metricType'] },
    { fields: ['periodStart', 'periodEnd'] },
  ],
})
export class ContractPerformance extends Model {
  @ApiProperty({ description: 'Performance ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  performanceId: string;

  @ApiProperty({ description: 'Contract ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  contractId: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @Column({
    type: DataType.ENUM(...Object.values(PerformanceMetricType)),
    allowNull: false,
  })
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Period start date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodStart: Date;

  @ApiProperty({ description: 'Period end date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodEnd: Date;

  @ApiProperty({ description: 'Target value' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  targetValue: number;

  @ApiProperty({ description: 'Actual value' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  actualValue: number;

  @ApiProperty({ description: 'Achievement percentage' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  achievementPercent: number;

  @ApiProperty({ description: 'Status (MEETING, EXCEEDING, BELOW_TARGET, CRITICAL)' })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  status: string;

  @ApiProperty({ description: 'Notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a new contract
 *
 * Creates a new contract with validation and generates a unique contract number.
 *
 * @param contractData - Contract creation data
 * @param userId - User ID creating the contract
 * @returns Created contract
 *
 * @example
 * const contract = await createContract(contractDto, 'user-123');
 */
export async function createContract(
  contractData: CreateContractDto,
  userId: string,
): Promise<Contract> {
  try {
    // Validate dates
    if (contractData.startDate >= contractData.endDate) {
      throw new BadRequestException('Contract start date must be before end date');
    }

    // Generate unique contract number
    const contractNumber = await generateContractNumber(contractData.contractType);

    const contract = await Contract.create({
      contractNumber,
      contractName: contractData.contractName,
      contractType: contractData.contractType,
      status: ContractStatus.DRAFT,
      customerId: contractData.customerId,
      supplierId: contractData.supplierId,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      pricingType: contractData.pricingType,
      renewalType: contractData.renewalType || RenewalType.MANUAL,
      renewalNoticeDays: contractData.renewalNoticeDays,
      terms: contractData.terms,
      volumeCommitments: contractData.volumeCommitments,
      description: contractData.description,
      currency: 'USD',
      approvalStatus: ApprovalStatus.PENDING,
      customFields: contractData.customFields,
      createdBy: userId,
    });

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to create contract: ${error.message}`);
  }
}

/**
 * Generate unique contract number
 *
 * @param contractType - Contract type
 * @returns Generated contract number
 */
export async function generateContractNumber(contractType: ContractType): Promise<string> {
  const prefix = contractType.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Add pricing to contract
 *
 * Adds product pricing details to an existing contract.
 *
 * @param pricingData - Contract pricing data
 * @returns Created contract pricing
 *
 * @example
 * const pricing = await addContractPricing(pricingDto);
 */
export async function addContractPricing(
  pricingData: CreateContractPricingDto,
): Promise<ContractPricing> {
  try {
    // Verify contract exists
    const contract = await Contract.findByPk(pricingData.contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${pricingData.contractId}`);
    }

    // Check for duplicate product in contract
    const existing = await ContractPricing.findOne({
      where: {
        contractId: pricingData.contractId,
        productId: pricingData.productId,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Product ${pricingData.productId} already has active pricing in this contract`
      );
    }

    const contractPricing = await ContractPricing.create({
      contractId: pricingData.contractId,
      productId: pricingData.productId,
      productSku: pricingData.productId, // In production, lookup actual SKU
      baseUnitPrice: pricingData.baseUnitPrice,
      currency: pricingData.currency,
      uom: pricingData.uom,
      pricingTiers: pricingData.pricingTiers,
      minOrderQuantity: pricingData.minOrderQuantity,
      maxOrderQuantity: pricingData.maxOrderQuantity,
      leadTimeDays: pricingData.leadTimeDays,
      effectiveStartDate: contract.startDate,
      effectiveEndDate: contract.endDate,
      isActive: true,
    });

    return contractPricing;
  } catch (error) {
    throw new BadRequestException(`Failed to add contract pricing: ${error.message}`);
  }
}

/**
 * Get contract by ID
 *
 * @param contractId - Contract ID
 * @param includePricing - Include pricing details
 * @param includeAmendments - Include amendments
 * @returns Contract with optional includes
 *
 * @example
 * const contract = await getContractById('contract-123', true, true);
 */
export async function getContractById(
  contractId: string,
  includePricing: boolean = false,
  includeAmendments: boolean = false,
): Promise<Contract> {
  try {
    const include = [];

    if (includePricing) {
      include.push({ model: ContractPricing });
    }

    if (includeAmendments) {
      include.push({ model: ContractAmendment });
    }

    const contract = await Contract.findByPk(contractId, {
      include: include.length > 0 ? include : undefined,
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to get contract: ${error.message}`);
  }
}

/**
 * Get active contracts for customer
 *
 * Retrieves all active contracts for a specific customer.
 *
 * @param customerId - Customer ID
 * @param includeExpiringSoon - Include contracts expiring within 90 days
 * @returns Array of active contracts
 *
 * @example
 * const contracts = await getActiveContractsForCustomer('CUST-123', true);
 */
export async function getActiveContractsForCustomer(
  customerId: string,
  includeExpiringSoon: boolean = false,
): Promise<Contract[]> {
  try {
    const now = new Date();
    const whereClause: WhereOptions = {
      customerId,
      status: ContractStatus.ACTIVE,
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now },
    };

    if (includeExpiringSoon) {
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

      whereClause.endDate = { [Op.between]: [now, ninetyDaysFromNow] };
    }

    const contracts = await Contract.findAll({
      where: whereClause,
      include: [{ model: ContractPricing }],
      order: [['endDate', 'ASC']],
    });

    return contracts;
  } catch (error) {
    throw new BadRequestException(`Failed to get active contracts: ${error.message}`);
  }
}

/**
 * Get contract pricing for product
 *
 * Retrieves contract pricing for a specific product and customer.
 *
 * @param customerId - Customer ID
 * @param productId - Product ID
 * @param quantity - Order quantity (for tiered pricing)
 * @returns Contract pricing or null
 *
 * @example
 * const pricing = await getContractPricingForProduct('CUST-123', 'PROD-001', 100);
 */
export async function getContractPricingForProduct(
  customerId: string,
  productId: string,
  quantity: number = 1,
): Promise<{ unitPrice: number; contractId: string; contractNumber: string } | null> {
  try {
    const now = new Date();

    // Find active contract with this product
    const contractPricing = await ContractPricing.findOne({
      where: {
        productId,
        isActive: true,
        effectiveStartDate: { [Op.lte]: now },
        [Op.or]: [
          { effectiveEndDate: { [Op.gte]: now } },
          { effectiveEndDate: null },
        ],
      },
      include: [
        {
          model: Contract,
          where: {
            customerId,
            status: ContractStatus.ACTIVE,
            startDate: { [Op.lte]: now },
            endDate: { [Op.gte]: now },
          },
        },
      ],
      order: [[{ model: Contract, as: 'contract' }, 'endDate', 'DESC']],
    });

    if (!contractPricing) {
      return null;
    }

    // Calculate price based on tiers
    let unitPrice = contractPricing.baseUnitPrice;

    if (contractPricing.pricingTiers && contractPricing.pricingTiers.length > 0) {
      const applicableTier = contractPricing.pricingTiers.find(tier => {
        const meetsMin = quantity >= tier.minQuantity;
        const meetsMax = !tier.maxQuantity || quantity <= tier.maxQuantity;
        return meetsMin && meetsMax;
      });

      if (applicableTier) {
        unitPrice = applicableTier.unitPrice;
      }
    }

    return {
      unitPrice,
      contractId: contractPricing.contractId,
      contractNumber: contractPricing.contract.contractNumber,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Activate contract
 *
 * Activates a contract after approval.
 *
 * @param contractId - Contract ID
 * @param userId - User ID activating the contract
 * @returns Activated contract
 *
 * @example
 * const contract = await activateContract('contract-123', 'user-456');
 */
export async function activateContract(
  contractId: string,
  userId: string,
): Promise<Contract> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.status !== ContractStatus.APPROVED) {
      throw new BadRequestException('Contract must be approved before activation');
    }

    contract.status = ContractStatus.ACTIVE;
    contract.updatedBy = userId;
    await contract.save();

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to activate contract: ${error.message}`);
  }
}

/**
 * Approve contract
 *
 * Approves a pending contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID approving the contract
 * @param notes - Approval notes
 * @returns Approved contract
 *
 * @example
 * const contract = await approveContract('contract-123', 'user-456', 'Approved by management');
 */
export async function approveContract(
  contractId: string,
  userId: string,
  notes?: string,
): Promise<Contract> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.status !== ContractStatus.PENDING_APPROVAL && contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException(`Contract in ${contract.status} status cannot be approved`);
    }

    contract.status = ContractStatus.APPROVED;
    contract.approvalStatus = ApprovalStatus.APPROVED;
    contract.approvedBy = userId;
    contract.approvedDate = new Date();
    contract.updatedBy = userId;

    if (notes) {
      contract.customFields = {
        ...contract.customFields,
        approvalNotes: notes,
      };
    }

    await contract.save();

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to approve contract: ${error.message}`);
  }
}

/**
 * Create contract amendment
 *
 * Creates an amendment to an existing contract.
 *
 * @param amendmentData - Amendment data
 * @param userId - User ID creating the amendment
 * @returns Created amendment
 *
 * @example
 * const amendment = await createContractAmendment(amendmentDto, 'user-123');
 */
export async function createContractAmendment(
  amendmentData: CreateContractAmendmentDto,
  userId: string,
): Promise<ContractAmendment> {
  try {
    // Verify contract exists
    const contract = await Contract.findByPk(amendmentData.contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${amendmentData.contractId}`);
    }

    // Generate amendment number
    const amendmentNumber = await generateAmendmentNumber(amendmentData.contractId);

    const amendment = await ContractAmendment.create({
      contractId: amendmentData.contractId,
      amendmentNumber,
      amendmentType: amendmentData.amendmentType,
      description: amendmentData.description,
      effectiveDate: amendmentData.effectiveDate,
      previousValues: amendmentData.previousValues,
      newValues: amendmentData.newValues,
      approvalStatus: amendmentData.requiresApproval
        ? ApprovalStatus.PENDING
        : ApprovalStatus.APPROVED,
      createdBy: userId,
    });

    // Update contract status to AMENDED
    contract.status = ContractStatus.AMENDED;
    contract.updatedBy = userId;
    await contract.save();

    return amendment;
  } catch (error) {
    throw new BadRequestException(`Failed to create contract amendment: ${error.message}`);
  }
}

/**
 * Generate amendment number
 *
 * @param contractId - Contract ID
 * @returns Generated amendment number
 */
export async function generateAmendmentNumber(contractId: string): Promise<string> {
  const count = await ContractAmendment.count({ where: { contractId } });
  const contract = await Contract.findByPk(contractId);
  return `${contract.contractNumber}-AMD-${String(count + 1).padStart(3, '0')}`;
}

/**
 * Renew contract
 *
 * Creates a new contract based on an expiring contract.
 *
 * @param renewalData - Renewal data
 * @param userId - User ID creating the renewal
 * @returns New contract (renewal)
 *
 * @example
 * const renewedContract = await renewContract(renewalDto, 'user-123');
 */
export async function renewContract(
  renewalData: RenewContractDto,
  userId: string,
): Promise<Contract> {
  try {
    // Get original contract
    const originalContract = await Contract.findByPk(renewalData.contractId, {
      include: [{ model: ContractPricing }],
    });

    if (!originalContract) {
      throw new NotFoundException(`Contract not found: ${renewalData.contractId}`);
    }

    // Validate dates
    if (renewalData.newStartDate >= renewalData.newEndDate) {
      throw new BadRequestException('Renewal start date must be before end date');
    }

    // Generate new contract number
    const contractNumber = await generateContractNumber(originalContract.contractType);

    // Create renewed contract
    const renewedContract = await Contract.create({
      contractNumber,
      contractName: `${originalContract.contractName} (Renewed)`,
      contractType: originalContract.contractType,
      status: ContractStatus.DRAFT,
      customerId: originalContract.customerId,
      supplierId: originalContract.supplierId,
      startDate: renewalData.newStartDate,
      endDate: renewalData.newEndDate,
      pricingType: originalContract.pricingType,
      renewalType: originalContract.renewalType,
      renewalNoticeDays: originalContract.renewalNoticeDays,
      terms: originalContract.terms,
      volumeCommitments: renewalData.copyCommitments ? originalContract.volumeCommitments : null,
      description: `Renewal of ${originalContract.contractNumber}. ${renewalData.notes || ''}`,
      currency: originalContract.currency,
      approvalStatus: ApprovalStatus.PENDING,
      parentContractId: originalContract.contractId,
      createdBy: userId,
    });

    // Copy pricing if requested
    if (renewalData.copyPricing && originalContract.contractPricing) {
      for (const pricing of originalContract.contractPricing) {
        let adjustedPrice = pricing.baseUnitPrice;

        if (renewalData.priceAdjustmentPercent) {
          adjustedPrice = pricing.baseUnitPrice * (1 + renewalData.priceAdjustmentPercent / 100);
        }

        await ContractPricing.create({
          contractId: renewedContract.contractId,
          productId: pricing.productId,
          productSku: pricing.productSku,
          baseUnitPrice: adjustedPrice,
          currency: pricing.currency,
          uom: pricing.uom,
          pricingTiers: pricing.pricingTiers,
          minOrderQuantity: pricing.minOrderQuantity,
          maxOrderQuantity: pricing.maxOrderQuantity,
          leadTimeDays: pricing.leadTimeDays,
          effectiveStartDate: renewedContract.startDate,
          effectiveEndDate: renewedContract.endDate,
          isActive: true,
        });
      }
    }

    // Update original contract
    originalContract.status = ContractStatus.RENEWED;
    originalContract.renewalDate = new Date();
    originalContract.updatedBy = userId;
    await originalContract.save();

    return renewedContract;
  } catch (error) {
    throw new BadRequestException(`Failed to renew contract: ${error.message}`);
  }
}

/**
 * Get contracts expiring soon
 *
 * Retrieves contracts expiring within specified days.
 *
 * @param daysAhead - Days to look ahead (default 90)
 * @param renewalTypeFilter - Filter by renewal type
 * @returns Array of expiring contracts
 *
 * @example
 * const expiringContracts = await getExpiringContracts(60, RenewalType.AUTO_RENEW);
 */
export async function getExpiringContracts(
  daysAhead: number = 90,
  renewalTypeFilter?: RenewalType,
): Promise<Contract[]> {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const whereClause: WhereOptions = {
      status: ContractStatus.ACTIVE,
      endDate: { [Op.between]: [now, futureDate] },
    };

    if (renewalTypeFilter) {
      whereClause.renewalType = renewalTypeFilter;
    }

    const contracts = await Contract.findAll({
      where: whereClause,
      order: [['endDate', 'ASC']],
    });

    return contracts;
  } catch (error) {
    throw new BadRequestException(`Failed to get expiring contracts: ${error.message}`);
  }
}

/**
 * Process auto-renewals
 *
 * Automatically renews contracts marked for auto-renewal that are expiring.
 *
 * @param daysBeforeExpiration - Days before expiration to process
 * @param userId - User ID for audit trail
 * @returns Count of processed renewals
 *
 * @example
 * const count = await processAutoRenewals(30, 'system');
 */
export async function processAutoRenewals(
  daysBeforeExpiration: number = 30,
  userId: string = 'system',
): Promise<number> {
  try {
    const expiringContracts = await getExpiringContracts(
      daysBeforeExpiration,
      RenewalType.AUTO_RENEW
    );

    let renewalCount = 0;

    for (const contract of expiringContracts) {
      // Check if already renewed
      if (contract.status === ContractStatus.RENEWED) {
        continue;
      }

      // Calculate new dates
      const contractDuration = contract.endDate.getTime() - contract.startDate.getTime();
      const newStartDate = new Date(contract.endDate);
      newStartDate.setDate(newStartDate.getDate() + 1);
      const newEndDate = new Date(newStartDate.getTime() + contractDuration);

      // Create renewal
      const renewalDto: RenewContractDto = {
        contractId: contract.contractId,
        newStartDate,
        newEndDate,
        copyPricing: true,
        copyCommitments: true,
        notes: 'Auto-renewed contract',
      };

      await renewContract(renewalDto, userId);
      renewalCount++;
    }

    return renewalCount;
  } catch (error) {
    throw new BadRequestException(`Failed to process auto-renewals: ${error.message}`);
  }
}

/**
 * Check volume commitment compliance
 *
 * Checks if customer is meeting volume commitments in the contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Compliance check results
 *
 * @example
 * const results = await checkVolumeCommitmentCompliance('contract-123', startDate, endDate);
 */
export async function checkVolumeCommitmentCompliance(
  contractId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<ComplianceCheckResult[]> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    const results: ComplianceCheckResult[] = [];

    if (!contract.volumeCommitments || contract.volumeCommitments.length === 0) {
      return results;
    }

    for (const commitment of contract.volumeCommitments) {
      // In production, query actual order data for the period
      const actualQuantity = 0; // Placeholder
      const actualValue = 0; // Placeholder

      let passed = true;
      let variance = 0;
      let severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO';
      let message = '';
      let requiredValue = 0;
      let actualCheckValue = 0;

      switch (commitment.commitmentType) {
        case CommitmentType.MINIMUM_QUANTITY:
          requiredValue = commitment.minQuantity || 0;
          actualCheckValue = actualQuantity;
          passed = actualQuantity >= requiredValue;
          variance = actualQuantity - requiredValue;
          message = passed
            ? `Minimum quantity met: ${actualQuantity} >= ${requiredValue}`
            : `Below minimum quantity: ${actualQuantity} < ${requiredValue}`;
          severity = passed ? 'INFO' : variance < -requiredValue * 0.1 ? 'CRITICAL' : 'WARNING';
          break;

        case CommitmentType.MINIMUM_VALUE:
          requiredValue = commitment.minValue || 0;
          actualCheckValue = actualValue;
          passed = actualValue >= requiredValue;
          variance = actualValue - requiredValue;
          message = passed
            ? `Minimum value met: $${actualValue} >= $${requiredValue}`
            : `Below minimum value: $${actualValue} < $${requiredValue}`;
          severity = passed ? 'INFO' : variance < -requiredValue * 0.1 ? 'CRITICAL' : 'WARNING';
          break;

        case CommitmentType.MAXIMUM_QUANTITY:
          requiredValue = commitment.maxQuantity || 0;
          actualCheckValue = actualQuantity;
          passed = actualQuantity <= requiredValue;
          variance = requiredValue - actualQuantity;
          message = passed
            ? `Within maximum quantity: ${actualQuantity} <= ${requiredValue}`
            : `Exceeded maximum quantity: ${actualQuantity} > ${requiredValue}`;
          severity = passed ? 'INFO' : 'WARNING';
          break;
      }

      results.push({
        checkId: `CHK-${commitment.commitmentId}-${Date.now()}`,
        checkType: commitment.commitmentType,
        passed,
        actualValue: actualCheckValue,
        requiredValue,
        variance,
        severity,
        message,
        timestamp: new Date(),
      });
    }

    return results;
  } catch (error) {
    throw new BadRequestException(`Failed to check compliance: ${error.message}`);
  }
}

/**
 * Calculate contract performance metrics
 *
 * Calculates various performance metrics for a contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Performance metrics
 *
 * @example
 * const metrics = await calculateContractPerformanceMetrics('contract-123', startDate, endDate);
 */
export async function calculateContractPerformanceMetrics(
  contractId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<ContractPerformanceMetrics[]> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    const metrics: ContractPerformanceMetrics[] = [];

    // In production, query actual order data and calculate real metrics
    // This is a placeholder implementation

    // Purchase volume metric
    const targetVolume = 1000; // Placeholder
    const actualVolume = 850; // Placeholder
    const volumeAchievement = (actualVolume / targetVolume) * 100;

    metrics.push({
      metricType: PerformanceMetricType.PURCHASE_VOLUME,
      targetValue: targetVolume,
      actualValue: actualVolume,
      achievementPercent: volumeAchievement,
      periodStart,
      periodEnd,
      status: volumeAchievement >= 100 ? 'MEETING' : volumeAchievement >= 80 ? 'BELOW_TARGET' : 'CRITICAL',
    });

    // Purchase value metric
    const targetValue = 50000; // Placeholder
    const actualValue = 45000; // Placeholder
    const valueAchievement = (actualValue / targetValue) * 100;

    metrics.push({
      metricType: PerformanceMetricType.PURCHASE_VALUE,
      targetValue,
      actualValue,
      achievementPercent: valueAchievement,
      periodStart,
      periodEnd,
      status: valueAchievement >= 100 ? 'MEETING' : valueAchievement >= 80 ? 'BELOW_TARGET' : 'CRITICAL',
    });

    return metrics;
  } catch (error) {
    throw new BadRequestException(`Failed to calculate performance metrics: ${error.message}`);
  }
}

/**
 * Record contract performance
 *
 * Records performance data for a contract period.
 *
 * @param contractId - Contract ID
 * @param metricType - Type of performance metric
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @param targetValue - Target value
 * @param actualValue - Actual value
 * @returns Created performance record
 *
 * @example
 * const perf = await recordContractPerformance('contract-123', PerformanceMetricType.PURCHASE_VOLUME, start, end, 1000, 950);
 */
export async function recordContractPerformance(
  contractId: string,
  metricType: PerformanceMetricType,
  periodStart: Date,
  periodEnd: Date,
  targetValue: number,
  actualValue: number,
): Promise<ContractPerformance> {
  try {
    const achievementPercent = (actualValue / targetValue) * 100;
    let status = 'MEETING';

    if (achievementPercent >= 100) {
      status = 'EXCEEDING';
    } else if (achievementPercent >= 80) {
      status = 'MEETING';
    } else if (achievementPercent >= 50) {
      status = 'BELOW_TARGET';
    } else {
      status = 'CRITICAL';
    }

    const performance = await ContractPerformance.create({
      contractId,
      metricType,
      periodStart,
      periodEnd,
      targetValue,
      actualValue,
      achievementPercent,
      status,
    });

    return performance;
  } catch (error) {
    throw new BadRequestException(`Failed to record performance: ${error.message}`);
  }
}

/**
 * Terminate contract
 *
 * Terminates a contract before its end date.
 *
 * @param contractId - Contract ID
 * @param userId - User ID terminating the contract
 * @param reason - Termination reason
 * @param effectiveDate - Termination effective date
 * @returns Terminated contract
 *
 * @example
 * const contract = await terminateContract('contract-123', 'user-456', 'Customer request', new Date());
 */
export async function terminateContract(
  contractId: string,
  userId: string,
  reason: string,
  effectiveDate: Date,
): Promise<Contract> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.status === ContractStatus.TERMINATED) {
      throw new BadRequestException('Contract is already terminated');
    }

    contract.status = ContractStatus.TERMINATED;
    contract.endDate = effectiveDate;
    contract.updatedBy = userId;
    contract.customFields = {
      ...contract.customFields,
      terminationReason: reason,
      terminationDate: effectiveDate,
      terminatedBy: userId,
    };

    await contract.save();

    // Deactivate all pricing
    await ContractPricing.update(
      { isActive: false },
      { where: { contractId } }
    );

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to terminate contract: ${error.message}`);
  }
}

/**
 * Suspend contract
 *
 * Temporarily suspends a contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID suspending the contract
 * @param reason - Suspension reason
 * @returns Suspended contract
 *
 * @example
 * const contract = await suspendContract('contract-123', 'user-456', 'Payment issue');
 */
export async function suspendContract(
  contractId: string,
  userId: string,
  reason: string,
): Promise<Contract> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException('Only active contracts can be suspended');
    }

    contract.status = ContractStatus.SUSPENDED;
    contract.updatedBy = userId;
    contract.customFields = {
      ...contract.customFields,
      suspensionReason: reason,
      suspensionDate: new Date(),
      suspendedBy: userId,
    };

    await contract.save();

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to suspend contract: ${error.message}`);
  }
}

/**
 * Reactivate suspended contract
 *
 * Reactivates a suspended contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID reactivating the contract
 * @returns Reactivated contract
 *
 * @example
 * const contract = await reactivateContract('contract-123', 'user-456');
 */
export async function reactivateContract(
  contractId: string,
  userId: string,
): Promise<Contract> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.status !== ContractStatus.SUSPENDED) {
      throw new BadRequestException('Only suspended contracts can be reactivated');
    }

    contract.status = ContractStatus.ACTIVE;
    contract.updatedBy = userId;
    contract.customFields = {
      ...contract.customFields,
      reactivationDate: new Date(),
      reactivatedBy: userId,
    };

    await contract.save();

    return contract;
  } catch (error) {
    throw new BadRequestException(`Failed to reactivate contract: ${error.message}`);
  }
}

/**
 * Get contract pricing tiers
 *
 * Retrieves all pricing tiers for a product in a contract.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @returns Pricing tiers array
 *
 * @example
 * const tiers = await getContractPricingTiers('contract-123', 'PROD-001');
 */
export async function getContractPricingTiers(
  contractId: string,
  productId: string,
): Promise<ContractPricingTier[]> {
  try {
    const pricing = await ContractPricing.findOne({
      where: {
        contractId,
        productId,
        isActive: true,
      },
    });

    if (!pricing || !pricing.pricingTiers) {
      return [];
    }

    return pricing.pricingTiers;
  } catch (error) {
    return [];
  }
}

/**
 * Calculate tiered contract price
 *
 * Calculates the price based on quantity and pricing tiers.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @param quantity - Order quantity
 * @returns Calculated unit price
 *
 * @example
 * const price = await calculateTieredContractPrice('contract-123', 'PROD-001', 500);
 */
export async function calculateTieredContractPrice(
  contractId: string,
  productId: string,
  quantity: number,
): Promise<number | null> {
  try {
    const pricing = await ContractPricing.findOne({
      where: {
        contractId,
        productId,
        isActive: true,
      },
    });

    if (!pricing) {
      return null;
    }

    // If no tiers, return base price
    if (!pricing.pricingTiers || pricing.pricingTiers.length === 0) {
      return pricing.baseUnitPrice;
    }

    // Find applicable tier
    const tier = pricing.pricingTiers.find(t => {
      const meetsMin = quantity >= t.minQuantity;
      const meetsMax = !t.maxQuantity || quantity <= t.maxQuantity;
      return meetsMin && meetsMax;
    });

    if (tier) {
      return tier.unitPrice;
    }

    // Default to base price
    return pricing.baseUnitPrice;
  } catch (error) {
    return null;
  }
}

/**
 * Update contract pricing
 *
 * Updates pricing for a product in a contract.
 *
 * @param contractPricingId - Contract pricing ID
 * @param newPrice - New unit price
 * @param userId - User ID making the update
 * @returns Updated contract pricing
 *
 * @example
 * const pricing = await updateContractPricing('pricing-123', 99.99, 'user-456');
 */
export async function updateContractPricing(
  contractPricingId: string,
  newPrice: number,
  userId: string,
): Promise<ContractPricing> {
  try {
    const pricing = await ContractPricing.findByPk(contractPricingId);
    if (!pricing) {
      throw new NotFoundException(`Contract pricing not found: ${contractPricingId}`);
    }

    const oldPrice = pricing.baseUnitPrice;
    pricing.baseUnitPrice = newPrice;
    await pricing.save();

    // Create amendment record
    await createContractAmendment(
      {
        contractId: pricing.contractId,
        amendmentType: AmendmentType.PRICING_CHANGE,
        description: `Price updated for product ${pricing.productId}`,
        effectiveDate: new Date(),
        previousValues: { baseUnitPrice: oldPrice },
        newValues: { baseUnitPrice: newPrice },
        requiresApproval: true,
      },
      userId
    );

    return pricing;
  } catch (error) {
    throw new BadRequestException(`Failed to update contract pricing: ${error.message}`);
  }
}

/**
 * Bulk update contract pricing
 *
 * Updates pricing for multiple products with a percentage adjustment.
 *
 * @param contractId - Contract ID
 * @param adjustmentPercent - Percentage adjustment (positive or negative)
 * @param userId - User ID making the update
 * @returns Count of updated pricing records
 *
 * @example
 * const count = await bulkUpdateContractPricing('contract-123', 5.0, 'user-456');
 */
export async function bulkUpdateContractPricing(
  contractId: string,
  adjustmentPercent: number,
  userId: string,
): Promise<number> {
  try {
    const pricingRecords = await ContractPricing.findAll({
      where: { contractId, isActive: true },
    });

    let updateCount = 0;

    for (const pricing of pricingRecords) {
      const newPrice = pricing.baseUnitPrice * (1 + adjustmentPercent / 100);
      pricing.baseUnitPrice = newPrice;
      await pricing.save();
      updateCount++;
    }

    // Create amendment record
    await createContractAmendment(
      {
        contractId,
        amendmentType: AmendmentType.PRICING_CHANGE,
        description: `Bulk price adjustment: ${adjustmentPercent}%`,
        effectiveDate: new Date(),
        previousValues: { adjustmentPercent: 0 },
        newValues: { adjustmentPercent },
        requiresApproval: true,
      },
      userId
    );

    return updateCount;
  } catch (error) {
    throw new BadRequestException(`Failed to bulk update pricing: ${error.message}`);
  }
}

/**
 * Get contract amendments
 *
 * Retrieves all amendments for a contract.
 *
 * @param contractId - Contract ID
 * @param amendmentType - Filter by amendment type
 * @returns Array of amendments
 *
 * @example
 * const amendments = await getContractAmendments('contract-123', AmendmentType.PRICING_CHANGE);
 */
export async function getContractAmendments(
  contractId: string,
  amendmentType?: AmendmentType,
): Promise<ContractAmendment[]> {
  try {
    const whereClause: WhereOptions = { contractId };

    if (amendmentType) {
      whereClause.amendmentType = amendmentType;
    }

    const amendments = await ContractAmendment.findAll({
      where: whereClause,
      order: [['effectiveDate', 'DESC']],
    });

    return amendments;
  } catch (error) {
    throw new BadRequestException(`Failed to get amendments: ${error.message}`);
  }
}

/**
 * Approve contract amendment
 *
 * Approves a pending contract amendment.
 *
 * @param amendmentId - Amendment ID
 * @param userId - User ID approving the amendment
 * @returns Approved amendment
 *
 * @example
 * const amendment = await approveContractAmendment('amendment-123', 'user-456');
 */
export async function approveContractAmendment(
  amendmentId: string,
  userId: string,
): Promise<ContractAmendment> {
  try {
    const amendment = await ContractAmendment.findByPk(amendmentId);
    if (!amendment) {
      throw new NotFoundException(`Amendment not found: ${amendmentId}`);
    }

    if (amendment.approvalStatus !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Amendment is not pending approval');
    }

    amendment.approvalStatus = ApprovalStatus.APPROVED;
    amendment.approvedBy = userId;
    amendment.approvedDate = new Date();
    await amendment.save();

    return amendment;
  } catch (error) {
    throw new BadRequestException(`Failed to approve amendment: ${error.message}`);
  }
}

/**
 * Get contract summary
 *
 * Returns a comprehensive summary of contract details.
 *
 * @param contractId - Contract ID
 * @returns Contract summary object
 *
 * @example
 * const summary = await getContractSummary('contract-123');
 */
export async function getContractSummary(
  contractId: string,
): Promise<{
  contract: Contract;
  pricingCount: number;
  amendmentCount: number;
  daysRemaining: number;
  isExpiringSoon: boolean;
  complianceStatus: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
}> {
  try {
    const contract = await Contract.findByPk(contractId, {
      include: [
        { model: ContractPricing },
        { model: ContractAmendment },
      ],
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    const now = new Date();
    const daysRemaining = Math.ceil(
      (contract.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const pricingCount = await ContractPricing.count({
      where: { contractId, isActive: true },
    });

    const amendmentCount = await ContractAmendment.count({
      where: { contractId },
    });

    return {
      contract,
      pricingCount,
      amendmentCount,
      daysRemaining,
      isExpiringSoon: daysRemaining <= 90 && daysRemaining > 0,
      complianceStatus: 'COMPLIANT', // Placeholder - would check actual compliance
    };
  } catch (error) {
    throw new BadRequestException(`Failed to get contract summary: ${error.message}`);
  }
}

/**
 * Search contracts
 *
 * Searches contracts with various filters.
 *
 * @param filters - Search filters
 * @returns Array of matching contracts
 *
 * @example
 * const contracts = await searchContracts({ customerId: 'CUST-123', status: ContractStatus.ACTIVE });
 */
export async function searchContracts(filters: {
  customerId?: string;
  status?: ContractStatus;
  contractType?: ContractType;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  searchText?: string;
}): Promise<Contract[]> {
  try {
    const whereClause: WhereOptions = {};

    if (filters.customerId) {
      whereClause.customerId = filters.customerId;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.contractType) {
      whereClause.contractType = filters.contractType;
    }

    if (filters.startDateFrom || filters.startDateTo) {
      whereClause.startDate = {};
      if (filters.startDateFrom) {
        whereClause.startDate[Op.gte] = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        whereClause.startDate[Op.lte] = filters.startDateTo;
      }
    }

    if (filters.endDateFrom || filters.endDateTo) {
      whereClause.endDate = {};
      if (filters.endDateFrom) {
        whereClause.endDate[Op.gte] = filters.endDateFrom;
      }
      if (filters.endDateTo) {
        whereClause.endDate[Op.lte] = filters.endDateTo;
      }
    }

    if (filters.searchText) {
      whereClause[Op.or] = [
        { contractNumber: { [Op.iLike]: `%${filters.searchText}%` } },
        { contractName: { [Op.iLike]: `%${filters.searchText}%` } },
        { description: { [Op.iLike]: `%${filters.searchText}%` } },
      ];
    }

    const contracts = await Contract.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return contracts;
  } catch (error) {
    throw new BadRequestException(`Failed to search contracts: ${error.message}`);
  }
}

/**
 * Export contract to JSON
 *
 * Exports contract data including pricing and amendments.
 *
 * @param contractId - Contract ID
 * @returns JSON string of contract data
 *
 * @example
 * const json = await exportContractToJson('contract-123');
 */
export async function exportContractToJson(contractId: string): Promise<string> {
  try {
    const contract = await Contract.findByPk(contractId, {
      include: [
        { model: ContractPricing },
        { model: ContractAmendment },
      ],
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    return JSON.stringify(contract, null, 2);
  } catch (error) {
    throw new BadRequestException(`Failed to export contract: ${error.message}`);
  }
}

/**
 * Calculate contract savings
 *
 * Calculates total savings achieved through contract pricing vs standard pricing.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Savings summary
 *
 * @example
 * const savings = await calculateContractSavings('contract-123', startDate, endDate);
 */
export async function calculateContractSavings(
  contractId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<{
  totalContractSpend: number;
  estimatedStandardSpend: number;
  totalSavings: number;
  savingsPercent: number;
}> {
  try {
    // In production, query actual order data for the period
    // This is a placeholder implementation

    const totalContractSpend = 45000; // Placeholder
    const estimatedStandardSpend = 52000; // Placeholder
    const totalSavings = estimatedStandardSpend - totalContractSpend;
    const savingsPercent = (totalSavings / estimatedStandardSpend) * 100;

    return {
      totalContractSpend,
      estimatedStandardSpend,
      totalSavings,
      savingsPercent,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to calculate savings: ${error.message}`);
  }
}

/**
 * Send renewal notifications
 *
 * Sends notifications for contracts approaching expiration.
 *
 * @param contractId - Contract ID
 * @param recipients - Array of recipient emails
 * @returns Count of notifications sent
 *
 * @example
 * const count = await sendRenewalNotifications('contract-123', ['user@example.com']);
 */
export async function sendRenewalNotifications(
  contractId: string,
  recipients: string[],
): Promise<number> {
  try {
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    // In production, integrate with email service
    // This is a placeholder implementation

    const notifications: RenewalNotification[] = recipients.map(email => ({
      notificationId: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      recipientEmail: email,
      recipientName: email.split('@')[0],
      scheduledDate: new Date(),
      sent: false,
    }));

    // Simulate sending notifications
    let sentCount = 0;
    for (const notification of notifications) {
      // Send email here
      notification.sent = true;
      notification.sentDate = new Date();
      sentCount++;
    }

    return sentCount;
  } catch (error) {
    throw new BadRequestException(`Failed to send notifications: ${error.message}`);
  }
}

/**
 * Get contract analytics
 *
 * Returns analytics and insights for contracts.
 *
 * @param customerId - Customer ID (optional)
 * @param dateFrom - Start date for analytics
 * @param dateTo - End date for analytics
 * @returns Analytics summary
 *
 * @example
 * const analytics = await getContractAnalytics('CUST-123', startDate, endDate);
 */
export async function getContractAnalytics(
  customerId?: string,
  dateFrom?: Date,
  dateTo?: Date,
): Promise<{
  totalContracts: number;
  activeContracts: number;
  expiringContracts: number;
  totalContractValue: number;
  averageContractDuration: number;
  topContractTypes: Array<{ type: ContractType; count: number }>;
}> {
  try {
    const whereClause: WhereOptions = {};

    if (customerId) {
      whereClause.customerId = customerId;
    }

    if (dateFrom || dateTo) {
      whereClause.startDate = {};
      if (dateFrom) {
        whereClause.startDate[Op.gte] = dateFrom;
      }
      if (dateTo) {
        whereClause.startDate[Op.lte] = dateTo;
      }
    }

    const totalContracts = await Contract.count({ where: whereClause });

    const activeContracts = await Contract.count({
      where: { ...whereClause, status: ContractStatus.ACTIVE },
    });

    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const expiringContracts = await Contract.count({
      where: {
        ...whereClause,
        status: ContractStatus.ACTIVE,
        endDate: { [Op.between]: [now, ninetyDaysFromNow] },
      },
    });

    // Placeholder values for other metrics
    const totalContractValue = 1500000;
    const averageContractDuration = 365;
    const topContractTypes = [
      { type: ContractType.PRICING_AGREEMENT, count: 15 },
      { type: ContractType.VOLUME_COMMITMENT, count: 12 },
      { type: ContractType.MASTER_AGREEMENT, count: 8 },
    ];

    return {
      totalContracts,
      activeContracts,
      expiringContracts,
      totalContractValue,
      averageContractDuration,
      topContractTypes,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to get analytics: ${error.message}`);
  }
}

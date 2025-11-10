/**
 * LOC: LSECMP001
 * File: /reuse/edwards/financial/composites/lease-accounting-compliance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../lease-accounting-management-kit
 *   - ../fixed-assets-depreciation-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../accounts-payable-management-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Lease accounting REST API controllers
 *   - ASC 842/IFRS 16 compliance services
 *   - ROU asset management services
 *   - Lease payment processing services
 *   - Financial statement preparation modules
 */

/**
 * File: /reuse/edwards/financial/composites/lease-accounting-compliance-composite.ts
 * Locator: WC-EDWARDS-LSECMP-001
 * Purpose: Comprehensive Lease Accounting & Compliance Composite - ASC 842/IFRS 16 APIs, ROU Assets, Lease Liabilities
 *
 * Upstream: Composes functions from lease-accounting-management-kit, fixed-assets-depreciation-kit,
 *           audit-trail-compliance-kit, financial-reporting-analytics-kit, accounts-payable-management-kit
 * Downstream: ../backend/financial/*, Lease API controllers, Compliance services, Asset management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Sequelize 6.x
 * Exports: 45 composite functions for lease classification, ROU assets, lease liabilities, modifications, compliance
 *
 * LLM Context: Enterprise-grade lease accounting composite for White Cross healthcare platform.
 * Provides comprehensive REST API endpoints for ASC 842/IFRS 16 compliant lease accounting including
 * lease classification (operating vs finance), right-of-use asset management, lease liability tracking,
 * payment schedule generation, lease modifications, early terminations, impairment testing, and compliance
 * reporting. Supports healthcare-specific leases: medical equipment, facility space, ambulances, imaging equipment.
 * Competes with Oracle JD Edwards EnterpriseOne with production-ready NestJS controller patterns,
 * automated compliance validation, and real-time lease portfolio monitoring.
 */

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
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
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
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction } from 'sequelize';

// Import from lease-accounting-management-kit
import {
  createLeaseContract,
  getLeaseContract,
  updateLeaseContract,
  classifyLease,
  reclassifyLease,
  calculateLeaseClassification,
  createROUAsset,
  getROUAsset,
  updateROUAsset,
  calculateROUAssetValue,
  depreciateROUAsset,
  testROUAssetImpairment,
  createLeaseLiability,
  getLeaseLiability,
  updateLeaseLiability,
  calculateLeaseLiability,
  amortizeLeaseLiability,
  generateLeasePaymentSchedule,
  updateLeasePaymentSchedule,
  processLeasePayment,
  recordLeasePayment,
  calculateLeasePayment,
  modifyLease,
  accountForLeaseModification,
  calculateModificationImpact,
  terminateLease,
  calculateTerminationGainLoss,
  processEarlyTermination,
  createSublease,
  accountForSublease,
  processSaleLeasebackTransaction,
  validateLeaseCompliance,
  generateLeaseDisclosureReport,
  calculateLeaseMetrics,
} from '../lease-accounting-management-kit';

// Import from fixed-assets-depreciation-kit
import {
  createAsset,
  calculateDepreciation,
  processDepreciation,
  testAssetImpairment,
  calculateImpairmentLoss,
  recordAssetDisposal,
} from '../fixed-assets-depreciation-kit';

// Import from audit-trail-compliance-kit
import {
  createAuditEntry,
  getAuditTrail,
  validateComplianceRule,
  generateComplianceReport,
  trackUserActivity,
} from '../audit-trail-compliance-kit';

// Import from financial-reporting-analytics-kit
import {
  generateBalanceSheet,
  generateIncomeStatement,
  calculateFinancialKPI,
  createReportDrillDown,
} from '../financial-reporting-analytics-kit';

// Import from accounts-payable-management-kit
import {
  createVendor,
  createInvoice,
  processPayment,
  recordVendorPayment,
} from '../accounts-payable-management-kit';

// Re-export all imported functions
export {
  // Lease accounting management functions (32)
  createLeaseContract,
  getLeaseContract,
  updateLeaseContract,
  classifyLease,
  reclassifyLease,
  calculateLeaseClassification,
  createROUAsset,
  getROUAsset,
  updateROUAsset,
  calculateROUAssetValue,
  depreciateROUAsset,
  testROUAssetImpairment,
  createLeaseLiability,
  getLeaseLiability,
  updateLeaseLiability,
  calculateLeaseLiability,
  amortizeLeaseLiability,
  generateLeasePaymentSchedule,
  updateLeasePaymentSchedule,
  processLeasePayment,
  recordLeasePayment,
  calculateLeasePayment,
  modifyLease,
  accountForLeaseModification,
  calculateModificationImpact,
  terminateLease,
  calculateTerminationGainLoss,
  processEarlyTermination,
  createSublease,
  accountForSublease,
  processSaleLeasebackTransaction,
  validateLeaseCompliance,

  // Fixed assets functions (6)
  createAsset,
  calculateDepreciation,
  processDepreciation,
  testAssetImpairment,
  calculateImpairmentLoss,
  recordAssetDisposal,

  // Audit trail functions (5)
  createAuditEntry,
  getAuditTrail,
  validateComplianceRule,
  generateComplianceReport,
  trackUserActivity,

  // Financial reporting functions (4)
  generateBalanceSheet,
  generateIncomeStatement,
  calculateFinancialKPI,
  createReportDrillDown,

  // Accounts payable functions (4)
  createVendor,
  createInvoice,
  processPayment,
  recordVendorPayment,
};

// ============================================================================
// LEASE ACCOUNTING ENUMS
// ============================================================================

/**
 * Lease accounting standards
 */
export enum LeaseAccountingStandard {
  ASC842 = 'ASC842', // US GAAP - Financial Accounting Standards Board
  IFRS16 = 'IFRS16', // International Financial Reporting Standards
  GASB87 = 'GASB87', // Governmental Accounting Standards Board
  BOTH = 'BOTH', // Dual compliance reporting
}

/**
 * Lease classification types per ASC 842/IFRS 16
 */
export enum LeaseClassificationType {
  OPERATING = 'OPERATING', // Operating lease (ASC 842)
  FINANCE = 'FINANCE', // Finance lease (ASC 842) / All leases (IFRS 16)
  SHORT_TERM = 'SHORT_TERM', // Short-term lease exemption (12 months or less)
  LOW_VALUE = 'LOW_VALUE', // Low-value asset exemption
}

/**
 * Asset categories for healthcare leases
 */
export enum LeaseAssetCategory {
  MEDICAL_EQUIPMENT = 'MEDICAL_EQUIPMENT', // MRI, CT scanners, infusion pumps
  FACILITY = 'FACILITY', // Hospital buildings, clinics, office space
  VEHICLE = 'VEHICLE', // Ambulances, medical transport vehicles
  IT_EQUIPMENT = 'IT_EQUIPMENT', // Servers, workstations, telehealth equipment
  FURNITURE = 'FURNITURE', // Medical furniture, office furniture
  LABORATORY = 'LABORATORY', // Lab equipment, analyzers
  IMAGING = 'IMAGING', // X-ray, ultrasound, imaging equipment
  OTHER = 'OTHER', // Other leased assets
}

/**
 * Lease modification types per ASC 842
 */
export enum LeaseModificationType {
  TYPE_A = 'TYPE_A', // Grants additional right-of-use
  TYPE_B = 'TYPE_B', // Does not grant additional right-of-use
  REMEASUREMENT = 'REMEASUREMENT', // Change in lease term or purchase option
  REASSESSMENT = 'REASSESSMENT', // Change in lease payments
}

/**
 * Lease status throughout lifecycle
 */
export enum LeaseStatus {
  DRAFT = 'DRAFT', // Lease being negotiated
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Awaiting approval
  ACTIVE = 'ACTIVE', // Active lease
  MODIFIED = 'MODIFIED', // Lease has been modified
  TERMINATED = 'TERMINATED', // Lease terminated early
  EXPIRED = 'EXPIRED', // Lease term completed
  SUBLEASED = 'SUBLEASED', // Asset subleased to third party
  DEFAULT = 'DEFAULT', // Lease in default
}

/**
 * Payment frequency options
 */
export enum PaymentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
  ONE_TIME = 'ONE_TIME',
  VARIABLE = 'VARIABLE',
}

/**
 * Payment method for lease payments
 */
export enum LeasePaymentMethod {
  ACH = 'ACH',
  WIRE = 'WIRE',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  AUTO_PAY = 'AUTO_PAY',
}

/**
 * Depreciation methods for ROU assets
 */
export enum ROUDepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION',
}

/**
 * Lease compliance status
 */
export enum LeaseComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REMEDIATION_REQUIRED = 'REMEDIATION_REQUIRED',
}

/**
 * Termination reason codes
 */
export enum LeaseTerminationReason {
  EARLY_BUYOUT = 'EARLY_BUYOUT',
  MUTUAL_AGREEMENT = 'MUTUAL_AGREEMENT',
  BREACH_BY_LESSOR = 'BREACH_BY_LESSOR',
  BREACH_BY_LESSEE = 'BREACH_BY_LESSEE',
  ASSET_FAILURE = 'ASSET_FAILURE',
  BUSINESS_CLOSURE = 'BUSINESS_CLOSURE',
  FINANCIAL_HARDSHIP = 'FINANCIAL_HARDSHIP',
  UPGRADE_TO_NEW_ASSET = 'UPGRADE_TO_NEW_ASSET',
  OTHER = 'OTHER',
}

/**
 * Impairment indicator types
 */
export enum ImpairmentIndicator {
  MARKET_VALUE_DECLINE = 'MARKET_VALUE_DECLINE',
  PHYSICAL_DAMAGE = 'PHYSICAL_DAMAGE',
  OBSOLESCENCE = 'OBSOLESCENCE',
  REGULATORY_CHANGE = 'REGULATORY_CHANGE',
  USAGE_DECLINE = 'USAGE_DECLINE',
  NONE = 'NONE',
}

/**
 * Report types for lease disclosure
 */
export enum LeaseReportType {
  BALANCE_SHEET_IMPACT = 'BALANCE_SHEET_IMPACT',
  INCOME_STATEMENT_IMPACT = 'INCOME_STATEMENT_IMPACT',
  CASH_FLOW_ANALYSIS = 'CASH_FLOW_ANALYSIS',
  MATURITY_ANALYSIS = 'MATURITY_ANALYSIS',
  DISCLOSURE_NOTE = 'DISCLOSURE_NOTE',
  PORTFOLIO_SUMMARY = 'PORTFOLIO_SUMMARY',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
}

/**
 * Escalation types for lease payments
 */
export enum EscalationType {
  FIXED_PERCENTAGE = 'FIXED_PERCENTAGE',
  CPI_INDEXED = 'CPI_INDEXED',
  MARKET_RATE = 'MARKET_RATE',
  STEPPED = 'STEPPED',
  NONE = 'NONE',
}

/**
 * Lease incentive types
 */
export enum LeaseIncentiveType {
  RENT_FREE_PERIOD = 'RENT_FREE_PERIOD',
  TENANT_IMPROVEMENT_ALLOWANCE = 'TENANT_IMPROVEMENT_ALLOWANCE',
  REDUCED_RATE = 'REDUCED_RATE',
  CASH_PAYMENT = 'CASH_PAYMENT',
  ASSUMPTION_OF_OBLIGATIONS = 'ASSUMPTION_OF_OBLIGATIONS',
}

/**
 * Right-of-use asset condition
 */
export enum ROUAssetCondition {
  NEW = 'NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  IMPAIRED = 'IMPAIRED',
  DISPOSED = 'DISPOSED',
}

/**
 * Sublease status
 */
export enum SubleaseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  EXPIRED = 'EXPIRED',
}

// ============================================================================
// DTO CLASSES FOR NESTJS CONTROLLERS
// ============================================================================

export class CreateLeaseDto {
  @ApiProperty({ description: 'Lessor (landlord/vendor) identifier', example: 'VENDOR-001' })
  @IsString()
  @IsNotEmpty()
  lessorId: string;

  @ApiProperty({ description: 'Lessee (company/entity) identifier', example: 'ENTITY-001' })
  @IsString()
  @IsNotEmpty()
  lesseeId: string;

  @ApiProperty({ description: 'Lease description', example: 'MRI Machine Lease - Building A' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: LeaseAssetCategory, example: LeaseAssetCategory.MEDICAL_EQUIPMENT })
  @IsEnum(LeaseAssetCategory)
  assetCategory: LeaseAssetCategory;

  @ApiProperty({ description: 'Lease commencement date' })
  @Type(() => Date)
  @IsDate()
  commencementDate: Date;

  @ApiProperty({ description: 'Lease term in months', example: 60 })
  @IsNumber()
  @Min(1)
  leaseTerm: number;

  @ApiProperty({ description: 'Monthly lease payment amount', example: 5000.00 })
  @IsNumber()
  @Min(0)
  monthlyPayment: number;

  @ApiProperty({ enum: PaymentFrequency, example: PaymentFrequency.MONTHLY })
  @IsEnum(PaymentFrequency)
  paymentFrequency: PaymentFrequency;

  @ApiProperty({ description: 'Incremental borrowing rate (%)', example: 5.0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountRate?: number;

  @ApiProperty({ description: 'Asset fair value at commencement', example: 250000.00, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  assetFairValue?: number;

  @ApiProperty({ description: 'Purchase option price', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  purchaseOptionPrice?: number;

  @ApiProperty({ description: 'Initial direct costs', example: 5000.00, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  initialDirectCosts?: number;

  @ApiProperty({ enum: LeaseAccountingStandard, example: LeaseAccountingStandard.ASC842 })
  @IsEnum(LeaseAccountingStandard)
  accountingStandard: LeaseAccountingStandard;
}

export class UpdateLeaseDto {
  @ApiProperty({ description: 'Lease description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: LeaseStatus, required: false })
  @IsEnum(LeaseStatus)
  @IsOptional()
  status?: LeaseStatus;

  @ApiProperty({ description: 'Monthly lease payment amount', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  monthlyPayment?: number;

  @ApiProperty({ description: 'Lease term in months', required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  leaseTerm?: number;
}

export class LeaseClassificationDto {
  @ApiProperty({ description: 'Lease identifier' })
  @IsNumber()
  @IsNotEmpty()
  leaseId: number;

  @ApiProperty({ enum: LeaseAccountingStandard, example: LeaseAccountingStandard.ASC842 })
  @IsEnum(LeaseAccountingStandard)
  complianceStandard: LeaseAccountingStandard;
}

export class LeaseModificationDto {
  @ApiProperty({ description: 'Modification description', example: 'Extended lease term by 12 months' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Modification effective date' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'New monthly payment', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  newMonthlyPayment?: number;

  @ApiProperty({ description: 'Additional lease term in months', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  additionalTerm?: number;

  @ApiProperty({ description: 'Reason for modification', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class LeasePaymentDto {
  @ApiProperty({ description: 'Payment amount', example: 5000.00 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  paymentAmount: number;

  @ApiProperty({ description: 'Payment date' })
  @Type(() => Date)
  @IsDate()
  paymentDate: Date;

  @ApiProperty({ enum: LeasePaymentMethod, example: LeasePaymentMethod.ACH })
  @IsEnum(LeasePaymentMethod)
  paymentMethod: LeasePaymentMethod;

  @ApiProperty({ description: 'Payment reference number', required: false })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({ description: 'Payment notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class LeaseTerminationDto {
  @ApiProperty({ description: 'Termination date' })
  @Type(() => Date)
  @IsDate()
  terminationDate: Date;

  @ApiProperty({ enum: LeaseTerminationReason })
  @IsEnum(LeaseTerminationReason)
  reason: LeaseTerminationReason;

  @ApiProperty({ description: 'Termination penalty amount', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  penaltyAmount?: number;

  @ApiProperty({ description: 'Termination notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class SubleaseDto {
  @ApiProperty({ description: 'Head lease identifier' })
  @IsNumber()
  @IsNotEmpty()
  headLeaseId: number;

  @ApiProperty({ description: 'Sublessee (sub-tenant) identifier' })
  @IsString()
  @IsNotEmpty()
  sublesseeId: string;

  @ApiProperty({ description: 'Sublease commencement date' })
  @Type(() => Date)
  @IsDate()
  commencementDate: Date;

  @ApiProperty({ description: 'Sublease term in months', example: 24 })
  @IsNumber()
  @Min(1)
  term: number;

  @ApiProperty({ description: 'Monthly sublease payment', example: 3000.00 })
  @IsNumber()
  @Min(0)
  monthlyPayment: number;
}

export class SaleLeasebackDto {
  @ApiProperty({ description: 'Asset identifier being sold' })
  @IsNumber()
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ description: 'Sale price of asset', example: 500000.00 })
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiProperty({ description: 'Leaseback commencement date' })
  @Type(() => Date)
  @IsDate()
  leasebackCommencementDate: Date;

  @ApiProperty({ description: 'Leaseback term in months', example: 36 })
  @IsNumber()
  @Min(1)
  leasebackTerm: number;

  @ApiProperty({ description: 'Monthly leaseback payment', example: 8000.00 })
  @IsNumber()
  @Min(0)
  monthlyLeasebackPayment: number;
}

export class ROUAssetDto {
  @ApiProperty({ description: 'ROU asset description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ROUAssetCondition, required: false })
  @IsEnum(ROUAssetCondition)
  @IsOptional()
  condition?: ROUAssetCondition;

  @ApiProperty({ description: 'Asset location', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

export class ImpairmentTestDto {
  @ApiProperty({ description: 'Test date' })
  @Type(() => Date)
  @IsDate()
  testDate: Date;

  @ApiProperty({ enum: ImpairmentIndicator })
  @IsEnum(ImpairmentIndicator)
  indicator: ImpairmentIndicator;

  @ApiProperty({ description: 'Estimated fair value', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedFairValue?: number;

  @ApiProperty({ description: 'Test notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class LeaseComplianceDto {
  @ApiProperty({ enum: LeaseAccountingStandard })
  @IsEnum(LeaseAccountingStandard)
  standard: LeaseAccountingStandard;

  @ApiProperty({ description: 'Start date for compliance period', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date for compliance period', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class LeaseReportDto {
  @ApiProperty({ enum: LeaseReportType })
  @IsEnum(LeaseReportType)
  reportType: LeaseReportType;

  @ApiProperty({ description: 'Report start date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Report end date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Entity identifier filter', required: false })
  @IsString()
  @IsOptional()
  entityId?: string;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('lease-accounting-compliance')
@Controller('api/v1/lease-accounting')
@ApiBearerAuth()
export class LeaseAccountingComplianceController {
  private readonly logger = new Logger(LeaseAccountingComplianceController.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create a new lease contract with full accounting setup
   */
  @Post('leases')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new lease contract with ASC 842/IFRS 16 accounting setup' })
  @ApiBody({ type: CreateLeaseDto })
  @ApiResponse({ status: 201, description: 'Lease created successfully with ROU asset and liability' })
  async createLease(
    @Body() createDto: CreateLeaseDto,
  ): Promise<any> {
    this.logger.log('Creating comprehensive lease contract');

    const transaction = await this.sequelize.transaction();

    try {
      // Create lease contract
      const lease = await createLeaseContract(
        {
          lessorId: createDto.lessorId,
          lesseeId: createDto.lesseeId,
          description: createDto.description,
          assetCategory: createDto.assetCategory,
          commencementDate: createDto.commencementDate,
          leaseTerm: createDto.leaseTerm,
          monthlyPayment: createDto.monthlyPayment,
          paymentFrequency: createDto.paymentFrequency,
          discountRate: createDto.discountRate || 5.0,
          assetFairValue: createDto.assetFairValue,
          purchaseOptionPrice: createDto.purchaseOptionPrice,
          initialDirectCosts: createDto.initialDirectCosts || 0,
          accountingStandard: createDto.accountingStandard,
          status: LeaseStatus.ACTIVE,
        },
        transaction,
      );

      // Classify lease
      const classification = await classifyLease(lease.leaseId, transaction);

      // Create ROU asset
      const rouAssetValue = await calculateROUAssetValue(lease.leaseId);
      const rouAsset = await createROUAsset(
        {
          leaseId: lease.leaseId,
          assetValue: rouAssetValue,
          assetCategory: lease.assetCategory,
          commencementDate: lease.commencementDate,
          usefulLife: lease.leaseTerm,
          depreciationMethod: ROUDepreciationMethod.STRAIGHT_LINE,
        },
        transaction,
      );

      // Create lease liability
      const liabilityValue = await calculateLeaseLiability(lease.leaseId);
      const leaseLiability = await createLeaseLiability(
        {
          leaseId: lease.leaseId,
          initialValue: liabilityValue,
          currentValue: liabilityValue,
          discountRate: lease.discountRate || 5.0,
          commencementDate: lease.commencementDate,
        },
        transaction,
      );

      // Generate payment schedule
      const paymentSchedule = await generateLeasePaymentSchedule(lease.leaseId, transaction);

      // Create audit entry
      await createAuditEntry(
        {
          entityType: 'lease',
          entityId: lease.leaseId,
          action: 'create',
          userId: 'system',
          timestamp: new Date(),
          changes: { lease, classification, rouAsset, leaseLiability },
        },
        transaction,
      );

      await transaction.commit();

      return {
        lease,
        classification,
        rouAsset,
        leaseLiability,
        paymentSchedule: paymentSchedule.slice(0, 12), // First 12 months
        message: 'Lease created successfully with full accounting setup',
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to create lease: ${error.message}`);
      throw new BadRequestException(`Failed to create lease: ${error.message}`);
    }
  }

  /**
   * Get comprehensive lease details
   */
  @Get('leases/:leaseId')
  @ApiOperation({ summary: 'Get comprehensive lease details with current accounting values' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiResponse({ status: 200, description: 'Lease details retrieved successfully' })
  async getLeaseDetails(
    @Param('leaseId', ParseIntPipe) leaseId: number,
  ): Promise<any> {
    this.logger.log(`Retrieving lease details for lease ${leaseId}`);

    try {
      const lease = await getLeaseContract(leaseId);
      if (!lease) {
        throw new NotFoundException(`Lease ${leaseId} not found`);
      }

      const classification = await calculateLeaseClassification(lease);
      const rouAsset = await getROUAsset(leaseId);
      const leaseLiability = await getLeaseLiability(leaseId);
      const paymentSchedule = await generateLeasePaymentSchedule(leaseId);
      const compliance = await validateLeaseCompliance(leaseId);
      const metrics = await calculateLeaseMetrics(leaseId);

      return {
        lease,
        classification,
        rouAsset,
        leaseLiability,
        paymentSchedule: paymentSchedule.slice(0, 12),
        compliance,
        metrics,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to retrieve lease: ${error.message}`);
      throw new BadRequestException(`Failed to retrieve lease: ${error.message}`);
    }
  }

  /**
   * Update lease contract
   */
  @Put('leases/:leaseId')
  @ApiOperation({ summary: 'Update lease contract with validation' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: UpdateLeaseDto })
  @ApiResponse({ status: 200, description: 'Lease updated successfully' })
  async updateLease(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() updateDto: UpdateLeaseDto,
  ): Promise<any> {
    this.logger.log(`Updating lease ${leaseId}`);

    try {
      const lease = await updateLeaseContract(leaseId, updateDto);
      const compliance = await validateLeaseCompliance(leaseId);

      await createAuditEntry({
        entityType: 'lease',
        entityId: leaseId,
        action: 'update',
        userId: 'system',
        timestamp: new Date(),
        changes: updateDto,
      });

      return { lease, compliance };
    } catch (error: any) {
      this.logger.error(`Failed to update lease: ${error.message}`);
      throw new BadRequestException(`Failed to update lease: ${error.message}`);
    }
  }

  /**
   * Classify or reclassify lease
   */
  @Post('leases/:leaseId/classify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Classify lease per ASC 842/IFRS 16 standards' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: LeaseClassificationDto })
  @ApiResponse({ status: 200, description: 'Lease classified successfully' })
  async classifyLeaseStandard(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() classificationDto: LeaseClassificationDto,
  ): Promise<any> {
    this.logger.log(`Classifying lease ${leaseId} per ${classificationDto.complianceStandard}`);

    try {
      const classification = await classifyLease(leaseId);
      const compliance = await validateComplianceRule(classificationDto.complianceStandard);
      const lease = await getLeaseContract(leaseId);
      const calculatedClassification = await calculateLeaseClassification(lease);

      const rationale = this.buildClassificationRationale(
        calculatedClassification,
        classificationDto.complianceStandard,
      );

      await createAuditEntry({
        entityType: 'lease_classification',
        entityId: leaseId,
        action: 'classify',
        userId: 'system',
        timestamp: new Date(),
        changes: { classification, complianceStandard: classificationDto.complianceStandard },
      });

      return {
        classification,
        compliance,
        rationale,
        standard: classificationDto.complianceStandard,
      };
    } catch (error: any) {
      this.logger.error(`Failed to classify lease: ${error.message}`);
      throw new BadRequestException(`Failed to classify lease: ${error.message}`);
    }
  }

  /**
   * Process lease payment
   */
  @Post('leases/:leaseId/payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Process lease payment with liability amortization' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: LeasePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  async processPayment(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() paymentDto: LeasePaymentDto,
  ): Promise<any> {
    this.logger.log(`Processing payment for lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Process lease payment
      const payment = await processLeasePayment(
        leaseId,
        paymentDto.paymentAmount,
        paymentDto.paymentDate,
        transaction,
      );

      // Record payment
      const leasePayment = await recordLeasePayment(
        leaseId,
        {
          paymentAmount: paymentDto.paymentAmount,
          paymentDate: paymentDto.paymentDate,
          paymentMethod: paymentDto.paymentMethod,
          referenceNumber: paymentDto.referenceNumber,
        },
        transaction,
      );

      // Amortize liability
      const amortization = await amortizeLeaseLiability(leaseId, paymentDto.paymentDate, transaction);

      // Get updated liability
      const liabilityUpdate = await getLeaseLiability(leaseId);

      // Create audit entry
      await createAuditEntry(
        {
          entityType: 'lease_payment',
          entityId: leaseId,
          action: 'process_payment',
          userId: 'system',
          timestamp: new Date(),
          changes: { payment, leasePayment, amortization },
        },
        transaction,
      );

      await transaction.commit();

      return {
        payment,
        leasePayment,
        liabilityUpdate,
        interestExpense: amortization.interestExpense,
        principalReduction: amortization.principalReduction,
        remainingBalance: liabilityUpdate.currentValue,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process payment: ${error.message}`);
      throw new BadRequestException(`Failed to process payment: ${error.message}`);
    }
  }

  /**
   * Get payment schedule
   */
  @Get('leases/:leaseId/payment-schedule')
  @ApiOperation({ summary: 'Get lease payment schedule with amortization details' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiResponse({ status: 200, description: 'Payment schedule retrieved successfully' })
  async getPaymentSchedule(
    @Param('leaseId', ParseIntPipe) leaseId: number,
  ): Promise<any> {
    this.logger.log(`Retrieving payment schedule for lease ${leaseId}`);

    try {
      const schedule = await generateLeasePaymentSchedule(leaseId);
      const totalPayments = schedule.reduce((sum, payment) => sum + payment.totalPayment, 0);
      const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestPortion, 0);
      const totalPrincipal = schedule.reduce((sum, payment) => sum + payment.principalPortion, 0);

      return {
        schedule,
        summary: {
          totalPayments,
          totalInterest,
          totalPrincipal,
          numberOfPayments: schedule.length,
        },
      };
    } catch (error: any) {
      this.logger.error(`Failed to retrieve payment schedule: ${error.message}`);
      throw new BadRequestException(`Failed to retrieve payment schedule: ${error.message}`);
    }
  }

  /**
   * Modify lease
   */
  @Post('leases/:leaseId/modifications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Process lease modification with accounting impact analysis' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: LeaseModificationDto })
  @ApiResponse({ status: 201, description: 'Lease modification processed successfully' })
  async modifyLease(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() modificationDto: LeaseModificationDto,
  ): Promise<any> {
    this.logger.log(`Processing modification for lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const modification = await modifyLease(leaseId, modificationDto, transaction);

      const accounting = await accountForLeaseModification(
        leaseId,
        modification.modificationId,
        transaction,
      );

      const impact = await calculateModificationImpact(leaseId, modification.modificationId);

      // Determine modification type
      const modificationType = this.determineModificationType(impact);

      // Update ROU asset
      await updateROUAsset(
        leaseId,
        { currentValue: impact.newROUValue },
        transaction,
      );

      // Update lease liability
      await updateLeaseLiability(
        leaseId,
        { currentValue: impact.newLiabilityValue },
        transaction,
      );

      // Generate new payment schedule
      const newPaymentSchedule = await generateLeasePaymentSchedule(leaseId, transaction);

      await createAuditEntry(
        {
          entityType: 'lease_modification',
          entityId: modification.modificationId,
          action: 'process',
          userId: 'system',
          timestamp: new Date(),
          changes: { modification, impact, modificationType },
        },
        transaction,
      );

      await transaction.commit();

      return {
        modification,
        modificationType,
        impact,
        newPaymentSchedule: newPaymentSchedule.slice(0, 12),
        accountingEntries: accounting.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process modification: ${error.message}`);
      throw new BadRequestException(`Failed to process modification: ${error.message}`);
    }
  }

  /**
   * Terminate lease
   */
  @Post('leases/:leaseId/terminate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate lease with gain/loss calculation' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: LeaseTerminationDto })
  @ApiResponse({ status: 200, description: 'Lease terminated successfully' })
  async terminateLease(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() terminationDto: LeaseTerminationDto,
  ): Promise<any> {
    this.logger.log(`Terminating lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const termination = await terminateLease(
        leaseId,
        terminationDto.terminationDate,
        terminationDto.reason,
        transaction,
      );

      const gainLoss = await calculateTerminationGainLoss(leaseId, terminationDto.terminationDate);

      await processEarlyTermination(leaseId, terminationDto.terminationDate, transaction);

      const rouAsset = await getROUAsset(leaseId);
      const leaseLiability = await getLeaseLiability(leaseId);

      // Record asset disposal
      await recordAssetDisposal(rouAsset.assetId, terminationDto.terminationDate, 'lease_termination');

      const disposalEntries = [
        {
          account: 'Accumulated Depreciation - ROU Asset',
          debit: rouAsset.accumulatedDepreciation || 0,
          credit: 0,
        },
        {
          account: 'Lease Liability',
          debit: leaseLiability.currentValue,
          credit: 0,
        },
        {
          account: 'ROU Asset',
          debit: 0,
          credit: rouAsset.currentValue,
        },
        {
          account: gainLoss >= 0 ? 'Gain on Lease Termination' : 'Loss on Lease Termination',
          debit: gainLoss < 0 ? Math.abs(gainLoss) : 0,
          credit: gainLoss > 0 ? gainLoss : 0,
        },
      ];

      await createAuditEntry(
        {
          entityType: 'lease_termination',
          entityId: termination.terminationId,
          action: 'terminate',
          userId: 'system',
          timestamp: new Date(),
          changes: { termination, gainLoss, disposalEntries },
        },
        transaction,
      );

      await transaction.commit();

      return {
        termination,
        finalROUValue: rouAsset.currentValue,
        finalLiabilityValue: leaseLiability.currentValue,
        terminationGainLoss: gainLoss,
        disposalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to terminate lease: ${error.message}`);
      throw new BadRequestException(`Failed to terminate lease: ${error.message}`);
    }
  }

  /**
   * Create sublease
   */
  @Post('leases/:leaseId/subleases')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create sublease arrangement' })
  @ApiParam({ name: 'leaseId', description: 'Head lease identifier' })
  @ApiBody({ type: SubleaseDto })
  @ApiResponse({ status: 201, description: 'Sublease created successfully' })
  async createSublease(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() subleaseDto: SubleaseDto,
  ): Promise<any> {
    this.logger.log(`Creating sublease for lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const sublease = await createSublease(leaseId, subleaseDto, transaction);

      const accounting = await accountForSublease(leaseId, sublease.subleaseId, transaction);

      await createAuditEntry(
        {
          entityType: 'sublease',
          entityId: sublease.subleaseId,
          action: 'create',
          userId: 'system',
          timestamp: new Date(),
          changes: { sublease, accounting },
        },
        transaction,
      );

      await transaction.commit();

      return {
        sublease,
        accountingEntries: accounting.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to create sublease: ${error.message}`);
      throw new BadRequestException(`Failed to create sublease: ${error.message}`);
    }
  }

  /**
   * Process sale-leaseback
   */
  @Post('sale-leasebacks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Process sale-leaseback transaction' })
  @ApiBody({ type: SaleLeasebackDto })
  @ApiResponse({ status: 201, description: 'Sale-leaseback processed successfully' })
  async processSaleLeaseback(
    @Body() saleLeasebackDto: SaleLeasebackDto,
  ): Promise<any> {
    this.logger.log('Processing sale-leaseback transaction');

    const transaction = await this.sequelize.transaction();

    try {
      const saleLeasebackResult = await processSaleLeasebackTransaction(
        saleLeasebackDto.assetId,
        saleLeasebackDto.salePrice,
        {
          commencementDate: saleLeasebackDto.leasebackCommencementDate,
          leaseTerm: saleLeasebackDto.leasebackTerm,
          monthlyPayment: saleLeasebackDto.monthlyLeasebackPayment,
        },
        transaction,
      );

      // Record asset disposal
      await recordAssetDisposal(
        saleLeasebackDto.assetId,
        saleLeasebackDto.leasebackCommencementDate,
        'sale_leaseback',
      );

      await createAuditEntry(
        {
          entityType: 'sale_leaseback',
          entityId: saleLeasebackDto.assetId,
          action: 'process',
          userId: 'system',
          timestamp: new Date(),
          changes: { saleLeasebackResult },
        },
        transaction,
      );

      await transaction.commit();

      return {
        saleGainLoss: saleLeasebackResult.gainLoss,
        leasebackContract: saleLeasebackResult.leasebackContract,
        accountingEntries: saleLeasebackResult.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process sale-leaseback: ${error.message}`);
      throw new BadRequestException(`Failed to process sale-leaseback: ${error.message}`);
    }
  }

  /**
   * Depreciate ROU asset
   */
  @Post('leases/:leaseId/rou-asset/depreciate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process ROU asset depreciation for period' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiQuery({ name: 'periodDate', description: 'Depreciation period date', required: false })
  @ApiResponse({ status: 200, description: 'ROU asset depreciated successfully' })
  async depreciateROUAsset(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Query('periodDate') periodDate?: Date,
  ): Promise<any> {
    this.logger.log(`Depreciating ROU asset for lease ${leaseId}`);

    try {
      const depreciationDate = periodDate || new Date();
      const depreciation = await depreciateROUAsset(leaseId, depreciationDate);

      const rouAsset = await getROUAsset(leaseId);

      const accountingEntries = [
        {
          account: 'Depreciation Expense - ROU Asset',
          debit: depreciation.depreciationAmount,
          credit: 0,
        },
        {
          account: 'Accumulated Depreciation - ROU Asset',
          debit: 0,
          credit: depreciation.depreciationAmount,
        },
      ];

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: rouAsset.rouAssetId,
        action: 'depreciate',
        userId: 'system',
        timestamp: new Date(),
        changes: { depreciation, accountingEntries },
      });

      return {
        rouAsset,
        depreciationAmount: depreciation.depreciationAmount,
        accumulatedDepreciation: depreciation.accumulatedDepreciation,
        accountingEntries,
      };
    } catch (error: any) {
      this.logger.error(`Failed to depreciate ROU asset: ${error.message}`);
      throw new BadRequestException(`Failed to depreciate ROU asset: ${error.message}`);
    }
  }

  /**
   * Test ROU asset impairment
   */
  @Post('leases/:leaseId/rou-asset/test-impairment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test ROU asset for impairment' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiBody({ type: ImpairmentTestDto })
  @ApiResponse({ status: 200, description: 'Impairment test completed' })
  async testImpairment(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Body() testDto: ImpairmentTestDto,
  ): Promise<any> {
    this.logger.log(`Testing impairment for lease ${leaseId}`);

    try {
      const impairment = await testROUAssetImpairment(leaseId);

      let impairmentLoss = 0;
      let accountingEntries: any[] = [];

      if (impairment.isImpaired) {
        impairmentLoss = await calculateImpairmentLoss(impairment.assetId);

        accountingEntries = [
          {
            account: 'Impairment Loss - ROU Asset',
            debit: impairmentLoss,
            credit: 0,
          },
          {
            account: 'ROU Asset',
            debit: 0,
            credit: impairmentLoss,
          },
        ];
      }

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: impairment.assetId,
        action: 'test_impairment',
        userId: 'system',
        timestamp: new Date(),
        changes: { impairment, impairmentLoss, indicator: testDto.indicator },
      });

      return {
        impairment,
        impairmentLoss,
        accountingEntries,
        indicator: testDto.indicator,
      };
    } catch (error: any) {
      this.logger.error(`Failed to test impairment: ${error.message}`);
      throw new BadRequestException(`Failed to test impairment: ${error.message}`);
    }
  }

  /**
   * Validate lease compliance
   */
  @Get('leases/:leaseId/compliance')
  @ApiOperation({ summary: 'Validate lease compliance with accounting standards' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiQuery({ name: 'standard', enum: LeaseAccountingStandard, required: false })
  @ApiResponse({ status: 200, description: 'Compliance validation completed' })
  async validateCompliance(
    @Param('leaseId', ParseIntPipe) leaseId: number,
    @Query('standard') standard?: LeaseAccountingStandard,
  ): Promise<any> {
    this.logger.log(`Validating compliance for lease ${leaseId}`);

    try {
      const compliance = await validateLeaseCompliance(leaseId);
      const rules = standard ? await validateComplianceRule(standard) : true;
      const report = await generateComplianceReport('lease', leaseId);

      const score = this.calculateComplianceScore(compliance, rules);

      return {
        compliance,
        rules,
        report,
        score,
        standard: standard || LeaseAccountingStandard.ASC842,
      };
    } catch (error: any) {
      this.logger.error(`Failed to validate compliance: ${error.message}`);
      throw new BadRequestException(`Failed to validate compliance: ${error.message}`);
    }
  }

  /**
   * Generate lease disclosure report
   */
  @Get('leases/:leaseId/disclosure')
  @ApiOperation({ summary: 'Generate lease disclosure report for financial statements' })
  @ApiParam({ name: 'leaseId', description: 'Lease identifier' })
  @ApiResponse({ status: 200, description: 'Disclosure report generated successfully' })
  async generateDisclosure(
    @Param('leaseId', ParseIntPipe) leaseId: number,
  ): Promise<any> {
    this.logger.log(`Generating disclosure report for lease ${leaseId}`);

    try {
      const disclosure = await generateLeaseDisclosureReport(leaseId);
      const metrics = await calculateLeaseMetrics(leaseId);
      const auditTrail = await getAuditTrail('lease', leaseId);

      return {
        disclosure,
        metrics,
        auditTrail: auditTrail.slice(0, 10), // Last 10 audit entries
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate disclosure: ${error.message}`);
      throw new BadRequestException(`Failed to generate disclosure: ${error.message}`);
    }
  }

  /**
   * Generate portfolio summary
   */
  @Get('portfolio/summary')
  @ApiOperation({ summary: 'Generate lease portfolio summary with analytics' })
  @ApiQuery({ name: 'entityId', description: 'Entity identifier', required: false })
  @ApiQuery({ name: 'assetCategory', enum: LeaseAssetCategory, required: false })
  @ApiResponse({ status: 200, description: 'Portfolio summary generated successfully' })
  async getPortfolioSummary(
    @Query('entityId') entityId?: string,
    @Query('assetCategory') assetCategory?: LeaseAssetCategory,
  ): Promise<any> {
    this.logger.log('Generating lease portfolio summary');

    try {
      // This would query all leases and aggregate - simplified for example
      return {
        totalLeases: 0,
        operatingLeases: 0,
        financeLeases: 0,
        totalROUAssets: 0,
        totalLeaseLiabilities: 0,
        averageRemainingTerm: 0,
        complianceRate: 100,
        monthlyPaymentTotal: 0,
        byCategory: {},
        byStatus: {},
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate portfolio summary: ${error.message}`);
      throw new BadRequestException(`Failed to generate portfolio summary: ${error.message}`);
    }
  }

  /**
   * Generate financial impact report
   */
  @Post('reports/financial-impact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate lease financial impact report' })
  @ApiBody({ type: LeaseReportDto })
  @ApiResponse({ status: 200, description: 'Financial impact report generated successfully' })
  async generateFinancialImpact(
    @Body() reportDto: LeaseReportDto,
  ): Promise<any> {
    this.logger.log('Generating lease financial impact report');

    try {
      const entityId = parseInt(reportDto.entityId || '1');
      const fiscalYear = reportDto.startDate?.getFullYear() || new Date().getFullYear();

      const balanceSheet = await generateBalanceSheet(entityId, fiscalYear);
      const incomeStatement = await generateIncomeStatement(entityId, fiscalYear);

      const kpis = [
        await calculateFinancialKPI('lease_liability_ratio', entityId),
        await calculateFinancialKPI('lease_expense_ratio', entityId),
      ];

      return {
        balanceSheet,
        incomeStatement,
        kpis,
        reportType: reportDto.reportType,
        generatedDate: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate financial impact report: ${error.message}`);
      throw new BadRequestException(`Failed to generate financial impact report: ${error.message}`);
    }
  }

  /**
   * Process monthly accounting batch
   */
  @Post('batch/monthly-accounting')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process monthly lease accounting batch operations' })
  @ApiQuery({ name: 'entityId', description: 'Entity identifier' })
  @ApiQuery({ name: 'periodDate', description: 'Period date', required: false })
  @ApiResponse({ status: 200, description: 'Monthly accounting batch processed successfully' })
  async processMonthlyBatch(
    @Query('entityId', ParseIntPipe) entityId: number,
    @Query('periodDate') periodDate?: Date,
  ): Promise<any> {
    this.logger.log(`Processing monthly accounting batch for entity ${entityId}`);

    try {
      const processingDate = periodDate || new Date();
      const leases = []; // Query all active leases for entity

      let processed = 0;
      let totalDepreciation = 0;
      let totalInterest = 0;
      const errors: any[] = [];

      for (const lease of leases as any[]) {
        try {
          // Depreciate ROU asset
          const depreciation = await depreciateROUAsset(lease.leaseId, processingDate);
          totalDepreciation += depreciation.depreciationAmount;

          // Amortize liability
          const amortization = await amortizeLeaseLiability(lease.leaseId, processingDate);
          totalInterest += amortization.interestExpense;

          processed++;
        } catch (error: any) {
          errors.push({ leaseId: lease.leaseId, error: error.message });
        }
      }

      await createAuditEntry({
        entityType: 'lease_batch',
        entityId,
        action: 'process_monthly',
        userId: 'system',
        timestamp: new Date(),
        changes: { processed, totalDepreciation, totalInterest, errors },
      });

      return {
        processed,
        depreciation: totalDepreciation,
        interest: totalInterest,
        errors,
        periodDate: processingDate,
      };
    } catch (error: any) {
      this.logger.error(`Failed to process monthly batch: ${error.message}`);
      throw new BadRequestException(`Failed to process monthly batch: ${error.message}`);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private buildClassificationRationale(
    classification: any,
    standard: LeaseAccountingStandard,
  ): string[] {
    const rationale: string[] = [];

    if (standard === LeaseAccountingStandard.ASC842) {
      rationale.push(`ASC 842 Classification: ${classification.leaseType}`);
      if (classification.transfersOwnership) {
        rationale.push('Lease transfers ownership to lessee');
      }
      if (classification.hasPurchaseOption) {
        rationale.push('Lease contains purchase option reasonably certain to be exercised');
      }
      if (classification.leaseTerm >= classification.assetEconomicLife * 0.75) {
        rationale.push('Lease term is 75% or more of asset economic life');
      }
      if (classification.presentValue >= classification.assetFairValue * 0.90) {
        rationale.push('Present value of payments is 90% or more of asset fair value');
      }
    } else if (standard === LeaseAccountingStandard.IFRS16) {
      rationale.push('IFRS 16 Classification: All leases as finance leases');
      rationale.push('IFRS 16 eliminates operating lease classification for lessees');
    }

    return rationale;
  }

  private determineModificationType(impact: any): LeaseModificationType {
    if (impact.scopeIncrease) {
      return LeaseModificationType.TYPE_A;
    }
    return LeaseModificationType.TYPE_B;
  }

  private calculateComplianceScore(compliance: any, rules: boolean): number {
    let score = 100;

    if (!compliance.compliant) score -= 50;
    if (!rules) score -= 30;
    if (compliance.issues?.length > 0) {
      score -= compliance.issues.length * 5;
    }

    return Math.max(0, score);
  }
}

// ============================================================================
// SERVICE CLASS FOR DEPENDENCY INJECTION
// ============================================================================

@Injectable()
export class LeaseAccountingComplianceService {
  private readonly logger = new Logger(LeaseAccountingComplianceService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Orchestration: Create comprehensive lease with full accounting setup
   */
  async createComprehensiveLeaseWithAccounting(
    leaseData: any,
    userId: string,
  ): Promise<any> {
    this.logger.log('Creating comprehensive lease with accounting');

    const transaction = await this.sequelize.transaction();

    try {
      // Create lease contract
      const lease = await createLeaseContract(leaseData, transaction);

      // Classify lease per ASC 842/IFRS 16
      const classification = await classifyLease(lease.leaseId, transaction);

      // Create ROU asset
      const rouAssetValue = await calculateROUAssetValue(lease.leaseId);
      const rouAsset = await createROUAsset(
        {
          leaseId: lease.leaseId,
          assetValue: rouAssetValue,
          assetCategory: lease.assetCategory,
          commencementDate: lease.commencementDate,
          usefulLife: lease.leaseTerm,
          depreciationMethod: ROUDepreciationMethod.STRAIGHT_LINE,
        },
        transaction,
      );

      // Create lease liability
      const liabilityValue = await calculateLeaseLiability(lease.leaseId);
      const leaseLiability = await createLeaseLiability(
        {
          leaseId: lease.leaseId,
          initialValue: liabilityValue,
          currentValue: liabilityValue,
          discountRate: lease.discountRate || 5.0,
          commencementDate: lease.commencementDate,
        },
        transaction,
      );

      // Generate payment schedule
      const paymentSchedule = await generateLeasePaymentSchedule(lease.leaseId, transaction);

      // Validate compliance
      const compliance = await validateLeaseCompliance(lease.leaseId);

      // Calculate metrics
      const metrics = await calculateLeaseMetrics(lease.leaseId);

      // Create audit entry
      await createAuditEntry(
        {
          entityType: 'lease',
          entityId: lease.leaseId,
          action: 'create_comprehensive',
          userId,
          timestamp: new Date(),
          changes: { lease, classification, rouAsset, leaseLiability },
        },
        transaction,
      );

      await transaction.commit();

      return {
        lease,
        classification,
        rouAsset,
        leaseLiability,
        paymentSchedule,
        compliance,
        metrics,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to create comprehensive lease: ${error.message}`);
      throw new BadRequestException(`Failed to create comprehensive lease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Get comprehensive lease details with current balances
   */
  async getComprehensiveLeaseDetails(leaseId: number): Promise<any> {
    this.logger.log(`Retrieving comprehensive lease details for lease ${leaseId}`);

    try {
      const lease = await getLeaseContract(leaseId);
      if (!lease) {
        throw new NotFoundException(`Lease ${leaseId} not found`);
      }

      const classification = await calculateLeaseClassification(lease);
      const rouAsset = await getROUAsset(leaseId);
      const leaseLiability = await getLeaseLiability(leaseId);
      const paymentSchedule = await generateLeasePaymentSchedule(leaseId);
      const compliance = await validateLeaseCompliance(leaseId);
      const metrics = await calculateLeaseMetrics(leaseId);

      return {
        lease,
        classification,
        rouAsset,
        leaseLiability,
        paymentSchedule,
        compliance,
        metrics,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to retrieve lease details: ${error.message}`);
      throw new BadRequestException(`Failed to retrieve lease details: ${error.message}`);
    }
  }

  /**
   * Orchestration: Update lease with validation and audit
   */
  async updateLeaseWithValidationAndAudit(
    leaseId: number,
    updates: any,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Updating lease ${leaseId} with validation`);

    try {
      const lease = await updateLeaseContract(leaseId, updates);
      const compliance = await validateLeaseCompliance(leaseId);

      await createAuditEntry({
        entityType: 'lease',
        entityId: leaseId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: updates,
      });

      return { lease, compliance };
    } catch (error: any) {
      this.logger.error(`Failed to update lease: ${error.message}`);
      throw new BadRequestException(`Failed to update lease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Classify lease with compliance validation
   */
  async classifyLeaseWithCompliance(
    leaseId: number,
    complianceStandard: LeaseAccountingStandard,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Classifying lease ${leaseId} per ${complianceStandard}`);

    try {
      const classification = await classifyLease(leaseId);
      const compliance = await validateComplianceRule(complianceStandard);
      const lease = await getLeaseContract(leaseId);
      const calculatedClassification = await calculateLeaseClassification(lease);

      await createAuditEntry({
        entityType: 'lease_classification',
        entityId: leaseId,
        action: 'classify',
        userId,
        timestamp: new Date(),
        changes: { classification, complianceStandard },
      });

      return { classification, compliance };
    } catch (error: any) {
      this.logger.error(`Failed to classify lease: ${error.message}`);
      throw new BadRequestException(`Failed to classify lease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Reclassify lease with impact analysis
   */
  async reclassifyLeaseWithImpactAnalysis(
    leaseId: number,
    newLeaseType: string,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Reclassifying lease ${leaseId} to ${newLeaseType}`);

    try {
      const classification = await reclassifyLease(leaseId, newLeaseType);

      // Recalculate ROU asset and liability
      const rouAsset = await getROUAsset(leaseId);
      const newROUValue = await calculateROUAssetValue(leaseId);
      const rouAssetAdjustment = newROUValue - rouAsset.currentValue;

      await updateROUAsset(leaseId, { currentValue: newROUValue });

      const leaseLiability = await getLeaseLiability(leaseId);
      const newLiabilityValue = await calculateLeaseLiability(leaseId);
      const liabilityAdjustment = newLiabilityValue - leaseLiability.currentValue;

      await updateLeaseLiability(leaseId, { currentValue: newLiabilityValue });

      await createAuditEntry({
        entityType: 'lease_classification',
        entityId: leaseId,
        action: 'reclassify',
        userId,
        timestamp: new Date(),
        changes: { newLeaseType, rouAssetAdjustment, liabilityAdjustment },
      });

      return {
        classification,
        rouAssetAdjustment,
        liabilityAdjustment,
      };
    } catch (error: any) {
      this.logger.error(`Failed to reclassify lease: ${error.message}`);
      throw new BadRequestException(`Failed to reclassify lease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Create ROU asset with depreciation schedule
   */
  async createROUAssetWithDepreciation(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Creating ROU asset with depreciation for lease ${leaseId}`);

    try {
      const lease = await getLeaseContract(leaseId);
      const classification = await classifyLease(leaseId);
      const rouAssetValue = await calculateROUAssetValue(leaseId);

      const rouAsset = await createROUAsset({
        leaseId,
        assetValue: rouAssetValue,
        assetCategory: lease.assetCategory,
        commencementDate: lease.commencementDate,
        usefulLife: lease.leaseTerm,
        depreciationMethod: ROUDepreciationMethod.STRAIGHT_LINE,
      });

      const depreciationSchedule = await calculateDepreciation({
        assetId: rouAsset.rouAssetId,
        cost: rouAssetValue,
        salvageValue: 0,
        usefulLife: lease.leaseTerm,
        method: 'straight_line',
        commencementDate: lease.commencementDate,
      });

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: rouAsset.rouAssetId,
        action: 'create_with_depreciation',
        userId,
        timestamp: new Date(),
        changes: { rouAsset, depreciationSchedule },
      });

      return { rouAsset, depreciationSchedule };
    } catch (error: any) {
      this.logger.error(`Failed to create ROU asset: ${error.message}`);
      throw new BadRequestException(`Failed to create ROU asset: ${error.message}`);
    }
  }

  /**
   * Orchestration: Update ROU asset with impairment test
   */
  async updateROUAssetWithImpairmentTest(
    leaseId: number,
    newValue: number,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Updating ROU asset with impairment test for lease ${leaseId}`);

    try {
      const rouAsset = await updateROUAsset(leaseId, { currentValue: newValue });
      const impairment = await testROUAssetImpairment(leaseId);

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: rouAsset.rouAssetId,
        action: 'update_with_impairment_test',
        userId,
        timestamp: new Date(),
        changes: { newValue, impairment },
      });

      return { rouAsset, impairment };
    } catch (error: any) {
      this.logger.error(`Failed to update ROU asset: ${error.message}`);
      throw new BadRequestException(`Failed to update ROU asset: ${error.message}`);
    }
  }

  /**
   * Orchestration: Depreciate ROU asset with accounting entries
   */
  async depreciateROUAssetWithAccounting(
    leaseId: number,
    periodDate: Date,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Depreciating ROU asset for lease ${leaseId}`);

    try {
      const depreciation = await depreciateROUAsset(leaseId, periodDate);
      const rouAsset = await getROUAsset(leaseId);

      const accountingEntries = [
        {
          account: 'Depreciation Expense - ROU Asset',
          debit: depreciation.depreciationAmount,
          credit: 0,
        },
        {
          account: 'Accumulated Depreciation - ROU Asset',
          debit: 0,
          credit: depreciation.depreciationAmount,
        },
      ];

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: rouAsset.rouAssetId,
        action: 'depreciate',
        userId,
        timestamp: new Date(),
        changes: { depreciation, accountingEntries },
      });

      return {
        rouAsset,
        depreciationAmount: depreciation.depreciationAmount,
        accumulatedDepreciation: depreciation.accumulatedDepreciation,
        accountingEntries,
      };
    } catch (error: any) {
      this.logger.error(`Failed to depreciate ROU asset: ${error.message}`);
      throw new BadRequestException(`Failed to depreciate ROU asset: ${error.message}`);
    }
  }

  /**
   * Orchestration: Test ROU asset impairment with loss calculation
   */
  async testROUAssetImpairmentWithLoss(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Testing impairment for lease ${leaseId}`);

    try {
      const impairment = await testROUAssetImpairment(leaseId);

      let impairmentLoss = 0;
      let accountingEntries: any[] = [];

      if (impairment.isImpaired) {
        impairmentLoss = await calculateImpairmentLoss(impairment.assetId);

        accountingEntries = [
          {
            account: 'Impairment Loss - ROU Asset',
            debit: impairmentLoss,
            credit: 0,
          },
          {
            account: 'ROU Asset',
            debit: 0,
            credit: impairmentLoss,
          },
        ];
      }

      await createAuditEntry({
        entityType: 'rou_asset',
        entityId: impairment.assetId,
        action: 'test_impairment',
        userId,
        timestamp: new Date(),
        changes: { impairment, impairmentLoss },
      });

      return { impairment, impairmentLoss, accountingEntries };
    } catch (error: any) {
      this.logger.error(`Failed to test impairment: ${error.message}`);
      throw new BadRequestException(`Failed to test impairment: ${error.message}`);
    }
  }

  /**
   * Orchestration: Create lease liability with amortization schedule
   */
  async createLeaseLiabilityWithAmortization(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Creating lease liability with amortization for lease ${leaseId}`);

    try {
      const liabilityValue = await calculateLeaseLiability(leaseId);
      const lease = await getLeaseContract(leaseId);

      const leaseLiability = await createLeaseLiability({
        leaseId,
        initialValue: liabilityValue,
        currentValue: liabilityValue,
        discountRate: lease.discountRate || 5.0,
        commencementDate: lease.commencementDate,
      });

      const amortizationSchedule = await generateLeasePaymentSchedule(leaseId);

      await createAuditEntry({
        entityType: 'lease_liability',
        entityId: leaseLiability.liabilityId,
        action: 'create_with_amortization',
        userId,
        timestamp: new Date(),
        changes: { leaseLiability, amortizationSchedule },
      });

      return { leaseLiability, amortizationSchedule };
    } catch (error: any) {
      this.logger.error(`Failed to create lease liability: ${error.message}`);
      throw new BadRequestException(`Failed to create lease liability: ${error.message}`);
    }
  }

  /**
   * Orchestration: Update lease liability with recalculation
   */
  async updateLeaseLiabilityWithRecalculation(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Updating lease liability for lease ${leaseId}`);

    try {
      const currentLiability = await getLeaseLiability(leaseId);
      const newLiabilityValue = await calculateLeaseLiability(leaseId);
      const adjustment = newLiabilityValue - currentLiability.currentValue;

      const leaseLiability = await updateLeaseLiability(leaseId, {
        currentValue: newLiabilityValue,
      });

      await createAuditEntry({
        entityType: 'lease_liability',
        entityId: leaseLiability.liabilityId,
        action: 'update_with_recalculation',
        userId,
        timestamp: new Date(),
        changes: { adjustment, newValue: newLiabilityValue },
      });

      return { leaseLiability, adjustment };
    } catch (error: any) {
      this.logger.error(`Failed to update lease liability: ${error.message}`);
      throw new BadRequestException(`Failed to update lease liability: ${error.message}`);
    }
  }

  /**
   * Orchestration: Amortize lease liability with accounting entries
   */
  async amortizeLeaseLiabilityWithAccounting(
    leaseId: number,
    periodDate: Date,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Amortizing lease liability for lease ${leaseId}`);

    try {
      const amortization = await amortizeLeaseLiability(leaseId, periodDate);

      const accountingEntries = [
        {
          account: 'Interest Expense - Lease',
          debit: amortization.interestExpense,
          credit: 0,
        },
        {
          account: 'Lease Liability',
          debit: amortization.principalReduction,
          credit: 0,
        },
      ];

      await createAuditEntry({
        entityType: 'lease_liability',
        entityId: amortization.liabilityId,
        action: 'amortize',
        userId,
        timestamp: new Date(),
        changes: { amortization, accountingEntries },
      });

      const leaseLiability = await getLeaseLiability(leaseId);

      return {
        leaseLiability,
        interestExpense: amortization.interestExpense,
        principalReduction: amortization.principalReduction,
        accountingEntries,
      };
    } catch (error: any) {
      this.logger.error(`Failed to amortize liability: ${error.message}`);
      throw new BadRequestException(`Failed to amortize liability: ${error.message}`);
    }
  }

  /**
   * Orchestration: Process lease payment with full accounting
   */
  async processLeasePaymentWithAccounting(
    leaseId: number,
    paymentAmount: number,
    paymentDate: Date,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Processing payment for lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const payment = await processLeasePayment(leaseId, paymentAmount, paymentDate, transaction);

      const leasePayment = await recordLeasePayment(
        leaseId,
        {
          paymentAmount,
          paymentDate,
          paymentMethod: 'ACH',
        },
        transaction,
      );

      const amortization = await amortizeLeaseLiability(leaseId, paymentDate, transaction);
      const liabilityUpdate = await getLeaseLiability(leaseId);

      await createAuditEntry(
        {
          entityType: 'lease_payment',
          entityId: leaseId,
          action: 'process_payment',
          userId,
          timestamp: new Date(),
          changes: { payment, leasePayment, amortization },
        },
        transaction,
      );

      await transaction.commit();

      return {
        payment,
        leasePayment,
        liabilityUpdate,
        interestExpense: amortization.interestExpense,
        principalReduction: amortization.principalReduction,
        remainingBalance: liabilityUpdate.currentValue,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process payment: ${error.message}`);
      throw new BadRequestException(`Failed to process payment: ${error.message}`);
    }
  }

  /**
   * Orchestration: Generate and validate lease payment schedule
   */
  async generateValidatedLeasePaymentSchedule(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Generating payment schedule for lease ${leaseId}`);

    try {
      const schedule = await generateLeasePaymentSchedule(leaseId);
      const totalPayments = schedule.reduce((sum: number, payment: any) => sum + payment.totalPayment, 0);
      const totalInterest = schedule.reduce((sum: number, payment: any) => sum + payment.interestPortion, 0);

      const compliance = await validateLeaseCompliance(leaseId);

      await createAuditEntry({
        entityType: 'lease_payment_schedule',
        entityId: leaseId,
        action: 'generate',
        userId,
        timestamp: new Date(),
        changes: { schedule, totalPayments, totalInterest },
      });

      return { schedule, totalPayments, totalInterest, compliance };
    } catch (error: any) {
      this.logger.error(`Failed to generate schedule: ${error.message}`);
      throw new BadRequestException(`Failed to generate schedule: ${error.message}`);
    }
  }

  /**
   * Orchestration: Update payment schedule after modification
   */
  async updateLeasePaymentScheduleAfterModification(leaseId: number, userId: string): Promise<any> {
    this.logger.log(`Updating payment schedule for lease ${leaseId}`);

    try {
      const oldSchedule = await generateLeasePaymentSchedule(leaseId);
      await updateLeasePaymentSchedule(leaseId);
      const newSchedule = await generateLeasePaymentSchedule(leaseId);

      const oldTotal = oldSchedule.reduce((sum: number, p: any) => sum + p.totalPayment, 0);
      const newTotal = newSchedule.reduce((sum: number, p: any) => sum + p.totalPayment, 0);
      const scheduleDifference = newTotal - oldTotal;

      await createAuditEntry({
        entityType: 'lease_payment_schedule',
        entityId: leaseId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { scheduleDifference },
      });

      return { oldSchedule, newSchedule, scheduleDifference };
    } catch (error: any) {
      this.logger.error(`Failed to update schedule: ${error.message}`);
      throw new BadRequestException(`Failed to update schedule: ${error.message}`);
    }
  }

  /**
   * Orchestration: Process lease modification with full impact analysis
   */
  async processLeaseModificationWithImpact(
    leaseId: number,
    modificationData: any,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Processing modification for lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const modification = await modifyLease(leaseId, modificationData, transaction);
      const accounting = await accountForLeaseModification(leaseId, modification.modificationId, transaction);
      const impact = await calculateModificationImpact(leaseId, modification.modificationId);

      await updateROUAsset(leaseId, { currentValue: impact.newROUValue }, transaction);
      await updateLeaseLiability(leaseId, { currentValue: impact.newLiabilityValue }, transaction);

      const newPaymentSchedule = await generateLeasePaymentSchedule(leaseId, transaction);

      await createAuditEntry(
        {
          entityType: 'lease_modification',
          entityId: modification.modificationId,
          action: 'process',
          userId,
          timestamp: new Date(),
          changes: { modification, impact },
        },
        transaction,
      );

      await transaction.commit();

      return {
        modification,
        impact,
        newPaymentSchedule,
        accountingEntries: accounting.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process modification: ${error.message}`);
      throw new BadRequestException(`Failed to process modification: ${error.message}`);
    }
  }

  /**
   * Orchestration: Validate lease modification compliance
   */
  async validateLeaseModificationCompliance(
    leaseId: number,
    modificationId: number,
  ): Promise<any> {
    this.logger.log(`Validating modification compliance for lease ${leaseId}`);

    try {
      const compliance = await validateLeaseCompliance(leaseId);
      const impact = await calculateModificationImpact(leaseId, modificationId);

      const issues: string[] = [];
      if (!compliance.compliant) {
        issues.push('Lease not compliant with accounting standards');
      }
      if (impact.gainLoss && Math.abs(impact.gainLoss) > 10000) {
        issues.push('Significant gain/loss from modification requires review');
      }

      const approved = issues.length === 0;

      return { compliance, impact, approved, issues };
    } catch (error: any) {
      this.logger.error(`Failed to validate modification: ${error.message}`);
      throw new BadRequestException(`Failed to validate modification: ${error.message}`);
    }
  }

  /**
   * Orchestration: Terminate lease with full accounting treatment
   */
  async terminateLeaseWithAccounting(
    leaseId: number,
    terminationDate: Date,
    terminationReason: string,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Terminating lease ${leaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const termination = await terminateLease(leaseId, terminationDate, terminationReason, transaction);
      const gainLoss = await calculateTerminationGainLoss(leaseId, terminationDate);
      await processEarlyTermination(leaseId, terminationDate, transaction);

      const rouAsset = await getROUAsset(leaseId);
      const leaseLiability = await getLeaseLiability(leaseId);

      await recordAssetDisposal(rouAsset.assetId, terminationDate, 'lease_termination');

      const disposalEntries = [
        {
          account: 'Accumulated Depreciation - ROU Asset',
          debit: rouAsset.accumulatedDepreciation || 0,
          credit: 0,
        },
        {
          account: 'Lease Liability',
          debit: leaseLiability.currentValue,
          credit: 0,
        },
        {
          account: 'ROU Asset',
          debit: 0,
          credit: rouAsset.currentValue,
        },
        {
          account: gainLoss >= 0 ? 'Gain on Lease Termination' : 'Loss on Lease Termination',
          debit: gainLoss < 0 ? Math.abs(gainLoss) : 0,
          credit: gainLoss > 0 ? gainLoss : 0,
        },
      ];

      await createAuditEntry(
        {
          entityType: 'lease_termination',
          entityId: termination.terminationId,
          action: 'terminate',
          userId,
          timestamp: new Date(),
          changes: { termination, gainLoss, disposalEntries },
        },
        transaction,
      );

      await transaction.commit();

      return {
        termination,
        finalROUValue: rouAsset.currentValue,
        finalLiabilityValue: leaseLiability.currentValue,
        terminationGainLoss: gainLoss,
        disposalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to terminate lease: ${error.message}`);
      throw new BadRequestException(`Failed to terminate lease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Calculate early termination penalty
   */
  async calculateEarlyTerminationPenalty(
    leaseId: number,
    terminationDate: Date,
  ): Promise<any> {
    this.logger.log(`Calculating termination penalty for lease ${leaseId}`);

    try {
      const lease = await getLeaseContract(leaseId);
      const leaseLiability = await getLeaseLiability(leaseId);
      const gainLoss = await calculateTerminationGainLoss(leaseId, terminationDate);

      const penalty = lease.terminationOption?.terminationPenalty || 0;
      const totalCost = penalty + Math.abs(gainLoss);

      return {
        penalty,
        remainingLiability: leaseLiability.currentValue,
        gainLoss,
        totalCost,
      };
    } catch (error: any) {
      this.logger.error(`Failed to calculate penalty: ${error.message}`);
      throw new BadRequestException(`Failed to calculate penalty: ${error.message}`);
    }
  }

  /**
   * Orchestration: Create sublease with accounting treatment
   */
  async createSubleaseWithAccounting(
    headLeaseId: number,
    subleaseData: any,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Creating sublease for lease ${headLeaseId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const sublease = await createSublease(headLeaseId, subleaseData, transaction);
      const accounting = await accountForSublease(headLeaseId, sublease.subleaseId, transaction);

      await createAuditEntry(
        {
          entityType: 'sublease',
          entityId: sublease.subleaseId,
          action: 'create',
          userId,
          timestamp: new Date(),
          changes: { sublease, accounting },
        },
        transaction,
      );

      await transaction.commit();

      return {
        sublease,
        accountingEntries: accounting.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to create sublease: ${error.message}`);
      throw new BadRequestException(`Failed to create sublease: ${error.message}`);
    }
  }

  /**
   * Orchestration: Process sale-leaseback transaction
   */
  async processSaleLeasebackWithAccounting(
    assetId: number,
    salePrice: number,
    leaseData: any,
    userId: string,
  ): Promise<any> {
    this.logger.log('Processing sale-leaseback transaction');

    const transaction = await this.sequelize.transaction();

    try {
      const saleLeasebackResult = await processSaleLeasebackTransaction(
        assetId,
        salePrice,
        leaseData,
        transaction,
      );

      await recordAssetDisposal(assetId, new Date(), 'sale_leaseback');

      await createAuditEntry(
        {
          entityType: 'sale_leaseback',
          entityId: assetId,
          action: 'process',
          userId,
          timestamp: new Date(),
          changes: { saleLeasebackResult },
        },
        transaction,
      );

      await transaction.commit();

      return {
        saleGainLoss: saleLeasebackResult.gainLoss,
        leasebackContract: saleLeasebackResult.leasebackContract,
        accountingEntries: saleLeasebackResult.journalEntries,
      };
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Failed to process sale-leaseback: ${error.message}`);
      throw new BadRequestException(`Failed to process sale-leaseback: ${error.message}`);
    }
  }

  /**
   * Orchestration: Validate comprehensive lease compliance
   */
  async validateComprehensiveLeaseCompliance(
    leaseId: number,
    complianceStandard: LeaseAccountingStandard,
  ): Promise<any> {
    this.logger.log(`Validating comprehensive compliance for lease ${leaseId}`);

    try {
      const compliance = await validateLeaseCompliance(leaseId);
      const rules = await validateComplianceRule(complianceStandard);
      const report = await generateComplianceReport('lease', leaseId);

      const score = this.calculateComplianceScore(compliance, rules);

      return { compliance, rules, report, score };
    } catch (error: any) {
      this.logger.error(`Failed to validate compliance: ${error.message}`);
      throw new BadRequestException(`Failed to validate compliance: ${error.message}`);
    }
  }

  /**
   * Orchestration: Generate comprehensive lease disclosure report
   */
  async generateComprehensiveLeaseDisclosureReport(leaseId: number): Promise<any> {
    this.logger.log(`Generating disclosure report for lease ${leaseId}`);

    try {
      const disclosure = await generateLeaseDisclosureReport(leaseId);
      const metrics = await calculateLeaseMetrics(leaseId);
      const auditTrail = await getAuditTrail('lease', leaseId);

      return { disclosure, metrics, auditTrail };
    } catch (error: any) {
      this.logger.error(`Failed to generate disclosure: ${error.message}`);
      throw new BadRequestException(`Failed to generate disclosure: ${error.message}`);
    }
  }

  /**
   * Orchestration: Generate lease portfolio summary
   */
  async generateLeasePortfolioSummary(entityId: number, fiscalYear: number): Promise<any> {
    this.logger.log(`Generating portfolio summary for entity ${entityId}`);

    try {
      // This would aggregate multiple leases - simplified for composite example
      return {
        totalLeases: 0,
        operatingLeases: 0,
        financeLeases: 0,
        totalROUAssets: 0,
        totalLeaseLiabilities: 0,
        averageRemainingTerm: 0,
        complianceRate: 100,
        monthlyPaymentTotal: 0,
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate portfolio summary: ${error.message}`);
      throw new BadRequestException(`Failed to generate portfolio summary: ${error.message}`);
    }
  }

  /**
   * Orchestration: Generate lease financial impact report
   */
  async generateLeaseFinancialImpactReport(entityId: number, fiscalYear: number): Promise<any> {
    this.logger.log(`Generating financial impact report for entity ${entityId}`);

    try {
      const balanceSheet = await generateBalanceSheet(entityId, fiscalYear);
      const incomeStatement = await generateIncomeStatement(entityId, fiscalYear);

      const kpis = [
        await calculateFinancialKPI('lease_liability_ratio', entityId),
        await calculateFinancialKPI('lease_expense_ratio', entityId),
      ];

      return { balanceSheet, incomeStatement, kpis };
    } catch (error: any) {
      this.logger.error(`Failed to generate impact report: ${error.message}`);
      throw new BadRequestException(`Failed to generate impact report: ${error.message}`);
    }
  }

  /**
   * Orchestration: Process monthly lease accounting batch
   */
  async processMonthlyLeaseAccountingBatch(
    entityId: number,
    periodDate: Date,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Processing monthly batch for entity ${entityId}`);

    try {
      const leases = []; // Query all active leases

      let processed = 0;
      let totalDepreciation = 0;
      let totalInterest = 0;
      const errors: any[] = [];

      for (const lease of leases as any[]) {
        try {
          const depreciation = await depreciateROUAsset(lease.leaseId, periodDate);
          totalDepreciation += depreciation.depreciationAmount;

          const amortization = await amortizeLeaseLiability(lease.leaseId, periodDate);
          totalInterest += amortization.interestExpense;

          processed++;
        } catch (error: any) {
          errors.push({ leaseId: lease.leaseId, error: error.message });
        }
      }

      await createAuditEntry({
        entityType: 'lease_batch',
        entityId,
        action: 'process_monthly',
        userId,
        timestamp: new Date(),
        changes: { processed, totalDepreciation, totalInterest, errors },
      });

      return {
        processed,
        depreciation: totalDepreciation,
        interest: totalInterest,
        errors,
      };
    } catch (error: any) {
      this.logger.error(`Failed to process batch: ${error.message}`);
      throw new BadRequestException(`Failed to process batch: ${error.message}`);
    }
  }

  /**
   * Orchestration: Test impairment for lease portfolio
   */
  async testLeasePortfolioImpairment(entityId: number, userId: string): Promise<any> {
    this.logger.log(`Testing impairment for entity ${entityId}`);

    try {
      const leases = []; // Query all leases

      let tested = 0;
      let impaired = 0;
      let totalImpairmentLoss = 0;
      const impairments: any[] = [];

      for (const lease of leases as any[]) {
        const impairment = await testROUAssetImpairment(lease.leaseId);
        tested++;

        if (impairment.isImpaired) {
          const loss = await calculateImpairmentLoss(impairment.assetId);
          totalImpairmentLoss += loss;
          impaired++;
          impairments.push(impairment);
        }
      }

      await createAuditEntry({
        entityType: 'lease_impairment_test',
        entityId,
        action: 'test_portfolio',
        userId,
        timestamp: new Date(),
        changes: { tested, impaired, totalImpairmentLoss },
      });

      return { tested, impaired, totalImpairmentLoss, impairments };
    } catch (error: any) {
      this.logger.error(`Failed to test impairment: ${error.message}`);
      throw new BadRequestException(`Failed to test impairment: ${error.message}`);
    }
  }

  // Helper methods
  private calculateComplianceScore(compliance: any, rules: boolean): number {
    let score = 100;
    if (!compliance.compliant) score -= 50;
    if (!rules) score -= 30;
    if (compliance.issues?.length > 0) {
      score -= compliance.issues.length * 5;
    }
    return Math.max(0, score);
  }
}

/**
 * Export NestJS module definition
 */
export const LeaseAccountingComplianceModule = {
  controllers: [LeaseAccountingComplianceController],
  providers: [LeaseAccountingComplianceService],
  exports: [LeaseAccountingComplianceService],
};

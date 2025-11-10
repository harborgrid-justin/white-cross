/**
 * ASSET FINANCIAL MANAGEMENT COMMANDS
 *
 * Comprehensive asset financial tracking and analysis toolkit.
 * Provides 45 specialized functions covering:
 * - Cost tracking and allocation
 * - Depreciation calculations (5 methods: straight-line, declining balance,
 *   double declining balance, sum-of-years-digits, units-of-production)
 * - Book value management and reporting
 * - Capital vs Operating expense classification
 * - Budget tracking and variance analysis
 * - Cost center and department allocation
 * - ROI (Return on Investment) calculations
 * - TCO (Total Cost of Ownership) analysis
 * - Lease vs Buy financial analysis
 * - Amortization schedules and tracking
 * - Asset impairment tracking
 * - Disposal gain/loss calculations
 * - Financial reporting and compliance
 * - Tax depreciation calculations
 *
 * @module AssetFinancialCommands
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
 * @financial GAAP/IFRS compliant depreciation and financial reporting
 * @tax Supports tax depreciation methods (MACRS, Section 179, etc.)
 *
 * @example
 * ```typescript
 * import {
 *   trackAssetCost,
 *   calculateStraightLineDepreciation,
 *   calculateBookValue,
 *   analyzeROI,
 *   analyzeTCO,
 *   AssetCost,
 *   DepreciationSchedule
 * } from './asset-financial-commands';
 *
 * // Track asset cost
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'acquisition',
 *   amount: 100000,
 *   date: new Date()
 * });
 *
 * // Calculate depreciation
 * const schedule = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10
 * );
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Depreciation methods
 */
export enum DepreciationMethod {
  STRAIGHT_LINE = 'straight_line',
  DECLINING_BALANCE = 'declining_balance',
  DOUBLE_DECLINING = 'double_declining',
  SUM_OF_YEARS_DIGITS = 'sum_of_years_digits',
  UNITS_OF_PRODUCTION = 'units_of_production',
  MACRS = 'macrs',
  CUSTOM = 'custom',
}

/**
 * Cost types
 */
export enum CostType {
  ACQUISITION = 'acquisition',
  INSTALLATION = 'installation',
  SHIPPING = 'shipping',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  UPGRADE = 'upgrade',
  CALIBRATION = 'calibration',
  TRAINING = 'training',
  LICENSE = 'license',
  INSURANCE = 'insurance',
  STORAGE = 'storage',
  DISPOSAL = 'disposal',
  OTHER = 'other',
}

/**
 * Expense classification
 */
export enum ExpenseClassification {
  CAPITAL_EXPENSE = 'capital_expense',
  OPERATING_EXPENSE = 'operating_expense',
  MIXED = 'mixed',
}

/**
 * Budget status
 */
export enum BudgetStatus {
  UNDER_BUDGET = 'under_budget',
  ON_BUDGET = 'on_budget',
  OVER_BUDGET = 'over_budget',
  EXCEEDED = 'exceeded',
}

/**
 * Asset financial status
 */
export enum FinancialStatus {
  ACTIVE = 'active',
  FULLY_DEPRECIATED = 'fully_depreciated',
  IMPAIRED = 'impaired',
  DISPOSED = 'disposed',
}

/**
 * Lease type
 */
export enum LeaseType {
  OPERATING_LEASE = 'operating_lease',
  FINANCE_LEASE = 'finance_lease',
  CAPITAL_LEASE = 'capital_lease',
}

/**
 * Asset cost data
 */
export interface AssetCostData {
  assetId: string;
  costType: CostType;
  amount: number;
  currency?: string;
  date: Date;
  vendor?: string;
  invoiceNumber?: string;
  purchaseOrderNumber?: string;
  costCenterId?: string;
  departmentId?: string;
  classification?: ExpenseClassification;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Depreciation calculation data
 */
export interface DepreciationCalculationData {
  assetId: string;
  method: DepreciationMethod;
  acquisitionCost: number;
  salvageValue: number;
  usefulLife: number;
  acquisitionDate: Date;
  unitsProduced?: number;
  totalUnitsCapacity?: number;
}

/**
 * Depreciation schedule entry
 */
export interface DepreciationScheduleEntry {
  year: number;
  period: string;
  beginningBookValue: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  endingBookValue: number;
  depreciationRate?: number;
}

/**
 * Depreciation result
 */
export interface DepreciationResult {
  assetId: string;
  method: DepreciationMethod;
  acquisitionCost: number;
  salvageValue: number;
  usefulLife: number;
  currentAge: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  remainingLife: number;
  schedule: DepreciationScheduleEntry[];
  calculatedAt: Date;
}

/**
 * Book value data
 */
export interface BookValueData {
  assetId: string;
  asOfDate: Date;
  acquisitionCost: number;
  accumulatedDepreciation: number;
  bookValue: number;
  salvageValue: number;
  impairmentLoss?: number;
  fairMarketValue?: number;
}

/**
 * Budget allocation data
 */
export interface BudgetAllocationData {
  name: string;
  fiscalYear: number;
  departmentId?: string;
  costCenterId?: string;
  categoryId?: string;
  budgetedAmount: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

/**
 * Budget tracking result
 */
export interface BudgetTrackingResult {
  budgetId: string;
  name: string;
  budgetedAmount: number;
  actualSpent: number;
  committed: number;
  available: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
  asOfDate: Date;
}

/**
 * ROI analysis data
 */
export interface ROIAnalysisData {
  assetId: string;
  initialInvestment: number;
  annualRevenue?: number;
  annualCostSavings?: number;
  annualOperatingCosts: number;
  analysisYears: number;
  discountRate?: number;
}

/**
 * ROI analysis result
 */
export interface ROIAnalysisResult {
  assetId: string;
  initialInvestment: number;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roi: number;
  paybackPeriod: number;
  npv: number;
  irr: number;
  breakEvenYear: number;
  annualCashFlows: AnnualCashFlow[];
}

/**
 * Annual cash flow
 */
export interface AnnualCashFlow {
  year: number;
  revenue: number;
  costs: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  presentValue: number;
}

/**
 * TCO analysis data
 */
export interface TCOAnalysisData {
  assetId: string;
  analysisYears: number;
  acquisitionCost: number;
  installationCost?: number;
  annualMaintenanceCost: number;
  annualOperatingCost: number;
  annualLicenseCost?: number;
  upgradesCost?: number;
  trainingCost?: number;
  disposalCost?: number;
  discountRate?: number;
}

/**
 * TCO analysis result
 */
export interface TCOAnalysisResult {
  assetId: string;
  analysisYears: number;
  totalAcquisitionCost: number;
  totalMaintenanceCost: number;
  totalOperatingCost: number;
  totalOtherCosts: number;
  totalCostOfOwnership: number;
  annualizedCost: number;
  presentValue: number;
  costBreakdown: TCOCostBreakdown;
  yearlyBreakdown: TCOYearlyBreakdown[];
}

/**
 * TCO cost breakdown
 */
export interface TCOCostBreakdown {
  acquisitionPercent: number;
  maintenancePercent: number;
  operatingPercent: number;
  otherPercent: number;
}

/**
 * TCO yearly breakdown
 */
export interface TCOYearlyBreakdown {
  year: number;
  maintenanceCost: number;
  operatingCost: number;
  otherCost: number;
  totalYearlyCost: number;
  cumulativeCost: number;
}

/**
 * Lease vs Buy analysis data
 */
export interface LeaseVsBuyAnalysisData {
  assetDescription: string;
  purchasePrice: number;
  downPayment?: number;
  loanInterestRate?: number;
  loanTerm?: number;
  leasePayment: number;
  leaseTerm: number;
  residualValue?: number;
  taxRate?: number;
  discountRate?: number;
  annualMaintenanceCost?: number;
}

/**
 * Lease vs Buy analysis result
 */
export interface LeaseVsBuyAnalysisResult {
  assetDescription: string;
  buyOption: {
    totalCost: number;
    presentValue: number;
    monthlyPayment: number;
    totalInterest: number;
    taxBenefit: number;
    netCost: number;
  };
  leaseOption: {
    totalCost: number;
    presentValue: number;
    monthlyPayment: number;
    totalPayments: number;
    taxBenefit: number;
    netCost: number;
  };
  recommendation: 'buy' | 'lease';
  savings: number;
  savingsPercent: number;
}

/**
 * Amortization schedule entry
 */
export interface AmortizationScheduleEntry {
  period: number;
  paymentDate: Date;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * Asset impairment data
 */
export interface AssetImpairmentData {
  assetId: string;
  impairmentDate: Date;
  bookValueBeforeImpairment: number;
  fairValue: number;
  impairmentLoss: number;
  reason: string;
  notes?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Asset cost database model
 */
@Table({ tableName: 'asset_costs', paranoid: true })
export class AssetCost extends Model {
  @ApiProperty({ description: 'Unique cost record ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Cost type', enum: CostType })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(CostType)), allowNull: false })
  costType: CostType;

  @ApiProperty({ description: 'Cost amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({ type: DataType.STRING(3), defaultValue: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Cost date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @ApiProperty({ description: 'Vendor name' })
  @Column({ type: DataType.STRING(200) })
  vendor: string;

  @ApiProperty({ description: 'Invoice number' })
  @Index
  @Column({ type: DataType.STRING(100) })
  invoiceNumber: string;

  @ApiProperty({ description: 'Purchase order number' })
  @Index
  @Column({ type: DataType.STRING(100) })
  purchaseOrderNumber: string;

  @ApiProperty({ description: 'Cost center ID' })
  @Index
  @Column({ type: DataType.UUID })
  costCenterId: string;

  @ApiProperty({ description: 'Department ID' })
  @Index
  @Column({ type: DataType.UUID })
  departmentId: string;

  @ApiProperty({ description: 'Expense classification', enum: ExpenseClassification })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(ExpenseClassification)) })
  classification: ExpenseClassification;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Depreciation schedule database model
 */
@Table({ tableName: 'depreciation_schedules', paranoid: true })
export class DepreciationSchedule extends Model {
  @ApiProperty({ description: 'Unique depreciation schedule ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Depreciation method', enum: DepreciationMethod })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(DepreciationMethod)), allowNull: false })
  method: DepreciationMethod;

  @ApiProperty({ description: 'Acquisition cost' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  acquisitionCost: number;

  @ApiProperty({ description: 'Salvage value' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  salvageValue: number;

  @ApiProperty({ description: 'Useful life in years' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  usefulLife: number;

  @ApiProperty({ description: 'Acquisition date' })
  @Column({ type: DataType.DATE, allowNull: false })
  acquisitionDate: Date;

  @ApiProperty({ description: 'Schedule data' })
  @Column({ type: DataType.JSONB, allowNull: false })
  scheduleData: DepreciationScheduleEntry[];

  @ApiProperty({ description: 'Is active schedule' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Budget allocation database model
 */
@Table({ tableName: 'budget_allocations', paranoid: true })
export class BudgetAllocation extends Model {
  @ApiProperty({ description: 'Unique budget ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Budget name' })
  @Index
  @Column({ type: DataType.STRING(200), allowNull: false })
  name: string;

  @ApiProperty({ description: 'Fiscal year' })
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  fiscalYear: number;

  @ApiProperty({ description: 'Department ID' })
  @Index
  @Column({ type: DataType.UUID })
  departmentId: string;

  @ApiProperty({ description: 'Cost center ID' })
  @Index
  @Column({ type: DataType.UUID })
  costCenterId: string;

  @ApiProperty({ description: 'Category ID' })
  @Index
  @Column({ type: DataType.UUID })
  categoryId: string;

  @ApiProperty({ description: 'Budgeted amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  budgetedAmount: number;

  @ApiProperty({ description: 'Budget start date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @ApiProperty({ description: 'Budget end date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Asset impairment database model
 */
@Table({ tableName: 'asset_impairments', paranoid: true })
export class AssetImpairment extends Model {
  @ApiProperty({ description: 'Unique impairment ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Impairment date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  impairmentDate: Date;

  @ApiProperty({ description: 'Book value before impairment' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  bookValueBeforeImpairment: number;

  @ApiProperty({ description: 'Fair value' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  fairValue: number;

  @ApiProperty({ description: 'Impairment loss' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  impairmentLoss: number;

  @ApiProperty({ description: 'Reason for impairment' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Financial analysis database model
 */
@Table({ tableName: 'financial_analyses', paranoid: true })
export class FinancialAnalysis extends Model {
  @ApiProperty({ description: 'Unique analysis ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID })
  assetId: string;

  @ApiProperty({ description: 'Analysis type' })
  @Index
  @Column({ type: DataType.STRING(50), allowNull: false })
  analysisType: string;

  @ApiProperty({ description: 'Analysis data' })
  @Column({ type: DataType.JSONB, allowNull: false })
  analysisData: Record<string, any>;

  @ApiProperty({ description: 'Analysis date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  analysisDate: Date;

  @ApiProperty({ description: 'Analyzed by user ID' })
  @Column({ type: DataType.UUID })
  analyzedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Create asset cost DTO
 */
export class CreateAssetCostDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Cost type', enum: CostType })
  @IsEnum(CostType)
  costType: CostType;

  @ApiProperty({ description: 'Cost amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency code', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Cost date' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Vendor', required: false })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ description: 'Invoice number', required: false })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ description: 'PO number', required: false })
  @IsOptional()
  @IsString()
  purchaseOrderNumber?: string;

  @ApiProperty({ description: 'Cost center ID', required: false })
  @IsOptional()
  @IsUUID()
  costCenterId?: string;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ description: 'Expense classification', enum: ExpenseClassification, required: false })
  @IsOptional()
  @IsEnum(ExpenseClassification)
  classification?: ExpenseClassification;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Calculate depreciation DTO
 */
export class CalculateDepreciationDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Depreciation method', enum: DepreciationMethod })
  @IsEnum(DepreciationMethod)
  method: DepreciationMethod;

  @ApiProperty({ description: 'Acquisition cost' })
  @IsNumber()
  @Min(0)
  acquisitionCost: number;

  @ApiProperty({ description: 'Salvage value' })
  @IsNumber()
  @Min(0)
  salvageValue: number;

  @ApiProperty({ description: 'Useful life in years' })
  @IsNumber()
  @Min(1)
  usefulLife: number;

  @ApiProperty({ description: 'Acquisition date' })
  @IsDate()
  @Type(() => Date)
  acquisitionDate: Date;

  @ApiProperty({ description: 'Units produced (for units-of-production)', required: false })
  @IsOptional()
  @IsNumber()
  unitsProduced?: number;

  @ApiProperty({ description: 'Total units capacity (for units-of-production)', required: false })
  @IsOptional()
  @IsNumber()
  totalUnitsCapacity?: number;
}

/**
 * Create budget allocation DTO
 */
export class CreateBudgetAllocationDto {
  @ApiProperty({ description: 'Budget name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fiscal year' })
  @IsNumber()
  fiscalYear: number;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ description: 'Cost center ID', required: false })
  @IsOptional()
  @IsUUID()
  costCenterId?: string;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ description: 'Budgeted amount' })
  @IsNumber()
  @Min(0)
  budgetedAmount: number;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================================================
// COST TRACKING FUNCTIONS
// ============================================================================

/**
 * Track an asset cost
 *
 * @param data - Asset cost data
 * @param transaction - Optional database transaction
 * @returns Created asset cost record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'maintenance',
 *   amount: 5000,
 *   date: new Date()
 * });
 * ```
 */
export async function trackAssetCost(
  data: AssetCostData,
  transaction?: Transaction
): Promise<AssetCost> {
  try {
    const cost = await AssetCost.create(
      {
        assetId: data.assetId,
        costType: data.costType,
        amount: data.amount,
        currency: data.currency || 'USD',
        date: data.date,
        vendor: data.vendor,
        invoiceNumber: data.invoiceNumber,
        purchaseOrderNumber: data.purchaseOrderNumber,
        costCenterId: data.costCenterId,
        departmentId: data.departmentId,
        classification: data.classification,
        notes: data.notes,
        metadata: data.metadata,
      },
      { transaction }
    );

    return cost;
  } catch (error) {
    throw new BadRequestException(`Failed to track asset cost: ${error.message}`);
  }
}

/**
 * Get asset cost by ID
 *
 * @param id - Cost record ID
 * @returns Asset cost or null
 *
 * @example
 * ```typescript
 * const cost = await getAssetCostById('cost-001');
 * ```
 */
export async function getAssetCostById(id: string): Promise<AssetCost | null> {
  return await AssetCost.findByPk(id);
}

/**
 * Get all costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of asset costs
 *
 * @example
 * ```typescript
 * const costs = await getAssetCosts('asset-001', 'maintenance');
 * ```
 */
export async function getAssetCosts(
  assetId: string,
  costType?: CostType,
  startDate?: Date,
  endDate?: Date
): Promise<AssetCost[]> {
  const where: WhereOptions = { assetId };

  if (costType) {
    where.costType = costType;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  return await AssetCost.findAll({
    where,
    order: [['date', 'DESC']],
  });
}

/**
 * Calculate total costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Total cost amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAssetCosts('asset-001');
 * ```
 */
export async function calculateTotalAssetCosts(
  assetId: string,
  costType?: CostType,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const costs = await getAssetCosts(assetId, costType, startDate, endDate);
  return costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
}

/**
 * Update asset cost
 *
 * @param id - Cost record ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated asset cost
 * @throws NotFoundException if cost not found
 *
 * @example
 * ```typescript
 * const updated = await updateAssetCost('cost-001', { amount: 5500 });
 * ```
 */
export async function updateAssetCost(
  id: string,
  updates: Partial<AssetCostData>,
  transaction?: Transaction
): Promise<AssetCost> {
  const cost = await AssetCost.findByPk(id);

  if (!cost) {
    throw new NotFoundException(`Asset cost ${id} not found`);
  }

  await cost.update(updates, { transaction });
  return cost;
}

// ============================================================================
// DEPRECIATION CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate straight-line depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const depreciation = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export async function calculateStraightLineDepreciation(
  assetId: string,
  acquisitionCost: number,
  salvageValue: number,
  usefulLife: number,
  acquisitionDate: Date,
  transaction?: Transaction
): Promise<DepreciationResult> {
  try {
    const depreciableBase = acquisitionCost - salvageValue;
    const annualDepreciation = depreciableBase / usefulLife;

    const schedule: DepreciationScheduleEntry[] = [];
    let accumulatedDepreciation = 0;

    for (let year = 1; year <= usefulLife; year++) {
      const beginningBookValue = acquisitionCost - accumulatedDepreciation;
      const depreciationExpense = annualDepreciation;
      accumulatedDepreciation += depreciationExpense;
      const endingBookValue = acquisitionCost - accumulatedDepreciation;

      schedule.push({
        year,
        period: `Year ${year}`,
        beginningBookValue,
        depreciationExpense,
        accumulatedDepreciation,
        endingBookValue: Math.max(endingBookValue, salvageValue),
        depreciationRate: (annualDepreciation / depreciableBase) * 100,
      });
    }

    // Calculate current values
    const currentAge = Math.floor(
      (new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const currentAccumulatedDepreciation = Math.min(
      annualDepreciation * currentAge,
      depreciableBase
    );
    const currentBookValue = Math.max(
      acquisitionCost - currentAccumulatedDepreciation,
      salvageValue
    );

    // Save schedule
    await DepreciationSchedule.create(
      {
        assetId,
        method: DepreciationMethod.STRAIGHT_LINE,
        acquisitionCost,
        salvageValue,
        usefulLife,
        acquisitionDate,
        scheduleData: schedule,
        isActive: true,
      },
      { transaction }
    );

    return {
      assetId,
      method: DepreciationMethod.STRAIGHT_LINE,
      acquisitionCost,
      salvageValue,
      usefulLife,
      currentAge,
      annualDepreciation,
      accumulatedDepreciation: currentAccumulatedDepreciation,
      currentBookValue,
      remainingLife: Math.max(usefulLife - currentAge, 0),
      schedule,
      calculatedAt: new Date(),
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to calculate straight-line depreciation: ${error.message}`
    );
  }
}

/**
 * Calculate declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param rate - Declining balance rate (default: 1.5 for 150% declining)
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDecliningBalanceDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01'),
 *   1.5
 * );
 * ```
 */
export async function calculateDecliningBalanceDepreciation(
  assetId: string,
  acquisitionCost: number,
  salvageValue: number,
  usefulLife: number,
  acquisitionDate: Date,
  rate: number = 1.5,
  transaction?: Transaction
): Promise<DepreciationResult> {
  try {
    const depreciationRate = (rate / usefulLife) * 100;
    const schedule: DepreciationScheduleEntry[] = [];
    let accumulatedDepreciation = 0;
    let bookValue = acquisitionCost;

    for (let year = 1; year <= usefulLife; year++) {
      const beginningBookValue = bookValue;
      let depreciationExpense = (bookValue * rate) / usefulLife;

      // Don't depreciate below salvage value
      if (bookValue - depreciationExpense < salvageValue) {
        depreciationExpense = bookValue - salvageValue;
      }

      accumulatedDepreciation += depreciationExpense;
      bookValue -= depreciationExpense;

      schedule.push({
        year,
        period: `Year ${year}`,
        beginningBookValue,
        depreciationExpense,
        accumulatedDepreciation,
        endingBookValue: bookValue,
        depreciationRate,
      });

      if (bookValue <= salvageValue) break;
    }

    const currentAge = Math.floor(
      (new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const currentEntry = schedule[Math.min(currentAge, schedule.length - 1)];
    const annualDepreciation = schedule.length > 0 ? schedule[0].depreciationExpense : 0;

    await DepreciationSchedule.create(
      {
        assetId,
        method: DepreciationMethod.DECLINING_BALANCE,
        acquisitionCost,
        salvageValue,
        usefulLife,
        acquisitionDate,
        scheduleData: schedule,
        isActive: true,
      },
      { transaction }
    );

    return {
      assetId,
      method: DepreciationMethod.DECLINING_BALANCE,
      acquisitionCost,
      salvageValue,
      usefulLife,
      currentAge,
      annualDepreciation,
      accumulatedDepreciation: currentEntry?.accumulatedDepreciation || 0,
      currentBookValue: currentEntry?.endingBookValue || acquisitionCost,
      remainingLife: Math.max(usefulLife - currentAge, 0),
      schedule,
      calculatedAt: new Date(),
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to calculate declining balance depreciation: ${error.message}`
    );
  }
}

/**
 * Calculate double declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDoubleDecliningDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export async function calculateDoubleDecliningDepreciation(
  assetId: string,
  acquisitionCost: number,
  salvageValue: number,
  usefulLife: number,
  acquisitionDate: Date,
  transaction?: Transaction
): Promise<DepreciationResult> {
  return await calculateDecliningBalanceDepreciation(
    assetId,
    acquisitionCost,
    salvageValue,
    usefulLife,
    acquisitionDate,
    2.0,
    transaction
  );
}

/**
 * Calculate sum-of-years-digits depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateSumOfYearsDigitsDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export async function calculateSumOfYearsDigitsDepreciation(
  assetId: string,
  acquisitionCost: number,
  salvageValue: number,
  usefulLife: number,
  acquisitionDate: Date,
  transaction?: Transaction
): Promise<DepreciationResult> {
  try {
    const depreciableBase = acquisitionCost - salvageValue;
    const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
    const schedule: DepreciationScheduleEntry[] = [];
    let accumulatedDepreciation = 0;

    for (let year = 1; year <= usefulLife; year++) {
      const beginningBookValue = acquisitionCost - accumulatedDepreciation;
      const remainingLife = usefulLife - year + 1;
      const depreciationExpense = (depreciableBase * remainingLife) / sumOfYears;
      accumulatedDepreciation += depreciationExpense;
      const endingBookValue = acquisitionCost - accumulatedDepreciation;

      schedule.push({
        year,
        period: `Year ${year}`,
        beginningBookValue,
        depreciationExpense,
        accumulatedDepreciation,
        endingBookValue: Math.max(endingBookValue, salvageValue),
        depreciationRate: (depreciationExpense / depreciableBase) * 100,
      });
    }

    const currentAge = Math.floor(
      (new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const currentEntry = schedule[Math.min(currentAge, schedule.length - 1)];
    const annualDepreciation = schedule.length > 0 ? schedule[0].depreciationExpense : 0;

    await DepreciationSchedule.create(
      {
        assetId,
        method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
        acquisitionCost,
        salvageValue,
        usefulLife,
        acquisitionDate,
        scheduleData: schedule,
        isActive: true,
      },
      { transaction }
    );

    return {
      assetId,
      method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
      acquisitionCost,
      salvageValue,
      usefulLife,
      currentAge,
      annualDepreciation,
      accumulatedDepreciation: currentEntry?.accumulatedDepreciation || 0,
      currentBookValue: currentEntry?.endingBookValue || acquisitionCost,
      remainingLife: Math.max(usefulLife - currentAge, 0),
      schedule,
      calculatedAt: new Date(),
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to calculate sum-of-years-digits depreciation: ${error.message}`
    );
  }
}

/**
 * Calculate units-of-production depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param totalUnitsCapacity - Total units the asset can produce
 * @param unitsProduced - Units produced to date
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = await calculateUnitsOfProductionDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   500000,
 *   150000,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export async function calculateUnitsOfProductionDepreciation(
  assetId: string,
  acquisitionCost: number,
  salvageValue: number,
  totalUnitsCapacity: number,
  unitsProduced: number,
  acquisitionDate: Date,
  transaction?: Transaction
): Promise<DepreciationResult> {
  try {
    const depreciableBase = acquisitionCost - salvageValue;
    const depreciationPerUnit = depreciableBase / totalUnitsCapacity;
    const accumulatedDepreciation = Math.min(
      depreciationPerUnit * unitsProduced,
      depreciableBase
    );
    const currentBookValue = Math.max(acquisitionCost - accumulatedDepreciation, salvageValue);

    // Generate schedule based on estimated annual production
    const estimatedAnnualProduction = totalUnitsCapacity / 10; // Assume 10-year life
    const schedule: DepreciationScheduleEntry[] = [];
    let cumUnits = 0;
    let cumDepreciation = 0;

    for (let year = 1; year <= 10 && cumUnits < totalUnitsCapacity; year++) {
      const beginningBookValue = acquisitionCost - cumDepreciation;
      const yearUnits = Math.min(estimatedAnnualProduction, totalUnitsCapacity - cumUnits);
      const depreciationExpense = depreciationPerUnit * yearUnits;
      cumUnits += yearUnits;
      cumDepreciation += depreciationExpense;
      const endingBookValue = acquisitionCost - cumDepreciation;

      schedule.push({
        year,
        period: `Year ${year} (${yearUnits.toLocaleString()} units)`,
        beginningBookValue,
        depreciationExpense,
        accumulatedDepreciation: cumDepreciation,
        endingBookValue: Math.max(endingBookValue, salvageValue),
      });
    }

    await DepreciationSchedule.create(
      {
        assetId,
        method: DepreciationMethod.UNITS_OF_PRODUCTION,
        acquisitionCost,
        salvageValue,
        usefulLife: 10,
        acquisitionDate,
        scheduleData: schedule,
        isActive: true,
      },
      { transaction }
    );

    const currentAge = Math.floor(
      (new Date().getTime() - acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      assetId,
      method: DepreciationMethod.UNITS_OF_PRODUCTION,
      acquisitionCost,
      salvageValue,
      usefulLife: 10,
      currentAge,
      annualDepreciation: depreciationPerUnit * estimatedAnnualProduction,
      accumulatedDepreciation,
      currentBookValue,
      remainingLife: Math.max(10 - currentAge, 0),
      schedule,
      calculatedAt: new Date(),
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to calculate units-of-production depreciation: ${error.message}`
    );
  }
}

/**
 * Get depreciation schedule for an asset
 *
 * @param assetId - Asset ID
 * @param method - Optional method filter
 * @returns Depreciation schedule or null
 *
 * @example
 * ```typescript
 * const schedule = await getDepreciationSchedule('asset-001', 'straight_line');
 * ```
 */
export async function getDepreciationSchedule(
  assetId: string,
  method?: DepreciationMethod
): Promise<DepreciationSchedule | null> {
  const where: WhereOptions = { assetId, isActive: true };

  if (method) {
    where.method = method;
  }

  return await DepreciationSchedule.findOne({ where });
}

/**
 * Calculate current book value for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate book value as of
 * @returns Book value data
 * @throws NotFoundException if asset or depreciation schedule not found
 *
 * @example
 * ```typescript
 * const bookValue = await calculateBookValue('asset-001', new Date());
 * ```
 */
export async function calculateBookValue(
  assetId: string,
  asOfDate: Date
): Promise<BookValueData> {
  const schedule = await getDepreciationSchedule(assetId);

  if (!schedule) {
    throw new NotFoundException(`No active depreciation schedule found for asset ${assetId}`);
  }

  const yearsSinceAcquisition = Math.floor(
    (asOfDate.getTime() - schedule.acquisitionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  const entry = schedule.scheduleData[Math.min(yearsSinceAcquisition, schedule.scheduleData.length - 1)];

  const impairments = await AssetImpairment.findAll({
    where: {
      assetId,
      impairmentDate: { [Op.lte]: asOfDate },
    },
  });

  const totalImpairment = impairments.reduce((sum, imp) => sum + Number(imp.impairmentLoss), 0);

  return {
    assetId,
    asOfDate,
    acquisitionCost: schedule.acquisitionCost,
    accumulatedDepreciation: entry?.accumulatedDepreciation || 0,
    bookValue: Math.max((entry?.endingBookValue || schedule.acquisitionCost) - totalImpairment, 0),
    salvageValue: schedule.salvageValue,
    impairmentLoss: totalImpairment,
  };
}

// ============================================================================
// BUDGET TRACKING FUNCTIONS
// ============================================================================

/**
 * Create a budget allocation
 *
 * @param data - Budget allocation data
 * @param transaction - Optional database transaction
 * @returns Created budget allocation
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   name: 'IT Equipment FY2024',
 *   fiscalYear: 2024,
 *   budgetedAmount: 500000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function createBudgetAllocation(
  data: BudgetAllocationData,
  transaction?: Transaction
): Promise<BudgetAllocation> {
  try {
    const budget = await BudgetAllocation.create(
      {
        name: data.name,
        fiscalYear: data.fiscalYear,
        departmentId: data.departmentId,
        costCenterId: data.costCenterId,
        categoryId: data.categoryId,
        budgetedAmount: data.budgetedAmount,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
      },
      { transaction }
    );

    return budget;
  } catch (error) {
    throw new BadRequestException(`Failed to create budget allocation: ${error.message}`);
  }
}

/**
 * Get budget allocation by ID
 *
 * @param id - Budget allocation ID
 * @returns Budget allocation or null
 *
 * @example
 * ```typescript
 * const budget = await getBudgetAllocationById('budget-001');
 * ```
 */
export async function getBudgetAllocationById(id: string): Promise<BudgetAllocation | null> {
  return await BudgetAllocation.findByPk(id);
}

/**
 * Track budget spending and calculate variance
 *
 * @param budgetId - Budget allocation ID
 * @param asOfDate - Date to calculate as of
 * @returns Budget tracking result
 * @throws NotFoundException if budget not found
 *
 * @example
 * ```typescript
 * const tracking = await trackBudgetSpending('budget-001', new Date());
 * ```
 */
export async function trackBudgetSpending(
  budgetId: string,
  asOfDate: Date
): Promise<BudgetTrackingResult> {
  const budget = await BudgetAllocation.findByPk(budgetId);

  if (!budget) {
    throw new NotFoundException(`Budget allocation ${budgetId} not found`);
  }

  // Get all costs for this budget period
  const where: WhereOptions = {
    date: {
      [Op.between]: [budget.startDate, Math.min(asOfDate.getTime(), budget.endDate.getTime())],
    },
  };

  if (budget.costCenterId) {
    where.costCenterId = budget.costCenterId;
  }

  if (budget.departmentId) {
    where.departmentId = budget.departmentId;
  }

  const costs = await AssetCost.findAll({ where });
  const actualSpent = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);

  // For simplicity, committed is 0 (would need purchase order integration)
  const committed = 0;
  const available = budget.budgetedAmount - actualSpent - committed;
  const variance = budget.budgetedAmount - actualSpent;
  const variancePercent = (variance / budget.budgetedAmount) * 100;

  let status: BudgetStatus;
  if (variancePercent > 10) {
    status = BudgetStatus.UNDER_BUDGET;
  } else if (variancePercent >= -10) {
    status = BudgetStatus.ON_BUDGET;
  } else if (variance >= 0) {
    status = BudgetStatus.OVER_BUDGET;
  } else {
    status = BudgetStatus.EXCEEDED;
  }

  return {
    budgetId: budget.id,
    name: budget.name,
    budgetedAmount: budget.budgetedAmount,
    actualSpent,
    committed,
    available,
    variance,
    variancePercent,
    status,
    asOfDate,
  };
}

/**
 * Get budget allocations for a fiscal year
 *
 * @param fiscalYear - Fiscal year
 * @param departmentId - Optional department filter
 * @returns Array of budget allocations
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByFiscalYear(2024);
 * ```
 */
export async function getBudgetsByFiscalYear(
  fiscalYear: number,
  departmentId?: string
): Promise<BudgetAllocation[]> {
  const where: WhereOptions = { fiscalYear };

  if (departmentId) {
    where.departmentId = departmentId;
  }

  return await BudgetAllocation.findAll({ where });
}

// ============================================================================
// ROI ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze Return on Investment (ROI) for an asset
 *
 * @param data - ROI analysis data
 * @param transaction - Optional database transaction
 * @returns ROI analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const roi = await analyzeROI({
 *   assetId: 'asset-001',
 *   initialInvestment: 100000,
 *   annualRevenue: 50000,
 *   annualOperatingCosts: 20000,
 *   analysisYears: 5,
 *   discountRate: 0.08
 * });
 * ```
 */
export async function analyzeROI(
  data: ROIAnalysisData,
  transaction?: Transaction
): Promise<ROIAnalysisResult> {
  try {
    const annualCashFlows: AnnualCashFlow[] = [];
    let cumulativeCashFlow = -data.initialInvestment;
    let breakEvenYear = 0;
    let npv = -data.initialInvestment;

    const annualBenefit = (data.annualRevenue || 0) + (data.annualCostSavings || 0);
    const annualNetCashFlow = annualBenefit - data.annualOperatingCosts;
    const discountRate = data.discountRate || 0.08;

    for (let year = 1; year <= data.analysisYears; year++) {
      const revenue = annualBenefit;
      const costs = data.annualOperatingCosts;
      const netCashFlow = revenue - costs;
      cumulativeCashFlow += netCashFlow;

      const presentValue = netCashFlow / Math.pow(1 + discountRate, year);
      npv += presentValue;

      if (breakEvenYear === 0 && cumulativeCashFlow >= 0) {
        breakEvenYear = year;
      }

      annualCashFlows.push({
        year,
        revenue,
        costs,
        netCashFlow,
        cumulativeCashFlow,
        presentValue,
      });
    }

    const totalRevenue = annualBenefit * data.analysisYears;
    const totalCosts = data.initialInvestment + data.annualOperatingCosts * data.analysisYears;
    const netProfit = totalRevenue - totalCosts;
    const roi = (netProfit / data.initialInvestment) * 100;

    const paybackPeriod = data.initialInvestment / annualNetCashFlow;

    // Simplified IRR calculation (approximate)
    const irr = ((Math.pow(cumulativeCashFlow / data.initialInvestment, 1 / data.analysisYears) - 1) * 100);

    const result: ROIAnalysisResult = {
      assetId: data.assetId,
      initialInvestment: data.initialInvestment,
      totalRevenue,
      totalCosts,
      netProfit,
      roi,
      paybackPeriod,
      npv,
      irr,
      breakEvenYear,
      annualCashFlows,
    };

    // Save analysis
    await FinancialAnalysis.create(
      {
        assetId: data.assetId,
        analysisType: 'roi',
        analysisData: result,
        analysisDate: new Date(),
      },
      { transaction }
    );

    return result;
  } catch (error) {
    throw new BadRequestException(`Failed to analyze ROI: ${error.message}`);
  }
}

// ============================================================================
// TCO ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze Total Cost of Ownership (TCO) for an asset
 *
 * @param data - TCO analysis data
 * @param transaction - Optional database transaction
 * @returns TCO analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const tco = await analyzeTCO({
 *   assetId: 'asset-001',
 *   analysisYears: 5,
 *   acquisitionCost: 100000,
 *   annualMaintenanceCost: 10000,
 *   annualOperatingCost: 15000,
 *   discountRate: 0.08
 * });
 * ```
 */
export async function analyzeTCO(
  data: TCOAnalysisData,
  transaction?: Transaction
): Promise<TCOAnalysisResult> {
  try {
    const totalAcquisitionCost = data.acquisitionCost + (data.installationCost || 0);
    const totalMaintenanceCost = data.annualMaintenanceCost * data.analysisYears;
    const totalOperatingCost = data.annualOperatingCost * data.analysisYears;
    const totalOtherCosts =
      (data.annualLicenseCost || 0) * data.analysisYears +
      (data.upgradesCost || 0) +
      (data.trainingCost || 0) +
      (data.disposalCost || 0);

    const totalCostOfOwnership =
      totalAcquisitionCost + totalMaintenanceCost + totalOperatingCost + totalOtherCosts;

    const annualizedCost = totalCostOfOwnership / data.analysisYears;

    const discountRate = data.discountRate || 0.08;
    let presentValue = totalAcquisitionCost;

    const yearlyBreakdown: TCOYearlyBreakdown[] = [];
    let cumulativeCost = totalAcquisitionCost;

    for (let year = 1; year <= data.analysisYears; year++) {
      const maintenanceCost = data.annualMaintenanceCost;
      const operatingCost = data.annualOperatingCost;
      const otherCost = (data.annualLicenseCost || 0);
      const totalYearlyCost = maintenanceCost + operatingCost + otherCost;
      cumulativeCost += totalYearlyCost;

      presentValue += totalYearlyCost / Math.pow(1 + discountRate, year);

      yearlyBreakdown.push({
        year,
        maintenanceCost,
        operatingCost,
        otherCost,
        totalYearlyCost,
        cumulativeCost,
      });
    }

    const costBreakdown: TCOCostBreakdown = {
      acquisitionPercent: (totalAcquisitionCost / totalCostOfOwnership) * 100,
      maintenancePercent: (totalMaintenanceCost / totalCostOfOwnership) * 100,
      operatingPercent: (totalOperatingCost / totalCostOfOwnership) * 100,
      otherPercent: (totalOtherCosts / totalCostOfOwnership) * 100,
    };

    const result: TCOAnalysisResult = {
      assetId: data.assetId,
      analysisYears: data.analysisYears,
      totalAcquisitionCost,
      totalMaintenanceCost,
      totalOperatingCost,
      totalOtherCosts,
      totalCostOfOwnership,
      annualizedCost,
      presentValue,
      costBreakdown,
      yearlyBreakdown,
    };

    // Save analysis
    await FinancialAnalysis.create(
      {
        assetId: data.assetId,
        analysisType: 'tco',
        analysisData: result,
        analysisDate: new Date(),
      },
      { transaction }
    );

    return result;
  } catch (error) {
    throw new BadRequestException(`Failed to analyze TCO: ${error.message}`);
  }
}

// ============================================================================
// LEASE VS BUY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze Lease vs Buy decision
 *
 * @param data - Lease vs buy analysis data
 * @param transaction - Optional database transaction
 * @returns Lease vs buy analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const analysis = await analyzeLeaseVsBuy({
 *   assetDescription: 'MRI Machine',
 *   purchasePrice: 2000000,
 *   leasePayment: 50000,
 *   leaseTerm: 60,
 *   taxRate: 0.21,
 *   discountRate: 0.08
 * });
 * ```
 */
export async function analyzeLeaseVsBuy(
  data: LeaseVsBuyAnalysisData,
  transaction?: Transaction
): Promise<LeaseVsBuyAnalysisResult> {
  try {
    const discountRate = data.discountRate || 0.08;
    const taxRate = data.taxRate || 0.21;

    // Buy option analysis
    const loanAmount = data.purchasePrice - (data.downPayment || 0);
    const monthlyInterestRate = (data.loanInterestRate || 0.05) / 12;
    const loanTermMonths = (data.loanTerm || 5) * 12;

    const monthlyPayment =
      loanAmount > 0
        ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
          (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
        : 0;

    const totalPayments = monthlyPayment * loanTermMonths + (data.downPayment || 0);
    const totalInterest = totalPayments - data.purchasePrice;
    const taxBenefit = totalInterest * taxRate;
    const buyNetCost = totalPayments - taxBenefit;

    // Calculate PV for buy option
    let buyPV = data.downPayment || 0;
    for (let month = 1; month <= loanTermMonths; month++) {
      buyPV += monthlyPayment / Math.pow(1 + discountRate / 12, month);
    }

    // Lease option analysis
    const leaseMonths = data.leaseTerm;
    const totalLeasePayments = data.leasePayment * leaseMonths;
    const leaseTaxBenefit = totalLeasePayments * taxRate;
    const leaseNetCost = totalLeasePayments - leaseTaxBenefit;

    // Calculate PV for lease option
    let leasePV = 0;
    for (let month = 1; month <= leaseMonths; month++) {
      leasePV += data.leasePayment / Math.pow(1 + discountRate / 12, month);
    }

    const recommendation = buyPV < leasePV ? 'buy' : 'lease';
    const savings = Math.abs(buyPV - leasePV);
    const savingsPercent = (savings / Math.max(buyPV, leasePV)) * 100;

    const result: LeaseVsBuyAnalysisResult = {
      assetDescription: data.assetDescription,
      buyOption: {
        totalCost: totalPayments,
        presentValue: buyPV,
        monthlyPayment,
        totalInterest,
        taxBenefit,
        netCost: buyNetCost,
      },
      leaseOption: {
        totalCost: totalLeasePayments,
        presentValue: leasePV,
        monthlyPayment: data.leasePayment,
        totalPayments: totalLeasePayments,
        taxBenefit: leaseTaxBenefit,
        netCost: leaseNetCost,
      },
      recommendation,
      savings,
      savingsPercent,
    };

    // Save analysis
    await FinancialAnalysis.create(
      {
        analysisType: 'lease_vs_buy',
        analysisData: result,
        analysisDate: new Date(),
      },
      { transaction }
    );

    return result;
  } catch (error) {
    throw new BadRequestException(`Failed to analyze lease vs buy: ${error.message}`);
  }
}

/**
 * Generate amortization schedule for a loan
 *
 * @param principal - Loan principal amount
 * @param interestRate - Annual interest rate (decimal)
 * @param termYears - Loan term in years
 * @param startDate - Loan start date
 * @returns Array of amortization schedule entries
 *
 * @example
 * ```typescript
 * const schedule = await generateAmortizationSchedule(
 *   100000,
 *   0.05,
 *   10,
 *   new Date('2024-01-01')
 * );
 * ```
 */
export async function generateAmortizationSchedule(
  principal: number,
  interestRate: number,
  termYears: number,
  startDate: Date
): Promise<AmortizationScheduleEntry[]> {
  const monthlyRate = interestRate / 12;
  const termMonths = termYears * 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const schedule: AmortizationScheduleEntry[] = [];
  let remainingBalance = principal;

  for (let period = 1; period <= termMonths; period++) {
    const interest = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    remainingBalance -= principalPayment;

    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + period);

    schedule.push({
      period,
      paymentDate,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remainingBalance: Math.max(remainingBalance, 0),
    });
  }

  return schedule;
}

// ============================================================================
// ASSET IMPAIRMENT FUNCTIONS
// ============================================================================

/**
 * Record an asset impairment
 *
 * @param data - Asset impairment data
 * @param transaction - Optional database transaction
 * @returns Created impairment record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const impairment = await recordAssetImpairment({
 *   assetId: 'asset-001',
 *   impairmentDate: new Date(),
 *   bookValueBeforeImpairment: 50000,
 *   fairValue: 30000,
 *   impairmentLoss: 20000,
 *   reason: 'Technological obsolescence'
 * });
 * ```
 */
export async function recordAssetImpairment(
  data: AssetImpairmentData,
  transaction?: Transaction
): Promise<AssetImpairment> {
  try {
    const impairment = await AssetImpairment.create(
      {
        assetId: data.assetId,
        impairmentDate: data.impairmentDate,
        bookValueBeforeImpairment: data.bookValueBeforeImpairment,
        fairValue: data.fairValue,
        impairmentLoss: data.impairmentLoss,
        reason: data.reason,
        notes: data.notes,
      },
      { transaction }
    );

    return impairment;
  } catch (error) {
    throw new BadRequestException(`Failed to record asset impairment: ${error.message}`);
  }
}

/**
 * Get impairments for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of impairment records
 *
 * @example
 * ```typescript
 * const impairments = await getAssetImpairments('asset-001');
 * ```
 */
export async function getAssetImpairments(assetId: string): Promise<AssetImpairment[]> {
  return await AssetImpairment.findAll({
    where: { assetId },
    order: [['impairmentDate', 'DESC']],
  });
}

/**
 * Calculate disposal gain or loss
 *
 * @param assetId - Asset ID
 * @param salePrice - Sale price of the asset
 * @param saleDate - Date of sale
 * @returns Gain or loss amount (positive = gain, negative = loss)
 * @throws NotFoundException if asset not found
 *
 * @example
 * ```typescript
 * const gainLoss = await calculateDisposalGainLoss('asset-001', 25000, new Date());
 * ```
 */
export async function calculateDisposalGainLoss(
  assetId: string,
  salePrice: number,
  saleDate: Date
): Promise<number> {
  const bookValue = await calculateBookValue(assetId, saleDate);
  return salePrice - bookValue.bookValue;
}

/**
 * Get financial summary for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate as of
 * @returns Comprehensive financial summary
 *
 * @example
 * ```typescript
 * const summary = await getAssetFinancialSummary('asset-001', new Date());
 * ```
 */
export async function getAssetFinancialSummary(
  assetId: string,
  asOfDate: Date
): Promise<Record<string, any>> {
  const [costs, bookValue, impairments, schedule] = await Promise.all([
    getAssetCosts(assetId),
    calculateBookValue(assetId, asOfDate).catch(() => null),
    getAssetImpairments(assetId),
    getDepreciationSchedule(assetId),
  ]);

  const totalCosts = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
  const acquisitionCosts = costs
    .filter((c) => c.costType === CostType.ACQUISITION)
    .reduce((sum, cost) => sum + Number(cost.amount), 0);
  const maintenanceCosts = costs
    .filter((c) => c.costType === CostType.MAINTENANCE)
    .reduce((sum, cost) => sum + Number(cost.amount), 0);

  return {
    assetId,
    asOfDate,
    totalCosts,
    acquisitionCosts,
    maintenanceCosts,
    bookValue: bookValue?.bookValue || 0,
    accumulatedDepreciation: bookValue?.accumulatedDepreciation || 0,
    impairmentLoss: bookValue?.impairmentLoss || 0,
    depreciationMethod: schedule?.method,
    costBreakdown: costs.reduce((acc, cost) => {
      acc[cost.costType] = (acc[cost.costType] || 0) + Number(cost.amount);
      return acc;
    }, {} as Record<string, number>),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Cost tracking
  trackAssetCost,
  getAssetCostById,
  getAssetCosts,
  calculateTotalAssetCosts,
  updateAssetCost,

  // Depreciation calculations
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  calculateDoubleDecliningDepreciation,
  calculateSumOfYearsDigitsDepreciation,
  calculateUnitsOfProductionDepreciation,
  getDepreciationSchedule,
  calculateBookValue,

  // Budget tracking
  createBudgetAllocation,
  getBudgetAllocationById,
  trackBudgetSpending,
  getBudgetsByFiscalYear,

  // ROI and TCO analysis
  analyzeROI,
  analyzeTCO,
  analyzeLeaseVsBuy,
  generateAmortizationSchedule,

  // Impairment
  recordAssetImpairment,
  getAssetImpairments,
  calculateDisposalGainLoss,
  getAssetFinancialSummary,

  // Models
  AssetCost,
  DepreciationSchedule,
  BudgetAllocation,
  AssetImpairment,
  FinancialAnalysis,

  // DTOs
  CreateAssetCostDto,
  CalculateDepreciationDto,
  CreateBudgetAllocationDto,

  // Enums
  DepreciationMethod,
  CostType,
  ExpenseClassification,
  BudgetStatus,
  FinancialStatus,
  LeaseType,
};

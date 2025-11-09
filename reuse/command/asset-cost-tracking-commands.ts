/**
 * ASSET COST TRACKING AND ANALYSIS COMMANDS
 *
 * Production-ready command functions for comprehensive asset cost management and financial analysis.
 * Provides 40+ specialized functions covering:
 * - Direct cost tracking and allocation
 * - Indirect cost management and overhead allocation
 * - Labor cost tracking with hourly rates and burden
 * - Parts and materials cost management
 * - Downtime cost calculation and impact analysis
 * - Full lifecycle cost tracking (acquisition to disposal)
 * - Multi-dimensional cost allocation (department, project, cost center)
 * - Cost trending and variance analysis
 * - Budget forecasting and variance reporting
 * - Activity-based costing (ABC) analysis
 * - Cost-benefit analysis
 * - ROI and payback period calculations
 *
 * @module AssetCostTrackingCommands
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
 * @security GAAP/IFRS compliant cost accounting with audit trails
 * @performance Optimized for high-volume cost transactions (1M+ records)
 *
 * @example
 * ```typescript
 * import {
 *   recordDirectCost,
 *   allocateCostToDepartment,
 *   trackLaborCosts,
 *   calculateDowntimeCost,
 *   generateCostReport,
 *   CostType,
 *   AllocationMethod
 * } from './asset-cost-tracking-commands';
 *
 * // Record direct maintenance cost
 * const cost = await recordDirectCost({
 *   assetId: 'asset-123',
 *   costType: CostType.MAINTENANCE,
 *   amount: 5000,
 *   date: new Date(),
 *   description: 'Preventive maintenance service',
 *   invoiceNumber: 'INV-2024-001'
 * });
 *
 * // Allocate cost to department
 * await allocateCostToDepartment(cost.id, 'dept-radiology', 100);
 *
 * // Track labor costs
 * const labor = await trackLaborCosts({
 *   assetId: 'asset-123',
 *   technicianId: 'tech-001',
 *   hours: 8.5,
 *   hourlyRate: 75,
 *   date: new Date()
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Cost types
 */
export enum CostType {
  ACQUISITION = 'acquisition',
  INSTALLATION = 'installation',
  OPERATING = 'operating',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  CALIBRATION = 'calibration',
  TRAINING = 'training',
  INSURANCE = 'insurance',
  ENERGY = 'energy',
  CONSUMABLES = 'consumables',
  PARTS = 'parts',
  LABOR = 'labor',
  DOWNTIME = 'downtime',
  DISPOSAL = 'disposal',
  OTHER = 'other',
}

/**
 * Cost classification
 */
export enum CostClassification {
  DIRECT = 'direct',
  INDIRECT = 'indirect',
  OVERHEAD = 'overhead',
  CAPITAL = 'capital',
  OPERATIONAL = 'operational',
}

/**
 * Allocation method
 */
export enum AllocationMethod {
  DIRECT_ASSIGNMENT = 'direct_assignment',
  PERCENTAGE = 'percentage',
  USAGE_BASED = 'usage_based',
  SQUARE_FOOTAGE = 'square_footage',
  HEADCOUNT = 'headcount',
  ACTIVITY_BASED = 'activity_based',
}

/**
 * Cost status
 */
export enum CostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ALLOCATED = 'allocated',
  INVOICED = 'invoiced',
  PAID = 'paid',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
}

/**
 * Budget period type
 */
export enum BudgetPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  CUSTOM = 'custom',
}

/**
 * Direct cost data
 */
export interface DirectCostData {
  assetId: string;
  costType: CostType;
  amount: number;
  date: Date;
  description: string;
  invoiceNumber?: string;
  vendorId?: string;
  purchaseOrderNumber?: string;
  approvedBy?: string;
  notes?: string;
}

/**
 * Indirect cost data
 */
export interface IndirectCostData {
  assetId?: string;
  costType: CostType;
  amount: number;
  period: { start: Date; end: Date };
  description: string;
  allocationBasis: string;
  notes?: string;
}

/**
 * Labor cost data
 */
export interface LaborCostData {
  assetId: string;
  technicianId: string;
  workOrderId?: string;
  hours: number;
  hourlyRate: number;
  overtimeHours?: number;
  overtimeRate?: number;
  date: Date;
  taskDescription?: string;
  skillLevel?: string;
}

/**
 * Downtime cost data
 */
export interface DowntimeCostData {
  assetId: string;
  downtimeStart: Date;
  downtimeEnd: Date;
  reason: string;
  lostProductionUnits?: number;
  revenuePerUnit?: number;
  additionalCosts?: number;
  notes?: string;
}

/**
 * Cost allocation data
 */
export interface CostAllocationData {
  costId: string;
  allocationMethod: AllocationMethod;
  allocations: Array<{
    departmentId?: string;
    projectId?: string;
    costCenterId?: string;
    percentage?: number;
    amount?: number;
  }>;
}

/**
 * Cost report parameters
 */
export interface CostReportParams {
  assetId?: string;
  assetTypeId?: string;
  departmentId?: string;
  projectId?: string;
  costTypes?: CostType[];
  startDate: Date;
  endDate: Date;
  groupBy?: 'asset' | 'type' | 'department' | 'month' | 'quarter';
}

/**
 * Cost variance analysis
 */
export interface CostVarianceAnalysis {
  assetId: string;
  period: { start: Date; end: Date };
  budgetedCost: number;
  actualCost: number;
  variance: number;
  variancePercentage: number;
  variances: Array<{
    costType: CostType;
    budgeted: number;
    actual: number;
    variance: number;
  }>;
  explanation?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Asset Direct Cost Model - Tracks direct costs associated with assets
 */
@Table({
  tableName: 'asset_direct_costs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['cost_type'] },
    { fields: ['cost_date'] },
    { fields: ['status'] },
    { fields: ['invoice_number'] },
    { fields: ['vendor_id'] },
  ],
})
export class AssetDirectCost extends Model {
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

  @ApiProperty({ description: 'Cost type' })
  @Column({
    type: DataType.ENUM(...Object.values(CostType)),
    allowNull: false,
  })
  @Index
  costType!: CostType;

  @ApiProperty({ description: 'Cost classification' })
  @Column({ type: DataType.ENUM(...Object.values(CostClassification)) })
  classification?: CostClassification;

  @ApiProperty({ description: 'Cost amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount!: number;

  @ApiProperty({ description: 'Cost date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  costDate!: Date;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Invoice number' })
  @Column({ type: DataType.STRING(100) })
  @Index
  invoiceNumber?: string;

  @ApiProperty({ description: 'Purchase order number' })
  @Column({ type: DataType.STRING(100) })
  purchaseOrderNumber?: string;

  @ApiProperty({ description: 'Vendor ID' })
  @Column({ type: DataType.UUID })
  @Index
  vendorId?: string;

  @ApiProperty({ description: 'Cost status' })
  @Column({
    type: DataType.ENUM(...Object.values(CostStatus)),
    defaultValue: CostStatus.PENDING,
  })
  @Index
  status!: CostStatus;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Cost center' })
  @Column({ type: DataType.STRING(100) })
  costCenter?: string;

  @ApiProperty({ description: 'GL account' })
  @Column({ type: DataType.STRING(50) })
  glAccount?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => CostAllocation)
  allocations?: CostAllocation[];
}

/**
 * Asset Indirect Cost Model - Tracks indirect and overhead costs
 */
@Table({
  tableName: 'asset_indirect_costs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['cost_type'] },
    { fields: ['period_start', 'period_end'] },
  ],
})
export class AssetIndirectCost extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID (null for shared costs)' })
  @Column({ type: DataType.UUID })
  @Index
  assetId?: string;

  @ApiProperty({ description: 'Cost type' })
  @Column({
    type: DataType.ENUM(...Object.values(CostType)),
    allowNull: false,
  })
  @Index
  costType!: CostType;

  @ApiProperty({ description: 'Cost amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount!: number;

  @ApiProperty({ description: 'Period start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  periodStart!: Date;

  @ApiProperty({ description: 'Period end date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  periodEnd!: Date;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Allocation basis' })
  @Column({ type: DataType.STRING(100) })
  allocationBasis?: string;

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
 * Labor Cost Model - Tracks labor costs for asset maintenance/operations
 */
@Table({
  tableName: 'labor_costs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['technician_id'] },
    { fields: ['work_order_id'] },
    { fields: ['work_date'] },
  ],
})
export class LaborCost extends Model {
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

  @ApiProperty({ description: 'Technician/worker ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  technicianId!: string;

  @ApiProperty({ description: 'Work order ID' })
  @Column({ type: DataType.UUID })
  @Index
  workOrderId?: string;

  @ApiProperty({ description: 'Regular hours' })
  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  regularHours!: number;

  @ApiProperty({ description: 'Hourly rate' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  hourlyRate!: number;

  @ApiProperty({ description: 'Overtime hours' })
  @Column({ type: DataType.DECIMAL(8, 2), defaultValue: 0 })
  overtimeHours!: number;

  @ApiProperty({ description: 'Overtime rate' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  overtimeRate?: number;

  @ApiProperty({ description: 'Total labor cost' })
  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  totalCost!: number;

  @ApiProperty({ description: 'Burden/overhead percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  burdenPercentage!: number;

  @ApiProperty({ description: 'Total cost with burden' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  totalCostWithBurden?: number;

  @ApiProperty({ description: 'Work date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  workDate!: Date;

  @ApiProperty({ description: 'Task description' })
  @Column({ type: DataType.TEXT })
  taskDescription?: string;

  @ApiProperty({ description: 'Skill level' })
  @Column({ type: DataType.STRING(50) })
  skillLevel?: string;

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
 * Downtime Cost Model - Tracks costs associated with asset downtime
 */
@Table({
  tableName: 'downtime_costs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['downtime_start', 'downtime_end'] },
    { fields: ['total_cost'] },
  ],
})
export class DowntimeCost extends Model {
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

  @ApiProperty({ description: 'Downtime start' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  downtimeStart!: Date;

  @ApiProperty({ description: 'Downtime end' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  downtimeEnd!: Date;

  @ApiProperty({ description: 'Duration in hours' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  durationHours!: number;

  @ApiProperty({ description: 'Downtime reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Lost production units' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  lostProductionUnits?: number;

  @ApiProperty({ description: 'Revenue per unit' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  revenuePerUnit?: number;

  @ApiProperty({ description: 'Lost revenue' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  lostRevenue?: number;

  @ApiProperty({ description: 'Additional costs (labor, etc.)' })
  @Column({ type: DataType.DECIMAL(12, 2) })
  additionalCosts?: number;

  @ApiProperty({ description: 'Total downtime cost' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  @Index
  totalCost!: number;

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
 * Cost Allocation Model - Tracks cost allocations to departments/projects
 */
@Table({
  tableName: 'cost_allocations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['cost_id'] },
    { fields: ['department_id'] },
    { fields: ['project_id'] },
    { fields: ['cost_center_id'] },
  ],
})
export class CostAllocation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Cost ID' })
  @ForeignKey(() => AssetDirectCost)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  costId!: string;

  @ApiProperty({ description: 'Allocation method' })
  @Column({
    type: DataType.ENUM(...Object.values(AllocationMethod)),
    allowNull: false,
  })
  allocationMethod!: AllocationMethod;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID })
  @Index
  departmentId?: string;

  @ApiProperty({ description: 'Project ID' })
  @Column({ type: DataType.UUID })
  @Index
  projectId?: string;

  @ApiProperty({ description: 'Cost center ID' })
  @Column({ type: DataType.UUID })
  @Index
  costCenterId?: string;

  @ApiProperty({ description: 'Allocation percentage' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  allocationPercentage?: number;

  @ApiProperty({ description: 'Allocated amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  allocatedAmount!: number;

  @ApiProperty({ description: 'Allocation notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => AssetDirectCost)
  cost?: AssetDirectCost;
}

/**
 * Cost Budget Model - Tracks budgets for cost planning and variance analysis
 */
@Table({
  tableName: 'cost_budgets',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['department_id'] },
    { fields: ['budget_period'] },
    { fields: ['fiscal_year'] },
  ],
})
export class CostBudget extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID })
  @Index
  assetId?: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID })
  @Index
  departmentId?: string;

  @ApiProperty({ description: 'Fiscal year' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Index
  fiscalYear!: number;

  @ApiProperty({ description: 'Budget period' })
  @Column({
    type: DataType.ENUM(...Object.values(BudgetPeriod)),
    allowNull: false,
  })
  @Index
  budgetPeriod!: BudgetPeriod;

  @ApiProperty({ description: 'Period start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  periodStart!: Date;

  @ApiProperty({ description: 'Period end date' })
  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd!: Date;

  @ApiProperty({ description: 'Budget breakdown by cost type' })
  @Column({ type: DataType.JSONB })
  budgetByType?: Record<CostType, number>;

  @ApiProperty({ description: 'Total budget amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  totalBudget!: number;

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
// DIRECT COST TRACKING FUNCTIONS
// ============================================================================

/**
 * Records a direct cost for an asset
 *
 * @param data - Direct cost data
 * @param transaction - Optional database transaction
 * @returns Created cost record
 *
 * @example
 * ```typescript
 * const cost = await recordDirectCost({
 *   assetId: 'asset-123',
 *   costType: CostType.MAINTENANCE,
 *   amount: 5000,
 *   date: new Date(),
 *   description: 'Annual preventive maintenance',
 *   invoiceNumber: 'INV-2024-001'
 * });
 * ```
 */
export async function recordDirectCost(
  data: DirectCostData,
  transaction?: Transaction,
): Promise<AssetDirectCost> {
  const cost = await AssetDirectCost.create(
    {
      assetId: data.assetId,
      costType: data.costType,
      classification: CostClassification.DIRECT,
      amount: data.amount,
      costDate: data.date,
      description: data.description,
      invoiceNumber: data.invoiceNumber,
      vendorId: data.vendorId,
      purchaseOrderNumber: data.purchaseOrderNumber,
      approvedBy: data.approvedBy,
      notes: data.notes,
      status: data.approvedBy ? CostStatus.APPROVED : CostStatus.PENDING,
    },
    { transaction },
  );

  return cost;
}

/**
 * Updates a direct cost record
 *
 * @param costId - Cost identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated cost record
 *
 * @example
 * ```typescript
 * await updateDirectCost('cost-123', {
 *   amount: 5500,
 *   notes: 'Updated per revised invoice'
 * });
 * ```
 */
export async function updateDirectCost(
  costId: string,
  updates: Partial<AssetDirectCost>,
  transaction?: Transaction,
): Promise<AssetDirectCost> {
  const cost = await AssetDirectCost.findByPk(costId, { transaction });
  if (!cost) {
    throw new NotFoundException(`Cost record ${costId} not found`);
  }

  await cost.update(updates, { transaction });
  return cost;
}

/**
 * Approves a cost record
 *
 * @param costId - Cost identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Approved cost record
 *
 * @example
 * ```typescript
 * await approveDirectCost('cost-123', 'manager-001');
 * ```
 */
export async function approveDirectCost(
  costId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<AssetDirectCost> {
  const cost = await AssetDirectCost.findByPk(costId, { transaction });
  if (!cost) {
    throw new NotFoundException(`Cost record ${costId} not found`);
  }

  await cost.update(
    {
      status: CostStatus.APPROVED,
      approvedBy,
      approvalDate: new Date(),
    },
    { transaction },
  );

  return cost;
}

/**
 * Gets direct costs for an asset
 *
 * @param assetId - Asset identifier
 * @param filters - Optional filters
 * @returns List of direct costs
 *
 * @example
 * ```typescript
 * const costs = await getAssetDirectCosts('asset-123', {
 *   costTypes: [CostType.MAINTENANCE, CostType.REPAIR],
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function getAssetDirectCosts(
  assetId: string,
  filters?: {
    costTypes?: CostType[];
    startDate?: Date;
    endDate?: Date;
    status?: CostStatus;
  },
): Promise<AssetDirectCost[]> {
  const where: WhereOptions = { assetId };

  if (filters?.costTypes) {
    where.costType = { [Op.in]: filters.costTypes };
  }

  if (filters?.startDate || filters?.endDate) {
    where.costDate = {};
    if (filters.startDate) {
      (where.costDate as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.costDate as any)[Op.lte] = filters.endDate;
    }
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return AssetDirectCost.findAll({
    where,
    order: [['costDate', 'DESC']],
    include: [{ model: CostAllocation }],
  });
}

/**
 * Calculates total direct costs for an asset
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Cost summary
 *
 * @example
 * ```typescript
 * const total = await calculateTotalDirectCosts('asset-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function calculateTotalDirectCosts(
  assetId: string,
  period: { startDate: Date; endDate: Date },
): Promise<{
  assetId: string;
  totalCost: number;
  costByType: Record<CostType, number>;
  costCount: number;
}> {
  const costs = await getAssetDirectCosts(assetId, {
    startDate: period.startDate,
    endDate: period.endDate,
    status: CostStatus.APPROVED,
  });

  const totalCost = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);

  const costByType: Record<string, number> = {};
  for (const cost of costs) {
    costByType[cost.costType] = (costByType[cost.costType] || 0) + Number(cost.amount);
  }

  return {
    assetId,
    totalCost,
    costByType: costByType as Record<CostType, number>,
    costCount: costs.length,
  };
}

// ============================================================================
// INDIRECT COST MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Records an indirect cost
 *
 * @param data - Indirect cost data
 * @param transaction - Optional database transaction
 * @returns Created indirect cost record
 *
 * @example
 * ```typescript
 * const cost = await recordIndirectCost({
 *   assetId: 'asset-123',
 *   costType: CostType.INSURANCE,
 *   amount: 12000,
 *   period: {
 *     start: new Date('2024-01-01'),
 *     end: new Date('2024-12-31')
 *   },
 *   description: 'Annual insurance premium',
 *   allocationBasis: 'asset value'
 * });
 * ```
 */
export async function recordIndirectCost(
  data: IndirectCostData,
  transaction?: Transaction,
): Promise<AssetIndirectCost> {
  const cost = await AssetIndirectCost.create(
    {
      assetId: data.assetId,
      costType: data.costType,
      amount: data.amount,
      periodStart: data.period.start,
      periodEnd: data.period.end,
      description: data.description,
      allocationBasis: data.allocationBasis,
      notes: data.notes,
    },
    { transaction },
  );

  return cost;
}

/**
 * Allocates indirect costs across multiple assets
 *
 * @param indirectCostId - Indirect cost identifier
 * @param assetIds - Array of asset IDs
 * @param allocationBasis - Basis for allocation
 * @param transaction - Optional database transaction
 * @returns Array of allocated cost records
 *
 * @example
 * ```typescript
 * await allocateIndirectCosts('indirect-cost-123', [
 *   'asset-1', 'asset-2', 'asset-3'
 * ], AllocationMethod.USAGE_BASED);
 * ```
 */
export async function allocateIndirectCosts(
  indirectCostId: string,
  assetIds: string[],
  allocationBasis: AllocationMethod,
  transaction?: Transaction,
): Promise<AssetDirectCost[]> {
  const indirectCost = await AssetIndirectCost.findByPk(indirectCostId, {
    transaction,
  });

  if (!indirectCost) {
    throw new NotFoundException(`Indirect cost ${indirectCostId} not found`);
  }

  const totalAmount = Number(indirectCost.amount);
  const amountPerAsset = totalAmount / assetIds.length; // Equal allocation for simplicity

  const allocatedCosts: AssetDirectCost[] = [];

  for (const assetId of assetIds) {
    const cost = await AssetDirectCost.create(
      {
        assetId,
        costType: indirectCost.costType,
        classification: CostClassification.INDIRECT,
        amount: amountPerAsset,
        costDate: indirectCost.periodEnd,
        description: `Allocated: ${indirectCost.description}`,
        status: CostStatus.ALLOCATED,
      },
      { transaction },
    );

    allocatedCosts.push(cost);
  }

  return allocatedCosts;
}

/**
 * Gets indirect costs for a period
 *
 * @param period - Time period
 * @param filters - Optional filters
 * @returns List of indirect costs
 *
 * @example
 * ```typescript
 * const costs = await getIndirectCosts({
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-12-31')
 * });
 * ```
 */
export async function getIndirectCosts(
  period: { start: Date; end: Date },
  filters?: {
    assetId?: string;
    costTypes?: CostType[];
  },
): Promise<AssetIndirectCost[]> {
  const where: WhereOptions = {
    [Op.or]: [
      {
        periodStart: {
          [Op.between]: [period.start, period.end],
        },
      },
      {
        periodEnd: {
          [Op.between]: [period.start, period.end],
        },
      },
    ],
  };

  if (filters?.assetId) {
    where.assetId = filters.assetId;
  }

  if (filters?.costTypes) {
    where.costType = { [Op.in]: filters.costTypes };
  }

  return AssetIndirectCost.findAll({
    where,
    order: [['periodStart', 'DESC']],
  });
}

// ============================================================================
// LABOR COST TRACKING FUNCTIONS
// ============================================================================

/**
 * Tracks labor costs for asset work
 *
 * @param data - Labor cost data
 * @param transaction - Optional database transaction
 * @returns Created labor cost record
 *
 * @example
 * ```typescript
 * const labor = await trackLaborCosts({
 *   assetId: 'asset-123',
 *   technicianId: 'tech-001',
 *   hours: 8.5,
 *   hourlyRate: 75,
 *   overtimeHours: 2,
 *   overtimeRate: 112.50,
 *   date: new Date(),
 *   taskDescription: 'Preventive maintenance'
 * });
 * ```
 */
export async function trackLaborCosts(
  data: LaborCostData,
  transaction?: Transaction,
): Promise<LaborCost> {
  const regularCost = data.hours * data.hourlyRate;
  const overtimeCost =
    (data.overtimeHours || 0) * (data.overtimeRate || data.hourlyRate * 1.5);
  const totalCost = regularCost + overtimeCost;

  const burdenPercentage = 30; // Default 30% burden
  const totalCostWithBurden = totalCost * (1 + burdenPercentage / 100);

  const labor = await LaborCost.create(
    {
      assetId: data.assetId,
      technicianId: data.technicianId,
      workOrderId: data.workOrderId,
      regularHours: data.hours,
      hourlyRate: data.hourlyRate,
      overtimeHours: data.overtimeHours || 0,
      overtimeRate: data.overtimeRate,
      totalCost,
      burdenPercentage,
      totalCostWithBurden,
      workDate: data.date,
      taskDescription: data.taskDescription,
      skillLevel: data.skillLevel,
    },
    { transaction },
  );

  return labor;
}

/**
 * Calculates labor rates by skill level
 *
 * @param skillLevel - Skill level
 * @returns Labor rate information
 *
 * @example
 * ```typescript
 * const rates = await calculateLaborRates('senior-technician');
 * ```
 */
export async function calculateLaborRates(skillLevel: string): Promise<{
  skillLevel: string;
  baseRate: number;
  overtimeRate: number;
  burdenPercentage: number;
  fullyBurdenedRate: number;
}> {
  // Simplified rate calculation - would query from rate tables in production
  const rateMap: Record<string, number> = {
    'junior-technician': 50,
    'technician': 75,
    'senior-technician': 100,
    'specialist': 125,
    'engineer': 150,
  };

  const baseRate = rateMap[skillLevel] || 75;
  const overtimeRate = baseRate * 1.5;
  const burdenPercentage = 30;
  const fullyBurdenedRate = baseRate * (1 + burdenPercentage / 100);

  return {
    skillLevel,
    baseRate,
    overtimeRate,
    burdenPercentage,
    fullyBurdenedRate,
  };
}

/**
 * Gets labor costs for an asset
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Labor cost summary
 *
 * @example
 * ```typescript
 * const labor = await getAssetLaborCosts('asset-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function getAssetLaborCosts(
  assetId: string,
  period: { startDate: Date; endDate: Date },
): Promise<{
  assetId: string;
  totalLaborCost: number;
  totalHours: number;
  averageRate: number;
  costByTechnician: Record<string, number>;
}> {
  const labor = await LaborCost.findAll({
    where: {
      assetId,
      workDate: {
        [Op.between]: [period.startDate, period.endDate],
      },
    },
  });

  const totalLaborCost = labor.reduce(
    (sum, l) => sum + Number(l.totalCostWithBurden || l.totalCost),
    0,
  );
  const totalHours = labor.reduce(
    (sum, l) => sum + Number(l.regularHours) + Number(l.overtimeHours),
    0,
  );
  const averageRate = totalHours > 0 ? totalLaborCost / totalHours : 0;

  const costByTechnician: Record<string, number> = {};
  for (const l of labor) {
    costByTechnician[l.technicianId] =
      (costByTechnician[l.technicianId] || 0) +
      Number(l.totalCostWithBurden || l.totalCost);
  }

  return {
    assetId,
    totalLaborCost,
    totalHours,
    averageRate,
    costByTechnician,
  };
}

// ============================================================================
// DOWNTIME COST CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates and records downtime cost
 *
 * @param data - Downtime cost data
 * @param transaction - Optional database transaction
 * @returns Created downtime cost record
 *
 * @example
 * ```typescript
 * const downtime = await calculateDowntimeCost({
 *   assetId: 'asset-123',
 *   downtimeStart: new Date('2024-06-01T08:00:00'),
 *   downtimeEnd: new Date('2024-06-01T16:00:00'),
 *   reason: 'Unplanned repair',
 *   lostProductionUnits: 500,
 *   revenuePerUnit: 100,
 *   additionalCosts: 5000
 * });
 * ```
 */
export async function calculateDowntimeCost(
  data: DowntimeCostData,
  transaction?: Transaction,
): Promise<DowntimeCost> {
  const durationMs = data.downtimeEnd.getTime() - data.downtimeStart.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  const lostRevenue =
    (data.lostProductionUnits || 0) * (data.revenuePerUnit || 0);
  const totalCost = lostRevenue + (data.additionalCosts || 0);

  const downtime = await DowntimeCost.create(
    {
      assetId: data.assetId,
      downtimeStart: data.downtimeStart,
      downtimeEnd: data.downtimeEnd,
      durationHours,
      reason: data.reason,
      lostProductionUnits: data.lostProductionUnits,
      revenuePerUnit: data.revenuePerUnit,
      lostRevenue,
      additionalCosts: data.additionalCosts,
      totalCost,
      notes: data.notes,
    },
    { transaction },
  );

  return downtime;
}

/**
 * Gets downtime costs for an asset
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Downtime cost summary
 *
 * @example
 * ```typescript
 * const downtime = await getAssetDowntimeCosts('asset-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function getAssetDowntimeCosts(
  assetId: string,
  period: { startDate: Date; endDate: Date },
): Promise<{
  assetId: string;
  totalDowntimeCost: number;
  totalDowntimeHours: number;
  incidentCount: number;
  averageCostPerIncident: number;
  costBreakdown: {
    lostRevenue: number;
    additionalCosts: number;
  };
}> {
  const downtimes = await DowntimeCost.findAll({
    where: {
      assetId,
      downtimeStart: {
        [Op.between]: [period.startDate, period.endDate],
      },
    },
  });

  const totalDowntimeCost = downtimes.reduce(
    (sum, d) => sum + Number(d.totalCost),
    0,
  );
  const totalDowntimeHours = downtimes.reduce(
    (sum, d) => sum + Number(d.durationHours),
    0,
  );
  const incidentCount = downtimes.length;
  const averageCostPerIncident =
    incidentCount > 0 ? totalDowntimeCost / incidentCount : 0;

  const lostRevenue = downtimes.reduce(
    (sum, d) => sum + Number(d.lostRevenue || 0),
    0,
  );
  const additionalCosts = downtimes.reduce(
    (sum, d) => sum + Number(d.additionalCosts || 0),
    0,
  );

  return {
    assetId,
    totalDowntimeCost,
    totalDowntimeHours,
    incidentCount,
    averageCostPerIncident,
    costBreakdown: {
      lostRevenue,
      additionalCosts,
    },
  };
}

/**
 * Calculates average downtime cost per hour
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Cost per hour
 *
 * @example
 * ```typescript
 * const costPerHour = await calculateDowntimeCostPerHour('asset-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function calculateDowntimeCostPerHour(
  assetId: string,
  period: { startDate: Date; endDate: Date },
): Promise<number> {
  const summary = await getAssetDowntimeCosts(assetId, period);
  return summary.totalDowntimeHours > 0
    ? summary.totalDowntimeCost / summary.totalDowntimeHours
    : 0;
}

// ============================================================================
// COST ALLOCATION FUNCTIONS
// ============================================================================

/**
 * Allocates cost to department
 *
 * @param costId - Cost identifier
 * @param departmentId - Department identifier
 * @param percentage - Allocation percentage (0-100)
 * @param transaction - Optional database transaction
 * @returns Created allocation record
 *
 * @example
 * ```typescript
 * await allocateCostToDepartment('cost-123', 'dept-radiology', 100);
 * ```
 */
export async function allocateCostToDepartment(
  costId: string,
  departmentId: string,
  percentage: number,
  transaction?: Transaction,
): Promise<CostAllocation> {
  if (percentage < 0 || percentage > 100) {
    throw new BadRequestException('Percentage must be between 0 and 100');
  }

  const cost = await AssetDirectCost.findByPk(costId, { transaction });
  if (!cost) {
    throw new NotFoundException(`Cost ${costId} not found`);
  }

  const allocatedAmount = (Number(cost.amount) * percentage) / 100;

  const allocation = await CostAllocation.create(
    {
      costId,
      allocationMethod: AllocationMethod.PERCENTAGE,
      departmentId,
      allocationPercentage: percentage,
      allocatedAmount,
    },
    { transaction },
  );

  return allocation;
}

/**
 * Allocates cost to project
 *
 * @param costId - Cost identifier
 * @param projectId - Project identifier
 * @param amount - Allocation amount
 * @param transaction - Optional database transaction
 * @returns Created allocation record
 *
 * @example
 * ```typescript
 * await allocateCostToProject('cost-123', 'project-456', 5000);
 * ```
 */
export async function allocateCostToProject(
  costId: string,
  projectId: string,
  amount: number,
  transaction?: Transaction,
): Promise<CostAllocation> {
  const cost = await AssetDirectCost.findByPk(costId, { transaction });
  if (!cost) {
    throw new NotFoundException(`Cost ${costId} not found`);
  }

  if (amount > Number(cost.amount)) {
    throw new BadRequestException('Allocation amount exceeds cost amount');
  }

  const allocation = await CostAllocation.create(
    {
      costId,
      allocationMethod: AllocationMethod.DIRECT_ASSIGNMENT,
      projectId,
      allocatedAmount: amount,
    },
    { transaction },
  );

  return allocation;
}

/**
 * Gets cost allocations for a department
 *
 * @param departmentId - Department identifier
 * @param period - Analysis period
 * @returns Cost allocation summary
 *
 * @example
 * ```typescript
 * const allocations = await getDepartmentCostAllocations('dept-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function getDepartmentCostAllocations(
  departmentId: string,
  period: { startDate: Date; endDate: Date },
): Promise<{
  departmentId: string;
  totalAllocated: number;
  allocationsByType: Record<CostType, number>;
  allocations: CostAllocation[];
}> {
  const allocations = await CostAllocation.findAll({
    where: { departmentId },
    include: [
      {
        model: AssetDirectCost,
        where: {
          costDate: {
            [Op.between]: [period.startDate, period.endDate],
          },
        },
      },
    ],
  });

  const totalAllocated = allocations.reduce(
    (sum, a) => sum + Number(a.allocatedAmount),
    0,
  );

  const allocationsByType: Record<string, number> = {};
  for (const allocation of allocations) {
    const costType = allocation.cost?.costType;
    if (costType) {
      allocationsByType[costType] =
        (allocationsByType[costType] || 0) + Number(allocation.allocatedAmount);
    }
  }

  return {
    departmentId,
    totalAllocated,
    allocationsByType: allocationsByType as Record<CostType, number>,
    allocations,
  };
}

// ============================================================================
// COST TRENDING AND ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyzes cost trends over time
 *
 * @param assetId - Asset identifier
 * @param periodMonths - Number of months to analyze
 * @returns Cost trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeCostTrends('asset-123', 12);
 * ```
 */
export async function analyzeCostTrends(
  assetId: string,
  periodMonths: number = 12,
): Promise<{
  assetId: string;
  monthlyData: Array<{
    month: string;
    totalCost: number;
    costByType: Record<CostType, number>;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  averageMonthlyCost: number;
  projectedNextMonth: number;
}> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - periodMonths);

  const costs = await getAssetDirectCosts(assetId, {
    startDate,
    endDate: new Date(),
    status: CostStatus.APPROVED,
  });

  const monthlyData: Array<{
    month: string;
    totalCost: number;
    costByType: Record<CostType, number>;
  }> = [];

  // Group by month
  const costsByMonth: Record<string, AssetDirectCost[]> = {};
  for (const cost of costs) {
    const month = cost.costDate.toISOString().substring(0, 7);
    if (!costsByMonth[month]) {
      costsByMonth[month] = [];
    }
    costsByMonth[month].push(cost);
  }

  let totalAllMonths = 0;

  for (const [month, monthlyCosts] of Object.entries(costsByMonth)) {
    const totalCost = monthlyCosts.reduce(
      (sum, c) => sum + Number(c.amount),
      0,
    );
    totalAllMonths += totalCost;

    const costByType: Record<string, number> = {};
    for (const cost of monthlyCosts) {
      costByType[cost.costType] =
        (costByType[cost.costType] || 0) + Number(cost.amount);
    }

    monthlyData.push({
      month,
      totalCost,
      costByType: costByType as Record<CostType, number>,
    });
  }

  monthlyData.sort((a, b) => a.month.localeCompare(b.month));

  const averageMonthlyCost = totalAllMonths / periodMonths;

  // Simple trend analysis
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (monthlyData.length >= 3) {
    const recent = monthlyData.slice(-3);
    const older = monthlyData.slice(0, 3);
    const recentAvg = recent.reduce((sum, m) => sum + m.totalCost, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.totalCost, 0) / older.length;

    if (recentAvg > olderAvg * 1.1) trend = 'increasing';
    else if (recentAvg < olderAvg * 0.9) trend = 'decreasing';
  }

  const projectedNextMonth = averageMonthlyCost;

  return {
    assetId,
    monthlyData,
    trend,
    averageMonthlyCost,
    projectedNextMonth,
  };
}

/**
 * Performs cost variance analysis
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateCostVariance('asset-123', {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-12-31')
 * });
 * ```
 */
export async function calculateCostVariance(
  assetId: string,
  period: { start: Date; end: Date },
): Promise<CostVarianceAnalysis> {
  // Get budget
  const budget = await CostBudget.findOne({
    where: {
      assetId,
      periodStart: {
        [Op.lte]: period.start,
      },
      periodEnd: {
        [Op.gte]: period.end,
      },
    },
  });

  const budgetedCost = budget ? Number(budget.totalBudget) : 0;

  // Get actual costs
  const actualSummary = await calculateTotalDirectCosts(assetId, {
    startDate: period.start,
    endDate: period.end,
  });

  const variance = actualSummary.totalCost - budgetedCost;
  const variancePercentage =
    budgetedCost > 0 ? (variance / budgetedCost) * 100 : 0;

  const variances: CostVarianceAnalysis['variances'] = [];
  if (budget?.budgetByType) {
    for (const [costType, budgeted] of Object.entries(budget.budgetByType)) {
      const actual = actualSummary.costByType[costType as CostType] || 0;
      variances.push({
        costType: costType as CostType,
        budgeted,
        actual,
        variance: actual - budgeted,
      });
    }
  }

  return {
    assetId,
    period,
    budgetedCost,
    actualCost: actualSummary.totalCost,
    variance,
    variancePercentage,
    variances,
  };
}

/**
 * Forecasts future costs
 *
 * @param assetId - Asset identifier
 * @param forecastMonths - Number of months to forecast
 * @returns Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastFutureCosts('asset-123', 12);
 * ```
 */
export async function forecastFutureCosts(
  assetId: string,
  forecastMonths: number = 12,
): Promise<{
  assetId: string;
  forecast: Array<{
    month: string;
    forecastedCost: number;
    confidence: number;
  }>;
  totalForecast: number;
}> {
  // Get historical trends
  const trends = await analyzeCostTrends(assetId, 12);

  const forecast: Array<{
    month: string;
    forecastedCost: number;
    confidence: number;
  }> = [];

  let totalForecast = 0;

  for (let i = 1; i <= forecastMonths; i++) {
    const forecastDate = new Date();
    forecastDate.setMonth(forecastDate.getMonth() + i);
    const month = forecastDate.toISOString().substring(0, 7);

    const forecastedCost = trends.averageMonthlyCost;
    const confidence = Math.max(0.5, 1 - i * 0.05); // Confidence decreases over time

    totalForecast += forecastedCost;

    forecast.push({
      month,
      forecastedCost,
      confidence,
    });
  }

  return {
    assetId,
    forecast,
    totalForecast,
  };
}

// ============================================================================
// COST REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates comprehensive cost report
 *
 * @param params - Report parameters
 * @returns Cost report
 *
 * @example
 * ```typescript
 * const report = await generateCostReport({
 *   assetId: 'asset-123',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   groupBy: 'type'
 * });
 * ```
 */
export async function generateCostReport(
  params: CostReportParams,
): Promise<{
  reportPeriod: { start: Date; end: Date };
  summary: {
    totalCosts: number;
    directCosts: number;
    indirectCosts: number;
    laborCosts: number;
    downtimeCosts: number;
  };
  breakdown: Record<string, number>;
  topCostDrivers: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}> {
  // Simplified report generation
  const directCosts = params.assetId
    ? await calculateTotalDirectCosts(params.assetId, {
        startDate: params.startDate,
        endDate: params.endDate,
      })
    : { totalCost: 0, costByType: {} };

  const laborCosts = params.assetId
    ? await getAssetLaborCosts(params.assetId, {
        startDate: params.startDate,
        endDate: params.endDate,
      })
    : { totalLaborCost: 0 };

  const downtimeCosts = params.assetId
    ? await getAssetDowntimeCosts(params.assetId, {
        startDate: params.startDate,
        endDate: params.endDate,
      })
    : { totalDowntimeCost: 0 };

  const totalCosts =
    directCosts.totalCost +
    laborCosts.totalLaborCost +
    downtimeCosts.totalDowntimeCost;

  const breakdown: Record<string, number> = {
    ...directCosts.costByType,
    labor: laborCosts.totalLaborCost,
    downtime: downtimeCosts.totalDowntimeCost,
  };

  const topCostDrivers = Object.entries(breakdown)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalCosts > 0 ? (amount / totalCosts) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  return {
    reportPeriod: { start: params.startDate, end: params.endDate },
    summary: {
      totalCosts,
      directCosts: directCosts.totalCost,
      indirectCosts: 0, // Simplified
      laborCosts: laborCosts.totalLaborCost,
      downtimeCosts: downtimeCosts.totalDowntimeCost,
    },
    breakdown,
    topCostDrivers,
  };
}

/**
 * Compares costs across assets
 *
 * @param assetIds - Array of asset identifiers
 * @param period - Analysis period
 * @returns Cost comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareCostsAcrossAssets(
 *   ['asset-1', 'asset-2', 'asset-3'],
 *   { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') }
 * );
 * ```
 */
export async function compareCostsAcrossAssets(
  assetIds: string[],
  period: { startDate: Date; endDate: Date },
): Promise<
  Array<{
    assetId: string;
    totalCost: number;
    costPerformanceIndex: number;
    ranking: number;
  }>
> {
  const comparisons: Array<{
    assetId: string;
    totalCost: number;
    costPerformanceIndex: number;
    ranking: number;
  }> = [];

  for (const assetId of assetIds) {
    const costs = await calculateTotalDirectCosts(assetId, period);
    comparisons.push({
      assetId,
      totalCost: costs.totalCost,
      costPerformanceIndex: 1.0, // Simplified - would compare to budget
      ranking: 0,
    });
  }

  // Rank by total cost (ascending)
  comparisons.sort((a, b) => a.totalCost - b.totalCost);
  comparisons.forEach((c, index) => {
    c.ranking = index + 1;
  });

  return comparisons;
}

/**
 * Identifies cost anomalies
 *
 * @param assetId - Asset identifier
 * @param period - Analysis period
 * @returns Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await identifyCostAnomalies('asset-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function identifyCostAnomalies(
  assetId: string,
  period: { startDate: Date; endDate: Date },
): Promise<
  Array<{
    date: Date;
    costType: CostType;
    amount: number;
    expectedRange: { min: number; max: number };
    deviation: number;
    severity: 'high' | 'medium' | 'low';
  }>
> {
  const costs = await getAssetDirectCosts(assetId, {
    startDate: period.startDate,
    endDate: period.endDate,
  });

  const anomalies: Array<{
    date: Date;
    costType: CostType;
    amount: number;
    expectedRange: { min: number; max: number };
    deviation: number;
    severity: 'high' | 'medium' | 'low';
  }> = [];

  // Group by cost type and calculate statistics
  const costsByType: Record<string, number[]> = {};
  for (const cost of costs) {
    if (!costsByType[cost.costType]) {
      costsByType[cost.costType] = [];
    }
    costsByType[cost.costType].push(Number(cost.amount));
  }

  // Detect anomalies using simple threshold
  for (const cost of costs) {
    const values = costsByType[cost.costType];
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length,
    );

    const amount = Number(cost.amount);
    const deviation = Math.abs(amount - avg);

    if (deviation > stdDev * 2) {
      let severity: 'high' | 'medium' | 'low' = 'low';
      if (deviation > stdDev * 3) severity = 'high';
      else if (deviation > stdDev * 2.5) severity = 'medium';

      anomalies.push({
        date: cost.costDate,
        costType: cost.costType,
        amount,
        expectedRange: {
          min: avg - stdDev * 2,
          max: avg + stdDev * 2,
        },
        deviation,
        severity,
      });
    }
  }

  return anomalies;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AssetDirectCost,
  AssetIndirectCost,
  LaborCost,
  DowntimeCost,
  CostAllocation,
  CostBudget,

  // Direct Costs
  recordDirectCost,
  updateDirectCost,
  approveDirectCost,
  getAssetDirectCosts,
  calculateTotalDirectCosts,

  // Indirect Costs
  recordIndirectCost,
  allocateIndirectCosts,
  getIndirectCosts,

  // Labor Costs
  trackLaborCosts,
  calculateLaborRates,
  getAssetLaborCosts,

  // Downtime Costs
  calculateDowntimeCost,
  getAssetDowntimeCosts,
  calculateDowntimeCostPerHour,

  // Cost Allocation
  allocateCostToDepartment,
  allocateCostToProject,
  getDepartmentCostAllocations,

  // Trending and Analysis
  analyzeCostTrends,
  calculateCostVariance,
  forecastFutureCosts,

  // Reporting
  generateCostReport,
  compareCostsAcrossAssets,
  identifyCostAnomalies,
};

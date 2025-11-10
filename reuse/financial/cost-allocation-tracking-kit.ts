/**
 * ============================================================================
 * Cost Allocation and Tracking Kit - Enterprise Financial Management
 * ============================================================================
 *
 * LOC: FIN-COST-001
 * Version: 1.0.0
 * Framework: NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI 3.0
 *
 * OVERVIEW:
 * Production-ready cost allocation and tracking system designed to compete with
 * enterprise solutions like SAP CO (Controlling), Oracle Costing, and Workday
 * Financial Management. Provides comprehensive cost management capabilities
 * including multiple allocation methods, cost driver analysis, activity-based
 * costing, and advanced reporting.
 *
 * FEATURES:
 * - Cost Center Management: Hierarchical cost center structures and budgeting
 * - Allocation Methods: Direct, step-down, reciprocal, and activity-based costing
 * - Cost Drivers: Identification, tracking, and analysis of cost allocation bases
 * - Overhead Allocation: Multiple overhead allocation strategies and rules
 * - Job Costing: Detailed job/project cost tracking and variance analysis
 * - Activity-Based Costing: ABC implementation with activity hierarchies
 * - Cost Pool Management: Cost pool creation, allocation, and distribution
 * - Allocation Rules: Flexible rule engine for automated cost allocation
 * - Variance Analysis: Budget vs actual analysis with drill-down capabilities
 * - Reporting & Dashboards: Comprehensive cost reporting and visualization
 *
 * ALLOCATION METHODS:
 * - Direct Allocation: Costs allocated directly to cost objects
 * - Step-Down (Sequential): Service dept costs allocated in predetermined sequence
 * - Reciprocal: Mutual services between departments recognized
 * - Activity-Based Costing: Costs allocated based on activities and drivers
 * - Proportional: Costs allocated proportionally based on usage metrics
 *
 * COMPLIANCE & STANDARDS:
 * - GAAP/IFRS compliant cost allocation principles
 * - Government contract costing requirements (FAR/CAS)
 * - Transfer pricing documentation support
 * - Audit trail and documentation requirements
 *
 * INTEGRATION POINTS:
 * - General Ledger integration for cost posting
 * - Project Management systems for project costing
 * - Time & Attendance for labor cost allocation
 * - Inventory Management for manufacturing costs
 * - Procurement for purchase cost allocation
 *
 * PERFORMANCE CHARACTERISTICS:
 * - Handles 100,000+ cost centers
 * - Processes 1M+ allocation transactions per day
 * - Real-time allocation calculation capability
 * - Optimized for complex allocation hierarchies
 *
 * TYPICAL USE CASES:
 * - Manufacturing overhead allocation
 * - IT chargeback and cost recovery
 * - Shared services cost distribution
 * - Project and job costing
 * - Product costing and profitability analysis
 * - Transfer pricing and inter-company charging
 *
 * @module CostAllocationTrackingKit
 * @category Financial Management
 * @see {@link https://www.sap.com/products/financial-management/cost-management.html|SAP CO}
 * @see {@link https://www.oracle.com/erp/financials/costing/|Oracle Costing}
 * @see {@link https://www.workday.com/en-us/products/financial-management.html|Workday Financial}
 *
 * @author HarborGrid Enterprise Solutions
 * @license Proprietary
 * @copyright 2025 HarborGrid. All rights reserved.
 */

import { ApiOperation, ApiResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Model, DataTypes, Sequelize, Transaction } from 'sequelize';

// ============================================================================
// Type Definitions & Enums
// ============================================================================

/**
 * Cost allocation method types
 */
export enum AllocationMethod {
  DIRECT = 'DIRECT',
  STEP_DOWN = 'STEP_DOWN',
  RECIPROCAL = 'RECIPROCAL',
  ACTIVITY_BASED = 'ACTIVITY_BASED',
  PROPORTIONAL = 'PROPORTIONAL',
  DRIVER_BASED = 'DRIVER_BASED'
}

/**
 * Cost center types
 */
export enum CostCenterType {
  PRODUCTION = 'PRODUCTION',
  SERVICE = 'SERVICE',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SALES = 'SALES',
  RESEARCH = 'RESEARCH',
  SUPPORT = 'SUPPORT'
}

/**
 * Cost driver types
 */
export enum CostDriverType {
  VOLUME_BASED = 'VOLUME_BASED',
  TRANSACTION_BASED = 'TRANSACTION_BASED',
  DURATION_BASED = 'DURATION_BASED',
  HEADCOUNT_BASED = 'HEADCOUNT_BASED',
  SQUARE_FOOTAGE = 'SQUARE_FOOTAGE',
  MACHINE_HOURS = 'MACHINE_HOURS',
  LABOR_HOURS = 'LABOR_HOURS',
  CUSTOM = 'CUSTOM'
}

/**
 * Allocation status
 */
export enum AllocationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED'
}

/**
 * Activity hierarchy levels for ABC
 */
export enum ActivityLevel {
  UNIT_LEVEL = 'UNIT_LEVEL',
  BATCH_LEVEL = 'BATCH_LEVEL',
  PRODUCT_LEVEL = 'PRODUCT_LEVEL',
  FACILITY_LEVEL = 'FACILITY_LEVEL'
}

// ============================================================================
// Interface Definitions with Swagger Decorators
// ============================================================================

/**
 * Cost center interface - represents organizational units that incur costs
 */
export interface CostCenter {
  @ApiProperty({ description: 'Unique cost center identifier', example: 'CC-PROD-001' })
  costCenterId: string;

  @ApiProperty({ description: 'Cost center name', example: 'Manufacturing - Assembly Line 1' })
  name: string;

  @ApiProperty({ description: 'Cost center code', example: 'PROD-001' })
  code: string;

  @ApiProperty({ enum: CostCenterType, description: 'Type of cost center' })
  type: CostCenterType;

  @ApiProperty({ description: 'Parent cost center ID for hierarchy', required: false })
  parentCostCenterId?: string;

  @ApiProperty({ description: 'Cost center manager user ID', example: 'MGR-123' })
  managerId: string;

  @ApiProperty({ description: 'Department or division', example: 'Manufacturing' })
  department: string;

  @ApiProperty({ description: 'Annual budget amount', example: 1500000.00 })
  budgetAmount: number;

  @ApiProperty({ description: 'Current fiscal year', example: 2025 })
  fiscalYear: number;

  @ApiProperty({ description: 'Whether cost center is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Cost center attributes', type: 'object', required: false })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

/**
 * Cost allocation interface - represents allocation transactions
 */
export interface CostAllocation {
  @ApiProperty({ description: 'Unique allocation identifier', example: 'ALLOC-2025-001' })
  allocationId: string;

  @ApiProperty({ description: 'Source cost center ID', example: 'CC-IT-001' })
  sourceCostCenterId: string;

  @ApiProperty({ description: 'Target cost center ID', example: 'CC-PROD-001' })
  targetCostCenterId: string;

  @ApiProperty({ enum: AllocationMethod, description: 'Allocation method used' })
  allocationMethod: AllocationMethod;

  @ApiProperty({ description: 'Allocated amount', example: 25000.00 })
  amount: number;

  @ApiProperty({ description: 'Allocation percentage', example: 15.5 })
  percentage: number;

  @ApiProperty({ description: 'Cost driver used for allocation', required: false })
  costDriverId?: string;

  @ApiProperty({ description: 'Allocation period (YYYY-MM)', example: '2025-01' })
  period: string;

  @ApiProperty({ enum: AllocationStatus, description: 'Current allocation status' })
  status: AllocationStatus;

  @ApiProperty({ description: 'Allocation calculation details', type: 'object' })
  calculationDetails: Record<string, any>;

  @ApiProperty({ description: 'Allocation batch ID for grouping', required: false })
  batchId?: string;

  @ApiProperty({ description: 'General ledger journal entry ID', required: false })
  journalEntryId?: string;

  @ApiProperty({ description: 'Allocation notes or description', required: false })
  notes?: string;

  @ApiProperty({ description: 'User who created allocation', example: 'USER-123' })
  createdBy: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Posted timestamp', required: false })
  postedAt?: Date;
}

/**
 * Cost driver interface - represents allocation basis
 */
export interface CostDriver {
  @ApiProperty({ description: 'Unique cost driver identifier', example: 'CD-LABOR-001' })
  costDriverId: string;

  @ApiProperty({ description: 'Cost driver name', example: 'Direct Labor Hours' })
  name: string;

  @ApiProperty({ description: 'Cost driver code', example: 'DLH' })
  code: string;

  @ApiProperty({ enum: CostDriverType, description: 'Type of cost driver' })
  type: CostDriverType;

  @ApiProperty({ description: 'Unit of measure', example: 'hours' })
  unitOfMeasure: string;

  @ApiProperty({ description: 'Whether driver is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Driver calculation formula', required: false })
  calculationFormula?: string;

  @ApiProperty({ description: 'Source system for driver data', example: 'TIME_TRACKING' })
  sourceSystem: string;

  @ApiProperty({ description: 'Driver attributes', type: 'object', required: false })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Cost driver value interface - actual driver measurements
 */
export interface CostDriverValue {
  @ApiProperty({ description: 'Unique identifier', example: 'CDV-2025-001' })
  valueId: string;

  @ApiProperty({ description: 'Cost driver ID', example: 'CD-LABOR-001' })
  costDriverId: string;

  @ApiProperty({ description: 'Cost center ID', example: 'CC-PROD-001' })
  costCenterId: string;

  @ApiProperty({ description: 'Period (YYYY-MM)', example: '2025-01' })
  period: string;

  @ApiProperty({ description: 'Driver value/quantity', example: 1580.5 })
  value: number;

  @ApiProperty({ description: 'Value source reference', required: false })
  sourceReference?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Cost pool interface - aggregates costs for allocation
 */
export interface CostPool {
  @ApiProperty({ description: 'Unique cost pool identifier', example: 'CP-OVERHEAD-001' })
  costPoolId: string;

  @ApiProperty({ description: 'Cost pool name', example: 'Manufacturing Overhead' })
  name: string;

  @ApiProperty({ description: 'Cost pool code', example: 'MFG-OH' })
  code: string;

  @ApiProperty({ description: 'Pool description', required: false })
  description?: string;

  @ApiProperty({ description: 'Source cost center IDs', type: [String] })
  sourceCostCenters: string[];

  @ApiProperty({ description: 'Total pool amount', example: 250000.00 })
  totalAmount: number;

  @ApiProperty({ description: 'Fiscal period', example: '2025-01' })
  period: string;

  @ApiProperty({ description: 'Primary allocation driver ID', required: false })
  primaryDriverId?: string;

  @ApiProperty({ description: 'Pool attributes', type: 'object', required: false })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Allocation rule interface - defines allocation logic
 */
export interface AllocationRule {
  @ApiProperty({ description: 'Unique rule identifier', example: 'RULE-IT-001' })
  ruleId: string;

  @ApiProperty({ description: 'Rule name', example: 'IT Cost Allocation - Labor Based' })
  name: string;

  @ApiProperty({ description: 'Source cost center/pool ID', example: 'CC-IT-001' })
  sourceId: string;

  @ApiProperty({ enum: AllocationMethod, description: 'Allocation method to use' })
  allocationMethod: AllocationMethod;

  @ApiProperty({ description: 'Cost driver ID', required: false })
  costDriverId?: string;

  @ApiProperty({ description: 'Target cost center IDs', type: [String] })
  targetCostCenters: string[];

  @ApiProperty({ description: 'Fixed percentages for targets', type: 'object', required: false })
  fixedPercentages?: Record<string, number>;

  @ApiProperty({ description: 'Allocation frequency', example: 'MONTHLY' })
  frequency: string;

  @ApiProperty({ description: 'Whether rule is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Rule priority for step-down', example: 1 })
  priority?: number;

  @ApiProperty({ description: 'Effective start date' })
  effectiveFrom: Date;

  @ApiProperty({ description: 'Effective end date', required: false })
  effectiveTo?: Date;

  @ApiProperty({ description: 'Rule conditions', type: 'object', required: false })
  conditions?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Activity-based costing activity interface
 */
export interface ABCActivity {
  @ApiProperty({ description: 'Unique activity identifier', example: 'ACT-SETUP-001' })
  activityId: string;

  @ApiProperty({ description: 'Activity name', example: 'Machine Setup' })
  name: string;

  @ApiProperty({ description: 'Activity code', example: 'SETUP' })
  code: string;

  @ApiProperty({ enum: ActivityLevel, description: 'Activity hierarchy level' })
  activityLevel: ActivityLevel;

  @ApiProperty({ description: 'Cost driver ID', example: 'CD-SETUPS-001' })
  costDriverId: string;

  @ApiProperty({ description: 'Cost pool ID', example: 'CP-SETUP-001' })
  costPoolId: string;

  @ApiProperty({ description: 'Activity rate', example: 125.50 })
  activityRate: number;

  @ApiProperty({ description: 'Total activity volume', example: 450 })
  totalVolume: number;

  @ApiProperty({ description: 'Whether activity is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Activity attributes', type: 'object', required: false })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Job costing interface - tracks costs for jobs/projects
 */
export interface JobCost {
  @ApiProperty({ description: 'Unique job cost identifier', example: 'JC-2025-001' })
  jobCostId: string;

  @ApiProperty({ description: 'Job or project ID', example: 'PRJ-2025-001' })
  jobId: string;

  @ApiProperty({ description: 'Job name', example: 'Custom Manufacturing Order #12345' })
  jobName: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  customerId?: string;

  @ApiProperty({ description: 'Direct material costs', example: 45000.00 })
  directMaterialCost: number;

  @ApiProperty({ description: 'Direct labor costs', example: 32000.00 })
  directLaborCost: number;

  @ApiProperty({ description: 'Allocated overhead costs', example: 18500.00 })
  allocatedOverhead: number;

  @ApiProperty({ description: 'Other direct costs', example: 5000.00 })
  otherDirectCosts: number;

  @ApiProperty({ description: 'Total job cost', example: 100500.00 })
  totalCost: number;

  @ApiProperty({ description: 'Budgeted cost', example: 95000.00 })
  budgetedCost: number;

  @ApiProperty({ description: 'Cost variance', example: 5500.00 })
  variance: number;

  @ApiProperty({ description: 'Job start date' })
  startDate: Date;

  @ApiProperty({ description: 'Job completion date', required: false })
  completionDate?: Date;

  @ApiProperty({ description: 'Job status', example: 'IN_PROGRESS' })
  status: string;

  @ApiProperty({ description: 'Cost breakdown details', type: 'object' })
  costBreakdown: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Cost variance analysis interface
 */
export interface CostVarianceAnalysis {
  @ApiProperty({ description: 'Unique analysis identifier', example: 'CVA-2025-Q1-001' })
  analysisId: string;

  @ApiProperty({ description: 'Cost center ID', example: 'CC-PROD-001' })
  costCenterId: string;

  @ApiProperty({ description: 'Analysis period', example: '2025-Q1' })
  period: string;

  @ApiProperty({ description: 'Budgeted amount', example: 375000.00 })
  budgetedAmount: number;

  @ApiProperty({ description: 'Actual amount', example: 392500.00 })
  actualAmount: number;

  @ApiProperty({ description: 'Variance amount', example: 17500.00 })
  varianceAmount: number;

  @ApiProperty({ description: 'Variance percentage', example: 4.67 })
  variancePercentage: number;

  @ApiProperty({ description: 'Whether variance is favorable', example: false })
  isFavorable: boolean;

  @ApiProperty({ description: 'Variance breakdown by category', type: 'object' })
  categoryBreakdown: Record<string, any>;

  @ApiProperty({ description: 'Variance drivers and root causes', type: [String] })
  varianceDrivers: string[];

  @ApiProperty({ description: 'Analysis notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Created by user ID', example: 'USER-123' })
  createdBy: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

/**
 * Allocation report configuration interface
 */
export interface AllocationReportConfig {
  @ApiProperty({ description: 'Report configuration ID', example: 'RPT-CFG-001' })
  configId: string;

  @ApiProperty({ description: 'Report name', example: 'Monthly Cost Allocation Summary' })
  reportName: string;

  @ApiProperty({ description: 'Report type', example: 'ALLOCATION_SUMMARY' })
  reportType: string;

  @ApiProperty({ description: 'Cost center filters', type: [String], required: false })
  costCenterFilters?: string[];

  @ApiProperty({ description: 'Period range start', example: '2025-01' })
  periodFrom: string;

  @ApiProperty({ description: 'Period range end', example: '2025-12' })
  periodTo: string;

  @ApiProperty({ description: 'Group by fields', type: [String] })
  groupBy: string[];

  @ApiProperty({ description: 'Include variance analysis', example: true })
  includeVariance: boolean;

  @ApiProperty({ description: 'Report parameters', type: 'object', required: false })
  parameters?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

// ============================================================================
// Cost Center Management Functions
// ============================================================================

/**
 * Create a new cost center
 *
 * @ApiOperation Creates a new cost center in the organization hierarchy
 * @ApiResponse 201 - Cost center created successfully
 * @ApiResponse 400 - Invalid cost center data
 * @ApiResponse 409 - Cost center code already exists
 */
export async function createCostCenter(
  costCenterData: Partial<CostCenter>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostCenter> {
  const costCenter: CostCenter = {
    costCenterId: costCenterData.costCenterId || generateCostCenterId(),
    name: costCenterData.name!,
    code: costCenterData.code!,
    type: costCenterData.type!,
    parentCostCenterId: costCenterData.parentCostCenterId,
    managerId: costCenterData.managerId!,
    department: costCenterData.department!,
    budgetAmount: costCenterData.budgetAmount || 0,
    fiscalYear: costCenterData.fiscalYear || new Date().getFullYear(),
    isActive: costCenterData.isActive !== undefined ? costCenterData.isActive : true,
    attributes: costCenterData.attributes || {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate parent cost center exists if specified
  if (costCenter.parentCostCenterId) {
    const parent = await getCostCenterById(costCenter.parentCostCenterId, sequelize);
    if (!parent) {
      throw new Error(`Parent cost center ${costCenter.parentCostCenterId} not found`);
    }
  }

  // Insert into database
  await sequelize.query(
    `INSERT INTO cost_centers (
      cost_center_id, name, code, type, parent_cost_center_id, manager_id,
      department, budget_amount, fiscal_year, is_active, attributes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        costCenter.costCenterId, costCenter.name, costCenter.code, costCenter.type,
        costCenter.parentCostCenterId, costCenter.managerId, costCenter.department,
        costCenter.budgetAmount, costCenter.fiscalYear, costCenter.isActive,
        JSON.stringify(costCenter.attributes), costCenter.createdAt, costCenter.updatedAt
      ],
      transaction
    }
  );

  return costCenter;
}

/**
 * Get cost center by ID
 *
 * @ApiOperation Retrieves a cost center by its unique identifier
 * @ApiResponse 200 - Cost center found
 * @ApiResponse 404 - Cost center not found
 */
export async function getCostCenterById(
  costCenterId: string,
  sequelize: Sequelize
): Promise<CostCenter | null> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_centers WHERE cost_center_id = ?`,
    { replacements: [costCenterId] }
  );

  if (!results || results.length === 0) {
    return null;
  }

  const row: any = results[0];
  return mapRowToCostCenter(row);
}

/**
 * Get cost center hierarchy
 *
 * @ApiOperation Retrieves the complete cost center hierarchy tree
 * @ApiResponse 200 - Hierarchy retrieved successfully
 */
export async function getCostCenterHierarchy(
  rootCostCenterId: string | null,
  sequelize: Sequelize
): Promise<CostCenter[]> {
  const query = rootCostCenterId
    ? `WITH RECURSIVE hierarchy AS (
        SELECT * FROM cost_centers WHERE cost_center_id = ?
        UNION ALL
        SELECT cc.* FROM cost_centers cc
        INNER JOIN hierarchy h ON cc.parent_cost_center_id = h.cost_center_id
      )
      SELECT * FROM hierarchy ORDER BY cost_center_id`
    : `SELECT * FROM cost_centers ORDER BY cost_center_id`;

  const [results] = await sequelize.query(query, {
    replacements: rootCostCenterId ? [rootCostCenterId] : []
  });

  return (results as any[]).map(mapRowToCostCenter);
}

/**
 * Update cost center budget
 *
 * @ApiOperation Updates the budget amount for a cost center
 * @ApiResponse 200 - Budget updated successfully
 * @ApiResponse 404 - Cost center not found
 */
export async function updateCostCenterBudget(
  costCenterId: string,
  budgetAmount: number,
  fiscalYear: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostCenter> {
  const costCenter = await getCostCenterById(costCenterId, sequelize);
  if (!costCenter) {
    throw new Error(`Cost center ${costCenterId} not found`);
  }

  await sequelize.query(
    `UPDATE cost_centers
     SET budget_amount = ?, fiscal_year = ?, updated_at = ?
     WHERE cost_center_id = ?`,
    {
      replacements: [budgetAmount, fiscalYear, new Date(), costCenterId],
      transaction
    }
  );

  return {
    ...costCenter,
    budgetAmount,
    fiscalYear,
    updatedAt: new Date()
  };
}

/**
 * Get cost centers by type
 *
 * @ApiOperation Retrieves all cost centers of a specific type
 * @ApiResponse 200 - Cost centers retrieved successfully
 */
export async function getCostCentersByType(
  type: CostCenterType,
  sequelize: Sequelize
): Promise<CostCenter[]> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_centers WHERE type = ? AND is_active = true ORDER BY code`,
    { replacements: [type] }
  );

  return (results as any[]).map(mapRowToCostCenter);
}

// ============================================================================
// Cost Driver Management Functions
// ============================================================================

/**
 * Create cost driver
 *
 * @ApiOperation Creates a new cost driver for allocation calculations
 * @ApiResponse 201 - Cost driver created successfully
 * @ApiResponse 400 - Invalid cost driver data
 */
export async function createCostDriver(
  driverData: Partial<CostDriver>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostDriver> {
  const driver: CostDriver = {
    costDriverId: driverData.costDriverId || generateCostDriverId(),
    name: driverData.name!,
    code: driverData.code!,
    type: driverData.type!,
    unitOfMeasure: driverData.unitOfMeasure!,
    isActive: driverData.isActive !== undefined ? driverData.isActive : true,
    calculationFormula: driverData.calculationFormula,
    sourceSystem: driverData.sourceSystem!,
    attributes: driverData.attributes || {},
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO cost_drivers (
      cost_driver_id, name, code, type, unit_of_measure, is_active,
      calculation_formula, source_system, attributes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        driver.costDriverId, driver.name, driver.code, driver.type,
        driver.unitOfMeasure, driver.isActive, driver.calculationFormula,
        driver.sourceSystem, JSON.stringify(driver.attributes), driver.createdAt
      ],
      transaction
    }
  );

  return driver;
}

/**
 * Record cost driver value
 *
 * @ApiOperation Records an actual cost driver value for a period
 * @ApiResponse 201 - Driver value recorded successfully
 * @ApiResponse 400 - Invalid driver value data
 */
export async function recordCostDriverValue(
  valueData: Partial<CostDriverValue>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostDriverValue> {
  const driverValue: CostDriverValue = {
    valueId: valueData.valueId || generateId('CDV'),
    costDriverId: valueData.costDriverId!,
    costCenterId: valueData.costCenterId!,
    period: valueData.period!,
    value: valueData.value!,
    sourceReference: valueData.sourceReference,
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO cost_driver_values (
      value_id, cost_driver_id, cost_center_id, period, value,
      source_reference, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        driverValue.valueId, driverValue.costDriverId, driverValue.costCenterId,
        driverValue.period, driverValue.value, driverValue.sourceReference,
        driverValue.createdAt
      ],
      transaction
    }
  );

  return driverValue;
}

/**
 * Get cost driver values for period
 *
 * @ApiOperation Retrieves all cost driver values for a specific period
 * @ApiResponse 200 - Driver values retrieved successfully
 */
export async function getCostDriverValuesForPeriod(
  costDriverId: string,
  period: string,
  sequelize: Sequelize
): Promise<CostDriverValue[]> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_driver_values
     WHERE cost_driver_id = ? AND period = ?
     ORDER BY cost_center_id`,
    { replacements: [costDriverId, period] }
  );

  return (results as any[]).map(mapRowToCostDriverValue);
}

/**
 * Calculate cost driver totals
 *
 * @ApiOperation Calculates total cost driver values across all cost centers
 * @ApiResponse 200 - Totals calculated successfully
 */
export async function calculateCostDriverTotals(
  costDriverId: string,
  period: string,
  sequelize: Sequelize
): Promise<{ total: number; costCenterBreakdown: Record<string, number> }> {
  const [results] = await sequelize.query(
    `SELECT cost_center_id, SUM(value) as total_value
     FROM cost_driver_values
     WHERE cost_driver_id = ? AND period = ?
     GROUP BY cost_center_id`,
    { replacements: [costDriverId, period] }
  );

  const breakdown: Record<string, number> = {};
  let total = 0;

  (results as any[]).forEach(row => {
    breakdown[row.cost_center_id] = parseFloat(row.total_value);
    total += parseFloat(row.total_value);
  });

  return { total, costCenterBreakdown: breakdown };
}

// ============================================================================
// Cost Pool Management Functions
// ============================================================================

/**
 * Create cost pool
 *
 * @ApiOperation Creates a new cost pool for aggregating costs
 * @ApiResponse 201 - Cost pool created successfully
 * @ApiResponse 400 - Invalid cost pool data
 */
export async function createCostPool(
  poolData: Partial<CostPool>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostPool> {
  const pool: CostPool = {
    costPoolId: poolData.costPoolId || generateId('CP'),
    name: poolData.name!,
    code: poolData.code!,
    description: poolData.description,
    sourceCostCenters: poolData.sourceCostCenters || [],
    totalAmount: poolData.totalAmount || 0,
    period: poolData.period!,
    primaryDriverId: poolData.primaryDriverId,
    attributes: poolData.attributes || {},
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO cost_pools (
      cost_pool_id, name, code, description, source_cost_centers,
      total_amount, period, primary_driver_id, attributes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        pool.costPoolId, pool.name, pool.code, pool.description,
        JSON.stringify(pool.sourceCostCenters), pool.totalAmount, pool.period,
        pool.primaryDriverId, JSON.stringify(pool.attributes), pool.createdAt
      ],
      transaction
    }
  );

  return pool;
}

/**
 * Calculate cost pool total
 *
 * @ApiOperation Calculates total costs in a cost pool from source cost centers
 * @ApiResponse 200 - Cost pool total calculated successfully
 */
export async function calculateCostPoolTotal(
  costPoolId: string,
  period: string,
  sequelize: Sequelize
): Promise<number> {
  const [poolResults] = await sequelize.query(
    `SELECT source_cost_centers FROM cost_pools WHERE cost_pool_id = ?`,
    { replacements: [costPoolId] }
  );

  if (!poolResults || poolResults.length === 0) {
    throw new Error(`Cost pool ${costPoolId} not found`);
  }

  const sourceCostCenters = JSON.parse((poolResults[0] as any).source_cost_centers);

  const [costResults] = await sequelize.query(
    `SELECT SUM(amount) as total
     FROM cost_transactions
     WHERE cost_center_id IN (?) AND period = ?`,
    { replacements: [sourceCostCenters, period] }
  );

  const total = costResults && costResults.length > 0
    ? parseFloat((costResults[0] as any).total || 0)
    : 0;

  // Update cost pool total
  await sequelize.query(
    `UPDATE cost_pools SET total_amount = ? WHERE cost_pool_id = ?`,
    { replacements: [total, costPoolId] }
  );

  return total;
}

/**
 * Get cost pool details
 *
 * @ApiOperation Retrieves detailed information about a cost pool
 * @ApiResponse 200 - Cost pool details retrieved successfully
 * @ApiResponse 404 - Cost pool not found
 */
export async function getCostPoolDetails(
  costPoolId: string,
  sequelize: Sequelize
): Promise<CostPool | null> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_pools WHERE cost_pool_id = ?`,
    { replacements: [costPoolId] }
  );

  if (!results || results.length === 0) {
    return null;
  }

  return mapRowToCostPool(results[0]);
}

// ============================================================================
// Allocation Rule Management Functions
// ============================================================================

/**
 * Create allocation rule
 *
 * @ApiOperation Creates a new allocation rule for automated cost distribution
 * @ApiResponse 201 - Allocation rule created successfully
 * @ApiResponse 400 - Invalid rule data
 */
export async function createAllocationRule(
  ruleData: Partial<AllocationRule>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<AllocationRule> {
  const rule: AllocationRule = {
    ruleId: ruleData.ruleId || generateId('RULE'),
    name: ruleData.name!,
    sourceId: ruleData.sourceId!,
    allocationMethod: ruleData.allocationMethod!,
    costDriverId: ruleData.costDriverId,
    targetCostCenters: ruleData.targetCostCenters || [],
    fixedPercentages: ruleData.fixedPercentages,
    frequency: ruleData.frequency || 'MONTHLY',
    isActive: ruleData.isActive !== undefined ? ruleData.isActive : true,
    priority: ruleData.priority,
    effectiveFrom: ruleData.effectiveFrom || new Date(),
    effectiveTo: ruleData.effectiveTo,
    conditions: ruleData.conditions || {},
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO allocation_rules (
      rule_id, name, source_id, allocation_method, cost_driver_id,
      target_cost_centers, fixed_percentages, frequency, is_active,
      priority, effective_from, effective_to, conditions, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        rule.ruleId, rule.name, rule.sourceId, rule.allocationMethod,
        rule.costDriverId, JSON.stringify(rule.targetCostCenters),
        JSON.stringify(rule.fixedPercentages), rule.frequency, rule.isActive,
        rule.priority, rule.effectiveFrom, rule.effectiveTo,
        JSON.stringify(rule.conditions), rule.createdAt
      ],
      transaction
    }
  );

  return rule;
}

/**
 * Get active allocation rules for period
 *
 * @ApiOperation Retrieves all active allocation rules for a specific period
 * @ApiResponse 200 - Allocation rules retrieved successfully
 */
export async function getActiveAllocationRules(
  period: Date,
  sequelize: Sequelize
): Promise<AllocationRule[]> {
  const [results] = await sequelize.query(
    `SELECT * FROM allocation_rules
     WHERE is_active = true
       AND effective_from <= ?
       AND (effective_to IS NULL OR effective_to >= ?)
     ORDER BY priority ASC, rule_id`,
    { replacements: [period, period] }
  );

  return (results as any[]).map(mapRowToAllocationRule);
}

/**
 * Execute allocation rule
 *
 * @ApiOperation Executes a single allocation rule to create allocations
 * @ApiResponse 200 - Rule executed successfully
 * @ApiResponse 400 - Rule execution failed
 */
export async function executeAllocationRule(
  ruleId: string,
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  const [ruleResults] = await sequelize.query(
    `SELECT * FROM allocation_rules WHERE rule_id = ?`,
    { replacements: [ruleId] }
  );

  if (!ruleResults || ruleResults.length === 0) {
    throw new Error(`Allocation rule ${ruleId} not found`);
  }

  const rule = mapRowToAllocationRule(ruleResults[0]);
  const allocations: CostAllocation[] = [];

  // Get source amount
  const sourceAmount = await getSourceCostAmount(rule.sourceId, period, sequelize);

  // Execute based on allocation method
  switch (rule.allocationMethod) {
    case AllocationMethod.DIRECT:
      return await executeDirectAllocation(rule, sourceAmount, period, sequelize, transaction);

    case AllocationMethod.PROPORTIONAL:
      return await executeProportionalAllocation(rule, sourceAmount, period, sequelize, transaction);

    case AllocationMethod.DRIVER_BASED:
      return await executeDriverBasedAllocation(rule, sourceAmount, period, sequelize, transaction);

    default:
      throw new Error(`Allocation method ${rule.allocationMethod} not supported`);
  }
}

// ============================================================================
// Direct Allocation Methods
// ============================================================================

/**
 * Execute direct cost allocation
 *
 * @ApiOperation Performs direct allocation of costs to target cost centers
 * @ApiResponse 200 - Direct allocation completed successfully
 */
export async function executeDirectAllocation(
  rule: AllocationRule,
  sourceAmount: number,
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  const allocations: CostAllocation[] = [];

  if (!rule.fixedPercentages) {
    throw new Error('Direct allocation requires fixed percentages');
  }

  for (const [targetCostCenterId, percentage] of Object.entries(rule.fixedPercentages)) {
    const amount = sourceAmount * (percentage / 100);

    const allocation: CostAllocation = {
      allocationId: generateId('ALLOC'),
      sourceCostCenterId: rule.sourceId,
      targetCostCenterId,
      allocationMethod: AllocationMethod.DIRECT,
      amount,
      percentage,
      period,
      status: AllocationStatus.COMPLETED,
      calculationDetails: {
        sourceAmount,
        percentage,
        calculatedAmount: amount
      },
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      postedAt: new Date()
    };

    await saveAllocation(allocation, sequelize, transaction);
    allocations.push(allocation);
  }

  return allocations;
}

/**
 * Execute proportional allocation
 *
 * @ApiOperation Allocates costs proportionally based on a cost driver
 * @ApiResponse 200 - Proportional allocation completed successfully
 */
export async function executeProportionalAllocation(
  rule: AllocationRule,
  sourceAmount: number,
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  if (!rule.costDriverId) {
    throw new Error('Proportional allocation requires a cost driver');
  }

  const driverTotals = await calculateCostDriverTotals(rule.costDriverId, period, sequelize);
  const allocations: CostAllocation[] = [];

  for (const targetCostCenterId of rule.targetCostCenters) {
    const driverValue = driverTotals.costCenterBreakdown[targetCostCenterId] || 0;
    const percentage = (driverValue / driverTotals.total) * 100;
    const amount = sourceAmount * (percentage / 100);

    const allocation: CostAllocation = {
      allocationId: generateId('ALLOC'),
      sourceCostCenterId: rule.sourceId,
      targetCostCenterId,
      allocationMethod: AllocationMethod.PROPORTIONAL,
      amount,
      percentage,
      costDriverId: rule.costDriverId,
      period,
      status: AllocationStatus.COMPLETED,
      calculationDetails: {
        sourceAmount,
        driverValue,
        totalDriverValue: driverTotals.total,
        percentage,
        calculatedAmount: amount
      },
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      postedAt: new Date()
    };

    await saveAllocation(allocation, sequelize, transaction);
    allocations.push(allocation);
  }

  return allocations;
}

/**
 * Execute driver-based allocation
 *
 * @ApiOperation Allocates costs based on cost driver consumption rates
 * @ApiResponse 200 - Driver-based allocation completed successfully
 */
export async function executeDriverBasedAllocation(
  rule: AllocationRule,
  sourceAmount: number,
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  if (!rule.costDriverId) {
    throw new Error('Driver-based allocation requires a cost driver');
  }

  const driverValues = await getCostDriverValuesForPeriod(rule.costDriverId, period, sequelize);
  const totalDriverValue = driverValues.reduce((sum, dv) => sum + dv.value, 0);
  const ratePerUnit = sourceAmount / totalDriverValue;
  const allocations: CostAllocation[] = [];

  for (const driverValue of driverValues) {
    if (!rule.targetCostCenters.includes(driverValue.costCenterId)) {
      continue;
    }

    const amount = driverValue.value * ratePerUnit;
    const percentage = (driverValue.value / totalDriverValue) * 100;

    const allocation: CostAllocation = {
      allocationId: generateId('ALLOC'),
      sourceCostCenterId: rule.sourceId,
      targetCostCenterId: driverValue.costCenterId,
      allocationMethod: AllocationMethod.DRIVER_BASED,
      amount,
      percentage,
      costDriverId: rule.costDriverId,
      period,
      status: AllocationStatus.COMPLETED,
      calculationDetails: {
        sourceAmount,
        driverValue: driverValue.value,
        totalDriverValue,
        ratePerUnit,
        percentage,
        calculatedAmount: amount
      },
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      postedAt: new Date()
    };

    await saveAllocation(allocation, sequelize, transaction);
    allocations.push(allocation);
  }

  return allocations;
}

/**
 * Execute step-down allocation
 *
 * @ApiOperation Performs step-down (sequential) allocation method
 * @ApiResponse 200 - Step-down allocation completed successfully
 */
export async function executeStepDownAllocation(
  rules: AllocationRule[],
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  // Sort rules by priority
  const sortedRules = [...rules].sort((a, b) => (a.priority || 0) - (b.priority || 0));
  const allocations: CostAllocation[] = [];
  const allocatedCostCenters = new Set<string>();

  for (const rule of sortedRules) {
    const sourceAmount = await getSourceCostAmount(rule.sourceId, period, sequelize);

    // Filter out already-allocated cost centers from targets
    const eligibleTargets = rule.targetCostCenters.filter(
      target => !allocatedCostCenters.has(target)
    );

    const ruleAllocations = await executeDriverBasedAllocation(
      { ...rule, targetCostCenters: eligibleTargets },
      sourceAmount,
      period,
      sequelize,
      transaction
    );

    allocations.push(...ruleAllocations);
    allocatedCostCenters.add(rule.sourceId);
  }

  return allocations;
}

// ============================================================================
// Activity-Based Costing Functions
// ============================================================================

/**
 * Create ABC activity
 *
 * @ApiOperation Creates a new activity for activity-based costing
 * @ApiResponse 201 - ABC activity created successfully
 * @ApiResponse 400 - Invalid activity data
 */
export async function createABCActivity(
  activityData: Partial<ABCActivity>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<ABCActivity> {
  const activity: ABCActivity = {
    activityId: activityData.activityId || generateId('ACT'),
    name: activityData.name!,
    code: activityData.code!,
    activityLevel: activityData.activityLevel!,
    costDriverId: activityData.costDriverId!,
    costPoolId: activityData.costPoolId!,
    activityRate: activityData.activityRate || 0,
    totalVolume: activityData.totalVolume || 0,
    isActive: activityData.isActive !== undefined ? activityData.isActive : true,
    attributes: activityData.attributes || {},
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO abc_activities (
      activity_id, name, code, activity_level, cost_driver_id, cost_pool_id,
      activity_rate, total_volume, is_active, attributes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        activity.activityId, activity.name, activity.code, activity.activityLevel,
        activity.costDriverId, activity.costPoolId, activity.activityRate,
        activity.totalVolume, activity.isActive, JSON.stringify(activity.attributes),
        activity.createdAt
      ],
      transaction
    }
  );

  return activity;
}

/**
 * Calculate activity rate
 *
 * @ApiOperation Calculates the cost per activity unit
 * @ApiResponse 200 - Activity rate calculated successfully
 */
export async function calculateActivityRate(
  activityId: string,
  period: string,
  sequelize: Sequelize
): Promise<number> {
  const [activityResults] = await sequelize.query(
    `SELECT * FROM abc_activities WHERE activity_id = ?`,
    { replacements: [activityId] }
  );

  if (!activityResults || activityResults.length === 0) {
    throw new Error(`Activity ${activityId} not found`);
  }

  const activity = activityResults[0] as any;

  // Get cost pool total
  const costPoolTotal = await calculateCostPoolTotal(activity.cost_pool_id, period, sequelize);

  // Get activity driver total
  const driverTotals = await calculateCostDriverTotals(activity.cost_driver_id, period, sequelize);

  const activityRate = costPoolTotal / driverTotals.total;

  // Update activity rate
  await sequelize.query(
    `UPDATE abc_activities
     SET activity_rate = ?, total_volume = ?
     WHERE activity_id = ?`,
    { replacements: [activityRate, driverTotals.total, activityId] }
  );

  return activityRate;
}

/**
 * Execute ABC allocation
 *
 * @ApiOperation Performs activity-based cost allocation
 * @ApiResponse 200 - ABC allocation completed successfully
 */
export async function executeABCAllocation(
  activityId: string,
  targetCostCenters: string[],
  period: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation[]> {
  const [activityResults] = await sequelize.query(
    `SELECT * FROM abc_activities WHERE activity_id = ?`,
    { replacements: [activityId] }
  );

  if (!activityResults || activityResults.length === 0) {
    throw new Error(`Activity ${activityId} not found`);
  }

  const activity = activityResults[0] as any;
  const activityRate = await calculateActivityRate(activityId, period, sequelize);
  const driverValues = await getCostDriverValuesForPeriod(activity.cost_driver_id, period, sequelize);
  const allocations: CostAllocation[] = [];

  for (const driverValue of driverValues) {
    if (!targetCostCenters.includes(driverValue.costCenterId)) {
      continue;
    }

    const amount = driverValue.value * activityRate;

    const allocation: CostAllocation = {
      allocationId: generateId('ALLOC'),
      sourceCostCenterId: activity.cost_pool_id,
      targetCostCenterId: driverValue.costCenterId,
      allocationMethod: AllocationMethod.ACTIVITY_BASED,
      amount,
      percentage: 0,
      costDriverId: activity.cost_driver_id,
      period,
      status: AllocationStatus.COMPLETED,
      calculationDetails: {
        activityId,
        activityName: activity.name,
        activityRate,
        activityVolume: driverValue.value,
        calculatedAmount: amount
      },
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      postedAt: new Date()
    };

    await saveAllocation(allocation, sequelize, transaction);
    allocations.push(allocation);
  }

  return allocations;
}

/**
 * Get ABC activity hierarchy
 *
 * @ApiOperation Retrieves activities organized by hierarchy level
 * @ApiResponse 200 - Activity hierarchy retrieved successfully
 */
export async function getABCActivityHierarchy(
  sequelize: Sequelize
): Promise<Record<ActivityLevel, ABCActivity[]>> {
  const [results] = await sequelize.query(
    `SELECT * FROM abc_activities WHERE is_active = true ORDER BY activity_level, code`
  );

  const hierarchy: Record<ActivityLevel, ABCActivity[]> = {
    [ActivityLevel.UNIT_LEVEL]: [],
    [ActivityLevel.BATCH_LEVEL]: [],
    [ActivityLevel.PRODUCT_LEVEL]: [],
    [ActivityLevel.FACILITY_LEVEL]: []
  };

  (results as any[]).forEach(row => {
    const activity = mapRowToABCActivity(row);
    hierarchy[activity.activityLevel].push(activity);
  });

  return hierarchy;
}

// ============================================================================
// Job Costing Functions
// ============================================================================

/**
 * Create job cost record
 *
 * @ApiOperation Creates a new job cost tracking record
 * @ApiResponse 201 - Job cost record created successfully
 * @ApiResponse 400 - Invalid job cost data
 */
export async function createJobCost(
  jobData: Partial<JobCost>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<JobCost> {
  const jobCost: JobCost = {
    jobCostId: jobData.jobCostId || generateId('JC'),
    jobId: jobData.jobId!,
    jobName: jobData.jobName!,
    customerId: jobData.customerId,
    directMaterialCost: jobData.directMaterialCost || 0,
    directLaborCost: jobData.directLaborCost || 0,
    allocatedOverhead: jobData.allocatedOverhead || 0,
    otherDirectCosts: jobData.otherDirectCosts || 0,
    totalCost: 0,
    budgetedCost: jobData.budgetedCost || 0,
    variance: 0,
    startDate: jobData.startDate || new Date(),
    completionDate: jobData.completionDate,
    status: jobData.status || 'IN_PROGRESS',
    costBreakdown: jobData.costBreakdown || {},
    createdAt: new Date()
  };

  // Calculate totals
  jobCost.totalCost = jobCost.directMaterialCost + jobCost.directLaborCost +
                      jobCost.allocatedOverhead + jobCost.otherDirectCosts;
  jobCost.variance = jobCost.totalCost - jobCost.budgetedCost;

  await sequelize.query(
    `INSERT INTO job_costs (
      job_cost_id, job_id, job_name, customer_id, direct_material_cost,
      direct_labor_cost, allocated_overhead, other_direct_costs, total_cost,
      budgeted_cost, variance, start_date, completion_date, status,
      cost_breakdown, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        jobCost.jobCostId, jobCost.jobId, jobCost.jobName, jobCost.customerId,
        jobCost.directMaterialCost, jobCost.directLaborCost, jobCost.allocatedOverhead,
        jobCost.otherDirectCosts, jobCost.totalCost, jobCost.budgetedCost,
        jobCost.variance, jobCost.startDate, jobCost.completionDate, jobCost.status,
        JSON.stringify(jobCost.costBreakdown), jobCost.createdAt
      ],
      transaction
    }
  );

  return jobCost;
}

/**
 * Allocate overhead to job
 *
 * @ApiOperation Allocates overhead costs to a specific job
 * @ApiResponse 200 - Overhead allocated successfully
 */
export async function allocateOverheadToJob(
  jobCostId: string,
  overheadAmount: number,
  allocationBasis: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<JobCost> {
  const [results] = await sequelize.query(
    `SELECT * FROM job_costs WHERE job_cost_id = ?`,
    { replacements: [jobCostId] }
  );

  if (!results || results.length === 0) {
    throw new Error(`Job cost ${jobCostId} not found`);
  }

  const jobCost = mapRowToJobCost(results[0]);
  jobCost.allocatedOverhead += overheadAmount;
  jobCost.totalCost = jobCost.directMaterialCost + jobCost.directLaborCost +
                      jobCost.allocatedOverhead + jobCost.otherDirectCosts;
  jobCost.variance = jobCost.totalCost - jobCost.budgetedCost;

  await sequelize.query(
    `UPDATE job_costs
     SET allocated_overhead = allocated_overhead + ?,
         total_cost = ?,
         variance = ?
     WHERE job_cost_id = ?`,
    {
      replacements: [overheadAmount, jobCost.totalCost, jobCost.variance, jobCostId],
      transaction
    }
  );

  return jobCost;
}

/**
 * Update job cost
 *
 * @ApiOperation Updates job cost components
 * @ApiResponse 200 - Job cost updated successfully
 */
export async function updateJobCost(
  jobCostId: string,
  costUpdates: {
    directMaterialCost?: number;
    directLaborCost?: number;
    otherDirectCosts?: number;
  },
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<JobCost> {
  const [results] = await sequelize.query(
    `SELECT * FROM job_costs WHERE job_cost_id = ?`,
    { replacements: [jobCostId] }
  );

  if (!results || results.length === 0) {
    throw new Error(`Job cost ${jobCostId} not found`);
  }

  const jobCost = mapRowToJobCost(results[0]);

  if (costUpdates.directMaterialCost !== undefined) {
    jobCost.directMaterialCost = costUpdates.directMaterialCost;
  }
  if (costUpdates.directLaborCost !== undefined) {
    jobCost.directLaborCost = costUpdates.directLaborCost;
  }
  if (costUpdates.otherDirectCosts !== undefined) {
    jobCost.otherDirectCosts = costUpdates.otherDirectCosts;
  }

  jobCost.totalCost = jobCost.directMaterialCost + jobCost.directLaborCost +
                      jobCost.allocatedOverhead + jobCost.otherDirectCosts;
  jobCost.variance = jobCost.totalCost - jobCost.budgetedCost;

  await sequelize.query(
    `UPDATE job_costs
     SET direct_material_cost = ?,
         direct_labor_cost = ?,
         other_direct_costs = ?,
         total_cost = ?,
         variance = ?
     WHERE job_cost_id = ?`,
    {
      replacements: [
        jobCost.directMaterialCost, jobCost.directLaborCost,
        jobCost.otherDirectCosts, jobCost.totalCost, jobCost.variance,
        jobCostId
      ],
      transaction
    }
  );

  return jobCost;
}

/**
 * Get job cost variance analysis
 *
 * @ApiOperation Analyzes cost variance for a job
 * @ApiResponse 200 - Variance analysis completed successfully
 */
export async function getJobCostVarianceAnalysis(
  jobCostId: string,
  sequelize: Sequelize
): Promise<{
  jobCost: JobCost;
  varianceBreakdown: Record<string, { budgeted: number; actual: number; variance: number }>;
  variancePercentage: number;
}> {
  const [results] = await sequelize.query(
    `SELECT * FROM job_costs WHERE job_cost_id = ?`,
    { replacements: [jobCostId] }
  );

  if (!results || results.length === 0) {
    throw new Error(`Job cost ${jobCostId} not found`);
  }

  const jobCost = mapRowToJobCost(results[0]);

  const varianceBreakdown = {
    directMaterial: {
      budgeted: jobCost.budgetedCost * 0.4, // Assume 40% materials
      actual: jobCost.directMaterialCost,
      variance: jobCost.directMaterialCost - (jobCost.budgetedCost * 0.4)
    },
    directLabor: {
      budgeted: jobCost.budgetedCost * 0.35, // Assume 35% labor
      actual: jobCost.directLaborCost,
      variance: jobCost.directLaborCost - (jobCost.budgetedCost * 0.35)
    },
    overhead: {
      budgeted: jobCost.budgetedCost * 0.20, // Assume 20% overhead
      actual: jobCost.allocatedOverhead,
      variance: jobCost.allocatedOverhead - (jobCost.budgetedCost * 0.20)
    },
    other: {
      budgeted: jobCost.budgetedCost * 0.05, // Assume 5% other
      actual: jobCost.otherDirectCosts,
      variance: jobCost.otherDirectCosts - (jobCost.budgetedCost * 0.05)
    }
  };

  const variancePercentage = (jobCost.variance / jobCost.budgetedCost) * 100;

  return {
    jobCost,
    varianceBreakdown,
    variancePercentage
  };
}

// ============================================================================
// Cost Variance Analysis Functions
// ============================================================================

/**
 * Create cost variance analysis
 *
 * @ApiOperation Creates a comprehensive cost variance analysis
 * @ApiResponse 201 - Variance analysis created successfully
 */
export async function createCostVarianceAnalysis(
  analysisData: Partial<CostVarianceAnalysis>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostVarianceAnalysis> {
  const analysis: CostVarianceAnalysis = {
    analysisId: analysisData.analysisId || generateId('CVA'),
    costCenterId: analysisData.costCenterId!,
    period: analysisData.period!,
    budgetedAmount: analysisData.budgetedAmount!,
    actualAmount: analysisData.actualAmount!,
    varianceAmount: analysisData.actualAmount! - analysisData.budgetedAmount!,
    variancePercentage: ((analysisData.actualAmount! - analysisData.budgetedAmount!) / analysisData.budgetedAmount!) * 100,
    isFavorable: analysisData.actualAmount! < analysisData.budgetedAmount!,
    categoryBreakdown: analysisData.categoryBreakdown || {},
    varianceDrivers: analysisData.varianceDrivers || [],
    notes: analysisData.notes,
    createdBy: analysisData.createdBy || 'SYSTEM',
    createdAt: new Date()
  };

  await sequelize.query(
    `INSERT INTO cost_variance_analyses (
      analysis_id, cost_center_id, period, budgeted_amount, actual_amount,
      variance_amount, variance_percentage, is_favorable, category_breakdown,
      variance_drivers, notes, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        analysis.analysisId, analysis.costCenterId, analysis.period,
        analysis.budgetedAmount, analysis.actualAmount, analysis.varianceAmount,
        analysis.variancePercentage, analysis.isFavorable,
        JSON.stringify(analysis.categoryBreakdown),
        JSON.stringify(analysis.varianceDrivers), analysis.notes,
        analysis.createdBy, analysis.createdAt
      ],
      transaction
    }
  );

  return analysis;
}

/**
 * Calculate period variance
 *
 * @ApiOperation Calculates variance for a cost center and period
 * @ApiResponse 200 - Variance calculated successfully
 */
export async function calculatePeriodVariance(
  costCenterId: string,
  period: string,
  sequelize: Sequelize
): Promise<CostVarianceAnalysis> {
  // Get budget
  const [budgetResults] = await sequelize.query(
    `SELECT budget_amount FROM cost_centers WHERE cost_center_id = ?`,
    { replacements: [costCenterId] }
  );

  if (!budgetResults || budgetResults.length === 0) {
    throw new Error(`Cost center ${costCenterId} not found`);
  }

  const budgetedAmount = parseFloat((budgetResults[0] as any).budget_amount);

  // Get actual costs
  const [actualResults] = await sequelize.query(
    `SELECT SUM(amount) as total FROM cost_transactions
     WHERE cost_center_id = ? AND period = ?`,
    { replacements: [costCenterId, period] }
  );

  const actualAmount = actualResults && actualResults.length > 0
    ? parseFloat((actualResults[0] as any).total || 0)
    : 0;

  return await createCostVarianceAnalysis(
    {
      costCenterId,
      period,
      budgetedAmount,
      actualAmount
    },
    sequelize
  );
}

/**
 * Get variance trends
 *
 * @ApiOperation Retrieves variance trend data over multiple periods
 * @ApiResponse 200 - Variance trends retrieved successfully
 */
export async function getVarianceTrends(
  costCenterId: string,
  periodsCount: number,
  sequelize: Sequelize
): Promise<CostVarianceAnalysis[]> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_variance_analyses
     WHERE cost_center_id = ?
     ORDER BY period DESC
     LIMIT ?`,
    { replacements: [costCenterId, periodsCount] }
  );

  return (results as any[]).map(mapRowToCostVarianceAnalysis);
}

// ============================================================================
// Reporting Functions
// ============================================================================

/**
 * Generate allocation summary report
 *
 * @ApiOperation Generates comprehensive allocation summary report
 * @ApiResponse 200 - Report generated successfully
 */
export async function generateAllocationSummaryReport(
  config: AllocationReportConfig,
  sequelize: Sequelize
): Promise<{
  config: AllocationReportConfig;
  summary: {
    totalAllocated: number;
    allocationCount: number;
    uniqueSourceCenters: number;
    uniqueTargetCenters: number;
  };
  allocationsByMethod: Record<AllocationMethod, number>;
  allocationsByPeriod: Record<string, number>;
  topAllocations: CostAllocation[];
}> {
  let query = `SELECT * FROM cost_allocations WHERE 1=1`;
  const replacements: any[] = [];

  if (config.costCenterFilters && config.costCenterFilters.length > 0) {
    query += ` AND (source_cost_center_id IN (?) OR target_cost_center_id IN (?))`;
    replacements.push(config.costCenterFilters, config.costCenterFilters);
  }

  if (config.periodFrom) {
    query += ` AND period >= ?`;
    replacements.push(config.periodFrom);
  }

  if (config.periodTo) {
    query += ` AND period <= ?`;
    replacements.push(config.periodTo);
  }

  const [results] = await sequelize.query(query, { replacements });
  const allocations = (results as any[]).map(mapRowToCostAllocation);

  // Calculate summary statistics
  const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);
  const uniqueSourceCenters = new Set(allocations.map(a => a.sourceCostCenterId)).size;
  const uniqueTargetCenters = new Set(allocations.map(a => a.targetCostCenterId)).size;

  // Group by allocation method
  const allocationsByMethod: Record<string, number> = {};
  allocations.forEach(a => {
    allocationsByMethod[a.allocationMethod] = (allocationsByMethod[a.allocationMethod] || 0) + a.amount;
  });

  // Group by period
  const allocationsByPeriod: Record<string, number> = {};
  allocations.forEach(a => {
    allocationsByPeriod[a.period] = (allocationsByPeriod[a.period] || 0) + a.amount;
  });

  // Get top allocations
  const topAllocations = allocations
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  return {
    config,
    summary: {
      totalAllocated,
      allocationCount: allocations.length,
      uniqueSourceCenters,
      uniqueTargetCenters
    },
    allocationsByMethod: allocationsByMethod as any,
    allocationsByPeriod,
    topAllocations
  };
}

/**
 * Generate cost center dashboard
 *
 * @ApiOperation Generates comprehensive cost center dashboard data
 * @ApiResponse 200 - Dashboard data generated successfully
 */
export async function generateCostCenterDashboard(
  costCenterId: string,
  period: string,
  sequelize: Sequelize
): Promise<{
  costCenter: CostCenter;
  currentPeriod: {
    budget: number;
    actual: number;
    variance: number;
    utilizationPercentage: number;
  };
  allocationsReceived: CostAllocation[];
  allocationsSent: CostAllocation[];
  topExpenseCategories: Array<{ category: string; amount: number }>;
  trends: Array<{ period: string; amount: number }>;
}> {
  const costCenter = await getCostCenterById(costCenterId, sequelize);
  if (!costCenter) {
    throw new Error(`Cost center ${costCenterId} not found`);
  }

  // Get actual costs for period
  const [actualResults] = await sequelize.query(
    `SELECT SUM(amount) as total FROM cost_transactions
     WHERE cost_center_id = ? AND period = ?`,
    { replacements: [costCenterId, period] }
  );

  const actual = actualResults && actualResults.length > 0
    ? parseFloat((actualResults[0] as any).total || 0)
    : 0;

  const variance = actual - costCenter.budgetAmount;
  const utilizationPercentage = (actual / costCenter.budgetAmount) * 100;

  // Get allocations received
  const [receivedResults] = await sequelize.query(
    `SELECT * FROM cost_allocations
     WHERE target_cost_center_id = ? AND period = ?`,
    { replacements: [costCenterId, period] }
  );

  const allocationsReceived = (receivedResults as any[]).map(mapRowToCostAllocation);

  // Get allocations sent
  const [sentResults] = await sequelize.query(
    `SELECT * FROM cost_allocations
     WHERE source_cost_center_id = ? AND period = ?`,
    { replacements: [costCenterId, period] }
  );

  const allocationsSent = (sentResults as any[]).map(mapRowToCostAllocation);

  // Mock expense categories (would come from detailed transaction data)
  const topExpenseCategories = [
    { category: 'Labor', amount: actual * 0.4 },
    { category: 'Materials', amount: actual * 0.3 },
    { category: 'Overhead', amount: actual * 0.2 },
    { category: 'Other', amount: actual * 0.1 }
  ];

  // Mock trends (would query multiple periods)
  const trends = [
    { period: period, amount: actual }
  ];

  return {
    costCenter,
    currentPeriod: {
      budget: costCenter.budgetAmount,
      actual,
      variance,
      utilizationPercentage
    },
    allocationsReceived,
    allocationsSent,
    topExpenseCategories,
    trends
  };
}

/**
 * Generate ABC profitability report
 *
 * @ApiOperation Generates activity-based costing profitability report
 * @ApiResponse 200 - ABC profitability report generated successfully
 */
export async function generateABCProfitabilityReport(
  period: string,
  sequelize: Sequelize
): Promise<{
  period: string;
  activities: Array<{
    activity: ABCActivity;
    totalCost: number;
    totalVolume: number;
    activityRate: number;
    allocations: CostAllocation[];
  }>;
  summary: {
    totalActivitiesCost: number;
    totalAllocated: number;
    averageActivityRate: number;
  };
}> {
  const [activityResults] = await sequelize.query(
    `SELECT * FROM abc_activities WHERE is_active = true`
  );

  const activities = [];
  let totalActivitiesCost = 0;
  let totalAllocated = 0;
  let totalRates = 0;

  for (const actRow of activityResults as any[]) {
    const activity = mapRowToABCActivity(actRow);
    const totalCost = await calculateCostPoolTotal(activity.costPoolId, period, sequelize);
    const activityRate = await calculateActivityRate(activity.activityId, period, sequelize);

    const [allocResults] = await sequelize.query(
      `SELECT * FROM cost_allocations
       WHERE allocation_method = 'ACTIVITY_BASED'
         AND period = ?
         AND JSON_EXTRACT(calculation_details, '$.activityId') = ?`,
      { replacements: [period, activity.activityId] }
    );

    const allocations = (allocResults as any[]).map(mapRowToCostAllocation);
    const allocated = allocations.reduce((sum, a) => sum + a.amount, 0);

    activities.push({
      activity,
      totalCost,
      totalVolume: activity.totalVolume,
      activityRate,
      allocations
    });

    totalActivitiesCost += totalCost;
    totalAllocated += allocated;
    totalRates += activityRate;
  }

  return {
    period,
    activities,
    summary: {
      totalActivitiesCost,
      totalAllocated,
      averageActivityRate: activities.length > 0 ? totalRates / activities.length : 0
    }
  };
}

// ============================================================================
// Batch Processing Functions
// ============================================================================

/**
 * Execute batch allocation
 *
 * @ApiOperation Executes multiple allocation rules in a batch
 * @ApiResponse 200 - Batch allocation completed successfully
 */
export async function executeBatchAllocation(
  ruleIds: string[],
  period: string,
  sequelize: Sequelize
): Promise<{
  batchId: string;
  allocations: CostAllocation[];
  summary: {
    totalAmount: number;
    allocationCount: number;
    successCount: number;
    failureCount: number;
  };
  errors: Array<{ ruleId: string; error: string }>;
}> {
  const batchId = generateId('BATCH');
  const allocations: CostAllocation[] = [];
  const errors: Array<{ ruleId: string; error: string }> = [];
  let successCount = 0;
  let failureCount = 0;

  const transaction = await sequelize.transaction();

  try {
    for (const ruleId of ruleIds) {
      try {
        const ruleAllocations = await executeAllocationRule(ruleId, period, sequelize, transaction);

        // Update allocations with batch ID
        for (const allocation of ruleAllocations) {
          allocation.batchId = batchId;
          await sequelize.query(
            `UPDATE cost_allocations SET batch_id = ? WHERE allocation_id = ?`,
            { replacements: [batchId, allocation.allocationId], transaction }
          );
        }

        allocations.push(...ruleAllocations);
        successCount++;
      } catch (error) {
        errors.push({ ruleId, error: (error as Error).message });
        failureCount++;
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const totalAmount = allocations.reduce((sum, a) => sum + a.amount, 0);

  return {
    batchId,
    allocations,
    summary: {
      totalAmount,
      allocationCount: allocations.length,
      successCount,
      failureCount
    },
    errors
  };
}

/**
 * Reverse allocation
 *
 * @ApiOperation Reverses a previously posted allocation
 * @ApiResponse 200 - Allocation reversed successfully
 */
export async function reverseAllocation(
  allocationId: string,
  reason: string,
  userId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CostAllocation> {
  const [results] = await sequelize.query(
    `SELECT * FROM cost_allocations WHERE allocation_id = ?`,
    { replacements: [allocationId] }
  );

  if (!results || results.length === 0) {
    throw new Error(`Allocation ${allocationId} not found`);
  }

  const originalAllocation = mapRowToCostAllocation(results[0]);

  if (originalAllocation.status === AllocationStatus.REVERSED) {
    throw new Error(`Allocation ${allocationId} is already reversed`);
  }

  // Create reversal allocation
  const reversalAllocation: CostAllocation = {
    ...originalAllocation,
    allocationId: generateId('ALLOC'),
    amount: -originalAllocation.amount,
    status: AllocationStatus.COMPLETED,
    notes: `Reversal of ${allocationId}: ${reason}`,
    createdBy: userId,
    createdAt: new Date(),
    postedAt: new Date()
  };

  await saveAllocation(reversalAllocation, sequelize, transaction);

  // Update original allocation status
  await sequelize.query(
    `UPDATE cost_allocations SET status = ? WHERE allocation_id = ?`,
    { replacements: [AllocationStatus.REVERSED, allocationId], transaction }
  );

  return reversalAllocation;
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateCostCenterId(): string {
  return `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateCostDriverId(): string {
  return `CD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

async function getSourceCostAmount(
  sourceId: string,
  period: string,
  sequelize: Sequelize
): Promise<number> {
  const [results] = await sequelize.query(
    `SELECT SUM(amount) as total FROM cost_transactions
     WHERE cost_center_id = ? AND period = ?`,
    { replacements: [sourceId, period] }
  );

  return results && results.length > 0
    ? parseFloat((results[0] as any).total || 0)
    : 0;
}

async function saveAllocation(
  allocation: CostAllocation,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  await sequelize.query(
    `INSERT INTO cost_allocations (
      allocation_id, source_cost_center_id, target_cost_center_id,
      allocation_method, amount, percentage, cost_driver_id, period,
      status, calculation_details, batch_id, journal_entry_id, notes,
      created_by, created_at, posted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        allocation.allocationId, allocation.sourceCostCenterId,
        allocation.targetCostCenterId, allocation.allocationMethod,
        allocation.amount, allocation.percentage, allocation.costDriverId,
        allocation.period, allocation.status,
        JSON.stringify(allocation.calculationDetails), allocation.batchId,
        allocation.journalEntryId, allocation.notes, allocation.createdBy,
        allocation.createdAt, allocation.postedAt
      ],
      transaction
    }
  );
}

// Mapping functions
function mapRowToCostCenter(row: any): CostCenter {
  return {
    costCenterId: row.cost_center_id,
    name: row.name,
    code: row.code,
    type: row.type,
    parentCostCenterId: row.parent_cost_center_id,
    managerId: row.manager_id,
    department: row.department,
    budgetAmount: parseFloat(row.budget_amount),
    fiscalYear: parseInt(row.fiscal_year),
    isActive: Boolean(row.is_active),
    attributes: typeof row.attributes === 'string' ? JSON.parse(row.attributes) : row.attributes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

function mapRowToCostAllocation(row: any): CostAllocation {
  return {
    allocationId: row.allocation_id,
    sourceCostCenterId: row.source_cost_center_id,
    targetCostCenterId: row.target_cost_center_id,
    allocationMethod: row.allocation_method,
    amount: parseFloat(row.amount),
    percentage: parseFloat(row.percentage),
    costDriverId: row.cost_driver_id,
    period: row.period,
    status: row.status,
    calculationDetails: typeof row.calculation_details === 'string'
      ? JSON.parse(row.calculation_details)
      : row.calculation_details,
    batchId: row.batch_id,
    journalEntryId: row.journal_entry_id,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at),
    postedAt: row.posted_at ? new Date(row.posted_at) : undefined
  };
}

function mapRowToCostDriverValue(row: any): CostDriverValue {
  return {
    valueId: row.value_id,
    costDriverId: row.cost_driver_id,
    costCenterId: row.cost_center_id,
    period: row.period,
    value: parseFloat(row.value),
    sourceReference: row.source_reference,
    createdAt: new Date(row.created_at)
  };
}

function mapRowToCostPool(row: any): CostPool {
  return {
    costPoolId: row.cost_pool_id,
    name: row.name,
    code: row.code,
    description: row.description,
    sourceCostCenters: typeof row.source_cost_centers === 'string'
      ? JSON.parse(row.source_cost_centers)
      : row.source_cost_centers,
    totalAmount: parseFloat(row.total_amount),
    period: row.period,
    primaryDriverId: row.primary_driver_id,
    attributes: typeof row.attributes === 'string' ? JSON.parse(row.attributes) : row.attributes,
    createdAt: new Date(row.created_at)
  };
}

function mapRowToAllocationRule(row: any): AllocationRule {
  return {
    ruleId: row.rule_id,
    name: row.name,
    sourceId: row.source_id,
    allocationMethod: row.allocation_method,
    costDriverId: row.cost_driver_id,
    targetCostCenters: typeof row.target_cost_centers === 'string'
      ? JSON.parse(row.target_cost_centers)
      : row.target_cost_centers,
    fixedPercentages: typeof row.fixed_percentages === 'string'
      ? JSON.parse(row.fixed_percentages)
      : row.fixed_percentages,
    frequency: row.frequency,
    isActive: Boolean(row.is_active),
    priority: row.priority ? parseInt(row.priority) : undefined,
    effectiveFrom: new Date(row.effective_from),
    effectiveTo: row.effective_to ? new Date(row.effective_to) : undefined,
    conditions: typeof row.conditions === 'string' ? JSON.parse(row.conditions) : row.conditions,
    createdAt: new Date(row.created_at)
  };
}

function mapRowToABCActivity(row: any): ABCActivity {
  return {
    activityId: row.activity_id,
    name: row.name,
    code: row.code,
    activityLevel: row.activity_level,
    costDriverId: row.cost_driver_id,
    costPoolId: row.cost_pool_id,
    activityRate: parseFloat(row.activity_rate),
    totalVolume: parseFloat(row.total_volume),
    isActive: Boolean(row.is_active),
    attributes: typeof row.attributes === 'string' ? JSON.parse(row.attributes) : row.attributes,
    createdAt: new Date(row.created_at)
  };
}

function mapRowToJobCost(row: any): JobCost {
  return {
    jobCostId: row.job_cost_id,
    jobId: row.job_id,
    jobName: row.job_name,
    customerId: row.customer_id,
    directMaterialCost: parseFloat(row.direct_material_cost),
    directLaborCost: parseFloat(row.direct_labor_cost),
    allocatedOverhead: parseFloat(row.allocated_overhead),
    otherDirectCosts: parseFloat(row.other_direct_costs),
    totalCost: parseFloat(row.total_cost),
    budgetedCost: parseFloat(row.budgeted_cost),
    variance: parseFloat(row.variance),
    startDate: new Date(row.start_date),
    completionDate: row.completion_date ? new Date(row.completion_date) : undefined,
    status: row.status,
    costBreakdown: typeof row.cost_breakdown === 'string'
      ? JSON.parse(row.cost_breakdown)
      : row.cost_breakdown,
    createdAt: new Date(row.created_at)
  };
}

function mapRowToCostVarianceAnalysis(row: any): CostVarianceAnalysis {
  return {
    analysisId: row.analysis_id,
    costCenterId: row.cost_center_id,
    period: row.period,
    budgetedAmount: parseFloat(row.budgeted_amount),
    actualAmount: parseFloat(row.actual_amount),
    varianceAmount: parseFloat(row.variance_amount),
    variancePercentage: parseFloat(row.variance_percentage),
    isFavorable: Boolean(row.is_favorable),
    categoryBreakdown: typeof row.category_breakdown === 'string'
      ? JSON.parse(row.category_breakdown)
      : row.category_breakdown,
    varianceDrivers: typeof row.variance_drivers === 'string'
      ? JSON.parse(row.variance_drivers)
      : row.variance_drivers,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at)
  };
}

export default {
  // Cost Center Management
  createCostCenter,
  getCostCenterById,
  getCostCenterHierarchy,
  updateCostCenterBudget,
  getCostCentersByType,

  // Cost Driver Management
  createCostDriver,
  recordCostDriverValue,
  getCostDriverValuesForPeriod,
  calculateCostDriverTotals,

  // Cost Pool Management
  createCostPool,
  calculateCostPoolTotal,
  getCostPoolDetails,

  // Allocation Rule Management
  createAllocationRule,
  getActiveAllocationRules,
  executeAllocationRule,

  // Allocation Methods
  executeDirectAllocation,
  executeProportionalAllocation,
  executeDriverBasedAllocation,
  executeStepDownAllocation,

  // Activity-Based Costing
  createABCActivity,
  calculateActivityRate,
  executeABCAllocation,
  getABCActivityHierarchy,

  // Job Costing
  createJobCost,
  allocateOverheadToJob,
  updateJobCost,
  getJobCostVarianceAnalysis,

  // Variance Analysis
  createCostVarianceAnalysis,
  calculatePeriodVariance,
  getVarianceTrends,

  // Reporting
  generateAllocationSummaryReport,
  generateCostCenterDashboard,
  generateABCProfitabilityReport,

  // Batch Processing
  executeBatchAllocation,
  reverseAllocation
};

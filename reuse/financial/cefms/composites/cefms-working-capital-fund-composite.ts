/**
 * LOC: CEFMSWCF001
 * File: /reuse/financial/cefms/composites/cefms-working-capital-fund-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../government/fund-accounting-operations-kit.ts
 *   - ../../government/revenue-recognition-management-kit.ts
 *   - ../../government/project-program-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS working capital services
 *   - USACE revolving fund systems
 *   - Cost recovery modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-working-capital-fund-composite.ts
 * Locator: WC-CEFMS-WCF-001
 * Purpose: USACE CEFMS Working Capital Fund - revolving fund operations, rate setting, cost recovery, billing cycles
 *
 * Upstream: Composes utilities from government kits for working capital fund management
 * Downstream: ../../../backend/cefms/*, WCF controllers, rate management, billing services, cost recovery reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 37+ composite functions for USACE CEFMS working capital fund operations
 *
 * LLM Context: Production-ready USACE CEFMS working capital fund management system.
 * Comprehensive revolving fund accounting, rate development and setting, cost recovery mechanisms, customer billing cycles,
 * service order management, inventory valuation, operating reserves tracking, fund sustainability analysis, cost allocation,
 * inter-agency billing, performance metrics, and fund balance management per federal working capital fund guidelines.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WorkingCapitalFundData {
  fundId: string;
  fundCode: string;
  fundName: string;
  fiscalYear: number;
  beginningBalance: number;
  operatingReserve: number;
  minimumReserve: number;
  status: 'active' | 'inactive' | 'under_review';
}

interface RateStructureData {
  rateId: string;
  fundCode: string;
  serviceType: string;
  ratePeriod: string;
  effectiveDate: Date;
  expirationDate: Date;
  billingRate: number;
  costRecoveryRate: number;
  overheadRate: number;
  totalRate: number;
}

interface CustomerOrderData {
  orderId: string;
  customerAgency: string;
  fundCode: string;
  orderDate: Date;
  serviceDescription: string;
  estimatedCost: number;
  billingSchedule: 'upfront' | 'milestone' | 'completion' | 'monthly';
  status: 'active' | 'completed' | 'cancelled';
}

interface BillingCycleData {
  cycleId: string;
  fundCode: string;
  periodStartDate: Date;
  periodEndDate: Date;
  billingDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  status: 'open' | 'billed' | 'collected' | 'closed';
}

interface CostRecoveryData {
  fundCode: string;
  fiscalYear: number;
  totalCosts: number;
  recoveredRevenue: number;
  recoveryRate: number;
  variance: number;
}

interface InventoryValuationData {
  inventoryId: string;
  fundCode: string;
  itemDescription: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'weighted_average';
}

interface OperatingReserveData {
  fundCode: string;
  fiscalYear: number;
  requiredReserve: number;
  actualReserve: number;
  variance: number;
  reserveRatio: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Working Capital Funds with reserve tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkingCapitalFund model
 *
 * @example
 * ```typescript
 * const WorkingCapitalFund = createWorkingCapitalFundModel(sequelize);
 * const fund = await WorkingCapitalFund.create({
 *   fundCode: 'WCF-001',
 *   fundName: 'Engineering Services',
 *   fiscalYear: 2024,
 *   beginningBalance: 1000000,
 *   operatingReserve: 200000,
 *   minimumReserve: 150000
 * });
 * ```
 */
export const createWorkingCapitalFundModel = (sequelize: Sequelize) => {
  class WorkingCapitalFund extends Model {
    public id!: string;
    public fundId!: string;
    public fundCode!: string;
    public fundName!: string;
    public description!: string;
    public fiscalYear!: number;
    public beginningBalance!: number;
    public currentBalance!: number;
    public operatingReserve!: number;
    public minimumReserve!: number;
    public totalRevenue!: number;
    public totalExpenses!: number;
    public netIncome!: number;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WorkingCapitalFund.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Fund identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      fundName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Fund name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Fund description',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      beginningBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Beginning fund balance',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current fund balance',
      },
      operatingReserve: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Operating reserve amount',
      },
      minimumReserve: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Minimum required reserve',
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total revenue YTD',
      },
      totalExpenses: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expenses YTD',
      },
      netIncome: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net income YTD',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'under_review'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Fund status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'working_capital_funds',
      timestamps: true,
      indexes: [
        { fields: ['fundId'], unique: true },
        { fields: ['fundCode', 'fiscalYear'], unique: true },
        { fields: ['fiscalYear'] },
        { fields: ['status'] },
      ],
    },
  );

  return WorkingCapitalFund;
};

/**
 * Sequelize model for Rate Structures with versioning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RateStructure model
 */
export const createRateStructureModel = (sequelize: Sequelize) => {
  class RateStructure extends Model {
    public id!: string;
    public rateId!: string;
    public fundCode!: string;
    public serviceType!: string;
    public ratePeriod!: string;
    public effectiveDate!: Date;
    public expirationDate!: Date;
    public billingRate!: number;
    public costRecoveryRate!: number;
    public overheadRate!: number;
    public totalRate!: number;
    public justification!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RateStructure.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rateId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Rate identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      serviceType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Service type',
      },
      ratePeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Rate period (e.g., FY2024)',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expiration date',
      },
      billingRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Base billing rate',
      },
      costRecoveryRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cost recovery component',
      },
      overheadRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overhead rate component',
      },
      totalRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total composite rate',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Rate justification',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'rate_structures',
      timestamps: true,
      indexes: [
        { fields: ['rateId'], unique: true },
        { fields: ['fundCode'] },
        { fields: ['serviceType'] },
        { fields: ['effectiveDate', 'expirationDate'] },
      ],
    },
  );

  return RateStructure;
};

/**
 * Sequelize model for Customer Orders with billing tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerOrder model
 */
export const createCustomerOrderModel = (sequelize: Sequelize) => {
  class CustomerOrder extends Model {
    public id!: string;
    public orderId!: string;
    public customerAgency!: string;
    public customerContact!: string;
    public fundCode!: string;
    public orderDate!: Date;
    public serviceDescription!: string;
    public estimatedCost!: number;
    public actualCost!: number;
    public billedAmount!: number;
    public paidAmount!: number;
    public billingSchedule!: string;
    public status!: string;
    public startDate!: Date | null;
    public completionDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CustomerOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Order identifier',
      },
      customerAgency: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Customer agency name',
      },
      customerContact: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Customer contact',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Order date',
      },
      serviceDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Service description',
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimated cost',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual cost',
      },
      billedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total billed amount',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total paid amount',
      },
      billingSchedule: {
        type: DataTypes.ENUM('upfront', 'milestone', 'completion', 'monthly'),
        allowNull: false,
        comment: 'Billing schedule type',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Order status',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Service start date',
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Service completion date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'customer_orders',
      timestamps: true,
      indexes: [
        { fields: ['orderId'], unique: true },
        { fields: ['fundCode'] },
        { fields: ['customerAgency'] },
        { fields: ['status'] },
        { fields: ['orderDate'] },
      ],
    },
  );

  return CustomerOrder;
};

/**
 * Sequelize model for Billing Cycles with revenue tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BillingCycle model
 */
export const createBillingCycleModel = (sequelize: Sequelize) => {
  class BillingCycle extends Model {
    public id!: string;
    public cycleId!: string;
    public fundCode!: string;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public billingDate!: Date;
    public totalRevenue!: number;
    public totalExpenses!: number;
    public netIncome!: number;
    public status!: string;
    public billedCount!: number;
    public collectedCount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BillingCycle.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cycleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Cycle identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      periodStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      periodEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      billingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Billing date',
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total revenue for period',
      },
      totalExpenses: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expenses for period',
      },
      netIncome: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net income for period',
      },
      status: {
        type: DataTypes.ENUM('open', 'billed', 'collected', 'closed'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Cycle status',
      },
      billedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of bills issued',
      },
      collectedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of bills collected',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'billing_cycles',
      timestamps: true,
      indexes: [
        { fields: ['cycleId'], unique: true },
        { fields: ['fundCode'] },
        { fields: ['status'] },
        { fields: ['periodStartDate', 'periodEndDate'] },
      ],
    },
  );

  return BillingCycle;
};

/**
 * Sequelize model for Inventory Valuation with FIFO/LIFO support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InventoryValuation model
 */
export const createInventoryValuationModel = (sequelize: Sequelize) => {
  class InventoryValuation extends Model {
    public id!: string;
    public inventoryId!: string;
    public fundCode!: string;
    public itemDescription!: string;
    public itemCategory!: string;
    public quantity!: number;
    public unitCost!: number;
    public totalValue!: number;
    public valuationMethod!: string;
    public valuationDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InventoryValuation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inventoryId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Inventory item identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      itemDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Item description',
      },
      itemCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Item category',
      },
      quantity: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity on hand',
      },
      unitCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unit cost',
      },
      totalValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total inventory value',
      },
      valuationMethod: {
        type: DataTypes.ENUM('FIFO', 'LIFO', 'weighted_average'),
        allowNull: false,
        defaultValue: 'FIFO',
        comment: 'Valuation method',
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Valuation date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'inventory_valuations',
      timestamps: true,
      indexes: [
        { fields: ['inventoryId'], unique: true },
        { fields: ['fundCode'] },
        { fields: ['itemCategory'] },
        { fields: ['valuationDate'] },
      ],
    },
  );

  return InventoryValuation;
};

// ============================================================================
// FUND MANAGEMENT (1-6)
// ============================================================================

/**
 * Creates working capital fund.
 *
 * @param {WorkingCapitalFundData} fundData - Fund data
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<any>} Created fund
 */
export const createWorkingCapitalFund = async (
  fundData: WorkingCapitalFundData,
  WorkingCapitalFund: any,
): Promise<any> => {
  return await WorkingCapitalFund.create({
    ...fundData,
    currentBalance: fundData.beginningBalance,
  });
};

/**
 * Updates fund balance.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} revenueAmount - Revenue amount
 * @param {number} expenseAmount - Expense amount
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<any>} Updated fund
 */
export const updateFundBalance = async (
  fundCode: string,
  fiscalYear: number,
  revenueAmount: number,
  expenseAmount: number,
  WorkingCapitalFund: any,
): Promise<any> => {
  const fund = await WorkingCapitalFund.findOne({
    where: { fundCode, fiscalYear },
  });

  if (!fund) throw new Error('Fund not found');

  fund.totalRevenue += revenueAmount;
  fund.totalExpenses += expenseAmount;
  fund.netIncome = fund.totalRevenue - fund.totalExpenses;
  fund.currentBalance = fund.beginningBalance + fund.netIncome;
  await fund.save();

  return fund;
};

/**
 * Calculates operating reserve requirement.
 *
 * @param {number} annualExpenses - Annual expenses
 * @param {number} reservePercentage - Reserve percentage
 * @returns {number} Required reserve amount
 */
export const calculateOperatingReserveRequirement = (
  annualExpenses: number,
  reservePercentage: number,
): number => {
  return annualExpenses * (reservePercentage / 100);
};

/**
 * Validates fund sustainability.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<{ sustainable: boolean; issues: string[] }>}
 */
export const validateFundSustainability = async (
  fundCode: string,
  fiscalYear: number,
  WorkingCapitalFund: any,
): Promise<{ sustainable: boolean; issues: string[] }> => {
  const fund = await WorkingCapitalFund.findOne({
    where: { fundCode, fiscalYear },
  });

  if (!fund) throw new Error('Fund not found');

  const issues: string[] = [];

  if (fund.currentBalance < fund.minimumReserve) {
    issues.push('Current balance below minimum reserve requirement');
  }

  if (fund.operatingReserve < fund.minimumReserve) {
    issues.push('Operating reserve below minimum requirement');
  }

  if (fund.netIncome < 0) {
    issues.push('Fund operating at a loss');
  }

  const reserveRatio = fund.totalExpenses > 0 ? fund.operatingReserve / fund.totalExpenses : 0;
  if (reserveRatio < 0.15) {
    issues.push('Operating reserve ratio below 15% threshold');
  }

  return {
    sustainable: issues.length === 0,
    issues,
  };
};

/**
 * Generates fund financial statement.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<any>} Financial statement
 */
export const generateFundFinancialStatement = async (
  fundCode: string,
  fiscalYear: number,
  WorkingCapitalFund: any,
): Promise<any> => {
  const fund = await WorkingCapitalFund.findOne({
    where: { fundCode, fiscalYear },
  });

  if (!fund) throw new Error('Fund not found');

  return {
    fundCode,
    fundName: fund.fundName,
    fiscalYear,
    statementDate: new Date(),
    beginningBalance: fund.beginningBalance,
    revenue: fund.totalRevenue,
    expenses: fund.totalExpenses,
    netIncome: fund.netIncome,
    endingBalance: fund.currentBalance,
    operatingReserve: fund.operatingReserve,
    minimumReserve: fund.minimumReserve,
  };
};

/**
 * Transfers funds between working capital funds.
 *
 * @param {string} fromFundCode - Source fund code
 * @param {string} toFundCode - Destination fund code
 * @param {number} amount - Transfer amount
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<{ fromFund: any; toFund: any }>}
 */
export const transferBetweenFunds = async (
  fromFundCode: string,
  toFundCode: string,
  amount: number,
  fiscalYear: number,
  WorkingCapitalFund: any,
): Promise<{ fromFund: any; toFund: any }> => {
  const fromFund = await WorkingCapitalFund.findOne({
    where: { fundCode: fromFundCode, fiscalYear },
  });
  const toFund = await WorkingCapitalFund.findOne({
    where: { fundCode: toFundCode, fiscalYear },
  });

  if (!fromFund || !toFund) throw new Error('Fund not found');

  if (fromFund.currentBalance < amount) {
    throw new Error('Insufficient fund balance');
  }

  fromFund.currentBalance -= amount;
  toFund.currentBalance += amount;

  await fromFund.save();
  await toFund.save();

  return { fromFund, toFund };
};

// ============================================================================
// RATE SETTING & MANAGEMENT (7-13)
// ============================================================================

/**
 * Creates rate structure.
 *
 * @param {RateStructureData} rateData - Rate data
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any>} Created rate
 */
export const createRateStructure = async (
  rateData: RateStructureData,
  RateStructure: any,
): Promise<any> => {
  const totalRate = rateData.billingRate + rateData.costRecoveryRate + rateData.overheadRate;

  return await RateStructure.create({
    ...rateData,
    totalRate,
  });
};

/**
 * Calculates full cost recovery rate.
 *
 * @param {number} directCosts - Direct costs
 * @param {number} indirectCosts - Indirect costs
 * @param {number} estimatedVolume - Estimated service volume
 * @returns {{ directRate: number; indirectRate: number; totalRate: number }}
 */
export const calculateFullCostRecoveryRate = (
  directCosts: number,
  indirectCosts: number,
  estimatedVolume: number,
): { directRate: number; indirectRate: number; totalRate: number } => {
  if (estimatedVolume === 0) {
    throw new Error('Estimated volume cannot be zero');
  }

  const directRate = directCosts / estimatedVolume;
  const indirectRate = indirectCosts / estimatedVolume;
  const totalRate = directRate + indirectRate;

  return { directRate, indirectRate, totalRate };
};

/**
 * Updates rate structure approval.
 *
 * @param {string} rateId - Rate ID
 * @param {string} approverId - Approver user ID
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any>} Approved rate
 */
export const approveRateStructure = async (
  rateId: string,
  approverId: string,
  RateStructure: any,
): Promise<any> => {
  const rate = await RateStructure.findOne({ where: { rateId } });
  if (!rate) throw new Error('Rate not found');

  rate.approvedBy = approverId;
  rate.approvedDate = new Date();
  await rate.save();

  return rate;
};

/**
 * Retrieves active rates for service type.
 *
 * @param {string} serviceType - Service type
 * @param {Date} effectiveDate - Effective date
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any>} Active rate
 */
export const getActiveRateForService = async (
  serviceType: string,
  effectiveDate: Date,
  RateStructure: any,
): Promise<any> => {
  return await RateStructure.findOne({
    where: {
      serviceType,
      effectiveDate: { [Op.lte]: effectiveDate },
      expirationDate: { [Op.gte]: effectiveDate },
    },
  });
};

/**
 * Compares rate structures across periods.
 *
 * @param {string} serviceType - Service type
 * @param {string} periodA - Period A
 * @param {string} periodB - Period B
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any>} Rate comparison
 */
export const compareRateStructures = async (
  serviceType: string,
  periodA: string,
  periodB: string,
  RateStructure: any,
): Promise<any> => {
  const rateA = await RateStructure.findOne({
    where: { serviceType, ratePeriod: periodA },
  });
  const rateB = await RateStructure.findOne({
    where: { serviceType, ratePeriod: periodB },
  });

  if (!rateA || !rateB) throw new Error('Rate not found for comparison');

  const variance = parseFloat(rateB.totalRate) - parseFloat(rateA.totalRate);
  const variancePercent = parseFloat(rateA.totalRate) > 0
    ? (variance / parseFloat(rateA.totalRate)) * 100
    : 0;

  return {
    serviceType,
    periodA: {
      period: periodA,
      totalRate: rateA.totalRate,
    },
    periodB: {
      period: periodB,
      totalRate: rateB.totalRate,
    },
    variance,
    variancePercent,
  };
};

/**
 * Generates rate justification report.
 *
 * @param {string} rateId - Rate ID
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any>} Justification report
 */
export const generateRateJustificationReport = async (
  rateId: string,
  RateStructure: any,
): Promise<any> => {
  const rate = await RateStructure.findOne({ where: { rateId } });
  if (!rate) throw new Error('Rate not found');

  return {
    rateId,
    serviceType: rate.serviceType,
    ratePeriod: rate.ratePeriod,
    components: {
      billing: rate.billingRate,
      costRecovery: rate.costRecoveryRate,
      overhead: rate.overheadRate,
      total: rate.totalRate,
    },
    justification: rate.justification,
    effectivePeriod: {
      start: rate.effectiveDate,
      end: rate.expirationDate,
    },
    approval: {
      approvedBy: rate.approvedBy,
      approvedDate: rate.approvedDate,
    },
  };
};

/**
 * Forecasts rate adjustments.
 *
 * @param {string} fundCode - Fund code
 * @param {number} currentYear - Current fiscal year
 * @param {number} inflationRate - Inflation rate percentage
 * @param {Model} RateStructure - RateStructure model
 * @returns {Promise<any[]>} Rate forecasts
 */
export const forecastRateAdjustments = async (
  fundCode: string,
  currentYear: number,
  inflationRate: number,
  RateStructure: any,
): Promise<any[]> => {
  const currentRates = await RateStructure.findAll({
    where: {
      fundCode,
      ratePeriod: `FY${currentYear}`,
    },
  });

  return currentRates.map((rate: any) => ({
    serviceType: rate.serviceType,
    currentRate: rate.totalRate,
    forecastedRate: parseFloat(rate.totalRate) * (1 + inflationRate / 100),
    adjustment: parseFloat(rate.totalRate) * (inflationRate / 100),
  }));
};

// ============================================================================
// CUSTOMER ORDER MANAGEMENT (14-20)
// ============================================================================

/**
 * Creates customer order.
 *
 * @param {CustomerOrderData} orderData - Order data
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Created order
 */
export const createCustomerOrder = async (
  orderData: CustomerOrderData,
  CustomerOrder: any,
): Promise<any> => {
  return await CustomerOrder.create(orderData);
};

/**
 * Updates order actual costs.
 *
 * @param {string} orderId - Order ID
 * @param {number} actualCost - Actual cost
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Updated order
 */
export const updateOrderActualCosts = async (
  orderId: string,
  actualCost: number,
  CustomerOrder: any,
): Promise<any> => {
  const order = await CustomerOrder.findOne({ where: { orderId } });
  if (!order) throw new Error('Order not found');

  order.actualCost = actualCost;
  await order.save();

  return order;
};

/**
 * Processes order billing.
 *
 * @param {string} orderId - Order ID
 * @param {number} billingAmount - Billing amount
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Updated order
 */
export const processOrderBilling = async (
  orderId: string,
  billingAmount: number,
  CustomerOrder: any,
): Promise<any> => {
  const order = await CustomerOrder.findOne({ where: { orderId } });
  if (!order) throw new Error('Order not found');

  order.billedAmount += billingAmount;
  await order.save();

  return order;
};

/**
 * Records order payment.
 *
 * @param {string} orderId - Order ID
 * @param {number} paymentAmount - Payment amount
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Updated order
 */
export const recordOrderPayment = async (
  orderId: string,
  paymentAmount: number,
  CustomerOrder: any,
): Promise<any> => {
  const order = await CustomerOrder.findOne({ where: { orderId } });
  if (!order) throw new Error('Order not found');

  order.paidAmount += paymentAmount;
  await order.save();

  return order;
};

/**
 * Completes customer order.
 *
 * @param {string} orderId - Order ID
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Completed order
 */
export const completeCustomerOrder = async (
  orderId: string,
  CustomerOrder: any,
): Promise<any> => {
  const order = await CustomerOrder.findOne({ where: { orderId } });
  if (!order) throw new Error('Order not found');

  order.status = 'completed';
  order.completionDate = new Date();
  await order.save();

  return order;
};

/**
 * Retrieves orders by customer agency.
 *
 * @param {string} customerAgency - Customer agency
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any[]>} Customer orders
 */
export const getOrdersByCustomer = async (
  customerAgency: string,
  CustomerOrder: any,
): Promise<any[]> => {
  return await CustomerOrder.findAll({
    where: { customerAgency },
    order: [['orderDate', 'DESC']],
  });
};

/**
 * Generates order revenue report.
 *
 * @param {string} fundCode - Fund code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Revenue report
 */
export const generateOrderRevenueReport = async (
  fundCode: string,
  startDate: Date,
  endDate: Date,
  CustomerOrder: any,
): Promise<any> => {
  const orders = await CustomerOrder.findAll({
    where: {
      fundCode,
      orderDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalOrders = orders.length;
  const totalBilled = orders.reduce((sum: number, o: any) => sum + parseFloat(o.billedAmount), 0);
  const totalPaid = orders.reduce((sum: number, o: any) => sum + parseFloat(o.paidAmount), 0);
  const outstandingAR = totalBilled - totalPaid;

  return {
    fundCode,
    period: { startDate, endDate },
    totalOrders,
    totalBilled,
    totalPaid,
    outstandingAR,
    collectionRate: totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0,
  };
};

// ============================================================================
// BILLING CYCLE MANAGEMENT (21-27)
// ============================================================================

/**
 * Creates billing cycle.
 *
 * @param {BillingCycleData} cycleData - Cycle data
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any>} Created cycle
 */
export const createBillingCycle = async (
  cycleData: BillingCycleData,
  BillingCycle: any,
): Promise<any> => {
  return await BillingCycle.create(cycleData);
};

/**
 * Processes billing cycle.
 *
 * @param {string} cycleId - Cycle ID
 * @param {Model} BillingCycle - BillingCycle model
 * @param {Model} CustomerOrder - CustomerOrder model
 * @returns {Promise<any>} Processed cycle
 */
export const processBillingCycle = async (
  cycleId: string,
  BillingCycle: any,
  CustomerOrder: any,
): Promise<any> => {
  const cycle = await BillingCycle.findOne({ where: { cycleId } });
  if (!cycle) throw new Error('Billing cycle not found');

  const orders = await CustomerOrder.findAll({
    where: {
      fundCode: cycle.fundCode,
      orderDate: { [Op.between]: [cycle.periodStartDate, cycle.periodEndDate] },
      status: 'active',
    },
  });

  let totalBilled = 0;
  for (const order of orders) {
    const billingAmount = parseFloat(order.actualCost) - parseFloat(order.billedAmount);
    if (billingAmount > 0) {
      await processOrderBilling(order.orderId, billingAmount, CustomerOrder);
      totalBilled += billingAmount;
    }
  }

  cycle.totalRevenue = totalBilled;
  cycle.billedCount = orders.length;
  cycle.status = 'billed';
  await cycle.save();

  return cycle;
};

/**
 * Closes billing cycle.
 *
 * @param {string} cycleId - Cycle ID
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any>} Closed cycle
 */
export const closeBillingCycle = async (
  cycleId: string,
  BillingCycle: any,
): Promise<any> => {
  const cycle = await BillingCycle.findOne({ where: { cycleId } });
  if (!cycle) throw new Error('Billing cycle not found');

  cycle.status = 'closed';
  await cycle.save();

  return cycle;
};

/**
 * Retrieves billing cycles by status.
 *
 * @param {string} status - Cycle status
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any[]>} Billing cycles
 */
export const getBillingCyclesByStatus = async (
  status: string,
  BillingCycle: any,
): Promise<any[]> => {
  return await BillingCycle.findAll({
    where: { status },
    order: [['periodStartDate', 'DESC']],
  });
};

/**
 * Calculates cycle revenue variance.
 *
 * @param {string} cycleId - Cycle ID
 * @param {number} budgetedRevenue - Budgeted revenue
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any>} Variance analysis
 */
export const calculateCycleRevenueVariance = async (
  cycleId: string,
  budgetedRevenue: number,
  BillingCycle: any,
): Promise<any> => {
  const cycle = await BillingCycle.findOne({ where: { cycleId } });
  if (!cycle) throw new Error('Billing cycle not found');

  const variance = parseFloat(cycle.totalRevenue) - budgetedRevenue;
  const variancePercent = budgetedRevenue > 0 ? (variance / budgetedRevenue) * 100 : 0;

  return {
    cycleId,
    budgetedRevenue,
    actualRevenue: cycle.totalRevenue,
    variance,
    variancePercent,
    favorable: variance >= 0,
  };
};

/**
 * Generates billing cycle summary.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any>} Cycle summary
 */
export const generateBillingCycleSummary = async (
  fiscalYear: number,
  BillingCycle: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const cycles = await BillingCycle.findAll({
    where: {
      periodStartDate: { [Op.gte]: startDate },
      periodEndDate: { [Op.lte]: endDate },
    },
  });

  const totalRevenue = cycles.reduce((sum: number, c: any) => sum + parseFloat(c.totalRevenue), 0);
  const totalExpenses = cycles.reduce((sum: number, c: any) => sum + parseFloat(c.totalExpenses), 0);
  const totalNetIncome = cycles.reduce((sum: number, c: any) => sum + parseFloat(c.netIncome), 0);

  return {
    fiscalYear,
    totalCycles: cycles.length,
    totalRevenue,
    totalExpenses,
    totalNetIncome,
    avgRevenuePerCycle: cycles.length > 0 ? totalRevenue / cycles.length : 0,
  };
};

/**
 * Exports billing data to CSV.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<string>} CSV content
 */
export const exportBillingDataCSV = async (
  startDate: Date,
  endDate: Date,
  BillingCycle: any,
): Promise<string> => {
  const cycles = await BillingCycle.findAll({
    where: {
      periodStartDate: { [Op.gte]: startDate },
      periodEndDate: { [Op.lte]: endDate },
    },
    order: [['periodStartDate', 'ASC']],
  });

  const headers = 'Cycle ID,Fund Code,Period Start,Period End,Total Revenue,Total Expenses,Net Income,Status\n';
  const rows = cycles.map((c: any) =>
    `${c.cycleId},${c.fundCode},${c.periodStartDate.toISOString().split('T')[0]},${c.periodEndDate.toISOString().split('T')[0]},${c.totalRevenue},${c.totalExpenses},${c.netIncome},${c.status}`
  );

  return headers + rows.join('\n');
};

// ============================================================================
// COST RECOVERY & ANALYSIS (28-31)
// ============================================================================

/**
 * Calculates cost recovery rate.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<CostRecoveryData>} Cost recovery analysis
 */
export const calculateCostRecoveryRate = async (
  fundCode: string,
  fiscalYear: number,
  WorkingCapitalFund: any,
): Promise<CostRecoveryData> => {
  const fund = await WorkingCapitalFund.findOne({
    where: { fundCode, fiscalYear },
  });

  if (!fund) throw new Error('Fund not found');

  const totalCosts = parseFloat(fund.totalExpenses);
  const recoveredRevenue = parseFloat(fund.totalRevenue);
  const recoveryRate = totalCosts > 0 ? (recoveredRevenue / totalCosts) * 100 : 0;
  const variance = recoveredRevenue - totalCosts;

  return {
    fundCode,
    fiscalYear,
    totalCosts,
    recoveredRevenue,
    recoveryRate,
    variance,
  };
};

/**
 * Analyzes cost recovery trends.
 *
 * @param {string} fundCode - Fund code
 * @param {number} startYear - Start fiscal year
 * @param {number} endYear - End fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<any[]>} Recovery trends
 */
export const analyzeCostRecoveryTrends = async (
  fundCode: string,
  startYear: number,
  endYear: number,
  WorkingCapitalFund: any,
): Promise<any[]> => {
  const trends = [];

  for (let year = startYear; year <= endYear; year++) {
    const recovery = await calculateCostRecoveryRate(fundCode, year, WorkingCapitalFund);
    trends.push({
      fiscalYear: year,
      ...recovery,
    });
  }

  return trends;
};

/**
 * Validates cost recovery compliance.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} targetRecoveryRate - Target recovery rate percentage
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<{ compliant: boolean; actualRate: number; targetRate: number }>}
 */
export const validateCostRecoveryCompliance = async (
  fundCode: string,
  fiscalYear: number,
  targetRecoveryRate: number,
  WorkingCapitalFund: any,
): Promise<{ compliant: boolean; actualRate: number; targetRate: number }> => {
  const recovery = await calculateCostRecoveryRate(fundCode, fiscalYear, WorkingCapitalFund);

  return {
    compliant: recovery.recoveryRate >= targetRecoveryRate,
    actualRate: recovery.recoveryRate,
    targetRate: targetRecoveryRate,
  };
};

/**
 * Generates cost recovery improvement plan.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} targetRate - Target recovery rate
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @returns {Promise<any>} Improvement plan
 */
export const generateCostRecoveryImprovementPlan = async (
  fundCode: string,
  fiscalYear: number,
  targetRate: number,
  WorkingCapitalFund: any,
): Promise<any> => {
  const recovery = await calculateCostRecoveryRate(fundCode, fiscalYear, WorkingCapitalFund);
  const gap = targetRate - recovery.recoveryRate;

  const requiredRevenueIncrease = gap > 0 ? recovery.totalCosts * (gap / 100) : 0;

  return {
    fundCode,
    fiscalYear,
    currentRecoveryRate: recovery.recoveryRate,
    targetRecoveryRate: targetRate,
    gap,
    requiredRevenueIncrease,
    recommendations: gap > 0 ? [
      'Review and adjust billing rates',
      'Increase service volume',
      'Reduce operating costs',
      'Eliminate unprofitable services',
    ] : ['Maintain current cost recovery practices'],
  };
};

// ============================================================================
// INVENTORY VALUATION (32-37)
// ============================================================================

/**
 * Values inventory using FIFO method.
 *
 * @param {InventoryValuationData} inventoryData - Inventory data
 * @param {Model} InventoryValuation - InventoryValuation model
 * @returns {Promise<any>} Valued inventory
 */
export const valueInventoryFIFO = async (
  inventoryData: InventoryValuationData,
  InventoryValuation: any,
): Promise<any> => {
  const totalValue = inventoryData.quantity * inventoryData.unitCost;

  return await InventoryValuation.create({
    ...inventoryData,
    totalValue,
    valuationMethod: 'FIFO',
    valuationDate: new Date(),
  });
};

/**
 * Updates inventory valuation.
 *
 * @param {string} inventoryId - Inventory ID
 * @param {number} newQuantity - New quantity
 * @param {number} newUnitCost - New unit cost
 * @param {Model} InventoryValuation - InventoryValuation model
 * @returns {Promise<any>} Updated inventory
 */
export const updateInventoryValuation = async (
  inventoryId: string,
  newQuantity: number,
  newUnitCost: number,
  InventoryValuation: any,
): Promise<any> => {
  const inventory = await InventoryValuation.findOne({ where: { inventoryId } });
  if (!inventory) throw new Error('Inventory not found');

  inventory.quantity = newQuantity;
  inventory.unitCost = newUnitCost;
  inventory.totalValue = newQuantity * newUnitCost;
  inventory.valuationDate = new Date();
  await inventory.save();

  return inventory;
};

/**
 * Calculates total inventory value.
 *
 * @param {string} fundCode - Fund code
 * @param {Model} InventoryValuation - InventoryValuation model
 * @returns {Promise<number>} Total inventory value
 */
export const calculateTotalInventoryValue = async (
  fundCode: string,
  InventoryValuation: any,
): Promise<number> => {
  const inventory = await InventoryValuation.findAll({
    where: { fundCode },
  });

  return inventory.reduce((sum: number, item: any) => sum + parseFloat(item.totalValue), 0);
};

/**
 * Retrieves inventory by category.
 *
 * @param {string} fundCode - Fund code
 * @param {string} itemCategory - Item category
 * @param {Model} InventoryValuation - InventoryValuation model
 * @returns {Promise<any[]>} Inventory items
 */
export const getInventoryByCategory = async (
  fundCode: string,
  itemCategory: string,
  InventoryValuation: any,
): Promise<any[]> => {
  return await InventoryValuation.findAll({
    where: { fundCode, itemCategory },
    order: [['itemDescription', 'ASC']],
  });
};

/**
 * Generates inventory valuation report.
 *
 * @param {string} fundCode - Fund code
 * @param {Date} valuationDate - Valuation date
 * @param {Model} InventoryValuation - InventoryValuation model
 * @returns {Promise<any>} Valuation report
 */
export const generateInventoryValuationReport = async (
  fundCode: string,
  valuationDate: Date,
  InventoryValuation: any,
): Promise<any> => {
  const inventory = await InventoryValuation.findAll({
    where: {
      fundCode,
      valuationDate: { [Op.lte]: valuationDate },
    },
  });

  const byCategory = new Map<string, any>();
  inventory.forEach((item: any) => {
    if (!byCategory.has(item.itemCategory)) {
      byCategory.set(item.itemCategory, { count: 0, totalValue: 0 });
    }
    const category = byCategory.get(item.itemCategory);
    category.count++;
    category.totalValue += parseFloat(item.totalValue);
  });

  const totalValue = inventory.reduce((sum: number, item: any) => sum + parseFloat(item.totalValue), 0);

  return {
    fundCode,
    valuationDate,
    totalItems: inventory.length,
    totalValue,
    byCategory: Array.from(byCategory.entries()).map(([category, data]) => ({
      category,
      ...data,
    })),
  };
};

/**
 * Exports comprehensive working capital fund report.
 *
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} WorkingCapitalFund - WorkingCapitalFund model
 * @param {Model} CustomerOrder - CustomerOrder model
 * @param {Model} BillingCycle - BillingCycle model
 * @returns {Promise<any>} Comprehensive report
 */
export const exportWorkingCapitalFundReport = async (
  fundCode: string,
  fiscalYear: number,
  WorkingCapitalFund: any,
  CustomerOrder: any,
  BillingCycle: any,
): Promise<any> => {
  const fund = await WorkingCapitalFund.findOne({ where: { fundCode, fiscalYear } });
  const orders = await CustomerOrder.findAll({ where: { fundCode } });
  const cycles = await BillingCycle.findAll({ where: { fundCode } });

  const costRecovery = await calculateCostRecoveryRate(fundCode, fiscalYear, WorkingCapitalFund);

  return {
    fundCode,
    fiscalYear,
    generatedAt: new Date(),
    fundSummary: fund,
    orderSummary: {
      totalOrders: orders.length,
      activeOrders: orders.filter((o: any) => o.status === 'active').length,
      completedOrders: orders.filter((o: any) => o.status === 'completed').length,
    },
    billingSummary: {
      totalCycles: cycles.length,
      totalBilled: cycles.reduce((sum: number, c: any) => sum + parseFloat(c.totalRevenue), 0),
    },
    costRecovery,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSWorkingCapitalFundService {
  constructor(private readonly sequelize: Sequelize) {}

  async createWorkingCapitalFund(fundData: WorkingCapitalFundData) {
    const WorkingCapitalFund = createWorkingCapitalFundModel(this.sequelize);
    return createWorkingCapitalFund(fundData, WorkingCapitalFund);
  }

  async createRateStructure(rateData: RateStructureData) {
    const RateStructure = createRateStructureModel(this.sequelize);
    return createRateStructure(rateData, RateStructure);
  }

  async createCustomerOrder(orderData: CustomerOrderData) {
    const CustomerOrder = createCustomerOrderModel(this.sequelize);
    return createCustomerOrder(orderData, CustomerOrder);
  }

  async calculateCostRecoveryRate(fundCode: string, fiscalYear: number) {
    const WorkingCapitalFund = createWorkingCapitalFundModel(this.sequelize);
    return calculateCostRecoveryRate(fundCode, fiscalYear, WorkingCapitalFund);
  }
}

export default {
  // Models
  createWorkingCapitalFundModel,
  createRateStructureModel,
  createCustomerOrderModel,
  createBillingCycleModel,
  createInventoryValuationModel,

  // Fund Management
  createWorkingCapitalFund,
  updateFundBalance,
  calculateOperatingReserveRequirement,
  validateFundSustainability,
  generateFundFinancialStatement,
  transferBetweenFunds,

  // Rate Setting
  createRateStructure,
  calculateFullCostRecoveryRate,
  approveRateStructure,
  getActiveRateForService,
  compareRateStructures,
  generateRateJustificationReport,
  forecastRateAdjustments,

  // Customer Orders
  createCustomerOrder,
  updateOrderActualCosts,
  processOrderBilling,
  recordOrderPayment,
  completeCustomerOrder,
  getOrdersByCustomer,
  generateOrderRevenueReport,

  // Billing Cycles
  createBillingCycle,
  processBillingCycle,
  closeBillingCycle,
  getBillingCyclesByStatus,
  calculateCycleRevenueVariance,
  generateBillingCycleSummary,
  exportBillingDataCSV,

  // Cost Recovery
  calculateCostRecoveryRate,
  analyzeCostRecoveryTrends,
  validateCostRecoveryCompliance,
  generateCostRecoveryImprovementPlan,

  // Inventory
  valueInventoryFIFO,
  updateInventoryValuation,
  calculateTotalInventoryValue,
  getInventoryByCategory,
  generateInventoryValuationReport,
  exportWorkingCapitalFundReport,

  // Service
  CEFMSWorkingCapitalFundService,
};

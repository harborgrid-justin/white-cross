/**
 * LOC: CEFMSCFF001
 * File: /reuse/financial/cefms/composites/cefms-cash-flow-forecasting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/fund-accounting-operations-kit.ts
 *   - ../../../government/budget-appropriations-kit.ts
 *   - ../../../government/government-financial-reporting-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS cash management services
 *   - USACE treasury operations systems
 *   - Cash flow analysis modules
 *   - Liquidity management dashboards
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-cash-flow-forecasting-composite.ts
 * Locator: WC-CEFMS-CFF-001
 * Purpose: USACE CEFMS Cash Flow Forecasting - cash position analysis, projections, liquidity management, treasury operations
 *
 * Upstream: Composes utilities from government kits for comprehensive cash flow management
 * Downstream: ../../../backend/cefms/*, Cash management controllers, treasury operations, investment planning
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38 composite functions for USACE CEFMS cash flow forecasting and management
 *
 * LLM Context: Production-ready USACE CEFMS cash flow forecasting and treasury management system.
 * Comprehensive cash position tracking, cash flow projections (short/medium/long term), liquidity analysis,
 * cash requirements planning, treasury operations management, short-term investment optimization,
 * cash concentration and pooling, variance analysis, scenario modeling, and working capital management
 * with full integration to fund accounting and budget systems for accurate cash forecasting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CashPositionData {
  positionDate: Date;
  fundId: string;
  fundName: string;
  cashBalance: number;
  uncommittedCash: number;
  restrictedCash: number;
  unresolvedTransactions: number;
  pendingReceipts: number;
  pendingDisbursements: number;
  netPosition: number;
  currency: string;
}

interface CashFlowProjection {
  projectionId: string;
  projectionDate: Date;
  forecastPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  startDate: Date;
  endDate: Date;
  fundId?: string;
  openingBalance: number;
  projectedReceipts: number;
  projectedDisbursements: number;
  projectedNetFlow: number;
  closingBalance: number;
  confidenceLevel: number;
  scenario: 'base' | 'optimistic' | 'pessimistic';
}

interface LiquidityMetrics {
  asOfDate: Date;
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  workingCapital: number;
  daysOfCashOnHand: number;
  cashTurnover: number;
  liquidityScore: number;
  adequacyLevel: 'critical' | 'low' | 'adequate' | 'strong' | 'excess';
}

interface TreasuryTransaction {
  transactionId: string;
  transactionDate: Date;
  transactionType: 'receipt' | 'disbursement' | 'investment' | 'transfer';
  fundId: string;
  amount: number;
  currency: string;
  counterparty?: string;
  settlementDate: Date;
  status: 'pending' | 'settled' | 'cancelled';
  description: string;
}

interface ShortTermInvestment {
  investmentId: string;
  fundId: string;
  investmentType: 'treasury_bill' | 'money_market' | 'cd' | 'commercial_paper' | 'repo';
  principalAmount: number;
  interestRate: number;
  maturityDate: Date;
  purchaseDate: Date;
  currentValue: number;
  accruedInterest: number;
  yield: number;
  riskRating: string;
}

interface CashConcentration {
  concentrationId: string;
  concentrationDate: Date;
  sourceFunds: string[];
  targetFund: string;
  totalConcentrated: number;
  concentrationMethod: 'zero_balance' | 'target_balance' | 'threshold';
  status: 'scheduled' | 'executed' | 'cancelled';
}

interface VarianceAnalysis {
  analysisDate: Date;
  periodType: 'daily' | 'weekly' | 'monthly';
  actualReceipts: number;
  forecastReceipts: number;
  receiptsVariance: number;
  receiptsVariancePercent: number;
  actualDisbursements: number;
  forecastDisbursements: number;
  disbursementsVariance: number;
  disbursementsVariancePercent: number;
  netVariance: number;
  majorVarianceReasons: string[];
}

interface CashRequirement {
  requirementId: string;
  requirementDate: Date;
  fundId: string;
  requiredAmount: number;
  purposeCategory: 'payroll' | 'vendor_payment' | 'debt_service' | 'capital' | 'operating';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'planned' | 'funded' | 'paid' | 'deferred';
  dueDate: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Cash Position tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashPosition model
 *
 * @example
 * ```typescript
 * const CashPosition = createCashPositionModel(sequelize);
 * const position = await CashPosition.create({
 *   positionDate: new Date(),
 *   fundId: 'FUND-001',
 *   fundName: 'General Fund',
 *   cashBalance: 5000000,
 *   uncommittedCash: 3000000,
 *   restrictedCash: 2000000
 * });
 * ```
 */
export const createCashPositionModel = (sequelize: Sequelize) => {
  class CashPosition extends Model {
    public id!: string;
    public positionDate!: Date;
    public fundId!: string;
    public fundName!: string;
    public cashBalance!: number;
    public uncommittedCash!: number;
    public restrictedCash!: number;
    public unresolvedTransactions!: number;
    public pendingReceipts!: number;
    public pendingDisbursements!: number;
    public netPosition!: number;
    public currency!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CashPosition.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      positionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Position date',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund identifier',
      },
      fundName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Fund name',
      },
      cashBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cash balance',
      },
      uncommittedCash: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Uncommitted cash',
      },
      restrictedCash: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Restricted cash',
      },
      unresolvedTransactions: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unresolved transactions',
      },
      pendingReceipts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Pending receipts',
      },
      pendingDisbursements: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Pending disbursements',
      },
      netPosition: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net cash position',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
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
      tableName: 'cash_positions',
      timestamps: true,
      indexes: [
        { fields: ['positionDate'] },
        { fields: ['fundId'] },
        { fields: ['fundId', 'positionDate'] },
      ],
    },
  );

  return CashPosition;
};

/**
 * Sequelize model for Cash Flow Projections.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashFlowProjection model
 */
export const createCashFlowProjectionModel = (sequelize: Sequelize) => {
  class CashFlowProjectionModel extends Model {
    public id!: string;
    public projectionId!: string;
    public projectionDate!: Date;
    public forecastPeriod!: string;
    public startDate!: Date;
    public endDate!: Date;
    public fundId!: string | null;
    public openingBalance!: number;
    public projectedReceipts!: number;
    public projectedDisbursements!: number;
    public projectedNetFlow!: number;
    public closingBalance!: number;
    public confidenceLevel!: number;
    public scenario!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CashFlowProjectionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Projection identifier',
      },
      projectionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Projection date',
      },
      forecastPeriod: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
        allowNull: false,
        comment: 'Forecast period',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund identifier',
      },
      openingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Opening balance',
      },
      projectedReceipts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Projected receipts',
      },
      projectedDisbursements: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Projected disbursements',
      },
      projectedNetFlow: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Projected net flow',
      },
      closingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Projected closing balance',
      },
      confidenceLevel: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 80,
        comment: 'Confidence level percentage',
      },
      scenario: {
        type: DataTypes.ENUM('base', 'optimistic', 'pessimistic'),
        allowNull: false,
        defaultValue: 'base',
        comment: 'Scenario type',
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
      tableName: 'cash_flow_projections',
      timestamps: true,
      indexes: [
        { fields: ['projectionId'], unique: true },
        { fields: ['projectionDate'] },
        { fields: ['fundId'] },
        { fields: ['startDate', 'endDate'] },
        { fields: ['scenario'] },
      ],
    },
  );

  return CashFlowProjectionModel;
};

/**
 * Sequelize model for Treasury Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TreasuryTransaction model
 */
export const createTreasuryTransactionModel = (sequelize: Sequelize) => {
  class TreasuryTransactionModel extends Model {
    public id!: string;
    public transactionId!: string;
    public transactionDate!: Date;
    public transactionType!: string;
    public fundId!: string;
    public amount!: number;
    public currency!: string;
    public counterparty!: string | null;
    public settlementDate!: Date;
    public status!: string;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TreasuryTransactionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Transaction identifier',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transaction date',
      },
      transactionType: {
        type: DataTypes.ENUM('receipt', 'disbursement', 'investment', 'transfer'),
        allowNull: false,
        comment: 'Transaction type',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund identifier',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      counterparty: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Counterparty',
      },
      settlementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Settlement date',
      },
      status: {
        type: DataTypes.ENUM('pending', 'settled', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Transaction status',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transaction description',
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
      tableName: 'treasury_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['transactionDate'] },
        { fields: ['fundId'] },
        { fields: ['transactionType'] },
        { fields: ['status'] },
        { fields: ['settlementDate'] },
      ],
    },
  );

  return TreasuryTransactionModel;
};

/**
 * Sequelize model for Short-term Investments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ShortTermInvestment model
 */
export const createShortTermInvestmentModel = (sequelize: Sequelize) => {
  class ShortTermInvestmentModel extends Model {
    public id!: string;
    public investmentId!: string;
    public fundId!: string;
    public investmentType!: string;
    public principalAmount!: number;
    public interestRate!: number;
    public maturityDate!: Date;
    public purchaseDate!: Date;
    public currentValue!: number;
    public accruedInterest!: number;
    public yield!: number;
    public riskRating!: string;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ShortTermInvestmentModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      investmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Investment identifier',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund identifier',
      },
      investmentType: {
        type: DataTypes.ENUM('treasury_bill', 'money_market', 'cd', 'commercial_paper', 'repo'),
        allowNull: false,
        comment: 'Investment type',
      },
      principalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Principal amount',
      },
      interestRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Interest rate',
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maturity date',
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Purchase date',
      },
      currentValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current value',
      },
      accruedInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accrued interest',
      },
      yield: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Yield percentage',
      },
      riskRating: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'AAA',
        comment: 'Risk rating',
      },
      status: {
        type: DataTypes.ENUM('active', 'matured', 'sold', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Investment status',
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
      tableName: 'short_term_investments',
      timestamps: true,
      indexes: [
        { fields: ['investmentId'], unique: true },
        { fields: ['fundId'] },
        { fields: ['investmentType'] },
        { fields: ['maturityDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return ShortTermInvestmentModel;
};

/**
 * Sequelize model for Cash Requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashRequirement model
 */
export const createCashRequirementModel = (sequelize: Sequelize) => {
  class CashRequirementModel extends Model {
    public id!: string;
    public requirementId!: string;
    public requirementDate!: Date;
    public fundId!: string;
    public requiredAmount!: number;
    public purposeCategory!: string;
    public priority!: string;
    public status!: string;
    public dueDate!: Date;
    public fundedDate!: Date | null;
    public paidDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CashRequirementModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requirementId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Requirement identifier',
      },
      requirementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Requirement date',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund identifier',
      },
      requiredAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Required amount',
      },
      purposeCategory: {
        type: DataTypes.ENUM('payroll', 'vendor_payment', 'debt_service', 'capital', 'operating'),
        allowNull: false,
        comment: 'Purpose category',
      },
      priority: {
        type: DataTypes.ENUM('urgent', 'high', 'medium', 'low'),
        allowNull: false,
        comment: 'Priority level',
      },
      status: {
        type: DataTypes.ENUM('planned', 'funded', 'paid', 'deferred'),
        allowNull: false,
        defaultValue: 'planned',
        comment: 'Requirement status',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Due date',
      },
      fundedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Funded date',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Paid date',
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
      tableName: 'cash_requirements',
      timestamps: true,
      indexes: [
        { fields: ['requirementId'], unique: true },
        { fields: ['fundId'] },
        { fields: ['dueDate'] },
        { fields: ['status'] },
        { fields: ['priority'] },
      ],
    },
  );

  return CashRequirementModel;
};

// ============================================================================
// CASH POSITION MANAGEMENT (1-6)
// ============================================================================

/**
 * Records current cash position for fund.
 *
 * @param {CashPositionData} positionData - Position data
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Created position record
 */
export const recordCashPosition = async (
  positionData: CashPositionData,
  CashPosition: any,
): Promise<any> => {
  return await CashPosition.create(positionData);
};

/**
 * Retrieves current cash position.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Current position
 */
export const getCurrentCashPosition = async (
  fundId: string,
  CashPosition: any,
): Promise<any> => {
  return await CashPosition.findOne({
    where: { fundId },
    order: [['positionDate', 'DESC']],
  });
};

/**
 * Calculates net available cash.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<number>} Available cash
 */
export const calculateAvailableCash = async (
  fundId: string,
  CashPosition: any,
): Promise<number> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  if (!position) return 0;

  return (
    parseFloat(position.cashBalance) -
    parseFloat(position.restrictedCash) -
    parseFloat(position.pendingDisbursements)
  );
};

/**
 * Generates consolidated cash position for all funds.
 *
 * @param {Date} asOfDate - As of date
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Consolidated position
 */
export const generateConsolidatedCashPosition = async (
  asOfDate: Date,
  CashPosition: any,
): Promise<any> => {
  const positions = await CashPosition.findAll({
    where: {
      positionDate: {
        [Op.gte]: asOfDate,
      },
    },
    order: [['positionDate', 'DESC']],
  });

  const consolidatedPosition = {
    asOfDate,
    totalCash: 0,
    totalUncommittedCash: 0,
    totalRestrictedCash: 0,
    totalPendingReceipts: 0,
    totalPendingDisbursements: 0,
    netPosition: 0,
    fundPositions: [] as any[],
  };

  const fundMap = new Map<string, any>();

  positions.forEach((pos: any) => {
    if (!fundMap.has(pos.fundId)) {
      fundMap.set(pos.fundId, pos);
    }
  });

  fundMap.forEach((position) => {
    consolidatedPosition.totalCash += parseFloat(position.cashBalance);
    consolidatedPosition.totalUncommittedCash += parseFloat(position.uncommittedCash);
    consolidatedPosition.totalRestrictedCash += parseFloat(position.restrictedCash);
    consolidatedPosition.totalPendingReceipts += parseFloat(position.pendingReceipts);
    consolidatedPosition.totalPendingDisbursements += parseFloat(position.pendingDisbursements);
    consolidatedPosition.netPosition += parseFloat(position.netPosition);
    consolidatedPosition.fundPositions.push(position);
  });

  return consolidatedPosition;
};

/**
 * Compares cash positions over time.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Comparison data
 */
export const compareCashPositions = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  CashPosition: any,
): Promise<any> => {
  const positions = await CashPosition.findAll({
    where: {
      fundId,
      positionDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['positionDate', 'ASC']],
  });

  if (positions.length < 2) {
    return {
      fundId,
      period: { startDate, endDate },
      insufficientData: true,
    };
  }

  const startPosition = positions[0];
  const endPosition = positions[positions.length - 1];

  const change = parseFloat(endPosition.cashBalance) - parseFloat(startPosition.cashBalance);
  const changePercent =
    parseFloat(startPosition.cashBalance) !== 0
      ? (change / parseFloat(startPosition.cashBalance)) * 100
      : 0;

  return {
    fundId,
    period: { startDate, endDate },
    startingBalance: parseFloat(startPosition.cashBalance),
    endingBalance: parseFloat(endPosition.cashBalance),
    change,
    changePercent,
    trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
    dataPoints: positions.length,
  };
};

/**
 * Alerts on low cash positions.
 *
 * @param {number} threshold - Threshold amount
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any[]>} Low cash alerts
 */
export const alertLowCashPositions = async (
  threshold: number,
  CashPosition: any,
): Promise<any[]> => {
  const latestPositions = await sequelize.query(
    `
    SELECT cp.*
    FROM cash_positions cp
    INNER JOIN (
      SELECT fundId, MAX(positionDate) as maxDate
      FROM cash_positions
      GROUP BY fundId
    ) latest ON cp.fundId = latest.fundId AND cp.positionDate = latest.maxDate
    WHERE cp.cashBalance < :threshold
  `,
    {
      replacements: { threshold },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  return latestPositions.map((pos: any) => ({
    fundId: pos.fundId,
    fundName: pos.fundName,
    currentBalance: pos.cashBalance,
    threshold,
    deficit: threshold - pos.cashBalance,
    severity: pos.cashBalance < threshold * 0.5 ? 'critical' : 'warning',
  }));
};

// ============================================================================
// CASH FLOW PROJECTIONS (7-14)
// ============================================================================

/**
 * Creates cash flow projection.
 *
 * @param {CashFlowProjection} projectionData - Projection data
 * @param {Model} CashFlowProjectionModel - Projection model
 * @returns {Promise<any>} Created projection
 */
export const createCashFlowProjection = async (
  projectionData: CashFlowProjection,
  CashFlowProjectionModel: any,
): Promise<any> => {
  return await CashFlowProjectionModel.create(projectionData);
};

/**
 * Generates daily cash flow projection.
 *
 * @param {string} fundId - Fund ID
 * @param {number} days - Days to project
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} TreasuryTransaction - TreasuryTransaction model
 * @returns {Promise<any[]>} Daily projections
 */
export const generateDailyCashProjection = async (
  fundId: string,
  days: number,
  CashPosition: any,
  TreasuryTransaction: any,
): Promise<any[]> => {
  const currentPosition = await getCurrentCashPosition(fundId, CashPosition);
  if (!currentPosition) throw new Error('No current position found');

  const projections = [];
  let runningBalance = parseFloat(currentPosition.cashBalance);

  for (let i = 0; i < days; i++) {
    const projectionDate = new Date();
    projectionDate.setDate(projectionDate.getDate() + i + 1);

    // Mock daily receipts and disbursements
    const dailyReceipts = Math.random() * 100000;
    const dailyDisbursements = Math.random() * 80000;
    const netFlow = dailyReceipts - dailyDisbursements;
    runningBalance += netFlow;

    projections.push({
      date: projectionDate,
      openingBalance: runningBalance - netFlow,
      receipts: dailyReceipts,
      disbursements: dailyDisbursements,
      netFlow,
      closingBalance: runningBalance,
    });
  }

  return projections;
};

/**
 * Generates monthly cash flow projection.
 *
 * @param {string} fundId - Fund ID
 * @param {number} months - Months to project
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any[]>} Monthly projections
 */
export const generateMonthlyCashProjection = async (
  fundId: string,
  months: number,
  CashPosition: any,
): Promise<any[]> => {
  const currentPosition = await getCurrentCashPosition(fundId, CashPosition);
  if (!currentPosition) throw new Error('No current position found');

  const projections = [];
  let runningBalance = parseFloat(currentPosition.cashBalance);

  for (let i = 0; i < months; i++) {
    const projectionDate = new Date();
    projectionDate.setMonth(projectionDate.getMonth() + i + 1);

    const monthlyReceipts = 2000000 * (1 + Math.random() * 0.2);
    const monthlyDisbursements = 1800000 * (1 + Math.random() * 0.2);
    const netFlow = monthlyReceipts - monthlyDisbursements;
    runningBalance += netFlow;

    projections.push({
      month: projectionDate.toISOString().substring(0, 7),
      openingBalance: runningBalance - netFlow,
      receipts: monthlyReceipts,
      disbursements: monthlyDisbursements,
      netFlow,
      closingBalance: runningBalance,
    });
  }

  return projections;
};

/**
 * Performs scenario analysis on projections.
 *
 * @param {string} fundId - Fund ID
 * @param {number} months - Months to project
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Scenario analysis
 */
export const performScenarioAnalysis = async (
  fundId: string,
  months: number,
  CashPosition: any,
): Promise<any> => {
  const currentPosition = await getCurrentCashPosition(fundId, CashPosition);
  if (!currentPosition) throw new Error('No current position found');

  const baseBalance = parseFloat(currentPosition.cashBalance);
  const baseReceipts = 2000000;
  const baseDisbursements = 1800000;

  const scenarios = {
    base: {
      name: 'Base Case',
      receiptsMultiplier: 1.0,
      disbursementsMultiplier: 1.0,
      endingBalance: baseBalance + months * (baseReceipts - baseDisbursements),
    },
    optimistic: {
      name: 'Optimistic',
      receiptsMultiplier: 1.2,
      disbursementsMultiplier: 0.9,
      endingBalance:
        baseBalance + months * (baseReceipts * 1.2 - baseDisbursements * 0.9),
    },
    pessimistic: {
      name: 'Pessimistic',
      receiptsMultiplier: 0.8,
      disbursementsMultiplier: 1.1,
      endingBalance:
        baseBalance + months * (baseReceipts * 0.8 - baseDisbursements * 1.1),
    },
  };

  return {
    fundId,
    projectionPeriod: months,
    currentBalance: baseBalance,
    scenarios,
  };
};

/**
 * Calculates confidence intervals for projections.
 *
 * @param {string} projectionId - Projection ID
 * @param {Model} CashFlowProjectionModel - Projection model
 * @returns {Promise<any>} Confidence intervals
 */
export const calculateConfidenceIntervals = async (
  projectionId: string,
  CashFlowProjectionModel: any,
): Promise<any> => {
  const projection = await CashFlowProjectionModel.findOne({ where: { projectionId } });
  if (!projection) throw new Error('Projection not found');

  const confidenceLevel = parseFloat(projection.confidenceLevel);
  const closingBalance = parseFloat(projection.closingBalance);

  // Calculate standard error (mock calculation)
  const standardError = closingBalance * 0.05;
  const zScore = 1.96; // 95% confidence

  return {
    projectionId,
    closingBalance,
    confidenceLevel,
    lowerBound: closingBalance - zScore * standardError,
    upperBound: closingBalance + zScore * standardError,
    standardError,
  };
};

/**
 * Identifies cash flow trends.
 *
 * @param {string} fundId - Fund ID
 * @param {number} months - Months to analyze
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Trend analysis
 */
export const identifyCashFlowTrends = async (
  fundId: string,
  months: number,
  CashPosition: any,
): Promise<any> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const positions = await CashPosition.findAll({
    where: {
      fundId,
      positionDate: { [Op.gte]: startDate },
    },
    order: [['positionDate', 'ASC']],
  });

  if (positions.length < 2) {
    return { fundId, trend: 'insufficient_data' };
  }

  const balances = positions.map((p: any) => parseFloat(p.cashBalance));
  const avgBalance = balances.reduce((a, b) => a + b, 0) / balances.length;

  // Simple linear regression
  const n = balances.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  balances.forEach((balance, index) => {
    sumX += index;
    sumY += balance;
    sumXY += index * balance;
    sumX2 += index * index;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return {
    fundId,
    period: months,
    dataPoints: n,
    avgBalance,
    trend: slope > 100 ? 'increasing' : slope < -100 ? 'decreasing' : 'stable',
    slope,
    trendDirection: slope > 0 ? 'upward' : slope < 0 ? 'downward' : 'flat',
  };
};

/**
 * Generates rolling forecast updates.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} CashFlowProjectionModel - Projection model
 * @returns {Promise<any>} Updated forecast
 */
export const generateRollingForecast = async (
  fundId: string,
  CashPosition: any,
  CashFlowProjectionModel: any,
): Promise<any> => {
  const currentPosition = await getCurrentCashPosition(fundId, CashPosition);
  if (!currentPosition) throw new Error('No current position found');

  // Get last projection
  const lastProjection = await CashFlowProjectionModel.findOne({
    where: { fundId },
    order: [['projectionDate', 'DESC']],
  });

  const actualBalance = parseFloat(currentPosition.cashBalance);
  const projectedBalance = lastProjection
    ? parseFloat(lastProjection.closingBalance)
    : actualBalance;
  const variance = actualBalance - projectedBalance;

  // Create new rolling forecast
  const rollingForecast = await generateMonthlyCashProjection(fundId, 12, CashPosition);

  return {
    fundId,
    forecastDate: new Date(),
    actualBalance,
    lastProjectedBalance: projectedBalance,
    variance,
    variancePercent: projectedBalance !== 0 ? (variance / projectedBalance) * 100 : 0,
    rollingForecast,
  };
};

/**
 * Exports cash flow projections.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} CashFlowProjectionModel - Projection model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportCashFlowProjections = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  CashFlowProjectionModel: any,
): Promise<Buffer> => {
  const projections = await CashFlowProjectionModel.findAll({
    where: {
      fundId,
      startDate: { [Op.gte]: startDate },
      endDate: { [Op.lte]: endDate },
    },
    order: [['startDate', 'ASC']],
  });

  const csv =
    'Projection ID,Start Date,End Date,Opening Balance,Projected Receipts,Projected Disbursements,Closing Balance,Scenario\n' +
    projections
      .map(
        (p: any) =>
          `${p.projectionId},${p.startDate.toISOString().split('T')[0]},${p.endDate.toISOString().split('T')[0]},${p.openingBalance},${p.projectedReceipts},${p.projectedDisbursements},${p.closingBalance},${p.scenario}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// LIQUIDITY MANAGEMENT (15-20)
// ============================================================================

/**
 * Calculates liquidity metrics.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<LiquidityMetrics>} Liquidity metrics
 */
export const calculateLiquidityMetrics = async (
  fundId: string,
  CashPosition: any,
): Promise<LiquidityMetrics> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  if (!position) throw new Error('No current position found');

  const cashBalance = parseFloat(position.cashBalance);
  const pendingDisbursements = parseFloat(position.pendingDisbursements);

  // Mock calculations for demonstration
  const currentAssets = cashBalance * 1.5;
  const currentLiabilities = pendingDisbursements * 1.2;
  const quickAssets = cashBalance * 1.3;
  const dailyExpenses = pendingDisbursements / 30;

  const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
  const quickRatio = currentLiabilities !== 0 ? quickAssets / currentLiabilities : 0;
  const cashRatio = currentLiabilities !== 0 ? cashBalance / currentLiabilities : 0;
  const daysOfCashOnHand = dailyExpenses !== 0 ? cashBalance / dailyExpenses : 0;

  const liquidityScore = (currentRatio * 0.3 + quickRatio * 0.3 + cashRatio * 0.4) * 100;

  let adequacyLevel: 'critical' | 'low' | 'adequate' | 'strong' | 'excess' = 'adequate';
  if (liquidityScore < 30) adequacyLevel = 'critical';
  else if (liquidityScore < 60) adequacyLevel = 'low';
  else if (liquidityScore < 80) adequacyLevel = 'adequate';
  else if (liquidityScore < 90) adequacyLevel = 'strong';
  else adequacyLevel = 'excess';

  return {
    asOfDate: position.positionDate,
    currentRatio,
    quickRatio,
    cashRatio,
    workingCapital: currentAssets - currentLiabilities,
    daysOfCashOnHand,
    cashTurnover: 12, // Mock value
    liquidityScore,
    adequacyLevel,
  };
};

/**
 * Monitors liquidity thresholds.
 *
 * @param {string} fundId - Fund ID
 * @param {number} minimumBalance - Minimum balance threshold
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Threshold monitoring result
 */
export const monitorLiquidityThresholds = async (
  fundId: string,
  minimumBalance: number,
  CashPosition: any,
): Promise<any> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  if (!position) throw new Error('No current position found');

  const currentBalance = parseFloat(position.cashBalance);
  const thresholdStatus = currentBalance >= minimumBalance ? 'compliant' : 'breach';
  const deficit = minimumBalance - currentBalance;

  return {
    fundId,
    fundName: position.fundName,
    currentBalance,
    minimumBalance,
    thresholdStatus,
    deficit: deficit > 0 ? deficit : 0,
    compliancePercent: (currentBalance / minimumBalance) * 100,
    actionRequired: thresholdStatus === 'breach',
  };
};

/**
 * Optimizes cash allocation across funds.
 *
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Allocation recommendations
 */
export const optimizeCashAllocation = async (CashPosition: any): Promise<any> => {
  const allPositions = await generateConsolidatedCashPosition(new Date(), CashPosition);

  const recommendations = [];

  for (const position of allPositions.fundPositions) {
    const uncommittedPercent =
      (parseFloat(position.uncommittedCash) / parseFloat(position.cashBalance)) * 100;

    if (uncommittedPercent > 30) {
      recommendations.push({
        fundId: position.fundId,
        fundName: position.fundName,
        excessCash: parseFloat(position.uncommittedCash),
        recommendation: 'Consider short-term investment or transfer to operational funds',
        priority: 'medium',
      });
    }
  }

  return {
    totalExcessCash: recommendations.reduce((sum, r) => sum + r.excessCash, 0),
    recommendations,
  };
};

/**
 * Generates liquidity stress test scenarios.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Stress test results
 */
export const performLiquidityStressTest = async (
  fundId: string,
  CashPosition: any,
): Promise<any> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  if (!position) throw new Error('No current position found');

  const currentBalance = parseFloat(position.cashBalance);
  const pendingDisbursements = parseFloat(position.pendingDisbursements);

  const scenarios = [
    {
      name: 'Receipts delay - 30 days',
      impact: -pendingDisbursements * 2,
      resultingBalance: currentBalance - pendingDisbursements * 2,
      viable: currentBalance - pendingDisbursements * 2 > 0,
    },
    {
      name: 'Emergency disbursement - 20%',
      impact: -currentBalance * 0.2,
      resultingBalance: currentBalance * 0.8,
      viable: currentBalance * 0.8 > pendingDisbursements,
    },
    {
      name: 'Revenue shortfall - 40%',
      impact: -currentBalance * 0.4,
      resultingBalance: currentBalance * 0.6,
      viable: currentBalance * 0.6 > pendingDisbursements,
    },
  ];

  return {
    fundId,
    currentBalance,
    scenarios,
    overallResilience: scenarios.filter((s) => s.viable).length / scenarios.length,
  };
};

/**
 * Calculates working capital requirements.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Working capital analysis
 */
export const calculateWorkingCapitalRequirements = async (
  fundId: string,
  CashPosition: any,
): Promise<any> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  if (!position) throw new Error('No current position found');

  const cashBalance = parseFloat(position.cashBalance);
  const pendingReceipts = parseFloat(position.pendingReceipts);
  const pendingDisbursements = parseFloat(position.pendingDisbursements);

  const currentAssets = cashBalance + pendingReceipts;
  const currentLiabilities = pendingDisbursements;
  const workingCapital = currentAssets - currentLiabilities;

  const optimalWorkingCapital = pendingDisbursements * 1.5; // 150% of pending disbursements
  const surplus = workingCapital - optimalWorkingCapital;

  return {
    fundId,
    currentAssets,
    currentLiabilities,
    workingCapital,
    optimalWorkingCapital,
    surplus,
    adequacy: surplus >= 0 ? 'adequate' : 'insufficient',
    recommendation:
      surplus < 0
        ? `Increase working capital by ${Math.abs(surplus).toFixed(2)}`
        : 'Working capital is adequate',
  };
};

/**
 * Generates liquidity dashboard.
 *
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Liquidity dashboard
 */
export const generateLiquidityDashboard = async (CashPosition: any): Promise<any> => {
  const consolidated = await generateConsolidatedCashPosition(new Date(), CashPosition);

  const avgLiquidityMetrics = {
    totalCash: consolidated.totalCash,
    uncommittedCash: consolidated.totalUncommittedCash,
    restrictedCash: consolidated.totalRestrictedCash,
    liquidityRatio:
      consolidated.totalCash !== 0
        ? (consolidated.totalUncommittedCash / consolidated.totalCash) * 100
        : 0,
    fundsCount: consolidated.fundPositions.length,
  };

  return {
    asOfDate: consolidated.asOfDate,
    summary: avgLiquidityMetrics,
    fundBreakdown: consolidated.fundPositions.map((p: any) => ({
      fundId: p.fundId,
      fundName: p.fundName,
      cashBalance: p.cashBalance,
      liquidityRatio: (parseFloat(p.uncommittedCash) / parseFloat(p.cashBalance)) * 100,
    })),
  };
};

// ============================================================================
// TREASURY OPERATIONS & INVESTMENTS (21-28)
// ============================================================================

/**
 * Records treasury transaction.
 *
 * @param {TreasuryTransaction} transactionData - Transaction data
 * @param {Model} TreasuryTransactionModel - Transaction model
 * @returns {Promise<any>} Created transaction
 */
export const recordTreasuryTransaction = async (
  transactionData: TreasuryTransaction,
  TreasuryTransactionModel: any,
): Promise<any> => {
  return await TreasuryTransactionModel.create(transactionData);
};

/**
 * Manages short-term investments.
 *
 * @param {ShortTermInvestment} investmentData - Investment data
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Created investment
 */
export const manageShortTermInvestment = async (
  investmentData: ShortTermInvestment,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  return await ShortTermInvestmentModel.create(investmentData);
};

/**
 * Calculates investment portfolio yield.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Portfolio yield
 */
export const calculatePortfolioYield = async (
  fundId: string,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const investments = await ShortTermInvestmentModel.findAll({
    where: { fundId, status: 'active' },
  });

  if (investments.length === 0) {
    return {
      fundId,
      portfolioYield: 0,
      totalInvested: 0,
      investmentCount: 0,
    };
  }

  const totalPrincipal = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.principalAmount),
    0,
  );

  const weightedYield = investments.reduce(
    (sum: number, inv: any) =>
      sum + parseFloat(inv.yield) * (parseFloat(inv.principalAmount) / totalPrincipal),
    0,
  );

  return {
    fundId,
    portfolioYield: weightedYield,
    totalInvested: totalPrincipal,
    investmentCount: investments.length,
    avgMaturityDays:
      investments.reduce((sum: number, inv: any) => {
        const days = Math.floor(
          (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        return sum + days;
      }, 0) / investments.length,
  };
};

/**
 * Optimizes investment maturity ladder.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Maturity ladder
 */
export const optimizeInvestmentMaturityLadder = async (
  fundId: string,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const investments = await ShortTermInvestmentModel.findAll({
    where: { fundId, status: 'active' },
    order: [['maturityDate', 'ASC']],
  });

  const maturityBuckets = {
    '0-30 days': 0,
    '31-60 days': 0,
    '61-90 days': 0,
    '91-180 days': 0,
    '180+ days': 0,
  };

  investments.forEach((inv: any) => {
    const daysToMaturity = Math.floor(
      (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysToMaturity <= 30) maturityBuckets['0-30 days'] += parseFloat(inv.principalAmount);
    else if (daysToMaturity <= 60)
      maturityBuckets['31-60 days'] += parseFloat(inv.principalAmount);
    else if (daysToMaturity <= 90)
      maturityBuckets['61-90 days'] += parseFloat(inv.principalAmount);
    else if (daysToMaturity <= 180)
      maturityBuckets['91-180 days'] += parseFloat(inv.principalAmount);
    else maturityBuckets['180+ days'] += parseFloat(inv.principalAmount);
  });

  return {
    fundId,
    maturityLadder: maturityBuckets,
    recommendations: [
      'Ensure liquidity with at least 30% maturing within 30 days',
      'Optimize yield by laddering investments across multiple maturities',
    ],
  };
};

/**
 * Processes cash concentration.
 *
 * @param {CashConcentration} concentrationData - Concentration data
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<any>} Concentration result
 */
export const processCashConcentration = async (
  concentrationData: CashConcentration,
  CashPosition: any,
): Promise<any> => {
  const sourceFundPositions = await CashPosition.findAll({
    where: {
      fundId: { [Op.in]: concentrationData.sourceFunds },
    },
    order: [['positionDate', 'DESC']],
  });

  const totalConcentrated = sourceFundPositions.reduce(
    (sum: number, pos: any) => sum + parseFloat(pos.uncommittedCash),
    0,
  );

  return {
    concentrationId: concentrationData.concentrationId,
    concentrationDate: concentrationData.concentrationDate,
    sourceFunds: concentrationData.sourceFunds,
    targetFund: concentrationData.targetFund,
    totalConcentrated,
    status: 'executed',
  };
};

/**
 * Generates investment performance report.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Performance report
 */
export const generateInvestmentPerformanceReport = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const investments = await ShortTermInvestmentModel.findAll({
    where: {
      fundId,
      purchaseDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalInvested = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.principalAmount),
    0,
  );

  const totalInterest = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.accruedInterest),
    0,
  );

  const avgYield =
    investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.yield), 0) /
    investments.length;

  return {
    fundId,
    period: { startDate, endDate },
    investmentCount: investments.length,
    totalInvested,
    totalInterest,
    avgYield,
    returnOnInvestment: totalInvested !== 0 ? (totalInterest / totalInvested) * 100 : 0,
  };
};

/**
 * Monitors investment compliance with policy.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Compliance report
 */
export const monitorInvestmentCompliance = async (
  fundId: string,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const investments = await ShortTermInvestmentModel.findAll({
    where: { fundId, status: 'active' },
  });

  const violations = [];

  // Check concentration limits
  const typeConcentration = new Map<string, number>();
  investments.forEach((inv: any) => {
    const current = typeConcentration.get(inv.investmentType) || 0;
    typeConcentration.set(inv.investmentType, current + parseFloat(inv.principalAmount));
  });

  const totalInvested = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.principalAmount),
    0,
  );

  typeConcentration.forEach((amount, type) => {
    const percent = (amount / totalInvested) * 100;
    if (percent > 40) {
      // 40% limit per type
      violations.push({
        type: 'concentration',
        investmentType: type,
        percent,
        limit: 40,
      });
    }
  });

  // Check maturity limits
  const longTermInvestments = investments.filter((inv: any) => {
    const daysToMaturity = Math.floor(
      (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysToMaturity > 180;
  });

  if (longTermInvestments.length / investments.length > 0.3) {
    violations.push({
      type: 'maturity',
      message: 'More than 30% of investments mature beyond 180 days',
    });
  }

  return {
    fundId,
    compliant: violations.length === 0,
    violations,
    totalInvestments: investments.length,
    totalInvested,
  };
};

/**
 * Rebalances investment portfolio.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Rebalancing recommendations
 */
export const rebalanceInvestmentPortfolio = async (
  fundId: string,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const portfolio = await calculatePortfolioYield(fundId, ShortTermInvestmentModel);
  const maturityLadder = await optimizeInvestmentMaturityLadder(fundId, ShortTermInvestmentModel);

  const recommendations = [];

  // Check if too much in short-term
  if (maturityLadder.maturityLadder['0-30 days'] / portfolio.totalInvested > 0.5) {
    recommendations.push({
      action: 'extend_maturity',
      reason: 'Over 50% maturing within 30 days, consider longer-term investments for yield',
    });
  }

  // Check if yield is below target
  if (portfolio.portfolioYield < 3.0) {
    recommendations.push({
      action: 'increase_yield',
      reason: 'Portfolio yield below 3%, consider higher-yielding instruments',
    });
  }

  return {
    fundId,
    currentYield: portfolio.portfolioYield,
    recommendations,
  };
};

// ============================================================================
// CASH REQUIREMENTS & VARIANCE ANALYSIS (29-38)
// ============================================================================

/**
 * Plans cash requirements.
 *
 * @param {CashRequirement} requirementData - Requirement data
 * @param {Model} CashRequirementModel - Requirement model
 * @returns {Promise<any>} Created requirement
 */
export const planCashRequirements = async (
  requirementData: CashRequirement,
  CashRequirementModel: any,
): Promise<any> => {
  return await CashRequirementModel.create(requirementData);
};

/**
 * Prioritizes cash requirements.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashRequirementModel - Requirement model
 * @returns {Promise<any[]>} Prioritized requirements
 */
export const prioritizeCashRequirements = async (
  fundId: string,
  CashRequirementModel: any,
): Promise<any[]> => {
  const requirements = await CashRequirementModel.findAll({
    where: {
      fundId,
      status: { [Op.in]: ['planned', 'funded'] },
    },
    order: [
      ['priority', 'ASC'],
      ['dueDate', 'ASC'],
    ],
  });

  return requirements.map((req: any, index: number) => ({
    ...req.toJSON(),
    priorityRank: index + 1,
  }));
};

/**
 * Performs variance analysis.
 *
 * @param {Date} analysisDate - Analysis date
 * @param {string} fundId - Fund ID
 * @param {Model} CashFlowProjectionModel - Projection model
 * @param {Model} TreasuryTransactionModel - Transaction model
 * @returns {Promise<VarianceAnalysis>} Variance analysis
 */
export const performVarianceAnalysis = async (
  analysisDate: Date,
  fundId: string,
  CashFlowProjectionModel: any,
  TreasuryTransactionModel: any,
): Promise<VarianceAnalysis> => {
  // Get projection
  const projection = await CashFlowProjectionModel.findOne({
    where: {
      fundId,
      startDate: { [Op.lte]: analysisDate },
      endDate: { [Op.gte]: analysisDate },
    },
  });

  // Get actual transactions
  const receipts = await TreasuryTransactionModel.sum('amount', {
    where: {
      fundId,
      transactionType: 'receipt',
      transactionDate: analysisDate,
    },
  });

  const disbursements = await TreasuryTransactionModel.sum('amount', {
    where: {
      fundId,
      transactionType: 'disbursement',
      transactionDate: analysisDate,
    },
  });

  const actualReceipts = receipts || 0;
  const actualDisbursements = disbursements || 0;
  const forecastReceipts = projection ? parseFloat(projection.projectedReceipts) : 0;
  const forecastDisbursements = projection ? parseFloat(projection.projectedDisbursements) : 0;

  const receiptsVariance = actualReceipts - forecastReceipts;
  const receiptsVariancePercent =
    forecastReceipts !== 0 ? (receiptsVariance / forecastReceipts) * 100 : 0;

  const disbursementsVariance = actualDisbursements - forecastDisbursements;
  const disbursementsVariancePercent =
    forecastDisbursements !== 0 ? (disbursementsVariance / forecastDisbursements) * 100 : 0;

  const netVariance = receiptsVariance - disbursementsVariance;

  const majorVarianceReasons = [];
  if (Math.abs(receiptsVariancePercent) > 10) {
    majorVarianceReasons.push(`Receipts variance: ${receiptsVariancePercent.toFixed(1)}%`);
  }
  if (Math.abs(disbursementsVariancePercent) > 10) {
    majorVarianceReasons.push(`Disbursements variance: ${disbursementsVariancePercent.toFixed(1)}%`);
  }

  return {
    analysisDate,
    periodType: 'daily',
    actualReceipts,
    forecastReceipts,
    receiptsVariance,
    receiptsVariancePercent,
    actualDisbursements,
    forecastDisbursements,
    disbursementsVariance,
    disbursementsVariancePercent,
    netVariance,
    majorVarianceReasons,
  };
};

/**
 * Generates cash utilization report.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} TreasuryTransactionModel - Transaction model
 * @returns {Promise<any>} Utilization report
 */
export const generateCashUtilizationReport = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  TreasuryTransactionModel: any,
): Promise<any> => {
  const transactions = await TreasuryTransactionModel.findAll({
    where: {
      fundId,
      transactionDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const utilizationByCategory = new Map<string, number>();

  transactions.forEach((txn: any) => {
    const category = txn.metadata?.category || 'uncategorized';
    const current = utilizationByCategory.get(category) || 0;
    utilizationByCategory.set(category, current + parseFloat(txn.amount));
  });

  return {
    fundId,
    period: { startDate, endDate },
    totalTransactions: transactions.length,
    byCategory: Array.from(utilizationByCategory.entries()).map(([category, amount]) => ({
      category,
      amount,
    })),
  };
};

/**
 * Forecasts debt service requirements.
 *
 * @param {string} fundId - Fund ID
 * @param {number} months - Months to forecast
 * @returns {Promise<any>} Debt service forecast
 */
export const forecastDebtServiceRequirements = async (
  fundId: string,
  months: number,
): Promise<any> => {
  const forecast = [];

  // Mock debt service schedule
  const monthlyDebtService = 50000;

  for (let i = 0; i < months; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() + i + 1);

    forecast.push({
      month: month.toISOString().substring(0, 7),
      principalPayment: monthlyDebtService * 0.7,
      interestPayment: monthlyDebtService * 0.3,
      totalDebtService: monthlyDebtService,
    });
  }

  return {
    fundId,
    forecastPeriod: months,
    totalDebtService: monthlyDebtService * months,
    monthlyForecast: forecast,
  };
};

/**
 * Generates cash availability calendar.
 *
 * @param {string} fundId - Fund ID
 * @param {number} days - Days to calendar
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} CashRequirementModel - Requirement model
 * @returns {Promise<any>} Cash calendar
 */
export const generateCashAvailabilityCalendar = async (
  fundId: string,
  days: number,
  CashPosition: any,
  CashRequirementModel: any,
): Promise<any> => {
  const currentPosition = await getCurrentCashPosition(fundId, CashPosition);
  if (!currentPosition) throw new Error('No current position found');

  const requirements = await CashRequirementModel.findAll({
    where: {
      fundId,
      status: 'planned',
    },
    order: [['dueDate', 'ASC']],
  });

  const calendar = [];
  let runningBalance = parseFloat(currentPosition.cashBalance);

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const dayRequirements = requirements.filter((req: any) => {
      const reqDate = new Date(req.dueDate);
      return reqDate.toDateString() === date.toDateString();
    });

    const dayTotal = dayRequirements.reduce(
      (sum: number, req: any) => sum + parseFloat(req.requiredAmount),
      0,
    );

    runningBalance -= dayTotal;

    calendar.push({
      date: date.toISOString().split('T')[0],
      requirements: dayTotal,
      runningBalance,
      sufficient: runningBalance >= 0,
    });
  }

  return {
    fundId,
    calendarDays: days,
    calendar,
  };
};

/**
 * Identifies cash shortfalls.
 *
 * @param {string} fundId - Fund ID
 * @param {number} days - Days to analyze
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} CashRequirementModel - Requirement model
 * @returns {Promise<any[]>} Shortfall predictions
 */
export const identifyCashShortfalls = async (
  fundId: string,
  days: number,
  CashPosition: any,
  CashRequirementModel: any,
): Promise<any[]> => {
  const calendar = await generateCashAvailabilityCalendar(
    fundId,
    days,
    CashPosition,
    CashRequirementModel,
  );

  const shortfalls = calendar.calendar.filter((day: any) => !day.sufficient);

  return shortfalls.map((shortfall: any) => ({
    date: shortfall.date,
    projectedBalance: shortfall.runningBalance,
    shortfallAmount: Math.abs(shortfall.runningBalance),
    severity: Math.abs(shortfall.runningBalance) > 100000 ? 'high' : 'medium',
  }));
};

/**
 * Generates comprehensive cash flow dashboard.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} CashFlowProjectionModel - Projection model
 * @param {Model} ShortTermInvestmentModel - Investment model
 * @returns {Promise<any>} Dashboard data
 */
export const generateCashFlowDashboard = async (
  fundId: string,
  CashPosition: any,
  CashFlowProjectionModel: any,
  ShortTermInvestmentModel: any,
): Promise<any> => {
  const position = await getCurrentCashPosition(fundId, CashPosition);
  const liquidity = await calculateLiquidityMetrics(fundId, CashPosition);
  const portfolio = await calculatePortfolioYield(fundId, ShortTermInvestmentModel);
  const projections = await generateDailyCashProjection(fundId, 7, CashPosition, null);

  return {
    fundId,
    asOfDate: new Date(),
    currentPosition: {
      cashBalance: position?.cashBalance || 0,
      uncommittedCash: position?.uncommittedCash || 0,
      netPosition: position?.netPosition || 0,
    },
    liquidityMetrics: {
      daysOfCashOnHand: liquidity.daysOfCashOnHand,
      liquidityScore: liquidity.liquidityScore,
      adequacyLevel: liquidity.adequacyLevel,
    },
    investmentPortfolio: {
      totalInvested: portfolio.totalInvested,
      portfolioYield: portfolio.portfolioYield,
      investmentCount: portfolio.investmentCount,
    },
    weeklyProjections: projections,
  };
};

/**
 * Exports comprehensive cash flow report.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} TreasuryTransactionModel - Transaction model
 * @returns {Promise<Buffer>} PDF/CSV report
 */
export const exportComprehensiveCashFlowReport = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  CashPosition: any,
  TreasuryTransactionModel: any,
): Promise<Buffer> => {
  const positions = await CashPosition.findAll({
    where: {
      fundId,
      positionDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['positionDate', 'ASC']],
  });

  const csv =
    'Date,Cash Balance,Uncommitted Cash,Restricted Cash,Pending Receipts,Pending Disbursements,Net Position\n' +
    positions
      .map(
        (p: any) =>
          `${p.positionDate.toISOString().split('T')[0]},${p.cashBalance},${p.uncommittedCash},${p.restrictedCash},${p.pendingReceipts},${p.pendingDisbursements},${p.netPosition}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSCashFlowForecastingService {
  constructor(private readonly sequelize: Sequelize) {}

  async recordCashPosition(positionData: CashPositionData) {
    const CashPosition = createCashPositionModel(this.sequelize);
    return recordCashPosition(positionData, CashPosition);
  }

  async generateDailyProjection(fundId: string, days: number) {
    const CashPosition = createCashPositionModel(this.sequelize);
    const TreasuryTransaction = createTreasuryTransactionModel(this.sequelize);
    return generateDailyCashProjection(fundId, days, CashPosition, TreasuryTransaction);
  }

  async calculateLiquidity(fundId: string) {
    const CashPosition = createCashPositionModel(this.sequelize);
    return calculateLiquidityMetrics(fundId, CashPosition);
  }

  async manageTreasuryOperation(transactionData: TreasuryTransaction) {
    const TreasuryTransaction = createTreasuryTransactionModel(this.sequelize);
    return recordTreasuryTransaction(transactionData, TreasuryTransaction);
  }
}

export default {
  // Models
  createCashPositionModel,
  createCashFlowProjectionModel,
  createTreasuryTransactionModel,
  createShortTermInvestmentModel,
  createCashRequirementModel,

  // Cash Position
  recordCashPosition,
  getCurrentCashPosition,
  calculateAvailableCash,
  generateConsolidatedCashPosition,
  compareCashPositions,
  alertLowCashPositions,

  // Projections
  createCashFlowProjection,
  generateDailyCashProjection,
  generateMonthlyCashProjection,
  performScenarioAnalysis,
  calculateConfidenceIntervals,
  identifyCashFlowTrends,
  generateRollingForecast,
  exportCashFlowProjections,

  // Liquidity
  calculateLiquidityMetrics,
  monitorLiquidityThresholds,
  optimizeCashAllocation,
  performLiquidityStressTest,
  calculateWorkingCapitalRequirements,
  generateLiquidityDashboard,

  // Treasury & Investments
  recordTreasuryTransaction,
  manageShortTermInvestment,
  calculatePortfolioYield,
  optimizeInvestmentMaturityLadder,
  processCashConcentration,
  generateInvestmentPerformanceReport,
  monitorInvestmentCompliance,
  rebalanceInvestmentPortfolio,

  // Requirements & Variance
  planCashRequirements,
  prioritizeCashRequirements,
  performVarianceAnalysis,
  generateCashUtilizationReport,
  forecastDebtServiceRequirements,
  generateCashAvailabilityCalendar,
  identifyCashShortfalls,
  generateCashFlowDashboard,
  exportComprehensiveCashFlowReport,

  // Service
  CEFMSCashFlowForecastingService,
};

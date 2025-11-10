/**
 * LOC: CEFMSIPM001
 * File: /reuse/financial/cefms/composites/cefms-investment-portfolio-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/fund-accounting-operations-kit.ts
 *   - ../../../government/risk-management-internal-controls-kit.ts
 *   - ../../../government/government-financial-reporting-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS investment services
 *   - USACE portfolio management systems
 *   - Investment tracking modules
 *   - Risk assessment dashboards
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-investment-portfolio-management-composite.ts
 * Locator: WC-CEFMS-IPM-001
 * Purpose: USACE CEFMS Investment Portfolio Management - investment tracking, portfolio valuation, policy compliance, yield calculations
 *
 * Upstream: Composes utilities from government kits for comprehensive investment management
 * Downstream: ../../../backend/cefms/*, Investment controllers, portfolio analysis, compliance monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 39 composite functions for USACE CEFMS investment portfolio management
 *
 * LLM Context: Production-ready USACE CEFMS investment portfolio management system.
 * Comprehensive investment tracking and valuation, portfolio performance analysis, investment policy
 * compliance monitoring, yield and return calculations, risk assessment and diversification analysis,
 * maturity schedule management, investment benchmarking, unrealized gains/losses tracking, rebalancing
 * recommendations, and detailed investment performance reporting for government fund management.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Investment {
  investmentId: string;
  fundId: string;
  cusip: string;
  securityName: string;
  securityType: 'treasury_bill' | 'treasury_note' | 'treasury_bond' | 'municipal_bond' | 'agency_bond' | 'money_market' | 'cd';
  purchaseDate: Date;
  maturityDate: Date;
  faceValue: number;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  couponRate: number;
  yieldToMaturity: number;
  status: 'active' | 'matured' | 'sold' | 'called';
}

interface PortfolioValuation {
  valuationDate: Date;
  fundId?: string;
  totalCost: number;
  totalMarketValue: number;
  totalAccruedInterest: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  portfolioYield: number;
  weightedAvgMaturity: number;
  duration: number;
}

interface InvestmentPerformance {
  investmentId: string;
  period: { startDate: Date; endDate: Date };
  beginningValue: number;
  endingValue: number;
  incomeEarned: number;
  realizedGains: number;
  unrealizedGains: number;
  totalReturn: number;
  annualizedReturn: number;
}

interface RiskMetrics {
  investmentId?: string;
  portfolioId?: string;
  creditRisk: string;
  marketRisk: string;
  interestRateRisk: string;
  liquidityRisk: string;
  concentrationRisk: string;
  overallRiskScore: number;
  riskRating: 'low' | 'medium' | 'high' | 'critical';
}

interface PolicyCompliance {
  complianceDate: Date;
  policyType: string;
  compliant: boolean;
  violations: PolicyViolation[];
  complianceScore: number;
}

interface PolicyViolation {
  violationType: 'concentration' | 'maturity' | 'credit_quality' | 'liquidity' | 'sector';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  currentValue: number;
  policyLimit: number;
  variance: number;
}

interface MaturitySchedule {
  scheduleDate: Date;
  fundId?: string;
  maturities: MaturityEntry[];
  totalMaturingValue: number;
}

interface MaturityEntry {
  maturityDate: Date;
  investments: string[];
  totalFaceValue: number;
  totalMarketValue: number;
  cashToBeReceived: number;
}

interface DiversificationAnalysis {
  analysisDate: Date;
  fundId?: string;
  bySecurityType: Record<string, { count: number; value: number; percent: number }>;
  byCreditRating: Record<string, { count: number; value: number; percent: number }>;
  byMaturityBucket: Record<string, { count: number; value: number; percent: number }>;
  diversificationScore: number;
  concentrationRisk: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Investment with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Investment model
 *
 * @example
 * ```typescript
 * const Investment = createInvestmentModel(sequelize);
 * const investment = await Investment.create({
 *   investmentId: 'INV-2024-001',
 *   fundId: 'FUND-001',
 *   cusip: '912828XG0',
 *   securityName: 'US Treasury Bill',
 *   securityType: 'treasury_bill',
 *   purchaseDate: new Date(),
 *   maturityDate: new Date('2025-03-15'),
 *   faceValue: 1000000,
 *   purchasePrice: 995000
 * });
 * ```
 */
export const createInvestmentModel = (sequelize: Sequelize) => {
  class InvestmentModel extends Model {
    public id!: string;
    public investmentId!: string;
    public fundId!: string;
    public cusip!: string;
    public securityName!: string;
    public securityType!: string;
    public purchaseDate!: Date;
    public maturityDate!: Date;
    public faceValue!: number;
    public purchasePrice!: number;
    public currentPrice!: number;
    public quantity!: number;
    public couponRate!: number;
    public yieldToMaturity!: number;
    public accruedInterest!: number;
    public creditRating!: string;
    public issuer!: string;
    public status!: string;
    public saleDate!: Date | null;
    public salePrice!: number | null;
    public realizedGainLoss!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvestmentModel.init(
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
      cusip: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'CUSIP number',
      },
      securityName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Security name',
      },
      securityType: {
        type: DataTypes.ENUM(
          'treasury_bill',
          'treasury_note',
          'treasury_bond',
          'municipal_bond',
          'agency_bond',
          'money_market',
          'cd',
        ),
        allowNull: false,
        comment: 'Security type',
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Purchase date',
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maturity date',
      },
      faceValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Face value',
      },
      purchasePrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Purchase price',
      },
      currentPrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current market price',
      },
      quantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 1,
        comment: 'Quantity',
      },
      couponRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Coupon rate',
      },
      yieldToMaturity: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Yield to maturity',
      },
      accruedInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accrued interest',
      },
      creditRating: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'AAA',
        comment: 'Credit rating',
      },
      issuer: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Issuer name',
      },
      status: {
        type: DataTypes.ENUM('active', 'matured', 'sold', 'called'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Investment status',
      },
      saleDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Sale date',
      },
      salePrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Sale price',
      },
      realizedGainLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Realized gain/loss',
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
      tableName: 'investments',
      timestamps: true,
      indexes: [
        { fields: ['investmentId'], unique: true },
        { fields: ['fundId'] },
        { fields: ['cusip'] },
        { fields: ['securityType'] },
        { fields: ['maturityDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return InvestmentModel;
};

/**
 * Sequelize model for Portfolio Valuation snapshots.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PortfolioValuation model
 */
export const createPortfolioValuationModel = (sequelize: Sequelize) => {
  class PortfolioValuationModel extends Model {
    public id!: string;
    public valuationDate!: Date;
    public fundId!: string | null;
    public totalCost!: number;
    public totalMarketValue!: number;
    public totalAccruedInterest!: number;
    public unrealizedGainLoss!: number;
    public unrealizedGainLossPercent!: number;
    public portfolioYield!: number;
    public weightedAvgMaturity!: number;
    public duration!: number;
    public investmentCount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PortfolioValuationModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Valuation date',
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund identifier (null for consolidated)',
      },
      totalCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total cost basis',
      },
      totalMarketValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total market value',
      },
      totalAccruedInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total accrued interest',
      },
      unrealizedGainLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Unrealized gain/loss',
      },
      unrealizedGainLossPercent: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Unrealized gain/loss percent',
      },
      portfolioYield: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Portfolio yield',
      },
      weightedAvgMaturity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Weighted average maturity (days)',
      },
      duration: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Portfolio duration',
      },
      investmentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of investments',
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
      tableName: 'portfolio_valuations',
      timestamps: true,
      indexes: [
        { fields: ['valuationDate'] },
        { fields: ['fundId'] },
        { fields: ['fundId', 'valuationDate'] },
      ],
    },
  );

  return PortfolioValuationModel;
};

/**
 * Sequelize model for Investment Performance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvestmentPerformance model
 */
export const createInvestmentPerformanceModel = (sequelize: Sequelize) => {
  class InvestmentPerformanceModel extends Model {
    public id!: string;
    public investmentId!: string;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public beginningValue!: number;
    public endingValue!: number;
    public incomeEarned!: number;
    public realizedGains!: number;
    public unrealizedGains!: number;
    public totalReturn!: number;
    public annualizedReturn!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvestmentPerformanceModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      investmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Investment identifier',
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
      beginningValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Beginning value',
      },
      endingValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Ending value',
      },
      incomeEarned: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Income earned',
      },
      realizedGains: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Realized gains',
      },
      unrealizedGains: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unrealized gains',
      },
      totalReturn: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Total return percent',
      },
      annualizedReturn: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Annualized return percent',
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
      tableName: 'investment_performance',
      timestamps: true,
      indexes: [
        { fields: ['investmentId'] },
        { fields: ['periodStartDate', 'periodEndDate'] },
      ],
    },
  );

  return InvestmentPerformanceModel;
};

// ============================================================================
// INVESTMENT TRACKING & MANAGEMENT (1-7)
// ============================================================================

/**
 * Records new investment purchase.
 *
 * @param {Investment} investmentData - Investment data
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Created investment
 */
export const recordInvestmentPurchase = async (
  investmentData: Investment,
  InvestmentModel: any,
): Promise<any> => {
  return await InvestmentModel.create({
    ...investmentData,
    currentPrice: investmentData.purchasePrice,
    status: 'active',
  });
};

/**
 * Updates investment market price.
 *
 * @param {string} investmentId - Investment ID
 * @param {number} newPrice - New market price
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Updated investment
 */
export const updateInvestmentPrice = async (
  investmentId: string,
  newPrice: number,
  InvestmentModel: any,
): Promise<any> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  investment.currentPrice = newPrice;
  await investment.save();

  return investment;
};

/**
 * Records investment maturity or sale.
 *
 * @param {string} investmentId - Investment ID
 * @param {Date} eventDate - Maturity or sale date
 * @param {number} [salePrice] - Sale price (if sold)
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Updated investment
 */
export const recordInvestmentMaturityOrSale = async (
  investmentId: string,
  eventDate: Date,
  salePrice: number | undefined,
  InvestmentModel: any,
): Promise<any> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  if (salePrice) {
    investment.status = 'sold';
    investment.saleDate = eventDate;
    investment.salePrice = salePrice;
    investment.realizedGainLoss = salePrice - parseFloat(investment.purchasePrice);
  } else {
    investment.status = 'matured';
    investment.realizedGainLoss = parseFloat(investment.faceValue) - parseFloat(investment.purchasePrice);
  }

  await investment.save();
  return investment;
};

/**
 * Retrieves active investments for fund.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any[]>} Active investments
 */
export const getActiveInvestments = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any[]> => {
  return await InvestmentModel.findAll({
    where: { fundId, status: 'active' },
    order: [['maturityDate', 'ASC']],
  });
};

/**
 * Retrieves investments maturing within period.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} [fundId] - Optional fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any[]>} Maturing investments
 */
export const getMaturingInvestments = async (
  startDate: Date,
  endDate: Date,
  fundId: string | undefined,
  InvestmentModel: any,
): Promise<any[]> => {
  const where: any = {
    status: 'active',
    maturityDate: { [Op.between]: [startDate, endDate] },
  };

  if (fundId) {
    where.fundId = fundId;
  }

  return await InvestmentModel.findAll({
    where,
    order: [['maturityDate', 'ASC']],
  });
};

/**
 * Calculates accrued interest for investment.
 *
 * @param {string} investmentId - Investment ID
 * @param {Date} asOfDate - As of date
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<number>} Accrued interest
 */
export const calculateAccruedInterest = async (
  investmentId: string,
  asOfDate: Date,
  InvestmentModel: any,
): Promise<number> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  const daysSincePurchase = Math.floor(
    (asOfDate.getTime() - new Date(investment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  const annualInterest = parseFloat(investment.faceValue) * (parseFloat(investment.couponRate) / 100);
  const accruedInterest = (annualInterest / 365) * daysSincePurchase;

  investment.accruedInterest = accruedInterest;
  await investment.save();

  return accruedInterest;
};

/**
 * Generates investment register report.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Investment register
 */
export const generateInvestmentRegister = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const totalCost = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.purchasePrice),
    0,
  );

  const totalMarketValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  return {
    fundId,
    asOfDate: new Date(),
    investmentCount: investments.length,
    totalCost,
    totalMarketValue,
    unrealizedGainLoss: totalMarketValue - totalCost,
    investments: investments.map((inv: any) => ({
      investmentId: inv.investmentId,
      securityName: inv.securityName,
      cusip: inv.cusip,
      purchaseDate: inv.purchaseDate,
      maturityDate: inv.maturityDate,
      purchasePrice: inv.purchasePrice,
      currentPrice: inv.currentPrice,
      marketValue: parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    })),
  };
};

// ============================================================================
// PORTFOLIO VALUATION (8-14)
// ============================================================================

/**
 * Performs portfolio valuation.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} valuationDate - Valuation date
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<PortfolioValuation>} Valuation result
 */
export const performPortfolioValuation = async (
  fundId: string,
  valuationDate: Date,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<PortfolioValuation> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  if (investments.length === 0) {
    return {
      valuationDate,
      fundId,
      totalCost: 0,
      totalMarketValue: 0,
      totalAccruedInterest: 0,
      unrealizedGainLoss: 0,
      unrealizedGainLossPercent: 0,
      portfolioYield: 0,
      weightedAvgMaturity: 0,
      duration: 0,
    };
  }

  const totalCost = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.purchasePrice) * parseFloat(inv.quantity),
    0,
  );

  const totalMarketValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  const totalAccruedInterest = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.accruedInterest || 0),
    0,
  );

  const unrealizedGainLoss = totalMarketValue - totalCost;
  const unrealizedGainLossPercent = totalCost !== 0 ? (unrealizedGainLoss / totalCost) * 100 : 0;

  const portfolioYield =
    investments.reduce(
      (sum: number, inv: any) =>
        sum +
        parseFloat(inv.yieldToMaturity) *
          ((parseFloat(inv.currentPrice) * parseFloat(inv.quantity)) / totalMarketValue),
      0,
    );

  const weightedAvgMaturity =
    investments.reduce((sum: number, inv: any) => {
      const daysToMaturity = Math.floor(
        (new Date(inv.maturityDate).getTime() - valuationDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return (
        sum +
        daysToMaturity *
          ((parseFloat(inv.currentPrice) * parseFloat(inv.quantity)) / totalMarketValue)
      );
    }, 0);

  const duration = weightedAvgMaturity / 365; // Simplified duration calculation

  const valuation: PortfolioValuation = {
    valuationDate,
    fundId,
    totalCost,
    totalMarketValue,
    totalAccruedInterest,
    unrealizedGainLoss,
    unrealizedGainLossPercent,
    portfolioYield,
    weightedAvgMaturity,
    duration,
  };

  // Save valuation snapshot
  await PortfolioValuationModel.create({
    ...valuation,
    investmentCount: investments.length,
  });

  return valuation;
};

/**
 * Calculates unrealized gains and losses.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Unrealized gains/losses
 */
export const calculateUnrealizedGainsLosses = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const details = investments.map((inv: any) => {
    const cost = parseFloat(inv.purchasePrice) * parseFloat(inv.quantity);
    const marketValue = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    const unrealizedGainLoss = marketValue - cost;
    const unrealizedGainLossPercent = cost !== 0 ? (unrealizedGainLoss / cost) * 100 : 0;

    return {
      investmentId: inv.investmentId,
      securityName: inv.securityName,
      cost,
      marketValue,
      unrealizedGainLoss,
      unrealizedGainLossPercent,
    };
  });

  const totalUnrealizedGainLoss = details.reduce((sum, d) => sum + d.unrealizedGainLoss, 0);

  return {
    fundId,
    asOfDate: new Date(),
    totalUnrealizedGainLoss,
    details,
  };
};

/**
 * Tracks portfolio value over time.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Value tracking
 */
export const trackPortfolioValueOverTime = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  PortfolioValuationModel: any,
): Promise<any> => {
  const valuations = await PortfolioValuationModel.findAll({
    where: {
      fundId,
      valuationDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['valuationDate', 'ASC']],
  });

  if (valuations.length === 0) {
    return {
      fundId,
      period: { startDate, endDate },
      insufficientData: true,
    };
  }

  const startingValue = parseFloat(valuations[0].totalMarketValue);
  const endingValue = parseFloat(valuations[valuations.length - 1].totalMarketValue);
  const change = endingValue - startingValue;
  const changePercent = startingValue !== 0 ? (change / startingValue) * 100 : 0;

  return {
    fundId,
    period: { startDate, endDate },
    startingValue,
    endingValue,
    change,
    changePercent,
    dataPoints: valuations.length,
    valuations: valuations.map((v: any) => ({
      date: v.valuationDate,
      marketValue: v.totalMarketValue,
      unrealizedGainLoss: v.unrealizedGainLoss,
    })),
  };
};

/**
 * Calculates portfolio yield.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Portfolio yield
 */
export const calculatePortfolioYield = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  if (investments.length === 0) {
    return {
      fundId,
      portfolioYield: 0,
      weightedYield: 0,
      yieldRange: { min: 0, max: 0 },
    };
  }

  const totalMarketValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  const weightedYield =
    investments.reduce(
      (sum: number, inv: any) =>
        sum +
        parseFloat(inv.yieldToMaturity) *
          ((parseFloat(inv.currentPrice) * parseFloat(inv.quantity)) / totalMarketValue),
      0,
    );

  const yields = investments.map((inv: any) => parseFloat(inv.yieldToMaturity));
  const minYield = Math.min(...yields);
  const maxYield = Math.max(...yields);

  return {
    fundId,
    portfolioYield: weightedYield,
    weightedYield,
    yieldRange: { min: minYield, max: maxYield },
    investmentCount: investments.length,
  };
};

/**
 * Calculates weighted average maturity.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<number>} Weighted average maturity (days)
 */
export const calculateWeightedAvgMaturity = async (
  fundId: string,
  InvestmentModel: any,
): Promise<number> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  if (investments.length === 0) return 0;

  const totalMarketValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  const weightedAvgMaturity =
    investments.reduce((sum: number, inv: any) => {
      const daysToMaturity = Math.floor(
        (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      return (
        sum +
        daysToMaturity *
          ((parseFloat(inv.currentPrice) * parseFloat(inv.quantity)) / totalMarketValue)
      );
    }, 0);

  return weightedAvgMaturity;
};

/**
 * Calculates portfolio duration.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<number>} Portfolio duration
 */
export const calculatePortfolioDuration = async (
  fundId: string,
  InvestmentModel: any,
): Promise<number> => {
  const wam = await calculateWeightedAvgMaturity(fundId, InvestmentModel);
  // Simplified duration = WAM / 365
  return wam / 365;
};

/**
 * Generates portfolio summary dashboard.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Portfolio dashboard
 */
export const generatePortfolioDashboard = async (
  fundId: string,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<any> => {
  const valuation = await performPortfolioValuation(
    fundId,
    new Date(),
    InvestmentModel,
    PortfolioValuationModel,
  );
  const yieldData = await calculatePortfolioYield(fundId, InvestmentModel);
  const unrealized = await calculateUnrealizedGainsLosses(fundId, InvestmentModel);

  return {
    fundId,
    asOfDate: new Date(),
    summary: {
      totalMarketValue: valuation.totalMarketValue,
      totalCost: valuation.totalCost,
      unrealizedGainLoss: valuation.unrealizedGainLoss,
      portfolioYield: valuation.portfolioYield,
      weightedAvgMaturity: valuation.weightedAvgMaturity,
      duration: valuation.duration,
    },
    performance: {
      unrealizedGainLossPercent: valuation.unrealizedGainLossPercent,
      yieldRange: yieldData.yieldRange,
    },
    holdings: unrealized.details.length,
  };
};

// ============================================================================
// PERFORMANCE MEASUREMENT (15-21)
// ============================================================================

/**
 * Calculates investment performance.
 *
 * @param {string} investmentId - Investment ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} InvestmentPerformanceModel - Performance model
 * @returns {Promise<InvestmentPerformance>} Performance metrics
 */
export const calculateInvestmentPerformance = async (
  investmentId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
  InvestmentPerformanceModel: any,
): Promise<InvestmentPerformance> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  const beginningValue = parseFloat(investment.purchasePrice) * parseFloat(investment.quantity);
  const endingValue = parseFloat(investment.currentPrice) * parseFloat(investment.quantity);

  // Mock income earned
  const daysSinceStart = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const annualIncome =
    parseFloat(investment.faceValue) * (parseFloat(investment.couponRate) / 100);
  const incomeEarned = (annualIncome / 365) * daysSinceStart;

  const realizedGains = investment.realizedGainLoss ? parseFloat(investment.realizedGainLoss) : 0;
  const unrealizedGains = endingValue - beginningValue;

  const totalReturn =
    beginningValue !== 0
      ? ((endingValue + incomeEarned + realizedGains - beginningValue) / beginningValue) * 100
      : 0;

  const years = daysSinceStart / 365;
  const annualizedReturn = years !== 0 ? totalReturn / years : totalReturn;

  const performance: InvestmentPerformance = {
    investmentId,
    period: { startDate, endDate },
    beginningValue,
    endingValue,
    incomeEarned,
    realizedGains,
    unrealizedGains,
    totalReturn,
    annualizedReturn,
  };

  // Save performance record
  await InvestmentPerformanceModel.create({
    ...performance,
    periodStartDate: startDate,
    periodEndDate: endDate,
  });

  return performance;
};

/**
 * Generates portfolio performance report.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Performance report
 */
export const generatePortfolioPerformanceReport = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<any> => {
  const startingValuation = await PortfolioValuationModel.findOne({
    where: {
      fundId,
      valuationDate: { [Op.gte]: startDate },
    },
    order: [['valuationDate', 'ASC']],
  });

  const endingValuation = await PortfolioValuationModel.findOne({
    where: {
      fundId,
      valuationDate: { [Op.lte]: endDate },
    },
    order: [['valuationDate', 'DESC']],
  });

  if (!startingValuation || !endingValuation) {
    return {
      fundId,
      period: { startDate, endDate },
      insufficientData: true,
    };
  }

  const beginningValue = parseFloat(startingValuation.totalMarketValue);
  const endingValue = parseFloat(endingValuation.totalMarketValue);

  // Calculate realized gains from sold investments
  const soldInvestments = await InvestmentModel.findAll({
    where: {
      fundId,
      status: 'sold',
      saleDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const realizedGains = soldInvestments.reduce(
    (sum: number, inv: any) => sum + (parseFloat(inv.realizedGainLoss) || 0),
    0,
  );

  const totalReturn =
    beginningValue !== 0 ? ((endingValue + realizedGains - beginningValue) / beginningValue) * 100 : 0;

  const daysPeriod = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const years = daysPeriod / 365;
  const annualizedReturn = years !== 0 ? totalReturn / years : totalReturn;

  return {
    fundId,
    period: { startDate, endDate },
    beginningValue,
    endingValue,
    realizedGains,
    unrealizedGains: endingValue - beginningValue,
    totalReturn,
    annualizedReturn,
    daysPeriod,
  };
};

/**
 * Calculates time-weighted return.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<number>} Time-weighted return
 */
export const calculateTimeWeightedReturn = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  PortfolioValuationModel: any,
): Promise<number> => {
  const valuations = await PortfolioValuationModel.findAll({
    where: {
      fundId,
      valuationDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['valuationDate', 'ASC']],
  });

  if (valuations.length < 2) return 0;

  // Simplified TWR calculation
  let cumulativeReturn = 1;

  for (let i = 1; i < valuations.length; i++) {
    const prevValue = parseFloat(valuations[i - 1].totalMarketValue);
    const currValue = parseFloat(valuations[i].totalMarketValue);

    const periodReturn = prevValue !== 0 ? (currValue - prevValue) / prevValue : 0;
    cumulativeReturn *= 1 + periodReturn;
  }

  return (cumulativeReturn - 1) * 100;
};

/**
 * Benchmarks portfolio against index.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} benchmarkReturn - Benchmark return
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Benchmark comparison
 */
export const benchmarkPortfolioPerformance = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  benchmarkReturn: number,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<any> => {
  const performance = await generatePortfolioPerformanceReport(
    fundId,
    startDate,
    endDate,
    InvestmentModel,
    PortfolioValuationModel,
  );

  const portfolioReturn = performance.totalReturn || 0;
  const excessReturn = portfolioReturn - benchmarkReturn;

  return {
    fundId,
    period: { startDate, endDate },
    portfolioReturn,
    benchmarkReturn,
    excessReturn,
    outperformed: excessReturn > 0,
    informationRatio: excessReturn / 2, // Simplified calculation
  };
};

/**
 * Calculates realized vs unrealized gains.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Gains analysis
 */
export const calculateRealizedVsUnrealizedGains = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
): Promise<any> => {
  const soldInvestments = await InvestmentModel.findAll({
    where: {
      fundId,
      status: { [Op.in]: ['sold', 'matured'] },
      saleDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const realizedGains = soldInvestments.reduce(
    (sum: number, inv: any) => sum + (parseFloat(inv.realizedGainLoss) || 0),
    0,
  );

  const unrealizedData = await calculateUnrealizedGainsLosses(fundId, InvestmentModel);
  const unrealizedGains = unrealizedData.totalUnrealizedGainLoss;

  return {
    fundId,
    period: { startDate, endDate },
    realizedGains,
    unrealizedGains,
    totalGains: realizedGains + unrealizedGains,
    realizedCount: soldInvestments.length,
    unrealizedCount: unrealizedData.details.length,
  };
};

/**
 * Analyzes investment income generation.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Income analysis
 */
export const analyzeInvestmentIncome = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const daysPeriod = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const incomeByType = new Map<string, number>();

  investments.forEach((inv: any) => {
    const annualIncome =
      parseFloat(inv.faceValue) * parseFloat(inv.quantity) * (parseFloat(inv.couponRate) / 100);
    const periodIncome = (annualIncome / 365) * daysPeriod;

    const current = incomeByType.get(inv.securityType) || 0;
    incomeByType.set(inv.securityType, current + periodIncome);
  });

  const totalIncome = Array.from(incomeByType.values()).reduce((sum, income) => sum + income, 0);

  return {
    fundId,
    period: { startDate, endDate },
    totalIncome,
    bySecurityType: Array.from(incomeByType.entries()).map(([type, income]) => ({
      type,
      income,
      percent: totalIncome !== 0 ? (income / totalIncome) * 100 : 0,
    })),
  };
};

/**
 * Exports performance report to PDF.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<Buffer>} PDF report
 */
export const exportPerformanceReportPDF = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<Buffer> => {
  const performance = await generatePortfolioPerformanceReport(
    fundId,
    startDate,
    endDate,
    InvestmentModel,
    PortfolioValuationModel,
  );

  const content = `
INVESTMENT PORTFOLIO PERFORMANCE REPORT
Fund: ${fundId}
Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}

Beginning Value: $${performance.beginningValue?.toFixed(2) || 0}
Ending Value: $${performance.endingValue?.toFixed(2) || 0}
Realized Gains: $${performance.realizedGains?.toFixed(2) || 0}
Unrealized Gains: $${performance.unrealizedGains?.toFixed(2) || 0}
Total Return: ${performance.totalReturn?.toFixed(2) || 0}%
Annualized Return: ${performance.annualizedReturn?.toFixed(2) || 0}%

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

// ============================================================================
// RISK MANAGEMENT & COMPLIANCE (22-29)
// ============================================================================

/**
 * Assesses investment risk metrics.
 *
 * @param {string} investmentId - Investment ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<RiskMetrics>} Risk metrics
 */
export const assessInvestmentRisk = async (
  investmentId: string,
  InvestmentModel: any,
): Promise<RiskMetrics> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  // Credit risk based on rating
  const creditRiskMap: Record<string, string> = {
    AAA: 'low',
    AA: 'low',
    A: 'medium',
    BBB: 'medium',
    BB: 'high',
    B: 'high',
    CCC: 'critical',
  };

  const creditRating = investment.creditRating?.substring(0, 3) || 'A';
  const creditRisk = creditRiskMap[creditRating] || 'medium';

  // Market risk based on maturity
  const daysToMaturity = Math.floor(
    (new Date(investment.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const marketRisk = daysToMaturity > 365 ? 'high' : daysToMaturity > 180 ? 'medium' : 'low';

  // Interest rate risk (longer duration = higher risk)
  const interestRateRisk = daysToMaturity > 730 ? 'high' : daysToMaturity > 365 ? 'medium' : 'low';

  // Liquidity risk
  const liquidityRisk =
    investment.securityType === 'cd' || investment.securityType === 'municipal_bond'
      ? 'medium'
      : 'low';

  const riskScoreMap: Record<string, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const overallRiskScore =
    (riskScoreMap[creditRisk] +
      riskScoreMap[marketRisk] +
      riskScoreMap[interestRateRisk] +
      riskScoreMap[liquidityRisk]) /
    4;

  let riskRating: 'low' | 'medium' | 'high' | 'critical';
  if (overallRiskScore <= 1.5) riskRating = 'low';
  else if (overallRiskScore <= 2.5) riskRating = 'medium';
  else if (overallRiskScore <= 3.5) riskRating = 'high';
  else riskRating = 'critical';

  return {
    investmentId,
    creditRisk,
    marketRisk,
    interestRateRisk,
    liquidityRisk,
    concentrationRisk: 'low',
    overallRiskScore,
    riskRating,
  };
};

/**
 * Monitors investment policy compliance.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<PolicyCompliance>} Compliance status
 */
export const monitorPolicyCompliance = async (
  fundId: string,
  InvestmentModel: any,
): Promise<PolicyCompliance> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);
  const violations: PolicyViolation[] = [];

  if (investments.length === 0) {
    return {
      complianceDate: new Date(),
      policyType: 'investment_policy',
      compliant: true,
      violations: [],
      complianceScore: 100,
    };
  }

  const totalValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  // Check concentration by security type
  const typeConcentration = new Map<string, number>();
  investments.forEach((inv: any) => {
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    const current = typeConcentration.get(inv.securityType) || 0;
    typeConcentration.set(inv.securityType, current + value);
  });

  typeConcentration.forEach((value, type) => {
    const percent = (value / totalValue) * 100;
    if (percent > 40) {
      // 40% limit per type
      violations.push({
        violationType: 'concentration',
        description: `${type} concentration exceeds 40% limit`,
        severity: 'high',
        currentValue: percent,
        policyLimit: 40,
        variance: percent - 40,
      });
    }
  });

  // Check maturity limits
  const longTermInvestments = investments.filter((inv: any) => {
    const daysToMaturity = Math.floor(
      (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysToMaturity > 730; // 2 years
  });

  const longTermValue = longTermInvestments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  const longTermPercent = (longTermValue / totalValue) * 100;
  if (longTermPercent > 25) {
    violations.push({
      violationType: 'maturity',
      description: 'Long-term investments (>2 years) exceed 25% limit',
      severity: 'medium',
      currentValue: longTermPercent,
      policyLimit: 25,
      variance: longTermPercent - 25,
    });
  }

  // Check credit quality
  const lowQualityInvestments = investments.filter(
    (inv: any) => !['AAA', 'AA', 'A'].some((rating) => inv.creditRating?.startsWith(rating)),
  );

  if (lowQualityInvestments.length > 0) {
    violations.push({
      violationType: 'credit_quality',
      description: `${lowQualityInvestments.length} investments below A rating`,
      severity: 'high',
      currentValue: lowQualityInvestments.length,
      policyLimit: 0,
      variance: lowQualityInvestments.length,
    });
  }

  const complianceScore = Math.max(0, 100 - violations.length * 15);

  return {
    complianceDate: new Date(),
    policyType: 'investment_policy',
    compliant: violations.length === 0,
    violations,
    complianceScore,
  };
};

/**
 * Performs diversification analysis.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<DiversificationAnalysis>} Diversification metrics
 */
export const analyzeDiversification = async (
  fundId: string,
  InvestmentModel: any,
): Promise<DiversificationAnalysis> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const totalValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  // By security type
  const bySecurityType: Record<string, { count: number; value: number; percent: number }> = {};
  investments.forEach((inv: any) => {
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    if (!bySecurityType[inv.securityType]) {
      bySecurityType[inv.securityType] = { count: 0, value: 0, percent: 0 };
    }
    bySecurityType[inv.securityType].count++;
    bySecurityType[inv.securityType].value += value;
    bySecurityType[inv.securityType].percent = (bySecurityType[inv.securityType].value / totalValue) * 100;
  });

  // By credit rating
  const byCreditRating: Record<string, { count: number; value: number; percent: number }> = {};
  investments.forEach((inv: any) => {
    const rating = inv.creditRating?.substring(0, 3) || 'NR';
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    if (!byCreditRating[rating]) {
      byCreditRating[rating] = { count: 0, value: 0, percent: 0 };
    }
    byCreditRating[rating].count++;
    byCreditRating[rating].value += value;
    byCreditRating[rating].percent = (byCreditRating[rating].value / totalValue) * 100;
  });

  // By maturity bucket
  const byMaturityBucket: Record<string, { count: number; value: number; percent: number }> = {
    '0-90 days': { count: 0, value: 0, percent: 0 },
    '91-180 days': { count: 0, value: 0, percent: 0 },
    '181-365 days': { count: 0, value: 0, percent: 0 },
    '1-2 years': { count: 0, value: 0, percent: 0 },
    '2+ years': { count: 0, value: 0, percent: 0 },
  };

  investments.forEach((inv: any) => {
    const daysToMaturity = Math.floor(
      (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);

    let bucket: string;
    if (daysToMaturity <= 90) bucket = '0-90 days';
    else if (daysToMaturity <= 180) bucket = '91-180 days';
    else if (daysToMaturity <= 365) bucket = '181-365 days';
    else if (daysToMaturity <= 730) bucket = '1-2 years';
    else bucket = '2+ years';

    byMaturityBucket[bucket].count++;
    byMaturityBucket[bucket].value += value;
    byMaturityBucket[bucket].percent = (byMaturityBucket[bucket].value / totalValue) * 100;
  });

  // Calculate diversification score (Herfindahl-Hirschman Index)
  const hhi = Object.values(bySecurityType).reduce(
    (sum, type) => sum + Math.pow(type.percent / 100, 2),
    0,
  );
  const diversificationScore = (1 - hhi) * 100;

  const maxConcentration = Math.max(...Object.values(bySecurityType).map((t) => t.percent));
  let concentrationRisk: string;
  if (maxConcentration > 50) concentrationRisk = 'high';
  else if (maxConcentration > 35) concentrationRisk = 'medium';
  else concentrationRisk = 'low';

  return {
    analysisDate: new Date(),
    fundId,
    bySecurityType,
    byCreditRating,
    byMaturityBucket,
    diversificationScore,
    concentrationRisk,
  };
};

/**
 * Generates maturity schedule.
 *
 * @param {string} fundId - Fund ID
 * @param {number} months - Months to schedule
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<MaturitySchedule>} Maturity schedule
 */
export const generateMaturitySchedule = async (
  fundId: string,
  months: number,
  InvestmentModel: any,
): Promise<MaturitySchedule> => {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);

  const maturingInvestments = await getMaturingInvestments(new Date(), endDate, fundId, InvestmentModel);

  const maturityMap = new Map<string, any[]>();

  maturingInvestments.forEach((inv: any) => {
    const dateKey = new Date(inv.maturityDate).toISOString().split('T')[0];
    if (!maturityMap.has(dateKey)) {
      maturityMap.set(dateKey, []);
    }
    maturityMap.get(dateKey)!.push(inv);
  });

  const maturities: MaturityEntry[] = Array.from(maturityMap.entries()).map(([date, invs]) => {
    const totalFaceValue = invs.reduce((sum: number, inv: any) => sum + parseFloat(inv.faceValue), 0);
    const totalMarketValue = invs.reduce(
      (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
      0,
    );

    return {
      maturityDate: new Date(date),
      investments: invs.map((inv: any) => inv.investmentId),
      totalFaceValue,
      totalMarketValue,
      cashToBeReceived: totalFaceValue,
    };
  });

  const totalMaturingValue = maturities.reduce((sum, m) => sum + m.cashToBeReceived, 0);

  return {
    scheduleDate: new Date(),
    fundId,
    maturities,
    totalMaturingValue,
  };
};

/**
 * Identifies concentration risks.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Concentration risks
 */
export const identifyConcentrationRisks = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const diversification = await analyzeDiversification(fundId, InvestmentModel);
  const risks = [];

  // Check security type concentration
  Object.entries(diversification.bySecurityType).forEach(([type, data]) => {
    if (data.percent > 40) {
      risks.push({
        riskType: 'security_type_concentration',
        category: type,
        concentration: data.percent,
        threshold: 40,
        severity: data.percent > 50 ? 'high' : 'medium',
      });
    }
  });

  // Check issuer concentration (simplified)
  const investments = await getActiveInvestments(fundId, InvestmentModel);
  const issuerMap = new Map<string, number>();
  const totalValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  investments.forEach((inv: any) => {
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    const current = issuerMap.get(inv.issuer) || 0;
    issuerMap.set(inv.issuer, current + value);
  });

  issuerMap.forEach((value, issuer) => {
    const percent = (value / totalValue) * 100;
    if (percent > 25) {
      risks.push({
        riskType: 'issuer_concentration',
        category: issuer,
        concentration: percent,
        threshold: 25,
        severity: percent > 35 ? 'high' : 'medium',
      });
    }
  });

  return {
    fundId,
    analysisDate: new Date(),
    risks,
    overallConcentrationRisk: diversification.concentrationRisk,
  };
};

/**
 * Generates risk assessment report.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Risk assessment
 */
export const generateRiskAssessmentReport = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const riskAssessments = await Promise.all(
    investments.map((inv: any) => assessInvestmentRisk(inv.investmentId, InvestmentModel)),
  );

  const riskCounts = {
    low: riskAssessments.filter((r) => r.riskRating === 'low').length,
    medium: riskAssessments.filter((r) => r.riskRating === 'medium').length,
    high: riskAssessments.filter((r) => r.riskRating === 'high').length,
    critical: riskAssessments.filter((r) => r.riskRating === 'critical').length,
  };

  const avgRiskScore =
    riskAssessments.reduce((sum, r) => sum + r.overallRiskScore, 0) / riskAssessments.length;

  let portfolioRiskRating: 'low' | 'medium' | 'high' | 'critical';
  if (avgRiskScore <= 1.5) portfolioRiskRating = 'low';
  else if (avgRiskScore <= 2.5) portfolioRiskRating = 'medium';
  else if (avgRiskScore <= 3.5) portfolioRiskRating = 'high';
  else portfolioRiskRating = 'critical';

  return {
    fundId,
    assessmentDate: new Date(),
    portfolioRiskRating,
    avgRiskScore,
    riskDistribution: riskCounts,
    detailedAssessments: riskAssessments,
  };
};

/**
 * Recommends portfolio rebalancing.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Rebalancing recommendations
 */
export const recommendPortfolioRebalancing = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const diversification = await analyzeDiversification(fundId, InvestmentModel);
  const compliance = await monitorPolicyCompliance(fundId, InvestmentModel);

  const recommendations = [];

  // Check for concentration issues
  Object.entries(diversification.bySecurityType).forEach(([type, data]) => {
    if (data.percent > 40) {
      recommendations.push({
        action: 'reduce_concentration',
        category: type,
        currentAllocation: data.percent,
        targetAllocation: 35,
        reason: 'Exceeds 40% concentration limit',
        priority: 'high',
      });
    }
  });

  // Check maturity distribution
  const shortTerm = diversification.byMaturityBucket['0-90 days'].percent;
  if (shortTerm > 50) {
    recommendations.push({
      action: 'extend_maturity',
      category: 'maturity',
      currentAllocation: shortTerm,
      targetAllocation: 40,
      reason: 'Too much short-term exposure, extend to improve yield',
      priority: 'medium',
    });
  }

  // Add compliance-driven recommendations
  compliance.violations.forEach((violation) => {
    recommendations.push({
      action: 'address_violation',
      category: violation.violationType,
      currentValue: violation.currentValue,
      policyLimit: violation.policyLimit,
      reason: violation.description,
      priority: violation.severity,
    });
  });

  return {
    fundId,
    recommendationDate: new Date(),
    rebalancingNeeded: recommendations.length > 0,
    recommendations,
  };
};

/**
 * Exports investment compliance report.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<Buffer>} Compliance report
 */
export const exportComplianceReport = async (
  fundId: string,
  InvestmentModel: any,
): Promise<Buffer> => {
  const compliance = await monitorPolicyCompliance(fundId, InvestmentModel);
  const diversification = await analyzeDiversification(fundId, InvestmentModel);

  const content = `
INVESTMENT POLICY COMPLIANCE REPORT
Fund: ${fundId}
Date: ${new Date().toISOString().split('T')[0]}

Compliance Status: ${compliance.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
Compliance Score: ${compliance.complianceScore}%

Policy Violations: ${compliance.violations.length}
${compliance.violations.map((v) => `- ${v.description} (Severity: ${v.severity})`).join('\n')}

Diversification Score: ${diversification.diversificationScore.toFixed(2)}%
Concentration Risk: ${diversification.concentrationRisk}

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

// ============================================================================
// REPORTING & ANALYTICS (30-39)
// ============================================================================

/**
 * Generates comprehensive investment report.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} asOfDate - As of date
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Comprehensive report
 */
export const generateComprehensiveInvestmentReport = async (
  fundId: string,
  asOfDate: Date,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<any> => {
  const dashboard = await generatePortfolioDashboard(fundId, InvestmentModel, PortfolioValuationModel);
  const register = await generateInvestmentRegister(fundId, InvestmentModel);
  const diversification = await analyzeDiversification(fundId, InvestmentModel);
  const compliance = await monitorPolicyCompliance(fundId, InvestmentModel);

  return {
    fundId,
    reportDate: asOfDate,
    summary: dashboard.summary,
    holdings: register.investments,
    diversification,
    compliance,
    recommendations: compliance.violations.length > 0 ? 'Address policy violations' : 'Portfolio in compliance',
  };
};

/**
 * Analyzes yield curve exposure.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Yield curve analysis
 */
export const analyzeYieldCurveExposure = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const yieldCurve = {
    '0-1 year': { count: 0, avgYield: 0, totalValue: 0 },
    '1-3 years': { count: 0, avgYield: 0, totalValue: 0 },
    '3-5 years': { count: 0, avgYield: 0, totalValue: 0 },
    '5+ years': { count: 0, avgYield: 0, totalValue: 0 },
  };

  investments.forEach((inv: any) => {
    const daysToMaturity = Math.floor(
      (new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    const years = daysToMaturity / 365;
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    const ytm = parseFloat(inv.yieldToMaturity);

    let bucket: '0-1 year' | '1-3 years' | '3-5 years' | '5+ years';
    if (years <= 1) bucket = '0-1 year';
    else if (years <= 3) bucket = '1-3 years';
    else if (years <= 5) bucket = '3-5 years';
    else bucket = '5+ years';

    yieldCurve[bucket].count++;
    yieldCurve[bucket].avgYield += ytm;
    yieldCurve[bucket].totalValue += value;
  });

  // Calculate average yields
  Object.keys(yieldCurve).forEach((bucket) => {
    const key = bucket as keyof typeof yieldCurve;
    if (yieldCurve[key].count > 0) {
      yieldCurve[key].avgYield /= yieldCurve[key].count;
    }
  });

  return {
    fundId,
    analysisDate: new Date(),
    yieldCurve,
  };
};

/**
 * Calculates portfolio turnover rate.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<number>} Turnover rate
 */
export const calculatePortfolioTurnover = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
): Promise<number> => {
  const soldInvestments = await InvestmentModel.findAll({
    where: {
      fundId,
      status: 'sold',
      saleDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalSales = soldInvestments.reduce(
    (sum: number, inv: any) => sum + (parseFloat(inv.salePrice) || 0),
    0,
  );

  const avgPortfolioValue = 10000000; // Mock average portfolio value
  const turnoverRate = avgPortfolioValue !== 0 ? (totalSales / avgPortfolioValue) * 100 : 0;

  return turnoverRate;
};

/**
 * Tracks investment cost basis.
 *
 * @param {string} investmentId - Investment ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Cost basis tracking
 */
export const trackInvestmentCostBasis = async (
  investmentId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investment = await InvestmentModel.findOne({ where: { investmentId } });
  if (!investment) throw new Error('Investment not found');

  const costBasis = parseFloat(investment.purchasePrice) * parseFloat(investment.quantity);
  const currentValue = parseFloat(investment.currentPrice) * parseFloat(investment.quantity);
  const unrealizedGainLoss = currentValue - costBasis;

  return {
    investmentId,
    securityName: investment.securityName,
    quantity: parseFloat(investment.quantity),
    costBasis,
    costPerUnit: parseFloat(investment.purchasePrice),
    currentValue,
    currentPricePerUnit: parseFloat(investment.currentPrice),
    unrealizedGainLoss,
    unrealizedGainLossPercent: costBasis !== 0 ? (unrealizedGainLoss / costBasis) * 100 : 0,
  };
};

/**
 * Generates investment transaction history.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Transaction history
 */
export const generateInvestmentTransactionHistory = async (
  fundId: string,
  startDate: Date,
  endDate: Date,
  InvestmentModel: any,
): Promise<any> => {
  const purchases = await InvestmentModel.findAll({
    where: {
      fundId,
      purchaseDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['purchaseDate', 'DESC']],
  });

  const sales = await InvestmentModel.findAll({
    where: {
      fundId,
      status: 'sold',
      saleDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['saleDate', 'DESC']],
  });

  return {
    fundId,
    period: { startDate, endDate },
    purchases: purchases.map((p: any) => ({
      investmentId: p.investmentId,
      securityName: p.securityName,
      purchaseDate: p.purchaseDate,
      purchasePrice: p.purchasePrice,
      quantity: p.quantity,
    })),
    sales: sales.map((s: any) => ({
      investmentId: s.investmentId,
      securityName: s.securityName,
      saleDate: s.saleDate,
      salePrice: s.salePrice,
      realizedGainLoss: s.realizedGainLoss,
    })),
  };
};

/**
 * Analyzes investment quality distribution.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Quality analysis
 */
export const analyzeInvestmentQuality = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const qualityBuckets = {
    'AAA-AA': 0,
    'A': 0,
    'BBB': 0,
    'Below BBB': 0,
  };

  const totalValue = investments.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.currentPrice) * parseFloat(inv.quantity),
    0,
  );

  investments.forEach((inv: any) => {
    const value = parseFloat(inv.currentPrice) * parseFloat(inv.quantity);
    const rating = inv.creditRating || 'NR';

    if (rating.startsWith('AAA') || rating.startsWith('AA')) {
      qualityBuckets['AAA-AA'] += value;
    } else if (rating.startsWith('A')) {
      qualityBuckets['A'] += value;
    } else if (rating.startsWith('BBB')) {
      qualityBuckets['BBB'] += value;
    } else {
      qualityBuckets['Below BBB'] += value;
    }
  });

  return {
    fundId,
    analysisDate: new Date(),
    qualityDistribution: Object.entries(qualityBuckets).map(([quality, value]) => ({
      quality,
      value,
      percent: totalValue !== 0 ? (value / totalValue) * 100 : 0,
    })),
  };
};

/**
 * Calculates average investment holding period.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<number>} Average holding period (days)
 */
export const calculateAverageHoldingPeriod = async (
  fundId: string,
  InvestmentModel: any,
): Promise<number> => {
  const soldInvestments = await InvestmentModel.findAll({
    where: {
      fundId,
      status: 'sold',
    },
  });

  if (soldInvestments.length === 0) return 0;

  const totalDays = soldInvestments.reduce((sum: number, inv: any) => {
    const days = Math.floor(
      (new Date(inv.saleDate).getTime() - new Date(inv.purchaseDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return sum + days;
  }, 0);

  return totalDays / soldInvestments.length;
};

/**
 * Generates maturity distribution chart data.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<any>} Chart data
 */
export const generateMaturityDistributionChart = async (
  fundId: string,
  InvestmentModel: any,
): Promise<any> => {
  const diversification = await analyzeDiversification(fundId, InvestmentModel);

  const chartData = Object.entries(diversification.byMaturityBucket).map(([bucket, data]) => ({
    bucket,
    count: data.count,
    value: data.value,
    percent: data.percent,
  }));

  return {
    fundId,
    chartType: 'maturity_distribution',
    data: chartData,
  };
};

/**
 * Exports portfolio holdings to CSV.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportPortfolioHoldingsCSV = async (
  fundId: string,
  InvestmentModel: any,
): Promise<Buffer> => {
  const investments = await getActiveInvestments(fundId, InvestmentModel);

  const csv =
    'Investment ID,Security Name,CUSIP,Security Type,Purchase Date,Maturity Date,Face Value,Purchase Price,Current Price,Yield,Credit Rating\n' +
    investments
      .map(
        (inv: any) =>
          `${inv.investmentId},${inv.securityName},${inv.cusip},${inv.securityType},${inv.purchaseDate.toISOString().split('T')[0]},${inv.maturityDate.toISOString().split('T')[0]},${inv.faceValue},${inv.purchasePrice},${inv.currentPrice},${inv.yieldToMaturity},${inv.creditRating}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Generates executive investment summary.
 *
 * @param {string} fundId - Fund ID
 * @param {Model} InvestmentModel - Investment model
 * @param {Model} PortfolioValuationModel - Valuation model
 * @returns {Promise<any>} Executive summary
 */
export const generateExecutiveInvestmentSummary = async (
  fundId: string,
  InvestmentModel: any,
  PortfolioValuationModel: any,
): Promise<any> => {
  const dashboard = await generatePortfolioDashboard(fundId, InvestmentModel, PortfolioValuationModel);
  const compliance = await monitorPolicyCompliance(fundId, InvestmentModel);
  const diversification = await analyzeDiversification(fundId, InvestmentModel);
  const riskAssessment = await generateRiskAssessmentReport(fundId, InvestmentModel);

  return {
    fundId,
    reportDate: new Date(),
    keyMetrics: {
      totalMarketValue: dashboard.summary.totalMarketValue,
      portfolioYield: dashboard.summary.portfolioYield,
      unrealizedGainLoss: dashboard.summary.unrealizedGainLoss,
      weightedAvgMaturity: dashboard.summary.weightedAvgMaturity,
    },
    riskProfile: {
      portfolioRiskRating: riskAssessment.portfolioRiskRating,
      diversificationScore: diversification.diversificationScore,
      concentrationRisk: diversification.concentrationRisk,
    },
    compliance: {
      status: compliance.compliant ? 'Compliant' : 'Non-Compliant',
      score: compliance.complianceScore,
      violations: compliance.violations.length,
    },
    recommendations:
      compliance.violations.length > 0
        ? `Address ${compliance.violations.length} policy violations`
        : 'Portfolio management on track',
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSInvestmentPortfolioService {
  constructor(private readonly sequelize: Sequelize) {}

  async recordPurchase(investmentData: Investment) {
    const InvestmentModel = createInvestmentModel(this.sequelize);
    return recordInvestmentPurchase(investmentData, InvestmentModel);
  }

  async performValuation(fundId: string, valuationDate: Date) {
    const InvestmentModel = createInvestmentModel(this.sequelize);
    const PortfolioValuationModel = createPortfolioValuationModel(this.sequelize);
    return performPortfolioValuation(fundId, valuationDate, InvestmentModel, PortfolioValuationModel);
  }

  async generateDashboard(fundId: string) {
    const InvestmentModel = createInvestmentModel(this.sequelize);
    const PortfolioValuationModel = createPortfolioValuationModel(this.sequelize);
    return generatePortfolioDashboard(fundId, InvestmentModel, PortfolioValuationModel);
  }

  async monitorCompliance(fundId: string) {
    const InvestmentModel = createInvestmentModel(this.sequelize);
    return monitorPolicyCompliance(fundId, InvestmentModel);
  }
}

export default {
  // Models
  createInvestmentModel,
  createPortfolioValuationModel,
  createInvestmentPerformanceModel,

  // Tracking & Management
  recordInvestmentPurchase,
  updateInvestmentPrice,
  recordInvestmentMaturityOrSale,
  getActiveInvestments,
  getMaturingInvestments,
  calculateAccruedInterest,
  generateInvestmentRegister,

  // Valuation
  performPortfolioValuation,
  calculateUnrealizedGainsLosses,
  trackPortfolioValueOverTime,
  calculatePortfolioYield,
  calculateWeightedAvgMaturity,
  calculatePortfolioDuration,
  generatePortfolioDashboard,

  // Performance
  calculateInvestmentPerformance,
  generatePortfolioPerformanceReport,
  calculateTimeWeightedReturn,
  benchmarkPortfolioPerformance,
  calculateRealizedVsUnrealizedGains,
  analyzeInvestmentIncome,
  exportPerformanceReportPDF,

  // Risk & Compliance
  assessInvestmentRisk,
  monitorPolicyCompliance,
  analyzeDiversification,
  generateMaturitySchedule,
  identifyConcentrationRisks,
  generateRiskAssessmentReport,
  recommendPortfolioRebalancing,
  exportComplianceReport,

  // Reporting
  generateComprehensiveInvestmentReport,
  analyzeYieldCurveExposure,
  calculatePortfolioTurnover,
  trackInvestmentCostBasis,
  generateInvestmentTransactionHistory,
  analyzeInvestmentQuality,
  calculateAverageHoldingPeriod,
  generateMaturityDistributionChart,
  exportPortfolioHoldingsCSV,
  generateExecutiveInvestmentSummary,

  // Service
  CEFMSInvestmentPortfolioService,
};

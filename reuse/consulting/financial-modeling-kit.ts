/**
 * LOC: CONSFIN78901
 * File: /reuse/consulting/financial-modeling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Consulting engagement services
 *   - Financial advisory controllers
 *   - Valuation and M&A modules
 *   - Strategic planning services
 */

/**
 * File: /reuse/consulting/financial-modeling-kit.ts
 * Locator: WC-CONS-FINMODEL-001
 * Purpose: McKinsey/BCG-Level Financial Modeling - DCF, NPV, IRR, sensitivity analysis, scenario modeling, valuation frameworks
 *
 * Upstream: Independent financial modeling utility module
 * Downstream: ../backend/*, Consulting controllers, Advisory services, M&A modules, Valuation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js, mathjs
 * Exports: 50+ utility functions for DCF analysis, NPV/IRR, sensitivity analysis, scenario modeling, financial forecasting, valuation
 *
 * LLM Context: Enterprise-grade financial modeling competing with McKinsey and BCG capabilities.
 * Provides comprehensive discounted cash flow (DCF) analysis, net present value (NPV) calculations, internal rate of return (IRR),
 * modified internal rate of return (MIRR), sensitivity analysis, scenario modeling, Monte Carlo simulation, financial statement modeling,
 * revenue forecasting, cost modeling, capital structure optimization, working capital analysis, break-even analysis, valuation multiples,
 * comparable company analysis, precedent transaction analysis, leveraged buyout (LBO) modeling, merger modeling, accretion/dilution analysis,
 * terminal value calculation, weighted average cost of capital (WACC), enterprise value calculation, equity value bridges, and integrated
 * 3-statement financial models with audit trails and compliance tracking.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
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
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

export enum ModelingMethodology {
  DCF = 'dcf',
  COMPARABLE_COMPANY = 'comparable-company',
  PRECEDENT_TRANSACTION = 'precedent-transaction',
  LBO = 'lbo',
  SUM_OF_PARTS = 'sum-of-parts',
  ASSET_BASED = 'asset-based',
}

export enum ScenarioType {
  BASE_CASE = 'base-case',
  BEST_CASE = 'best-case',
  WORST_CASE = 'worst-case',
  DOWNSIDE = 'downside',
  UPSIDE = 'upside',
  CUSTOM = 'custom',
}

export enum ValuationApproach {
  INCOME = 'income',
  MARKET = 'market',
  ASSET = 'asset',
  HYBRID = 'hybrid',
}

export enum TerminalValueMethod {
  PERPETUITY_GROWTH = 'perpetuity-growth',
  EXIT_MULTIPLE = 'exit-multiple',
  SALVAGE_VALUE = 'salvage-value',
}

export enum CashFlowType {
  FREE_CASH_FLOW_FIRM = 'fcff',
  FREE_CASH_FLOW_EQUITY = 'fcfe',
  UNLEVERED_FREE_CASH_FLOW = 'ufcf',
  LEVERED_FREE_CASH_FLOW = 'lfcf',
}

export enum SensitivityParameter {
  REVENUE_GROWTH = 'revenue-growth',
  MARGIN = 'margin',
  DISCOUNT_RATE = 'discount-rate',
  TERMINAL_GROWTH = 'terminal-growth',
  CAPEX = 'capex',
  WORKING_CAPITAL = 'working-capital',
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface FinancialModel {
  id: string;
  modelName: string;
  companyId: string;
  methodology: ModelingMethodology;
  valuationDate: Date;
  fiscalYearEnd: Date;
  projectionYears: number;
  baseYear: number;
  currency: string;
  assumptions: ModelAssumptions;
  financialStatements: FinancialStatements;
  cashFlowProjections: CashFlowProjection[];
  valuation: ValuationResult;
  scenarios: ScenarioAnalysis[];
  sensitivityAnalysis: SensitivityResult[];
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelAssumptions {
  revenueGrowthRates: number[];
  ebitdaMargins: number[];
  taxRate: number;
  discountRate: number;
  terminalGrowthRate: number;
  terminalMultiple?: number;
  capexAsPercentRevenue: number[];
  nwcAsPercentRevenue: number[];
  debtToEquityRatio?: number;
  targetDebtRatio?: number;
  macroAssumptions: MacroAssumptions;
  operatingAssumptions: OperatingAssumptions;
}

export interface MacroAssumptions {
  gdpGrowth: number[];
  inflation: number[];
  interestRates: number[];
  exchangeRates?: Record<string, number[]>;
  commodityPrices?: Record<string, number[]>;
}

export interface OperatingAssumptions {
  marketGrowthRate: number;
  marketShareGrowth: number[];
  pricingPower: number;
  volumeGrowth: number[];
  costInflation: number[];
  productivityGains: number[];
}

export interface FinancialStatements {
  incomeStatement: IncomeStatement[];
  balanceSheet: BalanceSheet[];
  cashFlowStatement: CashFlowStatement[];
}

export interface IncomeStatement {
  year: number;
  fiscalYear: number;
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  researchDevelopment: number;
  salesMarketing: number;
  generalAdministrative: number;
  ebitda: number;
  ebitdaMargin: number;
  depreciation: number;
  amortization: number;
  ebit: number;
  ebitMargin: number;
  interestExpense: number;
  interestIncome: number;
  otherIncomeExpense: number;
  ebt: number;
  taxExpense: number;
  effectiveTaxRate: number;
  netIncome: number;
  netMargin: number;
  eps?: number;
  sharesOutstanding?: number;
}

export interface BalanceSheet {
  year: number;
  fiscalYear: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipment: number;
  accumulatedDepreciation: number;
  netPPE: number;
  intangibleAssets: number;
  goodwill: number;
  otherLongTermAssets: number;
  totalAssets: number;
  accountsPayable: number;
  accruedExpenses: number;
  shortTermDebt: number;
  currentPortionLongTermDebt: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredTaxLiabilities: number;
  otherLongTermLiabilities: number;
  totalLiabilities: number;
  commonStock: number;
  retainedEarnings: number;
  treasuryStock: number;
  accumulatedOCI: number;
  totalEquity: number;
  totalLiabilitiesEquity: number;
}

export interface CashFlowStatement {
  year: number;
  fiscalYear: number;
  netIncome: number;
  depreciation: number;
  amortization: number;
  stockBasedComp: number;
  deferredTax: number;
  changeAccountsReceivable: number;
  changeInventory: number;
  changeAccountsPayable: number;
  changeOtherWorkingCapital: number;
  changeWorkingCapital: number;
  operatingCashFlow: number;
  capitalExpenditures: number;
  acquisitions: number;
  assetSales: number;
  otherInvestingActivities: number;
  investingCashFlow: number;
  debtIssuance: number;
  debtRepayment: number;
  equityIssuance: number;
  dividendsPaid: number;
  shareRepurchases: number;
  otherFinancingActivities: number;
  financingCashFlow: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface CashFlowProjection {
  year: number;
  revenue: number;
  ebitda: number;
  ebit: number;
  taxExpense: number;
  nopat: number;
  depreciation: number;
  amortization: number;
  capitalExpenditures: number;
  changeNWC: number;
  freeCashFlow: number;
  discountFactor: number;
  presentValue: number;
}

export interface ValuationResult {
  methodology: ModelingMethodology;
  enterpriseValue: number;
  terminalValue: number;
  terminalValuePV: number;
  projectedCashFlowsPV: number;
  totalDebt: number;
  cashAndEquivalents: number;
  minorityInterest: number;
  preferredStock: number;
  equityValue: number;
  sharesOutstanding: number;
  valuePerShare: number;
  impliedMultiples: ImpliedMultiples;
  wacc: number;
  unleveredBeta: number;
  leveredBeta: number;
}

export interface ImpliedMultiples {
  evToRevenue: number;
  evToEbitda: number;
  evToEbit: number;
  peRatio: number;
  pbRatio: number;
  priceToSales: number;
  evToFCF: number;
}

export interface ScenarioAnalysis {
  scenarioId: string;
  scenarioName: string;
  scenarioType: ScenarioType;
  probability: number;
  assumptions: Partial<ModelAssumptions>;
  valuation: ValuationResult;
  variance: number;
  variancePercent: number;
}

export interface SensitivityResult {
  parameter: SensitivityParameter;
  baseValue: number;
  rangeMin: number;
  rangeMax: number;
  step: number;
  results: SensitivityDataPoint[];
  tornado: TornadoChartData;
}

export interface SensitivityDataPoint {
  parameterValue: number;
  equityValue: number;
  valuePerShare: number;
  variance: number;
  variancePercent: number;
}

export interface TornadoChartData {
  parameter: string;
  baseCase: number;
  downsideValue: number;
  upsideValue: number;
  downsideImpact: number;
  upsideImpact: number;
  totalSwing: number;
}

export interface NPVAnalysis {
  cashFlows: number[];
  discountRate: number;
  initialInvestment: number;
  npv: number;
  profitabilityIndex: number;
  paybackPeriod: number;
  discountedPaybackPeriod: number;
}

export interface IRRAnalysis {
  cashFlows: number[];
  irr: number;
  mirr: number;
  reinvestmentRate: number;
  financeRate: number;
  investmentMultiple: number;
  annualizedReturn: number;
}

export interface WACCComponents {
  costOfEquity: number;
  costOfDebt: number;
  marketValueEquity: number;
  marketValueDebt: number;
  taxRate: number;
  wacc: number;
  debtToEquity: number;
  debtToCapital: number;
}

export interface CapitalStructure {
  equity: number;
  debt: number;
  preferredStock: number;
  totalCapital: number;
  equityWeight: number;
  debtWeight: number;
  preferredWeight: number;
  optimalStructure: boolean;
}

export interface BreakEvenAnalysis {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
  operatingLeverage: number;
}

export interface LBOModel {
  purchasePrice: number;
  enterpriseValue: number;
  equityContribution: number;
  debtFinancing: number;
  ltv: number;
  exitMultiple: number;
  exitYear: number;
  exitEnterpriseValue: number;
  equityProceeds: number;
  moic: number;
  irr: number;
  cashFlows: number[];
  debtSchedule: DebtSchedule[];
}

export interface DebtSchedule {
  year: number;
  beginningBalance: number;
  cashFlowAvailable: number;
  requiredAmortization: number;
  optionalPrepayment: number;
  totalPayment: number;
  endingBalance: number;
  interestExpense: number;
}

export interface ComparableCompany {
  companyName: string;
  ticker: string;
  marketCap: number;
  enterpriseValue: number;
  revenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  evToRevenue: number;
  evToEbitda: number;
  evToEbit: number;
  peRatio: number;
  revenueGrowth: number;
  ebitdaMargin: number;
}

export interface PrecedentTransaction {
  targetCompany: string;
  acquiror: string;
  announcedDate: Date;
  closedDate: Date;
  dealValue: number;
  revenue: number;
  ebitda: number;
  evToRevenue: number;
  evToEbitda: number;
  premiumPaid: number;
  synergies: number;
  dealRationale: string;
}

export interface MergerModel {
  acquiror: FinancialStatements;
  target: FinancialStatements;
  purchasePrice: number;
  paymentMethod: 'cash' | 'stock' | 'mixed';
  exchangeRatio?: number;
  synergies: SynergyAssumptions;
  proForma: FinancialStatements;
  accretionDilution: AccretionDilution;
  combinedMetrics: CombinedMetrics;
}

export interface SynergyAssumptions {
  revenuesynergies: number[];
  costSynergies: number[];
  realizationSchedule: number[];
  oneTimeCosts: number;
  synergyTaxRate: number;
}

export interface AccretionDilution {
  year: number;
  standAloneEPS: number;
  proFormaEPS: number;
  accretionDilution: number;
  accretionDilutionPercent: number;
}

export interface CombinedMetrics {
  combinedRevenue: number[];
  combinedEbitda: number[];
  combinedNetIncome: number[];
  combinedEPS: number[];
  synergizedEbitda: number[];
  synergizedNetIncome: number[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Financial Models with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialModel model
 *
 * @example
 * ```typescript
 * const FinancialModel = createFinancialModelModel(sequelize);
 * const model = await FinancialModel.create({
 *   modelName: 'TechCorp Valuation 2024',
 *   companyId: 'TECH_001',
 *   methodology: 'dcf',
 *   projectionYears: 5
 * });
 * ```
 */
export const createFinancialModelModel = (sequelize: Sequelize) => {
  class FinancialModel extends Model {
    public id!: number;
    public modelId!: string;
    public modelName!: string;
    public companyId!: string;
    public companyName!: string;
    public methodology!: string;
    public valuationDate!: Date;
    public fiscalYearEnd!: Date;
    public projectionYears!: number;
    public baseYear!: number;
    public currency!: string;
    public assumptions!: Record<string, any>;
    public financialStatements!: Record<string, any>;
    public cashFlowProjections!: Record<string, any>[];
    public valuation!: Record<string, any>;
    public scenarios!: Record<string, any>[];
    public sensitivityAnalysis!: Record<string, any>[];
    public modelVersion!: number;
    public status!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public metadata!: Record<string, any>;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FinancialModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      modelId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique model identifier',
      },
      modelName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Financial model name',
      },
      companyId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Company identifier',
      },
      companyName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Company name',
      },
      methodology: {
        type: DataTypes.ENUM(
          'dcf',
          'comparable-company',
          'precedent-transaction',
          'lbo',
          'sum-of-parts',
          'asset-based',
        ),
        allowNull: false,
        comment: 'Valuation methodology',
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Valuation date',
      },
      fiscalYearEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Fiscal year end date',
      },
      projectionYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        comment: 'Number of projection years',
      },
      baseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Base year for projections',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency (ISO 4217)',
      },
      assumptions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Model assumptions',
      },
      financialStatements: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Historical and projected financial statements',
      },
      cashFlowProjections: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Cash flow projections',
      },
      valuation: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Valuation results',
      },
      scenarios: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Scenario analysis results',
      },
      sensitivityAnalysis: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Sensitivity analysis results',
      },
      modelVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Model version number',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'approved', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Model status',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Approver identifier',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Creator identifier',
      },
    },
    {
      sequelize,
      tableName: 'financial_models',
      timestamps: true,
      indexes: [
        { fields: ['modelId'], unique: true },
        { fields: ['companyId'] },
        { fields: ['methodology'] },
        { fields: ['valuationDate'] },
        { fields: ['status'] },
        { fields: ['createdBy'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return FinancialModel;
};

/**
 * Sequelize model for Valuation Comparables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValuationComparable model
 */
export const createValuationComparableModel = (sequelize: Sequelize) => {
  class ValuationComparable extends Model {
    public id!: number;
    public comparableId!: string;
    public companyName!: string;
    public ticker!: string;
    public industry!: string;
    public sector!: string;
    public marketCap!: number;
    public enterpriseValue!: number;
    public revenue!: number;
    public ebitda!: number;
    public ebit!: number;
    public netIncome!: number;
    public totalAssets!: number;
    public totalDebt!: number;
    public cash!: number;
    public evToRevenue!: number;
    public evToEbitda!: number;
    public evToEbit!: number;
    public peRatio!: number;
    public pbRatio!: number;
    public revenueGrowth!: number;
    public ebitdaMargin!: number;
    public netMargin!: number;
    public roe!: number;
    public roa!: number;
    public asOfDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ValuationComparable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comparableId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Comparable identifier',
      },
      companyName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Company name',
      },
      ticker: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Stock ticker',
      },
      industry: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Industry classification',
      },
      sector: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Sector classification',
      },
      marketCap: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Market capitalization',
      },
      enterpriseValue: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Enterprise value',
      },
      revenue: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Revenue (LTM)',
      },
      ebitda: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'EBITDA (LTM)',
      },
      ebit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'EBIT (LTM)',
      },
      netIncome: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Net income (LTM)',
      },
      totalAssets: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total assets',
      },
      totalDebt: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total debt',
      },
      cash: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Cash and equivalents',
      },
      evToRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'EV/Revenue multiple',
      },
      evToEbitda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'EV/EBITDA multiple',
      },
      evToEbit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'EV/EBIT multiple',
      },
      peRatio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'P/E ratio',
      },
      pbRatio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'P/B ratio',
      },
      revenueGrowth: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Revenue growth rate',
      },
      ebitdaMargin: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'EBITDA margin',
      },
      netMargin: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Net margin',
      },
      roe: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Return on equity',
      },
      roa: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Return on assets',
      },
      asOfDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Data as-of date',
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
      tableName: 'valuation_comparables',
      timestamps: true,
      indexes: [
        { fields: ['comparableId'], unique: true },
        { fields: ['ticker'] },
        { fields: ['industry'] },
        { fields: ['sector'] },
        { fields: ['asOfDate'] },
        { fields: ['evToEbitda'] },
      ],
    },
  );

  return ValuationComparable;
};

/**
 * Sequelize model for LBO Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LBOModel model
 */
export const createLBOModelModel = (sequelize: Sequelize) => {
  class LBOModel extends Model {
    public id!: number;
    public lboId!: string;
    public modelName!: string;
    public targetCompany!: string;
    public sponsor!: string;
    public purchasePrice!: number;
    public enterpriseValue!: number;
    public equityContribution!: number;
    public debtFinancing!: number;
    public ltv!: number;
    public entryMultiple!: number;
    public exitMultiple!: number;
    public holdingPeriod!: number;
    public exitYear!: number;
    public exitEnterpriseValue!: number;
    public equityProceeds!: number;
    public moic!: number;
    public irr!: number;
    public cashFlows!: Record<string, any>[];
    public debtSchedule!: Record<string, any>[];
    public sourcesUses!: Record<string, any>;
    public returnAnalysis!: Record<string, any>;
    public sensitivityAnalysis!: Record<string, any>[];
    public status!: string;
    public metadata!: Record<string, any>;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LBOModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lboId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'LBO model identifier',
      },
      modelName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'LBO model name',
      },
      targetCompany: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Target company name',
      },
      sponsor: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'PE sponsor/firm name',
      },
      purchasePrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Purchase price',
      },
      enterpriseValue: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Enterprise value at entry',
      },
      equityContribution: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Equity contribution',
      },
      debtFinancing: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total debt financing',
      },
      ltv: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        comment: 'Loan-to-value ratio',
      },
      entryMultiple: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Entry EV/EBITDA multiple',
      },
      exitMultiple: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Exit EV/EBITDA multiple',
      },
      holdingPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Holding period in years',
      },
      exitYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Exit year',
      },
      exitEnterpriseValue: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Enterprise value at exit',
      },
      equityProceeds: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Equity proceeds at exit',
      },
      moic: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Multiple on invested capital',
      },
      irr: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Internal rate of return',
      },
      cashFlows: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Annual cash flows',
      },
      debtSchedule: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Debt paydown schedule',
      },
      sourcesUses: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Sources and uses of funds',
      },
      returnAnalysis: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Return attribution analysis',
      },
      sensitivityAnalysis: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Sensitivity analysis',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'approved', 'executed', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Model status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Creator identifier',
      },
    },
    {
      sequelize,
      tableName: 'lbo_models',
      timestamps: true,
      indexes: [
        { fields: ['lboId'], unique: true },
        { fields: ['targetCompany'] },
        { fields: ['sponsor'] },
        { fields: ['exitYear'] },
        { fields: ['irr'] },
        { fields: ['status'] },
        { fields: ['createdBy'] },
      ],
    },
  );

  return LBOModel;
};

/**
 * Sequelize model for Merger Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MergerModel model
 */
export const createMergerModelModel = (sequelize: Sequelize) => {
  class MergerModel extends Model {
    public id!: number;
    public mergerId!: string;
    public modelName!: string;
    public acquirorCompany!: string;
    public targetCompany!: string;
    public purchasePrice!: number;
    public paymentMethod!: string;
    public exchangeRatio!: number | null;
    public cashComponent!: number;
    public stockComponent!: number;
    public synergies!: Record<string, any>;
    public proFormaFinancials!: Record<string, any>;
    public accretionDilution!: Record<string, any>[];
    public combinedMetrics!: Record<string, any>;
    public premiumPaid!: number;
    public premiumPercent!: number;
    public dealMultiples!: Record<string, any>;
    public status!: string;
    public metadata!: Record<string, any>;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MergerModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mergerId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Merger model identifier',
      },
      modelName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Merger model name',
      },
      acquirorCompany: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Acquiror company name',
      },
      targetCompany: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Target company name',
      },
      purchasePrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total purchase price',
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'stock', 'mixed'),
        allowNull: false,
        comment: 'Payment method',
      },
      exchangeRatio: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
        comment: 'Stock exchange ratio',
      },
      cashComponent: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cash component of consideration',
      },
      stockComponent: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Stock component of consideration',
      },
      synergies: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Synergy assumptions',
      },
      proFormaFinancials: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Pro forma combined financials',
      },
      accretionDilution: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Accretion/dilution analysis',
      },
      combinedMetrics: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Combined company metrics',
      },
      premiumPaid: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Premium paid over market value',
      },
      premiumPercent: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Premium percentage',
      },
      dealMultiples: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Deal valuation multiples',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'approved', 'announced', 'closed', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Model status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Creator identifier',
      },
    },
    {
      sequelize,
      tableName: 'merger_models',
      timestamps: true,
      indexes: [
        { fields: ['mergerId'], unique: true },
        { fields: ['acquirorCompany'] },
        { fields: ['targetCompany'] },
        { fields: ['paymentMethod'] },
        { fields: ['status'] },
        { fields: ['createdBy'] },
      ],
    },
  );

  return MergerModel;
};

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export class CreateFinancialModelDto {
  @ApiProperty({ description: 'Model name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  modelName!: string;

  @ApiProperty({ description: 'Company identifier' })
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ enum: ModelingMethodology, description: 'Valuation methodology' })
  @IsEnum(ModelingMethodology)
  methodology!: ModelingMethodology;

  @ApiProperty({ description: 'Valuation date' })
  @Type(() => Date)
  @IsDate()
  valuationDate!: Date;

  @ApiProperty({ description: 'Fiscal year end date' })
  @Type(() => Date)
  @IsDate()
  fiscalYearEnd!: Date;

  @ApiProperty({ description: 'Number of projection years' })
  @IsNumber()
  @Min(1)
  @Max(20)
  projectionYears!: number;

  @ApiProperty({ description: 'Base year for projections' })
  @IsNumber()
  baseYear!: number;

  @ApiProperty({ description: 'Currency code (ISO 4217)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ description: 'Model assumptions' })
  @IsNotEmpty()
  assumptions!: ModelAssumptions;

  @ApiProperty({ description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  createdBy!: string;
}

export class UpdateModelAssumptionsDto {
  @ApiProperty({ description: 'Revenue growth rates by year', required: false })
  @IsArray()
  @IsOptional()
  revenueGrowthRates?: number[];

  @ApiProperty({ description: 'EBITDA margins by year', required: false })
  @IsArray()
  @IsOptional()
  ebitdaMargins?: number[];

  @ApiProperty({ description: 'Tax rate', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  taxRate?: number;

  @ApiProperty({ description: 'Discount rate (WACC)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  discountRate?: number;

  @ApiProperty({ description: 'Terminal growth rate', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(0.1)
  terminalGrowthRate?: number;

  @ApiProperty({ description: 'Terminal multiple', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  terminalMultiple?: number;

  @ApiProperty({ description: 'CapEx as % of revenue by year', required: false })
  @IsArray()
  @IsOptional()
  capexAsPercentRevenue?: number[];

  @ApiProperty({ description: 'NWC as % of revenue by year', required: false })
  @IsArray()
  @IsOptional()
  nwcAsPercentRevenue?: number[];
}

export class RunSensitivityAnalysisDto {
  @ApiProperty({ description: 'Model ID' })
  @IsString()
  @IsNotEmpty()
  modelId!: string;

  @ApiProperty({ enum: SensitivityParameter, description: 'Parameter to analyze' })
  @IsEnum(SensitivityParameter)
  parameter!: SensitivityParameter;

  @ApiProperty({ description: 'Range minimum value' })
  @IsNumber()
  rangeMin!: number;

  @ApiProperty({ description: 'Range maximum value' })
  @IsNumber()
  rangeMax!: number;

  @ApiProperty({ description: 'Step size' })
  @IsNumber()
  @Min(0.0001)
  step!: number;
}

export class CreateScenarioDto {
  @ApiProperty({ description: 'Model ID' })
  @IsString()
  @IsNotEmpty()
  modelId!: string;

  @ApiProperty({ description: 'Scenario name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  scenarioName!: string;

  @ApiProperty({ enum: ScenarioType, description: 'Scenario type' })
  @IsEnum(ScenarioType)
  scenarioType!: ScenarioType;

  @ApiProperty({ description: 'Probability (0-1)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  probability?: number;

  @ApiProperty({ description: 'Modified assumptions' })
  @IsNotEmpty()
  assumptions!: Partial<ModelAssumptions>;
}

export class CalculateNPVDto {
  @ApiProperty({ description: 'Cash flows array' })
  @IsArray()
  @IsNotEmpty()
  cashFlows!: number[];

  @ApiProperty({ description: 'Discount rate' })
  @IsNumber()
  @Min(0)
  @Max(1)
  discountRate!: number;

  @ApiProperty({ description: 'Initial investment', required: false })
  @IsNumber()
  @IsOptional()
  initialInvestment?: number;
}

export class CalculateIRRDto {
  @ApiProperty({ description: 'Cash flows array' })
  @IsArray()
  @IsNotEmpty()
  cashFlows!: number[];

  @ApiProperty({ description: 'Reinvestment rate for MIRR', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  reinvestmentRate?: number;

  @ApiProperty({ description: 'Finance rate for MIRR', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  financeRate?: number;
}

export class CalculateWACCDto {
  @ApiProperty({ description: 'Cost of equity' })
  @IsNumber()
  @Min(0)
  @Max(1)
  costOfEquity!: number;

  @ApiProperty({ description: 'Cost of debt (pre-tax)' })
  @IsNumber()
  @Min(0)
  @Max(1)
  costOfDebt!: number;

  @ApiProperty({ description: 'Market value of equity' })
  @IsNumber()
  @Min(0)
  marketValueEquity!: number;

  @ApiProperty({ description: 'Market value of debt' })
  @IsNumber()
  @Min(0)
  marketValueDebt!: number;

  @ApiProperty({ description: 'Corporate tax rate' })
  @IsNumber()
  @Min(0)
  @Max(1)
  taxRate!: number;
}

export class CreateLBOModelDto {
  @ApiProperty({ description: 'Model name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  modelName!: string;

  @ApiProperty({ description: 'Target company name' })
  @IsString()
  @IsNotEmpty()
  targetCompany!: string;

  @ApiProperty({ description: 'PE sponsor name' })
  @IsString()
  @IsNotEmpty()
  sponsor!: string;

  @ApiProperty({ description: 'Purchase price' })
  @IsNumber()
  @Min(0)
  purchasePrice!: number;

  @ApiProperty({ description: 'Equity contribution' })
  @IsNumber()
  @Min(0)
  equityContribution!: number;

  @ApiProperty({ description: 'Entry EV/EBITDA multiple' })
  @IsNumber()
  @Min(0)
  entryMultiple!: number;

  @ApiProperty({ description: 'Exit EV/EBITDA multiple' })
  @IsNumber()
  @Min(0)
  exitMultiple!: number;

  @ApiProperty({ description: 'Holding period (years)' })
  @IsNumber()
  @Min(1)
  @Max(10)
  holdingPeriod!: number;

  @ApiProperty({ description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  createdBy!: string;
}

export class CalculateBreakEvenDto {
  @ApiProperty({ description: 'Fixed costs' })
  @IsNumber()
  @Min(0)
  fixedCosts!: number;

  @ApiProperty({ description: 'Variable cost per unit' })
  @IsNumber()
  @Min(0)
  variableCostPerUnit!: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  @Min(0)
  pricePerUnit!: number;

  @ApiProperty({ description: 'Current sales units', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  currentUnits?: number;
}

// ============================================================================
// DCF VALUATION FUNCTIONS
// ============================================================================

/**
 * Calculate Net Present Value (NPV) of cash flows.
 *
 * @param {number[]} cashFlows - Array of cash flows (including initial investment as negative)
 * @param {number} discountRate - Discount rate (WACC)
 * @param {number} initialInvestment - Initial investment (optional, can be in cashFlows)
 * @returns {NPVAnalysis} NPV analysis results
 *
 * @example
 * ```typescript
 * const npv = calculateNPV([-1000000, 300000, 350000, 400000, 450000, 500000], 0.10);
 * console.log(`NPV: $${npv.npv.toLocaleString()}`);
 * console.log(`Profitability Index: ${npv.profitabilityIndex.toFixed(2)}`);
 * console.log(`Payback Period: ${npv.paybackPeriod.toFixed(2)} years`);
 * ```
 */
export function calculateNPV(
  cashFlows: number[],
  discountRate: number,
  initialInvestment?: number,
): NPVAnalysis {
  try {
    const flows = initialInvestment !== undefined ? [-initialInvestment, ...cashFlows] : cashFlows;

    let npv = 0;
    let cumulativeCashFlow = 0;
    let cumulativeDiscountedCashFlow = 0;
    let paybackPeriod = -1;
    let discountedPaybackPeriod = -1;

    for (let i = 0; i < flows.length; i++) {
      const discountedCashFlow = flows[i] / Math.pow(1 + discountRate, i);
      npv += discountedCashFlow;

      cumulativeCashFlow += flows[i];
      cumulativeDiscountedCashFlow += discountedCashFlow;

      // Calculate payback period
      if (paybackPeriod === -1 && cumulativeCashFlow >= 0 && i > 0) {
        const previousCumulative = cumulativeCashFlow - flows[i];
        paybackPeriod = i - 1 + Math.abs(previousCumulative) / flows[i];
      }

      // Calculate discounted payback period
      if (discountedPaybackPeriod === -1 && cumulativeDiscountedCashFlow >= 0 && i > 0) {
        const previousDiscountedCumulative = cumulativeDiscountedCashFlow - discountedCashFlow;
        discountedPaybackPeriod = i - 1 + Math.abs(previousDiscountedCumulative) / discountedCashFlow;
      }
    }

    const investment = Math.abs(flows[0]);
    const profitabilityIndex = investment > 0 ? (npv + investment) / investment : 0;

    return {
      cashFlows: flows,
      discountRate,
      initialInvestment: investment,
      npv,
      profitabilityIndex,
      paybackPeriod: paybackPeriod === -1 ? flows.length : paybackPeriod,
      discountedPaybackPeriod: discountedPaybackPeriod === -1 ? flows.length : discountedPaybackPeriod,
    };
  } catch (error) {
    throw new Error(`Failed to calculate NPV: ${error.message}`);
  }
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method.
 *
 * @param {number[]} cashFlows - Array of cash flows
 * @param {number} reinvestmentRate - Reinvestment rate for MIRR (optional)
 * @param {number} financeRate - Finance rate for MIRR (optional)
 * @returns {IRRAnalysis} IRR analysis results
 *
 * @example
 * ```typescript
 * const irr = calculateIRR([-1000000, 300000, 350000, 400000, 450000, 500000], 0.10, 0.08);
 * console.log(`IRR: ${(irr.irr * 100).toFixed(2)}%`);
 * console.log(`MIRR: ${(irr.mirr * 100).toFixed(2)}%`);
 * console.log(`Investment Multiple: ${irr.investmentMultiple.toFixed(2)}x`);
 * ```
 */
export function calculateIRR(
  cashFlows: number[],
  reinvestmentRate: number = 0.10,
  financeRate: number = 0.08,
): IRRAnalysis {
  try {
    // Calculate IRR using Newton-Raphson method
    let irr = 0.1; // Initial guess
    const maxIterations = 100;
    const tolerance = 0.00001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;

      for (let j = 0; j < cashFlows.length; j++) {
        const factor = Math.pow(1 + irr, j);
        npv += cashFlows[j] / factor;
        dnpv -= (j * cashFlows[j]) / (factor * (1 + irr));
      }

      const newIrr = irr - npv / dnpv;

      if (Math.abs(newIrr - irr) < tolerance) {
        irr = newIrr;
        break;
      }

      irr = newIrr;
    }

    // Calculate MIRR (Modified IRR)
    let negativeCashFlowsPV = 0;
    let positiveCashFlowsFV = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      if (cashFlows[i] < 0) {
        negativeCashFlowsPV += cashFlows[i] / Math.pow(1 + financeRate, i);
      } else {
        positiveCashFlowsFV += cashFlows[i] * Math.pow(1 + reinvestmentRate, cashFlows.length - 1 - i);
      }
    }

    const mirr = Math.pow(
      -positiveCashFlowsFV / negativeCashFlowsPV,
      1 / (cashFlows.length - 1),
    ) - 1;

    // Calculate investment multiple
    const initialInvestment = Math.abs(cashFlows[0]);
    const totalCashReturned = cashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0);
    const investmentMultiple = initialInvestment > 0 ? totalCashReturned / initialInvestment : 0;

    // Calculate annualized return
    const years = cashFlows.length - 1;
    const annualizedReturn = Math.pow(investmentMultiple, 1 / years) - 1;

    return {
      cashFlows,
      irr,
      mirr,
      reinvestmentRate,
      financeRate,
      investmentMultiple,
      annualizedReturn,
    };
  } catch (error) {
    throw new Error(`Failed to calculate IRR: ${error.message}`);
  }
}

/**
 * Calculate Weighted Average Cost of Capital (WACC).
 *
 * @param {WACCComponents} components - WACC components
 * @returns {WACCComponents} Complete WACC calculation
 *
 * @example
 * ```typescript
 * const wacc = calculateWACC({
 *   costOfEquity: 0.12,
 *   costOfDebt: 0.06,
 *   marketValueEquity: 8000000,
 *   marketValueDebt: 2000000,
 *   taxRate: 0.25
 * });
 * console.log(`WACC: ${(wacc.wacc * 100).toFixed(2)}%`);
 * ```
 */
export function calculateWACC(components: Partial<WACCComponents>): WACCComponents {
  try {
    const {
      costOfEquity,
      costOfDebt,
      marketValueEquity,
      marketValueDebt,
      taxRate,
    } = components;

    if (!costOfEquity || !costOfDebt || !marketValueEquity || !marketValueDebt || taxRate === undefined) {
      throw new Error('Missing required WACC components');
    }

    const totalCapital = marketValueEquity + marketValueDebt;
    const equityWeight = marketValueEquity / totalCapital;
    const debtWeight = marketValueDebt / totalCapital;

    const wacc = (costOfEquity * equityWeight) + (costOfDebt * (1 - taxRate) * debtWeight);

    const debtToEquity = marketValueDebt / marketValueEquity;
    const debtToCapital = marketValueDebt / totalCapital;

    return {
      costOfEquity,
      costOfDebt,
      marketValueEquity,
      marketValueDebt,
      taxRate,
      wacc,
      debtToEquity,
      debtToCapital,
    };
  } catch (error) {
    throw new Error(`Failed to calculate WACC: ${error.message}`);
  }
}

/**
 * Perform comprehensive DCF valuation.
 *
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @param {number} terminalGrowthRate - Terminal growth rate
 * @param {number} discountRate - Discount rate (WACC)
 * @param {number} terminalMultiple - Exit multiple (optional)
 * @param {TerminalValueMethod} method - Terminal value calculation method
 * @returns {ValuationResult} Complete valuation results
 *
 * @example
 * ```typescript
 * const valuation = performDCFValuation(
 *   cashFlowProjections,
 *   0.03,
 *   0.10,
 *   12.0,
 *   TerminalValueMethod.EXIT_MULTIPLE
 * );
 * console.log(`Enterprise Value: $${valuation.enterpriseValue.toLocaleString()}`);
 * console.log(`Equity Value: $${valuation.equityValue.toLocaleString()}`);
 * console.log(`Value per Share: $${valuation.valuePerShare.toFixed(2)}`);
 * ```
 */
export function performDCFValuation(
  projections: CashFlowProjection[],
  terminalGrowthRate: number,
  discountRate: number,
  terminalMultiple?: number,
  method: TerminalValueMethod = TerminalValueMethod.PERPETUITY_GROWTH,
): Partial<ValuationResult> {
  try {
    // Calculate present value of projected cash flows
    let projectedCashFlowsPV = 0;
    projections.forEach((proj) => {
      const discountFactor = 1 / Math.pow(1 + discountRate, proj.year);
      projectedCashFlowsPV += proj.freeCashFlow * discountFactor;
    });

    // Calculate terminal value
    const lastProjection = projections[projections.length - 1];
    let terminalValue = 0;

    if (method === TerminalValueMethod.PERPETUITY_GROWTH) {
      // Gordon Growth Model
      const terminalFCF = lastProjection.freeCashFlow * (1 + terminalGrowthRate);
      terminalValue = terminalFCF / (discountRate - terminalGrowthRate);
    } else if (method === TerminalValueMethod.EXIT_MULTIPLE && terminalMultiple) {
      // Exit Multiple Method
      terminalValue = lastProjection.ebitda * terminalMultiple;
    }

    // Discount terminal value to present
    const terminalDiscountFactor = 1 / Math.pow(1 + discountRate, projections.length);
    const terminalValuePV = terminalValue * terminalDiscountFactor;

    // Calculate enterprise value
    const enterpriseValue = projectedCashFlowsPV + terminalValuePV;

    return {
      methodology: ModelingMethodology.DCF,
      enterpriseValue,
      terminalValue,
      terminalValuePV,
      projectedCashFlowsPV,
      wacc: discountRate,
    };
  } catch (error) {
    throw new Error(`Failed to perform DCF valuation: ${error.message}`);
  }
}

/**
 * Calculate terminal value using perpetuity growth method.
 *
 * @param {number} finalYearFCF - Final year free cash flow
 * @param {number} terminalGrowthRate - Terminal growth rate (g)
 * @param {number} discountRate - Discount rate (WACC)
 * @returns {number} Terminal value
 *
 * @example
 * ```typescript
 * const tv = calculateTerminalValuePerpetualGrowth(500000, 0.03, 0.10);
 * console.log(`Terminal Value: $${tv.toLocaleString()}`);
 * ```
 */
export function calculateTerminalValuePerpetualGrowth(
  finalYearFCF: number,
  terminalGrowthRate: number,
  discountRate: number,
): number {
  try {
    if (discountRate <= terminalGrowthRate) {
      throw new Error('Discount rate must be greater than terminal growth rate');
    }

    const terminalFCF = finalYearFCF * (1 + terminalGrowthRate);
    return terminalFCF / (discountRate - terminalGrowthRate);
  } catch (error) {
    throw new Error(`Failed to calculate terminal value: ${error.message}`);
  }
}

/**
 * Calculate terminal value using exit multiple method.
 *
 * @param {number} finalYearMetric - Final year metric (EBITDA, EBIT, Revenue)
 * @param {number} exitMultiple - Exit multiple
 * @returns {number} Terminal value
 *
 * @example
 * ```typescript
 * const tv = calculateTerminalValueExitMultiple(2500000, 12.0);
 * console.log(`Terminal Value: $${tv.toLocaleString()}`);
 * ```
 */
export function calculateTerminalValueExitMultiple(
  finalYearMetric: number,
  exitMultiple: number,
): number {
  try {
    return finalYearMetric * exitMultiple;
  } catch (error) {
    throw new Error(`Failed to calculate terminal value: ${error.message}`);
  }
}

/**
 * Calculate enterprise value to equity value bridge.
 *
 * @param {number} enterpriseValue - Enterprise value
 * @param {number} totalDebt - Total debt
 * @param {number} cash - Cash and equivalents
 * @param {number} minorityInterest - Minority interest
 * @param {number} preferredStock - Preferred stock
 * @returns {number} Equity value
 *
 * @example
 * ```typescript
 * const equityValue = calculateEquityValue(50000000, 10000000, 5000000, 500000, 0);
 * console.log(`Equity Value: $${equityValue.toLocaleString()}`);
 * ```
 */
export function calculateEquityValue(
  enterpriseValue: number,
  totalDebt: number,
  cash: number,
  minorityInterest: number = 0,
  preferredStock: number = 0,
): number {
  try {
    return enterpriseValue - totalDebt + cash - minorityInterest - preferredStock;
  } catch (error) {
    throw new Error(`Failed to calculate equity value: ${error.message}`);
  }
}

// ============================================================================
// SENSITIVITY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Perform sensitivity analysis on a single parameter.
 *
 * @param {string} modelId - Financial model ID
 * @param {SensitivityParameter} parameter - Parameter to analyze
 * @param {number} baseValue - Base case value
 * @param {number} rangeMin - Minimum range value
 * @param {number} rangeMax - Maximum range value
 * @param {number} step - Step size
 * @param {Function} valuationFunction - Valuation function to call
 * @returns {Promise<SensitivityResult>} Sensitivity analysis results
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(
 *   'model-123',
 *   SensitivityParameter.DISCOUNT_RATE,
 *   0.10,
 *   0.08,
 *   0.12,
 *   0.005,
 *   valuationFunc
 * );
 * ```
 */
export async function performSensitivityAnalysis(
  modelId: string,
  parameter: SensitivityParameter,
  baseValue: number,
  rangeMin: number,
  rangeMax: number,
  step: number,
  valuationFunction: (paramValue: number) => Promise<Partial<ValuationResult>>,
): Promise<SensitivityResult> {
  try {
    const results: SensitivityDataPoint[] = [];
    const baseValuation = await valuationFunction(baseValue);
    const baseEquityValue = baseValuation.equityValue || 0;
    const baseValuePerShare = baseValuation.valuePerShare || 0;

    let currentValue = rangeMin;
    while (currentValue <= rangeMax) {
      const valuation = await valuationFunction(currentValue);
      const equityValue = valuation.equityValue || 0;
      const valuePerShare = valuation.valuePerShare || 0;

      results.push({
        parameterValue: currentValue,
        equityValue,
        valuePerShare,
        variance: equityValue - baseEquityValue,
        variancePercent: ((equityValue - baseEquityValue) / baseEquityValue) * 100,
      });

      currentValue += step;
    }

    // Generate tornado chart data
    const downsideCase = results[0];
    const upsideCase = results[results.length - 1];
    const tornado: TornadoChartData = {
      parameter,
      baseCase: baseEquityValue,
      downsideValue: downsideCase.equityValue,
      upsideValue: upsideCase.equityValue,
      downsideImpact: downsideCase.equityValue - baseEquityValue,
      upsideImpact: upsideCase.equityValue - baseEquityValue,
      totalSwing: upsideCase.equityValue - downsideCase.equityValue,
    };

    return {
      parameter,
      baseValue,
      rangeMin,
      rangeMax,
      step,
      results,
      tornado,
    };
  } catch (error) {
    throw new Error(`Failed to perform sensitivity analysis: ${error.message}`);
  }
}

/**
 * Perform two-way sensitivity analysis (data table).
 *
 * @param {SensitivityParameter} param1 - First parameter
 * @param {number[]} param1Values - First parameter values
 * @param {SensitivityParameter} param2 - Second parameter
 * @param {number[]} param2Values - Second parameter values
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<Record<string, any>>} Two-way sensitivity table
 *
 * @example
 * ```typescript
 * const table = await performTwoWaySensitivity(
 *   SensitivityParameter.DISCOUNT_RATE,
 *   [0.08, 0.09, 0.10, 0.11, 0.12],
 *   SensitivityParameter.TERMINAL_GROWTH,
 *   [0.02, 0.025, 0.03, 0.035, 0.04],
 *   valuationFunc
 * );
 * ```
 */
export async function performTwoWaySensitivity(
  param1: SensitivityParameter,
  param1Values: number[],
  param2: SensitivityParameter,
  param2Values: number[],
  valuationFunction: (p1: number, p2: number) => Promise<number>,
): Promise<Record<string, any>> {
  try {
    const table: number[][] = [];

    for (const p1Value of param1Values) {
      const row: number[] = [];
      for (const p2Value of param2Values) {
        const value = await valuationFunction(p1Value, p2Value);
        row.push(value);
      }
      table.push(row);
    }

    return {
      param1,
      param1Values,
      param2,
      param2Values,
      table,
    };
  } catch (error) {
    throw new Error(`Failed to perform two-way sensitivity: ${error.message}`);
  }
}

/**
 * Generate tornado chart data for multiple parameters.
 *
 * @param {string} modelId - Financial model ID
 * @param {SensitivityParameter[]} parameters - Parameters to analyze
 * @param {Record<string, number>} baseValues - Base case values for each parameter
 * @param {number} variationPercent - Variation percentage (e.g., 0.10 for ±10%)
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<TornadoChartData[]>} Tornado chart data sorted by impact
 *
 * @example
 * ```typescript
 * const tornado = await generateTornadoChart(
 *   'model-123',
 *   [SensitivityParameter.REVENUE_GROWTH, SensitivityParameter.MARGIN],
 *   { 'revenue-growth': 0.10, 'margin': 0.25 },
 *   0.10,
 *   valuationFunc
 * );
 * ```
 */
export async function generateTornadoChart(
  modelId: string,
  parameters: SensitivityParameter[],
  baseValues: Record<string, number>,
  variationPercent: number,
  valuationFunction: (paramValues: Record<string, number>) => Promise<number>,
): Promise<TornadoChartData[]> {
  try {
    const baseCase = await valuationFunction(baseValues);
    const tornadoData: TornadoChartData[] = [];

    for (const param of parameters) {
      const baseValue = baseValues[param];

      // Downside case
      const downsideValues = { ...baseValues };
      downsideValues[param] = baseValue * (1 - variationPercent);
      const downsideValue = await valuationFunction(downsideValues);

      // Upside case
      const upsideValues = { ...baseValues };
      upsideValues[param] = baseValue * (1 + variationPercent);
      const upsideValue = await valuationFunction(upsideValues);

      tornadoData.push({
        parameter: param,
        baseCase,
        downsideValue,
        upsideValue,
        downsideImpact: downsideValue - baseCase,
        upsideImpact: upsideValue - baseCase,
        totalSwing: Math.abs(upsideValue - downsideValue),
      });
    }

    // Sort by total swing (highest impact first)
    tornadoData.sort((a, b) => b.totalSwing - a.totalSwing);

    return tornadoData;
  } catch (error) {
    throw new Error(`Failed to generate tornado chart: ${error.message}`);
  }
}

// ============================================================================
// SCENARIO MODELING FUNCTIONS
// ============================================================================

/**
 * Create and analyze multiple scenarios.
 *
 * @param {string} modelId - Financial model ID
 * @param {ModelAssumptions} baseAssumptions - Base case assumptions
 * @param {Partial<ModelAssumptions>[]} scenarioAssumptions - Scenario-specific assumptions
 * @param {ScenarioType[]} scenarioTypes - Scenario types
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<ScenarioAnalysis[]>} Scenario analysis results
 *
 * @example
 * ```typescript
 * const scenarios = await createScenarioAnalysis(
 *   'model-123',
 *   baseAssumptions,
 *   [optimisticAssumptions, pessimisticAssumptions],
 *   [ScenarioType.BEST_CASE, ScenarioType.WORST_CASE],
 *   valuationFunc
 * );
 * ```
 */
export async function createScenarioAnalysis(
  modelId: string,
  baseAssumptions: ModelAssumptions,
  scenarioAssumptions: Partial<ModelAssumptions>[],
  scenarioTypes: ScenarioType[],
  valuationFunction: (assumptions: ModelAssumptions) => Promise<ValuationResult>,
): Promise<ScenarioAnalysis[]> {
  try {
    const baseValuation = await valuationFunction(baseAssumptions);
    const scenarios: ScenarioAnalysis[] = [];

    for (let i = 0; i < scenarioAssumptions.length; i++) {
      const mergedAssumptions = { ...baseAssumptions, ...scenarioAssumptions[i] };
      const valuation = await valuationFunction(mergedAssumptions);

      const variance = valuation.equityValue - baseValuation.equityValue;
      const variancePercent = (variance / baseValuation.equityValue) * 100;

      scenarios.push({
        scenarioId: `scenario-${i + 1}`,
        scenarioName: scenarioTypes[i],
        scenarioType: scenarioTypes[i],
        probability: getProbabilityForScenario(scenarioTypes[i]),
        assumptions: scenarioAssumptions[i],
        valuation,
        variance,
        variancePercent,
      });
    }

    return scenarios;
  } catch (error) {
    throw new Error(`Failed to create scenario analysis: ${error.message}`);
  }
}

/**
 * Calculate probability-weighted expected value across scenarios.
 *
 * @param {ScenarioAnalysis[]} scenarios - Scenario analyses
 * @returns {number} Expected value
 *
 * @example
 * ```typescript
 * const expectedValue = calculateExpectedValue(scenarios);
 * console.log(`Expected Value: $${expectedValue.toLocaleString()}`);
 * ```
 */
export function calculateExpectedValue(scenarios: ScenarioAnalysis[]): number {
  try {
    let expectedValue = 0;
    let totalProbability = 0;

    scenarios.forEach((scenario) => {
      expectedValue += scenario.valuation.equityValue * scenario.probability;
      totalProbability += scenario.probability;
    });

    // Normalize if probabilities don't sum to 1
    if (totalProbability > 0 && Math.abs(totalProbability - 1) > 0.01) {
      expectedValue = expectedValue / totalProbability;
    }

    return expectedValue;
  } catch (error) {
    throw new Error(`Failed to calculate expected value: ${error.message}`);
  }
}

/**
 * Perform Monte Carlo simulation for valuation.
 *
 * @param {string} modelId - Financial model ID
 * @param {ModelAssumptions} baseAssumptions - Base assumptions
 * @param {Record<string, { mean: number; stdDev: number }>} distributions - Parameter distributions
 * @param {number} simulations - Number of simulations
 * @param {Function} valuationFunction - Valuation function
 * @returns {Promise<Record<string, any>>} Monte Carlo results
 *
 * @example
 * ```typescript
 * const monteCarlo = await performMonteCarloSimulation(
 *   'model-123',
 *   baseAssumptions,
 *   {
 *     revenueGrowth: { mean: 0.10, stdDev: 0.05 },
 *     ebitdaMargin: { mean: 0.25, stdDev: 0.03 }
 *   },
 *   10000,
 *   valuationFunc
 * );
 * ```
 */
export async function performMonteCarloSimulation(
  modelId: string,
  baseAssumptions: ModelAssumptions,
  distributions: Record<string, { mean: number; stdDev: number }>,
  simulations: number,
  valuationFunction: (assumptions: ModelAssumptions) => Promise<number>,
): Promise<Record<string, any>> {
  try {
    const results: number[] = [];

    for (let i = 0; i < simulations; i++) {
      const simulatedAssumptions = { ...baseAssumptions };

      // Apply random variations based on distributions
      Object.keys(distributions).forEach((param) => {
        const { mean, stdDev } = distributions[param];
        const randomValue = generateNormalRandom(mean, stdDev);

        // Update the specific assumption parameter
        if (param in simulatedAssumptions) {
          (simulatedAssumptions as any)[param] = randomValue;
        }
      });

      const value = await valuationFunction(simulatedAssumptions);
      results.push(value);
    }

    // Calculate statistics
    results.sort((a, b) => a - b);
    const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
    const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);

    const p10 = results[Math.floor(simulations * 0.10)];
    const p25 = results[Math.floor(simulations * 0.25)];
    const p50 = results[Math.floor(simulations * 0.50)];
    const p75 = results[Math.floor(simulations * 0.75)];
    const p90 = results[Math.floor(simulations * 0.90)];

    return {
      simulations,
      mean,
      stdDev,
      min: results[0],
      max: results[results.length - 1],
      p10,
      p25,
      p50,
      p75,
      p90,
      results: results.slice(0, 1000), // Return first 1000 for distribution plotting
    };
  } catch (error) {
    throw new Error(`Failed to perform Monte Carlo simulation: ${error.message}`);
  }
}

// ============================================================================
// VALUATION MULTIPLES FUNCTIONS
// ============================================================================

/**
 * Calculate implied valuation multiples.
 *
 * @param {number} enterpriseValue - Enterprise value
 * @param {number} equityValue - Equity value
 * @param {IncomeStatement} financials - Financial metrics
 * @returns {ImpliedMultiples} Implied multiples
 *
 * @example
 * ```typescript
 * const multiples = calculateImpliedMultiples(50000000, 45000000, incomeStatement);
 * console.log(`EV/EBITDA: ${multiples.evToEbitda.toFixed(2)}x`);
 * console.log(`P/E Ratio: ${multiples.peRatio.toFixed(2)}x`);
 * ```
 */
export function calculateImpliedMultiples(
  enterpriseValue: number,
  equityValue: number,
  financials: IncomeStatement,
): ImpliedMultiples {
  try {
    return {
      evToRevenue: financials.revenue > 0 ? enterpriseValue / financials.revenue : 0,
      evToEbitda: financials.ebitda > 0 ? enterpriseValue / financials.ebitda : 0,
      evToEbit: financials.ebit > 0 ? enterpriseValue / financials.ebit : 0,
      peRatio: financials.netIncome > 0 ? equityValue / financials.netIncome : 0,
      pbRatio: 0, // Would need book value from balance sheet
      priceToSales: financials.revenue > 0 ? equityValue / financials.revenue : 0,
      evToFCF: 0, // Would need FCF calculation
    };
  } catch (error) {
    throw new Error(`Failed to calculate implied multiples: ${error.message}`);
  }
}

/**
 * Perform comparable company analysis.
 *
 * @param {ComparableCompany[]} comparables - Comparable companies
 * @param {IncomeStatement} targetFinancials - Target company financials
 * @param {string[]} primaryMetrics - Primary metrics to use
 * @returns {Record<string, any>} Comparable company valuation
 *
 * @example
 * ```typescript
 * const compAnalysis = performComparableCompanyAnalysis(
 *   comparableCompanies,
 *   targetFinancials,
 *   ['evToEbitda', 'evToRevenue']
 * );
 * ```
 */
export function performComparableCompanyAnalysis(
  comparables: ComparableCompany[],
  targetFinancials: IncomeStatement,
  primaryMetrics: string[] = ['evToEbitda'],
): Record<string, any> {
  try {
    const statistics: Record<string, any> = {};

    primaryMetrics.forEach((metric) => {
      const values = comparables.map((comp) => (comp as any)[metric]).filter((v) => v > 0);

      if (values.length === 0) {
        statistics[metric] = { mean: 0, median: 0, min: 0, max: 0 };
        return;
      }

      values.sort((a, b) => a - b);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const median = values[Math.floor(values.length / 2)];
      const min = values[0];
      const max = values[values.length - 1];

      statistics[metric] = { mean, median, min, max, values };
    });

    // Calculate implied valuations
    const impliedValuations: Record<string, number> = {};

    if (statistics.evToEbitda && targetFinancials.ebitda) {
      impliedValuations.evFromEbitdaMean = statistics.evToEbitda.mean * targetFinancials.ebitda;
      impliedValuations.evFromEbitdaMedian = statistics.evToEbitda.median * targetFinancials.ebitda;
    }

    if (statistics.evToRevenue && targetFinancials.revenue) {
      impliedValuations.evFromRevenueMean = statistics.evToRevenue.mean * targetFinancials.revenue;
      impliedValuations.evFromRevenueMedian = statistics.evToRevenue.median * targetFinancials.revenue;
    }

    return {
      numberOfComparables: comparables.length,
      statistics,
      impliedValuations,
      comparables,
    };
  } catch (error) {
    throw new Error(`Failed to perform comparable company analysis: ${error.message}`);
  }
}

/**
 * Perform precedent transaction analysis.
 *
 * @param {PrecedentTransaction[]} transactions - Precedent transactions
 * @param {IncomeStatement} targetFinancials - Target company financials
 * @param {Date} cutoffDate - Only include transactions after this date
 * @returns {Record<string, any>} Precedent transaction valuation
 *
 * @example
 * ```typescript
 * const precedents = performPrecedentTransactionAnalysis(
 *   transactions,
 *   targetFinancials,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export function performPrecedentTransactionAnalysis(
  transactions: PrecedentTransaction[],
  targetFinancials: IncomeStatement,
  cutoffDate?: Date,
): Record<string, any> {
  try {
    let relevantTransactions = transactions;

    if (cutoffDate) {
      relevantTransactions = transactions.filter((txn) => txn.announcedDate >= cutoffDate);
    }

    const evToEbitdaValues = relevantTransactions
      .map((txn) => txn.evToEbitda)
      .filter((v) => v > 0);
    const evToRevenueValues = relevantTransactions
      .map((txn) => txn.evToRevenue)
      .filter((v) => v > 0);

    evToEbitdaValues.sort((a, b) => a - b);
    evToRevenueValues.sort((a, b) => a - b);

    const statistics = {
      evToEbitda: {
        mean: evToEbitdaValues.reduce((sum, val) => sum + val, 0) / evToEbitdaValues.length,
        median: evToEbitdaValues[Math.floor(evToEbitdaValues.length / 2)],
        min: evToEbitdaValues[0],
        max: evToEbitdaValues[evToEbitdaValues.length - 1],
      },
      evToRevenue: {
        mean: evToRevenueValues.reduce((sum, val) => sum + val, 0) / evToRevenueValues.length,
        median: evToRevenueValues[Math.floor(evToRevenueValues.length / 2)],
        min: evToRevenueValues[0],
        max: evToRevenueValues[evToRevenueValues.length - 1],
      },
    };

    const impliedValuations = {
      evFromEbitdaMean: statistics.evToEbitda.mean * targetFinancials.ebitda,
      evFromEbitdaMedian: statistics.evToEbitda.median * targetFinancials.ebitda,
      evFromRevenueMean: statistics.evToRevenue.mean * targetFinancials.revenue,
      evFromRevenueMedian: statistics.evToRevenue.median * targetFinancials.revenue,
    };

    return {
      numberOfTransactions: relevantTransactions.length,
      statistics,
      impliedValuations,
      transactions: relevantTransactions,
    };
  } catch (error) {
    throw new Error(`Failed to perform precedent transaction analysis: ${error.message}`);
  }
}

// ============================================================================
// LBO MODELING FUNCTIONS
// ============================================================================

/**
 * Build comprehensive LBO model.
 *
 * @param {string} targetCompany - Target company name
 * @param {number} purchasePrice - Purchase price
 * @param {number} equityContribution - Equity contribution
 * @param {number} entryMultiple - Entry EV/EBITDA multiple
 * @param {number} exitMultiple - Exit EV/EBITDA multiple
 * @param {number} holdingPeriod - Holding period in years
 * @param {CashFlowProjection[]} projections - Cash flow projections
 * @returns {LBOModel} Complete LBO model
 *
 * @example
 * ```typescript
 * const lbo = buildLBOModel(
 *   'TargetCo',
 *   100000000,
 *   30000000,
 *   10.0,
 *   12.0,
 *   5,
 *   cashFlowProjections
 * );
 * console.log(`IRR: ${(lbo.irr * 100).toFixed(2)}%`);
 * console.log(`MOIC: ${lbo.moic.toFixed(2)}x`);
 * ```
 */
export function buildLBOModel(
  targetCompany: string,
  purchasePrice: number,
  equityContribution: number,
  entryMultiple: number,
  exitMultiple: number,
  holdingPeriod: number,
  projections: CashFlowProjection[],
): Partial<LBOModel> {
  try {
    const debtFinancing = purchasePrice - equityContribution;
    const ltv = debtFinancing / purchasePrice;

    // Build debt schedule
    const debtSchedule: DebtSchedule[] = [];
    let remainingDebt = debtFinancing;
    const interestRate = 0.07; // Assumed

    projections.slice(0, holdingPeriod).forEach((proj, index) => {
      const year = index + 1;
      const interestExpense = remainingDebt * interestRate;
      const cashFlowAvailable = proj.freeCashFlow;

      // Mandatory amortization (simplified)
      const requiredAmortization = debtFinancing * 0.05; // 5% annual

      // Optional prepayment with excess cash flow
      const excessCashFlow = Math.max(0, cashFlowAvailable - interestExpense - requiredAmortization);
      const optionalPrepayment = excessCashFlow * 0.50; // 50% cash flow sweep

      const totalPayment = requiredAmortization + optionalPrepayment;
      const beginningBalance = remainingDebt;
      remainingDebt = Math.max(0, remainingDebt - totalPayment);

      debtSchedule.push({
        year,
        beginningBalance,
        cashFlowAvailable,
        requiredAmortization,
        optionalPrepayment,
        totalPayment,
        endingBalance: remainingDebt,
        interestExpense,
      });
    });

    // Calculate exit value
    const exitYearEbitda = projections[holdingPeriod - 1].ebitda;
    const exitEnterpriseValue = exitYearEbitda * exitMultiple;
    const exitDebt = debtSchedule[debtSchedule.length - 1].endingBalance;
    const equityProceeds = exitEnterpriseValue - exitDebt;

    // Calculate returns
    const moic = equityProceeds / equityContribution;
    const irr = Math.pow(moic, 1 / holdingPeriod) - 1;

    // Build cash flow array for IRR calculation
    const cashFlows = [-equityContribution];
    debtSchedule.forEach((schedule) => {
      cashFlows.push(schedule.cashFlowAvailable - schedule.totalPayment - schedule.interestExpense);
    });
    cashFlows[cashFlows.length - 1] += equityProceeds;

    return {
      targetCompany,
      purchasePrice,
      enterpriseValue: purchasePrice,
      equityContribution,
      debtFinancing,
      ltv,
      entryMultiple,
      exitMultiple,
      holdingPeriod,
      exitYear: new Date().getFullYear() + holdingPeriod,
      exitEnterpriseValue,
      equityProceeds,
      moic,
      irr,
      cashFlows,
      debtSchedule,
    };
  } catch (error) {
    throw new Error(`Failed to build LBO model: ${error.message}`);
  }
}

/**
 * Calculate LBO returns attribution.
 *
 * @param {LBOModel} lboModel - LBO model
 * @returns {Record<string, any>} Returns attribution
 *
 * @example
 * ```typescript
 * const attribution = calculateLBOReturnsAttribution(lboModel);
 * console.log(`Multiple expansion: ${attribution.multipleExpansion.toFixed(2)}x`);
 * console.log(`Deleveraging: ${attribution.deleveraging.toFixed(2)}x`);
 * ```
 */
export function calculateLBOReturnsAttribution(lboModel: Partial<LBOModel>): Record<string, any> {
  try {
    if (!lboModel.entryMultiple || !lboModel.exitMultiple || !lboModel.debtSchedule ||
        !lboModel.purchasePrice || !lboModel.equityContribution || !lboModel.exitEnterpriseValue) {
      throw new Error('Missing required LBO model data');
    }

    const multipleExpansion = (lboModel.exitMultiple - lboModel.entryMultiple) / lboModel.entryMultiple;

    const initialDebt = lboModel.purchasePrice - lboModel.equityContribution;
    const finalDebt = lboModel.debtSchedule[lboModel.debtSchedule.length - 1].endingBalance;
    const debtPaydown = initialDebt - finalDebt;
    const deleveraging = debtPaydown / lboModel.equityContribution;

    const ebitdaGrowth = 0; // Would need historical vs exit EBITDA

    return {
      multipleExpansion,
      multipleExpansionContribution: multipleExpansion,
      deleveraging,
      deleveragingContribution: deleveraging,
      ebitdaGrowth,
      ebitdaGrowthContribution: ebitdaGrowth,
      totalReturn: lboModel.moic ? lboModel.moic - 1 : 0,
    };
  } catch (error) {
    throw new Error(`Failed to calculate returns attribution: ${error.message}`);
  }
}

// ============================================================================
// BREAK-EVEN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive break-even analysis.
 *
 * @param {number} fixedCosts - Fixed costs
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @param {number} pricePerUnit - Price per unit
 * @param {number} currentUnits - Current sales units (optional)
 * @returns {BreakEvenAnalysis} Break-even analysis
 *
 * @example
 * ```typescript
 * const breakEven = calculateBreakEvenAnalysis(500000, 25, 50, 30000);
 * console.log(`Break-even units: ${breakEven.breakEvenUnits.toLocaleString()}`);
 * console.log(`Margin of safety: ${(breakEven.marginOfSafety * 100).toFixed(2)}%`);
 * ```
 */
export function calculateBreakEvenAnalysis(
  fixedCosts: number,
  variableCostPerUnit: number,
  pricePerUnit: number,
  currentUnits?: number,
): BreakEvenAnalysis {
  try {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const contributionMarginRatio = contributionMargin / pricePerUnit;

    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    let marginOfSafety = 0;
    let operatingLeverage = 0;

    if (currentUnits) {
      const currentRevenue = currentUnits * pricePerUnit;
      marginOfSafety = (currentRevenue - breakEvenRevenue) / currentRevenue;

      const currentContributionMargin = currentUnits * contributionMargin;
      const currentOperatingIncome = currentContributionMargin - fixedCosts;

      if (currentOperatingIncome > 0) {
        operatingLeverage = currentContributionMargin / currentOperatingIncome;
      }
    }

    return {
      fixedCosts,
      variableCostPerUnit,
      pricePerUnit,
      contributionMargin,
      contributionMarginRatio,
      breakEvenUnits,
      breakEvenRevenue,
      marginOfSafety,
      operatingLeverage,
    };
  } catch (error) {
    throw new Error(`Failed to calculate break-even analysis: ${error.message}`);
  }
}

// ============================================================================
// MERGER & ACQUISITION FUNCTIONS
// ============================================================================

/**
 * Calculate accretion/dilution analysis for merger.
 *
 * @param {number} acquirorEPS - Acquiror standalone EPS
 * @param {number} acquirorShares - Acquiror shares outstanding
 * @param {number} targetEarnings - Target net income
 * @param {number} purchasePrice - Purchase price
 * @param {number} newSharesIssued - New shares issued (for stock deal)
 * @param {number} synergies - Expected synergies
 * @returns {AccretionDilution} Accretion/dilution analysis
 *
 * @example
 * ```typescript
 * const accretion = calculateAccretionDilution(2.50, 100000000, 50000000, 500000000, 20000000, 10000000);
 * console.log(`Accretion/Dilution: ${(accretion.accretionDilutionPercent).toFixed(2)}%`);
 * ```
 */
export function calculateAccretionDilution(
  acquirorEPS: number,
  acquirorShares: number,
  targetEarnings: number,
  purchasePrice: number,
  newSharesIssued: number,
  synergies: number,
): AccretionDilution {
  try {
    const acquirorEarnings = acquirorEPS * acquirorShares;
    const combinedEarnings = acquirorEarnings + targetEarnings + synergies;
    const combinedShares = acquirorShares + newSharesIssued;

    const proFormaEPS = combinedEarnings / combinedShares;
    const accretionDilution = proFormaEPS - acquirorEPS;
    const accretionDilutionPercent = (accretionDilution / acquirorEPS) * 100;

    return {
      year: 1,
      standAloneEPS: acquirorEPS,
      proFormaEPS,
      accretionDilution,
      accretionDilutionPercent,
    };
  } catch (error) {
    throw new Error(`Failed to calculate accretion/dilution: ${error.message}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate normal random variable (Box-Muller transform).
 */
function generateNormalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
}

/**
 * Get default probability for scenario type.
 */
function getProbabilityForScenario(scenarioType: ScenarioType): number {
  const probabilities: Record<ScenarioType, number> = {
    [ScenarioType.BASE_CASE]: 0.50,
    [ScenarioType.BEST_CASE]: 0.15,
    [ScenarioType.WORST_CASE]: 0.10,
    [ScenarioType.DOWNSIDE]: 0.20,
    [ScenarioType.UPSIDE]: 0.20,
    [ScenarioType.CUSTOM]: 0.25,
  };
  return probabilities[scenarioType] || 0.25;
}

/**
 * Generate UUID v4.
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  createFinancialModelModel,
  createValuationComparableModel,
  createLBOModelModel,
  createMergerModelModel,

  // DCF Functions
  calculateNPV,
  calculateIRR,
  calculateWACC,
  performDCFValuation,
  calculateTerminalValuePerpetualGrowth,
  calculateTerminalValueExitMultiple,
  calculateEquityValue,

  // Sensitivity Analysis
  performSensitivityAnalysis,
  performTwoWaySensitivity,
  generateTornadoChart,

  // Scenario Modeling
  createScenarioAnalysis,
  calculateExpectedValue,
  performMonteCarloSimulation,

  // Valuation Multiples
  calculateImpliedMultiples,
  performComparableCompanyAnalysis,
  performPrecedentTransactionAnalysis,

  // LBO Modeling
  buildLBOModel,
  calculateLBOReturnsAttribution,

  // Break-even Analysis
  calculateBreakEvenAnalysis,

  // M&A Functions
  calculateAccretionDilution,
};

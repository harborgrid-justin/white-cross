/**
 * LOC: WC-COMP-TRADING-FUND-001
 * File: /reuse/trading/composites/fundamental-analysis-screening-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../fundamental-analysis-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal integration controllers
 *   - Financial screening services
 *   - Fundamental analysis engines
 *   - Investment research platforms
 */

/**
 * File: /reuse/trading/composites/fundamental-analysis-screening-composite.ts
 * Locator: WC-COMP-TRADING-FUND-001
 * Purpose: Bloomberg Terminal-Level Fundamental Analysis & Screening Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, fundamental-analysis-kit
 * Downstream: Trading controllers, screening services, analysis engines, research platforms
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Swagger 7.x
 * Exports: 45 composed functions for comprehensive fundamental analysis and screening
 *
 * LLM Context: Enterprise-grade fundamental analysis composite for Bloomberg-level trading platform.
 * Provides financial ratio analysis, earnings forecasts, valuation models (DCF, DDM, Gordon Growth),
 * comparable company analysis, economic indicators, industry analysis, ESG scoring, financial health
 * assessment, bankruptcy prediction, and comprehensive screening/filtering capabilities.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';

import {
  BalanceSheet,
  IncomeStatement,
  CashFlowStatement,
  MarketData,
  DCFParameters,
  ValuationResult,
  FinancialHealthScore,
  PeerMetrics,
  calculateCurrentRatio,
  calculateQuickRatio,
  calculateCashRatio,
  calculateWorkingCapital,
  calculateDebtToEquity,
  calculateDebtRatio,
  calculateEquityMultiplier,
  calculateInterestCoverage,
  calculateDebtServiceCoverage,
  calculateGrossProfitMargin,
  calculateOperatingMargin,
  calculateNetProfitMargin,
  calculateEBITDAMargin,
  calculateROA,
  calculateROE,
  calculateROIC,
  calculateAssetTurnover,
  calculateInventoryTurnover,
  calculateDSO,
  calculateDPO,
  calculateCashConversionCycle,
  calculateFreeCashFlow,
  calculateFCFE,
  calculateOCFRatio,
  calculateCashFlowToDebt,
  calculateCashBurnRate,
  calculateRunway,
  calculatePERatio,
  calculatePBRatio,
  calculateEVtoEBITDA,
  calculatePSRatio,
  calculatePEGRatio,
  calculatePriceToCashFlow,
  calculateBasicEPS,
  calculateDilutedEPS,
  calculateEarningsQuality,
  calculateEarningsSurprise,
  calculateNormalizedEarnings,
  calculateCoreEarnings,
  calculateRevenueGrowth,
  calculateEarningsGrowth,
  calculateSustainableGrowthRate,
  calculateCAGR,
  projectFutureGrowth,
  calculateDCF,
  calculateGordonGrowthModel,
  calculateGrahamNumber,
  calculateBenjaminGrahamIntrinsicValue,
  calculateResidualIncomeModel,
  calculateAssetBasedValuation,
  calculateIndustryAverage,
  calculateRelativeValuation,
  analyzePeerComparison,
  calculateMarketCapWeightedAverage,
  calculateRealGDPGrowth,
  adjustForInflation,
  calculateRealInterestRate,
  analyzeCurrencyImpact,
  calculateEmploymentCostImpact,
  analyzeInterestRateSensitivity,
  calculateFinancialHealthScore,
  performDuPontAnalysis,
} from '../fundamental-analysis-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Financial statement period types
 */
export enum StatementPeriod {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  TTM = 'ttm', // Trailing twelve months
}

/**
 * Industry classification
 */
export enum IndustryClassification {
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  FINANCIALS = 'financials',
  CONSUMER_DISCRETIONARY = 'consumer_discretionary',
  CONSUMER_STAPLES = 'consumer_staples',
  ENERGY = 'energy',
  INDUSTRIALS = 'industrials',
  MATERIALS = 'materials',
  UTILITIES = 'utilities',
  REAL_ESTATE = 'real_estate',
  TELECOMMUNICATIONS = 'telecommunications',
}

/**
 * Investment rating
 */
export enum InvestmentRating {
  STRONG_BUY = 'strong_buy',
  BUY = 'buy',
  HOLD = 'hold',
  SELL = 'sell',
  STRONG_SELL = 'strong_sell',
}

/**
 * Screening operator types
 */
export enum ScreeningOperator {
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  EQUALS = 'eq',
  BETWEEN = 'between',
  IN_TOP_PERCENTILE = 'top_percentile',
  IN_BOTTOM_PERCENTILE = 'bottom_percentile',
}

/**
 * Bankruptcy risk level
 */
export enum BankruptcyRisk {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

/**
 * ESG rating
 */
export enum ESGRating {
  AAA = 'AAA',
  AA = 'AA',
  A = 'A',
  BBB = 'BBB',
  BB = 'BB',
  B = 'B',
  CCC = 'CCC',
}

/**
 * Management quality tier
 */
export enum ManagementQuality {
  EXCELLENT = 'excellent',
  ABOVE_AVERAGE = 'above_average',
  AVERAGE = 'average',
  BELOW_AVERAGE = 'below_average',
  POOR = 'poor',
}

// ============================================================================
// SEQUELIZE MODEL: FinancialStatement
// ============================================================================

/**
 * TypeScript interface for FinancialStatement attributes
 */
export interface FinancialStatementAttributes {
  id: string;
  companyId: string;
  ticker: string;
  period: StatementPeriod;
  fiscalYear: number;
  fiscalQuarter: number | null;
  reportDate: Date;
  balanceSheet: BalanceSheet;
  incomeStatement: IncomeStatement;
  cashFlowStatement: CashFlowStatement;
  marketData: MarketData;
  sharesOutstanding: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FinancialStatementCreationAttributes
  extends Optional<FinancialStatementAttributes, 'id' | 'fiscalQuarter' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: FinancialStatement
 * Stores company financial statements and market data
 */
export class FinancialStatement
  extends Model<FinancialStatementAttributes, FinancialStatementCreationAttributes>
  implements FinancialStatementAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  declare id: string;

  @ApiProperty({ description: 'Company identifier' })
  declare companyId: string;

  @ApiProperty({ description: 'Stock ticker symbol' })
  declare ticker: string;

  @ApiProperty({ enum: StatementPeriod })
  declare period: StatementPeriod;

  @ApiProperty({ description: 'Fiscal year' })
  declare fiscalYear: number;

  @ApiPropertyOptional({ description: 'Fiscal quarter (1-4)' })
  declare fiscalQuarter: number | null;

  @ApiProperty({ description: 'Report date' })
  declare reportDate: Date;

  @ApiProperty({ description: 'Balance sheet data' })
  declare balanceSheet: BalanceSheet;

  @ApiProperty({ description: 'Income statement data' })
  declare incomeStatement: IncomeStatement;

  @ApiProperty({ description: 'Cash flow statement data' })
  declare cashFlowStatement: CashFlowStatement;

  @ApiProperty({ description: 'Market data' })
  declare marketData: MarketData;

  @ApiProperty({ description: 'Shares outstanding' })
  declare sharesOutstanding: number;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  @ApiProperty({ description: 'Created by user ID' })
  declare createdBy: string;

  @ApiPropertyOptional({ description: 'Updated by user ID' })
  declare updatedBy: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getAnalyses: HasManyGetAssociationsMixin<CompanyAnalysis>;

  declare static associations: {
    analyses: Association<FinancialStatement, CompanyAnalysis>;
  };

  /**
   * Initialize FinancialStatement with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FinancialStatement {
    FinancialStatement.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        companyId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'company_id',
        },
        ticker: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'ticker',
        },
        period: {
          type: DataTypes.ENUM(...Object.values(StatementPeriod)),
          allowNull: false,
          field: 'period',
        },
        fiscalYear: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'fiscal_year',
        },
        fiscalQuarter: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: { min: 1, max: 4 },
          field: 'fiscal_quarter',
        },
        reportDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'report_date',
        },
        balanceSheet: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'balance_sheet',
        },
        incomeStatement: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'income_statement',
        },
        cashFlowStatement: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'cash_flow_statement',
        },
        marketData: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'market_data',
        },
        sharesOutstanding: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'shares_outstanding',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'financial_statements',
        modelName: 'FinancialStatement',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['company_id'] },
          { fields: ['ticker'] },
          { fields: ['fiscal_year', 'fiscal_quarter'] },
          { fields: ['report_date'] },
          { unique: true, fields: ['ticker', 'fiscal_year', 'fiscal_quarter', 'period'] },
        ],
      }
    );

    return FinancialStatement;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CompanyAnalysis
// ============================================================================

/**
 * TypeScript interface for CompanyAnalysis attributes
 */
export interface CompanyAnalysisAttributes {
  id: string;
  statementId: string;
  ticker: string;
  analysisDate: Date;
  industry: IndustryClassification;
  financialRatios: Record<string, number>;
  valuationMetrics: Record<string, number>;
  growthMetrics: Record<string, number>;
  qualityScores: Record<string, number>;
  healthScore: FinancialHealthScore;
  bankruptcyRisk: BankruptcyRisk;
  bankruptcyScore: number;
  esgRating: ESGRating;
  esgScore: number;
  managementQuality: ManagementQuality;
  managementScore: number;
  competitivePosition: Record<string, any>;
  investmentRating: InvestmentRating;
  targetPrice: number | null;
  analystNotes: string | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CompanyAnalysisCreationAttributes
  extends Optional<
    CompanyAnalysisAttributes,
    'id' | 'targetPrice' | 'analystNotes' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: CompanyAnalysis
 * Comprehensive fundamental analysis results
 */
export class CompanyAnalysis
  extends Model<CompanyAnalysisAttributes, CompanyAnalysisCreationAttributes>
  implements CompanyAnalysisAttributes
{
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare statementId: string;

  @ApiProperty()
  declare ticker: string;

  @ApiProperty()
  declare analysisDate: Date;

  @ApiProperty({ enum: IndustryClassification })
  declare industry: IndustryClassification;

  @ApiProperty()
  declare financialRatios: Record<string, number>;

  @ApiProperty()
  declare valuationMetrics: Record<string, number>;

  @ApiProperty()
  declare growthMetrics: Record<string, number>;

  @ApiProperty()
  declare qualityScores: Record<string, number>;

  @ApiProperty()
  declare healthScore: FinancialHealthScore;

  @ApiProperty({ enum: BankruptcyRisk })
  declare bankruptcyRisk: BankruptcyRisk;

  @ApiProperty()
  declare bankruptcyScore: number;

  @ApiProperty({ enum: ESGRating })
  declare esgRating: ESGRating;

  @ApiProperty()
  declare esgScore: number;

  @ApiProperty({ enum: ManagementQuality })
  declare managementQuality: ManagementQuality;

  @ApiProperty()
  declare managementScore: number;

  @ApiProperty()
  declare competitivePosition: Record<string, any>;

  @ApiProperty({ enum: InvestmentRating })
  declare investmentRating: InvestmentRating;

  @ApiPropertyOptional()
  declare targetPrice: number | null;

  @ApiPropertyOptional()
  declare analystNotes: string | null;

  @ApiProperty()
  declare metadata: Record<string, any>;

  @ApiProperty()
  declare createdBy: string;

  @ApiPropertyOptional()
  declare updatedBy: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getStatement: BelongsToGetAssociationMixin<FinancialStatement>;

  declare static associations: {
    statement: Association<CompanyAnalysis, FinancialStatement>;
  };

  /**
   * Initialize CompanyAnalysis with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CompanyAnalysis {
    CompanyAnalysis.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        statementId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'financial_statements',
            key: 'id',
          },
          field: 'statement_id',
        },
        ticker: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'ticker',
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'analysis_date',
        },
        industry: {
          type: DataTypes.ENUM(...Object.values(IndustryClassification)),
          allowNull: false,
          field: 'industry',
        },
        financialRatios: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'financial_ratios',
        },
        valuationMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'valuation_metrics',
        },
        growthMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'growth_metrics',
        },
        qualityScores: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'quality_scores',
        },
        healthScore: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'health_score',
        },
        bankruptcyRisk: {
          type: DataTypes.ENUM(...Object.values(BankruptcyRisk)),
          allowNull: false,
          field: 'bankruptcy_risk',
        },
        bankruptcyScore: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'bankruptcy_score',
        },
        esgRating: {
          type: DataTypes.ENUM(...Object.values(ESGRating)),
          allowNull: false,
          field: 'esg_rating',
        },
        esgScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: { min: 0, max: 100 },
          field: 'esg_score',
        },
        managementQuality: {
          type: DataTypes.ENUM(...Object.values(ManagementQuality)),
          allowNull: false,
          field: 'management_quality',
        },
        managementScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: { min: 0, max: 100 },
          field: 'management_score',
        },
        competitivePosition: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'competitive_position',
        },
        investmentRating: {
          type: DataTypes.ENUM(...Object.values(InvestmentRating)),
          allowNull: false,
          field: 'investment_rating',
        },
        targetPrice: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: true,
          field: 'target_price',
        },
        analystNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'analyst_notes',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'company_analyses',
        modelName: 'CompanyAnalysis',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['statement_id'] },
          { fields: ['ticker'] },
          { fields: ['analysis_date'] },
          { fields: ['industry'] },
          { fields: ['investment_rating'] },
          { fields: ['bankruptcy_risk'] },
        ],
      }
    );

    return CompanyAnalysis;
  }
}

// ============================================================================
// SEQUELIZE MODEL: ValuationModel
// ============================================================================

/**
 * TypeScript interface for ValuationModel attributes
 */
export interface ValuationModelAttributes {
  id: string;
  analysisId: string;
  ticker: string;
  modelType: 'dcf' | 'ddm' | 'graham' | 'residual_income' | 'asset_based' | 'relative';
  modelName: string;
  assumptions: Record<string, any>;
  inputs: Record<string, any>;
  outputs: ValuationResult;
  intrinsicValue: number;
  currentPrice: number;
  upsideDownside: number;
  sensitivityAnalysis: Record<string, any>;
  confidenceLevel: 'high' | 'medium' | 'low';
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ValuationModelCreationAttributes
  extends Optional<ValuationModelAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: ValuationModel
 * Stores valuation model results
 */
export class ValuationModel
  extends Model<ValuationModelAttributes, ValuationModelCreationAttributes>
  implements ValuationModelAttributes
{
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare analysisId: string;

  @ApiProperty()
  declare ticker: string;

  @ApiProperty()
  declare modelType: 'dcf' | 'ddm' | 'graham' | 'residual_income' | 'asset_based' | 'relative';

  @ApiProperty()
  declare modelName: string;

  @ApiProperty()
  declare assumptions: Record<string, any>;

  @ApiProperty()
  declare inputs: Record<string, any>;

  @ApiProperty()
  declare outputs: ValuationResult;

  @ApiProperty()
  declare intrinsicValue: number;

  @ApiProperty()
  declare currentPrice: number;

  @ApiProperty()
  declare upsideDownside: number;

  @ApiProperty()
  declare sensitivityAnalysis: Record<string, any>;

  @ApiProperty()
  declare confidenceLevel: 'high' | 'medium' | 'low';

  @ApiProperty()
  declare metadata: Record<string, any>;

  @ApiProperty()
  declare createdBy: string;

  @ApiPropertyOptional()
  declare updatedBy: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize ValuationModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof ValuationModel {
    ValuationModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        analysisId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'company_analyses',
            key: 'id',
          },
          field: 'analysis_id',
        },
        ticker: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'ticker',
        },
        modelType: {
          type: DataTypes.ENUM('dcf', 'ddm', 'graham', 'residual_income', 'asset_based', 'relative'),
          allowNull: false,
          field: 'model_type',
        },
        modelName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'model_name',
        },
        assumptions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'assumptions',
        },
        inputs: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'inputs',
        },
        outputs: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'outputs',
        },
        intrinsicValue: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          field: 'intrinsic_value',
        },
        currentPrice: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          field: 'current_price',
        },
        upsideDownside: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false,
          field: 'upside_downside',
        },
        sensitivityAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'sensitivity_analysis',
        },
        confidenceLevel: {
          type: DataTypes.ENUM('high', 'medium', 'low'),
          allowNull: false,
          field: 'confidence_level',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'valuation_models',
        modelName: 'ValuationModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['analysis_id'] },
          { fields: ['ticker'] },
          { fields: ['model_type'] },
        ],
      }
    );

    return ValuationModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: ScreeningCriteria
// ============================================================================

/**
 * TypeScript interface for ScreeningCriteria attributes
 */
export interface ScreeningCriteriaAttributes {
  id: string;
  name: string;
  description: string | null;
  industry: IndustryClassification | null;
  criteria: Record<string, any>[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  maxResults: number;
  isPublic: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ScreeningCriteriaCreationAttributes
  extends Optional<
    ScreeningCriteriaAttributes,
    'id' | 'description' | 'industry' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: ScreeningCriteria
 * Stores screening criteria and filters
 */
export class ScreeningCriteria
  extends Model<ScreeningCriteriaAttributes, ScreeningCriteriaCreationAttributes>
  implements ScreeningCriteriaAttributes
{
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare name: string;

  @ApiPropertyOptional()
  declare description: string | null;

  @ApiPropertyOptional({ enum: IndustryClassification })
  declare industry: IndustryClassification | null;

  @ApiProperty()
  declare criteria: Record<string, any>[];

  @ApiProperty()
  declare sortBy: string;

  @ApiProperty({ enum: ['asc', 'desc'] })
  declare sortOrder: 'asc' | 'desc';

  @ApiProperty()
  declare maxResults: number;

  @ApiProperty()
  declare isPublic: boolean;

  @ApiProperty()
  declare metadata: Record<string, any>;

  @ApiProperty()
  declare createdBy: string;

  @ApiPropertyOptional()
  declare updatedBy: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize ScreeningCriteria with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof ScreeningCriteria {
    ScreeningCriteria.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        industry: {
          type: DataTypes.ENUM(...Object.values(IndustryClassification)),
          allowNull: true,
          field: 'industry',
        },
        criteria: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'criteria',
        },
        sortBy: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: 'healthScore',
          field: 'sort_by',
        },
        sortOrder: {
          type: DataTypes.ENUM('asc', 'desc'),
          allowNull: false,
          defaultValue: 'desc',
          field: 'sort_order',
        },
        maxResults: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 100,
          validate: { min: 1, max: 1000 },
          field: 'max_results',
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_public',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'screening_criteria',
        modelName: 'ScreeningCriteria',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['industry'] },
          { fields: ['created_by'] },
          { fields: ['is_public'] },
        ],
      }
    );

    return ScreeningCriteria;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineFundamentalAnalysisAssociations(): void {
  FinancialStatement.hasMany(CompanyAnalysis, {
    foreignKey: 'statementId',
    as: 'analyses',
    onDelete: 'CASCADE',
  });

  CompanyAnalysis.belongsTo(FinancialStatement, {
    foreignKey: 'statementId',
    as: 'statement',
  });

  CompanyAnalysis.hasMany(ValuationModel, {
    foreignKey: 'analysisId',
    as: 'valuations',
    onDelete: 'CASCADE',
  });

  ValuationModel.belongsTo(CompanyAnalysis, {
    foreignKey: 'analysisId',
    as: 'analysis',
  });
}

// ============================================================================
// FINANCIAL STATEMENT FUNCTIONS
// ============================================================================

/**
 * Create financial statement
 */
export async function createFinancialStatement(
  data: FinancialStatementCreationAttributes,
  transaction?: Transaction
): Promise<FinancialStatement> {
  return await FinancialStatement.create(data, { transaction });
}

/**
 * Get financial statement by ID
 */
export async function getFinancialStatementById(
  id: string,
  transaction?: Transaction
): Promise<FinancialStatement | null> {
  return await FinancialStatement.findByPk(id, {
    include: ['analyses'],
    transaction,
  });
}

/**
 * Get financial statements by ticker
 */
export async function getFinancialStatementsByTicker(
  ticker: string,
  limit: number = 10,
  transaction?: Transaction
): Promise<FinancialStatement[]> {
  return await FinancialStatement.findAll({
    where: { ticker },
    order: [['fiscal_year', 'DESC'], ['fiscal_quarter', 'DESC']],
    limit,
    transaction,
  });
}

/**
 * Get latest financial statement for ticker
 */
export async function getLatestFinancialStatement(
  ticker: string,
  period: StatementPeriod = StatementPeriod.QUARTERLY,
  transaction?: Transaction
): Promise<FinancialStatement | null> {
  return await FinancialStatement.findOne({
    where: { ticker, period },
    order: [['fiscal_year', 'DESC'], ['fiscal_quarter', 'DESC']],
    transaction,
  });
}

// ============================================================================
// FINANCIAL RATIO ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive liquidity ratios
 */
export async function calculateLiquidityRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const bs = statement.balanceSheet;

  return {
    currentRatio: calculateCurrentRatio(bs),
    quickRatio: calculateQuickRatio(bs),
    cashRatio: calculateCashRatio(bs),
    workingCapital: calculateWorkingCapital(bs),
  };
}

/**
 * Calculate comprehensive leverage ratios
 */
export async function calculateLeverageRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const bs = statement.balanceSheet;
  const is = statement.incomeStatement;

  return {
    debtToEquity: calculateDebtToEquity(bs),
    debtRatio: calculateDebtRatio(bs),
    equityMultiplier: calculateEquityMultiplier(bs),
    interestCoverage: calculateInterestCoverage(is),
  };
}

/**
 * Calculate comprehensive profitability ratios
 */
export async function calculateProfitabilityRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const bs = statement.balanceSheet;
  const is = statement.incomeStatement;

  return {
    grossMargin: calculateGrossProfitMargin(is),
    operatingMargin: calculateOperatingMargin(is),
    netMargin: calculateNetProfitMargin(is),
    ebitdaMargin: calculateEBITDAMargin(is),
    roa: calculateROA(is, bs),
    roe: calculateROE(is, bs),
    roic: calculateROIC(is, bs, 0.25), // Assuming 25% tax rate
  };
}

/**
 * Calculate comprehensive efficiency ratios
 */
export async function calculateEfficiencyRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const bs = statement.balanceSheet;
  const is = statement.incomeStatement;

  return {
    assetTurnover: calculateAssetTurnover(is, bs),
    inventoryTurnover: calculateInventoryTurnover(is, bs),
    dso: calculateDSO(bs, is.revenue),
    dpo: calculateDPO(bs, is.costOfGoodsSold),
    cashConversionCycle: calculateCashConversionCycle(is, bs),
  };
}

/**
 * Calculate all financial ratios
 */
export async function calculateAllFinancialRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const liquidity = await calculateLiquidityRatios(statementId, transaction);
  const leverage = await calculateLeverageRatios(statementId, transaction);
  const profitability = await calculateProfitabilityRatios(statementId, transaction);
  const efficiency = await calculateEfficiencyRatios(statementId, transaction);

  return {
    ...liquidity,
    ...leverage,
    ...profitability,
    ...efficiency,
  };
}

// ============================================================================
// EARNINGS ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate earnings per share metrics
 */
export async function calculateEPSMetrics(
  statementId: string,
  dilutiveShares: number = 0,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const netIncome = statement.incomeStatement.netIncome;
  const shares = statement.sharesOutstanding;

  return {
    basicEPS: calculateBasicEPS(netIncome, shares),
    dilutedEPS: calculateDilutedEPS(netIncome, shares, dilutiveShares),
  };
}

/**
 * Calculate earnings quality metrics
 */
export async function calculateEarningsQualityMetrics(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const netIncome = statement.incomeStatement.netIncome;
  const ocf = statement.cashFlowStatement.operatingCashFlow;

  return {
    earningsQuality: calculateEarningsQuality(netIncome, ocf),
    ocfToNetIncome: ocf / netIncome,
  };
}

/**
 * Analyze earnings surprise
 */
export async function analyzeEarningsSurprise(
  statementId: string,
  expectedEPS: number,
  transaction?: Transaction
): Promise<{ surprise: number; beat: boolean; miss: boolean }> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const actualEPS = calculateBasicEPS(
    statement.incomeStatement.netIncome,
    statement.sharesOutstanding
  );

  const surprise = calculateEarningsSurprise(actualEPS, expectedEPS);

  return {
    surprise,
    beat: surprise > 0,
    miss: surprise < 0,
  };
}

/**
 * Calculate normalized earnings
 */
export async function calculateNormalizedEarningsMetrics(
  statementId: string,
  oneTimeItems: number[],
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const reported = statement.incomeStatement.netIncome;
  const normalized = calculateNormalizedEarnings(reported, oneTimeItems);
  const core = calculateCoreEarnings(
    statement.incomeStatement.operatingIncome,
    statement.incomeStatement.interestExpense,
    0.25
  );

  return {
    reportedEarnings: reported,
    normalizedEarnings: normalized,
    coreEarnings: core,
    normalizedEPS: calculateBasicEPS(normalized, statement.sharesOutstanding),
  };
}

// ============================================================================
// GROWTH ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate growth rates
 */
export async function calculateGrowthRates(
  currentStatementId: string,
  previousStatementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const current = await FinancialStatement.findByPk(currentStatementId, { transaction });
  const previous = await FinancialStatement.findByPk(previousStatementId, { transaction });

  if (!current || !previous) {
    throw new Error('Financial statements not found');
  }

  return {
    revenueGrowth: calculateRevenueGrowth(
      current.incomeStatement.revenue,
      previous.incomeStatement.revenue
    ),
    earningsGrowth: calculateEarningsGrowth(
      current.incomeStatement.netIncome,
      previous.incomeStatement.netIncome
    ),
    ebitdaGrowth: calculateEarningsGrowth(
      current.incomeStatement.operatingIncome + (current.incomeStatement.depreciationAmortization || 0),
      previous.incomeStatement.operatingIncome + (previous.incomeStatement.depreciationAmortization || 0)
    ),
  };
}

/**
 * Calculate sustainable growth rate
 */
export async function calculateSustainableGrowth(
  statementId: string,
  dividendPayoutRatio: number,
  transaction?: Transaction
): Promise<number> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const roe = calculateROE(statement.incomeStatement, statement.balanceSheet);
  const retentionRatio = 1 - dividendPayoutRatio;

  return calculateSustainableGrowthRate(roe, retentionRatio);
}

/**
 * Project future revenue
 */
export async function projectFutureRevenue(
  statementId: string,
  growthRate: number,
  years: number,
  transaction?: Transaction
): Promise<number[]> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const currentRevenue = statement.incomeStatement.revenue;
  const projections: number[] = [];

  for (let i = 1; i <= years; i++) {
    projections.push(projectFutureGrowth(currentRevenue, growthRate, i));
  }

  return projections;
}

/**
 * Calculate CAGR from historical statements
 */
export async function calculateHistoricalCAGR(
  ticker: string,
  metric: 'revenue' | 'earnings' | 'assets',
  years: number,
  transaction?: Transaction
): Promise<number> {
  const statements = await getFinancialStatementsByTicker(ticker, years, transaction);

  if (statements.length < 2) {
    throw new Error('Insufficient historical data for CAGR calculation');
  }

  const latest = statements[0];
  const oldest = statements[statements.length - 1];

  let endValue: number;
  let beginValue: number;

  switch (metric) {
    case 'revenue':
      endValue = latest.incomeStatement.revenue;
      beginValue = oldest.incomeStatement.revenue;
      break;
    case 'earnings':
      endValue = latest.incomeStatement.netIncome;
      beginValue = oldest.incomeStatement.netIncome;
      break;
    case 'assets':
      endValue = latest.balanceSheet.totalAssets;
      beginValue = oldest.balanceSheet.totalAssets;
      break;
  }

  const actualYears = latest.fiscalYear - oldest.fiscalYear;
  return calculateCAGR(beginValue, endValue, actualYears);
}

// ============================================================================
// CASH FLOW ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate free cash flow metrics
 */
export async function calculateFreeCashFlowMetrics(
  statementId: string,
  netBorrowing: number = 0,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const cf = statement.cashFlowStatement;

  return {
    fcf: calculateFreeCashFlow(cf),
    fcfe: calculateFCFE(cf, netBorrowing),
    fcfYield: calculateFreeCashFlow(cf) / (statement.marketData.marketCap || 1),
  };
}

/**
 * Calculate cash flow ratios
 */
export async function calculateCashFlowRatios(
  statementId: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const cf = statement.cashFlowStatement;
  const bs = statement.balanceSheet;

  return {
    ocfRatio: calculateOCFRatio(cf, bs.currentLiabilities),
    cashFlowToDebt: calculateCashFlowToDebt(cf, bs.totalLiabilities),
    capexToOCF: cf.capitalExpenditures / cf.operatingCashFlow,
  };
}

/**
 * Analyze cash burn and runway
 */
export async function analyzeCashBurnAndRunway(
  ticker: string,
  monthsInPeriod: number = 12,
  transaction?: Transaction
): Promise<{ burnRate: number; runway: number }> {
  const statements = await getFinancialStatementsByTicker(ticker, 2, transaction);

  if (statements.length < 2) {
    throw new Error('Insufficient data for burn rate calculation');
  }

  const latest = statements[0];
  const previous = statements[1];

  const burnRate = calculateCashBurnRate(
    previous.balanceSheet.cash,
    latest.balanceSheet.cash,
    monthsInPeriod
  );

  const runway = calculateRunway(latest.balanceSheet.cash, burnRate);

  return { burnRate, runway };
}

// ============================================================================
// VALUATION FUNCTIONS
// ============================================================================

/**
 * Perform DCF valuation
 */
export async function performDCFValuation(
  statementId: string,
  dcfParams: DCFParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<ValuationModel> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const valuation = calculateDCF(dcfParams);
  const currentPrice = statement.marketData.stockPrice;
  const upsideDownside = ((valuation.valuePerShare - currentPrice) / currentPrice) * 100;

  // Create analysis first if it doesn't exist
  let analysis = await CompanyAnalysis.findOne({
    where: { statementId },
    transaction,
  });

  if (!analysis) {
    throw new Error('Company analysis must be created before valuation');
  }

  return await ValuationModel.create(
    {
      analysisId: analysis.id,
      ticker: statement.ticker,
      modelType: 'dcf',
      modelName: 'Discounted Cash Flow',
      assumptions: {
        wacc: dcfParams.wacc,
        terminalGrowthRate: dcfParams.terminalGrowthRate,
      },
      inputs: dcfParams,
      outputs: valuation,
      intrinsicValue: valuation.valuePerShare,
      currentPrice,
      upsideDownside,
      sensitivityAnalysis: {},
      confidenceLevel: valuation.confidence || 'medium',
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform Gordon Growth Model valuation
 */
export async function performGordonGrowthValuation(
  statementId: string,
  dividendPerShare: number,
  requiredReturn: number,
  growthRate: number,
  createdBy: string,
  transaction?: Transaction
): Promise<ValuationModel> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const nextYearDividend = dividendPerShare * (1 + growthRate);
  const intrinsicValue = calculateGordonGrowthModel(nextYearDividend, requiredReturn, growthRate);
  const currentPrice = statement.marketData.stockPrice;
  const upsideDownside = ((intrinsicValue - currentPrice) / currentPrice) * 100;

  let analysis = await CompanyAnalysis.findOne({
    where: { statementId },
    transaction,
  });

  if (!analysis) {
    throw new Error('Company analysis must be created before valuation');
  }

  return await ValuationModel.create(
    {
      analysisId: analysis.id,
      ticker: statement.ticker,
      modelType: 'ddm',
      modelName: 'Gordon Growth Model',
      assumptions: {
        requiredReturn,
        growthRate,
      },
      inputs: {
        currentDividend: dividendPerShare,
        nextYearDividend,
      },
      outputs: {
        baseValue: intrinsicValue * statement.sharesOutstanding,
        valuePerShare: intrinsicValue,
      },
      intrinsicValue,
      currentPrice,
      upsideDownside,
      sensitivityAnalysis: {},
      confidenceLevel: 'medium',
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform Graham Number valuation
 */
export async function performGrahamNumberValuation(
  statementId: string,
  createdBy: string,
  transaction?: Transaction
): Promise<ValuationModel> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const eps = calculateBasicEPS(statement.incomeStatement.netIncome, statement.sharesOutstanding);
  const bookValuePerShare =
    statement.balanceSheet.shareholdersEquity / statement.sharesOutstanding;

  const intrinsicValue = calculateGrahamNumber(eps, bookValuePerShare);
  const currentPrice = statement.marketData.stockPrice;
  const upsideDownside = ((intrinsicValue - currentPrice) / currentPrice) * 100;

  let analysis = await CompanyAnalysis.findOne({
    where: { statementId },
    transaction,
  });

  if (!analysis) {
    throw new Error('Company analysis must be created before valuation');
  }

  return await ValuationModel.create(
    {
      analysisId: analysis.id,
      ticker: statement.ticker,
      modelType: 'graham',
      modelName: 'Graham Number',
      assumptions: {},
      inputs: {
        eps,
        bookValuePerShare,
      },
      outputs: {
        baseValue: intrinsicValue * statement.sharesOutstanding,
        valuePerShare: intrinsicValue,
      },
      intrinsicValue,
      currentPrice,
      upsideDownside,
      sensitivityAnalysis: {},
      confidenceLevel: 'medium',
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform relative valuation using peer multiples
 */
export async function performRelativeValuation(
  statementId: string,
  peerMetrics: PeerMetrics[],
  multiple: keyof PeerMetrics,
  createdBy: string,
  transaction?: Transaction
): Promise<ValuationModel> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const avgMultiple = calculateIndustryAverage(peerMetrics, multiple);

  let companyMetric: number;
  if (multiple === 'peRatio') {
    const eps = calculateBasicEPS(statement.incomeStatement.netIncome, statement.sharesOutstanding);
    companyMetric = eps;
  } else if (multiple === 'pbRatio') {
    companyMetric = statement.balanceSheet.shareholdersEquity / statement.sharesOutstanding;
  } else {
    companyMetric = statement.incomeStatement.netIncome;
  }

  const intrinsicValue = calculateRelativeValuation(companyMetric, avgMultiple);
  const currentPrice = statement.marketData.stockPrice;
  const upsideDownside = ((intrinsicValue - currentPrice) / currentPrice) * 100;

  let analysis = await CompanyAnalysis.findOne({
    where: { statementId },
    transaction,
  });

  if (!analysis) {
    throw new Error('Company analysis must be created before valuation');
  }

  return await ValuationModel.create(
    {
      analysisId: analysis.id,
      ticker: statement.ticker,
      modelType: 'relative',
      modelName: `Relative Valuation (${String(multiple)})`,
      assumptions: {
        peerMultiple: avgMultiple,
      },
      inputs: {
        companyMetric,
        peerMetrics,
      },
      outputs: {
        baseValue: intrinsicValue * statement.sharesOutstanding,
        valuePerShare: intrinsicValue,
      },
      intrinsicValue,
      currentPrice,
      upsideDownside,
      sensitivityAnalysis: {},
      confidenceLevel: 'medium',
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

// ============================================================================
// COMPARABLE COMPANY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Perform peer comparison analysis
 */
export async function performPeerComparison(
  statementId: string,
  peerStatementIds: string[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const peerStatements = await FinancialStatement.findAll({
    where: { id: { [Op.in]: peerStatementIds } },
    transaction,
  });

  const companyPE = calculatePERatio(
    statement.marketData.stockPrice,
    calculateBasicEPS(statement.incomeStatement.netIncome, statement.sharesOutstanding)
  );

  const peerPEs = peerStatements.map(p =>
    calculatePERatio(
      p.marketData.stockPrice,
      calculateBasicEPS(p.incomeStatement.netIncome, p.sharesOutstanding)
    )
  );

  const peComparison = analyzePeerComparison(companyPE, peerPEs);

  const companyROE = calculateROE(statement.incomeStatement, statement.balanceSheet);
  const peerROEs = peerStatements.map(p => calculateROE(p.incomeStatement, p.balanceSheet));
  const roeComparison = analyzePeerComparison(companyROE, peerROEs);

  return {
    peRatio: {
      company: companyPE,
      ...peComparison,
    },
    roe: {
      company: companyROE,
      ...roeComparison,
    },
  };
}

/**
 * Calculate industry benchmarks
 */
export async function calculateIndustryBenchmarks(
  industry: IndustryClassification,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statements = await FinancialStatement.findAll({
    include: [
      {
        model: CompanyAnalysis,
        as: 'analyses',
        where: { industry },
        required: true,
      },
    ],
    limit: 100,
    transaction,
  });

  if (statements.length === 0) {
    throw new Error('No companies found for industry');
  }

  const ratios = statements.map(s => ({
    peRatio: calculatePERatio(
      s.marketData.stockPrice,
      calculateBasicEPS(s.incomeStatement.netIncome, s.sharesOutstanding)
    ),
    roe: calculateROE(s.incomeStatement, s.balanceSheet),
    debtToEquity: calculateDebtToEquity(s.balanceSheet),
    currentRatio: calculateCurrentRatio(s.balanceSheet),
  }));

  return {
    avgPE: ratios.reduce((sum, r) => sum + r.peRatio, 0) / ratios.length,
    avgROE: ratios.reduce((sum, r) => sum + r.roe, 0) / ratios.length,
    avgDebtToEquity: ratios.reduce((sum, r) => sum + r.debtToEquity, 0) / ratios.length,
    avgCurrentRatio: ratios.reduce((sum, r) => sum + r.currentRatio, 0) / ratios.length,
  };
}

// ============================================================================
// ECONOMIC INDICATORS FUNCTIONS
// ============================================================================

/**
 * Adjust financials for inflation
 */
export async function adjustFinancialsForInflation(
  statementId: string,
  inflationRate: number,
  baseYear: number,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const years = statement.fiscalYear - baseYear;

  return {
    adjustedRevenue: adjustForInflation(statement.incomeStatement.revenue, inflationRate, years),
    adjustedNetIncome: adjustForInflation(statement.incomeStatement.netIncome, inflationRate, years),
    adjustedAssets: adjustForInflation(statement.balanceSheet.totalAssets, inflationRate, years),
  };
}

/**
 * Analyze currency impact on international operations
 */
export async function analyzeCurrencyImpactOnFinancials(
  ticker: string,
  foreignRevenuePercentage: number,
  previousExchangeRate: number,
  currentExchangeRate: number,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const latest = await getLatestFinancialStatement(ticker, StatementPeriod.QUARTERLY, transaction);
  if (!latest) {
    throw new Error('Financial statement not found');
  }

  const totalRevenue = latest.incomeStatement.revenue;
  const foreignRevenue = totalRevenue * foreignRevenuePercentage;

  const impact = analyzeCurrencyImpact(foreignRevenue, previousExchangeRate, currentExchangeRate);
  const impactPercentage = (impact / totalRevenue) * 100;

  return {
    foreignRevenue,
    currencyImpact: impact,
    impactPercentage,
    adjustedRevenue: totalRevenue + impact,
  };
}

/**
 * Analyze interest rate sensitivity
 */
export async function analyzeCompanyInterestRateSensitivity(
  statementId: string,
  rateChange: number,
  transaction?: Transaction
): Promise<Record<string, number>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const variableDebt = statement.balanceSheet.longTermDebt * 0.5; // Assume 50% variable
  const impact = analyzeInterestRateSensitivity(variableDebt, rateChange);
  const impactOnEarnings = impact * (1 - 0.25); // After-tax impact

  return {
    variableRateDebt: variableDebt,
    annualInterestImpact: impact,
    afterTaxImpact: impactOnEarnings,
    epsImpact: impactOnEarnings / statement.sharesOutstanding,
  };
}

// ============================================================================
// FINANCIAL HEALTH & BANKRUPTCY PREDICTION FUNCTIONS
// ============================================================================

/**
 * Perform comprehensive financial health analysis
 */
export async function performFinancialHealthAnalysis(
  statementId: string,
  transaction?: Transaction
): Promise<FinancialHealthScore> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  return calculateFinancialHealthScore(
    statement.balanceSheet,
    statement.incomeStatement,
    statement.cashFlowStatement
  );
}

/**
 * Calculate Altman Z-Score for bankruptcy prediction
 */
export async function calculateAltmanZScore(
  statementId: string,
  transaction?: Transaction
): Promise<{ zScore: number; risk: BankruptcyRisk; interpretation: string }> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const bs = statement.balanceSheet;
  const is = statement.incomeStatement;

  const workingCapital = calculateWorkingCapital(bs);
  const retainedEarnings = bs.shareholdersEquity - (bs.metadata.paidInCapital || 0);
  const ebit = is.operatingIncome;
  const marketValue = statement.marketData.marketCap || statement.marketData.stockPrice * statement.sharesOutstanding;
  const totalLiabilities = bs.totalLiabilities;
  const revenue = is.revenue;
  const totalAssets = bs.totalAssets;

  const x1 = workingCapital / totalAssets;
  const x2 = retainedEarnings / totalAssets;
  const x3 = ebit / totalAssets;
  const x4 = marketValue / totalLiabilities;
  const x5 = revenue / totalAssets;

  const zScore = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 1.0 * x5;

  let risk: BankruptcyRisk;
  let interpretation: string;

  if (zScore > 2.99) {
    risk = BankruptcyRisk.VERY_LOW;
    interpretation = 'Safe Zone - Low probability of bankruptcy';
  } else if (zScore >= 2.7) {
    risk = BankruptcyRisk.LOW;
    interpretation = 'Safe Zone - Borderline low risk';
  } else if (zScore >= 1.8) {
    risk = BankruptcyRisk.MODERATE;
    interpretation = 'Grey Zone - Moderate risk';
  } else if (zScore >= 1.23) {
    risk = BankruptcyRisk.HIGH;
    interpretation = 'Distress Zone - High risk';
  } else {
    risk = BankruptcyRisk.VERY_HIGH;
    interpretation = 'Distress Zone - Very high bankruptcy risk';
  }

  return { zScore, risk, interpretation };
}

/**
 * Calculate Piotroski F-Score for financial strength
 */
export async function calculatePiotroskiFScore(
  currentStatementId: string,
  previousStatementId: string,
  transaction?: Transaction
): Promise<{ fScore: number; rating: string; signals: Record<string, boolean> }> {
  const current = await FinancialStatement.findByPk(currentStatementId, { transaction });
  const previous = await FinancialStatement.findByPk(previousStatementId, { transaction });

  if (!current || !previous) {
    throw new Error('Financial statements not found');
  }

  const signals = {
    // Profitability signals
    positiveROA: calculateROA(current.incomeStatement, current.balanceSheet) > 0,
    positiveOCF: current.cashFlowStatement.operatingCashFlow > 0,
    increasingROA:
      calculateROA(current.incomeStatement, current.balanceSheet) >
      calculateROA(previous.incomeStatement, previous.balanceSheet),
    qualityEarnings: current.cashFlowStatement.operatingCashFlow > current.incomeStatement.netIncome,

    // Leverage signals
    decreasingLeverage:
      calculateDebtRatio(current.balanceSheet) < calculateDebtRatio(previous.balanceSheet),
    increasingLiquidity:
      calculateCurrentRatio(current.balanceSheet) > calculateCurrentRatio(previous.balanceSheet),
    noNewShares: current.sharesOutstanding <= previous.sharesOutstanding,

    // Operating efficiency signals
    increasingMargin:
      calculateGrossProfitMargin(current.incomeStatement) >
      calculateGrossProfitMargin(previous.incomeStatement),
    increasingTurnover:
      calculateAssetTurnover(current.incomeStatement, current.balanceSheet) >
      calculateAssetTurnover(previous.incomeStatement, previous.balanceSheet),
  };

  const fScore = Object.values(signals).filter(Boolean).length;

  let rating: string;
  if (fScore >= 8) rating = 'Very Strong';
  else if (fScore >= 6) rating = 'Strong';
  else if (fScore >= 4) rating = 'Average';
  else if (fScore >= 2) rating = 'Weak';
  else rating = 'Very Weak';

  return { fScore, rating, signals };
}

// ============================================================================
// ESG & MANAGEMENT QUALITY FUNCTIONS
// ============================================================================

/**
 * Calculate ESG score
 */
export async function calculateESGScore(
  environmentalScore: number,
  socialScore: number,
  governanceScore: number
): Promise<{ score: number; rating: ESGRating }> {
  const score = (environmentalScore + socialScore + governanceScore) / 3;

  let rating: ESGRating;
  if (score >= 90) rating = ESGRating.AAA;
  else if (score >= 80) rating = ESGRating.AA;
  else if (score >= 70) rating = ESGRating.A;
  else if (score >= 60) rating = ESGRating.BBB;
  else if (score >= 50) rating = ESGRating.BB;
  else if (score >= 40) rating = ESGRating.B;
  else rating = ESGRating.CCC;

  return { score, rating };
}

/**
 * Assess management quality
 */
export async function assessManagementQuality(
  returnOnInvestedCapital: number,
  capitalAllocationScore: number,
  corporateGovernanceScore: number,
  transparencyScore: number
): Promise<{ score: number; quality: ManagementQuality }> {
  const roicScore = Math.min(100, returnOnInvestedCapital * 500); // Normalize ROIC to 0-100
  const score = (roicScore + capitalAllocationScore + corporateGovernanceScore + transparencyScore) / 4;

  let quality: ManagementQuality;
  if (score >= 85) quality = ManagementQuality.EXCELLENT;
  else if (score >= 70) quality = ManagementQuality.ABOVE_AVERAGE;
  else if (score >= 55) quality = ManagementQuality.AVERAGE;
  else if (score >= 40) quality = ManagementQuality.BELOW_AVERAGE;
  else quality = ManagementQuality.POOR;

  return { score, quality };
}

/**
 * Evaluate competitive position
 */
export async function evaluateCompetitivePosition(
  statementId: string,
  industryBenchmarks: Record<string, number>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const roe = calculateROE(statement.incomeStatement, statement.balanceSheet);
  const netMargin = calculateNetProfitMargin(statement.incomeStatement);
  const assetTurnover = calculateAssetTurnover(statement.incomeStatement, statement.balanceSheet);

  return {
    roeVsIndustry: {
      company: roe,
      industry: industryBenchmarks.avgROE || 0,
      advantage: roe > (industryBenchmarks.avgROE || 0),
    },
    marginVsIndustry: {
      company: netMargin,
      industry: industryBenchmarks.avgNetMargin || 0,
      advantage: netMargin > (industryBenchmarks.avgNetMargin || 0),
    },
    efficiencyVsIndustry: {
      company: assetTurnover,
      industry: industryBenchmarks.avgAssetTurnover || 0,
      advantage: assetTurnover > (industryBenchmarks.avgAssetTurnover || 0),
    },
  };
}

// ============================================================================
// COMPREHENSIVE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Create comprehensive company analysis
 */
export async function createComprehensiveAnalysis(
  statementId: string,
  industry: IndustryClassification,
  esgScores: { environmental: number; social: number; governance: number },
  managementScores: {
    capitalAllocation: number;
    corporateGovernance: number;
    transparency: number;
  },
  createdBy: string,
  transaction?: Transaction
): Promise<CompanyAnalysis> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  const financialRatios = await calculateAllFinancialRatios(statementId, transaction);
  const healthScore = await performFinancialHealthAnalysis(statementId, transaction);
  const { zScore, risk: bankruptcyRisk } = await calculateAltmanZScore(statementId, transaction);
  const { score: esgScore, rating: esgRating } = await calculateESGScore(
    esgScores.environmental,
    esgScores.social,
    esgScores.governance
  );

  const roic = calculateROIC(statement.incomeStatement, statement.balanceSheet, 0.25);
  const { score: managementScore, quality: managementQuality } = await assessManagementQuality(
    roic,
    managementScores.capitalAllocation,
    managementScores.corporateGovernance,
    managementScores.transparencyScore
  );

  const eps = calculateBasicEPS(statement.incomeStatement.netIncome, statement.sharesOutstanding);
  const peRatio = calculatePERatio(statement.marketData.stockPrice, eps);

  const valuationMetrics = {
    peRatio,
    pbRatio: calculatePBRatio(
      statement.marketData.stockPrice,
      statement.balanceSheet.shareholdersEquity / statement.sharesOutstanding
    ),
    eps,
  };

  const growthMetrics = {
    roic,
    roe: financialRatios.roe,
  };

  const qualityScores = {
    earningsQuality: calculateEarningsQuality(
      statement.incomeStatement.netIncome,
      statement.cashFlowStatement.operatingCashFlow
    ),
  };

  // Determine investment rating based on multiple factors
  let investmentRating: InvestmentRating;
  const overallScore = (healthScore.score + esgScore + managementScore) / 3;

  if (overallScore >= 80 && bankruptcyRisk === BankruptcyRisk.VERY_LOW) {
    investmentRating = InvestmentRating.STRONG_BUY;
  } else if (overallScore >= 65 && bankruptcyRisk <= BankruptcyRisk.LOW) {
    investmentRating = InvestmentRating.BUY;
  } else if (overallScore >= 50 && bankruptcyRisk <= BankruptcyRisk.MODERATE) {
    investmentRating = InvestmentRating.HOLD;
  } else if (overallScore >= 35) {
    investmentRating = InvestmentRating.SELL;
  } else {
    investmentRating = InvestmentRating.STRONG_SELL;
  }

  return await CompanyAnalysis.create(
    {
      statementId,
      ticker: statement.ticker,
      analysisDate: new Date(),
      industry,
      financialRatios,
      valuationMetrics,
      growthMetrics,
      qualityScores,
      healthScore,
      bankruptcyRisk,
      bankruptcyScore: zScore,
      esgRating,
      esgScore,
      managementQuality,
      managementScore,
      competitivePosition: {},
      investmentRating,
      targetPrice: null,
      analystNotes: null,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Perform DuPont analysis
 */
export async function performComprehensiveDuPontAnalysis(
  statementId: string,
  transaction?: Transaction
): Promise<{
  roe: number;
  netMargin: number;
  assetTurnover: number;
  equityMultiplier: number;
}> {
  const statement = await FinancialStatement.findByPk(statementId, { transaction });
  if (!statement) {
    throw new Error('Financial statement not found');
  }

  return performDuPontAnalysis(statement.incomeStatement, statement.balanceSheet);
}

// ============================================================================
// SCREENING FUNCTIONS
// ============================================================================

/**
 * Create screening criteria
 */
export async function createScreeningCriteria(
  data: ScreeningCriteriaCreationAttributes,
  transaction?: Transaction
): Promise<ScreeningCriteria> {
  return await ScreeningCriteria.create(data, { transaction });
}

/**
 * Apply screening criteria
 */
export async function applyScreeningCriteria(
  criteriaId: string,
  transaction?: Transaction
): Promise<CompanyAnalysis[]> {
  const criteria = await ScreeningCriteria.findByPk(criteriaId, { transaction });
  if (!criteria) {
    throw new Error('Screening criteria not found');
  }

  const whereClause: any = {};

  if (criteria.industry) {
    whereClause.industry = criteria.industry;
  }

  // Apply custom criteria filters
  for (const criterion of criteria.criteria) {
    const { field, operator, value } = criterion;

    switch (operator) {
      case ScreeningOperator.GREATER_THAN:
        whereClause[field] = { [Op.gt]: value };
        break;
      case ScreeningOperator.LESS_THAN:
        whereClause[field] = { [Op.lt]: value };
        break;
      case ScreeningOperator.EQUALS:
        whereClause[field] = value;
        break;
      case ScreeningOperator.BETWEEN:
        whereClause[field] = { [Op.between]: value };
        break;
    }
  }

  return await CompanyAnalysis.findAll({
    where: whereClause,
    order: [[criteria.sortBy, criteria.sortOrder]],
    limit: criteria.maxResults,
    transaction,
  });
}

/**
 * Screen for value stocks
 */
export async function screenForValueStocks(
  maxPE: number = 15,
  minDividendYield: number = 0.02,
  maxDebtToEquity: number = 0.5,
  transaction?: Transaction
): Promise<CompanyAnalysis[]> {
  return await CompanyAnalysis.findAll({
    where: {
      'valuationMetrics.peRatio': { [Op.lte]: maxPE },
      'financialRatios.debtToEquity': { [Op.lte]: maxDebtToEquity },
      bankruptcyRisk: { [Op.in]: [BankruptcyRisk.VERY_LOW, BankruptcyRisk.LOW] },
    },
    order: [['healthScore.score', 'DESC']],
    limit: 50,
    transaction,
  });
}

/**
 * Screen for growth stocks
 */
export async function screenForGrowthStocks(
  minRevenueGrowth: number = 20,
  minROE: number = 0.15,
  minHealthScore: number = 70,
  transaction?: Transaction
): Promise<CompanyAnalysis[]> {
  return await CompanyAnalysis.findAll({
    where: {
      'growthMetrics.roe': { [Op.gte]: minROE },
      'healthScore.score': { [Op.gte]: minHealthScore },
    },
    order: [['growthMetrics.roe', 'DESC']],
    limit: 50,
    transaction,
  });
}

/**
 * Screen for quality stocks (high ESG, strong management)
 */
export async function screenForQualityStocks(
  minESGScore: number = 70,
  minManagementScore: number = 75,
  minHealthScore: number = 75,
  transaction?: Transaction
): Promise<CompanyAnalysis[]> {
  return await CompanyAnalysis.findAll({
    where: {
      esgScore: { [Op.gte]: minESGScore },
      managementScore: { [Op.gte]: minManagementScore },
      'healthScore.score': { [Op.gte]: minHealthScore },
      bankruptcyRisk: { [Op.in]: [BankruptcyRisk.VERY_LOW, BankruptcyRisk.LOW] },
    },
    order: [['healthScore.score', 'DESC']],
    limit: 50,
    transaction,
  });
}

/**
 * Screen for undervalued stocks
 */
export async function screenForUndervaluedStocks(
  maxPB: number = 1.5,
  minCurrentRatio: number = 1.5,
  minHealthScore: number = 60,
  transaction?: Transaction
): Promise<CompanyAnalysis[]> {
  return await CompanyAnalysis.findAll({
    where: {
      'valuationMetrics.pbRatio': { [Op.lte]: maxPB },
      'financialRatios.currentRatio': { [Op.gte]: minCurrentRatio },
      'healthScore.score': { [Op.gte]: minHealthScore },
    },
    order: [['valuationMetrics.pbRatio', 'ASC']],
    limit: 50,
    transaction,
  });
}

/**
 * Export: Initialize all models
 */
export function initializeFundamentalAnalysisModels(sequelize: Sequelize): void {
  FinancialStatement.initModel(sequelize);
  CompanyAnalysis.initModel(sequelize);
  ValuationModel.initModel(sequelize);
  ScreeningCriteria.initModel(sequelize);
  defineFundamentalAnalysisAssociations();
}

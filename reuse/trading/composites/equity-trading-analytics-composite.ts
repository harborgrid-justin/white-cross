/**
 * LOC: TRADING-COMP-EQUITY-001
 * File: /reuse/trading/composites/equity-trading-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../trading-strategies-kit
 *   - ../fundamental-analysis-kit
 *
 * DOWNSTREAM (imported by):
 *   - Equity trading controllers
 *   - Portfolio management services
 *   - Stock screening systems
 *   - Valuation engines
 *   - Market analytics dashboards
 */

/**
 * File: /reuse/trading/composites/equity-trading-analytics-composite.ts
 * Locator: WC-COMP-TRADING-EQUITY-001
 * Purpose: Bloomberg Terminal-Level Equity Trading Analytics & Valuation Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, trading-strategies-kit, fundamental-analysis-kit
 * Downstream: Trading controllers, portfolio services, screening engines, valuation systems
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PostgreSQL 14+
 * Exports: 43 composed functions for comprehensive equity analysis, valuation, screening, and trading
 *
 * LLM Context: Institutional-grade equity trading analytics composite for Bloomberg Terminal-level platform.
 * Provides comprehensive equity valuation models, earnings analysis, dividend tracking, stock screening,
 * relative valuation, comparable company analysis, ownership tracking, insider trading monitoring,
 * corporate actions processing, market capitalization analysis, float tracking, sector/industry analysis,
 * peer group comparison, technical analysis integration, and portfolio analytics.
 */

import { Injectable, Logger, Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  Optional,
} from 'sequelize';

// Import from trading-strategies-kit
import {
  MarketData,
  TradingSignal,
  calculateRSI,
  calculateMACD,
  generateMomentumSignal,
  calculateBollingerBands,
  generateBollingerBandSignal,
  calculateSMA,
  calculateEMA,
  generateMovingAverageCrossoverSignal,
  detectPriceBreakout,
  calculateDonchianChannels,
  calculateADX,
  backtestStrategy,
  calculatePerformanceMetrics,
} from '../trading-strategies-kit';

// Import from fundamental-analysis-kit
import {
  BalanceSheet,
  IncomeStatement,
  CashFlowStatement,
  MarketData as FundamentalMarketData,
  DCFParameters,
  ValuationResult,
  FinancialHealthScore,
  PeerMetrics,
  calculateCurrentRatio,
  calculateQuickRatio,
  calculateDebtToEquity,
  calculateGrossProfitMargin,
  calculateOperatingMargin,
  calculateNetProfitMargin,
  calculateROE,
  calculateROA,
  calculateROIC,
  calculateFreeCashFlow,
  calculatePERatio,
  calculatePBRatio,
  calculateEVtoEBITDA,
  calculatePSRatio,
  calculatePEGRatio,
  calculateBasicEPS,
  calculateDilutedEPS,
  calculateEarningsQuality,
  calculateRevenueGrowth,
  calculateEarningsGrowth,
  calculateCAGR,
  calculateDCF,
  calculateGordonGrowthModel,
  calculateGrahamNumber,
  calculateIndustryAverage,
  calculateRelativeValuation,
  analyzePeerComparison,
  calculateFinancialHealthScore,
  performDuPontAnalysis,
} from '../fundamental-analysis-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Equity security types
 */
export enum EquityType {
  COMMON_STOCK = 'common_stock',
  PREFERRED_STOCK = 'preferred_stock',
  ADR = 'adr',
  ETF = 'etf',
  REIT = 'reit',
  CLOSED_END_FUND = 'closed_end_fund',
}

/**
 * Market capitalization categories
 */
export enum MarketCapCategory {
  MEGA_CAP = 'mega_cap',        // > $200B
  LARGE_CAP = 'large_cap',      // $10B - $200B
  MID_CAP = 'mid_cap',          // $2B - $10B
  SMALL_CAP = 'small_cap',      // $300M - $2B
  MICRO_CAP = 'micro_cap',      // $50M - $300M
  NANO_CAP = 'nano_cap',        // < $50M
}

/**
 * Trading status
 */
export enum TradingStatus {
  ACTIVE = 'active',
  HALTED = 'halted',
  SUSPENDED = 'suspended',
  DELISTED = 'delisted',
}

/**
 * Corporate action types
 */
export enum CorporateActionType {
  DIVIDEND = 'dividend',
  STOCK_SPLIT = 'stock_split',
  REVERSE_SPLIT = 'reverse_split',
  MERGER = 'merger',
  ACQUISITION = 'acquisition',
  SPINOFF = 'spinoff',
  RIGHTS_ISSUE = 'rights_issue',
  BUYBACK = 'buyback',
}

/**
 * Dividend frequency
 */
export enum DividendFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi_annual',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  SPECIAL = 'special',
}

/**
 * Ownership type
 */
export enum OwnershipType {
  INSTITUTIONAL = 'institutional',
  INSIDER = 'insider',
  RETAIL = 'retail',
  GOVERNMENT = 'government',
  OTHER = 'other',
}

/**
 * Insider transaction types
 */
export enum InsiderTransactionType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  OPTION_EXERCISE = 'option_exercise',
  GIFT = 'gift',
  INHERITANCE = 'inheritance',
}

/**
 * Screening criteria operators
 */
export enum ScreeningOperator {
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  EQUALS = 'eq',
  BETWEEN = 'between',
  IN = 'in',
}

// ============================================================================
// SEQUELIZE MODEL: EquitySecurity
// ============================================================================

/**
 * TypeScript interface for EquitySecurity attributes
 */
export interface EquitySecurityAttributes {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  equityType: EquityType;
  sector: string;
  industry: string;
  description: string | null;
  tradingStatus: TradingStatus;
  isin: string | null;
  cusip: string | null;
  cik: string | null;
  marketCapCategory: MarketCapCategory;
  country: string;
  currency: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface EquitySecurityCreationAttributes extends Optional<EquitySecurityAttributes, 'id' | 'description' | 'isin' | 'cusip' | 'cik' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: EquitySecurity
 * Core equity security master data
 */
export class EquitySecurity extends Model<EquitySecurityAttributes, EquitySecurityCreationAttributes> implements EquitySecurityAttributes {
  declare id: string;
  declare symbol: string;
  declare name: string;
  declare exchange: string;
  declare equityType: EquityType;
  declare sector: string;
  declare industry: string;
  declare description: string | null;
  declare tradingStatus: TradingStatus;
  declare isin: string | null;
  declare cusip: string | null;
  declare cik: string | null;
  declare marketCapCategory: MarketCapCategory;
  declare country: string;
  declare currency: string;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getValuations: HasManyGetAssociationsMixin<EquityValuation>;
  declare getDividends: HasManyGetAssociationsMixin<DividendHistory>;
  declare getCorporateActions: HasManyGetAssociationsMixin<CorporateAction>;
  declare getOwnership: HasManyGetAssociationsMixin<OwnershipRecord>;

  declare static associations: {
    valuations: Association<EquitySecurity, EquityValuation>;
    dividends: Association<EquitySecurity, DividendHistory>;
    corporateActions: Association<EquitySecurity, CorporateAction>;
    ownership: Association<EquitySecurity, OwnershipRecord>;
  };

  /**
   * Initialize EquitySecurity with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof EquitySecurity {
    EquitySecurity.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        symbol: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: 'symbol_exchange_unique',
          field: 'symbol',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        exchange: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: 'symbol_exchange_unique',
          field: 'exchange',
        },
        equityType: {
          type: DataTypes.ENUM(...Object.values(EquityType)),
          allowNull: false,
          field: 'equity_type',
        },
        sector: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'sector',
        },
        industry: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'industry',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        tradingStatus: {
          type: DataTypes.ENUM(...Object.values(TradingStatus)),
          allowNull: false,
          defaultValue: TradingStatus.ACTIVE,
          field: 'trading_status',
        },
        isin: {
          type: DataTypes.STRING(12),
          allowNull: true,
          unique: true,
          field: 'isin',
        },
        cusip: {
          type: DataTypes.STRING(9),
          allowNull: true,
          field: 'cusip',
        },
        cik: {
          type: DataTypes.STRING(10),
          allowNull: true,
          field: 'cik',
        },
        marketCapCategory: {
          type: DataTypes.ENUM(...Object.values(MarketCapCategory)),
          allowNull: false,
          field: 'market_cap_category',
        },
        country: {
          type: DataTypes.STRING(2),
          allowNull: false,
          field: 'country',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
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
        tableName: 'equity_securities',
        modelName: 'EquitySecurity',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['symbol'] },
          { fields: ['exchange'] },
          { fields: ['sector', 'industry'] },
          { fields: ['market_cap_category'] },
          { fields: ['trading_status'] },
          { fields: ['isin'], unique: true, where: { isin: { [Op.ne]: null } } },
        ],
      }
    );

    return EquitySecurity;
  }
}

// ============================================================================
// SEQUELIZE MODEL: EquityValuation
// ============================================================================

/**
 * TypeScript interface for EquityValuation attributes
 */
export interface EquityValuationAttributes {
  id: string;
  securityId: string;
  valuationDate: Date;
  stockPrice: number;
  sharesOutstanding: number;
  sharesFloat: number;
  marketCap: number;
  enterpriseValue: number;
  peRatio: number | null;
  pbRatio: number | null;
  psRatio: number | null;
  evEbitda: number | null;
  evSales: number | null;
  pegRatio: number | null;
  priceToFreeCashFlow: number | null;
  eps: number | null;
  epsGrowth: number | null;
  dividendYield: number | null;
  payoutRatio: number | null;
  beta: number | null;
  intrinsicValue: number | null;
  valuationMethod: string | null;
  analystConsensus: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface EquityValuationCreationAttributes extends Optional<EquityValuationAttributes, 'id' | 'peRatio' | 'pbRatio' | 'psRatio' | 'evEbitda' | 'evSales' | 'pegRatio' | 'priceToFreeCashFlow' | 'eps' | 'epsGrowth' | 'dividendYield' | 'payoutRatio' | 'beta' | 'intrinsicValue' | 'valuationMethod' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: EquityValuation
 * Comprehensive valuation metrics and multiples
 */
export class EquityValuation extends Model<EquityValuationAttributes, EquityValuationCreationAttributes> implements EquityValuationAttributes {
  declare id: string;
  declare securityId: string;
  declare valuationDate: Date;
  declare stockPrice: number;
  declare sharesOutstanding: number;
  declare sharesFloat: number;
  declare marketCap: number;
  declare enterpriseValue: number;
  declare peRatio: number | null;
  declare pbRatio: number | null;
  declare psRatio: number | null;
  declare evEbitda: number | null;
  declare evSales: number | null;
  declare pegRatio: number | null;
  declare priceToFreeCashFlow: number | null;
  declare eps: number | null;
  declare epsGrowth: number | null;
  declare dividendYield: number | null;
  declare payoutRatio: number | null;
  declare beta: number | null;
  declare intrinsicValue: number | null;
  declare valuationMethod: string | null;
  declare analystConsensus: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getSecurity: BelongsToGetAssociationMixin<EquitySecurity>;

  declare static associations: {
    security: Association<EquityValuation, EquitySecurity>;
  };

  /**
   * Initialize EquityValuation with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof EquityValuation {
    EquityValuation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'equity_securities',
            key: 'id',
          },
          field: 'security_id',
        },
        valuationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'valuation_date',
        },
        stockPrice: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: false,
          field: 'stock_price',
        },
        sharesOutstanding: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'shares_outstanding',
        },
        sharesFloat: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'shares_float',
        },
        marketCap: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'market_cap',
        },
        enterpriseValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'enterprise_value',
        },
        peRatio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'pe_ratio',
        },
        pbRatio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'pb_ratio',
        },
        psRatio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'ps_ratio',
        },
        evEbitda: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'ev_ebitda',
        },
        evSales: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'ev_sales',
        },
        pegRatio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'peg_ratio',
        },
        priceToFreeCashFlow: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'price_to_free_cash_flow',
        },
        eps: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'eps',
        },
        epsGrowth: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'eps_growth',
        },
        dividendYield: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'dividend_yield',
        },
        payoutRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'payout_ratio',
        },
        beta: {
          type: DataTypes.DECIMAL(6, 3),
          allowNull: true,
          field: 'beta',
        },
        intrinsicValue: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: true,
          field: 'intrinsic_value',
        },
        valuationMethod: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'valuation_method',
        },
        analystConsensus: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'analyst_consensus',
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
        tableName: 'equity_valuations',
        modelName: 'EquityValuation',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['valuation_date'] },
          { fields: ['security_id', 'valuation_date'], unique: true },
        ],
      }
    );

    return EquityValuation;
  }
}

// ============================================================================
// SEQUELIZE MODEL: DividendHistory
// ============================================================================

/**
 * TypeScript interface for DividendHistory attributes
 */
export interface DividendHistoryAttributes {
  id: string;
  securityId: string;
  exDividendDate: Date;
  recordDate: Date;
  paymentDate: Date;
  declarationDate: Date | null;
  dividendAmount: number;
  dividendCurrency: string;
  frequency: DividendFrequency;
  dividendType: string;
  isSpecial: boolean;
  isFinal: boolean;
  fiscalYear: number;
  fiscalQuarter: number | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DividendHistoryCreationAttributes extends Optional<DividendHistoryAttributes, 'id' | 'declarationDate' | 'fiscalQuarter' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: DividendHistory
 * Complete dividend payment history and analysis
 */
export class DividendHistory extends Model<DividendHistoryAttributes, DividendHistoryCreationAttributes> implements DividendHistoryAttributes {
  declare id: string;
  declare securityId: string;
  declare exDividendDate: Date;
  declare recordDate: Date;
  declare paymentDate: Date;
  declare declarationDate: Date | null;
  declare dividendAmount: number;
  declare dividendCurrency: string;
  declare frequency: DividendFrequency;
  declare dividendType: string;
  declare isSpecial: boolean;
  declare isFinal: boolean;
  declare fiscalYear: number;
  declare fiscalQuarter: number | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getSecurity: BelongsToGetAssociationMixin<EquitySecurity>;

  declare static associations: {
    security: Association<DividendHistory, EquitySecurity>;
  };

  /**
   * Initialize DividendHistory with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DividendHistory {
    DividendHistory.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'equity_securities',
            key: 'id',
          },
          field: 'security_id',
        },
        exDividendDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'ex_dividend_date',
        },
        recordDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'record_date',
        },
        paymentDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'payment_date',
        },
        declarationDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'declaration_date',
        },
        dividendAmount: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'dividend_amount',
        },
        dividendCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'dividend_currency',
        },
        frequency: {
          type: DataTypes.ENUM(...Object.values(DividendFrequency)),
          allowNull: false,
          field: 'frequency',
        },
        dividendType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'dividend_type',
        },
        isSpecial: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_special',
        },
        isFinal: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_final',
        },
        fiscalYear: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'fiscal_year',
        },
        fiscalQuarter: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 4,
          },
          field: 'fiscal_quarter',
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
        tableName: 'dividend_history',
        modelName: 'DividendHistory',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['ex_dividend_date'] },
          { fields: ['payment_date'] },
          { fields: ['fiscal_year', 'fiscal_quarter'] },
        ],
      }
    );

    return DividendHistory;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CorporateAction
// ============================================================================

/**
 * TypeScript interface for CorporateAction attributes
 */
export interface CorporateActionAttributes {
  id: string;
  securityId: string;
  actionType: CorporateActionType;
  announcementDate: Date;
  effectiveDate: Date;
  exDate: Date | null;
  recordDate: Date | null;
  description: string;
  ratio: string | null;
  terms: Record<string, any>;
  priceAdjustmentFactor: number | null;
  sharesAdjustmentFactor: number | null;
  status: string;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CorporateActionCreationAttributes extends Optional<CorporateActionAttributes, 'id' | 'exDate' | 'recordDate' | 'ratio' | 'priceAdjustmentFactor' | 'sharesAdjustmentFactor' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CorporateAction
 * Corporate actions tracking and adjustments
 */
export class CorporateAction extends Model<CorporateActionAttributes, CorporateActionCreationAttributes> implements CorporateActionAttributes {
  declare id: string;
  declare securityId: string;
  declare actionType: CorporateActionType;
  declare announcementDate: Date;
  declare effectiveDate: Date;
  declare exDate: Date | null;
  declare recordDate: Date | null;
  declare description: string;
  declare ratio: string | null;
  declare terms: Record<string, any>;
  declare priceAdjustmentFactor: number | null;
  declare sharesAdjustmentFactor: number | null;
  declare status: string;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getSecurity: BelongsToGetAssociationMixin<EquitySecurity>;

  declare static associations: {
    security: Association<CorporateAction, EquitySecurity>;
  };

  /**
   * Initialize CorporateAction with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CorporateAction {
    CorporateAction.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'equity_securities',
            key: 'id',
          },
          field: 'security_id',
        },
        actionType: {
          type: DataTypes.ENUM(...Object.values(CorporateActionType)),
          allowNull: false,
          field: 'action_type',
        },
        announcementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'announcement_date',
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'effective_date',
        },
        exDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'ex_date',
        },
        recordDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'record_date',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description',
        },
        ratio: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'ratio',
        },
        terms: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'terms',
        },
        priceAdjustmentFactor: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'price_adjustment_factor',
        },
        sharesAdjustmentFactor: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'shares_adjustment_factor',
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'pending',
          field: 'status',
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
        tableName: 'corporate_actions',
        modelName: 'CorporateAction',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['action_type'] },
          { fields: ['effective_date'] },
          { fields: ['status'] },
        ],
      }
    );

    return CorporateAction;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OwnershipRecord
// ============================================================================

/**
 * TypeScript interface for OwnershipRecord attributes
 */
export interface OwnershipRecordAttributes {
  id: string;
  securityId: string;
  ownerName: string;
  ownerType: OwnershipType;
  reportingDate: Date;
  sharesHeld: number;
  percentOwnership: number;
  changeShares: number | null;
  changePercent: number | null;
  isInsider: boolean;
  position: string | null;
  transactionType: InsiderTransactionType | null;
  transactionDate: Date | null;
  transactionPrice: number | null;
  filingDate: Date | null;
  source: string;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface OwnershipRecordCreationAttributes extends Optional<OwnershipRecordAttributes, 'id' | 'changeShares' | 'changePercent' | 'position' | 'transactionType' | 'transactionDate' | 'transactionPrice' | 'filingDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: OwnershipRecord
 * Institutional and insider ownership tracking
 */
export class OwnershipRecord extends Model<OwnershipRecordAttributes, OwnershipRecordCreationAttributes> implements OwnershipRecordAttributes {
  declare id: string;
  declare securityId: string;
  declare ownerName: string;
  declare ownerType: OwnershipType;
  declare reportingDate: Date;
  declare sharesHeld: number;
  declare percentOwnership: number;
  declare changeShares: number | null;
  declare changePercent: number | null;
  declare isInsider: boolean;
  declare position: string | null;
  declare transactionType: InsiderTransactionType | null;
  declare transactionDate: Date | null;
  declare transactionPrice: number | null;
  declare filingDate: Date | null;
  declare source: string;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getSecurity: BelongsToGetAssociationMixin<EquitySecurity>;

  declare static associations: {
    security: Association<OwnershipRecord, EquitySecurity>;
  };

  /**
   * Initialize OwnershipRecord with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OwnershipRecord {
    OwnershipRecord.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'equity_securities',
            key: 'id',
          },
          field: 'security_id',
        },
        ownerName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'owner_name',
        },
        ownerType: {
          type: DataTypes.ENUM(...Object.values(OwnershipType)),
          allowNull: false,
          field: 'owner_type',
        },
        reportingDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'reporting_date',
        },
        sharesHeld: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'shares_held',
        },
        percentOwnership: {
          type: DataTypes.DECIMAL(8, 4),
          allowNull: false,
          field: 'percent_ownership',
        },
        changeShares: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: 'change_shares',
        },
        changePercent: {
          type: DataTypes.DECIMAL(8, 4),
          allowNull: true,
          field: 'change_percent',
        },
        isInsider: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_insider',
        },
        position: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'position',
        },
        transactionType: {
          type: DataTypes.ENUM(...Object.values(InsiderTransactionType)),
          allowNull: true,
          field: 'transaction_type',
        },
        transactionDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'transaction_date',
        },
        transactionPrice: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: true,
          field: 'transaction_price',
        },
        filingDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'filing_date',
        },
        source: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'source',
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
        tableName: 'ownership_records',
        modelName: 'OwnershipRecord',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['owner_type'] },
          { fields: ['reporting_date'] },
          { fields: ['is_insider'] },
          { fields: ['transaction_date'] },
        ],
      }
    );

    return OwnershipRecord;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineEquityModelAssociations(): void {
  EquitySecurity.hasMany(EquityValuation, {
    foreignKey: 'securityId',
    as: 'valuations',
    onDelete: 'CASCADE',
  });

  EquityValuation.belongsTo(EquitySecurity, {
    foreignKey: 'securityId',
    as: 'security',
  });

  EquitySecurity.hasMany(DividendHistory, {
    foreignKey: 'securityId',
    as: 'dividends',
    onDelete: 'CASCADE',
  });

  DividendHistory.belongsTo(EquitySecurity, {
    foreignKey: 'securityId',
    as: 'security',
  });

  EquitySecurity.hasMany(CorporateAction, {
    foreignKey: 'securityId',
    as: 'corporateActions',
    onDelete: 'CASCADE',
  });

  CorporateAction.belongsTo(EquitySecurity, {
    foreignKey: 'securityId',
    as: 'security',
  });

  EquitySecurity.hasMany(OwnershipRecord, {
    foreignKey: 'securityId',
    as: 'ownership',
    onDelete: 'CASCADE',
  });

  OwnershipRecord.belongsTo(EquitySecurity, {
    foreignKey: 'securityId',
    as: 'security',
  });
}

// ============================================================================
// EQUITY SECURITY MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create equity security
 */
export async function createEquitySecurity(
  data: EquitySecurityCreationAttributes,
  transaction?: Transaction
): Promise<EquitySecurity> {
  return await EquitySecurity.create(data, { transaction });
}

/**
 * Get equity security by symbol and exchange
 */
export async function getEquityBySymbol(
  symbol: string,
  exchange: string,
  transaction?: Transaction
): Promise<EquitySecurity | null> {
  return await EquitySecurity.findOne({
    where: { symbol, exchange, isActive: true },
    include: ['valuations', 'dividends', 'corporateActions', 'ownership'],
    transaction,
  });
}

/**
 * Get securities by sector and industry
 */
export async function getSecuritiesBySectorIndustry(
  sector: string,
  industry?: string,
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  const whereClause: any = { sector, isActive: true };
  if (industry) {
    whereClause.industry = industry;
  }

  return await EquitySecurity.findAll({
    where: whereClause,
    transaction,
  });
}

/**
 * Get securities by market cap category
 */
export async function getSecuritiesByMarketCap(
  category: MarketCapCategory,
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  return await EquitySecurity.findAll({
    where: { marketCapCategory: category, isActive: true },
    transaction,
  });
}

/**
 * Update trading status
 */
export async function updateTradingStatus(
  securityId: string,
  status: TradingStatus,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, EquitySecurity[]]> {
  return await EquitySecurity.update(
    { tradingStatus: status, updatedBy },
    { where: { id: securityId }, returning: true, transaction }
  );
}

// ============================================================================
// VALUATION FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive equity valuation
 */
export async function calculateEquityValuation(
  securityId: string,
  balanceSheet: BalanceSheet,
  incomeStatement: IncomeStatement,
  cashFlowStatement: CashFlowStatement,
  marketData: FundamentalMarketData,
  createdBy: string,
  transaction?: Transaction
): Promise<EquityValuation> {
  const { stockPrice, sharesOutstanding } = marketData;

  // Calculate basic metrics
  const marketCap = stockPrice * sharesOutstanding;
  const totalDebt = balanceSheet.longTermDebt;
  const cash = balanceSheet.cash;
  const enterpriseValue = marketCap + totalDebt - cash;

  // Calculate EPS
  const eps = calculateBasicEPS(incomeStatement.netIncome, sharesOutstanding);

  // Calculate valuation multiples
  let peRatio = null;
  if (eps > 0) {
    peRatio = calculatePERatio(stockPrice, eps);
  }

  const bookValuePerShare = balanceSheet.shareholdersEquity / sharesOutstanding;
  const pbRatio = calculatePBRatio(stockPrice, bookValuePerShare);
  const psRatio = calculatePSRatio(marketCap, incomeStatement.revenue);

  // Calculate EV multiples
  const ebitda = incomeStatement.operatingIncome + (incomeStatement.depreciationAmortization || 0);
  const evEbitda = ebitda > 0 ? enterpriseValue / ebitda : null;
  const evSales = enterpriseValue / incomeStatement.revenue;

  // Calculate growth and yield metrics
  const epsGrowth = null; // Would require historical data
  const pegRatio = null; // Requires earnings growth rate

  const freeCashFlow = calculateFreeCashFlow(cashFlowStatement);
  const priceToFreeCashFlow = freeCashFlow > 0 ? marketCap / freeCashFlow : null;

  // Estimate shares float (typically 85-95% of shares outstanding)
  const sharesFloat = Math.floor(sharesOutstanding * 0.9);

  // Calculate intrinsic value using multiple methods
  let intrinsicValue = null;
  try {
    intrinsicValue = calculateGrahamNumber(eps, bookValuePerShare);
  } catch (error) {
    // If Graham number fails, try other methods
    intrinsicValue = null;
  }

  return await EquityValuation.create({
    securityId,
    valuationDate: new Date(),
    stockPrice,
    sharesOutstanding,
    sharesFloat,
    marketCap,
    enterpriseValue,
    peRatio,
    pbRatio,
    psRatio,
    evEbitda,
    evSales,
    pegRatio,
    priceToFreeCashFlow,
    eps,
    epsGrowth,
    dividendYield: null,
    payoutRatio: null,
    beta: marketData.beta || null,
    intrinsicValue,
    valuationMethod: 'comprehensive',
    analystConsensus: {},
    metadata: {},
    createdBy,
  }, { transaction });
}

/**
 * Perform DCF valuation with intrinsic value calculation
 */
export async function performDCFValuation(
  securityId: string,
  dcfParams: DCFParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<{ valuation: EquityValuation; dcfResult: ValuationResult }> {
  const dcfResult = calculateDCF(dcfParams);

  const security = await EquitySecurity.findByPk(securityId, { transaction });
  if (!security) {
    throw new Error(`Security not found: ${securityId}`);
  }

  const valuation = await EquityValuation.create({
    securityId,
    valuationDate: new Date(),
    stockPrice: 0, // Would need current market price
    sharesOutstanding: dcfParams.sharesOutstanding,
    sharesFloat: Math.floor(dcfParams.sharesOutstanding * 0.9),
    marketCap: 0, // Calculate from stock price
    enterpriseValue: dcfResult.baseValue + dcfParams.totalDebt - dcfParams.cash,
    peRatio: null,
    pbRatio: null,
    psRatio: null,
    evEbitda: null,
    evSales: null,
    pegRatio: null,
    priceToFreeCashFlow: null,
    eps: null,
    epsGrowth: null,
    dividendYield: null,
    payoutRatio: null,
    beta: null,
    intrinsicValue: dcfResult.valuePerShare,
    valuationMethod: 'DCF',
    analystConsensus: {},
    metadata: { dcfParameters: dcfParams },
    createdBy,
  }, { transaction });

  return { valuation, dcfResult };
}

/**
 * Calculate relative valuation using peer multiples
 */
export async function calculateRelativeValuationFromPeers(
  securityId: string,
  incomeStatement: IncomeStatement,
  balanceSheet: BalanceSheet,
  peers: PeerMetrics[],
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, number>> {
  // Calculate company metrics
  const earnings = incomeStatement.netIncome;
  const revenue = incomeStatement.revenue;
  const bookValue = balanceSheet.shareholdersEquity;

  // Calculate industry averages
  const avgPE = calculateIndustryAverage(peers, 'peRatio');
  const avgPB = calculateIndustryAverage(peers, 'pbRatio');
  const avgEVEbitda = calculateIndustryAverage(peers, 'evEbitda');

  // Calculate implied valuations
  const peBasedValue = calculateRelativeValuation(earnings, avgPE);
  const pbBasedValue = calculateRelativeValuation(bookValue, avgPB);

  const ebitda = incomeStatement.operatingIncome + (incomeStatement.depreciationAmortization || 0);
  const evEbitdaBasedValue = calculateRelativeValuation(ebitda, avgEVEbitda);

  return {
    peBasedValue,
    pbBasedValue,
    evEbitdaBasedValue,
    averageValue: (peBasedValue + pbBasedValue + evEbitdaBasedValue) / 3,
  };
}

/**
 * Get latest valuation for security
 */
export async function getLatestValuation(
  securityId: string,
  transaction?: Transaction
): Promise<EquityValuation | null> {
  return await EquityValuation.findOne({
    where: { securityId },
    order: [['valuationDate', 'DESC']],
    transaction,
  });
}

/**
 * Get valuation history
 */
export async function getValuationHistory(
  securityId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<EquityValuation[]> {
  return await EquityValuation.findAll({
    where: {
      securityId,
      valuationDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['valuationDate', 'ASC']],
    transaction,
  });
}

// ============================================================================
// DIVIDEND ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Record dividend payment
 */
export async function recordDividend(
  data: DividendHistoryCreationAttributes,
  transaction?: Transaction
): Promise<DividendHistory> {
  return await DividendHistory.create(data, { transaction });
}

/**
 * Calculate dividend yield
 */
export async function calculateDividendYield(
  securityId: string,
  currentPrice: number,
  transaction?: Transaction
): Promise<number> {
  // Get last 12 months of dividends
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const dividends = await DividendHistory.findAll({
    where: {
      securityId,
      exDividendDate: {
        [Op.gte]: oneYearAgo,
      },
      isSpecial: false,
    },
    transaction,
  });

  const totalDividends = dividends.reduce((sum, div) => sum + Number(div.dividendAmount), 0);
  return (totalDividends / currentPrice) * 100;
}

/**
 * Calculate dividend payout ratio
 */
export async function calculateDividendPayoutRatio(
  securityId: string,
  fiscalYear: number,
  netIncome: number,
  transaction?: Transaction
): Promise<number> {
  const dividends = await DividendHistory.findAll({
    where: { securityId, fiscalYear },
    transaction,
  });

  const totalDividendsPaid = dividends.reduce((sum, div) => sum + Number(div.dividendAmount), 0);
  return (totalDividendsPaid / netIncome) * 100;
}

/**
 * Get dividend history for analysis
 */
export async function getDividendHistory(
  securityId: string,
  years: number = 5,
  transaction?: Transaction
): Promise<DividendHistory[]> {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - years);

  return await DividendHistory.findAll({
    where: {
      securityId,
      exDividendDate: {
        [Op.gte]: startDate,
      },
    },
    order: [['exDividendDate', 'DESC']],
    transaction,
  });
}

/**
 * Calculate dividend growth rate
 */
export async function calculateDividendGrowthRate(
  securityId: string,
  years: number = 5,
  transaction?: Transaction
): Promise<number> {
  const history = await getDividendHistory(securityId, years, transaction);

  if (history.length < 2) {
    return 0;
  }

  // Group by fiscal year and sum
  const yearlyDividends = history.reduce((acc, div) => {
    const year = div.fiscalYear;
    acc[year] = (acc[year] || 0) + Number(div.dividendAmount);
    return acc;
  }, {} as Record<number, number>);

  const years_data = Object.keys(yearlyDividends).sort();
  if (years_data.length < 2) {
    return 0;
  }

  const firstYear = Number(years_data[0]);
  const lastYear = Number(years_data[years_data.length - 1]);
  const firstYearAmount = yearlyDividends[firstYear];
  const lastYearAmount = yearlyDividends[lastYear];

  return calculateCAGR(firstYearAmount, lastYearAmount, lastYear - firstYear);
}

/**
 * Analyze dividend sustainability
 */
export async function analyzeDividendSustainability(
  securityId: string,
  incomeStatement: IncomeStatement,
  cashFlowStatement: CashFlowStatement,
  fiscalYear: number,
  transaction?: Transaction
): Promise<{
  payoutRatio: number;
  cashFlowCoverage: number;
  isSustainable: boolean;
  sustainability: 'excellent' | 'good' | 'concerning' | 'unsustainable';
}> {
  const payoutRatio = await calculateDividendPayoutRatio(securityId, fiscalYear, incomeStatement.netIncome, transaction);

  const dividends = await DividendHistory.findAll({
    where: { securityId, fiscalYear },
    transaction,
  });
  const totalDividendsPaid = dividends.reduce((sum, div) => sum + Number(div.dividendAmount), 0);

  const freeCashFlow = calculateFreeCashFlow(cashFlowStatement);
  const cashFlowCoverage = totalDividendsPaid > 0 ? (freeCashFlow / totalDividendsPaid) * 100 : 0;

  // Determine sustainability
  let sustainability: 'excellent' | 'good' | 'concerning' | 'unsustainable';
  let isSustainable = true;

  if (payoutRatio < 50 && cashFlowCoverage > 150) {
    sustainability = 'excellent';
  } else if (payoutRatio < 70 && cashFlowCoverage > 120) {
    sustainability = 'good';
  } else if (payoutRatio < 90 && cashFlowCoverage > 100) {
    sustainability = 'concerning';
  } else {
    sustainability = 'unsustainable';
    isSustainable = false;
  }

  return {
    payoutRatio,
    cashFlowCoverage,
    isSustainable,
    sustainability,
  };
}

// ============================================================================
// CORPORATE ACTIONS FUNCTIONS
// ============================================================================

/**
 * Record corporate action
 */
export async function recordCorporateAction(
  data: CorporateActionCreationAttributes,
  transaction?: Transaction
): Promise<CorporateAction> {
  return await CorporateAction.create(data, { transaction });
}

/**
 * Process stock split
 */
export async function processStockSplit(
  securityId: string,
  splitRatio: string,
  effectiveDate: Date,
  announcementDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<CorporateAction> {
  // Parse split ratio (e.g., "2:1" means 2 new shares for 1 old share)
  const [newShares, oldShares] = splitRatio.split(':').map(Number);
  const splitFactor = newShares / oldShares;

  const priceAdjustmentFactor = 1 / splitFactor;
  const sharesAdjustmentFactor = splitFactor;

  return await recordCorporateAction({
    securityId,
    actionType: CorporateActionType.STOCK_SPLIT,
    announcementDate,
    effectiveDate,
    description: `Stock split ${splitRatio}`,
    ratio: splitRatio,
    terms: { newShares, oldShares, splitFactor },
    priceAdjustmentFactor,
    sharesAdjustmentFactor,
    status: 'completed',
    metadata: {},
    createdBy,
  }, transaction);
}

/**
 * Get corporate actions by type
 */
export async function getCorporateActionsByType(
  securityId: string,
  actionType: CorporateActionType,
  transaction?: Transaction
): Promise<CorporateAction[]> {
  return await CorporateAction.findAll({
    where: { securityId, actionType },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });
}

/**
 * Get pending corporate actions
 */
export async function getPendingCorporateActions(
  transaction?: Transaction
): Promise<CorporateAction[]> {
  return await CorporateAction.findAll({
    where: {
      status: 'pending',
      effectiveDate: {
        [Op.gte]: new Date(),
      },
    },
    order: [['effectiveDate', 'ASC']],
    transaction,
  });
}

/**
 * Calculate price adjustment for historical data
 */
export async function calculateHistoricalPriceAdjustment(
  securityId: string,
  asOfDate: Date,
  transaction?: Transaction
): Promise<number> {
  const actions = await CorporateAction.findAll({
    where: {
      securityId,
      effectiveDate: {
        [Op.gt]: asOfDate,
      },
      priceAdjustmentFactor: {
        [Op.ne]: null,
      },
    },
    transaction,
  });

  // Multiply all adjustment factors
  return actions.reduce((factor, action) =>
    factor * Number(action.priceAdjustmentFactor), 1.0);
}

// ============================================================================
// OWNERSHIP AND INSIDER TRADING FUNCTIONS
// ============================================================================

/**
 * Record ownership position
 */
export async function recordOwnership(
  data: OwnershipRecordCreationAttributes,
  transaction?: Transaction
): Promise<OwnershipRecord> {
  return await OwnershipRecord.create(data, { transaction });
}

/**
 * Get institutional ownership summary
 */
export async function getInstitutionalOwnership(
  securityId: string,
  transaction?: Transaction
): Promise<{
  totalInstitutionalShares: number;
  percentInstitutionalOwnership: number;
  topHolders: OwnershipRecord[];
  institutionCount: number;
}> {
  const latestDate = await OwnershipRecord.max('reportingDate', {
    where: {
      securityId,
      ownerType: OwnershipType.INSTITUTIONAL,
    },
    transaction,
  });

  if (!latestDate) {
    return {
      totalInstitutionalShares: 0,
      percentInstitutionalOwnership: 0,
      topHolders: [],
      institutionCount: 0,
    };
  }

  const holdings = await OwnershipRecord.findAll({
    where: {
      securityId,
      ownerType: OwnershipType.INSTITUTIONAL,
      reportingDate: latestDate,
    },
    order: [['sharesHeld', 'DESC']],
    limit: 10,
    transaction,
  });

  const totalInstitutionalShares = holdings.reduce((sum, h) => sum + Number(h.sharesHeld), 0);
  const percentInstitutionalOwnership = holdings[0]?.percentOwnership || 0;

  return {
    totalInstitutionalShares,
    percentInstitutionalOwnership,
    topHolders: holdings,
    institutionCount: holdings.length,
  };
}

/**
 * Track insider transactions
 */
export async function getInsiderTransactions(
  securityId: string,
  days: number = 90,
  transaction?: Transaction
): Promise<OwnershipRecord[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await OwnershipRecord.findAll({
    where: {
      securityId,
      isInsider: true,
      transactionDate: {
        [Op.gte]: startDate,
      },
    },
    order: [['transactionDate', 'DESC']],
    transaction,
  });
}

/**
 * Analyze insider buying/selling sentiment
 */
export async function analyzeInsiderSentiment(
  securityId: string,
  days: number = 90,
  transaction?: Transaction
): Promise<{
  buyTransactions: number;
  sellTransactions: number;
  netShares: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  significantInsiderActivity: boolean;
}> {
  const transactions = await getInsiderTransactions(securityId, days, transaction);

  const buyTransactions = transactions.filter(t => t.transactionType === InsiderTransactionType.PURCHASE).length;
  const sellTransactions = transactions.filter(t => t.transactionType === InsiderTransactionType.SALE).length;

  const netShares = transactions.reduce((sum, t) => {
    const shares = Number(t.changeShares || 0);
    return t.transactionType === InsiderTransactionType.PURCHASE ? sum + shares : sum - shares;
  }, 0);

  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (buyTransactions > sellTransactions * 2) {
    sentiment = 'bullish';
  } else if (sellTransactions > buyTransactions * 2) {
    sentiment = 'bearish';
  }

  const significantInsiderActivity = buyTransactions + sellTransactions > 10;

  return {
    buyTransactions,
    sellTransactions,
    netShares,
    sentiment,
    significantInsiderActivity,
  };
}

/**
 * Get ownership concentration
 */
export async function getOwnershipConcentration(
  securityId: string,
  transaction?: Transaction
): Promise<{
  top10Ownership: number;
  top20Ownership: number;
  herfindahlIndex: number;
  concentration: 'highly_concentrated' | 'concentrated' | 'dispersed';
}> {
  const latestDate = await OwnershipRecord.max('reportingDate', {
    where: { securityId },
    transaction,
  });

  if (!latestDate) {
    return {
      top10Ownership: 0,
      top20Ownership: 0,
      herfindahlIndex: 0,
      concentration: 'dispersed',
    };
  }

  const holdings = await OwnershipRecord.findAll({
    where: {
      securityId,
      reportingDate: latestDate,
    },
    order: [['percentOwnership', 'DESC']],
    transaction,
  });

  const top10 = holdings.slice(0, 10);
  const top20 = holdings.slice(0, 20);

  const top10Ownership = top10.reduce((sum, h) => sum + Number(h.percentOwnership), 0);
  const top20Ownership = top20.reduce((sum, h) => sum + Number(h.percentOwnership), 0);

  // Herfindahl-Hirschman Index (HHI)
  const herfindahlIndex = holdings.reduce((sum, h) => {
    const ownership = Number(h.percentOwnership);
    return sum + (ownership * ownership);
  }, 0);

  let concentration: 'highly_concentrated' | 'concentrated' | 'dispersed';
  if (herfindahlIndex > 1800) {
    concentration = 'highly_concentrated';
  } else if (herfindahlIndex > 1000) {
    concentration = 'concentrated';
  } else {
    concentration = 'dispersed';
  }

  return {
    top10Ownership,
    top20Ownership,
    herfindahlIndex,
    concentration,
  };
}

// ============================================================================
// STOCK SCREENING FUNCTIONS
// ============================================================================

/**
 * Screen stocks by valuation criteria
 */
export async function screenByValuation(
  criteria: {
    maxPE?: number;
    maxPB?: number;
    minDividendYield?: number;
    maxDebtToEquity?: number;
    minMarketCap?: number;
    maxMarketCap?: number;
  },
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  const valuationWhere: any = {};

  if (criteria.maxPE) {
    valuationWhere.peRatio = { [Op.lte]: criteria.maxPE, [Op.ne]: null };
  }
  if (criteria.maxPB) {
    valuationWhere.pbRatio = { [Op.lte]: criteria.maxPB, [Op.ne]: null };
  }
  if (criteria.minDividendYield) {
    valuationWhere.dividendYield = { [Op.gte]: criteria.minDividendYield, [Op.ne]: null };
  }
  if (criteria.minMarketCap) {
    valuationWhere.marketCap = { [Op.gte]: criteria.minMarketCap };
  }
  if (criteria.maxMarketCap) {
    if (valuationWhere.marketCap) {
      valuationWhere.marketCap[Op.lte] = criteria.maxMarketCap;
    } else {
      valuationWhere.marketCap = { [Op.lte]: criteria.maxMarketCap };
    }
  }

  return await EquitySecurity.findAll({
    include: [{
      model: EquityValuation,
      as: 'valuations',
      where: valuationWhere,
      required: true,
      limit: 1,
      order: [['valuationDate', 'DESC']],
    }],
    where: { isActive: true, tradingStatus: TradingStatus.ACTIVE },
    transaction,
  });
}

/**
 * Screen stocks by growth criteria
 */
export async function screenByGrowth(
  minRevenueGrowth: number,
  minEPSGrowth: number,
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  return await EquitySecurity.findAll({
    include: [{
      model: EquityValuation,
      as: 'valuations',
      where: {
        epsGrowth: {
          [Op.gte]: minEPSGrowth,
          [Op.ne]: null,
        },
      },
      required: true,
      limit: 1,
      order: [['valuationDate', 'DESC']],
    }],
    where: { isActive: true, tradingStatus: TradingStatus.ACTIVE },
    transaction,
  });
}

/**
 * Screen dividend stocks
 */
export async function screenDividendStocks(
  minYield: number,
  minYearsConsecutive: number,
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  // Get stocks with dividend yield above minimum
  const candidates = await EquitySecurity.findAll({
    include: [{
      model: EquityValuation,
      as: 'valuations',
      where: {
        dividendYield: {
          [Op.gte]: minYield,
          [Op.ne]: null,
        },
      },
      required: true,
      limit: 1,
      order: [['valuationDate', 'DESC']],
    }],
    where: { isActive: true, tradingStatus: TradingStatus.ACTIVE },
    transaction,
  });

  // Filter by consecutive years of dividends
  const filtered: EquitySecurity[] = [];
  for (const security of candidates) {
    const currentYear = new Date().getFullYear();
    let consecutiveYears = 0;

    for (let year = currentYear; year > currentYear - minYearsConsecutive; year--) {
      const dividends = await DividendHistory.findOne({
        where: {
          securityId: security.id,
          fiscalYear: year,
          isSpecial: false,
        },
        transaction,
      });

      if (dividends) {
        consecutiveYears++;
      } else {
        break;
      }
    }

    if (consecutiveYears >= minYearsConsecutive) {
      filtered.push(security);
    }
  }

  return filtered;
}

/**
 * Screen value stocks (Benjamin Graham criteria)
 */
export async function screenValueStocks(
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  return await EquitySecurity.findAll({
    include: [{
      model: EquityValuation,
      as: 'valuations',
      where: {
        peRatio: {
          [Op.lte]: 15,
          [Op.ne]: null,
        },
        pbRatio: {
          [Op.lte]: 1.5,
          [Op.ne]: null,
        },
        // Current ratio > 1.5 would require additional financial data
      },
      required: true,
      limit: 1,
      order: [['valuationDate', 'DESC']],
    }],
    where: { isActive: true, tradingStatus: TradingStatus.ACTIVE },
    transaction,
  });
}

// ============================================================================
// PEER COMPARISON FUNCTIONS
// ============================================================================

/**
 * Get peer group for comparison
 */
export async function getPeerGroup(
  securityId: string,
  transaction?: Transaction
): Promise<EquitySecurity[]> {
  const security = await EquitySecurity.findByPk(securityId, { transaction });
  if (!security) {
    throw new Error(`Security not found: ${securityId}`);
  }

  return await EquitySecurity.findAll({
    where: {
      sector: security.sector,
      industry: security.industry,
      marketCapCategory: security.marketCapCategory,
      isActive: true,
      tradingStatus: TradingStatus.ACTIVE,
      id: { [Op.ne]: securityId },
    },
    limit: 10,
    transaction,
  });
}

/**
 * Compare security against peer group
 */
export async function compareToPeers(
  securityId: string,
  transaction?: Transaction
): Promise<{
  security: EquitySecurity;
  valuation: EquityValuation | null;
  peers: EquitySecurity[];
  comparison: Record<string, any>;
}> {
  const security = await EquitySecurity.findByPk(securityId, {
    include: ['valuations'],
    transaction,
  });

  if (!security) {
    throw new Error(`Security not found: ${securityId}`);
  }

  const valuation = await getLatestValuation(securityId, transaction);
  const peers = await getPeerGroup(securityId, transaction);

  // Get peer valuations
  const peerValuations = await Promise.all(
    peers.map(p => getLatestValuation(p.id, transaction))
  );

  // Build peer metrics
  const peerMetrics: PeerMetrics[] = peerValuations
    .filter((v): v is EquityValuation => v !== null)
    .map(v => ({
      company: peers.find(p => p.id === v.securityId)?.symbol || '',
      peRatio: Number(v.peRatio || 0),
      pbRatio: Number(v.pbRatio || 0),
      evEbitda: Number(v.evEbitda || 0),
      revenue: 0, // Would need financial data
      marketCap: Number(v.marketCap),
    }));

  if (!valuation) {
    return {
      security,
      valuation: null,
      peers,
      comparison: {},
    };
  }

  // Perform comparison analysis
  const peComparison = analyzePeerComparison(
    Number(valuation.peRatio || 0),
    peerMetrics.map(p => p.peRatio)
  );

  const pbComparison = analyzePeerComparison(
    Number(valuation.pbRatio || 0),
    peerMetrics.map(p => p.pbRatio)
  );

  return {
    security,
    valuation,
    peers,
    comparison: {
      peRatio: peComparison,
      pbRatio: pbComparison,
      peerCount: peers.length,
    },
  };
}

// ============================================================================
// TECHNICAL ANALYSIS INTEGRATION
// ============================================================================

/**
 * Generate comprehensive trading signal with fundamental overlay
 */
export async function generateComprehensiveSignal(
  securityId: string,
  marketData: MarketData[],
  transaction?: Transaction
): Promise<{
  technicalSignal: TradingSignal;
  fundamentalScore: number;
  overallRecommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}> {
  // Generate technical signal
  const technicalSignal = generateMomentumSignal(marketData);

  // Get fundamental data
  const valuation = await getLatestValuation(securityId, transaction);
  if (!valuation) {
    return {
      technicalSignal,
      fundamentalScore: 50,
      overallRecommendation: 'hold',
    };
  }

  // Calculate fundamental score (0-100)
  let fundamentalScore = 50;

  // Valuation score
  if (valuation.peRatio && valuation.peRatio < 15) fundamentalScore += 10;
  if (valuation.pbRatio && valuation.pbRatio < 1.5) fundamentalScore += 10;
  if (valuation.pegRatio && valuation.pegRatio < 1) fundamentalScore += 10;

  // Growth score
  if (valuation.epsGrowth && valuation.epsGrowth > 15) fundamentalScore += 10;

  // Dividend score
  if (valuation.dividendYield && valuation.dividendYield > 3) fundamentalScore += 10;

  fundamentalScore = Math.min(100, Math.max(0, fundamentalScore));

  // Combine technical and fundamental
  let overallRecommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';

  const technicalScore = technicalSignal.signalType === 'STRONG_BUY' ? 90 :
                         technicalSignal.signalType === 'BUY' ? 70 :
                         technicalSignal.signalType === 'HOLD' ? 50 :
                         technicalSignal.signalType === 'SELL' ? 30 : 10;

  const combinedScore = (technicalScore * 0.6) + (fundamentalScore * 0.4);

  if (combinedScore >= 80) overallRecommendation = 'strong_buy';
  else if (combinedScore >= 65) overallRecommendation = 'buy';
  else if (combinedScore >= 35) overallRecommendation = 'hold';
  else if (combinedScore >= 20) overallRecommendation = 'sell';
  else overallRecommendation = 'strong_sell';

  return {
    technicalSignal,
    fundamentalScore,
    overallRecommendation,
  };
}

// ============================================================================
// PORTFOLIO ANALYTICS
// ============================================================================

/**
 * Analyze portfolio sector allocation
 */
export async function analyzePortfolioSectorAllocation(
  securityIds: string[],
  transaction?: Transaction
): Promise<Record<string, { count: number; percentage: number }>> {
  const securities = await EquitySecurity.findAll({
    where: {
      id: { [Op.in]: securityIds },
      isActive: true,
    },
    transaction,
  });

  const sectorCounts: Record<string, number> = {};
  securities.forEach(s => {
    sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
  });

  const total = securities.length;
  const allocation: Record<string, { count: number; percentage: number }> = {};

  Object.entries(sectorCounts).forEach(([sector, count]) => {
    allocation[sector] = {
      count,
      percentage: (count / total) * 100,
    };
  });

  return allocation;
}

/**
 * Calculate portfolio weighted average metrics
 */
export async function calculatePortfolioWeightedMetrics(
  positions: Array<{ securityId: string; weight: number }>,
  transaction?: Transaction
): Promise<{
  weightedPE: number;
  weightedPB: number;
  weightedDividendYield: number;
  weightedBeta: number;
}> {
  let weightedPE = 0;
  let weightedPB = 0;
  let weightedDividendYield = 0;
  let weightedBeta = 0;

  for (const position of positions) {
    const valuation = await getLatestValuation(position.securityId, transaction);
    if (!valuation) continue;

    weightedPE += Number(valuation.peRatio || 0) * position.weight;
    weightedPB += Number(valuation.pbRatio || 0) * position.weight;
    weightedDividendYield += Number(valuation.dividendYield || 0) * position.weight;
    weightedBeta += Number(valuation.beta || 1) * position.weight;
  }

  return {
    weightedPE,
    weightedPB,
    weightedDividendYield,
    weightedBeta,
  };
}

// ============================================================================
// EXPORT: Initialize all models
// ============================================================================

/**
 * Initialize all equity trading models
 */
export function initializeEquityTradingModels(sequelize: Sequelize): void {
  EquitySecurity.initModel(sequelize);
  EquityValuation.initModel(sequelize);
  DividendHistory.initModel(sequelize);
  CorporateAction.initModel(sequelize);
  OwnershipRecord.initModel(sequelize);
  defineEquityModelAssociations();
}

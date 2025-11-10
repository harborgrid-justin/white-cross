/**
 * LOC: TRADING-COMP-FIXINC-001
 * File: /reuse/trading/composites/fixed-income-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../fixed-income-analytics-kit
 *   - ../credit-analysis-kit
 *
 * DOWNSTREAM (imported by):
 *   - Fixed income controllers
 *   - Bond pricing services
 *   - Credit risk modules
 *   - Portfolio management systems
 *   - Bloomberg Terminal integration services
 */

/**
 * File: /reuse/trading/composites/fixed-income-analytics-composite.ts
 * Locator: WC-COMP-TRADING-FIXINC-001
 * Purpose: Bloomberg Terminal Fixed Income Analytics Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, fixed-income-analytics-kit, credit-analysis-kit
 * Downstream: Bond controllers, pricing services, credit risk modules, portfolio management
 * Dependencies: NestJS 10.x, Sequelize 6.x, Swagger 7.x, TypeScript 5.x
 * Exports: 43 composed functions for comprehensive fixed income analytics and bond management
 *
 * LLM Context: Bloomberg Terminal-level fixed income analytics composite for trading platform.
 * Provides institutional-grade bond pricing, yield curve analysis, credit risk assessment,
 * duration/convexity calculations, MBS/ABS analytics, portfolio optimization, cashflow modeling,
 * and comprehensive fixed income instrument management competing with Bloomberg Terminal (YAS, CDSW, FWCV).
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
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

// Fixed Income Analytics Kit imports
import {
  priceFromYield,
  yieldFromPrice,
  zeroCouponBondPrice,
  floatingRateNotePrice,
  accruedInterest,
  macaulayDuration,
  modifiedDuration,
  effectiveDuration,
  convexity,
  effectiveConvexity,
  dollarDuration,
  yieldToMaturity,
  yieldToCall,
  yieldToPut,
  yieldToWorst,
  currentYield,
  generateBondCashFlows,
  presentValueOfCashFlows,
  bondLadderAnalysis,
  bootstrapYieldCurve,
  nelsonSiegelCurve,
  evaluateNelsonSiegel,
  cubicSplineInterpolation,
  linearInterpolation,
  forwardRateFromSpot,
  zSpreadCalculation,
  optionAdjustedSpread,
  mbsPrepaymentPSA,
  mbsWeightedAverageLife,
  absCashFlowWaterfall,
  callableBondPrice,
  putableBondPrice,
  FixedRateBond,
  FloatingRateNote,
  ZeroCouponBond,
  CallableBond,
  PutableBond,
  CashFlow,
  YieldCurve,
  YieldCurvePoint,
  NelsonSiegelParameters,
  DayCountConvention,
  PaymentFrequency,
  Percentage,
  BasisPoints,
  asPercentage,
  asBasisPoints,
  bpsToPercentage,
} from '../fixed-income-analytics-kit';

// Credit Analysis Kit imports
import {
  calculateAltmanZScore,
  calculateCreditScore,
  assignCreditRating,
  calculateDistanceToDefault,
  calculateMertonDefaultProbability,
  calculateKMVDefaultProbability,
  calculateImpliedDefaultProbabilityFromCDS,
  calculateCreditSpread,
  calculateZSpread,
  calculateCDSFairSpread,
  calculateCDSPresentValue,
  calculateCDSDuration,
  calculateCVA,
  calculateDVA,
  calculateBilateralCVA,
  estimateHistoricalRecoveryRate,
  getIndustryAverageRecoveryRate,
  bootstrapCDSCurve,
  CreditRating,
  FinancialData,
  CreditMetrics,
  BondData,
  CDSContract,
  DefaultProbabilityCurve,
  CVAResult,
} from '../credit-analysis-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Bond instrument classification
 */
export enum BondInstrumentType {
  TREASURY = 'treasury',
  CORPORATE = 'corporate',
  MUNICIPAL = 'municipal',
  AGENCY = 'agency',
  MORTGAGE_BACKED = 'mortgage_backed',
  ASSET_BACKED = 'asset_backed',
  CONVERTIBLE = 'convertible',
  FLOATING_RATE = 'floating_rate',
  ZERO_COUPON = 'zero_coupon',
  INFLATION_LINKED = 'inflation_linked',
}

/**
 * Market data source
 */
export enum MarketDataSource {
  BLOOMBERG = 'bloomberg',
  REUTERS = 'reuters',
  INTERNAL = 'internal',
  EXCHANGE = 'exchange',
  MANUAL = 'manual',
}

/**
 * Pricing methodology
 */
export enum PricingMethod {
  YIELD_TO_MATURITY = 'yield_to_maturity',
  SPOT_CURVE = 'spot_curve',
  FORWARD_CURVE = 'forward_curve',
  MONTE_CARLO = 'monte_carlo',
  BINOMIAL_TREE = 'binomial_tree',
  MATRIX_PRICING = 'matrix_pricing',
}

/**
 * Portfolio strategy type
 */
export enum PortfolioStrategy {
  DURATION_MATCHING = 'duration_matching',
  IMMUNIZATION = 'immunization',
  BARBELL = 'barbell',
  BULLET = 'bullet',
  LADDER = 'ladder',
  TOTAL_RETURN = 'total_return',
}

/**
 * Credit quality classification
 */
export enum CreditQuality {
  INVESTMENT_GRADE = 'investment_grade',
  HIGH_YIELD = 'high_yield',
  SPECULATIVE = 'speculative',
  DEFAULT = 'default',
}

/**
 * Yield curve shape
 */
export enum YieldCurveShape {
  NORMAL = 'normal',
  INVERTED = 'inverted',
  FLAT = 'flat',
  HUMPED = 'humped',
}

// ============================================================================
// SEQUELIZE MODEL: BondInstrument
// ============================================================================

/**
 * TypeScript interface for BondInstrument attributes
 */
export interface BondInstrumentAttributes {
  id: string;
  cusip: string;
  isin: string | null;
  ticker: string | null;
  instrumentType: BondInstrumentType;
  issuerName: string;
  issueDate: Date;
  maturityDate: Date;
  faceValue: number;
  couponRate: number;
  paymentFrequency: number;
  dayCountConvention: string;
  callable: boolean;
  putable: boolean;
  callSchedule: Record<string, any>[] | null;
  putSchedule: Record<string, any>[] | null;
  sinkingFund: boolean;
  creditRating: string | null;
  sector: string | null;
  subsector: string | null;
  country: string;
  currency: string;
  outstandingAmount: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BondInstrumentCreationAttributes extends Optional<BondInstrumentAttributes, 'id' | 'isin' | 'ticker' | 'callSchedule' | 'putSchedule' | 'creditRating' | 'sector' | 'subsector' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BondInstrument
 * Core bond instrument data and characteristics
 */
export class BondInstrument extends Model<BondInstrumentAttributes, BondInstrumentCreationAttributes> implements BondInstrumentAttributes {
  declare id: string;
  declare cusip: string;
  declare isin: string | null;
  declare ticker: string | null;
  declare instrumentType: BondInstrumentType;
  declare issuerName: string;
  declare issueDate: Date;
  declare maturityDate: Date;
  declare faceValue: number;
  declare couponRate: number;
  declare paymentFrequency: number;
  declare dayCountConvention: string;
  declare callable: boolean;
  declare putable: boolean;
  declare callSchedule: Record<string, any>[] | null;
  declare putSchedule: Record<string, any>[] | null;
  declare sinkingFund: boolean;
  declare creditRating: string | null;
  declare sector: string | null;
  declare subsector: string | null;
  declare country: string;
  declare currency: string;
  declare outstandingAmount: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getPricingScenarios: HasManyGetAssociationsMixin<BondPricingScenario>;
  declare addPricingScenario: HasManyAddAssociationMixin<BondPricingScenario, string>;
  declare getCreditAnalyses: HasManyGetAssociationsMixin<BondCreditAnalysis>;

  declare static associations: {
    pricingScenarios: Association<BondInstrument, BondPricingScenario>;
    creditAnalyses: Association<BondInstrument, BondCreditAnalysis>;
    portfolioHoldings: Association<BondInstrument, PortfolioHolding>;
  };

  /**
   * Initialize BondInstrument with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BondInstrument {
    BondInstrument.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        cusip: {
          type: DataTypes.STRING(9),
          allowNull: false,
          unique: true,
          field: 'cusip',
        },
        isin: {
          type: DataTypes.STRING(12),
          allowNull: true,
          unique: true,
          field: 'isin',
        },
        ticker: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'ticker',
        },
        instrumentType: {
          type: DataTypes.ENUM(...Object.values(BondInstrumentType)),
          allowNull: false,
          field: 'instrument_type',
        },
        issuerName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'issuer_name',
        },
        issueDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'issue_date',
        },
        maturityDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'maturity_date',
        },
        faceValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'face_value',
        },
        couponRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'coupon_rate',
        },
        paymentFrequency: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'payment_frequency',
        },
        dayCountConvention: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'day_count_convention',
        },
        callable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'callable',
        },
        putable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'putable',
        },
        callSchedule: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'call_schedule',
        },
        putSchedule: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'put_schedule',
        },
        sinkingFund: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'sinking_fund',
        },
        creditRating: {
          type: DataTypes.STRING(10),
          allowNull: true,
          field: 'credit_rating',
        },
        sector: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'sector',
        },
        subsector: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'subsector',
        },
        country: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'country',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        outstandingAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'outstanding_amount',
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
        tableName: 'bond_instruments',
        modelName: 'BondInstrument',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['cusip'] },
          { fields: ['isin'] },
          { fields: ['instrument_type'] },
          { fields: ['credit_rating'] },
          { fields: ['maturity_date'] },
          { fields: ['issuer_name'] },
        ],
      }
    );

    return BondInstrument;
  }
}

// ============================================================================
// SEQUELIZE MODEL: YieldCurveConfiguration
// ============================================================================

/**
 * TypeScript interface for YieldCurveConfiguration attributes
 */
export interface YieldCurveConfigurationAttributes {
  id: string;
  name: string;
  description: string | null;
  curveType: string;
  currency: string;
  dataPoints: Record<string, any>[];
  interpolationMethod: string;
  modelParameters: Record<string, any> | null;
  effectiveDate: Date;
  expirationDate: Date | null;
  dataSource: MarketDataSource;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface YieldCurveConfigurationCreationAttributes extends Optional<YieldCurveConfigurationAttributes, 'id' | 'description' | 'modelParameters' | 'expirationDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: YieldCurveConfiguration
 * Yield curve configurations and term structure models
 */
export class YieldCurveConfiguration extends Model<YieldCurveConfigurationAttributes, YieldCurveConfigurationCreationAttributes> implements YieldCurveConfigurationAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare curveType: string;
  declare currency: string;
  declare dataPoints: Record<string, any>[];
  declare interpolationMethod: string;
  declare modelParameters: Record<string, any> | null;
  declare effectiveDate: Date;
  declare expirationDate: Date | null;
  declare dataSource: MarketDataSource;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize YieldCurveConfiguration with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof YieldCurveConfiguration {
    YieldCurveConfiguration.init(
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
          unique: true,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        curveType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'curve_type',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        dataPoints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'data_points',
        },
        interpolationMethod: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'interpolation_method',
        },
        modelParameters: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'model_parameters',
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'effective_date',
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expiration_date',
        },
        dataSource: {
          type: DataTypes.ENUM(...Object.values(MarketDataSource)),
          allowNull: false,
          field: 'data_source',
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
        tableName: 'yield_curve_configurations',
        modelName: 'YieldCurveConfiguration',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['curve_type'] },
          { fields: ['currency'] },
          { fields: ['effective_date'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return YieldCurveConfiguration;
  }
}

// ============================================================================
// SEQUELIZE MODEL: BondCreditAnalysis
// ============================================================================

/**
 * TypeScript interface for BondCreditAnalysis attributes
 */
export interface BondCreditAnalysisAttributes {
  id: string;
  bondInstrumentId: string;
  analysisDate: Date;
  creditRating: string;
  creditScore: number;
  probabilityOfDefault: number;
  lossGivenDefault: number;
  expectedLoss: number;
  creditSpread: number;
  zSpread: number | null;
  optionAdjustedSpread: number | null;
  distanceToDefault: number | null;
  recoveryRate: number;
  cdsSpread: number | null;
  cvaAmount: number | null;
  creditQuality: CreditQuality;
  riskFactors: Record<string, any>[];
  financialMetrics: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BondCreditAnalysisCreationAttributes extends Optional<BondCreditAnalysisAttributes, 'id' | 'zSpread' | 'optionAdjustedSpread' | 'distanceToDefault' | 'cdsSpread' | 'cvaAmount' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BondCreditAnalysis
 * Credit risk analysis and metrics for bonds
 */
export class BondCreditAnalysis extends Model<BondCreditAnalysisAttributes, BondCreditAnalysisCreationAttributes> implements BondCreditAnalysisAttributes {
  declare id: string;
  declare bondInstrumentId: string;
  declare analysisDate: Date;
  declare creditRating: string;
  declare creditScore: number;
  declare probabilityOfDefault: number;
  declare lossGivenDefault: number;
  declare expectedLoss: number;
  declare creditSpread: number;
  declare zSpread: number | null;
  declare optionAdjustedSpread: number | null;
  declare distanceToDefault: number | null;
  declare recoveryRate: number;
  declare cdsSpread: number | null;
  declare cvaAmount: number | null;
  declare creditQuality: CreditQuality;
  declare riskFactors: Record<string, any>[];
  declare financialMetrics: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getBondInstrument: BelongsToGetAssociationMixin<BondInstrument>;

  /**
   * Initialize BondCreditAnalysis with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BondCreditAnalysis {
    BondCreditAnalysis.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        bondInstrumentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'bond_instruments',
            key: 'id',
          },
          field: 'bond_instrument_id',
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'analysis_date',
        },
        creditRating: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'credit_rating',
        },
        creditScore: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'credit_score',
        },
        probabilityOfDefault: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: false,
          field: 'probability_of_default',
        },
        lossGivenDefault: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: false,
          field: 'loss_given_default',
        },
        expectedLoss: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'expected_loss',
        },
        creditSpread: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'credit_spread',
        },
        zSpread: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'z_spread',
        },
        optionAdjustedSpread: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'option_adjusted_spread',
        },
        distanceToDefault: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'distance_to_default',
        },
        recoveryRate: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: false,
          field: 'recovery_rate',
        },
        cdsSpread: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'cds_spread',
        },
        cvaAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: true,
          field: 'cva_amount',
        },
        creditQuality: {
          type: DataTypes.ENUM(...Object.values(CreditQuality)),
          allowNull: false,
          field: 'credit_quality',
        },
        riskFactors: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'risk_factors',
        },
        financialMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'financial_metrics',
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
        tableName: 'bond_credit_analyses',
        modelName: 'BondCreditAnalysis',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['bond_instrument_id'] },
          { fields: ['analysis_date'] },
          { fields: ['credit_rating'] },
          { fields: ['credit_quality'] },
        ],
      }
    );

    return BondCreditAnalysis;
  }
}

// ============================================================================
// SEQUELIZE MODEL: BondPricingScenario
// ============================================================================

/**
 * TypeScript interface for BondPricingScenario attributes
 */
export interface BondPricingScenarioAttributes {
  id: string;
  bondInstrumentId: string;
  scenarioName: string;
  pricingDate: Date;
  settlementDate: Date;
  yieldToMaturity: number;
  cleanPrice: number;
  dirtyPrice: number;
  accruedInterest: number;
  macaulayDuration: number;
  modifiedDuration: number;
  effectiveDuration: number | null;
  convexity: number;
  dv01: number;
  yieldToCall: number | null;
  yieldToPut: number | null;
  yieldToWorst: number | null;
  currentYield: number;
  pricingMethod: PricingMethod;
  yieldCurveId: string | null;
  marketDataSource: MarketDataSource;
  assumptions: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BondPricingScenarioCreationAttributes extends Optional<BondPricingScenarioAttributes, 'id' | 'effectiveDuration' | 'yieldToCall' | 'yieldToPut' | 'yieldToWorst' | 'yieldCurveId' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BondPricingScenario
 * Bond pricing scenarios and valuation results
 */
export class BondPricingScenario extends Model<BondPricingScenarioAttributes, BondPricingScenarioCreationAttributes> implements BondPricingScenarioAttributes {
  declare id: string;
  declare bondInstrumentId: string;
  declare scenarioName: string;
  declare pricingDate: Date;
  declare settlementDate: Date;
  declare yieldToMaturity: number;
  declare cleanPrice: number;
  declare dirtyPrice: number;
  declare accruedInterest: number;
  declare macaulayDuration: number;
  declare modifiedDuration: number;
  declare effectiveDuration: number | null;
  declare convexity: number;
  declare dv01: number;
  declare yieldToCall: number | null;
  declare yieldToPut: number | null;
  declare yieldToWorst: number | null;
  declare currentYield: number;
  declare pricingMethod: PricingMethod;
  declare yieldCurveId: string | null;
  declare marketDataSource: MarketDataSource;
  declare assumptions: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize BondPricingScenario with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BondPricingScenario {
    BondPricingScenario.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        bondInstrumentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'bond_instruments',
            key: 'id',
          },
          field: 'bond_instrument_id',
        },
        scenarioName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'scenario_name',
        },
        pricingDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'pricing_date',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'settlement_date',
        },
        yieldToMaturity: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'yield_to_maturity',
        },
        cleanPrice: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'clean_price',
        },
        dirtyPrice: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'dirty_price',
        },
        accruedInterest: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'accrued_interest',
        },
        macaulayDuration: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'macaulay_duration',
        },
        modifiedDuration: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'modified_duration',
        },
        effectiveDuration: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'effective_duration',
        },
        convexity: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'convexity',
        },
        dv01: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'dv01',
        },
        yieldToCall: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'yield_to_call',
        },
        yieldToPut: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'yield_to_put',
        },
        yieldToWorst: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'yield_to_worst',
        },
        currentYield: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'current_yield',
        },
        pricingMethod: {
          type: DataTypes.ENUM(...Object.values(PricingMethod)),
          allowNull: false,
          field: 'pricing_method',
        },
        yieldCurveId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'yield_curve_configurations',
            key: 'id',
          },
          field: 'yield_curve_id',
        },
        marketDataSource: {
          type: DataTypes.ENUM(...Object.values(MarketDataSource)),
          allowNull: false,
          field: 'market_data_source',
        },
        assumptions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'assumptions',
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
        tableName: 'bond_pricing_scenarios',
        modelName: 'BondPricingScenario',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['bond_instrument_id'] },
          { fields: ['pricing_date'] },
          { fields: ['scenario_name'] },
          { fields: ['yield_curve_id'] },
        ],
      }
    );

    return BondPricingScenario;
  }
}

// ============================================================================
// SEQUELIZE MODEL: BondPortfolio
// ============================================================================

/**
 * TypeScript interface for BondPortfolio attributes
 */
export interface BondPortfolioAttributes {
  id: string;
  name: string;
  description: string | null;
  portfolioManager: string;
  strategy: PortfolioStrategy;
  benchmarkIndex: string | null;
  targetDuration: number | null;
  durationTolerance: number | null;
  creditQualityMinimum: CreditQuality;
  totalMarketValue: number;
  totalFaceValue: number;
  yieldToMaturity: number;
  effectiveDuration: number;
  effectiveConvexity: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BondPortfolioCreationAttributes extends Optional<BondPortfolioAttributes, 'id' | 'description' | 'benchmarkIndex' | 'targetDuration' | 'durationTolerance' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BondPortfolio
 * Bond portfolio management and strategy
 */
export class BondPortfolio extends Model<BondPortfolioAttributes, BondPortfolioCreationAttributes> implements BondPortfolioAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare portfolioManager: string;
  declare strategy: PortfolioStrategy;
  declare benchmarkIndex: string | null;
  declare targetDuration: number | null;
  declare durationTolerance: number | null;
  declare creditQualityMinimum: CreditQuality;
  declare totalMarketValue: number;
  declare totalFaceValue: number;
  declare yieldToMaturity: number;
  declare effectiveDuration: number;
  declare effectiveConvexity: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getHoldings: HasManyGetAssociationsMixin<PortfolioHolding>;
  declare addHolding: HasManyAddAssociationMixin<PortfolioHolding, string>;

  /**
   * Initialize BondPortfolio with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BondPortfolio {
    BondPortfolio.init(
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
          unique: true,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        portfolioManager: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'portfolio_manager',
        },
        strategy: {
          type: DataTypes.ENUM(...Object.values(PortfolioStrategy)),
          allowNull: false,
          field: 'strategy',
        },
        benchmarkIndex: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'benchmark_index',
        },
        targetDuration: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'target_duration',
        },
        durationTolerance: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'duration_tolerance',
        },
        creditQualityMinimum: {
          type: DataTypes.ENUM(...Object.values(CreditQuality)),
          allowNull: false,
          field: 'credit_quality_minimum',
        },
        totalMarketValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'total_market_value',
        },
        totalFaceValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'total_face_value',
        },
        yieldToMaturity: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'yield_to_maturity',
        },
        effectiveDuration: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'effective_duration',
        },
        effectiveConvexity: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'effective_convexity',
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
        tableName: 'bond_portfolios',
        modelName: 'BondPortfolio',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['strategy'] },
          { fields: ['portfolio_manager'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return BondPortfolio;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PortfolioHolding
// ============================================================================

/**
 * TypeScript interface for PortfolioHolding attributes
 */
export interface PortfolioHoldingAttributes {
  id: string;
  portfolioId: string;
  bondInstrumentId: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  weight: number;
  unrealizedGainLoss: number;
  acquisitionDate: Date;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PortfolioHoldingCreationAttributes extends Optional<PortfolioHoldingAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: PortfolioHolding
 * Individual bond holdings in portfolios
 */
export class PortfolioHolding extends Model<PortfolioHoldingAttributes, PortfolioHoldingCreationAttributes> implements PortfolioHoldingAttributes {
  declare id: string;
  declare portfolioId: string;
  declare bondInstrumentId: string;
  declare quantity: number;
  declare averageCost: number;
  declare currentPrice: number;
  declare marketValue: number;
  declare weight: number;
  declare unrealizedGainLoss: number;
  declare acquisitionDate: Date;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize PortfolioHolding with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof PortfolioHolding {
    PortfolioHolding.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        portfolioId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'bond_portfolios',
            key: 'id',
          },
          field: 'portfolio_id',
        },
        bondInstrumentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'bond_instruments',
            key: 'id',
          },
          field: 'bond_instrument_id',
        },
        quantity: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'quantity',
        },
        averageCost: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'average_cost',
        },
        currentPrice: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'current_price',
        },
        marketValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'market_value',
        },
        weight: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'weight',
        },
        unrealizedGainLoss: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'unrealized_gain_loss',
        },
        acquisitionDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'acquisition_date',
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
        tableName: 'portfolio_holdings',
        modelName: 'PortfolioHolding',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['bond_instrument_id'] },
          { fields: ['acquisition_date'] },
        ],
      }
    );

    return PortfolioHolding;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineFixedIncomeAssociations(): void {
  BondInstrument.hasMany(BondPricingScenario, {
    foreignKey: 'bondInstrumentId',
    as: 'pricingScenarios',
    onDelete: 'CASCADE',
  });

  BondPricingScenario.belongsTo(BondInstrument, {
    foreignKey: 'bondInstrumentId',
    as: 'bondInstrument',
  });

  BondInstrument.hasMany(BondCreditAnalysis, {
    foreignKey: 'bondInstrumentId',
    as: 'creditAnalyses',
    onDelete: 'CASCADE',
  });

  BondCreditAnalysis.belongsTo(BondInstrument, {
    foreignKey: 'bondInstrumentId',
    as: 'bondInstrument',
  });

  BondPricingScenario.belongsTo(YieldCurveConfiguration, {
    foreignKey: 'yieldCurveId',
    as: 'yieldCurve',
  });

  YieldCurveConfiguration.hasMany(BondPricingScenario, {
    foreignKey: 'yieldCurveId',
    as: 'pricingScenarios',
  });

  BondPortfolio.hasMany(PortfolioHolding, {
    foreignKey: 'portfolioId',
    as: 'holdings',
    onDelete: 'CASCADE',
  });

  PortfolioHolding.belongsTo(BondPortfolio, {
    foreignKey: 'portfolioId',
    as: 'portfolio',
  });

  PortfolioHolding.belongsTo(BondInstrument, {
    foreignKey: 'bondInstrumentId',
    as: 'bondInstrument',
  });

  BondInstrument.hasMany(PortfolioHolding, {
    foreignKey: 'bondInstrumentId',
    as: 'portfolioHoldings',
  });
}

// ============================================================================
// BOND INSTRUMENT FUNCTIONS (7 functions)
// ============================================================================

/**
 * Create bond instrument with full validation
 * Composed from multiple kit validation functions
 */
export async function createBondInstrument(
  data: BondInstrumentCreationAttributes,
  transaction?: Transaction
): Promise<BondInstrument> {
  // Validate instrument parameters
  if (data.maturityDate <= data.issueDate) {
    throw new Error('Maturity date must be after issue date');
  }

  if (data.couponRate < 0 || data.couponRate > 100) {
    throw new Error('Coupon rate must be between 0 and 100');
  }

  return await BondInstrument.create(data, { transaction });
}

/**
 * Get bond instruments by type with filtering
 */
export async function getBondsByType(
  instrumentType: BondInstrumentType,
  filters?: {
    minCoupon?: number;
    maxCoupon?: number;
    minMaturity?: Date;
    maxMaturity?: Date;
    creditRatings?: string[];
  },
  transaction?: Transaction
): Promise<BondInstrument[]> {
  const where: any = { instrumentType };

  if (filters) {
    if (filters.minCoupon !== undefined) {
      where.couponRate = { ...where.couponRate, [Op.gte]: filters.minCoupon };
    }
    if (filters.maxCoupon !== undefined) {
      where.couponRate = { ...where.couponRate, [Op.lte]: filters.maxCoupon };
    }
    if (filters.minMaturity) {
      where.maturityDate = { ...where.maturityDate, [Op.gte]: filters.minMaturity };
    }
    if (filters.maxMaturity) {
      where.maturityDate = { ...where.maturityDate, [Op.lte]: filters.maxMaturity };
    }
    if (filters.creditRatings && filters.creditRatings.length > 0) {
      where.creditRating = { [Op.in]: filters.creditRatings };
    }
  }

  return await BondInstrument.findAll({ where, transaction });
}

/**
 * Create callable bond with call schedule validation
 */
export async function createCallableBond(
  baseData: Omit<BondInstrumentCreationAttributes, 'callable' | 'callSchedule'>,
  callSchedule: Array<{ date: Date; price: number }>,
  transaction?: Transaction
): Promise<BondInstrument> {
  // Validate call schedule
  for (const call of callSchedule) {
    if (call.date <= baseData.issueDate || call.date >= baseData.maturityDate) {
      throw new Error('Call dates must be between issue date and maturity date');
    }
    if (call.price <= 0) {
      throw new Error('Call prices must be positive');
    }
  }

  // Sort call schedule by date
  const sortedSchedule = callSchedule.sort((a, b) => a.date.getTime() - b.date.getTime());

  return await BondInstrument.create(
    {
      ...baseData,
      callable: true,
      callSchedule: sortedSchedule,
    },
    { transaction }
  );
}

/**
 * Create municipal bond with tax-exempt features
 */
export async function createMunicipalBond(
  issuerName: string,
  cusip: string,
  issueDate: Date,
  maturityDate: Date,
  faceValue: number,
  couponRate: number,
  state: string,
  createdBy: string,
  transaction?: Transaction
): Promise<BondInstrument> {
  return await BondInstrument.create(
    {
      cusip,
      issuerName,
      instrumentType: BondInstrumentType.MUNICIPAL,
      issueDate,
      maturityDate,
      faceValue,
      couponRate,
      paymentFrequency: PaymentFrequency.SemiAnnual,
      dayCountConvention: DayCountConvention.Thirty360,
      callable: false,
      putable: false,
      sinkingFund: false,
      country: 'USA',
      currency: 'USD',
      outstandingAmount: faceValue,
      isActive: true,
      metadata: { state, taxExempt: true },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create corporate bond with sector classification
 */
export async function createCorporateBond(
  issuerName: string,
  cusip: string,
  issueDate: Date,
  maturityDate: Date,
  faceValue: number,
  couponRate: number,
  sector: string,
  subsector: string,
  creditRating: string,
  createdBy: string,
  transaction?: Transaction
): Promise<BondInstrument> {
  return await BondInstrument.create(
    {
      cusip,
      issuerName,
      instrumentType: BondInstrumentType.CORPORATE,
      issueDate,
      maturityDate,
      faceValue,
      couponRate,
      paymentFrequency: PaymentFrequency.SemiAnnual,
      dayCountConvention: DayCountConvention.Thirty360,
      callable: false,
      putable: false,
      sinkingFund: false,
      creditRating,
      sector,
      subsector,
      country: 'USA',
      currency: 'USD',
      outstandingAmount: faceValue,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get bonds by credit rating range
 */
export async function getBondsByCreditRating(
  minRating: CreditRating,
  maxRating: CreditRating,
  transaction?: Transaction
): Promise<BondInstrument[]> {
  const ratingOrder: CreditRating[] = [
    'AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-',
    'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-',
    'B+', 'B', 'B-', 'CCC+', 'CCC', 'CCC-',
    'CC', 'C', 'D',
  ];

  const validRatings = ratingOrder.slice(
    ratingOrder.indexOf(minRating),
    ratingOrder.indexOf(maxRating) + 1
  );

  return await BondInstrument.findAll({
    where: {
      creditRating: { [Op.in]: validRatings },
    },
    transaction,
  });
}

/**
 * Screen bonds by multiple criteria (Bloomberg-style screening)
 */
export async function screenBonds(
  criteria: {
    instrumentTypes?: BondInstrumentType[];
    minYield?: number;
    maxYield?: number;
    minDuration?: number;
    maxDuration?: number;
    minCreditScore?: number;
    sectors?: string[];
    countries?: string[];
    currencies?: string[];
  },
  transaction?: Transaction
): Promise<BondInstrument[]> {
  const where: any = { isActive: true };

  if (criteria.instrumentTypes && criteria.instrumentTypes.length > 0) {
    where.instrumentType = { [Op.in]: criteria.instrumentTypes };
  }

  if (criteria.sectors && criteria.sectors.length > 0) {
    where.sector = { [Op.in]: criteria.sectors };
  }

  if (criteria.countries && criteria.countries.length > 0) {
    where.country = { [Op.in]: criteria.countries };
  }

  if (criteria.currencies && criteria.currencies.length > 0) {
    where.currency = { [Op.in]: criteria.currencies };
  }

  return await BondInstrument.findAll({
    where,
    include: ['pricingScenarios', 'creditAnalyses'],
    transaction,
  });
}

// ============================================================================
// BOND PRICING FUNCTIONS (8 functions)
// ============================================================================

/**
 * Create comprehensive pricing scenario with all metrics
 * Composed from multiple kit pricing and risk functions
 */
export async function createComprehensivePricingScenario(
  bondInstrumentId: string,
  scenarioName: string,
  yieldRate: number,
  settlementDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<BondPricingScenario> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  // Create FixedRateBond object for kit functions
  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
    issueDate: bond.issueDate,
  };

  const yieldPct = asPercentage(yieldRate);

  // Calculate all pricing metrics using kit functions
  const cleanPriceValue = priceFromYield(fixedBond, yieldPct, settlementDate);
  const accruedInt = accruedInterest(fixedBond, settlementDate);
  const dirtyPriceValue = cleanPriceValue + accruedInt;
  const macDuration = macaulayDuration(fixedBond, yieldPct, settlementDate);
  const modDuration = modifiedDuration(fixedBond, yieldPct, settlementDate);
  const effDuration = effectiveDuration(fixedBond, yieldPct, settlementDate);
  const conv = convexity(fixedBond, yieldPct, settlementDate);
  const dv01Value = dollarDuration(fixedBond, yieldPct, settlementDate);
  const currYield = currentYield(fixedBond, cleanPriceValue);

  // Calculate optional yields for callable/putable bonds
  let ytcValue: number | null = null;
  let ytpValue: number | null = null;
  let ytwValue: number | null = null;

  if (bond.callable && bond.callSchedule && bond.callSchedule.length > 0) {
    const firstCall = bond.callSchedule[0];
    ytcValue = yieldToCall(
      fixedBond,
      cleanPriceValue,
      settlementDate,
      new Date(firstCall.date),
      firstCall.price
    );

    ytwValue = yieldToWorst(
      fixedBond,
      cleanPriceValue,
      settlementDate,
      bond.callSchedule.map(c => ({ date: new Date(c.date), price: c.price }))
    );
  }

  if (bond.putable && bond.putSchedule && bond.putSchedule.length > 0) {
    const firstPut = bond.putSchedule[0];
    ytpValue = yieldToPut(
      fixedBond,
      cleanPriceValue,
      settlementDate,
      new Date(firstPut.date),
      firstPut.price
    );
  }

  return await BondPricingScenario.create(
    {
      bondInstrumentId,
      scenarioName,
      pricingDate: new Date(),
      settlementDate,
      yieldToMaturity: yieldRate,
      cleanPrice: cleanPriceValue,
      dirtyPrice: dirtyPriceValue,
      accruedInterest: accruedInt,
      macaulayDuration: macDuration,
      modifiedDuration: modDuration,
      effectiveDuration: effDuration,
      convexity: conv,
      dv01: dv01Value,
      yieldToCall: ytcValue,
      yieldToPut: ytpValue,
      yieldToWorst: ytwValue,
      currentYield: currYield,
      pricingMethod: PricingMethod.YIELD_TO_MATURITY,
      marketDataSource: MarketDataSource.INTERNAL,
      assumptions: { yieldRate, settlementDate: settlementDate.toISOString() },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Price bond from market yield
 */
export async function priceBondFromMarketYield(
  bondInstrumentId: string,
  marketYield: number,
  settlementDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<{ cleanPrice: number; dirtyPrice: number; accruedInterest: number }> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const cleanPrice = priceFromYield(fixedBond, asPercentage(marketYield), settlementDate);
  const accrued = accruedInterest(fixedBond, settlementDate);
  const dirtyPrice = cleanPrice + accrued;

  return {
    cleanPrice,
    dirtyPrice,
    accruedInterest: accrued,
  };
}

/**
 * Calculate yield from market price
 */
export async function calculateYieldFromPrice(
  bondInstrumentId: string,
  marketPrice: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<number> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  return yieldFromPrice(fixedBond, marketPrice, settlementDate);
}

/**
 * Generate cashflow schedule for bond
 */
export async function generateBondCashflowSchedule(
  bondInstrumentId: string,
  settlementDate: Date,
  transaction?: Transaction
): Promise<CashFlow[]> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  return generateBondCashFlows(fixedBond, settlementDate);
}

/**
 * Calculate present value of bond cashflows
 */
export async function calculateBondPresentValue(
  bondInstrumentId: string,
  discountRate: number,
  valuationDate: Date,
  transaction?: Transaction
): Promise<number> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const cashflows = generateBondCashFlows(fixedBond, valuationDate);

  return presentValueOfCashFlows(
    cashflows,
    asPercentage(discountRate),
    valuationDate,
    bond.dayCountConvention as DayCountConvention
  );
}

/**
 * Price callable bond with option value
 */
export async function priceCallableBondWithOption(
  bondInstrumentId: string,
  yieldRate: number,
  volatility: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<number> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond || !bond.callable || !bond.callSchedule || bond.callSchedule.length === 0) {
    throw new Error('Bond is not callable or call schedule missing');
  }

  const callableBond = {
    type: 'fixed' as const,
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
    callable: true as const,
    callDates: bond.callSchedule.map(c => new Date(c.date)),
    callPrices: bond.callSchedule.map(c => c.price),
  };

  return callableBondPrice(
    callableBond,
    asPercentage(yieldRate),
    asPercentage(volatility),
    settlementDate,
    bond.callSchedule[0].price
  );
}

/**
 * Calculate bond duration and convexity metrics
 */
export async function calculateBondRiskMetrics(
  bondInstrumentId: string,
  yieldRate: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<{
  macaulayDuration: number;
  modifiedDuration: number;
  effectiveDuration: number;
  convexity: number;
  effectiveConvexity: number;
  dv01: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const yieldPct = asPercentage(yieldRate);

  return {
    macaulayDuration: macaulayDuration(fixedBond, yieldPct, settlementDate),
    modifiedDuration: modifiedDuration(fixedBond, yieldPct, settlementDate),
    effectiveDuration: effectiveDuration(fixedBond, yieldPct, settlementDate),
    convexity: convexity(fixedBond, yieldPct, settlementDate),
    effectiveConvexity: effectiveConvexity(fixedBond, yieldPct, settlementDate),
    dv01: dollarDuration(fixedBond, yieldPct, settlementDate),
  };
}

/**
 * Calculate all yield measures for bond
 */
export async function calculateAllYieldMeasures(
  bondInstrumentId: string,
  marketPrice: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<{
  yieldToMaturity: number;
  currentYield: number;
  yieldToCall?: number;
  yieldToPut?: number;
  yieldToWorst?: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const ytm = yieldToMaturity(fixedBond, marketPrice, settlementDate);
  const cy = currentYield(fixedBond, marketPrice);

  const result: any = {
    yieldToMaturity: ytm,
    currentYield: cy,
  };

  if (bond.callable && bond.callSchedule && bond.callSchedule.length > 0) {
    const firstCall = bond.callSchedule[0];
    result.yieldToCall = yieldToCall(
      fixedBond,
      marketPrice,
      settlementDate,
      new Date(firstCall.date),
      firstCall.price
    );

    result.yieldToWorst = yieldToWorst(
      fixedBond,
      marketPrice,
      settlementDate,
      bond.callSchedule.map(c => ({ date: new Date(c.date), price: c.price }))
    );
  }

  if (bond.putable && bond.putSchedule && bond.putSchedule.length > 0) {
    const firstPut = bond.putSchedule[0];
    result.yieldToPut = yieldToPut(
      fixedBond,
      marketPrice,
      settlementDate,
      new Date(firstPut.date),
      firstPut.price
    );
  }

  return result;
}

// ============================================================================
// YIELD CURVE FUNCTIONS (6 functions)
// ============================================================================

/**
 * Create yield curve configuration
 */
export async function createYieldCurveConfiguration(
  data: YieldCurveConfigurationCreationAttributes,
  transaction?: Transaction
): Promise<YieldCurveConfiguration> {
  return await YieldCurveConfiguration.create(data, { transaction });
}

/**
 * Bootstrap yield curve from bond prices
 */
export async function bootstrapYieldCurveFromBonds(
  bondInstrumentIds: string[],
  marketPrices: number[],
  settlementDate: Date,
  curveName: string,
  createdBy: string,
  transaction?: Transaction
): Promise<YieldCurveConfiguration> {
  if (bondInstrumentIds.length !== marketPrices.length) {
    throw new Error('Bond IDs and prices must have same length');
  }

  const bonds = await BondInstrument.findAll({
    where: { id: { [Op.in]: bondInstrumentIds } },
    transaction,
  });

  if (bonds.length !== bondInstrumentIds.length) {
    throw new Error('Some bond instruments not found');
  }

  // Convert to FixedRateBond array
  const fixedBonds: FixedRateBond[] = bonds.map(b => ({
    type: 'fixed',
    faceValue: Number(b.faceValue),
    couponRate: asPercentage(Number(b.couponRate)),
    maturity: b.maturityDate,
    frequency: b.paymentFrequency as PaymentFrequency,
    dayCount: b.dayCountConvention as DayCountConvention,
  }));

  const curve = bootstrapYieldCurve(fixedBonds, marketPrices, settlementDate);

  return await YieldCurveConfiguration.create(
    {
      name: curveName,
      curveType: 'spot',
      currency: 'USD',
      dataPoints: curve.points.map(p => ({ maturity: p.maturity, rate: p.rate })),
      interpolationMethod: 'bootstrap',
      effectiveDate: settlementDate,
      dataSource: MarketDataSource.INTERNAL,
      isActive: true,
      metadata: { method: 'bootstrap' },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Fit Nelson-Siegel yield curve model
 */
export async function fitNelsonSiegelYieldCurve(
  maturities: number[],
  rates: number[],
  curveName: string,
  createdBy: string,
  transaction?: Transaction
): Promise<YieldCurveConfiguration> {
  const ratesPercentage = rates.map(r => asPercentage(r));
  const params = nelsonSiegelCurve(maturities, ratesPercentage);

  // Generate curve points using fitted model
  const curvePoints: YieldCurvePoint[] = [];
  for (let t = 0.5; t <= 30; t += 0.5) {
    const rate = evaluateNelsonSiegel(params, t);
    curvePoints.push({ maturity: t, rate });
  }

  return await YieldCurveConfiguration.create(
    {
      name: curveName,
      curveType: 'nelson-siegel',
      currency: 'USD',
      dataPoints: curvePoints.map(p => ({ maturity: p.maturity, rate: p.rate })),
      interpolationMethod: 'nelson-siegel',
      modelParameters: {
        beta0: params.beta0,
        beta1: params.beta1,
        beta2: params.beta2,
        lambda: params.lambda,
      },
      effectiveDate: new Date(),
      dataSource: MarketDataSource.INTERNAL,
      isActive: true,
      metadata: { fittingMethod: 'least-squares' },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Interpolate yield for given maturity
 */
export async function interpolateYieldCurve(
  yieldCurveId: string,
  targetMaturity: number,
  transaction?: Transaction
): Promise<number> {
  const curve = await YieldCurveConfiguration.findByPk(yieldCurveId, { transaction });
  if (!curve) {
    throw new Error('Yield curve not found');
  }

  const points: YieldCurvePoint[] = curve.dataPoints.map(p => ({
    maturity: p.maturity,
    rate: asPercentage(p.rate),
  }));

  if (curve.interpolationMethod === 'cubic-spline') {
    return cubicSplineInterpolation(points, targetMaturity);
  } else if (curve.interpolationMethod === 'nelson-siegel' && curve.modelParameters) {
    const params: NelsonSiegelParameters = {
      beta0: curve.modelParameters.beta0,
      beta1: curve.modelParameters.beta1,
      beta2: curve.modelParameters.beta2,
      lambda: curve.modelParameters.lambda,
    };
    return evaluateNelsonSiegel(params, targetMaturity);
  } else {
    return linearInterpolation(points, targetMaturity);
  }
}

/**
 * Calculate forward rates from spot curve
 */
export async function calculateForwardRates(
  yieldCurveId: string,
  maturities: Array<[number, number]>,
  transaction?: Transaction
): Promise<Array<{ from: number; to: number; forwardRate: number }>> {
  const curve = await YieldCurveConfiguration.findByPk(yieldCurveId, { transaction });
  if (!curve) {
    throw new Error('Yield curve not found');
  }

  const points: YieldCurvePoint[] = curve.dataPoints.map(p => ({
    maturity: p.maturity,
    rate: asPercentage(p.rate),
  }));

  const forwardRates = maturities.map(([t1, t2]) => {
    const spot1 = linearInterpolation(points, t1);
    const spot2 = linearInterpolation(points, t2);
    const forward = forwardRateFromSpot(spot1, t1, spot2, t2);

    return { from: t1, to: t2, forwardRate: forward };
  });

  return forwardRates;
}

/**
 * Analyze yield curve shape and characteristics
 */
export async function analyzeYieldCurveShape(
  yieldCurveId: string,
  transaction?: Transaction
): Promise<{
  shape: YieldCurveShape;
  slope: number;
  curvature: number;
  shortRate: number;
  longRate: number;
  spread: number;
}> {
  const curve = await YieldCurveConfiguration.findByPk(yieldCurveId, { transaction });
  if (!curve) {
    throw new Error('Yield curve not found');
  }

  const points = curve.dataPoints.sort((a, b) => a.maturity - b.maturity);

  if (points.length < 3) {
    throw new Error('Need at least 3 points to analyze curve shape');
  }

  const shortRate = points[0].rate;
  const longRate = points[points.length - 1].rate;
  const midRate = points[Math.floor(points.length / 2)].rate;

  const slope = longRate - shortRate;
  const curvature = 2 * midRate - shortRate - longRate;
  const spread = longRate - shortRate;

  let shape: YieldCurveShape;
  if (slope > 0.5) {
    shape = YieldCurveShape.NORMAL;
  } else if (slope < -0.5) {
    shape = YieldCurveShape.INVERTED;
  } else if (Math.abs(slope) < 0.2) {
    shape = YieldCurveShape.FLAT;
  } else {
    shape = YieldCurveShape.HUMPED;
  }

  return {
    shape,
    slope,
    curvature,
    shortRate,
    longRate,
    spread,
  };
}

// ============================================================================
// CREDIT ANALYSIS FUNCTIONS (7 functions)
// ============================================================================

/**
 * Perform comprehensive credit analysis on bond
 */
export async function performComprehensiveCreditAnalysis(
  bondInstrumentId: string,
  financialData: FinancialData,
  analysisDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<BondCreditAnalysis> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  // Calculate credit score and rating
  const creditScore = calculateCreditScore(financialData);
  const creditRating = assignCreditRating(creditScore);

  // Calculate default probability using Merton model
  const assetValue = financialData.totalAssets;
  const debtValue = financialData.totalLiabilities;
  const assetVolatility = 0.25; // Typical corporate asset volatility
  const timeToMaturity = (bond.maturityDate.getTime() - analysisDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const riskFreeRate = 0.03; // Assume 3% risk-free rate

  const distanceToDefault = calculateDistanceToDefault(
    assetValue,
    debtValue,
    assetVolatility,
    timeToMaturity,
    riskFreeRate
  );

  const probabilityOfDefault = calculateMertonDefaultProbability(
    assetValue,
    debtValue,
    assetVolatility,
    timeToMaturity,
    riskFreeRate
  );

  // Determine recovery rate and expected loss
  const recoveryRate = getIndustryAverageRecoveryRate('senior-unsecured').toNumber();
  const lossGivenDefault = 1 - recoveryRate;
  const expectedLoss = Number(bond.outstandingAmount) * probabilityOfDefault.toNumber() * lossGivenDefault;

  // Calculate credit spread (simplified)
  const treasuryYield = 0.04; // Assume 4% treasury yield
  const corporateYield = Number(bond.couponRate) / 100;
  const creditSpreadBps = calculateCreditSpread(corporateYield, treasuryYield).toNumber();

  // Determine credit quality
  let creditQuality: CreditQuality;
  if (['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-'].includes(creditRating)) {
    creditQuality = CreditQuality.INVESTMENT_GRADE;
  } else if (['BB+', 'BB', 'BB-', 'B+', 'B', 'B-'].includes(creditRating)) {
    creditQuality = CreditQuality.HIGH_YIELD;
  } else if (['CCC+', 'CCC', 'CCC-', 'CC', 'C'].includes(creditRating)) {
    creditQuality = CreditQuality.SPECULATIVE;
  } else {
    creditQuality = CreditQuality.DEFAULT;
  }

  return await BondCreditAnalysis.create(
    {
      bondInstrumentId,
      analysisDate,
      creditRating,
      creditScore,
      probabilityOfDefault: probabilityOfDefault.toNumber(),
      lossGivenDefault,
      expectedLoss,
      creditSpread: creditSpreadBps / 10000, // Convert to decimal
      distanceToDefault: distanceToDefault.toNumber(),
      recoveryRate,
      creditQuality,
      riskFactors: [
        { factor: 'Leverage', value: financialData.totalLiabilities / financialData.equity },
        { factor: 'Coverage', value: financialData.ebitda / financialData.interestExpense },
        { factor: 'Liquidity', value: financialData.currentAssets / financialData.currentLiabilities },
      ],
      financialMetrics: {
        totalAssets: financialData.totalAssets,
        totalLiabilities: financialData.totalLiabilities,
        equity: financialData.equity,
        ebitda: financialData.ebitda,
        netIncome: financialData.netIncome,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate Z-spread for bond
 */
export async function calculateBondZSpread(
  bondInstrumentId: string,
  marketPrice: number,
  yieldCurveId: string,
  settlementDate: Date,
  transaction?: Transaction
): Promise<number> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  const curve = await YieldCurveConfiguration.findByPk(yieldCurveId, { transaction });

  if (!bond || !curve) {
    throw new Error('Bond or yield curve not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const yieldCurveData: YieldCurve = {
    points: curve.dataPoints.map(p => ({
      maturity: p.maturity,
      rate: asPercentage(p.rate),
    })),
    method: 'linear',
  };

  return zSpreadCalculation(fixedBond, marketPrice, yieldCurveData, settlementDate);
}

/**
 * Calculate CDS-implied default probability
 */
export async function calculateCDSImpliedProbability(
  bondInstrumentId: string,
  cdsSpreadBps: number,
  recoveryRate: number,
  transaction?: Transaction
): Promise<number> {
  return calculateImpliedDefaultProbabilityFromCDS(cdsSpreadBps, recoveryRate).toNumber();
}

/**
 * Bootstrap CDS curve from market quotes
 */
export async function bootstrapCDSCurveFromMarket(
  tenors: number[],
  spreadsBps: number[],
  recoveryRate: number,
  riskFreeRates: number[],
  transaction?: Transaction
): Promise<DefaultProbabilityCurve> {
  return bootstrapCDSCurve(tenors, spreadsBps, recoveryRate, riskFreeRates);
}

/**
 * Calculate CVA for bond counterparty exposure
 */
export async function calculateBondCVA(
  bondInstrumentId: string,
  exposureProfile: number[],
  defaultCurve: DefaultProbabilityCurve,
  recoveryRate: number,
  discountRates: number[],
  transaction?: Transaction
): Promise<number> {
  const exposureDecimal = exposureProfile.map(e => new (require('decimal.js'))(e));
  return calculateCVA(exposureDecimal, defaultCurve, recoveryRate, discountRates).toNumber();
}

/**
 * Update credit analysis with market data
 */
export async function updateCreditAnalysisWithMarketData(
  analysisId: string,
  cdsSpread: number,
  zSpread: number,
  optionAdjustedSpread: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, BondCreditAnalysis[]]> {
  return await BondCreditAnalysis.update(
    {
      cdsSpread: cdsSpread / 10000, // Convert bps to decimal
      zSpread: zSpread / 10000,
      optionAdjustedSpread: optionAdjustedSpread / 10000,
      updatedBy,
    },
    { where: { id: analysisId }, returning: true, transaction }
  );
}

/**
 * Get credit analyses by quality classification
 */
export async function getCreditAnalysesByQuality(
  creditQuality: CreditQuality,
  fromDate?: Date,
  toDate?: Date,
  transaction?: Transaction
): Promise<BondCreditAnalysis[]> {
  const where: any = { creditQuality };

  if (fromDate) {
    where.analysisDate = { ...where.analysisDate, [Op.gte]: fromDate };
  }

  if (toDate) {
    where.analysisDate = { ...where.analysisDate, [Op.lte]: toDate };
  }

  return await BondCreditAnalysis.findAll({
    where,
    include: ['bondInstrument'],
    order: [['analysisDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// PORTFOLIO MANAGEMENT FUNCTIONS (8 functions)
// ============================================================================

/**
 * Create bond portfolio with strategy
 */
export async function createBondPortfolio(
  data: BondPortfolioCreationAttributes,
  transaction?: Transaction
): Promise<BondPortfolio> {
  return await BondPortfolio.create(data, { transaction });
}

/**
 * Add bond holding to portfolio
 */
export async function addBondToPortfolio(
  portfolioId: string,
  bondInstrumentId: string,
  quantity: number,
  acquisitionPrice: number,
  currentPrice: number,
  acquisitionDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<PortfolioHolding> {
  const portfolio = await BondPortfolio.findByPk(portfolioId, { transaction });
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  const marketValue = quantity * currentPrice;
  const costBasis = quantity * acquisitionPrice;
  const unrealizedGainLoss = marketValue - costBasis;

  // Calculate weight (will be updated when portfolio is recalculated)
  const weight = 0; // Placeholder, will be updated

  return await PortfolioHolding.create(
    {
      portfolioId,
      bondInstrumentId,
      quantity,
      averageCost: acquisitionPrice,
      currentPrice,
      marketValue,
      weight,
      unrealizedGainLoss,
      acquisitionDate,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate portfolio duration and convexity
 */
export async function calculatePortfolioRiskMetrics(
  portfolioId: string,
  yieldShift: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<{
  effectiveDuration: number;
  effectiveConvexity: number;
  dv01: number;
  weightedAverageDuration: number;
}> {
  const portfolio = await BondPortfolio.findByPk(portfolioId, {
    include: [{ model: PortfolioHolding, as: 'holdings', include: ['bondInstrument'] }],
    transaction,
  });

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  let totalDuration = 0;
  let totalConvexity = 0;
  let totalDV01 = 0;
  let totalMarketValue = 0;

  for (const holding of portfolio.getDataValue('holdings') || []) {
    const bond = holding.getDataValue('bondInstrument');

    const fixedBond: FixedRateBond = {
      type: 'fixed',
      faceValue: Number(bond.faceValue),
      couponRate: asPercentage(Number(bond.couponRate)),
      maturity: bond.maturityDate,
      frequency: bond.paymentFrequency as PaymentFrequency,
      dayCount: bond.dayCountConvention as DayCountConvention,
    };

    const yieldPct = asPercentage(Number(bond.couponRate) + yieldShift);

    const duration = modifiedDuration(fixedBond, yieldPct, settlementDate);
    const conv = convexity(fixedBond, yieldPct, settlementDate);
    const dv01 = dollarDuration(fixedBond, yieldPct, settlementDate);

    const holdingValue = Number(holding.marketValue);
    totalDuration += duration * holdingValue;
    totalConvexity += conv * holdingValue;
    totalDV01 += dv01 * Number(holding.quantity);
    totalMarketValue += holdingValue;
  }

  return {
    effectiveDuration: totalDuration / totalMarketValue,
    effectiveConvexity: totalConvexity / totalMarketValue,
    dv01: totalDV01,
    weightedAverageDuration: totalDuration / totalMarketValue,
  };
}

/**
 * Analyze bond ladder strategy
 */
export async function analyzeBondLadderStrategy(
  bondInstrumentIds: string[],
  yields: number[],
  settlementDate: Date,
  transaction?: Transaction
): Promise<{
  averageDuration: number;
  averageYield: number;
  totalValue: number;
  annualCashFlow: number;
}> {
  if (bondInstrumentIds.length !== yields.length) {
    throw new Error('Bond IDs and yields must have same length');
  }

  const bonds = await BondInstrument.findAll({
    where: { id: { [Op.in]: bondInstrumentIds } },
    transaction,
  });

  const fixedBonds: FixedRateBond[] = bonds.map(b => ({
    type: 'fixed',
    faceValue: Number(b.faceValue),
    couponRate: asPercentage(Number(b.couponRate)),
    maturity: b.maturityDate,
    frequency: b.paymentFrequency as PaymentFrequency,
    dayCount: b.dayCountConvention as DayCountConvention,
  }));

  const yieldsPercentage = yields.map(y => asPercentage(y));

  return bondLadderAnalysis(fixedBonds, yieldsPercentage, settlementDate);
}

/**
 * Rebalance portfolio to target duration
 */
export async function rebalancePortfolioToTargetDuration(
  portfolioId: string,
  targetDuration: number,
  tolerance: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<{ needsRebalancing: boolean; currentDuration: number; recommendations: any[] }> {
  const metrics = await calculatePortfolioRiskMetrics(portfolioId, 0, settlementDate, transaction);

  const needsRebalancing = Math.abs(metrics.weightedAverageDuration - targetDuration) > tolerance;

  const recommendations: any[] = [];

  if (needsRebalancing) {
    if (metrics.weightedAverageDuration > targetDuration) {
      recommendations.push({
        action: 'reduce_duration',
        suggestion: 'Sell longer-dated bonds or buy shorter-dated bonds',
        currentDuration: metrics.weightedAverageDuration,
        targetDuration,
        gap: metrics.weightedAverageDuration - targetDuration,
      });
    } else {
      recommendations.push({
        action: 'increase_duration',
        suggestion: 'Buy longer-dated bonds or sell shorter-dated bonds',
        currentDuration: metrics.weightedAverageDuration,
        targetDuration,
        gap: targetDuration - metrics.weightedAverageDuration,
      });
    }
  }

  return {
    needsRebalancing,
    currentDuration: metrics.weightedAverageDuration,
    recommendations,
  };
}

/**
 * Calculate portfolio yield and total return
 */
export async function calculatePortfolioYieldAndReturn(
  portfolioId: string,
  transaction?: Transaction
): Promise<{
  weightedAverageYield: number;
  currentYield: number;
  yieldToMaturity: number;
  totalReturn: number;
  unrealizedGainLoss: number;
}> {
  const portfolio = await BondPortfolio.findByPk(portfolioId, {
    include: [{ model: PortfolioHolding, as: 'holdings', include: ['bondInstrument'] }],
    transaction,
  });

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  let totalYield = 0;
  let totalCurrentYield = 0;
  let totalMarketValue = 0;
  let totalUnrealizedGL = 0;

  for (const holding of portfolio.getDataValue('holdings') || []) {
    const bond = holding.getDataValue('bondInstrument');
    const holdingValue = Number(holding.marketValue);

    const couponYield = Number(bond.couponRate);
    totalYield += couponYield * holdingValue;
    totalCurrentYield += (Number(bond.couponRate) / Number(holding.currentPrice)) * 100 * holdingValue;
    totalMarketValue += holdingValue;
    totalUnrealizedGL += Number(holding.unrealizedGainLoss);
  }

  return {
    weightedAverageYield: totalYield / totalMarketValue,
    currentYield: totalCurrentYield / totalMarketValue,
    yieldToMaturity: Number(portfolio.yieldToMaturity),
    totalReturn: (totalUnrealizedGL / (totalMarketValue - totalUnrealizedGL)) * 100,
    unrealizedGainLoss: totalUnrealizedGL,
  };
}

/**
 * Get portfolio holdings by sector allocation
 */
export async function getPortfolioSectorAllocation(
  portfolioId: string,
  transaction?: Transaction
): Promise<Array<{ sector: string; marketValue: number; weight: number; count: number }>> {
  const portfolio = await BondPortfolio.findByPk(portfolioId, {
    include: [{ model: PortfolioHolding, as: 'holdings', include: ['bondInstrument'] }],
    transaction,
  });

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  const sectorMap = new Map<string, { marketValue: number; count: number }>();
  let totalMarketValue = 0;

  for (const holding of portfolio.getDataValue('holdings') || []) {
    const bond = holding.getDataValue('bondInstrument');
    const sector = bond.sector || 'Other';
    const holdingValue = Number(holding.marketValue);

    const existing = sectorMap.get(sector) || { marketValue: 0, count: 0 };
    existing.marketValue += holdingValue;
    existing.count += 1;
    sectorMap.set(sector, existing);

    totalMarketValue += holdingValue;
  }

  return Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    marketValue: data.marketValue,
    weight: (data.marketValue / totalMarketValue) * 100,
    count: data.count,
  }));
}

/**
 * Update portfolio metrics after market changes
 */
export async function updatePortfolioMetrics(
  portfolioId: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<BondPortfolio> {
  const portfolio = await BondPortfolio.findByPk(portfolioId, {
    include: [{ model: PortfolioHolding, as: 'holdings', include: ['bondInstrument'] }],
    transaction,
  });

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  let totalMarketValue = 0;
  let totalFaceValue = 0;

  for (const holding of portfolio.getDataValue('holdings') || []) {
    const bond = holding.getDataValue('bondInstrument');
    totalMarketValue += Number(holding.marketValue);
    totalFaceValue += Number(bond.faceValue) * Number(holding.quantity);
  }

  // Update portfolio-level metrics
  await portfolio.update(
    {
      totalMarketValue,
      totalFaceValue,
      updatedBy,
    },
    { transaction }
  );

  // Update individual holding weights
  for (const holding of portfolio.getDataValue('holdings') || []) {
    const weight = (Number(holding.marketValue) / totalMarketValue) * 100;
    await PortfolioHolding.update(
      { weight },
      { where: { id: holding.id }, transaction }
    );
  }

  return portfolio.reload({ transaction });
}

// ============================================================================
// SPECIALIZED ANALYTICS FUNCTIONS (7 functions)
// ============================================================================

/**
 * Calculate MBS prepayment speed and weighted average life
 */
export async function analyzeMBSPrepayment(
  bondInstrumentId: string,
  psaSpeed: number,
  monthsFromOrigination: number,
  transaction?: Transaction
): Promise<{
  cpr: number;
  wal: number;
  prepaymentRate: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond || bond.instrumentType !== BondInstrumentType.MORTGAGE_BACKED) {
    throw new Error('Bond is not a mortgage-backed security');
  }

  const cpr = mbsPrepaymentPSA(monthsFromOrigination, asPercentage(psaSpeed));

  // Generate simplified principal payment schedule
  const totalMonths = Math.floor((bond.maturityDate.getTime() - bond.issueDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const monthlyPrincipal = Number(bond.faceValue) / totalMonths;

  const principalPayments: number[] = [];
  const periods: number[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    principalPayments.push(monthlyPrincipal);
    periods.push(month);
  }

  const wal = mbsWeightedAverageLife(principalPayments, periods);

  return {
    cpr,
    wal,
    prepaymentRate: psaSpeed,
  };
}

/**
 * Model ABS cashflow waterfall
 */
export async function modelABSCashflowWaterfall(
  totalCashflow: number,
  tranches: Array<{ name: string; size: number; priority: number; rate: number }>,
  transaction?: Transaction
): Promise<Array<{ tranche: string; interest: number; principal: number; remaining: number }>> {
  const tranchesWithPercentage = tranches.map(t => ({
    ...t,
    rate: asPercentage(t.rate),
  }));

  return absCashFlowWaterfall(totalCashflow, tranchesWithPercentage);
}

/**
 * Price convertible bond (simplified)
 */
export async function priceConvertibleBond(
  bondInstrumentId: string,
  stockPrice: number,
  conversionRatio: number,
  yieldRate: number,
  settlementDate: Date,
  transaction?: Transaction
): Promise<{
  bondValue: number;
  conversionValue: number;
  convertibleValue: number;
  conversionPremium: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond || bond.instrumentType !== BondInstrumentType.CONVERTIBLE) {
    throw new Error('Bond is not a convertible bond');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const bondValue = priceFromYield(fixedBond, asPercentage(yieldRate), settlementDate);
  const conversionValue = stockPrice * conversionRatio;
  const convertibleValue = Math.max(bondValue, conversionValue);
  const conversionPremium = ((convertibleValue - conversionValue) / conversionValue) * 100;

  return {
    bondValue,
    conversionValue,
    convertibleValue,
    conversionPremium,
  };
}

/**
 * Calculate bond total return over holding period
 */
export async function calculateBondTotalReturn(
  bondInstrumentId: string,
  purchasePrice: number,
  purchaseDate: Date,
  salePrice: number,
  saleDate: Date,
  reinvestmentRate: number,
  transaction?: Transaction
): Promise<{
  totalReturn: number;
  annualizedReturn: number;
  priceReturn: number;
  couponReturn: number;
  reinvestmentReturn: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  // Generate cashflows during holding period
  const cashflows = generateBondCashFlows(fixedBond, purchaseDate);
  const receivedCashflows = cashflows.filter(cf => cf.date >= purchaseDate && cf.date <= saleDate);

  // Calculate coupon income
  const couponIncome = receivedCashflows
    .filter(cf => cf.type === 'coupon')
    .reduce((sum, cf) => sum + cf.amount, 0);

  // Simplified reinvestment return (compound coupons at reinvestment rate)
  const yearsHeld = (saleDate.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const reinvestmentReturn = couponIncome * (Math.pow(1 + reinvestmentRate / 100, yearsHeld) - 1);

  const priceReturn = salePrice - purchasePrice;
  const totalReturnDollars = priceReturn + couponIncome + reinvestmentReturn;
  const totalReturn = (totalReturnDollars / purchasePrice) * 100;
  const annualizedReturn = (Math.pow(1 + totalReturn / 100, 1 / yearsHeld) - 1) * 100;

  return {
    totalReturn,
    annualizedReturn,
    priceReturn: (priceReturn / purchasePrice) * 100,
    couponReturn: (couponIncome / purchasePrice) * 100,
    reinvestmentReturn: (reinvestmentReturn / purchasePrice) * 100,
  };
}

/**
 * Calculate bond price sensitivity to interest rate changes
 */
export async function calculateInterestRateSensitivity(
  bondInstrumentId: string,
  baseYield: number,
  yieldShocks: number[],
  settlementDate: Date,
  transaction?: Transaction
): Promise<Array<{ yieldChange: number; priceChange: number; percentChange: number }>> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, { transaction });
  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const fixedBond: FixedRateBond = {
    type: 'fixed',
    faceValue: Number(bond.faceValue),
    couponRate: asPercentage(Number(bond.couponRate)),
    maturity: bond.maturityDate,
    frequency: bond.paymentFrequency as PaymentFrequency,
    dayCount: bond.dayCountConvention as DayCountConvention,
  };

  const basePrice = priceFromYield(fixedBond, asPercentage(baseYield), settlementDate);

  return yieldShocks.map(shock => {
    const newYield = baseYield + shock;
    const newPrice = priceFromYield(fixedBond, asPercentage(newYield), settlementDate);
    const priceChange = newPrice - basePrice;
    const percentChange = (priceChange / basePrice) * 100;

    return {
      yieldChange: shock,
      priceChange,
      percentChange,
    };
  });
}

/**
 * Generate bond performance attribution report
 */
export async function generateBondPerformanceAttribution(
  bondInstrumentId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<{
  carrySummary: number;
  rolldownReturn: number;
  spreadChange: number;
  curveChange: number;
  totalReturn: number;
}> {
  const bond = await BondInstrument.findByPk(bondInstrumentId, {
    include: ['pricingScenarios'],
    transaction,
  });

  if (!bond) {
    throw new Error('Bond instrument not found');
  }

  const scenarios = bond.getDataValue('pricingScenarios') || [];
  const startScenario = scenarios.find(s => s.pricingDate >= startDate);
  const endScenario = scenarios.find(s => s.pricingDate >= endDate);

  if (!startScenario || !endScenario) {
    throw new Error('Pricing scenarios not found for specified dates');
  }

  // Calculate attribution components
  const yearsHeld = (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const carrySummary = Number(bond.couponRate) * yearsHeld;

  const rolldownReturn = Number(startScenario.modifiedDuration) * 0.01 * yearsHeld; // Simplified

  const spreadChange = (Number(endScenario.yieldToMaturity) - Number(startScenario.yieldToMaturity)) *
                       Number(startScenario.modifiedDuration) * -1;

  const curveChange = 0; // Simplified - would require curve analysis

  const totalReturn = carrySummary + rolldownReturn + spreadChange + curveChange;

  return {
    carrySummary,
    rolldownReturn,
    spreadChange,
    curveChange,
    totalReturn,
  };
}

/**
 * Screen bonds by relative value metrics
 */
export async function screenBondsByRelativeValue(
  minZSpread?: number,
  maxZSpread?: number,
  minOAS?: number,
  maxOAS?: number,
  minCreditSpread?: number,
  transaction?: Transaction
): Promise<BondCreditAnalysis[]> {
  const where: any = {};

  if (minZSpread !== undefined) {
    where.zSpread = { ...where.zSpread, [Op.gte]: minZSpread / 10000 };
  }

  if (maxZSpread !== undefined) {
    where.zSpread = { ...where.zSpread, [Op.lte]: maxZSpread / 10000 };
  }

  if (minOAS !== undefined) {
    where.optionAdjustedSpread = { ...where.optionAdjustedSpread, [Op.gte]: minOAS / 10000 };
  }

  if (maxOAS !== undefined) {
    where.optionAdjustedSpread = { ...where.optionAdjustedSpread, [Op.lte]: maxOAS / 10000 };
  }

  if (minCreditSpread !== undefined) {
    where.creditSpread = { ...where.creditSpread, [Op.gte]: minCreditSpread / 10000 };
  }

  return await BondCreditAnalysis.findAll({
    where,
    include: ['bondInstrument'],
    order: [['creditSpread', 'DESC']],
    transaction,
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all fixed income models
 */
export function initializeFixedIncomeModels(sequelize: Sequelize): void {
  BondInstrument.initModel(sequelize);
  YieldCurveConfiguration.initModel(sequelize);
  BondCreditAnalysis.initModel(sequelize);
  BondPricingScenario.initModel(sequelize);
  BondPortfolio.initModel(sequelize);
  PortfolioHolding.initModel(sequelize);
  defineFixedIncomeAssociations();
}

/**
 * Export all models and functions
 */
export {
  BondInstrument,
  YieldCurveConfiguration,
  BondCreditAnalysis,
  BondPricingScenario,
  BondPortfolio,
  PortfolioHolding,
};

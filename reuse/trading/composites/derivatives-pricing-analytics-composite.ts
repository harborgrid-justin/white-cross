/**
 * LOC: WC-COMP-TRADING-DERIV-001
 * File: /reuse/trading/composites/derivatives-pricing-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../derivatives-pricing-kit
 *
 * DOWNSTREAM (imported by):
 *   - Derivatives trading controllers
 *   - Options desk services
 *   - Risk management modules
 *   - Bloomberg Terminal integrations
 *   - Volatility surface engines
 */

/**
 * File: /reuse/trading/composites/derivatives-pricing-analytics-composite.ts
 * Locator: WC-COMP-TRADING-DERIV-001
 * Purpose: Bloomberg Terminal-Level Derivatives Pricing & Analytics Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, derivatives-pricing-kit
 * Downstream: Trading controllers, risk services, volatility engines, Bloomberg integrations
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 44 composed functions for comprehensive derivatives pricing and analytics
 *
 * LLM Context: Enterprise-grade derivatives pricing composite for institutional trading.
 * Provides Bloomberg Terminal-level options pricing, Greeks analytics, futures/swaps valuation,
 * exotic options, volatility surface modeling, option strategies, risk management, and
 * comprehensive derivatives portfolio analytics with full database persistence.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  Optional,
} from 'sequelize';

// Import from derivatives-pricing-kit
import {
  OptionType,
  OptionStyle,
  BarrierType,
  BasisPoints,
  Percentage,
  Volatility,
  OptionMarketData,
  Greeks,
  FuturesContract,
  InterestRateSwap,
  CreditDefaultSwap,
  SABRParameters,
  VolatilitySmilePoint,
  EuropeanOption,
  AmericanOption,
  asBasisPoints,
  asPercentage,
  asVolatility,
  bpsToPercentage,
  blackScholesCall,
  blackScholesPut,
  black76FuturesOption,
  binomialTreeCRR,
  binomialTreeJR,
  monteCarloEuropean,
  monteCarloAsian,
  monteCarloBarrier,
  americanOptionBinomial,
  calculateDelta,
  calculateGamma,
  calculateVega,
  calculateTheta,
  calculateRho,
  calculateCharm,
  calculateVanna,
  calculateVolga,
  portfolioGreeks,
  impliedVolatilityFromDelta,
  commodityFuturesPrice,
  indexFuturesPrice,
  bondFuturesPrice,
  currencyFuturesPrice,
  interestRateSwapValue,
  swapParRate,
  crossCurrencySwapValue,
  creditDefaultSwapPrice,
  cdsSpreadCalculation,
  fxSwapPoints,
  totalReturnSwap,
  barrierOptionUpAndOut,
  barrierOptionDownAndOut,
  asianOptionAnalytic,
  digitalOption,
  lookbackOption,
  strategyPayoff,
  strategyGreeks,
  breakEvenAnalysis,
  maxProfitLoss,
  impliedVolatilityNewton,
  impliedVolatilityBrent,
  volatilitySmileFit,
  sabrVolatilitySurface,
  historicalVolatility,
  valueAtRiskParametric,
  expectedShortfall,
  scenarioAnalysis,
  stressTestFramework,
  yearFraction,
  DerivativePricingError,
} from '../derivatives-pricing-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Option contract status
 */
export enum OptionContractStatus {
  ACTIVE = 'active',
  EXERCISED = 'exercised',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Strategy type enumeration
 */
export enum StrategyType {
  CALL_SPREAD = 'call_spread',
  PUT_SPREAD = 'put_spread',
  STRADDLE = 'straddle',
  STRANGLE = 'strangle',
  BUTTERFLY = 'butterfly',
  CONDOR = 'condor',
  COLLAR = 'collar',
  RISK_REVERSAL = 'risk_reversal',
  CALENDAR_SPREAD = 'calendar_spread',
  DIAGONAL_SPREAD = 'diagonal_spread',
}

/**
 * Volatility surface type
 */
export enum VolatilitySurfaceType {
  SABR = 'sabr',
  SVI = 'svi',
  POLYNOMIAL = 'polynomial',
  INTERPOLATED = 'interpolated',
}

/**
 * Position side
 */
export enum PositionSide {
  LONG = 'long',
  SHORT = 'short',
}

/**
 * Risk metric type
 */
export enum RiskMetricType {
  VAR = 'value_at_risk',
  CVAR = 'conditional_var',
  SCENARIO = 'scenario_analysis',
  STRESS = 'stress_test',
}

// ============================================================================
// SEQUELIZE MODEL: OptionContract
// ============================================================================

/**
 * TypeScript interface for OptionContract attributes
 */
export interface OptionContractAttributes {
  id: string;
  symbol: string;
  underlying: string;
  optionType: OptionType;
  optionStyle: OptionStyle;
  strike: number;
  expiry: Date;
  quantity: number;
  premium: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  status: OptionContractStatus;
  exercisePrice: number | null;
  exerciseDate: Date | null;
  underlyingPrice: number;
  riskFreeRate: number;
  dividendYield: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface OptionContractCreationAttributes extends Optional<OptionContractAttributes, 'id' | 'exercisePrice' | 'exerciseDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: OptionContract
 * Represents individual option contracts with pricing and Greeks
 */
export class OptionContract extends Model<OptionContractAttributes, OptionContractCreationAttributes> implements OptionContractAttributes {
  declare id: string;
  declare symbol: string;
  declare underlying: string;
  declare optionType: OptionType;
  declare optionStyle: OptionStyle;
  declare strike: number;
  declare expiry: Date;
  declare quantity: number;
  declare premium: number;
  declare impliedVolatility: number;
  declare delta: number;
  declare gamma: number;
  declare vega: number;
  declare theta: number;
  declare rho: number;
  declare status: OptionContractStatus;
  declare exercisePrice: number | null;
  declare exerciseDate: Date | null;
  declare underlyingPrice: number;
  declare riskFreeRate: number;
  declare dividendYield: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize OptionContract with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OptionContract {
    OptionContract.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'symbol',
        },
        underlying: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'underlying',
        },
        optionType: {
          type: DataTypes.ENUM('call', 'put'),
          allowNull: false,
          field: 'option_type',
        },
        optionStyle: {
          type: DataTypes.ENUM('european', 'american', 'bermudan'),
          allowNull: false,
          field: 'option_style',
        },
        strike: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'strike',
        },
        expiry: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'expiry',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'quantity',
        },
        premium: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'premium',
        },
        impliedVolatility: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'implied_volatility',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'delta',
        },
        gamma: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'gamma',
        },
        vega: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'vega',
        },
        theta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'theta',
        },
        rho: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'rho',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(OptionContractStatus)),
          allowNull: false,
          defaultValue: OptionContractStatus.ACTIVE,
          field: 'status',
        },
        exercisePrice: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: true,
          field: 'exercise_price',
        },
        exerciseDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'exercise_date',
        },
        underlyingPrice: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'underlying_price',
        },
        riskFreeRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'risk_free_rate',
        },
        dividendYield: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'dividend_yield',
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
        tableName: 'option_contracts',
        modelName: 'OptionContract',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['symbol'] },
          { fields: ['underlying'] },
          { fields: ['expiry'] },
          { fields: ['status'] },
          { fields: ['option_type'] },
        ],
      }
    );

    return OptionContract;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OptionStrategy
// ============================================================================

/**
 * TypeScript interface for OptionStrategy attributes
 */
export interface OptionStrategyAttributes {
  id: string;
  name: string;
  strategyType: StrategyType;
  description: string | null;
  legs: Record<string, any>[];
  totalPremium: number;
  maxProfit: number;
  maxLoss: number;
  breakEvenPoints: number[];
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface OptionStrategyCreationAttributes extends Optional<OptionStrategyAttributes, 'id' | 'description' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: OptionStrategy
 * Multi-leg option strategies (spreads, straddles, etc.)
 */
export class OptionStrategy extends Model<OptionStrategyAttributes, OptionStrategyCreationAttributes> implements OptionStrategyAttributes {
  declare id: string;
  declare name: string;
  declare strategyType: StrategyType;
  declare description: string | null;
  declare legs: Record<string, any>[];
  declare totalPremium: number;
  declare maxProfit: number;
  declare maxLoss: number;
  declare breakEvenPoints: number[];
  declare delta: number;
  declare gamma: number;
  declare vega: number;
  declare theta: number;
  declare rho: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize OptionStrategy with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OptionStrategy {
    OptionStrategy.init(
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
        strategyType: {
          type: DataTypes.ENUM(...Object.values(StrategyType)),
          allowNull: false,
          field: 'strategy_type',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        legs: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'legs',
        },
        totalPremium: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'total_premium',
        },
        maxProfit: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'max_profit',
        },
        maxLoss: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'max_loss',
        },
        breakEvenPoints: {
          type: DataTypes.ARRAY(DataTypes.DECIMAL),
          allowNull: false,
          defaultValue: [],
          field: 'break_even_points',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'delta',
        },
        gamma: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'gamma',
        },
        vega: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'vega',
        },
        theta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'theta',
        },
        rho: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'rho',
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
        tableName: 'option_strategies',
        modelName: 'OptionStrategy',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['strategy_type'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return OptionStrategy;
  }
}

// ============================================================================
// SEQUELIZE MODEL: VolatilitySurface
// ============================================================================

/**
 * TypeScript interface for VolatilitySurface attributes
 */
export interface VolatilitySurfaceAttributes {
  id: string;
  underlying: string;
  surfaceType: VolatilitySurfaceType;
  valuationDate: Date;
  smilePoints: Record<string, any>[];
  sabrParameters: Record<string, any> | null;
  polynomialCoefficients: number[] | null;
  atmVolatility: number;
  skew: number;
  convexity: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VolatilitySurfaceCreationAttributes extends Optional<VolatilitySurfaceAttributes, 'id' | 'sabrParameters' | 'polynomialCoefficients' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: VolatilitySurface
 * Volatility surface calibration and modeling
 */
export class VolatilitySurface extends Model<VolatilitySurfaceAttributes, VolatilitySurfaceCreationAttributes> implements VolatilitySurfaceAttributes {
  declare id: string;
  declare underlying: string;
  declare surfaceType: VolatilitySurfaceType;
  declare valuationDate: Date;
  declare smilePoints: Record<string, any>[];
  declare sabrParameters: Record<string, any> | null;
  declare polynomialCoefficients: number[] | null;
  declare atmVolatility: number;
  declare skew: number;
  declare convexity: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize VolatilitySurface with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof VolatilitySurface {
    VolatilitySurface.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        underlying: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'underlying',
        },
        surfaceType: {
          type: DataTypes.ENUM(...Object.values(VolatilitySurfaceType)),
          allowNull: false,
          field: 'surface_type',
        },
        valuationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'valuation_date',
        },
        smilePoints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'smile_points',
        },
        sabrParameters: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'sabr_parameters',
        },
        polynomialCoefficients: {
          type: DataTypes.ARRAY(DataTypes.DECIMAL),
          allowNull: true,
          field: 'polynomial_coefficients',
        },
        atmVolatility: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'atm_volatility',
        },
        skew: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'skew',
        },
        convexity: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'convexity',
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
        tableName: 'volatility_surfaces',
        modelName: 'VolatilitySurface',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['underlying'] },
          { fields: ['valuation_date'] },
          { fields: ['surface_type'] },
        ],
      }
    );

    return VolatilitySurface;
  }
}

// ============================================================================
// SEQUELIZE MODEL: DerivativePosition
// ============================================================================

/**
 * TypeScript interface for DerivativePosition attributes
 */
export interface DerivativePositionAttributes {
  id: string;
  portfolioId: string;
  instrumentType: string;
  instrumentId: string;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DerivativePositionCreationAttributes extends Optional<DerivativePositionAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: DerivativePosition
 * Portfolio positions in derivatives
 */
export class DerivativePosition extends Model<DerivativePositionAttributes, DerivativePositionCreationAttributes> implements DerivativePositionAttributes {
  declare id: string;
  declare portfolioId: string;
  declare instrumentType: string;
  declare instrumentId: string;
  declare side: PositionSide;
  declare quantity: number;
  declare entryPrice: number;
  declare currentPrice: number;
  declare marketValue: number;
  declare unrealizedPnL: number;
  declare realizedPnL: number;
  declare delta: number;
  declare gamma: number;
  declare vega: number;
  declare theta: number;
  declare rho: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize DerivativePosition with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DerivativePosition {
    DerivativePosition.init(
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
          field: 'portfolio_id',
        },
        instrumentType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'instrument_type',
        },
        instrumentId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'instrument_id',
        },
        side: {
          type: DataTypes.ENUM(...Object.values(PositionSide)),
          allowNull: false,
          field: 'side',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'quantity',
        },
        entryPrice: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'entry_price',
        },
        currentPrice: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'current_price',
        },
        marketValue: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'market_value',
        },
        unrealizedPnL: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'unrealized_pnl',
        },
        realizedPnL: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'realized_pnl',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'delta',
        },
        gamma: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'gamma',
        },
        vega: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'vega',
        },
        theta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'theta',
        },
        rho: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'rho',
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
        tableName: 'derivative_positions',
        modelName: 'DerivativePosition',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['instrument_type'] },
          { fields: ['instrument_id'] },
        ],
      }
    );

    return DerivativePosition;
  }
}

// ============================================================================
// OPTIONS PRICING FUNCTIONS (9 functions)
// ============================================================================

/**
 * Price European call option using Black-Scholes
 */
export async function priceEuropeanCall(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return blackScholesCall(marketData);
}

/**
 * Price European put option using Black-Scholes
 */
export async function priceEuropeanPut(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return blackScholesPut(marketData);
}

/**
 * Price American option using binomial tree
 */
export async function priceAmericanOption(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  steps: number = 100,
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return americanOptionBinomial(marketData, optionType, steps);
}

/**
 * Price futures option using Black-76 model
 */
export async function priceFuturesOption(
  futuresPrice: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  transaction?: Transaction
): Promise<number> {
  return black76FuturesOption(futuresPrice, strike, timeToExpiry, riskFreeRate, volatility, optionType);
}

/**
 * Price option using binomial tree (CRR method)
 */
export async function priceBinomialTreeCRR(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  optionStyle: OptionStyle,
  dividendYield: Percentage = asPercentage(0),
  steps: number = 100,
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return binomialTreeCRR(marketData, optionType, optionStyle, steps);
}

/**
 * Price option using Monte Carlo simulation
 */
export async function priceMonteCarloEuropean(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  paths: number = 10000,
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return monteCarloEuropean(marketData, optionType, paths);
}

/**
 * Create and price option contract in database
 */
export async function createPricedOptionContract(
  symbol: string,
  underlying: string,
  optionType: OptionType,
  optionStyle: OptionStyle,
  strike: number,
  expiry: Date,
  underlyingPrice: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  quantity: number,
  dividendYield: Percentage,
  createdBy: string,
  transaction?: Transaction
): Promise<OptionContract> {
  const timeToExpiry = yearFraction(new Date(), expiry);

  const marketData: OptionMarketData = {
    spot: underlyingPrice,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  // Calculate premium
  const premium = optionStyle === OptionStyle.European
    ? (optionType === OptionType.Call ? blackScholesCall(marketData) : blackScholesPut(marketData))
    : americanOptionBinomial(marketData, optionType);

  // Calculate Greeks
  const greeks = portfolioGreeks(marketData, optionType);

  return await OptionContract.create(
    {
      symbol,
      underlying,
      optionType,
      optionStyle,
      strike,
      expiry,
      quantity,
      premium,
      impliedVolatility: volatility,
      delta: greeks.delta,
      gamma: greeks.gamma,
      vega: greeks.vega,
      theta: greeks.theta,
      rho: greeks.rho,
      status: OptionContractStatus.ACTIVE,
      underlyingPrice,
      riskFreeRate,
      dividendYield,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Update option contract pricing and Greeks
 */
export async function updateOptionContractPricing(
  contractId: string,
  underlyingPrice: number,
  volatility: Volatility,
  riskFreeRate: Percentage,
  updatedBy: string,
  transaction?: Transaction
): Promise<OptionContract | null> {
  const contract = await OptionContract.findByPk(contractId, { transaction });
  if (!contract) return null;

  const timeToExpiry = yearFraction(new Date(), contract.expiry);

  const marketData: OptionMarketData = {
    spot: underlyingPrice,
    strike: contract.strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield: asPercentage(contract.dividendYield),
  };

  const premium = contract.optionStyle === OptionStyle.European
    ? (contract.optionType === OptionType.Call ? blackScholesCall(marketData) : blackScholesPut(marketData))
    : americanOptionBinomial(marketData, contract.optionType);

  const greeks = portfolioGreeks(marketData, contract.optionType);

  await contract.update(
    {
      premium,
      impliedVolatility: volatility,
      delta: greeks.delta,
      gamma: greeks.gamma,
      vega: greeks.vega,
      theta: greeks.theta,
      rho: greeks.rho,
      underlyingPrice,
      riskFreeRate,
      updatedBy,
    },
    { transaction }
  );

  return contract;
}

/**
 * Price barrier option (up-and-out)
 */
export async function priceBarrierOptionUpOut(
  spot: number,
  strike: number,
  barrier: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  rebate: number = 0,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return barrierOptionUpAndOut(marketData, barrier, rebate, optionType);
}

// ============================================================================
// GREEKS CALCULATION FUNCTIONS (10 functions)
// ============================================================================

/**
 * Calculate option delta
 */
export async function computeOptionDelta(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateDelta(marketData, optionType);
}

/**
 * Calculate option gamma
 */
export async function computeOptionGamma(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateGamma(marketData);
}

/**
 * Calculate option vega
 */
export async function computeOptionVega(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateVega(marketData);
}

/**
 * Calculate option theta (time decay)
 */
export async function computeOptionTheta(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateTheta(marketData, optionType);
}

/**
 * Calculate option rho (rate sensitivity)
 */
export async function computeOptionRho(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateRho(marketData, optionType);
}

/**
 * Calculate all Greeks for option
 */
export async function computeAllGreeks(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<Greeks> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return portfolioGreeks(marketData, optionType);
}

/**
 * Calculate charm (delta decay)
 */
export async function computeOptionCharm(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateCharm(marketData, optionType);
}

/**
 * Calculate vanna (delta-vega cross derivative)
 */
export async function computeOptionVanna(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateVanna(marketData);
}

/**
 * Calculate volga (vega convexity)
 */
export async function computeOptionVolga(
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<number> {
  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield,
  };

  return calculateVolga(marketData);
}

/**
 * Calculate portfolio Greeks aggregation
 */
export async function calculatePortfolioGreeks(
  portfolioId: string,
  transaction?: Transaction
): Promise<Greeks> {
  const positions = await DerivativePosition.findAll({
    where: { portfolioId },
    transaction,
  });

  let totalDelta = 0;
  let totalGamma = 0;
  let totalVega = 0;
  let totalTheta = 0;
  let totalRho = 0;

  for (const position of positions) {
    const multiplier = position.side === PositionSide.LONG ? 1 : -1;
    totalDelta += position.delta * position.quantity * multiplier;
    totalGamma += position.gamma * position.quantity * multiplier;
    totalVega += position.vega * position.quantity * multiplier;
    totalTheta += position.theta * position.quantity * multiplier;
    totalRho += position.rho * position.quantity * multiplier;
  }

  return {
    delta: totalDelta,
    gamma: totalGamma,
    vega: totalVega,
    theta: totalTheta,
    rho: totalRho,
  };
}

// ============================================================================
// IMPLIED VOLATILITY FUNCTIONS (3 functions)
// ============================================================================

/**
 * Calculate implied volatility using Newton-Raphson
 */
export async function calculateImpliedVolatilityNewton(
  marketPrice: number,
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<Volatility> {
  const data = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    dividendYield,
  };

  return impliedVolatilityNewton(marketPrice, data, optionType);
}

/**
 * Calculate implied volatility using Brent's method
 */
export async function calculateImpliedVolatilityBrent(
  marketPrice: number,
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<Volatility> {
  const data = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    dividendYield,
  };

  return impliedVolatilityBrent(marketPrice, data, optionType);
}

/**
 * Calculate implied volatility from target delta
 */
export async function calculateImpliedVolFromDelta(
  targetDelta: number,
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  optionType: OptionType,
  dividendYield: Percentage = asPercentage(0),
  transaction?: Transaction
): Promise<Volatility> {
  const data = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    dividendYield,
  };

  return impliedVolatilityFromDelta(targetDelta, data, optionType);
}

// ============================================================================
// FUTURES PRICING FUNCTIONS (4 functions)
// ============================================================================

/**
 * Price commodity futures contract
 */
export async function priceCommodityFutures(
  spot: number,
  riskFreeRate: Percentage,
  convenienceYield: Percentage,
  storageRate: Percentage,
  timeToExpiry: number,
  transaction?: Transaction
): Promise<number> {
  return commodityFuturesPrice(spot, riskFreeRate, convenienceYield, storageRate, timeToExpiry);
}

/**
 * Price index futures contract
 */
export async function priceIndexFutures(
  spot: number,
  riskFreeRate: Percentage,
  dividendYield: Percentage,
  timeToExpiry: number,
  transaction?: Transaction
): Promise<number> {
  return indexFuturesPrice(spot, riskFreeRate, dividendYield, timeToExpiry);
}

/**
 * Price bond futures contract
 */
export async function priceBondFutures(
  bondPrice: number,
  conversionFactor: number,
  accrued: number,
  repoRate: Percentage,
  timeToExpiry: number,
  transaction?: Transaction
): Promise<number> {
  return bondFuturesPrice(bondPrice, conversionFactor, accrued, repoRate, timeToExpiry);
}

/**
 * Price currency futures contract
 */
export async function priceCurrencyFutures(
  spot: number,
  domesticRate: Percentage,
  foreignRate: Percentage,
  timeToExpiry: number,
  transaction?: Transaction
): Promise<number> {
  return currencyFuturesPrice(spot, domesticRate, foreignRate, timeToExpiry);
}

// ============================================================================
// SWAP VALUATION FUNCTIONS (4 functions)
// ============================================================================

/**
 * Value interest rate swap
 */
export async function valueInterestRateSwap(
  swap: InterestRateSwap,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  forecastCurve: Array<{ maturity: number; rate: Percentage }>,
  valuationDate: Date,
  transaction?: Transaction
): Promise<number> {
  return interestRateSwapValue(swap, discountCurve, forecastCurve, valuationDate);
}

/**
 * Calculate par swap rate
 */
export async function calculateParSwapRate(
  notional: number,
  maturity: number,
  frequency: number,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  transaction?: Transaction
): Promise<Percentage> {
  return swapParRate(notional, maturity, frequency, discountCurve);
}

/**
 * Price credit default swap
 */
export async function priceCreditDefaultSwap(
  cds: CreditDefaultSwap,
  defaultProbability: Percentage,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  valuationDate: Date,
  transaction?: Transaction
): Promise<number> {
  return creditDefaultSwapPrice(cds, defaultProbability, discountCurve, valuationDate);
}

/**
 * Calculate CDS spread
 */
export async function calculateCDSSpread(
  notional: number,
  defaultProbability: Percentage,
  recoveryRate: Percentage,
  maturity: number,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  transaction?: Transaction
): Promise<BasisPoints> {
  return cdsSpreadCalculation(notional, defaultProbability, recoveryRate, maturity, discountCurve);
}

// ============================================================================
// OPTION STRATEGIES FUNCTIONS (5 functions)
// ============================================================================

/**
 * Create bull call spread strategy
 */
export async function createBullCallSpread(
  name: string,
  underlying: string,
  lowStrike: number,
  highStrike: number,
  expiry: Date,
  spot: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  quantity: number,
  createdBy: string,
  transaction?: Transaction
): Promise<OptionStrategy> {
  const timeToExpiry = yearFraction(new Date(), expiry);

  const marketDataLow: OptionMarketData = {
    spot,
    strike: lowStrike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield: asPercentage(0),
  };

  const marketDataHigh: OptionMarketData = {
    spot,
    strike: highStrike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield: asPercentage(0),
  };

  const longCallPrice = blackScholesCall(marketDataLow);
  const shortCallPrice = blackScholesCall(marketDataHigh);
  const totalPremium = (longCallPrice - shortCallPrice) * quantity;

  const longGreeks = portfolioGreeks(marketDataLow, OptionType.Call);
  const shortGreeks = portfolioGreeks(marketDataHigh, OptionType.Call);

  const legs = [
    { strike: lowStrike, type: 'call', position: 'long', quantity, price: longCallPrice },
    { strike: highStrike, type: 'call', position: 'short', quantity, price: shortCallPrice },
  ];

  return await OptionStrategy.create(
    {
      name,
      strategyType: StrategyType.CALL_SPREAD,
      description: `Bull call spread on ${underlying}`,
      legs,
      totalPremium,
      maxProfit: (highStrike - lowStrike - totalPremium / quantity) * quantity,
      maxLoss: totalPremium,
      breakEvenPoints: [lowStrike + totalPremium / quantity],
      delta: (longGreeks.delta - shortGreeks.delta) * quantity,
      gamma: (longGreeks.gamma - shortGreeks.gamma) * quantity,
      vega: (longGreeks.vega - shortGreeks.vega) * quantity,
      theta: (longGreeks.theta - shortGreeks.theta) * quantity,
      rho: (longGreeks.rho - shortGreeks.rho) * quantity,
      isActive: true,
      metadata: { underlying },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create straddle strategy
 */
export async function createStraddleStrategy(
  name: string,
  underlying: string,
  strike: number,
  expiry: Date,
  spot: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  quantity: number,
  createdBy: string,
  transaction?: Transaction
): Promise<OptionStrategy> {
  const timeToExpiry = yearFraction(new Date(), expiry);

  const marketData: OptionMarketData = {
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield: asPercentage(0),
  };

  const callPrice = blackScholesCall(marketData);
  const putPrice = blackScholesPut(marketData);
  const totalPremium = (callPrice + putPrice) * quantity;

  const callGreeks = portfolioGreeks(marketData, OptionType.Call);
  const putGreeks = portfolioGreeks(marketData, OptionType.Put);

  const legs = [
    { strike, type: 'call', position: 'long', quantity, price: callPrice },
    { strike, type: 'put', position: 'long', quantity, price: putPrice },
  ];

  const breakEven1 = strike - (callPrice + putPrice);
  const breakEven2 = strike + (callPrice + putPrice);

  return await OptionStrategy.create(
    {
      name,
      strategyType: StrategyType.STRADDLE,
      description: `Long straddle on ${underlying}`,
      legs,
      totalPremium,
      maxProfit: Infinity,
      maxLoss: totalPremium,
      breakEvenPoints: [breakEven1, breakEven2],
      delta: (callGreeks.delta + putGreeks.delta) * quantity,
      gamma: (callGreeks.gamma + putGreeks.gamma) * quantity,
      vega: (callGreeks.vega + putGreeks.vega) * quantity,
      theta: (callGreeks.theta + putGreeks.theta) * quantity,
      rho: (callGreeks.rho + putGreeks.rho) * quantity,
      isActive: true,
      metadata: { underlying },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create iron condor strategy
 */
export async function createIronCondor(
  name: string,
  underlying: string,
  putLowStrike: number,
  putHighStrike: number,
  callLowStrike: number,
  callHighStrike: number,
  expiry: Date,
  spot: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  quantity: number,
  createdBy: string,
  transaction?: Transaction
): Promise<OptionStrategy> {
  const timeToExpiry = yearFraction(new Date(), expiry);

  const createMarketData = (strike: number): OptionMarketData => ({
    spot,
    strike,
    timeToExpiry,
    riskFreeRate,
    volatility,
    dividendYield: asPercentage(0),
  });

  const putLowPrice = blackScholesPut(createMarketData(putLowStrike));
  const putHighPrice = blackScholesPut(createMarketData(putHighStrike));
  const callLowPrice = blackScholesCall(createMarketData(callLowStrike));
  const callHighPrice = blackScholesCall(createMarketData(callHighStrike));

  const totalPremium = (-putLowPrice + putHighPrice - callLowPrice + callHighPrice) * quantity;

  const legs = [
    { strike: putLowStrike, type: 'put', position: 'long', quantity, price: putLowPrice },
    { strike: putHighStrike, type: 'put', position: 'short', quantity, price: putHighPrice },
    { strike: callLowStrike, type: 'call', position: 'short', quantity, price: callLowPrice },
    { strike: callHighStrike, type: 'call', position: 'long', quantity, price: callHighPrice },
  ];

  return await OptionStrategy.create(
    {
      name,
      strategyType: StrategyType.CONDOR,
      description: `Iron condor on ${underlying}`,
      legs,
      totalPremium,
      maxProfit: totalPremium,
      maxLoss: (putHighStrike - putLowStrike - totalPremium / quantity) * quantity,
      breakEvenPoints: [],
      delta: 0,
      gamma: 0,
      vega: 0,
      theta: 0,
      rho: 0,
      isActive: true,
      metadata: { underlying },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate strategy Greeks
 */
export async function calculateStrategyGreeks(
  strategyId: string,
  transaction?: Transaction
): Promise<Greeks> {
  const strategy = await OptionStrategy.findByPk(strategyId, { transaction });
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  return {
    delta: strategy.delta,
    gamma: strategy.gamma,
    vega: strategy.vega,
    theta: strategy.theta,
    rho: strategy.rho,
  };
}

/**
 * Analyze strategy payoff at expiration
 */
export async function analyzeStrategyPayoff(
  strategyId: string,
  spotPrices: number[],
  transaction?: Transaction
): Promise<Array<{ spot: number; payoff: number }>> {
  const strategy = await OptionStrategy.findByPk(strategyId, { transaction });
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  return spotPrices.map(spot => {
    let totalPayoff = -strategy.totalPremium;

    for (const leg of strategy.legs) {
      const intrinsic = leg.type === 'call'
        ? Math.max(0, spot - leg.strike)
        : Math.max(0, leg.strike - spot);

      const multiplier = leg.position === 'long' ? 1 : -1;
      totalPayoff += multiplier * intrinsic * leg.quantity;
    }

    return { spot, payoff: totalPayoff };
  });
}

// ============================================================================
// VOLATILITY SURFACE FUNCTIONS (5 functions)
// ============================================================================

/**
 * Create volatility surface with SABR calibration
 */
export async function createSABRVolatilitySurface(
  underlying: string,
  valuationDate: Date,
  smilePoints: VolatilitySmilePoint[],
  sabrParams: SABRParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<VolatilitySurface> {
  const atmPoint = smilePoints.find(p => Math.abs(p.strike - smilePoints[0].strike) < 0.01);
  const atmVol = atmPoint ? atmPoint.impliedVol : smilePoints[0].impliedVol;

  const strikes = smilePoints.map(p => p.strike);
  const vols = smilePoints.map(p => p.impliedVol);
  const avgStrike = strikes.reduce((sum, k) => sum + k, 0) / strikes.length;

  const skew = (vols[vols.length - 1] - vols[0]) / (strikes[strikes.length - 1] - strikes[0]);
  const convexity = 0; // Simplified

  return await VolatilitySurface.create(
    {
      underlying,
      surfaceType: VolatilitySurfaceType.SABR,
      valuationDate,
      smilePoints: smilePoints.map(p => ({ strike: p.strike, vol: p.impliedVol })),
      sabrParameters: sabrParams,
      polynomialCoefficients: null,
      atmVolatility: atmVol,
      skew,
      convexity,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Fit polynomial volatility smile
 */
export async function fitPolynomialVolatilitySmile(
  underlying: string,
  valuationDate: Date,
  smilePoints: VolatilitySmilePoint[],
  degree: number,
  createdBy: string,
  transaction?: Transaction
): Promise<VolatilitySurface> {
  const coefficients = volatilitySmileFit(smilePoints, degree);

  const atmPoint = smilePoints.find(p => Math.abs(p.strike - smilePoints[0].strike) < 0.01);
  const atmVol = atmPoint ? atmPoint.impliedVol : smilePoints[0].impliedVol;

  const strikes = smilePoints.map(p => p.strike);
  const vols = smilePoints.map(p => p.impliedVol);
  const skew = (vols[vols.length - 1] - vols[0]) / (strikes[strikes.length - 1] - strikes[0]);

  return await VolatilitySurface.create(
    {
      underlying,
      surfaceType: VolatilitySurfaceType.POLYNOMIAL,
      valuationDate,
      smilePoints: smilePoints.map(p => ({ strike: p.strike, vol: p.impliedVol })),
      sabrParameters: null,
      polynomialCoefficients: coefficients,
      atmVolatility: atmVol,
      skew,
      convexity: 0,
      metadata: { degree },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate historical volatility
 */
export async function calculateHistoricalVolatility(
  prices: number[],
  method: 'close-to-close' | 'parkinson' | 'garman-klass' = 'close-to-close',
  annualizationFactor: number = 252,
  transaction?: Transaction
): Promise<Volatility> {
  return historicalVolatility(prices, method, annualizationFactor);
}

/**
 * Get interpolated volatility from surface
 */
export async function getInterpolatedVolatility(
  surfaceId: string,
  strike: number,
  transaction?: Transaction
): Promise<Volatility> {
  const surface = await VolatilitySurface.findByPk(surfaceId, { transaction });
  if (!surface) {
    throw new Error('Volatility surface not found');
  }

  if (surface.surfaceType === VolatilitySurfaceType.SABR && surface.sabrParameters) {
    const params = surface.sabrParameters as SABRParameters;
    const forward = strike; // Simplified
    const timeToExpiry = 1; // Simplified
    return sabrVolatilitySurface(params, forward, strike, timeToExpiry);
  }

  // Linear interpolation for other types
  const points = surface.smilePoints as Array<{ strike: number; vol: number }>;
  const sorted = [...points].sort((a, b) => a.strike - b.strike);

  if (strike <= sorted[0].strike) {
    return asVolatility(sorted[0].vol);
  }
  if (strike >= sorted[sorted.length - 1].strike) {
    return asVolatility(sorted[sorted.length - 1].vol);
  }

  let i = 0;
  while (i < sorted.length - 1 && sorted[i + 1].strike < strike) {
    i++;
  }

  const k1 = sorted[i].strike;
  const k2 = sorted[i + 1].strike;
  const v1 = sorted[i].vol;
  const v2 = sorted[i + 1].vol;

  const vol = v1 + (v2 - v1) * (strike - k1) / (k2 - k1);
  return asVolatility(vol);
}

/**
 * Calculate volatility skew metrics
 */
export async function calculateVolatilitySkew(
  surfaceId: string,
  transaction?: Transaction
): Promise<{ skew: number; atmVol: number; riskReversal25: number; butterfly25: number }> {
  const surface = await VolatilitySurface.findByPk(surfaceId, { transaction });
  if (!surface) {
    throw new Error('Volatility surface not found');
  }

  const points = surface.smilePoints as Array<{ strike: number; vol: number }>;
  const sorted = [...points].sort((a, b) => a.strike - b.strike);

  const atmVol = surface.atmVolatility;
  const skew = surface.skew;

  // 25-delta risk reversal and butterfly (simplified)
  const lowVol = sorted[0].vol;
  const highVol = sorted[sorted.length - 1].vol;
  const riskReversal25 = highVol - lowVol;
  const butterfly25 = (lowVol + highVol) / 2 - atmVol;

  return {
    skew,
    atmVol,
    riskReversal25,
    butterfly25,
  };
}

// ============================================================================
// RISK MANAGEMENT FUNCTIONS (4 functions)
// ============================================================================

/**
 * Calculate Value at Risk (parametric method)
 */
export async function calculatePortfolioVaR(
  portfolioId: string,
  portfolioValue: number,
  expectedReturn: Percentage,
  volatility: Volatility,
  confidenceLevel: number,
  timeHorizon: number,
  transaction?: Transaction
): Promise<number> {
  return valueAtRiskParametric(portfolioValue, expectedReturn, volatility, confidenceLevel, timeHorizon);
}

/**
 * Calculate Expected Shortfall (CVaR)
 */
export async function calculateExpectedShortfall(
  portfolioId: string,
  portfolioValue: number,
  expectedReturn: Percentage,
  volatility: Volatility,
  confidenceLevel: number,
  timeHorizon: number,
  transaction?: Transaction
): Promise<number> {
  return expectedShortfall(portfolioValue, expectedReturn, volatility, confidenceLevel, timeHorizon);
}

/**
 * Perform scenario analysis on portfolio
 */
export async function performScenarioAnalysis(
  portfolioId: string,
  baseValue: number,
  scenarios: Array<{
    name: string;
    spotChange: Percentage;
    volChange?: Percentage;
    rateChange?: Percentage;
  }>,
  transaction?: Transaction
): Promise<Array<{ scenario: string; value: number; pnl: number }>> {
  const greeks = await calculatePortfolioGreeks(portfolioId, transaction);

  return scenarioAnalysis(baseValue, scenarios, {
    delta: greeks.delta,
    gamma: greeks.gamma,
    vega: greeks.vega,
    rho: greeks.rho,
  });
}

/**
 * Execute stress testing framework
 */
export async function executeStressTest(
  portfolioId: string,
  baseValue: number,
  stressTests: Array<{
    name: string;
    spotChange: Percentage;
    volChange: Percentage;
    rateChange: Percentage;
  }>,
  transaction?: Transaction
): Promise<Array<{ test: string; value: number; pnl: number; percentChange: number }>> {
  const greeks = await calculatePortfolioGreeks(portfolioId, transaction);

  return stressTestFramework(baseValue, stressTests, greeks);
}

// ============================================================================
// MODEL INITIALIZATION
// ============================================================================

/**
 * Initialize all derivative models
 */
export function initializeDerivativeModels(sequelize: Sequelize): void {
  OptionContract.initModel(sequelize);
  OptionStrategy.initModel(sequelize);
  VolatilitySurface.initModel(sequelize);
  DerivativePosition.initModel(sequelize);
}

/**
 * Export all models and functions
 */
export {
  OptionContract,
  OptionStrategy,
  VolatilitySurface,
  DerivativePosition,
};

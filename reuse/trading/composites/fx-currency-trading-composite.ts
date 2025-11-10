/**
 * LOC: WC-COMP-TRADING-FX-001
 * File: /reuse/trading/composites/fx-currency-trading-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../fx-currency-trading-kit
 *
 * DOWNSTREAM (imported by):
 *   - FX trading controllers
 *   - Trading execution services
 *   - Risk management modules
 *   - Portfolio management systems
 */

/**
 * File: /reuse/trading/composites/fx-currency-trading-composite.ts
 * Locator: WC-COMP-TRADING-FX-001
 * Purpose: Bloomberg Terminal FX Trading Features - Comprehensive composite for spot trading, forwards, swaps, options, hedging, and portfolio management
 *
 * Upstream: @nestjs/common, sequelize, fx-currency-trading-kit
 * Downstream: Trading controllers, execution services, risk modules, portfolio systems
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 43 composed functions for complete Bloomberg Terminal FX trading workflow
 *
 * LLM Context: Enterprise-grade FX trading composite for Bloomberg Terminal features.
 * Provides production-ready spot trading, forward pricing, currency swaps, FX options with Greeks,
 * volatility surface management, hedging strategies, carry trade optimization, multi-currency portfolio
 * management, real-time rate aggregation, and comprehensive risk analytics for professional traders.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  Optional,
} from 'sequelize';

import {
  // Types
  CurrencyCode,
  CurrencyPair,
  FXSpotQuote,
  FXForwardQuote,
  FXSwapQuote,
  FXOption,
  FXOptionPrice,
  FXOptionGreeks,
  VolatilitySurface,
  VolatilitySurfacePoint,
  CurrencyCorrelation,
  HedgeResult,
  CurrencyBasket,
  CarryTrade,
  RateSource,
  // Spot pricing
  calculateFXSpotMid,
  calculateFXSpotBidAsk,
  calculateFXSpotLiquidityAdjusted,
  calculateFXSpotVWAP,
  calculateFXSpotTWAP,
  calculateFXSpotBestExecution,
  // Forward pricing
  calculateFXForwardPoints,
  calculateFXOutrightForward,
  calculateFXImpliedYield,
  calculateFXForwardPremiumDiscount,
  calculateFXForwardSettlement,
  calculateFXForwardBreakeven,
  // Cross currency
  calculateCrossCurrencyRate,
  detectTriangularArbitrage,
  calculateSyntheticPair,
  calculateCrossCurrencyBasis,
  optimizeCrossCurrencyPath,
  // Swaps
  calculateFXSwapPoints,
  calculateFXSwapNearFarLegs,
  calculateFXTomNext,
  calculateFXSpotNext,
  calculateFXSwapImpliedRate,
  // Currency pair utilities
  convertCurrencyPair,
  normalizeCurrencyPair,
  validateCurrencyPair,
  getCurrencyPairPrecision,
  formatCurrencyAmount,
  // Options
  calculateFXVanillaOptionPrice,
  calculateFXDigitalOptionPrice,
  calculateFXOptionDelta,
  calculateFXOptionGamma,
  calculateFXOptionVega,
  calculateFXOptionTheta,
  calculateFXOptionRho,
  calculateFXOptionImpliedVolatility,
  // Volatility
  calculateFXImpliedVolatility,
  constructFXVolatilitySurface,
  interpolateFXVolatilitySurface,
  calculateFXVolatilitySmile,
  calculateFXATMVolatility,
  calculateFXRiskReversalButterfly,
  // Correlation
  calculateCurrencyCorrelationMatrix,
  calculateRollingCurrencyCorrelation,
  detectCorrelationRegimeChange,
  calculateCurrencyBeta,
  // Hedging
  calculateDeltaHedge,
  calculatePortfolioHedge,
  calculateOptimalHedgeRatio,
  calculateHedgeEffectiveness,
  rebalanceDeltaHedge,
  // Basket
  constructCurrencyBasket,
  rebalanceCurrencyBasket,
  calculateBasketPerformanceAttribution,
  calculateBasketVolatility,
  // Carry trade
  calculateFXCarryReturn,
  calculateFXFundingCost,
  calculateFXRollYield,
  rankCurrencyCarry,
  // Rate aggregation
  aggregateFXRatesMultiSource,
  calculateFXRateVWAP,
  calculateFXRateTWAP,
  selectBestFXExecution,
} from '../fx-currency-trading-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * FX trade direction
 */
export enum TradeDirection {
  BUY = 'buy',
  SELL = 'sell',
}

/**
 * FX order types
 */
export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
  STOP = 'stop',
  STOP_LIMIT = 'stop_limit',
  OCO = 'oco', // One-Cancels-Other
  ICEBERG = 'iceberg',
}

/**
 * FX order status
 */
export enum OrderStatus {
  PENDING = 'pending',
  OPEN = 'open',
  PARTIALLY_FILLED = 'partially_filled',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * FX position types
 */
export enum PositionType {
  SPOT = 'spot',
  FORWARD = 'forward',
  SWAP = 'swap',
  OPTION = 'option',
  SYNTHETIC = 'synthetic',
}

/**
 * FX hedge strategy types
 */
export enum HedgeStrategy {
  DELTA_NEUTRAL = 'delta_neutral',
  FULL_HEDGE = 'full_hedge',
  PARTIAL_HEDGE = 'partial_hedge',
  DYNAMIC_HEDGE = 'dynamic_hedge',
  PORTFOLIO_HEDGE = 'portfolio_hedge',
  CROSS_HEDGE = 'cross_hedge',
}

/**
 * Risk metrics
 */
export enum RiskMetric {
  VAR_95 = 'var_95',
  VAR_99 = 'var_99',
  CVAR = 'cvar',
  SHARPE_RATIO = 'sharpe_ratio',
  SORTINO_RATIO = 'sortino_ratio',
  MAX_DRAWDOWN = 'max_drawdown',
}

// ============================================================================
// SEQUELIZE MODEL: FXTrade
// ============================================================================

/**
 * TypeScript interface for FXTrade attributes
 */
export interface FXTradeAttributes {
  id: string;
  orderId: string | null;
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  direction: TradeDirection;
  positionType: PositionType;
  notional: number;
  executionRate: number;
  spotRate: number;
  forwardPoints: number | null;
  tenor: number | null;
  settlementDate: Date;
  executionTime: Date;
  counterparty: string;
  traderId: string;
  commission: number;
  spreadCost: number;
  slippage: number;
  pnl: number;
  realizedPnl: number;
  unrealizedPnl: number;
  isHedge: boolean;
  hedgeStrategy: HedgeStrategy | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FXTradeCreationAttributes extends Optional<FXTradeAttributes, 'id' | 'orderId' | 'forwardPoints' | 'tenor' | 'hedgeStrategy' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: FXTrade
 * Core FX trade execution and settlement records
 */
export class FXTrade extends Model<FXTradeAttributes, FXTradeCreationAttributes> implements FXTradeAttributes {
  declare id: string;
  declare orderId: string | null;
  declare pair: string;
  declare baseCurrency: string;
  declare quoteCurrency: string;
  declare direction: TradeDirection;
  declare positionType: PositionType;
  declare notional: number;
  declare executionRate: number;
  declare spotRate: number;
  declare forwardPoints: number | null;
  declare tenor: number | null;
  declare settlementDate: Date;
  declare executionTime: Date;
  declare counterparty: string;
  declare traderId: string;
  declare commission: number;
  declare spreadCost: number;
  declare slippage: number;
  declare pnl: number;
  declare realizedPnl: number;
  declare unrealizedPnl: number;
  declare isHedge: boolean;
  declare hedgeStrategy: HedgeStrategy | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize FXTrade with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FXTrade {
    FXTrade.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'fx_orders',
            key: 'id',
          },
          field: 'order_id',
        },
        pair: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'pair',
        },
        baseCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'base_currency',
        },
        quoteCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'quote_currency',
        },
        direction: {
          type: DataTypes.ENUM(...Object.values(TradeDirection)),
          allowNull: false,
          field: 'direction',
        },
        positionType: {
          type: DataTypes.ENUM(...Object.values(PositionType)),
          allowNull: false,
          field: 'position_type',
        },
        notional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'notional',
        },
        executionRate: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'execution_rate',
        },
        spotRate: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'spot_rate',
        },
        forwardPoints: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'forward_points',
        },
        tenor: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'tenor',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'settlement_date',
        },
        executionTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'execution_time',
        },
        counterparty: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'counterparty',
        },
        traderId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'trader_id',
        },
        commission: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'commission',
        },
        spreadCost: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'spread_cost',
        },
        slippage: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'slippage',
        },
        pnl: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'pnl',
        },
        realizedPnl: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'realized_pnl',
        },
        unrealizedPnl: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'unrealized_pnl',
        },
        isHedge: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_hedge',
        },
        hedgeStrategy: {
          type: DataTypes.ENUM(...Object.values(HedgeStrategy)),
          allowNull: true,
          field: 'hedge_strategy',
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
        tableName: 'fx_trades',
        modelName: 'FXTrade',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['pair'] },
          { fields: ['direction'] },
          { fields: ['position_type'] },
          { fields: ['trader_id'] },
          { fields: ['execution_time'] },
          { fields: ['settlement_date'] },
          { fields: ['is_hedge'] },
        ],
      }
    );

    return FXTrade;
  }
}

// ============================================================================
// SEQUELIZE MODEL: FXOrder
// ============================================================================

/**
 * TypeScript interface for FXOrder attributes
 */
export interface FXOrderAttributes {
  id: string;
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  direction: TradeDirection;
  orderType: OrderType;
  positionType: PositionType;
  notional: number;
  limitPrice: number | null;
  stopPrice: number | null;
  filledNotional: number;
  averageFillPrice: number | null;
  status: OrderStatus;
  tenor: number | null;
  settlementDate: Date | null;
  expiryTime: Date | null;
  traderId: string;
  accountId: string;
  timeInForce: string;
  isIceberg: boolean;
  displaySize: number | null;
  minimumFillSize: number | null;
  allowPartialFill: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FXOrderCreationAttributes extends Optional<FXOrderAttributes, 'id' | 'limitPrice' | 'stopPrice' | 'averageFillPrice' | 'tenor' | 'settlementDate' | 'expiryTime' | 'displaySize' | 'minimumFillSize' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: FXOrder
 * FX order management and execution tracking
 */
export class FXOrder extends Model<FXOrderAttributes, FXOrderCreationAttributes> implements FXOrderAttributes {
  declare id: string;
  declare pair: string;
  declare baseCurrency: string;
  declare quoteCurrency: string;
  declare direction: TradeDirection;
  declare orderType: OrderType;
  declare positionType: PositionType;
  declare notional: number;
  declare limitPrice: number | null;
  declare stopPrice: number | null;
  declare filledNotional: number;
  declare averageFillPrice: number | null;
  declare status: OrderStatus;
  declare tenor: number | null;
  declare settlementDate: Date | null;
  declare expiryTime: Date | null;
  declare traderId: string;
  declare accountId: string;
  declare timeInForce: string;
  declare isIceberg: boolean;
  declare displaySize: number | null;
  declare minimumFillSize: number | null;
  declare allowPartialFill: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize FXOrder with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FXOrder {
    FXOrder.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        pair: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'pair',
        },
        baseCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'base_currency',
        },
        quoteCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'quote_currency',
        },
        direction: {
          type: DataTypes.ENUM(...Object.values(TradeDirection)),
          allowNull: false,
          field: 'direction',
        },
        orderType: {
          type: DataTypes.ENUM(...Object.values(OrderType)),
          allowNull: false,
          field: 'order_type',
        },
        positionType: {
          type: DataTypes.ENUM(...Object.values(PositionType)),
          allowNull: false,
          field: 'position_type',
        },
        notional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'notional',
        },
        limitPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'limit_price',
        },
        stopPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'stop_price',
        },
        filledNotional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'filled_notional',
        },
        averageFillPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'average_fill_price',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
          field: 'status',
        },
        tenor: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'tenor',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'settlement_date',
        },
        expiryTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expiry_time',
        },
        traderId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'trader_id',
        },
        accountId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'account_id',
        },
        timeInForce: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'GTC', // Good Till Cancel
          field: 'time_in_force',
        },
        isIceberg: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_iceberg',
        },
        displaySize: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: true,
          field: 'display_size',
        },
        minimumFillSize: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: true,
          field: 'minimum_fill_size',
        },
        allowPartialFill: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'allow_partial_fill',
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
        tableName: 'fx_orders',
        modelName: 'FXOrder',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['pair'] },
          { fields: ['direction'] },
          { fields: ['order_type'] },
          { fields: ['status'] },
          { fields: ['trader_id'] },
          { fields: ['account_id'] },
        ],
      }
    );

    return FXOrder;
  }
}

// ============================================================================
// SEQUELIZE MODEL: FXPosition
// ============================================================================

/**
 * TypeScript interface for FXPosition attributes
 */
export interface FXPositionAttributes {
  id: string;
  accountId: string;
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  positionType: PositionType;
  notional: number;
  averageEntryRate: number;
  currentRate: number;
  unrealizedPnl: number;
  realizedPnl: number;
  commission: number;
  swapPoints: number;
  marginUsed: number;
  leverage: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  exposure: Record<string, number>;
  hedgeRatio: number;
  isHedged: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FXPositionCreationAttributes extends Optional<FXPositionAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: FXPosition
 * Active FX positions with risk metrics
 */
export class FXPosition extends Model<FXPositionAttributes, FXPositionCreationAttributes> implements FXPositionAttributes {
  declare id: string;
  declare accountId: string;
  declare pair: string;
  declare baseCurrency: string;
  declare quoteCurrency: string;
  declare positionType: PositionType;
  declare notional: number;
  declare averageEntryRate: number;
  declare currentRate: number;
  declare unrealizedPnl: number;
  declare realizedPnl: number;
  declare commission: number;
  declare swapPoints: number;
  declare marginUsed: number;
  declare leverage: number;
  declare delta: number;
  declare gamma: number;
  declare vega: number;
  declare theta: number;
  declare exposure: Record<string, number>;
  declare hedgeRatio: number;
  declare isHedged: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize FXPosition with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FXPosition {
    FXPosition.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'account_id',
        },
        pair: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'pair',
        },
        baseCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'base_currency',
        },
        quoteCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'quote_currency',
        },
        positionType: {
          type: DataTypes.ENUM(...Object.values(PositionType)),
          allowNull: false,
          field: 'position_type',
        },
        notional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'notional',
        },
        averageEntryRate: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'average_entry_rate',
        },
        currentRate: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'current_rate',
        },
        unrealizedPnl: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'unrealized_pnl',
        },
        realizedPnl: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'realized_pnl',
        },
        commission: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'commission',
        },
        swapPoints: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'swap_points',
        },
        marginUsed: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'margin_used',
        },
        leverage: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 1,
          field: 'leverage',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'delta',
        },
        gamma: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'gamma',
        },
        vega: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'vega',
        },
        theta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'theta',
        },
        exposure: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'exposure',
        },
        hedgeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'hedge_ratio',
        },
        isHedged: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_hedged',
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
        tableName: 'fx_positions',
        modelName: 'FXPosition',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['pair'] },
          { fields: ['position_type'] },
          { fields: ['is_hedged'] },
        ],
      }
    );

    return FXPosition;
  }
}

// ============================================================================
// SEQUELIZE MODEL: FXHedge
// ============================================================================

/**
 * TypeScript interface for FXHedge attributes
 */
export interface FXHedgeAttributes {
  id: string;
  positionId: string;
  strategy: HedgeStrategy;
  hedgePair: string;
  hedgeNotional: number;
  hedgeRate: number;
  hedgeRatio: number;
  effectiveness: number;
  residualRisk: number;
  delta: number;
  isActive: boolean;
  rebalanceFrequency: number;
  lastRebalance: Date | null;
  nextRebalance: Date | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FXHedgeCreationAttributes extends Optional<FXHedgeAttributes, 'id' | 'lastRebalance' | 'nextRebalance' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: FXHedge
 * FX hedging strategies and positions
 */
export class FXHedge extends Model<FXHedgeAttributes, FXHedgeCreationAttributes> implements FXHedgeAttributes {
  declare id: string;
  declare positionId: string;
  declare strategy: HedgeStrategy;
  declare hedgePair: string;
  declare hedgeNotional: number;
  declare hedgeRate: number;
  declare hedgeRatio: number;
  declare effectiveness: number;
  declare residualRisk: number;
  declare delta: number;
  declare isActive: boolean;
  declare rebalanceFrequency: number;
  declare lastRebalance: Date | null;
  declare nextRebalance: Date | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize FXHedge with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FXHedge {
    FXHedge.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        positionId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'fx_positions',
            key: 'id',
          },
          field: 'position_id',
        },
        strategy: {
          type: DataTypes.ENUM(...Object.values(HedgeStrategy)),
          allowNull: false,
          field: 'strategy',
        },
        hedgePair: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'hedge_pair',
        },
        hedgeNotional: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'hedge_notional',
        },
        hedgeRate: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'hedge_rate',
        },
        hedgeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'hedge_ratio',
        },
        effectiveness: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          field: 'effectiveness',
        },
        residualRisk: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'residual_risk',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'delta',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        rebalanceFrequency: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'rebalance_frequency',
        },
        lastRebalance: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_rebalance',
        },
        nextRebalance: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'next_rebalance',
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
        tableName: 'fx_hedges',
        modelName: 'FXHedge',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['strategy'] },
          { fields: ['is_active'] },
          { fields: ['next_rebalance'] },
        ],
      }
    );

    return FXHedge;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineFXTradingAssociations(): void {
  FXOrder.hasMany(FXTrade, {
    foreignKey: 'orderId',
    as: 'trades',
    onDelete: 'SET NULL',
  });

  FXTrade.belongsTo(FXOrder, {
    foreignKey: 'orderId',
    as: 'order',
  });

  FXPosition.hasMany(FXHedge, {
    foreignKey: 'positionId',
    as: 'hedges',
    onDelete: 'CASCADE',
  });

  FXHedge.belongsTo(FXPosition, {
    foreignKey: 'positionId',
    as: 'position',
  });
}

// ============================================================================
// SPOT TRADING FUNCTIONS
// ============================================================================

/**
 * Execute FX spot trade with best execution
 * Aggregates quotes from multiple sources and executes at optimal price
 */
export async function executeFXSpotTrade(
  pair: string,
  direction: TradeDirection,
  notional: number,
  rateSources: RateSource[],
  traderId: string,
  counterparty: string,
  createdBy: string,
  transaction?: Transaction
): Promise<FXTrade> {
  // Get best execution rate
  const bestExecution = selectBestFXExecution(
    rateSources,
    notional,
    direction === TradeDirection.BUY ? 'buy' : 'sell'
  );

  const executionRate = direction === TradeDirection.BUY ? bestExecution.quote.ask : bestExecution.quote.bid;
  const spotRate = bestExecution.quote.mid;
  const spread = calculateFXSpotBidAsk(bestExecution.quote.bid, bestExecution.quote.ask, bestExecution.quote.pair.pipSize);
  const spreadCost = spread * notional * bestExecution.quote.pair.pipSize;

  const settlementDate = new Date();
  settlementDate.setDate(settlementDate.getDate() + 2); // T+2 settlement

  const trade = await FXTrade.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction,
      positionType: PositionType.SPOT,
      notional,
      executionRate,
      spotRate,
      settlementDate,
      executionTime: new Date(),
      counterparty,
      traderId,
      commission: 0,
      spreadCost,
      slippage: 0,
      pnl: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      isHedge: false,
      metadata: {
        source: bestExecution.source.name,
        reliability: bestExecution.source.reliability,
        latency: bestExecution.source.latency,
      },
      createdBy,
    },
    { transaction }
  );

  return trade;
}

/**
 * Calculate FX spot position mark-to-market
 * Updates position PnL based on current market rates
 */
export async function calculateSpotPositionMTM(
  positionId: string,
  currentQuote: FXSpotQuote,
  updatedBy: string,
  transaction?: Transaction
): Promise<FXPosition | null> {
  const position = await FXPosition.findByPk(positionId, { transaction });
  if (!position) return null;

  const currentRate = currentQuote.mid;
  const rateDiff = currentRate - position.averageEntryRate;
  const unrealizedPnl = rateDiff * position.notional;

  await position.update(
    {
      currentRate,
      unrealizedPnl,
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * Create market order
 */
export async function createFXMarketOrder(
  pair: string,
  direction: TradeDirection,
  notional: number,
  traderId: string,
  accountId: string,
  createdBy: string,
  transaction?: Transaction
): Promise<FXOrder> {
  const order = await FXOrder.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction,
      orderType: OrderType.MARKET,
      positionType: PositionType.SPOT,
      notional,
      filledNotional: 0,
      status: OrderStatus.PENDING,
      traderId,
      accountId,
      timeInForce: 'IOC', // Immediate or Cancel
      isIceberg: false,
      allowPartialFill: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );

  return order;
}

/**
 * Create limit order
 */
export async function createFXLimitOrder(
  pair: string,
  direction: TradeDirection,
  notional: number,
  limitPrice: number,
  traderId: string,
  accountId: string,
  createdBy: string,
  transaction?: Transaction
): Promise<FXOrder> {
  const order = await FXOrder.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction,
      orderType: OrderType.LIMIT,
      positionType: PositionType.SPOT,
      notional,
      limitPrice,
      filledNotional: 0,
      status: OrderStatus.OPEN,
      traderId,
      accountId,
      timeInForce: 'GTC',
      isIceberg: false,
      allowPartialFill: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );

  return order;
}

// ============================================================================
// FORWARD PRICING FUNCTIONS
// ============================================================================

/**
 * Execute FX forward trade
 * Calculates forward rate and creates forward position
 */
export async function executeFXForwardTrade(
  pair: string,
  direction: TradeDirection,
  notional: number,
  spotRate: number,
  tenor: number,
  baseRate: number,
  quoteRate: number,
  traderId: string,
  counterparty: string,
  createdBy: string,
  transaction?: Transaction
): Promise<FXTrade> {
  const forwardPoints = calculateFXForwardPoints(spotRate, baseRate, quoteRate, tenor / 365);
  const outrightForward = calculateFXOutrightForward(spotRate, forwardPoints);

  const settlementDate = new Date();
  settlementDate.setDate(settlementDate.getDate() + tenor);

  const trade = await FXTrade.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction,
      positionType: PositionType.FORWARD,
      notional,
      executionRate: outrightForward,
      spotRate,
      forwardPoints,
      tenor,
      settlementDate,
      executionTime: new Date(),
      counterparty,
      traderId,
      commission: 0,
      spreadCost: 0,
      slippage: 0,
      pnl: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      isHedge: false,
      metadata: {
        baseRate,
        quoteRate,
      },
      createdBy,
    },
    { transaction }
  );

  return trade;
}

/**
 * Calculate forward position valuation
 * Values forward based on current forward curve
 */
export async function calculateForwardPositionValue(
  positionId: string,
  currentSpotRate: number,
  currentBaseRate: number,
  currentQuoteRate: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<FXPosition | null> {
  const position = await FXPosition.findByPk(positionId, { transaction });
  if (!position || !position.metadata.tenor) return null;

  const remainingTenor = position.metadata.tenor as number;
  const currentForwardPoints = calculateFXForwardPoints(
    currentSpotRate,
    currentBaseRate,
    currentQuoteRate,
    remainingTenor / 365
  );
  const currentForwardRate = calculateFXOutrightForward(currentSpotRate, currentForwardPoints);

  const unrealizedPnl = (currentForwardRate - position.averageEntryRate) * position.notional;

  await position.update(
    {
      currentRate: currentForwardRate,
      unrealizedPnl,
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * Calculate forward breakeven analysis
 * Determines breakeven spot rate at settlement
 */
export function analyzeForwardBreakeven(
  spotRate: number,
  forwardRate: number,
  baseRate: number,
  quoteRate: number,
  tenor: number
): Record<string, any> {
  const forwardPoints = calculateFXForwardPoints(spotRate, baseRate, quoteRate, tenor / 365);
  const breakevenRate = calculateFXForwardBreakeven(spotRate, baseRate, quoteRate, tenor / 365);
  const premium = calculateFXForwardPremiumDiscount(spotRate, forwardRate);

  return {
    spotRate,
    forwardRate,
    forwardPoints,
    breakevenRate,
    premium,
    isForwardPremium: premium > 0,
    profitThreshold: breakevenRate,
    rateDeviation: forwardRate - spotRate,
  };
}

// ============================================================================
// SWAP FUNCTIONS
// ============================================================================

/**
 * Execute FX swap trade
 * Creates near and far leg positions
 */
export async function executeFXSwapTrade(
  pair: string,
  direction: TradeDirection,
  notional: number,
  spotRate: number,
  nearTenor: number,
  farTenor: number,
  baseRate: number,
  quoteRate: number,
  traderId: string,
  counterparty: string,
  createdBy: string,
  transaction?: Transaction
): Promise<{ nearLeg: FXTrade; farLeg: FXTrade }> {
  const swapResult = calculateFXSwapNearFarLegs(spotRate, baseRate, quoteRate, nearTenor / 365, farTenor / 365);

  const nearSettlementDate = new Date();
  nearSettlementDate.setDate(nearSettlementDate.getDate() + nearTenor);

  const farSettlementDate = new Date();
  farSettlementDate.setDate(farSettlementDate.getDate() + farTenor);

  // Near leg (buy)
  const nearLeg = await FXTrade.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction,
      positionType: PositionType.SWAP,
      notional,
      executionRate: swapResult.nearLegRate,
      spotRate,
      forwardPoints: swapResult.nearLegRate - spotRate,
      tenor: nearTenor,
      settlementDate: nearSettlementDate,
      executionTime: new Date(),
      counterparty,
      traderId,
      commission: 0,
      spreadCost: 0,
      slippage: 0,
      pnl: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      isHedge: false,
      metadata: {
        swapLeg: 'near',
        swapPoints: swapResult.swapPoints,
      },
      createdBy,
    },
    { transaction }
  );

  // Far leg (sell)
  const farLeg = await FXTrade.create(
    {
      pair,
      baseCurrency: pair.split('/')[0],
      quoteCurrency: pair.split('/')[1],
      direction: direction === TradeDirection.BUY ? TradeDirection.SELL : TradeDirection.BUY,
      positionType: PositionType.SWAP,
      notional,
      executionRate: swapResult.farLegRate,
      spotRate,
      forwardPoints: swapResult.farLegRate - spotRate,
      tenor: farTenor,
      settlementDate: farSettlementDate,
      executionTime: new Date(),
      counterparty,
      traderId,
      commission: 0,
      spreadCost: 0,
      slippage: 0,
      pnl: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      isHedge: false,
      metadata: {
        swapLeg: 'far',
        swapPoints: swapResult.swapPoints,
      },
      createdBy,
    },
    { transaction }
  );

  return { nearLeg, farLeg };
}

/**
 * Calculate tom-next swap rate
 */
export function calculateTomNextSwap(
  spotRate: number,
  baseRate: number,
  quoteRate: number
): Record<string, any> {
  const tomNextPoints = calculateFXTomNext(spotRate, baseRate, quoteRate);
  const tomNextRate = spotRate + tomNextPoints;

  return {
    spotRate,
    tomNextPoints,
    tomNextRate,
    annualizedCost: tomNextPoints * 365,
    dailyCost: tomNextPoints,
  };
}

/**
 * Calculate spot-next swap rate
 */
export function calculateSpotNextSwap(
  spotRate: number,
  baseRate: number,
  quoteRate: number
): Record<string, any> {
  const spotNextPoints = calculateFXSpotNext(spotRate, baseRate, quoteRate);
  const spotNextRate = spotRate + spotNextPoints;

  return {
    spotRate,
    spotNextPoints,
    spotNextRate,
    annualizedCost: spotNextPoints * 365,
    dailyCost: spotNextPoints,
  };
}

// ============================================================================
// CROSS-CURRENCY FUNCTIONS
// ============================================================================

/**
 * Calculate cross-currency rate with validation
 */
export function calculateCrossCurrencyQuote(
  pair1: CurrencyPair,
  pair2: CurrencyPair,
  rate1: number,
  rate2: number
): Record<string, any> {
  const crossRate = calculateCrossCurrencyRate(
    pair1.base as CurrencyCode,
    pair1.quote as CurrencyCode,
    pair2.quote as CurrencyCode,
    rate1,
    rate2
  );

  return {
    pair1: `${pair1.base}/${pair1.quote}`,
    pair2: `${pair2.base}/${pair2.quote}`,
    rate1,
    rate2,
    crossRate,
    crossPair: `${pair1.base}/${pair2.quote}`,
  };
}

/**
 * Detect and report triangular arbitrage opportunities
 */
export function detectTriangularArbitrageOpportunities(
  rates: Map<string, number>,
  threshold: number = 0.0001
): Array<Record<string, any>> {
  const opportunities: Array<Record<string, any>> = [];

  // Check all possible triangular paths
  const currencies = new Set<string>();
  for (const [pair] of rates) {
    const [base, quote] = pair.split('/');
    currencies.add(base);
    currencies.add(quote);
  }

  const currencyArray = Array.from(currencies);

  for (let i = 0; i < currencyArray.length; i++) {
    for (let j = 0; j < currencyArray.length; j++) {
      for (let k = 0; k < currencyArray.length; k++) {
        if (i !== j && j !== k && i !== k) {
          const c1 = currencyArray[i] as CurrencyCode;
          const c2 = currencyArray[j] as CurrencyCode;
          const c3 = currencyArray[k] as CurrencyCode;

          const r12 = rates.get(`${c1}/${c2}`);
          const r23 = rates.get(`${c2}/${c3}`);
          const r31 = rates.get(`${c3}/${c1}`);

          if (r12 && r23 && r31) {
            const result = detectTriangularArbitrage(c1, c2, c3, r12, r23, r31, threshold);
            if (result.hasArbitrage) {
              opportunities.push({
                path: [c1, c2, c3],
                rates: { r12, r23, r31 },
                profit: result.profitPercentage,
                directRate: result.directRate,
                syntheticRate: result.syntheticRate,
              });
            }
          }
        }
      }
    }
  }

  return opportunities;
}

/**
 * Optimize cross-currency execution path
 */
export function optimizeCrossCurrencyExecution(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  availableRates: Map<string, number>
): Record<string, any> {
  const allCurrencies = new Set<CurrencyCode>();
  for (const [pair] of availableRates) {
    const [base, quote] = pair.split('/');
    allCurrencies.add(base as CurrencyCode);
    allCurrencies.add(quote as CurrencyCode);
  }

  const result = optimizeCrossCurrencyPath(
    fromCurrency,
    toCurrency,
    availableRates,
    Array.from(allCurrencies)
  );

  return {
    fromCurrency,
    toCurrency,
    optimalPath: result.path,
    effectiveRate: result.rate,
    cost: result.cost,
    savings: result.savings,
  };
}

// ============================================================================
// OPTIONS TRADING FUNCTIONS
// ============================================================================

/**
 * Execute FX vanilla option trade
 */
export async function executeFXOptionTrade(
  option: FXOption,
  notional: number,
  traderId: string,
  counterparty: string,
  createdBy: string,
  transaction?: Transaction
): Promise<FXTrade> {
  const optionPrice = calculateFXVanillaOptionPrice(option);

  const settlementDate = new Date();
  settlementDate.setDate(settlementDate.getDate() + Math.floor(option.timeToExpiry * 365));

  const trade = await FXTrade.create(
    {
      pair: option.pair.symbol,
      baseCurrency: option.pair.base,
      quoteCurrency: option.pair.quote,
      direction: TradeDirection.BUY,
      positionType: PositionType.OPTION,
      notional,
      executionRate: option.strike,
      spotRate: option.spot,
      settlementDate,
      executionTime: new Date(),
      counterparty,
      traderId,
      commission: 0,
      spreadCost: 0,
      slippage: 0,
      pnl: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      isHedge: false,
      metadata: {
        optionType: option.type,
        premium: optionPrice.premium,
        strike: option.strike,
        volatility: option.volatility,
        timeToExpiry: option.timeToExpiry,
        greeks: optionPrice.greeks,
      },
      createdBy,
    },
    { transaction }
  );

  return trade;
}

/**
 * Calculate option position Greeks
 * Updates position with current Greeks for risk management
 */
export async function updateOptionPositionGreeks(
  positionId: string,
  option: FXOption,
  updatedBy: string,
  transaction?: Transaction
): Promise<FXPosition | null> {
  const position = await FXPosition.findByPk(positionId, { transaction });
  if (!position) return null;

  const delta = calculateFXOptionDelta(option);
  const gamma = calculateFXOptionGamma(option);
  const vega = calculateFXOptionVega(option);
  const theta = calculateFXOptionTheta(option);

  await position.update(
    {
      delta,
      gamma,
      vega,
      theta,
      currentRate: option.spot,
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * Calculate option implied volatility from market price
 */
export function calculateOptionImpliedVol(
  option: FXOption,
  marketPremium: number,
  tolerance: number = 0.0001,
  maxIterations: number = 100
): Record<string, any> {
  const impliedVol = calculateFXOptionImpliedVolatility(option, marketPremium, tolerance, maxIterations);

  return {
    marketPremium,
    impliedVolatility: impliedVol,
    strike: option.strike,
    spot: option.spot,
    timeToExpiry: option.timeToExpiry,
    moneyness: option.strike / option.spot,
  };
}

// ============================================================================
// VOLATILITY SURFACE FUNCTIONS
// ============================================================================

/**
 * Build FX volatility surface from market data
 */
export function buildVolatilitySurface(
  pair: CurrencyPair,
  marketPoints: VolatilitySurfacePoint[]
): VolatilitySurface {
  return constructFXVolatilitySurface(pair, marketPoints);
}

/**
 * Interpolate volatility for specific strike and tenor
 */
export function interpolateVolatility(
  surface: VolatilitySurface,
  strike: number,
  tenor: number
): number {
  return interpolateFXVolatilitySurface(surface, strike, tenor);
}

/**
 * Calculate volatility smile metrics
 */
export function analyzeVolatilitySmile(
  surface: VolatilitySurface,
  tenor: number
): Record<string, any> {
  const smileData = calculateFXVolatilitySmile(surface, tenor);
  const atmVol = calculateFXATMVolatility(surface, tenor);

  return {
    tenor,
    atmVolatility: atmVol,
    smileData,
    skew: smileData.length > 0 ? smileData[smileData.length - 1].volatility - smileData[0].volatility : 0,
  };
}

/**
 * Calculate risk reversal and butterfly spreads
 */
export function calculateVolatilityMetrics(
  surface: VolatilitySurface,
  tenor: number,
  delta: number = 0.25
): Record<string, any> {
  const metrics = calculateFXRiskReversalButterfly(surface, tenor, delta);

  return {
    tenor,
    delta,
    atmVolatility: metrics.atmVolatility,
    riskReversal: metrics.riskReversal,
    butterfly: metrics.butterfly,
    callVolatility: metrics.callVolatility,
    putVolatility: metrics.putVolatility,
  };
}

// ============================================================================
// HEDGING FUNCTIONS
// ============================================================================

/**
 * Create delta hedge for FX option position
 */
export async function createDeltaHedge(
  positionId: string,
  option: FXOption,
  spotQuote: FXSpotQuote,
  createdBy: string,
  transaction?: Transaction
): Promise<FXHedge> {
  const position = await FXPosition.findByPk(positionId, { transaction });
  if (!position) {
    throw new Error('Position not found');
  }

  const hedgeResult = calculateDeltaHedge(option, position.notional);

  const nextRebalance = new Date();
  nextRebalance.setDate(nextRebalance.getDate() + 1); // Daily rebalance

  const hedge = await FXHedge.create(
    {
      positionId,
      strategy: HedgeStrategy.DELTA_NEUTRAL,
      hedgePair: spotQuote.pair.symbol,
      hedgeNotional: Math.abs(hedgeResult.notional),
      hedgeRate: spotQuote.mid,
      hedgeRatio: hedgeResult.ratio,
      effectiveness: 1.0,
      residualRisk: 0,
      delta: hedgeResult.ratio,
      isActive: true,
      rebalanceFrequency: 1,
      nextRebalance,
      metadata: {
        spotRate: option.spot,
        optionDelta: calculateFXOptionDelta(option),
      },
      createdBy,
    },
    { transaction }
  );

  return hedge;
}

/**
 * Calculate optimal hedge ratio using regression
 */
export function calculateOptimalHedge(
  exposureReturns: number[],
  hedgeReturns: number[]
): Record<string, any> {
  const optimalRatio = calculateOptimalHedgeRatio(exposureReturns, hedgeReturns);
  const effectiveness = calculateHedgeEffectiveness(exposureReturns, hedgeReturns, optimalRatio);

  return {
    optimalRatio,
    effectiveness,
    residualRisk: 1 - effectiveness,
    rSquared: effectiveness,
  };
}

/**
 * Rebalance delta hedge based on market moves
 */
export async function rebalanceDeltaHedgePosition(
  hedgeId: string,
  currentOption: FXOption,
  currentSpotRate: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<FXHedge | null> {
  const hedge = await FXHedge.findByPk(hedgeId, { transaction });
  if (!hedge) return null;

  const position = await FXPosition.findByPk(hedge.positionId, { transaction });
  if (!position) return null;

  const rebalanceResult = rebalanceDeltaHedge(
    currentOption,
    position.notional,
    hedge.hedgeNotional,
    0.1 // 10% delta threshold
  );

  if (rebalanceResult.requiresRebalance) {
    const nextRebalance = new Date();
    nextRebalance.setDate(nextRebalance.getDate() + hedge.rebalanceFrequency);

    await hedge.update(
      {
        hedgeNotional: rebalanceResult.newHedgeNotional,
        hedgeRate: currentSpotRate,
        hedgeRatio: rebalanceResult.newDelta,
        delta: rebalanceResult.newDelta,
        lastRebalance: new Date(),
        nextRebalance,
        metadata: {
          ...hedge.metadata,
          adjustment: rebalanceResult.adjustment,
          previousDelta: rebalanceResult.currentDelta,
        },
        updatedBy,
      },
      { transaction }
    );
  }

  return hedge;
}

/**
 * Calculate portfolio-level hedge
 */
export function calculatePortfolioHedgeStrategy(
  positions: Array<{ pair: CurrencyPair; notional: number; delta: number }>,
  hedgePair: CurrencyPair
): Record<string, any> {
  const totalExposure = positions.reduce((sum, pos) => sum + pos.notional * pos.delta, 0);
  const netDelta = positions.reduce((sum, pos) => sum + pos.delta, 0);

  return {
    totalExposure,
    netDelta,
    hedgePair: hedgePair.symbol,
    requiredHedgeNotional: Math.abs(totalExposure),
    positions: positions.length,
  };
}

// ============================================================================
// CURRENCY BASKET FUNCTIONS
// ============================================================================

/**
 * Create currency basket position
 */
export function createCurrencyBasketPosition(
  name: string,
  components: Array<{ currency: CurrencyCode; weight: number }>,
  baseCurrency: CurrencyCode,
  rebalanceFrequency: number
): CurrencyBasket {
  return constructCurrencyBasket(name, components, baseCurrency, rebalanceFrequency);
}

/**
 * Rebalance currency basket to target weights
 */
export function rebalanceBasketToTargetWeights(
  basket: CurrencyBasket,
  currentValues: Map<CurrencyCode, number>,
  totalValue: number
): Record<string, any> {
  const rebalanceResult = rebalanceCurrencyBasket(basket, currentValues, totalValue);

  return {
    basket: basket.name,
    totalValue,
    trades: rebalanceResult.trades,
    turnover: rebalanceResult.turnover,
    cost: rebalanceResult.cost,
  };
}

/**
 * Calculate basket performance attribution
 */
export function analyzeBasketPerformance(
  basket: CurrencyBasket,
  returns: Map<CurrencyCode, number>
): Record<string, any> {
  const attribution = calculateBasketPerformanceAttribution(basket, returns);

  return {
    basket: basket.name,
    totalReturn: attribution.totalReturn,
    componentReturns: attribution.componentReturns,
    contributions: attribution.contributions,
  };
}

/**
 * Calculate basket volatility and risk metrics
 */
export function calculateBasketRiskMetrics(
  basket: CurrencyBasket,
  correlationMatrix: number[][],
  volatilities: number[]
): Record<string, any> {
  const basketVol = calculateBasketVolatility(basket, correlationMatrix, volatilities);

  return {
    basket: basket.name,
    volatility: basketVol,
    annualizedVolatility: basketVol * Math.sqrt(252),
    components: basket.components.length,
  };
}

// ============================================================================
// CARRY TRADE FUNCTIONS
// ============================================================================

/**
 * Analyze carry trade opportunity
 */
export function analyzeCarryTradeOpportunity(
  fundingCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
  fundingRate: number,
  targetRate: number,
  spotRate: number,
  leverage: number = 1
): Record<string, any> {
  const carryReturn = calculateFXCarryReturn(fundingRate, targetRate, leverage);
  const fundingCost = calculateFXFundingCost(fundingRate, leverage);

  return {
    fundingCurrency,
    targetCurrency,
    spotRate,
    fundingRate,
    targetRate,
    rateDifferential: targetRate - fundingRate,
    leverage,
    carryReturn,
    fundingCost,
    netReturn: carryReturn - fundingCost,
    isPositiveCarry: carryReturn > fundingCost,
  };
}

/**
 * Rank currency pairs by carry trade attractiveness
 */
export function rankCarryTradeOpportunities(
  carryTrades: CarryTrade[]
): Array<{ trade: CarryTrade; score: number; rank: number }> {
  return rankCurrencyCarry(carryTrades);
}

/**
 * Calculate FX roll yield
 */
export function calculateFXRollYieldMetrics(
  spotRate: number,
  forwardRate: number,
  timeToSettlement: number
): Record<string, any> {
  const rollYield = calculateFXRollYield(spotRate, forwardRate, timeToSettlement);
  const annualizedYield = (rollYield / timeToSettlement) * 365;

  return {
    spotRate,
    forwardRate,
    timeToSettlement,
    rollYield,
    annualizedYield,
    isPositiveYield: rollYield > 0,
  };
}

// ============================================================================
// CORRELATION AND RISK FUNCTIONS
// ============================================================================

/**
 * Calculate currency correlation matrix
 */
export function buildCurrencyCorrelationMatrix(
  pairs: CurrencyPair[],
  returns: Map<string, number[]>,
  period: number
): Record<string, any> {
  const matrix = calculateCurrencyCorrelationMatrix(pairs, returns);

  return {
    pairs: pairs.map(p => p.symbol),
    correlationMatrix: matrix,
    period,
    timestamp: new Date(),
  };
}

/**
 * Calculate rolling correlation
 */
export function calculateRollingCorrelation(
  pair1Returns: number[],
  pair2Returns: number[],
  windowSize: number
): number[] {
  return calculateRollingCurrencyCorrelation(pair1Returns, pair2Returns, windowSize);
}

/**
 * Detect correlation regime changes
 */
export function detectCorrelationBreaks(
  correlations: number[],
  threshold: number = 0.3
): Array<{ index: number; oldCorrelation: number; newCorrelation: number }> {
  return detectCorrelationRegimeChange(correlations, threshold);
}

/**
 * Calculate currency beta
 */
export function calculateCurrencyBetaMetrics(
  currencyReturns: number[],
  benchmarkReturns: number[]
): Record<string, any> {
  const beta = calculateCurrencyBeta(currencyReturns, benchmarkReturns);

  return {
    beta,
    correlation: beta > 0 ? 'positive' : 'negative',
    volatilityRatio: Math.abs(beta),
  };
}

// ============================================================================
// RATE AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregate FX rates from multiple sources
 */
export function aggregateMultiSourceRates(
  sources: RateSource[]
): FXSpotQuote {
  return aggregateFXRatesMultiSource(sources);
}

/**
 * Calculate volume-weighted average rate
 */
export function calculateVWAPRate(
  quotes: FXSpotQuote[],
  volumes: number[]
): number {
  return calculateFXRateVWAP(quotes, volumes);
}

/**
 * Calculate time-weighted average rate
 */
export function calculateTWAPRate(
  quotes: FXSpotQuote[],
  startTime: Date,
  endTime: Date
): number {
  return calculateFXRateTWAP(quotes, startTime, endTime);
}

// ============================================================================
// ADVANCED ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive position risk metrics
 */
export async function calculatePositionRiskMetrics(
  positionId: string,
  transaction?: Transaction
): Promise<Record<string, any> | null> {
  const position = await FXPosition.findByPk(positionId, { transaction });
  if (!position) return null;

  return {
    positionId: position.id,
    pair: position.pair,
    notional: position.notional,
    unrealizedPnl: position.unrealizedPnl,
    delta: position.delta,
    gamma: position.gamma,
    vega: position.vega,
    theta: position.theta,
    exposure: position.exposure,
    marginUsed: position.marginUsed,
    leverage: position.leverage,
    isHedged: position.isHedged,
    hedgeRatio: position.hedgeRatio,
  };
}

/**
 * Export: Initialize all FX trading models
 */
export function initializeFXTradingModels(sequelize: Sequelize): void {
  FXTrade.initModel(sequelize);
  FXOrder.initModel(sequelize);
  FXPosition.initModel(sequelize);
  FXHedge.initModel(sequelize);
  defineFXTradingAssociations();
}

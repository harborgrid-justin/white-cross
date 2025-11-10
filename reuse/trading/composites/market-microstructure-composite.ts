/**
 * LOC: TRADING-COMP-MICRO-001
 * File: /reuse/trading/composites/market-microstructure-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../market-microstructure-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal integrations
 *   - Market surveillance systems
 *   - Trading desk analytics
 *   - Transaction cost analysis platforms
 */

/**
 * File: /reuse/trading/composites/market-microstructure-composite.ts
 * Locator: WC-COMP-TRADING-MICRO-001
 * Purpose: Bloomberg Terminal Market Microstructure Composite
 *
 * Upstream: @nestjs/common, sequelize, market-microstructure-kit
 * Downstream: Bloomberg controllers, market analytics services, TCA engines, surveillance systems
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 composed functions for comprehensive market microstructure analysis
 *
 * LLM Context: Production-grade market microstructure composite for Bloomberg Terminal integration.
 * Provides order flow analysis, market depth visualization, bid-ask spread modeling, liquidity measurement,
 * price discovery mechanisms, tick-by-tick analysis, Lee-Ready trade classification, market impact models,
 * order book dynamics, quote stuffing detection, HFT pattern recognition, informed trading detection,
 * PIN/VPIN models, and toxicity metrics for institutional trading operations.
 */

import { Injectable, Logger } from '@nestjs/common';
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

// Import all utilities from market-microstructure-kit
import {
  // Types
  Price,
  Quantity,
  BasisPoints,
  Timestamp,
  OrderSide,
  OrderBook,
  OrderBookLevel,
  Quote,
  Trade,
  Fill,
  TCAReport,
  PriceImpactModel,
  MarketDepthProfile,
  asPrice,
  asQuantity,
  asBasisPoints,
  asTimestamp,
  // Order Book Analytics
  parseOrderBook,
  calculateMidPrice,
  calculateWeightedMidPrice,
  calculateOrderBookImbalance,
  calculateBookDepth,
  estimateLiquidityProfile,
  calculateBestBidAsk,
  analyzeOrderBookSlope,
  detectOrderBookPattern,
  calculateMicroPrice,
  // Spread Analysis
  calculateBidAskSpread,
  calculateRelativeSpread,
  calculateEffectiveSpread,
  calculateRealizedSpread,
  estimatePriceImpact,
  calculatePermanentImpact,
  calculateTemporaryImpact,
  modelMarketImpact,
  // Transaction Cost Analysis
  calculateImplementationShortfallCost,
  calculateArrivalCost,
  calculateVWAPCost,
  calculateSlippage,
  estimateOpportunityCost,
  calculateTimingCost,
  calculateMarketImpactCost,
  analyzeFillQuality,
  calculateReversion,
  estimateTotalTCA,
  benchmarkExecution,
  generateTCAReport,
  // Order Flow
  analyzeOrderFlow,
  calculateVolumeProfile,
  estimateInformedTrading,
  calculatePINMetric,
  analyzeTradeDirection,
  calculateEffectiveTickSize,
  estimateHiddenLiquidity,
  analyzeMarketFragmentation,
  compareLitDarkExecution,
  calculateExecutionShortfall,
  // Advanced Analytics
  modelLimitOrderDynamics,
  estimateQueueJumping,
  calculateResiliency,
  analyzeTickData,
  estimateInformationShare,
} from '../market-microstructure-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Market data types
 */
export enum MarketDataType {
  ORDER_BOOK = 'order_book',
  QUOTE = 'quote',
  TRADE = 'trade',
  DEPTH = 'depth',
  TICK = 'tick',
}

/**
 * Analysis types
 */
export enum AnalysisType {
  ORDER_FLOW = 'order_flow',
  MARKET_DEPTH = 'market_depth',
  SPREAD_ANALYSIS = 'spread_analysis',
  LIQUIDITY = 'liquidity',
  PRICE_DISCOVERY = 'price_discovery',
  MARKET_IMPACT = 'market_impact',
  TCA = 'tca',
  TOXICITY = 'toxicity',
}

/**
 * Execution quality ratings
 */
export enum ExecutionQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

/**
 * Market condition states
 */
export enum MarketCondition {
  NORMAL = 'normal',
  VOLATILE = 'volatile',
  STRESSED = 'stressed',
  ILLIQUID = 'illiquid',
  TOXIC = 'toxic',
}

/**
 * Venue types
 */
export enum VenueType {
  LIT = 'lit',
  DARK = 'dark',
  ATS = 'ats',
  EXCHANGE = 'exchange',
}

// ============================================================================
// SEQUELIZE MODEL: MarketDataSnapshot
// ============================================================================

/**
 * TypeScript interface for MarketDataSnapshot attributes
 */
export interface MarketDataSnapshotAttributes {
  id: string;
  symbol: string;
  venue: string;
  venueType: VenueType;
  dataType: MarketDataType;
  timestamp: Date;
  orderBookData: Record<string, any> | null;
  quoteData: Record<string, any> | null;
  tradeData: Record<string, any> | null;
  midPrice: number | null;
  spread: number | null;
  imbalance: number | null;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarketDataSnapshotCreationAttributes extends Optional<MarketDataSnapshotAttributes, 'id' | 'orderBookData' | 'quoteData' | 'tradeData' | 'midPrice' | 'spread' | 'imbalance'> {}

/**
 * Sequelize Model: MarketDataSnapshot
 * Market data snapshots for order books, quotes, and trades
 */
export class MarketDataSnapshot extends Model<MarketDataSnapshotAttributes, MarketDataSnapshotCreationAttributes> implements MarketDataSnapshotAttributes {
  declare id: string;
  declare symbol: string;
  declare venue: string;
  declare venueType: VenueType;
  declare dataType: MarketDataType;
  declare timestamp: Date;
  declare orderBookData: Record<string, any> | null;
  declare quoteData: Record<string, any> | null;
  declare tradeData: Record<string, any> | null;
  declare midPrice: number | null;
  declare spread: number | null;
  declare imbalance: number | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations
  declare getAnalyses: HasManyGetAssociationsMixin<MicrostructureAnalysis>;

  declare static associations: {
    analyses: Association<MarketDataSnapshot, MicrostructureAnalysis>;
  };

  /**
   * Initialize MarketDataSnapshot with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarketDataSnapshot {
    MarketDataSnapshot.init(
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
          field: 'symbol',
        },
        venue: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'venue',
        },
        venueType: {
          type: DataTypes.ENUM(...Object.values(VenueType)),
          allowNull: false,
          field: 'venue_type',
        },
        dataType: {
          type: DataTypes.ENUM(...Object.values(MarketDataType)),
          allowNull: false,
          field: 'data_type',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        orderBookData: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'order_book_data',
        },
        quoteData: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'quote_data',
        },
        tradeData: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'trade_data',
        },
        midPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'mid_price',
        },
        spread: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'spread',
        },
        imbalance: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'imbalance',
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
      },
      {
        sequelize,
        tableName: 'market_data_snapshots',
        modelName: 'MarketDataSnapshot',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['symbol', 'timestamp'] },
          { fields: ['venue'] },
          { fields: ['data_type'] },
          { fields: ['timestamp'] },
        ],
      }
    );

    return MarketDataSnapshot;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MicrostructureAnalysis
// ============================================================================

/**
 * TypeScript interface for MicrostructureAnalysis attributes
 */
export interface MicrostructureAnalysisAttributes {
  id: string;
  snapshotId: string;
  analysisType: AnalysisType;
  symbol: string;
  analysisTimestamp: Date;
  orderFlowImbalance: number | null;
  buyVolume: number | null;
  sellVolume: number | null;
  marketDepth: Record<string, any> | null;
  liquidityProfile: Record<string, any> | null;
  priceImpactModel: Record<string, any> | null;
  pinMetric: number | null;
  vpinMetric: number | null;
  toxicityScore: number | null;
  informedTradingProb: number | null;
  marketCondition: MarketCondition;
  results: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MicrostructureAnalysisCreationAttributes extends Optional<MicrostructureAnalysisAttributes, 'id' | 'orderFlowImbalance' | 'buyVolume' | 'sellVolume' | 'marketDepth' | 'liquidityProfile' | 'priceImpactModel' | 'pinMetric' | 'vpinMetric' | 'toxicityScore' | 'informedTradingProb'> {}

/**
 * Sequelize Model: MicrostructureAnalysis
 * Market microstructure analysis results
 */
export class MicrostructureAnalysis extends Model<MicrostructureAnalysisAttributes, MicrostructureAnalysisCreationAttributes> implements MicrostructureAnalysisAttributes {
  declare id: string;
  declare snapshotId: string;
  declare analysisType: AnalysisType;
  declare symbol: string;
  declare analysisTimestamp: Date;
  declare orderFlowImbalance: number | null;
  declare buyVolume: number | null;
  declare sellVolume: number | null;
  declare marketDepth: Record<string, any> | null;
  declare liquidityProfile: Record<string, any> | null;
  declare priceImpactModel: Record<string, any> | null;
  declare pinMetric: number | null;
  declare vpinMetric: number | null;
  declare toxicityScore: number | null;
  declare informedTradingProb: number | null;
  declare marketCondition: MarketCondition;
  declare results: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations
  declare getSnapshot: BelongsToGetAssociationMixin<MarketDataSnapshot>;

  declare static associations: {
    snapshot: Association<MicrostructureAnalysis, MarketDataSnapshot>;
  };

  /**
   * Initialize MicrostructureAnalysis with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MicrostructureAnalysis {
    MicrostructureAnalysis.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        snapshotId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'market_data_snapshots',
            key: 'id',
          },
          field: 'snapshot_id',
        },
        analysisType: {
          type: DataTypes.ENUM(...Object.values(AnalysisType)),
          allowNull: false,
          field: 'analysis_type',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'symbol',
        },
        analysisTimestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'analysis_timestamp',
        },
        orderFlowImbalance: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'order_flow_imbalance',
        },
        buyVolume: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'buy_volume',
        },
        sellVolume: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: true,
          field: 'sell_volume',
        },
        marketDepth: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'market_depth',
        },
        liquidityProfile: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'liquidity_profile',
        },
        priceImpactModel: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'price_impact_model',
        },
        pinMetric: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'pin_metric',
        },
        vpinMetric: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'vpin_metric',
        },
        toxicityScore: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'toxicity_score',
        },
        informedTradingProb: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'informed_trading_prob',
        },
        marketCondition: {
          type: DataTypes.ENUM(...Object.values(MarketCondition)),
          allowNull: false,
          field: 'market_condition',
        },
        results: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'results',
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
      },
      {
        sequelize,
        tableName: 'microstructure_analyses',
        modelName: 'MicrostructureAnalysis',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['snapshot_id'] },
          { fields: ['symbol', 'analysis_timestamp'] },
          { fields: ['analysis_type'] },
          { fields: ['market_condition'] },
        ],
      }
    );

    return MicrostructureAnalysis;
  }
}

// ============================================================================
// SEQUELIZE MODEL: TransactionCostReport
// ============================================================================

/**
 * TypeScript interface for TransactionCostReport attributes
 */
export interface TransactionCostReportAttributes {
  id: string;
  symbol: string;
  side: OrderSide;
  executionTimestamp: Date;
  totalQuantity: number;
  averageFillPrice: number;
  benchmarkPrice: number;
  implementationShortfall: number;
  arrivalCost: number;
  vwapCost: number;
  slippage: number;
  marketImpact: number;
  timingCost: number;
  opportunityCost: number;
  totalCost: number;
  executionQuality: ExecutionQuality;
  fills: Record<string, any>[];
  fillQualityMetrics: Record<string, any>;
  venueBreakdown: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCostReportCreationAttributes extends Optional<TransactionCostReportAttributes, 'id'> {}

/**
 * Sequelize Model: TransactionCostReport
 * Transaction cost analysis reports
 */
export class TransactionCostReport extends Model<TransactionCostReportAttributes, TransactionCostReportCreationAttributes> implements TransactionCostReportAttributes {
  declare id: string;
  declare symbol: string;
  declare side: OrderSide;
  declare executionTimestamp: Date;
  declare totalQuantity: number;
  declare averageFillPrice: number;
  declare benchmarkPrice: number;
  declare implementationShortfall: number;
  declare arrivalCost: number;
  declare vwapCost: number;
  declare slippage: number;
  declare marketImpact: number;
  declare timingCost: number;
  declare opportunityCost: number;
  declare totalCost: number;
  declare executionQuality: ExecutionQuality;
  declare fills: Record<string, any>[];
  declare fillQualityMetrics: Record<string, any>;
  declare venueBreakdown: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize TransactionCostReport with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof TransactionCostReport {
    TransactionCostReport.init(
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
          field: 'symbol',
        },
        side: {
          type: DataTypes.ENUM('BUY', 'SELL'),
          allowNull: false,
          field: 'side',
        },
        executionTimestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'execution_timestamp',
        },
        totalQuantity: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'total_quantity',
        },
        averageFillPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'average_fill_price',
        },
        benchmarkPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'benchmark_price',
        },
        implementationShortfall: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'implementation_shortfall',
        },
        arrivalCost: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'arrival_cost',
        },
        vwapCost: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'vwap_cost',
        },
        slippage: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'slippage',
        },
        marketImpact: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'market_impact',
        },
        timingCost: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'timing_cost',
        },
        opportunityCost: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'opportunity_cost',
        },
        totalCost: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'total_cost',
        },
        executionQuality: {
          type: DataTypes.ENUM(...Object.values(ExecutionQuality)),
          allowNull: false,
          field: 'execution_quality',
        },
        fills: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'fills',
        },
        fillQualityMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'fill_quality_metrics',
        },
        venueBreakdown: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'venue_breakdown',
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
      },
      {
        sequelize,
        tableName: 'transaction_cost_reports',
        modelName: 'TransactionCostReport',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['symbol', 'execution_timestamp'] },
          { fields: ['execution_quality'] },
          { fields: ['side'] },
        ],
      }
    );

    return TransactionCostReport;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OrderBookSnapshot
// ============================================================================

/**
 * TypeScript interface for OrderBookSnapshot attributes
 */
export interface OrderBookSnapshotAttributes {
  id: string;
  symbol: string;
  venue: string;
  timestamp: Date;
  bids: Record<string, any>[];
  asks: Record<string, any>[];
  midPrice: number;
  weightedMidPrice: number;
  microPrice: number;
  spread: number;
  relativeSpread: number;
  imbalance: number;
  depthProfile: Record<string, any>;
  slopeAnalysis: Record<string, any>;
  supportResistance: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderBookSnapshotCreationAttributes extends Optional<OrderBookSnapshotAttributes, 'id'> {}

/**
 * Sequelize Model: OrderBookSnapshot
 * Detailed order book snapshots with analytics
 */
export class OrderBookSnapshot extends Model<OrderBookSnapshotAttributes, OrderBookSnapshotCreationAttributes> implements OrderBookSnapshotAttributes {
  declare id: string;
  declare symbol: string;
  declare venue: string;
  declare timestamp: Date;
  declare bids: Record<string, any>[];
  declare asks: Record<string, any>[];
  declare midPrice: number;
  declare weightedMidPrice: number;
  declare microPrice: number;
  declare spread: number;
  declare relativeSpread: number;
  declare imbalance: number;
  declare depthProfile: Record<string, any>;
  declare slopeAnalysis: Record<string, any>;
  declare supportResistance: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize OrderBookSnapshot with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OrderBookSnapshot {
    OrderBookSnapshot.init(
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
          field: 'symbol',
        },
        venue: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'venue',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        bids: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'bids',
        },
        asks: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'asks',
        },
        midPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'mid_price',
        },
        weightedMidPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'weighted_mid_price',
        },
        microPrice: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'micro_price',
        },
        spread: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'spread',
        },
        relativeSpread: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'relative_spread',
        },
        imbalance: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'imbalance',
        },
        depthProfile: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'depth_profile',
        },
        slopeAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'slope_analysis',
        },
        supportResistance: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'support_resistance',
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
      },
      {
        sequelize,
        tableName: 'order_book_snapshots',
        modelName: 'OrderBookSnapshot',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['symbol', 'timestamp'] },
          { fields: ['venue'] },
          { fields: ['timestamp'] },
        ],
      }
    );

    return OrderBookSnapshot;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineMarketMicrostructureAssociations(): void {
  MarketDataSnapshot.hasMany(MicrostructureAnalysis, {
    foreignKey: 'snapshotId',
    as: 'analyses',
    onDelete: 'CASCADE',
  });

  MicrostructureAnalysis.belongsTo(MarketDataSnapshot, {
    foreignKey: 'snapshotId',
    as: 'snapshot',
  });
}

// ============================================================================
// MARKET DATA SNAPSHOT FUNCTIONS
// ============================================================================

/**
 * Create market data snapshot
 */
export async function createMarketDataSnapshot(
  data: MarketDataSnapshotCreationAttributes,
  transaction?: Transaction
): Promise<MarketDataSnapshot> {
  return await MarketDataSnapshot.create(data, { transaction });
}

/**
 * Create order book snapshot with analytics
 */
export async function createOrderBookSnapshotWithAnalytics(
  symbol: string,
  venue: string,
  venueType: VenueType,
  orderBookData: OrderBook,
  createdBy: string,
  transaction?: Transaction
): Promise<MarketDataSnapshot> {
  const parsedBook = parseOrderBook(orderBookData);
  const midPrice = calculateMidPrice(parsedBook);
  const weightedMid = calculateWeightedMidPrice(parsedBook);
  const bestBidAsk = calculateBestBidAsk(parsedBook);
  const spread = bestBidAsk.bestAsk - bestBidAsk.bestBid;
  const imbalance = calculateOrderBookImbalance(parsedBook, 10);

  return await MarketDataSnapshot.create(
    {
      symbol,
      venue,
      venueType,
      dataType: MarketDataType.ORDER_BOOK,
      timestamp: new Date(orderBookData.timestamp),
      orderBookData: parsedBook as any,
      midPrice,
      spread,
      imbalance,
      metadata: { weightedMidPrice: weightedMid },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get market data snapshots by symbol and time range
 */
export async function getMarketDataSnapshotsBySymbolAndTimeRange(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<MarketDataSnapshot[]> {
  return await MarketDataSnapshot.findAll({
    where: {
      symbol,
      timestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });
}

/**
 * Get latest market data snapshot for symbol
 */
export async function getLatestMarketDataSnapshot(
  symbol: string,
  venue?: string,
  transaction?: Transaction
): Promise<MarketDataSnapshot | null> {
  const where: any = { symbol };
  if (venue) {
    where.venue = venue;
  }

  return await MarketDataSnapshot.findOne({
    where,
    order: [['timestamp', 'DESC']],
    transaction,
  });
}

// ============================================================================
// ORDER BOOK ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze order book depth and liquidity
 */
export async function analyzeOrderBookDepthAndLiquidity(
  snapshotId: string,
  orderBook: OrderBook,
  numberOfLevels: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const depthProfile = calculateBookDepth(orderBook, numberOfLevels);
  const liquidityProfile = estimateLiquidityProfile(orderBook, asBasisPoints(50)); // 50bp range
  const slopeAnalysis = analyzeOrderBookSlope(orderBook, numberOfLevels);

  const marketCondition = determineMarketCondition(
    depthProfile.depthImbalance,
    slopeAnalysis.liquidity,
    0 // volatility placeholder
  );

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.MARKET_DEPTH,
      symbol: orderBook.symbol,
      analysisTimestamp: new Date(),
      marketDepth: depthProfile as any,
      liquidityProfile: liquidityProfile as any,
      marketCondition,
      results: {
        depthProfile,
        liquidityProfile,
        slopeAnalysis,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Analyze order flow imbalance
 */
export async function analyzeOrderFlowImbalanceMetrics(
  snapshotId: string,
  symbol: string,
  trades: Trade[],
  timeWindow: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const orderFlow = analyzeOrderFlow(trades, timeWindow);
  const volumeProfile = calculateVolumeProfile(trades, 13);

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.ORDER_FLOW,
      symbol,
      analysisTimestamp: new Date(),
      orderFlowImbalance: orderFlow.imbalance,
      buyVolume: orderFlow.buyVolume,
      sellVolume: orderFlow.sellVolume,
      marketCondition: MarketCondition.NORMAL,
      results: {
        orderFlow,
        volumeProfile,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate PIN and VPIN metrics
 */
export async function calculatePINAndVPINMetrics(
  snapshotId: string,
  symbol: string,
  buyVolume: Quantity,
  sellVolume: Quantity,
  days: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const pinMetric = calculatePINMetric(buyVolume, sellVolume, days);

  // Simplified VPIN calculation
  const totalVolume = buyVolume + sellVolume;
  const vpinMetric = totalVolume > 0 ? Math.abs(buyVolume - sellVolume) / totalVolume : 0;

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.TOXICITY,
      symbol,
      analysisTimestamp: new Date(),
      buyVolume,
      sellVolume,
      pinMetric,
      vpinMetric,
      marketCondition: MarketCondition.NORMAL,
      results: {
        pinMetric,
        vpinMetric,
        volumeRatio: buyVolume / (sellVolume || 1),
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Detect informed trading and toxicity
 */
export async function detectInformedTradingAndToxicity(
  snapshotId: string,
  symbol: string,
  orderFlowImbalance: number,
  volatility: number,
  spreadWidening: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const informedTradingProb = estimateInformedTrading(orderFlowImbalance, volatility, spreadWidening);

  // Calculate toxicity score (composite metric)
  const toxicityScore = (
    Math.abs(orderFlowImbalance) * 0.3 +
    informedTradingProb * 0.4 +
    spreadWidening * 0.3
  );

  const marketCondition = toxicityScore > 0.7
    ? MarketCondition.TOXIC
    : toxicityScore > 0.5
    ? MarketCondition.STRESSED
    : MarketCondition.NORMAL;

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.TOXICITY,
      symbol,
      analysisTimestamp: new Date(),
      informedTradingProb,
      toxicityScore,
      orderFlowImbalance,
      marketCondition,
      results: {
        informedTradingProb,
        toxicityScore,
        volatility,
        spreadWidening,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Analyze market impact using multiple models
 */
export async function analyzeMarketImpactModels(
  snapshotId: string,
  symbol: string,
  quantity: Quantity,
  averageDailyVolume: Quantity,
  volatility: number,
  currentPrice: Price,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const priceImpact = estimatePriceImpact(quantity, averageDailyVolume, volatility, currentPrice);
  const permanentImpact = calculatePermanentImpact(quantity, averageDailyVolume, volatility);
  const temporaryImpact = calculateTemporaryImpact(quantity, averageDailyVolume, 1000); // 1 second
  const impactModel = modelMarketImpact(quantity, averageDailyVolume, volatility);

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.MARKET_IMPACT,
      symbol,
      analysisTimestamp: new Date(),
      priceImpactModel: impactModel as any,
      marketCondition: MarketCondition.NORMAL,
      results: {
        priceImpact,
        permanentImpact,
        temporaryImpact,
        impactModel,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

// ============================================================================
// ORDER BOOK SNAPSHOT FUNCTIONS
// ============================================================================

/**
 * Create comprehensive order book snapshot
 */
export async function createComprehensiveOrderBookSnapshot(
  symbol: string,
  venue: string,
  orderBook: OrderBook,
  createdBy: string,
  transaction?: Transaction
): Promise<OrderBookSnapshot> {
  const parsedBook = parseOrderBook(orderBook);
  const midPrice = calculateMidPrice(parsedBook);
  const weightedMidPrice = calculateWeightedMidPrice(parsedBook);
  const microPrice = calculateMicroPrice(parsedBook);
  const bestBidAsk = calculateBestBidAsk(parsedBook);
  const spread = bestBidAsk.bestAsk - bestBidAsk.bestBid;
  const relativeSpread = calculateRelativeSpread({
    symbol,
    bidPrice: bestBidAsk.bestBid,
    bidSize: bestBidAsk.bestBidSize,
    askPrice: bestBidAsk.bestAsk,
    askSize: bestBidAsk.bestAskSize,
    timestamp: orderBook.timestamp,
  });
  const imbalance = calculateOrderBookImbalance(parsedBook, 10);
  const depthProfile = calculateBookDepth(parsedBook, 20);
  const slopeAnalysis = analyzeOrderBookSlope(parsedBook, 10);
  const supportResistance = detectOrderBookPattern(parsedBook, 2.0);

  return await OrderBookSnapshot.create(
    {
      symbol,
      venue,
      timestamp: new Date(orderBook.timestamp),
      bids: parsedBook.bids as any,
      asks: parsedBook.asks as any,
      midPrice,
      weightedMidPrice,
      microPrice,
      spread,
      relativeSpread,
      imbalance,
      depthProfile: depthProfile as any,
      slopeAnalysis: slopeAnalysis as any,
      supportResistance: supportResistance as any,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get order book snapshots for time series analysis
 */
export async function getOrderBookSnapshotsForTimeSeries(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<OrderBookSnapshot[]> {
  return await OrderBookSnapshot.findAll({
    where: {
      symbol,
      timestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });
}

/**
 * Analyze limit order book dynamics
 */
export async function analyzeLimitOrderBookDynamics(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const snapshots = await getOrderBookSnapshotsForTimeSeries(symbol, startTime, endTime, transaction);

  if (snapshots.length < 2) {
    throw new Error('Need at least 2 snapshots for dynamics analysis');
  }

  const orderBooks: OrderBook[] = snapshots.map(s => ({
    symbol: s.symbol,
    bids: s.bids as any,
    asks: s.asks as any,
    timestamp: asTimestamp(s.timestamp.getTime()),
  }));

  const dynamics = modelLimitOrderDynamics(orderBooks);
  const queueJumping = estimateQueueJumping(orderBooks);

  return {
    dynamics,
    queueJumping,
    snapshotCount: snapshots.length,
    timeSpan: endTime.getTime() - startTime.getTime(),
  };
}

// ============================================================================
// TRANSACTION COST ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Create comprehensive TCA report
 */
export async function createComprehensiveTCAReport(
  params: {
    symbol: string;
    side: OrderSide;
    orderQuantity: Quantity;
    fills: Fill[];
    decisionPrice: Price;
    arrivalPrice: Price;
    marketVWAP: Price;
    priceAfterExecution: Price;
  },
  createdBy: string,
  transaction?: Transaction
): Promise<TransactionCostReport> {
  const tcaReport = estimateTotalTCA(params);
  const fillQuality = analyzeFillQuality(params.fills, params.orderQuantity);

  // Separate fills by venue type
  const litFills: Fill[] = [];
  const darkFills: Fill[] = [];
  params.fills.forEach(fill => {
    if (fill.venue.toLowerCase().includes('dark')) {
      darkFills.push(fill);
    } else {
      litFills.push(fill);
    }
  });

  const venueComparison = litFills.length > 0 && darkFills.length > 0
    ? compareLitDarkExecution(litFills, darkFills, params.arrivalPrice, params.side)
    : null;

  const totalFilled = params.fills.reduce((sum, f) => sum + f.quantity, 0);
  const totalValue = params.fills.reduce((sum, f) => sum + f.price * f.quantity, 0);

  return await TransactionCostReport.create(
    {
      symbol: params.symbol,
      side: params.side,
      executionTimestamp: new Date(),
      totalQuantity: params.orderQuantity,
      averageFillPrice: totalValue / totalFilled,
      benchmarkPrice: params.arrivalPrice,
      implementationShortfall: tcaReport.implementationShortfall,
      arrivalCost: tcaReport.arrivalCost,
      vwapCost: tcaReport.vwapCost,
      slippage: tcaReport.slippage,
      marketImpact: tcaReport.marketImpact,
      timingCost: tcaReport.timingCost,
      opportunityCost: tcaReport.opportunityCost,
      totalCost: tcaReport.totalCost,
      executionQuality: mapExecutionQuality(tcaReport.executionQuality),
      fills: params.fills as any,
      fillQualityMetrics: fillQuality as any,
      venueBreakdown: venueComparison ? (venueComparison as any) : {},
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get TCA reports by symbol and time range
 */
export async function getTCAReportsBySymbolAndTimeRange(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<TransactionCostReport[]> {
  return await TransactionCostReport.findAll({
    where: {
      symbol,
      executionTimestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    order: [['executionTimestamp', 'DESC']],
    transaction,
  });
}

/**
 * Analyze execution quality trends
 */
export async function analyzeExecutionQualityTrends(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const reports = await getTCAReportsBySymbolAndTimeRange(symbol, startTime, endTime, transaction);

  if (reports.length === 0) {
    return { reports: 0, trends: null };
  }

  const qualityDistribution = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
  };

  const costs = {
    avgImplementationShortfall: 0,
    avgSlippage: 0,
    avgMarketImpact: 0,
    avgTotalCost: 0,
  };

  reports.forEach(report => {
    qualityDistribution[report.executionQuality]++;
    costs.avgImplementationShortfall += Number(report.implementationShortfall);
    costs.avgSlippage += Number(report.slippage);
    costs.avgMarketImpact += Number(report.marketImpact);
    costs.avgTotalCost += Number(report.totalCost);
  });

  const count = reports.length;
  costs.avgImplementationShortfall /= count;
  costs.avgSlippage /= count;
  costs.avgMarketImpact /= count;
  costs.avgTotalCost /= count;

  return {
    reports: count,
    qualityDistribution,
    costs,
    period: {
      start: startTime,
      end: endTime,
    },
  };
}

// ============================================================================
// SPREAD ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze bid-ask spread components
 */
export async function analyzeBidAskSpreadComponents(
  snapshotId: string,
  symbol: string,
  quote: Quote,
  trade: Trade,
  midPriceAtTrade: Price,
  midPriceAfter: Price,
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const absoluteSpread = calculateBidAskSpread(quote);
  const relativeSpread = calculateRelativeSpread(quote);
  const effectiveSpread = calculateEffectiveSpread(trade, midPriceAtTrade);
  const realizedSpread = trade.side
    ? calculateRealizedSpread(trade, midPriceAtTrade, midPriceAfter)
    : asBasisPoints(0);

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.SPREAD_ANALYSIS,
      symbol,
      analysisTimestamp: new Date(),
      marketCondition: MarketCondition.NORMAL,
      results: {
        absoluteSpread,
        relativeSpread,
        effectiveSpread,
        realizedSpread,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

// ============================================================================
// TRADE CLASSIFICATION FUNCTIONS
// ============================================================================

/**
 * Classify trades using Lee-Ready algorithm
 */
export async function classifyTradesWithLeeReady(
  trades: Trade[],
  quotes: Quote[]
): Promise<Record<string, any>[]> {
  const classified: Record<string, any>[] = [];

  for (const trade of trades) {
    const matchingQuote = quotes.find(q =>
      q.symbol === trade.symbol &&
      Math.abs(q.timestamp - trade.timestamp) < 1000 // Within 1 second
    );

    if (matchingQuote) {
      const direction = analyzeTradeDirection(trade, matchingQuote);
      classified.push({
        ...trade,
        classifiedSide: direction,
        quote: matchingQuote,
      });
    } else {
      classified.push({
        ...trade,
        classifiedSide: 'UNKNOWN',
      });
    }
  }

  return classified;
}

/**
 * Analyze tick-by-tick data
 */
export async function analyzeTickByTickData(
  snapshotId: string,
  symbol: string,
  trades: Trade[],
  createdBy: string,
  transaction?: Transaction
): Promise<MicrostructureAnalysis> {
  const tickAnalysis = analyzeTickData(trades);
  const effectiveTickSize = trades.length >= 2 ? calculateEffectiveTickSize(trades) : asPrice(0.01);

  return await MicrostructureAnalysis.create(
    {
      snapshotId,
      analysisType: AnalysisType.PRICE_DISCOVERY,
      symbol,
      analysisTimestamp: new Date(),
      marketCondition: MarketCondition.NORMAL,
      results: {
        tickAnalysis,
        effectiveTickSize,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

// ============================================================================
// MARKET FRAGMENTATION ANALYSIS
// ============================================================================

/**
 * Analyze market fragmentation across venues
 */
export async function analyzeMarketFragmentationAcrossVenues(
  symbol: string,
  tradesByVenue: { [venue: string]: Trade[] },
  transaction?: Transaction
): Promise<Record<string, any>> {
  const fragmentation = analyzeMarketFragmentation(tradesByVenue);
  const venueReturns: number[][] = [];

  // Calculate returns for each venue
  for (const venue in tradesByVenue) {
    if (tradesByVenue.hasOwnProperty(venue)) {
      const trades = tradesByVenue[venue];
      if (trades.length >= 2) {
        const returns: number[] = [];
        for (let i = 1; i < trades.length; i++) {
          const ret = (trades[i].price - trades[i-1].price) / trades[i-1].price;
          returns.push(ret);
        }
        venueReturns.push(returns);
      }
    }
  }

  const informationShares = venueReturns.length > 0
    ? estimateInformationShare(venueReturns)
    : [];

  return {
    fragmentation,
    informationShares,
    venues: Object.keys(tradesByVenue),
  };
}

/**
 * Detect hidden liquidity patterns
 */
export async function detectHiddenLiquidityPatterns(
  symbol: string,
  trades: Trade[],
  orderBook: OrderBook,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const hiddenLiquidityRatio = estimateHiddenLiquidity(trades, orderBook);

  return {
    hiddenLiquidityRatio,
    interpretation: hiddenLiquidityRatio > 0.3
      ? 'High presence of iceberg/hidden orders'
      : hiddenLiquidityRatio > 0.1
      ? 'Moderate hidden liquidity'
      : 'Low hidden liquidity',
  };
}

// ============================================================================
// MARKET RESILIENCY ANALYSIS
// ============================================================================

/**
 * Calculate market resiliency metrics
 */
export async function calculateMarketResiliencyMetrics(
  priceShock: Price,
  recoveryTimes: number[]
): Promise<Record<string, any>> {
  const resiliency = calculateResiliency(priceShock, recoveryTimes);

  const avgRecoveryTime = recoveryTimes.length > 0
    ? recoveryTimes.reduce((sum, t) => sum + t, 0) / recoveryTimes.length
    : 0;

  return {
    resiliencyScore: resiliency,
    averageRecoveryTime: avgRecoveryTime,
    shockMagnitude: priceShock,
    observations: recoveryTimes.length,
    interpretation: resiliency === Infinity
      ? 'Instant recovery - highly resilient'
      : resiliency > 0.001
      ? 'High resiliency'
      : resiliency > 0.0001
      ? 'Moderate resiliency'
      : 'Low resiliency',
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine market condition based on metrics
 */
function determineMarketCondition(
  imbalance: number,
  liquidityLevel: 'HIGH' | 'MEDIUM' | 'LOW',
  volatility: number
): MarketCondition {
  if (liquidityLevel === 'LOW') {
    return MarketCondition.ILLIQUID;
  }

  if (volatility > 0.5) {
    return MarketCondition.VOLATILE;
  }

  if (Math.abs(imbalance) > 0.7) {
    return MarketCondition.STRESSED;
  }

  return MarketCondition.NORMAL;
}

/**
 * Map execution quality from TCA report
 */
function mapExecutionQuality(quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'): ExecutionQuality {
  switch (quality) {
    case 'EXCELLENT':
      return ExecutionQuality.EXCELLENT;
    case 'GOOD':
      return ExecutionQuality.GOOD;
    case 'FAIR':
      return ExecutionQuality.FAIR;
    case 'POOR':
      return ExecutionQuality.POOR;
    default:
      return ExecutionQuality.FAIR;
  }
}

// ============================================================================
// ADVANCED COMPOSITE FUNCTIONS
// ============================================================================

/**
 * Generate comprehensive market microstructure report
 */
export async function generateComprehensiveMarketMicrostructureReport(
  symbol: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const snapshots = await getMarketDataSnapshotsBySymbolAndTimeRange(symbol, startTime, endTime, transaction);
  const tcaReports = await getTCAReportsBySymbolAndTimeRange(symbol, startTime, endTime, transaction);

  const analyses = await MicrostructureAnalysis.findAll({
    where: {
      symbol,
      analysisTimestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    transaction,
  });

  // Aggregate metrics
  const avgImbalance = analyses
    .filter(a => a.orderFlowImbalance !== null)
    .reduce((sum, a) => sum + (a.orderFlowImbalance || 0), 0) /
    (analyses.filter(a => a.orderFlowImbalance !== null).length || 1);

  const avgToxicity = analyses
    .filter(a => a.toxicityScore !== null)
    .reduce((sum, a) => sum + (a.toxicityScore || 0), 0) /
    (analyses.filter(a => a.toxicityScore !== null).length || 1);

  return {
    symbol,
    period: { start: startTime, end: endTime },
    snapshots: snapshots.length,
    analyses: analyses.length,
    tcaReports: tcaReports.length,
    aggregateMetrics: {
      avgImbalance,
      avgToxicity,
    },
    marketConditionDistribution: getMarketConditionDistribution(analyses),
  };
}

/**
 * Get market condition distribution
 */
function getMarketConditionDistribution(analyses: MicrostructureAnalysis[]): Record<string, number> {
  const distribution: Record<string, number> = {
    normal: 0,
    volatile: 0,
    stressed: 0,
    illiquid: 0,
    toxic: 0,
  };

  analyses.forEach(a => {
    distribution[a.marketCondition]++;
  });

  return distribution;
}

/**
 * Export: Initialize all models
 */
export function initializeMarketMicrostructureModels(sequelize: Sequelize): void {
  MarketDataSnapshot.initModel(sequelize);
  MicrostructureAnalysis.initModel(sequelize);
  TransactionCostReport.initModel(sequelize);
  OrderBookSnapshot.initModel(sequelize);
  defineMarketMicrostructureAssociations();
}

/**
 * NestJS Injectable Service wrapper
 */
@Injectable()
export class MarketMicrostructureCompositeService {
  private readonly logger = new Logger(MarketMicrostructureCompositeService.name);

  /**
   * Initialize models with Sequelize instance
   */
  initializeModels(sequelize: Sequelize): void {
    this.logger.log('Initializing market microstructure models');
    initializeMarketMicrostructureModels(sequelize);
    this.logger.log('Market microstructure models initialized successfully');
  }

  // All composite functions are available as static exports above
  // This service class provides NestJS integration and logging
}

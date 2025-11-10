/**
 * LOC: WC-COMP-TRADING-FLOW-001
 * File: /reuse/trading/composites/order-flow-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../trading-order-models-kit
 *   - ../market-microstructure-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal integration services
 *   - Order flow monitoring systems
 *   - Trading desk analytics
 *   - Smart order routing engines
 */

/**
 * File: /reuse/trading/composites/order-flow-analytics-composite.ts
 * Locator: WC-COMP-TRADING-FLOW-001
 * Purpose: Bloomberg Terminal Order Flow Analytics Composite
 *
 * Upstream: @nestjs/common, sequelize, trading-order-models-kit, market-microstructure-kit
 * Downstream: Trading controllers, flow analytics services, order monitoring, footprint charting
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 43 composed functions for comprehensive order flow analysis and institutional flow tracking
 *
 * LLM Context: Enterprise-grade order flow analytics for Bloomberg Terminal-level functionality.
 * Provides order flow imbalance tracking, order book pressure analysis, aggressive vs passive classification,
 * large order detection, block trade identification, smart money tracking, retail vs institutional flow,
 * order flow toxicity measurement, flow-based signals, volume profile analysis, delta analysis,
 * cumulative delta tracking, order flow clustering, sweep detection, and footprint charting.
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

// Import from source kits
import {
  Order,
  Execution,
  Fill,
  OrderSide,
  OrderStatus,
  calculateOrderValue,
  getOrderStatus,
  processExecution,
  recordFill,
  calculateAveragePrice,
} from '../trading-order-models-kit';

import {
  OrderBook,
  OrderBookLevel,
  Quote,
  Trade,
  Price,
  Quantity,
  BasisPoints,
  Timestamp,
  asPrice,
  asQuantity,
  asBasisPoints,
  asTimestamp,
  calculateMidPrice,
  calculateWeightedMidPrice,
  calculateOrderBookImbalance,
  calculateBookDepth,
  calculateBestBidAsk,
  calculateMicroPrice,
  calculateRelativeSpread,
  estimatePriceImpact,
  analyzeOrderFlow,
  calculateVolumeProfile,
  analyzeTradeDirection,
  estimateHiddenLiquidity,
} from '../market-microstructure-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Order flow classification
 */
export enum FlowClassification {
  AGGRESSIVE_BUY = 'aggressive_buy',
  AGGRESSIVE_SELL = 'aggressive_sell',
  PASSIVE_BUY = 'passive_buy',
  PASSIVE_SELL = 'passive_sell',
  SWEEP_BUY = 'sweep_buy',
  SWEEP_SELL = 'sweep_sell',
  BLOCK_BUY = 'block_buy',
  BLOCK_SELL = 'block_sell',
}

/**
 * Trader classification
 */
export enum TraderType {
  RETAIL = 'retail',
  INSTITUTIONAL = 'institutional',
  SMART_MONEY = 'smart_money',
  MARKET_MAKER = 'market_maker',
  HIGH_FREQUENCY = 'high_frequency',
  ALGORITHMIC = 'algorithmic',
}

/**
 * Order flow toxicity level
 */
export enum ToxicityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

/**
 * Flow signal type
 */
export enum FlowSignalType {
  ACCUMULATION = 'accumulation',
  DISTRIBUTION = 'distribution',
  ABSORPTION = 'absorption',
  EXHAUSTION = 'exhaustion',
  BREAKOUT = 'breakout',
  REVERSAL = 'reversal',
}

// ============================================================================
// SEQUELIZE MODEL: OrderFlowEvent
// ============================================================================

/**
 * TypeScript interface for OrderFlowEvent attributes
 */
export interface OrderFlowEventAttributes {
  id: string;
  securityId: string;
  timestamp: Date;
  timestampMicros: number;
  eventType: string;
  flowClassification: FlowClassification;
  side: OrderSide;
  price: number;
  quantity: number;
  notional: number;
  venue: string;
  isAggressive: boolean;
  isSweep: boolean;
  isBlock: boolean;
  traderType: TraderType | null;
  bidPressure: number;
  askPressure: number;
  orderBookImbalance: number;
  toxicityScore: number;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderFlowEventCreationAttributes extends Optional<OrderFlowEventAttributes, 'id' | 'traderType'> {}

/**
 * Sequelize Model: OrderFlowEvent
 * Individual order flow events for tracking
 */
export class OrderFlowEvent extends Model<OrderFlowEventAttributes, OrderFlowEventCreationAttributes> implements OrderFlowEventAttributes {
  declare id: string;
  declare securityId: string;
  declare timestamp: Date;
  declare timestampMicros: number;
  declare eventType: string;
  declare flowClassification: FlowClassification;
  declare side: OrderSide;
  declare price: number;
  declare quantity: number;
  declare notional: number;
  declare venue: string;
  declare isAggressive: boolean;
  declare isSweep: boolean;
  declare isBlock: boolean;
  declare traderType: TraderType | null;
  declare bidPressure: number;
  declare askPressure: number;
  declare orderBookImbalance: number;
  declare toxicityScore: number;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize OrderFlowEvent with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OrderFlowEvent {
    OrderFlowEvent.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        timestampMicros: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'timestamp_micros',
        },
        eventType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'event_type',
        },
        flowClassification: {
          type: DataTypes.ENUM(...Object.values(FlowClassification)),
          allowNull: false,
          field: 'flow_classification',
        },
        side: {
          type: DataTypes.ENUM('BUY', 'SELL'),
          allowNull: false,
          field: 'side',
        },
        price: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price',
        },
        quantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'quantity',
        },
        notional: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'notional',
        },
        venue: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'venue',
        },
        isAggressive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_aggressive',
        },
        isSweep: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_sweep',
        },
        isBlock: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_block',
        },
        traderType: {
          type: DataTypes.ENUM(...Object.values(TraderType)),
          allowNull: true,
          field: 'trader_type',
        },
        bidPressure: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'bid_pressure',
        },
        askPressure: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'ask_pressure',
        },
        orderBookImbalance: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'order_book_imbalance',
        },
        toxicityScore: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'toxicity_score',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
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
        tableName: 'order_flow_events',
        modelName: 'OrderFlowEvent',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['timestamp'] },
          { fields: ['flow_classification'] },
          { fields: ['trader_type'] },
          { fields: ['is_block'] },
          { fields: ['is_sweep'] },
          { fields: ['security_id', 'timestamp'] },
        ],
      }
    );

    return OrderFlowEvent;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CumulativeDelta
// ============================================================================

/**
 * TypeScript interface for CumulativeDelta attributes
 */
export interface CumulativeDeltaAttributes {
  id: string;
  securityId: string;
  timestamp: Date;
  priceLevel: number;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  cumulativeDelta: number;
  volumeAtPrice: number;
  pocPrice: number | null;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CumulativeDeltaCreationAttributes extends Optional<CumulativeDeltaAttributes, 'id' | 'pocPrice'> {}

/**
 * Sequelize Model: CumulativeDelta
 * Cumulative delta tracking by price level
 */
export class CumulativeDelta extends Model<CumulativeDeltaAttributes, CumulativeDeltaCreationAttributes> implements CumulativeDeltaAttributes {
  declare id: string;
  declare securityId: string;
  declare timestamp: Date;
  declare priceLevel: number;
  declare buyVolume: number;
  declare sellVolume: number;
  declare delta: number;
  declare cumulativeDelta: number;
  declare volumeAtPrice: number;
  declare pocPrice: number | null;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize CumulativeDelta with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CumulativeDelta {
    CumulativeDelta.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        priceLevel: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price_level',
        },
        buyVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'buy_volume',
        },
        sellVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'sell_volume',
        },
        delta: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'delta',
        },
        cumulativeDelta: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'cumulative_delta',
        },
        volumeAtPrice: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'volume_at_price',
        },
        pocPrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: true,
          field: 'poc_price',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
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
        tableName: 'cumulative_delta',
        modelName: 'CumulativeDelta',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['timestamp'] },
          { fields: ['price_level'] },
          { fields: ['security_id', 'timestamp'] },
        ],
      }
    );

    return CumulativeDelta;
  }
}

// ============================================================================
// SEQUELIZE MODEL: FlowSignal
// ============================================================================

/**
 * TypeScript interface for FlowSignal attributes
 */
export interface FlowSignalAttributes {
  id: string;
  securityId: string;
  signalType: FlowSignalType;
  timestamp: Date;
  priceLevel: number;
  strength: number;
  confidence: number;
  description: string;
  triggerEvents: string[];
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FlowSignalCreationAttributes extends Optional<FlowSignalAttributes, 'id'> {}

/**
 * Sequelize Model: FlowSignal
 * Flow-based trading signals
 */
export class FlowSignal extends Model<FlowSignalAttributes, FlowSignalCreationAttributes> implements FlowSignalAttributes {
  declare id: string;
  declare securityId: string;
  declare signalType: FlowSignalType;
  declare timestamp: Date;
  declare priceLevel: number;
  declare strength: number;
  declare confidence: number;
  declare description: string;
  declare triggerEvents: string[];
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize FlowSignal with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FlowSignal {
    FlowSignal.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
        },
        signalType: {
          type: DataTypes.ENUM(...Object.values(FlowSignalType)),
          allowNull: false,
          field: 'signal_type',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        priceLevel: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price_level',
        },
        strength: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'strength',
          validate: {
            min: 0,
            max: 1,
          },
        },
        confidence: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'confidence',
          validate: {
            min: 0,
            max: 1,
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description',
        },
        triggerEvents: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'trigger_events',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
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
        tableName: 'flow_signals',
        modelName: 'FlowSignal',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['timestamp'] },
          { fields: ['signal_type'] },
          { fields: ['security_id', 'timestamp'] },
        ],
      }
    );

    return FlowSignal;
  }
}

// ============================================================================
// SEQUELIZE MODEL: FootprintData
// ============================================================================

/**
 * TypeScript interface for FootprintData attributes
 */
export interface FootprintDataAttributes {
  id: string;
  securityId: string;
  timestamp: Date;
  priceLevel: number;
  bidVolume: number;
  askVolume: number;
  bidTrades: number;
  askTrades: number;
  delta: number;
  volumeProfile: number;
  isPointOfControl: boolean;
  isValueArea: boolean;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FootprintDataCreationAttributes extends Optional<FootprintDataAttributes, 'id'> {}

/**
 * Sequelize Model: FootprintData
 * Footprint chart data for order flow visualization
 */
export class FootprintData extends Model<FootprintDataAttributes, FootprintDataCreationAttributes> implements FootprintDataAttributes {
  declare id: string;
  declare securityId: string;
  declare timestamp: Date;
  declare priceLevel: number;
  declare bidVolume: number;
  declare askVolume: number;
  declare bidTrades: number;
  declare askTrades: number;
  declare delta: number;
  declare volumeProfile: number;
  declare isPointOfControl: boolean;
  declare isValueArea: boolean;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize FootprintData with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof FootprintData {
    FootprintData.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        priceLevel: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price_level',
        },
        bidVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'bid_volume',
        },
        askVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'ask_volume',
        },
        bidTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'bid_trades',
        },
        askTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'ask_trades',
        },
        delta: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'delta',
        },
        volumeProfile: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'volume_profile',
        },
        isPointOfControl: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_point_of_control',
        },
        isValueArea: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_value_area',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
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
        tableName: 'footprint_data',
        modelName: 'FootprintData',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['timestamp'] },
          { fields: ['price_level'] },
          { fields: ['is_point_of_control'] },
          { fields: ['security_id', 'timestamp'] },
        ],
      }
    );

    return FootprintData;
  }
}

// ============================================================================
// ORDER FLOW IMBALANCE ANALYSIS (Functions 1-7)
// ============================================================================

/**
 * Calculate real-time order flow imbalance
 */
export async function calculateOrderFlowImbalance(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  imbalance: number;
  buyVolume: number;
  sellVolume: number;
  buyPressure: number;
  askPressure: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    transaction,
  });

  let buyVolume = 0;
  let sellVolume = 0;

  events.forEach(event => {
    if (event.side === 'BUY') {
      buyVolume += Number(event.quantity);
    } else {
      sellVolume += Number(event.quantity);
    }
  });

  const totalVolume = buyVolume + sellVolume;
  const imbalance = totalVolume > 0 ? (buyVolume - sellVolume) / totalVolume : 0;

  return {
    imbalance,
    buyVolume,
    sellVolume,
    buyPressure: totalVolume > 0 ? buyVolume / totalVolume : 0,
    askPressure: totalVolume > 0 ? sellVolume / totalVolume : 0,
  };
}

/**
 * Analyze order book pressure from depth
 */
export async function analyzeOrderBookPressure(
  orderBook: OrderBook,
  depth: number = 10
): Promise<{
  bidPressure: number;
  askPressure: number;
  netPressure: number;
  pressureImbalance: number;
}> {
  const bookDepth = calculateBookDepth(orderBook, depth);

  const totalSize = bookDepth.totalBidSize + bookDepth.totalAskSize;
  const bidPressure = totalSize > 0 ? bookDepth.totalBidSize / totalSize : 0;
  const askPressure = totalSize > 0 ? bookDepth.totalAskSize / totalSize : 0;
  const netPressure = bidPressure - askPressure;
  const pressureImbalance = bookDepth.depthImbalance;

  return {
    bidPressure,
    askPressure,
    netPressure,
    pressureImbalance,
  };
}

/**
 * Track order flow imbalance over time series
 */
export async function trackOrderFlowTimeSeries(
  securityId: string,
  startTime: Date,
  endTime: Date,
  bucketSize: number,
  transaction?: Transaction
): Promise<Array<{
  timestamp: Date;
  imbalance: number;
  buyVolume: number;
  sellVolume: number;
}>> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  const buckets: Map<number, { buyVolume: number; sellVolume: number }> = new Map();

  events.forEach(event => {
    const bucketTime = Math.floor(event.timestamp.getTime() / bucketSize) * bucketSize;
    if (!buckets.has(bucketTime)) {
      buckets.set(bucketTime, { buyVolume: 0, sellVolume: 0 });
    }

    const bucket = buckets.get(bucketTime)!;
    if (event.side === 'BUY') {
      bucket.buyVolume += Number(event.quantity);
    } else {
      bucket.sellVolume += Number(event.quantity);
    }
  });

  return Array.from(buckets.entries()).map(([time, data]) => {
    const totalVolume = data.buyVolume + data.sellVolume;
    const imbalance = totalVolume > 0 ? (data.buyVolume - data.sellVolume) / totalVolume : 0;

    return {
      timestamp: new Date(time),
      imbalance,
      buyVolume: data.buyVolume,
      sellVolume: data.sellVolume,
    };
  });
}

/**
 * Detect order flow divergence
 */
export async function detectOrderFlowDivergence(
  securityId: string,
  priceData: Array<{ timestamp: Date; price: number }>,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  hasDivergence: boolean;
  type: 'bullish' | 'bearish' | 'none';
  strength: number;
}> {
  const flowData = await trackOrderFlowTimeSeries(
    securityId,
    priceData[0].timestamp,
    priceData[priceData.length - 1].timestamp,
    timeWindow,
    transaction
  );

  // Simple divergence detection: price up + flow down = bearish divergence
  const priceDirection = priceData[priceData.length - 1].price - priceData[0].price;
  const flowDirection = flowData.length > 1
    ? flowData[flowData.length - 1].imbalance - flowData[0].imbalance
    : 0;

  const hasDivergence = (priceDirection > 0 && flowDirection < 0) || (priceDirection < 0 && flowDirection > 0);

  let type: 'bullish' | 'bearish' | 'none' = 'none';
  if (hasDivergence) {
    type = priceDirection > 0 ? 'bearish' : 'bullish';
  }

  const strength = Math.abs(priceDirection) * Math.abs(flowDirection) / 10000;

  return {
    hasDivergence,
    type,
    strength: Math.min(1, strength),
  };
}

/**
 * Calculate microstructure imbalance
 */
export async function calculateMicrostructureImbalance(
  orderBook: OrderBook,
  recentTrades: Trade[]
): Promise<{
  bookImbalance: number;
  tradeImbalance: number;
  combinedImbalance: number;
  microPrice: number;
}> {
  const bookImbalance = calculateOrderBookImbalance(orderBook, 5);

  let buyTradeVolume = 0;
  let sellTradeVolume = 0;

  recentTrades.forEach(trade => {
    if (trade.side === 'BUY') {
      buyTradeVolume += trade.quantity;
    } else if (trade.side === 'SELL') {
      sellTradeVolume += trade.quantity;
    }
  });

  const totalTradeVolume = buyTradeVolume + sellTradeVolume;
  const tradeImbalance = totalTradeVolume > 0 ? (buyTradeVolume - sellTradeVolume) / totalTradeVolume : 0;

  const combinedImbalance = (bookImbalance * 0.6) + (tradeImbalance * 0.4);

  const microPrice = calculateMicroPrice(orderBook);

  return {
    bookImbalance,
    tradeImbalance,
    combinedImbalance,
    microPrice,
  };
}

/**
 * Generate order flow imbalance report
 */
export async function generateOrderFlowReport(
  securityId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<{
  totalBuyVolume: number;
  totalSellVolume: number;
  averageImbalance: number;
  maxImbalance: number;
  minImbalance: number;
  dominantSide: OrderSide;
}> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
    },
    transaction,
  });

  let totalBuyVolume = 0;
  let totalSellVolume = 0;
  const imbalances: number[] = [];

  events.forEach(event => {
    if (event.side === 'BUY') {
      totalBuyVolume += Number(event.quantity);
    } else {
      totalSellVolume += Number(event.quantity);
    }
    imbalances.push(event.orderBookImbalance);
  });

  const averageImbalance = imbalances.length > 0
    ? imbalances.reduce((sum, val) => sum + val, 0) / imbalances.length
    : 0;

  const maxImbalance = imbalances.length > 0 ? Math.max(...imbalances) : 0;
  const minImbalance = imbalances.length > 0 ? Math.min(...imbalances) : 0;
  const dominantSide: OrderSide = totalBuyVolume > totalSellVolume ? 'BUY' : 'SELL';

  return {
    totalBuyVolume,
    totalSellVolume,
    averageImbalance,
    maxImbalance,
    minImbalance,
    dominantSide,
  };
}

/**
 * Monitor real-time flow pressure shifts
 */
export async function monitorFlowPressureShifts(
  securityId: string,
  currentImbalance: number,
  historicalImbalances: number[],
  threshold: number = 0.3
): Promise<{
  hasShift: boolean;
  shiftType: 'bullish' | 'bearish' | 'neutral';
  magnitude: number;
}> {
  const avgHistorical = historicalImbalances.reduce((sum, val) => sum + val, 0) / historicalImbalances.length;
  const deviation = currentImbalance - avgHistorical;

  const hasShift = Math.abs(deviation) > threshold;

  let shiftType: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (hasShift) {
    shiftType = deviation > 0 ? 'bullish' : 'bearish';
  }

  const magnitude = Math.abs(deviation);

  return {
    hasShift,
    shiftType,
    magnitude,
  };
}

// ============================================================================
// AGGRESSIVE VS PASSIVE FLOW CLASSIFICATION (Functions 8-14)
// ============================================================================

/**
 * Classify order as aggressive or passive
 */
export async function classifyOrderAggression(
  trade: Trade,
  quote: Quote,
  orderBook: OrderBook
): Promise<{
  isAggressive: boolean;
  classification: FlowClassification;
  aggressionScore: number;
}> {
  const midPrice = calculateMidPrice(orderBook);
  const spread = calculateRelativeSpread(quote);

  let isAggressive = false;
  let classification: FlowClassification;
  let aggressionScore = 0;

  // Determine if trade crossed the spread
  if (trade.price >= quote.askPrice) {
    isAggressive = true;
    classification = FlowClassification.AGGRESSIVE_BUY;
    aggressionScore = Math.min(1, (trade.price - midPrice) / midPrice * 100);
  } else if (trade.price <= quote.bidPrice) {
    isAggressive = true;
    classification = FlowClassification.AGGRESSIVE_SELL;
    aggressionScore = Math.min(1, (midPrice - trade.price) / midPrice * 100);
  } else {
    // Passive order (posted and waited)
    classification = trade.price > midPrice
      ? FlowClassification.PASSIVE_BUY
      : FlowClassification.PASSIVE_SELL;
  }

  return {
    isAggressive,
    classification,
    aggressionScore,
  };
}

/**
 * Track aggressive vs passive flow ratio
 */
export async function trackAggressivePassiveRatio(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  aggressiveRatio: number;
  passiveRatio: number;
  aggressiveBuyRatio: number;
  aggressiveSellRatio: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    transaction,
  });

  let aggressiveCount = 0;
  let passiveCount = 0;
  let aggressiveBuyCount = 0;
  let aggressiveSellCount = 0;

  events.forEach(event => {
    if (event.isAggressive) {
      aggressiveCount++;
      if (event.side === 'BUY') {
        aggressiveBuyCount++;
      } else {
        aggressiveSellCount++;
      }
    } else {
      passiveCount++;
    }
  });

  const totalCount = events.length;

  return {
    aggressiveRatio: totalCount > 0 ? aggressiveCount / totalCount : 0,
    passiveRatio: totalCount > 0 ? passiveCount / totalCount : 0,
    aggressiveBuyRatio: aggressiveCount > 0 ? aggressiveBuyCount / aggressiveCount : 0,
    aggressiveSellRatio: aggressiveCount > 0 ? aggressiveSellCount / aggressiveCount : 0,
  };
}

/**
 * Analyze aggressive flow intensity
 */
export async function analyzeAggressiveFlowIntensity(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  intensity: number;
  buyIntensity: number;
  sellIntensity: number;
  netIntensity: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      isAggressive: true,
    },
    transaction,
  });

  let buyNotional = 0;
  let sellNotional = 0;

  events.forEach(event => {
    if (event.side === 'BUY') {
      buyNotional += Number(event.notional);
    } else {
      sellNotional += Number(event.notional);
    }
  });

  const totalNotional = buyNotional + sellNotional;
  const intensity = totalNotional / (timeWindow / 1000); // Per second
  const buyIntensity = buyNotional / (timeWindow / 1000);
  const sellIntensity = sellNotional / (timeWindow / 1000);
  const netIntensity = (buyNotional - sellNotional) / (timeWindow / 1000);

  return {
    intensity,
    buyIntensity,
    sellIntensity,
    netIntensity,
  };
}

/**
 * Detect passive order absorption
 */
export async function detectPassiveOrderAbsorption(
  securityId: string,
  priceLevel: number,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  absorbed: boolean;
  absorptionVolume: number;
  absorptionRate: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      price: priceLevel,
      isAggressive: true,
    },
    transaction,
  });

  const absorptionVolume = events.reduce((sum, event) => sum + Number(event.quantity), 0);
  const absorptionRate = absorptionVolume / (timeWindow / 1000);

  const absorbed = absorptionVolume > 0;

  return {
    absorbed,
    absorptionVolume,
    absorptionRate,
  };
}

/**
 * Calculate market taker vs maker ratio
 */
export async function calculateTakerMakerRatio(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  takerRatio: number;
  makerRatio: number;
  takerVolume: number;
  makerVolume: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    transaction,
  });

  let takerVolume = 0;
  let makerVolume = 0;

  events.forEach(event => {
    if (event.isAggressive) {
      takerVolume += Number(event.quantity);
    } else {
      makerVolume += Number(event.quantity);
    }
  });

  const totalVolume = takerVolume + makerVolume;

  return {
    takerRatio: totalVolume > 0 ? takerVolume / totalVolume : 0,
    makerRatio: totalVolume > 0 ? makerVolume / totalVolume : 0,
    takerVolume,
    makerVolume,
  };
}

/**
 * Identify aggressive flow clusters
 */
export async function identifyAggressiveFlowClusters(
  securityId: string,
  timeWindow: number,
  clusterThreshold: number,
  transaction?: Transaction
): Promise<Array<{
  timestamp: Date;
  clusterSize: number;
  totalVolume: number;
  side: OrderSide;
}>> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      isAggressive: true,
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  const clusters: Array<{
    timestamp: Date;
    clusterSize: number;
    totalVolume: number;
    side: OrderSide;
  }> = [];

  let currentCluster: typeof events = [];

  events.forEach((event, index) => {
    if (currentCluster.length === 0) {
      currentCluster.push(event);
    } else {
      const timeDiff = event.timestamp.getTime() - currentCluster[currentCluster.length - 1].timestamp.getTime();
      if (timeDiff < clusterThreshold && event.side === currentCluster[0].side) {
        currentCluster.push(event);
      } else {
        if (currentCluster.length >= 3) {
          const totalVolume = currentCluster.reduce((sum, e) => sum + Number(e.quantity), 0);
          clusters.push({
            timestamp: currentCluster[0].timestamp,
            clusterSize: currentCluster.length,
            totalVolume,
            side: currentCluster[0].side,
          });
        }
        currentCluster = [event];
      }
    }
  });

  return clusters;
}

/**
 * Generate aggression score matrix
 */
export async function generateAggressionScoreMatrix(
  securityId: string,
  startTime: Date,
  endTime: Date,
  priceIntervals: number,
  transaction?: Transaction
): Promise<Array<{
  priceLevel: number;
  aggressiveBuyScore: number;
  aggressiveSellScore: number;
  netAggressionScore: number;
}>> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
      isAggressive: true,
    },
    transaction,
  });

  const minPrice = Math.min(...events.map(e => Number(e.price)));
  const maxPrice = Math.max(...events.map(e => Number(e.price)));
  const intervalSize = (maxPrice - minPrice) / priceIntervals;

  const matrix: Array<{
    priceLevel: number;
    aggressiveBuyScore: number;
    aggressiveSellScore: number;
    netAggressionScore: number;
  }> = [];

  for (let i = 0; i < priceIntervals; i++) {
    const priceLevel = minPrice + (i * intervalSize);
    const maxLevel = priceLevel + intervalSize;

    const levelEvents = events.filter(e => Number(e.price) >= priceLevel && Number(e.price) < maxLevel);

    let buyVolume = 0;
    let sellVolume = 0;

    levelEvents.forEach(event => {
      if (event.side === 'BUY') {
        buyVolume += Number(event.quantity);
      } else {
        sellVolume += Number(event.quantity);
      }
    });

    const totalVolume = buyVolume + sellVolume;
    const aggressiveBuyScore = totalVolume > 0 ? buyVolume / totalVolume : 0;
    const aggressiveSellScore = totalVolume > 0 ? sellVolume / totalVolume : 0;
    const netAggressionScore = aggressiveBuyScore - aggressiveSellScore;

    matrix.push({
      priceLevel,
      aggressiveBuyScore,
      aggressiveSellScore,
      netAggressionScore,
    });
  }

  return matrix;
}

// ============================================================================
// LARGE ORDER & BLOCK TRADE DETECTION (Functions 15-21)
// ============================================================================

/**
 * Detect large orders above threshold
 */
export async function detectLargeOrders(
  securityId: string,
  notionalThreshold: number,
  timeWindow: number,
  transaction?: Transaction
): Promise<Array<{
  orderId: string;
  timestamp: Date;
  side: OrderSide;
  quantity: number;
  notional: number;
  isBlock: boolean;
}>> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      notional: { [Op.gte]: notionalThreshold },
    },
    order: [['timestamp', 'DESC']],
    transaction,
  });

  return events.map(event => ({
    orderId: event.id,
    timestamp: event.timestamp,
    side: event.side,
    quantity: Number(event.quantity),
    notional: Number(event.notional),
    isBlock: event.isBlock,
  }));
}

/**
 * Identify block trade activity
 */
export async function identifyBlockTrades(
  securityId: string,
  blockThreshold: number,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  blockTrades: number;
  totalBlockVolume: number;
  averageBlockSize: number;
  blockBuyRatio: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      isBlock: true,
    },
    transaction,
  });

  const totalBlockVolume = events.reduce((sum, event) => sum + Number(event.quantity), 0);
  const averageBlockSize = events.length > 0 ? totalBlockVolume / events.length : 0;

  const blockBuys = events.filter(e => e.side === 'BUY').length;
  const blockBuyRatio = events.length > 0 ? blockBuys / events.length : 0;

  return {
    blockTrades: events.length,
    totalBlockVolume,
    averageBlockSize,
    blockBuyRatio,
  };
}

/**
 * Track block trade patterns
 */
export async function trackBlockTradePatterns(
  securityId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<{
  patterns: Array<{
    timestamp: Date;
    side: OrderSide;
    volume: number;
    priceLevel: number;
  }>;
  dominantSide: OrderSide;
  concentration: number;
}> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
      isBlock: true,
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  const patterns = events.map(event => ({
    timestamp: event.timestamp,
    side: event.side,
    volume: Number(event.quantity),
    priceLevel: Number(event.price),
  }));

  const buyBlocks = events.filter(e => e.side === 'BUY').length;
  const sellBlocks = events.filter(e => e.side === 'SELL').length;
  const dominantSide: OrderSide = buyBlocks > sellBlocks ? 'BUY' : 'SELL';

  // Calculate Herfindahl concentration index
  const totalVolume = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const concentration = events.reduce((sum, event) => {
    const share = Number(event.quantity) / totalVolume;
    return sum + (share * share);
  }, 0);

  return {
    patterns,
    dominantSide,
    concentration,
  };
}

/**
 * Calculate average block size by time period
 */
export async function calculateAverageBlockSize(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  averageSize: number;
  medianSize: number;
  largestBlock: number;
  blockFrequency: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      isBlock: true,
    },
    transaction,
  });

  const sizes = events.map(e => Number(e.quantity)).sort((a, b) => a - b);

  const averageSize = sizes.length > 0 ? sizes.reduce((sum, s) => sum + s, 0) / sizes.length : 0;
  const medianSize = sizes.length > 0 ? sizes[Math.floor(sizes.length / 2)] : 0;
  const largestBlock = sizes.length > 0 ? Math.max(...sizes) : 0;
  const blockFrequency = events.length / (timeWindow / 1000); // Per second

  return {
    averageSize,
    medianSize,
    largestBlock,
    blockFrequency,
  };
}

/**
 * Detect iceberg order activity
 */
export async function detectIcebergOrders(
  securityId: string,
  priceLevel: number,
  volumeThreshold: number,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  detected: boolean;
  totalVolume: number;
  fillCount: number;
  averageFillSize: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      price: priceLevel,
    },
    transaction,
  });

  const totalVolume = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const fillCount = events.length;
  const averageFillSize = fillCount > 0 ? totalVolume / fillCount : 0;

  // Iceberg detected if many small fills at same price totaling large volume
  const detected = fillCount > 10 && totalVolume > volumeThreshold && averageFillSize < (volumeThreshold / 5);

  return {
    detected,
    totalVolume,
    fillCount,
    averageFillSize,
  };
}

/**
 * Monitor large order execution quality
 */
export async function monitorLargeOrderExecution(
  orderId: string,
  benchmarkPrice: Price,
  transaction?: Transaction
): Promise<{
  slippage: number;
  marketImpact: number;
  executionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}> {
  const events = await OrderFlowEvent.findAll({
    where: {
      id: orderId,
    },
    transaction,
  });

  if (events.length === 0) {
    throw new Error('Order not found');
  }

  const event = events[0];
  const executionPrice = Number(event.price);

  const slippage = ((executionPrice - benchmarkPrice) / benchmarkPrice) * 10000;
  const marketImpact = Math.abs(slippage);

  let executionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  if (marketImpact < 5) {
    executionQuality = 'EXCELLENT';
  } else if (marketImpact < 15) {
    executionQuality = 'GOOD';
  } else if (marketImpact < 30) {
    executionQuality = 'FAIR';
  } else {
    executionQuality = 'POOR';
  }

  return {
    slippage,
    marketImpact,
    executionQuality,
  };
}

/**
 * Generate block trade alert
 */
export async function generateBlockTradeAlert(
  securityId: string,
  blockThreshold: number,
  transaction?: Transaction
): Promise<{
  hasAlert: boolean;
  blockTrade: any | null;
  alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
}> {
  const recentEvents = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: new Date(Date.now() - 60000) }, // Last minute
      isBlock: true,
    },
    order: [['timestamp', 'DESC']],
    limit: 1,
    transaction,
  });

  if (recentEvents.length === 0) {
    return {
      hasAlert: false,
      blockTrade: null,
      alertLevel: 'INFO',
    };
  }

  const blockTrade = recentEvents[0];
  const notional = Number(blockTrade.notional);

  let alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
  if (notional > blockThreshold * 5) {
    alertLevel = 'CRITICAL';
  } else if (notional > blockThreshold * 2) {
    alertLevel = 'WARNING';
  } else {
    alertLevel = 'INFO';
  }

  return {
    hasAlert: true,
    blockTrade: {
      id: blockTrade.id,
      timestamp: blockTrade.timestamp,
      side: blockTrade.side,
      quantity: Number(blockTrade.quantity),
      notional,
      price: Number(blockTrade.price),
    },
    alertLevel,
  };
}

// ============================================================================
// SMART MONEY & INSTITUTIONAL FLOW TRACKING (Functions 22-28)
// ============================================================================

/**
 * Classify trader type based on behavior
 */
export async function classifyTraderType(
  orderSize: number,
  executionVenue: string,
  executionTime: Date,
  averageOrderSize: number
): Promise<{
  traderType: TraderType;
  confidence: number;
}> {
  let traderType: TraderType;
  let confidence = 0.5;

  // Simple classification heuristics
  if (orderSize > averageOrderSize * 10) {
    traderType = TraderType.INSTITUTIONAL;
    confidence = 0.8;
  } else if (orderSize > averageOrderSize * 3) {
    if (executionVenue.includes('DARK')) {
      traderType = TraderType.SMART_MONEY;
      confidence = 0.7;
    } else {
      traderType = TraderType.INSTITUTIONAL;
      confidence = 0.6;
    }
  } else if (orderSize < averageOrderSize * 0.3) {
    traderType = TraderType.RETAIL;
    confidence = 0.7;
  } else {
    traderType = TraderType.ALGORITHMIC;
    confidence = 0.5;
  }

  return {
    traderType,
    confidence,
  };
}

/**
 * Track institutional order flow
 */
export async function trackInstitutionalFlow(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  institutionalBuyVolume: number;
  institutionalSellVolume: number;
  institutionalImbalance: number;
  averageOrderSize: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      traderType: TraderType.INSTITUTIONAL,
    },
    transaction,
  });

  let buyVolume = 0;
  let sellVolume = 0;

  events.forEach(event => {
    if (event.side === 'BUY') {
      buyVolume += Number(event.quantity);
    } else {
      sellVolume += Number(event.quantity);
    }
  });

  const totalVolume = buyVolume + sellVolume;
  const institutionalImbalance = totalVolume > 0 ? (buyVolume - sellVolume) / totalVolume : 0;
  const averageOrderSize = events.length > 0 ? totalVolume / events.length : 0;

  return {
    institutionalBuyVolume: buyVolume,
    institutionalSellVolume: sellVolume,
    institutionalImbalance,
    averageOrderSize,
  };
}

/**
 * Identify smart money accumulation
 */
export async function identifySmartMoneyAccumulation(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  isAccumulating: boolean;
  accumulationScore: number;
  smartMoneyVolume: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      traderType: TraderType.SMART_MONEY,
    },
    transaction,
  });

  const buyEvents = events.filter(e => e.side === 'BUY');
  const sellEvents = events.filter(e => e.side === 'SELL');

  const buyVolume = buyEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const sellVolume = sellEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const smartMoneyVolume = buyVolume + sellVolume;

  const netVolume = buyVolume - sellVolume;
  const accumulationScore = smartMoneyVolume > 0 ? netVolume / smartMoneyVolume : 0;

  const isAccumulating = accumulationScore > 0.3 && buyEvents.length > 5;

  return {
    isAccumulating,
    accumulationScore,
    smartMoneyVolume,
  };
}

/**
 * Compare retail vs institutional flow
 */
export async function compareRetailInstitutionalFlow(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  retailVolume: number;
  institutionalVolume: number;
  retailBuyRatio: number;
  institutionalBuyRatio: number;
  dominantType: TraderType;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      traderType: { [Op.in]: [TraderType.RETAIL, TraderType.INSTITUTIONAL] },
    },
    transaction,
  });

  const retailEvents = events.filter(e => e.traderType === TraderType.RETAIL);
  const institutionalEvents = events.filter(e => e.traderType === TraderType.INSTITUTIONAL);

  const retailVolume = retailEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const institutionalVolume = institutionalEvents.reduce((sum, e) => sum + Number(e.quantity), 0);

  const retailBuys = retailEvents.filter(e => e.side === 'BUY').reduce((sum, e) => sum + Number(e.quantity), 0);
  const institutionalBuys = institutionalEvents.filter(e => e.side === 'BUY').reduce((sum, e) => sum + Number(e.quantity), 0);

  const retailBuyRatio = retailVolume > 0 ? retailBuys / retailVolume : 0;
  const institutionalBuyRatio = institutionalVolume > 0 ? institutionalBuys / institutionalVolume : 0;

  const dominantType: TraderType = institutionalVolume > retailVolume ? TraderType.INSTITUTIONAL : TraderType.RETAIL;

  return {
    retailVolume,
    institutionalVolume,
    retailBuyRatio,
    institutionalBuyRatio,
    dominantType,
  };
}

/**
 * Detect dark pool activity
 */
export async function detectDarkPoolActivity(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  darkPoolVolume: number;
  darkPoolRatio: number;
  averageDarkPoolSize: number;
  darkPoolTrades: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const allEvents = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    transaction,
  });

  const darkPoolEvents = allEvents.filter(e => e.venue.includes('DARK'));

  const darkPoolVolume = darkPoolEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const totalVolume = allEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const darkPoolRatio = totalVolume > 0 ? darkPoolVolume / totalVolume : 0;
  const averageDarkPoolSize = darkPoolEvents.length > 0 ? darkPoolVolume / darkPoolEvents.length : 0;

  return {
    darkPoolVolume,
    darkPoolRatio,
    averageDarkPoolSize,
    darkPoolTrades: darkPoolEvents.length,
  };
}

/**
 * Monitor HFT vs traditional flow
 */
export async function monitorHFTFlow(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  hftVolume: number;
  hftRatio: number;
  hftTradeFrequency: number;
  averageHftOrderSize: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    transaction,
  });

  const hftEvents = events.filter(e => e.traderType === TraderType.HIGH_FREQUENCY);

  const hftVolume = hftEvents.reduce((sum, e) => sum + Number(e.quantity), 0);
  const totalVolume = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const hftRatio = totalVolume > 0 ? hftVolume / totalVolume : 0;
  const hftTradeFrequency = hftEvents.length / (timeWindow / 1000);
  const averageHftOrderSize = hftEvents.length > 0 ? hftVolume / hftEvents.length : 0;

  return {
    hftVolume,
    hftRatio,
    hftTradeFrequency,
    averageHftOrderSize,
  };
}

/**
 * Generate institutional activity report
 */
export async function generateInstitutionalActivityReport(
  securityId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<{
  totalInstitutionalVolume: number;
  institutionalTrades: number;
  averageInstitutionalSize: number;
  institutionalBuyRatio: number;
  largestInstitutionalOrder: number;
  venueDistribution: Record<string, number>;
}> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
      traderType: TraderType.INSTITUTIONAL,
    },
    transaction,
  });

  const totalInstitutionalVolume = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const institutionalBuys = events.filter(e => e.side === 'BUY').reduce((sum, e) => sum + Number(e.quantity), 0);
  const institutionalBuyRatio = totalInstitutionalVolume > 0 ? institutionalBuys / totalInstitutionalVolume : 0;
  const averageInstitutionalSize = events.length > 0 ? totalInstitutionalVolume / events.length : 0;
  const largestInstitutionalOrder = events.length > 0 ? Math.max(...events.map(e => Number(e.quantity))) : 0;

  const venueDistribution: Record<string, number> = {};
  events.forEach(event => {
    const venue = event.venue;
    venueDistribution[venue] = (venueDistribution[venue] || 0) + Number(event.quantity);
  });

  return {
    totalInstitutionalVolume,
    institutionalTrades: events.length,
    averageInstitutionalSize,
    institutionalBuyRatio,
    largestInstitutionalOrder,
    venueDistribution,
  };
}

// ============================================================================
// ORDER FLOW TOXICITY & SIGNALS (Functions 29-35)
// ============================================================================

/**
 * Calculate order flow toxicity score
 */
export async function calculateOrderFlowToxicity(
  securityId: string,
  orderBook: OrderBook,
  recentTrades: Trade[],
  volatility: number
): Promise<{
  toxicityScore: number;
  toxicityLevel: ToxicityLevel;
  adverseSelectionRisk: number;
}> {
  const orderFlowData = analyzeOrderFlow(recentTrades, 60000); // 1 minute window
  const imbalance = Math.abs(orderFlowData.imbalance);
  const spread = calculateRelativeSpread({
    bidPrice: orderBook.bids[0]?.price || 0,
    bidSize: asQuantity(orderBook.bids[0]?.quantity || 0),
    askPrice: orderBook.asks[0]?.price || 0,
    askSize: asQuantity(orderBook.asks[0]?.quantity || 0),
    timestamp: asTimestamp(Date.now()),
    symbol: securityId,
  });

  // Toxicity increases with: high imbalance, wide spreads, high volatility
  const toxicityScore = Math.min(1, (imbalance * 0.4) + (spread / 100 * 0.3) + (volatility * 0.3));

  let toxicityLevel: ToxicityLevel;
  if (toxicityScore < 0.25) {
    toxicityLevel = ToxicityLevel.LOW;
  } else if (toxicityScore < 0.5) {
    toxicityLevel = ToxicityLevel.MEDIUM;
  } else if (toxicityScore < 0.75) {
    toxicityLevel = ToxicityLevel.HIGH;
  } else {
    toxicityLevel = ToxicityLevel.VERY_HIGH;
  }

  const adverseSelectionRisk = toxicityScore * 0.8;

  return {
    toxicityScore,
    toxicityLevel,
    adverseSelectionRisk,
  };
}

/**
 * Generate flow-based trading signal
 */
export async function generateFlowSignal(
  securityId: string,
  signalType: FlowSignalType,
  strength: number,
  confidence: number,
  priceLevel: number,
  description: string,
  triggerEvents: string[],
  transaction?: Transaction
): Promise<FlowSignal> {
  return await FlowSignal.create(
    {
      securityId,
      signalType,
      timestamp: new Date(),
      priceLevel,
      strength,
      confidence,
      description,
      triggerEvents,
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Detect accumulation/distribution patterns
 */
export async function detectAccumulationDistribution(
  securityId: string,
  timeWindow: number,
  priceData: Array<{ timestamp: Date; price: number; volume: number }>,
  transaction?: Transaction
): Promise<{
  pattern: 'accumulation' | 'distribution' | 'neutral';
  strength: number;
  signal: FlowSignal | null;
}> {
  const flowData = await trackOrderFlowTimeSeries(
    securityId,
    priceData[0].timestamp,
    priceData[priceData.length - 1].timestamp,
    timeWindow,
    transaction
  );

  // Accumulation: price stable/down but buying pressure
  // Distribution: price stable/up but selling pressure
  const priceChange = priceData[priceData.length - 1].price - priceData[0].price;
  const avgImbalance = flowData.reduce((sum, d) => sum + d.imbalance, 0) / flowData.length;

  let pattern: 'accumulation' | 'distribution' | 'neutral' = 'neutral';
  let strength = 0;

  if (priceChange <= 0 && avgImbalance > 0.2) {
    pattern = 'accumulation';
    strength = Math.min(1, avgImbalance);
  } else if (priceChange >= 0 && avgImbalance < -0.2) {
    pattern = 'distribution';
    strength = Math.min(1, Math.abs(avgImbalance));
  }

  let signal: FlowSignal | null = null;

  if (pattern !== 'neutral' && strength > 0.5) {
    signal = await generateFlowSignal(
      securityId,
      pattern === 'accumulation' ? FlowSignalType.ACCUMULATION : FlowSignalType.DISTRIBUTION,
      strength,
      0.7,
      priceData[priceData.length - 1].price,
      `${pattern.toUpperCase()} pattern detected with ${(strength * 100).toFixed(1)}% strength`,
      ['flow_imbalance', 'price_action'],
      transaction
    );
  }

  return {
    pattern,
    strength,
    signal,
  };
}

/**
 * Identify order flow exhaustion
 */
export async function identifyOrderFlowExhaustion(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  exhausted: boolean;
  exhaustionType: 'buy' | 'sell' | 'none';
  confidence: number;
}> {
  const flowSeries = await trackOrderFlowTimeSeries(
    securityId,
    new Date(Date.now() - timeWindow * 2),
    new Date(),
    timeWindow / 10,
    transaction
  );

  if (flowSeries.length < 5) {
    return {
      exhausted: false,
      exhaustionType: 'none',
      confidence: 0,
    };
  }

  // Check for declining imbalance trend
  const recentImbalance = flowSeries.slice(-3).map(d => d.imbalance);
  const historicalImbalance = flowSeries.slice(0, -3).map(d => d.imbalance);

  const recentAvg = recentImbalance.reduce((sum, val) => sum + val, 0) / recentImbalance.length;
  const historicalAvg = historicalImbalance.reduce((sum, val) => sum + val, 0) / historicalImbalance.length;

  const exhausted = Math.abs(recentAvg) < Math.abs(historicalAvg) * 0.5;

  let exhaustionType: 'buy' | 'sell' | 'none' = 'none';
  if (exhausted) {
    exhaustionType = historicalAvg > 0 ? 'buy' : 'sell';
  }

  const confidence = exhausted ? Math.min(1, Math.abs(historicalAvg - recentAvg)) : 0;

  return {
    exhausted,
    exhaustionType,
    confidence,
  };
}

/**
 * Detect sweep orders
 */
export async function detectSweepOrders(
  securityId: string,
  timeWindow: number,
  priceThreshold: number,
  transaction?: Transaction
): Promise<Array<{
  timestamp: Date;
  side: OrderSide;
  pricesSwept: number;
  totalVolume: number;
}>> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      isSweep: true,
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  // Group sweeps by timestamp clusters
  const sweeps: Array<{
    timestamp: Date;
    side: OrderSide;
    pricesSwept: number;
    totalVolume: number;
  }> = [];

  const clusterWindow = 1000; // 1 second
  let currentCluster: typeof events = [];

  events.forEach(event => {
    if (currentCluster.length === 0) {
      currentCluster.push(event);
    } else {
      const timeDiff = event.timestamp.getTime() - currentCluster[0].timestamp.getTime();
      if (timeDiff < clusterWindow && event.side === currentCluster[0].side) {
        currentCluster.push(event);
      } else {
        if (currentCluster.length >= 2) {
          const uniquePrices = new Set(currentCluster.map(e => Number(e.price)));
          sweeps.push({
            timestamp: currentCluster[0].timestamp,
            side: currentCluster[0].side,
            pricesSwept: uniquePrices.size,
            totalVolume: currentCluster.reduce((sum, e) => sum + Number(e.quantity), 0),
          });
        }
        currentCluster = [event];
      }
    }
  });

  return sweeps;
}

/**
 * Monitor order flow momentum
 */
export async function monitorOrderFlowMomentum(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  momentum: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  acceleration: number;
}> {
  const flowSeries = await trackOrderFlowTimeSeries(
    securityId,
    new Date(Date.now() - timeWindow),
    new Date(),
    timeWindow / 20,
    transaction
  );

  if (flowSeries.length < 3) {
    return {
      momentum: 0,
      direction: 'neutral',
      acceleration: 0,
    };
  }

  // Calculate momentum as rate of change in imbalance
  const recentImbalance = flowSeries.slice(-5).map(d => d.imbalance);
  const momentum = recentImbalance[recentImbalance.length - 1] - recentImbalance[0];

  let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (momentum > 0.1) {
    direction = 'bullish';
  } else if (momentum < -0.1) {
    direction = 'bearish';
  }

  // Calculate acceleration (second derivative)
  const midImbalance = recentImbalance[Math.floor(recentImbalance.length / 2)];
  const acceleration = (recentImbalance[recentImbalance.length - 1] - midImbalance) - (midImbalance - recentImbalance[0]);

  return {
    momentum,
    direction,
    acceleration,
  };
}

/**
 * Generate flow signal alerts
 */
export async function generateFlowSignalAlerts(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<Array<{
  signal: FlowSignal;
  alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
  action: string;
}>> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const signals = await FlowSignal.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    order: [['timestamp', 'DESC']],
    transaction,
  });

  return signals.map(signal => {
    let alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
    let action: string;

    if (signal.strength > 0.75 && signal.confidence > 0.7) {
      alertLevel = 'CRITICAL';
      action = `Strong ${signal.signalType} signal - consider immediate action`;
    } else if (signal.strength > 0.5 && signal.confidence > 0.5) {
      alertLevel = 'WARNING';
      action = `Moderate ${signal.signalType} signal - monitor closely`;
    } else {
      alertLevel = 'INFO';
      action = `Weak ${signal.signalType} signal - informational only`;
    }

    return {
      signal,
      alertLevel,
      action,
    };
  });
}

// ============================================================================
// DELTA ANALYSIS & FOOTPRINT CHARTING (Functions 36-43)
// ============================================================================

/**
 * Calculate delta by price level
 */
export async function calculateDeltaByPrice(
  securityId: string,
  priceLevel: number,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  delta: number;
  buyVolume: number;
  sellVolume: number;
  netPressure: number;
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
      price: priceLevel,
    },
    transaction,
  });

  let buyVolume = 0;
  let sellVolume = 0;

  events.forEach(event => {
    if (event.side === 'BUY') {
      buyVolume += Number(event.quantity);
    } else {
      sellVolume += Number(event.quantity);
    }
  });

  const delta = buyVolume - sellVolume;
  const totalVolume = buyVolume + sellVolume;
  const netPressure = totalVolume > 0 ? delta / totalVolume : 0;

  return {
    delta,
    buyVolume,
    sellVolume,
    netPressure,
  };
}

/**
 * Track cumulative delta over time
 */
export async function trackCumulativeDelta(
  securityId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<Array<{
  timestamp: Date;
  delta: number;
  cumulativeDelta: number;
  buyVolume: number;
  sellVolume: number;
}>> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  let cumulativeDelta = 0;
  const results: Array<{
    timestamp: Date;
    delta: number;
    cumulativeDelta: number;
    buyVolume: number;
    sellVolume: number;
  }> = [];

  events.forEach(event => {
    const quantity = Number(event.quantity);
    const delta = event.side === 'BUY' ? quantity : -quantity;
    cumulativeDelta += delta;

    results.push({
      timestamp: event.timestamp,
      delta,
      cumulativeDelta,
      buyVolume: event.side === 'BUY' ? quantity : 0,
      sellVolume: event.side === 'SELL' ? quantity : 0,
    });
  });

  return results;
}

/**
 * Generate volume profile
 */
export async function generateVolumeProfile(
  securityId: string,
  startTime: Date,
  endTime: Date,
  priceLevels: number,
  transaction?: Transaction
): Promise<{
  profile: Array<{
    priceLevel: number;
    totalVolume: number;
    buyVolume: number;
    sellVolume: number;
    delta: number;
  }>;
  pointOfControl: number;
  valueAreaHigh: number;
  valueAreaLow: number;
}> {
  const events = await OrderFlowEvent.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
    },
    transaction,
  });

  const minPrice = Math.min(...events.map(e => Number(e.price)));
  const maxPrice = Math.max(...events.map(e => Number(e.price)));
  const interval = (maxPrice - minPrice) / priceLevels;

  const volumeByLevel: Map<number, { buyVolume: number; sellVolume: number }> = new Map();

  events.forEach(event => {
    const levelIndex = Math.floor((Number(event.price) - minPrice) / interval);
    const priceLevel = minPrice + (levelIndex * interval);

    if (!volumeByLevel.has(priceLevel)) {
      volumeByLevel.set(priceLevel, { buyVolume: 0, sellVolume: 0 });
    }

    const level = volumeByLevel.get(priceLevel)!;
    if (event.side === 'BUY') {
      level.buyVolume += Number(event.quantity);
    } else {
      level.sellVolume += Number(event.quantity);
    }
  });

  const profile = Array.from(volumeByLevel.entries()).map(([priceLevel, volumes]) => ({
    priceLevel,
    totalVolume: volumes.buyVolume + volumes.sellVolume,
    buyVolume: volumes.buyVolume,
    sellVolume: volumes.sellVolume,
    delta: volumes.buyVolume - volumes.sellVolume,
  })).sort((a, b) => b.totalVolume - a.totalVolume);

  const pointOfControl = profile[0]?.priceLevel || 0;

  // Calculate value area (70% of volume)
  const totalVolume = profile.reduce((sum, p) => sum + p.totalVolume, 0);
  const valueAreaVolume = totalVolume * 0.7;
  let cumulativeVolume = 0;
  let valueAreaHigh = 0;
  let valueAreaLow = Infinity;

  for (const level of profile) {
    cumulativeVolume += level.totalVolume;
    valueAreaHigh = Math.max(valueAreaHigh, level.priceLevel);
    valueAreaLow = Math.min(valueAreaLow, level.priceLevel);

    if (cumulativeVolume >= valueAreaVolume) {
      break;
    }
  }

  return {
    profile,
    pointOfControl,
    valueAreaHigh,
    valueAreaLow,
  };
}

/**
 * Create footprint chart data
 */
export async function createFootprintChartData(
  securityId: string,
  startTime: Date,
  endTime: Date,
  priceLevels: number,
  transaction?: Transaction
): Promise<Array<FootprintData>> {
  const volumeProfile = await generateVolumeProfile(securityId, startTime, endTime, priceLevels, transaction);

  const footprintData: FootprintData[] = [];

  for (const level of volumeProfile.profile) {
    const data = await FootprintData.create(
      {
        securityId,
        timestamp: endTime,
        priceLevel: level.priceLevel,
        bidVolume: level.buyVolume,
        askVolume: level.sellVolume,
        bidTrades: 0, // Would need trade count data
        askTrades: 0,
        delta: level.delta,
        volumeProfile: level.totalVolume,
        isPointOfControl: level.priceLevel === volumeProfile.pointOfControl,
        isValueArea: level.priceLevel >= volumeProfile.valueAreaLow && level.priceLevel <= volumeProfile.valueAreaHigh,
        metadata: {},
      },
      { transaction }
    );

    footprintData.push(data);
  }

  return footprintData;
}

/**
 * Analyze cumulative delta divergence
 */
export async function analyzeCumulativeDeltaDivergence(
  securityId: string,
  priceData: Array<{ timestamp: Date; price: number }>,
  transaction?: Transaction
): Promise<{
  hasDivergence: boolean;
  type: 'bullish' | 'bearish' | 'none';
  strength: number;
}> {
  const deltaData = await trackCumulativeDelta(
    securityId,
    priceData[0].timestamp,
    priceData[priceData.length - 1].timestamp,
    transaction
  );

  if (deltaData.length < 2) {
    return {
      hasDivergence: false,
      type: 'none',
      strength: 0,
    };
  }

  const priceChange = priceData[priceData.length - 1].price - priceData[0].price;
  const deltaChange = deltaData[deltaData.length - 1].cumulativeDelta - deltaData[0].cumulativeDelta;

  const hasDivergence = (priceChange > 0 && deltaChange < 0) || (priceChange < 0 && deltaChange > 0);

  let type: 'bullish' | 'bearish' | 'none' = 'none';
  if (hasDivergence) {
    type = (priceChange < 0 && deltaChange > 0) ? 'bullish' : 'bearish';
  }

  const strength = Math.abs(priceChange * deltaChange) / 1000;

  return {
    hasDivergence,
    type,
    strength: Math.min(1, strength),
  };
}

/**
 * Identify delta clusters
 */
export async function identifyDeltaClusters(
  securityId: string,
  startTime: Date,
  endTime: Date,
  clusterThreshold: number,
  transaction?: Transaction
): Promise<Array<{
  priceLevel: number;
  clusterStrength: number;
  deltaSum: number;
  side: 'buy' | 'sell';
}>> {
  const deltaRecords = await CumulativeDelta.findAll({
    where: {
      securityId,
      timestamp: { [Op.between]: [startTime, endTime] },
    },
    order: [['price_level', 'ASC']],
    transaction,
  });

  const clusters: Array<{
    priceLevel: number;
    clusterStrength: number;
    deltaSum: number;
    side: 'buy' | 'sell';
  }> = [];

  deltaRecords.forEach(record => {
    const deltaSum = Number(record.delta);
    const clusterStrength = Math.abs(deltaSum);

    if (clusterStrength > clusterThreshold) {
      clusters.push({
        priceLevel: Number(record.priceLevel),
        clusterStrength,
        deltaSum,
        side: deltaSum > 0 ? 'buy' : 'sell',
      });
    }
  });

  return clusters.sort((a, b) => b.clusterStrength - a.clusterStrength);
}

/**
 * Calculate point of control (POC)
 */
export async function calculatePointOfControl(
  securityId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<{
  pocPrice: number;
  pocVolume: number;
  valueAreaHigh: number;
  valueAreaLow: number;
}> {
  const volumeProfile = await generateVolumeProfile(securityId, startTime, endTime, 50, transaction);

  return {
    pocPrice: volumeProfile.pointOfControl,
    pocVolume: volumeProfile.profile[0]?.totalVolume || 0,
    valueAreaHigh: volumeProfile.valueAreaHigh,
    valueAreaLow: volumeProfile.valueAreaLow,
  };
}

/**
 * Generate comprehensive order flow analytics dashboard
 */
export async function generateOrderFlowDashboard(
  securityId: string,
  timeWindow: number,
  transaction?: Transaction
): Promise<{
  orderFlowImbalance: any;
  orderBookPressure: any;
  aggressivePassiveRatio: any;
  largeOrders: any[];
  blockTrades: any;
  institutionalFlow: any;
  toxicity: any;
  volumeProfile: any;
  cumulativeDelta: any[];
  flowSignals: any[];
}> {
  const cutoffTime = new Date(Date.now() - timeWindow);

  const [
    orderFlowImbalance,
    aggressivePassiveRatio,
    largeOrders,
    blockTrades,
    institutionalFlow,
  ] = await Promise.all([
    calculateOrderFlowImbalance(securityId, timeWindow, transaction),
    trackAggressivePassiveRatio(securityId, timeWindow, transaction),
    detectLargeOrders(securityId, 100000, timeWindow, transaction),
    identifyBlockTrades(securityId, 500000, timeWindow, transaction),
    trackInstitutionalFlow(securityId, timeWindow, transaction),
  ]);

  const volumeProfile = await generateVolumeProfile(
    securityId,
    cutoffTime,
    new Date(),
    30,
    transaction
  );

  const cumulativeDelta = await trackCumulativeDelta(
    securityId,
    cutoffTime,
    new Date(),
    transaction
  );

  const flowSignals = await FlowSignal.findAll({
    where: {
      securityId,
      timestamp: { [Op.gte]: cutoffTime },
    },
    order: [['timestamp', 'DESC']],
    limit: 10,
    transaction,
  });

  return {
    orderFlowImbalance,
    orderBookPressure: {}, // Would require order book data
    aggressivePassiveRatio,
    largeOrders,
    blockTrades,
    institutionalFlow,
    toxicity: {}, // Would require current market data
    volumeProfile,
    cumulativeDelta,
    flowSignals,
  };
}

// ============================================================================
// EXPORT: Initialize all models
// ============================================================================

/**
 * Initialize all order flow analytics models
 */
export function initializeOrderFlowModels(sequelize: Sequelize): void {
  OrderFlowEvent.initModel(sequelize);
  CumulativeDelta.initModel(sequelize);
  FlowSignal.initModel(sequelize);
  FootprintData.initModel(sequelize);
}

/**
 * Default export with all functions
 */
export default {
  // Models
  OrderFlowEvent,
  CumulativeDelta,
  FlowSignal,
  FootprintData,
  initializeOrderFlowModels,

  // Order Flow Imbalance Analysis
  calculateOrderFlowImbalance,
  analyzeOrderBookPressure,
  trackOrderFlowTimeSeries,
  detectOrderFlowDivergence,
  calculateMicrostructureImbalance,
  generateOrderFlowReport,
  monitorFlowPressureShifts,

  // Aggressive vs Passive Flow Classification
  classifyOrderAggression,
  trackAggressivePassiveRatio,
  analyzeAggressiveFlowIntensity,
  detectPassiveOrderAbsorption,
  calculateTakerMakerRatio,
  identifyAggressiveFlowClusters,
  generateAggressionScoreMatrix,

  // Large Order & Block Trade Detection
  detectLargeOrders,
  identifyBlockTrades,
  trackBlockTradePatterns,
  calculateAverageBlockSize,
  detectIcebergOrders,
  monitorLargeOrderExecution,
  generateBlockTradeAlert,

  // Smart Money & Institutional Flow Tracking
  classifyTraderType,
  trackInstitutionalFlow,
  identifySmartMoneyAccumulation,
  compareRetailInstitutionalFlow,
  detectDarkPoolActivity,
  monitorHFTFlow,
  generateInstitutionalActivityReport,

  // Order Flow Toxicity & Signals
  calculateOrderFlowToxicity,
  generateFlowSignal,
  detectAccumulationDistribution,
  identifyOrderFlowExhaustion,
  detectSweepOrders,
  monitorOrderFlowMomentum,
  generateFlowSignalAlerts,

  // Delta Analysis & Footprint Charting
  calculateDeltaByPrice,
  trackCumulativeDelta,
  generateVolumeProfile,
  createFootprintChartData,
  analyzeCumulativeDeltaDivergence,
  identifyDeltaClusters,
  calculatePointOfControl,
  generateOrderFlowDashboard,
};

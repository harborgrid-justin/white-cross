/**
 * LOC: WC-COMP-TRADING-ALGO-001
 * File: /reuse/trading/composites/trading-algorithms-strategies-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../trading-algorithms-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal integration services
 *   - Algorithmic trading controllers
 *   - Execution management systems
 *   - Trading strategy services
 */

/**
 * File: /reuse/trading/composites/trading-algorithms-strategies-composite.ts
 * Locator: WC-COMP-TRADING-ALGO-001
 * Purpose: Bloomberg Terminal Algorithmic Trading Strategies Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, trading-algorithms-kit
 * Downstream: Bloomberg controllers, execution services, strategy engines, portfolio managers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 production-ready algorithmic trading functions with Sequelize models
 *
 * LLM Context: Enterprise-grade algorithmic trading composite for Bloomberg Terminal integration.
 * Provides TWAP, VWAP, POV, Implementation Shortfall, Arrival Price algorithms, dark pool routing,
 * smart order routing, pairs trading, statistical arbitrage, mean reversion strategies, market making,
 * iceberg orders, pegged orders, and comprehensive risk management. Designed for institutional
 * trading desks with Bloomberg Terminal connectivity.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  Optional,
} from 'sequelize';

// Import all functions from trading algorithms kit
import {
  // Type definitions
  Price,
  Quantity,
  BasisPoints,
  Timestamp,
  OrderSide,
  Order,
  Venue,
  Quote,
  Trade,
  Bar,
  OrderBook,
  TWAPParams,
  VWAPParams,
  POVParams,
  ImplementationShortfallParams,
  ArrivalPriceParams,
  ExecutionSlice,
  ExecutionSchedule,
  PairsTradingSignal,
  MarketMakingQuotes,
  // Branded type helpers
  asPrice,
  asQuantity,
  asBasisPoints,
  asTimestamp,
  // Execution algorithms
  calculateTWAPSlice,
  calculateVWAPSlice,
  calculatePOVSlice,
  calculateImplementationShortfall,
  calculateArrivalPrice,
  optimizeDarkPoolRouting,
  calculateSmartOrderRoute,
  estimateExecutionSchedule,
  // Statistical trading strategies
  calculatePairsTradingSignal,
  calculateCointegrationMetrics,
  calculateMeanReversionSignal,
  calculateZScore,
  calculateOrnsteinUhlenbeck,
  calculateMomentumSignal,
  calculateMovingAverageCrossover,
  calculateRSI,
  calculateBollingerBands,
  calculateATR,
  calculateMACD,
  calculateStochasticOscillator,
  // Market making
  calculateMarketMakingQuotes,
  calculateInventoryRisk,
  optimizeQuoteSpread,
  calculateLiquidityScore,
  estimateAdverseSelection,
  calculateQuotingProbability,
  optimizeOrderSize,
  calculateReservePrice,
  // Advanced execution
  calculateIcebergOrder,
  optimizeChildOrderTiming,
  calculateParticipationRate,
  estimateFillProbability,
  calculateUrgencyPremium,
  optimizeVenueAllocation,
  calculatePostOnlyStrategy,
  estimateQueuePosition,
  calculatePeggedOrder,
  optimizeExecutionHorizon,
  // Risk management
  calculateVaR,
  calculateExpectedShortfall,
  calculatePortfolioBeta,
  calculateCorrelationMatrix,
  estimateVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
} from '../trading-algorithms-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Algorithm types supported
 */
export enum AlgorithmType {
  TWAP = 'twap',
  VWAP = 'vwap',
  POV = 'pov',
  IMPLEMENTATION_SHORTFALL = 'implementation_shortfall',
  ARRIVAL_PRICE = 'arrival_price',
  ICEBERG = 'iceberg',
  SNIPER = 'sniper',
  PEGGED = 'pegged',
  DARK_LIQUIDITY_SEEKER = 'dark_liquidity_seeker',
  ADAPTIVE = 'adaptive',
}

/**
 * Strategy types
 */
export enum StrategyType {
  PAIRS_TRADING = 'pairs_trading',
  STATISTICAL_ARBITRAGE = 'statistical_arbitrage',
  MEAN_REVERSION = 'mean_reversion',
  MOMENTUM = 'momentum',
  MARKET_MAKING = 'market_making',
}

/**
 * Execution status
 */
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

/**
 * Risk level
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ============================================================================
// SEQUELIZE MODEL: AlgorithmExecution
// ============================================================================

/**
 * TypeScript interface for AlgorithmExecution attributes
 */
export interface AlgorithmExecutionAttributes {
  id: string;
  algorithmType: AlgorithmType;
  symbol: string;
  side: OrderSide;
  totalQuantity: number;
  executedQuantity: number;
  averagePrice: number | null;
  status: ExecutionStatus;
  parameters: Record<string, any>;
  startTime: Date;
  endTime: Date | null;
  executionSlices: Record<string, any>[];
  metrics: Record<string, any>;
  bloombergTerminalId: string | null;
  venueAllocations: Record<string, any>[];
  estimatedCost: number;
  actualCost: number | null;
  slippage: number | null;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AlgorithmExecutionCreationAttributes
  extends Optional<
    AlgorithmExecutionAttributes,
    'id' | 'executedQuantity' | 'averagePrice' | 'endTime' | 'actualCost' | 'slippage' | 'bloombergTerminalId' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: AlgorithmExecution
 * Tracks individual algorithm execution instances
 */
export class AlgorithmExecution
  extends Model<AlgorithmExecutionAttributes, AlgorithmExecutionCreationAttributes>
  implements AlgorithmExecutionAttributes
{
  @ApiProperty({ description: 'Unique execution ID' })
  declare id: string;

  @ApiProperty({ enum: AlgorithmType, description: 'Algorithm type' })
  declare algorithmType: AlgorithmType;

  @ApiProperty({ description: 'Trading symbol' })
  declare symbol: string;

  @ApiProperty({ enum: ['BUY', 'SELL'], description: 'Order side' })
  declare side: OrderSide;

  @ApiProperty({ description: 'Total quantity to execute' })
  declare totalQuantity: number;

  @ApiProperty({ description: 'Quantity executed so far' })
  declare executedQuantity: number;

  @ApiProperty({ description: 'Average execution price', nullable: true })
  declare averagePrice: number | null;

  @ApiProperty({ enum: ExecutionStatus, description: 'Execution status' })
  declare status: ExecutionStatus;

  @ApiProperty({ description: 'Algorithm parameters' })
  declare parameters: Record<string, any>;

  @ApiProperty({ description: 'Execution start time' })
  declare startTime: Date;

  @ApiProperty({ description: 'Execution end time', nullable: true })
  declare endTime: Date | null;

  @ApiProperty({ description: 'Execution slices schedule' })
  declare executionSlices: Record<string, any>[];

  @ApiProperty({ description: 'Execution metrics and statistics' })
  declare metrics: Record<string, any>;

  @ApiProperty({ description: 'Bloomberg Terminal ID', nullable: true })
  declare bloombergTerminalId: string | null;

  @ApiProperty({ description: 'Venue allocation details' })
  declare venueAllocations: Record<string, any>[];

  @ApiProperty({ description: 'Estimated execution cost in basis points' })
  declare estimatedCost: number;

  @ApiProperty({ description: 'Actual execution cost in basis points', nullable: true })
  declare actualCost: number | null;

  @ApiProperty({ description: 'Slippage in basis points', nullable: true })
  declare slippage: number | null;

  @ApiProperty({ description: 'Active status' })
  declare isActive: boolean;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize AlgorithmExecution with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof AlgorithmExecution {
    AlgorithmExecution.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        algorithmType: {
          type: DataTypes.ENUM(...Object.values(AlgorithmType)),
          allowNull: false,
          field: 'algorithm_type',
        },
        symbol: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'symbol',
        },
        side: {
          type: DataTypes.ENUM('BUY', 'SELL'),
          allowNull: false,
          field: 'side',
        },
        totalQuantity: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'total_quantity',
        },
        executedQuantity: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'executed_quantity',
        },
        averagePrice: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: true,
          field: 'average_price',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ExecutionStatus)),
          allowNull: false,
          defaultValue: ExecutionStatus.PENDING,
          field: 'status',
        },
        parameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'parameters',
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_time',
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'end_time',
        },
        executionSlices: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'execution_slices',
        },
        metrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metrics',
        },
        bloombergTerminalId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'bloomberg_terminal_id',
        },
        venueAllocations: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'venue_allocations',
        },
        estimatedCost: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'estimated_cost',
        },
        actualCost: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'actual_cost',
        },
        slippage: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
          field: 'slippage',
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
        tableName: 'algorithm_executions',
        modelName: 'AlgorithmExecution',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['symbol'] },
          { fields: ['algorithm_type'] },
          { fields: ['status'] },
          { fields: ['start_time'] },
          { fields: ['bloomberg_terminal_id'] },
          { fields: ['created_by'] },
        ],
      }
    );

    return AlgorithmExecution;
  }
}

// ============================================================================
// SEQUELIZE MODEL: TradingStrategy
// ============================================================================

/**
 * TypeScript interface for TradingStrategy attributes
 */
export interface TradingStrategyAttributes {
  id: string;
  name: string;
  description: string | null;
  strategyType: StrategyType;
  symbols: string[];
  parameters: Record<string, any>;
  riskLevel: RiskLevel;
  maxPositionSize: number;
  maxDrawdown: number;
  targetSharpeRatio: number;
  historicalPerformance: Record<string, any>;
  backtestResults: Record<string, any>;
  isActive: boolean;
  enabledVenues: string[];
  executionAlgorithm: AlgorithmType;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface TradingStrategyCreationAttributes
  extends Optional<TradingStrategyAttributes, 'id' | 'description' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: TradingStrategy
 * Trading strategy configurations
 */
export class TradingStrategy
  extends Model<TradingStrategyAttributes, TradingStrategyCreationAttributes>
  implements TradingStrategyAttributes
{
  @ApiProperty({ description: 'Unique strategy ID' })
  declare id: string;

  @ApiProperty({ description: 'Strategy name' })
  declare name: string;

  @ApiProperty({ description: 'Strategy description', nullable: true })
  declare description: string | null;

  @ApiProperty({ enum: StrategyType, description: 'Strategy type' })
  declare strategyType: StrategyType;

  @ApiProperty({ description: 'Trading symbols', type: [String] })
  declare symbols: string[];

  @ApiProperty({ description: 'Strategy parameters' })
  declare parameters: Record<string, any>;

  @ApiProperty({ enum: RiskLevel, description: 'Risk level' })
  declare riskLevel: RiskLevel;

  @ApiProperty({ description: 'Maximum position size' })
  declare maxPositionSize: number;

  @ApiProperty({ description: 'Maximum allowed drawdown' })
  declare maxDrawdown: number;

  @ApiProperty({ description: 'Target Sharpe ratio' })
  declare targetSharpeRatio: number;

  @ApiProperty({ description: 'Historical performance metrics' })
  declare historicalPerformance: Record<string, any>;

  @ApiProperty({ description: 'Backtest results' })
  declare backtestResults: Record<string, any>;

  @ApiProperty({ description: 'Active status' })
  declare isActive: boolean;

  @ApiProperty({ description: 'Enabled trading venues', type: [String] })
  declare enabledVenues: string[];

  @ApiProperty({ enum: AlgorithmType, description: 'Execution algorithm' })
  declare executionAlgorithm: AlgorithmType;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize TradingStrategy with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof TradingStrategy {
    TradingStrategy.init(
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
        strategyType: {
          type: DataTypes.ENUM(...Object.values(StrategyType)),
          allowNull: false,
          field: 'strategy_type',
        },
        symbols: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'symbols',
        },
        parameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'parameters',
        },
        riskLevel: {
          type: DataTypes.ENUM(...Object.values(RiskLevel)),
          allowNull: false,
          field: 'risk_level',
        },
        maxPositionSize: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'max_position_size',
        },
        maxDrawdown: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'max_drawdown',
        },
        targetSharpeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'target_sharpe_ratio',
        },
        historicalPerformance: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'historical_performance',
        },
        backtestResults: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'backtest_results',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        enabledVenues: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'enabled_venues',
        },
        executionAlgorithm: {
          type: DataTypes.ENUM(...Object.values(AlgorithmType)),
          allowNull: false,
          field: 'execution_algorithm',
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
        tableName: 'trading_strategies',
        modelName: 'TradingStrategy',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['strategy_type'] },
          { fields: ['risk_level'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return TradingStrategy;
  }
}

// ============================================================================
// SEQUELIZE MODEL: ExecutionMetrics
// ============================================================================

/**
 * TypeScript interface for ExecutionMetrics attributes
 */
export interface ExecutionMetricsAttributes {
  id: string;
  executionId: string;
  timestamp: Date;
  fillQuantity: number;
  fillPrice: number;
  venue: string;
  latencyMs: number;
  slippageBps: number;
  impactBps: number;
  participationRate: number | null;
  spreadAtExecution: number;
  volatilityAtExecution: number;
  orderBookImbalance: number | null;
  isLiquidityTaking: boolean;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExecutionMetricsCreationAttributes
  extends Optional<ExecutionMetricsAttributes, 'id' | 'participationRate' | 'orderBookImbalance'> {}

/**
 * Sequelize Model: ExecutionMetrics
 * Detailed execution metrics for analysis
 */
export class ExecutionMetrics
  extends Model<ExecutionMetricsAttributes, ExecutionMetricsCreationAttributes>
  implements ExecutionMetricsAttributes
{
  @ApiProperty({ description: 'Unique metrics ID' })
  declare id: string;

  @ApiProperty({ description: 'Associated execution ID' })
  declare executionId: string;

  @ApiProperty({ description: 'Metric timestamp' })
  declare timestamp: Date;

  @ApiProperty({ description: 'Fill quantity' })
  declare fillQuantity: number;

  @ApiProperty({ description: 'Fill price' })
  declare fillPrice: number;

  @ApiProperty({ description: 'Execution venue' })
  declare venue: string;

  @ApiProperty({ description: 'Execution latency in milliseconds' })
  declare latencyMs: number;

  @ApiProperty({ description: 'Slippage in basis points' })
  declare slippageBps: number;

  @ApiProperty({ description: 'Market impact in basis points' })
  declare impactBps: number;

  @ApiProperty({ description: 'Participation rate', nullable: true })
  declare participationRate: number | null;

  @ApiProperty({ description: 'Spread at execution time' })
  declare spreadAtExecution: number;

  @ApiProperty({ description: 'Volatility at execution time' })
  declare volatilityAtExecution: number;

  @ApiProperty({ description: 'Order book imbalance', nullable: true })
  declare orderBookImbalance: number | null;

  @ApiProperty({ description: 'Whether order took liquidity' })
  declare isLiquidityTaking: boolean;

  @ApiProperty({ description: 'Additional metrics metadata' })
  declare metadata: Record<string, any>;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize ExecutionMetrics with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof ExecutionMetrics {
    ExecutionMetrics.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        executionId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'algorithm_executions',
            key: 'id',
          },
          field: 'execution_id',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        fillQuantity: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'fill_quantity',
        },
        fillPrice: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'fill_price',
        },
        venue: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'venue',
        },
        latencyMs: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'latency_ms',
        },
        slippageBps: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'slippage_bps',
        },
        impactBps: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'impact_bps',
        },
        participationRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'participation_rate',
        },
        spreadAtExecution: {
          type: DataTypes.DECIMAL(20, 6),
          allowNull: false,
          field: 'spread_at_execution',
        },
        volatilityAtExecution: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'volatility_at_execution',
        },
        orderBookImbalance: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: true,
          field: 'order_book_imbalance',
        },
        isLiquidityTaking: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_liquidity_taking',
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
        tableName: 'execution_metrics',
        modelName: 'ExecutionMetrics',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['execution_id'] },
          { fields: ['timestamp'] },
          { fields: ['venue'] },
        ],
      }
    );

    return ExecutionMetrics;
  }
}

// ============================================================================
// SEQUELIZE MODEL: AlgorithmParameter
// ============================================================================

/**
 * TypeScript interface for AlgorithmParameter attributes
 */
export interface AlgorithmParameterAttributes {
  id: string;
  algorithmType: AlgorithmType;
  parameterName: string;
  parameterValue: Record<string, any>;
  description: string | null;
  isDefault: boolean;
  validationRules: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AlgorithmParameterCreationAttributes
  extends Optional<AlgorithmParameterAttributes, 'id' | 'description' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: AlgorithmParameter
 * Algorithm parameter templates
 */
export class AlgorithmParameter
  extends Model<AlgorithmParameterAttributes, AlgorithmParameterCreationAttributes>
  implements AlgorithmParameterAttributes
{
  @ApiProperty({ description: 'Unique parameter ID' })
  declare id: string;

  @ApiProperty({ enum: AlgorithmType, description: 'Algorithm type' })
  declare algorithmType: AlgorithmType;

  @ApiProperty({ description: 'Parameter name' })
  declare parameterName: string;

  @ApiProperty({ description: 'Parameter value configuration' })
  declare parameterValue: Record<string, any>;

  @ApiProperty({ description: 'Parameter description', nullable: true })
  declare description: string | null;

  @ApiProperty({ description: 'Is default parameter set' })
  declare isDefault: boolean;

  @ApiProperty({ description: 'Validation rules' })
  declare validationRules: Record<string, any>;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize AlgorithmParameter with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof AlgorithmParameter {
    AlgorithmParameter.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        algorithmType: {
          type: DataTypes.ENUM(...Object.values(AlgorithmType)),
          allowNull: false,
          field: 'algorithm_type',
        },
        parameterName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'parameter_name',
        },
        parameterValue: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'parameter_value',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_default',
        },
        validationRules: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'validation_rules',
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
        tableName: 'algorithm_parameters',
        modelName: 'AlgorithmParameter',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['algorithm_type'] },
          { fields: ['parameter_name'] },
          { fields: ['is_default'] },
          { unique: true, fields: ['algorithm_type', 'parameter_name'], where: { is_default: true } },
        ],
      }
    );

    return AlgorithmParameter;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineAlgorithmAssociations(): void {
  AlgorithmExecution.hasMany(ExecutionMetrics, {
    foreignKey: 'executionId',
    as: 'metrics',
    onDelete: 'CASCADE',
  });

  ExecutionMetrics.belongsTo(AlgorithmExecution, {
    foreignKey: 'executionId',
    as: 'execution',
  });
}

// ============================================================================
// INJECTABLE SERVICE
// ============================================================================

@ApiTags('Trading Algorithms')
@Injectable()
export class TradingAlgorithmsService {
  private readonly logger = new Logger(TradingAlgorithmsService.name);

  // Re-export all kit functions for easy access
  public readonly algorithms = {
    calculateTWAPSlice,
    calculateVWAPSlice,
    calculatePOVSlice,
    calculateImplementationShortfall,
    calculateArrivalPrice,
    optimizeDarkPoolRouting,
    calculateSmartOrderRoute,
    estimateExecutionSchedule,
  };

  public readonly strategies = {
    calculatePairsTradingSignal,
    calculateCointegrationMetrics,
    calculateMeanReversionSignal,
    calculateZScore,
    calculateOrnsteinUhlenbeck,
    calculateMomentumSignal,
    calculateMovingAverageCrossover,
    calculateRSI,
    calculateBollingerBands,
    calculateATR,
    calculateMACD,
    calculateStochasticOscillator,
  };

  public readonly marketMaking = {
    calculateMarketMakingQuotes,
    calculateInventoryRisk,
    optimizeQuoteSpread,
    calculateLiquidityScore,
    estimateAdverseSelection,
    calculateQuotingProbability,
    optimizeOrderSize,
    calculateReservePrice,
  };

  public readonly execution = {
    calculateIcebergOrder,
    optimizeChildOrderTiming,
    calculateParticipationRate,
    estimateFillProbability,
    calculateUrgencyPremium,
    optimizeVenueAllocation,
    calculatePostOnlyStrategy,
    estimateQueuePosition,
    calculatePeggedOrder,
    optimizeExecutionHorizon,
  };

  public readonly risk = {
    calculateVaR,
    calculateExpectedShortfall,
    calculatePortfolioBeta,
    calculateCorrelationMatrix,
    estimateVolatility,
    calculateSharpeRatio,
    calculateMaxDrawdown,
  };

  public readonly helpers = {
    asPrice,
    asQuantity,
    asBasisPoints,
    asTimestamp,
  };
}

// ============================================================================
// ALGORITHM EXECUTION FUNCTIONS
// ============================================================================

/**
 * Create algorithm execution record
 */
export async function createAlgorithmExecution(
  data: AlgorithmExecutionCreationAttributes,
  transaction?: Transaction
): Promise<AlgorithmExecution> {
  return await AlgorithmExecution.create(data, { transaction });
}

/**
 * Create TWAP execution
 */
export async function createTWAPExecution(
  symbol: string,
  side: OrderSide,
  totalQuantity: number,
  startTime: Date,
  endTime: Date,
  numberOfSlices: number,
  createdBy: string,
  bloombergTerminalId?: string,
  transaction?: Transaction
): Promise<AlgorithmExecution> {
  const params: TWAPParams = {
    symbol,
    side,
    totalQuantity: asQuantity(totalQuantity),
    startTime: asTimestamp(startTime.getTime()),
    endTime: asTimestamp(endTime.getTime()),
    numberOfSlices,
  };

  const schedule = calculateTWAPSlice(params);

  return await AlgorithmExecution.create(
    {
      algorithmType: AlgorithmType.TWAP,
      symbol,
      side,
      totalQuantity,
      executedQuantity: 0,
      status: ExecutionStatus.PENDING,
      parameters: params,
      startTime,
      executionSlices: schedule.slices,
      metrics: {
        estimatedDuration: schedule.estimatedDuration,
        numberOfSlices: schedule.slices.length,
      },
      bloombergTerminalId: bloombergTerminalId || null,
      venueAllocations: [],
      estimatedCost: schedule.estimatedCost,
      isActive: true,
      metadata: { algorithm: 'TWAP' },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create VWAP execution
 */
export async function createVWAPExecution(
  symbol: string,
  side: OrderSide,
  totalQuantity: number,
  startTime: Date,
  endTime: Date,
  historicalVolume: number[],
  createdBy: string,
  bloombergTerminalId?: string,
  transaction?: Transaction
): Promise<AlgorithmExecution> {
  const params: VWAPParams = {
    symbol,
    side,
    totalQuantity: asQuantity(totalQuantity),
    startTime: asTimestamp(startTime.getTime()),
    endTime: asTimestamp(endTime.getTime()),
    historicalVolume,
  };

  const schedule = calculateVWAPSlice(params);

  return await AlgorithmExecution.create(
    {
      algorithmType: AlgorithmType.VWAP,
      symbol,
      side,
      totalQuantity,
      executedQuantity: 0,
      status: ExecutionStatus.PENDING,
      parameters: params,
      startTime,
      executionSlices: schedule.slices,
      metrics: {
        estimatedDuration: schedule.estimatedDuration,
        numberOfSlices: schedule.slices.length,
        volumeProfile: historicalVolume,
      },
      bloombergTerminalId: bloombergTerminalId || null,
      venueAllocations: [],
      estimatedCost: schedule.estimatedCost,
      isActive: true,
      metadata: { algorithm: 'VWAP' },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get algorithm execution by ID
 */
export async function getAlgorithmExecutionById(
  id: string,
  transaction?: Transaction
): Promise<AlgorithmExecution | null> {
  return await AlgorithmExecution.findByPk(id, {
    include: ['metrics'],
    transaction,
  });
}

/**
 * Get active executions by symbol
 */
export async function getActiveExecutionsBySymbol(
  symbol: string,
  transaction?: Transaction
): Promise<AlgorithmExecution[]> {
  return await AlgorithmExecution.findAll({
    where: {
      symbol,
      status: {
        [Op.in]: [ExecutionStatus.PENDING, ExecutionStatus.RUNNING],
      },
      isActive: true,
    },
    transaction,
  });
}

/**
 * Update execution status
 */
export async function updateExecutionStatus(
  id: string,
  status: ExecutionStatus,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, AlgorithmExecution[]]> {
  const updates: Partial<AlgorithmExecutionAttributes> = {
    status,
    updatedBy,
  };

  if (status === ExecutionStatus.COMPLETED || status === ExecutionStatus.CANCELLED || status === ExecutionStatus.FAILED) {
    updates.endTime = new Date();
  }

  return await AlgorithmExecution.update(updates, {
    where: { id },
    returning: true,
    transaction,
  });
}

/**
 * Record execution fill
 */
export async function recordExecutionFill(
  executionId: string,
  fillQuantity: number,
  fillPrice: number,
  venue: string,
  latencyMs: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<AlgorithmExecution | null> {
  const execution = await AlgorithmExecution.findByPk(executionId, { transaction });
  if (!execution) return null;

  const newExecutedQuantity = Number(execution.executedQuantity) + fillQuantity;
  const currentAvgPrice = execution.averagePrice || 0;
  const currentExecutedQty = Number(execution.executedQuantity);

  // Calculate new average price
  const newAvgPrice =
    currentExecutedQty > 0
      ? (currentAvgPrice * currentExecutedQty + fillPrice * fillQuantity) / newExecutedQuantity
      : fillPrice;

  await execution.update(
    {
      executedQuantity: newExecutedQuantity,
      averagePrice: newAvgPrice,
      updatedBy,
    },
    { transaction }
  );

  return execution;
}

// ============================================================================
// TRADING STRATEGY FUNCTIONS
// ============================================================================

/**
 * Create trading strategy
 */
export async function createTradingStrategy(
  data: TradingStrategyCreationAttributes,
  transaction?: Transaction
): Promise<TradingStrategy> {
  return await TradingStrategy.create(data, { transaction });
}

/**
 * Create pairs trading strategy
 */
export async function createPairsTradingStrategy(
  name: string,
  symbol1: string,
  symbol2: string,
  hedgeRatio: number,
  entryThreshold: number,
  exitThreshold: number,
  maxPositionSize: number,
  createdBy: string,
  transaction?: Transaction
): Promise<TradingStrategy> {
  return await TradingStrategy.create(
    {
      name,
      strategyType: StrategyType.PAIRS_TRADING,
      symbols: [symbol1, symbol2],
      parameters: {
        symbol1,
        symbol2,
        hedgeRatio,
        entryThreshold,
        exitThreshold,
      },
      riskLevel: RiskLevel.MEDIUM,
      maxPositionSize,
      maxDrawdown: 0.15,
      targetSharpeRatio: 1.5,
      historicalPerformance: {},
      backtestResults: {},
      isActive: true,
      enabledVenues: ['NYSE', 'NASDAQ', 'ARCA'],
      executionAlgorithm: AlgorithmType.TWAP,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get strategy by ID
 */
export async function getStrategyById(
  id: string,
  transaction?: Transaction
): Promise<TradingStrategy | null> {
  return await TradingStrategy.findByPk(id, { transaction });
}

/**
 * Get strategies by type
 */
export async function getStrategiesByType(
  strategyType: StrategyType,
  transaction?: Transaction
): Promise<TradingStrategy[]> {
  return await TradingStrategy.findAll({
    where: { strategyType, isActive: true },
    transaction,
  });
}

/**
 * Update strategy performance
 */
export async function updateStrategyPerformance(
  id: string,
  performanceMetrics: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, TradingStrategy[]]> {
  return await TradingStrategy.update(
    {
      historicalPerformance: performanceMetrics,
      updatedBy,
    },
    { where: { id }, returning: true, transaction }
  );
}

// ============================================================================
// EXECUTION METRICS FUNCTIONS
// ============================================================================

/**
 * Create execution metrics record
 */
export async function createExecutionMetrics(
  data: ExecutionMetricsCreationAttributes,
  transaction?: Transaction
): Promise<ExecutionMetrics> {
  return await ExecutionMetrics.create(data, { transaction });
}

/**
 * Get metrics by execution ID
 */
export async function getMetricsByExecutionId(
  executionId: string,
  transaction?: Transaction
): Promise<ExecutionMetrics[]> {
  return await ExecutionMetrics.findAll({
    where: { executionId },
    order: [['timestamp', 'ASC']],
    transaction,
  });
}

/**
 * Calculate execution quality score
 */
export async function calculateExecutionQuality(
  executionId: string,
  transaction?: Transaction
): Promise<{
  avgSlippage: number;
  avgImpact: number;
  totalLatency: number;
  liquidityTakingRatio: number;
  qualityScore: number;
}> {
  const metrics = await getMetricsByExecutionId(executionId, transaction);

  if (metrics.length === 0) {
    return {
      avgSlippage: 0,
      avgImpact: 0,
      totalLatency: 0,
      liquidityTakingRatio: 0,
      qualityScore: 0,
    };
  }

  const avgSlippage = metrics.reduce((sum, m) => sum + Number(m.slippageBps), 0) / metrics.length;
  const avgImpact = metrics.reduce((sum, m) => sum + Number(m.impactBps), 0) / metrics.length;
  const totalLatency = metrics.reduce((sum, m) => sum + m.latencyMs, 0);
  const liquidityTakingCount = metrics.filter((m) => m.isLiquidityTaking).length;
  const liquidityTakingRatio = liquidityTakingCount / metrics.length;

  // Quality score: lower is better (lower slippage, impact, latency)
  const qualityScore = 100 - (avgSlippage + avgImpact) / 2 - totalLatency / 1000;

  return {
    avgSlippage,
    avgImpact,
    totalLatency,
    liquidityTakingRatio,
    qualityScore: Math.max(0, qualityScore),
  };
}

// ============================================================================
// ALGORITHM PARAMETER FUNCTIONS
// ============================================================================

/**
 * Create algorithm parameter
 */
export async function createAlgorithmParameter(
  data: AlgorithmParameterCreationAttributes,
  transaction?: Transaction
): Promise<AlgorithmParameter> {
  return await AlgorithmParameter.create(data, { transaction });
}

/**
 * Get default parameters for algorithm
 */
export async function getDefaultParameters(
  algorithmType: AlgorithmType,
  transaction?: Transaction
): Promise<AlgorithmParameter | null> {
  return await AlgorithmParameter.findOne({
    where: {
      algorithmType,
      isDefault: true,
    },
    transaction,
  });
}

/**
 * Get all parameters for algorithm type
 */
export async function getParametersByAlgorithm(
  algorithmType: AlgorithmType,
  transaction?: Transaction
): Promise<AlgorithmParameter[]> {
  return await AlgorithmParameter.findAll({
    where: { algorithmType },
    transaction,
  });
}

// ============================================================================
// ADVANCED COMPOSITE FUNCTIONS
// ============================================================================

/**
 * Execute complete TWAP strategy with venues
 */
export async function executeTWAPWithVenues(
  symbol: string,
  side: OrderSide,
  totalQuantity: number,
  startTime: Date,
  endTime: Date,
  numberOfSlices: number,
  venues: Venue[],
  liquidityEstimates: Quantity[],
  createdBy: string,
  transaction?: Transaction
): Promise<AlgorithmExecution> {
  const execution = await createTWAPExecution(
    symbol,
    side,
    totalQuantity,
    startTime,
    endTime,
    numberOfSlices,
    createdBy,
    undefined,
    transaction
  );

  // Calculate venue allocations
  const venueAllocations = optimizeVenueAllocation(
    asQuantity(totalQuantity),
    venues,
    liquidityEstimates,
    venues.map((v) => v.fees)
  );

  await execution.update(
    {
      venueAllocations: venueAllocations.map((va) => ({
        venue: va.venue,
        quantity: va.quantity,
        cost: va.cost,
      })),
    },
    { transaction }
  );

  return execution;
}

/**
 * Generate pairs trading signals for portfolio
 */
export async function generatePairsTradingSignals(
  pairs: Array<{
    symbol1: string;
    symbol2: string;
    price1: Price;
    price2: Price;
    hedgeRatio: number;
    spreadMean: number;
    spreadStd: number;
  }>,
  entryThreshold: number = 2.0
): Promise<PairsTradingSignal[]> {
  return pairs.map((pair) =>
    calculatePairsTradingSignal(
      pair.symbol1,
      pair.symbol2,
      pair.price1,
      pair.price2,
      pair.hedgeRatio,
      pair.spreadMean,
      pair.spreadStd,
      entryThreshold
    )
  );
}

/**
 * Calculate portfolio risk metrics
 */
export async function calculatePortfolioRiskMetrics(
  returns: number[],
  benchmarkReturns: number[],
  confidence: number = 0.95
): Promise<{
  var: number;
  expectedShortfall: number;
  beta: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}> {
  const cumulativeReturns = returns.reduce((acc: number[], r, i) => {
    const prev = i > 0 ? acc[i - 1] : 1;
    acc.push(prev * (1 + r));
    return acc;
  }, []);

  return {
    var: calculateVaR(returns, confidence),
    expectedShortfall: calculateExpectedShortfall(returns, confidence),
    beta: calculatePortfolioBeta(returns, benchmarkReturns),
    volatility: estimateVolatility(returns),
    sharpeRatio: calculateSharpeRatio(returns),
    maxDrawdown: calculateMaxDrawdown(cumulativeReturns),
  };
}

/**
 * Optimize iceberg execution with market making
 */
export async function optimizeIcebergWithMarketMaking(
  totalQuantity: Quantity,
  midPrice: Price,
  inventoryPosition: Quantity,
  inventoryLimit: Quantity,
  targetSpread: BasisPoints,
  visibleRatio: number,
  numberOfRefills: number
): Promise<{
  icebergSlices: Array<{ visible: Quantity; hidden: Quantity }>;
  marketMakingQuotes: MarketMakingQuotes;
  reservePrice: Price;
}> {
  const icebergSlices = calculateIcebergOrder(totalQuantity, visibleRatio, numberOfRefills);

  const mmQuotes = calculateMarketMakingQuotes(
    midPrice,
    inventoryPosition,
    targetSpread,
    inventoryLimit,
    asQuantity(totalQuantity / numberOfRefills)
  );

  const estimatedImpact = asBasisPoints(20); // Example impact estimate
  const reservePrice = calculateReservePrice(midPrice, 'BUY', estimatedImpact, 0.5);

  return {
    icebergSlices,
    marketMakingQuotes: mmQuotes,
    reservePrice,
  };
}

/**
 * Calculate adaptive execution schedule
 */
export async function calculateAdaptiveExecution(
  symbol: string,
  side: OrderSide,
  totalQuantity: number,
  currentPrice: Price,
  volatility: number,
  marketVolume: Quantity,
  urgency: number
): Promise<ExecutionSchedule> {
  // Determine optimal execution horizon
  const horizon = optimizeExecutionHorizon(
    asQuantity(totalQuantity),
    asQuantity(marketVolume * 252), // Approximate ADV
    urgency,
    volatility
  );

  // Calculate participation rate
  const participationRate = calculateParticipationRate(
    asQuantity(totalQuantity),
    marketVolume,
    horizon,
    urgency
  );

  // Generate POV-style execution
  const povParams: POVParams = {
    symbol,
    side,
    totalQuantity: asQuantity(totalQuantity),
    targetParticipationRate: participationRate,
    minParticipationRate: participationRate * 0.5,
    maxParticipationRate: Math.min(0.4, participationRate * 1.5),
  };

  return calculatePOVSlice(povParams);
}

/**
 * Generate execution report
 */
export async function generateExecutionReport(
  executionId: string,
  transaction?: Transaction
): Promise<{
  execution: AlgorithmExecution;
  metrics: ExecutionMetrics[];
  qualityScore: {
    avgSlippage: number;
    avgImpact: number;
    totalLatency: number;
    liquidityTakingRatio: number;
    qualityScore: number;
  };
  costAnalysis: {
    estimatedCost: number;
    actualCost: number;
    variance: number;
  };
}> {
  const execution = await getAlgorithmExecutionById(executionId, transaction);
  if (!execution) {
    throw new Error(`Execution ${executionId} not found`);
  }

  const metrics = await getMetricsByExecutionId(executionId, transaction);
  const qualityScore = await calculateExecutionQuality(executionId, transaction);

  const actualCost = Number(execution.actualCost || 0);
  const estimatedCost = Number(execution.estimatedCost);

  return {
    execution,
    metrics,
    qualityScore,
    costAnalysis: {
      estimatedCost,
      actualCost,
      variance: actualCost - estimatedCost,
    },
  };
}

/**
 * Initialize all models
 */
export function initializeTradingAlgorithmModels(sequelize: Sequelize): void {
  AlgorithmExecution.initModel(sequelize);
  TradingStrategy.initModel(sequelize);
  ExecutionMetrics.initModel(sequelize);
  AlgorithmParameter.initModel(sequelize);
  defineAlgorithmAssociations();
}

// ============================================================================
// RE-EXPORT ALL ALGORITHM KIT FUNCTIONS
// ============================================================================

export {
  // Types
  Price,
  Quantity,
  BasisPoints,
  Timestamp,
  OrderSide,
  Order,
  Venue,
  Quote,
  Trade,
  Bar,
  OrderBook,
  TWAPParams,
  VWAPParams,
  POVParams,
  ImplementationShortfallParams,
  ArrivalPriceParams,
  ExecutionSlice,
  ExecutionSchedule,
  PairsTradingSignal,
  MarketMakingQuotes,
  // Helpers
  asPrice,
  asQuantity,
  asBasisPoints,
  asTimestamp,
  // Execution Algorithms
  calculateTWAPSlice,
  calculateVWAPSlice,
  calculatePOVSlice,
  calculateImplementationShortfall,
  calculateArrivalPrice,
  optimizeDarkPoolRouting,
  calculateSmartOrderRoute,
  estimateExecutionSchedule,
  // Statistical Strategies
  calculatePairsTradingSignal,
  calculateCointegrationMetrics,
  calculateMeanReversionSignal,
  calculateZScore,
  calculateOrnsteinUhlenbeck,
  calculateMomentumSignal,
  calculateMovingAverageCrossover,
  calculateRSI,
  calculateBollingerBands,
  calculateATR,
  calculateMACD,
  calculateStochasticOscillator,
  // Market Making
  calculateMarketMakingQuotes,
  calculateInventoryRisk,
  optimizeQuoteSpread,
  calculateLiquidityScore,
  estimateAdverseSelection,
  calculateQuotingProbability,
  optimizeOrderSize,
  calculateReservePrice,
  // Advanced Execution
  calculateIcebergOrder,
  optimizeChildOrderTiming,
  calculateParticipationRate,
  estimateFillProbability,
  calculateUrgencyPremium,
  optimizeVenueAllocation,
  calculatePostOnlyStrategy,
  estimateQueuePosition,
  calculatePeggedOrder,
  optimizeExecutionHorizon,
  // Risk Management
  calculateVaR,
  calculateExpectedShortfall,
  calculatePortfolioBeta,
  calculateCorrelationMatrix,
  estimateVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
};

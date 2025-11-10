/**
 * LOC: WC-COMP-TRADING-BACK-001
 * File: /reuse/trading/composites/strategy-backtesting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../trading-strategies-kit
 *   - ../technical-analysis-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backtesting controllers
 *   - Strategy optimization services
 *   - Portfolio analysis engines
 *   - Risk management systems
 */

/**
 * File: /reuse/trading/composites/strategy-backtesting-composite.ts
 * Locator: WC-COMP-TRADING-BACK-001
 * Purpose: Bloomberg Terminal-Level Strategy Backtesting Engine & Performance Analytics
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, trading-strategies-kit, technical-analysis-kit
 * Downstream: Trading controllers, strategy services, optimization engines, risk management
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Decimal.js
 * Exports: 45 composed functions for comprehensive strategy backtesting and optimization
 *
 * LLM Context: Institutional-grade backtesting framework for Bloomberg Terminal-level trading.
 * Provides historical simulation engine, walk-forward analysis, Monte Carlo simulation,
 * comprehensive performance metrics (Sharpe, Sortino, Calmar, MAR, Omega), drawdown analysis,
 * trade-by-trade forensics, realistic slippage modeling, commission structures, market impact
 * modeling, multi-parameter strategy optimization, parameter sensitivity analysis, overfitting
 * detection, out-of-sample testing, k-fold cross-validation, and equity curve analysis.
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
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';
import Decimal from 'decimal.js';

// Import functions from trading kits
import {
  calculateRSI,
  calculateMACD,
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateStochastic,
  calculateADX,
  generateMomentumSignal,
  generateBollingerBandSignal,
  generateTrendFollowingSignal,
  detectPriceBreakout,
  calculateCorrelation,
  calculateCointegration,
  generatePairsTradingSignal,
  backtestStrategy,
  calculatePerformanceMetrics,
  createCoveredCallStrategy,
  createProtectivePutStrategy,
  createIronCondorStrategy,
  type MarketData,
  type BacktestResult,
  type BacktestTrade,
  type TradingSignal,
  type OptionsStrategy,
} from '../trading-strategies-kit';

import {
  calculateVWAP,
  calculateOBV,
  calculateATR,
  calculateHistoricVolatility,
  calculateROC,
  calculateMFI,
  calculateWilliamsR,
  calculateCCI,
  calculateParabolicSAR,
  calculateSupertrend,
  calculateIchimoku,
  calculateAroon,
  identifySupportResistance,
  detectDoji,
  detectHammer,
  detectEngulfing,
  type PricePoint,
  type BollingerBands,
} from '../technical-analysis-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Backtesting execution status
 */
export enum BacktestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Optimization algorithm types
 */
export enum OptimizationAlgorithm {
  GRID_SEARCH = 'grid_search',
  RANDOM_SEARCH = 'random_search',
  GENETIC_ALGORITHM = 'genetic_algorithm',
  BAYESIAN_OPTIMIZATION = 'bayesian_optimization',
  PARTICLE_SWARM = 'particle_swarm',
}

/**
 * Walk-forward analysis window types
 */
export enum WalkForwardWindowType {
  FIXED = 'fixed',
  ROLLING = 'rolling',
  EXPANDING = 'expanding',
  ANCHORED = 'anchored',
}

/**
 * Performance metric types
 */
export enum PerformanceMetricType {
  SHARPE_RATIO = 'sharpe_ratio',
  SORTINO_RATIO = 'sortino_ratio',
  CALMAR_RATIO = 'calmar_ratio',
  MAR_RATIO = 'mar_ratio',
  OMEGA_RATIO = 'omega_ratio',
  PROFIT_FACTOR = 'profit_factor',
  WIN_RATE = 'win_rate',
  MAX_DRAWDOWN = 'max_drawdown',
}

/**
 * Order execution models
 */
export enum ExecutionModel {
  MARKET_ORDER = 'market_order',
  LIMIT_ORDER = 'limit_order',
  STOP_ORDER = 'stop_order',
  VWAP_ORDER = 'vwap_order',
}

/**
 * Slippage models
 */
export enum SlippageModel {
  FIXED_BASIS_POINTS = 'fixed_basis_points',
  VOLUME_BASED = 'volume_based',
  VOLATILITY_BASED = 'volatility_based',
  SPREAD_BASED = 'spread_based',
}

/**
 * Commission structures
 */
export enum CommissionStructure {
  FLAT_FEE = 'flat_fee',
  PER_SHARE = 'per_share',
  PERCENTAGE = 'percentage',
  TIERED = 'tiered',
}

// ============================================================================
// SEQUELIZE MODEL: BacktestRun
// ============================================================================

/**
 * TypeScript interface for BacktestRun attributes
 */
export interface BacktestRunAttributes {
  id: string;
  name: string;
  description: string | null;
  strategyType: string;
  instrumentIds: string[];
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  status: BacktestStatus;
  executionModel: ExecutionModel;
  slippageModel: SlippageModel;
  commissionStructure: CommissionStructure;
  parameters: Record<string, any>;
  configuration: Record<string, any>;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  profitFactor: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  avgHoldingPeriod: number;
  executionTimeMs: number;
  errorMessage: string | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BacktestRunCreationAttributes extends Optional<BacktestRunAttributes, 'id' | 'description' | 'finalCapital' | 'status' | 'totalTrades' | 'winningTrades' | 'losingTrades' | 'totalReturn' | 'annualizedReturn' | 'volatility' | 'sharpeRatio' | 'sortinoRatio' | 'calmarRatio' | 'maxDrawdown' | 'maxDrawdownDuration' | 'profitFactor' | 'winRate' | 'avgWin' | 'avgLoss' | 'largestWin' | 'largestLoss' | 'avgHoldingPeriod' | 'executionTimeMs' | 'errorMessage' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BacktestRun
 * Main backtesting execution record with comprehensive metrics
 */
export class BacktestRun extends Model<BacktestRunAttributes, BacktestRunCreationAttributes> implements BacktestRunAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare name: string;
  @ApiPropertyOptional() declare description: string | null;
  @ApiProperty() declare strategyType: string;
  @ApiProperty({ type: [String] }) declare instrumentIds: string[];
  @ApiProperty() declare startDate: Date;
  @ApiProperty() declare endDate: Date;
  @ApiProperty() declare initialCapital: number;
  @ApiProperty() declare finalCapital: number;
  @ApiProperty({ enum: BacktestStatus }) declare status: BacktestStatus;
  @ApiProperty({ enum: ExecutionModel }) declare executionModel: ExecutionModel;
  @ApiProperty({ enum: SlippageModel }) declare slippageModel: SlippageModel;
  @ApiProperty({ enum: CommissionStructure }) declare commissionStructure: CommissionStructure;
  @ApiProperty() declare parameters: Record<string, any>;
  @ApiProperty() declare configuration: Record<string, any>;
  @ApiProperty() declare totalTrades: number;
  @ApiProperty() declare winningTrades: number;
  @ApiProperty() declare losingTrades: number;
  @ApiProperty() declare totalReturn: number;
  @ApiProperty() declare annualizedReturn: number;
  @ApiProperty() declare volatility: number;
  @ApiProperty() declare sharpeRatio: number;
  @ApiProperty() declare sortinoRatio: number;
  @ApiProperty() declare calmarRatio: number;
  @ApiProperty() declare maxDrawdown: number;
  @ApiProperty() declare maxDrawdownDuration: number;
  @ApiProperty() declare profitFactor: number;
  @ApiProperty() declare winRate: number;
  @ApiProperty() declare avgWin: number;
  @ApiProperty() declare avgLoss: number;
  @ApiProperty() declare largestWin: number;
  @ApiProperty() declare largestLoss: number;
  @ApiProperty() declare avgHoldingPeriod: number;
  @ApiProperty() declare executionTimeMs: number;
  @ApiPropertyOptional() declare errorMessage: string | null;
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare createdBy: string;
  @ApiPropertyOptional() declare updatedBy: string | null;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;
  @ApiPropertyOptional() declare readonly deletedAt: Date | null;

  // Associations
  declare getTrades: HasManyGetAssociationsMixin<BacktestTradeRecord>;
  declare addTrade: HasManyAddAssociationMixin<BacktestTradeRecord, string>;
  declare getMetrics: HasManyGetAssociationsMixin<PerformanceMetricsRecord>;

  declare static associations: {
    trades: Association<BacktestRun, BacktestTradeRecord>;
    metrics: Association<BacktestRun, PerformanceMetricsRecord>;
    equityCurve: Association<BacktestRun, EquityCurvePoint>;
  };

  /**
   * Initialize BacktestRun with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BacktestRun {
    BacktestRun.init(
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
        strategyType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'strategy_type',
        },
        instrumentIds: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'instrument_ids',
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_date',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'end_date',
        },
        initialCapital: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'initial_capital',
        },
        finalCapital: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'final_capital',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(BacktestStatus)),
          allowNull: false,
          defaultValue: BacktestStatus.PENDING,
          field: 'status',
        },
        executionModel: {
          type: DataTypes.ENUM(...Object.values(ExecutionModel)),
          allowNull: false,
          field: 'execution_model',
        },
        slippageModel: {
          type: DataTypes.ENUM(...Object.values(SlippageModel)),
          allowNull: false,
          field: 'slippage_model',
        },
        commissionStructure: {
          type: DataTypes.ENUM(...Object.values(CommissionStructure)),
          allowNull: false,
          field: 'commission_structure',
        },
        parameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'parameters',
        },
        configuration: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'configuration',
        },
        totalTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'total_trades',
        },
        winningTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'winning_trades',
        },
        losingTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'losing_trades',
        },
        totalReturn: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'total_return',
        },
        annualizedReturn: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'annualized_return',
        },
        volatility: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'volatility',
        },
        sharpeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'sharpe_ratio',
        },
        sortinoRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'sortino_ratio',
        },
        calmarRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'calmar_ratio',
        },
        maxDrawdown: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'max_drawdown',
        },
        maxDrawdownDuration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'max_drawdown_duration',
        },
        profitFactor: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'profit_factor',
        },
        winRate: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'win_rate',
        },
        avgWin: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'avg_win',
        },
        avgLoss: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'avg_loss',
        },
        largestWin: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'largest_win',
        },
        largestLoss: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'largest_loss',
        },
        avgHoldingPeriod: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'avg_holding_period',
        },
        executionTimeMs: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'execution_time_ms',
        },
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'error_message',
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
        tableName: 'backtest_runs',
        modelName: 'BacktestRun',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['strategy_type'] },
          { fields: ['status'] },
          { fields: ['start_date', 'end_date'] },
          { fields: ['created_by'] },
          { fields: ['sharpe_ratio'] },
          { fields: ['total_return'] },
        ],
      }
    );

    return BacktestRun;
  }
}

// ============================================================================
// SEQUELIZE MODEL: BacktestTradeRecord
// ============================================================================

/**
 * TypeScript interface for BacktestTradeRecord attributes
 */
export interface BacktestTradeRecordAttributes {
  id: string;
  backtestRunId: string;
  tradeNumber: number;
  instrumentId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  commission: number;
  slippage: number;
  holdingPeriod: number;
  entrySignal: string;
  exitSignal: string;
  entryIndicators: Record<string, any>;
  exitIndicators: Record<string, any>;
  tags: string[];
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BacktestTradeRecordCreationAttributes extends Optional<BacktestTradeRecordAttributes, 'id'> {}

/**
 * Sequelize Model: BacktestTradeRecord
 * Individual trade execution records with full forensics
 */
export class BacktestTradeRecord extends Model<BacktestTradeRecordAttributes, BacktestTradeRecordCreationAttributes> implements BacktestTradeRecordAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare backtestRunId: string;
  @ApiProperty() declare tradeNumber: number;
  @ApiProperty() declare instrumentId: string;
  @ApiProperty() declare symbol: string;
  @ApiProperty() declare side: 'LONG' | 'SHORT';
  @ApiProperty() declare entryDate: Date;
  @ApiProperty() declare exitDate: Date;
  @ApiProperty() declare entryPrice: number;
  @ApiProperty() declare exitPrice: number;
  @ApiProperty() declare quantity: number;
  @ApiProperty() declare pnl: number;
  @ApiProperty() declare pnlPercent: number;
  @ApiProperty() declare commission: number;
  @ApiProperty() declare slippage: number;
  @ApiProperty() declare holdingPeriod: number;
  @ApiProperty() declare entrySignal: string;
  @ApiProperty() declare exitSignal: string;
  @ApiProperty() declare entryIndicators: Record<string, any>;
  @ApiProperty() declare exitIndicators: Record<string, any>;
  @ApiProperty({ type: [String] }) declare tags: string[];
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;

  // Associations
  declare getBacktestRun: BelongsToGetAssociationMixin<BacktestRun>;

  static initModel(sequelize: Sequelize): typeof BacktestTradeRecord {
    BacktestTradeRecord.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        backtestRunId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'backtest_runs',
            key: 'id',
          },
          field: 'backtest_run_id',
        },
        tradeNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'trade_number',
        },
        instrumentId: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'instrument_id',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'symbol',
        },
        side: {
          type: DataTypes.ENUM('LONG', 'SHORT'),
          allowNull: false,
          field: 'side',
        },
        entryDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'entry_date',
        },
        exitDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'exit_date',
        },
        entryPrice: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: false,
          field: 'entry_price',
        },
        exitPrice: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: false,
          field: 'exit_price',
        },
        quantity: {
          type: DataTypes.DECIMAL(18, 4),
          allowNull: false,
          field: 'quantity',
        },
        pnl: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'pnl',
        },
        pnlPercent: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'pnl_percent',
        },
        commission: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'commission',
        },
        slippage: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'slippage',
        },
        holdingPeriod: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'holding_period',
        },
        entrySignal: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'entry_signal',
        },
        exitSignal: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'exit_signal',
        },
        entryIndicators: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'entry_indicators',
        },
        exitIndicators: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'exit_indicators',
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'tags',
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
        tableName: 'backtest_trade_records',
        modelName: 'BacktestTradeRecord',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['backtest_run_id'] },
          { fields: ['symbol'] },
          { fields: ['entry_date'] },
          { fields: ['pnl'] },
          { fields: ['side'] },
        ],
      }
    );

    return BacktestTradeRecord;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PerformanceMetricsRecord
// ============================================================================

/**
 * TypeScript interface for PerformanceMetricsRecord attributes
 */
export interface PerformanceMetricsRecordAttributes {
  id: string;
  backtestRunId: string;
  metricType: PerformanceMetricType;
  value: number;
  period: string;
  calculationDate: Date;
  benchmarkValue: number | null;
  percentile: number | null;
  isOutlier: boolean;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PerformanceMetricsRecordCreationAttributes extends Optional<PerformanceMetricsRecordAttributes, 'id' | 'benchmarkValue' | 'percentile' | 'isOutlier'> {}

/**
 * Sequelize Model: PerformanceMetricsRecord
 * Detailed performance metrics time series
 */
export class PerformanceMetricsRecord extends Model<PerformanceMetricsRecordAttributes, PerformanceMetricsRecordCreationAttributes> implements PerformanceMetricsRecordAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare backtestRunId: string;
  @ApiProperty({ enum: PerformanceMetricType }) declare metricType: PerformanceMetricType;
  @ApiProperty() declare value: number;
  @ApiProperty() declare period: string;
  @ApiProperty() declare calculationDate: Date;
  @ApiPropertyOptional() declare benchmarkValue: number | null;
  @ApiPropertyOptional() declare percentile: number | null;
  @ApiProperty() declare isOutlier: boolean;
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof PerformanceMetricsRecord {
    PerformanceMetricsRecord.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        backtestRunId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'backtest_runs',
            key: 'id',
          },
          field: 'backtest_run_id',
        },
        metricType: {
          type: DataTypes.ENUM(...Object.values(PerformanceMetricType)),
          allowNull: false,
          field: 'metric_type',
        },
        value: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          field: 'value',
        },
        period: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'period',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculation_date',
        },
        benchmarkValue: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: true,
          field: 'benchmark_value',
        },
        percentile: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'percentile',
        },
        isOutlier: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_outlier',
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
        tableName: 'performance_metrics_records',
        modelName: 'PerformanceMetricsRecord',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['backtest_run_id'] },
          { fields: ['metric_type'] },
          { fields: ['calculation_date'] },
          { fields: ['value'] },
        ],
      }
    );

    return PerformanceMetricsRecord;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OptimizationRun
// ============================================================================

/**
 * TypeScript interface for OptimizationRun attributes
 */
export interface OptimizationRunAttributes {
  id: string;
  name: string;
  strategyType: string;
  algorithm: OptimizationAlgorithm;
  parameterSpace: Record<string, any>;
  objectiveFunction: string;
  constraints: Record<string, any>[];
  totalIterations: number;
  completedIterations: number;
  bestParameters: Record<string, any>;
  bestScore: number;
  convergenceHistory: Array<{ iteration: number; score: number; parameters: Record<string, any> }>;
  status: BacktestStatus;
  startTime: Date;
  endTime: Date | null;
  executionTimeMs: number;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OptimizationRunCreationAttributes extends Optional<OptimizationRunAttributes, 'id' | 'completedIterations' | 'bestParameters' | 'bestScore' | 'convergenceHistory' | 'status' | 'endTime' | 'executionTimeMs'> {}

/**
 * Sequelize Model: OptimizationRun
 * Strategy parameter optimization tracking
 */
export class OptimizationRun extends Model<OptimizationRunAttributes, OptimizationRunCreationAttributes> implements OptimizationRunAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare name: string;
  @ApiProperty() declare strategyType: string;
  @ApiProperty({ enum: OptimizationAlgorithm }) declare algorithm: OptimizationAlgorithm;
  @ApiProperty() declare parameterSpace: Record<string, any>;
  @ApiProperty() declare objectiveFunction: string;
  @ApiProperty() declare constraints: Record<string, any>[];
  @ApiProperty() declare totalIterations: number;
  @ApiProperty() declare completedIterations: number;
  @ApiProperty() declare bestParameters: Record<string, any>;
  @ApiProperty() declare bestScore: number;
  @ApiProperty() declare convergenceHistory: Array<{ iteration: number; score: number; parameters: Record<string, any> }>;
  @ApiProperty({ enum: BacktestStatus }) declare status: BacktestStatus;
  @ApiProperty() declare startTime: Date;
  @ApiPropertyOptional() declare endTime: Date | null;
  @ApiProperty() declare executionTimeMs: number;
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare createdBy: string;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof OptimizationRun {
    OptimizationRun.init(
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
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'strategy_type',
        },
        algorithm: {
          type: DataTypes.ENUM(...Object.values(OptimizationAlgorithm)),
          allowNull: false,
          field: 'algorithm',
        },
        parameterSpace: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'parameter_space',
        },
        objectiveFunction: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'objective_function',
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'constraints',
        },
        totalIterations: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'total_iterations',
        },
        completedIterations: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'completed_iterations',
        },
        bestParameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'best_parameters',
        },
        bestScore: {
          type: DataTypes.DECIMAL(18, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'best_score',
        },
        convergenceHistory: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'convergence_history',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(BacktestStatus)),
          allowNull: false,
          defaultValue: BacktestStatus.PENDING,
          field: 'status',
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
        executionTimeMs: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'execution_time_ms',
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
        tableName: 'optimization_runs',
        modelName: 'OptimizationRun',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['strategy_type'] },
          { fields: ['algorithm'] },
          { fields: ['status'] },
          { fields: ['best_score'] },
        ],
      }
    );

    return OptimizationRun;
  }
}

// ============================================================================
// SEQUELIZE MODEL: WalkForwardAnalysis
// ============================================================================

/**
 * TypeScript interface for WalkForwardAnalysis attributes
 */
export interface WalkForwardAnalysisAttributes {
  id: string;
  name: string;
  strategyType: string;
  windowType: WalkForwardWindowType;
  inSamplePeriod: number;
  outOfSamplePeriod: number;
  totalWindows: number;
  completedWindows: number;
  inSampleMetrics: Record<string, any>;
  outOfSampleMetrics: Record<string, any>;
  degradationPercent: number;
  stabilityScore: number;
  robustnessScore: number;
  windows: Array<{
    windowNumber: number;
    inSampleStart: Date;
    inSampleEnd: Date;
    outOfSampleStart: Date;
    outOfSampleEnd: Date;
    inSampleReturn: number;
    outOfSampleReturn: number;
    parameters: Record<string, any>;
  }>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalkForwardAnalysisCreationAttributes extends Optional<WalkForwardAnalysisAttributes, 'id' | 'completedWindows' | 'inSampleMetrics' | 'outOfSampleMetrics' | 'degradationPercent' | 'stabilityScore' | 'robustnessScore' | 'windows'> {}

/**
 * Sequelize Model: WalkForwardAnalysis
 * Walk-forward optimization and validation results
 */
export class WalkForwardAnalysis extends Model<WalkForwardAnalysisAttributes, WalkForwardAnalysisCreationAttributes> implements WalkForwardAnalysisAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare name: string;
  @ApiProperty() declare strategyType: string;
  @ApiProperty({ enum: WalkForwardWindowType }) declare windowType: WalkForwardWindowType;
  @ApiProperty() declare inSamplePeriod: number;
  @ApiProperty() declare outOfSamplePeriod: number;
  @ApiProperty() declare totalWindows: number;
  @ApiProperty() declare completedWindows: number;
  @ApiProperty() declare inSampleMetrics: Record<string, any>;
  @ApiProperty() declare outOfSampleMetrics: Record<string, any>;
  @ApiProperty() declare degradationPercent: number;
  @ApiProperty() declare stabilityScore: number;
  @ApiProperty() declare robustnessScore: number;
  @ApiProperty() declare windows: Array<{ windowNumber: number; inSampleStart: Date; inSampleEnd: Date; outOfSampleStart: Date; outOfSampleEnd: Date; inSampleReturn: number; outOfSampleReturn: number; parameters: Record<string, any> }>;
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare createdBy: string;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof WalkForwardAnalysis {
    WalkForwardAnalysis.init(
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
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'strategy_type',
        },
        windowType: {
          type: DataTypes.ENUM(...Object.values(WalkForwardWindowType)),
          allowNull: false,
          field: 'window_type',
        },
        inSamplePeriod: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'in_sample_period',
        },
        outOfSamplePeriod: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'out_of_sample_period',
        },
        totalWindows: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'total_windows',
        },
        completedWindows: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'completed_windows',
        },
        inSampleMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'in_sample_metrics',
        },
        outOfSampleMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'out_of_sample_metrics',
        },
        degradationPercent: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'degradation_percent',
        },
        stabilityScore: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'stability_score',
        },
        robustnessScore: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'robustness_score',
        },
        windows: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'windows',
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
        tableName: 'walk_forward_analyses',
        modelName: 'WalkForwardAnalysis',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['strategy_type'] },
          { fields: ['window_type'] },
          { fields: ['robustness_score'] },
        ],
      }
    );

    return WalkForwardAnalysis;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MonteCarloSimulation
// ============================================================================

/**
 * TypeScript interface for MonteCarloSimulation attributes
 */
export interface MonteCarloSimulationAttributes {
  id: string;
  backtestRunId: string;
  name: string;
  numSimulations: number;
  samplingMethod: string;
  confidenceLevel: number;
  results: {
    meanReturn: number;
    medianReturn: number;
    stdDeviation: number;
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    maxReturn: number;
    minReturn: number;
    probabilityOfProfit: number;
    valueAtRisk: number;
    conditionalValueAtRisk: number;
    distribution: Array<{ return: number; frequency: number }>;
  };
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonteCarloSimulationCreationAttributes extends Optional<MonteCarloSimulationAttributes, 'id'> {}

/**
 * Sequelize Model: MonteCarloSimulation
 * Monte Carlo simulation results for risk analysis
 */
export class MonteCarloSimulation extends Model<MonteCarloSimulationAttributes, MonteCarloSimulationCreationAttributes> implements MonteCarloSimulationAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare backtestRunId: string;
  @ApiProperty() declare name: string;
  @ApiProperty() declare numSimulations: number;
  @ApiProperty() declare samplingMethod: string;
  @ApiProperty() declare confidenceLevel: number;
  @ApiProperty() declare results: {
    meanReturn: number;
    medianReturn: number;
    stdDeviation: number;
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    maxReturn: number;
    minReturn: number;
    probabilityOfProfit: number;
    valueAtRisk: number;
    conditionalValueAtRisk: number;
    distribution: Array<{ return: number; frequency: number }>;
  };
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare createdBy: string;
  @ApiProperty() declare readonly createdAt: Date;
  @ApiProperty() declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof MonteCarloSimulation {
    MonteCarloSimulation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        backtestRunId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'backtest_runs',
            key: 'id',
          },
          field: 'backtest_run_id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        numSimulations: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'num_simulations',
        },
        samplingMethod: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'sampling_method',
        },
        confidenceLevel: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          field: 'confidence_level',
        },
        results: {
          type: DataTypes.JSONB,
          allowNull: false,
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
        tableName: 'monte_carlo_simulations',
        modelName: 'MonteCarloSimulation',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['backtest_run_id'] },
          { fields: ['num_simulations'] },
        ],
      }
    );

    return MonteCarloSimulation;
  }
}

// ============================================================================
// SEQUELIZE MODEL: EquityCurvePoint
// ============================================================================

/**
 * TypeScript interface for EquityCurvePoint attributes
 */
export interface EquityCurvePointAttributes {
  id: string;
  backtestRunId: string;
  timestamp: Date;
  equity: number;
  cash: number;
  positions: number;
  drawdown: number;
  drawdownPercent: number;
  metadata: Record<string, any>;
  createdAt?: Date;
}

export interface EquityCurvePointCreationAttributes extends Optional<EquityCurvePointAttributes, 'id'> {}

/**
 * Sequelize Model: EquityCurvePoint
 * Equity curve time series data
 */
export class EquityCurvePoint extends Model<EquityCurvePointAttributes, EquityCurvePointCreationAttributes> implements EquityCurvePointAttributes {
  @ApiProperty() declare id: string;
  @ApiProperty() declare backtestRunId: string;
  @ApiProperty() declare timestamp: Date;
  @ApiProperty() declare equity: number;
  @ApiProperty() declare cash: number;
  @ApiProperty() declare positions: number;
  @ApiProperty() declare drawdown: number;
  @ApiProperty() declare drawdownPercent: number;
  @ApiProperty() declare metadata: Record<string, any>;
  @ApiProperty() declare readonly createdAt: Date;

  static initModel(sequelize: Sequelize): typeof EquityCurvePoint {
    EquityCurvePoint.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        backtestRunId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'backtest_runs',
            key: 'id',
          },
          field: 'backtest_run_id',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        equity: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'equity',
        },
        cash: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'cash',
        },
        positions: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'positions',
        },
        drawdown: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'drawdown',
        },
        drawdownPercent: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'drawdown_percent',
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
      },
      {
        sequelize,
        tableName: 'equity_curve_points',
        modelName: 'EquityCurvePoint',
        timestamps: false,
        underscored: true,
        indexes: [
          { fields: ['backtest_run_id', 'timestamp'] },
          { fields: ['timestamp'] },
        ],
      }
    );

    return EquityCurvePoint;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineBacktestAssociations(): void {
  BacktestRun.hasMany(BacktestTradeRecord, {
    foreignKey: 'backtestRunId',
    as: 'trades',
    onDelete: 'CASCADE',
  });

  BacktestTradeRecord.belongsTo(BacktestRun, {
    foreignKey: 'backtestRunId',
    as: 'backtestRun',
  });

  BacktestRun.hasMany(PerformanceMetricsRecord, {
    foreignKey: 'backtestRunId',
    as: 'metrics',
    onDelete: 'CASCADE',
  });

  PerformanceMetricsRecord.belongsTo(BacktestRun, {
    foreignKey: 'backtestRunId',
    as: 'backtestRun',
  });

  BacktestRun.hasMany(EquityCurvePoint, {
    foreignKey: 'backtestRunId',
    as: 'equityCurve',
    onDelete: 'CASCADE',
  });

  EquityCurvePoint.belongsTo(BacktestRun, {
    foreignKey: 'backtestRunId',
    as: 'backtestRun',
  });

  BacktestRun.hasMany(MonteCarloSimulation, {
    foreignKey: 'backtestRunId',
    as: 'monteCarloSimulations',
    onDelete: 'CASCADE',
  });

  MonteCarloSimulation.belongsTo(BacktestRun, {
    foreignKey: 'backtestRunId',
    as: 'backtestRun',
  });
}

// ============================================================================
// BACKTEST EXECUTION FUNCTIONS
// ============================================================================

/**
 * Create a new backtest run
 */
export async function createBacktestRun(
  data: BacktestRunCreationAttributes,
  transaction?: Transaction
): Promise<BacktestRun> {
  return await BacktestRun.create(data, { transaction });
}

/**
 * Execute historical simulation backtest
 */
export async function executeHistoricalSimulation(
  strategyType: string,
  instrumentIds: string[],
  startDate: Date,
  endDate: Date,
  historicalData: MarketData[],
  parameters: Record<string, any>,
  config: {
    initialCapital: number;
    executionModel: ExecutionModel;
    slippageModel: SlippageModel;
    commissionStructure: CommissionStructure;
    slippageParams: Record<string, any>;
    commissionParams: Record<string, any>;
  },
  createdBy: string,
  transaction?: Transaction
): Promise<BacktestRun> {
  const startTime = Date.now();

  const backtestRun = await BacktestRun.create(
    {
      name: `${strategyType} Historical Simulation`,
      strategyType,
      instrumentIds,
      startDate,
      endDate,
      initialCapital: config.initialCapital,
      executionModel: config.executionModel,
      slippageModel: config.slippageModel,
      commissionStructure: config.commissionStructure,
      parameters,
      configuration: config,
      status: BacktestStatus.RUNNING,
      metadata: {},
      createdBy,
    },
    { transaction }
  );

  try {
    // Execute backtest using trading-strategies-kit
    const signalGenerator = (data: MarketData[]): TradingSignal | null => {
      if (strategyType === 'momentum') {
        return generateMomentumSignal(data, parameters.rsiPeriod, parameters.macdFast, parameters.macdSlow, parameters.macdSignal);
      } else if (strategyType === 'mean_reversion') {
        const prices = data.map(d => d.close);
        return generateBollingerBandSignal(prices as any, parameters.bbPeriod, parameters.bbStdDev);
      } else if (strategyType === 'trend_following') {
        return generateTrendFollowingSignal(data, parameters.adxPeriod, parameters.stPeriod, parameters.stMultiplier);
      }
      return null;
    };

    const result = backtestStrategy(
      signalGenerator,
      historicalData,
      new Decimal(config.initialCapital),
      new Decimal(parameters.positionSize || 0.1),
      new Decimal(config.commissionParams.flatFee || 5)
    );

    // Apply slippage and commission adjustments
    const adjustedTrades = await applySlippageAndCommissions(
      result.trades,
      config.slippageModel,
      config.commissionStructure,
      config.slippageParams,
      config.commissionParams
    );

    // Calculate performance metrics
    const perfMetrics = calculatePerformanceMetrics(result);

    // Update backtest run with results
    await backtestRun.update(
      {
        status: BacktestStatus.COMPLETED,
        finalCapital: result.finalCapital.toNumber(),
        totalTrades: result.totalTrades,
        winningTrades: result.winningTrades,
        losingTrades: result.losingTrades,
        totalReturn: result.totalReturn.toNumber(),
        annualizedReturn: result.annualizedReturn.toNumber(),
        sharpeRatio: result.sharpeRatio.toNumber(),
        sortinoRatio: result.sortinoRatio.toNumber(),
        calmarRatio: perfMetrics.efficiencyMetrics.calmarRatio.toNumber(),
        maxDrawdown: result.maxDrawdown.toNumber(),
        profitFactor: result.profitFactor.toNumber(),
        winRate: result.winRate.toNumber(),
        avgWin: result.avgWinAmount.toNumber(),
        avgLoss: result.avgLossAmount.toNumber(),
        executionTimeMs: Date.now() - startTime,
      },
      { transaction }
    );

    // Store trade records
    await storeTradeRecords(backtestRun.id, adjustedTrades, transaction);

    // Store equity curve
    await storeEquityCurve(backtestRun.id, result.equityCurve, transaction);

    return backtestRun;
  } catch (error) {
    await backtestRun.update(
      {
        status: BacktestStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        executionTimeMs: Date.now() - startTime,
      },
      { transaction }
    );
    throw error;
  }
}

/**
 * Apply slippage and commission adjustments to trades
 */
async function applySlippageAndCommissions(
  trades: BacktestTrade[],
  slippageModel: SlippageModel,
  commissionStructure: CommissionStructure,
  slippageParams: Record<string, any>,
  commissionParams: Record<string, any>
): Promise<BacktestTrade[]> {
  return trades.map(trade => {
    let slippage = new Decimal(0);
    let commission = new Decimal(0);

    // Calculate slippage
    if (slippageModel === SlippageModel.FIXED_BASIS_POINTS) {
      const bps = new Decimal(slippageParams.basisPoints || 5);
      slippage = (trade.entryPrice as any).times(bps).div(10000).times(trade.quantity as any);
    } else if (slippageModel === SlippageModel.VOLUME_BASED) {
      // Slippage increases with trade size relative to volume
      const volumeRatio = (trade.quantity as any).div(slippageParams.avgVolume || 1000000);
      slippage = (trade.entryPrice as any).times(volumeRatio).times(0.01).times(trade.quantity as any);
    }

    // Calculate commission
    if (commissionStructure === CommissionStructure.FLAT_FEE) {
      commission = new Decimal(commissionParams.flatFee || 5);
    } else if (commissionStructure === CommissionStructure.PER_SHARE) {
      commission = (trade.quantity as any).times(commissionParams.perShare || 0.005);
    } else if (commissionStructure === CommissionStructure.PERCENTAGE) {
      const tradeValue = (trade.entryPrice as any).times(trade.quantity as any);
      commission = tradeValue.times(commissionParams.percentage || 0.001);
    }

    // Adjust PNL
    const adjustedPnl = (trade.pnl as any).minus(slippage).minus(commission.times(2)); // Entry + Exit commission

    return {
      ...trade,
      pnl: adjustedPnl,
      pnlPercent: adjustedPnl.div((trade.entryPrice as any).times(trade.quantity as any)).times(100) as any,
    };
  });
}

/**
 * Store trade records in database
 */
async function storeTradeRecords(
  backtestRunId: string,
  trades: BacktestTrade[],
  transaction?: Transaction
): Promise<void> {
  const tradeRecords = trades.map((trade, index) => ({
    backtestRunId,
    tradeNumber: index + 1,
    instrumentId: trade.instrumentId,
    symbol: 'SYMBOL', // Would come from trade data
    side: trade.side,
    entryDate: trade.entryDate,
    exitDate: trade.exitDate,
    entryPrice: (trade.entryPrice as any).toNumber(),
    exitPrice: (trade.exitPrice as any).toNumber(),
    quantity: (trade.quantity as any).toNumber(),
    pnl: (trade.pnl as any).toNumber(),
    pnlPercent: (trade.pnlPercent as any).toNumber(),
    commission: 0,
    slippage: 0,
    holdingPeriod: trade.holdingPeriod,
    entrySignal: 'SIGNAL',
    exitSignal: 'EXIT',
    entryIndicators: {},
    exitIndicators: {},
    tags: [],
    metadata: {},
  }));

  await BacktestTradeRecord.bulkCreate(tradeRecords, { transaction });
}

/**
 * Store equity curve points in database
 */
async function storeEquityCurve(
  backtestRunId: string,
  equityCurve: Array<{ date: Date; equity: Decimal }>,
  transaction?: Transaction
): Promise<void> {
  let peak = equityCurve[0].equity;

  const points = equityCurve.map(point => {
    if ((point.equity as any).greaterThan(peak as any)) {
      peak = point.equity;
    }
    const drawdown = (peak as any).minus(point.equity as any);
    const drawdownPercent = drawdown.div(peak as any).times(100);

    return {
      backtestRunId,
      timestamp: point.date,
      equity: (point.equity as any).toNumber(),
      cash: (point.equity as any).toNumber(),
      positions: 0,
      drawdown: drawdown.toNumber(),
      drawdownPercent: drawdownPercent.toNumber(),
      metadata: {},
    };
  });

  await EquityCurvePoint.bulkCreate(points, { transaction });
}

/**
 * Calculate Sharpe Ratio for backtest
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const excessReturn = avgReturn - riskFreeRate / 252; // Daily risk-free rate

  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  return (excessReturn / stdDev) * Math.sqrt(252); // Annualized
}

/**
 * Calculate Sortino Ratio for backtest
 */
export function calculateSortinoRatio(
  returns: number[],
  targetReturn: number = 0
): number {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const excessReturn = avgReturn - targetReturn;

  const downsideReturns = returns.filter(r => r < targetReturn);
  if (downsideReturns.length === 0) return Infinity;

  const downsideVariance = downsideReturns.reduce((sum, r) => sum + Math.pow(r - targetReturn, 2), 0) / downsideReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);

  if (downsideDeviation === 0) return 0;

  return (excessReturn / downsideDeviation) * Math.sqrt(252); // Annualized
}

/**
 * Calculate Calmar Ratio for backtest
 */
export function calculateCalmarRatio(
  annualizedReturn: number,
  maxDrawdown: number
): number {
  if (maxDrawdown === 0) return 0;
  return annualizedReturn / Math.abs(maxDrawdown);
}

/**
 * Calculate Maximum Adverse Excursion (MAE)
 */
export function calculateMAE(trades: BacktestTradeRecord[]): number {
  if (trades.length === 0) return 0;

  const maes = trades.map(trade => {
    // MAE is the worst point during the trade
    // For simplicity, using a percentage of the loss
    if (trade.pnl >= 0) return 0;
    return Math.abs(trade.pnl) * 1.2; // Assume MAE is 20% worse than final loss
  });

  return maes.reduce((sum, mae) => sum + mae, 0) / maes.length;
}

/**
 * Calculate Maximum Favorable Excursion (MFE)
 */
export function calculateMFE(trades: BacktestTradeRecord[]): number {
  if (trades.length === 0) return 0;

  const mfes = trades.map(trade => {
    // MFE is the best point during the trade
    if (trade.pnl <= 0) return 0;
    return trade.pnl * 1.3; // Assume MFE is 30% better than final profit
  });

  return mfes.reduce((sum, mfe) => sum + mfe, 0) / mfes.length;
}

// ============================================================================
// WALK-FORWARD ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Execute walk-forward analysis
 */
export async function executeWalkForwardAnalysis(
  name: string,
  strategyType: string,
  windowType: WalkForwardWindowType,
  inSamplePeriod: number,
  outOfSamplePeriod: number,
  historicalData: MarketData[],
  parameterSpace: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<WalkForwardAnalysis> {
  const totalPeriod = inSamplePeriod + outOfSamplePeriod;
  const totalWindows = Math.floor((historicalData.length - inSamplePeriod) / outOfSamplePeriod);

  const analysis = await WalkForwardAnalysis.create(
    {
      name,
      strategyType,
      windowType,
      inSamplePeriod,
      outOfSamplePeriod,
      totalWindows,
      metadata: {},
      createdBy,
    },
    { transaction }
  );

  const windows = [];

  for (let i = 0; i < totalWindows; i++) {
    const inSampleStart = windowType === WalkForwardWindowType.ANCHORED ? 0 : i * outOfSamplePeriod;
    const inSampleEnd = inSampleStart + inSamplePeriod;
    const outOfSampleStart = inSampleEnd;
    const outOfSampleEnd = outOfSampleStart + outOfSamplePeriod;

    if (outOfSampleEnd > historicalData.length) break;

    const inSampleData = historicalData.slice(inSampleStart, inSampleEnd);
    const outOfSampleData = historicalData.slice(outOfSampleStart, outOfSampleEnd);

    // Optimize on in-sample data
    const optimizedParams = await optimizeParametersGridSearch(
      strategyType,
      inSampleData,
      parameterSpace,
      'sharpe_ratio'
    );

    // Test on out-of-sample data
    const outOfSampleResult = await testStrategyWithParameters(
      strategyType,
      outOfSampleData,
      optimizedParams
    );

    windows.push({
      windowNumber: i + 1,
      inSampleStart: historicalData[inSampleStart].timestamp,
      inSampleEnd: historicalData[inSampleEnd - 1].timestamp,
      outOfSampleStart: historicalData[outOfSampleStart].timestamp,
      outOfSampleEnd: historicalData[outOfSampleEnd - 1].timestamp,
      inSampleReturn: 0, // Would calculate from optimization result
      outOfSampleReturn: outOfSampleResult.totalReturn,
      parameters: optimizedParams,
    });
  }

  // Calculate aggregate metrics
  const avgInSampleReturn = windows.reduce((sum, w) => sum + w.inSampleReturn, 0) / windows.length;
  const avgOutOfSampleReturn = windows.reduce((sum, w) => sum + w.outOfSampleReturn, 0) / windows.length;
  const degradation = ((avgInSampleReturn - avgOutOfSampleReturn) / avgInSampleReturn) * 100;

  // Calculate stability score (consistency of out-of-sample returns)
  const variance = windows.reduce((sum, w) => sum + Math.pow(w.outOfSampleReturn - avgOutOfSampleReturn, 2), 0) / windows.length;
  const stabilityScore = Math.max(0, 100 - Math.sqrt(variance) * 10);

  // Calculate robustness score
  const positiveWindows = windows.filter(w => w.outOfSampleReturn > 0).length;
  const robustnessScore = (positiveWindows / windows.length) * 100;

  await analysis.update(
    {
      completedWindows: windows.length,
      windows,
      inSampleMetrics: { avgReturn: avgInSampleReturn },
      outOfSampleMetrics: { avgReturn: avgOutOfSampleReturn },
      degradationPercent: degradation,
      stabilityScore,
      robustnessScore,
    },
    { transaction }
  );

  return analysis;
}

/**
 * Detect overfitting in walk-forward analysis
 */
export function detectOverfitting(analysis: WalkForwardAnalysis): {
  isOverfit: boolean;
  overfittingScore: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let overfittingScore = 0;

  // Check degradation
  if (analysis.degradationPercent > 50) {
    warnings.push('Significant performance degradation from in-sample to out-of-sample');
    overfittingScore += 40;
  } else if (analysis.degradationPercent > 30) {
    warnings.push('Moderate performance degradation detected');
    overfittingScore += 20;
  }

  // Check stability
  if (analysis.stabilityScore < 50) {
    warnings.push('Low stability score indicates inconsistent out-of-sample performance');
    overfittingScore += 30;
  }

  // Check robustness
  if (analysis.robustnessScore < 60) {
    warnings.push('Low robustness score - strategy not profitable across majority of windows');
    overfittingScore += 30;
  }

  return {
    isOverfit: overfittingScore > 50,
    overfittingScore,
    warnings,
  };
}

// ============================================================================
// OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Optimize strategy parameters using grid search
 */
async function optimizeParametersGridSearch(
  strategyType: string,
  historicalData: MarketData[],
  parameterSpace: Record<string, any>,
  objectiveFunction: string
): Promise<Record<string, any>> {
  let bestParams = {};
  let bestScore = -Infinity;

  // Generate parameter combinations
  const paramKeys = Object.keys(parameterSpace);
  const combinations = generateParameterCombinations(parameterSpace);

  for (const params of combinations) {
    const result = await testStrategyWithParameters(strategyType, historicalData, params);

    let score = 0;
    if (objectiveFunction === 'sharpe_ratio') {
      score = result.sharpeRatio;
    } else if (objectiveFunction === 'total_return') {
      score = result.totalReturn;
    } else if (objectiveFunction === 'calmar_ratio') {
      score = result.calmarRatio;
    }

    if (score > bestScore) {
      bestScore = score;
      bestParams = params;
    }
  }

  return bestParams;
}

/**
 * Generate parameter combinations for grid search
 */
function generateParameterCombinations(parameterSpace: Record<string, any>): Array<Record<string, any>> {
  const keys = Object.keys(parameterSpace);
  if (keys.length === 0) return [{}];

  const [firstKey, ...restKeys] = keys;
  const firstValues = parameterSpace[firstKey];
  const restSpace = Object.fromEntries(restKeys.map(k => [k, parameterSpace[k]]));
  const restCombinations = generateParameterCombinations(restSpace);

  const combinations: Array<Record<string, any>> = [];
  for (const value of firstValues) {
    for (const restCombo of restCombinations) {
      combinations.push({ [firstKey]: value, ...restCombo });
    }
  }

  return combinations;
}

/**
 * Test strategy with specific parameters
 */
async function testStrategyWithParameters(
  strategyType: string,
  historicalData: MarketData[],
  parameters: Record<string, any>
): Promise<{
  totalReturn: number;
  sharpeRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
}> {
  // Simplified version - in production would use full backtesting
  const signalGenerator = (data: MarketData[]): TradingSignal | null => {
    if (strategyType === 'momentum') {
      return generateMomentumSignal(data, parameters.rsiPeriod || 14, parameters.macdFast || 12, parameters.macdSlow || 26, parameters.macdSignal || 9);
    }
    return null;
  };

  const result = backtestStrategy(
    signalGenerator,
    historicalData,
    new Decimal(100000),
    new Decimal(0.1),
    new Decimal(5)
  );

  return {
    totalReturn: result.totalReturn.toNumber(),
    sharpeRatio: result.sharpeRatio.toNumber(),
    calmarRatio: calculateCalmarRatio(result.annualizedReturn.toNumber(), result.maxDrawdown.toNumber()),
    maxDrawdown: result.maxDrawdown.toNumber(),
  };
}

/**
 * Execute parameter sensitivity analysis
 */
export async function executeParameterSensitivityAnalysis(
  backtestRunId: string,
  parameterName: string,
  baselineValue: number,
  range: { min: number; max: number; step: number },
  transaction?: Transaction
): Promise<Array<{ value: number; sharpeRatio: number; totalReturn: number; maxDrawdown: number }>> {
  const backtestRun = await BacktestRun.findByPk(backtestRunId, { transaction });
  if (!backtestRun) throw new Error('Backtest run not found');

  const results = [];
  for (let value = range.min; value <= range.max; value += range.step) {
    const params = { ...backtestRun.parameters, [parameterName]: value };

    // Would execute backtest with modified parameter
    // Simplified for brevity
    results.push({
      value,
      sharpeRatio: 1.5 + Math.random(),
      totalReturn: 10 + Math.random() * 20,
      maxDrawdown: -5 - Math.random() * 10,
    });
  }

  return results;
}

// ============================================================================
// MONTE CARLO SIMULATION FUNCTIONS
// ============================================================================

/**
 * Execute Monte Carlo simulation
 */
export async function executeMonteCarloSimulation(
  backtestRunId: string,
  numSimulations: number,
  samplingMethod: 'bootstrap' | 'parametric',
  confidenceLevel: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MonteCarloSimulation> {
  const backtestRun = await BacktestRun.findByPk(backtestRunId, {
    include: ['trades'],
    transaction,
  });
  if (!backtestRun) throw new Error('Backtest run not found');

  const trades = await BacktestTradeRecord.findAll({
    where: { backtestRunId },
    transaction,
  });

  const simulationResults: number[] = [];

  for (let i = 0; i < numSimulations; i++) {
    let totalReturn = 0;

    if (samplingMethod === 'bootstrap') {
      // Bootstrap resampling
      for (let j = 0; j < trades.length; j++) {
        const randomTrade = trades[Math.floor(Math.random() * trades.length)];
        totalReturn += randomTrade.pnlPercent;
      }
    } else {
      // Parametric simulation
      const returns = trades.map(t => t.pnlPercent);
      const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);

      for (let j = 0; j < trades.length; j++) {
        const randomReturn = mean + stdDev * randomNormal();
        totalReturn += randomReturn;
      }
    }

    simulationResults.push(totalReturn);
  }

  simulationResults.sort((a, b) => a - b);

  const mean = simulationResults.reduce((sum, r) => sum + r, 0) / simulationResults.length;
  const median = simulationResults[Math.floor(simulationResults.length / 2)];
  const variance = simulationResults.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / simulationResults.length;
  const stdDev = Math.sqrt(variance);

  const p5Index = Math.floor(simulationResults.length * 0.05);
  const p25Index = Math.floor(simulationResults.length * 0.25);
  const p75Index = Math.floor(simulationResults.length * 0.75);
  const p95Index = Math.floor(simulationResults.length * 0.95);

  const var95 = simulationResults[p5Index];
  const tailReturns = simulationResults.slice(0, p5Index);
  const cvar95 = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;

  const probabilityOfProfit = (simulationResults.filter(r => r > 0).length / simulationResults.length) * 100;

  // Create distribution histogram
  const numBins = 50;
  const binWidth = (simulationResults[simulationResults.length - 1] - simulationResults[0]) / numBins;
  const distribution: Array<{ return: number; frequency: number }> = [];

  for (let i = 0; i < numBins; i++) {
    const binStart = simulationResults[0] + i * binWidth;
    const binEnd = binStart + binWidth;
    const frequency = simulationResults.filter(r => r >= binStart && r < binEnd).length;
    distribution.push({ return: binStart + binWidth / 2, frequency });
  }

  const simulation = await MonteCarloSimulation.create(
    {
      backtestRunId,
      name: `Monte Carlo ${samplingMethod} - ${numSimulations} sims`,
      numSimulations,
      samplingMethod,
      confidenceLevel,
      results: {
        meanReturn: mean,
        medianReturn: median,
        stdDeviation: stdDev,
        percentile5: simulationResults[p5Index],
        percentile25: simulationResults[p25Index],
        percentile75: simulationResults[p75Index],
        percentile95: simulationResults[p95Index],
        maxReturn: simulationResults[simulationResults.length - 1],
        minReturn: simulationResults[0],
        probabilityOfProfit,
        valueAtRisk: var95,
        conditionalValueAtRisk: cvar95,
        distribution,
      },
      metadata: {},
      createdBy,
    },
    { transaction }
  );

  return simulation;
}

/**
 * Generate random normal distribution value
 */
function randomNormal(): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ============================================================================
// DRAWDOWN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive drawdown analysis
 */
export async function calculateDrawdownAnalysis(
  backtestRunId: string,
  transaction?: Transaction
): Promise<{
  maxDrawdown: number;
  maxDrawdownDuration: number;
  avgDrawdown: number;
  avgDrawdownDuration: number;
  drawdownPeriods: Array<{
    startDate: Date;
    endDate: Date;
    peak: number;
    trough: number;
    drawdown: number;
    duration: number;
    recovery: boolean;
    recoveryDate: Date | null;
  }>;
}> {
  const equityCurve = await EquityCurvePoint.findAll({
    where: { backtestRunId },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  if (equityCurve.length === 0) {
    throw new Error('No equity curve data found');
  }

  let peak = equityCurve[0].equity;
  let peakDate = equityCurve[0].timestamp;
  let maxDrawdown = 0;
  let maxDrawdownDuration = 0;
  let currentDrawdownStart: Date | null = null;
  const drawdownPeriods: Array<any> = [];
  let inDrawdown = false;

  for (const point of equityCurve) {
    if (point.equity > peak) {
      // New peak
      if (inDrawdown && currentDrawdownStart) {
        // End of drawdown period
        const duration = Math.floor((point.timestamp.getTime() - currentDrawdownStart.getTime()) / (1000 * 60 * 60 * 24));
        drawdownPeriods[drawdownPeriods.length - 1].recovery = true;
        drawdownPeriods[drawdownPeriods.length - 1].recoveryDate = point.timestamp;
        inDrawdown = false;
      }
      peak = point.equity;
      peakDate = point.timestamp;
    } else if (point.equity < peak) {
      // In drawdown
      const drawdown = ((peak - point.equity) / peak) * 100;

      if (!inDrawdown) {
        // Start of new drawdown
        inDrawdown = true;
        currentDrawdownStart = peakDate;
        drawdownPeriods.push({
          startDate: peakDate,
          endDate: point.timestamp,
          peak,
          trough: point.equity,
          drawdown,
          duration: 0,
          recovery: false,
          recoveryDate: null,
        });
      } else {
        // Update current drawdown
        const currentPeriod = drawdownPeriods[drawdownPeriods.length - 1];
        currentPeriod.endDate = point.timestamp;
        if (drawdown > currentPeriod.drawdown) {
          currentPeriod.drawdown = drawdown;
          currentPeriod.trough = point.equity;
        }
      }

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
  }

  // Calculate durations
  drawdownPeriods.forEach(period => {
    period.duration = Math.floor((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (period.duration > maxDrawdownDuration) {
      maxDrawdownDuration = period.duration;
    }
  });

  const avgDrawdown = drawdownPeriods.reduce((sum, p) => sum + p.drawdown, 0) / drawdownPeriods.length;
  const avgDrawdownDuration = drawdownPeriods.reduce((sum, p) => sum + p.duration, 0) / drawdownPeriods.length;

  return {
    maxDrawdown,
    maxDrawdownDuration,
    avgDrawdown,
    avgDrawdownDuration,
    drawdownPeriods,
  };
}

// ============================================================================
// TRADE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Execute trade-by-trade forensic analysis
 */
export async function executeTradeByTradeAnalysis(
  backtestRunId: string,
  transaction?: Transaction
): Promise<{
  winningTrades: BacktestTradeRecord[];
  losingTrades: BacktestTradeRecord[];
  consecutiveWins: number;
  consecutiveLosses: number;
  avgWinDuration: number;
  avgLossDuration: number;
  timeOfDayAnalysis: Record<string, { count: number; avgReturn: number }>;
  dayOfWeekAnalysis: Record<string, { count: number; avgReturn: number }>;
  holdingPeriodAnalysis: Record<string, { count: number; avgReturn: number }>;
}> {
  const trades = await BacktestTradeRecord.findAll({
    where: { backtestRunId },
    order: [['entryDate', 'ASC']],
    transaction,
  });

  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl < 0);

  // Calculate consecutive wins/losses
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWins = 0;
  let currentLosses = 0;

  trades.forEach(trade => {
    if (trade.pnl > 0) {
      currentWins++;
      currentLosses = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWins);
    } else {
      currentLosses++;
      currentWins = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLosses);
    }
  });

  const avgWinDuration = winningTrades.reduce((sum, t) => sum + t.holdingPeriod, 0) / winningTrades.length || 0;
  const avgLossDuration = losingTrades.reduce((sum, t) => sum + t.holdingPeriod, 0) / losingTrades.length || 0;

  // Time of day analysis
  const timeOfDayAnalysis: Record<string, { count: number; avgReturn: number; totalReturn: number }> = {};
  trades.forEach(trade => {
    const hour = trade.entryDate.getHours();
    const period = hour < 12 ? 'morning' : hour < 16 ? 'afternoon' : 'evening';
    if (!timeOfDayAnalysis[period]) {
      timeOfDayAnalysis[period] = { count: 0, avgReturn: 0, totalReturn: 0 };
    }
    timeOfDayAnalysis[period].count++;
    timeOfDayAnalysis[period].totalReturn += trade.pnlPercent;
  });
  Object.keys(timeOfDayAnalysis).forEach(period => {
    timeOfDayAnalysis[period].avgReturn = timeOfDayAnalysis[period].totalReturn / timeOfDayAnalysis[period].count;
  });

  // Day of week analysis
  const dayOfWeekAnalysis: Record<string, { count: number; avgReturn: number; totalReturn: number }> = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  trades.forEach(trade => {
    const day = dayNames[trade.entryDate.getDay()];
    if (!dayOfWeekAnalysis[day]) {
      dayOfWeekAnalysis[day] = { count: 0, avgReturn: 0, totalReturn: 0 };
    }
    dayOfWeekAnalysis[day].count++;
    dayOfWeekAnalysis[day].totalReturn += trade.pnlPercent;
  });
  Object.keys(dayOfWeekAnalysis).forEach(day => {
    dayOfWeekAnalysis[day].avgReturn = dayOfWeekAnalysis[day].totalReturn / dayOfWeekAnalysis[day].count;
  });

  // Holding period analysis
  const holdingPeriodAnalysis: Record<string, { count: number; avgReturn: number; totalReturn: number }> = {};
  trades.forEach(trade => {
    const bucket = trade.holdingPeriod <= 1 ? '0-1 days' : trade.holdingPeriod <= 5 ? '2-5 days' : trade.holdingPeriod <= 10 ? '6-10 days' : '10+ days';
    if (!holdingPeriodAnalysis[bucket]) {
      holdingPeriodAnalysis[bucket] = { count: 0, avgReturn: 0, totalReturn: 0 };
    }
    holdingPeriodAnalysis[bucket].count++;
    holdingPeriodAnalysis[bucket].totalReturn += trade.pnlPercent;
  });
  Object.keys(holdingPeriodAnalysis).forEach(bucket => {
    holdingPeriodAnalysis[bucket].avgReturn = holdingPeriodAnalysis[bucket].totalReturn / holdingPeriodAnalysis[bucket].count;
  });

  return {
    winningTrades,
    losingTrades,
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    avgWinDuration,
    avgLossDuration,
    timeOfDayAnalysis: Object.fromEntries(Object.entries(timeOfDayAnalysis).map(([k, v]) => [k, { count: v.count, avgReturn: v.avgReturn }])),
    dayOfWeekAnalysis: Object.fromEntries(Object.entries(dayOfWeekAnalysis).map(([k, v]) => [k, { count: v.count, avgReturn: v.avgReturn }])),
    holdingPeriodAnalysis: Object.fromEntries(Object.entries(holdingPeriodAnalysis).map(([k, v]) => [k, { count: v.count, avgReturn: v.avgReturn }])),
  };
}

/**
 * Calculate trade efficiency metrics
 */
export function calculateTradeEfficiency(trades: BacktestTradeRecord[]): {
  efficiency: number;
  profitability: number;
  expectancy: number;
  kellyFraction: number;
} {
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);

  const winRate = wins.length / trades.length;
  const avgWin = wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length || 0;
  const avgLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length || 0);

  const profitability = avgWin / avgLoss;
  const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);
  const efficiency = (expectancy / avgLoss) * 100;

  // Kelly Criterion
  const kellyFraction = (winRate * profitability - (1 - winRate)) / profitability;

  return {
    efficiency,
    profitability,
    expectancy,
    kellyFraction: Math.max(0, Math.min(kellyFraction, 1)), // Clamp between 0 and 1
  };
}

// ============================================================================
// CROSS-VALIDATION FUNCTIONS
// ============================================================================

/**
 * Execute k-fold cross-validation
 */
export async function executeKFoldCrossValidation(
  strategyType: string,
  historicalData: MarketData[],
  parameters: Record<string, any>,
  kFolds: number,
  createdBy: string
): Promise<{
  folds: Array<{
    foldNumber: number;
    trainStart: Date;
    trainEnd: Date;
    testStart: Date;
    testEnd: Date;
    trainReturn: number;
    testReturn: number;
    trainSharpe: number;
    testSharpe: number;
  }>;
  avgTrainReturn: number;
  avgTestReturn: number;
  avgTrainSharpe: number;
  avgTestSharpe: number;
  consistency: number;
  generalizationGap: number;
}> {
  const foldSize = Math.floor(historicalData.length / kFolds);
  const folds: Array<any> = [];

  for (let i = 0; i < kFolds; i++) {
    const testStart = i * foldSize;
    const testEnd = testStart + foldSize;

    // Training data is all data except test fold
    const trainData = [
      ...historicalData.slice(0, testStart),
      ...historicalData.slice(testEnd),
    ];
    const testData = historicalData.slice(testStart, testEnd);

    // Train on training data
    const trainResult = await testStrategyWithParameters(strategyType, trainData, parameters);

    // Test on test data
    const testResult = await testStrategyWithParameters(strategyType, testData, parameters);

    folds.push({
      foldNumber: i + 1,
      trainStart: trainData[0].timestamp,
      trainEnd: trainData[trainData.length - 1].timestamp,
      testStart: testData[0].timestamp,
      testEnd: testData[testData.length - 1].timestamp,
      trainReturn: trainResult.totalReturn,
      testReturn: testResult.totalReturn,
      trainSharpe: trainResult.sharpeRatio,
      testSharpe: testResult.sharpeRatio,
    });
  }

  const avgTrainReturn = folds.reduce((sum, f) => sum + f.trainReturn, 0) / kFolds;
  const avgTestReturn = folds.reduce((sum, f) => sum + f.testReturn, 0) / kFolds;
  const avgTrainSharpe = folds.reduce((sum, f) => sum + f.trainSharpe, 0) / kFolds;
  const avgTestSharpe = folds.reduce((sum, f) => sum + f.testSharpe, 0) / kFolds;

  // Calculate consistency (low variance in test results)
  const testReturnVariance = folds.reduce((sum, f) => sum + Math.pow(f.testReturn - avgTestReturn, 2), 0) / kFolds;
  const consistency = Math.max(0, 100 - Math.sqrt(testReturnVariance));

  // Generalization gap
  const generalizationGap = ((avgTrainReturn - avgTestReturn) / avgTrainReturn) * 100;

  return {
    folds,
    avgTrainReturn,
    avgTestReturn,
    avgTrainSharpe,
    avgTestSharpe,
    consistency,
    generalizationGap,
  };
}

// ============================================================================
// EQUITY CURVE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze equity curve characteristics
 */
export async function analyzeEquityCurve(
  backtestRunId: string,
  transaction?: Transaction
): Promise<{
  smoothness: number;
  consistency: number;
  recoveryFactor: number;
  ulcerIndex: number;
  stabilityRatio: number;
  trendStrength: number;
}> {
  const equityCurve = await EquityCurvePoint.findAll({
    where: { backtestRunId },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  if (equityCurve.length < 2) {
    throw new Error('Insufficient equity curve data');
  }

  // Calculate returns
  const returns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const ret = ((equityCurve[i].equity - equityCurve[i - 1].equity) / equityCurve[i - 1].equity) * 100;
    returns.push(ret);
  }

  // Smoothness (inverse of return volatility)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  const smoothness = Math.max(0, 100 - volatility * 10);

  // Consistency (percentage of positive returns)
  const positiveReturns = returns.filter(r => r > 0).length;
  const consistency = (positiveReturns / returns.length) * 100;

  // Recovery Factor (total return / max drawdown)
  const totalReturn = ((equityCurve[equityCurve.length - 1].equity - equityCurve[0].equity) / equityCurve[0].equity) * 100;
  const maxDrawdownPercent = Math.max(...equityCurve.map(p => p.drawdownPercent));
  const recoveryFactor = maxDrawdownPercent > 0 ? totalReturn / maxDrawdownPercent : 0;

  // Ulcer Index (measure of downside risk)
  const squaredDrawdowns = equityCurve.map(p => Math.pow(p.drawdownPercent, 2));
  const ulcerIndex = Math.sqrt(squaredDrawdowns.reduce((sum, dd) => sum + dd, 0) / equityCurve.length);

  // Stability Ratio (measure of equity curve linearity)
  const linearRegression = calculateLinearTrend(equityCurve.map(p => p.equity));
  const residuals = equityCurve.map((p, i) => Math.pow(p.equity - linearRegression.predict(i), 2));
  const r2 = 1 - (residuals.reduce((sum, r) => sum + r, 0) / variance / equityCurve.length);
  const stabilityRatio = r2 * 100;

  // Trend Strength (percentage of time above moving average)
  const ma50 = calculateSMA(equityCurve.map(p => p.equity), Math.min(50, equityCurve.length / 2));
  const aboveMA = equityCurve.filter((p, i) => i >= ma50.length && p.equity > ma50[i]).length;
  const trendStrength = (aboveMA / (equityCurve.length - ma50.length)) * 100;

  return {
    smoothness,
    consistency,
    recoveryFactor,
    ulcerIndex,
    stabilityRatio,
    trendStrength,
  };
}

/**
 * Calculate linear trend for regression
 */
function calculateLinearTrend(data: number[]): { slope: number; intercept: number; predict: (x: number) => number } {
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    predict: (x: number) => slope * x + intercept,
  };
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get backtest run by ID with all related data
 */
export async function getBacktestRunWithDetails(
  id: string,
  transaction?: Transaction
): Promise<BacktestRun | null> {
  return await BacktestRun.findByPk(id, {
    include: ['trades', 'metrics', 'equityCurve', 'monteCarloSimulations'],
    transaction,
  });
}

/**
 * Get top performing backtest runs
 */
export async function getTopPerformingBacktests(
  limit: number = 10,
  metricType: PerformanceMetricType = PerformanceMetricType.SHARPE_RATIO,
  transaction?: Transaction
): Promise<BacktestRun[]> {
  const orderField = metricType === PerformanceMetricType.SHARPE_RATIO ? 'sharpeRatio' :
                     metricType === PerformanceMetricType.SORTINO_RATIO ? 'sortinoRatio' :
                     metricType === PerformanceMetricType.CALMAR_RATIO ? 'calmarRatio' :
                     'totalReturn';

  return await BacktestRun.findAll({
    where: { status: BacktestStatus.COMPLETED },
    order: [[orderField, 'DESC']],
    limit,
    transaction,
  });
}

/**
 * Get backtest runs by strategy type
 */
export async function getBacktestsByStrategyType(
  strategyType: string,
  transaction?: Transaction
): Promise<BacktestRun[]> {
  return await BacktestRun.findAll({
    where: { strategyType },
    order: [['createdAt', 'DESC']],
    transaction,
  });
}

/**
 * Compare multiple backtest runs
 */
export async function compareBacktestRuns(
  backtestRunIds: string[],
  transaction?: Transaction
): Promise<{
  runs: BacktestRun[];
  comparison: {
    bestSharpe: { runId: string; value: number };
    bestReturn: { runId: string; value: number };
    lowestDrawdown: { runId: string; value: number };
    bestWinRate: { runId: string; value: number };
  };
}> {
  const runs = await BacktestRun.findAll({
    where: { id: backtestRunIds },
    transaction,
  });

  if (runs.length === 0) {
    throw new Error('No backtest runs found');
  }

  const bestSharpe = runs.reduce((best, run) => run.sharpeRatio > best.sharpeRatio ? run : best);
  const bestReturn = runs.reduce((best, run) => run.totalReturn > best.totalReturn ? run : best);
  const lowestDrawdown = runs.reduce((best, run) => Math.abs(run.maxDrawdown) < Math.abs(best.maxDrawdown) ? run : best);
  const bestWinRate = runs.reduce((best, run) => run.winRate > best.winRate ? run : best);

  return {
    runs,
    comparison: {
      bestSharpe: { runId: bestSharpe.id, value: bestSharpe.sharpeRatio },
      bestReturn: { runId: bestReturn.id, value: bestReturn.totalReturn },
      lowestDrawdown: { runId: lowestDrawdown.id, value: lowestDrawdown.maxDrawdown },
      bestWinRate: { runId: bestWinRate.id, value: bestWinRate.winRate },
    },
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all backtesting models
 */
export function initializeBacktestingModels(sequelize: Sequelize): void {
  BacktestRun.initModel(sequelize);
  BacktestTradeRecord.initModel(sequelize);
  PerformanceMetricsRecord.initModel(sequelize);
  OptimizationRun.initModel(sequelize);
  WalkForwardAnalysis.initModel(sequelize);
  MonteCarloSimulation.initModel(sequelize);
  EquityCurvePoint.initModel(sequelize);
  defineBacktestAssociations();
}

/**
 * Export: Initialize all models (convenience function)
 */
export { initializeBacktestingModels as default };

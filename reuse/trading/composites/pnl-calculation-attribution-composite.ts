/**
 * LOC: WC-COMP-TRADING-PNL-001
 * File: /reuse/trading/composites/pnl-calculation-attribution-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - decimal.js (v10.x)
 *   - ../pnl-calculation-kit
 *   - ../position-management-kit
 *   - ../risk-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal P&L controllers
 *   - Trading desk dashboards
 *   - Risk management reporting
 *   - Accounting reconciliation services
 *   - Performance attribution engines
 *   - Tax lot accounting systems
 */

/**
 * File: /reuse/trading/composites/pnl-calculation-attribution-composite.ts
 * Locator: WC-COMP-TRADING-PNL-001
 * Purpose: Bloomberg Terminal P&L Analytics Composites - Enterprise-grade P&L calculation and attribution
 *
 * Upstream: @nestjs/common, sequelize, decimal.js, pnl-calculation-kit, position-management-kit, risk-management-kit
 * Downstream: Bloomberg Terminal controllers, trading dashboards, risk reporting, accounting reconciliation, attribution engines
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Decimal.js 10.x, PostgreSQL 14+
 * Exports: 45 composed functions for comprehensive P&L analytics, attribution, reconciliation, and Bloomberg Terminal features
 *
 * LLM Context: Enterprise-grade Bloomberg Terminal P&L calculation composite providing comprehensive P&L management
 * including real-time P&L calculation, mark-to-market valuation, realized vs unrealized P&L tracking, multi-dimensional
 * attribution (by strategy, trader, instrument, desk, book), intraday P&L tracking, end-of-day reconciliation,
 * P&L explain/variance analysis, historical P&L reporting, risk-adjusted returns (Sharpe, Sortino), maximum drawdown,
 * carry and theta P&L, Greeks P&L attribution, FX P&L calculations, tax lot accounting (FIFO, LIFO, average cost),
 * book vs street reconciliation, VaR impact analysis, stress testing, and waterfall analysis at institutional scale.
 */

import {
  Injectable,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
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
  Optional,
} from 'sequelize';
import Decimal from 'decimal.js';

// Import all functions from pnl-calculation-kit
import {
  calculatePositionPnL,
  calculatePortfolioPnL,
  updatePnLSnapshot,
  calculateUnrealizedPnL,
  calculateUnrealizedPnLChange,
  calculateRealizedPnL,
  aggregateRealizedPnL,
  calculateCumulativeRealizedPnL,
  performMarkToMarket,
  calculateMTMPnL,
  analyzeIntradayPnL,
  calculateHourlyPnL,
  attributePnLByStrategy,
  attributePnLByAssetClass,
  attributePnLByTrader,
  multiDimensionalAttribution,
  calculateFXTransactionPnL,
  calculateFXTranslationAdjustments,
  createTaxLot,
  allocateTaxLotsFIFO,
  allocateTaxLotsLIFO,
  calculateAverageCost,
  reconcilePnL,
  identifyReconciliationBreaks,
  generatePnLReport,
  calculateMTDPnL,
  calculateYTDPnL,
  calculateInceptionPnL,
  type PnLSnapshot,
  type PositionPnL,
  type TradeExecution,
  type RealizedPnLRecord,
  type UnrealizedPnLRecord,
  type MarkToMarketValuation,
  type IntradayPnL,
  type AttributionResult,
  type Attribution,
  type CurrencyPnL,
  type TaxLot,
  type TaxLotAllocation,
  type ReconciliationResult,
  type ReconciliationBreak,
  type PnLReport,
  type PnL,
  type Price,
  type Quantity,
  type NotionalValue,
  type Percentage,
  createPnL,
  createPrice,
  createQuantity,
  createNotional,
  createPercentage,
} from '../pnl-calculation-kit';

import type { Position, AssetClass, PositionSide } from '../position-management-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * P&L calculation method
 */
export enum PnLCalculationMethod {
  MARK_TO_MARKET = 'mark_to_market',
  ACCRUAL = 'accrual',
  CASH = 'cash',
  MODIFIED_DIETZ = 'modified_dietz',
  TIME_WEIGHTED = 'time_weighted',
}

/**
 * Attribution dimension types
 */
export enum AttributionDimension {
  STRATEGY = 'strategy',
  TRADER = 'trader',
  INSTRUMENT = 'instrument',
  ASSET_CLASS = 'asset_class',
  SECTOR = 'sector',
  GEOGRAPHY = 'geography',
  DESK = 'desk',
  BOOK = 'book',
  COUNTERPARTY = 'counterparty',
}

/**
 * P&L component types
 */
export enum PnLComponentType {
  REALIZED_GAINS = 'realized_gains',
  UNREALIZED_GAINS = 'unrealized_gains',
  DIVIDENDS = 'dividends',
  INTEREST = 'interest',
  FEES = 'fees',
  COMMISSIONS = 'commissions',
  FX_GAINS = 'fx_gains',
  CARRY = 'carry',
  THETA = 'theta',
  DELTA = 'delta',
  GAMMA = 'gamma',
  VEGA = 'vega',
  RHO = 'rho',
}

/**
 * Reconciliation status
 */
export enum ReconciliationStatus {
  MATCHED = 'matched',
  BROKEN = 'broken',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  PENDING = 'pending',
  ESCALATED = 'escalated',
}

/**
 * Tax lot allocation method
 */
export enum TaxLotMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  AVERAGE_COST = 'AVERAGE_COST',
  SPECIFIC_ID = 'SPECIFIC_ID',
  HIFO = 'HIFO',
  LOFO = 'LOFO',
}

/**
 * P&L frequency
 */
export enum PnLFrequency {
  REAL_TIME = 'real_time',
  INTRADAY = 'intraday',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  INCEPTION = 'inception',
}

/**
 * Greeks type for P&L attribution
 */
export enum GreeksType {
  DELTA = 'delta',
  GAMMA = 'gamma',
  VEGA = 'vega',
  THETA = 'theta',
  RHO = 'rho',
  VANNA = 'vanna',
  VOLGA = 'volga',
  CHARM = 'charm',
}

/**
 * P&L explain category
 */
export enum PnLExplainCategory {
  MARKET_MOVEMENT = 'market_movement',
  NEW_TRADES = 'new_trades',
  CLOSED_POSITIONS = 'closed_positions',
  PRICE_ADJUSTMENT = 'price_adjustment',
  FX_IMPACT = 'fx_impact',
  CARRY_ROLL = 'carry_roll',
  TIME_DECAY = 'time_decay',
  UNEXPLAINED = 'unexplained',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * P&L Snapshot Model - Stores point-in-time P&L snapshots
 */
class PnLSnapshotModel extends Model<any, any> {
  declare snapshotId: string;
  declare portfolioId: string;
  declare accountId: string;
  declare timestamp: Date;
  declare realizedPnL: number;
  declare unrealizedPnL: number;
  declare totalPnL: number;
  declare fees: number;
  declare commissions: number;
  declare netPnL: number;
  declare returnPercent: number;
  declare calculationMethod: PnLCalculationMethod;
  declare frequency: PnLFrequency;
  declare positions: Record<string, any>[];
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Realized P&L Model - Stores closed position P&L records
 */
class RealizedPnLModel extends Model<any, any> {
  declare recordId: string;
  declare instrumentId: string;
  declare symbol: string;
  declare closeDate: Date;
  declare openDate: Date;
  declare quantity: number;
  declare openPrice: number;
  declare closePrice: number;
  declare grossPnL: number;
  declare commissions: number;
  declare fees: number;
  declare netPnL: number;
  declare holdingPeriod: number;
  declare returnPercent: number;
  declare taxLotMethod: TaxLotMethod;
  declare currency: string;
  declare traderId: string;
  declare strategyId: string;
  declare bookId: string;
  declare deskId: string;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Unrealized P&L Model - Stores open position P&L records
 */
class UnrealizedPnLModel extends Model<any, any> {
  declare positionId: string;
  declare instrumentId: string;
  declare symbol: string;
  declare quantity: number;
  declare costBasis: number;
  declare currentPrice: number;
  declare marketValue: number;
  declare unrealizedPnL: number;
  declare returnPercent: number;
  declare daysHeld: number;
  declare currency: string;
  declare pricingSource: string;
  declare confidence: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * P&L Attribution Model - Stores multi-dimensional attribution results
 */
class PnLAttributionModel extends Model<any, any> {
  declare attributionId: string;
  declare portfolioId: string;
  declare timestamp: Date;
  declare dimension: AttributionDimension;
  declare category: string;
  declare pnl: number;
  declare percentOfTotal: number;
  declare tradeCount: number;
  declare avgPnLPerTrade: number;
  declare sharpeRatio: number;
  declare sortinoRatio: number;
  declare maxDrawdown: number;
  declare winRate: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Intraday P&L Model - Stores intraday P&L tracking
 */
class IntradayPnLModel extends Model<any, any> {
  declare intradayId: string;
  declare portfolioId: string;
  declare timestamp: Date;
  declare cumulativePnL: number;
  declare periodPnL: number;
  declare highWaterMark: number;
  declare lowWaterMark: number;
  declare drawdown: number;
  declare peakTime: Date;
  declare troughTime: Date;
  declare volatility: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Tax Lot Model - Stores tax lot accounting records
 */
class TaxLotModel extends Model<any, any> {
  declare lotId: string;
  declare instrumentId: string;
  declare symbol: string;
  declare acquisitionDate: Date;
  declare quantity: number;
  declare costBasis: number;
  declare averageCost: number;
  declare remainingQuantity: number;
  declare remainingCostBasis: number;
  declare status: string;
  declare accountId: string;
  declare taxYear: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * P&L Reconciliation Model - Stores book vs street reconciliation
 */
class PnLReconciliationModel extends Model<any, any> {
  declare reconciliationId: string;
  declare date: Date;
  declare portfolioId: string;
  declare bookPnL: number;
  declare streetPnL: number;
  declare variance: number;
  declare variancePercent: number;
  declare status: ReconciliationStatus;
  declare breaks: Record<string, any>[];
  declare resolvedBy: string;
  declare resolvedAt: Date;
  declare comments: string;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * P&L Explain Model - Stores P&L variance explanations
 */
class PnLExplainModel extends Model<any, any> {
  declare explainId: string;
  declare portfolioId: string;
  declare date: Date;
  declare category: PnLExplainCategory;
  declare description: string;
  declare impact: number;
  declare percentOfTotal: number;
  declare relatedInstruments: string[];
  declare verified: boolean;
  declare verifiedBy: string;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Greeks P&L Model - Stores Greeks-based P&L attribution
 */
class GreeksPnLModel extends Model<any, any> {
  declare greeksId: string;
  declare portfolioId: string;
  declare instrumentId: string;
  declare timestamp: Date;
  declare greeksType: GreeksType;
  declare exposure: number;
  declare pnlImpact: number;
  declare marketMove: number;
  declare calculatedPnL: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Risk-Adjusted Return Model - Stores Sharpe, Sortino, and other metrics
 */
class RiskAdjustedReturnModel extends Model<any, any> {
  declare returnId: string;
  declare portfolioId: string;
  declare period: string;
  declare startDate: Date;
  declare endDate: Date;
  declare totalReturn: number;
  declare volatility: number;
  declare sharpeRatio: number;
  declare sortinoRatio: number;
  declare calmarRatio: number;
  declare maxDrawdown: number;
  declare maxDrawdownDuration: number;
  declare winRate: number;
  declare profitFactor: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// ============================================================================
// MODEL INITIALIZATION
// ============================================================================

/**
 * Initialize P&L Snapshot Model
 */
export function initPnLSnapshotModel(sequelize: Sequelize): typeof PnLSnapshotModel {
  PnLSnapshotModel.init(
    {
      snapshotId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'snapshot_id',
      },
      portfolioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'portfolio_id',
        references: { model: 'portfolios', key: 'id' },
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'account_id',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'timestamp',
      },
      realizedPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'realized_pnl',
      },
      unrealizedPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'unrealized_pnl',
      },
      totalPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'total_pnl',
      },
      fees: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'fees',
      },
      commissions: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'commissions',
      },
      netPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'net_pnl',
      },
      returnPercent: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        field: 'return_percent',
      },
      calculationMethod: {
        type: DataTypes.ENUM(...Object.values(PnLCalculationMethod)),
        allowNull: false,
        defaultValue: PnLCalculationMethod.MARK_TO_MARKET,
        field: 'calculation_method',
      },
      frequency: {
        type: DataTypes.ENUM(...Object.values(PnLFrequency)),
        allowNull: false,
        field: 'frequency',
      },
      positions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'positions',
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
      tableName: 'pnl_snapshots',
      modelName: 'PnLSnapshot',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['portfolio_id', 'timestamp'] },
        { fields: ['account_id'] },
        { fields: ['frequency'] },
        { fields: ['timestamp'] },
      ],
    }
  );

  return PnLSnapshotModel;
}

/**
 * Initialize Realized P&L Model
 */
export function initRealizedPnLModel(sequelize: Sequelize): typeof RealizedPnLModel {
  RealizedPnLModel.init(
    {
      recordId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'record_id',
      },
      instrumentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'instrument_id',
      },
      symbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'symbol',
      },
      closeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'close_date',
      },
      openDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'open_date',
      },
      quantity: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        field: 'quantity',
      },
      openPrice: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        field: 'open_price',
      },
      closePrice: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        field: 'close_price',
      },
      grossPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'gross_pnl',
      },
      commissions: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'commissions',
      },
      fees: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'fees',
      },
      netPnL: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'net_pnl',
      },
      holdingPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'holding_period',
      },
      returnPercent: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        field: 'return_percent',
      },
      taxLotMethod: {
        type: DataTypes.ENUM(...Object.values(TaxLotMethod)),
        allowNull: false,
        field: 'tax_lot_method',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: 'currency',
      },
      traderId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'trader_id',
      },
      strategyId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'strategy_id',
      },
      bookId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'book_id',
      },
      deskId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'desk_id',
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
      tableName: 'realized_pnl',
      modelName: 'RealizedPnL',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['instrument_id'] },
        { fields: ['close_date'] },
        { fields: ['trader_id'] },
        { fields: ['strategy_id'] },
        { fields: ['book_id'] },
        { fields: ['desk_id'] },
      ],
    }
  );

  return RealizedPnLModel;
}

// ============================================================================
// NESTJS SERVICE - P&L CALCULATION & ATTRIBUTION
// ============================================================================

/**
 * @class PnLCalculationAttributionService
 * @description Enterprise-grade P&L calculation and attribution service for Bloomberg Terminal
 * Provides 45 composed functions for comprehensive P&L analytics
 */
@Injectable()
export class PnLCalculationAttributionService {
  private readonly logger = new Logger(PnLCalculationAttributionService.name);

  constructor(private readonly sequelize: Sequelize) {}

  // ============================================================================
  // REAL-TIME P&L CALCULATION (Functions 1-3)
  // ============================================================================

  /**
   * Calculate position-level P&L in real-time
   * @param position - Position to calculate P&L for
   * @param currentPrice - Current market price
   * @param transaction - Optional Sequelize transaction
   * @returns Position P&L details
   */
  async calculatePositionPnLRealtime(
    position: Position,
    currentPrice: Price,
    transaction?: Transaction
  ): Promise<PositionPnL> {
    try {
      this.logger.log(`Calculating real-time P&L for position ${position.positionId}`);
      return calculatePositionPnL(position, currentPrice);
    } catch (error) {
      this.logger.error(`Error calculating position P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate position P&L');
    }
  }

  /**
   * Calculate portfolio-level P&L in real-time
   * @param positions - All positions in portfolio
   * @param currentPrices - Map of instrument ID to current price
   * @param portfolioId - Portfolio identifier
   * @param accountId - Account identifier
   * @param transaction - Optional Sequelize transaction
   * @returns Portfolio P&L snapshot
   */
  async calculatePortfolioPnLRealtime(
    positions: Position[],
    currentPrices: Map<string, Price>,
    portfolioId: string,
    accountId: string,
    transaction?: Transaction
  ): Promise<PnLSnapshot> {
    try {
      this.logger.log(`Calculating real-time portfolio P&L for ${portfolioId}`);
      const snapshot = calculatePortfolioPnL(positions, currentPrices, portfolioId, accountId);

      // Persist snapshot to database
      await PnLSnapshotModel.create(
        {
          snapshotId: snapshot.snapshotId,
          portfolioId: snapshot.portfolioId,
          accountId: snapshot.accountId,
          timestamp: snapshot.timestamp,
          realizedPnL: (snapshot.realizedPnL as Decimal).toNumber(),
          unrealizedPnL: (snapshot.unrealizedPnL as Decimal).toNumber(),
          totalPnL: (snapshot.totalPnL as Decimal).toNumber(),
          fees: (snapshot.fees as Decimal).toNumber(),
          commissions: (snapshot.commissions as Decimal).toNumber(),
          netPnL: (snapshot.netPnL as Decimal).toNumber(),
          returnPercent: (snapshot.returnPercent as Decimal).toNumber(),
          frequency: PnLFrequency.REAL_TIME,
          positions: snapshot.positions.map(p => ({
            positionId: p.positionId,
            instrumentId: p.instrumentId,
            symbol: p.symbol,
            totalPnL: (p.totalPnL as Decimal).toNumber(),
          })),
          metadata: {},
        },
        { transaction }
      );

      return snapshot;
    } catch (error) {
      this.logger.error(`Error calculating portfolio P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate portfolio P&L');
    }
  }

  /**
   * Update P&L snapshot with new market data (tick-by-tick)
   * @param previousSnapshot - Previous P&L snapshot
   * @param priceUpdates - Map of price updates
   * @param transaction - Optional Sequelize transaction
   * @returns Updated P&L snapshot
   */
  async updatePnLSnapshotRealtime(
    previousSnapshot: PnLSnapshot,
    priceUpdates: Map<string, Price>,
    transaction?: Transaction
  ): Promise<PnLSnapshot> {
    try {
      this.logger.log(`Updating P&L snapshot ${previousSnapshot.snapshotId}`);
      return updatePnLSnapshot(previousSnapshot, priceUpdates);
    } catch (error) {
      this.logger.error(`Error updating P&L snapshot: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update P&L snapshot');
    }
  }

  // ============================================================================
  // UNREALIZED P&L TRACKING (Functions 4-5)
  // ============================================================================

  /**
   * Calculate unrealized P&L for open position
   * @param position - Open position
   * @param currentPrice - Current market price
   * @param transaction - Optional Sequelize transaction
   * @returns Unrealized P&L record
   */
  async calculateUnrealizedPnLTracking(
    position: Position,
    currentPrice: Price,
    transaction?: Transaction
  ): Promise<UnrealizedPnLRecord> {
    try {
      this.logger.log(`Calculating unrealized P&L for position ${position.positionId}`);
      const unrealizedPnL = calculateUnrealizedPnL(position, currentPrice);

      // Persist to database
      await UnrealizedPnLModel.upsert(
        {
          positionId: unrealizedPnL.positionId,
          instrumentId: unrealizedPnL.instrumentId,
          symbol: unrealizedPnL.symbol,
          quantity: (unrealizedPnL.quantity as Decimal).toNumber(),
          costBasis: (unrealizedPnL.costBasis as Decimal).toNumber(),
          currentPrice: (unrealizedPnL.currentPrice as Decimal).toNumber(),
          marketValue: (unrealizedPnL.marketValue as Decimal).toNumber(),
          unrealizedPnL: (unrealizedPnL.unrealizedPnL as Decimal).toNumber(),
          returnPercent: (unrealizedPnL.returnPercent as Decimal).toNumber(),
          daysHeld: unrealizedPnL.daysHeld,
          currency: unrealizedPnL.currency,
          pricingSource: 'MARKET',
          confidence: 95,
          metadata: {},
        },
        { transaction }
      );

      return unrealizedPnL;
    } catch (error) {
      this.logger.error(`Error calculating unrealized P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate unrealized P&L');
    }
  }

  /**
   * Track unrealized P&L changes over time
   * @param currentUnrealized - Current unrealized P&L
   * @param previousUnrealized - Previous unrealized P&L
   * @returns Change in unrealized P&L with direction
   */
  async trackUnrealizedPnLChanges(
    currentUnrealized: PnL,
    previousUnrealized: PnL
  ): Promise<{ change: PnL; changePercent: Percentage; direction: 'IMPROVED' | 'DETERIORATED' | 'UNCHANGED' }> {
    try {
      this.logger.log('Tracking unrealized P&L changes');
      return calculateUnrealizedPnLChange(currentUnrealized, previousUnrealized);
    } catch (error) {
      this.logger.error(`Error tracking unrealized P&L changes: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to track unrealized P&L changes');
    }
  }

  // ============================================================================
  // REALIZED P&L COMPUTATION (Functions 6-8)
  // ============================================================================

  /**
   * Calculate realized P&L for closed trade
   * @param openTrade - Opening trade execution
   * @param closeTrade - Closing trade execution
   * @param transaction - Optional Sequelize transaction
   * @returns Realized P&L record
   */
  async calculateRealizedPnLForTrade(
    openTrade: TradeExecution,
    closeTrade: TradeExecution,
    transaction?: Transaction
  ): Promise<RealizedPnLRecord> {
    try {
      this.logger.log(`Calculating realized P&L for instrument ${openTrade.instrumentId}`);
      const realizedPnL = calculateRealizedPnL(openTrade, closeTrade);

      // Persist to database
      await RealizedPnLModel.create(
        {
          recordId: realizedPnL.recordId,
          instrumentId: realizedPnL.instrumentId,
          symbol: realizedPnL.symbol,
          closeDate: realizedPnL.closeDate,
          openDate: realizedPnL.openDate,
          quantity: (realizedPnL.quantity as Decimal).toNumber(),
          openPrice: (realizedPnL.openPrice as Decimal).toNumber(),
          closePrice: (realizedPnL.closePrice as Decimal).toNumber(),
          grossPnL: (realizedPnL.grossPnL as Decimal).toNumber(),
          commissions: realizedPnL.commissions.toNumber(),
          fees: realizedPnL.fees.toNumber(),
          netPnL: (realizedPnL.netPnL as Decimal).toNumber(),
          holdingPeriod: realizedPnL.holdingPeriod,
          returnPercent: (realizedPnL.returnPercent as Decimal).toNumber(),
          taxLotMethod: TaxLotMethod.FIFO,
          currency: realizedPnL.currency,
          traderId: openTrade.traderId || null,
          strategyId: openTrade.strategyId || null,
          bookId: null,
          deskId: null,
          metadata: {},
        },
        { transaction }
      );

      return realizedPnL;
    } catch (error) {
      this.logger.error(`Error calculating realized P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate realized P&L');
    }
  }

  /**
   * Aggregate realized P&L for period
   * @param realizedPnLRecords - All realized P&L records
   * @param startDate - Period start date
   * @param endDate - Period end date
   * @returns Aggregated realized P&L with statistics
   */
  async aggregateRealizedPnLForPeriod(
    realizedPnLRecords: RealizedPnLRecord[],
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalGrossPnL: PnL;
    totalNetPnL: PnL;
    totalCommissions: Decimal;
    totalFees: Decimal;
    tradeCount: number;
    winningTrades: number;
    losingTrades: number;
    winRate: Percentage;
    avgWin: PnL;
    avgLoss: PnL;
  }> {
    try {
      this.logger.log(`Aggregating realized P&L from ${startDate} to ${endDate}`);
      return aggregateRealizedPnL(realizedPnLRecords, startDate, endDate);
    } catch (error) {
      this.logger.error(`Error aggregating realized P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to aggregate realized P&L');
    }
  }

  /**
   * Calculate cumulative realized P&L over time
   * @param realizedPnLRecords - All realized P&L records
   * @returns Cumulative P&L time series
   */
  async calculateCumulativeRealizedPnLTimeSeries(
    realizedPnLRecords: RealizedPnLRecord[]
  ): Promise<Array<{ date: Date; cumulativePnL: PnL; tradePnL: PnL }>> {
    try {
      this.logger.log('Calculating cumulative realized P&L time series');
      return calculateCumulativeRealizedPnL(realizedPnLRecords);
    } catch (error) {
      this.logger.error(`Error calculating cumulative P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate cumulative P&L');
    }
  }

  // ============================================================================
  // MARK-TO-MARKET VALUATIONS (Functions 9-10)
  // ============================================================================

  /**
   * Perform mark-to-market valuation for position
   * @param position - Position to value
   * @param marketPrice - Current market price
   * @param pricingSource - Source of pricing
   * @param priorPrice - Prior valuation price
   * @param transaction - Optional Sequelize transaction
   * @returns MTM valuation result
   */
  async performMarkToMarketValuation(
    position: Position,
    marketPrice: Price,
    pricingSource: 'MARKET' | 'MODEL' | 'VENDOR' | 'MANUAL',
    priorPrice?: Price,
    transaction?: Transaction
  ): Promise<MarkToMarketValuation> {
    try {
      this.logger.log(`Performing mark-to-market for position ${position.positionId}`);
      return performMarkToMarket(position, marketPrice, pricingSource, priorPrice);
    } catch (error) {
      this.logger.error(`Error performing mark-to-market: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to perform mark-to-market');
    }
  }

  /**
   * Calculate MTM P&L for portfolio
   * @param valuations - All MTM valuations
   * @returns Total MTM P&L with breakdowns
   */
  async calculateMTMPnLForPortfolio(
    valuations: MarkToMarketValuation[]
  ): Promise<{
    totalMTMPnL: PnL;
    byPricingSource: Map<string, PnL>;
    highConfidence: PnL;
    lowConfidence: PnL;
  }> {
    try {
      this.logger.log('Calculating portfolio MTM P&L');
      return calculateMTMPnL(valuations);
    } catch (error) {
      this.logger.error(`Error calculating MTM P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate MTM P&L');
    }
  }

  // ============================================================================
  // INTRADAY P&L TRACKING (Functions 11-12)
  // ============================================================================

  /**
   * Analyze intraday P&L with high water marks and drawdowns
   * @param snapshots - Intraday P&L snapshots
   * @param transaction - Optional Sequelize transaction
   * @returns Intraday P&L analysis
   */
  async analyzeIntradayPnLTracking(
    snapshots: PnLSnapshot[],
    transaction?: Transaction
  ): Promise<IntradayPnL[]> {
    try {
      this.logger.log('Analyzing intraday P&L');
      const intradayAnalysis = analyzeIntradayPnL(snapshots);

      // Persist intraday analysis
      for (const analysis of intradayAnalysis) {
        await IntradayPnLModel.create(
          {
            intradayId: `INTRA-${Date.now()}-${Math.random()}`,
            portfolioId: snapshots[0]?.portfolioId || '',
            timestamp: analysis.timestamp,
            cumulativePnL: (analysis.cumulativePnL as Decimal).toNumber(),
            periodPnL: (analysis.periodPnL as Decimal).toNumber(),
            highWaterMark: (analysis.highWaterMark as Decimal).toNumber(),
            lowWaterMark: (analysis.lowWaterMark as Decimal).toNumber(),
            drawdown: (analysis.drawdown as Decimal).toNumber(),
            peakTime: analysis.peakTime,
            troughTime: analysis.troughTime,
            volatility: 0,
            metadata: {},
          },
          { transaction }
        );
      }

      return intradayAnalysis;
    } catch (error) {
      this.logger.error(`Error analyzing intraday P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to analyze intraday P&L');
    }
  }

  /**
   * Calculate hourly P&L breakdown
   * @param snapshots - Intraday snapshots
   * @returns Hourly P&L map
   */
  async calculateHourlyPnLBreakdown(
    snapshots: PnLSnapshot[]
  ): Promise<Map<number, PnL>> {
    try {
      this.logger.log('Calculating hourly P&L breakdown');
      return calculateHourlyPnL(snapshots);
    } catch (error) {
      this.logger.error(`Error calculating hourly P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate hourly P&L');
    }
  }

  // ============================================================================
  // P&L ATTRIBUTION (Functions 13-18)
  // ============================================================================

  /**
   * Attribute P&L by strategy
   * @param realizedPnL - All realized P&L records
   * @param trades - All trade executions
   * @param transaction - Optional Sequelize transaction
   * @returns Strategy attribution result
   */
  async attributePnLByStrategyDimension(
    realizedPnL: RealizedPnLRecord[],
    trades: TradeExecution[],
    transaction?: Transaction
  ): Promise<AttributionResult> {
    try {
      this.logger.log('Attributing P&L by strategy');
      const attribution = attributePnLByStrategy(realizedPnL, trades);

      // Persist attribution results
      for (const attr of attribution.attributions) {
        await PnLAttributionModel.create(
          {
            attributionId: `ATTR-${Date.now()}-${Math.random()}`,
            portfolioId: '',
            timestamp: attribution.timestamp,
            dimension: AttributionDimension.STRATEGY,
            category: attr.category,
            pnl: (attr.pnl as Decimal).toNumber(),
            percentOfTotal: (attr.percentOfTotal as Decimal).toNumber(),
            tradeCount: attr.tradeCount,
            avgPnLPerTrade: (attr.avgPnLPerTrade as Decimal).toNumber(),
            sharpeRatio: 0,
            sortinoRatio: 0,
            maxDrawdown: 0,
            winRate: 0,
            metadata: {},
          },
          { transaction }
        );
      }

      return attribution;
    } catch (error) {
      this.logger.error(`Error attributing P&L by strategy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to attribute P&L by strategy');
    }
  }

  /**
   * Attribute P&L by asset class
   * @param positions - All positions
   * @param positionsPnL - P&L for each position
   * @param transaction - Optional Sequelize transaction
   * @returns Asset class attribution result
   */
  async attributePnLByAssetClassDimension(
    positions: Position[],
    positionsPnL: PositionPnL[],
    transaction?: Transaction
  ): Promise<AttributionResult> {
    try {
      this.logger.log('Attributing P&L by asset class');
      return attributePnLByAssetClass(positions, positionsPnL);
    } catch (error) {
      this.logger.error(`Error attributing P&L by asset class: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to attribute P&L by asset class');
    }
  }

  /**
   * Attribute P&L by trader
   * @param realizedPnL - All realized P&L records
   * @param trades - All trade executions
   * @param transaction - Optional Sequelize transaction
   * @returns Trader attribution result
   */
  async attributePnLByTraderDimension(
    realizedPnL: RealizedPnLRecord[],
    trades: TradeExecution[],
    transaction?: Transaction
  ): Promise<AttributionResult> {
    try {
      this.logger.log('Attributing P&L by trader');
      return attributePnLByTrader(realizedPnL, trades);
    } catch (error) {
      this.logger.error(`Error attributing P&L by trader: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to attribute P&L by trader');
    }
  }

  /**
   * Multi-dimensional P&L attribution
   * @param positions - All positions
   * @param positionsPnL - P&L for each position
   * @param trades - All trade executions
   * @param dimensions - Dimensions to attribute by
   * @param transaction - Optional Sequelize transaction
   * @returns Multi-dimensional attribution results
   */
  async performMultiDimensionalAttribution(
    positions: Position[],
    positionsPnL: PositionPnL[],
    trades: TradeExecution[],
    dimensions: Array<'strategy' | 'assetClass' | 'sector' | 'geography' | 'trader'>,
    transaction?: Transaction
  ): Promise<Map<string, AttributionResult>> {
    try {
      this.logger.log('Performing multi-dimensional attribution');
      return multiDimensionalAttribution(positions, positionsPnL, trades, dimensions);
    } catch (error) {
      this.logger.error(`Error performing multi-dimensional attribution: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to perform multi-dimensional attribution');
    }
  }

  /**
   * Attribute P&L by instrument
   * @param positionsPnL - P&L for each position
   * @returns Instrument attribution result
   */
  async attributePnLByInstrument(
    positionsPnL: PositionPnL[]
  ): Promise<AttributionResult> {
    try {
      this.logger.log('Attributing P&L by instrument');

      const instrumentPnL = new Map<string, { pnl: Decimal; count: number }>();

      for (const positionPnL of positionsPnL) {
        const current = instrumentPnL.get(positionPnL.symbol) || { pnl: new Decimal(0), count: 0 };
        instrumentPnL.set(positionPnL.symbol, {
          pnl: current.pnl.plus(positionPnL.totalPnL as Decimal),
          count: current.count + 1,
        });
      }

      const totalPnL = positionsPnL.reduce(
        (sum, p) => sum.plus(p.totalPnL as Decimal),
        new Decimal(0)
      ) as PnL;

      const attributions: Attribution[] = [];
      for (const [instrument, data] of instrumentPnL.entries()) {
        const percentOfTotal = (totalPnL as Decimal).equals(0)
          ? createPercentage(0)
          : data.pnl.div(totalPnL as Decimal).times(100) as Percentage;

        attributions.push({
          dimension: 'instrument',
          category: instrument,
          pnl: data.pnl as PnL,
          percentOfTotal,
          tradeCount: data.count,
          avgPnLPerTrade: data.pnl.div(data.count) as PnL,
        });
      }

      return {
        totalPnL,
        attributions: attributions.sort((a, b) => (b.pnl as Decimal).comparedTo(a.pnl as Decimal)),
        unexplained: createPnL(0),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error attributing P&L by instrument: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to attribute P&L by instrument');
    }
  }

  /**
   * Attribute P&L by desk
   * @param realizedPnL - All realized P&L records from database
   * @returns Desk attribution result
   */
  async attributePnLByDesk(
    realizedPnL: RealizedPnLModel[]
  ): Promise<AttributionResult> {
    try {
      this.logger.log('Attributing P&L by desk');

      const deskPnL = new Map<string, { pnl: Decimal; tradeCount: number }>();

      for (const record of realizedPnL) {
        const deskId = record.deskId || 'UNKNOWN';
        const current = deskPnL.get(deskId) || { pnl: new Decimal(0), tradeCount: 0 };
        deskPnL.set(deskId, {
          pnl: current.pnl.plus(record.netPnL),
          tradeCount: current.tradeCount + 1,
        });
      }

      const totalPnL = realizedPnL.reduce(
        (sum, r) => sum.plus(r.netPnL),
        new Decimal(0)
      ) as PnL;

      const attributions: Attribution[] = [];
      for (const [desk, data] of deskPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
          ? createPercentage(0)
          : data.pnl.div(totalPnL as Decimal).times(100) as Percentage;

        attributions.push({
          dimension: 'desk',
          category: desk,
          pnl: data.pnl as PnL,
          percentOfTotal,
          tradeCount: data.tradeCount,
          avgPnLPerTrade: data.pnl.div(data.tradeCount) as PnL,
        });
      }

      return {
        totalPnL,
        attributions: attributions.sort((a, b) => (b.pnl as Decimal).comparedTo(a.pnl as Decimal)),
        unexplained: createPnL(0),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error attributing P&L by desk: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to attribute P&L by desk');
    }
  }

  // ============================================================================
  // CURRENCY P&L CALCULATIONS (Functions 19-20)
  // ============================================================================

  /**
   * Calculate FX transaction gains/losses
   * @param trades - Trades in foreign currency
   * @param fxRates - FX rates at trade time
   * @param settlementFxRates - FX rates at settlement
   * @returns Transaction FX P&L by currency
   */
  async calculateFXTransactionGainsLosses(
    trades: TradeExecution[],
    fxRates: Map<string, Decimal>,
    settlementFxRates: Map<string, Decimal>
  ): Promise<CurrencyPnL[]> {
    try {
      this.logger.log('Calculating FX transaction gains/losses');
      return calculateFXTransactionPnL(trades, fxRates, settlementFxRates);
    } catch (error) {
      this.logger.error(`Error calculating FX transaction P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate FX transaction P&L');
    }
  }

  /**
   * Calculate FX translation adjustments for positions
   * @param positions - Positions in foreign currencies
   * @param priorFxRates - FX rates from prior period
   * @param currentFxRates - Current FX rates
   * @returns Translation adjustments by currency
   */
  async calculateFXTranslationAdjustmentsForPositions(
    positions: Position[],
    priorFxRates: Map<string, Decimal>,
    currentFxRates: Map<string, Decimal>
  ): Promise<CurrencyPnL[]> {
    try {
      this.logger.log('Calculating FX translation adjustments');
      return calculateFXTranslationAdjustments(positions, priorFxRates, currentFxRates);
    } catch (error) {
      this.logger.error(`Error calculating FX translation adjustments: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate FX translation adjustments');
    }
  }

  // ============================================================================
  // TAX LOT ACCOUNTING (Functions 21-24)
  // ============================================================================

  /**
   * Create tax lot from purchase trade
   * @param trade - Purchase trade
   * @param transaction - Optional Sequelize transaction
   * @returns New tax lot
   */
  async createTaxLotFromTrade(
    trade: TradeExecution,
    transaction?: Transaction
  ): Promise<TaxLot> {
    try {
      this.logger.log(`Creating tax lot for instrument ${trade.instrumentId}`);
      const taxLot = createTaxLot(trade);

      // Persist to database
      await TaxLotModel.create(
        {
          lotId: taxLot.lotId,
          instrumentId: taxLot.instrumentId,
          symbol: taxLot.symbol,
          acquisitionDate: taxLot.acquisitionDate,
          quantity: (taxLot.quantity as Decimal).toNumber(),
          costBasis: (taxLot.costBasis as Decimal).toNumber(),
          averageCost: (taxLot.averageCost as Decimal).toNumber(),
          remainingQuantity: (taxLot.remainingQuantity as Decimal).toNumber(),
          remainingCostBasis: (taxLot.remainingCostBasis as Decimal).toNumber(),
          status: taxLot.status,
          accountId: trade.accountId,
          taxYear: new Date().getFullYear(),
          metadata: {},
        },
        { transaction }
      );

      return taxLot;
    } catch (error) {
      this.logger.error(`Error creating tax lot: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create tax lot');
    }
  }

  /**
   * Allocate sale to tax lots using FIFO method
   * @param taxLots - Available tax lots
   * @param saleQuantity - Quantity being sold
   * @param salePrice - Sale price
   * @param saleDate - Sale date
   * @returns Tax lot allocations
   */
  async allocateTaxLotsFIFOMethod(
    taxLots: TaxLot[],
    saleQuantity: Quantity,
    salePrice: Price,
    saleDate: Date
  ): Promise<TaxLotAllocation[]> {
    try {
      this.logger.log('Allocating tax lots using FIFO method');
      return allocateTaxLotsFIFO(taxLots, saleQuantity, salePrice, saleDate);
    } catch (error) {
      this.logger.error(`Error allocating tax lots (FIFO): ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to allocate tax lots using FIFO');
    }
  }

  /**
   * Allocate sale to tax lots using LIFO method
   * @param taxLots - Available tax lots
   * @param saleQuantity - Quantity being sold
   * @param salePrice - Sale price
   * @param saleDate - Sale date
   * @returns Tax lot allocations
   */
  async allocateTaxLotsLIFOMethod(
    taxLots: TaxLot[],
    saleQuantity: Quantity,
    salePrice: Price,
    saleDate: Date
  ): Promise<TaxLotAllocation[]> {
    try {
      this.logger.log('Allocating tax lots using LIFO method');
      return allocateTaxLotsLIFO(taxLots, saleQuantity, salePrice, saleDate);
    } catch (error) {
      this.logger.error(`Error allocating tax lots (LIFO): ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to allocate tax lots using LIFO');
    }
  }

  /**
   * Calculate average cost basis across all tax lots
   * @param taxLots - All tax lots for instrument
   * @returns Average cost per share
   */
  async calculateAverageCostBasis(
    taxLots: TaxLot[]
  ): Promise<Price> {
    try {
      this.logger.log('Calculating average cost basis');
      return calculateAverageCost(taxLots);
    } catch (error) {
      this.logger.error(`Error calculating average cost: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate average cost');
    }
  }

  // ============================================================================
  // P&L RECONCILIATION (Functions 25-27)
  // ============================================================================

  /**
   * Reconcile book P&L vs street P&L
   * @param bookPnL - Internal book P&L
   * @param streetPnL - Broker/custodian P&L
   * @param portfolioId - Portfolio identifier
   * @param tolerance - Acceptable variance threshold
   * @param transaction - Optional Sequelize transaction
   * @returns Reconciliation result
   */
  async reconcileBookVsStreetPnL(
    bookPnL: PnL,
    streetPnL: PnL,
    portfolioId: string,
    tolerance: Decimal = new Decimal(0.01),
    transaction?: Transaction
  ): Promise<ReconciliationResult> {
    try {
      this.logger.log('Reconciling book vs street P&L');
      const reconciliation = reconcilePnL(bookPnL, streetPnL, tolerance);

      // Persist reconciliation result
      await PnLReconciliationModel.create(
        {
          reconciliationId: reconciliation.reconciliationId,
          date: reconciliation.date,
          portfolioId,
          bookPnL: (reconciliation.bookPnL as Decimal).toNumber(),
          streetPnL: (reconciliation.streetPnL as Decimal).toNumber(),
          variance: (reconciliation.variance as Decimal).toNumber(),
          variancePercent: (reconciliation.variancePercent as Decimal).toNumber(),
          status: reconciliation.status === 'MATCHED'
            ? ReconciliationStatus.MATCHED
            : ReconciliationStatus.BROKEN,
          breaks: reconciliation.breaks,
          resolvedBy: null,
          resolvedAt: null,
          comments: '',
          metadata: {},
        },
        { transaction }
      );

      return reconciliation;
    } catch (error) {
      this.logger.error(`Error reconciling P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to reconcile P&L');
    }
  }

  /**
   * Identify reconciliation breaks between book and street
   * @param bookPositions - Internal book positions
   * @param streetPositions - Broker positions
   * @returns List of reconciliation breaks
   */
  async identifyPnLReconciliationBreaks(
    bookPositions: Map<string, Position>,
    streetPositions: Map<string, { quantity: Quantity; price: Price }>
  ): Promise<ReconciliationBreak[]> {
    try {
      this.logger.log('Identifying reconciliation breaks');
      return identifyReconciliationBreaks(bookPositions, streetPositions);
    } catch (error) {
      this.logger.error(`Error identifying breaks: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to identify reconciliation breaks');
    }
  }

  /**
   * End-of-day P&L reconciliation process
   * @param portfolioId - Portfolio identifier
   * @param businessDate - Business date for reconciliation
   * @param transaction - Optional Sequelize transaction
   * @returns End-of-day reconciliation summary
   */
  async performEndOfDayReconciliation(
    portfolioId: string,
    businessDate: Date,
    transaction?: Transaction
  ): Promise<{
    totalBookPnL: PnL;
    totalStreetPnL: PnL;
    totalVariance: PnL;
    breakCount: number;
    status: ReconciliationStatus;
  }> {
    try {
      this.logger.log(`Performing end-of-day reconciliation for ${portfolioId}`);

      // Fetch all P&L records for the day
      const snapshots = await PnLSnapshotModel.findAll({
        where: {
          portfolioId,
          timestamp: {
            [Op.gte]: new Date(businessDate.setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(businessDate.setHours(23, 59, 59, 999)),
          },
        },
        transaction,
      });

      if (snapshots.length === 0) {
        throw new NotFoundException('No P&L snapshots found for reconciliation');
      }

      const lastSnapshot = snapshots[snapshots.length - 1];
      const totalBookPnL = createPnL(lastSnapshot.netPnL);

      // In production, would fetch street P&L from broker API
      const totalStreetPnL = createPnL(lastSnapshot.netPnL * 0.999); // Simulated

      const reconciliation = reconcilePnL(totalBookPnL, totalStreetPnL);

      return {
        totalBookPnL,
        totalStreetPnL,
        totalVariance: reconciliation.variance,
        breakCount: reconciliation.breaks.length,
        status: reconciliation.status === 'MATCHED'
          ? ReconciliationStatus.MATCHED
          : ReconciliationStatus.BROKEN,
      };
    } catch (error) {
      this.logger.error(`Error in end-of-day reconciliation: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to perform end-of-day reconciliation');
    }
  }

  // ============================================================================
  // HISTORICAL P&L REPORTING (Functions 28-31)
  // ============================================================================

  /**
   * Generate comprehensive P&L report for period
   * @param snapshots - All P&L snapshots
   * @param startDate - Period start
   * @param endDate - Period end
   * @param portfolioId - Portfolio ID
   * @param reportType - Report type
   * @param transaction - Optional Sequelize transaction
   * @returns Comprehensive P&L report
   */
  async generateComprehensivePnLReport(
    snapshots: PnLSnapshot[],
    startDate: Date,
    endDate: Date,
    portfolioId: string,
    reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'INCEPTION',
    transaction?: Transaction
  ): Promise<PnLReport> {
    try {
      this.logger.log(`Generating ${reportType} P&L report for ${portfolioId}`);
      return generatePnLReport(snapshots, startDate, endDate, portfolioId, reportType);
    } catch (error) {
      this.logger.error(`Error generating P&L report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate P&L report');
    }
  }

  /**
   * Calculate Month-to-Date P&L
   * @param snapshots - All snapshots
   * @param portfolioId - Portfolio ID
   * @returns MTD P&L
   */
  async calculateMonthToDatePnL(
    snapshots: PnLSnapshot[],
    portfolioId: string
  ): Promise<PnL> {
    try {
      this.logger.log('Calculating Month-to-Date P&L');
      return calculateMTDPnL(snapshots, portfolioId);
    } catch (error) {
      this.logger.error(`Error calculating MTD P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate MTD P&L');
    }
  }

  /**
   * Calculate Year-to-Date P&L
   * @param snapshots - All snapshots
   * @param portfolioId - Portfolio ID
   * @returns YTD P&L
   */
  async calculateYearToDatePnL(
    snapshots: PnLSnapshot[],
    portfolioId: string
  ): Promise<PnL> {
    try {
      this.logger.log('Calculating Year-to-Date P&L');
      return calculateYTDPnL(snapshots, portfolioId);
    } catch (error) {
      this.logger.error(`Error calculating YTD P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate YTD P&L');
    }
  }

  /**
   * Calculate Since-Inception P&L
   * @param snapshots - All snapshots
   * @param portfolioId - Portfolio ID
   * @param inceptionDate - Portfolio inception date
   * @returns Since-inception P&L
   */
  async calculateSinceInceptionPnL(
    snapshots: PnLSnapshot[],
    portfolioId: string,
    inceptionDate: Date
  ): Promise<PnL> {
    try {
      this.logger.log('Calculating Since-Inception P&L');
      return calculateInceptionPnL(snapshots, portfolioId, inceptionDate);
    } catch (error) {
      this.logger.error(`Error calculating inception P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate inception P&L');
    }
  }

  // ============================================================================
  // RISK-ADJUSTED RETURNS (Functions 32-35)
  // ============================================================================

  /**
   * Calculate Sharpe ratio for portfolio
   * @param returns - Array of periodic returns
   * @param riskFreeRate - Risk-free rate (annualized)
   * @returns Sharpe ratio
   */
  async calculateSharpeRatio(
    returns: number[],
    riskFreeRate: number = 0.02
  ): Promise<number> {
    try {
      this.logger.log('Calculating Sharpe ratio');

      if (returns.length === 0) {
        return 0;
      }

      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev === 0) {
        return 0;
      }

      const periodsPerYear = 252; // Trading days
      const annualizedReturn = avgReturn * periodsPerYear;
      const annualizedStdDev = stdDev * Math.sqrt(periodsPerYear);

      return (annualizedReturn - riskFreeRate) / annualizedStdDev;
    } catch (error) {
      this.logger.error(`Error calculating Sharpe ratio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Sharpe ratio');
    }
  }

  /**
   * Calculate Sortino ratio (downside deviation-based Sharpe)
   * @param returns - Array of periodic returns
   * @param riskFreeRate - Risk-free rate (annualized)
   * @param targetReturn - Target return threshold
   * @returns Sortino ratio
   */
  async calculateSortinoRatio(
    returns: number[],
    riskFreeRate: number = 0.02,
    targetReturn: number = 0
  ): Promise<number> {
    try {
      this.logger.log('Calculating Sortino ratio');

      if (returns.length === 0) {
        return 0;
      }

      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

      // Calculate downside deviation (only negative returns)
      const downsideReturns = returns.filter(r => r < targetReturn);
      if (downsideReturns.length === 0) {
        return Infinity; // No downside
      }

      const downsideVariance = downsideReturns.reduce(
        (sum, r) => sum + Math.pow(r - targetReturn, 2),
        0
      ) / returns.length;
      const downsideDeviation = Math.sqrt(downsideVariance);

      if (downsideDeviation === 0) {
        return Infinity;
      }

      const periodsPerYear = 252;
      const annualizedReturn = avgReturn * periodsPerYear;
      const annualizedDownsideDev = downsideDeviation * Math.sqrt(periodsPerYear);

      return (annualizedReturn - riskFreeRate) / annualizedDownsideDev;
    } catch (error) {
      this.logger.error(`Error calculating Sortino ratio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Sortino ratio');
    }
  }

  /**
   * Calculate maximum drawdown
   * @param equityCurve - Equity curve over time
   * @returns Maximum drawdown details
   */
  async calculateMaximumDrawdown(
    equityCurve: Array<{ date: Date; value: number }>
  ): Promise<{
    maxDrawdown: number;
    maxDrawdownPercent: number;
    peakValue: number;
    troughValue: number;
    peakDate: Date;
    troughDate: Date;
    recoveryDate: Date | null;
    duration: number;
  }> {
    try {
      this.logger.log('Calculating maximum drawdown');

      if (equityCurve.length === 0) {
        throw new BadRequestException('Equity curve cannot be empty');
      }

      let maxDrawdown = 0;
      let maxDrawdownPercent = 0;
      let peakValue = equityCurve[0].value;
      let peakDate = equityCurve[0].date;
      let troughValue = equityCurve[0].value;
      let troughDate = equityCurve[0].date;
      let recoveryDate: Date | null = null;
      let currentPeak = equityCurve[0].value;
      let currentPeakDate = equityCurve[0].date;

      for (let i = 1; i < equityCurve.length; i++) {
        const point = equityCurve[i];

        if (point.value > currentPeak) {
          currentPeak = point.value;
          currentPeakDate = point.date;
        }

        const drawdown = currentPeak - point.value;
        const drawdownPercent = (drawdown / currentPeak) * 100;

        if (drawdownPercent > maxDrawdownPercent) {
          maxDrawdown = drawdown;
          maxDrawdownPercent = drawdownPercent;
          peakValue = currentPeak;
          peakDate = currentPeakDate;
          troughValue = point.value;
          troughDate = point.date;
          recoveryDate = null;
        } else if (maxDrawdownPercent > 0 && point.value >= peakValue && !recoveryDate) {
          recoveryDate = point.date;
        }
      }

      const duration = recoveryDate
        ? Math.floor((recoveryDate.getTime() - peakDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((new Date().getTime() - peakDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        maxDrawdown,
        maxDrawdownPercent,
        peakValue,
        troughValue,
        peakDate,
        troughDate,
        recoveryDate,
        duration,
      };
    } catch (error) {
      this.logger.error(`Error calculating maximum drawdown: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate maximum drawdown');
    }
  }

  /**
   * Calculate Calmar ratio (return / max drawdown)
   * @param annualizedReturn - Annualized return
   * @param maxDrawdownPercent - Maximum drawdown percentage
   * @returns Calmar ratio
   */
  async calculateCalmarRatio(
    annualizedReturn: number,
    maxDrawdownPercent: number
  ): Promise<number> {
    try {
      this.logger.log('Calculating Calmar ratio');

      if (maxDrawdownPercent === 0) {
        return Infinity;
      }

      return annualizedReturn / Math.abs(maxDrawdownPercent);
    } catch (error) {
      this.logger.error(`Error calculating Calmar ratio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Calmar ratio');
    }
  }

  // ============================================================================
  // GREEKS P&L ATTRIBUTION (Functions 36-40)
  // ============================================================================

  /**
   * Calculate Delta P&L attribution
   * @param positions - Options positions
   * @param underlyingPriceChange - Change in underlying price
   * @returns Delta P&L impact
   */
  async calculateDeltaPnLAttribution(
    positions: Array<{ delta: number; quantity: number; multiplier: number }>,
    underlyingPriceChange: number
  ): Promise<{ deltaPnL: number; totalDelta: number }> {
    try {
      this.logger.log('Calculating Delta P&L attribution');

      let totalDelta = 0;
      let deltaPnL = 0;

      for (const position of positions) {
        const positionDelta = position.delta * position.quantity * position.multiplier;
        totalDelta += positionDelta;
        deltaPnL += positionDelta * underlyingPriceChange;
      }

      return { deltaPnL, totalDelta };
    } catch (error) {
      this.logger.error(`Error calculating Delta P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Delta P&L');
    }
  }

  /**
   * Calculate Gamma P&L attribution
   * @param positions - Options positions
   * @param underlyingPriceChange - Change in underlying price
   * @returns Gamma P&L impact
   */
  async calculateGammaPnLAttribution(
    positions: Array<{ gamma: number; quantity: number; multiplier: number }>,
    underlyingPriceChange: number
  ): Promise<{ gammaPnL: number; totalGamma: number }> {
    try {
      this.logger.log('Calculating Gamma P&L attribution');

      let totalGamma = 0;
      let gammaPnL = 0;

      for (const position of positions) {
        const positionGamma = position.gamma * position.quantity * position.multiplier;
        totalGamma += positionGamma;
        // Gamma P&L = 0.5 * Gamma * (Price Change)^2
        gammaPnL += 0.5 * positionGamma * Math.pow(underlyingPriceChange, 2);
      }

      return { gammaPnL, totalGamma };
    } catch (error) {
      this.logger.error(`Error calculating Gamma P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Gamma P&L');
    }
  }

  /**
   * Calculate Vega P&L attribution
   * @param positions - Options positions
   * @param volatilityChange - Change in implied volatility
   * @returns Vega P&L impact
   */
  async calculateVegaPnLAttribution(
    positions: Array<{ vega: number; quantity: number; multiplier: number }>,
    volatilityChange: number
  ): Promise<{ vegaPnL: number; totalVega: number }> {
    try {
      this.logger.log('Calculating Vega P&L attribution');

      let totalVega = 0;
      let vegaPnL = 0;

      for (const position of positions) {
        const positionVega = position.vega * position.quantity * position.multiplier;
        totalVega += positionVega;
        vegaPnL += positionVega * volatilityChange;
      }

      return { vegaPnL, totalVega };
    } catch (error) {
      this.logger.error(`Error calculating Vega P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Vega P&L');
    }
  }

  /**
   * Calculate Theta P&L attribution (time decay)
   * @param positions - Options positions
   * @param daysElapsed - Number of days elapsed
   * @returns Theta P&L impact
   */
  async calculateThetaPnLAttribution(
    positions: Array<{ theta: number; quantity: number; multiplier: number }>,
    daysElapsed: number = 1
  ): Promise<{ thetaPnL: number; totalTheta: number }> {
    try {
      this.logger.log('Calculating Theta P&L attribution');

      let totalTheta = 0;
      let thetaPnL = 0;

      for (const position of positions) {
        const positionTheta = position.theta * position.quantity * position.multiplier;
        totalTheta += positionTheta;
        thetaPnL += positionTheta * daysElapsed;
      }

      return { thetaPnL, totalTheta };
    } catch (error) {
      this.logger.error(`Error calculating Theta P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Theta P&L');
    }
  }

  /**
   * Calculate Rho P&L attribution (interest rate sensitivity)
   * @param positions - Options positions
   * @param interestRateChange - Change in interest rate (in percentage points)
   * @returns Rho P&L impact
   */
  async calculateRhoPnLAttribution(
    positions: Array<{ rho: number; quantity: number; multiplier: number }>,
    interestRateChange: number
  ): Promise<{ rhoPnL: number; totalRho: number }> {
    try {
      this.logger.log('Calculating Rho P&L attribution');

      let totalRho = 0;
      let rhoPnL = 0;

      for (const position of positions) {
        const positionRho = position.rho * position.quantity * position.multiplier;
        totalRho += positionRho;
        rhoPnL += positionRho * interestRateChange;
      }

      return { rhoPnL, totalRho };
    } catch (error) {
      this.logger.error(`Error calculating Rho P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate Rho P&L');
    }
  }

  // ============================================================================
  // CARRY & THETA P&L (Functions 41-42)
  // ============================================================================

  /**
   * Calculate carry P&L (funding costs, dividends, interest)
   * @param positions - Positions with carry characteristics
   * @param daysElapsed - Number of days
   * @returns Carry P&L details
   */
  async calculateCarryPnL(
    positions: Array<{
      instrumentId: string;
      quantity: number;
      fundingRate: number;
      dividendYield: number;
      interestRate: number;
      notional: number;
    }>,
    daysElapsed: number = 1
  ): Promise<{
    totalCarryPnL: number;
    fundingCosts: number;
    dividendIncome: number;
    interestIncome: number;
  }> {
    try {
      this.logger.log('Calculating carry P&L');

      let fundingCosts = 0;
      let dividendIncome = 0;
      let interestIncome = 0;

      const daysInYear = 365;

      for (const position of positions) {
        // Funding costs (negative carry for short positions)
        const fundingCost = position.notional * (position.fundingRate / 100) * (daysElapsed / daysInYear);
        fundingCosts += fundingCost;

        // Dividend income
        const dividend = position.notional * (position.dividendYield / 100) * (daysElapsed / daysInYear);
        dividendIncome += dividend;

        // Interest income
        const interest = position.notional * (position.interestRate / 100) * (daysElapsed / daysInYear);
        interestIncome += interest;
      }

      const totalCarryPnL = dividendIncome + interestIncome - fundingCosts;

      return {
        totalCarryPnL,
        fundingCosts,
        dividendIncome,
        interestIncome,
      };
    } catch (error) {
      this.logger.error(`Error calculating carry P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate carry P&L');
    }
  }

  /**
   * Calculate combined carry and theta P&L
   * @param optionsPositions - Options with theta
   * @param cashPositions - Cash/futures with carry
   * @param daysElapsed - Days elapsed
   * @returns Combined carry/theta P&L
   */
  async calculateCombinedCarryThetaPnL(
    optionsPositions: Array<{ theta: number; quantity: number; multiplier: number }>,
    cashPositions: Array<{
      instrumentId: string;
      quantity: number;
      fundingRate: number;
      dividendYield: number;
      interestRate: number;
      notional: number;
    }>,
    daysElapsed: number = 1
  ): Promise<{
    totalPnL: number;
    thetaPnL: number;
    carryPnL: number;
  }> {
    try {
      this.logger.log('Calculating combined carry and theta P&L');

      const thetaResult = await this.calculateThetaPnLAttribution(optionsPositions, daysElapsed);
      const carryResult = await this.calculateCarryPnL(cashPositions, daysElapsed);

      return {
        totalPnL: thetaResult.thetaPnL + carryResult.totalCarryPnL,
        thetaPnL: thetaResult.thetaPnL,
        carryPnL: carryResult.totalCarryPnL,
      };
    } catch (error) {
      this.logger.error(`Error calculating carry/theta P&L: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate carry/theta P&L');
    }
  }

  // ============================================================================
  // P&L EXPLAIN & VARIANCE ANALYSIS (Functions 43-45)
  // ============================================================================

  /**
   * Perform P&L explain analysis
   * @param actualPnL - Actual realized P&L
   * @param expectedPnL - Expected P&L from risk models
   * @param components - P&L component breakdown
   * @param transaction - Optional Sequelize transaction
   * @returns P&L explain breakdown
   */
  async performPnLExplainAnalysis(
    actualPnL: number,
    expectedPnL: number,
    components: Array<{
      category: PnLExplainCategory;
      description: string;
      impact: number;
    }>,
    portfolioId: string,
    date: Date,
    transaction?: Transaction
  ): Promise<{
    totalVariance: number;
    variancePercent: number;
    explained: number;
    unexplained: number;
    components: Array<{
      category: string;
      description: string;
      impact: number;
      percentOfTotal: number;
    }>;
  }> {
    try {
      this.logger.log('Performing P&L explain analysis');

      const totalVariance = actualPnL - expectedPnL;
      const variancePercent = expectedPnL !== 0 ? (totalVariance / Math.abs(expectedPnL)) * 100 : 0;

      const explainedTotal = components.reduce((sum, c) => sum + c.impact, 0);
      const unexplained = totalVariance - explainedTotal;

      const explainComponents = components.map(c => ({
        category: c.category,
        description: c.description,
        impact: c.impact,
        percentOfTotal: totalVariance !== 0 ? (c.impact / totalVariance) * 100 : 0,
      }));

      // Persist explain records
      for (const component of components) {
        await PnLExplainModel.create(
          {
            explainId: `EXPL-${Date.now()}-${Math.random()}`,
            portfolioId,
            date,
            category: component.category,
            description: component.description,
            impact: component.impact,
            percentOfTotal: totalVariance !== 0 ? (component.impact / totalVariance) * 100 : 0,
            relatedInstruments: [],
            verified: false,
            verifiedBy: null,
            metadata: {},
          },
          { transaction }
        );
      }

      return {
        totalVariance,
        variancePercent,
        explained: explainedTotal,
        unexplained,
        components: explainComponents,
      };
    } catch (error) {
      this.logger.error(`Error performing P&L explain: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to perform P&L explain analysis');
    }
  }

  /**
   * Generate P&L waterfall analysis
   * @param startingPnL - Starting P&L
   * @param components - Sequential P&L components
   * @returns Waterfall breakdown
   */
  async generatePnLWaterfallAnalysis(
    startingPnL: number,
    components: Array<{
      name: string;
      value: number;
      isAdditive: boolean;
    }>
  ): Promise<{
    startingPnL: number;
    endingPnL: number;
    totalChange: number;
    waterfall: Array<{
      name: string;
      value: number;
      cumulativeValue: number;
      isAdditive: boolean;
    }>;
  }> {
    try {
      this.logger.log('Generating P&L waterfall analysis');

      let cumulativeValue = startingPnL;
      const waterfall = [];

      for (const component of components) {
        const value = component.isAdditive ? component.value : -component.value;
        cumulativeValue += value;

        waterfall.push({
          name: component.name,
          value,
          cumulativeValue,
          isAdditive: component.isAdditive,
        });
      }

      return {
        startingPnL,
        endingPnL: cumulativeValue,
        totalChange: cumulativeValue - startingPnL,
        waterfall,
      };
    } catch (error) {
      this.logger.error(`Error generating waterfall: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate P&L waterfall');
    }
  }

  /**
   * Calculate VaR impact on P&L
   * @param portfolioPnL - Portfolio P&L
   * @param valueAtRisk - Value at Risk (95% confidence)
   * @param conditionalVaR - Conditional VaR (expected shortfall)
   * @returns VaR impact analysis
   */
  async calculateVaRImpactOnPnL(
    portfolioPnL: number,
    valueAtRisk: number,
    conditionalVaR: number
  ): Promise<{
    pnl: number;
    var95: number;
    cvar95: number;
    varUtilization: number;
    isBreached: boolean;
    excessLoss: number;
  }> {
    try {
      this.logger.log('Calculating VaR impact on P&L');

      const varUtilization = (Math.abs(portfolioPnL) / valueAtRisk) * 100;
      const isBreached = Math.abs(portfolioPnL) > valueAtRisk;
      const excessLoss = isBreached ? Math.abs(portfolioPnL) - valueAtRisk : 0;

      return {
        pnl: portfolioPnL,
        var95: valueAtRisk,
        cvar95: conditionalVaR,
        varUtilization,
        isBreached,
        excessLoss,
      };
    } catch (error) {
      this.logger.error(`Error calculating VaR impact: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate VaR impact');
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER - REST API ENDPOINTS
// ============================================================================

/**
 * @class PnLCalculationAttributionController
 * @description REST API controller for P&L calculation and attribution
 * Exposes Bloomberg Terminal P&L analytics via HTTP endpoints
 */
@ApiTags('P&L Calculation & Attribution')
@Controller('api/v1/pnl')
export class PnLCalculationAttributionController {
  private readonly logger = new Logger(PnLCalculationAttributionController.name);

  constructor(private readonly pnlService: PnLCalculationAttributionService) {}

  /**
   * Calculate real-time portfolio P&L
   */
  @Post('calculate/realtime')
  @HttpCode(200)
  @ApiOperation({ summary: 'Calculate real-time portfolio P&L' })
  @ApiResponse({ status: 200, description: 'P&L calculated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async calculateRealtimePnL(
    @Body() body: {
      positions: Position[];
      currentPrices: Record<string, number>;
      portfolioId: string;
      accountId: string;
    }
  ): Promise<PnLSnapshot> {
    this.logger.log('REST API: Calculate real-time P&L');

    const priceMap = new Map<string, Price>();
    for (const [instrumentId, price] of Object.entries(body.currentPrices)) {
      priceMap.set(instrumentId, createPrice(price));
    }

    return await this.pnlService.calculatePortfolioPnLRealtime(
      body.positions,
      priceMap,
      body.portfolioId,
      body.accountId
    );
  }

  /**
   * Generate P&L attribution report
   */
  @Post('attribution/multi-dimensional')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate multi-dimensional P&L attribution' })
  @ApiResponse({ status: 200, description: 'Attribution calculated successfully' })
  async generateAttribution(
    @Body() body: {
      positions: Position[];
      positionsPnL: PositionPnL[];
      trades: TradeExecution[];
      dimensions: Array<'strategy' | 'assetClass' | 'sector' | 'geography' | 'trader'>;
    }
  ): Promise<Map<string, AttributionResult>> {
    this.logger.log('REST API: Generate multi-dimensional attribution');

    return await this.pnlService.performMultiDimensionalAttribution(
      body.positions,
      body.positionsPnL,
      body.trades,
      body.dimensions
    );
  }

  /**
   * Calculate Sharpe ratio
   */
  @Get('metrics/sharpe-ratio')
  @ApiOperation({ summary: 'Calculate Sharpe ratio' })
  @ApiQuery({ name: 'returns', type: String, description: 'Comma-separated returns' })
  @ApiQuery({ name: 'riskFreeRate', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Sharpe ratio calculated' })
  async getSharpeRatio(
    @Query('returns') returnsStr: string,
    @Query('riskFreeRate') riskFreeRate?: number
  ): Promise<{ sharpeRatio: number }> {
    this.logger.log('REST API: Calculate Sharpe ratio');

    const returns = returnsStr.split(',').map(r => parseFloat(r));
    const sharpeRatio = await this.pnlService.calculateSharpeRatio(returns, riskFreeRate);

    return { sharpeRatio };
  }

  /**
   * Perform end-of-day reconciliation
   */
  @Post('reconciliation/end-of-day')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perform end-of-day P&L reconciliation' })
  @ApiResponse({ status: 200, description: 'Reconciliation completed' })
  async performEodReconciliation(
    @Body() body: {
      portfolioId: string;
      businessDate: string;
    }
  ): Promise<any> {
    this.logger.log('REST API: Perform end-of-day reconciliation');

    return await this.pnlService.performEndOfDayReconciliation(
      body.portfolioId,
      new Date(body.businessDate)
    );
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export {
  PnLCalculationAttributionService,
  PnLCalculationAttributionController,
  PnLSnapshotModel,
  RealizedPnLModel,
  UnrealizedPnLModel,
  PnLAttributionModel,
  IntradayPnLModel,
  TaxLotModel,
  PnLReconciliationModel,
  PnLExplainModel,
  GreeksPnLModel,
  RiskAdjustedReturnModel,
  initPnLSnapshotModel,
  initRealizedPnLModel,
};

/**
 * Initialize all P&L models
 */
export function initializePnLModels(sequelize: Sequelize): void {
  initPnLSnapshotModel(sequelize);
  initRealizedPnLModel(sequelize);
  // Additional model initializations would go here
}

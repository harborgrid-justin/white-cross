/**
 * LOC: WC-COMP-TRADING-COMM-001
 * File: /reuse/trading/composites/commodities-trading-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../commodities-trading-kit
 *   - ../market-data-models-kit
 *
 * DOWNSTREAM (imported by):
 *   - Commodity trading controllers
 *   - Trading execution engines
 *   - Risk management systems
 *   - Market data services
 */

/**
 * File: /reuse/trading/composites/commodities-trading-analytics-composite.ts
 * Locator: WC-COMP-TRADING-COMM-001
 * Purpose: Bloomberg Terminal-Quality Commodity Futures & Physical Trading Analytics
 *
 * Upstream: @nestjs/common, sequelize, commodities-trading-kit, market-data-models-kit
 * Downstream: Trading controllers, execution engines, risk services, analytics dashboards
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 44 composed functions for commodity futures pricing, physical delivery analytics,
 * energy market analysis, precious metals trading, agricultural commodities, spread trading,
 * contango/backwardation analysis, storage cost optimization, hedge ratio calculation,
 * seasonal pattern analysis, and commodity index construction
 *
 * LLM Context: Enterprise-grade commodity trading analytics composite for professional
 * institutional trading. Provides Bloomberg Terminal-quality functionality for commodity futures
 * pricing (WTI/Brent, NG, Power, Metals), physical delivery specifications, energy markets,
 * metals trading (precious and base), agricultural commodities (grains, softs, livestock),
 * spread trading (calendar, inter-commodity, location, crack, spark), contango/backwardation
 * detection, term structure analysis, storage and transportation cost optimization, hedge ratio
 * optimization, seasonal pattern extraction, inventory analysis, supply/demand analytics, and
 * commodity index methodologies (equal-weight, production-weight, liquidity-weight).
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
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';

import {
  calculateFuturesFairValue,
  calculateCostOfCarry,
  calculateFuturesConvergence,
  calculateFuturesBasis,
  calculateRollYield,
  calculateFuturesImpliedRate,
  adjustCommodityQuality,
  calculateLocationDifferential,
  calculateDeliveryCost,
  calculateStorageCost,
  validatePhysicalDelivery,
  calculateWTIBrentSpread,
  calculateCrackSpread,
  calculateSparkSpread,
  calculateNaturalGasHeatRate,
  calculateEnergyBasisDifferential,
  calculatePowerLoadShape,
  optimizeEnergyStorage,
  calculateEnergyTransportCost,
  calculatePreciousMetalLease,
  calculateBaseMetalPremium,
  calculateLMEWarehouseFinancing,
  calculateMetalsPurityAdjustment,
  calculateGoldSilverRatio,
  calculateMetalsCarryTrade,
  calculateGrainBasisPattern,
  calculateCropCalendarImpact,
  calculateLivestockCostOfGain,
  adjustCommodityGrade,
  calculateSoftsCertificationPremium,
  calculateCalendarSpread,
  calculateInterCommoditySpread,
  calculateLocationSpread,
  calculateQualitySpread,
  optimizeSpreadExecution,
  calculateSpreadRollCost,
  detectContangoBackwardation,
  calculateTermStructureSlope,
  calculateRollYieldFromCurve,
  analyzeCurvePositioning,
  calculateStorageEconomics,
  calculateTransportationCost,
  optimizeLocationArbitrage,
  calculateMinimumVarianceHedge,
  calculateBasisRisk,
  extractSeasonalPattern,
  CommodityContract,
  CommodityFuturesQuote,
  CommoditySpread,
  TermStructure,
  StorageCost,
  SeasonalPattern,
  CommodityIndex,
  CommodityType,
  CommodityClass,
} from '../commodities-trading-kit';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Trading strategy types
 */
export enum TradingStrategyType {
  CALENDAR_SPREAD = 'calendar_spread',
  INTER_COMMODITY = 'inter_commodity',
  LOCATION_SPREAD = 'location_spread',
  QUALITY_SPREAD = 'quality_spread',
  CRACK_SPREAD = 'crack_spread',
  SPARK_SPREAD = 'spark_spread',
  CARRY_TRADE = 'carry_trade',
  ARBITRAGE = 'arbitrage',
}

/**
 * Physical delivery status
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  NOTICE_ISSUED = 'notice_issued',
  IN_TRANSIT = 'in_transit',
  AT_WAREHOUSE = 'at_warehouse',
  DELIVERED = 'delivered',
  SETTLED = 'settled',
}

/**
 * Market condition types
 */
export enum MarketCondition {
  CONTANGO = 'contango',
  BACKWARDATION = 'backwardation',
  FLAT = 'flat',
}

// ============================================================================
// SEQUELIZE MODEL: CommodityFuturesPosition
// ============================================================================

/**
 * TypeScript interface for CommodityFuturesPosition attributes
 */
export interface CommodityFuturesPositionAttributes {
  id: string;
  symbol: string;
  contractType: CommodityType;
  contractClass: CommodityClass;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  deliveryMonth: Date;
  exchange: string;
  isLong: boolean;
  unrealizedPnL: number;
  collateral: number;
  leverage: number;
  riskMetrics: Record<string, number>;
  marketValue: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CommodityFuturesPositionCreationAttributes
  extends Optional<
    CommodityFuturesPositionAttributes,
    'id' | 'unrealizedPnL' | 'riskMetrics' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: CommodityFuturesPosition
 * Tracks commodity futures positions with pricing and risk metrics
 */
export class CommodityFuturesPosition
  extends Model<
    CommodityFuturesPositionAttributes,
    CommodityFuturesPositionCreationAttributes
  >
  implements CommodityFuturesPositionAttributes
{
  declare id: string;
  declare symbol: string;
  declare contractType: CommodityType;
  declare contractClass: CommodityClass;
  declare quantity: number;
  declare entryPrice: number;
  declare currentPrice: number;
  declare deliveryMonth: Date;
  declare exchange: string;
  declare isLong: boolean;
  declare unrealizedPnL: number;
  declare collateral: number;
  declare leverage: number;
  declare riskMetrics: Record<string, number>;
  declare marketValue: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  declare getPhysicalDeliveries: HasManyGetAssociationsMixin<PhysicalDelivery>;
  declare getSpreadLegs: HasManyGetAssociationsMixin<SpreadLeg>;

  declare static associations: {
    physicalDeliveries: Association<CommodityFuturesPosition, PhysicalDelivery>;
    spreadLegs: Association<CommodityFuturesPosition, SpreadLeg>;
  };

  /**
   * Initialize CommodityFuturesPosition with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CommodityFuturesPosition {
    CommodityFuturesPosition.init(
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
        contractType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'contract_type',
        },
        contractClass: {
          type: DataTypes.ENUM('Energy', 'Metals', 'Agricultural', 'Livestock', 'Softs'),
          allowNull: false,
          field: 'contract_class',
        },
        quantity: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'quantity',
        },
        entryPrice: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'entry_price',
        },
        currentPrice: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'current_price',
        },
        deliveryMonth: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'delivery_month',
        },
        exchange: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'exchange',
        },
        isLong: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_long',
        },
        unrealizedPnL: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'unrealized_pnl',
        },
        collateral: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'collateral',
        },
        leverage: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 1,
          field: 'leverage',
        },
        riskMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'risk_metrics',
        },
        marketValue: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'market_value',
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
        tableName: 'commodity_futures_positions',
        modelName: 'CommodityFuturesPosition',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['symbol'] },
          { fields: ['contract_type'] },
          { fields: ['delivery_month'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return CommodityFuturesPosition;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PhysicalDelivery
// ============================================================================

/**
 * TypeScript interface for PhysicalDelivery attributes
 */
export interface PhysicalDeliveryAttributes {
  id: string;
  positionId: string;
  commodity: CommodityType;
  grade: string;
  quantity: number;
  location: string;
  warehouseId: string;
  deliveryStatus: DeliveryStatus;
  deliveryDate: Date;
  expectedDate: Date;
  storageStart: Date;
  qualitySpecs: Record<string, number | string>;
  storageMonthly: number;
  insuranceCost: number;
  financingRate: number;
  totalCost: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PhysicalDeliveryCreationAttributes
  extends Optional<
    PhysicalDeliveryAttributes,
    'id' | 'qualitySpecs' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: PhysicalDelivery
 * Tracks physical commodity delivery and storage operations
 */
export class PhysicalDelivery
  extends Model<PhysicalDeliveryAttributes, PhysicalDeliveryCreationAttributes>
  implements PhysicalDeliveryAttributes
{
  declare id: string;
  declare positionId: string;
  declare commodity: CommodityType;
  declare grade: string;
  declare quantity: number;
  declare location: string;
  declare warehouseId: string;
  declare deliveryStatus: DeliveryStatus;
  declare deliveryDate: Date;
  declare expectedDate: Date;
  declare storageStart: Date;
  declare qualitySpecs: Record<string, number | string>;
  declare storageMonthly: number;
  declare insuranceCost: number;
  declare financingRate: number;
  declare totalCost: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  declare getPosition: BelongsToGetAssociationMixin<CommodityFuturesPosition>;

  declare static associations: {
    position: Association<PhysicalDelivery, CommodityFuturesPosition>;
  };

  /**
   * Initialize PhysicalDelivery with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof PhysicalDelivery {
    PhysicalDelivery.init(
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
            model: 'commodity_futures_positions',
            key: 'id',
          },
          field: 'position_id',
        },
        commodity: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'commodity',
        },
        grade: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'grade',
        },
        quantity: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'quantity',
        },
        location: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'location',
        },
        warehouseId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'warehouse_id',
        },
        deliveryStatus: {
          type: DataTypes.ENUM(...Object.values(DeliveryStatus)),
          allowNull: false,
          defaultValue: DeliveryStatus.PENDING,
          field: 'delivery_status',
        },
        deliveryDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'delivery_date',
        },
        expectedDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'expected_date',
        },
        storageStart: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'storage_start',
        },
        qualitySpecs: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'quality_specs',
        },
        storageMonthly: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'storage_monthly',
        },
        insuranceCost: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'insurance_cost',
        },
        financingRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'financing_rate',
        },
        totalCost: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
          field: 'total_cost',
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
        tableName: 'physical_deliveries',
        modelName: 'PhysicalDelivery',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['commodity'] },
          { fields: ['delivery_status'] },
          { fields: ['warehouse_id'] },
        ],
      }
    );

    return PhysicalDelivery;
  }
}

// ============================================================================
// SEQUELIZE MODEL: SpreadLeg
// ============================================================================

/**
 * TypeScript interface for SpreadLeg attributes
 */
export interface SpreadLegAttributes {
  id: string;
  positionId: string;
  legType: 'long' | 'short';
  commodity: CommodityType;
  quantity: number;
  price: number;
  deliveryMonth: Date;
  spreadType: TradingStrategyType;
  spreadValue: number;
  spreadRatio: number[];
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface SpreadLegCreationAttributes
  extends Optional<SpreadLegAttributes, 'id' | 'spreadValue' | 'updatedBy' | 'deletedAt'>
{}

/**
 * Sequelize Model: SpreadLeg
 * Represents individual legs of spread trading strategies
 */
export class SpreadLeg
  extends Model<SpreadLegAttributes, SpreadLegCreationAttributes>
  implements SpreadLegAttributes
{
  declare id: string;
  declare positionId: string;
  declare legType: 'long' | 'short';
  declare commodity: CommodityType;
  declare quantity: number;
  declare price: number;
  declare deliveryMonth: Date;
  declare spreadType: TradingStrategyType;
  declare spreadValue: number;
  declare spreadRatio: number[];
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  declare getPosition: BelongsToGetAssociationMixin<CommodityFuturesPosition>;

  declare static associations: {
    position: Association<SpreadLeg, CommodityFuturesPosition>;
  };

  /**
   * Initialize SpreadLeg with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof SpreadLeg {
    SpreadLeg.init(
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
            model: 'commodity_futures_positions',
            key: 'id',
          },
          field: 'position_id',
        },
        legType: {
          type: DataTypes.ENUM('long', 'short'),
          allowNull: false,
          field: 'leg_type',
        },
        commodity: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'commodity',
        },
        quantity: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'quantity',
        },
        price: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          field: 'price',
        },
        deliveryMonth: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'delivery_month',
        },
        spreadType: {
          type: DataTypes.ENUM(...Object.values(TradingStrategyType)),
          allowNull: false,
          field: 'spread_type',
        },
        spreadValue: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'spread_value',
        },
        spreadRatio: {
          type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 4)),
          allowNull: false,
          defaultValue: [],
          field: 'spread_ratio',
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
        tableName: 'spread_legs',
        modelName: 'SpreadLeg',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['spread_type'] },
          { fields: ['delivery_month'] },
        ],
      }
    );

    return SpreadLeg;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between commodity models
 */
export function defineCommodityModelAssociations(): void {
  CommodityFuturesPosition.hasMany(PhysicalDelivery, {
    foreignKey: 'positionId',
    as: 'physicalDeliveries',
    onDelete: 'CASCADE',
  });

  PhysicalDelivery.belongsTo(CommodityFuturesPosition, {
    foreignKey: 'positionId',
    as: 'position',
  });

  CommodityFuturesPosition.hasMany(SpreadLeg, {
    foreignKey: 'positionId',
    as: 'spreadLegs',
    onDelete: 'CASCADE',
  });

  SpreadLeg.belongsTo(CommodityFuturesPosition, {
    foreignKey: 'positionId',
    as: 'position',
  });
}

// ============================================================================
// COMMODITY FUTURES ANALYTICS SERVICE
// ============================================================================

/**
 * Swagger DTO for futures pricing request
 */
export class FuturesPricingRequestDto {
  @ApiProperty({ example: 50.0, description: 'Spot price' })
  spotPrice: number;

  @ApiProperty({ example: 2.5, description: 'Annual storage cost' })
  storageCostPerYear: number;

  @ApiProperty({ example: 0.05, description: 'Financing rate' })
  financingRate: number;

  @ApiProperty({ example: 0.02, description: 'Convenience yield' })
  convenienceYield: number;

  @ApiProperty({ example: 0.25, description: 'Time to maturity (years)' })
  timeToMaturity: number;
}

/**
 * Swagger DTO for term structure analysis
 */
export class TermStructureAnalysisDto {
  @ApiProperty({ description: 'Commodity type' })
  commodity: CommodityType;

  @ApiProperty({ type: [Object], description: 'Term structure curve points' })
  curve: TermStructurePoint[];

  @ApiProperty({ example: 45.5, description: 'Spot price' })
  spotPrice: number;

  @ApiProperty({ example: 'contango', enum: MarketCondition, description: 'Curve shape' })
  shape: MarketCondition;
}

interface TermStructurePoint {
  maturity: Date;
  daysToMaturity: number;
  price: number;
  impliedYield?: number;
}

/**
 * Injectable NestJS service for commodity trading analytics
 */
@Injectable()
@ApiTags('Commodity Trading Analytics')
export class CommoditiesTradingAnalyticsService {
  private readonly logger = new Logger(CommoditiesTradingAnalyticsService.name);

  // ========================================================================
  // FUTURES PRICING ANALYTICS (8 functions)
  // ========================================================================

  /**
   * Calculate commodity futures fair value
   * @param request FuturesPricingRequestDto containing spot price and cost of carry components
   * @returns Calculated fair value
   */
  async calculateFuturesFairValueAnalysis(
    request: FuturesPricingRequestDto
  ): Promise<number> {
    this.logger.debug(`Calculating futures fair value for spot: ${request.spotPrice}`);
    return calculateFuturesFairValue(
      request.spotPrice,
      request.storageCostPerYear,
      request.financingRate,
      request.convenienceYield,
      request.timeToMaturity
    );
  }

  /**
   * Analyze cost of carry from market prices
   */
  async analyzeCostOfCarry(
    spotPrice: number,
    futuresPrice: number,
    timeToMaturity: number
  ): Promise<number> {
    return calculateCostOfCarry(spotPrice, futuresPrice, timeToMaturity);
  }

  /**
   * Calculate futures basis and convergence metrics
   */
  async calculateBasisAndConvergence(
    currentFuturesPrice: number,
    spotPrice: number,
    daysToMaturity: number,
    initialBasis: number
  ): Promise<Record<string, number>> {
    const basis = calculateFuturesBasis(currentFuturesPrice, spotPrice, false);
    const convergence = calculateFuturesConvergence(
      currentFuturesPrice,
      spotPrice,
      daysToMaturity,
      initialBasis
    );

    return {
      currentBasis: basis,
      basisPercentage: calculateFuturesBasis(currentFuturesPrice, spotPrice, true),
      ...convergence,
    };
  }

  /**
   * Calculate roll yield from term structure
   */
  async analyzeRollYield(
    nearMonthPrice: number,
    farMonthPrice: number,
    daysToNearExpiry: number,
    daysBetweenContracts: number
  ): Promise<number> {
    return calculateRollYield(nearMonthPrice, farMonthPrice, daysToNearExpiry, daysBetweenContracts);
  }

  /**
   * Derive implied financing rate from futures prices
   */
  async deriveImpliedRate(
    spotPrice: number,
    futuresPrice: number,
    timeToMaturity: number,
    storageCost: number,
    convenienceYield: number
  ): Promise<number> {
    return calculateFuturesImpliedRate(
      spotPrice,
      futuresPrice,
      timeToMaturity,
      storageCost,
      convenienceYield
    );
  }

  /**
   * Analyze futures convergence pattern
   */
  async analyzeConvergencePattern(
    currentFuturesPrice: number,
    spotPrice: number,
    daysToMaturity: number,
    initialBasis: number
  ): Promise<Record<string, any>> {
    return calculateFuturesConvergence(
      currentFuturesPrice,
      spotPrice,
      daysToMaturity,
      initialBasis
    );
  }

  /**
   * Calculate commodity basis (futures - spot)
   */
  async calculateBasis(
    futuresPrice: number,
    spotPrice: number,
    asPercentage: boolean = false
  ): Promise<number> {
    return calculateFuturesBasis(futuresPrice, spotPrice, asPercentage);
  }

  /**
   * Analyze futures fair value vs market price
   */
  async analyzeFuturesMispricing(
    request: FuturesPricingRequestDto,
    marketPrice: number
  ): Promise<{
    fairValue: number;
    marketPrice: number;
    mispricing: number;
    mispricingPct: number;
  }> {
    const fairValue = await this.calculateFuturesFairValueAnalysis(request);
    const mispricing = marketPrice - fairValue;
    return {
      fairValue,
      marketPrice,
      mispricing,
      mispricingPct: (mispricing / fairValue) * 100,
    };
  }

  // ========================================================================
  // ENERGY MARKET ANALYTICS (5 functions)
  // ========================================================================

  /**
   * Calculate WTI-Brent spread
   */
  async analyzeWTIBrentSpread(wtiPrice: number, brentPrice: number): Promise<number> {
    return calculateWTIBrentSpread(wtiPrice, brentPrice);
  }

  /**
   * Calculate crack spread (petroleum refining economics)
   */
  async analyzeCrackSpread(
    crudePricePerBarrel: number,
    gasolinePricePerGallon: number,
    heatingOilPricePerGallon: number,
    refiningMarginPerBarrel: number
  ): Promise<number> {
    return calculateCrackSpread(
      crudePricePerBarrel,
      gasolinePricePerGallon,
      heatingOilPricePerGallon,
      refiningMarginPerBarrel
    );
  }

  /**
   * Calculate spark spread (power generation economics)
   */
  async analyzeSparkSpread(
    powerPricePerMWh: number,
    gasPricePerMMBtu: number,
    heatRate: number
  ): Promise<number> {
    return calculateSparkSpread(powerPricePerMWh, gasPricePerMMBtu, heatRate);
  }

  /**
   * Calculate natural gas heat rate
   */
  async calculateGasHeatRate(mmbtuInput: number, mwhOutput: number): Promise<number> {
    return calculateNaturalGasHeatRate(mmbtuInput, mwhOutput);
  }

  /**
   * Analyze energy basis differential
   */
  async analyzeEnergyBasisDifferential(
    hubPrice: number,
    deliveryPointPrice: number,
    transportCost: number
  ): Promise<number> {
    return calculateEnergyBasisDifferential(hubPrice, deliveryPointPrice, transportCost);
  }

  // ========================================================================
  // METALS TRADING ANALYTICS (4 functions)
  // ========================================================================

  /**
   * Calculate precious metal lease rate
   */
  async calculatePreciousMetalLeaseRate(
    spotPrice: number,
    forwardPrice: number,
    timeToMaturity: number,
    interestRate: number
  ): Promise<number> {
    return calculatePreciousMetalLease(spotPrice, forwardPrice, timeToMaturity, interestRate);
  }

  /**
   * Calculate base metal LME premium
   */
  async analyzeBaseMetalPremium(
    lmePrice: number,
    warrantPremium: number,
    interestRate: number,
    timeToDelivery: number
  ): Promise<number> {
    return calculateBaseMetalPremium(lmePrice, warrantPremium, interestRate, timeToDelivery);
  }

  /**
   * Calculate gold-silver ratio
   */
  async analyzeGoldSilverRatio(goldPrice: number, silverPrice: number): Promise<number> {
    return calculateGoldSilverRatio(goldPrice, silverPrice);
  }

  /**
   * Analyze metals carry trade
   */
  async analyzeMetalsCarryTrade(
    spotPrice: number,
    forwardPrice: number,
    loanRate: number,
    storageInsurance: number,
    timeToMaturity: number
  ): Promise<number> {
    return calculateMetalsCarryTrade(
      spotPrice,
      forwardPrice,
      loanRate,
      storageInsurance,
      timeToMaturity
    );
  }

  // ========================================================================
  // SPREAD TRADING ANALYTICS (7 functions)
  // ========================================================================

  /**
   * Calculate calendar spread
   */
  async analyzeCalendarSpread(
    nearMonthPrice: number,
    farMonthPrice: number,
    daysToNearExpiry: number,
    interestRate: number,
    storageRate: number
  ): Promise<number> {
    return calculateCalendarSpread(
      nearMonthPrice,
      farMonthPrice,
      daysToNearExpiry,
      interestRate,
      storageRate
    );
  }

  /**
   * Calculate inter-commodity spread
   */
  async analyzeInterCommoditySpread(
    commodity1Price: number,
    commodity2Price: number,
    ratio?: number
  ): Promise<number> {
    return calculateInterCommoditySpread(commodity1Price, commodity2Price, ratio);
  }

  /**
   * Calculate location spread
   */
  async analyzeLocationSpread(
    price1: number,
    price2: number,
    transportationCost: number,
    timeToMaturity: number,
    interestRate: number
  ): Promise<number> {
    return calculateLocationSpread(price1, price2, transportationCost, timeToMaturity, interestRate);
  }

  /**
   * Calculate quality spread
   */
  async analyzeQualitySpread(
    premiumPrice: number,
    discountPrice: number,
    qualityDifferential: number
  ): Promise<number> {
    return calculateQualitySpread(premiumPrice, discountPrice, qualityDifferential);
  }

  /**
   * Calculate spread roll cost
   */
  async analyzeSpreadRollCost(
    currentSpreadValue: number,
    futureSpreadValue: number,
    rollDays: number
  ): Promise<number> {
    return calculateSpreadRollCost(currentSpreadValue, futureSpreadValue, rollDays);
  }

  /**
   * Optimize spread execution strategy
   */
  async optimizeSpreadStrategy(
    longPrice: number,
    shortPrice: number,
    targetSpread: number,
    executionConstraints?: Record<string, any>
  ): Promise<Record<string, any>> {
    return optimizeSpreadExecution(longPrice, shortPrice, targetSpread, executionConstraints);
  }

  // ========================================================================
  // TERM STRUCTURE & CONTANGO/BACKWARDATION (5 functions)
  // ========================================================================

  /**
   * Detect contango vs backwardation market condition
   */
  async detectMarketCondition(
    spotPrice: number,
    curve: TermStructurePoint[]
  ): Promise<{
    condition: MarketCondition;
    slopeDays30: number;
    slopeDays90: number;
  }> {
    const detected = detectContangoBackwardation(spotPrice, curve);

    return {
      condition: (detected.condition as unknown as MarketCondition) || MarketCondition.FLAT,
      slopeDays30: detected.slopeDays30 || 0,
      slopeDays90: detected.slopeDays90 || 0,
    };
  }

  /**
   * Calculate term structure slope
   */
  async calculateTermStructureSlope(curve: TermStructurePoint[]): Promise<number> {
    return calculateTermStructureSlope(curve);
  }

  /**
   * Calculate roll yield from forward curve
   */
  async analyzeRollYieldFromCurve(curve: TermStructurePoint[]): Promise<number> {
    return calculateRollYieldFromCurve(curve);
  }

  /**
   * Analyze curve positioning
   */
  async analyzeCurvePositioning(
    currentPrice: number,
    curve: TermStructurePoint[]
  ): Promise<Record<string, any>> {
    return analyzeCurvePositioning(currentPrice, curve);
  }

  // ========================================================================
  // PHYSICAL DELIVERY & STORAGE ANALYTICS (4 functions)
  // ========================================================================

  /**
   * Calculate storage economics
   */
  async analyzeStorageEconomics(
    spotPrice: number,
    forwardPrice: number,
    storageCostPerMonth: number,
    insuranceCost: number,
    financingRate: number,
    timeToMaturity: number
  ): Promise<Record<string, number>> {
    return calculateStorageEconomics(
      spotPrice,
      forwardPrice,
      storageCostPerMonth,
      insuranceCost,
      financingRate,
      timeToMaturity
    );
  }

  /**
   * Calculate physical commodity quality adjustments
   */
  async adjustQualityPrice(
    basePrice: number,
    actualQuality: Record<string, number>,
    standardQuality: Record<string, number>,
    qualityPremiums: Record<string, number>
  ): Promise<number> {
    return adjustCommodityQuality(basePrice, actualQuality, standardQuality, qualityPremiums);
  }

  /**
   * Calculate total delivery cost
   */
  async calculateTotalDeliveryCost(
    quantity: number,
    transportCost: number,
    loadingCost: number,
    unloadingCost: number,
    insuranceCost: number,
    inspectionCost: number
  ): Promise<number> {
    return calculateDeliveryCost(
      quantity,
      transportCost,
      loadingCost,
      unloadingCost,
      insuranceCost,
      inspectionCost
    );
  }

  /**
   * Validate physical delivery specifications
   */
  async validatePhysicalDeliverySpecs(
    commodity: CommodityType,
    quantity: number,
    location: string,
    specs: Record<string, any>
  ): Promise<{ isValid: boolean; issues: string[] }> {
    return validatePhysicalDelivery(commodity, quantity, location, specs);
  }

  // ========================================================================
  // AGRICULTURAL COMMODITIES (3 functions)
  // ========================================================================

  /**
   * Analyze grain basis pattern
   */
  async analyzeGrainBasisPattern(
    futuresPrice: number,
    cashBasis: number,
    harvestDate: Date
  ): Promise<Record<string, any>> {
    return calculateGrainBasisPattern(futuresPrice, cashBasis, harvestDate);
  }

  /**
   * Calculate crop calendar impact on pricing
   */
  async analyzeCropCalendarImpact(
    commodity: CommodityType,
    plantingDate: Date,
    harvestDate: Date
  ): Promise<Record<string, any>> {
    return calculateCropCalendarImpact(commodity, plantingDate, harvestDate);
  }

  /**
   * Calculate livestock cost of gain
   */
  async calculateLivestockCostOfGain(
    feedPrice: number,
    feedConsumption: number,
    otherCosts: number,
    weightGain: number
  ): Promise<number> {
    return calculateLivestockCostOfGain(feedPrice, feedConsumption, otherCosts, weightGain);
  }

  // ========================================================================
  // HEDGE RATIO & RISK ANALYTICS (2 functions)
  // ========================================================================

  /**
   * Calculate minimum variance hedge ratio
   */
  async calculateMinVarianceHedgeRatio(
    spotPriceBeta: number,
    spreadData: number[],
    historicalVolatility: number
  ): Promise<number> {
    return calculateMinimumVarianceHedge(spotPriceBeta, spreadData, historicalVolatility);
  }

  /**
   * Analyze basis risk
   */
  async analyzeBasisRisk(
    hedgeRatio: number,
    spreadData: number[],
    timeHorizon: number
  ): Promise<Record<string, number>> {
    return calculateBasisRisk(hedgeRatio, spreadData, timeHorizon);
  }

  // ========================================================================
  // SEASONAL & SUPPLY/DEMAND ANALYTICS (2 functions)
  // ========================================================================

  /**
   * Extract seasonal pattern from historical data
   */
  async analyzeSeasonalPattern(
    commodity: CommodityType,
    monthlyPrices: number[]
  ): Promise<SeasonalPattern> {
    return extractSeasonalPattern(commodity, monthlyPrices);
  }

  /**
   * Calculate transportation cost for physical logistics
   */
  async analyzeTransportationCost(
    volume: number,
    distance: number,
    mode: 'pipeline' | 'rail' | 'truck' | 'ship',
    unitCostPerMile: number
  ): Promise<number> {
    return calculateEnergyTransportCost(volume, distance, mode, unitCostPerMile);
  }

  // ========================================================================
  // DATABASE OPERATIONS
  // ========================================================================

  /**
   * Create commodity futures position
   */
  async createFuturesPosition(
    data: CommodityFuturesPositionCreationAttributes,
    transaction?: Transaction
  ): Promise<CommodityFuturesPosition> {
    return await CommodityFuturesPosition.create(data, { transaction });
  }

  /**
   * Get position by ID with related data
   */
  async getPositionById(
    id: string,
    transaction?: Transaction
  ): Promise<CommodityFuturesPosition | null> {
    return await CommodityFuturesPosition.findByPk(id, {
      include: ['physicalDeliveries', 'spreadLegs'],
      transaction,
    });
  }

  /**
   * Get all active positions by commodity
   */
  async getActivePositions(
    commodity: CommodityType,
    transaction?: Transaction
  ): Promise<CommodityFuturesPosition[]> {
    return await CommodityFuturesPosition.findAll({
      where: {
        contractType: commodity,
        isActive: true,
      },
      include: ['physicalDeliveries', 'spreadLegs'],
      transaction,
    });
  }

  /**
   * Create physical delivery record
   */
  async createPhysicalDelivery(
    data: PhysicalDeliveryCreationAttributes,
    transaction?: Transaction
  ): Promise<PhysicalDelivery> {
    return await PhysicalDelivery.create(data, { transaction });
  }

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    updatedBy: string,
    transaction?: Transaction
  ): Promise<[number, PhysicalDelivery[]]> {
    return await PhysicalDelivery.update(
      { deliveryStatus: status, updatedBy },
      { where: { id: deliveryId }, returning: true, transaction }
    );
  }

  /**
   * Create spread leg for strategy
   */
  async createSpreadLeg(
    data: SpreadLegCreationAttributes,
    transaction?: Transaction
  ): Promise<SpreadLeg> {
    return await SpreadLeg.create(data, { transaction });
  }

  /**
   * Get spread analysis by position
   */
  async getSpreadAnalysis(
    positionId: string,
    transaction?: Transaction
  ): Promise<SpreadLeg[]> {
    return await SpreadLeg.findAll({
      where: { positionId },
      transaction,
    });
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all commodity trading models with Sequelize
 */
export function initializeCommoditiesModels(sequelize: Sequelize): void {
  CommodityFuturesPosition.initModel(sequelize);
  PhysicalDelivery.initModel(sequelize);
  SpreadLeg.initModel(sequelize);
  defineCommodityModelAssociations();
}

/**
 * Export all analytics functions from kit for direct access
 */
export {
  calculateFuturesFairValue,
  calculateCostOfCarry,
  calculateFuturesConvergence,
  calculateFuturesBasis,
  calculateRollYield,
  calculateFuturesImpliedRate,
  adjustCommodityQuality,
  calculateLocationDifferential,
  calculateDeliveryCost,
  calculateStorageCost,
  validatePhysicalDelivery,
  calculateWTIBrentSpread,
  calculateCrackSpread,
  calculateSparkSpread,
  calculateNaturalGasHeatRate,
  calculateEnergyBasisDifferential,
  calculatePowerLoadShape,
  optimizeEnergyStorage,
  calculateEnergyTransportCost,
  calculatePreciousMetalLease,
  calculateBaseMetalPremium,
  calculateLMEWarehouseFinancing,
  calculateMetalsPurityAdjustment,
  calculateGoldSilverRatio,
  calculateMetalsCarryTrade,
  calculateGrainBasisPattern,
  calculateCropCalendarImpact,
  calculateLivestockCostOfGain,
  adjustCommodityGrade,
  calculateSoftsCertificationPremium,
  calculateCalendarSpread,
  calculateInterCommoditySpread,
  calculateLocationSpread,
  calculateQualitySpread,
  optimizeSpreadExecution,
  calculateSpreadRollCost,
  detectContangoBackwardation,
  calculateTermStructureSlope,
  calculateRollYieldFromCurve,
  analyzeCurvePositioning,
  calculateStorageEconomics,
  calculateTransportationCost,
  optimizeLocationArbitrage,
  calculateMinimumVarianceHedge,
  calculateBasisRisk,
  extractSeasonalPattern,
};

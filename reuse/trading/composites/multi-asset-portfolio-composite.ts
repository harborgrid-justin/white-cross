/**
 * LOC: WC-COMP-TRADING-MULTI-001
 * File: /reuse/trading/composites/multi-asset-portfolio-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../portfolio-analytics-kit
 *   - ../risk-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Trading portfolio controllers
 *   - Multi-asset services
 *   - Bloomberg Terminal integration
 *   - Portfolio optimization engines
 */

/**
 * File: /reuse/trading/composites/multi-asset-portfolio-composite.ts
 * Locator: WC-COMP-TRADING-MULTI-001
 * Purpose: Bloomberg Terminal Multi-Asset Portfolio Management Composite
 *
 * Upstream: @nestjs/common, sequelize, portfolio-analytics-kit, risk-management-kit
 * Downstream: Trading controllers, multi-asset services, Bloomberg integration, optimization engines
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 composed functions for comprehensive multi-asset portfolio management
 *
 * LLM Context: Enterprise-grade multi-asset portfolio management composite for Bloomberg Terminal-level trading platform.
 * Provides multi-asset allocation, cross-asset correlation, portfolio construction, efficient frontier optimization,
 * Black-Litterman model, risk parity strategies, factor investing, smart beta strategies, tactical/strategic asset allocation,
 * currency hedging overlay, alternative asset integration, ESG integration, rebalancing optimization, and multi-period optimization.
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

// Import from portfolio analytics kit
import {
  constructOptimalPortfolio,
  calculateEfficientFrontier,
  optimizeForMaxSharpe,
  optimizeForMinVariance,
  implementRiskParity,
  applyBlackLitterman,
  validatePortfolioConstraints,
  calculateDiversificationMetrics,
  performBrinsonAttribution,
  calculateSectorAttribution,
  calculateSecurityAttribution,
  analyzeAllocationEffect,
  analyzeSelectionEffect,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateCalmarRatio,
  calculateTreynorRatio,
  calculateRiskAdjustedMetrics,
  generateRebalancingPlan,
  implementCalendarRebalancing,
  optimizeRebalancingForTaxes,
  calculateOptimalRebalancingFrequency,
  simulateRebalancingImpact,
  determineStrategicAllocation,
  implementTacticalAllocation,
  implementDynamicAllocation,
  calculateGlidePath,
  optimizeForLiabilityMatching,
  performFactorAnalysis,
  calculateFactorLoadings,
  analyzeStyleDrift,
  decomposeRiskByFactors,
  identifyFactorTilts,
  calculateTrackingError,
  calculateInformationRatio,
  analyzeUpDownCapture,
  generateBenchmarkComparison,
  performHistoricalStressTest,
  runHypotheticalStressScenario,
  analyzeScenarioSensitivity,
  generateReverseStressTest,
  runMonteCarloSimulation,
} from '../portfolio-analytics-kit';

// Import from risk management kit
import {
  calculateMarketVaR,
  calculateParametricVaR,
  calculateComponentVaR,
  calculateExpectedTailLoss,
  calculateMarketVolatility,
  analyzeCorrelationBreakdown,
  calculateHerfindahlIndex,
  analyzeSectorConcentration,
  analyzeGeographicConcentration,
} from '../risk-management-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Asset class types for multi-asset portfolios
 */
export enum AssetClass {
  EQUITY = 'equity',
  FIXED_INCOME = 'fixed_income',
  COMMODITY = 'commodity',
  REAL_ESTATE = 'real_estate',
  ALTERNATIVE = 'alternative',
  CASH = 'cash',
  CRYPTO = 'crypto',
  PRIVATE_EQUITY = 'private_equity',
  HEDGE_FUND = 'hedge_fund',
}

/**
 * Portfolio strategy types
 */
export enum PortfolioStrategyType {
  STRATEGIC = 'strategic',
  TACTICAL = 'tactical',
  DYNAMIC = 'dynamic',
  RISK_PARITY = 'risk_parity',
  FACTOR_BASED = 'factor_based',
  SMART_BETA = 'smart_beta',
  TARGET_DATE = 'target_date',
  LIABILITY_DRIVEN = 'liability_driven',
}

/**
 * Rebalancing frequency options
 */
export enum RebalancingFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  THRESHOLD_BASED = 'threshold_based',
}

/**
 * Optimization objective types
 */
export enum OptimizationObjective {
  MAX_SHARPE = 'max_sharpe',
  MIN_VARIANCE = 'min_variance',
  MAX_RETURN = 'max_return',
  RISK_PARITY = 'risk_parity',
  EQUAL_WEIGHT = 'equal_weight',
  BLACK_LITTERMAN = 'black_litterman',
  FACTOR_BASED = 'factor_based',
}

/**
 * ESG rating levels
 */
export enum ESGRating {
  AAA = 'aaa',
  AA = 'aa',
  A = 'a',
  BBB = 'bbb',
  BB = 'bb',
  B = 'b',
  CCC = 'ccc',
}

// ============================================================================
// SEQUELIZE MODEL: MultiAssetPortfolio
// ============================================================================

/**
 * TypeScript interface for MultiAssetPortfolio attributes
 */
export interface MultiAssetPortfolioAttributes {
  id: string;
  name: string;
  description: string | null;
  strategyType: PortfolioStrategyType;
  optimizationObjective: OptimizationObjective;
  assetClasses: AssetClass[];
  targetAllocation: Record<string, any>;
  currentAllocation: Record<string, any>;
  constraints: Record<string, any>;
  riskTolerance: number;
  returnTarget: number;
  timeHorizon: number;
  rebalancingFrequency: RebalancingFrequency;
  rebalancingThreshold: number;
  benchmarkId: string | null;
  currencyHedging: boolean;
  esgEnabled: boolean;
  esgMinRating: ESGRating | null;
  totalValue: number;
  cash: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MultiAssetPortfolioCreationAttributes extends Optional<MultiAssetPortfolioAttributes, 'id' | 'description' | 'benchmarkId' | 'esgMinRating' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: MultiAssetPortfolio
 * Core multi-asset portfolio entity with comprehensive allocation tracking
 */
export class MultiAssetPortfolio extends Model<MultiAssetPortfolioAttributes, MultiAssetPortfolioCreationAttributes> implements MultiAssetPortfolioAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare strategyType: PortfolioStrategyType;
  declare optimizationObjective: OptimizationObjective;
  declare assetClasses: AssetClass[];
  declare targetAllocation: Record<string, any>;
  declare currentAllocation: Record<string, any>;
  declare constraints: Record<string, any>;
  declare riskTolerance: number;
  declare returnTarget: number;
  declare timeHorizon: number;
  declare rebalancingFrequency: RebalancingFrequency;
  declare rebalancingThreshold: number;
  declare benchmarkId: string | null;
  declare currencyHedging: boolean;
  declare esgEnabled: boolean;
  declare esgMinRating: ESGRating | null;
  declare totalValue: number;
  declare cash: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getAssetAllocations: HasManyGetAssociationsMixin<AssetAllocation>;
  declare addAssetAllocation: HasManyAddAssociationMixin<AssetAllocation, string>;
  declare getOptimizationRuns: HasManyGetAssociationsMixin<OptimizationRun>;
  declare getRebalancingEvents: HasManyGetAssociationsMixin<RebalancingEvent>;

  declare static associations: {
    assetAllocations: Association<MultiAssetPortfolio, AssetAllocation>;
    optimizationRuns: Association<MultiAssetPortfolio, OptimizationRun>;
    rebalancingEvents: Association<MultiAssetPortfolio, RebalancingEvent>;
  };

  /**
   * Initialize MultiAssetPortfolio with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MultiAssetPortfolio {
    MultiAssetPortfolio.init(
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
          type: DataTypes.ENUM(...Object.values(PortfolioStrategyType)),
          allowNull: false,
          field: 'strategy_type',
        },
        optimizationObjective: {
          type: DataTypes.ENUM(...Object.values(OptimizationObjective)),
          allowNull: false,
          field: 'optimization_objective',
        },
        assetClasses: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'asset_classes',
        },
        targetAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'target_allocation',
        },
        currentAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'current_allocation',
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'constraints',
        },
        riskTolerance: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
          field: 'risk_tolerance',
        },
        returnTarget: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'return_target',
        },
        timeHorizon: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'time_horizon',
        },
        rebalancingFrequency: {
          type: DataTypes.ENUM(...Object.values(RebalancingFrequency)),
          allowNull: false,
          field: 'rebalancing_frequency',
        },
        rebalancingThreshold: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 5.0,
          field: 'rebalancing_threshold',
        },
        benchmarkId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'benchmark_id',
        },
        currencyHedging: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'currency_hedging',
        },
        esgEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'esg_enabled',
        },
        esgMinRating: {
          type: DataTypes.ENUM(...Object.values(ESGRating)),
          allowNull: true,
          field: 'esg_min_rating',
        },
        totalValue: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'total_value',
        },
        cash: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'cash',
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
        tableName: 'multi_asset_portfolios',
        modelName: 'MultiAssetPortfolio',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['strategy_type'] },
          { fields: ['optimization_objective'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return MultiAssetPortfolio;
  }
}

// ============================================================================
// SEQUELIZE MODEL: AssetAllocation
// ============================================================================

/**
 * TypeScript interface for AssetAllocation attributes
 */
export interface AssetAllocationAttributes {
  id: string;
  portfolioId: string;
  assetClass: AssetClass;
  subAssetClass: string | null;
  targetWeight: number;
  currentWeight: number;
  targetValue: number;
  currentValue: number;
  minWeight: number;
  maxWeight: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  correlationMatrix: Record<string, any>;
  factorExposures: Record<string, any>;
  esgScore: number | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AssetAllocationCreationAttributes extends Optional<AssetAllocationAttributes, 'id' | 'subAssetClass' | 'esgScore' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: AssetAllocation
 * Detailed asset class allocation with risk metrics
 */
export class AssetAllocation extends Model<AssetAllocationAttributes, AssetAllocationCreationAttributes> implements AssetAllocationAttributes {
  declare id: string;
  declare portfolioId: string;
  declare assetClass: AssetClass;
  declare subAssetClass: string | null;
  declare targetWeight: number;
  declare currentWeight: number;
  declare targetValue: number;
  declare currentValue: number;
  declare minWeight: number;
  declare maxWeight: number;
  declare expectedReturn: number;
  declare volatility: number;
  declare sharpeRatio: number;
  declare correlationMatrix: Record<string, any>;
  declare factorExposures: Record<string, any>;
  declare esgScore: number | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getPortfolio: BelongsToGetAssociationMixin<MultiAssetPortfolio>;

  declare static associations: {
    portfolio: Association<AssetAllocation, MultiAssetPortfolio>;
  };

  /**
   * Initialize AssetAllocation with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof AssetAllocation {
    AssetAllocation.init(
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
            model: 'multi_asset_portfolios',
            key: 'id',
          },
          field: 'portfolio_id',
        },
        assetClass: {
          type: DataTypes.ENUM(...Object.values(AssetClass)),
          allowNull: false,
          field: 'asset_class',
        },
        subAssetClass: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'sub_asset_class',
        },
        targetWeight: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'target_weight',
        },
        currentWeight: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'current_weight',
        },
        targetValue: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'target_value',
        },
        currentValue: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'current_value',
        },
        minWeight: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 0,
          field: 'min_weight',
        },
        maxWeight: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          defaultValue: 1,
          field: 'max_weight',
        },
        expectedReturn: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'expected_return',
        },
        volatility: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'volatility',
        },
        sharpeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'sharpe_ratio',
        },
        correlationMatrix: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'correlation_matrix',
        },
        factorExposures: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'factor_exposures',
        },
        esgScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'esg_score',
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
        tableName: 'asset_allocations',
        modelName: 'AssetAllocation',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['asset_class'] },
          { fields: ['portfolio_id', 'asset_class'] },
        ],
      }
    );

    return AssetAllocation;
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
  portfolioId: string;
  runDate: Date;
  objective: OptimizationObjective;
  constraints: Record<string, any>;
  inputParameters: Record<string, any>;
  efficientFrontier: Record<string, any>;
  optimalWeights: Record<string, any>;
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  sortino: number;
  calmar: number;
  maxDrawdown: number;
  var95: number;
  cvar95: number;
  optimizationTime: number;
  status: string;
  errorMessage: string | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface OptimizationRunCreationAttributes extends Optional<OptimizationRunAttributes, 'id' | 'errorMessage' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: OptimizationRun
 * Portfolio optimization execution history and results
 */
export class OptimizationRun extends Model<OptimizationRunAttributes, OptimizationRunCreationAttributes> implements OptimizationRunAttributes {
  declare id: string;
  declare portfolioId: string;
  declare runDate: Date;
  declare objective: OptimizationObjective;
  declare constraints: Record<string, any>;
  declare inputParameters: Record<string, any>;
  declare efficientFrontier: Record<string, any>;
  declare optimalWeights: Record<string, any>;
  declare expectedReturn: number;
  declare expectedVolatility: number;
  declare sharpeRatio: number;
  declare sortino: number;
  declare calmar: number;
  declare maxDrawdown: number;
  declare var95: number;
  declare cvar95: number;
  declare optimizationTime: number;
  declare status: string;
  declare errorMessage: string | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize OptimizationRun with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof OptimizationRun {
    OptimizationRun.init(
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
            model: 'multi_asset_portfolios',
            key: 'id',
          },
          field: 'portfolio_id',
        },
        runDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'run_date',
        },
        objective: {
          type: DataTypes.ENUM(...Object.values(OptimizationObjective)),
          allowNull: false,
          field: 'objective',
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'constraints',
        },
        inputParameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'input_parameters',
        },
        efficientFrontier: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'efficient_frontier',
        },
        optimalWeights: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'optimal_weights',
        },
        expectedReturn: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'expected_return',
        },
        expectedVolatility: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'expected_volatility',
        },
        sharpeRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'sharpe_ratio',
        },
        sortino: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'sortino',
        },
        calmar: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'calmar',
        },
        maxDrawdown: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'max_drawdown',
        },
        var95: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'var_95',
        },
        cvar95: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'cvar_95',
        },
        optimizationTime: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'optimization_time',
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
          allowNull: false,
          defaultValue: 'PENDING',
          field: 'status',
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
        tableName: 'optimization_runs',
        modelName: 'OptimizationRun',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['run_date'] },
          { fields: ['status'] },
        ],
      }
    );

    return OptimizationRun;
  }
}

// ============================================================================
// SEQUELIZE MODEL: RebalancingEvent
// ============================================================================

/**
 * TypeScript interface for RebalancingEvent attributes
 */
export interface RebalancingEventAttributes {
  id: string;
  portfolioId: string;
  eventDate: Date;
  eventType: string;
  previousAllocation: Record<string, any>;
  targetAllocation: Record<string, any>;
  trades: Record<string, any>[];
  transactionCosts: number;
  taxImpact: number;
  marketImpact: number;
  totalCost: number;
  reason: string;
  status: string;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RebalancingEventCreationAttributes extends Optional<RebalancingEventAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: RebalancingEvent
 * Portfolio rebalancing event tracking and analysis
 */
export class RebalancingEvent extends Model<RebalancingEventAttributes, RebalancingEventCreationAttributes> implements RebalancingEventAttributes {
  declare id: string;
  declare portfolioId: string;
  declare eventDate: Date;
  declare eventType: string;
  declare previousAllocation: Record<string, any>;
  declare targetAllocation: Record<string, any>;
  declare trades: Record<string, any>[];
  declare transactionCosts: number;
  declare taxImpact: number;
  declare marketImpact: number;
  declare totalCost: number;
  declare reason: string;
  declare status: string;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize RebalancingEvent with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof RebalancingEvent {
    RebalancingEvent.init(
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
            model: 'multi_asset_portfolios',
            key: 'id',
          },
          field: 'portfolio_id',
        },
        eventDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'event_date',
        },
        eventType: {
          type: DataTypes.ENUM('SCHEDULED', 'THRESHOLD', 'TACTICAL', 'MANUAL'),
          allowNull: false,
          field: 'event_type',
        },
        previousAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'previous_allocation',
        },
        targetAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'target_allocation',
        },
        trades: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'trades',
        },
        transactionCosts: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'transaction_costs',
        },
        taxImpact: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'tax_impact',
        },
        marketImpact: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'market_impact',
        },
        totalCost: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'total_cost',
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'reason',
        },
        status: {
          type: DataTypes.ENUM('PLANNED', 'EXECUTING', 'COMPLETED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PLANNED',
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
        tableName: 'rebalancing_events',
        modelName: 'RebalancingEvent',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['event_date'] },
          { fields: ['event_type'] },
          { fields: ['status'] },
        ],
      }
    );

    return RebalancingEvent;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineMultiAssetPortfolioAssociations(): void {
  MultiAssetPortfolio.hasMany(AssetAllocation, {
    foreignKey: 'portfolioId',
    as: 'assetAllocations',
    onDelete: 'CASCADE',
  });

  AssetAllocation.belongsTo(MultiAssetPortfolio, {
    foreignKey: 'portfolioId',
    as: 'portfolio',
  });

  MultiAssetPortfolio.hasMany(OptimizationRun, {
    foreignKey: 'portfolioId',
    as: 'optimizationRuns',
    onDelete: 'CASCADE',
  });

  OptimizationRun.belongsTo(MultiAssetPortfolio, {
    foreignKey: 'portfolioId',
    as: 'portfolio',
  });

  MultiAssetPortfolio.hasMany(RebalancingEvent, {
    foreignKey: 'portfolioId',
    as: 'rebalancingEvents',
    onDelete: 'CASCADE',
  });

  RebalancingEvent.belongsTo(MultiAssetPortfolio, {
    foreignKey: 'portfolioId',
    as: 'portfolio',
  });
}

// ============================================================================
// MULTI-ASSET PORTFOLIO CONSTRUCTION FUNCTIONS
// ============================================================================

/**
 * Create multi-asset portfolio
 */
export async function createMultiAssetPortfolio(
  data: MultiAssetPortfolioCreationAttributes,
  transaction?: Transaction
): Promise<MultiAssetPortfolio> {
  return await MultiAssetPortfolio.create(data, { transaction });
}

/**
 * Create strategic multi-asset portfolio with long-term allocation
 */
export async function createStrategicPortfolio(
  name: string,
  assetClasses: AssetClass[],
  targetAllocation: Record<string, any>,
  riskTolerance: number,
  returnTarget: number,
  timeHorizon: number,
  createdBy: string,
  transaction?: Transaction
): Promise<MultiAssetPortfolio> {
  return await MultiAssetPortfolio.create(
    {
      name,
      strategyType: PortfolioStrategyType.STRATEGIC,
      optimizationObjective: OptimizationObjective.MAX_SHARPE,
      assetClasses,
      targetAllocation,
      currentAllocation: {},
      constraints: {},
      riskTolerance,
      returnTarget,
      timeHorizon,
      rebalancingFrequency: RebalancingFrequency.QUARTERLY,
      rebalancingThreshold: 5.0,
      currencyHedging: false,
      esgEnabled: false,
      totalValue: 0,
      cash: 0,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get multi-asset portfolio by ID
 */
export async function getMultiAssetPortfolioById(
  id: string,
  transaction?: Transaction
): Promise<MultiAssetPortfolio | null> {
  return await MultiAssetPortfolio.findByPk(id, {
    include: ['assetAllocations', 'optimizationRuns', 'rebalancingEvents'],
    transaction,
  });
}

/**
 * Get all portfolios by strategy type
 */
export async function getPortfoliosByStrategy(
  strategyType: PortfolioStrategyType,
  transaction?: Transaction
): Promise<MultiAssetPortfolio[]> {
  return await MultiAssetPortfolio.findAll({
    where: { strategyType },
    transaction,
  });
}

/**
 * Update portfolio allocation
 */
export async function updatePortfolioAllocation(
  id: string,
  targetAllocation: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, MultiAssetPortfolio[]]> {
  return await MultiAssetPortfolio.update(
    { targetAllocation, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

// ============================================================================
// PORTFOLIO OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Run efficient frontier optimization for multi-asset portfolio
 */
export async function runEfficientFrontierOptimization(
  portfolioId: string,
  expectedReturns: number[],
  covarianceMatrix: number[][],
  constraints: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<OptimizationRun> {
  const startTime = Date.now();

  try {
    const efficientFrontier = await calculateEfficientFrontier(
      expectedReturns,
      covarianceMatrix,
      20
    );

    const sharpeOptimal = await optimizeForMaxSharpe(
      expectedReturns,
      covarianceMatrix,
      0.03
    );

    const minVariance = await optimizeForMinVariance(
      expectedReturns,
      covarianceMatrix
    );

    const riskMetrics = await calculateRiskAdjustedMetrics(
      sharpeOptimal.expectedReturn,
      sharpeOptimal.volatility,
      0.03,
      [0.01, -0.02, 0.03, -0.01],
      0.08
    );

    const optimizationTime = Date.now() - startTime;

    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.MAX_SHARPE,
        constraints,
        inputParameters: { expectedReturns, covarianceMatrix },
        efficientFrontier: { points: efficientFrontier, minVariance },
        optimalWeights: sharpeOptimal.weights,
        expectedReturn: sharpeOptimal.expectedReturn,
        expectedVolatility: sharpeOptimal.volatility,
        sharpeRatio: riskMetrics.sharpeRatio,
        sortino: riskMetrics.sortinoRatio,
        calmar: riskMetrics.calmarRatio,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'COMPLETED',
        metadata: {},
        createdBy,
      },
      { transaction }
    );
  } catch (error) {
    const optimizationTime = Date.now() - startTime;
    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.MAX_SHARPE,
        constraints,
        inputParameters: { expectedReturns, covarianceMatrix },
        efficientFrontier: {},
        optimalWeights: {},
        expectedReturn: 0,
        expectedVolatility: 0,
        sharpeRatio: 0,
        sortino: 0,
        calmar: 0,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {},
        createdBy,
      },
      { transaction }
    );
  }
}

/**
 * Apply Black-Litterman optimization with market views
 */
export async function applyBlackLittermanOptimization(
  portfolioId: string,
  marketWeights: number[],
  expectedReturns: number[],
  covarianceMatrix: number[][],
  views: Array<{ assets: number[]; expectedReturn: number; confidence: number }>,
  tau: number,
  createdBy: string,
  transaction?: Transaction
): Promise<OptimizationRun> {
  const startTime = Date.now();

  try {
    const blResult = await applyBlackLitterman(
      marketWeights,
      expectedReturns,
      covarianceMatrix,
      views,
      tau
    );

    const riskMetrics = await calculateRiskAdjustedMetrics(
      blResult.expectedReturn,
      blResult.volatility,
      0.03,
      [0.01, -0.02, 0.03, -0.01],
      0.08
    );

    const optimizationTime = Date.now() - startTime;

    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.BLACK_LITTERMAN,
        constraints: { views, tau },
        inputParameters: { marketWeights, expectedReturns, covarianceMatrix },
        efficientFrontier: {},
        optimalWeights: blResult.weights,
        expectedReturn: blResult.expectedReturn,
        expectedVolatility: blResult.volatility,
        sharpeRatio: riskMetrics.sharpeRatio,
        sortino: riskMetrics.sortinoRatio,
        calmar: riskMetrics.calmarRatio,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'COMPLETED',
        metadata: { adjustedReturns: blResult.adjustedReturns },
        createdBy,
      },
      { transaction }
    );
  } catch (error) {
    const optimizationTime = Date.now() - startTime;
    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.BLACK_LITTERMAN,
        constraints: { views, tau },
        inputParameters: { marketWeights, expectedReturns, covarianceMatrix },
        efficientFrontier: {},
        optimalWeights: {},
        expectedReturn: 0,
        expectedVolatility: 0,
        sharpeRatio: 0,
        sortino: 0,
        calmar: 0,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {},
        createdBy,
      },
      { transaction }
    );
  }
}

/**
 * Implement risk parity portfolio optimization
 */
export async function implementRiskParityOptimization(
  portfolioId: string,
  volatilities: number[],
  correlationMatrix: number[][],
  targetRiskContributions: number[],
  createdBy: string,
  transaction?: Transaction
): Promise<OptimizationRun> {
  const startTime = Date.now();

  try {
    const rpResult = await implementRiskParity(
      volatilities,
      correlationMatrix,
      targetRiskContributions
    );

    const expectedReturn = 0.08; // Placeholder
    const portfolioVolatility = rpResult.portfolioVolatility;

    const riskMetrics = await calculateRiskAdjustedMetrics(
      expectedReturn,
      portfolioVolatility,
      0.03,
      [0.01, -0.02, 0.03, -0.01],
      0.08
    );

    const optimizationTime = Date.now() - startTime;

    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.RISK_PARITY,
        constraints: { targetRiskContributions },
        inputParameters: { volatilities, correlationMatrix },
        efficientFrontier: {},
        optimalWeights: rpResult.weights,
        expectedReturn,
        expectedVolatility: portfolioVolatility,
        sharpeRatio: riskMetrics.sharpeRatio,
        sortino: riskMetrics.sortinoRatio,
        calmar: riskMetrics.calmarRatio,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'COMPLETED',
        metadata: { riskContributions: rpResult.riskContributions },
        createdBy,
      },
      { transaction }
    );
  } catch (error) {
    const optimizationTime = Date.now() - startTime;
    return await OptimizationRun.create(
      {
        portfolioId,
        runDate: new Date(),
        objective: OptimizationObjective.RISK_PARITY,
        constraints: { targetRiskContributions },
        inputParameters: { volatilities, correlationMatrix },
        efficientFrontier: {},
        optimalWeights: {},
        expectedReturn: 0,
        expectedVolatility: 0,
        sharpeRatio: 0,
        sortino: 0,
        calmar: 0,
        maxDrawdown: 0,
        var95: 0,
        cvar95: 0,
        optimizationTime,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {},
        createdBy,
      },
      { transaction }
    );
  }
}

// ============================================================================
// ASSET ALLOCATION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create asset allocation for portfolio
 */
export async function createAssetAllocation(
  data: AssetAllocationCreationAttributes,
  transaction?: Transaction
): Promise<AssetAllocation> {
  return await AssetAllocation.create(data, { transaction });
}

/**
 * Get all allocations for portfolio
 */
export async function getAssetAllocationsByPortfolio(
  portfolioId: string,
  transaction?: Transaction
): Promise<AssetAllocation[]> {
  return await AssetAllocation.findAll({
    where: { portfolioId },
    transaction,
  });
}

/**
 * Update allocation weights
 */
export async function updateAllocationWeights(
  id: string,
  targetWeight: number,
  currentWeight: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, AssetAllocation[]]> {
  return await AssetAllocation.update(
    { targetWeight, currentWeight, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

/**
 * Calculate cross-asset correlation matrix
 */
export async function calculateCrossAssetCorrelation(
  portfolioId: string,
  assetReturns: Record<string, number[]>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const allocations = await getAssetAllocationsByPortfolio(portfolioId, transaction);

  const correlationMatrix: Record<string, Record<string, number>> = {};
  const assetClasses = Object.keys(assetReturns);

  for (let i = 0; i < assetClasses.length; i++) {
    correlationMatrix[assetClasses[i]] = {};
    for (let j = 0; j < assetClasses.length; j++) {
      if (i === j) {
        correlationMatrix[assetClasses[i]][assetClasses[j]] = 1.0;
      } else {
        const returns1 = assetReturns[assetClasses[i]];
        const returns2 = assetReturns[assetClasses[j]];
        const correlation = calculateCorrelation(returns1, returns2);
        correlationMatrix[assetClasses[i]][assetClasses[j]] = correlation;
      }
    }
  }

  return correlationMatrix;
}

/**
 * Helper function to calculate correlation
 */
function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  return numerator / Math.sqrt(denomX * denomY);
}

// ============================================================================
// REBALANCING FUNCTIONS
// ============================================================================

/**
 * Generate comprehensive rebalancing plan
 */
export async function generateComprehensiveRebalancingPlan(
  portfolioId: string,
  currentWeights: number[],
  targetWeights: number[],
  portfolioValue: number,
  transactionCost: number,
  createdBy: string,
  transaction?: Transaction
): Promise<RebalancingEvent> {
  const plan = await generateRebalancingPlan(
    currentWeights,
    targetWeights,
    portfolioValue,
    transactionCost
  );

  return await RebalancingEvent.create(
    {
      portfolioId,
      eventDate: new Date(),
      eventType: 'THRESHOLD',
      previousAllocation: { weights: currentWeights },
      targetAllocation: { weights: targetWeights },
      trades: plan.trades,
      transactionCosts: plan.estimatedCost,
      taxImpact: 0,
      marketImpact: 0,
      totalCost: plan.estimatedCost,
      reason: 'Threshold-based rebalancing triggered',
      status: 'PLANNED',
      metadata: { drift: plan.drift, needsRebalancing: plan.needsRebalancing },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Execute calendar-based rebalancing
 */
export async function executeCalendarRebalancing(
  portfolioId: string,
  frequency: RebalancingFrequency,
  currentWeights: number[],
  targetWeights: number[],
  portfolioValue: number,
  createdBy: string,
  transaction?: Transaction
): Promise<RebalancingEvent> {
  const result = await implementCalendarRebalancing(
    currentWeights,
    targetWeights,
    frequency,
    new Date()
  );

  if (!result.shouldRebalance) {
    throw new Error('Calendar rebalancing not due at this time');
  }

  return await RebalancingEvent.create(
    {
      portfolioId,
      eventDate: new Date(),
      eventType: 'SCHEDULED',
      previousAllocation: { weights: currentWeights },
      targetAllocation: { weights: targetWeights },
      trades: [],
      transactionCosts: 0,
      taxImpact: 0,
      marketImpact: 0,
      totalCost: 0,
      reason: `Scheduled ${frequency} rebalancing`,
      status: 'PLANNED',
      metadata: { nextRebalanceDate: result.nextRebalanceDate },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Optimize rebalancing with tax considerations
 */
export async function optimizeRebalancingWithTaxes(
  portfolioId: string,
  currentHoldings: Array<{ symbol: string; quantity: number; costBasis: number; currentPrice: number; holdingPeriod: number }>,
  targetWeights: number[],
  taxRate: number,
  createdBy: string,
  transaction?: Transaction
): Promise<RebalancingEvent> {
  const taxOptimizedPlan = await optimizeRebalancingForTaxes(
    currentHoldings,
    targetWeights,
    taxRate
  );

  return await RebalancingEvent.create(
    {
      portfolioId,
      eventDate: new Date(),
      eventType: 'TACTICAL',
      previousAllocation: {},
      targetAllocation: { weights: targetWeights },
      trades: taxOptimizedPlan.trades,
      transactionCosts: 0,
      taxImpact: taxOptimizedPlan.estimatedTaxImpact,
      marketImpact: 0,
      totalCost: taxOptimizedPlan.estimatedTaxImpact,
      reason: 'Tax-optimized rebalancing',
      status: 'PLANNED',
      metadata: { taxSavings: taxOptimizedPlan.taxSavings },
      createdBy,
    },
    { transaction }
  );
}

/**
 * Calculate optimal rebalancing frequency
 */
export async function calculateOptimalFrequency(
  portfolioId: string,
  historicalReturns: number[],
  volatility: number,
  transactionCostBps: number,
  transaction?: Transaction
): Promise<{ optimalFrequency: RebalancingFrequency; analysis: any }> {
  const analysis = await calculateOptimalRebalancingFrequency(
    historicalReturns,
    volatility,
    transactionCostBps
  );

  // Map days to frequency enum
  let optimalFrequency: RebalancingFrequency;
  if (analysis.optimalFrequencyDays <= 7) {
    optimalFrequency = RebalancingFrequency.WEEKLY;
  } else if (analysis.optimalFrequencyDays <= 30) {
    optimalFrequency = RebalancingFrequency.MONTHLY;
  } else if (analysis.optimalFrequencyDays <= 90) {
    optimalFrequency = RebalancingFrequency.QUARTERLY;
  } else {
    optimalFrequency = RebalancingFrequency.ANNUAL;
  }

  return { optimalFrequency, analysis };
}

// ============================================================================
// STRATEGIC & TACTICAL ALLOCATION FUNCTIONS
// ============================================================================

/**
 * Determine strategic asset allocation
 */
export async function determineStrategicAssetAllocation(
  portfolioId: string,
  investorProfile: Record<string, any>,
  marketConditions: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const allocation = await determineStrategicAllocation(
    investorProfile.riskTolerance,
    investorProfile.timeHorizon,
    investorProfile.returnTarget
  );

  await updatePortfolioAllocation(
    portfolioId,
    allocation.assetAllocation,
    createdBy,
    transaction
  );

  return allocation;
}

/**
 * Implement tactical asset allocation overlay
 */
export async function implementTacticalAllocationOverlay(
  portfolioId: string,
  strategicWeights: number[],
  marketViews: Array<{ assetClass: string; outlook: string; conviction: number }>,
  maxDeviation: number,
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const tacticalAllocation = await implementTacticalAllocation(
    strategicWeights,
    marketViews,
    maxDeviation
  );

  await updatePortfolioAllocation(
    portfolioId,
    { weights: tacticalAllocation.tacticalWeights },
    createdBy,
    transaction
  );

  return tacticalAllocation;
}

/**
 * Implement dynamic asset allocation strategy
 */
export async function implementDynamicAllocationStrategy(
  portfolioId: string,
  currentWeights: number[],
  expectedReturns: number[],
  volatilities: number[],
  marketRegime: string,
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const dynamicAllocation = await implementDynamicAllocation(
    currentWeights,
    expectedReturns,
    volatilities,
    marketRegime
  );

  await updatePortfolioAllocation(
    portfolioId,
    { weights: dynamicAllocation.adjustedWeights },
    createdBy,
    transaction
  );

  return dynamicAllocation;
}

/**
 * Calculate target date fund glide path
 */
export async function calculateTargetDateGlidePath(
  portfolioId: string,
  currentAge: number,
  retirementAge: number,
  initialEquityAllocation: number,
  finalEquityAllocation: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const glidePath = await calculateGlidePath(
    currentAge,
    retirementAge,
    initialEquityAllocation,
    finalEquityAllocation
  );

  return glidePath;
}

// ============================================================================
// FACTOR INVESTING & SMART BETA FUNCTIONS
// ============================================================================

/**
 * Perform comprehensive factor analysis
 */
export async function performComprehensiveFactorAnalysis(
  portfolioId: string,
  portfolioReturns: number[],
  factorReturns: Record<string, number[]>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const factorAnalysis = await performFactorAnalysis(
    portfolioReturns,
    factorReturns
  );

  const factorLoadings = await calculateFactorLoadings(
    portfolioReturns,
    factorReturns
  );

  const factorRisk = await decomposeRiskByFactors(
    factorLoadings.loadings,
    factorLoadings.factorVolatilities
  );

  return {
    ...factorAnalysis,
    loadings: factorLoadings,
    riskDecomposition: factorRisk,
  };
}

/**
 * Identify factor tilts in portfolio
 */
export async function identifyPortfolioFactorTilts(
  portfolioId: string,
  portfolioWeights: number[],
  securityFactorExposures: Record<string, number[]>,
  benchmarkFactorExposures: number[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const tilts = await identifyFactorTilts(
    portfolioWeights,
    securityFactorExposures,
    benchmarkFactorExposures
  );

  return tilts;
}

/**
 * Analyze style drift over time
 */
export async function analyzePortfolioStyleDrift(
  portfolioId: string,
  currentFactorExposures: number[],
  targetFactorExposures: number[],
  historicalExposures: number[][],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const styleDrift = await analyzeStyleDrift(
    currentFactorExposures,
    targetFactorExposures,
    historicalExposures
  );

  return styleDrift;
}

// ============================================================================
// RISK ANALYSIS & STRESS TESTING FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive portfolio VaR
 */
export async function calculatePortfolioVaR(
  portfolioId: string,
  returns: number[],
  portfolioValue: number,
  confidenceLevel: number,
  timeHorizon: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const historicalVaR = await calculateMarketVaR(returns, confidenceLevel, portfolioValue, timeHorizon);

  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = await calculateMarketVolatility(returns);
  const parametricVaR = await calculateParametricVaR(meanReturn, volatility, confidenceLevel, portfolioValue, timeHorizon);

  const expectedShortfall = await calculateExpectedTailLoss(returns, confidenceLevel, portfolioValue);

  return {
    historicalVaR,
    parametricVaR,
    expectedShortfall,
    confidenceLevel,
    timeHorizon,
    portfolioValue,
  };
}

/**
 * Perform historical stress testing
 */
export async function performPortfolioStressTest(
  portfolioId: string,
  portfolioWeights: number[],
  scenarioReturns: number[][],
  scenarioNames: string[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const stressResults = await performHistoricalStressTest(
    portfolioWeights,
    scenarioReturns,
    scenarioNames
  );

  return stressResults;
}

/**
 * Run hypothetical stress scenarios
 */
export async function runHypotheticalStressScenarios(
  portfolioId: string,
  portfolioValue: number,
  scenarios: Array<{ name: string; assetShocks: number[] }>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const results = await runHypotheticalStressScenario(
    portfolioValue,
    scenarios
  );

  return results;
}

/**
 * Analyze scenario sensitivity
 */
export async function analyzePortfolioScenarioSensitivity(
  portfolioId: string,
  baselineWeights: number[],
  assetReturns: number[][],
  scenarios: Array<{ name: string; probability: number }>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const sensitivity = await analyzeScenarioSensitivity(
    baselineWeights,
    assetReturns,
    scenarios
  );

  return sensitivity;
}

/**
 * Perform Monte Carlo simulation
 */
export async function performPortfolioMonteCarloSimulation(
  portfolioId: string,
  initialValue: number,
  expectedReturns: number[],
  covarianceMatrix: number[][],
  weights: number[],
  timeHorizon: number,
  simulations: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const mcResults = await runMonteCarloSimulation(
    initialValue,
    expectedReturns,
    covarianceMatrix,
    weights,
    timeHorizon,
    simulations
  );

  return mcResults;
}

// ============================================================================
// PERFORMANCE ATTRIBUTION & BENCHMARKING FUNCTIONS
// ============================================================================

/**
 * Perform Brinson attribution analysis
 */
export async function performPortfolioBrinsonAttribution(
  portfolioId: string,
  portfolioWeights: number[],
  portfolioReturns: number[],
  benchmarkWeights: number[],
  benchmarkReturns: number[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const attribution = await performBrinsonAttribution(
    portfolioWeights,
    portfolioReturns,
    benchmarkWeights,
    benchmarkReturns
  );

  return attribution;
}

/**
 * Calculate sector attribution
 */
export async function calculatePortfolioSectorAttribution(
  portfolioId: string,
  sectorData: Array<{ sector: string; portfolioWeight: number; portfolioReturn: number; benchmarkWeight: number; benchmarkReturn: number }>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const sectorAttribution = await calculateSectorAttribution(sectorData);

  return sectorAttribution;
}

/**
 * Generate comprehensive benchmark comparison
 */
export async function generatePortfolioBenchmarkComparison(
  portfolioId: string,
  portfolioReturns: number[],
  benchmarkReturns: number[],
  riskFreeRate: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const comparison = await generateBenchmarkComparison(
    portfolioReturns,
    benchmarkReturns,
    riskFreeRate
  );

  const trackingError = await calculateTrackingError(portfolioReturns, benchmarkReturns);
  const informationRatio = await calculateInformationRatio(portfolioReturns, benchmarkReturns);
  const upDownCapture = await analyzeUpDownCapture(portfolioReturns, benchmarkReturns);

  return {
    ...comparison,
    trackingError,
    informationRatio,
    upDownCapture,
  };
}

// ============================================================================
// ESG INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Apply ESG filters to portfolio construction
 */
export async function applyESGFilters(
  portfolioId: string,
  assetUniverse: Array<{ symbol: string; esgScore: number; esgRating: ESGRating }>,
  minEsgScore: number,
  minEsgRating: ESGRating,
  transaction?: Transaction
): Promise<Array<{ symbol: string; esgScore: number; esgRating: ESGRating }>> {
  const ratingOrder = Object.values(ESGRating);
  const minRatingIndex = ratingOrder.indexOf(minEsgRating);

  const filtered = assetUniverse.filter(asset => {
    const assetRatingIndex = ratingOrder.indexOf(asset.esgRating);
    return asset.esgScore >= minEsgScore && assetRatingIndex <= minRatingIndex;
  });

  return filtered;
}

/**
 * Calculate portfolio ESG score
 */
export async function calculatePortfolioESGScore(
  portfolioId: string,
  holdings: Array<{ symbol: string; weight: number; esgScore: number }>,
  transaction?: Transaction
): Promise<{ portfolioESGScore: number; weightedComponents: Record<string, number> }> {
  let portfolioESGScore = 0;
  const weightedComponents: Record<string, number> = {};

  holdings.forEach(holding => {
    const contribution = holding.weight * holding.esgScore;
    portfolioESGScore += contribution;
    weightedComponents[holding.symbol] = contribution;
  });

  return { portfolioESGScore, weightedComponents };
}

// ============================================================================
// CURRENCY HEDGING FUNCTIONS
// ============================================================================

/**
 * Calculate optimal currency hedge ratio
 */
export async function calculateOptimalCurrencyHedge(
  portfolioId: string,
  foreignExposure: number,
  currencyVolatility: number,
  correlationWithPortfolio: number,
  hedgingCost: number,
  transaction?: Transaction
): Promise<{ optimalHedgeRatio: number; expectedBenefit: number; recommendation: string }> {
  // Simplified currency hedging calculation
  const baseHedgeRatio = 1 - correlationWithPortfolio;
  const costAdjustment = Math.max(0, 1 - hedgingCost / currencyVolatility);
  const optimalHedgeRatio = Math.max(0, Math.min(1, baseHedgeRatio * costAdjustment));

  const expectedBenefit = foreignExposure * currencyVolatility * optimalHedgeRatio * 0.5;

  let recommendation: string;
  if (optimalHedgeRatio > 0.7) {
    recommendation = 'Full hedge recommended';
  } else if (optimalHedgeRatio > 0.3) {
    recommendation = 'Partial hedge recommended';
  } else {
    recommendation = 'Minimal or no hedging recommended';
  }

  return { optimalHedgeRatio, expectedBenefit, recommendation };
}

/**
 * Implement dynamic currency hedging
 */
export async function implementDynamicCurrencyHedging(
  portfolioId: string,
  exposures: Array<{ currency: string; amount: number; volatility: number }>,
  marketConditions: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const hedgingStrategy: Record<string, any> = {
    timestamp: new Date(),
    exposures: [],
    totalHedgeCost: 0,
  };

  for (const exposure of exposures) {
    const correlation = marketConditions.currencyCorrelations?.[exposure.currency] || 0.5;
    const hedgingCost = marketConditions.hedgingCosts?.[exposure.currency] || 0.01;

    const hedgeCalc = await calculateOptimalCurrencyHedge(
      portfolioId,
      exposure.amount,
      exposure.volatility,
      correlation,
      hedgingCost,
      transaction
    );

    hedgingStrategy.exposures.push({
      currency: exposure.currency,
      amount: exposure.amount,
      hedgeRatio: hedgeCalc.optimalHedgeRatio,
      hedgeAmount: exposure.amount * hedgeCalc.optimalHedgeRatio,
      expectedBenefit: hedgeCalc.expectedBenefit,
    });

    hedgingStrategy.totalHedgeCost += exposure.amount * hedgeCalc.optimalHedgeRatio * hedgingCost;
  }

  return hedgingStrategy;
}

// ============================================================================
// CONCENTRATION RISK ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze portfolio concentration risk
 */
export async function analyzePortfolioConcentrationRisk(
  portfolioId: string,
  holdings: Array<{ id: string; weight: number }>,
  sectorExposures: Array<{ sector: string; exposure: number }>,
  geographicExposures: Array<{ region: string; exposure: number }>,
  totalExposure: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const hhi = await calculateHerfindahlIndex(holdings);
  const sectorConc = await analyzeSectorConcentration(sectorExposures, totalExposure, 0.25);
  const geoConc = await analyzeGeographicConcentration(geographicExposures, totalExposure);

  return {
    herfindahlIndex: hhi,
    sectorConcentration: sectorConc,
    geographicConcentration: geoConc,
    overallConcentrationRating: hhi.concentrationLevel,
  };
}

// ============================================================================
// MULTI-PERIOD OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Perform multi-period portfolio optimization
 */
export async function performMultiPeriodOptimization(
  portfolioId: string,
  periods: number,
  expectedReturns: number[][],
  covarianceMatrices: number[][][],
  constraints: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const optimalPaths: Record<string, any>[] = [];

  for (let period = 0; period < periods; period++) {
    const periodReturns = expectedReturns[period];
    const periodCovMatrix = covarianceMatrices[period];

    const optimal = await optimizeForMaxSharpe(periodReturns, periodCovMatrix, 0.03);

    optimalPaths.push({
      period,
      weights: optimal.weights,
      expectedReturn: optimal.expectedReturn,
      volatility: optimal.volatility,
    });
  }

  return {
    periods,
    optimalPaths,
    totalExpectedReturn: optimalPaths.reduce((sum, p) => sum + p.expectedReturn, 0),
    averageVolatility: optimalPaths.reduce((sum, p) => sum + p.volatility, 0) / periods,
  };
}

// ============================================================================
// EXPORT: Initialize all models
// ============================================================================

/**
 * Initialize all multi-asset portfolio models
 */
export function initializeMultiAssetPortfolioModels(sequelize: Sequelize): void {
  MultiAssetPortfolio.initModel(sequelize);
  AssetAllocation.initModel(sequelize);
  OptimizationRun.initModel(sequelize);
  RebalancingEvent.initModel(sequelize);
  defineMultiAssetPortfolioAssociations();
}

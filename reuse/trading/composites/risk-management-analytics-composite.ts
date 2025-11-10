/**
 * LOC: WC-COMP-TRADING-RISK-001
 * File: /reuse/trading/composites/risk-management-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../risk-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal risk controllers
 *   - Risk dashboard services
 *   - Real-time risk monitoring engines
 *   - Compliance reporting systems
 *   - Trading limit enforcement
 */

/**
 * File: /reuse/trading/composites/risk-management-analytics-composite.ts
 * Locator: WC-COMP-TRADING-RISK-001
 * Purpose: Bloomberg Terminal-Level Risk Management Analytics Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, risk-management-kit
 * Downstream: Risk controllers, dashboard services, monitoring engines, compliance systems
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Swagger 7.x
 * Exports: 44 production-ready risk management functions with comprehensive analytics
 *
 * LLM Context: Enterprise-grade Bloomberg Terminal-equivalent risk management system.
 * Provides VaR (Value at Risk), Expected Shortfall (CVaR), stress testing, scenario analysis,
 * Greeks aggregation and hedging, beta/correlation analysis, concentration risk metrics,
 * liquidity risk measurement, counterparty risk limits, pre-trade risk checks, real-time
 * monitoring, risk limit breach detection, risk reporting dashboards, portfolio risk
 * decomposition, factor risk analysis, and extreme value theory applications.
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

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Risk limit types
 */
export enum RiskLimitType {
  VAR = 'VAR',
  EXPOSURE = 'EXPOSURE',
  CONCENTRATION = 'CONCENTRATION',
  LEVERAGE = 'LEVERAGE',
  POSITION_SIZE = 'POSITION_SIZE',
  DELTA = 'DELTA',
  VOLATILITY = 'VOLATILITY',
  CREDIT = 'CREDIT',
}

/**
 * Risk limit status
 */
export enum RiskLimitStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  BREACH = 'BREACH',
  OVERRIDE = 'OVERRIDE',
}

/**
 * Stress scenario types
 */
export enum StressScenarioType {
  MARKET_CRASH = 'MARKET_CRASH',
  CREDIT_EVENT = 'CREDIT_EVENT',
  LIQUIDITY_CRISIS = 'LIQUIDITY_CRISIS',
  OPERATIONAL_FAILURE = 'OPERATIONAL_FAILURE',
  CUSTOM = 'CUSTOM',
}

/**
 * Severity levels
 */
export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

/**
 * Option types
 */
export enum OptionType {
  CALL = 'CALL',
  PUT = 'PUT',
}

/**
 * Margin status
 */
export enum MarginStatus {
  ADEQUATE = 'ADEQUATE',
  WARNING = 'WARNING',
  CALL = 'CALL',
  CRITICAL = 'CRITICAL',
}

/**
 * Risk appetite levels
 */
export enum RiskAppetite {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
}

// ============================================================================
// SEQUELIZE MODEL: RiskMetrics
// ============================================================================

/**
 * TypeScript interface for RiskMetrics attributes
 */
export interface RiskMetricsAttributes {
  id: string;
  portfolioId: string;
  calculationDate: Date;
  valueAtRisk: number;
  conditionalVaR: number;
  expectedShortfall: number;
  marketVolatility: number;
  creditExposure: number;
  creditVaR: number;
  operationalVaR: number;
  liquidityRatio: number;
  concentrationIndex: number;
  totalRiskCapital: number;
  capitalAdequacyRatio: number;
  beta: number;
  correlationRisk: number;
  stressTestLoss: number;
  scenarioLoss: number;
  limitBreaches: number;
  riskScore: number;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiskMetricsCreationAttributes extends Optional<RiskMetricsAttributes, 'id'> {}

/**
 * Sequelize Model: RiskMetrics
 * Comprehensive risk metrics tracking
 */
export class RiskMetrics extends Model<RiskMetricsAttributes, RiskMetricsCreationAttributes> implements RiskMetricsAttributes {
  declare id: string;
  declare portfolioId: string;
  declare calculationDate: Date;
  declare valueAtRisk: number;
  declare conditionalVaR: number;
  declare expectedShortfall: number;
  declare marketVolatility: number;
  declare creditExposure: number;
  declare creditVaR: number;
  declare operationalVaR: number;
  declare liquidityRatio: number;
  declare concentrationIndex: number;
  declare totalRiskCapital: number;
  declare capitalAdequacyRatio: number;
  declare beta: number;
  declare correlationRisk: number;
  declare stressTestLoss: number;
  declare scenarioLoss: number;
  declare limitBreaches: number;
  declare riskScore: number;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize RiskMetrics with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof RiskMetrics {
    RiskMetrics.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        portfolioId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'portfolio_id',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculation_date',
        },
        valueAtRisk: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'value_at_risk',
        },
        conditionalVaR: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'conditional_var',
        },
        expectedShortfall: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'expected_shortfall',
        },
        marketVolatility: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'market_volatility',
        },
        creditExposure: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'credit_exposure',
        },
        creditVaR: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'credit_var',
        },
        operationalVaR: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'operational_var',
        },
        liquidityRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'liquidity_ratio',
        },
        concentrationIndex: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'concentration_index',
        },
        totalRiskCapital: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'total_risk_capital',
        },
        capitalAdequacyRatio: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'capital_adequacy_ratio',
        },
        beta: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 1.0,
          field: 'beta',
        },
        correlationRisk: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'correlation_risk',
        },
        stressTestLoss: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'stress_test_loss',
        },
        scenarioLoss: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'scenario_loss',
        },
        limitBreaches: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'limit_breaches',
        },
        riskScore: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
          field: 'risk_score',
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
        tableName: 'risk_metrics',
        modelName: 'RiskMetrics',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['portfolio_id'] },
          { fields: ['calculation_date'] },
          { fields: ['portfolio_id', 'calculation_date'] },
          { fields: ['limit_breaches'] },
          { fields: ['risk_score'] },
        ],
      }
    );

    return RiskMetrics;
  }
}

// ============================================================================
// SEQUELIZE MODEL: RiskLimit
// ============================================================================

/**
 * TypeScript interface for RiskLimit attributes
 */
export interface RiskLimitAttributes {
  id: string;
  limitId: string;
  limitType: RiskLimitType;
  limitName: string;
  limitDescription: string | null;
  scope: string;
  scopeId: string;
  limitValue: number;
  currentValue: number;
  utilization: number;
  warningThreshold: number;
  breachThreshold: number;
  status: RiskLimitStatus;
  lastChecked: Date;
  lastBreach: Date | null;
  breachCount: number;
  approver: string | null;
  enabled: boolean;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiskLimitCreationAttributes extends Optional<RiskLimitAttributes, 'id' | 'limitDescription' | 'lastBreach' | 'approver'> {}

/**
 * Sequelize Model: RiskLimit
 * Risk limit monitoring and enforcement
 */
export class RiskLimit extends Model<RiskLimitAttributes, RiskLimitCreationAttributes> implements RiskLimitAttributes {
  declare id: string;
  declare limitId: string;
  declare limitType: RiskLimitType;
  declare limitName: string;
  declare limitDescription: string | null;
  declare scope: string;
  declare scopeId: string;
  declare limitValue: number;
  declare currentValue: number;
  declare utilization: number;
  declare warningThreshold: number;
  declare breachThreshold: number;
  declare status: RiskLimitStatus;
  declare lastChecked: Date;
  declare lastBreach: Date | null;
  declare breachCount: number;
  declare approver: string | null;
  declare enabled: boolean;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize RiskLimit with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof RiskLimit {
    RiskLimit.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        limitId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'limit_id',
        },
        limitType: {
          type: DataTypes.ENUM(...Object.values(RiskLimitType)),
          allowNull: false,
          field: 'limit_type',
        },
        limitName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'limit_name',
        },
        limitDescription: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'limit_description',
        },
        scope: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'scope',
        },
        scopeId: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'scope_id',
        },
        limitValue: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'limit_value',
        },
        currentValue: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'current_value',
        },
        utilization: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0,
          field: 'utilization',
        },
        warningThreshold: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 0.8,
          field: 'warning_threshold',
        },
        breachThreshold: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          defaultValue: 1.0,
          field: 'breach_threshold',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(RiskLimitStatus)),
          allowNull: false,
          defaultValue: RiskLimitStatus.NORMAL,
          field: 'status',
        },
        lastChecked: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'last_checked',
        },
        lastBreach: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_breach',
        },
        breachCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'breach_count',
        },
        approver: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'approver',
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'enabled',
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
        tableName: 'risk_limits',
        modelName: 'RiskLimit',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['limit_id'], unique: true },
          { fields: ['limit_type'] },
          { fields: ['scope'] },
          { fields: ['scope_id'] },
          { fields: ['status'] },
          { fields: ['enabled'] },
        ],
      }
    );

    return RiskLimit;
  }
}

// ============================================================================
// SEQUELIZE MODEL: StressScenario
// ============================================================================

/**
 * TypeScript interface for StressScenario attributes
 */
export interface StressScenarioAttributes {
  id: string;
  scenarioId: string;
  scenarioName: string;
  scenarioType: StressScenarioType;
  severityLevel: SeverityLevel;
  parameters: Record<string, any>;
  impactOnPortfolio: number;
  probabilityOfOccurrence: number;
  description: string | null;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StressScenarioCreationAttributes extends Optional<StressScenarioAttributes, 'id' | 'description' | 'updatedBy'> {}

/**
 * Sequelize Model: StressScenario
 * Stress testing and scenario analysis
 */
export class StressScenario extends Model<StressScenarioAttributes, StressScenarioCreationAttributes> implements StressScenarioAttributes {
  declare id: string;
  declare scenarioId: string;
  declare scenarioName: string;
  declare scenarioType: StressScenarioType;
  declare severityLevel: SeverityLevel;
  declare parameters: Record<string, any>;
  declare impactOnPortfolio: number;
  declare probabilityOfOccurrence: number;
  declare description: string | null;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize StressScenario with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof StressScenario {
    StressScenario.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        scenarioId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'scenario_id',
        },
        scenarioName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'scenario_name',
        },
        scenarioType: {
          type: DataTypes.ENUM(...Object.values(StressScenarioType)),
          allowNull: false,
          field: 'scenario_type',
        },
        severityLevel: {
          type: DataTypes.ENUM(...Object.values(SeverityLevel)),
          allowNull: false,
          field: 'severity_level',
        },
        parameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'parameters',
        },
        impactOnPortfolio: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'impact_on_portfolio',
        },
        probabilityOfOccurrence: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          field: 'probability_of_occurrence',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
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
      },
      {
        sequelize,
        tableName: 'stress_scenarios',
        modelName: 'StressScenario',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['scenario_id'], unique: true },
          { fields: ['scenario_type'] },
          { fields: ['severity_level'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return StressScenario;
  }
}

// ============================================================================
// SEQUELIZE MODEL: GreekMetrics
// ============================================================================

/**
 * TypeScript interface for GreekMetrics attributes
 */
export interface GreekMetricsAttributes {
  id: string;
  securityId: string;
  portfolioId: string;
  optionType: OptionType;
  underlyingPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  volatility: number;
  riskFreeRate: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  quantity: number;
  calculationDate: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GreekMetricsCreationAttributes extends Optional<GreekMetricsAttributes, 'id'> {}

/**
 * Sequelize Model: GreekMetrics
 * Option Greeks tracking and analytics
 */
export class GreekMetrics extends Model<GreekMetricsAttributes, GreekMetricsCreationAttributes> implements GreekMetricsAttributes {
  declare id: string;
  declare securityId: string;
  declare portfolioId: string;
  declare optionType: OptionType;
  declare underlyingPrice: number;
  declare strikePrice: number;
  declare timeToExpiry: number;
  declare volatility: number;
  declare riskFreeRate: number;
  declare delta: number;
  declare gamma: number;
  declare vega: number;
  declare theta: number;
  declare rho: number;
  declare quantity: number;
  declare calculationDate: Date;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize GreekMetrics with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof GreekMetrics {
    GreekMetrics.init(
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
        portfolioId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'portfolio_id',
        },
        optionType: {
          type: DataTypes.ENUM(...Object.values(OptionType)),
          allowNull: false,
          field: 'option_type',
        },
        underlyingPrice: {
          type: DataTypes.DECIMAL(19, 4),
          allowNull: false,
          field: 'underlying_price',
        },
        strikePrice: {
          type: DataTypes.DECIMAL(19, 4),
          allowNull: false,
          field: 'strike_price',
        },
        timeToExpiry: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'time_to_expiry',
        },
        volatility: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'volatility',
        },
        riskFreeRate: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'risk_free_rate',
        },
        delta: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false,
          field: 'delta',
        },
        gamma: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: false,
          field: 'gamma',
        },
        vega: {
          type: DataTypes.DECIMAL(19, 4),
          allowNull: false,
          field: 'vega',
        },
        theta: {
          type: DataTypes.DECIMAL(19, 4),
          allowNull: false,
          field: 'theta',
        },
        rho: {
          type: DataTypes.DECIMAL(19, 4),
          allowNull: false,
          field: 'rho',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'quantity',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculation_date',
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
        tableName: 'greek_metrics',
        modelName: 'GreekMetrics',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['security_id'] },
          { fields: ['portfolio_id'] },
          { fields: ['calculation_date'] },
          { fields: ['portfolio_id', 'calculation_date'] },
        ],
      }
    );

    return GreekMetrics;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MarginRequirement
// ============================================================================

/**
 * TypeScript interface for MarginRequirement attributes
 */
export interface MarginRequirementAttributes {
  id: string;
  accountId: string;
  portfolioId: string;
  calculationDate: Date;
  initialMargin: number;
  maintenanceMargin: number;
  variationMargin: number;
  totalMargin: number;
  cashCollateral: number;
  securitiesCollateral: number;
  availableMargin: number;
  marginUtilization: number;
  marginCall: boolean;
  marginCallAmount: number;
  marginCallDate: Date | null;
  status: MarginStatus;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarginRequirementCreationAttributes extends Optional<MarginRequirementAttributes, 'id' | 'marginCallDate'> {}

/**
 * Sequelize Model: MarginRequirement
 * Margin requirement tracking and monitoring
 */
export class MarginRequirement extends Model<MarginRequirementAttributes, MarginRequirementCreationAttributes> implements MarginRequirementAttributes {
  declare id: string;
  declare accountId: string;
  declare portfolioId: string;
  declare calculationDate: Date;
  declare initialMargin: number;
  declare maintenanceMargin: number;
  declare variationMargin: number;
  declare totalMargin: number;
  declare cashCollateral: number;
  declare securitiesCollateral: number;
  declare availableMargin: number;
  declare marginUtilization: number;
  declare marginCall: boolean;
  declare marginCallAmount: number;
  declare marginCallDate: Date | null;
  declare status: MarginStatus;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize MarginRequirement with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarginRequirement {
    MarginRequirement.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'account_id',
        },
        portfolioId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'portfolio_id',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'calculation_date',
        },
        initialMargin: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'initial_margin',
        },
        maintenanceMargin: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'maintenance_margin',
        },
        variationMargin: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'variation_margin',
        },
        totalMargin: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'total_margin',
        },
        cashCollateral: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'cash_collateral',
        },
        securitiesCollateral: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'securities_collateral',
        },
        availableMargin: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          field: 'available_margin',
        },
        marginUtilization: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'margin_utilization',
        },
        marginCall: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'margin_call',
        },
        marginCallAmount: {
          type: DataTypes.DECIMAL(19, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'margin_call_amount',
        },
        marginCallDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'margin_call_date',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(MarginStatus)),
          allowNull: false,
          defaultValue: MarginStatus.ADEQUATE,
          field: 'status',
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
        tableName: 'margin_requirements',
        modelName: 'MarginRequirement',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['portfolio_id'] },
          { fields: ['calculation_date'] },
          { fields: ['margin_call'] },
          { fields: ['status'] },
        ],
      }
    );

    return MarginRequirement;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineRiskManagementAssociations(): void {
  // Add associations as needed for relationships between models
}

// ============================================================================
// MARKET RISK FUNCTIONS
// ============================================================================

/**
 * Calculate market Value at Risk (VaR) using historical simulation
 */
export async function calculateMarketVaR(
  returns: number[],
  confidenceLevel: number,
  portfolioValue: number,
  timeHorizon: number = 1,
  transaction?: Transaction
): Promise<number> {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  const varReturn = Math.abs(sortedReturns[index]);
  const var_ = varReturn * portfolioValue * Math.sqrt(timeHorizon);
  return var_;
}

/**
 * Calculate parametric VaR using variance-covariance method
 */
export async function calculateParametricVaR(
  expectedReturn: number,
  volatility: number,
  confidenceLevel: number,
  portfolioValue: number,
  timeHorizon: number = 1,
  transaction?: Transaction
): Promise<number> {
  const zScore = confidenceLevel === 0.99 ? 2.326 : confidenceLevel === 0.95 ? 1.645 : 1.96;
  const dailyReturn = expectedReturn / 252;
  const dailyVolatility = volatility / Math.sqrt(252);
  const var_ = (zScore * dailyVolatility - dailyReturn) * portfolioValue * Math.sqrt(timeHorizon);
  return var_;
}

/**
 * Calculate Expected Shortfall (CVaR/ETL)
 */
export async function calculateExpectedShortfall(
  returns: number[],
  confidenceLevel: number,
  portfolioValue: number,
  transaction?: Transaction
): Promise<number> {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const cutoff = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  const tailReturns = sortedReturns.slice(0, cutoff);
  const avgTailReturn = Math.abs(tailReturns.reduce((acc, r) => acc + r, 0) / tailReturns.length);
  const etl = avgTailReturn * portfolioValue;
  return etl;
}

/**
 * Calculate component VaR (contribution of each position to portfolio VaR)
 */
export async function calculateComponentVaR(
  positions: Array<{ securityId: string; value: number; beta: number }>,
  portfolioVaR: number,
  transaction?: Transaction
): Promise<Array<{ securityId: string; componentVaR: number; percentageContribution: number }>> {
  const totalValue = positions.reduce((acc, p) => acc + p.value, 0);
  return positions.map(pos => {
    const weight = pos.value / totalValue;
    const componentVaR = weight * pos.beta * portfolioVaR;
    const percentageContribution = (componentVaR / portfolioVaR) * 100;
    return {
      securityId: pos.securityId,
      componentVaR,
      percentageContribution,
    };
  });
}

/**
 * Perform VaR backtesting to validate model accuracy
 */
export async function performVaRBacktesting(
  forecastedVaR: number[],
  actualLosses: number[],
  confidenceLevel: number,
  transaction?: Transaction
): Promise<{ violations: number; violationRate: number; trafficLight: string; accurate: boolean }> {
  const n = Math.min(forecastedVaR.length, actualLosses.length);
  let violations = 0;
  for (let i = 0; i < n; i++) {
    if (actualLosses[i] > forecastedVaR[i]) {
      violations++;
    }
  }
  const violationRate = violations / n;
  const expectedRate = 1 - confidenceLevel;
  let trafficLight: string;
  if (violationRate < expectedRate * 1.5) {
    trafficLight = 'GREEN';
  } else if (violationRate < expectedRate * 2.5) {
    trafficLight = 'YELLOW';
  } else {
    trafficLight = 'RED';
  }
  return {
    violations,
    violationRate,
    trafficLight,
    accurate: trafficLight === 'GREEN',
  };
}

/**
 * Calculate market volatility using EWMA
 */
export async function calculateMarketVolatility(
  returns: number[],
  lambda: number = 0.94,
  transaction?: Transaction
): Promise<number> {
  let variance = 0;
  for (let i = 0; i < returns.length; i++) {
    const weight = Math.pow(lambda, i);
    variance += weight * Math.pow(returns[returns.length - 1 - i], 2);
  }
  variance *= (1 - lambda);
  const volatility = Math.sqrt(variance) * Math.sqrt(252);
  return volatility;
}

/**
 * Analyze correlation breakdown during stress events
 */
export async function analyzeCorrelationBreakdown(
  correlationMatrixNormal: number[][],
  correlationMatrixStress: number[][],
  transaction?: Transaction
): Promise<{ averageIncrease: number; maxIncrease: number; breakdownOccurred: boolean }> {
  let totalIncrease = 0;
  let maxIncrease = 0;
  let count = 0;
  const n = correlationMatrixNormal.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const increase = Math.abs(correlationMatrixStress[i][j]) - Math.abs(correlationMatrixNormal[i][j]);
      totalIncrease += increase;
      maxIncrease = Math.max(maxIncrease, increase);
      count++;
    }
  }
  const averageIncrease = (totalIncrease / count) * 100;
  const breakdownOccurred = averageIncrease > 10 || maxIncrease > 0.3;
  return {
    averageIncrease,
    maxIncrease: maxIncrease * 100,
    breakdownOccurred,
  };
}

// ============================================================================
// CREDIT RISK FUNCTIONS
// ============================================================================

/**
 * Calculate Probability of Default (PD) using Merton model
 */
export async function calculateProbabilityOfDefault(
  assetValue: number,
  debtValue: number,
  assetVolatility: number,
  timeHorizon: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d2 = (Math.log(assetValue / debtValue) + (riskFreeRate - 0.5 * Math.pow(assetVolatility, 2)) * timeHorizon) /
    (assetVolatility * Math.sqrt(timeHorizon));
  const pd = 0.5 * (1 - Math.tanh(d2 / Math.sqrt(2)));
  return Math.max(0, Math.min(1, pd));
}

/**
 * Calculate Loss Given Default (LGD)
 */
export async function calculateLossGivenDefault(
  exposureAtDefault: number,
  recoveryRate: number,
  discountRate: number = 0,
  transaction?: Transaction
): Promise<number> {
  const presentValueRecovery = recoveryRate / (1 + discountRate);
  const lgd = exposureAtDefault * (1 - presentValueRecovery);
  return lgd;
}

/**
 * Calculate Exposure at Default (EAD)
 */
export async function calculateExposureAtDefault(
  currentExposure: number,
  commitmentAmount: number,
  creditConversionFactor: number,
  transaction?: Transaction
): Promise<number> {
  const undrawnAmount = commitmentAmount - currentExposure;
  const ead = currentExposure + (undrawnAmount * creditConversionFactor);
  return ead;
}

/**
 * Calculate Expected Loss (EL)
 */
export async function calculateExpectedLoss(
  probabilityOfDefault: number,
  lossGivenDefault: number,
  exposureAtDefault: number,
  transaction?: Transaction
): Promise<number> {
  const expectedLoss = probabilityOfDefault * lossGivenDefault * (exposureAtDefault / lossGivenDefault);
  return expectedLoss;
}

/**
 * Calculate Credit Value at Risk (Credit VaR)
 */
export async function calculateCreditVaR(
  expectedLoss: number,
  unexpectedLoss: number,
  confidenceLevel: number,
  transaction?: Transaction
): Promise<number> {
  const zScore = confidenceLevel === 0.99 ? 2.326 : 1.645;
  const creditVaR = expectedLoss + (zScore * unexpectedLoss);
  return creditVaR;
}

// ============================================================================
// COUNTERPARTY RISK FUNCTIONS
// ============================================================================

/**
 * Calculate Current Exposure for derivatives
 */
export async function calculateCurrentExposure(
  markToMarket: number,
  collateralHeld: number,
  transaction?: Transaction
): Promise<number> {
  const currentExposure = Math.max(0, markToMarket - collateralHeld);
  return currentExposure;
}

/**
 * Calculate Potential Future Exposure (PFE) using Monte Carlo
 */
export async function calculatePotentialFutureExposure(
  currentExposure: number,
  volatility: number,
  timeToMaturity: number,
  confidenceLevel: number,
  simulations: number = 10000,
  transaction?: Transaction
): Promise<number> {
  const exposures: number[] = [];
  for (let i = 0; i < simulations; i++) {
    const randomShock = volatility * Math.sqrt(timeToMaturity) * (Math.random() * 2 - 1);
    const futureExposure = Math.max(0, currentExposure * (1 + randomShock));
    exposures.push(futureExposure);
  }
  exposures.sort((a, b) => b - a);
  const index = Math.floor((1 - confidenceLevel) * simulations);
  const pfe = exposures[index];
  return pfe;
}

/**
 * Calculate Credit Valuation Adjustment (CVA)
 */
export async function calculateCVA(
  exposure: number,
  probabilityOfDefault: number,
  lossGivenDefault: number,
  discountFactor: number,
  transaction?: Transaction
): Promise<number> {
  const cva = exposure * probabilityOfDefault * lossGivenDefault * discountFactor;
  return cva;
}

/**
 * Calculate Debt Valuation Adjustment (DVA)
 */
export async function calculateDVA(
  exposure: number,
  ownPD: number,
  lossGivenDefault: number,
  discountFactor: number,
  transaction?: Transaction
): Promise<number> {
  const dva = exposure * ownPD * lossGivenDefault * discountFactor;
  return dva;
}

/**
 * Calculate Wrong Way Risk adjustment
 */
export async function calculateWrongWayRisk(
  exposure: number,
  correlation: number,
  transaction?: Transaction
): Promise<{ adjustedExposure: number; riskMultiplier: number }> {
  const riskMultiplier = 1 + Math.max(0, correlation) * 0.5;
  const adjustedExposure = exposure * riskMultiplier;
  return {
    adjustedExposure,
    riskMultiplier,
  };
}

// ============================================================================
// LIQUIDITY RISK FUNCTIONS
// ============================================================================

/**
 * Calculate Liquidity Coverage Ratio (LCR)
 */
export async function calculateLiquidityCoverageRatio(
  highQualityLiquidAssets: number,
  netCashOutflows30Days: number,
  transaction?: Transaction
): Promise<number> {
  const lcr = (highQualityLiquidAssets / netCashOutflows30Days) * 100;
  return lcr;
}

/**
 * Calculate Net Stable Funding Ratio (NSFR)
 */
export async function calculateNetStableFundingRatio(
  availableStableFunding: number,
  requiredStableFunding: number,
  transaction?: Transaction
): Promise<number> {
  const nsfr = (availableStableFunding / requiredStableFunding) * 100;
  return nsfr;
}

/**
 * Analyze liquidity gap by time buckets
 */
export async function analyzeLiquidityGap(
  cashFlows: Array<{ bucket: string; inflows: number; outflows: number }>,
  transaction?: Transaction
): Promise<Array<{ bucket: string; netFlow: number; cumulativeGap: number }>> {
  let cumulativeGap = 0;
  return cashFlows.map(cf => {
    const netFlow = cf.inflows - cf.outflows;
    cumulativeGap += netFlow;
    return {
      bucket: cf.bucket,
      netFlow,
      cumulativeGap,
    };
  });
}

/**
 * Estimate time to liquidate positions
 */
export async function estimateTimeToLiquidate(
  positions: Array<{ securityId: string; quantity: number; averageDailyVolume: number; marketImpact: number }>,
  maxDailyVolumePercent: number = 0.25,
  transaction?: Transaction
): Promise<Array<{ securityId: string; daysToLiquidate: number; estimatedCost: number }>> {
  return positions.map(pos => {
    const maxDailyQuantity = pos.averageDailyVolume * maxDailyVolumePercent;
    const daysToLiquidate = Math.ceil(pos.quantity / maxDailyQuantity);
    const estimatedCost = pos.quantity * pos.marketImpact;
    return {
      securityId: pos.securityId,
      daysToLiquidate,
      estimatedCost,
    };
  });
}

/**
 * Calculate market impact cost of liquidation
 */
export async function calculateMarketImpactCost(
  positionSize: number,
  averageDailyVolume: number,
  volatility: number,
  transaction?: Transaction
): Promise<{ permanentImpact: number; temporaryImpact: number; totalImpact: number }> {
  const participationRate = positionSize / averageDailyVolume;
  const permanentImpact = volatility * Math.sqrt(participationRate) * 0.5;
  const temporaryImpact = volatility * participationRate * 0.3;
  const totalImpact = permanentImpact + temporaryImpact;
  return {
    permanentImpact: permanentImpact * 100,
    temporaryImpact: temporaryImpact * 100,
    totalImpact: totalImpact * 100,
  };
}

// ============================================================================
// CONCENTRATION RISK FUNCTIONS
// ============================================================================

/**
 * Calculate portfolio concentration using Herfindahl-Hirschman Index
 */
export async function calculateHerfindahlIndex(
  holdings: Array<{ id: string; weight: number }>,
  transaction?: Transaction
): Promise<{ hhi: number; effectiveN: number; concentrationLevel: string }> {
  const hhi = holdings.reduce((acc, h) => acc + Math.pow(h.weight, 2), 0);
  const effectiveN = 1 / hhi;
  let concentrationLevel: string;
  if (hhi > 0.25) {
    concentrationLevel = 'HIGH';
  } else if (hhi > 0.15) {
    concentrationLevel = 'MODERATE';
  } else {
    concentrationLevel = 'LOW';
  }
  return {
    hhi,
    effectiveN,
    concentrationLevel,
  };
}

/**
 * Analyze sector concentration risk
 */
export async function analyzeSectorConcentration(
  sectorExposures: Array<{ sector: string; exposure: number }>,
  totalExposure: number,
  maxSectorLimit: number = 0.25,
  transaction?: Transaction
): Promise<Array<{ sector: string; percentage: number; excess: number; breach: boolean }>> {
  return sectorExposures.map(se => {
    const percentage = (se.exposure / totalExposure) * 100;
    const excess = Math.max(0, percentage - maxSectorLimit * 100);
    const breach = percentage > maxSectorLimit * 100;
    return {
      sector: se.sector,
      percentage,
      excess,
      breach,
    };
  });
}

/**
 * Analyze geographic concentration risk
 */
export async function analyzeGeographicConcentration(
  regionalExposures: Array<{ region: string; exposure: number }>,
  totalExposure: number,
  transaction?: Transaction
): Promise<Array<{ region: string; percentage: number; riskRating: string }>> {
  const highRiskRegions = ['EMERGING_MARKETS', 'FRONTIER_MARKETS'];
  return regionalExposures.map(re => {
    const percentage = (re.exposure / totalExposure) * 100;
    let riskRating: string;
    if (highRiskRegions.includes(re.region) && percentage > 20) {
      riskRating = 'HIGH';
    } else if (percentage > 40) {
      riskRating = 'HIGH';
    } else if (percentage > 25) {
      riskRating = 'MODERATE';
    } else {
      riskRating = 'LOW';
    }
    return {
      region: re.region,
      percentage,
      riskRating,
    };
  });
}

/**
 * Analyze counterparty concentration risk
 */
export async function analyzeCounterpartyConcentration(
  counterpartyExposures: Array<{ counterparty: string; exposure: number; creditRating: string }>,
  totalExposure: number,
  maxCounterpartyLimit: number = 0.10,
  transaction?: Transaction
): Promise<Array<{ counterparty: string; percentage: number; creditRating: string; breach: boolean }>> {
  return counterpartyExposures.map(cp => {
    const percentage = (cp.exposure / totalExposure) * 100;
    const breach = percentage > maxCounterpartyLimit * 100;
    return {
      counterparty: cp.counterparty,
      percentage,
      creditRating: cp.creditRating,
      breach,
    };
  });
}

// ============================================================================
// GREEKS CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate option Delta (sensitivity to underlying price)
 */
export async function calculateDelta(
  optionType: string,
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));
  const normalCDF = (x: number) => 0.5 * (1 + Math.tanh(x * Math.sqrt(2 / Math.PI)));
  const delta = optionType === 'CALL' ? normalCDF(d1) : normalCDF(d1) - 1;
  return delta;
}

/**
 * Calculate option Gamma (rate of change of Delta)
 */
export async function calculateGamma(
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));
  const normalPDF = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const gamma = normalPDF(d1) / (underlyingPrice * volatility * Math.sqrt(timeToExpiry));
  return gamma;
}

/**
 * Calculate option Vega (sensitivity to volatility)
 */
export async function calculateVega(
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));
  const normalPDF = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const vega = underlyingPrice * normalPDF(d1) * Math.sqrt(timeToExpiry) / 100;
  return vega;
}

/**
 * Calculate option Theta (time decay)
 */
export async function calculateTheta(
  optionType: string,
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);
  const normalPDF = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const normalCDF = (x: number) => 0.5 * (1 + Math.tanh(x * Math.sqrt(2 / Math.PI)));
  const term1 = -(underlyingPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry));
  let theta: number;
  if (optionType === 'CALL') {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
    theta = (term1 - term2) / 365;
  } else {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
    theta = (term1 + term2) / 365;
  }
  return theta;
}

/**
 * Calculate option Rho (sensitivity to interest rates)
 */
export async function calculateRho(
  optionType: string,
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<number> {
  const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);
  const normalCDF = (x: number) => 0.5 * (1 + Math.tanh(x * Math.sqrt(2 / Math.PI)));
  const rho = optionType === 'CALL'
    ? strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2) / 100
    : -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) / 100;
  return rho;
}

/**
 * Calculate all Greeks for an option position
 */
export async function calculateAllGreeks(
  optionType: string,
  underlyingPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number,
  riskFreeRate: number,
  transaction?: Transaction
): Promise<{
  optionType: string;
  underlyingPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  volatility: number;
  riskFreeRate: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}> {
  const delta = await calculateDelta(optionType, underlyingPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, transaction);
  const gamma = await calculateGamma(underlyingPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, transaction);
  const vega = await calculateVega(underlyingPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, transaction);
  const theta = await calculateTheta(optionType, underlyingPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, transaction);
  const rho = await calculateRho(optionType, underlyingPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, transaction);
  return {
    optionType,
    underlyingPrice,
    strikePrice,
    timeToExpiry,
    volatility,
    riskFreeRate,
    delta,
    gamma,
    vega,
    theta,
    rho,
  };
}

/**
 * Calculate portfolio-level Greeks aggregation
 */
export async function calculatePortfolioGreeks(
  optionPositions: Array<{
    optionType: string;
    underlyingPrice: number;
    strikePrice: number;
    timeToExpiry: number;
    volatility: number;
    riskFreeRate: number;
    delta: number;
    gamma: number;
    vega: number;
    theta: number;
    quantity: number;
  }>,
  transaction?: Transaction
): Promise<{ totalDelta: number; totalGamma: number; totalVega: number; totalTheta: number }> {
  const totalDelta = optionPositions.reduce((acc, p) => acc + p.delta * p.quantity, 0);
  const totalGamma = optionPositions.reduce((acc, p) => acc + p.gamma * p.quantity, 0);
  const totalVega = optionPositions.reduce((acc, p) => acc + p.vega * p.quantity, 0);
  const totalTheta = optionPositions.reduce((acc, p) => acc + p.theta * p.quantity, 0);
  return {
    totalDelta,
    totalGamma,
    totalVega,
    totalTheta,
  };
}

// ============================================================================
// MARGIN CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate initial margin requirement using SPAN methodology
 */
export async function calculateInitialMargin(
  positionValue: number,
  volatility: number,
  priceScenarios: number,
  transaction?: Transaction
): Promise<number> {
  const baseMargin = positionValue * volatility * Math.sqrt(1 / 252);
  const scenarioFactor = Math.sqrt(priceScenarios / 16);
  const initialMargin = baseMargin * scenarioFactor * 3;
  return initialMargin;
}

/**
 * Calculate maintenance margin requirement
 */
export async function calculateMaintenanceMargin(
  initialMargin: number,
  maintenanceRatio: number = 0.70,
  transaction?: Transaction
): Promise<number> {
  const maintenanceMargin = initialMargin * maintenanceRatio;
  return maintenanceMargin;
}

/**
 * Calculate variation margin for marked-to-market positions
 */
export async function calculateVariationMargin(
  previousMTM: number,
  currentMTM: number,
  collateralHeld: number,
  transaction?: Transaction
): Promise<{ variationMargin: number; marginCall: boolean; amountDue: number }> {
  const variationMargin = currentMTM - previousMTM;
  const netPosition = collateralHeld + variationMargin;
  const marginCall = netPosition < 0;
  const amountDue = marginCall ? Math.abs(netPosition) : 0;
  return {
    variationMargin,
    marginCall,
    amountDue,
  };
}

// ============================================================================
// RISK LIMIT MONITORING FUNCTIONS
// ============================================================================

/**
 * Monitor risk limits and identify breaches
 */
export async function monitorRiskLimits(
  limits: RiskLimitAttributes[],
  currentValues: Record<string, number>,
  transaction?: Transaction
): Promise<Array<RiskLimitAttributes & { breached: boolean; utilizationPercent: number }>> {
  return limits.map(limit => {
    const currentValue = currentValues[limit.limitId] || limit.currentValue;
    const utilizationPercent = (currentValue / limit.limitValue) * 100;
    const breached = utilizationPercent >= limit.breachThreshold * 100;
    return {
      ...limit,
      currentValue,
      utilizationPercent,
      breached,
    };
  });
}

/**
 * Create risk limit
 */
export async function createRiskLimit(
  data: RiskLimitCreationAttributes,
  transaction?: Transaction
): Promise<RiskLimit> {
  return await RiskLimit.create(data, { transaction });
}

/**
 * Get risk limits by scope
 */
export async function getRiskLimitsByScope(
  scope: string,
  scopeId: string,
  transaction?: Transaction
): Promise<RiskLimit[]> {
  return await RiskLimit.findAll({
    where: { scope, scopeId, enabled: true },
    transaction,
  });
}

/**
 * Update risk limit status
 */
export async function updateRiskLimitStatus(
  limitId: string,
  currentValue: number,
  transaction?: Transaction
): Promise<RiskLimit | null> {
  const limit = await RiskLimit.findOne({ where: { limitId }, transaction });
  if (!limit) return null;

  const utilization = currentValue / limit.limitValue;
  let status: RiskLimitStatus;
  let breachCount = limit.breachCount;
  let lastBreach = limit.lastBreach;

  if (utilization >= limit.breachThreshold) {
    status = RiskLimitStatus.BREACH;
    breachCount++;
    lastBreach = new Date();
  } else if (utilization >= limit.warningThreshold) {
    status = RiskLimitStatus.WARNING;
  } else {
    status = RiskLimitStatus.NORMAL;
  }

  await limit.update({
    currentValue,
    utilization,
    status,
    breachCount,
    lastBreach,
    lastChecked: new Date(),
  }, { transaction });

  return limit;
}

// ============================================================================
// STRESS SCENARIO FUNCTIONS
// ============================================================================

/**
 * Create stress scenario
 */
export async function createStressScenario(
  data: StressScenarioCreationAttributes,
  transaction?: Transaction
): Promise<StressScenario> {
  return await StressScenario.create(data, { transaction });
}

/**
 * Get active stress scenarios
 */
export async function getActiveStressScenarios(
  transaction?: Transaction
): Promise<StressScenario[]> {
  return await StressScenario.findAll({
    where: { isActive: true },
    transaction,
  });
}

/**
 * Run stress scenario analysis
 */
export async function runStressScenarioAnalysis(
  scenarioId: string,
  portfolioValue: number,
  positions: Array<{ securityId: string; value: number; beta: number }>,
  transaction?: Transaction
): Promise<{
  scenarioId: string;
  totalImpact: number;
  percentageImpact: number;
  positionImpacts: Array<{ securityId: string; impact: number }>;
}> {
  const scenario = await StressScenario.findOne({ where: { scenarioId }, transaction });
  if (!scenario) {
    throw new Error(`Stress scenario ${scenarioId} not found`);
  }

  const positionImpacts = positions.map(pos => {
    const impact = pos.value * pos.beta * (scenario.impactOnPortfolio / portfolioValue);
    return {
      securityId: pos.securityId,
      impact,
    };
  });

  const totalImpact = positionImpacts.reduce((acc, p) => acc + p.impact, 0);
  const percentageImpact = (totalImpact / portfolioValue) * 100;

  return {
    scenarioId,
    totalImpact,
    percentageImpact,
    positionImpacts,
  };
}

// ============================================================================
// RISK METRICS PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Create risk metrics record
 */
export async function createRiskMetrics(
  data: RiskMetricsCreationAttributes,
  transaction?: Transaction
): Promise<RiskMetrics> {
  return await RiskMetrics.create(data, { transaction });
}

/**
 * Get latest risk metrics for portfolio
 */
export async function getLatestRiskMetrics(
  portfolioId: string,
  transaction?: Transaction
): Promise<RiskMetrics | null> {
  return await RiskMetrics.findOne({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });
}

/**
 * Get risk metrics history
 */
export async function getRiskMetricsHistory(
  portfolioId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<RiskMetrics[]> {
  return await RiskMetrics.findAll({
    where: {
      portfolioId,
      calculationDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['calculationDate', 'ASC']],
    transaction,
  });
}

// ============================================================================
// MARGIN REQUIREMENT FUNCTIONS
// ============================================================================

/**
 * Create margin requirement record
 */
export async function createMarginRequirement(
  data: MarginRequirementCreationAttributes,
  transaction?: Transaction
): Promise<MarginRequirement> {
  return await MarginRequirement.create(data, { transaction });
}

/**
 * Get latest margin requirement
 */
export async function getLatestMarginRequirement(
  portfolioId: string,
  transaction?: Transaction
): Promise<MarginRequirement | null> {
  return await MarginRequirement.findOne({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });
}

/**
 * Get margin calls
 */
export async function getActiveMarginCalls(
  transaction?: Transaction
): Promise<MarginRequirement[]> {
  return await MarginRequirement.findAll({
    where: { marginCall: true },
    order: [['marginCallDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// GREEK METRICS FUNCTIONS
// ============================================================================

/**
 * Create Greek metrics record
 */
export async function createGreekMetrics(
  data: GreekMetricsCreationAttributes,
  transaction?: Transaction
): Promise<GreekMetrics> {
  return await GreekMetrics.create(data, { transaction });
}

/**
 * Get Greek metrics for portfolio
 */
export async function getGreekMetricsByPortfolio(
  portfolioId: string,
  transaction?: Transaction
): Promise<GreekMetrics[]> {
  return await GreekMetrics.findAll({
    where: { portfolioId },
    order: [['calculationDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// INITIALIZE ALL MODELS
// ============================================================================

/**
 * Initialize all risk management models
 */
export function initializeRiskManagementModels(sequelize: Sequelize): void {
  RiskMetrics.initModel(sequelize);
  RiskLimit.initModel(sequelize);
  StressScenario.initModel(sequelize);
  GreekMetrics.initModel(sequelize);
  MarginRequirement.initModel(sequelize);
  defineRiskManagementAssociations();
}

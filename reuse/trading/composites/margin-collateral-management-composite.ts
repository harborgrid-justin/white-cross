/**
 * LOC: WC-COMP-TRADING-MARG-001
 * File: /reuse/trading/composites/margin-collateral-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../margin-collateral-kit
 *   - ../../validation-kit
 *   - ../../error-handling-kit
 *
 * DOWNSTREAM (imported by):
 *   - Margin controllers
 *   - Risk management services
 *   - Treasury operations
 *   - Regulatory reporting modules
 */

/**
 * File: /reuse/trading/composites/margin-collateral-management-composite.ts
 * Locator: WC-COMP-TRADING-MARG-001
 * Purpose: Bloomberg Terminal Margin & Collateral Management Composite
 *
 * Upstream: @nestjs/common, sequelize, margin-collateral-kit, validation-kit
 * Downstream: Margin controllers, risk services, treasury ops, regulatory reporting
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PostgreSQL 14+
 * Exports: 45 composed functions for comprehensive margin and collateral management
 *
 * LLM Context: Enterprise-grade margin and collateral management composite for Bloomberg Terminal-level trading platform.
 * Provides initial margin calculation (Reg T, Portfolio, SPAN, VaR), variation margin calculation,
 * portfolio margining, SPAN margining, risk-based margining, margin call monitoring, collateral valuation,
 * haircut calculation, eligible collateral management, concentration charges, margin optimization,
 * cross-margining benefits, segregation requirements, margin forecasting, and real-time margin tracking.
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

// Import from margin-collateral-kit
import {
  MarginMethodology,
  MarginType,
  CollateralType,
  CollateralQuality,
  MarginCallStatus,
  MarginAccount,
  InitialMarginResult,
  VariationMarginResult,
  CollateralAsset,
  MarginCall,
  SPANParameters,
  VaRParameters,
  CCPMarginRequirement,
  StressTestScenario,
  MarketShock,
  HaircutSchedule,
  CollateralOptimization,
  calculateRegTInitialMargin,
  calculatePortfolioMargin,
  calculateSPANMargin,
  calculateVaRBasedMargin,
  calculateOptionsMargin,
  calculateFuturesMargin,
  calculateCrossMargin,
  calculateVariationMargin,
  calculateMarkToMarket,
  calculateUnrealizedPnL,
  processVariationMarginCall,
  settleVariationMargin,
  calculateIntraDayMargin,
  aggregateVariationMargin,
  validateCollateralEligibility,
  calculateCollateralValue,
  applyHaircuts,
  optimizeCollateralAllocation,
  processCollateralSubstitution,
  calculateCollateralCoverage,
  monitorCollateralQuality,
  revalueCollateral,
  segregateCollateral,
  transformCollateral,
  generateMarginCall,
  processMarginCallResponse,
  escalateMarginCall,
  calculateMarginDeficiency,
  calculateMarginExcess,
  validateMarginCallSatisfaction,
  trackMarginCallHistory,
  calculateCCPMargin,
  calculateBilateralMargin,
  performMarginStressTesting,
  simulateMarginUnderScenarios,
  calculateMarginUtilization,
  forecastMarginRequirements,
  reconcileMarginBalances,
  generateMarginReports,
} from '../margin-collateral-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Margin account status
 */
export enum MarginAccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  RESTRICTED = 'restricted',
  CLOSED = 'closed',
  UNDER_REVIEW = 'under_review',
}

/**
 * Collateral pledge status
 */
export enum CollateralPledgeStatus {
  AVAILABLE = 'available',
  PLEDGED = 'pledged',
  IN_TRANSIT = 'in_transit',
  LOCKED = 'locked',
  RELEASED = 'released',
}

/**
 * Concentration limit type
 */
export enum ConcentrationLimitType {
  ISSUER = 'issuer',
  ASSET_CLASS = 'asset_class',
  SECURITY = 'security',
  COUNTERPARTY = 'counterparty',
}

// ============================================================================
// SEQUELIZE MODEL: MarginAccountModel
// ============================================================================

/**
 * TypeScript interface for MarginAccountModel attributes
 */
export interface MarginAccountModelAttributes {
  id: string;
  accountId: string;
  accountName: string;
  accountType: string;
  methodology: MarginMethodology;
  baseCurrency: string;
  counterparty: string | null;
  clearingMember: string | null;
  segregated: boolean;
  status: MarginAccountStatus;
  maxLeverage: number;
  concentrationLimit: number;
  positionLimits: Record<string, any>;
  marginParameters: Record<string, any>;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MarginAccountModelCreationAttributes
  extends Optional<MarginAccountModelAttributes, 'id' | 'counterparty' | 'clearingMember' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: MarginAccountModel
 * Margin account configuration and settings
 */
export class MarginAccountModel
  extends Model<MarginAccountModelAttributes, MarginAccountModelCreationAttributes>
  implements MarginAccountModelAttributes
{
  declare id: string;
  declare accountId: string;
  declare accountName: string;
  declare accountType: string;
  declare methodology: MarginMethodology;
  declare baseCurrency: string;
  declare counterparty: string | null;
  declare clearingMember: string | null;
  declare segregated: boolean;
  declare status: MarginAccountStatus;
  declare maxLeverage: number;
  declare concentrationLimit: number;
  declare positionLimits: Record<string, any>;
  declare marginParameters: Record<string, any>;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getMarginCalculations: HasManyGetAssociationsMixin<MarginCalculationModel>;
  declare getCollateralAssets: HasManyGetAssociationsMixin<CollateralAssetModel>;
  declare getMarginCalls: HasManyGetAssociationsMixin<MarginCallModel>;

  declare static associations: {
    marginCalculations: Association<MarginAccountModel, MarginCalculationModel>;
    collateralAssets: Association<MarginAccountModel, CollateralAssetModel>;
    marginCalls: Association<MarginAccountModel, MarginCallModel>;
  };

  /**
   * Initialize MarginAccountModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarginAccountModel {
    MarginAccountModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'account_id',
        },
        accountName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'account_name',
        },
        accountType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'account_type',
        },
        methodology: {
          type: DataTypes.ENUM(...Object.values(MarginMethodology)),
          allowNull: false,
          field: 'methodology',
        },
        baseCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
          field: 'base_currency',
        },
        counterparty: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'counterparty',
        },
        clearingMember: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'clearing_member',
        },
        segregated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'segregated',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(MarginAccountStatus)),
          allowNull: false,
          defaultValue: MarginAccountStatus.ACTIVE,
          field: 'status',
        },
        maxLeverage: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 2.0,
          field: 'max_leverage',
        },
        concentrationLimit: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0.25,
          field: 'concentration_limit',
        },
        positionLimits: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'position_limits',
        },
        marginParameters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'margin_parameters',
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
        tableName: 'margin_accounts',
        modelName: 'MarginAccountModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'], unique: true },
          { fields: ['status'] },
          { fields: ['methodology'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return MarginAccountModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MarginCalculationModel
// ============================================================================

/**
 * TypeScript interface for MarginCalculationModel attributes
 */
export interface MarginCalculationModelAttributes {
  id: string;
  accountId: string;
  calculationId: string;
  calculationType: MarginType;
  methodology: MarginMethodology;
  calculationDate: Date;
  valuationDate: Date;
  baseCurrency: string;
  grossMargin: number;
  netMargin: number;
  diversificationBenefit: number;
  confidence: number;
  componentBreakdown: Record<string, any>[];
  offsets: Record<string, any>[];
  riskMetrics: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarginCalculationModelCreationAttributes
  extends Optional<MarginCalculationModelAttributes, 'id'> {}

/**
 * Sequelize Model: MarginCalculationModel
 * Historical margin calculations and results
 */
export class MarginCalculationModel
  extends Model<MarginCalculationModelAttributes, MarginCalculationModelCreationAttributes>
  implements MarginCalculationModelAttributes
{
  declare id: string;
  declare accountId: string;
  declare calculationId: string;
  declare calculationType: MarginType;
  declare methodology: MarginMethodology;
  declare calculationDate: Date;
  declare valuationDate: Date;
  declare baseCurrency: string;
  declare grossMargin: number;
  declare netMargin: number;
  declare diversificationBenefit: number;
  declare confidence: number;
  declare componentBreakdown: Record<string, any>[];
  declare offsets: Record<string, any>[];
  declare riskMetrics: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations
  declare getMarginAccount: BelongsToGetAssociationMixin<MarginAccountModel>;

  declare static associations: {
    marginAccount: Association<MarginCalculationModel, MarginAccountModel>;
  };

  /**
   * Initialize MarginCalculationModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarginCalculationModel {
    MarginCalculationModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          references: {
            model: 'margin_accounts',
            key: 'account_id',
          },
          field: 'account_id',
        },
        calculationId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'calculation_id',
        },
        calculationType: {
          type: DataTypes.ENUM(...Object.values(MarginType)),
          allowNull: false,
          field: 'calculation_type',
        },
        methodology: {
          type: DataTypes.ENUM(...Object.values(MarginMethodology)),
          allowNull: false,
          field: 'methodology',
        },
        calculationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculation_date',
        },
        valuationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'valuation_date',
        },
        baseCurrency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'base_currency',
        },
        grossMargin: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'gross_margin',
        },
        netMargin: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'net_margin',
        },
        diversificationBenefit: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'diversification_benefit',
        },
        confidence: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          defaultValue: 1.0,
          field: 'confidence',
        },
        componentBreakdown: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'component_breakdown',
        },
        offsets: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'offsets',
        },
        riskMetrics: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'risk_metrics',
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
        tableName: 'margin_calculations',
        modelName: 'MarginCalculationModel',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['calculation_id'], unique: true },
          { fields: ['calculation_type'] },
          { fields: ['methodology'] },
          { fields: ['calculation_date'] },
          { fields: ['valuation_date'] },
        ],
      }
    );

    return MarginCalculationModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CollateralAssetModel
// ============================================================================

/**
 * TypeScript interface for CollateralAssetModel attributes
 */
export interface CollateralAssetModelAttributes {
  id: string;
  accountId: string;
  assetId: string;
  securityId: string;
  assetType: CollateralType;
  quantity: number;
  marketValue: number;
  haircutRate: number;
  collateralValue: number;
  quality: CollateralQuality;
  currency: string;
  issuer: string;
  maturityDate: Date | null;
  eligible: boolean;
  pledgedTo: string | null;
  pledgeStatus: CollateralPledgeStatus;
  segregated: boolean;
  concentrationCharge: number;
  lastRevaluation: Date;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CollateralAssetModelCreationAttributes
  extends Optional<CollateralAssetModelAttributes, 'id' | 'maturityDate' | 'pledgedTo' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CollateralAssetModel
 * Collateral assets pledged for margin requirements
 */
export class CollateralAssetModel
  extends Model<CollateralAssetModelAttributes, CollateralAssetModelCreationAttributes>
  implements CollateralAssetModelAttributes
{
  declare id: string;
  declare accountId: string;
  declare assetId: string;
  declare securityId: string;
  declare assetType: CollateralType;
  declare quantity: number;
  declare marketValue: number;
  declare haircutRate: number;
  declare collateralValue: number;
  declare quality: CollateralQuality;
  declare currency: string;
  declare issuer: string;
  declare maturityDate: Date | null;
  declare eligible: boolean;
  declare pledgedTo: string | null;
  declare pledgeStatus: CollateralPledgeStatus;
  declare segregated: boolean;
  declare concentrationCharge: number;
  declare lastRevaluation: Date;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getMarginAccount: BelongsToGetAssociationMixin<MarginAccountModel>;

  declare static associations: {
    marginAccount: Association<CollateralAssetModel, MarginAccountModel>;
  };

  /**
   * Initialize CollateralAssetModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof CollateralAssetModel {
    CollateralAssetModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          references: {
            model: 'margin_accounts',
            key: 'account_id',
          },
          field: 'account_id',
        },
        assetId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'asset_id',
        },
        securityId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'security_id',
        },
        assetType: {
          type: DataTypes.ENUM(...Object.values(CollateralType)),
          allowNull: false,
          field: 'asset_type',
        },
        quantity: {
          type: DataTypes.DECIMAL(20, 8),
          allowNull: false,
          field: 'quantity',
        },
        marketValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'market_value',
        },
        haircutRate: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          field: 'haircut_rate',
        },
        collateralValue: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'collateral_value',
        },
        quality: {
          type: DataTypes.ENUM(...Object.values(CollateralQuality)),
          allowNull: false,
          field: 'quality',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        issuer: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'issuer',
        },
        maturityDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'maturity_date',
        },
        eligible: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'eligible',
        },
        pledgedTo: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'pledged_to',
        },
        pledgeStatus: {
          type: DataTypes.ENUM(...Object.values(CollateralPledgeStatus)),
          allowNull: false,
          defaultValue: CollateralPledgeStatus.AVAILABLE,
          field: 'pledge_status',
        },
        segregated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'segregated',
        },
        concentrationCharge: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'concentration_charge',
        },
        lastRevaluation: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'last_revaluation',
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
        tableName: 'collateral_assets',
        modelName: 'CollateralAssetModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['asset_id'], unique: true },
          { fields: ['security_id'] },
          { fields: ['asset_type'] },
          { fields: ['quality'] },
          { fields: ['pledge_status'] },
          { fields: ['eligible'] },
        ],
      }
    );

    return CollateralAssetModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MarginCallModel
// ============================================================================

/**
 * TypeScript interface for MarginCallModel attributes
 */
export interface MarginCallModelAttributes {
  id: string;
  accountId: string;
  callId: string;
  callType: MarginType;
  status: MarginCallStatus;
  issuedDate: Date;
  dueDate: Date;
  amount: number;
  currency: string;
  currentDeficit: number;
  satisfiedAmount: number;
  remainingAmount: number;
  collateralPosted: Record<string, any>[];
  escalationLevel: number;
  counterparty: string | null;
  reason: string;
  resolutionDate: Date | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MarginCallModelCreationAttributes
  extends Optional<MarginCallModelAttributes, 'id' | 'counterparty' | 'resolutionDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: MarginCallModel
 * Margin call tracking and management
 */
export class MarginCallModel
  extends Model<MarginCallModelAttributes, MarginCallModelCreationAttributes>
  implements MarginCallModelAttributes
{
  declare id: string;
  declare accountId: string;
  declare callId: string;
  declare callType: MarginType;
  declare status: MarginCallStatus;
  declare issuedDate: Date;
  declare dueDate: Date;
  declare amount: number;
  declare currency: string;
  declare currentDeficit: number;
  declare satisfiedAmount: number;
  declare remainingAmount: number;
  declare collateralPosted: Record<string, any>[];
  declare escalationLevel: number;
  declare counterparty: string | null;
  declare reason: string;
  declare resolutionDate: Date | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getMarginAccount: BelongsToGetAssociationMixin<MarginAccountModel>;

  declare static associations: {
    marginAccount: Association<MarginCallModel, MarginAccountModel>;
  };

  /**
   * Initialize MarginCallModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarginCallModel {
    MarginCallModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        accountId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          references: {
            model: 'margin_accounts',
            key: 'account_id',
          },
          field: 'account_id',
        },
        callId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'call_id',
        },
        callType: {
          type: DataTypes.ENUM(...Object.values(MarginType)),
          allowNull: false,
          field: 'call_type',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(MarginCallStatus)),
          allowNull: false,
          field: 'status',
        },
        issuedDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'issued_date',
        },
        dueDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'due_date',
        },
        amount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'amount',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        currentDeficit: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'current_deficit',
        },
        satisfiedAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'satisfied_amount',
        },
        remainingAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          field: 'remaining_amount',
        },
        collateralPosted: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'collateral_posted',
        },
        escalationLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'escalation_level',
        },
        counterparty: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'counterparty',
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'reason',
        },
        resolutionDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolution_date',
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
        tableName: 'margin_calls',
        modelName: 'MarginCallModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['call_id'], unique: true },
          { fields: ['status'] },
          { fields: ['call_type'] },
          { fields: ['issued_date'] },
          { fields: ['due_date'] },
        ],
      }
    );

    return MarginCallModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: HaircutScheduleModel
// ============================================================================

/**
 * TypeScript interface for HaircutScheduleModel attributes
 */
export interface HaircutScheduleModelAttributes {
  id: string;
  assetType: CollateralType;
  quality: CollateralQuality;
  maturityBucket: string | null;
  haircutRate: number;
  effectiveDate: Date;
  expiryDate: Date | null;
  source: string;
  jurisdiction: string | null;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface HaircutScheduleModelCreationAttributes
  extends Optional<HaircutScheduleModelAttributes, 'id' | 'maturityBucket' | 'expiryDate' | 'jurisdiction' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: HaircutScheduleModel
 * Haircut schedules for collateral valuation
 */
export class HaircutScheduleModel
  extends Model<HaircutScheduleModelAttributes, HaircutScheduleModelCreationAttributes>
  implements HaircutScheduleModelAttributes
{
  declare id: string;
  declare assetType: CollateralType;
  declare quality: CollateralQuality;
  declare maturityBucket: string | null;
  declare haircutRate: number;
  declare effectiveDate: Date;
  declare expiryDate: Date | null;
  declare source: string;
  declare jurisdiction: string | null;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize HaircutScheduleModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof HaircutScheduleModel {
    HaircutScheduleModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        assetType: {
          type: DataTypes.ENUM(...Object.values(CollateralType)),
          allowNull: false,
          field: 'asset_type',
        },
        quality: {
          type: DataTypes.ENUM(...Object.values(CollateralQuality)),
          allowNull: false,
          field: 'quality',
        },
        maturityBucket: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'maturity_bucket',
        },
        haircutRate: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          field: 'haircut_rate',
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'effective_date',
        },
        expiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expiry_date',
        },
        source: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'source',
        },
        jurisdiction: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'jurisdiction',
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
        tableName: 'haircut_schedules',
        modelName: 'HaircutScheduleModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['asset_type', 'quality'] },
          { fields: ['effective_date'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return HaircutScheduleModel;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineMarginCollateralAssociations(): void {
  MarginAccountModel.hasMany(MarginCalculationModel, {
    foreignKey: 'accountId',
    sourceKey: 'accountId',
    as: 'marginCalculations',
    onDelete: 'CASCADE',
  });

  MarginCalculationModel.belongsTo(MarginAccountModel, {
    foreignKey: 'accountId',
    targetKey: 'accountId',
    as: 'marginAccount',
  });

  MarginAccountModel.hasMany(CollateralAssetModel, {
    foreignKey: 'accountId',
    sourceKey: 'accountId',
    as: 'collateralAssets',
    onDelete: 'CASCADE',
  });

  CollateralAssetModel.belongsTo(MarginAccountModel, {
    foreignKey: 'accountId',
    targetKey: 'accountId',
    as: 'marginAccount',
  });

  MarginAccountModel.hasMany(MarginCallModel, {
    foreignKey: 'accountId',
    sourceKey: 'accountId',
    as: 'marginCalls',
    onDelete: 'CASCADE',
  });

  MarginCallModel.belongsTo(MarginAccountModel, {
    foreignKey: 'accountId',
    targetKey: 'accountId',
    as: 'marginAccount',
  });
}

// ============================================================================
// MARGIN ACCOUNT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create margin account
 */
export async function createMarginAccount(
  data: MarginAccountModelCreationAttributes,
  transaction?: Transaction
): Promise<MarginAccountModel> {
  return await MarginAccountModel.create(data, { transaction });
}

/**
 * Get margin account by account ID
 */
export async function getMarginAccountByAccountId(
  accountId: string,
  transaction?: Transaction
): Promise<MarginAccountModel | null> {
  return await MarginAccountModel.findOne({
    where: { accountId },
    include: ['marginCalculations', 'collateralAssets', 'marginCalls'],
    transaction,
  });
}

/**
 * Update margin account methodology
 */
export async function updateMarginAccountMethodology(
  accountId: string,
  methodology: MarginMethodology,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, MarginAccountModel[]]> {
  return await MarginAccountModel.update(
    { methodology, updatedBy },
    { where: { accountId }, returning: true, transaction }
  );
}

/**
 * Update margin account status
 */
export async function updateMarginAccountStatus(
  accountId: string,
  status: MarginAccountStatus,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, MarginAccountModel[]]> {
  return await MarginAccountModel.update(
    { status, updatedBy },
    { where: { accountId }, returning: true, transaction }
  );
}

/**
 * Set account leverage limits
 */
export async function setAccountLeverageLimits(
  accountId: string,
  maxLeverage: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, MarginAccountModel[]]> {
  return await MarginAccountModel.update(
    { maxLeverage, updatedBy },
    { where: { accountId }, returning: true, transaction }
  );
}

// ============================================================================
// INITIAL MARGIN CALCULATION FUNCTIONS (Composed)
// ============================================================================

/**
 * Calculate and persist Regulation T initial margin
 */
export async function calculateAndPersistRegTMargin(
  accountId: string,
  positions: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistRegTMargin');

  try {
    // Calculate margin using kit function
    const result = await calculateRegTInitialMargin(accountId, positions, transaction);

    // Persist calculation to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.REG_T,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: {},
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted Reg T margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist Reg T margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate and persist portfolio margin
 */
export async function calculateAndPersistPortfolioMargin(
  accountId: string,
  positions: any[],
  varParams: VaRParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistPortfolioMargin');

  try {
    // Calculate portfolio margin using kit function
    const result = await calculatePortfolioMargin(accountId, positions, varParams, transaction);

    // Persist calculation to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.PORTFOLIO,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: { varParams },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted portfolio margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist portfolio margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate and persist SPAN margin
 */
export async function calculateAndPersistSPANMargin(
  accountId: string,
  positions: any[],
  spanParams: SPANParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistSPANMargin');

  try {
    // Calculate SPAN margin using kit function
    const result = await calculateSPANMargin(accountId, positions, spanParams, transaction);

    // Persist calculation to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.SPAN,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: { spanParams },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted SPAN margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist SPAN margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate and persist VaR-based margin
 */
export async function calculateAndPersistVaRMargin(
  accountId: string,
  positions: any[],
  varParams: VaRParameters,
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistVaRMargin');

  try {
    // Calculate VaR-based margin using kit function
    const result = await calculateVaRBasedMargin(accountId, positions, varParams, transaction);

    // Persist calculation to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.VAR,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: { varParams },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted VaR margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist VaR margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate options margin with persistence
 */
export async function calculateAndPersistOptionsMargin(
  accountId: string,
  optionPositions: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistOptionsMargin');

  try {
    const result = await calculateOptionsMargin(accountId, optionPositions, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: result.methodology,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: {},
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted options margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist options margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate futures margin with persistence
 */
export async function calculateAndPersistFuturesMargin(
  accountId: string,
  futurePositions: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistFuturesMargin');

  try {
    const result = await calculateFuturesMargin(accountId, futurePositions, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: result.methodology,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: {},
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted futures margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist futures margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate cross-margin benefits with persistence
 */
export async function calculateAndPersistCrossMargin(
  accountId: string,
  positions: any[],
  crossMarginConfig: any,
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistCrossMargin');

  try {
    const result = await calculateCrossMargin(accountId, positions, crossMarginConfig, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: result.methodology,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: { crossMarginConfig },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted cross-margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist cross-margin: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// VARIATION MARGIN CALCULATION FUNCTIONS (Composed)
// ============================================================================

/**
 * Calculate and persist variation margin
 */
export async function calculateAndPersistVariationMargin(
  accountId: string,
  positions: any[],
  valuationDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: VariationMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistVariationMargin');

  try {
    const result = await calculateVariationMargin(accountId, positions, valuationDate, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.VARIATION,
        methodology: MarginMethodology.VAR,
        calculationDate: new Date(),
        valuationDate: result.valuationDate,
        baseCurrency: result.currency,
        grossMargin: result.variationMargin,
        netMargin: result.variationMargin,
        diversificationBenefit: 0,
        confidence: 1.0,
        componentBreakdown: result.positions as any,
        offsets: [],
        riskMetrics: {
          unrealizedPnL: result.unrealizedPnL,
          realizedPnL: result.realizedPnL,
          marginMovement: result.marginMovement,
        },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted variation margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist variation margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate and track mark-to-market
 */
export async function calculateAndTrackMarkToMarket(
  accountId: string,
  positions: any[],
  marketDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<{ mtmResult: any; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndTrackMarkToMarket');

  try {
    const mtmResult = await calculateMarkToMarket(accountId, positions, marketDate, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: `MTM-${Date.now()}`,
        calculationType: MarginType.VARIATION,
        methodology: MarginMethodology.VAR,
        calculationDate: new Date(),
        valuationDate: marketDate,
        baseCurrency: mtmResult.currency,
        grossMargin: mtmResult.totalUnrealizedPnL,
        netMargin: mtmResult.totalUnrealizedPnL,
        diversificationBenefit: 0,
        confidence: 1.0,
        componentBreakdown: mtmResult.positions as any,
        offsets: [],
        riskMetrics: { totalMarketValue: mtmResult.totalMarketValue },
        metadata: { type: 'mark_to_market' },
        createdBy,
      },
      { transaction }
    );

    logger.log(`Tracked mark-to-market: ${model.calculationId}`);
    return { mtmResult, model };
  } catch (error) {
    logger.error(`Failed to calculate and track MTM: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate intraday margin with persistence
 */
export async function calculateAndPersistIntraDayMargin(
  accountId: string,
  existingPositions: any[],
  pendingTrades: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ result: InitialMarginResult; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistIntraDayMargin');

  try {
    const result = await calculateIntraDayMargin(accountId, existingPositions, pendingTrades, transaction);

    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: result.calculationId,
        calculationType: MarginType.INITIAL,
        methodology: result.methodology,
        calculationDate: result.timestamp,
        valuationDate: result.timestamp,
        baseCurrency: result.baseCurrency,
        grossMargin: result.grossMargin,
        netMargin: result.netMargin,
        diversificationBenefit: result.diversificationBenefit,
        confidence: result.confidence,
        componentBreakdown: result.componentBreakdown as any,
        offsets: result.offsets as any,
        riskMetrics: { intraDayCalculation: true },
        metadata: result.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Persisted intraday margin calculation: ${result.calculationId}`);
    return { result, model };
  } catch (error) {
    logger.error(`Failed to calculate and persist intraday margin: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// COLLATERAL MANAGEMENT FUNCTIONS (Composed)
// ============================================================================

/**
 * Add collateral asset with validation
 */
export async function addCollateralAssetWithValidation(
  accountId: string,
  assetData: CollateralAssetModelCreationAttributes,
  transaction?: Transaction
): Promise<CollateralAssetModel> {
  const logger = new Logger('MarginComposite:addCollateralAssetWithValidation');

  try {
    // Validate eligibility using kit function
    const isEligible = await validateCollateralEligibility(
      assetData.assetType,
      assetData.quality,
      assetData.issuer,
      transaction
    );

    if (!isEligible) {
      throw new Error(`Collateral asset not eligible: ${assetData.securityId}`);
    }

    // Create collateral asset
    const asset = await CollateralAssetModel.create(
      {
        ...assetData,
        eligible: isEligible,
      },
      { transaction }
    );

    logger.log(`Added collateral asset: ${asset.assetId}`);
    return asset;
  } catch (error) {
    logger.error(`Failed to add collateral asset: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Apply haircuts to collateral assets
 */
export async function applyHaircutsToCollateralAssets(
  accountId: string,
  transaction?: Transaction
): Promise<CollateralAssetModel[]> {
  const logger = new Logger('MarginComposite:applyHaircutsToCollateralAssets');

  try {
    // Fetch all collateral assets for account
    const assets = await CollateralAssetModel.findAll({
      where: { accountId, eligible: true },
      transaction,
    });

    // Convert to CollateralAsset format for kit function
    const collateralAssets: CollateralAsset[] = assets.map(a => ({
      assetId: a.assetId,
      securityId: a.securityId,
      assetType: a.assetType,
      quantity: parseFloat(a.quantity.toString()),
      marketValue: parseFloat(a.marketValue.toString()),
      haircutRate: parseFloat(a.haircutRate.toString()),
      collateralValue: parseFloat(a.collateralValue.toString()),
      quality: a.quality,
      currency: a.currency,
      issuer: a.issuer,
      maturityDate: a.maturityDate || undefined,
      eligible: a.eligible,
      pledgedTo: a.pledgedTo || undefined,
      segregated: a.segregated,
      metadata: a.metadata,
    }));

    // Apply haircuts using kit function
    const updatedAssets = await applyHaircuts(collateralAssets, transaction);

    // Update database records
    const updatedModels: CollateralAssetModel[] = [];
    for (const updatedAsset of updatedAssets) {
      const [, [model]] = await CollateralAssetModel.update(
        {
          haircutRate: updatedAsset.haircutRate,
          collateralValue: updatedAsset.collateralValue,
        },
        {
          where: { assetId: updatedAsset.assetId },
          returning: true,
          transaction,
        }
      );
      if (model) updatedModels.push(model);
    }

    logger.log(`Applied haircuts to ${updatedModels.length} collateral assets`);
    return updatedModels;
  } catch (error) {
    logger.error(`Failed to apply haircuts: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Optimize collateral allocation
 */
export async function optimizeCollateralAllocationForAccount(
  accountId: string,
  requiredCollateral: number,
  transaction?: Transaction
): Promise<CollateralOptimization> {
  const logger = new Logger('MarginComposite:optimizeCollateralAllocationForAccount');

  try {
    // Fetch available collateral
    const assets = await CollateralAssetModel.findAll({
      where: {
        accountId,
        eligible: true,
        pledgeStatus: CollateralPledgeStatus.AVAILABLE,
      },
      transaction,
    });

    const collateralAssets: CollateralAsset[] = assets.map(a => ({
      assetId: a.assetId,
      securityId: a.securityId,
      assetType: a.assetType,
      quantity: parseFloat(a.quantity.toString()),
      marketValue: parseFloat(a.marketValue.toString()),
      haircutRate: parseFloat(a.haircutRate.toString()),
      collateralValue: parseFloat(a.collateralValue.toString()),
      quality: a.quality,
      currency: a.currency,
      issuer: a.issuer,
      maturityDate: a.maturityDate || undefined,
      eligible: a.eligible,
      pledgedTo: a.pledgedTo || undefined,
      segregated: a.segregated,
      metadata: a.metadata,
    }));

    // Optimize allocation using kit function
    const optimization = await optimizeCollateralAllocation(
      accountId,
      requiredCollateral,
      collateralAssets,
      transaction
    );

    logger.log(`Optimized collateral allocation for account: ${accountId}`);
    return optimization;
  } catch (error) {
    logger.error(`Failed to optimize collateral allocation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate concentration charges
 */
export async function calculateConcentrationCharges(
  accountId: string,
  limitType: ConcentrationLimitType,
  transaction?: Transaction
): Promise<{ totalCharge: number; charges: Record<string, number> }> {
  const logger = new Logger('MarginComposite:calculateConcentrationCharges');

  try {
    // Fetch account configuration
    const account = await getMarginAccountByAccountId(accountId, transaction);
    if (!account) {
      throw new Error(`Margin account not found: ${accountId}`);
    }

    const concentrationLimit = parseFloat(account.concentrationLimit.toString());

    // Fetch collateral assets
    const assets = await CollateralAssetModel.findAll({
      where: { accountId, pledgeStatus: CollateralPledgeStatus.PLEDGED },
      transaction,
    });

    const totalCollateralValue = assets.reduce(
      (sum, a) => sum + parseFloat(a.collateralValue.toString()),
      0
    );

    const charges: Record<string, number> = {};
    let totalCharge = 0;

    // Group by concentration type
    const groups: Record<string, number> = {};
    for (const asset of assets) {
      const key =
        limitType === ConcentrationLimitType.ISSUER
          ? asset.issuer
          : limitType === ConcentrationLimitType.ASSET_CLASS
          ? asset.assetType
          : asset.securityId;

      groups[key] = (groups[key] || 0) + parseFloat(asset.collateralValue.toString());
    }

    // Calculate charges for concentrations exceeding limit
    for (const [key, value] of Object.entries(groups)) {
      const concentration = value / totalCollateralValue;
      if (concentration > concentrationLimit) {
        const excessConcentration = concentration - concentrationLimit;
        const charge = value * excessConcentration * 0.1; // 10% charge on excess
        charges[key] = charge;
        totalCharge += charge;
      }
    }

    // Update concentration charges in database
    for (const asset of assets) {
      const key =
        limitType === ConcentrationLimitType.ISSUER
          ? asset.issuer
          : limitType === ConcentrationLimitType.ASSET_CLASS
          ? asset.assetType
          : asset.securityId;

      if (charges[key]) {
        await asset.update(
          { concentrationCharge: charges[key] },
          { transaction }
        );
      }
    }

    logger.log(`Calculated concentration charges: $${totalCharge.toFixed(2)}`);
    return { totalCharge, charges };
  } catch (error) {
    logger.error(`Failed to calculate concentration charges: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Revalue collateral assets
 */
export async function revalueCollateralAssets(
  accountId: string,
  marketPrices: Record<string, number>,
  transaction?: Transaction
): Promise<CollateralAssetModel[]> {
  const logger = new Logger('MarginComposite:revalueCollateralAssets');

  try {
    const assets = await CollateralAssetModel.findAll({
      where: { accountId },
      transaction,
    });

    const collateralAssets: CollateralAsset[] = assets.map(a => ({
      assetId: a.assetId,
      securityId: a.securityId,
      assetType: a.assetType,
      quantity: parseFloat(a.quantity.toString()),
      marketValue: parseFloat(a.marketValue.toString()),
      haircutRate: parseFloat(a.haircutRate.toString()),
      collateralValue: parseFloat(a.collateralValue.toString()),
      quality: a.quality,
      currency: a.currency,
      issuer: a.issuer,
      maturityDate: a.maturityDate || undefined,
      eligible: a.eligible,
      pledgedTo: a.pledgedTo || undefined,
      segregated: a.segregated,
      metadata: a.metadata,
    }));

    // Revalue using kit function
    const revaluedAssets = await revalueCollateral(collateralAssets, marketPrices, transaction);

    // Update database records
    const updatedModels: CollateralAssetModel[] = [];
    for (const revaluedAsset of revaluedAssets) {
      const [, [model]] = await CollateralAssetModel.update(
        {
          marketValue: revaluedAsset.marketValue,
          collateralValue: revaluedAsset.collateralValue,
          lastRevaluation: new Date(),
        },
        {
          where: { assetId: revaluedAsset.assetId },
          returning: true,
          transaction,
        }
      );
      if (model) updatedModels.push(model);
    }

    logger.log(`Revalued ${updatedModels.length} collateral assets`);
    return updatedModels;
  } catch (error) {
    logger.error(`Failed to revalue collateral assets: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Monitor collateral quality and update status
 */
export async function monitorAndUpdateCollateralQuality(
  accountId: string,
  transaction?: Transaction
): Promise<{ degraded: CollateralAssetModel[]; upgraded: CollateralAssetModel[] }> {
  const logger = new Logger('MarginComposite:monitorAndUpdateCollateralQuality');

  try {
    const assets = await CollateralAssetModel.findAll({
      where: { accountId },
      transaction,
    });

    const collateralAssets: CollateralAsset[] = assets.map(a => ({
      assetId: a.assetId,
      securityId: a.securityId,
      assetType: a.assetType,
      quantity: parseFloat(a.quantity.toString()),
      marketValue: parseFloat(a.marketValue.toString()),
      haircutRate: parseFloat(a.haircutRate.toString()),
      collateralValue: parseFloat(a.collateralValue.toString()),
      quality: a.quality,
      currency: a.currency,
      issuer: a.issuer,
      maturityDate: a.maturityDate || undefined,
      eligible: a.eligible,
      pledgedTo: a.pledgedTo || undefined,
      segregated: a.segregated,
      metadata: a.metadata,
    }));

    // Monitor quality using kit function
    const qualityReport = await monitorCollateralQuality(collateralAssets, transaction);

    const degraded: CollateralAssetModel[] = [];
    const upgraded: CollateralAssetModel[] = [];

    // Update quality changes in database
    for (const change of qualityReport.qualityChanges) {
      const [, [model]] = await CollateralAssetModel.update(
        {
          quality: change.newQuality as CollateralQuality,
          eligible: change.eligible,
        },
        {
          where: { assetId: change.assetId },
          returning: true,
          transaction,
        }
      );

      if (model) {
        if (change.direction === 'downgrade') {
          degraded.push(model);
        } else {
          upgraded.push(model);
        }
      }
    }

    logger.log(`Monitored collateral quality: ${degraded.length} degraded, ${upgraded.length} upgraded`);
    return { degraded, upgraded };
  } catch (error) {
    logger.error(`Failed to monitor collateral quality: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Segregate collateral assets
 */
export async function segregateCollateralForAccount(
  accountId: string,
  assetIds: string[],
  segregationAccount: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<CollateralAssetModel[]> {
  const logger = new Logger('MarginComposite:segregateCollateralForAccount');

  try {
    // Segregate using kit function
    await segregateCollateral(accountId, assetIds, segregationAccount, transaction);

    // Update database records
    const [, models] = await CollateralAssetModel.update(
      {
        segregated: true,
        pledgedTo: segregationAccount,
        updatedBy,
      },
      {
        where: { assetId: { [Op.in]: assetIds }, accountId },
        returning: true,
        transaction,
      }
    );

    logger.log(`Segregated ${models.length} collateral assets`);
    return models;
  } catch (error) {
    logger.error(`Failed to segregate collateral: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// MARGIN CALL MANAGEMENT FUNCTIONS (Composed)
// ============================================================================

/**
 * Generate and persist margin call
 */
export async function generateAndPersistMarginCall(
  accountId: string,
  marginDeficiency: number,
  callType: MarginType,
  reason: string,
  createdBy: string,
  transaction?: Transaction
): Promise<{ call: MarginCall; model: MarginCallModel }> {
  const logger = new Logger('MarginComposite:generateAndPersistMarginCall');

  try {
    // Generate margin call using kit function
    const call = await generateMarginCall(accountId, marginDeficiency, callType, reason, transaction);

    // Persist to database
    const model = await MarginCallModel.create(
      {
        accountId,
        callId: call.callId,
        callType: call.callType,
        status: call.status,
        issuedDate: call.issuedDate,
        dueDate: call.dueDate,
        amount: call.amount,
        currency: call.currency,
        currentDeficit: call.currentDeficit,
        satisfiedAmount: call.satisfiedAmount,
        remainingAmount: call.remainingAmount,
        collateralPosted: call.collateralPosted as any,
        escalationLevel: call.escalationLevel,
        counterparty: call.counterparty || null,
        reason: call.reason,
        metadata: call.metadata,
        createdBy,
      },
      { transaction }
    );

    logger.log(`Generated and persisted margin call: ${call.callId}`);
    return { call, model };
  } catch (error) {
    logger.error(`Failed to generate margin call: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Process margin call response
 */
export async function processMarginCallResponseAndUpdate(
  callId: string,
  collateralAssets: CollateralAsset[],
  updatedBy: string,
  transaction?: Transaction
): Promise<{ call: MarginCall; model: MarginCallModel }> {
  const logger = new Logger('MarginComposite:processMarginCallResponseAndUpdate');

  try {
    // Process response using kit function
    const call = await processMarginCallResponse(callId, collateralAssets, transaction);

    // Update database record
    const [, [model]] = await MarginCallModel.update(
      {
        status: call.status,
        satisfiedAmount: call.satisfiedAmount,
        remainingAmount: call.remainingAmount,
        collateralPosted: call.collateralPosted as any,
        resolutionDate: call.status === MarginCallStatus.SATISFIED ? new Date() : null,
        updatedBy,
      },
      {
        where: { callId },
        returning: true,
        transaction,
      }
    );

    if (!model) {
      throw new Error(`Margin call not found: ${callId}`);
    }

    logger.log(`Processed margin call response: ${callId}`);
    return { call, model };
  } catch (error) {
    logger.error(`Failed to process margin call response: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Escalate margin call
 */
export async function escalateMarginCallAndUpdate(
  callId: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<{ call: MarginCall; model: MarginCallModel }> {
  const logger = new Logger('MarginComposite:escalateMarginCallAndUpdate');

  try {
    // Escalate using kit function
    const call = await escalateMarginCall(callId, transaction);

    // Update database record
    const [, [model]] = await MarginCallModel.update(
      {
        status: call.status,
        escalationLevel: call.escalationLevel,
        updatedBy,
      },
      {
        where: { callId },
        returning: true,
        transaction,
      }
    );

    if (!model) {
      throw new Error(`Margin call not found: ${callId}`);
    }

    logger.log(`Escalated margin call: ${callId} to level ${call.escalationLevel}`);
    return { call, model };
  } catch (error) {
    logger.error(`Failed to escalate margin call: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get margin calls by status
 */
export async function getMarginCallsByStatus(
  status: MarginCallStatus,
  transaction?: Transaction
): Promise<MarginCallModel[]> {
  return await MarginCallModel.findAll({
    where: { status },
    include: ['marginAccount'],
    transaction,
  });
}

/**
 * Get overdue margin calls
 */
export async function getOverdueMarginCalls(
  transaction?: Transaction
): Promise<MarginCallModel[]> {
  return await MarginCallModel.findAll({
    where: {
      status: { [Op.in]: [MarginCallStatus.ISSUED, MarginCallStatus.ACKNOWLEDGED] },
      dueDate: { [Op.lt]: new Date() },
    },
    include: ['marginAccount'],
    transaction,
  });
}

/**
 * Get margin call history for account
 */
export async function getMarginCallHistoryForAccount(
  accountId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<MarginCallModel[]> {
  return await MarginCallModel.findAll({
    where: {
      accountId,
      issuedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['issuedDate', 'DESC']],
    transaction,
  });
}

// ============================================================================
// HAIRCUT SCHEDULE FUNCTIONS
// ============================================================================

/**
 * Create haircut schedule
 */
export async function createHaircutSchedule(
  data: HaircutScheduleModelCreationAttributes,
  transaction?: Transaction
): Promise<HaircutScheduleModel> {
  return await HaircutScheduleModel.create(data, { transaction });
}

/**
 * Get active haircut for asset
 */
export async function getActiveHaircutForAsset(
  assetType: CollateralType,
  quality: CollateralQuality,
  effectiveDate: Date,
  transaction?: Transaction
): Promise<HaircutScheduleModel | null> {
  return await HaircutScheduleModel.findOne({
    where: {
      assetType,
      quality,
      isActive: true,
      effectiveDate: { [Op.lte]: effectiveDate },
      [Op.or]: [
        { expiryDate: { [Op.gte]: effectiveDate } },
        { expiryDate: null },
      ],
    },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });
}

/**
 * Update haircut rates
 */
export async function updateHaircutRates(
  assetType: CollateralType,
  quality: CollateralQuality,
  newRate: number,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, HaircutScheduleModel[]]> {
  return await HaircutScheduleModel.update(
    { haircutRate: newRate, updatedBy },
    {
      where: { assetType, quality, isActive: true },
      returning: true,
      transaction,
    }
  );
}

// ============================================================================
// CCP AND BILATERAL MARGIN FUNCTIONS (Composed)
// ============================================================================

/**
 * Calculate and persist CCP margin requirements
 */
export async function calculateAndPersistCCPMargin(
  ccpId: string,
  clearingMember: string,
  accountId: string,
  positions: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ ccpMargin: CCPMarginRequirement; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistCCPMargin');

  try {
    // Calculate CCP margin using kit function
    const ccpMargin = await calculateCCPMargin(ccpId, clearingMember, accountId, positions, transaction);

    // Persist to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: `CCP-${ccpId}-${Date.now()}`,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.SPAN,
        calculationDate: new Date(),
        valuationDate: ccpMargin.valuationDate,
        baseCurrency: ccpMargin.currency,
        grossMargin: ccpMargin.initialMargin + ccpMargin.additionalMargin,
        netMargin: ccpMargin.totalRequirement,
        diversificationBenefit: 0,
        confidence: 1.0,
        componentBreakdown: ccpMargin.positions as any,
        offsets: [],
        riskMetrics: {
          ccpId: ccpMargin.ccpId,
          ccpName: ccpMargin.ccpName,
          defaultFundContribution: ccpMargin.defaultFundContribution,
        },
        metadata: { type: 'ccp_margin' },
        createdBy,
      },
      { transaction }
    );

    logger.log(`Calculated and persisted CCP margin for ${ccpMargin.ccpName}`);
    return { ccpMargin, model };
  } catch (error) {
    logger.error(`Failed to calculate CCP margin: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate bilateral margin
 */
export async function calculateAndPersistBilateralMargin(
  accountId: string,
  counterpartyId: string,
  trades: any[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ bilateralMargin: any; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:calculateAndPersistBilateralMargin');

  try {
    // Calculate bilateral margin using kit function
    const bilateralMargin = await calculateBilateralMargin(accountId, counterpartyId, trades, transaction);

    // Persist to database
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: `BILATERAL-${Date.now()}`,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.SIMM,
        calculationDate: new Date(),
        valuationDate: new Date(),
        baseCurrency: bilateralMargin.currency,
        grossMargin: bilateralMargin.initialMargin,
        netMargin: bilateralMargin.netExposure,
        diversificationBenefit: 0,
        confidence: 1.0,
        componentBreakdown: [],
        offsets: [],
        riskMetrics: {
          counterpartyId,
          creditAdjustment: bilateralMargin.creditAdjustment,
          collateralHeld: bilateralMargin.collateralHeld,
        },
        metadata: { type: 'bilateral_margin' },
        createdBy,
      },
      { transaction }
    );

    logger.log(`Calculated and persisted bilateral margin for counterparty: ${counterpartyId}`);
    return { bilateralMargin, model };
  } catch (error) {
    logger.error(`Failed to calculate bilateral margin: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// STRESS TESTING AND FORECASTING FUNCTIONS (Composed)
// ============================================================================

/**
 * Perform margin stress testing
 */
export async function performAndPersistMarginStressTesting(
  accountId: string,
  positions: any[],
  scenarios: StressTestScenario[],
  createdBy: string,
  transaction?: Transaction
): Promise<{ stressResults: any[]; models: MarginCalculationModel[] }> {
  const logger = new Logger('MarginComposite:performAndPersistMarginStressTesting');

  try {
    // Perform stress testing using kit function
    const stressResults = await performMarginStressTesting(accountId, positions, scenarios, transaction);

    // Persist each scenario result
    const models: MarginCalculationModel[] = [];
    for (const result of stressResults) {
      const model = await MarginCalculationModel.create(
        {
          accountId,
          calculationId: `STRESS-${result.scenarioId}-${Date.now()}`,
          calculationType: MarginType.INITIAL,
          methodology: MarginMethodology.VAR,
          calculationDate: new Date(),
          valuationDate: new Date(),
          baseCurrency: 'USD',
          grossMargin: result.stressedMargin,
          netMargin: result.stressedMargin,
          diversificationBenefit: 0,
          confidence: 1.0,
          componentBreakdown: [],
          offsets: [],
          riskMetrics: {
            scenarioId: result.scenarioId,
            scenarioName: result.scenarioName,
            marginIncrease: result.marginIncrease,
            collateralDeficit: result.collateralDeficit,
          },
          metadata: { type: 'stress_test' },
          createdBy,
        },
        { transaction }
      );
      models.push(model);
    }

    logger.log(`Performed and persisted stress testing with ${scenarios.length} scenarios`);
    return { stressResults, models };
  } catch (error) {
    logger.error(`Failed to perform stress testing: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Forecast margin requirements
 */
export async function forecastAndPersistMarginRequirements(
  accountId: string,
  projectedPositions: any[],
  forecastDate: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<{ forecast: any; model: MarginCalculationModel }> {
  const logger = new Logger('MarginComposite:forecastAndPersistMarginRequirements');

  try {
    // Forecast using kit function
    const forecast = await forecastMarginRequirements(accountId, projectedPositions, forecastDate, transaction);

    // Persist forecast
    const model = await MarginCalculationModel.create(
      {
        accountId,
        calculationId: `FORECAST-${Date.now()}`,
        calculationType: MarginType.INITIAL,
        methodology: MarginMethodology.VAR,
        calculationDate: new Date(),
        valuationDate: forecastDate,
        baseCurrency: forecast.currency,
        grossMargin: forecast.forecastedMargin,
        netMargin: forecast.forecastedMargin,
        diversificationBenefit: 0,
        confidence: forecast.confidence,
        componentBreakdown: forecast.breakdown as any,
        offsets: [],
        riskMetrics: {
          expectedIncrease: forecast.expectedIncrease,
          volatility: forecast.volatility,
        },
        metadata: { type: 'forecast' },
        createdBy,
      },
      { transaction }
    );

    logger.log(`Forecasted margin requirements for date: ${forecastDate.toISOString()}`);
    return { forecast, model };
  } catch (error) {
    logger.error(`Failed to forecast margin requirements: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate margin utilization
 */
export async function calculateMarginUtilizationForAccount(
  accountId: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('MarginComposite:calculateMarginUtilizationForAccount');

  try {
    // Get account configuration
    const account = await getMarginAccountByAccountId(accountId, transaction);
    if (!account) {
      throw new Error(`Margin account not found: ${accountId}`);
    }

    // Get latest margin calculation
    const latestCalculation = await MarginCalculationModel.findOne({
      where: { accountId, calculationType: MarginType.INITIAL },
      order: [['calculationDate', 'DESC']],
      transaction,
    });

    if (!latestCalculation) {
      throw new Error(`No margin calculations found for account: ${accountId}`);
    }

    // Get total collateral value
    const collateral = await CollateralAssetModel.findAll({
      where: { accountId, eligible: true },
      transaction,
    });

    const totalCollateralValue = collateral.reduce(
      (sum, c) => sum + parseFloat(c.collateralValue.toString()),
      0
    );

    // Calculate utilization using kit function
    const utilization = await calculateMarginUtilization(
      accountId,
      parseFloat(latestCalculation.netMargin.toString()),
      totalCollateralValue,
      transaction
    );

    logger.log(`Calculated margin utilization for account: ${accountId}`);
    return utilization;
  } catch (error) {
    logger.error(`Failed to calculate margin utilization: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// REPORTING AND RECONCILIATION FUNCTIONS (Composed)
// ============================================================================

/**
 * Generate comprehensive margin report
 */
export async function generateComprehensiveMarginReport(
  accountId: string,
  reportDate: Date,
  reportType: string,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('MarginComposite:generateComprehensiveMarginReport');

  try {
    // Get account details
    const account = await getMarginAccountByAccountId(accountId, transaction);
    if (!account) {
      throw new Error(`Margin account not found: ${accountId}`);
    }

    // Get latest calculations
    const initialMarginCalc = await MarginCalculationModel.findOne({
      where: { accountId, calculationType: MarginType.INITIAL },
      order: [['calculationDate', 'DESC']],
      transaction,
    });

    const variationMarginCalc = await MarginCalculationModel.findOne({
      where: { accountId, calculationType: MarginType.VARIATION },
      order: [['calculationDate', 'DESC']],
      transaction,
    });

    // Get collateral
    const collateral = await CollateralAssetModel.findAll({
      where: { accountId },
      transaction,
    });

    // Get margin calls
    const marginCalls = await getMarginCallHistoryForAccount(
      accountId,
      new Date(reportDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      reportDate,
      transaction
    );

    // Generate report using kit function (if needed for additional data)
    const kitReport = await generateMarginReports(accountId, reportDate, reportType);

    const report = {
      accountId,
      accountName: account.accountName,
      reportDate,
      reportType,
      methodology: account.methodology,
      status: account.status,

      initialMargin: initialMarginCalc ? {
        netMargin: parseFloat(initialMarginCalc.netMargin.toString()),
        grossMargin: parseFloat(initialMarginCalc.grossMargin.toString()),
        diversificationBenefit: parseFloat(initialMarginCalc.diversificationBenefit.toString()),
        calculationDate: initialMarginCalc.calculationDate,
      } : null,

      variationMargin: variationMarginCalc ? {
        amount: parseFloat(variationMarginCalc.netMargin.toString()),
        calculationDate: variationMarginCalc.calculationDate,
        unrealizedPnL: variationMarginCalc.riskMetrics.unrealizedPnL,
      } : null,

      collateral: {
        totalAssets: collateral.length,
        totalMarketValue: collateral.reduce((sum, c) => sum + parseFloat(c.marketValue.toString()), 0),
        totalCollateralValue: collateral.reduce((sum, c) => sum + parseFloat(c.collateralValue.toString()), 0),
        averageHaircut: collateral.reduce((sum, c) => sum + parseFloat(c.haircutRate.toString()), 0) / collateral.length,
        byAssetType: groupCollateralByAssetType(collateral),
        byQuality: groupCollateralByQuality(collateral),
      },

      marginCalls: {
        total: marginCalls.length,
        outstanding: marginCalls.filter(c => c.status !== MarginCallStatus.SATISFIED).length,
        totalAmount: marginCalls.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0),
        byStatus: groupMarginCallsByStatus(marginCalls),
      },

      utilization: initialMarginCalc && collateral.length > 0 ? {
        marginRequired: parseFloat(initialMarginCalc.netMargin.toString()),
        collateralAvailable: collateral.reduce((sum, c) => sum + parseFloat(c.collateralValue.toString()), 0),
        utilizationRate: parseFloat(initialMarginCalc.netMargin.toString()) /
                        collateral.reduce((sum, c) => sum + parseFloat(c.collateralValue.toString()), 0),
      } : null,

      generatedAt: new Date(),
    };

    logger.log(`Generated comprehensive margin report for account: ${accountId}`);
    return report;
  } catch (error) {
    logger.error(`Failed to generate margin report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reconcile margin balances
 */
export async function reconcileMarginBalancesForAccount(
  accountId: string,
  counterpartyId: string,
  reconciliationDate: Date,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('MarginComposite:reconcileMarginBalancesForAccount');

  try {
    // Reconcile using kit function
    const reconciliation = await reconcileMarginBalances(
      accountId,
      counterpartyId,
      reconciliationDate,
      transaction
    );

    logger.log(`Reconciled margin balances for account: ${accountId}`);
    return reconciliation;
  } catch (error) {
    logger.error(`Failed to reconcile margin balances: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// REAL-TIME TRACKING FUNCTIONS
// ============================================================================

/**
 * Real-time margin tracking
 */
export async function trackRealTimeMargin(
  accountId: string,
  transaction?: Transaction
): Promise<{
  currentMargin: number;
  availableCollateral: number;
  utilizationRate: number;
  excess: number;
  deficit: number;
  timestamp: Date;
}> {
  const logger = new Logger('MarginComposite:trackRealTimeMargin');

  try {
    // Get latest margin calculation
    const latestCalc = await MarginCalculationModel.findOne({
      where: { accountId, calculationType: MarginType.INITIAL },
      order: [['calculationDate', 'DESC']],
      transaction,
    });

    if (!latestCalc) {
      throw new Error(`No margin calculations found for account: ${accountId}`);
    }

    // Get available collateral
    const collateral = await CollateralAssetModel.findAll({
      where: { accountId, eligible: true, pledgeStatus: CollateralPledgeStatus.PLEDGED },
      transaction,
    });

    const availableCollateral = collateral.reduce(
      (sum, c) => sum + parseFloat(c.collateralValue.toString()),
      0
    );

    const currentMargin = parseFloat(latestCalc.netMargin.toString());
    const utilizationRate = availableCollateral > 0 ? currentMargin / availableCollateral : 0;
    const excess = Math.max(0, availableCollateral - currentMargin);
    const deficit = Math.max(0, currentMargin - availableCollateral);

    const result = {
      currentMargin,
      availableCollateral,
      utilizationRate,
      excess,
      deficit,
      timestamp: new Date(),
    };

    logger.log(`Tracked real-time margin for account: ${accountId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to track real-time margin: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function groupCollateralByAssetType(assets: CollateralAssetModel[]): Record<string, any> {
  const groups: Record<string, any> = {};

  for (const asset of assets) {
    if (!groups[asset.assetType]) {
      groups[asset.assetType] = {
        count: 0,
        marketValue: 0,
        collateralValue: 0,
      };
    }
    groups[asset.assetType].count++;
    groups[asset.assetType].marketValue += parseFloat(asset.marketValue.toString());
    groups[asset.assetType].collateralValue += parseFloat(asset.collateralValue.toString());
  }

  return groups;
}

function groupCollateralByQuality(assets: CollateralAssetModel[]): Record<string, any> {
  const groups: Record<string, any> = {};

  for (const asset of assets) {
    if (!groups[asset.quality]) {
      groups[asset.quality] = {
        count: 0,
        marketValue: 0,
        collateralValue: 0,
      };
    }
    groups[asset.quality].count++;
    groups[asset.quality].marketValue += parseFloat(asset.marketValue.toString());
    groups[asset.quality].collateralValue += parseFloat(asset.collateralValue.toString());
  }

  return groups;
}

function groupMarginCallsByStatus(calls: MarginCallModel[]): Record<string, number> {
  const groups: Record<string, number> = {};

  for (const call of calls) {
    groups[call.status] = (groups[call.status] || 0) + 1;
  }

  return groups;
}

// ============================================================================
// EXPORT: Initialize all models
// ============================================================================

/**
 * Initialize all margin and collateral models
 */
export function initializeMarginCollateralModels(sequelize: Sequelize): void {
  MarginAccountModel.initModel(sequelize);
  MarginCalculationModel.initModel(sequelize);
  CollateralAssetModel.initModel(sequelize);
  MarginCallModel.initModel(sequelize);
  HaircutScheduleModel.initModel(sequelize);
  defineMarginCollateralAssociations();
}

/**
 * Export default object with all functions
 */
export default {
  // Model initialization
  initializeMarginCollateralModels,
  defineMarginCollateralAssociations,

  // Margin account management (5 functions)
  createMarginAccount,
  getMarginAccountByAccountId,
  updateMarginAccountMethodology,
  updateMarginAccountStatus,
  setAccountLeverageLimits,

  // Initial margin calculations (7 functions)
  calculateAndPersistRegTMargin,
  calculateAndPersistPortfolioMargin,
  calculateAndPersistSPANMargin,
  calculateAndPersistVaRMargin,
  calculateAndPersistOptionsMargin,
  calculateAndPersistFuturesMargin,
  calculateAndPersistCrossMargin,

  // Variation margin calculations (3 functions)
  calculateAndPersistVariationMargin,
  calculateAndTrackMarkToMarket,
  calculateAndPersistIntraDayMargin,

  // Collateral management (7 functions)
  addCollateralAssetWithValidation,
  applyHaircutsToCollateralAssets,
  optimizeCollateralAllocationForAccount,
  calculateConcentrationCharges,
  revalueCollateralAssets,
  monitorAndUpdateCollateralQuality,
  segregateCollateralForAccount,

  // Margin call management (6 functions)
  generateAndPersistMarginCall,
  processMarginCallResponseAndUpdate,
  escalateMarginCallAndUpdate,
  getMarginCallsByStatus,
  getOverdueMarginCalls,
  getMarginCallHistoryForAccount,

  // Haircut schedules (3 functions)
  createHaircutSchedule,
  getActiveHaircutForAsset,
  updateHaircutRates,

  // CCP and bilateral (2 functions)
  calculateAndPersistCCPMargin,
  calculateAndPersistBilateralMargin,

  // Stress testing and forecasting (3 functions)
  performAndPersistMarginStressTesting,
  forecastAndPersistMarginRequirements,
  calculateMarginUtilizationForAccount,

  // Reporting and reconciliation (2 functions)
  generateComprehensiveMarginReport,
  reconcileMarginBalancesForAccount,

  // Real-time tracking (1 function)
  trackRealTimeMargin,
};

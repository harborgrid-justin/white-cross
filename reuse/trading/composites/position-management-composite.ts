/**
 * LOC: WC-COMP-TRADING-POS-001
 * File: /reuse/trading/composites/position-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - decimal.js (v10.x)
 *   - ../position-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Position management controllers
 *   - Trading execution services
 *   - Risk management modules
 *   - Portfolio analytics engines
 */

/**
 * File: /reuse/trading/composites/position-management-composite.ts
 * Locator: WC-COMP-TRADING-POS-001
 * Purpose: Bloomberg Terminal Position Management Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, decimal.js, position-management-kit
 * Downstream: Trading controllers, risk services, portfolio management, reconciliation engines
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Decimal.js 10.x
 * Exports: 45 composed functions for comprehensive position management and tracking
 *
 * LLM Context: Bloomberg Terminal-grade position management composite for trading platform.
 * Provides real-time position tracking, multi-asset aggregation, position netting/offsetting,
 * average cost calculation, position aging, corporate action adjustments, reconciliation,
 * break management, position limits, margin tracking, collateral management, position rolls,
 * cross-margining, position transfers, and intraday updates.
 */

import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Position side (long/short)
 */
export enum PositionSide {
  LONG = 'long',
  SHORT = 'short',
}

/**
 * Position status
 */
export enum PositionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  PARTIAL = 'partial',
  PENDING = 'pending',
  RECONCILING = 'reconciling',
  BROKEN = 'broken',
}

/**
 * Asset class types
 */
export enum AssetClass {
  EQUITY = 'equity',
  FIXED_INCOME = 'fixed_income',
  COMMODITY = 'commodity',
  FX = 'fx',
  DERIVATIVE = 'derivative',
  CRYPTO = 'crypto',
  CASH = 'cash',
}

/**
 * Instrument types
 */
export enum InstrumentType {
  STOCK = 'stock',
  BOND = 'bond',
  OPTION = 'option',
  FUTURE = 'future',
  SWAP = 'swap',
  FX_SPOT = 'fx_spot',
  FX_FORWARD = 'fx_forward',
  CFD = 'cfd',
}

/**
 * Corporate action types
 */
export enum CorporateActionType {
  DIVIDEND = 'dividend',
  SPLIT = 'split',
  MERGER = 'merger',
  SPINOFF = 'spinoff',
  RIGHTS_ISSUE = 'rights_issue',
  BONUS_ISSUE = 'bonus_issue',
}

/**
 * Break types
 */
export enum BreakType {
  QUANTITY_MISMATCH = 'quantity_mismatch',
  PRICE_MISMATCH = 'price_mismatch',
  MISSING_POSITION = 'missing_position',
  DUPLICATE_POSITION = 'duplicate_position',
  SETTLEMENT_FAIL = 'settlement_fail',
}

/**
 * Margin calculation method
 */
export enum MarginMethod {
  SPAN = 'span',
  TIMS = 'tims',
  VAR = 'var',
  STANDARD = 'standard',
}

// ============================================================================
// SEQUELIZE MODEL: Position
// ============================================================================

/**
 * TypeScript interface for Position attributes
 */
export interface PositionAttributes {
  id: string;
  accountId: string;
  portfolioId: string;
  instrumentId: string;
  symbol: string;
  assetClass: AssetClass;
  instrumentType: InstrumentType;
  side: PositionSide;
  quantity: string; // Stored as string for Decimal precision
  averagePrice: string;
  currentPrice: string;
  marketValue: string;
  costBasis: string;
  unrealizedPnL: string;
  realizedPnL: string;
  currency: string;
  entryDate: Date;
  lastUpdated: Date;
  status: PositionStatus;
  ageDays: number;
  bookValue: string;
  taxLots: Record<string, any>[];
  corporateActions: Record<string, any>[];
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PositionCreationAttributes extends Optional<PositionAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: Position
 * Core position tracking and management
 */
export class Position extends Model<PositionAttributes, PositionCreationAttributes> implements PositionAttributes {
  declare id: string;
  declare accountId: string;
  declare portfolioId: string;
  declare instrumentId: string;
  declare symbol: string;
  declare assetClass: AssetClass;
  declare instrumentType: InstrumentType;
  declare side: PositionSide;
  declare quantity: string;
  declare averagePrice: string;
  declare currentPrice: string;
  declare marketValue: string;
  declare costBasis: string;
  declare unrealizedPnL: string;
  declare realizedPnL: string;
  declare currency: string;
  declare entryDate: Date;
  declare lastUpdated: Date;
  declare status: PositionStatus;
  declare ageDays: number;
  declare bookValue: string;
  declare taxLots: Record<string, any>[];
  declare corporateActions: Record<string, any>[];
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getPositionBreaks: HasManyGetAssociationsMixin<PositionBreak>;
  declare getMarginRequirements: HasManyGetAssociationsMixin<MarginRequirement>;
  declare getCollateralAllocations: HasManyGetAssociationsMixin<CollateralAllocation>;

  declare static associations: {
    positionBreaks: Association<Position, PositionBreak>;
    marginRequirements: Association<Position, MarginRequirement>;
    collateralAllocations: Association<Position, CollateralAllocation>;
  };

  /**
   * Initialize Position model
   */
  static initModel(sequelize: Sequelize): typeof Position {
    Position.init(
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
          comment: 'Account identifier',
        },
        portfolioId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'portfolio_id',
          comment: 'Portfolio identifier',
        },
        instrumentId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'instrument_id',
          comment: 'Instrument identifier',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'symbol',
          comment: 'Trading symbol',
        },
        assetClass: {
          type: DataTypes.ENUM(...Object.values(AssetClass)),
          allowNull: false,
          field: 'asset_class',
        },
        instrumentType: {
          type: DataTypes.ENUM(...Object.values(InstrumentType)),
          allowNull: false,
          field: 'instrument_type',
        },
        side: {
          type: DataTypes.ENUM(...Object.values(PositionSide)),
          allowNull: false,
          field: 'side',
        },
        quantity: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'quantity',
          comment: 'Position quantity',
        },
        averagePrice: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'average_price',
          comment: 'Volume-weighted average price',
        },
        currentPrice: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'current_price',
          comment: 'Current market price',
        },
        marketValue: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'market_value',
          comment: 'Current market value',
        },
        costBasis: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'cost_basis',
          comment: 'Total cost basis',
        },
        unrealizedPnL: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          defaultValue: '0.00000000',
          field: 'unrealized_pnl',
          comment: 'Unrealized profit/loss',
        },
        realizedPnL: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          defaultValue: '0.00000000',
          field: 'realized_pnl',
          comment: 'Realized profit/loss',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
          comment: 'Position currency (ISO 4217)',
        },
        entryDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'entry_date',
          comment: 'Position entry date',
        },
        lastUpdated: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'last_updated',
          comment: 'Last update timestamp',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(PositionStatus)),
          allowNull: false,
          defaultValue: PositionStatus.OPEN,
          field: 'status',
        },
        ageDays: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'age_days',
          comment: 'Position age in days',
        },
        bookValue: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'book_value',
          comment: 'Book value for accounting',
        },
        taxLots: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'tax_lots',
          comment: 'Tax lot tracking',
        },
        corporateActions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'corporate_actions',
          comment: 'Corporate action history',
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
        tableName: 'positions',
        modelName: 'Position',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['account_id'] },
          { fields: ['portfolio_id'] },
          { fields: ['instrument_id'] },
          { fields: ['symbol'] },
          { fields: ['status'] },
          { fields: ['asset_class'] },
          { fields: ['entry_date'] },
          { fields: ['account_id', 'instrument_id'], unique: true, where: { deleted_at: null } },
        ],
      }
    );

    return Position;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PositionBreak
// ============================================================================

/**
 * TypeScript interface for PositionBreak attributes
 */
export interface PositionBreakAttributes {
  id: string;
  positionId: string;
  breakType: BreakType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  expectedValue: string;
  actualValue: string;
  difference: string;
  detectedAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  resolution: string | null;
  isResolved: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PositionBreakCreationAttributes extends Optional<PositionBreakAttributes, 'id' | 'resolvedAt' | 'resolvedBy' | 'resolution' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: PositionBreak
 * Position reconciliation breaks
 */
export class PositionBreak extends Model<PositionBreakAttributes, PositionBreakCreationAttributes> implements PositionBreakAttributes {
  declare id: string;
  declare positionId: string;
  declare breakType: BreakType;
  declare severity: 'critical' | 'high' | 'medium' | 'low';
  declare description: string;
  declare expectedValue: string;
  declare actualValue: string;
  declare difference: string;
  declare detectedAt: Date;
  declare resolvedAt: Date | null;
  declare resolvedBy: string | null;
  declare resolution: string | null;
  declare isResolved: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  declare getPosition: BelongsToGetAssociationMixin<Position>;

  /**
   * Initialize PositionBreak model
   */
  static initModel(sequelize: Sequelize): typeof PositionBreak {
    PositionBreak.init(
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
            model: 'positions',
            key: 'id',
          },
          field: 'position_id',
        },
        breakType: {
          type: DataTypes.ENUM(...Object.values(BreakType)),
          allowNull: false,
          field: 'break_type',
        },
        severity: {
          type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
          allowNull: false,
          field: 'severity',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description',
        },
        expectedValue: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'expected_value',
        },
        actualValue: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'actual_value',
        },
        difference: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'difference',
        },
        detectedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'detected_at',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        resolvedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'resolved_by',
        },
        resolution: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'resolution',
        },
        isResolved: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_resolved',
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
        tableName: 'position_breaks',
        modelName: 'PositionBreak',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['break_type'] },
          { fields: ['severity'] },
          { fields: ['is_resolved'] },
          { fields: ['detected_at'] },
        ],
      }
    );

    return PositionBreak;
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
  positionId: string;
  accountId: string;
  calculationMethod: MarginMethod;
  initialMargin: string;
  maintenanceMargin: string;
  variationMargin: string;
  additionalMargin: string;
  totalMargin: string;
  excessDeficit: string;
  calculatedAt: Date;
  effectiveDate: Date;
  expiryDate: Date | null;
  stressScenarios: Record<string, any>[];
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MarginRequirementCreationAttributes extends Optional<MarginRequirementAttributes, 'id' | 'expiryDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: MarginRequirement
 * Position margin tracking
 */
export class MarginRequirement extends Model<MarginRequirementAttributes, MarginRequirementCreationAttributes> implements MarginRequirementAttributes {
  declare id: string;
  declare positionId: string;
  declare accountId: string;
  declare calculationMethod: MarginMethod;
  declare initialMargin: string;
  declare maintenanceMargin: string;
  declare variationMargin: string;
  declare additionalMargin: string;
  declare totalMargin: string;
  declare excessDeficit: string;
  declare calculatedAt: Date;
  declare effectiveDate: Date;
  declare expiryDate: Date | null;
  declare stressScenarios: Record<string, any>[];
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize MarginRequirement model
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
        positionId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'positions',
            key: 'id',
          },
          field: 'position_id',
        },
        accountId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'account_id',
        },
        calculationMethod: {
          type: DataTypes.ENUM(...Object.values(MarginMethod)),
          allowNull: false,
          field: 'calculation_method',
        },
        initialMargin: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'initial_margin',
        },
        maintenanceMargin: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'maintenance_margin',
        },
        variationMargin: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          defaultValue: '0.00000000',
          field: 'variation_margin',
        },
        additionalMargin: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          defaultValue: '0.00000000',
          field: 'additional_margin',
        },
        totalMargin: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'total_margin',
        },
        excessDeficit: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'excess_deficit',
        },
        calculatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'calculated_at',
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
        stressScenarios: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'stress_scenarios',
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
        tableName: 'margin_requirements',
        modelName: 'MarginRequirement',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['account_id'] },
          { fields: ['calculation_method'] },
          { fields: ['effective_date'] },
          { fields: ['calculated_at'] },
        ],
      }
    );

    return MarginRequirement;
  }
}

// ============================================================================
// SEQUELIZE MODEL: CollateralAllocation
// ============================================================================

/**
 * TypeScript interface for CollateralAllocation attributes
 */
export interface CollateralAllocationAttributes {
  id: string;
  positionId: string;
  accountId: string;
  collateralType: 'cash' | 'securities' | 'letter_of_credit' | 'treasury';
  collateralId: string;
  allocatedAmount: string;
  marketValue: string;
  haircut: string;
  eligibleValue: string;
  utilizationRate: string;
  allocationDate: Date;
  expiryDate: Date | null;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CollateralAllocationCreationAttributes extends Optional<CollateralAllocationAttributes, 'id' | 'expiryDate' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: CollateralAllocation
 * Collateral management for positions
 */
export class CollateralAllocation extends Model<CollateralAllocationAttributes, CollateralAllocationCreationAttributes> implements CollateralAllocationAttributes {
  declare id: string;
  declare positionId: string;
  declare accountId: string;
  declare collateralType: 'cash' | 'securities' | 'letter_of_credit' | 'treasury';
  declare collateralId: string;
  declare allocatedAmount: string;
  declare marketValue: string;
  declare haircut: string;
  declare eligibleValue: string;
  declare utilizationRate: string;
  declare allocationDate: Date;
  declare expiryDate: Date | null;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize CollateralAllocation model
   */
  static initModel(sequelize: Sequelize): typeof CollateralAllocation {
    CollateralAllocation.init(
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
            model: 'positions',
            key: 'id',
          },
          field: 'position_id',
        },
        accountId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'account_id',
        },
        collateralType: {
          type: DataTypes.ENUM('cash', 'securities', 'letter_of_credit', 'treasury'),
          allowNull: false,
          field: 'collateral_type',
        },
        collateralId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'collateral_id',
        },
        allocatedAmount: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'allocated_amount',
        },
        marketValue: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'market_value',
        },
        haircut: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'haircut',
          comment: 'Haircut percentage',
        },
        eligibleValue: {
          type: DataTypes.DECIMAL(28, 8),
          allowNull: false,
          field: 'eligible_value',
          comment: 'Value after haircut',
        },
        utilizationRate: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'utilization_rate',
        },
        allocationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'allocation_date',
        },
        expiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expiry_date',
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
        tableName: 'collateral_allocations',
        modelName: 'CollateralAllocation',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['position_id'] },
          { fields: ['account_id'] },
          { fields: ['collateral_type'] },
          { fields: ['is_active'] },
          { fields: ['allocation_date'] },
        ],
      }
    );

    return CollateralAllocation;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function definePositionAssociations(): void {
  Position.hasMany(PositionBreak, {
    foreignKey: 'positionId',
    as: 'positionBreaks',
    onDelete: 'CASCADE',
  });

  PositionBreak.belongsTo(Position, {
    foreignKey: 'positionId',
    as: 'position',
  });

  Position.hasMany(MarginRequirement, {
    foreignKey: 'positionId',
    as: 'marginRequirements',
    onDelete: 'CASCADE',
  });

  MarginRequirement.belongsTo(Position, {
    foreignKey: 'positionId',
    as: 'position',
  });

  Position.hasMany(CollateralAllocation, {
    foreignKey: 'positionId',
    as: 'collateralAllocations',
    onDelete: 'CASCADE',
  });

  CollateralAllocation.belongsTo(Position, {
    foreignKey: 'positionId',
    as: 'position',
  });
}

// ============================================================================
// CORE POSITION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * 1. Create new position
 */
export async function createPosition(
  data: PositionCreationAttributes,
  transaction?: Transaction
): Promise<Position> {
  const quantity = new Decimal(data.quantity);
  const avgPrice = new Decimal(data.averagePrice);
  const currPrice = new Decimal(data.currentPrice);

  const marketValue = quantity.times(currPrice).toFixed(8);
  const costBasis = quantity.times(avgPrice).toFixed(8);
  const unrealizedPnL = new Decimal(marketValue).minus(costBasis).toFixed(8);
  const ageDays = Math.floor((new Date().getTime() - data.entryDate.getTime()) / (1000 * 60 * 60 * 24));

  return await Position.create(
    {
      ...data,
      marketValue,
      costBasis,
      unrealizedPnL,
      ageDays,
      bookValue: costBasis,
      lastUpdated: new Date(),
    },
    { transaction }
  );
}

/**
 * 2. Update position with real-time price
 */
export async function updatePositionPrice(
  positionId: string,
  newPrice: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const quantity = new Decimal(position.quantity);
  const marketValue = quantity.times(newPrice).toFixed(8);
  const unrealizedPnL = new Decimal(marketValue).minus(position.costBasis).toFixed(8);

  await position.update(
    {
      currentPrice: newPrice,
      marketValue,
      unrealizedPnL,
      lastUpdated: new Date(),
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * 3. Increase position (add to existing)
 */
export async function increasePosition(
  positionId: string,
  additionalQuantity: string,
  executionPrice: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const currentQty = new Decimal(position.quantity);
  const addQty = new Decimal(additionalQuantity);
  const newQty = currentQty.plus(addQty);

  const additionalCost = addQty.times(executionPrice);
  const newCostBasis = new Decimal(position.costBasis).plus(additionalCost);
  const newAvgPrice = newCostBasis.div(newQty);

  const newMarketValue = newQty.times(position.currentPrice).toFixed(8);
  const unrealizedPnL = new Decimal(newMarketValue).minus(newCostBasis).toFixed(8);

  await position.update(
    {
      quantity: newQty.toFixed(8),
      averagePrice: newAvgPrice.toFixed(8),
      costBasis: newCostBasis.toFixed(8),
      marketValue: newMarketValue,
      unrealizedPnL,
      lastUpdated: new Date(),
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * 4. Reduce position (partial close)
 */
export async function reducePosition(
  positionId: string,
  quantityToClose: string,
  executionPrice: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<{ position: Position; realizedPnL: string } | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const currentQty = new Decimal(position.quantity);
  const closeQty = new Decimal(quantityToClose);

  if (closeQty.greaterThan(currentQty)) {
    throw new BadRequestException('Cannot close more than current position size');
  }

  const remainingQty = currentQty.minus(closeQty);
  const closedCost = new Decimal(position.averagePrice).times(closeQty);
  const closedProceeds = new Decimal(executionPrice).times(closeQty);

  const realizedPnL = position.side === PositionSide.LONG
    ? closedProceeds.minus(closedCost)
    : closedCost.minus(closedProceeds);

  const newCostBasis = new Decimal(position.costBasis).minus(closedCost);
  const newMarketValue = remainingQty.times(position.currentPrice);
  const unrealizedPnL = newMarketValue.minus(newCostBasis);

  const totalRealizedPnL = new Decimal(position.realizedPnL).plus(realizedPnL);

  await position.update(
    {
      quantity: remainingQty.toFixed(8),
      costBasis: newCostBasis.toFixed(8),
      marketValue: newMarketValue.toFixed(8),
      unrealizedPnL: unrealizedPnL.toFixed(8),
      realizedPnL: totalRealizedPnL.toFixed(8),
      status: remainingQty.equals(0) ? PositionStatus.CLOSED : PositionStatus.PARTIAL,
      lastUpdated: new Date(),
      updatedBy,
    },
    { transaction }
  );

  return { position, realizedPnL: realizedPnL.toFixed(8) };
}

/**
 * 5. Close position completely
 */
export async function closePosition(
  positionId: string,
  executionPrice: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<{ position: Position; realizedPnL: string } | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const result = await reducePosition(positionId, position.quantity, executionPrice, updatedBy, transaction);
  if (!result) return null;

  await result.position.update({ status: PositionStatus.CLOSED }, { transaction });
  return result;
}

/**
 * 6. Get open positions by account
 */
export async function getOpenPositionsByAccount(
  accountId: string,
  transaction?: Transaction
): Promise<Position[]> {
  return await Position.findAll({
    where: {
      accountId,
      status: PositionStatus.OPEN,
    },
    transaction,
  });
}

/**
 * 7. Get position by instrument
 */
export async function getPositionByInstrument(
  accountId: string,
  instrumentId: string,
  transaction?: Transaction
): Promise<Position | null> {
  return await Position.findOne({
    where: {
      accountId,
      instrumentId,
      status: PositionStatus.OPEN,
    },
    transaction,
  });
}

/**
 * 8. Get all positions for portfolio
 */
export async function getPortfolioPositions(
  portfolioId: string,
  transaction?: Transaction
): Promise<Position[]> {
  return await Position.findAll({
    where: { portfolioId },
    transaction,
  });
}

// ============================================================================
// POSITION AGGREGATION AND NETTING
// ============================================================================

/**
 * 9. Aggregate positions by instrument across accounts
 */
export async function aggregatePositionsByInstrument(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>[]> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  const aggregated = new Map<string, any>();

  for (const pos of positions) {
    const key = pos.instrumentId;
    const qty = new Decimal(pos.quantity);
    const side = pos.side;

    if (!aggregated.has(key)) {
      aggregated.set(key, {
        instrumentId: pos.instrumentId,
        symbol: pos.symbol,
        assetClass: pos.assetClass,
        longQuantity: new Decimal(0),
        shortQuantity: new Decimal(0),
        netQuantity: new Decimal(0),
        totalMarketValue: new Decimal(0),
        totalCostBasis: new Decimal(0),
        unrealizedPnL: new Decimal(0),
        accounts: new Set<string>(),
        positions: [],
      });
    }

    const agg = aggregated.get(key);
    if (side === PositionSide.LONG) {
      agg.longQuantity = agg.longQuantity.plus(qty);
    } else {
      agg.shortQuantity = agg.shortQuantity.plus(qty);
    }

    agg.netQuantity = agg.longQuantity.minus(agg.shortQuantity);
    agg.totalMarketValue = agg.totalMarketValue.plus(pos.marketValue);
    agg.totalCostBasis = agg.totalCostBasis.plus(pos.costBasis);
    agg.unrealizedPnL = agg.unrealizedPnL.plus(pos.unrealizedPnL);
    agg.accounts.add(pos.accountId);
    agg.positions.push(pos);
  }

  return Array.from(aggregated.values()).map(agg => ({
    ...agg,
    longQuantity: agg.longQuantity.toFixed(8),
    shortQuantity: agg.shortQuantity.toFixed(8),
    netQuantity: agg.netQuantity.toFixed(8),
    totalMarketValue: agg.totalMarketValue.toFixed(8),
    totalCostBasis: agg.totalCostBasis.toFixed(8),
    unrealizedPnL: agg.unrealizedPnL.toFixed(8),
    accounts: Array.from(agg.accounts),
  }));
}

/**
 * 10. Calculate net positions (offsetting long/short)
 */
export async function calculateNetPositions(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>[]> {
  const aggregated = await aggregatePositionsByInstrument(portfolioId, transaction);

  return aggregated.map(agg => ({
    instrumentId: agg.instrumentId,
    symbol: agg.symbol,
    netQuantity: agg.netQuantity,
    netExposure: new Decimal(agg.netQuantity).abs().times(agg.positions[0]?.currentPrice || 0).toFixed(8),
    offsetAmount: Decimal.min(new Decimal(agg.longQuantity), new Decimal(agg.shortQuantity)).toFixed(8),
    isNetted: new Decimal(agg.netQuantity).abs().lessThan(new Decimal(agg.longQuantity).plus(agg.shortQuantity)),
  }));
}

/**
 * 11. Calculate portfolio totals
 */
export async function calculatePortfolioTotals(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  let totalMarketValue = new Decimal(0);
  let totalCostBasis = new Decimal(0);
  let totalUnrealizedPnL = new Decimal(0);
  let totalRealizedPnL = new Decimal(0);

  for (const pos of positions) {
    totalMarketValue = totalMarketValue.plus(pos.marketValue);
    totalCostBasis = totalCostBasis.plus(pos.costBasis);
    totalUnrealizedPnL = totalUnrealizedPnL.plus(pos.unrealizedPnL);
    totalRealizedPnL = totalRealizedPnL.plus(pos.realizedPnL);
  }

  const totalReturnPercent = totalCostBasis.equals(0)
    ? new Decimal(0)
    : totalUnrealizedPnL.div(totalCostBasis).times(100);

  return {
    portfolioId,
    totalMarketValue: totalMarketValue.toFixed(8),
    totalCostBasis: totalCostBasis.toFixed(8),
    totalUnrealizedPnL: totalUnrealizedPnL.toFixed(8),
    totalRealizedPnL: totalRealizedPnL.toFixed(8),
    totalReturnPercent: totalReturnPercent.toFixed(4),
    positionCount: positions.length,
    timestamp: new Date(),
  };
}

// ============================================================================
// EXPOSURE CALCULATIONS
// ============================================================================

/**
 * 12. Calculate net exposure
 */
export async function calculateNetExposure(
  portfolioId: string,
  transaction?: Transaction
): Promise<string> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  let netExposure = new Decimal(0);
  for (const pos of positions) {
    const exposure = new Decimal(pos.marketValue);
    netExposure = pos.side === PositionSide.LONG
      ? netExposure.plus(exposure)
      : netExposure.minus(exposure);
  }

  return netExposure.toFixed(8);
}

/**
 * 13. Calculate gross exposure
 */
export async function calculateGrossExposure(
  portfolioId: string,
  transaction?: Transaction
): Promise<string> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  let grossExposure = new Decimal(0);
  for (const pos of positions) {
    grossExposure = grossExposure.plus(new Decimal(pos.marketValue).abs());
  }

  return grossExposure.toFixed(8);
}

/**
 * 14. Calculate long exposure
 */
export async function calculateLongExposure(
  portfolioId: string,
  transaction?: Transaction
): Promise<string> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  let longExposure = new Decimal(0);
  for (const pos of positions) {
    if (pos.side === PositionSide.LONG) {
      longExposure = longExposure.plus(pos.marketValue);
    }
  }

  return longExposure.toFixed(8);
}

/**
 * 15. Calculate short exposure
 */
export async function calculateShortExposure(
  portfolioId: string,
  transaction?: Transaction
): Promise<string> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  let shortExposure = new Decimal(0);
  for (const pos of positions) {
    if (pos.side === PositionSide.SHORT) {
      shortExposure = shortExposure.plus(new Decimal(pos.marketValue).abs());
    }
  }

  return shortExposure.toFixed(8);
}

/**
 * 16. Generate comprehensive exposure report
 */
export async function generateExposureReport(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);
  const totals = await calculatePortfolioTotals(portfolioId, transaction);

  const longExp = await calculateLongExposure(portfolioId, transaction);
  const shortExp = await calculateShortExposure(portfolioId, transaction);
  const grossExp = new Decimal(longExp).plus(shortExp);
  const netExp = new Decimal(longExp).minus(shortExp);

  const leverage = new Decimal(totals.totalMarketValue).equals(0)
    ? new Decimal(0)
    : grossExp.div(totals.totalMarketValue);

  // By asset class
  const byAssetClass: Record<string, string> = {};
  for (const assetClass of Object.values(AssetClass)) {
    const classPositions = positions.filter(p => p.assetClass === assetClass);
    let exposure = new Decimal(0);
    for (const pos of classPositions) {
      exposure = pos.side === PositionSide.LONG
        ? exposure.plus(pos.marketValue)
        : exposure.minus(pos.marketValue);
    }
    if (!exposure.equals(0)) {
      byAssetClass[assetClass] = exposure.toFixed(8);
    }
  }

  return {
    portfolioId,
    totalGrossExposure: grossExp.toFixed(8),
    totalNetExposure: netExp.toFixed(8),
    longExposure: longExp,
    shortExposure: shortExp,
    leverage: leverage.toFixed(4),
    byAssetClass,
    timestamp: new Date(),
  };
}

// ============================================================================
// POSITION AGING ANALYSIS
// ============================================================================

/**
 * 17. Update position age
 */
export async function updatePositionAge(
  positionId: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const ageDays = Math.floor((new Date().getTime() - position.entryDate.getTime()) / (1000 * 60 * 60 * 24));

  await position.update({ ageDays }, { transaction });
  return position;
}

/**
 * 18. Get aged positions report
 */
export async function getAgedPositionsReport(
  portfolioId: string,
  ageBuckets: number[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  // Update all ages first
  for (const pos of positions) {
    await updatePositionAge(pos.id, transaction);
  }

  const buckets: Record<string, any> = {};
  ageBuckets.forEach((bucket, index) => {
    const nextBucket = ageBuckets[index + 1] || Infinity;
    const bucketName = nextBucket === Infinity ? `${bucket}+ days` : `${bucket}-${nextBucket} days`;
    buckets[bucketName] = {
      count: 0,
      totalMarketValue: new Decimal(0),
      positions: [],
    };
  });

  for (const pos of positions) {
    for (let i = 0; i < ageBuckets.length; i++) {
      const min = ageBuckets[i];
      const max = ageBuckets[i + 1] || Infinity;
      const bucketName = max === Infinity ? `${min}+ days` : `${min}-${max} days`;

      if (pos.ageDays >= min && pos.ageDays < max) {
        buckets[bucketName].count++;
        buckets[bucketName].totalMarketValue = buckets[bucketName].totalMarketValue.plus(pos.marketValue);
        buckets[bucketName].positions.push({
          id: pos.id,
          symbol: pos.symbol,
          ageDays: pos.ageDays,
          marketValue: pos.marketValue,
        });
        break;
      }
    }
  }

  // Convert to fixed
  Object.keys(buckets).forEach(key => {
    buckets[key].totalMarketValue = buckets[key].totalMarketValue.toFixed(8);
  });

  return {
    portfolioId,
    buckets,
    timestamp: new Date(),
  };
}

// ============================================================================
// CORPORATE ACTIONS
// ============================================================================

/**
 * 19. Apply stock split to position
 */
export async function applyStockSplit(
  positionId: string,
  splitRatio: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const ratio = new Decimal(splitRatio);
  const newQuantity = new Decimal(position.quantity).times(ratio);
  const newAvgPrice = new Decimal(position.averagePrice).div(ratio);
  const newCurrentPrice = new Decimal(position.currentPrice).div(ratio);

  const corporateAction = {
    type: CorporateActionType.SPLIT,
    date: new Date(),
    ratio: splitRatio,
    oldQuantity: position.quantity,
    newQuantity: newQuantity.toFixed(8),
    oldPrice: position.averagePrice,
    newPrice: newAvgPrice.toFixed(8),
  };

  await position.update(
    {
      quantity: newQuantity.toFixed(8),
      averagePrice: newAvgPrice.toFixed(8),
      currentPrice: newCurrentPrice.toFixed(8),
      corporateActions: [...position.corporateActions, corporateAction],
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * 20. Apply dividend to position
 */
export async function applyDividend(
  positionId: string,
  dividendPerShare: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  const dividendAmount = new Decimal(position.quantity).times(dividendPerShare);

  const corporateAction = {
    type: CorporateActionType.DIVIDEND,
    date: new Date(),
    dividendPerShare,
    totalDividend: dividendAmount.toFixed(8),
    quantity: position.quantity,
  };

  await position.update(
    {
      corporateActions: [...position.corporateActions, corporateAction],
      updatedBy,
    },
    { transaction }
  );

  return position;
}

/**
 * 21. Get corporate action history
 */
export async function getCorporateActionHistory(
  positionId: string,
  transaction?: Transaction
): Promise<Record<string, any>[]> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return [];

  return position.corporateActions;
}

// ============================================================================
// POSITION RECONCILIATION
// ============================================================================

/**
 * 22. Create position break
 */
export async function createPositionBreak(
  data: PositionBreakCreationAttributes,
  transaction?: Transaction
): Promise<PositionBreak> {
  return await PositionBreak.create(data, { transaction });
}

/**
 * 23. Reconcile position against external source
 */
export async function reconcilePosition(
  positionId: string,
  externalQuantity: string,
  externalPrice: string,
  createdBy: string,
  transaction?: Transaction
): Promise<{ position: Position; breaks: PositionBreak[] }> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException('Position not found');
  }

  const breaks: PositionBreak[] = [];

  // Check quantity mismatch
  const qtyDiff = new Decimal(position.quantity).minus(externalQuantity).abs();
  if (qtyDiff.greaterThan(0.00000001)) {
    const breakRecord = await createPositionBreak(
      {
        positionId,
        breakType: BreakType.QUANTITY_MISMATCH,
        severity: qtyDiff.greaterThan(new Decimal(position.quantity).times(0.01)) ? 'critical' : 'medium',
        description: 'Quantity mismatch detected during reconciliation',
        expectedValue: externalQuantity,
        actualValue: position.quantity,
        difference: qtyDiff.toFixed(8),
        detectedAt: new Date(),
        isResolved: false,
        metadata: {},
        createdBy,
      },
      transaction
    );
    breaks.push(breakRecord);
  }

  // Check price mismatch
  const priceDiff = new Decimal(position.currentPrice).minus(externalPrice).abs();
  const priceThreshold = new Decimal(position.currentPrice).times(0.001); // 0.1% threshold
  if (priceDiff.greaterThan(priceThreshold)) {
    const breakRecord = await createPositionBreak(
      {
        positionId,
        breakType: BreakType.PRICE_MISMATCH,
        severity: 'medium',
        description: 'Price mismatch detected during reconciliation',
        expectedValue: externalPrice,
        actualValue: position.currentPrice,
        difference: priceDiff.toFixed(8),
        detectedAt: new Date(),
        isResolved: false,
        metadata: {},
        createdBy,
      },
      transaction
    );
    breaks.push(breakRecord);
  }

  if (breaks.length > 0) {
    await position.update({ status: PositionStatus.RECONCILING }, { transaction });
  }

  return { position, breaks };
}

/**
 * 24. Resolve position break
 */
export async function resolvePositionBreak(
  breakId: string,
  resolution: string,
  resolvedBy: string,
  transaction?: Transaction
): Promise<PositionBreak | null> {
  const breakRecord = await PositionBreak.findByPk(breakId, { transaction });
  if (!breakRecord) return null;

  await breakRecord.update(
    {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy,
      resolution,
      updatedBy: resolvedBy,
    },
    { transaction }
  );

  // Check if all breaks for this position are resolved
  const unresolvedBreaks = await PositionBreak.count({
    where: {
      positionId: breakRecord.positionId,
      isResolved: false,
    },
    transaction,
  });

  if (unresolvedBreaks === 0) {
    const position = await Position.findByPk(breakRecord.positionId, { transaction });
    if (position && position.status === PositionStatus.RECONCILING) {
      await position.update({ status: PositionStatus.OPEN }, { transaction });
    }
  }

  return breakRecord;
}

/**
 * 25. Get unresolved breaks
 */
export async function getUnresolvedBreaks(
  portfolioId?: string,
  transaction?: Transaction
): Promise<PositionBreak[]> {
  const whereClause: any = { isResolved: false };

  if (portfolioId) {
    const positions = await getPortfolioPositions(portfolioId, transaction);
    whereClause.positionId = { [Op.in]: positions.map(p => p.id) };
  }

  return await PositionBreak.findAll({
    where: whereClause,
    include: [{ model: Position, as: 'position' }],
    transaction,
  });
}

// ============================================================================
// MARGIN AND COLLATERAL MANAGEMENT
// ============================================================================

/**
 * 26. Calculate margin requirement
 */
export async function calculateMarginRequirement(
  positionId: string,
  calculationMethod: MarginMethod,
  createdBy: string,
  transaction?: Transaction
): Promise<MarginRequirement> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException('Position not found');
  }

  const marketValue = new Decimal(position.marketValue);

  // Simplified margin calculation - in production, use actual SPAN/TIMS algorithms
  let initialMarginRate = new Decimal(0.1); // 10% default
  let maintenanceMarginRate = new Decimal(0.05); // 5% default

  switch (calculationMethod) {
    case MarginMethod.SPAN:
      initialMarginRate = new Decimal(0.12);
      maintenanceMarginRate = new Decimal(0.06);
      break;
    case MarginMethod.VAR:
      initialMarginRate = new Decimal(0.15);
      maintenanceMarginRate = new Decimal(0.075);
      break;
  }

  const initialMargin = marketValue.times(initialMarginRate);
  const maintenanceMargin = marketValue.times(maintenanceMarginRate);
  const totalMargin = initialMargin;

  // Calculate excess/deficit (would compare against actual collateral in production)
  const excessDeficit = new Decimal(0);

  return await MarginRequirement.create(
    {
      positionId,
      accountId: position.accountId,
      calculationMethod,
      initialMargin: initialMargin.toFixed(8),
      maintenanceMargin: maintenanceMargin.toFixed(8),
      variationMargin: '0.00000000',
      additionalMargin: '0.00000000',
      totalMargin: totalMargin.toFixed(8),
      excessDeficit: excessDeficit.toFixed(8),
      calculatedAt: new Date(),
      effectiveDate: new Date(),
      stressScenarios: [],
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * 27. Get total margin requirements for account
 */
export async function getAccountMarginRequirements(
  accountId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const margins = await MarginRequirement.findAll({
    where: {
      accountId,
      expiryDate: { [Op.or]: [null, { [Op.gt]: new Date() }] },
    },
    transaction,
  });

  let totalInitial = new Decimal(0);
  let totalMaintenance = new Decimal(0);
  let totalVariation = new Decimal(0);
  let totalMargin = new Decimal(0);
  let totalExcessDeficit = new Decimal(0);

  for (const margin of margins) {
    totalInitial = totalInitial.plus(margin.initialMargin);
    totalMaintenance = totalMaintenance.plus(margin.maintenanceMargin);
    totalVariation = totalVariation.plus(margin.variationMargin);
    totalMargin = totalMargin.plus(margin.totalMargin);
    totalExcessDeficit = totalExcessDeficit.plus(margin.excessDeficit);
  }

  return {
    accountId,
    totalInitialMargin: totalInitial.toFixed(8),
    totalMaintenanceMargin: totalMaintenance.toFixed(8),
    totalVariationMargin: totalVariation.toFixed(8),
    totalMarginRequired: totalMargin.toFixed(8),
    excessDeficit: totalExcessDeficit.toFixed(8),
    marginUtilization: totalMargin.equals(0) ? '0.00' : new Decimal(100).toFixed(2),
    count: margins.length,
    timestamp: new Date(),
  };
}

/**
 * 28. Allocate collateral to position
 */
export async function allocateCollateral(
  data: CollateralAllocationCreationAttributes,
  transaction?: Transaction
): Promise<CollateralAllocation> {
  return await CollateralAllocation.create(data, { transaction });
}

/**
 * 29. Get collateral allocations for position
 */
export async function getPositionCollateral(
  positionId: string,
  transaction?: Transaction
): Promise<CollateralAllocation[]> {
  return await CollateralAllocation.findAll({
    where: {
      positionId,
      isActive: true,
    },
    transaction,
  });
}

/**
 * 30. Calculate total eligible collateral
 */
export async function calculateEligibleCollateral(
  accountId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const allocations = await CollateralAllocation.findAll({
    where: {
      accountId,
      isActive: true,
    },
    transaction,
  });

  let totalAllocated = new Decimal(0);
  let totalEligible = new Decimal(0);
  const byType: Record<string, any> = {};

  for (const alloc of allocations) {
    totalAllocated = totalAllocated.plus(alloc.allocatedAmount);
    totalEligible = totalEligible.plus(alloc.eligibleValue);

    if (!byType[alloc.collateralType]) {
      byType[alloc.collateralType] = {
        allocated: new Decimal(0),
        eligible: new Decimal(0),
        count: 0,
      };
    }

    byType[alloc.collateralType].allocated = byType[alloc.collateralType].allocated.plus(alloc.allocatedAmount);
    byType[alloc.collateralType].eligible = byType[alloc.collateralType].eligible.plus(alloc.eligibleValue);
    byType[alloc.collateralType].count++;
  }

  // Convert to strings
  Object.keys(byType).forEach(type => {
    byType[type].allocated = byType[type].allocated.toFixed(8);
    byType[type].eligible = byType[type].eligible.toFixed(8);
  });

  return {
    accountId,
    totalAllocated: totalAllocated.toFixed(8),
    totalEligible: totalEligible.toFixed(8),
    byType,
    count: allocations.length,
    timestamp: new Date(),
  };
}

// ============================================================================
// POSITION TRANSFERS AND ROLLS
// ============================================================================

/**
 * 31. Transfer position between accounts
 */
export async function transferPosition(
  positionId: string,
  targetAccountId: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<Position | null> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) return null;

  await position.update(
    {
      accountId: targetAccountId,
      updatedBy,
      metadata: {
        ...position.metadata,
        transferHistory: [
          ...(position.metadata.transferHistory || []),
          {
            fromAccount: position.accountId,
            toAccount: targetAccountId,
            transferDate: new Date(),
            transferredBy: updatedBy,
          },
        ],
      },
    },
    { transaction }
  );

  return position;
}

/**
 * 32. Roll position (close old, open new)
 */
export async function rollPosition(
  oldPositionId: string,
  newInstrumentId: string,
  newSymbol: string,
  rollPrice: string,
  createdBy: string,
  transaction?: Transaction
): Promise<{ closedPosition: Position; newPosition: Position; realizedPnL: string }> {
  const oldPosition = await Position.findByPk(oldPositionId, { transaction });
  if (!oldPosition) {
    throw new NotFoundException('Position not found');
  }

  // Close old position
  const closeResult = await closePosition(oldPositionId, rollPrice, createdBy, transaction);
  if (!closeResult) {
    throw new BadRequestException('Failed to close position');
  }

  // Open new position
  const newPosition = await createPosition(
    {
      accountId: oldPosition.accountId,
      portfolioId: oldPosition.portfolioId,
      instrumentId: newInstrumentId,
      symbol: newSymbol,
      assetClass: oldPosition.assetClass,
      instrumentType: oldPosition.instrumentType,
      side: oldPosition.side,
      quantity: oldPosition.quantity,
      averagePrice: rollPrice,
      currentPrice: rollPrice,
      currency: oldPosition.currency,
      entryDate: new Date(),
      status: PositionStatus.OPEN,
      ageDays: 0,
      taxLots: [],
      corporateActions: [],
      realizedPnL: '0.00000000',
      metadata: {
        rolledFrom: oldPositionId,
        rollDate: new Date(),
      },
      createdBy,
    },
    transaction
  );

  return {
    closedPosition: closeResult.position,
    newPosition,
    realizedPnL: closeResult.realizedPnL,
  };
}

// ============================================================================
// CROSS-MARGINING AND PORTFOLIO MARGIN
// ============================================================================

/**
 * 33. Calculate cross-margin benefit
 */
export async function calculateCrossMarginBenefit(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  // Get all margin requirements
  const positionIds = positions.map(p => p.id);
  const margins = await MarginRequirement.findAll({
    where: {
      positionId: { [Op.in]: positionIds },
    },
    transaction,
  });

  // Calculate standalone margin
  let standaloneMargin = new Decimal(0);
  for (const margin of margins) {
    standaloneMargin = standaloneMargin.plus(margin.totalMargin);
  }

  // Calculate netted positions
  const nettedPositions = await calculateNetPositions(portfolioId, transaction);

  // Simplified cross-margin calculation (in production, use actual portfolio margining)
  const offsetFactor = new Decimal(0.7); // 30% benefit from offsetting
  const crossMargin = standaloneMargin.times(offsetFactor);
  const benefit = standaloneMargin.minus(crossMargin);
  const benefitPercent = standaloneMargin.equals(0) ? new Decimal(0) : benefit.div(standaloneMargin).times(100);

  return {
    portfolioId,
    standaloneMargin: standaloneMargin.toFixed(8),
    crossMargin: crossMargin.toFixed(8),
    benefit: benefit.toFixed(8),
    benefitPercent: benefitPercent.toFixed(4),
    nettedPositions: nettedPositions.length,
    timestamp: new Date(),
  };
}

// ============================================================================
// INTRADAY POSITION UPDATES
// ============================================================================

/**
 * 34. Create intraday position snapshot
 */
export async function createIntradaySnapshot(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);
  const totals = await calculatePortfolioTotals(portfolioId, transaction);
  const exposure = await generateExposureReport(portfolioId, transaction);

  return {
    portfolioId,
    snapshotTime: new Date(),
    positions: positions.map(p => ({
      id: p.id,
      symbol: p.symbol,
      quantity: p.quantity,
      currentPrice: p.currentPrice,
      marketValue: p.marketValue,
      unrealizedPnL: p.unrealizedPnL,
    })),
    totals,
    exposure,
  };
}

/**
 * 35. Bulk update position prices (real-time market data)
 */
export async function bulkUpdatePositionPrices(
  priceUpdates: Array<{ positionId: string; newPrice: string }>,
  updatedBy: string,
  transaction?: Transaction
): Promise<number> {
  let updateCount = 0;

  for (const update of priceUpdates) {
    const result = await updatePositionPrice(update.positionId, update.newPrice, updatedBy, transaction);
    if (result) updateCount++;
  }

  return updateCount;
}

// ============================================================================
// POSITION LIMITS AND MONITORING
// ============================================================================

/**
 * 36. Check position limit
 */
export async function checkPositionLimit(
  accountId: string,
  instrumentId: string,
  proposedQuantity: string,
  maxPositionSize: string,
  transaction?: Transaction
): Promise<{ allowed: boolean; currentSize: string; proposedSize: string; limit: string }> {
  const currentPosition = await getPositionByInstrument(accountId, instrumentId, transaction);

  const currentSize = currentPosition ? new Decimal(currentPosition.quantity) : new Decimal(0);
  const proposed = new Decimal(proposedQuantity);
  const proposedSize = currentSize.plus(proposed);
  const limit = new Decimal(maxPositionSize);

  return {
    allowed: proposedSize.lessThanOrEqualTo(limit),
    currentSize: currentSize.toFixed(8),
    proposedSize: proposedSize.toFixed(8),
    limit: limit.toFixed(8),
  };
}

/**
 * 37. Monitor position concentration
 */
export async function monitorPositionConcentration(
  portfolioId: string,
  maxSinglePositionPercent: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);
  const totals = await calculatePortfolioTotals(portfolioId, transaction);

  const totalValue = new Decimal(totals.totalMarketValue);
  const maxPercent = new Decimal(maxSinglePositionPercent);
  const violations: any[] = [];

  for (const pos of positions) {
    const positionPercent = totalValue.equals(0)
      ? new Decimal(0)
      : new Decimal(pos.marketValue).div(totalValue).times(100);

    if (positionPercent.greaterThan(maxPercent)) {
      violations.push({
        positionId: pos.id,
        symbol: pos.symbol,
        marketValue: pos.marketValue,
        percentOfPortfolio: positionPercent.toFixed(4),
        limit: maxPercent.toFixed(4),
        excess: positionPercent.minus(maxPercent).toFixed(4),
      });
    }
  }

  return {
    portfolioId,
    totalValue: totalValue.toFixed(8),
    maxAllowedPercent: maxPercent.toFixed(4),
    violations,
    violationCount: violations.length,
    isCompliant: violations.length === 0,
    timestamp: new Date(),
  };
}

// ============================================================================
// MULTI-CURRENCY POSITION MANAGEMENT
// ============================================================================

/**
 * 38. Convert position to base currency
 */
export async function convertPositionToBaseCurrency(
  positionId: string,
  baseCurrency: string,
  fxRate: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException('Position not found');
  }

  const rate = new Decimal(fxRate);
  const convertedMarketValue = new Decimal(position.marketValue).times(rate);
  const convertedCostBasis = new Decimal(position.costBasis).times(rate);
  const convertedUnrealizedPnL = new Decimal(position.unrealizedPnL).times(rate);

  return {
    positionId: position.id,
    originalCurrency: position.currency,
    baseCurrency,
    fxRate: rate.toFixed(8),
    originalMarketValue: position.marketValue,
    convertedMarketValue: convertedMarketValue.toFixed(8),
    originalCostBasis: position.costBasis,
    convertedCostBasis: convertedCostBasis.toFixed(8),
    originalUnrealizedPnL: position.unrealizedPnL,
    convertedUnrealizedPnL: convertedUnrealizedPnL.toFixed(8),
  };
}

/**
 * 39. Calculate multi-currency exposure
 */
export async function calculateMultiCurrencyExposure(
  portfolioId: string,
  baseCurrency: string,
  fxRates: Record<string, string>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  const byCurrency: Record<string, any> = {};
  let totalBaseExposure = new Decimal(0);

  for (const pos of positions) {
    const currency = pos.currency;
    const fxRate = new Decimal(fxRates[currency] || '1.0');
    const baseValue = new Decimal(pos.marketValue).times(fxRate);

    if (!byCurrency[currency]) {
      byCurrency[currency] = {
        exposure: new Decimal(0),
        exposureBase: new Decimal(0),
        count: 0,
        fxRate: fxRate.toFixed(8),
      };
    }

    byCurrency[currency].exposure = byCurrency[currency].exposure.plus(pos.marketValue);
    byCurrency[currency].exposureBase = byCurrency[currency].exposureBase.plus(baseValue);
    byCurrency[currency].count++;

    totalBaseExposure = totalBaseExposure.plus(baseValue);
  }

  // Convert to strings and add percentages
  Object.keys(byCurrency).forEach(currency => {
    const percentOfTotal = totalBaseExposure.equals(0)
      ? new Decimal(0)
      : byCurrency[currency].exposureBase.div(totalBaseExposure).times(100);

    byCurrency[currency] = {
      ...byCurrency[currency],
      exposure: byCurrency[currency].exposure.toFixed(8),
      exposureBase: byCurrency[currency].exposureBase.toFixed(8),
      percentOfTotal: percentOfTotal.toFixed(4),
    };
  });

  return {
    portfolioId,
    baseCurrency,
    totalExposureBase: totalBaseExposure.toFixed(8),
    byCurrency,
    currencyCount: Object.keys(byCurrency).length,
    timestamp: new Date(),
  };
}

// ============================================================================
// ADVANCED ANALYTICS
// ============================================================================

/**
 * 40. Calculate position performance metrics
 */
export async function calculatePositionPerformance(
  positionId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException('Position not found');
  }

  const holdingPeriodDays = position.ageDays || 1;
  const returnPercent = new Decimal(position.costBasis).equals(0)
    ? new Decimal(0)
    : new Decimal(position.unrealizedPnL).div(position.costBasis).times(100);

  const annualizedReturn = returnPercent.times(365).div(holdingPeriodDays);

  return {
    positionId: position.id,
    symbol: position.symbol,
    entryDate: position.entryDate,
    holdingPeriodDays,
    costBasis: position.costBasis,
    marketValue: position.marketValue,
    unrealizedPnL: position.unrealizedPnL,
    realizedPnL: position.realizedPnL,
    returnPercent: returnPercent.toFixed(4),
    annualizedReturn: annualizedReturn.toFixed(4),
    averagePrice: position.averagePrice,
    currentPrice: position.currentPrice,
    priceChange: new Decimal(position.currentPrice).minus(position.averagePrice).toFixed(8),
    priceChangePercent: new Decimal(position.averagePrice).equals(0)
      ? '0.0000'
      : new Decimal(position.currentPrice).minus(position.averagePrice).div(position.averagePrice).times(100).toFixed(4),
  };
}

/**
 * 41. Get positions by asset class
 */
export async function getPositionsByAssetClass(
  portfolioId: string,
  assetClass: AssetClass,
  transaction?: Transaction
): Promise<Position[]> {
  return await Position.findAll({
    where: {
      portfolioId,
      assetClass,
    },
    transaction,
  });
}

/**
 * 42. Calculate average holding period
 */
export async function calculateAverageHoldingPeriod(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const positions = await getPortfolioPositions(portfolioId, transaction);

  if (positions.length === 0) {
    return {
      portfolioId,
      averageHoldingDays: 0,
      minHoldingDays: 0,
      maxHoldingDays: 0,
      positionCount: 0,
    };
  }

  let totalDays = 0;
  let minDays = Infinity;
  let maxDays = 0;

  for (const pos of positions) {
    const days = Math.floor((new Date().getTime() - pos.entryDate.getTime()) / (1000 * 60 * 60 * 24));
    totalDays += days;
    minDays = Math.min(minDays, days);
    maxDays = Math.max(maxDays, days);
  }

  return {
    portfolioId,
    averageHoldingDays: Math.round(totalDays / positions.length),
    minHoldingDays: minDays === Infinity ? 0 : minDays,
    maxHoldingDays,
    positionCount: positions.length,
    timestamp: new Date(),
  };
}

/**
 * 43. Get top positions by market value
 */
export async function getTopPositions(
  portfolioId: string,
  limit: number = 10,
  transaction?: Transaction
): Promise<Position[]> {
  return await Position.findAll({
    where: { portfolioId },
    order: [[Sequelize.literal('CAST(market_value AS DECIMAL)'), 'DESC']],
    limit,
    transaction,
  });
}

/**
 * 44. Calculate turnover rate
 */
export async function calculateTurnoverRate(
  portfolioId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<Record<string, any>> {
  // Get positions within date range
  const positions = await Position.findAll({
    where: {
      portfolioId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    transaction,
  });

  let totalTraded = new Decimal(0);
  for (const pos of positions) {
    totalTraded = totalTraded.plus(new Decimal(pos.costBasis).abs());
  }

  const currentTotals = await calculatePortfolioTotals(portfolioId, transaction);
  const avgPortfolioValue = new Decimal(currentTotals.totalMarketValue);

  const turnoverRate = avgPortfolioValue.equals(0)
    ? new Decimal(0)
    : totalTraded.div(avgPortfolioValue);

  const periodDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const annualizedTurnover = turnoverRate.times(365).div(periodDays || 1);

  return {
    portfolioId,
    startDate,
    endDate,
    periodDays,
    totalTraded: totalTraded.toFixed(8),
    avgPortfolioValue: avgPortfolioValue.toFixed(8),
    turnoverRate: turnoverRate.toFixed(4),
    annualizedTurnover: annualizedTurnover.toFixed(4),
    positionCount: positions.length,
  };
}

/**
 * 45. Generate position summary dashboard
 */
export async function generatePositionDashboard(
  portfolioId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const [
    totals,
    exposure,
    topPositions,
    unresolvedBreaks,
    marginReqs,
  ] = await Promise.all([
    calculatePortfolioTotals(portfolioId, transaction),
    generateExposureReport(portfolioId, transaction),
    getTopPositions(portfolioId, 5, transaction),
    getUnresolvedBreaks(portfolioId, transaction),
    MarginRequirement.findAll({
      include: [{
        model: Position,
        as: 'position',
        where: { portfolioId },
      }],
      transaction,
    }),
  ]);

  const positions = await getPortfolioPositions(portfolioId, transaction);

  // Calculate by asset class
  const byAssetClass: Record<string, any> = {};
  for (const assetClass of Object.values(AssetClass)) {
    const classPositions = positions.filter(p => p.assetClass === assetClass);
    if (classPositions.length > 0) {
      let classValue = new Decimal(0);
      for (const pos of classPositions) {
        classValue = classValue.plus(pos.marketValue);
      }
      byAssetClass[assetClass] = {
        count: classPositions.length,
        marketValue: classValue.toFixed(8),
        percentOfTotal: new Decimal(totals.totalMarketValue).equals(0)
          ? '0.0000'
          : classValue.div(totals.totalMarketValue).times(100).toFixed(4),
      };
    }
  }

  return {
    portfolioId,
    timestamp: new Date(),
    totals,
    exposure,
    topPositions: topPositions.map(p => ({
      symbol: p.symbol,
      marketValue: p.marketValue,
      unrealizedPnL: p.unrealizedPnL,
    })),
    byAssetClass,
    unresolvedBreakCount: unresolvedBreaks.length,
    totalMarginRequired: marginReqs.reduce((sum, m) => sum.plus(m.totalMargin), new Decimal(0)).toFixed(8),
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all position management models
 */
export function initializePositionModels(sequelize: Sequelize): void {
  Position.initModel(sequelize);
  PositionBreak.initModel(sequelize);
  MarginRequirement.initModel(sequelize);
  CollateralAllocation.initModel(sequelize);
  definePositionAssociations();
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Position,
  PositionBreak,
  MarginRequirement,
  CollateralAllocation,
};

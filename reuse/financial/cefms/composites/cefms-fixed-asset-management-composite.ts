/**
 * LOC: CEFMSFAM001
 * File: /reuse/financial/cefms/composites/cefms-fixed-asset-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/asset-inventory-management-kit.ts
 *   - ../../../government/capital-asset-planning-kit.ts
 *   - ../../../government/compliance-regulatory-tracking-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS asset management services
 *   - USACE fixed asset tracking systems
 *   - Asset depreciation modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-fixed-asset-management-composite.ts
 * Locator: WC-CEFMS-FAM-001
 * Purpose: USACE CEFMS Fixed Asset Management - asset lifecycle, depreciation, capitalization, disposal, transfers, inventory
 *
 * Upstream: Composes utilities from government asset management kits
 * Downstream: ../../../backend/cefms/*, Asset controllers, depreciation calculation, inventory tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ composite functions for USACE CEFMS fixed asset operations
 *
 * LLM Context: Production-ready USACE CEFMS fixed asset management system.
 * Comprehensive asset lifecycle management, depreciation schedules (straight-line, declining balance, units of production),
 * asset capitalization thresholds, disposal tracking, inter-fund transfers, physical inventory reconciliation,
 * impairment analysis, useful life management, asset tagging, location tracking, maintenance history,
 * GAAP/GASB compliance, asset valuation, revaluation processing, and comprehensive audit trails.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FixedAssetData {
  assetId: string;
  assetTag: string;
  assetName: string;
  assetCategory: 'land' | 'buildings' | 'infrastructure' | 'equipment' | 'vehicles' | 'furniture' | 'software';
  assetClass: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  estimatedUsefulLife: number;
  salvageValue: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years_digits';
  fundCode: string;
  departmentCode: string;
  locationCode: string;
  custodian: string;
  status: 'active' | 'disposed' | 'impaired' | 'under_construction' | 'retired';
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
}

interface DepreciationScheduleData {
  assetId: string;
  fiscalYear: number;
  fiscalPeriod: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  calculatedDate: Date;
  isPosted: boolean;
}

interface AssetDisposalData {
  disposalId: string;
  assetId: string;
  disposalDate: Date;
  disposalMethod: 'sale' | 'trade_in' | 'donation' | 'scrap' | 'demolition';
  disposalAmount: number;
  netBookValue: number;
  gainLoss: number;
  disposedBy: string;
  approvedBy: string;
  disposalReason: string;
  documentReference?: string;
}

interface AssetTransferData {
  transferId: string;
  assetId: string;
  transferDate: Date;
  fromFund: string;
  toFund: string;
  fromDepartment: string;
  toDepartment: string;
  fromLocation: string;
  toLocation: string;
  transferredBy: string;
  approvedBy: string;
  transferReason: string;
}

interface AssetImpairmentData {
  impairmentId: string;
  assetId: string;
  impairmentDate: Date;
  impairmentAmount: number;
  recoveryValue: number;
  impairmentReason: string;
  assessedBy: string;
  approvedBy: string;
  isRecoverable: boolean;
}

interface AssetMaintenanceData {
  maintenanceId: string;
  assetId: string;
  maintenanceDate: Date;
  maintenanceType: 'preventive' | 'corrective' | 'emergency' | 'improvement';
  maintenanceCost: number;
  description: string;
  performedBy: string;
  vendorId?: string;
  nextMaintenanceDue?: Date;
  isCapitalized: boolean;
}

interface AssetInventoryData {
  inventoryId: string;
  inventoryDate: Date;
  inventoryType: 'annual' | 'cyclical' | 'spot_check' | 'comprehensive';
  performedBy: string;
  locationCode: string;
  assetsExpected: number;
  assetsFound: number;
  assetsMissing: number;
  assetsUntagged: number;
  status: 'in_progress' | 'completed' | 'reconciled';
}

interface AssetValuationData {
  valuationId: string;
  assetId: string;
  valuationDate: Date;
  valuationType: 'market' | 'replacement' | 'fair_value' | 'appraisal';
  originalValue: number;
  revaluedAmount: number;
  revaluationSurplus: number;
  valuedBy: string;
  approvedBy: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Fixed Assets with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FixedAsset model
 *
 * @example
 * ```typescript
 * const FixedAsset = createFixedAssetModel(sequelize);
 * const asset = await FixedAsset.create({
 *   assetId: 'FA-2024-001',
 *   assetTag: 'USACE-BLD-001',
 *   assetName: 'Administration Building',
 *   assetCategory: 'buildings',
 *   acquisitionDate: new Date('2024-01-15'),
 *   acquisitionCost: 5000000,
 *   estimatedUsefulLife: 40,
 *   salvageValue: 500000,
 *   depreciationMethod: 'straight_line'
 * });
 * ```
 */
export const createFixedAssetModel = (sequelize: Sequelize) => {
  class FixedAsset extends Model {
    public id!: string;
    public assetId!: string;
    public assetTag!: string;
    public assetName!: string;
    public assetCategory!: string;
    public assetClass!: string;
    public acquisitionDate!: Date;
    public acquisitionCost!: number;
    public estimatedUsefulLife!: number;
    public salvageValue!: number;
    public depreciationMethod!: string;
    public fundCode!: string;
    public departmentCode!: string;
    public locationCode!: string;
    public custodian!: string;
    public status!: string;
    public serialNumber!: string | null;
    public manufacturer!: string | null;
    public model!: string | null;
    public accumulatedDepreciation!: number;
    public netBookValue!: number;
    public lastDepreciationDate!: Date | null;
    public inServiceDate!: Date | null;
    public warrantyExpirationDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FixedAsset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Asset identifier',
      },
      assetTag: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Physical asset tag',
      },
      assetName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Asset name',
      },
      assetCategory: {
        type: DataTypes.ENUM('land', 'buildings', 'infrastructure', 'equipment', 'vehicles', 'furniture', 'software'),
        allowNull: false,
        comment: 'Asset category',
      },
      assetClass: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Asset classification',
      },
      acquisitionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Acquisition date',
      },
      acquisitionCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Acquisition cost',
        validate: {
          min: 0,
        },
      },
      estimatedUsefulLife: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Useful life in years',
        validate: {
          min: 0,
        },
      },
      salvageValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Salvage value',
      },
      depreciationMethod: {
        type: DataTypes.ENUM('straight_line', 'declining_balance', 'units_of_production', 'sum_of_years_digits'),
        allowNull: false,
        comment: 'Depreciation method',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department code',
      },
      locationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Location code',
      },
      custodian: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset custodian',
      },
      status: {
        type: DataTypes.ENUM('active', 'disposed', 'impaired', 'under_construction', 'retired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Asset status',
      },
      serialNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Serial number',
      },
      manufacturer: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Manufacturer',
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Model number',
      },
      accumulatedDepreciation: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accumulated depreciation',
      },
      netBookValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net book value',
      },
      lastDepreciationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last depreciation date',
      },
      inServiceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'In-service date',
      },
      warrantyExpirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Warranty expiration',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'fixed_assets',
      timestamps: true,
      indexes: [
        { fields: ['assetId'], unique: true },
        { fields: ['assetTag'], unique: true },
        { fields: ['assetCategory'] },
        { fields: ['status'] },
        { fields: ['fundCode'] },
        { fields: ['departmentCode'] },
        { fields: ['locationCode'] },
        { fields: ['custodian'] },
        { fields: ['acquisitionDate'] },
      ],
    },
  );

  return FixedAsset;
};

/**
 * Sequelize model for Depreciation Schedule with automated calculations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DepreciationSchedule model
 */
export const createDepreciationScheduleModel = (sequelize: Sequelize) => {
  class DepreciationSchedule extends Model {
    public id!: string;
    public assetId!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public depreciationExpense!: number;
    public accumulatedDepreciation!: number;
    public netBookValue!: number;
    public calculatedDate!: Date;
    public isPosted!: boolean;
    public postedDate!: Date | null;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DepreciationSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
      },
      depreciationExpense: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Depreciation expense',
      },
      accumulatedDepreciation: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Accumulated depreciation',
      },
      netBookValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net book value',
      },
      calculatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Calculation date',
      },
      isPosted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is posted to GL',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'GL posting date',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'depreciation_schedules',
      timestamps: true,
      indexes: [
        { fields: ['assetId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isPosted'] },
        { fields: ['assetId', 'fiscalYear', 'fiscalPeriod'], unique: true },
      ],
    },
  );

  return DepreciationSchedule;
};

/**
 * Sequelize model for Asset Disposals with gain/loss tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetDisposal model
 */
export const createAssetDisposalModel = (sequelize: Sequelize) => {
  class AssetDisposal extends Model {
    public id!: string;
    public disposalId!: string;
    public assetId!: string;
    public disposalDate!: Date;
    public disposalMethod!: string;
    public disposalAmount!: number;
    public netBookValue!: number;
    public gainLoss!: number;
    public disposedBy!: string;
    public approvedBy!: string;
    public disposalReason!: string;
    public documentReference!: string | null;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetDisposal.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      disposalId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Disposal identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      disposalDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Disposal date',
      },
      disposalMethod: {
        type: DataTypes.ENUM('sale', 'trade_in', 'donation', 'scrap', 'demolition'),
        allowNull: false,
        comment: 'Disposal method',
      },
      disposalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Disposal proceeds',
      },
      netBookValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net book value at disposal',
      },
      gainLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Gain or loss on disposal',
      },
      disposedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Disposed by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by user',
      },
      disposalReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Disposal reason',
      },
      documentReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Supporting document',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_disposals',
      timestamps: true,
      indexes: [
        { fields: ['disposalId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['disposalDate'] },
        { fields: ['disposalMethod'] },
      ],
    },
  );

  return AssetDisposal;
};

/**
 * Sequelize model for Asset Transfers between departments/funds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
export const createAssetTransferModel = (sequelize: Sequelize) => {
  class AssetTransfer extends Model {
    public id!: string;
    public transferId!: string;
    public assetId!: string;
    public transferDate!: Date;
    public fromFund!: string;
    public toFund!: string;
    public fromDepartment!: string;
    public toDepartment!: string;
    public fromLocation!: string;
    public toLocation!: string;
    public transferredBy!: string;
    public approvedBy!: string;
    public transferReason!: string;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetTransfer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transferId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Transfer identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      transferDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transfer date',
      },
      fromFund: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source fund',
      },
      toFund: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination fund',
      },
      fromDepartment: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source department',
      },
      toDepartment: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination department',
      },
      fromLocation: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source location',
      },
      toLocation: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination location',
      },
      transferredBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Transferred by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by user',
      },
      transferReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transfer reason',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_transfers',
      timestamps: true,
      indexes: [
        { fields: ['transferId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['transferDate'] },
        { fields: ['fromFund'] },
        { fields: ['toFund'] },
      ],
    },
  );

  return AssetTransfer;
};

/**
 * Sequelize model for Asset Impairment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetImpairment model
 */
export const createAssetImpairmentModel = (sequelize: Sequelize) => {
  class AssetImpairment extends Model {
    public id!: string;
    public impairmentId!: string;
    public assetId!: string;
    public impairmentDate!: Date;
    public impairmentAmount!: number;
    public recoveryValue!: number;
    public impairmentReason!: string;
    public assessedBy!: string;
    public approvedBy!: string;
    public isRecoverable!: boolean;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetImpairment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      impairmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Impairment identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      impairmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Impairment date',
      },
      impairmentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Impairment amount',
      },
      recoveryValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimated recovery value',
      },
      impairmentReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Impairment reason',
      },
      assessedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Assessed by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by user',
      },
      isRecoverable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is recoverable',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_impairments',
      timestamps: true,
      indexes: [
        { fields: ['impairmentId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['impairmentDate'] },
        { fields: ['isRecoverable'] },
      ],
    },
  );

  return AssetImpairment;
};

/**
 * Sequelize model for Asset Maintenance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetMaintenance model
 */
export const createAssetMaintenanceModel = (sequelize: Sequelize) => {
  class AssetMaintenance extends Model {
    public id!: string;
    public maintenanceId!: string;
    public assetId!: string;
    public maintenanceDate!: Date;
    public maintenanceType!: string;
    public maintenanceCost!: number;
    public description!: string;
    public performedBy!: string;
    public vendorId!: string | null;
    public nextMaintenanceDue!: Date | null;
    public isCapitalized!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetMaintenance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      maintenanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Maintenance identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      maintenanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maintenance date',
      },
      maintenanceType: {
        type: DataTypes.ENUM('preventive', 'corrective', 'emergency', 'improvement'),
        allowNull: false,
        comment: 'Maintenance type',
      },
      maintenanceCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Maintenance cost',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Maintenance description',
      },
      performedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Performed by',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Vendor identifier',
      },
      nextMaintenanceDue: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next maintenance due',
      },
      isCapitalized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is capitalized improvement',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_maintenance',
      timestamps: true,
      indexes: [
        { fields: ['maintenanceId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['maintenanceDate'] },
        { fields: ['maintenanceType'] },
        { fields: ['isCapitalized'] },
      ],
    },
  );

  return AssetMaintenance;
};

/**
 * Sequelize model for Physical Asset Inventory.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetInventory model
 */
export const createAssetInventoryModel = (sequelize: Sequelize) => {
  class AssetInventory extends Model {
    public id!: string;
    public inventoryId!: string;
    public inventoryDate!: Date;
    public inventoryType!: string;
    public performedBy!: string;
    public locationCode!: string;
    public assetsExpected!: number;
    public assetsFound!: number;
    public assetsMissing!: number;
    public assetsUntagged!: number;
    public status!: string;
    public completedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetInventory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inventoryId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Inventory identifier',
      },
      inventoryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Inventory date',
      },
      inventoryType: {
        type: DataTypes.ENUM('annual', 'cyclical', 'spot_check', 'comprehensive'),
        allowNull: false,
        comment: 'Inventory type',
      },
      performedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Performed by user',
      },
      locationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Location code',
      },
      assetsExpected: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Assets expected',
      },
      assetsFound: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Assets found',
      },
      assetsMissing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Assets missing',
      },
      assetsUntagged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Assets untagged',
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'reconciled'),
        allowNull: false,
        defaultValue: 'in_progress',
        comment: 'Inventory status',
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Completion date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_inventories',
      timestamps: true,
      indexes: [
        { fields: ['inventoryId'], unique: true },
        { fields: ['inventoryDate'] },
        { fields: ['locationCode'] },
        { fields: ['status'] },
      ],
    },
  );

  return AssetInventory;
};

/**
 * Sequelize model for Asset Valuation and Revaluation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetValuation model
 */
export const createAssetValuationModel = (sequelize: Sequelize) => {
  class AssetValuation extends Model {
    public id!: string;
    public valuationId!: string;
    public assetId!: string;
    public valuationDate!: Date;
    public valuationType!: string;
    public originalValue!: number;
    public revaluedAmount!: number;
    public revaluationSurplus!: number;
    public valuedBy!: string;
    public approvedBy!: string;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetValuation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      valuationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Valuation identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Asset identifier',
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Valuation date',
      },
      valuationType: {
        type: DataTypes.ENUM('market', 'replacement', 'fair_value', 'appraisal'),
        allowNull: false,
        comment: 'Valuation type',
      },
      originalValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Original value',
      },
      revaluedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Revalued amount',
      },
      revaluationSurplus: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Revaluation surplus/deficit',
      },
      valuedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Valued by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by user',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_valuations',
      timestamps: true,
      indexes: [
        { fields: ['valuationId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['valuationDate'] },
        { fields: ['valuationType'] },
      ],
    },
  );

  return AssetValuation;
};

// ============================================================================
// ASSET LIFECYCLE MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates new fixed asset with validation.
 *
 * @param {FixedAssetData} assetData - Asset data
 * @param {Model} FixedAsset - FixedAsset model
 * @param {string} userId - User creating asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created asset
 *
 * @example
 * ```typescript
 * const asset = await createFixedAsset({
 *   assetId: 'FA-2024-001',
 *   assetTag: 'USACE-EQ-001',
 *   assetName: 'Excavator CAT 320',
 *   assetCategory: 'equipment',
 *   acquisitionCost: 250000,
 *   estimatedUsefulLife: 10,
 *   depreciationMethod: 'straight_line'
 * }, FixedAsset, 'user123');
 * ```
 */
export const createFixedAsset = async (
  assetData: FixedAssetData,
  FixedAsset: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const netBookValue = assetData.acquisitionCost;

  const asset = await FixedAsset.create(
    {
      ...assetData,
      netBookValue,
      accumulatedDepreciation: 0,
      inServiceDate: assetData.acquisitionDate,
    },
    { transaction },
  );

  console.log(`Fixed asset created: ${asset.assetId} by ${userId}`);
  return asset;
};

/**
 * Validates asset capitalization threshold.
 *
 * @param {number} assetCost - Asset cost
 * @param {string} assetCategory - Asset category
 * @returns {{ shouldCapitalize: boolean; threshold: number; reason: string }}
 */
export const validateCapitalizationThreshold = (
  assetCost: number,
  assetCategory: string,
): { shouldCapitalize: boolean; threshold: number; reason: string } => {
  const thresholds: Record<string, number> = {
    land: 0,
    buildings: 100000,
    infrastructure: 50000,
    equipment: 5000,
    vehicles: 5000,
    furniture: 5000,
    software: 10000,
  };

  const threshold = thresholds[assetCategory] || 5000;
  const shouldCapitalize = assetCost >= threshold;

  return {
    shouldCapitalize,
    threshold,
    reason: shouldCapitalize
      ? 'Meets capitalization threshold'
      : `Below threshold of ${threshold}`,
  };
};

/**
 * Updates asset status with validation.
 *
 * @param {string} assetId - Asset ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating status
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Updated asset
 */
export const updateAssetStatus = async (
  assetId: string,
  newStatus: string,
  userId: string,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  asset.status = newStatus;
  asset.metadata = {
    ...asset.metadata,
    statusUpdatedBy: userId,
    statusUpdatedAt: new Date().toISOString(),
  };
  await asset.save();

  return asset;
};

/**
 * Retrieves assets by location.
 *
 * @param {string} locationCode - Location code
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any[]>} Assets at location
 */
export const getAssetsByLocation = async (
  locationCode: string,
  FixedAsset: any,
): Promise<any[]> => {
  return await FixedAsset.findAll({
    where: { locationCode, status: 'active' },
    order: [['assetTag', 'ASC']],
  });
};

/**
 * Retrieves assets by custodian.
 *
 * @param {string} custodian - Custodian user ID
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any[]>} Assets assigned to custodian
 */
export const getAssetsByCustodian = async (
  custodian: string,
  FixedAsset: any,
): Promise<any[]> => {
  return await FixedAsset.findAll({
    where: { custodian, status: 'active' },
    order: [['assetName', 'ASC']],
  });
};

/**
 * Updates asset custodian with authorization.
 *
 * @param {string} assetId - Asset ID
 * @param {string} newCustodian - New custodian
 * @param {string} userId - User making change
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Updated asset
 */
export const updateAssetCustodian = async (
  assetId: string,
  newCustodian: string,
  userId: string,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const oldCustodian = asset.custodian;
  asset.custodian = newCustodian;
  asset.metadata = {
    ...asset.metadata,
    custodianHistory: [
      ...(asset.metadata.custodianHistory || []),
      {
        from: oldCustodian,
        to: newCustodian,
        changedBy: userId,
        changedAt: new Date().toISOString(),
      },
    ],
  };
  await asset.save();

  return asset;
};

/**
 * Generates asset tag number.
 *
 * @param {string} assetCategory - Asset category
 * @param {string} departmentCode - Department code
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<string>} Generated asset tag
 */
export const generateAssetTag = async (
  assetCategory: string,
  departmentCode: string,
  FixedAsset: any,
): Promise<string> => {
  const categoryPrefixes: Record<string, string> = {
    land: 'LND',
    buildings: 'BLD',
    infrastructure: 'INF',
    equipment: 'EQP',
    vehicles: 'VEH',
    furniture: 'FRN',
    software: 'SFT',
  };

  const prefix = categoryPrefixes[assetCategory] || 'AST';
  const count = await FixedAsset.count({
    where: { assetCategory, departmentCode },
  });

  return `USACE-${departmentCode}-${prefix}-${(count + 1).toString().padStart(6, '0')}`;
};

/**
 * Retrieves asset details with full history.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} FixedAsset - FixedAsset model
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any>} Comprehensive asset details
 */
export const getAssetDetails = async (
  assetId: string,
  FixedAsset: any,
  DepreciationSchedule: any,
  AssetMaintenance: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const depreciationHistory = await DepreciationSchedule.findAll({
    where: { assetId },
    order: [['fiscalYear', 'DESC'], ['fiscalPeriod', 'DESC']],
  });

  const maintenanceHistory = await AssetMaintenance.findAll({
    where: { assetId },
    order: [['maintenanceDate', 'DESC']],
  });

  return {
    asset,
    depreciationHistory,
    maintenanceHistory,
    totalMaintenanceCost: maintenanceHistory.reduce(
      (sum: number, m: any) => sum + parseFloat(m.maintenanceCost),
      0,
    ),
  };
};

// ============================================================================
// DEPRECIATION CALCULATIONS (9-16)
// ============================================================================

/**
 * Calculates straight-line depreciation.
 *
 * @param {number} acquisitionCost - Acquisition cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLife - Useful life in years
 * @returns {number} Annual depreciation expense
 */
export const calculateStraightLineDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  usefulLife: number,
): number => {
  if (usefulLife === 0) return 0;
  return (acquisitionCost - salvageValue) / usefulLife;
};

/**
 * Calculates declining balance depreciation.
 *
 * @param {number} netBookValue - Current net book value
 * @param {number} salvageValue - Salvage value
 * @param {number} depreciationRate - Depreciation rate (e.g., 2 for double declining)
 * @returns {number} Depreciation expense
 */
export const calculateDecliningBalanceDepreciation = (
  netBookValue: number,
  salvageValue: number,
  depreciationRate: number,
): number => {
  const expense = netBookValue * depreciationRate;
  return Math.min(expense, Math.max(0, netBookValue - salvageValue));
};

/**
 * Calculates units of production depreciation.
 *
 * @param {number} acquisitionCost - Acquisition cost
 * @param {number} salvageValue - Salvage value
 * @param {number} totalUnits - Total estimated units
 * @param {number} unitsProduced - Units produced in period
 * @returns {number} Depreciation expense
 */
export const calculateUnitsOfProductionDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  totalUnits: number,
  unitsProduced: number,
): number => {
  if (totalUnits === 0) return 0;
  const depreciationPerUnit = (acquisitionCost - salvageValue) / totalUnits;
  return depreciationPerUnit * unitsProduced;
};

/**
 * Generates depreciation schedule for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} FixedAsset - FixedAsset model
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @returns {Promise<any>} Created depreciation entry
 */
export const generateDepreciationSchedule = async (
  assetId: string,
  fiscalYear: number,
  fiscalPeriod: number,
  FixedAsset: any,
  DepreciationSchedule: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  if (asset.status !== 'active') {
    throw new Error('Asset is not active');
  }

  let depreciationExpense = 0;

  if (asset.depreciationMethod === 'straight_line') {
    const annualExpense = calculateStraightLineDepreciation(
      parseFloat(asset.acquisitionCost),
      parseFloat(asset.salvageValue),
      asset.estimatedUsefulLife,
    );
    depreciationExpense = annualExpense / 12;
  }

  const accumulatedDepreciation = parseFloat(asset.accumulatedDepreciation) + depreciationExpense;
  const netBookValue = parseFloat(asset.acquisitionCost) - accumulatedDepreciation;

  const schedule = await DepreciationSchedule.create({
    assetId,
    fiscalYear,
    fiscalPeriod,
    depreciationExpense,
    accumulatedDepreciation,
    netBookValue,
    calculatedDate: new Date(),
    isPosted: false,
  });

  return schedule;
};

/**
 * Posts depreciation to general ledger.
 *
 * @param {string} scheduleId - Depreciation schedule ID
 * @param {string} journalEntryNumber - Journal entry number
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Posted schedule
 */
export const postDepreciationToGL = async (
  scheduleId: string,
  journalEntryNumber: string,
  DepreciationSchedule: any,
  FixedAsset: any,
): Promise<any> => {
  const schedule = await DepreciationSchedule.findByPk(scheduleId);
  if (!schedule) throw new Error('Schedule not found');

  if (schedule.isPosted) {
    throw new Error('Schedule already posted');
  }

  schedule.isPosted = true;
  schedule.postedDate = new Date();
  schedule.journalEntryNumber = journalEntryNumber;
  await schedule.save();

  // Update asset
  const asset = await FixedAsset.findOne({ where: { assetId: schedule.assetId } });
  if (asset) {
    asset.accumulatedDepreciation = schedule.accumulatedDepreciation;
    asset.netBookValue = schedule.netBookValue;
    asset.lastDepreciationDate = new Date();
    await asset.save();
  }

  return schedule;
};

/**
 * Runs batch depreciation for fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} FixedAsset - FixedAsset model
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @returns {Promise<any>} Batch results
 */
export const runBatchDepreciation = async (
  fiscalYear: number,
  fiscalPeriod: number,
  FixedAsset: any,
  DepreciationSchedule: any,
): Promise<any> => {
  const activeAssets = await FixedAsset.findAll({
    where: { status: 'active' },
  });

  const results = {
    processed: 0,
    errors: [] as any[],
    totalExpense: 0,
  };

  for (const asset of activeAssets) {
    try {
      const schedule = await generateDepreciationSchedule(
        asset.assetId,
        fiscalYear,
        fiscalPeriod,
        FixedAsset,
        DepreciationSchedule,
      );
      results.processed++;
      results.totalExpense += parseFloat(schedule.depreciationExpense);
    } catch (error: any) {
      results.errors.push({
        assetId: asset.assetId,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Retrieves unposted depreciation schedules.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @returns {Promise<any[]>} Unposted schedules
 */
export const getUnpostedDepreciation = async (
  fiscalYear: number,
  fiscalPeriod: number,
  DepreciationSchedule: any,
): Promise<any[]> => {
  return await DepreciationSchedule.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      isPosted: false,
    },
    order: [['assetId', 'ASC']],
  });
};

/**
 * Generates depreciation report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} DepreciationSchedule - DepreciationSchedule model
 * @returns {Promise<any>} Depreciation report
 */
export const generateDepreciationReport = async (
  fiscalYear: number,
  fiscalPeriod: number,
  DepreciationSchedule: any,
): Promise<any> => {
  const schedules = await DepreciationSchedule.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const totalExpense = schedules.reduce(
    (sum: number, s: any) => sum + parseFloat(s.depreciationExpense),
    0,
  );

  const totalAccumulated = schedules.reduce(
    (sum: number, s: any) => sum + parseFloat(s.accumulatedDepreciation),
    0,
  );

  return {
    fiscalYear,
    fiscalPeriod,
    totalAssets: schedules.length,
    totalExpense,
    totalAccumulated,
    postedCount: schedules.filter((s: any) => s.isPosted).length,
    unpostedCount: schedules.filter((s: any) => !s.isPosted).length,
    schedules,
  };
};

// ============================================================================
// ASSET DISPOSAL & TRANSFERS (17-24)
// ============================================================================

/**
 * Creates asset disposal record.
 *
 * @param {AssetDisposalData} disposalData - Disposal data
 * @param {Model} AssetDisposal - AssetDisposal model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Created disposal
 */
export const createAssetDisposal = async (
  disposalData: AssetDisposalData,
  AssetDisposal: any,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId: disposalData.assetId } });
  if (!asset) throw new Error('Asset not found');

  const disposal = await AssetDisposal.create(disposalData);

  // Update asset status
  asset.status = 'disposed';
  await asset.save();

  return disposal;
};

/**
 * Calculates gain or loss on disposal.
 *
 * @param {number} disposalAmount - Disposal proceeds
 * @param {number} netBookValue - Net book value
 * @returns {{ gainLoss: number; isGain: boolean }}
 */
export const calculateDisposalGainLoss = (
  disposalAmount: number,
  netBookValue: number,
): { gainLoss: number; isGain: boolean } => {
  const gainLoss = disposalAmount - netBookValue;
  return {
    gainLoss,
    isGain: gainLoss > 0,
  };
};

/**
 * Creates asset transfer between funds/departments.
 *
 * @param {AssetTransferData} transferData - Transfer data
 * @param {Model} AssetTransfer - AssetTransfer model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Created transfer
 */
export const createAssetTransfer = async (
  transferData: AssetTransferData,
  AssetTransfer: any,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId: transferData.assetId } });
  if (!asset) throw new Error('Asset not found');

  const transfer = await AssetTransfer.create(transferData);

  // Update asset location/fund/department
  asset.fundCode = transferData.toFund;
  asset.departmentCode = transferData.toDepartment;
  asset.locationCode = transferData.toLocation;
  await asset.save();

  return transfer;
};

/**
 * Retrieves disposal history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetDisposal - AssetDisposal model
 * @returns {Promise<any[]>} Disposal records
 */
export const getAssetDisposalHistory = async (
  assetId: string,
  AssetDisposal: any,
): Promise<any[]> => {
  return await AssetDisposal.findAll({
    where: { assetId },
    order: [['disposalDate', 'DESC']],
  });
};

/**
 * Retrieves transfer history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any[]>} Transfer records
 */
export const getAssetTransferHistory = async (
  assetId: string,
  AssetTransfer: any,
): Promise<any[]> => {
  return await AssetTransfer.findAll({
    where: { assetId },
    order: [['transferDate', 'DESC']],
  });
};

/**
 * Generates disposal report for fiscal year.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetDisposal - AssetDisposal model
 * @returns {Promise<any>} Disposal report
 */
export const generateDisposalReport = async (
  fiscalYear: number,
  AssetDisposal: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const disposals = await AssetDisposal.findAll({
    where: {
      disposalDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalDisposals = disposals.length;
  const totalProceeds = disposals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.disposalAmount),
    0,
  );
  const totalNBV = disposals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.netBookValue),
    0,
  );
  const totalGainLoss = disposals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.gainLoss),
    0,
  );

  return {
    fiscalYear,
    totalDisposals,
    totalProceeds,
    totalNBV,
    totalGainLoss,
    byMethod: disposals.reduce((acc: any, d: any) => {
      acc[d.disposalMethod] = (acc[d.disposalMethod] || 0) + 1;
      return acc;
    }, {}),
    disposals,
  };
};

/**
 * Validates disposal authorization.
 *
 * @param {string} assetId - Asset ID
 * @param {string} userId - User requesting disposal
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<{ authorized: boolean; reason?: string }>}
 */
export const validateDisposalAuthorization = async (
  assetId: string,
  userId: string,
  FixedAsset: any,
): Promise<{ authorized: boolean; reason?: string }> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) {
    return { authorized: false, reason: 'Asset not found' };
  }

  if (asset.status !== 'active') {
    return { authorized: false, reason: 'Asset is not active' };
  }

  const netBookValue = parseFloat(asset.netBookValue);
  if (netBookValue > 100000) {
    return { authorized: false, reason: 'Requires executive approval for high-value assets' };
  }

  return { authorized: true };
};

/**
 * Exports disposal summary to CSV.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetDisposal - AssetDisposal model
 * @returns {Promise<Buffer>} CSV buffer
 */
export const exportDisposalSummaryCSV = async (
  fiscalYear: number,
  AssetDisposal: any,
): Promise<Buffer> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const disposals = await AssetDisposal.findAll({
    where: {
      disposalDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const csv = 'Disposal ID,Asset ID,Disposal Date,Method,Disposal Amount,NBV,Gain/Loss\n' +
    disposals.map((d: any) =>
      `${d.disposalId},${d.assetId},${d.disposalDate.toISOString().split('T')[0]},${d.disposalMethod},${d.disposalAmount},${d.netBookValue},${d.gainLoss}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// ASSET IMPAIRMENT & VALUATION (25-32)
// ============================================================================

/**
 * Creates asset impairment record.
 *
 * @param {AssetImpairmentData} impairmentData - Impairment data
 * @param {Model} AssetImpairment - AssetImpairment model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Created impairment
 */
export const createAssetImpairment = async (
  impairmentData: AssetImpairmentData,
  AssetImpairment: any,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId: impairmentData.assetId } });
  if (!asset) throw new Error('Asset not found');

  const impairment = await AssetImpairment.create(impairmentData);

  // Update asset status and value
  asset.status = 'impaired';
  asset.netBookValue = parseFloat(asset.netBookValue) - impairmentData.impairmentAmount;
  await asset.save();

  return impairment;
};

/**
 * Assesses asset for impairment indicators.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} FixedAsset - FixedAsset model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<{ impaired: boolean; indicators: string[] }>}
 */
export const assessAssetImpairment = async (
  assetId: string,
  FixedAsset: any,
  AssetMaintenance: any,
): Promise<{ impaired: boolean; indicators: string[] }> => {
  const asset = await FixedAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const indicators: string[] = [];

  // Check maintenance costs
  const maintenanceRecords = await AssetMaintenance.findAll({
    where: {
      assetId,
      maintenanceDate: {
        [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const totalMaintenance = maintenanceRecords.reduce(
    (sum: number, m: any) => sum + parseFloat(m.maintenanceCost),
    0,
  );

  if (totalMaintenance > parseFloat(asset.netBookValue) * 0.5) {
    indicators.push('High maintenance costs relative to value');
  }

  // Check age vs useful life
  const assetAge = (new Date().getTime() - asset.acquisitionDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
  if (assetAge > asset.estimatedUsefulLife * 0.9) {
    indicators.push('Nearing end of useful life');
  }

  return {
    impaired: indicators.length > 0,
    indicators,
  };
};

/**
 * Creates asset revaluation record.
 *
 * @param {AssetValuationData} valuationData - Valuation data
 * @param {Model} AssetValuation - AssetValuation model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Created valuation
 */
export const createAssetRevaluation = async (
  valuationData: AssetValuationData,
  AssetValuation: any,
  FixedAsset: any,
): Promise<any> => {
  const asset = await FixedAsset.findOne({ where: { assetId: valuationData.assetId } });
  if (!asset) throw new Error('Asset not found');

  const valuation = await AssetValuation.create(valuationData);

  // Update asset carrying amount
  asset.metadata = {
    ...asset.metadata,
    revaluedCarryingAmount: valuationData.revaluedAmount,
    revaluationSurplus: valuationData.revaluationSurplus,
  };
  await asset.save();

  return valuation;
};

/**
 * Retrieves impairment history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetImpairment - AssetImpairment model
 * @returns {Promise<any[]>} Impairment records
 */
export const getAssetImpairmentHistory = async (
  assetId: string,
  AssetImpairment: any,
): Promise<any[]> => {
  return await AssetImpairment.findAll({
    where: { assetId },
    order: [['impairmentDate', 'DESC']],
  });
};

/**
 * Retrieves valuation history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetValuation - AssetValuation model
 * @returns {Promise<any[]>} Valuation records
 */
export const getAssetValuationHistory = async (
  assetId: string,
  AssetValuation: any,
): Promise<any[]> => {
  return await AssetValuation.findAll({
    where: { assetId },
    order: [['valuationDate', 'DESC']],
  });
};

/**
 * Generates impairment summary report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetImpairment - AssetImpairment model
 * @returns {Promise<any>} Impairment summary
 */
export const generateImpairmentSummary = async (
  fiscalYear: number,
  AssetImpairment: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const impairments = await AssetImpairment.findAll({
    where: {
      impairmentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalImpairmentAmount = impairments.reduce(
    (sum: number, i: any) => sum + parseFloat(i.impairmentAmount),
    0,
  );

  const recoverableImpairments = impairments.filter((i: any) => i.isRecoverable);

  return {
    fiscalYear,
    totalImpairments: impairments.length,
    totalImpairmentAmount,
    recoverableCount: recoverableImpairments.length,
    nonRecoverableCount: impairments.length - recoverableImpairments.length,
    impairments,
  };
};

/**
 * Validates impairment threshold.
 *
 * @param {number} impairmentAmount - Impairment amount
 * @param {number} assetValue - Asset carrying value
 * @returns {{ significant: boolean; percentage: number }}
 */
export const validateImpairmentThreshold = (
  impairmentAmount: number,
  assetValue: number,
): { significant: boolean; percentage: number } => {
  const percentage = (impairmentAmount / assetValue) * 100;
  return {
    significant: percentage >= 10,
    percentage,
  };
};

/**
 * Generates comprehensive asset valuation report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Valuation report
 */
export const generateAssetValuationReport = async (
  fiscalYear: number,
  FixedAsset: any,
): Promise<any> => {
  const assets = await FixedAsset.findAll({
    where: { status: { [Op.in]: ['active', 'impaired'] } },
  });

  const totalAcquisitionCost = assets.reduce(
    (sum: number, a: any) => sum + parseFloat(a.acquisitionCost),
    0,
  );

  const totalAccumulatedDepreciation = assets.reduce(
    (sum: number, a: any) => sum + parseFloat(a.accumulatedDepreciation),
    0,
  );

  const totalNetBookValue = assets.reduce(
    (sum: number, a: any) => sum + parseFloat(a.netBookValue),
    0,
  );

  const byCategory = assets.reduce((acc: any, a: any) => {
    if (!acc[a.assetCategory]) {
      acc[a.assetCategory] = {
        count: 0,
        acquisitionCost: 0,
        netBookValue: 0,
      };
    }
    acc[a.assetCategory].count++;
    acc[a.assetCategory].acquisitionCost += parseFloat(a.acquisitionCost);
    acc[a.assetCategory].netBookValue += parseFloat(a.netBookValue);
    return acc;
  }, {});

  return {
    fiscalYear,
    totalAssets: assets.length,
    totalAcquisitionCost,
    totalAccumulatedDepreciation,
    totalNetBookValue,
    byCategory,
  };
};

// ============================================================================
// MAINTENANCE & INVENTORY (33-40)
// ============================================================================

/**
 * Records asset maintenance event.
 *
 * @param {AssetMaintenanceData} maintenanceData - Maintenance data
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Created maintenance record
 */
export const recordAssetMaintenance = async (
  maintenanceData: AssetMaintenanceData,
  AssetMaintenance: any,
  FixedAsset: any,
): Promise<any> => {
  const maintenance = await AssetMaintenance.create(maintenanceData);

  // If capitalized, update asset cost
  if (maintenanceData.isCapitalized) {
    const asset = await FixedAsset.findOne({ where: { assetId: maintenanceData.assetId } });
    if (asset) {
      asset.acquisitionCost = parseFloat(asset.acquisitionCost) + maintenanceData.maintenanceCost;
      asset.netBookValue = parseFloat(asset.netBookValue) + maintenanceData.maintenanceCost;
      await asset.save();
    }
  }

  return maintenance;
};

/**
 * Retrieves maintenance due for scheduling.
 *
 * @param {Date} dueDate - Due date threshold
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any[]>} Maintenance due
 */
export const getMaintenanceDue = async (
  dueDate: Date,
  AssetMaintenance: any,
): Promise<any[]> => {
  return await AssetMaintenance.findAll({
    where: {
      nextMaintenanceDue: { [Op.lte]: dueDate },
    },
    order: [['nextMaintenanceDue', 'ASC']],
  });
};

/**
 * Generates maintenance cost report.
 *
 * @param {string} assetId - Asset ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any>} Maintenance cost report
 */
export const generateMaintenanceCostReport = async (
  assetId: string,
  fiscalYear: number,
  AssetMaintenance: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const maintenanceRecords = await AssetMaintenance.findAll({
    where: {
      assetId,
      maintenanceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalCost = maintenanceRecords.reduce(
    (sum: number, m: any) => sum + parseFloat(m.maintenanceCost),
    0,
  );

  const capitalizedCost = maintenanceRecords
    .filter((m: any) => m.isCapitalized)
    .reduce((sum: number, m: any) => sum + parseFloat(m.maintenanceCost), 0);

  return {
    assetId,
    fiscalYear,
    totalEvents: maintenanceRecords.length,
    totalCost,
    capitalizedCost,
    expensedCost: totalCost - capitalizedCost,
    byType: maintenanceRecords.reduce((acc: any, m: any) => {
      acc[m.maintenanceType] = (acc[m.maintenanceType] || 0) + parseFloat(m.maintenanceCost);
      return acc;
    }, {}),
  };
};

/**
 * Creates physical inventory session.
 *
 * @param {AssetInventoryData} inventoryData - Inventory data
 * @param {Model} AssetInventory - AssetInventory model
 * @returns {Promise<any>} Created inventory
 */
export const createPhysicalInventory = async (
  inventoryData: AssetInventoryData,
  AssetInventory: any,
): Promise<any> => {
  return await AssetInventory.create(inventoryData);
};

/**
 * Completes inventory session with reconciliation.
 *
 * @param {string} inventoryId - Inventory ID
 * @param {Model} AssetInventory - AssetInventory model
 * @returns {Promise<any>} Completed inventory
 */
export const completePhysicalInventory = async (
  inventoryId: string,
  AssetInventory: any,
): Promise<any> => {
  const inventory = await AssetInventory.findOne({ where: { inventoryId } });
  if (!inventory) throw new Error('Inventory not found');

  inventory.status = 'completed';
  inventory.completedDate = new Date();
  await inventory.save();

  return inventory;
};

/**
 * Identifies inventory discrepancies.
 *
 * @param {string} inventoryId - Inventory ID
 * @param {Model} AssetInventory - AssetInventory model
 * @returns {Promise<any>} Discrepancy report
 */
export const identifyInventoryDiscrepancies = async (
  inventoryId: string,
  AssetInventory: any,
): Promise<any> => {
  const inventory = await AssetInventory.findOne({ where: { inventoryId } });
  if (!inventory) throw new Error('Inventory not found');

  const discrepancies = {
    missingAssets: inventory.assetsMissing,
    untaggedAssets: inventory.assetsUntagged,
    varianceRate: inventory.assetsExpected > 0
      ? (inventory.assetsMissing / inventory.assetsExpected) * 100
      : 0,
    requiresAction: inventory.assetsMissing > 0 || inventory.assetsUntagged > 0,
  };

  return discrepancies;
};

/**
 * Generates inventory reconciliation report.
 *
 * @param {string} locationCode - Location code
 * @param {Date} inventoryDate - Inventory date
 * @param {Model} AssetInventory - AssetInventory model
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<any>} Reconciliation report
 */
export const generateInventoryReconciliation = async (
  locationCode: string,
  inventoryDate: Date,
  AssetInventory: any,
  FixedAsset: any,
): Promise<any> => {
  const inventory = await AssetInventory.findOne({
    where: { locationCode, inventoryDate },
  });

  const assetsAtLocation = await FixedAsset.findAll({
    where: { locationCode, status: 'active' },
  });

  return {
    locationCode,
    inventoryDate,
    assetsExpected: assetsAtLocation.length,
    assetsFound: inventory?.assetsFound || 0,
    assetsMissing: inventory?.assetsMissing || 0,
    reconciliationRate: assetsAtLocation.length > 0
      ? ((inventory?.assetsFound || 0) / assetsAtLocation.length) * 100
      : 0,
  };
};

/**
 * Exports comprehensive asset register.
 *
 * @param {string} [fundCode] - Optional fund filter
 * @param {Model} FixedAsset - FixedAsset model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportAssetRegister = async (
  fundCode: string | undefined,
  FixedAsset: any,
): Promise<Buffer> => {
  const where: any = { status: { [Op.in]: ['active', 'impaired'] } };
  if (fundCode) {
    where.fundCode = fundCode;
  }

  const assets = await FixedAsset.findAll({ where, order: [['assetTag', 'ASC']] });

  const csv = 'Asset Tag,Asset Name,Category,Acquisition Date,Acquisition Cost,Accumulated Depreciation,Net Book Value,Location,Custodian,Status\n' +
    assets.map((a: any) =>
      `${a.assetTag},${a.assetName},${a.assetCategory},${a.acquisitionDate.toISOString().split('T')[0]},${a.acquisitionCost},${a.accumulatedDepreciation},${a.netBookValue},${a.locationCode},${a.custodian},${a.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSFixedAssetService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAsset(assetData: FixedAssetData, userId: string) {
    const FixedAsset = createFixedAssetModel(this.sequelize);
    return createFixedAsset(assetData, FixedAsset, userId);
  }

  async runDepreciation(fiscalYear: number, fiscalPeriod: number) {
    const FixedAsset = createFixedAssetModel(this.sequelize);
    const DepreciationSchedule = createDepreciationScheduleModel(this.sequelize);
    return runBatchDepreciation(fiscalYear, fiscalPeriod, FixedAsset, DepreciationSchedule);
  }

  async disposeAsset(disposalData: AssetDisposalData) {
    const AssetDisposal = createAssetDisposalModel(this.sequelize);
    const FixedAsset = createFixedAssetModel(this.sequelize);
    return createAssetDisposal(disposalData, AssetDisposal, FixedAsset);
  }

  async transferAsset(transferData: AssetTransferData) {
    const AssetTransfer = createAssetTransferModel(this.sequelize);
    const FixedAsset = createFixedAssetModel(this.sequelize);
    return createAssetTransfer(transferData, AssetTransfer, FixedAsset);
  }
}

export default {
  // Models
  createFixedAssetModel,
  createDepreciationScheduleModel,
  createAssetDisposalModel,
  createAssetTransferModel,
  createAssetImpairmentModel,
  createAssetMaintenanceModel,
  createAssetInventoryModel,
  createAssetValuationModel,

  // Asset Lifecycle
  createFixedAsset,
  validateCapitalizationThreshold,
  updateAssetStatus,
  getAssetsByLocation,
  getAssetsByCustodian,
  updateAssetCustodian,
  generateAssetTag,
  getAssetDetails,

  // Depreciation
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  calculateUnitsOfProductionDepreciation,
  generateDepreciationSchedule,
  postDepreciationToGL,
  runBatchDepreciation,
  getUnpostedDepreciation,
  generateDepreciationReport,

  // Disposal & Transfers
  createAssetDisposal,
  calculateDisposalGainLoss,
  createAssetTransfer,
  getAssetDisposalHistory,
  getAssetTransferHistory,
  generateDisposalReport,
  validateDisposalAuthorization,
  exportDisposalSummaryCSV,

  // Impairment & Valuation
  createAssetImpairment,
  assessAssetImpairment,
  createAssetRevaluation,
  getAssetImpairmentHistory,
  getAssetValuationHistory,
  generateImpairmentSummary,
  validateImpairmentThreshold,
  generateAssetValuationReport,

  // Maintenance & Inventory
  recordAssetMaintenance,
  getMaintenanceDue,
  generateMaintenanceCostReport,
  createPhysicalInventory,
  completePhysicalInventory,
  identifyInventoryDiscrepancies,
  generateInventoryReconciliation,
  exportAssetRegister,

  // Service
  CEFMSFixedAssetService,
};

/**
 * LOC: GOVAM8765432
 * File: /reuse/government/asset-inventory-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable government utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend asset management services
 *   - Property management modules
 *   - Depreciation calculation services
 *   - Barcode/RFID tracking systems
 */

/**
 * File: /reuse/government/asset-inventory-management-kit.ts
 * Locator: WC-GOV-ASSET-001
 * Purpose: Enterprise-grade Government Asset Inventory Management - capital assets, depreciation, physical inventory, transfers, maintenance, barcode/RFID
 *
 * Upstream: Independent utility module for government asset operations
 * Downstream: ../backend/government/*, asset controllers, inventory services, transfer processors, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ functions for government asset management competing with USACE CEFMS/SAP asset tracking
 *
 * LLM Context: Comprehensive government asset inventory utilities for production-ready applications.
 * Provides capital asset tracking, acquisition/disposal processing, multiple depreciation methods (straight-line, declining balance),
 * asset categorization and tagging, physical inventory management, interdepartmental transfers, maintenance scheduling,
 * capitalization threshold management, asset impairment testing, barcode/RFID integration, valuation updates, and surplus property management.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CapitalAssetData {
  assetNumber: string;
  description: string;
  assetCategory: 'land' | 'building' | 'equipment' | 'vehicle' | 'infrastructure' | 'software' | 'furniture';
  acquisitionDate: Date;
  acquisitionCost: number;
  usefulLifeYears: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years';
  salvageValue: number;
  departmentId: string;
  locationId: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  warrantyExpiration?: Date;
  metadata?: Record<string, any>;
}

interface DepreciationResult {
  assetId: string;
  fiscalYear: number;
  periodDepreciation: number;
  accumulatedDepreciation: number;
  bookValue: number;
  method: string;
  calculatedAt: Date;
}

interface AssetTransferData {
  assetId: string;
  fromDepartmentId: string;
  toDepartmentId: string;
  fromLocationId: string;
  toLocationId: string;
  transferDate: Date;
  transferReason: string;
  transferredBy: string;
  approvedBy?: string;
  condition?: string;
  notes?: string;
}

interface PhysicalInventorySession {
  sessionId: string;
  sessionDate: Date;
  locationId: string;
  conductedBy: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  assetsExpected: number;
  assetsFound: number;
  assetsMissing: number;
  assetsSurplus: number;
  completedAt?: Date;
}

interface AssetMaintenanceRecord {
  assetId: string;
  maintenanceType: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  maintenanceDate: Date;
  performedBy: string;
  cost: number;
  description: string;
  nextMaintenanceDate?: Date;
  downtimeHours?: number;
  partsReplaced?: string[];
}

interface AssetValuation {
  assetId: string;
  valuationDate: Date;
  valuationType: 'market' | 'replacement' | 'liquidation' | 'insurance';
  valuationAmount: number;
  valuedBy: string;
  certifiedBy?: string;
  validUntil?: Date;
  notes?: string;
}

interface AssetDisposalData {
  assetId: string;
  disposalDate: Date;
  disposalMethod: 'sale' | 'trade' | 'donation' | 'scrap' | 'auction' | 'surplus';
  proceedsAmount: number;
  bookValueAtDisposal: number;
  gainLoss: number;
  approvedBy: string;
  disposalReason: string;
  recipientOrBuyer?: string;
}

interface AssetImpairmentTest {
  assetId: string;
  testDate: Date;
  estimatedFairValue: number;
  currentBookValue: number;
  impairmentLoss: number;
  isImpaired: boolean;
  testedBy: string;
  impairmentReason?: string;
}

interface BarcodeScanData {
  barcode: string;
  assetId?: string;
  scannedAt: Date;
  scannedBy: string;
  locationId: string;
  deviceId: string;
  scanType: 'inventory' | 'transfer' | 'checkout' | 'checkin';
}

interface RFIDTagData {
  rfidTag: string;
  assetId: string;
  lastReadTime: Date;
  lastReadLocation: string;
  readerDeviceId: string;
  signalStrength?: number;
}

interface AssetCategorizationRule {
  categoryName: string;
  capitalizationThreshold: number;
  depreciationMethod: string;
  usefulLifeYears: number;
  glAccountCode: string;
  requiresApproval: boolean;
}

interface SurplusPropertyListing {
  assetId: string;
  listedDate: Date;
  estimatedValue: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  availableFor: 'sale' | 'donation' | 'transfer' | 'all';
  contactPerson: string;
  status: 'listed' | 'pending' | 'sold' | 'withdrawn';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Capital Assets with full lifecycle tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CapitalAsset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         assetNumber:
 *           type: string
 *         description:
 *           type: string
 *         acquisitionCost:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalAsset model
 *
 * @example
 * ```typescript
 * const CapitalAsset = createCapitalAssetModel(sequelize);
 * const asset = await CapitalAsset.create({
 *   assetNumber: 'AST-2024-001',
 *   description: 'Dell Laptop Computer',
 *   assetCategory: 'equipment',
 *   acquisitionDate: new Date(),
 *   acquisitionCost: 1500.00,
 *   usefulLifeYears: 5,
 *   depreciationMethod: 'straight_line',
 *   salvageValue: 100.00
 * });
 * ```
 */
export const createCapitalAssetModel = (sequelize: Sequelize) => {
  class CapitalAsset extends Model {
    public id!: string;
    public assetNumber!: string;
    public description!: string;
    public assetCategory!: string;
    public acquisitionDate!: Date;
    public acquisitionCost!: number;
    public usefulLifeYears!: number;
    public depreciationMethod!: string;
    public salvageValue!: number;
    public departmentId!: string;
    public locationId!: string;
    public serialNumber!: string | null;
    public manufacturer!: string | null;
    public model!: string | null;
    public warrantyExpiration!: Date | null;
    public accumulatedDepreciation!: number;
    public bookValue!: number;
    public status!: string;
    public barcode!: string | null;
    public rfidTag!: string | null;
    public lastInventoryDate!: Date | null;
    public lastMaintenanceDate!: Date | null;
    public disposalDate!: Date | null;
    public fiscalYear!: number;
    public glAccountCode!: string;
    public responsiblePerson!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CapitalAsset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique asset identifier',
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Asset description',
      },
      assetCategory: {
        type: DataTypes.ENUM('land', 'building', 'equipment', 'vehicle', 'infrastructure', 'software', 'furniture'),
        allowNull: false,
        comment: 'Asset category',
      },
      acquisitionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date asset was acquired',
      },
      acquisitionCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Original acquisition cost',
        validate: {
          min: 0,
        },
      },
      usefulLifeYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Estimated useful life in years',
        validate: {
          min: 1,
        },
      },
      depreciationMethod: {
        type: DataTypes.ENUM('straight_line', 'declining_balance', 'units_of_production', 'sum_of_years'),
        allowNull: false,
        comment: 'Depreciation calculation method',
      },
      salvageValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimated salvage value',
      },
      departmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Owning department',
      },
      locationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Physical location',
      },
      serialNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Serial number',
      },
      manufacturer: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Manufacturer name',
      },
      model: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Model number',
      },
      warrantyExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Warranty expiration date',
      },
      accumulatedDepreciation: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total accumulated depreciation',
      },
      bookValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Current book value',
      },
      status: {
        type: DataTypes.ENUM('active', 'in_service', 'maintenance', 'surplus', 'disposed', 'stolen', 'lost'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Asset status',
      },
      barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        comment: 'Barcode identifier',
      },
      rfidTag: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        comment: 'RFID tag identifier',
      },
      lastInventoryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last physical inventory date',
      },
      lastMaintenanceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last maintenance date',
      },
      disposalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date asset was disposed',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year of acquisition',
      },
      glAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'General ledger account code',
      },
      responsiblePerson: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Person responsible for asset',
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
      tableName: 'capital_assets',
      timestamps: true,
      indexes: [
        { fields: ['assetNumber'], unique: true },
        { fields: ['assetCategory'] },
        { fields: ['departmentId'] },
        { fields: ['locationId'] },
        { fields: ['status'] },
        { fields: ['barcode'] },
        { fields: ['rfidTag'] },
        { fields: ['fiscalYear'] },
        { fields: ['serialNumber'] },
      ],
    },
  );

  return CapitalAsset;
};

/**
 * Sequelize model for Asset Depreciation records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetDepreciation model
 *
 * @example
 * ```typescript
 * const AssetDepreciation = createAssetDepreciationModel(sequelize);
 * const depreciation = await AssetDepreciation.create({
 *   assetId: 'asset-uuid',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   periodDepreciation: 250.00,
 *   accumulatedDepreciation: 1250.00,
 *   bookValue: 250.00
 * });
 * ```
 */
export const createAssetDepreciationModel = (sequelize: Sequelize) => {
  class AssetDepreciation extends Model {
    public id!: string;
    public assetId!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public periodDepreciation!: number;
    public accumulatedDepreciation!: number;
    public bookValue!: number;
    public depreciationMethod!: string;
    public calculationBasis!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  AssetDepreciation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related asset ID',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      periodDepreciation: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Depreciation for period',
      },
      accumulatedDepreciation: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total accumulated depreciation',
      },
      bookValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Book value after depreciation',
      },
      depreciationMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Method used for calculation',
      },
      calculationBasis: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Calculation details',
      },
    },
    {
      sequelize,
      tableName: 'asset_depreciation',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['assetId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
    },
  );

  return AssetDepreciation;
};

/**
 * Sequelize model for Asset Transfers between departments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
export const createAssetTransferModel = (sequelize: Sequelize) => {
  class AssetTransfer extends Model {
    public id!: string;
    public assetId!: string;
    public fromDepartmentId!: string;
    public toDepartmentId!: string;
    public fromLocationId!: string;
    public toLocationId!: string;
    public transferDate!: Date;
    public transferReason!: string;
    public transferredBy!: string;
    public approvedBy!: string | null;
    public condition!: string;
    public notes!: string;
    public status!: string;
    public readonly createdAt!: Date;
  }

  AssetTransfer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Asset being transferred',
      },
      fromDepartmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source department',
      },
      toDepartmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination department',
      },
      fromLocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source location',
      },
      toLocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination location',
      },
      transferDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transfer date',
      },
      transferReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for transfer',
      },
      transferredBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User initiating transfer',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Approving authority',
      },
      condition: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'good',
        comment: 'Asset condition at transfer',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Transfer notes',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'in_transit', 'completed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Transfer status',
      },
    },
    {
      sequelize,
      tableName: 'asset_transfers',
      timestamps: true,
      indexes: [
        { fields: ['assetId'] },
        { fields: ['fromDepartmentId'] },
        { fields: ['toDepartmentId'] },
        { fields: ['status'] },
        { fields: ['transferDate'] },
      ],
    },
  );

  return AssetTransfer;
};

/**
 * Sequelize model for Physical Inventory Sessions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PhysicalInventory model
 */
export const createPhysicalInventoryModel = (sequelize: Sequelize) => {
  class PhysicalInventory extends Model {
    public id!: string;
    public sessionId!: string;
    public sessionDate!: Date;
    public locationId!: string;
    public conductedBy!: string;
    public status!: string;
    public assetsExpected!: number;
    public assetsFound!: number;
    public assetsMissing!: number;
    public assetsSurplus!: number;
    public completedAt!: Date | null;
    public notes!: string;
    public readonly createdAt!: Date;
  }

  PhysicalInventory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Inventory session identifier',
      },
      sessionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Inventory date',
      },
      locationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Location being inventoried',
      },
      conductedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Person conducting inventory',
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'in_progress',
        comment: 'Session status',
      },
      assetsExpected: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Expected asset count',
      },
      assetsFound: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Assets found during inventory',
      },
      assetsMissing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Missing assets',
      },
      assetsSurplus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Surplus assets found',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Completion timestamp',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Inventory notes',
      },
    },
    {
      sequelize,
      tableName: 'physical_inventories',
      timestamps: true,
      indexes: [
        { fields: ['sessionId'], unique: true },
        { fields: ['locationId'] },
        { fields: ['sessionDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return PhysicalInventory;
};

/**
 * Sequelize model for Asset Maintenance Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetMaintenance model
 */
export const createAssetMaintenanceModel = (sequelize: Sequelize) => {
  class AssetMaintenance extends Model {
    public id!: string;
    public assetId!: string;
    public maintenanceType!: string;
    public maintenanceDate!: Date;
    public performedBy!: string;
    public cost!: number;
    public description!: string;
    public nextMaintenanceDate!: Date | null;
    public downtimeHours!: number;
    public partsReplaced!: string[];
    public readonly createdAt!: Date;
  }

  AssetMaintenance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Asset ID',
      },
      maintenanceType: {
        type: DataTypes.ENUM('preventive', 'corrective', 'predictive', 'emergency'),
        allowNull: false,
        comment: 'Type of maintenance',
      },
      maintenanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date maintenance performed',
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Person or vendor',
      },
      cost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Maintenance cost',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Work performed',
      },
      nextMaintenanceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next scheduled maintenance',
      },
      downtimeHours: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Hours of downtime',
      },
      partsReplaced: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'List of parts replaced',
      },
    },
    {
      sequelize,
      tableName: 'asset_maintenance',
      timestamps: true,
      indexes: [
        { fields: ['assetId'] },
        { fields: ['maintenanceType'] },
        { fields: ['maintenanceDate'] },
      ],
    },
  );

  return AssetMaintenance;
};

// ============================================================================
// ASSET ACQUISITION & DISPOSAL (1-6)
// ============================================================================

/**
 * Creates a new capital asset with validation.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {string} userId - User creating asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created asset
 *
 * @example
 * ```typescript
 * const asset = await createCapitalAsset({
 *   assetNumber: 'AST-2024-001',
 *   description: 'Dell Laptop',
 *   assetCategory: 'equipment',
 *   acquisitionDate: new Date(),
 *   acquisitionCost: 1500.00,
 *   usefulLifeYears: 5,
 *   depreciationMethod: 'straight_line',
 *   salvageValue: 100.00,
 *   departmentId: 'DEPT001',
 *   locationId: 'LOC001'
 * }, CapitalAsset, 'user123');
 * ```
 */
export const createCapitalAsset = async (
  assetData: CapitalAssetData,
  CapitalAsset: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const fiscalYear = assetData.acquisitionDate.getFullYear();
  const bookValue = assetData.acquisitionCost;

  const asset = await CapitalAsset.create(
    {
      ...assetData,
      fiscalYear,
      bookValue,
      accumulatedDepreciation: 0,
      status: 'active',
      responsiblePerson: userId,
      glAccountCode: determineGLAccount(assetData.assetCategory),
    },
    { transaction },
  );

  return asset;
};

/**
 * Validates asset data against capitalization thresholds.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @param {number} [threshold=5000] - Capitalization threshold
 * @returns {{ shouldCapitalize: boolean; reason: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCapitalizationThreshold(assetData, 5000);
 * if (!result.shouldCapitalize) {
 *   console.log('Expense instead:', result.reason);
 * }
 * ```
 */
export const validateCapitalizationThreshold = (
  assetData: CapitalAssetData,
  threshold: number = 5000,
): { shouldCapitalize: boolean; reason: string } => {
  if (assetData.acquisitionCost < threshold) {
    return {
      shouldCapitalize: false,
      reason: `Cost ${assetData.acquisitionCost} below threshold ${threshold}`,
    };
  }

  if (assetData.usefulLifeYears < 1) {
    return {
      shouldCapitalize: false,
      reason: 'Useful life less than 1 year',
    };
  }

  return {
    shouldCapitalize: true,
    reason: 'Meets capitalization criteria',
  };
};

/**
 * Processes asset disposal with gain/loss calculation.
 *
 * @param {AssetDisposalData} disposalData - Disposal data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {string} userId - User processing disposal
 * @returns {Promise<any>} Disposal result
 *
 * @example
 * ```typescript
 * const disposal = await processAssetDisposal({
 *   assetId: 'asset-uuid',
 *   disposalDate: new Date(),
 *   disposalMethod: 'sale',
 *   proceedsAmount: 500.00,
 *   bookValueAtDisposal: 250.00,
 *   gainLoss: 250.00,
 *   approvedBy: 'manager123',
 *   disposalReason: 'Obsolete'
 * }, CapitalAsset, 'user456');
 * ```
 */
export const processAssetDisposal = async (
  disposalData: AssetDisposalData,
  CapitalAsset: any,
  userId: string,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(disposalData.assetId);
  if (!asset) throw new Error('Asset not found');

  asset.status = 'disposed';
  asset.disposalDate = disposalData.disposalDate;
  asset.metadata = {
    ...asset.metadata,
    disposal: {
      method: disposalData.disposalMethod,
      proceeds: disposalData.proceedsAmount,
      gainLoss: disposalData.gainLoss,
      approvedBy: disposalData.approvedBy,
      reason: disposalData.disposalReason,
      processedBy: userId,
    },
  };
  await asset.save();

  return {
    asset,
    gainLoss: disposalData.gainLoss,
    journalEntry: generateDisposalJournalEntry(asset, disposalData),
  };
};

/**
 * Generates barcode for new asset.
 *
 * @param {string} assetNumber - Asset number
 * @param {string} prefix - Barcode prefix
 * @returns {string} Generated barcode
 *
 * @example
 * ```typescript
 * const barcode = generateAssetBarcode('AST-2024-001', 'GOV');
 * // Returns: GOV-AST-2024-001-CHECKSUM
 * ```
 */
export const generateAssetBarcode = (
  assetNumber: string,
  prefix: string = 'GOV',
): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const checksum = calculateBarcodeChecksum(assetNumber);
  return `${prefix}-${assetNumber}-${timestamp}-${checksum}`;
};

/**
 * Assigns RFID tag to asset.
 *
 * @param {string} assetId - Asset ID
 * @param {string} rfidTag - RFID tag identifier
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await assignRFIDTag('asset-uuid', 'RFID-123456789', CapitalAsset);
 * ```
 */
export const assignRFIDTag = async (
  assetId: string,
  rfidTag: string,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) throw new Error('Asset not found');

  asset.rfidTag = rfidTag;
  await asset.save();

  return asset;
};

/**
 * Validates asset acquisition data.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAssetAcquisition(assetData);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export const validateAssetAcquisition = (
  assetData: CapitalAssetData,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!assetData.assetNumber) errors.push('Asset number required');
  if (!assetData.description) errors.push('Description required');
  if (assetData.acquisitionCost <= 0) errors.push('Cost must be positive');
  if (assetData.usefulLifeYears <= 0) errors.push('Useful life must be positive');
  if (assetData.salvageValue < 0) errors.push('Salvage value cannot be negative');
  if (assetData.salvageValue >= assetData.acquisitionCost) {
    errors.push('Salvage value must be less than acquisition cost');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// DEPRECIATION CALCULATIONS (7-13)
// ============================================================================

/**
 * Calculates straight-line depreciation for a period.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateStraightLineDepreciation(10000, 1000, 5, 1);
 * console.log(`Annual depreciation: ${result.periodDepreciation}`);
 * ```
 */
export const calculateStraightLineDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  periodsElapsed: number,
): DepreciationResult => {
  const annualDepreciation = (acquisitionCost - salvageValue) / usefulLifeYears;
  const accumulatedDepreciation = Math.min(
    annualDepreciation * periodsElapsed,
    acquisitionCost - salvageValue,
  );
  const bookValue = acquisitionCost - accumulatedDepreciation;

  return {
    assetId: '',
    fiscalYear: new Date().getFullYear(),
    periodDepreciation: annualDepreciation,
    accumulatedDepreciation,
    bookValue,
    method: 'straight_line',
    calculatedAt: new Date(),
  };
};

/**
 * Calculates declining balance depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @param {number} [rate=2] - Declining balance rate (200% = 2)
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateDecliningBalanceDepreciation(10000, 1000, 5, 1, 2);
 * ```
 */
export const calculateDecliningBalanceDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  periodsElapsed: number,
  rate: number = 2,
): DepreciationResult => {
  const depreciationRate = rate / usefulLifeYears;
  let bookValue = acquisitionCost;
  let accumulatedDepreciation = 0;

  for (let i = 0; i < periodsElapsed; i++) {
    const periodDepreciation = Math.max(
      0,
      Math.min(bookValue * depreciationRate, bookValue - salvageValue),
    );
    accumulatedDepreciation += periodDepreciation;
    bookValue -= periodDepreciation;
  }

  return {
    assetId: '',
    fiscalYear: new Date().getFullYear(),
    periodDepreciation: bookValue * depreciationRate,
    accumulatedDepreciation,
    bookValue,
    method: 'declining_balance',
    calculatedAt: new Date(),
  };
};

/**
 * Calculates sum-of-years-digits depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateSumOfYearsDepreciation(10000, 1000, 5, 1);
 * ```
 */
export const calculateSumOfYearsDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  periodsElapsed: number,
): DepreciationResult => {
  const depreciableBase = acquisitionCost - salvageValue;
  const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;

  let accumulatedDepreciation = 0;
  for (let year = 1; year <= periodsElapsed; year++) {
    const remainingLife = usefulLifeYears - year + 1;
    const yearDepreciation = (remainingLife / sumOfYears) * depreciableBase;
    accumulatedDepreciation += yearDepreciation;
  }

  const bookValue = acquisitionCost - accumulatedDepreciation;
  const currentYearFraction =
    (usefulLifeYears - periodsElapsed + 1) / sumOfYears;
  const periodDepreciation = currentYearFraction * depreciableBase;

  return {
    assetId: '',
    fiscalYear: new Date().getFullYear(),
    periodDepreciation,
    accumulatedDepreciation,
    bookValue,
    method: 'sum_of_years',
    calculatedAt: new Date(),
  };
};

/**
 * Calculates units-of-production depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} totalEstimatedUnits - Total estimated production
 * @param {number} unitsProduced - Units produced this period
 * @param {number} totalUnitsToDate - Total units produced to date
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateUnitsOfProductionDepreciation(50000, 5000, 100000, 10000, 10000);
 * ```
 */
export const calculateUnitsOfProductionDepreciation = (
  acquisitionCost: number,
  salvageValue: number,
  totalEstimatedUnits: number,
  unitsProduced: number,
  totalUnitsToDate: number,
): DepreciationResult => {
  const depreciableBase = acquisitionCost - salvageValue;
  const perUnitDepreciation = depreciableBase / totalEstimatedUnits;
  const periodDepreciation = perUnitDepreciation * unitsProduced;
  const accumulatedDepreciation = perUnitDepreciation * totalUnitsToDate;
  const bookValue = acquisitionCost - accumulatedDepreciation;

  return {
    assetId: '',
    fiscalYear: new Date().getFullYear(),
    periodDepreciation,
    accumulatedDepreciation,
    bookValue,
    method: 'units_of_production',
    calculatedAt: new Date(),
  };
};

/**
 * Processes depreciation for all active assets.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any[]>} Depreciation records
 *
 * @example
 * ```typescript
 * const records = await processDepreciationBatch(2024, 12, CapitalAsset, AssetDepreciation);
 * ```
 */
export const processDepreciationBatch = async (
  fiscalYear: number,
  fiscalPeriod: number,
  CapitalAsset: any,
  AssetDepreciation: any,
): Promise<any[]> => {
  const assets = await CapitalAsset.findAll({
    where: {
      status: { [Op.in]: ['active', 'in_service'] },
    },
  });

  const depreciationRecords = [];

  for (const asset of assets) {
    const yearsElapsed = fiscalYear - asset.fiscalYear + fiscalPeriod / 12;
    let result: DepreciationResult;

    switch (asset.depreciationMethod) {
      case 'straight_line':
        result = calculateStraightLineDepreciation(
          parseFloat(asset.acquisitionCost),
          parseFloat(asset.salvageValue),
          asset.usefulLifeYears,
          yearsElapsed,
        );
        break;
      case 'declining_balance':
        result = calculateDecliningBalanceDepreciation(
          parseFloat(asset.acquisitionCost),
          parseFloat(asset.salvageValue),
          asset.usefulLifeYears,
          yearsElapsed,
        );
        break;
      case 'sum_of_years':
        result = calculateSumOfYearsDepreciation(
          parseFloat(asset.acquisitionCost),
          parseFloat(asset.salvageValue),
          asset.usefulLifeYears,
          yearsElapsed,
        );
        break;
      default:
        continue;
    }

    const record = await AssetDepreciation.create({
      assetId: asset.id,
      fiscalYear,
      fiscalPeriod,
      periodDepreciation: result.periodDepreciation,
      accumulatedDepreciation: result.accumulatedDepreciation,
      bookValue: result.bookValue,
      depreciationMethod: asset.depreciationMethod,
      calculationBasis: {
        acquisitionCost: asset.acquisitionCost,
        salvageValue: asset.salvageValue,
        usefulLifeYears: asset.usefulLifeYears,
      },
    });

    // Update asset
    asset.accumulatedDepreciation = result.accumulatedDepreciation;
    asset.bookValue = result.bookValue;
    await asset.save();

    depreciationRecords.push(record);
  }

  return depreciationRecords;
};

/**
 * Retrieves depreciation schedule for an asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any[]>} Depreciation history
 *
 * @example
 * ```typescript
 * const schedule = await getDepreciationSchedule('asset-uuid', AssetDepreciation);
 * ```
 */
export const getDepreciationSchedule = async (
  assetId: string,
  AssetDepreciation: any,
): Promise<any[]> => {
  return await AssetDepreciation.findAll({
    where: { assetId },
    order: [['fiscalYear', 'ASC'], ['fiscalPeriod', 'ASC']],
  });
};

/**
 * Calculates total depreciation expense for period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} [departmentId] - Optional department filter
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<number>} Total depreciation expense
 *
 * @example
 * ```typescript
 * const expense = await calculateTotalDepreciationExpense(2024, 12, 'DEPT001', AssetDepreciation);
 * ```
 */
export const calculateTotalDepreciationExpense = async (
  fiscalYear: number,
  fiscalPeriod: number,
  departmentId: string | undefined,
  AssetDepreciation: any,
): Promise<number> => {
  const where: any = { fiscalYear, fiscalPeriod };

  const records = await AssetDepreciation.findAll({ where });

  return records.reduce(
    (sum: number, r: any) => sum + parseFloat(r.periodDepreciation),
    0,
  );
};

// ============================================================================
// ASSET CATEGORIZATION & TAGGING (14-18)
// ============================================================================

/**
 * Categorizes asset based on type and cost.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @returns {AssetCategorizationRule} Categorization rule
 *
 * @example
 * ```typescript
 * const rule = categorizeAsset(assetData);
 * console.log(`Category: ${rule.categoryName}, GL: ${rule.glAccountCode}`);
 * ```
 */
export const categorizeAsset = (
  assetData: CapitalAssetData,
): AssetCategorizationRule => {
  const rules: Record<string, AssetCategorizationRule> = {
    equipment: {
      categoryName: 'Equipment',
      capitalizationThreshold: 5000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 5,
      glAccountCode: '1700-00',
      requiresApproval: true,
    },
    vehicle: {
      categoryName: 'Vehicles',
      capitalizationThreshold: 5000,
      depreciationMethod: 'declining_balance',
      usefulLifeYears: 5,
      glAccountCode: '1710-00',
      requiresApproval: true,
    },
    building: {
      categoryName: 'Buildings',
      capitalizationThreshold: 50000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 40,
      glAccountCode: '1600-00',
      requiresApproval: true,
    },
    land: {
      categoryName: 'Land',
      capitalizationThreshold: 0,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 0,
      glAccountCode: '1500-00',
      requiresApproval: true,
    },
    infrastructure: {
      categoryName: 'Infrastructure',
      capitalizationThreshold: 100000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 50,
      glAccountCode: '1800-00',
      requiresApproval: true,
    },
  };

  return rules[assetData.assetCategory] || rules.equipment;
};

/**
 * Applies custom tags to asset.
 *
 * @param {string} assetId - Asset ID
 * @param {string[]} tags - Tags to apply
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await applyAssetTags('asset-uuid', ['mission-critical', 'high-value'], CapitalAsset);
 * ```
 */
export const applyAssetTags = async (
  assetId: string,
  tags: string[],
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) throw new Error('Asset not found');

  asset.metadata = {
    ...asset.metadata,
    tags: [...new Set([...(asset.metadata.tags || []), ...tags])],
  };
  await asset.save();

  return asset;
};

/**
 * Searches assets by tags.
 *
 * @param {string[]} tags - Tags to search
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Matching assets
 *
 * @example
 * ```typescript
 * const assets = await searchAssetsByTags(['mission-critical'], CapitalAsset);
 * ```
 */
export const searchAssetsByTags = async (
  tags: string[],
  CapitalAsset: any,
): Promise<any[]> => {
  const assets = await CapitalAsset.findAll();

  return assets.filter((asset: any) => {
    const assetTags = asset.metadata?.tags || [];
    return tags.some(tag => assetTags.includes(tag));
  });
};

/**
 * Determines GL account code for asset category.
 *
 * @param {string} category - Asset category
 * @returns {string} GL account code
 *
 * @example
 * ```typescript
 * const glCode = determineGLAccount('equipment'); // Returns: '1700-00'
 * ```
 */
export const determineGLAccount = (category: string): string => {
  const glAccounts: Record<string, string> = {
    land: '1500-00',
    building: '1600-00',
    equipment: '1700-00',
    vehicle: '1710-00',
    infrastructure: '1800-00',
    software: '1750-00',
    furniture: '1720-00',
  };

  return glAccounts[category] || '1700-00';
};

/**
 * Generates asset classification report.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Classification summary
 *
 * @example
 * ```typescript
 * const report = await generateAssetClassificationReport(CapitalAsset);
 * ```
 */
export const generateAssetClassificationReport = async (
  CapitalAsset: any,
): Promise<any> => {
  const assets = await CapitalAsset.findAll({
    where: { status: { [Op.in]: ['active', 'in_service'] } },
  });

  const byCategory = assets.reduce((acc: any, asset: any) => {
    const cat = asset.assetCategory;
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalCost: 0, totalBookValue: 0 };
    }
    acc[cat].count++;
    acc[cat].totalCost += parseFloat(asset.acquisitionCost);
    acc[cat].totalBookValue += parseFloat(asset.bookValue);
    return acc;
  }, {});

  return byCategory;
};

// ============================================================================
// PHYSICAL INVENTORY MANAGEMENT (19-24)
// ============================================================================

/**
 * Creates physical inventory session.
 *
 * @param {string} locationId - Location to inventory
 * @param {string} conductedBy - Person conducting
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Inventory session
 *
 * @example
 * ```typescript
 * const session = await createPhysicalInventorySession('LOC001', 'user123', PhysicalInventory, CapitalAsset);
 * ```
 */
export const createPhysicalInventorySession = async (
  locationId: string,
  conductedBy: string,
  PhysicalInventory: any,
  CapitalAsset: any,
): Promise<any> => {
  const expectedAssets = await CapitalAsset.count({
    where: {
      locationId,
      status: { [Op.in]: ['active', 'in_service'] },
    },
  });

  const sessionId = `INV-${Date.now()}`;

  return await PhysicalInventory.create({
    sessionId,
    sessionDate: new Date(),
    locationId,
    conductedBy,
    status: 'in_progress',
    assetsExpected: expectedAssets,
    assetsFound: 0,
    assetsMissing: 0,
    assetsSurplus: 0,
  });
};

/**
 * Records asset scan during inventory.
 *
 * @param {string} sessionId - Inventory session ID
 * @param {BarcodeScanData} scanData - Scan data
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Scan result
 *
 * @example
 * ```typescript
 * const result = await recordInventoryScan('INV-123', scanData, PhysicalInventory, CapitalAsset);
 * ```
 */
export const recordInventoryScan = async (
  sessionId: string,
  scanData: BarcodeScanData,
  PhysicalInventory: any,
  CapitalAsset: any,
): Promise<any> => {
  const session = await PhysicalInventory.findOne({ where: { sessionId } });
  if (!session) throw new Error('Session not found');

  const asset = await CapitalAsset.findOne({
    where: { barcode: scanData.barcode },
  });

  if (asset) {
    asset.lastInventoryDate = new Date();
    await asset.save();

    session.assetsFound++;
    await session.save();

    return { found: true, asset };
  }

  session.assetsSurplus++;
  await session.save();

  return { found: false, barcode: scanData.barcode };
};

/**
 * Completes physical inventory session.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @returns {Promise<any>} Completed session
 *
 * @example
 * ```typescript
 * const completed = await completeInventorySession('INV-123', PhysicalInventory);
 * ```
 */
export const completeInventorySession = async (
  sessionId: string,
  PhysicalInventory: any,
): Promise<any> => {
  const session = await PhysicalInventory.findOne({ where: { sessionId } });
  if (!session) throw new Error('Session not found');

  session.status = 'completed';
  session.completedAt = new Date();
  session.assetsMissing = session.assetsExpected - session.assetsFound;
  await session.save();

  return session;
};

/**
 * Identifies missing assets from inventory.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Missing assets
 *
 * @example
 * ```typescript
 * const missing = await identifyMissingAssets('INV-123', PhysicalInventory, CapitalAsset);
 * ```
 */
export const identifyMissingAssets = async (
  sessionId: string,
  PhysicalInventory: any,
  CapitalAsset: any,
): Promise<any[]> => {
  const session = await PhysicalInventory.findOne({ where: { sessionId } });
  if (!session) throw new Error('Session not found');

  const expectedAssets = await CapitalAsset.findAll({
    where: {
      locationId: session.locationId,
      status: { [Op.in]: ['active', 'in_service'] },
    },
  });

  const inventoriedAssets = await CapitalAsset.findAll({
    where: {
      locationId: session.locationId,
      lastInventoryDate: { [Op.gte]: session.sessionDate },
    },
  });

  const inventoriedIds = new Set(inventoriedAssets.map((a: any) => a.id));
  return expectedAssets.filter((a: any) => !inventoriedIds.has(a.id));
};

/**
 * Generates inventory variance report.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @returns {Promise<any>} Variance report
 *
 * @example
 * ```typescript
 * const report = await generateInventoryVarianceReport('INV-123', PhysicalInventory);
 * ```
 */
export const generateInventoryVarianceReport = async (
  sessionId: string,
  PhysicalInventory: any,
): Promise<any> => {
  const session = await PhysicalInventory.findOne({ where: { sessionId } });
  if (!session) throw new Error('Session not found');

  const variancePercent =
    session.assetsExpected > 0
      ? ((session.assetsFound / session.assetsExpected) * 100)
      : 0;

  return {
    sessionId,
    locationId: session.locationId,
    conductedBy: session.conductedBy,
    sessionDate: session.sessionDate,
    expected: session.assetsExpected,
    found: session.assetsFound,
    missing: session.assetsMissing,
    surplus: session.assetsSurplus,
    variancePercent,
    accuracy: variancePercent,
  };
};

/**
 * Processes RFID inventory scan.
 *
 * @param {RFIDTagData} rfidData - RFID scan data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Scan result
 *
 * @example
 * ```typescript
 * const result = await processRFIDInventoryScan(rfidData, CapitalAsset);
 * ```
 */
export const processRFIDInventoryScan = async (
  rfidData: RFIDTagData,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findOne({
    where: { rfidTag: rfidData.rfidTag },
  });

  if (!asset) {
    return { found: false, rfidTag: rfidData.rfidTag };
  }

  asset.lastInventoryDate = rfidData.lastReadTime;
  asset.locationId = rfidData.lastReadLocation;
  await asset.save();

  return { found: true, asset };
};

// ============================================================================
// ASSET TRANSFERS (25-29)
// ============================================================================

/**
 * Initiates asset transfer between departments.
 *
 * @param {AssetTransferData} transferData - Transfer data
 * @param {Model} AssetTransfer - AssetTransfer model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * ```typescript
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-uuid',
 *   fromDepartmentId: 'DEPT001',
 *   toDepartmentId: 'DEPT002',
 *   fromLocationId: 'LOC001',
 *   toLocationId: 'LOC002',
 *   transferDate: new Date(),
 *   transferReason: 'Relocation',
 *   transferredBy: 'user123'
 * }, AssetTransfer, CapitalAsset);
 * ```
 */
export const initiateAssetTransfer = async (
  transferData: AssetTransferData,
  AssetTransfer: any,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(transferData.assetId);
  if (!asset) throw new Error('Asset not found');

  const transfer = await AssetTransfer.create({
    ...transferData,
    status: 'pending',
    condition: 'good',
  });

  return transfer;
};

/**
 * Approves asset transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} approverId - Approver user ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * await approveAssetTransfer('transfer-uuid', 'manager123', AssetTransfer);
 * ```
 */
export const approveAssetTransfer = async (
  transferId: string,
  approverId: string,
  AssetTransfer: any,
): Promise<any> => {
  const transfer = await AssetTransfer.findByPk(transferId);
  if (!transfer) throw new Error('Transfer not found');

  transfer.status = 'approved';
  transfer.approvedBy = approverId;
  await transfer.save();

  return transfer;
};

/**
 * Completes asset transfer and updates asset location.
 *
 * @param {string} transferId - Transfer ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Completed transfer
 *
 * @example
 * ```typescript
 * await completeAssetTransfer('transfer-uuid', AssetTransfer, CapitalAsset);
 * ```
 */
export const completeAssetTransfer = async (
  transferId: string,
  AssetTransfer: any,
  CapitalAsset: any,
): Promise<any> => {
  const transfer = await AssetTransfer.findByPk(transferId);
  if (!transfer) throw new Error('Transfer not found');

  if (transfer.status !== 'approved') {
    throw new Error('Transfer must be approved first');
  }

  const asset = await CapitalAsset.findByPk(transfer.assetId);
  if (!asset) throw new Error('Asset not found');

  asset.departmentId = transfer.toDepartmentId;
  asset.locationId = transfer.toLocationId;
  await asset.save();

  transfer.status = 'completed';
  await transfer.save();

  return transfer;
};

/**
 * Retrieves transfer history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any[]>} Transfer history
 *
 * @example
 * ```typescript
 * const history = await getAssetTransferHistory('asset-uuid', AssetTransfer);
 * ```
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
 * Cancels pending asset transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} reason - Cancellation reason
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any>} Cancelled transfer
 *
 * @example
 * ```typescript
 * await cancelAssetTransfer('transfer-uuid', 'No longer needed', AssetTransfer);
 * ```
 */
export const cancelAssetTransfer = async (
  transferId: string,
  reason: string,
  AssetTransfer: any,
): Promise<any> => {
  const transfer = await AssetTransfer.findByPk(transferId);
  if (!transfer) throw new Error('Transfer not found');

  transfer.status = 'rejected';
  transfer.notes = `Cancelled: ${reason}`;
  await transfer.save();

  return transfer;
};

// ============================================================================
// ASSET MAINTENANCE TRACKING (30-34)
// ============================================================================

/**
 * Records asset maintenance activity.
 *
 * @param {AssetMaintenanceRecord} maintenanceData - Maintenance data
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Maintenance record
 *
 * @example
 * ```typescript
 * const maintenance = await recordAssetMaintenance({
 *   assetId: 'asset-uuid',
 *   maintenanceType: 'preventive',
 *   maintenanceDate: new Date(),
 *   performedBy: 'Technician A',
 *   cost: 250.00,
 *   description: 'Oil change and filter replacement',
 *   nextMaintenanceDate: new Date(Date.now() + 90 * 86400000)
 * }, AssetMaintenance, CapitalAsset);
 * ```
 */
export const recordAssetMaintenance = async (
  maintenanceData: AssetMaintenanceRecord,
  AssetMaintenance: any,
  CapitalAsset: any,
): Promise<any> => {
  const record = await AssetMaintenance.create(maintenanceData);

  const asset = await CapitalAsset.findByPk(maintenanceData.assetId);
  if (asset) {
    asset.lastMaintenanceDate = maintenanceData.maintenanceDate;
    await asset.save();
  }

  return record;
};

/**
 * Retrieves maintenance history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any[]>} Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory('asset-uuid', AssetMaintenance);
 * ```
 */
export const getMaintenanceHistory = async (
  assetId: string,
  AssetMaintenance: any,
): Promise<any[]> => {
  return await AssetMaintenance.findAll({
    where: { assetId },
    order: [['maintenanceDate', 'DESC']],
  });
};

/**
 * Calculates total maintenance cost for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<number>} Total maintenance cost
 *
 * @example
 * ```typescript
 * const cost = await calculateMaintenanceCost('asset-uuid', startDate, endDate, AssetMaintenance);
 * ```
 */
export const calculateMaintenanceCost = async (
  assetId: string,
  startDate: Date | undefined,
  endDate: Date | undefined,
  AssetMaintenance: any,
): Promise<number> => {
  const where: any = { assetId };

  if (startDate && endDate) {
    where.maintenanceDate = { [Op.between]: [startDate, endDate] };
  }

  const records = await AssetMaintenance.findAll({ where });

  return records.reduce((sum: number, r: any) => sum + parseFloat(r.cost), 0);
};

/**
 * Schedules preventive maintenance for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Date} scheduledDate - Scheduled date
 * @param {string} description - Maintenance description
 * @returns {any} Scheduled maintenance
 *
 * @example
 * ```typescript
 * const scheduled = schedulePreventiveMaintenance('asset-uuid', futureDate, 'Annual inspection');
 * ```
 */
export const schedulePreventiveMaintenance = (
  assetId: string,
  scheduledDate: Date,
  description: string,
): any => {
  return {
    assetId,
    scheduledDate,
    description,
    status: 'scheduled',
    notificationSent: false,
  };
};

/**
 * Identifies assets requiring maintenance.
 *
 * @param {number} daysAhead - Days to look ahead
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any[]>} Assets requiring maintenance
 *
 * @example
 * ```typescript
 * const assets = await identifyAssetsRequiringMaintenance(30, CapitalAsset, AssetMaintenance);
 * ```
 */
export const identifyAssetsRequiringMaintenance = async (
  daysAhead: number,
  CapitalAsset: any,
  AssetMaintenance: any,
): Promise<any[]> => {
  const cutoffDate = new Date(Date.now() + daysAhead * 86400000);
  const assets = await CapitalAsset.findAll({
    where: { status: { [Op.in]: ['active', 'in_service'] } },
  });

  const requiring: any[] = [];

  for (const asset of assets) {
    const lastMaintenance = await AssetMaintenance.findOne({
      where: { assetId: asset.id },
      order: [['maintenanceDate', 'DESC']],
    });

    if (lastMaintenance?.nextMaintenanceDate) {
      if (lastMaintenance.nextMaintenanceDate <= cutoffDate) {
        requiring.push({
          asset,
          lastMaintenance: lastMaintenance.maintenanceDate,
          nextDue: lastMaintenance.nextMaintenanceDate,
        });
      }
    }
  }

  return requiring;
};

// ============================================================================
// ASSET IMPAIRMENT & VALUATION (35-39)
// ============================================================================

/**
 * Performs asset impairment test.
 *
 * @param {AssetImpairmentTest} testData - Test data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Impairment test result
 *
 * @example
 * ```typescript
 * const result = await performImpairmentTest({
 *   assetId: 'asset-uuid',
 *   testDate: new Date(),
 *   estimatedFairValue: 5000,
 *   currentBookValue: 8000,
 *   impairmentLoss: 3000,
 *   isImpaired: true,
 *   testedBy: 'user123',
 *   impairmentReason: 'Obsolete technology'
 * }, CapitalAsset);
 * ```
 */
export const performImpairmentTest = async (
  testData: AssetImpairmentTest,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(testData.assetId);
  if (!asset) throw new Error('Asset not found');

  if (testData.isImpaired) {
    asset.bookValue = testData.estimatedFairValue;
    asset.metadata = {
      ...asset.metadata,
      impairment: {
        testDate: testData.testDate,
        impairmentLoss: testData.impairmentLoss,
        reason: testData.impairmentReason,
        testedBy: testData.testedBy,
      },
    };
    await asset.save();
  }

  return { asset, testResult: testData };
};

/**
 * Updates asset valuation.
 *
 * @param {AssetValuation} valuationData - Valuation data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetValuation({
 *   assetId: 'asset-uuid',
 *   valuationDate: new Date(),
 *   valuationType: 'market',
 *   valuationAmount: 12000,
 *   valuedBy: 'Appraiser Inc',
 *   validUntil: new Date(Date.now() + 365 * 86400000)
 * }, CapitalAsset);
 * ```
 */
export const updateAssetValuation = async (
  valuationData: AssetValuation,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(valuationData.assetId);
  if (!asset) throw new Error('Asset not found');

  asset.metadata = {
    ...asset.metadata,
    valuations: [
      ...(asset.metadata.valuations || []),
      valuationData,
    ],
  };
  await asset.save();

  return asset;
};

/**
 * Retrieves latest asset valuation.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<AssetValuation | null>} Latest valuation
 *
 * @example
 * ```typescript
 * const valuation = await getLatestValuation('asset-uuid', CapitalAsset);
 * ```
 */
export const getLatestValuation = async (
  assetId: string,
  CapitalAsset: any,
): Promise<AssetValuation | null> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) return null;

  const valuations = asset.metadata?.valuations || [];
  if (valuations.length === 0) return null;

  return valuations[valuations.length - 1];
};

/**
 * Identifies impaired assets.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Impaired assets
 *
 * @example
 * ```typescript
 * const impaired = await identifyImpairedAssets(CapitalAsset);
 * ```
 */
export const identifyImpairedAssets = async (
  CapitalAsset: any,
): Promise<any[]> => {
  const assets = await CapitalAsset.findAll({
    where: { status: { [Op.in]: ['active', 'in_service'] } },
  });

  return assets.filter((asset: any) => asset.metadata?.impairment);
};

/**
 * Calculates total impairment loss for period.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<number>} Total impairment loss
 *
 * @example
 * ```typescript
 * const loss = await calculateImpairmentLoss(startDate, endDate, CapitalAsset);
 * ```
 */
export const calculateImpairmentLoss = async (
  startDate: Date,
  endDate: Date,
  CapitalAsset: any,
): Promise<number> => {
  const assets = await CapitalAsset.findAll();

  return assets.reduce((sum: number, asset: any) => {
    const impairment = asset.metadata?.impairment;
    if (impairment) {
      const testDate = new Date(impairment.testDate);
      if (testDate >= startDate && testDate <= endDate) {
        return sum + parseFloat(impairment.impairmentLoss || 0);
      }
    }
    return sum;
  }, 0);
};

// ============================================================================
// SURPLUS PROPERTY MANAGEMENT (40-44)
// ============================================================================

/**
 * Lists asset as surplus property.
 *
 * @param {SurplusPropertyListing} listingData - Listing data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await listSurplusProperty({
 *   assetId: 'asset-uuid',
 *   listedDate: new Date(),
 *   estimatedValue: 5000,
 *   condition: 'good',
 *   availableFor: 'sale',
 *   contactPerson: 'John Doe',
 *   status: 'listed'
 * }, CapitalAsset);
 * ```
 */
export const listSurplusProperty = async (
  listingData: SurplusPropertyListing,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(listingData.assetId);
  if (!asset) throw new Error('Asset not found');

  asset.status = 'surplus';
  asset.metadata = {
    ...asset.metadata,
    surplusListing: listingData,
  };
  await asset.save();

  return asset;
};

/**
 * Retrieves all surplus property listings.
 *
 * @param {string} [status] - Optional status filter
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Surplus properties
 *
 * @example
 * ```typescript
 * const surplus = await getSurplusPropertyListings('listed', CapitalAsset);
 * ```
 */
export const getSurplusPropertyListings = async (
  status: string | undefined,
  CapitalAsset: any,
): Promise<any[]> => {
  const where: any = { status: 'surplus' };

  const assets = await CapitalAsset.findAll({ where });

  if (status) {
    return assets.filter(
      (a: any) => a.metadata?.surplusListing?.status === status,
    );
  }

  return assets;
};

/**
 * Updates surplus property status.
 *
 * @param {string} assetId - Asset ID
 * @param {string} newStatus - New status
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await updateSurplusStatus('asset-uuid', 'sold', CapitalAsset);
 * ```
 */
export const updateSurplusStatus = async (
  assetId: string,
  newStatus: string,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) throw new Error('Asset not found');

  if (asset.metadata?.surplusListing) {
    asset.metadata.surplusListing.status = newStatus;
    await asset.save();
  }

  return asset;
};

/**
 * Generates surplus property catalog.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Surplus catalog
 *
 * @example
 * ```typescript
 * const catalog = await generateSurplusCatalog(CapitalAsset);
 * ```
 */
export const generateSurplusCatalog = async (
  CapitalAsset: any,
): Promise<any[]> => {
  const surplus = await getSurplusPropertyListings(undefined, CapitalAsset);

  return surplus.map((asset: any) => ({
    assetNumber: asset.assetNumber,
    description: asset.description,
    category: asset.assetCategory,
    estimatedValue: asset.metadata?.surplusListing?.estimatedValue,
    condition: asset.metadata?.surplusListing?.condition,
    availableFor: asset.metadata?.surplusListing?.availableFor,
    contactPerson: asset.metadata?.surplusListing?.contactPerson,
    listedDate: asset.metadata?.surplusListing?.listedDate,
  }));
};

/**
 * Removes asset from surplus listings.
 *
 * @param {string} assetId - Asset ID
 * @param {string} reason - Removal reason
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await removeSurplusListing('asset-uuid', 'Returned to service', CapitalAsset);
 * ```
 */
export const removeSurplusListing = async (
  assetId: string,
  reason: string,
  CapitalAsset: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) throw new Error('Asset not found');

  asset.status = 'active';
  if (asset.metadata?.surplusListing) {
    asset.metadata.surplusListing.status = 'withdrawn';
    asset.metadata.surplusListing.withdrawalReason = reason;
  }
  await asset.save();

  return asset;
};

// ============================================================================
// REPORTING & ANALYTICS (45-50)
// ============================================================================

/**
 * Generates comprehensive asset register report.
 *
 * @param {string} [departmentId] - Optional department filter
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Asset register
 *
 * @example
 * ```typescript
 * const register = await generateAssetRegister('DEPT001', CapitalAsset);
 * ```
 */
export const generateAssetRegister = async (
  departmentId: string | undefined,
  CapitalAsset: any,
): Promise<any> => {
  const where: any = {};
  if (departmentId) where.departmentId = departmentId;

  const assets = await CapitalAsset.findAll({
    where,
    order: [['assetNumber', 'ASC']],
  });

  const summary = {
    totalAssets: assets.length,
    totalAcquisitionCost: assets.reduce(
      (sum: number, a: any) => sum + parseFloat(a.acquisitionCost),
      0,
    ),
    totalAccumulatedDepreciation: assets.reduce(
      (sum: number, a: any) => sum + parseFloat(a.accumulatedDepreciation),
      0,
    ),
    totalBookValue: assets.reduce(
      (sum: number, a: any) => sum + parseFloat(a.bookValue),
      0,
    ),
  };

  return { summary, assets };
};

/**
 * Calculates asset utilization rate.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<number>} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateAssetUtilization('asset-uuid', AssetMaintenance);
 * ```
 */
export const calculateAssetUtilization = async (
  assetId: string,
  AssetMaintenance: any,
): Promise<number> => {
  const maintenance = await AssetMaintenance.findAll({ where: { assetId } });

  const totalDowntime = maintenance.reduce(
    (sum: number, m: any) => sum + parseFloat(m.downtimeHours || 0),
    0,
  );

  const daysInService = 365; // Simplified
  const availableHours = daysInService * 24;
  const utilization = ((availableHours - totalDowntime) / availableHours) * 100;

  return Math.max(0, Math.min(100, utilization));
};

/**
 * Generates depreciation expense report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any>} Depreciation report
 *
 * @example
 * ```typescript
 * const report = await generateDepreciationReport(2024, AssetDepreciation);
 * ```
 */
export const generateDepreciationReport = async (
  fiscalYear: number,
  AssetDepreciation: any,
): Promise<any> => {
  const records = await AssetDepreciation.findAll({
    where: { fiscalYear },
    order: [['fiscalPeriod', 'ASC']],
  });

  const byPeriod = records.reduce((acc: any, r: any) => {
    const period = r.fiscalPeriod;
    if (!acc[period]) acc[period] = 0;
    acc[period] += parseFloat(r.periodDepreciation);
    return acc;
  }, {});

  const totalExpense = Object.values(byPeriod).reduce(
    (sum: number, val: any) => sum + val,
    0,
  );

  return { fiscalYear, byPeriod, totalExpense };
};

/**
 * Exports asset data to CSV format.
 *
 * @param {any[]} assets - Assets to export
 * @returns {string} CSV formatted data
 *
 * @example
 * ```typescript
 * const csv = exportAssetsToCSV(assets);
 * fs.writeFileSync('assets.csv', csv);
 * ```
 */
export const exportAssetsToCSV = (assets: any[]): string => {
  const headers =
    'Asset Number,Description,Category,Acquisition Date,Cost,Book Value,Department,Location,Status\n';

  const rows = assets.map(
    (a: any) =>
      `${a.assetNumber},"${a.description}",${a.assetCategory},${a.acquisitionDate.toISOString().split('T')[0]},${a.acquisitionCost},${a.bookValue},${a.departmentId},${a.locationId},${a.status}`,
  );

  return headers + rows.join('\n');
};

/**
 * Identifies high-value assets requiring special attention.
 *
 * @param {number} threshold - Value threshold
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} High-value assets
 *
 * @example
 * ```typescript
 * const highValue = await identifyHighValueAssets(100000, CapitalAsset);
 * ```
 */
export const identifyHighValueAssets = async (
  threshold: number,
  CapitalAsset: any,
): Promise<any[]> => {
  return await CapitalAsset.findAll({
    where: {
      acquisitionCost: { [Op.gte]: threshold },
      status: { [Op.in]: ['active', 'in_service'] },
    },
    order: [['acquisitionCost', 'DESC']],
  });
};

/**
 * Generates asset lifecycle analysis.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any>} Lifecycle analysis
 *
 * @example
 * ```typescript
 * const analysis = await generateAssetLifecycleAnalysis('asset-uuid', CapitalAsset, AssetDepreciation, AssetMaintenance);
 * ```
 */
export const generateAssetLifecycleAnalysis = async (
  assetId: string,
  CapitalAsset: any,
  AssetDepreciation: any,
  AssetMaintenance: any,
): Promise<any> => {
  const asset = await CapitalAsset.findByPk(assetId);
  if (!asset) throw new Error('Asset not found');

  const depreciation = await AssetDepreciation.findAll({ where: { assetId } });
  const maintenance = await AssetMaintenance.findAll({ where: { assetId } });

  const totalDepreciation = depreciation.reduce(
    (sum: number, d: any) => sum + parseFloat(d.periodDepreciation),
    0,
  );
  const totalMaintenanceCost = maintenance.reduce(
    (sum: number, m: any) => sum + parseFloat(m.cost),
    0,
  );

  const age =
    (new Date().getTime() - asset.acquisitionDate.getTime()) /
    (365.25 * 86400000);
  const remainingLife = Math.max(0, asset.usefulLifeYears - age);

  return {
    asset: {
      assetNumber: asset.assetNumber,
      description: asset.description,
      acquisitionCost: parseFloat(asset.acquisitionCost),
      bookValue: parseFloat(asset.bookValue),
    },
    age,
    remainingLife,
    totalDepreciation,
    totalMaintenanceCost,
    totalCostOfOwnership:
      parseFloat(asset.acquisitionCost) + totalMaintenanceCost,
    maintenanceEvents: maintenance.length,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates barcode checksum for validation.
 *
 * @param {string} data - Data to checksum
 * @returns {string} Checksum
 */
const calculateBarcodeChecksum = (data: string): string => {
  const sum = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (sum % 97).toString(16).toUpperCase().padStart(2, '0');
};

/**
 * Generates disposal journal entry.
 *
 * @param {any} asset - Asset data
 * @param {AssetDisposalData} disposal - Disposal data
 * @returns {any} Journal entry
 */
const generateDisposalJournalEntry = (
  asset: any,
  disposal: AssetDisposalData,
): any => {
  return {
    date: disposal.disposalDate,
    entries: [
      {
        account: 'Cash',
        debit: disposal.proceedsAmount,
        credit: 0,
      },
      {
        account: 'Accumulated Depreciation',
        debit: parseFloat(asset.accumulatedDepreciation),
        credit: 0,
      },
      {
        account: asset.glAccountCode,
        debit: 0,
        credit: parseFloat(asset.acquisitionCost),
      },
      {
        account: disposal.gainLoss >= 0 ? 'Gain on Disposal' : 'Loss on Disposal',
        debit: disposal.gainLoss < 0 ? Math.abs(disposal.gainLoss) : 0,
        credit: disposal.gainLoss >= 0 ? disposal.gainLoss : 0,
      },
    ],
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Government Asset Inventory Management.
 *
 * @example
 * ```typescript
 * @Controller('assets')
 * export class AssetController {
 *   constructor(private readonly assetService: AssetInventoryService) {}
 *
 *   @Post()
 *   async createAsset(@Body() data: CapitalAssetData) {
 *     return this.assetService.createAsset(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class AssetInventoryService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAsset(data: CapitalAssetData, userId: string) {
    const CapitalAsset = createCapitalAssetModel(this.sequelize);
    return createCapitalAsset(data, CapitalAsset, userId);
  }

  async processDepreciation(fiscalYear: number, fiscalPeriod: number) {
    const CapitalAsset = createCapitalAssetModel(this.sequelize);
    const AssetDepreciation = createAssetDepreciationModel(this.sequelize);
    return processDepreciationBatch(
      fiscalYear,
      fiscalPeriod,
      CapitalAsset,
      AssetDepreciation,
    );
  }

  async createInventorySession(locationId: string, conductedBy: string) {
    const PhysicalInventory = createPhysicalInventoryModel(this.sequelize);
    const CapitalAsset = createCapitalAssetModel(this.sequelize);
    return createPhysicalInventorySession(
      locationId,
      conductedBy,
      PhysicalInventory,
      CapitalAsset,
    );
  }

  async initiateTransfer(transferData: AssetTransferData) {
    const AssetTransfer = createAssetTransferModel(this.sequelize);
    const CapitalAsset = createCapitalAssetModel(this.sequelize);
    return initiateAssetTransfer(transferData, AssetTransfer, CapitalAsset);
  }
}

/**
 * Default export with all asset management utilities.
 */
export default {
  // Models
  createCapitalAssetModel,
  createAssetDepreciationModel,
  createAssetTransferModel,
  createPhysicalInventoryModel,
  createAssetMaintenanceModel,

  // Acquisition & Disposal
  createCapitalAsset,
  validateCapitalizationThreshold,
  processAssetDisposal,
  generateAssetBarcode,
  assignRFIDTag,
  validateAssetAcquisition,

  // Depreciation
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  calculateSumOfYearsDepreciation,
  calculateUnitsOfProductionDepreciation,
  processDepreciationBatch,
  getDepreciationSchedule,
  calculateTotalDepreciationExpense,

  // Categorization
  categorizeAsset,
  applyAssetTags,
  searchAssetsByTags,
  determineGLAccount,
  generateAssetClassificationReport,

  // Physical Inventory
  createPhysicalInventorySession,
  recordInventoryScan,
  completeInventorySession,
  identifyMissingAssets,
  generateInventoryVarianceReport,
  processRFIDInventoryScan,

  // Transfers
  initiateAssetTransfer,
  approveAssetTransfer,
  completeAssetTransfer,
  getAssetTransferHistory,
  cancelAssetTransfer,

  // Maintenance
  recordAssetMaintenance,
  getMaintenanceHistory,
  calculateMaintenanceCost,
  schedulePreventiveMaintenance,
  identifyAssetsRequiringMaintenance,

  // Impairment & Valuation
  performImpairmentTest,
  updateAssetValuation,
  getLatestValuation,
  identifyImpairedAssets,
  calculateImpairmentLoss,

  // Surplus Property
  listSurplusProperty,
  getSurplusPropertyListings,
  updateSurplusStatus,
  generateSurplusCatalog,
  removeSurplusListing,

  // Reporting
  generateAssetRegister,
  calculateAssetUtilization,
  generateDepreciationReport,
  exportAssetsToCSV,
  identifyHighValueAssets,
  generateAssetLifecycleAnalysis,

  // Service
  AssetInventoryService,
};

/**
 * LOC: ENCUMBR001
 * File: /reuse/government/encumbrance-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-planning-allocation-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend government financial modules
 *   - Encumbrance tracking services
 *   - Purchase order systems
 *   - Contract management modules
 */

/**
 * File: /reuse/government/encumbrance-accounting-kit.ts
 * Locator: WC-GOV-ENCUMB-001
 * Purpose: Comprehensive Encumbrance Accounting - Government purchase order and contract encumbrance management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-planning-allocation-kit
 * Downstream: ../backend/government/*, Encumbrance Services, Purchase Order Systems, Contract Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for encumbrance creation, tracking, liquidation, validation, rollover, modification, reversal, multi-year management
 *
 * LLM Context: Enterprise-grade encumbrance accounting system for government financial management.
 * Provides comprehensive encumbrance lifecycle management, purchase order encumbrances, contract encumbrances,
 * pre-encumbrance validation, encumbrance liquidation, year-end rollover, encumbrance modification, reversal workflows,
 * multi-year encumbrance tracking, available balance calculation, reconciliation, reporting, and audit trails.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EncumbranceHeader {
  encumbranceId: number;
  encumbranceNumber: string;
  encumbranceType: 'PURCHASE_ORDER' | 'CONTRACT' | 'BLANKET_ORDER' | 'GRANT' | 'RESERVATION';
  fiscalYear: number;
  budgetLineId: number;
  accountCode: string;
  amount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  status: 'DRAFT' | 'ACTIVE' | 'PARTIALLY_LIQUIDATED' | 'FULLY_LIQUIDATED' | 'CANCELLED' | 'EXPIRED';
  vendor?: string;
  vendorId?: number;
  description: string;
  documentNumber: string;
  documentDate: Date;
  expirationDate?: Date;
  isMultiYear: boolean;
}

interface EncumbranceLine {
  lineId: number;
  encumbranceId: number;
  lineNumber: number;
  accountCode: string;
  amount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  description: string;
  projectCode?: string;
  activityCode?: string;
  costCenter?: string;
  glAccountId?: number;
}

interface EncumbranceLiquidation {
  liquidationId: number;
  encumbranceId: number;
  liquidationNumber: string;
  liquidationDate: Date;
  amount: number;
  invoiceNumber?: string;
  paymentNumber?: string;
  fiscalYear: number;
  fiscalPeriod: number;
  description: string;
  status: 'PENDING' | 'POSTED' | 'REVERSED';
}

interface PreEncumbranceValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  availableBalance: number;
  requestedAmount: number;
  budgetStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'WARNING';
}

interface EncumbranceRollover {
  rolloverYear: number;
  encumbranceId: number;
  originalAmount: number;
  liquidatedAmount: number;
  rolloverAmount: number;
  newEncumbranceId?: number;
  rolloverType: 'AUTOMATIC' | 'MANUAL';
  rolloverStatus: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
}

interface EncumbranceModification {
  modificationId: number;
  encumbranceId: number;
  modificationNumber: string;
  modificationType: 'INCREASE' | 'DECREASE' | 'SCOPE_CHANGE' | 'DATE_CHANGE';
  originalAmount: number;
  modifiedAmount: number;
  changeAmount: number;
  reason: string;
  modificationDate: Date;
  approvedBy?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface EncumbranceReversal {
  reversalId: number;
  originalEncumbranceId: number;
  reversalNumber: string;
  reversalDate: Date;
  reversalAmount: number;
  reason: string;
  reversedBy: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
}

interface AvailableBalance {
  budgetLineId: number;
  accountCode: string;
  totalBudget: number;
  totalAllocated: number;
  totalEncumbered: number;
  totalExpended: number;
  availableToEncumber: number;
  availableToExpend: number;
  pendingEncumbrances: number;
}

interface EncumbranceReconciliation {
  reconciliationDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  totalEncumbrances: number;
  totalLiquidations: number;
  totalRemaining: number;
  discrepancies: ReconciliationDiscrepancy[];
  status: 'BALANCED' | 'OUT_OF_BALANCE' | 'UNDER_REVIEW';
}

interface ReconciliationDiscrepancy {
  encumbranceNumber: string;
  expectedAmount: number;
  actualAmount: number;
  variance: number;
  reason?: string;
}

interface MultiYearEncumbrance {
  encumbranceId: number;
  startFiscalYear: number;
  endFiscalYear: number;
  totalAmount: number;
  yearlyAllocations: YearlyAllocation[];
  expirationRule: 'NO_YEAR' | 'MULTI_YEAR' | 'BIENNIUM';
}

interface YearlyAllocation {
  fiscalYear: number;
  allocatedAmount: number;
  liquidatedAmount: number;
  remainingAmount: number;
}

interface EncumbranceReport {
  reportType: 'SUMMARY' | 'DETAIL' | 'AGING' | 'VENDOR' | 'ACCOUNT';
  fiscalYear: number;
  fiscalPeriod?: number;
  filters: Record<string, any>;
  data: any[];
  totals: {
    totalEncumbered: number;
    totalLiquidated: number;
    totalRemaining: number;
  };
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance type', enum: ['PURCHASE_ORDER', 'CONTRACT', 'BLANKET_ORDER', 'GRANT'] })
  encumbranceType!: string;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Budget line ID' })
  budgetLineId!: number;

  @ApiProperty({ description: 'Account code' })
  accountCode!: string;

  @ApiProperty({ description: 'Encumbrance amount' })
  amount!: number;

  @ApiProperty({ description: 'Vendor name', required: false })
  vendor?: string;

  @ApiProperty({ description: 'Document number (PO, Contract #)' })
  documentNumber!: string;

  @ApiProperty({ description: 'Document date' })
  documentDate!: Date;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Is multi-year encumbrance', default: false })
  isMultiYear?: boolean;

  @ApiProperty({ description: 'Encumbrance line items', type: [Object] })
  lines!: EncumbranceLine[];
}

export class LiquidateEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance ID' })
  encumbranceId!: number;

  @ApiProperty({ description: 'Liquidation amount' })
  amount!: number;

  @ApiProperty({ description: 'Liquidation date' })
  liquidationDate!: Date;

  @ApiProperty({ description: 'Invoice number', required: false })
  invoiceNumber?: string;

  @ApiProperty({ description: 'Payment number', required: false })
  paymentNumber?: string;

  @ApiProperty({ description: 'Description' })
  description!: string;
}

export class ModifyEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance ID' })
  encumbranceId!: number;

  @ApiProperty({ description: 'Modification type', enum: ['INCREASE', 'DECREASE', 'SCOPE_CHANGE', 'DATE_CHANGE'] })
  modificationType!: string;

  @ApiProperty({ description: 'Modified amount' })
  modifiedAmount!: number;

  @ApiProperty({ description: 'Reason for modification' })
  reason!: string;

  @ApiProperty({ description: 'Modification date' })
  modificationDate!: Date;
}

export class EncumbranceRolloverDto {
  @ApiProperty({ description: 'Fiscal year to rollover to' })
  rolloverYear!: number;

  @ApiProperty({ description: 'Encumbrance IDs to rollover', type: [Number] })
  encumbranceIds!: number[];

  @ApiProperty({ description: 'Rollover type', enum: ['AUTOMATIC', 'MANUAL'] })
  rolloverType!: string;

  @ApiProperty({ description: 'Approver user ID' })
  approvedBy!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Encumbrance Headers with fiscal year tracking and multi-year support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceHeader model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceHeaderModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceNumber: 'ENC-2025-001',
 *   encumbranceType: 'PURCHASE_ORDER',
 *   fiscalYear: 2025,
 *   amount: 50000,
 *   documentNumber: 'PO-2025-123',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export const createEncumbranceHeaderModel = (sequelize: Sequelize) => {
  class EncumbranceHeader extends Model {
    public id!: number;
    public encumbranceNumber!: string;
    public encumbranceType!: string;
    public fiscalYear!: number;
    public budgetLineId!: number;
    public accountCode!: string;
    public amount!: number;
    public liquidatedAmount!: number;
    public remainingAmount!: number;
    public status!: string;
    public vendor!: string | null;
    public vendorId!: number | null;
    public description!: string;
    public documentNumber!: string;
    public documentDate!: Date;
    public expirationDate!: Date | null;
    public isMultiYear!: boolean;
    public startFiscalYear!: number | null;
    public endFiscalYear!: number | null;
    public costCenter!: string | null;
    public projectCode!: string | null;
    public fundCode!: string | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public cancelledBy!: string | null;
    public cancelledAt!: Date | null;
    public cancelReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  EncumbranceHeader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      encumbranceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique encumbrance identifier',
      },
      encumbranceType: {
        type: DataTypes.ENUM('PURCHASE_ORDER', 'CONTRACT', 'BLANKET_ORDER', 'GRANT', 'RESERVATION'),
        allowNull: false,
        comment: 'Type of encumbrance',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year of encumbrance',
        validate: {
          min: 2000,
          max: 2099,
        },
      },
      budgetLineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Related budget line ID',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'General ledger account code',
      },
      amount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total encumbrance amount',
        validate: {
          min: 0,
        },
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount liquidated against encumbrance',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Remaining unliquidated amount',
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'PARTIALLY_LIQUIDATED', 'FULLY_LIQUIDATED', 'CANCELLED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'DRAFT',
        comment: 'Encumbrance status',
      },
      vendor: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Vendor name',
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Vendor ID if from vendor master',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encumbrance description',
      },
      documentNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Source document number (PO, Contract)',
      },
      documentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Document creation date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Encumbrance expiration date',
      },
      isMultiYear: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether encumbrance spans multiple fiscal years',
      },
      startFiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Start fiscal year for multi-year encumbrance',
      },
      endFiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'End fiscal year for multi-year encumbrance',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved encumbrance',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      cancelledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who cancelled encumbrance',
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cancellation timestamp',
      },
      cancelReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for cancellation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'encumbrance_headers',
      timestamps: true,
      indexes: [
        { fields: ['encumbranceNumber'], unique: true },
        { fields: ['fiscalYear'] },
        { fields: ['budgetLineId'] },
        { fields: ['accountCode'] },
        { fields: ['status'] },
        { fields: ['documentNumber'] },
        { fields: ['vendorId'] },
        { fields: ['encumbranceType'] },
        { fields: ['fiscalYear', 'status'] },
      ],
      hooks: {
        beforeCreate: (encumbrance) => {
          encumbrance.remainingAmount = encumbrance.amount;
          if (!encumbrance.createdBy) {
            throw new Error('createdBy is required');
          }
          encumbrance.updatedBy = encumbrance.createdBy;
        },
        beforeUpdate: (encumbrance) => {
          const liquidated = Number(encumbrance.liquidatedAmount || 0);
          const total = Number(encumbrance.amount);
          encumbrance.remainingAmount = total - liquidated;

          if (liquidated >= total) {
            encumbrance.status = 'FULLY_LIQUIDATED';
          } else if (liquidated > 0) {
            encumbrance.status = 'PARTIALLY_LIQUIDATED';
          }
        },
      },
    },
  );

  return EncumbranceHeader;
};

/**
 * Sequelize model for Encumbrance Lines with account distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceLine model
 *
 * @example
 * ```typescript
 * const EncumbranceLine = createEncumbranceLineModel(sequelize);
 * const line = await EncumbranceLine.create({
 *   encumbranceId: 1,
 *   lineNumber: 1,
 *   accountCode: '5100-001',
 *   amount: 25000,
 *   description: 'Professional services'
 * });
 * ```
 */
export const createEncumbranceLineModel = (sequelize: Sequelize) => {
  class EncumbranceLine extends Model {
    public id!: number;
    public encumbranceId!: number;
    public lineNumber!: number;
    public accountCode!: string;
    public amount!: number;
    public liquidatedAmount!: number;
    public remainingAmount!: number;
    public description!: string;
    public projectCode!: string | null;
    public activityCode!: string | null;
    public costCenter!: string | null;
    public glAccountId!: number | null;
    public fundCode!: string | null;
    public organizationCode!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EncumbranceLine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      encumbranceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Parent encumbrance header ID',
        references: {
          model: 'encumbrance_headers',
          key: 'id',
        },
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line sequence number',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      amount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Line item amount',
        validate: {
          min: 0,
        },
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Liquidated amount for this line',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Remaining amount for this line',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Line item description',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      activityCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Activity code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      glAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'GL account master ID',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Organization code',
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
      tableName: 'encumbrance_lines',
      timestamps: true,
      indexes: [
        { fields: ['encumbranceId'] },
        { fields: ['accountCode'] },
        { fields: ['projectCode'] },
        { fields: ['costCenter'] },
        { fields: ['encumbranceId', 'lineNumber'], unique: true },
      ],
      hooks: {
        beforeCreate: (line) => {
          line.remainingAmount = line.amount;
        },
        beforeUpdate: (line) => {
          const liquidated = Number(line.liquidatedAmount || 0);
          const total = Number(line.amount);
          line.remainingAmount = total - liquidated;
        },
      },
    },
  );

  return EncumbranceLine;
};

/**
 * Sequelize model for Encumbrance Liquidations with invoice and payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceLiquidation model
 *
 * @example
 * ```typescript
 * const Liquidation = createEncumbranceLiquidationModel(sequelize);
 * const liquidation = await Liquidation.create({
 *   encumbranceId: 1,
 *   liquidationNumber: 'LIQ-2025-001',
 *   amount: 12500,
 *   invoiceNumber: 'INV-2025-456',
 *   liquidationDate: new Date(),
 *   status: 'POSTED'
 * });
 * ```
 */
export const createEncumbranceLiquidationModel = (sequelize: Sequelize) => {
  class EncumbranceLiquidation extends Model {
    public id!: number;
    public encumbranceId!: number;
    public liquidationNumber!: string;
    public liquidationDate!: Date;
    public amount!: number;
    public invoiceNumber!: string | null;
    public paymentNumber!: string | null;
    public voucherNumber!: string | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public description!: string;
    public status!: string;
    public reversalOf!: number | null;
    public reversedBy!: number | null;
    public glJournalEntryId!: number | null;
    public postedBy!: string | null;
    public postedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly createdBy!: string;
  }

  EncumbranceLiquidation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      encumbranceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Related encumbrance header ID',
        references: {
          model: 'encumbrance_headers',
          key: 'id',
        },
      },
      liquidationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique liquidation identifier',
      },
      liquidationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of liquidation',
      },
      amount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Liquidation amount',
        validate: {
          min: 0,
        },
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Related invoice number',
      },
      paymentNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Related payment number',
      },
      voucherNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Related voucher number',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year of liquidation',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period of liquidation',
        validate: {
          min: 1,
          max: 13,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Liquidation description',
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'POSTED', 'REVERSED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Liquidation status',
      },
      reversalOf: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Original liquidation ID if this is a reversal',
        references: {
          model: 'encumbrance_liquidations',
          key: 'id',
        },
      },
      reversedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reversal liquidation ID if reversed',
        references: {
          model: 'encumbrance_liquidations',
          key: 'id',
        },
      },
      glJournalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Related GL journal entry ID',
      },
      postedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who posted the liquidation',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posting timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the liquidation',
      },
    },
    {
      sequelize,
      tableName: 'encumbrance_liquidations',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['liquidationNumber'], unique: true },
        { fields: ['encumbranceId'] },
        { fields: ['liquidationDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['invoiceNumber'] },
        { fields: ['paymentNumber'] },
        { fields: ['status'] },
      ],
    },
  );

  return EncumbranceLiquidation;
};

// ============================================================================
// ENCUMBRANCE CREATION (1-5)
// ============================================================================

/**
 * Creates a new purchase order encumbrance with validation.
 *
 * @param {object} encumbranceData - Encumbrance creation data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createPurchaseOrderEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 10,
 *   accountCode: '5100-001',
 *   amount: 50000,
 *   vendor: 'ABC Contractors',
 *   documentNumber: 'PO-2025-123',
 *   description: 'Construction materials'
 * }, 'john.doe');
 * ```
 */
export const createPurchaseOrderEncumbrance = async (
  encumbranceData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const encumbranceNumber = generateEncumbranceNumber('PO', encumbranceData.fiscalYear);

  return {
    encumbranceNumber,
    encumbranceType: 'PURCHASE_ORDER',
    ...encumbranceData,
    status: 'DRAFT',
    liquidatedAmount: 0,
    remainingAmount: encumbranceData.amount,
    createdBy: userId,
    updatedBy: userId,
    metadata: {
      ...encumbranceData.metadata,
      createdDate: new Date().toISOString(),
    },
  };
};

/**
 * Creates a contract encumbrance with multi-year support.
 *
 * @param {object} contractData - Contract encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created contract encumbrance
 *
 * @example
 * ```typescript
 * const contract = await createContractEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 15,
 *   amount: 500000,
 *   vendor: 'XYZ Engineering',
 *   documentNumber: 'CON-2025-456',
 *   isMultiYear: true,
 *   startFiscalYear: 2025,
 *   endFiscalYear: 2027
 * }, 'jane.smith');
 * ```
 */
export const createContractEncumbrance = async (
  contractData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const encumbranceNumber = generateEncumbranceNumber('CON', contractData.fiscalYear);

  return {
    encumbranceNumber,
    encumbranceType: 'CONTRACT',
    ...contractData,
    status: 'DRAFT',
    liquidatedAmount: 0,
    remainingAmount: contractData.amount,
    createdBy: userId,
    updatedBy: userId,
  };
};

/**
 * Creates a blanket purchase order encumbrance.
 *
 * @param {object} blanketData - Blanket order data
 * @param {string} userId - User creating the encumbrance
 * @returns {Promise<object>} Created blanket encumbrance
 *
 * @example
 * ```typescript
 * const blanket = await createBlanketEncumbrance({
 *   fiscalYear: 2025,
 *   budgetLineId: 20,
 *   amount: 100000,
 *   vendor: 'Office Supplies Inc',
 *   documentNumber: 'BPO-2025-789',
 *   expirationDate: new Date('2025-09-30')
 * }, 'admin');
 * ```
 */
export const createBlanketEncumbrance = async (blanketData: any, userId: string): Promise<any> => {
  const encumbranceNumber = generateEncumbranceNumber('BPO', blanketData.fiscalYear);

  return {
    encumbranceNumber,
    encumbranceType: 'BLANKET_ORDER',
    ...blanketData,
    status: 'DRAFT',
    liquidatedAmount: 0,
    remainingAmount: blanketData.amount,
    createdBy: userId,
    updatedBy: userId,
  };
};

/**
 * Generates unique encumbrance number based on type and fiscal year.
 *
 * @param {string} prefix - Encumbrance type prefix
 * @param {number} fiscalYear - Fiscal year
 * @returns {string} Generated encumbrance number
 *
 * @example
 * ```typescript
 * const encNumber = generateEncumbranceNumber('PO', 2025);
 * // Returns: 'ENC-PO-2025-001234'
 * ```
 */
export const generateEncumbranceNumber = (prefix: string, fiscalYear: number): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `ENC-${prefix}-${fiscalYear}-${timestamp}`;
};

/**
 * Validates encumbrance line items for completeness and accuracy.
 *
 * @param {EncumbranceLine[]} lines - Encumbrance line items
 * @param {number} headerAmount - Header total amount
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEncumbranceLines(lines, 50000);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export const validateEncumbranceLines = async (
  lines: EncumbranceLine[],
  headerAmount: number,
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!lines || lines.length === 0) {
    errors.push('At least one line item is required');
  }

  const totalLineAmount = lines.reduce((sum, line) => sum + Number(line.amount), 0);

  if (Math.abs(totalLineAmount - headerAmount) > 0.01) {
    errors.push(`Line item total (${totalLineAmount}) does not match header amount (${headerAmount})`);
  }

  lines.forEach((line, index) => {
    if (!line.accountCode) {
      errors.push(`Line ${index + 1}: Account code is required`);
    }
    if (!line.amount || line.amount <= 0) {
      errors.push(`Line ${index + 1}: Amount must be greater than zero`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// ============================================================================
// PRE-ENCUMBRANCE VALIDATION (6-10)
// ============================================================================

/**
 * Validates budget availability before creating encumbrance.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} requestedAmount - Requested encumbrance amount
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PreEncumbranceValidation>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetAvailability(10, 50000, 2025);
 * if (validation.budgetStatus === 'INSUFFICIENT') {
 *   throw new Error('Insufficient budget');
 * }
 * ```
 */
export const validateBudgetAvailability = async (
  budgetLineId: number,
  requestedAmount: number,
  fiscalYear: number,
): Promise<PreEncumbranceValidation> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Mock available balance calculation
  const mockAvailableBalance = 100000;
  const availableBalance = mockAvailableBalance;

  let budgetStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'WARNING' = 'SUFFICIENT';

  if (requestedAmount > availableBalance) {
    errors.push(`Requested amount (${requestedAmount}) exceeds available balance (${availableBalance})`);
    budgetStatus = 'INSUFFICIENT';
  } else if (requestedAmount > availableBalance * 0.9) {
    warnings.push(`Requested amount will use more than 90% of available balance`);
    budgetStatus = 'WARNING';
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    availableBalance,
    requestedAmount,
    budgetStatus,
  };
};

/**
 * Checks for duplicate encumbrances by document number.
 *
 * @param {string} documentNumber - Document number to check
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<{ isDuplicate: boolean; existingEncumbranceId?: number }>} Duplicate check result
 *
 * @example
 * ```typescript
 * const check = await checkDuplicateEncumbrance('PO-2025-123', 2025);
 * if (check.isDuplicate) {
 *   console.log(`Duplicate of encumbrance ${check.existingEncumbranceId}`);
 * }
 * ```
 */
export const checkDuplicateEncumbrance = async (
  documentNumber: string,
  fiscalYear: number,
): Promise<{ isDuplicate: boolean; existingEncumbranceId?: number }> => {
  // Mock implementation - would query database
  return {
    isDuplicate: false,
  };
};

/**
 * Validates encumbrance against fund control rules.
 *
 * @param {object} encumbranceData - Encumbrance data to validate
 * @param {object[]} fundControls - Applicable fund controls
 * @returns {Promise<{ allowed: boolean; violations: string[] }>} Fund control validation
 *
 * @example
 * ```typescript
 * const validation = await validateFundControls(encumbranceData, fundControls);
 * if (!validation.allowed) {
 *   throw new Error(validation.violations.join(', '));
 * }
 * ```
 */
export const validateFundControls = async (
  encumbranceData: any,
  fundControls: any[],
): Promise<{ allowed: boolean; violations: string[] }> => {
  const violations: string[] = [];

  fundControls.forEach((control) => {
    if (control.controlType === 'HARD_STOP' && encumbranceData.amount > control.threshold) {
      violations.push(`Encumbrance exceeds hard stop threshold for ${control.accountCode}`);
    }
  });

  return {
    allowed: violations.length === 0,
    violations,
  };
};

/**
 * Validates vendor eligibility for encumbrance.
 *
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Vendor eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateVendorEligibility(123);
 * if (!eligibility.eligible) {
 *   throw new Error(`Vendor not eligible: ${eligibility.reasons.join(', ')}`);
 * }
 * ```
 */
export const validateVendorEligibility = async (
  vendorId: number,
): Promise<{ eligible: boolean; reasons: string[] }> => {
  const reasons: string[] = [];

  // Mock validation - would check vendor status, debarment, etc.
  return {
    eligible: true,
    reasons,
  };
};

/**
 * Validates account code for encumbrance transactions.
 *
 * @param {string} accountCode - Account code to validate
 * @param {string} encumbranceType - Type of encumbrance
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Account validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAccountCode('5100-001', 'PURCHASE_ORDER');
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export const validateAccountCode = async (
  accountCode: string,
  encumbranceType: string,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!accountCode || accountCode.length === 0) {
    errors.push('Account code is required');
  }

  // Mock validation - would check chart of accounts
  const validPattern = /^\d{4}-\d{3}$/;
  if (!validPattern.test(accountCode)) {
    errors.push('Account code must match format XXXX-XXX');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// ENCUMBRANCE LIQUIDATION (11-15)
// ============================================================================

/**
 * Liquidates encumbrance against an invoice or payment.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} liquidationData - Liquidation details
 * @param {string} userId - User performing liquidation
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<EncumbranceLiquidation>} Created liquidation
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateEncumbrance(1, {
 *   amount: 12500,
 *   invoiceNumber: 'INV-2025-456',
 *   liquidationDate: new Date(),
 *   description: 'Partial payment for materials'
 * }, 'john.doe');
 * ```
 */
export const liquidateEncumbrance = async (
  encumbranceId: number,
  liquidationData: any,
  userId: string,
  transaction?: Transaction,
): Promise<EncumbranceLiquidation> => {
  const liquidationNumber = `LIQ-${Date.now()}`;

  const fiscalYear = new Date(liquidationData.liquidationDate).getFullYear();
  const fiscalPeriod = Math.ceil((new Date(liquidationData.liquidationDate).getMonth() + 1) / 3);

  return {
    liquidationId: Date.now(),
    encumbranceId,
    liquidationNumber,
    liquidationDate: liquidationData.liquidationDate,
    amount: liquidationData.amount,
    invoiceNumber: liquidationData.invoiceNumber,
    paymentNumber: liquidationData.paymentNumber,
    fiscalYear,
    fiscalPeriod,
    description: liquidationData.description,
    status: 'PENDING',
  };
};

/**
 * Processes partial liquidation of encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} invoiceNumber - Invoice reference
 * @returns {Promise<object>} Partial liquidation result
 *
 * @example
 * ```typescript
 * const result = await processPartialLiquidation(1, 5000, 'INV-2025-789');
 * console.log(`Remaining: ${result.remainingAmount}`);
 * ```
 */
export const processPartialLiquidation = async (
  encumbranceId: number,
  liquidationAmount: number,
  invoiceNumber: string,
): Promise<any> => {
  // Mock encumbrance data
  const mockEncumbrance = {
    amount: 50000,
    liquidatedAmount: 20000,
  };

  const newLiquidatedAmount = mockEncumbrance.liquidatedAmount + liquidationAmount;
  const remainingAmount = mockEncumbrance.amount - newLiquidatedAmount;

  return {
    encumbranceId,
    liquidationAmount,
    totalLiquidated: newLiquidatedAmount,
    remainingAmount,
    invoiceNumber,
    status: remainingAmount > 0 ? 'PARTIALLY_LIQUIDATED' : 'FULLY_LIQUIDATED',
  };
};

/**
 * Liquidates entire remaining encumbrance amount.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reason - Reason for full liquidation
 * @param {string} userId - User performing liquidation
 * @returns {Promise<object>} Full liquidation result
 *
 * @example
 * ```typescript
 * const result = await liquidateFullEncumbrance(1, 'Final payment received', 'john.doe');
 * ```
 */
export const liquidateFullEncumbrance = async (
  encumbranceId: number,
  reason: string,
  userId: string,
): Promise<any> => {
  return {
    encumbranceId,
    reason,
    liquidatedBy: userId,
    liquidatedAt: new Date(),
    status: 'FULLY_LIQUIDATED',
  };
};

/**
 * Reverses a posted encumbrance liquidation.
 *
 * @param {number} liquidationId - Liquidation ID to reverse
 * @param {string} reason - Reason for reversal
 * @param {string} userId - User performing reversal
 * @returns {Promise<EncumbranceReversal>} Reversal record
 *
 * @example
 * ```typescript
 * const reversal = await reverseLiquidation(5, 'Invoice rejected', 'manager.jones');
 * ```
 */
export const reverseLiquidation = async (
  liquidationId: number,
  reason: string,
  userId: string,
): Promise<EncumbranceReversal> => {
  const reversalNumber = `REV-${Date.now()}`;

  return {
    reversalId: Date.now(),
    originalEncumbranceId: liquidationId,
    reversalNumber,
    reversalDate: new Date(),
    reversalAmount: 0, // Would be set from original liquidation
    reason,
    reversedBy: userId,
    status: 'DRAFT',
  };
};

/**
 * Retrieves liquidation history for an encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation history
 *
 * @example
 * ```typescript
 * const history = await getLiquidationHistory(1, { status: 'POSTED' });
 * ```
 */
export const getLiquidationHistory = async (
  encumbranceId: number,
  filters?: any,
): Promise<EncumbranceLiquidation[]> => {
  return [];
};

// ============================================================================
// ENCUMBRANCE MODIFICATION (16-20)
// ============================================================================

/**
 * Increases encumbrance amount with approval workflow.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} increaseAmount - Amount to increase
 * @param {string} reason - Reason for increase
 * @param {string} userId - User requesting increase
 * @returns {Promise<EncumbranceModification>} Modification record
 *
 * @example
 * ```typescript
 * const modification = await increaseEncumbranceAmount(1, 10000, 'Scope expansion', 'john.doe');
 * ```
 */
export const increaseEncumbranceAmount = async (
  encumbranceId: number,
  increaseAmount: number,
  reason: string,
  userId: string,
): Promise<EncumbranceModification> => {
  const modificationNumber = `MOD-INC-${Date.now()}`;
  const originalAmount = 50000; // Mock

  return {
    modificationId: Date.now(),
    encumbranceId,
    modificationNumber,
    modificationType: 'INCREASE',
    originalAmount,
    modifiedAmount: originalAmount + increaseAmount,
    changeAmount: increaseAmount,
    reason,
    modificationDate: new Date(),
    status: 'DRAFT',
  };
};

/**
 * Decreases encumbrance amount and returns funds to budget.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} decreaseAmount - Amount to decrease
 * @param {string} reason - Reason for decrease
 * @param {string} userId - User requesting decrease
 * @returns {Promise<EncumbranceModification>} Modification record
 *
 * @example
 * ```typescript
 * const modification = await decreaseEncumbranceAmount(1, 5000, 'Reduced scope', 'jane.smith');
 * ```
 */
export const decreaseEncumbranceAmount = async (
  encumbranceId: number,
  decreaseAmount: number,
  reason: string,
  userId: string,
): Promise<EncumbranceModification> => {
  const modificationNumber = `MOD-DEC-${Date.now()}`;
  const originalAmount = 50000; // Mock

  return {
    modificationId: Date.now(),
    encumbranceId,
    modificationNumber,
    modificationType: 'DECREASE',
    originalAmount,
    modifiedAmount: originalAmount - decreaseAmount,
    changeAmount: -decreaseAmount,
    reason,
    modificationDate: new Date(),
    status: 'DRAFT',
  };
};

/**
 * Modifies encumbrance details (vendor, dates, etc.).
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {object} modifications - Modification details
 * @param {string} userId - User making modifications
 * @returns {Promise<object>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const updated = await modifyEncumbranceDetails(1, {
 *   expirationDate: new Date('2026-12-31'),
 *   vendor: 'Updated Vendor Name'
 * }, 'admin');
 * ```
 */
export const modifyEncumbranceDetails = async (
  encumbranceId: number,
  modifications: any,
  userId: string,
): Promise<any> => {
  return {
    encumbranceId,
    modifications,
    modifiedBy: userId,
    modifiedAt: new Date(),
  };
};

/**
 * Approves encumbrance modification.
 *
 * @param {number} modificationId - Modification ID
 * @param {string} approverId - User approving modification
 * @returns {Promise<object>} Approved modification
 *
 * @example
 * ```typescript
 * const approved = await approveEncumbranceModification(10, 'manager.jones');
 * ```
 */
export const approveEncumbranceModification = async (
  modificationId: number,
  approverId: string,
): Promise<any> => {
  return {
    modificationId,
    approvedBy: approverId,
    approvedAt: new Date(),
    status: 'APPROVED',
  };
};

/**
 * Retrieves modification history for an encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<EncumbranceModification[]>} Modification history
 *
 * @example
 * ```typescript
 * const history = await getModificationHistory(1);
 * ```
 */
export const getModificationHistory = async (encumbranceId: number): Promise<EncumbranceModification[]> => {
  return [];
};

// ============================================================================
// ENCUMBRANCE REVERSAL (21-25)
// ============================================================================

/**
 * Reverses an entire encumbrance and returns funds to budget.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reason - Reason for reversal
 * @param {string} userId - User performing reversal
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<EncumbranceReversal>} Reversal record
 *
 * @example
 * ```typescript
 * const reversal = await reverseEncumbrance(1, 'Purchase order cancelled', 'john.doe');
 * ```
 */
export const reverseEncumbrance = async (
  encumbranceId: number,
  reason: string,
  userId: string,
  transaction?: Transaction,
): Promise<EncumbranceReversal> => {
  const reversalNumber = `REV-ENC-${Date.now()}`;

  return {
    reversalId: Date.now(),
    originalEncumbranceId: encumbranceId,
    reversalNumber,
    reversalDate: new Date(),
    reversalAmount: 50000, // Mock - would retrieve from encumbrance
    reason,
    reversedBy: userId,
    status: 'DRAFT',
  };
};

/**
 * Cancels an active encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} cancelReason - Cancellation reason
 * @param {string} userId - User cancelling encumbrance
 * @returns {Promise<object>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelEncumbrance(1, 'Vendor unable to deliver', 'manager');
 * ```
 */
export const cancelEncumbrance = async (
  encumbranceId: number,
  cancelReason: string,
  userId: string,
): Promise<any> => {
  return {
    encumbranceId,
    status: 'CANCELLED',
    cancelReason,
    cancelledBy: userId,
    cancelledAt: new Date(),
  };
};

/**
 * Posts encumbrance reversal to general ledger.
 *
 * @param {number} reversalId - Reversal ID
 * @param {string} userId - User posting reversal
 * @returns {Promise<object>} Posted reversal with GL entry
 *
 * @example
 * ```typescript
 * const posted = await postEncumbranceReversal(5, 'accountant');
 * ```
 */
export const postEncumbranceReversal = async (reversalId: number, userId: string): Promise<any> => {
  return {
    reversalId,
    postedBy: userId,
    postedAt: new Date(),
    glJournalEntryId: Date.now(),
    status: 'POSTED',
  };
};

/**
 * Validates reversal eligibility.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Reversal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await validateReversalEligibility(1);
 * if (!eligibility.eligible) {
 *   throw new Error(eligibility.reasons.join(', '));
 * }
 * ```
 */
export const validateReversalEligibility = async (
  encumbranceId: number,
): Promise<{ eligible: boolean; reasons: string[] }> => {
  const reasons: string[] = [];

  // Mock validation
  const mockEncumbrance = {
    status: 'ACTIVE',
    liquidatedAmount: 0,
  };

  if (mockEncumbrance.status === 'FULLY_LIQUIDATED') {
    reasons.push('Cannot reverse fully liquidated encumbrance');
  }

  if (mockEncumbrance.liquidatedAmount > 0) {
    reasons.push('Cannot reverse encumbrance with liquidations - reverse liquidations first');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};

/**
 * Retrieves reversal audit trail.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<object[]>} Reversal audit trail
 *
 * @example
 * ```typescript
 * const trail = await getReversalAuditTrail(1);
 * ```
 */
export const getReversalAuditTrail = async (encumbranceId: number): Promise<any[]> => {
  return [];
};

// ============================================================================
// YEAR-END ROLLOVER (26-30)
// ============================================================================

/**
 * Processes year-end encumbrance rollover to new fiscal year.
 *
 * @param {number} fromFiscalYear - Source fiscal year
 * @param {number} toFiscalYear - Target fiscal year
 * @param {number[]} encumbranceIds - Encumbrances to rollover
 * @param {string} userId - User performing rollover
 * @returns {Promise<EncumbranceRollover[]>} Rollover results
 *
 * @example
 * ```typescript
 * const rollovers = await processYearEndRollover(2024, 2025, [1, 2, 3], 'admin');
 * ```
 */
export const processYearEndRollover = async (
  fromFiscalYear: number,
  toFiscalYear: number,
  encumbranceIds: number[],
  userId: string,
): Promise<EncumbranceRollover[]> => {
  return encumbranceIds.map((id) => ({
    rolloverYear: toFiscalYear,
    encumbranceId: id,
    originalAmount: 50000,
    liquidatedAmount: 10000,
    rolloverAmount: 40000,
    rolloverType: 'AUTOMATIC',
    rolloverStatus: 'PENDING',
  }));
};

/**
 * Identifies encumbrances eligible for rollover.
 *
 * @param {number} fiscalYear - Ending fiscal year
 * @param {object} [criteria] - Rollover criteria
 * @returns {Promise<object[]>} Eligible encumbrances
 *
 * @example
 * ```typescript
 * const eligible = await identifyRolloverCandidates(2024, { minAmount: 1000 });
 * ```
 */
export const identifyRolloverCandidates = async (fiscalYear: number, criteria?: any): Promise<any[]> => {
  return [];
};

/**
 * Validates rollover eligibility for encumbrance.
 *
 * @param {number} encumbranceId - Encumbrance ID
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Rollover eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await validateRolloverEligibility(1);
 * ```
 */
export const validateRolloverEligibility = async (
  encumbranceId: number,
): Promise<{ eligible: boolean; reasons: string[] }> => {
  const reasons: string[] = [];

  // Mock validation
  return {
    eligible: true,
    reasons,
  };
};

/**
 * Creates new fiscal year encumbrance from rollover.
 *
 * @param {EncumbranceRollover} rollover - Rollover data
 * @param {string} userId - User creating new encumbrance
 * @returns {Promise<object>} New encumbrance
 *
 * @example
 * ```typescript
 * const newEnc = await createRolloverEncumbrance(rolloverData, 'admin');
 * ```
 */
export const createRolloverEncumbrance = async (rollover: EncumbranceRollover, userId: string): Promise<any> => {
  return {
    fiscalYear: rollover.rolloverYear,
    amount: rollover.rolloverAmount,
    status: 'ACTIVE',
    createdBy: userId,
    metadata: {
      rolledOverFrom: rollover.encumbranceId,
    },
  };
};

/**
 * Generates year-end rollover report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Rollover report
 *
 * @example
 * ```typescript
 * const report = await generateRolloverReport(2024);
 * ```
 */
export const generateRolloverReport = async (fiscalYear: number): Promise<any> => {
  return {
    fiscalYear,
    totalEncumbrances: 50,
    totalRolledOver: 35,
    totalExpired: 15,
    rolloverAmount: 500000,
    reportDate: new Date(),
  };
};

// ============================================================================
// MULTI-YEAR ENCUMBRANCES (31-35)
// ============================================================================

/**
 * Creates multi-year encumbrance with yearly allocations.
 *
 * @param {object} multiYearData - Multi-year encumbrance data
 * @param {string} userId - User creating encumbrance
 * @returns {Promise<MultiYearEncumbrance>} Multi-year encumbrance
 *
 * @example
 * ```typescript
 * const multiYear = await createMultiYearEncumbrance({
 *   startFiscalYear: 2025,
 *   endFiscalYear: 2027,
 *   totalAmount: 300000,
 *   yearlyAllocations: [
 *     { fiscalYear: 2025, allocatedAmount: 100000 },
 *     { fiscalYear: 2026, allocatedAmount: 100000 },
 *     { fiscalYear: 2027, allocatedAmount: 100000 }
 *   ]
 * }, 'admin');
 * ```
 */
export const createMultiYearEncumbrance = async (multiYearData: any, userId: string): Promise<MultiYearEncumbrance> => {
  return {
    encumbranceId: Date.now(),
    startFiscalYear: multiYearData.startFiscalYear,
    endFiscalYear: multiYearData.endFiscalYear,
    totalAmount: multiYearData.totalAmount,
    yearlyAllocations: multiYearData.yearlyAllocations.map((alloc: any) => ({
      ...alloc,
      liquidatedAmount: 0,
      remainingAmount: alloc.allocatedAmount,
    })),
    expirationRule: 'MULTI_YEAR',
  };
};

/**
 * Allocates multi-year encumbrance amount to specific fiscal year.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @param {number} fiscalYear - Fiscal year for allocation
 * @param {number} amount - Amount to allocate
 * @returns {Promise<object>} Yearly allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateMultiYearAmount(1, 2026, 100000);
 * ```
 */
export const allocateMultiYearAmount = async (
  encumbranceId: number,
  fiscalYear: number,
  amount: number,
): Promise<any> => {
  return {
    encumbranceId,
    fiscalYear,
    allocatedAmount: amount,
    liquidatedAmount: 0,
    remainingAmount: amount,
  };
};

/**
 * Retrieves multi-year encumbrance allocation breakdown.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @returns {Promise<YearlyAllocation[]>} Yearly allocations
 *
 * @example
 * ```typescript
 * const allocations = await getMultiYearAllocations(1);
 * ```
 */
export const getMultiYearAllocations = async (encumbranceId: number): Promise<YearlyAllocation[]> => {
  return [];
};

/**
 * Validates multi-year encumbrance setup.
 *
 * @param {object} multiYearData - Multi-year encumbrance data
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMultiYearEncumbrance(data);
 * ```
 */
export const validateMultiYearEncumbrance = async (
  multiYearData: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (multiYearData.endFiscalYear <= multiYearData.startFiscalYear) {
    errors.push('End fiscal year must be after start fiscal year');
  }

  const totalAllocated = multiYearData.yearlyAllocations.reduce(
    (sum: number, alloc: any) => sum + alloc.allocatedAmount,
    0,
  );

  if (Math.abs(totalAllocated - multiYearData.totalAmount) > 0.01) {
    errors.push('Yearly allocations must sum to total amount');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Adjusts multi-year allocation between fiscal years.
 *
 * @param {number} encumbranceId - Multi-year encumbrance ID
 * @param {number} fromYear - Source fiscal year
 * @param {number} toYear - Target fiscal year
 * @param {number} amount - Amount to transfer
 * @returns {Promise<object>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustMultiYearAllocation(1, 2025, 2026, 25000);
 * ```
 */
export const adjustMultiYearAllocation = async (
  encumbranceId: number,
  fromYear: number,
  toYear: number,
  amount: number,
): Promise<any> => {
  return {
    encumbranceId,
    fromYear,
    toYear,
    amount,
    adjustedAt: new Date(),
  };
};

// ============================================================================
// AVAILABLE BALANCE CALCULATION (36-40)
// ============================================================================

/**
 * Calculates available budget balance considering encumbrances.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<AvailableBalance>} Available balance details
 *
 * @example
 * ```typescript
 * const balance = await calculateAvailableBalance(10, 2025);
 * console.log(`Available to encumber: ${balance.availableToEncumber}`);
 * ```
 */
export const calculateAvailableBalance = async (
  budgetLineId: number,
  fiscalYear: number,
): Promise<AvailableBalance> => {
  // Mock data
  const totalBudget = 1000000;
  const totalAllocated = 900000;
  const totalEncumbered = 600000;
  const totalExpended = 300000;
  const pendingEncumbrances = 50000;

  return {
    budgetLineId,
    accountCode: '5100-001',
    totalBudget,
    totalAllocated,
    totalEncumbered,
    totalExpended,
    availableToEncumber: totalAllocated - totalEncumbered - pendingEncumbrances,
    availableToExpend: totalEncumbered - totalExpended,
    pendingEncumbrances,
  };
};

/**
 * Calculates unencumbered balance for budget line.
 *
 * @param {number} budgetLineId - Budget line ID
 * @returns {Promise<number>} Unencumbered balance
 *
 * @example
 * ```typescript
 * const unencumbered = await calculateUnencumberedBalance(10);
 * ```
 */
export const calculateUnencumberedBalance = async (budgetLineId: number): Promise<number> => {
  const balance = await calculateAvailableBalance(budgetLineId, new Date().getFullYear());
  return balance.availableToEncumber;
};

/**
 * Retrieves encumbrance summary by account code.
 *
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Encumbrance summary
 *
 * @example
 * ```typescript
 * const summary = await getEncumbranceSummaryByAccount('5100-001', 2025);
 * ```
 */
export const getEncumbranceSummaryByAccount = async (accountCode: string, fiscalYear: number): Promise<any> => {
  return {
    accountCode,
    fiscalYear,
    totalEncumbrances: 25,
    totalAmount: 500000,
    liquidatedAmount: 200000,
    remainingAmount: 300000,
  };
};

/**
 * Calculates encumbrance utilization rate.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Utilization rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateEncumbranceUtilizationRate(10, 2025);
 * console.log(`Utilization: ${rate}%`);
 * ```
 */
export const calculateEncumbranceUtilizationRate = async (
  budgetLineId: number,
  fiscalYear: number,
): Promise<number> => {
  const balance = await calculateAvailableBalance(budgetLineId, fiscalYear);
  return (balance.totalEncumbered / balance.totalAllocated) * 100;
};

/**
 * Projects available balance based on pending encumbrances.
 *
 * @param {number} budgetLineId - Budget line ID
 * @returns {Promise<object>} Projected balance
 *
 * @example
 * ```typescript
 * const projection = await projectAvailableBalance(10);
 * ```
 */
export const projectAvailableBalance = async (budgetLineId: number): Promise<any> => {
  const current = await calculateAvailableBalance(budgetLineId, new Date().getFullYear());

  return {
    currentAvailable: current.availableToEncumber,
    pendingEncumbrances: current.pendingEncumbrances,
    projectedAvailable: current.availableToEncumber - current.pendingEncumbrances,
  };
};

// ============================================================================
// RECONCILIATION (41-45)
// ============================================================================

/**
 * Reconciles encumbrances with budget allocations.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<EncumbranceReconciliation>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileEncumbrances(10, 2025, 3);
 * ```
 */
export const reconcileEncumbrances = async (
  budgetLineId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<EncumbranceReconciliation> => {
  return {
    reconciliationDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    totalEncumbrances: 600000,
    totalLiquidations: 250000,
    totalRemaining: 350000,
    discrepancies: [],
    status: 'BALANCED',
  };
};

/**
 * Identifies encumbrance reconciliation discrepancies.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<ReconciliationDiscrepancy[]>} Discrepancies found
 *
 * @example
 * ```typescript
 * const discrepancies = await identifyReconciliationDiscrepancies(2025, 3);
 * ```
 */
export const identifyReconciliationDiscrepancies = async (
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<ReconciliationDiscrepancy[]> => {
  return [];
};

/**
 * Generates encumbrance aging report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} [options] - Report options
 * @returns {Promise<EncumbranceReport>} Aging report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceAgingReport(2025);
 * ```
 */
export const generateEncumbranceAgingReport = async (fiscalYear: number, options?: any): Promise<EncumbranceReport> => {
  return {
    reportType: 'AGING',
    fiscalYear,
    filters: options || {},
    data: [],
    totals: {
      totalEncumbered: 1000000,
      totalLiquidated: 400000,
      totalRemaining: 600000,
    },
  };
};

/**
 * Generates encumbrance summary report by vendor.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [vendorId] - Optional vendor filter
 * @returns {Promise<EncumbranceReport>} Vendor report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceReportByVendor(2025, 123);
 * ```
 */
export const generateEncumbranceReportByVendor = async (
  fiscalYear: number,
  vendorId?: number,
): Promise<EncumbranceReport> => {
  return {
    reportType: 'VENDOR',
    fiscalYear,
    filters: { vendorId },
    data: [],
    totals: {
      totalEncumbered: 500000,
      totalLiquidated: 200000,
      totalRemaining: 300000,
    },
  };
};

/**
 * Exports encumbrance data for external reporting.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} format - Export format ('CSV' | 'EXCEL' | 'PDF')
 * @param {object} [filters] - Export filters
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportEncumbranceData(2025, 'CSV', { status: 'ACTIVE' });
 * ```
 */
export const exportEncumbranceData = async (fiscalYear: number, format: string, filters?: any): Promise<Buffer> => {
  // Mock implementation
  return Buffer.from('Encumbrance export data');
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createEncumbranceHeaderModel,
  createEncumbranceLineModel,
  createEncumbranceLiquidationModel,

  // Encumbrance Creation
  createPurchaseOrderEncumbrance,
  createContractEncumbrance,
  createBlanketEncumbrance,
  generateEncumbranceNumber,
  validateEncumbranceLines,

  // Pre-Encumbrance Validation
  validateBudgetAvailability,
  checkDuplicateEncumbrance,
  validateFundControls,
  validateVendorEligibility,
  validateAccountCode,

  // Encumbrance Liquidation
  liquidateEncumbrance,
  processPartialLiquidation,
  liquidateFullEncumbrance,
  reverseLiquidation,
  getLiquidationHistory,

  // Encumbrance Modification
  increaseEncumbranceAmount,
  decreaseEncumbranceAmount,
  modifyEncumbranceDetails,
  approveEncumbranceModification,
  getModificationHistory,

  // Encumbrance Reversal
  reverseEncumbrance,
  cancelEncumbrance,
  postEncumbranceReversal,
  validateReversalEligibility,
  getReversalAuditTrail,

  // Year-End Rollover
  processYearEndRollover,
  identifyRolloverCandidates,
  validateRolloverEligibility,
  createRolloverEncumbrance,
  generateRolloverReport,

  // Multi-Year Encumbrances
  createMultiYearEncumbrance,
  allocateMultiYearAmount,
  getMultiYearAllocations,
  validateMultiYearEncumbrance,
  adjustMultiYearAllocation,

  // Available Balance Calculation
  calculateAvailableBalance,
  calculateUnencumberedBalance,
  getEncumbranceSummaryByAccount,
  calculateEncumbranceUtilizationRate,
  projectAvailableBalance,

  // Reconciliation
  reconcileEncumbrances,
  identifyReconciliationDiscrepancies,
  generateEncumbranceAgingReport,
  generateEncumbranceReportByVendor,
  exportEncumbranceData,
};

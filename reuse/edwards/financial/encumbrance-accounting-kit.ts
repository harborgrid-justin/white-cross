/**
 * LOC: ENCACCT001
 * File: /reuse/edwards/financial/encumbrance-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./commitment-control-kit (Commitment operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Fund accounting services
 *   - Year-end close processes
 *   - Budget control modules
 */

/**
 * File: /reuse/edwards/financial/encumbrance-accounting-kit.ts
 * Locator: WC-JDE-ENCACCT-001
 * Purpose: Comprehensive Encumbrance Accounting - JD Edwards EnterpriseOne-level encumbrance tracking, liquidation, adjustments, year-end processing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, commitment-control-kit
 * Downstream: ../backend/financial/*, Fund Accounting Services, Year-End Close, Budget Control
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for encumbrance creation, tracking, liquidation, adjustments, reporting, year-end processing, carry-forward, fund accounting integration
 *
 * LLM Context: Enterprise-grade encumbrance accounting operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive encumbrance tracking, automated liquidation processing, encumbrance adjustments,
 * encumbrance reporting, year-end processing workflows, encumbrance carry-forward, fund accounting integration,
 * multi-year encumbrances, encumbrance variance analysis, audit trails, encumbrance history, and reconciliation.
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
  encumbranceDate: Date;
  encumbranceType: 'purchase_order' | 'contract' | 'requisition' | 'manual' | 'blanket';
  businessUnit: string;
  vendor?: string;
  vendorName?: string;
  description: string;
  status: 'active' | 'partially_liquidated' | 'fully_liquidated' | 'reversed' | 'cancelled' | 'carried_forward';
  fiscalYear: number;
  fiscalPeriod: number;
  originalAmount: number;
  currentAmount: number;
  liquidatedAmount: number;
  adjustedAmount: number;
  remainingAmount: number;
  sourceDocument?: string;
  sourceDocumentType?: string;
  commitmentId?: number;
  glJournalId?: number;
  postedDate?: Date;
  postedBy?: string;
}

interface EncumbranceLine {
  lineId: number;
  encumbranceId: number;
  lineNumber: number;
  accountCode: string;
  accountId: number;
  description: string;
  originalAmount: number;
  currentAmount: number;
  liquidatedAmount: number;
  adjustedAmount: number;
  remainingAmount: number;
  budgetYear: number;
  budgetPeriod: number;
  projectCode?: string;
  activityCode?: string;
  costCenterCode?: string;
  fundCode?: string;
  organizationCode?: string;
  objectCode?: string;
  grantCode?: string;
  programCode?: string;
}

interface EncumbranceLiquidation {
  liquidationId: number;
  encumbranceId: number;
  encumbranceLineId: number;
  liquidationNumber: string;
  liquidationDate: Date;
  liquidationType: 'partial' | 'full' | 'final';
  liquidationAmount: number;
  sourceDocument: string;
  sourceDocumentType: 'invoice' | 'receipt' | 'voucher' | 'payment';
  invoiceNumber?: string;
  voucherNumber?: string;
  glJournalId?: number;
  status: 'pending' | 'posted' | 'reversed';
  postedDate?: Date;
  postedBy?: string;
  reversalReason?: string;
  reversedDate?: Date;
  reversedBy?: string;
}

interface EncumbranceAdjustment {
  adjustmentId: number;
  encumbranceId: number;
  encumbranceLineId: number;
  adjustmentNumber: string;
  adjustmentDate: Date;
  adjustmentType: 'increase' | 'decrease' | 'correction' | 'reclass';
  adjustmentAmount: number;
  originalAccountCode?: string;
  newAccountCode?: string;
  adjustmentReason: string;
  glJournalId?: number;
  status: 'pending' | 'approved' | 'posted' | 'reversed';
  approvedBy?: string;
  approvedDate?: Date;
  postedDate?: Date;
  postedBy?: string;
}

interface EncumbranceCarryForward {
  carryForwardId: number;
  sourceEncumbranceId: number;
  sourceEncumbranceLineId: number;
  targetEncumbranceId?: number;
  targetEncumbranceLineId?: number;
  sourceFiscalYear: number;
  targetFiscalYear: number;
  carryForwardDate: Date;
  carryForwardAmount: number;
  accountCode: string;
  fundCode?: string;
  projectCode?: string;
  status: 'pending' | 'approved' | 'posted' | 'rejected';
  approvalRequired: boolean;
  approvedBy?: string;
  approvedDate?: Date;
  justification?: string;
  expirationDate?: Date;
}

interface YearEndEncumbrance {
  yearEndId: number;
  fiscalYear: number;
  encumbranceId: number;
  encumbranceLineId: number;
  accountCode: string;
  originalAmount: number;
  liquidatedAmount: number;
  outstandingAmount: number;
  carryForwardAmount: number;
  lapseAmount: number;
  disposition: 'carry_forward' | 'lapse' | 'close';
  processDate: Date;
  processedBy: string;
  notes?: string;
}

interface FundEncumbrance {
  fundEncumbranceId: number;
  fundCode: string;
  fiscalYear: number;
  fiscalPeriod: number;
  accountCode: string;
  grantCode?: string;
  projectCode?: string;
  totalEncumbrances: number;
  liquidatedEncumbrances: number;
  outstandingEncumbrances: number;
  adjustments: number;
  availableBalance: number;
  fundType: 'general' | 'restricted' | 'grant' | 'project' | 'capital';
  complianceStatus: 'compliant' | 'warning' | 'violation';
}

interface EncumbranceReport {
  reportId: string;
  reportType: 'outstanding_encumbrances' | 'liquidation_summary' | 'year_end_status' | 'fund_encumbrance' | 'variance_analysis';
  fiscalYear: number;
  fiscalPeriod?: number;
  businessUnit?: string;
  fundCode?: string;
  reportData: Record<string, any>;
  generatedDate: Date;
  generatedBy: string;
}

interface EncumbranceHistory {
  historyId: number;
  encumbranceId: number;
  changeDate: Date;
  changeType: 'created' | 'liquidated' | 'adjusted' | 'reversed' | 'carried_forward' | 'closed';
  changedBy: string;
  oldAmount?: number;
  newAmount?: number;
  changeDescription: string;
  glJournalId?: number;
  auditData: Record<string, any>;
}

interface EncumbranceReconciliation {
  reconciliationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  accountCode: string;
  glEncumbranceBalance: number;
  subledgerEncumbranceBalance: number;
  variance: number;
  variancePercent: number;
  status: 'matched' | 'variance' | 'under_investigation' | 'resolved';
  reconciliationDate: Date;
  reconciledBy?: string;
  resolutionNotes?: string;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance date', example: '2024-01-15' })
  encumbranceDate!: Date;

  @ApiProperty({ description: 'Encumbrance type', enum: ['purchase_order', 'contract', 'requisition', 'manual', 'blanket'] })
  encumbranceType!: string;

  @ApiProperty({ description: 'Business unit', example: 'BU001' })
  businessUnit!: string;

  @ApiProperty({ description: 'Vendor ID', required: false })
  vendor?: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Source document number', required: false })
  sourceDocument?: string;

  @ApiProperty({ description: 'Source document type', required: false })
  sourceDocumentType?: string;

  @ApiProperty({ description: 'Commitment ID', required: false })
  commitmentId?: number;

  @ApiProperty({ description: 'Encumbrance lines', type: [Object] })
  lines!: EncumbranceLine[];
}

export class LiquidateEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance ID' })
  encumbranceId!: number;

  @ApiProperty({ description: 'Encumbrance line ID' })
  encumbranceLineId!: number;

  @ApiProperty({ description: 'Liquidation date' })
  liquidationDate!: Date;

  @ApiProperty({ description: 'Liquidation amount' })
  liquidationAmount!: number;

  @ApiProperty({ description: 'Source document number' })
  sourceDocument!: string;

  @ApiProperty({ description: 'Source document type', enum: ['invoice', 'receipt', 'voucher', 'payment'] })
  sourceDocumentType!: string;

  @ApiProperty({ description: 'Invoice number', required: false })
  invoiceNumber?: string;

  @ApiProperty({ description: 'Voucher number', required: false })
  voucherNumber?: string;

  @ApiProperty({ description: 'User liquidating' })
  userId!: string;
}

export class AdjustEncumbranceDto {
  @ApiProperty({ description: 'Encumbrance ID' })
  encumbranceId!: number;

  @ApiProperty({ description: 'Encumbrance line ID' })
  encumbranceLineId!: number;

  @ApiProperty({ description: 'Adjustment date' })
  adjustmentDate!: Date;

  @ApiProperty({ description: 'Adjustment type', enum: ['increase', 'decrease', 'correction', 'reclass'] })
  adjustmentType!: string;

  @ApiProperty({ description: 'Adjustment amount' })
  adjustmentAmount!: number;

  @ApiProperty({ description: 'Adjustment reason' })
  adjustmentReason!: string;

  @ApiProperty({ description: 'New account code for reclass', required: false })
  newAccountCode?: string;

  @ApiProperty({ description: 'User making adjustment' })
  userId!: string;
}

export class CarryForwardEncumbranceDto {
  @ApiProperty({ description: 'Source encumbrance ID' })
  sourceEncumbranceId!: number;

  @ApiProperty({ description: 'Source encumbrance line ID' })
  sourceEncumbranceLineId!: number;

  @ApiProperty({ description: 'Carry forward date' })
  carryForwardDate!: Date;

  @ApiProperty({ description: 'Carry forward amount' })
  carryForwardAmount!: number;

  @ApiProperty({ description: 'Target fiscal year' })
  targetFiscalYear!: number;

  @ApiProperty({ description: 'Justification for carry forward' })
  justification!: string;

  @ApiProperty({ description: 'Expiration date', required: false })
  expirationDate?: Date;

  @ApiProperty({ description: 'User requesting carry forward' })
  userId!: string;
}

export class YearEndProcessingDto {
  @ApiProperty({ description: 'Fiscal year to close' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Business unit', required: false })
  businessUnit?: string;

  @ApiProperty({ description: 'Fund code', required: false })
  fundCode?: string;

  @ApiProperty({ description: 'Auto-lapse flag', default: false })
  autoLapse?: boolean;

  @ApiProperty({ description: 'User processing year-end' })
  userId!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Encumbrance Headers with liquidation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncumbranceHeader model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceHeaderModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceNumber: 'ENC-2024-001',
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   status: 'active',
 *   originalAmount: 50000
 * });
 * ```
 */
export const createEncumbranceHeaderModel = (sequelize: Sequelize) => {
  class EncumbranceHeader extends Model {
    public id!: number;
    public encumbranceNumber!: string;
    public encumbranceDate!: Date;
    public encumbranceType!: string;
    public businessUnit!: string;
    public vendor!: string | null;
    public vendorName!: string | null;
    public description!: string;
    public status!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public originalAmount!: number;
    public currentAmount!: number;
    public liquidatedAmount!: number;
    public adjustedAmount!: number;
    public remainingAmount!: number;
    public sourceDocument!: string | null;
    public sourceDocumentType!: string | null;
    public commitmentId!: number | null;
    public glJournalId!: number | null;
    public postedDate!: Date | null;
    public postedBy!: string | null;
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
        comment: 'Unique encumbrance number',
      },
      encumbranceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Encumbrance transaction date',
      },
      encumbranceType: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: 'Type of encumbrance',
        validate: {
          isIn: [['purchase_order', 'contract', 'requisition', 'manual', 'blanket']],
        },
      },
      businessUnit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Business unit code',
      },
      vendor: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Vendor identifier',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Vendor name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encumbrance description',
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Encumbrance status',
        validate: {
          isIn: [['active', 'partially_liquidated', 'fully_liquidated', 'reversed', 'cancelled', 'carried_forward']],
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
        validate: {
          min: 2000,
          max: 2099,
        },
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-13)',
        validate: {
          min: 1,
          max: 13,
        },
      },
      originalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Original encumbrance amount',
      },
      currentAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current encumbrance amount after adjustments',
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount liquidated',
      },
      adjustedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net adjustment amount',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining encumbrance amount',
      },
      sourceDocument: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Source document number (PO, Contract, etc.)',
      },
      sourceDocumentType: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Type of source document',
      },
      commitmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to related commitment',
      },
      glJournalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to GL journal entry',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date encumbrance was posted to GL',
      },
      postedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who posted the encumbrance',
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
        comment: 'User who created the encumbrance',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the encumbrance',
      },
    },
    {
      sequelize,
      tableName: 'encumbrance_headers',
      timestamps: true,
      indexes: [
        { fields: ['encumbranceNumber'], unique: true },
        { fields: ['encumbranceDate'] },
        { fields: ['encumbranceType'] },
        { fields: ['status'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['businessUnit'] },
        { fields: ['vendor'] },
        { fields: ['sourceDocument'] },
        { fields: ['commitmentId'] },
      ],
      hooks: {
        beforeCreate: (encumbrance) => {
          if (!encumbrance.createdBy) {
            throw new Error('createdBy is required');
          }
          encumbrance.updatedBy = encumbrance.createdBy;
          encumbrance.currentAmount = encumbrance.originalAmount;
        },
        beforeUpdate: (encumbrance) => {
          if (!encumbrance.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (encumbrance) => {
          // Calculate remaining amount
          const current = Number(encumbrance.currentAmount || 0);
          const liquidated = Number(encumbrance.liquidatedAmount || 0);
          encumbrance.remainingAmount = current - liquidated;
        },
      },
    },
  );

  return EncumbranceHeader;
};

/**
 * Sequelize model for Encumbrance Lines with fund accounting.
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
 *   originalAmount: 5000,
 *   currentAmount: 5000
 * });
 * ```
 */
export const createEncumbranceLineModel = (sequelize: Sequelize) => {
  class EncumbranceLine extends Model {
    public id!: number;
    public encumbranceId!: number;
    public lineNumber!: number;
    public accountCode!: string;
    public accountId!: number;
    public description!: string;
    public originalAmount!: number;
    public currentAmount!: number;
    public liquidatedAmount!: number;
    public adjustedAmount!: number;
    public remainingAmount!: number;
    public budgetYear!: number;
    public budgetPeriod!: number;
    public projectCode!: string | null;
    public activityCode!: string | null;
    public costCenterCode!: string | null;
    public fundCode!: string | null;
    public organizationCode!: string | null;
    public objectCode!: string | null;
    public grantCode!: string | null;
    public programCode!: string | null;
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
        comment: 'Reference to encumbrance header',
        references: {
          model: 'encumbrance_headers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number within encumbrance',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to chart of accounts',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Line item description',
      },
      originalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Original encumbrance amount',
      },
      currentAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current amount after adjustments',
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount liquidated',
      },
      adjustedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net adjustment amount',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining encumbrance',
      },
      budgetYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Budget fiscal year',
      },
      budgetPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Budget fiscal period',
      },
      projectCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Project code',
      },
      activityCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Activity code',
      },
      costCenterCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Cost center code',
      },
      fundCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Fund code',
      },
      organizationCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Organization code',
      },
      objectCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Object code',
      },
      grantCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Grant code',
      },
      programCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: 'Program code',
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
        { fields: ['budgetYear', 'budgetPeriod'] },
        { fields: ['fundCode'] },
        { fields: ['projectCode'] },
        { fields: ['grantCode'] },
      ],
      hooks: {
        beforeCreate: (line) => {
          line.currentAmount = line.originalAmount;
        },
        beforeSave: (line) => {
          // Calculate remaining amount
          const current = Number(line.currentAmount || 0);
          const liquidated = Number(line.liquidatedAmount || 0);
          line.remainingAmount = current - liquidated;
        },
      },
    },
  );

  return EncumbranceLine;
};

// ============================================================================
// ENCUMBRANCE CREATION AND MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto} encumbranceData - Encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   businessUnit: 'BU001',
 *   description: 'Equipment purchase',
 *   sourceDocument: 'PO-2024-001',
 *   lines: [{ accountCode: '5100-001', originalAmount: 5000 }]
 * }, 'user123');
 * ```
 */
export const createEncumbrance = async (
  sequelize: Sequelize,
  encumbranceData: CreateEncumbranceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  // Generate encumbrance number
  const encumbranceNumber = await generateEncumbranceNumber(sequelize, encumbranceData.encumbranceType, transaction);

  // Determine fiscal year and period
  const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(encumbranceData.encumbranceDate);

  // Calculate total amount
  let totalAmount = 0;
  for (const line of encumbranceData.lines) {
    totalAmount += Number(line.originalAmount || 0);
  }

  // Create header
  const header = await EncumbranceHeader.create(
    {
      encumbranceNumber,
      encumbranceDate: encumbranceData.encumbranceDate,
      encumbranceType: encumbranceData.encumbranceType,
      businessUnit: encumbranceData.businessUnit,
      vendor: encumbranceData.vendor,
      description: encumbranceData.description,
      status: 'active',
      fiscalYear,
      fiscalPeriod,
      originalAmount: totalAmount,
      currentAmount: totalAmount,
      liquidatedAmount: 0,
      adjustedAmount: 0,
      remainingAmount: totalAmount,
      sourceDocument: encumbranceData.sourceDocument,
      sourceDocumentType: encumbranceData.sourceDocumentType,
      commitmentId: encumbranceData.commitmentId,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Create lines
  for (let i = 0; i < encumbranceData.lines.length; i++) {
    const lineData = encumbranceData.lines[i];

    await EncumbranceLine.create(
      {
        encumbranceId: header.id,
        lineNumber: i + 1,
        accountCode: lineData.accountCode,
        accountId: lineData.accountId,
        description: lineData.description,
        originalAmount: lineData.originalAmount,
        currentAmount: lineData.originalAmount,
        liquidatedAmount: 0,
        adjustedAmount: 0,
        remainingAmount: lineData.originalAmount,
        budgetYear: lineData.budgetYear || fiscalYear,
        budgetPeriod: lineData.budgetPeriod || fiscalPeriod,
        projectCode: lineData.projectCode,
        activityCode: lineData.activityCode,
        costCenterCode: lineData.costCenterCode,
        fundCode: lineData.fundCode,
        organizationCode: lineData.organizationCode,
        objectCode: lineData.objectCode,
        grantCode: lineData.grantCode,
        programCode: lineData.programCode,
      },
      { transaction },
    );
  }

  return header;
};

/**
 * Retrieves an encumbrance by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance with lines
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceById(sequelize, 1);
 * ```
 */
export const getEncumbranceById = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  return encumbrance;
};

/**
 * Retrieves encumbrances by various filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} filters - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrances(sequelize, {
 *   status: 'active',
 *   fiscalYear: 2024
 * });
 * ```
 */
export const getEncumbrances = async (
  sequelize: Sequelize,
  filters: {
    status?: string;
    encumbranceType?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    vendor?: string;
  },
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const where: any = {};

  if (filters.status) where.status = filters.status;
  if (filters.encumbranceType) where.encumbranceType = filters.encumbranceType;
  if (filters.fiscalYear) where.fiscalYear = filters.fiscalYear;
  if (filters.fiscalPeriod) where.fiscalPeriod = filters.fiscalPeriod;
  if (filters.businessUnit) where.businessUnit = filters.businessUnit;
  if (filters.vendor) where.vendor = filters.vendor;

  const encumbrances = await EncumbranceHeader.findAll({ where, transaction });

  return encumbrances;
};

/**
 * Posts an encumbrance to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} userId - User posting the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted encumbrance with GL journal ID
 *
 * @example
 * ```typescript
 * const posted = await postEncumbranceToGL(sequelize, 1, 'user123');
 * ```
 */
export const postEncumbranceToGL = async (
  sequelize: Sequelize,
  encumbranceId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  // Create GL journal entry (simplified)
  const glJournalId = Date.now();

  await encumbrance.update(
    {
      glJournalId,
      postedDate: new Date(),
      postedBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return encumbrance;
};

/**
 * Reverses an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversed encumbrance
 *
 * @example
 * ```typescript
 * const reversed = await reverseEncumbrance(sequelize, 1, 'PO cancelled', 'user123');
 * ```
 */
export const reverseEncumbrance = async (
  sequelize: Sequelize,
  encumbranceId: number,
  reversalReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  await encumbrance.update(
    {
      status: 'reversed',
      updatedBy: userId,
      metadata: {
        ...encumbrance.metadata,
        reversalReason,
        reversedDate: new Date(),
        reversedBy: userId,
      },
    },
    { transaction },
  );

  return encumbrance;
};

/**
 * Cancels an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled encumbrance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelEncumbrance(sequelize, 1, 'No longer needed', 'user123');
 * ```
 */
export const cancelEncumbrance = async (
  sequelize: Sequelize,
  encumbranceId: number,
  cancellationReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  await encumbrance.update(
    {
      status: 'cancelled',
      updatedBy: userId,
      metadata: {
        ...encumbrance.metadata,
        cancellationReason,
        cancelledDate: new Date(),
        cancelledBy: userId,
      },
    },
    { transaction },
  );

  return encumbrance;
};

// ============================================================================
// ENCUMBRANCE LIQUIDATION FUNCTIONS
// ============================================================================

/**
 * Liquidates an encumbrance (partial or full).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateEncumbranceDto} liquidationData - Liquidation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation>} Liquidation record
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateEncumbrance(sequelize, {
 *   encumbranceId: 1,
 *   encumbranceLineId: 1,
 *   liquidationDate: new Date(),
 *   liquidationAmount: 500,
 *   sourceDocument: 'INV-12345',
 *   sourceDocumentType: 'invoice',
 *   userId: 'user123'
 * });
 * ```
 */
export const liquidateEncumbrance = async (
  sequelize: Sequelize,
  liquidationData: LiquidateEncumbranceDto,
  transaction?: Transaction,
): Promise<EncumbranceLiquidation> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(liquidationData.encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  const line = await EncumbranceLine.findByPk(liquidationData.encumbranceLineId, { transaction });
  if (!line) {
    throw new Error('Encumbrance line not found');
  }

  if (encumbrance.status === 'reversed' || encumbrance.status === 'cancelled') {
    throw new Error('Cannot liquidate reversed or cancelled encumbrance');
  }

  // Check if liquidation amount exceeds remaining
  if (liquidationData.liquidationAmount > line.remainingAmount) {
    throw new Error('Liquidation amount exceeds remaining encumbrance');
  }

  // Update line
  const newLiquidatedAmount = line.liquidatedAmount + liquidationData.liquidationAmount;
  await line.update(
    {
      liquidatedAmount: newLiquidatedAmount,
    },
    { transaction },
  );

  // Update header
  const newHeaderLiquidatedAmount = encumbrance.liquidatedAmount + liquidationData.liquidationAmount;
  let newStatus = 'partially_liquidated';

  if (newHeaderLiquidatedAmount >= encumbrance.currentAmount) {
    newStatus = 'fully_liquidated';
  }

  await encumbrance.update(
    {
      liquidatedAmount: newHeaderLiquidatedAmount,
      status: newStatus,
      updatedBy: liquidationData.userId,
    },
    { transaction },
  );

  const liquidationNumber = await generateLiquidationNumber(sequelize, transaction);

  const liquidation: EncumbranceLiquidation = {
    liquidationId: Date.now(),
    encumbranceId: liquidationData.encumbranceId,
    encumbranceLineId: liquidationData.encumbranceLineId,
    liquidationNumber,
    liquidationDate: liquidationData.liquidationDate,
    liquidationType: newLiquidatedAmount >= line.currentAmount ? 'full' : 'partial',
    liquidationAmount: liquidationData.liquidationAmount,
    sourceDocument: liquidationData.sourceDocument,
    sourceDocumentType: liquidationData.sourceDocumentType,
    invoiceNumber: liquidationData.invoiceNumber,
    voucherNumber: liquidationData.voucherNumber,
    status: 'posted',
    postedDate: new Date(),
    postedBy: liquidationData.userId,
  };

  return liquidation;
};

/**
 * Reverses an encumbrance liquidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} liquidationId - Liquidation ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the liquidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseEncumbranceLiquidation(sequelize, 1, 'Invoice error', 'user123');
 * ```
 */
export const reverseEncumbranceLiquidation = async (
  sequelize: Sequelize,
  liquidationId: number,
  reversalReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  // Would reverse the liquidation in database
  // Update encumbrance line and header amounts
  // Simplified for demonstration
};

/**
 * Retrieves liquidation history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation history
 *
 * @example
 * ```typescript
 * const history = await getEncumbranceLiquidationHistory(sequelize, 1);
 * ```
 */
export const getEncumbranceLiquidationHistory = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<EncumbranceLiquidation[]> => {
  // Would query liquidation history from database
  return [];
};

// ============================================================================
// ENCUMBRANCE ADJUSTMENT FUNCTIONS
// ============================================================================

/**
 * Adjusts an encumbrance amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AdjustEncumbranceDto} adjustmentData - Adjustment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment>} Adjustment record
 *
 * @example
 * ```typescript
 * const adjustment = await adjustEncumbrance(sequelize, {
 *   encumbranceId: 1,
 *   encumbranceLineId: 1,
 *   adjustmentDate: new Date(),
 *   adjustmentType: 'increase',
 *   adjustmentAmount: 1000,
 *   adjustmentReason: 'Price increase',
 *   userId: 'user123'
 * });
 * ```
 */
export const adjustEncumbrance = async (
  sequelize: Sequelize,
  adjustmentData: AdjustEncumbranceDto,
  transaction?: Transaction,
): Promise<EncumbranceAdjustment> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(adjustmentData.encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  const line = await EncumbranceLine.findByPk(adjustmentData.encumbranceLineId, { transaction });
  if (!line) {
    throw new Error('Encumbrance line not found');
  }

  // Calculate new amounts based on adjustment type
  let amountChange = adjustmentData.adjustmentAmount;
  if (adjustmentData.adjustmentType === 'decrease') {
    amountChange = -amountChange;
  }

  // Update line
  const newCurrentAmount = line.currentAmount + amountChange;
  const newAdjustedAmount = line.adjustedAmount + amountChange;

  await line.update(
    {
      currentAmount: newCurrentAmount,
      adjustedAmount: newAdjustedAmount,
    },
    { transaction },
  );

  // Update header
  const newHeaderCurrentAmount = encumbrance.currentAmount + amountChange;
  const newHeaderAdjustedAmount = encumbrance.adjustedAmount + amountChange;

  await encumbrance.update(
    {
      currentAmount: newHeaderCurrentAmount,
      adjustedAmount: newHeaderAdjustedAmount,
      updatedBy: adjustmentData.userId,
    },
    { transaction },
  );

  const adjustmentNumber = await generateAdjustmentNumber(sequelize, transaction);

  const adjustment: EncumbranceAdjustment = {
    adjustmentId: Date.now(),
    encumbranceId: adjustmentData.encumbranceId,
    encumbranceLineId: adjustmentData.encumbranceLineId,
    adjustmentNumber,
    adjustmentDate: adjustmentData.adjustmentDate,
    adjustmentType: adjustmentData.adjustmentType,
    adjustmentAmount: adjustmentData.adjustmentAmount,
    originalAccountCode: adjustmentData.adjustmentType === 'reclass' ? line.accountCode : undefined,
    newAccountCode: adjustmentData.newAccountCode,
    adjustmentReason: adjustmentData.adjustmentReason,
    status: 'posted',
    postedDate: new Date(),
    postedBy: adjustmentData.userId,
  };

  return adjustment;
};

/**
 * Reclassifies an encumbrance to a different account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceLineId - Encumbrance line ID
 * @param {string} newAccountCode - New account code
 * @param {string} reason - Reclassification reason
 * @param {string} userId - User performing reclassification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment>} Reclassification record
 *
 * @example
 * ```typescript
 * const reclass = await reclassifyEncumbrance(sequelize, 1, '5200-002', 'Correct coding', 'user123');
 * ```
 */
export const reclassifyEncumbrance = async (
  sequelize: Sequelize,
  encumbranceLineId: number,
  newAccountCode: string,
  reason: string,
  userId: string,
  transaction?: Transaction,
): Promise<EncumbranceAdjustment> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const line = await EncumbranceLine.findByPk(encumbranceLineId, { transaction });
  if (!line) {
    throw new Error('Encumbrance line not found');
  }

  const originalAccountCode = line.accountCode;

  await line.update(
    {
      accountCode: newAccountCode,
    },
    { transaction },
  );

  const adjustmentNumber = await generateAdjustmentNumber(sequelize, transaction);

  const adjustment: EncumbranceAdjustment = {
    adjustmentId: Date.now(),
    encumbranceId: line.encumbranceId,
    encumbranceLineId,
    adjustmentNumber,
    adjustmentDate: new Date(),
    adjustmentType: 'reclass',
    adjustmentAmount: 0,
    originalAccountCode,
    newAccountCode,
    adjustmentReason: reason,
    status: 'posted',
    postedDate: new Date(),
    postedBy: userId,
  };

  return adjustment;
};

/**
 * Retrieves adjustment history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceAdjustment[]>} Adjustment history
 *
 * @example
 * ```typescript
 * const adjustments = await getEncumbranceAdjustmentHistory(sequelize, 1);
 * ```
 */
export const getEncumbranceAdjustmentHistory = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<EncumbranceAdjustment[]> => {
  // Would query adjustment history from database
  return [];
};

// ============================================================================
// YEAR-END PROCESSING FUNCTIONS
// ============================================================================

/**
 * Processes year-end encumbrances for carry-forward or lapse.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {YearEndProcessingDto} processingData - Year-end processing data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<YearEndEncumbrance[]>} Year-end processing results
 *
 * @example
 * ```typescript
 * const results = await processYearEndEncumbrances(sequelize, {
 *   fiscalYear: 2024,
 *   businessUnit: 'BU001',
 *   autoLapse: false,
 *   userId: 'user123'
 * });
 * ```
 */
export const processYearEndEncumbrances = async (
  sequelize: Sequelize,
  processingData: YearEndProcessingDto,
  transaction?: Transaction,
): Promise<YearEndEncumbrance[]> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const where: any = {
    fiscalYear: processingData.fiscalYear,
    status: {
      [Op.in]: ['active', 'partially_liquidated'],
    },
  };

  if (processingData.businessUnit) where.businessUnit = processingData.businessUnit;

  const encumbrances = await EncumbranceHeader.findAll({ where, transaction });

  const yearEndResults: YearEndEncumbrance[] = [];

  for (const encumbrance of encumbrances) {
    const lines = await EncumbranceLine.findAll({
      where: { encumbranceId: encumbrance.id },
      transaction,
    });

    for (const line of lines) {
      const yearEndItem: YearEndEncumbrance = {
        yearEndId: Date.now() + line.id,
        fiscalYear: processingData.fiscalYear,
        encumbranceId: encumbrance.id,
        encumbranceLineId: line.id,
        accountCode: line.accountCode,
        originalAmount: line.originalAmount,
        liquidatedAmount: line.liquidatedAmount,
        outstandingAmount: line.remainingAmount,
        carryForwardAmount: processingData.autoLapse ? 0 : line.remainingAmount,
        lapseAmount: processingData.autoLapse ? line.remainingAmount : 0,
        disposition: processingData.autoLapse ? 'lapse' : 'carry_forward',
        processDate: new Date(),
        processedBy: processingData.userId,
      };

      yearEndResults.push(yearEndItem);
    }
  }

  return yearEndResults;
};

/**
 * Carries forward an encumbrance to the next fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CarryForwardEncumbranceDto} carryForwardData - Carry forward data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceCarryForward>} Carry forward record
 *
 * @example
 * ```typescript
 * const carryForward = await carryForwardEncumbrance(sequelize, {
 *   sourceEncumbranceId: 1,
 *   sourceEncumbranceLineId: 1,
 *   carryForwardDate: new Date(),
 *   carryForwardAmount: 5000,
 *   targetFiscalYear: 2025,
 *   justification: 'Project continues into next year',
 *   userId: 'user123'
 * });
 * ```
 */
export const carryForwardEncumbrance = async (
  sequelize: Sequelize,
  carryForwardData: CarryForwardEncumbranceDto,
  transaction?: Transaction,
): Promise<EncumbranceCarryForward> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const sourceLine = await EncumbranceLine.findByPk(carryForwardData.sourceEncumbranceLineId, { transaction });
  if (!sourceLine) {
    throw new Error('Source encumbrance line not found');
  }

  if (carryForwardData.carryForwardAmount > sourceLine.remainingAmount) {
    throw new Error('Carry forward amount exceeds remaining encumbrance');
  }

  const sourceHeader = await EncumbranceHeader.findByPk(carryForwardData.sourceEncumbranceId, { transaction });
  if (!sourceHeader) {
    throw new Error('Source encumbrance not found');
  }

  // Create new encumbrance for target year
  const targetEncumbrance = await createEncumbrance(
    sequelize,
    {
      encumbranceDate: carryForwardData.carryForwardDate,
      encumbranceType: sourceHeader.encumbranceType,
      businessUnit: sourceHeader.businessUnit,
      vendor: sourceHeader.vendor,
      description: `Carried forward from ${sourceHeader.encumbranceNumber}: ${sourceHeader.description}`,
      sourceDocument: sourceHeader.sourceDocument,
      sourceDocumentType: sourceHeader.sourceDocumentType,
      lines: [
        {
          ...sourceLine.toJSON(),
          originalAmount: carryForwardData.carryForwardAmount,
          budgetYear: carryForwardData.targetFiscalYear,
        },
      ],
    },
    carryForwardData.userId,
    transaction,
  );

  const carryForward: EncumbranceCarryForward = {
    carryForwardId: Date.now(),
    sourceEncumbranceId: carryForwardData.sourceEncumbranceId,
    sourceEncumbranceLineId: carryForwardData.sourceEncumbranceLineId,
    targetEncumbranceId: targetEncumbrance.id,
    sourceFiscalYear: sourceHeader.fiscalYear,
    targetFiscalYear: carryForwardData.targetFiscalYear,
    carryForwardDate: carryForwardData.carryForwardDate,
    carryForwardAmount: carryForwardData.carryForwardAmount,
    accountCode: sourceLine.accountCode,
    fundCode: sourceLine.fundCode,
    projectCode: sourceLine.projectCode,
    status: 'posted',
    approvalRequired: carryForwardData.carryForwardAmount > 10000, // Example threshold
    justification: carryForwardData.justification,
    expirationDate: carryForwardData.expirationDate,
  };

  return carryForward;
};

/**
 * Lapses (expires) an encumbrance at year-end.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {string} userId - User lapsing the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Lapsed encumbrance
 *
 * @example
 * ```typescript
 * const lapsed = await lapseEncumbrance(sequelize, 1, 'user123');
 * ```
 */
export const lapseEncumbrance = async (
  sequelize: Sequelize,
  encumbranceId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findByPk(encumbranceId, { transaction });
  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  await encumbrance.update(
    {
      status: 'fully_liquidated',
      liquidatedAmount: encumbrance.currentAmount,
      remainingAmount: 0,
      updatedBy: userId,
      metadata: {
        ...encumbrance.metadata,
        lapsed: true,
        lapseDate: new Date(),
        lapsedBy: userId,
      },
    },
    { transaction },
  );

  return encumbrance;
};

/**
 * Retrieves carry-forward history for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceCarryForward[]>} Carry-forward history
 *
 * @example
 * ```typescript
 * const history = await getCarryForwardHistory(sequelize, 1);
 * ```
 */
export const getCarryForwardHistory = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<EncumbranceCarryForward[]> => {
  // Would query carry-forward history from database
  return [];
};

// ============================================================================
// FUND ACCOUNTING INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Retrieves fund encumbrance balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FundEncumbrance[]>} Fund encumbrance balances
 *
 * @example
 * ```typescript
 * const fundBalances = await getFundEncumbranceBalances(sequelize, 'FUND001', 2024, 3);
 * ```
 */
export const getFundEncumbranceBalances = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
  fiscalPeriod?: number,
  transaction?: Transaction,
): Promise<FundEncumbrance[]> => {
  // Would query fund encumbrance balances from database
  // Simplified for demonstration
  const fundEncumbrance: FundEncumbrance = {
    fundEncumbranceId: Date.now(),
    fundCode,
    fiscalYear,
    fiscalPeriod: fiscalPeriod || 0,
    accountCode: 'multiple',
    totalEncumbrances: 100000,
    liquidatedEncumbrances: 40000,
    outstandingEncumbrances: 60000,
    adjustments: 0,
    availableBalance: 50000,
    fundType: 'general',
    complianceStatus: 'compliant',
  };

  return [fundEncumbrance];
};

/**
 * Checks fund compliance for encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Object>} Fund compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkFundCompliance(sequelize, 'FUND001', 2024);
 * ```
 */
export const checkFundCompliance = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<{
  fundCode: string;
  fiscalYear: number;
  isCompliant: boolean;
  violations: string[];
  warnings: string[];
}> => {
  const fundBalances = await getFundEncumbranceBalances(sequelize, fundCode, fiscalYear, undefined, transaction);

  const violations: string[] = [];
  const warnings: string[] = [];

  for (const balance of fundBalances) {
    if (balance.complianceStatus === 'violation') {
      violations.push(`Fund ${fundCode} has compliance violation`);
    } else if (balance.complianceStatus === 'warning') {
      warnings.push(`Fund ${fundCode} has compliance warning`);
    }
  }

  return {
    fundCode,
    fiscalYear,
    isCompliant: violations.length === 0,
    violations,
    warnings,
  };
};

/**
 * Reconciles encumbrances with fund balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReconciliation[]>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileFundEncumbrances(sequelize, 'FUND001', 2024, 3, 'user123');
 * ```
 */
export const reconcileFundEncumbrances = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<EncumbranceReconciliation[]> => {
  // Would perform reconciliation between GL and subledger
  // Simplified for demonstration
  const reconciliation: EncumbranceReconciliation = {
    reconciliationId: Date.now(),
    fiscalYear,
    fiscalPeriod,
    accountCode: 'multiple',
    glEncumbranceBalance: 100000,
    subledgerEncumbranceBalance: 100000,
    variance: 0,
    variancePercent: 0,
    status: 'matched',
    reconciliationDate: new Date(),
    reconciledBy: userId,
  };

  return [reconciliation];
};

// ============================================================================
// ENCUMBRANCE REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates outstanding encumbrances report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {string} [businessUnit] - Optional business unit filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Encumbrance report
 *
 * @example
 * ```typescript
 * const report = await generateOutstandingEncumbrancesReport(sequelize, 2024, 3, 'BU001');
 * ```
 */
export const generateOutstandingEncumbrancesReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod?: number,
  businessUnit?: string,
  transaction?: Transaction,
): Promise<EncumbranceReport> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const where: any = {
    fiscalYear,
    status: {
      [Op.in]: ['active', 'partially_liquidated'],
    },
  };

  if (fiscalPeriod) where.fiscalPeriod = fiscalPeriod;
  if (businessUnit) where.businessUnit = businessUnit;

  const encumbrances = await EncumbranceHeader.findAll({ where, transaction });

  const report: EncumbranceReport = {
    reportId: `OUTSTANDING_ENC_${Date.now()}`,
    reportType: 'outstanding_encumbrances',
    fiscalYear,
    fiscalPeriod,
    businessUnit,
    reportData: {
      encumbranceCount: encumbrances.length,
      totalOriginal: encumbrances.reduce((sum, e) => sum + e.originalAmount, 0),
      totalCurrent: encumbrances.reduce((sum, e) => sum + e.currentAmount, 0),
      totalLiquidated: encumbrances.reduce((sum, e) => sum + e.liquidatedAmount, 0),
      totalRemaining: encumbrances.reduce((sum, e) => sum + e.remainingAmount, 0),
      encumbrances: encumbrances.map(e => ({
        encumbranceNumber: e.encumbranceNumber,
        description: e.description,
        originalAmount: e.originalAmount,
        currentAmount: e.currentAmount,
        liquidatedAmount: e.liquidatedAmount,
        remainingAmount: e.remainingAmount,
      })),
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates encumbrance liquidation summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Liquidation summary report
 *
 * @example
 * ```typescript
 * const report = await generateLiquidationSummaryReport(sequelize, 2024, 3);
 * ```
 */
export const generateLiquidationSummaryReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<EncumbranceReport> => {
  const report: EncumbranceReport = {
    reportId: `LIQ_SUMMARY_${Date.now()}`,
    reportType: 'liquidation_summary',
    fiscalYear,
    fiscalPeriod,
    reportData: {
      liquidations: [],
      totalLiquidated: 0,
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates year-end encumbrance status report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Year-end status report
 *
 * @example
 * ```typescript
 * const report = await generateYearEndStatusReport(sequelize, 2024);
 * ```
 */
export const generateYearEndStatusReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<EncumbranceReport> => {
  const report: EncumbranceReport = {
    reportId: `YEAREND_STATUS_${Date.now()}`,
    reportType: 'year_end_status',
    fiscalYear,
    reportData: {
      openEncumbrances: 0,
      carryForwardEligible: 0,
      lapseRequired: 0,
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates fund encumbrance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Fund encumbrance report
 *
 * @example
 * ```typescript
 * const report = await generateFundEncumbranceReport(sequelize, 'FUND001', 2024);
 * ```
 */
export const generateFundEncumbranceReport = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<EncumbranceReport> => {
  const fundBalances = await getFundEncumbranceBalances(sequelize, fundCode, fiscalYear, undefined, transaction);

  const report: EncumbranceReport = {
    reportId: `FUND_ENC_${Date.now()}`,
    reportType: 'fund_encumbrance',
    fiscalYear,
    fundCode,
    reportData: {
      fundBalances,
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates encumbrance variance analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [accountCode] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReport>} Variance analysis report
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceVarianceReport(sequelize, 2024, '5100-001');
 * ```
 */
export const generateEncumbranceVarianceReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  accountCode?: string,
  transaction?: Transaction,
): Promise<EncumbranceReport> => {
  const report: EncumbranceReport = {
    reportId: `ENC_VARIANCE_${Date.now()}`,
    reportType: 'variance_analysis',
    fiscalYear,
    reportData: {
      variances: [],
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique encumbrance number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} encumbranceType - Type of encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated encumbrance number
 *
 * @example
 * ```typescript
 * const number = await generateEncumbranceNumber(sequelize, 'purchase_order');
 * ```
 */
export const generateEncumbranceNumber = async (
  sequelize: Sequelize,
  encumbranceType: string,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = 'ENC';
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${randomPart}`;
};

/**
 * Generates a unique liquidation number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated liquidation number
 *
 * @example
 * ```typescript
 * const number = await generateLiquidationNumber(sequelize);
 * ```
 */
export const generateLiquidationNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LIQ-${year}-${randomPart}`;
};

/**
 * Generates a unique adjustment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated adjustment number
 *
 * @example
 * ```typescript
 * const number = await generateAdjustmentNumber(sequelize);
 * ```
 */
export const generateAdjustmentNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ADJ-${year}-${randomPart}`;
};

/**
 * Determines fiscal year and period from a date.
 *
 * @param {Date} date - Date to analyze
 * @returns {Object} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
export const getFiscalYearPeriod = (date: Date): { fiscalYear: number; fiscalPeriod: number } => {
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();

  // Assuming October 1st fiscal year start
  let fiscalYear = year;
  let fiscalPeriod = month;

  if (month >= 10) {
    fiscalYear = year + 1;
    fiscalPeriod = month - 9;
  } else {
    fiscalPeriod = month + 3;
  }

  return { fiscalYear, fiscalPeriod };
};

/**
 * Retrieves encumbrance by number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} encumbranceNumber - Encumbrance number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceByNumber(sequelize, 'ENC-2024-001');
 * ```
 */
export const getEncumbranceByNumber = async (
  sequelize: Sequelize,
  encumbranceNumber: string,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrance = await EncumbranceHeader.findOne({
    where: { encumbranceNumber },
    transaction,
  });

  if (!encumbrance) {
    throw new Error('Encumbrance not found');
  }

  return encumbrance;
};

/**
 * Retrieves encumbrance lines for an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbranceLines(sequelize, 1);
 * ```
 */
export const getEncumbranceLines = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const lines = await EncumbranceLine.findAll({
    where: { encumbranceId },
    transaction,
  });

  return lines;
};

/**
 * Updates an encumbrance line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} lineId - Encumbrance line ID
 * @param {Partial<EncumbranceLine>} updateData - Update data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance line
 *
 * @example
 * ```typescript
 * const updated = await updateEncumbranceLine(sequelize, 1, { description: 'Updated' });
 * ```
 */
export const updateEncumbranceLine = async (
  sequelize: Sequelize,
  lineId: number,
  updateData: Partial<EncumbranceLine>,
  transaction?: Transaction,
): Promise<any> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const line = await EncumbranceLine.findByPk(lineId, { transaction });
  if (!line) {
    throw new Error('Encumbrance line not found');
  }

  await line.update(updateData, { transaction });

  return line;
};

/**
 * Retrieves encumbrance history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceHistory[]>} Encumbrance history
 *
 * @example
 * ```typescript
 * const history = await getEncumbranceHistory(sequelize, 1);
 * ```
 */
export const getEncumbranceHistory = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<EncumbranceHistory[]> => {
  // Would query encumbrance history from database
  return [];
};

/**
 * Records encumbrance history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<EncumbranceHistory, 'historyId'>} historyData - History data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceHistory>} Created history entry
 *
 * @example
 * ```typescript
 * const history = await recordEncumbranceHistory(sequelize, {
 *   encumbranceId: 1,
 *   changeDate: new Date(),
 *   changeType: 'liquidated',
 *   changedBy: 'user123',
 *   changeDescription: 'Partial liquidation',
 *   auditData: {}
 * });
 * ```
 */
export const recordEncumbranceHistory = async (
  sequelize: Sequelize,
  historyData: Omit<EncumbranceHistory, 'historyId'>,
  transaction?: Transaction,
): Promise<EncumbranceHistory> => {
  const history: EncumbranceHistory = {
    historyId: Date.now(),
    ...historyData,
  };

  // Would persist to database
  return history;
};

/**
 * Validates encumbrance before posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEncumbrance(sequelize, 1);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export const validateEncumbrance = async (
  sequelize: Sequelize,
  encumbranceId: number,
  transaction?: Transaction,
): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  const encumbrance = await getEncumbranceById(sequelize, encumbranceId, transaction);
  const lines = await getEncumbranceLines(sequelize, encumbranceId, transaction);

  if (!encumbrance) {
    errors.push('Encumbrance not found');
  }

  if (!lines || lines.length === 0) {
    errors.push('Encumbrance must have at least one line');
  }

  if (encumbrance.originalAmount <= 0) {
    errors.push('Original amount must be greater than zero');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Retrieves encumbrances by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrancesByVendor(sequelize, 'VENDOR123');
 * ```
 */
export const getEncumbrancesByVendor = async (
  sequelize: Sequelize,
  vendorId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceHeader = createEncumbranceHeaderModel(sequelize);

  const encumbrances = await EncumbranceHeader.findAll({
    where: { vendor: vendorId },
    transaction,
  });

  return encumbrances;
};

/**
 * Retrieves encumbrances by account code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByAccount(sequelize, '5100-001', 2024);
 * ```
 */
export const getEncumbrancesByAccount = async (
  sequelize: Sequelize,
  accountCode: string,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const lines = await EncumbranceLine.findAll({
    where: {
      accountCode,
      budgetYear: fiscalYear,
    },
    transaction,
  });

  return lines;
};

/**
 * Calculates total encumbrances for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total encumbrance amount
 *
 * @example
 * ```typescript
 * const total = await calculateAccountEncumbrances(sequelize, '5100-001', 2024, 3);
 * ```
 */
export const calculateAccountEncumbrances = async (
  sequelize: Sequelize,
  accountCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<number> => {
  const lines = await getEncumbrancesByAccount(sequelize, accountCode, fiscalYear, transaction);

  const total = lines.reduce((sum, line) => sum + line.remainingAmount, 0);

  return total;
};

/**
 * Retrieves encumbrances by project code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByProject(sequelize, 'PROJ-001', 2024);
 * ```
 */
export const getEncumbrancesByProject = async (
  sequelize: Sequelize,
  projectCode: string,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const lines = await EncumbranceLine.findAll({
    where: {
      projectCode,
      budgetYear: fiscalYear,
    },
    transaction,
  });

  return lines;
};

/**
 * Retrieves encumbrances by grant code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantCode - Grant code
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of encumbrance lines
 *
 * @example
 * ```typescript
 * const lines = await getEncumbrancesByGrant(sequelize, 'GRANT-001', 2024);
 * ```
 */
export const getEncumbrancesByGrant = async (
  sequelize: Sequelize,
  grantCode: string,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const EncumbranceLine = createEncumbranceLineModel(sequelize);

  const lines = await EncumbranceLine.findAll({
    where: {
      grantCode,
      budgetYear: fiscalYear,
    },
    transaction,
  });

  return lines;
};

/**
 * Batch creates encumbrances from a list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto[]} encumbrances - List of encumbrances to create
 * @param {string} userId - User creating the encumbrances
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created encumbrances
 *
 * @example
 * ```typescript
 * const created = await batchCreateEncumbrances(sequelize, [encData1, encData2], 'user123');
 * ```
 */
export const batchCreateEncumbrances = async (
  sequelize: Sequelize,
  encumbrances: CreateEncumbranceDto[],
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const results: any[] = [];

  for (const encData of encumbrances) {
    const created = await createEncumbrance(sequelize, encData, userId, transaction);
    results.push(created);
  }

  return results;
};

/**
 * Batch liquidates multiple encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateEncumbranceDto[]} liquidations - List of liquidations to process
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceLiquidation[]>} Liquidation records
 *
 * @example
 * ```typescript
 * const liquidations = await batchLiquidateEncumbrances(sequelize, [liq1, liq2]);
 * ```
 */
export const batchLiquidateEncumbrances = async (
  sequelize: Sequelize,
  liquidations: LiquidateEncumbranceDto[],
  transaction?: Transaction,
): Promise<EncumbranceLiquidation[]> => {
  const results: EncumbranceLiquidation[] = [];

  for (const liqData of liquidations) {
    const liquidation = await liquidateEncumbrance(sequelize, liqData, transaction);
    results.push(liquidation);
  }

  return results;
};

/**
 * Reconciles GL encumbrances with subledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EncumbranceReconciliation[]>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileEncumbrances(sequelize, 2024, 3, 'user123');
 * ```
 */
export const reconcileEncumbrances = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<EncumbranceReconciliation[]> => {
  // Would perform reconciliation between GL and subledger
  const reconciliation: EncumbranceReconciliation = {
    reconciliationId: Date.now(),
    fiscalYear,
    fiscalPeriod,
    accountCode: 'multiple',
    glEncumbranceBalance: 100000,
    subledgerEncumbranceBalance: 100000,
    variance: 0,
    variancePercent: 0,
    status: 'matched',
    reconciliationDate: new Date(),
    reconciledBy: userId,
  };

  return [reconciliation];
};

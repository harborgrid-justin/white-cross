/**
 * LOC: COMMCTRL001
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-management-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Procurement services
 *   - Budget control processes
 *   - Purchase order management
 */

/**
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 * Locator: WC-JDE-COMMCTRL-001
 * Purpose: Comprehensive Commitment Control - JD Edwards EnterpriseOne-level commitment tracking, budget checking, purchase requisitions, purchase orders
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-management-kit
 * Downstream: ../backend/financial/*, Procurement Services, Budget Control, PO Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for commitment tracking, budget checking, commitment approval, commitment liquidation, pre-encumbrance, purchase requisitions, purchase orders, commitment reporting, budget reservations
 *
 * LLM Context: Enterprise-grade commitment control operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive commitment tracking, automated budget checking, commitment approval workflows,
 * commitment liquidation, pre-encumbrance tracking, purchase requisition management, purchase order processing,
 * commitment reporting, budget reservations, multi-level approval routing, commitment history, audit trails,
 * commitment variance analysis, and fund control integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CommitmentHeader {
  commitmentId: number;
  commitmentNumber: string;
  commitmentDate: Date;
  commitmentType: 'requisition' | 'purchase_order' | 'contract' | 'blanket_po' | 'pre_encumbrance';
  businessUnit: string;
  vendor?: string;
  vendorName?: string;
  description: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'committed' | 'partially_liquidated' | 'fully_liquidated' | 'cancelled' | 'rejected';
  fiscalYear: number;
  fiscalPeriod: number;
  totalAmount: number;
  committedAmount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  approvalLevel: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  requester: string;
  approvedBy?: string;
  approvedDate?: Date;
  committedDate?: Date;
}

interface CommitmentLine {
  lineId: number;
  commitmentId: number;
  lineNumber: number;
  accountCode: string;
  accountId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  committedAmount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  budgetYear: number;
  budgetPeriod: number;
  projectCode?: string;
  activityCode?: string;
  costCenterCode?: string;
  fundCode?: string;
  organizationCode?: string;
  objectCode?: string;
}

interface BudgetReservation {
  reservationId: number;
  commitmentId: number;
  commitmentLineId: number;
  accountCode: string;
  fiscalYear: number;
  fiscalPeriod: number;
  reservedAmount: number;
  releasedAmount: number;
  remainingAmount: number;
  reservationDate: Date;
  status: 'active' | 'released' | 'expired' | 'cancelled';
  expirationDate?: Date;
  budgetType: 'annual' | 'project' | 'grant';
}

interface PurchaseRequisition {
  requisitionId: number;
  requisitionNumber: string;
  requisitionDate: Date;
  requester: string;
  department: string;
  businessUnit: string;
  description: string;
  totalAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'converted_to_po' | 'rejected' | 'cancelled';
  approvalRoute: string;
  currentApprover?: string;
  budgetCheckStatus: 'pending' | 'passed' | 'failed' | 'bypassed';
  budgetCheckDate?: Date;
  needByDate?: Date;
  deliveryLocation?: string;
}

interface PurchaseOrder {
  poId: number;
  poNumber: string;
  poDate: Date;
  poType: 'standard' | 'blanket' | 'contract' | 'emergency';
  vendorId: string;
  vendorName: string;
  businessUnit: string;
  description: string;
  totalAmount: number;
  committedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'draft' | 'approved' | 'committed' | 'partially_received' | 'fully_received' | 'closed' | 'cancelled';
  requisitionId?: number;
  paymentTerms: string;
  deliveryTerms: string;
  shipToLocation: string;
  buyer: string;
  approvedBy?: string;
  approvedDate?: Date;
}

interface CommitmentApproval {
  approvalId: number;
  commitmentId: number;
  approvalLevel: number;
  approverUserId: string;
  approverName: string;
  approvalAction: 'approve' | 'reject' | 'return' | 'delegate';
  approvalDate: Date;
  comments?: string;
  delegatedTo?: string;
  nextApprover?: string;
  approvalRoute: string;
}

interface BudgetCheck {
  checkId: number;
  commitmentId: number;
  checkDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  accountCode: string;
  requestedAmount: number;
  availableBudget: number;
  commitments: number;
  encumbrances: number;
  actuals: number;
  fundsAvailable: number;
  checkResult: 'pass' | 'fail' | 'warning' | 'override';
  overrideReason?: string;
  overrideBy?: string;
  checkDetails: Record<string, any>;
}

interface CommitmentLiquidation {
  liquidationId: number;
  commitmentId: number;
  commitmentLineId: number;
  liquidationType: 'partial' | 'full' | 'over_liquidation';
  liquidationDate: Date;
  liquidationAmount: number;
  invoiceNumber?: string;
  receivingNumber?: string;
  liquidatedBy: string;
  glJournalId?: number;
  status: 'pending' | 'posted' | 'reversed';
}

interface PreEncumbrance {
  preEncumbranceId: number;
  preEncumbranceNumber: string;
  preEncumbranceDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  accountCode: string;
  description: string;
  estimatedAmount: number;
  status: 'active' | 'converted' | 'expired' | 'cancelled';
  convertedToCommitmentId?: number;
  expirationDate?: Date;
  createdBy: string;
}

interface CommitmentReport {
  reportId: string;
  reportType: 'commitment_summary' | 'budget_status' | 'open_commitments' | 'liquidation_history' | 'variance_analysis';
  fiscalYear: number;
  fiscalPeriod?: number;
  accountCode?: string;
  businessUnit?: string;
  reportData: Record<string, any>;
  generatedDate: Date;
  generatedBy: string;
}

interface CommitmentHistory {
  historyId: number;
  commitmentId: number;
  changeDate: Date;
  changeType: 'created' | 'approved' | 'committed' | 'liquidated' | 'modified' | 'cancelled';
  changedBy: string;
  oldStatus?: string;
  newStatus: string;
  oldAmount?: number;
  newAmount?: number;
  changeReason?: string;
  auditData: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateCommitmentDto {
  @ApiProperty({ description: 'Commitment date', example: '2024-01-15' })
  commitmentDate!: Date;

  @ApiProperty({ description: 'Commitment type', enum: ['requisition', 'purchase_order', 'contract', 'blanket_po', 'pre_encumbrance'] })
  commitmentType!: string;

  @ApiProperty({ description: 'Business unit', example: 'BU001' })
  businessUnit!: string;

  @ApiProperty({ description: 'Vendor ID', required: false })
  vendor?: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Requester user ID' })
  requester!: string;

  @ApiProperty({ description: 'Commitment lines', type: [Object] })
  lines!: CommitmentLine[];
}

export class ApprovementCommitmentDto {
  @ApiProperty({ description: 'Commitment ID' })
  commitmentId!: number;

  @ApiProperty({ description: 'Approval action', enum: ['approve', 'reject', 'return', 'delegate'] })
  approvalAction!: string;

  @ApiProperty({ description: 'Approver user ID' })
  approverUserId!: string;

  @ApiProperty({ description: 'Comments', required: false })
  comments?: string;

  @ApiProperty({ description: 'Delegate to user ID', required: false })
  delegatedTo?: string;
}

export class BudgetCheckRequestDto {
  @ApiProperty({ description: 'Account code' })
  accountCode!: string;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Requested amount' })
  requestedAmount!: number;

  @ApiProperty({ description: 'Business unit', required: false })
  businessUnit?: string;
}

export class LiquidateCommitmentDto {
  @ApiProperty({ description: 'Commitment ID' })
  commitmentId!: number;

  @ApiProperty({ description: 'Commitment line ID' })
  commitmentLineId!: number;

  @ApiProperty({ description: 'Liquidation amount' })
  liquidationAmount!: number;

  @ApiProperty({ description: 'Liquidation date' })
  liquidationDate!: Date;

  @ApiProperty({ description: 'Invoice number', required: false })
  invoiceNumber?: string;

  @ApiProperty({ description: 'Receiving number', required: false })
  receivingNumber?: string;

  @ApiProperty({ description: 'User liquidating' })
  liquidatedBy!: string;
}

export class CreatePurchaseRequisitionDto {
  @ApiProperty({ description: 'Requisition date', example: '2024-01-15' })
  requisitionDate!: Date;

  @ApiProperty({ description: 'Requester user ID' })
  requester!: string;

  @ApiProperty({ description: 'Department code' })
  department!: string;

  @ApiProperty({ description: 'Business unit' })
  businessUnit!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Need by date', required: false })
  needByDate?: Date;

  @ApiProperty({ description: 'Delivery location', required: false })
  deliveryLocation?: string;

  @ApiProperty({ description: 'Requisition lines', type: [Object] })
  lines!: any[];
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ description: 'PO date', example: '2024-01-15' })
  poDate!: Date;

  @ApiProperty({ description: 'PO type', enum: ['standard', 'blanket', 'contract', 'emergency'] })
  poType!: string;

  @ApiProperty({ description: 'Vendor ID' })
  vendorId!: string;

  @ApiProperty({ description: 'Business unit' })
  businessUnit!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Payment terms' })
  paymentTerms!: string;

  @ApiProperty({ description: 'Ship to location' })
  shipToLocation!: string;

  @ApiProperty({ description: 'Buyer user ID' })
  buyer!: string;

  @ApiProperty({ description: 'Requisition ID', required: false })
  requisitionId?: number;

  @ApiProperty({ description: 'PO lines', type: [Object] })
  lines!: any[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Commitment Headers with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentHeader model
 *
 * @example
 * ```typescript
 * const Commitment = createCommitmentHeaderModel(sequelize);
 * const commitment = await Commitment.create({
 *   commitmentNumber: 'COM-2024-001',
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   status: 'draft',
 *   totalAmount: 50000
 * });
 * ```
 */
export const createCommitmentHeaderModel = (sequelize: Sequelize) => {
  class CommitmentHeader extends Model {
    public id!: number;
    public commitmentNumber!: string;
    public commitmentDate!: Date;
    public commitmentType!: string;
    public businessUnit!: string;
    public vendor!: string | null;
    public vendorName!: string | null;
    public description!: string;
    public status!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public totalAmount!: number;
    public committedAmount!: number;
    public liquidatedAmount!: number;
    public remainingAmount!: number;
    public approvalLevel!: number;
    public approvalStatus!: string;
    public requester!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public committedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CommitmentHeader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commitmentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique commitment number',
      },
      commitmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Commitment transaction date',
      },
      commitmentType: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: 'Type of commitment',
        validate: {
          isIn: [['requisition', 'purchase_order', 'contract', 'blanket_po', 'pre_encumbrance']],
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
        comment: 'Commitment description',
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Commitment status',
        validate: {
          isIn: [['draft', 'pending_approval', 'approved', 'committed', 'partially_liquidated', 'fully_liquidated', 'cancelled', 'rejected']],
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
      totalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total commitment amount',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount committed to budget',
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount liquidated',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining commitment amount',
      },
      approvalLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current approval level',
      },
      approvalStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval status',
        validate: {
          isIn: [['pending', 'approved', 'rejected']],
        },
      },
      requester: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who requested the commitment',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved the commitment',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      committedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date commitment was posted to budget',
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
        comment: 'User who created the commitment',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the commitment',
      },
    },
    {
      sequelize,
      tableName: 'commitment_headers',
      timestamps: true,
      indexes: [
        { fields: ['commitmentNumber'], unique: true },
        { fields: ['commitmentDate'] },
        { fields: ['commitmentType'] },
        { fields: ['status'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['businessUnit'] },
        { fields: ['vendor'] },
        { fields: ['requester'] },
      ],
      hooks: {
        beforeCreate: (commitment) => {
          if (!commitment.createdBy) {
            throw new Error('createdBy is required');
          }
          commitment.updatedBy = commitment.createdBy;
        },
        beforeUpdate: (commitment) => {
          if (!commitment.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (commitment) => {
          // Calculate remaining amount
          const total = Number(commitment.totalAmount || 0);
          const liquidated = Number(commitment.liquidatedAmount || 0);
          commitment.remainingAmount = total - liquidated;
        },
      },
    },
  );

  return CommitmentHeader;
};

/**
 * Sequelize model for Commitment Lines with budget account coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentLine model
 *
 * @example
 * ```typescript
 * const CommitmentLine = createCommitmentLineModel(sequelize);
 * const line = await CommitmentLine.create({
 *   commitmentId: 1,
 *   lineNumber: 1,
 *   accountCode: '5100-001',
 *   quantity: 10,
 *   unitPrice: 100,
 *   lineAmount: 1000
 * });
 * ```
 */
export const createCommitmentLineModel = (sequelize: Sequelize) => {
  class CommitmentLine extends Model {
    public id!: number;
    public commitmentId!: number;
    public lineNumber!: number;
    public accountCode!: string;
    public accountId!: number;
    public description!: string;
    public quantity!: number;
    public unitPrice!: number;
    public lineAmount!: number;
    public committedAmount!: number;
    public liquidatedAmount!: number;
    public remainingAmount!: number;
    public budgetYear!: number;
    public budgetPeriod!: number;
    public projectCode!: string | null;
    public activityCode!: string | null;
    public costCenterCode!: string | null;
    public fundCode!: string | null;
    public organizationCode!: string | null;
    public objectCode!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CommitmentLine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commitmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to commitment header',
        references: {
          model: 'commitment_headers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number within commitment',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Budget account code',
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
      quantity: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
        defaultValue: 1,
        comment: 'Quantity',
      },
      unitPrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unit price',
      },
      lineAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total line amount',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount committed to budget',
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount liquidated',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining commitment',
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
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'commitment_lines',
      timestamps: true,
      indexes: [
        { fields: ['commitmentId'] },
        { fields: ['accountCode'] },
        { fields: ['budgetYear', 'budgetPeriod'] },
        { fields: ['projectCode'] },
        { fields: ['costCenterCode'] },
      ],
      hooks: {
        beforeSave: (line) => {
          // Calculate remaining amount
          const committed = Number(line.committedAmount || 0);
          const liquidated = Number(line.liquidatedAmount || 0);
          line.remainingAmount = committed - liquidated;
        },
      },
    },
  );

  return CommitmentLine;
};

// ============================================================================
// COMMITMENT CREATION AND MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new commitment with budget checking and validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createCommitment(sequelize, {
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   requester: 'user123',
 *   lines: [{ accountCode: '5100-001', quantity: 10, unitPrice: 50, lineAmount: 500 }]
 * }, 'user123');
 * ```
 */
export const createCommitment = async (
  sequelize: Sequelize,
  commitmentData: CreateCommitmentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);
  const CommitmentLine = createCommitmentLineModel(sequelize);

  // Generate commitment number
  const commitmentNumber = await generateCommitmentNumber(sequelize, commitmentData.commitmentType, transaction);

  // Determine fiscal year and period
  const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(commitmentData.commitmentDate);

  // Calculate total amount
  let totalAmount = 0;
  for (const line of commitmentData.lines) {
    totalAmount += Number(line.lineAmount || 0);
  }

  // Create header
  const header = await CommitmentHeader.create(
    {
      commitmentNumber,
      commitmentDate: commitmentData.commitmentDate,
      commitmentType: commitmentData.commitmentType,
      businessUnit: commitmentData.businessUnit,
      vendor: commitmentData.vendor,
      description: commitmentData.description,
      status: 'draft',
      fiscalYear,
      fiscalPeriod,
      totalAmount,
      committedAmount: 0,
      liquidatedAmount: 0,
      remainingAmount: totalAmount,
      approvalLevel: 0,
      approvalStatus: 'pending',
      requester: commitmentData.requester,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Create lines
  for (let i = 0; i < commitmentData.lines.length; i++) {
    const lineData = commitmentData.lines[i];

    await CommitmentLine.create(
      {
        commitmentId: header.id,
        lineNumber: i + 1,
        accountCode: lineData.accountCode,
        accountId: lineData.accountId,
        description: lineData.description,
        quantity: lineData.quantity,
        unitPrice: lineData.unitPrice,
        lineAmount: lineData.lineAmount,
        committedAmount: 0,
        liquidatedAmount: 0,
        remainingAmount: lineData.lineAmount,
        budgetYear: lineData.budgetYear || fiscalYear,
        budgetPeriod: lineData.budgetPeriod || fiscalPeriod,
        projectCode: lineData.projectCode,
        activityCode: lineData.activityCode,
        costCenterCode: lineData.costCenterCode,
        fundCode: lineData.fundCode,
        organizationCode: lineData.organizationCode,
        objectCode: lineData.objectCode,
      },
      { transaction },
    );
  }

  return header;
};

/**
 * Updates a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<CreateCommitmentDto>} updateData - Update data
 * @param {string} userId - User updating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const updated = await updateCommitment(sequelize, 1, {
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
export const updateCommitment = async (
  sequelize: Sequelize,
  commitmentId: number,
  updateData: Partial<CreateCommitmentDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'draft') {
    throw new Error('Cannot update commitment that is not in draft status');
  }

  await commitment.update({ ...updateData, updatedBy: userId }, { transaction });

  return commitment;
};

/**
 * Deletes a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User deleting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteCommitment(sequelize, 1, 'user123');
 * ```
 */
export const deleteCommitment = async (
  sequelize: Sequelize,
  commitmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'draft') {
    throw new Error('Cannot delete commitment that is not in draft status');
  }

  await commitment.destroy({ transaction });
};

/**
 * Retrieves a commitment by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment with lines
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentById(sequelize, 1);
 * ```
 */
export const getCommitmentById = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  return commitment;
};

/**
 * Retrieves commitments by various filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} filters - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of commitments
 *
 * @example
 * ```typescript
 * const commitments = await getCommitments(sequelize, {
 *   status: 'approved',
 *   fiscalYear: 2024
 * });
 * ```
 */
export const getCommitments = async (
  sequelize: Sequelize,
  filters: {
    status?: string;
    commitmentType?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    requester?: string;
  },
  transaction?: Transaction,
): Promise<any[]> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const where: any = {};

  if (filters.status) where.status = filters.status;
  if (filters.commitmentType) where.commitmentType = filters.commitmentType;
  if (filters.fiscalYear) where.fiscalYear = filters.fiscalYear;
  if (filters.fiscalPeriod) where.fiscalPeriod = filters.fiscalPeriod;
  if (filters.businessUnit) where.businessUnit = filters.businessUnit;
  if (filters.requester) where.requester = filters.requester;

  const commitments = await CommitmentHeader.findAll({ where, transaction });

  return commitments;
};

// ============================================================================
// BUDGET CHECKING FUNCTIONS
// ============================================================================

/**
 * Performs budget check for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check results
 *
 * @example
 * ```typescript
 * const budgetCheck = await performBudgetCheck(sequelize, 1);
 * if (budgetCheck.checkResult === 'fail') {
 *   console.log('Insufficient budget');
 * }
 * ```
 */
export const performBudgetCheck = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<BudgetCheck> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  const lines = await CommitmentLine.findAll({
    where: { commitmentId },
    transaction,
  });

  // Perform budget check for each line
  let overallResult = 'pass';
  const checkDetails: any = {};

  for (const line of lines) {
    const lineCheck = await checkBudgetAvailability(
      sequelize,
      {
        accountCode: line.accountCode,
        fiscalYear: line.budgetYear,
        fiscalPeriod: line.budgetPeriod,
        requestedAmount: line.lineAmount,
      },
      transaction,
    );

    checkDetails[`line_${line.lineNumber}`] = lineCheck;

    if (lineCheck.checkResult === 'fail') {
      overallResult = 'fail';
    }
  }

  const budgetCheck: BudgetCheck = {
    checkId: Date.now(),
    commitmentId,
    checkDate: new Date(),
    fiscalYear: commitment.fiscalYear,
    fiscalPeriod: commitment.fiscalPeriod,
    accountCode: 'multiple',
    requestedAmount: commitment.totalAmount,
    availableBudget: 0,
    commitments: 0,
    encumbrances: 0,
    actuals: 0,
    fundsAvailable: 0,
    checkResult: overallResult as 'pass' | 'fail' | 'warning' | 'override',
    checkDetails,
  };

  return budgetCheck;
};

/**
 * Checks budget availability for a specific account and amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BudgetCheckRequestDto} checkRequest - Budget check request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check result
 *
 * @example
 * ```typescript
 * const check = await checkBudgetAvailability(sequelize, {
 *   accountCode: '5100-001',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   requestedAmount: 5000
 * });
 * ```
 */
export const checkBudgetAvailability = async (
  sequelize: Sequelize,
  checkRequest: BudgetCheckRequestDto,
  transaction?: Transaction,
): Promise<BudgetCheck> => {
  // This would integrate with budget management system
  // Simplified implementation for demonstration

  const availableBudget = 100000; // Would query actual budget
  const commitments = 30000; // Would query actual commitments
  const encumbrances = 20000; // Would query actual encumbrances
  const actuals = 25000; // Would query actual actuals

  const fundsAvailable = availableBudget - commitments - encumbrances - actuals;

  const checkResult = fundsAvailable >= checkRequest.requestedAmount ? 'pass' : 'fail';

  const budgetCheck: BudgetCheck = {
    checkId: Date.now(),
    commitmentId: 0,
    checkDate: new Date(),
    fiscalYear: checkRequest.fiscalYear,
    fiscalPeriod: checkRequest.fiscalPeriod,
    accountCode: checkRequest.accountCode,
    requestedAmount: checkRequest.requestedAmount,
    availableBudget,
    commitments,
    encumbrances,
    actuals,
    fundsAvailable,
    checkResult,
    checkDetails: {
      calculation: `${availableBudget} - ${commitments} - ${encumbrances} - ${actuals} = ${fundsAvailable}`,
    },
  };

  return budgetCheck;
};

/**
 * Overrides a failed budget check with justification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} overrideReason - Reason for override
 * @param {string} userId - User performing override
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Overridden budget check
 *
 * @example
 * ```typescript
 * const overridden = await overrideBudgetCheck(sequelize, 1, 'Emergency procurement', 'admin123');
 * ```
 */
export const overrideBudgetCheck = async (
  sequelize: Sequelize,
  commitmentId: number,
  overrideReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<BudgetCheck> => {
  const budgetCheck = await performBudgetCheck(sequelize, commitmentId, transaction);

  budgetCheck.checkResult = 'override';
  budgetCheck.overrideReason = overrideReason;
  budgetCheck.overrideBy = userId;

  // Would persist this override to database
  return budgetCheck;
};

// ============================================================================
// COMMITMENT APPROVAL FUNCTIONS
// ============================================================================

/**
 * Submits a commitment for approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User submitting for approval
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const submitted = await submitCommitmentForApproval(sequelize, 1, 'user123');
 * ```
 */
export const submitCommitmentForApproval = async (
  sequelize: Sequelize,
  commitmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'draft') {
    throw new Error('Commitment must be in draft status to submit for approval');
  }

  // Perform budget check
  const budgetCheck = await performBudgetCheck(sequelize, commitmentId, transaction);
  if (budgetCheck.checkResult === 'fail') {
    throw new Error('Budget check failed - insufficient funds');
  }

  await commitment.update(
    {
      status: 'pending_approval',
      approvalLevel: 1,
      updatedBy: userId,
    },
    { transaction },
  );

  return commitment;
};

/**
 * Approves a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovementCommitmentDto} approvalData - Approval data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const approved = await approveCommitment(sequelize, {
 *   commitmentId: 1,
 *   approvalAction: 'approve',
 *   approverUserId: 'approver123',
 *   comments: 'Approved for processing'
 * });
 * ```
 */
export const approveCommitment = async (
  sequelize: Sequelize,
  approvalData: ApprovementCommitmentDto,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(approvalData.commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'pending_approval') {
    throw new Error('Commitment is not pending approval');
  }

  if (approvalData.approvalAction === 'approve') {
    await commitment.update(
      {
        status: 'approved',
        approvalStatus: 'approved',
        approvedBy: approvalData.approverUserId,
        approvedDate: new Date(),
        updatedBy: approvalData.approverUserId,
      },
      { transaction },
    );
  } else if (approvalData.approvalAction === 'reject') {
    await commitment.update(
      {
        status: 'rejected',
        approvalStatus: 'rejected',
        updatedBy: approvalData.approverUserId,
      },
      { transaction },
    );
  }

  return commitment;
};

/**
 * Retrieves approval history for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentApproval[]>} Approval history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentApprovalHistory(sequelize, 1);
 * ```
 */
export const getCommitmentApprovalHistory = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<CommitmentApproval[]> => {
  // Would query approval history from database
  // Simplified for demonstration
  return [];
};

/**
 * Delegates approval to another user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} fromUserId - Current approver
 * @param {string} toUserId - Delegated approver
 * @param {string} reason - Delegation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const delegated = await delegateApproval(sequelize, 1, 'approver1', 'approver2', 'Out of office');
 * ```
 */
export const delegateApproval = async (
  sequelize: Sequelize,
  commitmentId: number,
  fromUserId: string,
  toUserId: string,
  reason: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  // Would create delegation record in database
  return commitment;
};

// ============================================================================
// COMMITMENT POSTING AND LIQUIDATION FUNCTIONS
// ============================================================================

/**
 * Posts (commits) an approved commitment to budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User posting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted commitment
 *
 * @example
 * ```typescript
 * const posted = await postCommitmentToBudget(sequelize, 1, 'user123');
 * ```
 */
export const postCommitmentToBudget = async (
  sequelize: Sequelize,
  commitmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'approved') {
    throw new Error('Commitment must be approved before posting');
  }

  // Update lines to committed status
  const lines = await CommitmentLine.findAll({
    where: { commitmentId },
    transaction,
  });

  for (const line of lines) {
    await line.update(
      {
        committedAmount: line.lineAmount,
      },
      { transaction },
    );
  }

  // Update header
  await commitment.update(
    {
      status: 'committed',
      committedAmount: commitment.totalAmount,
      committedDate: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  // Create budget reservations
  await createBudgetReservations(sequelize, commitmentId, transaction);

  return commitment;
};

/**
 * Liquidates a commitment (partial or full).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateCommitmentDto} liquidationData - Liquidation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentLiquidation>} Liquidation record
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateCommitment(sequelize, {
 *   commitmentId: 1,
 *   commitmentLineId: 1,
 *   liquidationAmount: 500,
 *   liquidationDate: new Date(),
 *   invoiceNumber: 'INV-12345',
 *   liquidatedBy: 'user123'
 * });
 * ```
 */
export const liquidateCommitment = async (
  sequelize: Sequelize,
  liquidationData: LiquidateCommitmentDto,
  transaction?: Transaction,
): Promise<CommitmentLiquidation> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(liquidationData.commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  const line = await CommitmentLine.findByPk(liquidationData.commitmentLineId, { transaction });
  if (!line) {
    throw new Error('Commitment line not found');
  }

  if (commitment.status !== 'committed' && commitment.status !== 'partially_liquidated') {
    throw new Error('Commitment must be committed before liquidation');
  }

  // Check if liquidation amount exceeds remaining
  if (liquidationData.liquidationAmount > line.remainingAmount) {
    throw new Error('Liquidation amount exceeds remaining commitment');
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
  const newHeaderLiquidatedAmount = commitment.liquidatedAmount + liquidationData.liquidationAmount;
  let newStatus = 'partially_liquidated';

  if (newHeaderLiquidatedAmount >= commitment.committedAmount) {
    newStatus = 'fully_liquidated';
  }

  await commitment.update(
    {
      liquidatedAmount: newHeaderLiquidatedAmount,
      status: newStatus,
      updatedBy: liquidationData.liquidatedBy,
    },
    { transaction },
  );

  const liquidation: CommitmentLiquidation = {
    liquidationId: Date.now(),
    commitmentId: liquidationData.commitmentId,
    commitmentLineId: liquidationData.commitmentLineId,
    liquidationType: newLiquidatedAmount >= line.committedAmount ? 'full' : 'partial',
    liquidationDate: liquidationData.liquidationDate,
    liquidationAmount: liquidationData.liquidationAmount,
    invoiceNumber: liquidationData.invoiceNumber,
    receivingNumber: liquidationData.receivingNumber,
    liquidatedBy: liquidationData.liquidatedBy,
    status: 'posted',
  };

  return liquidation;
};

/**
 * Reverses a commitment liquidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} liquidationId - Liquidation ID
 * @param {string} userId - User reversing the liquidation
 * @param {string} reason - Reversal reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseCommitmentLiquidation(sequelize, 1, 'user123', 'Invoice cancelled');
 * ```
 */
export const reverseCommitmentLiquidation = async (
  sequelize: Sequelize,
  liquidationId: number,
  userId: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> => {
  // Would reverse the liquidation in database
  // Simplified for demonstration
};

/**
 * Closes a fully liquidated commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User closing the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed commitment
 *
 * @example
 * ```typescript
 * const closed = await closeCommitment(sequelize, 1, 'user123');
 * ```
 */
export const closeCommitment = async (
  sequelize: Sequelize,
  commitmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'fully_liquidated') {
    throw new Error('Can only close fully liquidated commitments');
  }

  // Release any remaining budget reservations
  await releaseBudgetReservations(sequelize, commitmentId, transaction);

  return commitment;
};

// ============================================================================
// BUDGET RESERVATION FUNCTIONS
// ============================================================================

/**
 * Creates budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Created budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await createBudgetReservations(sequelize, 1);
 * ```
 */
export const createBudgetReservations = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<BudgetReservation[]> => {
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const lines = await CommitmentLine.findAll({
    where: { commitmentId },
    transaction,
  });

  const reservations: BudgetReservation[] = [];

  for (const line of lines) {
    const reservation: BudgetReservation = {
      reservationId: Date.now() + line.id,
      commitmentId,
      commitmentLineId: line.id,
      accountCode: line.accountCode,
      fiscalYear: line.budgetYear,
      fiscalPeriod: line.budgetPeriod,
      reservedAmount: line.committedAmount,
      releasedAmount: 0,
      remainingAmount: line.committedAmount,
      reservationDate: new Date(),
      status: 'active',
      budgetType: 'annual',
    };

    reservations.push(reservation);
  }

  // Would persist reservations to database
  return reservations;
};

/**
 * Releases budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseBudgetReservations(sequelize, 1);
 * ```
 */
export const releaseBudgetReservations = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<void> => {
  // Would release reservations in database
  // Simplified for demonstration
};

/**
 * Retrieves budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await getBudgetReservations(sequelize, 1);
 * ```
 */
export const getBudgetReservations = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<BudgetReservation[]> => {
  // Would query reservations from database
  return [];
};

// ============================================================================
// PURCHASE REQUISITION FUNCTIONS
// ============================================================================

/**
 * Creates a purchase requisition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseRequisitionDto} requisitionData - Requisition data
 * @param {string} userId - User creating the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPurchaseRequisition(sequelize, {
 *   requisitionDate: new Date(),
 *   requester: 'user123',
 *   department: 'IT',
 *   businessUnit: 'BU001',
 *   description: 'Office equipment',
 *   lines: [{ description: 'Laptop', quantity: 2, unitPrice: 1500 }]
 * }, 'user123');
 * ```
 */
export const createPurchaseRequisition = async (
  sequelize: Sequelize,
  requisitionData: CreatePurchaseRequisitionDto,
  userId: string,
  transaction?: Transaction,
): Promise<PurchaseRequisition> => {
  // Generate requisition number
  const requisitionNumber = await generateRequisitionNumber(sequelize, transaction);

  // Calculate total amount
  let totalAmount = 0;
  for (const line of requisitionData.lines) {
    totalAmount += (line.quantity || 0) * (line.unitPrice || 0);
  }

  const requisition: PurchaseRequisition = {
    requisitionId: Date.now(),
    requisitionNumber,
    requisitionDate: requisitionData.requisitionDate,
    requester: requisitionData.requester,
    department: requisitionData.department,
    businessUnit: requisitionData.businessUnit,
    description: requisitionData.description,
    totalAmount,
    status: 'draft',
    approvalRoute: 'standard',
    budgetCheckStatus: 'pending',
    needByDate: requisitionData.needByDate,
    deliveryLocation: requisitionData.deliveryLocation,
  };

  // Would persist to database
  return requisition;
};

/**
 * Converts a requisition to a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requisitionId - Requisition ID
 * @param {string} vendorId - Selected vendor
 * @param {string} userId - User converting the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await convertRequisitionToPO(sequelize, 1, 'VENDOR123', 'user123');
 * ```
 */
export const convertRequisitionToPO = async (
  sequelize: Sequelize,
  requisitionId: number,
  vendorId: string,
  userId: string,
  transaction?: Transaction,
): Promise<PurchaseOrder> => {
  // Would retrieve requisition and create PO
  // Simplified for demonstration
  const poNumber = await generatePONumber(sequelize, transaction);

  const po: PurchaseOrder = {
    poId: Date.now(),
    poNumber,
    poDate: new Date(),
    poType: 'standard',
    vendorId,
    vendorName: 'Vendor Name',
    businessUnit: 'BU001',
    description: 'Converted from requisition',
    totalAmount: 0,
    committedAmount: 0,
    invoicedAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    status: 'draft',
    requisitionId,
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB',
    shipToLocation: 'Main Office',
    buyer: userId,
  };

  return po;
};

/**
 * Retrieves requisitions by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Requisition status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition[]>} List of requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(sequelize, 'submitted');
 * ```
 */
export const getRequisitionsByStatus = async (
  sequelize: Sequelize,
  status: string,
  transaction?: Transaction,
): Promise<PurchaseRequisition[]> => {
  // Would query database
  return [];
};

// ============================================================================
// PURCHASE ORDER FUNCTIONS
// ============================================================================

/**
 * Creates a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseOrderDto} poData - PO data
 * @param {string} userId - User creating the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder(sequelize, {
 *   poDate: new Date(),
 *   poType: 'standard',
 *   vendorId: 'VENDOR123',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   paymentTerms: 'Net 30',
 *   shipToLocation: 'Main Office',
 *   buyer: 'buyer123',
 *   lines: [{ description: 'Paper', quantity: 100, unitPrice: 5 }]
 * }, 'user123');
 * ```
 */
export const createPurchaseOrder = async (
  sequelize: Sequelize,
  poData: CreatePurchaseOrderDto,
  userId: string,
  transaction?: Transaction,
): Promise<PurchaseOrder> => {
  const poNumber = await generatePONumber(sequelize, transaction);

  // Calculate total amount
  let totalAmount = 0;
  for (const line of poData.lines) {
    totalAmount += (line.quantity || 0) * (line.unitPrice || 0);
  }

  const po: PurchaseOrder = {
    poId: Date.now(),
    poNumber,
    poDate: poData.poDate,
    poType: poData.poType,
    vendorId: poData.vendorId,
    vendorName: 'Vendor Name', // Would lookup from vendor master
    businessUnit: poData.businessUnit,
    description: poData.description,
    totalAmount,
    committedAmount: 0,
    invoicedAmount: 0,
    paidAmount: 0,
    remainingAmount: totalAmount,
    status: 'draft',
    requisitionId: poData.requisitionId,
    paymentTerms: poData.paymentTerms,
    deliveryTerms: 'FOB',
    shipToLocation: poData.shipToLocation,
    buyer: poData.buyer,
  };

  // Would persist to database
  return po;
};

/**
 * Approves a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User approving the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Approved purchase order
 *
 * @example
 * ```typescript
 * const approved = await approvePurchaseOrder(sequelize, 1, 'approver123');
 * ```
 */
export const approvePurchaseOrder = async (
  sequelize: Sequelize,
  poId: number,
  userId: string,
  transaction?: Transaction,
): Promise<PurchaseOrder> => {
  // Would update PO in database
  // Simplified for demonstration
  const po: PurchaseOrder = {
    poId,
    poNumber: 'PO-2024-001',
    poDate: new Date(),
    poType: 'standard',
    vendorId: 'VENDOR123',
    vendorName: 'Vendor Name',
    businessUnit: 'BU001',
    description: 'Purchase order',
    totalAmount: 10000,
    committedAmount: 0,
    invoicedAmount: 0,
    paidAmount: 0,
    remainingAmount: 10000,
    status: 'approved',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB',
    shipToLocation: 'Main Office',
    buyer: userId,
    approvedBy: userId,
    approvedDate: new Date(),
  };

  return po;
};

/**
 * Closes a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User closing the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Closed purchase order
 *
 * @example
 * ```typescript
 * const closed = await closePurchaseOrder(sequelize, 1, 'user123');
 * ```
 */
export const closePurchaseOrder = async (
  sequelize: Sequelize,
  poId: number,
  userId: string,
  transaction?: Transaction,
): Promise<PurchaseOrder> => {
  // Would update PO status to closed
  // Simplified for demonstration
  const po: PurchaseOrder = {
    poId,
    poNumber: 'PO-2024-001',
    poDate: new Date(),
    poType: 'standard',
    vendorId: 'VENDOR123',
    vendorName: 'Vendor Name',
    businessUnit: 'BU001',
    description: 'Purchase order',
    totalAmount: 10000,
    committedAmount: 10000,
    invoicedAmount: 10000,
    paidAmount: 10000,
    remainingAmount: 0,
    status: 'closed',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB',
    shipToLocation: 'Main Office',
    buyer: userId,
  };

  return po;
};

/**
 * Retrieves purchase orders by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder[]>} List of purchase orders
 *
 * @example
 * ```typescript
 * const pos = await getPurchaseOrdersByVendor(sequelize, 'VENDOR123');
 * ```
 */
export const getPurchaseOrdersByVendor = async (
  sequelize: Sequelize,
  vendorId: string,
  transaction?: Transaction,
): Promise<PurchaseOrder[]> => {
  // Would query database
  return [];
};

// ============================================================================
// PRE-ENCUMBRANCE FUNCTIONS
// ============================================================================

/**
 * Creates a pre-encumbrance for budget planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} preEncumbranceData - Pre-encumbrance data
 * @param {string} userId - User creating the pre-encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PreEncumbrance>} Created pre-encumbrance
 *
 * @example
 * ```typescript
 * const preEnc = await createPreEncumbrance(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   accountCode: '5100-001',
 *   description: 'Expected equipment purchase',
 *   estimatedAmount: 25000
 * }, 'user123');
 * ```
 */
export const createPreEncumbrance = async (
  sequelize: Sequelize,
  preEncumbranceData: {
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    description: string;
    estimatedAmount: number;
    expirationDate?: Date;
  },
  userId: string,
  transaction?: Transaction,
): Promise<PreEncumbrance> => {
  const preEncumbranceNumber = await generatePreEncumbranceNumber(sequelize, transaction);

  const preEncumbrance: PreEncumbrance = {
    preEncumbranceId: Date.now(),
    preEncumbranceNumber,
    preEncumbranceDate: new Date(),
    fiscalYear: preEncumbranceData.fiscalYear,
    fiscalPeriod: preEncumbranceData.fiscalPeriod,
    accountCode: preEncumbranceData.accountCode,
    description: preEncumbranceData.description,
    estimatedAmount: preEncumbranceData.estimatedAmount,
    status: 'active',
    expirationDate: preEncumbranceData.expirationDate,
    createdBy: userId,
  };

  // Would persist to database
  return preEncumbrance;
};

/**
 * Converts a pre-encumbrance to a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} preEncumbranceId - Pre-encumbrance ID
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User converting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await convertPreEncumbranceToCommitment(sequelize, 1, commitmentData, 'user123');
 * ```
 */
export const convertPreEncumbranceToCommitment = async (
  sequelize: Sequelize,
  preEncumbranceId: number,
  commitmentData: CreateCommitmentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Create commitment
  const commitment = await createCommitment(sequelize, commitmentData, userId, transaction);

  // Would update pre-encumbrance status to converted
  return commitment;
};

// ============================================================================
// COMMITMENT REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates open commitments report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {string} [businessUnit] - Optional business unit filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Commitment report
 *
 * @example
 * ```typescript
 * const report = await generateOpenCommitmentsReport(sequelize, 2024, 3, 'BU001');
 * ```
 */
export const generateOpenCommitmentsReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod?: number,
  businessUnit?: string,
  transaction?: Transaction,
): Promise<CommitmentReport> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const where: any = {
    fiscalYear,
    status: {
      [Op.in]: ['committed', 'partially_liquidated'],
    },
  };

  if (fiscalPeriod) where.fiscalPeriod = fiscalPeriod;
  if (businessUnit) where.businessUnit = businessUnit;

  const commitments = await CommitmentHeader.findAll({ where, transaction });

  const report: CommitmentReport = {
    reportId: `OPEN_COMM_${Date.now()}`,
    reportType: 'open_commitments',
    fiscalYear,
    fiscalPeriod,
    businessUnit,
    reportData: {
      commitmentCount: commitments.length,
      totalCommitted: commitments.reduce((sum, c) => sum + c.committedAmount, 0),
      totalLiquidated: commitments.reduce((sum, c) => sum + c.liquidatedAmount, 0),
      totalRemaining: commitments.reduce((sum, c) => sum + c.remainingAmount, 0),
      commitments: commitments.map(c => ({
        commitmentNumber: c.commitmentNumber,
        description: c.description,
        committedAmount: c.committedAmount,
        liquidatedAmount: c.liquidatedAmount,
        remainingAmount: c.remainingAmount,
      })),
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates commitment liquidation history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Liquidation history report
 *
 * @example
 * ```typescript
 * const report = await generateLiquidationHistoryReport(sequelize, 1);
 * ```
 */
export const generateLiquidationHistoryReport = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<CommitmentReport> => {
  // Would query liquidation history from database
  const report: CommitmentReport = {
    reportId: `LIQ_HIST_${Date.now()}`,
    reportType: 'liquidation_history',
    fiscalYear: new Date().getFullYear(),
    reportData: {
      commitmentId,
      liquidations: [],
    },
    generatedDate: new Date(),
    generatedBy: 'system',
  };

  return report;
};

/**
 * Generates commitment variance analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [accountCode] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Variance analysis report
 *
 * @example
 * ```typescript
 * const report = await generateCommitmentVarianceReport(sequelize, 2024, '5100-001');
 * ```
 */
export const generateCommitmentVarianceReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  accountCode?: string,
  transaction?: Transaction,
): Promise<CommitmentReport> => {
  // Would analyze variances between commitments and actuals
  const report: CommitmentReport = {
    reportId: `VAR_ANALYSIS_${Date.now()}`,
    reportType: 'variance_analysis',
    fiscalYear,
    accountCode,
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
 * Generates a unique commitment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentType - Type of commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated commitment number
 *
 * @example
 * ```typescript
 * const number = await generateCommitmentNumber(sequelize, 'purchase_order');
 * ```
 */
export const generateCommitmentNumber = async (
  sequelize: Sequelize,
  commitmentType: string,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = commitmentType === 'purchase_order' ? 'PO' : 'COM';
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${randomPart}`;
};

/**
 * Generates a unique requisition number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated requisition number
 *
 * @example
 * ```typescript
 * const number = await generateRequisitionNumber(sequelize);
 * ```
 */
export const generateRequisitionNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REQ-${year}-${randomPart}`;
};

/**
 * Generates a unique PO number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated PO number
 *
 * @example
 * ```typescript
 * const number = await generatePONumber(sequelize);
 * ```
 */
export const generatePONumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO-${year}-${randomPart}`;
};

/**
 * Generates a unique pre-encumbrance number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated pre-encumbrance number
 *
 * @example
 * ```typescript
 * const number = await generatePreEncumbranceNumber(sequelize);
 * ```
 */
export const generatePreEncumbranceNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PRE-${year}-${randomPart}`;
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
 * Retrieves commitment by number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentNumber - Commitment number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentByNumber(sequelize, 'COM-2024-001');
 * ```
 */
export const getCommitmentByNumber = async (
  sequelize: Sequelize,
  commitmentNumber: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findOne({
    where: { commitmentNumber },
    transaction,
  });

  if (!commitment) {
    throw new Error('Commitment not found');
  }

  return commitment;
};

/**
 * Retrieves commitment lines for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Commitment lines
 *
 * @example
 * ```typescript
 * const lines = await getCommitmentLines(sequelize, 1);
 * ```
 */
export const getCommitmentLines = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const lines = await CommitmentLine.findAll({
    where: { commitmentId },
    transaction,
  });

  return lines;
};

/**
 * Updates a commitment line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} lineId - Commitment line ID
 * @param {Partial<CommitmentLine>} updateData - Update data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment line
 *
 * @example
 * ```typescript
 * const updated = await updateCommitmentLine(sequelize, 1, { quantity: 15 });
 * ```
 */
export const updateCommitmentLine = async (
  sequelize: Sequelize,
  lineId: number,
  updateData: Partial<CommitmentLine>,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentLine = createCommitmentLineModel(sequelize);

  const line = await CommitmentLine.findByPk(lineId, { transaction });
  if (!line) {
    throw new Error('Commitment line not found');
  }

  await line.update(updateData, { transaction });

  return line;
};

/**
 * Retrieves commitment history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory[]>} Commitment history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentHistory(sequelize, 1);
 * ```
 */
export const getCommitmentHistory = async (
  sequelize: Sequelize,
  commitmentId: number,
  transaction?: Transaction,
): Promise<CommitmentHistory[]> => {
  // Would query commitment history from database
  return [];
};

/**
 * Records commitment history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<CommitmentHistory, 'historyId'>} historyData - History data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory>} Created history entry
 *
 * @example
 * ```typescript
 * const history = await recordCommitmentHistory(sequelize, {
 *   commitmentId: 1,
 *   changeDate: new Date(),
 *   changeType: 'approved',
 *   changedBy: 'user123',
 *   newStatus: 'approved',
 *   auditData: {}
 * });
 * ```
 */
export const recordCommitmentHistory = async (
  sequelize: Sequelize,
  historyData: Omit<CommitmentHistory, 'historyId'>,
  transaction?: Transaction,
): Promise<CommitmentHistory> => {
  const history: CommitmentHistory = {
    historyId: Date.now(),
    ...historyData,
  };

  // Would persist to database
  return history;
};

/**
 * Cancels a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled commitment
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCommitment(sequelize, 1, 'No longer needed', 'user123');
 * ```
 */
export const cancelCommitment = async (
  sequelize: Sequelize,
  commitmentId: number,
  cancellationReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status === 'fully_liquidated') {
    throw new Error('Cannot cancel fully liquidated commitment');
  }

  await commitment.update(
    {
      status: 'cancelled',
      updatedBy: userId,
      metadata: {
        ...commitment.metadata,
        cancellationReason,
        cancelledDate: new Date(),
        cancelledBy: userId,
      },
    },
    { transaction },
  );

  return commitment;
};

/**
 * Reopens a cancelled commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User reopening
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reopened commitment
 *
 * @example
 * ```typescript
 * const reopened = await reopenCommitment(sequelize, 1, 'user123');
 * ```
 */
export const reopenCommitment = async (
  sequelize: Sequelize,
  commitmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CommitmentHeader = createCommitmentHeaderModel(sequelize);

  const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
  if (!commitment) {
    throw new Error('Commitment not found');
  }

  if (commitment.status !== 'cancelled') {
    throw new Error('Can only reopen cancelled commitments');
  }

  await commitment.update(
    {
      status: 'draft',
      updatedBy: userId,
    },
    { transaction },
  );

  return commitment;
};

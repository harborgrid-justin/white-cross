/**
 * LOC: CEFMS-APPR-EXEC-2025
 * File: /reuse/financial/cefms/composites/cefms-appropriations-budget-execution-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../budgeting-forecasting-kit
 *   - ../fund-accounting-controls-kit
 *   - ../financial-accounting-ledger-kit
 *   - ../financial-authorization-workflows-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../budget-planning-allocation-kit
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS appropriations management services
 *   - Budget execution controllers
 *   - Anti-deficiency monitoring systems
 *   - Congressional reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-appropriations-budget-execution-composite.ts
 * Locator: WC-CEFMS-APPR-EXEC-001
 * Purpose: USACE CEFMS Appropriations Lifecycle & Budget Execution - appropriation authority, budget allocation, apportionment,
 *          allotments, obligations, expenditures, outlays, anti-deficiency controls, and budget execution reporting
 *
 * Upstream: Composes functions from budgeting, fund accounting, ledger, authorization workflows, and reporting kits
 * Downstream: CEFMS backend services, budget controllers, appropriations tracking, execution monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 42 composite functions for end-to-end appropriations lifecycle and budget execution management
 *
 * LLM Context: Production-ready USACE CEFMS composite functions for appropriations management and budget execution.
 * Orchestrates multiple financial kits to provide complete appropriations lifecycle from Congressional authorization through
 * expenditure tracking, including apportionment, allotment, commitment, obligation, accrual, expenditure, outlay phases.
 * Implements anti-deficiency controls, budget authority management, appropriation expiration tracking, fund availability,
 * obligation tracking, expenditure processing, reimbursable authority, and comprehensive budget execution reporting.
 * Supports multi-year appropriations (no-year, multi-year, annual), appropriation types (discretionary, mandatory),
 * appropriation categories (O&M, MILCON, RDT&E, procurement), and Treasury appropriation fund symbols (TAFS).
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Congressional appropriation authorization
 */
export interface AppropriationData {
  appropriationId: string;
  tafsCode: string; // Treasury Appropriation Fund Symbol
  appropriationTitle: string;
  appropriationType: 'discretionary' | 'mandatory' | 'supplemental' | 'continuing_resolution';
  appropriationCategory: 'OM' | 'MILCON' | 'RDTE' | 'PROCUREMENT' | 'CIVIL_WORKS' | 'FAMILY_HOUSING';
  budgetAuthority: number;
  fiscalYear: number;
  appropriationYear: number;
  availabilityPeriod: 'annual' | 'multi_year' | 'no_year';
  periodOfAvailability: number; // Years available
  congressionalActNumber: string;
  publicLawNumber: string;
  enactmentDate: Date;
  expirationDate?: Date;
  programCode: string;
  organizationCode: string;
  restrictions: string[];
  metadata: Record<string, any>;
}

/**
 * OMB apportionment allocation
 */
export interface ApportionmentData {
  apportionmentId: string;
  appropriationId: string;
  category: 'category_a' | 'category_b'; // OMB apportionment categories
  amount: number;
  effectiveDate: Date;
  quarterNumber?: number; // For Category A
  projectCode?: string; // For Category B
  ombControlNumber: string;
  restrictions: string[];
  status: 'draft' | 'submitted' | 'approved' | 'active';
}

/**
 * Agency allotment to organizations
 */
export interface AllotmentData {
  allotmentId: string;
  apportionmentId: string;
  appropriationId: string;
  organizationCode: string;
  programCode: string;
  amount: number;
  effectiveDate: Date;
  expirationDate?: Date;
  purpose: string;
  restrictions: string[];
  allottedBy: string;
  approvalLevel: number;
  status: 'pending' | 'approved' | 'active' | 'expired';
}

/**
 * Budget commitment (pre-obligation encumbrance)
 */
export interface CommitmentData {
  commitmentId: string;
  allotmentId: string;
  amount: number;
  commitmentDate: Date;
  expectedObligationDate: Date;
  purpose: string;
  vendorId?: string;
  projectId?: string;
  committedBy: string;
  status: 'active' | 'converted_to_obligation' | 'cancelled';
}

/**
 * Legal obligation of funds
 */
export interface ObligationData {
  obligationId: string;
  allotmentId: string;
  documentNumber: string;
  documentType: 'purchase_order' | 'contract' | 'grant' | 'payroll' | 'travel_order' | 'other';
  amount: number;
  obligationDate: Date;
  vendorId?: string;
  projectId?: string;
  description: string;
  fiscalYear: number;
  period: number;
  obligatedBy: string;
  glAccountCode: string;
  ussglAccount: string; // US Standard General Ledger
  status: 'undelivered' | 'partial_delivery' | 'delivered' | 'cancelled';
}

/**
 * Accrued expenditure (goods/services received)
 */
export interface AccrualData {
  accrualId: string;
  obligationId: string;
  amount: number;
  accrualDate: Date;
  deliveryDate?: Date;
  invoiceNumber?: string;
  description: string;
  fiscalYear: number;
  period: number;
  status: 'accrued' | 'paid' | 'reversed';
}

/**
 * Expenditure payment
 */
export interface ExpenditureData {
  expenditureId: string;
  accrualId: string;
  obligationId: string;
  amount: number;
  expenditureDate: Date;
  paymentMethod: 'ach' | 'wire' | 'check' | 'eft';
  paymentNumber?: string;
  fiscalYear: number;
  period: number;
  paidBy: string;
  status: 'pending' | 'processed' | 'cleared' | 'reconciled';
}

/**
 * Treasury outlay (cash disbursement)
 */
export interface OutlayData {
  outlayId: string;
  expenditureId: string;
  amount: number;
  outlayDate: Date;
  treasuryAccountSymbol: string;
  treasuryConfirmation?: string;
  fiscalYear: number;
  period: number;
  status: 'pending' | 'reported_to_treasury' | 'confirmed';
}

/**
 * Budget execution status at all stages
 */
export interface BudgetExecutionStatus {
  appropriationId: string;
  tafsCode: string;
  totalAuthority: number;
  apportioned: number;
  unapportioned: number;
  allotted: number;
  unallotted: number;
  committed: number;
  uncommitted: number;
  obligated: number;
  unobligated: number;
  accrued: number;
  unaccrued: number;
  expended: number;
  unexpended: number;
  outlayed: number;
  fiscalYear: number;
  asOfDate: Date;
}

/**
 * Anti-deficiency validation result
 */
export interface AntiDeficiencyCheck {
  passed: boolean;
  availableAmount: number;
  requestedAmount: number;
  remainingAmount: number;
  violations: string[];
  warnings: string[];
  checkDate: Date;
  appropriationId: string;
  allotmentId?: string;
}

/**
 * Fund availability status
 */
export interface FundAvailability {
  appropriationId: string;
  available: boolean;
  totalAuthority: number;
  obligated: number;
  unobligated: number;
  expirationDate?: Date;
  daysUntilExpiration?: number;
  availabilityStatus: 'current' | 'expiring_soon' | 'expired' | 'cancelled';
  restrictions: string[];
}

/**
 * SF-132 Apportionment schedule data
 */
export interface SF132Data {
  appropriationId: string;
  tafsCode: string;
  fiscalYear: number;
  quarter: number;
  categoryA: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  categoryB: ProjectApportionment[];
  totalApportioned: number;
  ombControlNumber: string;
  submissionDate: Date;
  approvalDate?: Date;
}

export interface ProjectApportionment {
  projectCode: string;
  amount: number;
  milestones: string[];
}

/**
 * Budget execution report
 */
export interface BudgetExecutionReport {
  reportId: string;
  reportType: 'sf_133' | 'monthly_obligation' | 'quarterly_execution' | 'annual_status';
  fiscalYear: number;
  period: number;
  appropriations: BudgetExecutionStatus[];
  totalAuthority: number;
  totalObligated: number;
  totalExpended: number;
  totalOutlayed: number;
  generatedDate: Date;
  generatedBy: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Appropriation model for Congressional budget authority
 */
export const createAppropriationModel = (sequelize: Sequelize) => {
  class Appropriation extends Model {
    public id!: string;
    public appropriationId!: string;
    public tafsCode!: string;
    public appropriationTitle!: string;
    public appropriationType!: string;
    public appropriationCategory!: string;
    public budgetAuthority!: number;
    public fiscalYear!: number;
    public appropriationYear!: number;
    public availabilityPeriod!: string;
    public periodOfAvailability!: number;
    public congressionalActNumber!: string;
    public publicLawNumber!: string;
    public enactmentDate!: Date;
    public expirationDate!: Date | null;
    public programCode!: string;
    public organizationCode!: string;
    public restrictions!: string[];
    public metadata!: Record<string, any>;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Appropriation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      appropriationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique appropriation identifier',
      },
      tafsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treasury Appropriation Fund Symbol',
        validate: {
          notEmpty: true,
        },
      },
      appropriationTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Congressional appropriation title',
      },
      appropriationType: {
        type: DataTypes.ENUM('discretionary', 'mandatory', 'supplemental', 'continuing_resolution'),
        allowNull: false,
        comment: 'Type of appropriation',
      },
      appropriationCategory: {
        type: DataTypes.ENUM('OM', 'MILCON', 'RDTE', 'PROCUREMENT', 'CIVIL_WORKS', 'FAMILY_HOUSING'),
        allowNull: false,
        comment: 'Appropriation category',
      },
      budgetAuthority: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total budget authority',
        validate: {
          min: 0,
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      appropriationYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Year appropriation was enacted',
      },
      availabilityPeriod: {
        type: DataTypes.ENUM('annual', 'multi_year', 'no_year'),
        allowNull: false,
        comment: 'Period of availability',
      },
      periodOfAvailability: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Number of years available',
      },
      congressionalActNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Congressional act number',
      },
      publicLawNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Public law number',
      },
      enactmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of enactment',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date if applicable',
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Program element code',
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization code',
      },
      restrictions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Appropriation restrictions',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      status: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled', 'fully_obligated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Appropriation status',
      },
    },
    {
      sequelize,
      tableName: 'cefms_appropriations',
      timestamps: true,
      indexes: [
        { fields: ['appropriationId'], unique: true },
        { fields: ['tafsCode'] },
        { fields: ['fiscalYear'] },
        { fields: ['appropriationCategory'] },
        { fields: ['status'] },
        { fields: ['organizationCode'] },
        { fields: ['programCode'] },
      ],
    },
  );

  return Appropriation;
};

/**
 * Obligation model for legal commitments
 */
export const createObligationModel = (sequelize: Sequelize) => {
  class Obligation extends Model {
    public id!: string;
    public obligationId!: string;
    public appropriationId!: string;
    public allotmentId!: string;
    public documentNumber!: string;
    public documentType!: string;
    public amount!: number;
    public obligationDate!: Date;
    public vendorId!: string | null;
    public projectId!: string | null;
    public description!: string;
    public fiscalYear!: number;
    public period!: number;
    public obligatedBy!: string;
    public glAccountCode!: string;
    public ussglAccount!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Obligation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      obligationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique obligation identifier',
      },
      appropriationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related appropriation',
      },
      allotmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related allotment',
      },
      documentNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Obligating document number',
      },
      documentType: {
        type: DataTypes.ENUM('purchase_order', 'contract', 'grant', 'payroll', 'travel_order', 'other'),
        allowNull: false,
        comment: 'Type of obligating document',
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Obligation amount',
        validate: {
          min: 0.01,
        },
      },
      obligationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date obligation incurred',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Vendor identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project identifier',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Obligation description',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      obligatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created obligation',
      },
      glAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'General ledger account code',
      },
      ussglAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'US Standard General Ledger account',
      },
      status: {
        type: DataTypes.ENUM('undelivered', 'partial_delivery', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'undelivered',
        comment: 'Obligation delivery status',
      },
    },
    {
      sequelize,
      tableName: 'cefms_obligations',
      timestamps: true,
      indexes: [
        { fields: ['obligationId'], unique: true },
        { fields: ['appropriationId'] },
        { fields: ['allotmentId'] },
        { fields: ['documentNumber'] },
        { fields: ['fiscalYear', 'period'] },
        { fields: ['status'] },
        { fields: ['vendorId'] },
        { fields: ['projectId'] },
      ],
    },
  );

  return Obligation;
};

// ============================================================================
// APPROPRIATION MANAGEMENT (Functions 1-10)
// ============================================================================

/**
 * Creates a new Congressional appropriation with full metadata and tracking.
 *
 * @param {AppropriationData} data - Appropriation data
 * @param {any} Appropriation - Appropriation model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created appropriation
 *
 * @example
 * ```typescript
 * const appropriation = await createAppropriation({
 *   appropriationId: 'APPR-2026-MILCON-001',
 *   tafsCode: '2126/27X1125',
 *   appropriationTitle: 'Military Construction, Army',
 *   appropriationType: 'discretionary',
 *   appropriationCategory: 'MILCON',
 *   budgetAuthority: 1500000000.00,
 *   fiscalYear: 2026,
 *   appropriationYear: 2026,
 *   availabilityPeriod: 'multi_year',
 *   periodOfAvailability: 5,
 *   congressionalActNumber: 'HR-2345',
 *   publicLawNumber: 'PL 118-42',
 *   enactmentDate: new Date('2025-10-01'),
 *   programCode: 'MILCON-ARMY',
 *   organizationCode: 'USACE',
 *   restrictions: ['Davis-Bacon prevailing wage']
 * }, AppropriationModel);
 * ```
 */
export const createAppropriation = async (
  data: AppropriationData,
  Appropriation: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate appropriation data
  if (!data.tafsCode || !data.budgetAuthority || data.budgetAuthority <= 0) {
    throw new Error('Invalid appropriation data: TAFS code and positive budget authority required');
  }

  // Calculate expiration date based on availability period
  let expirationDate: Date | null = null;
  if (data.availabilityPeriod !== 'no_year') {
    const years = data.availabilityPeriod === 'annual' ? 1 : data.periodOfAvailability;
    expirationDate = new Date(data.enactmentDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + years);
  }

  const appropriation = await Appropriation.create(
    {
      ...data,
      expirationDate,
      status: 'active',
    },
    { transaction },
  );

  return appropriation;
};

/**
 * Validates appropriation authority and availability for new obligations.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<FundAvailability>} Fund availability status
 *
 * @example
 * ```typescript
 * const availability = await validateAppropriationAuthority('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * if (!availability.available) {
 *   throw new Error('Appropriation not available for obligation');
 * }
 * ```
 */
export const validateAppropriationAuthority = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<FundAvailability> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  // Calculate total obligations
  const obligations = await Obligation.findAll({
    where: { appropriationId, status: { [Op.ne]: 'cancelled' } },
  });

  const totalObligated = obligations.reduce(
    (sum: number, obl: any) => sum + parseFloat(obl.amount),
    0,
  );

  const unobligated = parseFloat(appropriation.budgetAuthority) - totalObligated;

  // Check expiration
  const now = new Date();
  let availabilityStatus: 'current' | 'expiring_soon' | 'expired' | 'cancelled' = 'current';
  let daysUntilExpiration: number | undefined;

  if (appropriation.expirationDate) {
    const daysRemaining = Math.floor(
      (appropriation.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    daysUntilExpiration = daysRemaining;

    if (daysRemaining < 0) {
      availabilityStatus = 'expired';
    } else if (daysRemaining <= 90) {
      availabilityStatus = 'expiring_soon';
    }
  }

  if (appropriation.status === 'cancelled') {
    availabilityStatus = 'cancelled';
  }

  return {
    appropriationId,
    available: availabilityStatus === 'current' || availabilityStatus === 'expiring_soon',
    totalAuthority: parseFloat(appropriation.budgetAuthority),
    obligated: totalObligated,
    unobligated,
    expirationDate: appropriation.expirationDate,
    daysUntilExpiration,
    availabilityStatus,
    restrictions: appropriation.restrictions,
  };
};

/**
 * Processes OMB apportionment for an appropriation (SF-132 schedule).
 *
 * @param {ApportionmentData} data - Apportionment data
 * @param {string} appropriationId - Related appropriation
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Apportionment record
 *
 * @example
 * ```typescript
 * const apportionment = await processOMBApportionment({
 *   apportionmentId: 'AP-2026-Q1-001',
 *   appropriationId: 'APPR-2026-MILCON-001',
 *   category: 'category_a',
 *   amount: 375000000.00,
 *   effectiveDate: new Date('2025-10-01'),
 *   quarterNumber: 1,
 *   ombControlNumber: 'OMB-2026-001',
 *   restrictions: [],
 *   status: 'approved'
 * }, 'APPR-2026-MILCON-001', AppropriationModel);
 * ```
 */
export const processOMBApportionment = async (
  data: ApportionmentData,
  appropriationId: string,
  Appropriation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  // Validate apportionment amount
  if (data.amount > parseFloat(appropriation.budgetAuthority)) {
    throw new Error('Apportionment amount exceeds appropriation authority');
  }

  // Store apportionment in metadata
  const apportionments = appropriation.metadata.apportionments || [];
  apportionments.push({
    ...data,
    createdAt: new Date(),
  });

  appropriation.metadata = {
    ...appropriation.metadata,
    apportionments,
  };

  await appropriation.save();

  return data;
};

/**
 * Allocates allotment from apportionment to organizational units.
 *
 * @param {AllotmentData} data - Allotment data
 * @param {any} Appropriation - Appropriation model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allotment record
 *
 * @example
 * ```typescript
 * const allotment = await allocateAllotment({
 *   allotmentId: 'ALT-2026-001',
 *   apportionmentId: 'AP-2026-Q1-001',
 *   appropriationId: 'APPR-2026-MILCON-001',
 *   organizationCode: 'USACE-NAB',
 *   programCode: 'MILCON-BARRACKS',
 *   amount: 50000000.00,
 *   effectiveDate: new Date('2025-10-01'),
 *   purpose: 'Fort Bragg barracks construction',
 *   restrictions: [],
 *   allottedBy: 'user123',
 *   approvalLevel: 3,
 *   status: 'approved'
 * }, AppropriationModel);
 * ```
 */
export const allocateAllotment = async (
  data: AllotmentData,
  Appropriation: any,
  transaction?: Transaction,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId: data.appropriationId },
    transaction,
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${data.appropriationId} not found`);
  }

  // Validate allotment amount against apportionment
  const apportionments = appropriation.metadata.apportionments || [];
  const apportionment = apportionments.find((a: any) => a.apportionmentId === data.apportionmentId);

  if (!apportionment) {
    throw new Error(`Apportionment ${data.apportionmentId} not found`);
  }

  // Store allotment
  const allotments = appropriation.metadata.allotments || [];
  allotments.push({
    ...data,
    createdAt: new Date(),
  });

  appropriation.metadata = {
    ...appropriation.metadata,
    allotments,
  };

  await appropriation.save({ transaction });

  return data;
};

/**
 * Checks for anti-deficiency violations before creating obligation.
 *
 * @param {string} allotmentId - Allotment to check
 * @param {number} amount - Requested obligation amount
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<AntiDeficiencyCheck>} Anti-deficiency check result
 *
 * @example
 * ```typescript
 * const check = await checkAntiDeficiency('ALT-2026-001', 5000000.00, AppropriationModel, ObligationModel);
 * if (!check.passed) {
 *   throw new Error(`Anti-deficiency violation: ${check.violations.join(', ')}`);
 * }
 * ```
 */
export const checkAntiDeficiency = async (
  allotmentId: string,
  amount: number,
  Appropriation: any,
  Obligation: any,
): Promise<AntiDeficiencyCheck> => {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Find appropriation with this allotment
  const appropriations = await Appropriation.findAll();
  let appropriation: any = null;
  let allotment: any = null;

  for (const appr of appropriations) {
    const allotments = appr.metadata.allotments || [];
    const found = allotments.find((a: any) => a.allotmentId === allotmentId);
    if (found) {
      appropriation = appr;
      allotment = found;
      break;
    }
  }

  if (!appropriation || !allotment) {
    violations.push(`Allotment ${allotmentId} not found`);
    return {
      passed: false,
      availableAmount: 0,
      requestedAmount: amount,
      remainingAmount: 0,
      violations,
      warnings,
      checkDate: new Date(),
      appropriationId: '',
      allotmentId,
    };
  }

  // Get existing obligations against this allotment
  const obligations = await Obligation.findAll({
    where: { allotmentId, status: { [Op.ne]: 'cancelled' } },
  });

  const totalObligated = obligations.reduce(
    (sum: number, obl: any) => sum + parseFloat(obl.amount),
    0,
  );

  const allotmentAmount = parseFloat(allotment.amount);
  const available = allotmentAmount - totalObligated;
  const remaining = available - amount;

  // Check for violations
  if (amount > available) {
    violations.push(
      `Requested amount ${amount} exceeds available allotment ${available}`,
    );
  }

  // Check appropriation expiration
  if (appropriation.expirationDate) {
    const daysRemaining = Math.floor(
      (appropriation.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysRemaining < 0) {
      violations.push('Appropriation has expired');
    } else if (daysRemaining <= 30) {
      warnings.push(`Appropriation expires in ${daysRemaining} days`);
    }
  }

  // Check if appropriation is fully obligated
  if (appropriation.status === 'fully_obligated') {
    violations.push('Appropriation is fully obligated');
  }

  return {
    passed: violations.length === 0,
    availableAmount: available,
    requestedAmount: amount,
    remainingAmount: remaining,
    violations,
    warnings,
    checkDate: new Date(),
    appropriationId: appropriation.appropriationId,
    allotmentId,
  };
};

/**
 * Records a commitment (pre-obligation encumbrance) for planned expenditure.
 *
 * @param {CommitmentData} data - Commitment data
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Commitment record
 *
 * @example
 * ```typescript
 * const commitment = await recordCommitment({
 *   commitmentId: 'CMT-2026-001',
 *   allotmentId: 'ALT-2026-001',
 *   amount: 1000000.00,
 *   commitmentDate: new Date(),
 *   expectedObligationDate: new Date('2026-01-15'),
 *   purpose: 'Anticipated contract award',
 *   projectId: 'PRJ-BARRACKS-001',
 *   committedBy: 'user123',
 *   status: 'active'
 * }, AppropriationModel);
 * ```
 */
export const recordCommitment = async (
  data: CommitmentData,
  Appropriation: any,
): Promise<any> => {
  // Find appropriation with this allotment
  const appropriations = await Appropriation.findAll();
  let appropriation: any = null;

  for (const appr of appropriations) {
    const allotments = appr.metadata.allotments || [];
    if (allotments.find((a: any) => a.allotmentId === data.allotmentId)) {
      appropriation = appr;
      break;
    }
  }

  if (!appropriation) {
    throw new Error(`Allotment ${data.allotmentId} not found`);
  }

  // Store commitment
  const commitments = appropriation.metadata.commitments || [];
  commitments.push({
    ...data,
    createdAt: new Date(),
  });

  appropriation.metadata = {
    ...appropriation.metadata,
    commitments,
  };

  await appropriation.save();

  return data;
};

/**
 * Creates a legal obligation against an allotment with anti-deficiency checks.
 *
 * @param {ObligationData} data - Obligation data
 * @param {any} Obligation - Obligation model
 * @param {any} Appropriation - Appropriation model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created obligation
 *
 * @example
 * ```typescript
 * const obligation = await createObligation({
 *   obligationId: 'OBL-2026-001',
 *   allotmentId: 'ALT-2026-001',
 *   documentNumber: 'PO-2026-0001',
 *   documentType: 'purchase_order',
 *   amount: 500000.00,
 *   obligationDate: new Date(),
 *   vendorId: 'VND-001',
 *   projectId: 'PRJ-BARRACKS-001',
 *   description: 'Construction materials',
 *   fiscalYear: 2026,
 *   period: 1,
 *   obligatedBy: 'user123',
 *   glAccountCode: '6100',
 *   ussglAccount: '4801',
 *   status: 'undelivered'
 * }, ObligationModel, AppropriationModel);
 * ```
 */
export const createObligation = async (
  data: ObligationData,
  Obligation: any,
  Appropriation: any,
  transaction?: Transaction,
): Promise<any> => {
  // Perform anti-deficiency check
  const adfCheck = await checkAntiDeficiency(
    data.allotmentId,
    data.amount,
    Appropriation,
    Obligation,
  );

  if (!adfCheck.passed) {
    throw new Error(`Anti-deficiency violation: ${adfCheck.violations.join('; ')}`);
  }

  // Find appropriation
  const appropriations = await Appropriation.findAll({ transaction });
  let appropriationId = '';

  for (const appr of appropriations) {
    const allotments = appr.metadata.allotments || [];
    if (allotments.find((a: any) => a.allotmentId === data.allotmentId)) {
      appropriationId = appr.appropriationId;
      break;
    }
  }

  if (!appropriationId) {
    throw new Error(`Allotment ${data.allotmentId} not found`);
  }

  const obligation = await Obligation.create(
    {
      ...data,
      appropriationId,
    },
    { transaction },
  );

  return obligation;
};

/**
 * Adjusts an existing obligation (de-obligation or increase).
 *
 * @param {string} obligationId - Obligation to adjust
 * @param {number} adjustmentAmount - Positive for increase, negative for decrease
 * @param {string} reason - Reason for adjustment
 * @param {any} Obligation - Obligation model
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * // Decrease obligation by $50,000
 * const adjusted = await adjustObligation(
 *   'OBL-2026-001',
 *   -50000.00,
 *   'Contract price reduction',
 *   ObligationModel,
 *   AppropriationModel
 * );
 * ```
 */
export const adjustObligation = async (
  obligationId: string,
  adjustmentAmount: number,
  reason: string,
  Obligation: any,
  Appropriation: any,
): Promise<any> => {
  const obligation = await Obligation.findOne({ where: { obligationId } });

  if (!obligation) {
    throw new Error(`Obligation ${obligationId} not found`);
  }

  const newAmount = parseFloat(obligation.amount) + adjustmentAmount;

  if (newAmount < 0) {
    throw new Error('Obligation amount cannot be negative');
  }

  // If increasing, perform anti-deficiency check
  if (adjustmentAmount > 0) {
    const adfCheck = await checkAntiDeficiency(
      obligation.allotmentId,
      adjustmentAmount,
      Appropriation,
      Obligation,
    );

    if (!adfCheck.passed) {
      throw new Error(`Anti-deficiency violation: ${adfCheck.violations.join('; ')}`);
    }
  }

  obligation.amount = newAmount;
  obligation.metadata = {
    ...obligation.metadata,
    adjustments: [
      ...(obligation.metadata.adjustments || []),
      {
        amount: adjustmentAmount,
        reason,
        adjustedAt: new Date(),
      },
    ],
  };

  await obligation.save();

  return obligation;
};

/**
 * Cancels an obligation and releases funds back to allotment.
 *
 * @param {string} obligationId - Obligation to cancel
 * @param {string} reason - Cancellation reason
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Cancelled obligation
 *
 * @example
 * ```typescript
 * const cancelled = await cancelObligation(
 *   'OBL-2026-001',
 *   'Contract terminated',
 *   ObligationModel
 * );
 * ```
 */
export const cancelObligation = async (
  obligationId: string,
  reason: string,
  Obligation: any,
): Promise<any> => {
  const obligation = await Obligation.findOne({ where: { obligationId } });

  if (!obligation) {
    throw new Error(`Obligation ${obligationId} not found`);
  }

  if (obligation.status === 'cancelled') {
    throw new Error('Obligation is already cancelled');
  }

  obligation.status = 'cancelled';
  obligation.metadata = {
    ...obligation.metadata,
    cancellationReason: reason,
    cancelledAt: new Date(),
  };

  await obligation.save();

  return obligation;
};

/**
 * Retrieves complete budget execution status for an appropriation.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<BudgetExecutionStatus>} Execution status
 *
 * @example
 * ```typescript
 * const status = await getBudgetExecutionStatus(
 *   'APPR-2026-MILCON-001',
 *   AppropriationModel,
 *   ObligationModel
 * );
 * console.log(`Unobligated: ${status.unobligated}`);
 * ```
 */
export const getBudgetExecutionStatus = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<BudgetExecutionStatus> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const totalAuthority = parseFloat(appropriation.budgetAuthority);

  // Calculate apportioned
  const apportionments = appropriation.metadata.apportionments || [];
  const apportioned = apportionments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.amount),
    0,
  );

  // Calculate allotted
  const allotments = appropriation.metadata.allotments || [];
  const allotted = allotments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.amount),
    0,
  );

  // Calculate committed
  const commitments = appropriation.metadata.commitments || [];
  const committed = commitments
    .filter((c: any) => c.status === 'active')
    .reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);

  // Calculate obligated
  const obligations = await Obligation.findAll({
    where: { appropriationId, status: { [Op.ne]: 'cancelled' } },
  });

  const obligated = obligations.reduce(
    (sum: number, obl: any) => sum + parseFloat(obl.amount),
    0,
  );

  // Calculate accrued (from obligation metadata)
  const accrued = obligations.reduce((sum: number, obl: any) => {
    const accruals = obl.metadata.accruals || [];
    return (
      sum +
      accruals.reduce((accSum: number, acc: any) => accSum + parseFloat(acc.amount), 0)
    );
  }, 0);

  // Calculate expended
  const expended = obligations.reduce((sum: number, obl: any) => {
    const expenditures = obl.metadata.expenditures || [];
    return (
      sum +
      expenditures.reduce((expSum: number, exp: any) => expSum + parseFloat(exp.amount), 0)
    );
  }, 0);

  // Calculate outlayed
  const outlayed = obligations.reduce((sum: number, obl: any) => {
    const outlays = obl.metadata.outlays || [];
    return (
      sum +
      outlays.reduce((outSum: number, out: any) => outSum + parseFloat(out.amount), 0)
    );
  }, 0);

  return {
    appropriationId,
    tafsCode: appropriation.tafsCode,
    totalAuthority,
    apportioned,
    unapportioned: totalAuthority - apportioned,
    allotted,
    unallotted: apportioned - allotted,
    committed,
    uncommitted: allotted - committed,
    obligated,
    unobligated: totalAuthority - obligated,
    accrued,
    unaccrued: obligated - accrued,
    expended,
    unexpended: accrued - expended,
    outlayed,
    fiscalYear: appropriation.fiscalYear,
    asOfDate: new Date(),
  };
};

// ============================================================================
// EXPENDITURE PROCESSING (Functions 11-20)
// ============================================================================

/**
 * Records an accrual when goods/services are received against an obligation.
 *
 * @param {AccrualData} data - Accrual data
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Accrual record
 *
 * @example
 * ```typescript
 * const accrual = await recordAccrual({
 *   accrualId: 'ACC-2026-001',
 *   obligationId: 'OBL-2026-001',
 *   amount: 250000.00,
 *   accrualDate: new Date(),
 *   deliveryDate: new Date(),
 *   invoiceNumber: 'INV-12345',
 *   description: 'Partial delivery - 50% complete',
 *   fiscalYear: 2026,
 *   period: 2,
 *   status: 'accrued'
 * }, ObligationModel);
 * ```
 */
export const recordAccrual = async (
  data: AccrualData,
  Obligation: any,
): Promise<any> => {
  const obligation = await Obligation.findOne({
    where: { obligationId: data.obligationId },
  });

  if (!obligation) {
    throw new Error(`Obligation ${data.obligationId} not found`);
  }

  // Validate accrual doesn't exceed obligation
  const existingAccruals = obligation.metadata.accruals || [];
  const totalAccrued = existingAccruals.reduce(
    (sum: number, acc: any) => sum + parseFloat(acc.amount),
    0,
  );

  if (totalAccrued + data.amount > parseFloat(obligation.amount)) {
    throw new Error('Total accruals exceed obligation amount');
  }

  // Store accrual
  const accruals = [...existingAccruals, { ...data, createdAt: new Date() }];
  obligation.metadata = {
    ...obligation.metadata,
    accruals,
  };

  // Update obligation status
  if (totalAccrued + data.amount >= parseFloat(obligation.amount)) {
    obligation.status = 'delivered';
  } else if (totalAccrued + data.amount > 0) {
    obligation.status = 'partial_delivery';
  }

  await obligation.save();

  return data;
};

/**
 * Processes an expenditure payment against an accrued obligation.
 *
 * @param {ExpenditureData} data - Expenditure data
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Expenditure record
 *
 * @example
 * ```typescript
 * const expenditure = await processExpenditure({
 *   expenditureId: 'EXP-2026-001',
 *   accrualId: 'ACC-2026-001',
 *   obligationId: 'OBL-2026-001',
 *   amount: 250000.00,
 *   expenditureDate: new Date(),
 *   paymentMethod: 'ach',
 *   paymentNumber: 'ACH-123456',
 *   fiscalYear: 2026,
 *   period: 2,
 *   paidBy: 'user123',
 *   status: 'processed'
 * }, ObligationModel);
 * ```
 */
export const processExpenditure = async (
  data: ExpenditureData,
  Obligation: any,
): Promise<any> => {
  const obligation = await Obligation.findOne({
    where: { obligationId: data.obligationId },
  });

  if (!obligation) {
    throw new Error(`Obligation ${data.obligationId} not found`);
  }

  // Validate expenditure has corresponding accrual
  const accruals = obligation.metadata.accruals || [];
  const accrual = accruals.find((a: any) => a.accrualId === data.accrualId);

  if (!accrual) {
    throw new Error(`Accrual ${data.accrualId} not found`);
  }

  // Validate expenditure doesn't exceed accrual
  const expenditures = obligation.metadata.expenditures || [];
  const accrualExpenditures = expenditures.filter(
    (e: any) => e.accrualId === data.accrualId,
  );
  const totalExpended = accrualExpenditures.reduce(
    (sum: number, exp: any) => sum + parseFloat(exp.amount),
    0,
  );

  if (totalExpended + data.amount > parseFloat(accrual.amount)) {
    throw new Error('Expenditure exceeds accrual amount');
  }

  // Store expenditure
  expenditures.push({ ...data, createdAt: new Date() });
  obligation.metadata = {
    ...obligation.metadata,
    expenditures,
  };

  await obligation.save();

  return data;
};

/**
 * Records a Treasury outlay (cash disbursement) for an expenditure.
 *
 * @param {OutlayData} data - Outlay data
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Outlay record
 *
 * @example
 * ```typescript
 * const outlay = await recordOutlay({
 *   outlayId: 'OUT-2026-001',
 *   expenditureId: 'EXP-2026-001',
 *   amount: 250000.00,
 *   outlayDate: new Date(),
 *   treasuryAccountSymbol: '2126/27X1125',
 *   treasuryConfirmation: 'TREAS-CONF-789',
 *   fiscalYear: 2026,
 *   period: 2,
 *   status: 'confirmed'
 * }, ObligationModel);
 * ```
 */
export const recordOutlay = async (
  data: OutlayData,
  Obligation: any,
): Promise<any> => {
  const obligations = await Obligation.findAll();
  let obligation: any = null;

  // Find obligation with this expenditure
  for (const obl of obligations) {
    const expenditures = obl.metadata.expenditures || [];
    if (expenditures.find((e: any) => e.expenditureId === data.expenditureId)) {
      obligation = obl;
      break;
    }
  }

  if (!obligation) {
    throw new Error(`Expenditure ${data.expenditureId} not found`);
  }

  // Store outlay
  const outlays = obligation.metadata.outlays || [];
  outlays.push({ ...data, createdAt: new Date() });
  obligation.metadata = {
    ...obligation.metadata,
    outlays,
  };

  await obligation.save();

  return data;
};

/**
 * Generates SF-133 Report on Budget Execution and Budgetary Resources.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} period - Fiscal period (1-12)
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<BudgetExecutionReport>} SF-133 report data
 *
 * @example
 * ```typescript
 * const sf133 = await generateSF133Report(2026, 12, AppropriationModel, ObligationModel);
 * ```
 */
export const generateSF133Report = async (
  fiscalYear: number,
  period: number,
  Appropriation: any,
  Obligation: any,
): Promise<BudgetExecutionReport> => {
  const appropriations = await Appropriation.findAll({
    where: { fiscalYear },
  });

  const reportData: BudgetExecutionStatus[] = [];
  let totalAuthority = 0;
  let totalObligated = 0;
  let totalExpended = 0;
  let totalOutlayed = 0;

  for (const appr of appropriations) {
    const status = await getBudgetExecutionStatus(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );
    reportData.push(status);

    totalAuthority += status.totalAuthority;
    totalObligated += status.obligated;
    totalExpended += status.expended;
    totalOutlayed += status.outlayed;
  }

  return {
    reportId: `SF133-${fiscalYear}-P${period}`,
    reportType: 'sf_133',
    fiscalYear,
    period,
    appropriations: reportData,
    totalAuthority,
    totalObligated,
    totalExpended,
    totalOutlayed,
    generatedDate: new Date(),
    generatedBy: 'system',
  };
};

/**
 * Tracks multi-year appropriation carryover and expiration.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Carryover analysis
 *
 * @example
 * ```typescript
 * const carryover = await trackMultiYearCarryover('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * ```
 */
export const trackMultiYearCarryover = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const status = await getBudgetExecutionStatus(
    appropriationId,
    Appropriation,
    Obligation,
  );

  let carryoverStatus = 'available';
  let yearsRemaining = 0;

  if (appropriation.expirationDate) {
    const now = new Date();
    const daysRemaining = Math.floor(
      (appropriation.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    yearsRemaining = Math.floor(daysRemaining / 365);

    if (daysRemaining < 0) {
      carryoverStatus = 'expired';
    } else if (daysRemaining <= 365) {
      carryoverStatus = 'expiring_current_year';
    }
  } else {
    carryoverStatus = 'no_year';
  }

  return {
    appropriationId,
    availabilityPeriod: appropriation.availabilityPeriod,
    periodOfAvailability: appropriation.periodOfAvailability,
    enactmentDate: appropriation.enactmentDate,
    expirationDate: appropriation.expirationDate,
    yearsRemaining,
    carryoverStatus,
    unobligatedBalance: status.unobligated,
    canCarryover: carryoverStatus === 'available' || carryoverStatus === 'expiring_current_year',
  };
};

/**
 * Processes reimbursable authority and collections.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} collectionAmount - Reimbursement collected
 * @param {string} source - Reimbursement source
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await processReimbursableAuthority(
 *   'APPR-2026-MILCON-001',
 *   500000.00,
 *   'DOD-Navy reimbursement',
 *   AppropriationModel
 * );
 * ```
 */
export const processReimbursableAuthority = async (
  appropriationId: string,
  collectionAmount: number,
  source: string,
  Appropriation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const reimbursements = appropriation.metadata.reimbursements || [];
  reimbursements.push({
    amount: collectionAmount,
    source,
    collectedAt: new Date(),
  });

  const totalReimbursements = reimbursements.reduce(
    (sum: number, r: any) => sum + parseFloat(r.amount),
    0,
  );

  appropriation.budgetAuthority = parseFloat(appropriation.budgetAuthority) + collectionAmount;
  appropriation.metadata = {
    ...appropriation.metadata,
    reimbursements,
    totalReimbursements,
  };

  await appropriation.save();

  return appropriation;
};

/**
 * Validates USSGL account mapping for obligations.
 *
 * @param {string} glAccountCode - GL account code
 * @param {string} documentType - Document type
 * @returns {Promise<{ valid: boolean; ussglAccount?: string; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateUSSGLMapping('6100', 'purchase_order');
 * ```
 */
export const validateUSSGLMapping = async (
  glAccountCode: string,
  documentType: string,
): Promise<{ valid: boolean; ussglAccount?: string; errors: string[] }> => {
  const errors: string[] = [];

  // USSGL mapping rules (simplified)
  const ussglMappings: Record<string, string> = {
    '6100': '4801', // Undelivered Orders - Obligations, Unpaid
    '6200': '4802', // Undelivered Orders - Obligations, Paid
    '6300': '4901', // Delivered Orders - Obligations, Unpaid
    '6400': '4902', // Delivered Orders - Obligations, Paid
  };

  const ussglAccount = ussglMappings[glAccountCode];

  if (!ussglAccount) {
    errors.push(`No USSGL mapping found for GL account ${glAccountCode}`);
  }

  return {
    valid: errors.length === 0,
    ussglAccount,
    errors,
  };
};

/**
 * Generates monthly obligation report for appropriation.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} fiscalYear - Fiscal year
 * @param {number} month - Month (1-12)
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Monthly obligation report
 *
 * @example
 * ```typescript
 * const report = await generateMonthlyObligationReport('APPR-2026-MILCON-001', 2026, 1, ObligationModel);
 * ```
 */
export const generateMonthlyObligationReport = async (
  appropriationId: string,
  fiscalYear: number,
  month: number,
  Obligation: any,
): Promise<any> => {
  const obligations = await Obligation.findAll({
    where: {
      appropriationId,
      fiscalYear,
      period: month,
      status: { [Op.ne]: 'cancelled' },
    },
  });

  const byDocumentType = obligations.reduce((acc: any, obl: any) => {
    const type = obl.documentType;
    if (!acc[type]) {
      acc[type] = { count: 0, amount: 0 };
    }
    acc[type].count++;
    acc[type].amount += parseFloat(obl.amount);
    return acc;
  }, {});

  const totalObligations = obligations.length;
  const totalAmount = obligations.reduce(
    (sum: number, obl: any) => sum + parseFloat(obl.amount),
    0,
  );

  return {
    appropriationId,
    fiscalYear,
    month,
    totalObligations,
    totalAmount,
    byDocumentType,
    obligations: obligations.map((o: any) => ({
      obligationId: o.obligationId,
      documentNumber: o.documentNumber,
      documentType: o.documentType,
      amount: parseFloat(o.amount),
      obligationDate: o.obligationDate,
      status: o.status,
    })),
  };
};

/**
 * Processes prior year adjustments to obligations.
 *
 * @param {string} obligationId - Obligation to adjust
 * @param {number} adjustmentAmount - Adjustment amount
 * @param {string} reason - Adjustment reason
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Adjusted obligation
 *
 * @example
 * ```typescript
 * const adjusted = await processPriorYearAdjustment(
 *   'OBL-2025-001',
 *   -10000.00,
 *   'Correct prior year over-obligation',
 *   ObligationModel
 * );
 * ```
 */
export const processPriorYearAdjustment = async (
  obligationId: string,
  adjustmentAmount: number,
  reason: string,
  Obligation: any,
): Promise<any> => {
  const obligation = await Obligation.findOne({ where: { obligationId } });

  if (!obligation) {
    throw new Error(`Obligation ${obligationId} not found`);
  }

  const currentFY = new Date().getFullYear();
  if (obligation.fiscalYear >= currentFY) {
    throw new Error('This function is for prior year adjustments only');
  }

  obligation.amount = parseFloat(obligation.amount) + adjustmentAmount;
  obligation.metadata = {
    ...obligation.metadata,
    priorYearAdjustments: [
      ...(obligation.metadata.priorYearAdjustments || []),
      {
        amount: adjustmentAmount,
        reason,
        adjustedAt: new Date(),
      },
    ],
  };

  await obligation.save();

  return obligation;
};

/**
 * Validates budget execution against Congressional restrictions.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {string} plannedUse - Planned use of funds
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<{ compliant: boolean; violations: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateCongressionalRestrictions(
 *   'APPR-2026-MILCON-001',
 *   'Base construction',
 *   AppropriationModel
 * );
 * ```
 */
export const validateCongressionalRestrictions = async (
  appropriationId: string,
  plannedUse: string,
  Appropriation: any,
): Promise<{ compliant: boolean; violations: string[] }> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const violations: string[] = [];
  const restrictions = appropriation.restrictions || [];

  // Check each restriction (simplified - production would have complex rule engine)
  for (const restriction of restrictions) {
    if (
      restriction.toLowerCase().includes('prohibit') &&
      plannedUse.toLowerCase().includes(restriction.split(' ')[1])
    ) {
      violations.push(`Use prohibited by restriction: ${restriction}`);
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
};

// ============================================================================
// REPORTING & ANALYTICS (Functions 21-30)
// ============================================================================

/**
 * Generates quarterly budget execution summary.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} quarter - Quarter (1-4)
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Quarterly summary
 *
 * @example
 * ```typescript
 * const summary = await generateQuarterlyExecutionSummary(2026, 1, AppropriationModel, ObligationModel);
 * ```
 */
export const generateQuarterlyExecutionSummary = async (
  fiscalYear: number,
  quarter: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriations = await Appropriation.findAll({
    where: { fiscalYear },
  });

  const summaries = [];

  for (const appr of appropriations) {
    const status = await getBudgetExecutionStatus(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );

    const executionRate = (status.obligated / status.totalAuthority) * 100;
    const burnRate = executionRate / quarter; // Simplified burn rate

    summaries.push({
      appropriationId: appr.appropriationId,
      tafsCode: appr.tafsCode,
      category: appr.appropriationCategory,
      totalAuthority: status.totalAuthority,
      obligated: status.obligated,
      unobligated: status.unobligated,
      executionRate: Math.round(executionRate * 100) / 100,
      burnRate: Math.round(burnRate * 100) / 100,
      status: status,
    });
  }

  return {
    fiscalYear,
    quarter,
    appropriationCount: appropriations.length,
    summaries,
    totalAuthority: summaries.reduce((sum, s) => sum + s.totalAuthority, 0),
    totalObligated: summaries.reduce((sum, s) => sum + s.obligated, 0),
    totalUnobligated: summaries.reduce((sum, s) => sum + s.unobligated, 0),
    averageExecutionRate:
      summaries.reduce((sum, s) => sum + s.executionRate, 0) / summaries.length,
  };
};

/**
 * Analyzes appropriation burn rate and projects year-end status.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Burn rate analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBurnRate('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * ```
 */
export const analyzeBurnRate = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const status = await getBudgetExecutionStatus(
    appropriationId,
    Appropriation,
    Obligation,
  );

  // Calculate monthly burn
  const obligations = await Obligation.findAll({
    where: { appropriationId, status: { [Op.ne]: 'cancelled' } },
  });

  const monthlyBurn: Record<number, number> = {};
  obligations.forEach((obl: any) => {
    const month = obl.period;
    monthlyBurn[month] = (monthlyBurn[month] || 0) + parseFloat(obl.amount);
  });

  const currentMonth = new Date().getMonth() + 1;
  const monthsElapsed = currentMonth >= 10 ? currentMonth - 9 : currentMonth + 3;
  const averageMonthlyBurn =
    Object.values(monthlyBurn).reduce((sum, amt) => sum + amt, 0) / monthsElapsed;

  const monthsRemaining = 12 - monthsElapsed;
  const projectedYearEndObligated =
    status.obligated + averageMonthlyBurn * monthsRemaining;

  const projectedUnobligated = status.totalAuthority - projectedYearEndObligated;

  return {
    appropriationId,
    currentStatus: status,
    monthsElapsed,
    monthsRemaining,
    monthlyBurn,
    averageMonthlyBurn,
    projectedYearEndObligated,
    projectedUnobligated,
    atRisk: projectedUnobligated < 0 || projectedUnobligated > status.totalAuthority * 0.1,
  };
};

/**
 * Identifies appropriations at risk of under-execution or over-obligation.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any[]>} At-risk appropriations
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskAppropriations(2026, AppropriationModel, ObligationModel);
 * ```
 */
export const identifyAtRiskAppropriations = async (
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any[]> => {
  const appropriations = await Appropriation.findAll({
    where: { fiscalYear, status: 'active' },
  });

  const atRisk = [];

  for (const appr of appropriations) {
    const analysis = await analyzeBurnRate(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );

    if (analysis.atRisk) {
      let riskType = '';
      if (analysis.projectedUnobligated < 0) {
        riskType = 'over_obligation_risk';
      } else if (
        analysis.projectedUnobligated >
        analysis.currentStatus.totalAuthority * 0.1
      ) {
        riskType = 'under_execution_risk';
      }

      atRisk.push({
        appropriationId: appr.appropriationId,
        tafsCode: appr.tafsCode,
        category: appr.appropriationCategory,
        riskType,
        currentExecutionRate:
          (analysis.currentStatus.obligated / analysis.currentStatus.totalAuthority) * 100,
        projectedYearEndRate:
          (analysis.projectedYearEndObligated / analysis.currentStatus.totalAuthority) * 100,
        projectedUnobligated: analysis.projectedUnobligated,
      });
    }
  }

  return atRisk;
};

/**
 * Generates apportionment schedule (SF-132) for OMB submission.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<SF132Data>} SF-132 data
 *
 * @example
 * ```typescript
 * const sf132 = await generateApportionmentSchedule('APPR-2026-MILCON-001', 2026, AppropriationModel);
 * ```
 */
export const generateApportionmentSchedule = async (
  appropriationId: string,
  fiscalYear: number,
  Appropriation: any,
): Promise<SF132Data> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const apportionments = appropriation.metadata.apportionments || [];

  // Aggregate Category A by quarter
  const categoryA = { q1: 0, q2: 0, q3: 0, q4: 0 };
  const categoryB: ProjectApportionment[] = [];

  apportionments.forEach((ap: any) => {
    if (ap.category === 'category_a' && ap.quarterNumber) {
      const qKey = `q${ap.quarterNumber}` as keyof typeof categoryA;
      categoryA[qKey] += parseFloat(ap.amount);
    } else if (ap.category === 'category_b' && ap.projectCode) {
      categoryB.push({
        projectCode: ap.projectCode,
        amount: parseFloat(ap.amount),
        milestones: ap.restrictions || [],
      });
    }
  });

  const totalApportioned =
    categoryA.q1 +
    categoryA.q2 +
    categoryA.q3 +
    categoryA.q4 +
    categoryB.reduce((sum, p) => sum + p.amount, 0);

  return {
    appropriationId,
    tafsCode: appropriation.tafsCode,
    fiscalYear,
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    categoryA,
    categoryB,
    totalApportioned,
    ombControlNumber: `OMB-${fiscalYear}-${appropriation.programCode}`,
    submissionDate: new Date(),
  };
};

/**
 * Tracks fund balance by fiscal year and period.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} fiscalYear - Fiscal year
 * @param {number} period - Fiscal period
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await trackFundBalance('APPR-2026-MILCON-001', 2026, 3, AppropriationModel, ObligationModel);
 * ```
 */
export const trackFundBalance = async (
  appropriationId: string,
  fiscalYear: number,
  period: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const status = await getBudgetExecutionStatus(
    appropriationId,
    Appropriation,
    Obligation,
  );

  // Get obligations through this period
  const obligations = await Obligation.findAll({
    where: {
      appropriationId,
      fiscalYear,
      period: { [Op.lte]: period },
      status: { [Op.ne]: 'cancelled' },
    },
  });

  const obligatedThroughPeriod = obligations.reduce(
    (sum: number, obl: any) => sum + parseFloat(obl.amount),
    0,
  );

  return {
    appropriationId,
    fiscalYear,
    period,
    totalAuthority: status.totalAuthority,
    obligatedThroughPeriod,
    unobligatedBalance: status.totalAuthority - obligatedThroughPeriod,
    apportioned: status.apportioned,
    allotted: status.allotted,
  };
};

/**
 * Generates year-end close report for appropriations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Year-end close report
 *
 * @example
 * ```typescript
 * const closeReport = await generateYearEndCloseReport(2026, AppropriationModel, ObligationModel);
 * ```
 */
export const generateYearEndCloseReport = async (
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriations = await Appropriation.findAll({
    where: { fiscalYear },
  });

  const closeData = [];

  for (const appr of appropriations) {
    const status = await getBudgetExecutionStatus(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );

    const carryover = await trackMultiYearCarryover(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );

    closeData.push({
      appropriationId: appr.appropriationId,
      tafsCode: appr.tafsCode,
      category: appr.appropriationCategory,
      totalAuthority: status.totalAuthority,
      obligated: status.obligated,
      unobligated: status.unobligated,
      expended: status.expended,
      outlayed: status.outlayed,
      availabilityPeriod: appr.availabilityPeriod,
      canCarryover: carryover.canCarryover,
      carryoverAmount: carryover.canCarryover ? status.unobligated : 0,
      cancelledAmount: !carryover.canCarryover ? status.unobligated : 0,
    });
  }

  return {
    fiscalYear,
    appropriationCount: appropriations.length,
    closeData,
    totalAuthority: closeData.reduce((sum, d) => sum + d.totalAuthority, 0),
    totalObligated: closeData.reduce((sum, d) => sum + d.obligated, 0),
    totalCarryover: closeData.reduce((sum, d) => sum + d.carryoverAmount, 0),
    totalCancelled: closeData.reduce((sum, d) => sum + d.cancelledAmount, 0),
  };
};

/**
 * Exports appropriation data for DATA Act reporting.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} quarter - Quarter
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<string>} DATA Act XML
 *
 * @example
 * ```typescript
 * const dataActXML = await exportDATAActReport(2026, 1, AppropriationModel, ObligationModel);
 * ```
 */
export const exportDATAActReport = async (
  fiscalYear: number,
  quarter: number,
  Appropriation: any,
  Obligation: any,
): Promise<string> => {
  const summary = await generateQuarterlyExecutionSummary(
    fiscalYear,
    quarter,
    Appropriation,
    Obligation,
  );

  // Generate DATA Act XML (simplified structure)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DATAActSubmission>
  <FiscalYear>${fiscalYear}</FiscalYear>
  <Quarter>${quarter}</Quarter>
  <Appropriations>
${summary.summaries
  .map(
    (s: any) => `    <Appropriation>
      <TAFS>${s.tafsCode}</TAFS>
      <Category>${s.category}</Category>
      <TotalAuthority>${s.totalAuthority.toFixed(2)}</TotalAuthority>
      <Obligated>${s.obligated.toFixed(2)}</Obligated>
      <Unobligated>${s.unobligated.toFixed(2)}</Unobligated>
      <ExecutionRate>${s.executionRate}</ExecutionRate>
    </Appropriation>`,
  )
  .join('\n')}
  </Appropriations>
  <Summary>
    <TotalAuthority>${summary.totalAuthority.toFixed(2)}</TotalAuthority>
    <TotalObligated>${summary.totalObligated.toFixed(2)}</TotalObligated>
    <TotalUnobligated>${summary.totalUnobligated.toFixed(2)}</TotalUnobligated>
  </Summary>
</DATAActSubmission>`;

  return xml;
};

/**
 * Analyzes appropriation lapse and cancellation status.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Lapse analysis
 *
 * @example
 * ```typescript
 * const lapse = await analyzeAppropriationLapse('APPR-2026-MILCON-001', AppropriationModel);
 * ```
 */
export const analyzeAppropriationLapse = async (
  appropriationId: string,
  Appropriation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const now = new Date();
  let lapseStatus = 'current';
  let daysUntilLapse: number | null = null;

  if (appropriation.expirationDate) {
    const daysRemaining = Math.floor(
      (appropriation.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    daysUntilLapse = daysRemaining;

    if (daysRemaining < 0) {
      lapseStatus = 'lapsed';
    } else if (daysRemaining <= 90) {
      lapseStatus = 'approaching_lapse';
    }
  } else {
    lapseStatus = 'no_year';
  }

  return {
    appropriationId,
    tafsCode: appropriation.tafsCode,
    availabilityPeriod: appropriation.availabilityPeriod,
    enactmentDate: appropriation.enactmentDate,
    expirationDate: appropriation.expirationDate,
    lapseStatus,
    daysUntilLapse,
    requiresAction: lapseStatus === 'approaching_lapse',
  };
};

/**
 * Validates appropriation data completeness for audit.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<{ valid: boolean; issues: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateAppropriationData('APPR-2026-MILCON-001', AppropriationModel);
 * ```
 */
export const validateAppropriationData = async (
  appropriationId: string,
  Appropriation: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    return {
      valid: false,
      issues: [`Appropriation ${appropriationId} not found`],
    };
  }

  const issues: string[] = [];

  // Validate required fields
  if (!appropriation.tafsCode) issues.push('Missing TAFS code');
  if (!appropriation.congressionalActNumber)
    issues.push('Missing Congressional act number');
  if (!appropriation.publicLawNumber) issues.push('Missing public law number');
  if (!appropriation.budgetAuthority || appropriation.budgetAuthority <= 0)
    issues.push('Invalid budget authority');

  // Validate dates
  if (!appropriation.enactmentDate) issues.push('Missing enactment date');
  if (
    appropriation.availabilityPeriod !== 'no_year' &&
    !appropriation.expirationDate
  ) {
    issues.push('Missing expiration date for time-limited appropriation');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Generates comprehensive appropriation ledger for fiscal year.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Appropriation ledger
 *
 * @example
 * ```typescript
 * const ledger = await generateAppropriationLedger('APPR-2026-MILCON-001', 2026, AppropriationModel, ObligationModel);
 * ```
 */
export const generateAppropriationLedger = async (
  appropriationId: string,
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const obligations = await Obligation.findAll({
    where: { appropriationId, fiscalYear },
    order: [['obligationDate', 'ASC']],
  });

  const ledgerEntries = [];
  let runningBalance = parseFloat(appropriation.budgetAuthority);

  // Add initial authority entry
  ledgerEntries.push({
    date: appropriation.enactmentDate,
    type: 'AUTHORITY',
    description: 'Congressional appropriation',
    amount: parseFloat(appropriation.budgetAuthority),
    balance: runningBalance,
  });

  // Add obligation entries
  for (const obl of obligations) {
    runningBalance -= parseFloat(obl.amount);
    ledgerEntries.push({
      date: obl.obligationDate,
      type: 'OBLIGATION',
      documentNumber: obl.documentNumber,
      description: obl.description,
      amount: -parseFloat(obl.amount),
      balance: runningBalance,
    });
  }

  return {
    appropriationId,
    tafsCode: appropriation.tafsCode,
    fiscalYear,
    openingBalance: parseFloat(appropriation.budgetAuthority),
    closingBalance: runningBalance,
    ledgerEntries,
  };
};

// ============================================================================
// ADVANCED COMPOSITES (Functions 31-42)
// ============================================================================

/**
 * Orchestrates complete appropriation-to-outlay workflow for a project.
 *
 * @param {any} projectData - Project financial data
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Complete workflow result
 *
 * @example
 * ```typescript
 * const workflow = await orchestrateCompleteWorkflow({
 *   appropriationId: 'APPR-2026-MILCON-001',
 *   allotmentId: 'ALT-2026-001',
 *   projectId: 'PRJ-BARRACKS-001',
 *   obligationAmount: 5000000.00,
 *   vendorId: 'VND-001',
 *   description: 'Fort Bragg barracks construction',
 *   expectedCompletionDate: new Date('2027-06-30')
 * }, AppropriationModel, ObligationModel);
 * ```
 */
export const orchestrateCompleteWorkflow = async (
  projectData: any,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const workflow = {
    steps: [],
    status: 'in_progress',
    startedAt: new Date(),
  };

  try {
    // Step 1: Validate appropriation authority
    workflow.steps.push({ step: 1, name: 'Validate Authority', status: 'in_progress' });
    const authority = await validateAppropriationAuthority(
      projectData.appropriationId,
      Appropriation,
      Obligation,
    );
    if (!authority.available) {
      throw new Error('Appropriation not available');
    }
    workflow.steps[0].status = 'completed';

    // Step 2: Anti-deficiency check
    workflow.steps.push({ step: 2, name: 'Anti-Deficiency Check', status: 'in_progress' });
    const adfCheck = await checkAntiDeficiency(
      projectData.allotmentId,
      projectData.obligationAmount,
      Appropriation,
      Obligation,
    );
    if (!adfCheck.passed) {
      throw new Error(`Anti-deficiency violation: ${adfCheck.violations.join('; ')}`);
    }
    workflow.steps[1].status = 'completed';

    // Step 3: Create obligation
    workflow.steps.push({ step: 3, name: 'Create Obligation', status: 'in_progress' });
    const obligation = await createObligation(
      {
        obligationId: `OBL-${Date.now()}`,
        allotmentId: projectData.allotmentId,
        documentNumber: projectData.contractNumber || `DOC-${Date.now()}`,
        documentType: 'contract',
        amount: projectData.obligationAmount,
        obligationDate: new Date(),
        vendorId: projectData.vendorId,
        projectId: projectData.projectId,
        description: projectData.description,
        fiscalYear: new Date().getFullYear(),
        period: new Date().getMonth() + 1,
        obligatedBy: projectData.userId || 'system',
        glAccountCode: projectData.glAccountCode || '6100',
        ussglAccount: '4801',
        status: 'undelivered',
      },
      Obligation,
      Appropriation,
    );
    workflow.steps[2].status = 'completed';
    workflow.steps[2].obligationId = obligation.obligationId;

    workflow.status = 'completed';
    workflow.completedAt = new Date();

    return {
      workflow,
      obligation,
      authority,
      adfCheck,
    };
  } catch (error: any) {
    workflow.status = 'failed';
    workflow.error = error.message;
    throw error;
  }
};

/**
 * Processes end-to-end payment cycle from obligation to outlay.
 *
 * @param {string} obligationId - Obligation identifier
 * @param {number} paymentAmount - Payment amount
 * @param {any} invoiceData - Invoice data
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Payment cycle result
 *
 * @example
 * ```typescript
 * const payment = await processPaymentCycle(
 *   'OBL-2026-001',
 *   250000.00,
 *   { invoiceNumber: 'INV-12345', deliveryDate: new Date() },
 *   ObligationModel
 * );
 * ```
 */
export const processPaymentCycle = async (
  obligationId: string,
  paymentAmount: number,
  invoiceData: any,
  Obligation: any,
): Promise<any> => {
  // Step 1: Record accrual
  const accrualId = `ACC-${Date.now()}`;
  await recordAccrual(
    {
      accrualId,
      obligationId,
      amount: paymentAmount,
      accrualDate: new Date(),
      deliveryDate: invoiceData.deliveryDate,
      invoiceNumber: invoiceData.invoiceNumber,
      description: invoiceData.description || 'Goods/services received',
      fiscalYear: new Date().getFullYear(),
      period: new Date().getMonth() + 1,
      status: 'accrued',
    },
    Obligation,
  );

  // Step 2: Process expenditure
  const expenditureId = `EXP-${Date.now()}`;
  await processExpenditure(
    {
      expenditureId,
      accrualId,
      obligationId,
      amount: paymentAmount,
      expenditureDate: new Date(),
      paymentMethod: invoiceData.paymentMethod || 'ach',
      paymentNumber: invoiceData.paymentNumber,
      fiscalYear: new Date().getFullYear(),
      period: new Date().getMonth() + 1,
      paidBy: invoiceData.paidBy || 'system',
      status: 'processed',
    },
    Obligation,
  );

  // Step 3: Record outlay
  const outlayId = `OUT-${Date.now()}`;
  await recordOutlay(
    {
      outlayId,
      expenditureId,
      amount: paymentAmount,
      outlayDate: new Date(),
      treasuryAccountSymbol: invoiceData.tafsCode || '',
      fiscalYear: new Date().getFullYear(),
      period: new Date().getMonth() + 1,
      status: 'reported_to_treasury',
    },
    Obligation,
  );

  return {
    accrualId,
    expenditureId,
    outlayId,
    amount: paymentAmount,
    completedAt: new Date(),
  };
};

/**
 * Manages complete multi-year construction project funding lifecycle.
 *
 * @param {any} projectData - Construction project data
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Project funding lifecycle
 *
 * @example
 * ```typescript
 * const lifecycle = await manageConstructionProjectLifecycle({
 *   projectId: 'PRJ-BARRACKS-001',
 *   appropriationId: 'APPR-2026-MILCON-001',
 *   totalCost: 50000000.00,
 *   yearlyPhasing: [10000000, 20000000, 20000000],
 *   constructionYears: 3
 * }, AppropriationModel, ObligationModel);
 * ```
 */
export const manageConstructionProjectLifecycle = async (
  projectData: any,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const lifecycle = {
    projectId: projectData.projectId,
    totalCost: projectData.totalCost,
    phases: [],
    status: 'in_progress',
  };

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < projectData.constructionYears; i++) {
    const phaseYear = currentYear + i;
    const phaseAmount = projectData.yearlyPhasing[i];

    lifecycle.phases.push({
      year: phaseYear,
      phase: i + 1,
      budgetedAmount: phaseAmount,
      obligated: 0,
      expended: 0,
      status: i === 0 ? 'active' : 'planned',
    });
  }

  return lifecycle;
};

/**
 * Reconciles appropriation data with Treasury accounts.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} treasuryData - Treasury account data
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileWithTreasury(
 *   'APPR-2026-MILCON-001',
 *   treasuryAccountData,
 *   AppropriationModel,
 *   ObligationModel
 * );
 * ```
 */
export const reconcileWithTreasury = async (
  appropriationId: string,
  treasuryData: any,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const status = await getBudgetExecutionStatus(
    appropriationId,
    Appropriation,
    Obligation,
  );

  const discrepancies = [];

  // Compare authority
  if (
    Math.abs(status.totalAuthority - parseFloat(treasuryData.authority)) > 0.01
  ) {
    discrepancies.push({
      field: 'authority',
      cefms: status.totalAuthority,
      treasury: parseFloat(treasuryData.authority),
      difference: status.totalAuthority - parseFloat(treasuryData.authority),
    });
  }

  // Compare obligations
  if (
    Math.abs(status.obligated - parseFloat(treasuryData.obligations)) > 0.01
  ) {
    discrepancies.push({
      field: 'obligations',
      cefms: status.obligated,
      treasury: parseFloat(treasuryData.obligations),
      difference: status.obligated - parseFloat(treasuryData.obligations),
    });
  }

  // Compare outlays
  if (Math.abs(status.outlayed - parseFloat(treasuryData.outlays)) > 0.01) {
    discrepancies.push({
      field: 'outlays',
      cefms: status.outlayed,
      treasury: parseFloat(treasuryData.outlays),
      difference: status.outlayed - parseFloat(treasuryData.outlays),
    });
  }

  return {
    appropriationId,
    reconciled: discrepancies.length === 0,
    discrepancies,
    reconciledAt: new Date(),
  };
};

/**
 * Automates quarterly apportionment requests to OMB.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {number} quarter - Quarter number
 * @param {any} Appropriation - Appropriation model
 * @returns {Promise<any>} Apportionment request
 *
 * @example
 * ```typescript
 * const request = await automateApportionmentRequest('APPR-2026-MILCON-001', 2, AppropriationModel);
 * ```
 */
export const automateApportionmentRequest = async (
  appropriationId: string,
  quarter: number,
  Appropriation: any,
): Promise<any> => {
  const sf132 = await generateApportionmentSchedule(
    appropriationId,
    new Date().getFullYear(),
    Appropriation,
  );

  // Generate request package
  const request = {
    appropriationId,
    tafsCode: sf132.tafsCode,
    fiscalYear: sf132.fiscalYear,
    quarter,
    requestedAmount:
      quarter <= 4
        ? sf132.categoryA[`q${quarter}` as keyof typeof sf132.categoryA]
        : 0,
    sf132Data: sf132,
    submittedAt: new Date(),
    status: 'submitted',
  };

  return request;
};

/**
 * Generates executive dashboard for appropriation portfolio.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Executive dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateExecutiveDashboard(2026, AppropriationModel, ObligationModel);
 * ```
 */
export const generateExecutiveDashboard = async (
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const summary = await generateQuarterlyExecutionSummary(
    fiscalYear,
    Math.ceil((new Date().getMonth() + 1) / 3),
    Appropriation,
    Obligation,
  );

  const atRisk = await identifyAtRiskAppropriations(
    fiscalYear,
    Appropriation,
    Obligation,
  );

  const appropriations = await Appropriation.findAll({
    where: { fiscalYear },
  });

  const byCategory: Record<string, any> = {};
  for (const appr of appropriations) {
    const category = appr.appropriationCategory;
    if (!byCategory[category]) {
      byCategory[category] = { count: 0, authority: 0, obligated: 0 };
    }
    const status = await getBudgetExecutionStatus(
      appr.appropriationId,
      Appropriation,
      Obligation,
    );
    byCategory[category].count++;
    byCategory[category].authority += status.totalAuthority;
    byCategory[category].obligated += status.obligated;
  }

  return {
    fiscalYear,
    asOfDate: new Date(),
    summary: {
      totalAuthority: summary.totalAuthority,
      totalObligated: summary.totalObligated,
      totalUnobligated: summary.totalUnobligated,
      averageExecutionRate: summary.averageExecutionRate,
    },
    byCategory,
    atRiskCount: atRisk.length,
    atRiskAppropriations: atRisk,
    appropriationCount: appropriations.length,
  };
};

/**
 * Processes year-end appropriation cancellations and carry-forwards.
 *
 * @param {number} fiscalYear - Fiscal year to close
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Year-end processing result
 *
 * @example
 * ```typescript
 * const yearEnd = await processYearEndActions(2026, AppropriationModel, ObligationModel);
 * ```
 */
export const processYearEndActions = async (
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const closeReport = await generateYearEndCloseReport(
    fiscalYear,
    Appropriation,
    Obligation,
  );

  const actions = {
    cancelled: [],
    carriedForward: [],
    totalCancelled: 0,
    totalCarriedForward: 0,
  };

  for (const item of closeReport.closeData) {
    if (item.cancelledAmount > 0) {
      actions.cancelled.push({
        appropriationId: item.appropriationId,
        amount: item.cancelledAmount,
      });
      actions.totalCancelled += item.cancelledAmount;
    }

    if (item.carryoverAmount > 0) {
      actions.carriedForward.push({
        appropriationId: item.appropriationId,
        amount: item.carryoverAmount,
      });
      actions.totalCarriedForward += item.carryoverAmount;
    }
  }

  return {
    fiscalYear,
    processedAt: new Date(),
    actions,
    closeReport,
  };
};

/**
 * Validates complete appropriation lifecycle compliance.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateLifecycleCompliance('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * ```
 */
export const validateLifecycleCompliance = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const validation = await validateAppropriationData(
    appropriationId,
    Appropriation,
  );

  const adfCheck = await checkAntiDeficiency(
    '', // Will check overall appropriation
    0,
    Appropriation,
    Obligation,
  );

  const restrictionCheck = await validateCongressionalRestrictions(
    appropriationId,
    'general use',
    Appropriation,
  );

  const issues = [
    ...validation.issues,
    ...adfCheck.violations,
    ...restrictionCheck.violations,
  ];

  return {
    appropriationId,
    compliant: issues.length === 0,
    issues,
    warnings: adfCheck.warnings,
    validatedAt: new Date(),
  };
};

/**
 * Generates comprehensive audit trail for appropriation.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await generateAuditTrail('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * ```
 */
export const generateAuditTrail = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const appropriation = await Appropriation.findOne({
    where: { appropriationId },
  });

  if (!appropriation) {
    throw new Error(`Appropriation ${appropriationId} not found`);
  }

  const obligations = await Obligation.findAll({
    where: { appropriationId },
    order: [['createdAt', 'ASC']],
  });

  const auditEvents = [];

  // Appropriation creation
  auditEvents.push({
    timestamp: appropriation.createdAt,
    eventType: 'APPROPRIATION_CREATED',
    description: `Appropriation ${appropriationId} created`,
    amount: parseFloat(appropriation.budgetAuthority),
    user: 'system',
  });

  // Apportionments
  const apportionments = appropriation.metadata.apportionments || [];
  apportionments.forEach((ap: any) => {
    auditEvents.push({
      timestamp: ap.createdAt,
      eventType: 'APPORTIONMENT',
      description: `Apportionment ${ap.apportionmentId}`,
      amount: parseFloat(ap.amount),
      user: 'OMB',
    });
  });

  // Allotments
  const allotments = appropriation.metadata.allotments || [];
  allotments.forEach((al: any) => {
    auditEvents.push({
      timestamp: al.createdAt,
      eventType: 'ALLOTMENT',
      description: `Allotment ${al.allotmentId} to ${al.organizationCode}`,
      amount: parseFloat(al.amount),
      user: al.allottedBy,
    });
  });

  // Obligations
  obligations.forEach((obl: any) => {
    auditEvents.push({
      timestamp: obl.createdAt,
      eventType: 'OBLIGATION',
      description: `Obligation ${obl.obligationId} - ${obl.description}`,
      amount: parseFloat(obl.amount),
      user: obl.obligatedBy,
    });
  });

  return {
    appropriationId,
    auditEvents: auditEvents.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    ),
    totalEvents: auditEvents.length,
    generatedAt: new Date(),
  };
};

/**
 * Optimizes fund allocation across competing priorities.
 *
 * @param {any[]} allotmentRequests - Array of allotment requests
 * @param {number} availableFunds - Available funds to allocate
 * @returns {Promise<any>} Optimized allocation
 *
 * @example
 * ```typescript
 * const allocation = await optimizeFundAllocation([
 *   { priority: 1, amount: 10000000, purpose: 'Critical infrastructure' },
 *   { priority: 2, amount: 5000000, purpose: 'Maintenance' }
 * ], 12000000);
 * ```
 */
export const optimizeFundAllocation = async (
  allotmentRequests: any[],
  availableFunds: number,
): Promise<any> => {
  // Sort by priority
  const sorted = allotmentRequests.sort((a, b) => a.priority - b.priority);

  const allocations = [];
  let remaining = availableFunds;

  for (const request of sorted) {
    if (remaining >= request.amount) {
      allocations.push({
        ...request,
        allocated: request.amount,
        status: 'fully_funded',
      });
      remaining -= request.amount;
    } else if (remaining > 0) {
      allocations.push({
        ...request,
        allocated: remaining,
        status: 'partially_funded',
        shortfall: request.amount - remaining,
      });
      remaining = 0;
    } else {
      allocations.push({
        ...request,
        allocated: 0,
        status: 'unfunded',
        shortfall: request.amount,
      });
    }
  }

  return {
    totalRequested: allotmentRequests.reduce((sum, r) => sum + r.amount, 0),
    totalAvailable: availableFunds,
    totalAllocated: availableFunds - remaining,
    remaining,
    allocations,
  };
};

/**
 * Monitors budget execution velocity and alerts on anomalies.
 *
 * @param {string} appropriationId - Appropriation identifier
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Velocity monitoring result
 *
 * @example
 * ```typescript
 * const monitoring = await monitorExecutionVelocity('APPR-2026-MILCON-001', AppropriationModel, ObligationModel);
 * ```
 */
export const monitorExecutionVelocity = async (
  appropriationId: string,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const burnRate = await analyzeBurnRate(
    appropriationId,
    Appropriation,
    Obligation,
  );

  const alerts = [];

  // Check for abnormal velocity
  const expectedMonthlyRate =
    burnRate.currentStatus.totalAuthority / 12;
  const actualMonthlyRate = burnRate.averageMonthlyBurn;
  const variance = actualMonthlyRate - expectedMonthlyRate;
  const variancePercent = (variance / expectedMonthlyRate) * 100;

  if (Math.abs(variancePercent) > 25) {
    alerts.push({
      severity: 'high',
      type: 'velocity_variance',
      message: `Execution velocity ${variancePercent > 0 ? 'above' : 'below'} expected by ${Math.abs(variancePercent).toFixed(1)}%`,
    });
  }

  // Check for year-end risk
  if (burnRate.atRisk) {
    alerts.push({
      severity: 'medium',
      type: 'year_end_risk',
      message: `Projected year-end status indicates potential ${burnRate.projectedUnobligated < 0 ? 'over-obligation' : 'under-execution'}`,
    });
  }

  return {
    appropriationId,
    burnRate,
    alerts,
    monitoredAt: new Date(),
  };
};

/**
 * Consolidates appropriation data across organizational hierarchies.
 *
 * @param {string[]} organizationCodes - Organization codes to consolidate
 * @param {number} fiscalYear - Fiscal year
 * @param {any} Appropriation - Appropriation model
 * @param {any} Obligation - Obligation model
 * @returns {Promise<any>} Consolidated data
 *
 * @example
 * ```typescript
 * const consolidated = await consolidateOrganizationalData(
 *   ['USACE-NAB', 'USACE-SAC', 'USACE-SWD'],
 *   2026,
 *   AppropriationModel,
 *   ObligationModel
 * );
 * ```
 */
export const consolidateOrganizationalData = async (
  organizationCodes: string[],
  fiscalYear: number,
  Appropriation: any,
  Obligation: any,
): Promise<any> => {
  const consolidated = {
    organizationCodes,
    fiscalYear,
    byOrganization: [],
    totals: {
      authority: 0,
      obligated: 0,
      unobligated: 0,
    },
  };

  for (const orgCode of organizationCodes) {
    const appropriations = await Appropriation.findAll({
      where: { organizationCode: orgCode, fiscalYear },
    });

    let orgAuthority = 0;
    let orgObligated = 0;

    for (const appr of appropriations) {
      const status = await getBudgetExecutionStatus(
        appr.appropriationId,
        Appropriation,
        Obligation,
      );
      orgAuthority += status.totalAuthority;
      orgObligated += status.obligated;
    }

    consolidated.byOrganization.push({
      organizationCode: orgCode,
      authority: orgAuthority,
      obligated: orgObligated,
      unobligated: orgAuthority - orgObligated,
      appropriationCount: appropriations.length,
    });

    consolidated.totals.authority += orgAuthority;
    consolidated.totals.obligated += orgObligated;
  }

  consolidated.totals.unobligated =
    consolidated.totals.authority - consolidated.totals.obligated;

  return consolidated;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for CEFMS Appropriations & Budget Execution.
 *
 * @example
 * ```typescript
 * @Controller('cefms/appropriations')
 * export class AppropriationsController {
 *   constructor(private readonly service: CEFMSAppropriationsService) {}
 *
 *   @Post()
 *   async create(@Body() data: AppropriationData) {
 *     return this.service.createAppropriationWithValidation(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class CEFMSAppropriationsService {
  private readonly logger = new Logger(CEFMSAppropriationsService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async createAppropriationWithValidation(data: AppropriationData) {
    const Appropriation = createAppropriationModel(this.sequelize);
    return createAppropriation(data, Appropriation);
  }

  async processFullObligationWorkflow(projectData: any) {
    const Appropriation = createAppropriationModel(this.sequelize);
    const Obligation = createObligationModel(this.sequelize);
    return orchestrateCompleteWorkflow(projectData, Appropriation, Obligation);
  }

  async getExecutiveDashboard(fiscalYear: number) {
    const Appropriation = createAppropriationModel(this.sequelize);
    const Obligation = createObligationModel(this.sequelize);
    return generateExecutiveDashboard(fiscalYear, Appropriation, Obligation);
  }

  async generateSF133(fiscalYear: number, period: number) {
    const Appropriation = createAppropriationModel(this.sequelize);
    const Obligation = createObligationModel(this.sequelize);
    return generateSF133Report(fiscalYear, period, Appropriation, Obligation);
  }
}

/**
 * Default export with all appropriations & budget execution utilities.
 */
export default {
  // Models
  createAppropriationModel,
  createObligationModel,

  // Appropriation Management (1-10)
  createAppropriation,
  validateAppropriationAuthority,
  processOMBApportionment,
  allocateAllotment,
  checkAntiDeficiency,
  recordCommitment,
  createObligation,
  adjustObligation,
  cancelObligation,
  getBudgetExecutionStatus,

  // Expenditure Processing (11-20)
  recordAccrual,
  processExpenditure,
  recordOutlay,
  generateSF133Report,
  trackMultiYearCarryover,
  processReimbursableAuthority,
  validateUSSGLMapping,
  generateMonthlyObligationReport,
  processPriorYearAdjustment,
  validateCongressionalRestrictions,

  // Reporting & Analytics (21-30)
  generateQuarterlyExecutionSummary,
  analyzeBurnRate,
  identifyAtRiskAppropriations,
  generateApportionmentSchedule,
  trackFundBalance,
  generateYearEndCloseReport,
  exportDATAActReport,
  analyzeAppropriationLapse,
  validateAppropriationData,
  generateAppropriationLedger,

  // Advanced Composites (31-42)
  orchestrateCompleteWorkflow,
  processPaymentCycle,
  manageConstructionProjectLifecycle,
  reconcileWithTreasury,
  automateApportionmentRequest,
  generateExecutiveDashboard,
  processYearEndActions,
  validateLifecycleCompliance,
  generateAuditTrail,
  optimizeFundAllocation,
  monitorExecutionVelocity,
  consolidateOrganizationalData,

  // Service
  CEFMSAppropriationsService,
};

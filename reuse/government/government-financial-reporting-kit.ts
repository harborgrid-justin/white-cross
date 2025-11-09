/**
 * LOC: GOVERNMENT_FINANCIAL_REPORTING_KIT_001
 * File: /reuse/government/government-financial-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Government financial services
 *   - CAFR generation systems
 *   - Audit reporting platforms
 *   - Financial disclosure systems
 *   - Budget management systems
 */

/**
 * File: /reuse/government/government-financial-reporting-kit.ts
 * Locator: WC-GOV-FINANCIAL-REPORTING-001
 * Purpose: Comprehensive Government Financial Reporting & GASB Compliance Kit
 *
 * Upstream: NestJS, Sequelize, Swagger, TypeScript 5.x
 * Downstream: ../backend/government/*, Financial reporting services, CAFR generation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 50 financial reporting functions for GASB compliance, CAFR, fund accounting, financial statements
 *
 * LLM Context: Enterprise-grade government financial reporting utilities for GASB compliance.
 * Provides comprehensive financial reporting capabilities including GASB-compliant reporting, CAFR
 * (Comprehensive Annual Financial Report) generation, fund financial statements, government-wide
 * financial statements, notes to financial statements, required supplementary information, statistical
 * section reporting, reconciliation statements, schedule generation, financial disclosure management,
 * and audit report preparation. Supports federal, state, and local government accounting standards.
 */

import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Fund type per GASB standards
 */
export enum FundType {
  GENERAL = 'general',
  SPECIAL_REVENUE = 'special_revenue',
  CAPITAL_PROJECTS = 'capital_projects',
  DEBT_SERVICE = 'debt_service',
  PERMANENT = 'permanent',
  ENTERPRISE = 'enterprise',
  INTERNAL_SERVICE = 'internal_service',
  PENSION_TRUST = 'pension_trust',
  INVESTMENT_TRUST = 'investment_trust',
  PRIVATE_PURPOSE_TRUST = 'private_purpose_trust',
  CUSTODIAL = 'custodial',
}

/**
 * Fund category
 */
export enum FundCategory {
  GOVERNMENTAL = 'governmental',
  PROPRIETARY = 'proprietary',
  FIDUCIARY = 'fiduciary',
}

/**
 * Financial statement type
 */
export enum FinancialStatementType {
  // Government-wide statements
  STATEMENT_OF_NET_POSITION = 'statement_of_net_position',
  STATEMENT_OF_ACTIVITIES = 'statement_of_activities',

  // Fund financial statements
  BALANCE_SHEET_GOVERNMENTAL = 'balance_sheet_governmental',
  STATEMENT_OF_REVENUES_EXPENDITURES = 'statement_of_revenues_expenditures',
  STATEMENT_OF_NET_POSITION_PROPRIETARY = 'statement_of_net_position_proprietary',
  STATEMENT_OF_REVENUES_EXPENSES_PROPRIETARY = 'statement_of_revenues_expenses_proprietary',
  STATEMENT_OF_CASH_FLOWS = 'statement_of_cash_flows',
  STATEMENT_OF_FIDUCIARY_NET_POSITION = 'statement_of_fiduciary_net_position',
  STATEMENT_OF_CHANGES_FIDUCIARY = 'statement_of_changes_fiduciary',
}

/**
 * GASB statement compliance
 */
export enum GASBStatement {
  GASB_34 = 'gasb_34', // Basic Financial Statements
  GASB_35 = 'gasb_35', // Public Colleges and Universities
  GASB_45 = 'gasb_45', // OPEB Accounting
  GASB_54 = 'gasb_54', // Fund Balance Reporting
  GASB_63 = 'gasb_63', // Financial Reporting - Deferred Outflows/Inflows
  GASB_68 = 'gasb_68', // Pension Accounting
  GASB_72 = 'gasb_72', // Fair Value Measurement
  GASB_75 = 'gasb_75', // OPEB Accounting
  GASB_84 = 'gasb_84', // Fiduciary Activities
  GASB_87 = 'gasb_87', // Leases
}

/**
 * Account classification
 */
export enum AccountClassification {
  ASSET = 'asset',
  LIABILITY = 'liability',
  DEFERRED_OUTFLOW = 'deferred_outflow',
  DEFERRED_INFLOW = 'deferred_inflow',
  NET_POSITION = 'net_position',
  REVENUE = 'revenue',
  EXPENSE = 'expense',
  EXPENDITURE = 'expenditure',
  OTHER_FINANCING_SOURCE = 'other_financing_source',
  OTHER_FINANCING_USE = 'other_financing_use',
}

/**
 * Net position component
 */
export enum NetPositionComponent {
  NET_INVESTMENT_CAPITAL_ASSETS = 'net_investment_capital_assets',
  RESTRICTED = 'restricted',
  UNRESTRICTED = 'unrestricted',
}

/**
 * Fund balance classification (GASB 54)
 */
export enum FundBalanceClassification {
  NONSPENDABLE = 'nonspendable',
  RESTRICTED = 'restricted',
  COMMITTED = 'committed',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
}

/**
 * Report section
 */
export enum ReportSection {
  INTRODUCTORY = 'introductory',
  FINANCIAL = 'financial',
  STATISTICAL = 'statistical',
}

/**
 * Audit opinion type
 */
export enum AuditOpinionType {
  UNMODIFIED = 'unmodified',
  QUALIFIED = 'qualified',
  ADVERSE = 'adverse',
  DISCLAIMER = 'disclaimer',
}

/**
 * Report ID branded type
 */
export type ReportId = string & { __brand: 'ReportId' };

/**
 * Fund ID branded type
 */
export type FundId = string & { __brand: 'FundId' };

/**
 * Account ID branded type
 */
export type AccountId = string & { __brand: 'AccountId' };

/**
 * Transaction ID branded type
 */
export type TransactionId = string & { __brand: 'TransactionId' };

/**
 * Disclosure ID branded type
 */
export type DisclosureId = string & { __brand: 'DisclosureId' };

/**
 * Entity ID type
 */
export type EntityId = string & { __brand: 'EntityId' };

/**
 * Government fund
 */
export interface GovernmentFund {
  readonly id: FundId;
  readonly entityId: EntityId;
  readonly fundNumber: string;
  readonly name: string;
  readonly type: FundType;
  readonly category: FundCategory;
  readonly description: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly metadata: Record<string, unknown>;
}

/**
 * Chart of accounts entry
 */
export interface Account {
  readonly id: AccountId;
  readonly fundId: FundId;
  readonly accountNumber: string;
  readonly name: string;
  readonly classification: AccountClassification;
  readonly normalBalance: 'debit' | 'credit';
  readonly isActive: boolean;
  readonly parentAccountId?: AccountId;
  readonly metadata: Record<string, unknown>;
}

/**
 * Financial transaction
 */
export interface FinancialTransaction {
  readonly id: TransactionId;
  readonly fundId: FundId;
  readonly transactionDate: Date;
  readonly description: string;
  readonly journalEntries: JournalEntry[];
  readonly referenceNumber?: string;
  readonly fiscalYear: number;
  readonly fiscalPeriod: number;
  readonly postedBy: string;
  readonly postedAt: Date;
  readonly isReversed: boolean;
  readonly metadata: Record<string, unknown>;
}

/**
 * Journal entry
 */
export interface JournalEntry {
  readonly entryId: string;
  readonly accountId: AccountId;
  readonly debit: number;
  readonly credit: number;
  readonly description: string;
}

/**
 * Government-wide statement of net position
 */
export interface StatementOfNetPosition {
  readonly reportId: ReportId;
  readonly entityId: EntityId;
  readonly asOfDate: Date;
  readonly fiscalYear: number;
  readonly governmental: NetPositionData;
  readonly businessType: NetPositionData;
  readonly total: NetPositionData;
  readonly componentUnits?: NetPositionData;
  readonly metadata: Record<string, unknown>;
}

/**
 * Net position data
 */
export interface NetPositionData {
  readonly assets: AssetSection;
  readonly deferredOutflows: number;
  readonly liabilities: LiabilitySection;
  readonly deferredInflows: number;
  readonly netPosition: NetPositionSection;
}

/**
 * Asset section
 */
export interface AssetSection {
  readonly currentAssets: number;
  readonly capitalAssets: number;
  readonly otherAssets: number;
  readonly totalAssets: number;
}

/**
 * Liability section
 */
export interface LiabilitySection {
  readonly currentLiabilities: number;
  readonly longTermLiabilities: number;
  readonly totalLiabilities: number;
}

/**
 * Net position section
 */
export interface NetPositionSection {
  readonly netInvestmentInCapitalAssets: number;
  readonly restricted: number;
  readonly unrestricted: number;
  readonly totalNetPosition: number;
}

/**
 * Statement of activities
 */
export interface StatementOfActivities {
  readonly reportId: ReportId;
  readonly entityId: EntityId;
  readonly fiscalYear: number;
  readonly functions: FunctionActivity[];
  readonly generalRevenues: GeneralRevenue[];
  readonly changeInNetPosition: ChangeInNetPosition;
  readonly metadata: Record<string, unknown>;
}

/**
 * Function activity
 */
export interface FunctionActivity {
  readonly functionName: string;
  readonly expenses: number;
  readonly programRevenues: ProgramRevenue;
  readonly netExpenseRevenue: NetExpenseRevenue;
}

/**
 * Program revenue
 */
export interface ProgramRevenue {
  readonly chargesForServices: number;
  readonly operatingGrants: number;
  readonly capitalGrants: number;
  readonly total: number;
}

/**
 * Net expense/revenue
 */
export interface NetExpenseRevenue {
  readonly governmental: number;
  readonly businessType: number;
  readonly total: number;
}

/**
 * General revenue
 */
export interface GeneralRevenue {
  readonly description: string;
  readonly governmental: number;
  readonly businessType: number;
  readonly total: number;
}

/**
 * Change in net position
 */
export interface ChangeInNetPosition {
  readonly governmental: number;
  readonly businessType: number;
  readonly total: number;
}

/**
 * Fund balance sheet
 */
export interface FundBalanceSheet {
  readonly reportId: ReportId;
  readonly fundId: FundId;
  readonly asOfDate: Date;
  readonly fiscalYear: number;
  readonly assets: FundAssets;
  readonly liabilities: FundLiabilities;
  readonly deferredInflows: number;
  readonly fundBalance: FundBalance;
  readonly metadata: Record<string, unknown>;
}

/**
 * Fund assets
 */
export interface FundAssets {
  readonly cash: number;
  readonly investments: number;
  readonly receivables: number;
  readonly dueFromOtherFunds: number;
  readonly dueFromOtherGovernments: number;
  readonly inventory: number;
  readonly prepaidItems: number;
  readonly total: number;
}

/**
 * Fund liabilities
 */
export interface FundLiabilities {
  readonly accountsPayable: number;
  readonly accruedLiabilities: number;
  readonly dueToOtherFunds: number;
  readonly dueToOtherGovernments: number;
  readonly unearnedRevenue: number;
  readonly total: number;
}

/**
 * Fund balance
 */
export interface FundBalance {
  readonly nonspendable: number;
  readonly restricted: number;
  readonly committed: number;
  readonly assigned: number;
  readonly unassigned: number;
  readonly total: number;
}

/**
 * Statement of revenues, expenditures, and changes in fund balance
 */
export interface StatementOfRevenuesExpenditures {
  readonly reportId: ReportId;
  readonly fundId: FundId;
  readonly fiscalYear: number;
  readonly revenues: RevenueCategory[];
  readonly totalRevenues: number;
  readonly expenditures: ExpenditureCategory[];
  readonly totalExpenditures: number;
  readonly excessDeficiency: number;
  readonly otherFinancingSources: OtherFinancing[];
  readonly otherFinancingUses: OtherFinancing[];
  readonly netOtherFinancing: number;
  readonly changeInFundBalance: number;
  readonly fundBalanceBeginning: number;
  readonly fundBalanceEnding: number;
  readonly metadata: Record<string, unknown>;
}

/**
 * Revenue category
 */
export interface RevenueCategory {
  readonly category: string;
  readonly budgeted: number;
  readonly actual: number;
  readonly variance: number;
  readonly variancePercent: number;
}

/**
 * Expenditure category
 */
export interface ExpenditureCategory {
  readonly category: string;
  readonly function?: string;
  readonly budgeted: number;
  readonly actual: number;
  readonly variance: number;
  readonly variancePercent: number;
}

/**
 * Other financing source/use
 */
export interface OtherFinancing {
  readonly description: string;
  readonly amount: number;
}

/**
 * CAFR (Comprehensive Annual Financial Report)
 */
export interface CAFR {
  readonly reportId: ReportId;
  readonly entityId: EntityId;
  readonly fiscalYear: number;
  readonly reportDate: Date;
  readonly introductorySection: IntroductorySection;
  readonly financialSection: FinancialSection;
  readonly statisticalSection: StatisticalSection;
  readonly metadata: Record<string, unknown>;
}

/**
 * Introductory section
 */
export interface IntroductorySection {
  readonly transmittalLetter: string;
  readonly organizationalChart?: string;
  readonly principalOfficials: PrincipalOfficial[];
  readonly certificateOfAchievement?: AwardCertificate;
}

/**
 * Principal official
 */
export interface PrincipalOfficial {
  readonly title: string;
  readonly name: string;
  readonly term?: string;
}

/**
 * Award certificate
 */
export interface AwardCertificate {
  readonly type: 'GFOA' | 'ASBO' | 'OTHER';
  readonly year: number;
  readonly description: string;
}

/**
 * Financial section
 */
export interface FinancialSection {
  readonly independentAuditorsReport: AuditorsReport;
  readonly managementDiscussionAnalysis: string;
  readonly basicFinancialStatements: BasicFinancialStatements;
  readonly requiredSupplementaryInformation: RequiredSupplementaryInfo[];
  readonly combiningStatements?: CombiningStatement[];
  readonly notesToFinancialStatements: Note[];
}

/**
 * Auditors report
 */
export interface AuditorsReport {
  readonly reportId: string;
  readonly auditFirm: string;
  readonly reportDate: Date;
  readonly opinionType: AuditOpinionType;
  readonly opinionText: string;
  readonly emphasis?: string[];
  readonly otherMatters?: string[];
}

/**
 * Basic financial statements
 */
export interface BasicFinancialStatements {
  readonly governmentWideStatements: GovernmentWideStatements;
  readonly fundFinancialStatements: FundFinancialStatements;
}

/**
 * Government-wide statements
 */
export interface GovernmentWideStatements {
  readonly statementOfNetPosition: StatementOfNetPosition;
  readonly statementOfActivities: StatementOfActivities;
}

/**
 * Fund financial statements
 */
export interface FundFinancialStatements {
  readonly governmentalFunds: GovernmentalFundStatements;
  readonly proprietaryFunds?: ProprietaryFundStatements;
  readonly fiduciaryFunds?: FiduciaryFundStatements;
}

/**
 * Governmental fund statements
 */
export interface GovernmentalFundStatements {
  readonly balanceSheet: FundBalanceSheet[];
  readonly revenuesExpenditures: StatementOfRevenuesExpenditures[];
  readonly reconciliations: ReconciliationStatement[];
}

/**
 * Proprietary fund statements
 */
export interface ProprietaryFundStatements {
  readonly statementOfNetPosition: StatementOfNetPosition[];
  readonly statementOfRevenues: StatementOfRevenuesExpenditures[];
  readonly statementOfCashFlows: CashFlowStatement[];
}

/**
 * Fiduciary fund statements
 */
export interface FiduciaryFundStatements {
  readonly statementOfFiduciaryNetPosition: StatementOfNetPosition[];
  readonly statementOfChanges: StatementOfRevenuesExpenditures[];
}

/**
 * Reconciliation statement
 */
export interface ReconciliationStatement {
  readonly reconciliationType: string;
  readonly fundBalance: number;
  readonly adjustments: ReconciliationAdjustment[];
  readonly netPosition: number;
}

/**
 * Reconciliation adjustment
 */
export interface ReconciliationAdjustment {
  readonly description: string;
  readonly amount: number;
  readonly explanation: string;
}

/**
 * Cash flow statement
 */
export interface CashFlowStatement {
  readonly reportId: ReportId;
  readonly fundId: FundId;
  readonly fiscalYear: number;
  readonly operatingActivities: CashFlowActivity[];
  readonly nonCapitalFinancingActivities: CashFlowActivity[];
  readonly capitalFinancingActivities: CashFlowActivity[];
  readonly investingActivities: CashFlowActivity[];
  readonly netChange: number;
  readonly cashBeginning: number;
  readonly cashEnding: number;
}

/**
 * Cash flow activity
 */
export interface CashFlowActivity {
  readonly description: string;
  readonly amount: number;
}

/**
 * Required supplementary information
 */
export interface RequiredSupplementaryInfo {
  readonly title: string;
  readonly type: 'budget_comparison' | 'pension' | 'opeb' | 'infrastructure' | 'other';
  readonly data: Record<string, unknown>;
  readonly notes?: string;
}

/**
 * Combining statement
 */
export interface CombiningStatement {
  readonly title: string;
  readonly fundType: FundType;
  readonly funds: FundId[];
  readonly data: Record<string, unknown>;
}

/**
 * Note to financial statements
 */
export interface Note {
  readonly noteNumber: string;
  readonly title: string;
  readonly content: string;
  readonly subsections?: NoteSubsection[];
  readonly gasb: GASBStatement[];
}

/**
 * Note subsection
 */
export interface NoteSubsection {
  readonly letter: string;
  readonly title: string;
  readonly content: string;
}

/**
 * Statistical section
 */
export interface StatisticalSection {
  readonly financialTrends: FinancialTrendTable[];
  readonly revenueCapacity: RevenueCapacityTable[];
  readonly debtCapacity: DebtCapacityTable[];
  readonly demographicInfo: DemographicTable[];
  readonly operatingInfo: OperatingInfoTable[];
}

/**
 * Financial trend table
 */
export interface FinancialTrendTable {
  readonly title: string;
  readonly years: number[];
  readonly data: Record<string, number[]>;
}

/**
 * Revenue capacity table
 */
export interface RevenueCapacityTable {
  readonly title: string;
  readonly years: number[];
  readonly data: Record<string, number[]>;
}

/**
 * Debt capacity table
 */
export interface DebtCapacityTable {
  readonly title: string;
  readonly years: number[];
  readonly data: Record<string, number[]>;
}

/**
 * Demographic table
 */
export interface DemographicTable {
  readonly title: string;
  readonly years: number[];
  readonly data: Record<string, unknown[]>;
}

/**
 * Operating information table
 */
export interface OperatingInfoTable {
  readonly title: string;
  readonly years: number[];
  readonly data: Record<string, unknown[]>;
}

/**
 * Financial disclosure
 */
export interface FinancialDisclosure {
  readonly id: DisclosureId;
  readonly entityId: EntityId;
  readonly fiscalYear: number;
  readonly disclosureType: string;
  readonly title: string;
  readonly content: string;
  readonly gasb: GASBStatement[];
  readonly required: boolean;
  readonly createdAt: Date;
  readonly metadata: Record<string, unknown>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Fund model for Sequelize ORM
 */
@Table({ tableName: 'government_funds', timestamps: true })
export class GovernmentFundModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  entityId!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  fundNumber!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(FundType)),
    allowNull: false,
  })
  type!: FundType;

  @Column({
    type: DataType.ENUM(...Object.values(FundCategory)),
    allowNull: false,
  })
  category!: FundCategory;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata!: Record<string, unknown>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => AccountModel)
  accounts!: AccountModel[];

  @HasMany(() => TransactionModel)
  transactions!: TransactionModel[];
}

/**
 * Account model for Sequelize ORM
 */
@Table({ tableName: 'government_accounts', timestamps: true })
export class AccountModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => GovernmentFundModel)
  @Column({ type: DataType.UUID, allowNull: false })
  fundId!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  accountNumber!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(AccountClassification)),
    allowNull: false,
  })
  classification!: AccountClassification;

  @Column({
    type: DataType.ENUM('debit', 'credit'),
    allowNull: false,
  })
  normalBalance!: 'debit' | 'credit';

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.UUID, allowNull: true })
  parentAccountId?: string;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata!: Record<string, unknown>;

  @BelongsTo(() => GovernmentFundModel)
  fund!: GovernmentFundModel;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Transaction model for Sequelize ORM
 */
@Table({ tableName: 'government_transactions', timestamps: true })
export class TransactionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => GovernmentFundModel)
  @Column({ type: DataType.UUID, allowNull: false })
  fundId!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  transactionDate!: Date;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  journalEntries!: JournalEntry[];

  @Column({ type: DataType.STRING, allowNull: true })
  referenceNumber?: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  fiscalYear!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  fiscalPeriod!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  postedBy!: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  postedAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isReversed!: boolean;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata!: Record<string, unknown>;

  @BelongsTo(() => GovernmentFundModel)
  fund!: GovernmentFundModel;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Financial report model for Sequelize ORM
 */
@Table({ tableName: 'financial_reports', timestamps: true })
export class FinancialReportModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  entityId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(FinancialStatementType)),
    allowNull: false,
  })
  statementType!: FinancialStatementType;

  @Column({ type: DataType.INTEGER, allowNull: false })
  fiscalYear!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  reportDate!: Date;

  @Column({ type: DataType.JSONB, allowNull: false })
  data!: Record<string, unknown>;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata!: Record<string, unknown>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Financial disclosure model for Sequelize ORM
 */
@Table({ tableName: 'financial_disclosures', timestamps: true })
export class FinancialDisclosureModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  entityId!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  fiscalYear!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  disclosureType!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  gasb!: GASBStatement[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  required!: boolean;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata!: Record<string, unknown>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// SWAGGER/OPENAPI DTOs
// ============================================================================

/**
 * Fund creation DTO for Swagger
 */
export class CreateFundDto {
  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  fundNumber!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: FundType })
  type!: FundType;

  @ApiProperty({ enum: FundCategory })
  category!: FundCategory;

  @ApiProperty()
  description!: string;
}

/**
 * Account creation DTO for Swagger
 */
export class CreateAccountDto {
  @ApiProperty()
  fundId!: string;

  @ApiProperty()
  accountNumber!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: AccountClassification })
  classification!: AccountClassification;

  @ApiProperty({ enum: ['debit', 'credit'] })
  normalBalance!: 'debit' | 'credit';

  @ApiProperty({ required: false })
  parentAccountId?: string;
}

/**
 * Transaction creation DTO for Swagger
 */
export class CreateTransactionDto {
  @ApiProperty()
  fundId!: string;

  @ApiProperty()
  transactionDate!: Date;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: [Object] })
  journalEntries!: JournalEntry[];

  @ApiProperty({ required: false })
  referenceNumber?: string;

  @ApiProperty()
  fiscalYear!: number;

  @ApiProperty()
  fiscalPeriod!: number;
}

/**
 * CAFR generation DTO for Swagger
 */
export class GenerateCAFRDto {
  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  fiscalYear!: number;

  @ApiProperty()
  transmittalLetter!: string;

  @ApiProperty({ type: [Object] })
  principalOfficials!: PrincipalOfficial[];
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * @function createReportId
 * @description Generates a unique report ID
 * @returns {ReportId} Unique report ID
 *
 * @example
 * ```typescript
 * const reportId = createReportId();
 * ```
 */
export const createReportId = (): ReportId => {
  return `rpt_${crypto.randomUUID()}` as ReportId;
};

/**
 * @function createFundId
 * @description Generates a unique fund ID
 * @returns {FundId} Unique fund ID
 *
 * @example
 * ```typescript
 * const fundId = createFundId();
 * ```
 */
export const createFundId = (): FundId => {
  return `fund_${crypto.randomUUID()}` as FundId;
};

/**
 * @function createAccountId
 * @description Generates a unique account ID
 * @returns {AccountId} Unique account ID
 *
 * @example
 * ```typescript
 * const accountId = createAccountId();
 * ```
 */
export const createAccountId = (): AccountId => {
  return `acct_${crypto.randomUUID()}` as AccountId;
};

/**
 * @function createTransactionId
 * @description Generates a unique transaction ID
 * @returns {TransactionId} Unique transaction ID
 *
 * @example
 * ```typescript
 * const transactionId = createTransactionId();
 * ```
 */
export const createTransactionId = (): TransactionId => {
  return `txn_${crypto.randomUUID()}` as TransactionId;
};

/**
 * @function createDisclosureId
 * @description Generates a unique disclosure ID
 * @returns {DisclosureId} Unique disclosure ID
 *
 * @example
 * ```typescript
 * const disclosureId = createDisclosureId();
 * ```
 */
export const createDisclosureId = (): DisclosureId => {
  return `disc_${crypto.randomUUID()}` as DisclosureId;
};

// ============================================================================
// FUND MANAGEMENT
// ============================================================================

/**
 * @function createFund
 * @description Creates a new government fund
 * @param {string} entityId - Entity ID
 * @param {string} fundNumber - Fund number
 * @param {string} name - Fund name
 * @param {FundType} type - Fund type
 * @param {FundCategory} category - Fund category
 * @param {string} description - Fund description
 * @returns {GovernmentFund} Created fund
 *
 * @example
 * ```typescript
 * const fund = createFund(
 *   entityId,
 *   '001',
 *   'General Fund',
 *   FundType.GENERAL,
 *   FundCategory.GOVERNMENTAL,
 *   'Primary operating fund'
 * );
 * ```
 */
export const createFund = (
  entityId: EntityId,
  fundNumber: string,
  name: string,
  type: FundType,
  category: FundCategory,
  description: string,
): GovernmentFund => {
  return {
    id: createFundId(),
    entityId,
    fundNumber,
    name,
    type,
    category,
    description,
    isActive: true,
    createdAt: new Date(),
    metadata: {},
  };
};

/**
 * @function categorizeFund
 * @description Categorizes fund based on type
 * @param {FundType} fundType - Fund type
 * @returns {FundCategory} Fund category
 *
 * @example
 * ```typescript
 * const category = categorizeFund(FundType.GENERAL);
 * // Returns FundCategory.GOVERNMENTAL
 * ```
 */
export const categorizeFund = (fundType: FundType): FundCategory => {
  const governmentalFunds = [
    FundType.GENERAL,
    FundType.SPECIAL_REVENUE,
    FundType.CAPITAL_PROJECTS,
    FundType.DEBT_SERVICE,
    FundType.PERMANENT,
  ];

  const proprietaryFunds = [
    FundType.ENTERPRISE,
    FundType.INTERNAL_SERVICE,
  ];

  if (governmentalFunds.includes(fundType)) {
    return FundCategory.GOVERNMENTAL;
  } else if (proprietaryFunds.includes(fundType)) {
    return FundCategory.PROPRIETARY;
  }

  return FundCategory.FIDUCIARY;
};

// ============================================================================
// CHART OF ACCOUNTS
// ============================================================================

/**
 * @function createAccount
 * @description Creates a new chart of accounts entry
 * @param {FundId} fundId - Fund ID
 * @param {string} accountNumber - Account number
 * @param {string} name - Account name
 * @param {AccountClassification} classification - Account classification
 * @param {string} normalBalance - Normal balance (debit/credit)
 * @returns {Account} Created account
 *
 * @example
 * ```typescript
 * const account = createAccount(
 *   fundId,
 *   '1010',
 *   'Cash',
 *   AccountClassification.ASSET,
 *   'debit'
 * );
 * ```
 */
export const createAccount = (
  fundId: FundId,
  accountNumber: string,
  name: string,
  classification: AccountClassification,
  normalBalance: 'debit' | 'credit',
): Account => {
  return {
    id: createAccountId(),
    fundId,
    accountNumber,
    name,
    classification,
    normalBalance,
    isActive: true,
    metadata: {},
  };
};

/**
 * @function determineNormalBalance
 * @description Determines normal balance for account classification
 * @param {AccountClassification} classification - Account classification
 * @returns {string} Normal balance (debit or credit)
 *
 * @example
 * ```typescript
 * const normalBalance = determineNormalBalance(AccountClassification.ASSET);
 * // Returns 'debit'
 * ```
 */
export const determineNormalBalance = (
  classification: AccountClassification,
): 'debit' | 'credit' => {
  const debitAccounts = [
    AccountClassification.ASSET,
    AccountClassification.EXPENSE,
    AccountClassification.EXPENDITURE,
    AccountClassification.OTHER_FINANCING_USE,
    AccountClassification.DEFERRED_OUTFLOW,
  ];

  return debitAccounts.includes(classification) ? 'debit' : 'credit';
};

// ============================================================================
// JOURNAL ENTRIES AND TRANSACTIONS
// ============================================================================

/**
 * @function createTransaction
 * @description Creates a financial transaction with journal entries
 * @param {FundId} fundId - Fund ID
 * @param {Date} transactionDate - Transaction date
 * @param {string} description - Description
 * @param {JournalEntry[]} journalEntries - Journal entries
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} postedBy - Posted by user
 * @returns {FinancialTransaction} Created transaction
 *
 * @example
 * ```typescript
 * const transaction = createTransaction(
 *   fundId,
 *   new Date(),
 *   'Property tax revenue',
 *   journalEntries,
 *   2024,
 *   1,
 *   'admin@gov.org'
 * );
 * ```
 */
export const createTransaction = (
  fundId: FundId,
  transactionDate: Date,
  description: string,
  journalEntries: JournalEntry[],
  fiscalYear: number,
  fiscalPeriod: number,
  postedBy: string,
): FinancialTransaction => {
  return {
    id: createTransactionId(),
    fundId,
    transactionDate,
    description,
    journalEntries,
    fiscalYear,
    fiscalPeriod,
    postedBy,
    postedAt: new Date(),
    isReversed: false,
    metadata: {},
  };
};

/**
 * @function validateJournalEntries
 * @description Validates that journal entries are balanced
 * @param {JournalEntry[]} entries - Journal entries to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateJournalEntries(journalEntries);
 * if (!validation.isBalanced) {
 *   console.error('Entries not balanced');
 * }
 * ```
 */
export const validateJournalEntries = (
  entries: JournalEntry[],
): { isBalanced: boolean; totalDebit: number; totalCredit: number; difference: number } => {
  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const difference = Math.abs(totalDebit - totalCredit);

  return {
    isBalanced: difference < 0.01, // Allow for rounding errors
    totalDebit,
    totalCredit,
    difference,
  };
};

/**
 * @function reverseTransaction
 * @description Creates reversing journal entries
 * @param {FinancialTransaction} transaction - Transaction to reverse
 * @param {Date} reversalDate - Reversal date
 * @param {string} postedBy - Posted by user
 * @returns {FinancialTransaction} Reversing transaction
 *
 * @example
 * ```typescript
 * const reversal = reverseTransaction(transaction, new Date(), 'admin@gov.org');
 * ```
 */
export const reverseTransaction = (
  transaction: FinancialTransaction,
  reversalDate: Date,
  postedBy: string,
): FinancialTransaction => {
  const reversedEntries = transaction.journalEntries.map(entry => ({
    ...entry,
    debit: entry.credit,
    credit: entry.debit,
  }));

  return {
    id: createTransactionId(),
    fundId: transaction.fundId,
    transactionDate: reversalDate,
    description: `REVERSAL: ${transaction.description}`,
    journalEntries: reversedEntries,
    fiscalYear: transaction.fiscalYear,
    fiscalPeriod: transaction.fiscalPeriod,
    postedBy,
    postedAt: new Date(),
    isReversed: false,
    metadata: {
      reversalOf: transaction.id,
    },
  };
};

// ============================================================================
// GOVERNMENT-WIDE STATEMENTS
// ============================================================================

/**
 * @function createStatementOfNetPosition
 * @description Creates government-wide statement of net position
 * @param {EntityId} entityId - Entity ID
 * @param {Date} asOfDate - Statement date
 * @param {number} fiscalYear - Fiscal year
 * @param {NetPositionData} governmental - Governmental activities data
 * @param {NetPositionData} businessType - Business-type activities data
 * @returns {StatementOfNetPosition} Statement of net position
 *
 * @example
 * ```typescript
 * const statement = createStatementOfNetPosition(
 *   entityId,
 *   new Date('2024-06-30'),
 *   2024,
 *   governmentalData,
 *   businessTypeData
 * );
 * ```
 */
export const createStatementOfNetPosition = (
  entityId: EntityId,
  asOfDate: Date,
  fiscalYear: number,
  governmental: NetPositionData,
  businessType: NetPositionData,
): StatementOfNetPosition => {
  const total: NetPositionData = {
    assets: {
      currentAssets: governmental.assets.currentAssets + businessType.assets.currentAssets,
      capitalAssets: governmental.assets.capitalAssets + businessType.assets.capitalAssets,
      otherAssets: governmental.assets.otherAssets + businessType.assets.otherAssets,
      totalAssets: governmental.assets.totalAssets + businessType.assets.totalAssets,
    },
    deferredOutflows: governmental.deferredOutflows + businessType.deferredOutflows,
    liabilities: {
      currentLiabilities: governmental.liabilities.currentLiabilities + businessType.liabilities.currentLiabilities,
      longTermLiabilities: governmental.liabilities.longTermLiabilities + businessType.liabilities.longTermLiabilities,
      totalLiabilities: governmental.liabilities.totalLiabilities + businessType.liabilities.totalLiabilities,
    },
    deferredInflows: governmental.deferredInflows + businessType.deferredInflows,
    netPosition: {
      netInvestmentInCapitalAssets: governmental.netPosition.netInvestmentInCapitalAssets + businessType.netPosition.netInvestmentInCapitalAssets,
      restricted: governmental.netPosition.restricted + businessType.netPosition.restricted,
      unrestricted: governmental.netPosition.unrestricted + businessType.netPosition.unrestricted,
      totalNetPosition: governmental.netPosition.totalNetPosition + businessType.netPosition.totalNetPosition,
    },
  };

  return {
    reportId: createReportId(),
    entityId,
    asOfDate,
    fiscalYear,
    governmental,
    businessType,
    total,
    metadata: {},
  };
};

/**
 * @function createStatementOfActivities
 * @description Creates government-wide statement of activities
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {FunctionActivity[]} functions - Function activities
 * @param {GeneralRevenue[]} generalRevenues - General revenues
 * @returns {StatementOfActivities} Statement of activities
 *
 * @example
 * ```typescript
 * const statement = createStatementOfActivities(
 *   entityId,
 *   2024,
 *   functionActivities,
 *   generalRevenues
 * );
 * ```
 */
export const createStatementOfActivities = (
  entityId: EntityId,
  fiscalYear: number,
  functions: FunctionActivity[],
  generalRevenues: GeneralRevenue[],
): StatementOfActivities => {
  const totalNetExpenseRevenue: NetExpenseRevenue = functions.reduce(
    (sum, func) => ({
      governmental: sum.governmental + func.netExpenseRevenue.governmental,
      businessType: sum.businessType + func.netExpenseRevenue.businessType,
      total: sum.total + func.netExpenseRevenue.total,
    }),
    { governmental: 0, businessType: 0, total: 0 }
  );

  const totalGeneralRevenues: GeneralRevenue = generalRevenues.reduce(
    (sum, rev) => ({
      description: 'Total',
      governmental: sum.governmental + rev.governmental,
      businessType: sum.businessType + rev.businessType,
      total: sum.total + rev.total,
    }),
    { description: 'Total', governmental: 0, businessType: 0, total: 0 }
  );

  const changeInNetPosition: ChangeInNetPosition = {
    governmental: totalNetExpenseRevenue.governmental + totalGeneralRevenues.governmental,
    businessType: totalNetExpenseRevenue.businessType + totalGeneralRevenues.businessType,
    total: totalNetExpenseRevenue.total + totalGeneralRevenues.total,
  };

  return {
    reportId: createReportId(),
    entityId,
    fiscalYear,
    functions,
    generalRevenues,
    changeInNetPosition,
    metadata: {},
  };
};

// ============================================================================
// FUND FINANCIAL STATEMENTS
// ============================================================================

/**
 * @function createFundBalanceSheet
 * @description Creates fund balance sheet
 * @param {FundId} fundId - Fund ID
 * @param {Date} asOfDate - Statement date
 * @param {number} fiscalYear - Fiscal year
 * @param {FundAssets} assets - Fund assets
 * @param {FundLiabilities} liabilities - Fund liabilities
 * @param {FundBalance} fundBalance - Fund balance
 * @returns {FundBalanceSheet} Fund balance sheet
 *
 * @example
 * ```typescript
 * const balanceSheet = createFundBalanceSheet(
 *   fundId,
 *   new Date('2024-06-30'),
 *   2024,
 *   assets,
 *   liabilities,
 *   fundBalance
 * );
 * ```
 */
export const createFundBalanceSheet = (
  fundId: FundId,
  asOfDate: Date,
  fiscalYear: number,
  assets: FundAssets,
  liabilities: FundLiabilities,
  fundBalance: FundBalance,
): FundBalanceSheet => {
  return {
    reportId: createReportId(),
    fundId,
    asOfDate,
    fiscalYear,
    assets,
    liabilities,
    deferredInflows: 0,
    fundBalance,
    metadata: {},
  };
};

/**
 * @function classifyFundBalance
 * @description Classifies fund balance per GASB 54
 * @param {number} totalFundBalance - Total fund balance
 * @param {object} constraints - Fund balance constraints
 * @returns {FundBalance} Classified fund balance
 *
 * @example
 * ```typescript
 * const classified = classifyFundBalance(1000000, {
 *   nonspendable: 50000,
 *   restricted: 200000,
 *   committed: 150000,
 *   assigned: 100000
 * });
 * ```
 */
export const classifyFundBalance = (
  totalFundBalance: number,
  constraints: {
    nonspendable?: number;
    restricted?: number;
    committed?: number;
    assigned?: number;
  },
): FundBalance => {
  const nonspendable = constraints.nonspendable || 0;
  const restricted = constraints.restricted || 0;
  const committed = constraints.committed || 0;
  const assigned = constraints.assigned || 0;
  const unassigned = totalFundBalance - nonspendable - restricted - committed - assigned;

  return {
    nonspendable,
    restricted,
    committed,
    assigned,
    unassigned,
    total: totalFundBalance,
  };
};

/**
 * @function createStatementOfRevenuesExpenditures
 * @description Creates statement of revenues, expenditures, and changes in fund balance
 * @param {FundId} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {RevenueCategory[]} revenues - Revenue categories
 * @param {ExpenditureCategory[]} expenditures - Expenditure categories
 * @param {number} fundBalanceBeginning - Beginning fund balance
 * @returns {StatementOfRevenuesExpenditures} Statement
 *
 * @example
 * ```typescript
 * const statement = createStatementOfRevenuesExpenditures(
 *   fundId,
 *   2024,
 *   revenues,
 *   expenditures,
 *   1000000
 * );
 * ```
 */
export const createStatementOfRevenuesExpenditures = (
  fundId: FundId,
  fiscalYear: number,
  revenues: RevenueCategory[],
  expenditures: ExpenditureCategory[],
  fundBalanceBeginning: number,
): StatementOfRevenuesExpenditures => {
  const totalRevenues = revenues.reduce((sum, r) => sum + r.actual, 0);
  const totalExpenditures = expenditures.reduce((sum, e) => sum + e.actual, 0);
  const excessDeficiency = totalRevenues - totalExpenditures;

  return {
    reportId: createReportId(),
    fundId,
    fiscalYear,
    revenues,
    totalRevenues,
    expenditures,
    totalExpenditures,
    excessDeficiency,
    otherFinancingSources: [],
    otherFinancingUses: [],
    netOtherFinancing: 0,
    changeInFundBalance: excessDeficiency,
    fundBalanceBeginning,
    fundBalanceEnding: fundBalanceBeginning + excessDeficiency,
    metadata: {},
  };
};

/**
 * @function calculateBudgetVariance
 * @description Calculates budget variance
 * @param {number} budgeted - Budgeted amount
 * @param {number} actual - Actual amount
 * @returns {object} Variance data
 *
 * @example
 * ```typescript
 * const variance = calculateBudgetVariance(100000, 95000);
 * // Returns { variance: 5000, variancePercent: 5, favorable: true }
 * ```
 */
export const calculateBudgetVariance = (
  budgeted: number,
  actual: number,
): { variance: number; variancePercent: number; favorable: boolean } => {
  const variance = budgeted - actual;
  const variancePercent = budgeted !== 0 ? (variance / budgeted) * 100 : 0;
  const favorable = variance >= 0;

  return {
    variance,
    variancePercent,
    favorable,
  };
};

// ============================================================================
// RECONCILIATION STATEMENTS
// ============================================================================

/**
 * @function createReconciliation
 * @description Creates reconciliation from fund to government-wide
 * @param {string} reconciliationType - Type of reconciliation
 * @param {number} fundBalance - Fund balance or change
 * @param {ReconciliationAdjustment[]} adjustments - Reconciliation adjustments
 * @returns {ReconciliationStatement} Reconciliation statement
 *
 * @example
 * ```typescript
 * const reconciliation = createReconciliation(
 *   'Fund Balance to Net Position',
 *   5000000,
 *   adjustments
 * );
 * ```
 */
export const createReconciliation = (
  reconciliationType: string,
  fundBalance: number,
  adjustments: ReconciliationAdjustment[],
): ReconciliationStatement => {
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const netPosition = fundBalance + totalAdjustments;

  return {
    reconciliationType,
    fundBalance,
    adjustments,
    netPosition,
  };
};

/**
 * @function addReconciliationAdjustment
 * @description Adds capital assets adjustment to reconciliation
 * @param {string} description - Adjustment description
 * @param {number} amount - Adjustment amount
 * @param {string} explanation - Detailed explanation
 * @returns {ReconciliationAdjustment} Reconciliation adjustment
 *
 * @example
 * ```typescript
 * const adjustment = addReconciliationAdjustment(
 *   'Capital assets used in governmental activities',
 *   10000000,
 *   'Capital assets are not financial resources...'
 * );
 * ```
 */
export const addReconciliationAdjustment = (
  description: string,
  amount: number,
  explanation: string,
): ReconciliationAdjustment => {
  return {
    description,
    amount,
    explanation,
  };
};

// ============================================================================
// CAFR GENERATION
// ============================================================================

/**
 * @function createCAFR
 * @description Creates Comprehensive Annual Financial Report
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {IntroductorySection} introductorySection - Introductory section
 * @param {FinancialSection} financialSection - Financial section
 * @param {StatisticalSection} statisticalSection - Statistical section
 * @returns {CAFR} CAFR report
 *
 * @example
 * ```typescript
 * const cafr = createCAFR(
 *   entityId,
 *   2024,
 *   introductorySection,
 *   financialSection,
 *   statisticalSection
 * );
 * ```
 */
export const createCAFR = (
  entityId: EntityId,
  fiscalYear: number,
  introductorySection: IntroductorySection,
  financialSection: FinancialSection,
  statisticalSection: StatisticalSection,
): CAFR => {
  return {
    reportId: createReportId(),
    entityId,
    fiscalYear,
    reportDate: new Date(),
    introductorySection,
    financialSection,
    statisticalSection,
    metadata: {},
  };
};

/**
 * @function createIntroductorySection
 * @description Creates CAFR introductory section
 * @param {string} transmittalLetter - Transmittal letter content
 * @param {PrincipalOfficial[]} principalOfficials - Principal officials
 * @returns {IntroductorySection} Introductory section
 *
 * @example
 * ```typescript
 * const intro = createIntroductorySection(letter, officials);
 * ```
 */
export const createIntroductorySection = (
  transmittalLetter: string,
  principalOfficials: PrincipalOfficial[],
): IntroductorySection => {
  return {
    transmittalLetter,
    principalOfficials,
  };
};

/**
 * @function createFinancialSection
 * @description Creates CAFR financial section
 * @param {AuditorsReport} auditorsReport - Independent auditors report
 * @param {string} mda - Management discussion and analysis
 * @param {BasicFinancialStatements} basicStatements - Basic financial statements
 * @param {Note[]} notes - Notes to financial statements
 * @returns {FinancialSection} Financial section
 *
 * @example
 * ```typescript
 * const financial = createFinancialSection(audit, mda, statements, notes);
 * ```
 */
export const createFinancialSection = (
  auditorsReport: AuditorsReport,
  mda: string,
  basicStatements: BasicFinancialStatements,
  notes: Note[],
): FinancialSection => {
  return {
    independentAuditorsReport: auditorsReport,
    managementDiscussionAnalysis: mda,
    basicFinancialStatements: basicStatements,
    requiredSupplementaryInformation: [],
    notesToFinancialStatements: notes,
  };
};

// ============================================================================
// NOTES TO FINANCIAL STATEMENTS
// ============================================================================

/**
 * @function createNote
 * @description Creates note to financial statements
 * @param {string} noteNumber - Note number
 * @param {string} title - Note title
 * @param {string} content - Note content
 * @param {GASBStatement[]} gasb - Applicable GASB statements
 * @returns {Note} Financial statement note
 *
 * @example
 * ```typescript
 * const note = createNote(
 *   'I',
 *   'Summary of Significant Accounting Policies',
 *   content,
 *   [GASBStatement.GASB_34]
 * );
 * ```
 */
export const createNote = (
  noteNumber: string,
  title: string,
  content: string,
  gasb: GASBStatement[],
): Note => {
  return {
    noteNumber,
    title,
    content,
    subsections: [],
    gasb,
  };
};

/**
 * @function addNoteSubsection
 * @description Adds subsection to note
 * @param {Note} note - Note to update
 * @param {string} letter - Subsection letter
 * @param {string} title - Subsection title
 * @param {string} content - Subsection content
 * @returns {Note} Updated note
 *
 * @example
 * ```typescript
 * const updated = addNoteSubsection(note, 'A', 'Reporting Entity', content);
 * ```
 */
export const addNoteSubsection = (
  note: Note,
  letter: string,
  title: string,
  content: string,
): Note => {
  return {
    ...note,
    subsections: [
      ...(note.subsections || []),
      { letter, title, content },
    ],
  };
};

/**
 * @function generateRequiredNotes
 * @description Generates list of required notes per GASB
 * @returns {object[]} Required notes list
 *
 * @example
 * ```typescript
 * const required = generateRequiredNotes();
 * ```
 */
export const generateRequiredNotes = (): Array<{
  noteNumber: string;
  title: string;
  gasb: GASBStatement[];
}> => {
  return [
    { noteNumber: 'I', title: 'Summary of Significant Accounting Policies', gasb: [GASBStatement.GASB_34] },
    { noteNumber: 'II', title: 'Reconciliation of Government-wide and Fund Financial Statements', gasb: [GASBStatement.GASB_34] },
    { noteNumber: 'III', title: 'Detailed Notes on All Funds', gasb: [GASBStatement.GASB_34] },
    { noteNumber: 'IV', title: 'Capital Assets', gasb: [GASBStatement.GASB_34] },
    { noteNumber: 'V', title: 'Long-term Debt', gasb: [GASBStatement.GASB_34] },
    { noteNumber: 'VI', title: 'Fund Balances', gasb: [GASBStatement.GASB_54] },
    { noteNumber: 'VII', title: 'Pension Plans', gasb: [GASBStatement.GASB_68] },
    { noteNumber: 'VIII', title: 'Other Post-Employment Benefits', gasb: [GASBStatement.GASB_75] },
    { noteNumber: 'IX', title: 'Leases', gasb: [GASBStatement.GASB_87] },
    { noteNumber: 'X', title: 'Risk Management', gasb: [GASBStatement.GASB_34] },
  ];
};

// ============================================================================
// REQUIRED SUPPLEMENTARY INFORMATION
// ============================================================================

/**
 * @function createBudgetComparison
 * @description Creates budget comparison schedule
 * @param {FundId} fundId - Fund ID
 * @param {RevenueCategory[]} revenues - Revenue data
 * @param {ExpenditureCategory[]} expenditures - Expenditure data
 * @returns {RequiredSupplementaryInfo} Budget comparison RSI
 *
 * @example
 * ```typescript
 * const budgetRSI = createBudgetComparison(fundId, revenues, expenditures);
 * ```
 */
export const createBudgetComparison = (
  fundId: FundId,
  revenues: RevenueCategory[],
  expenditures: ExpenditureCategory[],
): RequiredSupplementaryInfo => {
  return {
    title: 'Budgetary Comparison Schedule',
    type: 'budget_comparison',
    data: {
      fundId,
      revenues,
      expenditures,
    },
  };
};

/**
 * @function createPensionRSI
 * @description Creates pension required supplementary information
 * @param {number} fiscalYear - Fiscal year
 * @param {object} pensionData - Pension data
 * @returns {RequiredSupplementaryInfo} Pension RSI
 *
 * @example
 * ```typescript
 * const pensionRSI = createPensionRSI(2024, pensionData);
 * ```
 */
export const createPensionRSI = (
  fiscalYear: number,
  pensionData: Record<string, unknown>,
): RequiredSupplementaryInfo => {
  return {
    title: 'Schedule of Changes in Net Pension Liability',
    type: 'pension',
    data: {
      fiscalYear,
      ...pensionData,
    },
    notes: 'Required by GASB 68',
  };
};

// ============================================================================
// STATISTICAL SECTION
// ============================================================================

/**
 * @function createFinancialTrendTable
 * @description Creates financial trend table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years (10 years)
 * @param {object} data - Trend data
 * @returns {FinancialTrendTable} Financial trend table
 *
 * @example
 * ```typescript
 * const trends = createFinancialTrendTable(
 *   'Net Position by Component',
 *   [2015, 2016, ...2024],
 *   trendData
 * );
 * ```
 */
export const createFinancialTrendTable = (
  title: string,
  years: number[],
  data: Record<string, number[]>,
): FinancialTrendTable => {
  return {
    title,
    years,
    data,
  };
};

/**
 * @function createRevenueCapacityTable
 * @description Creates revenue capacity table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years
 * @param {object} data - Revenue capacity data
 * @returns {RevenueCapacityTable} Revenue capacity table
 *
 * @example
 * ```typescript
 * const revenue = createRevenueCapacityTable(
 *   'Property Tax Levies and Collections',
 *   years,
 *   data
 * );
 * ```
 */
export const createRevenueCapacityTable = (
  title: string,
  years: number[],
  data: Record<string, number[]>,
): RevenueCapacityTable => {
  return {
    title,
    years,
    data,
  };
};

/**
 * @function createDebtCapacityTable
 * @description Creates debt capacity table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years
 * @param {object} data - Debt capacity data
 * @returns {DebtCapacityTable} Debt capacity table
 *
 * @example
 * ```typescript
 * const debt = createDebtCapacityTable(
 *   'Ratios of Outstanding Debt',
 *   years,
 *   data
 * );
 * ```
 */
export const createDebtCapacityTable = (
  title: string,
  years: number[],
  data: Record<string, number[]>,
): DebtCapacityTable => {
  return {
    title,
    years,
    data,
  };
};

// ============================================================================
// FINANCIAL DISCLOSURES
// ============================================================================

/**
 * @function createFinancialDisclosure
 * @description Creates financial disclosure
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} disclosureType - Disclosure type
 * @param {string} title - Disclosure title
 * @param {string} content - Disclosure content
 * @param {GASBStatement[]} gasb - Applicable GASB statements
 * @returns {FinancialDisclosure} Financial disclosure
 *
 * @example
 * ```typescript
 * const disclosure = createFinancialDisclosure(
 *   entityId,
 *   2024,
 *   'contingent_liabilities',
 *   'Contingent Liabilities',
 *   content,
 *   [GASBStatement.GASB_34]
 * );
 * ```
 */
export const createFinancialDisclosure = (
  entityId: EntityId,
  fiscalYear: number,
  disclosureType: string,
  title: string,
  content: string,
  gasb: GASBStatement[],
): FinancialDisclosure => {
  return {
    id: createDisclosureId(),
    entityId,
    fiscalYear,
    disclosureType,
    title,
    content,
    gasb,
    required: true,
    createdAt: new Date(),
    metadata: {},
  };
};

/**
 * @function validateGASBCompliance
 * @description Validates GASB compliance for report
 * @param {CAFR} cafr - CAFR to validate
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = validateGASBCompliance(cafr);
 * if (!validation.isCompliant) {
 *   console.log(validation.missingRequirements);
 * }
 * ```
 */
export const validateGASBCompliance = (
  cafr: CAFR,
): { isCompliant: boolean; missingRequirements: string[] } => {
  const missingRequirements: string[] = [];

  // Check for required statements
  if (!cafr.financialSection.basicFinancialStatements.governmentWideStatements.statementOfNetPosition) {
    missingRequirements.push('Statement of Net Position');
  }
  if (!cafr.financialSection.basicFinancialStatements.governmentWideStatements.statementOfActivities) {
    missingRequirements.push('Statement of Activities');
  }

  // Check for required notes
  const requiredNotes = generateRequiredNotes();
  const noteNumbers = cafr.financialSection.notesToFinancialStatements.map(n => n.noteNumber);
  for (const req of requiredNotes) {
    if (!noteNumbers.includes(req.noteNumber)) {
      missingRequirements.push(`Note ${req.noteNumber}: ${req.title}`);
    }
  }

  // Check for MD&A
  if (!cafr.financialSection.managementDiscussionAnalysis ||
      cafr.financialSection.managementDiscussionAnalysis.length < 100) {
    missingRequirements.push("Management's Discussion and Analysis");
  }

  return {
    isCompliant: missingRequirements.length === 0,
    missingRequirements,
  };
};

// ============================================================================
// AUDIT REPORT PREPARATION
// ============================================================================

/**
 * @function createAuditorsReport
 * @description Creates independent auditors report
 * @param {string} auditFirm - Audit firm name
 * @param {Date} reportDate - Report date
 * @param {AuditOpinionType} opinionType - Opinion type
 * @param {string} opinionText - Opinion text
 * @returns {AuditorsReport} Auditors report
 *
 * @example
 * ```typescript
 * const audit = createAuditorsReport(
 *   'Smith & Associates CPA',
 *   new Date(),
 *   AuditOpinionType.UNMODIFIED,
 *   opinionText
 * );
 * ```
 */
export const createAuditorsReport = (
  auditFirm: string,
  reportDate: Date,
  opinionType: AuditOpinionType,
  opinionText: string,
): AuditorsReport => {
  return {
    reportId: crypto.randomUUID(),
    auditFirm,
    reportDate,
    opinionType,
    opinionText,
    emphasis: [],
    otherMatters: [],
  };
};

/**
 * @function addEmphasisOfMatter
 * @description Adds emphasis of matter paragraph to audit report
 * @param {AuditorsReport} report - Auditors report
 * @param {string} emphasis - Emphasis text
 * @returns {AuditorsReport} Updated report
 *
 * @example
 * ```typescript
 * const updated = addEmphasisOfMatter(report, 'Implementation of GASB 87');
 * ```
 */
export const addEmphasisOfMatter = (
  report: AuditorsReport,
  emphasis: string,
): AuditorsReport => {
  return {
    ...report,
    emphasis: [...(report.emphasis || []), emphasis],
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * @function calculatePerCapita
 * @description Calculates per capita amount
 * @param {number} totalAmount - Total amount
 * @param {number} population - Population
 * @returns {number} Per capita amount
 *
 * @example
 * ```typescript
 * const perCapita = calculatePerCapita(10000000, 50000);
 * // Returns 200
 * ```
 */
export const calculatePerCapita = (
  totalAmount: number,
  population: number,
): number => {
  return population > 0 ? totalAmount / population : 0;
};

/**
 * @function calculateDebtRatio
 * @description Calculates debt to assets ratio
 * @param {number} totalDebt - Total debt
 * @param {number} totalAssets - Total assets
 * @returns {number} Debt ratio percentage
 *
 * @example
 * ```typescript
 * const ratio = calculateDebtRatio(5000000, 20000000);
 * // Returns 25
 * ```
 */
export const calculateDebtRatio = (
  totalDebt: number,
  totalAssets: number,
): number => {
  return totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
};

/**
 * @function formatFinancialAmount
 * @description Formats financial amount for display
 * @param {number} amount - Amount to format
 * @param {boolean} showCents - Show cents (default: false)
 * @returns {string} Formatted amount
 *
 * @example
 * ```typescript
 * const formatted = formatFinancialAmount(1234567.89);
 * // Returns '$1,234,568'
 * ```
 */
export const formatFinancialAmount = (
  amount: number,
  showCents: boolean = false,
): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  };
  return new Intl.NumberFormat('en-US', options).format(amount);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // ID Generation
  createReportId,
  createFundId,
  createAccountId,
  createTransactionId,
  createDisclosureId,

  // Fund Management
  createFund,
  categorizeFund,

  // Chart of Accounts
  createAccount,
  determineNormalBalance,

  // Transactions
  createTransaction,
  validateJournalEntries,
  reverseTransaction,

  // Government-wide Statements
  createStatementOfNetPosition,
  createStatementOfActivities,

  // Fund Statements
  createFundBalanceSheet,
  classifyFundBalance,
  createStatementOfRevenuesExpenditures,
  calculateBudgetVariance,

  // Reconciliations
  createReconciliation,
  addReconciliationAdjustment,

  // CAFR
  createCAFR,
  createIntroductorySection,
  createFinancialSection,

  // Notes
  createNote,
  addNoteSubsection,
  generateRequiredNotes,

  // RSI
  createBudgetComparison,
  createPensionRSI,

  // Statistical
  createFinancialTrendTable,
  createRevenueCapacityTable,
  createDebtCapacityTable,

  // Disclosures
  createFinancialDisclosure,
  validateGASBCompliance,

  // Audit
  createAuditorsReport,
  addEmphasisOfMatter,

  // Utilities
  calculatePerCapita,
  calculateDebtRatio,
  formatFinancialAmount,
};

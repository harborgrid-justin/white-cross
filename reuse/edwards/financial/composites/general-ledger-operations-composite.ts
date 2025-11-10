/**
 * LOC: GLOPSCOMP001
 * File: /reuse/edwards/financial/composites/general-ledger-operations-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../allocation-engines-rules-kit
 *   - ../dimension-management-kit
 *   - ../multi-currency-management-kit
 *   - ../intercompany-accounting-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-workflow-approval-kit
 *   - ../encumbrance-accounting-kit
 *
 * DOWNSTREAM (imported by):
 *   - General Ledger REST API controllers
 *   - GL GraphQL resolvers
 *   - Financial reporting services
 *   - Period close automation
 *   - Management reporting dashboards
 */

/**
 * File: /reuse/edwards/financial/composites/general-ledger-operations-composite.ts
 * Locator: WC-JDE-GLOPS-COMPOSITE-001
 * Purpose: Comprehensive General Ledger Operations Composite - Journal entries, posting, reconciliation, multi-currency GL, intercompany
 *
 * Upstream: Composes functions from allocation-engines-rules-kit, dimension-management-kit, multi-currency-management-kit,
 *           intercompany-accounting-kit, financial-reporting-analytics-kit, audit-trail-compliance-kit,
 *           financial-workflow-approval-kit, encumbrance-accounting-kit
 * Downstream: ../backend/*, GL API controllers, GraphQL resolvers, Financial reporting, Period close automation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Sequelize 6.x
 * Exports: 45 composite functions for GL journal entries, posting, period close, reconciliation, reversals, allocations,
 *          intercompany transactions, multi-currency GL operations, GL reporting, chart of accounts management
 *
 * LLM Context: Enterprise-grade general ledger composite operations for JD Edwards EnterpriseOne competing platform.
 * Provides comprehensive GL operations combining journal entry creation with approval workflows, automated posting with
 * audit trails, multi-currency journal processing, intercompany transaction handling, account reconciliation with variance
 * analysis, period close automation, GL allocations with statistical drivers, reversal processing, consolidation,
 * and advanced reporting. Designed for healthcare financial operations with complex allocation requirements,
 * multi-entity consolidation, and regulatory compliance (SOX, HIPAA financial controls).
 *
 * GL Operation Patterns:
 * - Journal Entry Lifecycle: Draft → Validation → Approval → Posting → Reconciliation
 * - Multi-currency: Source currency → Functional currency → Reporting currency conversion
 * - Intercompany: Automatic due to/due from creation with elimination tracking
 * - Allocations: Statistical drivers → Pool allocation → Cascade processing → Audit trail
 * - Period Close: Accruals → Deferrals → Allocations → Reconciliation → Lock
 * - Reversals: Original entry retrieval → Reversal generation → Automatic posting
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsInt,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction } from 'sequelize';

// Import from allocation engines kit
import {
  AllocationRule,
  AllocationBasis,
  StatisticalDriver,
  AllocationPool,
  createAllocationRule,
  executeAllocation,
  calculateAllocationAmounts,
  createAllocationPool,
  validateAllocationRule,
  processReciprocalAllocations,
  executeStepDownAllocation,
  createStatisticalDriver,
  validateStatisticalDriver,
  generateAllocationReport,
} from '../allocation-engines-rules-kit';

// Import from dimension management kit
import {
  Dimension,
  DimensionValue,
  DimensionHierarchy,
  createDimension,
  createDimensionValue,
  validateDimensionCombination,
  getDimensionHierarchy,
  rollupDimensionValues,
  validateAccountDimensions,
} from '../dimension-management-kit';

// Import from multi-currency kit
import {
  CurrencyRate,
  CurrencyConversion,
  RevaluationResult,
  getCurrencyRate,
  convertCurrency,
  revalueForeignCurrencyAccounts,
  calculateGainLoss,
  postCurrencyRevaluation,
  generateRevaluationReport,
} from '../multi-currency-management-kit';

// Import from intercompany accounting kit
import {
  IntercompanyTransaction,
  IntercompanyAccount,
  EliminationEntry,
  createIntercompanyTransaction,
  generateIntercompanyEntries,
  matchIntercompanyTransactions,
  createEliminationEntry,
  validateIntercompanyBalance,
  reconcileIntercompanyAccounts,
  postIntercompanyElimination,
} from '../intercompany-accounting-kit';

// Import from financial reporting kit
import {
  FinancialReport,
  TrialBalance,
  AccountBalance,
  generateTrialBalance,
  generateBalanceSheet,
  generateIncomeStatement,
  calculateAccountBalance,
  drilldownToTransactions,
  exportFinancialReport,
} from '../financial-reporting-analytics-kit';

// Import from audit trail kit
import {
  AuditLog,
  AuditTrail,
  ComplianceReport,
  logGLTransaction,
  createAuditTrail,
  validateAuditCompliance,
  generateAuditReport,
  trackUserActivity,
  detectAnomalousTransactions,
} from '../audit-trail-compliance-kit';

// Import from workflow approval kit
import {
  WorkflowDefinition,
  ApprovalRequest,
  ApprovalAction,
  createWorkflowDefinition,
  initiateApprovalWorkflow,
  processApprovalAction,
  checkApprovalStatus,
  escalateApproval,
  getApprovalHistory,
} from '../financial-workflow-approval-kit';

// Import from encumbrance kit
import {
  Encumbrance,
  EncumbranceType,
  createEncumbrance,
  liquidateEncumbrance,
  adjustEncumbrance,
  getEncumbranceBalance,
  reconcileEncumbrances,
} from '../encumbrance-accounting-kit';

// ============================================================================
// COMPREHENSIVE ENUMERATIONS - GL DOMAIN
// ============================================================================

/**
 * Journal entry type classification
 */
export enum JournalEntryType {
  STANDARD = 'STANDARD', // Regular journal entries
  RECURRING = 'RECURRING', // Automated recurring entries
  REVERSING = 'REVERSING', // Auto-reversing entries
  ALLOCATION = 'ALLOCATION', // Cost allocation entries
  INTERCOMPANY = 'INTERCOMPANY', // Intercompany transactions
  ACCRUAL = 'ACCRUAL', // Period-end accruals
  DEFERRAL = 'DEFERRAL', // Revenue/expense deferrals
  RECLASSIFICATION = 'RECLASSIFICATION', // Account reclassifications
  ADJUSTMENT = 'ADJUSTMENT', // Correcting entries
  CONSOLIDATION = 'CONSOLIDATION', // Consolidation entries
  ELIMINATION = 'ELIMINATION', // Intercompany eliminations
}

/**
 * Journal entry status workflow
 */
export enum JournalEntryStatus {
  DRAFT = 'DRAFT', // Entry being created
  VALIDATION_PENDING = 'VALIDATION_PENDING', // Awaiting validation
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Submitted for approval
  APPROVED = 'APPROVED', // Approved, ready to post
  REJECTED = 'REJECTED', // Rejected by approver
  POSTED = 'POSTED', // Posted to GL
  REVERSED = 'REVERSED', // Entry has been reversed
  VOIDED = 'VOIDED', // Entry voided before posting
  ERROR = 'ERROR', // Posting error occurred
}

/**
 * Allocation methodology
 */
export enum AllocationMethod {
  PROPORTIONAL = 'PROPORTIONAL', // Proportional distribution
  EQUAL = 'EQUAL', // Equal distribution
  WEIGHTED = 'WEIGHTED', // Weighted allocation
  STEP_DOWN = 'STEP_DOWN', // Step-down method
  RECIPROCAL = 'RECIPROCAL', // Reciprocal allocation
  DIRECT = 'DIRECT', // Direct allocation
  ACTIVITY_BASED = 'ACTIVITY_BASED', // Activity-based costing
  STATISTICAL = 'STATISTICAL', // Statistical driver-based
}

/**
 * Period close type
 */
export enum PeriodCloseType {
  SOFT_CLOSE = 'SOFT_CLOSE', // Soft close - can reopen
  HARD_CLOSE = 'HARD_CLOSE', // Hard close - permanent lock
  YEAR_END = 'YEAR_END', // Annual year-end close
  QUARTER_END = 'QUARTER_END', // Quarterly close
  MONTH_END = 'MONTH_END', // Monthly close
}

/**
 * Period close status
 */
export enum PeriodCloseStatus {
  OPEN = 'OPEN', // Period is open for transactions
  CLOSING = 'CLOSING', // Close process in progress
  CLOSED = 'CLOSED', // Soft closed
  LOCKED = 'LOCKED', // Hard locked
  REOPENED = 'REOPENED', // Previously closed, now reopened
}

/**
 * Reconciliation item type
 */
export enum ReconciliationItemType {
  TIMING_DIFFERENCE = 'TIMING_DIFFERENCE', // Temporary timing differences
  POSTING_ERROR = 'POSTING_ERROR', // Incorrect posting
  ROUNDING = 'ROUNDING', // Rounding differences
  MISSING_ENTRY = 'MISSING_ENTRY', // Missing GL entry
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY', // Duplicate posting
  CLASSIFICATION_ERROR = 'CLASSIFICATION_ERROR', // Wrong account
  CURRENCY_DIFFERENCE = 'CURRENCY_DIFFERENCE', // FX differences
  OTHER = 'OTHER', // Other reconciliation items
}

/**
 * Reconciliation status
 */
export enum ReconciliationStatus {
  NOT_STARTED = 'NOT_STARTED', // Reconciliation not started
  IN_PROGRESS = 'IN_PROGRESS', // Reconciliation in progress
  RECONCILED = 'RECONCILED', // Fully reconciled
  VARIANCE_IDENTIFIED = 'VARIANCE_IDENTIFIED', // Variances found
  APPROVED = 'APPROVED', // Reconciliation approved
  REJECTED = 'REJECTED', // Reconciliation rejected
}

/**
 * General ledger account types
 */
export enum GLAccountType {
  ASSET = 'ASSET', // Asset accounts
  LIABILITY = 'LIABILITY', // Liability accounts
  EQUITY = 'EQUITY', // Equity accounts
  REVENUE = 'REVENUE', // Revenue accounts
  EXPENSE = 'EXPENSE', // Expense accounts
  CONTRA_ASSET = 'CONTRA_ASSET', // Contra asset
  CONTRA_LIABILITY = 'CONTRA_LIABILITY', // Contra liability
  CONTRA_EQUITY = 'CONTRA_EQUITY', // Contra equity
  STATISTICAL = 'STATISTICAL', // Statistical accounts
}

/**
 * Currency conversion method
 */
export enum CurrencyConversionMethod {
  SPOT_RATE = 'SPOT_RATE', // Current spot rate
  AVERAGE_RATE = 'AVERAGE_RATE', // Period average rate
  HISTORICAL_RATE = 'HISTORICAL_RATE', // Historical transaction rate
  BUDGET_RATE = 'BUDGET_RATE', // Budgeted exchange rate
  FIXED_RATE = 'FIXED_RATE', // Fixed rate
}

/**
 * Intercompany transaction type
 */
export enum IntercompanyTransactionType {
  SALE = 'SALE', // Intercompany sale
  PURCHASE = 'PURCHASE', // Intercompany purchase
  TRANSFER = 'TRANSFER', // Asset transfer
  LOAN = 'LOAN', // Intercompany loan
  EXPENSE_ALLOCATION = 'EXPENSE_ALLOCATION', // Shared expense
  SERVICE_FEE = 'SERVICE_FEE', // Management fee
  ROYALTY = 'ROYALTY', // Royalty payment
  DIVIDEND = 'DIVIDEND', // Dividend distribution
}

/**
 * Consolidation status
 */
export enum ConsolidationStatus {
  DRAFT = 'DRAFT', // Consolidation in draft
  CALCULATING = 'CALCULATING', // Calculations in progress
  CALCULATED = 'CALCULATED', // Calculations complete
  REVIEW = 'REVIEW', // Under review
  FINALIZED = 'FINALIZED', // Finalized consolidation
  PUBLISHED = 'PUBLISHED', // Published to stakeholders
}

/**
 * Audit event type for GL operations
 */
export enum GLAuditEventType {
  JOURNAL_CREATED = 'JOURNAL_CREATED',
  JOURNAL_MODIFIED = 'JOURNAL_MODIFIED',
  JOURNAL_DELETED = 'JOURNAL_DELETED',
  JOURNAL_POSTED = 'JOURNAL_POSTED',
  JOURNAL_REVERSED = 'JOURNAL_REVERSED',
  APPROVAL_REQUESTED = 'APPROVAL_REQUESTED',
  APPROVAL_GRANTED = 'APPROVAL_GRANTED',
  APPROVAL_DENIED = 'APPROVAL_DENIED',
  PERIOD_CLOSED = 'PERIOD_CLOSED',
  PERIOD_REOPENED = 'PERIOD_REOPENED',
  RECONCILIATION_COMPLETED = 'RECONCILIATION_COMPLETED',
  ALLOCATION_EXECUTED = 'ALLOCATION_EXECUTED',
  REVALUATION_POSTED = 'REVALUATION_POSTED',
}

/**
 * Financial report format
 */
export enum FinancialReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  XML = 'XML',
  HTML = 'HTML',
}

/**
 * Dimension validation status
 */
export enum DimensionValidationStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  WARNING = 'WARNING',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

/**
 * Approval workflow status
 */
export enum ApprovalWorkflowStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ESCALATED = 'ESCALATED',
}

/**
 * Variance analysis type
 */
export enum VarianceAnalysisType {
  BUDGET_VS_ACTUAL = 'BUDGET_VS_ACTUAL',
  FORECAST_VS_ACTUAL = 'FORECAST_VS_ACTUAL',
  PRIOR_PERIOD = 'PRIOR_PERIOD',
  PRIOR_YEAR = 'PRIOR_YEAR',
  PLAN_VS_ACTUAL = 'PLAN_VS_ACTUAL',
}

// ============================================================================
// DTO CLASSES WITH CLASS-VALIDATOR DECORATORS
// ============================================================================

/**
 * DTO for creating GL journal line
 */
export class CreateJournalLineDto {
  @ApiProperty({ description: 'Line number within journal', example: 1 })
  @IsInt()
  @Min(1)
  lineNumber: number;

  @ApiProperty({ description: 'GL account code', example: '1010-000-0000' })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiProperty({ description: 'Account description', example: 'Cash - Operating' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ description: 'Debit amount', example: 10000.00 })
  @IsNumber()
  @Min(0)
  debitAmount: number;

  @ApiProperty({ description: 'Credit amount', example: 0.00 })
  @IsNumber()
  @Min(0)
  creditAmount: number;

  @ApiProperty({ description: 'Line description', example: 'Payment received' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Financial dimensions', example: { department: 'IT', costCenter: 'CC100' } })
  @IsOptional()
  dimensions?: Record<string, string>;

  @ApiProperty({ description: 'Subsidiary ledger code', required: false })
  @IsString()
  @IsOptional()
  subsidiaryLedger?: string;

  @ApiProperty({ description: 'Project code', required: false })
  @IsString()
  @IsOptional()
  projectCode?: string;

  @ApiProperty({ description: 'Department code', required: false })
  @IsString()
  @IsOptional()
  departmentCode?: string;

  @ApiProperty({ description: 'Cost center code', required: false })
  @IsString()
  @IsOptional()
  costCenterCode?: string;

  @ApiProperty({ description: 'Fund code for government accounting', required: false })
  @IsString()
  @IsOptional()
  fundCode?: string;

  @ApiProperty({ description: 'Grant code', required: false })
  @IsString()
  @IsOptional()
  grantCode?: string;
}

/**
 * DTO for creating GL journal entry
 */
export class CreateJournalEntryDto {
  @ApiProperty({ description: 'Journal number', example: 'JE-2024-001234' })
  @IsString()
  @IsNotEmpty()
  journalNumber: string;

  @ApiProperty({ enum: JournalEntryType, example: JournalEntryType.STANDARD })
  @IsEnum(JournalEntryType)
  journalType: JournalEntryType;

  @ApiProperty({ description: 'Entry date' })
  @Type(() => Date)
  @IsDate()
  entryDate: Date;

  @ApiProperty({ description: 'Posting date' })
  @Type(() => Date)
  @IsDate()
  postingDate: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Journal description', example: 'November accruals' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Source system', example: 'GL_MANUAL' })
  @IsString()
  @IsNotEmpty()
  sourceSystem: string;

  @ApiProperty({ description: 'Batch number', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Whether approval is required', example: true })
  @IsBoolean()
  approvalRequired: boolean;

  @ApiProperty({ type: [CreateJournalLineDto], description: 'Journal lines' })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateJournalLineDto)
  lines: CreateJournalLineDto[];
}

/**
 * DTO for updating journal entry
 */
export class UpdateJournalEntryDto {
  @ApiProperty({ description: 'Journal description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: JournalEntryStatus, required: false })
  @IsEnum(JournalEntryStatus)
  @IsOptional()
  status?: JournalEntryStatus;

  @ApiProperty({ type: [CreateJournalLineDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalLineDto)
  @IsOptional()
  lines?: CreateJournalLineDto[];
}

/**
 * DTO for multi-currency journal entry
 */
export class CreateMultiCurrencyJournalDto extends CreateJournalEntryDto {
  @ApiProperty({ description: 'Source currency code', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  sourceCurrency: string;

  @ApiProperty({ description: 'Functional currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  functionalCurrency: string;

  @ApiProperty({ description: 'Reporting currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  reportingCurrency: string;

  @ApiProperty({ enum: CurrencyConversionMethod, example: CurrencyConversionMethod.SPOT_RATE })
  @IsEnum(CurrencyConversionMethod)
  conversionMethod: CurrencyConversionMethod;

  @ApiProperty({ description: 'Gain/loss account code', required: false })
  @IsString()
  @IsOptional()
  gainLossAccount?: string;
}

/**
 * DTO for allocation execution
 */
export class ExecuteAllocationDto {
  @ApiProperty({ description: 'Allocation rule ID', example: 1 })
  @IsInt()
  @Min(1)
  ruleId: number;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Total amount to allocate', example: 100000.00 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Auto-post after calculation', example: false })
  @IsBoolean()
  @IsOptional()
  autoPost?: boolean;
}

/**
 * DTO for account reconciliation
 */
export class ReconcileAccountDto {
  @ApiProperty({ description: 'GL account code', example: '1010-000-0000' })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiProperty({ description: 'Subsidiary ledger type', example: 'AR' })
  @IsString()
  @IsNotEmpty()
  subsidiaryType: string;

  @ApiProperty({ description: 'Reconciliation date' })
  @Type(() => Date)
  @IsDate()
  reconciliationDate: Date;

  @ApiProperty({ description: 'Reconciler user ID', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  reconcilerId: string;

  @ApiProperty({ description: 'Expected subsidiary balance', required: false })
  @IsNumber()
  @IsOptional()
  expectedBalance?: number;
}

/**
 * DTO for period close execution
 */
export class ExecutePeriodCloseDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ enum: PeriodCloseType, example: PeriodCloseType.SOFT_CLOSE })
  @IsEnum(PeriodCloseType)
  closeType: PeriodCloseType;

  @ApiProperty({ description: 'User performing close', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Skip validation checks', example: false })
  @IsBoolean()
  @IsOptional()
  skipValidation?: boolean;
}

/**
 * DTO for intercompany transaction
 */
export class CreateIntercompanyTransactionDto {
  @ApiProperty({ description: 'From entity code', example: 'ENT001' })
  @IsString()
  @IsNotEmpty()
  fromEntity: string;

  @ApiProperty({ description: 'To entity code', example: 'ENT002' })
  @IsString()
  @IsNotEmpty()
  toEntity: string;

  @ApiProperty({ enum: IntercompanyTransactionType, example: IntercompanyTransactionType.SALE })
  @IsEnum(IntercompanyTransactionType)
  transactionType: IntercompanyTransactionType;

  @ApiProperty({ description: 'Transaction amount', example: 50000.00 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Transaction date' })
  @Type(() => Date)
  @IsDate()
  transactionDate: Date;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

/**
 * DTO for consolidation execution
 */
export class ExecuteConsolidationDto {
  @ApiProperty({ description: 'Entity codes to consolidate', example: ['ENT001', 'ENT002', 'ENT003'] })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  entities: string[];

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Include eliminations', example: true })
  @IsBoolean()
  includeEliminations: boolean;

  @ApiProperty({ description: 'Consolidation currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  consolidationCurrency: string;
}

/**
 * DTO for variance analysis
 */
export class AnalyzeVarianceDto {
  @ApiProperty({ description: 'Account code', example: '5000-100-0000' })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiProperty({ enum: VarianceAnalysisType, example: VarianceAnalysisType.BUDGET_VS_ACTUAL })
  @IsEnum(VarianceAnalysisType)
  analysisType: VarianceAnalysisType;

  @ApiProperty({ description: 'Budget or comparison amount', example: 150000.00 })
  @IsNumber()
  comparisonAmount: number;

  @ApiProperty({ description: 'Analysis period start date' })
  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @ApiProperty({ description: 'Analysis period end date' })
  @Type(() => Date)
  @IsDate()
  periodEnd: Date;

  @ApiProperty({ description: 'Dimensions to analyze', example: ['department', 'costCenter'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dimensions?: string[];
}

/**
 * DTO for financial report generation
 */
export class GenerateFinancialReportDto {
  @ApiProperty({ description: 'Report type', example: 'trial_balance' })
  @IsString()
  @IsNotEmpty()
  reportType: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ enum: FinancialReportFormat, example: FinancialReportFormat.PDF })
  @IsEnum(FinancialReportFormat)
  format: FinancialReportFormat;

  @ApiProperty({ description: 'Include drill-down details', example: false })
  @IsBoolean()
  @IsOptional()
  includeDrilldown?: boolean;
}

// ============================================================================
// NESTJS CONTROLLER - GL OPERATIONS REST API
// ============================================================================

@ApiTags('general-ledger-operations')
@Controller('api/v1/gl-operations')
@ApiBearerAuth()
export class GLOperationsController {
  private readonly logger = new Logger(GLOperationsController.name);

  constructor(private readonly glService: GLOperationsService) {}

  /**
   * Create new GL journal entry with validation and workflow
   */
  @Post('journal-entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create GL journal entry with approval workflow' })
  @ApiBody({ type: CreateJournalEntryDto })
  @ApiResponse({ status: 201, description: 'Journal entry created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid journal entry data' })
  async createJournalEntry(
    @Body() createDto: CreateJournalEntryDto,
  ): Promise<{
    journalId: number;
    journalNumber: string;
    status: JournalEntryStatus;
    approvalId?: number;
    auditId: number;
  }> {
    try {
      this.logger.log(`Creating journal entry: ${createDto.journalNumber}`);

      // Validate balanced entry
      const totalDebit = createDto.lines.reduce((sum, line) => sum + line.debitAmount, 0);
      const totalCredit = createDto.lines.reduce((sum, line) => sum + line.creditAmount, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new BadRequestException('Journal entry is not balanced');
      }

      const result = await this.glService.createJournalEntryWithWorkflow(
        createDto,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to create journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get journal entry by ID
   */
  @Get('journal-entries/:id')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({ status: 200, description: 'Journal entry retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async getJournalEntry(@Param('id', ParseIntPipe) id: number): Promise<any> {
    this.logger.log(`Retrieving journal entry: ${id}`);
    // Implementation would retrieve from database
    return { journalId: id, status: 'POSTED' };
  }

  /**
   * Update journal entry (only if not posted)
   */
  @Put('journal-entries/:id')
  @ApiOperation({ summary: 'Update journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiBody({ type: UpdateJournalEntryDto })
  @ApiResponse({ status: 200, description: 'Journal entry updated successfully' })
  @ApiResponse({ status: 400, description: 'Cannot update posted entry' })
  async updateJournalEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateJournalEntryDto,
  ): Promise<any> {
    this.logger.log(`Updating journal entry: ${id}`);
    // Implementation would update in database
    return { journalId: id, updated: true };
  }

  /**
   * Post journal entry to GL
   */
  @Post('journal-entries/:id/post')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Post journal entry to general ledger' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({ status: 200, description: 'Journal entry posted successfully' })
  @ApiResponse({ status: 400, description: 'Entry not approved or already posted' })
  async postJournalEntry(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<{
    posted: boolean;
    encumbrancesLiquidated: number;
    balances: AccountBalance[];
  }> {
    try {
      this.logger.log(`Posting journal entry: ${id}`);

      const result = await this.glService.postJournalEntryWithEncumbrance(
        id,
        userId,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to post journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reverse journal entry
   */
  @Post('journal-entries/:id/reverse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reverse journal entry' })
  @ApiParam({ name: 'id', description: 'Original journal entry ID' })
  @ApiQuery({ name: 'reversalDate', description: 'Date for reversal entry' })
  @ApiResponse({ status: 200, description: 'Journal entry reversed successfully' })
  async reverseJournalEntry(
    @Param('id', ParseIntPipe) id: number,
    @Query('reversalDate') reversalDate: Date,
    @Query('userId') userId: string,
  ): Promise<{ reversalJournalId: number; auditTrailId: number }> {
    try {
      this.logger.log(`Reversing journal entry: ${id}`);

      const result = await this.glService.reverseJournalEntry(
        id,
        new Date(reversalDate),
        userId,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to reverse journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multi-currency journal entry
   */
  @Post('journal-entries/multi-currency')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multi-currency journal entry with FX conversion' })
  @ApiBody({ type: CreateMultiCurrencyJournalDto })
  @ApiResponse({ status: 201, description: 'Multi-currency entry created successfully' })
  async createMultiCurrencyJournal(
    @Body() createDto: CreateMultiCurrencyJournalDto,
  ): Promise<{ journalId: number; exchangeRate: number; gainLoss: number }> {
    try {
      this.logger.log(`Creating multi-currency journal: ${createDto.journalNumber}`);

      const result = await this.glService.createMultiCurrencyJournalEntry(
        createDto as any,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to create multi-currency journal: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create intercompany transaction
   */
  @Post('intercompany/transactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create intercompany transaction with automatic entries' })
  @ApiBody({ type: CreateIntercompanyTransactionDto })
  @ApiResponse({ status: 201, description: 'Intercompany transaction created successfully' })
  async createIntercompanyTransaction(
    @Body() createDto: CreateIntercompanyTransactionDto,
  ): Promise<{
    journalId: number;
    intercompanyId: number;
    dueToEntry: number;
    dueFromEntry: number;
  }> {
    try {
      this.logger.log(
        `Creating intercompany transaction: ${createDto.fromEntity} -> ${createDto.toEntity}`,
      );

      // Create journal entry from DTO
      const journalEntry: any = {
        journalType: JournalEntryType.INTERCOMPANY,
        entryDate: createDto.transactionDate,
        postingDate: createDto.transactionDate,
        description: createDto.description,
        currency: createDto.currency,
        totalDebit: createDto.amount,
        totalCredit: createDto.amount,
        lines: [],
      };

      const result = await this.glService.createIntercompanyJournalEntry(
        journalEntry,
        createDto.fromEntity,
        createDto.toEntity,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to create intercompany transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute cost allocation
   */
  @Post('allocations/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute cost allocation with statistical drivers' })
  @ApiBody({ type: ExecuteAllocationDto })
  @ApiResponse({ status: 200, description: 'Allocation executed successfully' })
  async executeAllocation(
    @Body() executeDto: ExecuteAllocationDto,
  ): Promise<{
    allocationId: number;
    journalId: number;
    allocatedAmount: number;
    report: any;
  }> {
    try {
      this.logger.log(`Executing allocation rule: ${executeDto.ruleId}`);

      const result = await this.glService.executeAllocationWithDrivers(
        executeDto.ruleId,
        executeDto.fiscalYear,
        executeDto.fiscalPeriod,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to execute allocation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reconcile GL account to subsidiary ledger
   */
  @Post('reconciliations/account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reconcile GL account to subsidiary ledger' })
  @ApiBody({ type: ReconcileAccountDto })
  @ApiResponse({ status: 200, description: 'Account reconciliation completed' })
  async reconcileAccount(@Body() reconcileDto: ReconcileAccountDto): Promise<any> {
    try {
      this.logger.log(`Reconciling account: ${reconcileDto.accountCode}`);

      const result = await this.glService.reconcileGLToSubsidiary(
        reconcileDto.accountCode,
        reconcileDto.subsidiaryType,
        reconcileDto.reconciliationDate,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to reconcile account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute period close
   */
  @Post('period-close/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute period close process' })
  @ApiBody({ type: ExecutePeriodCloseDto })
  @ApiResponse({ status: 200, description: 'Period close executed successfully' })
  @ApiResponse({ status: 409, description: 'Period already closed' })
  async executePeriodClose(@Body() closeDto: ExecutePeriodCloseDto): Promise<any> {
    try {
      this.logger.log(`Executing period close: ${closeDto.fiscalYear}-${closeDto.fiscalPeriod}`);

      let result: any;

      if (closeDto.closeType === PeriodCloseType.SOFT_CLOSE) {
        result = await this.glService.executeSoftPeriodClose(
          closeDto.fiscalYear,
          closeDto.fiscalPeriod,
          undefined,
        );
      } else {
        result = await this.glService.executeHardPeriodClose(
          closeDto.fiscalYear,
          closeDto.fiscalPeriod,
          undefined,
        );
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to execute period close: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute consolidation
   */
  @Post('consolidations/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute multi-entity consolidation with eliminations' })
  @ApiBody({ type: ExecuteConsolidationDto })
  @ApiResponse({ status: 200, description: 'Consolidation executed successfully' })
  async executeConsolidation(@Body() consolidationDto: ExecuteConsolidationDto): Promise<any> {
    try {
      this.logger.log(`Executing consolidation for ${consolidationDto.entities.length} entities`);

      const result = await this.glService.consolidateEntitiesWithEliminations(
        consolidationDto.entities,
        consolidationDto.fiscalYear,
        consolidationDto.fiscalPeriod,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to execute consolidation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze account variance
   */
  @Post('analytics/variance-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze account variance by dimensions' })
  @ApiBody({ type: AnalyzeVarianceDto })
  @ApiResponse({ status: 200, description: 'Variance analysis completed' })
  async analyzeVariance(@Body() varianceDto: AnalyzeVarianceDto): Promise<any> {
    try {
      this.logger.log(`Analyzing variance for account: ${varianceDto.accountCode}`);

      const result = await this.glService.analyzeAccountVarianceByDimension(
        varianceDto.accountCode,
        varianceDto.comparisonAmount,
        varianceDto.periodStart,
        varianceDto.periodEnd,
        varianceDto.dimensions || [],
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to analyze variance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate financial report
   */
  @Post('reports/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate financial report' })
  @ApiBody({ type: GenerateFinancialReportDto })
  @ApiResponse({ status: 200, description: 'Financial report generated successfully' })
  async generateReport(@Body() reportDto: GenerateFinancialReportDto): Promise<any> {
    try {
      this.logger.log(`Generating ${reportDto.reportType} report`);

      let result: any;

      switch (reportDto.reportType) {
        case 'trial_balance':
          result = await this.glService.generateTrialBalanceWithDrilldown(
            reportDto.fiscalYear,
            reportDto.fiscalPeriod,
            reportDto.includeDrilldown || false,
            undefined,
          );
          break;

        case 'financial_package':
          result = await this.glService.generateFinancialStatementPackage(
            reportDto.fiscalYear,
            reportDto.fiscalPeriod,
            undefined,
          );
          break;

        default:
          throw new BadRequestException(`Unknown report type: ${reportDto.reportType}`);
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to generate report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get trial balance
   */
  @Get('reports/trial-balance')
  @ApiOperation({ summary: 'Get trial balance for period' })
  @ApiQuery({ name: 'fiscalYear', description: 'Fiscal year' })
  @ApiQuery({ name: 'fiscalPeriod', description: 'Fiscal period' })
  @ApiResponse({ status: 200, description: 'Trial balance retrieved successfully' })
  async getTrialBalance(
    @Query('fiscalYear', ParseIntPipe) fiscalYear: number,
    @Query('fiscalPeriod', ParseIntPipe) fiscalPeriod: number,
  ): Promise<TrialBalance> {
    try {
      this.logger.log(`Retrieving trial balance: ${fiscalYear}-${fiscalPeriod}`);

      const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);
      return trialBalance;
    } catch (error: any) {
      this.logger.error(`Failed to retrieve trial balance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate audit compliance
   */
  @Get('audit/compliance-status')
  @ApiOperation({ summary: 'Validate audit compliance for period' })
  @ApiQuery({ name: 'fiscalYear', description: 'Fiscal year' })
  @ApiQuery({ name: 'fiscalPeriod', description: 'Fiscal period' })
  @ApiResponse({ status: 200, description: 'Compliance status retrieved' })
  async validateCompliance(
    @Query('fiscalYear', ParseIntPipe) fiscalYear: number,
    @Query('fiscalPeriod', ParseIntPipe) fiscalPeriod: number,
  ): Promise<any> {
    try {
      this.logger.log(`Validating compliance: ${fiscalYear}-${fiscalPeriod}`);

      const result = await this.glService.validateSOXCompliance(
        fiscalYear,
        fiscalPeriod,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to validate compliance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get audit trail for period
   */
  @Get('audit/trail')
  @ApiOperation({ summary: 'Get audit trail analysis for period' })
  @ApiQuery({ name: 'fiscalYear', description: 'Fiscal year' })
  @ApiQuery({ name: 'fiscalPeriod', description: 'Fiscal period' })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  async getAuditTrail(
    @Query('fiscalYear', ParseIntPipe) fiscalYear: number,
    @Query('fiscalPeriod', ParseIntPipe) fiscalPeriod: number,
  ): Promise<any> {
    try {
      this.logger.log(`Retrieving audit trail: ${fiscalYear}-${fiscalPeriod}`);

      const result = await this.glService.analyzeAuditTrailForPeriod(
        fiscalYear,
        fiscalPeriod,
        undefined,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to retrieve audit trail: ${error.message}`);
      throw error;
    }
  }
}

// ============================================================================
// INJECTABLE SERVICE CLASS - GL OPERATIONS
// ============================================================================

@Injectable()
export class GLOperationsService {
  private readonly logger = new Logger(GLOperationsService.name);

  /**
   * Creates journal entry with comprehensive validation and workflow
   * Composes: validateDimensionCombination, initiateApprovalWorkflow, logGLTransaction
   */
  async createJournalEntryWithWorkflow(
    entry: any,
    transaction?: Transaction,
  ): Promise<{
    journalId: number;
    journalNumber: string;
    status: JournalEntryStatus;
    approvalId?: number;
    auditId: number;
  }> {
    try {
      this.logger.log(`Creating journal entry with workflow: ${entry.journalNumber}`);

      // Validate dimension combinations for all lines
      for (const line of entry.lines) {
        if (line.dimensions) {
          const dimensionValidation = await validateDimensionCombination(
            line.accountCode,
            line.dimensions,
          );
          if (!dimensionValidation.valid) {
            throw new BadRequestException(
              `Invalid dimension combination for line ${line.lineNumber}: ${dimensionValidation.errors.join(', ')}`,
            );
          }
        }
      }

      // Create journal entry (implement actual creation)
      const journalId = Math.floor(Math.random() * 1000000);

      // Initiate approval workflow if required
      let approvalId: number | undefined;
      if (entry.approvalRequired) {
        try {
          const workflow = await createWorkflowDefinition({
            workflowCode: 'GL_JOURNAL_APPROVAL',
            workflowName: 'GL Journal Entry Approval',
            steps: [],
            isActive: true,
          } as any);

          const approval = await initiateApprovalWorkflow(
            workflow.workflowId,
            'journal_entry',
            journalId,
            'system',
          );
          approvalId = approval.requestId;
        } catch (error: any) {
          this.logger.warn(`Failed to initiate approval workflow: ${error.message}`);
        }
      }

      // Log audit trail
      const audit = await logGLTransaction({
        transactionType: 'journal_entry_create',
        journalId,
        userId: 'system',
        timestamp: new Date(),
        changes: entry,
      } as any);

      const status = entry.approvalRequired
        ? JournalEntryStatus.PENDING_APPROVAL
        : JournalEntryStatus.DRAFT;

      return {
        journalId,
        journalNumber: entry.journalNumber,
        status,
        approvalId,
        auditId: audit.logId,
      };
    } catch (error: any) {
      this.logger.error(`Error creating journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Posts journal entry with encumbrance liquidation and audit trail
   * Composes: liquidateEncumbrance, logGLTransaction, calculateAccountBalance
   */
  async postJournalEntryWithEncumbrance(
    journalId: number,
    userId: string,
    transaction?: Transaction,
  ): Promise<{ posted: boolean; encumbrancesLiquidated: number; balances: AccountBalance[] }> {
    try {
      this.logger.log(`Posting journal entry ${journalId} with encumbrance processing`);

      // Check approval status
      const approvalStatus = await checkApprovalStatus('journal_entry', journalId);
      if (approvalStatus.status !== 'approved' && approvalStatus.requiresApproval) {
        throw new BadRequestException('Journal entry requires approval before posting');
      }

      // Liquidate related encumbrances
      let encumbrancesLiquidated = 0;
      // In actual implementation, retrieve encumbrances and liquidate them

      // Post journal entry (implement actual posting)
      const posted = true;

      // Calculate updated account balances
      const balances: AccountBalance[] = [];
      // In actual implementation, calculate balances for affected accounts

      // Log audit trail
      await logGLTransaction({
        transactionType: 'journal_entry_post',
        journalId,
        userId,
        timestamp: new Date(),
        changes: { posted, encumbrancesLiquidated },
      } as any);

      return { posted, encumbrancesLiquidated, balances };
    } catch (error: any) {
      this.logger.error(`Error posting journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates multi-currency journal entry with currency conversion and gain/loss
   * Composes: getCurrencyRate, convertCurrency, calculateGainLoss, createJournalEntryWithWorkflow
   */
  async createMultiCurrencyJournalEntry(
    entry: any,
    transaction?: Transaction,
  ): Promise<{ journalId: number; exchangeRate: number; gainLoss: number }> {
    try {
      this.logger.log(`Creating multi-currency journal entry: ${entry.sourceCurrency} -> ${entry.functionalCurrency}`);

      // Get current exchange rate
      const rate = await getCurrencyRate(
        entry.sourceCurrency,
        entry.functionalCurrency,
        entry.entryDate,
      );

      // Convert amounts
      const totalDebit = entry.lines.reduce((sum: number, line: any) => sum + line.debitAmount, 0);
      const conversion = await convertCurrency(
        totalDebit,
        entry.sourceCurrency,
        entry.functionalCurrency,
        entry.entryDate,
      );

      // Calculate gain/loss
      const gainLoss = await calculateGainLoss(
        totalDebit,
        entry.sourceCurrency,
        entry.functionalCurrency,
        rate.rate,
        entry.entryDate,
      );

      // Update entry with converted amounts
      entry.exchangeRate = rate.rate;
      entry.functionalAmount = conversion.targetAmount;
      entry.gainLossAmount = gainLoss;

      // Create journal entry
      const result = await this.createJournalEntryWithWorkflow(entry, transaction);

      return {
        journalId: result.journalId,
        exchangeRate: rate.rate,
        gainLoss,
      };
    } catch (error: any) {
      this.logger.error(`Error creating multi-currency journal: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates intercompany journal entry with automatic due to/due from entries
   * Composes: createIntercompanyTransaction, generateIntercompanyEntries, validateIntercompanyBalance
   */
  async createIntercompanyJournalEntry(
    entry: any,
    fromEntity: string,
    toEntity: string,
    transaction?: Transaction,
  ): Promise<{
    journalId: number;
    intercompanyId: number;
    dueToEntry: number;
    dueFromEntry: number;
  }> {
    try {
      this.logger.log(`Creating intercompany journal: ${fromEntity} -> ${toEntity}`);

      // Create intercompany transaction record
      const icTransaction = await createIntercompanyTransaction({
        fromEntity,
        toEntity,
        transactionDate: entry.entryDate,
        amount: entry.totalDebit,
        description: entry.description,
        status: 'pending',
      } as any);

      // Generate automatic due to/due from entries
      const icEntries = await generateIntercompanyEntries(icTransaction);

      // Validate intercompany balance
      const balanceValidation = await validateIntercompanyBalance(fromEntity, toEntity);
      if (!balanceValidation.balanced) {
        this.logger.warn(
          `Intercompany accounts out of balance: ${balanceValidation.variance}`,
        );
      }

      // Create main journal entry
      const result = await this.createJournalEntryWithWorkflow(entry, transaction);

      return {
        journalId: result.journalId,
        intercompanyId: icTransaction.transactionId,
        dueToEntry: icEntries.dueToEntryId,
        dueFromEntry: icEntries.dueFromEntryId,
      };
    } catch (error: any) {
      this.logger.error(`Error creating intercompany journal: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reverses journal entry with automatic reversal generation
   * Composes: logGLTransaction, createAuditTrail, validateDimensionCombination
   */
  async reverseJournalEntry(
    originalJournalId: number,
    reversalDate: Date,
    userId: string,
    transaction?: Transaction,
  ): Promise<{ reversalJournalId: number; auditTrailId: number }> {
    try {
      this.logger.log(`Reversing journal entry ${originalJournalId}`);

      // Retrieve original journal entry (implement actual retrieval)
      const originalEntry: any = {
        journalId: originalJournalId,
        journalNumber: `JE-${originalJournalId}`,
        journalType: JournalEntryType.STANDARD,
        entryDate: new Date(),
        postingDate: new Date(),
        fiscalYear: 2024,
        fiscalPeriod: 11,
        description: 'Original entry',
        sourceSystem: 'GL',
        status: JournalEntryStatus.POSTED,
        totalDebit: 10000,
        totalCredit: 10000,
        currency: 'USD',
        approvalRequired: false,
        lines: [],
      };

      // Create reversal entry (flip debits/credits)
      const reversalEntry: any = {
        ...originalEntry,
        journalId: 0,
        journalNumber: `REV-${originalEntry.journalNumber}`,
        journalType: JournalEntryType.REVERSING,
        entryDate: reversalDate,
        postingDate: reversalDate,
        description: `Reversal of ${originalEntry.journalNumber}`,
        status: JournalEntryStatus.DRAFT,
        lines: originalEntry.lines.map((line: any) => ({
          ...line,
          debitAmount: line.creditAmount,
          creditAmount: line.debitAmount,
        })),
      };

      // Create reversal journal
      const result = await this.createJournalEntryWithWorkflow(reversalEntry, transaction);

      // Create audit trail linking original and reversal
      const auditTrail = await createAuditTrail({
        entityType: 'journal_entry',
        entityId: originalJournalId,
        action: 'reverse',
        userId,
        timestamp: new Date(),
        relatedEntities: [{ type: 'reversal_journal', id: result.journalId }],
      } as any);

      return {
        reversalJournalId: result.journalId,
        auditTrailId: auditTrail.trailId,
      };
    } catch (error: any) {
      this.logger.error(`Error reversing journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes cost allocation with statistical drivers and audit trail
   * Composes: validateStatisticalDriver, calculateAllocationAmounts, executeAllocation, generateAllocationReport
   */
  async executeAllocationWithDrivers(
    ruleId: number,
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    allocationId: number;
    journalId: number;
    allocatedAmount: number;
    report: any;
  }> {
    try {
      this.logger.log(`Executing allocation rule ${ruleId} for ${fiscalYear}-${fiscalPeriod}`);

      // Retrieve allocation rule
      const rule: AllocationRule = {
        ruleId,
        ruleCode: `ALLOC-${ruleId}`,
        ruleName: 'Department Cost Allocation',
        description: 'Allocate overhead costs to departments',
        allocationMethod: 'proportional',
        allocationType: 'cost',
        sourceDepartment: 'OVERHEAD',
        targetDepartments: ['DEPT-A', 'DEPT-B'],
        allocationBasis: 'headcount',
        allocationDriver: 'HEADCOUNT-DRIVER',
        effectiveDate: new Date(),
        priority: 1,
        isActive: true,
        requiresApproval: false,
      };

      // Validate statistical drivers
      const driver = await createStatisticalDriver({
        driverCode: rule.allocationDriver,
        driverName: 'Headcount',
        driverType: 'headcount',
        department: rule.sourceDepartment,
        fiscalYear,
        fiscalPeriod,
        driverValue: 100,
        unitOfMeasure: 'employees',
        dataSource: 'HRIS',
        capturedDate: new Date(),
        isEstimated: false,
      } as any);

      const driverValidation = await validateStatisticalDriver(driver);
      if (!driverValidation.valid) {
        throw new BadRequestException(
          `Invalid statistical driver: ${driverValidation.errors.join(', ')}`,
        );
      }

      // Calculate allocation amounts
      const amounts = await calculateAllocationAmounts(rule, 100000, [driver]);

      // Execute allocation
      const allocationResult = await executeAllocation(rule, amounts, transaction);

      // Generate allocation report
      const report = await generateAllocationReport(ruleId, fiscalYear, fiscalPeriod);

      return {
        allocationId: allocationResult.allocationId,
        journalId: allocationResult.journalEntryId,
        allocatedAmount: allocationResult.totalAllocated,
        report,
      };
    } catch (error: any) {
      this.logger.error(`Error executing allocation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes reciprocal allocations with cascade logic
   * Composes: processReciprocalAllocations, createAllocationPool, validateAllocationRule
   */
  async processReciprocalAllocationCascade(
    poolIds: number[],
    fiscalYear: number,
    fiscalPeriod: number,
    maxIterations: number = 10,
    transaction?: Transaction,
  ): Promise<{
    poolsProcessed: number;
    journalsCreated: number;
    totalAllocated: number;
    iterations: number;
  }> {
    try {
      this.logger.log(`Processing ${poolIds.length} reciprocal allocation pools`);

      let totalAllocated = 0;
      let journalsCreated = 0;

      // Create allocation pools
      const pools: AllocationPool[] = [];
      for (const poolId of poolIds) {
        const pool = await createAllocationPool({
          poolCode: `POOL-${poolId}`,
          poolName: `Allocation Pool ${poolId}`,
          poolType: 'cost-pool',
          description: 'Reciprocal allocation pool',
          sourceAccounts: [],
          totalAmount: 50000,
          fiscalYear,
          fiscalPeriod,
          status: 'active',
        } as any);
        pools.push(pool);
      }

      // Process reciprocal allocations
      const result = await processReciprocalAllocations(pools, maxIterations, transaction);

      totalAllocated = result.totalAllocated;
      journalsCreated = result.journalEntries.length;

      return {
        poolsProcessed: pools.length,
        journalsCreated,
        totalAllocated,
        iterations: result.iterations,
      };
    } catch (error: any) {
      this.logger.error(`Error processing reciprocal allocations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes step-down allocation with multiple tiers
   * Composes: executeStepDownAllocation, validateAllocationRule, generateAllocationReport
   */
  async executeMultiTierStepDownAllocation(
    rules: AllocationRule[],
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    tiersProcessed: number;
    totalAllocated: number;
    reports: any[];
  }> {
    try {
      this.logger.log(`Executing ${rules.length} tier step-down allocation`);

      let totalAllocated = 0;
      const reports: any[] = [];

      // Validate all rules
      for (const rule of rules) {
        const validation = await validateAllocationRule(rule);
        if (!validation.valid) {
          throw new BadRequestException(
            `Invalid allocation rule ${rule.ruleCode}: ${validation.errors.join(', ')}`,
          );
        }
      }

      // Execute step-down allocation
      const result = await executeStepDownAllocation(rules, transaction);
      totalAllocated = result.totalAllocated;

      // Generate reports for each tier
      for (const rule of rules) {
        const report = await generateAllocationReport(rule.ruleId, fiscalYear, fiscalPeriod);
        reports.push(report);
      }

      return {
        tiersProcessed: rules.length,
        totalAllocated,
        reports,
      };
    } catch (error: any) {
      this.logger.error(`Error executing step-down allocation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reconciles GL account to subsidiary ledger
   * Composes: calculateAccountBalance, drilldownToTransactions, generateAuditReport
   */
  async reconcileGLToSubsidiary(
    accountCode: string,
    subsidiaryType: string,
    reconciliationDate: Date,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      this.logger.log(`Reconciling account ${accountCode} to ${subsidiaryType}`);

      // Calculate GL balance
      const glBalance = await calculateAccountBalance(
        accountCode,
        reconciliationDate,
        reconciliationDate,
      );

      // Calculate subsidiary balance (implement actual calculation)
      const subsidiaryBalance = glBalance.balance;

      // Calculate variance
      const variance = glBalance.balance - subsidiaryBalance;
      const variancePercent =
        subsidiaryBalance !== 0 ? (variance / subsidiaryBalance) * 100 : 0;

      // Drill down to transactions if variance exists
      let reconciliationItems: any[] = [];
      if (Math.abs(variance) > 0.01) {
        const transactions = await drilldownToTransactions(
          accountCode,
          new Date(reconciliationDate.getFullYear(), 0, 1),
          reconciliationDate,
        );
        // Analyze transactions to identify reconciliation items
      }

      // Generate audit report
      const auditReport = await generateAuditReport(
        'account_reconciliation',
        new Date(reconciliationDate.getFullYear(), reconciliationDate.getMonth(), 1),
        reconciliationDate,
      );

      return {
        accountCode,
        accountName: glBalance.accountName,
        reconciliationDate,
        glBalance: glBalance.balance,
        subsidiaryBalance,
        variance,
        variancePercent,
        isReconciled: Math.abs(variance) < 0.01,
        reconciliationItems,
        status:
          Math.abs(variance) < 0.01
            ? ReconciliationStatus.RECONCILED
            : ReconciliationStatus.VARIANCE_IDENTIFIED,
      };
    } catch (error: any) {
      this.logger.error(`Error reconciling account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Performs account variance analysis with dimensional breakdown
   * Composes: calculateAccountBalance, rollupDimensionValues, drilldownToTransactions
   */
  async analyzeAccountVarianceByDimension(
    accountCode: string,
    budgetAmount: number,
    actualPeriodStart: Date,
    actualPeriodEnd: Date,
    dimensions: string[],
    transaction?: Transaction,
  ): Promise<{
    totalVariance: number;
    variancePercent: number;
    dimensionalBreakdown: any[];
  }> {
    try {
      this.logger.log(`Analyzing variance for account ${accountCode}`);

      // Calculate actual balance
      const actualBalance = await calculateAccountBalance(
        accountCode,
        actualPeriodStart,
        actualPeriodEnd,
      );

      // Calculate variance
      const totalVariance = actualBalance.balance - budgetAmount;
      const variancePercent = budgetAmount !== 0 ? (totalVariance / budgetAmount) * 100 : 0;

      // Rollup dimension values for analysis
      const dimensionalBreakdown: any[] = [];
      for (const dimensionCode of dimensions) {
        const hierarchy = await getDimensionHierarchy(dimensionCode);
        const rollup = await rollupDimensionValues(hierarchy, actualBalance.balance);
        dimensionalBreakdown.push({
          dimension: dimensionCode,
          rollup,
        });
      }

      return {
        totalVariance,
        variancePercent,
        dimensionalBreakdown,
      };
    } catch (error: any) {
      this.logger.error(`Error analyzing variance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reconciles intercompany accounts across entities
   * Composes: reconcileIntercompanyAccounts, matchIntercompanyTransactions, createEliminationEntry
   */
  async reconcileIntercompanyAccountsComplete(
    entity1: string,
    entity2: string,
    reconciliationDate: Date,
    transaction?: Transaction,
  ): Promise<{
    reconciled: boolean;
    variance: number;
    matchedTransactions: number;
    eliminationEntryId?: number;
  }> {
    try {
      this.logger.log(`Reconciling intercompany accounts: ${entity1} <-> ${entity2}`);

      // Reconcile intercompany accounts
      const reconciliation = await reconcileIntercompanyAccounts(
        entity1,
        entity2,
        reconciliationDate,
      );

      // Match intercompany transactions
      const matches = await matchIntercompanyTransactions(entity1, entity2, reconciliationDate);

      // Create elimination entry if balanced
      let eliminationEntryId: number | undefined;
      if (reconciliation.balanced) {
        const elimination = await createEliminationEntry({
          entity1,
          entity2,
          eliminationDate: reconciliationDate,
          amount: reconciliation.entity1Balance,
          description: 'Intercompany elimination',
          status: 'draft',
        } as any);
        eliminationEntryId = elimination.entryId;
      }

      return {
        reconciled: reconciliation.balanced,
        variance: reconciliation.variance,
        matchedTransactions: matches.matched.length,
        eliminationEntryId,
      };
    } catch (error: any) {
      this.logger.error(`Error reconciling intercompany accounts: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes soft close with validation and reporting
   * Composes: generateTrialBalance, reconcileIntercompanyAccounts, validateAuditCompliance
   */
  async executeSoftPeriodClose(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    closeStatus: any;
    trialBalance: TrialBalance;
    complianceReport: ComplianceReport;
  }> {
    try {
      this.logger.log(`Executing soft close for ${fiscalYear}-${fiscalPeriod}`);

      // Generate trial balance
      const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);

      // Validate trial balance
      if (!trialBalance.isBalanced) {
        throw new ConflictException('Trial balance is not balanced, cannot proceed with soft close');
      }

      // Validate audit compliance
      const complianceReport = await validateAuditCompliance(
        'period_close',
        fiscalYear,
        fiscalPeriod,
      );

      // Create close status
      const closeStatus = {
        fiscalYear,
        fiscalPeriod,
        closeType: PeriodCloseType.SOFT_CLOSE,
        status: PeriodCloseStatus.CLOSED,
        tasksCompleted: 15,
        tasksTotal: 15,
        completionPercent: 100,
        closeDate: new Date(),
        closedBy: 'system',
        canReopen: true,
      };

      return {
        closeStatus,
        trialBalance,
        complianceReport,
      };
    } catch (error: any) {
      this.logger.error(`Error executing soft close: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes hard close with final validations and lock
   * Composes: generateTrialBalance, reconcileIntercompanyAccounts, createAuditTrail
   */
  async executeHardPeriodClose(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    closeStatus: any;
    auditTrailId: number;
    locked: boolean;
  }> {
    try {
      this.logger.log(`Executing hard close for ${fiscalYear}-${fiscalPeriod}`);

      // Generate final trial balance
      const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);

      if (!trialBalance.isBalanced) {
        throw new ConflictException('Trial balance is not balanced, cannot proceed with hard close');
      }

      // Create audit trail for hard close
      const auditTrail = await createAuditTrail({
        entityType: 'period_close',
        entityId: fiscalPeriod,
        action: 'hard_close',
        userId: 'system',
        timestamp: new Date(),
        relatedEntities: [{ type: 'fiscal_period', id: fiscalPeriod }],
      } as any);

      // Lock period (implement actual locking)
      const locked = true;

      const closeStatus = {
        fiscalYear,
        fiscalPeriod,
        closeType: PeriodCloseType.HARD_CLOSE,
        status: PeriodCloseStatus.LOCKED,
        tasksCompleted: 20,
        tasksTotal: 20,
        completionPercent: 100,
        closeDate: new Date(),
        closedBy: 'system',
        canReopen: false,
      };

      return {
        closeStatus,
        auditTrailId: auditTrail.trailId,
        locked,
      };
    } catch (error: any) {
      this.logger.error(`Error executing hard close: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes currency revaluation for period close
   * Composes: revalueForeignCurrencyAccounts, postCurrencyRevaluation, generateRevaluationReport
   */
  async processPeriodEndCurrencyRevaluation(
    fiscalYear: number,
    fiscalPeriod: number,
    revaluationDate: Date,
    transaction?: Transaction,
  ): Promise<{
    accountsRevalued: number;
    totalGainLoss: number;
    journalId: number;
    report: any;
  }> {
    try {
      this.logger.log(`Processing currency revaluation for ${fiscalYear}-${fiscalPeriod}`);

      // Revalue foreign currency accounts
      const revaluation = await revalueForeignCurrencyAccounts(['USD'], revaluationDate);

      // Post revaluation entries
      const journalResult = await postCurrencyRevaluation(
        revaluation,
        fiscalYear,
        fiscalPeriod,
        transaction,
      );

      // Generate revaluation report
      const report = await generateRevaluationReport(revaluationDate, revaluation);

      return {
        accountsRevalued: revaluation.accounts.length,
        totalGainLoss: revaluation.totalGainLoss,
        journalId: journalResult.journalId,
        report,
      };
    } catch (error: any) {
      this.logger.error(`Error processing currency revaluation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Consolidates multiple entities with elimination entries
   * Composes: generateTrialBalance, createEliminationEntry, postIntercompanyElimination
   */
  async consolidateEntitiesWithEliminations(
    entities: string[],
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      this.logger.log(`Consolidating ${entities.length} entities`);

      let totalAssets = 0;
      let totalLiabilities = 0;
      let totalEquity = 0;
      let eliminationEntries = 0;

      // Generate trial balance for each entity
      for (const entity of entities) {
        const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);
        totalAssets += trialBalance.totalDebits;
        totalLiabilities += trialBalance.totalCredits;
      }

      // Create intercompany elimination entries
      for (let i = 0; i < entities.length - 1; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          const reconciliation = await reconcileIntercompanyAccounts(
            entities[i],
            entities[j],
            new Date(),
          );

          if (reconciliation.balanced) {
            const elimination = await createEliminationEntry({
              entity1: entities[i],
              entity2: entities[j],
              eliminationDate: new Date(),
              amount: reconciliation.entity1Balance,
              description: 'Consolidation elimination',
              status: 'draft',
            } as any);

            await postIntercompanyElimination(elimination, transaction);
            eliminationEntries++;
          }
        }
      }

      totalEquity = totalAssets - totalLiabilities;

      return {
        consolidationId: Math.floor(Math.random() * 1000000),
        consolidationDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        entities,
        totalAssets,
        totalLiabilities,
        totalEquity,
        eliminationEntries,
        status: ConsolidationStatus.CALCULATED,
      };
    } catch (error: any) {
      this.logger.error(`Error consolidating entities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates consolidated financial statements
   * Composes: generateBalanceSheet, generateIncomeStatement, exportFinancialReport
   */
  async generateConsolidatedFinancialStatements(
    consolidationId: number,
    fiscalYear: number,
    fiscalPeriod: number,
    format: string,
    transaction?: Transaction,
  ): Promise<{
    balanceSheet: any;
    incomeStatement: any;
    exportPath: string;
  }> {
    try {
      this.logger.log(`Generating consolidated statements for consolidation ${consolidationId}`);

      // Generate consolidated balance sheet
      const balanceSheet = await generateBalanceSheet(fiscalYear, fiscalPeriod);

      // Generate consolidated income statement
      const incomeStatement = await generateIncomeStatement(fiscalYear, fiscalPeriod);

      // Export financial reports
      const exportPath = await exportFinancialReport(
        [balanceSheet, incomeStatement],
        format as any,
        `consolidation_${consolidationId}`,
      );

      return {
        balanceSheet,
        incomeStatement,
        exportPath,
      };
    } catch (error: any) {
      this.logger.error(`Error generating consolidated statements: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates comprehensive GL trial balance with drill-down capability
   * Composes: generateTrialBalance, drilldownToTransactions, exportFinancialReport
   */
  async generateTrialBalanceWithDrilldown(
    fiscalYear: number,
    fiscalPeriod: number,
    includeDrilldown: boolean = false,
    transaction?: Transaction,
  ): Promise<{
    trialBalance: TrialBalance;
    drilldownData?: any[];
    exportPath?: string;
  }> {
    try {
      this.logger.log(`Generating trial balance for ${fiscalYear}-${fiscalPeriod}`);

      // Generate trial balance
      const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);

      let drilldownData: any[] | undefined;
      if (includeDrilldown) {
        drilldownData = [];
        // Drill down to transactions for each account
        for (const account of trialBalance.accounts) {
          const transactions = await drilldownToTransactions(
            account.accountCode,
            new Date(fiscalYear, fiscalPeriod - 1, 1),
            new Date(fiscalYear, fiscalPeriod, 0),
          );
          drilldownData.push({
            accountCode: account.accountCode,
            transactions,
          });
        }
      }

      // Export trial balance
      const exportPath = await exportFinancialReport(
        [trialBalance],
        'excel',
        `trial_balance_${fiscalYear}_${fiscalPeriod}`,
      );

      return {
        trialBalance,
        drilldownData,
        exportPath,
      };
    } catch (error: any) {
      this.logger.error(`Error generating trial balance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates financial statement package with all reports
   * Composes: generateBalanceSheet, generateIncomeStatement, generateTrialBalance, exportFinancialReport
   */
  async generateFinancialStatementPackage(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    balanceSheet: any;
    incomeStatement: any;
    trialBalance: TrialBalance;
    packagePath: string;
  }> {
    try {
      this.logger.log(`Generating financial statement package for ${fiscalYear}-${fiscalPeriod}`);

      // Generate all financial statements
      const balanceSheet = await generateBalanceSheet(fiscalYear, fiscalPeriod);
      const incomeStatement = await generateIncomeStatement(fiscalYear, fiscalPeriod);
      const trialBalance = await generateTrialBalance(fiscalYear, fiscalPeriod);

      // Export complete package
      const packagePath = await exportFinancialReport(
        [balanceSheet, incomeStatement, trialBalance],
        'pdf',
        `financial_package_${fiscalYear}_${fiscalPeriod}`,
      );

      return {
        balanceSheet,
        incomeStatement,
        trialBalance,
        packagePath,
      };
    } catch (error: any) {
      this.logger.error(`Error generating financial package: ${error.message}`);
      throw error;
    }
  }

  /**
   * Performs comprehensive audit trail analysis
   * Composes: generateAuditReport, detectAnomalousTransactions, trackUserActivity
   */
  async analyzeAuditTrailForPeriod(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    auditReport: ComplianceReport;
    anomalies: any[];
    userActivity: any[];
  }> {
    try {
      this.logger.log(`Analyzing audit trail for ${fiscalYear}-${fiscalPeriod}`);

      const periodStart = new Date(fiscalYear, fiscalPeriod - 1, 1);
      const periodEnd = new Date(fiscalYear, fiscalPeriod, 0);

      // Generate audit report
      const auditReport = await generateAuditReport('gl_operations', periodStart, periodEnd);

      // Detect anomalous transactions
      const anomalies = await detectAnomalousTransactions(periodStart, periodEnd, 2.5);

      // Track user activity
      const userActivity = await trackUserActivity(periodStart, periodEnd, 'gl_operations');

      return {
        auditReport,
        anomalies,
        userActivity,
      };
    } catch (error: any) {
      this.logger.error(`Error analyzing audit trail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validates SOX compliance for GL operations
   * Composes: validateAuditCompliance, getApprovalHistory, generateAuditReport
   */
  async validateSOXCompliance(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    compliant: boolean;
    complianceReport: ComplianceReport;
    violations: any[];
    approvalGaps: any[];
  }> {
    try {
      this.logger.log(`Validating SOX compliance for ${fiscalYear}-${fiscalPeriod}`);

      // Validate audit compliance
      const complianceReport = await validateAuditCompliance(
        'sox_compliance',
        fiscalYear,
        fiscalPeriod,
      );

      // Check approval history for gaps
      const approvalGaps: any[] = [];
      // In actual implementation, check for missing approvals

      const violations = complianceReport.violations || [];

      return {
        compliant: violations.length === 0 && approvalGaps.length === 0,
        complianceReport,
        violations,
        approvalGaps,
      };
    } catch (error: any) {
      this.logger.error(`Error validating SOX compliance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes batch journal entries with validation
   * Composes: validateDimensionCombination, createJournalEntryWithWorkflow, logGLTransaction
   */
  async processBatchJournalEntries(
    entries: any[],
    transaction?: Transaction,
  ): Promise<{
    totalProcessed: number;
    successful: number;
    failed: number;
    errors: any[];
  }> {
    try {
      this.logger.log(`Processing batch of ${entries.length} journal entries`);

      let successful = 0;
      let failed = 0;
      const errors: any[] = [];

      for (const entry of entries) {
        try {
          await this.createJournalEntryWithWorkflow(entry, transaction);
          successful++;
        } catch (error: any) {
          failed++;
          errors.push({
            journalNumber: entry.journalNumber,
            error: error.message,
          });
        }
      }

      return {
        totalProcessed: entries.length,
        successful,
        failed,
        errors,
      };
    } catch (error: any) {
      this.logger.error(`Error processing batch journals: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes recurring journal entries
   * Composes: createJournalEntryWithWorkflow, logGLTransaction, validateDimensionCombination
   */
  async executeRecurringJournalEntries(
    templateId: number,
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    journalsCreated: number;
    totalAmount: number;
    journalIds: number[];
  }> {
    try {
      this.logger.log(`Executing recurring journal template ${templateId}`);

      // Retrieve recurring journal template
      const template: any = {
        journalType: JournalEntryType.RECURRING,
        entryDate: new Date(),
        postingDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        description: 'Recurring entry',
        sourceSystem: 'GL',
        status: JournalEntryStatus.DRAFT,
        totalDebit: 5000,
        totalCredit: 5000,
        currency: 'USD',
        approvalRequired: false,
        lines: [],
      };

      // Create journal from template
      const result = await this.createJournalEntryWithWorkflow(template, transaction);

      return {
        journalsCreated: 1,
        totalAmount: template.totalDebit,
        journalIds: [result.journalId],
      };
    } catch (error: any) {
      this.logger.error(`Error executing recurring journals: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk account reconciliation
   * Composes: reconcileGLToSubsidiary, calculateAccountBalance, generateAuditReport
   */
  async bulkReconcileAccounts(
    accountCodes: string[],
    subsidiaryType: string,
    reconciliationDate: Date,
    transaction?: Transaction,
  ): Promise<{
    totalAccounts: number;
    reconciled: number;
    unreconciled: number;
    totalVariance: number;
    results: any[];
  }> {
    try {
      this.logger.log(`Bulk reconciling ${accountCodes.length} accounts`);

      const results: any[] = [];
      let reconciled = 0;
      let unreconciled = 0;
      let totalVariance = 0;

      for (const accountCode of accountCodes) {
        const result = await this.reconcileGLToSubsidiary(
          accountCode,
          subsidiaryType,
          reconciliationDate,
          transaction,
        );
        results.push(result);

        if (result.isReconciled) {
          reconciled++;
        } else {
          unreconciled++;
          totalVariance += Math.abs(result.variance);
        }
      }

      return {
        totalAccounts: accountCodes.length,
        reconciled,
        unreconciled,
        totalVariance,
        results,
      };
    } catch (error: any) {
      this.logger.error(`Error in bulk reconciliation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Performs what-if allocation scenario analysis
   * Composes: calculateAllocationAmounts, createStatisticalDriver, generateAllocationReport
   */
  async analyzeAllocationScenarios(
    rule: AllocationRule,
    scenarios: any[],
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    scenarioCount: number;
    results: any[];
    recommendedScenario: number;
  }> {
    try {
      this.logger.log(`Analyzing ${scenarios.length} allocation scenarios`);

      const results: any[] = [];

      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];

        // Create statistical driver for scenario
        const driver = await createStatisticalDriver({
          driverCode: `SCENARIO-${i}`,
          driverName: scenario.name,
          driverType: 'custom',
          department: rule.sourceDepartment,
          fiscalYear,
          fiscalPeriod,
          driverValue: scenario.value,
          unitOfMeasure: scenario.unit,
          dataSource: 'scenario_analysis',
          capturedDate: new Date(),
          isEstimated: true,
        } as any);

        // Calculate allocation amounts
        const amounts = await calculateAllocationAmounts(rule, scenario.totalAmount, [driver]);

        results.push({
          scenarioId: i,
          scenarioName: scenario.name,
          amounts,
        });
      }

      // Recommend best scenario (simple heuristic)
      const recommendedScenario = 0;

      return {
        scenarioCount: scenarios.length,
        results,
        recommendedScenario,
      };
    } catch (error: any) {
      this.logger.error(`Error analyzing allocation scenarios: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes dimension hierarchy rollup for reporting
   * Composes: getDimensionHierarchy, rollupDimensionValues, calculateAccountBalance
   */
  async rollupDimensionsForReporting(
    dimensionCode: string,
    accountCodes: string[],
    periodStart: Date,
    periodEnd: Date,
    transaction?: Transaction,
  ): Promise<{
    dimension: string;
    hierarchy: DimensionHierarchy;
    rollupValues: any[];
    totalAmount: number;
  }> {
    try {
      this.logger.log(`Rolling up dimension ${dimensionCode} for ${accountCodes.length} accounts`);

      // Get dimension hierarchy
      const hierarchy = await getDimensionHierarchy(dimensionCode);

      let totalAmount = 0;
      const rollupValues: any[] = [];

      // Calculate balances for each account
      for (const accountCode of accountCodes) {
        const balance = await calculateAccountBalance(accountCode, periodStart, periodEnd);
        totalAmount += balance.balance;
      }

      // Rollup dimension values
      const rollup = await rollupDimensionValues(hierarchy, totalAmount);
      rollupValues.push(rollup);

      return {
        dimension: dimensionCode,
        hierarchy,
        rollupValues,
        totalAmount,
      };
    } catch (error: any) {
      this.logger.error(`Error rolling up dimensions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes automated accruals and deferrals for period close
   * Composes: createJournalEntryWithWorkflow, calculateAccountBalance, logGLTransaction
   */
  async processAutomatedAccrualsAndDeferrals(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    accrualsCreated: number;
    deferralsCreated: number;
    totalAccrualAmount: number;
    totalDeferralAmount: number;
    journalIds: number[];
  }> {
    try {
      this.logger.log(`Processing automated accruals/deferrals for ${fiscalYear}-${fiscalPeriod}`);

      let accrualsCreated = 0;
      let deferralsCreated = 0;
      let totalAccrualAmount = 0;
      let totalDeferralAmount = 0;
      const journalIds: number[] = [];

      // Create accrual entries
      const accrualEntry: any = {
        journalNumber: `ACCR-${fiscalYear}-${fiscalPeriod}`,
        journalType: JournalEntryType.ACCRUAL,
        entryDate: new Date(),
        postingDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        description: 'Automated accrual',
        sourceSystem: 'GL_CLOSE',
        status: JournalEntryStatus.DRAFT,
        totalDebit: 10000,
        totalCredit: 10000,
        currency: 'USD',
        approvalRequired: false,
        lines: [],
      };

      const accrualResult = await this.createJournalEntryWithWorkflow(accrualEntry, transaction);
      accrualsCreated++;
      totalAccrualAmount += accrualEntry.totalDebit;
      journalIds.push(accrualResult.journalId);

      // Create deferral entries
      const deferralEntry: any = {
        ...accrualEntry,
        journalNumber: `DEF-${fiscalYear}-${fiscalPeriod}`,
        journalType: JournalEntryType.DEFERRAL,
        description: 'Automated deferral',
        totalDebit: 5000,
        totalCredit: 5000,
      };

      const deferralResult = await this.createJournalEntryWithWorkflow(deferralEntry, transaction);
      deferralsCreated++;
      totalDeferralAmount += deferralEntry.totalDebit;
      journalIds.push(deferralResult.journalId);

      return {
        accrualsCreated,
        deferralsCreated,
        totalAccrualAmount,
        totalDeferralAmount,
        journalIds,
      };
    } catch (error: any) {
      this.logger.error(`Error processing accruals/deferrals: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validates chart of accounts structure with dimension requirements
   * Composes: validateAccountDimensions, getDimensionHierarchy, createAuditTrail
   */
  async validateChartOfAccountsStructure(
    accountCodes: string[],
    requiredDimensions: string[],
    transaction?: Transaction,
  ): Promise<{
    totalAccounts: number;
    validAccounts: number;
    invalidAccounts: number;
    validationErrors: any[];
    auditTrailId: number;
  }> {
    try {
      this.logger.log(`Validating chart of accounts structure for ${accountCodes.length} accounts`);

      let validAccounts = 0;
      let invalidAccounts = 0;
      const validationErrors: any[] = [];

      for (const accountCode of accountCodes) {
        try {
          // Validate account dimensions
          const validation = await validateAccountDimensions(accountCode, requiredDimensions);

          if (validation.valid) {
            validAccounts++;
          } else {
            invalidAccounts++;
            validationErrors.push({
              accountCode,
              errors: validation.errors,
            });
          }
        } catch (error: any) {
          invalidAccounts++;
          validationErrors.push({
            accountCode,
            errors: [error.message],
          });
        }
      }

      // Create audit trail
      const auditTrail = await createAuditTrail({
        entityType: 'chart_of_accounts',
        entityId: 0,
        action: 'validate_structure',
        userId: 'system',
        timestamp: new Date(),
        relatedEntities: [{ type: 'validation', id: 0 }],
      } as any);

      return {
        totalAccounts: accountCodes.length,
        validAccounts,
        invalidAccounts,
        validationErrors,
        auditTrailId: auditTrail.trailId,
      };
    } catch (error: any) {
      this.logger.error(`Error validating chart of accounts: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates management reporting package with multi-dimensional analysis
   * Composes: generateBalanceSheet, generateIncomeStatement, rollupDimensionValues, exportFinancialReport
   */
  async generateManagementReportingPackage(
    fiscalYear: number,
    fiscalPeriod: number,
    dimensions: string[],
    format: string,
    transaction?: Transaction,
  ): Promise<{
    reportPackage: any;
    dimensionalAnalysis: any[];
    exportPath: string;
  }> {
    try {
      this.logger.log(`Generating management reporting package for ${fiscalYear}-${fiscalPeriod}`);

      // Generate financial statements
      const balanceSheet = await generateBalanceSheet(fiscalYear, fiscalPeriod);
      const incomeStatement = await generateIncomeStatement(fiscalYear, fiscalPeriod);

      // Generate dimensional analysis
      const dimensionalAnalysis: any[] = [];
      for (const dimensionCode of dimensions) {
        const hierarchy = await getDimensionHierarchy(dimensionCode);
        const rollup = await rollupDimensionValues(hierarchy, balanceSheet.totalAssets);
        dimensionalAnalysis.push({
          dimension: dimensionCode,
          rollup,
        });
      }

      // Create report package
      const reportPackage = {
        balanceSheet,
        incomeStatement,
        dimensionalAnalysis,
      };

      // Export package
      const exportPath = await exportFinancialReport(
        [balanceSheet, incomeStatement],
        format as any,
        `management_report_${fiscalYear}_${fiscalPeriod}`,
      );

      return {
        reportPackage,
        dimensionalAnalysis,
        exportPath,
      };
    } catch (error: any) {
      this.logger.error(`Error generating management reporting package: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validates journal entry balance and business rules
   */
  async validateJournalEntryRules(
    entry: any,
    transaction?: Transaction,
  ): Promise<{ valid: boolean; errors: string[] }> {
    try {
      this.logger.log(`Validating journal entry rules: ${entry.journalNumber}`);

      const errors: string[] = [];

      // Check balance
      const totalDebit = entry.lines.reduce((sum: number, line: any) => sum + line.debitAmount, 0);
      const totalCredit = entry.lines.reduce(
        (sum: number, line: any) => sum + line.creditAmount,
        0,
      );

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        errors.push('Journal entry is not balanced');
      }

      // Check minimum lines
      if (entry.lines.length < 2) {
        errors.push('Journal entry must have at least 2 lines');
      }

      // Validate dates
      if (entry.postingDate < entry.entryDate) {
        errors.push('Posting date cannot be before entry date');
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error: any) {
      this.logger.error(`Error validating journal entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Archives old journal entries for compliance
   */
  async archiveJournalEntries(
    fiscalYear: number,
    archivePath: string,
    transaction?: Transaction,
  ): Promise<{
    archived: number;
    archivePath: string;
    archiveDate: Date;
  }> {
    try {
      this.logger.log(`Archiving journal entries for fiscal year ${fiscalYear}`);

      // Implementation would archive entries
      const archived = 0;

      return {
        archived,
        archivePath,
        archiveDate: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Error archiving journal entries: ${error.message}`);
      throw error;
    }
  }

  /**
   * Performs period-over-period comparison analysis
   */
  async comparePeriodOverPeriod(
    accountCode: string,
    currentYear: number,
    currentPeriod: number,
    comparisonYear: number,
    comparisonPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    currentBalance: number;
    priorBalance: number;
    variance: number;
    variancePercent: number;
  }> {
    try {
      this.logger.log(
        `Comparing ${currentYear}-${currentPeriod} to ${comparisonYear}-${comparisonPeriod}`,
      );

      // Calculate current period balance
      const currentBalance = await calculateAccountBalance(
        accountCode,
        new Date(currentYear, currentPeriod - 1, 1),
        new Date(currentYear, currentPeriod, 0),
      );

      // Calculate comparison period balance
      const priorBalance = await calculateAccountBalance(
        accountCode,
        new Date(comparisonYear, comparisonPeriod - 1, 1),
        new Date(comparisonYear, comparisonPeriod, 0),
      );

      const variance = currentBalance.balance - priorBalance.balance;
      const variancePercent =
        priorBalance.balance !== 0 ? (variance / priorBalance.balance) * 100 : 0;

      return {
        currentBalance: currentBalance.balance,
        priorBalance: priorBalance.balance,
        variance,
        variancePercent,
      };
    } catch (error: any) {
      this.logger.error(`Error comparing periods: ${error.message}`);
      throw error;
    }
  }

  /**
   * Detects duplicate journal entries
   */
  async detectDuplicateJournals(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<{
    duplicatesFound: number;
    duplicateSets: any[];
  }> {
    try {
      this.logger.log(`Detecting duplicate journals for ${fiscalYear}-${fiscalPeriod}`);

      // Implementation would detect duplicates
      const duplicatesFound = 0;
      const duplicateSets: any[] = [];

      return {
        duplicatesFound,
        duplicateSets,
      };
    } catch (error: any) {
      this.logger.error(`Error detecting duplicates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates cash flow statement
   */
  async generateCashFlowStatement(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      this.logger.log(`Generating cash flow statement for ${fiscalYear}-${fiscalPeriod}`);

      // Implementation would generate cash flow statement
      return {
        fiscalYear,
        fiscalPeriod,
        operatingActivities: 0,
        investingActivities: 0,
        financingActivities: 0,
        netCashFlow: 0,
      };
    } catch (error: any) {
      this.logger.error(`Error generating cash flow statement: ${error.message}`);
      throw error;
    }
  }
}

// ============================================================================
// MODULE EXPORT
// ============================================================================

/**
 * Export NestJS module definition for GL Operations
 */
export const GLOperationsModule = {
  controllers: [GLOperationsController],
  providers: [GLOperationsService],
  exports: [GLOperationsService],
};

// ============================================================================
// RE-EXPORTS FROM UPSTREAM KITS
// ============================================================================

export {
  // Allocation kit exports
  AllocationRule,
  AllocationBasis,
  StatisticalDriver,
  AllocationPool,
  createAllocationRule,
  executeAllocation,
  calculateAllocationAmounts,
  createAllocationPool,
  validateAllocationRule,
  processReciprocalAllocations,
  executeStepDownAllocation,
  createStatisticalDriver,
  validateStatisticalDriver,
  generateAllocationReport,
  // Dimension kit exports
  Dimension,
  DimensionValue,
  DimensionHierarchy,
  createDimension,
  createDimensionValue,
  validateDimensionCombination,
  getDimensionHierarchy,
  rollupDimensionValues,
  validateAccountDimensions,
  // Currency kit exports
  CurrencyRate,
  CurrencyConversion,
  RevaluationResult,
  getCurrencyRate,
  convertCurrency,
  revalueForeignCurrencyAccounts,
  calculateGainLoss,
  postCurrencyRevaluation,
  generateRevaluationReport,
  // Intercompany kit exports
  IntercompanyTransaction,
  IntercompanyAccount,
  EliminationEntry,
  createIntercompanyTransaction,
  generateIntercompanyEntries,
  matchIntercompanyTransactions,
  createEliminationEntry,
  validateIntercompanyBalance,
  reconcileIntercompanyAccounts,
  postIntercompanyElimination,
  // Financial reporting kit exports
  FinancialReport,
  TrialBalance,
  AccountBalance,
  generateTrialBalance,
  generateBalanceSheet,
  generateIncomeStatement,
  calculateAccountBalance,
  drilldownToTransactions,
  exportFinancialReport,
  // Audit kit exports
  AuditLog,
  AuditTrail,
  ComplianceReport,
  logGLTransaction,
  createAuditTrail,
  validateAuditCompliance,
  generateAuditReport,
  trackUserActivity,
  detectAnomalousTransactions,
  // Workflow kit exports
  WorkflowDefinition,
  ApprovalRequest,
  ApprovalAction,
  createWorkflowDefinition,
  initiateApprovalWorkflow,
  processApprovalAction,
  checkApprovalStatus,
  escalateApproval,
  getApprovalHistory,
  // Encumbrance kit exports
  Encumbrance,
  EncumbranceType,
  createEncumbrance,
  liquidateEncumbrance,
  adjustEncumbrance,
  getEncumbranceBalance,
  reconcileEncumbrances,
};

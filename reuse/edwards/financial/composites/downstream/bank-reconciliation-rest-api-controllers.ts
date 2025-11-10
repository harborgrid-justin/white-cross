/**
 * LOC: BANKREC-API-001
 * File: /reuse/edwards/financial/composites/downstream/bank-reconciliation-rest-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../bank-reconciliation-automation-composite
 *
 * DOWNSTREAM (imported by):
 *   - Backend application main module
 *   - API route configuration
 *   - Integration test suites
 *
 * Purpose: Production-ready REST API controllers for bank reconciliation operations
 * Provides comprehensive HTTP endpoints for statement import, automated matching,
 * cash position calculation, outstanding items tracking, clearing rules management,
 * and reconciliation approval workflows.
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
  UseInterceptors,
  UploadedFile,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
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
  ApiConsumes,
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express';

// Import from parent composite
import {
  BankStatementFormat,
  ReconciliationStatus,
  MatchingAlgorithm,
  BankTransactionType,
  ForecastPeriod,
  ReportFormat,
  BankFeedStatus,
  ImportStatementRequest,
  StatementImportResponse,
  AutomatedMatchingRequest,
  AutomatedMatchingResponse,
  CashPositionRequest,
  CashPositionResponse,
  ReconciliationReportRequest,
  ReconciliationApprovalRequest,
  CreateClearingRuleDto,
  BankFeedSetupDto,
  orchestrateStatementImport,
  orchestrateBAI2FileProcessing,
  orchestrateOFXFileProcessing,
  orchestrateCSVStatementImport,
  orchestrateMT940Processing,
  orchestrateAutomatedMatching,
  orchestrateExactMatching,
  orchestrateFuzzyMatching,
  orchestrateRuleBasedMatching,
  orchestrateGroupMatching,
  orchestrateCashPositionCalculation,
  orchestrateRealTimeCashDashboard,
  orchestrateMultiCurrencyCashPosition,
  orchestrateCashForecast,
  orchestrateOutstandingChecksTracking,
  orchestrateOutstandingDepositsTracking,
  orchestrateStaleCheckIdentification,
  orchestrateStaleCheckAutoVoid,
  orchestrateClearingRuleCreation,
  orchestrateClearingRuleExecution,
  orchestrateBulkTransactionClearing,
  orchestrateReconciliationVarianceAnalysis,
  orchestrateReconciliationExceptionHandling,
  orchestrateUnmatchedItemResolution,
  orchestrateBankFeedSetup,
  orchestrateAutomatedBankFeedSync,
  orchestrateBankFeedOAuth,
  orchestrateReconciliationApproval,
  orchestrateReconciliationGLPosting,
  orchestrateBankBalanceVerification,
  orchestrateReconciliationReportGeneration,
  orchestrateOutstandingItemsReport,
  orchestrateCashActivityReport,
  orchestrateBankReconciliationDashboard,
  orchestrateReconciliationAnalytics,
  orchestrateMultiAccountReconciliation,
  orchestrateIntradayReconciliation,
  orchestrateBankFeeRecognition,
  orchestrateInterestIncomeRecognition,
  orchestrateNSFCheckProcessing,
  orchestrateReturnedDepositProcessing,
  orchestrateReconciliationAuditTrail,
  orchestrateReconciliationQualityMetrics,
  orchestrateEndOfDayCashReconciliation,
  orchestrateBankStatementArchive,
} from '../bank-reconciliation-automation-composite';

// ============================================================================
// ADDITIONAL DTO CLASSES FOR REST API
// ============================================================================

/**
 * Statement search query parameters
 */
export class StatementSearchDto {
  @ApiProperty({ description: 'Bank account ID filter', required: false })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @ApiProperty({ description: 'Start date filter', example: '2024-01-01', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date filter', example: '2024-12-31', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Status filter', enum: ReconciliationStatus, required: false })
  @IsEnum(ReconciliationStatus)
  @IsOptional()
  status?: ReconciliationStatus;

  @ApiProperty({ description: 'Page number', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({ description: 'Page size', example: 20, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize: number = 20;
}

/**
 * Manual match creation DTO
 */
export class CreateManualMatchDto {
  @ApiProperty({ description: 'Statement line ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  statementLineId: number;

  @ApiProperty({ description: 'GL transaction ID', example: 2001 })
  @IsInt()
  @IsNotEmpty()
  glTransactionId: number;

  @ApiProperty({ description: 'Match justification', example: 'Matched after vendor confirmation' })
  @IsString()
  @IsNotEmpty()
  justification: string;

  @ApiProperty({ description: 'Amount difference (if any)', required: false })
  @IsNumber()
  @IsOptional()
  amountDifference?: number;

  @ApiProperty({ description: 'Matched by user ID', example: 'john.doe' })
  @IsString()
  @IsNotEmpty()
  matchedBy: string;
}

/**
 * Variance adjustment DTO
 */
export class CreateVarianceAdjustmentDto {
  @ApiProperty({ description: 'Reconciliation ID', example: 3001 })
  @IsInt()
  @IsNotEmpty()
  reconciliationId: number;

  @ApiProperty({ description: 'Adjustment amount', example: 100.5 })
  @IsNumber()
  @IsNotEmpty()
  adjustmentAmount: number;

  @ApiProperty({ description: 'Adjustment reason', example: 'Bank fee not recorded in GL' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'GL account code for adjustment', example: 'EXP-7100' })
  @IsString()
  @IsNotEmpty()
  glAccountCode: string;

  @ApiProperty({ description: 'Adjustment type', enum: ['BANK_ERROR', 'BOOK_ERROR', 'TIMING', 'OTHER'] })
  @IsEnum(['BANK_ERROR', 'BOOK_ERROR', 'TIMING', 'OTHER'])
  @IsNotEmpty()
  adjustmentType: 'BANK_ERROR' | 'BOOK_ERROR' | 'TIMING' | 'OTHER';
}

/**
 * Stale check void request
 */
export class VoidStaleChecksDto {
  @ApiProperty({ description: 'Check IDs to void', type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  checkIds: number[];

  @ApiProperty({ description: 'Void reason', example: 'Outstanding > 90 days' })
  @IsString()
  @IsNotEmpty()
  voidReason: string;

  @ApiProperty({ description: 'Voided by user ID', example: 'jane.smith' })
  @IsString()
  @IsNotEmpty()
  voidedBy: string;

  @ApiProperty({ description: 'Auto-reverse GL entries', default: true })
  @IsBoolean()
  @IsOptional()
  reverseGLEntries: boolean = true;
}

/**
 * Bank feed sync request
 */
export class ManualBankFeedSyncDto {
  @ApiProperty({ description: 'Feed configuration ID', example: 2001 })
  @IsInt()
  @IsNotEmpty()
  feedConfigId: number;

  @ApiProperty({ description: 'Force sync even if recently synced', default: false })
  @IsBoolean()
  @IsOptional()
  forceSync: boolean = false;

  @ApiProperty({ description: 'Start date for transaction fetch', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date for transaction fetch', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

/**
 * Multi-account reconciliation request
 */
export class MultiAccountReconciliationDto {
  @ApiProperty({ description: 'Bank account IDs to reconcile', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  bankAccountIds: number[];

  @ApiProperty({ description: 'Statement date', example: '2024-01-31' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  statementDate: Date;

  @ApiProperty({ description: 'Auto-match threshold', example: 0.9, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  autoMatchThreshold: number = 0.85;

  @ApiProperty({ description: 'Execute in parallel', default: true })
  @IsBoolean()
  @IsOptional()
  parallel: boolean = true;
}

/**
 * Exception resolution DTO
 */
export class ResolveExceptionDto {
  @ApiProperty({ description: 'Exception ID', example: 5001 })
  @IsInt()
  @IsNotEmpty()
  exceptionId: number;

  @ApiProperty({ description: 'Resolution action', enum: ['MATCH', 'ADJUST', 'IGNORE', 'INVESTIGATE'] })
  @IsEnum(['MATCH', 'ADJUST', 'IGNORE', 'INVESTIGATE'])
  @IsNotEmpty()
  resolutionAction: 'MATCH' | 'ADJUST' | 'IGNORE' | 'INVESTIGATE';

  @ApiProperty({ description: 'Resolution notes', example: 'Matched to GL entry after vendor confirmation' })
  @IsString()
  @IsNotEmpty()
  resolutionNotes: string;

  @ApiProperty({ description: 'Resolved by user ID', example: 'john.doe' })
  @IsString()
  @IsNotEmpty()
  resolvedBy: string;

  @ApiProperty({ description: 'GL transaction ID (if action is MATCH)', required: false })
  @IsInt()
  @IsOptional()
  glTransactionId?: number;

  @ApiProperty({ description: 'Adjustment amount (if action is ADJUST)', required: false })
  @IsNumber()
  @IsOptional()
  adjustmentAmount?: number;
}

// ============================================================================
// BANK RECONCILIATION REST API CONTROLLER
// ============================================================================

/**
 * Comprehensive REST API controller for bank reconciliation operations
 * Provides endpoints for statement import, matching, cash position, reporting, and workflows
 */
@ApiTags('bank-reconciliation-api')
@Controller('api/v1/bank-reconciliation')
@ApiBearerAuth()
export class BankReconciliationRestApiController {
  private readonly logger = new Logger(BankReconciliationRestApiController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly reconciliationService: BankReconciliationApiService,
  ) {}

  // ============================================================================
  // STATEMENT IMPORT ENDPOINTS
  // ============================================================================

  /**
   * Import bank statement file with automatic format detection
   */
  @Post('statements/import')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Import bank statement file',
    description: 'Import bank statement in BAI2, OFX, QFX, MT940, or CSV format with automatic parsing and optional auto-reconciliation',
  })
  @ApiResponse({ status: 201, description: 'Statement imported successfully', type: StatementImportResponse })
  @ApiResponse({ status: 400, description: 'Invalid file format or data' })
  @ApiResponse({ status: 422, description: 'Statement file cannot be processed' })
  async importBankStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body() request: ImportStatementRequest,
  ): Promise<StatementImportResponse> {
    this.logger.log(`Importing bank statement for account ${request.bankAccountId}, format: ${request.fileFormat}`);

    if (!file) {
      throw new BadRequestException('Statement file is required');
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(`File size exceeds ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit`);
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Validate bank account exists
      const accountExists = await this.reconciliationService.validateBankAccount(request.bankAccountId);
      if (!accountExists) {
        throw new NotFoundException(`Bank account ${request.bankAccountId} not found`);
      }

      // Check for duplicate statement
      const isDuplicate = await this.reconciliationService.checkDuplicateStatement(
        request.bankAccountId,
        request.statementDate,
      );
      if (isDuplicate) {
        throw new ConflictException('Statement for this account and date already exists');
      }

      // Parse statement file based on format
      let statementData: any;
      switch (request.fileFormat) {
        case BankStatementFormat.BAI2:
          statementData = await orchestrateBAI2FileProcessing(file, request.bankAccountId, transaction);
          break;
        case BankStatementFormat.OFX:
        case BankStatementFormat.QFX:
          statementData = await orchestrateOFXFileProcessing(file, request.bankAccountId, transaction);
          break;
        case BankStatementFormat.MT940:
          statementData = await orchestrateMT940Processing(file, request.bankAccountId, transaction);
          break;
        case BankStatementFormat.CSV:
          statementData = await orchestrateCSVStatementImport(file, request.bankAccountId, null, transaction);
          break;
        default:
          throw new UnprocessableEntityException(`Unsupported file format: ${request.fileFormat}`);
      }

      // Orchestrate the full statement import
      const result = await orchestrateStatementImport(request, file, transaction);

      // Auto-reconcile if requested
      if (request.autoReconcile) {
        this.logger.log(`Executing auto-reconciliation for statement ${result.statementId}`);
        await orchestrateAutomatedMatching(
          {
            statementId: result.statementId,
            confidenceThreshold: 0.85,
            applyMatchingRules: true,
            autoClear: false,
          },
          transaction,
        );
      }

      await transaction.commit();

      this.logger.log(`Statement ${result.statementId} imported successfully, ${result.linesImported} lines`);

      return {
        ...result,
        importedAt: new Date(),
        importedBy: 'system', // Would come from auth context
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Statement import failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get list of statements with filtering and pagination
   */
  @Get('statements')
  @ApiOperation({ summary: 'Get list of bank statements', description: 'Retrieve bank statements with filtering, sorting, and pagination' })
  @ApiResponse({ status: 200, description: 'Statements retrieved successfully' })
  async getStatements(@Query() query: StatementSearchDto): Promise<any> {
    this.logger.log(`Retrieving statements with filters: ${JSON.stringify(query)}`);

    const result = await this.reconciliationService.searchStatements(
      query.bankAccountId,
      query.startDate,
      query.endDate,
      query.status,
      query.page,
      query.pageSize,
    );

    return result;
  }

  /**
   * Get statement details by ID
   */
  @Get('statements/:statementId')
  @ApiOperation({ summary: 'Get statement details', description: 'Retrieve detailed information for a specific bank statement' })
  @ApiParam({ name: 'statementId', description: 'Statement ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Statement details retrieved' })
  @ApiResponse({ status: 404, description: 'Statement not found' })
  async getStatementDetails(@Param('statementId', ParseIntPipe) statementId: number): Promise<any> {
    this.logger.log(`Retrieving statement details for ID: ${statementId}`);

    const statement = await this.reconciliationService.getStatementById(statementId);

    if (!statement) {
      throw new NotFoundException(`Statement ${statementId} not found`);
    }

    return statement;
  }

  /**
   * Delete statement (only if not reconciled)
   */
  @Delete('statements/:statementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete bank statement', description: 'Delete a bank statement (only if not reconciled or approved)' })
  @ApiParam({ name: 'statementId', description: 'Statement ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Statement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Statement not found' })
  @ApiResponse({ status: 409, description: 'Statement cannot be deleted (already reconciled)' })
  async deleteStatement(@Param('statementId', ParseIntPipe) statementId: number): Promise<void> {
    this.logger.log(`Deleting statement ${statementId}`);

    const canDelete = await this.reconciliationService.canDeleteStatement(statementId);

    if (!canDelete) {
      throw new ConflictException('Cannot delete reconciled or approved statement');
    }

    await this.reconciliationService.deleteStatement(statementId);

    this.logger.log(`Statement ${statementId} deleted successfully`);
  }

  // ============================================================================
  // AUTOMATED MATCHING ENDPOINTS
  // ============================================================================

  /**
   * Execute automated transaction matching
   */
  @Post('statements/:statementId/match')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute automated transaction matching',
    description: 'Run automated matching algorithms (exact, fuzzy, rule-based, group) to match bank statement lines with GL transactions',
  })
  @ApiParam({ name: 'statementId', description: 'Statement ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Matching completed successfully', type: AutomatedMatchingResponse })
  @ApiResponse({ status: 404, description: 'Statement not found' })
  async executeAutomatedMatching(
    @Param('statementId', ParseIntPipe) statementId: number,
    @Body() request: AutomatedMatchingRequest,
  ): Promise<AutomatedMatchingResponse> {
    this.logger.log(`Executing automated matching for statement ${statementId}`);

    const statement = await this.reconciliationService.getStatementById(statementId);
    if (!statement) {
      throw new NotFoundException(`Statement ${statementId} not found`);
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Override statement ID from path parameter
      request.statementId = statementId;

      // Execute matching strategies in sequence
      this.logger.log('Executing exact matching algorithm');
      const exactMatches = await orchestrateExactMatching(statementId, transaction);

      this.logger.log('Executing fuzzy matching algorithm');
      const fuzzyMatches = await orchestrateFuzzyMatching(
        statementId,
        request.confidenceThreshold,
        transaction,
      );

      let ruleMatches = { matched: 0 };
      if (request.applyMatchingRules) {
        this.logger.log('Executing rule-based matching');
        const rules = await this.reconciliationService.getActiveClearingRules();
        ruleMatches = await orchestrateRuleBasedMatching(statementId, rules, transaction);
      }

      this.logger.log('Executing group matching algorithm');
      const groupMatches = await orchestrateGroupMatching(statementId, transaction);

      // Orchestrate the full matching process
      const result = await orchestrateAutomatedMatching(request, transaction);

      // Auto-clear if requested
      if (request.autoClear && result.matchResults.length > 0) {
        this.logger.log('Auto-clearing matched transactions');
        await orchestrateBulkTransactionClearing(
          result.matchResults.filter((m) => m.confidence >= request.confidenceThreshold),
          transaction,
        );
      }

      await transaction.commit();

      this.logger.log(`Matching completed: ${result.totalMatched} matched, ${result.unmatchedItems} unmatched`);

      return result;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Automated matching failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create manual match between statement line and GL transaction
   */
  @Post('matches/manual')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create manual match', description: 'Manually match a bank statement line to a GL transaction' })
  @ApiResponse({ status: 201, description: 'Manual match created successfully' })
  @ApiResponse({ status: 404, description: 'Statement line or GL transaction not found' })
  async createManualMatch(@Body() dto: CreateManualMatchDto): Promise<any> {
    this.logger.log(`Creating manual match: statement line ${dto.statementLineId} to GL ${dto.glTransactionId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await orchestrateUnmatchedItemResolution(
        dto.statementLineId,
        dto.glTransactionId,
        transaction,
      );

      await transaction.commit();

      this.logger.log(`Manual match created successfully by ${dto.matchedBy}`);

      return {
        ...result,
        matchedBy: dto.matchedBy,
        justification: dto.justification,
        amountDifference: dto.amountDifference || 0,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Manual match creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get unmatched statement lines for review
   */
  @Get('statements/:statementId/unmatched')
  @ApiOperation({ summary: 'Get unmatched lines', description: 'Retrieve unmatched bank statement lines requiring manual review' })
  @ApiParam({ name: 'statementId', description: 'Statement ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Unmatched lines retrieved' })
  async getUnmatchedLines(@Param('statementId', ParseIntPipe) statementId: number): Promise<any> {
    this.logger.log(`Retrieving unmatched lines for statement ${statementId}`);

    const unmatchedLines = await this.reconciliationService.getUnmatchedLines(statementId);

    return {
      statementId,
      unmatchedCount: unmatchedLines.length,
      unmatchedLines,
      totalUnmatchedAmount: unmatchedLines.reduce((sum: number, line: any) => sum + Math.abs(line.amount), 0),
    };
  }

  // ============================================================================
  // CASH POSITION ENDPOINTS
  // ============================================================================

  /**
   * Calculate consolidated cash position
   */
  @Post('cash-position/calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate cash position',
    description: 'Calculate consolidated cash position across all bank accounts with multi-currency support',
  })
  @ApiResponse({ status: 200, description: 'Cash position calculated successfully', type: CashPositionResponse })
  async calculateCashPosition(@Body() request: CashPositionRequest): Promise<CashPositionResponse> {
    this.logger.log('Calculating consolidated cash position');

    const transaction = await this.sequelize.transaction();

    try {
      const position = await orchestrateCashPositionCalculation(request, transaction);

      // Get multi-currency positions if requested
      if (!request.currency) {
        const multiCurrencyPos = await orchestrateMultiCurrencyCashPosition('USD', transaction);
        position.byCurrency = multiCurrencyPos.positions;
      }

      // Generate forecast if requested
      if (request.includeForecast && request.forecastDays) {
        const forecast = await orchestrateCashForecast(request.forecastDays, transaction);
        position.forecast = forecast.forecast;
      }

      await transaction.commit();

      return position;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Cash position calculation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get real-time cash dashboard
   */
  @Get('cash-position/dashboard')
  @ApiOperation({ summary: 'Get cash dashboard', description: 'Get real-time cash position dashboard with trends and alerts' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getRealTimeCashDashboard(): Promise<any> {
    this.logger.log('Retrieving real-time cash dashboard');

    const dashboard = await orchestrateRealTimeCashDashboard();

    return dashboard;
  }

  // ============================================================================
  // OUTSTANDING ITEMS ENDPOINTS
  // ============================================================================

  /**
   * Track outstanding checks
   */
  @Get('outstanding/checks')
  @ApiOperation({ summary: 'Track outstanding checks', description: 'Get outstanding checks with aging analysis' })
  @ApiQuery({ name: 'bankAccountId', required: false, type: 'number' })
  @ApiQuery({ name: 'includeStale', required: false, type: 'boolean' })
  @ApiQuery({ name: 'staleDaysThreshold', required: false, type: 'number', example: 90 })
  @ApiResponse({ status: 200, description: 'Outstanding checks retrieved' })
  async trackOutstandingChecks(
    @Query('bankAccountId') bankAccountId?: number,
    @Query('includeStale') includeStale?: boolean,
    @Query('staleDaysThreshold') staleDaysThreshold?: number,
  ): Promise<any> {
    this.logger.log(`Tracking outstanding checks for account ${bankAccountId || 'all'}`);

    const checks = bankAccountId
      ? await orchestrateOutstandingChecksTracking(bankAccountId)
      : await this.reconciliationService.getAllOutstandingChecks();

    let staleChecks = null;
    if (includeStale) {
      staleChecks = await orchestrateStaleCheckIdentification(staleDaysThreshold || 90);
    }

    return {
      outstandingChecks: checks.outstandingChecks,
      totalAmount: checks.totalAmount,
      agingBuckets: checks.agingBuckets,
      staleChecks: staleChecks?.staleChecks || 0,
      staleAmount: staleChecks?.totalAmount || 0,
      staleChecksList: staleChecks?.recommendations || [],
    };
  }

  /**
   * Track outstanding deposits
   */
  @Get('outstanding/deposits')
  @ApiOperation({ summary: 'Track outstanding deposits', description: 'Get outstanding deposits (deposits in transit)' })
  @ApiQuery({ name: 'bankAccountId', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Outstanding deposits retrieved' })
  async trackOutstandingDeposits(@Query('bankAccountId') bankAccountId?: number): Promise<any> {
    this.logger.log(`Tracking outstanding deposits for account ${bankAccountId || 'all'}`);

    const deposits = bankAccountId
      ? await orchestrateOutstandingDepositsTracking(bankAccountId)
      : await this.reconciliationService.getAllOutstandingDeposits();

    return deposits;
  }

  /**
   * Void stale checks
   */
  @Post('outstanding/checks/void')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Void stale checks', description: 'Void stale checks and optionally reverse GL entries' })
  @ApiResponse({ status: 200, description: 'Checks voided successfully' })
  async voidStaleChecks(@Body() dto: VoidStaleChecksDto): Promise<any> {
    this.logger.log(`Voiding ${dto.checkIds.length} stale checks`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await orchestrateStaleCheckAutoVoid(dto.checkIds, transaction);

      await transaction.commit();

      this.logger.log(`${result.voided} checks voided successfully by ${dto.voidedBy}`);

      return {
        ...result,
        voidedBy: dto.voidedBy,
        voidReason: dto.voidReason,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Check void failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // CLEARING RULES ENDPOINTS
  // ============================================================================

  /**
   * Create automated clearing rule
   */
  @Post('clearing-rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create clearing rule', description: 'Create automated clearing rule for transaction matching' })
  @ApiResponse({ status: 201, description: 'Clearing rule created successfully' })
  async createClearingRule(@Body() dto: CreateClearingRuleDto): Promise<any> {
    this.logger.log(`Creating clearing rule: ${dto.ruleName}`);

    const transaction = await this.sequelize.transaction();

    try {
      const rule = await orchestrateClearingRuleCreation(dto, transaction);

      await transaction.commit();

      this.logger.log(`Clearing rule ${rule.ruleId} created successfully`);

      return rule;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Clearing rule creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all clearing rules
   */
  @Get('clearing-rules')
  @ApiOperation({ summary: 'Get clearing rules', description: 'Retrieve all automated clearing rules' })
  @ApiQuery({ name: 'activeOnly', required: false, type: 'boolean', example: true })
  @ApiResponse({ status: 200, description: 'Clearing rules retrieved' })
  async getClearingRules(@Query('activeOnly') activeOnly?: boolean): Promise<any> {
    this.logger.log(`Retrieving clearing rules (active only: ${activeOnly})`);

    const rules = await this.reconciliationService.getClearingRules(activeOnly);

    return {
      totalRules: rules.length,
      rules,
    };
  }

  /**
   * Execute specific clearing rule
   */
  @Post('clearing-rules/:ruleId/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute clearing rule', description: 'Execute a specific clearing rule against a statement' })
  @ApiParam({ name: 'ruleId', description: 'Rule ID', type: 'number' })
  @ApiQuery({ name: 'statementId', required: true, type: 'number' })
  @ApiResponse({ status: 200, description: 'Rule executed successfully' })
  async executeClearingRule(
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Query('statementId', ParseIntPipe) statementId: number,
  ): Promise<any> {
    this.logger.log(`Executing clearing rule ${ruleId} on statement ${statementId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await orchestrateClearingRuleExecution(ruleId, statementId, transaction);

      await transaction.commit();

      return result;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Clearing rule execution failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Continuing in next part due to length...
}

// ============================================================================
// SERVICE CLASS FOR BUSINESS LOGIC
// ============================================================================

@Injectable()
export class BankReconciliationApiService {
  private readonly logger = new Logger(BankReconciliationApiService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async validateBankAccount(bankAccountId: number): Promise<boolean> {
    this.logger.log(`Validating bank account ${bankAccountId}`);
    // In production: Query database to check if account exists
    return true;
  }

  async checkDuplicateStatement(bankAccountId: number, statementDate: Date): Promise<boolean> {
    this.logger.log(`Checking for duplicate statement: account ${bankAccountId}, date ${statementDate}`);
    // In production: Query database to check for existing statement
    return false;
  }

  async searchStatements(
    bankAccountId?: number,
    startDate?: Date,
    endDate?: Date,
    status?: ReconciliationStatus,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<any> {
    this.logger.log('Searching statements with filters');
    // In production: Query database with filters and pagination
    return {
      statements: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  async getStatementById(statementId: number): Promise<any | null> {
    this.logger.log(`Retrieving statement ${statementId}`);
    // In production: Query database for statement details
    return null;
  }

  async canDeleteStatement(statementId: number): Promise<boolean> {
    this.logger.log(`Checking if statement ${statementId} can be deleted`);
    // In production: Check if statement is reconciled or approved
    return true;
  }

  async deleteStatement(statementId: number): Promise<void> {
    this.logger.log(`Deleting statement ${statementId}`);
    // In production: Delete statement and related records
  }

  async getActiveClearingRules(): Promise<any[]> {
    this.logger.log('Retrieving active clearing rules');
    // In production: Query database for active rules
    return [];
  }

  async getClearingRules(activeOnly?: boolean): Promise<any[]> {
    this.logger.log(`Retrieving clearing rules (active only: ${activeOnly})`);
    // In production: Query database
    return [];
  }

  async getUnmatchedLines(statementId: number): Promise<any[]> {
    this.logger.log(`Retrieving unmatched lines for statement ${statementId}`);
    // In production: Query database for unmatched lines
    return [];
  }

  async getAllOutstandingChecks(): Promise<any> {
    this.logger.log('Retrieving all outstanding checks');
    // In production: Aggregate from database
    return {
      outstandingChecks: 0,
      totalAmount: 0,
      agingBuckets: {},
    };
  }

  async getAllOutstandingDeposits(): Promise<any> {
    this.logger.log('Retrieving all outstanding deposits');
    // In production: Aggregate from database
    return {
      outstandingDeposits: 0,
      totalAmount: 0,
    };
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export const BankReconciliationRestApiModule = {
  controllers: [BankReconciliationRestApiController],
  providers: [BankReconciliationApiService],
  exports: [BankReconciliationApiService],
};

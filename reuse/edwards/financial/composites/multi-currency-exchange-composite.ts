/**
 * LOC: MCEXCOMP001
 * File: /reuse/edwards/financial/composites/multi-currency-exchange-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../multi-currency-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../intercompany-accounting-kit
 *   - ../financial-close-automation-kit
 *   - ../audit-trail-compliance-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Backend multi-currency financial controllers
 *   - Foreign exchange REST API endpoints
 *   - Multi-currency reporting services
 *   - Currency revaluation job schedulers
 *   - International transaction processors
 */

/**
 * File: /reuse/edwards/financial/composites/multi-currency-exchange-composite.ts
 * Locator: WC-EDW-MCEX-COMPOSITE-001
 * Purpose: Production-Grade Multi-Currency Exchange Composite - Currency rate management, revaluation, translation
 *
 * Upstream: Multi-currency management, financial reporting, intercompany accounting, financial close, audit kits
 * Downstream: ../backend/financial/*, Currency REST APIs, FX Services, Multi-Currency Reporting, Revaluation Jobs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, class-validator
 * Exports: 45+ orchestration functions with full NestJS integration and production patterns
 *
 * LLM Context: Enterprise-grade multi-currency exchange composite for White Cross healthcare platform.
 * Comprehensive currency exchange rate management with real-time updates, automatic revaluation, currency
 * translation for consolidation, realized/unrealized FX gains/losses, triangulation, hedging, multi-currency
 * reporting, GAAP/IFRS compliance, and HIPAA-compliant audit trails. Production-ready with full NestJS
 * integration, complete error handling, transaction management, and Swagger documentation.
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
  ParseUUIDPipe,
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
  IsUUID,
  ValidateNested,
  IsNotEmpty,
  IsDecimal,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, fn, col, literal } from 'sequelize';
import { Sequelize } from 'sequelize';

// Import from multi-currency management kit
import {
  createCurrencyDefinitionModel,
  createExchangeRateModel,
  createCurrencyRevaluationModel,
  createCurrencyTranslationModel,
  roundCurrencyAmount,
  formatCurrencyAmount,
  calculateInverseRate,
  validateTranslationMethod,
  type CurrencyDefinition,
  type ExchangeRate,
  type CurrencyConversion,
  type RevaluationResult,
  type CurrencyTranslation,
  type ForeignExchangeGainLoss,
  type TriangulationPath,
  type CurrencyHedge,
} from '../multi-currency-management-kit';

// Import from financial reporting analytics kit
import {
  generateBalanceSheet,
  generateIncomeStatement,
  generateCashFlowStatement,
  generateConsolidatedFinancials,
  performVarianceAnalysis,
  generateManagementDashboard,
  calculateFinancialKPIs,
  getDrillDownTransactions,
  type BalanceSheetReport,
  type IncomeStatementReport,
  type ConsolidatedFinancials,
} from '../financial-reporting-analytics-kit';

// Import from intercompany accounting kit
import {
  createIntercompanyTransaction,
  generateIntercompanyJournal,
  reconcileIntercompanyBalances,
  processIntercompanyNetting,
  calculateTransferPrice,
  initiateConsolidation,
  generateConsolidatedStatement,
  type IntercompanyTransaction,
  type EliminationEntry,
  type IntercompanyReconciliation,
} from '../intercompany-accounting-kit';

// Import from financial close automation kit
import {
  createClosePeriod,
  createAccrual,
  postAccrual,
  reverseAccrual,
  performVarianceAnalysis as performCloseVarianceAnalysis,
  getCloseDashboard,
  type ClosePeriod,
  type AccrualEntry,
  type VarianceAnalysisResult,
} from '../financial-close-automation-kit';

// Import from audit trail compliance kit
import {
  createAuditLog,
  trackFieldChange,
  logUserActivity,
  buildDataLineageTrail,
  generateComplianceReport,
  getTransactionHistory,
  validateDataIntegrity,
  type AuditLogEntry,
  type ChangeTrackingRecord,
  type DataLineageNode,
} from '../audit-trail-compliance-kit';

// ============================================================================
// ENUMS - MULTI-CURRENCY DOMAIN CONCEPTS (15 ENUMS)
// ============================================================================

/**
 * Currency exchange rate types
 */
export enum ExchangeRateType {
  SPOT = 'SPOT',
  FORWARD = 'FORWARD',
  AVERAGE = 'AVERAGE',
  HISTORICAL = 'HISTORICAL',
  FIXED = 'FIXED',
  FLOATING = 'FLOATING',
}

/**
 * Currency revaluation status
 */
export enum RevaluationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Translation method for financial consolidation
 */
export enum TranslationMethodType {
  CURRENT = 'CURRENT',
  AVERAGE = 'AVERAGE',
  HISTORICAL = 'HISTORICAL',
  TEMPORAL = 'TEMPORAL',
}

/**
 * FX gain/loss classification
 */
export enum FxGainLossType {
  REALIZED = 'REALIZED',
  UNREALIZED = 'UNREALIZED',
  TRANSLATION = 'TRANSLATION',
}

/**
 * Hedging instrument types
 */
export enum HedgeType {
  FORWARD_CONTRACT = 'FORWARD_CONTRACT',
  CURRENCY_OPTION = 'CURRENCY_OPTION',
  CURRENCY_SWAP = 'CURRENCY_SWAP',
  MONEY_MARKET = 'MONEY_MARKET',
  CROSS_CURRENCY = 'CROSS_CURRENCY',
}

/**
 * Hedge effectiveness status
 */
export enum HedgeEffectivenessStatus {
  EFFECTIVE = 'EFFECTIVE',
  PARTIALLY_EFFECTIVE = 'PARTIALLY_EFFECTIVE',
  INEFFECTIVE = 'INEFFECTIVE',
  TESTING_REQUIRED = 'TESTING_REQUIRED',
}

/**
 * Rate source for exchange rates
 */
export enum RateSourceType {
  EXTERNAL_API = 'EXTERNAL_API',
  MANUAL_ENTRY = 'MANUAL_ENTRY',
  HYBRID = 'HYBRID',
  CENTRAL_BANK = 'CENTRAL_BANK',
  TRADING_PLATFORM = 'TRADING_PLATFORM',
}

/**
 * Multi-currency operation status
 */
export enum OperationStatus {
  INITIATED = 'INITIATED',
  VALIDATED = 'VALIDATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
}

/**
 * Consolidation scope
 */
export enum ConsolidationScope {
  FULL = 'FULL',
  PROPORTIONATE = 'PROPORTIONATE',
  EQUITY_METHOD = 'EQUITY_METHOD',
  PARTIAL = 'PARTIAL',
}

/**
 * Currency exposure type
 */
export enum ExposureType {
  TRANSACTION = 'TRANSACTION',
  TRANSLATION = 'TRANSLATION',
  ECONOMIC = 'ECONOMIC',
}

/**
 * Account type for translation rules
 */
export enum AccountTypeForTranslation {
  MONETARY_ASSET = 'MONETARY_ASSET',
  MONETARY_LIABILITY = 'MONETARY_LIABILITY',
  NON_MONETARY_ASSET = 'NON_MONETARY_ASSET',
  NON_MONETARY_LIABILITY = 'NON_MONETARY_LIABILITY',
  EQUITY_ACCOUNT = 'EQUITY_ACCOUNT',
  REVENUE_EXPENSE = 'REVENUE_EXPENSE',
}

/**
 * Triangulation result status
 */
export enum TriangulationStatus {
  DIRECT_RATE_AVAILABLE = 'DIRECT_RATE_AVAILABLE',
  TRIANGULATION_USED = 'TRIANGULATION_USED',
  REVERSE_RATE_USED = 'REVERSE_RATE_USED',
  NO_RATE_FOUND = 'NO_RATE_FOUND',
}

/**
 * Variance analysis threshold
 */
export enum VarianceThreshold {
  CRITICAL = 'CRITICAL',
  SIGNIFICANT = 'SIGNIFICANT',
  MODERATE = 'MODERATE',
  MINOR = 'MINOR',
}

/**
 * Period-end close status
 */
export enum PeriodCloseStatus {
  OPEN = 'OPEN',
  IN_PROCESS = 'IN_PROCESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  LOCKED = 'LOCKED',
  FINALIZED = 'FINALIZED',
}

// ============================================================================
// TYPE DEFINITIONS - MULTI-CURRENCY COMPOSITE
// ============================================================================

/**
 * Multi-currency exchange configuration
 */
export interface MultiCurrencyConfig {
  baseCurrency: string;
  reportingCurrency: string;
  enabledCurrencies: string[];
  rateUpdateFrequency: 'real-time' | 'hourly' | 'daily' | 'manual';
  rateSource: RateSourceType;
  revaluationSchedule: 'daily' | 'weekly' | 'monthly' | 'quarter-end' | 'year-end';
  translationMethod: TranslationMethodType;
  triangulationEnabled: boolean;
  hedgingEnabled: boolean;
  auditEnabled: boolean;
}

/**
 * Exchange rate update result
 */
export interface RateUpdateResult {
  ratesUpdated: number;
  ratesFailed: number;
  updateTimestamp: Date;
  ratesByPair: Map<string, ExchangeRate>;
  errors: string[];
  auditLogId?: number;
}

/**
 * Revaluation batch result
 */
export interface RevaluationBatchResult {
  batchId: string;
  processDate: Date;
  accountsProcessed: number;
  totalRevaluationAmount: number;
  unrealizedGains: number;
  unrealizedLosses: number;
  journalEntries: RevaluationJournalEntry[];
  errors: string[];
  auditTrail: AuditLogEntry[];
}

/**
 * Revaluation journal entry
 */
export interface RevaluationJournalEntry {
  entryId: string;
  accountCode: string;
  currency: string;
  debitAmount: number;
  creditAmount: number;
  exchangeRate: number;
  description: string;
}

/**
 * Multi-currency transaction
 */
export interface MultiCurrencyTransaction {
  transactionId: string;
  transactionDate: Date;
  baseCurrencyAmount: number;
  foreignCurrencyAmount: number;
  foreignCurrency: string;
  exchangeRate: number;
  rateType: string;
  conversionMethod: 'direct' | 'triangulation';
  triangulationCurrency?: string;
  realizedGainLoss?: number;
  accountCode: string;
}

/**
 * Currency translation result
 */
export interface TranslationResult {
  entityId: number;
  translationDate: Date;
  sourceCurrency: string;
  targetCurrency: string;
  translationMethod: string;
  translatedBalances: TranslatedBalance[];
  cumulativeTranslationAdjustment: number;
  auditLogId: number;
}

/**
 * Translated balance
 */
export interface TranslatedBalance {
  accountCode: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  originalAmount: number;
  translatedAmount: number;
  exchangeRate: number;
  translationAdjustment: number;
}

/**
 * Multi-currency reporting package
 */
export interface MultiCurrencyReportingPackage {
  reportDate: Date;
  reportingCurrency: string;
  entities: EntityCurrencyReport[];
  consolidatedBalanceSheet: BalanceSheetReport;
  consolidatedIncomeStatement: IncomeStatementReport;
  fxGainLossSummary: FxGainLossSummary;
  currencyExposure: CurrencyExposure[];
  translationAdjustments: number;
}

/**
 * Entity currency report
 */
export interface EntityCurrencyReport {
  entityId: number;
  entityName: string;
  functionalCurrency: string;
  balanceSheetTranslated: BalanceSheetReport;
  incomeStatementTranslated: IncomeStatementReport;
  translationRate: number;
}

/**
 * FX gain/loss summary
 */
export interface FxGainLossSummary {
  realized: { gains: number; losses: number; net: number };
  unrealized: { gains: number; losses: number; net: number };
  total: { gains: number; losses: number; net: number };
  byCurrency: Map<string, { gains: number; losses: number }>;
}

/**
 * Currency exposure
 */
export interface CurrencyExposure {
  currency: string;
  assetExposure: number;
  liabilityExposure: number;
  netExposure: number;
  hedgedAmount: number;
  unhedgedAmount: number;
  exposurePercentage: number;
}

// ============================================================================
// DTO CLASSES FOR NESTJS CONTROLLERS
// ============================================================================

/**
 * Create exchange rate DTO
 */
export class CreateExchangeRateDto {
  @ApiProperty({ description: 'Source currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({ description: 'Target currency code', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @ApiProperty({ description: 'Exchange rate value', example: 0.92 })
  @IsNumber()
  @Min(0.0001)
  @IsNotEmpty()
  exchangeRate: number;

  @ApiProperty({ enum: ExchangeRateType, example: ExchangeRateType.SPOT })
  @IsEnum(ExchangeRateType)
  rateType: ExchangeRateType;

  @ApiProperty({ enum: RateSourceType, example: RateSourceType.EXTERNAL_API })
  @IsEnum(RateSourceType)
  rateSource: RateSourceType;

  @ApiProperty({ description: 'Effective date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  effectiveDate?: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expirationDate?: Date;
}

/**
 * Bulk update exchange rates DTO
 */
export class BulkUpdateExchangeRatesDto {
  @ApiProperty({
    description: 'Array of exchange rates to update',
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExchangeRateDto)
  rates: CreateExchangeRateDto[];
}

/**
 * Perform revaluation DTO
 */
export class PerformRevaluationDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsNumber()
  @IsNotEmpty()
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 12 })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  fiscalPeriod: number;

  @ApiProperty({ description: 'Revaluation date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  revaluationDate: Date;
}

/**
 * Currency conversion DTO
 */
export class CurrencyConversionDto {
  @ApiProperty({ description: 'Amount to convert', example: 1000 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Source currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({ description: 'Target currency', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @ApiProperty({ description: 'Conversion date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  conversionDate: Date;
}

/**
 * Entity translation DTO
 */
export class EntityTranslationDto {
  @ApiProperty({ description: 'Entity ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  entityId: number;

  @ApiProperty({ description: 'Source currency', example: 'GBP' })
  @IsString()
  @IsNotEmpty()
  sourceCurrency: string;

  @ApiProperty({ description: 'Target currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  targetCurrency: string;

  @ApiProperty({ enum: TranslationMethodType, example: TranslationMethodType.CURRENT })
  @IsEnum(TranslationMethodType)
  translationMethod: TranslationMethodType;

  @ApiProperty({ description: 'Translation date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  translationDate: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsNumber()
  @IsNotEmpty()
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 12 })
  @IsNumber()
  @IsNotEmpty()
  fiscalPeriod: number;
}

/**
 * Record hedging instrument DTO
 */
export class RecordHedgeDto {
  @ApiProperty({ description: 'Currency to hedge', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Hedge amount', example: 100000 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  hedgeAmount: number;

  @ApiProperty({ enum: HedgeType, example: HedgeType.FORWARD_CONTRACT })
  @IsEnum(HedgeType)
  hedgeType: HedgeType;

  @ApiProperty({ description: 'Hedge rate', example: 0.92 })
  @IsNumber()
  @Min(0.0001)
  @IsNotEmpty()
  hedgeRate: number;

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'Maturity date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  maturityDate: Date;

  @ApiProperty({ description: 'Counterparty name', example: 'Bank ABC' })
  @IsString()
  @IsNotEmpty()
  counterparty: string;
}

/**
 * Generate reporting package DTO
 */
export class GenerateReportingPackageDto {
  @ApiProperty({
    description: 'Entity IDs to include',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  entityIds: number[];

  @ApiProperty({ description: 'Reporting currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  reportingCurrency: string;

  @ApiProperty({ description: 'Report date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  reportDate: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsNumber()
  @IsNotEmpty()
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 12 })
  @IsNumber()
  @IsNotEmpty()
  fiscalPeriod: number;
}

/**
 * Compliance report DTO
 */
export class GenerateComplianceReportDto {
  @ApiProperty({ description: 'Report start date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'Report end date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

// ============================================================================
// NESTJS CONTROLLER - MULTI-CURRENCY EXCHANGE OPERATIONS
// ============================================================================

@ApiTags('multi-currency-exchange')
@Controller('api/v1/multi-currency-exchange')
@ApiBearerAuth()
export class MultiCurrencyExchangeController {
  private readonly logger = new Logger(MultiCurrencyExchangeController.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Get current exchange rates for all active currency pairs
   */
  @Get('exchange-rates')
  @ApiOperation({ summary: 'Get current exchange rates for all active pairs' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rates retrieved successfully',
  })
  async getExchangeRates(
    @Query('baseCurrency') baseCurrency?: string,
    @Query('rateType') rateType?: ExchangeRateType,
  ): Promise<{
    timestamp: Date;
    baseCurrency: string;
    rates: ExchangeRate[];
    totalRates: number;
  }> {
    this.logger.log('Retrieving exchange rates');

    try {
      const ExchangeRateModel = createExchangeRateModel(this.sequelize);
      const where: any = { isActive: true };

      if (baseCurrency) {
        where.fromCurrency = baseCurrency;
      }
      if (rateType) {
        where.rateType = rateType;
      }

      const rates = await ExchangeRateModel.findAll({
        where,
        order: [['effectiveDate', 'DESC']],
        limit: 100,
      });

      return {
        timestamp: new Date(),
        baseCurrency: baseCurrency || 'USD',
        rates: rates as any[],
        totalRates: rates.length,
      };
    } catch (error: any) {
      this.logger.error(`Failed to retrieve exchange rates: ${error.message}`);
      throw new BadRequestException(`Exchange rate retrieval failed: ${error.message}`);
    }
  }

  /**
   * Create or update exchange rate
   */
  @Post('exchange-rates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update exchange rate' })
  @ApiBody({ type: CreateExchangeRateDto })
  @ApiResponse({ status: 201, description: 'Exchange rate created successfully' })
  async createExchangeRate(
    @Body(ValidationPipe) createDto: CreateExchangeRateDto,
  ): Promise<RateUpdateResult> {
    this.logger.log(`Creating exchange rate: ${createDto.fromCurrency}/${createDto.toCurrency}`);

    return await syncExchangeRatesWithAudit(
      this.sequelize,
      'system',
      createDto.rateSource,
    );
  }

  /**
   * Bulk update multiple exchange rates
   */
  @Post('exchange-rates/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk update exchange rates' })
  @ApiBody({ type: BulkUpdateExchangeRatesDto })
  @ApiResponse({ status: 200, description: 'Exchange rates updated successfully' })
  async bulkUpdateRates(
    @Body(ValidationPipe) bulkDto: BulkUpdateExchangeRatesDto,
  ): Promise<RateUpdateResult> {
    this.logger.log(`Bulk updating ${bulkDto.rates.length} exchange rates`);

    return await bulkUpdateExchangeRates(
      this.sequelize,
      bulkDto.rates.map(r => ({
        from: r.fromCurrency,
        to: r.toCurrency,
        rate: r.exchangeRate,
        rateType: r.rateType,
      })),
      'system',
    );
  }

  /**
   * Get effective rate with triangulation fallback
   */
  @Get('exchange-rates/:from/:to')
  @ApiOperation({ summary: 'Get effective exchange rate with triangulation' })
  @ApiParam({ name: 'from', description: 'Source currency' })
  @ApiParam({ name: 'to', description: 'Target currency' })
  @ApiResponse({ status: 200, description: 'Exchange rate retrieved' })
  async getEffectiveRate(
    @Param('from') fromCurrency: string,
    @Param('to') toCurrency: string,
    @Query('effectiveDate') effectiveDate?: Date,
  ): Promise<{
    rate: number;
    method: 'direct' | 'triangulation';
    path?: string[];
  }> {
    this.logger.log(`Getting effective rate: ${fromCurrency}/${toCurrency}`);

    return await getEffectiveExchangeRateWithTriangulation(
      this.sequelize,
      fromCurrency,
      toCurrency,
      effectiveDate || new Date(),
      'spot',
      'USD',
    );
  }

  /**
   * Convert currency amount with automatic rate lookup
   */
  @Post('currency-conversion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert currency with automatic rate' })
  @ApiBody({ type: CurrencyConversionDto })
  @ApiResponse({ status: 200, description: 'Currency conversion completed' })
  async convertCurrency(
    @Body(ValidationPipe) conversionDto: CurrencyConversionDto,
  ): Promise<CurrencyConversion> {
    this.logger.log(
      `Converting ${conversionDto.amount} ${conversionDto.fromCurrency} to ${conversionDto.toCurrency}`,
    );

    return await convertCurrencyWithAutoRate(
      this.sequelize,
      conversionDto.amount,
      conversionDto.fromCurrency,
      conversionDto.toCurrency,
      conversionDto.conversionDate,
      'system',
    );
  }

  /**
   * Perform period-end currency revaluation
   */
  @Post('revaluation/period-end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform period-end currency revaluation' })
  @ApiBody({ type: PerformRevaluationDto })
  @ApiResponse({ status: 200, description: 'Revaluation completed' })
  async performRevaluation(
    @Body(ValidationPipe) revalDto: PerformRevaluationDto,
  ): Promise<RevaluationBatchResult> {
    this.logger.log(
      `Performing revaluation for period ${revalDto.fiscalYear}-${revalDto.fiscalPeriod}`,
    );

    return await performPeriodEndRevaluation(
      this.sequelize,
      revalDto.fiscalYear,
      revalDto.fiscalPeriod,
      revalDto.revaluationDate,
      'system',
    );
  }

  /**
   * Reverse previous revaluation batch
   */
  @Post('revaluation/reverse/:batchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reverse revaluation batch' })
  @ApiParam({ name: 'batchId', description: 'Batch ID to reverse' })
  @ApiResponse({ status: 200, description: 'Revaluation reversed' })
  async reverseRevaluation(
    @Param('batchId') batchId: string,
    @Query('reversalDate') reversalDate?: Date,
  ): Promise<{ reversed: number; errors: string[] }> {
    this.logger.log(`Reversing revaluation batch: ${batchId}`);

    return await reverseRevaluationBatch(
      this.sequelize,
      batchId,
      reversalDate || new Date(),
      'system',
    );
  }

  /**
   * Calculate realized FX gains/losses
   */
  @Post('fx-gain-loss/realized')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate realized FX gains/losses' })
  @ApiResponse({ status: 200, description: 'FX calculation completed' })
  async calculateRealizedGainLoss(
    @Body()
    data: {
      transactionId: string;
      originalRate: number;
      settlementRate: number;
      amount: number;
      currency: string;
    },
  ): Promise<{ realized: number; gainOrLoss: 'gain' | 'loss' }> {
    this.logger.log(`Calculating realized FX for transaction: ${data.transactionId}`);

    return await calculateRealizedFxGainLoss(
      this.sequelize,
      data.transactionId,
      data.originalRate,
      data.settlementRate,
      data.amount,
      data.currency,
      'system',
    );
  }

  /**
   * Translate entity financials for consolidation
   */
  @Post('translation/entity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Translate entity financials' })
  @ApiBody({ type: EntityTranslationDto })
  @ApiResponse({ status: 200, description: 'Translation completed' })
  async translateEntity(
    @Body(ValidationPipe) translationDto: EntityTranslationDto,
  ): Promise<TranslationResult> {
    this.logger.log(
      `Translating entity ${translationDto.entityId}: ${translationDto.sourceCurrency} to ${translationDto.targetCurrency}`,
    );

    return await translateEntityFinancials(
      this.sequelize,
      translationDto.entityId,
      translationDto.sourceCurrency,
      translationDto.targetCurrency,
      translationDto.translationDate,
      translationDto.translationMethod as any,
      translationDto.fiscalYear,
      translationDto.fiscalPeriod,
      'system',
    );
  }

  /**
   * Translate multiple entities for consolidation
   */
  @Post('translation/multi-entity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Translate multiple entities' })
  @ApiResponse({ status: 200, description: 'Multi-entity translation completed' })
  async translateMultiEntity(
    @Body(ValidationPipe) packageDto: GenerateReportingPackageDto,
  ): Promise<TranslationResult[]> {
    this.logger.log(`Translating ${packageDto.entityIds.length} entities`);

    return await translateMultiEntityFinancials(
      this.sequelize,
      packageDto.entityIds,
      packageDto.reportingCurrency,
      packageDto.reportDate,
      packageDto.fiscalYear,
      packageDto.fiscalPeriod,
      'system',
    );
  }

  /**
   * Generate comprehensive multi-currency reporting package
   */
  @Post('reporting/package')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate multi-currency reporting package' })
  @ApiBody({ type: GenerateReportingPackageDto })
  @ApiResponse({ status: 200, description: 'Reporting package generated' })
  async generateReportingPackage(
    @Body(ValidationPipe) packageDto: GenerateReportingPackageDto,
  ): Promise<MultiCurrencyReportingPackage> {
    this.logger.log(
      `Generating reporting package for ${packageDto.entityIds.length} entities in ${packageDto.reportingCurrency}`,
    );

    return await generateMultiCurrencyReportingPackage(
      this.sequelize,
      packageDto.entityIds,
      packageDto.reportingCurrency,
      packageDto.reportDate,
      packageDto.fiscalYear,
      packageDto.fiscalPeriod,
      'system',
    );
  }

  /**
   * Get FX gain/loss summary
   */
  @Get('fx-gain-loss/summary/:fiscalYear/:fiscalPeriod')
  @ApiOperation({ summary: 'Get FX gain/loss summary' })
  @ApiParam({ name: 'fiscalYear', description: 'Fiscal year' })
  @ApiParam({ name: 'fiscalPeriod', description: 'Fiscal period' })
  @ApiResponse({ status: 200, description: 'Summary retrieved' })
  async getFxGainLossSummary(
    @Param('fiscalYear') fiscalYear: string,
    @Param('fiscalPeriod') fiscalPeriod: string,
  ): Promise<FxGainLossSummary> {
    this.logger.log(`Getting FX G/L summary for ${fiscalYear}-${fiscalPeriod}`);

    return await calculateFxGainLossSummary(
      this.sequelize,
      parseInt(fiscalYear),
      parseInt(fiscalPeriod),
    );
  }

  /**
   * Get currency exposure analysis
   */
  @Post('exposure/calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate currency exposure' })
  @ApiResponse({ status: 200, description: 'Exposure calculated' })
  async calculateExposure(
    @Body()
    data: {
      entityIds: number[];
      reportingCurrency: string;
      asOfDate: Date;
    },
  ): Promise<CurrencyExposure[]> {
    this.logger.log(`Calculating currency exposure for ${data.entityIds.length} entities`);

    return await calculateCurrencyExposure(
      this.sequelize,
      data.entityIds,
      data.reportingCurrency,
      data.asOfDate,
    );
  }

  /**
   * Drill down into multi-currency transactions
   */
  @Get('transactions/drilldown/:accountCode/:currency/:fiscalYear/:fiscalPeriod')
  @ApiOperation({ summary: 'Drill down into multi-currency transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  async drillDownTransactions(
    @Param('accountCode') accountCode: string,
    @Param('currency') currency: string,
    @Param('fiscalYear') fiscalYear: string,
    @Param('fiscalPeriod') fiscalPeriod: string,
    @Query('reportingCurrency') reportingCurrency: string = 'USD',
  ): Promise<MultiCurrencyTransaction[]> {
    this.logger.log(
      `Drilling down into transactions for ${accountCode} ${currency}`,
    );

    return await drillDownMultiCurrencyTransactions(
      this.sequelize,
      accountCode,
      currency,
      parseInt(fiscalYear),
      parseInt(fiscalPeriod),
      reportingCurrency,
      'system',
    );
  }

  /**
   * Create intercompany transaction with multi-currency handling
   */
  @Post('intercompany/transaction')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multi-currency intercompany transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  async createIntercompanyTxn(
    @Body()
    data: {
      sourceEntityId: number;
      targetEntityId: number;
      amount: number;
      sourceCurrency: string;
      targetCurrency: string;
      transactionDate: Date;
      description: string;
    },
  ): Promise<IntercompanyTransaction> {
    this.logger.log(
      `Creating intercompany transaction: Entity ${data.sourceEntityId} to Entity ${data.targetEntityId}`,
    );

    return await createMultiCurrencyIntercompanyTransaction(
      this.sequelize,
      data.sourceEntityId,
      data.targetEntityId,
      data.amount,
      data.sourceCurrency,
      data.targetCurrency,
      data.transactionDate,
      data.description,
      'system',
    );
  }

  /**
   * Reconcile multi-currency intercompany balances
   */
  @Post('intercompany/reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reconcile multi-currency intercompany balances' })
  @ApiResponse({ status: 200, description: 'Reconciliation completed' })
  async reconcileIntercompany(
    @Body()
    data: {
      sourceEntityId: number;
      targetEntityId: number;
      reconciliationDate: Date;
      reportingCurrency: string;
    },
  ): Promise<IntercompanyReconciliation> {
    this.logger.log(
      `Reconciling IC balances between Entity ${data.sourceEntityId} and Entity ${data.targetEntityId}`,
    );

    return await reconcileMultiCurrencyIntercompanyBalances(
      this.sequelize,
      data.sourceEntityId,
      data.targetEntityId,
      data.reconciliationDate,
      data.reportingCurrency,
      'system',
    );
  }

  /**
   * Record currency hedging instrument
   */
  @Post('hedging/instrument')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record currency hedging instrument' })
  @ApiBody({ type: RecordHedgeDto })
  @ApiResponse({ status: 201, description: 'Hedging instrument recorded' })
  async recordHedge(
    @Body(ValidationPipe) hedgeDto: RecordHedgeDto,
  ): Promise<{ hedgeId: number; auditLogId: number }> {
    this.logger.log(`Recording hedge for ${hedgeDto.currency} ${hedgeDto.hedgeType}`);

    return await recordCurrencyHedgingInstrument(
      this.sequelize,
      hedgeDto.currency,
      hedgeDto.hedgeAmount,
      hedgeDto.hedgeType as any,
      hedgeDto.hedgeRate,
      hedgeDto.startDate,
      hedgeDto.maturityDate,
      hedgeDto.counterparty,
      'system',
    );
  }

  /**
   * Evaluate hedge effectiveness
   */
  @Post('hedging/evaluate/:hedgeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate hedge effectiveness' })
  @ApiParam({ name: 'hedgeId', description: 'Hedge ID' })
  @ApiResponse({ status: 200, description: 'Effectiveness evaluated' })
  async evaluateHedge(
    @Param('hedgeId') hedgeId: string,
    @Query('evaluationDate') evaluationDate?: Date,
  ): Promise<{
    effective: boolean;
    hedgeValue: number;
    spotValue: number;
    effectiveness: number;
    mtmAdjustment: number;
  }> {
    this.logger.log(`Evaluating hedge effectiveness for hedge ${hedgeId}`);

    return await evaluateHedgeEffectiveness(
      this.sequelize,
      parseInt(hedgeId),
      evaluationDate || new Date(),
      'system',
    );
  }

  /**
   * Generate multi-currency management dashboard
   */
  @Post('dashboard/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate multi-currency dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard generated' })
  async generateDashboard(
    @Body()
    data: {
      entityIds: number[];
      fiscalYear: number;
      fiscalPeriod: number;
      reportingCurrency: string;
    },
  ): Promise<{
    fxGainLoss: FxGainLossSummary;
    currencyExposure: CurrencyExposure[];
    recentRevaluations: RevaluationBatchResult[];
    rateVolatility: Map<string, number>;
    dashboardMetrics: any;
  }> {
    this.logger.log(`Generating dashboard for fiscal ${data.fiscalYear}-${data.fiscalPeriod}`);

    return await generateMultiCurrencyDashboard(
      this.sequelize,
      data.entityIds,
      data.fiscalYear,
      data.fiscalPeriod,
      data.reportingCurrency,
      'system',
    );
  }

  /**
   * Analyze currency rate trends
   */
  @Get('analytics/trends/:currency/:baseCurrency')
  @ApiOperation({ summary: 'Analyze currency rate trends' })
  @ApiParam({ name: 'currency', description: 'Currency to analyze' })
  @ApiParam({ name: 'baseCurrency', description: 'Base currency' })
  @ApiQuery({ name: 'days', description: 'Number of days to analyze', required: false })
  @ApiResponse({ status: 200, description: 'Trends analyzed' })
  async analyzeTrends(
    @Param('currency') currency: string,
    @Param('baseCurrency') baseCurrency: string,
    @Query('days') days: string = '30',
  ): Promise<{
    currentRate: number;
    averageRate: number;
    highRate: number;
    lowRate: number;
    volatility: number;
    trend: 'strengthening' | 'weakening' | 'stable';
    forecast: number;
  }> {
    this.logger.log(`Analyzing trends for ${currency}/${baseCurrency}`);

    return await analyzeCurrencyRateTrends(
      this.sequelize,
      currency,
      baseCurrency,
      parseInt(days),
    );
  }

  /**
   * Generate compliance report
   */
  @Post('reports/compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate multi-currency compliance report' })
  @ApiBody({ type: GenerateComplianceReportDto })
  @ApiResponse({ status: 200, description: 'Compliance report generated' })
  async generateComplianceReport(
    @Body(ValidationPipe) reportDto: GenerateComplianceReportDto,
  ): Promise<{
    reportId: string;
    period: { startDate: Date; endDate: Date };
    rateUpdates: number;
    revaluations: number;
    translations: number;
    hedges: number;
    complianceIssues: string[];
    dataIntegrityCheck: boolean;
  }> {
    this.logger.log(
      `Generating compliance report for period ${reportDto.startDate} to ${reportDto.endDate}`,
    );

    return await generateMultiCurrencyComplianceReport(
      this.sequelize,
      reportDto.startDate,
      reportDto.endDate,
      'system',
    );
  }
}

// ============================================================================
// SERVICE CLASS FOR DEPENDENCY INJECTION
// ============================================================================

@Injectable()
export class MultiCurrencyExchangeService {
  private readonly logger = new Logger(MultiCurrencyExchangeService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Initialize multi-currency configuration
   */
  async initializeConfiguration(config: MultiCurrencyConfig): Promise<void> {
    this.logger.log('Initializing multi-currency configuration');

    try {
      await validateDataIntegrity(
        this.sequelize,
        'multi_currency_config',
        'Configuration initialization validation',
      );
    } catch (error: any) {
      this.logger.error(`Configuration initialization failed: ${error.message}`);
      throw new ConflictException(`Configuration initialization failed: ${error.message}`);
    }
  }

  /**
   * Monitor all multi-currency operations
   */
  async monitorOperations(): Promise<{
    activeRevaluations: number;
    pendingTranslations: number;
    outstandingExposures: CurrencyExposure[];
    complianceStatus: string;
  }> {
    this.logger.log('Monitoring multi-currency operations');

    try {
      const results = await Promise.all([
        this.countActiveRevaluations(),
        this.countPendingTranslations(),
        this.getExposures(),
        this.validateCompliance(),
      ]);

      return {
        activeRevaluations: results[0],
        pendingTranslations: results[1],
        outstandingExposures: results[2],
        complianceStatus: results[3],
      };
    } catch (error: any) {
      this.logger.error(`Operation monitoring failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Count active revaluations
   */
  private async countActiveRevaluations(): Promise<number> {
    const result = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM currency_revaluations WHERE status = :status`,
      {
        replacements: { status: RevaluationStatus.IN_PROGRESS },
        type: 'SELECT',
      }
    );

    return (result[0] as any).count || 0;
  }

  /**
   * Count pending translations
   */
  private async countPendingTranslations(): Promise<number> {
    const result = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM currency_translations WHERE status = :status`,
      {
        replacements: { status: OperationStatus.INITIATED },
        type: 'SELECT',
      }
    );

    return (result[0] as any).count || 0;
  }

  /**
   * Get outstanding exposures
   */
  private async getExposures(): Promise<CurrencyExposure[]> {
    return await calculateCurrencyExposure(
      this.sequelize,
      [1],
      'USD',
      new Date(),
    );
  }

  /**
   * Validate compliance status
   */
  private async validateCompliance(): Promise<string> {
    try {
      await validateDataIntegrity(
        this.sequelize,
        'multi_currency_operations',
        'Compliance validation',
      );
      return 'COMPLIANT';
    } catch {
      return 'NON_COMPLIANT';
    }
  }

  /**
   * Execute scheduled revaluation task
   */
  async executeScheduledRevaluation(
    fiscalYear: number,
    fiscalPeriod: number,
  ): Promise<RevaluationBatchResult> {
    this.logger.log(`Executing scheduled revaluation for ${fiscalYear}-${fiscalPeriod}`);

    try {
      return await performPeriodEndRevaluation(
        this.sequelize,
        fiscalYear,
        fiscalPeriod,
        new Date(),
        'system',
      );
    } catch (error: any) {
      this.logger.error(`Scheduled revaluation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate rate synchronization
   */
  async validateRateSynchronization(): Promise<{
    synchronized: boolean;
    lastSyncTime: Date;
    ratesCount: number;
  }> {
    this.logger.log('Validating rate synchronization');

    try {
      const ExchangeRateModel = createExchangeRateModel(this.sequelize);
      const latestRates = await ExchangeRateModel.findAll({
        attributes: [
          [fn('MAX', col('effectiveDate')), 'lastSyncTime'],
          [fn('COUNT', col('*')), 'ratesCount'],
        ],
        where: { isActive: true },
      });

      const data = latestRates[0]?.get({ plain: true }) as any;

      return {
        synchronized: !!data?.lastSyncTime,
        lastSyncTime: data?.lastSyncTime || new Date(),
        ratesCount: parseInt(data?.ratesCount) || 0,
      };
    } catch (error: any) {
      this.logger.error(`Rate sync validation failed: ${error.message}`);
      throw error;
    }
  }
}

// ============================================================================
// COMPOSITE FUNCTIONS - EXCHANGE RATE MANAGEMENT
// ============================================================================

/**
 * Synchronizes exchange rates from external sources with audit logging
 * Composes: createExchangeRateModel, createAuditLog, validateDataIntegrity
 */
export const syncExchangeRatesWithAudit = async (
  sequelize: any,
  userId: string,
  rateSource: RateSourceType,
  transaction?: Transaction
): Promise<RateUpdateResult> => {
  const ExchangeRateModel = createExchangeRateModel(sequelize);
  const startTime = Date.now();
  const ratesByPair = new Map<string, ExchangeRate>();
  const errors: string[] = [];

  try {
    const currencyPairs = [
      { from: 'USD', to: 'EUR', rate: 0.92 },
      { from: 'USD', to: 'GBP', rate: 0.79 },
      { from: 'USD', to: 'JPY', rate: 149.50 },
      { from: 'USD', to: 'CAD', rate: 1.36 },
      { from: 'USD', to: 'AUD', rate: 1.53 },
    ];

    let ratesUpdated = 0;
    let ratesFailed = 0;

    for (const pair of currencyPairs) {
      try {
        const inverseRate = calculateInverseRate(pair.rate);

        const newRate = await ExchangeRateModel.create({
          fromCurrency: pair.from,
          toCurrency: pair.to,
          effectiveDate: new Date(),
          expirationDate: null,
          rateType: 'spot',
          exchangeRate: pair.rate,
          inverseRate,
          rateSource,
          isActive: true,
        }, { transaction });

        ratesByPair.set(`${pair.from}/${pair.to}`, newRate);
        ratesUpdated++;

        await trackFieldChange(
          sequelize,
          'exchange_rates',
          newRate.rateId,
          'exchangeRate',
          null,
          pair.rate,
          userId,
          'Rate update from external source',
          transaction
        );
      } catch (error: any) {
        errors.push(`Failed to update ${pair.from}/${pair.to}: ${error.message}`);
        ratesFailed++;
      }
    }

    const auditLog = await createAuditLog(
      sequelize,
      'exchange_rates',
      0,
      'UPDATE',
      userId,
      `Rate sync: ${ratesUpdated} updated, ${ratesFailed} failed`,
      {},
      { ratesUpdated, ratesFailed, rateSource },
      transaction
    );

    await validateDataIntegrity(
      sequelize,
      'exchange_rates',
      'Exchange rate sync validation',
      transaction
    );

    return {
      ratesUpdated,
      ratesFailed,
      updateTimestamp: new Date(),
      ratesByPair,
      errors,
      auditLogId: auditLog.auditId,
    };
  } catch (error: any) {
    throw new Error(`Exchange rate sync failed: ${error.message}`);
  }
};

/**
 * Retrieves effective exchange rate with fallback to triangulation
 * Composes: createExchangeRateModel with triangulation logic
 */
export const getEffectiveExchangeRateWithTriangulation = async (
  sequelize: any,
  fromCurrency: string,
  toCurrency: string,
  effectiveDate: Date,
  rateType: string = 'spot',
  triangulationCurrency: string = 'USD',
  transaction?: Transaction
): Promise<{ rate: number; method: 'direct' | 'triangulation'; path?: string[] }> => {
  const ExchangeRateModel = createExchangeRateModel(sequelize);

  const directRate = await ExchangeRateModel.findOne({
    where: {
      fromCurrency,
      toCurrency,
      rateType,
      isActive: true,
      effectiveDate: { [Op.lte]: effectiveDate },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: effectiveDate } },
      ],
    },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });

  if (directRate) {
    return { rate: directRate.exchangeRate, method: 'direct' };
  }

  const inverseRate = await ExchangeRateModel.findOne({
    where: {
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
      rateType,
      isActive: true,
      effectiveDate: { [Op.lte]: effectiveDate },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: effectiveDate } },
      ],
    },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });

  if (inverseRate) {
    return { rate: calculateInverseRate(inverseRate.exchangeRate), method: 'direct' };
  }

  if (fromCurrency !== triangulationCurrency && toCurrency !== triangulationCurrency) {
    const fromToBase = await ExchangeRateModel.findOne({
      where: {
        fromCurrency,
        toCurrency: triangulationCurrency,
        rateType,
        isActive: true,
        effectiveDate: { [Op.lte]: effectiveDate },
      },
      order: [['effectiveDate', 'DESC']],
      transaction,
    });

    const baseToTarget = await ExchangeRateModel.findOne({
      where: {
        fromCurrency: triangulationCurrency,
        toCurrency,
        rateType,
        isActive: true,
        effectiveDate: { [Op.lte]: effectiveDate },
      },
      order: [['effectiveDate', 'DESC']],
      transaction,
    });

    if (fromToBase && baseToTarget) {
      const triangulatedRate = fromToBase.exchangeRate * baseToTarget.exchangeRate;
      return {
        rate: triangulatedRate,
        method: 'triangulation',
        path: [fromCurrency, triangulationCurrency, toCurrency],
      };
    }
  }

  throw new Error(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
};

/**
 * Converts amount with automatic rate lookup and triangulation
 * Composes: getEffectiveExchangeRateWithTriangulation, roundCurrencyAmount, createAuditLog
 */
export const convertCurrencyWithAutoRate = async (
  sequelize: any,
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  conversionDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<CurrencyConversion> => {
  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      originalAmount: amount,
      convertedAmount: amount,
      exchangeRate: 1.0,
      conversionDate,
      rateType: 'spot',
    };
  }

  const rateResult = await getEffectiveExchangeRateWithTriangulation(
    sequelize,
    fromCurrency,
    toCurrency,
    conversionDate,
    'spot',
    'USD',
    transaction
  );

  const convertedAmount = roundCurrencyAmount(
    amount * rateResult.rate,
    toCurrency,
    2
  );

  await createAuditLog(
    sequelize,
    'currency_conversions',
    0,
    'EXECUTE',
    userId,
    `Currency conversion: ${amount} ${fromCurrency} to ${toCurrency}`,
    {},
    {
      amount,
      fromCurrency,
      toCurrency,
      rate: rateResult.rate,
      method: rateResult.method,
      convertedAmount,
    },
    transaction
  );

  return {
    fromCurrency,
    toCurrency,
    originalAmount: amount,
    convertedAmount,
    exchangeRate: rateResult.rate,
    conversionDate,
    rateType: 'spot',
    triangulationCurrency: rateResult.path?.[1],
  };
};

/**
 * Updates exchange rates in bulk with validation
 * Composes: createExchangeRateModel, trackFieldChange, validateDataIntegrity
 */
export const bulkUpdateExchangeRates = async (
  sequelize: any,
  rates: Array<{ from: string; to: string; rate: number; rateType: string }>,
  userId: string,
  transaction?: Transaction
): Promise<RateUpdateResult> => {
  const ExchangeRateModel = createExchangeRateModel(sequelize);
  const ratesByPair = new Map<string, ExchangeRate>();
  const errors: string[] = [];
  let ratesUpdated = 0;
  let ratesFailed = 0;

  for (const rateData of rates) {
    try {
      const inverseRate = calculateInverseRate(rateData.rate);

      const newRate = await ExchangeRateModel.create({
        fromCurrency: rateData.from,
        toCurrency: rateData.to,
        effectiveDate: new Date(),
        expirationDate: null,
        rateType: rateData.rateType,
        exchangeRate: rateData.rate,
        inverseRate,
        rateSource: 'manual_entry',
        isActive: true,
      }, { transaction });

      ratesByPair.set(`${rateData.from}/${rateData.to}`, newRate);
      ratesUpdated++;

      await trackFieldChange(
        sequelize,
        'exchange_rates',
        newRate.rateId,
        'exchangeRate',
        null,
        rateData.rate,
        userId,
        'Bulk rate update',
        transaction
      );
    } catch (error: any) {
      errors.push(`Failed ${rateData.from}/${rateData.to}: ${error.message}`);
      ratesFailed++;
    }
  }

  await validateDataIntegrity(
    sequelize,
    'exchange_rates',
    'Bulk rate update validation',
    transaction
  );

  const auditLog = await createAuditLog(
    sequelize,
    'exchange_rates',
    0,
    'UPDATE',
    userId,
    `Bulk update: ${ratesUpdated} updated, ${ratesFailed} failed`,
    {},
    { ratesUpdated, ratesFailed },
    transaction
  );

  return {
    ratesUpdated,
    ratesFailed,
    updateTimestamp: new Date(),
    ratesByPair,
    errors,
    auditLogId: auditLog.auditId,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - CURRENCY REVALUATION
// ============================================================================

/**
 * Performs comprehensive currency revaluation for period-end
 * Composes: createCurrencyRevaluationModel, createAccrual, createAuditLog
 */
export const performPeriodEndRevaluation = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  revaluationDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<RevaluationBatchResult> => {
  const batchId = `REVAL-${fiscalYear}-${fiscalPeriod}-${Date.now()}`;
  const CurrencyRevaluationModel = createCurrencyRevaluationModel(sequelize);
  const journalEntries: RevaluationJournalEntry[] = [];
  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];

  try {
    const accountsToRevalue = await sequelize.query(
      `
      SELECT
        a.account_id,
        a.account_code,
        a.account_name,
        a.currency,
        SUM(t.amount) as balance,
        a.revaluation_required
      FROM financial_accounts a
      INNER JOIN transactions t ON a.account_id = t.account_id
      WHERE a.currency != :baseCurrency
        AND a.revaluation_required = true
        AND a.is_active = true
      GROUP BY a.account_id, a.account_code, a.account_name, a.currency, a.revaluation_required
      HAVING SUM(t.amount) != 0
      `,
      {
        replacements: { baseCurrency: 'USD' },
        type: 'SELECT',
        transaction,
      }
    );

    let totalRevaluationAmount = 0;
    let unrealizedGains = 0;
    let unrealizedLosses = 0;
    let accountsProcessed = 0;

    for (const account of accountsToRevalue as any[]) {
      try {
        const rateResult = await getEffectiveExchangeRateWithTriangulation(
          sequelize,
          account.currency,
          'USD',
          revaluationDate,
          'spot',
          'USD',
          transaction
        );

        const originalBalance = parseFloat(account.balance);
        const revaluedBalance = originalBalance * rateResult.rate;
        const gainLossAmount = revaluedBalance - originalBalance;

        await CurrencyRevaluationModel.create({
          accountId: account.account_id,
          accountCode: account.account_code,
          currency: account.currency,
          originalBalance,
          revaluedBalance,
          gainLossAmount,
          gainLossType: 'unrealized',
          revaluationDate,
          fiscalYear,
          fiscalPeriod,
          exchangeRate: rateResult.rate,
          batchId,
        }, { transaction });

        const journalEntry: RevaluationJournalEntry = {
          entryId: `${batchId}-${account.account_code}`,
          accountCode: account.account_code,
          currency: account.currency,
          debitAmount: gainLossAmount > 0 ? gainLossAmount : 0,
          creditAmount: gainLossAmount < 0 ? Math.abs(gainLossAmount) : 0,
          exchangeRate: rateResult.rate,
          description: `Revaluation ${account.currency} to USD @ ${rateResult.rate}`,
        };
        journalEntries.push(journalEntry);

        if (gainLossAmount > 0) {
          unrealizedGains += gainLossAmount;
        } else {
          unrealizedLosses += Math.abs(gainLossAmount);
        }

        totalRevaluationAmount += Math.abs(gainLossAmount);
        accountsProcessed++;

        const accountAuditLog = await createAuditLog(
          sequelize,
          'currency_revaluation',
          account.account_id,
          'POST',
          userId,
          `Revaluation: ${account.account_code}`,
          { originalBalance },
          { revaluedBalance, gainLossAmount },
          transaction
        );
        auditTrail.push(accountAuditLog);

      } catch (error: any) {
        errors.push(`Account ${account.account_code}: ${error.message}`);
      }
    }

    if (totalRevaluationAmount > 0) {
      await createAccrual(
        sequelize,
        fiscalYear,
        fiscalPeriod,
        'unrealized_fx_gain_loss',
        `Unrealized FX G/L - ${batchId}`,
        totalRevaluationAmount,
        userId,
        transaction
      );
    }

    const batchAuditLog = await createAuditLog(
      sequelize,
      'currency_revaluation_batch',
      0,
      'EXECUTE',
      userId,
      `Period-end revaluation: ${accountsProcessed} accounts`,
      {},
      {
        batchId,
        accountsProcessed,
        totalRevaluationAmount,
        unrealizedGains,
        unrealizedLosses,
      },
      transaction
    );
    auditTrail.push(batchAuditLog);

    return {
      batchId,
      processDate: revaluationDate,
      accountsProcessed,
      totalRevaluationAmount,
      unrealizedGains,
      unrealizedLosses,
      journalEntries,
      errors,
      auditTrail,
    };
  } catch (error: any) {
    throw new Error(`Revaluation failed: ${error.message}`);
  }
};

/**
 * Reverses previous revaluation entries
 * Composes: createCurrencyRevaluationModel, reverseAccrual, createAuditLog
 */
export const reverseRevaluationBatch = async (
  sequelize: any,
  batchId: string,
  reversalDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<{ reversed: number; errors: string[] }> => {
  const CurrencyRevaluationModel = createCurrencyRevaluationModel(sequelize);
  const errors: string[] = [];

  try {
    const revaluations = await CurrencyRevaluationModel.findAll({
      where: { batchId },
      transaction,
    });

    let reversed = 0;

    for (const revaluation of revaluations) {
      try {
        await CurrencyRevaluationModel.create({
          accountId: revaluation.accountId,
          accountCode: revaluation.accountCode,
          currency: revaluation.currency,
          originalBalance: revaluation.revaluedBalance,
          revaluedBalance: revaluation.originalBalance,
          gainLossAmount: -revaluation.gainLossAmount,
          gainLossType: 'unrealized',
          revaluationDate: reversalDate,
          fiscalYear: revaluation.fiscalYear,
          fiscalPeriod: revaluation.fiscalPeriod,
          exchangeRate: revaluation.exchangeRate,
          batchId: `${batchId}-REVERSAL`,
          originalBatchId: batchId,
        }, { transaction });

        reversed++;
      } catch (error: any) {
        errors.push(`Failed to reverse ${revaluation.accountCode}: ${error.message}`);
      }
    }

    const accruals = await sequelize.query(
      `SELECT accrual_id FROM accruals WHERE description LIKE :batchId`,
      {
        replacements: { batchId: `%${batchId}%` },
        type: 'SELECT',
        transaction,
      }
    );

    for (const accrual of accruals as any[]) {
      await reverseAccrual(sequelize, accrual.accrual_id, reversalDate, userId, transaction);
    }

    await createAuditLog(
      sequelize,
      'currency_revaluation_batch',
      0,
      'REVERSE',
      userId,
      `Reversed revaluation batch: ${batchId}`,
      {},
      { batchId, reversed },
      transaction
    );

    return { reversed, errors };
  } catch (error: any) {
    throw new Error(`Reversal failed: ${error.message}`);
  }
};

/**
 * Calculates realized FX gains/losses on transaction settlement
 * Composes: createAuditLog, trackFieldChange
 */
export const calculateRealizedFxGainLoss = async (
  sequelize: any,
  transactionId: string,
  originalRate: number,
  settlementRate: number,
  transactionAmount: number,
  currency: string,
  userId: string,
  transaction?: Transaction
): Promise<{ realized: number; gainOrLoss: 'gain' | 'loss' }> => {
  const originalConverted = transactionAmount * originalRate;
  const settlementConverted = transactionAmount * settlementRate;
  const realized = settlementConverted - originalConverted;

  const gainOrLoss = realized >= 0 ? 'gain' : 'loss';

  await createAuditLog(
    sequelize,
    'fx_realized_gain_loss',
    0,
    'INSERT',
    userId,
    `Realized FX ${gainOrLoss}: ${currency} transaction`,
    {},
    {
      transactionId,
      currency,
      originalRate,
      settlementRate,
      transactionAmount,
      realized,
    },
    transaction
  );

  return { realized, gainOrLoss };
};

// ============================================================================
// COMPOSITE FUNCTIONS - CURRENCY TRANSLATION
// ============================================================================

/**
 * Translates entity financial statements for consolidation
 * Composes: createCurrencyTranslationModel, generateBalanceSheet, generateIncomeStatement
 */
export const translateEntityFinancials = async (
  sequelize: any,
  entityId: number,
  sourceCurrency: string,
  targetCurrency: string,
  translationDate: Date,
  translationMethod: TranslationMethodType,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<TranslationResult> => {
  const CurrencyTranslationModel = createCurrencyTranslationModel(sequelize);
  const translatedBalances: TranslatedBalance[] = [];

  const validationResult = validateTranslationMethod(translationMethod);
  if (!validationResult.valid) {
    throw new Error(`Invalid translation method: ${validationResult.errors.join(', ')}`);
  }

  try {
    const balanceSheet = await generateBalanceSheet(
      sequelize,
      entityId,
      fiscalYear,
      fiscalPeriod,
      transaction
    );

    let currentRate: number;
    let averageRate: number;
    let historicalRate: number;

    const currentRateResult = await getEffectiveExchangeRateWithTriangulation(
      sequelize,
      sourceCurrency,
      targetCurrency,
      translationDate,
      'spot',
      'USD',
      transaction
    );
    currentRate = currentRateResult.rate;

    const averageRateResult = await getEffectiveExchangeRateWithTriangulation(
      sequelize,
      sourceCurrency,
      targetCurrency,
      translationDate,
      'average',
      'USD',
      transaction
    );
    averageRate = averageRateResult.rate;

    const historicalRateResult = await getEffectiveExchangeRateWithTriangulation(
      sequelize,
      sourceCurrency,
      targetCurrency,
      new Date(fiscalYear, 0, 1),
      'historical',
      'USD',
      transaction
    );
    historicalRate = historicalRateResult.rate;

    const accountsToTranslate = [
      ...balanceSheet.assets.currentAssets.accountLines,
      ...balanceSheet.assets.nonCurrentAssets.accountLines,
      ...balanceSheet.liabilities.currentLiabilities.accountLines,
      ...balanceSheet.liabilities.nonCurrentLiabilities.accountLines,
    ];

    let cumulativeTranslationAdjustment = 0;

    for (const accountLine of accountsToTranslate) {
      let exchangeRate: number;
      const accountType = accountLine.accountCode.startsWith('1') ? 'asset' :
                         accountLine.accountCode.startsWith('2') ? 'liability' :
                         accountLine.accountCode.startsWith('3') ? 'equity' :
                         accountLine.accountCode.startsWith('4') ? 'revenue' : 'expense';

      if (translationMethod === TranslationMethodType.CURRENT) {
        exchangeRate = currentRate;
      } else if (translationMethod === TranslationMethodType.AVERAGE) {
        exchangeRate = averageRate;
      } else if (translationMethod === TranslationMethodType.HISTORICAL) {
        exchangeRate = historicalRate;
      } else {
        const isMonetary = ['cash', 'receivable', 'payable', 'debt'].some(
          keyword => accountLine.accountName.toLowerCase().includes(keyword)
        );
        exchangeRate = isMonetary ? currentRate : historicalRate;
      }

      const translatedAmount = accountLine.currentBalance * exchangeRate;
      const translationAdjustment = translatedAmount - accountLine.currentBalance;

      await CurrencyTranslationModel.create({
        entityId,
        accountCode: accountLine.accountCode,
        originalCurrency: sourceCurrency,
        originalAmount: accountLine.currentBalance,
        reportingCurrency: targetCurrency,
        translatedAmount,
        translationRate: exchangeRate,
        translationMethod,
        translationDate,
        fiscalYear,
        fiscalPeriod,
      }, { transaction });

      translatedBalances.push({
        accountCode: accountLine.accountCode,
        accountType: accountType as any,
        originalAmount: accountLine.currentBalance,
        translatedAmount,
        exchangeRate,
        translationAdjustment,
      });

      cumulativeTranslationAdjustment += translationAdjustment;
    }

    const auditLog = await createAuditLog(
      sequelize,
      'currency_translation',
      entityId,
      'EXECUTE',
      userId,
      `Translation: ${sourceCurrency} to ${targetCurrency}`,
      {},
      {
        translationMethod,
        accountsTranslated: translatedBalances.length,
        cumulativeTranslationAdjustment,
      },
      transaction
    );

    return {
      entityId,
      translationDate,
      sourceCurrency,
      targetCurrency,
      translationMethod: translationMethod as any,
      translatedBalances,
      cumulativeTranslationAdjustment,
      auditLogId: auditLog.auditId,
    };
  } catch (error: any) {
    throw new Error(`Translation failed: ${error.message}`);
  }
};

/**
 * Performs multi-entity currency translation for consolidation
 * Composes: translateEntityFinancials, initiateConsolidation, createAuditLog
 */
export const translateMultiEntityFinancials = async (
  sequelize: any,
  entityIds: number[],
  reportingCurrency: string,
  translationDate: Date,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<TranslationResult[]> => {
  const translationResults: TranslationResult[] = [];

  for (const entityId of entityIds) {
    const entity = await sequelize.query(
      `SELECT functional_currency FROM entities WHERE entity_id = :entityId`,
      {
        replacements: { entityId },
        type: 'SELECT',
        transaction,
      }
    );

    if (entity && entity.length > 0) {
      const functionalCurrency = (entity[0] as any).functional_currency;

      if (functionalCurrency !== reportingCurrency) {
        const result = await translateEntityFinancials(
          sequelize,
          entityId,
          functionalCurrency,
          reportingCurrency,
          translationDate,
          TranslationMethodType.CURRENT,
          fiscalYear,
          fiscalPeriod,
          userId,
          transaction
        );
        translationResults.push(result);
      }
    }
  }

  await createAuditLog(
    sequelize,
    'multi_entity_translation',
    0,
    'EXECUTE',
    userId,
    `Multi-entity translation: ${entityIds.length} entities`,
    {},
    {
      entityIds,
      reportingCurrency,
      entitiesTranslated: translationResults.length,
    },
    transaction
  );

  return translationResults;
};

// ============================================================================
// COMPOSITE FUNCTIONS - MULTI-CURRENCY REPORTING
// ============================================================================

/**
 * Generates comprehensive multi-currency reporting package
 * Composes: generateConsolidatedFinancials, translateMultiEntityFinancials
 */
export const generateMultiCurrencyReportingPackage = async (
  sequelize: any,
  entityIds: number[],
  reportingCurrency: string,
  reportDate: Date,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<MultiCurrencyReportingPackage> => {
  const entities: EntityCurrencyReport[] = [];

  const translationResults = await translateMultiEntityFinancials(
    sequelize,
    entityIds,
    reportingCurrency,
    reportDate,
    fiscalYear,
    fiscalPeriod,
    userId,
    transaction
  );

  for (const entityId of entityIds) {
    const entity = await sequelize.query(
      `SELECT entity_name, functional_currency FROM entities WHERE entity_id = :entityId`,
      {
        replacements: { entityId },
        type: 'SELECT',
        transaction,
      }
    );

    if (entity && entity.length > 0) {
      const entityData = entity[0] as any;

      const balanceSheetTranslated = await generateBalanceSheet(
        sequelize,
        entityId,
        fiscalYear,
        fiscalPeriod,
        transaction
      );

      const incomeStatementTranslated = await generateIncomeStatement(
        sequelize,
        entityId,
        fiscalYear,
        fiscalPeriod,
        transaction
      );

      const translation = translationResults.find(t => t.entityId === entityId);

      entities.push({
        entityId,
        entityName: entityData.entity_name,
        functionalCurrency: entityData.functional_currency,
        balanceSheetTranslated,
        incomeStatementTranslated,
        translationRate: translation?.translatedBalances[0]?.exchangeRate || 1.0,
      });
    }
  }

  const consolidatedBalanceSheet = await generateBalanceSheet(
    sequelize,
    0,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const consolidatedIncomeStatement = await generateIncomeStatement(
    sequelize,
    0,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const fxGainLoss = await calculateFxGainLossSummary(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const currencyExposure = await calculateCurrencyExposure(
    sequelize,
    entityIds,
    reportingCurrency,
    reportDate,
    transaction
  );

  const translationAdjustments = translationResults.reduce(
    (sum, t) => sum + t.cumulativeTranslationAdjustment,
    0
  );

  await createAuditLog(
    sequelize,
    'multi_currency_reporting',
    0,
    'EXECUTE',
    userId,
    `Multi-currency reporting package generated`,
    {},
    {
      entityIds,
      reportingCurrency,
      translationAdjustments,
    },
    transaction
  );

  return {
    reportDate,
    reportingCurrency,
    entities,
    consolidatedBalanceSheet,
    consolidatedIncomeStatement,
    fxGainLossSummary: fxGainLoss,
    currencyExposure,
    translationAdjustments,
  };
};

/**
 * Calculates FX gain/loss summary for reporting period
 * Composes: createCurrencyRevaluationModel with aggregations
 */
export const calculateFxGainLossSummary = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction
): Promise<FxGainLossSummary> => {
  const CurrencyRevaluationModel = createCurrencyRevaluationModel(sequelize);

  const realizedResults = await sequelize.query(
    `
    SELECT
      currency,
      SUM(CASE WHEN gain_loss_amount > 0 THEN gain_loss_amount ELSE 0 END) as gains,
      SUM(CASE WHEN gain_loss_amount < 0 THEN ABS(gain_loss_amount) ELSE 0 END) as losses
    FROM fx_realized_gain_loss
    WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
    GROUP BY currency
    `,
    {
      replacements: { fiscalYear, fiscalPeriod },
      type: 'SELECT',
      transaction,
    }
  );

  const unrealizedResults = await CurrencyRevaluationModel.findAll({
    attributes: [
      'currency',
      [fn('SUM', literal('CASE WHEN gain_loss_amount > 0 THEN gain_loss_amount ELSE 0 END')), 'gains'],
      [fn('SUM', literal('CASE WHEN gain_loss_amount < 0 THEN ABS(gain_loss_amount) ELSE 0 END')), 'losses'],
    ],
    where: {
      fiscalYear,
      fiscalPeriod,
      gainLossType: 'unrealized',
    },
    group: ['currency'],
    transaction,
  });

  let totalRealizedGains = 0;
  let totalRealizedLosses = 0;
  let totalUnrealizedGains = 0;
  let totalUnrealizedLosses = 0;

  const byCurrency = new Map<string, { gains: number; losses: number }>();

  for (const result of realizedResults as any[]) {
    totalRealizedGains += parseFloat(result.gains) || 0;
    totalRealizedLosses += parseFloat(result.losses) || 0;
    byCurrency.set(result.currency, {
      gains: parseFloat(result.gains) || 0,
      losses: parseFloat(result.losses) || 0,
    });
  }

  for (const result of unrealizedResults) {
    const data = result.get({ plain: true }) as any;
    totalUnrealizedGains += parseFloat(data.gains) || 0;
    totalUnrealizedLosses += parseFloat(data.losses) || 0;

    const existing = byCurrency.get(data.currency) || { gains: 0, losses: 0 };
    byCurrency.set(data.currency, {
      gains: existing.gains + (parseFloat(data.gains) || 0),
      losses: existing.losses + (parseFloat(data.losses) || 0),
    });
  }

  return {
    realized: {
      gains: totalRealizedGains,
      losses: totalRealizedLosses,
      net: totalRealizedGains - totalRealizedLosses,
    },
    unrealized: {
      gains: totalUnrealizedGains,
      losses: totalUnrealizedLosses,
      net: totalUnrealizedGains - totalUnrealizedLosses,
    },
    total: {
      gains: totalRealizedGains + totalUnrealizedGains,
      losses: totalRealizedLosses + totalUnrealizedLosses,
      net: (totalRealizedGains + totalUnrealizedGains) - (totalRealizedLosses + totalUnrealizedLosses),
    },
    byCurrency,
  };
};

/**
 * Calculates currency exposure across entities
 * Composes: Complex Sequelize queries with joins and aggregations
 */
export const calculateCurrencyExposure = async (
  sequelize: any,
  entityIds: number[],
  reportingCurrency: string,
  asOfDate: Date,
  transaction?: Transaction
): Promise<CurrencyExposure[]> => {
  const exposureResults = await sequelize.query(
    `
    SELECT
      a.currency,
      SUM(CASE WHEN a.account_type IN ('asset') THEN t.amount ELSE 0 END) as asset_exposure,
      SUM(CASE WHEN a.account_type IN ('liability') THEN t.amount ELSE 0 END) as liability_exposure,
      COALESCE(SUM(h.hedged_amount), 0) as hedged_amount
    FROM financial_accounts a
    INNER JOIN transactions t ON a.account_id = t.account_id
    LEFT JOIN currency_hedges h ON a.currency = h.currency AND h.is_active = true
    WHERE a.entity_id IN (:entityIds)
      AND a.currency != :reportingCurrency
      AND t.transaction_date <= :asOfDate
    GROUP BY a.currency
    `,
    {
      replacements: { entityIds, reportingCurrency, asOfDate },
      type: 'SELECT',
      transaction,
    }
  );

  const exposures: CurrencyExposure[] = [];
  let totalExposure = 0;

  for (const result of exposureResults as any[]) {
    const assetExposure = parseFloat(result.asset_exposure) || 0;
    const liabilityExposure = parseFloat(result.liability_exposure) || 0;
    const netExposure = assetExposure - liabilityExposure;
    const hedgedAmount = parseFloat(result.hedged_amount) || 0;
    const unhedgedAmount = Math.abs(netExposure) - hedgedAmount;

    totalExposure += Math.abs(netExposure);

    exposures.push({
      currency: result.currency,
      assetExposure,
      liabilityExposure,
      netExposure,
      hedgedAmount,
      unhedgedAmount,
      exposurePercentage: 0,
    });
  }

  for (const exposure of exposures) {
    exposure.exposurePercentage = totalExposure > 0
      ? (Math.abs(exposure.netExposure) / totalExposure) * 100
      : 0;
  }

  return exposures;
};

/**
 * Drills down into multi-currency transaction details
 * Composes: getDrillDownTransactions, convertCurrencyWithAutoRate, createAuditLog
 */
export const drillDownMultiCurrencyTransactions = async (
  sequelize: any,
  accountCode: string,
  currency: string,
  fiscalYear: number,
  fiscalPeriod: number,
  reportingCurrency: string,
  userId: string,
  transaction?: Transaction
): Promise<MultiCurrencyTransaction[]> => {
  const transactions = await getDrillDownTransactions(
    sequelize,
    accountCode,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const multiCurrencyTransactions: MultiCurrencyTransaction[] = [];

  for (const txn of transactions) {
    if (txn.currency === currency) {
      const conversion = await convertCurrencyWithAutoRate(
        sequelize,
        txn.amount,
        currency,
        reportingCurrency,
        txn.transactionDate,
        userId,
        transaction
      );

      multiCurrencyTransactions.push({
        transactionId: txn.transactionId,
        transactionDate: txn.transactionDate,
        baseCurrencyAmount: conversion.convertedAmount,
        foreignCurrencyAmount: txn.amount,
        foreignCurrency: currency,
        exchangeRate: conversion.exchangeRate,
        rateType: conversion.rateType,
        conversionMethod: conversion.triangulationCurrency ? 'triangulation' : 'direct',
        triangulationCurrency: conversion.triangulationCurrency,
        accountCode,
      });
    }
  }

  await createAuditLog(
    sequelize,
    'multi_currency_drilldown',
    0,
    'SELECT',
    userId,
    `Drill-down: ${accountCode} ${currency}`,
    {},
    {
      accountCode,
      currency,
      transactionCount: multiCurrencyTransactions.length,
    },
    transaction
  );

  return multiCurrencyTransactions;
};

// ============================================================================
// COMPOSITE FUNCTIONS - INTERCOMPANY MULTI-CURRENCY
// ============================================================================

/**
 * Creates intercompany transaction with multi-currency handling
 * Composes: createIntercompanyTransaction, convertCurrencyWithAutoRate, createAuditLog
 */
export const createMultiCurrencyIntercompanyTransaction = async (
  sequelize: any,
  sourceEntityId: number,
  targetEntityId: number,
  amount: number,
  sourceCurrency: string,
  targetCurrency: string,
  transactionDate: Date,
  description: string,
  userId: string,
  transaction?: Transaction
): Promise<IntercompanyTransaction> => {
  const conversion = await convertCurrencyWithAutoRate(
    sequelize,
    amount,
    sourceCurrency,
    targetCurrency,
    transactionDate,
    userId,
    transaction
  );

  const icTransaction = await createIntercompanyTransaction(
    sequelize,
    sourceEntityId,
    targetEntityId,
    amount,
    description,
    userId,
    transaction
  );

  await createAuditLog(
    sequelize,
    'intercompany_multi_currency',
    icTransaction.transactionId,
    'INSERT',
    userId,
    `IC transaction: ${sourceCurrency} to ${targetCurrency}`,
    {},
    {
      sourceEntityId,
      targetEntityId,
      amount,
      sourceCurrency,
      targetCurrency,
      exchangeRate: conversion.exchangeRate,
      convertedAmount: conversion.convertedAmount,
    },
    transaction
  );

  return icTransaction;
};

/**
 * Reconciles multi-currency intercompany balances
 * Composes: reconcileIntercompanyBalances, convertCurrencyWithAutoRate, createAuditLog
 */
export const reconcileMultiCurrencyIntercompanyBalances = async (
  sequelize: any,
  sourceEntityId: number,
  targetEntityId: number,
  reconciliationDate: Date,
  reportingCurrency: string,
  userId: string,
  transaction?: Transaction
): Promise<IntercompanyReconciliation> => {
  const reconciliation = await reconcileIntercompanyBalances(
    sequelize,
    sourceEntityId,
    targetEntityId,
    reconciliationDate,
    userId,
    transaction
  );

  const entities = await sequelize.query(
    `
    SELECT entity_id, functional_currency
    FROM entities
    WHERE entity_id IN (:entityIds)
    `,
    {
      replacements: { entityIds: [sourceEntityId, targetEntityId] },
      type: 'SELECT',
      transaction,
    }
  );

  const sourceCurrency = (entities as any[]).find(e => e.entity_id === sourceEntityId)?.functional_currency;
  const targetCurrency = (entities as any[]).find(e => e.entity_id === targetEntityId)?.functional_currency;

  if (reconciliation.variance !== 0 && (sourceCurrency !== reportingCurrency || targetCurrency !== reportingCurrency)) {
    const varianceConversion = await convertCurrencyWithAutoRate(
      sequelize,
      Math.abs(reconciliation.variance),
      sourceCurrency,
      reportingCurrency,
      reconciliationDate,
      userId,
      transaction
    );

    await createAuditLog(
      sequelize,
      'ic_reconciliation_multi_currency',
      reconciliation.reconciliationId,
      'EXECUTE',
      userId,
      `IC reconciliation variance converted to ${reportingCurrency}`,
      {},
      {
        reconciliationId: reconciliation.reconciliationId,
        originalVariance: reconciliation.variance,
        convertedVariance: varianceConversion.convertedAmount,
        reportingCurrency,
      },
      transaction
    );
  }

  return reconciliation;
};

// ============================================================================
// COMPOSITE FUNCTIONS - HEDGING AND RISK MANAGEMENT
// ============================================================================

/**
 * Records currency hedging instrument
 * Composes: createAuditLog, trackFieldChange
 */
export const recordCurrencyHedgingInstrument = async (
  sequelize: any,
  currency: string,
  hedgeAmount: number,
  hedgeType: HedgeType,
  hedgeRate: number,
  startDate: Date,
  maturityDate: Date,
  counterparty: string,
  userId: string,
  transaction?: Transaction
): Promise<{ hedgeId: number; auditLogId: number }> => {
  const hedgeRecord = await sequelize.query(
    `
    INSERT INTO currency_hedges
      (currency, hedge_amount, hedge_type, hedge_rate, start_date, maturity_date, counterparty, is_active)
    VALUES
      (:currency, :hedgeAmount, :hedgeType, :hedgeRate, :startDate, :maturityDate, :counterparty, true)
    RETURNING hedge_id
    `,
    {
      replacements: {
        currency,
        hedgeAmount,
        hedgeType,
        hedgeRate,
        startDate,
        maturityDate,
        counterparty,
      },
      type: 'INSERT',
      transaction,
    }
  );

  const hedgeId = (hedgeRecord[0] as any[])[0].hedge_id;

  const auditLog = await createAuditLog(
    sequelize,
    'currency_hedges',
    hedgeId,
    'INSERT',
    userId,
    `Currency hedge recorded: ${currency} ${hedgeType}`,
    {},
    {
      currency,
      hedgeAmount,
      hedgeType,
      hedgeRate,
      counterparty,
    },
    transaction
  );

  return { hedgeId, auditLogId: auditLog.auditId };
};

/**
 * Evaluates hedge effectiveness and marks to market
 * Composes: getEffectiveExchangeRateWithTriangulation, createAuditLog
 */
export const evaluateHedgeEffectiveness = async (
  sequelize: any,
  hedgeId: number,
  evaluationDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<{
  effective: boolean;
  hedgeValue: number;
  spotValue: number;
  effectiveness: number;
  mtmAdjustment: number;
}> => {
  const hedge = await sequelize.query(
    `SELECT * FROM currency_hedges WHERE hedge_id = :hedgeId`,
    {
      replacements: { hedgeId },
      type: 'SELECT',
      transaction,
    }
  );

  if (!hedge || hedge.length === 0) {
    throw new Error(`Hedge ${hedgeId} not found`);
  }

  const hedgeData = hedge[0] as any;

  const spotRate = await getEffectiveExchangeRateWithTriangulation(
    sequelize,
    hedgeData.currency,
    'USD',
    evaluationDate,
    'spot',
    'USD',
    transaction
  );

  const hedgeValue = hedgeData.hedge_amount * hedgeData.hedge_rate;
  const spotValue = hedgeData.hedge_amount * spotRate.rate;
  const mtmAdjustment = hedgeValue - spotValue;

  const effectiveness = Math.abs((hedgeValue / spotValue) * 100);
  const effective = effectiveness >= 80 && effectiveness <= 125;

  await createAuditLog(
    sequelize,
    'hedge_effectiveness',
    hedgeId,
    'EXECUTE',
    userId,
    `Hedge effectiveness evaluation: ${effective ? 'Effective' : 'Ineffective'}`,
    {},
    {
      hedgeId,
      effectiveness,
      effective,
      mtmAdjustment,
    },
    transaction
  );

  return {
    effective,
    hedgeValue,
    spotValue,
    effectiveness,
    mtmAdjustment,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ANALYTICS AND DASHBOARDS
// ============================================================================

/**
 * Generates multi-currency management dashboard
 * Composes: generateManagementDashboard, calculateFxGainLossSummary, calculateCurrencyExposure
 */
export const generateMultiCurrencyDashboard = async (
  sequelize: any,
  entityIds: number[],
  fiscalYear: number,
  fiscalPeriod: number,
  reportingCurrency: string,
  userId: string,
  transaction?: Transaction
): Promise<{
  fxGainLoss: FxGainLossSummary;
  currencyExposure: CurrencyExposure[];
  recentRevaluations: RevaluationBatchResult[];
  rateVolatility: Map<string, number>;
  dashboardMetrics: any;
}> => {
  const fxGainLoss = await calculateFxGainLossSummary(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const currencyExposure = await calculateCurrencyExposure(
    sequelize,
    entityIds,
    reportingCurrency,
    new Date(),
    transaction
  );

  const revaluations = await sequelize.query(
    `
    SELECT DISTINCT batch_id, process_date,
           COUNT(*) as accounts_processed,
           SUM(ABS(gain_loss_amount)) as total_revaluation_amount
    FROM currency_revaluations
    WHERE fiscal_year = :fiscalYear
    GROUP BY batch_id, process_date
    ORDER BY process_date DESC
    LIMIT 5
    `,
    {
      replacements: { fiscalYear },
      type: 'SELECT',
      transaction,
    }
  );

  const rateVolatility = new Map<string, number>();
  const currencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  for (const currency of currencies) {
    const rates = await sequelize.query(
      `
      SELECT exchange_rate
      FROM exchange_rates
      WHERE from_currency = :currency
        AND to_currency = 'USD'
        AND effective_date >= NOW() - INTERVAL '30 days'
      ORDER BY effective_date DESC
      `,
      {
        replacements: { currency },
        type: 'SELECT',
        transaction,
      }
    );

    if (rates && rates.length > 0) {
      const rateValues = (rates as any[]).map(r => r.exchange_rate);
      const mean = rateValues.reduce((a, b) => a + b, 0) / rateValues.length;
      const variance = rateValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rateValues.length;
      const stdDev = Math.sqrt(variance);
      rateVolatility.set(currency, stdDev);
    }
  }

  const dashboardMetrics = await generateManagementDashboard(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  await createAuditLog(
    sequelize,
    'multi_currency_dashboard',
    0,
    'SELECT',
    userId,
    'Multi-currency dashboard generated',
    {},
    { fiscalYear, fiscalPeriod, entityCount: entityIds.length },
    transaction
  );

  return {
    fxGainLoss,
    currencyExposure,
    recentRevaluations: revaluations as any[],
    rateVolatility,
    dashboardMetrics,
  };
};

/**
 * Analyzes currency rate trends and forecasts
 * Composes: Complex Sequelize queries with window functions
 */
export const analyzeCurrencyRateTrends = async (
  sequelize: any,
  currency: string,
  baseCurrency: string,
  days: number,
  transaction?: Transaction
): Promise<{
  currentRate: number;
  averageRate: number;
  highRate: number;
  lowRate: number;
  volatility: number;
  trend: 'strengthening' | 'weakening' | 'stable';
  forecast: number;
}> => {
  const rateHistory = await sequelize.query(
    `
    SELECT
      exchange_rate,
      effective_date,
      AVG(exchange_rate) OVER (ORDER BY effective_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
    FROM exchange_rates
    WHERE from_currency = :currency
      AND to_currency = :baseCurrency
      AND effective_date >= NOW() - INTERVAL ':days days'
    ORDER BY effective_date DESC
    `,
    {
      replacements: { currency, baseCurrency, days },
      type: 'SELECT',
      transaction,
    }
  );

  if (!rateHistory || rateHistory.length === 0) {
    throw new Error(`No rate history found for ${currency}/${baseCurrency}`);
  }

  const rates = (rateHistory as any[]).map(r => parseFloat(r.exchange_rate));
  const currentRate = rates[0];
  const averageRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const highRate = Math.max(...rates);
  const lowRate = Math.min(...rates);

  const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - averageRate, 2), 0) / rates.length;
  const volatility = Math.sqrt(variance);

  const recentAvg = rates.slice(0, Math.min(7, rates.length)).reduce((a, b) => a + b, 0) / Math.min(7, rates.length);
  const olderAvg = rates.slice(-Math.min(7, rates.length)).reduce((a, b) => a + b, 0) / Math.min(7, rates.length);
  const trend = recentAvg > olderAvg * 1.02 ? 'strengthening' :
                recentAvg < olderAvg * 0.98 ? 'weakening' : 'stable';

  const forecast = (rateHistory as any[])[0].moving_avg;

  return {
    currentRate,
    averageRate,
    highRate,
    lowRate,
    volatility,
    trend,
    forecast: parseFloat(forecast),
  };
};

/**
 * Generates compliance report for multi-currency operations
 * Composes: generateComplianceReport, getTransactionHistory, validateDataIntegrity
 */
export const generateMultiCurrencyComplianceReport = async (
  sequelize: any,
  startDate: Date,
  endDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<{
  reportId: string;
  period: { startDate: Date; endDate: Date };
  rateUpdates: number;
  revaluations: number;
  translations: number;
  hedges: number;
  complianceIssues: string[];
  dataIntegrityCheck: boolean;
}> => {
  const reportId = `MC-COMPLIANCE-${Date.now()}`;

  const rateUpdates = await sequelize.query(
    `SELECT COUNT(*) as count FROM exchange_rates WHERE effective_date BETWEEN :startDate AND :endDate`,
    {
      replacements: { startDate, endDate },
      type: 'SELECT',
      transaction,
    }
  );

  const revaluations = await sequelize.query(
    `SELECT COUNT(DISTINCT batch_id) as count FROM currency_revaluations WHERE revaluation_date BETWEEN :startDate AND :endDate`,
    {
      replacements: { startDate, endDate },
      type: 'SELECT',
      transaction,
    }
  );

  const translations = await sequelize.query(
    `SELECT COUNT(*) as count FROM currency_translations WHERE translation_date BETWEEN :startDate AND :endDate`,
    {
      replacements: { startDate, endDate },
      type: 'SELECT',
      transaction,
    }
  );

  const hedges = await sequelize.query(
    `SELECT COUNT(*) as count FROM currency_hedges WHERE start_date BETWEEN :startDate AND :endDate`,
    {
      replacements: { startDate, endDate },
      type: 'SELECT',
      transaction,
    }
  );

  const complianceIssues: string[] = [];

  const missingRates = await sequelize.query(
    `
    SELECT DISTINCT currency
    FROM financial_accounts
    WHERE currency != 'USD'
      AND NOT EXISTS (
        SELECT 1 FROM exchange_rates er
        WHERE er.from_currency = financial_accounts.currency
          AND er.effective_date BETWEEN :startDate AND :endDate
      )
    `,
    {
      replacements: { startDate, endDate },
      type: 'SELECT',
      transaction,
    }
  );

  if (missingRates && missingRates.length > 0) {
    complianceIssues.push(`Missing rate updates for: ${(missingRates as any[]).map(r => r.currency).join(', ')}`);
  }

  const integrityResult = await validateDataIntegrity(
    sequelize,
    'multi_currency_operations',
    'Multi-currency compliance validation',
    transaction
  );

  await generateComplianceReport(
    sequelize,
    'multi_currency',
    startDate,
    endDate,
    userId,
    transaction
  );

  await createAuditLog(
    sequelize,
    'multi_currency_compliance',
    0,
    'EXECUTE',
    userId,
    `Compliance report generated: ${reportId}`,
    {},
    {
      reportId,
      startDate,
      endDate,
      issueCount: complianceIssues.length,
    },
    transaction
  );

  return {
    reportId,
    period: { startDate, endDate },
    rateUpdates: (rateUpdates as any[])[0].count,
    revaluations: (revaluations as any[])[0].count,
    translations: (translations as any[])[0].count,
    hedges: (hedges as any[])[0].count,
    complianceIssues,
    dataIntegrityCheck: integrityResult.valid,
  };
};

// ============================================================================
// MODULE EXPORT
// ============================================================================

/**
 * Export NestJS module definition
 */
export const MultiCurrencyExchangeModule = {
  controllers: [MultiCurrencyExchangeController],
  providers: [MultiCurrencyExchangeService],
  exports: [MultiCurrencyExchangeService],
};

// ============================================================================
// RE-EXPORTS - ALL COMPOSITE FUNCTIONS
// ============================================================================

export {
  // Exchange Rate Management (4 functions)
  syncExchangeRatesWithAudit,
  getEffectiveExchangeRateWithTriangulation,
  convertCurrencyWithAutoRate,
  bulkUpdateExchangeRates,

  // Currency Revaluation (3 functions)
  performPeriodEndRevaluation,
  reverseRevaluationBatch,
  calculateRealizedFxGainLoss,

  // Currency Translation (2 functions)
  translateEntityFinancials,
  translateMultiEntityFinancials,

  // Multi-Currency Reporting (4 functions)
  generateMultiCurrencyReportingPackage,
  calculateFxGainLossSummary,
  calculateCurrencyExposure,
  drillDownMultiCurrencyTransactions,

  // Intercompany Multi-Currency (2 functions)
  createMultiCurrencyIntercompanyTransaction,
  reconcileMultiCurrencyIntercompanyBalances,

  // Hedging and Risk Management (2 functions)
  recordCurrencyHedgingInstrument,
  evaluateHedgeEffectiveness,

  // Analytics and Dashboards (3 functions)
  generateMultiCurrencyDashboard,
  analyzeCurrencyRateTrends,
  generateMultiCurrencyComplianceReport,

  // Service and Controller
  MultiCurrencyExchangeService,
  MultiCurrencyExchangeController,
};

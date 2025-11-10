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
 * Purpose: Comprehensive Multi-Currency Exchange Composite - Currency rate management, revaluation, translation, realized/unrealized gains, currency hedging
 *
 * Upstream: Composes functions from multi-currency-management-kit, financial-reporting-analytics-kit,
 *           intercompany-accounting-kit, financial-close-automation-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Currency REST APIs, FX Services, Multi-Currency Reporting, Revaluation Jobs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for currency exchange, rate management, revaluation, translation, triangulation, hedging
 *
 * LLM Context: Enterprise-grade multi-currency exchange composite for White Cross healthcare platform.
 * Provides comprehensive currency exchange rate management with real-time rate updates, automatic revaluation processing,
 * currency translation for consolidation, realized and unrealized foreign exchange gains/losses tracking, currency
 * triangulation for cross-currency conversions, hedging instrument tracking, multi-currency financial reporting,
 * compliance with GAAP/IFRS, and HIPAA-compliant audit trails. Competes with Oracle JD Edwards EnterpriseOne with
 * production-ready multi-currency infrastructure for global healthcare operations.
 *
 * Multi-Currency Design Principles:
 * - Real-time exchange rate synchronization from external sources
 * - Automatic revaluation with configurable schedules
 * - Translation for financial consolidation (current, average, historical methods)
 * - Realized vs unrealized gain/loss segregation
 * - Currency triangulation for non-direct pairs
 * - Hedging instrument integration
 * - Multi-currency reporting with drill-down capabilities
 * - Comprehensive audit trails for regulatory compliance
 */
import { Transaction } from 'sequelize';
import { type ExchangeRate, type CurrencyConversion } from '../multi-currency-management-kit';
import { type BalanceSheetReport, type IncomeStatementReport } from '../financial-reporting-analytics-kit';
import { type IntercompanyTransaction, type IntercompanyReconciliation } from '../intercompany-accounting-kit';
import { type AuditLogEntry } from '../audit-trail-compliance-kit';
/**
 * Multi-currency exchange configuration
 */
export interface MultiCurrencyConfig {
    baseCurrency: string;
    reportingCurrency: string;
    enabledCurrencies: string[];
    rateUpdateFrequency: 'real-time' | 'hourly' | 'daily' | 'manual';
    rateSource: 'external_api' | 'manual_entry' | 'hybrid';
    revaluationSchedule: 'daily' | 'weekly' | 'monthly' | 'quarter-end' | 'year-end';
    translationMethod: 'current' | 'average' | 'historical' | 'temporal';
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
    realized: {
        gains: number;
        losses: number;
        net: number;
    };
    unrealized: {
        gains: number;
        losses: number;
        net: number;
    };
    total: {
        gains: number;
        losses: number;
        net: number;
    };
    byCurrency: Map<string, {
        gains: number;
        losses: number;
    }>;
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
/**
 * Synchronizes exchange rates from external sources with audit logging
 * Composes: createExchangeRateModel, createAuditLog, validateDataIntegrity
 */
export declare const syncExchangeRatesWithAudit: (sequelize: any, userId: string, rateSource: string, transaction?: Transaction) => Promise<RateUpdateResult>;
/**
 * Retrieves effective exchange rate with fallback to triangulation
 * Composes: createExchangeRateModel with triangulation logic
 */
export declare const getEffectiveExchangeRateWithTriangulation: (sequelize: any, fromCurrency: string, toCurrency: string, effectiveDate: Date, rateType?: string, triangulationCurrency?: string, transaction?: Transaction) => Promise<{
    rate: number;
    method: "direct" | "triangulation";
    path?: string[];
}>;
/**
 * Converts amount with automatic rate lookup and triangulation
 * Composes: getEffectiveExchangeRateWithTriangulation, roundCurrencyAmount, createAuditLog
 */
export declare const convertCurrencyWithAutoRate: (sequelize: any, amount: number, fromCurrency: string, toCurrency: string, conversionDate: Date, userId: string, transaction?: Transaction) => Promise<CurrencyConversion>;
/**
 * Updates exchange rates in bulk with validation
 * Composes: createExchangeRateModel, trackFieldChange, validateDataIntegrity
 */
export declare const bulkUpdateExchangeRates: (sequelize: any, rates: Array<{
    from: string;
    to: string;
    rate: number;
    rateType: string;
}>, userId: string, transaction?: Transaction) => Promise<RateUpdateResult>;
/**
 * Performs comprehensive currency revaluation for period-end
 * Composes: createCurrencyRevaluationModel, createAccrual, createAuditLog, performCloseVarianceAnalysis
 */
export declare const performPeriodEndRevaluation: (sequelize: any, fiscalYear: number, fiscalPeriod: number, revaluationDate: Date, userId: string, transaction?: Transaction) => Promise<RevaluationBatchResult>;
/**
 * Reverses previous revaluation entries
 * Composes: createCurrencyRevaluationModel, reverseAccrual, createAuditLog
 */
export declare const reverseRevaluationBatch: (sequelize: any, batchId: string, reversalDate: Date, userId: string, transaction?: Transaction) => Promise<{
    reversed: number;
    errors: string[];
}>;
/**
 * Calculates realized FX gains/losses on transaction settlement
 * Composes: createAuditLog, trackFieldChange
 */
export declare const calculateRealizedFxGainLoss: (sequelize: any, transactionId: string, originalRate: number, settlementRate: number, transactionAmount: number, currency: string, userId: string, transaction?: Transaction) => Promise<{
    realized: number;
    gainOrLoss: "gain" | "loss";
}>;
/**
 * Translates entity financial statements for consolidation
 * Composes: createCurrencyTranslationModel, generateBalanceSheet, generateIncomeStatement, createAuditLog
 */
export declare const translateEntityFinancials: (sequelize: any, entityId: number, sourceCurrency: string, targetCurrency: string, translationDate: Date, translationMethod: "current" | "average" | "historical" | "temporal", fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<TranslationResult>;
/**
 * Performs multi-entity currency translation for consolidation
 * Composes: translateEntityFinancials, initiateConsolidation, createAuditLog
 */
export declare const translateMultiEntityFinancials: (sequelize: any, entityIds: number[], reportingCurrency: string, translationDate: Date, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<TranslationResult[]>;
/**
 * Generates comprehensive multi-currency reporting package
 * Composes: generateConsolidatedFinancials, translateMultiEntityFinancials, generateManagementDashboard
 */
export declare const generateMultiCurrencyReportingPackage: (sequelize: any, entityIds: number[], reportingCurrency: string, reportDate: Date, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<MultiCurrencyReportingPackage>;
/**
 * Calculates FX gain/loss summary for reporting period
 * Composes: createCurrencyRevaluationModel with aggregations
 */
export declare const calculateFxGainLossSummary: (sequelize: any, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<FxGainLossSummary>;
/**
 * Calculates currency exposure across entities
 * Composes: Complex Sequelize queries with joins and aggregations
 */
export declare const calculateCurrencyExposure: (sequelize: any, entityIds: number[], reportingCurrency: string, asOfDate: Date, transaction?: Transaction) => Promise<CurrencyExposure[]>;
/**
 * Drills down into multi-currency transaction details
 * Composes: getDrillDownTransactions, convertCurrencyWithAutoRate, createAuditLog
 */
export declare const drillDownMultiCurrencyTransactions: (sequelize: any, accountCode: string, currency: string, fiscalYear: number, fiscalPeriod: number, reportingCurrency: string, userId: string, transaction?: Transaction) => Promise<MultiCurrencyTransaction[]>;
/**
 * Creates intercompany transaction with multi-currency handling
 * Composes: createIntercompanyTransaction, convertCurrencyWithAutoRate, createAuditLog
 */
export declare const createMultiCurrencyIntercompanyTransaction: (sequelize: any, sourceEntityId: number, targetEntityId: number, amount: number, sourceCurrency: string, targetCurrency: string, transactionDate: Date, description: string, userId: string, transaction?: Transaction) => Promise<IntercompanyTransaction>;
/**
 * Reconciles multi-currency intercompany balances
 * Composes: reconcileIntercompanyBalances, convertCurrencyWithAutoRate, createAuditLog
 */
export declare const reconcileMultiCurrencyIntercompanyBalances: (sequelize: any, sourceEntityId: number, targetEntityId: number, reconciliationDate: Date, reportingCurrency: string, userId: string, transaction?: Transaction) => Promise<IntercompanyReconciliation>;
/**
 * Records currency hedging instrument
 * Composes: createAuditLog, trackFieldChange
 */
export declare const recordCurrencyHedgingInstrument: (sequelize: any, currency: string, hedgeAmount: number, hedgeType: "forward" | "option" | "swap", hedgeRate: number, startDate: Date, maturityDate: Date, counterparty: string, userId: string, transaction?: Transaction) => Promise<{
    hedgeId: number;
    auditLogId: number;
}>;
/**
 * Evaluates hedge effectiveness and marks to market
 * Composes: getEffectiveExchangeRateWithTriangulation, createAuditLog
 */
export declare const evaluateHedgeEffectiveness: (sequelize: any, hedgeId: number, evaluationDate: Date, userId: string, transaction?: Transaction) => Promise<{
    effective: boolean;
    hedgeValue: number;
    spotValue: number;
    effectiveness: number;
    mtmAdjustment: number;
}>;
/**
 * Generates multi-currency management dashboard
 * Composes: generateManagementDashboard, calculateFxGainLossSummary, calculateCurrencyExposure
 */
export declare const generateMultiCurrencyDashboard: (sequelize: any, entityIds: number[], fiscalYear: number, fiscalPeriod: number, reportingCurrency: string, userId: string, transaction?: Transaction) => Promise<{
    fxGainLoss: FxGainLossSummary;
    currencyExposure: CurrencyExposure[];
    recentRevaluations: RevaluationBatchResult[];
    rateVolatility: Map<string, number>;
    dashboardMetrics: any;
}>;
/**
 * Analyzes currency rate trends and forecasts
 * Composes: Complex Sequelize queries with window functions
 */
export declare const analyzeCurrencyRateTrends: (sequelize: any, currency: string, baseCurrency: string, days: number, transaction?: Transaction) => Promise<{
    currentRate: number;
    averageRate: number;
    highRate: number;
    lowRate: number;
    volatility: number;
    trend: "strengthening" | "weakening" | "stable";
    forecast: number;
}>;
/**
 * Generates compliance report for multi-currency operations
 * Composes: generateComplianceReport, getTransactionHistory, validateDataIntegrity
 */
export declare const generateMultiCurrencyComplianceReport: (sequelize: any, startDate: Date, endDate: Date, userId: string, transaction?: Transaction) => Promise<{
    reportId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    rateUpdates: number;
    revaluations: number;
    translations: number;
    hedges: number;
    complianceIssues: string[];
    dataIntegrityCheck: boolean;
}>;
export { syncExchangeRatesWithAudit, getEffectiveExchangeRateWithTriangulation, convertCurrencyWithAutoRate, bulkUpdateExchangeRates, performPeriodEndRevaluation, reverseRevaluationBatch, calculateRealizedFxGainLoss, translateEntityFinancials, translateMultiEntityFinancials, generateMultiCurrencyReportingPackage, calculateFxGainLossSummary, calculateCurrencyExposure, drillDownMultiCurrencyTransactions, createMultiCurrencyIntercompanyTransaction, reconcileMultiCurrencyIntercompanyBalances, recordCurrencyHedgingInstrument, evaluateHedgeEffectiveness, generateMultiCurrencyDashboard, analyzeCurrencyRateTrends, generateMultiCurrencyComplianceReport, };
//# sourceMappingURL=multi-currency-exchange-composite.d.ts.map
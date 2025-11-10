/**
 * LOC: EDWCURR001
 * File: /reuse/edwards/financial/multi-currency-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Multi-currency reporting services
 *   - Foreign exchange services
 *   - International transaction processing
 */
/**
 * File: /reuse/edwards/financial/multi-currency-management-kit.ts
 * Locator: WC-EDW-CURR-001
 * Purpose: Comprehensive Multi-Currency Management - JD Edwards EnterpriseOne-level currency operations, exchange rates, revaluation, translation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Foreign Exchange Services, Multi-Currency Reporting, Currency Translation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for exchange rate management, currency conversion, revaluation, translation, realized/unrealized gains/losses, triangulation, cross-currency, multi-currency reporting
 *
 * LLM Context: Enterprise-grade multi-currency operations competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive currency management, real-time exchange rates, automatic revaluation, currency translation,
 * realized and unrealized foreign exchange gains/losses, triangulation for cross-currency calculations, historical rate tracking,
 * average rate calculation, multi-currency financial reporting, currency hedging support, and GAAP/IFRS compliance.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CurrencyConversion {
    fromCurrency: string;
    toCurrency: string;
    originalAmount: number;
    convertedAmount: number;
    exchangeRate: number;
    conversionDate: Date;
    rateType: string;
    triangulationCurrency?: string;
}
interface RevaluationResult {
    accountId: number;
    accountCode: string;
    currency: string;
    originalBalance: number;
    revaluedBalance: number;
    gainLossAmount: number;
    gainLossType: 'realized' | 'unrealized';
    revaluationDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
}
interface CurrencyTranslation {
    entityId: number;
    accountCode: string;
    originalCurrency: string;
    originalAmount: number;
    reportingCurrency: string;
    translatedAmount: number;
    translationRate: number;
    translationMethod: 'current' | 'average' | 'historical' | 'temporal';
    translationDate: Date;
}
export declare class CreateExchangeRateDto {
    fromCurrency: string;
    toCurrency: string;
    exchangeRate: number;
    effectiveDate: Date;
    rateType: string;
    rateSource: string;
}
export declare class ConvertCurrencyDto {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    conversionDate: Date;
    rateType?: string;
}
export declare class RevaluateAccountDto {
    accountId: number;
    revaluationDate: Date;
    targetCurrency: string;
    rateType?: string;
}
export declare class TranslateCurrencyDto {
    entityId: number;
    translationMethod: string;
    reportingCurrency: string;
    translationDate: Date;
}
/**
 * Sequelize model for Currency Definitions with ISO 4217 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CurrencyDefinition model
 *
 * @example
 * ```typescript
 * const Currency = createCurrencyDefinitionModel(sequelize);
 * const usd = await Currency.create({
 *   currencyCode: 'USD',
 *   currencyName: 'US Dollar',
 *   currencySymbol: '$',
 *   decimalPlaces: 2,
 *   isActive: true
 * });
 * ```
 */
export declare const createCurrencyDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        currencyCode: string;
        currencyName: string;
        currencySymbol: string;
        decimalPlaces: number;
        isActive: boolean;
        isBaseCurrency: boolean;
        countryCode: string;
        numericCode: string;
        minorUnit: number;
        displayFormat: string;
        roundingMethod: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Exchange Rates with rate type support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ExchangeRate model
 *
 * @example
 * ```typescript
 * const ExchangeRate = createExchangeRateModel(sequelize);
 * const rate = await ExchangeRate.create({
 *   fromCurrency: 'USD',
 *   toCurrency: 'EUR',
 *   exchangeRate: 0.85,
 *   effectiveDate: new Date(),
 *   rateType: 'spot'
 * });
 * ```
 */
export declare const createExchangeRateModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fromCurrency: string;
        toCurrency: string;
        effectiveDate: Date;
        expirationDate: Date | null;
        rateType: string;
        exchangeRate: number;
        inverseRate: number;
        spreadRate: number;
        bidRate: number;
        askRate: number;
        rateSource: string;
        rateProvider: string;
        isActive: boolean;
        isDerived: boolean;
        triangulationCurrency: string | null;
        conversionFactor: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Currency Revaluation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CurrencyRevaluation model
 *
 * @example
 * ```typescript
 * const Revaluation = createCurrencyRevaluationModel(sequelize);
 * const result = await Revaluation.create({
 *   accountId: 1,
 *   revaluationDate: new Date(),
 *   originalBalance: 10000,
 *   revaluedBalance: 10500,
 *   gainLossAmount: 500
 * });
 * ```
 */
export declare const createCurrencyRevaluationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        revaluationBatchId: string;
        accountId: number;
        accountCode: string;
        currency: string;
        baseCurrency: string;
        revaluationDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        originalBalance: number;
        originalRate: number;
        revaluationRate: number;
        revaluedBalance: number;
        gainLossAmount: number;
        gainLossType: string;
        gainLossAccount: string;
        journalEntryId: number | null;
        isPosted: boolean;
        postedAt: Date | null;
        reversalId: number | null;
        isReversed: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Currency Translation (consolidation).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CurrencyTranslation model
 *
 * @example
 * ```typescript
 * const Translation = createCurrencyTranslationModel(sequelize);
 * const result = await Translation.create({
 *   entityId: 1,
 *   translationDate: new Date(),
 *   originalCurrency: 'EUR',
 *   reportingCurrency: 'USD',
 *   translationMethod: 'current'
 * });
 * ```
 */
export declare const createCurrencyTranslationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        translationBatchId: string;
        entityId: number;
        entityCode: string;
        accountId: number;
        accountCode: string;
        accountType: string;
        originalCurrency: string;
        reportingCurrency: string;
        translationDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        translationMethod: string;
        originalAmount: number;
        translationRate: number;
        translatedAmount: number;
        cumulativeAdjustment: number;
        translationAdjustment: number;
        journalEntryId: number | null;
        isPosted: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Creates a new currency definition with ISO 4217 validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} currencyData - Currency definition data
 * @param {string} userId - User creating the currency
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created currency definition
 *
 * @example
 * ```typescript
 * const currency = await createCurrencyDefinition(sequelize, {
 *   currencyCode: 'USD',
 *   currencyName: 'US Dollar',
 *   currencySymbol: '$',
 *   decimalPlaces: 2,
 *   numericCode: '840'
 * }, 'user123');
 * ```
 */
export declare function createCurrencyDefinition(sequelize: Sequelize, currencyData: any, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Updates an existing currency definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} currencyCode - Currency code to update
 * @param {object} updateData - Updated currency data
 * @param {string} userId - User updating the currency
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated currency definition
 *
 * @example
 * ```typescript
 * const updated = await updateCurrencyDefinition(sequelize, 'USD', {
 *   isActive: false
 * }, 'user123');
 * ```
 */
export declare function updateCurrencyDefinition(sequelize: Sequelize, currencyCode: string, updateData: any, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves currency definition by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} currencyCode - Currency code to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Currency definition
 *
 * @example
 * ```typescript
 * const usd = await getCurrencyDefinition(sequelize, 'USD');
 * ```
 */
export declare function getCurrencyDefinition(sequelize: Sequelize, currencyCode: string, transaction?: Transaction): Promise<any>;
/**
 * Lists all active currencies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of active currencies
 *
 * @example
 * ```typescript
 * const currencies = await listActiveCurrencies(sequelize);
 * ```
 */
export declare function listActiveCurrencies(sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Retrieves the base currency for the organization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Base currency definition
 *
 * @example
 * ```typescript
 * const baseCurrency = await getBaseCurrency(sequelize);
 * ```
 */
export declare function getBaseCurrency(sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Creates a new exchange rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateExchangeRateDto} rateData - Exchange rate data
 * @param {string} userId - User creating the rate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created exchange rate
 *
 * @example
 * ```typescript
 * const rate = await createExchangeRate(sequelize, {
 *   fromCurrency: 'USD',
 *   toCurrency: 'EUR',
 *   exchangeRate: 0.85,
 *   effectiveDate: new Date(),
 *   rateType: 'spot',
 *   rateSource: 'ECB'
 * }, 'user123');
 * ```
 */
export declare function createExchangeRate(sequelize: Sequelize, rateData: CreateExchangeRateDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Updates an existing exchange rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} rateId - Rate ID to update
 * @param {object} updateData - Updated rate data
 * @param {string} userId - User updating the rate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated exchange rate
 *
 * @example
 * ```typescript
 * const updated = await updateExchangeRate(sequelize, 1, {
 *   exchangeRate: 0.86
 * }, 'user123');
 * ```
 */
export declare function updateExchangeRate(sequelize: Sequelize, rateId: number, updateData: any, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves the current effective exchange rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Date} [effectiveDate=new Date()] - Effective date
 * @param {string} [rateType='spot'] - Rate type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exchange rate
 *
 * @example
 * ```typescript
 * const rate = await getExchangeRate(sequelize, 'USD', 'EUR', new Date(), 'spot');
 * ```
 */
export declare function getExchangeRate(sequelize: Sequelize, fromCurrency: string, toCurrency: string, effectiveDate?: Date, rateType?: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves historical exchange rates for a currency pair.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} [rateType='spot'] - Rate type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of exchange rates
 *
 * @example
 * ```typescript
 * const rates = await getHistoricalExchangeRates(
 *   sequelize, 'USD', 'EUR',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getHistoricalExchangeRates(sequelize: Sequelize, fromCurrency: string, toCurrency: string, startDate: Date, endDate: Date, rateType?: string, transaction?: Transaction): Promise<any[]>;
/**
 * Calculates average exchange rate for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Average exchange rate
 *
 * @example
 * ```typescript
 * const avgRate = await calculateAverageExchangeRate(
 *   sequelize, 'USD', 'EUR',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function calculateAverageExchangeRate(sequelize: Sequelize, fromCurrency: string, toCurrency: string, startDate: Date, endDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Imports bulk exchange rates from external source.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any[]} ratesData - Array of exchange rate data
 * @param {string} rateSource - Rate source identifier
 * @param {string} userId - User importing the rates
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created exchange rates
 *
 * @example
 * ```typescript
 * const rates = await importExchangeRates(sequelize, [
 *   { fromCurrency: 'USD', toCurrency: 'EUR', exchangeRate: 0.85 },
 *   { fromCurrency: 'USD', toCurrency: 'GBP', exchangeRate: 0.73 }
 * ], 'ECB', 'user123');
 * ```
 */
export declare function importExchangeRates(sequelize: Sequelize, ratesData: any[], rateSource: string, userId: string, transaction?: Transaction): Promise<any[]>;
/**
 * Deactivates expired exchange rates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [asOfDate=new Date()] - Date to check expiration
 * @param {string} userId - User deactivating the rates
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rates deactivated
 *
 * @example
 * ```typescript
 * const count = await deactivateExpiredRates(sequelize, new Date(), 'user123');
 * ```
 */
export declare function deactivateExpiredRates(sequelize: Sequelize, asOfDate: Date | undefined, userId: string, transaction?: Transaction): Promise<number>;
/**
 * Retrieves exchange rate by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} rateId - Exchange rate ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exchange rate
 *
 * @example
 * ```typescript
 * const rate = await getExchangeRateById(sequelize, 1);
 * ```
 */
export declare function getExchangeRateById(sequelize: Sequelize, rateId: number, transaction?: Transaction): Promise<any>;
/**
 * Deletes an exchange rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} rateId - Rate ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteExchangeRate(sequelize, 1);
 * ```
 */
export declare function deleteExchangeRate(sequelize: Sequelize, rateId: number, transaction?: Transaction): Promise<void>;
/**
 * Lists all exchange rates for a specific currency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} currencyCode - Currency code
 * @param {boolean} [activeOnly=true] - Whether to return only active rates
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of exchange rates
 *
 * @example
 * ```typescript
 * const rates = await listExchangeRatesForCurrency(sequelize, 'USD');
 * ```
 */
export declare function listExchangeRatesForCurrency(sequelize: Sequelize, currencyCode: string, activeOnly?: boolean, transaction?: Transaction): Promise<any[]>;
/**
 * Converts amount from one currency to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ConvertCurrencyDto} conversionData - Conversion parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyConversion>} Conversion result
 *
 * @example
 * ```typescript
 * const result = await convertCurrency(sequelize, {
 *   amount: 1000,
 *   fromCurrency: 'USD',
 *   toCurrency: 'EUR',
 *   conversionDate: new Date(),
 *   rateType: 'spot'
 * });
 * ```
 */
export declare function convertCurrency(sequelize: Sequelize, conversionData: ConvertCurrencyDto, transaction?: Transaction): Promise<CurrencyConversion>;
/**
 * Converts amount using triangulation through intermediate currency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {string} intermediateCurrency - Intermediate currency
 * @param {Date} [conversionDate=new Date()] - Conversion date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyConversion>} Conversion result with triangulation
 *
 * @example
 * ```typescript
 * const result = await convertCurrencyWithTriangulation(
 *   sequelize, 1000, 'JPY', 'EUR', 'USD', new Date()
 * );
 * ```
 */
export declare function convertCurrencyWithTriangulation(sequelize: Sequelize, amount: number, fromCurrency: string, toCurrency: string, intermediateCurrency: string, conversionDate?: Date, transaction?: Transaction): Promise<CurrencyConversion>;
/**
 * Performs batch currency conversion for multiple amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any[]} conversions - Array of conversion requests
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyConversion[]>} Array of conversion results
 *
 * @example
 * ```typescript
 * const results = await batchConvertCurrency(sequelize, [
 *   { amount: 1000, fromCurrency: 'USD', toCurrency: 'EUR' },
 *   { amount: 2000, fromCurrency: 'USD', toCurrency: 'GBP' }
 * ]);
 * ```
 */
export declare function batchConvertCurrency(sequelize: Sequelize, conversions: ConvertCurrencyDto[], transaction?: Transaction): Promise<CurrencyConversion[]>;
/**
 * Converts amount to base currency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {Date} [conversionDate=new Date()] - Conversion date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyConversion>} Conversion result
 *
 * @example
 * ```typescript
 * const result = await convertToBaseCurrency(sequelize, 1000, 'EUR');
 * ```
 */
export declare function convertToBaseCurrency(sequelize: Sequelize, amount: number, fromCurrency: string, conversionDate?: Date, transaction?: Transaction): Promise<CurrencyConversion>;
/**
 * Converts amount from base currency to target currency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amount - Amount in base currency
 * @param {string} toCurrency - Target currency
 * @param {Date} [conversionDate=new Date()] - Conversion date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyConversion>} Conversion result
 *
 * @example
 * ```typescript
 * const result = await convertFromBaseCurrency(sequelize, 1000, 'EUR');
 * ```
 */
export declare function convertFromBaseCurrency(sequelize: Sequelize, amount: number, toCurrency: string, conversionDate?: Date, transaction?: Transaction): Promise<CurrencyConversion>;
/**
 * Calculates cross-currency conversion rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} [effectiveDate=new Date()] - Effective date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Cross-currency rate
 *
 * @example
 * ```typescript
 * const rate = await calculateCrossCurrencyRate(sequelize, 'EUR', 'GBP');
 * ```
 */
export declare function calculateCrossCurrencyRate(sequelize: Sequelize, fromCurrency: string, toCurrency: string, effectiveDate?: Date, transaction?: Transaction): Promise<number>;
/**
 * Rounds converted amount according to currency rules.
 *
 * @param {number} amount - Amount to round
 * @param {any} currencyDefinition - Currency definition with rounding rules
 * @returns {number} Rounded amount
 *
 * @example
 * ```typescript
 * const rounded = roundCurrencyAmount(123.456, usdDefinition);
 * ```
 */
export declare function roundCurrencyAmount(amount: number, currencyDefinition: any): number;
/**
 * Formats amount according to currency display format.
 *
 * @param {number} amount - Amount to format
 * @param {any} currencyDefinition - Currency definition
 * @returns {string} Formatted amount
 *
 * @example
 * ```typescript
 * const formatted = formatCurrencyAmount(1234.56, usdDefinition);
 * // Returns: "$1,234.56"
 * ```
 */
export declare function formatCurrencyAmount(amount: number, currencyDefinition: any): string;
/**
 * Validates currency conversion parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} conversionDate - Conversion date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Whether conversion is valid
 *
 * @example
 * ```typescript
 * const isValid = await validateCurrencyConversion(
 *   sequelize, 'USD', 'EUR', new Date()
 * );
 * ```
 */
export declare function validateCurrencyConversion(sequelize: Sequelize, fromCurrency: string, toCurrency: string, conversionDate: Date, transaction?: Transaction): Promise<boolean>;
/**
 * Calculates inverse exchange rate.
 *
 * @param {number} exchangeRate - Original exchange rate
 * @returns {number} Inverse rate
 *
 * @example
 * ```typescript
 * const inverse = calculateInverseRate(0.85); // Returns 1.176...
 * ```
 */
export declare function calculateInverseRate(exchangeRate: number): number;
/**
 * Performs currency revaluation for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevaluateAccountDto} revaluationData - Revaluation parameters
 * @param {string} userId - User performing revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevaluationResult>} Revaluation result
 *
 * @example
 * ```typescript
 * const result = await revaluateAccount(sequelize, {
 *   accountId: 1,
 *   revaluationDate: new Date(),
 *   targetCurrency: 'USD',
 *   rateType: 'spot'
 * }, 'user123');
 * ```
 */
export declare function revaluateAccount(sequelize: Sequelize, revaluationData: RevaluateAccountDto, userId: string, transaction?: Transaction): Promise<RevaluationResult>;
/**
 * Performs batch revaluation for multiple accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} accountIds - Array of account IDs to revalue
 * @param {Date} revaluationDate - Revaluation date
 * @param {string} targetCurrency - Target currency
 * @param {string} userId - User performing revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevaluationResult[]>} Array of revaluation results
 *
 * @example
 * ```typescript
 * const results = await batchRevaluateAccounts(
 *   sequelize, [1, 2, 3], new Date(), 'USD', 'user123'
 * );
 * ```
 */
export declare function batchRevaluateAccounts(sequelize: Sequelize, accountIds: number[], revaluationDate: Date, targetCurrency: string, userId: string, transaction?: Transaction): Promise<RevaluationResult[]>;
/**
 * Creates revaluation journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevaluationResult} revaluationResult - Revaluation result
 * @param {string} gainLossAccount - Gain/loss account code
 * @param {string} userId - User creating the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created journal entry
 *
 * @example
 * ```typescript
 * const entry = await createRevaluationJournalEntry(
 *   sequelize, revaluationResult, '7210-FX-GAIN', 'user123'
 * );
 * ```
 */
export declare function createRevaluationJournalEntry(sequelize: Sequelize, revaluationResult: RevaluationResult, gainLossAccount: string, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Calculates unrealized foreign exchange gain/loss.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} asOfDate - As-of date for calculation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Unrealized gain/loss amount
 *
 * @example
 * ```typescript
 * const unrealizedGL = await calculateUnrealizedFxGainLoss(
 *   sequelize, 1, new Date()
 * );
 * ```
 */
export declare function calculateUnrealizedFxGainLoss(sequelize: Sequelize, accountId: number, asOfDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Calculates realized foreign exchange gain/loss.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {number} settlementAmount - Settlement amount
 * @param {Date} settlementDate - Settlement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Realized gain/loss amount
 *
 * @example
 * ```typescript
 * const realizedGL = await calculateRealizedFxGainLoss(
 *   sequelize, 1, 1050, new Date()
 * );
 * ```
 */
export declare function calculateRealizedFxGainLoss(sequelize: Sequelize, transactionId: number, settlementAmount: number, settlementDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Reverses a currency revaluation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} revaluationId - Revaluation ID to reverse
 * @param {string} userId - User reversing the revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal entry
 *
 * @example
 * ```typescript
 * const reversal = await reverseRevaluation(sequelize, 1, 'user123');
 * ```
 */
export declare function reverseRevaluation(sequelize: Sequelize, revaluationId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Gets revaluation history for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of revaluations
 *
 * @example
 * ```typescript
 * const history = await getRevaluationHistory(sequelize, 1);
 * ```
 */
export declare function getRevaluationHistory(sequelize: Sequelize, accountId: number, startDate?: Date, endDate?: Date, transaction?: Transaction): Promise<any[]>;
/**
 * Posts revaluation to general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} revaluationId - Revaluation ID to post
 * @param {string} userId - User posting the revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated revaluation
 *
 * @example
 * ```typescript
 * const posted = await postRevaluation(sequelize, 1, 'user123');
 * ```
 */
export declare function postRevaluation(sequelize: Sequelize, revaluationId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Generates revaluation report for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Revaluation report data
 *
 * @example
 * ```typescript
 * const report = await generateRevaluationReport(sequelize, 2024, 1);
 * ```
 */
export declare function generateRevaluationReport(sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<any[]>;
/**
 * Translates financial statements to reporting currency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TranslateCurrencyDto} translationData - Translation parameters
 * @param {string} userId - User performing translation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyTranslation>} Translation result
 *
 * @example
 * ```typescript
 * const result = await translateFinancialStatements(sequelize, {
 *   entityId: 1,
 *   translationMethod: 'current',
 *   reportingCurrency: 'USD',
 *   translationDate: new Date()
 * }, 'user123');
 * ```
 */
export declare function translateFinancialStatements(sequelize: Sequelize, translationData: TranslateCurrencyDto, userId: string, transaction?: Transaction): Promise<CurrencyTranslation>;
/**
 * Applies current rate method for translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {string} reportingCurrency - Reporting currency
 * @param {Date} translationDate - Translation date
 * @param {string} userId - User performing translation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Translation results
 *
 * @example
 * ```typescript
 * const results = await applyCurrentRateMethod(
 *   sequelize, 1, 'USD', new Date(), 'user123'
 * );
 * ```
 */
export declare function applyCurrentRateMethod(sequelize: Sequelize, entityId: number, reportingCurrency: string, translationDate: Date, userId: string, transaction?: Transaction): Promise<any[]>;
/**
 * Applies temporal method for translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {string} reportingCurrency - Reporting currency
 * @param {Date} translationDate - Translation date
 * @param {string} userId - User performing translation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Translation results
 *
 * @example
 * ```typescript
 * const results = await applyTemporalMethod(
 *   sequelize, 1, 'USD', new Date(), 'user123'
 * );
 * ```
 */
export declare function applyTemporalMethod(sequelize: Sequelize, entityId: number, reportingCurrency: string, translationDate: Date, userId: string, transaction?: Transaction): Promise<any[]>;
/**
 * Calculates cumulative translation adjustment (CTA).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {Date} asOfDate - As-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Cumulative translation adjustment
 *
 * @example
 * ```typescript
 * const cta = await calculateCumulativeTranslationAdjustment(
 *   sequelize, 1, new Date()
 * );
 * ```
 */
export declare function calculateCumulativeTranslationAdjustment(sequelize: Sequelize, entityId: number, asOfDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Posts translation to general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} translationId - Translation ID to post
 * @param {string} userId - User posting the translation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated translation
 *
 * @example
 * ```typescript
 * const posted = await postTranslation(sequelize, 1, 'user123');
 * ```
 */
export declare function postTranslation(sequelize: Sequelize, translationId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Gets translation history for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of translations
 *
 * @example
 * ```typescript
 * const history = await getTranslationHistory(sequelize, 1);
 * ```
 */
export declare function getTranslationHistory(sequelize: Sequelize, entityId: number, startDate?: Date, endDate?: Date, transaction?: Transaction): Promise<any[]>;
/**
 * Generates translation adjustment report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Translation adjustment report data
 *
 * @example
 * ```typescript
 * const report = await generateTranslationAdjustmentReport(
 *   sequelize, 2024, 1
 * );
 * ```
 */
export declare function generateTranslationAdjustmentReport(sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<any[]>;
/**
 * Validates translation method for account type.
 *
 * @param {string} accountType - Account type
 * @param {string} translationMethod - Translation method
 * @returns {boolean} Whether method is valid for account type
 *
 * @example
 * ```typescript
 * const isValid = validateTranslationMethod('asset', 'current');
 * ```
 */
export declare function validateTranslationMethod(accountType: string, translationMethod: string): boolean;
/**
 * Applies historical rate for translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} historicalDate - Historical date for rate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Historical exchange rate
 *
 * @example
 * ```typescript
 * const rate = await getHistoricalRateForTranslation(
 *   sequelize, 'EUR', 'USD', new Date('2020-01-01')
 * );
 * ```
 */
export declare function getHistoricalRateForTranslation(sequelize: Sequelize, fromCurrency: string, toCurrency: string, historicalDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Calculates average rate for period translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Average exchange rate for period
 *
 * @example
 * ```typescript
 * const avgRate = await getAverageRateForPeriod(
 *   sequelize, 'EUR', 'USD',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function getAverageRateForPeriod(sequelize: Sequelize, fromCurrency: string, toCurrency: string, periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<number>;
export {};
//# sourceMappingURL=multi-currency-management-kit.d.ts.map
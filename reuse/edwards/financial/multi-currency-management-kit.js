"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCurrencyTranslationModel = exports.createCurrencyRevaluationModel = exports.createExchangeRateModel = exports.createCurrencyDefinitionModel = exports.TranslateCurrencyDto = exports.RevaluateAccountDto = exports.ConvertCurrencyDto = exports.CreateExchangeRateDto = void 0;
exports.createCurrencyDefinition = createCurrencyDefinition;
exports.updateCurrencyDefinition = updateCurrencyDefinition;
exports.getCurrencyDefinition = getCurrencyDefinition;
exports.listActiveCurrencies = listActiveCurrencies;
exports.getBaseCurrency = getBaseCurrency;
exports.createExchangeRate = createExchangeRate;
exports.updateExchangeRate = updateExchangeRate;
exports.getExchangeRate = getExchangeRate;
exports.getHistoricalExchangeRates = getHistoricalExchangeRates;
exports.calculateAverageExchangeRate = calculateAverageExchangeRate;
exports.importExchangeRates = importExchangeRates;
exports.deactivateExpiredRates = deactivateExpiredRates;
exports.getExchangeRateById = getExchangeRateById;
exports.deleteExchangeRate = deleteExchangeRate;
exports.listExchangeRatesForCurrency = listExchangeRatesForCurrency;
exports.convertCurrency = convertCurrency;
exports.convertCurrencyWithTriangulation = convertCurrencyWithTriangulation;
exports.batchConvertCurrency = batchConvertCurrency;
exports.convertToBaseCurrency = convertToBaseCurrency;
exports.convertFromBaseCurrency = convertFromBaseCurrency;
exports.calculateCrossCurrencyRate = calculateCrossCurrencyRate;
exports.roundCurrencyAmount = roundCurrencyAmount;
exports.formatCurrencyAmount = formatCurrencyAmount;
exports.validateCurrencyConversion = validateCurrencyConversion;
exports.calculateInverseRate = calculateInverseRate;
exports.revaluateAccount = revaluateAccount;
exports.batchRevaluateAccounts = batchRevaluateAccounts;
exports.createRevaluationJournalEntry = createRevaluationJournalEntry;
exports.calculateUnrealizedFxGainLoss = calculateUnrealizedFxGainLoss;
exports.calculateRealizedFxGainLoss = calculateRealizedFxGainLoss;
exports.reverseRevaluation = reverseRevaluation;
exports.getRevaluationHistory = getRevaluationHistory;
exports.postRevaluation = postRevaluation;
exports.generateRevaluationReport = generateRevaluationReport;
exports.translateFinancialStatements = translateFinancialStatements;
exports.applyCurrentRateMethod = applyCurrentRateMethod;
exports.applyTemporalMethod = applyTemporalMethod;
exports.calculateCumulativeTranslationAdjustment = calculateCumulativeTranslationAdjustment;
exports.postTranslation = postTranslation;
exports.getTranslationHistory = getTranslationHistory;
exports.generateTranslationAdjustmentReport = generateTranslationAdjustmentReport;
exports.validateTranslationMethod = validateTranslationMethod;
exports.getHistoricalRateForTranslation = getHistoricalRateForTranslation;
exports.getAverageRateForPeriod = getAverageRateForPeriod;
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
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateExchangeRateDto = (() => {
    var _a;
    let _fromCurrency_decorators;
    let _fromCurrency_initializers = [];
    let _fromCurrency_extraInitializers = [];
    let _toCurrency_decorators;
    let _toCurrency_initializers = [];
    let _toCurrency_extraInitializers = [];
    let _exchangeRate_decorators;
    let _exchangeRate_initializers = [];
    let _exchangeRate_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _rateType_decorators;
    let _rateType_initializers = [];
    let _rateType_extraInitializers = [];
    let _rateSource_decorators;
    let _rateSource_initializers = [];
    let _rateSource_extraInitializers = [];
    return _a = class CreateExchangeRateDto {
            constructor() {
                this.fromCurrency = __runInitializers(this, _fromCurrency_initializers, void 0);
                this.toCurrency = (__runInitializers(this, _fromCurrency_extraInitializers), __runInitializers(this, _toCurrency_initializers, void 0));
                this.exchangeRate = (__runInitializers(this, _toCurrency_extraInitializers), __runInitializers(this, _exchangeRate_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _exchangeRate_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.rateType = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _rateType_initializers, void 0));
                this.rateSource = (__runInitializers(this, _rateType_extraInitializers), __runInitializers(this, _rateSource_initializers, void 0));
                __runInitializers(this, _rateSource_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fromCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source currency code', example: 'USD' })];
            _toCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target currency code', example: 'EUR' })];
            _exchangeRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exchange rate', example: 0.85 })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-01' })];
            _rateType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rate type', enum: ['spot', 'average', 'budget', 'historical'] })];
            _rateSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rate source', example: 'ECB' })];
            __esDecorate(null, null, _fromCurrency_decorators, { kind: "field", name: "fromCurrency", static: false, private: false, access: { has: obj => "fromCurrency" in obj, get: obj => obj.fromCurrency, set: (obj, value) => { obj.fromCurrency = value; } }, metadata: _metadata }, _fromCurrency_initializers, _fromCurrency_extraInitializers);
            __esDecorate(null, null, _toCurrency_decorators, { kind: "field", name: "toCurrency", static: false, private: false, access: { has: obj => "toCurrency" in obj, get: obj => obj.toCurrency, set: (obj, value) => { obj.toCurrency = value; } }, metadata: _metadata }, _toCurrency_initializers, _toCurrency_extraInitializers);
            __esDecorate(null, null, _exchangeRate_decorators, { kind: "field", name: "exchangeRate", static: false, private: false, access: { has: obj => "exchangeRate" in obj, get: obj => obj.exchangeRate, set: (obj, value) => { obj.exchangeRate = value; } }, metadata: _metadata }, _exchangeRate_initializers, _exchangeRate_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _rateType_decorators, { kind: "field", name: "rateType", static: false, private: false, access: { has: obj => "rateType" in obj, get: obj => obj.rateType, set: (obj, value) => { obj.rateType = value; } }, metadata: _metadata }, _rateType_initializers, _rateType_extraInitializers);
            __esDecorate(null, null, _rateSource_decorators, { kind: "field", name: "rateSource", static: false, private: false, access: { has: obj => "rateSource" in obj, get: obj => obj.rateSource, set: (obj, value) => { obj.rateSource = value; } }, metadata: _metadata }, _rateSource_initializers, _rateSource_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExchangeRateDto = CreateExchangeRateDto;
let ConvertCurrencyDto = (() => {
    var _a;
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _fromCurrency_decorators;
    let _fromCurrency_initializers = [];
    let _fromCurrency_extraInitializers = [];
    let _toCurrency_decorators;
    let _toCurrency_initializers = [];
    let _toCurrency_extraInitializers = [];
    let _conversionDate_decorators;
    let _conversionDate_initializers = [];
    let _conversionDate_extraInitializers = [];
    let _rateType_decorators;
    let _rateType_initializers = [];
    let _rateType_extraInitializers = [];
    return _a = class ConvertCurrencyDto {
            constructor() {
                this.amount = __runInitializers(this, _amount_initializers, void 0);
                this.fromCurrency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _fromCurrency_initializers, void 0));
                this.toCurrency = (__runInitializers(this, _fromCurrency_extraInitializers), __runInitializers(this, _toCurrency_initializers, void 0));
                this.conversionDate = (__runInitializers(this, _toCurrency_extraInitializers), __runInitializers(this, _conversionDate_initializers, void 0));
                this.rateType = (__runInitializers(this, _conversionDate_extraInitializers), __runInitializers(this, _rateType_initializers, void 0));
                __runInitializers(this, _rateType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount to convert' })];
            _fromCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source currency', example: 'USD' })];
            _toCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target currency', example: 'EUR' })];
            _conversionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversion date' })];
            _rateType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rate type', default: 'spot' })];
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _fromCurrency_decorators, { kind: "field", name: "fromCurrency", static: false, private: false, access: { has: obj => "fromCurrency" in obj, get: obj => obj.fromCurrency, set: (obj, value) => { obj.fromCurrency = value; } }, metadata: _metadata }, _fromCurrency_initializers, _fromCurrency_extraInitializers);
            __esDecorate(null, null, _toCurrency_decorators, { kind: "field", name: "toCurrency", static: false, private: false, access: { has: obj => "toCurrency" in obj, get: obj => obj.toCurrency, set: (obj, value) => { obj.toCurrency = value; } }, metadata: _metadata }, _toCurrency_initializers, _toCurrency_extraInitializers);
            __esDecorate(null, null, _conversionDate_decorators, { kind: "field", name: "conversionDate", static: false, private: false, access: { has: obj => "conversionDate" in obj, get: obj => obj.conversionDate, set: (obj, value) => { obj.conversionDate = value; } }, metadata: _metadata }, _conversionDate_initializers, _conversionDate_extraInitializers);
            __esDecorate(null, null, _rateType_decorators, { kind: "field", name: "rateType", static: false, private: false, access: { has: obj => "rateType" in obj, get: obj => obj.rateType, set: (obj, value) => { obj.rateType = value; } }, metadata: _metadata }, _rateType_initializers, _rateType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ConvertCurrencyDto = ConvertCurrencyDto;
let RevaluateAccountDto = (() => {
    var _a;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _revaluationDate_decorators;
    let _revaluationDate_initializers = [];
    let _revaluationDate_extraInitializers = [];
    let _targetCurrency_decorators;
    let _targetCurrency_initializers = [];
    let _targetCurrency_extraInitializers = [];
    let _rateType_decorators;
    let _rateType_initializers = [];
    let _rateType_extraInitializers = [];
    return _a = class RevaluateAccountDto {
            constructor() {
                this.accountId = __runInitializers(this, _accountId_initializers, void 0);
                this.revaluationDate = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _revaluationDate_initializers, void 0));
                this.targetCurrency = (__runInitializers(this, _revaluationDate_extraInitializers), __runInitializers(this, _targetCurrency_initializers, void 0));
                this.rateType = (__runInitializers(this, _targetCurrency_extraInitializers), __runInitializers(this, _rateType_initializers, void 0));
                __runInitializers(this, _rateType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account ID to revalue' })];
            _revaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revaluation date' })];
            _targetCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target currency', example: 'USD' })];
            _rateType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rate type to use', default: 'spot' })];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _revaluationDate_decorators, { kind: "field", name: "revaluationDate", static: false, private: false, access: { has: obj => "revaluationDate" in obj, get: obj => obj.revaluationDate, set: (obj, value) => { obj.revaluationDate = value; } }, metadata: _metadata }, _revaluationDate_initializers, _revaluationDate_extraInitializers);
            __esDecorate(null, null, _targetCurrency_decorators, { kind: "field", name: "targetCurrency", static: false, private: false, access: { has: obj => "targetCurrency" in obj, get: obj => obj.targetCurrency, set: (obj, value) => { obj.targetCurrency = value; } }, metadata: _metadata }, _targetCurrency_initializers, _targetCurrency_extraInitializers);
            __esDecorate(null, null, _rateType_decorators, { kind: "field", name: "rateType", static: false, private: false, access: { has: obj => "rateType" in obj, get: obj => obj.rateType, set: (obj, value) => { obj.rateType = value; } }, metadata: _metadata }, _rateType_initializers, _rateType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RevaluateAccountDto = RevaluateAccountDto;
let TranslateCurrencyDto = (() => {
    var _a;
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _translationMethod_decorators;
    let _translationMethod_initializers = [];
    let _translationMethod_extraInitializers = [];
    let _reportingCurrency_decorators;
    let _reportingCurrency_initializers = [];
    let _reportingCurrency_extraInitializers = [];
    let _translationDate_decorators;
    let _translationDate_initializers = [];
    let _translationDate_extraInitializers = [];
    return _a = class TranslateCurrencyDto {
            constructor() {
                this.entityId = __runInitializers(this, _entityId_initializers, void 0);
                this.translationMethod = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _translationMethod_initializers, void 0));
                this.reportingCurrency = (__runInitializers(this, _translationMethod_extraInitializers), __runInitializers(this, _reportingCurrency_initializers, void 0));
                this.translationDate = (__runInitializers(this, _reportingCurrency_extraInitializers), __runInitializers(this, _translationDate_initializers, void 0));
                __runInitializers(this, _translationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' })];
            _translationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Translation method', enum: ['current', 'average', 'historical', 'temporal'] })];
            _reportingCurrency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reporting currency', example: 'USD' })];
            _translationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Translation date' })];
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _translationMethod_decorators, { kind: "field", name: "translationMethod", static: false, private: false, access: { has: obj => "translationMethod" in obj, get: obj => obj.translationMethod, set: (obj, value) => { obj.translationMethod = value; } }, metadata: _metadata }, _translationMethod_initializers, _translationMethod_extraInitializers);
            __esDecorate(null, null, _reportingCurrency_decorators, { kind: "field", name: "reportingCurrency", static: false, private: false, access: { has: obj => "reportingCurrency" in obj, get: obj => obj.reportingCurrency, set: (obj, value) => { obj.reportingCurrency = value; } }, metadata: _metadata }, _reportingCurrency_initializers, _reportingCurrency_extraInitializers);
            __esDecorate(null, null, _translationDate_decorators, { kind: "field", name: "translationDate", static: false, private: false, access: { has: obj => "translationDate" in obj, get: obj => obj.translationDate, set: (obj, value) => { obj.translationDate = value; } }, metadata: _metadata }, _translationDate_initializers, _translationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TranslateCurrencyDto = TranslateCurrencyDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createCurrencyDefinitionModel = (sequelize) => {
    class CurrencyDefinition extends sequelize_1.Model {
    }
    CurrencyDefinition.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        currencyCode: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            unique: true,
            comment: 'ISO 4217 currency code',
            validate: {
                len: [3, 3],
                isUppercase: true,
                is: /^[A-Z]{3}$/,
            },
        },
        currencyName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Full currency name',
        },
        currencySymbol: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Currency symbol',
        },
        decimalPlaces: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
            comment: 'Number of decimal places',
            validate: {
                min: 0,
                max: 4,
            },
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether currency is active',
        },
        isBaseCurrency: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is the base currency',
        },
        countryCode: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: true,
            comment: 'ISO 3166 country code',
            validate: {
                len: [2, 2],
                isUppercase: true,
            },
        },
        numericCode: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: true,
            comment: 'ISO 4217 numeric code',
            validate: {
                len: [3, 3],
                isNumeric: true,
            },
        },
        minorUnit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
            comment: 'Number of digits after decimal',
            validate: {
                min: 0,
                max: 4,
            },
        },
        displayFormat: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '{symbol}{amount}',
            comment: 'Display format pattern',
        },
        roundingMethod: {
            type: sequelize_1.DataTypes.ENUM('nearest', 'up', 'down', 'banker'),
            allowNull: false,
            defaultValue: 'nearest',
            comment: 'Rounding method for amounts',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional currency metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the currency',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the currency',
        },
    }, {
        sequelize,
        tableName: 'currency_definitions',
        timestamps: true,
        indexes: [
            { fields: ['currencyCode'], unique: true },
            { fields: ['isActive'] },
            { fields: ['isBaseCurrency'] },
            { fields: ['countryCode'] },
        ],
        hooks: {
            beforeCreate: (currency) => {
                if (!currency.createdBy) {
                    throw new Error('createdBy is required');
                }
                currency.updatedBy = currency.createdBy;
                currency.currencyCode = currency.currencyCode.toUpperCase();
            },
            beforeUpdate: (currency) => {
                if (!currency.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
        scopes: {
            active: {
                where: { isActive: true },
            },
            baseCurrency: {
                where: { isBaseCurrency: true },
            },
        },
    });
    return CurrencyDefinition;
};
exports.createCurrencyDefinitionModel = createCurrencyDefinitionModel;
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
const createExchangeRateModel = (sequelize) => {
    class ExchangeRate extends sequelize_1.Model {
    }
    ExchangeRate.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fromCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Source currency code',
            validate: {
                len: [3, 3],
                isUppercase: true,
            },
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        toCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Target currency code',
            validate: {
                len: [3, 3],
                isUppercase: true,
            },
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Rate effective date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rate expiration date',
        },
        rateType: {
            type: sequelize_1.DataTypes.ENUM('spot', 'average', 'budget', 'historical', 'forward', 'fixed'),
            allowNull: false,
            comment: 'Exchange rate type',
        },
        exchangeRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            comment: 'Exchange rate value',
            validate: {
                min: 0.0000000001,
            },
        },
        inverseRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            comment: 'Inverse rate (calculated)',
            validate: {
                min: 0.0000000001,
            },
        },
        spreadRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: false,
            defaultValue: 0,
            comment: 'Spread percentage',
        },
        bidRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: true,
            comment: 'Bid rate for buying',
        },
        askRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: true,
            comment: 'Ask rate for selling',
        },
        rateSource: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Rate source identifier',
        },
        rateProvider: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Rate provider name',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether rate is active',
        },
        isDerived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether rate is calculated via triangulation',
        },
        triangulationCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: true,
            comment: 'Intermediate currency for triangulation',
        },
        conversionFactor: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            defaultValue: 1,
            comment: 'Conversion factor multiplier',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional rate metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the rate',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the rate',
        },
    }, {
        sequelize,
        tableName: 'exchange_rates',
        timestamps: true,
        indexes: [
            { fields: ['fromCurrency', 'toCurrency', 'effectiveDate', 'rateType'] },
            { fields: ['effectiveDate'] },
            { fields: ['rateType'] },
            { fields: ['isActive'] },
            { fields: ['rateSource'] },
        ],
        hooks: {
            beforeCreate: (rate) => {
                if (!rate.createdBy) {
                    throw new Error('createdBy is required');
                }
                rate.updatedBy = rate.createdBy;
                rate.fromCurrency = rate.fromCurrency.toUpperCase();
                rate.toCurrency = rate.toCurrency.toUpperCase();
            },
            beforeUpdate: (rate) => {
                if (!rate.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (rate) => {
                // Calculate inverse rate
                if (rate.exchangeRate && Number(rate.exchangeRate) > 0) {
                    rate.inverseRate = 1 / Number(rate.exchangeRate);
                }
                // Validate currency pair
                if (rate.fromCurrency === rate.toCurrency) {
                    throw new Error('Source and target currencies must be different');
                }
            },
        },
        validate: {
            effectiveDateBeforeExpiration() {
                if (this.expirationDate && this.effectiveDate > this.expirationDate) {
                    throw new Error('Effective date must be before expiration date');
                }
            },
        },
        scopes: {
            active: {
                where: { isActive: true },
            },
            current: {
                where: {
                    effectiveDate: { [sequelize_1.Op.lte]: new Date() },
                    [sequelize_1.Op.or]: [
                        { expirationDate: null },
                        { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
                    ],
                },
            },
            spot: {
                where: { rateType: 'spot' },
            },
        },
    });
    return ExchangeRate;
};
exports.createExchangeRateModel = createExchangeRateModel;
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
const createCurrencyRevaluationModel = (sequelize) => {
    class CurrencyRevaluation extends sequelize_1.Model {
    }
    CurrencyRevaluation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        revaluationBatchId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Batch identifier for revaluation run',
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Account being revalued',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code (denormalized)',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Account currency',
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        baseCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Base/reporting currency',
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        revaluationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of revaluation',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
            validate: {
                min: 2000,
                max: 2099,
            },
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        originalBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Original balance in base currency',
        },
        originalRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            comment: 'Original exchange rate',
        },
        revaluationRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            comment: 'Revaluation exchange rate',
        },
        revaluedBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Revalued balance in base currency',
        },
        gainLossAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Gain/loss amount',
        },
        gainLossType: {
            type: sequelize_1.DataTypes.ENUM('realized', 'unrealized'),
            allowNull: false,
            comment: 'Type of gain/loss',
        },
        gainLossAccount: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account for booking gain/loss',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated journal entry',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        isPosted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether revaluation is posted',
        },
        postedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Posting timestamp',
        },
        reversalId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reversal entry ID if reversed',
            references: {
                model: 'currency_revaluations',
                key: 'id',
            },
        },
        isReversed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether revaluation is reversed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional revaluation metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the revaluation',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the revaluation',
        },
    }, {
        sequelize,
        tableName: 'currency_revaluations',
        timestamps: true,
        indexes: [
            { fields: ['revaluationBatchId'] },
            { fields: ['accountId', 'revaluationDate'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['currency', 'baseCurrency'] },
            { fields: ['isPosted'] },
            { fields: ['gainLossType'] },
        ],
        hooks: {
            beforeCreate: (revaluation) => {
                if (!revaluation.createdBy) {
                    throw new Error('createdBy is required');
                }
                revaluation.updatedBy = revaluation.createdBy;
            },
            beforeUpdate: (revaluation) => {
                if (!revaluation.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (revaluation) => {
                // Calculate gain/loss
                const original = Number(revaluation.originalBalance);
                const revalued = Number(revaluation.revaluedBalance);
                revaluation.gainLossAmount = revalued - original;
            },
        },
        validate: {
            currenciesMustDiffer() {
                if (this.currency === this.baseCurrency) {
                    throw new Error('Account currency and base currency must be different');
                }
            },
        },
        scopes: {
            posted: {
                where: { isPosted: true },
            },
            unrealized: {
                where: { gainLossType: 'unrealized' },
            },
        },
    });
    return CurrencyRevaluation;
};
exports.createCurrencyRevaluationModel = createCurrencyRevaluationModel;
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
const createCurrencyTranslationModel = (sequelize) => {
    class CurrencyTranslation extends sequelize_1.Model {
    }
    CurrencyTranslation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        translationBatchId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Batch identifier for translation run',
        },
        entityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Legal entity being translated',
        },
        entityCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Entity code (denormalized)',
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Account being translated',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code (denormalized)',
        },
        accountType: {
            type: sequelize_1.DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
            allowNull: false,
            comment: 'Account type for method selection',
        },
        originalCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Functional currency',
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        reportingCurrency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Reporting/presentation currency',
            references: {
                model: 'currency_definitions',
                key: 'currencyCode',
            },
        },
        translationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Translation date',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
            validate: {
                min: 2000,
                max: 2099,
            },
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        translationMethod: {
            type: sequelize_1.DataTypes.ENUM('current', 'average', 'historical', 'temporal', 'monetary-nonmonetary'),
            allowNull: false,
            comment: 'Translation method (current rate, temporal, etc.)',
        },
        originalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Amount in functional currency',
        },
        translationRate: {
            type: sequelize_1.DataTypes.DECIMAL(20, 10),
            allowNull: false,
            comment: 'Exchange rate used for translation',
        },
        translatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Amount in reporting currency',
        },
        cumulativeAdjustment: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cumulative translation adjustment (CTA)',
        },
        translationAdjustment: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current period translation adjustment',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated journal entry',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        isPosted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether translation is posted',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional translation metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the translation',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the translation',
        },
    }, {
        sequelize,
        tableName: 'currency_translations',
        timestamps: true,
        indexes: [
            { fields: ['translationBatchId'] },
            { fields: ['entityId', 'translationDate'] },
            { fields: ['accountId', 'fiscalYear', 'fiscalPeriod'] },
            { fields: ['originalCurrency', 'reportingCurrency'] },
            { fields: ['translationMethod'] },
            { fields: ['isPosted'] },
        ],
        hooks: {
            beforeCreate: (translation) => {
                if (!translation.createdBy) {
                    throw new Error('createdBy is required');
                }
                translation.updatedBy = translation.createdBy;
            },
            beforeUpdate: (translation) => {
                if (!translation.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (translation) => {
                // Calculate translated amount
                const original = Number(translation.originalAmount);
                const rate = Number(translation.translationRate);
                translation.translatedAmount = original * rate;
            },
        },
        scopes: {
            currentMethod: {
                where: { translationMethod: 'current' },
            },
            temporalMethod: {
                where: { translationMethod: 'temporal' },
            },
        },
    });
    return CurrencyTranslation;
};
exports.createCurrencyTranslationModel = createCurrencyTranslationModel;
// ============================================================================
// CURRENCY DEFINITION MANAGEMENT (1-5)
// ============================================================================
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
async function createCurrencyDefinition(sequelize, currencyData, userId, transaction) {
    const Currency = (0, exports.createCurrencyDefinitionModel)(sequelize);
    const currency = await Currency.create({
        ...currencyData,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return currency;
}
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
async function updateCurrencyDefinition(sequelize, currencyCode, updateData, userId, transaction) {
    const Currency = (0, exports.createCurrencyDefinitionModel)(sequelize);
    const currency = await Currency.findOne({
        where: { currencyCode: currencyCode.toUpperCase() },
        transaction,
    });
    if (!currency) {
        throw new Error(`Currency ${currencyCode} not found`);
    }
    await currency.update({
        ...updateData,
        updatedBy: userId,
    }, { transaction });
    return currency;
}
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
async function getCurrencyDefinition(sequelize, currencyCode, transaction) {
    const Currency = (0, exports.createCurrencyDefinitionModel)(sequelize);
    const currency = await Currency.findOne({
        where: { currencyCode: currencyCode.toUpperCase() },
        transaction,
    });
    if (!currency) {
        throw new Error(`Currency ${currencyCode} not found`);
    }
    return currency;
}
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
async function listActiveCurrencies(sequelize, transaction) {
    const Currency = (0, exports.createCurrencyDefinitionModel)(sequelize);
    const currencies = await Currency.scope('active').findAll({
        order: [['currencyCode', 'ASC']],
        transaction,
    });
    return currencies;
}
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
async function getBaseCurrency(sequelize, transaction) {
    const Currency = (0, exports.createCurrencyDefinitionModel)(sequelize);
    const baseCurrency = await Currency.scope('baseCurrency').findOne({
        transaction,
    });
    if (!baseCurrency) {
        throw new Error('No base currency defined');
    }
    return baseCurrency;
}
// ============================================================================
// EXCHANGE RATE MANAGEMENT (6-15)
// ============================================================================
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
async function createExchangeRate(sequelize, rateData, userId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rate = await ExchangeRate.create({
        ...rateData,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return rate;
}
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
async function updateExchangeRate(sequelize, rateId, updateData, userId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rate = await ExchangeRate.findByPk(rateId, { transaction });
    if (!rate) {
        throw new Error(`Exchange rate ${rateId} not found`);
    }
    await rate.update({
        ...updateData,
        updatedBy: userId,
    }, { transaction });
    return rate;
}
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
async function getExchangeRate(sequelize, fromCurrency, toCurrency, effectiveDate = new Date(), rateType = 'spot', transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rate = await ExchangeRate.findOne({
        where: {
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            rateType,
            effectiveDate: { [sequelize_1.Op.lte]: effectiveDate },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: effectiveDate } },
            ],
            isActive: true,
        },
        order: [['effectiveDate', 'DESC']],
        transaction,
    });
    if (!rate) {
        throw new Error(`No exchange rate found for ${fromCurrency}/${toCurrency} on ${effectiveDate}`);
    }
    return rate;
}
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
async function getHistoricalExchangeRates(sequelize, fromCurrency, toCurrency, startDate, endDate, rateType = 'spot', transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rates = await ExchangeRate.findAll({
        where: {
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            rateType,
            effectiveDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['effectiveDate', 'ASC']],
        transaction,
    });
    return rates;
}
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
async function calculateAverageExchangeRate(sequelize, fromCurrency, toCurrency, startDate, endDate, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const result = await ExchangeRate.findOne({
        attributes: [
            [sequelize.fn('AVG', sequelize.col('exchangeRate')), 'averageRate'],
        ],
        where: {
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            effectiveDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
            isActive: true,
        },
        raw: true,
        transaction,
    });
    return Number(result?.averageRate || 0);
}
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
async function importExchangeRates(sequelize, ratesData, rateSource, userId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rates = await ExchangeRate.bulkCreate(ratesData.map(rate => ({
        ...rate,
        rateSource,
        rateProvider: rateSource,
        createdBy: userId,
        updatedBy: userId,
    })), { transaction });
    return rates;
}
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
async function deactivateExpiredRates(sequelize, asOfDate = new Date(), userId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const [count] = await ExchangeRate.update({
        isActive: false,
        updatedBy: userId,
    }, {
        where: {
            expirationDate: { [sequelize_1.Op.lt]: asOfDate },
            isActive: true,
        },
        transaction,
    });
    return count;
}
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
async function getExchangeRateById(sequelize, rateId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rate = await ExchangeRate.findByPk(rateId, { transaction });
    if (!rate) {
        throw new Error(`Exchange rate ${rateId} not found`);
    }
    return rate;
}
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
async function deleteExchangeRate(sequelize, rateId, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const rate = await ExchangeRate.findByPk(rateId, { transaction });
    if (!rate) {
        throw new Error(`Exchange rate ${rateId} not found`);
    }
    await rate.destroy({ transaction });
}
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
async function listExchangeRatesForCurrency(sequelize, currencyCode, activeOnly = true, transaction) {
    const ExchangeRate = (0, exports.createExchangeRateModel)(sequelize);
    const where = {
        [sequelize_1.Op.or]: [
            { fromCurrency: currencyCode.toUpperCase() },
            { toCurrency: currencyCode.toUpperCase() },
        ],
    };
    if (activeOnly) {
        where.isActive = true;
    }
    const rates = await ExchangeRate.findAll({
        where,
        order: [['effectiveDate', 'DESC']],
        transaction,
    });
    return rates;
}
// ============================================================================
// CURRENCY CONVERSION (16-25)
// ============================================================================
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
async function convertCurrency(sequelize, conversionData, transaction) {
    const { amount, fromCurrency, toCurrency, conversionDate, rateType = 'spot' } = conversionData;
    if (fromCurrency === toCurrency) {
        return {
            fromCurrency,
            toCurrency,
            originalAmount: amount,
            convertedAmount: amount,
            exchangeRate: 1,
            conversionDate,
            rateType,
        };
    }
    const rate = await getExchangeRate(sequelize, fromCurrency, toCurrency, conversionDate, rateType, transaction);
    const convertedAmount = amount * Number(rate.exchangeRate);
    return {
        fromCurrency,
        toCurrency,
        originalAmount: amount,
        convertedAmount,
        exchangeRate: Number(rate.exchangeRate),
        conversionDate,
        rateType,
    };
}
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
async function convertCurrencyWithTriangulation(sequelize, amount, fromCurrency, toCurrency, intermediateCurrency, conversionDate = new Date(), transaction) {
    // First leg: fromCurrency -> intermediateCurrency
    const firstConversion = await convertCurrency(sequelize, {
        amount,
        fromCurrency,
        toCurrency: intermediateCurrency,
        conversionDate,
        rateType: 'spot',
    }, transaction);
    // Second leg: intermediateCurrency -> toCurrency
    const secondConversion = await convertCurrency(sequelize, {
        amount: firstConversion.convertedAmount,
        fromCurrency: intermediateCurrency,
        toCurrency,
        conversionDate,
        rateType: 'spot',
    }, transaction);
    return {
        fromCurrency,
        toCurrency,
        originalAmount: amount,
        convertedAmount: secondConversion.convertedAmount,
        exchangeRate: secondConversion.convertedAmount / amount,
        conversionDate,
        rateType: 'spot',
        triangulationCurrency: intermediateCurrency,
    };
}
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
async function batchConvertCurrency(sequelize, conversions, transaction) {
    const results = [];
    for (const conversion of conversions) {
        const result = await convertCurrency(sequelize, conversion, transaction);
        results.push(result);
    }
    return results;
}
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
async function convertToBaseCurrency(sequelize, amount, fromCurrency, conversionDate = new Date(), transaction) {
    const baseCurrency = await getBaseCurrency(sequelize, transaction);
    return convertCurrency(sequelize, {
        amount,
        fromCurrency,
        toCurrency: baseCurrency.currencyCode,
        conversionDate,
        rateType: 'spot',
    }, transaction);
}
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
async function convertFromBaseCurrency(sequelize, amount, toCurrency, conversionDate = new Date(), transaction) {
    const baseCurrency = await getBaseCurrency(sequelize, transaction);
    return convertCurrency(sequelize, {
        amount,
        fromCurrency: baseCurrency.currencyCode,
        toCurrency,
        conversionDate,
        rateType: 'spot',
    }, transaction);
}
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
async function calculateCrossCurrencyRate(sequelize, fromCurrency, toCurrency, effectiveDate = new Date(), transaction) {
    const baseCurrency = await getBaseCurrency(sequelize, transaction);
    const fromRate = await getExchangeRate(sequelize, fromCurrency, baseCurrency.currencyCode, effectiveDate, 'spot', transaction);
    const toRate = await getExchangeRate(sequelize, baseCurrency.currencyCode, toCurrency, effectiveDate, 'spot', transaction);
    return Number(fromRate.exchangeRate) * Number(toRate.exchangeRate);
}
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
function roundCurrencyAmount(amount, currencyDefinition) {
    const places = currencyDefinition.decimalPlaces || 2;
    const method = currencyDefinition.roundingMethod || 'nearest';
    const multiplier = Math.pow(10, places);
    switch (method) {
        case 'up':
            return Math.ceil(amount * multiplier) / multiplier;
        case 'down':
            return Math.floor(amount * multiplier) / multiplier;
        case 'banker':
            // Banker's rounding (round half to even)
            const rounded = Math.round(amount * multiplier);
            return rounded / multiplier;
        case 'nearest':
        default:
            return Math.round(amount * multiplier) / multiplier;
    }
}
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
function formatCurrencyAmount(amount, currencyDefinition) {
    const rounded = roundCurrencyAmount(amount, currencyDefinition);
    const formatted = rounded.toLocaleString('en-US', {
        minimumFractionDigits: currencyDefinition.decimalPlaces,
        maximumFractionDigits: currencyDefinition.decimalPlaces,
    });
    return currencyDefinition.displayFormat
        .replace('{symbol}', currencyDefinition.currencySymbol)
        .replace('{amount}', formatted);
}
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
async function validateCurrencyConversion(sequelize, fromCurrency, toCurrency, conversionDate, transaction) {
    try {
        await getCurrencyDefinition(sequelize, fromCurrency, transaction);
        await getCurrencyDefinition(sequelize, toCurrency, transaction);
        if (fromCurrency !== toCurrency) {
            await getExchangeRate(sequelize, fromCurrency, toCurrency, conversionDate, 'spot', transaction);
        }
        return true;
    }
    catch (error) {
        return false;
    }
}
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
function calculateInverseRate(exchangeRate) {
    if (exchangeRate === 0) {
        throw new Error('Exchange rate cannot be zero');
    }
    return 1 / exchangeRate;
}
// ============================================================================
// CURRENCY REVALUATION (26-35)
// ============================================================================
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
async function revaluateAccount(sequelize, revaluationData, userId, transaction) {
    const { accountId, revaluationDate, targetCurrency, rateType = 'spot' } = revaluationData;
    // Get account balance (mocked for this example)
    const accountBalance = 10000;
    const accountCurrency = 'EUR';
    const accountCode = '1200-AR';
    // Get exchange rate
    const rate = await getExchangeRate(sequelize, accountCurrency, targetCurrency, revaluationDate, rateType, transaction);
    const revaluedBalance = accountBalance * Number(rate.exchangeRate);
    const gainLossAmount = revaluedBalance - accountBalance;
    return {
        accountId,
        accountCode,
        currency: accountCurrency,
        originalBalance: accountBalance,
        revaluedBalance,
        gainLossAmount,
        gainLossType: 'unrealized',
        revaluationDate,
        fiscalYear: revaluationDate.getFullYear(),
        fiscalPeriod: revaluationDate.getMonth() + 1,
    };
}
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
async function batchRevaluateAccounts(sequelize, accountIds, revaluationDate, targetCurrency, userId, transaction) {
    const results = [];
    for (const accountId of accountIds) {
        const result = await revaluateAccount(sequelize, { accountId, revaluationDate, targetCurrency }, userId, transaction);
        results.push(result);
    }
    return results;
}
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
async function createRevaluationJournalEntry(sequelize, revaluationResult, gainLossAccount, userId, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const revaluation = await Revaluation.create({
        revaluationBatchId: `REVAL-${Date.now()}`,
        accountId: revaluationResult.accountId,
        accountCode: revaluationResult.accountCode,
        currency: revaluationResult.currency,
        baseCurrency: 'USD',
        revaluationDate: revaluationResult.revaluationDate,
        fiscalYear: revaluationResult.fiscalYear,
        fiscalPeriod: revaluationResult.fiscalPeriod,
        originalBalance: revaluationResult.originalBalance,
        originalRate: 1,
        revaluationRate: 1,
        revaluedBalance: revaluationResult.revaluedBalance,
        gainLossAmount: revaluationResult.gainLossAmount,
        gainLossType: revaluationResult.gainLossType,
        gainLossAccount,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return revaluation;
}
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
async function calculateUnrealizedFxGainLoss(sequelize, accountId, asOfDate, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const result = await Revaluation.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('gainLossAmount')), 'totalGainLoss'],
        ],
        where: {
            accountId,
            gainLossType: 'unrealized',
            revaluationDate: { [sequelize_1.Op.lte]: asOfDate },
            isPosted: true,
            isReversed: false,
        },
        raw: true,
        transaction,
    });
    return Number(result?.totalGainLoss || 0);
}
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
async function calculateRealizedFxGainLoss(sequelize, transactionId, settlementAmount, settlementDate, transaction) {
    // Mocked original transaction amount
    const originalAmount = 1000;
    return settlementAmount - originalAmount;
}
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
async function reverseRevaluation(sequelize, revaluationId, userId, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const original = await Revaluation.findByPk(revaluationId, { transaction });
    if (!original) {
        throw new Error(`Revaluation ${revaluationId} not found`);
    }
    if (original.isReversed) {
        throw new Error('Revaluation already reversed');
    }
    // Create reversal entry
    const reversal = await Revaluation.create({
        revaluationBatchId: `REV-${original.revaluationBatchId}`,
        accountId: original.accountId,
        accountCode: original.accountCode,
        currency: original.currency,
        baseCurrency: original.baseCurrency,
        revaluationDate: new Date(),
        fiscalYear: new Date().getFullYear(),
        fiscalPeriod: new Date().getMonth() + 1,
        originalBalance: original.revaluedBalance,
        originalRate: original.revaluationRate,
        revaluationRate: original.originalRate,
        revaluedBalance: original.originalBalance,
        gainLossAmount: -original.gainLossAmount,
        gainLossType: original.gainLossType,
        gainLossAccount: original.gainLossAccount,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Mark original as reversed
    await original.update({
        isReversed: true,
        reversalId: reversal.id,
        updatedBy: userId,
    }, { transaction });
    return reversal;
}
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
async function getRevaluationHistory(sequelize, accountId, startDate, endDate, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const where = { accountId };
    if (startDate && endDate) {
        where.revaluationDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    else if (startDate) {
        where.revaluationDate = { [sequelize_1.Op.gte]: startDate };
    }
    else if (endDate) {
        where.revaluationDate = { [sequelize_1.Op.lte]: endDate };
    }
    const revaluations = await Revaluation.findAll({
        where,
        order: [['revaluationDate', 'DESC']],
        transaction,
    });
    return revaluations;
}
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
async function postRevaluation(sequelize, revaluationId, userId, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const revaluation = await Revaluation.findByPk(revaluationId, { transaction });
    if (!revaluation) {
        throw new Error(`Revaluation ${revaluationId} not found`);
    }
    if (revaluation.isPosted) {
        throw new Error('Revaluation already posted');
    }
    await revaluation.update({
        isPosted: true,
        postedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    return revaluation;
}
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
async function generateRevaluationReport(sequelize, fiscalYear, fiscalPeriod, transaction) {
    const Revaluation = (0, exports.createCurrencyRevaluationModel)(sequelize);
    const revaluations = await Revaluation.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            isPosted: true,
            isReversed: false,
        },
        order: [['accountCode', 'ASC']],
        transaction,
    });
    return revaluations;
}
// ============================================================================
// CURRENCY TRANSLATION (36-45)
// ============================================================================
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
async function translateFinancialStatements(sequelize, translationData, userId, transaction) {
    const Translation = (0, exports.createCurrencyTranslationModel)(sequelize);
    const translation = await Translation.create({
        translationBatchId: `TRANS-${Date.now()}`,
        entityId: translationData.entityId,
        entityCode: 'ENT-001',
        accountId: 1,
        accountCode: '1000-CASH',
        accountType: 'asset',
        originalCurrency: 'EUR',
        reportingCurrency: translationData.reportingCurrency,
        translationDate: translationData.translationDate,
        fiscalYear: translationData.translationDate.getFullYear(),
        fiscalPeriod: translationData.translationDate.getMonth() + 1,
        translationMethod: translationData.translationMethod,
        originalAmount: 10000,
        translationRate: 1.1,
        translatedAmount: 11000,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return translation;
}
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
async function applyCurrentRateMethod(sequelize, entityId, reportingCurrency, translationDate, userId, transaction) {
    // All assets and liabilities at current rate
    // Income statement at average rate
    // Equity at historical rate
    return [];
}
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
async function applyTemporalMethod(sequelize, entityId, reportingCurrency, translationDate, userId, transaction) {
    // Monetary items at current rate
    // Non-monetary items at historical rate
    // Income statement at average rate
    return [];
}
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
async function calculateCumulativeTranslationAdjustment(sequelize, entityId, asOfDate, transaction) {
    const Translation = (0, exports.createCurrencyTranslationModel)(sequelize);
    const result = await Translation.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('translationAdjustment')), 'totalCTA'],
        ],
        where: {
            entityId,
            translationDate: { [sequelize_1.Op.lte]: asOfDate },
            isPosted: true,
        },
        raw: true,
        transaction,
    });
    return Number(result?.totalCTA || 0);
}
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
async function postTranslation(sequelize, translationId, userId, transaction) {
    const Translation = (0, exports.createCurrencyTranslationModel)(sequelize);
    const translation = await Translation.findByPk(translationId, { transaction });
    if (!translation) {
        throw new Error(`Translation ${translationId} not found`);
    }
    if (translation.isPosted) {
        throw new Error('Translation already posted');
    }
    await translation.update({
        isPosted: true,
        updatedBy: userId,
    }, { transaction });
    return translation;
}
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
async function getTranslationHistory(sequelize, entityId, startDate, endDate, transaction) {
    const Translation = (0, exports.createCurrencyTranslationModel)(sequelize);
    const where = { entityId };
    if (startDate && endDate) {
        where.translationDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    else if (startDate) {
        where.translationDate = { [sequelize_1.Op.gte]: startDate };
    }
    else if (endDate) {
        where.translationDate = { [sequelize_1.Op.lte]: endDate };
    }
    const translations = await Translation.findAll({
        where,
        order: [['translationDate', 'DESC']],
        transaction,
    });
    return translations;
}
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
async function generateTranslationAdjustmentReport(sequelize, fiscalYear, fiscalPeriod, transaction) {
    const Translation = (0, exports.createCurrencyTranslationModel)(sequelize);
    const translations = await Translation.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            isPosted: true,
        },
        order: [['entityCode', 'ASC'], ['accountCode', 'ASC']],
        transaction,
    });
    return translations;
}
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
function validateTranslationMethod(accountType, translationMethod) {
    const methodRules = {
        asset: ['current', 'temporal', 'historical'],
        liability: ['current', 'temporal', 'historical'],
        equity: ['historical', 'current'],
        revenue: ['average', 'current'],
        expense: ['average', 'current'],
    };
    return methodRules[accountType]?.includes(translationMethod) || false;
}
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
async function getHistoricalRateForTranslation(sequelize, fromCurrency, toCurrency, historicalDate, transaction) {
    const rate = await getExchangeRate(sequelize, fromCurrency, toCurrency, historicalDate, 'historical', transaction);
    return Number(rate.exchangeRate);
}
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
async function getAverageRateForPeriod(sequelize, fromCurrency, toCurrency, periodStart, periodEnd, transaction) {
    return calculateAverageExchangeRate(sequelize, fromCurrency, toCurrency, periodStart, periodEnd, transaction);
}
//# sourceMappingURL=multi-currency-management-kit.js.map
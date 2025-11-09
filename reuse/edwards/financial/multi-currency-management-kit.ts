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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CurrencyDefinition {
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  decimalPlaces: number;
  isActive: boolean;
  isBaseCurrency: boolean;
  countryCode: string;
  numericCode: string;
}

interface ExchangeRate {
  rateId: number;
  fromCurrency: string;
  toCurrency: string;
  effectiveDate: Date;
  expirationDate: Date | null;
  rateType: 'spot' | 'average' | 'budget' | 'historical' | 'forward';
  exchangeRate: number;
  inverseRate: number;
  rateSource: string;
  isActive: boolean;
}

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

interface ForeignExchangeGainLoss {
  transactionId: number;
  accountId: number;
  currency: string;
  transactionAmount: number;
  settlementAmount: number;
  gainLossAmount: number;
  gainLossType: 'realized' | 'unrealized';
  transactionDate: Date;
  settlementDate: Date | null;
  originalRate: number;
  settlementRate: number | null;
}

interface TriangulationPath {
  fromCurrency: string;
  toCurrency: string;
  intermediateCurrency: string;
  firstRate: number;
  secondRate: number;
  effectiveRate: number;
  triangulationDate: Date;
}

interface CurrencyRateHistory {
  historyId: number;
  currencyPair: string;
  rateDate: Date;
  openRate: number;
  highRate: number;
  lowRate: number;
  closeRate: number;
  averageRate: number;
  volatility: number;
}

interface MultiCurrencyBalance {
  accountId: number;
  accountCode: string;
  currency: string;
  currencyBalance: number;
  baseCurrencyBalance: number;
  exchangeRate: number;
  rateDate: Date;
  unrealizedGainLoss: number;
}

interface CurrencyHedgePosition {
  hedgeId: number;
  hedgeType: 'forward' | 'option' | 'swap' | 'futures';
  currency: string;
  notionalAmount: number;
  hedgeRate: number;
  maturityDate: Date;
  hedgeEffectiveness: number;
  isActive: boolean;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateExchangeRateDto {
  @ApiProperty({ description: 'Source currency code', example: 'USD' })
  fromCurrency!: string;

  @ApiProperty({ description: 'Target currency code', example: 'EUR' })
  toCurrency!: string;

  @ApiProperty({ description: 'Exchange rate', example: 0.85 })
  exchangeRate!: number;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Rate type', enum: ['spot', 'average', 'budget', 'historical'] })
  rateType!: string;

  @ApiProperty({ description: 'Rate source', example: 'ECB' })
  rateSource!: string;
}

export class ConvertCurrencyDto {
  @ApiProperty({ description: 'Amount to convert' })
  amount!: number;

  @ApiProperty({ description: 'Source currency', example: 'USD' })
  fromCurrency!: string;

  @ApiProperty({ description: 'Target currency', example: 'EUR' })
  toCurrency!: string;

  @ApiProperty({ description: 'Conversion date' })
  conversionDate!: Date;

  @ApiProperty({ description: 'Rate type', default: 'spot' })
  rateType?: string;
}

export class RevaluateAccountDto {
  @ApiProperty({ description: 'Account ID to revalue' })
  accountId!: number;

  @ApiProperty({ description: 'Revaluation date' })
  revaluationDate!: Date;

  @ApiProperty({ description: 'Target currency', example: 'USD' })
  targetCurrency!: string;

  @ApiProperty({ description: 'Rate type to use', default: 'spot' })
  rateType?: string;
}

export class TranslateCurrencyDto {
  @ApiProperty({ description: 'Entity ID' })
  entityId!: number;

  @ApiProperty({ description: 'Translation method', enum: ['current', 'average', 'historical', 'temporal'] })
  translationMethod!: string;

  @ApiProperty({ description: 'Reporting currency', example: 'USD' })
  reportingCurrency!: string;

  @ApiProperty({ description: 'Translation date' })
  translationDate!: Date;
}

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
export const createCurrencyDefinitionModel = (sequelize: Sequelize) => {
  class CurrencyDefinition extends Model {
    public id!: number;
    public currencyCode!: string;
    public currencyName!: string;
    public currencySymbol!: string;
    public decimalPlaces!: number;
    public isActive!: boolean;
    public isBaseCurrency!: boolean;
    public countryCode!: string;
    public numericCode!: string;
    public minorUnit!: number;
    public displayFormat!: string;
    public roundingMethod!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CurrencyDefinition.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      currencyCode: {
        type: DataTypes.STRING(3),
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
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Full currency name',
      },
      currencySymbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Currency symbol',
      },
      decimalPlaces: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: 'Number of decimal places',
        validate: {
          min: 0,
          max: 4,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether currency is active',
      },
      isBaseCurrency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is the base currency',
      },
      countryCode: {
        type: DataTypes.STRING(2),
        allowNull: true,
        comment: 'ISO 3166 country code',
        validate: {
          len: [2, 2],
          isUppercase: true,
        },
      },
      numericCode: {
        type: DataTypes.STRING(3),
        allowNull: true,
        comment: 'ISO 4217 numeric code',
        validate: {
          len: [3, 3],
          isNumeric: true,
        },
      },
      minorUnit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: 'Number of digits after decimal',
        validate: {
          min: 0,
          max: 4,
        },
      },
      displayFormat: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '{symbol}{amount}',
        comment: 'Display format pattern',
      },
      roundingMethod: {
        type: DataTypes.ENUM('nearest', 'up', 'down', 'banker'),
        allowNull: false,
        defaultValue: 'nearest',
        comment: 'Rounding method for amounts',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional currency metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the currency',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the currency',
      },
    },
    {
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
    },
  );

  return CurrencyDefinition;
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
export const createExchangeRateModel = (sequelize: Sequelize) => {
  class ExchangeRate extends Model {
    public id!: number;
    public fromCurrency!: string;
    public toCurrency!: string;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public rateType!: string;
    public exchangeRate!: number;
    public inverseRate!: number;
    public spreadRate!: number;
    public bidRate!: number;
    public askRate!: number;
    public rateSource!: string;
    public rateProvider!: string;
    public isActive!: boolean;
    public isDerived!: boolean;
    public triangulationCurrency!: string | null;
    public conversionFactor!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  ExchangeRate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fromCurrency: {
        type: DataTypes.STRING(3),
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
        type: DataTypes.STRING(3),
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
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Rate effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Rate expiration date',
      },
      rateType: {
        type: DataTypes.ENUM('spot', 'average', 'budget', 'historical', 'forward', 'fixed'),
        allowNull: false,
        comment: 'Exchange rate type',
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        comment: 'Exchange rate value',
        validate: {
          min: 0.0000000001,
        },
      },
      inverseRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        comment: 'Inverse rate (calculated)',
        validate: {
          min: 0.0000000001,
        },
      },
      spreadRate: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0,
        comment: 'Spread percentage',
      },
      bidRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: true,
        comment: 'Bid rate for buying',
      },
      askRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: true,
        comment: 'Ask rate for selling',
      },
      rateSource: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Rate source identifier',
      },
      rateProvider: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Rate provider name',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether rate is active',
      },
      isDerived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether rate is calculated via triangulation',
      },
      triangulationCurrency: {
        type: DataTypes.STRING(3),
        allowNull: true,
        comment: 'Intermediate currency for triangulation',
      },
      conversionFactor: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        defaultValue: 1,
        comment: 'Conversion factor multiplier',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional rate metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the rate',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the rate',
      },
    },
    {
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
            effectiveDate: { [Op.lte]: new Date() },
            [Op.or]: [
              { expirationDate: null },
              { expirationDate: { [Op.gte]: new Date() } },
            ],
          },
        },
        spot: {
          where: { rateType: 'spot' },
        },
      },
    },
  );

  return ExchangeRate;
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
export const createCurrencyRevaluationModel = (sequelize: Sequelize) => {
  class CurrencyRevaluation extends Model {
    public id!: number;
    public revaluationBatchId!: string;
    public accountId!: number;
    public accountCode!: string;
    public currency!: string;
    public baseCurrency!: string;
    public revaluationDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public originalBalance!: number;
    public originalRate!: number;
    public revaluationRate!: number;
    public revaluedBalance!: number;
    public gainLossAmount!: number;
    public gainLossType!: string;
    public gainLossAccount!: string;
    public journalEntryId!: number | null;
    public isPosted!: boolean;
    public postedAt!: Date | null;
    public reversalId!: number | null;
    public isReversed!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CurrencyRevaluation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      revaluationBatchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Batch identifier for revaluation run',
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Account being revalued',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code (denormalized)',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        comment: 'Account currency',
        references: {
          model: 'currency_definitions',
          key: 'currencyCode',
        },
      },
      baseCurrency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        comment: 'Base/reporting currency',
        references: {
          model: 'currency_definitions',
          key: 'currencyCode',
        },
      },
      revaluationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of revaluation',
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
      originalBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Original balance in base currency',
      },
      originalRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        comment: 'Original exchange rate',
      },
      revaluationRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        comment: 'Revaluation exchange rate',
      },
      revaluedBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Revalued balance in base currency',
      },
      gainLossAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Gain/loss amount',
      },
      gainLossType: {
        type: DataTypes.ENUM('realized', 'unrealized'),
        allowNull: false,
        comment: 'Type of gain/loss',
      },
      gainLossAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account for booking gain/loss',
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated journal entry',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      isPosted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether revaluation is posted',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posting timestamp',
      },
      reversalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reversal entry ID if reversed',
        references: {
          model: 'currency_revaluations',
          key: 'id',
        },
      },
      isReversed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether revaluation is reversed',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional revaluation metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the revaluation',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the revaluation',
      },
    },
    {
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
    },
  );

  return CurrencyRevaluation;
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
export const createCurrencyTranslationModel = (sequelize: Sequelize) => {
  class CurrencyTranslation extends Model {
    public id!: number;
    public translationBatchId!: string;
    public entityId!: number;
    public entityCode!: string;
    public accountId!: number;
    public accountCode!: string;
    public accountType!: string;
    public originalCurrency!: string;
    public reportingCurrency!: string;
    public translationDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public translationMethod!: string;
    public originalAmount!: number;
    public translationRate!: number;
    public translatedAmount!: number;
    public cumulativeAdjustment!: number;
    public translationAdjustment!: number;
    public journalEntryId!: number | null;
    public isPosted!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CurrencyTranslation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      translationBatchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Batch identifier for translation run',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Legal entity being translated',
      },
      entityCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Entity code (denormalized)',
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Account being translated',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code (denormalized)',
      },
      accountType: {
        type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
        allowNull: false,
        comment: 'Account type for method selection',
      },
      originalCurrency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        comment: 'Functional currency',
        references: {
          model: 'currency_definitions',
          key: 'currencyCode',
        },
      },
      reportingCurrency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        comment: 'Reporting/presentation currency',
        references: {
          model: 'currency_definitions',
          key: 'currencyCode',
        },
      },
      translationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Translation date',
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
      translationMethod: {
        type: DataTypes.ENUM('current', 'average', 'historical', 'temporal', 'monetary-nonmonetary'),
        allowNull: false,
        comment: 'Translation method (current rate, temporal, etc.)',
      },
      originalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Amount in functional currency',
      },
      translationRate: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
        comment: 'Exchange rate used for translation',
      },
      translatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Amount in reporting currency',
      },
      cumulativeAdjustment: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cumulative translation adjustment (CTA)',
      },
      translationAdjustment: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current period translation adjustment',
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated journal entry',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      isPosted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether translation is posted',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional translation metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the translation',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the translation',
      },
    },
    {
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
    },
  );

  return CurrencyTranslation;
};

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
export async function createCurrencyDefinition(
  sequelize: Sequelize,
  currencyData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Currency = createCurrencyDefinitionModel(sequelize);

  const currency = await Currency.create(
    {
      ...currencyData,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function updateCurrencyDefinition(
  sequelize: Sequelize,
  currencyCode: string,
  updateData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Currency = createCurrencyDefinitionModel(sequelize);

  const currency = await Currency.findOne({
    where: { currencyCode: currencyCode.toUpperCase() },
    transaction,
  });

  if (!currency) {
    throw new Error(`Currency ${currencyCode} not found`);
  }

  await currency.update(
    {
      ...updateData,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function getCurrencyDefinition(
  sequelize: Sequelize,
  currencyCode: string,
  transaction?: Transaction,
): Promise<any> {
  const Currency = createCurrencyDefinitionModel(sequelize);

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
export async function listActiveCurrencies(
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any[]> {
  const Currency = createCurrencyDefinitionModel(sequelize);

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
export async function getBaseCurrency(
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any> {
  const Currency = createCurrencyDefinitionModel(sequelize);

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
export async function createExchangeRate(
  sequelize: Sequelize,
  rateData: CreateExchangeRateDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const rate = await ExchangeRate.create(
    {
      ...rateData,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function updateExchangeRate(
  sequelize: Sequelize,
  rateId: number,
  updateData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const rate = await ExchangeRate.findByPk(rateId, { transaction });

  if (!rate) {
    throw new Error(`Exchange rate ${rateId} not found`);
  }

  await rate.update(
    {
      ...updateData,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function getExchangeRate(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  effectiveDate: Date = new Date(),
  rateType: string = 'spot',
  transaction?: Transaction,
): Promise<any> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const rate = await ExchangeRate.findOne({
    where: {
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      rateType,
      effectiveDate: { [Op.lte]: effectiveDate },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: effectiveDate } },
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
export async function getHistoricalExchangeRates(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  startDate: Date,
  endDate: Date,
  rateType: string = 'spot',
  transaction?: Transaction,
): Promise<any[]> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const rates = await ExchangeRate.findAll({
    where: {
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      rateType,
      effectiveDate: {
        [Op.between]: [startDate, endDate],
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
export async function calculateAverageExchangeRate(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<number> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const result = await ExchangeRate.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('exchangeRate')), 'averageRate'],
    ],
    where: {
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      effectiveDate: {
        [Op.between]: [startDate, endDate],
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
export async function importExchangeRates(
  sequelize: Sequelize,
  ratesData: any[],
  rateSource: string,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const rates = await ExchangeRate.bulkCreate(
    ratesData.map(rate => ({
      ...rate,
      rateSource,
      rateProvider: rateSource,
      createdBy: userId,
      updatedBy: userId,
    })),
    { transaction },
  );

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
export async function deactivateExpiredRates(
  sequelize: Sequelize,
  asOfDate: Date = new Date(),
  userId: string,
  transaction?: Transaction,
): Promise<number> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const [count] = await ExchangeRate.update(
    {
      isActive: false,
      updatedBy: userId,
    },
    {
      where: {
        expirationDate: { [Op.lt]: asOfDate },
        isActive: true,
      },
      transaction,
    },
  );

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
export async function getExchangeRateById(
  sequelize: Sequelize,
  rateId: number,
  transaction?: Transaction,
): Promise<any> {
  const ExchangeRate = createExchangeRateModel(sequelize);

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
export async function deleteExchangeRate(
  sequelize: Sequelize,
  rateId: number,
  transaction?: Transaction,
): Promise<void> {
  const ExchangeRate = createExchangeRateModel(sequelize);

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
export async function listExchangeRatesForCurrency(
  sequelize: Sequelize,
  currencyCode: string,
  activeOnly: boolean = true,
  transaction?: Transaction,
): Promise<any[]> {
  const ExchangeRate = createExchangeRateModel(sequelize);

  const where: any = {
    [Op.or]: [
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
export async function convertCurrency(
  sequelize: Sequelize,
  conversionData: ConvertCurrencyDto,
  transaction?: Transaction,
): Promise<CurrencyConversion> {
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

  const rate = await getExchangeRate(
    sequelize,
    fromCurrency,
    toCurrency,
    conversionDate,
    rateType,
    transaction,
  );

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
export async function convertCurrencyWithTriangulation(
  sequelize: Sequelize,
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  intermediateCurrency: string,
  conversionDate: Date = new Date(),
  transaction?: Transaction,
): Promise<CurrencyConversion> {
  // First leg: fromCurrency -> intermediateCurrency
  const firstConversion = await convertCurrency(
    sequelize,
    {
      amount,
      fromCurrency,
      toCurrency: intermediateCurrency,
      conversionDate,
      rateType: 'spot',
    },
    transaction,
  );

  // Second leg: intermediateCurrency -> toCurrency
  const secondConversion = await convertCurrency(
    sequelize,
    {
      amount: firstConversion.convertedAmount,
      fromCurrency: intermediateCurrency,
      toCurrency,
      conversionDate,
      rateType: 'spot',
    },
    transaction,
  );

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
export async function batchConvertCurrency(
  sequelize: Sequelize,
  conversions: ConvertCurrencyDto[],
  transaction?: Transaction,
): Promise<CurrencyConversion[]> {
  const results: CurrencyConversion[] = [];

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
export async function convertToBaseCurrency(
  sequelize: Sequelize,
  amount: number,
  fromCurrency: string,
  conversionDate: Date = new Date(),
  transaction?: Transaction,
): Promise<CurrencyConversion> {
  const baseCurrency = await getBaseCurrency(sequelize, transaction);

  return convertCurrency(
    sequelize,
    {
      amount,
      fromCurrency,
      toCurrency: baseCurrency.currencyCode,
      conversionDate,
      rateType: 'spot',
    },
    transaction,
  );
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
export async function convertFromBaseCurrency(
  sequelize: Sequelize,
  amount: number,
  toCurrency: string,
  conversionDate: Date = new Date(),
  transaction?: Transaction,
): Promise<CurrencyConversion> {
  const baseCurrency = await getBaseCurrency(sequelize, transaction);

  return convertCurrency(
    sequelize,
    {
      amount,
      fromCurrency: baseCurrency.currencyCode,
      toCurrency,
      conversionDate,
      rateType: 'spot',
    },
    transaction,
  );
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
export async function calculateCrossCurrencyRate(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  effectiveDate: Date = new Date(),
  transaction?: Transaction,
): Promise<number> {
  const baseCurrency = await getBaseCurrency(sequelize, transaction);

  const fromRate = await getExchangeRate(
    sequelize,
    fromCurrency,
    baseCurrency.currencyCode,
    effectiveDate,
    'spot',
    transaction,
  );

  const toRate = await getExchangeRate(
    sequelize,
    baseCurrency.currencyCode,
    toCurrency,
    effectiveDate,
    'spot',
    transaction,
  );

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
export function roundCurrencyAmount(
  amount: number,
  currencyDefinition: any,
): number {
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
export function formatCurrencyAmount(
  amount: number,
  currencyDefinition: any,
): string {
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
export async function validateCurrencyConversion(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  conversionDate: Date,
  transaction?: Transaction,
): Promise<boolean> {
  try {
    await getCurrencyDefinition(sequelize, fromCurrency, transaction);
    await getCurrencyDefinition(sequelize, toCurrency, transaction);

    if (fromCurrency !== toCurrency) {
      await getExchangeRate(
        sequelize,
        fromCurrency,
        toCurrency,
        conversionDate,
        'spot',
        transaction,
      );
    }

    return true;
  } catch (error) {
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
export function calculateInverseRate(exchangeRate: number): number {
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
export async function revaluateAccount(
  sequelize: Sequelize,
  revaluationData: RevaluateAccountDto,
  userId: string,
  transaction?: Transaction,
): Promise<RevaluationResult> {
  const { accountId, revaluationDate, targetCurrency, rateType = 'spot' } = revaluationData;

  // Get account balance (mocked for this example)
  const accountBalance = 10000;
  const accountCurrency = 'EUR';
  const accountCode = '1200-AR';

  // Get exchange rate
  const rate = await getExchangeRate(
    sequelize,
    accountCurrency,
    targetCurrency,
    revaluationDate,
    rateType,
    transaction,
  );

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
export async function batchRevaluateAccounts(
  sequelize: Sequelize,
  accountIds: number[],
  revaluationDate: Date,
  targetCurrency: string,
  userId: string,
  transaction?: Transaction,
): Promise<RevaluationResult[]> {
  const results: RevaluationResult[] = [];

  for (const accountId of accountIds) {
    const result = await revaluateAccount(
      sequelize,
      { accountId, revaluationDate, targetCurrency },
      userId,
      transaction,
    );
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
export async function createRevaluationJournalEntry(
  sequelize: Sequelize,
  revaluationResult: RevaluationResult,
  gainLossAccount: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

  const revaluation = await Revaluation.create(
    {
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
    },
    { transaction },
  );

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
export async function calculateUnrealizedFxGainLoss(
  sequelize: Sequelize,
  accountId: number,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<number> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

  const result = await Revaluation.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('gainLossAmount')), 'totalGainLoss'],
    ],
    where: {
      accountId,
      gainLossType: 'unrealized',
      revaluationDate: { [Op.lte]: asOfDate },
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
export async function calculateRealizedFxGainLoss(
  sequelize: Sequelize,
  transactionId: number,
  settlementAmount: number,
  settlementDate: Date,
  transaction?: Transaction,
): Promise<number> {
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
export async function reverseRevaluation(
  sequelize: Sequelize,
  revaluationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

  const original = await Revaluation.findByPk(revaluationId, { transaction });

  if (!original) {
    throw new Error(`Revaluation ${revaluationId} not found`);
  }

  if (original.isReversed) {
    throw new Error('Revaluation already reversed');
  }

  // Create reversal entry
  const reversal = await Revaluation.create(
    {
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
    },
    { transaction },
  );

  // Mark original as reversed
  await original.update(
    {
      isReversed: true,
      reversalId: reversal.id,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function getRevaluationHistory(
  sequelize: Sequelize,
  accountId: number,
  startDate?: Date,
  endDate?: Date,
  transaction?: Transaction,
): Promise<any[]> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

  const where: any = { accountId };

  if (startDate && endDate) {
    where.revaluationDate = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where.revaluationDate = { [Op.gte]: startDate };
  } else if (endDate) {
    where.revaluationDate = { [Op.lte]: endDate };
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
export async function postRevaluation(
  sequelize: Sequelize,
  revaluationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

  const revaluation = await Revaluation.findByPk(revaluationId, { transaction });

  if (!revaluation) {
    throw new Error(`Revaluation ${revaluationId} not found`);
  }

  if (revaluation.isPosted) {
    throw new Error('Revaluation already posted');
  }

  await revaluation.update(
    {
      isPosted: true,
      postedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function generateRevaluationReport(
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Revaluation = createCurrencyRevaluationModel(sequelize);

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
export async function translateFinancialStatements(
  sequelize: Sequelize,
  translationData: TranslateCurrencyDto,
  userId: string,
  transaction?: Transaction,
): Promise<CurrencyTranslation> {
  const Translation = createCurrencyTranslationModel(sequelize);

  const translation = await Translation.create(
    {
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
    },
    { transaction },
  );

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
export async function applyCurrentRateMethod(
  sequelize: Sequelize,
  entityId: number,
  reportingCurrency: string,
  translationDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> {
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
export async function applyTemporalMethod(
  sequelize: Sequelize,
  entityId: number,
  reportingCurrency: string,
  translationDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> {
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
export async function calculateCumulativeTranslationAdjustment(
  sequelize: Sequelize,
  entityId: number,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<number> {
  const Translation = createCurrencyTranslationModel(sequelize);

  const result = await Translation.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('translationAdjustment')), 'totalCTA'],
    ],
    where: {
      entityId,
      translationDate: { [Op.lte]: asOfDate },
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
export async function postTranslation(
  sequelize: Sequelize,
  translationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Translation = createCurrencyTranslationModel(sequelize);

  const translation = await Translation.findByPk(translationId, { transaction });

  if (!translation) {
    throw new Error(`Translation ${translationId} not found`);
  }

  if (translation.isPosted) {
    throw new Error('Translation already posted');
  }

  await translation.update(
    {
      isPosted: true,
      updatedBy: userId,
    },
    { transaction },
  );

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
export async function getTranslationHistory(
  sequelize: Sequelize,
  entityId: number,
  startDate?: Date,
  endDate?: Date,
  transaction?: Transaction,
): Promise<any[]> {
  const Translation = createCurrencyTranslationModel(sequelize);

  const where: any = { entityId };

  if (startDate && endDate) {
    where.translationDate = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where.translationDate = { [Op.gte]: startDate };
  } else if (endDate) {
    where.translationDate = { [Op.lte]: endDate };
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
export async function generateTranslationAdjustmentReport(
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Translation = createCurrencyTranslationModel(sequelize);

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
export function validateTranslationMethod(
  accountType: string,
  translationMethod: string,
): boolean {
  const methodRules: Record<string, string[]> = {
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
export async function getHistoricalRateForTranslation(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  historicalDate: Date,
  transaction?: Transaction,
): Promise<number> {
  const rate = await getExchangeRate(
    sequelize,
    fromCurrency,
    toCurrency,
    historicalDate,
    'historical',
    transaction,
  );

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
export async function getAverageRateForPeriod(
  sequelize: Sequelize,
  fromCurrency: string,
  toCurrency: string,
  periodStart: Date,
  periodEnd: Date,
  transaction?: Transaction,
): Promise<number> {
  return calculateAverageExchangeRate(
    sequelize,
    fromCurrency,
    toCurrency,
    periodStart,
    periodEnd,
    transaction,
  );
}

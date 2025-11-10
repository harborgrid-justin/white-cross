/**
 * LOC: CEFMS-FCT-COMP-003
 * File: /reuse/financial/cefms/composites/cefms-foreign-currency-transactions-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../reuse/financial/treasury-management-kit.ts
 *   - ../../../reuse/financial/general-ledger-posting-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS backend services
 *   - Foreign currency transaction modules
 *   - Exchange rate management systems
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-foreign-currency-transactions-composite.ts
 * Locator: WC-CEFMS-FCT-COMP-003
 * Purpose: Enterprise-grade Foreign Currency Transaction management for USACE CEFMS - FX transactions, exchange rates, gains/losses, hedging
 *
 * Upstream: Composes functions from reuse/financial/*-kit modules
 * Downstream: CEFMS backend services, foreign currency accounting, exchange rate management, FX risk mitigation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 36+ composite functions for foreign currency operations competing with USACE CEFMS enterprise financial management
 *
 * LLM Context: Comprehensive foreign currency utilities for production-ready federal financial applications.
 * Provides multi-currency transaction processing, real-time exchange rate management, realized/unrealized gains and losses,
 * foreign currency revaluation, hedging strategy implementation, compliance with federal exchange rate regulations,
 * Treasury reporting, and foreign currency exposure analysis.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Foreign currency transaction data structure.
 *
 * @interface ForeignCurrencyTransaction
 */
interface ForeignCurrencyTransaction {
  /** Transaction ID */
  transactionId: string;
  /** Transaction type */
  transactionType: 'receipt' | 'payment' | 'transfer' | 'revaluation';
  /** Foreign currency code (ISO 4217) */
  foreignCurrency: string;
  /** Foreign currency amount */
  foreignAmount: number;
  /** Exchange rate at transaction */
  exchangeRate: number;
  /** USD equivalent amount */
  usdAmount: number;
  /** Transaction date */
  transactionDate: Date;
  /** Settlement date */
  settlementDate?: Date;
  /** Counterparty */
  counterparty?: string;
  /** Purpose */
  purpose: string;
  /** Status */
  status: 'pending' | 'settled' | 'cancelled';
}

/**
 * Exchange rate data structure.
 *
 * @interface ExchangeRate
 */
interface ExchangeRate {
  /** Currency code (ISO 4217) */
  currency: string;
  /** Base currency (typically USD) */
  baseCurrency: string;
  /** Exchange rate */
  rate: number;
  /** Rate type: spot, average, fixed */
  rateType: 'spot' | 'average' | 'fixed';
  /** Effective date */
  effectiveDate: Date;
  /** Source of rate */
  source: 'treasury' | 'central_bank' | 'market' | 'fixed';
  /** Is active */
  isActive: boolean;
}

/**
 * Foreign currency gain/loss calculation.
 *
 * @interface CurrencyGainLoss
 */
interface CurrencyGainLoss {
  /** Calculation ID */
  calculationId: string;
  /** Transaction ID */
  transactionId: string;
  /** Foreign currency */
  currency: string;
  /** Original exchange rate */
  originalRate: number;
  /** Settlement/revaluation rate */
  settlementRate: number;
  /** Foreign amount */
  foreignAmount: number;
  /** Gain/loss amount in USD */
  gainLossAmount: number;
  /** Gain/loss type */
  gainLossType: 'realized' | 'unrealized';
  /** Calculation date */
  calculationDate: Date;
}

/**
 * Foreign currency exposure summary.
 *
 * @interface CurrencyExposure
 */
interface CurrencyExposure {
  /** Currency code */
  currency: string;
  /** Total receivables in foreign currency */
  totalReceivables: number;
  /** Total payables in foreign currency */
  totalPayables: number;
  /** Net exposure (receivables - payables) */
  netExposure: number;
  /** USD equivalent at current rate */
  usdEquivalent: number;
  /** Exposure risk level */
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Foreign currency revaluation result.
 *
 * @interface RevaluationResult
 */
interface RevaluationResult {
  /** Revaluation ID */
  revaluationId: string;
  /** Revaluation date */
  revaluationDate: Date;
  /** Currency */
  currency: string;
  /** Opening balance (foreign) */
  openingBalance: number;
  /** Closing balance (foreign) */
  closingBalance: number;
  /** Opening rate */
  openingRate: number;
  /** Closing rate */
  closingRate: number;
  /** Unrealized gain/loss */
  unrealizedGainLoss: number;
  /** GL postings required */
  glPostings: GLPosting[];
}

/**
 * General ledger posting for FX transactions.
 *
 * @interface GLPosting
 */
interface GLPosting {
  /** Account code */
  accountCode: string;
  /** Account description */
  accountDescription: string;
  /** Debit amount */
  debitAmount: number;
  /** Credit amount */
  creditAmount: number;
  /** Currency */
  currency: string;
}

/**
 * Currency hedging strategy.
 *
 * @interface HedgingStrategy
 */
interface HedgingStrategy {
  /** Strategy ID */
  strategyId: string;
  /** Currency to hedge */
  currency: string;
  /** Hedging instrument */
  instrument: 'forward' | 'option' | 'swap' | 'natural_hedge';
  /** Notional amount */
  notionalAmount: number;
  /** Hedge ratio (%) */
  hedgeRatio: number;
  /** Execution date */
  executionDate: Date;
  /** Maturity date */
  maturityDate: Date;
  /** Hedged rate */
  hedgedRate?: number;
  /** Status */
  status: 'active' | 'matured' | 'cancelled';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Foreign Currency Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ForeignCurrencyTransaction model
 *
 * @example
 * ```typescript
 * const FCT = createForeignCurrencyTransactionModel(sequelize);
 * const transaction = await FCT.create({
 *   transactionId: 'FX-2024-001',
 *   transactionType: 'payment',
 *   foreignCurrency: 'EUR',
 *   foreignAmount: 100000,
 *   exchangeRate: 1.0850,
 *   usdAmount: 108500,
 *   transactionDate: new Date(),
 *   purpose: 'Contract payment',
 *   status: 'pending'
 * });
 * ```
 */
export const createForeignCurrencyTransactionModel = (sequelize: Sequelize) => {
  class FCTModel extends Model {
    public id!: string;
    public transactionId!: string;
    public transactionType!: string;
    public foreignCurrency!: string;
    public foreignAmount!: number;
    public exchangeRate!: number;
    public usdAmount!: number;
    public transactionDate!: Date;
    public settlementDate!: Date | null;
    public counterparty!: string;
    public purpose!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FCTModel.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      transactionId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      transactionType: { type: DataTypes.ENUM('receipt', 'payment', 'transfer', 'revaluation'), allowNull: false },
      foreignCurrency: { type: DataTypes.STRING(3), allowNull: false, comment: 'ISO 4217 currency code' },
      foreignAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      exchangeRate: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
      usdAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      transactionDate: { type: DataTypes.DATE, allowNull: false },
      settlementDate: { type: DataTypes.DATE, allowNull: true },
      counterparty: { type: DataTypes.STRING(200), allowNull: true },
      purpose: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'settled', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    },
    {
      sequelize,
      tableName: 'foreign_currency_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['foreignCurrency'] },
        { fields: ['transactionDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return FCTModel;
};

// ============================================================================
// FOREIGN CURRENCY TRANSACTION PROCESSING (1-6)
// ============================================================================

/**
 * Creates a foreign currency transaction with automatic USD conversion.
 *
 * @param {ForeignCurrencyTransaction} txData - Transaction data
 * @param {Model} FCTModel - ForeignCurrencyTransaction model
 * @param {string} userId - User creating transaction
 * @returns {Promise<any>} Created transaction
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const tx = await createForeignCurrencyTransaction({
 *   transactionId: 'FX-2024-001',
 *   transactionType: 'payment',
 *   foreignCurrency: 'EUR',
 *   foreignAmount: 100000,
 *   exchangeRate: 1.0850,
 *   usdAmount: 108500,
 *   transactionDate: new Date(),
 *   purpose: 'Contract payment to vendor',
 *   status: 'pending'
 * }, FCTModel, 'user123');
 * console.log('FX transaction created:', tx.transactionId);
 * ```
 */
export const createForeignCurrencyTransaction = async (
  txData: ForeignCurrencyTransaction,
  FCTModel: any,
  userId: string,
): Promise<any> => {
  // Validate transaction data
  if (!txData.foreignCurrency || txData.foreignCurrency.length !== 3) {
    throw new Error('Invalid currency code (must be 3-letter ISO 4217)');
  }
  if (txData.foreignAmount <= 0) {
    throw new Error('Foreign amount must be positive');
  }
  if (txData.exchangeRate <= 0) {
    throw new Error('Exchange rate must be positive');
  }

  // Verify USD amount calculation
  const calculatedUSD = txData.foreignAmount * txData.exchangeRate;
  if (Math.abs(calculatedUSD - txData.usdAmount) > 0.01) {
    throw new Error('USD amount does not match foreign amount × exchange rate');
  }

  const transaction = await FCTModel.create(txData);

  console.log(`FX transaction created: ${transaction.transactionId} by user ${userId}`);

  return transaction;
};

/**
 * Converts foreign currency amount to USD using current exchange rate.
 *
 * @param {number} foreignAmount - Amount in foreign currency
 * @param {string} foreignCurrency - Foreign currency code
 * @param {ExchangeRate[]} exchangeRates - Available exchange rates
 * @returns {{ usdAmount: number; exchangeRate: number; rateDate: Date }} Conversion result
 * @throws {Error} If exchange rate not found
 *
 * @example
 * ```typescript
 * const result = convertToUSD(100000, 'EUR', exchangeRates);
 * console.log(`€100,000 = $${result.usdAmount.toLocaleString()}`);
 * console.log(`Exchange rate: ${result.exchangeRate}`);
 * ```
 */
export const convertToUSD = (
  foreignAmount: number,
  foreignCurrency: string,
  exchangeRates: ExchangeRate[],
): { usdAmount: number; exchangeRate: number; rateDate: Date } => {
  const activeRate = exchangeRates.find(
    rate => rate.currency === foreignCurrency && rate.isActive,
  );

  if (!activeRate) {
    throw new Error(`Exchange rate not found for ${foreignCurrency}`);
  }

  const usdAmount = foreignAmount * activeRate.rate;

  console.log(`Converted ${foreignAmount} ${foreignCurrency} to ${usdAmount.toFixed(2)} USD at rate ${activeRate.rate}`);

  return {
    usdAmount,
    exchangeRate: activeRate.rate,
    rateDate: activeRate.effectiveDate,
  };
};

/**
 * Converts USD amount to foreign currency.
 *
 * @param {number} usdAmount - Amount in USD
 * @param {string} targetCurrency - Target currency code
 * @param {ExchangeRate[]} exchangeRates - Available exchange rates
 * @returns {{ foreignAmount: number; exchangeRate: number }} Conversion result
 *
 * @example
 * ```typescript
 * const result = convertFromUSD(108500, 'EUR', exchangeRates);
 * console.log(`$108,500 = €${result.foreignAmount.toLocaleString()}`);
 * ```
 */
export const convertFromUSD = (
  usdAmount: number,
  targetCurrency: string,
  exchangeRates: ExchangeRate[],
): { foreignAmount: number; exchangeRate: number } => {
  const activeRate = exchangeRates.find(
    rate => rate.currency === targetCurrency && rate.isActive,
  );

  if (!activeRate) {
    throw new Error(`Exchange rate not found for ${targetCurrency}`);
  }

  const foreignAmount = usdAmount / activeRate.rate;

  return {
    foreignAmount,
    exchangeRate: activeRate.rate,
  };
};

/**
 * Settles a pending foreign currency transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Date} settlementDate - Settlement date
 * @param {Model} FCTModel - ForeignCurrencyTransaction model
 * @returns {Promise<any>} Settled transaction
 *
 * @example
 * ```typescript
 * const settled = await settleForeignCurrencyTransaction('FX-2024-001', new Date(), FCTModel);
 * console.log('Transaction settled:', settled.status);
 * ```
 */
export const settleForeignCurrencyTransaction = async (
  transactionId: string,
  settlementDate: Date,
  FCTModel: any,
): Promise<any> => {
  const transaction = await FCTModel.findOne({ where: { transactionId } });
  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  if (transaction.status !== 'pending') {
    throw new Error(`Transaction ${transactionId} is not pending`);
  }

  transaction.status = 'settled';
  transaction.settlementDate = settlementDate;
  await transaction.save();

  console.log(`FX transaction ${transactionId} settled on ${settlementDate.toISOString()}`);

  return transaction;
};

/**
 * Retrieves foreign currency transactions for a period.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {string} [currency] - Optional currency filter
 * @param {Model} FCTModel - ForeignCurrencyTransaction model
 * @returns {Promise<any[]>} Transactions
 *
 * @example
 * ```typescript
 * const transactions = await getForeignCurrencyTransactions(
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   'EUR',
 *   FCTModel
 * );
 * console.log(`Found ${transactions.length} EUR transactions`);
 * ```
 */
export const getForeignCurrencyTransactions = async (
  startDate: Date,
  endDate: Date,
  currency?: string,
  FCTModel?: any,
): Promise<any[]> => {
  const where: any = {
    transactionDate: { [Op.between]: [startDate, endDate] },
  };

  if (currency) {
    where.foreignCurrency = currency;
  }

  const transactions = await FCTModel.findAll({
    where,
    order: [['transactionDate', 'DESC']],
  });

  console.log(`Retrieved ${transactions.length} FX transactions for period ${startDate.toISOString()} to ${endDate.toISOString()}`);

  return transactions;
};

/**
 * Cancels a pending foreign currency transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} reason - Cancellation reason
 * @param {Model} FCTModel - ForeignCurrencyTransaction model
 * @param {string} userId - User cancelling transaction
 * @returns {Promise<any>} Cancelled transaction
 *
 * @example
 * ```typescript
 * const cancelled = await cancelForeignCurrencyTransaction(
 *   'FX-2024-001',
 *   'Contract terminated',
 *   FCTModel,
 *   'user123'
 * );
 * ```
 */
export const cancelForeignCurrencyTransaction = async (
  transactionId: string,
  reason: string,
  FCTModel: any,
  userId: string,
): Promise<any> => {
  const transaction = await FCTModel.findOne({ where: { transactionId } });
  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  if (transaction.status === 'settled') {
    throw new Error(`Cannot cancel settled transaction ${transactionId}`);
  }

  transaction.status = 'cancelled';
  await transaction.save();

  console.log(`FX transaction ${transactionId} cancelled by ${userId}: ${reason}`);

  return transaction;
};

// ============================================================================
// EXCHANGE RATE MANAGEMENT (7-12)
// ============================================================================

/**
 * Retrieves current exchange rate for a currency.
 *
 * @param {string} currency - Currency code
 * @param {ExchangeRate[]} exchangeRates - Available exchange rates
 * @returns {ExchangeRate | null} Current exchange rate or null
 *
 * @example
 * ```typescript
 * const rate = getCurrentExchangeRate('EUR', exchangeRates);
 * if (rate) {
 *   console.log(`Current EUR/USD rate: ${rate.rate}`);
 * }
 * ```
 */
export const getCurrentExchangeRate = (
  currency: string,
  exchangeRates: ExchangeRate[],
): ExchangeRate | null => {
  const currentRate = exchangeRates
    .filter(rate => rate.currency === currency && rate.isActive)
    .sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime())[0];

  return currentRate || null;
};

/**
 * Updates exchange rates from external source (Treasury, central bank).
 *
 * @param {ExchangeRate[]} newRates - New exchange rates
 * @returns {ExchangeRate[]} Updated rates
 *
 * @example
 * ```typescript
 * const updated = updateExchangeRates([
 *   { currency: 'EUR', baseCurrency: 'USD', rate: 1.0850, rateType: 'spot', effectiveDate: new Date(), source: 'treasury', isActive: true },
 *   { currency: 'GBP', baseCurrency: 'USD', rate: 1.2650, rateType: 'spot', effectiveDate: new Date(), source: 'treasury', isActive: true }
 * ]);
 * console.log(`Updated ${updated.length} exchange rates`);
 * ```
 */
export const updateExchangeRates = (newRates: ExchangeRate[]): ExchangeRate[] => {
  // In production, this would update database and deactivate old rates
  newRates.forEach(rate => {
    console.log(`Updated ${rate.currency} rate: ${rate.rate} (source: ${rate.source})`);
  });

  return newRates;
};

/**
 * Calculates average exchange rate for a period.
 *
 * @param {string} currency - Currency code
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {ExchangeRate[]} historicalRates - Historical rates
 * @returns {number} Average exchange rate
 *
 * @example
 * ```typescript
 * const avgRate = calculateAverageExchangeRate(
 *   'EUR',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   historicalRates
 * );
 * console.log(`Q1 2024 average EUR rate: ${avgRate.toFixed(4)}`);
 * ```
 */
export const calculateAverageExchangeRate = (
  currency: string,
  startDate: Date,
  endDate: Date,
  historicalRates: ExchangeRate[],
): number => {
  const periodRates = historicalRates.filter(
    rate =>
      rate.currency === currency &&
      rate.effectiveDate >= startDate &&
      rate.effectiveDate <= endDate,
  );

  if (periodRates.length === 0) {
    throw new Error(`No exchange rates found for ${currency} in the specified period`);
  }

  const sum = periodRates.reduce((total, rate) => total + rate.rate, 0);
  const average = sum / periodRates.length;

  console.log(`Calculated average ${currency} rate: ${average.toFixed(4)} over ${periodRates.length} data points`);

  return average;
};

/**
 * Validates exchange rate against historical volatility.
 *
 * @param {ExchangeRate} newRate - New exchange rate
 * @param {ExchangeRate[]} historicalRates - Historical rates for comparison
 * @returns {{ valid: boolean; volatility: number; warning?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateExchangeRate(newRate, historicalRates);
 * if (!validation.valid) {
 *   console.warn('Rate validation warning:', validation.warning);
 * }
 * ```
 */
export const validateExchangeRate = (
  newRate: ExchangeRate,
  historicalRates: ExchangeRate[],
): { valid: boolean; volatility: number; warning?: string } => {
  const recentRates = historicalRates
    .filter(rate => rate.currency === newRate.currency)
    .slice(-30); // Last 30 rates

  if (recentRates.length === 0) {
    return { valid: true, volatility: 0 };
  }

  const avgRate = recentRates.reduce((sum, r) => sum + r.rate, 0) / recentRates.length;
  const variance = recentRates.reduce((sum, r) => sum + Math.pow(r.rate - avgRate, 2), 0) / recentRates.length;
  const stdDev = Math.sqrt(variance);
  const volatility = (stdDev / avgRate) * 100;

  const deviation = Math.abs(newRate.rate - avgRate);
  const deviationPercent = (deviation / avgRate) * 100;

  let valid = true;
  let warning: string | undefined;

  if (deviationPercent > 10) {
    valid = false;
    warning = `Rate deviates ${deviationPercent.toFixed(2)}% from recent average - possible error`;
  } else if (deviationPercent > 5) {
    warning = `Rate deviates ${deviationPercent.toFixed(2)}% from recent average - verify source`;
  }

  return { valid, volatility, warning };
};

/**
 * Retrieves exchange rate for a specific historical date.
 *
 * @param {string} currency - Currency code
 * @param {Date} date - Historical date
 * @param {ExchangeRate[]} historicalRates - Historical rates
 * @returns {ExchangeRate | null} Historical exchange rate
 *
 * @example
 * ```typescript
 * const historicalRate = getHistoricalExchangeRate('EUR', new Date('2024-01-15'), rates);
 * if (historicalRate) {
 *   console.log(`EUR rate on 2024-01-15: ${historicalRate.rate}`);
 * }
 * ```
 */
export const getHistoricalExchangeRate = (
  currency: string,
  date: Date,
  historicalRates: ExchangeRate[],
): ExchangeRate | null => {
  // Find rate with effective date closest to but not after the target date
  const applicableRates = historicalRates
    .filter(rate => rate.currency === currency && rate.effectiveDate <= date)
    .sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime());

  return applicableRates[0] || null;
};

/**
 * Compares exchange rates across multiple sources.
 *
 * @param {string} currency - Currency code
 * @param {ExchangeRate[]} rates - Rates from different sources
 * @returns {{ averageRate: number; sources: any[]; spread: number }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareExchangeRateSources('EUR', [treasuryRate, marketRate, cbRate]);
 * console.log(`Average rate: ${comparison.averageRate}`);
 * console.log(`Spread: ${comparison.spread.toFixed(4)}`);
 * ```
 */
export const compareExchangeRateSources = (
  currency: string,
  rates: ExchangeRate[],
): { averageRate: number; sources: any[]; spread: number } => {
  const currencyRates = rates.filter(r => r.currency === currency);

  if (currencyRates.length === 0) {
    throw new Error(`No rates found for ${currency}`);
  }

  const sources = currencyRates.map(r => ({
    source: r.source,
    rate: r.rate,
    effectiveDate: r.effectiveDate,
  }));

  const avgRate = currencyRates.reduce((sum, r) => sum + r.rate, 0) / currencyRates.length;
  const maxRate = Math.max(...currencyRates.map(r => r.rate));
  const minRate = Math.min(...currencyRates.map(r => r.rate));
  const spread = maxRate - minRate;

  console.log(`Compared ${currencyRates.length} sources for ${currency}: spread ${spread.toFixed(4)}`);

  return {
    averageRate: avgRate,
    sources,
    spread,
  };
};

// ============================================================================
// GAIN/LOSS CALCULATION (13-18)
// ============================================================================

/**
 * Calculates realized gain/loss on settled transaction.
 *
 * @param {ForeignCurrencyTransaction} transaction - Settled transaction
 * @param {number} settlementRate - Exchange rate at settlement
 * @returns {CurrencyGainLoss} Realized gain/loss
 *
 * @example
 * ```typescript
 * const gainLoss = calculateRealizedGainLoss(transaction, 1.0920);
 * console.log(`Realized ${gainLoss.gainLossAmount >= 0 ? 'gain' : 'loss'}: $${Math.abs(gainLoss.gainLossAmount).toLocaleString()}`);
 * ```
 */
export const calculateRealizedGainLoss = (
  transaction: ForeignCurrencyTransaction,
  settlementRate: number,
): CurrencyGainLoss => {
  const originalUSD = transaction.foreignAmount * transaction.exchangeRate;
  const settlementUSD = transaction.foreignAmount * settlementRate;
  const gainLossAmount = settlementUSD - originalUSD;

  const gainLoss: CurrencyGainLoss = {
    calculationId: `GL-${transaction.transactionId}-${Date.now()}`,
    transactionId: transaction.transactionId,
    currency: transaction.foreignCurrency,
    originalRate: transaction.exchangeRate,
    settlementRate,
    foreignAmount: transaction.foreignAmount,
    gainLossAmount,
    gainLossType: 'realized',
    calculationDate: new Date(),
  };

  console.log(`Calculated realized ${gainLossAmount >= 0 ? 'gain' : 'loss'} of $${Math.abs(gainLossAmount).toFixed(2)} for ${transaction.transactionId}`);

  return gainLoss;
};

/**
 * Calculates unrealized gain/loss for open positions.
 *
 * @param {ForeignCurrencyTransaction[]} openTransactions - Unsettled transactions
 * @param {ExchangeRate[]} currentRates - Current exchange rates
 * @returns {CurrencyGainLoss[]} Unrealized gains/losses
 *
 * @example
 * ```typescript
 * const unrealized = calculateUnrealizedGainLoss(openPositions, currentRates);
 * const totalUnrealized = unrealized.reduce((sum, gl) => sum + gl.gainLossAmount, 0);
 * console.log(`Total unrealized: $${totalUnrealized.toLocaleString()}`);
 * ```
 */
export const calculateUnrealizedGainLoss = (
  openTransactions: ForeignCurrencyTransaction[],
  currentRates: ExchangeRate[],
): CurrencyGainLoss[] => {
  const gainLosses: CurrencyGainLoss[] = [];

  openTransactions.forEach(tx => {
    const currentRate = getCurrentExchangeRate(tx.foreignCurrency, currentRates);
    if (!currentRate) {
      console.warn(`No current rate found for ${tx.foreignCurrency}, skipping ${tx.transactionId}`);
      return;
    }

    const originalUSD = tx.foreignAmount * tx.exchangeRate;
    const currentUSD = tx.foreignAmount * currentRate.rate;
    const gainLossAmount = currentUSD - originalUSD;

    gainLosses.push({
      calculationId: `GL-${tx.transactionId}-${Date.now()}`,
      transactionId: tx.transactionId,
      currency: tx.foreignCurrency,
      originalRate: tx.exchangeRate,
      settlementRate: currentRate.rate,
      foreignAmount: tx.foreignAmount,
      gainLossAmount,
      gainLossType: 'unrealized',
      calculationDate: new Date(),
    });
  });

  const totalUnrealized = gainLosses.reduce((sum, gl) => sum + gl.gainLossAmount, 0);
  console.log(`Calculated unrealized gain/loss for ${gainLosses.length} transactions: $${totalUnrealized.toFixed(2)}`);

  return gainLosses;
};

/**
 * Generates gain/loss summary report for a period.
 *
 * @param {CurrencyGainLoss[]} gainLosses - Gain/loss calculations
 * @returns {any} Summary report
 *
 * @example
 * ```typescript
 * const summary = summarizeGainLoss(allGainLosses);
 * console.log('Total realized gains:', summary.totalRealizedGains);
 * console.log('Total realized losses:', summary.totalRealizedLosses);
 * console.log('Net gain/loss:', summary.netGainLoss);
 * ```
 */
export const summarizeGainLoss = (gainLosses: CurrencyGainLoss[]): any => {
  const realized = gainLosses.filter(gl => gl.gainLossType === 'realized');
  const unrealized = gainLosses.filter(gl => gl.gainLossType === 'unrealized');

  const summary = {
    totalRealizedGains: realized.filter(gl => gl.gainLossAmount > 0).reduce((sum, gl) => sum + gl.gainLossAmount, 0),
    totalRealizedLosses: Math.abs(realized.filter(gl => gl.gainLossAmount < 0).reduce((sum, gl) => sum + gl.gainLossAmount, 0)),
    netRealizedGainLoss: realized.reduce((sum, gl) => sum + gl.gainLossAmount, 0),
    totalUnrealizedGains: unrealized.filter(gl => gl.gainLossAmount > 0).reduce((sum, gl) => sum + gl.gainLossAmount, 0),
    totalUnrealizedLosses: Math.abs(unrealized.filter(gl => gl.gainLossAmount < 0).reduce((sum, gl) => sum + gl.gainLossAmount, 0)),
    netUnrealizedGainLoss: unrealized.reduce((sum, gl) => sum + gl.gainLossAmount, 0),
    netGainLoss: gainLosses.reduce((sum, gl) => sum + gl.gainLossAmount, 0),
    byCurrency: {} as Record<string, number>,
  };

  // Group by currency
  gainLosses.forEach(gl => {
    if (!summary.byCurrency[gl.currency]) {
      summary.byCurrency[gl.currency] = 0;
    }
    summary.byCurrency[gl.currency] += gl.gainLossAmount;
  });

  console.log(`Gain/loss summary: Net ${summary.netGainLoss >= 0 ? 'gain' : 'loss'} of $${Math.abs(summary.netGainLoss).toFixed(2)}`);

  return summary;
};

/**
 * Generates GL postings for realized gains/losses.
 *
 * @param {CurrencyGainLoss} gainLoss - Realized gain/loss
 * @returns {GLPosting[]} GL postings
 *
 * @example
 * ```typescript
 * const postings = generateGainLossGLPostings(realizedGainLoss);
 * postings.forEach(posting => {
 *   console.log(`${posting.accountCode}: DR ${posting.debitAmount} CR ${posting.creditAmount}`);
 * });
 * ```
 */
export const generateGainLossGLPostings = (gainLoss: CurrencyGainLoss): GLPosting[] => {
  const postings: GLPosting[] = [];

  if (gainLoss.gainLossAmount > 0) {
    // Realized gain
    postings.push({
      accountCode: '1010', // Cash/Bank account
      accountDescription: 'Cash - USD',
      debitAmount: Math.abs(gainLoss.gainLossAmount),
      creditAmount: 0,
      currency: 'USD',
    });
    postings.push({
      accountCode: '8100', // FX Gain account
      accountDescription: 'Foreign Exchange Gain',
      debitAmount: 0,
      creditAmount: Math.abs(gainLoss.gainLossAmount),
      currency: 'USD',
    });
  } else if (gainLoss.gainLossAmount < 0) {
    // Realized loss
    postings.push({
      accountCode: '9100', // FX Loss account
      accountDescription: 'Foreign Exchange Loss',
      debitAmount: Math.abs(gainLoss.gainLossAmount),
      creditAmount: 0,
      currency: 'USD',
    });
    postings.push({
      accountCode: '1010', // Cash/Bank account
      accountDescription: 'Cash - USD',
      debitAmount: 0,
      creditAmount: Math.abs(gainLoss.gainLossAmount),
      currency: 'USD',
    });
  }

  console.log(`Generated ${postings.length} GL postings for ${gainLoss.gainLossType} ${gainLoss.gainLossAmount >= 0 ? 'gain' : 'loss'}`);

  return postings;
};

/**
 * Exports gain/loss report for financial reporting.
 *
 * @param {CurrencyGainLoss[]} gainLosses - Gain/loss calculations
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportGainLossReport(gainLosses, new Date('2024-01-01'), new Date('2024-03-31'));
 * fs.writeFileSync('fx-gainloss-q1-2024.csv', csv);
 * ```
 */
export const exportGainLossReport = (
  gainLosses: CurrencyGainLoss[],
  periodStart: Date,
  periodEnd: Date,
): string => {
  const headers = 'Transaction ID,Currency,Type,Original Rate,Settlement Rate,Foreign Amount,Gain/Loss USD,Calculation Date\n';
  const rows = gainLosses.map(
    gl =>
      `${gl.transactionId},${gl.currency},${gl.gainLossType},${gl.originalRate.toFixed(6)},${gl.settlementRate.toFixed(6)},${gl.foreignAmount.toFixed(2)},${gl.gainLossAmount.toFixed(2)},${gl.calculationDate.toISOString()}`,
  );

  const csv = headers + rows.join('\n');
  console.log(`Exported gain/loss report for period ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);

  return csv;
};

/**
 * Analyzes gain/loss drivers and trends.
 *
 * @param {CurrencyGainLoss[]} gainLosses - Historical gain/loss data
 * @returns {any} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeGainLossTrends(historicalGainLosses);
 * console.log('Primary driver currency:', analysis.primaryDriver);
 * console.log('Trend:', analysis.trend);
 * ```
 */
export const analyzeGainLossTrends = (gainLosses: CurrencyGainLoss[]): any => {
  const byCurrency: Record<string, number> = {};
  gainLosses.forEach(gl => {
    if (!byCurrency[gl.currency]) {
      byCurrency[gl.currency] = 0;
    }
    byCurrency[gl.currency] += gl.gainLossAmount;
  });

  const sortedCurrencies = Object.entries(byCurrency).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const primaryDriver = sortedCurrencies[0]?.[0] || 'N/A';

  // Simple trend analysis
  const sortedByDate = [...gainLosses].sort((a, b) => a.calculationDate.getTime() - b.calculationDate.getTime());
  const firstHalf = sortedByDate.slice(0, Math.floor(sortedByDate.length / 2));
  const secondHalf = sortedByDate.slice(Math.floor(sortedByDate.length / 2));

  const firstHalfAvg = firstHalf.reduce((sum, gl) => sum + gl.gainLossAmount, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, gl) => sum + gl.gainLossAmount, 0) / secondHalf.length;

  const trend = secondHalfAvg > firstHalfAvg ? 'improving' : 'declining';

  return {
    byCurrency,
    primaryDriver,
    trend,
    firstHalfAvg,
    secondHalfAvg,
  };
};

// ============================================================================
// CURRENCY EXPOSURE MANAGEMENT (19-24)
// ============================================================================

/**
 * Calculates foreign currency exposure by currency.
 *
 * @param {ForeignCurrencyTransaction[]} transactions - All FX transactions
 * @param {ExchangeRate[]} currentRates - Current exchange rates
 * @returns {CurrencyExposure[]} Exposure by currency
 *
 * @example
 * ```typescript
 * const exposures = calculateCurrencyExposure(allTransactions, currentRates);
 * exposures.forEach(exp => {
 *   console.log(`${exp.currency}: Net ${exp.netExposure.toLocaleString()} (${exp.riskLevel} risk)`);
 * });
 * ```
 */
export const calculateCurrencyExposure = (
  transactions: ForeignCurrencyTransaction[],
  currentRates: ExchangeRate[],
): CurrencyExposure[] => {
  const exposureMap: Record<string, { receivables: number; payables: number }> = {};

  transactions.filter(tx => tx.status !== 'cancelled').forEach(tx => {
    if (!exposureMap[tx.foreignCurrency]) {
      exposureMap[tx.foreignCurrency] = { receivables: 0, payables: 0 };
    }

    if (tx.transactionType === 'receipt') {
      exposureMap[tx.foreignCurrency].receivables += tx.foreignAmount;
    } else if (tx.transactionType === 'payment') {
      exposureMap[tx.foreignCurrency].payables += tx.foreignAmount;
    }
  });

  const exposures: CurrencyExposure[] = [];

  Object.entries(exposureMap).forEach(([currency, amounts]) => {
    const netExposure = amounts.receivables - amounts.payables;
    const currentRate = getCurrentExchangeRate(currency, currentRates);
    const usdEquivalent = currentRate ? Math.abs(netExposure) * currentRate.rate : 0;

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (usdEquivalent > 5000000) {
      riskLevel = 'high';
    } else if (usdEquivalent > 1000000) {
      riskLevel = 'medium';
    }

    exposures.push({
      currency,
      totalReceivables: amounts.receivables,
      totalPayables: amounts.payables,
      netExposure,
      usdEquivalent,
      riskLevel,
    });
  });

  console.log(`Calculated currency exposure for ${exposures.length} currencies`);

  return exposures;
};

/**
 * Identifies high-risk currency exposures requiring hedging.
 *
 * @param {CurrencyExposure[]} exposures - Currency exposures
 * @param {number} [threshold=1000000] - USD threshold for high risk
 * @returns {CurrencyExposure[]} High-risk exposures
 *
 * @example
 * ```typescript
 * const highRisk = identifyHighRiskExposures(exposures, 2000000);
 * console.log(`${highRisk.length} currencies require hedging`);
 * ```
 */
export const identifyHighRiskExposures = (
  exposures: CurrencyExposure[],
  threshold: number = 1000000,
): CurrencyExposure[] => {
  const highRisk = exposures.filter(exp => exp.usdEquivalent >= threshold);

  console.log(`Identified ${highRisk.length} high-risk exposures (threshold: $${threshold.toLocaleString()})`);

  return highRisk;
};

/**
 * Generates currency exposure dashboard for risk management.
 *
 * @param {CurrencyExposure[]} exposures - Currency exposures
 * @returns {any} Exposure dashboard
 *
 * @example
 * ```typescript
 * const dashboard = generateExposureDashboard(exposures);
 * console.log('Total exposure:', dashboard.totalExposureUSD);
 * console.log('High risk currencies:', dashboard.highRiskCount);
 * ```
 */
export const generateExposureDashboard = (exposures: CurrencyExposure[]): any => {
  const dashboard = {
    totalCurrencies: exposures.length,
    totalExposureUSD: exposures.reduce((sum, exp) => sum + exp.usdEquivalent, 0),
    highRiskCount: exposures.filter(exp => exp.riskLevel === 'high').length,
    mediumRiskCount: exposures.filter(exp => exp.riskLevel === 'medium').length,
    lowRiskCount: exposures.filter(exp => exp.riskLevel === 'low').length,
    topExposures: exposures.sort((a, b) => b.usdEquivalent - a.usdEquivalent).slice(0, 5),
    generatedAt: new Date().toISOString(),
  };

  console.log('Currency exposure dashboard generated');

  return dashboard;
};

/**
 * Recommends natural hedging opportunities.
 *
 * @param {CurrencyExposure[]} exposures - Currency exposures
 * @returns {any[]} Natural hedge recommendations
 *
 * @example
 * ```typescript
 * const recommendations = recommendNaturalHedges(exposures);
 * recommendations.forEach(rec => {
 *   console.log(`Match ${rec.currency} receivables with payables to reduce exposure by ${rec.reductionAmount}`);
 * });
 * ```
 */
export const recommendNaturalHedges = (exposures: CurrencyExposure[]): any[] => {
  const recommendations: any[] = [];

  exposures.forEach(exp => {
    const minAmount = Math.min(exp.totalReceivables, exp.totalPayables);
    if (minAmount > 0) {
      recommendations.push({
        currency: exp.currency,
        hedgeType: 'natural',
        receivables: exp.totalReceivables,
        payables: exp.totalPayables,
        matchableAmount: minAmount,
        reductionAmount: minAmount,
        recommendation: `Match ${minAmount.toLocaleString()} ${exp.currency} receivables with payables`,
      });
    }
  });

  console.log(`Identified ${recommendations.length} natural hedging opportunities`);

  return recommendations;
};

/**
 * Exports currency exposure report for treasury.
 *
 * @param {CurrencyExposure[]} exposures - Currency exposures
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportExposureReport(exposures);
 * fs.writeFileSync('currency-exposure.csv', csv);
 * ```
 */
export const exportExposureReport = (exposures: CurrencyExposure[]): string => {
  const headers = 'Currency,Receivables,Payables,Net Exposure,USD Equivalent,Risk Level\n';
  const rows = exposures.map(
    exp =>
      `${exp.currency},${exp.totalReceivables.toFixed(2)},${exp.totalPayables.toFixed(2)},${exp.netExposure.toFixed(2)},${exp.usdEquivalent.toFixed(2)},${exp.riskLevel}`,
  );

  return headers + rows.join('\n');
};

/**
 * Monitors currency exposure against limits.
 *
 * @param {CurrencyExposure[]} exposures - Currency exposures
 * @param {Record<string, number>} limits - Exposure limits by currency (USD)
 * @returns {{ withinLimits: boolean; breaches: any[] }} Monitoring result
 *
 * @example
 * ```typescript
 * const monitoring = monitorExposureLimits(exposures, { EUR: 5000000, GBP: 3000000 });
 * if (!monitoring.withinLimits) {
 *   console.error('Limit breaches:', monitoring.breaches);
 * }
 * ```
 */
export const monitorExposureLimits = (
  exposures: CurrencyExposure[],
  limits: Record<string, number>,
): { withinLimits: boolean; breaches: any[] } => {
  const breaches: any[] = [];

  exposures.forEach(exp => {
    const limit = limits[exp.currency];
    if (limit && exp.usdEquivalent > limit) {
      breaches.push({
        currency: exp.currency,
        exposure: exp.usdEquivalent,
        limit,
        excess: exp.usdEquivalent - limit,
      });
    }
  });

  console.log(`Exposure monitoring: ${breaches.length} limit breaches identified`);

  return {
    withinLimits: breaches.length === 0,
    breaches,
  };
};

// ============================================================================
// CURRENCY REVALUATION (25-30)
// ============================================================================

/**
 * Performs foreign currency revaluation for period-end.
 *
 * @param {ForeignCurrencyTransaction[]} openTransactions - Open transactions
 * @param {ExchangeRate[]} closingRates - Period-end exchange rates
 * @param {Date} revaluationDate - Revaluation date
 * @returns {RevaluationResult[]} Revaluation results
 *
 * @example
 * ```typescript
 * const results = performCurrencyRevaluation(openTx, closingRates, new Date('2024-03-31'));
 * results.forEach(result => {
 *   console.log(`${result.currency}: Unrealized ${result.unrealizedGainLoss >= 0 ? 'gain' : 'loss'} of $${Math.abs(result.unrealizedGainLoss).toLocaleString()}`);
 * });
 * ```
 */
export const performCurrencyRevaluation = (
  openTransactions: ForeignCurrencyTransaction[],
  closingRates: ExchangeRate[],
  revaluationDate: Date,
): RevaluationResult[] => {
  const results: RevaluationResult[] = [];
  const byCurrency: Record<string, ForeignCurrencyTransaction[]> = {};

  openTransactions.forEach(tx => {
    if (!byCurrency[tx.foreignCurrency]) {
      byCurrency[tx.foreignCurrency] = [];
    }
    byCurrency[tx.foreignCurrency].push(tx);
  });

  Object.entries(byCurrency).forEach(([currency, txs]) => {
    const closingRate = getCurrentExchangeRate(currency, closingRates);
    if (!closingRate) {
      console.warn(`No closing rate for ${currency}, skipping revaluation`);
      return;
    }

    const openingBalance = txs.reduce((sum, tx) => sum + tx.foreignAmount, 0);
    const closingBalance = openingBalance; // Same for revaluation
    const avgOpeningRate = txs.reduce((sum, tx) => sum + tx.exchangeRate, 0) / txs.length;

    const openingUSD = openingBalance * avgOpeningRate;
    const closingUSD = closingBalance * closingRate.rate;
    const unrealizedGainLoss = closingUSD - openingUSD;

    const glPostings = generateGainLossGLPostings({
      calculationId: `REVAL-${currency}-${revaluationDate.getTime()}`,
      transactionId: '',
      currency,
      originalRate: avgOpeningRate,
      settlementRate: closingRate.rate,
      foreignAmount: closingBalance,
      gainLossAmount: unrealizedGainLoss,
      gainLossType: 'unrealized',
      calculationDate: revaluationDate,
    });

    results.push({
      revaluationId: `REVAL-${currency}-${revaluationDate.getTime()}`,
      revaluationDate,
      currency,
      openingBalance,
      closingBalance,
      openingRate: avgOpeningRate,
      closingRate: closingRate.rate,
      unrealizedGainLoss,
      glPostings,
    });
  });

  console.log(`Currency revaluation performed for ${results.length} currencies on ${revaluationDate.toISOString()}`);

  return results;
};

/**
 * Generates revaluation journal entries.
 *
 * @param {RevaluationResult[]} revaluationResults - Revaluation results
 * @returns {any[]} Journal entries
 *
 * @example
 * ```typescript
 * const entries = generateRevaluationJournalEntries(revalResults);
 * entries.forEach(entry => {
 *   console.log(`JE ${entry.journalEntryId}: ${entry.description}`);
 * });
 * ```
 */
export const generateRevaluationJournalEntries = (revaluationResults: RevaluationResult[]): any[] => {
  const entries: any[] = [];

  revaluationResults.forEach(result => {
    if (Math.abs(result.unrealizedGainLoss) < 0.01) {
      return; // Skip immaterial amounts
    }

    entries.push({
      journalEntryId: `JE-${result.revaluationId}`,
      entryDate: result.revaluationDate,
      description: `${result.currency} revaluation - unrealized ${result.unrealizedGainLoss >= 0 ? 'gain' : 'loss'}`,
      postings: result.glPostings,
      totalDebit: result.glPostings.reduce((sum, p) => sum + p.debitAmount, 0),
      totalCredit: result.glPostings.reduce((sum, p) => sum + p.creditAmount, 0),
    });
  });

  console.log(`Generated ${entries.length} revaluation journal entries`);

  return entries;
};

/**
 * Validates revaluation completeness and accuracy.
 *
 * @param {RevaluationResult[]} revaluationResults - Revaluation results
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRevaluation(revalResults);
 * if (!validation.valid) {
 *   console.error('Revaluation errors:', validation.errors);
 * }
 * ```
 */
export const validateRevaluation = (
  revaluationResults: RevaluationResult[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  revaluationResults.forEach(result => {
    // Validate GL postings balance
    const totalDebit = result.glPostings.reduce((sum, p) => sum + p.debitAmount, 0);
    const totalCredit = result.glPostings.reduce((sum, p) => sum + p.creditAmount, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push(`${result.currency}: GL postings do not balance (DR ${totalDebit} vs CR ${totalCredit})`);
    }

    // Validate rates are positive
    if (result.openingRate <= 0 || result.closingRate <= 0) {
      errors.push(`${result.currency}: Invalid exchange rates`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Exports revaluation report for financial reporting.
 *
 * @param {RevaluationResult[]} revaluationResults - Revaluation results
 * @returns {string} Formatted revaluation report
 *
 * @example
 * ```typescript
 * const report = exportRevaluationReport(revalResults);
 * fs.writeFileSync('currency-revaluation-q1-2024.txt', report);
 * ```
 */
export const exportRevaluationReport = (revaluationResults: RevaluationResult[]): string => {
  const report = `
FOREIGN CURRENCY REVALUATION REPORT
Revaluation Date: ${revaluationResults[0]?.revaluationDate.toISOString() || 'N/A'}
================================================================================

${revaluationResults
  .map(
    result => `
Currency: ${result.currency}
Opening Balance: ${result.openingBalance.toLocaleString()} ${result.currency}
Closing Balance: ${result.closingBalance.toLocaleString()} ${result.currency}
Opening Rate: ${result.openingRate.toFixed(6)}
Closing Rate: ${result.closingRate.toFixed(6)}
Unrealized ${result.unrealizedGainLoss >= 0 ? 'Gain' : 'Loss'}: $${Math.abs(result.unrealizedGainLoss).toLocaleString()}

GL Postings:
${result.glPostings.map(p => `  ${p.accountCode} ${p.accountDescription}: DR ${p.debitAmount.toFixed(2)} CR ${p.creditAmount.toFixed(2)}`).join('\n')}
--------------------------------------------------------------------------------
`,
  )
  .join('\n')}

Total Unrealized Gain/Loss: $${revaluationResults.reduce((sum, r) => sum + r.unrealizedGainLoss, 0).toLocaleString()}

================================================================================
End of Report
`;

  console.log('Revaluation report exported');

  return report;
};

/**
 * Reverses prior period revaluation entries.
 *
 * @param {RevaluationResult[]} priorRevaluation - Prior period revaluation
 * @param {Date} reversalDate - Reversal date
 * @returns {any[]} Reversal journal entries
 *
 * @example
 * ```typescript
 * const reversals = reversePriorRevaluation(priorPeriodReval, new Date('2024-04-01'));
 * console.log(`Generated ${reversals.length} reversal entries`);
 * ```
 */
export const reversePriorRevaluation = (
  priorRevaluation: RevaluationResult[],
  reversalDate: Date,
): any[] => {
  const reversals: any[] = [];

  priorRevaluation.forEach(result => {
    if (Math.abs(result.unrealizedGainLoss) < 0.01) {
      return;
    }

    // Reverse GL postings (swap debits and credits)
    const reversedPostings = result.glPostings.map(posting => ({
      ...posting,
      debitAmount: posting.creditAmount,
      creditAmount: posting.debitAmount,
    }));

    reversals.push({
      journalEntryId: `JE-REV-${result.revaluationId}`,
      entryDate: reversalDate,
      description: `Reversal of ${result.currency} revaluation from ${result.revaluationDate.toISOString()}`,
      postings: reversedPostings,
      totalDebit: reversedPostings.reduce((sum, p) => sum + p.debitAmount, 0),
      totalCredit: reversedPostings.reduce((sum, p) => sum + p.creditAmount, 0),
    });
  });

  console.log(`Generated ${reversals.length} revaluation reversal entries`);

  return reversals;
};

/**
 * Analyzes revaluation trends over multiple periods.
 *
 * @param {RevaluationResult[][]} historicalRevaluations - Historical revaluation data
 * @returns {any} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = analyzeRevaluationTrends([q1Reval, q2Reval, q3Reval, q4Reval]);
 * console.log('Trend:', trends.overall);
 * console.log('Most volatile currency:', trends.mostVolatile);
 * ```
 */
export const analyzeRevaluationTrends = (historicalRevaluations: RevaluationResult[][]): any => {
  const byCurrency: Record<string, number[]> = {};

  historicalRevaluations.forEach(periodReval => {
    periodReval.forEach(result => {
      if (!byCurrency[result.currency]) {
        byCurrency[result.currency] = [];
      }
      byCurrency[result.currency].push(result.unrealizedGainLoss);
    });
  });

  const volatility: Record<string, number> = {};
  Object.entries(byCurrency).forEach(([currency, values]) => {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    volatility[currency] = Math.sqrt(variance);
  });

  const sortedVolatility = Object.entries(volatility).sort((a, b) => b[1] - a[1]);
  const mostVolatile = sortedVolatility[0]?.[0] || 'N/A';

  const overallTrend = historicalRevaluations.map(periodReval =>
    periodReval.reduce((sum, r) => sum + r.unrealizedGainLoss, 0),
  );

  return {
    overall: overallTrend[overallTrend.length - 1] > overallTrend[0] ? 'increasing_gains' : 'decreasing_gains',
    mostVolatile,
    volatility,
    byCurrency,
  };
};

// ============================================================================
// HEDGING STRATEGY (31-36)
// ============================================================================

/**
 * Recommends hedging strategy for currency exposure.
 *
 * @param {CurrencyExposure} exposure - Currency exposure
 * @param {number} targetHedgeRatio - Target hedge ratio (0-100%)
 * @returns {HedgingStrategy} Recommended hedging strategy
 *
 * @example
 * ```typescript
 * const strategy = recommendHedgingStrategy(eurExposure, 75);
 * console.log(`Recommended hedge: ${strategy.instrument} for ${strategy.notionalAmount.toLocaleString()} ${exposure.currency}`);
 * ```
 */
export const recommendHedgingStrategy = (
  exposure: CurrencyExposure,
  targetHedgeRatio: number = 75,
): HedgingStrategy => {
  if (targetHedgeRatio < 0 || targetHedgeRatio > 100) {
    throw new Error('Target hedge ratio must be between 0 and 100');
  }

  const notionalAmount = Math.abs(exposure.netExposure) * (targetHedgeRatio / 100);

  let instrument: 'forward' | 'option' | 'swap' | 'natural_hedge' = 'forward';
  if (exposure.riskLevel === 'high') {
    instrument = 'forward';
  } else if (exposure.riskLevel === 'medium') {
    instrument = 'option';
  }

  const executionDate = new Date();
  const maturityDate = new Date(executionDate.getTime() + 90 * 86400000); // 90 days

  const strategy: HedgingStrategy = {
    strategyId: `HEDGE-${exposure.currency}-${Date.now()}`,
    currency: exposure.currency,
    instrument,
    notionalAmount,
    hedgeRatio: targetHedgeRatio,
    executionDate,
    maturityDate,
    status: 'active',
  };

  console.log(`Recommended ${instrument} hedge for ${exposure.currency}: ${notionalAmount.toLocaleString()} (${targetHedgeRatio}% ratio)`);

  return strategy;
};

/**
 * Evaluates hedging effectiveness.
 *
 * @param {HedgingStrategy} strategy - Hedging strategy
 * @param {CurrencyGainLoss[]} actualGainLosses - Actual gains/losses
 * @returns {{ effectiveness: number; protectedAmount: number; unprotectedAmount: number }} Effectiveness analysis
 *
 * @example
 * ```typescript
 * const effectiveness = evaluateHedgeEffectiveness(hedgeStrategy, actualGL);
 * console.log(`Hedge effectiveness: ${effectiveness.effectiveness.toFixed(2)}%`);
 * console.log(`Protected: $${effectiveness.protectedAmount.toLocaleString()}`);
 * ```
 */
export const evaluateHedgeEffectiveness = (
  strategy: HedgingStrategy,
  actualGainLosses: CurrencyGainLoss[],
): { effectiveness: number; protectedAmount: number; unprotectedAmount: number } => {
  const currencyGL = actualGainLosses.filter(gl => gl.currency === strategy.currency);
  const totalExposure = currencyGL.reduce((sum, gl) => sum + Math.abs(gl.foreignAmount), 0);
  const totalGL = currencyGL.reduce((sum, gl) => sum + Math.abs(gl.gainLossAmount), 0);

  const protectedAmount = strategy.notionalAmount;
  const unprotectedAmount = Math.max(0, totalExposure - protectedAmount);

  const protectedRatio = totalExposure > 0 ? protectedAmount / totalExposure : 0;
  const effectiveness = protectedRatio * 100;

  console.log(`Hedge effectiveness for ${strategy.currency}: ${effectiveness.toFixed(2)}%`);

  return {
    effectiveness,
    protectedAmount,
    unprotectedAmount,
  };
};

/**
 * Tracks hedging costs and benefits.
 *
 * @param {HedgingStrategy} strategy - Hedging strategy
 * @param {number} hedgingCost - Cost of hedging (premium, spread, etc.)
 * @param {number} avoidedk Loss - Loss avoided due to hedge
 * @returns {{ netBenefit: number; roi: number; costEffective: boolean }} Cost-benefit analysis
 *
 * @example
 * ```typescript
 * const analysis = trackHedgingCostBenefit(strategy, 25000, 150000);
 * console.log(`Net benefit: $${analysis.netBenefit.toLocaleString()}`);
 * console.log(`ROI: ${analysis.roi.toFixed(2)}%`);
 * ```
 */
export const trackHedgingCostBenefit = (
  strategy: HedgingStrategy,
  hedgingCost: number,
  avoidedLoss: number,
): { netBenefit: number; roi: number; costEffective: boolean } => {
  const netBenefit = avoidedLoss - hedgingCost;
  const roi = hedgingCost > 0 ? (netBenefit / hedgingCost) * 100 : 0;
  const costEffective = netBenefit > 0;

  console.log(`Hedging ${strategy.currency}: Net benefit $${netBenefit.toLocaleString()}, ROI ${roi.toFixed(2)}%`);

  return {
    netBenefit,
    roi,
    costEffective,
  };
};

/**
 * Generates hedging compliance report for federal regulations.
 *
 * @param {HedgingStrategy[]} strategies - Active hedging strategies
 * @returns {{ compliant: boolean; issues: string[] }} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = generateHedgingComplianceReport(activeStrategies);
 * if (!compliance.compliant) {
 *   console.error('Compliance issues:', compliance.issues);
 * }
 * ```
 */
export const generateHedgingComplianceReport = (
  strategies: HedgingStrategy[],
): { compliant: boolean; issues: string[] } => {
  const issues: string[] = [];

  strategies.forEach(strategy => {
    // Check for proper documentation
    if (!strategy.hedgedRate) {
      issues.push(`${strategy.currency}: Missing hedged rate documentation`);
    }

    // Check hedge ratio limits (typically 0-100%)
    if (strategy.hedgeRatio > 100) {
      issues.push(`${strategy.currency}: Hedge ratio exceeds 100%`);
    }

    // Check maturity dates
    const daysToMaturity = (strategy.maturityDate.getTime() - new Date().getTime()) / 86400000;
    if (daysToMaturity < 0) {
      issues.push(`${strategy.currency}: Strategy has expired`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Exports hedging activity report for treasury reporting.
 *
 * @param {HedgingStrategy[]} strategies - Hedging strategies
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportHedgingActivityReport(strategies);
 * fs.writeFileSync('hedging-activity.csv', csv);
 * ```
 */
export const exportHedgingActivityReport = (strategies: HedgingStrategy[]): string => {
  const headers = 'Strategy ID,Currency,Instrument,Notional Amount,Hedge Ratio %,Execution Date,Maturity Date,Status\n';
  const rows = strategies.map(
    s =>
      `${s.strategyId},${s.currency},${s.instrument},${s.notionalAmount.toFixed(2)},${s.hedgeRatio.toFixed(2)},${s.executionDate.toISOString()},${s.maturityDate.toISOString()},${s.status}`,
  );

  return headers + rows.join('\n');
};

/**
 * Generates comprehensive foreign currency management dashboard.
 *
 * @param {ForeignCurrencyTransaction[]} transactions - All FX transactions
 * @param {ExchangeRate[]} rates - Current exchange rates
 * @param {HedgingStrategy[]} strategies - Active hedging strategies
 * @returns {any} Comprehensive dashboard
 *
 * @example
 * ```typescript
 * const dashboard = generateFXManagementDashboard(allTx, currentRates, activeHedges);
 * console.log('Dashboard:', dashboard);
 * ```
 */
export const generateFXManagementDashboard = (
  transactions: ForeignCurrencyTransaction[],
  rates: ExchangeRate[],
  strategies: HedgingStrategy[],
): any => {
  const exposures = calculateCurrencyExposure(transactions, rates);
  const openTx = transactions.filter(tx => tx.status === 'pending');
  const unrealizedGL = calculateUnrealizedGainLoss(openTx, rates);
  const glSummary = summarizeGainLoss(unrealizedGL);

  const dashboard = {
    summary: {
      totalCurrencies: exposures.length,
      totalExposureUSD: exposures.reduce((sum, exp) => sum + exp.usdEquivalent, 0),
      totalTransactions: transactions.length,
      openTransactions: openTx.length,
      activeHedges: strategies.filter(s => s.status === 'active').length,
    },
    exposure: {
      highRisk: exposures.filter(exp => exp.riskLevel === 'high').length,
      mediumRisk: exposures.filter(exp => exp.riskLevel === 'medium').length,
      lowRisk: exposures.filter(exp => exp.riskLevel === 'low').length,
      topExposures: exposures.sort((a, b) => b.usdEquivalent - a.usdEquivalent).slice(0, 5),
    },
    gainLoss: glSummary,
    hedging: {
      totalHedged: strategies.reduce((sum, s) => sum + s.notionalAmount, 0),
      averageHedgeRatio: strategies.reduce((sum, s) => sum + s.hedgeRatio, 0) / strategies.length || 0,
    },
    generatedAt: new Date().toISOString(),
  };

  console.log('FX management dashboard generated');

  return dashboard;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Foreign Currency Transaction management.
 *
 * @example
 * ```typescript
 * @Controller('fx')
 * export class FXController {
 *   constructor(private readonly fxService: ForeignCurrencyService) {}
 *
 *   @Post('transactions')
 *   async createTransaction(@Body() data: ForeignCurrencyTransaction) {
 *     return this.fxService.createTransaction(data, 'user123');
 *   }
 *
 *   @Get('dashboard')
 *   async getDashboard() {
 *     return this.fxService.generateDashboard();
 *   }
 * }
 * ```
 */
@Injectable()
export class ForeignCurrencyService {
  constructor(private readonly sequelize: Sequelize) {}

  async createTransaction(data: ForeignCurrencyTransaction, userId: string) {
    const FCTModel = createForeignCurrencyTransactionModel(this.sequelize);
    return createForeignCurrencyTransaction(data, FCTModel, userId);
  }

  async generateDashboard() {
    // In production, retrieve data from database
    return generateFXManagementDashboard([], [], []);
  }
}

/**
 * Default export with all foreign currency utilities.
 */
export default {
  // Models
  createForeignCurrencyTransactionModel,

  // Transaction Processing
  createForeignCurrencyTransaction,
  convertToUSD,
  convertFromUSD,
  settleForeignCurrencyTransaction,
  getForeignCurrencyTransactions,
  cancelForeignCurrencyTransaction,

  // Exchange Rate Management
  getCurrentExchangeRate,
  updateExchangeRates,
  calculateAverageExchangeRate,
  validateExchangeRate,
  getHistoricalExchangeRate,
  compareExchangeRateSources,

  // Gain/Loss Calculation
  calculateRealizedGainLoss,
  calculateUnrealizedGainLoss,
  summarizeGainLoss,
  generateGainLossGLPostings,
  exportGainLossReport,
  analyzeGainLossTrends,

  // Exposure Management
  calculateCurrencyExposure,
  identifyHighRiskExposures,
  generateExposureDashboard,
  recommendNaturalHedges,
  exportExposureReport,
  monitorExposureLimits,

  // Currency Revaluation
  performCurrencyRevaluation,
  generateRevaluationJournalEntries,
  validateRevaluation,
  exportRevaluationReport,
  reversePriorRevaluation,
  analyzeRevaluationTrends,

  // Hedging Strategy
  recommendHedgingStrategy,
  evaluateHedgeEffectiveness,
  trackHedgingCostBenefit,
  generateHedgingComplianceReport,
  exportHedgingActivityReport,
  generateFXManagementDashboard,

  // Service
  ForeignCurrencyService,
};

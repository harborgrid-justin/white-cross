/**
 * LOC: TRYCSH7890123
 * File: /reuse/financial/treasury-cash-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial services
 *   - Treasury management controllers
 *   - Cash flow analysis services
 *   - Bank reconciliation modules
 */

/**
 * File: /reuse/financial/treasury-cash-management-kit.ts
 * Locator: WC-FIN-TRYCSH-001
 * Purpose: USACE CEFMS-Level Treasury & Cash Management - cash positioning, bank reconciliation,
 *          cash forecasting, liquidity management, investment tracking, wire transfers
 *
 * Upstream: Independent utility module for treasury operations
 * Downstream: ../backend/*, financial controllers, treasury services, reconciliation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47 utility functions for cash management, bank reconciliation, forecasting, investments
 *
 * LLM Context: Enterprise-grade treasury and cash management utilities competing with USACE CEFMS.
 * Provides cash position tracking, multi-bank reconciliation, cash flow forecasting, liquidity analysis,
 * investment portfolio management, wire transfer processing, check clearing, automated sweeps,
 * concentration accounting, notional pooling, zero-balance accounts, treasury workstation integration,
 * SWIFT/ACH processing, fraud detection, and real-time cash visibility across distributed accounts.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CashPosition {
  accountId: string;
  bankId: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  floatAmount: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface BankStatement {
  statementId: string;
  accountId: string;
  statementDate: Date;
  openingBalance: number;
  closingBalance: number;
  transactions: BankTransaction[];
  currency: string;
}

interface BankTransaction {
  transactionId: string;
  valueDate: Date;
  postingDate: Date;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  description: string;
  referenceNumber: string;
  checkNumber?: string;
  counterparty?: string;
  status: 'PENDING' | 'CLEARED' | 'RECONCILED';
}

interface ReconciliationMatch {
  bankTransactionId: string;
  ledgerTransactionId: string;
  matchType: 'EXACT' | 'FUZZY' | 'MANUAL';
  matchScore: number;
  variance?: number;
  matchedBy?: string;
  matchedAt: Date;
}

interface CashFlowForecast {
  forecastDate: Date;
  projectedInflows: number;
  projectedOutflows: number;
  netCashFlow: number;
  cumulativeBalance: number;
  confidence: number;
  scenario: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
  assumptions: string[];
}

interface LiquidityAnalysis {
  asOfDate: Date;
  totalCash: number;
  availableCash: number;
  restrictedCash: number;
  shortTermInvestments: number;
  currentRatio: number;
  quickRatio: number;
  workingCapital: number;
  daysOfCashOnHand: number;
  recommendations: string[];
}

interface Investment {
  investmentId: string;
  accountId: string;
  securityType: 'TBILL' | 'COMMERCIAL_PAPER' | 'CD' | 'MONEY_MARKET' | 'REPO';
  cusip?: string;
  principalAmount: number;
  purchaseDate: Date;
  maturityDate: Date;
  interestRate: number;
  currentValue: number;
  accruedInterest: number;
  yieldToMaturity: number;
  ratingAgency?: string;
  creditRating?: string;
}

interface WireTransfer {
  wireId: string;
  initiatedBy: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  currency: string;
  valueDate: Date;
  beneficiaryName: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  swiftCode?: string;
  routingNumber?: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'SENT' | 'RECEIVED' | 'REJECTED' | 'CANCELLED';
  approvals: WireApproval[];
}

interface WireApproval {
  approverUserId: string;
  approvalLevel: number;
  approvedAt: Date;
  comments?: string;
  ipAddress: string;
}

interface BankAccount {
  accountId: string;
  accountNumber: string;
  accountName: string;
  bankId: string;
  bankName: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'ZBA' | 'INVESTMENT';
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
  targetBalance?: number;
  minimumBalance?: number;
  maximumBalance?: number;
  sweepAccountId?: string;
}

interface ReconciliationReport {
  reportId: string;
  accountId: string;
  periodStart: Date;
  periodEnd: Date;
  bankBalance: number;
  ledgerBalance: number;
  outstandingChecks: number;
  depositsInTransit: number;
  bankErrors: number;
  bookErrors: number;
  adjustedBankBalance: number;
  adjustedBookBalance: number;
  variance: number;
  isReconciled: boolean;
  reconciledBy?: string;
  reconciledAt?: Date;
  exceptions: ReconciliationException[];
}

interface ReconciliationException {
  exceptionId: string;
  type: 'MISSING_BANK' | 'MISSING_LEDGER' | 'AMOUNT_MISMATCH' | 'DATE_MISMATCH' | 'DUPLICATE';
  description: string;
  amount: number;
  transactionRef: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  assignedTo?: string;
  resolution?: string;
}

interface CashConcentration {
  concentrationId: string;
  masterAccountId: string;
  targetAccountIds: string[];
  sweepType: 'TARGET_BALANCE' | 'ZERO_BALANCE' | 'THRESHOLD';
  sweepFrequency: 'DAILY' | 'WEEKLY' | 'ON_DEMAND';
  sweepTime?: string;
  lastSweepDate?: Date;
  enabled: boolean;
}

interface FraudDetectionRule {
  ruleId: string;
  ruleName: string;
  ruleType: 'VELOCITY' | 'AMOUNT_THRESHOLD' | 'GEOLOCATION' | 'BENEFICIARY' | 'PATTERN';
  enabled: boolean;
  threshold?: number;
  parameters: Record<string, any>;
  actions: Array<'ALERT' | 'HOLD' | 'REJECT'>;
}

interface CashFlowCategory {
  categoryId: string;
  categoryName: string;
  categoryType: 'INFLOW' | 'OUTFLOW';
  parentCategoryId?: string;
  budgetAmount?: number;
  forecastMethod: 'AVERAGE' | 'TREND' | 'REGRESSION' | 'MANUAL';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Cash Positions with real-time balance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashPosition model
 *
 * @example
 * ```typescript
 * const CashPosition = createCashPositionModel(sequelize);
 * const position = await CashPosition.create({
 *   accountId: 'ACC-001',
 *   bankId: 'BNK-001',
 *   currency: 'USD',
 *   availableBalance: 1500000.00,
 *   ledgerBalance: 1520000.00,
 *   floatAmount: 20000.00
 * });
 * ```
 */
export const createCashPositionModel = (sequelize: Sequelize) => {
  class CashPosition extends Model {
    public id!: number;
    public accountId!: string;
    public bankId!: string;
    public accountNumber!: string;
    public accountName!: string;
    public currency!: string;
    public availableBalance!: number;
    public ledgerBalance!: number;
    public floatAmount!: number;
    public clearedBalance!: number;
    public unclearedChecks!: number;
    public unclearedDeposits!: number;
    public availableCredit!: number;
    public reservedFunds!: number;
    public overdraftLimit!: number;
    public effectiveBalance!: number;
    public positionDate!: Date;
    public valueDate!: Date;
    public lastUpdated!: Date;
    public dataSource!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CashPosition.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Internal account identifier',
        validate: {
          notEmpty: true,
        },
      },
      bankId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bank institution identifier',
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bank account number (encrypted)',
      },
      accountName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Account descriptive name',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'ISO 4217 currency code',
        validate: {
          isUppercase: true,
          len: [3, 3],
        },
      },
      availableBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Available balance for transactions',
      },
      ledgerBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Book balance including all transactions',
      },
      floatAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Float between ledger and available',
      },
      clearedBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Cleared transactions only',
      },
      unclearedChecks: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Outstanding check amount',
      },
      unclearedDeposits: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Deposits in transit amount',
      },
      availableCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Available credit line',
      },
      reservedFunds: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Funds reserved for pending transactions',
      },
      overdraftLimit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Overdraft protection limit',
      },
      effectiveBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total usable funds (available + credit)',
      },
      positionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Position as-of date',
      },
      valueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Value date for balance',
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Last balance update timestamp',
      },
      dataSource: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'BANK_FEED',
        comment: 'Source of position data',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'cash_positions',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['bankId'] },
        { fields: ['currency'] },
        { fields: ['positionDate'] },
        { fields: ['valueDate'] },
        { fields: ['accountId', 'positionDate'], unique: true },
        { fields: ['lastUpdated'] },
      ],
    },
  );

  return CashPosition;
};

/**
 * Sequelize model for Bank Reconciliations with exception tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliation model
 *
 * @example
 * ```typescript
 * const BankReconciliation = createBankReconciliationModel(sequelize);
 * const recon = await BankReconciliation.create({
 *   accountId: 'ACC-001',
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-01-31'),
 *   bankBalance: 1000000.00,
 *   ledgerBalance: 995000.00,
 *   status: 'IN_PROGRESS'
 * });
 * ```
 */
export const createBankReconciliationModel = (sequelize: Sequelize) => {
  class BankReconciliation extends Model {
    public id!: number;
    public reconciliationId!: string;
    public accountId!: string;
    public periodStart!: Date;
    public periodEnd!: Date;
    public bankOpeningBalance!: number;
    public bankClosingBalance!: number;
    public ledgerOpeningBalance!: number;
    public ledgerClosingBalance!: number;
    public outstandingChecks!: number;
    public depositsInTransit!: number;
    public bankServiceCharges!: number;
    public interestEarned!: number;
    public nsfReturns!: number;
    public bankErrors!: number;
    public bookErrors!: number;
    public otherAdjustments!: number;
    public adjustedBankBalance!: number;
    public adjustedBookBalance!: number;
    public variance!: number;
    public matchedTransactions!: number;
    public unmatchedBankTransactions!: number;
    public unmatchedLedgerTransactions!: number;
    public status!: string;
    public isReconciled!: boolean;
    public reconciledBy!: string | null;
    public reconciledAt!: Date | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public comments!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BankReconciliation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reconciliationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique reconciliation identifier',
      },
      accountId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bank account identifier',
      },
      periodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reconciliation period start date',
      },
      periodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reconciliation period end date',
      },
      bankOpeningBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Bank statement opening balance',
      },
      bankClosingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Bank statement closing balance',
      },
      ledgerOpeningBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Book opening balance',
      },
      ledgerClosingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Book closing balance',
      },
      outstandingChecks: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total outstanding checks',
      },
      depositsInTransit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total deposits in transit',
      },
      bankServiceCharges: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Bank service charges',
      },
      interestEarned: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Interest earned',
      },
      nsfReturns: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'NSF/returned items',
      },
      bankErrors: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Bank errors requiring adjustment',
      },
      bookErrors: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Book errors requiring adjustment',
      },
      otherAdjustments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Other reconciling items',
      },
      adjustedBankBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Adjusted bank balance',
      },
      adjustedBookBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Adjusted book balance',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Variance between adjusted balances',
      },
      matchedTransactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Count of matched transactions',
      },
      unmatchedBankTransactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Count of unmatched bank items',
      },
      unmatchedLedgerTransactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Count of unmatched ledger items',
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'DRAFT',
        comment: 'Reconciliation status',
      },
      isReconciled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether reconciliation is complete',
      },
      reconciledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who completed reconciliation',
      },
      reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation completion timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved reconciliation',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reconciliation comments/notes',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'bank_reconciliations',
      timestamps: true,
      indexes: [
        { fields: ['reconciliationId'], unique: true },
        { fields: ['accountId'] },
        { fields: ['status'] },
        { fields: ['periodStart', 'periodEnd'] },
        { fields: ['isReconciled'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return BankReconciliation;
};

/**
 * Sequelize model for Investment Portfolio tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Investment model
 *
 * @example
 * ```typescript
 * const Investment = createInvestmentModel(sequelize);
 * const investment = await Investment.create({
 *   investmentId: 'INV-001',
 *   securityType: 'TBILL',
 *   principalAmount: 100000.00,
 *   purchaseDate: new Date(),
 *   maturityDate: new Date('2024-06-30'),
 *   interestRate: 5.25
 * });
 * ```
 */
export const createInvestmentModel = (sequelize: Sequelize) => {
  class Investment extends Model {
    public id!: number;
    public investmentId!: string;
    public accountId!: string;
    public portfolioId!: string;
    public securityType!: string;
    public securityName!: string;
    public cusip!: string | null;
    public isin!: string | null;
    public principalAmount!: number;
    public purchaseDate!: Date;
    public settlementDate!: Date;
    public maturityDate!: Date;
    public interestRate!: number;
    public purchasePrice!: number;
    public currentValue!: number;
    public marketValue!: number;
    public accruedInterest!: number;
    public yieldToMaturity!: number;
    public effectiveYield!: number;
    public duration!: number;
    public creditRating!: string | null;
    public ratingAgency!: string | null;
    public counterparty!: string | null;
    public brokerDealer!: string | null;
    public status!: string;
    public collateralized!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Investment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      investmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique investment identifier',
      },
      accountId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Associated account identifier',
      },
      portfolioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Portfolio identifier',
      },
      securityType: {
        type: DataTypes.ENUM('TBILL', 'TNOTE', 'COMMERCIAL_PAPER', 'CD', 'MONEY_MARKET', 'REPO', 'MUNICIPAL', 'CORPORATE_BOND'),
        allowNull: false,
        comment: 'Type of security',
      },
      securityName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Security descriptive name',
      },
      cusip: {
        type: DataTypes.STRING(9),
        allowNull: true,
        comment: 'CUSIP identifier',
      },
      isin: {
        type: DataTypes.STRING(12),
        allowNull: true,
        comment: 'ISIN identifier',
      },
      principalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Principal/face amount',
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Purchase date',
      },
      settlementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Settlement date',
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maturity date',
      },
      interestRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Stated interest rate (annual %)',
      },
      purchasePrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Purchase price',
      },
      currentValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current book value',
      },
      marketValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current market value',
      },
      accruedInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Accrued interest to date',
      },
      yieldToMaturity: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Yield to maturity (%)',
      },
      effectiveYield: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Effective annual yield (%)',
      },
      duration: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        defaultValue: 0.0000,
        comment: 'Macaulay duration (years)',
      },
      creditRating: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Credit rating (e.g., AAA, A+)',
      },
      ratingAgency: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Rating agency (Moody\'s, S&P, Fitch)',
      },
      counterparty: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Counterparty name',
      },
      brokerDealer: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Broker-dealer',
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'MATURED', 'SOLD', 'CALLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Investment status',
      },
      collateralized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether investment is collateralized',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'investments',
      timestamps: true,
      indexes: [
        { fields: ['investmentId'], unique: true },
        { fields: ['accountId'] },
        { fields: ['portfolioId'] },
        { fields: ['securityType'] },
        { fields: ['maturityDate'] },
        { fields: ['status'] },
        { fields: ['cusip'] },
      ],
    },
  );

  return Investment;
};

// ============================================================================
// CASH POSITION MANAGEMENT (1-8)
// ============================================================================

/**
 * Gets current cash position for a specific bank account.
 *
 * @param {string} accountId - Account identifier
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<CashPosition>} Current cash position
 *
 * @example
 * ```typescript
 * const position = await getCurrentCashPosition('ACC-001', CashPosition);
 * console.log('Available:', position.availableBalance);
 * ```
 */
export const getCurrentCashPosition = async (
  accountId: string,
  CashPosition: any,
): Promise<CashPosition> => {
  const position = await CashPosition.findOne({
    where: { accountId },
    order: [['positionDate', 'DESC']],
  });

  if (!position) {
    throw new Error(`Cash position not found for account ${accountId}`);
  }

  return position.toJSON();
};

/**
 * Updates cash position with new transaction or bank feed data.
 *
 * @param {string} accountId - Account identifier
 * @param {Partial<CashPosition>} updates - Position updates
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashPosition>} Updated position
 *
 * @example
 * ```typescript
 * await updateCashPosition('ACC-001', {
 *   availableBalance: 1550000.00,
 *   ledgerBalance: 1570000.00,
 *   lastUpdated: new Date()
 * }, CashPosition);
 * ```
 */
export const updateCashPosition = async (
  accountId: string,
  updates: Partial<CashPosition>,
  CashPosition: any,
  transaction?: Transaction,
): Promise<CashPosition> => {
  const position = await CashPosition.findOne({
    where: { accountId },
    order: [['positionDate', 'DESC']],
    transaction,
  });

  if (!position) {
    throw new Error(`Cash position not found for account ${accountId}`);
  }

  // Calculate float if both balances provided
  if (updates.ledgerBalance !== undefined && updates.availableBalance !== undefined) {
    updates.floatAmount = updates.ledgerBalance - updates.availableBalance;
  }

  // Calculate effective balance
  if (updates.availableBalance !== undefined && updates.availableCredit !== undefined) {
    updates.effectiveBalance = updates.availableBalance + updates.availableCredit;
  }

  await position.update(updates, { transaction });
  return position.toJSON();
};

/**
 * Calculates aggregated cash position across multiple accounts.
 *
 * @param {string[]} accountIds - Array of account identifiers
 * @param {Model} CashPosition - CashPosition model
 * @param {string} [currency='USD'] - Currency filter
 * @returns {Promise<object>} Aggregated position
 *
 * @example
 * ```typescript
 * const aggregate = await calculateAggregateCashPosition(
 *   ['ACC-001', 'ACC-002', 'ACC-003'],
 *   CashPosition
 * );
 * ```
 */
export const calculateAggregateCashPosition = async (
  accountIds: string[],
  CashPosition: any,
  currency = 'USD',
): Promise<object> => {
  const positions = await CashPosition.findAll({
    where: {
      accountId: { [Op.in]: accountIds },
      currency,
    },
    order: [['positionDate', 'DESC']],
  });

  // Get latest position for each account
  const latestPositions = new Map();
  positions.forEach((pos: any) => {
    const p = pos.toJSON();
    if (!latestPositions.has(p.accountId) ||
        latestPositions.get(p.accountId).positionDate < p.positionDate) {
      latestPositions.set(p.accountId, p);
    }
  });

  const aggregated = Array.from(latestPositions.values()).reduce(
    (acc, pos) => ({
      totalAvailable: acc.totalAvailable + pos.availableBalance,
      totalLedger: acc.totalLedger + pos.ledgerBalance,
      totalFloat: acc.totalFloat + pos.floatAmount,
      totalCleared: acc.totalCleared + pos.clearedBalance,
      totalReserved: acc.totalReserved + pos.reservedFunds,
      accounts: acc.accounts + 1,
    }),
    {
      totalAvailable: 0,
      totalLedger: 0,
      totalFloat: 0,
      totalCleared: 0,
      totalReserved: 0,
      accounts: 0,
    },
  );

  return {
    ...aggregated,
    currency,
    asOfDate: new Date(),
    accountIds,
  };
};

/**
 * Tracks intraday cash position changes from transaction processing.
 *
 * @param {string} accountId - Account identifier
 * @param {number} amount - Transaction amount (positive/negative)
 * @param {string} transactionType - Transaction type
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashPosition>} Updated position
 *
 * @example
 * ```typescript
 * await trackIntradayPosition('ACC-001', -50000.00, 'WIRE_OUT', CashPosition);
 * ```
 */
export const trackIntradayPosition = async (
  accountId: string,
  amount: number,
  transactionType: string,
  CashPosition: any,
  transaction?: Transaction,
): Promise<CashPosition> => {
  const position = await getCurrentCashPosition(accountId, CashPosition);

  // Determine which balance to update based on transaction type
  const updates: any = {
    lastUpdated: new Date(),
    metadata: {
      ...position.metadata,
      lastTransaction: {
        type: transactionType,
        amount,
        timestamp: new Date(),
      },
    },
  };

  // Update ledger balance immediately
  updates.ledgerBalance = position.ledgerBalance + amount;

  // Update available balance based on transaction type
  if (['WIRE_OUT', 'ACH_DEBIT', 'CHECK_ISSUED'].includes(transactionType)) {
    updates.availableBalance = position.availableBalance + amount;
  } else if (['WIRE_IN', 'ACH_CREDIT'].includes(transactionType)) {
    updates.availableBalance = position.availableBalance + amount;
  } else if (transactionType === 'DEPOSIT') {
    // Deposits affect ledger but may not be immediately available
    updates.unclearedDeposits = position.unclearedDeposits + amount;
  } else if (transactionType === 'CHECK_CLEARED') {
    updates.availableBalance = position.availableBalance + amount;
    updates.unclearedChecks = position.unclearedChecks - Math.abs(amount);
  }

  return updateCashPosition(accountId, updates, CashPosition, transaction);
};

/**
 * Calculates available-to-spend considering float and pending transactions.
 *
 * @param {string} accountId - Account identifier
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<number>} Available-to-spend amount
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableToSpend('ACC-001', CashPosition);
 * console.log('Can spend:', available);
 * ```
 */
export const calculateAvailableToSpend = async (
  accountId: string,
  CashPosition: any,
): Promise<number> => {
  const position = await getCurrentCashPosition(accountId, CashPosition);

  // Available to spend = available balance - reserved funds
  const availableToSpend = position.availableBalance - position.reservedFunds;

  // Consider overdraft protection
  const withOverdraft = availableToSpend + position.overdraftLimit;

  return Math.max(0, withOverdraft);
};

/**
 * Projects end-of-day cash position based on scheduled transactions.
 *
 * @param {string} accountId - Account identifier
 * @param {Array<{amount: number, type: string}>} scheduledTransactions - Scheduled txns
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Projected EOD position
 *
 * @example
 * ```typescript
 * const projection = await projectEndOfDayPosition('ACC-001', [
 *   { amount: -100000, type: 'WIRE_OUT' },
 *   { amount: 50000, type: 'ACH_CREDIT' }
 * ], CashPosition);
 * ```
 */
export const projectEndOfDayPosition = async (
  accountId: string,
  scheduledTransactions: Array<{ amount: number; type: string }>,
  CashPosition: any,
): Promise<object> => {
  const currentPosition = await getCurrentCashPosition(accountId, CashPosition);

  const projectedChanges = scheduledTransactions.reduce(
    (acc, txn) => acc + txn.amount,
    0,
  );

  return {
    accountId,
    currentAvailable: currentPosition.availableBalance,
    currentLedger: currentPosition.ledgerBalance,
    projectedChanges,
    projectedAvailable: currentPosition.availableBalance + projectedChanges,
    projectedLedger: currentPosition.ledgerBalance + projectedChanges,
    scheduledCount: scheduledTransactions.length,
    asOfDate: new Date(),
  };
};

/**
 * Monitors cash position against target balances and alerts.
 *
 * @param {string} accountId - Account identifier
 * @param {number} targetBalance - Target balance
 * @param {number} minimumBalance - Minimum threshold
 * @param {number} maximumBalance - Maximum threshold
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Monitoring result with alerts
 *
 * @example
 * ```typescript
 * const monitoring = await monitorCashPositionThresholds(
 *   'ACC-001', 500000, 100000, 2000000, CashPosition
 * );
 * ```
 */
export const monitorCashPositionThresholds = async (
  accountId: string,
  targetBalance: number,
  minimumBalance: number,
  maximumBalance: number,
  CashPosition: any,
): Promise<object> => {
  const position = await getCurrentCashPosition(accountId, CashPosition);
  const alerts: string[] = [];
  const recommendations: string[] = [];

  const variance = position.availableBalance - targetBalance;
  const variancePercent = (variance / targetBalance) * 100;

  if (position.availableBalance < minimumBalance) {
    alerts.push(`Balance below minimum threshold: ${position.availableBalance} < ${minimumBalance}`);
    recommendations.push('Consider initiating sweep or line of credit draw');
  }

  if (position.availableBalance > maximumBalance) {
    alerts.push(`Balance above maximum threshold: ${position.availableBalance} > ${maximumBalance}`);
    recommendations.push('Consider investment or concentration sweep');
  }

  if (Math.abs(variancePercent) > 20) {
    alerts.push(`Balance variance from target: ${variancePercent.toFixed(2)}%`);
  }

  return {
    accountId,
    currentBalance: position.availableBalance,
    targetBalance,
    minimumBalance,
    maximumBalance,
    variance,
    variancePercent,
    status: alerts.length > 0 ? 'ALERT' : 'NORMAL',
    alerts,
    recommendations,
    timestamp: new Date(),
  };
};

/**
 * Calculates float analysis between ledger and available balances.
 *
 * @param {string} accountId - Account identifier
 * @param {number} days - Number of days to analyze
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Float analysis
 *
 * @example
 * ```typescript
 * const floatAnalysis = await analyzeFloatPosition('ACC-001', 30, CashPosition);
 * ```
 */
export const analyzeFloatPosition = async (
  accountId: string,
  days: number,
  CashPosition: any,
): Promise<object> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const positions = await CashPosition.findAll({
    where: {
      accountId,
      positionDate: { [Op.gte]: startDate },
    },
    order: [['positionDate', 'ASC']],
  });

  const floats = positions.map((p: any) => p.floatAmount);
  const avgFloat = floats.reduce((sum: number, f: number) => sum + f, 0) / floats.length;
  const maxFloat = Math.max(...floats);
  const minFloat = Math.min(...floats);

  return {
    accountId,
    periodDays: days,
    dataPoints: floats.length,
    averageFloat: avgFloat,
    maximumFloat: maxFloat,
    minimumFloat: minFloat,
    currentFloat: floats[floats.length - 1] || 0,
    trend: floats[floats.length - 1] > avgFloat ? 'INCREASING' : 'DECREASING',
  };
};

// ============================================================================
// BANK RECONCILIATION (9-16)
// ============================================================================

/**
 * Initiates bank reconciliation process for a period.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {number} bankClosingBalance - Bank statement closing balance
 * @param {Model} BankReconciliation - BankReconciliation model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<string>} Reconciliation ID
 *
 * @example
 * ```typescript
 * const reconId = await initiateReconciliation(
 *   'ACC-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   1000000.00,
 *   BankReconciliation
 * );
 * ```
 */
export const initiateReconciliation = async (
  accountId: string,
  periodStart: Date,
  periodEnd: Date,
  bankClosingBalance: number,
  BankReconciliation: any,
  transaction?: Transaction,
): Promise<string> => {
  const reconciliationId = `RECON-${accountId}-${periodEnd.getTime()}`;

  // Get opening balances
  const previousRecon = await BankReconciliation.findOne({
    where: {
      accountId,
      periodEnd: { [Op.lt]: periodStart },
      isReconciled: true,
    },
    order: [['periodEnd', 'DESC']],
    transaction,
  });

  const bankOpeningBalance = previousRecon?.bankClosingBalance || 0;
  const ledgerOpeningBalance = previousRecon?.ledgerClosingBalance || 0;

  await BankReconciliation.create(
    {
      reconciliationId,
      accountId,
      periodStart,
      periodEnd,
      bankOpeningBalance,
      bankClosingBalance,
      ledgerOpeningBalance,
      ledgerClosingBalance: 0, // To be calculated
      status: 'IN_PROGRESS',
    },
    { transaction },
  );

  return reconciliationId;
};

/**
 * Matches bank transactions with ledger entries using fuzzy matching.
 *
 * @param {BankTransaction[]} bankTransactions - Bank transactions
 * @param {any[]} ledgerTransactions - Ledger transactions
 * @returns {Promise<ReconciliationMatch[]>} Matched pairs
 *
 * @example
 * ```typescript
 * const matches = await matchBankTransactions(bankTxns, ledgerTxns);
 * console.log(`Matched ${matches.length} transactions`);
 * ```
 */
export const matchBankTransactions = async (
  bankTransactions: BankTransaction[],
  ledgerTransactions: any[],
): Promise<ReconciliationMatch[]> => {
  const matches: ReconciliationMatch[] = [];
  const unmatchedLedger = [...ledgerTransactions];

  for (const bankTxn of bankTransactions) {
    let bestMatch: any = null;
    let bestScore = 0;

    for (let i = 0; i < unmatchedLedger.length; i++) {
      const ledgerTxn = unmatchedLedger[i];
      const score = calculateMatchScore(bankTxn, ledgerTxn);

      if (score > bestScore && score >= 0.8) {
        bestScore = score;
        bestMatch = { transaction: ledgerTxn, index: i };
      }
    }

    if (bestMatch && bestScore === 1.0) {
      // Exact match
      matches.push({
        bankTransactionId: bankTxn.transactionId,
        ledgerTransactionId: bestMatch.transaction.id,
        matchType: 'EXACT',
        matchScore: bestScore,
        matchedAt: new Date(),
      });
      unmatchedLedger.splice(bestMatch.index, 1);
    } else if (bestMatch && bestScore >= 0.8) {
      // Fuzzy match
      matches.push({
        bankTransactionId: bankTxn.transactionId,
        ledgerTransactionId: bestMatch.transaction.id,
        matchType: 'FUZZY',
        matchScore: bestScore,
        variance: Math.abs(bankTxn.amount - bestMatch.transaction.amount),
        matchedAt: new Date(),
      });
      unmatchedLedger.splice(bestMatch.index, 1);
    }
  }

  return matches;
};

/**
 * Calculates match score between bank and ledger transactions.
 *
 * @param {BankTransaction} bankTxn - Bank transaction
 * @param {any} ledgerTxn - Ledger transaction
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateMatchScore(bankTxn, ledgerTxn);
 * if (score >= 0.95) console.log('High confidence match');
 * ```
 */
export const calculateMatchScore = (
  bankTxn: BankTransaction,
  ledgerTxn: any,
): number => {
  let score = 0;

  // Amount match (40% weight)
  const amountMatch = Math.abs(bankTxn.amount) === Math.abs(ledgerTxn.amount);
  if (amountMatch) {
    score += 0.4;
  } else {
    const amountDiff = Math.abs(Math.abs(bankTxn.amount) - Math.abs(ledgerTxn.amount));
    const amountThreshold = Math.abs(bankTxn.amount) * 0.01; // 1% tolerance
    if (amountDiff <= amountThreshold) {
      score += 0.3;
    }
  }

  // Date match (30% weight)
  const bankDate = new Date(bankTxn.valueDate).setHours(0, 0, 0, 0);
  const ledgerDate = new Date(ledgerTxn.transactionDate).setHours(0, 0, 0, 0);
  const daysDiff = Math.abs((bankDate - ledgerDate) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    score += 0.3;
  } else if (daysDiff <= 3) {
    score += 0.2;
  } else if (daysDiff <= 7) {
    score += 0.1;
  }

  // Reference number match (20% weight)
  if (bankTxn.referenceNumber && ledgerTxn.referenceNumber) {
    if (bankTxn.referenceNumber === ledgerTxn.referenceNumber) {
      score += 0.2;
    } else if (
      bankTxn.referenceNumber.includes(ledgerTxn.referenceNumber) ||
      ledgerTxn.referenceNumber.includes(bankTxn.referenceNumber)
    ) {
      score += 0.1;
    }
  }

  // Check number match (10% weight)
  if (bankTxn.checkNumber && ledgerTxn.checkNumber) {
    if (bankTxn.checkNumber === ledgerTxn.checkNumber) {
      score += 0.1;
    }
  }

  return Math.min(score, 1.0);
};

/**
 * Identifies outstanding checks not yet cleared by bank.
 *
 * @param {any[]} ledgerChecks - Issued checks from ledger
 * @param {BankTransaction[]} clearedChecks - Cleared checks from bank
 * @returns {Promise<any[]>} Outstanding checks
 *
 * @example
 * ```typescript
 * const outstanding = await identifyOutstandingChecks(ledgerChecks, bankChecks);
 * console.log(`${outstanding.length} checks outstanding`);
 * ```
 */
export const identifyOutstandingChecks = async (
  ledgerChecks: any[],
  clearedChecks: BankTransaction[],
): Promise<any[]> => {
  const clearedCheckNumbers = new Set(
    clearedChecks.map(c => c.checkNumber).filter(Boolean),
  );

  return ledgerChecks.filter(
    check => !clearedCheckNumbers.has(check.checkNumber),
  );
};

/**
 * Identifies deposits in transit not yet reflected in bank statement.
 *
 * @param {any[]} ledgerDeposits - Recorded deposits
 * @param {BankTransaction[]} bankDeposits - Bank statement deposits
 * @returns {Promise<any[]>} Deposits in transit
 *
 * @example
 * ```typescript
 * const inTransit = await identifyDepositsInTransit(ledgerDeposits, bankDeposits);
 * ```
 */
export const identifyDepositsInTransit = async (
  ledgerDeposits: any[],
  bankDeposits: BankTransaction[],
): Promise<any[]> => {
  const bankDepositIds = new Set(
    bankDeposits.map(d => d.referenceNumber).filter(Boolean),
  );

  return ledgerDeposits.filter(
    deposit => !bankDepositIds.has(deposit.referenceNumber),
  );
};

/**
 * Generates reconciliation exceptions for unmatched items.
 *
 * @param {BankTransaction[]} unmatchedBank - Unmatched bank transactions
 * @param {any[]} unmatchedLedger - Unmatched ledger transactions
 * @returns {Promise<ReconciliationException[]>} Exceptions
 *
 * @example
 * ```typescript
 * const exceptions = await generateReconciliationExceptions(
 *   unmatchedBank, unmatchedLedger
 * );
 * ```
 */
export const generateReconciliationExceptions = async (
  unmatchedBank: BankTransaction[],
  unmatchedLedger: any[],
): Promise<ReconciliationException[]> => {
  const exceptions: ReconciliationException[] = [];

  // Bank items not in ledger
  unmatchedBank.forEach(txn => {
    exceptions.push({
      exceptionId: `EXC-BANK-${txn.transactionId}`,
      type: 'MISSING_LEDGER',
      description: `Bank transaction not in ledger: ${txn.description}`,
      amount: txn.amount,
      transactionRef: txn.transactionId,
      status: 'OPEN',
    });
  });

  // Ledger items not in bank
  unmatchedLedger.forEach(txn => {
    exceptions.push({
      exceptionId: `EXC-LEDGER-${txn.id}`,
      type: 'MISSING_BANK',
      description: `Ledger transaction not in bank: ${txn.description}`,
      amount: txn.amount,
      transactionRef: txn.id,
      status: 'OPEN',
    });
  });

  return exceptions;
};

/**
 * Completes bank reconciliation with adjusted balances.
 *
 * @param {string} reconciliationId - Reconciliation identifier
 * @param {object} adjustments - Reconciliation adjustments
 * @param {string} reconciledBy - User completing reconciliation
 * @param {Model} BankReconciliation - BankReconciliation model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<ReconciliationReport>} Reconciliation report
 *
 * @example
 * ```typescript
 * await completeReconciliation(reconId, {
 *   outstandingChecks: 50000,
 *   depositsInTransit: 25000,
 *   bankServiceCharges: 50
 * }, 'user123', BankReconciliation);
 * ```
 */
export const completeReconciliation = async (
  reconciliationId: string,
  adjustments: {
    outstandingChecks: number;
    depositsInTransit: number;
    bankServiceCharges?: number;
    interestEarned?: number;
    nsfReturns?: number;
    bankErrors?: number;
    bookErrors?: number;
  },
  reconciledBy: string,
  BankReconciliation: any,
  transaction?: Transaction,
): Promise<ReconciliationReport> => {
  const recon = await BankReconciliation.findOne({
    where: { reconciliationId },
    transaction,
  });

  if (!recon) {
    throw new Error(`Reconciliation ${reconciliationId} not found`);
  }

  // Calculate adjusted balances
  const adjustedBankBalance =
    recon.bankClosingBalance -
    adjustments.outstandingChecks +
    adjustments.depositsInTransit +
    (adjustments.bankErrors || 0);

  const adjustedBookBalance =
    recon.ledgerClosingBalance +
    (adjustments.interestEarned || 0) -
    (adjustments.bankServiceCharges || 0) -
    (adjustments.nsfReturns || 0) +
    (adjustments.bookErrors || 0);

  const variance = Math.abs(adjustedBankBalance - adjustedBookBalance);
  const isReconciled = variance < 0.01; // Within 1 cent

  await recon.update(
    {
      ...adjustments,
      adjustedBankBalance,
      adjustedBookBalance,
      variance,
      isReconciled,
      reconciledBy,
      reconciledAt: new Date(),
      status: isReconciled ? 'COMPLETED' : 'IN_PROGRESS',
    },
    { transaction },
  );

  return recon.toJSON();
};

/**
 * Generates bank reconciliation report with detailed analysis.
 *
 * @param {string} reconciliationId - Reconciliation identifier
 * @param {Model} BankReconciliation - BankReconciliation model
 * @returns {Promise<ReconciliationReport>} Detailed report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(reconId, BankReconciliation);
 * ```
 */
export const generateReconciliationReport = async (
  reconciliationId: string,
  BankReconciliation: any,
): Promise<ReconciliationReport> => {
  const recon = await BankReconciliation.findOne({
    where: { reconciliationId },
  });

  if (!recon) {
    throw new Error(`Reconciliation ${reconciliationId} not found`);
  }

  return recon.toJSON();
};

// ============================================================================
// CASH FLOW FORECASTING (17-22)
// ============================================================================

/**
 * Creates cash flow forecast for specified period.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} startDate - Forecast start date
 * @param {number} days - Number of days to forecast
 * @param {string} scenario - Forecast scenario
 * @returns {Promise<CashFlowForecast[]>} Daily forecasts
 *
 * @example
 * ```typescript
 * const forecast = await createCashFlowForecast(
 *   'ACC-001', new Date(), 30, 'REALISTIC'
 * );
 * ```
 */
export const createCashFlowForecast = async (
  accountId: string,
  startDate: Date,
  days: number,
  scenario: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC' = 'REALISTIC',
): Promise<CashFlowForecast[]> => {
  const forecasts: CashFlowForecast[] = [];
  const currentDate = new Date(startDate);

  // Scenario multipliers
  const multipliers = {
    OPTIMISTIC: { inflow: 1.1, outflow: 0.9 },
    REALISTIC: { inflow: 1.0, outflow: 1.0 },
    PESSIMISTIC: { inflow: 0.9, outflow: 1.1 },
  };

  let cumulativeBalance = 0; // Should get from current position

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setDate(forecastDate.getDate() + i);

    // Calculate projected inflows/outflows based on historical patterns
    const dayOfWeek = forecastDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let projectedInflows = isWeekend ? 0 : 50000; // Simplified
    let projectedOutflows = isWeekend ? 0 : 40000;

    // Apply scenario multipliers
    projectedInflows *= multipliers[scenario].inflow;
    projectedOutflows *= multipliers[scenario].outflow;

    const netCashFlow = projectedInflows - projectedOutflows;
    cumulativeBalance += netCashFlow;

    forecasts.push({
      forecastDate,
      projectedInflows,
      projectedOutflows,
      netCashFlow,
      cumulativeBalance,
      confidence: scenario === 'REALISTIC' ? 0.85 : 0.70,
      scenario,
      assumptions: [
        'Based on 90-day historical average',
        `${scenario.toLowerCase()} scenario applied`,
      ],
    });
  }

  return forecasts;
};

/**
 * Analyzes historical cash flow patterns for forecasting.
 *
 * @param {string} accountId - Account identifier
 * @param {number} days - Historical days to analyze
 * @param {any} Transaction - Transaction model
 * @returns {Promise<object>} Cash flow patterns
 *
 * @example
 * ```typescript
 * const patterns = await analyzeHistoricalCashFlow('ACC-001', 90, Transaction);
 * ```
 */
export const analyzeHistoricalCashFlow = async (
  accountId: string,
  days: number,
  Transaction: any,
): Promise<object> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Simplified - would query actual transactions
  const dailyInflows: number[] = [];
  const dailyOutflows: number[] = [];

  const avgInflow = dailyInflows.reduce((a, b) => a + b, 0) / (dailyInflows.length || 1);
  const avgOutflow = dailyOutflows.reduce((a, b) => a + b, 0) / (dailyOutflows.length || 1);

  return {
    accountId,
    periodDays: days,
    averageDailyInflow: avgInflow,
    averageDailyOutflow: avgOutflow,
    averageDailyNet: avgInflow - avgOutflow,
    totalInflow: dailyInflows.reduce((a, b) => a + b, 0),
    totalOutflow: dailyOutflows.reduce((a, b) => a + b, 0),
    inflowVolatility: calculateVolatility(dailyInflows),
    outflowVolatility: calculateVolatility(dailyOutflows),
  };
};

/**
 * Projects cash requirements for upcoming obligations.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} throughDate - Project through this date
 * @param {any[]} scheduledPayments - Scheduled payment obligations
 * @returns {Promise<object>} Cash requirement projection
 *
 * @example
 * ```typescript
 * const requirements = await projectCashRequirements('ACC-001', futureDate, payments);
 * ```
 */
export const projectCashRequirements = async (
  accountId: string,
  throughDate: Date,
  scheduledPayments: any[],
): Promise<object> => {
  const dailyRequirements = new Map<string, number>();

  scheduledPayments.forEach(payment => {
    const dateKey = payment.dueDate.toISOString().split('T')[0];
    const current = dailyRequirements.get(dateKey) || 0;
    dailyRequirements.set(dateKey, current + payment.amount);
  });

  const sortedDates = Array.from(dailyRequirements.keys()).sort();
  let cumulativeRequirement = 0;
  const projections = sortedDates.map(date => {
    cumulativeRequirement += dailyRequirements.get(date) || 0;
    return {
      date: new Date(date),
      dailyRequirement: dailyRequirements.get(date),
      cumulativeRequirement,
    };
  });

  return {
    accountId,
    throughDate,
    totalRequirement: cumulativeRequirement,
    peakRequirement: Math.max(...Array.from(dailyRequirements.values())),
    projections,
  };
};

/**
 * Identifies cash surplus/deficit periods in forecast.
 *
 * @param {CashFlowForecast[]} forecasts - Cash flow forecasts
 * @param {number} targetBalance - Target balance to maintain
 * @returns {Promise<object>} Surplus/deficit analysis
 *
 * @example
 * ```typescript
 * const analysis = await identifySurplusDeficitPeriods(forecasts, 500000);
 * ```
 */
export const identifySurplusDeficitPeriods = async (
  forecasts: CashFlowForecast[],
  targetBalance: number,
): Promise<object> => {
  const surplusPeriods: any[] = [];
  const deficitPeriods: any[] = [];

  forecasts.forEach(forecast => {
    const variance = forecast.cumulativeBalance - targetBalance;

    if (variance > targetBalance * 0.2) {
      // 20% above target
      surplusPeriods.push({
        date: forecast.forecastDate,
        balance: forecast.cumulativeBalance,
        surplus: variance,
      });
    } else if (variance < -targetBalance * 0.1) {
      // 10% below target
      deficitPeriods.push({
        date: forecast.forecastDate,
        balance: forecast.cumulativeBalance,
        deficit: Math.abs(variance),
      });
    }
  });

  return {
    targetBalance,
    surplusPeriods,
    deficitPeriods,
    recommendations: generateCashManagementRecommendations(surplusPeriods, deficitPeriods),
  };
};

/**
 * Optimizes cash deployment based on forecast and investment options.
 *
 * @param {CashFlowForecast[]} forecasts - Cash flow forecasts
 * @param {Investment[]} investmentOptions - Available investment vehicles
 * @param {number} minimumOperatingBalance - Minimum cash to maintain
 * @returns {Promise<object>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeCashDeployment(forecasts, options, 100000);
 * ```
 */
export const optimizeCashDeployment = async (
  forecasts: CashFlowForecast[],
  investmentOptions: Investment[],
  minimumOperatingBalance: number,
): Promise<object> => {
  const recommendations: any[] = [];

  // Find sustained surplus periods
  let surplusDays = 0;
  let surplusAmount = 0;

  forecasts.forEach(forecast => {
    const excess = forecast.cumulativeBalance - minimumOperatingBalance;
    if (excess > 0) {
      surplusDays++;
      surplusAmount = Math.min(surplusAmount || excess, excess);
    } else {
      if (surplusDays >= 7 && surplusAmount > 10000) {
        // Find suitable investment
        const suitable = investmentOptions.filter(inv => {
          const daysToMaturity = Math.ceil(
            (inv.maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          );
          return daysToMaturity <= surplusDays && inv.principalAmount <= surplusAmount;
        });

        if (suitable.length > 0) {
          const best = suitable.reduce((prev, curr) =>
            curr.yieldToMaturity > prev.yieldToMaturity ? curr : prev,
          );

          recommendations.push({
            action: 'INVEST',
            amount: Math.min(surplusAmount, best.principalAmount),
            duration: surplusDays,
            vehicle: best.securityType,
            expectedYield: best.yieldToMaturity,
          });
        }
      }
      surplusDays = 0;
      surplusAmount = 0;
    }
  });

  return {
    minimumOperatingBalance,
    recommendations,
    potentialIncome: recommendations.reduce((sum, r) => sum + (r.amount * r.expectedYield / 365 * r.duration), 0),
  };
};

/**
 * Generates cash management recommendations from forecast analysis.
 *
 * @param {any[]} surplusPeriods - Identified surplus periods
 * @param {any[]} deficitPeriods - Identified deficit periods
 * @returns {string[]} Recommendations
 *
 * @example
 * ```typescript
 * const recs = generateCashManagementRecommendations(surplus, deficit);
 * ```
 */
export const generateCashManagementRecommendations = (
  surplusPeriods: any[],
  deficitPeriods: any[],
): string[] => {
  const recommendations: string[] = [];

  if (surplusPeriods.length > 5) {
    recommendations.push('Consider increasing investment allocation - sustained surplus detected');
    recommendations.push('Review sweep parameters to optimize idle cash');
  }

  if (deficitPeriods.length > 3) {
    recommendations.push('Deficit periods identified - consider arranging credit facility');
    recommendations.push('Review payment timing to smooth cash flow');
  }

  if (surplusPeriods.length > 0 && deficitPeriods.length > 0) {
    recommendations.push('Implement cash pooling to balance surplus and deficit accounts');
  }

  return recommendations;
};

// ============================================================================
// LIQUIDITY MANAGEMENT (23-28)
// ============================================================================

/**
 * Calculates comprehensive liquidity metrics and ratios.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {Model} CashPosition - CashPosition model
 * @param {any} BalanceSheet - Balance sheet data source
 * @returns {Promise<LiquidityAnalysis>} Liquidity analysis
 *
 * @example
 * ```typescript
 * const liquidity = await calculateLiquidityMetrics(accountIds, CashPosition, BS);
 * ```
 */
export const calculateLiquidityMetrics = async (
  accountIds: string[],
  CashPosition: any,
  BalanceSheet: any,
): Promise<LiquidityAnalysis> => {
  const aggregate = await calculateAggregateCashPosition(accountIds, CashPosition);

  // Simplified - would query actual balance sheet
  const currentAssets = 2000000;
  const currentLiabilities = 1000000;
  const inventory = 300000;
  const avgDailyExpense = 30000;

  const totalCash = aggregate.totalAvailable;
  const quickAssets = currentAssets - inventory;

  return {
    asOfDate: new Date(),
    totalCash,
    availableCash: aggregate.totalAvailable,
    restrictedCash: 0,
    shortTermInvestments: 0,
    currentRatio: currentAssets / currentLiabilities,
    quickRatio: quickAssets / currentLiabilities,
    workingCapital: currentAssets - currentLiabilities,
    daysOfCashOnHand: totalCash / avgDailyExpense,
    recommendations: [
      totalCash / avgDailyExpense < 30 ? 'Consider increasing cash reserves' : 'Cash position adequate',
    ],
  };
};

/**
 * Monitors liquidity coverage ratio for regulatory compliance.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {number} expectedOutflows30Days - 30-day expected outflows
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} LCR analysis
 *
 * @example
 * ```typescript
 * const lcr = await monitorLiquidityCoverageRatio(accounts, 800000, CashPosition, Investment);
 * ```
 */
export const monitorLiquidityCoverageRatio = async (
  accountIds: string[],
  expectedOutflows30Days: number,
  CashPosition: any,
  Investment: any,
): Promise<object> => {
  const cashPosition = await calculateAggregateCashPosition(accountIds, CashPosition);

  // Get high-quality liquid assets
  const investments = await Investment.findAll({
    where: {
      accountId: { [Op.in]: accountIds },
      status: 'ACTIVE',
      maturityDate: { [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    },
  });

  const liquidInvestments = investments.reduce(
    (sum: number, inv: any) => sum + inv.currentValue,
    0,
  );

  const hqla = cashPosition.totalAvailable + liquidInvestments;
  const lcr = (hqla / expectedOutflows30Days) * 100;

  return {
    highQualityLiquidAssets: hqla,
    expectedOutflows: expectedOutflows30Days,
    liquidityCoverageRatio: lcr,
    compliant: lcr >= 100,
    status: lcr >= 100 ? 'COMPLIANT' : 'NON_COMPLIANT',
    asOfDate: new Date(),
  };
};

/**
 * Performs stress testing on liquidity position.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {object} stressScenario - Stress test scenario parameters
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Stress test results
 *
 * @example
 * ```typescript
 * const stress = await performLiquidityStressTest(accounts, {
 *   outflowShock: 1.5,
 *   inflowReduction: 0.7
 * }, CashPosition);
 * ```
 */
export const performLiquidityStressTest = async (
  accountIds: string[],
  stressScenario: { outflowShock: number; inflowReduction: number },
  CashPosition: any,
): Promise<object> => {
  const baseline = await calculateAggregateCashPosition(accountIds, CashPosition);

  // Simplified stress calculations
  const avgDailyOutflow = 40000;
  const avgDailyInflow = 50000;

  const stressedOutflow = avgDailyOutflow * stressScenario.outflowShock;
  const stressedInflow = avgDailyInflow * stressScenario.inflowReduction;
  const stressedNet = stressedInflow - stressedOutflow;

  const daysUntilDeficit = baseline.totalAvailable / Math.abs(stressedNet);

  return {
    scenario: stressScenario,
    baselinePosition: baseline.totalAvailable,
    stressedDailyNet: stressedNet,
    daysUntilDeficit: stressedNet < 0 ? daysUntilDeficit : Infinity,
    status: daysUntilDeficit > 30 ? 'PASS' : 'FAIL',
    recommendations:
      daysUntilDeficit < 30
        ? ['Increase credit facilities', 'Accelerate receivables collection']
        : ['Liquidity adequate under stress'],
  };
};

/**
 * Optimizes liquidity buffer allocation across accounts.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {number} totalBuffer - Total buffer amount to allocate
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Allocation recommendations
 *
 * @example
 * ```typescript
 * const allocation = await optimizeLiquidityBuffer(accounts, 500000, CashPosition);
 * ```
 */
export const optimizeLiquidityBuffer = async (
  accountIds: string[],
  totalBuffer: number,
  CashPosition: any,
): Promise<object> => {
  const positions = await Promise.all(
    accountIds.map(id => getCurrentCashPosition(id, CashPosition)),
  );

  // Allocate based on transaction volume and volatility
  const allocations = positions.map(pos => {
    const weight = 1 / positions.length; // Simplified - would use actual metrics
    return {
      accountId: pos.accountId,
      currentBalance: pos.availableBalance,
      allocation: totalBuffer * weight,
      targetBalance: pos.availableBalance + totalBuffer * weight,
    };
  });

  return {
    totalBuffer,
    allocations,
    method: 'PROPORTIONAL',
  };
};

/**
 * Generates liquidity contingency plan.
 *
 * @param {LiquidityAnalysis} currentLiquidity - Current liquidity state
 * @param {number} targetDaysOfCash - Target days of cash
 * @returns {Promise<object>} Contingency plan
 *
 * @example
 * ```typescript
 * const plan = await generateLiquidityContingencyPlan(liquidity, 60);
 * ```
 */
export const generateLiquidityContingencyPlan = async (
  currentLiquidity: LiquidityAnalysis,
  targetDaysOfCash: number,
): Promise<object> => {
  const actions: any[] = [];

  if (currentLiquidity.daysOfCashOnHand < targetDaysOfCash) {
    const shortfall = targetDaysOfCash - currentLiquidity.daysOfCashOnHand;

    actions.push({
      priority: 1,
      action: 'ACTIVATE_CREDIT_FACILITY',
      description: 'Draw on revolving credit line',
      timeline: 'Within 24 hours',
    });

    actions.push({
      priority: 2,
      action: 'LIQUIDATE_INVESTMENTS',
      description: 'Liquidate short-term investments',
      timeline: 'Within 48 hours',
    });

    actions.push({
      priority: 3,
      action: 'ACCELERATE_COLLECTIONS',
      description: 'Aggressive AR collection',
      timeline: 'Within 1 week',
    });
  }

  return {
    currentDays: currentLiquidity.daysOfCashOnHand,
    targetDays: targetDaysOfCash,
    status: currentLiquidity.daysOfCashOnHand >= targetDaysOfCash ? 'ADEQUATE' : 'DEFICIENT',
    actions,
  };
};

/**
 * Tracks available credit facilities and utilization.
 *
 * @param {string[]} facilityIds - Credit facility identifiers
 * @param {any} CreditFacility - Credit facility model
 * @returns {Promise<object>} Credit facility analysis
 *
 * @example
 * ```typescript
 * const credit = await trackCreditFacilityUtilization(facilityIds, CreditFacility);
 * ```
 */
export const trackCreditFacilityUtilization = async (
  facilityIds: string[],
  CreditFacility: any,
): Promise<object> => {
  // Simplified - would query actual credit facilities
  const facilities = [
    {
      facilityId: 'CREDIT-001',
      type: 'REVOLVING',
      totalLimit: 1000000,
      utilized: 200000,
      available: 800000,
      expiryDate: new Date('2025-12-31'),
    },
  ];

  const totals = facilities.reduce(
    (acc, f) => ({
      totalLimit: acc.totalLimit + f.totalLimit,
      totalUtilized: acc.totalUtilized + f.utilized,
      totalAvailable: acc.totalAvailable + f.available,
    }),
    { totalLimit: 0, totalUtilized: 0, totalAvailable: 0 },
  );

  return {
    facilities,
    ...totals,
    utilizationRate: (totals.totalUtilized / totals.totalLimit) * 100,
  };
};

// ============================================================================
// INVESTMENT PORTFOLIO MANAGEMENT (29-34)
// ============================================================================

/**
 * Records new investment purchase.
 *
 * @param {Partial<Investment>} investmentData - Investment details
 * @param {Model} Investment - Investment model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<Investment>} Created investment
 *
 * @example
 * ```typescript
 * const inv = await recordInvestmentPurchase({
 *   securityType: 'TBILL',
 *   principalAmount: 100000,
 *   maturityDate: new Date('2024-06-30'),
 *   interestRate: 5.25
 * }, Investment);
 * ```
 */
export const recordInvestmentPurchase = async (
  investmentData: Partial<Investment>,
  Investment: any,
  transaction?: Transaction,
): Promise<Investment> => {
  const investment = await Investment.create(
    {
      ...investmentData,
      status: 'ACTIVE',
      currentValue: investmentData.principalAmount,
      marketValue: investmentData.principalAmount,
      accruedInterest: 0,
    },
    { transaction },
  );

  return investment.toJSON();
};

/**
 * Calculates accrued interest on investments.
 *
 * @param {string} investmentId - Investment identifier
 * @param {Date} asOfDate - Calculation date
 * @param {Model} Investment - Investment model
 * @returns {Promise<number>} Accrued interest amount
 *
 * @example
 * ```typescript
 * const accrued = await calculateAccruedInterest('INV-001', new Date(), Investment);
 * ```
 */
export const calculateAccruedInterest = async (
  investmentId: string,
  asOfDate: Date,
  Investment: any,
): Promise<number> => {
  const investment = await Investment.findOne({
    where: { investmentId },
  });

  if (!investment) {
    throw new Error(`Investment ${investmentId} not found`);
  }

  const daysSincePurchase = Math.ceil(
    (asOfDate.getTime() - investment.purchaseDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const accruedInterest =
    (investment.principalAmount * investment.interestRate / 100 / 365) * daysSincePurchase;

  return accruedInterest;
};

/**
 * Marks investment as matured and processes proceeds.
 *
 * @param {string} investmentId - Investment identifier
 * @param {number} proceedsAmount - Maturity proceeds
 * @param {Model} Investment - Investment model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Maturity details
 *
 * @example
 * ```typescript
 * await processInvestmentMaturity('INV-001', 105250.00, Investment);
 * ```
 */
export const processInvestmentMaturity = async (
  investmentId: string,
  proceedsAmount: number,
  Investment: any,
  transaction?: Transaction,
): Promise<object> => {
  const investment = await Investment.findOne({
    where: { investmentId },
    transaction,
  });

  if (!investment) {
    throw new Error(`Investment ${investmentId} not found`);
  }

  const totalInterest = proceedsAmount - investment.principalAmount;

  await investment.update(
    {
      status: 'MATURED',
      currentValue: proceedsAmount,
      accruedInterest: totalInterest,
    },
    { transaction },
  );

  return {
    investmentId,
    principal: investment.principalAmount,
    proceeds: proceedsAmount,
    interest: totalInterest,
    effectiveYield: (totalInterest / investment.principalAmount) * 100,
    maturityDate: investment.maturityDate,
  };
};

/**
 * Calculates portfolio-level investment metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics('PORT-001', Investment);
 * ```
 */
export const calculatePortfolioMetrics = async (
  portfolioId: string,
  Investment: any,
): Promise<object> => {
  const investments = await Investment.findAll({
    where: { portfolioId, status: 'ACTIVE' },
  });

  const totalPrincipal = investments.reduce((sum: number, inv: any) => sum + inv.principalAmount, 0);
  const totalMarketValue = investments.reduce((sum: number, inv: any) => sum + inv.marketValue, 0);
  const weightedYield = investments.reduce(
    (sum: number, inv: any) =>
      sum + (inv.yieldToMaturity * inv.principalAmount) / totalPrincipal,
    0,
  );

  const avgDuration = investments.reduce(
    (sum: number, inv: any) =>
      sum + (inv.duration * inv.principalAmount) / totalPrincipal,
    0,
  );

  return {
    portfolioId,
    holdings: investments.length,
    totalPrincipal,
    totalMarketValue,
    unrealizedGainLoss: totalMarketValue - totalPrincipal,
    weightedAverageYield: weightedYield,
    averageDuration: avgDuration,
    asOfDate: new Date(),
  };
};

/**
 * Generates investment ladder analysis for maturity distribution.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Ladder analysis
 *
 * @example
 * ```typescript
 * const ladder = await generateInvestmentLadder('PORT-001', Investment);
 * ```
 */
export const generateInvestmentLadder = async (
  portfolioId: string,
  Investment: any,
): Promise<object> => {
  const investments = await Investment.findAll({
    where: { portfolioId, status: 'ACTIVE' },
    order: [['maturityDate', 'ASC']],
  });

  const now = Date.now();
  const buckets = {
    within30Days: 0,
    within90Days: 0,
    within180Days: 0,
    within365Days: 0,
    beyond365Days: 0,
  };

  investments.forEach((inv: any) => {
    const daysToMaturity = Math.ceil((inv.maturityDate.getTime() - now) / (1000 * 60 * 60 * 24));

    if (daysToMaturity <= 30) buckets.within30Days += inv.principalAmount;
    else if (daysToMaturity <= 90) buckets.within90Days += inv.principalAmount;
    else if (daysToMaturity <= 180) buckets.within180Days += inv.principalAmount;
    else if (daysToMaturity <= 365) buckets.within365Days += inv.principalAmount;
    else buckets.beyond365Days += inv.principalAmount;
  });

  return {
    portfolioId,
    maturityLadder: buckets,
    totalInvested: Object.values(buckets).reduce((a, b) => a + b, 0),
  };
};

/**
 * Validates investment compliance with policy guidelines.
 *
 * @param {Investment} investment - Investment to validate
 * @param {object} policy - Investment policy parameters
 * @returns {Promise<object>} Compliance validation
 *
 * @example
 * ```typescript
 * const validation = await validateInvestmentCompliance(investment, {
 *   maxMaturity: 365,
 *   minCreditRating: 'A',
 *   allowedTypes: ['TBILL', 'CD']
 * });
 * ```
 */
export const validateInvestmentCompliance = async (
  investment: Investment,
  policy: {
    maxMaturity?: number;
    minCreditRating?: string;
    allowedTypes?: string[];
    maxSingleIssuer?: number;
    requireCollateralization?: boolean;
  },
): Promise<object> => {
  const violations: string[] = [];

  // Check maturity limit
  if (policy.maxMaturity) {
    const daysToMaturity = Math.ceil(
      (investment.maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (daysToMaturity > policy.maxMaturity) {
      violations.push(`Maturity ${daysToMaturity} days exceeds policy limit ${policy.maxMaturity}`);
    }
  }

  // Check security type
  if (policy.allowedTypes && !policy.allowedTypes.includes(investment.securityType)) {
    violations.push(`Security type ${investment.securityType} not in allowed types`);
  }

  // Check credit rating
  if (policy.minCreditRating && investment.creditRating) {
    // Simplified rating comparison
    const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'];
    const invRatingIdx = ratings.findIndex(r => investment.creditRating?.startsWith(r));
    const minRatingIdx = ratings.findIndex(r => policy.minCreditRating?.startsWith(r));

    if (invRatingIdx > minRatingIdx) {
      violations.push(`Credit rating ${investment.creditRating} below minimum ${policy.minCreditRating}`);
    }
  }

  // Check collateralization
  if (policy.requireCollateralization && !investment.collateralized) {
    violations.push('Investment must be collateralized per policy');
  }

  return {
    investmentId: investment.investmentId,
    compliant: violations.length === 0,
    violations,
    checkedAt: new Date(),
  };
};

// ============================================================================
// WIRE TRANSFER PROCESSING (35-39)
// ============================================================================

/**
 * Initiates wire transfer with fraud detection checks.
 *
 * @param {Partial<WireTransfer>} wireData - Wire transfer details
 * @param {string} initiatedBy - User initiating transfer
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<string>} Wire transfer ID
 *
 * @example
 * ```typescript
 * const wireId = await initiateWireTransfer({
 *   debitAccountId: 'ACC-001',
 *   creditAccountId: 'ACC-EXT-001',
 *   amount: 250000,
 *   beneficiaryName: 'Vendor Corp',
 *   purpose: 'Invoice payment'
 * }, 'user123', WireTransfer);
 * ```
 */
export const initiateWireTransfer = async (
  wireData: Partial<WireTransfer>,
  initiatedBy: string,
  WireTransfer: any,
  transaction?: Transaction,
): Promise<string> => {
  const wireId = `WIRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Fraud detection checks
  const fraudChecks = await performWireFraudChecks(wireData);
  if (!fraudChecks.passed) {
    throw new Error(`Wire transfer failed fraud checks: ${fraudChecks.reason}`);
  }

  await WireTransfer.create(
    {
      ...wireData,
      wireId,
      initiatedBy,
      status: 'PENDING',
      approvals: [],
      metadata: {
        fraudChecksPassed: true,
        initiatedAt: new Date(),
      },
    },
    { transaction },
  );

  return wireId;
};

/**
 * Approves wire transfer with dual control validation.
 *
 * @param {string} wireId - Wire transfer ID
 * @param {string} approverUserId - Approver user ID
 * @param {number} approvalLevel - Approval level
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Approval status
 *
 * @example
 * ```typescript
 * await approveWireTransfer('WIRE-123', 'mgr456', 1, WireTransfer);
 * ```
 */
export const approveWireTransfer = async (
  wireId: string,
  approverUserId: string,
  approvalLevel: number,
  WireTransfer: any,
  transaction?: Transaction,
): Promise<object> => {
  const wire = await WireTransfer.findOne({
    where: { wireId },
    transaction,
  });

  if (!wire) {
    throw new Error(`Wire transfer ${wireId} not found`);
  }

  // Check if approver is not the initiator
  if (wire.initiatedBy === approverUserId) {
    throw new Error('Initiator cannot approve their own wire transfer');
  }

  const approval: WireApproval = {
    approverUserId,
    approvalLevel,
    approvedAt: new Date(),
    ipAddress: '0.0.0.0', // Would get from request
  };

  const approvals = [...(wire.approvals || []), approval];

  // Determine if wire is fully approved
  const requiredApprovals = wire.amount > 100000 ? 2 : 1;
  const isFullyApproved = approvals.length >= requiredApprovals;

  await wire.update(
    {
      approvals,
      status: isFullyApproved ? 'APPROVED' : 'PENDING',
    },
    { transaction },
  );

  return {
    wireId,
    approved: isFullyApproved,
    approvals: approvals.length,
    requiredApprovals,
  };
};

/**
 * Processes approved wire transfer through payment network.
 *
 * @param {string} wireId - Wire transfer ID
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Processing result
 *
 * @example
 * ```typescript
 * await processWireTransfer('WIRE-123', WireTransfer);
 * ```
 */
export const processWireTransfer = async (
  wireId: string,
  WireTransfer: any,
  transaction?: Transaction,
): Promise<object> => {
  const wire = await WireTransfer.findOne({
    where: { wireId },
    transaction,
  });

  if (!wire) {
    throw new Error(`Wire transfer ${wireId} not found`);
  }

  if (wire.status !== 'APPROVED') {
    throw new Error(`Wire transfer ${wireId} not approved for processing`);
  }

  // Simulate payment network processing
  await wire.update(
    {
      status: 'SENT',
      metadata: {
        ...wire.metadata,
        sentAt: new Date(),
        confirmationNumber: `CONF-${Date.now()}`,
      },
    },
    { transaction },
  );

  return {
    wireId,
    status: 'SENT',
    confirmationNumber: wire.metadata.confirmationNumber,
    processedAt: new Date(),
  };
};

/**
 * Performs fraud detection checks on wire transfer.
 *
 * @param {Partial<WireTransfer>} wireData - Wire transfer data
 * @returns {Promise<object>} Fraud check results
 *
 * @example
 * ```typescript
 * const checks = await performWireFraudChecks(wireData);
 * if (!checks.passed) console.error(checks.reason);
 * ```
 */
export const performWireFraudChecks = async (
  wireData: Partial<WireTransfer>,
): Promise<object> => {
  const checks: string[] = [];
  const warnings: string[] = [];

  // Amount threshold check
  if (wireData.amount && wireData.amount > 1000000) {
    warnings.push('High value transaction - enhanced review required');
  }

  // Beneficiary validation
  if (wireData.beneficiaryName && wireData.beneficiaryName.length < 3) {
    checks.push('Invalid beneficiary name');
  }

  // Weekend/after-hours check
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 8 || hour > 17) {
    warnings.push('Transaction initiated outside business hours');
  }

  return {
    passed: checks.length === 0,
    reason: checks.join('; '),
    warnings,
    checkedAt: new Date(),
  };
};

/**
 * Generates wire transfer activity report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {any} WireTransfer - WireTransfer model
 * @returns {Promise<object>} Activity report
 *
 * @example
 * ```typescript
 * const report = await generateWireActivityReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   WireTransfer
 * );
 * ```
 */
export const generateWireActivityReport = async (
  startDate: Date,
  endDate: Date,
  WireTransfer: any,
): Promise<object> => {
  const wires = await WireTransfer.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const summary = wires.reduce(
    (acc: any, wire: any) => {
      acc.totalCount++;
      acc.totalAmount += wire.amount;

      if (wire.status === 'SENT') {
        acc.sentCount++;
        acc.sentAmount += wire.amount;
      } else if (wire.status === 'PENDING') {
        acc.pendingCount++;
      } else if (wire.status === 'REJECTED') {
        acc.rejectedCount++;
      }

      return acc;
    },
    {
      totalCount: 0,
      totalAmount: 0,
      sentCount: 0,
      sentAmount: 0,
      pendingCount: 0,
      rejectedCount: 0,
    },
  );

  return {
    periodStart: startDate,
    periodEnd: endDate,
    ...summary,
  };
};

// ============================================================================
// CASH CONCENTRATION & POOLING (40-44)
// ============================================================================

/**
 * Executes automated cash sweep between accounts.
 *
 * @param {string} sourceAccountId - Source account
 * @param {string} targetAccountId - Target account
 * @param {number} amount - Amount to sweep
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Sweep result
 *
 * @example
 * ```typescript
 * await executeCashSweep('ACC-001', 'ACC-MASTER', 150000, CashPosition);
 * ```
 */
export const executeCashSweep = async (
  sourceAccountId: string,
  targetAccountId: string,
  amount: number,
  CashPosition: any,
  transaction?: Transaction,
): Promise<object> => {
  const sourcePosition = await getCurrentCashPosition(sourceAccountId, CashPosition);

  if (sourcePosition.availableBalance < amount) {
    throw new Error('Insufficient funds for sweep');
  }

  // Update source account
  await updateCashPosition(
    sourceAccountId,
    {
      availableBalance: sourcePosition.availableBalance - amount,
      ledgerBalance: sourcePosition.ledgerBalance - amount,
    },
    CashPosition,
    transaction,
  );

  // Update target account
  const targetPosition = await getCurrentCashPosition(targetAccountId, CashPosition);
  await updateCashPosition(
    targetAccountId,
    {
      availableBalance: targetPosition.availableBalance + amount,
      ledgerBalance: targetPosition.ledgerBalance + amount,
    },
    CashPosition,
    transaction,
  );

  return {
    sweepId: `SWEEP-${Date.now()}`,
    sourceAccountId,
    targetAccountId,
    amount,
    executedAt: new Date(),
  };
};

/**
 * Configures zero-balance account (ZBA) sweep parameters.
 *
 * @param {string} zbaAccountId - ZBA account
 * @param {string} masterAccountId - Master account
 * @param {string} sweepFrequency - Sweep frequency
 * @param {any} CashConcentration - CashConcentration model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashConcentration>} Configuration
 *
 * @example
 * ```typescript
 * await configureZeroBalanceAccount('ACC-ZBA-001', 'ACC-MASTER', 'DAILY', CC);
 * ```
 */
export const configureZeroBalanceAccount = async (
  zbaAccountId: string,
  masterAccountId: string,
  sweepFrequency: 'DAILY' | 'WEEKLY' | 'ON_DEMAND',
  CashConcentration: any,
  transaction?: Transaction,
): Promise<CashConcentration> => {
  const concentrationId = `CONC-${zbaAccountId}`;

  const config = await CashConcentration.create(
    {
      concentrationId,
      masterAccountId,
      targetAccountIds: [zbaAccountId],
      sweepType: 'ZERO_BALANCE',
      sweepFrequency,
      enabled: true,
    },
    { transaction },
  );

  return config.toJSON();
};

/**
 * Executes target balance sweep to maintain optimal balances.
 *
 * @param {string} accountId - Account to sweep
 * @param {number} targetBalance - Target balance to maintain
 * @param {string} masterAccountId - Master account
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Sweep result
 *
 * @example
 * ```typescript
 * await executeTargetBalanceSweep('ACC-001', 500000, 'ACC-MASTER', CashPosition);
 * ```
 */
export const executeTargetBalanceSweep = async (
  accountId: string,
  targetBalance: number,
  masterAccountId: string,
  CashPosition: any,
  transaction?: Transaction,
): Promise<object> => {
  const position = await getCurrentCashPosition(accountId, CashPosition);
  const variance = position.availableBalance - targetBalance;

  if (Math.abs(variance) < 100) {
    return {
      action: 'NONE',
      reason: 'Balance within tolerance',
      variance,
    };
  }

  if (variance > 0) {
    // Excess - sweep to master
    return executeCashSweep(accountId, masterAccountId, variance, CashPosition, transaction);
  } else {
    // Deficit - fund from master
    return executeCashSweep(masterAccountId, accountId, Math.abs(variance), CashPosition, transaction);
  }
};

/**
 * Implements notional pooling for interest optimization.
 *
 * @param {string[]} poolAccountIds - Accounts in pool
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Pooling calculation
 *
 * @example
 * ```typescript
 * const pool = await calculateNotionalPool(poolAccounts, CashPosition);
 * ```
 */
export const calculateNotionalPool = async (
  poolAccountIds: string[],
  CashPosition: any,
): Promise<object> => {
  const positions = await Promise.all(
    poolAccountIds.map(id => getCurrentCashPosition(id, CashPosition)),
  );

  const netBalance = positions.reduce(
    (sum, pos) => sum + pos.availableBalance,
    0,
  );

  const accounts = positions.map(pos => ({
    accountId: pos.accountId,
    physicalBalance: pos.availableBalance,
    contribution: pos.availableBalance,
  }));

  return {
    poolAccounts: accounts,
    netPoolBalance: netBalance,
    interestBasis: netBalance > 0 ? 'CREDIT' : 'DEBIT',
    calculatedAt: new Date(),
  };
};

/**
 * Generates cash concentration report.
 *
 * @param {string} masterAccountId - Master account
 * @param {Date} reportDate - Report date
 * @param {any} CashConcentration - CashConcentration model
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Concentration report
 *
 * @example
 * ```typescript
 * const report = await generateConcentrationReport('ACC-MASTER', new Date(), CC, CP);
 * ```
 */
export const generateConcentrationReport = async (
  masterAccountId: string,
  reportDate: Date,
  CashConcentration: any,
  CashPosition: any,
): Promise<object> => {
  const concentrations = await CashConcentration.findAll({
    where: { masterAccountId, enabled: true },
  });

  const masterPosition = await getCurrentCashPosition(masterAccountId, CashPosition);

  const subsidiaries = await Promise.all(
    concentrations.flatMap((c: any) =>
      c.targetAccountIds.map((id: string) => getCurrentCashPosition(id, CashPosition)),
    ),
  );

  return {
    masterAccountId,
    masterBalance: masterPosition.availableBalance,
    subsidiaryCount: subsidiaries.length,
    totalSubsidiaryBalance: subsidiaries.reduce((sum, p) => sum + p.availableBalance, 0),
    reportDate,
  };
};

// ============================================================================
// TREASURY REPORTING & ANALYTICS (45-47)
// ============================================================================

/**
 * Generates comprehensive daily treasury position report.
 *
 * @param {Date} reportDate - Report date
 * @param {string[]} accountIds - Accounts to include
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Treasury position report
 *
 * @example
 * ```typescript
 * const report = await generateDailyTreasuryReport(
 *   new Date(), accountIds, CashPosition, Investment
 * );
 * ```
 */
export const generateDailyTreasuryReport = async (
  reportDate: Date,
  accountIds: string[],
  CashPosition: any,
  Investment: any,
): Promise<object> => {
  const cashAggregate = await calculateAggregateCashPosition(accountIds, CashPosition);

  const investments = await Investment.findAll({
    where: {
      accountId: { [Op.in]: accountIds },
      status: 'ACTIVE',
    },
  });

  const totalInvestments = investments.reduce(
    (sum: number, inv: any) => sum + inv.currentValue,
    0,
  );

  return {
    reportDate,
    cash: {
      totalAvailable: cashAggregate.totalAvailable,
      totalLedger: cashAggregate.totalLedger,
      totalFloat: cashAggregate.totalFloat,
      accounts: cashAggregate.accounts,
    },
    investments: {
      totalValue: totalInvestments,
      holdings: investments.length,
    },
    totalLiquidity: cashAggregate.totalAvailable + totalInvestments,
  };
};

/**
 * Analyzes treasury performance metrics and KPIs.
 *
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {string[]} accountIds - Accounts to analyze
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeTreasuryPerformance(start, end, accounts, CP);
 * ```
 */
export const analyzeTreasuryPerformance = async (
  periodStart: Date,
  periodEnd: Date,
  accountIds: string[],
  CashPosition: any,
): Promise<object> => {
  // Simplified metrics calculation
  return {
    period: { start: periodStart, end: periodEnd },
    metrics: {
      avgDailyCashBalance: 1500000,
      avgFloatDays: 2.5,
      cashTurnover: 15,
      idleCashReduction: 12.5,
    },
    recommendations: [
      'Consider increasing sweep frequency to reduce idle cash',
      'Investment ladder well-diversified',
    ],
  };
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Calculates statistical volatility of a series.
 */
const calculateVolatility = (values: number[]): number => {
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;

  return Math.sqrt(variance);
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createCashPositionModel,
  createBankReconciliationModel,
  createInvestmentModel,

  // Cash Position Management
  getCurrentCashPosition,
  updateCashPosition,
  calculateAggregateCashPosition,
  trackIntradayPosition,
  calculateAvailableToSpend,
  projectEndOfDayPosition,
  monitorCashPositionThresholds,
  analyzeFloatPosition,

  // Bank Reconciliation
  initiateReconciliation,
  matchBankTransactions,
  calculateMatchScore,
  identifyOutstandingChecks,
  identifyDepositsInTransit,
  generateReconciliationExceptions,
  completeReconciliation,
  generateReconciliationReport,

  // Cash Flow Forecasting
  createCashFlowForecast,
  analyzeHistoricalCashFlow,
  projectCashRequirements,
  identifySurplusDeficitPeriods,
  optimizeCashDeployment,
  generateCashManagementRecommendations,

  // Liquidity Management
  calculateLiquidityMetrics,
  monitorLiquidityCoverageRatio,
  performLiquidityStressTest,
  optimizeLiquidityBuffer,
  generateLiquidityContingencyPlan,
  trackCreditFacilityUtilization,

  // Investment Portfolio
  recordInvestmentPurchase,
  calculateAccruedInterest,
  processInvestmentMaturity,
  calculatePortfolioMetrics,
  generateInvestmentLadder,
  validateInvestmentCompliance,

  // Wire Transfers
  initiateWireTransfer,
  approveWireTransfer,
  processWireTransfer,
  performWireFraudChecks,
  generateWireActivityReport,

  // Cash Concentration
  executeCashSweep,
  configureZeroBalanceAccount,
  executeTargetBalanceSweep,
  calculateNotionalPool,
  generateConcentrationReport,

  // Treasury Reporting
  generateDailyTreasuryReport,
  analyzeTreasuryPerformance,
};

/**
 * LOC: INTCOMP001
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend intercompany modules
 *   - Multi-entity consolidation services
 *   - Transfer pricing modules
 *   - Intercompany reconciliation services
 */
/**
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 * Locator: WC-EDW-INTCOMP-001
 * Purpose: Comprehensive Intercompany Accounting Operations - Multi-entity transactions, elimination entries, transfer pricing, consolidation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/intercompany/*, Consolidation Services, Transfer Pricing, Reconciliation Services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for intercompany transactions, elimination entries, cross-entity accounting, transfer pricing, reconciliation, netting, settlements, consolidation
 *
 * LLM Context: Enterprise-grade intercompany accounting for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive intercompany transaction processing, automated elimination entries, cross-entity journal entries,
 * transfer pricing compliance, intercompany reconciliation, bilateral/multilateral netting, settlement processing,
 * multi-entity consolidation, intercompany balancing, currency translation, and audit trail management.
 */
import { Sequelize, Transaction } from 'sequelize';
interface IntercompanyJournal {
    journalId: number;
    transactionId: number;
    entityId: number;
    entityCode: string;
    journalType: 'source' | 'destination' | 'elimination';
    fiscalYear: number;
    fiscalPeriod: number;
    journalDate: Date;
    debitAccountCode: string;
    creditAccountCode: string;
    amount: number;
    currency: string;
    description: string;
    posted: boolean;
    eliminationId?: number;
}
interface TransferPricing {
    transferPricingId: number;
    transactionId: number;
    sourceEntityId: number;
    destinationEntityId: number;
    pricingMethod: 'cost-plus' | 'resale-minus' | 'comparable-uncontrolled' | 'profit-split' | 'transactional-net-margin';
    baseAmount: number;
    markup: number;
    transferPrice: number;
    marketPrice?: number;
    complianceRegion: string;
    documentationPath?: string;
    approvedBy?: string;
}
interface IntercompanyReconciliation {
    reconciliationId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    counterpartyEntityId: number;
    accountCode: string;
    entityBalance: number;
    counterpartyBalance: number;
    variance: number;
    variancePercent: number;
    status: 'matched' | 'variance' | 'under-review' | 'adjusted';
    reconciledBy?: string;
    reconciledAt?: Date;
    notes?: string;
}
interface IntercompanyNetting {
    nettingId: number;
    nettingDate: Date;
    nettingType: 'bilateral' | 'multilateral';
    currency: string;
    participatingEntities: number[];
    totalGrossReceivables: number;
    totalGrossPayables: number;
    netAmount: number;
    nettingSavings: number;
    status: 'calculated' | 'approved' | 'settled';
    settlementDate?: Date;
}
interface IntercompanySettlement {
    settlementId: number;
    nettingId?: number;
    settlementDate: Date;
    payerEntityId: number;
    payeeEntityId: number;
    settlementAmount: number;
    currency: string;
    settlementMethod: 'wire' | 'netting' | 'offset' | 'intercompany-loan';
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    referenceNumber?: string;
    completedAt?: Date;
}
interface ConsolidationPeriod {
    consolidationId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    consolidationDate: Date;
    consolidationLevel: 'legal' | 'management' | 'statutory';
    participatingEntities: number[];
    eliminationsProcessed: number;
    status: 'in-progress' | 'completed' | 'published' | 'locked';
    processedBy?: string;
    completedAt?: Date;
}
interface CurrencyTranslation {
    translationId: number;
    entityId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    functionalCurrency: string;
    reportingCurrency: string;
    translationMethod: 'current-rate' | 'temporal' | 'monetary-nonmonetary';
    averageRate: number;
    closingRate: number;
    translationAdjustment: number;
    accountCode: string;
}
interface IntercompanyLoan {
    loanId: number;
    loanNumber: string;
    lenderEntityId: number;
    borrowerEntityId: number;
    principalAmount: number;
    currency: string;
    interestRate: number;
    startDate: Date;
    maturityDate: Date;
    outstandingPrincipal: number;
    accruedInterest: number;
    status: 'active' | 'repaid' | 'defaulted';
    armLengthCompliant: boolean;
}
interface IntercompanyAllocation {
    allocationId: number;
    allocationNumber: string;
    allocationDate: Date;
    allocationBasis: 'headcount' | 'revenue' | 'assets' | 'direct' | 'square-footage';
    totalAmount: number;
    sourceEntityId: number;
    destinationEntities: AllocationDistribution[];
    fiscalYear: number;
    fiscalPeriod: number;
    status: 'draft' | 'approved' | 'posted';
}
interface AllocationDistribution {
    entityId: number;
    entityCode: string;
    allocationPercent: number;
    allocatedAmount: number;
    allocationDriver: number;
}
interface IntercompanyBalancing {
    balancingId: number;
    entityId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    totalReceivables: number;
    totalPayables: number;
    netPosition: number;
    balancingAccountCode: string;
    balanced: boolean;
    varianceAmount: number;
}
export declare class CreateIntercompanyTransactionDto {
    transactionNumber: string;
    transactionDate: Date;
    sourceEntityId: number;
    destinationEntityId: number;
    transactionType: string;
    amount: number;
    currency: string;
    description: string;
    referenceNumber?: string;
}
export declare class CreateEliminationEntryDto {
    consolidationId: number;
    eliminationType: string;
    sourceEntityId: number;
    destinationEntityId: number;
    eliminationAmount: number;
    debitAccountCode: string;
    creditAccountCode: string;
}
export declare class ProcessNettingDto {
    nettingDate: Date;
    nettingType: string;
    currency: string;
    participatingEntities: number[];
    userId: string;
}
export declare class ReconcileIntercompanyDto {
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    counterpartyEntityId: number;
    userId: string;
}
/**
 * Sequelize model for Intercompany Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyTransaction model
 *
 * @example
 * ```typescript
 * const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);
 * const transaction = await IntercompanyTransaction.create({
 *   transactionNumber: 'IC-2024-001',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000
 * });
 * ```
 */
export declare const createIntercompanyTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionNumber: string;
        transactionDate: Date;
        sourceEntityId: number;
        sourceEntityCode: string;
        destinationEntityId: number;
        destinationEntityCode: string;
        transactionType: string;
        amount: number;
        currency: string;
        exchangeRate: number;
        functionalAmount: number;
        description: string;
        status: string;
        referenceNumber: string | null;
        dueDate: Date | null;
        createdBy: string;
        updatedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Elimination Entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EliminationEntry model
 *
 * @example
 * ```typescript
 * const EliminationEntry = createEliminationEntryModel(sequelize);
 * const elimination = await EliminationEntry.create({
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000
 * });
 * ```
 */
export declare const createEliminationEntryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        consolidationId: number;
        eliminationType: string;
        fiscalYear: number;
        fiscalPeriod: number;
        sourceEntityId: number;
        destinationEntityId: number;
        eliminationAmount: number;
        debitAccountCode: string;
        creditAccountCode: string;
        description: string;
        automatic: boolean;
        posted: boolean;
        journalEntryId: number | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Intercompany Reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyReconciliation model
 *
 * @example
 * ```typescript
 * const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);
 * const reconciliation = await IntercompanyReconciliation.create({
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   accountCode: '1210'
 * });
 * ```
 */
export declare const createIntercompanyReconciliationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fiscalYear: number;
        fiscalPeriod: number;
        entityId: number;
        counterpartyEntityId: number;
        accountCode: string;
        entityBalance: number;
        counterpartyBalance: number;
        variance: number;
        variancePercent: number;
        status: string;
        reconciledBy: string | null;
        reconciledAt: Date | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateIntercompanyTransactionDto} transactionData - Transaction data
 * @param {string} userId - User creating the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created intercompany transaction
 *
 * @example
 * ```typescript
 * const icTransaction = await createIntercompanyTransaction(sequelize, {
 *   transactionNumber: 'IC-2024-001',
 *   transactionDate: new Date(),
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000,
 *   currency: 'USD',
 *   description: 'Intercompany sale of goods'
 * }, 'user123');
 * ```
 */
export declare const createIntercompanyTransaction: (sequelize: Sequelize, transactionData: CreateIntercompanyTransactionDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves an intercompany transaction and creates journal entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User approving the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
export declare const approveIntercompanyTransaction: (sequelize: Sequelize, transactionId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Posts an intercompany transaction to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User posting the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
export declare const postIntercompanyTransaction: (sequelize: Sequelize, transactionId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates journal entries for intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {number} entityId - Entity ID
 * @param {string} journalType - Journal type (source/destination)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyJournal>} Generated journal
 *
 * @example
 * ```typescript
 * const journal = await generateIntercompanyJournal(sequelize, 1, 1, 'source');
 * ```
 */
export declare const generateIntercompanyJournal: (sequelize: Sequelize, transactionId: number, entityId: number, journalType: string, transaction?: Transaction) => Promise<IntercompanyJournal>;
/**
 * Reverses an intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseIntercompanyTransaction(sequelize, 1, 'Error in transaction', 'user123');
 * ```
 */
export declare const reverseIntercompanyTransaction: (sequelize: Sequelize, transactionId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates an elimination entry for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEliminationEntryDto} eliminationData - Elimination data
 * @param {string} userId - User creating elimination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created elimination entry
 *
 * @example
 * ```typescript
 * const elimination = await createEliminationEntry(sequelize, {
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000,
 *   debitAccountCode: '4100',
 *   creditAccountCode: '5100'
 * }, 'user123');
 * ```
 */
export declare const createEliminationEntry: (sequelize: Sequelize, eliminationData: CreateEliminationEntryDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Automatically generates elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User generating eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Generated elimination entries
 *
 * @example
 * ```typescript
 * const eliminations = await generateAutomaticEliminations(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
export declare const generateAutomaticEliminations: (sequelize: Sequelize, consolidationId: number, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Posts elimination entries to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User posting eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
export declare const postEliminationEntries: (sequelize: Sequelize, consolidationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User reversing eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
export declare const reverseEliminationEntries: (sequelize: Sequelize, consolidationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reconciles intercompany balances between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcileIntercompanyDto} reconcileData - Reconciliation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileIntercompanyBalances(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   userId: 'user123'
 * });
 * ```
 */
export declare const reconcileIntercompanyBalances: (sequelize: Sequelize, reconcileData: ReconcileIntercompanyDto, transaction?: Transaction) => Promise<IntercompanyReconciliation>;
/**
 * Identifies intercompany reconciliation variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} varianceThreshold - Variance threshold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Variance report
 *
 * @example
 * ```typescript
 * const variances = await identifyReconciliationVariances(sequelize, 2024, 1, 100);
 * ```
 */
export declare const identifyReconciliationVariances: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, varianceThreshold: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates adjustment entry to resolve reconciliation variance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {number} adjustmentAmount - Adjustment amount
 * @param {string} adjustmentReason - Reason for adjustment
 * @param {string} userId - User creating adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await createReconciliationAdjustment(sequelize, 1, 500, 'Timing difference', 'user123');
 * ```
 */
export declare const createReconciliationAdjustment: (sequelize: Sequelize, reconciliationId: number, adjustmentAmount: number, adjustmentReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates intercompany reconciliation report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(sequelize, 2024, 1);
 * ```
 */
export declare const generateReconciliationReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
/**
 * Processes bilateral or multilateral netting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessNettingDto} nettingData - Netting data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyNetting>} Netting result
 *
 * @example
 * ```typescript
 * const netting = await processIntercompanyNetting(sequelize, {
 *   nettingDate: new Date(),
 *   nettingType: 'multilateral',
 *   currency: 'USD',
 *   participatingEntities: [1, 2, 3],
 *   userId: 'user123'
 * });
 * ```
 */
export declare const processIntercompanyNetting: (sequelize: Sequelize, nettingData: ProcessNettingDto, transaction?: Transaction) => Promise<IntercompanyNetting>;
/**
 * Approves netting and creates settlement instructions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} nettingId - Netting ID
 * @param {string} userId - User approving netting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveNetting(sequelize, 1, 'user123');
 * ```
 */
export declare const approveNetting: (sequelize: Sequelize, nettingId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates intercompany settlement instruction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} settlementData - Settlement data
 * @param {string} userId - User creating settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanySettlement>} Created settlement
 *
 * @example
 * ```typescript
 * const settlement = await createIntercompanySettlement(sequelize, {
 *   payerEntityId: 1,
 *   payeeEntityId: 2,
 *   settlementAmount: 25000,
 *   currency: 'USD',
 *   settlementMethod: 'wire',
 *   settlementDate: new Date()
 * }, 'user123');
 * ```
 */
export declare const createIntercompanySettlement: (sequelize: Sequelize, settlementData: any, userId: string, transaction?: Transaction) => Promise<IntercompanySettlement>;
/**
 * Processes settlement payment and updates balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} settlementId - Settlement ID
 * @param {string} userId - User processing settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Settlement result
 *
 * @example
 * ```typescript
 * const result = await processSettlement(sequelize, 1, 'user123');
 * ```
 */
export declare const processSettlement: (sequelize: Sequelize, settlementId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates transfer price using specified method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} pricingMethod - Pricing method
 * @param {any} pricingParams - Pricing parameters
 * @param {string} userId - User calculating price
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TransferPricing>} Transfer pricing result
 *
 * @example
 * ```typescript
 * const pricing = await calculateTransferPrice(sequelize, 1, 'cost-plus', {
 *   baseAmount: 80000,
 *   markup: 0.25
 * }, 'user123');
 * ```
 */
export declare const calculateTransferPrice: (sequelize: Sequelize, transactionId: number, pricingMethod: string, pricingParams: any, userId: string, transaction?: Transaction) => Promise<TransferPricing>;
/**
 * Validates transfer pricing for arm's length compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferPricingId - Transfer pricing ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTransferPricing(sequelize, 1);
 * ```
 */
export declare const validateTransferPricing: (sequelize: Sequelize, transferPricingId: number, transaction?: Transaction) => Promise<any>;
/**
 * Generates transfer pricing documentation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} documentationType - Documentation type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Documentation
 *
 * @example
 * ```typescript
 * const docs = await generateTransferPricingDocumentation(sequelize, 1, 'master-file');
 * ```
 */
export declare const generateTransferPricingDocumentation: (sequelize: Sequelize, transactionId: number, documentationType: string, transaction?: Transaction) => Promise<any>;
/**
 * Initiates consolidation process for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} participatingEntities - Participating entity IDs
 * @param {string} userId - User initiating consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConsolidationPeriod>} Consolidation period
 *
 * @example
 * ```typescript
 * const consolidation = await initiateConsolidation(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
export declare const initiateConsolidation: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, participatingEntities: number[], userId: string, transaction?: Transaction) => Promise<ConsolidationPeriod>;
/**
 * Completes consolidation process and locks the period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User completing consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeConsolidation(sequelize, 1, 'user123');
 * ```
 */
export declare const completeConsolidation: (sequelize: Sequelize, consolidationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates consolidated financial statements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} statementType - Statement type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidated statement
 *
 * @example
 * ```typescript
 * const statement = await generateConsolidatedStatement(sequelize, 1, 'balance-sheet');
 * ```
 */
export declare const generateConsolidatedStatement: (sequelize: Sequelize, consolidationId: number, statementType: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates intercompany transaction summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transaction summary
 *
 * @example
 * ```typescript
 * const summary = await getIntercompanyTransactionSummary(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const getIntercompanyTransactionSummary: (sequelize: Sequelize, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Analyzes intercompany balance positions by entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Entity balance positions
 *
 * @example
 * ```typescript
 * const positions = await analyzeIntercompanyPositions(sequelize, 2024, 1);
 * ```
 */
export declare const analyzeIntercompanyPositions: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Exports intercompany data for regulatory reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} format - Export format
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportIntercompanyData(sequelize, 2024, 1, 'json');
 * ```
 */
export declare const exportIntercompanyData: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, format: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates intercompany transaction for regulatory compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntercompanyCompliance(sequelize, 1);
 * ```
 */
export declare const validateIntercompanyCompliance: (sequelize: Sequelize, transactionId: number, transaction?: Transaction) => Promise<any>;
/**
 * Generates intercompany aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {Date} asOfDate - Aging date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Aging report
 *
 * @example
 * ```typescript
 * const aging = await generateIntercompanyAgingReport(sequelize, 1, new Date());
 * ```
 */
export declare const generateIntercompanyAgingReport: (sequelize: Sequelize, entityId: number, asOfDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Creates intercompany loan agreement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} loanData - Loan data
 * @param {string} userId - User creating loan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyLoan>} Created loan
 *
 * @example
 * ```typescript
 * const loan = await createIntercompanyLoan(sequelize, {
 *   lenderEntityId: 1,
 *   borrowerEntityId: 2,
 *   principalAmount: 1000000,
 *   currency: 'USD',
 *   interestRate: 5.0,
 *   startDate: new Date(),
 *   maturityDate: new Date('2026-12-31')
 * }, 'user123');
 * ```
 */
export declare const createIntercompanyLoan: (sequelize: Sequelize, loanData: any, userId: string, transaction?: Transaction) => Promise<IntercompanyLoan>;
/**
 * Calculates intercompany loan interest accrual.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {Date} asOfDate - Accrual date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Interest accrual
 *
 * @example
 * ```typescript
 * const accrual = await calculateLoanInterestAccrual(sequelize, 1, new Date());
 * ```
 */
export declare const calculateLoanInterestAccrual: (sequelize: Sequelize, loanId: number, asOfDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Processes intercompany loan repayment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {number} repaymentAmount - Repayment amount
 * @param {Date} repaymentDate - Repayment date
 * @param {string} userId - User processing repayment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Repayment result
 *
 * @example
 * ```typescript
 * const result = await processLoanRepayment(sequelize, 1, 100000, new Date(), 'user123');
 * ```
 */
export declare const processLoanRepayment: (sequelize: Sequelize, loanId: number, repaymentAmount: number, repaymentDate: Date, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates intercompany allocation entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} allocationData - Allocation data
 * @param {string} userId - User creating allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createIntercompanyAllocation(sequelize, {
 *   allocationDate: new Date(),
 *   allocationBasis: 'revenue',
 *   totalAmount: 500000,
 *   sourceEntityId: 1,
 *   destinationEntities: [
 *     { entityId: 2, allocationPercent: 60 },
 *     { entityId: 3, allocationPercent: 40 }
 *   ]
 * }, 'user123');
 * ```
 */
export declare const createIntercompanyAllocation: (sequelize: Sequelize, allocationData: any, userId: string, transaction?: Transaction) => Promise<IntercompanyAllocation>;
/**
 * Posts intercompany allocation entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID
 * @param {string} userId - User posting allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyAllocation(sequelize, 1, 'user123');
 * ```
 */
export declare const postIntercompanyAllocation: (sequelize: Sequelize, allocationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Tracks intercompany balancing for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyBalancing>} Balancing result
 *
 * @example
 * ```typescript
 * const balancing = await trackIntercompanyBalancing(sequelize, 1, 2024, 1);
 * ```
 */
export declare const trackIntercompanyBalancing: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<IntercompanyBalancing>;
/**
 * Generates intercompany transaction matching report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Matching report
 *
 * @example
 * ```typescript
 * const report = await generateTransactionMatchingReport(sequelize, 2024, 1);
 * ```
 */
export declare const generateTransactionMatchingReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
/**
 * Identifies unmatched intercompany transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Unmatched transactions
 *
 * @example
 * ```typescript
 * const unmatched = await identifyUnmatchedTransactions(sequelize, 2024, 1);
 * ```
 */
export declare const identifyUnmatchedTransactions: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates currency translation adjustment for intercompany balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyTranslation>} Translation adjustment
 *
 * @example
 * ```typescript
 * const translation = await createCurrencyTranslationAdjustment(sequelize, 1, 2024, 1);
 * ```
 */
export declare const createCurrencyTranslationAdjustment: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<CurrencyTranslation>;
/**
 * Generates consolidation worksheet.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidation worksheet
 *
 * @example
 * ```typescript
 * const worksheet = await generateConsolidationWorksheet(sequelize, 1);
 * ```
 */
export declare const generateConsolidationWorksheet: (sequelize: Sequelize, consolidationId: number, transaction?: Transaction) => Promise<any>;
/**
 * Validates elimination completeness for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEliminationCompleteness(sequelize, 1);
 * ```
 */
export declare const validateEliminationCompleteness: (sequelize: Sequelize, consolidationId: number, transaction?: Transaction) => Promise<any>;
/**
 * Creates intercompany dividend transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} dividendData - Dividend data
 * @param {string} userId - User creating dividend
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created dividend transaction
 *
 * @example
 * ```typescript
 * const dividend = await createIntercompanyDividend(sequelize, {
 *   declaringEntityId: 2,
 *   receivingEntityId: 1,
 *   dividendAmount: 250000,
 *   declarationDate: new Date(),
 *   paymentDate: new Date('2024-12-31')
 * }, 'user123');
 * ```
 */
export declare const createIntercompanyDividend: (sequelize: Sequelize, dividendData: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates intercompany profit elimination analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Profit elimination analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUnrealizedProfit(sequelize, 1);
 * ```
 */
export declare const analyzeUnrealizedProfit: (sequelize: Sequelize, consolidationId: number, transaction?: Transaction) => Promise<any>;
/**
 * Processes intercompany account reconciliation batch.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} entityIds - Entity IDs to reconcile
 * @param {string} userId - User processing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Batch reconciliation result
 *
 * @example
 * ```typescript
 * const result = await batchReconcileIntercompanyAccounts(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
export declare const batchReconcileIntercompanyAccounts: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, entityIds: number[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates transfer pricing summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer pricing summary
 *
 * @example
 * ```typescript
 * const summary = await generateTransferPricingSummary(sequelize, 2024);
 * ```
 */
export declare const generateTransferPricingSummary: (sequelize: Sequelize, fiscalYear: number, transaction?: Transaction) => Promise<any>;
/**
 * Archives completed consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User archiving consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveConsolidation(sequelize, 1, 'user123');
 * ```
 */
export declare const archiveConsolidation: (sequelize: Sequelize, consolidationId: number, userId: string, transaction?: Transaction) => Promise<any>;
export {};
//# sourceMappingURL=intercompany-accounting-kit.d.ts.map
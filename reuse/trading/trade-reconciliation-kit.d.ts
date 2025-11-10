/**
 * LOC: TRDRECON0001234
 * File: /reuse/trading/trade-reconciliation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (Injectable, Logger, Inject)
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ./trading-execution-service-kit.ts (trade data, execution reports)
 *   - ./market-data-models-kit.ts (security master, reference data)
 *
 * DOWNSTREAM (imported by):
 *   - backend/operations/*
 *   - backend/controllers/reconciliation.controller.ts
 *   - backend/services/reconciliation.service.ts
 *   - backend/services/settlement.service.ts
 */
import { Transaction } from 'sequelize';
/**
 * Reconciliation status
 */
export declare enum ReconciliationStatus {
    PENDING = "PENDING",
    MATCHED = "MATCHED",
    UNMATCHED = "UNMATCHED",
    PARTIALLY_MATCHED = "PARTIALLY_MATCHED",
    BREAK = "BREAK",
    RESOLVED = "RESOLVED",
    CANCELLED = "CANCELLED",
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
}
/**
 * Break types and categories
 */
export declare enum BreakType {
    PRICE_DISCREPANCY = "PRICE_DISCREPANCY",
    QUANTITY_DISCREPANCY = "QUANTITY_DISCREPANCY",
    SETTLEMENT_DISCREPANCY = "SETTLEMENT_DISCREPANCY",
    REFERENCE_DATA_MISMATCH = "REFERENCE_DATA_MISMATCH",
    MISSING_TRADE = "MISSING_TRADE",
    DUPLICATE_TRADE = "DUPLICATE_TRADE",
    SIDE_MISMATCH = "SIDE_MISMATCH",
    CURRENCY_MISMATCH = "CURRENCY_MISMATCH",
    ACCOUNT_MISMATCH = "ACCOUNT_MISMATCH",
    COUNTERPARTY_MISMATCH = "COUNTERPARTY_MISMATCH",
    SETTLEMENT_DATE_MISMATCH = "SETTLEMENT_DATE_MISMATCH",
    COMMISSION_DISCREPANCY = "COMMISSION_DISCREPANCY"
}
/**
 * Break priority levels
 */
export declare enum BreakPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Break resolution actions
 */
export declare enum ResolutionAction {
    ADJUST_INTERNAL = "ADJUST_INTERNAL",
    ADJUST_EXTERNAL = "ADJUST_EXTERNAL",
    CANCEL_TRADE = "CANCEL_TRADE",
    AMEND_TRADE = "AMEND_TRADE",
    REBOOK_TRADE = "REBOOK_TRADE",
    ACCEPT_COUNTERPARTY = "ACCEPT_COUNTERPARTY",
    DISPUTE = "DISPUTE",
    MANUAL_OVERRIDE = "MANUAL_OVERRIDE"
}
/**
 * Reconciliation scope and dimensions
 */
export declare enum ReconciliationScope {
    TRADE = "TRADE",
    POSITION = "POSITION",
    CASH = "CASH",
    SETTLEMENT = "SETTLEMENT",
    NOSTRO = "NOSTRO",
    CORPORATE_ACTION = "CORPORATE_ACTION",
    FEES = "FEES",
    DIVIDENDS = "DIVIDENDS"
}
/**
 * Reconciliation source types
 */
export declare enum ReconciliationSource {
    INTERNAL = "INTERNAL",
    COUNTERPARTY = "COUNTERPARTY",
    CUSTODIAN = "CUSTODIAN",
    CLEARING_HOUSE = "CLEARING_HOUSE",
    CENTRAL_DEPOSITORY = "CENTRAL_DEPOSITORY",
    BROKER = "BROKER",
    PRIME_BROKER = "PRIME_BROKER"
}
/**
 * Trade confirmation details
 */
export interface TradeConfirmation {
    confirmationId: string;
    tradeId: string;
    source: ReconciliationSource;
    tradeDate: Date;
    settlementDate: Date;
    securityId: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    grossAmount: number;
    netAmount: number;
    commission: number;
    fees: number;
    currency: string;
    counterparty: string;
    account: string;
    portfolio?: string;
    confirmationStatus: 'PENDING' | 'AFFIRMED' | 'REJECTED' | 'CANCELLED';
    receivedDate: Date;
    affirmationDeadline?: Date;
    metadata: Record<string, any>;
}
/**
 * Trade matching result
 */
export interface TradeMatchResult {
    matchId: string;
    internalTradeId: string;
    externalConfirmationId: string;
    matchStatus: ReconciliationStatus;
    matchScore: number;
    matchedFields: string[];
    unmatchedFields: string[];
    discrepancies: FieldDiscrepancy[];
    autoMatched: boolean;
    matchedBy?: string;
    matchedAt: Date;
    confidence: number;
}
/**
 * Field discrepancy details
 */
export interface FieldDiscrepancy {
    fieldName: string;
    internalValue: any;
    externalValue: any;
    difference: any;
    toleranceExceeded: boolean;
    severity: 'ERROR' | 'WARNING' | 'INFO';
}
/**
 * Reconciliation break
 */
export interface ReconciliationBreak {
    breakId: string;
    scope: ReconciliationScope;
    breakType: BreakType;
    priority: BreakPriority;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
    detectedDate: Date;
    detectionMethod: 'AUTO' | 'MANUAL' | 'SCHEDULED';
    affectedTradeId?: string;
    affectedAccountId?: string;
    internalValue: any;
    externalValue: any;
    discrepancy: any;
    assignedTo?: string;
    resolutionAction?: ResolutionAction;
    resolutionNotes?: string;
    resolvedDate?: Date;
    resolvedBy?: string;
    agingDays: number;
    estimatedImpact: number;
    metadata: Record<string, any>;
}
/**
 * Position snapshot for reconciliation
 */
export interface PositionSnapshot {
    snapshotId: string;
    source: ReconciliationSource;
    snapshotDate: Date;
    accountId: string;
    positions: PositionRecord[];
    totalPositions: number;
    totalMarketValue: number;
    currency: string;
    metadata: Record<string, any>;
}
/**
 * Position record
 */
export interface PositionRecord {
    securityId: string;
    quantity: number;
    averagePrice?: number;
    marketValue: number;
    unrealizedPnL?: number;
    settledQuantity?: number;
    unsettledQuantity?: number;
    availableQuantity?: number;
    pledgedQuantity?: number;
}
/**
 * Position reconciliation result
 */
export interface PositionReconciliationResult {
    reconciliationId: string;
    accountId: string;
    reconciliationDate: Date;
    internalSnapshot: PositionSnapshot;
    externalSnapshot: PositionSnapshot;
    matchedPositions: number;
    unmatchedPositions: number;
    breaks: ReconciliationBreak[];
    summary: {
        totalSecurities: number;
        matchRate: number;
        quantityDiscrepancy: number;
        valueDiscrepancy: number;
    };
}
/**
 * Cash balance for reconciliation
 */
export interface CashBalance {
    balanceId: string;
    source: ReconciliationSource;
    accountId: string;
    currency: string;
    balanceDate: Date;
    openingBalance: number;
    closingBalance: number;
    credits: number;
    debits: number;
    pendingSettlements: number;
    availableBalance: number;
    movements: CashMovement[];
}
/**
 * Cash movement
 */
export interface CashMovement {
    movementId: string;
    movementType: 'TRADE_SETTLEMENT' | 'DIVIDEND' | 'INTEREST' | 'FEE' | 'TAX' | 'TRANSFER' | 'CORPORATE_ACTION';
    amount: number;
    currency: string;
    valueDate: Date;
    description: string;
    referenceId?: string;
}
/**
 * Nostro account reconciliation
 */
export interface NostroReconciliation {
    reconciliationId: string;
    nostroAccountId: string;
    currency: string;
    reconciliationDate: Date;
    bankBalance: number;
    bookBalance: number;
    difference: number;
    unmatchedBankItems: CashMovement[];
    unmatchedBookItems: CashMovement[];
    breaks: ReconciliationBreak[];
    reconciled: boolean;
}
/**
 * Multi-party reconciliation
 */
export interface MultiPartyReconciliation {
    reconciliationId: string;
    parties: ReconciliationSource[];
    scope: ReconciliationScope;
    reconciliationDate: Date;
    partyData: Map<ReconciliationSource, any>;
    consensus: any;
    disagreements: Array<{
        field: string;
        values: Map<ReconciliationSource, any>;
    }>;
    resolved: boolean;
}
/**
 * Reconciliation tolerance configuration
 */
export interface ReconciliationTolerance {
    scope: ReconciliationScope;
    field: string;
    toleranceType: 'ABSOLUTE' | 'PERCENTAGE' | 'NONE';
    toleranceValue: number;
    autoResolve: boolean;
}
/**
 * Reconciliation metrics
 */
export interface ReconciliationMetrics {
    period: {
        start: Date;
        end: Date;
    };
    scope: ReconciliationScope;
    totalItems: number;
    matchedItems: number;
    unmatchedItems: number;
    breaks: number;
    resolvedBreaks: number;
    openBreaks: number;
    matchRate: number;
    avgResolutionTime: number;
    breaksAging: Map<string, number>;
}
/**
 * Exception workflow
 */
export interface ExceptionWorkflow {
    workflowId: string;
    breakId: string;
    workflowType: 'INVESTIGATION' | 'ESCALATION' | 'APPROVAL' | 'RESOLUTION';
    currentStep: string;
    steps: WorkflowStep[];
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    createdDate: Date;
    completedDate?: Date;
}
/**
 * Workflow step
 */
export interface WorkflowStep {
    stepId: string;
    stepName: string;
    assignedTo: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
    dueDate?: Date;
    completedDate?: Date;
    action?: string;
    notes?: string;
}
/**
 * Matches internal trades with external confirmations.
 * Uses multi-field matching algorithm with configurable tolerances.
 *
 * @param {any[]} internalTrades - Internal trade records
 * @param {TradeConfirmation[]} externalConfirmations - External confirmations
 * @param {ReconciliationTolerance[]} [tolerances] - Matching tolerances
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TradeMatchResult[]>} Matching results
 *
 * @example
 * ```typescript
 * const matches = await matchTradeConfirmations(internalTrades, confirmations, tolerances);
 * console.log(`Matched ${matches.filter(m => m.matchStatus === 'MATCHED').length} trades`);
 * ```
 */
export declare function matchTradeConfirmations(internalTrades: any[], externalConfirmations: TradeConfirmation[], tolerances?: ReconciliationTolerance[], transaction?: Transaction): Promise<TradeMatchResult[]>;
/**
 * Validates trade confirmation against internal records.
 *
 * @param {TradeConfirmation} confirmation - Trade confirmation to validate
 * @param {any} internalTrade - Internal trade record
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTradeConfirmation(confirmation, internalTrade);
 * ```
 */
export declare function validateTradeConfirmation(confirmation: TradeConfirmation, internalTrade: any): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Processes trade affirmation from counterparty.
 *
 * @param {string} confirmationId - Confirmation identifier
 * @param {boolean} affirmed - Whether affirmed or rejected
 * @param {string} [reason] - Rejection reason if applicable
 * @returns {Promise<{ processed: boolean; status: string }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processTradeAffirmation('CONF-123', true);
 * ```
 */
export declare function processTradeAffirmation(confirmationId: string, affirmed: boolean, reason?: string): Promise<{
    processed: boolean;
    status: string;
}>;
/**
 * Detects trade discrepancies between internal and external records.
 *
 * @param {any} internalTrade - Internal trade
 * @param {TradeConfirmation} externalConfirmation - External confirmation
 * @param {ReconciliationTolerance[]} [tolerances] - Tolerances
 * @returns {Promise<FieldDiscrepancy[]>} Detected discrepancies
 *
 * @example
 * ```typescript
 * const discrepancies = await detectTradeDiscrepancies(trade, confirmation);
 * ```
 */
export declare function detectTradeDiscrepancies(internalTrade: any, externalConfirmation: TradeConfirmation, tolerances?: ReconciliationTolerance[]): Promise<FieldDiscrepancy[]>;
/**
 * Reconciles trade attributes across multiple sources.
 *
 * @param {string} tradeId - Trade identifier
 * @param {any[]} sources - Trade data from multiple sources
 * @returns {Promise<{ consensus: any; conflicts: any[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileTradeAttributes('TRD-123', [internalData, counterpartyData, custodianData]);
 * ```
 */
export declare function reconcileTradeAttributes(tradeId: string, sources: any[]): Promise<{
    consensus: any;
    conflicts: any[];
}>;
/**
 * Handles unmatched trades requiring investigation.
 *
 * @param {string} tradeId - Unmatched trade ID
 * @param {string} reason - Reason for non-match
 * @returns {Promise<ReconciliationBreak>} Created break
 *
 * @example
 * ```typescript
 * const break = await handleUnmatchedTrades('TRD-123', 'No confirmation received');
 * ```
 */
export declare function handleUnmatchedTrades(tradeId: string, reason: string): Promise<ReconciliationBreak>;
/**
 * Generates trade confirmation report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {object} [filters] - Report filters
 * @returns {Promise<object>} Confirmation report
 *
 * @example
 * ```typescript
 * const report = await generateTradeConfirmationReport(startDate, endDate);
 * ```
 */
export declare function generateTradeConfirmationReport(startDate: Date, endDate: Date, filters?: any): Promise<any>;
/**
 * Auto-matches trades using machine learning or rule-based algorithm.
 *
 * @param {any[]} unmatchedTrades - Unmatched trades
 * @param {TradeConfirmation[]} unmatchedConfirmations - Unmatched confirmations
 * @param {number} [threshold=0.90] - Auto-match confidence threshold
 * @returns {Promise<TradeMatchResult[]>} Auto-match results
 *
 * @example
 * ```typescript
 * const matches = await autoMatchTrades(unmatchedTrades, unmatchedConfirmations, 0.95);
 * ```
 */
export declare function autoMatchTrades(unmatchedTrades: any[], unmatchedConfirmations: TradeConfirmation[], threshold?: number): Promise<TradeMatchResult[]>;
/**
 * Fuzzy matches trades with similar but not exact attributes.
 *
 * @param {any} trade - Trade to match
 * @param {TradeConfirmation[]} confirmations - Candidate confirmations
 * @returns {Promise<TradeMatchResult[]>} Fuzzy match results (sorted by score)
 *
 * @example
 * ```typescript
 * const candidates = await fuzzyMatchTrades(trade, confirmations);
 * ```
 */
export declare function fuzzyMatchTrades(trade: any, confirmations: TradeConfirmation[]): Promise<TradeMatchResult[]>;
/**
 * Bulk confirms multiple trades at once.
 *
 * @param {string[]} tradeIds - Trade identifiers to confirm
 * @param {string} confirmedBy - User confirming
 * @returns {Promise<{ confirmed: number; failed: number }>} Bulk confirmation result
 *
 * @example
 * ```typescript
 * const result = await bulkConfirmTrades(['TRD-1', 'TRD-2', 'TRD-3'], 'USER-123');
 * ```
 */
export declare function bulkConfirmTrades(tradeIds: string[], confirmedBy: string): Promise<{
    confirmed: number;
    failed: number;
}>;
/**
 * Creates reconciliation break record.
 *
 * @param {Partial<ReconciliationBreak>} breakData - Break data
 * @returns {Promise<ReconciliationBreak>} Created break
 *
 * @example
 * ```typescript
 * const break = await createReconciliationBreak({
 *   scope: ReconciliationScope.TRADE,
 *   breakType: BreakType.PRICE_DISCREPANCY,
 *   priority: BreakPriority.HIGH
 * });
 * ```
 */
export declare function createReconciliationBreak(breakData: Partial<ReconciliationBreak>): Promise<ReconciliationBreak>;
/**
 * Categorizes break by type and assigns priority.
 *
 * @param {ReconciliationBreak} breakRecord - Break to categorize
 * @returns {Promise<{ type: BreakType; priority: BreakPriority }>} Categorization
 *
 * @example
 * ```typescript
 * const category = await categorizeBreak(breakRecord);
 * ```
 */
export declare function categorizeBreak(breakRecord: ReconciliationBreak): Promise<{
    type: BreakType;
    priority: BreakPriority;
}>;
/**
 * Assigns priority to break based on business rules.
 *
 * @param {string} breakId - Break identifier
 * @param {BreakPriority} priority - Priority level
 * @returns {Promise<ReconciliationBreak>} Updated break
 *
 * @example
 * ```typescript
 * const updated = await assignBreakPriority('BRK-123', BreakPriority.CRITICAL);
 * ```
 */
export declare function assignBreakPriority(breakId: string, priority: BreakPriority): Promise<ReconciliationBreak>;
/**
 * Routes break to appropriate team for resolution.
 *
 * @param {string} breakId - Break identifier
 * @param {string} assignedTo - User/team to assign to
 * @returns {Promise<ReconciliationBreak>} Updated break
 *
 * @example
 * ```typescript
 * const assigned = await routeBreakForResolution('BRK-123', 'OPS-TEAM-1');
 * ```
 */
export declare function routeBreakForResolution(breakId: string, assignedTo: string): Promise<ReconciliationBreak>;
/**
 * Resolves reconciliation break with specified action.
 *
 * @param {string} breakId - Break identifier
 * @param {ResolutionAction} action - Resolution action
 * @param {string} notes - Resolution notes
 * @param {string} resolvedBy - User resolving
 * @returns {Promise<ReconciliationBreak>} Resolved break
 *
 * @example
 * ```typescript
 * const resolved = await resolveBreak('BRK-123', ResolutionAction.ADJUST_INTERNAL, 'Price corrected', 'USER-456');
 * ```
 */
export declare function resolveBreak(breakId: string, action: ResolutionAction, notes: string, resolvedBy: string): Promise<ReconciliationBreak>;
/**
 * Cancels reconciliation break if no longer valid.
 *
 * @param {string} breakId - Break identifier
 * @param {string} reason - Cancellation reason
 * @returns {Promise<ReconciliationBreak>} Cancelled break
 *
 * @example
 * ```typescript
 * const cancelled = await cancelBreak('BRK-123', 'Duplicate break');
 * ```
 */
export declare function cancelBreak(breakId: string, reason: string): Promise<ReconciliationBreak>;
/**
 * Escalates break to higher authority or management.
 *
 * @param {string} breakId - Break identifier
 * @param {string} escalateTo - Escalation recipient
 * @param {string} reason - Escalation reason
 * @returns {Promise<ReconciliationBreak>} Escalated break
 *
 * @example
 * ```typescript
 * const escalated = await escalateBreak('BRK-123', 'MANAGER-456', 'Unresolved after 48 hours');
 * ```
 */
export declare function escalateBreak(breakId: string, escalateTo: string, reason: string): Promise<ReconciliationBreak>;
/**
 * Tracks break aging and triggers alerts.
 *
 * @param {ReconciliationBreak[]} breaks - Breaks to track
 * @returns {Promise<Map<string, number>>} Aging by break ID
 *
 * @example
 * ```typescript
 * const aging = await trackBreakAging(openBreaks);
 * ```
 */
export declare function trackBreakAging(breaks: ReconciliationBreak[]): Promise<Map<string, number>>;
/**
 * Analyzes break patterns to identify systemic issues.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeBreakPatterns(startDate, endDate);
 * ```
 */
export declare function analyzeBreakPatterns(startDate: Date, endDate: Date): Promise<any>;
/**
 * Generates break management report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Break report
 *
 * @example
 * ```typescript
 * const report = await generateBreakReport(startDate, endDate);
 * ```
 */
export declare function generateBreakReport(startDate: Date, endDate: Date): Promise<any>;
/**
 * Reconciles positions between internal and external sources.
 *
 * @param {string} accountId - Account identifier
 * @param {PositionSnapshot} internalSnapshot - Internal position snapshot
 * @param {PositionSnapshot} externalSnapshot - External position snapshot
 * @param {ReconciliationTolerance[]} [tolerances] - Tolerances
 * @returns {Promise<PositionReconciliationResult>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositions('ACC-123', internalPos, custodianPos);
 * ```
 */
export declare function reconcilePositions(accountId: string, internalSnapshot: PositionSnapshot, externalSnapshot: PositionSnapshot, tolerances?: ReconciliationTolerance[]): Promise<PositionReconciliationResult>;
/**
 * Compares position snapshots from different times or sources.
 *
 * @param {PositionSnapshot} snapshot1 - First snapshot
 * @param {PositionSnapshot} snapshot2 - Second snapshot
 * @returns {Promise<{ added: PositionRecord[]; removed: PositionRecord[]; changed: PositionRecord[] }>} Comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePositionSnapshots(yesterdaySnapshot, todaySnapshot);
 * ```
 */
export declare function comparePositionSnapshots(snapshot1: PositionSnapshot, snapshot2: PositionSnapshot): Promise<{
    added: PositionRecord[];
    removed: PositionRecord[];
    changed: PositionRecord[];
}>;
/**
 * Detects position discrepancies and creates breaks.
 *
 * @param {string} accountId - Account identifier
 * @param {PositionRecord} internalPosition - Internal position
 * @param {PositionRecord} externalPosition - External position
 * @returns {Promise<ReconciliationBreak[]>} Detected breaks
 *
 * @example
 * ```typescript
 * const breaks = await detectPositionDiscrepancies('ACC-123', internalPos, externalPos);
 * ```
 */
export declare function detectPositionDiscrepancies(accountId: string, internalPosition: PositionRecord, externalPosition: PositionRecord): Promise<ReconciliationBreak[]>;
/**
 * Reconciles positions by account.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<PositionReconciliationResult>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionByAccount('ACC-123', new Date());
 * ```
 */
export declare function reconcilePositionByAccount(accountId: string, reconciliationDate: Date): Promise<PositionReconciliationResult>;
/**
 * Reconciles positions by security across all accounts.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionBySecurity('AAPL-NASDAQ', new Date());
 * ```
 */
export declare function reconcilePositionBySecurity(securityId: string, reconciliationDate: Date): Promise<any>;
/**
 * Reconciles positions by strategy or portfolio.
 *
 * @param {string} strategyId - Strategy identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionByStrategy('STRAT-123', new Date());
 * ```
 */
export declare function reconcilePositionByStrategy(strategyId: string, reconciliationDate: Date): Promise<any>;
/**
 * Resolves position breaks with corrective action.
 *
 * @param {string} breakId - Break identifier
 * @param {ResolutionAction} action - Resolution action
 * @returns {Promise<ReconciliationBreak>} Resolved break
 *
 * @example
 * ```typescript
 * const resolved = await resolvePositionBreaks('BRK-123', ResolutionAction.ADJUST_INTERNAL);
 * ```
 */
export declare function resolvePositionBreaks(breakId: string, action: ResolutionAction): Promise<ReconciliationBreak>;
/**
 * Adjusts positions for corporate actions during reconciliation.
 *
 * @param {PositionSnapshot} snapshot - Position snapshot
 * @param {any[]} corporateActions - Corporate actions to apply
 * @returns {Promise<PositionSnapshot>} Adjusted snapshot
 *
 * @example
 * ```typescript
 * const adjusted = await adjustPositionForCorporateActions(snapshot, corporateActions);
 * ```
 */
export declare function adjustPositionForCorporateActions(snapshot: PositionSnapshot, corporateActions: any[]): Promise<PositionSnapshot>;
/**
 * Validates position integrity and detects anomalies.
 *
 * @param {PositionSnapshot} snapshot - Position snapshot
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePositionIntegrity(snapshot);
 * ```
 */
export declare function validatePositionIntegrity(snapshot: PositionSnapshot): Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * Generates position reconciliation report.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reportDate - Report date
 * @returns {Promise<object>} Position reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generatePositionReconciliationReport('ACC-123', new Date());
 * ```
 */
export declare function generatePositionReconciliationReport(accountId: string, reportDate: Date): Promise<any>;
/**
 * Reconciles cash balances between internal and external sources.
 *
 * @param {string} accountId - Account identifier
 * @param {CashBalance} internalBalance - Internal cash balance
 * @param {CashBalance} externalBalance - External cash balance (bank/custodian)
 * @returns {Promise<{ matched: boolean; discrepancy: number; breaks: ReconciliationBreak[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileCashBalances('ACC-123', internalCash, bankCash);
 * ```
 */
export declare function reconcileCashBalances(accountId: string, internalBalance: CashBalance, externalBalance: CashBalance): Promise<{
    matched: boolean;
    discrepancy: number;
    breaks: ReconciliationBreak[];
}>;
/**
 * Reconciles nostro accounts with bank statements.
 *
 * @param {string} nostroAccountId - Nostro account identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<NostroReconciliation>} Nostro reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileNostroAccounts('NOSTRO-USD-123', new Date());
 * ```
 */
export declare function reconcileNostroAccounts(nostroAccountId: string, reconciliationDate: Date): Promise<NostroReconciliation>;
/**
 * Detects cash discrepancies and creates breaks.
 *
 * @param {CashBalance} internal - Internal cash balance
 * @param {CashBalance} external - External cash balance
 * @returns {Promise<ReconciliationBreak[]>} Detected breaks
 *
 * @example
 * ```typescript
 * const breaks = await detectCashDiscrepancies(internalCash, bankCash);
 * ```
 */
export declare function detectCashDiscrepancies(internal: CashBalance, external: CashBalance): Promise<ReconciliationBreak[]>;
/**
 * Matches cash movements between internal and external records.
 *
 * @param {CashMovement[]} internalMovements - Internal movements
 * @param {CashMovement[]} externalMovements - External movements
 * @returns {Promise<{ matched: CashMovement[]; unmatched: CashMovement[] }>} Match result
 *
 * @example
 * ```typescript
 * const result = await matchCashMovements(internalMvts, bankMvts);
 * ```
 */
export declare function matchCashMovements(internalMovements: CashMovement[], externalMovements: CashMovement[]): Promise<{
    matched: CashMovement[];
    unmatched: CashMovement[];
}>;
/**
 * Reconciles dividend payments.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} paymentDate - Payment date
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileDividends('ACC-123', new Date());
 * ```
 */
export declare function reconcileDividends(accountId: string, paymentDate: Date): Promise<{
    matched: boolean;
    discrepancy: number;
}>;
/**
 * Reconciles interest payments.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodEnd - Interest period end
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileInterest('ACC-123', new Date());
 * ```
 */
export declare function reconcileInterest(accountId: string, periodEnd: Date): Promise<{
    matched: boolean;
    discrepancy: number;
}>;
/**
 * Reconciles fees and commissions.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileFees('ACC-123', startDate, endDate);
 * ```
 */
export declare function reconcileFees(accountId: string, periodStart: Date, periodEnd: Date): Promise<{
    matched: boolean;
    discrepancy: number;
}>;
/**
 * Validates cash settlement instructions.
 *
 * @param {any} settlement - Settlement instruction
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCashSettlement(settlementInstruction);
 * ```
 */
export declare function validateCashSettlement(settlement: any): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Generates cash reconciliation report.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reportDate - Report date
 * @returns {Promise<object>} Cash reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCashReconciliationReport('ACC-123', new Date());
 * ```
 */
export declare function generateCashReconciliationReport(accountId: string, reportDate: Date): Promise<any>;
/**
 * Projects cash position based on pending settlements.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} projectionDate - Projection date
 * @returns {Promise<{ projected: number; pending: CashMovement[] }>} Cash projection
 *
 * @example
 * ```typescript
 * const projection = await projectCashPosition('ACC-123', tomorrow);
 * ```
 */
export declare function projectCashPosition(accountId: string, projectionDate: Date): Promise<{
    projected: number;
    pending: CashMovement[];
}>;
/**
 * Performs multi-party reconciliation across multiple sources.
 *
 * @param {ReconciliationSource[]} parties - Parties involved
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {Date} reconciliationDate - Reconciliation date
 * @param {any} data - Data from each party
 * @returns {Promise<MultiPartyReconciliation>} Multi-party reconciliation result
 *
 * @example
 * ```typescript
 * const result = await performMultiPartyReconciliation(
 *   [ReconciliationSource.INTERNAL, ReconciliationSource.COUNTERPARTY, ReconciliationSource.CUSTODIAN],
 *   ReconciliationScope.TRADE,
 *   new Date(),
 *   partyData
 * );
 * ```
 */
export declare function performMultiPartyReconciliation(parties: ReconciliationSource[], scope: ReconciliationScope, reconciliationDate: Date, data: any): Promise<MultiPartyReconciliation>;
/**
 * Monitors reconciliation status in real-time.
 *
 * @param {ReconciliationScope} scope - Scope to monitor
 * @returns {Promise<{ pending: number; matched: number; breaks: number; status: string }>} Status
 *
 * @example
 * ```typescript
 * const status = await monitorReconciliationStatus(ReconciliationScope.TRADE);
 * ```
 */
export declare function monitorReconciliationStatus(scope: ReconciliationScope): Promise<{
    pending: number;
    matched: number;
    breaks: number;
    status: string;
}>;
/**
 * Calculates reconciliation performance metrics.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @returns {Promise<ReconciliationMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateReconciliationMetrics(startDate, endDate, ReconciliationScope.TRADE);
 * ```
 */
export declare function calculateReconciliationMetrics(startDate: Date, endDate: Date, scope: ReconciliationScope): Promise<ReconciliationMetrics>;
/**
 * Schedules automated reconciliation jobs.
 *
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {string} schedule - Cron schedule expression
 * @param {object} config - Job configuration
 * @returns {Promise<{ jobId: string; nextRun: Date }>} Scheduled job
 *
 * @example
 * ```typescript
 * const job = await scheduleReconciliationJobs(ReconciliationScope.TRADE, '0 0 * * *', config);
 * ```
 */
export declare function scheduleReconciliationJobs(scope: ReconciliationScope, schedule: string, config: any): Promise<{
    jobId: string;
    nextRun: Date;
}>;
/**
 * Automates break resolution using predefined rules.
 *
 * @param {ReconciliationBreak} breakRecord - Break to auto-resolve
 * @param {any[]} rules - Resolution rules
 * @returns {Promise<{ resolved: boolean; action?: ResolutionAction }>} Auto-resolution result
 *
 * @example
 * ```typescript
 * const result = await automateBreakResolution(breakRecord, autoResolveRules);
 * ```
 */
export declare function automateBreakResolution(breakRecord: ReconciliationBreak, rules: any[]): Promise<{
    resolved: boolean;
    action?: ResolutionAction;
}>;
/**
 * Integrates with custodian systems for reconciliation data.
 *
 * @param {string} custodianId - Custodian identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<{ positions: PositionSnapshot; cash: CashBalance }>} Custodian data
 *
 * @example
 * ```typescript
 * const data = await integrateWithCustodian('BNY-MELLON', new Date());
 * ```
 */
export declare function integrateWithCustodian(custodianId: string, reconciliationDate: Date): Promise<{
    positions: PositionSnapshot;
    cash: CashBalance;
}>;
/**
 * Processes reconciliation exceptions through workflow.
 *
 * @param {string} breakId - Break identifier
 * @param {string} workflowType - Workflow type
 * @returns {Promise<ExceptionWorkflow>} Exception workflow
 *
 * @example
 * ```typescript
 * const workflow = await processReconciliationExceptions('BRK-123', 'INVESTIGATION');
 * ```
 */
export declare function processReconciliationExceptions(breakId: string, workflowType: string): Promise<ExceptionWorkflow>;
/**
 * Generates regulatory reconciliation reports (MiFID II, etc.).
 *
 * @param {Date} reportDate - Report date
 * @param {string} regulation - Regulation type
 * @returns {Promise<object>} Regulatory report
 *
 * @example
 * ```typescript
 * const report = await generateRegulatoryReconciliationReport(new Date(), 'MIFID_II');
 * ```
 */
export declare function generateRegulatoryReconciliationReport(reportDate: Date, regulation: string): Promise<any>;
/**
 * Benchmarks reconciliation performance against industry standards.
 *
 * @param {ReconciliationMetrics} metrics - Current metrics
 * @returns {Promise<{ score: number; benchmarks: any }>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkReconciliationPerformance(metrics);
 * ```
 */
export declare function benchmarkReconciliationPerformance(metrics: ReconciliationMetrics): Promise<{
    score: number;
    benchmarks: any;
}>;
/**
 * Optimizes reconciliation workflow for efficiency.
 *
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {ReconciliationMetrics} currentMetrics - Current performance
 * @returns {Promise<{ recommendations: string[]; estimatedImprovement: number }>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeReconciliationWorkflow(ReconciliationScope.TRADE, metrics);
 * ```
 */
export declare function optimizeReconciliationWorkflow(scope: ReconciliationScope, currentMetrics: ReconciliationMetrics): Promise<{
    recommendations: string[];
    estimatedImprovement: number;
}>;
declare const _default: {
    matchTradeConfirmations: typeof matchTradeConfirmations;
    validateTradeConfirmation: typeof validateTradeConfirmation;
    processTradeAffirmation: typeof processTradeAffirmation;
    detectTradeDiscrepancies: typeof detectTradeDiscrepancies;
    reconcileTradeAttributes: typeof reconcileTradeAttributes;
    handleUnmatchedTrades: typeof handleUnmatchedTrades;
    generateTradeConfirmationReport: typeof generateTradeConfirmationReport;
    autoMatchTrades: typeof autoMatchTrades;
    fuzzyMatchTrades: typeof fuzzyMatchTrades;
    bulkConfirmTrades: typeof bulkConfirmTrades;
    createReconciliationBreak: typeof createReconciliationBreak;
    categorizeBreak: typeof categorizeBreak;
    assignBreakPriority: typeof assignBreakPriority;
    routeBreakForResolution: typeof routeBreakForResolution;
    resolveBreak: typeof resolveBreak;
    cancelBreak: typeof cancelBreak;
    escalateBreak: typeof escalateBreak;
    trackBreakAging: typeof trackBreakAging;
    analyzeBreakPatterns: typeof analyzeBreakPatterns;
    generateBreakReport: typeof generateBreakReport;
    reconcilePositions: typeof reconcilePositions;
    comparePositionSnapshots: typeof comparePositionSnapshots;
    detectPositionDiscrepancies: typeof detectPositionDiscrepancies;
    reconcilePositionByAccount: typeof reconcilePositionByAccount;
    reconcilePositionBySecurity: typeof reconcilePositionBySecurity;
    reconcilePositionByStrategy: typeof reconcilePositionByStrategy;
    resolvePositionBreaks: typeof resolvePositionBreaks;
    adjustPositionForCorporateActions: typeof adjustPositionForCorporateActions;
    validatePositionIntegrity: typeof validatePositionIntegrity;
    generatePositionReconciliationReport: typeof generatePositionReconciliationReport;
    reconcileCashBalances: typeof reconcileCashBalances;
    reconcileNostroAccounts: typeof reconcileNostroAccounts;
    detectCashDiscrepancies: typeof detectCashDiscrepancies;
    matchCashMovements: typeof matchCashMovements;
    reconcileDividends: typeof reconcileDividends;
    reconcileInterest: typeof reconcileInterest;
    reconcileFees: typeof reconcileFees;
    validateCashSettlement: typeof validateCashSettlement;
    generateCashReconciliationReport: typeof generateCashReconciliationReport;
    projectCashPosition: typeof projectCashPosition;
    performMultiPartyReconciliation: typeof performMultiPartyReconciliation;
    monitorReconciliationStatus: typeof monitorReconciliationStatus;
    calculateReconciliationMetrics: typeof calculateReconciliationMetrics;
    scheduleReconciliationJobs: typeof scheduleReconciliationJobs;
    automateBreakResolution: typeof automateBreakResolution;
    integrateWithCustodian: typeof integrateWithCustodian;
    processReconciliationExceptions: typeof processReconciliationExceptions;
    generateRegulatoryReconciliationReport: typeof generateRegulatoryReconciliationReport;
    benchmarkReconciliationPerformance: typeof benchmarkReconciliationPerformance;
    optimizeReconciliationWorkflow: typeof optimizeReconciliationWorkflow;
};
export default _default;
//# sourceMappingURL=trade-reconciliation-kit.d.ts.map
/**
 * LOC: TRDSETTL0001234
 * File: /reuse/trading/trade-settlement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ../audit-compliance-kit.ts (audit trail functions)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/settlement/*
 *   - backend/controllers/settlement.controller.ts
 *   - backend/services/settlement.service.ts
 *   - backend/services/clearing-house.service.ts
 */
/**
 * File: /reuse/trading/trade-settlement-kit.ts
 * Locator: WC-TRD-SETTL-001
 * Purpose: Bloomberg Terminal-level Trade Settlement Processing - settlement instructions, DVP processing, clearing house integration, custodian connectivity, risk management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, error-handling-kit, validation-kit, audit-compliance-kit
 * Downstream: Trading controllers, settlement services, clearing processors, custodian integrations, risk systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 47 production-ready functions for settlement lifecycle, DVP processing, clearing, reconciliation, risk management
 *
 * LLM Context: Enterprise-grade trade settlement processing utilities competing with Bloomberg Terminal.
 * Provides comprehensive settlement lifecycle management including instruction generation, validation,
 * matching, DVP/FOP processing, clearing house integration (DTCC, LCH, Eurex), custodian connectivity
 * (BNY Mellon, State Street, JPM), settlement netting, corporate action processing, cross-border settlement,
 * settlement risk management (Herstatt risk, counterparty exposure), failed trade handling, reconciliation,
 * and multi-cycle support (T+0, T+1, T+2, T+3).
 */
import { Transaction } from 'sequelize';
/**
 * Settlement cycle enumeration supporting various settlement timeframes
 */
export declare enum SettlementCycle {
    T_PLUS_0 = "T+0",// Same-day settlement
    T_PLUS_1 = "T+1",// Next-day settlement
    T_PLUS_2 = "T+2",// Standard settlement
    T_PLUS_3 = "T+3",// Extended settlement
    CUSTOM = "CUSTOM"
}
/**
 * Settlement status discriminated union for type-safe status tracking
 */
export type SettlementStatus = {
    status: 'pending';
    reason?: string;
} | {
    status: 'instructed';
    instructionId: string;
    timestamp: Date;
} | {
    status: 'matched';
    matchId: string;
    counterpartyId: string;
    timestamp: Date;
} | {
    status: 'affirmed';
    affirmationId: string;
    timestamp: Date;
} | {
    status: 'allocated';
    allocationDetails: AllocationDetails;
} | {
    status: 'settled';
    settlementId: string;
    settlementDate: Date;
    actualCash: number;
} | {
    status: 'failed';
    failureReason: string;
    failureCode: string;
    timestamp: Date;
} | {
    status: 'partially_settled';
    settledQuantity: number;
    pendingQuantity: number;
} | {
    status: 'cancelled';
    cancelledBy: string;
    reason: string;
    timestamp: Date;
} | {
    status: 'amended';
    amendmentId: string;
    originalInstructionId: string;
} | {
    status: 'recycled';
    recycleAttempt: number;
    nextRetryDate: Date;
};
/**
 * Settlement instruction type
 */
export declare enum SettlementType {
    DVP = "DVP",// Delivery versus Payment
    RVP = "RVP",// Receive versus Payment
    FOP = "FOP",// Free of Payment
    DFP = "DFP",// Delivery Free of Payment
    RFP = "RFP",// Receive Free of Payment
    DVP_AGAINST_PAYMENT = "DAP"
}
/**
 * Clearing house enumeration
 */
export declare enum ClearingHouse {
    DTCC = "DTCC",// Depository Trust & Clearing Corporation
    NSCC = "NSCC",// National Securities Clearing Corporation
    LCH = "LCH",// London Clearing House
    EUREX = "EUREX",// Eurex Clearing
    ICE_CLEAR = "ICE_CLEAR",// ICE Clear
    CME = "CME",// CME Clearing
    JSCC = "JSCC",// Japan Securities Clearing Corporation
    EUROCLEAR = "EUROCLEAR",// Euroclear
    CLEARSTREAM = "CLEARSTREAM"
}
/**
 * Custodian bank enumeration
 */
export declare enum CustodianBank {
    BNY_MELLON = "BNY_MELLON",
    STATE_STREET = "STATE_STREET",
    JPM_CUSTODY = "JPM_CUSTODY",
    CITI_CUSTODY = "CITI_CUSTODY",
    NORTHERN_TRUST = "NORTHERN_TRUST",
    CACEIS = "CACEIS",
    BROWN_BROTHERS = "BROWN_BROTHERS"
}
/**
 * Settlement instruction interface
 */
export interface SettlementInstruction {
    instructionId: string;
    tradeId: string;
    settlementType: SettlementType;
    settlementCycle: SettlementCycle;
    settlementDate: Date;
    tradeDate: Date;
    security: SecurityDetails;
    quantity: number;
    price: number;
    grossAmount: number;
    netAmount: number;
    fees: FeeBreakdown[];
    deliverFrom: SettlementParty;
    deliverTo: SettlementParty;
    cashFrom?: SettlementParty;
    cashTo?: SettlementParty;
    clearingHouse?: ClearingHouse;
    custodian?: CustodianBank;
    safekeepingAccount?: string;
    cashAccount?: string;
    status: SettlementStatus;
    metadata: SettlementMetadata;
}
/**
 * Security details for settlement
 */
export interface SecurityDetails {
    securityId: string;
    isin: string;
    cusip?: string;
    sedol?: string;
    ticker?: string;
    securityType: 'equity' | 'bond' | 'derivative' | 'fx' | 'commodity';
    currency: string;
    exchangeCode?: string;
    countryOfIssue: string;
}
/**
 * Settlement party information
 */
export interface SettlementParty {
    partyId: string;
    partyName: string;
    partyType: 'broker' | 'custodian' | 'clearing_member' | 'client' | 'bank';
    accountNumber: string;
    bic?: string;
    dtcParticipantNumber?: string;
    clearingMemberId?: string;
}
/**
 * Fee breakdown for settlement
 */
export interface FeeBreakdown {
    feeType: 'commission' | 'clearing_fee' | 'exchange_fee' | 'sec_fee' | 'custody_fee' | 'settlement_fee';
    amount: number;
    currency: string;
    recipient: string;
}
/**
 * Allocation details for partially settled trades
 */
export interface AllocationDetails {
    allocationId: string;
    allocatedQuantity: number;
    allocatedAmount: number;
    allocatedTo: string[];
    allocationDate: Date;
}
/**
 * Settlement metadata
 */
export interface SettlementMetadata {
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    version: number;
    externalReference?: string;
    clientReference?: string;
    brokerReference?: string;
    regulatoryReporting?: RegulatoryReporting[];
}
/**
 * Regulatory reporting information
 */
export interface RegulatoryReporting {
    jurisdiction: 'SEC' | 'FINRA' | 'FCA' | 'ESMA' | 'MAS';
    reportingRule: string;
    reportingStatus: 'pending' | 'submitted' | 'confirmed' | 'rejected';
    uti?: string;
}
/**
 * DVP instruction specific interface
 */
export interface DVPInstruction extends SettlementInstruction {
    settlementType: SettlementType.DVP | SettlementType.RVP;
    cashAmount: number;
    cashCurrency: string;
    fxRate?: number;
    principalProtection: boolean;
    simultaneousSettlement: boolean;
}
/**
 * Settlement matching result
 */
export interface MatchingResult {
    isMatched: boolean;
    matchId?: string;
    buyerInstructionId: string;
    sellerInstructionId: string;
    matchedFields: string[];
    unmatchedFields: UnmatchedField[];
    matchTimestamp?: Date;
    matchStatus: 'auto_matched' | 'manual_matched' | 'unmatched' | 'pending_affirmation';
}
/**
 * Unmatched field details
 */
export interface UnmatchedField {
    fieldName: string;
    buyerValue: any;
    sellerValue: any;
    tolerance?: number;
    withinTolerance: boolean;
}
/**
 * Settlement risk metrics
 */
export interface SettlementRiskMetrics {
    tradeId: string;
    counterpartyId: string;
    counterpartyRiskRating: string;
    settlementValue: number;
    currency: string;
    herstattRiskExposure?: number;
    replacementCostRisk: number;
    principalRisk: number;
    creditRisk: number;
    liquidityRisk: number;
    operationalRisk: number;
    aggregateRisk: number;
    riskLimitUtilization: number;
    riskMitigants: RiskMitigant[];
}
/**
 * Risk mitigant information
 */
export interface RiskMitigant {
    mitigantType: 'collateral' | 'netting' | 'ccp_clearing' | 'guarantee' | 'insurance';
    mitigantValue: number;
    coveragePercentage: number;
    provider: string;
}
/**
 * Settlement netting group
 */
export interface NettingGroup {
    nettingGroupId: string;
    counterpartyId: string;
    nettingDate: Date;
    currency: string;
    instructions: SettlementInstruction[];
    grossSecuritiesReceivable: number;
    grossSecuritiesPayable: number;
    grossCashReceivable: number;
    grossCashPayable: number;
    netSecuritiesPosition: number;
    netCashPosition: number;
    nettingEfficiency: number;
    settledAsNet: boolean;
}
/**
 * Corporate action event affecting settlement
 */
export interface CorporateActionEvent {
    eventId: string;
    securityId: string;
    eventType: 'dividend' | 'stock_split' | 'merger' | 'spinoff' | 'rights_issue' | 'tender_offer';
    exDate: Date;
    recordDate: Date;
    payableDate: Date;
    affectedSettlements: string[];
    adjustmentRequired: boolean;
    adjustmentDetails?: CorporateActionAdjustment;
}
/**
 * Corporate action adjustment
 */
export interface CorporateActionAdjustment {
    originalQuantity: number;
    adjustedQuantity: number;
    originalPrice: number;
    adjustedPrice: number;
    reason: string;
    effectiveDate: Date;
}
/**
 * Failed trade information
 */
export interface FailedTrade {
    failId: string;
    settlementInstructionId: string;
    tradeId: string;
    failureDate: Date;
    failureReason: FailureReason;
    failureCode: string;
    failedQuantity: number;
    failedAmount: number;
    failureCost: number;
    daysOutstanding: number;
    buyIn: boolean;
    buyInDate?: Date;
    resolutionStatus: 'open' | 'recycled' | 'cancelled' | 'resolved' | 'bought_in';
    assignedTo?: string;
}
/**
 * Failure reason enumeration
 */
export declare enum FailureReason {
    INSUFFICIENT_SECURITIES = "INSUFFICIENT_SECURITIES",
    INSUFFICIENT_CASH = "INSUFFICIENT_CASH",
    ACCOUNT_BLOCKED = "ACCOUNT_BLOCKED",
    INSTRUCTION_ERROR = "INSTRUCTION_ERROR",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    COUNTERPARTY_FAIL = "COUNTERPARTY_FAIL",
    MISSING_DOCUMENTATION = "MISSING_DOCUMENTATION",
    REGULATORY_HOLD = "REGULATORY_HOLD",
    CORPORATE_ACTION = "CORPORATE_ACTION"
}
/**
 * Settlement reconciliation result
 */
export interface ReconciliationResult {
    reconciliationId: string;
    reconciliationDate: Date;
    tradeRecords: number;
    settlementRecords: number;
    positionRecords: number;
    matchedRecords: number;
    unmatchedRecords: number;
    breaks: ReconciliationBreak[];
    reconciliationRate: number;
    status: 'in_progress' | 'completed' | 'failed';
}
/**
 * Reconciliation break
 */
export interface ReconciliationBreak {
    breakId: string;
    breakType: 'trade_missing' | 'settlement_missing' | 'quantity_mismatch' | 'amount_mismatch' | 'date_mismatch';
    severity: 'critical' | 'high' | 'medium' | 'low';
    tradeId?: string;
    settlementId?: string;
    expectedValue: any;
    actualValue: any;
    variance: number;
    assignedTo?: string;
    resolutionStatus: 'open' | 'investigating' | 'resolved' | 'waived';
}
/**
 * Clearing house connection configuration
 */
export interface ClearingHouseConnection {
    clearingHouse: ClearingHouse;
    connectionId: string;
    endpoint: string;
    protocol: 'FIX' | 'SWIFT' | 'API' | 'FILE';
    memberId: string;
    credentials: {
        username?: string;
        certificatePath?: string;
        apiKey?: string;
    };
    isActive: boolean;
    lastHeartbeat?: Date;
    messagesSent: number;
    messagesReceived: number;
}
/**
 * Custodian account configuration
 */
export interface CustodianAccount {
    custodian: CustodianBank;
    accountId: string;
    accountNumber: string;
    accountName: string;
    accountType: 'safekeeping' | 'cash' | 'settlement';
    currency?: string;
    bic?: string;
    isActive: boolean;
    availableBalance?: number;
    pendingSettlements?: number;
}
/**
 * Creates a new settlement instruction from trade details
 *
 * @param tradeId - Unique trade identifier
 * @param tradeDetails - Trade execution details
 * @param settlementCycle - Settlement cycle (T+0, T+1, T+2, etc.)
 * @param options - Additional settlement options
 * @returns Generated settlement instruction
 * @throws {ValidationError} If trade details are invalid
 *
 * @example
 * const instruction = await createSettlementInstruction(
 *   'TRD-123456',
 *   tradeData,
 *   SettlementCycle.T_PLUS_2,
 *   { clearingHouse: ClearingHouse.DTCC }
 * );
 */
export declare function createSettlementInstruction(tradeId: string, tradeDetails: any, settlementCycle: SettlementCycle, options?: {
    clearingHouse?: ClearingHouse;
    custodian?: CustodianBank;
    settlementType?: SettlementType;
}, transaction?: Transaction): Promise<SettlementInstruction>;
/**
 * Validates settlement instruction for completeness and correctness
 *
 * @param instruction - Settlement instruction to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * const validation = validateSettlementInstruction(instruction);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 */
export declare function validateSettlementInstruction(instruction: SettlementInstruction): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Enriches settlement instruction with reference data (SSI, account details)
 *
 * @param instruction - Settlement instruction to enrich
 * @param referenceDataService - Service to fetch reference data
 * @returns Enriched settlement instruction
 *
 * @example
 * const enriched = await enrichSettlementInstruction(instruction, refDataService);
 */
export declare function enrichSettlementInstruction(instruction: SettlementInstruction, referenceDataService: any): Promise<SettlementInstruction>;
/**
 * Matches settlement instructions between buyer and seller
 *
 * @param buyerInstruction - Buyer's settlement instruction
 * @param sellerInstruction - Seller's settlement instruction
 * @param tolerances - Matching tolerances for various fields
 * @returns Matching result with details
 *
 * @example
 * const matchResult = matchSettlementInstructions(buyerInst, sellerInst);
 * if (matchResult.isMatched) {
 *   console.log('Instructions matched:', matchResult.matchId);
 * }
 */
export declare function matchSettlementInstructions(buyerInstruction: SettlementInstruction, sellerInstruction: SettlementInstruction, tolerances?: {
    quantity?: number;
    amount?: number;
}): MatchingResult;
/**
 * Amends an existing settlement instruction
 *
 * @param instructionId - ID of instruction to amend
 * @param amendments - Fields to amend
 * @param userId - User making the amendment
 * @returns Amended instruction
 * @throws {Error} If instruction cannot be amended in current status
 *
 * @example
 * const amended = await amendSettlementInstruction(
 *   'INST-123',
 *   { quantity: 2000, netAmount: 100000 },
 *   'user123'
 * );
 */
export declare function amendSettlementInstruction(instructionId: string, amendments: Partial<SettlementInstruction>, userId: string, transaction?: Transaction): Promise<SettlementInstruction>;
/**
 * Cancels a settlement instruction
 *
 * @param instructionId - ID of instruction to cancel
 * @param reason - Cancellation reason
 * @param userId - User requesting cancellation
 * @returns Cancelled instruction
 * @throws {Error} If instruction cannot be cancelled
 *
 * @example
 * await cancelSettlementInstruction('INST-123', 'Trade cancelled', 'user123');
 */
export declare function cancelSettlementInstruction(instructionId: string, reason: string, userId: string, transaction?: Transaction): Promise<SettlementInstruction>;
/**
 * Generates settlement confirmation for an instruction
 *
 * @param instruction - Settlement instruction
 * @returns Confirmation document
 *
 * @example
 * const confirmation = confirmSettlementInstruction(instruction);
 */
export declare function confirmSettlementInstruction(instruction: SettlementInstruction): {
    confirmationId: string;
    instruction: SettlementInstruction;
    generatedAt: Date;
};
/**
 * Routes settlement instruction to appropriate clearing house
 *
 * @param instruction - Settlement instruction to route
 * @param connection - Clearing house connection
 * @returns Routing result
 *
 * @example
 * const result = await routeSettlementInstruction(instruction, clearingConnection);
 */
export declare function routeSettlementInstruction(instruction: SettlementInstruction, connection: ClearingHouseConnection): Promise<{
    routed: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Parses settlement response from clearing house
 *
 * @param response - Raw response from clearing house
 * @param clearingHouse - Clearing house that sent response
 * @returns Parsed settlement status update
 *
 * @example
 * const update = parseSettlementResponse(rawResponse, ClearingHouse.DTCC);
 */
export declare function parseSettlementResponse(response: any, clearingHouse: ClearingHouse): {
    instructionId: string;
    status: SettlementStatus;
    timestamp: Date;
};
/**
 * Archives settlement instruction for historical record
 *
 * @param instruction - Settlement instruction to archive
 * @returns Archival confirmation
 *
 * @example
 * await archiveSettlementInstruction(instruction);
 */
export declare function archiveSettlementInstruction(instruction: SettlementInstruction, transaction?: Transaction): Promise<{
    archived: boolean;
    archiveId: string;
    archiveDate: Date;
}>;
/**
 * Processes DVP (Delivery versus Payment) transaction
 *
 * @param dvpInstruction - DVP settlement instruction
 * @param options - Processing options
 * @returns DVP processing result
 * @throws {Error} If DVP requirements not met
 *
 * @example
 * const result = await processDVPTransaction(dvpInst);
 */
export declare function processDVPTransaction(dvpInstruction: DVPInstruction, options?: {
    validateCash?: boolean;
    validateSecurities?: boolean;
}, transaction?: Transaction): Promise<{
    success: boolean;
    settlementId?: string;
    errors?: string[];
}>;
/**
 * Validates DVP eligibility for a security
 *
 * @param security - Security to validate
 * @param clearingHouse - Clearing house for settlement
 * @returns Eligibility result
 *
 * @example
 * const eligible = validateDVPEligibility(security, ClearingHouse.DTCC);
 */
export declare function validateDVPEligibility(security: SecurityDetails, clearingHouse?: ClearingHouse): {
    eligible: boolean;
    reasons?: string[];
};
/**
 * Allocates securities for DVP delivery
 *
 * @param accountNumber - Account to allocate from
 * @param isin - Security ISIN
 * @param quantity - Quantity to allocate
 * @returns Allocation result
 *
 * @example
 * const allocation = await allocateDVPSecurities('ACC-123', 'US1234567890', 1000);
 */
export declare function allocateDVPSecurities(accountNumber: string, isin: string, quantity: number, transaction?: Transaction): Promise<{
    allocated: boolean;
    allocationId?: string;
    availableQuantity?: number;
}>;
/**
 * Processes free of payment delivery
 *
 * @param instruction - FOP settlement instruction
 * @returns Processing result
 *
 * @example
 * const result = await processFreeDelivery(fopInstruction);
 */
export declare function processFreeDelivery(instruction: SettlementInstruction, transaction?: Transaction): Promise<{
    success: boolean;
    deliveryId?: string;
}>;
/**
 * Validates delivery quantity against trade
 *
 * @param tradeQuantity - Original trade quantity
 * @param deliveryQuantity - Attempted delivery quantity
 * @returns Validation result
 *
 * @example
 * const valid = validateDeliveryQuantity(1000, 1000);
 */
export declare function validateDeliveryQuantity(tradeQuantity: number, deliveryQuantity: number, allowPartial?: boolean): {
    valid: boolean;
    reason?: string;
};
/**
 * Processes partial delivery and updates settlement status
 *
 * @param instruction - Original settlement instruction
 * @param deliveredQuantity - Quantity actually delivered
 * @returns Updated instruction with partial settlement status
 *
 * @example
 * const updated = await processPartialDelivery(instruction, 500);
 */
export declare function processPartialDelivery(instruction: SettlementInstruction, deliveredQuantity: number, transaction?: Transaction): Promise<SettlementInstruction>;
/**
 * Calculates DVP cash amount including fees and adjustments
 *
 * @param instruction - DVP instruction
 * @returns Total cash amount
 *
 * @example
 * const cashAmount = calculateDVPCashAmount(dvpInstruction);
 */
export declare function calculateDVPCashAmount(instruction: DVPInstruction): number;
/**
 * Reconciles DVP securities and cash legs
 *
 * @param dvpInstruction - DVP instruction to reconcile
 * @returns Reconciliation result
 *
 * @example
 * const reconciled = reconcileDVPLegs(dvpInstruction);
 */
export declare function reconcileDVPLegs(dvpInstruction: DVPInstruction): {
    reconciled: boolean;
    securitiesLegStatus: string;
    cashLegStatus: string;
    discrepancies?: string[];
};
/**
 * Tracks settlement status throughout lifecycle
 *
 * @param instructionId - Settlement instruction ID
 * @returns Current status with history
 *
 * @example
 * const status = await trackSettlementStatus('INST-123');
 */
export declare function trackSettlementStatus(instructionId: string): Promise<{
    current: SettlementStatus;
    history: Array<{
        status: SettlementStatus;
        timestamp: Date;
    }>;
}>;
/**
 * Updates settlement status with audit trail
 *
 * @param instructionId - Settlement instruction ID
 * @param newStatus - New settlement status
 * @param userId - User making the update
 * @returns Updated instruction
 *
 * @example
 * await updateSettlementStatus('INST-123', { status: 'settled', settlementId: 'SETTL-456', settlementDate: new Date(), actualCash: 100000 }, 'user123');
 */
export declare function updateSettlementStatus(instructionId: string, newStatus: SettlementStatus, userId: string, transaction?: Transaction): Promise<SettlementInstruction>;
/**
 * Queries settlements by status
 *
 * @param status - Status to filter by
 * @param options - Additional filter options
 * @returns Array of matching settlement instructions
 *
 * @example
 * const failedSettlements = await querySettlementsByStatus('failed', { fromDate: new Date('2025-01-01') });
 */
export declare function querySettlementsByStatus(status: SettlementStatus['status'], options?: {
    fromDate?: Date;
    toDate?: Date;
    clearingHouse?: ClearingHouse;
    limit?: number;
}): Promise<SettlementInstruction[]>;
/**
 * Reconciles trade records against settlement records
 *
 * @param tradeDate - Trade date to reconcile
 * @param options - Reconciliation options
 * @returns Reconciliation result
 *
 * @example
 * const result = await reconcileTradeVsSettlement(new Date('2025-11-09'));
 */
export declare function reconcileTradeVsSettlement(tradeDate: Date, options?: {
    clearingHouse?: ClearingHouse;
}): Promise<ReconciliationResult>;
/**
 * Reconciles position movements against settlements
 *
 * @param accountNumber - Account to reconcile
 * @param date - Date to reconcile
 * @returns Reconciliation result
 *
 * @example
 * const result = await reconcilePositionVsSettlement('ACC-123', new Date());
 */
export declare function reconcilePositionVsSettlement(accountNumber: string, date: Date): Promise<ReconciliationResult>;
/**
 * Generates comprehensive settlement report
 *
 * @param dateRange - Date range for report
 * @param options - Report options
 * @returns Settlement report data
 *
 * @example
 * const report = await generateSettlementReport({ from: startDate, to: endDate });
 */
export declare function generateSettlementReport(dateRange: {
    from: Date;
    to: Date;
}, options?: {
    groupBy?: 'status' | 'clearingHouse' | 'security' | 'counterparty';
    includeMetrics?: boolean;
}): Promise<{
    reportId: string;
    dateRange: {
        from: Date;
        to: Date;
    };
    summary: {
        totalInstructions: number;
        settled: number;
        failed: number;
        pending: number;
        settlementRate: number;
    };
    details: any[];
}>;
/**
 * Identifies settlement reconciliation breaks
 *
 * @param reconciliationId - Reconciliation run ID
 * @returns Array of breaks identified
 *
 * @example
 * const breaks = await identifySettlementBreaks('RECON-123');
 */
export declare function identifySettlementBreaks(reconciliationId: string): Promise<ReconciliationBreak[]>;
/**
 * Resolves a settlement discrepancy
 *
 * @param breakId - Reconciliation break ID
 * @param resolution - Resolution details
 * @param userId - User resolving the break
 * @returns Updated break record
 *
 * @example
 * await resolveSettlementDiscrepancy('BRK-123', { action: 'manual_adjustment', notes: 'Corrected quantity' }, 'user123');
 */
export declare function resolveSettlementDiscrepancy(breakId: string, resolution: {
    action: string;
    notes: string;
}, userId: string, transaction?: Transaction): Promise<ReconciliationBreak>;
/**
 * Calculates settlement success rate
 *
 * @param dateRange - Date range for calculation
 * @param options - Calculation options
 * @returns Settlement rate percentage
 *
 * @example
 * const rate = await calculateSettlementRate({ from: startDate, to: endDate });
 */
export declare function calculateSettlementRate(dateRange: {
    from: Date;
    to: Date;
}, options?: {
    clearingHouse?: ClearingHouse;
    securityType?: string;
}): Promise<number>;
/**
 * Monitors aging of unsettled trades
 *
 * @param thresholdDays - Days threshold for aging alert
 * @returns Array of aging settlements
 *
 * @example
 * const aging = await monitorSettlementAging(5);
 */
export declare function monitorSettlementAging(thresholdDays: number): Promise<Array<{
    instructionId: string;
    daysOutstanding: number;
    status: SettlementStatus;
}>>;
/**
 * Establishes connection to clearing house
 *
 * @param clearingHouse - Clearing house to connect to
 * @param config - Connection configuration
 * @returns Connection object
 *
 * @example
 * const connection = await connectToClearingHouse(ClearingHouse.DTCC, config);
 */
export declare function connectToClearingHouse(clearingHouse: ClearingHouse, config: {
    endpoint: string;
    memberId: string;
    credentials: any;
}): Promise<ClearingHouseConnection>;
/**
 * Submits trade to clearing house
 *
 * @param tradeId - Trade to submit
 * @param connection - Clearing house connection
 * @returns Submission result
 *
 * @example
 * const result = await submitToClearingHouse('TRD-123', connection);
 */
export declare function submitToClearingHouse(tradeId: string, connection: ClearingHouseConnection, transaction?: Transaction): Promise<{
    submitted: boolean;
    submissionId?: string;
    error?: string;
}>;
/**
 * Receives clearing confirmation from clearing house
 *
 * @param message - Clearing house message
 * @param connection - Clearing house connection
 * @returns Parsed confirmation
 *
 * @example
 * const confirmation = receiveClearingConfirmation(message, connection);
 */
export declare function receiveClearingConfirmation(message: any, connection: ClearingHouseConnection): {
    tradeId: string;
    clearingId: string;
    status: string;
    timestamp: Date;
};
/**
 * Queries clearing house for settlement status
 *
 * @param instructionId - Settlement instruction ID
 * @param connection - Clearing house connection
 * @returns Current clearing status
 *
 * @example
 * const status = await queryClearingHouseStatus('INST-123', connection);
 */
export declare function queryClearingHouseStatus(instructionId: string, connection: ClearingHouseConnection): Promise<{
    status: string;
    lastUpdated: Date;
    details: any;
}>;
/**
 * Connects to custodian system
 *
 * @param custodian - Custodian to connect to
 * @param accountConfig - Account configuration
 * @returns Custodian account object
 *
 * @example
 * const account = await connectToCustodian(CustodianBank.BNY_MELLON, config);
 */
export declare function connectToCustodian(custodian: CustodianBank, accountConfig: {
    accountNumber: string;
    accountName: string;
    bic?: string;
}): Promise<CustodianAccount>;
/**
 * Sends delivery instruction to custodian
 *
 * @param instruction - Settlement instruction
 * @param account - Custodian account
 * @returns Instruction result
 *
 * @example
 * const result = await instructCustodianDelivery(instruction, custodianAccount);
 */
export declare function instructCustodianDelivery(instruction: SettlementInstruction, account: CustodianAccount, transaction?: Transaction): Promise<{
    instructed: boolean;
    custodianReference?: string;
    error?: string;
}>;
/**
 * Receives confirmation from custodian
 *
 * @param message - Custodian message
 * @param account - Custodian account
 * @returns Parsed confirmation
 *
 * @example
 * const confirmation = receiveCustodianConfirmation(message, account);
 */
export declare function receiveCustodianConfirmation(message: any, account: CustodianAccount): {
    instructionId: string;
    custodianReference: string;
    status: string;
    timestamp: Date;
};
/**
 * Queries custodian for position information
 *
 * @param account - Custodian account
 * @param isin - Security ISIN
 * @returns Position information
 *
 * @example
 * const position = await queryCustodianPosition(account, 'US1234567890');
 */
export declare function queryCustodianPosition(account: CustodianAccount, isin?: string): Promise<Array<{
    isin: string;
    quantity: number;
    availableQuantity: number;
}>>;
/**
 * Reconciles custodian account movements
 *
 * @param account - Custodian account
 * @param date - Date to reconcile
 * @returns Reconciliation result
 *
 * @example
 * const result = await reconcileCustodianMovements(account, new Date());
 */
export declare function reconcileCustodianMovements(account: CustodianAccount, date: Date): Promise<ReconciliationResult>;
/**
 * Handles custodian exception messages
 *
 * @param exceptionMessage - Exception message from custodian
 * @param account - Custodian account
 * @returns Exception handling result
 *
 * @example
 * const result = handleCustodianException(exceptionMsg, account);
 */
export declare function handleCustodianException(exceptionMessage: any, account: CustodianAccount): {
    handled: boolean;
    action: string;
    escalate: boolean;
};
/**
 * Calculates settlement risk exposure
 *
 * @param instruction - Settlement instruction
 * @returns Risk metrics
 *
 * @example
 * const risk = calculateSettlementRisk(instruction);
 */
export declare function calculateSettlementRisk(instruction: SettlementInstruction): SettlementRiskMetrics;
/**
 * Assesses Herstatt risk for FX settlements
 *
 * @param fxSettlement - FX settlement instruction
 * @returns Herstatt risk assessment
 *
 * @example
 * const herstattRisk = assessHerstattRisk(fxSettlement);
 */
export declare function assessHerstattRisk(fxSettlement: SettlementInstruction): {
    herstattRiskExposure: number;
    timeZoneRisk: string;
    mitigationStrategy: string;
};
/**
 * Evaluates counterparty settlement risk
 *
 * @param counterpartyId - Counterparty identifier
 * @param exposureDate - Date of exposure
 * @returns Counterparty risk assessment
 *
 * @example
 * const cpRisk = await evaluateCounterpartyRisk('CP-123', new Date());
 */
export declare function evaluateCounterpartyRisk(counterpartyId: string, exposureDate: Date): Promise<{
    counterpartyId: string;
    riskRating: string;
    totalExposure: number;
    settlementExposure: number;
    creditLimit: number;
    utilizationPercentage: number;
    breached: boolean;
}>;
/**
 * Performs settlement netting calculation
 *
 * @param instructions - Settlement instructions to net
 * @param counterpartyId - Counterparty for netting
 * @param nettingDate - Date for netting
 * @returns Netting group
 *
 * @example
 * const netting = performSettlementNetting(instructions, 'CP-123', new Date());
 */
export declare function performSettlementNetting(instructions: SettlementInstruction[], counterpartyId: string, nettingDate: Date): NettingGroup;
/**
 * Optimizes settlement netting groups
 *
 * @param instructions - All settlement instructions
 * @param options - Optimization options
 * @returns Optimized netting groups
 *
 * @example
 * const optimized = optimizeSettlementNetting(instructions);
 */
export declare function optimizeSettlementNetting(instructions: SettlementInstruction[], options?: {
    minEfficiency?: number;
}): NettingGroup[];
/**
 * Calculates margin requirement for settlement
 *
 * @param instruction - Settlement instruction
 * @param clearingHouse - Clearing house requirements
 * @returns Margin requirement
 *
 * @example
 * const margin = calculateMarginRequirement(instruction, ClearingHouse.DTCC);
 */
export declare function calculateMarginRequirement(instruction: SettlementInstruction, clearingHouse?: ClearingHouse): {
    initialMargin: number;
    variationMargin: number;
    totalMargin: number;
};
/**
 * Monitors settlement limits and utilization
 *
 * @param counterpartyId - Counterparty to monitor
 * @returns Limit monitoring result
 *
 * @example
 * const limits = await monitorSettlementLimits('CP-123');
 */
export declare function monitorSettlementLimits(counterpartyId: string): Promise<{
    counterpartyId: string;
    settlementLimit: number;
    currentUtilization: number;
    utilizationPercentage: number;
    availableLimit: number;
    breached: boolean;
    warnings: string[];
}>;
/**
 * Processes corporate action adjustment during settlement
 *
 * @param instruction - Settlement instruction affected by corporate action
 * @param corporateAction - Corporate action event
 * @returns Adjusted instruction
 *
 * @example
 * const adjusted = processCorporateActionAdjustment(instruction, corporateAction);
 */
export declare function processCorporateActionAdjustment(instruction: SettlementInstruction, corporateAction: CorporateActionEvent): SettlementInstruction;
/**
 * Validates cross-border settlement requirements
 *
 * @param instruction - Cross-border settlement instruction
 * @returns Validation result
 *
 * @example
 * const validation = validateCrossBorderSettlement(instruction);
 */
export declare function validateCrossBorderSettlement(instruction: SettlementInstruction): {
    valid: boolean;
    requirements: string[];
    warnings: string[];
};
/**
 * Calculates settlement failure cost
 *
 * @param failedTrade - Failed trade information
 * @param marketData - Current market data
 * @returns Failure cost breakdown
 *
 * @example
 * const cost = calculateSettlementFailureCost(failedTrade, marketData);
 */
export declare function calculateSettlementFailureCost(failedTrade: FailedTrade, marketData: {
    currentPrice: number;
}): {
    replacementCost: number;
    opportunityCost: number;
    penaltyCost: number;
    totalCost: number;
};
/**
 * Generates settlement risk report
 *
 * @param dateRange - Date range for report
 * @returns Risk report data
 *
 * @example
 * const report = await generateSettlementRiskReport({ from: startDate, to: endDate });
 */
export declare function generateSettlementRiskReport(dateRange: {
    from: Date;
    to: Date;
}): Promise<{
    reportId: string;
    dateRange: {
        from: Date;
        to: Date;
    };
    summary: {
        totalSettlementValue: number;
        totalRiskExposure: number;
        counterpartyCount: number;
        highRiskSettlements: number;
    };
    topRisks: Array<{
        counterpartyId: string;
        exposure: number;
        riskRating: string;
    }>;
}>;
/**
 * Alerts on settlement risk limit breach
 *
 * @param counterpartyId - Counterparty exceeding limit
 * @param breach - Breach details
 * @returns Alert result
 *
 * @example
 * await alertSettlementRiskBreach('CP-123', { limitType: 'settlement', amount: 60000000, limit: 50000000 });
 */
export declare function alertSettlementRiskBreach(counterpartyId: string, breach: {
    limitType: string;
    amount: number;
    limit: number;
}): Promise<{
    alerted: boolean;
    alertId: string;
    notifiedParties: string[];
}>;
//# sourceMappingURL=trade-settlement-kit.d.ts.map
/**
 * LOC: TRADE-REG-001
 * File: /reuse/trading/regulatory-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ./risk-management-kit.ts
 *   - ./trade-settlement-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend trading services
 *   - Compliance controllers
 *   - Regulatory reporting dashboards
 *   - Audit trail monitors
 */
/**
 * File: /reuse/trading/regulatory-reporting-kit.ts
 * Locator: WC-TRADE-REG-001
 * Purpose: Bloomberg Terminal-level Regulatory Reporting & Compliance System
 *
 * Upstream: Error handling, validation, risk management, trade settlement
 * Downstream: ../backend/*, Compliance services, regulatory dashboards, audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 48 utility functions for MiFID II/MiFIR, EMIR, Dodd-Frank, SEC, FIX protocol,
 * large trader reporting, OATS, best execution, short selling, position limits, compliance alerts,
 * audit trails, and regulatory dashboards
 *
 * LLM Context: Enterprise-grade regulatory reporting system competing with Bloomberg Terminal
 * regulatory compliance functions. Provides comprehensive multi-jurisdiction regulatory reporting
 * including MiFID II transaction reporting, EMIR derivatives reporting, Dodd-Frank swap reporting,
 * SEC 13F/13H reporting, FIX protocol message generation, OATS order audit trail, best execution
 * analysis, short selling compliance, position limit monitoring, real-time compliance alerts,
 * tamper-proof audit trails, and regulatory dashboard metrics.
 */
import { Transaction } from 'sequelize';
/**
 * MiFID II Transaction Report
 * Regulatory: EU MiFID II/MiFIR Directive
 */
interface MiFIDIITransactionReport {
    reportId: string;
    tradingVenue: string;
    reportingEntity: string;
    submittingEntity: string;
    buyerIdentification: string;
    sellerIdentification: string;
    tradingDateTime: Date;
    tradingCapacity: 'DEAL' | 'MTCH' | 'AOTC';
    instrument: {
        isin: string;
        instrumentName: string;
        classification: string;
    };
    quantity: number;
    price: number;
    currency: string;
    notionalAmount: number;
    venue: string;
    country: string;
    upFrontPayment?: number;
    complexTradeComponentId?: string;
    executingEntity: string;
    submissionIndicator: 'NEWT' | 'CANC' | 'AMND';
    transactionReference: string;
    investmentDecisionMaker: string;
    tradeExecutor: string;
    flags: {
        commodityDerivativeIndicator: boolean;
        securitiesFinancingTransaction: boolean;
        shortSellingIndicator: boolean;
    };
}
/**
 * EMIR Trade Report
 * Regulatory: EU EMIR (European Market Infrastructure Regulation)
 */
interface EMIRTradeReport {
    reportId: string;
    uniqueTradeIdentifier: string;
    reportingCounterparty: string;
    otherCounterparty: string;
    tradeDate: Date;
    valueDate: Date;
    maturityDate: Date;
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    productClassification: string;
    notionalCurrency: string;
    notionalAmount: number;
    priceNotation: number;
    direction: 'BUY' | 'SELL';
    cleared: boolean;
    clearingHouse?: string;
    collateralisation: 'UNCOLLATERALISED' | 'PARTIALLY_COLLATERALISED' | 'ONE_WAY_COLLATERALISED' | 'FULLY_COLLATERALISED';
    masterAgreement: {
        type: 'ISDA' | 'CUSTOM';
        version?: string;
    };
    confirmationType: 'ELECTRONIC' | 'NON_ELECTRONIC';
    confirmationTimestamp?: Date;
    level: 'TCTN' | 'PSTN' | 'VALTN';
}
/**
 * Dodd-Frank CFTC Swap Report
 * Regulatory: US Dodd-Frank Act / CFTC
 */
interface DoddFrankSwapReport {
    reportId: string;
    uniqueSwapIdentifier: string;
    reportingParty: string;
    counterpartyId: string;
    executionTimestamp: Date;
    effectiveDate: Date;
    terminationDate: Date;
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    swapCategory: string;
    underlyingAsset: string;
    notionalAmount: number;
    notionalCurrency: string;
    fixedRate?: number;
    floatingRateIndex?: string;
    cleared: boolean;
    swapExecutionFacility?: string;
    designatedContractMarket?: string;
    blockTradeElection: boolean;
    offFacilitySwap: boolean;
    primebroker?: string;
    collateralPortfolio?: string;
    reportingLevel: 'PRIMARY' | 'SECONDARY';
}
/**
 * SEC Form 13F Report
 * Regulatory: SEC (Securities and Exchange Commission)
 */
interface SEC13FReport {
    reportId: string;
    reportingManager: {
        name: string;
        cik: string;
        address: string;
    };
    reportPeriod: {
        year: number;
        quarter: 1 | 2 | 3 | 4;
    };
    filingDate: Date;
    amendmentNumber?: number;
    holdings: Array<{
        issuerName: string;
        titleOfClass: string;
        cusip: string;
        value: number;
        sharesOrPrincipalAmount: number;
        shPrnAmtType: 'SH' | 'PRN';
        putCall?: 'PUT' | 'CALL';
        investmentDiscretion: 'SOLE' | 'SHARED' | 'NONE';
        votingAuthority: {
            sole: number;
            shared: number;
            none: number;
        };
    }>;
    totalValue: number;
    entryCount: number;
}
/**
 * SEC Form 13H Large Trader Report
 * Regulatory: SEC Rule 13h-1
 */
interface SEC13HReport {
    reportId: string;
    largeTraderIdentification: string;
    filingType: 'INITIAL' | 'ANNUAL' | 'AMENDED' | 'INACTIVE' | 'REACTIVATED' | 'TERMINATION';
    reportingDate: Date;
    largeTrader: {
        name: string;
        address: string;
        contactPerson: string;
        phoneNumber: string;
        email: string;
    };
    identifyingActivitySubmitters: Array<{
        brokerDealer: string;
        brokerDealerCRD: string;
        effectiveDate: Date;
    }>;
    aggregationMethod: 'CONSOLIDATED' | 'DISAGGREGATED';
}
/**
 * FIX Protocol Message
 * Standard: FIX 4.4 / FIX 5.0
 */
interface FIXMessage {
    header: {
        beginString: string;
        bodyLength: number;
        msgType: string;
        msgSeqNum: number;
        senderCompID: string;
        targetCompID: string;
        sendingTime: Date;
    };
    body: {
        [tag: string]: string | number | Date;
    };
    trailer: {
        checkSum: string;
    };
}
/**
 * OATS (Order Audit Trail System) Report
 * Regulatory: FINRA
 */
interface OATSReport {
    reportId: string;
    firmDesignatedId: string;
    orderEventType: 'RONR' | 'RORC' | 'RORE' | 'ROCA' | 'ROCX' | 'ROCR';
    orderEventDateTime: Date;
    timeInForce: 'DAY' | 'GTC' | 'IOC' | 'FOK' | 'GTD';
    symbol: string;
    side: 'B' | 'S' | 'SS' | 'SSE';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
    price?: number;
    accountType: 'C' | 'E' | 'A';
    specialHandlingCode?: string;
    receivingOrOpeningFirm: string;
    transmittingFirm?: string;
}
/**
 * Best Execution Report
 * Regulatory: MiFID II / SEC Regulation NMS
 */
interface BestExecutionReport {
    reportId: string;
    reportPeriod: {
        startDate: Date;
        endDate: Date;
    };
    instrument: string;
    executionVenues: Array<{
        venue: string;
        venueType: 'RM' | 'MTF' | 'OTF' | 'SI' | 'OTC';
        volumeExecuted: number;
        numberOfTrades: number;
        percentageOfVolume: number;
    }>;
    qualityMetrics: {
        averageSpread: number;
        averageSlippage: number;
        fillRate: number;
        speedOfExecution: number;
        priceImprovement: number;
        likelihoodOfExecution: number;
        sizeFilled: number;
    };
    costAnalysis: {
        explicitCosts: number;
        implicitCosts: number;
        totalCosts: number;
    };
}
/**
 * Short Selling Report
 * Regulatory: SEC Regulation SHO / EU Short Selling Regulation
 */
interface ShortSellingReport {
    reportId: string;
    reportDate: Date;
    instrument: {
        isin: string;
        ticker: string;
        name: string;
    };
    netShortPosition: number;
    percentageOfIssuedShareCapital: number;
    holder: string;
    thresholdCrossed: boolean;
    thresholdLevel: 0.2 | 0.3 | 0.4 | 0.5;
    publicDisclosureRequired: boolean;
    regulatorNotificationRequired: boolean;
    locateBorrowEvidence: {
        locateId: string;
        broker: string;
        sharesLocated: number;
        locateTimestamp: Date;
    };
}
/**
 * Position Limit Monitor
 * Regulatory: CFTC Position Limits / Exchange Limits
 */
interface PositionLimitMonitor {
    reportId: string;
    timestamp: Date;
    traderId: string;
    contract: {
        commodity: string;
        contractMonth: string;
        exchange: string;
    };
    currentPosition: {
        long: number;
        short: number;
        net: number;
        gross: number;
    };
    limits: {
        spotMonthLimit: number;
        singleMonthLimit: number;
        allMonthsLimit: number;
        accountabilityLevel?: number;
    };
    utilization: {
        spotMonthPercent: number;
        singleMonthPercent: number;
        allMonthsPercent: number;
    };
    breachStatus: boolean;
    breachType?: 'SPOT_MONTH' | 'SINGLE_MONTH' | 'ALL_MONTHS' | 'ACCOUNTABILITY';
}
/**
 * Compliance Alert
 */
interface ComplianceAlert {
    alertId: string;
    timestamp: Date;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    alertType: string;
    regulatoryRegime: 'MIFID_II' | 'EMIR' | 'DODD_FRANK' | 'SEC' | 'FINRA';
    description: string;
    affectedEntities: string[];
    recommendedAction: string;
    deadline?: Date;
    status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ESCALATED';
    assignedTo?: string;
}
/**
 * Audit Trail Entry
 */
interface AuditTrailEntry {
    entryId: string;
    timestamp: Date;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    ipAddress: string;
    sessionId: string;
    regulatoryContext?: string;
    tamperProofHash: string;
}
/**
 * Compliance Dashboard Metrics
 */
interface ComplianceDashboardMetrics {
    reportPeriod: {
        startDate: Date;
        endDate: Date;
    };
    reportingCompliance: {
        mifidIIReportsSubmitted: number;
        emirReportsSubmitted: number;
        doddFrankReportsSubmitted: number;
        secReportsSubmitted: number;
        onTimeSubmissionRate: number;
        errorRate: number;
    };
    tradingCompliance: {
        positionLimitBreaches: number;
        bestExecutionViolations: number;
        shortSellingViolations: number;
        oatsReportingErrors: number;
    };
    alertMetrics: {
        totalAlerts: number;
        criticalAlerts: number;
        openAlerts: number;
        averageResolutionTime: number;
    };
    auditMetrics: {
        totalAuditEntries: number;
        uniqueUsers: number;
        highRiskActions: number;
    };
}
/**
 * Generate MiFID II transaction report
 *
 * @param tradeData - Trade execution data
 * @returns MiFID II compliant transaction report
 *
 * @example
 * ```typescript
 * const report = generateMiFIDIITransactionReport({
 *   tradeId: 'TRD-12345',
 *   instrument: { isin: 'US0378331005', name: 'Apple Inc' },
 *   quantity: 1000,
 *   price: 150.25
 * });
 * ```
 */
export declare function generateMiFIDIITransactionReport(tradeData: {
    tradeId: string;
    tradingVenue: string;
    reportingEntity: string;
    buyerId: string;
    sellerId: string;
    executionTime: Date;
    instrument: {
        isin: string;
        name: string;
        classification: string;
    };
    quantity: number;
    price: number;
    currency: string;
    tradingCapacity: 'DEAL' | 'MTCH' | 'AOTC';
    executingEntity: string;
    investmentDecisionMaker: string;
    executor: string;
}): MiFIDIITransactionReport;
/**
 * Validate MiFID II report for regulatory compliance
 *
 * @param report - MiFID II transaction report
 * @returns Validation result with errors if any
 */
export declare function validateMiFIDIIReport(report: MiFIDIITransactionReport): {
    valid: boolean;
    errors: string[];
};
/**
 * Submit MiFID II report to regulatory authority
 *
 * @param report - MiFID II transaction report
 * @param transaction - Database transaction
 * @returns Submission confirmation with regulatory reference
 */
export declare function submitMiFIDIIReport(report: MiFIDIITransactionReport, transaction?: Transaction): Promise<{
    submitted: boolean;
    regulatoryReference: string;
    timestamp: Date;
}>;
/**
 * Generate MiFIR transparency report for post-trade publication
 *
 * @param trades - Array of trade executions
 * @returns MiFIR transparency report
 */
export declare function generateMiFIRTransparencyReport(trades: Array<{
    isin: string;
    venue: string;
    price: number;
    quantity: number;
    timestamp: Date;
    tradeType: 'ORDINARY' | 'NEGOTIATED' | 'TECHNICAL';
}>): {
    reportId: string;
    publicationTimestamp: Date;
    trades: Array<{
        isin: string;
        venue: string;
        price: number;
        quantity: number;
        timestamp: Date;
        publicationTime: Date;
        deferralApplied: boolean;
    }>;
};
/**
 * Calculate MiFID II reporting fields from raw trade data
 *
 * @param rawTrade - Raw trade execution data
 * @returns Enriched MiFID II fields
 */
export declare function calculateMiFIDIIReportingFields(rawTrade: {
    quantity: number;
    price: number;
    currency: string;
    venue: string;
    instrumentType: string;
}): {
    notionalAmount: number;
    venue: string;
    priceMultiplier: number;
    quantityNotation: string;
    venueType: 'RM' | 'MTF' | 'OTF' | 'SI';
};
/**
 * Enrich MiFID II trade data with additional regulatory fields
 *
 * @param trade - Basic trade data
 * @param enrichmentData - Additional regulatory context
 * @returns Fully enriched MiFID II trade
 */
export declare function enrichMiFIDIITradeData(trade: {
    tradeId: string;
    isin: string;
    quantity: number;
    price: number;
}, enrichmentData: {
    clientId: string;
    decisionMakerId: string;
    executorId: string;
    tradingCapacity: 'DEAL' | 'MTCH' | 'AOTC';
}): {
    enrichedTrade: {
        tradeId: string;
        isin: string;
        quantity: number;
        price: number;
        clientIdentification: string;
        investmentDecision: string;
        execution: string;
        tradingCapacity: string;
        waiver: string[];
    };
};
/**
 * Generate MiFID II XML report format for ARM submission
 *
 * @param report - MiFID II transaction report
 * @returns XML formatted report string
 */
export declare function generateMiFIDIIXMLReport(report: MiFIDIITransactionReport): string;
/**
 * Validate MiFID II timestamps for regulatory accuracy
 *
 * @param reportTimestamp - Reported execution timestamp
 * @param systemTimestamp - System capture timestamp
 * @returns Validation result with drift analysis
 */
export declare function validateMiFIDIITimestamps(reportTimestamp: Date, systemTimestamp: Date): {
    valid: boolean;
    driftMilliseconds: number;
    requiresMicrosecondPrecision: boolean;
    warning?: string;
};
/**
 * Generate EMIR trade report for derivatives
 *
 * @param tradeData - Derivative trade data
 * @returns EMIR compliant trade report
 */
export declare function generateEMIRTradeReport(tradeData: {
    uniqueTradeId: string;
    reportingCounterparty: string;
    otherCounterparty: string;
    tradeDate: Date;
    valueDate: Date;
    maturityDate: Date;
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    productType: string;
    notionalCurrency: string;
    notionalAmount: number;
    price: number;
    direction: 'BUY' | 'SELL';
    cleared: boolean;
    clearingHouse?: string;
}): EMIRTradeReport;
/**
 * Validate EMIR report for regulatory compliance
 *
 * @param report - EMIR trade report
 * @returns Validation result with errors if any
 */
export declare function validateEMIRReport(report: EMIRTradeReport): {
    valid: boolean;
    errors: string[];
};
/**
 * Submit EMIR report to trade repository
 *
 * @param report - EMIR trade report
 * @param tradeRepository - Target trade repository
 * @returns Submission confirmation
 */
export declare function submitEMIRReport(report: EMIRTradeReport, tradeRepository?: string): Promise<{
    submitted: boolean;
    repositoryReference: string;
    timestamp: Date;
    reportingStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
}>;
/**
 * Calculate EMIR reporting fields
 *
 * @param derivative - Derivative contract details
 * @returns EMIR specific fields
 */
export declare function calculateEMIRReportingFields(derivative: {
    productType: string;
    underlyingAsset: string;
    notional: number;
    currency: string;
}): {
    productClassification: string;
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    notionalAmount: number;
    underlyingIdentification: string;
};
/**
 * Generate EMIR XML report for trade repository submission
 *
 * @param report - EMIR trade report
 * @returns XML formatted report
 */
export declare function generateEMIRXMLReport(report: EMIRTradeReport): string;
/**
 * Track EMIR reporting status across lifecycle
 *
 * @param uniqueTradeId - Unique trade identifier
 * @returns Reporting status history
 */
export declare function trackEMIRReportingStatus(uniqueTradeId: string): Promise<{
    tradeId: string;
    statusHistory: Array<{
        timestamp: Date;
        reportType: 'TCTN' | 'PSTN' | 'VALTN';
        status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'AMENDED';
        repositoryReference?: string;
    }>;
    currentStatus: string;
    nextReportingDeadline?: Date;
}>;
/**
 * Generate Dodd-Frank swap report
 *
 * @param swapData - Swap transaction data
 * @returns Dodd-Frank compliant swap report
 */
export declare function generateDoddFrankReport(swapData: {
    uniqueSwapId: string;
    reportingParty: string;
    counterparty: string;
    executionTime: Date;
    effectiveDate: Date;
    terminationDate: Date;
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    swapCategory: string;
    underlying: string;
    notional: number;
    currency: string;
    cleared: boolean;
    sef?: string;
}): DoddFrankSwapReport;
/**
 * Validate CFTC swap report
 *
 * @param report - Dodd-Frank swap report
 * @returns Validation result
 */
export declare function validateCFTCReport(report: DoddFrankSwapReport): {
    valid: boolean;
    errors: string[];
};
/**
 * Submit CFTC swap report to SDR (Swap Data Repository)
 *
 * @param report - Dodd-Frank swap report
 * @param sdr - Target swap data repository
 * @returns Submission confirmation
 */
export declare function submitCFTCSwapReport(report: DoddFrankSwapReport, sdr?: string): Promise<{
    submitted: boolean;
    sdrReference: string;
    timestamp: Date;
    cftcCompliant: boolean;
}>;
/**
 * Calculate CFTC reporting fields
 *
 * @param swap - Swap contract details
 * @returns CFTC specific fields
 */
export declare function calculateCFTCReportingFields(swap: {
    productType: string;
    underlying: string;
    notional: number;
    cleared: boolean;
}): {
    assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
    swapCategory: string;
    clearingRequirement: boolean;
    tradeExecutionRequirement: boolean;
};
/**
 * Generate CFTC XML report
 *
 * @param report - Dodd-Frank swap report
 * @returns XML formatted report
 */
export declare function generateCFTCXMLReport(report: DoddFrankSwapReport): string;
/**
 * Track CFTC reporting status
 *
 * @param uniqueSwapId - Unique swap identifier
 * @returns Reporting status and compliance
 */
export declare function trackCFTCReportingStatus(uniqueSwapId: string): Promise<{
    swapId: string;
    reportingCompliance: boolean;
    lastReportDate: Date;
    nextReportingDeadline: Date;
    reportingFrequency: 'REAL_TIME' | 'END_OF_DAY' | 'MONTHLY';
    sdrConfirmations: string[];
}>;
/**
 * Generate SEC Form 13F institutional holdings report
 *
 * @param reportData - Institutional holdings data
 * @returns SEC Form 13F report
 */
export declare function generateSECForm13F(reportData: {
    managerName: string;
    managerCIK: string;
    managerAddress: string;
    reportYear: number;
    reportQuarter: 1 | 2 | 3 | 4;
    holdings: Array<{
        issuerName: string;
        titleOfClass: string;
        cusip: string;
        value: number;
        shares: number;
        putCall?: 'PUT' | 'CALL';
    }>;
}): SEC13FReport;
/**
 * Generate SEC Form 13H large trader identification
 *
 * @param traderData - Large trader information
 * @returns SEC Form 13H report
 */
export declare function generateSECForm13H(traderData: {
    largeTraderName: string;
    largeTraderAddress: string;
    contactPerson: string;
    phone: string;
    email: string;
    filingType: 'INITIAL' | 'ANNUAL' | 'AMENDED' | 'INACTIVE' | 'REACTIVATED' | 'TERMINATION';
    brokerDealers: Array<{
        name: string;
        crd: string;
        effectiveDate: Date;
    }>;
}): SEC13HReport;
/**
 * Validate SEC report for compliance
 *
 * @param report - SEC report (13F or 13H)
 * @returns Validation result
 */
export declare function validateSECReport(report: SEC13FReport | SEC13HReport): {
    valid: boolean;
    errors: string[];
};
/**
 * Submit SEC report via EDGAR system
 *
 * @param report - SEC report
 * @returns Submission confirmation
 */
export declare function submitSECReport(report: SEC13FReport | SEC13HReport): Promise<{
    submitted: boolean;
    accessionNumber: string;
    filingDate: Date;
    acceptanceStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
}>;
/**
 * Calculate SEC reporting metrics
 *
 * @param activity - Trading activity data
 * @returns Metrics for SEC reporting thresholds
 */
export declare function calculateSECReportingMetrics(activity: {
    dailyVolume: number;
    monthlyVolume: number;
    quarterlyVolume: number;
    aum: number;
}): {
    requires13F: boolean;
    requires13H: boolean;
    form13FThreshold: number;
    form13HThreshold: number;
    currentAUM: number;
    largeTraderStatus: boolean;
};
/**
 * Generate FIX New Order Single (35=D) message
 *
 * @param orderData - Order details
 * @returns FIX protocol message
 */
export declare function generateFIXNewOrderSingle(orderData: {
    clientOrderId: string;
    symbol: string;
    side: '1' | '2';
    orderQty: number;
    ordType: '1' | '2' | '3' | '4';
    price?: number;
    stopPx?: number;
    timeInForce: '0' | '1' | '3' | '4';
    account?: string;
}, senderCompID: string, targetCompID: string): FIXMessage;
/**
 * Generate FIX Execution Report (35=8) message
 *
 * @param executionData - Execution details
 * @returns FIX execution report message
 */
export declare function generateFIXExecutionReport(executionData: {
    orderID: string;
    execID: string;
    execType: '0' | '1' | '2' | 'F';
    ordStatus: '0' | '1' | '2' | '4' | '8';
    symbol: string;
    side: '1' | '2';
    leavesQty: number;
    cumQty: number;
    avgPx: number;
    lastQty?: number;
    lastPx?: number;
}, senderCompID: string, targetCompID: string): FIXMessage;
/**
 * Generate FIX Order Cancel Request (35=F) message
 *
 * @param cancelData - Cancel request details
 * @returns FIX cancel request message
 */
export declare function generateFIXOrderCancelRequest(cancelData: {
    origClOrdID: string;
    clOrdID: string;
    symbol: string;
    side: '1' | '2';
    orderQty: number;
}, senderCompID: string, targetCompID: string): FIXMessage;
/**
 * Parse FIX message from wire format
 *
 * @param fixString - FIX message string
 * @returns Parsed FIX message object
 */
export declare function parseFIXMessage(fixString: string): FIXMessage;
/**
 * Validate FIX message structure and required fields
 *
 * @param message - FIX message to validate
 * @returns Validation result
 */
export declare function validateFIXMessage(message: FIXMessage): {
    valid: boolean;
    errors: string[];
};
/**
 * Enrich FIX message with additional tags
 *
 * @param message - Base FIX message
 * @param additionalTags - Additional FIX tags to add
 * @returns Enriched FIX message
 */
export declare function enrichFIXMessageWithTags(message: FIXMessage, additionalTags: {
    [tag: string]: string | number;
}): FIXMessage;
/**
 * Generate FIX checksum (tag 10)
 *
 * @param fixMessage - FIX message without checksum
 * @returns Calculated checksum value
 */
export declare function generateFIXChecksum(fixMessage: string): string;
/**
 * Convert trade execution to FIX message
 *
 * @param trade - Trade execution data
 * @returns FIX execution report
 */
export declare function convertTradeToFIXMessage(trade: {
    tradeId: string;
    orderId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    executionTime: Date;
}, senderCompID: string, targetCompID: string): FIXMessage;
/**
 * Generate large trader position report
 *
 * @param positions - Large trader positions
 * @returns Large trader report
 */
export declare function generateLargeTraderReport(positions: Array<{
    security: string;
    quantity: number;
    value: number;
    accountType: string;
}>, traderId: string): {
    reportId: string;
    traderId: string;
    reportDate: Date;
    positions: typeof positions;
    totalValue: number;
    thresholdStatus: 'ABOVE' | 'BELOW';
};
/**
 * Track large trader threshold crossings
 *
 * @param traderId - Trader identifier
 * @param currentValue - Current position value
 * @returns Threshold monitoring result
 */
export declare function trackLargeTraderThresholds(traderId: string, currentValue: number): {
    traderId: string;
    currentValue: number;
    threshold: number;
    aboveThreshold: boolean;
    notificationRequired: boolean;
    reportingDeadline?: Date;
};
/**
 * Generate OATS (Order Audit Trail System) report
 *
 * @param orderEvent - Order event details
 * @returns OATS report
 */
export declare function generateOATSReport(orderEvent: {
    firmOrderId: string;
    eventType: 'RONR' | 'RORC' | 'RORE' | 'ROCA' | 'ROCX' | 'ROCR';
    timestamp: Date;
    symbol: string;
    side: 'B' | 'S' | 'SS' | 'SSE';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
    price?: number;
    tif: 'DAY' | 'GTC' | 'IOC' | 'FOK' | 'GTD';
    account: 'C' | 'E' | 'A';
}): OATSReport;
/**
 * Validate OATS report timestamps for accuracy
 *
 * @param report - OATS report
 * @returns Timestamp validation result
 */
export declare function validateOATSTimestamps(report: OATSReport): {
    valid: boolean;
    errors: string[];
    timestampAccuracy: 'SECOND' | 'MILLISECOND';
};
/**
 * Submit OATS report to FINRA
 *
 * @param report - OATS report
 * @returns Submission confirmation
 */
export declare function submitOATSReport(report: OATSReport): Promise<{
    submitted: boolean;
    finraReference: string;
    timestamp: Date;
    accepted: boolean;
}>;
/**
 * Generate best execution analysis report
 *
 * @param executions - Trade executions for analysis
 * @returns Best execution report
 */
export declare function generateBestExecutionReport(executions: Array<{
    orderId: string;
    symbol: string;
    venue: string;
    venueType: 'RM' | 'MTF' | 'OTF' | 'SI' | 'OTC';
    quantity: number;
    price: number;
    timestamp: Date;
    costs: {
        commission: number;
        spread: number;
        marketImpact: number;
    };
}>, reportPeriod: {
    startDate: Date;
    endDate: Date;
}): BestExecutionReport;
/**
 * Calculate execution quality metrics
 *
 * @param execution - Single trade execution
 * @param benchmark - Benchmark price (e.g., arrival price, VWAP)
 * @returns Quality metrics
 */
export declare function calculateExecutionQualityMetrics(execution: {
    executionPrice: number;
    quantity: number;
    timestamp: Date;
}, benchmark: {
    price: number;
    timestamp: Date;
}): {
    slippage: number;
    slippageBps: number;
    priceImprovement: number;
    latency: number;
    qualityScore: number;
};
/**
 * Generate short selling compliance report
 *
 * @param shortPosition - Short position details
 * @returns Short selling report
 */
export declare function generateShortSellingReport(shortPosition: {
    isin: string;
    ticker: string;
    name: string;
    netShortPosition: number;
    totalIssuedShares: number;
    holder: string;
    locateDetails: {
        locateId: string;
        broker: string;
        sharesLocated: number;
        timestamp: Date;
    };
}): ShortSellingReport;
/**
 * Validate short selling regulatory compliance
 *
 * @param trade - Short sale trade
 * @returns Compliance validation result
 */
export declare function validateShortSellingCompliance(trade: {
    symbol: string;
    side: 'SELL' | 'SHORT_SELL';
    quantity: number;
    locateId?: string;
}): {
    compliant: boolean;
    violations: string[];
    requiresLocate: boolean;
};
/**
 * Track locate/borrow requirements for short sales
 *
 * @param symbol - Security symbol
 * @param quantity - Shares to short
 * @returns Locate/borrow tracking
 */
export declare function trackLocateBorrowRequirements(symbol: string, quantity: number): {
    locateId: string;
    symbol: string;
    sharesLocated: number;
    broker: string;
    timestamp: Date;
    expirationTime: Date;
    hardToBorrow: boolean;
    borrowCost: number;
};
/**
 * Monitor position limits against regulatory thresholds
 *
 * @param position - Current position
 * @param limits - Regulatory limits
 * @returns Monitoring result
 */
export declare function monitorPositionLimits(position: {
    traderId: string;
    commodity: string;
    contractMonth: string;
    exchange: string;
    longPosition: number;
    shortPosition: number;
}, limits: {
    spotMonthLimit: number;
    singleMonthLimit: number;
    allMonthsLimit: number;
}): PositionLimitMonitor;
/**
 * Generate position limit breach alert
 *
 * @param monitor - Position limit monitor result
 * @returns Compliance alert
 */
export declare function generatePositionLimitAlert(monitor: PositionLimitMonitor): ComplianceAlert;
/**
 * Calculate aggregate positions across accounts
 *
 * @param positions - Individual account positions
 * @returns Aggregated position
 */
export declare function calculateAggregatePositions(positions: Array<{
    accountId: string;
    commodity: string;
    contractMonth: string;
    longPosition: number;
    shortPosition: number;
}>): {
    commodity: string;
    contractMonth: string;
    aggregateLong: number;
    aggregateShort: number;
    aggregateNet: number;
    aggregateGross: number;
    accountCount: number;
};
/**
 * Validate position limit compliance
 *
 * @param monitor - Position limit monitor
 * @returns Compliance validation
 */
export declare function validatePositionLimitCompliance(monitor: PositionLimitMonitor): {
    compliant: boolean;
    violations: Array<{
        limitType: string;
        limit: number;
        currentPosition: number;
        excess: number;
    }>;
};
/**
 * Generate position limit compliance report
 *
 * @param monitors - Array of position limit monitors
 * @returns Compliance report
 */
export declare function generatePositionLimitReport(monitors: PositionLimitMonitor[]): {
    reportId: string;
    reportDate: Date;
    totalPositions: number;
    breaches: number;
    warnings: number;
    compliant: number;
    details: Array<{
        traderId: string;
        commodity: string;
        status: 'BREACH' | 'WARNING' | 'COMPLIANT';
        utilizationPercent: number;
    }>;
};
/**
 * Generate compliance dashboard metrics
 *
 * @param reportPeriod - Period for metrics calculation
 * @returns Comprehensive compliance metrics
 */
export declare function generateComplianceDashboardMetrics(reportPeriod: {
    startDate: Date;
    endDate: Date;
}): Promise<ComplianceDashboardMetrics>;
/**
 * Create tamper-proof audit trail entry
 *
 * @param auditData - Audit entry data
 * @param previousHash - Hash of previous audit entry
 * @returns Audit trail entry with cryptographic hash
 */
export declare function createAuditTrailEntry(auditData: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
    }>;
    ipAddress: string;
    sessionId: string;
    regulatoryContext?: string;
}, previousHash?: string): AuditTrailEntry;
/**
 * Query audit trail with filters
 *
 * @param filters - Query filters
 * @returns Matching audit trail entries
 */
export declare function queryAuditTrail(filters: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    regulatoryContext?: string;
}): Promise<{
    entries: AuditTrailEntry[];
    totalCount: number;
    integrityVerified: boolean;
}>;
/**
 * Generate compliance alerts based on monitoring
 *
 * @param monitoringData - Real-time monitoring data
 * @returns Generated compliance alerts
 */
export declare function generateComplianceAlerts(monitoringData: {
    positionBreaches: number;
    lateReports: number;
    validationErrors: number;
    suspiciousActivity: number;
}): ComplianceAlert[];
/**
 * Calculate compliance scores across dimensions
 *
 * @param complianceData - Compliance metrics
 * @returns Compliance scores and ratings
 */
export declare function calculateComplianceScores(complianceData: {
    reportingAccuracy: number;
    timelinessRate: number;
    positionCompliance: number;
    auditFindings: number;
    violations: number;
}): {
    overallScore: number;
    rating: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
    dimensions: {
        reporting: number;
        trading: number;
        operational: number;
    };
    recommendations: string[];
};
/**
 * Export audit trail for regulatory examination
 *
 * @param exportParams - Export parameters
 * @returns Audit trail export package
 */
export declare function exportAuditTrailReport(exportParams: {
    startDate: Date;
    endDate: Date;
    format: 'CSV' | 'JSON' | 'XML';
    includeHashes: boolean;
    regulatoryContext?: string;
}): Promise<{
    exportId: string;
    timestamp: Date;
    format: string;
    recordCount: number;
    integrityVerified: boolean;
    exportData: string;
    hashChainProof?: string;
}>;
export {};
//# sourceMappingURL=regulatory-reporting-kit.d.ts.map
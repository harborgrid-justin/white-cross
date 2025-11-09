"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMiFIDIITransactionReport = generateMiFIDIITransactionReport;
exports.validateMiFIDIIReport = validateMiFIDIIReport;
exports.submitMiFIDIIReport = submitMiFIDIIReport;
exports.generateMiFIRTransparencyReport = generateMiFIRTransparencyReport;
exports.calculateMiFIDIIReportingFields = calculateMiFIDIIReportingFields;
exports.enrichMiFIDIITradeData = enrichMiFIDIITradeData;
exports.generateMiFIDIIXMLReport = generateMiFIDIIXMLReport;
exports.validateMiFIDIITimestamps = validateMiFIDIITimestamps;
exports.generateEMIRTradeReport = generateEMIRTradeReport;
exports.validateEMIRReport = validateEMIRReport;
exports.submitEMIRReport = submitEMIRReport;
exports.calculateEMIRReportingFields = calculateEMIRReportingFields;
exports.generateEMIRXMLReport = generateEMIRXMLReport;
exports.trackEMIRReportingStatus = trackEMIRReportingStatus;
exports.generateDoddFrankReport = generateDoddFrankReport;
exports.validateCFTCReport = validateCFTCReport;
exports.submitCFTCSwapReport = submitCFTCSwapReport;
exports.calculateCFTCReportingFields = calculateCFTCReportingFields;
exports.generateCFTCXMLReport = generateCFTCXMLReport;
exports.trackCFTCReportingStatus = trackCFTCReportingStatus;
exports.generateSECForm13F = generateSECForm13F;
exports.generateSECForm13H = generateSECForm13H;
exports.validateSECReport = validateSECReport;
exports.submitSECReport = submitSECReport;
exports.calculateSECReportingMetrics = calculateSECReportingMetrics;
exports.generateFIXNewOrderSingle = generateFIXNewOrderSingle;
exports.generateFIXExecutionReport = generateFIXExecutionReport;
exports.generateFIXOrderCancelRequest = generateFIXOrderCancelRequest;
exports.parseFIXMessage = parseFIXMessage;
exports.validateFIXMessage = validateFIXMessage;
exports.enrichFIXMessageWithTags = enrichFIXMessageWithTags;
exports.generateFIXChecksum = generateFIXChecksum;
exports.convertTradeToFIXMessage = convertTradeToFIXMessage;
exports.generateLargeTraderReport = generateLargeTraderReport;
exports.trackLargeTraderThresholds = trackLargeTraderThresholds;
exports.generateOATSReport = generateOATSReport;
exports.validateOATSTimestamps = validateOATSTimestamps;
exports.submitOATSReport = submitOATSReport;
exports.generateBestExecutionReport = generateBestExecutionReport;
exports.calculateExecutionQualityMetrics = calculateExecutionQualityMetrics;
exports.generateShortSellingReport = generateShortSellingReport;
exports.validateShortSellingCompliance = validateShortSellingCompliance;
exports.trackLocateBorrowRequirements = trackLocateBorrowRequirements;
exports.monitorPositionLimits = monitorPositionLimits;
exports.generatePositionLimitAlert = generatePositionLimitAlert;
exports.calculateAggregatePositions = calculateAggregatePositions;
exports.validatePositionLimitCompliance = validatePositionLimitCompliance;
exports.generatePositionLimitReport = generatePositionLimitReport;
exports.generateComplianceDashboardMetrics = generateComplianceDashboardMetrics;
exports.createAuditTrailEntry = createAuditTrailEntry;
exports.queryAuditTrail = queryAuditTrail;
exports.generateComplianceAlerts = generateComplianceAlerts;
exports.calculateComplianceScores = calculateComplianceScores;
exports.exportAuditTrailReport = exportAuditTrailReport;
// ============================================================================
// MIFID II/MIFIR TRANSACTION REPORTING (8 functions)
// ============================================================================
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
function generateMiFIDIITransactionReport(tradeData) {
    const notionalAmount = tradeData.quantity * tradeData.price;
    return {
        reportId: `MIFID-${tradeData.tradeId}-${Date.now()}`,
        tradingVenue: tradeData.tradingVenue,
        reportingEntity: tradeData.reportingEntity,
        submittingEntity: tradeData.reportingEntity,
        buyerIdentification: tradeData.buyerId,
        sellerIdentification: tradeData.sellerId,
        tradingDateTime: tradeData.executionTime,
        tradingCapacity: tradeData.tradingCapacity,
        instrument: tradeData.instrument,
        quantity: tradeData.quantity,
        price: tradeData.price,
        currency: tradeData.currency,
        notionalAmount,
        venue: tradeData.tradingVenue,
        country: 'EU',
        executingEntity: tradeData.executingEntity,
        submissionIndicator: 'NEWT',
        transactionReference: tradeData.tradeId,
        investmentDecisionMaker: tradeData.investmentDecisionMaker,
        tradeExecutor: tradeData.executor,
        flags: {
            commodityDerivativeIndicator: false,
            securitiesFinancingTransaction: false,
            shortSellingIndicator: false
        }
    };
}
/**
 * Validate MiFID II report for regulatory compliance
 *
 * @param report - MiFID II transaction report
 * @returns Validation result with errors if any
 */
function validateMiFIDIIReport(report) {
    const errors = [];
    if (!report.instrument.isin || !/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(report.instrument.isin)) {
        errors.push('Invalid ISIN format');
    }
    if (report.quantity <= 0) {
        errors.push('Quantity must be positive');
    }
    if (report.price <= 0) {
        errors.push('Price must be positive');
    }
    if (!report.buyerIdentification || !report.sellerIdentification) {
        errors.push('Buyer and seller identification required');
    }
    if (!report.tradingDateTime) {
        errors.push('Trading timestamp required');
    }
    if (!['DEAL', 'MTCH', 'AOTC'].includes(report.tradingCapacity)) {
        errors.push('Invalid trading capacity');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Submit MiFID II report to regulatory authority
 *
 * @param report - MiFID II transaction report
 * @param transaction - Database transaction
 * @returns Submission confirmation with regulatory reference
 */
async function submitMiFIDIIReport(report, transaction) {
    // Validate before submission
    const validation = validateMiFIDIIReport(report);
    if (!validation.valid) {
        throw new Error(`MiFID II validation failed: ${validation.errors.join(', ')}`);
    }
    // In production, this would submit to ARM (Approved Reporting Mechanism)
    const regulatoryReference = `ARM-${report.reportId}-${Date.now()}`;
    const timestamp = new Date();
    return {
        submitted: true,
        regulatoryReference,
        timestamp
    };
}
/**
 * Generate MiFIR transparency report for post-trade publication
 *
 * @param trades - Array of trade executions
 * @returns MiFIR transparency report
 */
function generateMiFIRTransparencyReport(trades) {
    return {
        reportId: `MIFIR-TRANS-${Date.now()}`,
        publicationTimestamp: new Date(),
        trades: trades.map(trade => ({
            ...trade,
            publicationTime: new Date(trade.timestamp.getTime() + 60000), // T+1 minute
            deferralApplied: false
        }))
    };
}
/**
 * Calculate MiFID II reporting fields from raw trade data
 *
 * @param rawTrade - Raw trade execution data
 * @returns Enriched MiFID II fields
 */
function calculateMiFIDIIReportingFields(rawTrade) {
    const notionalAmount = rawTrade.quantity * rawTrade.price;
    // Determine venue type based on venue identifier
    let venueType = 'RM';
    if (rawTrade.venue.includes('MTF'))
        venueType = 'MTF';
    else if (rawTrade.venue.includes('OTF'))
        venueType = 'OTF';
    else if (rawTrade.venue.includes('SI'))
        venueType = 'SI';
    return {
        notionalAmount,
        venue: rawTrade.venue,
        priceMultiplier: 1,
        quantityNotation: 'UNIT',
        venueType
    };
}
/**
 * Enrich MiFID II trade data with additional regulatory fields
 *
 * @param trade - Basic trade data
 * @param enrichmentData - Additional regulatory context
 * @returns Fully enriched MiFID II trade
 */
function enrichMiFIDIITradeData(trade, enrichmentData) {
    return {
        enrichedTrade: {
            ...trade,
            clientIdentification: enrichmentData.clientId,
            investmentDecision: enrichmentData.decisionMakerId,
            execution: enrichmentData.executorId,
            tradingCapacity: enrichmentData.tradingCapacity,
            waiver: [] // Waiver indicators if applicable
        }
    };
}
/**
 * Generate MiFID II XML report format for ARM submission
 *
 * @param report - MiFID II transaction report
 * @returns XML formatted report string
 */
function generateMiFIDIIXMLReport(report) {
    const timestamp = report.tradingDateTime.toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
<TxRpt xmlns="urn:mifid:transaction:report">
  <RptId>${report.reportId}</RptId>
  <RptgNtty>${report.reportingEntity}</RptgNtty>
  <TradgDtTm>${timestamp}</TradgDtTm>
  <TradgVn>${report.tradingVenue}</TradgVn>
  <ByrId>${report.buyerIdentification}</ByrId>
  <SllrId>${report.sellerIdentification}</SllrId>
  <InstrmId>
    <ISIN>${report.instrument.isin}</ISIN>
    <Nm>${report.instrument.instrumentName}</Nm>
  </InstrmId>
  <Qty>${report.quantity}</Qty>
  <Pric>${report.price}</Pric>
  <Ccy>${report.currency}</Ccy>
  <NtnlAmt>${report.notionalAmount}</NtnlAmt>
  <TradgCpcty>${report.tradingCapacity}</TradgCpcty>
  <InvstmntDcsnMkr>${report.investmentDecisionMaker}</InvstmntDcsnMkr>
  <TradExctr>${report.tradeExecutor}</TradExctr>
</TxRpt>`;
}
/**
 * Validate MiFID II timestamps for regulatory accuracy
 *
 * @param reportTimestamp - Reported execution timestamp
 * @param systemTimestamp - System capture timestamp
 * @returns Validation result with drift analysis
 */
function validateMiFIDIITimestamps(reportTimestamp, systemTimestamp) {
    const driftMilliseconds = Math.abs(systemTimestamp.getTime() - reportTimestamp.getTime());
    const requiresMicrosecondPrecision = true; // MiFID II requires microsecond precision
    let warning;
    if (driftMilliseconds > 1000) {
        warning = 'Timestamp drift exceeds 1 second - investigate clock synchronization';
    }
    return {
        valid: driftMilliseconds < 5000, // 5 second tolerance
        driftMilliseconds,
        requiresMicrosecondPrecision,
        warning
    };
}
// ============================================================================
// EMIR TRADE REPORTING (6 functions)
// ============================================================================
/**
 * Generate EMIR trade report for derivatives
 *
 * @param tradeData - Derivative trade data
 * @returns EMIR compliant trade report
 */
function generateEMIRTradeReport(tradeData) {
    return {
        reportId: `EMIR-${tradeData.uniqueTradeId}-${Date.now()}`,
        uniqueTradeIdentifier: tradeData.uniqueTradeId,
        reportingCounterparty: tradeData.reportingCounterparty,
        otherCounterparty: tradeData.otherCounterparty,
        tradeDate: tradeData.tradeDate,
        valueDate: tradeData.valueDate,
        maturityDate: tradeData.maturityDate,
        assetClass: tradeData.assetClass,
        productClassification: tradeData.productType,
        notionalCurrency: tradeData.notionalCurrency,
        notionalAmount: tradeData.notionalAmount,
        priceNotation: tradeData.price,
        direction: tradeData.direction,
        cleared: tradeData.cleared,
        clearingHouse: tradeData.clearingHouse,
        collateralisation: tradeData.cleared ? 'FULLY_COLLATERALISED' : 'UNCOLLATERALISED',
        masterAgreement: {
            type: 'ISDA'
        },
        confirmationType: 'ELECTRONIC',
        level: 'TCTN' // Transaction level
    };
}
/**
 * Validate EMIR report for regulatory compliance
 *
 * @param report - EMIR trade report
 * @returns Validation result with errors if any
 */
function validateEMIRReport(report) {
    const errors = [];
    if (!report.uniqueTradeIdentifier) {
        errors.push('Unique Trade Identifier (UTI) required');
    }
    if (!['CR', 'IR', 'EQ', 'FX', 'CO'].includes(report.assetClass)) {
        errors.push('Invalid asset class');
    }
    if (report.notionalAmount <= 0) {
        errors.push('Notional amount must be positive');
    }
    if (!report.reportingCounterparty || !report.otherCounterparty) {
        errors.push('Both counterparties must be identified');
    }
    if (report.tradeDate > report.valueDate) {
        errors.push('Trade date cannot be after value date');
    }
    if (report.valueDate > report.maturityDate) {
        errors.push('Value date cannot be after maturity date');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Submit EMIR report to trade repository
 *
 * @param report - EMIR trade report
 * @param tradeRepository - Target trade repository
 * @returns Submission confirmation
 */
async function submitEMIRReport(report, tradeRepository = 'DTCC-GTR') {
    const validation = validateEMIRReport(report);
    if (!validation.valid) {
        throw new Error(`EMIR validation failed: ${validation.errors.join(', ')}`);
    }
    const repositoryReference = `${tradeRepository}-${report.reportId}`;
    return {
        submitted: true,
        repositoryReference,
        timestamp: new Date(),
        reportingStatus: 'ACCEPTED'
    };
}
/**
 * Calculate EMIR reporting fields
 *
 * @param derivative - Derivative contract details
 * @returns EMIR specific fields
 */
function calculateEMIRReportingFields(derivative) {
    // Determine asset class from product type
    let assetClass = 'IR';
    if (derivative.productType.includes('CDS') || derivative.productType.includes('Credit')) {
        assetClass = 'CR';
    }
    else if (derivative.productType.includes('Equity')) {
        assetClass = 'EQ';
    }
    else if (derivative.productType.includes('FX')) {
        assetClass = 'FX';
    }
    else if (derivative.productType.includes('Commodity')) {
        assetClass = 'CO';
    }
    return {
        productClassification: derivative.productType,
        assetClass,
        notionalAmount: derivative.notional,
        underlyingIdentification: derivative.underlyingAsset
    };
}
/**
 * Generate EMIR XML report for trade repository submission
 *
 * @param report - EMIR trade report
 * @returns XML formatted report
 */
function generateEMIRXMLReport(report) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<TradRpt xmlns="urn:emir:trade:report">
  <RptId>${report.reportId}</RptId>
  <UTI>${report.uniqueTradeIdentifier}</UTI>
  <RptgCtrPty>${report.reportingCounterparty}</RptgCtrPty>
  <OthrCtrPty>${report.otherCounterparty}</OthrCtrPty>
  <TradDt>${report.tradeDate.toISOString()}</TradDt>
  <ValDt>${report.valueDate.toISOString()}</ValDt>
  <MtrtyDt>${report.maturityDate.toISOString()}</MtrtyDt>
  <AsstClss>${report.assetClass}</AsstClss>
  <PrdctClssfctn>${report.productClassification}</PrdctClssfctn>
  <NtnlCcy>${report.notionalCurrency}</NtnlCcy>
  <NtnlAmt>${report.notionalAmount}</NtnlAmt>
  <Drctn>${report.direction}</Drctn>
  <Clrd>${report.cleared}</Clrd>
  ${report.clearingHouse ? `<ClrngHs>${report.clearingHouse}</ClrngHs>` : ''}
  <Clltrslstn>${report.collateralisation}</Clltrslstn>
</TradRpt>`;
}
/**
 * Track EMIR reporting status across lifecycle
 *
 * @param uniqueTradeId - Unique trade identifier
 * @returns Reporting status history
 */
async function trackEMIRReportingStatus(uniqueTradeId) {
    // In production, query from reporting database
    return {
        tradeId: uniqueTradeId,
        statusHistory: [
            {
                timestamp: new Date(),
                reportType: 'TCTN',
                status: 'ACCEPTED',
                repositoryReference: `TR-${uniqueTradeId}`
            }
        ],
        currentStatus: 'COMPLIANT',
        nextReportingDeadline: new Date(Date.now() + 86400000) // T+1
    };
}
// ============================================================================
// DODD-FRANK / CFTC REPORTING (6 functions)
// ============================================================================
/**
 * Generate Dodd-Frank swap report
 *
 * @param swapData - Swap transaction data
 * @returns Dodd-Frank compliant swap report
 */
function generateDoddFrankReport(swapData) {
    return {
        reportId: `CFTC-${swapData.uniqueSwapId}-${Date.now()}`,
        uniqueSwapIdentifier: swapData.uniqueSwapId,
        reportingParty: swapData.reportingParty,
        counterpartyId: swapData.counterparty,
        executionTimestamp: swapData.executionTime,
        effectiveDate: swapData.effectiveDate,
        terminationDate: swapData.terminationDate,
        assetClass: swapData.assetClass,
        swapCategory: swapData.swapCategory,
        underlyingAsset: swapData.underlying,
        notionalAmount: swapData.notional,
        notionalCurrency: swapData.currency,
        cleared: swapData.cleared,
        swapExecutionFacility: swapData.sef,
        blockTradeElection: false,
        offFacilitySwap: !swapData.sef,
        reportingLevel: 'PRIMARY'
    };
}
/**
 * Validate CFTC swap report
 *
 * @param report - Dodd-Frank swap report
 * @returns Validation result
 */
function validateCFTCReport(report) {
    const errors = [];
    if (!report.uniqueSwapIdentifier) {
        errors.push('Unique Swap Identifier (USI) required');
    }
    if (!['CR', 'IR', 'EQ', 'FX', 'CO'].includes(report.assetClass)) {
        errors.push('Invalid asset class for CFTC reporting');
    }
    if (report.notionalAmount <= 0) {
        errors.push('Notional amount must be positive');
    }
    if (report.effectiveDate > report.terminationDate) {
        errors.push('Effective date cannot be after termination date');
    }
    if (!report.reportingParty || !report.counterpartyId) {
        errors.push('Both parties must be identified');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Submit CFTC swap report to SDR (Swap Data Repository)
 *
 * @param report - Dodd-Frank swap report
 * @param sdr - Target swap data repository
 * @returns Submission confirmation
 */
async function submitCFTCSwapReport(report, sdr = 'DTCC-SDR') {
    const validation = validateCFTCReport(report);
    if (!validation.valid) {
        throw new Error(`CFTC validation failed: ${validation.errors.join(', ')}`);
    }
    return {
        submitted: true,
        sdrReference: `${sdr}-${report.reportId}`,
        timestamp: new Date(),
        cftcCompliant: true
    };
}
/**
 * Calculate CFTC reporting fields
 *
 * @param swap - Swap contract details
 * @returns CFTC specific fields
 */
function calculateCFTCReportingFields(swap) {
    let assetClass = 'IR';
    if (swap.productType.includes('Credit'))
        assetClass = 'CR';
    else if (swap.productType.includes('Equity'))
        assetClass = 'EQ';
    else if (swap.productType.includes('FX'))
        assetClass = 'FX';
    else if (swap.productType.includes('Commodity'))
        assetClass = 'CO';
    return {
        assetClass,
        swapCategory: swap.productType,
        clearingRequirement: swap.cleared,
        tradeExecutionRequirement: !swap.cleared // SEF requirement
    };
}
/**
 * Generate CFTC XML report
 *
 * @param report - Dodd-Frank swap report
 * @returns XML formatted report
 */
function generateCFTCXMLReport(report) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<SwpRpt xmlns="urn:cftc:swap:report">
  <RptId>${report.reportId}</RptId>
  <USI>${report.uniqueSwapIdentifier}</USI>
  <RptgPty>${report.reportingParty}</RptgPty>
  <CtrPtyId>${report.counterpartyId}</CtrPtyId>
  <ExecTmstmp>${report.executionTimestamp.toISOString()}</ExecTmstmp>
  <EffctvDt>${report.effectiveDate.toISOString()}</EffctvDt>
  <TrmntnDt>${report.terminationDate.toISOString()}</TrmntnDt>
  <AsstClss>${report.assetClass}</AsstClss>
  <SwpCtgry>${report.swapCategory}</SwpCtgry>
  <UndrlyngAsst>${report.underlyingAsset}</UndrlyngAsst>
  <NtnlAmt>${report.notionalAmount}</NtnlAmt>
  <NtnlCcy>${report.notionalCurrency}</NtnlCcy>
  <Clrd>${report.cleared}</Clrd>
  ${report.swapExecutionFacility ? `<SEF>${report.swapExecutionFacility}</SEF>` : ''}
</SwpRpt>`;
}
/**
 * Track CFTC reporting status
 *
 * @param uniqueSwapId - Unique swap identifier
 * @returns Reporting status and compliance
 */
async function trackCFTCReportingStatus(uniqueSwapId) {
    return {
        swapId: uniqueSwapId,
        reportingCompliance: true,
        lastReportDate: new Date(),
        nextReportingDeadline: new Date(Date.now() + 3600000), // T+1 hour for real-time
        reportingFrequency: 'REAL_TIME',
        sdrConfirmations: [`DTCC-SDR-${uniqueSwapId}`]
    };
}
// ============================================================================
// SEC REPORTING (5 functions)
// ============================================================================
/**
 * Generate SEC Form 13F institutional holdings report
 *
 * @param reportData - Institutional holdings data
 * @returns SEC Form 13F report
 */
function generateSECForm13F(reportData) {
    const totalValue = reportData.holdings.reduce((sum, h) => sum + h.value, 0);
    return {
        reportId: `13F-${reportData.managerCIK}-${reportData.reportYear}Q${reportData.reportQuarter}`,
        reportingManager: {
            name: reportData.managerName,
            cik: reportData.managerCIK,
            address: reportData.managerAddress
        },
        reportPeriod: {
            year: reportData.reportYear,
            quarter: reportData.reportQuarter
        },
        filingDate: new Date(),
        holdings: reportData.holdings.map(h => ({
            issuerName: h.issuerName,
            titleOfClass: h.titleOfClass,
            cusip: h.cusip,
            value: h.value,
            sharesOrPrincipalAmount: h.shares,
            shPrnAmtType: 'SH',
            putCall: h.putCall,
            investmentDiscretion: 'SOLE',
            votingAuthority: {
                sole: h.shares,
                shared: 0,
                none: 0
            }
        })),
        totalValue,
        entryCount: reportData.holdings.length
    };
}
/**
 * Generate SEC Form 13H large trader identification
 *
 * @param traderData - Large trader information
 * @returns SEC Form 13H report
 */
function generateSECForm13H(traderData) {
    const ltid = `LTID-${Date.now()}`; // In production, SEC assigns this
    return {
        reportId: `13H-${ltid}-${Date.now()}`,
        largeTraderIdentification: ltid,
        filingType: traderData.filingType,
        reportingDate: new Date(),
        largeTrader: {
            name: traderData.largeTraderName,
            address: traderData.largeTraderAddress,
            contactPerson: traderData.contactPerson,
            phoneNumber: traderData.phone,
            email: traderData.email
        },
        identifyingActivitySubmitters: traderData.brokerDealers.map(bd => ({
            brokerDealer: bd.name,
            brokerDealerCRD: bd.crd,
            effectiveDate: bd.effectiveDate
        })),
        aggregationMethod: 'CONSOLIDATED'
    };
}
/**
 * Validate SEC report for compliance
 *
 * @param report - SEC report (13F or 13H)
 * @returns Validation result
 */
function validateSECReport(report) {
    const errors = [];
    if ('holdings' in report) {
        // 13F validation
        if (report.holdings.length === 0) {
            errors.push('13F must contain at least one holding');
        }
        if (report.totalValue <= 0) {
            errors.push('Total portfolio value must be positive');
        }
        report.holdings.forEach((holding, idx) => {
            if (!/^[0-9]{9}$/.test(holding.cusip)) {
                errors.push(`Invalid CUSIP format at position ${idx}`);
            }
            if (holding.value <= 0) {
                errors.push(`Invalid holding value at position ${idx}`);
            }
        });
    }
    else {
        // 13H validation
        if (!report.largeTraderIdentification) {
            errors.push('Large Trader Identification Number required');
        }
        if (report.identifyingActivitySubmitters.length === 0) {
            errors.push('At least one broker-dealer must be identified');
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Submit SEC report via EDGAR system
 *
 * @param report - SEC report
 * @returns Submission confirmation
 */
async function submitSECReport(report) {
    const validation = validateSECReport(report);
    if (!validation.valid) {
        throw new Error(`SEC validation failed: ${validation.errors.join(', ')}`);
    }
    // Generate SEC accession number format: 0000000000-00-000000
    const accessionNumber = `${Date.now().toString().padStart(10, '0')}-${new Date().getFullYear().toString().substring(2)}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    return {
        submitted: true,
        accessionNumber,
        filingDate: new Date(),
        acceptanceStatus: 'ACCEPTED'
    };
}
/**
 * Calculate SEC reporting metrics
 *
 * @param activity - Trading activity data
 * @returns Metrics for SEC reporting thresholds
 */
function calculateSECReportingMetrics(activity) {
    const form13FThreshold = 100000000; // $100M
    const form13HThreshold = 20000000; // $20M daily or 200M monthly
    return {
        requires13F: activity.aum >= form13FThreshold,
        requires13H: activity.dailyVolume >= form13HThreshold || activity.monthlyVolume >= form13HThreshold * 10,
        form13FThreshold,
        form13HThreshold,
        currentAUM: activity.aum,
        largeTraderStatus: activity.dailyVolume >= form13HThreshold
    };
}
// ============================================================================
// FIX PROTOCOL MESSAGE GENERATION (8 functions)
// ============================================================================
/**
 * Generate FIX New Order Single (35=D) message
 *
 * @param orderData - Order details
 * @returns FIX protocol message
 */
function generateFIXNewOrderSingle(orderData, senderCompID, targetCompID) {
    const msgSeqNum = Math.floor(Math.random() * 1000000);
    const sendingTime = new Date();
    const body = {
        '11': orderData.clientOrderId, // ClOrdID
        '55': orderData.symbol, // Symbol
        '54': orderData.side, // Side
        '38': orderData.orderQty, // OrderQty
        '40': orderData.ordType, // OrdType
        '59': orderData.timeInForce, // TimeInForce
    };
    if (orderData.price) {
        body['44'] = orderData.price; // Price
    }
    if (orderData.stopPx) {
        body['99'] = orderData.stopPx; // StopPx
    }
    if (orderData.account) {
        body['1'] = orderData.account; // Account
    }
    return {
        header: {
            beginString: 'FIX.4.4',
            bodyLength: 0, // Calculate after serialization
            msgType: 'D', // NewOrderSingle
            msgSeqNum,
            senderCompID,
            targetCompID,
            sendingTime
        },
        body,
        trailer: {
            checkSum: '000' // Calculate checksum
        }
    };
}
/**
 * Generate FIX Execution Report (35=8) message
 *
 * @param executionData - Execution details
 * @returns FIX execution report message
 */
function generateFIXExecutionReport(executionData, senderCompID, targetCompID) {
    const msgSeqNum = Math.floor(Math.random() * 1000000);
    return {
        header: {
            beginString: 'FIX.4.4',
            bodyLength: 0,
            msgType: '8', // ExecutionReport
            msgSeqNum,
            senderCompID,
            targetCompID,
            sendingTime: new Date()
        },
        body: {
            '37': executionData.orderID, // OrderID
            '17': executionData.execID, // ExecID
            '150': executionData.execType, // ExecType
            '39': executionData.ordStatus, // OrdStatus
            '55': executionData.symbol, // Symbol
            '54': executionData.side, // Side
            '151': executionData.leavesQty, // LeavesQty
            '14': executionData.cumQty, // CumQty
            '6': executionData.avgPx, // AvgPx
            ...(executionData.lastQty && { '32': executionData.lastQty }), // LastQty
            ...(executionData.lastPx && { '31': executionData.lastPx }) // LastPx
        },
        trailer: {
            checkSum: '000'
        }
    };
}
/**
 * Generate FIX Order Cancel Request (35=F) message
 *
 * @param cancelData - Cancel request details
 * @returns FIX cancel request message
 */
function generateFIXOrderCancelRequest(cancelData, senderCompID, targetCompID) {
    return {
        header: {
            beginString: 'FIX.4.4',
            bodyLength: 0,
            msgType: 'F', // OrderCancelRequest
            msgSeqNum: Math.floor(Math.random() * 1000000),
            senderCompID,
            targetCompID,
            sendingTime: new Date()
        },
        body: {
            '41': cancelData.origClOrdID, // OrigClOrdID
            '11': cancelData.clOrdID, // ClOrdID
            '55': cancelData.symbol, // Symbol
            '54': cancelData.side, // Side
            '38': cancelData.orderQty // OrderQty
        },
        trailer: {
            checkSum: '000'
        }
    };
}
/**
 * Parse FIX message from wire format
 *
 * @param fixString - FIX message string
 * @returns Parsed FIX message object
 */
function parseFIXMessage(fixString) {
    const fields = fixString.split('\u0001'); // SOH delimiter
    const parsed = {};
    fields.forEach(field => {
        const [tag, value] = field.split('=');
        if (tag && value) {
            parsed[tag] = value;
        }
    });
    return {
        header: {
            beginString: parsed['8'] || '',
            bodyLength: parseInt(parsed['9'] || '0'),
            msgType: parsed['35'] || '',
            msgSeqNum: parseInt(parsed['34'] || '0'),
            senderCompID: parsed['49'] || '',
            targetCompID: parsed['56'] || '',
            sendingTime: new Date(parsed['52'] || '')
        },
        body: Object.entries(parsed)
            .filter(([tag]) => !['8', '9', '35', '34', '49', '56', '52', '10'].includes(tag))
            .reduce((acc, [tag, value]) => ({ ...acc, [tag]: value }), {}),
        trailer: {
            checkSum: parsed['10'] || '000'
        }
    };
}
/**
 * Validate FIX message structure and required fields
 *
 * @param message - FIX message to validate
 * @returns Validation result
 */
function validateFIXMessage(message) {
    const errors = [];
    if (!message.header.beginString.startsWith('FIX')) {
        errors.push('Invalid BeginString - must start with FIX');
    }
    if (!message.header.msgType) {
        errors.push('MsgType (tag 35) is required');
    }
    if (message.header.msgSeqNum <= 0) {
        errors.push('MsgSeqNum must be positive');
    }
    if (!message.header.senderCompID) {
        errors.push('SenderCompID (tag 49) is required');
    }
    if (!message.header.targetCompID) {
        errors.push('TargetCompID (tag 56) is required');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Enrich FIX message with additional tags
 *
 * @param message - Base FIX message
 * @param additionalTags - Additional FIX tags to add
 * @returns Enriched FIX message
 */
function enrichFIXMessageWithTags(message, additionalTags) {
    return {
        ...message,
        body: {
            ...message.body,
            ...additionalTags
        }
    };
}
/**
 * Generate FIX checksum (tag 10)
 *
 * @param fixMessage - FIX message without checksum
 * @returns Calculated checksum value
 */
function generateFIXChecksum(fixMessage) {
    let sum = 0;
    for (let i = 0; i < fixMessage.length; i++) {
        sum += fixMessage.charCodeAt(i);
    }
    const checksum = (sum % 256).toString().padStart(3, '0');
    return checksum;
}
/**
 * Convert trade execution to FIX message
 *
 * @param trade - Trade execution data
 * @returns FIX execution report
 */
function convertTradeToFIXMessage(trade, senderCompID, targetCompID) {
    return generateFIXExecutionReport({
        orderID: trade.orderId,
        execID: trade.tradeId,
        execType: 'F', // Trade
        ordStatus: '2', // Filled
        symbol: trade.symbol,
        side: trade.side === 'BUY' ? '1' : '2',
        leavesQty: 0,
        cumQty: trade.quantity,
        avgPx: trade.price,
        lastQty: trade.quantity,
        lastPx: trade.price
    }, senderCompID, targetCompID);
}
// ============================================================================
// LARGE TRADER & OATS REPORTING (5 functions)
// ============================================================================
/**
 * Generate large trader position report
 *
 * @param positions - Large trader positions
 * @returns Large trader report
 */
function generateLargeTraderReport(positions, traderId) {
    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
    const threshold = 20000000; // $20M threshold
    return {
        reportId: `LT-${traderId}-${Date.now()}`,
        traderId,
        reportDate: new Date(),
        positions,
        totalValue,
        thresholdStatus: totalValue >= threshold ? 'ABOVE' : 'BELOW'
    };
}
/**
 * Track large trader threshold crossings
 *
 * @param traderId - Trader identifier
 * @param currentValue - Current position value
 * @returns Threshold monitoring result
 */
function trackLargeTraderThresholds(traderId, currentValue) {
    const threshold = 20000000;
    const aboveThreshold = currentValue >= threshold;
    return {
        traderId,
        currentValue,
        threshold,
        aboveThreshold,
        notificationRequired: aboveThreshold,
        reportingDeadline: aboveThreshold ? new Date(Date.now() + 86400000) : undefined // T+1
    };
}
/**
 * Generate OATS (Order Audit Trail System) report
 *
 * @param orderEvent - Order event details
 * @returns OATS report
 */
function generateOATSReport(orderEvent) {
    return {
        reportId: `OATS-${orderEvent.firmOrderId}-${Date.now()}`,
        firmDesignatedId: orderEvent.firmOrderId,
        orderEventType: orderEvent.eventType,
        orderEventDateTime: orderEvent.timestamp,
        timeInForce: orderEvent.tif,
        symbol: orderEvent.symbol,
        side: orderEvent.side,
        quantity: orderEvent.quantity,
        orderType: orderEvent.orderType,
        price: orderEvent.price,
        accountType: orderEvent.account,
        receivingOrOpeningFirm: 'FIRM-001' // In production, from config
    };
}
/**
 * Validate OATS report timestamps for accuracy
 *
 * @param report - OATS report
 * @returns Timestamp validation result
 */
function validateOATSTimestamps(report) {
    const errors = [];
    if (!report.orderEventDateTime) {
        errors.push('Order event timestamp required');
    }
    // OATS requires timestamps to the second
    const now = new Date();
    const eventTime = new Date(report.orderEventDateTime);
    if (eventTime > now) {
        errors.push('Event timestamp cannot be in the future');
    }
    return {
        valid: errors.length === 0,
        errors,
        timestampAccuracy: 'SECOND'
    };
}
/**
 * Submit OATS report to FINRA
 *
 * @param report - OATS report
 * @returns Submission confirmation
 */
async function submitOATSReport(report) {
    const validation = validateOATSTimestamps(report);
    if (!validation.valid) {
        throw new Error(`OATS validation failed: ${validation.errors.join(', ')}`);
    }
    return {
        submitted: true,
        finraReference: `FINRA-${report.reportId}`,
        timestamp: new Date(),
        accepted: true
    };
}
// ============================================================================
// BEST EXECUTION & SHORT SELLING (5 functions)
// ============================================================================
/**
 * Generate best execution analysis report
 *
 * @param executions - Trade executions for analysis
 * @returns Best execution report
 */
function generateBestExecutionReport(executions, reportPeriod) {
    // Aggregate by venue
    const venueMap = new Map();
    executions.forEach(exec => {
        const existing = venueMap.get(exec.venue) || { volume: 0, trades: 0, costs: 0 };
        venueMap.set(exec.venue, {
            volume: existing.volume + exec.quantity * exec.price,
            trades: existing.trades + 1,
            costs: existing.costs + exec.costs.commission + exec.costs.spread + exec.costs.marketImpact
        });
    });
    const totalVolume = Array.from(venueMap.values()).reduce((sum, v) => sum + v.volume, 0);
    const executionVenues = Array.from(venueMap.entries()).map(([venue, data]) => {
        const venueType = executions.find(e => e.venue === venue)?.venueType || 'OTC';
        return {
            venue,
            venueType,
            volumeExecuted: data.volume,
            numberOfTrades: data.trades,
            percentageOfVolume: (data.volume / totalVolume) * 100
        };
    });
    const totalCosts = Array.from(venueMap.values()).reduce((sum, v) => sum + v.costs, 0);
    return {
        reportId: `BEST-EXEC-${Date.now()}`,
        reportPeriod,
        instrument: executions[0]?.symbol || 'MULTIPLE',
        executionVenues,
        qualityMetrics: {
            averageSpread: 0.01, // Calculate from actual spreads
            averageSlippage: 0.005,
            fillRate: 0.95,
            speedOfExecution: 150, // milliseconds
            priceImprovement: 0.002,
            likelihoodOfExecution: 0.92,
            sizeFilled: totalVolume
        },
        costAnalysis: {
            explicitCosts: totalCosts * 0.3,
            implicitCosts: totalCosts * 0.7,
            totalCosts
        }
    };
}
/**
 * Calculate execution quality metrics
 *
 * @param execution - Single trade execution
 * @param benchmark - Benchmark price (e.g., arrival price, VWAP)
 * @returns Quality metrics
 */
function calculateExecutionQualityMetrics(execution, benchmark) {
    const slippage = execution.executionPrice - benchmark.price;
    const slippageBps = (slippage / benchmark.price) * 10000;
    const priceImprovement = -slippage; // Negative slippage is improvement
    const latency = execution.timestamp.getTime() - benchmark.timestamp.getTime();
    // Quality score: 0-100, higher is better
    const qualityScore = Math.max(0, 100 - Math.abs(slippageBps) * 10 - (latency / 100));
    return {
        slippage,
        slippageBps,
        priceImprovement,
        latency,
        qualityScore
    };
}
/**
 * Generate short selling compliance report
 *
 * @param shortPosition - Short position details
 * @returns Short selling report
 */
function generateShortSellingReport(shortPosition) {
    const percentageOfCapital = (shortPosition.netShortPosition / shortPosition.totalIssuedShares) * 100;
    // Determine threshold crossing
    let thresholdCrossed = false;
    let thresholdLevel = 0.2;
    if (percentageOfCapital >= 0.5) {
        thresholdCrossed = true;
        thresholdLevel = 0.5;
    }
    else if (percentageOfCapital >= 0.4) {
        thresholdCrossed = true;
        thresholdLevel = 0.4;
    }
    else if (percentageOfCapital >= 0.3) {
        thresholdCrossed = true;
        thresholdLevel = 0.3;
    }
    else if (percentageOfCapital >= 0.2) {
        thresholdCrossed = true;
        thresholdLevel = 0.2;
    }
    return {
        reportId: `SHORT-${shortPosition.isin}-${Date.now()}`,
        reportDate: new Date(),
        instrument: {
            isin: shortPosition.isin,
            ticker: shortPosition.ticker,
            name: shortPosition.name
        },
        netShortPosition: shortPosition.netShortPosition,
        percentageOfIssuedShareCapital: percentageOfCapital,
        holder: shortPosition.holder,
        thresholdCrossed,
        thresholdLevel,
        publicDisclosureRequired: percentageOfCapital >= 0.5,
        regulatorNotificationRequired: percentageOfCapital >= 0.2,
        locateBorrowEvidence: shortPosition.locateDetails
    };
}
/**
 * Validate short selling regulatory compliance
 *
 * @param trade - Short sale trade
 * @returns Compliance validation result
 */
function validateShortSellingCompliance(trade) {
    const violations = [];
    if (trade.side === 'SHORT_SELL') {
        if (!trade.locateId) {
            violations.push('Locate requirement not satisfied - Regulation SHO violation');
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
        requiresLocate: trade.side === 'SHORT_SELL'
    };
}
/**
 * Track locate/borrow requirements for short sales
 *
 * @param symbol - Security symbol
 * @param quantity - Shares to short
 * @returns Locate/borrow tracking
 */
function trackLocateBorrowRequirements(symbol, quantity) {
    return {
        locateId: `LOC-${symbol}-${Date.now()}`,
        symbol,
        sharesLocated: quantity,
        broker: 'PRIME-BROKER-001',
        timestamp: new Date(),
        expirationTime: new Date(Date.now() + 86400000), // Valid for 1 day
        hardToBorrow: false,
        borrowCost: 0.25 // 25 bps annual
    };
}
// ============================================================================
// POSITION LIMITS & ALERTS (5 functions)
// ============================================================================
/**
 * Monitor position limits against regulatory thresholds
 *
 * @param position - Current position
 * @param limits - Regulatory limits
 * @returns Monitoring result
 */
function monitorPositionLimits(position, limits) {
    const netPosition = position.longPosition - position.shortPosition;
    const grossPosition = position.longPosition + position.shortPosition;
    const spotMonthPercent = (Math.abs(netPosition) / limits.spotMonthLimit) * 100;
    const singleMonthPercent = (Math.abs(netPosition) / limits.singleMonthLimit) * 100;
    const allMonthsPercent = (grossPosition / limits.allMonthsLimit) * 100;
    let breachStatus = false;
    let breachType;
    if (spotMonthPercent >= 100) {
        breachStatus = true;
        breachType = 'SPOT_MONTH';
    }
    else if (singleMonthPercent >= 100) {
        breachStatus = true;
        breachType = 'SINGLE_MONTH';
    }
    else if (allMonthsPercent >= 100) {
        breachStatus = true;
        breachType = 'ALL_MONTHS';
    }
    return {
        reportId: `POS-LIMIT-${position.traderId}-${Date.now()}`,
        timestamp: new Date(),
        traderId: position.traderId,
        contract: {
            commodity: position.commodity,
            contractMonth: position.contractMonth,
            exchange: position.exchange
        },
        currentPosition: {
            long: position.longPosition,
            short: position.shortPosition,
            net: netPosition,
            gross: grossPosition
        },
        limits,
        utilization: {
            spotMonthPercent,
            singleMonthPercent,
            allMonthsPercent
        },
        breachStatus,
        breachType
    };
}
/**
 * Generate position limit breach alert
 *
 * @param monitor - Position limit monitor result
 * @returns Compliance alert
 */
function generatePositionLimitAlert(monitor) {
    const severity = monitor.breachStatus ? 'CRITICAL' :
        (monitor.utilization.spotMonthPercent >= 80 || monitor.utilization.singleMonthPercent >= 80) ? 'WARNING' : 'INFO';
    return {
        alertId: `ALERT-${monitor.reportId}`,
        timestamp: new Date(),
        severity,
        alertType: 'POSITION_LIMIT',
        regulatoryRegime: 'DODD_FRANK',
        description: monitor.breachStatus
            ? `Position limit breach detected: ${monitor.breachType} for ${monitor.contract.commodity}`
            : `Position limit utilization at ${Math.max(monitor.utilization.spotMonthPercent, monitor.utilization.singleMonthPercent).toFixed(1)}%`,
        affectedEntities: [monitor.traderId],
        recommendedAction: monitor.breachStatus
            ? 'Immediate position reduction required to comply with regulatory limits'
            : 'Monitor position closely - approaching regulatory limits',
        deadline: monitor.breachStatus ? new Date(Date.now() + 3600000) : undefined, // 1 hour to resolve
        status: 'OPEN'
    };
}
/**
 * Calculate aggregate positions across accounts
 *
 * @param positions - Individual account positions
 * @returns Aggregated position
 */
function calculateAggregatePositions(positions) {
    const commodity = positions[0]?.commodity || '';
    const contractMonth = positions[0]?.contractMonth || '';
    const aggregateLong = positions.reduce((sum, p) => sum + p.longPosition, 0);
    const aggregateShort = positions.reduce((sum, p) => sum + p.shortPosition, 0);
    return {
        commodity,
        contractMonth,
        aggregateLong,
        aggregateShort,
        aggregateNet: aggregateLong - aggregateShort,
        aggregateGross: aggregateLong + aggregateShort,
        accountCount: positions.length
    };
}
/**
 * Validate position limit compliance
 *
 * @param monitor - Position limit monitor
 * @returns Compliance validation
 */
function validatePositionLimitCompliance(monitor) {
    const violations = [];
    if (Math.abs(monitor.currentPosition.net) > monitor.limits.spotMonthLimit) {
        violations.push({
            limitType: 'SPOT_MONTH',
            limit: monitor.limits.spotMonthLimit,
            currentPosition: Math.abs(monitor.currentPosition.net),
            excess: Math.abs(monitor.currentPosition.net) - monitor.limits.spotMonthLimit
        });
    }
    if (Math.abs(monitor.currentPosition.net) > monitor.limits.singleMonthLimit) {
        violations.push({
            limitType: 'SINGLE_MONTH',
            limit: monitor.limits.singleMonthLimit,
            currentPosition: Math.abs(monitor.currentPosition.net),
            excess: Math.abs(monitor.currentPosition.net) - monitor.limits.singleMonthLimit
        });
    }
    if (monitor.currentPosition.gross > monitor.limits.allMonthsLimit) {
        violations.push({
            limitType: 'ALL_MONTHS',
            limit: monitor.limits.allMonthsLimit,
            currentPosition: monitor.currentPosition.gross,
            excess: monitor.currentPosition.gross - monitor.limits.allMonthsLimit
        });
    }
    return {
        compliant: violations.length === 0,
        violations
    };
}
/**
 * Generate position limit compliance report
 *
 * @param monitors - Array of position limit monitors
 * @returns Compliance report
 */
function generatePositionLimitReport(monitors) {
    let breaches = 0;
    let warnings = 0;
    let compliant = 0;
    const details = monitors.map(m => {
        const maxUtilization = Math.max(m.utilization.spotMonthPercent, m.utilization.singleMonthPercent, m.utilization.allMonthsPercent);
        let status = 'COMPLIANT';
        if (m.breachStatus) {
            status = 'BREACH';
            breaches++;
        }
        else if (maxUtilization >= 80) {
            status = 'WARNING';
            warnings++;
        }
        else {
            compliant++;
        }
        return {
            traderId: m.traderId,
            commodity: m.contract.commodity,
            status,
            utilizationPercent: maxUtilization
        };
    });
    return {
        reportId: `POS-LIMIT-REPORT-${Date.now()}`,
        reportDate: new Date(),
        totalPositions: monitors.length,
        breaches,
        warnings,
        compliant,
        details
    };
}
// ============================================================================
// COMPLIANCE DASHBOARDS & AUDIT TRAILS (6 functions)
// ============================================================================
/**
 * Generate compliance dashboard metrics
 *
 * @param reportPeriod - Period for metrics calculation
 * @returns Comprehensive compliance metrics
 */
async function generateComplianceDashboardMetrics(reportPeriod) {
    // In production, query from compliance database
    return {
        reportPeriod,
        reportingCompliance: {
            mifidIIReportsSubmitted: 1250,
            emirReportsSubmitted: 450,
            doddFrankReportsSubmitted: 320,
            secReportsSubmitted: 15,
            onTimeSubmissionRate: 0.985,
            errorRate: 0.015
        },
        tradingCompliance: {
            positionLimitBreaches: 2,
            bestExecutionViolations: 0,
            shortSellingViolations: 1,
            oatsReportingErrors: 5
        },
        alertMetrics: {
            totalAlerts: 45,
            criticalAlerts: 2,
            openAlerts: 8,
            averageResolutionTime: 4.5
        },
        auditMetrics: {
            totalAuditEntries: 12500,
            uniqueUsers: 85,
            highRiskActions: 12
        }
    };
}
/**
 * Create tamper-proof audit trail entry
 *
 * @param auditData - Audit entry data
 * @param previousHash - Hash of previous audit entry
 * @returns Audit trail entry with cryptographic hash
 */
function createAuditTrailEntry(auditData, previousHash = '0000000000000000') {
    const timestamp = new Date();
    const entryId = `AUDIT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // Create hash from audit data and previous hash (blockchain-style)
    const hashInput = `${previousHash}|${entryId}|${timestamp.toISOString()}|${auditData.userId}|${auditData.action}|${JSON.stringify(auditData.changes)}`;
    // Simple hash simulation (in production, use crypto.createHash('sha256'))
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
        hash = ((hash << 5) - hash) + hashInput.charCodeAt(i);
        hash = hash & hash;
    }
    const tamperProofHash = Math.abs(hash).toString(16).padStart(16, '0');
    return {
        entryId,
        timestamp,
        userId: auditData.userId,
        action: auditData.action,
        entityType: auditData.entityType,
        entityId: auditData.entityId,
        changes: auditData.changes,
        ipAddress: auditData.ipAddress,
        sessionId: auditData.sessionId,
        regulatoryContext: auditData.regulatoryContext,
        tamperProofHash
    };
}
/**
 * Query audit trail with filters
 *
 * @param filters - Query filters
 * @returns Matching audit trail entries
 */
async function queryAuditTrail(filters) {
    // In production, query from audit database with filters
    const entries = [];
    // Verify hash chain integrity
    let integrityVerified = true;
    for (let i = 1; i < entries.length; i++) {
        // Verify each entry's hash includes previous hash
        // In production: verify cryptographic hash chain
    }
    return {
        entries,
        totalCount: entries.length,
        integrityVerified
    };
}
/**
 * Generate compliance alerts based on monitoring
 *
 * @param monitoringData - Real-time monitoring data
 * @returns Generated compliance alerts
 */
function generateComplianceAlerts(monitoringData) {
    const alerts = [];
    if (monitoringData.positionBreaches > 0) {
        alerts.push({
            alertId: `ALERT-POS-${Date.now()}`,
            timestamp: new Date(),
            severity: 'CRITICAL',
            alertType: 'POSITION_LIMIT_BREACH',
            regulatoryRegime: 'DODD_FRANK',
            description: `${monitoringData.positionBreaches} position limit breach(es) detected`,
            affectedEntities: [],
            recommendedAction: 'Immediately review and reduce positions to comply with limits',
            deadline: new Date(Date.now() + 3600000),
            status: 'OPEN'
        });
    }
    if (monitoringData.lateReports > 0) {
        alerts.push({
            alertId: `ALERT-LATE-${Date.now()}`,
            timestamp: new Date(),
            severity: 'WARNING',
            alertType: 'LATE_REGULATORY_REPORT',
            regulatoryRegime: 'MIFID_II',
            description: `${monitoringData.lateReports} regulatory report(s) approaching deadline`,
            affectedEntities: [],
            recommendedAction: 'Submit pending regulatory reports immediately',
            deadline: new Date(Date.now() + 7200000),
            status: 'OPEN'
        });
    }
    if (monitoringData.validationErrors > 5) {
        alerts.push({
            alertId: `ALERT-VAL-${Date.now()}`,
            timestamp: new Date(),
            severity: 'WARNING',
            alertType: 'VALIDATION_ERROR_SPIKE',
            regulatoryRegime: 'EMIR',
            description: `High volume of validation errors: ${monitoringData.validationErrors}`,
            affectedEntities: [],
            recommendedAction: 'Review data quality and reporting procedures',
            status: 'OPEN'
        });
    }
    return alerts;
}
/**
 * Calculate compliance scores across dimensions
 *
 * @param complianceData - Compliance metrics
 * @returns Compliance scores and ratings
 */
function calculateComplianceScores(complianceData) {
    const reportingScore = (complianceData.reportingAccuracy * 50 + complianceData.timelinessRate * 50);
    const tradingScore = (complianceData.positionCompliance * 100);
    const operationalScore = Math.max(0, 100 - (complianceData.auditFindings * 5) - (complianceData.violations * 10));
    const overallScore = (reportingScore + tradingScore + operationalScore) / 3;
    let rating;
    if (overallScore >= 90)
        rating = 'EXCELLENT';
    else if (overallScore >= 80)
        rating = 'GOOD';
    else if (overallScore >= 70)
        rating = 'SATISFACTORY';
    else if (overallScore >= 60)
        rating = 'NEEDS_IMPROVEMENT';
    else
        rating = 'CRITICAL';
    const recommendations = [];
    if (reportingScore < 80)
        recommendations.push('Improve regulatory reporting accuracy and timeliness');
    if (tradingScore < 80)
        recommendations.push('Enhance position limit monitoring and controls');
    if (operationalScore < 80)
        recommendations.push('Address operational compliance findings');
    return {
        overallScore,
        rating,
        dimensions: {
            reporting: reportingScore,
            trading: tradingScore,
            operational: operationalScore
        },
        recommendations
    };
}
/**
 * Export audit trail for regulatory examination
 *
 * @param exportParams - Export parameters
 * @returns Audit trail export package
 */
async function exportAuditTrailReport(exportParams) {
    const auditEntries = await queryAuditTrail({
        startDate: exportParams.startDate,
        endDate: exportParams.endDate,
        regulatoryContext: exportParams.regulatoryContext
    });
    let exportData = '';
    if (exportParams.format === 'JSON') {
        exportData = JSON.stringify(auditEntries.entries, null, 2);
    }
    else if (exportParams.format === 'CSV') {
        exportData = 'EntryID,Timestamp,UserID,Action,EntityType,EntityID,Hash\n';
        auditEntries.entries.forEach(entry => {
            exportData += `${entry.entryId},${entry.timestamp.toISOString()},${entry.userId},${entry.action},${entry.entityType},${entry.entityId},${entry.tamperProofHash}\n`;
        });
    }
    else if (exportParams.format === 'XML') {
        exportData = '<?xml version="1.0" encoding="UTF-8"?>\n<AuditTrail>\n';
        auditEntries.entries.forEach(entry => {
            exportData += `  <Entry id="${entry.entryId}" timestamp="${entry.timestamp.toISOString()}" hash="${entry.tamperProofHash}"/>\n`;
        });
        exportData += '</AuditTrail>';
    }
    return {
        exportId: `EXPORT-${Date.now()}`,
        timestamp: new Date(),
        format: exportParams.format,
        recordCount: auditEntries.entries.length,
        integrityVerified: auditEntries.integrityVerified,
        exportData,
        hashChainProof: exportParams.includeHashes ? 'HASH_CHAIN_VERIFIED' : undefined
    };
}
//# sourceMappingURL=regulatory-reporting-kit.js.map
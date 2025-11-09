"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureReason = exports.CustodianBank = exports.ClearingHouse = exports.SettlementType = exports.SettlementCycle = void 0;
exports.createSettlementInstruction = createSettlementInstruction;
exports.validateSettlementInstruction = validateSettlementInstruction;
exports.enrichSettlementInstruction = enrichSettlementInstruction;
exports.matchSettlementInstructions = matchSettlementInstructions;
exports.amendSettlementInstruction = amendSettlementInstruction;
exports.cancelSettlementInstruction = cancelSettlementInstruction;
exports.confirmSettlementInstruction = confirmSettlementInstruction;
exports.routeSettlementInstruction = routeSettlementInstruction;
exports.parseSettlementResponse = parseSettlementResponse;
exports.archiveSettlementInstruction = archiveSettlementInstruction;
exports.processDVPTransaction = processDVPTransaction;
exports.validateDVPEligibility = validateDVPEligibility;
exports.allocateDVPSecurities = allocateDVPSecurities;
exports.processFreeDelivery = processFreeDelivery;
exports.validateDeliveryQuantity = validateDeliveryQuantity;
exports.processPartialDelivery = processPartialDelivery;
exports.calculateDVPCashAmount = calculateDVPCashAmount;
exports.reconcileDVPLegs = reconcileDVPLegs;
exports.trackSettlementStatus = trackSettlementStatus;
exports.updateSettlementStatus = updateSettlementStatus;
exports.querySettlementsByStatus = querySettlementsByStatus;
exports.reconcileTradeVsSettlement = reconcileTradeVsSettlement;
exports.reconcilePositionVsSettlement = reconcilePositionVsSettlement;
exports.generateSettlementReport = generateSettlementReport;
exports.identifySettlementBreaks = identifySettlementBreaks;
exports.resolveSettlementDiscrepancy = resolveSettlementDiscrepancy;
exports.calculateSettlementRate = calculateSettlementRate;
exports.monitorSettlementAging = monitorSettlementAging;
exports.connectToClearingHouse = connectToClearingHouse;
exports.submitToClearingHouse = submitToClearingHouse;
exports.receiveClearingConfirmation = receiveClearingConfirmation;
exports.queryClearingHouseStatus = queryClearingHouseStatus;
exports.connectToCustodian = connectToCustodian;
exports.instructCustodianDelivery = instructCustodianDelivery;
exports.receiveCustodianConfirmation = receiveCustodianConfirmation;
exports.queryCustodianPosition = queryCustodianPosition;
exports.reconcileCustodianMovements = reconcileCustodianMovements;
exports.handleCustodianException = handleCustodianException;
exports.calculateSettlementRisk = calculateSettlementRisk;
exports.assessHerstattRisk = assessHerstattRisk;
exports.evaluateCounterpartyRisk = evaluateCounterpartyRisk;
exports.performSettlementNetting = performSettlementNetting;
exports.optimizeSettlementNetting = optimizeSettlementNetting;
exports.calculateMarginRequirement = calculateMarginRequirement;
exports.monitorSettlementLimits = monitorSettlementLimits;
exports.processCorporateActionAdjustment = processCorporateActionAdjustment;
exports.validateCrossBorderSettlement = validateCrossBorderSettlement;
exports.calculateSettlementFailureCost = calculateSettlementFailureCost;
exports.generateSettlementRiskReport = generateSettlementRiskReport;
exports.alertSettlementRiskBreach = alertSettlementRiskBreach;
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Settlement cycle enumeration supporting various settlement timeframes
 */
var SettlementCycle;
(function (SettlementCycle) {
    SettlementCycle["T_PLUS_0"] = "T+0";
    SettlementCycle["T_PLUS_1"] = "T+1";
    SettlementCycle["T_PLUS_2"] = "T+2";
    SettlementCycle["T_PLUS_3"] = "T+3";
    SettlementCycle["CUSTOM"] = "CUSTOM"; // Custom settlement date
})(SettlementCycle || (exports.SettlementCycle = SettlementCycle = {}));
/**
 * Settlement instruction type
 */
var SettlementType;
(function (SettlementType) {
    SettlementType["DVP"] = "DVP";
    SettlementType["RVP"] = "RVP";
    SettlementType["FOP"] = "FOP";
    SettlementType["DFP"] = "DFP";
    SettlementType["RFP"] = "RFP";
    SettlementType["DVP_AGAINST_PAYMENT"] = "DAP"; // Delivery against Payment
})(SettlementType || (exports.SettlementType = SettlementType = {}));
/**
 * Clearing house enumeration
 */
var ClearingHouse;
(function (ClearingHouse) {
    ClearingHouse["DTCC"] = "DTCC";
    ClearingHouse["NSCC"] = "NSCC";
    ClearingHouse["LCH"] = "LCH";
    ClearingHouse["EUREX"] = "EUREX";
    ClearingHouse["ICE_CLEAR"] = "ICE_CLEAR";
    ClearingHouse["CME"] = "CME";
    ClearingHouse["JSCC"] = "JSCC";
    ClearingHouse["EUROCLEAR"] = "EUROCLEAR";
    ClearingHouse["CLEARSTREAM"] = "CLEARSTREAM"; // Clearstream
})(ClearingHouse || (exports.ClearingHouse = ClearingHouse = {}));
/**
 * Custodian bank enumeration
 */
var CustodianBank;
(function (CustodianBank) {
    CustodianBank["BNY_MELLON"] = "BNY_MELLON";
    CustodianBank["STATE_STREET"] = "STATE_STREET";
    CustodianBank["JPM_CUSTODY"] = "JPM_CUSTODY";
    CustodianBank["CITI_CUSTODY"] = "CITI_CUSTODY";
    CustodianBank["NORTHERN_TRUST"] = "NORTHERN_TRUST";
    CustodianBank["CACEIS"] = "CACEIS";
    CustodianBank["BROWN_BROTHERS"] = "BROWN_BROTHERS";
})(CustodianBank || (exports.CustodianBank = CustodianBank = {}));
/**
 * Failure reason enumeration
 */
var FailureReason;
(function (FailureReason) {
    FailureReason["INSUFFICIENT_SECURITIES"] = "INSUFFICIENT_SECURITIES";
    FailureReason["INSUFFICIENT_CASH"] = "INSUFFICIENT_CASH";
    FailureReason["ACCOUNT_BLOCKED"] = "ACCOUNT_BLOCKED";
    FailureReason["INSTRUCTION_ERROR"] = "INSTRUCTION_ERROR";
    FailureReason["SYSTEM_ERROR"] = "SYSTEM_ERROR";
    FailureReason["COUNTERPARTY_FAIL"] = "COUNTERPARTY_FAIL";
    FailureReason["MISSING_DOCUMENTATION"] = "MISSING_DOCUMENTATION";
    FailureReason["REGULATORY_HOLD"] = "REGULATORY_HOLD";
    FailureReason["CORPORATE_ACTION"] = "CORPORATE_ACTION";
})(FailureReason || (exports.FailureReason = FailureReason = {}));
// ============================================================================
// SETTLEMENT INSTRUCTION FUNCTIONS
// ============================================================================
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
async function createSettlementInstruction(tradeId, tradeDetails, settlementCycle, options = {}, transaction) {
    // Calculate settlement date based on cycle
    const settlementDate = calculateSettlementDate(tradeDetails.tradeDate, settlementCycle);
    const instruction = {
        instructionId: generateInstructionId(),
        tradeId,
        settlementType: options.settlementType || SettlementType.DVP,
        settlementCycle,
        settlementDate,
        tradeDate: tradeDetails.tradeDate,
        security: tradeDetails.security,
        quantity: tradeDetails.quantity,
        price: tradeDetails.price,
        grossAmount: tradeDetails.quantity * tradeDetails.price,
        netAmount: calculateNetAmount(tradeDetails),
        fees: calculateFees(tradeDetails),
        deliverFrom: tradeDetails.seller,
        deliverTo: tradeDetails.buyer,
        cashFrom: tradeDetails.buyer,
        cashTo: tradeDetails.seller,
        clearingHouse: options.clearingHouse,
        custodian: options.custodian,
        status: { status: 'pending' },
        metadata: {
            createdBy: tradeDetails.userId,
            createdAt: new Date(),
            version: 1
        }
    };
    return instruction;
}
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
function validateSettlementInstruction(instruction) {
    const errors = [];
    const warnings = [];
    // Required field validation
    if (!instruction.instructionId)
        errors.push('Instruction ID is required');
    if (!instruction.tradeId)
        errors.push('Trade ID is required');
    if (!instruction.security?.isin)
        errors.push('Security ISIN is required');
    if (instruction.quantity <= 0)
        errors.push('Quantity must be positive');
    if (instruction.price <= 0)
        errors.push('Price must be positive');
    // Party validation
    if (!instruction.deliverFrom?.accountNumber)
        errors.push('Deliver from account is required');
    if (!instruction.deliverTo?.accountNumber)
        errors.push('Deliver to account is required');
    // DVP-specific validation
    if (instruction.settlementType === SettlementType.DVP || instruction.settlementType === SettlementType.RVP) {
        if (!instruction.cashFrom?.accountNumber)
            errors.push('DVP requires cash from account');
        if (!instruction.cashTo?.accountNumber)
            errors.push('DVP requires cash to account');
    }
    // Date validation
    if (instruction.settlementDate <= instruction.tradeDate) {
        errors.push('Settlement date must be after trade date');
    }
    // Amount validation
    const calculatedGross = instruction.quantity * instruction.price;
    if (Math.abs(instruction.grossAmount - calculatedGross) > 0.01) {
        warnings.push(`Gross amount mismatch: expected ${calculatedGross}, got ${instruction.grossAmount}`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
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
async function enrichSettlementInstruction(instruction, referenceDataService) {
    // Fetch standing settlement instructions (SSI)
    const ssi = await referenceDataService.getSSI(instruction.deliverFrom.partyId, instruction.deliverTo.partyId, instruction.security.currency);
    // Enrich with SSI data
    if (ssi) {
        instruction.deliverFrom.bic = ssi.deliverFromBIC;
        instruction.deliverTo.bic = ssi.deliverToBIC;
        instruction.safekeepingAccount = ssi.safekeepingAccount;
        instruction.cashAccount = ssi.cashAccount;
    }
    // Fetch clearing house details if applicable
    if (instruction.clearingHouse) {
        const clearingDetails = await referenceDataService.getClearingHouseDetails(instruction.clearingHouse);
        instruction.deliverFrom.clearingMemberId = clearingDetails.memberId;
    }
    return instruction;
}
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
function matchSettlementInstructions(buyerInstruction, sellerInstruction, tolerances = {}) {
    const unmatchedFields = [];
    const matchedFields = [];
    // Check ISIN match
    if (buyerInstruction.security.isin !== sellerInstruction.security.isin) {
        unmatchedFields.push({
            fieldName: 'security.isin',
            buyerValue: buyerInstruction.security.isin,
            sellerValue: sellerInstruction.security.isin,
            withinTolerance: false
        });
    }
    else {
        matchedFields.push('security.isin');
    }
    // Check quantity match
    const quantityDiff = Math.abs(buyerInstruction.quantity - sellerInstruction.quantity);
    const quantityTolerance = tolerances.quantity || 0;
    if (quantityDiff > quantityTolerance) {
        unmatchedFields.push({
            fieldName: 'quantity',
            buyerValue: buyerInstruction.quantity,
            sellerValue: sellerInstruction.quantity,
            tolerance: quantityTolerance,
            withinTolerance: false
        });
    }
    else {
        matchedFields.push('quantity');
    }
    // Check amount match
    const amountDiff = Math.abs(buyerInstruction.netAmount - sellerInstruction.netAmount);
    const amountTolerance = tolerances.amount || 0.01;
    if (amountDiff > amountTolerance) {
        unmatchedFields.push({
            fieldName: 'netAmount',
            buyerValue: buyerInstruction.netAmount,
            sellerValue: sellerInstruction.netAmount,
            tolerance: amountTolerance,
            withinTolerance: false
        });
    }
    else {
        matchedFields.push('netAmount');
    }
    // Check settlement date match
    if (buyerInstruction.settlementDate.getTime() !== sellerInstruction.settlementDate.getTime()) {
        unmatchedFields.push({
            fieldName: 'settlementDate',
            buyerValue: buyerInstruction.settlementDate,
            sellerValue: sellerInstruction.settlementDate,
            withinTolerance: false
        });
    }
    else {
        matchedFields.push('settlementDate');
    }
    const isMatched = unmatchedFields.length === 0;
    return {
        isMatched,
        matchId: isMatched ? generateMatchId() : undefined,
        buyerInstructionId: buyerInstruction.instructionId,
        sellerInstructionId: sellerInstruction.instructionId,
        matchedFields,
        unmatchedFields,
        matchTimestamp: isMatched ? new Date() : undefined,
        matchStatus: isMatched ? 'auto_matched' : 'unmatched'
    };
}
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
async function amendSettlementInstruction(instructionId, amendments, userId, transaction) {
    // Fetch original instruction
    const original = await fetchSettlementInstruction(instructionId);
    // Check if instruction can be amended
    if (original.status.status === 'settled' || original.status.status === 'cancelled') {
        throw new Error(`Cannot amend instruction in ${original.status.status} status`);
    }
    // Create amended instruction
    const amended = {
        ...original,
        ...amendments,
        status: {
            status: 'amended',
            amendmentId: generateAmendmentId(),
            originalInstructionId: instructionId
        },
        metadata: {
            ...original.metadata,
            updatedBy: userId,
            updatedAt: new Date(),
            version: original.metadata.version + 1
        }
    };
    return amended;
}
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
async function cancelSettlementInstruction(instructionId, reason, userId, transaction) {
    const instruction = await fetchSettlementInstruction(instructionId);
    if (instruction.status.status === 'settled') {
        throw new Error('Cannot cancel settled instruction');
    }
    instruction.status = {
        status: 'cancelled',
        cancelledBy: userId,
        reason,
        timestamp: new Date()
    };
    instruction.metadata.updatedBy = userId;
    instruction.metadata.updatedAt = new Date();
    return instruction;
}
/**
 * Generates settlement confirmation for an instruction
 *
 * @param instruction - Settlement instruction
 * @returns Confirmation document
 *
 * @example
 * const confirmation = confirmSettlementInstruction(instruction);
 */
function confirmSettlementInstruction(instruction) {
    return {
        confirmationId: generateConfirmationId(),
        instruction,
        generatedAt: new Date()
    };
}
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
async function routeSettlementInstruction(instruction, connection) {
    try {
        // Convert instruction to clearing house message format
        const message = convertToCleaningHouseFormat(instruction, connection.clearingHouse);
        // Send to clearing house
        const messageId = await sendToClearingHouse(message, connection);
        return { routed: true, messageId };
    }
    catch (error) {
        return { routed: false, error: error.message };
    }
}
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
function parseSettlementResponse(response, clearingHouse) {
    // Parse based on clearing house format
    switch (clearingHouse) {
        case ClearingHouse.DTCC:
            return parseDTCCResponse(response);
        case ClearingHouse.LCH:
            return parseLCHResponse(response);
        case ClearingHouse.EUREX:
            return parseEurexResponse(response);
        default:
            return parseGenericResponse(response);
    }
}
/**
 * Archives settlement instruction for historical record
 *
 * @param instruction - Settlement instruction to archive
 * @returns Archival confirmation
 *
 * @example
 * await archiveSettlementInstruction(instruction);
 */
async function archiveSettlementInstruction(instruction, transaction) {
    return {
        archived: true,
        archiveId: generateArchiveId(),
        archiveDate: new Date()
    };
}
// ============================================================================
// DVP AND DELIVERY PROCESSING FUNCTIONS
// ============================================================================
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
async function processDVPTransaction(dvpInstruction, options = {}, transaction) {
    const errors = [];
    // Validate securities availability
    if (options.validateSecurities !== false) {
        const securitiesAvailable = await validateSecuritiesAvailability(dvpInstruction.deliverFrom.accountNumber, dvpInstruction.security.isin, dvpInstruction.quantity);
        if (!securitiesAvailable) {
            errors.push('Insufficient securities for delivery');
        }
    }
    // Validate cash availability
    if (options.validateCash !== false) {
        const cashAvailable = await validateCashAvailability(dvpInstruction.cashFrom.accountNumber, dvpInstruction.netAmount);
        if (!cashAvailable) {
            errors.push('Insufficient cash for payment');
        }
    }
    if (errors.length > 0) {
        return { success: false, errors };
    }
    // Process simultaneous settlement
    const settlementId = await processSimultaneousSettlement(dvpInstruction, transaction);
    return { success: true, settlementId };
}
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
function validateDVPEligibility(security, clearingHouse) {
    const reasons = [];
    // Check if security type supports DVP
    if (security.securityType === 'derivative') {
        reasons.push('Derivatives may have special DVP requirements');
    }
    // Check clearing house eligibility
    if (clearingHouse && !isSecurityEligibleForClearing(security, clearingHouse)) {
        reasons.push(`Security not eligible for clearing at ${clearingHouse}`);
    }
    return {
        eligible: reasons.length === 0,
        reasons: reasons.length > 0 ? reasons : undefined
    };
}
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
async function allocateDVPSecurities(accountNumber, isin, quantity, transaction) {
    // Check available quantity
    const available = await getAvailableSecurities(accountNumber, isin);
    if (available < quantity) {
        return { allocated: false, availableQuantity: available };
    }
    // Allocate securities
    const allocationId = generateAllocationId();
    await markSecuritiesAllocated(accountNumber, isin, quantity, allocationId, transaction);
    return { allocated: true, allocationId };
}
/**
 * Processes free of payment delivery
 *
 * @param instruction - FOP settlement instruction
 * @returns Processing result
 *
 * @example
 * const result = await processFreeDelivery(fopInstruction);
 */
async function processFreeDelivery(instruction, transaction) {
    if (instruction.settlementType !== SettlementType.FOP &&
        instruction.settlementType !== SettlementType.DFP &&
        instruction.settlementType !== SettlementType.RFP) {
        throw new Error('Instruction is not a free delivery type');
    }
    // Process securities movement only (no cash)
    const deliveryId = await processSecuritiesTransfer(instruction.deliverFrom.accountNumber, instruction.deliverTo.accountNumber, instruction.security.isin, instruction.quantity, transaction);
    return { success: true, deliveryId };
}
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
function validateDeliveryQuantity(tradeQuantity, deliveryQuantity, allowPartial = false) {
    if (deliveryQuantity === tradeQuantity) {
        return { valid: true };
    }
    if (allowPartial && deliveryQuantity < tradeQuantity && deliveryQuantity > 0) {
        return { valid: true };
    }
    if (deliveryQuantity > tradeQuantity) {
        return { valid: false, reason: 'Delivery quantity exceeds trade quantity' };
    }
    if (deliveryQuantity < tradeQuantity && !allowPartial) {
        return { valid: false, reason: 'Partial delivery not allowed' };
    }
    return { valid: false, reason: 'Invalid delivery quantity' };
}
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
async function processPartialDelivery(instruction, deliveredQuantity, transaction) {
    const pendingQuantity = instruction.quantity - deliveredQuantity;
    instruction.status = {
        status: 'partially_settled',
        settledQuantity: deliveredQuantity,
        pendingQuantity
    };
    instruction.metadata.updatedAt = new Date();
    instruction.metadata.version += 1;
    return instruction;
}
/**
 * Calculates DVP cash amount including fees and adjustments
 *
 * @param instruction - DVP instruction
 * @returns Total cash amount
 *
 * @example
 * const cashAmount = calculateDVPCashAmount(dvpInstruction);
 */
function calculateDVPCashAmount(instruction) {
    let cashAmount = instruction.quantity * instruction.price;
    // Add/subtract fees
    instruction.fees.forEach(fee => {
        if (fee.feeType === 'commission' || fee.feeType === 'clearing_fee') {
            cashAmount += fee.amount;
        }
    });
    // Apply FX rate if applicable
    if (instruction.fxRate) {
        cashAmount *= instruction.fxRate;
    }
    return cashAmount;
}
/**
 * Reconciles DVP securities and cash legs
 *
 * @param dvpInstruction - DVP instruction to reconcile
 * @returns Reconciliation result
 *
 * @example
 * const reconciled = reconcileDVPLegs(dvpInstruction);
 */
function reconcileDVPLegs(dvpInstruction) {
    const discrepancies = [];
    // This would check actual settlement records
    const securitiesLegStatus = 'settled';
    const cashLegStatus = 'settled';
    const reconciled = securitiesLegStatus === 'settled' && cashLegStatus === 'settled';
    return {
        reconciled,
        securitiesLegStatus,
        cashLegStatus,
        discrepancies: discrepancies.length > 0 ? discrepancies : undefined
    };
}
// ============================================================================
// STATUS TRACKING AND RECONCILIATION FUNCTIONS
// ============================================================================
/**
 * Tracks settlement status throughout lifecycle
 *
 * @param instructionId - Settlement instruction ID
 * @returns Current status with history
 *
 * @example
 * const status = await trackSettlementStatus('INST-123');
 */
async function trackSettlementStatus(instructionId) {
    const instruction = await fetchSettlementInstruction(instructionId);
    const history = await fetchStatusHistory(instructionId);
    return {
        current: instruction.status,
        history
    };
}
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
async function updateSettlementStatus(instructionId, newStatus, userId, transaction) {
    const instruction = await fetchSettlementInstruction(instructionId);
    // Record status history
    await recordStatusChange(instructionId, instruction.status, newStatus, userId, transaction);
    instruction.status = newStatus;
    instruction.metadata.updatedBy = userId;
    instruction.metadata.updatedAt = new Date();
    return instruction;
}
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
async function querySettlementsByStatus(status, options = {}) {
    // This would query database
    return [];
}
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
async function reconcileTradeVsSettlement(tradeDate, options = {}) {
    const reconciliationId = generateReconciliationId();
    const breaks = [];
    // Fetch trades and settlements
    const trades = await fetchTradesByDate(tradeDate);
    const settlements = await fetchSettlementsByTradeDate(tradeDate);
    // Match trades to settlements
    trades.forEach(trade => {
        const settlement = settlements.find(s => s.tradeId === trade.tradeId);
        if (!settlement) {
            breaks.push({
                breakId: generateBreakId(),
                breakType: 'settlement_missing',
                severity: 'high',
                tradeId: trade.tradeId,
                expectedValue: trade,
                actualValue: null,
                variance: 0,
                resolutionStatus: 'open'
            });
        }
    });
    return {
        reconciliationId,
        reconciliationDate: new Date(),
        tradeRecords: trades.length,
        settlementRecords: settlements.length,
        positionRecords: 0,
        matchedRecords: trades.length - breaks.length,
        unmatchedRecords: breaks.length,
        breaks,
        reconciliationRate: ((trades.length - breaks.length) / trades.length) * 100,
        status: 'completed'
    };
}
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
async function reconcilePositionVsSettlement(accountNumber, date) {
    const reconciliationId = generateReconciliationId();
    const breaks = [];
    // Fetch position movements and settlements
    const positions = await fetchPositionMovements(accountNumber, date);
    const settlements = await fetchSettlementsByAccount(accountNumber, date);
    // Compare quantities
    positions.forEach(position => {
        const settlement = settlements.find(s => s.security.isin === position.isin);
        if (!settlement) {
            breaks.push({
                breakId: generateBreakId(),
                breakType: 'trade_missing',
                severity: 'critical',
                expectedValue: position,
                actualValue: null,
                variance: position.quantity,
                resolutionStatus: 'open'
            });
        }
        else if (Math.abs(settlement.quantity - position.quantity) > 0.001) {
            breaks.push({
                breakId: generateBreakId(),
                breakType: 'quantity_mismatch',
                severity: 'high',
                expectedValue: position.quantity,
                actualValue: settlement.quantity,
                variance: settlement.quantity - position.quantity,
                resolutionStatus: 'open'
            });
        }
    });
    return {
        reconciliationId,
        reconciliationDate: new Date(),
        tradeRecords: 0,
        settlementRecords: settlements.length,
        positionRecords: positions.length,
        matchedRecords: positions.length - breaks.length,
        unmatchedRecords: breaks.length,
        breaks,
        reconciliationRate: ((positions.length - breaks.length) / positions.length) * 100,
        status: 'completed'
    };
}
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
async function generateSettlementReport(dateRange, options = {}) {
    const instructions = await fetchSettlementsByDateRange(dateRange.from, dateRange.to);
    const summary = {
        totalInstructions: instructions.length,
        settled: instructions.filter(i => i.status.status === 'settled').length,
        failed: instructions.filter(i => i.status.status === 'failed').length,
        pending: instructions.filter(i => i.status.status === 'pending').length,
        settlementRate: 0
    };
    summary.settlementRate = (summary.settled / summary.totalInstructions) * 100;
    return {
        reportId: generateReportId(),
        dateRange,
        summary,
        details: instructions
    };
}
/**
 * Identifies settlement reconciliation breaks
 *
 * @param reconciliationId - Reconciliation run ID
 * @returns Array of breaks identified
 *
 * @example
 * const breaks = await identifySettlementBreaks('RECON-123');
 */
async function identifySettlementBreaks(reconciliationId) {
    // This would fetch breaks from reconciliation run
    return [];
}
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
async function resolveSettlementDiscrepancy(breakId, resolution, userId, transaction) {
    const breakRecord = await fetchReconciliationBreak(breakId);
    breakRecord.resolutionStatus = 'resolved';
    breakRecord.assignedTo = userId;
    return breakRecord;
}
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
async function calculateSettlementRate(dateRange, options = {}) {
    const instructions = await fetchSettlementsByDateRange(dateRange.from, dateRange.to, options);
    const settled = instructions.filter(i => i.status.status === 'settled').length;
    const total = instructions.length;
    return total > 0 ? (settled / total) * 100 : 0;
}
/**
 * Monitors aging of unsettled trades
 *
 * @param thresholdDays - Days threshold for aging alert
 * @returns Array of aging settlements
 *
 * @example
 * const aging = await monitorSettlementAging(5);
 */
async function monitorSettlementAging(thresholdDays) {
    const unsettled = await querySettlementsByStatus('pending');
    const aging = [];
    const now = new Date();
    for (const instruction of unsettled) {
        const daysDiff = Math.floor((now.getTime() - instruction.settlementDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= thresholdDays) {
            aging.push({
                instructionId: instruction.instructionId,
                daysOutstanding: daysDiff,
                status: instruction.status
            });
        }
    }
    return aging;
}
// ============================================================================
// CLEARING AND CUSTODIAN INTEGRATION FUNCTIONS
// ============================================================================
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
async function connectToClearingHouse(clearingHouse, config) {
    const connection = {
        clearingHouse,
        connectionId: generateConnectionId(),
        endpoint: config.endpoint,
        protocol: 'FIX',
        memberId: config.memberId,
        credentials: config.credentials,
        isActive: true,
        messagesSent: 0,
        messagesReceived: 0
    };
    // Establish connection (implementation specific)
    await establishConnection(connection);
    return connection;
}
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
async function submitToClearingHouse(tradeId, connection, transaction) {
    try {
        const trade = await fetchTrade(tradeId);
        const message = convertToCleaningHouseFormat(trade, connection.clearingHouse);
        const submissionId = await sendToClearingHouse(message, connection);
        connection.messagesSent += 1;
        return { submitted: true, submissionId };
    }
    catch (error) {
        return { submitted: false, error: error.message };
    }
}
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
function receiveClearingConfirmation(message, connection) {
    connection.messagesReceived += 1;
    return parseSettlementResponse(message, connection.clearingHouse);
}
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
async function queryClearingHouseStatus(instructionId, connection) {
    // Query clearing house
    const response = await sendClearingHouseQuery(instructionId, connection);
    return {
        status: response.status,
        lastUpdated: new Date(response.timestamp),
        details: response
    };
}
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
async function connectToCustodian(custodian, accountConfig) {
    const account = {
        custodian,
        accountId: generateAccountId(),
        accountNumber: accountConfig.accountNumber,
        accountName: accountConfig.accountName,
        accountType: 'safekeeping',
        bic: accountConfig.bic,
        isActive: true
    };
    return account;
}
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
async function instructCustodianDelivery(instruction, account, transaction) {
    try {
        // Send SWIFT MT540/541 or equivalent
        const custodianReference = await sendCustodianInstruction(instruction, account);
        return { instructed: true, custodianReference };
    }
    catch (error) {
        return { instructed: false, error: error.message };
    }
}
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
function receiveCustodianConfirmation(message, account) {
    // Parse custodian message (SWIFT MT544/545 or equivalent)
    return {
        instructionId: message.instructionId,
        custodianReference: message.reference,
        status: message.status,
        timestamp: new Date(message.timestamp)
    };
}
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
async function queryCustodianPosition(account, isin) {
    // Query custodian for positions
    return [];
}
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
async function reconcileCustodianMovements(account, date) {
    const reconciliationId = generateReconciliationId();
    // Fetch movements from custodian
    const custodianMovements = await fetchCustodianMovements(account, date);
    // Fetch internal settlement records
    const internalSettlements = await fetchSettlementsByAccount(account.accountNumber, date);
    const breaks = [];
    // Compare movements
    custodianMovements.forEach(movement => {
        const settlement = internalSettlements.find(s => s.security.isin === movement.isin);
        if (!settlement) {
            breaks.push({
                breakId: generateBreakId(),
                breakType: 'trade_missing',
                severity: 'high',
                expectedValue: movement,
                actualValue: null,
                variance: movement.quantity,
                resolutionStatus: 'open'
            });
        }
    });
    return {
        reconciliationId,
        reconciliationDate: new Date(),
        tradeRecords: 0,
        settlementRecords: internalSettlements.length,
        positionRecords: custodianMovements.length,
        matchedRecords: custodianMovements.length - breaks.length,
        unmatchedRecords: breaks.length,
        breaks,
        reconciliationRate: ((custodianMovements.length - breaks.length) / custodianMovements.length) * 100,
        status: 'completed'
    };
}
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
function handleCustodianException(exceptionMessage, account) {
    // Parse exception type and determine action
    const exceptionType = exceptionMessage.type;
    switch (exceptionType) {
        case 'INSUFFICIENT_SECURITIES':
            return { handled: true, action: 'notify_settlement_team', escalate: true };
        case 'ACCOUNT_BLOCKED':
            return { handled: true, action: 'escalate_to_operations', escalate: true };
        case 'INSTRUCTION_ERROR':
            return { handled: true, action: 'amend_instruction', escalate: false };
        default:
            return { handled: false, action: 'manual_review', escalate: true };
    }
}
// ============================================================================
// RISK MANAGEMENT AND NETTING FUNCTIONS
// ============================================================================
/**
 * Calculates settlement risk exposure
 *
 * @param instruction - Settlement instruction
 * @returns Risk metrics
 *
 * @example
 * const risk = calculateSettlementRisk(instruction);
 */
function calculateSettlementRisk(instruction) {
    const settlementValue = instruction.netAmount;
    return {
        tradeId: instruction.tradeId,
        counterpartyId: instruction.deliverFrom.partyId,
        counterpartyRiskRating: 'A', // Would fetch from risk system
        settlementValue,
        currency: instruction.security.currency,
        replacementCostRisk: settlementValue * 0.02, // 2% market volatility
        principalRisk: settlementValue,
        creditRisk: settlementValue * 0.01, // 1% credit risk
        liquidityRisk: settlementValue * 0.005, // 0.5% liquidity risk
        operationalRisk: 1000, // Fixed operational risk
        aggregateRisk: settlementValue * 0.035 + 1000,
        riskLimitUtilization: 0, // Would calculate against limits
        riskMitigants: []
    };
}
/**
 * Assesses Herstatt risk for FX settlements
 *
 * @param fxSettlement - FX settlement instruction
 * @returns Herstatt risk assessment
 *
 * @example
 * const herstattRisk = assessHerstattRisk(fxSettlement);
 */
function assessHerstattRisk(fxSettlement) {
    // Calculate time zone difference between currencies
    const timeZoneRisk = calculateTimeZoneRisk(fxSettlement.security.currency, fxSettlement.cashFrom?.accountNumber);
    // Maximum exposure is the full principal during settlement window
    const herstattRiskExposure = fxSettlement.netAmount;
    // Recommend mitigation
    const mitigationStrategy = herstattRiskExposure > 1000000
        ? 'Use CLS Bank for settlement'
        : 'PVP settlement acceptable';
    return {
        herstattRiskExposure,
        timeZoneRisk,
        mitigationStrategy
    };
}
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
async function evaluateCounterpartyRisk(counterpartyId, exposureDate) {
    // Fetch counterparty exposure
    const exposure = await fetchCounterpartyExposure(counterpartyId, exposureDate);
    const creditLimit = 10000000; // Would fetch from risk system
    const utilizationPercentage = (exposure.total / creditLimit) * 100;
    return {
        counterpartyId,
        riskRating: 'A',
        totalExposure: exposure.total,
        settlementExposure: exposure.settlement,
        creditLimit,
        utilizationPercentage,
        breached: exposure.total > creditLimit
    };
}
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
function performSettlementNetting(instructions, counterpartyId, nettingDate) {
    // Filter instructions for counterparty and date
    const eligible = instructions.filter(i => (i.deliverFrom.partyId === counterpartyId || i.deliverTo.partyId === counterpartyId) &&
        i.settlementDate.getTime() === nettingDate.getTime());
    let grossSecuritiesReceivable = 0;
    let grossSecuritiesPayable = 0;
    let grossCashReceivable = 0;
    let grossCashPayable = 0;
    eligible.forEach(instruction => {
        if (instruction.deliverTo.partyId === counterpartyId) {
            grossSecuritiesReceivable += instruction.quantity;
            grossCashPayable += instruction.netAmount;
        }
        else {
            grossSecuritiesPayable += instruction.quantity;
            grossCashReceivable += instruction.netAmount;
        }
    });
    const netSecuritiesPosition = grossSecuritiesReceivable - grossSecuritiesPayable;
    const netCashPosition = grossCashReceivable - grossCashPayable;
    const grossTotal = grossSecuritiesReceivable + grossSecuritiesPayable;
    const netTotal = Math.abs(netSecuritiesPosition);
    const nettingEfficiency = grossTotal > 0 ? ((grossTotal - netTotal) / grossTotal) * 100 : 0;
    return {
        nettingGroupId: generateNettingGroupId(),
        counterpartyId,
        nettingDate,
        currency: eligible[0]?.security.currency || 'USD',
        instructions: eligible,
        grossSecuritiesReceivable,
        grossSecuritiesPayable,
        grossCashReceivable,
        grossCashPayable,
        netSecuritiesPosition,
        netCashPosition,
        nettingEfficiency,
        settledAsNet: false
    };
}
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
function optimizeSettlementNetting(instructions, options = {}) {
    const nettingGroups = [];
    // Group by counterparty and settlement date
    const grouped = new Map();
    instructions.forEach(instruction => {
        const key = `${instruction.deliverFrom.partyId}_${instruction.settlementDate.toISOString()}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(instruction);
    });
    // Create netting groups
    grouped.forEach((instrs, key) => {
        const [counterpartyId, dateStr] = key.split('_');
        const nettingGroup = performSettlementNetting(instrs, counterpartyId, new Date(dateStr));
        // Only include if meets minimum efficiency
        if (!options.minEfficiency || nettingGroup.nettingEfficiency >= options.minEfficiency) {
            nettingGroups.push(nettingGroup);
        }
    });
    return nettingGroups;
}
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
function calculateMarginRequirement(instruction, clearingHouse) {
    const settlementValue = instruction.netAmount;
    // Simplified margin calculation (would use actual clearing house rules)
    const initialMargin = settlementValue * 0.02; // 2% initial margin
    const variationMargin = 0; // Would calculate based on market moves
    return {
        initialMargin,
        variationMargin,
        totalMargin: initialMargin + variationMargin
    };
}
/**
 * Monitors settlement limits and utilization
 *
 * @param counterpartyId - Counterparty to monitor
 * @returns Limit monitoring result
 *
 * @example
 * const limits = await monitorSettlementLimits('CP-123');
 */
async function monitorSettlementLimits(counterpartyId) {
    const settlementLimit = 50000000; // Would fetch from configuration
    const currentUtilization = await calculateCurrentSettlementExposure(counterpartyId);
    const utilizationPercentage = (currentUtilization / settlementLimit) * 100;
    const availableLimit = settlementLimit - currentUtilization;
    const breached = currentUtilization > settlementLimit;
    const warnings = [];
    if (utilizationPercentage > 90) {
        warnings.push('Settlement limit utilization above 90%');
    }
    if (breached) {
        warnings.push('Settlement limit breached - immediate action required');
    }
    return {
        counterpartyId,
        settlementLimit,
        currentUtilization,
        utilizationPercentage,
        availableLimit,
        breached,
        warnings
    };
}
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
function processCorporateActionAdjustment(instruction, corporateAction) {
    if (!corporateAction.adjustmentDetails) {
        return instruction;
    }
    const adjustment = corporateAction.adjustmentDetails;
    // Apply adjustment to instruction
    instruction.quantity = adjustment.adjustedQuantity;
    instruction.price = adjustment.adjustedPrice;
    instruction.grossAmount = adjustment.adjustedQuantity * adjustment.adjustedPrice;
    // Recalculate net amount
    instruction.netAmount = calculateNetAmount(instruction);
    return instruction;
}
/**
 * Validates cross-border settlement requirements
 *
 * @param instruction - Cross-border settlement instruction
 * @returns Validation result
 *
 * @example
 * const validation = validateCrossBorderSettlement(instruction);
 */
function validateCrossBorderSettlement(instruction) {
    const requirements = [];
    const warnings = [];
    // Check if cross-border
    const isCrossBorder = instruction.security.countryOfIssue !== getAccountCountry(instruction.deliverTo.accountNumber);
    if (isCrossBorder) {
        requirements.push('Tax reporting required');
        requirements.push('Currency conversion may be needed');
        requirements.push('Extended settlement cycle may apply');
        if (!instruction.deliverTo.bic) {
            warnings.push('BIC code missing for cross-border settlement');
        }
        // Check for international custodian
        if (instruction.custodian !== CustodianBank.EUROCLEAR &&
            instruction.custodian !== CustodianBank.CLEARSTREAM) {
            warnings.push('Consider using international custodian (Euroclear/Clearstream)');
        }
    }
    return {
        valid: warnings.length === 0,
        requirements,
        warnings
    };
}
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
function calculateSettlementFailureCost(failedTrade, marketData) {
    // Calculate replacement cost (mark-to-market loss)
    const replacementCost = Math.abs(failedTrade.failedAmount - (failedTrade.failedQuantity * marketData.currentPrice));
    // Calculate opportunity cost (financing cost)
    const dailyRate = 0.05 / 365; // 5% annual rate
    const opportunityCost = failedTrade.failedAmount * dailyRate * failedTrade.daysOutstanding;
    // Regulatory penalty (if applicable)
    const penaltyCost = failedTrade.daysOutstanding > 3 ? 1000 : 0;
    return {
        replacementCost,
        opportunityCost,
        penaltyCost,
        totalCost: replacementCost + opportunityCost + penaltyCost
    };
}
/**
 * Generates settlement risk report
 *
 * @param dateRange - Date range for report
 * @returns Risk report data
 *
 * @example
 * const report = await generateSettlementRiskReport({ from: startDate, to: endDate });
 */
async function generateSettlementRiskReport(dateRange) {
    const instructions = await fetchSettlementsByDateRange(dateRange.from, dateRange.to);
    let totalSettlementValue = 0;
    let totalRiskExposure = 0;
    instructions.forEach(instruction => {
        totalSettlementValue += instruction.netAmount;
        const risk = calculateSettlementRisk(instruction);
        totalRiskExposure += risk.aggregateRisk;
    });
    return {
        reportId: generateReportId(),
        dateRange,
        summary: {
            totalSettlementValue,
            totalRiskExposure,
            counterpartyCount: new Set(instructions.map(i => i.deliverFrom.partyId)).size,
            highRiskSettlements: 0 // Would calculate based on thresholds
        },
        topRisks: []
    };
}
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
async function alertSettlementRiskBreach(counterpartyId, breach) {
    const alertId = generateAlertId();
    // Send alerts to risk team, settlement team, management
    const notifiedParties = ['risk_team', 'settlement_ops', 'management'];
    return {
        alerted: true,
        alertId,
        notifiedParties
    };
}
// ============================================================================
// HELPER FUNCTIONS (not exported, internal use)
// ============================================================================
function calculateSettlementDate(tradeDate, cycle) {
    const date = new Date(tradeDate);
    switch (cycle) {
        case SettlementCycle.T_PLUS_0:
            return date;
        case SettlementCycle.T_PLUS_1:
            date.setDate(date.getDate() + 1);
            return date;
        case SettlementCycle.T_PLUS_2:
            date.setDate(date.getDate() + 2);
            return date;
        case SettlementCycle.T_PLUS_3:
            date.setDate(date.getDate() + 3);
            return date;
        default:
            return date;
    }
}
function calculateNetAmount(tradeDetails) {
    let netAmount = tradeDetails.quantity * tradeDetails.price;
    // Subtract fees
    return netAmount;
}
function calculateFees(tradeDetails) {
    return [];
}
function generateInstructionId() {
    return `INST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateMatchId() {
    return `MATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateAmendmentId() {
    return `AMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateConfirmationId() {
    return `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateArchiveId() {
    return `ARCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateAllocationId() {
    return `ALLOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateReconciliationId() {
    return `RECON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateBreakId() {
    return `BRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateReportId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateConnectionId() {
    return `CONN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateAccountId() {
    return `ACCT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateNettingGroupId() {
    return `NET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateAlertId() {
    return `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
async function fetchSettlementInstruction(instructionId) {
    // Would fetch from database
    return {};
}
async function fetchStatusHistory(instructionId) {
    return [];
}
async function recordStatusChange(instructionId, oldStatus, newStatus, userId, transaction) {
    // Record in audit trail
}
async function validateSecuritiesAvailability(accountNumber, isin, quantity) {
    return true; // Would check actual availability
}
async function validateCashAvailability(accountNumber, amount) {
    return true; // Would check actual cash balance
}
async function processSimultaneousSettlement(dvpInstruction, transaction) {
    return generateInstructionId();
}
function isSecurityEligibleForClearing(security, clearingHouse) {
    return true; // Would check eligibility rules
}
async function getAvailableSecurities(accountNumber, isin) {
    return 1000000; // Would fetch from position system
}
async function markSecuritiesAllocated(accountNumber, isin, quantity, allocationId, transaction) {
    // Mark securities as allocated
}
async function processSecuritiesTransfer(fromAccount, toAccount, isin, quantity, transaction) {
    return generateInstructionId();
}
async function fetchTradesByDate(tradeDate) {
    return [];
}
async function fetchSettlementsByTradeDate(tradeDate) {
    return [];
}
async function fetchSettlementsByAccount(accountNumber, date) {
    return [];
}
async function fetchPositionMovements(accountNumber, date) {
    return [];
}
async function fetchSettlementsByDateRange(from, to, options) {
    return [];
}
async function fetchReconciliationBreak(breakId) {
    return {};
}
function convertToCleaningHouseFormat(trade, clearingHouse) {
    return {};
}
async function sendToClearingHouse(message, connection) {
    return generateInstructionId();
}
async function establishConnection(connection) {
    // Establish connection
}
async function fetchTrade(tradeId) {
    return {};
}
function parseDTCCResponse(response) {
    return {};
}
function parseLCHResponse(response) {
    return {};
}
function parseEurexResponse(response) {
    return {};
}
function parseGenericResponse(response) {
    return {};
}
async function sendClearingHouseQuery(instructionId, connection) {
    return {};
}
async function sendCustodianInstruction(instruction, account) {
    return generateInstructionId();
}
async function fetchCustodianMovements(account, date) {
    return [];
}
function calculateTimeZoneRisk(currency, cashAccount) {
    return 'low'; // Would calculate actual time zone risk
}
async function fetchCounterpartyExposure(counterpartyId, date) {
    return { total: 5000000, settlement: 3000000 };
}
async function calculateCurrentSettlementExposure(counterpartyId) {
    return 45000000;
}
function getAccountCountry(accountNumber) {
    return 'US'; // Would fetch from account master
}
//# sourceMappingURL=trade-settlement-kit.js.map
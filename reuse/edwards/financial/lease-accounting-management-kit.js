"use strict";
/**
 * LOC: LSEACCT001
 * File: /reuse/edwards/financial/lease-accounting-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption for sensitive lease data)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Asset management services
 *   - Healthcare facility lease services
 *   - Financial reporting modules
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyLeaseASC842 = classifyLeaseASC842;
exports.classifyLeaseIFRS16 = classifyLeaseIFRS16;
exports.isSpecializedAsset = isSpecializedAsset;
exports.calculateIncrementalBorrowingRate = calculateIncrementalBorrowingRate;
exports.evaluateRenewalOptions = evaluateRenewalOptions;
exports.generateLeaseSchedule = generateLeaseSchedule;
exports.calculateLeaseAmortization = calculateLeaseAmortization;
exports.processLeasePayment = processLeasePayment;
exports.calculateVariableLeasePayments = calculateVariableLeasePayments;
exports.createRightOfUseAsset = createRightOfUseAsset;
exports.calculateROUDepreciation = calculateROUDepreciation;
exports.recordROUDepreciation = recordROUDepreciation;
exports.disposeROUAsset = disposeROUAsset;
exports.createLeaseLiability = createLeaseLiability;
exports.updateLeaseLiability = updateLeaseLiability;
exports.calculatePresentValueOfPayments = calculatePresentValueOfPayments;
exports.remeasureLeaseLiability = remeasureLeaseLiability;
exports.processLeaseModification = processLeaseModification;
exports.evaluateIfSeparateContract = evaluateIfSeparateContract;
exports.processLeaseExtension = processLeaseExtension;
exports.processLeaseTermination = processLeaseTermination;
exports.calculateTerminationPenalty = calculateTerminationPenalty;
exports.processLeaseExpiration = processLeaseExpiration;
exports.performImpairmentTest = performImpairmentTest;
exports.identifyImpairmentIndicators = identifyImpairmentIndicators;
exports.recordImpairmentLoss = recordImpairmentLoss;
exports.generateASC842Disclosure = generateASC842Disclosure;
exports.generateLeaseMaturityAnalysis = generateLeaseMaturityAnalysis;
exports.validateLeaseCompliance = validateLeaseCompliance;
exports.encryptLeaseContractData = encryptLeaseContractData;
exports.decryptLeaseContractData = decryptLeaseContractData;
const crypto = __importStar(require("crypto"));
lessImputed;
Interest: number;
presentValueOfPayments: number;
// ============================================================================
// LEASE CLASSIFICATION FUNCTIONS
// ============================================================================
/**
 * Classifies lease as operating or finance under ASC 842
 * @param leaseData - Lease contract data
 * @param economicLife - Economic life of asset in years
 * @param fairValue - Fair value at commencement
 * @returns Classification result with test criteria
 */
async function classifyLeaseASC842(leaseData, economicLife, fairValue, transaction) {
    const leaseTermYears = leaseData.leaseTerm / 12;
    const presentValueOfPayments = await calculatePresentValueOfPayments(leaseData.leaseId, leaseData.commencementDate, transaction);
    // ASC 842-10-25-2 Classification Tests
    const transferOfOwnership = leaseData.purchaseOption?.reasonablyCertain || false;
    const purchaseOptionReasonablyCertain = leaseData.purchaseOption?.reasonablyCertain || false;
    const leaseTermMajorPartOfLife = (leaseTermYears / economicLife) >= 0.75;
    const presentValueSubstantiallyAll = (presentValueOfPayments / fairValue) >= 0.90;
    const specializedAsset = await isSpecializedAsset(leaseData.assetCategory, leaseData.assetDescription);
    const isFinanceLease = transferOfOwnership ||
        purchaseOptionReasonablyCertain ||
        leaseTermMajorPartOfLife ||
        presentValueSubstantiallyAll ||
        specializedAsset;
    const classificationTest = {
        leaseId: leaseData.leaseId,
        testDate: new Date(),
        transferOfOwnership,
        purchaseOptionReasonablyCertain,
        leaseTermMajorPartOfLife,
        presentValueSubstantiallyAll,
        specializedAsset,
        classificationResult: isFinanceLease ? 'finance' : 'operating',
        economicLifeYears: economicLife,
        fairValueAtCommencement: fairValue,
        presentValueOfPayments,
        notes: `ASC 842 classification: ${isFinanceLease ? 'Finance' : 'Operating'} lease`,
    };
    return classificationTest;
}
/**
 * Classifies lease under IFRS 16 (all leases are finance leases except short-term and low-value)
 * @param leaseData - Lease contract data
 * @param assetValue - Asset value
 * @returns Classification result
 */
async function classifyLeaseIFRS16(leaseData, assetValue, transaction) {
    // IFRS 16 - Most leases are finance leases on balance sheet
    const isShortTerm = leaseData.leaseTerm <= 12;
    const isLowValue = assetValue <= 5000; // $5,000 threshold
    const classificationResult = (isShortTerm || isLowValue) ? 'operating' : 'finance';
    return {
        leaseId: leaseData.leaseId,
        testDate: new Date(),
        transferOfOwnership: false,
        purchaseOptionReasonablyCertain: false,
        leaseTermMajorPartOfLife: false,
        presentValueSubstantiallyAll: false,
        specializedAsset: false,
        classificationResult,
        economicLifeYears: 0,
        fairValueAtCommencement: assetValue,
        presentValueOfPayments: 0,
        notes: `IFRS 16 classification: ${classificationResult === 'finance' ? 'Recognized on balance sheet' : 'Exempt'}`,
    };
}
/**
 * Determines if asset is specialized with no alternative use
 * @param assetCategory - Asset category
 * @param description - Asset description
 * @returns True if specialized asset
 */
async function isSpecializedAsset(assetCategory, description) {
    const specializedKeywords = [
        'custom', 'specialized', 'proprietary', 'tenant-specific',
        'custom-built', 'dedicated', 'unique configuration'
    ];
    const descriptionLower = description.toLowerCase();
    return specializedKeywords.some(keyword => descriptionLower.includes(keyword));
}
/**
 * Calculates incremental borrowing rate for lease
 * @param lesseeId - Lessee identifier
 * @param leaseTerm - Lease term in months
 * @param currency - Currency code
 * @returns Incremental borrowing rate
 */
async function calculateIncrementalBorrowingRate(lesseeId, leaseTerm, currency = 'USD', transaction) {
    // Base rate + credit spread + term premium
    const baseRate = await getRiskFreeRate(currency);
    const creditSpread = await getCreditSpread(lesseeId, transaction);
    const termPremium = (leaseTerm / 12) * 0.001; // 10 bps per year
    return baseRate + creditSpread + termPremium;
}
/**
 * Evaluates renewal options for reasonable certainty
 * @param leaseId - Lease identifier
 * @param renewalOptions - Renewal options
 * @returns Options reasonably certain to be exercised
 */
async function evaluateRenewalOptions(leaseId, renewalOptions, transaction) {
    const certainOptions = [];
    for (const option of renewalOptions) {
        // Economic factors indicating reasonable certainty
        const belowMarketRate = option.renewalRate < await getMarketRate(leaseId);
        const significantImprovements = await hasSignificantLeasehold, Improvements;
        (leaseId, transaction);
        const businessCriticality = await isBusinessCritical(leaseId, transaction);
        if (belowMarketRate || significantImprovements || businessCriticality) {
            certainOptions.push({ ...option, reasonablyCertain: true });
        }
    }
    return certainOptions;
}
// ============================================================================
// LEASE SCHEDULE FUNCTIONS
// ============================================================================
/**
 * Generates complete lease payment schedule
 * @param leaseId - Lease identifier
 * @param commencementDate - Lease commencement date
 * @param payments - Payment details
 * @returns Array of payment schedule entries
 */
async function generateLeaseSchedule(leaseId, commencementDate, payments, leaseTerm, discountRate, leaseType, transaction) {
    const schedule = [];
    let remainingLiability = await calculateInitialLeaseLiability(payments, discountRate, leaseTerm);
    const monthlyPayment = payments[0].amount;
    const monthlyRate = discountRate / 12;
    for (let month = 1; month <= leaseTerm; month++) {
        const paymentDate = new Date(commencementDate);
        paymentDate.setMonth(paymentDate.getMonth() + month);
        const interestPortion = leaseType === 'finance' ? remainingLiability * monthlyRate : 0;
        const principalPortion = leaseType === 'finance' ? monthlyPayment - interestPortion : 0;
        const scheduleEntry = {
            scheduleId: 0, // Will be set on save
            leaseId,
            paymentNumber: month,
            paymentDate,
            baseRent: monthlyPayment,
            variableRent: 0,
            commonAreaMaintenance: 0,
            propertyTax: 0,
            insurance: 0,
            totalPayment: monthlyPayment,
            principalPortion,
            interestPortion,
            leaseType,
            fiscalYear: paymentDate.getFullYear(),
            fiscalPeriod: paymentDate.getMonth() + 1,
            isPaid: false,
        };
        schedule.push(scheduleEntry);
        remainingLiability -= principalPortion;
    }
    return schedule;
}
/**
 * Calculates lease payment amortization for finance lease
 * @param initialLiability - Initial lease liability
 * @param discountRate - Discount rate
 * @param leaseTerm - Lease term in months
 * @returns Amortization schedule
 */
async function calculateLeaseAmortization(initialLiability, discountRate, leaseTerm, transaction) {
    const amortization = [];
    const monthlyRate = discountRate / 12;
    const monthlyPayment = (initialLiability * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -leaseTerm));
    let balance = initialLiability;
    for (let period = 1; period <= leaseTerm; period++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        balance -= principal;
        amortization.push({
            period,
            payment: monthlyPayment,
            interest,
            principal,
            balance: Math.max(0, balance), // Avoid negative due to rounding
        });
    }
    return amortization;
}
/**
 * Processes lease payment and updates liability
 * @param scheduleId - Payment schedule ID
 * @param paymentDate - Actual payment date
 * @param paymentAmount - Payment amount
 * @returns Updated payment record
 */
async function processLeasePayment(scheduleId, paymentDate, paymentAmount, transaction) {
    // Update payment schedule
    const scheduleEntry = await getLeasePaymentSchedule(scheduleId, transaction);
    scheduleEntry.isPaid = true;
    scheduleEntry.paidDate = paymentDate;
    // Update lease liability
    if (scheduleEntry.leaseType === 'finance') {
        await updateLeaseLiability(scheduleEntry.leaseId, scheduleEntry.principalPortion, scheduleEntry.interestPortion, transaction);
    }
    // Create journal entry
    await createLeasePaymentJournalEntry(scheduleEntry, paymentDate, transaction);
    return scheduleEntry;
}
/**
 * Calculates variable lease payments
 * @param leaseId - Lease identifier
 * @param paymentDate - Payment date
 * @param variableFactors - Variable payment factors
 * @returns Calculated variable payment
 */
async function calculateVariableLeasePayments(leaseId, paymentDate, variableFactors, transaction) {
    const lease = await getLease(leaseId, transaction);
    let variablePayment = 0;
    // Percentage of sales revenue
    if (variableFactors.salesRevenue) {
        const salesPercentage = 0.05; // 5% of sales
        variablePayment += variableFactors.salesRevenue * salesPercentage;
    }
    // Index-based payments (e.g., CPI)
    if (variableFactors.indexRate) {
        const basePayment = await getBasePayment(leaseId, transaction);
        variablePayment += basePayment * (variableFactors.indexRate - 1);
    }
    // Usage-based payments
    if (variableFactors.usage) {
        const perUnitRate = 10; // $10 per unit
        variablePayment += variableFactors.usage * perUnitRate;
    }
    return variablePayment;
}
// ============================================================================
// RIGHT-OF-USE ASSET FUNCTIONS
// ============================================================================
/**
 * Creates initial right-of-use asset
 * @param leaseId - Lease identifier
 * @param initialCost - Initial cost (PV of lease payments + initial direct costs)
 * @returns ROU asset record
 */
async function createRightOfUseAsset(leaseId, initialCost, usefulLife, transaction) {
    const lease = await getLease(leaseId, transaction);
    const rouAsset = {
        rouAssetId: 0,
        leaseId,
        assetCode: `ROU-${lease.leaseNumber}`,
        assetDescription: `Right-of-Use Asset - ${lease.assetDescription}`,
        commencementDate: lease.commencementDate,
        initialCost,
        accumulatedDepreciation: 0,
        netBookValue: initialCost,
        depreciationMethod: 'straight-line',
        usefulLife,
        impairmentLoss: 0,
    };
    // Create journal entry for ROU asset recognition
    await createROUAssetJournalEntry(rouAsset, transaction);
    return rouAsset;
}
/**
 * Calculates ROU asset depreciation
 * @param rouAssetId - ROU asset identifier
 * @param depreciationDate - Depreciation date
 * @returns Depreciation amount
 */
async function calculateROUDepreciation(rouAssetId, depreciationDate, transaction) {
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    if (rouAsset.depreciationMethod === 'straight-line') {
        const monthlyDepreciation = (rouAsset.initialCost - rouAsset.impairmentLoss) / rouAsset.usefulLife;
        return monthlyDepreciation;
    }
    return 0;
}
/**
 * Records ROU asset depreciation
 * @param rouAssetId - ROU asset identifier
 * @param depreciationAmount - Depreciation amount
 * @param depreciationDate - Depreciation date
 * @returns Updated ROU asset
 */
async function recordROUDepreciation(rouAssetId, depreciationAmount, depreciationDate, transaction) {
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    rouAsset.accumulatedDepreciation += depreciationAmount;
    rouAsset.netBookValue = rouAsset.initialCost - rouAsset.accumulatedDepreciation - rouAsset.impairmentLoss;
    // Create depreciation journal entry
    await createDepreciationJournalEntry(rouAsset, depreciationAmount, depreciationDate, transaction);
    return rouAsset;
}
/**
 * Disposes ROU asset on lease termination
 * @param rouAssetId - ROU asset identifier
 * @param disposalDate - Disposal date
 * @returns Disposal gain/loss
 */
async function disposeROUAsset(rouAssetId, disposalDate, transaction) {
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    const disposalGainLoss = -rouAsset.netBookValue; // Loss if asset has remaining value
    rouAsset.disposalDate = disposalDate;
    rouAsset.disposalValue = 0;
    // Create disposal journal entry
    await createROUDisposalJournalEntry(rouAsset, disposalGainLoss, transaction);
    return disposalGainLoss;
}
// ============================================================================
// LEASE LIABILITY FUNCTIONS
// ============================================================================
/**
 * Creates initial lease liability
 * @param leaseId - Lease identifier
 * @param presentValueOfPayments - PV of lease payments
 * @param discountRate - Discount rate
 * @returns Lease liability record
 */
async function createLeaseLiability(leaseId, presentValueOfPayments, discountRate, transaction) {
    const lease = await getLease(leaseId, transaction);
    const liability = {
        liabilityId: 0,
        leaseId,
        commencementDate: lease.commencementDate,
        initialLiability: presentValueOfPayments,
        currentLiability: presentValueOfPayments,
        principalPaid: 0,
        interestPaid: 0,
        remainingBalance: presentValueOfPayments,
        discountRate,
        incrementalBorrowingRate: discountRate,
        presentValueFactor: 1,
    };
    // Create journal entry for lease liability recognition
    await createLeaseLiabilityJournalEntry(liability, transaction);
    return liability;
}
/**
 * Updates lease liability after payment
 * @param leaseId - Lease identifier
 * @param principalPortion - Principal portion of payment
 * @param interestPortion - Interest portion of payment
 * @returns Updated liability
 */
async function updateLeaseLiability(leaseId, principalPortion, interestPortion, transaction) {
    const liability = await getLeaseLiability(leaseId, transaction);
    liability.principalPaid += principalPortion;
    liability.interestPaid += interestPortion;
    liability.remainingBalance -= principalPortion;
    liability.currentLiability = liability.remainingBalance;
    return liability;
}
/**
 * Calculates present value of lease payments
 * @param leaseId - Lease identifier
 * @param commencementDate - Commencement date
 * @returns Present value
 */
async function calculatePresentValueOfPayments(leaseId, commencementDate, transaction) {
    const schedule = await getLeasePaymentSchedule, ByLeaseId;
    (leaseId, transaction);
    const discountRate = await getLeaseDiscountRate(leaseId, transaction);
    const monthlyRate = discountRate / 12;
    let presentValue = 0;
    for (let i = 0; i < schedule.length; i++) {
        const payment = schedule[i].totalPayment;
        const periods = i + 1;
        const pv = payment / Math.pow(1 + monthlyRate, periods);
        presentValue += pv;
    }
    return presentValue;
}
/**
 * Remeasures lease liability on modification
 * @param leaseId - Lease identifier
 * @param modificationDate - Modification date
 * @param newDiscountRate - New discount rate
 * @returns Remeasured liability
 */
async function remeasureLeaseLiability(leaseId, modificationDate, newDiscountRate, transaction) {
    const liability = await getLeaseLiability(leaseId, transaction);
    const discountRate = newDiscountRate || liability.discountRate;
    // Recalculate PV of remaining payments
    const remainingPayments = await getRemainingLeasePayments(leaseId, modificationDate, transaction);
    const newPresentValue = await calculatePVOfPayments(remainingPayments, discountRate);
    const adjustment = newPresentValue - liability.remainingBalance;
    liability.currentLiability = newPresentValue;
    liability.remainingBalance = newPresentValue;
    liability.discountRate = discountRate;
    // Adjust ROU asset for remeasurement
    await adjustROUAssetForRemeasurement(leaseId, adjustment, transaction);
    return liability;
}
// ============================================================================
// LEASE MODIFICATION FUNCTIONS
// ============================================================================
/**
 * Processes lease modification
 * @param leaseId - Lease identifier
 * @param modification - Modification details
 * @returns Modification record
 */
async function processLeaseModification(leaseId, modification, transaction) {
    const lease = await getLease(leaseId, transaction);
    // Determine if modification is separate contract or modification of existing
    const isSeparateContract = await evaluateIfSeparateContract(modification, transaction);
    const modificationRecord = {
        modificationId: 0,
        leaseId,
        modificationDate: modification.modificationDate,
        modificationType: modification.modificationType,
        description: modification.description,
        originalLeaseTerm: lease.leaseTerm,
        revisedLeaseTerm: modification.revisedLeaseTerm,
        originalPayment: modification.originalPayment,
        revisedPayment: modification.revisedPayment,
        remeasurementRequired: !isSeparateContract,
        newDiscountRate: modification.newDiscountRate,
        accountingTreatment: isSeparateContract ? 'separate-contract' : 'modify-existing',
        approvedBy: modification.approvedBy,
        approvalDate: modification.approvalDate,
    };
    if (!isSeparateContract) {
        // Remeasure lease liability and ROU asset
        await remeasureLeaseLiability(leaseId, modification.modificationDate, modification.newDiscountRate, transaction);
    }
    // Update lease status
    lease.status = 'modified';
    return modificationRecord;
}
/**
 * Evaluates if modification should be accounted as separate contract
 * @param modification - Modification details
 * @returns True if separate contract
 */
async function evaluateIfSeparateContract(modification, transaction) {
    // Separate contract if:
    // 1. Adds right to use additional asset
    // 2. Consideration is commensurate with standalone price
    const isScopeIncrease = modification.modificationType === 'scope-increase';
    const isCommensuratePrice = true; // Simplified - would compare to market rates
    return isScopeIncrease && isCommensuratePrice;
}
/**
 * Processes lease term extension
 * @param leaseId - Lease identifier
 * @param extensionMonths - Months to extend
 * @param newPaymentAmount - New payment amount
 * @returns Modified lease
 */
async function processLeaseExtension(leaseId, extensionMonths, newPaymentAmount, transaction) {
    const lease = await getLease(leaseId, transaction);
    const modification = {
        modificationDate: new Date(),
        modificationType: 'term-extension',
        description: `Lease term extended by ${extensionMonths} months`,
        originalLeaseTerm: lease.leaseTerm,
        revisedLeaseTerm: lease.leaseTerm + extensionMonths,
        originalPayment: newPaymentAmount,
        revisedPayment: newPaymentAmount,
        approvedBy: 'system',
        approvalDate: new Date(),
    };
    await processLeaseModification(leaseId, modification, transaction);
    lease.leaseTerm += extensionMonths;
    lease.expirationDate = new Date(lease.expirationDate.getTime() + extensionMonths * 30 * 24 * 60 * 60 * 1000);
    return lease;
}
// ============================================================================
// LEASE TERMINATION FUNCTIONS
// ============================================================================
/**
 * Processes early lease termination
 * @param leaseId - Lease identifier
 * @param terminationDate - Termination date
 * @param terminationReason - Reason for termination
 * @returns Termination record
 */
async function processLeaseTermination(leaseId, terminationDate, terminationReason, transaction) {
    const lease = await getLease(leaseId, transaction);
    const liability = await getLeaseLiability(leaseId, transaction);
    const rouAsset = await getRightOfUseAssetByLeaseId(leaseId, transaction);
    // Calculate termination penalty
    const terminationPenalty = await calculateTerminationPenalty(leaseId, terminationDate, transaction);
    // Settlement amount = remaining liability + penalty
    const settlementAmount = liability.remainingBalance + terminationPenalty;
    // Dispose ROU asset
    const rouDisposalGainLoss = await disposeROUAsset(rouAsset.rouAssetId, terminationDate, transaction);
    // Settle liability
    const liabilitySettlementGainLoss = -liability.remainingBalance;
    const totalGainLoss = rouDisposalGainLoss + liabilitySettlementGainLoss - terminationPenalty;
    const termination = {
        terminationId: 0,
        leaseId,
        terminationDate,
        terminationReason: terminationReason,
        terminationPenalty,
        settlementAmount,
        rouAssetDisposalGainLoss: rouDisposalGainLoss,
        liabilitySettlementGainLoss,
        totalGainLoss,
        processedBy: 'system',
        processedDate: new Date(),
    };
    // Update lease status
    lease.status = 'terminated';
    // Create termination journal entries
    await createTerminationJournalEntries(termination, transaction);
    return termination;
}
/**
 * Calculates lease termination penalty
 * @param leaseId - Lease identifier
 * @param terminationDate - Termination date
 * @returns Penalty amount
 */
async function calculateTerminationPenalty(leaseId, terminationDate, transaction) {
    const lease = await getLease(leaseId, transaction);
    if (lease.terminationOption) {
        return lease.terminationOption.terminationPenalty;
    }
    // Default penalty: 3 months of rent
    const monthlyPayment = await getMonthlyPayment(leaseId, transaction);
    return monthlyPayment * 3;
}
/**
 * Processes lease expiration
 * @param leaseId - Lease identifier
 * @returns Updated lease
 */
async function processLeaseExpiration(leaseId, transaction) {
    const lease = await getLease(leaseId, transaction);
    // Verify all payments made
    const unpaidPayments = await getUnpaidLeasePayments(leaseId, transaction);
    if (unpaidPayments.length > 0) {
        throw new Error('Cannot expire lease with unpaid payments');
    }
    // Dispose ROU asset
    const rouAsset = await getRightOfUseAssetByLeaseId(leaseId, transaction);
    await disposeROUAsset(rouAsset.rouAssetId, lease.expirationDate, transaction);
    lease.status = 'expired';
    return lease;
}
// ============================================================================
// IMPAIRMENT TESTING FUNCTIONS
// ============================================================================
/**
 * Performs ROU asset impairment test
 * @param rouAssetId - ROU asset identifier
 * @param testDate - Test date
 * @returns Impairment test results
 */
async function performImpairmentTest(rouAssetId, testDate, transaction) {
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    // Identify impairment indicators
    const indicators = await identifyImpairmentIndicators(rouAssetId, transaction);
    if (indicators.length === 0) {
        return {
            impairmentTestId: 0,
            rouAssetId,
            leaseId: rouAsset.leaseId,
            testDate,
            carryingAmount: rouAsset.netBookValue,
            recoverableAmount: rouAsset.netBookValue,
            fairValueLessCostsToSell: 0,
            valueInUse: 0,
            impairmentLoss: 0,
            impairmentIndicators: [],
            reversalOfImpairment: 0,
            testedBy: 'system',
        };
    }
    // Calculate recoverable amount
    const fairValueLessCosts = await calculateFairValueLessCostsToSell(rouAssetId, transaction);
    const valueInUse = await calculateValueInUse(rouAssetId, transaction);
    const recoverableAmount = Math.max(fairValueLessCosts, valueInUse);
    const carryingAmount = rouAsset.netBookValue;
    const impairmentLoss = Math.max(0, carryingAmount - recoverableAmount);
    const impairmentTest = {
        impairmentTestId: 0,
        rouAssetId,
        leaseId: rouAsset.leaseId,
        testDate,
        carryingAmount,
        recoverableAmount,
        fairValueLessCostsToSell: fairValueLessCosts,
        valueInUse,
        impairmentLoss,
        impairmentIndicators: indicators,
        reversalOfImpairment: 0,
        testedBy: 'system',
    };
    if (impairmentLoss > 0) {
        await recordImpairmentLoss(rouAssetId, impairmentLoss, transaction);
    }
    return impairmentTest;
}
/**
 * Identifies impairment indicators for ROU asset
 * @param rouAssetId - ROU asset identifier
 * @returns Array of impairment indicators
 */
async function identifyImpairmentIndicators(rouAssetId, transaction) {
    const indicators = [];
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    // Market value decline
    const marketValueDecline = await hasSignificantMarketValueDecline(rouAsset.leaseId, transaction);
    if (marketValueDecline) {
        indicators.push('Significant market value decline');
    }
    // Asset obsolescence
    const isObsolete = await isAssetObsolete(rouAsset.assetDescription, transaction);
    if (isObsolete) {
        indicators.push('Asset obsolescence');
    }
    // Adverse changes in use
    const adverseChanges = await hasAdverseChangesInUse(rouAsset.leaseId, transaction);
    if (adverseChanges) {
        indicators.push('Adverse changes in asset use');
    }
    return indicators;
}
/**
 * Records impairment loss for ROU asset
 * @param rouAssetId - ROU asset identifier
 * @param impairmentLoss - Impairment loss amount
 * @returns Updated ROU asset
 */
async function recordImpairmentLoss(rouAssetId, impairmentLoss, transaction) {
    const rouAsset = await getRightOfUseAsset(rouAssetId, transaction);
    rouAsset.impairmentLoss += impairmentLoss;
    rouAsset.netBookValue -= impairmentLoss;
    // Create impairment journal entry
    await createImpairmentJournalEntry(rouAsset, impairmentLoss, transaction);
    return rouAsset;
}
// ============================================================================
// COMPLIANCE AND DISCLOSURE FUNCTIONS
// ============================================================================
/**
 * Generates ASC 842 lease disclosure
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Disclosure data
 */
async function generateASC842Disclosure(fiscalYear, fiscalPeriod, transaction) {
    const operatingLeases = await getOperatingLeases(fiscalYear, fiscalPeriod, transaction);
    const financeLeases = await getFinanceLeases(fiscalYear, fiscalPeriod, transaction);
    const disclosure = {
        disclosureId: 0,
        fiscalYear,
        fiscalPeriod,
        totalOperatingLeaseExpense: await calculateOperatingLeaseExpense(operatingLeases, transaction),
        totalFinanceLeaseDepreciation: await calculateFinanceLeaseDepreciation(financeLeases, transaction),
        totalFinanceLeaseInterest: await calculateFinanceLeaseInterest(financeLeases, transaction),
        totalShortTermLeaseExpense: await calculateShortTermLeaseExpense(fiscalYear, fiscalPeriod, transaction),
        totalVariableLeaseExpense: await calculateVariableLeaseExpense(fiscalYear, fiscalPeriod, transaction),
        cashPaidForOperatingLeases: await calculateCashPaidForOperatingLeases(operatingLeases, transaction),
        cashPaidForFinanceLeases: await calculateCashPaidForFinanceLeases(financeLeases, transaction),
        weightedAverageDiscountRate: await calculateWeightedAverageDiscountRate(transaction),
        weightedAverageRemainingTerm: await calculateWeightedAverageRemainingTerm(transaction),
    };
    return disclosure;
}
/**
 * Generates lease maturity analysis
 * @param asOfDate - Analysis date
 * @returns Maturity analysis
 */
async function generateLeaseMaturityAnalysis(asOfDate, transaction) {
    const allLeases = await getActiveLeases(transaction);
    const currentYear = asOfDate.getFullYear();
    let year1 = 0, year2 = 0, year3 = 0, year4 = 0, year5 = 0, thereafter = 0;
    for (const lease of allLeases) {
        const schedule = await getLeasePaymentScheduleByLeaseId(lease.leaseId, transaction);
        for (const payment of schedule) {
            if (!payment.isPaid) {
                const paymentYear = payment.paymentDate.getFullYear();
                const yearDiff = paymentYear - currentYear;
                if (yearDiff === 0)
                    year1 += payment.totalPayment;
                else if (yearDiff === 1)
                    year2 += payment.totalPayment;
                else if (yearDiff === 2)
                    year3 += payment.totalPayment;
                else if (yearDiff === 3)
                    year4 += payment.totalPayment;
                else if (yearDiff === 4)
                    year5 += payment.totalPayment;
                else
                    thereafter += payment.totalPayment;
            }
        }
    }
    const totalUndiscounted = year1 + year2 + year3 + year4 + year5 + thereafter;
    const presentValue = await calculateTotalPresentValueOfLeases(transaction);
    const imputedInterest = totalUndiscounted - presentValue;
    return {
        fiscalYear: currentYear,
        year1Payments: year1,
        year2Payments: year2,
        year3Payments: year3,
        year4Payments: year4,
        year5Payments: year5,
        thereafter,
        totalUndiscountedCashFlows: totalUndiscounted,
        lessImputedInterest: imputedInterest,
        presentValueOfPayments: presentValue,
    };
}
/**
 * Validates lease accounting compliance with ASC 842/IFRS 16
 * @param leaseId - Lease identifier
 * @returns Validation results
 */
async function validateLeaseCompliance(leaseId, transaction) {
    const issues = [];
    const lease = await getLease(leaseId, transaction);
    // Verify lease classification
    const classification = await verifyLeaseClassification(leaseId, transaction);
    if (!classification.isValid) {
        issues.push('Lease classification does not match criteria');
    }
    // Verify ROU asset exists
    const rouAsset = await getRightOfUseAssetByLeaseId(leaseId, transaction);
    if (!rouAsset && lease.leaseType !== 'short-term') {
        issues.push('Missing ROU asset for non-short-term lease');
    }
    // Verify lease liability exists
    const liability = await getLeaseLiability(leaseId, transaction);
    if (!liability && lease.leaseType !== 'short-term') {
        issues.push('Missing lease liability for non-short-term lease');
    }
    // Verify payment schedule
    const schedule = await getLeasePaymentScheduleByLeaseId(leaseId, transaction);
    if (schedule.length === 0) {
        issues.push('Missing payment schedule');
    }
    return {
        isCompliant: issues.length === 0,
        issues,
    };
}
// ============================================================================
// SECURITY AND ENCRYPTION FUNCTIONS
// ============================================================================
/**
 * Encrypts sensitive lease contract data
 * @param contractData - Contract data to encrypt
 * @param encryptionKey - Encryption key
 * @returns Encrypted contract data
 */
async function encryptLeaseContractData(contractData, encryptionKey) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(contractData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}
/**
 * Decrypts sensitive lease contract data
 * @param encryptedData - Encrypted data
 * @param encryptionKey - Encryption key
 * @returns Decrypted contract data
 */
async function decryptLeaseContractData(encryptedData, encryptionKey) {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }
    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function getLease(leaseId, transaction) {
    // Database lookup implementation
    return {};
}
async function getRightOfUseAsset(rouAssetId, transaction) {
    return {};
}
async function getRightOfUseAssetByLeaseId(leaseId, transaction) {
    return {};
}
async function getLeaseLiability(leaseId, transaction) {
    return {};
}
async function getLeasePaymentSchedule(scheduleId, transaction) {
    return {};
}
async function getLeasePaymentScheduleByLeaseId(leaseId, transaction) {
    return [];
}
async function getRiskFreeRate(currency) {
    // Get risk-free rate for currency
    return 0.025; // 2.5%
}
async function getCreditSpread(lesseeId, transaction) {
    // Get credit spread based on lessee creditworthiness
    return 0.015; // 1.5%
}
async function getMarketRate(leaseId) {
    return 0.05;
}
async function hasSignificantLeaseholdImprovements(leaseId, transaction) {
    return false;
}
async function isBusinessCritical(leaseId, transaction) {
    return false;
}
async function calculateInitialLeaseLiability(payments, discountRate, leaseTerm) {
    return payments[0].amount * leaseTerm;
}
async function createLeasePaymentJournalEntry(schedule, paymentDate, transaction) { }
async function createROUAssetJournalEntry(rouAsset, transaction) { }
async function createDepreciationJournalEntry(rouAsset, amount, date, transaction) { }
async function createROUDisposalJournalEntry(rouAsset, gainLoss, transaction) { }
async function createLeaseLiabilityJournalEntry(liability, transaction) { }
async function getLeaseDiscountRate(leaseId, transaction) {
    return 0.05;
}
async function getRemainingLeasePayments(leaseId, asOfDate, transaction) {
    return [];
}
async function calculatePVOfPayments(payments, discountRate) {
    return 0;
}
async function adjustROUAssetForRemeasurement(leaseId, adjustment, transaction) { }
async function getBasePayment(leaseId, transaction) {
    return 1000;
}
async function createTerminationJournalEntries(termination, transaction) { }
async function getMonthlyPayment(leaseId, transaction) {
    return 1000;
}
async function getUnpaidLeasePayments(leaseId, transaction) {
    return [];
}
async function calculateFairValueLessCostsToSell(rouAssetId, transaction) {
    return 0;
}
async function calculateValueInUse(rouAssetId, transaction) {
    return 0;
}
async function hasSignificantMarketValueDecline(leaseId, transaction) {
    return false;
}
async function isAssetObsolete(description, transaction) {
    return false;
}
async function hasAdverseChangesInUse(leaseId, transaction) {
    return false;
}
async function createImpairmentJournalEntry(rouAsset, impairmentLoss, transaction) { }
async function getOperatingLeases(fiscalYear, fiscalPeriod, transaction) {
    return [];
}
async function getFinanceLeases(fiscalYear, fiscalPeriod, transaction) {
    return [];
}
async function calculateOperatingLeaseExpense(leases, transaction) {
    return 0;
}
async function calculateFinanceLeaseDepreciation(leases, transaction) {
    return 0;
}
async function calculateFinanceLeaseInterest(leases, transaction) {
    return 0;
}
async function calculateShortTermLeaseExpense(fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
async function calculateVariableLeaseExpense(fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
async function calculateCashPaidForOperatingLeases(leases, transaction) {
    return 0;
}
async function calculateCashPaidForFinanceLeases(leases, transaction) {
    return 0;
}
async function calculateWeightedAverageDiscountRate(transaction) {
    return 0.05;
}
async function calculateWeightedAverageRemainingTerm(transaction) {
    return 36;
}
async function getActiveLeases(transaction) {
    return [];
}
async function calculateTotalPresentValueOfLeases(transaction) {
    return 0;
}
async function verifyLeaseClassification(leaseId, transaction) {
    return { isValid: true };
}
//# sourceMappingURL=lease-accounting-management-kit.js.map
/**
 * LOC: INS-POLICYCANCELLATIONKIT-001
 * File: /reuse/insurance/policy-cancellation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Domain-specific modules
 *   - Financial systems
 */
export interface GenericData {
    id?: string;
    [key: string]: any;
}
/**
 * initiateCancellation - Production-ready function
 */
export declare function initiateCancellation(data: any, transaction?: any): Promise<any>;
/**
 * calculateEarnedPremium - Production-ready function
 */
export declare function calculateEarnedPremium(data: any, transaction?: any): Promise<any>;
/**
 * calculateShortRateRefund - Production-ready function
 */
export declare function calculateShortRateRefund(data: any, transaction?: any): Promise<any>;
/**
 * calculateProRataRefund - Production-ready function
 */
export declare function calculateProRataRefund(data: any, transaction?: any): Promise<any>;
/**
 * processFlatCancellation - Production-ready function
 */
export declare function processFlatCancellation(data: any, transaction?: any): Promise<any>;
/**
 * validateNoticePeriodd - Production-ready function
 */
export declare function validateNoticePeriodd(data: any, transaction?: any): Promise<any>;
/**
 * applyStateCancellationRules - Production-ready function
 */
export declare function applyStateCancellationRules(data: any, transaction?: any): Promise<any>;
/**
 * processNonPaymentCancellation - Production-ready function
 */
export declare function processNonPaymentCancellation(data: any, transaction?: any): Promise<any>;
/**
 * processMaterialMisrepresentation - Production-ready function
 */
export declare function processMaterialMisrepresentation(data: any, transaction?: any): Promise<any>;
/**
 * processInsuredRequestedCancellation - Production-ready function
 */
export declare function processInsuredRequestedCancellation(data: any, transaction?: any): Promise<any>;
/**
 * processCarrierInitiatedCancellation - Production-ready function
 */
export declare function processCarrierInitiatedCancellation(data: any, transaction?: any): Promise<any>;
/**
 * generateCancellationNotice - Production-ready function
 */
export declare function generateCancellationNotice(data: any, transaction?: any): Promise<any>;
/**
 * deliverCancellationNotice - Production-ready function
 */
export declare function deliverCancellationNotice(data: any, transaction?: any): Promise<any>;
/**
 * trackCancellationEffectiveDate - Production-ready function
 */
export declare function trackCancellationEffectiveDate(data: any, transaction?: any): Promise<any>;
/**
 * calculateRefundAmount - Production-ready function
 */
export declare function calculateRefundAmount(data: any, transaction?: any): Promise<any>;
/**
 * processRefundPayment - Production-ready function
 */
export declare function processRefundPayment(data: any, transaction?: any): Promise<any>;
/**
 * handlePostCancellationClaims - Production-ready function
 */
export declare function handlePostCancellationClaims(data: any, transaction?: any): Promise<any>;
/**
 * processReinstatementRequest - Production-ready function
 */
export declare function processReinstatementRequest(data: any, transaction?: any): Promise<any>;
/**
 * calculateReinstatementPremium - Production-ready function
 */
export declare function calculateReinstatementPremium(data: any, transaction?: any): Promise<any>;
/**
 * restorePolicy - Production-ready function
 */
export declare function restorePolicy(data: any, transaction?: any): Promise<any>;
/**
 * trackCancellationReasons - Production-ready function
 */
export declare function trackCancellationReasons(data: any, transaction?: any): Promise<any>;
/**
 * analyzeCancellationTrends - Production-ready function
 */
export declare function analyzeCancellationTrends(data: any, transaction?: any): Promise<any>;
/**
 * identifyRetentionOpportunities - Production-ready function
 */
export declare function identifyRetentionOpportunities(data: any, transaction?: any): Promise<any>;
/**
 * createWinbackCampaign - Production-ready function
 */
export declare function createWinbackCampaign(data: any, transaction?: any): Promise<any>;
/**
 * processCourtOrderedCancellation - Production-ready function
 */
export declare function processCourtOrderedCancellation(data: any, transaction?: any): Promise<any>;
/**
 * handleBankruptcyCancellation - Production-ready function
 */
export declare function handleBankruptcyCancellation(data: any, transaction?: any): Promise<any>;
/**
 * processDeathCancellation - Production-ready function
 */
export declare function processDeathCancellation(data: any, transaction?: any): Promise<any>;
/**
 * transferPolicyOnCancellation - Production-ready function
 */
export declare function transferPolicyOnCancellation(data: any, transaction?: any): Promise<any>;
/**
 * notifyCancellationToReinsurer - Production-ready function
 */
export declare function notifyCancellationToReinsurer(data: any, transaction?: any): Promise<any>;
/**
 * updateCancellationMetrics - Production-ready function
 */
export declare function updateCancellationMetrics(data: any, transaction?: any): Promise<any>;
/**
 * generateCancellationReport - Production-ready function
 */
export declare function generateCancellationReport(data: any, transaction?: any): Promise<any>;
/**
 * auditCancellationCompliance - Production-ready function
 */
export declare function auditCancellationCompliance(data: any, transaction?: any): Promise<any>;
/**
 * validateCancellationAuthority - Production-ready function
 */
export declare function validateCancellationAuthority(data: any, transaction?: any): Promise<any>;
/**
 * rescindCancellation - Production-ready function
 */
export declare function rescindCancellation(data: any, transaction?: any): Promise<any>;
/**
 * modifyCancellationDate - Production-ready function
 */
export declare function modifyCancellationDate(data: any, transaction?: any): Promise<any>;
/**
 * processCancellationAppeal - Production-ready function
 */
export declare function processCancellationAppeal(data: any, transaction?: any): Promise<any>;
/**
 * calculateCancellationPenalty - Production-ready function
 */
export declare function calculateCancellationPenalty(data: any, transaction?: any): Promise<any>;
/**
 * refundUnusedFees - Production-ready function
 */
export declare function refundUnusedFees(data: any, transaction?: any): Promise<any>;
/**
 * closeCancellationWorkflow - Production-ready function
 */
export declare function closeCancellationWorkflow(data: any, transaction?: any): Promise<any>;
/**
 * archiveCancelledPolicy - Production-ready function
 */
export declare function archiveCancelledPolicy(data: any, transaction?: any): Promise<any>;
/**
 * trackCancellationFinancialImpact - Production-ready function
 */
export declare function trackCancellationFinancialImpact(data: any, transaction?: any): Promise<any>;
//# sourceMappingURL=policy-cancellation-kit.d.ts.map
/**
 * LOC: INS-ENDORSEMENTMODIFICATIONKIT-001
 * File: /reuse/insurance/endorsement-modification-kit.ts
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
 * createEndorsement - Production-ready function
 */
export declare function createEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * calculateEndorsementPremium - Production-ready function
 */
export declare function calculateEndorsementPremium(data: any, transaction?: any): Promise<any>;
/**
 * applyProRataCalculation - Production-ready function
 */
export declare function applyProRataCalculation(data: any, transaction?: any): Promise<any>;
/**
 * applyShortRateCalculation - Production-ready function
 */
export declare function applyShortRateCalculation(data: any, transaction?: any): Promise<any>;
/**
 * processNamedInsuredChange - Production-ready function
 */
export declare function processNamedInsuredChange(data: any, transaction?: any): Promise<any>;
/**
 * processAddressChange - Production-ready function
 */
export declare function processAddressChange(data: any, transaction?: any): Promise<any>;
/**
 * addVehicleToPolicy - Production-ready function
 */
export declare function addVehicleToPolicy(data: any, transaction?: any): Promise<any>;
/**
 * removeVehicleFromPolicy - Production-ready function
 */
export declare function removeVehicleFromPolicy(data: any, transaction?: any): Promise<any>;
/**
 * addPropertyToPolicy - Production-ready function
 */
export declare function addPropertyToPolicy(data: any, transaction?: any): Promise<any>;
/**
 * removePropertyFromPolicy - Production-ready function
 */
export declare function removePropertyFromPolicy(data: any, transaction?: any): Promise<any>;
/**
 * changeLienholder - Production-ready function
 */
export declare function changeLienholder(data: any, transaction?: any): Promise<any>;
/**
 * changeMortgagee - Production-ready function
 */
export declare function changeMortgagee(data: any, transaction?: any): Promise<any>;
/**
 * changeCoverageLimit - Production-ready function
 */
export declare function changeCoverageLimit(data: any, transaction?: any): Promise<any>;
/**
 * changeDeductible - Production-ready function
 */
export declare function changeDeductible(data: any, transaction?: any): Promise<any>;
/**
 * addCoverage - Production-ready function
 */
export declare function addCoverage(data: any, transaction?: any): Promise<any>;
/**
 * deleteCoverage - Production-ready function
 */
export declare function deleteCoverage(data: any, transaction?: any): Promise<any>;
/**
 * generateEndorsementDocument - Production-ready function
 */
export declare function generateEndorsementDocument(data: any, transaction?: any): Promise<any>;
/**
 * approveEndorsement - Production-ready function
 */
export declare function approveEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * rejectEndorsement - Production-ready function
 */
export declare function rejectEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * calculateMidTermAdjustment - Production-ready function
 */
export declare function calculateMidTermAdjustment(data: any, transaction?: any): Promise<any>;
/**
 * processRetroactiveEndorsement - Production-ready function
 */
export declare function processRetroactiveEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * processCancellationEndorsement - Production-ready function
 */
export declare function processCancellationEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * processReinstatementEndorsement - Production-ready function
 */
export declare function processReinstatementEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * processBlanketEndorsement - Production-ready function
 */
export declare function processBlanketEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * validateEndorsementEligibility - Production-ready function
 */
export declare function validateEndorsementEligibility(data: any, transaction?: any): Promise<any>;
/**
 * calculateEndorsementFees - Production-ready function
 */
export declare function calculateEndorsementFees(data: any, transaction?: any): Promise<any>;
/**
 * applyEndorsementDiscount - Production-ready function
 */
export declare function applyEndorsementDiscount(data: any, transaction?: any): Promise<any>;
/**
 * trackEndorsementHistory - Production-ready function
 */
export declare function trackEndorsementHistory(data: any, transaction?: any): Promise<any>;
/**
 * rollbackEndorsement - Production-ready function
 */
export declare function rollbackEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * mergeEndorsements - Production-ready function
 */
export declare function mergeEndorsements(data: any, transaction?: any): Promise<any>;
/**
 * splitEndorsement - Production-ready function
 */
export declare function splitEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * transferEndorsement - Production-ready function
 */
export declare function transferEndorsement(data: any, transaction?: any): Promise<any>;
/**
 * exportEndorsementReport - Production-ready function
 */
export declare function exportEndorsementReport(data: any, transaction?: any): Promise<any>;
/**
 * scheduleEndorsementEffectiveDate - Production-ready function
 */
export declare function scheduleEndorsementEffectiveDate(data: any, transaction?: any): Promise<any>;
/**
 * notifyEndorsementStakeholders - Production-ready function
 */
export declare function notifyEndorsementStakeholders(data: any, transaction?: any): Promise<any>;
/**
 * auditEndorsementCompliance - Production-ready function
 */
export declare function auditEndorsementCompliance(data: any, transaction?: any): Promise<any>;
/**
 * calculateEndorsementImpact - Production-ready function
 */
export declare function calculateEndorsementImpact(data: any, transaction?: any): Promise<any>;
/**
 * optimizeEndorsementPricing - Production-ready function
 */
export declare function optimizeEndorsementPricing(data: any, transaction?: any): Promise<any>;
/**
 * detectEndorsementFraud - Production-ready function
 */
export declare function detectEndorsementFraud(data: any, transaction?: any): Promise<any>;
/**
 * generateEndorsementAnalytics - Production-ready function
 */
export declare function generateEndorsementAnalytics(data: any, transaction?: any): Promise<any>;
//# sourceMappingURL=endorsement-modification-kit.d.ts.map
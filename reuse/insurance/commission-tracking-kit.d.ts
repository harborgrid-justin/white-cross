/**
 * LOC: INS-COMMISSIONTRACKINGKIT-001
 * File: /reuse/insurance/commission-tracking-kit.ts
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
 * createCommissionRate - Production-ready function
 */
export declare function createCommissionRate(data: any, transaction?: any): Promise<any>;
/**
 * getApplicableCommissionRate - Production-ready function
 */
export declare function getApplicableCommissionRate(data: any, transaction?: any): Promise<any>;
/**
 * calculateTieredRate - Production-ready function
 */
export declare function calculateTieredRate(data: any, transaction?: any): Promise<any>;
/**
 * calculateCommission - Production-ready function
 */
export declare function calculateCommission(data: any, transaction?: any): Promise<any>;
/**
 * calculateNewBusinessCommission - Production-ready function
 */
export declare function calculateNewBusinessCommission(data: any, transaction?: any): Promise<any>;
/**
 * calculateRenewalCommission - Production-ready function
 */
export declare function calculateRenewalCommission(data: any, transaction?: any): Promise<any>;
/**
 * calculateEndorsementCommission - Production-ready function
 */
export declare function calculateEndorsementCommission(data: any, transaction?: any): Promise<any>;
/**
 * splitCommission - Production-ready function
 */
export declare function splitCommission(data: any, transaction?: any): Promise<any>;
/**
 * calculateBrokerAgentSplit - Production-ready function
 */
export declare function calculateBrokerAgentSplit(data: any, transaction?: any): Promise<any>;
/**
 * createCommissionAdjustment - Production-ready function
 */
export declare function createCommissionAdjustment(data: any, transaction?: any): Promise<any>;
/**
 * processChargeback - Production-ready function
 */
export declare function processChargeback(data: any, transaction?: any): Promise<any>;
/**
 * reverseCommissionOnCancellation - Production-ready function
 */
export declare function reverseCommissionOnCancellation(data: any, transaction?: any): Promise<any>;
/**
 * calculateOverrideCommission - Production-ready function
 */
export declare function calculateOverrideCommission(data: any, transaction?: any): Promise<any>;
/**
 * calculateProductionBonus - Production-ready function
 */
export declare function calculateProductionBonus(data: any, transaction?: any): Promise<any>;
/**
 * calculateContingentCommission - Production-ready function
 */
export declare function calculateContingentCommission(data: any, transaction?: any): Promise<any>;
/**
 * scheduleCommissionPayment - Production-ready function
 */
export declare function scheduleCommissionPayment(data: any, transaction?: any): Promise<any>;
/**
 * processCommissionPayment - Production-ready function
 */
export declare function processCommissionPayment(data: any, transaction?: any): Promise<any>;
/**
 * generateCommissionStatement - Production-ready function
 */
export declare function generateCommissionStatement(data: any, transaction?: any): Promise<any>;
/**
 * exportCommissionStatementPDF - Production-ready function
 */
export declare function exportCommissionStatementPDF(data: any, transaction?: any): Promise<any>;
/**
 * reconcileCommissions - Production-ready function
 */
export declare function reconcileCommissions(data: any, transaction?: any): Promise<any>;
/**
 * identifyCommissionDiscrepancies - Production-ready function
 */
export declare function identifyCommissionDiscrepancies(data: any, transaction?: any): Promise<any>;
/**
 * fileCommissionDispute - Production-ready function
 */
export declare function fileCommissionDispute(data: any, transaction?: any): Promise<any>;
/**
 * resolveCommissionDispute - Production-ready function
 */
export declare function resolveCommissionDispute(data: any, transaction?: any): Promise<any>;
/**
 * generate1099Data - Production-ready function
 */
export declare function generate1099Data(data: any, transaction?: any): Promise<any>;
/**
 * export1099Forms - Production-ready function
 */
export declare function export1099Forms(data: any, transaction?: any): Promise<any>;
/**
 * processCommissionAdvance - Production-ready function
 */
export declare function processCommissionAdvance(data: any, transaction?: any): Promise<any>;
/**
 * recoverCommissionAdvance - Production-ready function
 */
export declare function recoverCommissionAdvance(data: any, transaction?: any): Promise<any>;
/**
 * forecastCommissionEarnings - Production-ready function
 */
export declare function forecastCommissionEarnings(data: any, transaction?: any): Promise<any>;
/**
 * analyzeCommissionTrends - Production-ready function
 */
export declare function analyzeCommissionTrends(data: any, transaction?: any): Promise<any>;
/**
 * calculateYTDCommissions - Production-ready function
 */
export declare function calculateYTDCommissions(data: any, transaction?: any): Promise<any>;
/**
 * projectAnnualEarnings - Production-ready function
 */
export declare function projectAnnualEarnings(data: any, transaction?: any): Promise<any>;
/**
 * calculateCommissionGrowthRate - Production-ready function
 */
export declare function calculateCommissionGrowthRate(data: any, transaction?: any): Promise<any>;
/**
 * analyzeProductLineMix - Production-ready function
 */
export declare function analyzeProductLineMix(data: any, transaction?: any): Promise<any>;
/**
 * calculateRetentionImpact - Production-ready function
 */
export declare function calculateRetentionImpact(data: any, transaction?: any): Promise<any>;
/**
 * evaluateAgentProductivity - Production-ready function
 */
export declare function evaluateAgentProductivity(data: any, transaction?: any): Promise<any>;
/**
 * benchmarkCommissionRates - Production-ready function
 */
export declare function benchmarkCommissionRates(data: any, transaction?: any): Promise<any>;
/**
 * optimizeCommissionStructure - Production-ready function
 */
export declare function optimizeCommissionStructure(data: any, transaction?: any): Promise<any>;
/**
 * detectCommissionAnomalies - Production-ready function
 */
export declare function detectCommissionAnomalies(data: any, transaction?: any): Promise<any>;
/**
 * generateAgentScorecard - Production-ready function
 */
export declare function generateAgentScorecard(data: any, transaction?: any): Promise<any>;
/**
 * calculateLifetimeCommissionValue - Production-ready function
 */
export declare function calculateLifetimeCommissionValue(data: any, transaction?: any): Promise<any>;
//# sourceMappingURL=commission-tracking-kit.d.ts.map
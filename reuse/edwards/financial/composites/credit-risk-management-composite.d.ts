/**
 * LOC: CREDRISKCMP001
 * File: /reuse/edwards/financial/composites/credit-risk-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../credit-management-risk-kit
 *   - ../accounts-receivable-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../revenue-recognition-billing-kit
 *   - ../financial-workflow-approval-kit
 *
 * DOWNSTREAM (imported by):
 *   - Credit management REST API controllers
 *   - Collections dashboards
 *   - Risk assessment services
 *   - Dunning automation services
 */
import { Transaction } from 'sequelize';
export declare class CreditLimitRequest {
    customerId: number;
    requestedLimit: number;
    currency: string;
    justification: string;
    autoApprove: boolean;
}
export declare class CreditLimitResponse {
    creditLimitId: number;
    approvedLimit: number;
    status: string;
    effectiveDate: Date;
    reviewDate: Date;
}
export declare class CreditScoringRequest {
    customerId: number;
    scoringModel: 'internal' | 'experian' | 'equifax' | 'transunion' | 'hybrid';
    includeBureauData: boolean;
    realTimeScoring: boolean;
}
export declare class CreditScoringResponse {
    scoreId: number;
    scoreValue: number;
    riskLevel: string;
    scoreFactors: any;
    recommendedLimit: number;
}
export declare class CollectionsCaseRequest {
    customerId: number;
    caseType: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignTo: string;
    autoInitiateDunning: boolean;
}
export declare class DunningCampaignRequest {
    customerIds: number[];
    dunningLevel: number;
    channel: 'email' | 'sms' | 'phone' | 'letter' | 'portal';
    scheduleTime: Date;
}
export declare class AgingAnalysisRequest {
    asOfDate: Date;
    agingBuckets: number[];
    includeCustomerDetails: boolean;
    groupBy: 'customer' | 'sales_rep' | 'region' | 'product_line';
}
export declare class RiskAssessmentRequest {
    customerId: number;
    assessmentType: 'initial' | 'periodic' | 'triggered' | 'comprehensive';
    includeFinancialRatios: boolean;
    includePaymentHistory: boolean;
}
export declare const orchestrateCreditLimitRequest: (request: CreditLimitRequest, transaction?: Transaction) => Promise<CreditLimitResponse>;
export declare const orchestrateCreditLimitApproval: (creditLimitId: number, approverId: string, approved: boolean, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAutomatedCreditLimitAdjustment: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditUtilizationMonitoring: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditLimitReviewScheduling: (customerId: number, reviewFrequency: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditScoring: (request: CreditScoringRequest, transaction?: Transaction) => Promise<CreditScoringResponse>;
export declare const orchestrateBureauCreditPull: (customerId: number, bureau: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditScoreTrendAnalysis: (customerId: number, months: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditRiskSegmentation: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditHoldPlacement: (customerId: number, holdReason: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAutomatedCreditHoldRelease: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditHoldImpactAnalysis: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsCaseCreation: (request: CollectionsCaseRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsCaseAssignment: (caseId: number, collectorId: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsPrioritization: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsWorkloadBalancing: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsActivityTracking: (caseId: number, activity: any, transaction?: Transaction) => Promise<any>;
export declare const orchestratePromiseToPayManagement: (caseId: number, promiseDate: Date, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestratePaymentPlanCreation: (customerId: number, plan: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateDunningCampaignExecution: (request: DunningCampaignRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateMultiLevelDunning: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateDunningMessagePersonalization: (customerId: number, template: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateDunningResponseTracking: (dunningId: number, response: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateDunningEffectivenessAnalysis: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAgingAnalysis: (request: AgingAnalysisRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCustomerAgingDetail: (customerId: number, asOfDate: Date, transaction?: Transaction) => Promise<any>;
export declare const orchestrateAgingBucketCustomization: (buckets: number[], transaction?: Transaction) => Promise<any>;
export declare const orchestrateDSOCalculation: (period: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCEICalculation: (period: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBadDebtReserveCalculation: (method: string, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBadDebtWriteOff: (customerId: number, amount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateBadDebtRecoveryTracking: (writeOffId: number, recoveryAmount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditInsuranceManagement: (customerId: number, policy: any, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditInsuranceClaimFiling: (customerId: number, claimAmount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateRiskAssessment: (request: RiskAssessmentRequest, transaction?: Transaction) => Promise<any>;
export declare const orchestratePaymentBehaviorAnalysis: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCustomerCreditProfile: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditCheckForOrder: (customerId: number, orderAmount: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditReviewAutomation: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditRiskDashboard: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCollectionsPerformanceMetrics: (period: string, transaction?: Transaction) => Promise<any>;
export declare const orchestratePaymentPrediction: (customerId: number, transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditConcentrationAnalysis: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateEarlyWarningSystem: (transaction?: Transaction) => Promise<any>;
export declare const orchestrateCreditComplianceValidation: (customerId: number, regulations: string[], transaction?: Transaction) => Promise<any>;
export { orchestrateCreditLimitRequest, orchestrateCreditLimitApproval, orchestrateAutomatedCreditLimitAdjustment, orchestrateCreditUtilizationMonitoring, orchestrateCreditLimitReviewScheduling, orchestrateCreditScoring, orchestrateBureauCreditPull, orchestrateCreditScoreTrendAnalysis, orchestrateCreditRiskSegmentation, orchestrateCreditHoldPlacement, orchestrateAutomatedCreditHoldRelease, orchestrateCreditHoldImpactAnalysis, orchestrateCollectionsCaseCreation, orchestrateCollectionsCaseAssignment, orchestrateCollectionsPrioritization, orchestrateCollectionsWorkloadBalancing, orchestrateCollectionsActivityTracking, orchestratePromiseToPayManagement, orchestratePaymentPlanCreation, orchestrateDunningCampaignExecution, orchestrateMultiLevelDunning, orchestrateDunningMessagePersonalization, orchestrateDunningResponseTracking, orchestrateDunningEffectivenessAnalysis, orchestrateAgingAnalysis, orchestrateCustomerAgingDetail, orchestrateAgingBucketCustomization, orchestrateDSOCalculation, orchestrateCEICalculation, orchestrateBadDebtReserveCalculation, orchestrateBadDebtWriteOff, orchestrateBadDebtRecoveryTracking, orchestrateCreditInsuranceManagement, orchestrateCreditInsuranceClaimFiling, orchestrateRiskAssessment, orchestratePaymentBehaviorAnalysis, orchestrateCustomerCreditProfile, orchestrateCreditCheckForOrder, orchestrateCreditReviewAutomation, orchestrateCreditRiskDashboard, orchestrateCollectionsPerformanceMetrics, orchestratePaymentPrediction, orchestrateCreditConcentrationAnalysis, orchestrateEarlyWarningSystem, orchestrateCreditComplianceValidation, };
//# sourceMappingURL=credit-risk-management-composite.d.ts.map
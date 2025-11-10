/**
 * LOC: FGACMP001
 * File: /reuse/edwards/financial/composites/fund-grant-accounting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../fund-grant-accounting-kit
 *   - ../budget-management-control-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../allocation-engines-rules-kit
 *
 * DOWNSTREAM (imported by):
 *   - Fund management REST API controllers
 *   - Grant tracking services
 *   - Compliance reporting modules
 *   - Fund balance dashboards
 *   - Grant billing services
 */
import { Transaction } from 'sequelize';
import { type FundStructure, type FundBalance, type FundRestriction, type GrantAward, type GrantBudget, type GrantExpenditure, type CostSharingAllocation, type GrantComplianceReport, type ComplianceStatus } from '../fund-grant-accounting-kit';
import { type Budget, type BudgetAllocation, type BudgetVariance } from '../budget-management-control-kit';
import { type AuditEntry, type ComplianceRule, type ComplianceReport } from '../audit-trail-compliance-kit';
import { type BalanceSheetReport, type IncomeStatementReport, type FinancialKPI } from '../financial-reporting-analytics-kit';
import { type AllocationRule, type AllocationResult } from '../allocation-engines-rules-kit';
/**
 * Fund management API configuration
 */
export interface FundApiConfig {
    baseUrl: string;
    enableRealtimeAlerts: boolean;
    enableAutomatedCompliance: boolean;
    defaultFiscalYearEnd: Date;
    complianceFramework: 'GASB' | '2CFR200' | 'BOTH';
}
/**
 * Grant management API configuration
 */
export interface GrantApiConfig {
    baseUrl: string;
    autoCalculateIndirectCosts: boolean;
    enableBillingWorkflow: boolean;
    requireCostSharing: boolean;
    federalComplianceEnabled: boolean;
}
/**
 * Fund balance alert configuration
 */
export interface FundBalanceAlert {
    alertId: string;
    fundId: number;
    alertType: 'low_balance' | 'overexpended' | 'restriction_violation' | 'compliance_issue';
    threshold: number;
    currentBalance: number;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: Date;
}
/**
 * Grant compliance validation result
 */
export interface GrantComplianceValidation {
    grantId: number;
    compliant: boolean;
    validationDate: Date;
    violations: ComplianceViolation[];
    recommendations: string[];
    requiresAction: boolean;
}
/**
 * Compliance violation details
 */
export interface ComplianceViolation {
    violationType: string;
    severity: 'minor' | 'major' | 'critical';
    description: string;
    regulationReference: string;
    remediationRequired: boolean;
    dueDate?: Date;
}
/**
 * Fund consolidation request
 */
export interface FundConsolidationRequest {
    fundIds: number[];
    consolidationType: 'sum' | 'net' | 'weighted';
    fiscalYear: number;
    fiscalPeriod: number;
    includeRestricted: boolean;
}
/**
 * Grant billing invoice
 */
export interface GrantBillingInvoice {
    invoiceId: string;
    grantId: number;
    billingPeriod: string;
    directCosts: number;
    indirectCosts: number;
    costSharing: number;
    totalAmount: number;
    status: 'draft' | 'submitted' | 'approved' | 'paid';
    createdDate: Date;
}
/**
 * Creates comprehensive fund structure with budget and compliance setup
 * Composes: createFundStructure, createBudget, createAuditEntry, validateComplianceRule
 *
 * @param fundData - Fund structure data
 * @param budgetAmount - Initial budget amount
 * @param transaction - Database transaction
 * @returns Created fund with budget and compliance configuration
 */
export declare const createFundWithBudgetAndCompliance: (fundData: Partial<FundStructure>, budgetAmount: number, transaction?: Transaction) => Promise<{
    fund: FundStructure;
    budget: Budget;
    audit: AuditEntry;
    compliance: ComplianceRule[];
}>;
/**
 * Retrieves fund structure with real-time balance and compliance status
 * Composes: getFundStructure, getFundBalance, validateFundRestriction, validateGrantCompliance
 *
 * @param fundId - Fund identifier
 * @returns Fund with balance and compliance details
 */
export declare const getFundWithBalanceAndCompliance: (fundId: number) => Promise<{
    fund: FundStructure;
    balance: FundBalance;
    restrictions: FundRestriction[];
    complianceStatus: ComplianceStatus;
    alerts: FundBalanceAlert[];
}>;
/**
 * Updates fund structure with validation and audit trail
 * Composes: updateFundStructure, validateFundRestriction, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param updates - Fund update data
 * @param userId - User making the update
 * @param transaction - Database transaction
 * @returns Updated fund with audit entry
 */
export declare const updateFundWithValidationAndAudit: (fundId: number, updates: Partial<FundStructure>, userId: string, transaction?: Transaction) => Promise<{
    fund: FundStructure;
    audit: AuditEntry;
}>;
/**
 * Activates fund with compliance validation
 * Composes: activateFund, validateComplianceRule, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User activating the fund
 * @returns Activated fund with compliance status
 */
export declare const activateFundWithCompliance: (fundId: number, userId: string) => Promise<{
    fund: FundStructure;
    compliance: boolean;
    audit: AuditEntry;
}>;
/**
 * Closes fund with balance verification and final reporting
 * Composes: closeFund, getFundBalance, generateGASBReport, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User closing the fund
 * @returns Closed fund with final balance and reports
 */
export declare const closeFundWithFinalReporting: (fundId: number, userId: string) => Promise<{
    fund: FundStructure;
    finalBalance: FundBalance;
    gasbReport: any;
    audit: AuditEntry;
}>;
/**
 * Calculates real-time fund balance with restrictions and encumbrances
 * Composes: calculateFundBalance, checkFundAvailability, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param asOfDate - Balance calculation date
 * @returns Comprehensive fund balance details
 */
export declare const calculateComprehensiveFundBalance: (fundId: number, asOfDate?: Date) => Promise<{
    balance: FundBalance;
    available: number;
    restricted: number;
    encumbered: number;
    alerts: FundBalanceAlert[];
}>;
/**
 * Updates fund balance with budget validation
 * Composes: updateFundBalance, validateBudgetTransaction, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param amount - Transaction amount
 * @param transactionType - Type of transaction
 * @param userId - User making the update
 * @returns Updated balance with validation result
 */
export declare const updateFundBalanceWithBudgetValidation: (fundId: number, amount: number, transactionType: "debit" | "credit", userId: string) => Promise<{
    balance: FundBalance;
    budgetValid: boolean;
    audit: AuditEntry;
}>;
/**
 * Checks fund availability for spending with restrictions
 * Composes: checkFundAvailability, validateFundRestriction, enforceFundRestriction
 *
 * @param fundId - Fund identifier
 * @param requestedAmount - Amount to check
 * @returns Availability status with restriction details
 */
export declare const checkFundAvailabilityWithRestrictions: (fundId: number, requestedAmount: number) => Promise<{
    available: boolean;
    availableAmount: number;
    restrictions: FundRestriction[];
    violations: string[];
}>;
/**
 * Generates fund balance alerts based on thresholds
 * Composes: getFundBalance, calculateBudgetVariance, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param balance - Current fund balance
 * @returns List of balance alerts
 */
export declare const generateFundBalanceAlerts: (fundId: number, balance: FundBalance) => Promise<FundBalanceAlert[]>;
/**
 * Creates fund restriction with compliance validation
 * Composes: createFundRestriction, validateComplianceRule, createAuditEntry
 *
 * @param restrictionData - Restriction data
 * @param userId - User creating the restriction
 * @returns Created restriction with compliance status
 */
export declare const createFundRestrictionWithCompliance: (restrictionData: Partial<FundRestriction>, userId: string) => Promise<{
    restriction: FundRestriction;
    compliance: boolean;
    audit: AuditEntry;
}>;
/**
 * Validates and enforces fund restrictions
 * Composes: validateFundRestriction, enforceFundRestriction, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param transactionAmount - Transaction amount
 * @param transactionPurpose - Purpose of transaction
 * @returns Enforcement result with violations
 */
export declare const validateAndEnforceFundRestrictions: (fundId: number, transactionAmount: number, transactionPurpose: string) => Promise<{
    allowed: boolean;
    restrictions: FundRestriction[];
    violations: string[];
    audit: AuditEntry;
}>;
/**
 * Releases fund restriction with authorization
 * Composes: releaseFundRestriction, createAuditEntry, validateComplianceRule
 *
 * @param restrictionId - Restriction identifier
 * @param userId - User releasing the restriction
 * @param reason - Reason for release
 * @returns Released restriction with audit trail
 */
export declare const releaseFundRestrictionWithAuthorization: (restrictionId: number, userId: string, reason: string) => Promise<{
    restriction: FundRestriction;
    audit: AuditEntry;
}>;
/**
 * Creates grant award with budget and compliance setup
 * Composes: createGrantAward, calculateGrantBudget, validateFederalCompliance, createAuditEntry
 *
 * @param grantData - Grant award data
 * @param userId - User creating the grant
 * @returns Created grant with budget and compliance
 */
export declare const createGrantWithBudgetAndCompliance: (grantData: Partial<GrantAward>, userId: string) => Promise<{
    grant: GrantAward;
    budget: GrantBudget;
    compliance: GrantComplianceValidation;
    audit: AuditEntry;
}>;
/**
 * Retrieves grant with expenditure tracking and compliance
 * Composes: getGrantAward, trackGrantExpenditure, validateGrantCompliance, calculateIndirectCosts
 *
 * @param grantId - Grant identifier
 * @returns Grant with expenditures and compliance status
 */
export declare const getGrantWithExpendituresAndCompliance: (grantId: number) => Promise<{
    grant: GrantAward;
    expenditures: GrantExpenditure[];
    indirectCosts: number;
    compliance: GrantComplianceValidation;
    budget: GrantBudget;
}>;
/**
 * Updates grant award with budget recalculation
 * Composes: updateGrantAward, calculateGrantBudget, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param updates - Grant update data
 * @param userId - User making the update
 * @returns Updated grant with recalculated budget
 */
export declare const updateGrantWithBudgetRecalculation: (grantId: number, updates: Partial<GrantAward>, userId: string) => Promise<{
    grant: GrantAward;
    budget: GrantBudget;
    audit: AuditEntry;
}>;
/**
 * Closes grant with final reporting and compliance
 * Composes: closeGrantAward, generateGrantReport, validateFederalCompliance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param userId - User closing the grant
 * @returns Closed grant with final reports
 */
export declare const closeGrantWithFinalReporting: (grantId: number, userId: string) => Promise<{
    grant: GrantAward;
    finalReport: GrantComplianceReport;
    compliance: GrantComplianceValidation;
    audit: AuditEntry;
}>;
/**
 * Validates grant compliance with federal regulations
 * Composes: validateGrantCompliance, validateFederalCompliance, generateComplianceReport
 *
 * @param grantId - Grant identifier
 * @returns Comprehensive compliance validation
 */
export declare const validateComprehensiveGrantCompliance: (grantId: number) => Promise<GrantComplianceValidation>;
/**
 * Calculates and allocates indirect costs to grant
 * Composes: calculateIndirectCosts, createAllocationRule, executeAllocation, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param indirectCostRate - Indirect cost rate percentage
 * @param userId - User executing allocation
 * @returns Indirect cost allocation result
 */
export declare const allocateIndirectCostsToGrant: (grantId: number, indirectCostRate: number, userId: string) => Promise<{
    indirectCosts: number;
    allocation: AllocationResult;
    audit: AuditEntry;
}>;
/**
 * Processes cost sharing allocation for grant
 * Composes: allocateCostSharing, createAllocationRule, validateAllocationRule, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param costSharingData - Cost sharing allocation data
 * @param userId - User processing allocation
 * @returns Cost sharing allocation result
 */
export declare const processCostSharingAllocation: (grantId: number, costSharingData: Partial<CostSharingAllocation>, userId: string) => Promise<{
    costSharing: CostSharingAllocation;
    allocation: AllocationResult;
    audit: AuditEntry;
}>;
/**
 * Calculates allocation amount with validation
 * Composes: calculateAllocationAmount, validateBudgetTransaction, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param allocationRule - Allocation rule
 * @param baseAmount - Base amount for calculation
 * @returns Calculated allocation with validation
 */
export declare const calculateValidatedAllocationAmount: (grantId: number, allocationRule: AllocationRule, baseAmount: number) => Promise<{
    amount: number;
    valid: boolean;
    budgetImpact: BudgetVariance;
}>;
/**
 * Processes grant billing with indirect costs and cost sharing
 * Composes: processGrantBilling, calculateIndirectCosts, allocateCostSharing, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param billingPeriod - Billing period
 * @param userId - User processing billing
 * @returns Grant billing invoice with breakdown
 */
export declare const processGrantBillingWithCosts: (grantId: number, billingPeriod: string, userId: string) => Promise<{
    invoice: GrantBillingInvoice;
    directCosts: number;
    indirectCosts: number;
    costSharing: number;
    audit: AuditEntry;
}>;
/**
 * Tracks and reconciles grant advance
 * Composes: trackGrantAdvance, reconcileGrantAdvance, updateFundBalance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param advanceAmount - Advance amount
 * @param userId - User tracking advance
 * @returns Advance tracking result
 */
export declare const trackAndReconcileGrantAdvance: (grantId: number, advanceAmount: number, userId: string) => Promise<{
    advance: any;
    reconciliation: any;
    fundBalance: FundBalance;
    audit: AuditEntry;
}>;
/**
 * Generates comprehensive GASB fund report
 * Composes: generateGASBReport, generateBalanceSheet, calculateFinancialKPI, createReportDrillDown
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns GASB report with financial statements
 */
export declare const generateComprehensiveGASBReport: (fundId: number, fiscalYear: number) => Promise<{
    gasbReport: any;
    balanceSheet: BalanceSheetReport;
    kpis: FinancialKPI[];
    drillDown: any;
}>;
/**
 * Consolidates multiple fund balances with restrictions
 * Composes: consolidateFundBalances, generateConsolidatedReport, validateFundRestriction
 *
 * @param request - Consolidation request
 * @returns Consolidated fund balance report
 */
export declare const consolidateFundsWithRestrictions: (request: FundConsolidationRequest) => Promise<{
    consolidated: FundBalance;
    breakdown: FundBalance[];
    restrictions: FundRestriction[];
    report: any;
}>;
/**
 * Generates grant compliance report with recommendations
 * Composes: generateGrantReport, validateGrantCompliance, generateComplianceReport, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param reportType - Type of report
 * @returns Comprehensive grant report
 */
export declare const generateComprehensiveGrantReport: (grantId: number, reportType: "financial" | "compliance" | "performance") => Promise<{
    grantReport: GrantComplianceReport;
    compliance: GrantComplianceValidation;
    complianceReport: ComplianceReport;
    audit: AuditEntry;
}>;
/**
 * Generates fund income statement with budget variance
 * Composes: generateIncomeStatement, calculateBudgetVariance, generateBudgetReport
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns Income statement with variance analysis
 */
export declare const generateFundIncomeStatementWithVariance: (fundId: number, fiscalYear: number) => Promise<{
    incomeStatement: IncomeStatementReport;
    budgetVariance: BudgetVariance;
    budgetReport: any;
}>;
/**
 * Creates fund budget with allocation rules
 * Composes: createBudget, createBudgetAllocation, createAllocationRule, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param budgetData - Budget data
 * @param allocations - Budget allocations
 * @param userId - User creating budget
 * @returns Budget with allocations
 */
export declare const createFundBudgetWithAllocations: (fundId: number, budgetData: Partial<Budget>, allocations: Partial<BudgetAllocation>[], userId: string) => Promise<{
    budget: Budget;
    allocations: BudgetAllocation[];
    allocationRules: AllocationRule[];
    audit: AuditEntry;
}>;
/**
 * Checks budget availability with fund restrictions
 * Composes: checkBudgetAvailability, checkFundAvailability, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param amount - Amount to check
 * @returns Availability status with details
 */
export declare const checkComprehensiveBudgetAvailability: (fundId: number, amount: number) => Promise<{
    budgetAvailable: boolean;
    fundAvailable: boolean;
    restrictions: FundRestriction[];
    available: boolean;
}>;
/**
 * Tracks user activity with audit trail
 * Composes: trackUserActivity, createAuditEntry, getAuditTrail
 *
 * @param userId - User identifier
 * @param activity - Activity description
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @returns Activity tracking result
 */
export declare const trackUserActivityWithAudit: (userId: string, activity: string, entityType: string, entityId: number) => Promise<{
    activity: any;
    audit: AuditEntry;
    auditTrail: AuditEntry[];
}>;
/**
 * Generates comprehensive audit trail report
 * Composes: getAuditTrail, generateComplianceReport, validateComplianceRule
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Audit trail report
 */
export declare const generateComprehensiveAuditTrailReport: (entityType: string, entityId: number, startDate: Date, endDate: Date) => Promise<{
    auditTrail: AuditEntry[];
    complianceReport: ComplianceReport;
    summary: any;
}>;
/**
 * Validates comprehensive compliance rules
 * Composes: validateComplianceRule, validateGrantCompliance, validateFederalCompliance
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param complianceFramework - Compliance framework
 * @returns Compliance validation result
 */
export declare const validateComprehensiveCompliance: (entityType: "fund" | "grant", entityId: number, complianceFramework: string) => Promise<{
    rules: boolean;
    entity: ComplianceStatus;
    federal: any;
    overall: boolean;
}>;
/**
 * Monitors fund performance with KPIs
 * Composes: getFundBalance, calculateFinancialKPI, calculateBudgetVariance, generateGASBReport
 *
 * @param fundId - Fund identifier
 * @returns Fund performance metrics
 */
export declare const monitorFundPerformance: (fundId: number) => Promise<{
    balance: FundBalance;
    kpis: FinancialKPI[];
    variance: BudgetVariance;
    performanceScore: number;
}>;
/**
 * Monitors grant performance with expenditure tracking
 * Composes: getGrantAward, trackGrantExpenditure, calculateGrantBudget, validateGrantCompliance
 *
 * @param grantId - Grant identifier
 * @returns Grant performance metrics
 */
export declare const monitorGrantPerformance: (grantId: number) => Promise<{
    grant: GrantAward;
    expenditures: GrantExpenditure[];
    budget: GrantBudget;
    utilizationRate: number;
    compliance: ComplianceStatus;
}>;
export { createFundWithBudgetAndCompliance, getFundWithBalanceAndCompliance, updateFundWithValidationAndAudit, activateFundWithCompliance, closeFundWithFinalReporting, calculateComprehensiveFundBalance, updateFundBalanceWithBudgetValidation, checkFundAvailabilityWithRestrictions, generateFundBalanceAlerts, createFundRestrictionWithCompliance, validateAndEnforceFundRestrictions, releaseFundRestrictionWithAuthorization, createGrantWithBudgetAndCompliance, getGrantWithExpendituresAndCompliance, updateGrantWithBudgetRecalculation, closeGrantWithFinalReporting, validateComprehensiveGrantCompliance, allocateIndirectCostsToGrant, processCostSharingAllocation, calculateValidatedAllocationAmount, processGrantBillingWithCosts, trackAndReconcileGrantAdvance, generateComprehensiveGASBReport, consolidateFundsWithRestrictions, generateComprehensiveGrantReport, generateFundIncomeStatementWithVariance, createFundBudgetWithAllocations, checkComprehensiveBudgetAvailability, trackUserActivityWithAudit, generateComprehensiveAuditTrailReport, validateComprehensiveCompliance, monitorFundPerformance, monitorGrantPerformance, type FundApiConfig, type GrantApiConfig, type FundBalanceAlert, type GrantComplianceValidation, type ComplianceViolation, type FundConsolidationRequest, type GrantBillingInvoice, };
//# sourceMappingURL=fund-grant-accounting-composite.d.ts.map
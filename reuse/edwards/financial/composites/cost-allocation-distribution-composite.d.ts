/**
 * LOC: CADISTCOMP001
 * File: /reuse/edwards/financial/composites/cost-allocation-distribution-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../cost-accounting-allocation-kit
 *   - ../allocation-engines-rules-kit
 *   - ../dimension-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend cost accounting controllers
 *   - Allocation processing job schedulers
 *   - Healthcare department cost services
 *   - Management reporting services
 *   - Product costing modules
 */
/**
 * File: /reuse/edwards/financial/composites/cost-allocation-distribution-composite.ts
 * Locator: WC-EDW-CADIST-COMPOSITE-001
 * Purpose: Comprehensive Cost Allocation & Distribution Composite - Cost pool management, allocation bases, distribution rules, step-down allocations
 *
 * Upstream: Composes functions from cost-accounting-allocation-kit, allocation-engines-rules-kit,
 *           dimension-management-kit, financial-reporting-analytics-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Cost Accounting APIs, ABC Services, Department Allocation, Product Costing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for cost pools, allocation bases, distribution, ABC, overhead allocation, variance analysis
 *
 * LLM Context: Enterprise-grade cost allocation and distribution composite for White Cross healthcare platform.
 * Provides comprehensive cost pool management with multiple allocation methods (direct, step-down, reciprocal),
 * allocation basis calculation with statistical drivers, activity-based costing (ABC), overhead allocation
 * (traditional and ABC), distribution rule engines, cost driver analysis, step-down allocation cascades,
 * reciprocal allocation processing, variance analysis, product/service costing, department cost allocation,
 * and HIPAA-compliant audit trails. Competes with Oracle JD Edwards EnterpriseOne with production-ready
 * cost accounting infrastructure for complex healthcare operations.
 *
 * Cost Allocation Design Principles:
 * - Multi-tier allocation hierarchies with precedence rules
 * - Statistical driver integration for accurate allocations
 * - Activity-based costing for service-intensive operations
 * - Step-down allocation for service department cascades
 * - Reciprocal allocation for mutual service departments
 * - Real-time allocation processing with validation
 * - Comprehensive variance analysis and reporting
 * - Audit trails for regulatory compliance and transparency
 */
import { Transaction } from 'sequelize';
import { type CostPool, type VarianceAnalysis } from '../cost-accounting-allocation-kit';
import { type AllocationRule, type AllocationBasis, type StatisticalDriver, type AllocationResult, type AllocationValidation } from '../allocation-engines-rules-kit';
import { type ManagementDashboard, type SegmentReport } from '../financial-reporting-analytics-kit';
import { type AuditLogEntry } from '../audit-trail-compliance-kit';
/**
 * Cost allocation configuration
 */
export interface CostAllocationConfig {
    fiscalYear: number;
    fiscalPeriod: number;
    allocationMethod: 'direct' | 'step-down' | 'reciprocal' | 'activity-based' | 'hybrid';
    processServiceDepartments: boolean;
    processOverhead: boolean;
    processActivityBased: boolean;
    validateTotals: boolean;
    auditEnabled: boolean;
    autoPostJournals: boolean;
}
/**
 * Allocation batch result
 */
export interface AllocationBatchResult {
    batchId: string;
    processDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    allocationMethod: string;
    poolsProcessed: number;
    totalAllocated: number;
    allocations: AllocationResult[];
    journalEntries: AllocationJournalEntry[];
    errors: string[];
    auditTrail: AuditLogEntry[];
    validationResult: AllocationValidation;
}
/**
 * Allocation journal entry
 */
export interface AllocationJournalEntry {
    entryId: string;
    sourcePool: string;
    targetCostCenter: string;
    allocationAmount: number;
    allocationPercentage: number;
    allocationBasis: string;
    description: string;
}
/**
 * Cost pool summary
 */
export interface CostPoolSummary {
    poolId: number;
    poolCode: string;
    poolName: string;
    poolType: string;
    totalCost: number;
    allocatedCost: number;
    unallocatedCost: number;
    allocationRate: number;
    targetCostCenters: CostCenterAllocation[];
}
/**
 * Cost center allocation
 */
export interface CostCenterAllocation {
    costCenterId: number;
    costCenterCode: string;
    costCenterName: string;
    allocatedAmount: number;
    allocationPercentage: number;
    allocationBasis: string;
    basisValue: number;
}
/**
 * Activity-based costing result
 */
export interface ABCResult {
    activityId: number;
    activityCode: string;
    activityName: string;
    activityType: string;
    totalActivityCost: number;
    activityVolume: number;
    costPerActivity: number;
    costObjectAllocations: CostObjectAllocation[];
}
/**
 * Cost object allocation
 */
export interface CostObjectAllocation {
    costObjectId: string;
    costObjectType: 'product' | 'service' | 'patient' | 'department' | 'project';
    activityConsumption: number;
    allocatedCost: number;
}
/**
 * Step-down allocation sequence
 */
export interface StepDownSequence {
    sequenceNumber: number;
    serviceDepartment: string;
    totalCost: number;
    recipientDepartments: string[];
    allocationBasis: string;
    allocations: Map<string, number>;
}
/**
 * Reciprocal allocation matrix
 */
export interface ReciprocalAllocationMatrix {
    departments: string[];
    costMatrix: number[][];
    allocationMatrix: number[][];
    simultaneousEquations: string[];
    solvedAllocations: Map<string, Map<string, number>>;
}
/**
 * Overhead rate calculation
 */
export interface OverheadRateCalculation {
    poolId: number;
    poolName: string;
    estimatedOverhead: number;
    estimatedActivityBase: number;
    predeterminedRate: number;
    actualOverhead: number;
    actualActivityBase: number;
    appliedOverhead: number;
    underApplied: number;
    overApplied: number;
}
/**
 * Comprehensive variance report
 */
export interface ComprehensiveVarianceReport {
    reportDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    materialVariances: VarianceAnalysis[];
    laborVariances: VarianceAnalysis[];
    overheadVariances: VarianceAnalysis[];
    totalFavorable: number;
    totalUnfavorable: number;
    netVariance: number;
    varianceExplanations: VarianceExplanation[];
}
/**
 * Variance explanation
 */
export interface VarianceExplanation {
    varianceType: string;
    costCenter: string;
    amount: number;
    favorable: boolean;
    explanation: string;
    correctiveAction?: string;
}
/**
 * Creates and initializes cost pool with allocation rules
 * Composes: createCostPool, createAllocationRule, createAuditLog
 */
export declare const initializeCostPoolWithRules: (sequelize: any, poolCode: string, poolName: string, poolType: "overhead" | "direct" | "indirect" | "service" | "activity", allocationMethod: "direct" | "step-down" | "reciprocal" | "activity-based", fiscalYear: number, fiscalPeriod: number, allocationBasis: string, targetDepartments: string[], userId: string, transaction?: Transaction) => Promise<{
    pool: CostPool;
    rule: AllocationRule;
    auditLogId: number;
}>;
/**
 * Adds costs to multiple pools with validation
 * Composes: addCostToPool, validateAllocationTotal, trackFieldChange
 */
export declare const bulkAddCostsToPool: (sequelize: any, poolId: number, costs: Array<{
    accountCode: string;
    amount: number;
    description: string;
}>, userId: string, transaction?: Transaction) => Promise<{
    added: number;
    totalAmount: number;
    errors: string[];
}>;
/**
 * Retrieves cost pool summary with allocation details
 * Composes: getCostPoolById, calculateAllocationPercentages, getActiveAllocationRules
 */
export declare const getCostPoolSummary: (sequelize: any, poolId: number, transaction?: Transaction) => Promise<CostPoolSummary>;
/**
 * Creates allocation basis with statistical drivers
 * Composes: createAllocationBasis, createStatisticalDriver, createAuditLog
 */
export declare const createAllocationBasisWithDrivers: (sequelize: any, basisCode: string, basisName: string, basisType: "statistical" | "financial" | "physical" | "time-based" | "activity-based", driverType: "patient-days" | "square-footage" | "headcount" | "transactions" | "revenue" | "custom", departments: Array<{
    code: string;
    driverValue: number;
}>, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    basis: AllocationBasis;
    drivers: StatisticalDriver[];
    totalDriverValue: number;
    auditLogId: number;
}>;
/**
 * Updates statistical driver values in bulk
 * Composes: updateStatisticalDriverValue, validateAllocationRule, trackFieldChange
 */
export declare const bulkUpdateStatisticalDrivers: (sequelize: any, updates: Array<{
    driverCode: string;
    newValue: number;
    validatedBy?: string;
}>, userId: string, transaction?: Transaction) => Promise<{
    updated: number;
    errors: string[];
    validationResults: AllocationValidation[];
}>;
/**
 * Calculates allocation percentages from statistical drivers
 * Composes: getStatisticalDriversByDepartment, calculateAllocationPercentages
 */
export declare const calculateAllocationPercentagesFromDrivers: (sequelize: any, basisCode: string, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<Map<string, {
    percentage: number;
    driverValue: number;
    totalDrivers: number;
}>>;
/**
 * Processes direct allocation with comprehensive audit trail
 * Composes: processDirectAllocation, createAuditLog, validateAllocationTotal
 */
export declare const processDirectAllocationWithAudit: (sequelize: any, poolId: number, allocationDate: Date, userId: string, transaction?: Transaction) => Promise<AllocationBatchResult>;
/**
 * Processes multiple direct allocations in batch
 * Composes: processDirectAllocationWithAudit for multiple pools
 */
export declare const processBatchDirectAllocations: (sequelize: any, poolIds: number[], allocationDate: Date, userId: string, transaction?: Transaction) => Promise<AllocationBatchResult>;
/**
 * Processes step-down allocation with cascade sequencing
 * Composes: processStepDownAllocation, createAuditLog, validateAllocationTotal
 */
export declare const processStepDownAllocationWithSequence: (sequelize: any, serviceDepartmentIds: number[], allocationDate: Date, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    batchResult: AllocationBatchResult;
    sequences: StepDownSequence[];
}>;
/**
 * Processes reciprocal allocation with simultaneous equations
 * Composes: processReciprocalAllocation, createAuditLog, buildDataLineageTrail
 */
export declare const processReciprocalAllocationWithMatrix: (sequelize: any, serviceDepartmentIds: number[], allocationDate: Date, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    batchResult: AllocationBatchResult;
    matrix: ReciprocalAllocationMatrix;
}>;
/**
 * Processes comprehensive ABC allocation
 * Composes: allocateOverheadABC, createAuditLog, performVarianceAnalysis
 */
export declare const processABCAllocationComplete: (sequelize: any, activityPoolIds: number[], fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    batchResult: AllocationBatchResult;
    abcResults: ABCResult[];
}>;
/**
 * Calculates and applies predetermined overhead rates
 * Composes: calculatePredeterminedOverheadRate, applyOverheadToJob, createAuditLog
 */
export declare const calculateAndApplyOverheadRates: (sequelize: any, overheadPoolIds: number[], fiscalYear: number, userId: string, transaction?: Transaction) => Promise<OverheadRateCalculation[]>;
/**
 * Performs comprehensive multi-level variance analysis
 * Composes: performComprehensiveVarianceAnalysis, performVarianceAnalysis, createAuditLog
 */
export declare const performComprehensiveMultiLevelVarianceAnalysis: (sequelize: any, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<ComprehensiveVarianceReport>;
/**
 * Generates cost allocation dashboard with KPIs
 * Composes: generateManagementDashboard, calculateFinancialKPIs, generateSegmentReporting
 */
export declare const generateCostAllocationDashboard: (sequelize: any, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    dashboard: ManagementDashboard;
    kpis: any;
    segmentReports: SegmentReport[];
    poolSummaries: CostPoolSummary[];
    allocationEfficiency: number;
}>;
/**
 * Generates compliance report for cost allocations
 * Composes: generateComplianceReport, validateAllocationTotal, getTransactionHistory
 */
export declare const generateCostAllocationComplianceReport: (sequelize: any, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<{
    reportId: string;
    period: {
        fiscalYear: number;
        fiscalPeriod: number;
    };
    allocationsProcessed: number;
    totalAllocated: number;
    validationResults: AllocationValidation[];
    complianceIssues: string[];
    auditTrailComplete: boolean;
}>;
export { initializeCostPoolWithRules, bulkAddCostsToPool, getCostPoolSummary, createAllocationBasisWithDrivers, bulkUpdateStatisticalDrivers, calculateAllocationPercentagesFromDrivers, processDirectAllocationWithAudit, processBatchDirectAllocations, processStepDownAllocationWithSequence, processReciprocalAllocationWithMatrix, processABCAllocationComplete, calculateAndApplyOverheadRates, performComprehensiveMultiLevelVarianceAnalysis, generateCostAllocationDashboard, generateCostAllocationComplianceReport, };
//# sourceMappingURL=cost-allocation-distribution-composite.d.ts.map
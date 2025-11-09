/**
 * LOC: ALLAUTOCOMP001
 * File: /reuse/edwards/financial/composites/allocation-automation-rules-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../allocation-engines-rules-kit
 *   - ../financial-workflow-approval-kit
 *   - ../financial-close-automation-kit
 *   - ../cost-accounting-allocation-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend allocation rule engines
 *   - Allocation workflow schedulers
 *   - Period-end close automation services
 *   - Healthcare cost allocation services
 *   - Rule validation and testing modules
 */
/**
 * File: /reuse/edwards/financial/composites/allocation-automation-rules-composite.ts
 * Locator: WC-EDW-ALLAUTO-COMPOSITE-001
 * Purpose: Comprehensive Allocation Automation & Rules Composite - Rule engines, allocation hierarchies, driver calculations, period-end automation
 *
 * Upstream: Composes functions from allocation-engines-rules-kit, financial-workflow-approval-kit,
 *           financial-close-automation-kit, cost-accounting-allocation-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Allocation Rule Engines, Workflow Automation, Period-End Close, Cost Services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Redis 7+
 * Exports: 48 composite functions for rule engines, automation, hierarchies, validation, scheduling, reversals, what-if analysis
 *
 * LLM Context: Enterprise-grade allocation automation and rules composite for White Cross healthcare platform.
 * Provides comprehensive allocation rule engine with dynamic rule evaluation, allocation hierarchy management,
 * driver-based calculation automation, period-end allocation processing, recurring allocation scheduling,
 * allocation reversal capabilities, rule validation frameworks, what-if scenario analysis, workflow integration,
 * approval routing, escalation policies, and HIPAA-compliant audit trails. Competes with Oracle JD Edwards
 * EnterpriseOne with production-ready allocation automation infrastructure for complex healthcare cost allocations.
 *
 * Allocation Automation Design Principles:
 * - Dynamic rule evaluation with priority-based execution
 * - Hierarchical allocation with cascade processing
 * - Driver-based calculations with real-time updates
 * - Scheduled period-end automation with retry logic
 * - Comprehensive validation before allocation execution
 * - Reversal capabilities with audit preservation
 * - What-if analysis for scenario planning
 * - Workflow integration for approval routing
 * - Performance optimization for large-scale allocations
 * - Comprehensive audit trails for compliance
 */
import { Transaction } from 'sequelize';
import { type AllocationRule, type AllocationValidation } from '../allocation-engines-rules-kit';
import { type WorkflowDefinition, type WorkflowInstance } from '../financial-workflow-approval-kit';
import { type CloseTask } from '../financial-close-automation-kit';
import { type AuditLogEntry } from '../audit-trail-compliance-kit';
/**
 * Allocation automation configuration
 */
export interface AllocationAutomationConfig {
    enabled: boolean;
    scheduleType: 'daily' | 'weekly' | 'monthly' | 'period-end' | 'manual';
    autoExecute: boolean;
    requireApproval: boolean;
    approvalWorkflowId?: number;
    retryAttempts: number;
    notificationsEnabled: boolean;
    validationRequired: boolean;
    reversalAllowed: boolean;
}
/**
 * Allocation rule hierarchy
 */
export interface AllocationRuleHierarchy {
    hierarchyId: string;
    hierarchyName: string;
    rootRules: AllocationRule[];
    dependentRules: Map<number, AllocationRule[]>;
    executionOrder: number[];
    totalLevels: number;
}
/**
 * Allocation schedule
 */
export interface AllocationSchedule {
    scheduleId: string;
    scheduleName: string;
    scheduleType: 'daily' | 'weekly' | 'monthly' | 'period-end' | 'quarterly' | 'annual';
    ruleIds: number[];
    executionTime: string;
    timezone: string;
    enabled: boolean;
    lastExecuted?: Date;
    nextExecution?: Date;
    failureRetryCount: number;
    notifyOnSuccess: boolean;
    notifyOnFailure: boolean;
    recipients: string[];
}
/**
 * Allocation execution result
 */
export interface AllocationExecutionResult {
    executionId: string;
    scheduleId?: string;
    executionDate: Date;
    ruleExecutions: RuleExecutionDetail[];
    totalRulesExecuted: number;
    totalRulesFailed: number;
    totalAllocated: number;
    executionDurationMs: number;
    status: 'success' | 'partial' | 'failed';
    errors: string[];
    auditTrail: AuditLogEntry[];
}
/**
 * Rule execution detail
 */
export interface RuleExecutionDetail {
    ruleId: number;
    ruleCode: string;
    ruleName: string;
    executionOrder: number;
    startTime: Date;
    endTime: Date;
    durationMs: number;
    status: 'success' | 'failed' | 'skipped';
    allocationsCreated: number;
    totalAllocated: number;
    validationResult: AllocationValidation;
    error?: string;
}
/**
 * Allocation reversal request
 */
export interface AllocationReversalRequest {
    reversalId: string;
    originalExecutionId: string;
    reversalDate: Date;
    reversalReason: string;
    requestedBy: string;
    approvalRequired: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvalDate?: Date;
}
/**
 * Allocation reversal result
 */
export interface AllocationReversalResult {
    reversalId: string;
    reversalDate: Date;
    originalExecutionId: string;
    allocationsReversed: number;
    totalReversalAmount: number;
    journalEntriesCreated: number;
    errors: string[];
    auditTrail: AuditLogEntry[];
}
/**
 * What-if scenario
 */
export interface WhatIfScenario {
    scenarioId: string;
    scenarioName: string;
    description: string;
    baselineDate: Date;
    ruleModifications: RuleModification[];
    driverModifications: DriverModification[];
    results: WhatIfResult[];
    createdBy: string;
    createdDate: Date;
}
/**
 * Rule modification for what-if
 */
export interface RuleModification {
    ruleId: number;
    modificationType: 'change_basis' | 'change_percentage' | 'change_targets' | 'disable' | 'enable';
    originalValue: any;
    modifiedValue: any;
}
/**
 * Driver modification for what-if
 */
export interface DriverModification {
    driverId: number;
    driverCode: string;
    originalValue: number;
    modifiedValue: number;
    changePercentage: number;
}
/**
 * What-if result
 */
export interface WhatIfResult {
    costCenterCode: string;
    baselineAllocation: number;
    scenarioAllocation: number;
    variance: number;
    variancePercentage: number;
    impact: 'favorable' | 'unfavorable' | 'neutral';
}
/**
 * Allocation validation report
 */
export interface AllocationValidationReport {
    validationDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    rulesValidated: number;
    rulesPassed: number;
    rulesFailed: number;
    validationDetails: RuleValidationDetail[];
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
}
/**
 * Rule validation detail
 */
export interface RuleValidationDetail {
    ruleId: number;
    ruleCode: string;
    ruleName: string;
    validationStatus: 'passed' | 'failed' | 'warning';
    validationChecks: ValidationCheck[];
    overallScore: number;
}
/**
 * Validation check
 */
export interface ValidationCheck {
    checkName: string;
    checkType: 'integrity' | 'completeness' | 'accuracy' | 'consistency';
    passed: boolean;
    details: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Builds allocation rule hierarchy with execution order
 * Composes: getActiveAllocationRules with dependency analysis
 */
export declare const buildAllocationRuleHierarchy: (sequelize: any, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<AllocationRuleHierarchy>;
/**
 * Validates rule hierarchy for circular dependencies
 * Composes: buildAllocationRuleHierarchy with cycle detection
 */
export declare const validateRuleHierarchyForCircularDependencies: (sequelize: any, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<{
    valid: boolean;
    circularDependencies: string[][];
    errors: string[];
}>;
/**
 * Optimizes rule execution order for performance
 * Composes: buildAllocationRuleHierarchy with cost-based optimization
 */
export declare const optimizeRuleExecutionOrder: (sequelize: any, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<{
    originalOrder: number[];
    optimizedOrder: number[];
    estimatedSpeedupPercent: number;
}>;
/**
 * Creates allocation schedule with workflow integration
 * Composes: createWorkflowDefinition, createAuditLog
 */
export declare const createAllocationScheduleWithWorkflow: (sequelize: any, scheduleName: string, scheduleType: "daily" | "weekly" | "monthly" | "period-end" | "quarterly" | "annual", ruleIds: number[], executionTime: string, requireApproval: boolean, userId: string, transaction?: Transaction) => Promise<{
    schedule: AllocationSchedule;
    workflow?: WorkflowDefinition;
    auditLogId: number;
}>;
/**
 * Executes scheduled allocation with retry logic
 * Composes: buildAllocationRuleHierarchy, processDirectAllocation, createAuditLog
 */
export declare const executeScheduledAllocation: (sequelize: any, scheduleId: string, userId: string, transaction?: Transaction) => Promise<AllocationExecutionResult>;
/**
 * Creates and processes allocation reversal with approval workflow
 * Composes: startWorkflowInstance, submitForApproval, createAuditLog
 */
export declare const createAllocationReversalWithApproval: (sequelize: any, originalExecutionId: string, reversalReason: string, userId: string, transaction?: Transaction) => Promise<{
    reversal: AllocationReversalRequest;
    workflow?: WorkflowInstance;
    auditLogId: number;
}>;
/**
 * Processes approved allocation reversal
 * Composes: createAuditLog, trackFieldChange
 */
export declare const processAllocationReversal: (sequelize: any, reversalId: string, userId: string, transaction?: Transaction) => Promise<AllocationReversalResult>;
/**
 * Creates and executes what-if scenario for allocation testing
 * Composes: buildAllocationRuleHierarchy, calculateAllocationPercentages
 */
export declare const executeWhatIfScenario: (sequelize: any, scenarioName: string, description: string, ruleModifications: RuleModification[], driverModifications: DriverModification[], baselineDate: Date, userId: string, transaction?: Transaction) => Promise<WhatIfScenario>;
/**
 * Performs comprehensive rule validation
 * Composes: validateAllocationRule, validateAllocationTotal, buildDataLineageTrail
 */
export declare const performComprehensiveRuleValidation: (sequelize: any, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<AllocationValidationReport>;
/**
 * Integrates allocation automation with period-end close
 * Composes: createCloseTask, executeAutomatedTask, executeScheduledAllocation
 */
export declare const integrateAllocationWithPeriodEndClose: (sequelize: any, checklistId: number, scheduleIds: string[], userId: string, transaction?: Transaction) => Promise<{
    tasks: CloseTask[];
    executionResults: AllocationExecutionResult[];
}>;
export { buildAllocationRuleHierarchy, validateRuleHierarchyForCircularDependencies, optimizeRuleExecutionOrder, createAllocationScheduleWithWorkflow, executeScheduledAllocation, createAllocationReversalWithApproval, processAllocationReversal, executeWhatIfScenario, performComprehensiveRuleValidation, integrateAllocationWithPeriodEndClose, };
//# sourceMappingURL=allocation-automation-rules-composite.d.ts.map
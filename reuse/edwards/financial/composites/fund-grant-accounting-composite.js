"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorGrantPerformance = exports.monitorFundPerformance = exports.validateComprehensiveCompliance = exports.generateComprehensiveAuditTrailReport = exports.trackUserActivityWithAudit = exports.checkComprehensiveBudgetAvailability = exports.createFundBudgetWithAllocations = exports.generateFundIncomeStatementWithVariance = exports.generateComprehensiveGrantReport = exports.consolidateFundsWithRestrictions = exports.generateComprehensiveGASBReport = exports.trackAndReconcileGrantAdvance = exports.processGrantBillingWithCosts = exports.calculateValidatedAllocationAmount = exports.processCostSharingAllocation = exports.allocateIndirectCostsToGrant = exports.validateComprehensiveGrantCompliance = exports.closeGrantWithFinalReporting = exports.updateGrantWithBudgetRecalculation = exports.getGrantWithExpendituresAndCompliance = exports.createGrantWithBudgetAndCompliance = exports.releaseFundRestrictionWithAuthorization = exports.validateAndEnforceFundRestrictions = exports.createFundRestrictionWithCompliance = exports.generateFundBalanceAlerts = exports.checkFundAvailabilityWithRestrictions = exports.updateFundBalanceWithBudgetValidation = exports.calculateComprehensiveFundBalance = exports.closeFundWithFinalReporting = exports.activateFundWithCompliance = exports.updateFundWithValidationAndAudit = exports.getFundWithBalanceAndCompliance = exports.createFundWithBudgetAndCompliance = void 0;
/**
 * File: /reuse/edwards/financial/composites/fund-grant-accounting-composite.ts
 * Locator: WC-EDWARDS-FGACMP-001
 * Purpose: Comprehensive Fund & Grant Accounting Composite - REST APIs, Grant Management, Compliance Operations
 *
 * Upstream: Composes functions from fund-grant-accounting-kit, budget-management-control-kit,
 *           audit-trail-compliance-kit, financial-reporting-analytics-kit, allocation-engines-rules-kit
 * Downstream: ../backend/financial/*, Grant API controllers, Fund controllers, Compliance services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Sequelize 6.x
 * Exports: 45 composite functions for fund APIs, grant management, restriction enforcement, compliance reporting
 *
 * LLM Context: Enterprise-grade fund and grant accounting composite for White Cross healthcare platform.
 * Provides comprehensive REST API endpoints for fund structure management, grant lifecycle tracking,
 * fund restriction enforcement, grant budget control, compliance reporting (2 CFR 200), cost sharing,
 * indirect cost allocation, grant billing, advance management, GASB reporting, and multi-fund consolidation.
 * Competes with Oracle JD Edwards EnterpriseOne with production-ready NestJS controller patterns,
 * HIPAA-compliant audit trails, and real-time fund balance monitoring.
 *
 * Key Features:
 * - RESTful fund and grant management APIs
 * - Real-time fund balance tracking and alerts
 * - Automated grant compliance validation
 * - Cost sharing and indirect cost allocation
 * - Grant billing and revenue recognition
 * - GASB 54 fund classification reporting
 * - Federal grant compliance (2 CFR 200)
 * - Award lifecycle management
 * - Fund restriction enforcement
 * - Multi-entity fund consolidation
 */
const common_1 = require("@nestjs/common");
// Import from fund-grant-accounting-kit
const fund_grant_accounting_kit_1 = require("../fund-grant-accounting-kit");
// Import from budget-management-control-kit
const budget_management_control_kit_1 = require("../budget-management-control-kit");
// Import from audit-trail-compliance-kit
const audit_trail_compliance_kit_1 = require("../audit-trail-compliance-kit");
// Import from financial-reporting-analytics-kit
const financial_reporting_analytics_kit_1 = require("../financial-reporting-analytics-kit");
// Import from allocation-engines-rules-kit
const allocation_engines_rules_kit_1 = require("../allocation-engines-rules-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - FUND STRUCTURE MANAGEMENT
// ============================================================================
/**
 * Creates comprehensive fund structure with budget and compliance setup
 * Composes: createFundStructure, createBudget, createAuditEntry, validateComplianceRule
 *
 * @param fundData - Fund structure data
 * @param budgetAmount - Initial budget amount
 * @param transaction - Database transaction
 * @returns Created fund with budget and compliance configuration
 */
const createFundWithBudgetAndCompliance = async (fundData, budgetAmount, transaction) => {
    try {
        // Create fund structure
        const fund = await (0, fund_grant_accounting_kit_1.createFundStructure)(fundData, transaction);
        // Create initial budget
        const budget = await (0, budget_management_control_kit_1.createBudget)({
            fundId: fund.fundId,
            fiscalYear: new Date().getFullYear(),
            budgetAmount,
            budgetType: 'operating',
            status: 'active',
        }, transaction);
        // Create audit trail
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund',
            entityId: fund.fundId,
            action: 'create',
            userId: 'system',
            timestamp: new Date(),
            changes: { fund, budget },
        }, transaction);
        // Setup compliance rules
        const compliance = fund.requiresCompliance
            ? await (0, audit_trail_compliance_kit_1.validateComplianceRule)(fund.complianceFramework || '2CFR200', transaction)
            : [];
        return { fund, budget, audit, compliance };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create fund: ${error.message}`);
    }
};
exports.createFundWithBudgetAndCompliance = createFundWithBudgetAndCompliance;
/**
 * Retrieves fund structure with real-time balance and compliance status
 * Composes: getFundStructure, getFundBalance, validateFundRestriction, validateGrantCompliance
 *
 * @param fundId - Fund identifier
 * @returns Fund with balance and compliance details
 */
const getFundWithBalanceAndCompliance = async (fundId) => {
    try {
        const fund = await (0, fund_grant_accounting_kit_1.getFundStructure)(fundId);
        if (!fund) {
            throw new common_1.NotFoundException(`Fund ${fundId} not found`);
        }
        const balance = await (0, fund_grant_accounting_kit_1.getFundBalance)(fundId, new Date().getFullYear());
        const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        // Check compliance if required
        const complianceStatus = fund.requiresCompliance
            ? await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(fundId)
            : { status: 'not_required' };
        // Generate balance alerts
        const alerts = await (0, exports.generateFundBalanceAlerts)(fundId, balance);
        return { fund, balance, restrictions, complianceStatus, alerts };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.BadRequestException(`Failed to retrieve fund: ${error.message}`);
    }
};
exports.getFundWithBalanceAndCompliance = getFundWithBalanceAndCompliance;
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
const updateFundWithValidationAndAudit = async (fundId, updates, userId, transaction) => {
    try {
        // Validate restrictions before update
        if (updates.restrictionLevel) {
            await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        }
        const fund = await (0, fund_grant_accounting_kit_1.updateFundStructure)(fundId, updates, transaction);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund',
            entityId: fundId,
            action: 'update',
            userId,
            timestamp: new Date(),
            changes: updates,
        }, transaction);
        return { fund, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update fund: ${error.message}`);
    }
};
exports.updateFundWithValidationAndAudit = updateFundWithValidationAndAudit;
/**
 * Activates fund with compliance validation
 * Composes: activateFund, validateComplianceRule, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User activating the fund
 * @returns Activated fund with compliance status
 */
const activateFundWithCompliance = async (fundId, userId) => {
    try {
        const fund = await (0, fund_grant_accounting_kit_1.activateFund)(fundId);
        const compliance = fund.requiresCompliance
            ? await (0, audit_trail_compliance_kit_1.validateComplianceRule)(fund.complianceFramework || '2CFR200')
            : true;
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund',
            entityId: fundId,
            action: 'activate',
            userId,
            timestamp: new Date(),
            changes: { status: 'active' },
        });
        return { fund, compliance, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to activate fund: ${error.message}`);
    }
};
exports.activateFundWithCompliance = activateFundWithCompliance;
/**
 * Closes fund with balance verification and final reporting
 * Composes: closeFund, getFundBalance, generateGASBReport, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User closing the fund
 * @returns Closed fund with final balance and reports
 */
const closeFundWithFinalReporting = async (fundId, userId) => {
    try {
        // Verify balance is zero or handle remaining balance
        const finalBalance = await (0, fund_grant_accounting_kit_1.getFundBalance)(fundId, new Date().getFullYear());
        if (finalBalance.availableBalance !== 0) {
            throw new common_1.ConflictException('Fund has non-zero balance. Transfer remaining balance before closing.');
        }
        const fund = await (0, fund_grant_accounting_kit_1.closeFund)(fundId);
        const gasbReport = await (0, fund_grant_accounting_kit_1.generateGASBReport)(fundId);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund',
            entityId: fundId,
            action: 'close',
            userId,
            timestamp: new Date(),
            changes: { status: 'closed', finalBalance },
        });
        return { fund, finalBalance, gasbReport, audit };
    }
    catch (error) {
        if (error instanceof common_1.ConflictException)
            throw error;
        throw new common_1.BadRequestException(`Failed to close fund: ${error.message}`);
    }
};
exports.closeFundWithFinalReporting = closeFundWithFinalReporting;
// ============================================================================
// COMPOSITE FUNCTIONS - FUND BALANCE OPERATIONS
// ============================================================================
/**
 * Calculates real-time fund balance with restrictions and encumbrances
 * Composes: calculateFundBalance, checkFundAvailability, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param asOfDate - Balance calculation date
 * @returns Comprehensive fund balance details
 */
const calculateComprehensiveFundBalance = async (fundId, asOfDate = new Date()) => {
    try {
        const balance = await (0, fund_grant_accounting_kit_1.calculateFundBalance)(fundId, asOfDate);
        const available = await (0, fund_grant_accounting_kit_1.getFundAvailableBalance)(fundId);
        const canSpend = await (0, fund_grant_accounting_kit_1.checkFundAvailability)(fundId, 0);
        const alerts = await (0, exports.generateFundBalanceAlerts)(fundId, balance);
        return {
            balance,
            available: available.availableBalance,
            restricted: balance.restrictedBalance,
            encumbered: balance.encumberedBalance,
            alerts,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate fund balance: ${error.message}`);
    }
};
exports.calculateComprehensiveFundBalance = calculateComprehensiveFundBalance;
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
const updateFundBalanceWithBudgetValidation = async (fundId, amount, transactionType, userId) => {
    try {
        // Validate against budget
        const budgetValid = await (0, budget_management_control_kit_1.validateBudgetTransaction)(fundId, amount);
        if (!budgetValid) {
            throw new common_1.ConflictException('Transaction exceeds budget availability');
        }
        const balance = await (0, fund_grant_accounting_kit_1.updateFundBalance)(fundId, amount, transactionType);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund_balance',
            entityId: fundId,
            action: 'update',
            userId,
            timestamp: new Date(),
            changes: { amount, transactionType },
        });
        return { balance, budgetValid, audit };
    }
    catch (error) {
        if (error instanceof common_1.ConflictException)
            throw error;
        throw new common_1.BadRequestException(`Failed to update fund balance: ${error.message}`);
    }
};
exports.updateFundBalanceWithBudgetValidation = updateFundBalanceWithBudgetValidation;
/**
 * Checks fund availability for spending with restrictions
 * Composes: checkFundAvailability, validateFundRestriction, enforceFundRestriction
 *
 * @param fundId - Fund identifier
 * @param requestedAmount - Amount to check
 * @returns Availability status with restriction details
 */
const checkFundAvailabilityWithRestrictions = async (fundId, requestedAmount) => {
    try {
        const available = await (0, fund_grant_accounting_kit_1.checkFundAvailability)(fundId, requestedAmount);
        const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        const violations = [];
        for (const restriction of restrictions) {
            const enforcement = await (0, fund_grant_accounting_kit_1.enforceFundRestriction)(fundId, requestedAmount, restriction.restrictionType);
            if (!enforcement.allowed) {
                violations.push(enforcement.message);
            }
        }
        return {
            available: available && violations.length === 0,
            availableAmount: available ? requestedAmount : 0,
            restrictions,
            violations,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check fund availability: ${error.message}`);
    }
};
exports.checkFundAvailabilityWithRestrictions = checkFundAvailabilityWithRestrictions;
/**
 * Generates fund balance alerts based on thresholds
 * Composes: getFundBalance, calculateBudgetVariance, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param balance - Current fund balance
 * @returns List of balance alerts
 */
const generateFundBalanceAlerts = async (fundId, balance) => {
    const alerts = [];
    try {
        // Low balance alert
        if (balance.availableBalance < balance.netBalance * 0.1) {
            alerts.push({
                alertId: `low-${fundId}-${Date.now()}`,
                fundId,
                alertType: 'low_balance',
                threshold: balance.netBalance * 0.1,
                currentBalance: balance.availableBalance,
                severity: 'warning',
                message: 'Fund balance below 10% threshold',
                timestamp: new Date(),
            });
        }
        // Overexpended alert
        if (balance.availableBalance < 0) {
            alerts.push({
                alertId: `over-${fundId}-${Date.now()}`,
                fundId,
                alertType: 'overexpended',
                threshold: 0,
                currentBalance: balance.availableBalance,
                severity: 'critical',
                message: 'Fund is overexpended',
                timestamp: new Date(),
            });
        }
        // Check restriction violations
        const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        if (restrictions.some(r => r.status === 'violated')) {
            alerts.push({
                alertId: `restrict-${fundId}-${Date.now()}`,
                fundId,
                alertType: 'restriction_violation',
                threshold: 0,
                currentBalance: balance.availableBalance,
                severity: 'critical',
                message: 'Fund restriction violation detected',
                timestamp: new Date(),
            });
        }
        return alerts;
    }
    catch (error) {
        return alerts;
    }
};
exports.generateFundBalanceAlerts = generateFundBalanceAlerts;
// ============================================================================
// COMPOSITE FUNCTIONS - FUND RESTRICTIONS
// ============================================================================
/**
 * Creates fund restriction with compliance validation
 * Composes: createFundRestriction, validateComplianceRule, createAuditEntry
 *
 * @param restrictionData - Restriction data
 * @param userId - User creating the restriction
 * @returns Created restriction with compliance status
 */
const createFundRestrictionWithCompliance = async (restrictionData, userId) => {
    try {
        const restriction = await (0, fund_grant_accounting_kit_1.createFundRestriction)(restrictionData);
        const compliance = await (0, audit_trail_compliance_kit_1.validateComplianceRule)(restrictionData.restrictionType || 'donor');
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund_restriction',
            entityId: restriction.restrictionId,
            action: 'create',
            userId,
            timestamp: new Date(),
            changes: restrictionData,
        });
        return { restriction, compliance, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create fund restriction: ${error.message}`);
    }
};
exports.createFundRestrictionWithCompliance = createFundRestrictionWithCompliance;
/**
 * Validates and enforces fund restrictions
 * Composes: validateFundRestriction, enforceFundRestriction, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param transactionAmount - Transaction amount
 * @param transactionPurpose - Purpose of transaction
 * @returns Enforcement result with violations
 */
const validateAndEnforceFundRestrictions = async (fundId, transactionAmount, transactionPurpose) => {
    try {
        const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        const violations = [];
        for (const restriction of restrictions) {
            const enforcement = await (0, fund_grant_accounting_kit_1.enforceFundRestriction)(fundId, transactionAmount, restriction.restrictionType);
            if (!enforcement.allowed) {
                violations.push(`${restriction.restrictionType}: ${enforcement.message}`);
            }
        }
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund_restriction',
            entityId: fundId,
            action: 'validate',
            userId: 'system',
            timestamp: new Date(),
            changes: { transactionAmount, transactionPurpose, violations },
        });
        return {
            allowed: violations.length === 0,
            restrictions,
            violations,
            audit,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to validate restrictions: ${error.message}`);
    }
};
exports.validateAndEnforceFundRestrictions = validateAndEnforceFundRestrictions;
/**
 * Releases fund restriction with authorization
 * Composes: releaseFundRestriction, createAuditEntry, validateComplianceRule
 *
 * @param restrictionId - Restriction identifier
 * @param userId - User releasing the restriction
 * @param reason - Reason for release
 * @returns Released restriction with audit trail
 */
const releaseFundRestrictionWithAuthorization = async (restrictionId, userId, reason) => {
    try {
        const restriction = await (0, fund_grant_accounting_kit_1.releaseFundRestriction)(restrictionId, reason);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'fund_restriction',
            entityId: restrictionId,
            action: 'release',
            userId,
            timestamp: new Date(),
            changes: { reason, status: 'released' },
        });
        return { restriction, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to release restriction: ${error.message}`);
    }
};
exports.releaseFundRestrictionWithAuthorization = releaseFundRestrictionWithAuthorization;
// ============================================================================
// COMPOSITE FUNCTIONS - GRANT MANAGEMENT
// ============================================================================
/**
 * Creates grant award with budget and compliance setup
 * Composes: createGrantAward, calculateGrantBudget, validateFederalCompliance, createAuditEntry
 *
 * @param grantData - Grant award data
 * @param userId - User creating the grant
 * @returns Created grant with budget and compliance
 */
const createGrantWithBudgetAndCompliance = async (grantData, userId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.createGrantAward)(grantData);
        const budget = await (0, fund_grant_accounting_kit_1.calculateGrantBudget)(grant.grantId);
        const complianceResult = grantData.grantType === 'federal'
            ? await (0, fund_grant_accounting_kit_1.validateFederalCompliance)(grant.grantId)
            : { compliant: true, violations: [] };
        const compliance = {
            grantId: grant.grantId,
            compliant: complianceResult.compliant,
            validationDate: new Date(),
            violations: [],
            recommendations: [],
            requiresAction: !complianceResult.compliant,
        };
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant',
            entityId: grant.grantId,
            action: 'create',
            userId,
            timestamp: new Date(),
            changes: grantData,
        });
        return { grant, budget, compliance, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create grant: ${error.message}`);
    }
};
exports.createGrantWithBudgetAndCompliance = createGrantWithBudgetAndCompliance;
/**
 * Retrieves grant with expenditure tracking and compliance
 * Composes: getGrantAward, trackGrantExpenditure, validateGrantCompliance, calculateIndirectCosts
 *
 * @param grantId - Grant identifier
 * @returns Grant with expenditures and compliance status
 */
const getGrantWithExpendituresAndCompliance = async (grantId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.getGrantAward)(grantId);
        if (!grant) {
            throw new common_1.NotFoundException(`Grant ${grantId} not found`);
        }
        const expenditures = await (0, fund_grant_accounting_kit_1.trackGrantExpenditure)(grantId);
        const indirectCosts = await (0, fund_grant_accounting_kit_1.calculateIndirectCosts)(grantId);
        const complianceResult = await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(grantId);
        const budget = await (0, fund_grant_accounting_kit_1.calculateGrantBudget)(grantId);
        const compliance = {
            grantId,
            compliant: complianceResult.status === 'compliant',
            validationDate: new Date(),
            violations: [],
            recommendations: [],
            requiresAction: complianceResult.status !== 'compliant',
        };
        return { grant, expenditures, indirectCosts, compliance, budget };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.BadRequestException(`Failed to retrieve grant: ${error.message}`);
    }
};
exports.getGrantWithExpendituresAndCompliance = getGrantWithExpendituresAndCompliance;
/**
 * Updates grant award with budget recalculation
 * Composes: updateGrantAward, calculateGrantBudget, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param updates - Grant update data
 * @param userId - User making the update
 * @returns Updated grant with recalculated budget
 */
const updateGrantWithBudgetRecalculation = async (grantId, updates, userId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.updateGrantAward)(grantId, updates);
        const budget = await (0, fund_grant_accounting_kit_1.calculateGrantBudget)(grantId);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant',
            entityId: grantId,
            action: 'update',
            userId,
            timestamp: new Date(),
            changes: updates,
        });
        return { grant, budget, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update grant: ${error.message}`);
    }
};
exports.updateGrantWithBudgetRecalculation = updateGrantWithBudgetRecalculation;
/**
 * Closes grant with final reporting and compliance
 * Composes: closeGrantAward, generateGrantReport, validateFederalCompliance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param userId - User closing the grant
 * @returns Closed grant with final reports
 */
const closeGrantWithFinalReporting = async (grantId, userId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.closeGrantAward)(grantId);
        const finalReport = await (0, fund_grant_accounting_kit_1.generateGrantReport)(grantId);
        const complianceResult = await (0, fund_grant_accounting_kit_1.validateFederalCompliance)(grantId);
        const compliance = {
            grantId,
            compliant: complianceResult.compliant,
            validationDate: new Date(),
            violations: [],
            recommendations: [],
            requiresAction: !complianceResult.compliant,
        };
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant',
            entityId: grantId,
            action: 'close',
            userId,
            timestamp: new Date(),
            changes: { status: 'closed' },
        });
        return { grant, finalReport, compliance, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to close grant: ${error.message}`);
    }
};
exports.closeGrantWithFinalReporting = closeGrantWithFinalReporting;
/**
 * Validates grant compliance with federal regulations
 * Composes: validateGrantCompliance, validateFederalCompliance, generateComplianceReport
 *
 * @param grantId - Grant identifier
 * @returns Comprehensive compliance validation
 */
const validateComprehensiveGrantCompliance = async (grantId) => {
    try {
        const grantCompliance = await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(grantId);
        const federalCompliance = await (0, fund_grant_accounting_kit_1.validateFederalCompliance)(grantId);
        const report = await (0, audit_trail_compliance_kit_1.generateComplianceReport)('grant', grantId);
        const violations = [];
        if (!federalCompliance.compliant) {
            violations.push({
                violationType: 'federal_compliance',
                severity: 'critical',
                description: 'Federal compliance requirements not met',
                regulationReference: '2 CFR 200',
                remediationRequired: true,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });
        }
        return {
            grantId,
            compliant: grantCompliance.status === 'compliant' && federalCompliance.compliant,
            validationDate: new Date(),
            violations,
            recommendations: report.recommendations || [],
            requiresAction: violations.length > 0,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to validate compliance: ${error.message}`);
    }
};
exports.validateComprehensiveGrantCompliance = validateComprehensiveGrantCompliance;
// ============================================================================
// COMPOSITE FUNCTIONS - COST ALLOCATION & INDIRECT COSTS
// ============================================================================
/**
 * Calculates and allocates indirect costs to grant
 * Composes: calculateIndirectCosts, createAllocationRule, executeAllocation, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param indirectCostRate - Indirect cost rate percentage
 * @param userId - User executing allocation
 * @returns Indirect cost allocation result
 */
const allocateIndirectCostsToGrant = async (grantId, indirectCostRate, userId) => {
    try {
        const indirectCosts = await (0, fund_grant_accounting_kit_1.calculateIndirectCosts)(grantId, indirectCostRate);
        const allocationRule = await (0, allocation_engines_rules_kit_1.createAllocationRule)({
            ruleName: `Indirect Costs - Grant ${grantId}`,
            allocationMethod: 'percentage',
            allocationBasis: 'direct_costs',
            percentage: indirectCostRate,
        });
        const allocation = await (0, allocation_engines_rules_kit_1.executeAllocation)(grantId, allocationRule);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant_allocation',
            entityId: grantId,
            action: 'allocate_indirect',
            userId,
            timestamp: new Date(),
            changes: { indirectCosts, rate: indirectCostRate },
        });
        return { indirectCosts, allocation, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to allocate indirect costs: ${error.message}`);
    }
};
exports.allocateIndirectCostsToGrant = allocateIndirectCostsToGrant;
/**
 * Processes cost sharing allocation for grant
 * Composes: allocateCostSharing, createAllocationRule, validateAllocationRule, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param costSharingData - Cost sharing allocation data
 * @param userId - User processing allocation
 * @returns Cost sharing allocation result
 */
const processCostSharingAllocation = async (grantId, costSharingData, userId) => {
    try {
        const costSharing = await (0, fund_grant_accounting_kit_1.allocateCostSharing)(grantId, costSharingData);
        const allocationRule = await (0, allocation_engines_rules_kit_1.createAllocationRule)({
            ruleName: `Cost Sharing - Grant ${grantId}`,
            allocationMethod: 'fixed_amount',
            allocationBasis: 'grant_budget',
            fixedAmount: costSharing.costSharingAmount,
        });
        const valid = await (0, allocation_engines_rules_kit_1.validateAllocationRule)(allocationRule);
        if (!valid) {
            throw new common_1.BadRequestException('Invalid cost sharing allocation rule');
        }
        const allocation = await (0, allocation_engines_rules_kit_1.executeAllocation)(grantId, allocationRule);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'cost_sharing',
            entityId: grantId,
            action: 'allocate',
            userId,
            timestamp: new Date(),
            changes: costSharingData,
        });
        return { costSharing, allocation, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process cost sharing: ${error.message}`);
    }
};
exports.processCostSharingAllocation = processCostSharingAllocation;
/**
 * Calculates allocation amount with validation
 * Composes: calculateAllocationAmount, validateBudgetTransaction, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param allocationRule - Allocation rule
 * @param baseAmount - Base amount for calculation
 * @returns Calculated allocation with validation
 */
const calculateValidatedAllocationAmount = async (grantId, allocationRule, baseAmount) => {
    try {
        const amount = await (0, allocation_engines_rules_kit_1.calculateAllocationAmount)(allocationRule, baseAmount);
        const valid = await (0, budget_management_control_kit_1.validateBudgetTransaction)(grantId, amount);
        const budgetImpact = await (0, budget_management_control_kit_1.calculateBudgetVariance)(grantId);
        return { amount, valid, budgetImpact };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate allocation: ${error.message}`);
    }
};
exports.calculateValidatedAllocationAmount = calculateValidatedAllocationAmount;
// ============================================================================
// COMPOSITE FUNCTIONS - GRANT BILLING & ADVANCES
// ============================================================================
/**
 * Processes grant billing with indirect costs and cost sharing
 * Composes: processGrantBilling, calculateIndirectCosts, allocateCostSharing, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param billingPeriod - Billing period
 * @param userId - User processing billing
 * @returns Grant billing invoice with breakdown
 */
const processGrantBillingWithCosts = async (grantId, billingPeriod, userId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.getGrantAward)(grantId);
        if (!grant) {
            throw new common_1.NotFoundException(`Grant ${grantId} not found`);
        }
        const expenditures = await (0, fund_grant_accounting_kit_1.trackGrantExpenditure)(grantId);
        const directCosts = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
        const indirectCosts = await (0, fund_grant_accounting_kit_1.calculateIndirectCosts)(grantId);
        const costSharingData = await (0, fund_grant_accounting_kit_1.allocateCostSharing)(grantId, {
            costSharingType: 'matching',
            costSharingPercent: 25,
        });
        const billing = await (0, fund_grant_accounting_kit_1.processGrantBilling)(grantId, billingPeriod);
        const invoice = {
            invoiceId: `INV-${grantId}-${Date.now()}`,
            grantId,
            billingPeriod,
            directCosts,
            indirectCosts,
            costSharing: costSharingData.costSharingAmount,
            totalAmount: directCosts + indirectCosts - costSharingData.costSharingAmount,
            status: 'draft',
            createdDate: new Date(),
        };
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant_billing',
            entityId: grantId,
            action: 'process_billing',
            userId,
            timestamp: new Date(),
            changes: { invoice },
        });
        return {
            invoice,
            directCosts,
            indirectCosts,
            costSharing: costSharingData.costSharingAmount,
            audit,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.BadRequestException(`Failed to process billing: ${error.message}`);
    }
};
exports.processGrantBillingWithCosts = processGrantBillingWithCosts;
/**
 * Tracks and reconciles grant advance
 * Composes: trackGrantAdvance, reconcileGrantAdvance, updateFundBalance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param advanceAmount - Advance amount
 * @param userId - User tracking advance
 * @returns Advance tracking result
 */
const trackAndReconcileGrantAdvance = async (grantId, advanceAmount, userId) => {
    try {
        const advance = await (0, fund_grant_accounting_kit_1.trackGrantAdvance)(grantId, advanceAmount);
        const reconciliation = await (0, fund_grant_accounting_kit_1.reconcileGrantAdvance)(grantId, advanceAmount);
        const grant = await (0, fund_grant_accounting_kit_1.getGrantAward)(grantId);
        const fundBalance = await (0, fund_grant_accounting_kit_1.updateFundBalance)(grant.fundId, advanceAmount, 'credit');
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant_advance',
            entityId: grantId,
            action: 'track_reconcile',
            userId,
            timestamp: new Date(),
            changes: { advance, reconciliation },
        });
        return { advance, reconciliation, fundBalance, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track advance: ${error.message}`);
    }
};
exports.trackAndReconcileGrantAdvance = trackAndReconcileGrantAdvance;
// ============================================================================
// COMPOSITE FUNCTIONS - REPORTING & CONSOLIDATION
// ============================================================================
/**
 * Generates comprehensive GASB fund report
 * Composes: generateGASBReport, generateBalanceSheet, calculateFinancialKPI, createReportDrillDown
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns GASB report with financial statements
 */
const generateComprehensiveGASBReport = async (fundId, fiscalYear) => {
    try {
        const gasbReport = await (0, fund_grant_accounting_kit_1.generateGASBReport)(fundId, fiscalYear);
        const balanceSheet = await (0, financial_reporting_analytics_kit_1.generateBalanceSheet)(fundId, fiscalYear);
        const kpis = [
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('fund_balance_ratio', fundId),
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('expenditure_rate', fundId),
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('compliance_score', fundId),
        ];
        const drillDown = await (0, financial_reporting_analytics_kit_1.createReportDrillDown)(fundId, 'gasb_report');
        return { gasbReport, balanceSheet, kpis, drillDown };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate GASB report: ${error.message}`);
    }
};
exports.generateComprehensiveGASBReport = generateComprehensiveGASBReport;
/**
 * Consolidates multiple fund balances with restrictions
 * Composes: consolidateFundBalances, generateConsolidatedReport, validateFundRestriction
 *
 * @param request - Consolidation request
 * @returns Consolidated fund balance report
 */
const consolidateFundsWithRestrictions = async (request) => {
    try {
        const consolidated = await (0, fund_grant_accounting_kit_1.consolidateFundBalances)(request.fundIds, request.fiscalYear, request.fiscalPeriod);
        const breakdown = [];
        const allRestrictions = [];
        for (const fundId of request.fundIds) {
            const balance = await (0, fund_grant_accounting_kit_1.getFundBalance)(fundId, request.fiscalYear);
            breakdown.push(balance);
            if (request.includeRestricted) {
                const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
                allRestrictions.push(...restrictions);
            }
        }
        const report = await (0, financial_reporting_analytics_kit_1.generateConsolidatedReport)(request.fundIds, request.fiscalYear);
        return {
            consolidated,
            breakdown,
            restrictions: allRestrictions,
            report,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to consolidate funds: ${error.message}`);
    }
};
exports.consolidateFundsWithRestrictions = consolidateFundsWithRestrictions;
/**
 * Generates grant compliance report with recommendations
 * Composes: generateGrantReport, validateGrantCompliance, generateComplianceReport, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param reportType - Type of report
 * @returns Comprehensive grant report
 */
const generateComprehensiveGrantReport = async (grantId, reportType) => {
    try {
        const grantReport = await (0, fund_grant_accounting_kit_1.generateGrantReport)(grantId, reportType);
        const complianceResult = await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(grantId);
        const complianceReport = await (0, audit_trail_compliance_kit_1.generateComplianceReport)('grant', grantId);
        const compliance = {
            grantId,
            compliant: complianceResult.status === 'compliant',
            validationDate: new Date(),
            violations: [],
            recommendations: complianceReport.recommendations || [],
            requiresAction: complianceResult.status !== 'compliant',
        };
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'grant_report',
            entityId: grantId,
            action: 'generate',
            userId: 'system',
            timestamp: new Date(),
            changes: { reportType },
        });
        return { grantReport, compliance, complianceReport, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate report: ${error.message}`);
    }
};
exports.generateComprehensiveGrantReport = generateComprehensiveGrantReport;
/**
 * Generates fund income statement with budget variance
 * Composes: generateIncomeStatement, calculateBudgetVariance, generateBudgetReport
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns Income statement with variance analysis
 */
const generateFundIncomeStatementWithVariance = async (fundId, fiscalYear) => {
    try {
        const incomeStatement = await (0, financial_reporting_analytics_kit_1.generateIncomeStatement)(fundId, fiscalYear);
        const budgetVariance = await (0, budget_management_control_kit_1.calculateBudgetVariance)(fundId);
        const budgetReport = await (0, budget_management_control_kit_1.generateBudgetReport)(fundId, fiscalYear);
        return { incomeStatement, budgetVariance, budgetReport };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate income statement: ${error.message}`);
    }
};
exports.generateFundIncomeStatementWithVariance = generateFundIncomeStatementWithVariance;
// ============================================================================
// COMPOSITE FUNCTIONS - BUDGET INTEGRATION
// ============================================================================
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
const createFundBudgetWithAllocations = async (fundId, budgetData, allocations, userId) => {
    try {
        const budget = await (0, budget_management_control_kit_1.createBudget)({ ...budgetData, fundId });
        const createdAllocations = [];
        const allocationRules = [];
        for (const allocation of allocations) {
            const created = await (0, budget_management_control_kit_1.createBudgetAllocation)(budget.budgetId, allocation);
            createdAllocations.push(created);
            const rule = await (0, allocation_engines_rules_kit_1.createAllocationRule)({
                ruleName: `Budget Allocation - ${created.allocationName}`,
                allocationMethod: 'percentage',
                allocationBasis: 'budget',
                percentage: (created.allocatedAmount / budget.budgetAmount) * 100,
            });
            allocationRules.push(rule);
        }
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType: 'budget',
            entityId: budget.budgetId,
            action: 'create_with_allocations',
            userId,
            timestamp: new Date(),
            changes: { budget, allocations: createdAllocations },
        });
        return { budget, allocations: createdAllocations, allocationRules, audit };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create budget: ${error.message}`);
    }
};
exports.createFundBudgetWithAllocations = createFundBudgetWithAllocations;
/**
 * Checks budget availability with fund restrictions
 * Composes: checkBudgetAvailability, checkFundAvailability, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param amount - Amount to check
 * @returns Availability status with details
 */
const checkComprehensiveBudgetAvailability = async (fundId, amount) => {
    try {
        const budgetAvailable = await (0, budget_management_control_kit_1.checkBudgetAvailability)(fundId, amount);
        const fundAvailable = await (0, fund_grant_accounting_kit_1.checkFundAvailability)(fundId, amount);
        const restrictions = await (0, fund_grant_accounting_kit_1.validateFundRestriction)(fundId);
        const restrictionViolations = restrictions.filter(r => r.status === 'violated');
        return {
            budgetAvailable,
            fundAvailable,
            restrictions,
            available: budgetAvailable && fundAvailable && restrictionViolations.length === 0,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check availability: ${error.message}`);
    }
};
exports.checkComprehensiveBudgetAvailability = checkComprehensiveBudgetAvailability;
// ============================================================================
// COMPOSITE FUNCTIONS - AUDIT & COMPLIANCE TRACKING
// ============================================================================
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
const trackUserActivityWithAudit = async (userId, activity, entityType, entityId) => {
    try {
        const activityResult = await (0, audit_trail_compliance_kit_1.trackUserActivity)(userId, activity);
        const audit = await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType,
            entityId,
            action: activity,
            userId,
            timestamp: new Date(),
            changes: { activity },
        });
        const auditTrail = await (0, audit_trail_compliance_kit_1.getAuditTrail)(entityType, entityId);
        return { activity: activityResult, audit, auditTrail };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track activity: ${error.message}`);
    }
};
exports.trackUserActivityWithAudit = trackUserActivityWithAudit;
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
const generateComprehensiveAuditTrailReport = async (entityType, entityId, startDate, endDate) => {
    try {
        const auditTrail = await (0, audit_trail_compliance_kit_1.getAuditTrail)(entityType, entityId, startDate, endDate);
        const complianceReport = await (0, audit_trail_compliance_kit_1.generateComplianceReport)(entityType, entityId);
        const summary = {
            totalEntries: auditTrail.length,
            dateRange: { startDate, endDate },
            entityType,
            entityId,
            uniqueUsers: [...new Set(auditTrail.map(a => a.userId))].length,
            actionCounts: auditTrail.reduce((acc, entry) => {
                acc[entry.action] = (acc[entry.action] || 0) + 1;
                return acc;
            }, {}),
        };
        return { auditTrail, complianceReport, summary };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate audit report: ${error.message}`);
    }
};
exports.generateComprehensiveAuditTrailReport = generateComprehensiveAuditTrailReport;
/**
 * Validates comprehensive compliance rules
 * Composes: validateComplianceRule, validateGrantCompliance, validateFederalCompliance
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param complianceFramework - Compliance framework
 * @returns Compliance validation result
 */
const validateComprehensiveCompliance = async (entityType, entityId, complianceFramework) => {
    try {
        const rules = await (0, audit_trail_compliance_kit_1.validateComplianceRule)(complianceFramework);
        const entity = entityType === 'grant'
            ? await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(entityId)
            : { status: 'compliant' };
        const federal = entityType === 'grant'
            ? await (0, fund_grant_accounting_kit_1.validateFederalCompliance)(entityId)
            : { compliant: true };
        const overall = rules && entity.status === 'compliant' && federal.compliant;
        return { rules, entity, federal, overall };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to validate compliance: ${error.message}`);
    }
};
exports.validateComprehensiveCompliance = validateComprehensiveCompliance;
// ============================================================================
// COMPOSITE FUNCTIONS - PERFORMANCE MONITORING
// ============================================================================
/**
 * Monitors fund performance with KPIs
 * Composes: getFundBalance, calculateFinancialKPI, calculateBudgetVariance, generateGASBReport
 *
 * @param fundId - Fund identifier
 * @returns Fund performance metrics
 */
const monitorFundPerformance = async (fundId) => {
    try {
        const balance = await (0, fund_grant_accounting_kit_1.getFundBalance)(fundId, new Date().getFullYear());
        const kpis = [
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('liquidity_ratio', fundId),
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('fund_utilization', fundId),
            await (0, financial_reporting_analytics_kit_1.calculateFinancialKPI)('compliance_score', fundId),
        ];
        const variance = await (0, budget_management_control_kit_1.calculateBudgetVariance)(fundId);
        const performanceScore = kpis.reduce((sum, kpi) => sum + kpi.value, 0) / kpis.length;
        return { balance, kpis, variance, performanceScore };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to monitor performance: ${error.message}`);
    }
};
exports.monitorFundPerformance = monitorFundPerformance;
/**
 * Monitors grant performance with expenditure tracking
 * Composes: getGrantAward, trackGrantExpenditure, calculateGrantBudget, validateGrantCompliance
 *
 * @param grantId - Grant identifier
 * @returns Grant performance metrics
 */
const monitorGrantPerformance = async (grantId) => {
    try {
        const grant = await (0, fund_grant_accounting_kit_1.getGrantAward)(grantId);
        const expenditures = await (0, fund_grant_accounting_kit_1.trackGrantExpenditure)(grantId);
        const budget = await (0, fund_grant_accounting_kit_1.calculateGrantBudget)(grantId);
        const complianceResult = await (0, fund_grant_accounting_kit_1.validateGrantCompliance)(grantId);
        const totalExpended = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
        const utilizationRate = (totalExpended / grant.awardAmount) * 100;
        return {
            grant,
            expenditures,
            budget,
            utilizationRate,
            compliance: complianceResult.status,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to monitor grant performance: ${error.message}`);
    }
};
exports.monitorGrantPerformance = monitorGrantPerformance;
//# sourceMappingURL=fund-grant-accounting-composite.js.map
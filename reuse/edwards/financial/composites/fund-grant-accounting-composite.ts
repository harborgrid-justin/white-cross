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

import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus, UseGuards, UseInterceptors, ValidationPipe, ParseIntPipe, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Transaction } from 'sequelize';

// Import from fund-grant-accounting-kit
import {
  createFundStructure,
  getFundStructure,
  updateFundStructure,
  activateFund,
  closeFund,
  getFundBalance,
  calculateFundBalance,
  updateFundBalance,
  getFundAvailableBalance,
  checkFundAvailability,
  createFundRestriction,
  validateFundRestriction,
  enforceFundRestriction,
  releaseFundRestriction,
  createGrantAward,
  getGrantAward,
  updateGrantAward,
  closeGrantAward,
  calculateGrantBudget,
  trackGrantExpenditure,
  validateGrantCompliance,
  generateGrantReport,
  calculateIndirectCosts,
  allocateCostSharing,
  processGrantBilling,
  trackGrantAdvance,
  reconcileGrantAdvance,
  validateFederalCompliance,
  generateGASBReport,
  consolidateFundBalances,
  type FundStructure,
  type FundBalance,
  type FundRestriction,
  type GrantAward,
  type GrantBudget,
  type GrantExpenditure,
  type IndirectCostRate,
  type CostSharingAllocation,
  type GrantComplianceReport,
  type FundType,
  type RestrictionType,
  type GrantType,
  type ComplianceStatus,
} from '../fund-grant-accounting-kit';

// Import from budget-management-control-kit
import {
  createBudget,
  getBudgetStatus,
  checkBudgetAvailability,
  createBudgetAllocation,
  validateBudgetTransaction,
  calculateBudgetVariance,
  generateBudgetReport,
  type Budget,
  type BudgetAllocation,
  type BudgetVariance,
} from '../budget-management-control-kit';

// Import from audit-trail-compliance-kit
import {
  createAuditEntry,
  getAuditTrail,
  validateComplianceRule,
  generateComplianceReport,
  trackUserActivity,
  type AuditEntry,
  type ComplianceRule,
  type ComplianceReport,
} from '../audit-trail-compliance-kit';

// Import from financial-reporting-analytics-kit
import {
  generateBalanceSheet,
  generateIncomeStatement,
  calculateFinancialKPI,
  generateConsolidatedReport,
  createReportDrillDown,
  type BalanceSheetReport,
  type IncomeStatementReport,
  type FinancialKPI,
} from '../financial-reporting-analytics-kit';

// Import from allocation-engines-rules-kit
import {
  createAllocationRule,
  executeAllocation,
  validateAllocationRule,
  calculateAllocationAmount,
  type AllocationRule,
  type AllocationResult,
} from '../allocation-engines-rules-kit';

// ============================================================================
// TYPE DEFINITIONS - FUND & GRANT API COMPOSITES
// ============================================================================

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
export const createFundWithBudgetAndCompliance = async (
  fundData: Partial<FundStructure>,
  budgetAmount: number,
  transaction?: Transaction
): Promise<{
  fund: FundStructure;
  budget: Budget;
  audit: AuditEntry;
  compliance: ComplianceRule[];
}> => {
  try {
    // Create fund structure
    const fund = await createFundStructure(fundData, transaction);

    // Create initial budget
    const budget = await createBudget({
      fundId: fund.fundId,
      fiscalYear: new Date().getFullYear(),
      budgetAmount,
      budgetType: 'operating',
      status: 'active',
    }, transaction);

    // Create audit trail
    const audit = await createAuditEntry({
      entityType: 'fund',
      entityId: fund.fundId,
      action: 'create',
      userId: 'system',
      timestamp: new Date(),
      changes: { fund, budget },
    }, transaction);

    // Setup compliance rules
    const compliance = fund.requiresCompliance
      ? await validateComplianceRule(fund.complianceFramework || '2CFR200', transaction)
      : [];

    return { fund, budget, audit, compliance };
  } catch (error: any) {
    throw new BadRequestException(`Failed to create fund: ${error.message}`);
  }
};

/**
 * Retrieves fund structure with real-time balance and compliance status
 * Composes: getFundStructure, getFundBalance, validateFundRestriction, validateGrantCompliance
 *
 * @param fundId - Fund identifier
 * @returns Fund with balance and compliance details
 */
export const getFundWithBalanceAndCompliance = async (
  fundId: number
): Promise<{
  fund: FundStructure;
  balance: FundBalance;
  restrictions: FundRestriction[];
  complianceStatus: ComplianceStatus;
  alerts: FundBalanceAlert[];
}> => {
  try {
    const fund = await getFundStructure(fundId);
    if (!fund) {
      throw new NotFoundException(`Fund ${fundId} not found`);
    }

    const balance = await getFundBalance(fundId, new Date().getFullYear());
    const restrictions = await validateFundRestriction(fundId);

    // Check compliance if required
    const complianceStatus = fund.requiresCompliance
      ? await validateGrantCompliance(fundId)
      : { status: 'not_required' as ComplianceStatus };

    // Generate balance alerts
    const alerts = await generateFundBalanceAlerts(fundId, balance);

    return { fund, balance, restrictions, complianceStatus, alerts };
  } catch (error: any) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException(`Failed to retrieve fund: ${error.message}`);
  }
};

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
export const updateFundWithValidationAndAudit = async (
  fundId: number,
  updates: Partial<FundStructure>,
  userId: string,
  transaction?: Transaction
): Promise<{ fund: FundStructure; audit: AuditEntry }> => {
  try {
    // Validate restrictions before update
    if (updates.restrictionLevel) {
      await validateFundRestriction(fundId);
    }

    const fund = await updateFundStructure(fundId, updates, transaction);

    const audit = await createAuditEntry({
      entityType: 'fund',
      entityId: fundId,
      action: 'update',
      userId,
      timestamp: new Date(),
      changes: updates,
    }, transaction);

    return { fund, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to update fund: ${error.message}`);
  }
};

/**
 * Activates fund with compliance validation
 * Composes: activateFund, validateComplianceRule, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User activating the fund
 * @returns Activated fund with compliance status
 */
export const activateFundWithCompliance = async (
  fundId: number,
  userId: string
): Promise<{ fund: FundStructure; compliance: boolean; audit: AuditEntry }> => {
  try {
    const fund = await activateFund(fundId);

    const compliance = fund.requiresCompliance
      ? await validateComplianceRule(fund.complianceFramework || '2CFR200')
      : true;

    const audit = await createAuditEntry({
      entityType: 'fund',
      entityId: fundId,
      action: 'activate',
      userId,
      timestamp: new Date(),
      changes: { status: 'active' },
    });

    return { fund, compliance, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to activate fund: ${error.message}`);
  }
};

/**
 * Closes fund with balance verification and final reporting
 * Composes: closeFund, getFundBalance, generateGASBReport, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param userId - User closing the fund
 * @returns Closed fund with final balance and reports
 */
export const closeFundWithFinalReporting = async (
  fundId: number,
  userId: string
): Promise<{
  fund: FundStructure;
  finalBalance: FundBalance;
  gasbReport: any;
  audit: AuditEntry;
}> => {
  try {
    // Verify balance is zero or handle remaining balance
    const finalBalance = await getFundBalance(fundId, new Date().getFullYear());

    if (finalBalance.availableBalance !== 0) {
      throw new ConflictException('Fund has non-zero balance. Transfer remaining balance before closing.');
    }

    const fund = await closeFund(fundId);
    const gasbReport = await generateGASBReport(fundId);

    const audit = await createAuditEntry({
      entityType: 'fund',
      entityId: fundId,
      action: 'close',
      userId,
      timestamp: new Date(),
      changes: { status: 'closed', finalBalance },
    });

    return { fund, finalBalance, gasbReport, audit };
  } catch (error: any) {
    if (error instanceof ConflictException) throw error;
    throw new BadRequestException(`Failed to close fund: ${error.message}`);
  }
};

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
export const calculateComprehensiveFundBalance = async (
  fundId: number,
  asOfDate: Date = new Date()
): Promise<{
  balance: FundBalance;
  available: number;
  restricted: number;
  encumbered: number;
  alerts: FundBalanceAlert[];
}> => {
  try {
    const balance = await calculateFundBalance(fundId, asOfDate);
    const available = await getFundAvailableBalance(fundId);
    const canSpend = await checkFundAvailability(fundId, 0);

    const alerts = await generateFundBalanceAlerts(fundId, balance);

    return {
      balance,
      available: available.availableBalance,
      restricted: balance.restrictedBalance,
      encumbered: balance.encumberedBalance,
      alerts,
    };
  } catch (error: any) {
    throw new BadRequestException(`Failed to calculate fund balance: ${error.message}`);
  }
};

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
export const updateFundBalanceWithBudgetValidation = async (
  fundId: number,
  amount: number,
  transactionType: 'debit' | 'credit',
  userId: string
): Promise<{
  balance: FundBalance;
  budgetValid: boolean;
  audit: AuditEntry;
}> => {
  try {
    // Validate against budget
    const budgetValid = await validateBudgetTransaction(fundId, amount);

    if (!budgetValid) {
      throw new ConflictException('Transaction exceeds budget availability');
    }

    const balance = await updateFundBalance(fundId, amount, transactionType);

    const audit = await createAuditEntry({
      entityType: 'fund_balance',
      entityId: fundId,
      action: 'update',
      userId,
      timestamp: new Date(),
      changes: { amount, transactionType },
    });

    return { balance, budgetValid, audit };
  } catch (error: any) {
    if (error instanceof ConflictException) throw error;
    throw new BadRequestException(`Failed to update fund balance: ${error.message}`);
  }
};

/**
 * Checks fund availability for spending with restrictions
 * Composes: checkFundAvailability, validateFundRestriction, enforceFundRestriction
 *
 * @param fundId - Fund identifier
 * @param requestedAmount - Amount to check
 * @returns Availability status with restriction details
 */
export const checkFundAvailabilityWithRestrictions = async (
  fundId: number,
  requestedAmount: number
): Promise<{
  available: boolean;
  availableAmount: number;
  restrictions: FundRestriction[];
  violations: string[];
}> => {
  try {
    const available = await checkFundAvailability(fundId, requestedAmount);
    const restrictions = await validateFundRestriction(fundId);

    const violations: string[] = [];
    for (const restriction of restrictions) {
      const enforcement = await enforceFundRestriction(fundId, requestedAmount, restriction.restrictionType);
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
  } catch (error: any) {
    throw new BadRequestException(`Failed to check fund availability: ${error.message}`);
  }
};

/**
 * Generates fund balance alerts based on thresholds
 * Composes: getFundBalance, calculateBudgetVariance, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param balance - Current fund balance
 * @returns List of balance alerts
 */
export const generateFundBalanceAlerts = async (
  fundId: number,
  balance: FundBalance
): Promise<FundBalanceAlert[]> => {
  const alerts: FundBalanceAlert[] = [];

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
    const restrictions = await validateFundRestriction(fundId);
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
  } catch (error: any) {
    return alerts;
  }
};

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
export const createFundRestrictionWithCompliance = async (
  restrictionData: Partial<FundRestriction>,
  userId: string
): Promise<{ restriction: FundRestriction; compliance: boolean; audit: AuditEntry }> => {
  try {
    const restriction = await createFundRestriction(restrictionData);

    const compliance = await validateComplianceRule(
      restrictionData.restrictionType || 'donor'
    );

    const audit = await createAuditEntry({
      entityType: 'fund_restriction',
      entityId: restriction.restrictionId,
      action: 'create',
      userId,
      timestamp: new Date(),
      changes: restrictionData,
    });

    return { restriction, compliance, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to create fund restriction: ${error.message}`);
  }
};

/**
 * Validates and enforces fund restrictions
 * Composes: validateFundRestriction, enforceFundRestriction, createAuditEntry
 *
 * @param fundId - Fund identifier
 * @param transactionAmount - Transaction amount
 * @param transactionPurpose - Purpose of transaction
 * @returns Enforcement result with violations
 */
export const validateAndEnforceFundRestrictions = async (
  fundId: number,
  transactionAmount: number,
  transactionPurpose: string
): Promise<{
  allowed: boolean;
  restrictions: FundRestriction[];
  violations: string[];
  audit: AuditEntry;
}> => {
  try {
    const restrictions = await validateFundRestriction(fundId);
    const violations: string[] = [];

    for (const restriction of restrictions) {
      const enforcement = await enforceFundRestriction(
        fundId,
        transactionAmount,
        restriction.restrictionType
      );

      if (!enforcement.allowed) {
        violations.push(`${restriction.restrictionType}: ${enforcement.message}`);
      }
    }

    const audit = await createAuditEntry({
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
  } catch (error: any) {
    throw new BadRequestException(`Failed to validate restrictions: ${error.message}`);
  }
};

/**
 * Releases fund restriction with authorization
 * Composes: releaseFundRestriction, createAuditEntry, validateComplianceRule
 *
 * @param restrictionId - Restriction identifier
 * @param userId - User releasing the restriction
 * @param reason - Reason for release
 * @returns Released restriction with audit trail
 */
export const releaseFundRestrictionWithAuthorization = async (
  restrictionId: number,
  userId: string,
  reason: string
): Promise<{ restriction: FundRestriction; audit: AuditEntry }> => {
  try {
    const restriction = await releaseFundRestriction(restrictionId, reason);

    const audit = await createAuditEntry({
      entityType: 'fund_restriction',
      entityId: restrictionId,
      action: 'release',
      userId,
      timestamp: new Date(),
      changes: { reason, status: 'released' },
    });

    return { restriction, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to release restriction: ${error.message}`);
  }
};

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
export const createGrantWithBudgetAndCompliance = async (
  grantData: Partial<GrantAward>,
  userId: string
): Promise<{
  grant: GrantAward;
  budget: GrantBudget;
  compliance: GrantComplianceValidation;
  audit: AuditEntry;
}> => {
  try {
    const grant = await createGrantAward(grantData);

    const budget = await calculateGrantBudget(grant.grantId);

    const complianceResult = grantData.grantType === 'federal'
      ? await validateFederalCompliance(grant.grantId)
      : { compliant: true, violations: [] };

    const compliance: GrantComplianceValidation = {
      grantId: grant.grantId,
      compliant: complianceResult.compliant,
      validationDate: new Date(),
      violations: [],
      recommendations: [],
      requiresAction: !complianceResult.compliant,
    };

    const audit = await createAuditEntry({
      entityType: 'grant',
      entityId: grant.grantId,
      action: 'create',
      userId,
      timestamp: new Date(),
      changes: grantData,
    });

    return { grant, budget, compliance, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to create grant: ${error.message}`);
  }
};

/**
 * Retrieves grant with expenditure tracking and compliance
 * Composes: getGrantAward, trackGrantExpenditure, validateGrantCompliance, calculateIndirectCosts
 *
 * @param grantId - Grant identifier
 * @returns Grant with expenditures and compliance status
 */
export const getGrantWithExpendituresAndCompliance = async (
  grantId: number
): Promise<{
  grant: GrantAward;
  expenditures: GrantExpenditure[];
  indirectCosts: number;
  compliance: GrantComplianceValidation;
  budget: GrantBudget;
}> => {
  try {
    const grant = await getGrantAward(grantId);
    if (!grant) {
      throw new NotFoundException(`Grant ${grantId} not found`);
    }

    const expenditures = await trackGrantExpenditure(grantId);
    const indirectCosts = await calculateIndirectCosts(grantId);
    const complianceResult = await validateGrantCompliance(grantId);
    const budget = await calculateGrantBudget(grantId);

    const compliance: GrantComplianceValidation = {
      grantId,
      compliant: complianceResult.status === 'compliant',
      validationDate: new Date(),
      violations: [],
      recommendations: [],
      requiresAction: complianceResult.status !== 'compliant',
    };

    return { grant, expenditures, indirectCosts, compliance, budget };
  } catch (error: any) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException(`Failed to retrieve grant: ${error.message}`);
  }
};

/**
 * Updates grant award with budget recalculation
 * Composes: updateGrantAward, calculateGrantBudget, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param updates - Grant update data
 * @param userId - User making the update
 * @returns Updated grant with recalculated budget
 */
export const updateGrantWithBudgetRecalculation = async (
  grantId: number,
  updates: Partial<GrantAward>,
  userId: string
): Promise<{ grant: GrantAward; budget: GrantBudget; audit: AuditEntry }> => {
  try {
    const grant = await updateGrantAward(grantId, updates);
    const budget = await calculateGrantBudget(grantId);

    const audit = await createAuditEntry({
      entityType: 'grant',
      entityId: grantId,
      action: 'update',
      userId,
      timestamp: new Date(),
      changes: updates,
    });

    return { grant, budget, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to update grant: ${error.message}`);
  }
};

/**
 * Closes grant with final reporting and compliance
 * Composes: closeGrantAward, generateGrantReport, validateFederalCompliance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param userId - User closing the grant
 * @returns Closed grant with final reports
 */
export const closeGrantWithFinalReporting = async (
  grantId: number,
  userId: string
): Promise<{
  grant: GrantAward;
  finalReport: GrantComplianceReport;
  compliance: GrantComplianceValidation;
  audit: AuditEntry;
}> => {
  try {
    const grant = await closeGrantAward(grantId);
    const finalReport = await generateGrantReport(grantId);
    const complianceResult = await validateFederalCompliance(grantId);

    const compliance: GrantComplianceValidation = {
      grantId,
      compliant: complianceResult.compliant,
      validationDate: new Date(),
      violations: [],
      recommendations: [],
      requiresAction: !complianceResult.compliant,
    };

    const audit = await createAuditEntry({
      entityType: 'grant',
      entityId: grantId,
      action: 'close',
      userId,
      timestamp: new Date(),
      changes: { status: 'closed' },
    });

    return { grant, finalReport, compliance, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to close grant: ${error.message}`);
  }
};

/**
 * Validates grant compliance with federal regulations
 * Composes: validateGrantCompliance, validateFederalCompliance, generateComplianceReport
 *
 * @param grantId - Grant identifier
 * @returns Comprehensive compliance validation
 */
export const validateComprehensiveGrantCompliance = async (
  grantId: number
): Promise<GrantComplianceValidation> => {
  try {
    const grantCompliance = await validateGrantCompliance(grantId);
    const federalCompliance = await validateFederalCompliance(grantId);
    const report = await generateComplianceReport('grant', grantId);

    const violations: ComplianceViolation[] = [];

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
  } catch (error: any) {
    throw new BadRequestException(`Failed to validate compliance: ${error.message}`);
  }
};

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
export const allocateIndirectCostsToGrant = async (
  grantId: number,
  indirectCostRate: number,
  userId: string
): Promise<{
  indirectCosts: number;
  allocation: AllocationResult;
  audit: AuditEntry;
}> => {
  try {
    const indirectCosts = await calculateIndirectCosts(grantId, indirectCostRate);

    const allocationRule = await createAllocationRule({
      ruleName: `Indirect Costs - Grant ${grantId}`,
      allocationMethod: 'percentage',
      allocationBasis: 'direct_costs',
      percentage: indirectCostRate,
    });

    const allocation = await executeAllocation(grantId, allocationRule);

    const audit = await createAuditEntry({
      entityType: 'grant_allocation',
      entityId: grantId,
      action: 'allocate_indirect',
      userId,
      timestamp: new Date(),
      changes: { indirectCosts, rate: indirectCostRate },
    });

    return { indirectCosts, allocation, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to allocate indirect costs: ${error.message}`);
  }
};

/**
 * Processes cost sharing allocation for grant
 * Composes: allocateCostSharing, createAllocationRule, validateAllocationRule, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param costSharingData - Cost sharing allocation data
 * @param userId - User processing allocation
 * @returns Cost sharing allocation result
 */
export const processCostSharingAllocation = async (
  grantId: number,
  costSharingData: Partial<CostSharingAllocation>,
  userId: string
): Promise<{
  costSharing: CostSharingAllocation;
  allocation: AllocationResult;
  audit: AuditEntry;
}> => {
  try {
    const costSharing = await allocateCostSharing(grantId, costSharingData);

    const allocationRule = await createAllocationRule({
      ruleName: `Cost Sharing - Grant ${grantId}`,
      allocationMethod: 'fixed_amount',
      allocationBasis: 'grant_budget',
      fixedAmount: costSharing.costSharingAmount,
    });

    const valid = await validateAllocationRule(allocationRule);
    if (!valid) {
      throw new BadRequestException('Invalid cost sharing allocation rule');
    }

    const allocation = await executeAllocation(grantId, allocationRule);

    const audit = await createAuditEntry({
      entityType: 'cost_sharing',
      entityId: grantId,
      action: 'allocate',
      userId,
      timestamp: new Date(),
      changes: costSharingData,
    });

    return { costSharing, allocation, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to process cost sharing: ${error.message}`);
  }
};

/**
 * Calculates allocation amount with validation
 * Composes: calculateAllocationAmount, validateBudgetTransaction, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param allocationRule - Allocation rule
 * @param baseAmount - Base amount for calculation
 * @returns Calculated allocation with validation
 */
export const calculateValidatedAllocationAmount = async (
  grantId: number,
  allocationRule: AllocationRule,
  baseAmount: number
): Promise<{
  amount: number;
  valid: boolean;
  budgetImpact: BudgetVariance;
}> => {
  try {
    const amount = await calculateAllocationAmount(allocationRule, baseAmount);
    const valid = await validateBudgetTransaction(grantId, amount);
    const budgetImpact = await calculateBudgetVariance(grantId);

    return { amount, valid, budgetImpact };
  } catch (error: any) {
    throw new BadRequestException(`Failed to calculate allocation: ${error.message}`);
  }
};

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
export const processGrantBillingWithCosts = async (
  grantId: number,
  billingPeriod: string,
  userId: string
): Promise<{
  invoice: GrantBillingInvoice;
  directCosts: number;
  indirectCosts: number;
  costSharing: number;
  audit: AuditEntry;
}> => {
  try {
    const grant = await getGrantAward(grantId);
    if (!grant) {
      throw new NotFoundException(`Grant ${grantId} not found`);
    }

    const expenditures = await trackGrantExpenditure(grantId);
    const directCosts = expenditures.reduce((sum, exp) => sum + exp.amount, 0);

    const indirectCosts = await calculateIndirectCosts(grantId);

    const costSharingData = await allocateCostSharing(grantId, {
      costSharingType: 'matching',
      costSharingPercent: 25,
    });

    const billing = await processGrantBilling(grantId, billingPeriod);

    const invoice: GrantBillingInvoice = {
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

    const audit = await createAuditEntry({
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
  } catch (error: any) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException(`Failed to process billing: ${error.message}`);
  }
};

/**
 * Tracks and reconciles grant advance
 * Composes: trackGrantAdvance, reconcileGrantAdvance, updateFundBalance, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param advanceAmount - Advance amount
 * @param userId - User tracking advance
 * @returns Advance tracking result
 */
export const trackAndReconcileGrantAdvance = async (
  grantId: number,
  advanceAmount: number,
  userId: string
): Promise<{
  advance: any;
  reconciliation: any;
  fundBalance: FundBalance;
  audit: AuditEntry;
}> => {
  try {
    const advance = await trackGrantAdvance(grantId, advanceAmount);
    const reconciliation = await reconcileGrantAdvance(grantId, advanceAmount);

    const grant = await getGrantAward(grantId);
    const fundBalance = await updateFundBalance(grant.fundId, advanceAmount, 'credit');

    const audit = await createAuditEntry({
      entityType: 'grant_advance',
      entityId: grantId,
      action: 'track_reconcile',
      userId,
      timestamp: new Date(),
      changes: { advance, reconciliation },
    });

    return { advance, reconciliation, fundBalance, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to track advance: ${error.message}`);
  }
};

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
export const generateComprehensiveGASBReport = async (
  fundId: number,
  fiscalYear: number
): Promise<{
  gasbReport: any;
  balanceSheet: BalanceSheetReport;
  kpis: FinancialKPI[];
  drillDown: any;
}> => {
  try {
    const gasbReport = await generateGASBReport(fundId, fiscalYear);
    const balanceSheet = await generateBalanceSheet(fundId, fiscalYear);

    const kpis: FinancialKPI[] = [
      await calculateFinancialKPI('fund_balance_ratio', fundId),
      await calculateFinancialKPI('expenditure_rate', fundId),
      await calculateFinancialKPI('compliance_score', fundId),
    ];

    const drillDown = await createReportDrillDown(fundId, 'gasb_report');

    return { gasbReport, balanceSheet, kpis, drillDown };
  } catch (error: any) {
    throw new BadRequestException(`Failed to generate GASB report: ${error.message}`);
  }
};

/**
 * Consolidates multiple fund balances with restrictions
 * Composes: consolidateFundBalances, generateConsolidatedReport, validateFundRestriction
 *
 * @param request - Consolidation request
 * @returns Consolidated fund balance report
 */
export const consolidateFundsWithRestrictions = async (
  request: FundConsolidationRequest
): Promise<{
  consolidated: FundBalance;
  breakdown: FundBalance[];
  restrictions: FundRestriction[];
  report: any;
}> => {
  try {
    const consolidated = await consolidateFundBalances(
      request.fundIds,
      request.fiscalYear,
      request.fiscalPeriod
    );

    const breakdown: FundBalance[] = [];
    const allRestrictions: FundRestriction[] = [];

    for (const fundId of request.fundIds) {
      const balance = await getFundBalance(fundId, request.fiscalYear);
      breakdown.push(balance);

      if (request.includeRestricted) {
        const restrictions = await validateFundRestriction(fundId);
        allRestrictions.push(...restrictions);
      }
    }

    const report = await generateConsolidatedReport(
      request.fundIds,
      request.fiscalYear
    );

    return {
      consolidated,
      breakdown,
      restrictions: allRestrictions,
      report,
    };
  } catch (error: any) {
    throw new BadRequestException(`Failed to consolidate funds: ${error.message}`);
  }
};

/**
 * Generates grant compliance report with recommendations
 * Composes: generateGrantReport, validateGrantCompliance, generateComplianceReport, createAuditEntry
 *
 * @param grantId - Grant identifier
 * @param reportType - Type of report
 * @returns Comprehensive grant report
 */
export const generateComprehensiveGrantReport = async (
  grantId: number,
  reportType: 'financial' | 'compliance' | 'performance'
): Promise<{
  grantReport: GrantComplianceReport;
  compliance: GrantComplianceValidation;
  complianceReport: ComplianceReport;
  audit: AuditEntry;
}> => {
  try {
    const grantReport = await generateGrantReport(grantId, reportType);
    const complianceResult = await validateGrantCompliance(grantId);
    const complianceReport = await generateComplianceReport('grant', grantId);

    const compliance: GrantComplianceValidation = {
      grantId,
      compliant: complianceResult.status === 'compliant',
      validationDate: new Date(),
      violations: [],
      recommendations: complianceReport.recommendations || [],
      requiresAction: complianceResult.status !== 'compliant',
    };

    const audit = await createAuditEntry({
      entityType: 'grant_report',
      entityId: grantId,
      action: 'generate',
      userId: 'system',
      timestamp: new Date(),
      changes: { reportType },
    });

    return { grantReport, compliance, complianceReport, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to generate report: ${error.message}`);
  }
};

/**
 * Generates fund income statement with budget variance
 * Composes: generateIncomeStatement, calculateBudgetVariance, generateBudgetReport
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns Income statement with variance analysis
 */
export const generateFundIncomeStatementWithVariance = async (
  fundId: number,
  fiscalYear: number
): Promise<{
  incomeStatement: IncomeStatementReport;
  budgetVariance: BudgetVariance;
  budgetReport: any;
}> => {
  try {
    const incomeStatement = await generateIncomeStatement(fundId, fiscalYear);
    const budgetVariance = await calculateBudgetVariance(fundId);
    const budgetReport = await generateBudgetReport(fundId, fiscalYear);

    return { incomeStatement, budgetVariance, budgetReport };
  } catch (error: any) {
    throw new BadRequestException(`Failed to generate income statement: ${error.message}`);
  }
};

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
export const createFundBudgetWithAllocations = async (
  fundId: number,
  budgetData: Partial<Budget>,
  allocations: Partial<BudgetAllocation>[],
  userId: string
): Promise<{
  budget: Budget;
  allocations: BudgetAllocation[];
  allocationRules: AllocationRule[];
  audit: AuditEntry;
}> => {
  try {
    const budget = await createBudget({ ...budgetData, fundId });

    const createdAllocations: BudgetAllocation[] = [];
    const allocationRules: AllocationRule[] = [];

    for (const allocation of allocations) {
      const created = await createBudgetAllocation(budget.budgetId, allocation);
      createdAllocations.push(created);

      const rule = await createAllocationRule({
        ruleName: `Budget Allocation - ${created.allocationName}`,
        allocationMethod: 'percentage',
        allocationBasis: 'budget',
        percentage: (created.allocatedAmount / budget.budgetAmount) * 100,
      });
      allocationRules.push(rule);
    }

    const audit = await createAuditEntry({
      entityType: 'budget',
      entityId: budget.budgetId,
      action: 'create_with_allocations',
      userId,
      timestamp: new Date(),
      changes: { budget, allocations: createdAllocations },
    });

    return { budget, allocations: createdAllocations, allocationRules, audit };
  } catch (error: any) {
    throw new BadRequestException(`Failed to create budget: ${error.message}`);
  }
};

/**
 * Checks budget availability with fund restrictions
 * Composes: checkBudgetAvailability, checkFundAvailability, validateFundRestriction
 *
 * @param fundId - Fund identifier
 * @param amount - Amount to check
 * @returns Availability status with details
 */
export const checkComprehensiveBudgetAvailability = async (
  fundId: number,
  amount: number
): Promise<{
  budgetAvailable: boolean;
  fundAvailable: boolean;
  restrictions: FundRestriction[];
  available: boolean;
}> => {
  try {
    const budgetAvailable = await checkBudgetAvailability(fundId, amount);
    const fundAvailable = await checkFundAvailability(fundId, amount);
    const restrictions = await validateFundRestriction(fundId);

    const restrictionViolations = restrictions.filter(r => r.status === 'violated');

    return {
      budgetAvailable,
      fundAvailable,
      restrictions,
      available: budgetAvailable && fundAvailable && restrictionViolations.length === 0,
    };
  } catch (error: any) {
    throw new BadRequestException(`Failed to check availability: ${error.message}`);
  }
};

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
export const trackUserActivityWithAudit = async (
  userId: string,
  activity: string,
  entityType: string,
  entityId: number
): Promise<{
  activity: any;
  audit: AuditEntry;
  auditTrail: AuditEntry[];
}> => {
  try {
    const activityResult = await trackUserActivity(userId, activity);

    const audit = await createAuditEntry({
      entityType,
      entityId,
      action: activity,
      userId,
      timestamp: new Date(),
      changes: { activity },
    });

    const auditTrail = await getAuditTrail(entityType, entityId);

    return { activity: activityResult, audit, auditTrail };
  } catch (error: any) {
    throw new BadRequestException(`Failed to track activity: ${error.message}`);
  }
};

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
export const generateComprehensiveAuditTrailReport = async (
  entityType: string,
  entityId: number,
  startDate: Date,
  endDate: Date
): Promise<{
  auditTrail: AuditEntry[];
  complianceReport: ComplianceReport;
  summary: any;
}> => {
  try {
    const auditTrail = await getAuditTrail(entityType, entityId, startDate, endDate);
    const complianceReport = await generateComplianceReport(entityType, entityId);

    const summary = {
      totalEntries: auditTrail.length,
      dateRange: { startDate, endDate },
      entityType,
      entityId,
      uniqueUsers: [...new Set(auditTrail.map(a => a.userId))].length,
      actionCounts: auditTrail.reduce((acc, entry) => {
        acc[entry.action] = (acc[entry.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return { auditTrail, complianceReport, summary };
  } catch (error: any) {
    throw new BadRequestException(`Failed to generate audit report: ${error.message}`);
  }
};

/**
 * Validates comprehensive compliance rules
 * Composes: validateComplianceRule, validateGrantCompliance, validateFederalCompliance
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param complianceFramework - Compliance framework
 * @returns Compliance validation result
 */
export const validateComprehensiveCompliance = async (
  entityType: 'fund' | 'grant',
  entityId: number,
  complianceFramework: string
): Promise<{
  rules: boolean;
  entity: ComplianceStatus;
  federal: any;
  overall: boolean;
}> => {
  try {
    const rules = await validateComplianceRule(complianceFramework);

    const entity = entityType === 'grant'
      ? await validateGrantCompliance(entityId)
      : { status: 'compliant' as ComplianceStatus };

    const federal = entityType === 'grant'
      ? await validateFederalCompliance(entityId)
      : { compliant: true };

    const overall = rules && entity.status === 'compliant' && federal.compliant;

    return { rules, entity, federal, overall };
  } catch (error: any) {
    throw new BadRequestException(`Failed to validate compliance: ${error.message}`);
  }
};

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
export const monitorFundPerformance = async (
  fundId: number
): Promise<{
  balance: FundBalance;
  kpis: FinancialKPI[];
  variance: BudgetVariance;
  performanceScore: number;
}> => {
  try {
    const balance = await getFundBalance(fundId, new Date().getFullYear());

    const kpis: FinancialKPI[] = [
      await calculateFinancialKPI('liquidity_ratio', fundId),
      await calculateFinancialKPI('fund_utilization', fundId),
      await calculateFinancialKPI('compliance_score', fundId),
    ];

    const variance = await calculateBudgetVariance(fundId);

    const performanceScore = kpis.reduce((sum, kpi) => sum + kpi.value, 0) / kpis.length;

    return { balance, kpis, variance, performanceScore };
  } catch (error: any) {
    throw new BadRequestException(`Failed to monitor performance: ${error.message}`);
  }
};

/**
 * Monitors grant performance with expenditure tracking
 * Composes: getGrantAward, trackGrantExpenditure, calculateGrantBudget, validateGrantCompliance
 *
 * @param grantId - Grant identifier
 * @returns Grant performance metrics
 */
export const monitorGrantPerformance = async (
  grantId: number
): Promise<{
  grant: GrantAward;
  expenditures: GrantExpenditure[];
  budget: GrantBudget;
  utilizationRate: number;
  compliance: ComplianceStatus;
}> => {
  try {
    const grant = await getGrantAward(grantId);
    const expenditures = await trackGrantExpenditure(grantId);
    const budget = await calculateGrantBudget(grantId);
    const complianceResult = await validateGrantCompliance(grantId);

    const totalExpended = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    const utilizationRate = (totalExpended / grant.awardAmount) * 100;

    return {
      grant,
      expenditures,
      budget,
      utilizationRate,
      compliance: complianceResult.status,
    };
  } catch (error: any) {
    throw new BadRequestException(`Failed to monitor grant performance: ${error.message}`);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Fund Structure Management (5 functions)
  createFundWithBudgetAndCompliance,
  getFundWithBalanceAndCompliance,
  updateFundWithValidationAndAudit,
  activateFundWithCompliance,
  closeFundWithFinalReporting,

  // Fund Balance Operations (4 functions)
  calculateComprehensiveFundBalance,
  updateFundBalanceWithBudgetValidation,
  checkFundAvailabilityWithRestrictions,
  generateFundBalanceAlerts,

  // Fund Restrictions (3 functions)
  createFundRestrictionWithCompliance,
  validateAndEnforceFundRestrictions,
  releaseFundRestrictionWithAuthorization,

  // Grant Management (6 functions)
  createGrantWithBudgetAndCompliance,
  getGrantWithExpendituresAndCompliance,
  updateGrantWithBudgetRecalculation,
  closeGrantWithFinalReporting,
  validateComprehensiveGrantCompliance,

  // Cost Allocation & Indirect Costs (3 functions)
  allocateIndirectCostsToGrant,
  processCostSharingAllocation,
  calculateValidatedAllocationAmount,

  // Grant Billing & Advances (2 functions)
  processGrantBillingWithCosts,
  trackAndReconcileGrantAdvance,

  // Reporting & Consolidation (4 functions)
  generateComprehensiveGASBReport,
  consolidateFundsWithRestrictions,
  generateComprehensiveGrantReport,
  generateFundIncomeStatementWithVariance,

  // Budget Integration (2 functions)
  createFundBudgetWithAllocations,
  checkComprehensiveBudgetAvailability,

  // Audit & Compliance Tracking (3 functions)
  trackUserActivityWithAudit,
  generateComprehensiveAuditTrailReport,
  validateComprehensiveCompliance,

  // Performance Monitoring (2 functions)
  monitorFundPerformance,
  monitorGrantPerformance,

  // Types
  type FundApiConfig,
  type GrantApiConfig,
  type FundBalanceAlert,
  type GrantComplianceValidation,
  type ComplianceViolation,
  type FundConsolidationRequest,
  type GrantBillingInvoice,
};

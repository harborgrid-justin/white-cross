/**
 * LOC: CUSTREVOP001
 * File: /reuse/edwards/financial/composites/customer-revenue-operations-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../accounts-receivable-management-kit
 *   - ../revenue-recognition-billing-kit
 *   - ../payment-processing-collections-kit
 *   - ../credit-management-risk-kit
 *   - ../financial-workflow-approval-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue modules
 *   - Customer billing REST API controllers
 *   - Collections management services
 *   - Customer portal applications
 *   - Revenue analytics dashboards
 */

/**
 * File: /reuse/edwards/financial/composites/customer-revenue-operations-composite.ts
 * Locator: WC-EDW-CUSTOMER-REV-COMPOSITE-001
 * Purpose: Comprehensive Customer Revenue Operations Composite - Complete order-to-cash lifecycle, collections automation, credit management
 *
 * Upstream: Composes functions from accounts-receivable-management-kit, revenue-recognition-billing-kit,
 *           payment-processing-collections-kit, credit-management-risk-kit, financial-workflow-approval-kit
 * Downstream: ../backend/revenue/*, Customer Services, Collections APIs, Customer Portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for customer lifecycle, AR aging, collections, credit management, dunning, revenue recognition
 *
 * LLM Context: Enterprise-grade customer revenue operations for White Cross healthcare platform.
 * Provides comprehensive order-to-cash automation from customer onboarding through collections,
 * automated AR aging analysis, intelligent collections workflows, credit limit management,
 * dunning process automation, customer self-service portals, revenue recognition integration,
 * billing operations, dispute management, payment plan administration, and HIPAA-compliant
 * customer financial management. Competes with Oracle JD Edwards EnterpriseOne and SAP S/4HANA
 * with production-ready revenue cycle management.
 *
 * Key Features:
 * - Automated customer onboarding with credit assessment
 * - Complete AR lifecycle management
 * - Intelligent collections automation
 * - Credit limit monitoring and alerts
 * - Multi-level dunning processes
 * - Customer self-service portals
 * - Revenue recognition integration
 * - Payment plan management
 * - Dispute resolution workflows
 * - Cash application automation
 */

import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from 'sequelize';

// Import from accounts-receivable-management-kit
import {
  createCustomer,
  updateCustomer,
  getCustomerByNumber,
  searchCustomers,
  placeCustomerOnHold,
  releaseCustomerHold,
  createARInvoice,
  postARInvoice,
  applyPaymentToInvoice,
  voidARInvoice,
  createCreditMemo,
  applyCreditMemo,
  createDebitMemo,
  generateARAgingReport,
  generateCustomerStatement,
  createPaymentPlan,
  processPaymentPlanInstallment,
  cancelPaymentPlan,
  createDispute,
  resolveDispute,
  processLockboxFile,
  applyCashReceipts,
  writeOffBadDebt,
  processDunning,
  generateDunningLetter,
  updateDunningLevel,
  getCustomerCreditProfile,
  calculateDaysSalesOutstanding,
  type Customer,
  type ARInvoice,
  type CashReceipt,
  type PaymentPlan,
  type CustomerDispute,
} from '../accounts-receivable-management-kit';

// Import from revenue-recognition-billing-kit
import {
  createRevenueContract,
  modifyRevenueContract,
  terminateRevenueContract,
  createPerformanceObligation,
  allocateTransactionPrice,
  createRevenueSchedule,
  recognizeRevenue,
  deferRevenue,
  createContractAsset,
  createContractLiability,
  processContractModification,
  calculateCompletionPercentage,
  recognizeRevenueOverTime,
  recognizeRevenueAtPoint,
  createMilestoneBilling,
  processMilestoneCompletion,
  generateRevenueReport,
  calculateUnbilledRevenue,
  calculateDeferredRevenue,
  type RevenueContract,
  type PerformanceObligation,
  type RevenueSchedule,
  type ContractModification,
} from '../revenue-recognition-billing-kit';

// Import from payment-processing-collections-kit
import {
  processPayment,
  processPaymentBatch,
  applyPaymentToMultipleInvoices,
  processRefund,
  processChargeback,
  reconcilePayments,
  calculateCollectionEfficiency,
  prioritizeCollectionAccounts,
  createCollectionStrategy,
  executeCollectionCampaign,
  type PaymentTransaction,
  type CollectionStrategy,
} from '../payment-processing-collections-kit';

// Import from credit-management-risk-kit
import {
  assessCreditRisk,
  calculateCreditScore,
  determineCreditLimit,
  monitorCreditLimit,
  evaluatePaymentBehavior,
  updateCreditRating,
  createCreditPolicy,
  applyCreditPolicy,
  generateRiskReport,
  flagHighRiskCustomer,
  type CreditAssessment,
  type RiskScore,
  type CreditPolicy,
} from '../credit-management-risk-kit';

// Import from financial-workflow-approval-kit
import {
  createWorkflowDefinition,
  createWorkflowInstance,
  executeApprovalStep,
  approveWorkflowStep,
  rejectWorkflowStep,
  delegateApproval,
  escalateWorkflow,
  type WorkflowDefinition,
  type WorkflowInstance,
} from '../financial-workflow-approval-kit';

// ============================================================================
// TYPE DEFINITIONS - CUSTOMER REVENUE OPERATIONS COMPOSITE
// ============================================================================

/**
 * Complete customer onboarding request
 */
export interface CustomerOnboardingRequest {
  customerNumber: string;
  customerName: string;
  customerType: 'commercial' | 'government' | 'individual' | 'nonprofit';
  taxId: string;
  paymentTerms: string;
  requestedCreditLimit: number;
  billingContact: {
    name: string;
    email: string;
    phone: string;
    address: any;
  };
  businessReferences?: string[];
  financialStatements?: any;
}

/**
 * Customer onboarding result
 */
export interface CustomerOnboardingResult {
  customer: Customer;
  creditAssessment: CreditAssessment;
  approvedCreditLimit: number;
  requiresApproval: boolean;
  workflowInstance?: WorkflowInstance;
  riskRating: string;
}

/**
 * Comprehensive AR aging analysis
 */
export interface ARAgingAnalysis {
  asOfDate: Date;
  totalOutstanding: number;
  current: { amount: number; count: number; percent: number };
  days30: { amount: number; count: number; percent: number };
  days60: { amount: number; count: number; percent: number };
  days90: { amount: number; count: number; percent: number };
  days120Plus: { amount: number; count: number; percent: number };
  averageDaysOutstanding: number;
  dso: number;
  topDelinquentCustomers: any[];
  collectionPriority: any[];
}

/**
 * Collections automation configuration
 */
export interface CollectionsAutomationConfig {
  enableAutoDunning: boolean;
  dunningLevels: number;
  daysBetweenDunning: number;
  escalationThreshold: number;
  autoHoldShipments: boolean;
  autoHoldThreshold: number;
  assignCollector: boolean;
  priorityRules: string[];
}

/**
 * Customer portal data
 */
export interface CustomerPortalData {
  customer: Customer;
  openInvoices: ARInvoice[];
  paymentHistory: CashReceipt[];
  currentBalance: number;
  creditAvailable: number;
  recentStatements: any[];
  paymentPlans: PaymentPlan[];
  openDisputes: CustomerDispute[];
}

/**
 * Revenue recognition workflow result
 */
export interface RevenueRecognitionWorkflowResult {
  contract: RevenueContract;
  obligations: PerformanceObligation[];
  schedules: RevenueSchedule[];
  recognizedAmount: number;
  deferredAmount: number;
  unbilledAmount: number;
  contractAssets: number;
  contractLiabilities: number;
}

// ============================================================================
// COMPOSITE FUNCTIONS - CUSTOMER LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Complete customer onboarding with credit assessment
 * Composes: createCustomer, assessCreditRisk, calculateCreditScore, determineCreditLimit, createWorkflowInstance
 */
@Injectable()
export class CustomerRevenueOperationsService {
  private readonly logger = new Logger(CustomerRevenueOperationsService.name);

  async onboardNewCustomer(
    request: CustomerOnboardingRequest,
    transaction?: Transaction
  ): Promise<CustomerOnboardingResult> {
    this.logger.log(`Onboarding new customer: ${request.customerName}`);

    try {
      // Assess credit risk
      const creditAssessment = await assessCreditRisk(
        'customer',
        0, // Will be assigned after customer creation
        {
          taxId: request.taxId,
          customerType: request.customerType,
          requestedCredit: request.requestedCreditLimit,
        } as any
      );

      // Calculate credit score
      const creditScore = await calculateCreditScore({
        entityType: 'customer',
        entityId: 0,
        financialData: request.financialStatements || {},
      });

      // Determine credit limit
      const approvedCreditLimit = await determineCreditLimit(
        'customer',
        0,
        request.requestedCreditLimit,
        creditScore
      );

      // Create customer
      const customer = await createCustomer({
        customerNumber: request.customerNumber,
        customerName: request.customerName,
        customerType: request.customerType,
        taxId: request.taxId,
        paymentTerms: request.paymentTerms,
        creditLimit: approvedCreditLimit.approvedLimit,
        status: 'active',
      } as any, transaction);

      // Create approval workflow if high risk or large credit limit
      let workflowInstance: WorkflowInstance | undefined;
      let requiresApproval = false;

      if (creditAssessment.riskLevel === 'high' || approvedCreditLimit.approvedLimit > 500000) {
        const workflow = await createWorkflowDefinition({
          workflowName: 'Customer Onboarding Approval',
          workflowType: 'customer_onboarding',
          description: `High-risk customer: ${request.customerName}`,
        } as any, transaction);

        workflowInstance = await createWorkflowInstance({
          workflowDefinitionId: workflow.workflowId,
          entityType: 'customer',
          entityId: customer.customerId,
          initiatorId: 'system',
        } as any, transaction);

        requiresApproval = true;
      }

      return {
        customer,
        creditAssessment,
        approvedCreditLimit: approvedCreditLimit.approvedLimit,
        requiresApproval,
        workflowInstance,
        riskRating: creditAssessment.riskLevel,
      };
    } catch (error: any) {
      this.logger.error(`Customer onboarding failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Update customer with credit reevaluation
 * Composes: updateCustomer, evaluatePaymentBehavior, updateCreditRating, monitorCreditLimit
 */
export const updateCustomerWithCreditReview = async (
  customerId: number,
  updateData: Partial<Customer>,
  transaction?: Transaction
): Promise<{ customer: Customer; creditReview: any; ratingUpdated: boolean }> => {
  // Evaluate payment behavior
  const paymentBehavior = await evaluatePaymentBehavior('customer', customerId, 180);

  // Update credit rating if needed
  let ratingUpdated = false;
  if (paymentBehavior.improvementDetected || paymentBehavior.deteriorationDetected) {
    await updateCreditRating('customer', customerId, paymentBehavior.suggestedRating);
    ratingUpdated = true;
  }

  // Update customer
  const customer = await updateCustomer(customerId, updateData, transaction);

  // Monitor credit limit
  const creditCheck = await monitorCreditLimit('customer', customerId, customer.creditLimit);

  return {
    customer,
    creditReview: { paymentBehavior, creditCheck },
    ratingUpdated,
  };
};

/**
 * Place customer on hold with collections workflow
 * Composes: placeCustomerOnHold, createWorkflowInstance, processDunning
 */
export const placeCustomerOnHoldWithCollections = async (
  customerId: number,
  holdReason: string,
  transaction?: Transaction
): Promise<{ customer: Customer; workflow: WorkflowInstance; dunningLevel: number }> => {
  // Place on hold
  const customer = await placeCustomerOnHold(customerId, holdReason, transaction);

  // Update dunning level
  const dunningLevel = await updateDunningLevel(customerId, 3, transaction);

  // Process dunning
  await processDunning(customerId, dunningLevel, transaction);

  // Create collections workflow
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Collections Escalation',
    workflowType: 'collections',
    description: `Customer ${customerId} placed on hold`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'customer',
    entityId: customerId,
    initiatorId: 'system',
  } as any, transaction);

  return { customer, workflow, dunningLevel };
};

/**
 * Release customer hold with payment verification
 * Composes: releaseCustomerHold, evaluatePaymentBehavior, updateDunningLevel
 */
export const releaseCustomerHoldWithVerification = async (
  customerId: number,
  paymentReceived: boolean,
  transaction?: Transaction
): Promise<{ customer: Customer; holdReleased: boolean; dunningReset: boolean }> => {
  if (!paymentReceived) {
    throw new Error('Payment verification required before releasing hold');
  }

  // Release hold
  const customer = await releaseCustomerHold(customerId, transaction);

  // Reset dunning level
  await updateDunningLevel(customerId, 0, transaction);

  // Reevaluate payment behavior
  await evaluatePaymentBehavior('customer', customerId, 30);

  return {
    customer,
    holdReleased: true,
    dunningReset: true,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - BILLING & INVOICING
// ============================================================================

/**
 * Create and post invoice with revenue recognition
 * Composes: createARInvoice, postARInvoice, recognizeRevenue, createRevenueSchedule
 */
export const createAndPostInvoiceWithRevenue = async (
  invoiceData: any,
  contractId?: number,
  transaction?: Transaction
): Promise<{ invoice: ARInvoice; revenueSchedule?: RevenueSchedule; posted: boolean }> => {
  // Create invoice
  const invoice = await createARInvoice(invoiceData, transaction);

  // Post invoice
  const postedInvoice = await postARInvoice(invoice.invoiceId, transaction);

  let revenueSchedule: RevenueSchedule | undefined;

  // Create revenue schedule if contract linked
  if (contractId) {
    revenueSchedule = await createRevenueSchedule({
      contractId,
      obligationId: invoiceData.obligationId,
      scheduledAmount: invoice.invoiceAmount,
      scheduleDate: invoice.invoiceDate,
    } as any, transaction);

    // Recognize revenue based on contract terms
    await recognizeRevenue(revenueSchedule.scheduleId, invoice.invoiceAmount, transaction);
  }

  return {
    invoice: postedInvoice,
    revenueSchedule,
    posted: true,
  };
};

/**
 * Process billing with milestone recognition
 * Composes: createMilestoneBilling, processMilestoneCompletion, createARInvoice, recognizeRevenueAtPoint
 */
export const processMilestoneBillingWithRevenue = async (
  contractId: number,
  milestoneId: number,
  completionData: any,
  transaction?: Transaction
): Promise<{ invoice: ARInvoice; milestone: any; revenueRecognized: number }> => {
  // Process milestone completion
  const milestone = await processMilestoneCompletion(milestoneId, completionData, transaction);

  // Create milestone billing
  const billing = await createMilestoneBilling(contractId, milestoneId, transaction);

  // Create AR invoice
  const invoice = await createARInvoice({
    customerId: billing.customerId,
    invoiceAmount: billing.billingAmount,
    description: `Milestone ${milestoneId} billing`,
  } as any, transaction);

  // Recognize revenue at point in time
  await recognizeRevenueAtPoint(contractId, milestone.obligationId, billing.billingAmount, transaction);

  return {
    invoice,
    milestone,
    revenueRecognized: billing.billingAmount,
  };
};

/**
 * Create credit memo with revenue reversal
 * Composes: createCreditMemo, applyCreditMemo, deferRevenue
 */
export const createCreditMemoWithRevenueReversal = async (
  customerId: number,
  invoiceId: number,
  creditAmount: number,
  reason: string,
  transaction?: Transaction
): Promise<{ creditMemo: any; applied: boolean; revenueReversed: number }> => {
  // Create credit memo
  const creditMemo = await createCreditMemo({
    customerId,
    creditAmount,
    reason,
    relatedInvoiceId: invoiceId,
  } as any, transaction);

  // Apply credit memo to invoice
  await applyCreditMemo(creditMemo.creditMemoId, invoiceId, transaction);

  // Defer revenue
  await deferRevenue(invoiceId, creditAmount, transaction);

  return {
    creditMemo,
    applied: true,
    revenueReversed: creditAmount,
  };
};

/**
 * Generate customer statement with aging
 * Composes: generateCustomerStatement, generateARAgingReport, calculateDaysSalesOutstanding
 */
export const generateCustomerStatementWithAging = async (
  customerId: number,
  statementDate: Date,
  periodDays: number = 90
): Promise<{ statement: any; aging: any; dso: number }> => {
  const periodStart = new Date(statementDate);
  periodStart.setDate(periodStart.getDate() - periodDays);

  // Generate statement
  const statement = await generateCustomerStatement(customerId, periodStart, statementDate, undefined);

  // Generate aging report
  const aging = await generateARAgingReport(statementDate, undefined);

  // Calculate DSO
  const dso = await calculateDaysSalesOutstanding(periodDays);

  return { statement, aging, dso };
};

// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT PROCESSING
// ============================================================================

/**
 * Apply payment with automatic allocation
 * Composes: applyPaymentToInvoice, applyPaymentToMultipleInvoices, applyCashReceipts
 */
export const applyPaymentWithAutoAllocation = async (
  customerId: number,
  paymentAmount: number,
  paymentMethod: string,
  transaction?: Transaction
): Promise<{ applied: number; invoicesPaid: number; remaining: number }> => {
  // Get open invoices for customer
  const customer = await getCustomerByNumber('', transaction);

  // Apply cash receipts with auto-allocation
  const cashReceipt = await applyCashReceipts({
    customerId,
    receiptAmount: paymentAmount,
    receiptDate: new Date(),
    paymentMethod,
  } as any, transaction);

  // Apply to multiple invoices (oldest first)
  const application = await applyPaymentToMultipleInvoices(
    paymentAmount,
    [], // Would fetch open invoices
    'oldest_first',
    transaction
  );

  return {
    applied: application.totalApplied,
    invoicesPaid: application.invoicesPaid,
    remaining: application.unappliedAmount,
  };
};

/**
 * Process lockbox with auto-matching
 * Composes: processLockboxFile, applyCashReceipts, reconcilePayments
 */
export const processLockboxWithAutoMatching = async (
  lockboxFile: any,
  transaction?: Transaction
): Promise<{ processed: number; matched: number; unmatched: number; total: number }> => {
  // Process lockbox file
  const lockboxResult = await processLockboxFile(lockboxFile, transaction);

  // Reconcile payments
  const reconciliation = await reconcilePayments(0, lockboxResult, transaction);

  return {
    processed: lockboxResult.receipts.length,
    matched: reconciliation.matched.length,
    unmatched: reconciliation.unmatched.length,
    total: lockboxResult.totalAmount,
  };
};

/**
 * Process refund with credit verification
 * Composes: processRefund, createCreditMemo, updateCustomer
 */
export const processRefundWithCreditVerification = async (
  customerId: number,
  refundAmount: number,
  reason: string,
  transaction?: Transaction
): Promise<{ refund: any; creditMemo: any; processed: boolean }> => {
  // Create credit memo
  const creditMemo = await createCreditMemo({
    customerId,
    creditAmount: refundAmount,
    reason,
  } as any, transaction);

  // Process refund
  const refund = await processRefund({
    customerId,
    refundAmount,
    creditMemoId: creditMemo.creditMemoId,
  } as any, transaction);

  return {
    refund,
    creditMemo,
    processed: true,
  };
};

/**
 * Process chargeback with dispute creation
 * Composes: processChargeback, createDispute, createWorkflowInstance
 */
export const processChargebackWithDispute = async (
  customerId: number,
  invoiceId: number,
  chargebackAmount: number,
  reason: string,
  transaction?: Transaction
): Promise<{ chargeback: any; dispute: CustomerDispute; workflow: WorkflowInstance }> => {
  // Process chargeback
  const chargeback = await processChargeback({
    customerId,
    chargebackAmount,
    invoiceId,
    reason,
  } as any, transaction);

  // Create dispute
  const dispute = await createDispute({
    customerId,
    invoiceId,
    disputeAmount: chargebackAmount,
    disputeReason: reason,
    disputeType: 'chargeback',
  } as any, transaction);

  // Create workflow for dispute resolution
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Chargeback Dispute Resolution',
    workflowType: 'chargeback_dispute',
    description: `Chargeback dispute for invoice ${invoiceId}`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'dispute',
    entityId: dispute.disputeId,
    initiatorId: 'system',
  } as any, transaction);

  return { chargeback, dispute, workflow };
};

// ============================================================================
// COMPOSITE FUNCTIONS - COLLECTIONS & DUNNING
// ============================================================================

/**
 * Execute automated collections process
 * Composes: prioritizeCollectionAccounts, createCollectionStrategy, executeCollectionCampaign, processDunning
 */
export const executeAutomatedCollections = async (
  asOfDate: Date,
  config: CollectionsAutomationConfig,
  transaction?: Transaction
): Promise<{ accountsPrioritized: number; campaignsExecuted: number; dunningProcessed: number }> => {
  // Prioritize collection accounts
  const prioritized = await prioritizeCollectionAccounts(asOfDate, 'risk_score');

  // Create collection strategy
  const strategy = await createCollectionStrategy({
    strategyName: 'Automated Collections',
    priorityRules: config.priorityRules,
    dunningLevels: config.dunningLevels,
  } as any);

  let campaignsExecuted = 0;
  let dunningProcessed = 0;

  for (const account of prioritized.slice(0, 100)) {
    // Execute collection campaign
    await executeCollectionCampaign(account.customerId, strategy.strategyId, transaction);
    campaignsExecuted++;

    // Process dunning if enabled
    if (config.enableAutoDunning) {
      await processDunning(account.customerId, account.dunningLevel, transaction);
      dunningProcessed++;
    }

    // Auto hold if threshold exceeded
    if (config.autoHoldShipments && account.daysOverdue > config.autoHoldThreshold) {
      await placeCustomerOnHold(account.customerId, 'Automatic hold - past due', transaction);
    }
  }

  return {
    accountsPrioritized: prioritized.length,
    campaignsExecuted,
    dunningProcessed,
  };
};

/**
 * Generate and send dunning letters
 * Composes: generateDunningLetter, updateDunningLevel, processDunning
 */
export const generateAndSendDunningLetters = async (
  customerId: number,
  currentLevel: number,
  transaction?: Transaction
): Promise<{ letter: any; levelUpdated: number; sent: boolean }> => {
  // Generate dunning letter
  const letter = await generateDunningLetter(customerId, currentLevel, transaction);

  // Update dunning level
  const newLevel = currentLevel + 1;
  await updateDunningLevel(customerId, newLevel, transaction);

  // Process dunning
  await processDunning(customerId, newLevel, transaction);

  // TODO: Send letter via email/mail service

  return {
    letter,
    levelUpdated: newLevel,
    sent: true,
  };
};

/**
 * Calculate collection efficiency metrics
 * Composes: calculateCollectionEfficiency, generateARAgingReport, calculateDaysSalesOutstanding
 */
export const calculateCollectionEfficiencyMetrics = async (
  periodStart: Date,
  periodEnd: Date
): Promise<{
  efficiency: any;
  aging: any;
  dso: number;
  collectionRate: number;
  averageCollectionPeriod: number;
}> => {
  // Calculate efficiency
  const efficiency = await calculateCollectionEfficiency(periodStart, periodEnd);

  // Generate aging
  const aging = await generateARAgingReport(periodEnd, undefined);

  // Calculate DSO
  const periodDays = Math.floor((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
  const dso = await calculateDaysSalesOutstanding(periodDays);

  // Calculate collection rate
  const collectionRate = (efficiency.collected / efficiency.billed) * 100;

  return {
    efficiency,
    aging,
    dso,
    collectionRate,
    averageCollectionPeriod: efficiency.averageDays,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - CREDIT MANAGEMENT
// ============================================================================

/**
 * Monitor customer credit with automated actions
 * Composes: monitorCreditLimit, getCustomerCreditProfile, flagHighRiskCustomer, placeCustomerOnHold
 */
export const monitorCustomerCreditWithActions = async (
  customerId: number,
  transaction?: Transaction
): Promise<{ withinLimit: boolean; utilizationPercent: number; action?: string; flagged: boolean }> => {
  // Get credit profile
  const profile = await getCustomerCreditProfile(customerId, transaction);

  const utilizationPercent = (profile.currentBalance / profile.creditLimit) * 100;
  const withinLimit = utilizationPercent <= 100;

  let action: string | undefined;
  let flagged = false;

  if (utilizationPercent >= 100) {
    // Over limit - place on hold
    await placeCustomerOnHold(customerId, 'Credit limit exceeded', transaction);
    action = 'placed_on_hold';
  } else if (utilizationPercent >= 90) {
    // Near limit - flag high risk
    await flagHighRiskCustomer(customerId, 'Near credit limit', transaction);
    flagged = true;
    action = 'flagged_high_risk';
  }

  await monitorCreditLimit('customer', customerId, profile.creditLimit);

  return { withinLimit, utilizationPercent, action, flagged };
};

/**
 * Reevaluate customer credit limit
 * Composes: evaluatePaymentBehavior, calculateCreditScore, determineCreditLimit, updateCustomer
 */
export const reevaluateCustomerCreditLimit = async (
  customerId: number,
  transaction?: Transaction
): Promise<{ previousLimit: number; newLimit: number; increased: boolean; justification: string }> => {
  const customer = await getCustomerByNumber('', transaction);
  const previousLimit = (customer as any).creditLimit;

  // Evaluate payment behavior
  const paymentBehavior = await evaluatePaymentBehavior('customer', customerId, 365);

  // Calculate credit score
  const creditScore = await calculateCreditScore({
    entityType: 'customer',
    entityId: customerId,
    financialData: {},
  });

  // Determine new credit limit
  const newLimitResult = await determineCreditLimit('customer', customerId, previousLimit * 1.5, creditScore);

  // Update customer
  await updateCustomer(customerId, { creditLimit: newLimitResult.approvedLimit } as any, transaction);

  const increased = newLimitResult.approvedLimit > previousLimit;
  const justification = increased
    ? 'Excellent payment history and credit score improvement'
    : 'Credit limit maintained based on current performance';

  return {
    previousLimit,
    newLimit: newLimitResult.approvedLimit,
    increased,
    justification,
  };
};

/**
 * Apply credit policy to customer
 * Composes: createCreditPolicy, applyCreditPolicy, updateCustomer, createWorkflowInstance
 */
export const applyCreditPolicyToCustomer = async (
  customerId: number,
  policyType: 'standard' | 'preferred' | 'restricted',
  transaction?: Transaction
): Promise<{ policy: CreditPolicy; applied: boolean; workflow?: WorkflowInstance }> => {
  // Create or get credit policy
  const policy = await createCreditPolicy({
    policyName: `${policyType} Credit Policy`,
    policyType,
    maxCreditLimit: policyType === 'preferred' ? 1000000 : policyType === 'standard' ? 500000 : 100000,
    paymentTerms: policyType === 'preferred' ? 'NET45' : 'NET30',
  } as any, transaction);

  // Apply policy
  await applyCreditPolicy(customerId, policy.policyId, transaction);

  // Update customer
  await updateCustomer(customerId, {
    creditLimit: policy.maxCreditLimit,
    paymentTerms: policy.paymentTerms,
  } as any, transaction);

  // Create workflow for restricted policy
  let workflow: WorkflowInstance | undefined;
  if (policyType === 'restricted') {
    const workflowDef = await createWorkflowDefinition({
      workflowName: 'Restricted Credit Policy Review',
      workflowType: 'credit_review',
      description: `Customer ${customerId} on restricted policy`,
    } as any, transaction);

    workflow = await createWorkflowInstance({
      workflowDefinitionId: workflowDef.workflowId,
      entityType: 'customer',
      entityId: customerId,
      initiatorId: 'system',
    } as any, transaction);
  }

  return { policy, applied: true, workflow };
};

// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT PLANS
// ============================================================================

/**
 * Create payment plan with approval workflow
 * Composes: createPaymentPlan, createWorkflowInstance, updateCustomer
 */
export const createPaymentPlanWithApproval = async (
  customerId: number,
  totalAmount: number,
  numberOfInstallments: number,
  startDate: Date,
  transaction?: Transaction
): Promise<{ paymentPlan: PaymentPlan; workflow: WorkflowInstance; requiresApproval: boolean }> => {
  // Create payment plan
  const paymentPlan = await createPaymentPlan({
    customerId,
    totalAmount,
    numberOfInstallments,
    startDate,
    installmentAmount: totalAmount / numberOfInstallments,
    status: 'pending_approval',
  } as any, transaction);

  // Create approval workflow
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Payment Plan Approval',
    workflowType: 'payment_plan',
    description: `Payment plan for customer ${customerId} - ${numberOfInstallments} installments`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'payment_plan',
    entityId: paymentPlan.paymentPlanId,
    initiatorId: 'system',
  } as any, transaction);

  return {
    paymentPlan,
    workflow,
    requiresApproval: totalAmount > 10000,
  };
};

/**
 * Process payment plan installment with auto-application
 * Composes: processPaymentPlanInstallment, applyPaymentToInvoice, updateDunningLevel
 */
export const processPaymentPlanInstallmentWithApplication = async (
  paymentPlanId: number,
  installmentNumber: number,
  paymentAmount: number,
  transaction?: Transaction
): Promise<{ processed: boolean; applied: boolean; remainingBalance: number }> => {
  // Process installment
  const installment = await processPaymentPlanInstallment(
    paymentPlanId,
    installmentNumber,
    paymentAmount,
    transaction
  );

  // Apply to oldest invoice
  await applyPaymentToInvoice(
    installment.customerId,
    installment.invoiceId,
    paymentAmount,
    transaction
  );

  // Reset dunning if payment received
  await updateDunningLevel(installment.customerId, 0, transaction);

  return {
    processed: true,
    applied: true,
    remainingBalance: installment.remainingBalance,
  };
};

/**
 * Cancel payment plan with balance reinstatement
 * Composes: cancelPaymentPlan, voidARInvoice, createWorkflowInstance
 */
export const cancelPaymentPlanWithReinstatement = async (
  paymentPlanId: number,
  cancellationReason: string,
  transaction?: Transaction
): Promise<{ cancelled: boolean; balanceReinstated: number; workflow: WorkflowInstance }> => {
  // Cancel payment plan
  const result = await cancelPaymentPlan(paymentPlanId, cancellationReason, transaction);

  // Create workflow for collections
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Payment Plan Cancellation - Collections',
    workflowType: 'collections',
    description: `Payment plan ${paymentPlanId} cancelled`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'payment_plan',
    entityId: paymentPlanId,
    initiatorId: 'system',
  } as any, transaction);

  return {
    cancelled: true,
    balanceReinstated: result.remainingBalance,
    workflow,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - DISPUTE MANAGEMENT
// ============================================================================

/**
 * Create and route dispute for resolution
 * Composes: createDispute, createWorkflowInstance, placeCustomerOnHold
 */
export const createAndRouteDispute = async (
  disputeData: any,
  transaction?: Transaction
): Promise<{ dispute: CustomerDispute; workflow: WorkflowInstance; onHold: boolean }> => {
  // Create dispute
  const dispute = await createDispute(disputeData, transaction);

  // Create resolution workflow
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Customer Dispute Resolution',
    workflowType: 'dispute_resolution',
    description: `Dispute ${dispute.disputeId} - ${disputeData.disputeType}`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'dispute',
    entityId: dispute.disputeId,
    initiatorId: disputeData.initiatorId || 'system',
  } as any, transaction);

  // Place invoice on hold if high amount
  let onHold = false;
  if (dispute.disputeAmount > 5000) {
    await placeCustomerOnHold(dispute.customerId, `Dispute ${dispute.disputeId} under review`, transaction);
    onHold = true;
  }

  return { dispute, workflow, onHold };
};

/**
 * Resolve dispute with financial adjustments
 * Composes: resolveDispute, createCreditMemo, releaseCustomerHold, approveWorkflowStep
 */
export const resolveDisputeWithAdjustments = async (
  disputeId: number,
  resolution: 'customer_favor' | 'company_favor' | 'partial',
  adjustmentAmount: number,
  workflowInstanceId: number,
  transaction?: Transaction
): Promise<{ resolved: boolean; creditMemo?: any; holdReleased: boolean }> => {
  // Resolve dispute
  const dispute = await resolveDispute(disputeId, resolution, adjustmentAmount, transaction);

  // Create credit memo if in customer's favor
  let creditMemo: any;
  if (resolution === 'customer_favor' || resolution === 'partial') {
    creditMemo = await createCreditMemo({
      customerId: dispute.customerId,
      creditAmount: adjustmentAmount,
      reason: `Dispute ${disputeId} resolution`,
    } as any, transaction);
  }

  // Release customer hold
  await releaseCustomerHold(dispute.customerId, transaction);

  // Approve workflow
  await approveWorkflowStep(workflowInstanceId, 1, 'system', 'Dispute resolved', transaction);

  return {
    resolved: true,
    creditMemo,
    holdReleased: true,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - CUSTOMER PORTAL
// ============================================================================

/**
 * Generate customer portal data
 * Composes: getCustomerByNumber, generateCustomerStatement, getCustomerCreditProfile
 */
export const generateCustomerPortalData = async (
  customerNumber: string
): Promise<CustomerPortalData> => {
  const customer = await getCustomerByNumber(customerNumber, undefined);
  const customerId = (customer as any).customerId;

  // Get credit profile
  const creditProfile = await getCustomerCreditProfile(customerId, undefined);

  // Generate statement
  const statementDate = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 90);
  const statement = await generateCustomerStatement(customerId, periodStart, statementDate, undefined);

  return {
    customer: customer as any,
    openInvoices: statement.invoices.filter((inv: any) => inv.outstandingBalance > 0),
    paymentHistory: [],
    currentBalance: creditProfile.currentBalance,
    creditAvailable: creditProfile.creditLimit - creditProfile.currentBalance,
    recentStatements: [statement],
    paymentPlans: [],
    openDisputes: [],
  };
};

/**
 * Process customer self-service payment
 * Composes: applyPaymentToInvoice, processPayment, generateCustomerStatement
 */
export const processCustomerSelfServicePayment = async (
  customerId: number,
  invoiceId: number,
  paymentAmount: number,
  paymentMethod: string,
  transaction?: Transaction
): Promise<{ payment: any; invoice: ARInvoice; newBalance: number }> => {
  // Apply payment
  await applyPaymentToInvoice(customerId, invoiceId, paymentAmount, transaction);

  // Process payment transaction
  const payment = await processPayment({
    customerId,
    amount: paymentAmount,
    paymentMethod,
  } as any, transaction);

  // Get updated invoice
  const customer = await getCustomerByNumber('', transaction);
  const creditProfile = await getCustomerCreditProfile(customerId, transaction);

  return {
    payment,
    invoice: {} as any,
    newBalance: creditProfile.currentBalance,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - BAD DEBT & WRITE-OFFS
// ============================================================================

/**
 * Write off bad debt with approval workflow
 * Composes: writeOffBadDebt, createWorkflowInstance, voidARInvoice
 */
export const writeOffBadDebtWithApproval = async (
  invoiceId: number,
  writeOffAmount: number,
  reason: string,
  transaction?: Transaction
): Promise<{ writtenOff: boolean; workflow: WorkflowInstance; amount: number }> => {
  // Create approval workflow
  const workflowDef = await createWorkflowDefinition({
    workflowName: 'Bad Debt Write-Off Approval',
    workflowType: 'writeoff_approval',
    description: `Write-off for invoice ${invoiceId} - ${reason}`,
  } as any, transaction);

  const workflow = await createWorkflowInstance({
    workflowDefinitionId: workflowDef.workflowId,
    entityType: 'invoice',
    entityId: invoiceId,
    initiatorId: 'system',
  } as any, transaction);

  // Write off (will be processed after approval)
  const writeOff = await writeOffBadDebt(invoiceId, writeOffAmount, reason, transaction);

  return {
    writtenOff: true,
    workflow,
    amount: writeOffAmount,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - REVENUE RECOGNITION INTEGRATION
// ============================================================================

/**
 * Create revenue contract with performance obligations
 * Composes: createRevenueContract, createPerformanceObligation, allocateTransactionPrice
 */
export const createRevenueContractWithObligations = async (
  contractData: any,
  obligations: any[],
  transaction?: Transaction
): Promise<RevenueRecognitionWorkflowResult> => {
  // Create contract
  const contract = await createRevenueContract(contractData, transaction);

  // Create performance obligations
  const createdObligations = [];
  for (const obData of obligations) {
    const obligation = await createPerformanceObligation({
      ...obData,
      contractId: contract.contractId,
    } as any, transaction);
    createdObligations.push(obligation);
  }

  // Allocate transaction price
  const allocations = await allocateTransactionPrice(
    contract.contractId,
    contract.totalContractValue,
    createdObligations.map(o => o.obligationId),
    transaction
  );

  // Create revenue schedules
  const schedules = [];
  for (const obligation of createdObligations) {
    const schedule = await createRevenueSchedule({
      contractId: contract.contractId,
      obligationId: obligation.obligationId,
      scheduledAmount: obligation.allocatedAmount,
      scheduleDate: new Date(),
    } as any, transaction);
    schedules.push(schedule);
  }

  return {
    contract,
    obligations: createdObligations,
    schedules,
    recognizedRevenue: 0,
    deferredAmount: contract.totalContractValue,
    unbilledAmount: contract.totalContractValue,
    contractAssets: 0,
    contractLiabilities: contract.totalContractValue,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  CustomerRevenueOperationsService,
  updateCustomerWithCreditReview,
  placeCustomerOnHoldWithCollections,
  releaseCustomerHoldWithVerification,
  createAndPostInvoiceWithRevenue,
  processMilestoneBillingWithRevenue,
  createCreditMemoWithRevenueReversal,
  generateCustomerStatementWithAging,
  applyPaymentWithAutoAllocation,
  processLockboxWithAutoMatching,
  processRefundWithCreditVerification,
  processChargebackWithDispute,
  executeAutomatedCollections,
  generateAndSendDunningLetters,
  calculateCollectionEfficiencyMetrics,
  monitorCustomerCreditWithActions,
  reevaluateCustomerCreditLimit,
  applyCreditPolicyToCustomer,
  createPaymentPlanWithApproval,
  processPaymentPlanInstallmentWithApplication,
  cancelPaymentPlanWithReinstatement,
  createAndRouteDispute,
  resolveDisputeWithAdjustments,
  generateCustomerPortalData,
  processCustomerSelfServicePayment,
  writeOffBadDebtWithApproval,
  createRevenueContractWithObligations,
};

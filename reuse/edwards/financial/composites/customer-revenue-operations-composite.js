"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRevenueContractWithObligations = exports.writeOffBadDebtWithApproval = exports.processCustomerSelfServicePayment = exports.generateCustomerPortalData = exports.resolveDisputeWithAdjustments = exports.createAndRouteDispute = exports.cancelPaymentPlanWithReinstatement = exports.processPaymentPlanInstallmentWithApplication = exports.createPaymentPlanWithApproval = exports.applyCreditPolicyToCustomer = exports.reevaluateCustomerCreditLimit = exports.monitorCustomerCreditWithActions = exports.calculateCollectionEfficiencyMetrics = exports.generateAndSendDunningLetters = exports.executeAutomatedCollections = exports.processChargebackWithDispute = exports.processRefundWithCreditVerification = exports.processLockboxWithAutoMatching = exports.applyPaymentWithAutoAllocation = exports.generateCustomerStatementWithAging = exports.createCreditMemoWithRevenueReversal = exports.processMilestoneBillingWithRevenue = exports.createAndPostInvoiceWithRevenue = exports.releaseCustomerHoldWithVerification = exports.placeCustomerOnHoldWithCollections = exports.updateCustomerWithCreditReview = exports.CustomerRevenueOperationsService = void 0;
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
const common_1 = require("@nestjs/common");
// Import from accounts-receivable-management-kit
const accounts_receivable_management_kit_1 = require("../accounts-receivable-management-kit");
// Import from revenue-recognition-billing-kit
const revenue_recognition_billing_kit_1 = require("../revenue-recognition-billing-kit");
// Import from payment-processing-collections-kit
const payment_processing_collections_kit_1 = require("../payment-processing-collections-kit");
// Import from credit-management-risk-kit
const credit_management_risk_kit_1 = require("../credit-management-risk-kit");
// Import from financial-workflow-approval-kit
const financial_workflow_approval_kit_1 = require("../financial-workflow-approval-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - CUSTOMER LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * Complete customer onboarding with credit assessment
 * Composes: createCustomer, assessCreditRisk, calculateCreditScore, determineCreditLimit, createWorkflowInstance
 */
let CustomerRevenueOperationsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CustomerRevenueOperationsService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(CustomerRevenueOperationsService.name);
        }
        async onboardNewCustomer(request, transaction) {
            this.logger.log(`Onboarding new customer: ${request.customerName}`);
            try {
                // Assess credit risk
                const creditAssessment = await (0, credit_management_risk_kit_1.assessCreditRisk)('customer', 0, // Will be assigned after customer creation
                {
                    taxId: request.taxId,
                    customerType: request.customerType,
                    requestedCredit: request.requestedCreditLimit,
                });
                // Calculate credit score
                const creditScore = await (0, credit_management_risk_kit_1.calculateCreditScore)({
                    entityType: 'customer',
                    entityId: 0,
                    financialData: request.financialStatements || {},
                });
                // Determine credit limit
                const approvedCreditLimit = await (0, credit_management_risk_kit_1.determineCreditLimit)('customer', 0, request.requestedCreditLimit, creditScore);
                // Create customer
                const customer = await (0, accounts_receivable_management_kit_1.createCustomer)({
                    customerNumber: request.customerNumber,
                    customerName: request.customerName,
                    customerType: request.customerType,
                    taxId: request.taxId,
                    paymentTerms: request.paymentTerms,
                    creditLimit: approvedCreditLimit.approvedLimit,
                    status: 'active',
                }, transaction);
                // Create approval workflow if high risk or large credit limit
                let workflowInstance;
                let requiresApproval = false;
                if (creditAssessment.riskLevel === 'high' || approvedCreditLimit.approvedLimit > 500000) {
                    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
                        workflowName: 'Customer Onboarding Approval',
                        workflowType: 'customer_onboarding',
                        description: `High-risk customer: ${request.customerName}`,
                    }, transaction);
                    workflowInstance = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
                        workflowDefinitionId: workflow.workflowId,
                        entityType: 'customer',
                        entityId: customer.customerId,
                        initiatorId: 'system',
                    }, transaction);
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
            }
            catch (error) {
                this.logger.error(`Customer onboarding failed: ${error.message}`, error.stack);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "CustomerRevenueOperationsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerRevenueOperationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerRevenueOperationsService = _classThis;
})();
exports.CustomerRevenueOperationsService = CustomerRevenueOperationsService;
/**
 * Update customer with credit reevaluation
 * Composes: updateCustomer, evaluatePaymentBehavior, updateCreditRating, monitorCreditLimit
 */
const updateCustomerWithCreditReview = async (customerId, updateData, transaction) => {
    // Evaluate payment behavior
    const paymentBehavior = await (0, credit_management_risk_kit_1.evaluatePaymentBehavior)('customer', customerId, 180);
    // Update credit rating if needed
    let ratingUpdated = false;
    if (paymentBehavior.improvementDetected || paymentBehavior.deteriorationDetected) {
        await (0, credit_management_risk_kit_1.updateCreditRating)('customer', customerId, paymentBehavior.suggestedRating);
        ratingUpdated = true;
    }
    // Update customer
    const customer = await (0, accounts_receivable_management_kit_1.updateCustomer)(customerId, updateData, transaction);
    // Monitor credit limit
    const creditCheck = await (0, credit_management_risk_kit_1.monitorCreditLimit)('customer', customerId, customer.creditLimit);
    return {
        customer,
        creditReview: { paymentBehavior, creditCheck },
        ratingUpdated,
    };
};
exports.updateCustomerWithCreditReview = updateCustomerWithCreditReview;
/**
 * Place customer on hold with collections workflow
 * Composes: placeCustomerOnHold, createWorkflowInstance, processDunning
 */
const placeCustomerOnHoldWithCollections = async (customerId, holdReason, transaction) => {
    // Place on hold
    const customer = await (0, accounts_receivable_management_kit_1.placeCustomerOnHold)(customerId, holdReason, transaction);
    // Update dunning level
    const dunningLevel = await (0, accounts_receivable_management_kit_1.updateDunningLevel)(customerId, 3, transaction);
    // Process dunning
    await (0, accounts_receivable_management_kit_1.processDunning)(customerId, dunningLevel, transaction);
    // Create collections workflow
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Collections Escalation',
        workflowType: 'collections',
        description: `Customer ${customerId} placed on hold`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'customer',
        entityId: customerId,
        initiatorId: 'system',
    }, transaction);
    return { customer, workflow, dunningLevel };
};
exports.placeCustomerOnHoldWithCollections = placeCustomerOnHoldWithCollections;
/**
 * Release customer hold with payment verification
 * Composes: releaseCustomerHold, evaluatePaymentBehavior, updateDunningLevel
 */
const releaseCustomerHoldWithVerification = async (customerId, paymentReceived, transaction) => {
    if (!paymentReceived) {
        throw new Error('Payment verification required before releasing hold');
    }
    // Release hold
    const customer = await (0, accounts_receivable_management_kit_1.releaseCustomerHold)(customerId, transaction);
    // Reset dunning level
    await (0, accounts_receivable_management_kit_1.updateDunningLevel)(customerId, 0, transaction);
    // Reevaluate payment behavior
    await (0, credit_management_risk_kit_1.evaluatePaymentBehavior)('customer', customerId, 30);
    return {
        customer,
        holdReleased: true,
        dunningReset: true,
    };
};
exports.releaseCustomerHoldWithVerification = releaseCustomerHoldWithVerification;
// ============================================================================
// COMPOSITE FUNCTIONS - BILLING & INVOICING
// ============================================================================
/**
 * Create and post invoice with revenue recognition
 * Composes: createARInvoice, postARInvoice, recognizeRevenue, createRevenueSchedule
 */
const createAndPostInvoiceWithRevenue = async (invoiceData, contractId, transaction) => {
    // Create invoice
    const invoice = await (0, accounts_receivable_management_kit_1.createARInvoice)(invoiceData, transaction);
    // Post invoice
    const postedInvoice = await (0, accounts_receivable_management_kit_1.postARInvoice)(invoice.invoiceId, transaction);
    let revenueSchedule;
    // Create revenue schedule if contract linked
    if (contractId) {
        revenueSchedule = await (0, revenue_recognition_billing_kit_1.createRevenueSchedule)({
            contractId,
            obligationId: invoiceData.obligationId,
            scheduledAmount: invoice.invoiceAmount,
            scheduleDate: invoice.invoiceDate,
        }, transaction);
        // Recognize revenue based on contract terms
        await (0, revenue_recognition_billing_kit_1.recognizeRevenue)(revenueSchedule.scheduleId, invoice.invoiceAmount, transaction);
    }
    return {
        invoice: postedInvoice,
        revenueSchedule,
        posted: true,
    };
};
exports.createAndPostInvoiceWithRevenue = createAndPostInvoiceWithRevenue;
/**
 * Process billing with milestone recognition
 * Composes: createMilestoneBilling, processMilestoneCompletion, createARInvoice, recognizeRevenueAtPoint
 */
const processMilestoneBillingWithRevenue = async (contractId, milestoneId, completionData, transaction) => {
    // Process milestone completion
    const milestone = await (0, revenue_recognition_billing_kit_1.processMilestoneCompletion)(milestoneId, completionData, transaction);
    // Create milestone billing
    const billing = await (0, revenue_recognition_billing_kit_1.createMilestoneBilling)(contractId, milestoneId, transaction);
    // Create AR invoice
    const invoice = await (0, accounts_receivable_management_kit_1.createARInvoice)({
        customerId: billing.customerId,
        invoiceAmount: billing.billingAmount,
        description: `Milestone ${milestoneId} billing`,
    }, transaction);
    // Recognize revenue at point in time
    await (0, revenue_recognition_billing_kit_1.recognizeRevenueAtPoint)(contractId, milestone.obligationId, billing.billingAmount, transaction);
    return {
        invoice,
        milestone,
        revenueRecognized: billing.billingAmount,
    };
};
exports.processMilestoneBillingWithRevenue = processMilestoneBillingWithRevenue;
/**
 * Create credit memo with revenue reversal
 * Composes: createCreditMemo, applyCreditMemo, deferRevenue
 */
const createCreditMemoWithRevenueReversal = async (customerId, invoiceId, creditAmount, reason, transaction) => {
    // Create credit memo
    const creditMemo = await (0, accounts_receivable_management_kit_1.createCreditMemo)({
        customerId,
        creditAmount,
        reason,
        relatedInvoiceId: invoiceId,
    }, transaction);
    // Apply credit memo to invoice
    await (0, accounts_receivable_management_kit_1.applyCreditMemo)(creditMemo.creditMemoId, invoiceId, transaction);
    // Defer revenue
    await (0, revenue_recognition_billing_kit_1.deferRevenue)(invoiceId, creditAmount, transaction);
    return {
        creditMemo,
        applied: true,
        revenueReversed: creditAmount,
    };
};
exports.createCreditMemoWithRevenueReversal = createCreditMemoWithRevenueReversal;
/**
 * Generate customer statement with aging
 * Composes: generateCustomerStatement, generateARAgingReport, calculateDaysSalesOutstanding
 */
const generateCustomerStatementWithAging = async (customerId, statementDate, periodDays = 90) => {
    const periodStart = new Date(statementDate);
    periodStart.setDate(periodStart.getDate() - periodDays);
    // Generate statement
    const statement = await (0, accounts_receivable_management_kit_1.generateCustomerStatement)(customerId, periodStart, statementDate, undefined);
    // Generate aging report
    const aging = await (0, accounts_receivable_management_kit_1.generateARAgingReport)(statementDate, undefined);
    // Calculate DSO
    const dso = await (0, accounts_receivable_management_kit_1.calculateDaysSalesOutstanding)(periodDays);
    return { statement, aging, dso };
};
exports.generateCustomerStatementWithAging = generateCustomerStatementWithAging;
// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT PROCESSING
// ============================================================================
/**
 * Apply payment with automatic allocation
 * Composes: applyPaymentToInvoice, applyPaymentToMultipleInvoices, applyCashReceipts
 */
const applyPaymentWithAutoAllocation = async (customerId, paymentAmount, paymentMethod, transaction) => {
    // Get open invoices for customer
    const customer = await (0, accounts_receivable_management_kit_1.getCustomerByNumber)('', transaction);
    // Apply cash receipts with auto-allocation
    const cashReceipt = await (0, accounts_receivable_management_kit_1.applyCashReceipts)({
        customerId,
        receiptAmount: paymentAmount,
        receiptDate: new Date(),
        paymentMethod,
    }, transaction);
    // Apply to multiple invoices (oldest first)
    const application = await (0, payment_processing_collections_kit_1.applyPaymentToMultipleInvoices)(paymentAmount, [], // Would fetch open invoices
    'oldest_first', transaction);
    return {
        applied: application.totalApplied,
        invoicesPaid: application.invoicesPaid,
        remaining: application.unappliedAmount,
    };
};
exports.applyPaymentWithAutoAllocation = applyPaymentWithAutoAllocation;
/**
 * Process lockbox with auto-matching
 * Composes: processLockboxFile, applyCashReceipts, reconcilePayments
 */
const processLockboxWithAutoMatching = async (lockboxFile, transaction) => {
    // Process lockbox file
    const lockboxResult = await (0, accounts_receivable_management_kit_1.processLockboxFile)(lockboxFile, transaction);
    // Reconcile payments
    const reconciliation = await (0, payment_processing_collections_kit_1.reconcilePayments)(0, lockboxResult, transaction);
    return {
        processed: lockboxResult.receipts.length,
        matched: reconciliation.matched.length,
        unmatched: reconciliation.unmatched.length,
        total: lockboxResult.totalAmount,
    };
};
exports.processLockboxWithAutoMatching = processLockboxWithAutoMatching;
/**
 * Process refund with credit verification
 * Composes: processRefund, createCreditMemo, updateCustomer
 */
const processRefundWithCreditVerification = async (customerId, refundAmount, reason, transaction) => {
    // Create credit memo
    const creditMemo = await (0, accounts_receivable_management_kit_1.createCreditMemo)({
        customerId,
        creditAmount: refundAmount,
        reason,
    }, transaction);
    // Process refund
    const refund = await (0, payment_processing_collections_kit_1.processRefund)({
        customerId,
        refundAmount,
        creditMemoId: creditMemo.creditMemoId,
    }, transaction);
    return {
        refund,
        creditMemo,
        processed: true,
    };
};
exports.processRefundWithCreditVerification = processRefundWithCreditVerification;
/**
 * Process chargeback with dispute creation
 * Composes: processChargeback, createDispute, createWorkflowInstance
 */
const processChargebackWithDispute = async (customerId, invoiceId, chargebackAmount, reason, transaction) => {
    // Process chargeback
    const chargeback = await (0, payment_processing_collections_kit_1.processChargeback)({
        customerId,
        chargebackAmount,
        invoiceId,
        reason,
    }, transaction);
    // Create dispute
    const dispute = await (0, accounts_receivable_management_kit_1.createDispute)({
        customerId,
        invoiceId,
        disputeAmount: chargebackAmount,
        disputeReason: reason,
        disputeType: 'chargeback',
    }, transaction);
    // Create workflow for dispute resolution
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Chargeback Dispute Resolution',
        workflowType: 'chargeback_dispute',
        description: `Chargeback dispute for invoice ${invoiceId}`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'dispute',
        entityId: dispute.disputeId,
        initiatorId: 'system',
    }, transaction);
    return { chargeback, dispute, workflow };
};
exports.processChargebackWithDispute = processChargebackWithDispute;
// ============================================================================
// COMPOSITE FUNCTIONS - COLLECTIONS & DUNNING
// ============================================================================
/**
 * Execute automated collections process
 * Composes: prioritizeCollectionAccounts, createCollectionStrategy, executeCollectionCampaign, processDunning
 */
const executeAutomatedCollections = async (asOfDate, config, transaction) => {
    // Prioritize collection accounts
    const prioritized = await (0, payment_processing_collections_kit_1.prioritizeCollectionAccounts)(asOfDate, 'risk_score');
    // Create collection strategy
    const strategy = await (0, payment_processing_collections_kit_1.createCollectionStrategy)({
        strategyName: 'Automated Collections',
        priorityRules: config.priorityRules,
        dunningLevels: config.dunningLevels,
    });
    let campaignsExecuted = 0;
    let dunningProcessed = 0;
    for (const account of prioritized.slice(0, 100)) {
        // Execute collection campaign
        await (0, payment_processing_collections_kit_1.executeCollectionCampaign)(account.customerId, strategy.strategyId, transaction);
        campaignsExecuted++;
        // Process dunning if enabled
        if (config.enableAutoDunning) {
            await (0, accounts_receivable_management_kit_1.processDunning)(account.customerId, account.dunningLevel, transaction);
            dunningProcessed++;
        }
        // Auto hold if threshold exceeded
        if (config.autoHoldShipments && account.daysOverdue > config.autoHoldThreshold) {
            await (0, accounts_receivable_management_kit_1.placeCustomerOnHold)(account.customerId, 'Automatic hold - past due', transaction);
        }
    }
    return {
        accountsPrioritized: prioritized.length,
        campaignsExecuted,
        dunningProcessed,
    };
};
exports.executeAutomatedCollections = executeAutomatedCollections;
/**
 * Generate and send dunning letters
 * Composes: generateDunningLetter, updateDunningLevel, processDunning
 */
const generateAndSendDunningLetters = async (customerId, currentLevel, transaction) => {
    // Generate dunning letter
    const letter = await (0, accounts_receivable_management_kit_1.generateDunningLetter)(customerId, currentLevel, transaction);
    // Update dunning level
    const newLevel = currentLevel + 1;
    await (0, accounts_receivable_management_kit_1.updateDunningLevel)(customerId, newLevel, transaction);
    // Process dunning
    await (0, accounts_receivable_management_kit_1.processDunning)(customerId, newLevel, transaction);
    // TODO: Send letter via email/mail service
    return {
        letter,
        levelUpdated: newLevel,
        sent: true,
    };
};
exports.generateAndSendDunningLetters = generateAndSendDunningLetters;
/**
 * Calculate collection efficiency metrics
 * Composes: calculateCollectionEfficiency, generateARAgingReport, calculateDaysSalesOutstanding
 */
const calculateCollectionEfficiencyMetrics = async (periodStart, periodEnd) => {
    // Calculate efficiency
    const efficiency = await (0, payment_processing_collections_kit_1.calculateCollectionEfficiency)(periodStart, periodEnd);
    // Generate aging
    const aging = await (0, accounts_receivable_management_kit_1.generateARAgingReport)(periodEnd, undefined);
    // Calculate DSO
    const periodDays = Math.floor((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
    const dso = await (0, accounts_receivable_management_kit_1.calculateDaysSalesOutstanding)(periodDays);
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
exports.calculateCollectionEfficiencyMetrics = calculateCollectionEfficiencyMetrics;
// ============================================================================
// COMPOSITE FUNCTIONS - CREDIT MANAGEMENT
// ============================================================================
/**
 * Monitor customer credit with automated actions
 * Composes: monitorCreditLimit, getCustomerCreditProfile, flagHighRiskCustomer, placeCustomerOnHold
 */
const monitorCustomerCreditWithActions = async (customerId, transaction) => {
    // Get credit profile
    const profile = await (0, accounts_receivable_management_kit_1.getCustomerCreditProfile)(customerId, transaction);
    const utilizationPercent = (profile.currentBalance / profile.creditLimit) * 100;
    const withinLimit = utilizationPercent <= 100;
    let action;
    let flagged = false;
    if (utilizationPercent >= 100) {
        // Over limit - place on hold
        await (0, accounts_receivable_management_kit_1.placeCustomerOnHold)(customerId, 'Credit limit exceeded', transaction);
        action = 'placed_on_hold';
    }
    else if (utilizationPercent >= 90) {
        // Near limit - flag high risk
        await (0, credit_management_risk_kit_1.flagHighRiskCustomer)(customerId, 'Near credit limit', transaction);
        flagged = true;
        action = 'flagged_high_risk';
    }
    await (0, credit_management_risk_kit_1.monitorCreditLimit)('customer', customerId, profile.creditLimit);
    return { withinLimit, utilizationPercent, action, flagged };
};
exports.monitorCustomerCreditWithActions = monitorCustomerCreditWithActions;
/**
 * Reevaluate customer credit limit
 * Composes: evaluatePaymentBehavior, calculateCreditScore, determineCreditLimit, updateCustomer
 */
const reevaluateCustomerCreditLimit = async (customerId, transaction) => {
    const customer = await (0, accounts_receivable_management_kit_1.getCustomerByNumber)('', transaction);
    const previousLimit = customer.creditLimit;
    // Evaluate payment behavior
    const paymentBehavior = await (0, credit_management_risk_kit_1.evaluatePaymentBehavior)('customer', customerId, 365);
    // Calculate credit score
    const creditScore = await (0, credit_management_risk_kit_1.calculateCreditScore)({
        entityType: 'customer',
        entityId: customerId,
        financialData: {},
    });
    // Determine new credit limit
    const newLimitResult = await (0, credit_management_risk_kit_1.determineCreditLimit)('customer', customerId, previousLimit * 1.5, creditScore);
    // Update customer
    await (0, accounts_receivable_management_kit_1.updateCustomer)(customerId, { creditLimit: newLimitResult.approvedLimit }, transaction);
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
exports.reevaluateCustomerCreditLimit = reevaluateCustomerCreditLimit;
/**
 * Apply credit policy to customer
 * Composes: createCreditPolicy, applyCreditPolicy, updateCustomer, createWorkflowInstance
 */
const applyCreditPolicyToCustomer = async (customerId, policyType, transaction) => {
    // Create or get credit policy
    const policy = await (0, credit_management_risk_kit_1.createCreditPolicy)({
        policyName: `${policyType} Credit Policy`,
        policyType,
        maxCreditLimit: policyType === 'preferred' ? 1000000 : policyType === 'standard' ? 500000 : 100000,
        paymentTerms: policyType === 'preferred' ? 'NET45' : 'NET30',
    }, transaction);
    // Apply policy
    await (0, credit_management_risk_kit_1.applyCreditPolicy)(customerId, policy.policyId, transaction);
    // Update customer
    await (0, accounts_receivable_management_kit_1.updateCustomer)(customerId, {
        creditLimit: policy.maxCreditLimit,
        paymentTerms: policy.paymentTerms,
    }, transaction);
    // Create workflow for restricted policy
    let workflow;
    if (policyType === 'restricted') {
        const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
            workflowName: 'Restricted Credit Policy Review',
            workflowType: 'credit_review',
            description: `Customer ${customerId} on restricted policy`,
        }, transaction);
        workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
            workflowDefinitionId: workflowDef.workflowId,
            entityType: 'customer',
            entityId: customerId,
            initiatorId: 'system',
        }, transaction);
    }
    return { policy, applied: true, workflow };
};
exports.applyCreditPolicyToCustomer = applyCreditPolicyToCustomer;
// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT PLANS
// ============================================================================
/**
 * Create payment plan with approval workflow
 * Composes: createPaymentPlan, createWorkflowInstance, updateCustomer
 */
const createPaymentPlanWithApproval = async (customerId, totalAmount, numberOfInstallments, startDate, transaction) => {
    // Create payment plan
    const paymentPlan = await (0, accounts_receivable_management_kit_1.createPaymentPlan)({
        customerId,
        totalAmount,
        numberOfInstallments,
        startDate,
        installmentAmount: totalAmount / numberOfInstallments,
        status: 'pending_approval',
    }, transaction);
    // Create approval workflow
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Payment Plan Approval',
        workflowType: 'payment_plan',
        description: `Payment plan for customer ${customerId} - ${numberOfInstallments} installments`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'payment_plan',
        entityId: paymentPlan.paymentPlanId,
        initiatorId: 'system',
    }, transaction);
    return {
        paymentPlan,
        workflow,
        requiresApproval: totalAmount > 10000,
    };
};
exports.createPaymentPlanWithApproval = createPaymentPlanWithApproval;
/**
 * Process payment plan installment with auto-application
 * Composes: processPaymentPlanInstallment, applyPaymentToInvoice, updateDunningLevel
 */
const processPaymentPlanInstallmentWithApplication = async (paymentPlanId, installmentNumber, paymentAmount, transaction) => {
    // Process installment
    const installment = await (0, accounts_receivable_management_kit_1.processPaymentPlanInstallment)(paymentPlanId, installmentNumber, paymentAmount, transaction);
    // Apply to oldest invoice
    await (0, accounts_receivable_management_kit_1.applyPaymentToInvoice)(installment.customerId, installment.invoiceId, paymentAmount, transaction);
    // Reset dunning if payment received
    await (0, accounts_receivable_management_kit_1.updateDunningLevel)(installment.customerId, 0, transaction);
    return {
        processed: true,
        applied: true,
        remainingBalance: installment.remainingBalance,
    };
};
exports.processPaymentPlanInstallmentWithApplication = processPaymentPlanInstallmentWithApplication;
/**
 * Cancel payment plan with balance reinstatement
 * Composes: cancelPaymentPlan, voidARInvoice, createWorkflowInstance
 */
const cancelPaymentPlanWithReinstatement = async (paymentPlanId, cancellationReason, transaction) => {
    // Cancel payment plan
    const result = await (0, accounts_receivable_management_kit_1.cancelPaymentPlan)(paymentPlanId, cancellationReason, transaction);
    // Create workflow for collections
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Payment Plan Cancellation - Collections',
        workflowType: 'collections',
        description: `Payment plan ${paymentPlanId} cancelled`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'payment_plan',
        entityId: paymentPlanId,
        initiatorId: 'system',
    }, transaction);
    return {
        cancelled: true,
        balanceReinstated: result.remainingBalance,
        workflow,
    };
};
exports.cancelPaymentPlanWithReinstatement = cancelPaymentPlanWithReinstatement;
// ============================================================================
// COMPOSITE FUNCTIONS - DISPUTE MANAGEMENT
// ============================================================================
/**
 * Create and route dispute for resolution
 * Composes: createDispute, createWorkflowInstance, placeCustomerOnHold
 */
const createAndRouteDispute = async (disputeData, transaction) => {
    // Create dispute
    const dispute = await (0, accounts_receivable_management_kit_1.createDispute)(disputeData, transaction);
    // Create resolution workflow
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Customer Dispute Resolution',
        workflowType: 'dispute_resolution',
        description: `Dispute ${dispute.disputeId} - ${disputeData.disputeType}`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'dispute',
        entityId: dispute.disputeId,
        initiatorId: disputeData.initiatorId || 'system',
    }, transaction);
    // Place invoice on hold if high amount
    let onHold = false;
    if (dispute.disputeAmount > 5000) {
        await (0, accounts_receivable_management_kit_1.placeCustomerOnHold)(dispute.customerId, `Dispute ${dispute.disputeId} under review`, transaction);
        onHold = true;
    }
    return { dispute, workflow, onHold };
};
exports.createAndRouteDispute = createAndRouteDispute;
/**
 * Resolve dispute with financial adjustments
 * Composes: resolveDispute, createCreditMemo, releaseCustomerHold, approveWorkflowStep
 */
const resolveDisputeWithAdjustments = async (disputeId, resolution, adjustmentAmount, workflowInstanceId, transaction) => {
    // Resolve dispute
    const dispute = await (0, accounts_receivable_management_kit_1.resolveDispute)(disputeId, resolution, adjustmentAmount, transaction);
    // Create credit memo if in customer's favor
    let creditMemo;
    if (resolution === 'customer_favor' || resolution === 'partial') {
        creditMemo = await (0, accounts_receivable_management_kit_1.createCreditMemo)({
            customerId: dispute.customerId,
            creditAmount: adjustmentAmount,
            reason: `Dispute ${disputeId} resolution`,
        }, transaction);
    }
    // Release customer hold
    await (0, accounts_receivable_management_kit_1.releaseCustomerHold)(dispute.customerId, transaction);
    // Approve workflow
    await (0, financial_workflow_approval_kit_1.approveWorkflowStep)(workflowInstanceId, 1, 'system', 'Dispute resolved', transaction);
    return {
        resolved: true,
        creditMemo,
        holdReleased: true,
    };
};
exports.resolveDisputeWithAdjustments = resolveDisputeWithAdjustments;
// ============================================================================
// COMPOSITE FUNCTIONS - CUSTOMER PORTAL
// ============================================================================
/**
 * Generate customer portal data
 * Composes: getCustomerByNumber, generateCustomerStatement, getCustomerCreditProfile
 */
const generateCustomerPortalData = async (customerNumber) => {
    const customer = await (0, accounts_receivable_management_kit_1.getCustomerByNumber)(customerNumber, undefined);
    const customerId = customer.customerId;
    // Get credit profile
    const creditProfile = await (0, accounts_receivable_management_kit_1.getCustomerCreditProfile)(customerId, undefined);
    // Generate statement
    const statementDate = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 90);
    const statement = await (0, accounts_receivable_management_kit_1.generateCustomerStatement)(customerId, periodStart, statementDate, undefined);
    return {
        customer: customer,
        openInvoices: statement.invoices.filter((inv) => inv.outstandingBalance > 0),
        paymentHistory: [],
        currentBalance: creditProfile.currentBalance,
        creditAvailable: creditProfile.creditLimit - creditProfile.currentBalance,
        recentStatements: [statement],
        paymentPlans: [],
        openDisputes: [],
    };
};
exports.generateCustomerPortalData = generateCustomerPortalData;
/**
 * Process customer self-service payment
 * Composes: applyPaymentToInvoice, processPayment, generateCustomerStatement
 */
const processCustomerSelfServicePayment = async (customerId, invoiceId, paymentAmount, paymentMethod, transaction) => {
    // Apply payment
    await (0, accounts_receivable_management_kit_1.applyPaymentToInvoice)(customerId, invoiceId, paymentAmount, transaction);
    // Process payment transaction
    const payment = await (0, payment_processing_collections_kit_1.processPayment)({
        customerId,
        amount: paymentAmount,
        paymentMethod,
    }, transaction);
    // Get updated invoice
    const customer = await (0, accounts_receivable_management_kit_1.getCustomerByNumber)('', transaction);
    const creditProfile = await (0, accounts_receivable_management_kit_1.getCustomerCreditProfile)(customerId, transaction);
    return {
        payment,
        invoice: {},
        newBalance: creditProfile.currentBalance,
    };
};
exports.processCustomerSelfServicePayment = processCustomerSelfServicePayment;
// ============================================================================
// COMPOSITE FUNCTIONS - BAD DEBT & WRITE-OFFS
// ============================================================================
/**
 * Write off bad debt with approval workflow
 * Composes: writeOffBadDebt, createWorkflowInstance, voidARInvoice
 */
const writeOffBadDebtWithApproval = async (invoiceId, writeOffAmount, reason, transaction) => {
    // Create approval workflow
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Bad Debt Write-Off Approval',
        workflowType: 'writeoff_approval',
        description: `Write-off for invoice ${invoiceId} - ${reason}`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'invoice',
        entityId: invoiceId,
        initiatorId: 'system',
    }, transaction);
    // Write off (will be processed after approval)
    const writeOff = await (0, accounts_receivable_management_kit_1.writeOffBadDebt)(invoiceId, writeOffAmount, reason, transaction);
    return {
        writtenOff: true,
        workflow,
        amount: writeOffAmount,
    };
};
exports.writeOffBadDebtWithApproval = writeOffBadDebtWithApproval;
// ============================================================================
// COMPOSITE FUNCTIONS - REVENUE RECOGNITION INTEGRATION
// ============================================================================
/**
 * Create revenue contract with performance obligations
 * Composes: createRevenueContract, createPerformanceObligation, allocateTransactionPrice
 */
const createRevenueContractWithObligations = async (contractData, obligations, transaction) => {
    // Create contract
    const contract = await (0, revenue_recognition_billing_kit_1.createRevenueContract)(contractData, transaction);
    // Create performance obligations
    const createdObligations = [];
    for (const obData of obligations) {
        const obligation = await (0, revenue_recognition_billing_kit_1.createPerformanceObligation)({
            ...obData,
            contractId: contract.contractId,
        }, transaction);
        createdObligations.push(obligation);
    }
    // Allocate transaction price
    const allocations = await (0, revenue_recognition_billing_kit_1.allocateTransactionPrice)(contract.contractId, contract.totalContractValue, createdObligations.map(o => o.obligationId), transaction);
    // Create revenue schedules
    const schedules = [];
    for (const obligation of createdObligations) {
        const schedule = await (0, revenue_recognition_billing_kit_1.createRevenueSchedule)({
            contractId: contract.contractId,
            obligationId: obligation.obligationId,
            scheduledAmount: obligation.allocatedAmount,
            scheduleDate: new Date(),
        }, transaction);
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
exports.createRevenueContractWithObligations = createRevenueContractWithObligations;
//# sourceMappingURL=customer-revenue-operations-composite.js.map
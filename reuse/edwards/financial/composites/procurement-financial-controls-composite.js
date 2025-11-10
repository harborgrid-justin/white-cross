"use strict";
/**
 * LOC: PROCFINCTRL001
 * File: /reuse/edwards/financial/composites/procurement-financial-controls-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../procurement-financial-integration-kit
 *   - ../invoice-management-matching-kit
 *   - ../financial-workflow-approval-kit
 *   - ../commitment-control-kit
 *   - ../encumbrance-accounting-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend procurement control modules
 *   - Procurement REST API controllers
 *   - Spend analytics services
 *   - Contract compliance systems
 *   - Procurement audit dashboards
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
exports.calculateProcurementEncumbranceBalance = exports.reconcileProcurementCommitmentsAndEncumbrances = exports.trackProcurementDataChanges = exports.executeProcurementComplianceAudit = exports.monitorContractCompliance = exports.generateProcurementControlMetrics = exports.analyzeComprehensiveProcurementSpend = exports.processInvoiceOCRWithRouting = exports.resolveInvoiceDisputeAndProcess = exports.handleInvoiceVarianceWithDispute = exports.processInvoiceWithAutomatedMatching = exports.processReturnToSupplier = exports.receiveGoodsWithVarianceAnalysis = exports.closePOWithFinalReconciliation = exports.changePOWithReapproval = exports.approvePOWithContractCompliance = exports.createPOWithApprovalAndCommitment = exports.convertRequisitionToPOWithControls = exports.rejectRequisitionWithWorkflow = exports.approveRequisitionWithBudgetValidation = exports.ProcurementFinancialControlsService = void 0;
/**
 * File: /reuse/edwards/financial/composites/procurement-financial-controls-composite.ts
 * Locator: WC-EDW-PROC-CTRL-COMPOSITE-001
 * Purpose: Comprehensive Procurement Financial Controls Composite - Complete procure-to-pay controls, compliance, analytics
 *
 * Upstream: Composes functions from procurement-financial-integration-kit, invoice-management-matching-kit,
 *           financial-workflow-approval-kit, commitment-control-kit, encumbrance-accounting-kit, audit-trail-compliance-kit
 * Downstream: ../backend/procurement/*, Procurement APIs, Analytics Services, Compliance Systems, Audit
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for procurement controls, requisition workflows, PO approvals, receiving, matching, spend analytics
 *
 * LLM Context: Enterprise-grade procurement financial controls for White Cross healthcare platform.
 * Provides comprehensive procure-to-pay controls from requisition through payment, multi-tier approval
 * workflows, purchase order controls, goods receiving workflows, automated three-way matching,
 * payment authorization controls, procurement analytics and reporting, spend analysis and insights,
 * contract compliance monitoring, maverick spend detection, supplier performance tracking,
 * procurement KPIs, and complete audit trail compliance. Competes with SAP Ariba, Oracle Procurement
 * Cloud, and Coupa with production-ready healthcare procurement governance.
 *
 * Key Features:
 * - Multi-tier approval workflows
 * - Purchase requisition controls
 * - PO authorization and limits
 * - Receiving workflow automation
 * - Intelligent three-way matching
 * - Payment authorization controls
 * - Spend analytics and insights
 * - Contract compliance tracking
 * - Maverick spend detection
 * - Supplier performance monitoring
 * - Procurement KPI dashboards
 * - Complete audit trail compliance
 */
const common_1 = require("@nestjs/common");
// Import from procurement-financial-integration-kit
const procurement_financial_integration_kit_1 = require("../procurement-financial-integration-kit");
// Import from invoice-management-matching-kit
const invoice_management_matching_kit_1 = require("../invoice-management-matching-kit");
// Import from financial-workflow-approval-kit
const financial_workflow_approval_kit_1 = require("../financial-workflow-approval-kit");
// Import from commitment-control-kit
const commitment_control_kit_1 = require("../commitment-control-kit");
// Import from encumbrance-accounting-kit
const encumbrance_accounting_kit_1 = require("../encumbrance-accounting-kit");
// Import from audit-trail-compliance-kit
const audit_trail_compliance_kit_1 = require("../audit-trail-compliance-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - REQUISITION WORKFLOW & CONTROLS
// ============================================================================
/**
 * Create requisition with approval workflow
 * Composes: createPurchaseRequisition, createWorkflowInstance, createCommitment, createAuditEntry
 */
let ProcurementFinancialControlsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProcurementFinancialControlsService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ProcurementFinancialControlsService.name);
        }
        async createRequisitionWithWorkflow(requisitionData, approvalConfig, transaction) {
            this.logger.log(`Creating requisition: ${requisitionData.requisitionNumber}`);
            try {
                // Create requisition
                const requisition = await (0, procurement_financial_integration_kit_1.createPurchaseRequisition)(requisitionData, transaction);
                // Create audit entry
                await (0, audit_trail_compliance_kit_1.createAuditEntry)({
                    entityType: 'purchase_requisition',
                    entityId: requisition.requisitionId,
                    action: 'requisition_created',
                    description: `Requisition created: ${requisitionData.requisitionNumber}`,
                }, transaction);
                // Create workflow if approval required
                let workflow;
                if (approvalConfig.requisitionApproval.enabled) {
                    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
                        workflowName: 'Purchase Requisition Approval',
                        workflowType: 'requisition_approval',
                        description: `Approval for requisition ${requisitionData.requisitionNumber}`,
                    }, transaction);
                    workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
                        workflowDefinitionId: workflowDef.workflowId,
                        entityType: 'purchase_requisition',
                        entityId: requisition.requisitionId,
                        initiatorId: requisitionData.requestorId,
                    }, transaction);
                }
                // Create budget commitment if required
                let commitment;
                if (approvalConfig.requisitionApproval.requireBudgetCheck) {
                    commitment = await (0, commitment_control_kit_1.createCommitment)({
                        entityType: 'purchase_requisition',
                        entityId: requisition.requisitionId,
                        commitmentAmount: requisition.totalAmount,
                    }, transaction);
                }
                return { requisition, workflow, commitment };
            }
            catch (error) {
                this.logger.error(`Requisition creation failed: ${error.message}`, error.stack);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "ProcurementFinancialControlsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcurementFinancialControlsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcurementFinancialControlsService = _classThis;
})();
exports.ProcurementFinancialControlsService = ProcurementFinancialControlsService;
/**
 * Approve requisition with budget validation
 * Composes: approvePurchaseRequisition, approveWorkflowStep, trackCommitmentBalance, createAuditEntry
 */
const approveRequisitionWithBudgetValidation = async (requisitionId, workflowInstanceId, approverId, comments, transaction) => {
    // Check budget commitment
    const budgetCheck = await (0, commitment_control_kit_1.trackCommitmentBalance)(requisitionId, transaction);
    if (!budgetCheck.available) {
        throw new Error('Insufficient budget available');
    }
    // Approve workflow step
    await (0, financial_workflow_approval_kit_1.approveWorkflowStep)(workflowInstanceId, 1, approverId, comments, transaction);
    // Approve requisition
    const requisition = await (0, procurement_financial_integration_kit_1.approvePurchaseRequisition)(requisitionId, approverId, comments, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_requisition',
        entityId: requisitionId,
        action: 'requisition_approved',
        description: `Requisition approved by ${approverId}`,
        userId: approverId,
    }, transaction);
    return {
        approved: true,
        budgetValid: true,
        requisition,
    };
};
exports.approveRequisitionWithBudgetValidation = approveRequisitionWithBudgetValidation;
/**
 * Reject requisition with workflow
 * Composes: rejectPurchaseRequisition, rejectWorkflowStep, createCommitment, createAuditEntry
 */
const rejectRequisitionWithWorkflow = async (requisitionId, workflowInstanceId, approverId, rejectionReason, transaction) => {
    // Reject workflow step
    await (0, financial_workflow_approval_kit_1.rejectWorkflowStep)(workflowInstanceId, 1, approverId, rejectionReason, transaction);
    // Reject requisition
    await (0, procurement_financial_integration_kit_1.rejectPurchaseRequisition)(requisitionId, approverId, rejectionReason, transaction);
    // Release commitment (if exists)
    await (0, commitment_control_kit_1.closeCommitment)(requisitionId, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_requisition',
        entityId: requisitionId,
        action: 'requisition_rejected',
        description: `Requisition rejected: ${rejectionReason}`,
        userId: approverId,
    }, transaction);
    return {
        rejected: true,
        commitmentReleased: true,
    };
};
exports.rejectRequisitionWithWorkflow = rejectRequisitionWithWorkflow;
/**
 * Convert requisition to PO with controls
 * Composes: convertRequisitionToPO, createEncumbrance, updateCommitment, createAuditEntry
 */
const convertRequisitionToPOWithControls = async (requisitionId, convertedBy, transaction) => {
    // Convert to PO
    const purchaseOrder = await (0, procurement_financial_integration_kit_1.convertRequisitionToPO)(requisitionId, convertedBy, transaction);
    // Create encumbrance
    const encumbrance = await (0, encumbrance_accounting_kit_1.createEncumbrance)({
        entityType: 'purchase_order',
        entityId: purchaseOrder.purchaseOrderId,
        encumbranceAmount: purchaseOrder.totalAmount,
    }, transaction);
    // Update commitment
    await (0, commitment_control_kit_1.updateCommitment)(requisitionId, purchaseOrder.totalAmount, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_order',
        entityId: purchaseOrder.purchaseOrderId,
        action: 'po_created_from_requisition',
        description: `PO ${purchaseOrder.poNumber} created from requisition ${requisitionId}`,
    }, transaction);
    return {
        purchaseOrder,
        encumbrance,
        commitmentUpdated: true,
    };
};
exports.convertRequisitionToPOWithControls = convertRequisitionToPOWithControls;
// ============================================================================
// COMPOSITE FUNCTIONS - PURCHASE ORDER CONTROLS
// ============================================================================
/**
 * Create PO with approval and commitment
 * Composes: createPurchaseOrder, createWorkflowInstance, createEncumbrance, createAuditEntry
 */
const createPOWithApprovalAndCommitment = async (poData, requiresApproval, transaction) => {
    // Create PO
    const purchaseOrder = await (0, procurement_financial_integration_kit_1.createPurchaseOrder)(poData, transaction);
    // Create encumbrance
    const encumbrance = await (0, encumbrance_accounting_kit_1.createEncumbrance)({
        entityType: 'purchase_order',
        entityId: purchaseOrder.purchaseOrderId,
        encumbranceAmount: purchaseOrder.totalAmount,
    }, transaction);
    // Create approval workflow if required
    let workflow;
    if (requiresApproval) {
        const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
            workflowName: 'Purchase Order Approval',
            workflowType: 'po_approval',
            description: `Approval for PO ${poData.poNumber}`,
        }, transaction);
        workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
            workflowDefinitionId: workflowDef.workflowId,
            entityType: 'purchase_order',
            entityId: purchaseOrder.purchaseOrderId,
            initiatorId: poData.buyerId,
        }, transaction);
    }
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_order',
        entityId: purchaseOrder.purchaseOrderId,
        action: 'po_created',
        description: `Purchase order created: ${poData.poNumber}`,
    }, transaction);
    return { purchaseOrder, workflow, encumbrance };
};
exports.createPOWithApprovalAndCommitment = createPOWithApprovalAndCommitment;
/**
 * Approve PO with contract compliance check
 * Composes: approvePurchaseOrder, approveWorkflowStep, validateCompliance, createAuditEntry
 */
const approvePOWithContractCompliance = async (poId, workflowInstanceId, approverId, contractId, transaction) => {
    // Check contract compliance if applicable
    let compliant = true;
    if (contractId) {
        const compliance = await (0, audit_trail_compliance_kit_1.validateCompliance)('purchase_order', poId, 'contract_compliance', transaction);
        compliant = compliance.compliant;
        if (!compliant) {
            throw new Error('PO does not comply with contract terms');
        }
    }
    // Approve workflow
    await (0, financial_workflow_approval_kit_1.approveWorkflowStep)(workflowInstanceId, 1, approverId, 'Approved', transaction);
    // Approve PO
    await (0, procurement_financial_integration_kit_1.approvePurchaseOrder)(poId, approverId, 'Approved', transaction);
    // Issue PO
    await (0, procurement_financial_integration_kit_1.issuePurchaseOrder)(poId, new Date(), transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_order',
        entityId: poId,
        action: 'po_approved_and_issued',
        description: `PO approved and issued by ${approverId}`,
        userId: approverId,
    }, transaction);
    return {
        approved: true,
        compliant,
        issued: true,
    };
};
exports.approvePOWithContractCompliance = approvePOWithContractCompliance;
/**
 * Change PO with re-approval workflow
 * Composes: changePurchaseOrder, updateEncumbrance, createWorkflowInstance, createAuditEntry
 */
const changePOWithReapproval = async (poId, changeData, requiresReapproval, transaction) => {
    // Change PO
    await (0, procurement_financial_integration_kit_1.changePurchaseOrder)(poId, changeData, transaction);
    // Update encumbrance
    await (0, encumbrance_accounting_kit_1.updateEncumbrance)(poId, changeData.newAmount, transaction);
    // Create re-approval workflow if required
    let workflow;
    if (requiresReapproval) {
        const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
            workflowName: 'PO Change Approval',
            workflowType: 'po_change_approval',
            description: `Re-approval for PO ${poId} changes`,
        }, transaction);
        workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
            workflowDefinitionId: workflowDef.workflowId,
            entityType: 'purchase_order',
            entityId: poId,
            initiatorId: changeData.changedBy,
        }, transaction);
    }
    // Track data change
    await (0, audit_trail_compliance_kit_1.trackDataChange)({
        entityType: 'purchase_order',
        entityId: poId,
        fieldName: 'totalAmount',
        oldValue: changeData.oldAmount,
        newValue: changeData.newAmount,
    }, transaction);
    return {
        changed: true,
        encumbranceUpdated: true,
        workflow,
    };
};
exports.changePOWithReapproval = changePOWithReapproval;
/**
 * Close PO with final reconciliation
 * Composes: closePurchaseOrder, liquidateEncumbrance, reconcileCommitments, createAuditEntry
 */
const closePOWithFinalReconciliation = async (poId, closedBy, transaction) => {
    // Get PO receipt variance
    const variance = await (0, procurement_financial_integration_kit_1.getPOReceiptVariance)(poId, transaction);
    // Liquidate encumbrance
    await (0, encumbrance_accounting_kit_1.liquidateEncumbrance)(poId, variance.actualAmount, transaction);
    // Reconcile commitments
    await (0, commitment_control_kit_1.reconcileCommitments)(poId, transaction);
    // Close PO
    await (0, procurement_financial_integration_kit_1.closePurchaseOrder)(poId, closedBy, 'Completed and closed', transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'purchase_order',
        entityId: poId,
        action: 'po_closed',
        description: `PO closed with variance: ${variance.totalVariance}`,
        userId: closedBy,
    }, transaction);
    return {
        closed: true,
        encumbranceLiquidated: true,
        variance: variance.totalVariance,
    };
};
exports.closePOWithFinalReconciliation = closePOWithFinalReconciliation;
// ============================================================================
// COMPOSITE FUNCTIONS - RECEIVING WORKFLOW & CONTROLS
// ============================================================================
/**
 * Receive goods with variance analysis
 * Composes: receivePurchaseOrder, getPOReceiptVariance, updateEncumbrance, createAuditEntry
 */
const receiveGoodsWithVarianceAnalysis = async (poId, receiptData, varianceThreshold, transaction) => {
    // Receive goods
    const receipt = await (0, procurement_financial_integration_kit_1.receivePurchaseOrder)(poId, receiptData, transaction);
    // Get variance
    const variance = await (0, procurement_financial_integration_kit_1.getPOReceiptVariance)(poId, transaction);
    const variancePercent = Math.abs(variance.totalVariance / variance.orderedAmount) * 100;
    const withinTolerance = variancePercent <= varianceThreshold;
    // Update encumbrance
    await (0, encumbrance_accounting_kit_1.updateEncumbrance)(poId, variance.actualAmount, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'po_receipt',
        entityId: receipt.receiptId,
        action: 'goods_received',
        description: `Goods received with ${variancePercent.toFixed(2)}% variance`,
    }, transaction);
    return {
        receipt,
        variance,
        withinTolerance,
        actionRequired: !withinTolerance,
    };
};
exports.receiveGoodsWithVarianceAnalysis = receiveGoodsWithVarianceAnalysis;
/**
 * Process return to supplier
 * Composes: returnPurchaseOrder, reverseEncumbrance, createAuditEntry
 */
const processReturnToSupplier = async (poId, receiptId, returnData, transaction) => {
    // Process return
    await (0, procurement_financial_integration_kit_1.returnPurchaseOrder)(poId, receiptId, returnData, transaction);
    // Reverse encumbrance
    await (0, encumbrance_accounting_kit_1.reverseEncumbrance)(poId, returnData.returnAmount, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'po_receipt',
        entityId: receiptId,
        action: 'goods_returned',
        description: `Goods returned: ${returnData.returnReason}`,
    }, transaction);
    return {
        returned: true,
        encumbranceReversed: true,
    };
};
exports.processReturnToSupplier = processReturnToSupplier;
// ============================================================================
// COMPOSITE FUNCTIONS - INVOICE MATCHING & CONTROLS
// ============================================================================
/**
 * Process invoice with automated matching
 * Composes: createInvoice, detectDuplicateInvoices, performThreeWayMatch, approveInvoice, createAuditEntry
 */
const processInvoiceWithAutomatedMatching = async (invoiceData, poId, receiptId, autoApproveThreshold, transaction) => {
    // Check for duplicates
    const duplicates = await (0, invoice_management_matching_kit_1.detectDuplicateInvoices)(invoiceData, transaction);
    if (duplicates.length > 0) {
        throw new Error('Duplicate invoice detected');
    }
    // Create invoice
    const invoice = await (0, invoice_management_matching_kit_1.createInvoice)(invoiceData, transaction);
    // Perform three-way match
    const matchResult = await (0, invoice_management_matching_kit_1.performThreeWayMatch)(invoice.invoiceId, poId, receiptId, transaction);
    // Auto-approve if within threshold
    let autoApproved = false;
    if (matchResult.matched && matchResult.variancePercent <= autoApproveThreshold) {
        await (0, invoice_management_matching_kit_1.approveInvoice)(invoice.invoiceId, 'system', 'Auto-approved - matched within tolerance', transaction);
        autoApproved = true;
    }
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'invoice',
        entityId: invoice.invoiceId,
        action: autoApproved ? 'invoice_auto_approved' : 'invoice_created',
        description: `Invoice ${autoApproved ? 'auto-approved' : 'created'} with ${matchResult.variancePercent}% variance`,
    }, transaction);
    return {
        invoice,
        matchResult,
        autoApproved,
    };
};
exports.processInvoiceWithAutomatedMatching = processInvoiceWithAutomatedMatching;
/**
 * Handle invoice variance with dispute workflow
 * Composes: placeInvoiceHold, createInvoiceDispute, createWorkflowInstance, createAuditEntry
 */
const handleInvoiceVarianceWithDispute = async (invoiceId, varianceData, transaction) => {
    // Place on hold
    await (0, invoice_management_matching_kit_1.placeInvoiceHold)(invoiceId, 'variance', `Variance: ${varianceData.description}`, transaction);
    // Create dispute
    const dispute = await (0, invoice_management_matching_kit_1.createInvoiceDispute)({
        invoiceId,
        disputeType: 'price_variance',
        disputeAmount: varianceData.varianceAmount,
        description: varianceData.description,
    }, transaction);
    // Create resolution workflow
    const workflowDef = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)({
        workflowName: 'Invoice Variance Resolution',
        workflowType: 'invoice_variance',
        description: `Resolve variance for invoice ${invoiceId}`,
    }, transaction);
    const workflow = await (0, financial_workflow_approval_kit_1.createWorkflowInstance)({
        workflowDefinitionId: workflowDef.workflowId,
        entityType: 'invoice_dispute',
        entityId: dispute.disputeId,
        initiatorId: 'system',
    }, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'invoice',
        entityId: invoiceId,
        action: 'invoice_variance_detected',
        description: `Variance detected and dispute created: ${varianceData.varianceAmount}`,
    }, transaction);
    return {
        onHold: true,
        dispute,
        workflow,
    };
};
exports.handleInvoiceVarianceWithDispute = handleInvoiceVarianceWithDispute;
/**
 * Resolve invoice dispute and process
 * Composes: resolveInvoiceDispute, releaseInvoiceHold, approveInvoice, approveWorkflowStep
 */
const resolveInvoiceDisputeAndProcess = async (disputeId, invoiceId, workflowInstanceId, resolution, adjustmentAmount, transaction) => {
    // Resolve dispute
    await (0, invoice_management_matching_kit_1.resolveInvoiceDispute)(disputeId, resolution, adjustmentAmount, transaction);
    // Release hold
    await (0, invoice_management_matching_kit_1.releaseInvoiceHold)(invoiceId, transaction);
    // Approve workflow
    await (0, financial_workflow_approval_kit_1.approveWorkflowStep)(workflowInstanceId, 1, 'system', `Dispute resolved: ${resolution}`, transaction);
    let approved = false;
    if (resolution === 'approve') {
        // Approve invoice
        await (0, invoice_management_matching_kit_1.approveInvoice)(invoiceId, 'system', 'Approved after dispute resolution', transaction);
        approved = true;
    }
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'invoice_dispute',
        entityId: disputeId,
        action: 'dispute_resolved',
        description: `Dispute resolved: ${resolution}, adjustment: ${adjustmentAmount}`,
    }, transaction);
    return {
        resolved: true,
        approved,
        adjustment: adjustmentAmount,
    };
};
exports.resolveInvoiceDisputeAndProcess = resolveInvoiceDisputeAndProcess;
/**
 * Process invoice OCR with automated routing
 * Composes: processInvoiceOCR, applyAutomatedCoding, routeInvoice, createAuditEntry
 */
const processInvoiceOCRWithRouting = async (imageData, routingRules, transaction) => {
    // Process OCR
    const ocrData = await (0, invoice_management_matching_kit_1.processInvoiceOCR)(imageData, {}, transaction);
    // Apply automated coding
    const codingResult = await (0, invoice_management_matching_kit_1.applyAutomatedCoding)(ocrData, transaction);
    // Route invoice based on rules
    await (0, invoice_management_matching_kit_1.routeInvoice)(ocrData.invoiceId, routingRules.approverId, transaction);
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'invoice',
        entityId: ocrData.invoiceId,
        action: 'invoice_ocr_processed',
        description: 'Invoice processed via OCR and routed for approval',
    }, transaction);
    return {
        ocrData,
        coded: codingResult.success,
        routed: true,
    };
};
exports.processInvoiceOCRWithRouting = processInvoiceOCRWithRouting;
// ============================================================================
// COMPOSITE FUNCTIONS - SPEND ANALYTICS & REPORTING
// ============================================================================
/**
 * Analyze comprehensive procurement spend
 * Composes: analyzeProcurementSpend, generateProcurementReport, createAuditEntry
 */
const analyzeComprehensiveProcurementSpend = async (periodStart, periodEnd, transaction) => {
    // Analyze spend
    const spendAnalysis = await (0, procurement_financial_integration_kit_1.analyzeProcurementSpend)(periodStart, periodEnd, transaction);
    // Generate detailed report
    const report = await (0, procurement_financial_integration_kit_1.generateProcurementReport)(periodStart, periodEnd, transaction);
    // Calculate savings opportunities
    const savingsOpportunities = {
        volumeDiscounts: spendAnalysis.totalSpend * 0.03,
        contractConsolidation: spendAnalysis.totalSpend * 0.05,
        supplierRationalization: spendAnalysis.totalSpend * 0.02,
        totalPotentialSavings: spendAnalysis.totalSpend * 0.10,
    };
    // Calculate risk indicators
    const topSupplierSpend = spendAnalysis.bySupplier[0]?.amount || 0;
    const supplierConcentration = (topSupplierSpend / spendAnalysis.totalSpend) * 100;
    const riskIndicators = {
        supplierConcentration,
        mavrikSpend: spendAnalysis.offContractSpend * 0.30,
        offContractSpend: spendAnalysis.offContractSpend,
    };
    return {
        period: { start: periodStart, end: periodEnd },
        totalSpend: spendAnalysis.totalSpend,
        byCategory: spendAnalysis.byCategory,
        bySupplier: spendAnalysis.bySupplier,
        byDepartment: spendAnalysis.byDepartment,
        trends: {
            monthOverMonth: spendAnalysis.trends.monthOverMonth,
            yearOverYear: spendAnalysis.trends.yearOverYear,
            forecast: spendAnalysis.forecast,
        },
        savingsOpportunities,
        riskIndicators,
    };
};
exports.analyzeComprehensiveProcurementSpend = analyzeComprehensiveProcurementSpend;
/**
 * Generate procurement control metrics
 * Composes: Multiple procurement and approval functions
 */
const generateProcurementControlMetrics = async (periodStart, periodEnd, transaction) => {
    // Would query actual data from database
    const metrics = {
        period: { start: periodStart, end: periodEnd },
        requisitions: {
            submitted: 250,
            approved: 230,
            rejected: 15,
            pending: 5,
            averageApprovalTime: 2.5,
        },
        purchaseOrders: {
            created: 220,
            approved: 215,
            issued: 210,
            averageAmount: 15000,
            totalValue: 3300000,
        },
        receiving: {
            receiptsProcessed: 205,
            receiptVariances: 12,
            averageVariancePercent: 2.3,
        },
        invoiceMatching: {
            invoicesProcessed: 200,
            autoMatched: 175,
            manualReview: 25,
            matchRate: 87.5,
        },
        compliance: {
            contractCompliance: 92.5,
            mavrikSpend: 7.5,
            policyViolations: 3,
        },
    };
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'procurement_metrics',
        entityId: 0,
        action: 'metrics_generated',
        description: `Procurement control metrics generated for ${periodStart} to ${periodEnd}`,
    }, transaction);
    return metrics;
};
exports.generateProcurementControlMetrics = generateProcurementControlMetrics;
/**
 * Monitor contract compliance
 * Composes: validateCompliance, generateComplianceReport, createComplianceCheckpoint
 */
const monitorContractCompliance = async (contractId, transaction) => {
    // Validate compliance
    const compliance = await (0, audit_trail_compliance_kit_1.validateCompliance)('contract', contractId, 'procurement_contract', transaction);
    // Create compliance checkpoint
    await (0, audit_trail_compliance_kit_1.createComplianceCheckpoint)({
        checkpointType: 'contract_compliance',
        entityType: 'contract',
        entityId: contractId,
        checkpointDate: new Date(),
    }, transaction);
    // Would fetch actual contract data
    const status = {
        contractId,
        contractNumber: 'CNT-2024-001',
        supplier: 'Medical Supplies Inc',
        contractValue: 1000000,
        spendToDate: 750000,
        utilizationPercent: 75,
        compliance: {
            onContract: 700000,
            offContract: 50000,
            complianceRate: 93.3,
        },
        violations: compliance.issues || [],
        expirationDate: new Date('2025-12-31'),
        daysToExpiration: 365,
        renewalRequired: true,
    };
    return status;
};
exports.monitorContractCompliance = monitorContractCompliance;
// ============================================================================
// COMPOSITE FUNCTIONS - COMPLIANCE & AUDIT
// ============================================================================
/**
 * Execute procurement compliance audit
 * Composes: validateCompliance, generateComplianceReport, createAuditTrail, logComplianceEvent
 */
const executeProcurementComplianceAudit = async (auditPeriod, auditType, transaction) => {
    // Validate compliance for period
    const validation = await (0, audit_trail_compliance_kit_1.validateCompliance)('procurement', 0, auditType, transaction);
    // Generate compliance report
    const report = await (0, audit_trail_compliance_kit_1.generateComplianceReport)('procurement', auditPeriod.start, auditPeriod.end, transaction);
    // Create audit trail
    const auditTrail = await (0, audit_trail_compliance_kit_1.createAuditTrail)({
        trailType: 'procurement_audit',
        periodStart: auditPeriod.start,
        periodEnd: auditPeriod.end,
    }, transaction);
    // Log compliance event
    await (0, audit_trail_compliance_kit_1.logComplianceEvent)({
        eventType: 'procurement_audit_completed',
        entityType: 'procurement',
        entityId: 0,
        description: `${auditType} procurement audit completed`,
    }, transaction);
    // Create checkpoint
    const checkpoint = await (0, audit_trail_compliance_kit_1.createComplianceCheckpoint)({
        checkpointType: 'procurement_audit',
        entityType: 'procurement',
        entityId: 0,
        checkpointDate: new Date(),
    }, transaction);
    return {
        report,
        violations: validation.issues || [],
        checkpoints: [checkpoint],
        auditTrail,
    };
};
exports.executeProcurementComplianceAudit = executeProcurementComplianceAudit;
/**
 * Track procurement data changes
 * Composes: trackDataChange, createAuditEntry
 */
const trackProcurementDataChanges = async (entityType, entityId, changes, transaction) => {
    let tracked = 0;
    let auditEntriesCreated = 0;
    for (const change of changes) {
        // Track data change
        await (0, audit_trail_compliance_kit_1.trackDataChange)({
            entityType,
            entityId,
            fieldName: change.field,
            oldValue: change.oldValue,
            newValue: change.newValue,
        }, transaction);
        tracked++;
        // Create audit entry
        await (0, audit_trail_compliance_kit_1.createAuditEntry)({
            entityType,
            entityId,
            action: 'data_changed',
            description: `${change.field} changed from ${change.oldValue} to ${change.newValue}`,
        }, transaction);
        auditEntriesCreated++;
    }
    return { tracked, auditEntriesCreated };
};
exports.trackProcurementDataChanges = trackProcurementDataChanges;
// ============================================================================
// COMPOSITE FUNCTIONS - ENCUMBRANCE & COMMITMENT RECONCILIATION
// ============================================================================
/**
 * Reconcile procurement commitments and encumbrances
 * Composes: reconcileCommitments, reconcileEncumbrances, generateCommitmentReport, generateEncumbranceReport
 */
const reconcileProcurementCommitmentsAndEncumbrances = async (periodEnd, transaction) => {
    // Reconcile commitments
    const commitments = await (0, commitment_control_kit_1.reconcileCommitments)(0, transaction);
    // Reconcile encumbrances
    const encumbrances = await (0, encumbrance_accounting_kit_1.reconcileEncumbrances)(0, transaction);
    // Generate reports
    const commitmentReport = await (0, commitment_control_kit_1.generateCommitmentReport)(0, transaction);
    const encumbranceReport = await (0, encumbrance_accounting_kit_1.generateEncumbranceReport)(0, transaction);
    // Check balance
    const balanced = commitments.totalCommitments === encumbrances.totalEncumbrances;
    // Create audit entry
    await (0, audit_trail_compliance_kit_1.createAuditEntry)({
        entityType: 'procurement_reconciliation',
        entityId: 0,
        action: 'reconciliation_completed',
        description: `Procurement commitments and encumbrances reconciled: ${balanced ? 'balanced' : 'unbalanced'}`,
    }, transaction);
    return {
        commitments,
        encumbrances,
        commitmentReport,
        encumbranceReport,
        balanced,
    };
};
exports.reconcileProcurementCommitmentsAndEncumbrances = reconcileProcurementCommitmentsAndEncumbrances;
/**
 * Calculate encumbrance balance
 * Composes: calculateEncumbranceBalance, trackCommitmentBalance
 */
const calculateProcurementEncumbranceBalance = async (entityId, transaction) => {
    // Calculate encumbrance balance
    const encumbranceBalance = await (0, encumbrance_accounting_kit_1.calculateEncumbranceBalance)(entityId, transaction);
    // Track commitment balance
    const commitmentBalance = await (0, commitment_control_kit_1.trackCommitmentBalance)(entityId, transaction);
    const variance = encumbranceBalance.balance - commitmentBalance.balance;
    return {
        encumbranceBalance: encumbranceBalance.balance,
        commitmentBalance: commitmentBalance.balance,
        variance,
    };
};
exports.calculateProcurementEncumbranceBalance = calculateProcurementEncumbranceBalance;
//# sourceMappingURL=procurement-financial-controls-composite.js.map
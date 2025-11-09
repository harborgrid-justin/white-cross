/**
 * LOC: COMMCTRL001
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-management-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Procurement services
 *   - Budget control processes
 *   - Purchase order management
 */
/**
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 * Locator: WC-JDE-COMMCTRL-001
 * Purpose: Comprehensive Commitment Control - JD Edwards EnterpriseOne-level commitment tracking, budget checking, purchase requisitions, purchase orders
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-management-kit
 * Downstream: ../backend/financial/*, Procurement Services, Budget Control, PO Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for commitment tracking, budget checking, commitment approval, commitment liquidation, pre-encumbrance, purchase requisitions, purchase orders, commitment reporting, budget reservations
 *
 * LLM Context: Enterprise-grade commitment control operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive commitment tracking, automated budget checking, commitment approval workflows,
 * commitment liquidation, pre-encumbrance tracking, purchase requisition management, purchase order processing,
 * commitment reporting, budget reservations, multi-level approval routing, commitment history, audit trails,
 * commitment variance analysis, and fund control integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CommitmentLine {
    lineId: number;
    commitmentId: number;
    lineNumber: number;
    accountCode: string;
    accountId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
    committedAmount: number;
    liquidatedAmount: number;
    remainingAmount: number;
    budgetYear: number;
    budgetPeriod: number;
    projectCode?: string;
    activityCode?: string;
    costCenterCode?: string;
    fundCode?: string;
    organizationCode?: string;
    objectCode?: string;
}
interface BudgetReservation {
    reservationId: number;
    commitmentId: number;
    commitmentLineId: number;
    accountCode: string;
    fiscalYear: number;
    fiscalPeriod: number;
    reservedAmount: number;
    releasedAmount: number;
    remainingAmount: number;
    reservationDate: Date;
    status: 'active' | 'released' | 'expired' | 'cancelled';
    expirationDate?: Date;
    budgetType: 'annual' | 'project' | 'grant';
}
interface PurchaseRequisition {
    requisitionId: number;
    requisitionNumber: string;
    requisitionDate: Date;
    requester: string;
    department: string;
    businessUnit: string;
    description: string;
    totalAmount: number;
    status: 'draft' | 'submitted' | 'approved' | 'converted_to_po' | 'rejected' | 'cancelled';
    approvalRoute: string;
    currentApprover?: string;
    budgetCheckStatus: 'pending' | 'passed' | 'failed' | 'bypassed';
    budgetCheckDate?: Date;
    needByDate?: Date;
    deliveryLocation?: string;
}
interface PurchaseOrder {
    poId: number;
    poNumber: string;
    poDate: Date;
    poType: 'standard' | 'blanket' | 'contract' | 'emergency';
    vendorId: string;
    vendorName: string;
    businessUnit: string;
    description: string;
    totalAmount: number;
    committedAmount: number;
    invoicedAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: 'draft' | 'approved' | 'committed' | 'partially_received' | 'fully_received' | 'closed' | 'cancelled';
    requisitionId?: number;
    paymentTerms: string;
    deliveryTerms: string;
    shipToLocation: string;
    buyer: string;
    approvedBy?: string;
    approvedDate?: Date;
}
interface CommitmentApproval {
    approvalId: number;
    commitmentId: number;
    approvalLevel: number;
    approverUserId: string;
    approverName: string;
    approvalAction: 'approve' | 'reject' | 'return' | 'delegate';
    approvalDate: Date;
    comments?: string;
    delegatedTo?: string;
    nextApprover?: string;
    approvalRoute: string;
}
interface BudgetCheck {
    checkId: number;
    commitmentId: number;
    checkDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    requestedAmount: number;
    availableBudget: number;
    commitments: number;
    encumbrances: number;
    actuals: number;
    fundsAvailable: number;
    checkResult: 'pass' | 'fail' | 'warning' | 'override';
    overrideReason?: string;
    overrideBy?: string;
    checkDetails: Record<string, any>;
}
interface CommitmentLiquidation {
    liquidationId: number;
    commitmentId: number;
    commitmentLineId: number;
    liquidationType: 'partial' | 'full' | 'over_liquidation';
    liquidationDate: Date;
    liquidationAmount: number;
    invoiceNumber?: string;
    receivingNumber?: string;
    liquidatedBy: string;
    glJournalId?: number;
    status: 'pending' | 'posted' | 'reversed';
}
interface PreEncumbrance {
    preEncumbranceId: number;
    preEncumbranceNumber: string;
    preEncumbranceDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    description: string;
    estimatedAmount: number;
    status: 'active' | 'converted' | 'expired' | 'cancelled';
    convertedToCommitmentId?: number;
    expirationDate?: Date;
    createdBy: string;
}
interface CommitmentReport {
    reportId: string;
    reportType: 'commitment_summary' | 'budget_status' | 'open_commitments' | 'liquidation_history' | 'variance_analysis';
    fiscalYear: number;
    fiscalPeriod?: number;
    accountCode?: string;
    businessUnit?: string;
    reportData: Record<string, any>;
    generatedDate: Date;
    generatedBy: string;
}
interface CommitmentHistory {
    historyId: number;
    commitmentId: number;
    changeDate: Date;
    changeType: 'created' | 'approved' | 'committed' | 'liquidated' | 'modified' | 'cancelled';
    changedBy: string;
    oldStatus?: string;
    newStatus: string;
    oldAmount?: number;
    newAmount?: number;
    changeReason?: string;
    auditData: Record<string, any>;
}
export declare class CreateCommitmentDto {
    commitmentDate: Date;
    commitmentType: string;
    businessUnit: string;
    vendor?: string;
    description: string;
    requester: string;
    lines: CommitmentLine[];
}
export declare class ApprovementCommitmentDto {
    commitmentId: number;
    approvalAction: string;
    approverUserId: string;
    comments?: string;
    delegatedTo?: string;
}
export declare class BudgetCheckRequestDto {
    accountCode: string;
    fiscalYear: number;
    fiscalPeriod: number;
    requestedAmount: number;
    businessUnit?: string;
}
export declare class LiquidateCommitmentDto {
    commitmentId: number;
    commitmentLineId: number;
    liquidationAmount: number;
    liquidationDate: Date;
    invoiceNumber?: string;
    receivingNumber?: string;
    liquidatedBy: string;
}
export declare class CreatePurchaseRequisitionDto {
    requisitionDate: Date;
    requester: string;
    department: string;
    businessUnit: string;
    description: string;
    needByDate?: Date;
    deliveryLocation?: string;
    lines: any[];
}
export declare class CreatePurchaseOrderDto {
    poDate: Date;
    poType: string;
    vendorId: string;
    businessUnit: string;
    description: string;
    paymentTerms: string;
    shipToLocation: string;
    buyer: string;
    requisitionId?: number;
    lines: any[];
}
/**
 * Sequelize model for Commitment Headers with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentHeader model
 *
 * @example
 * ```typescript
 * const Commitment = createCommitmentHeaderModel(sequelize);
 * const commitment = await Commitment.create({
 *   commitmentNumber: 'COM-2024-001',
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   status: 'draft',
 *   totalAmount: 50000
 * });
 * ```
 */
export declare const createCommitmentHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        commitmentNumber: string;
        commitmentDate: Date;
        commitmentType: string;
        businessUnit: string;
        vendor: string | null;
        vendorName: string | null;
        description: string;
        status: string;
        fiscalYear: number;
        fiscalPeriod: number;
        totalAmount: number;
        committedAmount: number;
        liquidatedAmount: number;
        remainingAmount: number;
        approvalLevel: number;
        approvalStatus: string;
        requester: string;
        approvedBy: string | null;
        approvedDate: Date | null;
        committedDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Commitment Lines with budget account coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentLine model
 *
 * @example
 * ```typescript
 * const CommitmentLine = createCommitmentLineModel(sequelize);
 * const line = await CommitmentLine.create({
 *   commitmentId: 1,
 *   lineNumber: 1,
 *   accountCode: '5100-001',
 *   quantity: 10,
 *   unitPrice: 100,
 *   lineAmount: 1000
 * });
 * ```
 */
export declare const createCommitmentLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        commitmentId: number;
        lineNumber: number;
        accountCode: string;
        accountId: number;
        description: string;
        quantity: number;
        unitPrice: number;
        lineAmount: number;
        committedAmount: number;
        liquidatedAmount: number;
        remainingAmount: number;
        budgetYear: number;
        budgetPeriod: number;
        projectCode: string | null;
        activityCode: string | null;
        costCenterCode: string | null;
        fundCode: string | null;
        organizationCode: string | null;
        objectCode: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new commitment with budget checking and validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createCommitment(sequelize, {
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   requester: 'user123',
 *   lines: [{ accountCode: '5100-001', quantity: 10, unitPrice: 50, lineAmount: 500 }]
 * }, 'user123');
 * ```
 */
export declare const createCommitment: (sequelize: Sequelize, commitmentData: CreateCommitmentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<CreateCommitmentDto>} updateData - Update data
 * @param {string} userId - User updating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const updated = await updateCommitment(sequelize, 1, {
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
export declare const updateCommitment: (sequelize: Sequelize, commitmentId: number, updateData: Partial<CreateCommitmentDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Deletes a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User deleting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteCommitment(sequelize, 1, 'user123');
 * ```
 */
export declare const deleteCommitment: (sequelize: Sequelize, commitmentId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves a commitment by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment with lines
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentById(sequelize, 1);
 * ```
 */
export declare const getCommitmentById: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves commitments by various filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} filters - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of commitments
 *
 * @example
 * ```typescript
 * const commitments = await getCommitments(sequelize, {
 *   status: 'approved',
 *   fiscalYear: 2024
 * });
 * ```
 */
export declare const getCommitments: (sequelize: Sequelize, filters: {
    status?: string;
    commitmentType?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    businessUnit?: string;
    requester?: string;
}, transaction?: Transaction) => Promise<any[]>;
/**
 * Performs budget check for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check results
 *
 * @example
 * ```typescript
 * const budgetCheck = await performBudgetCheck(sequelize, 1);
 * if (budgetCheck.checkResult === 'fail') {
 *   console.log('Insufficient budget');
 * }
 * ```
 */
export declare const performBudgetCheck: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<BudgetCheck>;
/**
 * Checks budget availability for a specific account and amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BudgetCheckRequestDto} checkRequest - Budget check request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check result
 *
 * @example
 * ```typescript
 * const check = await checkBudgetAvailability(sequelize, {
 *   accountCode: '5100-001',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   requestedAmount: 5000
 * });
 * ```
 */
export declare const checkBudgetAvailability: (sequelize: Sequelize, checkRequest: BudgetCheckRequestDto, transaction?: Transaction) => Promise<BudgetCheck>;
/**
 * Overrides a failed budget check with justification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} overrideReason - Reason for override
 * @param {string} userId - User performing override
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Overridden budget check
 *
 * @example
 * ```typescript
 * const overridden = await overrideBudgetCheck(sequelize, 1, 'Emergency procurement', 'admin123');
 * ```
 */
export declare const overrideBudgetCheck: (sequelize: Sequelize, commitmentId: number, overrideReason: string, userId: string, transaction?: Transaction) => Promise<BudgetCheck>;
/**
 * Submits a commitment for approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User submitting for approval
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const submitted = await submitCommitmentForApproval(sequelize, 1, 'user123');
 * ```
 */
export declare const submitCommitmentForApproval: (sequelize: Sequelize, commitmentId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovementCommitmentDto} approvalData - Approval data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const approved = await approveCommitment(sequelize, {
 *   commitmentId: 1,
 *   approvalAction: 'approve',
 *   approverUserId: 'approver123',
 *   comments: 'Approved for processing'
 * });
 * ```
 */
export declare const approveCommitment: (sequelize: Sequelize, approvalData: ApprovementCommitmentDto, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves approval history for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentApproval[]>} Approval history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentApprovalHistory(sequelize, 1);
 * ```
 */
export declare const getCommitmentApprovalHistory: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<CommitmentApproval[]>;
/**
 * Delegates approval to another user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} fromUserId - Current approver
 * @param {string} toUserId - Delegated approver
 * @param {string} reason - Delegation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const delegated = await delegateApproval(sequelize, 1, 'approver1', 'approver2', 'Out of office');
 * ```
 */
export declare const delegateApproval: (sequelize: Sequelize, commitmentId: number, fromUserId: string, toUserId: string, reason: string, transaction?: Transaction) => Promise<any>;
/**
 * Posts (commits) an approved commitment to budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User posting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted commitment
 *
 * @example
 * ```typescript
 * const posted = await postCommitmentToBudget(sequelize, 1, 'user123');
 * ```
 */
export declare const postCommitmentToBudget: (sequelize: Sequelize, commitmentId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Liquidates a commitment (partial or full).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateCommitmentDto} liquidationData - Liquidation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentLiquidation>} Liquidation record
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateCommitment(sequelize, {
 *   commitmentId: 1,
 *   commitmentLineId: 1,
 *   liquidationAmount: 500,
 *   liquidationDate: new Date(),
 *   invoiceNumber: 'INV-12345',
 *   liquidatedBy: 'user123'
 * });
 * ```
 */
export declare const liquidateCommitment: (sequelize: Sequelize, liquidationData: LiquidateCommitmentDto, transaction?: Transaction) => Promise<CommitmentLiquidation>;
/**
 * Reverses a commitment liquidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} liquidationId - Liquidation ID
 * @param {string} userId - User reversing the liquidation
 * @param {string} reason - Reversal reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseCommitmentLiquidation(sequelize, 1, 'user123', 'Invoice cancelled');
 * ```
 */
export declare const reverseCommitmentLiquidation: (sequelize: Sequelize, liquidationId: number, userId: string, reason: string, transaction?: Transaction) => Promise<void>;
/**
 * Closes a fully liquidated commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User closing the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed commitment
 *
 * @example
 * ```typescript
 * const closed = await closeCommitment(sequelize, 1, 'user123');
 * ```
 */
export declare const closeCommitment: (sequelize: Sequelize, commitmentId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Created budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await createBudgetReservations(sequelize, 1);
 * ```
 */
export declare const createBudgetReservations: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<BudgetReservation[]>;
/**
 * Releases budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseBudgetReservations(sequelize, 1);
 * ```
 */
export declare const releaseBudgetReservations: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await getBudgetReservations(sequelize, 1);
 * ```
 */
export declare const getBudgetReservations: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<BudgetReservation[]>;
/**
 * Creates a purchase requisition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseRequisitionDto} requisitionData - Requisition data
 * @param {string} userId - User creating the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPurchaseRequisition(sequelize, {
 *   requisitionDate: new Date(),
 *   requester: 'user123',
 *   department: 'IT',
 *   businessUnit: 'BU001',
 *   description: 'Office equipment',
 *   lines: [{ description: 'Laptop', quantity: 2, unitPrice: 1500 }]
 * }, 'user123');
 * ```
 */
export declare const createPurchaseRequisition: (sequelize: Sequelize, requisitionData: CreatePurchaseRequisitionDto, userId: string, transaction?: Transaction) => Promise<PurchaseRequisition>;
/**
 * Converts a requisition to a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requisitionId - Requisition ID
 * @param {string} vendorId - Selected vendor
 * @param {string} userId - User converting the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await convertRequisitionToPO(sequelize, 1, 'VENDOR123', 'user123');
 * ```
 */
export declare const convertRequisitionToPO: (sequelize: Sequelize, requisitionId: number, vendorId: string, userId: string, transaction?: Transaction) => Promise<PurchaseOrder>;
/**
 * Retrieves requisitions by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Requisition status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition[]>} List of requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(sequelize, 'submitted');
 * ```
 */
export declare const getRequisitionsByStatus: (sequelize: Sequelize, status: string, transaction?: Transaction) => Promise<PurchaseRequisition[]>;
/**
 * Creates a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseOrderDto} poData - PO data
 * @param {string} userId - User creating the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder(sequelize, {
 *   poDate: new Date(),
 *   poType: 'standard',
 *   vendorId: 'VENDOR123',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   paymentTerms: 'Net 30',
 *   shipToLocation: 'Main Office',
 *   buyer: 'buyer123',
 *   lines: [{ description: 'Paper', quantity: 100, unitPrice: 5 }]
 * }, 'user123');
 * ```
 */
export declare const createPurchaseOrder: (sequelize: Sequelize, poData: CreatePurchaseOrderDto, userId: string, transaction?: Transaction) => Promise<PurchaseOrder>;
/**
 * Approves a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User approving the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Approved purchase order
 *
 * @example
 * ```typescript
 * const approved = await approvePurchaseOrder(sequelize, 1, 'approver123');
 * ```
 */
export declare const approvePurchaseOrder: (sequelize: Sequelize, poId: number, userId: string, transaction?: Transaction) => Promise<PurchaseOrder>;
/**
 * Closes a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User closing the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Closed purchase order
 *
 * @example
 * ```typescript
 * const closed = await closePurchaseOrder(sequelize, 1, 'user123');
 * ```
 */
export declare const closePurchaseOrder: (sequelize: Sequelize, poId: number, userId: string, transaction?: Transaction) => Promise<PurchaseOrder>;
/**
 * Retrieves purchase orders by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder[]>} List of purchase orders
 *
 * @example
 * ```typescript
 * const pos = await getPurchaseOrdersByVendor(sequelize, 'VENDOR123');
 * ```
 */
export declare const getPurchaseOrdersByVendor: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<PurchaseOrder[]>;
/**
 * Creates a pre-encumbrance for budget planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} preEncumbranceData - Pre-encumbrance data
 * @param {string} userId - User creating the pre-encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PreEncumbrance>} Created pre-encumbrance
 *
 * @example
 * ```typescript
 * const preEnc = await createPreEncumbrance(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   accountCode: '5100-001',
 *   description: 'Expected equipment purchase',
 *   estimatedAmount: 25000
 * }, 'user123');
 * ```
 */
export declare const createPreEncumbrance: (sequelize: Sequelize, preEncumbranceData: {
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    description: string;
    estimatedAmount: number;
    expirationDate?: Date;
}, userId: string, transaction?: Transaction) => Promise<PreEncumbrance>;
/**
 * Converts a pre-encumbrance to a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} preEncumbranceId - Pre-encumbrance ID
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User converting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await convertPreEncumbranceToCommitment(sequelize, 1, commitmentData, 'user123');
 * ```
 */
export declare const convertPreEncumbranceToCommitment: (sequelize: Sequelize, preEncumbranceId: number, commitmentData: CreateCommitmentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates open commitments report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {string} [businessUnit] - Optional business unit filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Commitment report
 *
 * @example
 * ```typescript
 * const report = await generateOpenCommitmentsReport(sequelize, 2024, 3, 'BU001');
 * ```
 */
export declare const generateOpenCommitmentsReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod?: number, businessUnit?: string, transaction?: Transaction) => Promise<CommitmentReport>;
/**
 * Generates commitment liquidation history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Liquidation history report
 *
 * @example
 * ```typescript
 * const report = await generateLiquidationHistoryReport(sequelize, 1);
 * ```
 */
export declare const generateLiquidationHistoryReport: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<CommitmentReport>;
/**
 * Generates commitment variance analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [accountCode] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Variance analysis report
 *
 * @example
 * ```typescript
 * const report = await generateCommitmentVarianceReport(sequelize, 2024, '5100-001');
 * ```
 */
export declare const generateCommitmentVarianceReport: (sequelize: Sequelize, fiscalYear: number, accountCode?: string, transaction?: Transaction) => Promise<CommitmentReport>;
/**
 * Generates a unique commitment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentType - Type of commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated commitment number
 *
 * @example
 * ```typescript
 * const number = await generateCommitmentNumber(sequelize, 'purchase_order');
 * ```
 */
export declare const generateCommitmentNumber: (sequelize: Sequelize, commitmentType: string, transaction?: Transaction) => Promise<string>;
/**
 * Generates a unique requisition number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated requisition number
 *
 * @example
 * ```typescript
 * const number = await generateRequisitionNumber(sequelize);
 * ```
 */
export declare const generateRequisitionNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Generates a unique PO number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated PO number
 *
 * @example
 * ```typescript
 * const number = await generatePONumber(sequelize);
 * ```
 */
export declare const generatePONumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Generates a unique pre-encumbrance number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated pre-encumbrance number
 *
 * @example
 * ```typescript
 * const number = await generatePreEncumbranceNumber(sequelize);
 * ```
 */
export declare const generatePreEncumbranceNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Determines fiscal year and period from a date.
 *
 * @param {Date} date - Date to analyze
 * @returns {Object} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
export declare const getFiscalYearPeriod: (date: Date) => {
    fiscalYear: number;
    fiscalPeriod: number;
};
/**
 * Retrieves commitment by number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentNumber - Commitment number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentByNumber(sequelize, 'COM-2024-001');
 * ```
 */
export declare const getCommitmentByNumber: (sequelize: Sequelize, commitmentNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves commitment lines for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Commitment lines
 *
 * @example
 * ```typescript
 * const lines = await getCommitmentLines(sequelize, 1);
 * ```
 */
export declare const getCommitmentLines: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Updates a commitment line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} lineId - Commitment line ID
 * @param {Partial<CommitmentLine>} updateData - Update data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment line
 *
 * @example
 * ```typescript
 * const updated = await updateCommitmentLine(sequelize, 1, { quantity: 15 });
 * ```
 */
export declare const updateCommitmentLine: (sequelize: Sequelize, lineId: number, updateData: Partial<CommitmentLine>, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves commitment history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory[]>} Commitment history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentHistory(sequelize, 1);
 * ```
 */
export declare const getCommitmentHistory: (sequelize: Sequelize, commitmentId: number, transaction?: Transaction) => Promise<CommitmentHistory[]>;
/**
 * Records commitment history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<CommitmentHistory, 'historyId'>} historyData - History data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory>} Created history entry
 *
 * @example
 * ```typescript
 * const history = await recordCommitmentHistory(sequelize, {
 *   commitmentId: 1,
 *   changeDate: new Date(),
 *   changeType: 'approved',
 *   changedBy: 'user123',
 *   newStatus: 'approved',
 *   auditData: {}
 * });
 * ```
 */
export declare const recordCommitmentHistory: (sequelize: Sequelize, historyData: Omit<CommitmentHistory, "historyId">, transaction?: Transaction) => Promise<CommitmentHistory>;
/**
 * Cancels a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled commitment
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCommitment(sequelize, 1, 'No longer needed', 'user123');
 * ```
 */
export declare const cancelCommitment: (sequelize: Sequelize, commitmentId: number, cancellationReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reopens a cancelled commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User reopening
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reopened commitment
 *
 * @example
 * ```typescript
 * const reopened = await reopenCommitment(sequelize, 1, 'user123');
 * ```
 */
export declare const reopenCommitment: (sequelize: Sequelize, commitmentId: number, userId: string, transaction?: Transaction) => Promise<any>;
export {};
//# sourceMappingURL=commitment-control-kit.d.ts.map
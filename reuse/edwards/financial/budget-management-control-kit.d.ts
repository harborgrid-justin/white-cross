/**
 * LOC: EDWBUDG001
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Budget planning services
 *   - Budget control and monitoring
 *   - Encumbrance tracking
 */
/**
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 * Locator: WC-EDW-BUDG-001
 * Purpose: Comprehensive Budget Management and Control - JD Edwards EnterpriseOne-level budget operations, encumbrance, budget vs actual
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Budget Planning Services, Budget Control, Encumbrance Tracking, Variance Analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for budget creation, allocation, amendments, transfers, encumbrance, commitments, budget vs actual, variance analysis, budget monitoring, supplemental budgets
 *
 * LLM Context: Enterprise-grade budget management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive budget planning, budget allocation, budget control, encumbrance accounting, commitment tracking,
 * budget vs actual analysis, budget amendments, supplemental budgets, budget transfers, position budgeting, project budgeting,
 * variance analysis, budget monitoring, budget approval workflows, and multi-year budgeting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface BudgetVsActual {
    accountCode: string;
    accountName: string;
    fiscalYear: number;
    fiscalPeriod: number;
    budgetAmount: number;
    amendmentAmount: number;
    revisedBudget: number;
    committedAmount: number;
    encumberedAmount: number;
    actualAmount: number;
    availableAmount: number;
    variance: number;
    variancePercent: number;
}
interface VarianceAnalysis {
    accountCode: string;
    accountName: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    varianceType: 'favorable' | 'unfavorable' | 'neutral';
    thresholdStatus: 'within' | 'warning' | 'exceeded';
}
interface FundsAvailability {
    accountId: number;
    accountCode: string;
    budgetAmount: number;
    committedAmount: number;
    encumberedAmount: number;
    actualAmount: number;
    reservedAmount: number;
    availableAmount: number;
    hasSufficientFunds: boolean;
}
export declare class CreateBudgetDto {
    budgetCode: string;
    budgetName: string;
    budgetType: string;
    fiscalYear: number;
    startDate: Date;
    endDate: Date;
    totalBudgetAmount: number;
}
export declare class CreateBudgetAllocationDto {
    budgetId: number;
    accountId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    allocatedAmount: number;
    organizationCode?: string;
    departmentCode?: string;
}
export declare class CreateBudgetAmendmentDto {
    budgetId: number;
    amendmentType: string;
    amendmentAmount: number;
    effectiveDate: Date;
    justification: string;
}
export declare class CreateBudgetTransferDto {
    fromBudgetId: number;
    fromAccountCode: string;
    toBudgetId: number;
    toAccountCode: string;
    transferAmount: number;
    reason: string;
}
export declare class CreateEncumbranceDto {
    budgetId: number;
    accountId: number;
    encumbranceType: string;
    encumbranceAmount: number;
    referenceDocument: string;
}
export declare class CheckFundsAvailabilityDto {
    budgetId: number;
    accountId: number;
    amount: number;
    checkDate: Date;
}
/**
 * Sequelize model for Budget Definitions with multi-year support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetDefinition model
 *
 * @example
 * ```typescript
 * const Budget = createBudgetDefinitionModel(sequelize);
 * const budget = await Budget.create({
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   totalBudgetAmount: 10000000
 * });
 * ```
 */
export declare const createBudgetDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        budgetCode: string;
        budgetName: string;
        budgetType: string;
        budgetCategory: string;
        fiscalYear: number;
        startDate: Date;
        endDate: Date;
        status: string;
        totalBudgetAmount: number;
        allocatedAmount: number;
        committedAmount: number;
        encumberedAmount: number;
        actualAmount: number;
        availableAmount: number;
        isMultiYear: boolean;
        parentBudgetId: number | null;
        approvalWorkflowId: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Budget Allocations by account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAllocation model
 *
 * @example
 * ```typescript
 * const Allocation = createBudgetAllocationModel(sequelize);
 * const allocation = await Allocation.create({
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * });
 * ```
 */
export declare const createBudgetAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        budgetId: number;
        accountId: number;
        accountCode: string;
        organizationCode: string | null;
        departmentCode: string | null;
        projectCode: string | null;
        costCenterCode: string | null;
        fiscalYear: number;
        fiscalPeriod: number;
        allocatedAmount: number;
        revisedAmount: number;
        committedAmount: number;
        encumberedAmount: number;
        actualAmount: number;
        availableAmount: number;
        isLocked: boolean;
        lockedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Budget Amendments with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAmendment model
 *
 * @example
 * ```typescript
 * const Amendment = createBudgetAmendmentModel(sequelize);
 * const amendment = await Amendment.create({
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   justification: 'Additional funding for Q4'
 * });
 * ```
 */
export declare const createBudgetAmendmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        budgetId: number;
        amendmentNumber: string;
        amendmentType: string;
        amendmentDate: Date;
        effectiveDate: Date;
        amendmentAmount: number;
        accountId: number | null;
        accountCode: string | null;
        justification: string;
        status: string;
        submittedBy: string | null;
        submittedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedBy: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        postedAt: Date | null;
        journalEntryId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Budget Transfers between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetTransfer model
 *
 * @example
 * ```typescript
 * const Transfer = createBudgetTransferModel(sequelize);
 * const transfer = await Transfer.create({
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000
 * });
 * ```
 */
export declare const createBudgetTransferModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transferNumber: string;
        transferDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        fromBudgetId: number;
        fromAccountId: number;
        fromAccountCode: string;
        toBudgetId: number;
        toAccountId: number;
        toAccountCode: string;
        transferAmount: number;
        reason: string;
        status: string;
        submittedBy: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        postedAt: Date | null;
        journalEntryId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Encumbrances (purchase orders, contracts).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Encumbrance model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceType: 'purchase_order',
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * });
 * ```
 */
export declare const createEncumbranceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        encumbranceNumber: string;
        encumbranceType: string;
        budgetId: number;
        accountId: number;
        accountCode: string;
        encumbranceDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        encumbranceAmount: number;
        liquidatedAmount: number;
        remainingAmount: number;
        status: string;
        referenceDocument: string;
        vendorId: number | null;
        vendorName: string | null;
        description: string;
        expirationDate: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Creates a new budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, {
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalBudgetAmount: 10000000
 * }, 'user123');
 * ```
 */
export declare function createBudget(sequelize: Sequelize, budgetData: CreateBudgetDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Updates an existing budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to update
 * @param {object} updateData - Updated budget data
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await updateBudget(sequelize, 1, {
 *   totalBudgetAmount: 11000000
 * }, 'user123');
 * ```
 */
export declare function updateBudget(sequelize: Sequelize, budgetId: number, updateData: any, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves budget by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetById(sequelize, 1);
 * ```
 */
export declare function getBudgetById(sequelize: Sequelize, budgetId: number, transaction?: Transaction): Promise<any>;
/**
 * Retrieves budget by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetCode - Budget code to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetByCode(sequelize, 'FY2024-OPS');
 * ```
 */
export declare function getBudgetByCode(sequelize: Sequelize, budgetCode: string, transaction?: Transaction): Promise<any>;
/**
 * Lists all budgets for a fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of budgets
 *
 * @example
 * ```typescript
 * const budgets = await listBudgetsByYear(sequelize, 2024);
 * ```
 */
export declare function listBudgetsByYear(sequelize: Sequelize, fiscalYear: number, transaction?: Transaction): Promise<any[]>;
/**
 * Approves a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to approve
 * @param {string} userId - User approving the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved budget
 *
 * @example
 * ```typescript
 * const approved = await approveBudget(sequelize, 1, 'manager123');
 * ```
 */
export declare function approveBudget(sequelize: Sequelize, budgetId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Activates an approved budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to activate
 * @param {string} userId - User activating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated budget
 *
 * @example
 * ```typescript
 * const active = await activateBudget(sequelize, 1, 'user123');
 * ```
 */
export declare function activateBudget(sequelize: Sequelize, budgetId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Closes a budget period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to close
 * @param {string} userId - User closing the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed budget
 *
 * @example
 * ```typescript
 * const closed = await closeBudget(sequelize, 1, 'user123');
 * ```
 */
export declare function closeBudget(sequelize: Sequelize, budgetId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Deletes a budget (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudget(sequelize, 1);
 * ```
 */
export declare function deleteBudget(sequelize: Sequelize, budgetId: number, transaction?: Transaction): Promise<void>;
/**
 * Copies a budget to create a new budget for the next year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceBudgetId - Source budget ID to copy
 * @param {number} targetFiscalYear - Target fiscal year
 * @param {string} userId - User creating the copy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} New budget copy
 *
 * @example
 * ```typescript
 * const newBudget = await copyBudget(sequelize, 1, 2025, 'user123');
 * ```
 */
export declare function copyBudget(sequelize: Sequelize, sourceBudgetId: number, targetFiscalYear: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Creates a budget allocation for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAllocationDto} allocationData - Allocation data
 * @param {string} userId - User creating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createBudgetAllocation(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * }, 'user123');
 * ```
 */
export declare function createBudgetAllocation(sequelize: Sequelize, allocationData: CreateBudgetAllocationDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Updates a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to update
 * @param {object} updateData - Updated allocation data
 * @param {string} userId - User updating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateBudgetAllocation(sequelize, 1, {
 *   allocatedAmount: 110000
 * }, 'user123');
 * ```
 */
export declare function updateBudgetAllocation(sequelize: Sequelize, allocationId: number, updateData: any, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves allocations for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [fiscalPeriod] - Optional fiscal period filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of allocations
 *
 * @example
 * ```typescript
 * const allocations = await getBudgetAllocations(sequelize, 1, 1);
 * ```
 */
export declare function getBudgetAllocations(sequelize: Sequelize, budgetId: number, fiscalPeriod?: number, transaction?: Transaction): Promise<any[]>;
/**
 * Retrieves allocation for specific account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allocation
 *
 * @example
 * ```typescript
 * const allocation = await getAllocationByAccount(
 *   sequelize, 1, 100, 2024, 1
 * );
 * ```
 */
export declare function getAllocationByAccount(sequelize: Sequelize, budgetId: number, accountId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<any>;
/**
 * Locks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to lock
 * @param {string} userId - User locking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations locked
 *
 * @example
 * ```typescript
 * const count = await lockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
export declare function lockBudgetAllocations(sequelize: Sequelize, budgetId: number, fiscalPeriod: number, userId: string, transaction?: Transaction): Promise<number>;
/**
 * Unlocks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to unlock
 * @param {string} userId - User unlocking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations unlocked
 *
 * @example
 * ```typescript
 * const count = await unlockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
export declare function unlockBudgetAllocations(sequelize: Sequelize, budgetId: number, fiscalPeriod: number, userId: string, transaction?: Transaction): Promise<number>;
/**
 * Distributes budget evenly across all periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} totalAmount - Total amount to distribute
 * @param {number} numberOfPeriods - Number of periods
 * @param {string} userId - User performing distribution
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await distributeBudgetEvenly(
 *   sequelize, 1, 100, 120000, 12, 'user123'
 * );
 * ```
 */
export declare function distributeBudgetEvenly(sequelize: Sequelize, budgetId: number, accountId: number, totalAmount: number, numberOfPeriods: number, userId: string, transaction?: Transaction): Promise<any[]>;
/**
 * Calculates total allocated amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total allocated amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAllocated(sequelize, 1);
 * ```
 */
export declare function calculateTotalAllocated(sequelize: Sequelize, budgetId: number, transaction?: Transaction): Promise<number>;
/**
 * Deletes a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudgetAllocation(sequelize, 1);
 * ```
 */
export declare function deleteBudgetAllocation(sequelize: Sequelize, allocationId: number, transaction?: Transaction): Promise<void>;
/**
 * Retrieves allocation summary by department.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} departmentCode - Department code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Department allocation summary
 *
 * @example
 * ```typescript
 * const summary = await getAllocationsByDepartment(
 *   sequelize, 1, 'DEPT-001'
 * );
 * ```
 */
export declare function getAllocationsByDepartment(sequelize: Sequelize, budgetId: number, departmentCode: string, transaction?: Transaction): Promise<any[]>;
/**
 * Creates a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAmendmentDto} amendmentData - Amendment data
 * @param {string} userId - User creating the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment(sequelize, {
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   effectiveDate: new Date(),
 *   justification: 'Additional funding needed for Q4'
 * }, 'user123');
 * ```
 */
export declare function createBudgetAmendment(sequelize: Sequelize, amendmentData: CreateBudgetAmendmentDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Approves a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to approve
 * @param {string} userId - User approving the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetAmendment(sequelize, 1, 'manager123');
 * ```
 */
export declare function approveBudgetAmendment(sequelize: Sequelize, amendmentId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Posts a budget amendment to update budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to post
 * @param {string} userId - User posting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted amendment
 *
 * @example
 * ```typescript
 * const posted = await postBudgetAmendment(sequelize, 1, 'user123');
 * ```
 */
export declare function postBudgetAmendment(sequelize: Sequelize, amendmentId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Rejects a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to reject
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectBudgetAmendment(
 *   sequelize, 1, 'Insufficient justification', 'manager123'
 * );
 * ```
 */
export declare function rejectBudgetAmendment(sequelize: Sequelize, amendmentId: number, rejectionReason: string, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Creates a budget transfer between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetTransferDto} transferData - Transfer data
 * @param {string} userId - User creating the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createBudgetTransfer(sequelize, {
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000,
 *   reason: 'Reallocate for increased benefits costs'
 * }, 'user123');
 * ```
 */
export declare function createBudgetTransfer(sequelize: Sequelize, transferData: CreateBudgetTransferDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Approves a budget transfer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to approve
 * @param {string} userId - User approving the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetTransfer(sequelize, 1, 'manager123');
 * ```
 */
export declare function approveBudgetTransfer(sequelize: Sequelize, transferId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Posts a budget transfer to update allocations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to post
 * @param {string} userId - User posting the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted transfer
 *
 * @example
 * ```typescript
 * const posted = await postBudgetTransfer(sequelize, 1, 'user123');
 * ```
 */
export declare function postBudgetTransfer(sequelize: Sequelize, transferId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves budget amendments for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of amendments
 *
 * @example
 * ```typescript
 * const amendments = await getBudgetAmendments(sequelize, 1, 'approved');
 * ```
 */
export declare function getBudgetAmendments(sequelize: Sequelize, budgetId: number, status?: string, transaction?: Transaction): Promise<any[]>;
/**
 * Retrieves budget transfers for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of transfers
 *
 * @example
 * ```typescript
 * const transfers = await getBudgetTransfers(sequelize, 1, 'posted');
 * ```
 */
export declare function getBudgetTransfers(sequelize: Sequelize, budgetId: number, status?: string, transaction?: Transaction): Promise<any[]>;
/**
 * Creates an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto} encumbranceData - Encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceType: 'purchase_order',
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * }, 'user123');
 * ```
 */
export declare function createEncumbrance(sequelize: Sequelize, encumbranceData: CreateEncumbranceDto, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Liquidates an encumbrance (fully or partially).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to liquidate
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} userId - User liquidating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const liquidated = await liquidateEncumbrance(
 *   sequelize, 1, 25000, 'user123'
 * );
 * ```
 */
export declare function liquidateEncumbrance(sequelize: Sequelize, encumbranceId: number, liquidationAmount: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Cancels an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to cancel
 * @param {string} userId - User cancelling the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled encumbrance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelEncumbrance(sequelize, 1, 'user123');
 * ```
 */
export declare function cancelEncumbrance(sequelize: Sequelize, encumbranceId: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Retrieves encumbrances for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrances(sequelize, 1, 'active');
 * ```
 */
export declare function getEncumbrances(sequelize: Sequelize, budgetId: number, status?: string, transaction?: Transaction): Promise<any[]>;
/**
 * Calculates total encumbered amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total encumbered amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalEncumbered(sequelize, 1);
 * ```
 */
export declare function calculateTotalEncumbered(sequelize: Sequelize, budgetId: number, accountId?: number, transaction?: Transaction): Promise<number>;
/**
 * Checks funds availability before creating encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CheckFundsAvailabilityDto} checkData - Funds check parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FundsAvailability>} Funds availability result
 *
 * @example
 * ```typescript
 * const availability = await checkFundsAvailability(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   amount: 50000,
 *   checkDate: new Date()
 * });
 * ```
 */
export declare function checkFundsAvailability(sequelize: Sequelize, checkData: CheckFundsAvailabilityDto, transaction?: Transaction): Promise<FundsAvailability>;
/**
 * Retrieves encumbrance by reference document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} referenceDocument - Reference document number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceByReference(
 *   sequelize, 'PO-2024-001'
 * );
 * ```
 */
export declare function getEncumbranceByReference(sequelize: Sequelize, referenceDocument: string, transaction?: Transaction): Promise<any>;
/**
 * Updates encumbrance amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to update
 * @param {number} newAmount - New encumbrance amount
 * @param {string} userId - User updating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const updated = await updateEncumbranceAmount(
 *   sequelize, 1, 55000, 'user123'
 * );
 * ```
 */
export declare function updateEncumbranceAmount(sequelize: Sequelize, encumbranceId: number, newAmount: number, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Generates encumbrance report for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Encumbrance report data
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceReport(sequelize, 2024, 1);
 * ```
 */
export declare function generateEncumbranceReport(sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<any[]>;
/**
 * Generates budget vs actual report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetVsActual[]>} Budget vs actual comparison
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport(
 *   sequelize, 1, 2024, 1
 * );
 * ```
 */
export declare function generateBudgetVsActualReport(sequelize: Sequelize, budgetId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<BudgetVsActual[]>;
/**
 * Performs variance analysis on budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdPercent=10] - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(
 *   sequelize, 1, 2024, 1, 15
 * );
 * ```
 */
export declare function performVarianceAnalysis(sequelize: Sequelize, budgetId: number, fiscalYear: number, fiscalPeriod: number, thresholdPercent?: number, transaction?: Transaction): Promise<VarianceAnalysis[]>;
/**
 * Calculates budget utilization percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Budget utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateBudgetUtilization(sequelize, 1);
 * ```
 */
export declare function calculateBudgetUtilization(sequelize: Sequelize, budgetId: number, accountId?: number, transaction?: Transaction): Promise<number>;
/**
 * Retrieves accounts exceeding budget threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} thresholdPercent - Threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Accounts over threshold
 *
 * @example
 * ```typescript
 * const overBudget = await getAccountsOverBudget(sequelize, 1, 90);
 * ```
 */
export declare function getAccountsOverBudget(sequelize: Sequelize, budgetId: number, thresholdPercent: number, transaction?: Transaction): Promise<any[]>;
/**
 * Generates comprehensive budget monitoring dashboard data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetMonitoringDashboard(
 *   sequelize, 1
 * );
 * ```
 */
export declare function generateBudgetMonitoringDashboard(sequelize: Sequelize, budgetId: number, transaction?: Transaction): Promise<any>;
export {};
//# sourceMappingURL=budget-management-control-kit.d.ts.map
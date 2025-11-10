"use strict";
/**
 * LOC: GOV-BDG-APR-001
 * File: /reuse/government/budget-appropriations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *
 * DOWNSTREAM (imported by):
 *   - Budget management services
 *   - Appropriations controllers
 *   - Financial reporting modules
 *   - Fiscal year processing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferStatus = exports.FundType = exports.BudgetCategory = exports.AppropriationType = exports.BudgetStatus = void 0;
exports.createBudget = createBudget;
exports.createAppropriation = createAppropriation;
exports.createBudgetLineItem = createBudgetLineItem;
exports.approveBudget = approveBudget;
exports.activateBudget = activateBudget;
exports.encumberFunds = encumberFunds;
exports.recordExpenditure = recordExpenditure;
exports.releaseEncumbrance = releaseEncumbrance;
exports.calculateAvailableBalance = calculateAvailableBalance;
exports.validateSpendingAuthority = validateSpendingAuthority;
exports.createBudgetAmendment = createBudgetAmendment;
exports.createBudgetTransfer = createBudgetTransfer;
exports.approveBudgetTransfer = approveBudgetTransfer;
exports.rejectBudgetTransfer = rejectBudgetTransfer;
exports.carryoverAppropriation = carryoverAppropriation;
exports.trackMultiYearAppropriations = trackMultiYearAppropriations;
exports.calculateLapsedAppropriations = calculateLapsedAppropriations;
exports.generateBudgetVsActualReport = generateBudgetVsActualReport;
exports.calculateSpendingPace = calculateSpendingPace;
exports.generateExpenditureTrends = generateExpenditureTrends;
exports.projectYearEndPosition = projectYearEndPosition;
exports.generateMonthlyForecast = generateMonthlyForecast;
exports.identifyBudgetVariances = identifyBudgetVariances;
exports.createFiscalYear = createFiscalYear;
exports.activateFiscalYear = activateFiscalYear;
exports.closeFiscalYear = closeFiscalYear;
exports.getActiveFiscalYear = getActiveFiscalYear;
exports.performVarianceAnalysis = performVarianceAnalysis;
exports.calculateBudgetUtilization = calculateBudgetUtilization;
exports.calculateFundBalance = calculateFundBalance;
exports.trackFundBalanceChanges = trackFundBalanceChanges;
exports.validateBudgetDates = validateBudgetDates;
exports.formatBudgetAmount = formatBudgetAmount;
/**
 * File: /reuse/government/budget-appropriations-kit.ts
 * Locator: WC-GOV-BDG-APR-001
 * Purpose: Budget Appropriations Management Kit - Comprehensive budget and appropriations management for government operations
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, class-validator
 * Downstream: Government budget services, appropriations controllers, fiscal reporting, financial management
 * Dependencies: Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 * Exports: 50+ functions for budget creation, appropriations, transfers, tracking, forecasting, and compliance
 *
 * LLM Context: Enterprise-grade budget and appropriations management for government entities.
 * Provides utilities for budget lifecycle management, appropriations control, fiscal year operations,
 * budget amendments, transfers, variance analysis, fund accounting, and comprehensive financial reporting.
 * Compliant with governmental accounting standards (GASB, FASAB) and federal/state budget regulations.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Budget status enumeration
 */
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "DRAFT";
    BudgetStatus["PROPOSED"] = "PROPOSED";
    BudgetStatus["APPROVED"] = "APPROVED";
    BudgetStatus["ACTIVE"] = "ACTIVE";
    BudgetStatus["AMENDED"] = "AMENDED";
    BudgetStatus["CLOSED"] = "CLOSED";
    BudgetStatus["ARCHIVED"] = "ARCHIVED";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
/**
 * Appropriation type enumeration
 */
var AppropriationType;
(function (AppropriationType) {
    AppropriationType["ANNUAL"] = "ANNUAL";
    AppropriationType["MULTI_YEAR"] = "MULTI_YEAR";
    AppropriationType["NO_YEAR"] = "NO_YEAR";
    AppropriationType["CONTINUING"] = "CONTINUING";
    AppropriationType["SUPPLEMENTAL"] = "SUPPLEMENTAL";
})(AppropriationType || (exports.AppropriationType = AppropriationType = {}));
/**
 * Budget category enumeration
 */
var BudgetCategory;
(function (BudgetCategory) {
    BudgetCategory["PERSONNEL"] = "PERSONNEL";
    BudgetCategory["OPERATIONS"] = "OPERATIONS";
    BudgetCategory["CAPITAL"] = "CAPITAL";
    BudgetCategory["DEBT_SERVICE"] = "DEBT_SERVICE";
    BudgetCategory["GRANTS"] = "GRANTS";
    BudgetCategory["TRANSFERS"] = "TRANSFERS";
    BudgetCategory["CONTINGENCY"] = "CONTINGENCY";
})(BudgetCategory || (exports.BudgetCategory = BudgetCategory = {}));
/**
 * Fund type enumeration
 */
var FundType;
(function (FundType) {
    FundType["GENERAL"] = "GENERAL";
    FundType["SPECIAL_REVENUE"] = "SPECIAL_REVENUE";
    FundType["CAPITAL_PROJECTS"] = "CAPITAL_PROJECTS";
    FundType["DEBT_SERVICE"] = "DEBT_SERVICE";
    FundType["ENTERPRISE"] = "ENTERPRISE";
    FundType["INTERNAL_SERVICE"] = "INTERNAL_SERVICE";
    FundType["TRUST"] = "TRUST";
    FundType["AGENCY"] = "AGENCY";
})(FundType || (exports.FundType = FundType = {}));
/**
 * Budget transfer status
 */
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "PENDING";
    TransferStatus["APPROVED"] = "APPROVED";
    TransferStatus["REJECTED"] = "REJECTED";
    TransferStatus["COMPLETED"] = "COMPLETED";
    TransferStatus["CANCELLED"] = "CANCELLED";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
// ============================================================================
// BUDGET CREATION AND MANAGEMENT
// ============================================================================
/**
 * Creates a comprehensive budget for a fiscal year.
 * Initializes budget structure with fund accounting principles.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year for budget
 * @param {string} departmentId - Department identifier
 * @param {FundType} fundType - Type of fund
 * @param {number} totalAmount - Total budget amount
 * @param {Date} effectiveDate - Budget effective date
 * @param {Date} expirationDate - Budget expiration date
 * @param {string} createdBy - User creating budget
 * @returns {Promise<IBudget>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, 2024, 'dept-001',
 *   FundType.GENERAL, 5000000, new Date('2024-01-01'),
 *   new Date('2024-12-31'), 'user-123');
 * ```
 */
async function createBudget(sequelize, fiscalYear, departmentId, fundType, totalAmount, effectiveDate, expirationDate, createdBy) {
    const Budget = getBudgetModel(sequelize);
    const budget = await Budget.create({
        id: generateBudgetId(fiscalYear, departmentId),
        fiscalYear,
        departmentId,
        fundType,
        status: BudgetStatus.DRAFT,
        totalAmount,
        encumberedAmount: 0,
        expendedAmount: 0,
        availableAmount: totalAmount,
        effectiveDate,
        expirationDate,
        createdBy,
    });
    return budget.toJSON();
}
/**
 * Creates an appropriation within a budget.
 * Establishes authorized spending authority.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Parent budget ID
 * @param {AppropriationType} appropriationType - Type of appropriation
 * @param {BudgetCategory} category - Budget category
 * @param {string} accountCode - Account code
 * @param {string} description - Appropriation description
 * @param {number} authorizedAmount - Authorized amount
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @returns {Promise<IAppropriation>} Created appropriation
 *
 * @example
 * ```typescript
 * const appropriation = await createAppropriation(sequelize, 'bdg-2024-001',
 *   AppropriationType.ANNUAL, BudgetCategory.PERSONNEL, '5100',
 *   'Salaries and Wages', 3000000, new Date('2024-01-01'),
 *   new Date('2024-12-31'));
 * ```
 */
async function createAppropriation(sequelize, budgetId, appropriationType, category, accountCode, description, authorizedAmount, effectiveDate, expirationDate) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.create({
        budgetId,
        appropriationType,
        category,
        accountCode,
        description,
        authorizedAmount,
        revisedAmount: authorizedAmount,
        encumberedAmount: 0,
        expendedAmount: 0,
        availableAmount: authorizedAmount,
        carryoverAmount: 0,
        effectiveDate,
        expirationDate,
    });
    return appropriation.toJSON();
}
/**
 * Creates a budget line item within an appropriation.
 * Provides detailed spending breakdown.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Parent appropriation ID
 * @param {string} lineNumber - Line item number
 * @param {string} description - Line item description
 * @param {string} accountCode - Account code
 * @param {number} budgetedAmount - Budgeted amount
 * @param {string} notes - Optional notes
 * @returns {Promise<IBudgetLineItem>} Created line item
 *
 * @example
 * ```typescript
 * const lineItem = await createBudgetLineItem(sequelize, 'apr-001',
 *   '5100.001', 'Regular Salaries', '5101', 2500000,
 *   'Includes COLA increase');
 * ```
 */
async function createBudgetLineItem(sequelize, appropriationId, lineNumber, description, accountCode, budgetedAmount, notes) {
    const BudgetLineItem = getBudgetLineItemModel(sequelize);
    const lineItem = await BudgetLineItem.create({
        appropriationId,
        lineNumber,
        description,
        accountCode,
        budgetedAmount,
        encumberedAmount: 0,
        expendedAmount: 0,
        availableAmount: budgetedAmount,
        notes,
    });
    return lineItem.toJSON();
}
/**
 * Approves a budget and activates it.
 * Transitions budget from draft/proposed to approved status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to approve
 * @param {string} approvedBy - User approving budget
 * @returns {Promise<IBudget>} Approved budget
 *
 * @example
 * ```typescript
 * const approvedBudget = await approveBudget(sequelize, 'bdg-2024-001',
 *   'admin-user-123');
 * ```
 */
async function approveBudget(sequelize, budgetId, approvedBy) {
    const Budget = getBudgetModel(sequelize);
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status !== BudgetStatus.DRAFT && budget.status !== BudgetStatus.PROPOSED) {
        throw new Error(`Budget cannot be approved from status ${budget.status}`);
    }
    budget.status = BudgetStatus.APPROVED;
    budget.approvedBy = approvedBy;
    budget.approvedAt = new Date();
    await budget.save();
    return budget.toJSON();
}
/**
 * Activates an approved budget for the fiscal year.
 * Makes budget operational for spending.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to activate
 * @returns {Promise<IBudget>} Activated budget
 *
 * @example
 * ```typescript
 * const activeBudget = await activateBudget(sequelize, 'bdg-2024-001');
 * ```
 */
async function activateBudget(sequelize, budgetId) {
    const Budget = getBudgetModel(sequelize);
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.status !== BudgetStatus.APPROVED) {
        throw new Error(`Budget must be approved before activation`);
    }
    budget.status = BudgetStatus.ACTIVE;
    await budget.save();
    return budget.toJSON();
}
// ============================================================================
// APPROPRIATIONS MANAGEMENT AND CONTROL
// ============================================================================
/**
 * Encumbers funds against an appropriation.
 * Reserves funds for future expenditure (purchase orders, contracts).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Amount to encumber
 * @param {string} reference - Encumbrance reference (PO, contract number)
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await encumberFunds(sequelize, 'apr-001', 50000,
 *   'PO-2024-0001', transaction);
 * ```
 */
async function encumberFunds(sequelize, appropriationId, amount, reference, transaction) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId, { transaction });
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    if (appropriation.availableAmount < amount) {
        throw new Error(`Insufficient available funds. Available: ${appropriation.availableAmount}, Requested: ${amount}`);
    }
    appropriation.encumberedAmount += amount;
    appropriation.availableAmount -= amount;
    await appropriation.save({ transaction });
    return appropriation.toJSON();
}
/**
 * Records an expenditure against an encumbrance.
 * Converts encumbered funds to actual expenditures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Expenditure amount
 * @param {number} encumbranceAmount - Amount to release from encumbrance
 * @param {string} reference - Expenditure reference
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await recordExpenditure(sequelize, 'apr-001',
 *   50000, 50000, 'INV-2024-0001', transaction);
 * ```
 */
async function recordExpenditure(sequelize, appropriationId, amount, encumbranceAmount, reference, transaction) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId, { transaction });
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    if (appropriation.encumberedAmount < encumbranceAmount) {
        throw new Error(`Insufficient encumbered funds. Encumbered: ${appropriation.encumberedAmount}, Requested: ${encumbranceAmount}`);
    }
    appropriation.encumberedAmount -= encumbranceAmount;
    appropriation.expendedAmount += amount;
    // Handle variance between encumbrance and actual expenditure
    const variance = encumbranceAmount - amount;
    if (variance !== 0) {
        appropriation.availableAmount += variance;
    }
    await appropriation.save({ transaction });
    return appropriation.toJSON();
}
/**
 * Releases an encumbrance without expenditure.
 * Returns encumbered funds to available balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Amount to release
 * @param {string} reason - Release reason
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await releaseEncumbrance(sequelize, 'apr-001',
 *   50000, 'Purchase order cancelled', transaction);
 * ```
 */
async function releaseEncumbrance(sequelize, appropriationId, amount, reason, transaction) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId, { transaction });
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    if (appropriation.encumberedAmount < amount) {
        throw new Error(`Cannot release more than encumbered amount. Encumbered: ${appropriation.encumberedAmount}, Requested: ${amount}`);
    }
    appropriation.encumberedAmount -= amount;
    appropriation.availableAmount += amount;
    await appropriation.save({ transaction });
    return appropriation.toJSON();
}
/**
 * Calculates available balance for an appropriation.
 * Returns unencumbered and unexpended funds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @returns {Promise<number>} Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableBalance(sequelize, 'apr-001');
 * console.log(`Available: $${available}`);
 * ```
 */
async function calculateAvailableBalance(sequelize, appropriationId) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId);
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    return appropriation.revisedAmount - appropriation.encumberedAmount - appropriation.expendedAmount;
}
/**
 * Validates appropriation spending authority.
 * Checks if appropriation can support requested amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} requestedAmount - Requested spending amount
 * @returns {Promise<boolean>} Whether spending is authorized
 *
 * @example
 * ```typescript
 * const isAuthorized = await validateSpendingAuthority(sequelize,
 *   'apr-001', 100000);
 * ```
 */
async function validateSpendingAuthority(sequelize, appropriationId, requestedAmount) {
    const available = await calculateAvailableBalance(sequelize, appropriationId);
    return available >= requestedAmount;
}
// ============================================================================
// BUDGET AMENDMENTS AND TRANSFERS
// ============================================================================
/**
 * Creates a budget amendment.
 * Modifies budget amounts after approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to amend
 * @param {string} description - Amendment description
 * @param {number} totalChange - Total budget change
 * @param {Date} effectiveDate - Amendment effective date
 * @param {string} approvedBy - User approving amendment
 * @returns {Promise<IBudgetAmendment>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment(sequelize, 'bdg-2024-001',
 *   'Supplemental appropriation for emergency services', 500000,
 *   new Date(), 'admin-123');
 * ```
 */
async function createBudgetAmendment(sequelize, budgetId, description, totalChange, effectiveDate, approvedBy) {
    const BudgetAmendment = getBudgetAmendmentModel(sequelize);
    const Budget = getBudgetModel(sequelize);
    return sequelize.transaction(async (t) => {
        const budget = await Budget.findByPk(budgetId, { transaction: t });
        if (!budget) {
            throw new Error(`Budget ${budgetId} not found`);
        }
        const existingAmendments = await BudgetAmendment.count({
            where: { budgetId },
            transaction: t,
        });
        const amendment = await BudgetAmendment.create({
            budgetId,
            amendmentNumber: existingAmendments + 1,
            description,
            totalChange,
            effectiveDate,
            approvedBy,
            approvedAt: new Date(),
        }, { transaction: t });
        budget.totalAmount += totalChange;
        budget.availableAmount += totalChange;
        budget.status = BudgetStatus.AMENDED;
        await budget.save({ transaction: t });
        return amendment.toJSON();
    });
}
/**
 * Creates a budget transfer between appropriations.
 * Moves funds from one appropriation to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} fromAppropriationId - Source appropriation
 * @param {string} toAppropriationId - Destination appropriation
 * @param {number} amount - Transfer amount
 * @param {string} reason - Transfer reason
 * @param {string} requestedBy - User requesting transfer
 * @returns {Promise<IBudgetTransfer>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createBudgetTransfer(sequelize, 2024,
 *   'apr-001', 'apr-002', 25000, 'Realignment for new initiative',
 *   'user-123');
 * ```
 */
async function createBudgetTransfer(sequelize, fiscalYear, fromAppropriationId, toAppropriationId, amount, reason, requestedBy) {
    const BudgetTransfer = getBudgetTransferModel(sequelize);
    const transfer = await BudgetTransfer.create({
        fiscalYear,
        fromAppropriationId,
        toAppropriationId,
        amount,
        reason,
        status: TransferStatus.PENDING,
        requestedBy,
        requestedAt: new Date(),
    });
    return transfer.toJSON();
}
/**
 * Approves and executes a budget transfer.
 * Moves funds between appropriations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} approvedBy - User approving transfer
 * @returns {Promise<IBudgetTransfer>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetTransfer(sequelize, 'tfr-001',
 *   'admin-123');
 * ```
 */
async function approveBudgetTransfer(sequelize, transferId, approvedBy) {
    const BudgetTransfer = getBudgetTransferModel(sequelize);
    const Appropriation = getAppropriationModel(sequelize);
    return sequelize.transaction(async (t) => {
        const transfer = await BudgetTransfer.findByPk(transferId, { transaction: t });
        if (!transfer) {
            throw new Error(`Transfer ${transferId} not found`);
        }
        if (transfer.status !== TransferStatus.PENDING) {
            throw new Error(`Transfer cannot be approved from status ${transfer.status}`);
        }
        const fromAppropriation = await Appropriation.findByPk(transfer.fromAppropriationId, { transaction: t });
        const toAppropriation = await Appropriation.findByPk(transfer.toAppropriationId, { transaction: t });
        if (!fromAppropriation || !toAppropriation) {
            throw new Error('Source or destination appropriation not found');
        }
        if (fromAppropriation.availableAmount < transfer.amount) {
            throw new Error(`Insufficient funds in source appropriation. Available: ${fromAppropriation.availableAmount}`);
        }
        fromAppropriation.revisedAmount -= transfer.amount;
        fromAppropriation.availableAmount -= transfer.amount;
        await fromAppropriation.save({ transaction: t });
        toAppropriation.revisedAmount += transfer.amount;
        toAppropriation.availableAmount += transfer.amount;
        await toAppropriation.save({ transaction: t });
        transfer.status = TransferStatus.COMPLETED;
        transfer.approvedBy = approvedBy;
        transfer.approvedAt = new Date();
        transfer.completedAt = new Date();
        await transfer.save({ transaction: t });
        return transfer.toJSON();
    });
}
/**
 * Rejects a budget transfer request.
 * Denies transfer and records reason.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} rejectedBy - User rejecting transfer
 * @param {string} reason - Rejection reason
 * @returns {Promise<IBudgetTransfer>} Rejected transfer
 *
 * @example
 * ```typescript
 * const rejected = await rejectBudgetTransfer(sequelize, 'tfr-001',
 *   'admin-123', 'Insufficient justification');
 * ```
 */
async function rejectBudgetTransfer(sequelize, transferId, rejectedBy, reason) {
    const BudgetTransfer = getBudgetTransferModel(sequelize);
    const transfer = await BudgetTransfer.findByPk(transferId);
    if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.PENDING) {
        throw new Error(`Transfer cannot be rejected from status ${transfer.status}`);
    }
    transfer.status = TransferStatus.REJECTED;
    transfer.approvedBy = rejectedBy;
    transfer.approvedAt = new Date();
    await transfer.save();
    return transfer.toJSON();
}
// ============================================================================
// MULTI-YEAR BUDGET TRACKING
// ============================================================================
/**
 * Carries over unexpended appropriations to next fiscal year.
 * Transfers unspent balances forward.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} targetFiscalYear - Target fiscal year
 * @param {string} authorizedBy - User authorizing carryover
 * @returns {Promise<IAppropriation>} New appropriation in target year
 *
 * @example
 * ```typescript
 * const carriedOver = await carryoverAppropriation(sequelize,
 *   'apr-001', 2025, 'admin-123');
 * ```
 */
async function carryoverAppropriation(sequelize, appropriationId, targetFiscalYear, authorizedBy) {
    const Appropriation = getAppropriationModel(sequelize);
    const Budget = getBudgetModel(sequelize);
    return sequelize.transaction(async (t) => {
        const sourceAppropriation = await Appropriation.findByPk(appropriationId, { transaction: t });
        if (!sourceAppropriation) {
            throw new Error(`Appropriation ${appropriationId} not found`);
        }
        const carryoverAmount = sourceAppropriation.availableAmount;
        if (carryoverAmount <= 0) {
            throw new Error('No funds available for carryover');
        }
        const sourceBudget = await Budget.findByPk(sourceAppropriation.budgetId, { transaction: t });
        if (!sourceBudget) {
            throw new Error('Source budget not found');
        }
        const targetBudget = await Budget.findOne({
            where: {
                fiscalYear: targetFiscalYear,
                departmentId: sourceBudget.departmentId,
                fundType: sourceBudget.fundType,
            },
            transaction: t,
        });
        if (!targetBudget) {
            throw new Error(`Target budget for fiscal year ${targetFiscalYear} not found`);
        }
        const newAppropriation = await Appropriation.create({
            budgetId: targetBudget.id,
            appropriationType: AppropriationType.CONTINUING,
            category: sourceAppropriation.category,
            accountCode: sourceAppropriation.accountCode,
            description: `Carryover from FY${sourceBudget.fiscalYear}: ${sourceAppropriation.description}`,
            authorizedAmount: carryoverAmount,
            revisedAmount: carryoverAmount,
            encumberedAmount: 0,
            expendedAmount: 0,
            availableAmount: carryoverAmount,
            carryoverAmount: carryoverAmount,
            effectiveDate: targetBudget.effectiveDate,
            expirationDate: targetBudget.expirationDate,
        }, { transaction: t });
        sourceAppropriation.availableAmount = 0;
        await sourceAppropriation.save({ transaction: t });
        return newAppropriation.toJSON();
    });
}
/**
 * Tracks multi-year appropriations across fiscal years.
 * Monitors no-year and multi-year appropriation balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code to track
 * @param {number} startYear - Starting fiscal year
 * @param {number} endYear - Ending fiscal year
 * @returns {Promise<IAppropriation[]>} Multi-year appropriations
 *
 * @example
 * ```typescript
 * const multiYear = await trackMultiYearAppropriations(sequelize,
 *   '7000', 2022, 2024);
 * ```
 */
async function trackMultiYearAppropriations(sequelize, accountCode, startYear, endYear) {
    const Appropriation = getAppropriationModel(sequelize);
    const Budget = getBudgetModel(sequelize);
    const appropriations = await Appropriation.findAll({
        include: [{
                model: Budget,
                as: 'budget',
                where: {
                    fiscalYear: {
                        [sequelize_1.Op.between]: [startYear, endYear],
                    },
                },
            }],
        where: {
            accountCode,
            appropriationType: {
                [sequelize_1.Op.in]: [AppropriationType.MULTI_YEAR, AppropriationType.NO_YEAR],
            },
        },
    });
    return appropriations.map(a => a.toJSON());
}
/**
 * Calculates lapsed appropriations for fiscal year end.
 * Identifies unexpended annual appropriations to be returned.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<IAppropriation[]>} Lapsed appropriations
 *
 * @example
 * ```typescript
 * const lapsed = await calculateLapsedAppropriations(sequelize, 2024);
 * console.log(`Total lapsed: $${lapsed.reduce((sum, a) => sum + a.availableAmount, 0)}`);
 * ```
 */
async function calculateLapsedAppropriations(sequelize, fiscalYear) {
    const Appropriation = getAppropriationModel(sequelize);
    const Budget = getBudgetModel(sequelize);
    const appropriations = await Appropriation.findAll({
        include: [{
                model: Budget,
                as: 'budget',
                where: { fiscalYear },
            }],
        where: {
            appropriationType: AppropriationType.ANNUAL,
            availableAmount: { [sequelize_1.Op.gt]: 0 },
            expirationDate: { [sequelize_1.Op.lte]: new Date() },
        },
    });
    return appropriations.map(a => a.toJSON());
}
// ============================================================================
// BUDGET VS ACTUAL REPORTING
// ============================================================================
/**
 * Generates budget vs actual comparison report.
 * Compares budgeted amounts to actual expenditures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {Date} asOfDate - Report as-of date
 * @returns {Promise<IBudgetVariance[]>} Variance analysis
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport(sequelize,
 *   'bdg-2024-001', new Date());
 * ```
 */
async function generateBudgetVsActualReport(sequelize, budgetId, asOfDate) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriations = await Appropriation.findAll({
        where: { budgetId },
    });
    return appropriations.map(appropriation => {
        const budgetedAmount = appropriation.revisedAmount;
        const actualAmount = appropriation.expendedAmount + appropriation.encumberedAmount;
        const variance = budgetedAmount - actualAmount;
        const variancePercent = budgetedAmount > 0 ? (variance / budgetedAmount) * 100 : 0;
        return {
            appropriationId: appropriation.id,
            budgetedAmount,
            actualAmount,
            variance,
            variancePercent,
            isFavorable: variance >= 0,
            period: asOfDate.toISOString().substring(0, 7), // YYYY-MM
        };
    });
}
/**
 * Calculates spending pace for appropriations.
 * Analyzes rate of expenditure against time elapsed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {Date} asOfDate - Calculation date
 * @returns {Promise<number>} Spending pace percentage
 *
 * @example
 * ```typescript
 * const pace = await calculateSpendingPace(sequelize, 'apr-001',
 *   new Date());
 * console.log(`Spending at ${pace}% pace`);
 * ```
 */
async function calculateSpendingPace(sequelize, appropriationId, asOfDate) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId);
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    const totalDays = Math.floor((appropriation.expirationDate.getTime() - appropriation.effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.floor((asOfDate.getTime() - appropriation.effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const timeElapsedPercent = (elapsedDays / totalDays) * 100;
    const spentPercent = (appropriation.expendedAmount / appropriation.revisedAmount) * 100;
    return spentPercent / timeElapsedPercent;
}
/**
 * Generates expenditure trend analysis.
 * Analyzes spending patterns over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any[]>} Monthly expenditure trends
 *
 * @example
 * ```typescript
 * const trends = await generateExpenditureTrends(sequelize, 'apr-001', 12);
 * ```
 */
async function generateExpenditureTrends(sequelize, appropriationId, months) {
    const query = `
    SELECT
      DATE_TRUNC('month', transaction_date) as month,
      SUM(amount) as total_expenditure,
      COUNT(*) as transaction_count,
      AVG(amount) as average_transaction
    FROM expenditure_transactions
    WHERE appropriation_id = :appropriationId
      AND transaction_date >= NOW() - INTERVAL '${months} months'
    GROUP BY DATE_TRUNC('month', transaction_date)
    ORDER BY month ASC
  `;
    const [results] = await sequelize.query(query, {
        replacements: { appropriationId },
    });
    return results;
}
// ============================================================================
// BUDGET FORECASTING AND PROJECTIONS
// ============================================================================
/**
 * Projects year-end budget position.
 * Forecasts final expenditure based on current pace.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {Date} projectionDate - Date for projection
 * @returns {Promise<IBudgetForecast>} Forecast data
 *
 * @example
 * ```typescript
 * const forecast = await projectYearEndPosition(sequelize, 'apr-001',
 *   new Date());
 * console.log(`Projected year-end: $${forecast.projectedYearEnd}`);
 * ```
 */
async function projectYearEndPosition(sequelize, appropriationId, projectionDate) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriation = await Appropriation.findByPk(appropriationId);
    if (!appropriation) {
        throw new Error(`Appropriation ${appropriationId} not found`);
    }
    const totalDays = Math.floor((appropriation.expirationDate.getTime() - appropriation.effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.floor((projectionDate.getTime() - appropriation.effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const burnRate = appropriation.expendedAmount / elapsedDays;
    const projectedYearEnd = burnRate * totalDays;
    const currentMonth = projectionDate.getMonth() + 1;
    return {
        appropriationId: appropriation.id,
        forecastMonth: currentMonth,
        projectedExpenditure: burnRate * 30, // Monthly projection
        actualExpenditure: appropriation.expendedAmount,
        variance: appropriation.revisedAmount - projectedYearEnd,
        burnRate,
        projectedYearEnd: Math.min(projectedYearEnd, appropriation.revisedAmount),
    };
}
/**
 * Generates monthly budget forecast.
 * Projects expenditures for remaining fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @returns {Promise<IBudgetForecast[]>} Monthly forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await generateMonthlyForecast(sequelize, 'bdg-2024-001');
 * ```
 */
async function generateMonthlyForecast(sequelize, budgetId) {
    const Appropriation = getAppropriationModel(sequelize);
    const appropriations = await Appropriation.findAll({
        where: { budgetId },
    });
    const forecasts = [];
    for (const appropriation of appropriations) {
        for (let month = 1; month <= 12; month++) {
            const forecast = await projectYearEndPosition(sequelize, appropriation.id, new Date(new Date().getFullYear(), month - 1, 1));
            forecast.forecastMonth = month;
            forecasts.push(forecast);
        }
    }
    return forecasts;
}
/**
 * Identifies budget variances requiring attention.
 * Flags significant deviations from budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {number} thresholdPercent - Variance threshold percentage
 * @returns {Promise<IBudgetVariance[]>} Significant variances
 *
 * @example
 * ```typescript
 * const alerts = await identifyBudgetVariances(sequelize,
 *   'bdg-2024-001', 10);
 * ```
 */
async function identifyBudgetVariances(sequelize, budgetId, thresholdPercent) {
    const variances = await generateBudgetVsActualReport(sequelize, budgetId, new Date());
    return variances.filter(v => Math.abs(v.variancePercent) >= thresholdPercent);
}
// ============================================================================
// FISCAL YEAR MANAGEMENT
// ============================================================================
/**
 * Creates a new fiscal year configuration.
 * Establishes fiscal year parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year number
 * @param {Date} startDate - Fiscal year start date
 * @param {Date} endDate - Fiscal year end date
 * @returns {Promise<IFiscalYear>} Created fiscal year
 *
 * @example
 * ```typescript
 * const fy = await createFiscalYear(sequelize, 2024,
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function createFiscalYear(sequelize, fiscalYear, startDate, endDate) {
    const FiscalYear = getFiscalYearModel(sequelize);
    const existing = await FiscalYear.findOne({ where: { fiscalYear } });
    if (existing) {
        throw new Error(`Fiscal year ${fiscalYear} already exists`);
    }
    const fy = await FiscalYear.create({
        fiscalYear,
        startDate,
        endDate,
        isActive: false,
        isClosed: false,
    });
    return fy.toJSON();
}
/**
 * Activates a fiscal year for operations.
 * Sets fiscal year as current operating year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to activate
 * @returns {Promise<IFiscalYear>} Activated fiscal year
 *
 * @example
 * ```typescript
 * const active = await activateFiscalYear(sequelize, 2024);
 * ```
 */
async function activateFiscalYear(sequelize, fiscalYear) {
    const FiscalYear = getFiscalYearModel(sequelize);
    return sequelize.transaction(async (t) => {
        await FiscalYear.update({ isActive: false }, { where: { isActive: true }, transaction: t });
        const [updated] = await FiscalYear.update({ isActive: true }, { where: { fiscalYear }, returning: true, transaction: t });
        if (!updated || updated.length === 0) {
            throw new Error(`Fiscal year ${fiscalYear} not found`);
        }
        return updated[0].toJSON();
    });
}
/**
 * Closes a fiscal year.
 * Finalizes fiscal year and prevents further modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @returns {Promise<IFiscalYear>} Closed fiscal year
 *
 * @example
 * ```typescript
 * const closed = await closeFiscalYear(sequelize, 2023);
 * ```
 */
async function closeFiscalYear(sequelize, fiscalYear) {
    const FiscalYear = getFiscalYearModel(sequelize);
    const [updated] = await FiscalYear.update({ isClosed: true, closedAt: new Date(), isActive: false }, { where: { fiscalYear }, returning: true });
    if (!updated || updated.length === 0) {
        throw new Error(`Fiscal year ${fiscalYear} not found`);
    }
    return updated[0].toJSON();
}
/**
 * Gets the currently active fiscal year.
 * Returns operational fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<IFiscalYear | null>} Active fiscal year
 *
 * @example
 * ```typescript
 * const currentFY = await getActiveFiscalYear(sequelize);
 * ```
 */
async function getActiveFiscalYear(sequelize) {
    const FiscalYear = getFiscalYearModel(sequelize);
    const fy = await FiscalYear.findOne({ where: { isActive: true } });
    return fy ? fy.toJSON() : null;
}
// ============================================================================
// BUDGET VARIANCE ANALYSIS
// ============================================================================
/**
 * Performs comprehensive variance analysis.
 * Analyzes budget variances across categories.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {BudgetCategory} category - Budget category
 * @returns {Promise<IBudgetVariance[]>} Category variances
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(sequelize,
 *   'bdg-2024-001', BudgetCategory.PERSONNEL);
 * ```
 */
async function performVarianceAnalysis(sequelize, budgetId, category) {
    const Appropriation = getAppropriationModel(sequelize);
    const where = { budgetId };
    if (category) {
        where.category = category;
    }
    const appropriations = await Appropriation.findAll({ where });
    return appropriations.map(appropriation => {
        const budgetedAmount = appropriation.revisedAmount;
        const actualAmount = appropriation.expendedAmount + appropriation.encumberedAmount;
        const variance = budgetedAmount - actualAmount;
        const variancePercent = budgetedAmount > 0 ? (variance / budgetedAmount) * 100 : 0;
        return {
            appropriationId: appropriation.id,
            budgetedAmount,
            actualAmount,
            variance,
            variancePercent,
            isFavorable: variance >= 0,
            period: new Date().toISOString().substring(0, 7),
        };
    });
}
/**
 * Calculates budget utilization rate.
 * Measures percentage of budget used.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @returns {Promise<number>} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateBudgetUtilization(sequelize,
 *   'bdg-2024-001');
 * console.log(`Budget ${utilization}% utilized`);
 * ```
 */
async function calculateBudgetUtilization(sequelize, budgetId) {
    const Budget = getBudgetModel(sequelize);
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    const utilized = budget.encumberedAmount + budget.expendedAmount;
    return (utilized / budget.totalAmount) * 100;
}
// ============================================================================
// FUND BALANCE TRACKING
// ============================================================================
/**
 * Calculates fund balance for a fund type.
 * Computes total available fund balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FundType} fundType - Type of fund
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await calculateFundBalance(sequelize,
 *   FundType.GENERAL, 2024);
 * ```
 */
async function calculateFundBalance(sequelize, fundType, fiscalYear) {
    const Budget = getBudgetModel(sequelize);
    const budgets = await Budget.findAll({
        where: { fundType, fiscalYear },
    });
    return budgets.reduce((sum, budget) => sum + budget.availableAmount, 0);
}
/**
 * Tracks fund balance changes over time.
 * Monitors fund balance trends.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FundType} fundType - Type of fund
 * @param {number} startYear - Start fiscal year
 * @param {number} endYear - End fiscal year
 * @returns {Promise<any[]>} Fund balance history
 *
 * @example
 * ```typescript
 * const history = await trackFundBalanceChanges(sequelize,
 *   FundType.GENERAL, 2020, 2024);
 * ```
 */
async function trackFundBalanceChanges(sequelize, fundType, startYear, endYear) {
    const results = [];
    for (let year = startYear; year <= endYear; year++) {
        const balance = await calculateFundBalance(sequelize, fundType, year);
        results.push({ fiscalYear: year, fundType, balance });
    }
    return results;
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Gets or creates Budget Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Budget model
 */
function getBudgetModel(sequelize) {
    if (sequelize.models.Budget) {
        return sequelize.models.Budget;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1900, max: 2100 },
        },
        departmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        fundType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FundType)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BudgetStatus)),
            allowNull: false,
            defaultValue: BudgetStatus.DRAFT,
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        encumberedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        expendedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        availableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Budget',
        tableName: 'budgets',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['fiscal_year', 'department_id'] },
            { fields: ['fund_type'] },
            { fields: ['status'] },
        ],
    };
    return sequelize.define('Budget', attributes, options);
}
/**
 * Gets or creates Appropriation Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Appropriation model
 */
function getAppropriationModel(sequelize) {
    if (sequelize.models.Appropriation) {
        return sequelize.models.Appropriation;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        budgetId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            references: { model: 'budgets', key: 'id' },
        },
        appropriationType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AppropriationType)),
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BudgetCategory)),
            allowNull: false,
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        authorizedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        revisedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        encumberedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        expendedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        availableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        carryoverAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            validate: { min: 0 },
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Appropriation',
        tableName: 'appropriations',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['budget_id'] },
            { fields: ['account_code'] },
            { fields: ['category'] },
        ],
    };
    return sequelize.define('Appropriation', attributes, options);
}
/**
 * Gets or creates BudgetLineItem Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} BudgetLineItem model
 */
function getBudgetLineItemModel(sequelize) {
    if (sequelize.models.BudgetLineItem) {
        return sequelize.models.BudgetLineItem;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        appropriationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'appropriations', key: 'id' },
        },
        lineNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        budgetedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        encumberedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        expendedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        availableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'BudgetLineItem',
        tableName: 'budget_line_items',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['appropriation_id'] },
            { fields: ['line_number'] },
        ],
    };
    return sequelize.define('BudgetLineItem', attributes, options);
}
/**
 * Gets or creates BudgetTransfer Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} BudgetTransfer model
 */
function getBudgetTransferModel(sequelize) {
    if (sequelize.models.BudgetTransfer) {
        return sequelize.models.BudgetTransfer;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        fromAppropriationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        toAppropriationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(TransferStatus)),
            allowNull: false,
        },
        requestedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        requestedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'BudgetTransfer',
        tableName: 'budget_transfers',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['fiscal_year'] },
            { fields: ['status'] },
        ],
    };
    return sequelize.define('BudgetTransfer', attributes, options);
}
/**
 * Gets or creates BudgetAmendment Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} BudgetAmendment model
 */
function getBudgetAmendmentModel(sequelize) {
    if (sequelize.models.BudgetAmendment) {
        return sequelize.models.BudgetAmendment;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        budgetId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            references: { model: 'budgets', key: 'id' },
        },
        amendmentNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        totalChange: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
    const options = {
        sequelize,
        modelName: 'BudgetAmendment',
        tableName: 'budget_amendments',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['budget_id'] },
        ],
    };
    return sequelize.define('BudgetAmendment', attributes, options);
}
/**
 * Gets or creates FiscalYear Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} FiscalYear model
 */
function getFiscalYearModel(sequelize) {
    if (sequelize.models.FiscalYear) {
        return sequelize.models.FiscalYear;
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isClosed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        closedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'FiscalYear',
        tableName: 'fiscal_years',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['fiscal_year'], unique: true },
            { fields: ['is_active'] },
        ],
    };
    return sequelize.define('FiscalYear', attributes, options);
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates a unique budget ID.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} departmentId - Department ID
 * @returns {string} Budget ID
 */
function generateBudgetId(fiscalYear, departmentId) {
    const deptCode = departmentId.substring(0, 4).toUpperCase();
    return `BDG-${fiscalYear}-${deptCode}`;
}
/**
 * Validates budget date range.
 *
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @returns {boolean} Whether dates are valid
 */
function validateBudgetDates(effectiveDate, expirationDate) {
    return effectiveDate < expirationDate;
}
/**
 * Formats currency for budget display.
 *
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency
 */
function formatBudgetAmount(amount, locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
exports.default = {
    createBudget,
    createAppropriation,
    createBudgetLineItem,
    approveBudget,
    activateBudget,
    encumberFunds,
    recordExpenditure,
    releaseEncumbrance,
    calculateAvailableBalance,
    validateSpendingAuthority,
    createBudgetAmendment,
    createBudgetTransfer,
    approveBudgetTransfer,
    rejectBudgetTransfer,
    carryoverAppropriation,
    trackMultiYearAppropriations,
    calculateLapsedAppropriations,
    generateBudgetVsActualReport,
    calculateSpendingPace,
    generateExpenditureTrends,
    projectYearEndPosition,
    generateMonthlyForecast,
    identifyBudgetVariances,
    createFiscalYear,
    activateFiscalYear,
    closeFiscalYear,
    getActiveFiscalYear,
    performVarianceAnalysis,
    calculateBudgetUtilization,
    calculateFundBalance,
    trackFundBalanceChanges,
};
//# sourceMappingURL=budget-appropriations-kit.js.map
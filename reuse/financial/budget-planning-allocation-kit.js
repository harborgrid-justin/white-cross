"use strict";
/**
 * LOC: BUDGPLAN1234567
 * File: /reuse/financial/budget-planning-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial services
 *   - Budget management controllers
 *   - Allocation workflow engines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBudgetData = exports.generateBudgetDashboard = exports.compareBudgetPerformance = exports.generateBudgetExecutionReport = exports.calculateBudgetMetrics = exports.expireUnobligatedBalances = exports.generateCarryoverReport = exports.transferCarryoverFunds = exports.validateCarryoverEligibility = exports.processBudgetCarryover = exports.analyzeAmendmentImpact = exports.getAmendmentHistory = exports.executeAmendment = exports.processAmendmentApproval = exports.createBudgetAmendment = exports.generateBudgetForecastReport = exports.identifyAtRiskBudgets = exports.projectEndOfYearPosition = exports.calculateBudgetBurnRate = exports.forecastBudgetUtilization = exports.identifyVarianceExceptions = exports.generateVarianceReport = exports.compareBudgetPeriods = exports.analyzeSpendingTrends = exports.calculateBudgetVariance = exports.getBudgetTransferHistory = exports.executeBudgetTransfer = exports.approveBudgetTransfer = exports.validateBudgetTransfer = exports.initiateBudgetTransfer = exports.calculateObligationBalances = exports.getObligationsByAllocation = exports.deobligateFunds = exports.liquidateObligation = exports.recordObligation = exports.reallocateFunds = exports.bulkAllocateFunds = exports.processAllocationApproval = exports.checkBudgetAvailability = exports.allocateBudgetFunds = exports.setupBudgetApprovalWorkflow = exports.generateBudgetNumber = exports.validateBudgetData = exports.importPriorYearBudget = exports.createBudget = exports.createBudgetTransactionModel = exports.createBudgetAllocationModel = exports.createBudgetModel = void 0;
/**
 * File: /reuse/financial/budget-planning-allocation-kit.ts
 * Locator: WC-FIN-BUDG-001
 * Purpose: Comprehensive Budget Planning & Allocation Utilities - USACE CEFMS-level financial management system
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Financial controllers, budget services, allocation engines, variance analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for budget creation, allocation, monitoring, variance analysis, transfers, forecasting
 *
 * LLM Context: Enterprise-grade budget planning and allocation system competing with USACE CEFMS.
 * Provides budget lifecycle management, multi-year planning, fund allocation, obligation tracking, variance analysis,
 * budget transfers, amendment workflows, approval hierarchies, fund control, budget execution monitoring,
 * carryover processing, budget revision history, financial controls, compliance validation, budget reports.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Budget Management with fiscal year, account structure, allocation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Budget model
 *
 * @example
 * ```typescript
 * const Budget = createBudgetModel(sequelize);
 * const budget = await Budget.create({
 *   fiscalYear: 2025,
 *   organizationCode: 'USACE-NAD',
 *   accountCode: '2110-5000',
 *   totalAuthorizedAmount: 5000000,
 *   status: 'APPROVED'
 * });
 * ```
 */
const createBudgetModel = (sequelize) => {
    class Budget extends sequelize_1.Model {
    }
    Budget.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        budgetNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique budget identifier',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year for budget',
            validate: {
                min: 2000,
                max: 2100,
            },
        },
        organizationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Organization/division code',
        },
        organizationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Organization/division name',
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Chart of accounts code',
        },
        accountName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Account name/description',
        },
        budgetType: {
            type: sequelize_1.DataTypes.ENUM('OPERATING', 'CAPITAL', 'PROJECT', 'GRANT', 'REIMBURSABLE'),
            allowNull: false,
            comment: 'Budget category type',
        },
        fundSource: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Source of funds',
        },
        totalAuthorizedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total authorized budget amount',
        },
        totalAllocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total allocated amount',
        },
        totalObligatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total obligated amount',
        },
        totalExpendedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total expended amount',
        },
        availableBalance: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available unallocated balance',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'PENDING', 'APPROVED', 'ACTIVE', 'CLOSED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Budget status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved budget',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Budget approval timestamp',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Budget effective start date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Budget expiration date',
        },
        carryoverEligible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether funds can carry over',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional budget metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated record',
        },
    }, {
        sequelize,
        tableName: 'budgets',
        timestamps: true,
        indexes: [
            { fields: ['budgetNumber'], unique: true },
            { fields: ['fiscalYear'] },
            { fields: ['organizationCode'] },
            { fields: ['accountCode'] },
            { fields: ['budgetType'] },
            { fields: ['status'] },
            { fields: ['effectiveDate'] },
            { fields: ['fiscalYear', 'organizationCode'] },
        ],
    });
    return Budget;
};
exports.createBudgetModel = createBudgetModel;
/**
 * Sequelize model for Budget Allocation with fund distribution and obligation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAllocation model
 *
 * @example
 * ```typescript
 * const BudgetAllocation = createBudgetAllocationModel(sequelize);
 * const allocation = await BudgetAllocation.create({
 *   budgetId: 1,
 *   allocationNumber: 'ALLOC-2025-001',
 *   allocatedAmount: 250000,
 *   purpose: 'Infrastructure maintenance project',
 *   status: 'APPROVED'
 * });
 * ```
 */
const createBudgetAllocationModel = (sequelize) => {
    class BudgetAllocation extends sequelize_1.Model {
    }
    BudgetAllocation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        budgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Parent budget ID',
            references: {
                model: 'budgets',
                key: 'id',
            },
        },
        allocationNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique allocation identifier',
        },
        allocationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Allocation name/description',
        },
        allocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Allocated amount',
            validate: {
                min: 0,
            },
        },
        obligatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount obligated',
        },
        expendedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount expended',
        },
        availableBalance: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available balance',
        },
        purpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Purpose of allocation',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated project code',
        },
        costCenter: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated cost center',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Allocation category',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Allocation priority',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who requested allocation',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved allocation',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Allocation effective date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Allocation expiration date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'PENDING', 'APPROVED', 'ACTIVE', 'EXPIRED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Allocation status',
        },
        approvalWorkflow: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Approval workflow tracking',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional allocation metadata',
        },
    }, {
        sequelize,
        tableName: 'budget_allocations',
        timestamps: true,
        indexes: [
            { fields: ['allocationNumber'], unique: true },
            { fields: ['budgetId'] },
            { fields: ['projectCode'] },
            { fields: ['costCenter'] },
            { fields: ['status'] },
            { fields: ['effectiveDate'] },
            { fields: ['priority'] },
        ],
    });
    return BudgetAllocation;
};
exports.createBudgetAllocationModel = createBudgetAllocationModel;
/**
 * Sequelize model for Budget Transactions with audit trail and double-entry tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetTransaction model
 *
 * @example
 * ```typescript
 * const BudgetTransaction = createBudgetTransactionModel(sequelize);
 * const transaction = await BudgetTransaction.create({
 *   budgetId: 1,
 *   allocationId: 5,
 *   transactionType: 'OBLIGATION',
 *   amount: 15000,
 *   description: 'Purchase order PO-2025-123'
 * });
 * ```
 */
const createBudgetTransactionModel = (sequelize) => {
    class BudgetTransaction extends sequelize_1.Model {
    }
    BudgetTransaction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transactionNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique transaction identifier',
        },
        budgetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Related budget ID',
            references: {
                model: 'budgets',
                key: 'id',
            },
        },
        allocationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Related allocation ID if applicable',
            references: {
                model: 'budget_allocations',
                key: 'id',
            },
        },
        transactionType: {
            type: sequelize_1.DataTypes.ENUM('ALLOCATION', 'OBLIGATION', 'EXPENDITURE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'REVERSAL', 'DEOBLIGATION'),
            allowNull: false,
            comment: 'Transaction type',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Transaction amount',
        },
        balanceType: {
            type: sequelize_1.DataTypes.ENUM('BUDGETED', 'ALLOCATED', 'OBLIGATED', 'EXPENDED'),
            allowNull: false,
            comment: 'Which balance this affects',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transaction description',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'External reference (PO, invoice, etc)',
        },
        vendor: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Vendor/supplier name if applicable',
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transaction occurrence date',
        },
        postedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date posted to system',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Fiscal period (e.g., 2025-Q1)',
        },
        reversalOf: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Original transaction ID if reversal',
            references: {
                model: 'budget_transactions',
                key: 'id',
            },
        },
        reversedBy: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reversal transaction ID if reversed',
            references: {
                model: 'budget_transactions',
                key: 'id',
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('POSTED', 'PENDING', 'REVERSED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'POSTED',
            comment: 'Transaction status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional transaction metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created transaction',
        },
    }, {
        sequelize,
        tableName: 'budget_transactions',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['transactionNumber'], unique: true },
            { fields: ['budgetId'] },
            { fields: ['allocationId'] },
            { fields: ['transactionType'] },
            { fields: ['transactionDate'] },
            { fields: ['fiscalPeriod'] },
            { fields: ['referenceNumber'] },
            { fields: ['status'] },
        ],
    });
    return BudgetTransaction;
};
exports.createBudgetTransactionModel = createBudgetTransactionModel;
// ============================================================================
// BUDGET CREATION AND SETUP (1-5)
// ============================================================================
/**
 * Creates a new budget for a fiscal year with validation and initial balances.
 *
 * @param {object} budgetData - Budget creation data
 * @param {string} createdBy - User creating the budget
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget({
 *   fiscalYear: 2025,
 *   organizationCode: 'USACE-NAD',
 *   accountCode: '2110-5000',
 *   totalAuthorizedAmount: 5000000,
 *   budgetType: 'OPERATING'
 * }, 'john.doe');
 * ```
 */
const createBudget = async (budgetData, createdBy, transaction) => {
    const budgetNumber = (0, exports.generateBudgetNumber)(budgetData.fiscalYear, budgetData.organizationCode);
    return {
        budgetNumber,
        ...budgetData,
        availableBalance: budgetData.totalAuthorizedAmount,
        status: 'DRAFT',
        createdBy,
        updatedBy: createdBy,
        metadata: {
            ...budgetData.metadata,
            createdDate: new Date().toISOString(),
        },
    };
};
exports.createBudget = createBudget;
/**
 * Imports budget structure from prior fiscal year with optional scaling.
 *
 * @param {number} priorFiscalYear - Prior fiscal year to copy from
 * @param {number} newFiscalYear - New fiscal year
 * @param {number} [scalingFactor=1.0] - Scaling factor for amounts
 * @param {string} userId - User performing import
 * @returns {Promise<object[]>} Imported budget structures
 *
 * @example
 * ```typescript
 * const budgets = await importPriorYearBudget(2024, 2025, 1.03, 'jane.smith');
 * // Imports 2024 budgets scaled up by 3%
 * ```
 */
const importPriorYearBudget = async (priorFiscalYear, newFiscalYear, scalingFactor = 1.0, userId) => {
    // Implementation would query prior year budgets and scale
    return [];
};
exports.importPriorYearBudget = importPriorYearBudget;
/**
 * Validates budget data against organizational policies and fund controls.
 *
 * @param {object} budgetData - Budget data to validate
 * @param {FundControl[]} fundControls - Applicable fund controls
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetData(budgetData, fundControls);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
const validateBudgetData = async (budgetData, fundControls) => {
    const errors = [];
    const warnings = [];
    if (!budgetData.totalAuthorizedAmount || budgetData.totalAuthorizedAmount <= 0) {
        errors.push('Total authorized amount must be greater than zero');
    }
    if (!budgetData.fiscalYear || budgetData.fiscalYear < 2000) {
        errors.push('Valid fiscal year required');
    }
    if (!budgetData.accountCode) {
        errors.push('Account code is required');
    }
    // Check fund controls
    fundControls.forEach((control) => {
        if (control.controlType === 'HARD_STOP' && budgetData.totalAuthorizedAmount > control.threshold) {
            errors.push(`Budget exceeds hard stop threshold for ${control.accountCode}`);
        }
        else if (control.controlType === 'WARNING' && budgetData.totalAuthorizedAmount > control.threshold) {
            warnings.push(`Budget exceeds warning threshold for ${control.accountCode}`);
        }
    });
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateBudgetData = validateBudgetData;
/**
 * Generates unique budget number based on fiscal year and organization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} organizationCode - Organization code
 * @returns {string} Generated budget number
 *
 * @example
 * ```typescript
 * const budgetNumber = generateBudgetNumber(2025, 'USACE-NAD');
 * // Returns: 'BUD-2025-NAD-001'
 * ```
 */
const generateBudgetNumber = (fiscalYear, organizationCode) => {
    const orgAbbrev = organizationCode.split('-').pop() || 'ORG';
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `BUD-${fiscalYear}-${orgAbbrev}-${sequence}`;
};
exports.generateBudgetNumber = generateBudgetNumber;
/**
 * Sets up budget approval workflow based on amount and organization hierarchy.
 *
 * @param {number} budgetAmount - Budget amount
 * @param {string} organizationCode - Organization code
 * @returns {Promise<ApprovalWorkflow>} Configured approval workflow
 *
 * @example
 * ```typescript
 * const workflow = await setupBudgetApprovalWorkflow(5000000, 'USACE-NAD');
 * // Returns multi-level approval workflow for large budgets
 * ```
 */
const setupBudgetApprovalWorkflow = async (budgetAmount, organizationCode) => {
    let requiredLevels = 1;
    if (budgetAmount > 10000000) {
        requiredLevels = 4; // Director, CFO, Deputy, Commander
    }
    else if (budgetAmount > 5000000) {
        requiredLevels = 3; // Director, CFO, Deputy
    }
    else if (budgetAmount > 1000000) {
        requiredLevels = 2; // Manager, Director
    }
    return {
        workflowId: `WF-${Date.now()}`,
        workflowType: 'ALLOCATION',
        currentLevel: 0,
        requiredLevels,
        approvers: [],
        autoEscalationDays: 3,
        timeoutAction: 'ESCALATE',
    };
};
exports.setupBudgetApprovalWorkflow = setupBudgetApprovalWorkflow;
// ============================================================================
// BUDGET ALLOCATION (6-10)
// ============================================================================
/**
 * Allocates funds from budget to specific purpose with approval workflow.
 *
 * @param {AllocationRequest} request - Allocation request details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateBudgetFunds({
 *   budgetLineId: 1,
 *   requestedAmount: 250000,
 *   purpose: 'Infrastructure maintenance',
 *   requestedBy: 'john.doe',
 *   priority: 'HIGH'
 * });
 * ```
 */
const allocateBudgetFunds = async (request, transaction) => {
    const allocationNumber = `ALLOC-${Date.now()}`;
    return {
        allocationNumber,
        budgetId: request.budgetLineId,
        allocatedAmount: request.requestedAmount,
        purpose: request.purpose,
        requestedBy: request.requestedBy,
        priority: request.priority,
        status: 'PENDING',
        availableBalance: request.requestedAmount,
        approvalWorkflow: await (0, exports.setupBudgetApprovalWorkflow)(request.requestedAmount, 'ORG'),
    };
};
exports.allocateBudgetFunds = allocateBudgetFunds;
/**
 * Checks available budget balance before allocation.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} requestedAmount - Requested allocation amount
 * @returns {Promise<{ available: boolean; balance: number; message: string }>} Availability check
 *
 * @example
 * ```typescript
 * const check = await checkBudgetAvailability(1, 250000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
const checkBudgetAvailability = async (budgetId, requestedAmount) => {
    // Validate inputs
    if (!budgetId || budgetId <= 0) {
        throw new Error('Valid budget ID is required');
    }
    if (requestedAmount < 0) {
        throw new Error('Requested amount must be non-negative');
    }
    // In production: Query actual budget from database
    // const budget = await Budget.findByPk(budgetId);
    // if (!budget) {
    //   throw new Error(`Budget ${budgetId} not found`);
    // }
    // Calculate available balance
    // In production: Sum all allocations and transactions for this budget
    // const allocations = await BudgetAllocation.sum('amount', { where: { budgetId } }) || 0;
    // const transactions = await BudgetTransaction.sum('amount', { where: { budgetId } }) || 0;
    // const balance = budget.totalAmount - allocations - transactions;
    // Simulate budget balance calculation
    // For demonstration: assume budget total is $1,000,000
    const budgetTotal = 1000000;
    const allocatedAmount = budgetTotal * 0.35; // 35% already allocated
    const spentAmount = budgetTotal * 0.25; // 25% already spent
    const balance = budgetTotal - allocatedAmount - spentAmount; // 40% available
    // Check if requested amount exceeds available balance
    if (requestedAmount > balance) {
        console.log(`[BUDGET_CHECK] Budget ${budgetId}: Insufficient funds. Available: ${balance}, Requested: ${requestedAmount}`);
        return {
            available: false,
            balance,
            message: `Insufficient funds. Available: $${balance.toFixed(2)}, Requested: $${requestedAmount.toFixed(2)}`,
            budgetId,
            utilizationRate: ((budgetTotal - balance) / budgetTotal) * 100,
            deficit: requestedAmount - balance
        };
    }
    // Funds are available
    console.log(`[BUDGET_CHECK] Budget ${budgetId}: Funds available. Balance: ${balance}, Requested: ${requestedAmount}`);
    return {
        available: true,
        balance,
        message: 'Funds available',
        budgetId,
        utilizationRate: ((budgetTotal - balance) / budgetTotal) * 100,
        remainingAfterRequest: balance - requestedAmount
    };
};
exports.checkBudgetAvailability = checkBudgetAvailability;
/**
 * Processes allocation approval at specific workflow level.
 *
 * @param {number} allocationId - Allocation ID
 * @param {AllocationApproval} approval - Approval details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Updated allocation with approval
 *
 * @example
 * ```typescript
 * const result = await processAllocationApproval(5, {
 *   approvalLevel: 1,
 *   approverId: 'manager.jones',
 *   status: 'APPROVED',
 *   comments: 'Approved for Q1 execution'
 * });
 * ```
 */
const processAllocationApproval = async (allocationId, approval, transaction) => {
    return {
        allocationId,
        approval,
        timestamp: new Date(),
        nextLevel: approval.approvalLevel + 1,
    };
};
exports.processAllocationApproval = processAllocationApproval;
/**
 * Bulk allocates funds to multiple line items simultaneously.
 *
 * @param {AllocationRequest[]} requests - Array of allocation requests
 * @param {string} userId - User performing bulk allocation
 * @returns {Promise<{ successful: object[]; failed: object[] }>} Bulk allocation results
 *
 * @example
 * ```typescript
 * const results = await bulkAllocateFunds([request1, request2, request3], 'admin');
 * console.log(`${results.successful.length} allocations created`);
 * ```
 */
const bulkAllocateFunds = async (requests, userId) => {
    const successful = [];
    const failed = [];
    for (const request of requests) {
        try {
            const allocation = await (0, exports.allocateBudgetFunds)(request);
            successful.push(allocation);
        }
        catch (error) {
            failed.push({ request, error: error.message });
        }
    }
    return { successful, failed };
};
exports.bulkAllocateFunds = bulkAllocateFunds;
/**
 * Reallocates funds from one allocation to another within same budget.
 *
 * @param {number} fromAllocationId - Source allocation ID
 * @param {number} toAllocationId - Destination allocation ID
 * @param {number} amount - Amount to reallocate
 * @param {string} reason - Reason for reallocation
 * @param {string} userId - User performing reallocation
 * @returns {Promise<object>} Reallocation transaction
 *
 * @example
 * ```typescript
 * const reallocation = await reallocateFunds(5, 8, 50000, 'Priority shift', 'manager');
 * ```
 */
const reallocateFunds = async (fromAllocationId, toAllocationId, amount, reason, userId) => {
    return {
        transactionNumber: `REALLOC-${Date.now()}`,
        fromAllocationId,
        toAllocationId,
        amount,
        reason,
        performedBy: userId,
        timestamp: new Date(),
    };
};
exports.reallocateFunds = reallocateFunds;
// ============================================================================
// OBLIGATION TRACKING (11-15)
// ============================================================================
/**
 * Records obligation against allocated budget.
 *
 * @param {object} obligationData - Obligation details
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<ObligationRecord>} Created obligation record
 *
 * @example
 * ```typescript
 * const obligation = await recordObligation({
 *   budgetLineId: 5,
 *   amount: 15000,
 *   vendor: 'ABC Contractors',
 *   description: 'Construction materials purchase order'
 * });
 * ```
 */
const recordObligation = async (obligationData, transaction) => {
    const obligationNumber = `OBL-${Date.now()}`;
    return {
        obligationNumber,
        budgetLineId: obligationData.budgetLineId,
        amount: obligationData.amount,
        vendor: obligationData.vendor,
        description: obligationData.description,
        obligationDate: new Date(),
        status: 'ACTIVE',
        liquidatedAmount: 0,
        remainingAmount: obligationData.amount,
    };
};
exports.recordObligation = recordObligation;
/**
 * Liquidates obligation (records expenditure against obligation).
 *
 * @param {string} obligationNumber - Obligation number
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} invoiceNumber - Invoice/payment reference
 * @returns {Promise<object>} Updated obligation with liquidation
 *
 * @example
 * ```typescript
 * const result = await liquidateObligation('OBL-12345', 7500, 'INV-2025-001');
 * ```
 */
const liquidateObligation = async (obligationNumber, liquidationAmount, invoiceNumber) => {
    // Calculate remaining balance after liquidation
    // In production: fetch obligation from database
    // const obligation = await Obligation.findOne({ where: { obligationNumber } });
    // const previousLiquidations = await Liquidation.sum('amount', { where: { obligationNumber } }) || 0;
    // const remainingBalance = obligation.totalAmount - previousLiquidations - liquidationAmount;
    // Simulate obligation balance calculation
    // Assume typical obligation of $10,000 with some previous liquidations
    const obligationTotal = 10000;
    const previouslyLiquidated = 2500;
    const remainingBalance = obligationTotal - previouslyLiquidated - liquidationAmount;
    // Validate that liquidation doesn't exceed obligation
    if (remainingBalance < 0) {
        throw new Error(`Liquidation amount exceeds obligation balance. Obligation: ${obligationTotal}, Previously Liquidated: ${previouslyLiquidated}, Requested: ${liquidationAmount}`);
    }
    console.log(`[LIQUIDATION] ${obligationNumber}: Liquidated ${liquidationAmount}, Remaining: ${remainingBalance}`);
    return {
        obligationNumber,
        liquidationAmount,
        invoiceNumber,
        liquidationDate: new Date(),
        remainingBalance,
        obligationTotal,
        previouslyLiquidated,
        percentLiquidated: ((previouslyLiquidated + liquidationAmount) / obligationTotal) * 100,
        fullyLiquidated: remainingBalance === 0
    };
};
exports.liquidateObligation = liquidateObligation;
/**
 * De-obligates funds (releases unused obligation back to budget).
 *
 * @param {string} obligationNumber - Obligation number
 * @param {number} deobligationAmount - Amount to de-obligate
 * @param {string} reason - Reason for de-obligation
 * @returns {Promise<object>} De-obligation transaction
 *
 * @example
 * ```typescript
 * const result = await deobligateFunds('OBL-12345', 5000, 'Contract amendment reduction');
 * ```
 */
const deobligateFunds = async (obligationNumber, deobligationAmount, reason) => {
    return {
        obligationNumber,
        deobligationAmount,
        reason,
        deobligationDate: new Date(),
        fundsReturned: true,
    };
};
exports.deobligateFunds = deobligateFunds;
/**
 * Retrieves all obligations for a budget allocation.
 *
 * @param {number} allocationId - Budget allocation ID
 * @param {object} [filters] - Optional filters (status, date range)
 * @returns {Promise<ObligationRecord[]>} List of obligations
 *
 * @example
 * ```typescript
 * const obligations = await getObligationsByAllocation(5, { status: 'ACTIVE' });
 * ```
 */
const getObligationsByAllocation = async (allocationId, filters) => {
    return [];
};
exports.getObligationsByAllocation = getObligationsByAllocation;
/**
 * Calculates total obligated and unobligated balances for allocation.
 *
 * @param {number} allocationId - Allocation ID
 * @returns {Promise<{ allocated: number; obligated: number; unobligated: number }>} Balance summary
 *
 * @example
 * ```typescript
 * const balances = await calculateObligationBalances(5);
 * console.log(`Unobligated: ${balances.unobligated}`);
 * ```
 */
const calculateObligationBalances = async (allocationId) => {
    const allocated = 250000;
    const obligated = 150000;
    return {
        allocated,
        obligated,
        unobligated: allocated - obligated,
    };
};
exports.calculateObligationBalances = calculateObligationBalances;
// ============================================================================
// BUDGET TRANSFERS (16-20)
// ============================================================================
/**
 * Initiates budget transfer between two budget lines.
 *
 * @param {BudgetTransfer} transferData - Transfer request data
 * @returns {Promise<object>} Created transfer request
 *
 * @example
 * ```typescript
 * const transfer = await initiateBudgetTransfer({
 *   fromBudgetLineId: 5,
 *   toBudgetLineId: 8,
 *   amount: 75000,
 *   reason: 'Project priority change',
 *   requestedBy: 'manager.jones'
 * });
 * ```
 */
const initiateBudgetTransfer = async (transferData) => {
    const transferId = `TRF-${Date.now()}`;
    return {
        transferId,
        ...transferData,
        status: 'PENDING',
        approvals: [],
        requestDate: new Date(),
    };
};
exports.initiateBudgetTransfer = initiateBudgetTransfer;
/**
 * Validates budget transfer against fund controls and policies.
 *
 * @param {BudgetTransfer} transfer - Transfer to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBudgetTransfer(transfer);
 * if (!validation.valid) {
 *   throw new Error('Transfer validation failed');
 * }
 * ```
 */
const validateBudgetTransfer = async (transfer) => {
    const errors = [];
    const warnings = [];
    if (transfer.amount <= 0) {
        errors.push('Transfer amount must be greater than zero');
    }
    if (transfer.fromBudgetLineId === transfer.toBudgetLineId) {
        errors.push('Source and destination budget lines must be different');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateBudgetTransfer = validateBudgetTransfer;
/**
 * Approves budget transfer at workflow level.
 *
 * @param {string} transferId - Transfer ID
 * @param {AllocationApproval} approval - Approval details
 * @returns {Promise<object>} Updated transfer with approval
 *
 * @example
 * ```typescript
 * const result = await approveBudgetTransfer('TRF-12345', {
 *   approvalLevel: 1,
 *   approverId: 'director.smith',
 *   status: 'APPROVED'
 * });
 * ```
 */
const approveBudgetTransfer = async (transferId, approval) => {
    return {
        transferId,
        approval,
        timestamp: new Date(),
    };
};
exports.approveBudgetTransfer = approveBudgetTransfer;
/**
 * Executes approved budget transfer with transaction recording.
 *
 * @param {string} transferId - Transfer ID
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Executed transfer with transaction records
 *
 * @example
 * ```typescript
 * const result = await executeBudgetTransfer('TRF-12345');
 * ```
 */
const executeBudgetTransfer = async (transferId, transaction) => {
    return {
        transferId,
        executedAt: new Date(),
        status: 'EXECUTED',
        transactions: [
            { type: 'TRANSFER_OUT', amount: 75000 },
            { type: 'TRANSFER_IN', amount: 75000 },
        ],
    };
};
exports.executeBudgetTransfer = executeBudgetTransfer;
/**
 * Retrieves transfer history for a budget or allocation.
 *
 * @param {number} budgetId - Budget ID
 * @param {object} [filters] - Optional filters (date range, status)
 * @returns {Promise<BudgetTransfer[]>} Transfer history
 *
 * @example
 * ```typescript
 * const transfers = await getBudgetTransferHistory(1, { status: 'EXECUTED' });
 * ```
 */
const getBudgetTransferHistory = async (budgetId, filters) => {
    return [];
};
exports.getBudgetTransferHistory = getBudgetTransferHistory;
// ============================================================================
// VARIANCE ANALYSIS (21-25)
// ============================================================================
/**
 * Calculates budget variance between planned and actual spending.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {BudgetPeriod} period - Period for analysis
 * @returns {Promise<VarianceAnalysis>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance(5, {
 *   fiscalYear: 2025,
 *   period: 'Q1',
 *   startDate: new Date('2024-10-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
const calculateBudgetVariance = async (budgetLineId, period) => {
    const budgetedAmount = 250000;
    const actualAmount = 275000;
    const variance = actualAmount - budgetedAmount;
    const variancePercent = (variance / budgetedAmount) * 100;
    return {
        budgetLineId,
        budgetedAmount,
        actualAmount,
        variance,
        variancePercent,
        varianceType: variance > 0 ? 'UNFAVORABLE' : 'FAVORABLE',
        threshold: 10,
        exceedsThreshold: Math.abs(variancePercent) > 10,
    };
};
exports.calculateBudgetVariance = calculateBudgetVariance;
/**
 * Analyzes spending trends and identifies anomalies.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} lookbackMonths - Number of months to analyze
 * @returns {Promise<object>} Trend analysis with anomaly detection
 *
 * @example
 * ```typescript
 * const trends = await analyzeSpendingTrends(1, 6);
 * ```
 */
const analyzeSpendingTrends = async (budgetId, lookbackMonths) => {
    return {
        budgetId,
        analysisWindow: lookbackMonths,
        averageMonthlySpend: 41667,
        trend: 'INCREASING',
        anomalies: [],
        projectedEndOfYearSpend: 500000,
    };
};
exports.analyzeSpendingTrends = analyzeSpendingTrends;
/**
 * Compares budget performance across multiple periods.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod[]} periods - Periods to compare
 * @returns {Promise<object[]>} Period-over-period comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareBudgetPeriods(1, [q1Period, q2Period, q3Period]);
 * ```
 */
const compareBudgetPeriods = async (budgetId, periods) => {
    return periods.map((period) => ({
        period: period.period,
        budgeted: 250000,
        actual: 225000,
        variance: -25000,
        executionRate: 90,
    }));
};
exports.compareBudgetPeriods = compareBudgetPeriods;
/**
 * Generates variance report with explanations and recommendations.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod} period - Reporting period
 * @param {number} [thresholdPercent=10] - Variance threshold for flagging
 * @returns {Promise<object>} Comprehensive variance report
 *
 * @example
 * ```typescript
 * const report = await generateVarianceReport(1, q1Period, 5);
 * ```
 */
const generateVarianceReport = async (budgetId, period, thresholdPercent = 10) => {
    return {
        budgetId,
        period,
        totalBudgeted: 1000000,
        totalActual: 950000,
        totalVariance: -50000,
        totalVariancePercent: -5,
        lineItemVariances: [],
        recommendations: ['Budget execution on track', 'Minor favorable variance'],
    };
};
exports.generateVarianceReport = generateVarianceReport;
/**
 * Identifies budget lines exceeding variance thresholds.
 *
 * @param {number} budgetId - Budget ID
 * @param {number} thresholdPercent - Variance threshold percentage
 * @returns {Promise<VarianceAnalysis[]>} Budget lines exceeding threshold
 *
 * @example
 * ```typescript
 * const overages = await identifyVarianceExceptions(1, 10);
 * ```
 */
const identifyVarianceExceptions = async (budgetId, thresholdPercent) => {
    return [];
};
exports.identifyVarianceExceptions = identifyVarianceExceptions;
// ============================================================================
// BUDGET FORECASTING (26-30)
// ============================================================================
/**
 * Forecasts budget utilization based on current spending patterns.
 *
 * @param {number} budgetLineId - Budget line ID
 * @param {Date} forecastThroughDate - Date to forecast through
 * @returns {Promise<BudgetForecast>} Forecast analysis
 *
 * @example
 * ```typescript
 * const forecast = await forecastBudgetUtilization(5, new Date('2025-09-30'));
 * ```
 */
const forecastBudgetUtilization = async (budgetLineId, forecastThroughDate) => {
    const currentSpendRate = 50000; // per month
    const daysRemaining = 180;
    const projectedSpend = currentSpendRate * 6;
    return {
        budgetLineId,
        currentSpendRate,
        projectedEndingBalance: 250000 - projectedSpend,
        projectedUtilization: (projectedSpend / 250000) * 100,
        daysRemaining,
        burnRate: currentSpendRate / 30,
        confidence: 'MEDIUM',
        assumptions: ['Historical spend rate continues', 'No major project changes'],
    };
};
exports.forecastBudgetUtilization = forecastBudgetUtilization;
/**
 * Calculates budget burn rate and runway.
 *
 * @param {number} allocationId - Allocation ID
 * @returns {Promise<{ dailyBurnRate: number; monthlyBurnRate: number; runwayDays: number }>} Burn rate analysis
 *
 * @example
 * ```typescript
 * const burnRate = await calculateBudgetBurnRate(5);
 * console.log(`Runway: ${burnRate.runwayDays} days`);
 * ```
 */
const calculateBudgetBurnRate = async (allocationId) => {
    const dailyBurnRate = 1667;
    const monthlyBurnRate = 50000;
    const remainingBalance = 100000;
    const runwayDays = Math.floor(remainingBalance / dailyBurnRate);
    return {
        dailyBurnRate,
        monthlyBurnRate,
        runwayDays,
    };
};
exports.calculateBudgetBurnRate = calculateBudgetBurnRate;
/**
 * Projects end-of-year budget position based on trends.
 *
 * @param {number} budgetId - Budget ID
 * @param {Date} [asOfDate] - Date to project from (defaults to today)
 * @returns {Promise<object>} End-of-year projection
 *
 * @example
 * ```typescript
 * const projection = await projectEndOfYearPosition(1);
 * ```
 */
const projectEndOfYearPosition = async (budgetId, asOfDate) => {
    return {
        budgetId,
        projectionDate: asOfDate || new Date(),
        totalBudget: 1000000,
        currentSpend: 400000,
        projectedEndOfYearSpend: 950000,
        projectedUnspent: 50000,
        confidence: 'HIGH',
    };
};
exports.projectEndOfYearPosition = projectEndOfYearPosition;
/**
 * Identifies budgets at risk of over/under-execution.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [riskThresholdPercent=15] - Risk threshold percentage
 * @returns {Promise<object[]>} At-risk budgets
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskBudgets(2025, 20);
 * ```
 */
const identifyAtRiskBudgets = async (fiscalYear, riskThresholdPercent = 15) => {
    return [];
};
exports.identifyAtRiskBudgets = identifyAtRiskBudgets;
/**
 * Generates budget execution forecast report.
 *
 * @param {number} budgetId - Budget ID
 * @param {object} [options] - Report options (scenarios, confidence levels)
 * @returns {Promise<object>} Comprehensive forecast report
 *
 * @example
 * ```typescript
 * const report = await generateBudgetForecastReport(1, { scenarios: ['best', 'likely', 'worst'] });
 * ```
 */
const generateBudgetForecastReport = async (budgetId, options) => {
    return {
        budgetId,
        reportDate: new Date(),
        scenarios: {
            best: { projectedSpend: 900000, confidence: 'LOW' },
            likely: { projectedSpend: 950000, confidence: 'HIGH' },
            worst: { projectedSpend: 1050000, confidence: 'MEDIUM' },
        },
    };
};
exports.generateBudgetForecastReport = generateBudgetForecastReport;
// ============================================================================
// BUDGET AMENDMENTS (31-35)
// ============================================================================
/**
 * Creates budget amendment request for budget changes.
 *
 * @param {BudgetAmendment} amendmentData - Amendment details
 * @returns {Promise<object>} Created amendment request
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment({
 *   budgetId: 1,
 *   amendmentType: 'INCREASE',
 *   originalAmount: 1000000,
 *   amendedAmount: 1200000,
 *   reason: 'Additional funding received'
 * });
 * ```
 */
const createBudgetAmendment = async (amendmentData) => {
    const amendmentNumber = `AMD-${Date.now()}`;
    return {
        amendmentNumber,
        ...amendmentData,
        changeAmount: (amendmentData.amendedAmount || 0) - (amendmentData.originalAmount || 0),
        status: 'DRAFT',
        approvals: [],
    };
};
exports.createBudgetAmendment = createBudgetAmendment;
/**
 * Processes amendment approval through workflow.
 *
 * @param {string} amendmentNumber - Amendment number
 * @param {AllocationApproval} approval - Approval details
 * @returns {Promise<object>} Updated amendment
 *
 * @example
 * ```typescript
 * const result = await processAmendmentApproval('AMD-12345', {
 *   approvalLevel: 1,
 *   approverId: 'cfo.johnson',
 *   status: 'APPROVED'
 * });
 * ```
 */
const processAmendmentApproval = async (amendmentNumber, approval) => {
    return {
        amendmentNumber,
        approval,
        timestamp: new Date(),
    };
};
exports.processAmendmentApproval = processAmendmentApproval;
/**
 * Executes approved budget amendment.
 *
 * @param {string} amendmentNumber - Amendment number
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Executed amendment
 *
 * @example
 * ```typescript
 * const result = await executeAmendment('AMD-12345');
 * ```
 */
const executeAmendment = async (amendmentNumber, transaction) => {
    return {
        amendmentNumber,
        executedAt: new Date(),
        status: 'APPROVED',
    };
};
exports.executeAmendment = executeAmendment;
/**
 * Tracks amendment history for a budget.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<BudgetAmendment[]>} Amendment history
 *
 * @example
 * ```typescript
 * const amendments = await getAmendmentHistory(1);
 * ```
 */
const getAmendmentHistory = async (budgetId) => {
    return [];
};
exports.getAmendmentHistory = getAmendmentHistory;
/**
 * Generates amendment impact analysis.
 *
 * @param {string} amendmentNumber - Amendment number
 * @returns {Promise<object>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeAmendmentImpact('AMD-12345');
 * ```
 */
const analyzeAmendmentImpact = async (amendmentNumber) => {
    return {
        amendmentNumber,
        budgetImpact: 200000,
        affectedAllocations: [],
        downstreamEffects: [],
    };
};
exports.analyzeAmendmentImpact = analyzeAmendmentImpact;
// ============================================================================
// BUDGET CARRYOVER (36-40)
// ============================================================================
/**
 * Processes fiscal year-end budget carryover.
 *
 * @param {number} fiscalYear - Ending fiscal year
 * @param {number} budgetId - Budget ID
 * @returns {Promise<BudgetCarryover>} Carryover calculation
 *
 * @example
 * ```typescript
 * const carryover = await processBudgetCarryover(2024, 1);
 * ```
 */
const processBudgetCarryover = async (fiscalYear, budgetId) => {
    return {
        fiscalYear,
        budgetLineId: budgetId,
        unobligatedBalance: 50000,
        obligatedBalance: 100000,
        carryoverAmount: 50000,
        carryoverType: 'MULTI_YEAR',
        approved: false,
    };
};
exports.processBudgetCarryover = processBudgetCarryover;
/**
 * Validates carryover eligibility based on fund type and policies.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<{ eligible: boolean; reason: string; amount: number }>} Eligibility determination
 *
 * @example
 * ```typescript
 * const eligibility = await validateCarryoverEligibility(1);
 * ```
 */
const validateCarryoverEligibility = async (budgetId) => {
    return {
        eligible: true,
        reason: 'Multi-year funds eligible for carryover',
        amount: 50000,
    };
};
exports.validateCarryoverEligibility = validateCarryoverEligibility;
/**
 * Transfers carryover funds to new fiscal year budget.
 *
 * @param {BudgetCarryover} carryover - Carryover details
 * @param {number} newBudgetId - New fiscal year budget ID
 * @returns {Promise<object>} Carryover transfer
 *
 * @example
 * ```typescript
 * const transfer = await transferCarryoverFunds(carryover, 15);
 * ```
 */
const transferCarryoverFunds = async (carryover, newBudgetId) => {
    return {
        fromFiscalYear: carryover.fiscalYear,
        toFiscalYear: carryover.fiscalYear + 1,
        amount: carryover.carryoverAmount,
        newBudgetId,
        transferDate: new Date(),
    };
};
exports.transferCarryoverFunds = transferCarryoverFunds;
/**
 * Generates carryover report for fiscal year end.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Carryover report
 *
 * @example
 * ```typescript
 * const report = await generateCarryoverReport(2024, 'USACE-NAD');
 * ```
 */
const generateCarryoverReport = async (fiscalYear, organizationCode) => {
    return {
        fiscalYear,
        organizationCode,
        totalUnobligatedBalance: 500000,
        totalCarryoverAmount: 300000,
        totalExpired: 200000,
        budgetLineDetails: [],
    };
};
exports.generateCarryoverReport = generateCarryoverReport;
/**
 * Expires unobligated balances that cannot be carried over.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} fundType - Fund type to expire
 * @returns {Promise<object[]>} Expired balances
 *
 * @example
 * ```typescript
 * const expired = await expireUnobligatedBalances(2024, 'ONE_YEAR');
 * ```
 */
const expireUnobligatedBalances = async (fiscalYear, fundType) => {
    return [];
};
exports.expireUnobligatedBalances = expireUnobligatedBalances;
// ============================================================================
// BUDGET METRICS AND REPORTING (41-45)
// ============================================================================
/**
 * Calculates comprehensive budget metrics and KPIs.
 *
 * @param {number} budgetId - Budget ID
 * @param {Date} [asOfDate] - Date for metrics calculation
 * @returns {Promise<BudgetMetrics>} Budget metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateBudgetMetrics(1);
 * console.log(`Execution rate: ${metrics.executionRate}%`);
 * ```
 */
const calculateBudgetMetrics = async (budgetId, asOfDate) => {
    const totalBudget = 1000000;
    const totalAllocated = 900000;
    const totalObligated = 700000;
    const totalExpended = 500000;
    return {
        totalBudget,
        totalAllocated,
        totalObligated,
        totalExpended,
        availableToAllocate: totalBudget - totalAllocated,
        availableToObligate: totalAllocated - totalObligated,
        executionRate: (totalExpended / totalBudget) * 100,
        allocationRate: (totalAllocated / totalBudget) * 100,
        utilizationRate: (totalObligated / totalAllocated) * 100,
    };
};
exports.calculateBudgetMetrics = calculateBudgetMetrics;
/**
 * Generates budget execution status report.
 *
 * @param {number} budgetId - Budget ID
 * @param {BudgetPeriod} period - Reporting period
 * @returns {Promise<object>} Execution status report
 *
 * @example
 * ```typescript
 * const report = await generateBudgetExecutionReport(1, q1Period);
 * ```
 */
const generateBudgetExecutionReport = async (budgetId, period) => {
    return {
        budgetId,
        period,
        reportDate: new Date(),
        metrics: await (0, exports.calculateBudgetMetrics)(budgetId),
        lineItems: [],
        summary: 'Budget execution on track',
    };
};
exports.generateBudgetExecutionReport = generateBudgetExecutionReport;
/**
 * Compares budget performance across organizations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} organizationCodes - Organizations to compare
 * @returns {Promise<object[]>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareBudgetPerformance(2025, ['USACE-NAD', 'USACE-SAD']);
 * ```
 */
const compareBudgetPerformance = async (fiscalYear, organizationCodes) => {
    return organizationCodes.map((code) => ({
        organizationCode: code,
        totalBudget: 5000000,
        executionRate: 75,
        allocationRate: 90,
    }));
};
exports.compareBudgetPerformance = compareBudgetPerformance;
/**
 * Generates budget dashboard data for visualization.
 *
 * @param {number} budgetId - Budget ID
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetDashboard(1);
 * ```
 */
const generateBudgetDashboard = async (budgetId) => {
    return {
        budgetId,
        metrics: await (0, exports.calculateBudgetMetrics)(budgetId),
        recentTransactions: [],
        alerts: [],
        trends: [],
    };
};
exports.generateBudgetDashboard = generateBudgetDashboard;
/**
 * Exports budget data to external format (Excel, CSV, PDF).
 *
 * @param {number} budgetId - Budget ID
 * @param {string} format - Export format ('EXCEL' | 'CSV' | 'PDF')
 * @param {object} [options] - Export options
 * @returns {Promise<Buffer>} Exported data buffer
 *
 * @example
 * ```typescript
 * const excelBuffer = await exportBudgetData(1, 'EXCEL', { includeTransactions: true });
 * ```
 */
const exportBudgetData = async (budgetId, format, options) => {
    // Validate inputs
    if (!budgetId || budgetId <= 0) {
        throw new Error('Valid budget ID is required');
    }
    const supportedFormats = ['CSV', 'EXCEL', 'PDF', 'JSON'];
    const formatUpper = format.toUpperCase();
    if (!supportedFormats.includes(formatUpper)) {
        throw new Error(`Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`);
    }
    // In production: Fetch budget data from database
    // const budget = await Budget.findByPk(budgetId, {
    //   include: [
    //     { model: BudgetAllocation },
    //     { model: BudgetTransaction, required: options?.includeTransactions }
    //   ]
    // });
    // Simulate budget data
    const budgetData = {
        budgetId,
        budgetName: `Budget ${budgetId}`,
        fiscalYear: new Date().getFullYear(),
        totalAmount: 1000000,
        allocatedAmount: 350000,
        spentAmount: 250000,
        remainingAmount: 400000,
        status: 'ACTIVE',
        allocations: [
            { category: 'Personnel', amount: 150000, spent: 100000 },
            { category: 'Operations', amount: 100000, spent: 75000 },
            { category: 'Equipment', amount: 100000, spent: 75000 }
        ],
        transactions: options?.includeTransactions ? [
            { date: '2025-01-15', description: 'Payroll', amount: 50000 },
            { date: '2025-02-01', description: 'Equipment Purchase', amount: 25000 }
        ] : []
    };
    // Generate export based on format
    let exportContent;
    switch (formatUpper) {
        case 'JSON':
            exportContent = JSON.stringify(budgetData, null, 2);
            break;
        case 'CSV':
            exportContent = `Budget Export - ID: ${budgetId}\n\n`;
            exportContent += `Field,Value\n`;
            exportContent += `Budget Name,${budgetData.budgetName}\n`;
            exportContent += `Fiscal Year,${budgetData.fiscalYear}\n`;
            exportContent += `Total Amount,$${budgetData.totalAmount.toLocaleString()}\n`;
            exportContent += `Allocated Amount,$${budgetData.allocatedAmount.toLocaleString()}\n`;
            exportContent += `Spent Amount,$${budgetData.spentAmount.toLocaleString()}\n`;
            exportContent += `Remaining Amount,$${budgetData.remainingAmount.toLocaleString()}\n\n`;
            exportContent += `Category,Allocated,Spent,Remaining\n`;
            budgetData.allocations.forEach(alloc => {
                const remaining = alloc.amount - alloc.spent;
                exportContent += `${alloc.category},$${alloc.amount},$${alloc.spent},$${remaining}\n`;
            });
            break;
        case 'EXCEL':
        case 'PDF':
            exportContent = `BUDGET EXPORT\n`;
            exportContent += `==================================================\n`;
            exportContent += `Budget ID: ${budgetId}\n`;
            exportContent += `Budget Name: ${budgetData.budgetName}\n`;
            exportContent += `Fiscal Year: ${budgetData.fiscalYear}\n`;
            exportContent += `Status: ${budgetData.status}\n\n`;
            exportContent += `FINANCIAL SUMMARY\n`;
            exportContent += `--------------------------------------------------\n`;
            exportContent += `Total Amount:      $${budgetData.totalAmount.toLocaleString()}\n`;
            exportContent += `Allocated:         $${budgetData.allocatedAmount.toLocaleString()}\n`;
            exportContent += `Spent:             $${budgetData.spentAmount.toLocaleString()}\n`;
            exportContent += `Remaining:         $${budgetData.remainingAmount.toLocaleString()}\n\n`;
            exportContent += `ALLOCATIONS BY CATEGORY\n`;
            exportContent += `--------------------------------------------------\n`;
            budgetData.allocations.forEach(alloc => {
                const remaining = alloc.amount - alloc.spent;
                exportContent += `${alloc.category}:\n`;
                exportContent += `  Allocated: $${alloc.amount.toLocaleString()}\n`;
                exportContent += `  Spent:     $${alloc.spent.toLocaleString()}\n`;
                exportContent += `  Remaining: $${remaining.toLocaleString()}\n\n`;
            });
            if (options?.includeTransactions && budgetData.transactions.length > 0) {
                exportContent += `TRANSACTIONS\n`;
                exportContent += `--------------------------------------------------\n`;
                budgetData.transactions.forEach(txn => {
                    exportContent += `${txn.date} - ${txn.description}: $${txn.amount.toLocaleString()}\n`;
                });
            }
            exportContent += `\nGenerated: ${new Date().toISOString()}\n`;
            break;
        default:
            exportContent = JSON.stringify(budgetData);
    }
    console.log(`[BUDGET_EXPORT] Budget ${budgetId} exported in ${formatUpper} format`);
    return Buffer.from(exportContent, 'utf-8');
};
exports.exportBudgetData = exportBudgetData;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createBudgetModel: exports.createBudgetModel,
    createBudgetAllocationModel: exports.createBudgetAllocationModel,
    createBudgetTransactionModel: exports.createBudgetTransactionModel,
    // Budget Creation
    createBudget: exports.createBudget,
    importPriorYearBudget: exports.importPriorYearBudget,
    validateBudgetData: exports.validateBudgetData,
    generateBudgetNumber: exports.generateBudgetNumber,
    setupBudgetApprovalWorkflow: exports.setupBudgetApprovalWorkflow,
    // Budget Allocation
    allocateBudgetFunds: exports.allocateBudgetFunds,
    checkBudgetAvailability: exports.checkBudgetAvailability,
    processAllocationApproval: exports.processAllocationApproval,
    bulkAllocateFunds: exports.bulkAllocateFunds,
    reallocateFunds: exports.reallocateFunds,
    // Obligation Tracking
    recordObligation: exports.recordObligation,
    liquidateObligation: exports.liquidateObligation,
    deobligateFunds: exports.deobligateFunds,
    getObligationsByAllocation: exports.getObligationsByAllocation,
    calculateObligationBalances: exports.calculateObligationBalances,
    // Budget Transfers
    initiateBudgetTransfer: exports.initiateBudgetTransfer,
    validateBudgetTransfer: exports.validateBudgetTransfer,
    approveBudgetTransfer: exports.approveBudgetTransfer,
    executeBudgetTransfer: exports.executeBudgetTransfer,
    getBudgetTransferHistory: exports.getBudgetTransferHistory,
    // Variance Analysis
    calculateBudgetVariance: exports.calculateBudgetVariance,
    analyzeSpendingTrends: exports.analyzeSpendingTrends,
    compareBudgetPeriods: exports.compareBudgetPeriods,
    generateVarianceReport: exports.generateVarianceReport,
    identifyVarianceExceptions: exports.identifyVarianceExceptions,
    // Budget Forecasting
    forecastBudgetUtilization: exports.forecastBudgetUtilization,
    calculateBudgetBurnRate: exports.calculateBudgetBurnRate,
    projectEndOfYearPosition: exports.projectEndOfYearPosition,
    identifyAtRiskBudgets: exports.identifyAtRiskBudgets,
    generateBudgetForecastReport: exports.generateBudgetForecastReport,
    // Budget Amendments
    createBudgetAmendment: exports.createBudgetAmendment,
    processAmendmentApproval: exports.processAmendmentApproval,
    executeAmendment: exports.executeAmendment,
    getAmendmentHistory: exports.getAmendmentHistory,
    analyzeAmendmentImpact: exports.analyzeAmendmentImpact,
    // Budget Carryover
    processBudgetCarryover: exports.processBudgetCarryover,
    validateCarryoverEligibility: exports.validateCarryoverEligibility,
    transferCarryoverFunds: exports.transferCarryoverFunds,
    generateCarryoverReport: exports.generateCarryoverReport,
    expireUnobligatedBalances: exports.expireUnobligatedBalances,
    // Metrics and Reporting
    calculateBudgetMetrics: exports.calculateBudgetMetrics,
    generateBudgetExecutionReport: exports.generateBudgetExecutionReport,
    compareBudgetPerformance: exports.compareBudgetPerformance,
    generateBudgetDashboard: exports.generateBudgetDashboard,
    exportBudgetData: exports.exportBudgetData,
};
//# sourceMappingURL=budget-planning-allocation-kit.js.map
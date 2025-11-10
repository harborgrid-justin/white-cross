"use strict";
/**
 * Expense Tracking & Management Kit (FIN-EXP-001)
 *
 * 40 Enterprise-Grade Functions for Complete Expense Management
 * Targets: Expensify, Concur
 *
 * Features:
 * - Expense report lifecycle management (create, submit, approve, reject)
 * - Receipt handling with OCR scanning and validation
 * - Automated expense categorization with policy compliance
 * - Multi-level approval workflows with escalation
 * - Mileage & per diem tracking with rate calculations
 * - Reimbursement processing & payment tracking
 * - Corporate card reconciliation & transaction matching
 * - Advanced analytics, budget tracking, and spend reporting
 *
 * Dependencies:
 * - @nestjs/common v10.x
 * - sequelize v6.x
 * - sequelize-typescript v2.x
 *
 * @author Architecture Team
 * @version 1.0.0
 * @license MIT
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
exports.ExpenseAnalyticsService = exports.CorporateCardService = exports.ReimbursementService = exports.PerDiemService = exports.MileageService = exports.ApprovalWorkflowService = exports.PolicyComplianceService = exports.CategorizationService = exports.ReceiptService = exports.ExpenseReportService = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
// ============================================================================
// EXPENSE REPORTS (Functions 1-4)
// ============================================================================
let ExpenseReportService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpenseReportService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 1. Create Expense Report
         * Creates new expense report with initial validation
         */
        async createExpenseReport(employeeId, reportName, startDate, endDate) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.create({
                    employeeId,
                    reportName,
                    status: 'draft',
                    startDate,
                    endDate,
                    totalAmount: 0,
                    currency: 'USD',
                }, { transaction: t });
                // Create default approval workflow
                await this.sequelize.models.ApprovalStep.create({ reportId: report.id, stepOrder: 1, status: 'pending' }, { transaction: t });
                return report.toJSON();
            });
        }
        /**
         * 2. Submit Expense Report
         * Validates all expenses before submission
         */
        async submitExpenseReport(reportId, userId) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    include: [
                        {
                            model: this.sequelize.models.ExpenseItem,
                            as: 'expenses',
                            where: { reportId },
                        },
                    ],
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                // Validate all receipts attached
                const unvalidatedReceipts = await this.sequelize.query(`
        SELECT COUNT(*) as count FROM "Receipts"
        WHERE "expenseId" IN (
          SELECT id FROM "ExpenseItems" WHERE "reportId" = :reportId
        ) AND "validationStatus" = 'pending'
      `, {
                    replacements: { reportId },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                if (unvalidatedReceipts[0]?.count > 0) {
                    throw new Error('All receipts must be validated before submission');
                }
                // Calculate total and check policy compliance
                const totals = await this.sequelize.query(`
        SELECT
          COALESCE(SUM(amount), 0) as total,
          COUNT(CASE WHEN "policyCompliant" = false THEN 1 END) as violations
        FROM "ExpenseItems"
        WHERE "reportId" = :reportId
      `, {
                    replacements: { reportId },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                await report.update({
                    status: 'submitted',
                    totalAmount: totals[0]?.total || 0,
                    submittedAt: new Date(),
                }, { transaction: t });
                // Route to first approver
                await this.sequelize.models.ApprovalStep.update({ status: 'pending' }, { where: { reportId, stepOrder: 1 }, transaction: t });
                return report.toJSON();
            });
        }
        /**
         * 3. Approve Expense Report
         * Multi-level approval with escalation support
         */
        async approveExpenseReport(reportId, approverId) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!report)
                    throw new Error('Report not found');
                // Get current approval step
                const approvalStep = await this.sequelize.models.ApprovalStep.findOne({
                    where: { reportId, status: 'pending' },
                    order: [['stepOrder', 'ASC']],
                    transaction: t,
                });
                if (!approvalStep)
                    throw new Error('No pending approval steps');
                await approvalStep.update({ status: 'approved', approvalDate: new Date() }, { transaction: t });
                // Check if all steps are complete
                const nextStep = await this.sequelize.models.ApprovalStep.findOne({
                    where: { reportId, status: 'pending' },
                    order: [['stepOrder', 'ASC']],
                    transaction: t,
                });
                if (!nextStep) {
                    await report.update({ status: 'approved', approvedAt: new Date() }, { transaction: t });
                }
                return report.toJSON();
            });
        }
        /**
         * 4. Reject Expense Report
         * Reject with detailed reason and return to employee
         */
        async rejectExpenseReport(reportId, approverId, rejectionReason) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                // Mark all pending approval steps as rejected
                await this.sequelize.models.ApprovalStep.update({ status: 'rejected', rejectionReason }, { where: { reportId, status: 'pending' }, transaction: t });
                await report.update({ status: 'rejected', rejectionReason }, { transaction: t });
                // Log rejection event
                await this.sequelize.models.AuditLog.create({
                    reportId,
                    action: 'REPORT_REJECTED',
                    userId: approverId,
                    details: rejectionReason,
                }, { transaction: t });
                return report.toJSON();
            });
        }
    };
    __setFunctionName(_classThis, "ExpenseReportService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpenseReportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpenseReportService = _classThis;
})();
exports.ExpenseReportService = ExpenseReportService;
// ============================================================================
// RECEIPTS (Functions 5-8)
// ============================================================================
let ReceiptService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReceiptService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 5. Attach Receipt to Expense
         * Upload and store receipt metadata
         */
        async attachReceipt(expenseId, fileName, mimeType, fileSize, s3Url) {
            return await this.sequelize.models.Receipt.create({
                expenseId,
                fileName,
                mimeType,
                fileSize,
                s3Url,
                validationStatus: 'pending',
            });
        }
        /**
         * 6. OCR Scan Receipt
         * Extract data from receipt image using OCR
         */
        async ocrScanReceipt(receiptId, ocrData) {
            return await this.sequelize.transaction(async (t) => {
                const receipt = await this.sequelize.models.Receipt.findByPk(receiptId, {
                    transaction: t,
                });
                if (!receipt)
                    throw new Error('Receipt not found');
                await receipt.update({
                    ocrData,
                    extractedAmount: ocrData.amount,
                    extractedDate: ocrData.date,
                    extractedVendor: ocrData.vendor,
                }, { transaction: t });
                // Link extracted amount to expense if not already set
                const expense = await this.sequelize.models.ExpenseItem.findByPk(receipt.expenseId, { transaction: t });
                if (expense && !expense.amount && ocrData.amount) {
                    await expense.update({ amount: ocrData.amount }, { transaction: t });
                }
                return receipt.toJSON();
            });
        }
        /**
         * 7. Validate Receipt
         * Check receipt format, amount, and compliance
         */
        async validateReceipt(receiptId) {
            return await this.sequelize.transaction(async (t) => {
                const receipt = await this.sequelize.models.Receipt.findByPk(receiptId, {
                    include: [
                        {
                            model: this.sequelize.models.ExpenseItem,
                            as: 'expense',
                        },
                    ],
                    transaction: t,
                });
                if (!receipt)
                    throw new Error('Receipt not found');
                const errors = [];
                // Validate file format
                const validMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!validMimeTypes.includes(receipt.mimeType)) {
                    errors.push('Invalid file format');
                }
                // Validate file size (< 10MB)
                if (receipt.fileSize > 10 * 1024 * 1024) {
                    errors.push('File size exceeds 10MB limit');
                }
                // Validate extracted amount if available
                if (receipt.extractedAmount && receipt.extractedAmount > 100000) {
                    errors.push('Amount appears excessive for receipt');
                }
                // Validate receipt date is recent (within 90 days)
                if (receipt.extractedDate) {
                    const daysDiff = Math.floor((Date.now() - receipt.extractedDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysDiff > 90) {
                        errors.push('Receipt is older than 90 days');
                    }
                }
                await receipt.update({
                    validationStatus: errors.length > 0 ? 'rejected' : 'validated',
                    validationErrors: errors.length > 0 ? errors : null,
                }, { transaction: t });
                return receipt.toJSON();
            });
        }
        /**
         * 8. Link Receipt to Expense
         * Associate receipt with expense item and update metadata
         */
        async linkReceiptToExpense(receiptId, expenseId) {
            return await this.sequelize.transaction(async (t) => {
                const [receipt, expense] = await Promise.all([
                    this.sequelize.models.Receipt.findByPk(receiptId, { transaction: t }),
                    this.sequelize.models.ExpenseItem.findByPk(expenseId, { transaction: t }),
                ]);
                if (!receipt || !expense)
                    throw new Error('Receipt or expense not found');
                // Update receipt with expense link
                await receipt.update({ expenseId }, { transaction: t });
                // If receipt has extracted amount, validate it matches
                if (receipt.extractedAmount && expense.amount) {
                    const amountDiff = Math.abs(receipt.extractedAmount - expense.amount) / expense.amount;
                    if (amountDiff > 0.05) {
                        // >5% difference
                        await expense.update({ flagged: true }, { transaction: t });
                    }
                }
                return {
                    receipt: receipt.toJSON(),
                    expense: expense.toJSON(),
                };
            });
        }
    };
    __setFunctionName(_classThis, "ReceiptService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReceiptService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReceiptService = _classThis;
})();
exports.ReceiptService = ReceiptService;
// ============================================================================
// CATEGORIZATION (Functions 9-12)
// ============================================================================
let CategorizationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CategorizationService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 9. Categorize Expense
         * Manually assign category with validation
         */
        async categorizeExpense(expenseId, category, vendor) {
            return await this.sequelize.transaction(async (t) => {
                const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                    transaction: t,
                });
                if (!expense)
                    throw new Error('Expense not found');
                // Validate category against company list
                const validCategory = await this.sequelize.models.ExpenseCategory.findOne({
                    where: { code: category, isActive: true },
                    transaction: t,
                });
                if (!validCategory)
                    throw new Error('Invalid expense category');
                await expense.update({ category, vendor }, { transaction: t });
                return expense.toJSON();
            });
        }
        /**
         * 10. Auto-Categorize Expense
         * Use ML/heuristics to auto-classify based on vendor/description
         */
        async autoCategorizeExpense(expenseId) {
            return await this.sequelize.transaction(async (t) => {
                const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                    include: [
                        {
                            model: this.sequelize.models.Receipt,
                            as: 'receipts',
                        },
                    ],
                    transaction: t,
                });
                if (!expense)
                    throw new Error('Expense not found');
                // Extract vendor from receipt OCR or description
                const vendor = expense.receipts?.[0]?.extractedVendor ||
                    this.extractVendorFromDescription(expense.description);
                // Query vendor-category mappings
                const mapping = await this.sequelize.query(`
        SELECT category FROM "VendorCategoryMappings"
        WHERE LOWER(vendor_name) LIKE LOWER(:vendor)
        AND is_active = true
        LIMIT 1
      `, {
                    replacements: { vendor: `%${vendor}%` },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                let category = mapping[0]?.category;
                // Fallback to keyword matching
                if (!category) {
                    const keywordMatch = await this.sequelize.query(`
          SELECT category FROM "ExpenseKeywords"
          WHERE LOWER(:description) LIKE LOWER(CONCAT('%', keyword, '%'))
          LIMIT 1
        `, {
                        replacements: { description: expense.description },
                        type: sequelize_1.QueryTypes.SELECT,
                        transaction: t,
                    });
                    category = keywordMatch[0]?.category || 'miscellaneous';
                }
                await expense.update({ category }, { transaction: t });
                return expense.toJSON();
            });
        }
        /**
         * 11. Validate Expense Category
         * Check category compliance with policy rules
         */
        async validateExpenseCategory(expenseId) {
            const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                include: [
                    {
                        model: this.sequelize.models.ExpenseReport,
                        as: 'report',
                        include: [
                            {
                                model: this.sequelize.models.Employee,
                                as: 'employee',
                                attributes: ['id', 'department', 'jobLevel'],
                            },
                        ],
                    },
                ],
            });
            if (!expense)
                throw new Error('Expense not found');
            // Check policy restrictions by department and category
            const policyCheck = await this.sequelize.query(`
      SELECT is_allowed, requires_approval FROM "ExpensePolicies"
      WHERE category = :category
        AND (department = :department OR department IS NULL)
        AND is_active = true
      ORDER BY department DESC NULLS LAST
      LIMIT 1
    `, {
                replacements: {
                    category: expense.category,
                    department: expense.report?.employee?.department,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (!policyCheck[0]?.is_allowed) {
                throw new Error(`Category "${expense.category}" not allowed for this department`);
            }
            return true;
        }
        /**
         * 12. Reclassify Expense
         * Move expense to different category with audit trail
         */
        async reclassifyExpense(expenseId, newCategory, reason, userId) {
            return await this.sequelize.transaction(async (t) => {
                const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                    transaction: t,
                });
                if (!expense)
                    throw new Error('Expense not found');
                const oldCategory = expense.category;
                await expense.update({ category: newCategory }, { transaction: t });
                // Audit log
                await this.sequelize.models.AuditLog.create({
                    expenseId,
                    action: 'RECLASSIFIED',
                    userId,
                    details: JSON.stringify({ oldCategory, newCategory, reason }),
                }, { transaction: t });
                return expense.toJSON();
            });
        }
        extractVendorFromDescription(description) {
            // Simple extraction - can be enhanced with ML
            return description.split(' ').slice(0, 3).join(' ');
        }
    };
    __setFunctionName(_classThis, "CategorizationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CategorizationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CategorizationService = _classThis;
})();
exports.CategorizationService = CategorizationService;
// ============================================================================
// POLICY COMPLIANCE (Functions 13-16)
// ============================================================================
let PolicyComplianceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PolicyComplianceService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 13. Validate Policy Compliance
         * Check expense against company spending policies
         */
        async validatePolicyCompliance(expenseId) {
            const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                include: [
                    {
                        model: this.sequelize.models.ExpenseReport,
                        as: 'report',
                        include: [
                            {
                                model: this.sequelize.models.Employee,
                                as: 'employee',
                            },
                        ],
                    },
                ],
            });
            if (!expense)
                throw new Error('Expense not found');
            const issues = [];
            // Check amount limits by category
            const categoryLimit = await this.sequelize.query(`
      SELECT max_amount_per_expense, max_amount_per_month
      FROM "ExpenseLimits"
      WHERE category = :category AND is_active = true
    `, {
                replacements: { category: expense.category },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (categoryLimit[0]) {
                if (expense.amount > categoryLimit[0].max_amount_per_expense) {
                    issues.push(`Exceeds single expense limit of $${categoryLimit[0].max_amount_per_expense}`);
                }
            }
            // Check monthly spending cap
            const monthlySpend = await this.sequelize.query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM "ExpenseItems" ei
      JOIN "ExpenseReports" er ON ei."reportId" = er.id
      WHERE er."employeeId" = :employeeId
        AND ei.category = :category
        AND EXTRACT(MONTH FROM ei.date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM ei.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, {
                replacements: {
                    employeeId: expense.report?.employeeId,
                    category: expense.category,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (categoryLimit[0] && monthlySpend[0]?.total > categoryLimit[0].max_amount_per_month) {
                issues.push(`Monthly category limit of $${categoryLimit[0].max_amount_per_month} exceeded`);
            }
            // Check duplicate submission (same amount, vendor, date within 7 days)
            const duplicate = await this.sequelize.query(`
      SELECT COUNT(*) as count FROM "ExpenseItems"
      WHERE "reportId" != :reportId
        AND amount = :amount
        AND vendor = :vendor
        AND ABS(EXTRACT(DAY FROM (date - :date))) <= 7
    `, {
                replacements: {
                    reportId: expense.reportId,
                    amount: expense.amount,
                    vendor: expense.vendor,
                    date: expense.date,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (duplicate[0]?.count > 0) {
                issues.push('Possible duplicate expense (similar amount/vendor/date)');
            }
            const compliant = issues.length === 0;
            await this.sequelize.models.ExpenseItem.update({
                policyCompliant: compliant,
                flagged: !compliant,
            }, { where: { id: expenseId } });
            return { compliant, issues };
        }
        /**
         * 14. Check Spending Limits
         * Get remaining budget for category/employee
         */
        async checkSpendingLimits(employeeId, category) {
            const limits = await this.sequelize.query(`
      SELECT
        COALESCE(el.max_amount_per_month, 0) as limit,
        COALESCE(SUM(ei.amount), 0) as spent
      FROM "ExpenseLimits" el
      LEFT JOIN "ExpenseItems" ei ON el.category = ei.category
      LEFT JOIN "ExpenseReports" er ON ei."reportId" = er.id
      WHERE el.category = :category
        AND el.is_active = true
        AND (er."employeeId" = :employeeId OR er."employeeId" IS NULL)
        AND EXTRACT(MONTH FROM ei.date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM ei.date) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY el.max_amount_per_month
    `, {
                replacements: { employeeId, category },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const limit = limits[0]?.limit || 0;
            const spent = limits[0]?.spent || 0;
            return { limit, spent, remaining: limit - spent };
        }
        /**
         * 15. Flag Policy Violations
         * Identify and flag expenses violating company policies
         */
        async flagPolicyViolations(reportId) {
            return await this.sequelize.transaction(async (t) => {
                const violatingExpenses = await this.sequelize.query(`
        SELECT ei.id FROM "ExpenseItems" ei
        JOIN "ExpenseReports" er ON ei."reportId" = er.id
        WHERE er.id = :reportId
          AND (
            ei.amount > (
              SELECT COALESCE(max_amount_per_expense, 0)
              FROM "ExpenseLimits" el
              WHERE el.category = ei.category AND el.is_active = true
            )
            OR ei.category NOT IN (
              SELECT category FROM "ExpensePolicies"
              WHERE is_allowed = true
                AND (department IS NULL OR department = er."employeeId"::text)
            )
          )
      `, {
                    replacements: { reportId },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const expenseIds = violatingExpenses.map((e) => e.id);
                if (expenseIds.length > 0) {
                    await this.sequelize.models.ExpenseItem.update({ flagged: true, policyCompliant: false }, { where: { id: expenseIds }, transaction: t });
                }
                return expenseIds.length;
            });
        }
        /**
         * 16. Override Policy Violation
         * Approve flagged expense with override reason
         */
        async overridePolicyViolation(expenseId, approverId, reason) {
            return await this.sequelize.transaction(async (t) => {
                const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                    transaction: t,
                });
                if (!expense)
                    throw new Error('Expense not found');
                await expense.update({ flagged: false, policyCompliant: true }, { transaction: t });
                // Create override audit record
                await this.sequelize.models.PolicyOverride.create({
                    expenseId,
                    approverId,
                    reason,
                    overriddenAt: new Date(),
                }, { transaction: t });
                return expense.toJSON();
            });
        }
    };
    __setFunctionName(_classThis, "PolicyComplianceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PolicyComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PolicyComplianceService = _classThis;
})();
exports.PolicyComplianceService = PolicyComplianceService;
// ============================================================================
// APPROVALS (Functions 17-20)
// ============================================================================
let ApprovalWorkflowService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApprovalWorkflowService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 17. Route Report for Approval
         * Determine approval chain and route based on rules
         */
        async routeReportForApproval(reportId) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    include: [
                        {
                            model: this.sequelize.models.Employee,
                            as: 'employee',
                        },
                    ],
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                // Get approval chain based on amount and department
                const approvalChain = await this.sequelize.query(`
        SELECT
          RANK() OVER (ORDER BY min_amount DESC) as step_order,
          approver_id
        FROM "ApprovalRules"
        WHERE (department = :department OR department IS NULL)
          AND (max_amount >= :totalAmount OR max_amount IS NULL)
          AND is_active = true
        ORDER BY min_amount DESC
      `, {
                    replacements: {
                        department: report.employee?.department,
                        totalAmount: report.totalAmount,
                    },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const steps = await Promise.all(approvalChain.map((rule) => this.sequelize.models.ApprovalStep.create({
                    reportId,
                    approverUserId: rule.approver_id,
                    stepOrder: rule.step_order,
                    status: 'pending',
                }, { transaction: t })));
                return steps.map((s) => s.toJSON());
            });
        }
        /**
         * 18. Approve Approval Step
         * Mark individual approval step as approved
         */
        async approveApprovalStep(stepId, approverId) {
            return await this.sequelize.transaction(async (t) => {
                const step = await this.sequelize.models.ApprovalStep.findByPk(stepId, {
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!step || step.status !== 'pending') {
                    throw new Error('Invalid approval step');
                }
                if (step.approverUserId !== approverId) {
                    throw new Error('User not authorized for this step');
                }
                await step.update({ status: 'approved', approvalDate: new Date() }, { transaction: t });
                return step.toJSON();
            });
        }
        /**
         * 19. Escalate Approval
         * Escalate report to higher authority for urgent processing
         */
        async escalateApproval(reportId, reason, userId) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                const currentStep = await this.sequelize.models.ApprovalStep.findOne({
                    where: { reportId, status: 'pending' },
                    order: [['stepOrder', 'ASC']],
                    transaction: t,
                });
                if (!currentStep)
                    throw new Error('No pending approvals');
                // Create escalation step
                const escalationStep = await this.sequelize.models.ApprovalStep.create({
                    reportId,
                    approverUserId: 'CFO', // Route to CFO or escalation group
                    stepOrder: (currentStep.stepOrder || 0) + 100,
                    status: 'pending',
                }, { transaction: t });
                await currentStep.update({ status: 'escalated', escalatedAt: new Date() }, { transaction: t });
                // Audit log
                await this.sequelize.models.AuditLog.create({
                    reportId,
                    action: 'ESCALATED',
                    userId,
                    details: reason,
                }, { transaction: t });
                return escalationStep.toJSON();
            });
        }
        /**
         * 20. Finalize Report Approval
         * Complete all approval steps and mark report as approved
         */
        async finalizeReportApproval(reportId) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                // Check all approval steps completed
                const pendingSteps = await this.sequelize.models.ApprovalStep.count({
                    where: { reportId, status: 'pending' },
                    transaction: t,
                });
                if (pendingSteps > 0) {
                    throw new Error('Not all approval steps completed');
                }
                await report.update({ status: 'approved', approvedAt: new Date() }, { transaction: t });
                return report.toJSON();
            });
        }
    };
    __setFunctionName(_classThis, "ApprovalWorkflowService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalWorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalWorkflowService = _classThis;
})();
exports.ApprovalWorkflowService = ApprovalWorkflowService;
// ============================================================================
// MILEAGE (Functions 21-24)
// ============================================================================
let MileageService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MileageService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 21. Calculate Mileage
         * Compute mileage distance between two locations
         */
        async calculateMileage(startLocation, endLocation, routeType = 'shortest') {
            // Integrate with mapping API (Google Maps, Mapbox)
            // For now, use simplified calculation
            const distance = Math.random() * 500; // Placeholder
            return Math.round(distance * 10) / 10;
        }
        /**
         * 22. Apply Mileage Rate
         * Calculate reimbursement amount based on IRS/company rate
         */
        async applyMileageRate(reportId, miles) {
            return await this.sequelize.transaction(async (t) => {
                // Get current mileage rate
                const rate = await this.sequelize.query(`
        SELECT rate FROM "MileageRates"
        WHERE is_active = true
        ORDER BY "effectiveDate" DESC
        LIMIT 1
      `, {
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const mileageRate = rate[0]?.rate || 0.58; // IRS standard rate
                const totalAmount = miles * mileageRate;
                const entry = await this.sequelize.models.MileageEntry.create({
                    reportId,
                    miles,
                    rate: mileageRate,
                    totalAmount,
                }, { transaction: t });
                // Add to report total
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                await report.update({ totalAmount: (report.totalAmount || 0) + totalAmount }, { transaction: t });
                return entry.toJSON();
            });
        }
        /**
         * 23. Validate Mileage Route
         * Check route feasibility and flag suspicious entries
         */
        async validateMileageRoute(mileageId) {
            const entry = await this.sequelize.models.MileageEntry.findByPk(mileageId);
            if (!entry)
                throw new Error('Mileage entry not found');
            const warnings = [];
            // Check if miles seem reasonable for stated locations
            if (entry.miles > 1000) {
                warnings.push('Mileage appears excessive for stated route');
            }
            // Check duplicate routes on same day
            const duplicates = await this.sequelize.query(`
      SELECT COUNT(*) as count FROM "MileageEntries"
      WHERE "reportId" != :reportId
        AND "startLocation" = :startLocation
        AND "endLocation" = :endLocation
        AND DATE(date) = DATE(:date)
    `, {
                replacements: {
                    reportId: entry.reportId,
                    startLocation: entry.startLocation,
                    endLocation: entry.endLocation,
                    date: entry.startDate,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (duplicates[0]?.count > 0) {
                warnings.push('Duplicate route found on same date');
            }
            return { valid: warnings.length === 0, warnings };
        }
        /**
         * 24. Add Mileage to Report
         * Create and link mileage entry to expense report
         */
        async addMileageToReport(reportId, startLocation, endLocation, miles, purpose) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                // Get mileage rate
                const rate = await this.sequelize.query(`
        SELECT rate FROM "MileageRates"
        WHERE is_active = true
        ORDER BY "effectiveDate" DESC
        LIMIT 1
      `, {
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const mileageRate = rate[0]?.rate || 0.58;
                const totalAmount = miles * mileageRate;
                const entry = await this.sequelize.models.MileageEntry.create({
                    reportId,
                    startLocation,
                    endLocation,
                    miles,
                    rate: mileageRate,
                    totalAmount,
                    purpose,
                }, { transaction: t });
                // Update report total
                await report.increment('totalAmount', { by: totalAmount, transaction: t });
                return entry.toJSON();
            });
        }
    };
    __setFunctionName(_classThis, "MileageService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MileageService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MileageService = _classThis;
})();
exports.MileageService = MileageService;
// ============================================================================
// PER DIEM (Functions 25-28)
// ============================================================================
let PerDiemService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PerDiemService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 25. Calculate Per Diem
         * Compute daily meal and lodging allowances for location
         */
        async calculatePerDiem(location, country, date) {
            const rates = await this.sequelize.query(`
      SELECT meal_allowance, lodging_allowance FROM "PerDiemRates"
      WHERE location = :location OR (location IS NULL AND country = :country)
        AND is_active = true
        AND :date >= "effectiveDate"
      ORDER BY location DESC NULLS LAST, "effectiveDate" DESC
      LIMIT 1
    `, {
                replacements: { location, country, date },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const mealAllowance = rates[0]?.meal_allowance || 60;
            const lodgingAllowance = rates[0]?.lodging_allowance || 150;
            return {
                mealAllowance,
                lodgingAllowance,
                total: mealAllowance + lodgingAllowance,
            };
        }
        /**
         * 26. Apply Per Diem Rate
         * Link per diem calculation to expense report
         */
        async applyPerDiemRate(reportId, location, country, date) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                const { mealAllowance, lodgingAllowance, total } = await this.calculatePerDiem(location, country, date);
                const entry = await this.sequelize.models.PerDiemEntry.create({
                    reportId,
                    date,
                    location,
                    country,
                    mealAllowance,
                    lodgingAllowance,
                    totalAllowance: total,
                }, { transaction: t });
                // Update report total
                await report.increment('totalAmount', { by: total, transaction: t });
                return entry.toJSON();
            });
        }
        /**
         * 27. Validate Location Per Diem
         * Verify location eligibility and special circumstances
         */
        async validateLocationPerDiem(location, country) {
            const locationPolicy = await this.sequelize.query(`
      SELECT is_eligible, restrictions FROM "PerDiemLocations"
      WHERE location = :location AND country = :country
        AND is_active = true
    `, {
                replacements: { location, country },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (!locationPolicy[0]) {
                return { eligible: false, restrictions: 'Location not found in approved list' };
            }
            return {
                eligible: locationPolicy[0].is_eligible,
                restrictions: locationPolicy[0].restrictions,
            };
        }
        /**
         * 28. Add Per Diem to Report
         * Link multiple per diem entries for multi-day trip
         */
        async addPerDiemToReport(reportId, entries) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report)
                    throw new Error('Report not found');
                let totalAmount = 0;
                const createdEntries = await Promise.all(entries.map(async (entry) => {
                    const { total } = await this.calculatePerDiem(entry.location, entry.country, entry.date);
                    totalAmount += total;
                    return this.sequelize.models.PerDiemEntry.create({
                        reportId,
                        date: entry.date,
                        location: entry.location,
                        country: entry.country,
                        mealAllowance: total * 0.4,
                        lodgingAllowance: total * 0.6,
                        totalAllowance: total,
                    }, { transaction: t });
                }));
                // Update report total
                await report.increment('totalAmount', { by: totalAmount, transaction: t });
                return createdEntries.map((e) => e.toJSON());
            });
        }
    };
    __setFunctionName(_classThis, "PerDiemService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerDiemService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerDiemService = _classThis;
})();
exports.PerDiemService = PerDiemService;
// ============================================================================
// REIMBURSEMENT (Functions 29-32)
// ============================================================================
let ReimbursementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReimbursementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 29. Calculate Reimbursement
         * Compute final reimbursement amount for approved report
         */
        async calculateReimbursement(reportId) {
            const report = await this.sequelize.models.ExpenseReport.findByPk(reportId);
            if (!report || report.status !== 'approved') {
                throw new Error('Report must be approved for reimbursement');
            }
            // Get all expenses and deductions
            const calculation = await this.sequelize.query(`
      SELECT
        COALESCE(SUM(CASE WHEN ei."policyCompliant" THEN ei.amount ELSE 0 END), 0) as compliant_amount,
        COALESCE(SUM(CASE WHEN NOT ei."policyCompliant" THEN ei.amount ELSE 0 END), 0) as non_compliant_amount,
        COUNT(CASE WHEN ei.flagged THEN 1 END) as flagged_count
      FROM "ExpenseItems" ei
      WHERE ei."reportId" = :reportId
    `, {
                replacements: { reportId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            // Include mileage and per diem
            const otherExpenses = await this.sequelize.query(`
      SELECT
        COALESCE(SUM(me."totalAmount"), 0) as mileage_total,
        COALESCE(SUM(pd."totalAllowance"), 0) as perdiem_total
      FROM "MileageEntries" me
      FULL OUTER JOIN "PerDiemEntries" pd ON true
      WHERE me."reportId" = :reportId OR pd."reportId" = :reportId
    `, {
                replacements: { reportId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const compliantAmount = calculation[0]?.compliant_amount || 0;
            const mileageAmount = otherExpenses[0]?.mileage_total || 0;
            const perDiemAmount = otherExpenses[0]?.perdiem_total || 0;
            return compliantAmount + mileageAmount + perDiemAmount;
        }
        /**
         * 30. Process Reimbursement Payment
         * Initiate payment to employee via selected method
         */
        async processReimbursementPayment(reportId, paymentMethod, bankDetails) {
            return await this.sequelize.transaction(async (t) => {
                const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
                    transaction: t,
                });
                if (!report || report.status !== 'approved') {
                    throw new Error('Report must be approved before processing payment');
                }
                const amount = await this.calculateReimbursement(reportId);
                const reimbursement = await this.sequelize.models.Reimbursement.create({
                    reportId,
                    employeeId: report.employeeId,
                    amount,
                    currency: report.currency,
                    status: 'processed',
                    paymentMethod,
                    processedAt: new Date(),
                    bankReference: bankDetails?.reference,
                }, { transaction: t });
                // Queue payment processing job
                await this.sequelize.models.PaymentQueue.create({
                    reimbursementId: reimbursement.id,
                    status: 'queued',
                    paymentMethod,
                    bankDetails: JSON.stringify(bankDetails),
                }, { transaction: t });
                return reimbursement.toJSON();
            });
        }
        /**
         * 31. Track Reimbursement Status
         * Monitor reimbursement progress and payment status
         */
        async trackReimbursementStatus(reimbursementId) {
            const reimbursement = await this.sequelize.models.Reimbursement.findByPk(reimbursementId, {
                include: [
                    {
                        model: this.sequelize.models.PaymentQueue,
                        as: 'paymentQueue',
                    },
                ],
            });
            if (!reimbursement)
                throw new Error('Reimbursement not found');
            // Check payment processor status and update
            if (reimbursement.paymentQueue?.status === 'processed') {
                await reimbursement.update({ status: 'paid', paidAt: new Date() });
            }
            return reimbursement.toJSON();
        }
        /**
         * 32. Report Reimbursement Analytics
         * Generate reimbursement statistics and trends
         */
        async reportReimbursementAnalytics(startDate, endDate) {
            const stats = await this.sequelize.query(`
      SELECT
        COALESCE(SUM(amount), 0) as total_reimbursed,
        COALESCE(AVG(amount), 0) as average_reimbursement,
        COALESCE(AVG(EXTRACT(EPOCH FROM ("paidAt" - "processedAt"))) / 3600 / 24, 0) as avg_days_to_pay,
        payment_method,
        COUNT(*) as count
      FROM "Reimbursements"
      WHERE status IN ('processed', 'paid')
        AND "processedAt" BETWEEN :startDate AND :endDate
      GROUP BY payment_method
    `, {
                replacements: { startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const paymentMethodBreakdown = {};
            let totalReimbursed = 0;
            let averageReimbursement = 0;
            let processingTime = 0;
            stats.forEach((stat) => {
                totalReimbursed += stat.total_reimbursed;
                averageReimbursement += stat.average_reimbursement;
                processingTime += stat.avg_days_to_pay;
                paymentMethodBreakdown[stat.payment_method] = stat.count;
            });
            return {
                totalReimbursed,
                averageReimbursement: averageReimbursement / stats.length,
                processingTime: processingTime / stats.length,
                paymentMethodBreakdown,
            };
        }
    };
    __setFunctionName(_classThis, "ReimbursementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReimbursementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReimbursementService = _classThis;
})();
exports.ReimbursementService = ReimbursementService;
// ============================================================================
// CORPORATE CARD (Functions 33-36)
// ============================================================================
let CorporateCardService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CorporateCardService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 33. Import Corporate Card Transactions
         * Bulk load credit card statement transactions
         */
        async importCorporateCardTransactions(cardId, transactions) {
            return await this.sequelize.transaction(async (t) => {
                const card = await this.sequelize.models.CorporateCard.findByPk(cardId, {
                    transaction: t,
                });
                if (!card)
                    throw new Error('Corporate card not found');
                const createdCount = await this.sequelize.models.CardTransaction.bulkCreate(transactions.map((tx) => ({
                    cardId,
                    date: tx.date,
                    vendor: tx.vendor,
                    amount: tx.amount,
                    description: tx.description,
                    transactionId: tx.transactionId,
                    reconciled: false,
                })), { transaction: t, ignoreDuplicates: true });
                // Update card balance
                const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
                await card.increment('currentBalance', { by: totalAmount, transaction: t });
                return createdCount.length;
            });
        }
        /**
         * 34. Match Card Receipts to Transactions
         * Link receipts and expenses to card transactions
         */
        async matchCardReceiptsToTransactions(cardTransactionId, expenseId) {
            return await this.sequelize.transaction(async (t) => {
                const [cardTx, expense] = await Promise.all([
                    this.sequelize.models.CardTransaction.findByPk(cardTransactionId, { transaction: t }),
                    this.sequelize.models.ExpenseItem.findByPk(expenseId, {
                        include: [{ model: this.sequelize.models.Receipt, as: 'receipts' }],
                        transaction: t,
                    }),
                ]);
                if (!cardTx || !expense)
                    throw new Error('Card transaction or expense not found');
                // Check amount match (allow 5% variance)
                const discrepancy = Math.abs(cardTx.amount - expense.amount);
                const percentDiff = (discrepancy / cardTx.amount) * 100;
                const matched = percentDiff <= 5;
                // Check date proximity (within 3 days)
                const daysDiff = Math.abs((cardTx.date.getTime() - expense.date.getTime()) / (1000 * 60 * 60 * 24));
                const dateMatch = daysDiff <= 3;
                if (matched && dateMatch) {
                    await cardTx.update({ expenseId, reconciled: true, matchedAt: new Date() }, { transaction: t });
                    return { matched: true };
                }
                return { matched: false, discrepancy: percentDiff };
            });
        }
        /**
         * 35. Reconcile Corporate Card
         * Match all card transactions to expenses and identify discrepancies
         */
        async reconcileCorporateCard(cardId) {
            return await this.sequelize.transaction(async (t) => {
                const unmatched = await this.sequelize.query(`
        SELECT ct.id, ct.amount, ct.vendor, ct.date
        FROM "CardTransactions" ct
        WHERE ct."cardId" = :cardId
          AND ct."expenseId" IS NULL
          AND DATE(ct.date) >= DATE(CURRENT_DATE) - INTERVAL '90 days'
      `, {
                    replacements: { cardId },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const reconciled = await this.sequelize.query(`
        SELECT COUNT(*) as count FROM "CardTransactions"
        WHERE "cardId" = :cardId AND "reconciled" = true
      `, {
                    replacements: { cardId },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction: t,
                });
                const discrepancies = unmatched.map((tx) => ({
                    transactionId: tx.id,
                    amount: tx.amount,
                    issue: `Unmatched ${tx.vendor} transaction on ${tx.date}`,
                }));
                // Flag card for review if too many unmatched transactions
                if (unmatched.length > reconciled[0]?.count * 0.1) {
                    await this.sequelize.models.CorporateCard.update({ status: 'requires_review' }, { where: { id: cardId }, transaction: t });
                }
                return {
                    reconciled: reconciled[0]?.count || 0,
                    unmatched: unmatched.length,
                    discrepancies,
                };
            });
        }
        /**
         * 36. Report Corporate Card Analytics
         * Generate card usage and reconciliation reports
         */
        async reportCorporateCardAnalytics(cardId, startDate, endDate) {
            const stats = await this.sequelize.query(`
      SELECT
        COALESCE(SUM(ct.amount), 0) as total_spend,
        COALESCE(SUM(CASE WHEN ct."expenseId" IS NULL THEN ct.amount ELSE 0 END), 0) as unmatched_amount,
        COUNT(CASE WHEN ct."reconciled" THEN 1 END)::float / NULLIF(COUNT(*), 0) as reconciliation_rate,
        ct.vendor,
        COUNT(*) as transaction_count
      FROM "CardTransactions" ct
      WHERE ct."cardId" = :cardId
        AND ct.date BETWEEN :startDate AND :endDate
      GROUP BY ct.vendor
      ORDER BY SUM(ct.amount) DESC
      LIMIT 10
    `, {
                replacements: { cardId, startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            let totalSpend = 0;
            let unmatchedAmount = 0;
            let reconciliationRate = 0;
            const topVendors = [];
            stats.forEach((stat, index) => {
                totalSpend += stat.total_spend;
                unmatchedAmount += stat.unmatched_amount;
                reconciliationRate = stat.reconciliation_rate || 0;
                topVendors.push({
                    vendor: stat.vendor,
                    amount: stat.total_spend,
                    count: stat.transaction_count,
                });
            });
            return {
                totalSpend,
                unmatchedAmount,
                reconciliationRate: reconciliationRate * 100,
                topVendors,
            };
        }
    };
    __setFunctionName(_classThis, "CorporateCardService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CorporateCardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CorporateCardService = _classThis;
})();
exports.CorporateCardService = CorporateCardService;
// ============================================================================
// ANALYTICS & REPORTING (Functions 37-40)
// ============================================================================
let ExpenseAnalyticsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpenseAnalyticsService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        /**
         * 37. Expense Analytics Report
         * Comprehensive expense analysis with trends and patterns
         */
        async expenseAnalyticsReport(startDate, endDate) {
            const analytics = await this.sequelize.query(`
      SELECT
        COUNT(ei.id) as total_expenses,
        COALESCE(SUM(ei.amount), 0) as total_amount,
        COALESCE(AVG(ei.amount), 0) as average_amount,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ei.amount) as median_amount,
        COUNT(CASE WHEN er.status = 'approved' THEN 1 END)::float / NULLIF(COUNT(er.id), 0) as approval_rate,
        COALESCE(AVG(EXTRACT(EPOCH FROM (er."approvedAt" - er."submittedAt"))) / 3600 / 24, 0) as avg_approval_days,
        COUNT(CASE WHEN ei.flagged THEN 1 END) as policy_violations
      FROM "ExpenseItems" ei
      JOIN "ExpenseReports" er ON ei."reportId" = er.id
      WHERE ei.date BETWEEN :startDate AND :endDate
    `, {
                replacements: { startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            // Get spending by category
            const byCategory = await this.sequelize.query(`
      SELECT
        ei.category,
        SUM(ei.amount) as total
      FROM "ExpenseItems" ei
      WHERE ei.date BETWEEN :startDate AND :endDate
      GROUP BY ei.category
      ORDER BY SUM(ei.amount) DESC
    `, {
                replacements: { startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const spendByCategory = {};
            byCategory.forEach((row) => {
                spendByCategory[row.category] = row.total;
            });
            const stats = analytics[0];
            return {
                totalExpenses: stats.total_expenses,
                totalAmount: stats.total_amount,
                averageAmount: stats.average_amount,
                medianAmount: stats.median_amount,
                spendByCategory,
                approvalRate: (stats.approval_rate || 0) * 100,
                avgApprovalTime: stats.avg_approval_days,
                policyViolations: stats.policy_violations,
            };
        }
        /**
         * 38. Budget Tracking Report
         * Monitor spending against departmental budgets
         */
        async budgetTrackingReport(department, fiscalYear) {
            const budget = await this.sequelize.query(`
      SELECT budget_amount FROM "DepartmentBudgets"
      WHERE department = :department
        AND fiscal_year = :fiscalYear
        AND is_active = true
    `, {
                replacements: { department, fiscalYear },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const spending = await this.sequelize.query(`
      SELECT
        TO_CHAR(ei.date, 'YYYY-MM') as month,
        SUM(ei.amount) as amount
      FROM "ExpenseItems" ei
      JOIN "ExpenseReports" er ON ei."reportId" = er.id
      WHERE er."employeeId" IN (
        SELECT id FROM "Employees" WHERE department = :department
      )
        AND EXTRACT(YEAR FROM ei.date) = :fiscalYear
      GROUP BY TO_CHAR(ei.date, 'YYYY-MM')
      ORDER BY month ASC
    `, {
                replacements: { department, fiscalYear },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const budgetLimit = budget[0]?.budget_amount || 0;
            const spent = spending.reduce((sum, row) => sum + row.amount, 0);
            const remaining = budgetLimit - spent;
            const percentUsed = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0;
            const trends = spending.map((row) => ({
                month: row.month,
                amount: row.amount,
            }));
            return {
                budgetLimit,
                spent,
                remaining,
                percentUsed,
                trends,
            };
        }
        /**
         * 39. Spend by Category Report
         * Detailed breakdown of expenses by category
         */
        async spendByCategoryReport(startDate, endDate) {
            const report = await this.sequelize.query(`
      SELECT
        ei.category,
        COUNT(*) as count,
        SUM(ei.amount) as total_amount,
        AVG(ei.amount) as average_amount,
        COUNT(CASE WHEN ei."policyCompliant" THEN 1 END)::float / NULLIF(COUNT(*), 0) as compliance_rate
      FROM "ExpenseItems" ei
      WHERE ei.date BETWEEN :startDate AND :endDate
      GROUP BY ei.category
      ORDER BY SUM(ei.amount) DESC
    `, {
                replacements: { startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return report.map((row) => ({
                category: row.category,
                count: row.count,
                totalAmount: row.total_amount,
                averageAmount: row.average_amount,
                policyCompliantRate: (row.compliance_rate || 0) * 100,
            }));
        }
        /**
         * 40. Export Expense Data
         * Export comprehensive expense data in multiple formats
         */
        async exportExpenseData(startDate, endDate, format = 'csv') {
            const data = await this.sequelize.query(`
      SELECT
        er.id as report_id,
        er."employeeId",
        er."reportName",
        er.status,
        er."totalAmount",
        ei.id as expense_id,
        ei.description,
        ei.amount,
        ei.category,
        ei.date,
        ei."policyCompliant",
        ei.flagged,
        COALESCE(r.filename, 'N/A') as receipt,
        er."submittedAt",
        er."approvedAt"
      FROM "ExpenseReports" er
      LEFT JOIN "ExpenseItems" ei ON er.id = ei."reportId"
      LEFT JOIN "Receipts" r ON ei.id = r."expenseId"
      WHERE er."createdAt" BETWEEN :startDate AND :endDate
      ORDER BY er.id, ei.id
    `, {
                replacements: { startDate, endDate },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            }
            else if (format === 'csv') {
                const headers = Object.keys(data[0] || {});
                const csv = [
                    headers.join(','),
                    ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(',')),
                ].join('\n');
                return csv;
            }
            else if (format === 'excel') {
                // Excel export would use a library like xlsx
                return JSON.stringify(data);
            }
            return '';
        }
    };
    __setFunctionName(_classThis, "ExpenseAnalyticsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpenseAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpenseAnalyticsService = _classThis;
})();
exports.ExpenseAnalyticsService = ExpenseAnalyticsService;
//# sourceMappingURL=expense-tracking-management-kit.js.map
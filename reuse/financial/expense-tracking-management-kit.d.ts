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
import { Sequelize } from 'sequelize';
export interface ExpenseReport {
    id: string;
    employeeId: string;
    reportName: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
    totalAmount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    submittedAt?: Date;
    approvedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExpenseItem {
    id: string;
    reportId: string;
    description: string;
    amount: number;
    currency: string;
    category: string;
    date: Date;
    receiptId?: string;
    policyCompliant: boolean;
    flagged: boolean;
    createdAt: Date;
}
export interface Receipt {
    id: string;
    expenseId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    s3Url: string;
    ocrData?: Record<string, unknown>;
    extractedAmount?: number;
    extractedDate?: Date;
    extractedVendor?: string;
    validationStatus: 'pending' | 'validated' | 'rejected';
    validationErrors?: string[];
    createdAt: Date;
}
export interface ApprovalStep {
    id: string;
    reportId: string;
    approverUserId: string;
    stepOrder: number;
    status: 'pending' | 'approved' | 'rejected' | 'escalated';
    approvalDate?: Date;
    rejectionReason?: string;
    escalatedAt?: Date;
    createdAt: Date;
}
export interface MileageEntry {
    id: string;
    reportId: string;
    startDate: Date;
    startLocation: string;
    endLocation: string;
    miles: number;
    rate: number;
    totalAmount: number;
    purpose: string;
    roadsideAssistance?: boolean;
    createdAt: Date;
}
export interface PerDiemEntry {
    id: string;
    reportId: string;
    date: Date;
    location: string;
    country: string;
    mealAllowance: number;
    lodgingAllowance: number;
    totalAllowance: number;
    createdAt: Date;
}
export interface CorporateCard {
    id: string;
    employeeId: string;
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    status: 'active' | 'suspended' | 'cancelled';
    creditLimit: number;
    currentBalance: number;
    lastReconcileDate: Date;
    createdAt: Date;
}
export interface Reimbursement {
    id: string;
    reportId: string;
    employeeId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processed' | 'paid' | 'cancelled';
    paymentMethod: 'direct_deposit' | 'check' | 'corporate_card';
    processedAt?: Date;
    paidAt?: Date;
    bankReference?: string;
    createdAt: Date;
}
export interface ExpenseAnalytics {
    totalExpenses: number;
    totalAmount: number;
    averageAmount: number;
    medianAmount: number;
    spendByCategory: Record<string, number>;
    approvalRate: number;
    avgApprovalTime: number;
    policyViolations: number;
}
export declare class ExpenseReportService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 1. Create Expense Report
     * Creates new expense report with initial validation
     */
    createExpenseReport(employeeId: string, reportName: string, startDate: Date, endDate: Date): Promise<ExpenseReport>;
    /**
     * 2. Submit Expense Report
     * Validates all expenses before submission
     */
    submitExpenseReport(reportId: string, userId: string): Promise<ExpenseReport>;
    /**
     * 3. Approve Expense Report
     * Multi-level approval with escalation support
     */
    approveExpenseReport(reportId: string, approverId: string): Promise<ExpenseReport>;
    /**
     * 4. Reject Expense Report
     * Reject with detailed reason and return to employee
     */
    rejectExpenseReport(reportId: string, approverId: string, rejectionReason: string): Promise<ExpenseReport>;
}
export declare class ReceiptService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 5. Attach Receipt to Expense
     * Upload and store receipt metadata
     */
    attachReceipt(expenseId: string, fileName: string, mimeType: string, fileSize: number, s3Url: string): Promise<Receipt>;
    /**
     * 6. OCR Scan Receipt
     * Extract data from receipt image using OCR
     */
    ocrScanReceipt(receiptId: string, ocrData: Record<string, unknown>): Promise<Receipt>;
    /**
     * 7. Validate Receipt
     * Check receipt format, amount, and compliance
     */
    validateReceipt(receiptId: string): Promise<Receipt>;
    /**
     * 8. Link Receipt to Expense
     * Associate receipt with expense item and update metadata
     */
    linkReceiptToExpense(receiptId: string, expenseId: string): Promise<{
        receipt: Receipt;
        expense: ExpenseItem;
    }>;
}
export declare class CategorizationService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 9. Categorize Expense
     * Manually assign category with validation
     */
    categorizeExpense(expenseId: string, category: string, vendor?: string): Promise<ExpenseItem>;
    /**
     * 10. Auto-Categorize Expense
     * Use ML/heuristics to auto-classify based on vendor/description
     */
    autoCategorizeExpense(expenseId: string): Promise<ExpenseItem>;
    /**
     * 11. Validate Expense Category
     * Check category compliance with policy rules
     */
    validateExpenseCategory(expenseId: string): Promise<boolean>;
    /**
     * 12. Reclassify Expense
     * Move expense to different category with audit trail
     */
    reclassifyExpense(expenseId: string, newCategory: string, reason: string, userId: string): Promise<ExpenseItem>;
    private extractVendorFromDescription;
}
export declare class PolicyComplianceService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 13. Validate Policy Compliance
     * Check expense against company spending policies
     */
    validatePolicyCompliance(expenseId: string): Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    /**
     * 14. Check Spending Limits
     * Get remaining budget for category/employee
     */
    checkSpendingLimits(employeeId: string, category: string): Promise<{
        limit: number;
        spent: number;
        remaining: number;
    }>;
    /**
     * 15. Flag Policy Violations
     * Identify and flag expenses violating company policies
     */
    flagPolicyViolations(reportId: string): Promise<number>;
    /**
     * 16. Override Policy Violation
     * Approve flagged expense with override reason
     */
    overridePolicyViolation(expenseId: string, approverId: string, reason: string): Promise<ExpenseItem>;
}
export declare class ApprovalWorkflowService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 17. Route Report for Approval
     * Determine approval chain and route based on rules
     */
    routeReportForApproval(reportId: string): Promise<ApprovalStep[]>;
    /**
     * 18. Approve Approval Step
     * Mark individual approval step as approved
     */
    approveApprovalStep(stepId: string, approverId: string): Promise<ApprovalStep>;
    /**
     * 19. Escalate Approval
     * Escalate report to higher authority for urgent processing
     */
    escalateApproval(reportId: string, reason: string, userId: string): Promise<ApprovalStep>;
    /**
     * 20. Finalize Report Approval
     * Complete all approval steps and mark report as approved
     */
    finalizeReportApproval(reportId: string): Promise<ExpenseReport>;
}
export declare class MileageService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 21. Calculate Mileage
     * Compute mileage distance between two locations
     */
    calculateMileage(startLocation: string, endLocation: string, routeType?: 'shortest' | 'fastest'): Promise<number>;
    /**
     * 22. Apply Mileage Rate
     * Calculate reimbursement amount based on IRS/company rate
     */
    applyMileageRate(reportId: string, miles: number): Promise<MileageEntry>;
    /**
     * 23. Validate Mileage Route
     * Check route feasibility and flag suspicious entries
     */
    validateMileageRoute(mileageId: string): Promise<{
        valid: boolean;
        warnings: string[];
    }>;
    /**
     * 24. Add Mileage to Report
     * Create and link mileage entry to expense report
     */
    addMileageToReport(reportId: string, startLocation: string, endLocation: string, miles: number, purpose: string): Promise<MileageEntry>;
}
export declare class PerDiemService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 25. Calculate Per Diem
     * Compute daily meal and lodging allowances for location
     */
    calculatePerDiem(location: string, country: string, date: Date): Promise<{
        mealAllowance: number;
        lodgingAllowance: number;
        total: number;
    }>;
    /**
     * 26. Apply Per Diem Rate
     * Link per diem calculation to expense report
     */
    applyPerDiemRate(reportId: string, location: string, country: string, date: Date): Promise<PerDiemEntry>;
    /**
     * 27. Validate Location Per Diem
     * Verify location eligibility and special circumstances
     */
    validateLocationPerDiem(location: string, country: string): Promise<{
        eligible: boolean;
        restrictions?: string;
    }>;
    /**
     * 28. Add Per Diem to Report
     * Link multiple per diem entries for multi-day trip
     */
    addPerDiemToReport(reportId: string, entries: Array<{
        date: Date;
        location: string;
        country: string;
    }>): Promise<PerDiemEntry[]>;
}
export declare class ReimbursementService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 29. Calculate Reimbursement
     * Compute final reimbursement amount for approved report
     */
    calculateReimbursement(reportId: string): Promise<number>;
    /**
     * 30. Process Reimbursement Payment
     * Initiate payment to employee via selected method
     */
    processReimbursementPayment(reportId: string, paymentMethod: 'direct_deposit' | 'check' | 'corporate_card', bankDetails?: Record<string, unknown>): Promise<Reimbursement>;
    /**
     * 31. Track Reimbursement Status
     * Monitor reimbursement progress and payment status
     */
    trackReimbursementStatus(reimbursementId: string): Promise<Reimbursement>;
    /**
     * 32. Report Reimbursement Analytics
     * Generate reimbursement statistics and trends
     */
    reportReimbursementAnalytics(startDate: Date, endDate: Date): Promise<{
        totalReimbursed: number;
        averageReimbursement: number;
        processingTime: number;
        paymentMethodBreakdown: Record<string, number>;
    }>;
}
export declare class CorporateCardService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 33. Import Corporate Card Transactions
     * Bulk load credit card statement transactions
     */
    importCorporateCardTransactions(cardId: string, transactions: Array<{
        date: Date;
        vendor: string;
        amount: number;
        description: string;
        transactionId: string;
    }>): Promise<number>;
    /**
     * 34. Match Card Receipts to Transactions
     * Link receipts and expenses to card transactions
     */
    matchCardReceiptsToTransactions(cardTransactionId: string, expenseId: string): Promise<{
        matched: boolean;
        discrepancy?: number;
    }>;
    /**
     * 35. Reconcile Corporate Card
     * Match all card transactions to expenses and identify discrepancies
     */
    reconcileCorporateCard(cardId: string): Promise<{
        reconciled: number;
        unmatched: number;
        discrepancies: Array<{
            transactionId: string;
            amount: number;
            issue: string;
        }>;
    }>;
    /**
     * 36. Report Corporate Card Analytics
     * Generate card usage and reconciliation reports
     */
    reportCorporateCardAnalytics(cardId: string, startDate: Date, endDate: Date): Promise<{
        totalSpend: number;
        unmatchedAmount: number;
        reconciliationRate: number;
        topVendors: Array<{
            vendor: string;
            amount: number;
            count: number;
        }>;
    }>;
}
export declare class ExpenseAnalyticsService {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * 37. Expense Analytics Report
     * Comprehensive expense analysis with trends and patterns
     */
    expenseAnalyticsReport(startDate: Date, endDate: Date): Promise<ExpenseAnalytics>;
    /**
     * 38. Budget Tracking Report
     * Monitor spending against departmental budgets
     */
    budgetTrackingReport(department: string, fiscalYear: number): Promise<{
        budgetLimit: number;
        spent: number;
        remaining: number;
        percentUsed: number;
        trends: Array<{
            month: string;
            amount: number;
        }>;
    }>;
    /**
     * 39. Spend by Category Report
     * Detailed breakdown of expenses by category
     */
    spendByCategoryReport(startDate: Date, endDate: Date): Promise<Array<{
        category: string;
        count: number;
        totalAmount: number;
        averageAmount: number;
        policyCompliantRate: number;
    }>>;
    /**
     * 40. Export Expense Data
     * Export comprehensive expense data in multiple formats
     */
    exportExpenseData(startDate: Date, endDate: Date, format?: 'csv' | 'excel' | 'json'): Promise<string>;
}
export { ExpenseReportService, ReceiptService, CategorizationService, PolicyComplianceService, ApprovalWorkflowService, MileageService, PerDiemService, ReimbursementService, CorporateCardService, ExpenseAnalyticsService, };
//# sourceMappingURL=expense-tracking-management-kit.d.ts.map
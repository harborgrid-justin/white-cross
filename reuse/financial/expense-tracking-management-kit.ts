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

import {
  Sequelize,
  Model,
  Op,
  fn,
  col,
  literal,
  where,
  QueryTypes,
  Transaction,
} from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS (8-10 Types)
// ============================================================================

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
  cardNumber: string; // Encrypted
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

// ============================================================================
// EXPENSE REPORTS (Functions 1-4)
// ============================================================================

@Injectable()
export class ExpenseReportService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 1. Create Expense Report
   * Creates new expense report with initial validation
   */
  async createExpenseReport(
    employeeId: string,
    reportName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseReport> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.create(
        {
          employeeId,
          reportName,
          status: 'draft',
          startDate,
          endDate,
          totalAmount: 0,
          currency: 'USD',
        },
        { transaction: t },
      );

      // Create default approval workflow
      await this.sequelize.models.ApprovalStep.create(
        { reportId: report.id, stepOrder: 1, status: 'pending' },
        { transaction: t },
      );

      return report.toJSON() as ExpenseReport;
    });
  }

  /**
   * 2. Submit Expense Report
   * Validates all expenses before submission
   */
  async submitExpenseReport(reportId: string, userId: string): Promise<ExpenseReport> {
    return await this.sequelize.transaction(async (t: Transaction) => {
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

      if (!report) throw new Error('Report not found');

      // Validate all receipts attached
      const unvalidatedReceipts = await this.sequelize.query(
        `
        SELECT COUNT(*) as count FROM "Receipts"
        WHERE "expenseId" IN (
          SELECT id FROM "ExpenseItems" WHERE "reportId" = :reportId
        ) AND "validationStatus" = 'pending'
      `,
        {
          replacements: { reportId },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      if (unvalidatedReceipts[0]?.count > 0) {
        throw new Error('All receipts must be validated before submission');
      }

      // Calculate total and check policy compliance
      const totals = await this.sequelize.query(
        `
        SELECT
          COALESCE(SUM(amount), 0) as total,
          COUNT(CASE WHEN "policyCompliant" = false THEN 1 END) as violations
        FROM "ExpenseItems"
        WHERE "reportId" = :reportId
      `,
        {
          replacements: { reportId },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      await report.update(
        {
          status: 'submitted',
          totalAmount: totals[0]?.total || 0,
          submittedAt: new Date(),
        },
        { transaction: t },
      );

      // Route to first approver
      await this.sequelize.models.ApprovalStep.update(
        { status: 'pending' },
        { where: { reportId, stepOrder: 1 }, transaction: t },
      );

      return report.toJSON() as ExpenseReport;
    });
  }

  /**
   * 3. Approve Expense Report
   * Multi-level approval with escalation support
   */
  async approveExpenseReport(reportId: string, approverId: string): Promise<ExpenseReport> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!report) throw new Error('Report not found');

      // Get current approval step
      const approvalStep = await this.sequelize.models.ApprovalStep.findOne(
        {
          where: { reportId, status: 'pending' },
          order: [['stepOrder', 'ASC']],
          transaction: t,
        },
      );

      if (!approvalStep) throw new Error('No pending approval steps');

      await approvalStep.update(
        { status: 'approved', approvalDate: new Date() },
        { transaction: t },
      );

      // Check if all steps are complete
      const nextStep = await this.sequelize.models.ApprovalStep.findOne({
        where: { reportId, status: 'pending' },
        order: [['stepOrder', 'ASC']],
        transaction: t,
      });

      if (!nextStep) {
        await report.update({ status: 'approved', approvedAt: new Date() }, { transaction: t });
      }

      return report.toJSON() as ExpenseReport;
    });
  }

  /**
   * 4. Reject Expense Report
   * Reject with detailed reason and return to employee
   */
  async rejectExpenseReport(
    reportId: string,
    approverId: string,
    rejectionReason: string,
  ): Promise<ExpenseReport> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      // Mark all pending approval steps as rejected
      await this.sequelize.models.ApprovalStep.update(
        { status: 'rejected', rejectionReason },
        { where: { reportId, status: 'pending' }, transaction: t },
      );

      await report.update(
        { status: 'rejected', rejectionReason },
        { transaction: t },
      );

      // Log rejection event
      await this.sequelize.models.AuditLog.create(
        {
          reportId,
          action: 'REPORT_REJECTED',
          userId: approverId,
          details: rejectionReason,
        },
        { transaction: t },
      );

      return report.toJSON() as ExpenseReport;
    });
  }
}

// ============================================================================
// RECEIPTS (Functions 5-8)
// ============================================================================

@Injectable()
export class ReceiptService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 5. Attach Receipt to Expense
   * Upload and store receipt metadata
   */
  async attachReceipt(
    expenseId: string,
    fileName: string,
    mimeType: string,
    fileSize: number,
    s3Url: string,
  ): Promise<Receipt> {
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
  async ocrScanReceipt(receiptId: string, ocrData: Record<string, unknown>): Promise<Receipt> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const receipt = await this.sequelize.models.Receipt.findByPk(receiptId, {
        transaction: t,
      });

      if (!receipt) throw new Error('Receipt not found');

      await receipt.update(
        {
          ocrData,
          extractedAmount: ocrData.amount as number,
          extractedDate: ocrData.date as Date,
          extractedVendor: ocrData.vendor as string,
        },
        { transaction: t },
      );

      // Link extracted amount to expense if not already set
      const expense = await this.sequelize.models.ExpenseItem.findByPk(
        receipt.expenseId,
        { transaction: t },
      );

      if (expense && !expense.amount && ocrData.amount) {
        await expense.update({ amount: ocrData.amount as number }, { transaction: t });
      }

      return receipt.toJSON() as Receipt;
    });
  }

  /**
   * 7. Validate Receipt
   * Check receipt format, amount, and compliance
   */
  async validateReceipt(receiptId: string): Promise<Receipt> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const receipt = await this.sequelize.models.Receipt.findByPk(receiptId, {
        include: [
          {
            model: this.sequelize.models.ExpenseItem,
            as: 'expense',
          },
        ],
        transaction: t,
      });

      if (!receipt) throw new Error('Receipt not found');

      const errors: string[] = [];

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
        const daysDiff = Math.floor(
          (Date.now() - receipt.extractedDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysDiff > 90) {
          errors.push('Receipt is older than 90 days');
        }
      }

      await receipt.update(
        {
          validationStatus: errors.length > 0 ? 'rejected' : 'validated',
          validationErrors: errors.length > 0 ? errors : null,
        },
        { transaction: t },
      );

      return receipt.toJSON() as Receipt;
    });
  }

  /**
   * 8. Link Receipt to Expense
   * Associate receipt with expense item and update metadata
   */
  async linkReceiptToExpense(
    receiptId: string,
    expenseId: string,
  ): Promise<{ receipt: Receipt; expense: ExpenseItem }> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const [receipt, expense] = await Promise.all([
        this.sequelize.models.Receipt.findByPk(receiptId, { transaction: t }),
        this.sequelize.models.ExpenseItem.findByPk(expenseId, { transaction: t }),
      ]);

      if (!receipt || !expense) throw new Error('Receipt or expense not found');

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
        receipt: receipt.toJSON() as Receipt,
        expense: expense.toJSON() as ExpenseItem,
      };
    });
  }
}

// ============================================================================
// CATEGORIZATION (Functions 9-12)
// ============================================================================

@Injectable()
export class CategorizationService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 9. Categorize Expense
   * Manually assign category with validation
   */
  async categorizeExpense(
    expenseId: string,
    category: string,
    vendor?: string,
  ): Promise<ExpenseItem> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
        transaction: t,
      });

      if (!expense) throw new Error('Expense not found');

      // Validate category against company list
      const validCategory = await this.sequelize.models.ExpenseCategory.findOne({
        where: { code: category, isActive: true },
        transaction: t,
      });

      if (!validCategory) throw new Error('Invalid expense category');

      await expense.update(
        { category, vendor },
        { transaction: t },
      );

      return expense.toJSON() as ExpenseItem;
    });
  }

  /**
   * 10. Auto-Categorize Expense
   * Use ML/heuristics to auto-classify based on vendor/description
   */
  async autoCategorizeExpense(expenseId: string): Promise<ExpenseItem> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
        include: [
          {
            model: this.sequelize.models.Receipt,
            as: 'receipts',
          },
        ],
        transaction: t,
      });

      if (!expense) throw new Error('Expense not found');

      // Extract vendor from receipt OCR or description
      const vendor =
        expense.receipts?.[0]?.extractedVendor ||
        this.extractVendorFromDescription(expense.description);

      // Query vendor-category mappings
      const mapping = await this.sequelize.query(
        `
        SELECT category FROM "VendorCategoryMappings"
        WHERE LOWER(vendor_name) LIKE LOWER(:vendor)
        AND is_active = true
        LIMIT 1
      `,
        {
          replacements: { vendor: `%${vendor}%` },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      let category = mapping[0]?.category;

      // Fallback to keyword matching
      if (!category) {
        const keywordMatch = await this.sequelize.query(
          `
          SELECT category FROM "ExpenseKeywords"
          WHERE LOWER(:description) LIKE LOWER(CONCAT('%', keyword, '%'))
          LIMIT 1
        `,
          {
            replacements: { description: expense.description },
            type: QueryTypes.SELECT,
            transaction: t,
          },
        );
        category = keywordMatch[0]?.category || 'miscellaneous';
      }

      await expense.update({ category }, { transaction: t });

      return expense.toJSON() as ExpenseItem;
    });
  }

  /**
   * 11. Validate Expense Category
   * Check category compliance with policy rules
   */
  async validateExpenseCategory(expenseId: string): Promise<boolean> {
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

    if (!expense) throw new Error('Expense not found');

    // Check policy restrictions by department and category
    const policyCheck = await this.sequelize.query(
      `
      SELECT is_allowed, requires_approval FROM "ExpensePolicies"
      WHERE category = :category
        AND (department = :department OR department IS NULL)
        AND is_active = true
      ORDER BY department DESC NULLS LAST
      LIMIT 1
    `,
      {
        replacements: {
          category: expense.category,
          department: expense.report?.employee?.department,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (!policyCheck[0]?.is_allowed) {
      throw new Error(`Category "${expense.category}" not allowed for this department`);
    }

    return true;
  }

  /**
   * 12. Reclassify Expense
   * Move expense to different category with audit trail
   */
  async reclassifyExpense(
    expenseId: string,
    newCategory: string,
    reason: string,
    userId: string,
  ): Promise<ExpenseItem> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
        transaction: t,
      });

      if (!expense) throw new Error('Expense not found');

      const oldCategory = expense.category;

      await expense.update({ category: newCategory }, { transaction: t });

      // Audit log
      await this.sequelize.models.AuditLog.create(
        {
          expenseId,
          action: 'RECLASSIFIED',
          userId,
          details: JSON.stringify({ oldCategory, newCategory, reason }),
        },
        { transaction: t },
      );

      return expense.toJSON() as ExpenseItem;
    });
  }

  private extractVendorFromDescription(description: string): string {
    // Simple extraction - can be enhanced with ML
    return description.split(' ').slice(0, 3).join(' ');
  }
}

// ============================================================================
// POLICY COMPLIANCE (Functions 13-16)
// ============================================================================

@Injectable()
export class PolicyComplianceService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 13. Validate Policy Compliance
   * Check expense against company spending policies
   */
  async validatePolicyCompliance(expenseId: string): Promise<{ compliant: boolean; issues: string[] }> {
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

    if (!expense) throw new Error('Expense not found');

    const issues: string[] = [];

    // Check amount limits by category
    const categoryLimit = await this.sequelize.query(
      `
      SELECT max_amount_per_expense, max_amount_per_month
      FROM "ExpenseLimits"
      WHERE category = :category AND is_active = true
    `,
      {
        replacements: { category: expense.category },
        type: QueryTypes.SELECT,
      },
    );

    if (categoryLimit[0]) {
      if (expense.amount > categoryLimit[0].max_amount_per_expense) {
        issues.push(`Exceeds single expense limit of $${categoryLimit[0].max_amount_per_expense}`);
      }
    }

    // Check monthly spending cap
    const monthlySpend = await this.sequelize.query(
      `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM "ExpenseItems" ei
      JOIN "ExpenseReports" er ON ei."reportId" = er.id
      WHERE er."employeeId" = :employeeId
        AND ei.category = :category
        AND EXTRACT(MONTH FROM ei.date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM ei.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `,
      {
        replacements: {
          employeeId: expense.report?.employeeId,
          category: expense.category,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (categoryLimit[0] && monthlySpend[0]?.total > categoryLimit[0].max_amount_per_month) {
      issues.push(`Monthly category limit of $${categoryLimit[0].max_amount_per_month} exceeded`);
    }

    // Check duplicate submission (same amount, vendor, date within 7 days)
    const duplicate = await this.sequelize.query(
      `
      SELECT COUNT(*) as count FROM "ExpenseItems"
      WHERE "reportId" != :reportId
        AND amount = :amount
        AND vendor = :vendor
        AND ABS(EXTRACT(DAY FROM (date - :date))) <= 7
    `,
      {
        replacements: {
          reportId: expense.reportId,
          amount: expense.amount,
          vendor: expense.vendor,
          date: expense.date,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (duplicate[0]?.count > 0) {
      issues.push('Possible duplicate expense (similar amount/vendor/date)');
    }

    const compliant = issues.length === 0;

    await this.sequelize.models.ExpenseItem.update(
      {
        policyCompliant: compliant,
        flagged: !compliant,
      },
      { where: { id: expenseId } },
    );

    return { compliant, issues };
  }

  /**
   * 14. Check Spending Limits
   * Get remaining budget for category/employee
   */
  async checkSpendingLimits(
    employeeId: string,
    category: string,
  ): Promise<{ limit: number; spent: number; remaining: number }> {
    const limits = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { employeeId, category },
        type: QueryTypes.SELECT,
      },
    );

    const limit = limits[0]?.limit || 0;
    const spent = limits[0]?.spent || 0;

    return { limit, spent, remaining: limit - spent };
  }

  /**
   * 15. Flag Policy Violations
   * Identify and flag expenses violating company policies
   */
  async flagPolicyViolations(reportId: string): Promise<number> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const violatingExpenses = await this.sequelize.query(
        `
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
      `,
        {
          replacements: { reportId },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const expenseIds = violatingExpenses.map((e: any) => e.id);

      if (expenseIds.length > 0) {
        await this.sequelize.models.ExpenseItem.update(
          { flagged: true, policyCompliant: false },
          { where: { id: expenseIds }, transaction: t },
        );
      }

      return expenseIds.length;
    });
  }

  /**
   * 16. Override Policy Violation
   * Approve flagged expense with override reason
   */
  async overridePolicyViolation(
    expenseId: string,
    approverId: string,
    reason: string,
  ): Promise<ExpenseItem> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const expense = await this.sequelize.models.ExpenseItem.findByPk(expenseId, {
        transaction: t,
      });

      if (!expense) throw new Error('Expense not found');

      await expense.update(
        { flagged: false, policyCompliant: true },
        { transaction: t },
      );

      // Create override audit record
      await this.sequelize.models.PolicyOverride.create(
        {
          expenseId,
          approverId,
          reason,
          overriddenAt: new Date(),
        },
        { transaction: t },
      );

      return expense.toJSON() as ExpenseItem;
    });
  }
}

// ============================================================================
// APPROVALS (Functions 17-20)
// ============================================================================

@Injectable()
export class ApprovalWorkflowService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 17. Route Report for Approval
   * Determine approval chain and route based on rules
   */
  async routeReportForApproval(reportId: string): Promise<ApprovalStep[]> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        include: [
          {
            model: this.sequelize.models.Employee,
            as: 'employee',
          },
        ],
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      // Get approval chain based on amount and department
      const approvalChain = await this.sequelize.query(
        `
        SELECT
          RANK() OVER (ORDER BY min_amount DESC) as step_order,
          approver_id
        FROM "ApprovalRules"
        WHERE (department = :department OR department IS NULL)
          AND (max_amount >= :totalAmount OR max_amount IS NULL)
          AND is_active = true
        ORDER BY min_amount DESC
      `,
        {
          replacements: {
            department: report.employee?.department,
            totalAmount: report.totalAmount,
          },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const steps = await Promise.all(
        approvalChain.map((rule: any) =>
          this.sequelize.models.ApprovalStep.create(
            {
              reportId,
              approverUserId: rule.approver_id,
              stepOrder: rule.step_order,
              status: 'pending',
            },
            { transaction: t },
          ),
        ),
      );

      return steps.map((s) => s.toJSON() as ApprovalStep);
    });
  }

  /**
   * 18. Approve Approval Step
   * Mark individual approval step as approved
   */
  async approveApprovalStep(
    stepId: string,
    approverId: string,
  ): Promise<ApprovalStep> {
    return await this.sequelize.transaction(async (t: Transaction) => {
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

      await step.update(
        { status: 'approved', approvalDate: new Date() },
        { transaction: t },
      );

      return step.toJSON() as ApprovalStep;
    });
  }

  /**
   * 19. Escalate Approval
   * Escalate report to higher authority for urgent processing
   */
  async escalateApproval(reportId: string, reason: string, userId: string): Promise<ApprovalStep> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      const currentStep = await this.sequelize.models.ApprovalStep.findOne(
        {
          where: { reportId, status: 'pending' },
          order: [['stepOrder', 'ASC']],
          transaction: t,
        },
      );

      if (!currentStep) throw new Error('No pending approvals');

      // Create escalation step
      const escalationStep = await this.sequelize.models.ApprovalStep.create(
        {
          reportId,
          approverUserId: 'CFO', // Route to CFO or escalation group
          stepOrder: (currentStep.stepOrder || 0) + 100,
          status: 'pending',
        },
        { transaction: t },
      );

      await currentStep.update(
        { status: 'escalated', escalatedAt: new Date() },
        { transaction: t },
      );

      // Audit log
      await this.sequelize.models.AuditLog.create(
        {
          reportId,
          action: 'ESCALATED',
          userId,
          details: reason,
        },
        { transaction: t },
      );

      return escalationStep.toJSON() as ApprovalStep;
    });
  }

  /**
   * 20. Finalize Report Approval
   * Complete all approval steps and mark report as approved
   */
  async finalizeReportApproval(reportId: string): Promise<ExpenseReport> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      // Check all approval steps completed
      const pendingSteps = await this.sequelize.models.ApprovalStep.count({
        where: { reportId, status: 'pending' },
        transaction: t,
      });

      if (pendingSteps > 0) {
        throw new Error('Not all approval steps completed');
      }

      await report.update(
        { status: 'approved', approvedAt: new Date() },
        { transaction: t },
      );

      return report.toJSON() as ExpenseReport;
    });
  }
}

// ============================================================================
// MILEAGE (Functions 21-24)
// ============================================================================

@Injectable()
export class MileageService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 21. Calculate Mileage
   * Compute mileage distance between two locations
   */
  async calculateMileage(
    startLocation: string,
    endLocation: string,
    routeType: 'shortest' | 'fastest' = 'shortest',
  ): Promise<number> {
    // Integrate with mapping API (Google Maps, Mapbox)
    // For now, use simplified calculation
    const distance = Math.random() * 500; // Placeholder
    return Math.round(distance * 10) / 10;
  }

  /**
   * 22. Apply Mileage Rate
   * Calculate reimbursement amount based on IRS/company rate
   */
  async applyMileageRate(
    reportId: string,
    miles: number,
  ): Promise<MileageEntry> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      // Get current mileage rate
      const rate = await this.sequelize.query(
        `
        SELECT rate FROM "MileageRates"
        WHERE is_active = true
        ORDER BY "effectiveDate" DESC
        LIMIT 1
      `,
        {
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const mileageRate = rate[0]?.rate || 0.58; // IRS standard rate

      const totalAmount = miles * mileageRate;

      const entry = await this.sequelize.models.MileageEntry.create(
        {
          reportId,
          miles,
          rate: mileageRate,
          totalAmount,
        },
        { transaction: t },
      );

      // Add to report total
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      await report.update(
        { totalAmount: (report.totalAmount || 0) + totalAmount },
        { transaction: t },
      );

      return entry.toJSON() as MileageEntry;
    });
  }

  /**
   * 23. Validate Mileage Route
   * Check route feasibility and flag suspicious entries
   */
  async validateMileageRoute(
    mileageId: string,
  ): Promise<{ valid: boolean; warnings: string[] }> {
    const entry = await this.sequelize.models.MileageEntry.findByPk(mileageId);

    if (!entry) throw new Error('Mileage entry not found');

    const warnings: string[] = [];

    // Check if miles seem reasonable for stated locations
    if (entry.miles > 1000) {
      warnings.push('Mileage appears excessive for stated route');
    }

    // Check duplicate routes on same day
    const duplicates = await this.sequelize.query(
      `
      SELECT COUNT(*) as count FROM "MileageEntries"
      WHERE "reportId" != :reportId
        AND "startLocation" = :startLocation
        AND "endLocation" = :endLocation
        AND DATE(date) = DATE(:date)
    `,
      {
        replacements: {
          reportId: entry.reportId,
          startLocation: entry.startLocation,
          endLocation: entry.endLocation,
          date: entry.startDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (duplicates[0]?.count > 0) {
      warnings.push('Duplicate route found on same date');
    }

    return { valid: warnings.length === 0, warnings };
  }

  /**
   * 24. Add Mileage to Report
   * Create and link mileage entry to expense report
   */
  async addMileageToReport(
    reportId: string,
    startLocation: string,
    endLocation: string,
    miles: number,
    purpose: string,
  ): Promise<MileageEntry> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      // Get mileage rate
      const rate = await this.sequelize.query(
        `
        SELECT rate FROM "MileageRates"
        WHERE is_active = true
        ORDER BY "effectiveDate" DESC
        LIMIT 1
      `,
        {
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const mileageRate = rate[0]?.rate || 0.58;
      const totalAmount = miles * mileageRate;

      const entry = await this.sequelize.models.MileageEntry.create(
        {
          reportId,
          startLocation,
          endLocation,
          miles,
          rate: mileageRate,
          totalAmount,
          purpose,
        },
        { transaction: t },
      );

      // Update report total
      await report.increment('totalAmount', { by: totalAmount, transaction: t });

      return entry.toJSON() as MileageEntry;
    });
  }
}

// ============================================================================
// PER DIEM (Functions 25-28)
// ============================================================================

@Injectable()
export class PerDiemService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 25. Calculate Per Diem
   * Compute daily meal and lodging allowances for location
   */
  async calculatePerDiem(
    location: string,
    country: string,
    date: Date,
  ): Promise<{ mealAllowance: number; lodgingAllowance: number; total: number }> {
    const rates = await this.sequelize.query(
      `
      SELECT meal_allowance, lodging_allowance FROM "PerDiemRates"
      WHERE location = :location OR (location IS NULL AND country = :country)
        AND is_active = true
        AND :date >= "effectiveDate"
      ORDER BY location DESC NULLS LAST, "effectiveDate" DESC
      LIMIT 1
    `,
      {
        replacements: { location, country, date },
        type: QueryTypes.SELECT,
      },
    );

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
  async applyPerDiemRate(
    reportId: string,
    location: string,
    country: string,
    date: Date,
  ): Promise<PerDiemEntry> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      const { mealAllowance, lodgingAllowance, total } = await this.calculatePerDiem(
        location,
        country,
        date,
      );

      const entry = await this.sequelize.models.PerDiemEntry.create(
        {
          reportId,
          date,
          location,
          country,
          mealAllowance,
          lodgingAllowance,
          totalAllowance: total,
        },
        { transaction: t },
      );

      // Update report total
      await report.increment('totalAmount', { by: total, transaction: t });

      return entry.toJSON() as PerDiemEntry;
    });
  }

  /**
   * 27. Validate Location Per Diem
   * Verify location eligibility and special circumstances
   */
  async validateLocationPerDiem(
    location: string,
    country: string,
  ): Promise<{ eligible: boolean; restrictions?: string }> {
    const locationPolicy = await this.sequelize.query(
      `
      SELECT is_eligible, restrictions FROM "PerDiemLocations"
      WHERE location = :location AND country = :country
        AND is_active = true
    `,
      {
        replacements: { location, country },
        type: QueryTypes.SELECT,
      },
    );

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
  async addPerDiemToReport(
    reportId: string,
    entries: Array<{
      date: Date;
      location: string;
      country: string;
    }>,
  ): Promise<PerDiemEntry[]> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report) throw new Error('Report not found');

      let totalAmount = 0;

      const createdEntries = await Promise.all(
        entries.map(async (entry) => {
          const { total } = await this.calculatePerDiem(
            entry.location,
            entry.country,
            entry.date,
          );

          totalAmount += total;

          return this.sequelize.models.PerDiemEntry.create(
            {
              reportId,
              date: entry.date,
              location: entry.location,
              country: entry.country,
              mealAllowance: total * 0.4,
              lodgingAllowance: total * 0.6,
              totalAllowance: total,
            },
            { transaction: t },
          );
        }),
      );

      // Update report total
      await report.increment('totalAmount', { by: totalAmount, transaction: t });

      return createdEntries.map((e) => e.toJSON() as PerDiemEntry);
    });
  }
}

// ============================================================================
// REIMBURSEMENT (Functions 29-32)
// ============================================================================

@Injectable()
export class ReimbursementService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 29. Calculate Reimbursement
   * Compute final reimbursement amount for approved report
   */
  async calculateReimbursement(reportId: string): Promise<number> {
    const report = await this.sequelize.models.ExpenseReport.findByPk(reportId);

    if (!report || report.status !== 'approved') {
      throw new Error('Report must be approved for reimbursement');
    }

    // Get all expenses and deductions
    const calculation = await this.sequelize.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN ei."policyCompliant" THEN ei.amount ELSE 0 END), 0) as compliant_amount,
        COALESCE(SUM(CASE WHEN NOT ei."policyCompliant" THEN ei.amount ELSE 0 END), 0) as non_compliant_amount,
        COUNT(CASE WHEN ei.flagged THEN 1 END) as flagged_count
      FROM "ExpenseItems" ei
      WHERE ei."reportId" = :reportId
    `,
      {
        replacements: { reportId },
        type: QueryTypes.SELECT,
      },
    );

    // Include mileage and per diem
    const otherExpenses = await this.sequelize.query(
      `
      SELECT
        COALESCE(SUM(me."totalAmount"), 0) as mileage_total,
        COALESCE(SUM(pd."totalAllowance"), 0) as perdiem_total
      FROM "MileageEntries" me
      FULL OUTER JOIN "PerDiemEntries" pd ON true
      WHERE me."reportId" = :reportId OR pd."reportId" = :reportId
    `,
      {
        replacements: { reportId },
        type: QueryTypes.SELECT,
      },
    );

    const compliantAmount = calculation[0]?.compliant_amount || 0;
    const mileageAmount = otherExpenses[0]?.mileage_total || 0;
    const perDiemAmount = otherExpenses[0]?.perdiem_total || 0;

    return compliantAmount + mileageAmount + perDiemAmount;
  }

  /**
   * 30. Process Reimbursement Payment
   * Initiate payment to employee via selected method
   */
  async processReimbursementPayment(
    reportId: string,
    paymentMethod: 'direct_deposit' | 'check' | 'corporate_card',
    bankDetails?: Record<string, unknown>,
  ): Promise<Reimbursement> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const report = await this.sequelize.models.ExpenseReport.findByPk(reportId, {
        transaction: t,
      });

      if (!report || report.status !== 'approved') {
        throw new Error('Report must be approved before processing payment');
      }

      const amount = await this.calculateReimbursement(reportId);

      const reimbursement = await this.sequelize.models.Reimbursement.create(
        {
          reportId,
          employeeId: report.employeeId,
          amount,
          currency: report.currency,
          status: 'processed',
          paymentMethod,
          processedAt: new Date(),
          bankReference: bankDetails?.reference as string,
        },
        { transaction: t },
      );

      // Queue payment processing job
      await this.sequelize.models.PaymentQueue.create(
        {
          reimbursementId: reimbursement.id,
          status: 'queued',
          paymentMethod,
          bankDetails: JSON.stringify(bankDetails),
        },
        { transaction: t },
      );

      return reimbursement.toJSON() as Reimbursement;
    });
  }

  /**
   * 31. Track Reimbursement Status
   * Monitor reimbursement progress and payment status
   */
  async trackReimbursementStatus(reimbursementId: string): Promise<Reimbursement> {
    const reimbursement = await this.sequelize.models.Reimbursement.findByPk(
      reimbursementId,
      {
        include: [
          {
            model: this.sequelize.models.PaymentQueue,
            as: 'paymentQueue',
          },
        ],
      },
    );

    if (!reimbursement) throw new Error('Reimbursement not found');

    // Check payment processor status and update
    if (reimbursement.paymentQueue?.status === 'processed') {
      await reimbursement.update({ status: 'paid', paidAt: new Date() });
    }

    return reimbursement.toJSON() as Reimbursement;
  }

  /**
   * 32. Report Reimbursement Analytics
   * Generate reimbursement statistics and trends
   */
  async reportReimbursementAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalReimbursed: number;
    averageReimbursement: number;
    processingTime: number;
    paymentMethodBreakdown: Record<string, number>;
  }> {
    const stats = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    const paymentMethodBreakdown: Record<string, number> = {};
    let totalReimbursed = 0;
    let averageReimbursement = 0;
    let processingTime = 0;

    stats.forEach((stat: any) => {
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
}

// ============================================================================
// CORPORATE CARD (Functions 33-36)
// ============================================================================

@Injectable()
export class CorporateCardService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 33. Import Corporate Card Transactions
   * Bulk load credit card statement transactions
   */
  async importCorporateCardTransactions(
    cardId: string,
    transactions: Array<{
      date: Date;
      vendor: string;
      amount: number;
      description: string;
      transactionId: string;
    }>,
  ): Promise<number> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const card = await this.sequelize.models.CorporateCard.findByPk(cardId, {
        transaction: t,
      });

      if (!card) throw new Error('Corporate card not found');

      const createdCount = await this.sequelize.models.CardTransaction.bulkCreate(
        transactions.map((tx) => ({
          cardId,
          date: tx.date,
          vendor: tx.vendor,
          amount: tx.amount,
          description: tx.description,
          transactionId: tx.transactionId,
          reconciled: false,
        })),
        { transaction: t, ignoreDuplicates: true },
      );

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
  async matchCardReceiptsToTransactions(
    cardTransactionId: string,
    expenseId: string,
  ): Promise<{ matched: boolean; discrepancy?: number }> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const [cardTx, expense] = await Promise.all([
        this.sequelize.models.CardTransaction.findByPk(cardTransactionId, { transaction: t }),
        this.sequelize.models.ExpenseItem.findByPk(expenseId, {
          include: [{ model: this.sequelize.models.Receipt, as: 'receipts' }],
          transaction: t,
        }),
      ]);

      if (!cardTx || !expense) throw new Error('Card transaction or expense not found');

      // Check amount match (allow 5% variance)
      const discrepancy = Math.abs(cardTx.amount - expense.amount);
      const percentDiff = (discrepancy / cardTx.amount) * 100;
      const matched = percentDiff <= 5;

      // Check date proximity (within 3 days)
      const daysDiff = Math.abs(
        (cardTx.date.getTime() - expense.date.getTime()) / (1000 * 60 * 60 * 24),
      );
      const dateMatch = daysDiff <= 3;

      if (matched && dateMatch) {
        await cardTx.update(
          { expenseId, reconciled: true, matchedAt: new Date() },
          { transaction: t },
        );

        return { matched: true };
      }

      return { matched: false, discrepancy: percentDiff };
    });
  }

  /**
   * 35. Reconcile Corporate Card
   * Match all card transactions to expenses and identify discrepancies
   */
  async reconcileCorporateCard(cardId: string): Promise<{
    reconciled: number;
    unmatched: number;
    discrepancies: Array<{ transactionId: string; amount: number; issue: string }>;
  }> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const unmatched = await this.sequelize.query(
        `
        SELECT ct.id, ct.amount, ct.vendor, ct.date
        FROM "CardTransactions" ct
        WHERE ct."cardId" = :cardId
          AND ct."expenseId" IS NULL
          AND DATE(ct.date) >= DATE(CURRENT_DATE) - INTERVAL '90 days'
      `,
        {
          replacements: { cardId },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const reconciled = await this.sequelize.query(
        `
        SELECT COUNT(*) as count FROM "CardTransactions"
        WHERE "cardId" = :cardId AND "reconciled" = true
      `,
        {
          replacements: { cardId },
          type: QueryTypes.SELECT,
          transaction: t,
        },
      );

      const discrepancies = unmatched.map((tx: any) => ({
        transactionId: tx.id,
        amount: tx.amount,
        issue: `Unmatched ${tx.vendor} transaction on ${tx.date}`,
      }));

      // Flag card for review if too many unmatched transactions
      if (unmatched.length > reconciled[0]?.count * 0.1) {
        await this.sequelize.models.CorporateCard.update(
          { status: 'requires_review' },
          { where: { id: cardId }, transaction: t },
        );
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
  async reportCorporateCardAnalytics(
    cardId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalSpend: number;
    unmatchedAmount: number;
    reconciliationRate: number;
    topVendors: Array<{ vendor: string; amount: number; count: number }>;
  }> {
    const stats = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { cardId, startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    let totalSpend = 0;
    let unmatchedAmount = 0;
    let reconciliationRate = 0;
    const topVendors: Array<{ vendor: string; amount: number; count: number }> = [];

    stats.forEach((stat: any, index: number) => {
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
}

// ============================================================================
// ANALYTICS & REPORTING (Functions 37-40)
// ============================================================================

@Injectable()
export class ExpenseAnalyticsService {
  constructor(private sequelize: Sequelize) {}

  /**
   * 37. Expense Analytics Report
   * Comprehensive expense analysis with trends and patterns
   */
  async expenseAnalyticsReport(startDate: Date, endDate: Date): Promise<ExpenseAnalytics> {
    const analytics = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    // Get spending by category
    const byCategory = await this.sequelize.query(
      `
      SELECT
        ei.category,
        SUM(ei.amount) as total
      FROM "ExpenseItems" ei
      WHERE ei.date BETWEEN :startDate AND :endDate
      GROUP BY ei.category
      ORDER BY SUM(ei.amount) DESC
    `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    const spendByCategory: Record<string, number> = {};
    byCategory.forEach((row: any) => {
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
  async budgetTrackingReport(
    department: string,
    fiscalYear: number,
  ): Promise<{
    budgetLimit: number;
    spent: number;
    remaining: number;
    percentUsed: number;
    trends: Array<{ month: string; amount: number }>;
  }> {
    const budget = await this.sequelize.query(
      `
      SELECT budget_amount FROM "DepartmentBudgets"
      WHERE department = :department
        AND fiscal_year = :fiscalYear
        AND is_active = true
    `,
      {
        replacements: { department, fiscalYear },
        type: QueryTypes.SELECT,
      },
    );

    const spending = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { department, fiscalYear },
        type: QueryTypes.SELECT,
      },
    );

    const budgetLimit = budget[0]?.budget_amount || 0;
    const spent = spending.reduce((sum: number, row: any) => sum + row.amount, 0);
    const remaining = budgetLimit - spent;
    const percentUsed = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0;

    const trends = spending.map((row: any) => ({
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
  async spendByCategoryReport(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{
    category: string;
    count: number;
    totalAmount: number;
    averageAmount: number;
    policyCompliantRate: number;
  }>> {
    const report = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    return report.map((row: any) => ({
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
  async exportExpenseData(
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'excel' | 'json' = 'csv',
  ): Promise<string> {
    const data = await this.sequelize.query(
      `
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
    `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(','),
        ...data.map((row: any) =>
          headers.map((h) => `"${row[h]}"`).join(','),
        ),
      ].join('\n');
      return csv;
    } else if (format === 'excel') {
      // Excel export would use a library like xlsx
      return JSON.stringify(data);
    }

    return '';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ExpenseReportService,
  ReceiptService,
  CategorizationService,
  PolicyComplianceService,
  ApprovalWorkflowService,
  MileageService,
  PerDiemService,
  ReimbursementService,
  CorporateCardService,
  ExpenseAnalyticsService,
};

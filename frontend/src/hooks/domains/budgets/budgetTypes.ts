/**
 * Budget Domain Type Definitions
 *
 * Provides comprehensive TypeScript type definitions for the budget domain
 * including budgets, categories, transactions, reports, and user references.
 *
 * @module hooks/domains/budgets/budgetTypes
 *
 * @remarks
 * **Type Safety:**
 * - End-to-end type safety for budget operations
 * - Strict type definitions for all entities
 * - Union types for status and type enums
 *
 * **Entity Relationships:**
 * - Budget -> BudgetCategory[] (one-to-many)
 * - BudgetCategory -> BudgetTransaction[] (one-to-many)
 * - BudgetCategory -> BudgetCategory[] (hierarchical children)
 *
 * @since 1.0.0
 */

/**
 * Budget entity interface representing a complete budget with metadata and allocations.
 *
 * Represents a fiscal budget with total allocations, spending tracking, category
 * breakdowns, and approval workflow state. Budgets can be in various lifecycle
 * states from draft to closed.
 *
 * @interface Budget
 *
 * @property {string} id - Unique budget identifier
 * @property {string} name - Budget name (e.g., "2024 Healthcare Budget")
 * @property {string} [description] - Optional detailed budget description
 * @property {number} totalAmount - Total budgeted amount across all categories
 * @property {number} spentAmount - Total amount spent/committed from budget
 * @property {number} remainingAmount - Remaining budget (totalAmount - spentAmount)
 * @property {string} currency - Currency code (ISO 4217, e.g., "USD", "EUR")
 * @property {string} fiscalYear - Fiscal year identifier (e.g., "2024", "FY2024")
 * @property {string} startDate - Budget period start date (ISO 8601 format)
 * @property {string} endDate - Budget period end date (ISO 8601 format)
 * @property {'DRAFT' | 'ACTIVE' | 'FROZEN' | 'CLOSED'} status - Budget lifecycle status
 * @property {BudgetCategory[]} categories - Hierarchical budget categories
 * @property {string} [department] - Department or cost center identifier
 * @property {BudgetUser} owner - Budget owner/creator
 * @property {BudgetUser} [approver] - User who approved the budget
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const budget: Budget = {
 *   id: 'budget-123',
 *   name: '2024 School Health Services Budget',
 *   description: 'Annual budget for health services and medical supplies',
 *   totalAmount: 100000,
 *   spentAmount: 45000,
 *   remainingAmount: 55000,
 *   currency: 'USD',
 *   fiscalYear: '2024',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   status: 'ACTIVE',
 *   categories: [...],
 *   department: 'health-services',
 *   owner: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' },
 *   approver: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' },
 *   createdAt: '2023-12-01T00:00:00Z',
 *   updatedAt: '2024-01-15T10:30:00Z'
 * };
 * ```
 *
 * @remarks
 * **Status Lifecycle:**
 * - DRAFT: Budget being planned, not yet approved
 * - ACTIVE: Approved and in use for transactions
 * - FROZEN: Temporarily locked, no new transactions
 * - CLOSED: Budget period ended, archived
 *
 * **Amount Calculations:**
 * - Amounts maintained in smallest currency unit (cents)
 * - remainingAmount = totalAmount - spentAmount
 * - Negative remaining indicates over budget
 *
 * @see {@link BudgetCategory} for category structure
 * @see {@link BudgetUser} for user reference type
 *
 * @since 1.0.0
 */
export interface Budget {
  id: string;
  name: string;
  description?: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'FROZEN' | 'CLOSED';
  categories: BudgetCategory[];
  department?: string;
  owner: BudgetUser;
  approver?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}

/**
 * Budget category interface representing a budget allocation category.
 *
 * Categories organize budget allocations hierarchically and track spending
 * per category. Supports parent-child relationships for nested categorization.
 *
 * @interface BudgetCategory
 *
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name (e.g., "Medical Supplies", "Medications")
 * @property {string} [description] - Optional category description
 * @property {number} allocatedAmount - Amount allocated to this category
 * @property {number} spentAmount - Amount spent from this category
 * @property {number} remainingAmount - Remaining amount (allocatedAmount - spentAmount)
 * @property {string} [parentId] - Parent category ID for hierarchical structure
 * @property {BudgetCategory[]} [children] - Child subcategories
 * @property {BudgetTransaction[]} transactions - Transactions in this category
 *
 * @example
 * ```typescript
 * const category: BudgetCategory = {
 *   id: 'cat-123',
 *   name: 'Medical Supplies',
 *   description: 'General medical supplies and equipment',
 *   allocatedAmount: 25000,
 *   spentAmount: 12000,
 *   remainingAmount: 13000,
 *   parentId: undefined, // Top-level category
 *   children: [
 *     {
 *       id: 'cat-124',
 *       name: 'First Aid',
 *       allocatedAmount: 5000,
 *       spentAmount: 2000,
 *       remainingAmount: 3000,
 *       parentId: 'cat-123',
 *       children: [],
 *       transactions: [...]
 *     }
 *   ],
 *   transactions: [...]
 * };
 * ```
 *
 * @remarks
 * **Hierarchical Structure:**
 * - Top-level categories have parentId = undefined
 * - Child categories reference parent via parentId
 * - Unlimited nesting depth supported
 *
 * **Amount Aggregation:**
 * - Parent category amounts may aggregate child amounts
 * - Transactions assigned to specific category (leaf or parent)
 *
 * @see {@link Budget} for parent budget entity
 * @see {@link BudgetTransaction} for transaction structure
 *
 * @since 1.0.0
 */
export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  parentId?: string;
  children?: BudgetCategory[];
  transactions: BudgetTransaction[];
}

/**
 * Budget transaction interface representing a financial transaction.
 *
 * Transactions record income, expenses, or transfers within budgets with approval
 * workflow tracking. Each transaction affects budget and category balances.
 *
 * @interface BudgetTransaction
 *
 * @property {string} id - Unique transaction identifier
 * @property {string} budgetId - Associated budget ID
 * @property {string} categoryId - Associated category ID
 * @property {number} amount - Transaction amount (positive for all types)
 * @property {'INCOME' | 'EXPENSE' | 'TRANSFER'} type - Transaction type
 * @property {string} description - Transaction description/purpose
 * @property {string} [reference] - Optional external reference number (invoice, PO, etc.)
 * @property {string} date - Transaction date (ISO 8601 format)
 * @property {'PENDING' | 'APPROVED' | 'REJECTED'} status - Approval status
 * @property {TransactionAttachment[]} attachments - Supporting documents/receipts
 * @property {BudgetUser} createdBy - User who created the transaction
 * @property {BudgetUser} [approvedBy] - User who approved/rejected (if applicable)
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const transaction: BudgetTransaction = {
 *   id: 'tx-123',
 *   budgetId: 'budget-123',
 *   categoryId: 'cat-123',
 *   amount: 250.00,
 *   type: 'EXPENSE',
 *   description: 'First aid kit supplies',
 *   reference: 'PO-2024-001',
 *   date: '2024-03-15',
 *   status: 'APPROVED',
 *   attachments: [
 *     {
 *       id: 'att-1',
 *       fileName: 'invoice.pdf',
 *       fileUrl: 'https://storage.example.com/invoice.pdf',
 *       fileSize: 102400,
 *       mimeType: 'application/pdf',
 *       uploadedAt: '2024-03-15T10:00:00Z'
 *     }
 *   ],
 *   createdBy: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' },
 *   approvedBy: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' },
 *   createdAt: '2024-03-15T09:30:00Z',
 *   updatedAt: '2024-03-15T14:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Transaction Types:**
 * - INCOME: Adds to budget (e.g., funding received)
 * - EXPENSE: Deducts from budget (e.g., purchase, payment)
 * - TRANSFER: Moves between categories (neutral to total budget)
 *
 * **Approval Workflow:**
 * - PENDING: Awaiting approval
 * - APPROVED: Approved and applied to budget
 * - REJECTED: Rejected, not applied to budget
 *
 * **Amount Handling:**
 * - Amount always positive regardless of type
 * - Type determines budget impact direction
 * - Stored in smallest currency unit
 *
 * @see {@link Budget} for parent budget entity
 * @see {@link BudgetCategory} for category entity
 * @see {@link TransactionAttachment} for attachment structure
 *
 * @since 1.0.0
 */
export interface BudgetTransaction {
  id: string;
  budgetId: string;
  categoryId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string;
  reference?: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attachments: TransactionAttachment[];
  createdBy: BudgetUser;
  approvedBy?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction attachment interface for supporting documents.
 *
 * Represents uploaded files attached to budget transactions such as invoices,
 * receipts, purchase orders, or other supporting documentation.
 *
 * @interface TransactionAttachment
 *
 * @property {string} id - Unique attachment identifier
 * @property {string} fileName - Original file name
 * @property {string} fileUrl - URL to access the file
 * @property {number} fileSize - File size in bytes
 * @property {string} mimeType - MIME type (e.g., "application/pdf", "image/jpeg")
 * @property {string} uploadedAt - Upload timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const attachment: TransactionAttachment = {
 *   id: 'att-123',
 *   fileName: 'invoice-2024-001.pdf',
 *   fileUrl: 'https://storage.example.com/attachments/invoice-2024-001.pdf',
 *   fileSize: 204800, // 200 KB
 *   mimeType: 'application/pdf',
 *   uploadedAt: '2024-03-15T10:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Supported File Types:**
 * - Documents: PDF, DOC, DOCX
 * - Images: JPEG, PNG, GIF
 * - Spreadsheets: XLS, XLSX, CSV
 *
 * **File Size Limits:**
 * - Typically 10 MB maximum per file
 * - Multiple attachments allowed per transaction
 *
 * @see {@link BudgetTransaction} for parent transaction entity
 *
 * @since 1.0.0
 */
export interface TransactionAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Budget user reference interface for creators, approvers, and owners.
 *
 * Simplified user representation for budget-related user references. Contains
 * essential identifying information without full user profile details.
 *
 * @interface BudgetUser
 *
 * @property {string} id - Unique user identifier
 * @property {string} name - User full name
 * @property {string} email - User email address
 * @property {string} [avatar] - Optional avatar/profile image URL
 *
 * @example
 * ```typescript
 * const user: BudgetUser = {
 *   id: 'user-123',
 *   name: 'Jane Doe',
 *   email: 'jane.doe@school.edu',
 *   avatar: 'https://avatars.example.com/user-123.jpg'
 * };
 * ```
 *
 * @remarks
 * **Usage Contexts:**
 * - Budget owner: User who created the budget
 * - Budget approver: User who approved the budget
 * - Transaction creator: User who created the transaction
 * - Transaction approver: User who approved/rejected the transaction
 *
 * **Privacy:**
 * - Contains only publicly shareable user information
 * - No sensitive personal data included
 *
 * @see {@link Budget} for budget owner/approver usage
 * @see {@link BudgetTransaction} for transaction creator/approver usage
 *
 * @since 1.0.0
 */
export interface BudgetUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Budget report interface for generated financial reports.
 *
 * Represents a generated budget report with typed data structures for various
 * report types including summaries, detailed breakdowns, variance analysis,
 * and forecasting reports.
 *
 * @interface BudgetReport
 *
 * @property {string} id - Unique report identifier
 * @property {'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST'} type - Report type
 * @property {string} title - Report title
 * @property {string} period - Reporting period (e.g., "2024 Q1", "FY2024")
 * @property {any} data - Report-specific data structure (varies by type)
 * @property {string} generatedAt - Report generation timestamp (ISO 8601)
 * @property {BudgetUser} generatedBy - User who generated the report
 *
 * @example
 * ```typescript
 * const summaryReport: BudgetReport = {
 *   id: 'report-123',
 *   type: 'SUMMARY',
 *   title: 'Q1 2024 Budget Summary',
 *   period: '2024-Q1',
 *   data: {
 *     totalBudgeted: 100000,
 *     totalSpent: 45000,
 *     utilizationRate: 45,
 *     categoryBreakdown: [...]
 *   },
 *   generatedAt: '2024-04-01T10:00:00Z',
 *   generatedBy: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' }
 * };
 *
 * const varianceReport: BudgetReport = {
 *   id: 'report-124',
 *   type: 'VARIANCE',
 *   title: 'Budget vs Actual Variance Analysis',
 *   period: 'FY2024',
 *   data: {
 *     budgetedTotal: 100000,
 *     actualTotal: 105000,
 *     variance: -5000,
 *     variancePercentage: -5,
 *     categoryVariances: [...]
 *   },
 *   generatedAt: '2024-06-30T15:00:00Z',
 *   generatedBy: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' }
 * };
 * ```
 *
 * @remarks
 * **Report Types:**
 * - SUMMARY: High-level budget overview with key metrics
 * - DETAILED: Comprehensive transaction-level breakdown
 * - VARIANCE: Budget vs. actual spending comparison
 * - FORECAST: Projected spending and trend analysis
 *
 * **Data Structure:**
 * - data property structure varies by report type
 * - Contains charts, tables, metrics specific to report
 * - May include visualizations in JSON format
 *
 * **Generation:**
 * - Reports generated on-demand or scheduled
 * - Cached for 15 minutes after generation
 * - Historical reports remain static
 *
 * @see {@link useGenerateBudgetReport} for report generation
 * @see {@link useBudgetReports} for fetching reports
 *
 * @since 1.0.0
 */
export interface BudgetReport {
  id: string;
  type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
  title: string;
  period: string;
  data: any;
  generatedAt: string;
  generatedBy: BudgetUser;
}

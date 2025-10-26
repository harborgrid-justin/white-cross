/**
 * Budget Domain Configuration Module
 *
 * Provides centralized configuration for budget management hooks including query key
 * factories, cache strategies, TypeScript type definitions, and cache invalidation
 * utilities for the budget domain.
 *
 * @module hooks/domains/budgets/config
 *
 * @remarks
 * **Architecture:**
 * - Query key factories ensure consistent cache key structure
 * - Type definitions provide end-to-end type safety
 * - Cache configuration optimized for data volatility patterns
 * - Utility functions simplify cache invalidation workflows
 *
 * **Query Key Strategy:**
 * - Hierarchical key structure for granular cache control
 * - Two factory patterns: BUDGETS_QUERY_KEYS (legacy) and budgetKeys (recommended)
 * - Const assertions ensure type-safe key arrays
 *
 * **Cache Strategy:**
 * - Budgets: 10-minute stale time (relatively stable)
 * - Transactions: 2-minute stale time (more volatile)
 * - Reports: 15-minute stale time (static after generation)
 *
 * @see {@link useBudgetQueries} for query hook implementations
 * @see {@link useBudgetMutations} for mutation hook implementations
 *
 * @since 1.0.0
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Legacy query key factory for budgets domain.
 *
 * Provides hierarchical query keys for budgets, categories, transactions, and reports.
 * Uses const assertions for type-safe readonly arrays.
 *
 * @constant
 *
 * @example
 * ```typescript
 * // Budget list query key with filters
 * const key = BUDGETS_QUERY_KEYS.budgetsList({ status: 'active' });
 * // Result: ['budgets', 'list', { status: 'active' }]
 *
 * // Budget detail query key
 * const detailKey = BUDGETS_QUERY_KEYS.budgetDetails('budget-123');
 * // Result: ['budgets', 'detail', 'budget-123']
 *
 * // Transaction list query key
 * const txKey = BUDGETS_QUERY_KEYS.transactionsList({ budgetId: 'budget-123' });
 * // Result: ['budgets', 'transactions', 'list', { budgetId: 'budget-123' }]
 * ```
 *
 * @remarks
 * **Structure:**
 * - Base keys: budgets, categories, transactions, reports
 * - List keys: Append 'list' + filters
 * - Detail keys: Append 'detail' + id
 *
 * **Migration Note:**
 * - Prefer using `budgetKeys` factory for new code
 * - This factory maintained for backward compatibility
 *
 * @see {@link budgetKeys} for recommended query key factory
 *
 * @since 1.0.0
 */
export const BUDGETS_QUERY_KEYS = {
  // Budgets
  budgets: ['budgets'] as const,
  budgetsList: (filters?: any) => [...BUDGETS_QUERY_KEYS.budgets, 'list', filters] as const,
  budgetDetails: (id: string) => [...BUDGETS_QUERY_KEYS.budgets, 'detail', id] as const,
  
  // Budget Categories
  categories: ['budgets', 'categories'] as const,
  categoriesList: (filters?: any) => [...BUDGETS_QUERY_KEYS.categories, 'list', filters] as const,
  categoryDetails: (id: string) => [...BUDGETS_QUERY_KEYS.categories, 'detail', id] as const,
  
  // Transactions
  transactions: ['budgets', 'transactions'] as const,
  transactionsList: (filters?: any) => [...BUDGETS_QUERY_KEYS.transactions, 'list', filters] as const,
  transactionDetails: (id: string) => [...BUDGETS_QUERY_KEYS.transactions, 'detail', id] as const,
  
  // Reports
  reports: ['budgets', 'reports'] as const,
  reportsList: (type?: string) => [...BUDGETS_QUERY_KEYS.reports, 'list', type] as const,
} as const;

/**
 * Recommended query key factory for budget domain.
 *
 * Comprehensive factory providing type-safe query keys for all budget-related data
 * including budgets, categories, transactions, reports, analytics, and comparisons.
 * Follows standardized pattern consistent with other domain hooks.
 *
 * @constant
 *
 * @example
 * ```typescript
 * // All budgets (invalidate entire budget cache)
 * queryClient.invalidateQueries({ queryKey: budgetKeys.all });
 *
 * // Budget list with filters
 * const listKey = budgetKeys.list({ status: 'active', fiscalYear: 2024 });
 * // Result: ['budgets', 'list', { status: 'active', fiscalYear: 2024 }]
 *
 * // Paginated budget list
 * const paginatedKey = budgetKeys.paginated({ departmentId: 'dept-1' });
 *
 * // Single budget detail
 * const detailKey = budgetKeys.detail('budget-123');
 * // Result: ['budgets', 'detail', 'budget-123']
 *
 * // Budget analytics with period
 * const analyticsKey = budgetKeys.analytics('budget-123', 'monthly');
 * // Result: ['budgets', 'analytics', 'budget-123', 'monthly']
 *
 * // Budget comparison
 * const comparisonKey = budgetKeys.comparison(['budget-1', 'budget-2'], 'quarterly');
 *
 * // Budget categories for specific budget
 * const categoriesKey = budgetKeys.categories('budget-123');
 *
 * // Transactions with filters
 * const transactionsKey = budgetKeys.transactions({
 *   budgetId: 'budget-123',
 *   type: 'expense',
 *   startDate: '2024-01-01'
 * });
 * ```
 *
 * @remarks
 * **Key Hierarchy:**
 * - Level 1: ['budgets'] - Root key for all budget data
 * - Level 2: ['budgets', 'list' | 'detail' | 'analytics' | etc.] - Operation type
 * - Level 3+: Additional parameters (filters, IDs, periods)
 *
 * **Benefits:**
 * - Type-safe with const assertions
 * - Consistent structure across operations
 * - Easy cache invalidation at any level
 * - Supports complex filtering and pagination
 *
 * **Performance:**
 * - Fine-grained cache control
 * - Efficient partial invalidation
 * - Minimal cache duplication
 *
 * @see {@link BUDGETS_QUERY_KEYS} for legacy key factory
 * @see {@link useBudgetQueries} for usage in query hooks
 *
 * @since 1.0.0
 */
export const budgetKeys = {
  all: ['budgets'] as const,
  list: (filters?: any) => [...budgetKeys.all, 'list', filters] as const,
  paginated: (filters?: any) => [...budgetKeys.all, 'paginated', filters] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
  analytics: (budgetId: string, period?: string) => [...budgetKeys.all, 'analytics', budgetId, period] as const,
  comparison: (budgetIds: string[], period?: string) => [...budgetKeys.all, 'comparison', budgetIds, period] as const,
  status: (budgetId: string) => [...budgetKeys.all, 'status', budgetId] as const,
  
  // Categories
  categories: (budgetId?: string) => [...budgetKeys.all, 'categories', budgetId] as const,
  category: (categoryId: string) => [...budgetKeys.all, 'category', categoryId] as const,
  
  // Transactions
  transactions: (filters?: any) => [...budgetKeys.all, 'transactions', filters] as const,
  transactionsPaginated: (filters?: any) => [...budgetKeys.all, 'transactions', 'paginated', filters] as const,
  transaction: (transactionId: string) => [...budgetKeys.all, 'transaction', transactionId] as const,
  
  // Reports
  reports: (filters?: any) => [...budgetKeys.all, 'reports', filters] as const,
  report: (reportId: string) => [...budgetKeys.all, 'report', reportId] as const,
} as const;

/**
 * Cache configuration constants for budget domain queries.
 *
 * Defines stale times optimized for different data types based on their volatility
 * and update patterns. Stale time determines how long cached data is considered
 * fresh before background refetching occurs.
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - Default stale time for general queries (5 minutes)
 * @property {number} BUDGETS_STALE_TIME - Stale time for budget data (10 minutes)
 * @property {number} TRANSACTIONS_STALE_TIME - Stale time for transaction data (2 minutes)
 * @property {number} REPORTS_STALE_TIME - Stale time for report data (15 minutes)
 *
 * @example
 * ```typescript
 * import { BUDGETS_CACHE_CONFIG } from './config';
 *
 * // Use in query configuration
 * useQuery({
 *   queryKey: budgetKeys.detail(budgetId),
 *   queryFn: fetchBudget,
 *   staleTime: BUDGETS_CACHE_CONFIG.BUDGETS_STALE_TIME
 * });
 *
 * // Override for real-time data
 * useQuery({
 *   queryKey: budgetKeys.status(budgetId),
 *   queryFn: fetchStatus,
 *   staleTime: 0 // Always refetch
 * });
 * ```
 *
 * @remarks
 * **Stale Time Rationale:**
 * - **Budgets (10 min)**: Budget metadata changes infrequently; longer cache acceptable
 * - **Transactions (2 min)**: Transaction approvals and updates are frequent; shorter cache
 * - **Reports (15 min)**: Generated reports are static; longest cache time
 * - **Default (5 min)**: Balanced for general category and user data
 *
 * **Background Refetching:**
 * - TanStack Query automatically refetches stale data on:
 *   - Component mount (if stale)
 *   - Window focus (if stale)
 *   - Network reconnection
 *
 * **Performance Impact:**
 * - Longer stale times reduce API calls but may show outdated data
 * - Shorter stale times increase freshness but higher server load
 * - Combine with polling (refetchInterval) for real-time needs
 *
 * @see {@link useBudgetStatus} for example of real-time polling
 * @see {@link useBudgetQueries} for stale time usage
 *
 * @since 1.0.0
 */
export const BUDGETS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  BUDGETS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  TRANSACTIONS_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  REPORTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

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

/**
 * Invalidates all budget-related queries in the cache.
 *
 * Triggers refetch of all budget data including budgets, categories, transactions,
 * reports, and analytics. Use after bulk operations affecting multiple budgets.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetsQueries } from './config';
 *
 * function BudgetImportComplete() {
 *   const queryClient = useQueryClient();
 *
 *   const handleImportComplete = () => {
 *     // Invalidate all budget data after bulk import
 *     invalidateBudgetsQueries(queryClient);
 *   };
 * }
 * ```
 *
 * @remarks
 * **Scope:**
 * - Invalidates all queries with key starting with ['budgets']
 * - Affects budgets, categories, transactions, reports, analytics
 * - Triggers background refetch for all mounted queries
 *
 * **Performance:**
 * - May cause multiple simultaneous API calls
 * - Use sparingly for bulk operations only
 * - Prefer granular invalidation for single-entity updates
 *
 * @see {@link invalidateBudgetQueries} for budget-specific invalidation
 * @see {@link budgetKeys} for query key structure
 *
 * @since 1.0.0
 */
export const invalidateBudgetsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['budgets'] });
};

/**
 * Invalidates budget-specific queries using BUDGETS_QUERY_KEYS pattern.
 *
 * Invalidates queries for budgets list and details. Use after creating, updating,
 * or deleting budgets.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetQueries } from './config';
 *
 * function useUpdateBudgetStatus() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: updateStatus,
 *     onSuccess: () => {
 *       invalidateBudgetQueries(queryClient);
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Budget list queries
 * - Budget detail queries
 * - Does NOT invalidate categories, transactions, or reports
 *
 * **Use Cases:**
 * - After budget creation
 * - After budget metadata update
 * - After budget status change
 *
 * @see {@link invalidateBudgetsQueries} for full cache invalidation
 * @see {@link BUDGETS_QUERY_KEYS} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateBudgetQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.budgets });
};

/**
 * Invalidates budget category queries.
 *
 * Invalidates queries for category lists and details. Use after creating,
 * updating, or deleting budget categories.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetCategoryQueries } from './config';
 *
 * function useCreateCategory() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: createCategory,
 *     onSuccess: () => {
 *       invalidateBudgetCategoryQueries(queryClient);
 *       // Also invalidate parent budget to refresh nested categories
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.detail(budgetId)
 *       });
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Category list queries (all budgets)
 * - Category detail queries
 * - Budget-specific category queries
 *
 * **Cascading Invalidation:**
 * - Consider invalidating parent budget queries
 * - May need to invalidate transaction queries if amounts changed
 *
 * @see {@link invalidateBudgetQueries} for budget invalidation
 * @see {@link BUDGETS_QUERY_KEYS.categories} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateBudgetCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.categories });
};

/**
 * Invalidates budget transaction queries.
 *
 * Invalidates queries for transaction lists and details. Use after creating,
 * updating, approving, or deleting budget transactions.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateTransactionQueries } from './config';
 *
 * function useApproveTransaction() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: approveTransaction,
 *     onSuccess: (transaction) => {
 *       invalidateTransactionQueries(queryClient);
 *
 *       // Also invalidate affected budget and category
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.detail(transaction.budgetId)
 *       });
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.category(transaction.categoryId)
 *       });
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Transaction list queries (all filters)
 * - Transaction detail queries
 * - Paginated transaction queries
 *
 * **Cascading Invalidation:**
 * - ALWAYS invalidate parent budget and category queries
 * - Transactions affect budget and category amounts
 * - May need to invalidate analytics and reports
 *
 * **Performance:**
 * - Transaction queries have 2-minute stale time
 * - Frequent invalidation expected for approval workflows
 *
 * @see {@link invalidateBudgetQueries} for budget invalidation
 * @see {@link invalidateBudgetCategoryQueries} for category invalidation
 * @see {@link BUDGETS_QUERY_KEYS.transactions} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateTransactionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.transactions });
};

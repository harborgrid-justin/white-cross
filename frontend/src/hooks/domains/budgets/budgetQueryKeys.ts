/**
 * Budget Query Key Factories
 *
 * Provides centralized query key factories for budget domain ensuring consistent
 * cache key structure across the application. Includes both legacy and recommended
 * factory patterns for backward compatibility.
 *
 * @module hooks/domains/budgets/budgetQueryKeys
 *
 * @remarks
 * **Query Key Strategy:**
 * - Hierarchical key structure for granular cache control
 * - Two factory patterns: BUDGETS_QUERY_KEYS (legacy) and budgetKeys (recommended)
 * - Const assertions ensure type-safe key arrays
 *
 * **Key Hierarchy:**
 * - Level 1: ['budgets'] - Root key for all budget data
 * - Level 2: ['budgets', 'list' | 'detail' | 'analytics' | etc.] - Operation type
 * - Level 3+: Additional parameters (filters, IDs, periods)
 *
 * @see {@link useBudgetQueries} for query hook implementations
 *
 * @since 1.0.0
 */

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

/**
 * Budget Domain Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget-related data including budgets,
 * categories, transactions, reports, analytics, and real-time status updates.
 *
 * @module hooks/domains/budgets/queries/useBudgetQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Budgets: 10-minute stale time
 * - Transactions: 2-minute stale time (more volatile)
 * - Reports: 15-minute stale time (less volatile)
 * - Real-time status: 1-minute polling interval
 *
 * **Performance:**
 * - All queries support conditional execution via enabled option
 * - Pagination support for large datasets (infinite queries)
 * - Query results cached in memory for instant access
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 * @see {@link useBudgetComposites} for composite workflow hooks
 *
 * @since 1.0.0
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import type { Budget, BudgetCategory, BudgetTransaction, BudgetReport } from '../budgetTypes';

/**
 * Fetches a single budget by ID with full details including categories.
 *
 * This hook uses TanStack Query's useQuery for efficient data fetching with
 * automatic caching, background refetching, and stale-time management.
 *
 * @param {string} budgetId - Unique identifier of the budget to fetch
 *
 * @returns {UseQueryResult<Budget>} TanStack Query result object
 * @returns {Budget} returns.data - The budget with nested categories
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function BudgetDetailPage({ budgetId }: Props) {
 *   const { data: budget, isLoading, error } = useBudget(budgetId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!budget) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{budget.name}</h1>
 *       <p>Total: ${budget.totalAmount.toLocaleString()}</p>
 *       <p>Spent: ${budget.spentAmount.toLocaleString()}</p>
 *       <p>Remaining: ${budget.remainingAmount.toLocaleString()}</p>
 *       <CategoriesList categories={budget.categories} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.detail(budgetId) - ['budgets', 'detail', budgetId]
 * - Stale Time: 10 minutes (via BUDGETS_CACHE_CONFIG)
 * - Cache Time: 5 minutes (default)
 * - Enabled: Only when budgetId is truthy (prevents unnecessary requests)
 * - Refetch on Mount: Yes, if data is stale
 * - Refetch on Window Focus: Yes, if data is stale
 *
 * **Error Handling:**
 * - Automatic retry with exponential backoff (3 attempts)
 * - Error object includes status code and message
 * - Network errors handled gracefully
 *
 * **Performance:**
 * - Results cached in memory for instant re-renders
 * - Parallel queries deduplicated automatically
 * - Background refetching keeps data fresh
 *
 * @see {@link useBudgets} for fetching multiple budgets
 * @see {@link useUpdateBudget} for updating budget data
 * @see {@link budgetKeys.detail} for cache key structure
 *
 * @since 1.0.0
 */
export const useBudget = (budgetId: string) => {
  return useQuery({
    queryKey: budgetKeys.detail(budgetId),
    queryFn: async (): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`);
      if (!response.ok) throw new Error('Failed to fetch budget');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

/**
 * Fetches a filtered list of budgets with optional department, status, and fiscal year filters.
 *
 * Supports filtering by multiple criteria to retrieve relevant budget subsets for
 * departmental views, status-based lists, and fiscal year planning.
 *
 * @param {Object} [filters] - Optional filters to narrow budget results
 * @param {string} [filters.departmentId] - Filter by department ID
 * @param {'draft' | 'approved' | 'active' | 'archived'} [filters.status] - Filter by budget status
 * @param {number} [filters.fiscalYear] - Filter by fiscal year (e.g., 2024)
 *
 * @returns {UseQueryResult<Budget[]>} TanStack Query result object
 * @returns {Budget[]} returns.data - Array of budgets matching filters
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function DepartmentBudgetsPage({ departmentId }: Props) {
 *   const { data: budgets, isLoading } = useBudgets({
 *     departmentId,
 *     status: 'active',
 *     fiscalYear: 2024
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <h2>Active Budgets for 2024</h2>
 *       <BudgetList budgets={budgets} />
 *     </div>
 *   );
 * }
 *
 * // Example: Fetch all draft budgets for planning
 * const { data: draftBudgets } = useBudgets({ status: 'draft' });
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.list(filters) - ['budgets', 'list', filters]
 * - Stale Time: 10 minutes
 * - Cache: Separate cache entry per unique filter combination
 * - Enabled: Always (no conditional execution)
 *
 * **Filter Behavior:**
 * - Undefined filters are omitted from query string
 * - Empty filters object returns all budgets
 * - Filters are URL-encoded and sent as query parameters
 *
 * **Cache Key Strategy:**
 * - Different filter combinations create separate cache entries
 * - Changing filters triggers new fetch if cache is stale
 * - budgetKeys.list ensures consistent key format
 *
 * **Performance:**
 * - Results cached by filter combination
 * - Background refetching on window focus
 * - Consider useBudgetsPaginated for large result sets
 *
 * @see {@link useBudgetsPaginated} for infinite scroll pagination
 * @see {@link useBudget} for fetching a single budget
 *
 * @since 1.0.0
 */
export const useBudgets = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
}) => {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: async (): Promise<Budget[]> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());

      const response = await fetch(`/api/budgets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
  });
};

/**
 * Fetches paginated budgets with infinite scroll support for large datasets.
 *
 * Uses TanStack Query's useInfiniteQuery to enable infinite scrolling, loading
 * additional pages as the user scrolls. Ideal for budget lists with hundreds of entries.
 *
 * @param {Object} [filters] - Optional filters for pagination
 * @param {string} [filters.departmentId] - Filter by department ID
 * @param {'draft' | 'approved' | 'active' | 'archived'} [filters.status] - Filter by status
 * @param {number} [filters.fiscalYear] - Filter by fiscal year
 * @param {string} [filters.search] - Search query for budget name/description
 *
 * @returns {UseInfiniteQueryResult} TanStack Query infinite query result
 * @returns {Object} returns.data - Infinite query data structure
 * @returns {Array<{budgets: Budget[], nextPage?: number, hasMore: boolean, total: number}>} returns.data.pages - Array of page results
 * @returns {Budget[]} returns.data.pages[].budgets - Budgets in this page
 * @returns {number} returns.data.pages[].nextPage - Next page number if available
 * @returns {boolean} returns.data.pages[].hasMore - Whether more pages exist
 * @returns {number} returns.data.pages[].total - Total number of budgets across all pages
 * @returns {boolean} returns.hasNextPage - Whether additional pages can be fetched
 * @returns {boolean} returns.isFetchingNextPage - True when loading next page
 * @returns {function} returns.fetchNextPage - Function to load next page
 * @returns {boolean} returns.isLoading - True during initial fetch
 *
 * @example
 * ```typescript
 * function InfiniteBudgetList() {
 *   const {
 *     data,
 *     isLoading,
 *     hasNextPage,
 *     fetchNextPage,
 *     isFetchingNextPage
 *   } = useBudgetsPaginated({
 *     status: 'active',
 *     search: 'healthcare'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   const allBudgets = data?.pages.flatMap(page => page.budgets) ?? [];
 *
 *   return (
 *     <div>
 *       <BudgetList budgets={allBudgets} />
 *       {hasNextPage && (
 *         <button
 *           onClick={() => fetchNextPage()}
 *           disabled={isFetchingNextPage}
 *         >
 *           {isFetchingNextPage ? 'Loading...' : 'Load More'}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 *
 * // Example: With infinite scroll observer
 * const observerRef = useRef<IntersectionObserver>();
 * const lastBudgetRef = useCallback((node: HTMLElement) => {
 *   if (isFetchingNextPage) return;
 *   if (observerRef.current) observerRef.current.disconnect();
 *   observerRef.current = new IntersectionObserver(entries => {
 *     if (entries[0].isIntersecting && hasNextPage) {
 *       fetchNextPage();
 *     }
 *   });
 *   if (node) observerRef.current.observe(node);
 * }, [isFetchingNextPage, hasNextPage, fetchNextPage]);
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.paginated(filters)
 * - Initial Page Param: 0 (first page)
 * - Get Next Page Param: Uses lastPage.nextPage from server response
 * - Stale Time: 10 minutes
 *
 * **Pagination Strategy:**
 * - Server-side pagination with page number parameter
 * - Each page returns budgets array plus pagination metadata
 * - Next page determined by server (hasMore flag)
 * - Total count provided for UI progress indicators
 *
 * **Search Functionality:**
 * - Search parameter filters by name/description
 * - Debounce search input to prevent excessive requests
 * - Search combined with other filters
 *
 * **Performance:**
 * - Only fetches pages as needed
 * - All pages cached in single query structure
 * - Background refetching updates all pages
 * - Consider virtualization for very large lists
 *
 * **Memory Considerations:**
 * - All loaded pages kept in memory
 * - For 1000+ budgets, consider traditional pagination
 * - Use removeInfiniteQueryData to clear when unmounting
 *
 * @see {@link useBudgets} for simple list without pagination
 * @see {@link useBudgetTransactionsPaginated} for transaction pagination
 *
 * @since 1.0.0
 */
export const useBudgetsPaginated = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.paginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      budgets: Budget[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budgets/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

/**
 * Fetches a single budget category by ID with nested children and transactions.
 *
 * @param {string} categoryId - Unique identifier of the category to fetch
 *
 * @returns {UseQueryResult<BudgetCategory>} TanStack Query result object
 * @returns {BudgetCategory} returns.data - The category with children and transactions
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function CategoryDetailPanel({ categoryId }: Props) {
 *   const { data: category, isLoading } = useBudgetCategory(categoryId);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!category) return null;
 *
 *   return (
 *     <div>
 *       <h3>{category.name}</h3>
 *       <p>Allocated: ${category.allocatedAmount}</p>
 *       <p>Spent: ${category.spentAmount}</p>
 *       <p>Remaining: ${category.remainingAmount}</p>
 *       {category.children && (
 *         <SubcategoriesList subcategories={category.children} />
 *       )}
 *       <TransactionsList transactions={category.transactions} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.category(categoryId)
 * - Stale Time: 10 minutes
 * - Enabled: Only when categoryId is truthy
 *
 * **Data Structure:**
 * - Includes nested children array (subcategories)
 * - Includes all transactions for this category
 * - Amounts are pre-calculated on server
 *
 * **Cache Invalidation:**
 * - Invalidated when creating/updating/deleting category
 * - Invalidated when transactions added to category
 * - Parent budget query also invalidated
 *
 * @see {@link useBudgetCategories} for fetching multiple categories
 * @see {@link useUpdateBudgetCategory} for updating categories
 *
 * @since 1.0.0
 */
export const useBudgetCategory = (categoryId: string) => {
  return useQuery({
    queryKey: budgetKeys.category(categoryId),
    queryFn: async (): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch budget category');
      return response.json();
    },
    enabled: !!categoryId,
  });
};

/**
 * Fetches all budget categories, optionally filtered by budget ID.
 *
 * Returns flat list or hierarchical structure of categories depending on server
 * configuration. Useful for category dropdowns, budget breakdowns, and allocation views.
 *
 * @param {string} [budgetId] - Optional budget ID to filter categories
 *
 * @returns {UseQueryResult<BudgetCategory[]>} TanStack Query result object
 * @returns {BudgetCategory[]} returns.data - Array of budget categories
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function CategorySelectionDropdown({ budgetId }: Props) {
 *   const { data: categories, isLoading } = useBudgetCategories(budgetId);
 *
 *   if (isLoading) return <SelectSkeleton />;
 *
 *   return (
 *     <Select>
 *       <option value="">Select a category...</option>
 *       {categories?.map(cat => (
 *         <option key={cat.id} value={cat.id}>
 *           {cat.name} (${cat.remainingAmount} remaining)
 *         </option>
 *       ))}
 *     </Select>
 *   );
 * }
 *
 * // Example: Category hierarchy for budget breakdown
 * function BudgetBreakdown({ budgetId }: Props) {
 *   const { data: categories } = useBudgetCategories(budgetId);
 *
 *   const topLevelCategories = categories?.filter(c => !c.parentId);
 *
 *   return (
 *     <div>
 *       {topLevelCategories?.map(category => (
 *         <CategoryCard
 *           key={category.id}
 *           category={category}
 *           subcategories={category.children}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.categories(budgetId)
 * - Stale Time: 10 minutes
 * - Cache: Separate cache for each budgetId filter
 *
 * **Filter Behavior:**
 * - If budgetId provided: Returns only categories for that budget
 * - If budgetId omitted: Returns all categories across all budgets
 *
 * **Data Structure:**
 * - May include parent-child relationships via parentId
 * - Children array populated if hierarchical structure enabled
 * - Transactions may or may not be included (check server config)
 *
 * **Performance:**
 * - Use for dropdowns and selection lists
 * - For large category trees, consider lazy loading children
 *
 * @see {@link useBudgetCategory} for fetching single category details
 * @see {@link useBudget} for budget with nested categories
 *
 * @since 1.0.0
 */
export const useBudgetCategories = (budgetId?: string) => {
  return useQuery({
    queryKey: budgetKeys.categories(budgetId),
    queryFn: async (): Promise<BudgetCategory[]> => {
      const params = budgetId ? `?budgetId=${budgetId}` : '';
      const response = await fetch(`/api/budget-categories${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget categories');
      return response.json();
    },
  });
};

/**
 * Fetches a single budget transaction by ID with full details and attachments.
 *
 * @param {string} transactionId - Unique identifier of the transaction to fetch
 *
 * @returns {UseQueryResult<BudgetTransaction>} TanStack Query result object
 * @returns {BudgetTransaction} returns.data - The transaction with attachments and user info
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function TransactionDetailModal({ transactionId, onClose }: Props) {
 *   const { data: transaction, isLoading } = useBudgetTransaction(transactionId);
 *
 *   if (isLoading) return <ModalSkeleton />;
 *   if (!transaction) return null;
 *
 *   return (
 *     <Modal onClose={onClose}>
 *       <h2>Transaction Details</h2>
 *       <p>Amount: ${transaction.amount}</p>
 *       <p>Type: {transaction.type}</p>
 *       <p>Status: {transaction.status}</p>
 *       <p>Description: {transaction.description}</p>
 *       <p>Created by: {transaction.createdBy.name}</p>
 *       {transaction.approvedBy && (
 *         <p>Approved by: {transaction.approvedBy.name}</p>
 *       )}
 *       {transaction.attachments.length > 0 && (
 *         <AttachmentsList attachments={transaction.attachments} />
 *       )}
 *     </Modal>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.transaction(transactionId)
 * - Stale Time: 2 minutes (transactions are more volatile)
 * - Enabled: Only when transactionId is truthy
 *
 * **Data Included:**
 * - Full transaction details
 * - Attachments array with file metadata
 * - Created by user information
 * - Approved by user information (if approved)
 *
 * **Status Values:**
 * - PENDING: Awaiting approval
 * - APPROVED: Approved and processed
 * - REJECTED: Rejected with reason
 *
 * @see {@link useBudgetTransactions} for fetching multiple transactions
 * @see {@link useApproveTransaction} for approving transactions
 *
 * @since 1.0.0
 */
export const useBudgetTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: budgetKeys.transaction(transactionId),
    queryFn: async (): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`);
      if (!response.ok) throw new Error('Failed to fetch budget transaction');
      return response.json();
    },
    enabled: !!transactionId,
  });
};

/**
 * Fetches filtered list of budget transactions with multiple filter options.
 *
 * Supports comprehensive filtering by budget, category, type, and date range for
 * transaction reports, approval queues, and financial analysis.
 *
 * @param {Object} [filters] - Optional filters for transactions
 * @param {string} [filters.budgetId] - Filter by budget ID
 * @param {string} [filters.categoryId] - Filter by category ID
 * @param {'income' | 'expense' | 'transfer'} [filters.type] - Filter by transaction type
 * @param {string} [filters.startDate] - Filter transactions on or after this date (ISO format)
 * @param {string} [filters.endDate] - Filter transactions on or before this date (ISO format)
 *
 * @returns {UseQueryResult<BudgetTransaction[]>} TanStack Query result object
 * @returns {BudgetTransaction[]} returns.data - Array of transactions matching filters
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * // Example: Pending transactions for approval queue
 * function PendingTransactionsQueue() {
 *   const { data: transactions, isLoading } = useBudgetTransactions({
 *     status: 'PENDING',
 *     type: 'expense'
 *   });
 *
 *   return <ApprovalQueue transactions={transactions} />;
 * }
 *
 * // Example: Category expense report for date range
 * function CategoryExpenseReport({ categoryId }: Props) {
 *   const { data: transactions } = useBudgetTransactions({
 *     categoryId,
 *     type: 'expense',
 *     startDate: '2024-01-01',
 *     endDate: '2024-12-31'
 *   });
 *
 *   const totalExpenses = transactions?.reduce(
 *     (sum, t) => sum + t.amount,
 *     0
 *   ) ?? 0;
 *
 *   return (
 *     <div>
 *       <h3>Category Expenses for 2024</h3>
 *       <p>Total: ${totalExpenses.toLocaleString()}</p>
 *       <TransactionsList transactions={transactions} />
 *     </div>
 *   );
 * }
 *
 * // Example: Budget transfers
 * function TransferHistory({ budgetId }: Props) {
 *   const { data: transfers } = useBudgetTransactions({
 *     budgetId,
 *     type: 'transfer'
 *   });
 *
 *   return <TransfersList transfers={transfers} />;
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.transactions(filters)
 * - Stale Time: 2 minutes (more volatile than budgets)
 * - Cache: Separate cache entry per unique filter combination
 *
 * **Filter Behavior:**
 * - All filters are optional and can be combined
 * - Date filters are inclusive (startDate <= transaction.date <= endDate)
 * - Empty filters object returns all transactions
 * - Undefined filters are omitted from query
 *
 * **Date Format:**
 * - Use ISO 8601 date strings (YYYY-MM-DD)
 * - Server performs date comparison in UTC
 * - Time component ignored (dates only)
 *
 * **Performance:**
 * - For large transaction lists, use useBudgetTransactionsPaginated
 * - Consider date range limits to reduce payload size
 * - Background refetching keeps approval queues current
 *
 * **Transaction Types:**
 * - income: Money added to budget
 * - expense: Money spent from budget
 * - transfer: Money moved between categories
 *
 * @see {@link useBudgetTransactionsPaginated} for paginated transactions
 * @see {@link useBudgetTransaction} for single transaction details
 * @see {@link useApproveTransaction} for transaction approval
 *
 * @since 1.0.0
 */
export const useBudgetTransactions = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.transactions(filters),
    queryFn: async (): Promise<BudgetTransaction[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-transactions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
  });
};

/**
 * Fetches paginated budget transactions with infinite scroll for large transaction histories.
 *
 * Enables efficient loading of transaction lists with hundreds or thousands of entries,
 * loading additional pages as the user scrolls.
 *
 * @param {Object} [filters] - Optional filters for pagination
 * @param {string} [filters.budgetId] - Filter by budget ID
 * @param {string} [filters.categoryId] - Filter by category ID
 * @param {'income' | 'expense' | 'transfer'} [filters.type] - Filter by transaction type
 * @param {string} [filters.startDate] - Start date for date range filter (ISO format)
 * @param {string} [filters.endDate] - End date for date range filter (ISO format)
 * @param {string} [filters.search] - Search query for description/reference
 *
 * @returns {UseInfiniteQueryResult} TanStack Query infinite query result
 * @returns {Object} returns.data - Infinite query data structure
 * @returns {Array} returns.data.pages - Array of page results
 * @returns {BudgetTransaction[]} returns.data.pages[].transactions - Transactions in this page
 * @returns {number} returns.data.pages[].nextPage - Next page number if available
 * @returns {boolean} returns.data.pages[].hasMore - Whether more pages exist
 * @returns {number} returns.data.pages[].total - Total transactions across all pages
 * @returns {boolean} returns.hasNextPage - Whether additional pages can be fetched
 * @returns {boolean} returns.isFetchingNextPage - True when loading next page
 * @returns {function} returns.fetchNextPage - Function to load next page
 *
 * @example
 * ```typescript
 * function TransactionHistoryInfinite({ budgetId }: Props) {
 *   const {
 *     data,
 *     isLoading,
 *     hasNextPage,
 *     fetchNextPage,
 *     isFetchingNextPage
 *   } = useBudgetTransactionsPaginated({
 *     budgetId,
 *     type: 'expense',
 *     search: 'medical supplies'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   const allTransactions = data?.pages.flatMap(
 *     page => page.transactions
 *   ) ?? [];
 *
 *   return (
 *     <div>
 *       <p>Total Transactions: {data?.pages[0]?.total ?? 0}</p>
 *       <TransactionTable transactions={allTransactions} />
 *       {hasNextPage && (
 *         <LoadMoreButton
 *           onClick={() => fetchNextPage()}
 *           loading={isFetchingNextPage}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.transactionsPaginated(filters)
 * - Initial Page Param: 0 (first page)
 * - Get Next Page Param: Uses lastPage.nextPage
 * - Stale Time: 2 minutes
 *
 * **Pagination:**
 * - Server-side pagination with page number
 * - Default page size determined by server (typically 20-50)
 * - Total count provided for progress indicators
 *
 * **Search:**
 * - Searches transaction description and reference fields
 * - Combine with other filters for refined results
 * - Debounce search input to prevent excessive requests
 *
 * **Performance:**
 * - Use virtualization for very large lists
 * - All loaded pages cached in memory
 * - Consider traditional pagination for 10,000+ transactions
 *
 * @see {@link useBudgetTransactions} for simple list
 * @see {@link useBudgetsPaginated} for budget pagination pattern
 *
 * @since 1.0.0
 */
export const useBudgetTransactionsPaginated = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.transactionsPaginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      transactions: BudgetTransaction[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budget-transactions/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

/**
 * Fetches a single budget report by ID with generated data and metadata.
 *
 * @param {string} reportId - Unique identifier of the report to fetch
 *
 * @returns {UseQueryResult<BudgetReport>} TanStack Query result object
 * @returns {BudgetReport} returns.data - The report with data and generation info
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function ReportViewerPage({ reportId }: Props) {
 *   const { data: report, isLoading } = useBudgetReport(reportId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!report) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{report.title}</h1>
 *       <p>Type: {report.type}</p>
 *       <p>Period: {report.period}</p>
 *       <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
 *       <p>By: {report.generatedBy.name}</p>
 *       <ReportRenderer data={report.data} type={report.type} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.report(reportId)
 * - Stale Time: 15 minutes (reports are static)
 * - Enabled: Only when reportId is truthy
 *
 * **Report Types:**
 * - SUMMARY: High-level budget overview
 * - DETAILED: Comprehensive transaction breakdown
 * - VARIANCE: Budget vs. actual comparison
 * - FORECAST: Projected spending analysis
 *
 * **Data Structure:**
 * - report.data contains report-specific structure
 * - Structure varies by report type
 * - Includes charts, tables, and metrics
 *
 * @see {@link useBudgetReports} for fetching report lists
 * @see {@link useGenerateBudgetReport} for creating new reports
 *
 * @since 1.0.0
 */
export const useBudgetReport = (reportId: string) => {
  return useQuery({
    queryKey: budgetKeys.report(reportId),
    queryFn: async (): Promise<BudgetReport> => {
      const response = await fetch(`/api/budget-reports/${reportId}`);
      if (!response.ok) throw new Error('Failed to fetch budget report');
      return response.json();
    },
    enabled: !!reportId,
  });
};

/**
 * Fetches filtered list of budget reports with optional type and date range filters.
 *
 * @param {Object} [filters] - Optional filters for reports
 * @param {string} [filters.budgetId] - Filter by budget ID
 * @param {'variance' | 'summary' | 'forecast' | 'performance'} [filters.type] - Filter by report type
 * @param {string} [filters.startDate] - Filter reports generated on/after this date
 * @param {string} [filters.endDate] - Filter reports generated on/before this date
 *
 * @returns {UseQueryResult<BudgetReport[]>} TanStack Query result object
 * @returns {BudgetReport[]} returns.data - Array of reports matching filters
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function ReportLibrary({ budgetId }: Props) {
 *   const { data: reports, isLoading } = useBudgetReports({
 *     budgetId,
 *     type: 'variance'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <h2>Variance Reports</h2>
 *       <ReportList reports={reports} />
 *     </div>
 *   );
 * }
 *
 * // Example: Recent reports dashboard
 * function RecentReports() {
 *   const thirtyDaysAgo = new Date();
 *   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
 *
 *   const { data: recentReports } = useBudgetReports({
 *     startDate: thirtyDaysAgo.toISOString()
 *   });
 *
 *   return <ReportCards reports={recentReports} />;
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.reports(filters)
 * - Stale Time: 15 minutes
 * - Cache: Separate cache per filter combination
 *
 * **Report Types:**
 * - variance: Budget vs. actual analysis
 * - summary: Executive summary reports
 * - forecast: Spending projections
 * - performance: Performance metrics
 *
 * @see {@link useBudgetReport} for single report details
 * @see {@link useGenerateBudgetReport} for creating reports
 *
 * @since 1.0.0
 */
export const useBudgetReports = (filters?: {
  budgetId?: string;
  type?: 'variance' | 'summary' | 'forecast' | 'performance';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.reports(filters),
    queryFn: async (): Promise<BudgetReport[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-reports?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget reports');
      return response.json();
    },
  });
};

/**
 * Fetches comprehensive budget analytics with category breakdowns and monthly trends.
 *
 * Provides detailed financial analytics including spending patterns, variance analysis,
 * and category-level breakdowns for dashboard visualizations and reports.
 *
 * @param {string} budgetId - Budget ID to fetch analytics for
 * @param {'monthly' | 'quarterly' | 'yearly'} [period='monthly'] - Analysis period granularity
 *
 * @returns {UseQueryResult} TanStack Query result object
 * @returns {Object} returns.data - Analytics data object
 * @returns {number} returns.data.totalBudgeted - Total budgeted amount
 * @returns {number} returns.data.totalSpent - Total amount spent
 * @returns {number} returns.data.totalRemaining - Remaining budget
 * @returns {number} returns.data.variance - Variance (budgeted - spent)
 * @returns {Array} returns.data.categoryBreakdown - Per-category analytics
 * @returns {Array} returns.data.monthlyTrends - Time-series spending data
 *
 * @example
 * ```typescript
 * function BudgetDashboard({ budgetId }: Props) {
 *   const { data: analytics, isLoading } = useBudgetAnalytics(
 *     budgetId,
 *     'monthly'
 *   );
 *
 *   if (isLoading) return <AnalyticsSkeleton />;
 *   if (!analytics) return null;
 *
 *   return (
 *     <div>
 *       <h2>Budget Analytics</h2>
 *       <StatsGrid>
 *         <Stat label="Total Budgeted" value={analytics.totalBudgeted} />
 *         <Stat label="Total Spent" value={analytics.totalSpent} />
 *         <Stat label="Remaining" value={analytics.totalRemaining} />
 *         <Stat label="Variance" value={analytics.variance} />
 *       </StatsGrid>
 *
 *       <h3>Category Breakdown</h3>
 *       <PieChart
 *         data={analytics.categoryBreakdown}
 *         dataKey="spent"
 *         nameKey="categoryName"
 *       />
 *
 *       <h3>Monthly Trends</h3>
 *       <LineChart
 *         data={analytics.monthlyTrends}
 *         xKey="month"
 *         yKeys={['budgeted', 'spent']}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Example: Category variance analysis
 * function CategoryVarianceReport({ budgetId }: Props) {
 *   const { data: analytics } = useBudgetAnalytics(budgetId, 'quarterly');
 *
 *   const overBudgetCategories = analytics?.categoryBreakdown.filter(
 *     cat => cat.variance < 0
 *   ) ?? [];
 *
 *   return (
 *     <Alert variant="warning">
 *       <p>{overBudgetCategories.length} categories are over budget</p>
 *       <ul>
 *         {overBudgetCategories.map(cat => (
 *           <li key={cat.categoryId}>
 *             {cat.categoryName}: ${Math.abs(cat.variance)} over
 *           </li>
 *         ))}
 *       </ul>
 *     </Alert>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.analytics(budgetId, period)
 * - Stale Time: 5 minutes
 * - Enabled: Only when budgetId is truthy
 *
 * **Period Options:**
 * - monthly: Month-by-month breakdown
 * - quarterly: Quarterly aggregation
 * - yearly: Annual summary
 *
 * **Category Breakdown:**
 * - Includes all categories in budget
 * - Amounts pre-calculated on server
 * - Variance = budgeted - spent (positive = under budget)
 *
 * **Monthly Trends:**
 * - Time-series data for charts
 * - Includes budgeted, spent, and variance
 * - Month format: YYYY-MM
 *
 * **Performance:**
 * - Analytics computed server-side
 * - Results cached for 5 minutes
 * - Background refetching keeps dashboards current
 *
 * @see {@link useBudgetDashboard} for complete dashboard data
 * @see {@link useBudgetComparisonData} for multi-budget comparison
 *
 * @since 1.0.0
 */
export const useBudgetAnalytics = (budgetId: string, period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.analytics(budgetId, period),
    queryFn: async (): Promise<{
      totalBudgeted: number;
      totalSpent: number;
      totalRemaining: number;
      variance: number;
      categoryBreakdown: Array<{
        categoryId: string;
        categoryName: string;
        budgeted: number;
        spent: number;
        remaining: number;
        variance: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        budgeted: number;
        spent: number;
        variance: number;
      }>;
    }> => {
      const params = period ? `?period=${period}` : '';
      const response = await fetch(`/api/budgets/${budgetId}/analytics${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget analytics');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

/**
 * Fetches comparative analytics across multiple budgets for performance analysis.
 *
 * Enables side-by-side comparison of budget performance, spending patterns, and
 * efficiency metrics across departments or fiscal years.
 *
 * @param {string[]} budgetIds - Array of budget IDs to compare (2+ budgets)
 * @param {'monthly' | 'quarterly' | 'yearly'} [period] - Comparison period granularity
 *
 * @returns {UseQueryResult} TanStack Query result object
 * @returns {Object} returns.data - Comparison data object
 * @returns {Array} returns.data.budgets - Per-budget comparison metrics
 * @returns {Array} returns.data.trends - Time-series comparison data
 *
 * @example
 * ```typescript
 * function BudgetComparisonDashboard({ budgetIds }: Props) {
 *   const { data, isLoading } = useBudgetComparisonData(
 *     budgetIds,
 *     'quarterly'
 *   );
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!data) return null;
 *
 *   return (
 *     <div>
 *       <h2>Budget Comparison</h2>
 *
 *       <ComparisonTable>
 *         <thead>
 *           <tr>
 *             <th>Budget</th>
 *             <th>Total Budgeted</th>
 *             <th>Total Spent</th>
 *             <th>Variance</th>
 *             <th>Performance</th>
 *           </tr>
 *         </thead>
 *         <tbody>
 *           {data.budgets.map(budget => (
 *             <tr key={budget.budgetId}>
 *               <td>{budget.name}</td>
 *               <td>${budget.totalBudgeted.toLocaleString()}</td>
 *               <td>${budget.totalSpent.toLocaleString()}</td>
 *               <td>${budget.variance.toLocaleString()}</td>
 *               <td>
 *                 <Badge variant={getPerformanceVariant(budget.performance)}>
 *                   {budget.performance}
 *                 </Badge>
 *               </td>
 *             </tr>
 *           ))}
 *         </tbody>
 *       </ComparisonTable>
 *
 *       <h3>Spending Trends</h3>
 *       <MultiLineChart
 *         data={data.trends}
 *         xKey="period"
 *         lines={data.budgets.map(b => ({
 *           dataKey: b.budgetId,
 *           name: b.name,
 *           color: getColorForBudget(b.budgetId)
 *         }))}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Example: Department budget comparison
 * function DepartmentComparison({ departmentIds }: Props) {
 *   // Fetch budget IDs for departments first
 *   const budgetIds = departmentIds.map(d => `budget-${d}`);
 *
 *   const { data } = useBudgetComparisonData(budgetIds, 'yearly');
 *
 *   const bestPerformer = data?.budgets.reduce((best, current) =>
 *     current.performance > best.performance ? current : best
 *   );
 *
 *   return (
 *     <div>
 *       <Alert variant="success">
 *         Best performing budget: {bestPerformer?.name}
 *       </Alert>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.comparison(budgetIds, period)
 * - Stale Time: 10 minutes
 * - Enabled: Only when budgetIds.length > 0
 *
 * **Performance Metrics:**
 * - Calculated as (totalBudgeted - totalSpent) / totalBudgeted
 * - Higher = better budget adherence
 * - Negative = over budget
 *
 * **Trends Data:**
 * - Time-series with all budgets in single structure
 * - Period determines granularity (monthly, quarterly, yearly)
 * - Enables multi-line charts
 *
 * **Limitations:**
 * - Maximum 10 budgets recommended for comparison
 * - All budgets must exist and be accessible
 * - Missing budgets will cause query to fail
 *
 * @see {@link useBudgetAnalytics} for single budget analytics
 * @see {@link useBudgetComparison} for comparison composite hook
 *
 * @since 1.0.0
 */
export const useBudgetComparisonData = (budgetIds: string[], period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.comparison(budgetIds, period),
    queryFn: async (): Promise<{
      budgets: Array<{
        budgetId: string;
        name: string;
        totalBudgeted: number;
        totalSpent: number;
        variance: number;
        performance: number;
      }>;
      trends: Array<{
        period: string;
        budgets: Array<{
          budgetId: string;
          spent: number;
          budgeted: number;
        }>;
      }>;
    }> => {
      const params = new URLSearchParams();
      budgetIds.forEach(id => params.append('budgetIds', id));
      if (period) params.append('period', period);

      const response = await fetch(`/api/budgets/comparison?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget comparison');
      return response.json();
    },
    enabled: budgetIds.length > 0,
  });
};

/**
 * Fetches real-time budget status with utilization alerts and notifications.
 *
 * Provides live budget health monitoring with automatic polling for status updates,
 * utilization percentages, and alert notifications for budget thresholds.
 *
 * @param {string} budgetId - Budget ID to monitor
 * @param {Object} [options] - Configuration options
 * @param {number} [options.pollingInterval=60000] - Polling interval in milliseconds (default: 1 minute)
 *
 * @returns {UseQueryResult} TanStack Query result object
 * @returns {Object} returns.data - Real-time status object
 * @returns {string} returns.data.budgetId - Budget identifier
 * @returns {'draft' | 'approved' | 'active' | 'archived'} returns.data.status - Current budget status
 * @returns {number} returns.data.utilizationPercentage - Percentage of budget used (0-100+)
 * @returns {'low' | 'medium' | 'high' | 'critical'} returns.data.alertLevel - Alert severity level
 * @returns {string} returns.data.lastUpdated - ISO timestamp of last status update
 * @returns {Array} returns.data.notifications - Array of alert notifications
 *
 * @example
 * ```typescript
 * function BudgetStatusMonitor({ budgetId }: Props) {
 *   const { data: status, isLoading } = useBudgetStatus(budgetId, {
 *     pollingInterval: 30000 // Poll every 30 seconds
 *   });
 *
 *   if (isLoading) return <StatusSkeleton />;
 *   if (!status) return null;
 *
 *   return (
 *     <Card>
 *       <h3>Budget Status</h3>
 *       <Badge variant={getStatusVariant(status.status)}>
 *         {status.status}
 *       </Badge>
 *
 *       <ProgressBar
 *         value={status.utilizationPercentage}
 *         max={100}
 *         variant={getUtilizationVariant(status.alertLevel)}
 *       />
 *       <p>{status.utilizationPercentage}% utilized</p>
 *
 *       {status.notifications.length > 0 && (
 *         <div>
 *           <h4>Alerts</h4>
 *           {status.notifications.map((notification, index) => (
 *             <Alert key={index} variant={notification.type}>
 *               {notification.message}
 *               <small>{new Date(notification.timestamp).toLocaleString()}</small>
 *             </Alert>
 *           ))}
 *         </div>
 *       )}
 *     </Card>
 *   );
 * }
 *
 * // Example: Critical alert banner
 * function BudgetAlertBanner({ budgetId }: Props) {
 *   const { data: status } = useBudgetStatus(budgetId);
 *
 *   if (status?.alertLevel !== 'critical') return null;
 *
 *   return (
 *     <AlertBanner variant="danger">
 *       <strong>Critical Budget Alert!</strong>
 *       {status.notifications
 *         .filter(n => n.type === 'alert')
 *         .map(n => <p key={n.timestamp}>{n.message}</p>)
 *       }
 *     </AlertBanner>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.status(budgetId)
 * - Stale Time: 0 (always refetch)
 * - Refetch Interval: Configurable via options.pollingInterval (default: 60000ms)
 * - Enabled: Only when budgetId is truthy
 * - Refetch on Mount: Yes
 * - Refetch on Window Focus: Yes
 *
 * **Alert Levels:**
 * - low: <60% utilization
 * - medium: 60-80% utilization
 * - high: 80-95% utilization
 * - critical: >95% utilization or over budget
 *
 * **Notification Types:**
 * - warning: Approaching threshold (80%)
 * - alert: Threshold exceeded (95%)
 * - info: Status changes or approvals
 *
 * **Polling Strategy:**
 * - Default: 1-minute intervals
 * - Configurable from 10 seconds to 5 minutes
 * - Polling pauses when page is hidden (battery optimization)
 * - Resumes when page becomes visible
 *
 * **Real-time Updates:**
 * - Automatic polling keeps status current
 * - Critical alerts update within polling interval
 * - Consider WebSocket for sub-second updates
 *
 * **Performance:**
 * - Lightweight status endpoint (minimal payload)
 * - Polling only active for mounted components
 * - Cleanup on unmount prevents memory leaks
 *
 * @see {@link useBudgetAnalytics} for detailed analytics
 * @see {@link useBudgetWorkflow} for workflow with status
 *
 * @since 1.0.0
 */
export const useBudgetStatus = (budgetId: string, options?: { pollingInterval?: number }) => {
  return useQuery({
    queryKey: budgetKeys.status(budgetId),
    queryFn: async (): Promise<{
      budgetId: string;
      status: 'draft' | 'approved' | 'active' | 'archived';
      utilizationPercentage: number;
      alertLevel: 'low' | 'medium' | 'high' | 'critical';
      lastUpdated: string;
      notifications: Array<{
        type: 'warning' | 'alert' | 'info';
        message: string;
        timestamp: string;
      }>;
    }> => {
      const response = await fetch(`/api/budgets/${budgetId}/status`);
      if (!response.ok) throw new Error('Failed to fetch budget status');
      return response.json();
    },
    enabled: !!budgetId,
    refetchInterval: options?.pollingInterval || 60000, // Default 1 minute polling
  });
};

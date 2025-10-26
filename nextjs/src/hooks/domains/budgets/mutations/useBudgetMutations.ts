/**
 * Budget Domain Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for modifying budget-related data including
 * budgets, categories, transactions, and reports. Implements optimistic updates, error
 * handling, cache invalidation, and user notifications.
 *
 * @module hooks/domains/budgets/mutations/useBudgetMutations
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 useMutation for data modifications
 * - Automatic cache invalidation on successful mutations
 * - Toast notifications (via sonner) for user feedback
 * - Optimistic updates where appropriate
 *
 * **Mutation Patterns:**
 * - Create operations: Invalidate list queries
 * - Update operations: Invalidate detail + list queries
 * - Delete operations: Remove from cache + invalidate lists
 * - Approval operations: Invalidate related entities
 *
 * **Cache Invalidation Strategy:**
 * - Granular: Invalidate specific query keys
 * - Cascading: Invalidate related data (budget → categories → transactions)
 * - Bulk: Invalidate all relevant queries for bulk operations
 *
 * **Error Handling:**
 * - Network errors caught and displayed via toast
 * - Error details included in error object
 * - Failed mutations do not invalidate cache
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetQueries} for data fetching hooks
 * @see {@link useBudgetComposites} for composite workflow hooks
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../config';
import type { Budget, BudgetCategory, BudgetTransaction, BudgetReport } from '../config';

/**
 * Creates a new budget with categories and allocations.
 *
 * Mutation hook for creating a budget. Automatically invalidates budget list queries
 * and displays success/error notifications.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 * @returns {function} returns.mutate - Mutation function
 * @returns {function} returns.mutateAsync - Async mutation function
 * @returns {boolean} returns.isPending - True when mutation is in progress
 * @returns {boolean} returns.isSuccess - True when mutation succeeded
 * @returns {boolean} returns.isError - True when mutation failed
 * @returns {Budget} returns.data - Created budget (on success)
 * @returns {Error} returns.error - Error object (on failure)
 *
 * @example
 * ```typescript
 * function CreateBudgetForm() {
 *   const createBudget = useCreateBudget();
 *   const [formData, setFormData] = useState({
 *     name: '',
 *     totalAmount: 0,
 *     fiscalYear: '2024'
 *   });
 *
 *   const handleSubmit = (e: FormEvent) => {
 *     e.preventDefault();
 *     createBudget.mutate({
 *       name: formData.name,
 *       description: 'Annual budget',
 *       totalAmount: formData.totalAmount,
 *       spentAmount: 0,
 *       remainingAmount: formData.totalAmount,
 *       currency: 'USD',
 *       fiscalYear: formData.fiscalYear,
 *       startDate: '2024-01-01',
 *       endDate: '2024-12-31',
 *       status: 'DRAFT',
 *       categories: [],
 *       owner: currentUser,
 *       department: 'health-services'
 *     }, {
 *       onSuccess: (newBudget) => {
 *         navigate(`/budgets/${newBudget.id}`);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
 *       <button type="submit" disabled={createBudget.isPending}>
 *         {createBudget.isPending ? 'Creating...' : 'Create Budget'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Mutation Function:**
 * - Accepts: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>
 * - Returns: Promise<Budget>
 * - POST /api/budgets
 *
 * **Cache Invalidation:**
 * - Invalidates budgetKeys.all (all budget queries)
 * - Refetches budget lists automatically
 *
 * **Notifications:**
 * - Success: "Budget '{name}' created successfully"
 * - Error: "Failed to create budget: {error message}"
 *
 * **Validation:**
 * - Server validates required fields
 * - totalAmount must be positive
 * - Date range must be valid
 *
 * @see {@link useUpdateBudget} for updating budgets
 * @see {@link useBudgetWorkflow} for complete budget workflow
 *
 * @since 1.0.0
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      if (!response.ok) throw new Error('Failed to create budget');
      return response.json();
    },
    onSuccess: (newBudget) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${newBudget.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create budget: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget's properties.
 *
 * Mutation hook for updating budget metadata, amounts, status, or other properties.
 * Supports partial updates. Invalidates budget detail and list queries.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 * @returns {function} returns.mutate - Mutation function accepting {budgetId, updates}
 * @returns {boolean} returns.isPending - True when mutation is in progress
 * @returns {Budget} returns.data - Updated budget (on success)
 *
 * @example
 * ```typescript
 * function BudgetEditForm({ budget }: { budget: Budget }) {
 *   const updateBudget = useUpdateBudget();
 *   const [name, setName] = useState(budget.name);
 *
 *   const handleSave = () => {
 *     updateBudget.mutate({
 *       budgetId: budget.id,
 *       updates: {
 *         name,
 *         description: 'Updated description'
 *       }
 *     }, {
 *       onSuccess: () => {
 *         toast.success('Budget saved');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <input value={name} onChange={e => setName(e.target.value)} />
 *       <button onClick={handleSave} disabled={updateBudget.isPending}>
 *         {updateBudget.isPending ? 'Saving...' : 'Save'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Mutation Function:**
 * - Accepts: {budgetId: string, updates: Partial<Budget>}
 * - Returns: Promise<Budget>
 * - PUT /api/budgets/:budgetId
 *
 * **Cache Invalidation:**
 * - Invalidates budgetKeys.detail(budgetId)
 * - Invalidates budgetKeys.all (list queries)
 *
 * **Partial Updates:**
 * - Only provided fields are updated
 * - Server merges updates with existing data
 *
 * @see {@link useCreateBudget} for creating budgets
 * @see {@link useApproveBudget} for approval workflow
 *
 * @since 1.0.0
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, updates }: {
      budgetId: string;
      updates: Partial<Budget>;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return response.json();
    },
    onSuccess: (updatedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${updatedBudget.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget permanently.
 *
 * Mutation hook for deleting a budget. Removes budget from cache and invalidates
 * related queries. Use with caution as this is a destructive operation.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 * @returns {function} returns.mutate - Mutation function accepting budgetId
 * @returns {boolean} returns.isPending - True when mutation is in progress
 *
 * @example
 * ```typescript
 * function DeleteBudgetButton({ budgetId }: { budgetId: string }) {
 *   const deleteBudget = useDeleteBudget();
 *   const [showConfirm, setShowConfirm] = useState(false);
 *
 *   const handleDelete = () => {
 *     deleteBudget.mutate(budgetId, {
 *       onSuccess: () => {
 *         navigate('/budgets');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowConfirm(true)}>Delete</button>
 *       {showConfirm && (
 *         <ConfirmDialog
 *           title="Delete Budget?"
 *           message="This action cannot be undone."
 *           onConfirm={handleDelete}
 *           onCancel={() => setShowConfirm(false)}
 *           loading={deleteBudget.isPending}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Mutation Function:**
 * - Accepts: budgetId (string)
 * - Returns: Promise<void>
 * - DELETE /api/budgets/:budgetId
 *
 * **Cache Management:**
 * - Removes budgetKeys.detail(budgetId) from cache
 * - Invalidates budgetKeys.all (list queries)
 * - Does NOT remove related categories/transactions
 *
 * **Cascading Deletion:**
 * - Server may cascade delete categories and transactions
 * - Client cache invalidation ensures consistency
 *
 * **Error Handling:**
 * - May fail if budget has dependencies
 * - Check server constraints before allowing deletion
 *
 * @see {@link useCreateBudget} for creating budgets
 * @see {@link useBulkDeleteBudgets} for bulk deletion
 *
 * @since 1.0.0
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string): Promise<void> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget');
    },
    onSuccess: (_, budgetId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success('Budget deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budget: ${error.message}`);
    },
  });
};

/**
 * Approves a budget, changing its status to ACTIVE.
 *
 * Mutation hook for budget approval workflow. Approves a draft budget, making it
 * active for transactions. Optionally records an approval note.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 * @returns {function} returns.mutate - Mutation function accepting {budgetId, approvalNote?}
 * @returns {boolean} returns.isPending - True when mutation is in progress
 * @returns {Budget} returns.data - Approved budget with updated status
 *
 * @example
 * ```typescript
 * function BudgetApprovalPanel({ budget }: { budget: Budget }) {
 *   const approveBudget = useApproveBudget();
 *   const [note, setNote] = useState('');
 *
 *   const handleApprove = () => {
 *     approveBudget.mutate({
 *       budgetId: budget.id,
 *       approvalNote: note
 *     }, {
 *       onSuccess: (approvedBudget) => {
 *         console.log('Budget approved:', approvedBudget.status); // 'ACTIVE'
 *       }
 *     });
 *   };
 *
 *   if (budget.status !== 'DRAFT') {
 *     return <p>Budget already {budget.status.toLowerCase()}</p>;
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Approve Budget</h3>
 *       <textarea
 *         placeholder="Approval note (optional)"
 *         value={note}
 *         onChange={e => setNote(e.target.value)}
 *       />
 *       <button onClick={handleApprove} disabled={approveBudget.isPending}>
 *         {approveBudget.isPending ? 'Approving...' : 'Approve Budget'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Mutation Function:**
 * - Accepts: {budgetId: string, approvalNote?: string}
 * - Returns: Promise<Budget>
 * - POST /api/budgets/:budgetId/approve
 *
 * **Status Transition:**
 * - Changes status from DRAFT → ACTIVE
 * - Sets approver field to current user
 * - Records approval timestamp
 *
 * **Cache Invalidation:**
 * - Invalidates budgetKeys.detail(budgetId)
 * - Invalidates budgetKeys.all (affects status filters)
 *
 * **Permissions:**
 * - Typically requires approver/admin role
 * - Server validates user permissions
 *
 * @see {@link useUpdateBudget} for general updates
 * @see {@link useBudgetWorkflow} for complete workflow
 *
 * @since 1.0.0
 */
export const useApproveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, approvalNote }: {
      budgetId: string;
      approvalNote?: string;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve budget');
      return response.json();
    },
    onSuccess: (approvedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${approvedBudget.name}" approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve budget: ${error.message}`);
    },
  });
};

/**
 * Creates a new budget category within a budget.
 *
 * @returns {UseMutationResult} Mutation result with mutate function
 *
 * @example
 * ```typescript
 * const createCategory = useCreateBudgetCategory();
 * createCategory.mutate({
 *   name: 'Medical Supplies',
 *   allocatedAmount: 25000,
 *   spentAmount: 0,
 *   remainingAmount: 25000
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates categories queries and budget details
 *
 * @see {@link useUpdateBudgetCategory}
 * @since 1.0.0
 */
export const useCreateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: Omit<BudgetCategory, 'id' | 'children' | 'transactions'>): Promise<BudgetCategory> => {
      const response = await fetch('/api/budget-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('Failed to create budget category');
      return response.json();
    },
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget category.
 *
 * @returns {UseMutationResult} Mutation result accepting {categoryId, updates}
 *
 * @example
 * ```typescript
 * const updateCategory = useUpdateBudgetCategory();
 * updateCategory.mutate({
 *   categoryId: 'cat-123',
 *   updates: { allocatedAmount: 30000 }
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates category detail, categories list, and parent budget
 *
 * @since 1.0.0
 */
export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, updates }: {
      categoryId: string;
      updates: Partial<BudgetCategory>;
    }): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget category');
      return response.json();
    },
    onSuccess: (updatedCategory, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success(`Category "${updatedCategory.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget category.
 *
 * @returns {UseMutationResult} Mutation result accepting categoryId
 *
 * @example
 * ```typescript
 * const deleteCategory = useDeleteBudgetCategory();
 * deleteCategory.mutate('cat-123');
 * ```
 *
 * @remarks
 * **Warning:** May cascade delete child categories and transactions
 * **Cache:** Removes category from cache and invalidates related queries
 *
 * @since 1.0.0
 */
export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string): Promise<void> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget category');
    },
    onSuccess: (_, categoryId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
};

/**
 * Creates a new budget transaction (income, expense, or transfer).
 *
 * @returns {UseMutationResult} Mutation result with transaction creation
 *
 * @example
 * ```typescript
 * const createTransaction = useCreateBudgetTransaction();
 * createTransaction.mutate({
 *   budgetId: 'budget-123',
 *   categoryId: 'cat-456',
 *   amount: 250,
 *   type: 'EXPENSE',
 *   description: 'First aid supplies',
 *   date: '2024-03-15',
 *   status: 'PENDING'
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates transactions, budget detail, and category queries
 * **Workflow:** Created transactions start in PENDING status awaiting approval
 *
 * @see {@link useApproveTransaction}
 * @since 1.0.0
 */
export const useCreateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: Omit<BudgetTransaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'approvedBy' | 'attachments'>): Promise<BudgetTransaction> => {
      const response = await fetch('/api/budget-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      return response.json();
    },
    onSuccess: (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(newTransaction.budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(newTransaction.categoryId) });
      toast.success('Transaction created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget transaction.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, updates}
 *
 * @example
 * ```typescript
 * const updateTransaction = useUpdateBudgetTransaction();
 * updateTransaction.mutate({
 *   transactionId: 'tx-123',
 *   updates: { description: 'Updated description', amount: 300 }
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates transaction detail, transactions list, budget, and category
 *
 * @since 1.0.0
 */
export const useUpdateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, updates }: {
      transactionId: string;
      updates: Partial<BudgetTransaction>;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      return response.json();
    },
    onSuccess: (updatedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(updatedTransaction.budgetId) });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget transaction.
 *
 * @returns {UseMutationResult} Mutation result accepting transactionId, returns {budgetId, categoryId}
 *
 * @example
 * ```typescript
 * const deleteTransaction = useDeleteBudgetTransaction();
 * deleteTransaction.mutate('tx-123');
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Removes transaction and invalidates budget/category to reflect updated amounts
 *
 * @since 1.0.0
 */
export const useDeleteBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string): Promise<{ budgetId: string; categoryId: string }> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      return response.json();
    },
    onSuccess: ({ budgetId, categoryId }, transactionId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
};

/**
 * Approves a pending transaction, applying it to budget.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, approvalNote?}
 *
 * @example
 * ```typescript
 * const approveTransaction = useApproveTransaction();
 * approveTransaction.mutate({
 *   transactionId: 'tx-123',
 *   approvalNote: 'Approved - valid expense'
 * });
 * ```
 *
 * @remarks
 * **Status Change:** PENDING → APPROVED
 * **Budget Impact:** Approved transactions affect budget/category amounts
 * **Cache:** Invalidates transaction, budget, and category queries
 *
 * @see {@link useRejectTransaction}
 * @since 1.0.0
 */
export const useApproveTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, approvalNote }: {
      transactionId: string;
      approvalNote?: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve transaction');
      return response.json();
    },
    onSuccess: (approvedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(approvedTransaction.budgetId) });
      toast.success('Transaction approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transaction: ${error.message}`);
    },
  });
};

/**
 * Rejects a pending transaction with a reason.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, rejectionReason}
 *
 * @example
 * ```typescript
 * const rejectTransaction = useRejectTransaction();
 * rejectTransaction.mutate({
 *   transactionId: 'tx-123',
 *   rejectionReason: 'Insufficient documentation'
 * });
 * ```
 *
 * @remarks
 * **Status Change:** PENDING → REJECTED
 * **Budget Impact:** Rejected transactions do NOT affect budget amounts
 *
 * @since 1.0.0
 */
export const useRejectTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, rejectionReason }: {
      transactionId: string;
      rejectionReason: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason }),
      });
      if (!response.ok) throw new Error('Failed to reject transaction');
      return response.json();
    },
    onSuccess: (rejectedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(rejectedTransaction.budgetId) });
      toast.success('Transaction rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject transaction: ${error.message}`);
    },
  });
};

/**
 * Generates a new budget report (summary, detailed, variance, or forecast).
 *
 * @returns {UseMutationResult} Mutation result accepting report configuration
 *
 * @example
 * ```typescript
 * const generateReport = useGenerateBudgetReport();
 * generateReport.mutate({
 *   budgetId: 'budget-123',
 *   type: 'VARIANCE',
 *   title: 'Q1 2024 Variance Report',
 *   period: '2024-Q1',
 *   includeTransactions: true,
 *   includeComparisons: true
 * });
 * ```
 *
 * @remarks
 * **Report Types:** SUMMARY, DETAILED, VARIANCE, FORECAST
 * **Generation:** Reports generated on-demand, cached for 15 minutes
 * **Cache:** Invalidates reports list queries
 *
 * @see {@link useBudgetReports}
 * @since 1.0.0
 */
export const useGenerateBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportConfig: {
      budgetId: string;
      type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
      title: string;
      period: string;
      includeTransactions?: boolean;
      includeComparisons?: boolean;
    }): Promise<BudgetReport> => {
      const response = await fetch('/api/budget-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success(`Report "${newReport.title}" generated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

/**
 * Deletes a generated budget report.
 *
 * @returns {UseMutationResult} Mutation result accepting reportId
 *
 * @example
 * ```typescript
 * const deleteReport = useDeleteBudgetReport();
 * deleteReport.mutate('report-123');
 * ```
 *
 * @since 1.0.0
 */
export const useDeleteBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string): Promise<void> => {
      const response = await fetch(`/api/budget-reports/${reportId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete report');
    },
    onSuccess: (_, reportId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.report(reportId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success('Report deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete report: ${error.message}`);
    },
  });
};

/**
 * Deletes multiple budgets in a single operation.
 *
 * @returns {UseMutationResult} Mutation result accepting budgetIds array
 *
 * @example
 * ```typescript
 * const bulkDelete = useBulkDeleteBudgets();
 * const selectedBudgets = ['budget-1', 'budget-2', 'budget-3'];
 * bulkDelete.mutate(selectedBudgets, {
 *   onSuccess: () => {
 *     console.log(`Deleted ${selectedBudgets.length} budgets`);
 *   }
 * });
 * ```
 *
 * @remarks
 * **Cache:** Removes all deleted budgets and invalidates budget lists
 * **Performance:** More efficient than individual delete operations
 *
 * @see {@link useDeleteBudget}
 * @since 1.0.0
 */
export const useBulkDeleteBudgets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetIds: string[]): Promise<void> => {
      const response = await fetch('/api/budgets/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetIds }),
      });
      if (!response.ok) throw new Error('Failed to delete budgets');
    },
    onSuccess: (_, budgetIds) => {
      budgetIds.forEach(id => {
        queryClient.removeQueries({ queryKey: budgetKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`${budgetIds.length} budgets deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budgets: ${error.message}`);
    },
  });
};

/**
 * Approves multiple transactions in a single operation.
 *
 * @returns {UseMutationResult} Mutation result accepting transactionIds array, returns approved transactions
 *
 * @example
 * ```typescript
 * const bulkApprove = useBulkApproveTransactions();
 * const pendingIds = ['tx-1', 'tx-2', 'tx-3'];
 * bulkApprove.mutate(pendingIds, {
 *   onSuccess: (approved) => {
 *     toast.success(`Approved ${approved.length} transactions`);
 *   }
 * });
 * ```
 *
 * @remarks
 * **Cascading Invalidation:** Invalidates all affected transactions, budgets, and categories
 * **Performance:** More efficient than individual approvals
 * **Atomic:** All succeed or all fail together
 *
 * @see {@link useApproveTransaction}
 * @since 1.0.0
 */
export const useBulkApproveTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionIds: string[]): Promise<BudgetTransaction[]> => {
      const response = await fetch('/api/budget-transactions/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds }),
      });
      if (!response.ok) throw new Error('Failed to approve transactions');
      return response.json();
    },
    onSuccess: (approvedTransactions, transactionIds) => {
      transactionIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      
      // Invalidate related budgets and categories
      const uniqueBudgetIds = [...new Set(approvedTransactions.map(t => t.budgetId))];
      const uniqueCategoryIds = [...new Set(approvedTransactions.map(t => t.categoryId))];
      
      uniqueBudgetIds.forEach(budgetId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      });
      
      uniqueCategoryIds.forEach(categoryId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      });
      
      toast.success(`${transactionIds.length} transactions approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transactions: ${error.message}`);
    },
  });
};

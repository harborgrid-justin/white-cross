/**
 * Budget Domain Composite Hooks
 *
 * Provides high-level composite hooks that orchestrate multiple queries and mutations
 * for complete budget workflows. Combines data fetching, mutations, and business logic
 * into unified interfaces for complex budget management operations.
 *
 * @module hooks/domains/budgets/composites
 *
 * @remarks
 * **Architecture:**
 * - Combines multiple query and mutation hooks
 * - Aggregates loading states and errors
 * - Provides unified action interfaces
 * - Implements workflow-specific business logic
 *
 * **Composite Patterns:**
 * - Budget Workflow: Complete budget management lifecycle
 * - Budget Planning: Planning and forecasting workflows
 * - Transaction Management: Transaction approval and processing
 * - Budget Dashboard: Performance metrics aggregation
 * - Budget Comparison: Multi-budget analysis
 *
 * **Benefits:**
 * - Simplified component code
 * - Consistent workflow patterns
 * - Centralized business logic
 * - Reduced boilerplate
 *
 * @see {@link useBudgetQueries} for query hooks
 * @see {@link useBudgetMutations} for mutation hooks
 *
 * @since 1.0.0
 */

// Workflow composites
export { useBudgetWorkflow } from './useBudgetWorkflowComposites';

// Planning composites
export { useBudgetPlanning } from './useBudgetPlanningComposites';

// Transaction composites
export { useTransactionManagement } from './useBudgetTransactionComposites';

// Dashboard composites
export { useBudgetDashboard } from './useBudgetDashboardComposites';

// Comparison composites
export { useBudgetComparison } from './useBudgetComparisonComposites';

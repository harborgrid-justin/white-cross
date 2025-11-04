/**
 * Optimistic Update Types
 *
 * Type definitions and interfaces for optimistic updates
 *
 * @module hooks/shared/optimisticUpdates/types
 */

/**
 * Context returned from optimistic update for rollback
 */
export interface OptimisticContext<T = any> {
  previousData: T | undefined;
  rollback: () => void;
}

/**
 * Optimistic Update Error and Settlement Handlers
 *
 * Generic handlers for rollback on error and query invalidation on settlement
 *
 * @module hooks/shared/optimisticUpdates/handlers
 */

import { QueryClient } from '@tanstack/react-query';
import { OptimisticContext } from './types';

/**
 * Generic optimistic update error handler
 */
export const handleOptimisticError = (
  error: any,
  context: OptimisticContext | undefined
) => {
  console.error('Mutation failed, rolling back optimistic update:', error);

  if (context?.rollback) {
    context.rollback();
  }
};

/**
 * Generic optimistic update settled handler
 * Invalidates related queries after mutation completes
 */
export const handleOptimisticSettled = (
  queryClient: QueryClient,
  queryKeysToInvalidate: any[][]
) => {
  return async () => {
    for (const queryKey of queryKeysToInvalidate) {
      await queryClient.invalidateQueries({ queryKey });
    }
  };
};

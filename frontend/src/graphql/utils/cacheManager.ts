/**
 * @fileoverview Apollo Cache Management Utilities
 *
 * Utilities for managing Apollo Client cache with HIPAA compliance
 *
 * @module graphql/utils/cacheManager
 * @since 1.0.0
 * @compliance HIPAA - No PHI in persisted cache
 */

import { ApolloCache, Reference, gql } from '@apollo/client';
import { getApolloClient } from '../client';

/**
 * Update cache after creating an item
 */
export const updateCacheAfterCreate = <T>(
  cache: ApolloCache<any>,
  queryName: string,
  newItem: T,
  typename: string
) => {
  cache.modify({
    fields: {
      [queryName]: (existingRefs = [], { readField }) => {
        const newRef = cache.writeFragment({
          data: newItem,
          fragment: gql`
            fragment New${typename} on ${typename} {
              id
            }
          `,
        });
        return [...existingRefs, newRef];
      },
    },
  });
};

/**
 * Update cache after deleting an item
 */
export const updateCacheAfterDelete = (
  cache: ApolloCache<any>,
  id: string,
  typename: string
) => {
  cache.evict({ id: cache.identify({ __typename: typename, id }) });
  cache.gc();
};

/**
 * Update cache after updating an item
 */
export const updateCacheAfterUpdate = <T>(
  cache: ApolloCache<any>,
  updatedItem: T,
  typename: string
) => {
  cache.writeFragment({
    id: cache.identify(updatedItem as any),
    fragment: gql`
      fragment Updated${typename} on ${typename} {
        id
      }
    `,
    data: updatedItem,
  });
};

/**
 * Clear all cache (for logout or sensitive data removal)
 * HIPAA Compliance: Clear all PHI from cache
 */
export const clearAllCache = async () => {
  const client = getApolloClient();
  await client.clearStore();
};

/**
 * Clear specific query from cache
 */
export const clearQueryCache = (queryName: string) => {
  const client = getApolloClient();
  client.cache.evict({ fieldName: queryName });
  client.cache.gc();
};

/**
 * Invalidate and refetch query
 */
export const invalidateQuery = async (queryName: string) => {
  const client = getApolloClient();
  await client.refetchQueries({
    include: [queryName],
  });
};

/**
 * Get cached item by ID
 */
export const getCachedItem = <T>(typename: string, id: string): T | null => {
  const client = getApolloClient();
  const itemRef = client.cache.identify({ __typename: typename, id });

  if (!itemRef) return null;

  return client.cache.readFragment({
    id: itemRef,
    fragment: gql`
      fragment Cached${typename} on ${typename} {
        id
      }
    `,
  }) as T;
};

/**
 * Check if item exists in cache
 */
export const isItemCached = (typename: string, id: string): boolean => {
  const client = getApolloClient();
  const itemRef = client.cache.identify({ __typename: typename, id });
  return !!itemRef;
};

/**
 * Optimistic response helper
 */
export const createOptimisticResponse = <T>(
  mutation: string,
  data: Partial<T>,
  typename: string
): any => {
  return {
    __typename: 'Mutation',
    [mutation]: {
      __typename: typename,
      id: 'temp-' + Date.now(),
      ...data,
    },
  };
};

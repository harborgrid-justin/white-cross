/**
 * @fileoverview GraphQL Types Module Index
 * @module types/graphql
 * @category Types
 *
 * Central export point for all GraphQL-related type definitions.
 * This module provides type-safe interfaces for GraphQL queries,
 * mutations, and their responses.
 */

// Export all response types
export * from './responses';

// Re-export commonly used types for convenience
export type {
  GraphQLResponse,
  GraphQLError,
  BaseMutationResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  QueryResponse,
  ListQueryResponse,
  PaginatedQueryResponse,
  BulkMutationResponse,
} from './responses';

/**
 * Response Builder Types
 *
 * TypeScript interfaces and types for OpenAPI response configuration,
 * including response options, headers, pagination, and error details.
 *
 * @module swagger/responses/types
 * @version 1.0.0
 */

import { Type } from '@nestjs/common';

/**
 * Options for response configuration
 */
export interface ResponseOptions {
  /** HTTP status code */
  status: number;
  /** Response description */
  description: string;
  /** Response type */
  type?: Type<unknown>;
  /** Whether response is array */
  isArray?: boolean;
  /** Response headers */
  headers?: Record<string, HeaderDefinition>;
  /** Content types */
  contentTypes?: string[];
  /** Example response */
  example?: unknown;
}

/**
 * Definition for response headers
 */
export interface HeaderDefinition {
  /** Header description */
  description: string;
  /** Header schema */
  schema?: unknown;
  /** Example value */
  example?: unknown;
  /** Whether header is required */
  required?: boolean;
}

/**
 * Metadata for paginated responses
 */
export interface PaginationMetadata {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total items */
  total: number;
  /** Total pages */
  totalPages: number;
  /** Has next page */
  hasNextPage: boolean;
  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * OpenAPI Schema Object for response definitions
 */
export interface SchemaObject {
  type?: string;
  properties?: Record<string, unknown>;
  items?: unknown;
  $ref?: string;
  example?: unknown;
  description?: string;
  required?: string[];
  enum?: unknown[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}